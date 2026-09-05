/**
 * Reality Core v0.7 — Attention Observation Permission State types (GROUND-091).
 *
 * Derived only. Not persisted.
 *
 * GROUND-090 Declared Permission Interpretation Assessment / Basis
 * → current Permission State only.
 *
 * PERMISSION_PERMITTED / PERMISSION_PROHIBITED are explicit-policy-derived only.
 * policy absent ≠ PERMISSION_PROHIBITED
 * current raw status unmapped ≠ PERMISSION_PROHIBITED
 * explicit empty policy → no-mapping unresolved (not policy absence / not prohibited)
 * PERMISSION_PERMITTED ≠ effective Permission / can_execute / OE
 * PERMISSION_PROHIBITED ≠ universal prohibition / Feasibility false / cannot_execute
 * CONTESTED interpretation ≠ declaration winner
 * multiple binding Permission States remain independent
 */

import type {
  AttentionCandidateObservationDeclaredPermissionInterpretationAssessment,
  AttentionObservationDeclaredPermissionInterpretationBindingAssessment,
  AttentionObservationDeclaredPermissionInterpretationSetAssessment,
} from "./attention-observation-declared-permission-interpretation-types.js";
import type { DeclaredInterventionPermissionStatus } from "./permission-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-090 only — not 024/087/088/089 direct / ProjectState.
 */
export interface AttentionObservationPermissionStateInput {
  declared_permission_interpretation_set: AttentionObservationDeclaredPermissionInterpretationSetAssessment;
}

/**
 * Canonical current Permission State surface.
 * PERMITTED / PROHIBITED require exact GROUND-090 Interpretation Basis.
 * Unresolved states preserve policy absence vs current-raw-status unmapped.
 */
export type AttentionObservationPermissionState =
  | "PERMISSION_PERMITTED"
  | "PERMISSION_PROHIBITED"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS";

/**
 * Candidate-level status.
 * PERMISSION_STATE_ASSESSMENTS_PRESENT = per-binding state-record existence only
 * (not polarity / not all permitted).
 */
export type AttentionObservationPermissionStateCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  | "PERMISSION_STATE_ASSESSMENTS_PRESENT";

export interface AttentionObservationPermissionStateBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  current_declared_permission_assessment_key: string;
  permission_evaluation_at: string;
  current_declared_permission_status: DeclaredInterventionPermissionStatus;
  permission_state: AttentionObservationPermissionState;
  declared_permission_interpretation_basis_key: string | null;
  declared_permission_interpretation_policy_key: string | null;
}

export type AttentionObservationPermissionStateModelLimitation =
  | "PERMISSION_EFFECTIVE_STATE_NOT_MODELED"
  | "PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED"
  | "PERMISSION_DECLARATION_LEVEL_CONFLICT_RESOLUTION_NOT_MODELED"
  | "PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "PERMISSION_RECENCY_PRECEDENCE_NOT_MODELED"
  | "PERMISSION_STATE_PROVENANCE_NOT_MODELED"
  | "PERMISSION_STATE_AUTHORITY_NOT_MODELED"
  | "PERMISSION_STATE_HISTORY_NOT_MODELED"
  | "PERMISSION_STATE_PERSISTENCE_NOT_MODELED"
  | "PERMISSION_STATE_TEMPORAL_VALIDITY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_COVERAGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_OUTCOME_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_NOT_MODELED"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-binding current Permission State assessment.
 * State Basis is mandatory whenever a current 090 binding interpretation
 * assessment exists (including both UNRESOLVED states).
 */
export interface AttentionObservationPermissionStateBindingAssessment {
  permission_context_binding_key: string;
  declared_permission_interpretation_assessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment;
  permission_state_basis: AttentionObservationPermissionStateBasis;
}

export interface AttentionCandidateObservationPermissionStateAssessment {
  candidate_key: string;
  declared_permission_interpretation_assessment: AttentionCandidateObservationDeclaredPermissionInterpretationAssessment;
  status: AttentionObservationPermissionStateCandidateStatus;
  permission_state_binding_assessments: AttentionObservationPermissionStateBindingAssessment[];
  has_permission_states: boolean;
  model_limitations: AttentionObservationPermissionStateModelLimitation[];
}

export interface AttentionObservationPermissionStateSetAssessment {
  declared_permission_interpretation_set: AttentionObservationDeclaredPermissionInterpretationSetAssessment;
  candidate_assessments: AttentionCandidateObservationPermissionStateAssessment[];
  has_permission_states: boolean;
  model_limitations: AttentionObservationPermissionStateModelLimitation[];
}
