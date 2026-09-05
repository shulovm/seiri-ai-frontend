/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Policy types (GROUND-180).
 *
 * Derived only. Not persisted.
 *
 * ResourceDeclaration stable domain
 * + ResourceAvailabilityDeclaration stable source domain
 * + explicit nonempty selected availability_declaration.id member set
 * + explicit ANY | ALL operator
 * → Declared Resource Availability Source Aggregation Policy
 *
 * Declaration only. Current-independent.
 * Does NOT consume GROUND-179 current evidence States.
 * Does NOT include evaluation_at.
 * Does NOT evaluate ANY/ALL. Does NOT create readiness / Result.
 *
 * SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION
 * ≠ RESOURCE_IS_AVAILABLE / EFFECTIVE_AVAILABILITY / READY
 * empty member set forbidden (vacuous ANY/ALL)
 * selected membership ≠ preferred / trusted / currently active
 */

import type {
  ResourceAvailabilityDeclaration,
  ResourceDeclaration,
} from "../types.js";

/**
 * Explicit future evidence-composition operators.
 * Declaration only — not executed.
 */
export type DeclaredResourceAvailabilitySourceAggregationOperator =
  | "ANY"
  | "ALL";

export interface DeclaredResourceAvailabilitySourceAggregationPolicyInput {
  resource_declaration_id: string;
  selected_availability_declaration_ids: string[];
  operator: DeclaredResourceAvailabilitySourceAggregationOperator;
}

export interface DeclaredResourceAvailabilitySourceAggregationPolicySpecification {
  policies: DeclaredResourceAvailabilitySourceAggregationPolicyInput[];
}

/**
 * Exactly three semantic runtime inputs.
 * No evaluation_at. No GROUND-179 State Set.
 */
export interface DeclaredResourceAvailabilitySourceAggregationPolicyEvalInput {
  resource_declarations: ResourceDeclaration[];
  resource_availability_declarations: ResourceAvailabilityDeclaration[];
  specification: DeclaredResourceAvailabilitySourceAggregationPolicySpecification;
}

/**
 * Stable Aggregation Policy.
 * selected_availability_declaration_ids are durable declaration ids.
 */
export interface DeclaredResourceAvailabilitySourceAggregationPolicy {
  key: string;
  resource_declaration_id: string;
  proposition: "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION";
  selected_availability_declaration_ids: string[];
  operator: DeclaredResourceAvailabilitySourceAggregationOperator;
}

export type DeclaredResourceAvailabilitySourceAggregationPolicyStatus =
  | "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  | "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_PRESENT";

export type DeclaredResourceAvailabilitySourceAggregationPolicyModelLimitation =
  | "AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED"
  | "AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED"
  | "AVAILABILITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
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

export interface DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment {
  resource_declaration_id: string;
  status: DeclaredResourceAvailabilitySourceAggregationPolicyStatus;
  aggregation_policy: DeclaredResourceAvailabilitySourceAggregationPolicy | null;
  has_explicit_declared_resource_availability_source_aggregation_policy: boolean;
}

/**
 * Set assessment. Existence flags only — no aggregate polarity / Result.
 */
export interface DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment {
  resource_assessments: DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment[];
  aggregation_policies: DeclaredResourceAvailabilitySourceAggregationPolicy[];
  has_explicit_aggregation_policies: boolean;
  has_any_operator_policies: boolean;
  has_all_operator_policies: boolean;
  model_limitations: DeclaredResourceAvailabilitySourceAggregationPolicyModelLimitation[];
}
