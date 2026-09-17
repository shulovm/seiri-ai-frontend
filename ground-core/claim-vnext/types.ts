import type { Claim as LegacyClaim, ClaimEvidenceLink, ProjectState, EpistemicProvenance } from '../types.js';

/** Explicit opt-in version; the stable live API remains 0.1.25. */
export const SCHEMA_VERSION = '0.1.26' as const;
export type { LegacyClaim };
export interface ArtifactRef { artifact_key: string; sha256: string }
export interface DefinitionRef { id: string; version: string; artifact: ArtifactRef; pointer: string }
export type ManifestationScope = { kind: 'entity_only' } | {
  kind: 'frozen_artifact'; representation_kind: 'stored_inspection_excerpt';
  source_entity_id: string; artifact: ArtifactRef;
  selector: { collection_pointer: string; identity_field: string; identity_value: string; field_pointer: string };
  description: string;
};
export interface ClaimProposition extends Omit<LegacyClaim, 'confidence'> {
  contract: 'claim-proposition.v1'; predicate_ref: DefinitionRef; manifestation_scope: ManifestationScope;
}
export interface AssessorIdentity {
  kind: 'human' | 'organization' | 'ai_model' | 'system';
  entity_id?: string; external_id?: string; label?: string;
}
export interface EvidenceSnapshot {
  project_snapshot: { project_id: string; stored_schema_version: string; artifact: ArtifactRef };
  evidence_ids: string[]; observation_ids: string[];
  frozen_inputs: ArtifactRef[]; review_artifacts: ArtifactRef[];
}
export interface ClaimAssessment {
  id: string; project_id: string; claim_id: string; assessor: AssessorIdentity;
  purpose: 'proposition_epistemic_assessment'; method_ref: DefinitionRef; scale_ref: DefinitionRef;
  result: number; calibration_qualification: DefinitionRef; evidence_snapshot: EvidenceSnapshot;
  rationale: string; rationale_artifact?: ArtifactRef;
  assessed_at: string | null; recorded_at: string; created_at: string;
}
export interface ProjectStateVNext extends Omit<ProjectState, 'schema_version' | 'claims'> {
  schema_version: typeof SCHEMA_VERSION;
  claims: Array<LegacyClaim | ClaimProposition>;
  claim_assessments: ClaimAssessment[];
}
export interface StatePatchVNext {
  schema_version: typeof SCHEMA_VERSION; project_id: string; source: 'manual' | 'import' | 'human_review';
  operations: Array<
    { op: 'upsert'; entity: 'claim'; entity_id: string; payload: ClaimProposition } |
    { op: 'upsert'; entity: 'claim_assessment'; entity_id: string; payload: ClaimAssessment } |
    { op: 'upsert'; entity: 'claim_evidence_link'; entity_id: string; payload: ClaimEvidenceLink }
  >;
}
export function isProposition(c: LegacyClaim | ClaimProposition): c is ClaimProposition {
  return 'contract' in c && c.contract === 'claim-proposition.v1';
}
