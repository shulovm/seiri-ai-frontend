/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Observation-Context AUTHORITY Provenance Assessment types (GROUND-111).
 *
 * Derived only. Not persisted.
 *
 * GROUND-110 Observation-Context Declared AUTHORITY Assessment
 * + ProjectState
 * + existing GROUND-020 assessAuthorityProvenance
 * → Observation-Context AUTHORITY Provenance Assessment only.
 *
 * Provenance ≠ canonical/effective Authority / OE / Satisfaction
 * Direct declared assessment (110) and provenance (111) remain sibling facts
 * Delegation path ≠ effective Authority; contest ≠ revocation
 */

import type {
  AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSetAssessment,
} from "./attention-observation-operational-eligibility-observation-context-declared-authority-assessment-types.js";
import type { AuthorityProvenanceAssessment } from "./governance-types.js";
import type { AuthorityPower, GovernanceScope, ProjectState } from "../types.js";

export interface AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  observation_context_declared_authority_assessment_key: string;
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: AuthorityPower;
  governance_scope: GovernanceScope;
  governance_scope_key: string;
  authority_evaluation_instant_key: string;
  authority_evaluation_at: string;
  authority_provenance_assessment: AuthorityProvenanceAssessment;
}

export type AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  | "OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENTS_PRESENT";

export type AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_SEMANTIC_INTERPRETATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment {
  candidate_key: string;
  observation_context_declared_authority_assessment: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment;
  status: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentStatus;
  observation_context_authority_provenance_assessments: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment[];
  has_observation_context_authority_provenance_assessments: boolean;
  has_direct_authority_provenance_paths: boolean;
  has_delegated_authority_provenance_paths: boolean;
  has_contested_authority_provenance_paths: boolean;
  model_limitations: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentEvalInput {
  project_state: ProjectState;
  observation_context_declared_authority_assessment_set: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSetAssessment;
}

export interface AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSetAssessment {
  observation_context_declared_authority_assessment_set: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment[];
  has_observation_context_authority_provenance_assessments: boolean;
  has_direct_authority_provenance_paths: boolean;
  has_delegated_authority_provenance_paths: boolean;
  has_contested_authority_provenance_paths: boolean;
  model_limitations: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentModelLimitation[];
}
