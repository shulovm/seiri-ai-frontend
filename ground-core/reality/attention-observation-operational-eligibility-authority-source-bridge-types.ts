/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Bridge types (GROUND-117).
 *
 * Derived only. Not persisted.
 *
 * GROUND-116 Canonical Observation-Context AUTHORITY State
 * → Operational Eligibility AUTHORITY Source Bridge only.
 *
 * SOURCE_PRESENT = canonical Authority State record exists
 * SOURCE_PRESENT ≠ positive Authority
 * negative/unresolved canonical States remain bridgeable sources
 * source ≠ acceptance ≠ resolution ≠ Satisfaction ≠ Operational Eligibility
 */

import type {
  AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateSetAssessment,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue,
} from "./attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type { AuthorityPower, GovernanceScope } from "../types.js";

export type AttentionObservationOperationalEligibilityAuthoritySourcePresence =
  "SOURCE_PRESENT";

export interface AttentionObservationOperationalEligibilityAuthoritySource {
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
  canonical_authority_state_key: string;
  canonical_authority_state_basis_key: string;
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
  source_presence: "SOURCE_PRESENT";
}

export type AttentionObservationOperationalEligibilityAuthoritySourceBridgeCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  | "AUTHORITY_SOURCES_PRESENT";

export type AttentionObservationOperationalEligibilityAuthoritySourceBridgeModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "LEGAL_AUTHORITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment {
  candidate_key: string;
  canonical_authority_state_assessment: AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment;
  status: AttentionObservationOperationalEligibilityAuthoritySourceBridgeCandidateStatus;
  authority_sources: AttentionObservationOperationalEligibilityAuthoritySource[];
  has_authority_sources: boolean;
  has_positive_canonical_authority_state_sources: boolean;
  has_negative_canonical_authority_state_sources: boolean;
  has_unresolved_canonical_authority_state_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceBridgeModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceBridgeEvalInput {
  canonical_authority_state_set: AttentionObservationOperationalEligibilityCanonicalAuthorityStateSetAssessment;
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment {
  canonical_authority_state_set: AttentionObservationOperationalEligibilityCanonicalAuthorityStateSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment[];
  has_authority_sources: boolean;
  has_positive_canonical_authority_state_sources: boolean;
  has_negative_canonical_authority_state_sources: boolean;
  has_unresolved_canonical_authority_state_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceBridgeModelLimitation[];
}
