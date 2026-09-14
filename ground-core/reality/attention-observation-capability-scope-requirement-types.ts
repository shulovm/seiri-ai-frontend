/**
 * Reality Core v0.7 — Attention Observation Capability Scope Requirement types (GROUND-054).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement
 * + explicit Capability Scope Requirement Specification
 * → Explicit Capability Scope Requirement Basis only.
 *
 * Sibling of the 050–053 Capability state branch — does not depend on it.
 *
 * Capability scope requirement ≠ CapabilityDeclaration.scope
 * Capability scope requirement ≠ scope applicability
 * Capability scope requirement ≠ Requirement satisfaction
 * ObservationNeed.subject_id ≠ Capability Scope Requirement
 *
 * Reuses canonical CapabilityScope — not a parallel Observation-local scope type.
 */

import type { CapabilityScope } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Canonical GROUND-021 CapabilityScope reused as required-scope vocabulary.
 * Not a parallel Observation-local scope type.
 */
export type AttentionObservationRequiredCapabilityScope = CapabilityScope;

/**
 * Runtime evaluation input — not canonical persisted Capability Scope policy.
 * No provenance / Authority.
 */
export interface AttentionObservationCapabilityScopeRequirementInput {
  capability_requirement_key: string;
  required_scope: AttentionObservationRequiredCapabilityScope;
}

export interface AttentionObservationCapabilityScopeRequirementSpecification {
  requirements: AttentionObservationCapabilityScopeRequirementInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 directly — not GROUND-050–053.
 */
export interface AttentionObservationCapabilityScopeRequirementEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityScopeRequirementSpecification;
}

/**
 * Per-Capability-Requirement scope status.
 * Absent requirement ≠ UNSCOPED required.
 */
export type AttentionObservationCapabilityScopeRequirementStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_DECLARED"
  | "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_PRESENT";

/**
 * Candidate-level scope requirement status.
 * Not ALL_SCOPED / PARTIALLY_SCOPED / COMPLETE / SATISFIED.
 */
export type AttentionObservationCapabilityScopeRequirementCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_DECLARED"
  | "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_PRESENT";

/**
 * Explicit Observation Capability Requirement-relative required scope.
 * Not scope_matches / applicable / satisfied.
 */
export interface AttentionObservationCapabilityScopeRequirement {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  required_scope: AttentionObservationRequiredCapabilityScope;
}

/**
 * Requirement exists; Scope Requirement may or may not.
 */
export interface AttentionObservationCapabilityScopeRequirementBasis {
  capability_requirement: AttentionObservationCapabilityRequirement;
  scope_requirement: AttentionObservationCapabilityScopeRequirement | null;
}

/**
 * Per explicit Capability Requirement scope assessment.
 */
export interface AttentionObservationCapabilityRequirementScopeAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  status: AttentionObservationCapabilityScopeRequirementStatus;
  scope_requirement_basis: AttentionObservationCapabilityScopeRequirementBasis;
}

export type AttentionObservationCapabilityScopeRequirementModelLimitation =
  | "CAPABILITY_SCOPE_REQUIREMENT_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_SCOPE_REQUIREMENT_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_SCOPE_REQUIREMENT_POLICY_NOT_MODELED"
  | "OBSERVATION_NEED_TO_CAPABILITY_SCOPE_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "OBSERVATION_TARGET_TO_CAPABILITY_SCOPE_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "OBSERVATION_SUBJECT_TO_CAPABILITY_SCOPE_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "OBSERVATION_PREDICATE_TO_CAPABILITY_SCOPE_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "CAPABILITY_SCOPE_HIERARCHY_NOT_MODELED"
  | "CAPABILITY_SCOPE_SUBSUMPTION_NOT_MODELED"
  | "CAPABILITY_SCOPE_COMPATIBILITY_NOT_MODELED"
  | "CAPABILITY_SCOPE_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_PRIORITY_NOT_MODELED"
  | "OBSERVATION_RANKING_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-AttentionCandidate Capability Scope Requirement assessment.
 * has_explicit_capability_scope_requirements is existential only.
 */
export interface AttentionCandidateObservationCapabilityScopeRequirementAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationCapabilityScopeRequirementCandidateStatus;
  requirement_scope_assessments: AttentionObservationCapabilityRequirementScopeAssessment[];
  has_explicit_capability_scope_requirements: boolean;
  model_limitations: AttentionObservationCapabilityScopeRequirementModelLimitation[];
}

/**
 * Set-level Capability Scope Requirement assessment.
 * No valid_scopes / matched_scopes / applicable_scopes / satisfied_scopes.
 */
export interface AttentionObservationCapabilityScopeRequirementSetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityScopeRequirementSpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityScopeRequirementAssessment[];
  has_explicit_capability_scope_requirements: boolean;
  model_limitations: AttentionObservationCapabilityScopeRequirementModelLimitation[];
}
