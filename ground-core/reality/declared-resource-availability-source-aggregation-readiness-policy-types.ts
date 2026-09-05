/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Readiness Policy types (GROUND-181).
 *
 * Derived only. Not persisted.
 *
 * GROUND-180 Availability Source Aggregation Policy Set
 * + explicit stable Readiness Specification
 * → Availability Source Aggregation Readiness Policy
 *
 * Declaration only. Current-independent.
 * Does NOT consume GROUND-179 current evidence States.
 * Does NOT include evaluation_at.
 * Does NOT evaluate readiness HOLDS / DOES_NOT_HOLD.
 * Does NOT execute ANY/ALL. Does NOT create Aggregation Result.
 *
 * readiness proposition:
 * SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION
 *
 * readiness rule:
 * REQUIRE_ALL_SELECTED_AVAILABILITY_SOURCE_EVIDENCE_STATES_PRESENT_AND_RESOLVED_BEFORE_AGGREGATION
 *
 * POLICY_PRESENT ≠ CONDITION_HOLDS / Resource Ready
 * NO_READINESS_POLICY ≠ readiness DOES_NOT_HOLD
 * NOT_APPLICABLE ≠ readiness failure
 * SUPPORTING and CONTRADICTING are both resolved
 * missing current selected source ≠ CONTRADICTING (later Basis)
 * ANY/ALL short-circuit readiness not modeled
 */

import type {
  DeclaredResourceAvailabilitySourceAggregationPolicy,
  DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment,
} from "./declared-resource-availability-source-aggregation-policy-types.js";

/**
 * Sole supported readiness rule.
 * Declaration only — not evaluated against current GROUND-179 States.
 */
export type DeclaredResourceAvailabilitySourceAggregationReadinessRule =
  "REQUIRE_ALL_SELECTED_AVAILABILITY_SOURCE_EVIDENCE_STATES_PRESENT_AND_RESOLVED_BEFORE_AGGREGATION";

/**
 * Specification entry anchored to exact GROUND-180 Aggregation Policy key.
 * Does NOT independently supply member ids / operator / ResourceDeclaration.
 */
export interface DeclaredResourceAvailabilitySourceAggregationReadinessPolicyInput {
  availability_source_aggregation_policy_key: string;
  rule: DeclaredResourceAvailabilitySourceAggregationReadinessRule;
}

export interface DeclaredResourceAvailabilitySourceAggregationReadinessPolicySpecification {
  policies: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyInput[];
}

/**
 * Exactly two semantic runtime inputs.
 * No evaluation_at. No GROUND-179 State Set.
 */
export interface DeclaredResourceAvailabilitySourceAggregationReadinessPolicyEvalInput {
  availability_source_aggregation_policy_set: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment;
  specification: DeclaredResourceAvailabilitySourceAggregationReadinessPolicySpecification;
}

/**
 * Stable Aggregation Readiness Policy declaration.
 * Nested GROUND-180 Policy preserved as authoritative lineage.
 * No readiness_result / CONDITION_HOLDS.
 */
export interface DeclaredResourceAvailabilitySourceAggregationReadinessPolicy {
  key: string;
  resource_declaration_id: string;
  availability_source_aggregation_policy_key: string;
  availability_source_aggregation_policy: DeclaredResourceAvailabilitySourceAggregationPolicy;
  proposition: "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION";
  rule: DeclaredResourceAvailabilitySourceAggregationReadinessRule;
}

export type DeclaredResourceAvailabilitySourceAggregationReadinessPolicyStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  | "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
  | "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";

export type DeclaredResourceAvailabilitySourceAggregationReadinessPolicyModelLimitation =
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
  | "QUANTITY_AVAILABILITY_HETEROGENEOUS_COMPOSITION_NOT_MODELED"
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

export interface DeclaredResourceAvailabilitySourceAggregationReadinessPolicyResourceAssessment {
  resource_declaration_id: string;
  availability_source_aggregation_policy_assessment: DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment;
  status: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyStatus;
  readiness_policy: DeclaredResourceAvailabilitySourceAggregationReadinessPolicy | null;
  has_explicit_declared_resource_availability_source_aggregation_readiness_policy: boolean;
}

/**
 * Set assessment. Existence flags only — no readiness HOLDS/DNH.
 */
export interface DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment {
  availability_source_aggregation_policy_set: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment;
  specification: DeclaredResourceAvailabilitySourceAggregationReadinessPolicySpecification;
  resource_assessments: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyResourceAssessment[];
  readiness_policies: DeclaredResourceAvailabilitySourceAggregationReadinessPolicy[];
  has_explicit_readiness_policies: boolean;
  model_limitations: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyModelLimitation[];
}
