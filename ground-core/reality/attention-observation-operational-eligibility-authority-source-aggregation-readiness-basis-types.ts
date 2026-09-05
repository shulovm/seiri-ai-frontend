/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Aggregation Readiness Basis types (GROUND-124).
 *
 * Derived only. Not persisted.
 *
 * GROUND-121 AUTHORITY Source Acceptance Match
 * + GROUND-122 Explicit AUTHORITY Source Aggregation Policy
 * + GROUND-123 Explicit AUTHORITY Source Aggregation Readiness Policy
 * → AUTHORITY Source Aggregation Readiness Basis only.
 *
 * readiness HOLDS ≠ aggregation HOLDS ≠ AUTHORITY satisfied ≠ OE
 * readiness DOES_NOT_HOLD ≠ aggregation false ≠ vacuous truth ≠ ineligible
 * all NOT_LISTED may still be readiness HOLDS
 * policy absence ≠ readiness DOES_NOT_HOLD
 * zero matches → readiness DOES_NOT_HOLD → no aggregation execution
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchStatus,
} from "./attention-observation-operational-eligibility-authority-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes 121 + 122 + 123 — not 117–120 / 084-direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisInput {
  authority_source_acceptance_match_set: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment;
  authority_source_aggregation_policy_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment;
  authority_source_aggregation_readiness_policy_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySetAssessment;
}

/**
 * Exact structural readiness-condition outcomes only.
 * Not READY / NOT_READY / aggregation HOLDS / AUTHORITY SATISFIED.
 */
export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessCondition =
  | "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
  | "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD";

/**
 * Exact readiness Basis for a future AUTHORITY source aggregation execution.
 * Retains 121/122/123 lineage. Does not execute ANY/ALL.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  operational_eligibility_dimension_policy_key: string;
  authority_source_aggregation_policy_key: string;
  authority_source_aggregation_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
  authority_source_aggregation_readiness_policy_key: string;
  authority_source_aggregation_readiness_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind;
  current_authority_source_acceptance_match_keys: string[];
  current_authority_source_acceptance_match_status: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchStatus;
  readiness_condition: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessCondition;
}

export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  | "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT";

export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
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
 * Candidate-level readiness Basis assessment.
 * has_*_basis is record existence only — true for both HOLDS and DOES_NOT_HOLD.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment {
  candidate_key: string;
  authority_source_acceptance_match_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment;
  authority_source_aggregation_policy_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment;
  authority_source_aggregation_readiness_policy_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment;
  status: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisStatus;
  authority_source_aggregation_readiness_basis: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis | null;
  has_authority_source_aggregation_readiness_basis: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSetAssessment {
  authority_source_acceptance_match_set: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment;
  authority_source_aggregation_policy_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment;
  authority_source_aggregation_readiness_policy_set: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment[];
  has_authority_source_aggregation_readiness_bases: boolean;
  has_authority_source_aggregation_readiness_conditions_holding: boolean;
  has_authority_source_aggregation_readiness_conditions_not_holding: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisModelLimitation[];
}
