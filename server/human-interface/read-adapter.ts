import { getRealityWorldline } from '../../ground-core/reality/worldline.js';
import { getClaimsForSubject, getEvidenceForClaim, getObservationsForSubject } from '../../ground-core/reality/epistemic.js';
import { realitySourceRegistry, RealitySourceError } from './source-registry.js';

import { asSourceResolver, humanSourceResolver, LiveSourceError, type HumanSourceResolver } from './source-resolver.js';

export class HumanReadTransportError extends Error {
  constructor(public readonly status: number, public readonly code: string) {
    super(code);
  }
}

function readVerifiedProject(registry: HumanSourceResolver, projectId: string) {
  try {
    return registry.readSnapshot(projectId);
  } catch (error) {
    if (error instanceof LiveSourceError) throw new HumanReadTransportError(503, error.code);
    if (error instanceof RealitySourceError) {
      const codes: Record<string, string> = {
        UNKNOWN_PROJECT: 'PROJECT_SCOPE_MISMATCH',
        SOURCE_UNAVAILABLE: 'FIXTURE_SOURCE_UNAVAILABLE',
        FIXTURE_INTEGRITY_FAILURE: 'FIXTURE_INTEGRITY_FAILURE',
        CANONICAL_SOURCE_INVALID: 'CANONICAL_SOURCE_INVALID',
      };
      const code = codes[error.message];
      if (code) throw new HumanReadTransportError(code === 'PROJECT_SCOPE_MISMATCH' ? 404 : 503, code);
    }
    // Parse/normalization and unexpected failures reach the HTTP read-failure boundary.
    throw error;
  }
}

// Registry injection is server-only; HTTP accepts project/entity IDs, never sources or paths.
export function createHumanRealityReader(sourceResolver: HumanSourceResolver | typeof realitySourceRegistry = humanSourceResolver) {
  const registry = asSourceResolver(sourceResolver);
  return (projectId: string, entityId: string) => {
    const { source, state } = readVerifiedProject(registry, projectId);
    if (!state.reality_entities.some(entity => entity.id === entityId && entity.project_id === state.project.id)) {
      throw new HumanReadTransportError(404, 'ENTITY_NOT_IN_SNAPSHOT');
    }
    // All canonical readers share this one verified, normalized ProjectState.
    const worldline = getRealityWorldline(state, entityId);
    const observations = getObservationsForSubject(state, entityId);
    const claims = getClaimsForSubject(state, entityId);
    const evidenceResults = claims.map(claim => getEvidenceForClaim(state, claim.id));
    return {
      transport: {
        contract: 'human-interface-reality-read.v1',
        source: { ...source, ...(source.source_mode === 'immutable_proof_snapshot' ? {fixture:source.source_key} : {}) },
        requested_scope: { project_id: projectId, entity_id: entityId },
        returned_counts: { observations: observations.length, claims: claims.length,
          events: worldline.events.length, states: worldline.states.length },
      },
      canonical_records: { project: state.project, entity: worldline.entity, observations, claims },
      core_read_results: { worldline, evidence_for_claim: evidenceResults },
    };
  };
}

export const readHumanReality = createHumanRealityReader();
// Transport-only structural type, not a GROUND canonical schema/type.
export type HumanRealityReadTransport = ReturnType<typeof readHumanReality>;

// Catalog is registry metadata only: no bytes read or canonical content claimed.
export function createHumanBrowseReader(sourceResolver: HumanSourceResolver | typeof realitySourceRegistry = humanSourceResolver) {
  const registry = asSourceResolver(sourceResolver);
  return {
    catalog() {
      return {
        transport: { contract: 'human-interface-project-catalog.v1' },
        registered_projects: registry.sources.map(source => ({ project_id: source.project_id,
          source_key: source.source_key, source_mode: source.source_mode, source_qualification: source.source_qualification })),
      };
    },
    project(projectId: string) {
      const { source, state } = readVerifiedProject(registry, projectId);
      return {
        transport: {
          contract: 'human-interface-project-browse.v1',
          source,
          requested_scope: { project_id: projectId },
        },
        canonical_project: state.project,
        // Transport projection of existing identity fields, not a new canonical type.
        // Stored collection order is preserved; no semantic ordering is asserted.
        canonical_entities: state.reality_entities.map(({ id, project_id, kind, label }) => ({ id, project_id, kind, label })),
      };
    },
  };
}
export const humanBrowseReader = createHumanBrowseReader();
export type HumanProjectCatalogTransport = ReturnType<typeof humanBrowseReader.catalog>;
export type HumanProjectBrowseTransport = ReturnType<typeof humanBrowseReader.project>;
