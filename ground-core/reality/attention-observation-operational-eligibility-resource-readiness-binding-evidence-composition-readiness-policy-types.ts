/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Readiness Policy types (GROUND-146).
 *
 * Derived only. Not persisted.
 *
 * GROUND-145 Binding Evidence Composition Policy Set
 * + explicit Composition Readiness Policy Specification
 * → Explicit Binding Evidence Composition Readiness Policy only.
 *
 * Declaration only — does NOT consume current GROUND-141 States.
 * readiness policy ≠ readiness currently HOLDS
 * policy PRESENT ≠ CONDITION_HOLDS / Resource Readiness
 * NO_READINESS_POLICY ≠ readiness DOES_NOT_HOLD
 * NOT_APPLICABLE ≠ readiness failure
 * all-selected-resolved ≠ all POSITIVE
 * NEGATIVE is resolved; resolved ≠ positive
 * ANY/ALL short-circuit readiness not modeled
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";

/**
 * Sole supported readiness rule for selected GROUND-145 members.
 * Declaration only — not evaluated against current GROUND-141 States.
 *
 * Conceptual GROUND-141 resolved States (documentation only):
 *   EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE
 *   EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE
 * Conceptual GROUND-141 unresolved States (documentation only):
 *   UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY
 *   UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE
 *
 * resolved = POSITIVE or NEGATIVE (not POSITIVE-only)
 * all resolved ≠ all POSITIVE
 */
export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind =
  "REQUIRE_ALL_SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_RESOLVED_BEFORE_COMPOSITION";

/**
 * Specification entry anchored to exact GROUND-145 Composition Policy key.
 * Does NOT independently supply member keys / composition kind / requirement identity.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyInput {
  resource_readiness_binding_evidence_composition_policy_key: string;
  readiness_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification {
  composition_readiness_policies: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-145 + specification — not GROUND-141 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyEvalInput {
  resource_readiness_binding_evidence_composition_policy_set: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification;
}

/**
 * Runtime-only Composition Readiness Policy declaration.
 * No current_binding_states / readiness_result / CONDITION_HOLDS.
 * member_binding_keys / composition_kind are stable lineage from GROUND-145.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  resource_readiness_binding_evidence_composition_policy_key: string;
  member_binding_keys: string[];
  composition_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind;
  readiness_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind;
}

export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
  | "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
  | "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyModelLimitation =
  | "CURRENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_NOT_CONSUMED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_NOT_MODELED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED"
  | "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED"
  | "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED"
  | "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED"
  | "BOOLEAN_SHORT_CIRCUIT_COMPOSITION_READINESS_NOT_MODELED"
  | "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED"
  | "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED"
  | "RESOURCE_FUNGIBILITY_NOT_MODELED"
  | "RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED"
  | "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED"
  | "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED"
  | "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment {
  observation_resource_requirement_key: string;
  binding_evidence_composition_policy_assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyStatus;
  readiness_policy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy | null;
  has_explicit_resource_readiness_binding_evidence_composition_readiness_policy: boolean;
}

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyAssessment {
  candidate_key: string;
  resource_readiness_binding_evidence_composition_policy_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment;
  requirement_readiness_policy_assessments: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment[];
  has_explicit_resource_readiness_binding_evidence_composition_readiness_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySetAssessment {
  resource_readiness_binding_evidence_composition_policy_set: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyAssessment[];
  has_explicit_resource_readiness_binding_evidence_composition_readiness_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyModelLimitation[];
}
