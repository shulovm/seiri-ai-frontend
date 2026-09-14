/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Explicit Declared Potential Contribution Capacity-Relation
 * Interpretation Policy types (GROUND-159).
 *
 * Derived only. Not persisted.
 *
 * Stable GROUND-155 Binding context
 * + explicit capacity-axis Interpretation Policy Specification
 * → Explicit Declared Potential Contribution Capacity-Relation
 *   Interpretation Policy only.
 *
 * Does NOT consume current GROUND-157 Raw Relation Basis.
 * GROUND-157 raw relation enum is type-only source vocabulary.
 *
 * SUPPORTS / CONTRADICTS ≠ physical truth / availability / free /
 * effective / verified / Resource Ready
 * policy absence ≠ explicit empty policy
 * unusual mappings are valid; partial policy is valid
 * required_amount axis interpretation NOT MODELED
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-types.js";

/**
 * Capacity-axis only. Required-amount axis excluded from GROUND-159.
 */
export type AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRelationInterpretationAxis =
  "DECLARED_CAPACITY";

/**
 * Explicit evidence interpretation of contribution↔capacity raw topology
 * relative to declaration-relative capacity compatibility.
 * Never CONSISTENT / SUFFICIENT / READY.
 */
export type AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation =
  | "INTERPRET_AS_SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY"
  | "INTERPRET_AS_CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY";

export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingInput {
  raw_relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping {
  key: string;
  relation_axis: "DECLARED_CAPACITY";
  raw_relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyInput {
  resource_readiness_observation_context_binding_key: string;
  mappings: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingInput[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification {
  policies: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyInput[];
}

/**
 * Exactly two semantic runtime inputs.
 * GROUND-157 current Basis is not an input.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyEvalInput {
  resource_readiness_physical_potential_contribution_declaration_set: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification;
}

/**
 * Current-relation-independent Policy for Binding × DECLARED_CAPACITY axis.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicy {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  relation_axis: "DECLARED_CAPACITY";
  mappings: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping[];
}

export type AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyStatus =
  | "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED"
  | "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_PRESENT";

export type AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyModelLimitation =
  | "CURRENT_CAPACITY_RELATION_INTERPRETATION_NOT_APPLIED"
  | "PER_SOURCE_CAPACITY_RELATION_INTERPRETATION_BASIS_NOT_MODELED"
  | "PER_SOURCE_CAPACITY_RELATION_CANONICAL_STATE_NOT_MODELED"
  | "CAPACITY_SOURCE_MEMBER_SET_NOT_MODELED"
  | "CAPACITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "CAPACITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED"
  | "CAPACITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED"
  | "CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED"
  | "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED"
  | "PHYSICAL_CONTRIBUTION_EVIDENCE_COMPOSITION_NOT_MODELED"
  | "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED"
  | "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED"
  | "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED"
  | "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED"
  | "RESOURCE_DIVISIBILITY_NOT_MODELED"
  | "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED"
  | "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED"
  | "RESOURCE_CAPACITY_RANGE_SEMANTICS_NOT_FULLY_MODELED"
  | "RESOURCE_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_FULLY_MODELED"
  | "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED"
  | "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED"
  | "RESOURCE_FUNGIBILITY_NOT_MODELED"
  | "RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "CROSS_BINDING_QUANTITY_COMPOSITION_NOT_MODELED"
  | "PHYSICAL_RESOURCE_COMPOSITION_NOT_MODELED"
  | "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment {
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  status: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyStatus;
  interpretation_policy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicy | null;
  has_explicit_capacity_relation_interpretation_policy: boolean;
}

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyAssessment {
  candidate_key: string;
  physical_potential_contribution_declaration_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment;
  binding_interpretation_policy_assessments: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment[];
  has_explicit_capacity_relation_interpretation_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySetAssessment {
  resource_readiness_physical_potential_contribution_declaration_set: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyAssessment[];
  has_explicit_capacity_relation_interpretation_policies: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyModelLimitation[];
}
