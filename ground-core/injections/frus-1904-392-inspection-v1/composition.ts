import { createHash } from 'node:crypto';
import { requireTemporalInstant } from '../../temporal.js';
import type { ProjectState, StatePatch, RealityEntity, EpistemicObservation, Evidence } from '../../types.js';
// Frozen selection/validation only. The old Claim projection is never called.
import { loadFrozenInput, sha256, stableSerialize, TARGET_PROJECT, BOOTSTRAP_FINGERPRINT } from '../frus-1904-392/package.js';
export { TARGET_PROJECT, BOOTSTRAP_FINGERPRINT };
export const POLICY_VERSION = 'frus-392-stored-inspection-v1';
export const SOURCE_ID = 'frus:1904:392';
export const INPUT_KEY = 'c392-instruction';
export const REPORT_REF = 'round1.dataset.json#claims/c392-instruction';
export const SELECTED_SHA256 = '2c4f2e2b9e4530d077087994e043e42920d79621c704ec8dc05a48f6a7fd849d';
export const ID_KEYS = {
  document: `${POLICY_VERSION}:document:${SOURCE_ID}`,
  observation: `${POLICY_VERSION}:inspection-result:${SOURCE_ID}:${INPUT_KEY}`,
  evidence: `${POLICY_VERSION}:inspection-evidence:${SOURCE_ID}:${INPUT_KEY}`,
};
export function idsFor(projectId: string) {
  const id = (key: string) => {
    const h = createHash('sha256').update(`${projectId}\0${key}`).digest('hex');
    return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
  };
  return { document: id(ID_KEYS.document), observation: id(ID_KEYS.observation), evidence: id(ID_KEYS.evidence) };
}
export function input() {
  const selected = loadFrozenInput();
  if (sha256(stableSerialize(selected)) !== SELECTED_SHA256) throw new Error('Inspection input pin mismatch');
  const source = selected.sources[0], report = selected.claims[0];
  if (source.id !== SOURCE_ID || report.id !== INPUT_KEY || report.predicate !== 'instructed_to' || report.extraction.status !== 'researcher_paraphrase') throw new Error('Unexpected inspection report');
  const actor = selected.actors.find(a => a.id === report.subject_id);
  if (!actor) throw new Error('Missing subject label in recorded paraphrase');
  return { source, report, actor };
}

/** Explicit binding required. No clock, owner, mutation or save inside projection.
 * In dry review bind a labeled validation-only clock, never an alleged final recorded_at.
 */
export function buildInspectionPatch(state: ProjectState, recordedAt: string): StatePatch {
  if (state.project.id !== TARGET_PROJECT) throw new Error('Unexpected target');
  requireTemporalInstant(recordedAt);
  const { source, report, actor } = input();
  const ids = idsFor(state.project.id);
  const timestamps = { created_at: recordedAt, updated_at: recordedAt };
  const provenance = {
    kind: 'document' as const,
    external_id: REPORT_REF,
    label: 'Stored Historical Round1 inspection report; researcher-authored paraphrase',
  };
  const document: RealityEntity = {
    id: ids.document, project_id: state.project.id, kind: 'document', label: source.title,
    attrs: { source_id: source.id, url: source.url, locator: structuredClone(source.locator) },
    ...timestamps,
  };
  const observation: EpistemicObservation = {
    id: ids.observation, project_id: state.project.id, kind: 'textual',
    content: `Recorded researcher-authored paraphrase: ${actor.label} — instructed to ${report.object}.`,
    subject_ids: [ids.document], observed_at: null, recorded_at: recordedAt,
    provenance, ...timestamps,
  };
  const evidence: Evidence = {
    id: ids.evidence, project_id: state.project.id, kind: 'observation_ref',
    observation_id: ids.observation, external_ref: null,
    summary: 'Reference to the recorded document-inspection result.',
    provenance: structuredClone(provenance), recorded_at: recordedAt, ...timestamps,
  };
  return { schema_version: state.schema_version, project_id: state.project.id, source: 'import', operations: [
    { op: 'upsert', entity: 'reality_entity', entity_id: ids.document, payload: document },
    { op: 'upsert', entity: 'epistemic_observation', entity_id: ids.observation, payload: observation },
    { op: 'upsert', entity: 'evidence', entity_id: ids.evidence, payload: evidence },
  ] };
}
export interface CompletionReceipt {
  project_id: string;
  policy_version: typeof POLICY_VERSION;
  selected_input_sha256: string;
  recorded_at: string;
  record_hashes: Record<string, string>;
}
export type Preflight = 'NOT_APPLIED' | 'ALREADY_APPLIED_EXACT' | 'PARTIAL_OR_DIFFERENT';

/** Receipt creation belongs after successful future publication, not this projection. */
export function exactRecordHashes(state: ProjectState) {
  const ids = idsFor(state.project.id);
  return Object.fromEntries([
    [ids.document, state.reality_entities.find(r => r.id === ids.document)],
    [ids.observation, state.epistemic_observations.find(r => r.id === ids.observation)],
    [ids.evidence, state.evidence.find(r => r.id === ids.evidence)],
  ].map(([id, record]) => {
    if (!record) throw new Error('Missing expected record');
    return [id as string, sha256(stableSerialize(record))];
  }));
}
export function preflight(state: ProjectState, receipt?: CompletionReceipt): Preflight {
  if (state.project.id !== TARGET_PROJECT) return 'PARTIAL_OR_DIFFERENT';
  const ids = idsFor(state.project.id), known = new Set(Object.values(ids));
  const sourceUrl = input().source.url;
  const documents = state.reality_entities.filter(e => e.id === ids.document || e.attrs?.source_id === SOURCE_ID || e.attrs?.experimental_source_identity === SOURCE_ID || e.attrs?.url === sourceUrl);
  const observations = state.epistemic_observations.filter(o => o.id === ids.observation || o.subject_ids.includes(ids.document) || o.provenance.external_id === REPORT_REF || o.provenance.entity_id === ids.document);
  const evidence = state.evidence.filter(e => e.id === ids.evidence || e.observation_id === ids.observation || e.external_ref === sourceUrl || e.provenance.external_id === REPORT_REF || e.provenance.entity_id === ids.document);
  if (state.claims.some(c => c.subject_id === ids.document || c.provenance.entity_id === ids.document)
    || state.reality_events.some(e => e.subject_ids.includes(ids.document))
    || state.reality_states.some(s => s.subject_id === ids.document)
    || state.claim_evidence_links.some(l => l.evidence_id === ids.evidence)) return 'PARTIAL_OR_DIFFERENT';
  const allIdMatches = Object.values(state).filter(Array.isArray).flat().filter(r => r && known.has(r.id));
  if (![...documents, ...observations, ...evidence].length && !allIdMatches.length) return receipt ? 'PARTIAL_OR_DIFFERENT' : 'NOT_APPLIED';
  if (!receipt || documents.length !== 1 || observations.length !== 1 || evidence.length !== 1 || allIdMatches.length !== 3
    || documents[0].id !== ids.document || observations[0].id !== ids.observation || evidence[0].id !== ids.evidence
    || receipt.project_id !== TARGET_PROJECT || receipt.policy_version !== POLICY_VERSION || receipt.selected_input_sha256 !== SELECTED_SHA256) return 'PARTIAL_OR_DIFFERENT';
  try {
    const expected = buildInspectionPatch(state, receipt.recorded_at).operations;
    const actual = [documents[0], observations[0], evidence[0]];
    const hashes = exactRecordHashes(state);
    if (stableSerialize(Object.keys(receipt.record_hashes).sort()) !== stableSerialize(Object.keys(hashes).sort())) return 'PARTIAL_OR_DIFFERENT';
    for (let i = 0; i < actual.length; i++) {
      // Only core-generated updated_at comes from the exact completed receipt;
      // it is still compared by full record hash, never ignored globally.
      const { updated_at: _a, ...a } = actual[i];
      const { updated_at: _b, ...b } = expected[i].payload as typeof actual[number];
      if (stableSerialize(a) !== stableSerialize(b) || receipt.record_hashes[actual[i].id] !== hashes[actual[i].id]) return 'PARTIAL_OR_DIFFERENT';
    }
    return 'ALREADY_APPLIED_EXACT';
  } catch { return 'PARTIAL_OR_DIFFERENT'; }
}
