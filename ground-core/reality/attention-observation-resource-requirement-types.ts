/**
 * Reality Core v0.7 — Attention Observation Resource Requirement types (GROUND-132).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement Set
 * + explicit Observation Resource Requirement Specification
 * → Explicit Observation Resource Requirement Set Assessment only.
 *
 * Observation Resource Requirement ≠ Capability Requirement
 * Observation Resource Requirement ≠ ObservationNeed demand
 * Observation Resource Requirement ≠ ResourceDeclaration / availability / readiness
 * Requirement absence ≠ zero need / readiness satisfied
 * explicit empty requirement set ≠ absence / ≠ readiness satisfied
 */

import type {
  ResourceRequirementAmount,
  ResourceScope,
} from "../types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";

/** Opaque exact-match resource unit identity. */
export type ResourceUnit = string;

/**
 * Runtime evaluation input — not canonical persisted Observation resource policy.
 * No ResourceDeclaration / intervention_id / holder / provider binding.
 */
export interface AttentionObservationResourceRequirementInput {
  resource_key: string;
  unit: ResourceUnit;
  resource_scope: ResourceScope;
  required_amount: ResourceRequirementAmount;
  valid_from: string | null;
  valid_until: string | null;
}

export interface AttentionObservationResourceRequirementSetInput {
  candidate_key: string;
  requirements: AttentionObservationResourceRequirementInput[];
}

export interface AttentionObservationResourceRequirementSpecification {
  candidate_requirement_sets: AttentionObservationResourceRequirementSetInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 + specification — not GROUND-084 / resource evidence.
 */
export interface AttentionObservationResourceRequirementEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationResourceRequirementSpecification;
}

export type AttentionObservationResourceRequirementSetStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  | "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT";

/**
 * Explicit Candidate × ObservationNeed × Capability Requirement-set resource demand.
 * Not ResourceDeclaration / availability / capacity / reservation / readiness.
 */
export interface AttentionObservationResourceRequirement {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  resource_key: string;
  unit: ResourceUnit;
  resource_scope: ResourceScope;
  required_amount: ResourceRequirementAmount;
  valid_from: string | null;
  valid_until: string | null;
}

export type AttentionObservationResourceRequirementModelLimitation =
  | "OBSERVATION_RESOURCE_READINESS_CONTEXT_BINDING_NOT_MODELED"
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

export interface AttentionCandidateObservationResourceRequirementSetAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationResourceRequirementSetStatus;
  resource_requirements: AttentionObservationResourceRequirement[];
  has_explicit_observation_resource_requirement_set: boolean;
  has_observation_resource_requirements: boolean;
  model_limitations: AttentionObservationResourceRequirementModelLimitation[];
}

export interface AttentionObservationResourceRequirementSetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationResourceRequirementSpecification;
  candidate_assessments: AttentionCandidateObservationResourceRequirementSetAssessment[];
  has_explicit_observation_resource_requirement_sets: boolean;
  has_observation_resource_requirements: boolean;
  model_limitations: AttentionObservationResourceRequirementModelLimitation[];
}
