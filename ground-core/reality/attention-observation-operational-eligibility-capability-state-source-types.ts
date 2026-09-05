/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Capability
 * State Source Bridge types (GROUND-085).
 *
 * Derived only. Not persisted.
 *
 * GROUND-083 Capability State
 * → Operational Eligibility CAPABILITY_STATE Source Bridge only.
 *
 * No runtime dependency on GROUND-084 Operational Eligibility Dimension Policy.
 * No Permission / Authority / Resource Readiness / Feasibility bridges.
 *
 * Source representation ≠ acceptance ≠ resolution ≠ Operational Eligibility
 * CAPABILITY_ABSENT / UNRESOLVED_* remain represented sources (raw values preserved)
 * No generic POSITIVE / NEGATIVE / PASS / FAIL coercion
 */

import type {
  AttentionCandidateObservationCapabilityStateAssessment,
  AttentionObservationCapabilityState,
  AttentionObservationCapabilityStateSetAssessment,
} from "./attention-observation-capability-state-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-083 only — not GROUND-084 policy / 048–082 direct cores.
 */
export interface AttentionObservationOperationalEligibilityCapabilityStateSourceInput {
  capability_state_set: AttentionObservationCapabilityStateSetAssessment;
}

/**
 * Exact Operational Eligibility CAPABILITY_STATE source bridge.
 * Preserves raw GROUND-083 Capability State + Basis lineage.
 * dimension is fixed to CAPABILITY_STATE (084 conceptual token; no 084 runtime).
 */
export interface AttentionObservationOperationalEligibilityCapabilityStateSourceBridge {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "CAPABILITY_STATE";
  capability_state_basis_key: string;
  capability_state: AttentionObservationCapabilityState;
}

/**
 * Candidate-level source status.
 * CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT = source-record
 * existence only (not CAPABILITY_PRESENT polarity / eligibility).
 */
export type AttentionObservationOperationalEligibilityCapabilityStateSourceStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT";

export type AttentionObservationOperationalEligibilityCapabilityStateSourceModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_DIMENSION_COVERAGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_DIMENSION_OUTCOME_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_READINESS_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment {
  candidate_key: string;
  capability_state_assessment: AttentionCandidateObservationCapabilityStateAssessment;
  status: AttentionObservationOperationalEligibilityCapabilityStateSourceStatus;
  capability_state_source: AttentionObservationOperationalEligibilityCapabilityStateSourceBridge | null;
  model_limitations: AttentionObservationOperationalEligibilityCapabilityStateSourceModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityCapabilityStateSourceSetAssessment {
  capability_state_set: AttentionObservationCapabilityStateSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment[];
  has_capability_state_operational_eligibility_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityCapabilityStateSourceModelLimitation[];
}
