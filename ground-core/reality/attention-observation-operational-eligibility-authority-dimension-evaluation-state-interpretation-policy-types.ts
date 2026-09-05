/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Dimension Evaluation State Interpretation Policy types (GROUND-128).
 *
 * Derived only. Not persisted.
 *
 * GROUND-127 AUTHORITY Dimension Evaluation State context
 * + explicit interpretation-policy specification
 * → Explicit AUTHORITY Dimension Evaluation State Interpretation Policy only.
 *
 * GROUND-127 Evaluation State vocabulary is type-only for mapping sources.
 * Does NOT consume current GROUND-127 State for mapping lookup.
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
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-types.js";

/**
 * Policy declaration targets only.
 * Not current AUTHORITY_DIMENSION_SATISFIED / UNSATISFIED.
 */
export type AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation =
  | "INTERPRET_AS_AUTHORITY_DIMENSION_SATISFIED"
  | "INTERPRET_AS_AUTHORITY_DIMENSION_UNSATISFIED";

/**
 * Atomic Evaluation State → interpretation pair.
 * One mapping per exact Evaluation State within one policy.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping {
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation;
}

/**
 * Specification entry. Context resolves via candidate_key against exact GROUND-127
 * assessments; stable need/set keys derive from GROUND-127 lineage.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyInput {
  candidate_key: string;
  mappings: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[];
}

export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification {
  policies: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-127 + specification — not current 125–126 direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyEvalInput {
  authority_dimension_evaluation_state_set: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification;
}

/**
 * Runtime-only declarative interpretation policy.
 * No current Evaluation State lookup / Interpretation Basis / Satisfaction State.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  operational_eligibility_dimension_policy_key: string;
  mappings: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[];
}

export type AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
  | "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyModelLimitation =
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
 * Candidate-level declarative interpretation-policy assessment.
 * has_explicit_* means policy-record existence only — not current interpretation.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment {
  candidate_key: string;
  authority_dimension_evaluation_state_assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment;
  status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyStatus;
  authority_dimension_evaluation_state_interpretation_policy: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy | null;
  has_explicit_authority_dimension_evaluation_state_interpretation_policy: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySetAssessment {
  authority_dimension_evaluation_state_set: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment[];
  has_explicit_authority_dimension_evaluation_state_interpretation_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyModelLimitation[];
}
