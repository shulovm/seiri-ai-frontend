import { requireTemporalInstant } from '../temporal.js';
import type { ProjectState, StatePatch, RealityEntity, EpistemicObservation, Evidence } from '../types.js';
export interface InspectionSpec { ids: {document:string; observation:string; evidence:string}; source: {id:string;title:string;url:string;locator:unknown}; reportRef:string; content:string; }
/** Shared record composition only. Selection and approved wording belong to the frozen package. */
export function composeInspection(state: ProjectState, recordedAt: string, spec: InspectionSpec): StatePatch {
  requireTemporalInstant(recordedAt);
  const ids = spec.ids;
  const timestamps = { created_at: recordedAt, updated_at: recordedAt };
  const provenance = {
    kind: 'document' as const,
    external_id: spec.reportRef,
    label: 'Stored Historical Round1 inspection report; researcher-authored paraphrase',
  };
  const document: RealityEntity = {
    id: ids.document, project_id: state.project.id, kind: 'document', label: spec.source.title,
    attrs: { source_id: spec.source.id, url: spec.source.url, locator: structuredClone(spec.source.locator) },
    ...timestamps,
  };
  const observation: EpistemicObservation = {
    id: ids.observation, project_id: state.project.id, kind: 'textual',
    content: spec.content,
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