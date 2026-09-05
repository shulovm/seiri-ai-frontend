/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Dimension Evaluation State Interpretation Basis types (GROUND-129).
 *
 * Derived only. Not persisted.
 *
 * GROUND-127 current AUTHORITY Dimension Evaluation State
 * + GROUND-128 Explicit AUTHORITY Dimension Evaluation State Interpretation Policy
 * → AUTHORITY Dimension Evaluation State Interpretation Basis only.
 *
 * NO_POLICY ≠ NO_MAPPING
 * explicit empty policy → NO_MAPPING
 * Interpretation Basis ≠ Satisfaction State
 * INTERPRET_AS_* ≠ current SATISFIED / UNSATISFIED
 * no default HOLDS→SATISFIED / DOES_NOT_HOLD→UNSATISFIED
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-127 + 128 — not 125-direct / 118–126 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisInput {
  authority_dimension_evaluation_state_set: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment;
  authority_dimension_evaluation_state_interpretation_policy_set: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySetAssessment;
}

/**
 * Exact current-state mapping lookup statuses.
 * Not SATISFIED / UNSATISFIED / PASS / FAIL.
 */
export type AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
  | "AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT";

/**
 * Exact matched Interpretation Basis.
 * Record existence ≠ Satisfaction State.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_dimension_evaluation_state_key: string;
  authority_dimension_evaluation_state_basis_key: string;
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  authority_dimension_evaluation_state_interpretation_policy_key: string;
  matched_interpretation_mapping_key: string;
  interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation;
}

export type AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "LEGAL_AUTHORITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Candidate-level Interpretation Basis assessment.
 * has_*_basis is record existence only — true for both SATISFIED and UNSATISFIED interpretation tokens.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment {
  candidate_key: string;
  authority_dimension_evaluation_state_assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment;
  authority_dimension_evaluation_state_interpretation_policy_assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment;
  status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus;
  authority_dimension_evaluation_state_interpretation_basis: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasis | null;
  has_authority_dimension_evaluation_state_interpretation_basis: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSetAssessment {
  authority_dimension_evaluation_state_set: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment;
  authority_dimension_evaluation_state_interpretation_policy_set: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment[];
  has_authority_dimension_evaluation_state_interpretation_bases: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisModelLimitation[];
}
