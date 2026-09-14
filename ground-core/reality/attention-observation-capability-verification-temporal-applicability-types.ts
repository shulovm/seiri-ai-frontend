/**
 * Reality Core v0.7 — Attention Observation Capability Verification Temporal
 * Applicability types (GROUND-058).
 *
 * Derived only. Not persisted.
 *
 * GROUND-051 Capability Verification Basis
 * + GROUND-056 Explicit Capability Temporal Requirement
 * → Capability Verification Temporal Applicability Basis only.
 *
 * Sibling of GROUND-057 Declaration Temporal Applicability — not a prerequisite.
 * Does not depend on GROUND-052/053/054/055/057.
 *
 * Interval relations (Verification validity vs required window):
 *   FULL_REQUIRED_WINDOW_COVERAGE
 *   PARTIAL_REQUIRED_WINDOW_OVERLAP
 *   NO_REQUIRED_WINDOW_OVERLAP
 *
 * ≠ Capability truth / PROVEN / effective Verification /
 * Requirement satisfaction / CURRENT/ACTIVE / Availability / can_execute
 *
 * Verification absence ≠ NO_REQUIRED_WINDOW_OVERLAP
 */

import type {
  AttentionObservationCapabilityDeclarationMatch,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionObservationCapabilityRequirement,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityTemporalRequirementAssessment,
  AttentionObservationCapabilityRequirementTemporalAssessment,
  AttentionObservationCapabilityTemporalRequirement,
  AttentionObservationCapabilityTemporalRequirementSetAssessment,
  AttentionObservationRequiredCapabilityTemporalWindow,
} from "./attention-observation-capability-temporal-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityVerificationAssessment,
  AttentionObservationCapabilityDeclarationVerificationPosition,
  AttentionObservationCapabilityVerificationLink,
  AttentionObservationCapabilityVerificationSetAssessment,
} from "./attention-observation-capability-verification-types.js";
import type {
  AttentionObservationObserverCandidate,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * Consumes 051 + 056 — not 052–055 / 057.
 */
export interface AttentionObservationCapabilityVerificationTemporalApplicabilityInput {
  capability_verification_set: AttentionObservationCapabilityVerificationSetAssessment;
  capability_temporal_requirement_set: AttentionObservationCapabilityTemporalRequirementSetAssessment;
}

/**
 * Canonical half-open interval relation between required window and Verification validity.
 * Descriptive structural relation only — not effective Verification / PROVEN / satisfaction.
 */
export type AttentionObservationCapabilityVerificationTemporalRelation =
  | "FULL_REQUIRED_WINDOW_COVERAGE"
  | "PARTIAL_REQUIRED_WINDOW_OVERLAP"
  | "NO_REQUIRED_WINDOW_OVERLAP";

/**
 * Preserved Verification validity window (canonical half-open [verified_at, valid_until)).
 */
export interface AttentionObservationCapabilityVerificationValidityWindow {
  verified_at: string;
  valid_until: string | null;
}

/**
 * Exact required-window ↔ Verification-validity interval relation basis.
 */
export interface AttentionObservationCapabilityVerificationTemporalApplicabilityBasis {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  capability_requirement_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  capability_temporal_requirement_key: string;
  capability_declaration_id: string;
  capability_verification_link_key: string;
  capability_verification_declaration_id: string;
  relation: AttentionObservationCapabilityVerificationTemporalRelation;
  required_window: AttentionObservationRequiredCapabilityTemporalWindow;
  verification_window: AttentionObservationCapabilityVerificationValidityWindow;
}

/**
 * Per exact Verification link × explicit Temporal Requirement position.
 * When evaluable, applicability_basis is always present (including NO_OVERLAP).
 */
export interface AttentionObservationCapabilityVerificationTemporalApplicabilityPosition {
  key: string;
  capability_verification_link: AttentionObservationCapabilityVerificationLink;
  capability_temporal_requirement: AttentionObservationCapabilityTemporalRequirement;
  relation: AttentionObservationCapabilityVerificationTemporalRelation;
  applicability_basis: AttentionObservationCapabilityVerificationTemporalApplicabilityBasis;
}

/**
 * Declaration-relative Verification temporal group (preserves D→V nesting).
 */
export interface AttentionObservationCapabilityDeclarationVerificationTemporalPosition {
  capability_declaration_match: AttentionObservationCapabilityDeclarationMatch;
  capability_declaration_verification_position: AttentionObservationCapabilityDeclarationVerificationPosition;
  verification_temporal_positions: AttentionObservationCapabilityVerificationTemporalApplicabilityPosition[];
}

/**
 * Per Capability Requirement Verification temporal aggregation.
 * No satisfaction.
 */
export interface AttentionObservationCapabilityRequirementVerificationTemporalPosition {
  capability_requirement: AttentionObservationCapabilityRequirement;
  temporal_requirement_assessment: AttentionObservationCapabilityRequirementTemporalAssessment;
  declaration_verification_temporal_positions: AttentionObservationCapabilityDeclarationVerificationTemporalPosition[];
}

/**
 * Groups requirement Verification temporal positions for one Observer Candidate.
 * No verified_observer / temporally_verified_observer.
 */
export interface AttentionObservationObserverCapabilityVerificationTemporalBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_verification_temporal_positions: AttentionObservationCapabilityRequirementVerificationTemporalPosition[];
}

/**
 * Candidate / set-level status.
 * Does not encode FULL / PARTIAL / NO as candidate-wide qualification.
 */
export type AttentionObservationCapabilityVerificationTemporalApplicabilityStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "NOT_APPLICABLE_NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS"
  | "NO_CAPABILITY_VERIFICATION_TEMPORAL_RELATION_BASIS_REPRESENTED"
  | "CAPABILITY_VERIFICATION_TEMPORAL_RELATION_BASIS_PRESENT";

export type AttentionObservationCapabilityVerificationTemporalApplicabilityModelLimitation =
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_TEMPORAL_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_RECENCY_POLICY_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_AUTHORITY_POLICY_NOT_MODELED"
  | "CROSS_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CROSS_DECLARATION_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CROSS_OBSERVER_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_DECLARATION_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_TEMPORAL_INTERSECTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_SCOPE_NON_EXACT_APPLICABILITY_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED"
  | "OBSERVATION_EXECUTION_TIME_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-AttentionCandidate Verification Temporal Applicability assessment.
 * has_capability_verification_temporal_relation_basis is existential only.
 */
export interface AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment {
  candidate_key: string;
  capability_verification_assessment: AttentionCandidateObservationCapabilityVerificationAssessment;
  capability_temporal_requirement_assessment: AttentionCandidateObservationCapabilityTemporalRequirementAssessment;
  status: AttentionObservationCapabilityVerificationTemporalApplicabilityStatus;
  observer_verification_temporal_bases: AttentionObservationObserverCapabilityVerificationTemporalBasis[];
  has_capability_verification_temporal_relation_basis: boolean;
  model_limitations: AttentionObservationCapabilityVerificationTemporalApplicabilityModelLimitation[];
}

/**
 * Set-level Verification Temporal Applicability assessment.
 * No verified_observers / temporally_verified_observers.
 */
export interface AttentionObservationCapabilityVerificationTemporalApplicabilitySetAssessment {
  capability_verification_set: AttentionObservationCapabilityVerificationSetAssessment;
  capability_temporal_requirement_set: AttentionObservationCapabilityTemporalRequirementSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment[];
  has_capability_verification_temporal_relation_basis: boolean;
  model_limitations: AttentionObservationCapabilityVerificationTemporalApplicabilityModelLimitation[];
}
