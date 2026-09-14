/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Composition Policy types (GROUND-076).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement Set
 * + explicit Requirement Set Composition Policy Specification
 * → Explicit Capability Requirement Set Composition Policy Foundation only.
 *
 * No runtime dependency on GROUND-075 Satisfaction States.
 *
 * Composition Policy ≠ Composition Result ≠ effective Capability
 * ANY / ALL declaration ≠ Capability present
 * policy absence ≠ ANY ≠ ALL
 * Requirement plurality ≠ implicit ALL
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Whole-set Requirement composition rule kinds.
 * Declaration only — not executed against current Satisfaction States.
 */
export type AttentionObservationCapabilityRequirementSetCompositionPolicyKind =
  | "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED"
  | "ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_ARE_SATISFIED";

/**
 * Policy specification entry anchored to exact GROUND-048 Candidate context.
 * Does NOT independently supply Requirement keys.
 */
export interface AttentionObservationCapabilityRequirementSetCompositionPolicyInput {
  candidate_key: string;
  composition_kind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind;
}

export interface AttentionObservationCapabilityRequirementSetCompositionPolicySpecification {
  policies: AttentionObservationCapabilityRequirementSetCompositionPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 + specification — not GROUND-075.
 */
export interface AttentionObservationCapabilityRequirementSetCompositionPolicyEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityRequirementSetCompositionPolicySpecification;
}

/**
 * Runtime-only Requirement Set Composition Policy declaration.
 * Anchored to exact non-empty GROUND-048 Requirement set.
 * No current_satisfaction_states / composition_result / has_capability.
 */
export interface AttentionObservationCapabilityRequirementSetCompositionPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  capability_requirement_keys: string[];
  composition_kind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind;
}

export type AttentionObservationCapabilityRequirementSetCompositionPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT";

export type AttentionObservationCapabilityRequirementSetCompositionPolicyModelLimitation =
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_SATISFACTION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_COMPOSITION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_THRESHOLD_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_WEIGHTED_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_MAJORITY_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_VETO_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_MANDATORY_GROUPS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_ALTERNATIVE_GROUPS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_NESTED_BOOLEAN_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_PRIORITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_RECENCY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_TRUTH_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationCapabilityRequirementSetCompositionPolicyStatus;
  capability_requirement_set_composition_policy: AttentionObservationCapabilityRequirementSetCompositionPolicy | null;
  model_limitations: AttentionObservationCapabilityRequirementSetCompositionPolicyModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityRequirementSetCompositionPolicySpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment[];
  has_explicit_capability_requirement_set_composition_policies: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSetCompositionPolicyModelLimitation[];
}
