/**
 * Reality Core v0.7 — Attention Observation Resource Required-Amount
 * Semantic Declaration types (GROUND-171).
 *
 * Derived only. Not persisted.
 *
 * GROUND-132 Observation Resource Requirement Set
 * + explicit Required Amount Semantics Specification
 * → Explicit Per-requirement Required Amount Semantic Declaration
 *
 * Declaration only. Does NOT interpret GROUND-157 raw contribution↔required_amount
 * relations. Does NOT emit SUPPORTING/CONTRADICTING / satisfaction / readiness.
 *
 * POINT ≠ EXACT role
 * RANGE ≠ TARGET / tolerance
 * unit ≠ STOCK/FLOW
 * explicit UNDECLARED_QUANTITY_KIND ≠ declaration absence
 *
 * Architecture invariant (GROUND-170):
 * GROUND-155 declared potential contribution is a singleton authoritative
 * specification, not a multi-source evidence claim.
 */

import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "./attention-observation-resource-requirement-types.js";

/**
 * Semantic role of required_amount — not polarity / satisfaction.
 */
export type AttentionObservationResourceRequiredAmountRole =
  | "MINIMUM_REQUIRED_AMOUNT"
  | "TARGET_REQUIRED_AMOUNT"
  | "EXACT_REQUIRED_AMOUNT";

/**
 * Quantity kind of required_amount — not execution / integration semantics.
 */
export type AttentionObservationResourceRequiredAmountQuantityKind =
  | "STOCK_QUANTITY"
  | "FLOW_QUANTITY"
  | "UNDECLARED_QUANTITY_KIND";

export interface AttentionObservationResourceRequiredAmountSemanticDeclarationInput {
  observation_resource_requirement_key: string;
  amount_role: AttentionObservationResourceRequiredAmountRole;
  quantity_kind: AttentionObservationResourceRequiredAmountQuantityKind;
}

export interface AttentionObservationResourceRequiredAmountSemanticDeclarationSpecification {
  declarations: AttentionObservationResourceRequiredAmountSemanticDeclarationInput[];
}

/**
 * Exactly two semantic runtime inputs — GROUND-132 + specification.
 */
export interface AttentionObservationResourceRequiredAmountSemanticDeclarationEvalInput {
  observation_resource_requirement_set: AttentionObservationResourceRequirementSetAssessment;
  specification: AttentionObservationResourceRequiredAmountSemanticDeclarationSpecification;
}

/**
 * Stable required-amount semantic declaration for one Observation Resource Requirement.
 * No evaluation_at / raw relation / contribution / evidence State.
 */
export interface AttentionObservationResourceRequiredAmountSemanticDeclaration {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  amount_role: AttentionObservationResourceRequiredAmountRole;
  quantity_kind: AttentionObservationResourceRequiredAmountQuantityKind;
}

/**
 * GROUND-132 always carries required_amount on each Requirement.
 * Only declaration presence/absence statuses are needed.
 */
export type AttentionObservationResourceRequiredAmountSemanticDeclarationStatus =
  | "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION"
  | "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT";

export type AttentionObservationResourceRequiredAmountSemanticDeclarationModelLimitation =
  | "REQUIRED_AMOUNT_RELATION_INTERPRETATION_POLICY_NOT_MODELED"
  | "REQUIRED_AMOUNT_RELATION_INTERPRETATION_BASIS_NOT_MODELED"
  | "CANONICAL_REQUIRED_AMOUNT_RELATION_EVIDENCE_STATE_NOT_MODELED"
  | "REQUIRED_AMOUNT_RANGE_ROLE_SEMANTICS_NOT_INTERPRETED"
  | "FLOW_TIME_BASIS_NOT_MODELED"
  | "FLOW_INTEGRATION_WINDOW_NOT_MODELED"
  | "RESOURCE_DIVISIBILITY_NOT_MODELED"
  | "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED"
  | "RESOURCE_UNIT_CONVERSION_NOT_MODELED"
  | "RESOURCE_SCOPE_SUBSUMPTION_NOT_MODELED"
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

export interface AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment {
  observation_resource_requirement_key: string;
  resource_requirement: AttentionObservationResourceRequirement;
  status: AttentionObservationResourceRequiredAmountSemanticDeclarationStatus;
  semantic_declaration: AttentionObservationResourceRequiredAmountSemanticDeclaration | null;
  has_explicit_required_amount_semantic_declaration: boolean;
}

export interface AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment {
  candidate_key: string;
  resource_requirement_set_assessment: AttentionCandidateObservationResourceRequirementSetAssessment;
  requirement_semantic_declaration_assessments: AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment[];
  has_explicit_required_amount_semantic_declarations: boolean;
  model_limitations: AttentionObservationResourceRequiredAmountSemanticDeclarationModelLimitation[];
}

export interface AttentionObservationResourceRequiredAmountSemanticDeclarationSetAssessment {
  observation_resource_requirement_set: AttentionObservationResourceRequirementSetAssessment;
  specification: AttentionObservationResourceRequiredAmountSemanticDeclarationSpecification;
  candidate_assessments: AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment[];
  has_explicit_required_amount_semantic_declarations: boolean;
  model_limitations: AttentionObservationResourceRequiredAmountSemanticDeclarationModelLimitation[];
}
