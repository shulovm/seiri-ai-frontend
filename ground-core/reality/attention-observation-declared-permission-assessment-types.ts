/**
 * Reality Core v0.7 — Attention Observation Declared Permission Assessment
 * types (GROUND-088).
 *
 * Derived only. Not persisted.
 *
 * GROUND-087 Permission Observation-Context Binding
 * + GROUND-024 assessDeclaredInterventionPermission
 * + explicit Permission evaluation instant
 * → Observation-Context Declared Permission Assessment only.
 *
 * Declared Permission Assessment ≠ current/effective Permission
 * PERMIT_DECLARED ≠ PERMITTED
 * PROHIBIT_DECLARED ≠ DENIED
 * NO_PERMISSION_DECLARATIONS ≠ ALLOWED / DENIED
 * CONTESTED_PERMISSION ≠ conflict winner
 * Multiple bindings ≠ ANY / ALL / cross-binding conflict
 * evaluation instant must be explicit — no wall-clock default
 */

import type {
  AttentionCandidateObservationPermissionContextBindingAssessment,
  AttentionObservationPermissionContextBindingSetAssessment,
} from "./attention-observation-permission-context-binding-types.js";
import type {
  DeclaredInterventionPermissionAssessment,
  DeclaredInterventionPermissionStatus,
} from "./permission-types.js";
import type { ProjectState } from "../types.js";

/**
 * Explicit evaluation instant for one exact observation Candidate context.
 * Does NOT supply actor/intervention (those come only from GROUND-087 bindings).
 */
export interface AttentionObservationDeclaredPermissionEvaluationInput {
  candidate_key: string;
  permission_evaluation_at: string;
}

export interface AttentionObservationDeclaredPermissionEvaluationSpecification {
  evaluations: AttentionObservationDeclaredPermissionEvaluationInput[];
}

/**
 * Combined evaluation input.
 * ProjectState is read-only for Entity/Intervention revalidation + declaration evaluation.
 */
export interface AttentionObservationDeclaredPermissionAssessmentInput {
  permission_context_binding_set: AttentionObservationPermissionContextBindingSetAssessment;
  project_state: ProjectState;
  specification: AttentionObservationDeclaredPermissionEvaluationSpecification;
}

/**
 * Per-binding observation-context declared Permission assessment.
 * Embeds exact GROUND-024 DeclaredInterventionPermissionAssessment losslessly.
 * No effective_permission / is_permitted / permission_winner.
 */
export interface AttentionObservationDeclaredPermissionBindingAssessment {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  permission_actor_entity_id: string;
  permission_intervention_id: string;
  permission_evaluation_at: string;
  declared_permission_status: DeclaredInterventionPermissionStatus;
  applicable_permission_declaration_ids: string[];
  declared_permission_assessment: DeclaredInterventionPermissionAssessment;
}

export type AttentionObservationDeclaredPermissionAssessmentStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  | "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT";

export type AttentionObservationDeclaredPermissionAssessmentModelLimitation =
  | "OBSERVATION_CONTEXT_PERMISSION_CURRENT_STATE_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_EFFECTIVE_STATE_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_DECLARATION_INTERPRETATION_POLICY_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_DECLARATION_INTERPRETATION_BASIS_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_CONFLICT_RESOLUTION_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_RECENCY_PRECEDENCE_NOT_MODELED"
  | "OBSERVATION_CONTEXT_PERMISSION_MULTI_INSTANT_HISTORY_NOT_MODELED"
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

export interface AttentionCandidateObservationDeclaredPermissionAssessment {
  candidate_key: string;
  permission_context_binding_assessment: AttentionCandidateObservationPermissionContextBindingAssessment;
  status: AttentionObservationDeclaredPermissionAssessmentStatus;
  permission_evaluation_at: string | null;
  declared_permission_binding_assessments: AttentionObservationDeclaredPermissionBindingAssessment[];
  model_limitations: AttentionObservationDeclaredPermissionAssessmentModelLimitation[];
}

export interface AttentionObservationDeclaredPermissionAssessmentSet {
  permission_context_binding_set: AttentionObservationPermissionContextBindingSetAssessment;
  specification: AttentionObservationDeclaredPermissionEvaluationSpecification;
  candidate_assessments: AttentionCandidateObservationDeclaredPermissionAssessment[];
  has_observation_context_declared_permission_assessments: boolean;
  model_limitations: AttentionObservationDeclaredPermissionAssessmentModelLimitation[];
}
