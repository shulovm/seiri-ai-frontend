/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Composition Result types (GROUND-079).
 *
 * Derived only. Not persisted.
 *
 * GROUND-075 Current Capability Requirement Satisfaction States
 * + GROUND-076 Explicit Capability Requirement Set Composition Policy
 * + GROUND-078 Capability Requirement Set Composition Readiness Basis
 * → Capability Requirement Set Composition Result only.
 *
 * Does NOT consume GROUND-077 directly.
 *
 * composition condition HOLDS ≠ Capability truth
 * composition condition DOES_NOT_HOLD ≠ Capability absence
 * readiness DOES_NOT_HOLD ≠ composition DOES_NOT_HOLD
 * READY / PASS / FAIL / HAS_CAPABILITY vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
} from "./attention-observation-capability-requirement-satisfaction-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment,
  AttentionObservationCapabilityRequirementSetCompositionPolicyKind,
  AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment,
} from "./attention-observation-capability-requirement-set-composition-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment,
  AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment,
} from "./attention-observation-capability-requirement-set-composition-readiness-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-075 + 076 + 078 — not 077 direct / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementSetCompositionInput {
  capability_requirement_satisfaction_set: AttentionObservationCapabilityRequirementSatisfactionSetAssessment;
  capability_requirement_set_composition_policy_set: AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment;
  capability_requirement_set_composition_readiness_set: AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment;
}

/**
 * Exact Requirement-set composition-condition outcomes only.
 * Not CAPABILITY_PRESENT / HAS_CAPABILITY / PASS / FAIL / READY.
 */
export type AttentionObservationCapabilityRequirementSetCompositionOutcome =
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD";

export interface AttentionObservationCapabilityRequirementSetCompositionResultBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  requirement_set_composition_policy_key: string;
  requirement_set_composition_readiness_basis_key: string;
  composition_kind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind;
  capability_requirement_satisfaction_state_basis_keys: string[];
  outcome: AttentionObservationCapabilityRequirementSetCompositionOutcome;
}

export type AttentionObservationCapabilityRequirementSetCompositionStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY"
  | "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT";

export type AttentionObservationCapabilityRequirementSetCompositionModelLimitation =
  | "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_NOT_MODELED"
  | "CAPABILITY_COMPOSITION_INTERPRETATION_POLICY_NOT_MODELED"
  | "CAPABILITY_COMPOSITION_INTERPRETATION_BASIS_NOT_MODELED"
  | "CAPABILITY_STATE_NOT_MODELED"
  | "CAPABILITY_TRUTH_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_COMPOSITION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_RESOLVED_SUBSET_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_AS_UNSATISFIED_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_IGNORE_SEMANTICS_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment {
  candidate_key: string;
  capability_requirement_satisfaction_assessment: AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment;
  capability_requirement_set_composition_policy_assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment;
  capability_requirement_set_composition_readiness_assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment;
  status: AttentionObservationCapabilityRequirementSetCompositionStatus;
  composition_result_basis: AttentionObservationCapabilityRequirementSetCompositionResultBasis | null;
  model_limitations: AttentionObservationCapabilityRequirementSetCompositionModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementSetCompositionSetAssessment {
  capability_requirement_satisfaction_set: AttentionObservationCapabilityRequirementSatisfactionSetAssessment;
  capability_requirement_set_composition_policy_set: AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment;
  capability_requirement_set_composition_readiness_set: AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment[];
  has_capability_requirement_set_composition_result: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSetCompositionModelLimitation[];
}
