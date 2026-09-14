import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { normalizeProjectState } from '../../ground-core/migrate.js';
import { validateProjectState } from '../../ground-core/validate.js';
import { SCHEMA_VERSION } from '../../ground-core/types.js';
import { getRealityWorldline } from '../../ground-core/reality/worldline.js';
import { getClaimsForSubject, getEvidenceForClaim, getObservationsForSubject } from '../../ground-core/reality/epistemic.js';

const directory = new URL('../../fixtures/human-interface/human-001/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', directory), 'utf8'));
const foundationHash = '863545f650835b2b36c283ed2455cfe6fc31f10fbad78ee8647dc264ae56ad6c';

export class HumanReadTransportError extends Error {
  constructor(public readonly status: number, public readonly code: string) {
    super(code);
  }
}

// The injected byte reader is a server-only test seam, never an HTTP parameter.
export function createHumanRealityReader(readBytes: () => Buffer = () => readFileSync(new URL('project-state.json', directory))) {
  return (projectId: string, entityId: string) => {
    if (projectId !== manifest.project_id) throw new HumanReadTransportError(404, 'PROJECT_SCOPE_MISMATCH');
    if (entityId !== manifest.entity_id) throw new HumanReadTransportError(404, 'ENTITY_NOT_FOUND');
    let bytes: Buffer;
    try { bytes = readBytes(); }
    catch { throw new HumanReadTransportError(503, 'FIXTURE_SOURCE_UNAVAILABLE'); }
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (manifest.sha256 !== foundationHash || hash !== manifest.sha256) {
      throw new HumanReadTransportError(503, 'FIXTURE_INTEGRITY_FAILURE');
    }
    // One verified buffer and one normalized ProjectState per request.
    const raw = JSON.parse(bytes.toString('utf8'));
    const state = normalizeProjectState(raw);
    const validation = validateProjectState(state);
    if (!validation.valid || state.schema_version !== SCHEMA_VERSION ||
        SCHEMA_VERSION !== manifest.canonical_contract_schema_version ||
        raw.schema_version !== manifest.snapshot_schema_version || state.project.id !== projectId) {
      throw new HumanReadTransportError(503, 'CANONICAL_SOURCE_INVALID');
    }
    const worldline = getRealityWorldline(state, entityId);
    const observations = getObservationsForSubject(state, entityId);
    const claims = getClaimsForSubject(state, entityId);
    const evidenceResults = claims.map(claim => getEvidenceForClaim(state, claim.id));
    return {
      transport: {
        contract: 'human-interface-reality-read.v1',
        source: { fixture: 'human-001', sha256: hash,
          stored_schema_version: raw.schema_version, read_schema_version: state.schema_version,
          canonical_baseline_commit: manifest.canonical_contract_commit },
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
