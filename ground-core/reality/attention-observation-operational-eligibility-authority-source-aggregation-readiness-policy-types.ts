/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Aggregation Readiness Policy types (GROUND-123).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit AUTHORITY Aggregation Readiness Policy Specification
 * → Explicit AUTHORITY Source Aggregation Readiness Policy only.
 *
 * Independent from GROUND-117 / 118 / 119 / 120 / 121 / 122.
 *
 * readiness policy ≠ current readiness condition
 * policy PRESENT ≠ readiness HOLDS
 * policy absence ≠ readiness DOES_NOT_HOLD
 * non-empty match-set rule ≠ current match inspection
 * LISTED / NOT_LISTED ≠ readiness / unreadiness
 * UNRESOLVED ≠ unreadiness
 * readiness policy ≠ aggregation policy ≠ aggregation result
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";

/**
 * Explicit future structural readiness rule kinds only.
 * Exactly one kind in GROUND-123.
 * No ALLOW_EMPTY / vacuous / polarity / resolution / coverage kinds.
 */
export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind =
  "REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION";

/**
 * Specification entry. Context resolves via candidate_key against exact 084
 * assessments; observation_need_key / capability_requirement_set_key / policy
 * key are derived from GROUND-084 policy.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyInput {
  candidate_key: string;
  readiness_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind;
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification {
  policies: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + specification — not 117–122 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyEvalInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification;
}

/**
 * Runtime-only declarative aggregation readiness policy.
 * No source/match/aggregation-policy keys / current readiness value.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  operational_eligibility_dimension_policy_key: string;
  readiness_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind;
}

export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  | "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyModelLimitation =
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
 * Candidate-level declarative readiness-policy assessment.
 * has_explicit_* means policy-record existence only — not current readiness.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  status: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyStatus;
  authority_source_aggregation_readiness_policy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy | null;
  has_explicit_authority_source_aggregation_readiness_policy: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment[];
  has_explicit_authority_source_aggregation_readiness_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyModelLimitation[];
}
