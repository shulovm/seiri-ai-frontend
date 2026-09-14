/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Policy types (GROUND-145).
 *
 * Derived only. Not persisted.
 *
 * GROUND-133 RESOURCE_READINESS Observation-Context Binding Set
 * + explicit Binding Evidence Composition Policy Specification
 * → Explicit per-requirement Binding Evidence Composition Policy only.
 *
 * Declaration only — does NOT consume current GROUND-141 States.
 * ANY/ALL declaration ≠ CONDITION_HOLDS / Resource Readiness / OE
 * policy absence ≠ ANY ≠ ALL ≠ CONDITION_DOES_NOT_HOLD
 * logical ANY ≠ alternative physical resources
 * logical ALL ≠ cumulative physical supply
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";

/**
 * Explicit future logical composition operators over GROUND-141
 * binding evidence-condition operands.
 * Declaration only — not executed against current States.
 */
export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind =
  | "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS"
  | "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD";

/**
 * Specification entry anchored to exact Observation Resource Requirement.
 * Member keys are exact GROUND-133 binding keys. No current-State fields.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput {
  observation_resource_requirement_key: string;
  member_binding_keys: string[];
  composition_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification {
  requirement_policies: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-133 + specification — not GROUND-141 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyEvalInput {
  resource_readiness_observation_context_binding_set: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification;
}

/**
 * Runtime-only per-requirement Binding Evidence Composition Policy declaration.
 * No current_binding_states / composition_result / CONDITION_HOLDS.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  member_binding_keys: string[];
  composition_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind;
}

export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyStatus =
  | "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_DECLARED"
  | "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyModelLimitation =
  | "CURRENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_NOT_CONSUMED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_NOT_MODELED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_NOT_MODELED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_NOT_MODELED"
  | "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED"
  | "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED"
  | "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED"
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

export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment {
  observation_resource_requirement_key: string;
  requirement_binding_assessment: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyStatus;
  policy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy | null;
  has_explicit_resource_readiness_binding_evidence_composition_policy: boolean;
}

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment {
  candidate_key: string;
  resource_readiness_observation_context_binding_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment;
  requirement_policy_assessments: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment[];
  has_explicit_resource_readiness_binding_evidence_composition_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment {
  resource_readiness_observation_context_binding_set: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment[];
  has_explicit_resource_readiness_binding_evidence_composition_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyModelLimitation[];
}
