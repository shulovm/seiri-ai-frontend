/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Aggregation Policy types (GROUND-122).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit AUTHORITY Source Aggregation Policy Specification
 * → Explicit AUTHORITY Source Aggregation Policy only.
 *
 * Independent from GROUND-117 / 118 / 119 / 120 / 121.
 *
 * aggregation policy ≠ aggregation result
 * ANY / ALL ≠ current condition holds
 * policy absence ≠ ANY ≠ ALL
 * ANY/ALL ≠ zero-match / vacuous-truth semantics
 * aggregation policy ≠ acceptance criterion ≠ resolution ≠ coverage
 * NEGATIVE / NOT_LISTED ≠ hidden veto
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";

/**
 * Explicit future aggregation rule kinds only.
 * No VETO / MAJORITY / THRESHOLD / FIRST / LATEST.
 */
export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind =
  | "ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE"
  | "ALL_AUTHORITY_SOURCES_LISTED_AS_ACCEPTABLE";

/**
 * Specification entry. Context resolves via candidate_key against exact 084
 * assessments; observation_need_key / capability_requirement_set_key / policy
 * key are derived from GROUND-084 policy.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyInput {
  candidate_key: string;
  aggregation_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySpecification {
  policies: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + specification — not 117–121 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyEvalInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySpecification;
}

/**
 * Runtime-only declarative aggregation policy.
 * No source keys / match keys / current match count / current result.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  operational_eligibility_dimension_policy_key: string;
  aggregation_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
}

export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED"
  | "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED"
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
 * Candidate-level declarative aggregation-policy assessment.
 * has_explicit_* means policy-record existence only — not aggregation result.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  status: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyStatus;
  authority_source_aggregation_policy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy | null;
  has_explicit_authority_source_aggregation_policy: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment[];
  has_explicit_authority_source_aggregation_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyModelLimitation[];
}
