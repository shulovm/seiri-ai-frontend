/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Raw Evidence Assessment types (GROUND-135).
 *
 * Derived only. Not persisted.
 *
 * GROUND-133 exact Requirement ↔ ResourceDeclaration bindings
 * + GROUND-134 exact RESOURCE_READINESS Evaluation Instant
 * + ProjectState resource-side declarations (read-only)
 * → Raw / Structural RESOURCE_READINESS Evidence Assessment only.
 *
 * Evidence layer — not interpretation, readiness verdict, or OE.
 */

import type {
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSetAssessment,
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-evaluation-instant-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type { AttentionObservationResourceRequirement } from "./attention-observation-resource-requirement-types.js";
import type { ResourceAssessment } from "./resource-types.js";
import type { ProjectState } from "../types.js";

export type AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus =
  | "BOUND_RESOURCE_DECLARATION_FOUND"
  | "BOUND_RESOURCE_DECLARATION_NOT_FOUND";

export type AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation =
  | "RESOURCE_KEY_EXACT_MATCH"
  | "RESOURCE_KEY_DOES_NOT_EXACT_MATCH";

export type AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation =
  | "RESOURCE_UNIT_EXACT_MATCH"
  | "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH";

export type AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation =
  | "RESOURCE_SCOPE_EXACT_MATCH"
  | "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH";

export type AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation =
  | "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT"
  | "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT";

export interface AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment {
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
  resource_declaration_lookup_status: AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus;
  requirement_temporal_relation: AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation;
  resource_key_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation | null;
  resource_unit_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation | null;
  resource_scope_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation | null;
  resource_assessment: ResourceAssessment | null;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessRequirementRawEvidenceAssessment {
  observation_resource_requirement_key: string;
  resource_requirement: AttentionObservationResourceRequirement;
  requirement_binding_assessment: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment;
  raw_binding_evidence_assessments: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment[];
  has_raw_resource_readiness_evidence_assessments: boolean;
}

export type AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  | "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
  | "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
  | "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT";

export type AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentModelLimitation =
  | "OBSERVATION_RESOURCE_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_QUANTITY_SUFFICIENCY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_BEYOND_EXACT_MATCH_NOT_MODELED"
  | "OBSERVATION_RESOURCE_SCOPE_SUBSUMPTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_MODELED_IN_RAW_READINESS_ASSESSMENT"
  | "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_MODELED_IN_RAW_READINESS_ASSESSMENT"
  | "OBSERVATION_RESOURCE_PARTIAL_FULFILLMENT_NOT_MODELED"
  | "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_NOT_MODELED"
  | "EXPLICIT_RESOURCE_READINESS_INTERPRETATION_POLICY_NOT_MODELED"
  | "RESOURCE_READINESS_INTERPRETATION_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment {
  candidate_key: string;
  resource_readiness_evaluation_instant_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment;
  status: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentStatus;
  requirement_raw_evidence_assessments: AttentionObservationOperationalEligibilityResourceReadinessRequirementRawEvidenceAssessment[];
  raw_binding_evidence_assessments: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment[];
  has_resource_readiness_raw_evidence_assessments: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentEvalInput {
  resource_readiness_observation_context_binding_set: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment;
  resource_readiness_evaluation_instant_set: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSetAssessment;
  project_state: ProjectState;
}

export interface AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet {
  resource_readiness_observation_context_binding_set: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment;
  resource_readiness_evaluation_instant_set: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment[];
  has_resource_readiness_raw_evidence_assessments: boolean;
  model_limitations: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentModelLimitation[];
}
