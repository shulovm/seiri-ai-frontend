/**
 * Reality Core v0.7 — Attention Observation Capability Scope Applicability types (GROUND-055).
 *
 * Derived only. Not persisted.
 *
 * GROUND-050 Structural Declaration Match
 * + GROUND-054 Explicit Capability Scope Requirement
 * → Capability Scope Applicability Basis only.
 *
 * Direct exact canonical scope correspondence ≠ final applicability /
 * hierarchy / subsumption / wildcard / Requirement satisfaction /
 * effective Capability state / feasibility / can_execute
 *
 * Does not depend on GROUND-051/052/053.
 */

import type { CapabilityScope } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityDeclarationMatchSetAssessment,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionObservationCapabilityRequirement,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityScopeRequirementAssessment,
  AttentionObservationCapabilityRequirementScopeAssessment,
  AttentionObservationCapabilityScopeRequirement,
  AttentionObservationCapabilityScopeRequirementSetAssessment,
} from "./attention-observation-capability-scope-requirement-types.js";
import type {
  AttentionObservationObserverCandidate,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * Consumes 050 + 054 — not 051/052/053.
 */
export interface AttentionObservationCapabilityScopeApplicabilityInput {
  capability_declaration_match_set: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  capability_scope_requirement_set: AttentionObservationCapabilityScopeRequirementSetAssessment;
}

/**
 * Declaration-position descriptive status.
 * Not APPLICABLE / INAPPLICABLE / MATCHED / VALID.
 */
export type AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus =
  | "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
  | "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT";

/**
 * Candidate-level descriptive status.
 */
export type AttentionObservationCapabilityScopeApplicabilityCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS"
  | "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
  | "DIRECT_SCOPE_APPLICABILITY_BASIS_PRESENT";

/**
 * Only positive basis kind currently modeled.
 */
export type AttentionObservationCapabilityScopeApplicabilityBasisKind =
  "EXACT_CANONICAL_CAPABILITY_SCOPE_CORRESPONDENCE";

/**
 * Exact canonical required-scope ↔ declaration-scope correspondence basis.
 */
export interface AttentionObservationCapabilityScopeApplicabilityBasis {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  capability_requirement_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  capability_scope_requirement_key: string;
  capability_declaration_match_key: string;
  capability_declaration_id: string;
  basis_kind: AttentionObservationCapabilityScopeApplicabilityBasisKind;
  required_scope: CapabilityScope;
  declared_scope: CapabilityScope;
}

/**
 * Per structurally matching Declaration × explicit Scope Requirement position.
 */
export interface AttentionObservationCapabilityDeclarationScopeApplicabilityPosition {
  key: string;
  capability_declaration_match: AttentionObservationCapabilityDeclarationMatch;
  capability_scope_requirement: AttentionObservationCapabilityScopeRequirement;
  status: AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus;
  applicability_basis: AttentionObservationCapabilityScopeApplicabilityBasis | null;
}

/**
 * Per Capability Requirement scope-applicability aggregation.
 * No satisfaction.
 */
export interface AttentionObservationCapabilityRequirementScopeApplicabilityPosition {
  capability_requirement: AttentionObservationCapabilityRequirement;
  scope_requirement_assessment: AttentionObservationCapabilityRequirementScopeAssessment;
  declaration_scope_positions: AttentionObservationCapabilityDeclarationScopeApplicabilityPosition[];
}

/**
 * Groups requirement scope-applicability positions for one Observer Candidate.
 * No suitability.
 */
export interface AttentionObservationObserverCapabilityScopeApplicabilityBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_scope_positions: AttentionObservationCapabilityRequirementScopeApplicabilityPosition[];
}

export type AttentionObservationCapabilityScopeApplicabilityModelLimitation =
  | "CAPABILITY_SCOPE_HIERARCHY_NOT_MODELED"
  | "CAPABILITY_SCOPE_SUBSUMPTION_NOT_MODELED"
  | "CAPABILITY_SCOPE_COMPATIBILITY_NOT_MODELED"
  | "CAPABILITY_SCOPE_NON_EXACT_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_REQUIREMENT_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_PRIORITY_NOT_MODELED"
  | "OBSERVATION_RANKING_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-AttentionCandidate Scope Applicability assessment.
 * has_direct_scope_applicability_basis is existential only.
 */
export interface AttentionCandidateObservationCapabilityScopeApplicabilityAssessment {
  candidate_key: string;
  capability_declaration_match_assessment: AttentionCandidateObservationCapabilityDeclarationAssessment;
  capability_scope_requirement_assessment: AttentionCandidateObservationCapabilityScopeRequirementAssessment;
  status: AttentionObservationCapabilityScopeApplicabilityCandidateStatus;
  observer_scope_bases: AttentionObservationObserverCapabilityScopeApplicabilityBasis[];
  has_direct_scope_applicability_basis: boolean;
  model_limitations: AttentionObservationCapabilityScopeApplicabilityModelLimitation[];
}

/**
 * Set-level Scope Applicability assessment.
 * No applicable_observers / scope_valid_observers / scope_qualified_observers.
 */
export interface AttentionObservationCapabilityScopeApplicabilitySetAssessment {
  capability_declaration_match_set: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  capability_scope_requirement_set: AttentionObservationCapabilityScopeRequirementSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityScopeApplicabilityAssessment[];
  has_direct_scope_applicability_basis: boolean;
  model_limitations: AttentionObservationCapabilityScopeApplicabilityModelLimitation[];
}
