/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Aggregation Readiness Policy types (GROUND-099).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit PERMISSION Aggregation Readiness Policy Specification
 * → Explicit PERMISSION Source Aggregation Readiness Policy only.
 *
 * Independent from GROUND-093 / 094 / 095 / 096 / 097 / 098.
 *
 * readiness policy ≠ current readiness
 * policy PRESENT ≠ READY
 * policy absence ≠ NOT_READY
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
 * Exactly one kind in GROUND-099.
 * No ALLOW_EMPTY / vacuous / polarity / resolution / coverage kinds.
 */
export type AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind =
  "REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION";

/**
 * Specification entry. Context resolves via candidate_key against exact 084
 * assessments; capability_requirement_set_key is derived from 084 policy.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyInput {
  candidate_key: string;
  readiness_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind;
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySpecification {
  policies: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + specification — not 093–098 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyEvalInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySpecification;
}

/**
 * Runtime-only declarative aggregation readiness policy.
 * No source/match/aggregation-policy keys / current readiness value.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  operational_eligibility_dimension_policy_key: string;
  readiness_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind;
}

export type AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  | "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_OUTCOME_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Candidate-level declarative readiness-policy assessment.
 * has_explicit_* means policy-record existence only — not current readiness.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  status: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyStatus;
  permission_source_aggregation_readiness_policy: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy | null;
  has_explicit_permission_source_aggregation_readiness_policy: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment[];
  has_explicit_permission_source_aggregation_readiness_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyModelLimitation[];
}
