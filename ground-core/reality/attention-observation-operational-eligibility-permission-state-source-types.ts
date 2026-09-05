/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * State Source Bridge types (GROUND-093).
 *
 * Derived only. Not persisted.
 *
 * GROUND-091 Permission State
 * → Operational Eligibility PERMISSION State Source Bridge only.
 *
 * No runtime dependency on GROUND-084 Operational Eligibility Dimension Policy.
 * No Capability / Authority / Resource Readiness / Feasibility bridges.
 * No effective Permission / multiple-binding composition / acceptance.
 *
 * Source representation ≠ acceptance ≠ resolution ≠ Operational Eligibility
 * PERMISSION_PROHIBITED / UNRESOLVED_* remain represented sources
 * source PRESENT ≠ PERMISSION_PERMITTED ≠ accepted ≠ can_execute
 * 0..many sources per Candidate (one per exact Permission State Basis)
 */

import type {
  AttentionCandidateObservationPermissionStateAssessment,
  AttentionObservationPermissionState,
  AttentionObservationPermissionStateSetAssessment,
} from "./attention-observation-permission-state-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-091 only — not GROUND-084 policy / 024–090 direct cores.
 */
export interface AttentionObservationOperationalEligibilityPermissionStateSourceInput {
  permission_state_set: AttentionObservationPermissionStateSetAssessment;
}

/**
 * Exact Operational Eligibility PERMISSION source bridge.
 * Preserves raw GROUND-091 Permission State + Basis lineage.
 * dimension is fixed to PERMISSION (084 conceptual token; no 084 runtime).
 */
export interface AttentionObservationOperationalEligibilityPermissionStateSourceBridge {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  dimension: "PERMISSION";
  permission_state_basis_key: string;
  permission_evaluation_at: string;
  permission_state: AttentionObservationPermissionState;
}

/**
 * Candidate-level source status.
 * PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT = source-record
 * existence only (not PERMISSION_PERMITTED polarity / eligibility).
 * Plural because one Candidate may have multiple exact PERMISSION sources.
 */
export type AttentionObservationOperationalEligibilityPermissionStateSourceStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  | "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";

export type AttentionObservationOperationalEligibilityPermissionStateSourceModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_REQUIRED_DIMENSION_COVERAGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_OUTCOME_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_READINESS_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment {
  candidate_key: string;
  permission_state_assessment: AttentionCandidateObservationPermissionStateAssessment;
  status: AttentionObservationOperationalEligibilityPermissionStateSourceStatus;
  permission_state_sources: AttentionObservationOperationalEligibilityPermissionStateSourceBridge[];
  has_permission_state_operational_eligibility_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionStateSourceModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment {
  permission_state_set: AttentionObservationPermissionStateSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment[];
  has_permission_state_operational_eligibility_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionStateSourceModelLimitation[];
}
