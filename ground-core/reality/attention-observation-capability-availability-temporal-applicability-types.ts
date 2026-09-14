/**
 * Reality Core v0.7 — Attention Observation Capability Availability Temporal
 * Applicability types (GROUND-059).
 *
 * Derived only. Not persisted.
 *
 * GROUND-052 Capability Availability Basis
 * + GROUND-056 Explicit Capability Temporal Requirement
 * → Capability Availability Temporal Applicability Basis only.
 *
 * Sibling of GROUND-057 Declaration and GROUND-058 Verification temporal bases.
 * Does not depend on GROUND-051/053/054/055/057/058.
 *
 * Two orthogonal axes:
 *   temporal relation: FULL / PARTIAL / NO_OVERLAP
 *   raw Availability status: AVAILABLE | UNAVAILABLE
 *
 * temporal coverage ≠ Availability polarity
 * ≠ effective/current Availability / satisfaction / Resource readiness / can_execute
 *
 * Availability absence ≠ UNAVAILABLE ≠ NO_REQUIRED_WINDOW_OVERLAP
 */

import type { CapabilityAvailabilityStatus } from "../types.js";
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
  AttentionCandidateObservationCapabilityAvailabilityAssessment,
  AttentionObservationCapabilityAvailabilityLink,
  AttentionObservationCapabilityAvailabilitySetAssessment,
  AttentionObservationCapabilityDeclarationAvailabilityPosition,
} from "./attention-observation-capability-availability-types.js";
import type {
  AttentionObservationObserverCandidate,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * Consumes 052 + 056 — not 051 / 053–055 / 057–058.
 */
export interface AttentionObservationCapabilityAvailabilityTemporalApplicabilityInput {
  capability_availability_set: AttentionObservationCapabilityAvailabilitySetAssessment;
  capability_temporal_requirement_set: AttentionObservationCapabilityTemporalRequirementSetAssessment;
}

/**
 * Canonical half-open interval relation between required window and Availability interval.
 * Descriptive structural relation only — not effective Availability / satisfaction.
 */
export type AttentionObservationCapabilityAvailabilityTemporalRelation =
  | "FULL_REQUIRED_WINDOW_COVERAGE"
  | "PARTIAL_REQUIRED_WINDOW_OVERLAP"
  | "NO_REQUIRED_WINDOW_OVERLAP";

/**
 * Preserved Availability validity window (canonical half-open [valid_from, valid_until)).
 */
export interface AttentionObservationCapabilityAvailabilityValidityWindow {
  valid_from: string;
  valid_until: string | null;
}

/**
 * Exact required-window ↔ Availability-interval relation basis.
 * raw_availability_status is orthogonal to relation.
 */
export interface AttentionObservationCapabilityAvailabilityTemporalApplicabilityBasis {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  capability_requirement_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  capability_temporal_requirement_key: string;
  capability_declaration_id: string;
  capability_availability_link_key: string;
  capability_availability_declaration_id: string;
  relation: AttentionObservationCapabilityAvailabilityTemporalRelation;
  raw_availability_status: CapabilityAvailabilityStatus;
  required_window: AttentionObservationRequiredCapabilityTemporalWindow;
  availability_window: AttentionObservationCapabilityAvailabilityValidityWindow;
}

/**
 * Per exact Availability link × explicit Temporal Requirement position.
 * When evaluable, applicability_basis is always present (including NO_OVERLAP).
 */
export interface AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition {
  key: string;
  capability_availability_link: AttentionObservationCapabilityAvailabilityLink;
  capability_temporal_requirement: AttentionObservationCapabilityTemporalRequirement;
  relation: AttentionObservationCapabilityAvailabilityTemporalRelation;
  applicability_basis: AttentionObservationCapabilityAvailabilityTemporalApplicabilityBasis;
}

/**
 * Declaration-relative Availability temporal group (preserves D→A nesting).
 */
export interface AttentionObservationCapabilityDeclarationAvailabilityTemporalPosition {
  capability_declaration_match: AttentionObservationCapabilityDeclarationMatch;
  capability_declaration_availability_position: AttentionObservationCapabilityDeclarationAvailabilityPosition;
  availability_temporal_positions: AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition[];
}

/**
 * Per Capability Requirement Availability temporal aggregation.
 * No satisfaction / readiness.
 */
export interface AttentionObservationCapabilityRequirementAvailabilityTemporalPosition {
  capability_requirement: AttentionObservationCapabilityRequirement;
  temporal_requirement_assessment: AttentionObservationCapabilityRequirementTemporalAssessment;
  declaration_availability_temporal_positions: AttentionObservationCapabilityDeclarationAvailabilityTemporalPosition[];
}

/**
 * Groups requirement Availability temporal positions for one Observer Candidate.
 * No available_observer / ready_observer.
 */
export interface AttentionObservationObserverCapabilityAvailabilityTemporalBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_availability_temporal_positions: AttentionObservationCapabilityRequirementAvailabilityTemporalPosition[];
}

/**
 * Candidate / set-level status.
 * Does not encode FULL / PARTIAL / NO or AVAILABLE / UNAVAILABLE as candidate-wide verdicts.
 */
export type AttentionObservationCapabilityAvailabilityTemporalApplicabilityStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "NOT_APPLICABLE_NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS"
  | "NO_CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_REPRESENTED"
  | "CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_PRESENT";

export type AttentionObservationCapabilityAvailabilityTemporalApplicabilityModelLimitation =
  | "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_TEMPORAL_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_RECENCY_POLICY_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_AUTHORITY_POLICY_NOT_MODELED"
  | "CROSS_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CROSS_DECLARATION_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CROSS_OBSERVER_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_DECLARATION_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_TEMPORAL_INTERSECTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
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
 * Per-AttentionCandidate Availability Temporal Applicability assessment.
 * has_capability_availability_temporal_relation_basis is existential only.
 */
export interface AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment {
  candidate_key: string;
  capability_availability_assessment: AttentionCandidateObservationCapabilityAvailabilityAssessment;
  capability_temporal_requirement_assessment: AttentionCandidateObservationCapabilityTemporalRequirementAssessment;
  status: AttentionObservationCapabilityAvailabilityTemporalApplicabilityStatus;
  observer_availability_temporal_bases: AttentionObservationObserverCapabilityAvailabilityTemporalBasis[];
  has_capability_availability_temporal_relation_basis: boolean;
  model_limitations: AttentionObservationCapabilityAvailabilityTemporalApplicabilityModelLimitation[];
}

/**
 * Set-level Availability Temporal Applicability assessment.
 * No available_observers / ready_observers / usable_observers.
 */
export interface AttentionObservationCapabilityAvailabilityTemporalApplicabilitySetAssessment {
  capability_availability_set: AttentionObservationCapabilityAvailabilitySetAssessment;
  capability_temporal_requirement_set: AttentionObservationCapabilityTemporalRequirementSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment[];
  has_capability_availability_temporal_relation_basis: boolean;
  model_limitations: AttentionObservationCapabilityAvailabilityTemporalApplicabilityModelLimitation[];
}
