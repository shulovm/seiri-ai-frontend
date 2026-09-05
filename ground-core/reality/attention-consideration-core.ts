/**
 * Reality Core v0.7 — Attention Consideration Basis (GROUND-041).
 *
 * Pure transformation of GROUND-040 AttentionCandidate output.
 * Must not import state-engine / file-store / studio /
 * resource-situation / resource-contention-discovery / impact / decision.
 *
 * Different Attention dimensions remain different.
 * No score / utility / priority / rank / weighted sum / comparison.
 */

import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "./attention-candidate-types.js";
import type { SalienceSignalKind } from "./situation-types.js";
import type {
  AttentionCandidateConsiderationAssessment,
  AttentionConsiderationBasisAtom,
  AttentionConsiderationBasisSetAssessment,
  AttentionConsiderationDimension,
  AttentionConsiderationDimensionAssessment,
  AttentionConsiderationModelLimitation,
  AttentionDimensionBasisStatus,
} from "./attention-consideration-types.js";

export const ATTENTION_CONSIDERATION_MODEL_LIMITATIONS: AttentionConsiderationModelLimitation[] =
  [
    "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED",
    "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED",
    "OBSERVATION_COST_NOT_MODELED",
    "INFORMATION_GAIN_NOT_MODELED",
    "VALUE_OF_INFORMATION_NOT_MODELED",
    "TEMPORAL_URGENCY_NOT_MODELED",
    "CROSS_DOMAIN_CANDIDATE_EQUIVALENCE_NOT_MODELED",
    "CROSS_DIMENSION_COMPARISON_NOT_MODELED",
    "CROSS_CANDIDATE_COMPARISON_NOT_MODELED",
    "ATTENTION_SCORING_NOT_MODELED",
    "ATTENTION_WEIGHTING_NOT_MODELED",
    "ATTENTION_RANKING_NOT_MODELED",
    "ATTENTION_PRIORITY_NOT_MODELED",
    "ATTENTION_SELECTION_NOT_MODELED",
    "ATTENTION_ALLOCATION_NOT_MODELED",
    "ATTENTION_BUDGET_NOT_MODELED",
    "AUTOMATIC_INQUIRY_BRIDGE_NOT_MODELED",
    "AUTOMATIC_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Fixed serialization order only — not value / priority ordering.
 */
export const ATTENTION_CONSIDERATION_DIMENSION_ORDER: AttentionConsiderationDimension[] =
  [
    "STRUCTURAL_ACTIVITY",
    "SITUATION_UNRESOLVEDNESS",
    "OBSERVATION_NEED",
    "RESOURCE_STRUCTURAL_DISCOVERY",
    "IMPACT",
    "REVERSIBILITY",
    "OBSERVATION_COST",
    "INFORMATION_GAIN",
    "TEMPORAL_URGENCY",
  ];

const UNRESOLVED_BASE_KINDS: ReadonlySet<SalienceSignalKind> = new Set([
  "STATE_CONFLICT",
  "UNPLACED_EVENT",
  "EPISTEMIC_CONTEST",
  "EPISTEMIC_GAP",
  "OPEN_INQUIRY",
  "OBSERVATION_NEED",
]);

export function attentionConsiderationBasisAtomKey(
  candidateKey: string,
  dimension: AttentionConsiderationDimension,
  sourceKey: string
): string {
  return ["attention-basis-atom", candidateKey, dimension, sourceKey].join("|");
}

function directDimensionsForCandidate(
  candidate: AttentionCandidate
): AttentionConsiderationDimension[] {
  if (candidate.basis.kind === "BASE_SITUATION_SALIENCE") {
    const kind = candidate.basis.salience_signal_kind;
    if (kind === "ONTIC_EVENT_PRESENT") {
      return ["STRUCTURAL_ACTIVITY"];
    }
    if (kind === "OBSERVATION_NEED") {
      return ["SITUATION_UNRESOLVEDNESS", "OBSERVATION_NEED"];
    }
    if (UNRESOLVED_BASE_KINDS.has(kind)) {
      return ["SITUATION_UNRESOLVEDNESS"];
    }
    return [];
  }
  // RESOURCE_SITUATION_SALIENCE — any Resource Finding kind
  return ["RESOURCE_STRUCTURAL_DISCOVERY"];
}

function sourceSemanticKind(candidate: AttentionCandidate): string {
  if (candidate.basis.kind === "BASE_SITUATION_SALIENCE") {
    return candidate.basis.salience_signal_kind;
  }
  return candidate.basis.resource_finding_kind;
}

function sourceKey(candidate: AttentionCandidate): string {
  if (candidate.basis.kind === "BASE_SITUATION_SALIENCE") {
    return candidate.basis.salience_signal_key;
  }
  return candidate.basis.resource_salience_signal_key;
}

function buildAtomsForDimension(
  candidate: AttentionCandidate,
  dimension: AttentionConsiderationDimension,
  directDimensions: AttentionConsiderationDimension[]
): AttentionConsiderationBasisAtom[] {
  if (!directDimensions.includes(dimension)) {
    return [];
  }
  const semantic = sourceSemanticKind(candidate);
  const srcKey = sourceKey(candidate);
  return [
    {
      key: attentionConsiderationBasisAtomKey(
        candidate.key,
        dimension,
        srcKey
      ),
      candidate_key: candidate.key,
      dimension,
      source_kind: candidate.source_kind,
      source_semantic_kind: semantic,
      source_key: srcKey,
    },
  ];
}

/**
 * Pure per-Candidate Consideration Basis decomposition.
 * Derives only from AttentionCandidate.basis — no project-state enrichment.
 */
export function assessAttentionCandidateConsideration(
  candidate: AttentionCandidate
): AttentionCandidateConsiderationAssessment {
  const directDimensions = directDimensionsForCandidate(candidate);
  const dimensions: AttentionConsiderationDimensionAssessment[] =
    ATTENTION_CONSIDERATION_DIMENSION_ORDER.map((dimension) => {
      const basis_atoms = buildAtomsForDimension(
        candidate,
        dimension,
        directDimensions
      );
      const status: AttentionDimensionBasisStatus =
        basis_atoms.length > 0
          ? "DIRECT_BASIS_PRESENT"
          : "NO_DIRECT_BASIS_REPRESENTED";
      return { dimension, status, basis_atoms };
    });

  const represented_dimensions = dimensions
    .filter((d) => d.status === "DIRECT_BASIS_PRESENT")
    .map((d) => d.dimension);
  const unrepresented_dimensions = dimensions
    .filter((d) => d.status === "NO_DIRECT_BASIS_REPRESENTED")
    .map((d) => d.dimension);

  return {
    candidate_key: candidate.key,
    candidate,
    dimensions,
    represented_dimensions,
    unrepresented_dimensions,
    model_limitations: [...ATTENTION_CONSIDERATION_MODEL_LIMITATIONS],
  };
}

/**
 * Pure set-level Consideration Basis assessment over GROUND-040 Candidate Set.
 * Preserves Candidate order. No cross-candidate comparison.
 */
export function buildAttentionConsiderationBasisSet(
  candidateSet: AttentionCandidateSetAssessment
): AttentionConsiderationBasisSetAssessment {
  const candidate_assessments = candidateSet.candidates.map((candidate) =>
    assessAttentionCandidateConsideration(candidate)
  );

  return {
    candidate_set: candidateSet,
    candidate_assessments,
    model_limitations: [...ATTENTION_CONSIDERATION_MODEL_LIMITATIONS],
  };
}
