/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Evaluation State types (GROUND-080).
 *
 * Derived only. Not persisted.
 *
 * GROUND-079 Capability Requirement Set Composition Result
 * → Capability Requirement Set Evaluation State only.
 *
 * composition condition HOLDS ≠ Capability truth
 * composition condition DOES_NOT_HOLD ≠ Capability absence
 * readiness DOES_NOT_HOLD ≠ composition DOES_NOT_HOLD
 * missing composition policy ≠ missing readiness policy
 * HAS_CAPABILITY / LACKS_CAPABILITY / UNKNOWN vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment,
  AttentionObservationCapabilityRequirementSetCompositionSetAssessment,
} from "./attention-observation-capability-requirement-set-composition-result-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-079 only — not 048–078 direct / persisted project state.
 */
export interface AttentionObservationCapabilityRequirementSetEvaluationStateInput {
  capability_requirement_set_composition_set: AttentionObservationCapabilityRequirementSetCompositionSetAssessment;
}

/**
 * Exact five current non-empty Requirement-set Evaluation States.
 * Not HAS_CAPABILITY / LACKS_CAPABILITY / UNKNOWN / PASS / FAIL / PARTIAL.
 */
export type AttentionObservationCapabilityRequirementSetEvaluationState =
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD"
  | "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_DECLARED"
  | "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED"
  | "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

export interface AttentionObservationCapabilityRequirementSetEvaluationStateBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  state: AttentionObservationCapabilityRequirementSetEvaluationState;
  requirement_set_composition_result_basis_key: string | null;
  requirement_set_composition_readiness_basis_key: string | null;
}

export type AttentionObservationCapabilityRequirementSetEvaluationStateCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT";

export type AttentionObservationCapabilityRequirementSetEvaluationStateModelLimitation =
  | "CAPABILITY_COMPOSITION_INTERPRETATION_POLICY_NOT_MODELED"
  | "CAPABILITY_COMPOSITION_INTERPRETATION_BASIS_NOT_MODELED"
  | "CAPABILITY_STATE_NOT_MODELED"
  | "CAPABILITY_TRUTH_NOT_MODELED"
  | "CAPABILITY_ABSENCE_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_HISTORY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PERSISTENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_READINESS_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_READINESS_DOES_NOT_HOLD_FINAL_SEMANTICS_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment {
  candidate_key: string;
  capability_requirement_set_composition_assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment;
  status: AttentionObservationCapabilityRequirementSetEvaluationStateCandidateStatus;
  evaluation_state_basis: AttentionObservationCapabilityRequirementSetEvaluationStateBasis | null;
  has_capability_requirement_set_evaluation_state: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSetEvaluationStateModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementSetEvaluationStateSetAssessment {
  capability_requirement_set_composition_set: AttentionObservationCapabilityRequirementSetCompositionSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment[];
  has_capability_requirement_set_evaluation_states: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSetEvaluationStateModelLimitation[];
}
