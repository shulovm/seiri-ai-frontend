/**
 * Reality Core v0.7 — Attention Observation Capability Interpretation Basis
 * types (GROUND-082).
 *
 * Derived only. Not persisted.
 *
 * GROUND-080 Current Capability Requirement Set Evaluation State
 * + GROUND-081 Explicit Capability Interpretation Policy
 * → Capability Interpretation Basis only.
 *
 * Interpretation Basis ≠ Capability State
 * INTERPRET_AS_CAPABILITY_PRESENT ≠ current CAPABILITY_PRESENT
 * INTERPRET_AS_CAPABILITY_ABSENT ≠ current CAPABILITY_ABSENT
 * policy absent ≠ policy present but current state unmapped
 * no mapping ≠ INTERPRET_AS_CAPABILITY_ABSENT
 * no default HOLDS→PRESENT / DOES_NOT_HOLD→ABSENT
 */

import type {
  AttentionCandidateObservationCapabilityInterpretationPolicyAssessment,
  AttentionObservationCapabilityInterpretation,
  AttentionObservationCapabilityInterpretationMapping,
  AttentionObservationCapabilityInterpretationPolicySetAssessment,
} from "./attention-observation-capability-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment,
  AttentionObservationCapabilityRequirementSetEvaluationState,
  AttentionObservationCapabilityRequirementSetEvaluationStateSetAssessment,
} from "./attention-observation-capability-requirement-set-evaluation-state-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-080 + 081 — not 048–079 direct / persisted project state.
 */
export interface AttentionObservationCapabilityInterpretationInput {
  capability_requirement_set_evaluation_state_set: AttentionObservationCapabilityRequirementSetEvaluationStateSetAssessment;
  capability_interpretation_policy_set: AttentionObservationCapabilityInterpretationPolicySetAssessment;
}

/**
 * Exact current-state mapping lookup statuses.
 * Not CAPABILITY_PRESENT / CAPABILITY_ABSENT / HAS_CAPABILITY / UNKNOWN.
 */
export type AttentionObservationCapabilityInterpretationStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE"
  | "CAPABILITY_INTERPRETATION_BASIS_PRESENT";

export interface AttentionObservationCapabilityInterpretationBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  requirement_set_evaluation_state_basis_key: string;
  current_requirement_set_evaluation_state: AttentionObservationCapabilityRequirementSetEvaluationState;
  capability_interpretation_policy_key: string;
  matched_mapping: AttentionObservationCapabilityInterpretationMapping;
  interpretation: AttentionObservationCapabilityInterpretation;
}

export type AttentionObservationCapabilityInterpretationModelLimitation =
  | "CAPABILITY_STATE_NOT_MODELED"
  | "CAPABILITY_PRESENT_STATE_NOT_MODELED"
  | "CAPABILITY_ABSENT_STATE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_NO_MAPPING_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_WILDCARD_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_GROUPING_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_INHERITANCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_AUTHORITY_NOT_MODELED"
  | "ZERO_CAPABILITY_REQUIREMENT_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_TRUTH_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityInterpretationAssessment {
  candidate_key: string;
  capability_requirement_set_evaluation_state_assessment: AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment;
  capability_interpretation_policy_assessment: AttentionCandidateObservationCapabilityInterpretationPolicyAssessment;
  status: AttentionObservationCapabilityInterpretationStatus;
  interpretation_basis: AttentionObservationCapabilityInterpretationBasis | null;
  has_capability_interpretation_basis: boolean;
  model_limitations: AttentionObservationCapabilityInterpretationModelLimitation[];
}

export interface AttentionObservationCapabilityInterpretationSetAssessment {
  capability_requirement_set_evaluation_state_set: AttentionObservationCapabilityRequirementSetEvaluationStateSetAssessment;
  capability_interpretation_policy_set: AttentionObservationCapabilityInterpretationPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityInterpretationAssessment[];
  has_capability_interpretation_basis: boolean;
  model_limitations: AttentionObservationCapabilityInterpretationModelLimitation[];
}
