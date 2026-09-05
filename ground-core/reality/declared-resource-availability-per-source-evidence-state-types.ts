/**
 * Reality Core v0.7 — Declared Resource Availability
 * Per-source Evidence State types (GROUND-179).
 *
 * Derived only. Not persisted.
 *
 * ResourceAvailabilityDeclaration source set
 * + evaluation_at
 * → Per-source Declared Resource Availability Evidence States
 *
 * Deterministic semantic normalization of SOURCE ASSERTIONs.
 * Proposition: DECLARED_RESOURCE_AVAILABILITY_AT_EVALUATION_INSTANT
 *
 * AVAILABLE → SUPPORTING (source evidence, not objective truth)
 * UNAVAILABLE → CONTRADICTING (source evidence, not objective truth)
 *
 * No Interpretation Policy / Basis.
 * No source aggregation / ANY / ALL / majority / latest / authority wins.
 * No free quantity / deliverability / Resource Readiness.
 * Zero/expired/future sources → no current State (not negative evidence).
 * CONTESTED is not a per-source canonical value.
 */

import type {
  ReferenceDeclarer,
  ResourceAvailabilityDeclaration,
  ResourceAvailabilityStatus,
} from "../types.js";

/**
 * Exactly two semantic runtime inputs — declaration sources + evaluation instant.
 * Prefer direct declaration array (narrower than ProjectState).
 */
export interface DeclaredResourceAvailabilityPerSourceEvidenceStateEvalInput {
  resource_availability_declarations: ResourceAvailabilityDeclaration[];
  evaluation_at: string;
}

/**
 * Exactly two canonical per-source evidence States.
 * Never CONTESTED / NO_AVAILABILITY / UNRESOLVED / AVAILABLE / UNAVAILABLE
 * as canonical values. Never READY / EFFECTIVE / FREE.
 */
export type DeclaredResourceAvailabilityPerSourceEvidenceStateValue =
  | "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING"
  | "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING";

export type DeclaredResourceAvailabilityPerSourceEvidenceStateModelLimitation =
  | "OBJECTIVE_RESOURCE_AVAILABILITY_TRUTH_NOT_MODELED"
  | "AVAILABILITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "AVAILABILITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED"
  | "AVAILABILITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED"
  | "AVAILABILITY_SOURCE_PRIORITY_NOT_MODELED"
  | "AVAILABILITY_SOURCE_AUTHORITY_WEIGHTING_NOT_MODELED"
  | "AVAILABILITY_DECLARATION_SUPERSESSION_NOT_MODELED"
  | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
  | "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED"
  | "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED"
  | "EFFECTIVE_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED"
  | "PHYSICAL_EVIDENCE_REQUIRED_DIMENSION_POLICY_NOT_MODELED"
  | "PHYSICAL_EVIDENCE_DIMENSION_READINESS_NOT_MODELED"
  | "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED"
  | "PHYSICAL_DELIVERABILITY_NOT_MODELED"
  | "REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Current per-source Declared Resource Availability Evidence State.
 * One currently active declaration → one State.
 */
export interface DeclaredResourceAvailabilityPerSourceEvidenceState {
  key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  availability_declaration_id: string;
  declared_by: ReferenceDeclarer;
  raw_availability_status: ResourceAvailabilityStatus;
  valid_from: string;
  valid_until: string | null;
  value: DeclaredResourceAvailabilityPerSourceEvidenceStateValue;
}

/**
 * Resource-level descriptive grouping. Summary flags are existence-only.
 * Empty source States ≠ UNAVAILABLE ≠ NOT_APPLICABLE domain verdict.
 */
export interface DeclaredResourceAvailabilityPerSourceEvidenceResourceAssessment {
  resource_declaration_id: string;
  evaluation_at: string;
  active_availability_declaration_ids: string[];
  source_evidence_states: DeclaredResourceAvailabilityPerSourceEvidenceState[];
  has_supporting_source_evidence_states: boolean;
  has_contradicting_source_evidence_states: boolean;
}

/**
 * Set assessment. No aggregate availability polarity.
 */
export interface DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment {
  evaluation_at: string;
  resource_assessments: DeclaredResourceAvailabilityPerSourceEvidenceResourceAssessment[];
  source_evidence_states: DeclaredResourceAvailabilityPerSourceEvidenceState[];
  has_supporting_source_evidence_states: boolean;
  has_contradicting_source_evidence_states: boolean;
  model_limitations: DeclaredResourceAvailabilityPerSourceEvidenceStateModelLimitation[];
}
