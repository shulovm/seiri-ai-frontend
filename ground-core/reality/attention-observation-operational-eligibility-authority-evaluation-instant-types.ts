/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility AUTHORITY
 * Evaluation Instant types (GROUND-109).
 *
 * Derived only. Not persisted.
 *
 * GROUND-108 AUTHORITY Observation-Context Binding Assessment
 * + explicit AUTHORITY Evaluation Instant Specification
 * → Explicit AUTHORITY Evaluation Instant only.
 *
 * Evaluation instant ≠ Authority assessment / declaration active / polarity / OE
 * Evaluation instant ≠ schedule / wall-clock now / per-binding temporal split
 * No binding ≠ no instant (distinct statuses)
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
} from "./attention-observation-operational-eligibility-authority-observation-context-binding-types.js";

/**
 * Explicit evaluation instant for one exact observation Candidate Authority domain.
 * Does NOT supply holder/power/scope/binding keys (those come from GROUND-108).
 */
export interface AttentionObservationOperationalEligibilityAuthorityEvaluationInstantInput {
  candidate_key: string;
  authority_evaluation_at: string;
}

export interface AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification {
  evaluation_instants: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantInput[];
}

export interface AttentionObservationOperationalEligibilityAuthorityEvaluationInstantEvalInput {
  authority_observation_context_binding_set: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification;
}

/**
 * Candidate-level Authority evaluation instant.
 * One instant applies to all bound Authority contexts for this exact observation context.
 */
export interface AttentionObservationOperationalEligibilityAuthorityEvaluationInstant {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_evaluation_at: string;
}

export type AttentionObservationOperationalEligibilityAuthorityEvaluationInstantStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  | "EXPLICIT_AUTHORITY_EVALUATION_INSTANT_PRESENT";

export type AttentionObservationOperationalEligibilityAuthorityEvaluationInstantModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DECLARED_ASSESSMENT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_PROVENANCE_ASSESSMENT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment {
  candidate_key: string;
  authority_observation_context_binding_assessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment;
  status: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantStatus;
  authority_evaluation_instant: AttentionObservationOperationalEligibilityAuthorityEvaluationInstant | null;
  has_explicit_authority_evaluation_instant: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSetAssessment {
  authority_observation_context_binding_set: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment[];
  has_explicit_authority_evaluation_instants: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantModelLimitation[];
}
