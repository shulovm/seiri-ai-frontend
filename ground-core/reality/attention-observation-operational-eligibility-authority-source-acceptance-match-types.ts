/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Acceptance Match types (GROUND-121).
 *
 * Derived only. Not persisted.
 *
 * GROUND-117 AUTHORITY Source Bridge
 * + GROUND-120 Explicit AUTHORITY Source Acceptance Criterion
 * → exact AUTHORITY Source Acceptance Match only.
 *
 * Independent from GROUND-118 coverage and GROUND-119 resolution.
 *
 * LISTED_AS_ACCEPTABLE ≠ ACCEPTED ≠ PASS ≠ dimension satisfied ≠ OE
 * NOT_LISTED_AS_ACCEPTABLE ≠ REJECTED ≠ FAIL ≠ ineligible
 * criterion absence ≠ NOT_LISTED
 * source absence ≠ NOT_LISTED
 * explicit empty criterion + source → NOT_LISTED (membership only)
 * acceptance match ≠ resolution ≠ coverage ≠ aggregation
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-acceptance-criteria-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-bridge-types.js";
import type { AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue } from "./attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type { AuthorityPower, GovernanceScope } from "../types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-117 + GROUND-120 — not 118 / 119 / 084-direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchInput {
  authority_source_bridge_set: AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment;
  authority_source_acceptance_criteria_set: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSetAssessment;
}

/**
 * Exact set-membership fact only.
 * Not ACCEPTED / REJECTED / PASS / FAIL.
 */
export type AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchValue =
  | "LISTED_AS_ACCEPTABLE"
  | "NOT_LISTED_AS_ACCEPTABLE";

/**
 * One exact 117 source × exact 120 criterion membership comparison.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch {
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
  authority_source_key: string;
  canonical_authority_state_key: string;
  canonical_authority_state_basis_key: string;
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
  authority_source_acceptance_criterion_key: string;
  match: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchValue;
}

export type AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  | "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT";

export type AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchModelLimitation =
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

/**
 * Candidate-level match assessment.
 * Booleans are existence summaries only — not aggregate acceptance verdicts.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment {
  candidate_key: string;
  authority_source_bridge_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment;
  authority_source_acceptance_criteria_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment;
  status: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchStatus;
  authority_source_acceptance_matches: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch[];
  has_authority_source_acceptance_matches: boolean;
  has_listed_as_acceptable_authority_sources: boolean;
  has_not_listed_as_acceptable_authority_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment {
  authority_source_bridge_set: AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment;
  authority_source_acceptance_criteria_set: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment[];
  has_authority_source_acceptance_matches: boolean;
  has_listed_as_acceptable_authority_sources: boolean;
  has_not_listed_as_acceptable_authority_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchModelLimitation[];
}
