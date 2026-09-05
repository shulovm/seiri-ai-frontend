/**
 * Reality Core v0.7 — Attention Candidate composition (GROUND-040).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 *
 * Salience → Attention Candidate only.
 * Candidate ≠ selection / allocation / ranking / score / urgency / Action.
 * Consumes GROUND-039 composeResourceAwareSituation only (one Situation path).
 * Does not recalculate Resource contention / Capacity / Discovery.
 */

import { composeResourceAwareSituation } from "./resource-situation.js";
import type { ResourceAwareSituationQuery } from "./resource-situation-types.js";
import type {
  AttentionCandidate,
  AttentionCandidateModelLimitation,
  AttentionCandidateSetAssessment,
  AttentionCandidateSetStatus,
  AttentionCandidateSourceKind,
} from "./attention-candidate-types.js";
import type { ResourceContentionFindingKind } from "./resource-contention-discovery-types.js";
import type { SalienceSignalKind } from "./situation-types.js";
import type { ProjectState } from "../types.js";

export const ATTENTION_CANDIDATE_MODEL_LIMITATIONS: AttentionCandidateModelLimitation[] =
  [
    "ATTENTION_PRIORITY_NOT_MODELED",
    "ATTENTION_RANKING_NOT_MODELED",
    "ATTENTION_WEIGHTING_NOT_MODELED",
    "ATTENTION_SEVERITY_NOT_MODELED",
    "ATTENTION_URGENCY_NOT_MODELED",
    "ATTENTION_SELECTION_NOT_MODELED",
    "ATTENTION_ALLOCATION_NOT_MODELED",
    "ATTENTION_BUDGET_NOT_MODELED",
    "ATTENTION_SCHEDULING_NOT_MODELED",
    "VALUE_OF_INFORMATION_NOT_MODELED",
    "OBSERVATION_COST_NOT_MODELED",
    "CROSS_DOMAIN_ATTENTION_EQUIVALENCE_NOT_MODELED",
    "AUTOMATIC_UNKNOWN_BRIDGE_NOT_MODELED",
    "AUTOMATIC_INQUIRY_BRIDGE_NOT_MODELED",
    "AUTOMATIC_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "AUTOMATIC_DECISION_BRIDGE_NOT_MODELED",
    "AUTOMATIC_INTERVENTION_BRIDGE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Serialization source order only — not domain precedence / priority.
 */
export const ATTENTION_CANDIDATE_SOURCE_KIND_ORDER: AttentionCandidateSourceKind[] =
  ["BASE_SITUATION_SALIENCE", "RESOURCE_SITUATION_SALIENCE"];

/** Matches GROUND-009 Situation Salience serialization order — not ranking. */
const BASE_SALIENCE_KIND_ORDER: Record<SalienceSignalKind, number> = {
  ONTIC_EVENT_PRESENT: 0,
  STATE_CONFLICT: 1,
  UNPLACED_EVENT: 2,
  EPISTEMIC_CONTEST: 3,
  EPISTEMIC_GAP: 4,
  OPEN_INQUIRY: 5,
  OBSERVATION_NEED: 6,
};

/**
 * Mirrors GROUND-038 Finding kind serialization order — not ranking.
 * Kept local so Attention depends on Resource Situation, not Discovery runtime.
 */
const RESOURCE_FINDING_KIND_ORDER: Record<
  ResourceContentionFindingKind,
  number
> = {
  RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY: 0,
  RESOURCE_RESERVATION_OVERLAP_PRESENT: 1,
  RESOURCE_CAPACITY_BASIS_MISSING: 2,
  RESOURCE_CAPACITY_RELATION_DIVERGENCE: 3,
  RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS: 4,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function attentionCandidateKeyFromBaseSalience(
  subjectId: string,
  at: string,
  salienceSignalKey: string
): string {
  return [
    "attention-candidate",
    "base-situation-salience",
    subjectId,
    at,
    salienceSignalKey,
  ].join("|");
}

export function attentionCandidateKeyFromResourceSalience(
  subjectId: string,
  at: string,
  resourceSalienceSignalKey: string
): string {
  return [
    "attention-candidate",
    "resource-situation-salience",
    subjectId,
    at,
    resourceSalienceSignalKey,
  ].join("|");
}

function compareCandidates(a: AttentionCandidate, b: AttentionCandidate): number {
  const sourceDiff =
    ATTENTION_CANDIDATE_SOURCE_KIND_ORDER.indexOf(a.source_kind) -
    ATTENTION_CANDIDATE_SOURCE_KIND_ORDER.indexOf(b.source_kind);
  if (sourceDiff !== 0) {
    return sourceDiff;
  }

  if (a.source_kind === "BASE_SITUATION_SALIENCE") {
    if (a.basis.kind !== "BASE_SITUATION_SALIENCE" || b.basis.kind !== "BASE_SITUATION_SALIENCE") {
      return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    }
    const kindDiff =
      BASE_SALIENCE_KIND_ORDER[a.basis.salience_signal_kind] -
      BASE_SALIENCE_KIND_ORDER[b.basis.salience_signal_kind];
    if (kindDiff !== 0) {
      return kindDiff;
    }
    return a.basis.salience_signal_key < b.basis.salience_signal_key
      ? -1
      : a.basis.salience_signal_key > b.basis.salience_signal_key
        ? 1
        : 0;
  }

  if (
    a.basis.kind !== "RESOURCE_SITUATION_SALIENCE" ||
    b.basis.kind !== "RESOURCE_SITUATION_SALIENCE"
  ) {
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  }
  if (a.basis.resource_declaration_id !== b.basis.resource_declaration_id) {
    return compareIds(
      a.basis.resource_declaration_id,
      b.basis.resource_declaration_id
    );
  }
  const findingDiff =
    RESOURCE_FINDING_KIND_ORDER[a.basis.resource_finding_kind] -
    RESOURCE_FINDING_KIND_ORDER[b.basis.resource_finding_kind];
  if (findingDiff !== 0) {
    return findingDiff;
  }
  return a.basis.resource_salience_signal_key <
    b.basis.resource_salience_signal_key
    ? -1
    : a.basis.resource_salience_signal_key >
        b.basis.resource_salience_signal_key
      ? 1
      : 0;
}

/**
 * Build Attention Candidate Set from Resource-aware Situation Salience surfaces.
 * Not an Attention Plan. Ordering != ranking.
 */
export function buildAttentionCandidateSet(
  projectState: ProjectState,
  query: ResourceAwareSituationQuery
): AttentionCandidateSetAssessment {
  const situation = composeResourceAwareSituation(projectState, query);
  const subjectId = situation.base_situation.subject_id;
  const at = situation.base_situation.at;

  const baseCandidates: AttentionCandidate[] =
    situation.base_situation.salience_signals.map((signal) => ({
      key: attentionCandidateKeyFromBaseSalience(subjectId, at, signal.key),
      source_kind: "BASE_SITUATION_SALIENCE" as const,
      situation_subject_id: subjectId,
      at,
      basis: {
        kind: "BASE_SITUATION_SALIENCE" as const,
        situation_subject_id: subjectId,
        situation_at: at,
        salience_signal_key: signal.key,
        salience_signal_kind: signal.kind,
        salience_signal: signal,
      },
    }));

  const resourceCandidates: AttentionCandidate[] =
    situation.resource_salience_signals.map((signal) => ({
      key: attentionCandidateKeyFromResourceSalience(subjectId, at, signal.key),
      source_kind: "RESOURCE_SITUATION_SALIENCE" as const,
      situation_subject_id: subjectId,
      at,
      basis: {
        kind: "RESOURCE_SITUATION_SALIENCE" as const,
        situation_subject_id: subjectId,
        situation_at: at,
        resource_declaration_id: signal.resource_declaration_id,
        resource_salience_signal_key: signal.key,
        resource_finding_key: signal.resource_finding_key,
        resource_finding_kind: signal.resource_finding_kind,
        resource_salience_signal: signal,
      },
    }));

  const candidates = [...baseCandidates, ...resourceCandidates].sort(
    compareCandidates
  );

  const base_situation_candidate_count = baseCandidates.length;
  const resource_candidate_count = resourceCandidates.length;
  const candidate_count = candidates.length;
  const has_candidates = candidate_count > 0;
  const status: AttentionCandidateSetStatus = has_candidates
    ? "ATTENTION_CANDIDATES_PRESENT"
    : "NO_ATTENTION_CANDIDATES";

  return {
    query: {
      situation_query: query.situation_query,
      resource_declaration_ids: [...situation.resource_declaration_ids],
    },
    situation,
    candidates,
    status,
    candidate_count,
    base_situation_candidate_count,
    resource_candidate_count,
    has_candidates,
    model_limitations: [...ATTENTION_CANDIDATE_MODEL_LIMITATIONS],
  };
}
