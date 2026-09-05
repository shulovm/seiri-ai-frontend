/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Dimension Evaluation State Interpretation Policy types (GROUND-104).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit interpretation-policy specification
 * → Explicit Permission Dimension Evaluation State Interpretation Policy only.
 *
 * GROUND-103 Evaluation State vocabulary is type-only.
 * Does NOT consume current GROUND-103 Evaluation State assessments.
 *
 * policy value ≠ current Satisfaction
 * HOLDS ≠ default SATISFIED
 * DOES_NOT_HOLD ≠ default UNSATISFIED
 * UNRESOLVED_* ≠ default UNSATISFIED
 * explicit empty policy ≠ policy absence
 * partial policy is valid
 * unusual mappings are valid
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.js";

/**
 * Policy declaration targets only.
 * Not current PERMISSION_DIMENSION_SATISFIED / UNSATISFIED.
 */
export type AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation =
  | "INTERPRET_AS_PERMISSION_DIMENSION_SATISFIED"
  | "INTERPRET_AS_PERMISSION_DIMENSION_UNSATISFIED";

/**
 * Atomic Evaluation State → interpretation pair.
 * One mapping per exact Evaluation State within one policy.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping {
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState;
  interpretation: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation;
}

/**
 * Specification entry. Context resolves via candidate_key against exact 084
 * assessments; capability_requirement_set_key is derived from 084 policy.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyInput {
  candidate_key: string;
  mappings: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[];
}

export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification {
  policies: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + specification — not current 103 / 093–101 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyEvalInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification;
}

/**
 * Runtime-only declarative interpretation policy.
 * No current Evaluation State / Interpretation Basis / Satisfaction State.
 */
export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  operational_eligibility_dimension_policy_key: string;
  mappings: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[];
}

export type AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
  | "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_NOT_MODELED"
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
 * Candidate-level declarative interpretation-policy assessment.
 * has_explicit_* means policy-record existence only — not current interpretation.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyStatus;
  permission_dimension_evaluation_state_interpretation_policy: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy | null;
  has_explicit_permission_dimension_evaluation_state_interpretation_policy: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment[];
  has_explicit_permission_dimension_evaluation_state_interpretation_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyModelLimitation[];
}
