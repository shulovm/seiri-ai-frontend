/**
 * Reality Core v0.7 — Epistemic Gap / Unknown detection (GROUND-006).
 *
 * Pure derived read model over BeliefAssessment + Evidence links.
 * Must not import state-engine / file-store.
 * Does not invent Inquiry / Observation requests.
 * Does not invent missing predicate dimensions.
 */

import {
  assessBeliefAt,
  getBeliefAssessmentsForSubject,
  isClaimApplicableAt,
} from "./belief.js";
import { getEvidenceForClaim } from "./epistemic.js";
import type { BeliefQuery } from "./belief-types.js";
import type {
  EpistemicGap,
  EpistemicGapAssessment,
  EpistemicGapKind,
  UnresolvedSubjectClaimView,
} from "./epistemic-gap-types.js";
import type { Claim, ProjectState } from "../types.js";

const GAP_KIND_ORDER: Record<EpistemicGapKind, number> = {
  NO_APPLICABLE_CLAIMS: 0,
  CONTESTED_POSITIONS: 1,
  NO_LINKED_EVIDENCE: 2,
  EVIDENCE_TENSION: 3,
  TEMPORAL_COVERAGE_GAP: 4,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function compareGaps(a: EpistemicGap, b: EpistemicGap): number {
  const kindDiff = GAP_KIND_ORDER[a.kind] - GAP_KIND_ORDER[b.kind];
  if (kindDiff !== 0) {
    return kindDiff;
  }
  if (a.predicate_kind !== b.predicate_kind) {
    return a.predicate_kind < b.predicate_kind ? -1 : 1;
  }
  if (a.predicate !== b.predicate) {
    return a.predicate < b.predicate ? -1 : 1;
  }
  const aClaims = a.claim_ids.join(",");
  const bClaims = b.claim_ids.join(",");
  if (aClaims !== bClaims) {
    return aClaims < bClaims ? -1 : 1;
  }
  const aEvidence = a.evidence_ids.join(",");
  const bEvidence = b.evidence_ids.join(",");
  return aEvidence < bEvidence ? -1 : aEvidence > bEvidence ? 1 : 0;
}

function projectClaims(projectState: ProjectState): Claim[] {
  const projectId = projectState.project.id;
  return projectState.claims.filter((claim) => claim.project_id === projectId);
}

function scopeClaims(
  projectState: ProjectState,
  query: BeliefQuery
): Claim[] {
  return projectClaims(projectState).filter(
    (claim) =>
      claim.subject_id === query.subjectId &&
      claim.predicate_kind === query.predicateKind &&
      claim.predicate === query.predicate
  );
}

/**
 * Claims for this scope whose interval is entirely before `at`
 * (applicable_until !== null && !(at < applicable_until) i.e. applicable_until <= at).
 */
function priorClaims(claims: Claim[], at: string): Claim[] {
  return claims.filter(
    (claim) =>
      claim.applicable_until !== null && !(at < claim.applicable_until)
  );
}

/**
 * Claims for this scope that start after `at`
 * (applicable_from !== null && applicable_from > at).
 */
function laterClaims(claims: Claim[], at: string): Claim[] {
  return claims.filter(
    (claim) => claim.applicable_from !== null && claim.applicable_from > at
  );
}

function buildGaps(
  projectState: ProjectState,
  query: BeliefQuery
): { assessment: EpistemicGapAssessment } {
  const belief = assessBeliefAt(projectState, query);
  const gaps: EpistemicGap[] = [];
  const allScopeClaims = scopeClaims(projectState, query);

  if (belief.status === "NO_CLAIMS") {
    gaps.push({
      kind: "NO_APPLICABLE_CLAIMS",
      subject_id: query.subjectId,
      predicate_kind: query.predicateKind,
      predicate: query.predicate,
      at: query.at,
      claim_ids: [],
      evidence_ids: [],
      details: {
        note: "No persisted Claim currently applies to this explicit proposition scope at this query time. Not a Reality absence; not Claim(value=\"unknown\").",
      },
    });

    const prior = priorClaims(allScopeClaims, query.at);
    const later = laterClaims(allScopeClaims, query.at);
    if (prior.length > 0 && later.length > 0) {
      gaps.push({
        kind: "TEMPORAL_COVERAGE_GAP",
        subject_id: query.subjectId,
        predicate_kind: query.predicateKind,
        predicate: query.predicate,
        at: query.at,
        claim_ids: sortUniqueIds([
          ...prior.map((c) => c.id),
          ...later.map((c) => c.id),
        ]),
        evidence_ids: [],
        details: {
          prior_claim_ids: sortUniqueIds(prior.map((c) => c.id)),
          later_claim_ids: sortUniqueIds(later.map((c) => c.id)),
          note: "Claims exist for this scope before and after the query time, but none apply at the query time. No interpolated value.",
        },
      });
    }
  }

  if (belief.status === "CONTESTED") {
    gaps.push({
      kind: "CONTESTED_POSITIONS",
      subject_id: query.subjectId,
      predicate_kind: query.predicateKind,
      predicate: query.predicate,
      at: query.at,
      claim_ids: sortUniqueIds(belief.applicable_claims.map((c) => c.id)),
      evidence_ids: sortUniqueIds(
        belief.positions.flatMap((p) => [
          ...p.supporting_evidence.map((e) => e.id),
          ...p.contradicting_evidence.map((e) => e.id),
        ])
      ),
      details: {
        position_value_keys: belief.positions.map((p) => p.value_key),
        note: "Multiple semantically divergent positions apply. No automatic winner; not evidence-count voting.",
      },
    });
  }

  for (const claim of belief.applicable_claims) {
    const bundle = getEvidenceForClaim(projectState, claim.id);
    if (bundle.links.length === 0) {
      gaps.push({
        kind: "NO_LINKED_EVIDENCE",
        subject_id: query.subjectId,
        predicate_kind: query.predicateKind,
        predicate: query.predicate,
        at: query.at,
        claim_ids: [claim.id],
        evidence_ids: [],
        details: {
          note: "No canonical Evidence is linked to this Claim. Does not mean the Claim is false.",
        },
      });
    }
    if (bundle.supports.length > 0 && bundle.contradicts.length > 0) {
      gaps.push({
        kind: "EVIDENCE_TENSION",
        subject_id: query.subjectId,
        predicate_kind: query.predicateKind,
        predicate: query.predicate,
        at: query.at,
        claim_ids: [claim.id],
        evidence_ids: sortUniqueIds([
          ...bundle.supports.map((e) => e.id),
          ...bundle.contradicts.map((e) => e.id),
        ]),
        details: {
          supporting_evidence_ids: sortUniqueIds(
            bundle.supports.map((e) => e.id)
          ),
          contradicting_evidence_ids: sortUniqueIds(
            bundle.contradicts.map((e) => e.id)
          ),
          note: "Claim has both SUPPORTS and CONTRADICTS Evidence. Confidence is not rewritten.",
        },
      });
    }
  }

  gaps.sort(compareGaps);

  return {
    assessment: {
      query,
      belief_assessment: belief,
      gaps,
      has_gaps: gaps.length > 0,
    },
  };
}

/**
 * Assess structural epistemic gaps for an explicit proposition query.
 * Absence (NO_APPLICABLE_CLAIMS) is query-scoped — does not invent predicates.
 */
export function assessEpistemicGapsAt(
  projectState: ProjectState,
  query: BeliefQuery
): EpistemicGapAssessment {
  return buildGaps(projectState, query).assessment;
}

/**
 * Gap assessments for every (predicate_kind, predicate) that already exists
 * on Claims for this Entity. Does not invent absent predicates.
 */
export function getEpistemicGapsForSubject(
  projectState: ProjectState,
  subjectId: string,
  at: string
): EpistemicGapAssessment[] {
  return getBeliefAssessmentsForSubject(projectState, subjectId, at).map(
    (belief) =>
      assessEpistemicGapsAt(projectState, {
        subjectId: belief.subject_id,
        predicateKind: belief.predicate_kind,
        predicate: belief.predicate,
        at: belief.at,
      })
  );
}

/**
 * Claims with subject_id === null.
 * Visibility only — no identity resolution / Entity attachment.
 */
export function getUnresolvedSubjectClaims(
  projectState: ProjectState,
  at?: string
): UnresolvedSubjectClaimView[] {
  const claims = projectClaims(projectState)
    .filter((claim) => claim.subject_id === null)
    .slice()
    .sort((a, b) => {
      if (a.recorded_at !== b.recorded_at) {
        return a.recorded_at < b.recorded_at ? -1 : 1;
      }
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });

  return claims.map((claim) => ({
    claim,
    applicable_at_query:
      at === undefined ? null : isClaimApplicableAt(claim, at),
  }));
}
