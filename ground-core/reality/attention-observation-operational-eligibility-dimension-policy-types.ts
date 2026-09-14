/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Dimension
 * Policy types (GROUND-084).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement Set
 * + explicit Operational Eligibility Dimension Policy Specification
 * → Explicit Observer Operational Eligibility Dimension Policy Foundation only.
 *
 * No runtime dependency on GROUND-083 Capability State / Permission / Authority /
 * Resource / Feasibility current states.
 *
 * Operational Eligibility Dimension Policy ≠ Operational Eligibility State
 * required dimension ≠ accepted value ≠ current state ≠ AND composition
 * policy absence ≠ explicit empty policy
 * Capability State remains an independent dimension, not effective Capability
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Independent operational axes that may participate in a future Operational
 * Eligibility evaluation. Declaration only — not current values.
 */
export type AttentionObservationOperationalEligibilityDimension =
  | "CAPABILITY_STATE"
  | "PERMISSION"
  | "AUTHORITY"
  | "RESOURCE_READINESS"
  | "FEASIBILITY";

/**
 * Policy specification entry anchored to exact GROUND-048 Candidate context.
 * Does NOT independently supply Requirement keys or current dimension states.
 */
export interface AttentionObservationOperationalEligibilityDimensionPolicyInput {
  candidate_key: string;
  required_dimensions: AttentionObservationOperationalEligibilityDimension[];
}

export interface AttentionObservationOperationalEligibilityDimensionPolicySpecification {
  policies: AttentionObservationOperationalEligibilityDimensionPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 + specification — not GROUND-083 runtime state.
 */
export interface AttentionObservationOperationalEligibilityDimensionPolicyEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationOperationalEligibilityDimensionPolicySpecification;
}

/**
 * Runtime-only Operational Eligibility Dimension Policy declaration.
 * Anchored to exact non-empty GROUND-048 Requirement set.
 * No current capability_state / permission_state / feasibility_state / can_execute.
 */
export interface AttentionObservationOperationalEligibilityDimensionPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  capability_requirement_keys: string[];
  required_dimensions: AttentionObservationOperationalEligibilityDimension[];
}

export type AttentionObservationOperationalEligibilityDimensionPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityDimensionPolicyModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_DIMENSION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_DIMENSION_COVERAGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_DIMENSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_DIMENSION_OUTCOME_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_READINESS_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_COMPOSITION_READINESS_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_POLICY_COMPLETENESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_POLICY_DEFAULTS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_POLICY_PRECEDENCE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_POLICY_INHERITANCE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_POLICY_PROVENANCE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_POLICY_AUTHORITY_NOT_MODELED"
  | "EFFECTIVE_VERIFICATION_OPERATIONAL_ROLE_NOT_MODELED"
  | "EFFECTIVE_CAPABILITY_AVAILABILITY_OPERATIONAL_ROLE_NOT_MODELED"
  | "OBSERVATION_CONTEXT_APPLICABILITY_OPERATIONAL_ROLE_NOT_MODELED"
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationOperationalEligibilityDimensionPolicyStatus;
  operational_eligibility_dimension_policy: AttentionObservationOperationalEligibilityDimensionPolicy | null;
  model_limitations: AttentionObservationOperationalEligibilityDimensionPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityDimensionPolicySetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationOperationalEligibilityDimensionPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[];
  has_explicit_operational_eligibility_dimension_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityDimensionPolicyModelLimitation[];
}
