/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Satisfaction
 * State types (GROUND-075).
 *
 * Derived only. Not persisted.
 *
 * GROUND-074 Capability Requirement Satisfaction Interpretation Basis
 * → Capability Requirement Satisfaction State only.
 *
 * SATISFIED / UNSATISFIED are explicit-policy-derived only.
 * policy absent ≠ UNSATISFIED
 * current-state unmapped ≠ UNSATISFIED
 * SATISFIED ≠ effective Capability / Permission / Resource / can_execute
 * PARTIALLY_SATISFIED / PASS / FAIL / UNKNOWN are not used
 */

import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationSetAssessment,
} from "./attention-observation-capability-requirement-satisfaction-interpretation-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-074 only — not 048–073 direct / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementSatisfactionInput {
  capability_requirement_satisfaction_interpretation_set: AttentionObservationCapabilityRequirementSatisfactionInterpretationSetAssessment;
}

/**
 * Canonical current Capability Requirement Satisfaction State surface.
 * SATISFIED / UNSATISFIED require exact GROUND-074 Interpretation Basis.
 * Unresolved states preserve policy absence vs current-state unmapped.
 */
export type AttentionObservationCapabilityRequirementSatisfactionState =
  | "SATISFIED"
  | "UNSATISFIED"
  | "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE";

export interface AttentionObservationCapabilityRequirementSatisfactionStateBasis {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  requirement_evaluation_state_basis_key: string;
  satisfaction_state: AttentionObservationCapabilityRequirementSatisfactionState;
  satisfaction_interpretation_basis_key: string | null;
  satisfaction_interpretation_policy_key: string | null;
}

export interface AttentionObservationCapabilityRequirementSatisfactionAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  satisfaction_interpretation_assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment;
  satisfaction_state_basis: AttentionObservationCapabilityRequirementSatisfactionStateBasis;
}

export type AttentionObservationCapabilityRequirementSatisfactionCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_STATES_PRESENT";

export type AttentionObservationCapabilityRequirementSatisfactionModelLimitation =
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_HISTORY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_PERSISTENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_INHERITANCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_DEFAULTS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment {
  candidate_key: string;
  satisfaction_interpretation_assessment: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment;
  status: AttentionObservationCapabilityRequirementSatisfactionCandidateStatus;
  requirement_satisfaction_assessments: AttentionObservationCapabilityRequirementSatisfactionAssessment[];
  has_capability_requirement_satisfaction_states: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSatisfactionModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementSatisfactionSetAssessment {
  capability_requirement_satisfaction_interpretation_set: AttentionObservationCapabilityRequirementSatisfactionInterpretationSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment[];
  has_capability_requirement_satisfaction_states: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSatisfactionModelLimitation[];
}
