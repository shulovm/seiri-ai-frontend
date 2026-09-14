/**
 * Reality Core v0.7 — Attention Observation Declared Permission Interpretation
 * Policy types (GROUND-089).
 *
 * Derived only. Not persisted.
 *
 * GROUND-087 Permission Observation-Context Binding
 * + explicit Declared Permission Interpretation Policy Specification
 * → Explicit Declared Permission Interpretation Policy Foundation only.
 *
 * No runtime dependency on GROUND-088 current Declared Permission Assessment.
 * Raw source vocabulary from GROUND-024 DeclaredInterventionPermissionStatus.
 *
 * Interpretation Policy ≠ Interpretation Basis ≠ Permission State
 * INTERPRET_AS_PERMISSION_PERMITTED ≠ currently permitted
 * INTERPRET_AS_PERMISSION_PROHIBITED ≠ currently prohibited
 * policy absence ≠ explicit empty policy
 * CONTESTED mapping ≠ declaration winner
 * no default open/closed-world / PERMIT/PROHIBIT mappings
 */

import type {
  AttentionCandidateObservationPermissionContextBindingAssessment,
  AttentionObservationPermissionContextBindingSetAssessment,
} from "./attention-observation-permission-context-binding-types.js";
import type { DeclaredInterventionPermissionStatus } from "./permission-types.js";

/**
 * Declarative Permission interpretation targets only.
 * Not current PERMITTED / PROHIBITED / effective Permission.
 */
export type AttentionObservationDeclaredPermissionInterpretation =
  | "INTERPRET_AS_PERMISSION_PERMITTED"
  | "INTERPRET_AS_PERMISSION_PROHIBITED";

/**
 * Atomic raw DeclaredInterventionPermissionStatus → interpretation pair.
 */
export interface AttentionObservationDeclaredPermissionInterpretationMapping {
  declared_permission_status: DeclaredInterventionPermissionStatus;
  interpretation: AttentionObservationDeclaredPermissionInterpretation;
}

/**
 * Policy specification entry anchored to exact GROUND-087 binding.
 * Does NOT supply evaluation instant or current raw assessment.
 */
export interface AttentionObservationDeclaredPermissionInterpretationPolicyInput {
  permission_context_binding_key: string;
  mappings: AttentionObservationDeclaredPermissionInterpretationMapping[];
}

export interface AttentionObservationDeclaredPermissionInterpretationPolicySpecification {
  policies: AttentionObservationDeclaredPermissionInterpretationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-087 + specification — not GROUND-088 runtime assessments.
 */
export interface AttentionObservationDeclaredPermissionInterpretationPolicyEvalInput {
  permission_context_binding_set: AttentionObservationPermissionContextBindingSetAssessment;
  specification: AttentionObservationDeclaredPermissionInterpretationPolicySpecification;
}

/**
 * Runtime-only Declared Permission Interpretation Policy declaration.
 * Anchored to exact GROUND-087 Permission Context Binding.
 * No current_declared_permission_status / permission_evaluation_at / Permission State.
 */
export interface AttentionObservationDeclaredPermissionInterpretationPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  permission_actor_entity_id: string;
  permission_intervention_id: string;
  mappings: AttentionObservationDeclaredPermissionInterpretationMapping[];
}

export type AttentionObservationDeclaredPermissionInterpretationPolicyStatus =
  | "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
  | "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT";

export type AttentionObservationDeclaredPermissionInterpretationPolicyCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT";

export type AttentionObservationDeclaredPermissionInterpretationPolicyModelLimitation =
  | "DECLARED_PERMISSION_INTERPRETATION_MATCH_NOT_MODELED"
  | "PERMISSION_INTERPRETATION_BASIS_NOT_MODELED"
  | "PERMISSION_CURRENT_STATE_NOT_MODELED"
  | "PERMISSION_EFFECTIVE_STATE_NOT_MODELED"
  | "PERMISSION_POLICY_COMPLETENESS_NOT_MODELED"
  | "PERMISSION_POLICY_DEFAULTS_NOT_MODELED"
  | "PERMISSION_DECLARATION_LEVEL_CONFLICT_RESOLUTION_NOT_MODELED"
  | "PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "PERMISSION_RECENCY_PRECEDENCE_NOT_MODELED"
  | "PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_COVERAGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_PERMISSION_OUTCOME_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_NOT_MODELED"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment {
  permission_context_binding_key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_actor_entity_id: string;
  permission_intervention_id: string;
  status: AttentionObservationDeclaredPermissionInterpretationPolicyStatus;
  declared_permission_interpretation_policy: AttentionObservationDeclaredPermissionInterpretationPolicy | null;
}

export interface AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment {
  candidate_key: string;
  permission_context_binding_assessment: AttentionCandidateObservationPermissionContextBindingAssessment;
  status: AttentionObservationDeclaredPermissionInterpretationPolicyCandidateStatus;
  binding_policy_assessments: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment[];
  has_explicit_declared_permission_interpretation_policies: boolean;
  model_limitations: AttentionObservationDeclaredPermissionInterpretationPolicyModelLimitation[];
}

export interface AttentionObservationDeclaredPermissionInterpretationPolicySetAssessment {
  permission_context_binding_set: AttentionObservationPermissionContextBindingSetAssessment;
  specification: AttentionObservationDeclaredPermissionInterpretationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment[];
  has_explicit_declared_permission_interpretation_policies: boolean;
  model_limitations: AttentionObservationDeclaredPermissionInterpretationPolicyModelLimitation[];
}
