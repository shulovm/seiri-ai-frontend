/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Aggregation Result types (GROUND-101).
 *
 * Derived only. Not persisted.
 *
 * GROUND-097 PERMISSION Source Acceptance Match
 * + GROUND-098 Explicit PERMISSION Source Aggregation Policy
 * + GROUND-100 PERMISSION Source Aggregation Readiness Basis
 * → PERMISSION Source Aggregation Result only.
 *
 * Aggregation executes ONLY when readiness HOLDS.
 * readiness DOES_NOT_HOLD → no aggregation result (≠ aggregation DOES_NOT_HOLD)
 * aggregation HOLDS ≠ Permission satisfied ≠ OE ≠ can_execute
 * aggregation DOES_NOT_HOLD ≠ Permission unsatisfied ≠ ineligible
 * No vacuous ANY/ALL over empty match sets.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes 097 + 098 + 100 — not 099-direct / 093–096 / 084-direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationResultInput {
  permission_source_acceptance_match_set: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment;
  permission_source_aggregation_policy_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment;
  permission_source_aggregation_readiness_basis_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSetAssessment;
}

/**
 * Exact aggregation-condition outcomes only.
 * Not PASS / FAIL / ACCEPTED / REJECTED / SATISFIED / ELIGIBLE.
 */
export type AttentionObservationOperationalEligibilityPermissionSourceAggregationCondition =
  | "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
  | "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";

/**
 * Exact aggregation result authorized by an exact current readiness Basis.
 * Retains 097/098/100 lineage. Executes ANY/ALL only under readiness HOLDS.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationResult {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  operational_eligibility_dimension_policy_key: string;
  permission_source_aggregation_policy_key: string;
  permission_source_aggregation_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
  permission_source_aggregation_readiness_basis_key: string;
  permission_source_aggregation_readiness_policy_key: string;
  permission_source_aggregation_readiness_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind;
  current_permission_source_acceptance_match_keys: string[];
  aggregation_condition: AttentionObservationOperationalEligibilityPermissionSourceAggregationCondition;
}

export type AttentionObservationOperationalEligibilityPermissionSourceAggregationResultStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED"
  | "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  | "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
  | "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionSourceAggregationResultModelLimitation =
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
 * Candidate-level aggregation Result assessment.
 * has_*_result is record existence only — true for both HOLDS and DOES_NOT_HOLD.
 * readiness DOES_NOT_HOLD → has_result false (no aggregation result).
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment {
  candidate_key: string;
  permission_source_acceptance_match_assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment;
  permission_source_aggregation_policy_assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment;
  permission_source_aggregation_readiness_basis_assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment;
  status: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultStatus;
  permission_source_aggregation_result: AttentionObservationOperationalEligibilityPermissionSourceAggregationResult | null;
  has_permission_source_aggregation_result: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAggregationResultSetAssessment {
  permission_source_acceptance_match_set: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment;
  permission_source_aggregation_policy_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment;
  permission_source_aggregation_readiness_basis_set: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment[];
  has_permission_source_aggregation_results: boolean;
  has_permission_source_aggregation_conditions_holding: boolean;
  has_permission_source_aggregation_conditions_not_holding: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultModelLimitation[];
}
