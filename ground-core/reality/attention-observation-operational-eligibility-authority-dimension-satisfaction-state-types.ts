/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Dimension Satisfaction State types (GROUND-130).
 *
 * Derived only. Not persisted.
 *
 * GROUND-129 AUTHORITY Dimension Evaluation State Interpretation Basis
 * → AUTHORITY Dimension Satisfaction State only.
 *
 * SATISFIED / UNSATISFIED are explicit-policy-derived via 129 only.
 * NO_POLICY ≠ UNSATISFIED
 * NO_MAPPING ≠ UNSATISFIED
 * Satisfaction ≠ effective Authority / Operational Eligibility / can_execute
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-basis-types.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-types.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-129 only — not 127/128 direct / 118–126 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionInput {
  authority_dimension_evaluation_state_interpretation_basis_set: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSetAssessment;
}

/**
 * Canonical current AUTHORITY Dimension Satisfaction State surface.
 * Exactly four values.
 */
export type AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue =
  | "AUTHORITY_DIMENSION_SATISFIED"
  | "AUTHORITY_DIMENSION_UNSATISFIED"
  | "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE";

export interface AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  satisfaction_state: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue;
  authority_dimension_evaluation_state_key: string;
  authority_dimension_evaluation_state_basis_key: string;
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  authority_dimension_evaluation_state_interpretation_policy_key: string | null;
  authority_dimension_evaluation_state_interpretation_basis_key: string | null;
  matched_interpretation_mapping_key: string | null;
  interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation | null;
  interpretation_basis_status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus;
}

export interface AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState {
  key: string;
  basis_key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  satisfaction_state: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue;
}

export type AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "AUTHORITY_DIMENSION_SATISFACTION_STATE_PRESENT";

export type AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionModelLimitation =
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "LEGAL_AUTHORITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfactionAssessment {
  candidate_key: string;
  authority_dimension_evaluation_state_interpretation_basis_assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment;
  status: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStatus;
  authority_dimension_satisfaction_basis: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasis | null;
  authority_dimension_satisfaction_state: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState | null;
  has_authority_dimension_satisfaction_state: boolean;
  has_resolved_authority_dimension_satisfaction_state: boolean;
  has_unresolved_authority_dimension_satisfaction_state: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSetAssessment {
  authority_dimension_evaluation_state_interpretation_basis_set: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfactionAssessment[];
  has_authority_dimension_satisfaction_states: boolean;
  has_resolved_authority_dimension_satisfaction_states: boolean;
  has_unresolved_authority_dimension_satisfaction_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionModelLimitation[];
}
