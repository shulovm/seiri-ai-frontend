/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Canonical Declared Potential Contribution Required-Amount
 * Compatibility Evidence State types (GROUND-175).
 *
 * Derived only. Not persisted.
 *
 * GROUND-174 Deterministic Required-Amount Compatibility Basis
 * → Canonical Required-Amount Compatibility Evidence State
 *
 * Normalization only. Sole runtime authority: GROUND-174.
 *
 * NOT_APPLICABLE ≠ UNRESOLVED
 * SUPPORTING ≠ Requirement satisfied / meets required amount
 * CONTRADICTING ≠ Requirement failed / does not meet
 * mismatch / TARGET / RANGE / FLOW unresolved ≠ CONTRADICTING
 * EXPLICITLY_DERIVED (not INTERPRETED) — polarity was role-derived, not Policy-mapped
 * canonical State ≠ Resource Ready / contribution verified
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-compatibility-basis-types.js";

/**
 * Exactly one semantic runtime input — GROUND-174 only.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateEvalInput {
  required_amount_compatibility_basis_set: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSetAssessment;
}

/**
 * Exactly twelve canonical required-amount compatibility evidence States.
 * Never SATISFIED / MEETS / VERIFIED / READY.
 */
export type AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue =
  | "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION"
  | "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION"
  | "UNRESOLVED_NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION"
  | "UNRESOLVED_CONTRIBUTION_QUANTITY_KIND_UNDECLARED"
  | "UNRESOLVED_REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED"
  | "UNRESOLVED_CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH"
  | "UNRESOLVED_CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED"
  | "UNRESOLVED_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED"
  | "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED"
  | "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED"
  | "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_SUPPORTING"
  | "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_CONTRADICTING";

export type AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateModelLimitation =
  | "TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED"
  | "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED"
  | "POTENTIAL_CONTRIBUTION_RANGE_SEMANTICS_NOT_FULLY_MODELED"
  | "FLOW_TIME_BASIS_NOT_MODELED"
  | "FLOW_INTEGRATION_WINDOW_NOT_MODELED"
  | "REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "RESOURCE_DIVISIBILITY_NOT_MODELED"
  | "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED"
  | "CAPACITY_REQUIRED_AMOUNT_EVIDENCE_COMPOSITION_NOT_MODELED"
  | "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED"
  | "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED"
  | "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED"
  | "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED"
  | "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED"
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

/**
 * Canonical required-amount compatibility evidence State.
 * One GROUND-174 Binding assessment → one State.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string | null;
  physical_potential_contribution_declaration_key: string | null;
  required_amount_compatibility_basis_key: string | null;
  unresolved_reasons: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[];
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateBindingAssessment {
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  required_amount_compatibility_basis_assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment;
  canonical_state: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState;
  canonical_state_value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue;
}

/**
 * Candidate-level assessment. Summary booleans are existence-only.
 * No Candidate verdict / Requirement satisfaction / Resource Readiness.
 */
export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment {
  candidate_key: string;
  required_amount_compatibility_basis_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisAssessment;
  binding_state_assessments: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateBindingAssessment[];
  has_applicable_required_amount_compatibility_evidence_states: boolean;
  has_resolved_required_amount_compatibility_evidence_states: boolean;
  has_supporting_required_amount_compatibility_evidence_states: boolean;
  has_contradicting_required_amount_compatibility_evidence_states: boolean;
  has_unresolved_required_amount_compatibility_evidence_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSetAssessment {
  required_amount_compatibility_basis_set: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment[];
  has_applicable_required_amount_compatibility_evidence_states: boolean;
  has_resolved_required_amount_compatibility_evidence_states: boolean;
  has_supporting_required_amount_compatibility_evidence_states: boolean;
  has_contradicting_required_amount_compatibility_evidence_states: boolean;
  has_unresolved_required_amount_compatibility_evidence_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateModelLimitation[];
}
