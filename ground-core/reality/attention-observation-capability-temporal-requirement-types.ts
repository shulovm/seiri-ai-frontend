/**
 * Reality Core v0.7 — Attention Observation Capability Temporal Requirement types (GROUND-056).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement
 * + explicit Capability Temporal Requirement Specification
 * → Explicit Capability Temporal Requirement Basis only.
 *
 * Sibling of:
 *   - 054 Scope Requirement → 055 Scope Basis
 *   - 050–053 Capability state branch
 *
 * Capability Temporal Requirement ≠ ObservationNeed.temporal_scope
 * Capability Temporal Requirement ≠ Situation.at
 * Capability Temporal Requirement ≠ wall-clock now
 * Capability Temporal Requirement ≠ CapabilityDeclaration validity
 * Capability Temporal Requirement ≠ Observation schedule
 * Capability Temporal Requirement ≠ Commitment temporal terms
 * Capability Temporal Requirement ≠ urgency
 * Capability Temporal Requirement ≠ Requirement satisfaction
 *
 * No reusable generic "required capability time window" type exists in-repo;
 * this defines a minimal runtime-only requirement window.
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Minimal runtime-only required Capability temporal window.
 * Canonical half-open semantics: [required_from, required_until)
 * required_until = null → explicit open-ended [required_from, +∞)
 *
 * Not TemporalObservationScope / reservation windows / situation event windows.
 * Exclusive interval end only — not Commitment temporal terms. Not schedule. Not execution_window.
 */
export interface AttentionObservationRequiredCapabilityTemporalWindow {
  required_from: string;
  required_until: string | null;
}

/**
 * Runtime evaluation input entry — not canonical persisted temporal policy.
 * No provenance / Authority.
 */
export interface AttentionObservationCapabilityTemporalRequirementInput {
  capability_requirement_key: string;
  required_window: AttentionObservationRequiredCapabilityTemporalWindow;
}

export interface AttentionObservationCapabilityTemporalRequirementSpecification {
  requirements: AttentionObservationCapabilityTemporalRequirementInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 directly — not 050–055.
 */
export interface AttentionObservationCapabilityTemporalRequirementEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityTemporalRequirementSpecification;
}

/**
 * Per-Capability-Requirement temporal status.
 * Absent requirement ≠ open-ended / always / now.
 */
export type AttentionObservationCapabilityTemporalRequirementStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_DECLARED"
  | "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT";

/**
 * Candidate-level temporal requirement status.
 * Not ALL_TEMPORALLY_SPECIFIED / PARTIALLY_TEMPORALLY_SPECIFIED / COMPLETE.
 */
export type AttentionObservationCapabilityTemporalRequirementCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_DECLARED"
  | "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_PRESENT";

/**
 * Explicit Observation Capability Requirement-relative required temporal window.
 * Not covered / active / current / satisfied / urgent.
 */
export interface AttentionObservationCapabilityTemporalRequirement {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  required_window: AttentionObservationRequiredCapabilityTemporalWindow;
}

/**
 * Requirement exists; Temporal Requirement may or may not.
 */
export interface AttentionObservationCapabilityTemporalRequirementBasis {
  capability_requirement: AttentionObservationCapabilityRequirement;
  temporal_requirement: AttentionObservationCapabilityTemporalRequirement | null;
}

/**
 * Per explicit Capability Requirement temporal assessment.
 */
export interface AttentionObservationCapabilityRequirementTemporalAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  status: AttentionObservationCapabilityTemporalRequirementStatus;
  temporal_requirement_basis: AttentionObservationCapabilityTemporalRequirementBasis;
}

export type AttentionObservationCapabilityTemporalRequirementModelLimitation =
  | "CAPABILITY_TEMPORAL_REQUIREMENT_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_REQUIREMENT_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_REQUIREMENT_POLICY_NOT_MODELED"
  | "OBSERVATION_TEMPORAL_SCOPE_TO_CAPABILITY_TEMPORAL_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "SITUATION_TIME_TO_CAPABILITY_TEMPORAL_REQUIREMENT_BRIDGE_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_POINT_REQUIREMENT_NOT_MODELED"
  | "CAPABILITY_MULTIPLE_TEMPORAL_WINDOWS_NOT_MODELED"
  | "CAPABILITY_RECURRING_TEMPORAL_REQUIREMENT_NOT_MODELED"
  | "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED"
  | "OBSERVATION_EXECUTION_TIME_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
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
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-AttentionCandidate Capability Temporal Requirement assessment.
 * has_explicit_capability_temporal_requirements is existential only.
 */
export interface AttentionCandidateObservationCapabilityTemporalRequirementAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationCapabilityTemporalRequirementCandidateStatus;
  requirement_temporal_assessments: AttentionObservationCapabilityRequirementTemporalAssessment[];
  has_explicit_capability_temporal_requirements: boolean;
  model_limitations: AttentionObservationCapabilityTemporalRequirementModelLimitation[];
}

/**
 * Set-level Capability Temporal Requirement assessment.
 * No scheduled_requirements / active_requirements / current_requirements / time_valid_requirements.
 */
export interface AttentionObservationCapabilityTemporalRequirementSetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityTemporalRequirementSpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityTemporalRequirementAssessment[];
  has_explicit_capability_temporal_requirements: boolean;
  model_limitations: AttentionObservationCapabilityTemporalRequirementModelLimitation[];
}
