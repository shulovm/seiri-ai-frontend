/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Aggregation Policy types (GROUND-098).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit PERMISSION Source Aggregation Policy Specification
 * → Explicit PERMISSION Source Aggregation Policy only.
 *
 * Independent from GROUND-093 / 094 / 095 / 096 / 097.
 *
 * aggregation policy ≠ aggregation result
 * ANY / ALL ≠ current condition holds
 * policy absence ≠ ANY ≠ ALL
 * ANY/ALL ≠ zero-source / vacuous-truth semantics
 * aggregation policy ≠ acceptance criterion ≠ resolution ≠ coverage
 * PERMISSION_PROHIBITED ≠ hidden veto
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";

/**
 * Explicit future aggregation rule kinds only.
 * No VETO / MAJORITY / THRESHOLD / FIRST / LATEST / ANY_RESOLVED / ALL_RESOLVED.
 */
export type AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind =
  | "ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE"
  | "ALL_PERMISSION_SOURCES_LISTED_AS_ACCEPTABLE";

/**
 * Specification entry. Context resolves via candidate_key against exact 084
 * assessments; capability_requirement_set_key is derived from 084 policy.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyInput {
  candidate_key: string;
  aggregation_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification {
  policies: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + specification — not 093 / 094 / 095 / 096 / 097 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyEvalInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification;
}

/**
 * Runtime-only declarative aggregation policy.
 * No source keys / match keys / current source count / current result.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  operational_eligibility_dimension_policy_key: string;
  aggregation_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
}

export type AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED"
  | "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED"
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
 * Candidate-level declarative aggregation-policy assessment.
 * has_explicit_* means policy-record existence only — not aggregation result.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  status: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyStatus;
  permission_source_aggregation_policy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy | null;
  has_explicit_permission_source_aggregation_policy: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment[];
  has_explicit_permission_source_aggregation_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyModelLimitation[];
}
