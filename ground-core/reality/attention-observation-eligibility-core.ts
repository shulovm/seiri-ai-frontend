/**
 * Reality Core v0.7 — Attention Observation Eligibility (GROUND-046).
 *
 * Pure transformation of GROUND-040 Attention Candidate output.
 * Must not import state-engine / file-store / studio / ProjectState /
 * or GROUND-041 through GROUND-045 evaluation-branch modules.
 *
 * Observation eligibility ≠ selection / dispatch / authorization.
 * EPISTEMIC_GAP / OPEN_INQUIRY / Resource Finding ≠ Observation eligibility.
 * existing canonical ObservationNeed is the only positive basis.
 */

import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "./attention-candidate-types.js";
import type {
  AttentionCandidateObservationEligibilityAssessment,
  AttentionObservationEligibilityBasis,
  AttentionObservationEligibilityModelLimitation,
  AttentionObservationEligibilitySetAssessment,
} from "./attention-observation-eligibility-types.js";

export const ATTENTION_OBSERVATION_ELIGIBILITY_MODEL_LIMITATIONS: AttentionObservationEligibilityModelLimitation[] =
  [
    "OBSERVATION_SELECTION_NOT_MODELED",
    "OBSERVATION_PRIORITY_NOT_MODELED",
    "OBSERVATION_RANKING_NOT_MODELED",
    "OBSERVATION_VALUE_NOT_MODELED",
    "INFORMATION_GAIN_NOT_MODELED",
    "VALUE_OF_INFORMATION_NOT_MODELED",
    "OBSERVATION_COST_NOT_MODELED",
    "OBSERVATION_LATENCY_NOT_MODELED",
    "TEMPORAL_URGENCY_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVER_CAPABILITY_MATCHING_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EPISTEMIC_GAP_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "INQUIRY_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "RESOURCE_FINDING_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "GENERIC_WORLD_INFORMATION_TARGET_NOT_MODELED",
    "OBSERVATION_RESULT_INGESTION_NOT_MODELED",
    "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED",
    "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED",
    "ATTENTION_SELECTION_NOT_MODELED",
    "ATTENTION_ALLOCATION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function attentionObservationEligibilityBasisKey(
  candidateKey: string,
  observationNeedKey: string
): string {
  return [
    "attention-observation-eligibility-basis",
    candidateKey,
    observationNeedKey,
  ].join("|");
}

function noDirectBasis(
  candidate: AttentionCandidate
): AttentionCandidateObservationEligibilityAssessment {
  return {
    candidate_key: candidate.key,
    candidate,
    status: "NO_DIRECT_OBSERVATION_ELIGIBILITY_BASIS_REPRESENTED",
    eligibility_bases: [],
    has_direct_observation_eligibility_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_ELIGIBILITY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Extract canonical ObservationNeed keys from an OBSERVATION_NEED Candidate.
 * Uses Salience.observation_need_keys only — no subject/text/time matching.
 */
function extractCanonicalObservationNeedKeys(
  candidate: AttentionCandidate
): string[] {
  if (candidate.source_kind !== "BASE_SITUATION_SALIENCE") {
    return [];
  }
  if (candidate.basis.kind !== "BASE_SITUATION_SALIENCE") {
    return [];
  }
  if (candidate.basis.salience_signal_kind !== "OBSERVATION_NEED") {
    return [];
  }
  const keys = candidate.basis.salience_signal.observation_need_keys;
  // Deterministic unique sort — upstream normally supplies exactly one key.
  return [...new Set(keys)].sort(compareIds);
}

/**
 * Pure per-Candidate observation eligibility from GROUND-040 Candidate.
 * Only BASE_SITUATION_SALIENCE + OBSERVATION_NEED yields direct basis.
 */
export function assessAttentionCandidateObservationEligibility(
  candidate: AttentionCandidate
): AttentionCandidateObservationEligibilityAssessment {
  const observationNeedKeys = extractCanonicalObservationNeedKeys(candidate);

  if (
    candidate.source_kind !== "BASE_SITUATION_SALIENCE" ||
    candidate.basis.kind !== "BASE_SITUATION_SALIENCE" ||
    candidate.basis.salience_signal_kind !== "OBSERVATION_NEED" ||
    observationNeedKeys.length === 0
  ) {
    return noDirectBasis(candidate);
  }

  const basis = candidate.basis;

  const eligibility_bases: AttentionObservationEligibilityBasis[] =
    observationNeedKeys.map((observation_need_key) => ({
      key: attentionObservationEligibilityBasisKey(
        candidate.key,
        observation_need_key
      ),
      candidate_key: candidate.key,
      basis_kind: "EXISTING_CANONICAL_OBSERVATION_NEED",
      situation_subject_id: candidate.situation_subject_id,
      at: candidate.at,
      salience_signal_key: basis.salience_signal_key,
      observation_need_reference: { observation_need_key },
    }));

  return {
    candidate_key: candidate.key,
    candidate,
    status: "DIRECT_OBSERVATION_ELIGIBILITY_BASIS_PRESENT",
    eligibility_bases,
    has_direct_observation_eligibility_basis: true,
    model_limitations: [
      ...ATTENTION_OBSERVATION_ELIGIBILITY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level observation eligibility. Preserves GROUND-040 Candidate order.
 */
export function buildAttentionObservationEligibilitySet(
  candidateSet: AttentionCandidateSetAssessment
): AttentionObservationEligibilitySetAssessment {
  const candidate_eligibility = candidateSet.candidates.map((candidate) =>
    assessAttentionCandidateObservationEligibility(candidate)
  );

  return {
    candidate_set: candidateSet,
    candidate_eligibility,
    has_direct_observation_eligibility_basis: candidate_eligibility.some(
      (c) => c.has_direct_observation_eligibility_basis
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_ELIGIBILITY_MODEL_LIMITATIONS,
    ],
  };
}
