/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Resolution Classification types (GROUND-119).
 *
 * Derived only. Not persisted.
 *
 * GROUND-117 Operational Eligibility AUTHORITY Source Bridge
 * → AUTHORITY Source Resolution Classification only.
 *
 * Independent from GROUND-084 requirement and GROUND-118 coverage.
 *
 * RESOLVED ≠ accepted ≠ Authority positive
 * EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE is RESOLVED
 * UNRESOLVED ≠ rejected ≠ source absent ≠ NOT_REPRESENTED
 * two unresolved reasons remain distinct
 * resolution ≠ acceptance ≠ aggregation ≠ OE outcome
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-bridge-types.js";
import type { AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue } from "./attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type { AuthorityPower, GovernanceScope } from "../types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-117 only — not 084 / 118 / 116-direct / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationInput {
  authority_source_bridge_set: AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment;
}

/**
 * Intrinsic resolvedness of an exact AUTHORITY raw source.
 * Not PASS / FAIL / ACCEPTED / REJECTED / positive / negative.
 */
export type AttentionObservationOperationalEligibilityAuthoritySourceResolution =
  | "RESOLVED"
  | "UNRESOLVED";

/**
 * Exact unresolved reason corresponding to GROUND-116 unresolved canonical States.
 * Do not collapse into generic UNKNOWN.
 */
export type AttentionObservationOperationalEligibilityAuthoritySourceUnresolvedReason =
  | "NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY"
  | "NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE";

/**
 * Candidate-level classification status.
 * Classifications exist only when GROUND-117 exposes exact source records.
 */
export type AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  | "AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATIONS_PRESENT";

/**
 * Exact classification annotation over one GROUND-117 AUTHORITY source.
 * Retains raw canonical Authority State + source/State/Basis/binding lineage.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassification {
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
  resolution: AttentionObservationOperationalEligibilityAuthoritySourceResolution;
  unresolved_reason: AttentionObservationOperationalEligibilityAuthoritySourceUnresolvedReason | null;
}

export type AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationModelLimitation =
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

/**
 * Candidate-level resolution classification assessment.
 * Booleans are existence summaries only — not aggregate Authority verdicts.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassificationAssessment {
  candidate_key: string;
  authority_source_bridge_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment;
  status: AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationStatus;
  authority_source_resolution_classifications: AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassification[];
  has_authority_source_resolution_classifications: boolean;
  has_resolved_authority_sources: boolean;
  has_unresolved_authority_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSetAssessment {
  authority_source_bridge_set: AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassificationAssessment[];
  has_authority_source_resolution_classifications: boolean;
  has_resolved_authority_sources: boolean;
  has_unresolved_authority_sources: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationModelLimitation[];
}
