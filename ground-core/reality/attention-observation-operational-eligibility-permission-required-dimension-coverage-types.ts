/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Required Dimension Coverage types (GROUND-094).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + GROUND-093 Operational Eligibility PERMISSION State Source Bridge
 * → Required PERMISSION Dimension Coverage only.
 *
 * required ≠ represented
 * represented ≠ accepted ≠ resolved ≠ PERMISSION_PERMITTED
 * PERMISSION_PROHIBITED / UNRESOLVED sources still represent PERMISSION
 * NOT_REPRESENTED ≠ rejected ≠ prohibited ≠ Operational Eligibility failure
 * PERMISSION not required ≠ NOT_REPRESENTED
 * policy absence ≠ PERMISSION not required
 *
 * No acceptance / resolution / aggregation / OE outcome / can_execute.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment,
} from "./attention-observation-operational-eligibility-permission-state-source-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + 093 — not 091 / 085 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  permission_state_source_set: AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment;
}

/**
 * Binary required-PERMISSION source representation only.
 * Not PASS / FAIL / ACCEPTED / REJECTED / RESOLVED / PERMITTED / PROHIBITED.
 */
export type AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageValue =
  | "REPRESENTED"
  | "NOT_REPRESENTED";

/**
 * Candidate-level coverage status.
 * REQUIRED_PERMISSION_DIMENSION_COVERAGE_PRESENT = coverage-record existence only
 * (includes NOT_REPRESENTED records).
 */
export type AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "REQUIRED_PERMISSION_DIMENSION_COVERAGE_PRESENT";

/**
 * Exact required-PERMISSION coverage record.
 * REPRESENTED and NOT_REPRESENTED both yield a coverage record.
 */
export interface AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverage {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  operational_eligibility_dimension_policy_key: string;
  coverage: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageValue;
  permission_state_source_keys: string[];
}

export type AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
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

export interface AttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverageAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  permission_state_source_assessment: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment;
  status: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageStatus;
  permission_required_dimension_coverage: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverage | null;
  has_permission_required_dimension_coverage: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  permission_state_source_set: AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverageAssessment[];
  has_permission_required_dimension_coverages: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageModelLimitation[];
}
