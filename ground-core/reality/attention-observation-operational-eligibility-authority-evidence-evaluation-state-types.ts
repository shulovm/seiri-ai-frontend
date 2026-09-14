/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Authority Evidence Evaluation State types (GROUND-113).
 *
 * Derived only. Not persisted.
 *
 * GROUND-111 Observation-Context AUTHORITY Provenance Assessment
 * → Authority Evidence Evaluation State only.
 *
 * Structured evidence normalization ≠ canonical Authority polarity
 * PRESENT/NOT_PRESENT ≠ positive/negative Authority
 * MULTIPLE ≠ stronger Authority
 */

import type {
  AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment,
  AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSetAssessment,
} from "./attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-types.js";
import type { DeclaredAuthorityStatus } from "./governance-types.js";
import type { AuthorityPower, GovernanceScope } from "../types.js";

export type AttentionObservationOperationalEligibilityAuthorityEvidencePresence =
  | "PRESENT"
  | "NOT_PRESENT";

export type AttentionObservationOperationalEligibilityAuthorityEvidenceMultiplicity =
  | "MULTIPLE"
  | "NOT_MULTIPLE";

export interface AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue {
  direct_declared_status: DeclaredAuthorityStatus;
  direct_provenance_path_presence: AttentionObservationOperationalEligibilityAuthorityEvidencePresence;
  delegated_provenance_path_presence: AttentionObservationOperationalEligibilityAuthorityEvidencePresence;
  active_source_basis_presence: AttentionObservationOperationalEligibilityAuthorityEvidencePresence;
  inactive_source_basis_presence: AttentionObservationOperationalEligibilityAuthorityEvidencePresence;
  inactive_delegation_presence: AttentionObservationOperationalEligibilityAuthorityEvidencePresence;
  contested_path_presence: AttentionObservationOperationalEligibilityAuthorityEvidencePresence;
  uncontested_path_presence: AttentionObservationOperationalEligibilityAuthorityEvidencePresence;
  direct_declaration_multiplicity: AttentionObservationOperationalEligibilityAuthorityEvidenceMultiplicity;
  delegated_path_multiplicity: AttentionObservationOperationalEligibilityAuthorityEvidenceMultiplicity;
}

export interface AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  observation_context_authority_provenance_assessment_key: string;
  observation_context_declared_authority_assessment_key: string;
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: AuthorityPower;
  governance_scope: GovernanceScope;
  governance_scope_key: string;
  authority_evaluation_instant_key: string;
  authority_evaluation_at: string;
  authority_provenance_assessment_canonical_key: string;
  authority_evidence_evaluation_state_value: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue;
}

export interface AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationState {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_holder_entity_id: string;
  authority_power: AuthorityPower;
  governance_scope_key: string;
  authority_evaluation_at: string;
  value: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue;
  authority_evidence_evaluation_state_basis_key: string;
}

export type AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  | "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT";

export type AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_INTERPRETATION_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment {
  candidate_key: string;
  observation_context_authority_provenance_assessment: AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment;
  status: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateStatus;
  authority_evidence_evaluation_state_bases: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis[];
  authority_evidence_evaluation_states: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationState[];
  has_authority_evidence_evaluation_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateEvalInput {
  observation_context_authority_provenance_assessment_set: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSetAssessment;
}

export interface AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSetAssessment {
  observation_context_authority_provenance_assessment_set: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment[];
  has_authority_evidence_evaluation_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateModelLimitation[];
}
