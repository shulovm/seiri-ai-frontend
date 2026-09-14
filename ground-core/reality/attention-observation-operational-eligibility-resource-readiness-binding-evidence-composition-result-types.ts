/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Result types (GROUND-148).
 *
 * Derived only. Not persisted.
 *
 * GROUND-147 Composition Readiness Basis Set
 * → neutral Binding Evidence Composition Result only.
 *
 * readiness HOLDS ≠ Composition Result HOLDS ≠ Resource Ready
 * readiness DOES_NOT_HOLD ≠ Composition Result DOES_NOT_HOLD ≠ Resource Not Ready
 * Result present ≠ Result HOLDS
 * Result absent ≠ Result DOES_NOT_HOLD
 * ANY ≠ physical alternatives
 * ALL ≠ cumulative physical supply
 * POSITIVE/NEGATIVE are narrow evidence operands only
 */

import type {
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue,
} from "./attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis-types.js";

/**
 * Exactly one semantic input — GROUND-147 only.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultEvalInput {
  resource_readiness_binding_evidence_composition_readiness_basis_set: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment;
}

/**
 * Exact neutral logical evidence-composition outcomes only.
 * Not RESOURCE_READY / RESOURCE_NOT_READY / SATISFIED / AVAILABLE / FEASIBLE.
 */
export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition =
  | "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
  | "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD";

/**
 * Exact Composition Result when readiness HOLDS.
 * Preserves GROUND-147 Basis / member Evidence State lineage.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResult {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  resource_readiness_binding_evidence_composition_policy_key: string;
  resource_readiness_binding_evidence_composition_readiness_policy_key: string;
  resource_readiness_binding_evidence_composition_readiness_basis_key: string;
  member_binding_keys: string[];
  composition_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind;
  member_evidence_state_keys: string[];
  member_evidence_state_values: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue[];
  composition_condition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition;
}

/**
 * Outer requirement status.
 * Logical HOLDS / DOES_NOT_HOLD live on the Result object when present.
 * readiness DOES_NOT_HOLD is outer — no synthetic Composition Result.
 */
export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
  | "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  | "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_RESULT_PRESENT";

export type AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultModelLimitation =
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED"
  | "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED"
  | "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED"
  | "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED"
  | "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED"
  | "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED"
  | "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED"
  | "RESOURCE_QUANTITY_CONTRIBUTION_NOT_MODELED"
  | "RESOURCE_FUNGIBILITY_NOT_MODELED"
  | "RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED"
  | "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED"
  | "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED"
  | "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment {
  observation_resource_requirement_key: string;
  composition_readiness_basis_assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultStatus;
  composition_result: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResult | null;
  composition_condition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition | null;
  has_resource_readiness_binding_evidence_composition_result: boolean;
}

/**
 * Candidate-level Composition Result assessment.
 * No Candidate-level logical verdict / aggregation.
 */
export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment {
  candidate_key: string;
  resource_readiness_binding_evidence_composition_readiness_basis_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisAssessment;
  requirement_composition_result_assessments: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment[];
  has_resource_readiness_binding_evidence_composition_results: boolean;
  has_resource_readiness_binding_evidence_composition_conditions_holding: boolean;
  has_resource_readiness_binding_evidence_composition_conditions_not_holding: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment {
  resource_readiness_binding_evidence_composition_readiness_basis_set: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment[];
  has_resource_readiness_binding_evidence_composition_results: boolean;
  has_resource_readiness_binding_evidence_composition_conditions_holding: boolean;
  has_resource_readiness_binding_evidence_composition_conditions_not_holding: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultModelLimitation[];
}
