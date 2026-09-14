/**
 * Reality Core v0.7 — Attention Observation Capability Declaration Match types (GROUND-050).
 *
 * Derived only. Not persisted.
 *
 * Explicit Capability Requirement + Explicit Observer Candidate
 * + CapabilityDeclaration → structural declaration-match basis only.
 *
 * holder + capability_key match ≠ Capability truth / scope applicability /
 * temporal applicability / verification / availability / satisfaction /
 * suitability / feasibility / can_execute
 */

import type { CapabilityDeclaration } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationObserverCandidateAssessment,
  AttentionObservationObserverCandidate,
  AttentionObservationObserverCandidateSetAssessment,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * capability_declarations is exact structural matching context only —
 * not discovery pool for Requirements or Observer Candidates.
 */
export interface AttentionObservationCapabilityDeclarationMatchInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  observer_candidate_set: AttentionObservationObserverCandidateSetAssessment;
  capability_declarations: CapabilityDeclaration[];
}

/**
 * Candidate-level descriptive status.
 * Not requirement-satisfaction / observer-qualification / feasibility / possession boolean.
 */
export type AttentionObservationCapabilityDeclarationMatchStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT";

/**
 * Per Observer Candidate × Capability Requirement position status.
 */
export type AttentionObservationCapabilityRequirementMatchPositionStatus =
  | "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT";

/**
 * One structural holder+capability_key correspondence to a canonical declaration.
 * Scope and temporal fields are preserved on capability_declaration — unresolved.
 */
export interface AttentionObservationCapabilityDeclarationMatch {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  capability_requirement_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  capability_declaration_id: string;
  capability_declaration: CapabilityDeclaration;
}

/**
 * One Observer Candidate × explicit Capability Requirement evaluation position.
 */
export interface AttentionObservationCapabilityRequirementMatchPosition {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  capability_requirement: AttentionObservationCapabilityRequirement;
  structurally_matching_declarations: AttentionObservationCapabilityDeclarationMatch[];
  status: AttentionObservationCapabilityRequirementMatchPositionStatus;
}

/**
 * Groups requirement positions for one Observer Candidate.
 * No suitability / qualification verdict.
 */
export interface AttentionObservationObserverCapabilityDeclarationBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_match_positions: AttentionObservationCapabilityRequirementMatchPosition[];
}

export type AttentionObservationCapabilityDeclarationMatchModelLimitation =
  | "CAPABILITY_DECLARATION_TRUTH_NOT_MODELED"
  | "CAPABILITY_SCOPE_REQUIREMENT_NOT_MODELED"
  | "CAPABILITY_SCOPE_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_MATCHING_NOT_MODELED"
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
 * Per-AttentionCandidate structural declaration-match assessment.
 * has_structurally_matching_capability_declarations is existential only.
 */
export interface AttentionCandidateObservationCapabilityDeclarationAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  observer_candidate_assessment: AttentionCandidateObservationObserverCandidateAssessment;
  status: AttentionObservationCapabilityDeclarationMatchStatus;
  observer_capability_bases: AttentionObservationObserverCapabilityDeclarationBasis[];
  has_structurally_matching_capability_declarations: boolean;
  model_limitations: AttentionObservationCapabilityDeclarationMatchModelLimitation[];
}

/**
 * Set-level structural declaration-match assessment.
 * No matching_observers / capable_observers / qualified_observers.
 */
export interface AttentionObservationCapabilityDeclarationMatchSetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  observer_candidate_set: AttentionObservationObserverCandidateSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityDeclarationAssessment[];
  has_structurally_matching_capability_declarations: boolean;
  model_limitations: AttentionObservationCapabilityDeclarationMatchModelLimitation[];
}
