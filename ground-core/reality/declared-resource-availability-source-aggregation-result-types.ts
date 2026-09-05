/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Result types (GROUND-183).
 *
 * Derived only. Not persisted.
 *
 * GROUND-182 current Aggregation Readiness Basis Set
 * → Declared Resource Availability Source Aggregation Result
 *
 * Sole runtime authority: GROUND-182
 * (nests 180 operator/members + 181 readiness + 179 State lineage).
 *
 * Result exists only when readiness HOLDS.
 * readiness DNH ≠ Result DNH
 * Result HOLDS ≠ objective resource presence ≠ effective availability ≠ Resource Ready
 * Result DOES_NOT_HOLD ≠ objective resource absence
 * SUPPORTING → operand HOLDS; CONTRADICTING → operand DOES_NOT_HOLD
 * ANY/ALL executed only behind readiness HOLDS
 * all selected operands preserved (no lineage short-circuit)
 * no Result Interpretation / canonical aggregated State
 */

import type {
  DeclaredResourceAvailabilityPerSourceEvidenceStateValue,
} from "./declared-resource-availability-per-source-evidence-state-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationOperator,
} from "./declared-resource-availability-source-aggregation-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment,
} from "./declared-resource-availability-source-aggregation-readiness-basis-types.js";

/**
 * Exactly one semantic runtime input.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultEvalInput {
  availability_source_aggregation_readiness_basis_set: DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment;
}

/**
 * Neutral evidence-composition Result values only.
 * Not objective availability tokens, source polarity tokens, or readiness tokens.
 */
export type DeclaredResourceAvailabilitySourceAggregationResultValue =
  | "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
  | "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD";

/**
 * Narrow per-operand evidence-condition mapping after readiness HOLDS.
 */
export type DeclaredResourceAvailabilitySourceAggregationOperandCondition =
  | "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_OPERAND_HOLDS"
  | "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_OPERAND_DOES_NOT_HOLD";

export interface DeclaredResourceAvailabilitySourceAggregationOperand {
  availability_declaration_id: string;
  current_source_evidence_state_key: string;
  current_source_evidence_state_value: DeclaredResourceAvailabilityPerSourceEvidenceStateValue;
  operand_condition: DeclaredResourceAvailabilitySourceAggregationOperandCondition;
}

/**
 * Aggregation Result when readiness HOLDS.
 * Does not interpret Result as aggregated source polarity
 * or objective availability.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResult {
  key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  availability_source_aggregation_policy_key: string;
  availability_source_aggregation_readiness_policy_key: string;
  availability_source_aggregation_readiness_basis_key: string;
  operator: DeclaredResourceAvailabilitySourceAggregationOperator;
  selected_availability_declaration_ids: string[];
  operands: DeclaredResourceAvailabilitySourceAggregationOperand[];
  value: DeclaredResourceAvailabilitySourceAggregationResultValue;
}

/**
 * Outer status.
 * Result HOLDS/DNH live on the Result object when present.
 * readiness DNH is outer — no synthetic Result DNH.
 */
export type DeclaredResourceAvailabilitySourceAggregationResultStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  | "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
  | "NO_CURRENT_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
  | "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_PRESENT";

export type DeclaredResourceAvailabilitySourceAggregationResultModelLimitation =
  | "AVAILABILITY_AGGREGATION_RESULT_INTERPRETATION_NOT_MODELED"
  | "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED"
  | "NO_CURRENT_AVAILABILITY_EVIDENCE_CANONICALIZATION_NOT_MODELED"
  | "AVAILABILITY_SOURCE_PRIORITY_NOT_MODELED"
  | "AVAILABILITY_SOURCE_AUTHORITY_WEIGHTING_NOT_MODELED"
  | "AVAILABILITY_DECLARATION_SUPERSESSION_NOT_MODELED"
  | "OBJECTIVE_RESOURCE_AVAILABILITY_TRUTH_NOT_MODELED"
  | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
  | "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED"
  | "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED"
  | "EFFECTIVE_RESOURCE_AVAILABILITY_NOT_MODELED"
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

export interface DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment {
  resource_declaration_id: string;
  availability_source_aggregation_readiness_basis_assessment: DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment;
  status: DeclaredResourceAvailabilitySourceAggregationResultStatus;
  aggregation_result: DeclaredResourceAvailabilitySourceAggregationResult | null;
  result_value: DeclaredResourceAvailabilitySourceAggregationResultValue | null;
  has_aggregation_result: boolean;
}

/**
 * Set assessment. Summary flags are existence-only.
 * has HOLDS and has DNH may both be true across resources.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultSetAssessment {
  availability_source_aggregation_readiness_basis_set: DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment;
  resource_assessments: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment[];
  aggregation_results: DeclaredResourceAvailabilitySourceAggregationResult[];
  has_aggregation_results: boolean;
  has_composition_condition_holds_results: boolean;
  has_composition_condition_does_not_hold_results: boolean;
  model_limitations: DeclaredResourceAvailabilitySourceAggregationResultModelLimitation[];
}
