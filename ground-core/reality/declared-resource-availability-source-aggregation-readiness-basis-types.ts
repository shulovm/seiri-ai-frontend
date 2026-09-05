/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Readiness Basis types (GROUND-182).
 *
 * Derived only. Not persisted.
 *
 * GROUND-179 current per-source Availability Evidence State Set
 * + GROUND-181 stable Aggregation Readiness Policy Set
 * → Current Availability Source Aggregation Readiness Basis
 *
 * Answers only whether every selected availability source member has
 * exactly one current resolved GROUND-179 evidence State at evaluation_at.
 *
 * readiness HOLDS ≠ Aggregation Result HOLDS ≠ AVAILABLE ≠ Resource Ready
 * readiness DOES_NOT_HOLD ≠ Aggregation Result DOES_NOT_HOLD ≠ UNAVAILABLE
 * SUPPORTING and CONTRADICTING are both resolved
 * MISSING ≠ CONTRADICTING ≠ UNAVAILABLE
 * BASIS_PRESENT ≠ readiness HOLDS
 * NO_READINESS_POLICY ≠ CONDITION_DOES_NOT_HOLD
 * NOT_APPLICABLE ≠ CONDITION_DOES_NOT_HOLD
 * ANY/ALL not executed
 * no short-circuit materialization
 * no later-domain no-current-evidence canonicalization
 */

import type {
  DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment,
  DeclaredResourceAvailabilityPerSourceEvidenceStateValue,
} from "./declared-resource-availability-per-source-evidence-state-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationOperator,
} from "./declared-resource-availability-source-aggregation-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessRule,
} from "./declared-resource-availability-source-aggregation-readiness-policy-types.js";

/**
 * Exactly two semantic runtime inputs.
 * GROUND-181 nests exact GROUND-180 Aggregation Policy (members + operator).
 * evaluation_at comes only from GROUND-179 Set.
 */
export interface DeclaredResourceAvailabilitySourceAggregationReadinessBasisEvalInput {
  per_source_availability_evidence_state_set: DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment;
  availability_source_aggregation_readiness_policy_set: DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment;
}

/**
 * Readiness condition only — not aggregation Result / availability truth.
 */
export type DeclaredResourceAvailabilitySourceAggregationReadinessCondition =
  | "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION_HOLDS"
  | "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD";

/**
 * Per-selected-member readiness status.
 * Polarity is preserved separately; not encoded here.
 */
export type DeclaredResourceAvailabilitySourceAggregationReadinessMemberStatus =
  | "CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE_PRESENT_AND_RESOLVED"
  | "MISSING_CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE";

export interface DeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessment {
  availability_declaration_id: string;
  status: DeclaredResourceAvailabilitySourceAggregationReadinessMemberStatus;
  current_source_evidence_state_key: string | null;
  current_source_evidence_state_value: DeclaredResourceAvailabilityPerSourceEvidenceStateValue | null;
  is_present: boolean;
  is_resolved: boolean;
}

/**
 * Current Aggregation Readiness Basis.
 * Exists when GROUND-180 Aggregation Policy + GROUND-181 Readiness Policy exist,
 * even when readiness DOES_NOT_HOLD.
 * Operator is lineage only — not executed.
 */
export interface DeclaredResourceAvailabilitySourceAggregationReadinessBasis {
  key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  availability_source_aggregation_policy_key: string;
  availability_source_aggregation_readiness_policy_key: string;
  readiness_rule: DeclaredResourceAvailabilitySourceAggregationReadinessRule;
  operator: DeclaredResourceAvailabilitySourceAggregationOperator;
  selected_availability_declaration_ids: string[];
  member_assessments: DeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessment[];
  condition: DeclaredResourceAvailabilitySourceAggregationReadinessCondition;
}

/**
 * Outer status — applicability / Basis existence only.
 * Current readiness outcome lives inside Basis.condition.
 */
export type DeclaredResourceAvailabilitySourceAggregationReadinessBasisStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  | "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
  | "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT";

export type DeclaredResourceAvailabilitySourceAggregationReadinessBasisModelLimitation =
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

export interface DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment {
  resource_declaration_id: string;
  availability_source_aggregation_readiness_policy_assessment: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyResourceAssessment;
  status: DeclaredResourceAvailabilitySourceAggregationReadinessBasisStatus;
  readiness_basis: DeclaredResourceAvailabilitySourceAggregationReadinessBasis | null;
  readiness_condition: DeclaredResourceAvailabilitySourceAggregationReadinessCondition | null;
  has_readiness_basis: boolean;
}

/**
 * Set assessment. Summary flags are existence-only.
 * has_holds and has_dnh may both be true across resources.
 */
export interface DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment {
  per_source_availability_evidence_state_set: DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment;
  availability_source_aggregation_readiness_policy_set: DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment;
  evaluation_at: string;
  resource_assessments: DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment[];
  readiness_bases: DeclaredResourceAvailabilitySourceAggregationReadinessBasis[];
  has_readiness_bases: boolean;
  has_readiness_condition_holds: boolean;
  has_readiness_condition_does_not_hold: boolean;
  model_limitations: DeclaredResourceAvailabilitySourceAggregationReadinessBasisModelLimitation[];
}
