/**
 * Reality Core v0.7 — Attention Observation Capability Declaration Temporal
 * Applicability types (GROUND-057).
 *
 * Derived only. Not persisted.
 *
 * GROUND-050 Structural Declaration Match
 * + GROUND-056 Explicit Capability Temporal Requirement
 * → Capability Declaration Temporal Applicability Basis only.
 *
 * Sibling of GROUND-055 Scope Applicability — not a prerequisite either way.
 * Does not depend on GROUND-051/052/053/054/055.
 *
 * Interval relations:
 *   FULL_REQUIRED_WINDOW_COVERAGE
 *   PARTIAL_REQUIRED_WINDOW_OVERLAP
 *   NO_REQUIRED_WINDOW_OVERLAP
 *
 * ≠ Requirement satisfaction / Capability truth / CURRENT/ACTIVE /
 * Verification or Availability temporal applicability / feasibility / can_execute
 */

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
  AttentionCandidateObservationCapabilityTemporalRequirementAssessment,
  AttentionObservationCapabilityRequirementTemporalAssessment,
  AttentionObservationCapabilityTemporalRequirement,
  AttentionObservationCapabilityTemporalRequirementSetAssessment,
  AttentionObservationRequiredCapabilityTemporalWindow,
} from "./attention-observation-capability-temporal-requirement-types.js";
import type {
  AttentionObservationObserverCandidate,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

/**
 * Combined evaluation input.
 * Consumes 050 + 056 — not 051–055.
 */
export interface AttentionObservationCapabilityDeclarationTemporalApplicabilityInput {
  capability_declaration_match_set: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  capability_temporal_requirement_set: AttentionObservationCapabilityTemporalRequirementSetAssessment;
}

/**
 * Canonical half-open interval relation between required window and Declaration validity.
 * Descriptive structural relation only — not final applicability/satisfaction.
 */
export type AttentionObservationCapabilityDeclarationTemporalRelation =
  | "FULL_REQUIRED_WINDOW_COVERAGE"
  | "PARTIAL_REQUIRED_WINDOW_OVERLAP"
  | "NO_REQUIRED_WINDOW_OVERLAP";

/**
 * Basis kind mirrors the deterministic interval relation.
 */
export type AttentionObservationCapabilityDeclarationTemporalApplicabilityBasisKind =
  AttentionObservationCapabilityDeclarationTemporalRelation;

/**
 * Candidate / set-level status.
 * Does not encode FULL / PARTIAL / NO as candidate-wide qualification.
 */
export type AttentionObservationCapabilityDeclarationTemporalApplicabilityStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
  | "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT"
  | "CAPABILITY_DECLARATION_TEMPORAL_RELATION_BASIS_PRESENT";

/**
 * Preserved Declaration validity window (canonical half-open).
 */
export interface AttentionObservationCapabilityDeclarationValidityWindow {
  valid_from: string;
  valid_until: string | null;
}

/**
 * Exact required-window ↔ Declaration-validity interval relation basis.
 */
export interface AttentionObservationCapabilityDeclarationTemporalApplicabilityBasis {
  key: string;
  observation_need_key: string;
  attention_candidate_key: string;
  observer_candidate_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  capability_requirement_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  capability_temporal_requirement_key: string;
  capability_declaration_match_key: string;
  capability_declaration_id: string;
  relation: AttentionObservationCapabilityDeclarationTemporalRelation;
  basis_kind: AttentionObservationCapabilityDeclarationTemporalApplicabilityBasisKind;
  required_window: AttentionObservationRequiredCapabilityTemporalWindow;
  declaration_window: AttentionObservationCapabilityDeclarationValidityWindow;
}

/**
 * Per structurally matching Declaration × explicit Temporal Requirement position.
 * When evaluable, applicability_basis is always present (including NO_OVERLAP).
 */
export interface AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition {
  key: string;
  capability_declaration_match: AttentionObservationCapabilityDeclarationMatch;
  capability_temporal_requirement: AttentionObservationCapabilityTemporalRequirement;
  relation: AttentionObservationCapabilityDeclarationTemporalRelation;
  applicability_basis: AttentionObservationCapabilityDeclarationTemporalApplicabilityBasis;
}

/**
 * Per Capability Requirement temporal-applicability aggregation.
 * No satisfaction.
 */
export interface AttentionObservationCapabilityRequirementTemporalApplicabilityPosition {
  capability_requirement: AttentionObservationCapabilityRequirement;
  temporal_requirement_assessment: AttentionObservationCapabilityRequirementTemporalAssessment;
  declaration_temporal_positions: AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition[];
}

/**
 * Groups requirement temporal-applicability positions for one Observer Candidate.
 * No suitability / temporally_valid_observer.
 */
export interface AttentionObservationObserverCapabilityTemporalApplicabilityBasis {
  observation_need_key: string;
  observer_candidate: AttentionObservationObserverCandidate;
  requirement_temporal_positions: AttentionObservationCapabilityRequirementTemporalApplicabilityPosition[];
}

export type AttentionObservationCapabilityDeclarationTemporalApplicabilityModelLimitation =
  | "CAPABILITY_TEMPORAL_POINT_REQUIREMENT_NOT_MODELED"
  | "CAPABILITY_LEFT_UNBOUNDED_TEMPORAL_REQUIREMENT_NOT_MODELED"
  | "CAPABILITY_MULTIPLE_TEMPORAL_WINDOWS_NOT_MODELED"
  | "CAPABILITY_RECURRING_TEMPORAL_REQUIREMENT_NOT_MODELED"
  | "CROSS_DECLARATION_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CROSS_OBSERVER_TEMPORAL_COMPOSITION_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_CONFLICT_RESOLUTION_NOT_MODELED"
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
 * Per-AttentionCandidate Declaration Temporal Applicability assessment.
 * has_capability_declaration_temporal_relation_basis is existential only.
 * FULL/PARTIAL/NO remain at Declaration position level — not candidate qualification.
 */
export interface AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment {
  candidate_key: string;
  capability_declaration_match_assessment: AttentionCandidateObservationCapabilityDeclarationAssessment;
  capability_temporal_requirement_assessment: AttentionCandidateObservationCapabilityTemporalRequirementAssessment;
  status: AttentionObservationCapabilityDeclarationTemporalApplicabilityStatus;
  observer_temporal_bases: AttentionObservationObserverCapabilityTemporalApplicabilityBasis[];
  has_capability_declaration_temporal_relation_basis: boolean;
  model_limitations: AttentionObservationCapabilityDeclarationTemporalApplicabilityModelLimitation[];
}

/**
 * Set-level Declaration Temporal Applicability assessment.
 * No temporally_valid_observers / temporally_qualified_observers.
 */
export interface AttentionObservationCapabilityDeclarationTemporalApplicabilitySetAssessment {
  capability_declaration_match_set: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  capability_temporal_requirement_set: AttentionObservationCapabilityTemporalRequirementSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment[];
  has_capability_declaration_temporal_relation_basis: boolean;
  model_limitations: AttentionObservationCapabilityDeclarationTemporalApplicabilityModelLimitation[];
}
