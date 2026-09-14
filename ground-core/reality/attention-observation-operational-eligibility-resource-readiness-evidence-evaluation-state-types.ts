/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Evidence Evaluation State types (GROUND-137).
 *
 * Derived only. Not persisted.
 *
 * GROUND-135 Raw Binding Evidence Assessment
 * → per-binding RESOURCE_READINESS Evidence Evaluation State only.
 *
 * Structured evidence normalization ≠ canonical Resource Readiness polarity
 * FOUND/NOT_FOUND ≠ READY/NOT_READY
 * AVAILABLE_DECLARED ≠ positive readiness
 * CONTESTED_AVAILABILITY ≠ failure / unresolved process
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus,
  AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation,
} from "./attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.js";
import type {
  ResourceAvailabilityAssessmentStatus,
  ResourceCapacityAssessmentStatus,
  ResourceDeclarationAssessmentStatus,
} from "./resource-types.js";

/**
 * Canonical structured per-binding RESOURCE_READINESS evidence axes.
 * No flat Cartesian enum. No readiness polarity.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue {
  declaration_lookup_status: AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus;
  requirement_temporal_relation: AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation;
  resource_key_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation | null;
  resource_unit_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation | null;
  resource_scope_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation | null;
  resource_declaration_assessment_status: ResourceDeclarationAssessmentStatus | null;
  availability_assessment_status: ResourceAvailabilityAssessmentStatus | null;
  capacity_assessment_status: ResourceCapacityAssessmentStatus | null;
  has_multiple_capacity_declarations: boolean | null;
  has_capacity_divergence: boolean | null;
  has_temporal_basis_mismatch: boolean | null;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis {
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
  raw_binding_evidence_assessment_key: string;
  evaluation_state_value: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState {
  key: string;
  basis_key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "RESOURCE_READINESS";
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  raw_binding_evidence_assessment_key: string;
  evaluation_state: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue;
}

export type AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  | "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
  | "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
  | "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT";

export type AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateModelLimitation =
  | "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_BEYOND_EXACT_MATCH_NOT_MODELED"
  | "OBSERVATION_RESOURCE_SCOPE_SUBSUMPTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED"
  | "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED"
  | "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED"
  | "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_NOT_MODELED"
  | "RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_NOT_MODELED"
  | "PER_BINDING_CANONICAL_RESOURCE_READINESS_STATE_NOT_MODELED"
  | "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_NOT_MODELED"
  | "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment {
  candidate_key: string;
  resource_readiness_raw_evidence_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateStatus;
  evidence_evaluation_state_bases: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis[];
  evidence_evaluation_states: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState[];
  has_resource_readiness_evidence_evaluation_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateModelLimitation[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-135 only — not ProjectState / GROUND-132–134 / GROUND-022.
 */
export interface AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInput {
  resource_readiness_raw_evidence_assessment_set: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSetAssessment {
  resource_readiness_raw_evidence_assessment_set: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment[];
  has_resource_readiness_evidence_evaluation_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateModelLimitation[];
}
