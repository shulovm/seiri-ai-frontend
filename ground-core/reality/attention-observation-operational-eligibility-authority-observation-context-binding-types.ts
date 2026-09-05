/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility AUTHORITY
 * Observation-Context Binding types (GROUND-108).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement Set
 * + ProjectState (authority-holder RealityEntity validation only)
 * + explicit AUTHORITY Observation-Context Binding Specification
 * → AUTHORITY Observation-Context Binding Foundation only.
 *
 * Binding ≠ Authority declaration / assessment / polarity / evaluation instant
 * Binding ≠ current/effective Authority / Permission / assignment / OE result
 * Binding ≠ Candidate==Authority holder
 * Multiple bindings ≠ conflict / ANY / ALL
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type { AuthorityPower, GovernanceScope, ProjectState } from "../types.js";

/**
 * Specification entry: exact observation Candidate ↔ Authority holder/power/scope.
 * Does NOT supply Requirement keys, declaration ids, evaluation `at`, or Authority verdict.
 */
export interface AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput {
  candidate_key: string;
  authority_holder_entity_id: string;
  authority_power: AuthorityPower;
  governance_scope: GovernanceScope;
}

export interface AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification {
  bindings: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput[];
}

/**
 * Combined evaluation input.
 * project_state is read-only authority-holder RealityEntity validation only —
 * not Authority declaration assessment input.
 */
export interface AttentionObservationOperationalEligibilityAuthorityObservationContextBindingEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  project_state: ProjectState;
  specification: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification;
}

/**
 * Runtime-only observation-context ↔ Authority-context relation.
 * No declaration ids / at / Authority polarity / contest / delegation.
 */
export interface AttentionObservationOperationalEligibilityAuthorityObservationContextBinding {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_holder_entity_id: string;
  authority_power: AuthorityPower;
  governance_scope: GovernanceScope;
  governance_scope_key: string;
}

export type AttentionObservationOperationalEligibilityAuthorityObservationContextBindingStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_PRESENT";

export type AttentionObservationOperationalEligibilityAuthorityObservationContextBindingModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DECLARED_ASSESSMENT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_PROVENANCE_ASSESSMENT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingStatus;
  authority_observation_context_bindings: AttentionObservationOperationalEligibilityAuthorityObservationContextBinding[];
  has_explicit_authority_observation_context_bindings: boolean;
  has_multiple_explicit_authority_observation_context_bindings: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment[];
  has_explicit_authority_observation_context_bindings: boolean;
  has_multiple_explicit_authority_observation_context_bindings: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingModelLimitation[];
}
