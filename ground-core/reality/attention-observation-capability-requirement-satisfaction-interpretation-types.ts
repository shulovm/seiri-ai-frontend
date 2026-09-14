/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Satisfaction
 * Interpretation Basis types (GROUND-074).
 *
 * Derived only. Not persisted.
 *
 * GROUND-072 Current Capability Requirement Evaluation State
 * + GROUND-073 Explicit Satisfaction Interpretation Policy
 * → Capability Requirement Satisfaction Interpretation Basis only.
 *
 * Interpretation Basis ≠ Satisfaction State
 * INTERPRET_AS_SATISFIED ≠ current SATISFIED
 * INTERPRET_AS_UNSATISFIED ≠ current UNSATISFIED
 * policy absent ≠ policy present but no mapping
 * no mapping ≠ INTERPRET_AS_UNSATISFIED
 * no default HOLDS→SATISFIED / DOES_NOT_HOLD→UNSATISFIED
 */

import type {
  AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment,
  AttentionObservationCapabilityRequirementEvaluationAssessment,
  AttentionObservationCapabilityRequirementEvaluationState,
  AttentionObservationCapabilityRequirementEvaluationStateSetAssessment,
} from "./attention-observation-capability-requirement-evaluation-state-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretation,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySetAssessment,
} from "./attention-observation-capability-requirement-satisfaction-interpretation-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-072 + 073 — not 048–071 direct / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationInput {
  capability_requirement_evaluation_state_set: AttentionObservationCapabilityRequirementEvaluationStateSetAssessment;
  capability_requirement_satisfaction_interpretation_policy_set: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySetAssessment;
}

/**
 * Exact current-state mapping lookup statuses.
 * Not SATISFIED / UNSATISFIED / PASS / FAIL / UNKNOWN.
 */
export type AttentionObservationCapabilityRequirementSatisfactionInterpretationStatus =
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
  | "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT";

/**
 * Exact matched mapping snapshot (policy-local atomic pair; not persisted).
 */
export type AttentionObservationCapabilityRequirementSatisfactionInterpretationMappingRef =
  AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping;

export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationBasis {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  requirement_evaluation_state_basis_key: string;
  current_requirement_evaluation_state: AttentionObservationCapabilityRequirementEvaluationState;
  satisfaction_interpretation_policy_key: string;
  matched_mapping: AttentionObservationCapabilityRequirementSatisfactionInterpretationMappingRef;
  interpretation: AttentionObservationCapabilityRequirementSatisfactionInterpretation;
}

export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  requirement_evaluation_assessment: AttentionObservationCapabilityRequirementEvaluationAssessment;
  satisfaction_interpretation_policy_assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment;
  status: AttentionObservationCapabilityRequirementSatisfactionInterpretationStatus;
  interpretation_basis: AttentionObservationCapabilityRequirementSatisfactionInterpretationBasis | null;
}

export type AttentionObservationCapabilityRequirementSatisfactionInterpretationCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_REPRESENTED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_PRESENT";

export type AttentionObservationCapabilityRequirementSatisfactionInterpretationModelLimitation =
  | "CAPABILITY_REQUIREMENT_SATISFACTION_STATE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFIED_STATE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNSATISFIED_STATE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_NO_INTERPRETATION_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_INTERPRETATION_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_INTERPRETATION_WILDCARD_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_INTERPRETATION_GROUPING_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_INTERPRETATION_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_INTERPRETATION_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_INTERPRETATION_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_EFFECTIVE_STATE_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment {
  candidate_key: string;
  requirement_evaluation_state_assessment: AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment;
  satisfaction_interpretation_policy_assessment: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment;
  status: AttentionObservationCapabilityRequirementSatisfactionInterpretationCandidateStatus;
  requirement_satisfaction_interpretation_assessments: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment[];
  has_capability_requirement_satisfaction_interpretation_basis: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSatisfactionInterpretationModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationSetAssessment {
  capability_requirement_evaluation_state_set: AttentionObservationCapabilityRequirementEvaluationStateSetAssessment;
  capability_requirement_satisfaction_interpretation_policy_set: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment[];
  has_capability_requirement_satisfaction_interpretation_basis: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSatisfactionInterpretationModelLimitation[];
}
