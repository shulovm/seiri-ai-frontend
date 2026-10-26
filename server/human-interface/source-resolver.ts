import { readFileSync, statSync } from 'node:fs';
import { isAbsolute } from 'node:path';
import { loadProjectSnapshot } from '../../ground-core/file-store.js';
import { assertPersistenceMode, type CanonicalOwnerConfig } from '../../ground-core/storage-owner.js';
import { NotFoundError, ValidationError } from '../../ground-core/errors.js';
import { realitySourceRegistry, RealitySourceError, canonicalBaselineCommit } from './source-registry.js';

export const LIVE_PROJECT_ID = '088d09dc-dfc5-487a-8f8f-22d2b33a9249';
const liveIdentity = Object.freeze({ project_id: LIVE_PROJECT_ID, source_key: 'canonical-live-project',
  source_mode: 'mutable_canonical_storage' as const, source_qualification: 'canonical-live-project' });
export class LiveSourceError extends Error {
  constructor(public readonly code: string) { super(code); }
}
export interface SourceIdentity {
  project_id: string; source_key: string;
  source_mode: 'immutable_proof_snapshot' | 'mutable_canonical_storage'; source_qualification: string;
}
interface ResolverOptions {
  proofRegistry?: typeof realitySourceRegistry;
  // Server startup option only; presence explicitly enables the one registered live scope.
  runtimeConfigPath?: string;
}
// Same STORAGE-003 CanonicalOwnerConfig JSON used by owner-cli. There is no
// separate storage format/default/root setting and no acquisition of ownership.
function readRuntimeConfig(path: string): CanonicalOwnerConfig {
  try {
    if (!isAbsolute(path)) throw Error('absolute config path required');
    const config = JSON.parse(readFileSync(path, 'utf8')) as CanonicalOwnerConfig;
    if (config?.mode !== 'canonical-live' || typeof config.writerOwner !== 'string' || !config.writerOwner.trim()) throw Error('invalid live config');
    assertPersistenceMode(config);
    return config;
  } catch { throw new LiveSourceError('LIVE_RUNTIME_CONFIG_UNAVAILABLE'); }
}

export function createHumanSourceResolver({ proofRegistry = realitySourceRegistry, runtimeConfigPath }: ResolverOptions = {},
  // Server-only test seam: snapshot acquisition, never an HTTP selector.
  loadSnapshot: typeof loadProjectSnapshot = loadProjectSnapshot) {
  const proofSources: SourceIdentity[] = proofRegistry.sources.map(s => ({project_id:s.project_id,
    source_key:s.source_key, source_qualification:s.source_qualification, source_mode:'immutable_proof_snapshot'}));
  const liveEnabled = runtimeConfigPath !== undefined;
  if (liveEnabled && proofSources.some(s => s.project_id === liveIdentity.project_id || s.source_key === liveIdentity.source_key)) {
    throw new RealitySourceError('AMBIGUOUS_SOURCE_REGISTRY');
  }
  const sources = Object.freeze([...proofSources, ...(liveEnabled ? [liveIdentity] : [])].map(s => Object.freeze(s)));
  return Object.freeze({ sources,
    readSnapshot(projectId: string) {
      const identity = sources.find(s => s.project_id === projectId);
      if (!identity) throw new RealitySourceError('UNKNOWN_PROJECT');
      if (identity.source_mode === 'immutable_proof_snapshot') {
        const { source, state } = proofRegistry.read(projectId);
        return { state, source: { source_key: source.source_key, source_mode: identity.source_mode,
          source_qualification: source.source_qualification, snapshot_fingerprint: source.sha256,
          sha256: source.sha256, stored_schema_version: source.stored_schema,
          read_schema_version: state.schema_version, canonical_baseline_commit: canonicalBaselineCommit } };
      }
      const config = readRuntimeConfig(runtimeConfigPath!);
      try {
        if (!statSync(config.storageDir).isDirectory()) throw Error('root is not a directory');
      } catch (error) {
        if (['EACCES','EPERM'].includes((error as NodeJS.ErrnoException).code ?? '')) throw new LiveSourceError('LIVE_PERMISSION_DENIED');
        throw new LiveSourceError('LIVE_ROOT_UNAVAILABLE');
      }
      try {
        // Exactly one core acquisition. All response readers consume only its state.
        const snapshot = loadSnapshot(projectId, {mode:'canonical-live', storageDir:config.storageDir});
        return { state: snapshot.state, source: {source_key:identity.source_key, source_mode:identity.source_mode,
          source_qualification:identity.source_qualification, snapshot_fingerprint:snapshot.fingerprint,
          sha256:snapshot.fingerprint, stored_schema_version:snapshot.stored_schema_version,
          read_schema_version:snapshot.read_schema_version} };
      } catch (error) {
        if (['EACCES','EPERM'].includes((error as NodeJS.ErrnoException).code ?? '')) throw new LiveSourceError('LIVE_PERMISSION_DENIED');
        if (error instanceof NotFoundError) throw new LiveSourceError('LIVE_PROJECT_FILE_MISSING');
        if (error instanceof ValidationError && error.message === 'Stored Project ID does not match requested Project ID') throw new LiveSourceError('LIVE_PROJECT_ID_MISMATCH');
        // loadProjectSnapshot wraps identity errors with the existing core details.
        if (error instanceof ValidationError && error.details === 'Stored Project ID does not match requested Project ID') throw new LiveSourceError('LIVE_PROJECT_ID_MISMATCH');
        if (error instanceof ValidationError || error instanceof SyntaxError) throw new LiveSourceError('LIVE_SNAPSHOT_VALIDATION_FAILURE');
        throw new LiveSourceError('LIVE_READ_FAILURE');
      }
    },
  });
}
export type HumanSourceResolver = ReturnType<typeof createHumanSourceResolver>;
export const humanSourceResolver = createHumanSourceResolver({runtimeConfigPath:process.env.GROUND_RUNTIME_CONFIG});
export function asSourceResolver(source: HumanSourceResolver | typeof realitySourceRegistry): HumanSourceResolver {
  return 'readSnapshot' in source ? source : createHumanSourceResolver({proofRegistry:source});
}
