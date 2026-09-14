/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Composition Readiness Policy types (GROUND-077).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement Set
 * + explicit Requirement Set Composition Readiness Policy Specification
 * → Explicit Capability Requirement Set Composition Readiness Policy Foundation only.
 *
 * No runtime dependency on GROUND-075 Satisfaction States.
 * No runtime dependency on GROUND-076 Composition Policy.
 *
 * Readiness Policy ≠ Readiness Basis ≠ Composition Result
 * all resolved ≠ all SATISFIED
 * UNSATISFIED is a resolved Satisfaction State (future 078)
 * policy absence ≠ ready ≠ not-ready
 * 076 ANY/ALL does not determine readiness policy
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Whole-set Requirement composition readiness prerequisite kinds.
 * Declaration only — not evaluated against current Satisfaction States.
 *
 * Future resolved Satisfaction States (GROUND-078 classification only):
 *   SATISFIED
 *   UNSATISFIED
 * Future unresolved Satisfaction States (GROUND-078 classification only):
 *   UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY
 *   UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE
 *
 * resolved = SATISFIED or UNSATISFIED
 * resolved ≠ SATISFIED-only
 * all resolved ≠ all SATISFIED
 */
export type AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyKind =
  "REQUIRE_ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_RESOLVED_BEFORE_COMPOSITION";

/**
 * Policy specification entry anchored to exact GROUND-048 Candidate context.
 * Does NOT independently supply Requirement keys.
 */
export interface AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyInput {
  candidate_key: string;
  readiness_kind: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyKind;
}

export interface AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySpecification {
  policies: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 + specification — not GROUND-075 / GROUND-076.
 */
export interface AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySpecification;
}

/**
 * Runtime-only Requirement Set Composition Readiness Policy declaration.
 * Anchored to exact non-empty GROUND-048 Requirement set.
 * No current_satisfaction_states / readiness_result / composition_result.
 */
export interface AttentionObservationCapabilityRequirementSetCompositionReadinessPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  capability_requirement_keys: string[];
  readiness_kind: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyKind;
}

export type AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT";

export type AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyModelLimitation =
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_EVALUATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_SATISFACTION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_READINESS_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SET_RESOLVED_SUBSET_COMPOSITION_NOT_MODELED"
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
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_TRUTH_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessPolicyAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyStatus;
  capability_requirement_set_composition_readiness_policy: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicy | null;
  model_limitations: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessPolicyAssessment[];
  has_explicit_capability_requirement_set_composition_readiness_policies: boolean;
  model_limitations: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyModelLimitation[];
}
