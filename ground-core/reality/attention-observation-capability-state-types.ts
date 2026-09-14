/**
 * Reality Core v0.7 — Attention Observation Capability State types (GROUND-083).
 *
 * Derived only. Not persisted.
 *
 * GROUND-082 Capability Interpretation Basis
 * → Capability State only.
 *
 * CAPABILITY_PRESENT / CAPABILITY_ABSENT are explicit-policy-derived only.
 * policy absent ≠ CAPABILITY_ABSENT
 * current-state unmapped ≠ CAPABILITY_ABSENT
 * CAPABILITY_PRESENT ≠ effective Capability / Permission / Resource / can_execute
 * HAS_CAPABILITY / LACKS_CAPABILITY / PARTIAL / PASS / FAIL are not used
 */

import type {
  AttentionCandidateObservationCapabilityInterpretationAssessment,
  AttentionObservationCapabilityInterpretationSetAssessment,
} from "./attention-observation-capability-interpretation-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-082 only — not 048–081 direct / persisted project state.
 */
export interface AttentionObservationCapabilityStateInput {
  capability_interpretation_set: AttentionObservationCapabilityInterpretationSetAssessment;
}

/**
 * Canonical current Capability State surface.
 * PRESENT / ABSENT require exact GROUND-082 Interpretation Basis.
 * Unresolved states preserve policy absence vs current-state unmapped.
 */
export type AttentionObservationCapabilityState =
  | "CAPABILITY_PRESENT"
  | "CAPABILITY_ABSENT"
  | "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE";

export interface AttentionObservationCapabilityStateBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  requirement_set_evaluation_state_basis_key: string;
  capability_state: AttentionObservationCapabilityState;
  capability_interpretation_basis_key: string | null;
  capability_interpretation_policy_key: string | null;
}

/**
 * Candidate-level status.
 * CAPABILITY_STATE_BASIS_PRESENT = state-record existence only (not polarity).
 */
export type AttentionObservationCapabilityStateCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "CAPABILITY_STATE_BASIS_PRESENT";

export type AttentionObservationCapabilityStateModelLimitation =
  | "CAPABILITY_TRUTH_BOOLEAN_NOT_MODELED"
  | "CAPABILITY_UNIVERSAL_POSSESSION_NOT_MODELED"
  | "CAPABILITY_UNIVERSAL_INCAPABILITY_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_STATE_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_STATE_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_STATE_HISTORY_NOT_MODELED"
  | "CAPABILITY_STATE_PERSISTENCE_NOT_MODELED"
  | "CAPABILITY_STATE_PARTIALITY_NOT_MODELED"
  | "ZERO_CAPABILITY_REQUIREMENT_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_DEFAULTS_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_INHERITANCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_AUTHORITY_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationCapabilityStateAssessment {
  candidate_key: string;
  capability_interpretation_assessment: AttentionCandidateObservationCapabilityInterpretationAssessment;
  status: AttentionObservationCapabilityStateCandidateStatus;
  capability_state_basis: AttentionObservationCapabilityStateBasis | null;
  has_capability_state: boolean;
  model_limitations: AttentionObservationCapabilityStateModelLimitation[];
}

export interface AttentionObservationCapabilityStateSetAssessment {
  capability_interpretation_set: AttentionObservationCapabilityInterpretationSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityStateAssessment[];
  has_capability_states: boolean;
  model_limitations: AttentionObservationCapabilityStateModelLimitation[];
}
