/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Composition Readiness Basis types (GROUND-078).
 *
 * Derived only. Not persisted.
 *
 * GROUND-075 Current Capability Requirement Satisfaction States
 * + GROUND-077 Explicit Capability Requirement Set Composition Readiness Policy
 * → Capability Requirement Set Composition Readiness Basis only.
 *
 * Does NOT consume GROUND-076 Requirement Set Composition Policy.
 *
 * readiness policy condition HOLDS ≠ Requirement-set composition result
 * readiness policy condition DOES_NOT_HOLD ≠ Capability absence
 * resolved = SATISFIED or UNSATISFIED
 * resolved ≠ SATISFIED-only
 * all resolved ≠ all SATISFIED
 * READY / NOT_READY vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionState,
} from "./attention-observation-capability-requirement-satisfaction-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessPolicyAssessment,
  AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyKind,
  AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySetAssessment,
} from "./attention-observation-capability-requirement-set-composition-readiness-policy-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-075 + GROUND-077 only — not 076 / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementSetCompositionReadinessInput {
  capability_requirement_satisfaction_set: AttentionObservationCapabilityRequirementSatisfactionSetAssessment;
  capability_requirement_set_composition_readiness_policy_set: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySetAssessment;
}

/**
 * Exact readiness-policy-condition outcomes only.
 * Not READY / NOT_READY / PASS / FAIL / CAPABILITY_PRESENT.
 */
export type AttentionObservationCapabilityRequirementSetCompositionReadinessOutcome =
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

export type AttentionObservationCapabilityRequirementSetCompositionUnresolvedSatisfactionState =
  | "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE";

export interface AttentionObservationCapabilityRequirementSetCompositionUnresolvedRequirementRef {
  capability_requirement_key: string;
  satisfaction_state_basis_key: string;
  unresolved_satisfaction_state: AttentionObservationCapabilityRequirementSetCompositionUnresolvedSatisfactionState;
}

export interface AttentionObservationCapabilityRequirementSetCompositionReadinessBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  readiness_policy_key: string;
  readiness_kind: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyKind;
  capability_requirement_satisfaction_state_basis_keys: string[];
  unresolved_requirement_refs: AttentionObservationCapabilityRequirementSetCompositionUnresolvedRequirementRef[];
  outcome: AttentionObservationCapabilityRequirementSetCompositionReadinessOutcome;
}

export type AttentionObservationCapabilityRequirementSetCompositionReadinessStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT";

export type AttentionObservationCapabilityRequirementSetCompositionReadinessModelLimitation =
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_STATE_NOT_MODELED"
  | "CAPABILITY_TRUTH_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_READINESS_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_RESOLVED_SUBSET_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_AS_UNSATISFIED_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_IGNORE_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_READINESS_PARTIALITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_READINESS_SCORE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_READINESS_THRESHOLD_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_READINESS_WEIGHTING_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_READINESS_MAJORITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_READINESS_VETO_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_MANDATORY_GROUPS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_ALTERNATIVE_GROUPS_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment {
  candidate_key: string;
  capability_requirement_satisfaction_assessment: AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment;
  capability_requirement_set_composition_readiness_policy_assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessPolicyAssessment;
  status: AttentionObservationCapabilityRequirementSetCompositionReadinessStatus;
  readiness_basis: AttentionObservationCapabilityRequirementSetCompositionReadinessBasis | null;
  model_limitations: AttentionObservationCapabilityRequirementSetCompositionReadinessModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment {
  capability_requirement_satisfaction_set: AttentionObservationCapabilityRequirementSatisfactionSetAssessment;
  capability_requirement_set_composition_readiness_policy_set: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment[];
  has_capability_requirement_set_composition_readiness_basis: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSetCompositionReadinessModelLimitation[];
}
