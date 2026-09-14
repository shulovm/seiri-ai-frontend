/**
 * Reality Core v0.7 — Attention Observation Declared Permission Interpretation
 * Basis types (GROUND-090).
 *
 * Derived only. Not persisted.
 *
 * GROUND-088 Current Observation-Context Declared Permission Assessment
 * + GROUND-089 Explicit Declared Permission Interpretation Policy
 * → Declared Permission Interpretation Basis only.
 *
 * Interpretation Basis ≠ Permission State
 * INTERPRET_AS_PERMISSION_PERMITTED ≠ current PERMISSION_PERMITTED
 * INTERPRET_AS_PERMISSION_PROHIBITED ≠ current PERMISSION_PROHIBITED
 * policy absent ≠ policy present but current raw status unmapped
 * explicit empty policy → NO_MAPPING (not NO_POLICY)
 * CONTESTED mapping ≠ declaration winner
 * no default open/closed-world / PERMIT/PROHIBIT mappings
 * multiple binding Bases remain independent
 */

import type {
  AttentionCandidateObservationDeclaredPermissionAssessment,
  AttentionObservationDeclaredPermissionAssessmentSet,
  AttentionObservationDeclaredPermissionBindingAssessment,
} from "./attention-observation-declared-permission-assessment-types.js";
import type {
  AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment,
  AttentionObservationDeclaredPermissionInterpretation,
  AttentionObservationDeclaredPermissionInterpretationMapping,
  AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment,
  AttentionObservationDeclaredPermissionInterpretationPolicySetAssessment,
} from "./attention-observation-declared-permission-interpretation-policy-types.js";
import type { DeclaredInterventionPermissionStatus } from "./permission-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-088 + 089 — not 024 evaluator / 087 rediscovery / ProjectState.
 */
export interface AttentionObservationDeclaredPermissionInterpretationInput {
  declared_permission_assessment_set: AttentionObservationDeclaredPermissionAssessmentSet;
  declared_permission_interpretation_policy_set: AttentionObservationDeclaredPermissionInterpretationPolicySetAssessment;
}

/**
 * Candidate-level interpretation assessment statuses.
 * Per-binding outcomes live on binding assessments — not here.
 */
export type AttentionObservationDeclaredPermissionInterpretationStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  | "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT";

/**
 * Binding-level exact current-raw-status mapping lookup statuses.
 * Not PERMISSION_PERMITTED / PERMISSION_PROHIBITED / PASS / FAIL / UNKNOWN.
 */
export type AttentionObservationDeclaredPermissionInterpretationBindingStatus =
  | "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
  | "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
  | "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT";

/**
 * Exact current raw assessment × exact policy mapping contact record.
 * Not current Permission State / effective Permission.
 */
export interface AttentionObservationDeclaredPermissionInterpretationBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  current_declared_permission_assessment_key: string;
  permission_evaluation_at: string;
  current_declared_permission_status: DeclaredInterventionPermissionStatus;
  declared_permission_interpretation_policy_key: string;
  matched_mapping: AttentionObservationDeclaredPermissionInterpretationMapping;
  interpretation: AttentionObservationDeclaredPermissionInterpretation;
}

export type AttentionObservationDeclaredPermissionInterpretationModelLimitation =
  | "PERMISSION_CURRENT_STATE_NOT_MODELED"
  | "PERMISSION_EFFECTIVE_STATE_NOT_MODELED"
  | "PERMISSION_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED"
  | "PERMISSION_INTERPRETATION_DEFAULTS_NOT_MODELED"
  | "PERMISSION_DECLARATION_LEVEL_CONFLICT_RESOLUTION_NOT_MODELED"
  | "PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "PERMISSION_RECENCY_PRECEDENCE_NOT_MODELED"
  | "PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED"
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

export interface AttentionObservationDeclaredPermissionInterpretationBindingAssessment {
  permission_context_binding_key: string;
  declared_permission_binding_assessment: AttentionObservationDeclaredPermissionBindingAssessment;
  declared_permission_interpretation_policy_assessment: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment;
  status: AttentionObservationDeclaredPermissionInterpretationBindingStatus;
  interpretation_basis: AttentionObservationDeclaredPermissionInterpretationBasis | null;
  has_declared_permission_interpretation_basis: boolean;
}

export interface AttentionCandidateObservationDeclaredPermissionInterpretationAssessment {
  candidate_key: string;
  declared_permission_assessment: AttentionCandidateObservationDeclaredPermissionAssessment;
  declared_permission_interpretation_policy_assessment: AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment;
  status: AttentionObservationDeclaredPermissionInterpretationStatus;
  binding_interpretation_assessments: AttentionObservationDeclaredPermissionInterpretationBindingAssessment[];
  has_declared_permission_interpretation_bases: boolean;
  model_limitations: AttentionObservationDeclaredPermissionInterpretationModelLimitation[];
}

export interface AttentionObservationDeclaredPermissionInterpretationSetAssessment {
  declared_permission_assessment_set: AttentionObservationDeclaredPermissionAssessmentSet;
  declared_permission_interpretation_policy_set: AttentionObservationDeclaredPermissionInterpretationPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationDeclaredPermissionInterpretationAssessment[];
  has_declared_permission_interpretation_bases: boolean;
  model_limitations: AttentionObservationDeclaredPermissionInterpretationModelLimitation[];
}
