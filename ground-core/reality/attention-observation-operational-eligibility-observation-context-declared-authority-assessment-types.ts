/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Observation-Context Declared AUTHORITY Assessment types (GROUND-110).
 *
 * Derived only. Not persisted.
 *
 * GROUND-109 AUTHORITY Evaluation Instant Assessment
 * + ProjectState
 * + existing GROUND-019 assessDeclaredAuthority
 * → Observation-Context Declared AUTHORITY Assessment only.
 *
 * Declared Authority assessment ≠ canonical/effective Authority / OE / Satisfaction
 * Raw GROUND-019 vocabulary preserved without renaming
 * Multiple bindings ≠ aggregation / ANY / ALL / winner
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSetAssessment,
} from "./attention-observation-operational-eligibility-authority-evaluation-instant-types.js";
import type {
  DeclaredAuthorityAssessment,
  DeclaredAuthorityStatus,
} from "./governance-types.js";
import type { AuthorityPower, GovernanceScope, ProjectState } from "../types.js";

export interface AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: AuthorityPower;
  governance_scope: GovernanceScope;
  governance_scope_key: string;
  authority_evaluation_instant_key: string;
  authority_evaluation_at: string;
  declared_authority_status: DeclaredAuthorityStatus;
  declared_authority_assessment: DeclaredAuthorityAssessment;
}

export type AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  | "OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENTS_PRESENT";

export type AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_PROVENANCE_ASSESSMENT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment {
  candidate_key: string;
  authority_evaluation_instant_assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment;
  status: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentStatus;
  observation_context_declared_authority_assessments: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment[];
  has_observation_context_declared_authority_assessments: boolean;
  has_declared_authority_present_assessments: boolean;
  has_no_declared_authority_assessments: boolean;
  has_declarer_not_entity_assessments: boolean;
  model_limitations: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentEvalInput {
  project_state: ProjectState;
  authority_evaluation_instant_set: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSetAssessment;
}

export interface AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSetAssessment {
  authority_evaluation_instant_set: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment[];
  has_observation_context_declared_authority_assessments: boolean;
  has_declared_authority_present_assessments: boolean;
  has_no_declared_authority_assessments: boolean;
  has_declarer_not_entity_assessments: boolean;
  model_limitations: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentModelLimitation[];
}
