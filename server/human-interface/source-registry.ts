import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { normalizeProjectState } from '../../ground-core/migrate.js';
import { validateProjectState } from '../../ground-core/validate.js';
import { SCHEMA_VERSION } from '../../ground-core/types.js';

// Deployment-owned fixture metadata, not a canonical schema or HTTP input.
export interface RealitySourceMetadata {
  source_key: string; fixture_path: string; sha256: string;
  stored_schema: string; read_schema: string; project_id: string; entity_id: string;
  source_origin: string; source_qualification: string; purpose: string; known_limitations: readonly string[];
}
const root = new URL('../../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('fixtures/human-interface/source-registry.json', root), 'utf8')) as {
  canonical_baseline_commit: string; sources: RealitySourceMetadata[];
};
export class RealitySourceError extends Error {}

// Construction and byte-reader injection are server-only test seams. No filesystem discovery.
export function createRealitySourceRegistry(entries: readonly RealitySourceMetadata[],
  readBytes: (source: Readonly<RealitySourceMetadata>) => Buffer = source => readFileSync(new URL(source.fixture_path, root))) {
  const sources = entries.map(entry => Object.freeze({ ...entry, known_limitations: Object.freeze([...entry.known_limitations]) }));
  const projects = new Map<string, Readonly<RealitySourceMetadata>>();
  const keys = new Set<string>();
  for (const source of sources) {
    if (projects.has(source.project_id) || keys.has(source.source_key)) throw new RealitySourceError('AMBIGUOUS_SOURCE_REGISTRY');
    if (!/^fixtures\/human-interface\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/project-state\.json$/.test(source.fixture_path) ||
        !/^[a-f0-9]{64}$/.test(source.sha256)) throw new RealitySourceError('INVALID_SOURCE_REGISTRY');
    projects.set(source.project_id, source); keys.add(source.source_key);
  }
  function resolve(projectId: string) {
    const source = projects.get(projectId);
    if (!source) throw new RealitySourceError('UNKNOWN_PROJECT');
    return source;
  }
  return Object.freeze({
    sources: Object.freeze(sources), resolve,
    read(projectId: string) {
      const source = resolve(projectId);
      let bytes: Buffer;
      try { bytes = readBytes(source); } catch { throw new RealitySourceError('SOURCE_UNAVAILABLE'); }
      if (createHash('sha256').update(bytes).digest('hex') !== source.sha256) throw new RealitySourceError('FIXTURE_INTEGRITY_FAILURE');
      // Hash verification precedes JSON parsing and core normalization; no fallback or writes.
      const raw = JSON.parse(bytes.toString('utf8'));
      const state = normalizeProjectState(raw);
      if (raw.schema_version !== source.stored_schema || state.schema_version !== source.read_schema ||
          state.schema_version !== SCHEMA_VERSION || !validateProjectState(state).valid ||
          state.project.id !== source.project_id || !state.reality_entities.some(entity => entity.id === source.entity_id)) {
        throw new RealitySourceError('CANONICAL_SOURCE_INVALID');
      }
      return { source, state };
    },
  });
}
export const realitySourceRegistry = createRealitySourceRegistry(manifest.sources);
export const canonicalBaselineCommit = manifest.canonical_baseline_commit;
