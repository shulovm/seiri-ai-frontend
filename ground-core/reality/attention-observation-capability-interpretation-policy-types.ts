/**
 * Reality Core v0.7 — Attention Observation Capability Interpretation Policy
 * types (GROUND-081).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement Set
 * + explicit Capability Interpretation Policy Specification
 * → Explicit Capability Interpretation Policy Foundation only.
 *
 * Type-only dependency on GROUND-080 Evaluation State vocabulary.
 * No runtime dependency on GROUND-080 current Evaluation State / 079 / 075–078.
 *
 * Capability Interpretation Policy ≠ Capability Interpretation Basis
 * Capability Interpretation Policy ≠ Capability State
 * INTERPRET_AS_CAPABILITY_PRESENT ≠ current CAPABILITY_PRESENT
 * INTERPRET_AS_CAPABILITY_ABSENT ≠ current CAPABILITY_ABSENT
 * policy absence ≠ explicit empty policy
 * no default HOLDS→PRESENT / DOES_NOT_HOLD→ABSENT
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type { AttentionObservationCapabilityRequirementSetEvaluationState } from "./attention-observation-capability-requirement-set-evaluation-state-types.js";

/**
 * Declarative Capability-level interpretation targets only.
 * Not current CAPABILITY_PRESENT / CAPABILITY_ABSENT / HAS_CAPABILITY.
 */
export type AttentionObservationCapabilityInterpretation =
  | "INTERPRET_AS_CAPABILITY_PRESENT"
  | "INTERPRET_AS_CAPABILITY_ABSENT";

/**
 * Atomic source Evaluation State → interpretation pair.
 * One exact GROUND-080 vocabulary state + one exact interpretation.
 */
export interface AttentionObservationCapabilityInterpretationMapping {
  evaluation_state: AttentionObservationCapabilityRequirementSetEvaluationState;
  interpretation: AttentionObservationCapabilityInterpretation;
}

/**
 * Policy specification entry anchored to exact GROUND-048 Candidate context.
 * Does NOT independently supply Requirement keys or current Evaluation State.
 */
export interface AttentionObservationCapabilityInterpretationPolicyInput {
  candidate_key: string;
  mappings: AttentionObservationCapabilityInterpretationMapping[];
}

export interface AttentionObservationCapabilityInterpretationPolicySpecification {
  policies: AttentionObservationCapabilityInterpretationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 + specification — not GROUND-080 runtime state.
 */
export interface AttentionObservationCapabilityInterpretationPolicyEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityInterpretationPolicySpecification;
}

/**
 * Runtime-only Capability Interpretation Policy declaration.
 * Anchored to exact non-empty GROUND-048 Requirement set.
 * No current_evaluation_state / capability_state / has_capability.
 */
export interface AttentionObservationCapabilityInterpretationPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  capability_requirement_keys: string[];
  mappings: AttentionObservationCapabilityInterpretationMapping[];
}

export type AttentionObservationCapabilityInterpretationPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
  | "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT";

export type AttentionObservationCapabilityInterpretationPolicyModelLimitation =
  | "CAPABILITY_INTERPRETATION_EVALUATION_NOT_MODELED"
  | "CAPABILITY_STATE_NOT_MODELED"
  | "CAPABILITY_PRESENT_STATE_NOT_MODELED"
  | "CAPABILITY_ABSENT_STATE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_DEFAULTS_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_GROUPING_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_WILDCARD_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_INHERITANCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_INTERPRETATION_POLICY_AUTHORITY_NOT_MODELED"
  | "ZERO_CAPABILITY_REQUIREMENT_FINAL_SEMANTICS_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityInterpretationPolicyAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationCapabilityInterpretationPolicyStatus;
  capability_interpretation_policy: AttentionObservationCapabilityInterpretationPolicy | null;
  model_limitations: AttentionObservationCapabilityInterpretationPolicyModelLimitation[];
}

export interface AttentionObservationCapabilityInterpretationPolicySetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityInterpretationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityInterpretationPolicyAssessment[];
  has_explicit_capability_interpretation_policies: boolean;
  model_limitations: AttentionObservationCapabilityInterpretationPolicyModelLimitation[];
}
