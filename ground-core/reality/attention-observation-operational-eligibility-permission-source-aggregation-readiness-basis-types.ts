/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Aggregation Readiness Basis types (GROUND-100).
 *
 * Derived only. Not persisted.
 *
 * GROUND-097 PERMISSION Source Acceptance Match
 * + GROUND-098 Explicit PERMISSION Source Aggregation Policy
 * + GROUND-099 Explicit PERMISSION Source Aggregation Readiness Policy
 * → PERMISSION Source Aggregation Readiness Basis only.
 *
 * readiness HOLDS ≠ aggregation HOLDS ≠ Permission pass ≠ OE
 * readiness DOES_NOT_HOLD ≠ aggregation false ≠ vacuous truth ≠ ineligible
 * all NOT_LISTED may still be readiness HOLDS
 * policy absence ≠ readiness DOES_NOT_HOLD
 * zero matches → readiness DOES_NOT_HOLD → no aggregation execution
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchStatus,
} from "./attention-observation-operational-eligibility-permission-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes 097 + 098 + 099 — not 093–096 / 084-direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisInput {
  permission_source_acceptance_match_set: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment;
  permission_source_aggregation_policy_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment;
  permission_source_aggregation_readiness_policy_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySetAssessment;
}

/**
 * Exact structural readiness-condition outcomes only.
 * Not READY / NOT_READY / aggregation HOLDS / Permission SATISFIED.
 */
export type AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessCondition =
  | "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
  | "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD";

/**
 * Exact readiness Basis for a future PERMISSION source aggregation execution.
 * Retains 097/098/099 lineage. Does not execute ANY/ALL.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  operational_eligibility_dimension_policy_key: string;
  permission_source_aggregation_policy_key: string;
  permission_source_aggregation_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
  permission_source_aggregation_readiness_policy_key: string;
  permission_source_aggregation_readiness_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind;
  current_permission_source_acceptance_match_keys: string[];
  current_permission_source_acceptance_match_status: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchStatus;
  readiness_condition: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessCondition;
}

export type AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED"
  | "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  | "PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisModelLimitation =
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
 * Candidate-level readiness Basis assessment.
 * has_*_basis is record existence only — true for both HOLDS and DOES_NOT_HOLD.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment {
  candidate_key: string;
  permission_source_acceptance_match_assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment;
  permission_source_aggregation_policy_assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment;
  permission_source_aggregation_readiness_policy_assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment;
  status: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisStatus;
  permission_source_aggregation_readiness_basis: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis | null;
  has_permission_source_aggregation_readiness_basis: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSetAssessment {
  permission_source_acceptance_match_set: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment;
  permission_source_aggregation_policy_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment;
  permission_source_aggregation_readiness_policy_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment[];
  has_permission_source_aggregation_readiness_bases: boolean;
  has_permission_source_aggregation_readiness_conditions_holding: boolean;
  has_permission_source_aggregation_readiness_conditions_not_holding: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisModelLimitation[];
}
