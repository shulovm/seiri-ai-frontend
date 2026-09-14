/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Aggregation Result types (GROUND-125).
 *
 * Derived only. Not persisted.
 *
 * GROUND-121 AUTHORITY Source Acceptance Match
 * + GROUND-122 Explicit AUTHORITY Source Aggregation Policy
 * + GROUND-124 AUTHORITY Source Aggregation Readiness Basis
 * → AUTHORITY Source Aggregation Result only.
 *
 * Aggregation executes ONLY when readiness HOLDS.
 * readiness DOES_NOT_HOLD → no aggregation result (≠ aggregation DOES_NOT_HOLD)
 * aggregation HOLDS ≠ AUTHORITY satisfied ≠ OE ≠ can_execute
 * aggregation DOES_NOT_HOLD ≠ AUTHORITY unsatisfied ≠ ineligible
 * No vacuous ANY/ALL over empty match sets.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis-types.js";
import type {
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes 121 + 122 + 124 — not 123-direct / 117–120 / 084-direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultInput {
  authority_source_acceptance_match_set: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment;
  authority_source_aggregation_policy_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment;
  authority_source_aggregation_readiness_basis_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSetAssessment;
}

/**
 * Exact aggregation-condition outcomes only.
 * Not PASS / FAIL / ACCEPTED / REJECTED / SATISFIED / ELIGIBLE.
 */
export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationCondition =
  | "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
  | "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";

/**
 * Exact aggregation result authorized by an exact current readiness Basis.
 * Retains 121/122/124 lineage. Executes ANY/ALL only under readiness HOLDS.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationResult {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  operational_eligibility_dimension_policy_key: string;
  authority_source_aggregation_policy_key: string;
  authority_source_aggregation_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
  authority_source_aggregation_readiness_basis_key: string;
  authority_source_aggregation_readiness_policy_key: string;
  authority_source_aggregation_readiness_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind;
  current_authority_source_acceptance_match_keys: string[];
  aggregation_condition: AttentionObservationOperationalEligibilityAuthoritySourceAggregationCondition;
}

export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  | "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
  | "AUTHORITY_SOURCE_AGGREGATION_RESULT_PRESENT";

export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
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
 * Candidate-level aggregation Result assessment.
 * has_*_result is record existence only — true for both HOLDS and DOES_NOT_HOLD.
 * readiness DOES_NOT_HOLD → has_result false (no aggregation result).
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment {
  candidate_key: string;
  authority_source_acceptance_match_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment;
  authority_source_aggregation_policy_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment;
  authority_source_aggregation_readiness_basis_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment;
  status: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultStatus;
  authority_source_aggregation_result: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResult | null;
  has_authority_source_aggregation_result: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSetAssessment {
  authority_source_acceptance_match_set: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment;
  authority_source_aggregation_policy_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment;
  authority_source_aggregation_readiness_basis_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment[];
  has_authority_source_aggregation_results: boolean;
  has_authority_source_aggregation_conditions_holding: boolean;
  has_authority_source_aggregation_conditions_not_holding: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultModelLimitation[];
}
