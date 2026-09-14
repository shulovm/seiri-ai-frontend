/**
 * Reality Core v0.7 — Attention Observation Capability Verification types (GROUND-051).
 *
 * Derived only. Not persisted.
 *
 * Structural Capability Declaration Match + CapabilityVerificationDeclaration
 * → Capability Verification Basis only.
 *
 * Verification linkage uses exact capability_declaration_id.
 * Verification declaration present ≠ Capability truth / PROVEN /
 * Availability / Requirement satisfaction / suitability / can_execute
 */

import type { CapabilityVerificationDeclaration } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityDeclarationMatchSetAssessment,
  AttentionObservationCapabilityRequirementMatchPosition,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionObservationObserverCandidate,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * capability_verification_declarations is exact declaration-id lookup context only —
 * not discovery pool for Declarations / Requirements / Observer Candidates.
 */
export interface AttentionObservationCapabilityVerificationInput {
  capability_declaration_match_set: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  capability_verification_declarations: CapabilityVerificationDeclaration[];
}

/**
 * Candidate-level descriptive status.
 * Not VERIFIED / UNVERIFIED / PROVEN / SATISFIED / QUALIFIED.
 */
export type AttentionObservationCapabilityVerificationStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED"
  | "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT";

/**
 * Per structurally matching Declaration Verification position status.
 */
export type AttentionObservationCapabilityDeclarationVerificationPositionStatus =
  | "NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED"
  | "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT";

/**
 * One exact VerificationDeclaration linkage to a structural Declaration match.
 * Preserves canonical Verification record; no effective truth / active evaluation.
 */
export interface AttentionObservationCapabilityVerificationLink {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  capability_requirement_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  capability_declaration_match_key: string;
  capability_declaration_id: string;
  capability_verification_declaration_id: string;
  capability_verification_declaration: CapabilityVerificationDeclaration;
}

/**
 * Declaration-relative Verification position for one structural Declaration match.
 */
export interface AttentionObservationCapabilityDeclarationVerificationPosition {
  key: string;
  capability_declaration_match: AttentionObservationCapabilityDeclarationMatch;
  status: AttentionObservationCapabilityDeclarationVerificationPositionStatus;
  verification_links: AttentionObservationCapabilityVerificationLink[];
}

/**
 * Enriches one Observer Candidate × Capability Requirement position
 * with declaration-relative Verification positions.
 * No satisfaction / qualification.
 */
export interface AttentionObservationCapabilityRequirementVerificationPosition {
  key: string;
  capability_requirement_match_position: AttentionObservationCapabilityRequirementMatchPosition;
  declaration_verification_positions: AttentionObservationCapabilityDeclarationVerificationPosition[];
  has_capability_verification_declarations: boolean;
}

/**
 * Groups requirement Verification positions for one Observer Candidate.
 * No verified_capabilities / qualified_capabilities.
 */
export interface AttentionObservationObserverCapabilityVerificationBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_verification_positions: AttentionObservationCapabilityRequirementVerificationPosition[];
}

export type AttentionObservationCapabilityVerificationModelLimitation =
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_RECENCY_POLICY_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_AUTHORITY_POLICY_NOT_MODELED"
  | "CAPABILITY_SCOPE_REQUIREMENT_NOT_MODELED"
  | "CAPABILITY_SCOPE_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_MATCHING_NOT_MODELED"
  | "CAPABILITY_INHERITANCE_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
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
 * Per-AttentionCandidate Capability Verification Basis assessment.
 * has_capability_verification_declarations is existential only.
 */
export interface AttentionCandidateObservationCapabilityVerificationAssessment {
  candidate_key: string;
  capability_declaration_match_assessment: AttentionCandidateObservationCapabilityDeclarationAssessment;
  status: AttentionObservationCapabilityVerificationStatus;
  observer_verification_bases: AttentionObservationObserverCapabilityVerificationBasis[];
  has_capability_verification_declarations: boolean;
  model_limitations: AttentionObservationCapabilityVerificationModelLimitation[];
}

/**
 * Set-level Capability Verification Basis assessment.
 * No verified_observers / verified_candidates / qualified_observers.
 */
export interface AttentionObservationCapabilityVerificationSetAssessment {
  capability_declaration_match_set: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityVerificationAssessment[];
  has_capability_verification_declarations: boolean;
  model_limitations: AttentionObservationCapabilityVerificationModelLimitation[];
}
