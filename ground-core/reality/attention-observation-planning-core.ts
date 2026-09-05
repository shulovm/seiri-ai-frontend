/**
 * Reality Core v0.7 — Attention Observation Planning Basis (GROUND-047).
 *
 * Pure transformation of GROUND-046 Eligibility + explicit ObservationNeed collection.
 * Must not import state-engine / file-store / studio / ProjectState /
 * or GROUND-041 through GROUND-045 evaluation-branch modules.
 *
 * ObservationNeed ≠ executable Observation specification
 * Planning Basis ≠ Observation Plan
 * exact ObservationNeed.key join only — no similarity matching
 */

import type { ObservationNeed } from "./observation-need-types.js";
import type {
  AttentionCandidateObservationEligibilityAssessment,
  AttentionObservationEligibilityBasis,
} from "./attention-observation-eligibility-types.js";
import type {
  AttentionCandidateObservationPlanningAssessment,
  AttentionObservationEvidenceRequirementBasis,
  AttentionObservationInquiryContextBasis,
  AttentionObservationPlanningBasis,
  AttentionObservationPlanningInput,
  AttentionObservationPlanningModelLimitation,
  AttentionObservationPlanningSetAssessment,
  AttentionObservationTargetBasis,
} from "./attention-observation-planning-types.js";

export const ATTENTION_OBSERVATION_PLANNING_MODEL_LIMITATIONS: AttentionObservationPlanningModelLimitation[] =
  [
    "OBSERVATION_PLAN_NOT_MODELED",
    "OBSERVATION_METHOD_NOT_MODELED",
    "OBSERVER_CANDIDATES_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVER_CAPABILITY_MATCHING_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "OBSERVATION_PRIORITY_NOT_MODELED",
    "OBSERVATION_RANKING_NOT_MODELED",
    "OBSERVATION_VALUE_NOT_MODELED",
    "INFORMATION_GAIN_NOT_MODELED",
    "VALUE_OF_INFORMATION_NOT_MODELED",
    "OBSERVATION_COST_NOT_MODELED",
    "OBSERVATION_LATENCY_NOT_MODELED",
    "TEMPORAL_URGENCY_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "OBSERVATION_RESULT_INGESTION_NOT_MODELED",
    "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED",
    "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED",
    "GENERIC_WORLD_INFORMATION_TARGET_NOT_MODELED",
    "OBSERVATION_NEED_LIFECYCLE_NOT_MODELED",
    "ATTENTION_SELECTION_NOT_MODELED",
    "ATTENTION_ALLOCATION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function attentionObservationPlanningBasisKey(
  candidateKey: string,
  observationNeedKey: string
): string {
  return [
    "attention-observation-planning-basis",
    candidateKey,
    observationNeedKey,
  ].join("|");
}

/**
 * Builds exact-key lookup index. Rejects duplicate or empty ObservationNeed keys.
 */
export function normalizeObservationNeedCollection(
  observationNeeds: ObservationNeed[]
): ReadonlyMap<string, ObservationNeed> {
  const byKey = new Map<string, ObservationNeed>();

  for (const need of observationNeeds) {
    if (!need.key || need.key.trim().length === 0) {
      throw new Error("ObservationNeed key must be non-empty");
    }
    if (byKey.has(need.key)) {
      throw new Error(`Duplicate ObservationNeed key ${need.key}`);
    }
    byKey.set(need.key, need);
  }

  return byKey;
}

function resolveObservationNeed(
  observationNeedKey: string,
  observationNeedByKey: ReadonlyMap<string, ObservationNeed>
): ObservationNeed {
  const need = observationNeedByKey.get(observationNeedKey);
  if (!need) {
    throw new Error(
      `ObservationNeed ${observationNeedKey} not found for observation eligibility basis`
    );
  }
  return need;
}

function buildTargetBasis(need: ObservationNeed): AttentionObservationTargetBasis {
  return {
    observation_need_key: need.key,
    target: need.target,
  };
}

function buildEvidenceRequirementBasis(
  need: ObservationNeed
): AttentionObservationEvidenceRequirementBasis {
  return {
    observation_need_key: need.key,
    evidence_requirements: need.evidence_requirements,
  };
}

function buildInquiryContextBasis(
  need: ObservationNeed
): AttentionObservationInquiryContextBasis {
  return {
    observation_need_key: need.key,
    question_keys: [...need.question_keys],
  };
}

function buildPlanningBasis(
  candidateKey: string,
  eligibilityBasis: AttentionObservationEligibilityBasis,
  need: ObservationNeed
): AttentionObservationPlanningBasis {
  return {
    key: attentionObservationPlanningBasisKey(candidateKey, need.key),
    candidate_key: candidateKey,
    basis_kind: "CANONICAL_OBSERVATION_NEED_STRUCTURE",
    observation_eligibility_basis_key: eligibilityBasis.key,
    observation_need_key: need.key,
    observation_need: need,
    target_basis: buildTargetBasis(need),
    evidence_requirement_basis: buildEvidenceRequirementBasis(need),
    inquiry_context_basis: buildInquiryContextBasis(need),
  };
}

function noPlanningBasis(
  eligibility: AttentionCandidateObservationEligibilityAssessment
): AttentionCandidateObservationPlanningAssessment {
  return {
    candidate_key: eligibility.candidate_key,
    eligibility,
    status: "NO_OBSERVATION_PLANNING_BASIS",
    planning_basis: null,
    model_limitations: [...ATTENTION_OBSERVATION_PLANNING_MODEL_LIMITATIONS],
  };
}

/**
 * Pure per-Candidate planning basis from GROUND-046 eligibility + exact-key lookup.
 */
export function assessAttentionCandidateObservationPlanning(
  eligibility: AttentionCandidateObservationEligibilityAssessment,
  observationNeedByKey: ReadonlyMap<string, ObservationNeed>
): AttentionCandidateObservationPlanningAssessment {
  if (
    eligibility.status !== "DIRECT_OBSERVATION_ELIGIBILITY_BASIS_PRESENT" ||
    !eligibility.has_direct_observation_eligibility_basis
  ) {
    return noPlanningBasis(eligibility);
  }

  if (eligibility.eligibility_bases.length !== 1) {
    throw new Error(
      `Multiple observation eligibility bases for candidate ${eligibility.candidate_key}`
    );
  }

  const eligibilityBasis = eligibility.eligibility_bases[0];
  const observationNeedKey =
    eligibilityBasis.observation_need_reference.observation_need_key;
  const need = resolveObservationNeed(observationNeedKey, observationNeedByKey);

  return {
    candidate_key: eligibility.candidate_key,
    eligibility,
    status: "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT",
    planning_basis: buildPlanningBasis(
      eligibility.candidate_key,
      eligibilityBasis,
      need
    ),
    model_limitations: [...ATTENTION_OBSERVATION_PLANNING_MODEL_LIMITATIONS],
  };
}

/**
 * Pure set-level planning basis. Preserves GROUND-046 Candidate order.
 */
export function buildAttentionObservationPlanningSet(
  input: AttentionObservationPlanningInput
): AttentionObservationPlanningSetAssessment {
  const observationNeedByKey = normalizeObservationNeedCollection(
    input.observation_needs
  );

  const candidate_planning = input.eligibility_set.candidate_eligibility.map(
    (eligibility) =>
      assessAttentionCandidateObservationPlanning(
        eligibility,
        observationNeedByKey
      )
  );

  return {
    eligibility_set: input.eligibility_set,
    candidate_planning,
    has_observation_planning_basis: candidate_planning.some(
      (c) => c.status === "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT"
    ),
    model_limitations: [...ATTENTION_OBSERVATION_PLANNING_MODEL_LIMITATIONS],
  };
}
