/**
 * Reality Core v0.7 — Attention Observation Capability State Composition types (GROUND-053).
 *
 * Derived only. Not persisted.
 *
 * GROUND-051 Verification Basis + GROUND-052 Availability Basis
 * → Capability State Composition Basis only.
 *
 * Composition ≠ effective Capability state / current Availability /
 * Requirement satisfaction / Permission / Resource readiness / can_execute
 *
 * Representation pattern statuses describe presence of nested declarations only.
 */

import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityRequirementMatchPosition,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionCandidateObservationCapabilityAvailabilityAssessment,
  AttentionObservationCapabilityAvailabilitySetAssessment,
  AttentionObservationCapabilityDeclarationAvailabilityPosition,
} from "./attention-observation-capability-availability-types.js";
import type {
  AttentionCandidateObservationCapabilityVerificationAssessment,
  AttentionObservationCapabilityDeclarationVerificationPosition,
  AttentionObservationCapabilityVerificationSetAssessment,
} from "./attention-observation-capability-verification-types.js";
import type { AttentionObservationObserverCandidate } from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * Both sibling sets embed the same GROUND-050 Declaration Match context.
 */
export interface AttentionObservationCapabilityStateCompositionInput {
  capability_verification_set: AttentionObservationCapabilityVerificationSetAssessment;
  capability_availability_set: AttentionObservationCapabilityAvailabilitySetAssessment;
}

/**
 * Declaration-relative representation-pattern status.
 * Presence of nested Verification/Availability declarations only —
 * not truth / available / usable / ready.
 */
export type AttentionObservationCapabilityDeclarationCompositionStatus =
  | "NO_VERIFICATION_OR_AVAILABILITY_DECLARATIONS_REPRESENTED"
  | "VERIFICATION_DECLARATIONS_PRESENT_AVAILABILITY_DECLARATIONS_ABSENT"
  | "VERIFICATION_DECLARATIONS_ABSENT_AVAILABILITY_DECLARATIONS_PRESENT"
  | "VERIFICATION_AND_AVAILABILITY_DECLARATIONS_PRESENT";

/**
 * Candidate-level composition status.
 * Not VERIFIED / AVAILABLE / READY / PARTIAL / COMPLETE.
 */
export type AttentionObservationCapabilityStateCompositionStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "CAPABILITY_STATE_COMPOSITION_BASIS_PRESENT";

/**
 * One composed view over Declaration + Verification representations +
 * Availability representations for an exact structural Declaration match.
 * No Verification × Availability Cartesian product.
 */
export interface AttentionObservationCapabilityDeclarationStateCompositionPosition {
  key: string;
  capability_declaration_match: AttentionObservationCapabilityDeclarationMatch;
  verification_position: AttentionObservationCapabilityDeclarationVerificationPosition;
  availability_position: AttentionObservationCapabilityDeclarationAvailabilityPosition;
  status: AttentionObservationCapabilityDeclarationCompositionStatus;
}

/**
 * Requirement-level composition over declaration positions.
 * No satisfaction.
 */
export interface AttentionObservationCapabilityRequirementStateCompositionPosition {
  key: string;
  capability_requirement_match_position: AttentionObservationCapabilityRequirementMatchPosition;
  declaration_composition_positions: AttentionObservationCapabilityDeclarationStateCompositionPosition[];
}

/**
 * Groups requirement composition positions for one Observer Candidate.
 * No effective_capabilities / usable_capabilities / satisfied_capabilities.
 */
export interface AttentionObservationObserverCapabilityStateCompositionBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_composition_positions: AttentionObservationCapabilityRequirementStateCompositionPosition[];
}

export type AttentionObservationCapabilityStateCompositionModelLimitation =
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_RECENCY_POLICY_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_AUTHORITY_POLICY_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_RECENCY_POLICY_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_AUTHORITY_POLICY_NOT_MODELED"
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
 * Per-AttentionCandidate Capability State Composition assessment.
 * has_capability_state_composition_basis is structural-descriptive only.
 */
export interface AttentionCandidateObservationCapabilityStateCompositionAssessment {
  candidate_key: string;
  capability_declaration_match_assessment: AttentionCandidateObservationCapabilityDeclarationAssessment;
  capability_verification_assessment: AttentionCandidateObservationCapabilityVerificationAssessment;
  capability_availability_assessment: AttentionCandidateObservationCapabilityAvailabilityAssessment;
  status: AttentionObservationCapabilityStateCompositionStatus;
  observer_capability_state_bases: AttentionObservationObserverCapabilityStateCompositionBasis[];
  has_capability_state_composition_basis: boolean;
  model_limitations: AttentionObservationCapabilityStateCompositionModelLimitation[];
}

/**
 * Set-level Capability State Composition assessment.
 * No ready_observers / capable_observers / effective_capability_states.
 */
export interface AttentionObservationCapabilityStateCompositionSetAssessment {
  capability_verification_set: AttentionObservationCapabilityVerificationSetAssessment;
  capability_availability_set: AttentionObservationCapabilityAvailabilitySetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityStateCompositionAssessment[];
  has_capability_state_composition_basis: boolean;
  model_limitations: AttentionObservationCapabilityStateCompositionModelLimitation[];
}
