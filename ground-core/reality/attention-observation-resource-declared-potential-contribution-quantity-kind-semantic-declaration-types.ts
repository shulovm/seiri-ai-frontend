/**
 * Reality Core v0.7 — Attention Observation Declared Potential Contribution
 * Quantity-Kind Semantic Declaration types (GROUND-173).
 *
 * Derived only. Not persisted.
 *
 * GROUND-155 Physical Potential Contribution Declaration Set
 * + explicit Potential Contribution Quantity-Kind Semantic Specification
 * → Explicit Per-contribution Quantity-Kind Semantic Declaration
 *
 * Declaration only. Does NOT interpret GROUND-157 raw relations.
 * Does NOT match against GROUND-171 required_amount quantity_kind.
 * Does NOT emit SUPPORTING/CONTRADICTING / satisfaction / readiness.
 *
 * POINT/RANGE ≠ STOCK/FLOW
 * unit ≠ STOCK/FLOW
 * PRESENT + UNDECLARED_QUANTITY_KIND ≠ NO_QUANTITY_KIND_DECLARATION
 *
 * Architecture invariant (GROUND-170):
 * GROUND-155 declared potential contribution is a singleton authoritative
 * specification, not a multi-source evidence claim.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.js";

/**
 * Quantity kind of declared potential contribution — not execution / integration.
 * Distinct from GROUND-171 required_amount quantity_kind authority.
 */
export type AttentionObservationResourceDeclaredPotentialContributionQuantityKind =
  | "STOCK_QUANTITY"
  | "FLOW_QUANTITY"
  | "UNDECLARED_QUANTITY_KIND";

export interface AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput {
  physical_potential_contribution_declaration_key: string;
  quantity_kind: AttentionObservationResourceDeclaredPotentialContributionQuantityKind;
}

export interface AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification {
  declarations: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput[];
}

/**
 * Exactly two semantic runtime inputs — GROUND-155 + specification.
 */
export interface AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationEvalInput {
  physical_potential_contribution_declaration_set: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment;
  specification: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification;
}

/**
 * Stable quantity-kind semantic declaration for one exact GROUND-155 contribution.
 * Inherits evaluation_at through GROUND-155 target identity.
 * No raw relation / required-amount role / evidence polarity.
 */
export interface AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclaration {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  physical_potential_contribution_declaration_key: string;
  quantity_kind: AttentionObservationResourceDeclaredPotentialContributionQuantityKind;
}

/**
 * Upstream GROUND-155 absence ≠ contribution present without quantity-kind declaration.
 */
export type AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION"
  | "NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION"
  | "EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_PRESENT";

export type AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationModelLimitation =
  | "POTENTIAL_CONTRIBUTION_RANGE_SEMANTICS_NOT_FULLY_MODELED"
  | "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED"
  | "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED"
  | "TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED"
  | "FLOW_TIME_BASIS_NOT_MODELED"
  | "FLOW_INTEGRATION_WINDOW_NOT_MODELED"
  | "CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MATCH_NOT_EVALUATED"
  | "RESOURCE_DIVISIBILITY_NOT_MODELED"
  | "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED"
  | "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED"
  | "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED"
  | "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED"
  | "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED"
  | "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED"
  | "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED"
  | "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED"
  | "RESOURCE_FUNGIBILITY_NOT_MODELED"
  | "RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "CROSS_BINDING_QUANTITY_COMPOSITION_NOT_MODELED"
  | "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment {
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  physical_potential_contribution_declaration_binding_assessment: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment;
  physical_potential_contribution_declaration: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration | null;
  status: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationStatus;
  semantic_declaration: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclaration | null;
  has_explicit_potential_contribution_quantity_kind_semantic_declaration: boolean;
}

export interface AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment {
  candidate_key: string;
  physical_potential_contribution_declaration_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment;
  binding_quantity_kind_semantic_declaration_assessments: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment[];
  has_explicit_potential_contribution_quantity_kind_semantic_declarations: boolean;
  model_limitations: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationModelLimitation[];
}

export interface AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSetAssessment {
  physical_potential_contribution_declaration_set: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment;
  specification: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification;
  candidate_assessments: AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment[];
  has_explicit_potential_contribution_quantity_kind_semantic_declarations: boolean;
  model_limitations: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationModelLimitation[];
}
