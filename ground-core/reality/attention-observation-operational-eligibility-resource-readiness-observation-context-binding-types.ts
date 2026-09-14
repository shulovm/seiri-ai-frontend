/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Observation-Context Binding types (GROUND-133).
 *
 * Derived only. Not persisted.
 *
 * GROUND-132 Explicit Observation Resource Requirement Set
 * + explicit RESOURCE_READINESS Observation-Context Binding Specification
 * → RESOURCE_READINESS Observation-Context Binding Foundation only.
 *
 * Binding ≠ ResourceDeclaration existence / match / availability / capacity
 * Binding ≠ reservation / commitment / allocation / selection / readiness
 * Binding ≠ FEASIBILITY / can_execute
 * Zero bindings ≠ RESOURCE_NOT_READY; one binding ≠ RESOURCE_READY
 */

import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "./attention-observation-resource-requirement-types.js";

/**
 * Specification entry: exact Observation Resource Requirement ↔ resource_declaration_id.
 * Does NOT supply evaluation instant, readiness verdict, or ResourceDeclaration lookup.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput {
  observation_resource_requirement_key: string;
  resource_declaration_id: string;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetInput {
  candidate_key: string;
  bindings: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification {
  candidate_binding_sets: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-132 + specification — not ProjectState / resource evidence.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingEvalInput {
  observation_resource_requirement_set: AttentionObservationResourceRequirementSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification;
}

/**
 * Runtime-only Observation Resource Requirement ↔ resource-side evidence-subject relation.
 * No ResourceDeclaration inspection / readiness / match verdict.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_declaration_id: string;
}

export type AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  | "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
  | "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT";

export interface AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment {
  observation_resource_requirement_key: string;
  resource_requirement: AttentionObservationResourceRequirement;
  bindings: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding[];
  has_resource_readiness_observation_context_bindings: boolean;
}

export type AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingModelLimitation =
  | "RESOURCE_DECLARATION_EXISTENCE_NOT_EVALUATED"
  | "RESOURCE_REQUIREMENT_TO_DECLARATION_MATCH_NOT_EVALUATED"
  | "OBSERVATION_RESOURCE_READINESS_EVALUATION_INSTANT_NOT_MODELED"
  | "OBSERVATION_RESOURCE_EVIDENCE_ASSESSMENT_NOT_MODELED"
  | "OBSERVATION_RESOURCE_QUANTITY_SUFFICIENCY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_PARTIAL_FULFILLMENT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment {
  candidate_key: string;
  observation_resource_requirement_set_assessment: AttentionCandidateObservationResourceRequirementSetAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingStatus;
  requirement_binding_assessments: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment[];
  bindings: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding[];
  has_resource_readiness_observation_context_bindings: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment {
  observation_resource_requirement_set: AttentionObservationResourceRequirementSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment[];
  has_resource_readiness_observation_context_bindings: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingModelLimitation[];
}
