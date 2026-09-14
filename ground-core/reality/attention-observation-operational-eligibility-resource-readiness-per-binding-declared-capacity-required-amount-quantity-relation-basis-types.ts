/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Per-binding RESOURCE_READINESS Declared Capacity–Required Amount
 * Quantity Relation Basis types (GROUND-153).
 *
 * Derived only. Not persisted.
 *
 * Physical quantity branch (HYBRID):
 *   GROUND-135 Raw Evidence Assessment
 *   (nests GROUND-132 required_amount, GROUND-133 Binding,
 *    GROUND-134 evaluation instant, GROUND-022 capacity)
 *   → per-binding declared-capacity ↔ required_amount raw relation
 *
 * Declared capacity ≠ available / free / usable / contribution quantity
 * Interval relation ≠ SUFFICIENT / INSUFFICIENT / RESOURCE_READY
 * Binding ≠ physical contribution
 * No GROUND-151 / logical-branch runtime authority
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation,
} from "./attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.js";
import type {
  ResourceCapacity,
  ResourceRequirementAmount,
  ResourceScope,
} from "../types.js";

/**
 * Sole semantic runtime input — GROUND-135 nests 132/133/134/capacity lineage.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisEvalInput {
  resource_readiness_raw_evidence_assessment_set: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet;
}

/**
 * Raw closed-interval topology between declared capacity and required_amount.
 * Never SUFFICIENT / INSUFFICIENT / READY.
 */
export type AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelation =
  | "DECLARED_CAPACITY_INTERVAL_STRICTLY_BELOW_REQUIRED_AMOUNT_INTERVAL"
  | "DECLARED_CAPACITY_INTERVAL_EXACTLY_EQUALS_REQUIRED_AMOUNT_INTERVAL"
  | "DECLARED_CAPACITY_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REQUIRED_AMOUNT_INTERVAL"
  | "DECLARED_CAPACITY_INTERVAL_STRICTLY_CONTAINS_REQUIRED_AMOUNT_INTERVAL"
  | "DECLARED_CAPACITY_INTERVAL_PARTIALLY_OVERLAPS_REQUIRED_AMOUNT_INTERVAL"
  | "DECLARED_CAPACITY_INTERVAL_STRICTLY_ABOVE_REQUIRED_AMOUNT_INTERVAL";

export type AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisStatus =
  | "BOUND_RESOURCE_DECLARATION_NOT_FOUND"
  | "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT"
  | "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_RESOURCE_KEY_NOT_EXACT"
  | "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_UNIT_NOT_EXACT"
  | "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_SCOPE_NOT_EXACT"
  | "NO_CURRENT_APPLICABLE_DECLARED_CAPACITY"
  | "DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_PRESENT";

export type AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationTemporalBasis =
  "CAPACITY_DECLARATION_ACTIVE_AT_EVALUATION_INSTANT";

export type AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisModelLimitation =
  | "DECLARED_CAPACITY_IS_NOT_CURRENT_AVAILABLE_QUANTITY"
  | "DECLARED_CAPACITY_IS_NOT_RESERVATION_AWARE_FREE_QUANTITY"
  | "RESOURCE_AVAILABILITY_IS_NOT_A_NUMERICAL_QUANTITY"
  | "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED"
  | "RESOURCE_UNIT_CONVERSION_NOT_MODELED"
  | "RESOURCE_SCOPE_HIERARCHY_NOT_MODELED"
  | "PHYSICAL_RESOURCE_CONTRIBUTION_SEMANTICS_NOT_MODELED"
  | "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED"
  | "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED"
  | "RESOURCE_FUNGIBILITY_NOT_MODELED"
  | "RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "CROSS_BINDING_QUANTITY_SUMMATION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED"
  | "SHARED_RESOURCE_SIMULTANEOUS_SATISFIABILITY_NOT_MODELED"
  | "PHYSICAL_RESOURCE_COMPOSITION_NOT_MODELED"
  | "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * One exact capacity-declaration ↔ required_amount raw relation entry.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntry {
  key: string;
  capacity_declaration_id: string;
  resource_declaration_id: string;
  required_amount: ResourceRequirementAmount;
  required_amount_lower_bound: number;
  required_amount_upper_bound: number;
  declared_capacity: ResourceCapacity;
  declared_capacity_lower_bound: number;
  declared_capacity_upper_bound: number;
  unit: string;
  relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelation;
  temporal_basis: AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationTemporalBasis;
}

/**
 * Per-binding Quantity Relation Basis — raw declared-capacity relations only.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  resource_readiness_evaluation_instant_key: string;
  evaluation_at: string;
  resource_key: string;
  unit: string;
  resource_scope: ResourceScope;
  required_amount: ResourceRequirementAmount;
  requirement_temporal_relation: AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation;
  relation_entries: AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntry[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment {
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  raw_binding_evidence_assessment: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisStatus;
  quantity_relation_basis: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasis | null;
  has_declared_capacity_required_amount_quantity_relation_basis: boolean;
  relation_entry_count: number;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationRequirementAssessment {
  observation_resource_requirement_key: string;
  binding_quantity_relation_assessments: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment[];
  has_declared_capacity_required_amount_quantity_relation_bases: boolean;
}

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisAssessment {
  candidate_key: string;
  resource_readiness_raw_evidence_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment;
  requirement_quantity_relation_assessments: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationRequirementAssessment[];
  binding_quantity_relation_assessments: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment[];
  has_declared_capacity_required_amount_quantity_relation_bases: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSetAssessment {
  resource_readiness_raw_evidence_assessment_set: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisAssessment[];
  has_declared_capacity_required_amount_quantity_relation_bases: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisModelLimitation[];
}
