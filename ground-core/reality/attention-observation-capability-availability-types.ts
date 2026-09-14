/**
 * Reality Core v0.7 — Attention Observation Capability Availability types (GROUND-052).
 *
 * Derived only. Not persisted.
 *
 * Structural Capability Declaration Match + CapabilityAvailabilityDeclaration
 * → Capability Availability Basis only.
 *
 * Sibling of GROUND-051 Verification Basis — does not depend on it.
 *
 * Availability linkage uses exact capability_declaration_id.
 * Availability declaration present ≠ effective/current Availability /
 * Verification / Permission / Resource readiness / satisfaction / can_execute
 */

import type { CapabilityAvailabilityDeclaration } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityDeclarationMatchSetAssessment,
  AttentionObservationCapabilityRequirementMatchPosition,
} from "./attention-observation-capability-declaration-match-types.js";
import type { CanonicalCapabilitySemanticKey } from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionObservationObserverCandidate,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-050 directly — not GROUND-051 Verification Basis.
 * capability_availability_declarations is exact declaration-id lookup context only.
 */
export interface AttentionObservationCapabilityAvailabilityInput {
  capability_declaration_match_set: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  capability_availability_declarations: CapabilityAvailabilityDeclaration[];
}

/**
 * Candidate-level descriptive status.
 * Not AVAILABLE / UNAVAILABLE / CURRENTLY_AVAILABLE / READY as derived verdicts.
 * Raw CapabilityAvailabilityDeclaration.status is preserved on the record only.
 */
export type AttentionObservationCapabilityAvailabilityStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED"
  | "CAPABILITY_AVAILABILITY_DECLARATIONS_PRESENT";

/**
 * Per structurally matching Declaration Availability position status.
 */
export type AttentionObservationCapabilityDeclarationAvailabilityPositionStatus =
  | "NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED"
  | "CAPABILITY_AVAILABILITY_DECLARATIONS_PRESENT";

/**
 * One exact AvailabilityDeclaration linkage to a structural Declaration match.
 * Preserves canonical Availability record including raw status; no effective state.
 */
export interface AttentionObservationCapabilityAvailabilityLink {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  capability_requirement_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  capability_declaration_match_key: string;
  capability_declaration_id: string;
  capability_availability_declaration_id: string;
  capability_availability_declaration: CapabilityAvailabilityDeclaration;
}

/**
 * Declaration-relative Availability position for one structural Declaration match.
 */
export interface AttentionObservationCapabilityDeclarationAvailabilityPosition {
  key: string;
  capability_declaration_match: AttentionObservationCapabilityDeclarationMatch;
  status: AttentionObservationCapabilityDeclarationAvailabilityPositionStatus;
  availability_links: AttentionObservationCapabilityAvailabilityLink[];
}

/**
 * Enriches one Observer Candidate × Capability Requirement position
 * with declaration-relative Availability positions.
 * No satisfaction / readiness.
 */
export interface AttentionObservationCapabilityRequirementAvailabilityPosition {
  key: string;
  capability_requirement_match_position: AttentionObservationCapabilityRequirementMatchPosition;
  declaration_availability_positions: AttentionObservationCapabilityDeclarationAvailabilityPosition[];
  has_capability_availability_declarations: boolean;
}

/**
 * Groups requirement Availability positions for one Observer Candidate.
 * No available_capabilities / ready_capabilities / usable_capabilities.
 */
export interface AttentionObservationObserverCapabilityAvailabilityBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_availability_positions: AttentionObservationCapabilityRequirementAvailabilityPosition[];
}

export type AttentionObservationCapabilityAvailabilityModelLimitation =
  | "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_RECENCY_POLICY_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_AUTHORITY_POLICY_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_SCOPE_REQUIREMENT_NOT_MODELED"
  | "CAPABILITY_SCOPE_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_INHERITANCE_NOT_MODELED"
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
  | "OBSERVATION_VALUE_NOT_MODELED"
  | "INFORMATION_GAIN_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "OBSERVATION_COST_NOT_MODELED"
  | "OBSERVATION_LATENCY_NOT_MODELED"
  | "TEMPORAL_URGENCY_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "OBSERVER_ASSIGNMENT_NOT_MODELED"
  | "OBSERVER_COMMITMENT_NOT_MODELED"
  | "OBSERVATION_RESULT_INGESTION_NOT_MODELED"
  | "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED"
  | "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-AttentionCandidate Capability Availability Basis assessment.
 * has_capability_availability_declarations is existential only.
 */
export interface AttentionCandidateObservationCapabilityAvailabilityAssessment {
  candidate_key: string;
  capability_declaration_match_assessment: AttentionCandidateObservationCapabilityDeclarationAssessment;
  status: AttentionObservationCapabilityAvailabilityStatus;
  observer_availability_bases: AttentionObservationObserverCapabilityAvailabilityBasis[];
  has_capability_availability_declarations: boolean;
  model_limitations: AttentionObservationCapabilityAvailabilityModelLimitation[];
}

/**
 * Set-level Capability Availability Basis assessment.
 * No available_observers / available_candidates / ready_observers.
 */
export interface AttentionObservationCapabilityAvailabilitySetAssessment {
  capability_declaration_match_set: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityAvailabilityAssessment[];
  has_capability_availability_declarations: boolean;
  model_limitations: AttentionObservationCapabilityAvailabilityModelLimitation[];
}
