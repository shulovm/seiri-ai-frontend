/**
 * Reality Core v0.7 — Attention Observation Capability Applicability Composition
 * types (GROUND-060).
 *
 * Derived only. Not persisted.
 *
 * GROUND-055 Scope Applicability
 * + GROUND-057 Declaration Temporal Applicability
 * + GROUND-058 Verification Temporal Applicability
 * + GROUND-059 Availability Temporal Applicability
 * → Capability Applicability Composition Basis only.
 *
 * Composition ≠ Resolution ≠ Requirement satisfaction ≠ effective Capability state
 * ≠ Permission / Resource readiness / feasibility / can_execute
 *
 * No V×A Cartesian product. Child Verification/Availability remain independent dimensions.
 */

import type {
  AttentionCandidateObservationCapabilityScopeApplicabilityAssessment,
  AttentionObservationCapabilityDeclarationScopeApplicabilityPosition,
  AttentionObservationCapabilityScopeApplicabilitySetAssessment,
} from "./attention-observation-capability-scope-applicability-types.js";
import type {
  AttentionObservationCapabilityDeclarationMatch,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionObservationCapabilityRequirement,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionObservationCapabilityRequirementScopeAssessment,
} from "./attention-observation-capability-scope-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment,
  AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition,
  AttentionObservationCapabilityDeclarationTemporalApplicabilitySetAssessment,
} from "./attention-observation-capability-declaration-temporal-applicability-types.js";
import type {
  AttentionObservationCapabilityRequirementTemporalAssessment,
} from "./attention-observation-capability-temporal-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment,
  AttentionObservationCapabilityVerificationTemporalApplicabilityPosition,
  AttentionObservationCapabilityVerificationTemporalApplicabilitySetAssessment,
} from "./attention-observation-capability-verification-temporal-applicability-types.js";
import type {
  AttentionObservationCapabilityDeclarationVerificationPosition,
} from "./attention-observation-capability-verification-types.js";
import type {
  AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilitySetAssessment,
} from "./attention-observation-capability-availability-temporal-applicability-types.js";
import type {
  AttentionObservationCapabilityDeclarationAvailabilityPosition,
} from "./attention-observation-capability-availability-types.js";
import type {
  AttentionObservationObserverCandidate,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * Consumes 055 + 057 + 058 + 059 — not ProjectState / Permission / Resource.
 */
export interface AttentionObservationCapabilityApplicabilityCompositionInput {
  capability_scope_applicability_set: AttentionObservationCapabilityScopeApplicabilitySetAssessment;
  capability_declaration_temporal_applicability_set: AttentionObservationCapabilityDeclarationTemporalApplicabilitySetAssessment;
  capability_verification_temporal_applicability_set: AttentionObservationCapabilityVerificationTemporalApplicabilitySetAssessment;
  capability_availability_temporal_applicability_set: AttentionObservationCapabilityAvailabilityTemporalApplicabilitySetAssessment;
}

/**
 * Scope dimension for one exact CapabilityDeclaration composition position.
 * scope_applicability_position null when no explicit Scope Requirement.
 */
export interface AttentionObservationCapabilityApplicabilityScopeDimension {
  capability_scope_requirement_assessment: AttentionObservationCapabilityRequirementScopeAssessment;
  scope_applicability_position: AttentionObservationCapabilityDeclarationScopeApplicabilityPosition | null;
}

/**
 * Declaration temporal dimension.
 * declaration_temporal_applicability_position null when no explicit Temporal Requirement.
 */
export interface AttentionObservationCapabilityApplicabilityDeclarationTemporalDimension {
  temporal_requirement_assessment: AttentionObservationCapabilityRequirementTemporalAssessment;
  declaration_temporal_applicability_position: AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition | null;
}

/**
 * Verification temporal dimension (Declaration-relative children; no V×A product).
 */
export interface AttentionObservationCapabilityApplicabilityVerificationTemporalDimension {
  capability_declaration_verification_position: AttentionObservationCapabilityDeclarationVerificationPosition;
  verification_temporal_positions: AttentionObservationCapabilityVerificationTemporalApplicabilityPosition[];
}

/**
 * Availability temporal dimension (Declaration-relative children; polarity orthogonal).
 */
export interface AttentionObservationCapabilityApplicabilityAvailabilityTemporalDimension {
  capability_declaration_availability_position: AttentionObservationCapabilityDeclarationAvailabilityPosition;
  availability_temporal_positions: AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition[];
}

/**
 * One composed view for one exact structurally matching CapabilityDeclaration.
 * Side-by-side dimensions only — no resolution / satisfaction.
 */
export interface AttentionObservationCapabilityDeclarationApplicabilityCompositionPosition {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  capability_requirement_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  capability_declaration_match: AttentionObservationCapabilityDeclarationMatch;
  scope_dimension: AttentionObservationCapabilityApplicabilityScopeDimension;
  declaration_temporal_dimension: AttentionObservationCapabilityApplicabilityDeclarationTemporalDimension;
  verification_temporal_dimension: AttentionObservationCapabilityApplicabilityVerificationTemporalDimension;
  availability_temporal_dimension: AttentionObservationCapabilityApplicabilityAvailabilityTemporalDimension;
}

/**
 * Per Capability Requirement composition aggregation.
 * No Requirement satisfaction field.
 */
export interface AttentionObservationCapabilityRequirementApplicabilityCompositionPosition {
  capability_requirement: AttentionObservationCapabilityRequirement;
  capability_scope_requirement_assessment: AttentionObservationCapabilityRequirementScopeAssessment;
  capability_temporal_requirement_assessment: AttentionObservationCapabilityRequirementTemporalAssessment;
  declaration_composition_positions: AttentionObservationCapabilityDeclarationApplicabilityCompositionPosition[];
}

/**
 * Groups requirement composition positions for one Observer Candidate.
 * No qualified_observer / capable_observer / usable_observer.
 */
export interface AttentionObservationObserverCapabilityApplicabilityCompositionBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_composition_positions: AttentionObservationCapabilityRequirementApplicabilityCompositionPosition[];
}

/**
 * Candidate-level composition status.
 * Not COMPLETE / PARTIAL / READY / APPLICABLE / SATISFIED.
 */
export type AttentionObservationCapabilityApplicabilityCompositionStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "CAPABILITY_APPLICABILITY_COMPOSITION_BASIS_PRESENT";

export type AttentionObservationCapabilityApplicabilityCompositionModelLimitation =
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_TEMPORAL_INTERSECTION_NOT_MODELED"
  | "CAPABILITY_SCOPE_TEMPORAL_CONJUNCTION_NOT_MODELED"
  | "CAPABILITY_SCOPE_NON_EXACT_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_RECENCY_POLICY_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_AUTHORITY_POLICY_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_RECENCY_POLICY_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_AUTHORITY_POLICY_NOT_MODELED"
  | "CROSS_DECLARATION_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CROSS_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CROSS_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CROSS_OBSERVER_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_METHOD_NOT_MODELED"
  | "OBSERVATION_PRIORITY_NOT_MODELED"
  | "OBSERVATION_RANKING_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-AttentionCandidate Applicability Composition assessment.
 * has_capability_applicability_composition_basis is structural existence only.
 */
export interface AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment {
  candidate_key: string;
  scope_applicability_assessment: AttentionCandidateObservationCapabilityScopeApplicabilityAssessment;
  declaration_temporal_applicability_assessment: AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment;
  verification_temporal_applicability_assessment: AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment;
  availability_temporal_applicability_assessment: AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment;
  status: AttentionObservationCapabilityApplicabilityCompositionStatus;
  observer_applicability_bases: AttentionObservationObserverCapabilityApplicabilityCompositionBasis[];
  has_capability_applicability_composition_basis: boolean;
  model_limitations: AttentionObservationCapabilityApplicabilityCompositionModelLimitation[];
}

/**
 * Set-level Applicability Composition assessment.
 * No ready_observers / usable_observers / satisfied_requirements.
 */
export interface AttentionObservationCapabilityApplicabilityCompositionSetAssessment {
  capability_scope_applicability_set: AttentionObservationCapabilityScopeApplicabilitySetAssessment;
  capability_declaration_temporal_applicability_set: AttentionObservationCapabilityDeclarationTemporalApplicabilitySetAssessment;
  capability_verification_temporal_applicability_set: AttentionObservationCapabilityVerificationTemporalApplicabilitySetAssessment;
  capability_availability_temporal_applicability_set: AttentionObservationCapabilityAvailabilityTemporalApplicabilitySetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment[];
  has_capability_applicability_composition_basis: boolean;
  model_limitations: AttentionObservationCapabilityApplicabilityCompositionModelLimitation[];
}
