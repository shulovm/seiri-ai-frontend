/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Dimension Evaluation State types (GROUND-127).
 *
 * Derived only. Not persisted.
 *
 * GROUND-125 AUTHORITY Source Aggregation Result Assessment
 * → AUTHORITY Dimension Evaluation State only.
 *
 * aggregation HOLDS ≠ SATISFIED
 * aggregation DOES_NOT_HOLD ≠ UNSATISFIED
 * readiness DOES_NOT_HOLD ≠ aggregation DOES_NOT_HOLD
 * 119 UNRESOLVED ≠ Evaluation State unresolved
 * Evaluation State ≠ Satisfaction ≠ effective Authority ≠ OE ≠ can_execute
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultStatus,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-result-types.js";
import type {
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-125 only — not 117–124 direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInput {
  authority_source_aggregation_result_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSetAssessment;
}

/**
 * Exact five canonical AUTHORITY Dimension Evaluation States.
 * Not SATISFIED / UNSATISFIED / effective Authority / ELIGIBLE.
 */
export type AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue =
  | "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
  | "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  | "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED"
  | "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED"
  | "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

/**
 * Exact Evaluation State Basis with GROUND-125 lineage.
 * Record existence ≠ resolved ≠ HOLDS ≠ Satisfaction.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  authority_source_aggregation_result_assessment_status: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultStatus;
  authority_source_aggregation_result_key: string | null;
  authority_source_aggregation_readiness_basis_key: string | null;
  authority_source_aggregation_policy_key: string | null;
  authority_source_aggregation_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind | null;
  current_authority_source_acceptance_match_keys: string[];
}

/**
 * Canonical current Evaluation State record.
 * One per applicable Candidate × Need × Requirement-set × AUTHORITY.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  authority_dimension_evaluation_state_basis_key: string;
}

export type AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "AUTHORITY_DIMENSION_EVALUATION_STATE_PRESENT";

export type AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "LEGAL_AUTHORITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Candidate-level Evaluation State assessment.
 * has_*_state is record existence only — true for all five canonical states.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment {
  candidate_key: string;
  authority_source_aggregation_result_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment;
  status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateStatus;
  authority_dimension_evaluation_state_basis: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasis | null;
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState | null;
  has_authority_dimension_evaluation_state: boolean;
  has_resolved_authority_dimension_evaluation_state: boolean;
  has_unresolved_authority_dimension_evaluation_state: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment {
  authority_source_aggregation_result_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment[];
  has_authority_dimension_evaluation_states: boolean;
  has_resolved_authority_dimension_evaluation_states: boolean;
  has_unresolved_authority_dimension_evaluation_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateModelLimitation[];
}
