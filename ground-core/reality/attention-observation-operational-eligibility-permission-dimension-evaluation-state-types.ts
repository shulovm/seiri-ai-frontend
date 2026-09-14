/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Dimension Evaluation State types (GROUND-103).
 *
 * Derived only. Not persisted.
 *
 * GROUND-101 Permission Source Aggregation Result Assessment
 * → Permission Dimension Evaluation State only.
 *
 * aggregation HOLDS ≠ SATISFIED
 * aggregation DOES_NOT_HOLD ≠ UNSATISFIED
 * readiness DOES_NOT_HOLD ≠ aggregation DOES_NOT_HOLD
 * 095 UNRESOLVED ≠ Evaluation State unresolved
 * Evaluation State ≠ Satisfaction ≠ effective Permission ≠ OE ≠ can_execute
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationResultSetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationResultStatus,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-result-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-101 only — not 094–100 direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInput {
  permission_source_aggregation_result_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultSetAssessment;
}

/**
 * Exact five canonical Permission Dimension Evaluation States.
 * Not SATISFIED / UNSATISFIED / PERMITTED / PROHIBITED / ELIGIBLE.
 */
export type AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState =
  | "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
  | "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  | "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED"
  | "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED"
  | "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

/**
 * Exact Evaluation State Basis with 101 lineage.
 * Record existence ≠ resolved ≠ HOLDS ≠ Satisfaction.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState;
  permission_source_aggregation_result_assessment_status: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultStatus;
  permission_source_aggregation_result_key: string | null;
  permission_source_aggregation_readiness_basis_key: string | null;
  permission_source_aggregation_policy_key: string | null;
  permission_source_aggregation_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind | null;
  current_permission_source_acceptance_match_keys: string[];
}

/**
 * Canonical current Evaluation State record.
 * One per applicable Candidate × Need × Requirement-set × PERMISSION.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateRecord {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState;
  permission_dimension_evaluation_state_basis_key: string;
}

export type AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "PERMISSION_DIMENSION_EVALUATION_STATE_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_INTERPRETATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_INTERPRETATION_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Candidate-level Evaluation State assessment.
 * has_*_state is record existence only — true for all five canonical states.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment {
  candidate_key: string;
  permission_source_aggregation_result_assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment;
  status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateStatus;
  permission_dimension_evaluation_state_basis: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasis | null;
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateRecord | null;
  has_permission_dimension_evaluation_state: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSetAssessment {
  permission_source_aggregation_result_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment[];
  has_permission_dimension_evaluation_states: boolean;
  has_resolved_permission_dimension_evaluation_states: boolean;
  has_unresolved_permission_dimension_evaluation_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateModelLimitation[];
}
