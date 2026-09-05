/**
 * Reality Core v0.7 — Attention Observation Capability Requirement types (GROUND-048).
 *
 * Derived only. Not persisted.
 *
 * Observation Planning Basis + explicit Capability Requirement Specification
 * → Capability Requirement Basis only.
 *
 * EvidenceRequirement ≠ ObservationCapabilityRequirement
 * Capability requirement ≠ CapabilityDeclaration / Verification / Availability
 * Capability requirement ≠ actor / Permission / Authority / can_execute
 */

import type {
  AttentionCandidateObservationPlanningAssessment,
  AttentionObservationPlanningSetAssessment,
} from "./attention-observation-planning-types.js";

/**
 * Actor-independent opaque exact-match capability semantic identity.
 * Same semantics as CapabilityDeclaration.capability_key
 * and InterventionCapabilityRequirementDeclaration.capability_key (GROUND-021/023).
 * Not CapabilityDeclaration.id (actor/holder-specific).
 */
export type CanonicalCapabilitySemanticKey = string;

/**
 * Runtime evaluation input — not canonical persisted Observation capability policy.
 * No provenance / Authority / hard-soft strength.
 */
export interface AttentionObservationCapabilityRequirementInput {
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
}

export interface AttentionObservationCapabilityRequirementSpecification {
  requirements: AttentionObservationCapabilityRequirementInput[];
}

/**
 * Combined evaluation input.
 */
export interface AttentionObservationCapabilityRequirementEvalInput {
  planning_set: AttentionObservationPlanningSetAssessment;
  specification: AttentionObservationCapabilityRequirementSpecification;
}

export type AttentionObservationCapabilityRequirementStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";

/**
 * Explicit ObservationNeed-relative Capability semantic requirement.
 * Not actor_id / CapabilityDeclaration.id / verification / availability.
 */
export interface AttentionObservationCapabilityRequirement {
  key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
}

/**
 * Descriptive requirement set for one ObservationNeed.
 * Empty requirements ≠ no capabilities needed / any actor qualifies.
 */
export interface AttentionObservationCapabilityRequirementBasis {
  observation_need_key: string;
  requirements: AttentionObservationCapabilityRequirement[];
}

export type AttentionObservationCapabilityRequirementModelLimitation =
  | "CAPABILITY_REQUIREMENT_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_STRENGTH_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_NEGATION_NOT_MODELED"
  | "EVIDENCE_REQUIREMENT_TO_CAPABILITY_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "OBSERVATION_TARGET_TO_CAPABILITY_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "TEMPORAL_SCOPE_TO_CAPABILITY_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "OBSERVER_CANDIDATES_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_MATCHING_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_MATCHING_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_MATCHING_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "OBSERVATION_METHOD_NOT_MODELED"
  | "OBSERVATION_PRIORITY_NOT_MODELED"
  | "OBSERVATION_RANKING_NOT_MODELED"
  | "OBSERVATION_VALUE_NOT_MODELED"
  | "INFORMATION_GAIN_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "OBSERVATION_COST_NOT_MODELED"
  | "OBSERVATION_LATENCY_NOT_MODELED"
  | "TEMPORAL_URGENCY_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "OBSERVATION_RESULT_INGESTION_NOT_MODELED"
  | "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED"
  | "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-Candidate Capability requirement assessment.
 * No matched_observers / unmet_requirements / ready / can_execute.
 */
export interface AttentionCandidateObservationCapabilityRequirementAssessment {
  candidate_key: string;
  planning: AttentionCandidateObservationPlanningAssessment;
  status: AttentionObservationCapabilityRequirementStatus;
  capability_requirement_basis: AttentionObservationCapabilityRequirementBasis | null;
  has_explicit_capability_requirements: boolean;
  model_limitations: AttentionObservationCapabilityRequirementModelLimitation[];
}

/**
 * Set-level Capability requirement assessment.
 * No matched_observers / unmet_requirements / ready_candidates.
 */
export interface AttentionObservationCapabilityRequirementSetAssessment {
  planning_set: AttentionObservationPlanningSetAssessment;
  specification: AttentionObservationCapabilityRequirementSpecification;
  candidate_requirements: AttentionCandidateObservationCapabilityRequirementAssessment[];
  has_explicit_capability_requirements: boolean;
  model_limitations: AttentionObservationCapabilityRequirementModelLimitation[];
}
