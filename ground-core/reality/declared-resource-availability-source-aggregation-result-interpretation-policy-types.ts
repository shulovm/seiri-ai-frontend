/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Result Interpretation Policy types (GROUND-185).
 *
 * Derived only. Not persisted.
 *
 * GROUND-180 stable Aggregation Policy Set
 * + explicit Result Interpretation Specification
 * → Stable Aggregation Result Interpretation Policy
 *
 * Declaration only. Current-independent.
 * Does NOT consume current GROUND-183 Result values.
 * Does NOT apply mappings. Does NOT create Interpretation Basis / canonical State.
 *
 * INTERPRET_AS_SUPPORTING_... ≠ objectively AVAILABLE
 * INTERPRET_AS_CONTRADICTING_... ≠ objectively UNAVAILABLE
 * Result HOLDS ≠ SUPPORTING unless explicitly mapped
 * Result DNH ≠ CONTRADICTING unless explicitly mapped
 * unusual mappings legal; partial Policy valid; explicit empty ≠ absence
 * ALL+DNH has no built-in contradiction mapping
 */

import type {
  DeclaredResourceAvailabilitySourceAggregationPolicy,
  DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment,
} from "./declared-resource-availability-source-aggregation-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationResultValue,
} from "./declared-resource-availability-source-aggregation-result-types.js";

/**
 * Aggregate evidence proposition for selected-source aggregation contracts.
 */
export type DeclaredResourceAvailabilitySourceAggregationResultInterpretationProposition =
  "SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE";

/**
 * Mapping source = GROUND-183 ResultValue vocabulary (type-only).
 * Operator is inherited from exact GROUND-180 Policy subject.
 */
export type DeclaredResourceAvailabilitySourceAggregationResultInterpretationSourceValue =
  DeclaredResourceAvailabilitySourceAggregationResultValue;

/**
 * Aggregated evidence polarity targets only.
 * Not AVAILABLE / UNAVAILABLE / READY / TRUE / FALSE.
 */
export type DeclaredResourceAvailabilitySourceAggregationResultInterpretation =
  | "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE"
  | "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE";

export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingInput {
  source_result_value: DeclaredResourceAvailabilitySourceAggregationResultInterpretationSourceValue;
  interpretation: DeclaredResourceAvailabilitySourceAggregationResultInterpretation;
}

export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping {
  key: string;
  source_result_value: DeclaredResourceAvailabilitySourceAggregationResultInterpretationSourceValue;
  interpretation: DeclaredResourceAvailabilitySourceAggregationResultInterpretation;
}

/**
 * Specification targets exact stable GROUND-180 Aggregation Policy key.
 * Does NOT target current GROUND-183 Result key / readiness Basis key.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyInput {
  availability_source_aggregation_policy_key: string;
  mappings: DeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingInput[];
}

export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySpecification {
  policies: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyInput[];
}

/**
 * Exactly two semantic runtime inputs.
 * GROUND-183 Result Set is not an input.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyEvalInput {
  availability_source_aggregation_policy_set: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment;
  specification: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySpecification;
}

/**
 * Runtime-only Result Interpretation Policy declaration.
 * Nested GROUND-180 Policy preserved as authoritative lineage.
 * No current_result / evaluation_at / operand lineage.
 * mappings=[] is still POLICY_PRESENT.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy {
  key: string;
  resource_declaration_id: string;
  availability_source_aggregation_policy_key: string;
  availability_source_aggregation_policy: DeclaredResourceAvailabilitySourceAggregationPolicy;
  proposition: DeclaredResourceAvailabilitySourceAggregationResultInterpretationProposition;
  mappings: DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping[];
}

export type DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  | "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY"
  | "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT";

export type DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyModelLimitation =
  | "AVAILABILITY_AGGREGATION_RESULT_INTERPRETATION_BASIS_NOT_MODELED"
  | "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED"
  | "CURRENT_AVAILABILITY_AGGREGATION_RESULT_MAPPING_RESOLUTION_NOT_MODELED"
  | "NO_CURRENT_AVAILABILITY_EVIDENCE_CANONICALIZATION_NOT_MODELED"
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

export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment {
  resource_declaration_id: string;
  availability_source_aggregation_policy_assessment: DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment;
  status: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyStatus;
  interpretation_policy: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy | null;
  has_explicit_result_interpretation_policy: boolean;
}

/**
 * Set assessment. Existence / descriptive completeness flags only.
 * No current Result application.
 */
export interface DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment {
  availability_source_aggregation_policy_set: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment;
  specification: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySpecification;
  resource_assessments: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment[];
  interpretation_policies: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy[];
  has_explicit_result_interpretation_policies: boolean;
  has_empty_mapping_policies: boolean;
  has_partial_mapping_policies: boolean;
  has_complete_mapping_policies: boolean;
  model_limitations: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyModelLimitation[];
}
