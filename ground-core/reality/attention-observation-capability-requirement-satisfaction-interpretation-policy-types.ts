/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Satisfaction
 * Interpretation Policy types (GROUND-073).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement
 * + explicit Satisfaction Interpretation Policy Specification
 * → Explicit Satisfaction Interpretation Policy Foundation only.
 *
 * Type-only vocabulary dependency on GROUND-072 Evaluation State enum.
 * Does NOT consume GROUND-072 runtime assessments / current states.
 *
 * Interpretation Policy ≠ Satisfaction Interpretation Result
 * INTERPRET_AS_SATISFIED ≠ current Requirement SATISFIED
 * INTERPRET_AS_UNSATISFIED ≠ current Requirement UNSATISFIED
 * policy absence ≠ empty policy ≠ reject-all ≠ accept-all
 * no default HOLDS→SATISFIED / DOES_NOT_HOLD→UNSATISFIED
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionObservationCapabilityRequirementEvaluationState,
} from "./attention-observation-capability-requirement-evaluation-state-types.js";

/**
 * Policy declaration targets only.
 * Not current SATISFIED / UNSATISFIED / PARTIALLY_SATISFIED / PASS / FAIL.
 */
export type AttentionObservationCapabilityRequirementSatisfactionInterpretation =
  | "INTERPRET_AS_SATISFIED"
  | "INTERPRET_AS_UNSATISFIED";

/**
 * Atomic Evaluation State → interpretation pair.
 * One mapping per exact Evaluation State within one Requirement policy.
 */
export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping {
  evaluation_state: AttentionObservationCapabilityRequirementEvaluationState;
  interpretation: AttentionObservationCapabilityRequirementSatisfactionInterpretation;
}

export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyInput {
  capability_requirement_key: string;
  mappings: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[];
}

export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification {
  policies: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 + specification — not 072 runtime / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification;
}

/**
 * Runtime-only Requirement Satisfaction Interpretation Policy declaration.
 * Anchored to exact GROUND-048 Capability Requirement identity.
 * No current_state / current_satisfaction / result fields.
 */
export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicy {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  mappings: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[];
}

export type AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyStatus =
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT";

export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  status: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyStatus;
  satisfaction_interpretation_policy: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicy | null;
}

export type AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICIES_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICIES_PRESENT";

export type AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyModelLimitation =
  | "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_EVALUATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_COMPLETENESS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_DEFAULTS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_INHERITANCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_EVALUATION_STATE_GROUPING_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyCandidateStatus;
  requirement_satisfaction_interpretation_policy_assessments: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment[];
  has_explicit_capability_requirement_satisfaction_interpretation_policies: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment[];
  has_explicit_capability_requirement_satisfaction_interpretation_policies: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyModelLimitation[];
}
