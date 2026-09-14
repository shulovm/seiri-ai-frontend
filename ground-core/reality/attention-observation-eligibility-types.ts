/**
 * Reality Core v0.7 — Attention Observation Eligibility types (GROUND-046).
 *
 * Derived only. Not persisted.
 *
 * Canonical ObservationNeed Salience → Observation Eligibility Basis only.
 * Observation eligibility ≠ selection / dispatch / authorization.
 * EPISTEMIC_GAP / OPEN_INQUIRY / Resource Finding ≠ Observation eligibility.
 * Independent from GROUND-041–045 evaluation branch.
 */

import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "./attention-candidate-types.js";

/**
 * Basis-relative observation eligibility status.
 * Not ELIGIBLE / INELIGIBLE / APPROVED / DENIED.
 */
export type AttentionObservationEligibilityStatus =
  | "DIRECT_OBSERVATION_ELIGIBILITY_BASIS_PRESENT"
  | "NO_DIRECT_OBSERVATION_ELIGIBILITY_BASIS_REPRESENTED";

/**
 * Only existing canonical ObservationNeed qualifies in GROUND-046.
 */
export type AttentionObservationEligibilityBasisKind =
  | "EXISTING_CANONICAL_OBSERVATION_NEED";

/**
 * Canonical ObservationNeed identity reference.
 * Uses ObservationNeed.key from GROUND-008 / Salience.observation_need_keys.
 */
export interface AttentionObservationNeedReference {
  observation_need_key: string;
}

/**
 * Direct represented eligibility basis for future observation consideration.
 * Not selection / dispatch / observer assignment.
 */
export interface AttentionObservationEligibilityBasis {
  key: string;
  candidate_key: string;
  basis_kind: AttentionObservationEligibilityBasisKind;
  situation_subject_id: string;
  at: string;
  salience_signal_key: string;
  observation_need_reference: AttentionObservationNeedReference;
}

export type AttentionObservationEligibilityModelLimitation =
  | "OBSERVATION_SELECTION_NOT_MODELED"
  | "OBSERVATION_PRIORITY_NOT_MODELED"
  | "OBSERVATION_RANKING_NOT_MODELED"
  | "OBSERVATION_VALUE_NOT_MODELED"
  | "INFORMATION_GAIN_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "OBSERVATION_COST_NOT_MODELED"
  | "OBSERVATION_LATENCY_NOT_MODELED"
  | "TEMPORAL_URGENCY_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVER_CAPABILITY_MATCHING_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EPISTEMIC_GAP_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "INQUIRY_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "RESOURCE_FINDING_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "GENERIC_WORLD_INFORMATION_TARGET_NOT_MODELED"
  | "OBSERVATION_RESULT_INGESTION_NOT_MODELED"
  | "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED"
  | "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED"
  | "ATTENTION_SELECTION_NOT_MODELED"
  | "ATTENTION_ALLOCATION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-Candidate observation eligibility.
 * has_direct_observation_eligibility_basis is descriptive only.
 */
export interface AttentionCandidateObservationEligibilityAssessment {
  candidate_key: string;
  candidate: AttentionCandidate;
  status: AttentionObservationEligibilityStatus;
  eligibility_bases: AttentionObservationEligibilityBasis[];
  has_direct_observation_eligibility_basis: boolean;
  model_limitations: AttentionObservationEligibilityModelLimitation[];
}

/**
 * Set-level observation eligibility.
 * No eligible_candidates / observation_queue / selected list.
 */
export interface AttentionObservationEligibilitySetAssessment {
  candidate_set: AttentionCandidateSetAssessment;
  candidate_eligibility: AttentionCandidateObservationEligibilityAssessment[];
  has_direct_observation_eligibility_basis: boolean;
  model_limitations: AttentionObservationEligibilityModelLimitation[];
}
