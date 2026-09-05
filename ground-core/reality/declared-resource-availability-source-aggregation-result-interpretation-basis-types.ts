/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Result Interpretation Basis types (GROUND-186).
 *
 * Derived only. Not persisted.
 *
 * current GROUND-183 Aggregation Result Set
 * + GROUND-185 stable Result Interpretation Policy Set
 * → Exact current Aggregation Result Interpretation Basis
 *
 * NO_CURRENT_RESULT ≠ NO_MAPPING
 * NO_POLICY ≠ NO_MAPPING
 * NO_MAPPING ≠ CONTRADICTING
 * SUPPORTING ≠ objectively AVAILABLE
 * CONTRADICTING ≠ objectively UNAVAILABLE
 * BASIS_PRESENT ≠ canonical aggregated evidence State
 * unusual explicit mappings are authoritative
 * full GROUND-183 operand lineage preserved
 */

import type {
  DeclaredResourceAvailabilitySourceAggregationResult,
  DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultSetAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultValue,
} from "./declared-resource-availability-source-aggregation-result-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationResultInterpretation,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment,
} from "./declared-resource-availability-source-aggregation-result-interpretation-policy-types.js";

/**
 * Exactly two semantic inputs — GROUND-183 + GROUND-185.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisEvalInput {
  availability_source_aggregation_result_set: DeclaredResourceAvailabilitySourceAggregationResultSetAssessment;
  availability_source_aggregation_result_interpretation_policy_set: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment;
}

/**
 * Six distinct Basis statuses — do not collapse any pair.
 */
export type DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
  | "UNRESOLVED_NO_CURRENT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
  | "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT";

/**
 * Exact current Interpretation Basis when Result + Policy + mapping all exist.
 * Nested full GROUND-183 Result preserves operand lineage.
 * No canonical aggregated evidence State yet.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasis {
  key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  availability_source_aggregation_policy_key: string;
  availability_source_aggregation_result_key: string;
  availability_source_aggregation_result_interpretation_policy_key: string;
  matched_mapping_key: string;
  current_result_value: DeclaredResourceAvailabilitySourceAggregationResultValue;
  interpretation: DeclaredResourceAvailabilitySourceAggregationResultInterpretation;
  current_aggregation_result: DeclaredResourceAvailabilitySourceAggregationResult;
}

export type DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisModelLimitation =
  | "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED"
  | "PARTIAL_VS_TOTAL_CURRENT_AVAILABILITY_EVIDENCE_MISSING_CANONICAL_DISTINCTION_NOT_MODELED"
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

export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment {
  resource_declaration_id: string;
  availability_source_aggregation_result_assessment: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment;
  availability_source_aggregation_result_interpretation_policy_assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment;
  status: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisStatus;
  interpretation_basis: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasis | null;
  interpretation: DeclaredResourceAvailabilitySourceAggregationResultInterpretation | null;
  has_interpretation_basis: boolean;
}

/**
 * Set assessment. Summary flags are existence-only.
 * SUPPORTING and CONTRADICTING may coexist across resources.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment {
  availability_source_aggregation_result_set: DeclaredResourceAvailabilitySourceAggregationResultSetAssessment;
  availability_source_aggregation_result_interpretation_policy_set: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment;
  resource_assessments: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment[];
  interpretation_bases: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasis[];
  has_interpretation_bases: boolean;
  has_supporting_interpretation_bases: boolean;
  has_contradicting_interpretation_bases: boolean;
  has_unresolved_assessments: boolean;
  model_limitations: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisModelLimitation[];
}
