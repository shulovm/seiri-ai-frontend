/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Dimension Satisfaction State types (GROUND-106).
 *
 * Derived only. Not persisted.
 *
 * GROUND-105 Permission Dimension Evaluation State Interpretation Basis
 * → Permission Dimension Satisfaction State only.
 *
 * SATISFIED / UNSATISFIED are explicit-policy-derived via 105 only.
 * policy absent ≠ UNSATISFIED
 * current-state unmapped ≠ UNSATISFIED
 * Satisfaction ≠ effective Permission / Operational Eligibility / can_execute
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSetAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-basis-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-105 only — not 103/104 direct / 093–101 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateInput {
  permission_dimension_evaluation_state_interpretation_basis_set: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSetAssessment;
}

/**
 * Canonical current Permission Dimension Satisfaction State surface.
 * Exactly four states.
 */
export type AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState =
  | "PERMISSION_DIMENSION_SATISFIED"
  | "PERMISSION_DIMENSION_UNSATISFIED"
  | "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE";

export interface AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  permission_dimension_satisfaction_state: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState;
  permission_dimension_evaluation_state_key: string;
  permission_dimension_evaluation_state_basis_key: string;
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState;
  permission_dimension_evaluation_state_interpretation_policy_key: string | null;
  permission_dimension_evaluation_state_interpretation_basis_key: string | null;
  interpretation: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation | null;
  interpretation_basis_status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus;
}

export interface AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateRecord {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  permission_dimension_satisfaction_state: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState;
  permission_dimension_satisfaction_state_basis_key: string;
}

export type AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "PERMISSION_DIMENSION_SATISFACTION_STATE_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_REQUIRED_COVERAGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_ACCEPTANCE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionStateAssessment {
  candidate_key: string;
  permission_dimension_evaluation_state_interpretation_basis_assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment;
  status: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateStatus;
  permission_dimension_satisfaction_state_basis: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasis | null;
  permission_dimension_satisfaction_state: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateRecord | null;
  has_permission_dimension_satisfaction_state: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSetAssessment {
  permission_dimension_evaluation_state_interpretation_basis_set: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionStateAssessment[];
  has_permission_dimension_satisfaction_states: boolean;
  has_resolved_permission_dimension_satisfaction_states: boolean;
  has_unresolved_permission_dimension_satisfaction_states: boolean;
  has_permission_dimension_satisfied_states: boolean;
  has_permission_dimension_unsatisfied_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateModelLimitation[];
}
