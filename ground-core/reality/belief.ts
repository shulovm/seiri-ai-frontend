import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Belief & Reconciliation (GROUND-005).
 *
 * Pure derived read model over Claim / Evidence / ClaimEvidenceLink.
 * Must not import state-engine / file-store.
 * Must not promote Claims to RealityState.
 */

import { getEvidenceForClaim } from "./epistemic.js";
import { canonicalValueKey } from "./semantic-equality.js";
import type {
  Claim,
  ClaimPredicateKind,
  Evidence,
  EpistemicProvenance,
  ProjectState,
} from "../types.js";
import type {
  BeliefAssessment,
  BeliefQuery,
  BeliefStatus,
  ClaimDivergence,
  EpistemicPosition,
  PositionConfidenceSummary,
  ProvenanceSummaryEntry,
} from "./belief-types.js";

/**
 * Half-open applicability: [applicable_from, applicable_until)
 *
 * null applicable_from  → no lower bound
 * null applicable_until → open-ended (no upper bound)
 * both null             → always applicable
 *
 * Does NOT use recorded_at / created_at as substitutes.
 */
export function isClaimApplicableAt(claim: Claim, at: string): boolean {
  if (claim.applicable_from !== null && compareTemporalInstants(claim.applicable_from, at) > 0) {
    return false;
  }
  if (claim.applicable_until !== null && !(compareTemporalInstants(at, claim.applicable_until) < 0)) {
    return false;
  }
  return true;
}

function projectClaims(projectState: ProjectState): Claim[] {
  const projectId = projectState.project.id;
  return projectState.claims.filter((claim) => claim.project_id === projectId);
}

function compareClaims(a: Claim, b: Claim): number {
  if (compareTemporalInstants(a.recorded_at, b.recorded_at) !== 0) {
    return compareTemporalInstants(a.recorded_at, b.recorded_at) < 0 ? -1 : 1;
  }
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function compareEvidence(a: Evidence, b: Evidence): number {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function provenanceKey(p: EpistemicProvenance): string {
  return canonicalValueKey([p.kind, p.entity_id ?? "", p.external_id ?? "", p.label ?? ""]);
}

function toProvenanceSummary(p: EpistemicProvenance): ProvenanceSummaryEntry {
  return {
    kind: p.kind,
    entity_id: p.entity_id ?? null,
    external_id: p.external_id ?? null,
    label: p.label ?? null,
  };
}

function buildConfidenceSummary(claims: Claim[]): PositionConfidenceSummary {
  const claim_confidences = claims
    .map((claim) => claim.confidence)
    .slice()
    .sort((a, b) => a - b);
  const min_confidence = claim_confidences[0] ?? 0;
  const max_confidence = claim_confidences[claim_confidences.length - 1] ?? 0;
  const mean_confidence =
    claim_confidences.length === 0
      ? 0
      : claim_confidences.reduce((sum, value) => sum + value, 0) /
        claim_confidences.length;
  return {
    claim_confidences,
    min_confidence,
    max_confidence,
    mean_confidence,
  };
}

function uniqueEvidence(items: Evidence[]): Evidence[] {
  const seen = new Set<string>();
  const out: Evidence[] = [];
  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    out.push(item);
  }
  return out.sort(compareEvidence);
}

function uniqueProvenance(
  claims: Claim[]
): ProvenanceSummaryEntry[] {
  const map = new Map<string, ProvenanceSummaryEntry>();
  for (const claim of claims) {
    const key = provenanceKey(claim.provenance);
    if (!map.has(key)) {
      map.set(key, toProvenanceSummary(claim.provenance));
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([, entry]) => entry);
}

function buildPositions(
  projectState: ProjectState,
  claims: Claim[]
): EpistemicPosition[] {
  const groups = new Map<string, Claim[]>();

  for (const claim of claims) {
    const key = canonicalValueKey(claim.value);
    const group = groups.get(key) ?? [];
    group.push(claim);
    groups.set(key, group);
  }

  const positions: EpistemicPosition[] = [];

  for (const [value_key, group] of [...groups.entries()].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0
  )) {
    const orderedClaims = group.slice().sort(compareClaims);
    const supporting: Evidence[] = [];
    const contradicting: Evidence[] = [];
    let has_evidence_tension = false;

    for (const claim of orderedClaims) {
      const bundle = getEvidenceForClaim(projectState, claim.id);
      if (bundle.supports.length > 0 && bundle.contradicts.length > 0) {
        has_evidence_tension = true;
      }
      supporting.push(...bundle.supports);
      contradicting.push(...bundle.contradicts);
    }

    positions.push({
      value: orderedClaims[0]!.value,
      value_key,
      claim_ids: orderedClaims.map((claim) => claim.id),
      claims: orderedClaims,
      supporting_evidence: uniqueEvidence(supporting),
      contradicting_evidence: uniqueEvidence(contradicting),
      confidence_summary: buildConfidenceSummary(orderedClaims),
      provenance_summary: uniqueProvenance(orderedClaims),
      has_evidence_tension,
    });
  }

  return positions;
}

function statusFromPositions(positions: EpistemicPosition[]): BeliefStatus {
  if (positions.length === 0) {
    return "NO_CLAIMS";
  }
  if (positions.length === 1) {
    return "UNCONTESTED";
  }
  return "CONTESTED";
}

function unresolvedReasons(
  status: BeliefStatus,
  positions: EpistemicPosition[]
): string[] {
  const reasons: string[] = [];
  if (status === "NO_CLAIMS") {
    reasons.push("no_applicable_claims");
  }
  if (status === "CONTESTED") {
    reasons.push("divergent_positions");
  }
  if (positions.some((position) => position.has_evidence_tension)) {
    reasons.push("evidence_tension");
  }
  // UNCONTESTED is agreement among Claims — not verification / ontic acceptance
  if (status === "UNCONTESTED") {
    reasons.push("uncontested_is_not_truth");
  }
  return reasons;
}

/**
 * Assess epistemic belief for one subject + predicate + time.
 * Pure / derived. Does not mutate ProjectState or ontic Reality.
 *
 * UNCONTESTED means all applicable Claims share one semantic value.
 * It does NOT mean true / verified / ontic Reality.
 */
export function assessBeliefAt(
  projectState: ProjectState,
  query: BeliefQuery
): BeliefAssessment {
  const applicable_claims = projectClaims(projectState)
    .filter(
      (claim) =>
        claim.subject_id === query.subjectId &&
        claim.predicate_kind === query.predicateKind &&
        claim.predicate === query.predicate &&
        isClaimApplicableAt(claim, query.at)
    )
    .slice()
    .sort(compareClaims);

  const positions = buildPositions(projectState, applicable_claims);
  const status = statusFromPositions(positions);
  const leading_position =
    status === "UNCONTESTED" ? positions[0] ?? null : null;

  return {
    subject_id: query.subjectId,
    predicate_kind: query.predicateKind,
    predicate: query.predicate,
    at: query.at,
    applicable_claims,
    positions,
    status,
    leading_position,
    unresolved_reasons: unresolvedReasons(status, positions),
  };
}

/**
 * Assess every distinct (predicate_kind, predicate) present on Claims
 * for a known Entity subject at time `at`.
 * Claims with subject_id === null are excluded.
 */
export function getBeliefAssessmentsForSubject(
  projectState: ProjectState,
  subjectId: string,
  at: string
): BeliefAssessment[] {
  const scopes = new Map<string, { kind: ClaimPredicateKind; predicate: string }>();

  for (const claim of projectClaims(projectState)) {
    if (claim.subject_id !== subjectId) {
      continue;
    }
    const key = `${claim.predicate_kind}\u0000${claim.predicate}`;
    if (!scopes.has(key)) {
      scopes.set(key, {
        kind: claim.predicate_kind,
        predicate: claim.predicate,
      });
    }
  }

  return [...scopes.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([, scope]) =>
      assessBeliefAt(projectState, {
        subjectId,
        predicateKind: scope.kind,
        predicate: scope.predicate,
        at,
      })
    );
}

/**
 * Detect divergent (CONTESTED) positions for a reconciliation scope.
 * Returns null when not contested.
 */
export function detectClaimDivergence(
  projectState: ProjectState,
  query: BeliefQuery
): ClaimDivergence | null {
  const assessment = assessBeliefAt(projectState, query);
  if (assessment.status !== "CONTESTED") {
    return null;
  }
  return {
    subject_id: assessment.subject_id,
    predicate_kind: assessment.predicate_kind,
    predicate: assessment.predicate,
    at: assessment.at,
    positions: assessment.positions,
  };
}
