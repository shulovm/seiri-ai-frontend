/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Acceptance Criteria types (GROUND-096).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit PERMISSION Source Acceptance Criteria Specification
 * → Explicit PERMISSION Source Acceptance Criterion only.
 *
 * Independent from GROUND-093 / 094 / 095.
 *
 * criterion declaration ≠ current source
 * accepted value specification ≠ current accepted result
 * PERMISSION_PERMITTED is NOT implicitly accepted
 * PERMISSION_PROHIBITED / UNRESOLVED are NOT implicitly rejected
 * explicit empty criterion ≠ criterion absence ≠ policy absence
 * criterion absence ≠ accept-any ≠ reject-all
 * acceptance ≠ resolution ≠ aggregation ≠ OE outcome
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationPermissionState } from "./attention-observation-permission-state-types.js";

/**
 * Specification entry. Context resolves via candidate_key against exact 084
 * assessments; capability_requirement_set_key is derived from 084 policy.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionInput {
  candidate_key: string;
  accepted_permission_states: AttentionObservationPermissionState[];
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification {
  criteria: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + specification — not 093 / 094 / 095 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification;
}

/**
 * Runtime-only declarative acceptance criterion.
 * No current source keys / resolution / match result.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "PERMISSION";
  operational_eligibility_dimension_policy_key: string;
  accepted_permission_states: AttentionObservationPermissionState[];
}

export type AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
  | "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaModelLimitation =
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

/**
 * Candidate-level declarative criterion assessment.
 * has_explicit_* means criterion-record existence only — not current acceptance.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  status: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaStatus;
  permission_source_acceptance_criterion: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion | null;
  has_explicit_permission_source_acceptance_criterion: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment[];
  has_explicit_permission_source_acceptance_criteria: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaModelLimitation[];
}
