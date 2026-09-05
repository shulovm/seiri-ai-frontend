/**
 * Reality Core v0.7 — Attention Observation Permission Context Binding types
 * (GROUND-087).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement Set
 * + ProjectState (Entity / Intervention existence validation only)
 * + explicit Permission Observation-Context Binding Specification
 * → Explicit Permission Observation-Context Binding Foundation only.
 *
 * Binding ≠ Permission declaration / aggregation / polarity / temporal applicability
 * Binding ≠ current/effective Permission / Authority / assignment / OE result
 * Binding ≠ Candidate==Entity / ObservationNeed==Intervention
 * Multiple bindings ≠ conflict / ANY / ALL
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type { ProjectState } from "../types.js";

/**
 * Specification entry: exact observation Candidate ↔ Permission actor/intervention.
 * Does NOT supply Requirement keys, declaration ids, effects, or evaluation `at`.
 */
export interface AttentionObservationPermissionContextBindingInput {
  candidate_key: string;
  permission_actor_entity_id: string;
  permission_intervention_id: string;
}

export interface AttentionObservationPermissionContextBindingSpecification {
  bindings: AttentionObservationPermissionContextBindingInput[];
}

/**
 * Combined evaluation input.
 * project_state is read-only Entity/Intervention validation only —
 * not Permission declaration aggregation input.
 */
export interface AttentionObservationPermissionContextBindingEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  project_state: ProjectState;
  specification: AttentionObservationPermissionContextBindingSpecification;
}

/**
 * Runtime-only observation-context ↔ Permission-context relation.
 * No permission_effect / permission_status / declaration ids / at / Authority.
 */
export interface AttentionObservationPermissionContextBinding {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  capability_requirement_keys: string[];
  permission_actor_entity_id: string;
  permission_intervention_id: string;
}

export type AttentionObservationPermissionContextBindingStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT";

export type AttentionObservationPermissionContextBindingModelLimitation =
  | "OBSERVATION_CONTEXT_PERMISSION_DECLARATION_ASSESSMENT_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_CURRENT_STATE_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_EFFECTIVE_STATE_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_CONFLICT_RESOLUTION_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_COVERAGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_OUTCOME_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_NOT_MODELED"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationPermissionContextBindingAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationPermissionContextBindingStatus;
  permission_context_bindings: AttentionObservationPermissionContextBinding[];
  model_limitations: AttentionObservationPermissionContextBindingModelLimitation[];
}

export interface AttentionObservationPermissionContextBindingSetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationPermissionContextBindingSpecification;
  candidate_assessments: AttentionCandidateObservationPermissionContextBindingAssessment[];
  has_explicit_permission_observation_context_bindings: boolean;
  model_limitations: AttentionObservationPermissionContextBindingModelLimitation[];
}
