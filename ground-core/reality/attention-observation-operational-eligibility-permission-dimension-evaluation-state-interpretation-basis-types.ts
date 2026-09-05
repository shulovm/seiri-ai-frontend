/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Dimension Evaluation State Interpretation Basis types (GROUND-105).
 *
 * Derived only. Not persisted.
 *
 * GROUND-103 current Permission Dimension Evaluation State
 * + GROUND-104 Explicit Permission Dimension Evaluation State Interpretation Policy
 * → Permission Dimension Evaluation State Interpretation Basis only.
 *
 * NO_POLICY ≠ NO_MAPPING
 * explicit empty policy → NO_MAPPING
 * Interpretation Basis ≠ Satisfaction State
 * INTERPRET_AS_* ≠ current SATISFIED / UNSATISFIED
 * no default HOLDS→SATISFIED / DOES_NOT_HOLD→UNSATISFIED
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSetAssessment,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-103 + 104 — not 084-direct / 093–101 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisInput {
  permission_dimension_evaluation_state_set: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSetAssessment;
  permission_dimension_evaluation_state_interpretation_policy_set: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySetAssessment;
}

/**
 * Exact current-state mapping lookup statuses.
 * Not SATISFIED / UNSATISFIED / PASS / FAIL.
 */
export type AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
  | "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
  | "PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT";

/**
 * Exact matched Interpretation Basis.
 * Record existence ≠ Satisfaction State.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  permission_dimension_evaluation_state_key: string;
  permission_dimension_evaluation_state_basis_key: string;
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState;
  permission_dimension_evaluation_state_interpretation_policy_key: string;
  interpretation: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation;
}

export type AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisModelLimitation =
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
 * Candidate-level Interpretation Basis assessment.
 * has_*_basis is record existence only — true for both SATISFIED and UNSATISFIED interpretation tokens.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment {
  candidate_key: string;
  permission_dimension_evaluation_state_assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment;
  permission_dimension_evaluation_state_interpretation_policy_assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment;
  status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus;
  permission_dimension_evaluation_state_interpretation_basis: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasis | null;
  has_permission_dimension_evaluation_state_interpretation_basis: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSetAssessment {
  permission_dimension_evaluation_state_set: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSetAssessment;
  permission_dimension_evaluation_state_interpretation_policy_set: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment[];
  has_permission_dimension_evaluation_state_interpretation_bases: boolean;
  has_permission_dimension_interpretations_as_satisfied: boolean;
  has_permission_dimension_interpretations_as_unsatisfied: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisModelLimitation[];
}
