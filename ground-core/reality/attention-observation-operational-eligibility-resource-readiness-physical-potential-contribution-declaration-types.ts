/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Explicit Per-binding RESOURCE_READINESS Physical Potential Contribution
 * Declaration types (GROUND-155).
 *
 * Derived only. Not persisted.
 *
 * Physical quantity branch:
 *   GROUND-153 Quantity Relation Binding context
 *   + explicit Potential Contribution Specification
 *   → Explicit Declared Potential Contribution Declaration
 *
 * declared_potential_contribution_quantity ≠ capacity / available / free /
 * usable / effective / allocated / committed / ready / verified contribution
 * Declaration ≠ truth
 * No GROUND-141 / GROUND-151 logical-branch runtime authority
 * No capacity auto-fill / consistency verdict
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-types.js";
import type { ResourceRequirementAmount } from "../types.js";

/**
 * Specification entry targeting one exact GROUND-153 Binding physical context.
 * Does NOT supply capacity, availability, Reservation, or logical polarity.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationInput {
  resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key: string;
  declared_potential_contribution_quantity: ResourceRequirementAmount;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionSpecification {
  declarations: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationInput[];
}

/**
 * Exactly two semantic runtime inputs.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationEvalInput {
  resource_readiness_declared_capacity_required_amount_quantity_relation_set: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionSpecification;
}

export type AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationStatus =
  | "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION"
  | "EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT";

/**
 * Explicit declaration-relative potential contribution toward one Requirement×Binding context.
 * Not verified / effective / free / allocated / ready.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration {
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
  declared_potential_contribution_quantity: ResourceRequirementAmount;
  resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key: string;
}

export type AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationModelLimitation =
  | "DECLARED_POTENTIAL_CONTRIBUTION_IS_NOT_VERIFIED_PHYSICAL_CONTRIBUTION"
  | "DECLARED_CAPACITY_TO_POTENTIAL_CONTRIBUTION_CONSISTENCY_NOT_MODELED"
  | "REQUIRED_AMOUNT_TO_POTENTIAL_CONTRIBUTION_CONSISTENCY_NOT_MODELED"
  | "RESOURCE_DIVISIBILITY_NOT_MODELED"
  | "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED"
  | "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED"
  | "RESOURCE_CAPACITY_RANGE_SEMANTICS_NOT_FULLY_MODELED"
  | "RESOURCE_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_FULLY_MODELED"
  | "RESOURCE_QUALITY_COMPATIBILITY_NOT_MODELED"
  | "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_INCLUDED"
  | "RESERVATION_AWARE_EFFECTIVE_FREE_QUANTITY_NOT_MODELED"
  | "EFFECTIVE_PHYSICAL_CONTRIBUTION_NOT_MODELED"
  | "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED"
  | "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED"
  | "RESOURCE_FUNGIBILITY_NOT_MODELED"
  | "RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "CROSS_BINDING_QUANTITY_SUMMATION_NOT_MODELED"
  | "SHARED_RESOURCE_SIMULTANEOUS_SATISFIABILITY_NOT_MODELED"
  | "PHYSICAL_RESOURCE_COMPOSITION_NOT_MODELED"
  | "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED"
  | "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment {
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key: string;
  quantity_relation_binding_assessment: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationStatus;
  declaration: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration | null;
  has_explicit_physical_potential_contribution_declaration: boolean;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationRequirementAssessment {
  observation_resource_requirement_key: string;
  binding_potential_contribution_declaration_assessments: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment[];
  has_explicit_physical_potential_contribution_declarations: boolean;
}

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment {
  candidate_key: string;
  resource_readiness_declared_capacity_required_amount_quantity_relation_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisAssessment;
  requirement_potential_contribution_declaration_assessments: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationRequirementAssessment[];
  binding_potential_contribution_declaration_assessments: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment[];
  has_explicit_physical_potential_contribution_declarations: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment {
  resource_readiness_declared_capacity_required_amount_quantity_relation_set: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSetAssessment;
  specification: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionSpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment[];
  has_explicit_physical_potential_contribution_declarations: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationModelLimitation[];
}
