/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Resolution Classification types (GROUND-095).
 *
 * Derived only. Not persisted.
 *
 * GROUND-093 Operational Eligibility PERMISSION State Source Bridge
 * → PERMISSION Source Resolution Classification only.
 *
 * Independent from GROUND-084 requirement and GROUND-094 coverage.
 *
 * RESOLVED ≠ accepted ≠ PERMISSION_PERMITTED
 * PERMISSION_PROHIBITED is RESOLVED
 * UNRESOLVED ≠ rejected ≠ source absent ≠ NOT_REPRESENTED
 * two unresolved reasons remain distinct
 * resolution ≠ acceptance ≠ aggregation ≠ OE outcome
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment,
} from "./attention-observation-operational-eligibility-permission-state-source-types.js";
import type { AttentionObservationPermissionState } from "./attention-observation-permission-state-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-093 only — not 084 / 094 / 091-direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationInput {
  permission_state_source_set: AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment;
}

/**
 * Intrinsic resolvedness of an exact PERMISSION raw source.
 * Not PASS / FAIL / ACCEPTED / REJECTED / PERMITTED / PROHIBITED.
 */
export type AttentionObservationOperationalEligibilityPermissionSourceResolution =
  | "RESOLVED"
  | "UNRESOLVED";

/**
 * Exact unresolved reason corresponding to GROUND-091 unresolved states.
 * Do not collapse into generic UNKNOWN.
 */
export type AttentionObservationOperationalEligibilityPermissionSourceUnresolvedReason =
  | "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY"
  | "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS";

/**
 * Candidate-level classification status.
 * Classifications exist only when GROUND-093 exposes exact source records.
 */
export type AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  | "PERMISSION_SOURCE_RESOLUTION_CLASSIFICATIONS_PRESENT";

/**
 * Exact classification annotation over one GROUND-093 PERMISSION source.
 * Retains raw Permission State + source/Basis/evaluation lineage.
 */
export interface AttentionObservationOperationalEligibilityPermissionSourceResolutionClassification {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  permission_state_source_key: string;
  permission_state_basis_key: string;
  permission_evaluation_at: string;
  dimension: "PERMISSION";
  permission_state: AttentionObservationPermissionState;
  resolution: AttentionObservationOperationalEligibilityPermissionSourceResolution;
  unresolved_reason: AttentionObservationOperationalEligibilityPermissionSourceUnresolvedReason | null;
}

export type AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationModelLimitation =
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

/**
 * Candidate-level resolution classification assessment.
 * Booleans are existence summaries only — not aggregate Permission verdicts.
 */
export interface AttentionCandidateObservationOperationalEligibilityPermissionSourceResolutionClassificationAssessment {
  candidate_key: string;
  permission_state_source_assessment: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment;
  status: AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationStatus;
  permission_source_resolution_classifications: AttentionObservationOperationalEligibilityPermissionSourceResolutionClassification[];
  has_permission_source_resolution_classifications: boolean;
  has_resolved_permission_sources: boolean;
  has_unresolved_permission_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSetAssessment {
  permission_state_source_set: AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityPermissionSourceResolutionClassificationAssessment[];
  has_permission_source_resolution_classifications: boolean;
  has_resolved_permission_sources: boolean;
  has_unresolved_permission_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationModelLimitation[];
}
