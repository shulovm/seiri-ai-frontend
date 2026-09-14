/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Acceptance Match types (GROUND-097).
 *
 * Derived only. Not persisted.
 *
 * GROUND-093 PERMISSION State Source Bridge
 * + GROUND-096 Explicit PERMISSION Source Acceptance Criterion
 * → exact PERMISSION Source Acceptance Match only.
 *
 * Independent from GROUND-094 coverage and GROUND-095 resolution.
 *
 * LISTED_AS_ACCEPTABLE ≠ ACCEPTED ≠ PASS ≠ dimension satisfied ≠ OE
 * NOT_LISTED_AS_ACCEPTABLE ≠ REJECTED ≠ FAIL ≠ ineligible
 * criterion absence ≠ NOT_LISTED
 * source absence ≠ NOT_LISTED
 * explicit empty criterion + source → NOT_LISTED (membership only)
 * PERMISSION_PROHIBITED / UNRESOLVED may be LISTED
 * acceptance match ≠ resolution ≠ coverage ≠ aggregation
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-acceptance-criteria-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment,
} from "./attention-observation-operational-eligibility-permission-state-source-types.js";
import type { AttentionObservationPermissionState } from "./attention-observation-permission-state-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-093 + GROUND-096 — not 094 / 095 / 084-direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchInput {
  permission_state_source_set: AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment;
  permission_source_acceptance_criteria_set: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSetAssessment;
}

/**
 * Exact set-membership fact only.
 * Not ACCEPTED / REJECTED / PASS / FAIL.
 */
export type AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchValue =
  | "LISTED_AS_ACCEPTABLE"
  | "NOT_LISTED_AS_ACCEPTABLE";

/**
 * One exact 093 source × exact 096 criterion membership comparison.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  dimension: "PERMISSION";
  permission_state_source_key: string;
  permission_state_basis_key: string;
  permission_evaluation_at: string;
  permission_state: AttentionObservationPermissionState;
  permission_source_acceptance_criterion_key: string;
  match: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchValue;
}

export type AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
  | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  | "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchModelLimitation =
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
 * Candidate-level match assessment.
 * Booleans are existence summaries only — not aggregate acceptance verdicts.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment {
  candidate_key: string;
  permission_state_source_assessment: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment;
  permission_source_acceptance_criteria_assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment;
  status: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchStatus;
  permission_source_acceptance_matches: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch[];
  has_permission_source_acceptance_matches: boolean;
  has_listed_as_acceptable_permission_sources: boolean;
  has_not_listed_as_acceptable_permission_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment {
  permission_state_source_set: AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment;
  permission_source_acceptance_criteria_set: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment[];
  has_permission_source_acceptance_matches: boolean;
  has_listed_as_acceptable_permission_sources: boolean;
  has_not_listed_as_acceptable_permission_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchModelLimitation[];
}
