/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Evaluation Instant types (GROUND-134).
 *
 * Derived only. Not persisted.
 *
 * GROUND-133 RESOURCE_READINESS Observation-Context Binding Assessment
 * + explicit RESOURCE_READINESS Evaluation Instant Specification
 * → Explicit RESOURCE_READINESS Evaluation Instant only.
 *
 * Evaluation instant ≠ resource evidence assessment / readiness / schedule
 * Evaluation instant ≠ requirement temporal applicability / wall-clock now
 * One Candidate-level instant applies to all bindings in the context
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";

/**
 * Explicit evaluation instant for one exact observation Candidate RESOURCE_READINESS domain.
 * Does NOT supply binding/requirement/ResourceDeclaration keys (those come from GROUND-133).
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantInput {
  candidate_key: string;
  evaluation_at: string;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification {
  evaluation_instants: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantInput[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantEvalInput {
  resource_readiness_observation_context_binding_set: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification;
}

/**
 * Candidate-level RESOURCE_READINESS evaluation instant.
 * One instant applies to all bound resource-side evidence subjects for this context.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstant {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  evaluation_at: string;
}

export type AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  | "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
  | "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
  | "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT";

export type AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantModelLimitation =
  | "RESOURCE_DECLARATION_EXISTENCE_NOT_EVALUATED"
  | "RESOURCE_REQUIREMENT_TO_DECLARATION_MATCH_NOT_EVALUATED"
  | "OBSERVATION_RESOURCE_EVIDENCE_ASSESSMENT_NOT_MODELED"
  | "OBSERVATION_RESOURCE_TEMPORAL_APPLICABILITY_NOT_EVALUATED"
  | "OBSERVATION_RESOURCE_QUANTITY_SUFFICIENCY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_PARTIAL_FULFILLMENT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment {
  candidate_key: string;
  resource_readiness_observation_context_binding_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantStatus;
  resource_readiness_evaluation_instant: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstant | null;
  has_explicit_resource_readiness_evaluation_instant: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSetAssessment {
  resource_readiness_observation_context_binding_set: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment[];
  has_explicit_resource_readiness_evaluation_instants: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantModelLimitation[];
}
