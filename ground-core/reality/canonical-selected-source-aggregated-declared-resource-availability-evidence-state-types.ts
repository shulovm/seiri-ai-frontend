/**
 * Reality Core v0.7 — Canonical Selected-source Aggregated
 * Declared Resource Availability Evidence State types (GROUND-187).
 *
 * Derived only. Not persisted.
 *
 * GROUND-186 Current Aggregation Result Interpretation Basis Set
 * → Canonical Selected-source Aggregated Availability Evidence State
 *
 * Normalization only. Sole runtime authority: GROUND-186.
 *
 * NOT_APPLICABLE ≠ UNRESOLVED
 * NO_POLICY ≠ NO_MAPPING
 * SUPPORTING ≠ objectively AVAILABLE
 * CONTRADICTING ≠ objectively UNAVAILABLE
 * NO_CURRENT_RESULT ≠ CONTRADICTING
 * canonical State ≠ effective availability / deliverability / Resource Ready
 */

import type {
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment,
} from "./declared-resource-availability-source-aggregation-result-interpretation-basis-types.js";

/**
 * Exactly one semantic runtime input — GROUND-186 only.
 */
export interface CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateEvalInput {
  availability_source_aggregation_result_interpretation_basis_set: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment;
}

/**
 * Exactly seven canonical aggregated availability evidence States.
 * Never HOLDS / DOES_NOT_HOLD / AVAILABLE / UNAVAILABLE / MIXED / READY.
 */
export type CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue =
  | "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
  | "UNRESOLVED_NO_CURRENT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
  | "EXPLICITLY_INTERPRETED_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING"
  | "EXPLICITLY_INTERPRETED_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING";

export type CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateModelLimitation =
  | "AVAILABILITY_SOURCE_PRIORITY_NOT_MODELED"
  | "AVAILABILITY_SOURCE_AUTHORITY_WEIGHTING_NOT_MODELED"
  | "AVAILABILITY_DECLARATION_SUPERSESSION_NOT_MODELED"
  | "OBJECTIVE_RESOURCE_AVAILABILITY_TRUTH_NOT_MODELED"
  | "EFFECTIVE_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
  | "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED"
  | "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED"
  | "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED"
  | "QUANTITY_AVAILABILITY_HETEROGENEOUS_COMPOSITION_NOT_MODELED"
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
 * Canonical selected-source aggregated declared-resource-availability evidence State.
 * One GROUND-186 Resource assessment → one State.
 *
 * `current_lineage_anchor_key` preserves exact nested 186/183/182/180 identity
 * so same canonical value with different operand/missing-member lineage stays distinct.
 */
export interface CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState {
  key: string;
  resource_declaration_id: string;
  evaluation_at: string | null;
  availability_source_aggregation_policy_key: string | null;
  interpretation_basis_key: string | null;
  current_lineage_anchor_key: string | null;
  value: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue;
}

export interface CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResourceAssessment {
  resource_declaration_id: string;
  interpretation_basis_assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment;
  canonical_state: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState;
  is_applicable: boolean;
  is_resolved: boolean;
  is_unresolved: boolean;
}

/**
 * Set assessment. Summary flags are existence-only.
 * SUPPORTING and CONTRADICTING may coexist across resources.
 */
export interface CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSetAssessment {
  availability_source_aggregation_result_interpretation_basis_set: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment;
  resource_assessments: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResourceAssessment[];
  canonical_states: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState[];
  has_applicable_states: boolean;
  has_resolved_states: boolean;
  has_unresolved_states: boolean;
  has_supporting_states: boolean;
  has_contradicting_states: boolean;
  has_not_applicable_states: boolean;
  model_limitations: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateModelLimitation[];
}
