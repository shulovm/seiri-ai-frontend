/**
 * Reality Core v0.7 — Epistemic Gap / Unknown derived types (GROUND-006).
 *
 * Derived only. Not persisted.
 * Epistemic gap != Claim(value="unknown")
 * Unknown != low confidence
 * Absence detection is query-scoped — does not invent predicates.
 */

import type { BeliefAssessment, BeliefQuery } from "./belief-types.js";
import type { Claim, ClaimPredicateKind } from "../types.js";

export type EpistemicGapKind =
  | "NO_APPLICABLE_CLAIMS"
  | "CONTESTED_POSITIONS"
  | "NO_LINKED_EVIDENCE"
  | "EVIDENCE_TENSION"
  | "TEMPORAL_COVERAGE_GAP";

export interface EpistemicGapDetails {
  /** Position value_keys when CONTESTED_POSITIONS. */
  position_value_keys?: string[];
  /** Supporting evidence IDs for EVIDENCE_TENSION. */
  supporting_evidence_ids?: string[];
  /** Contradicting evidence IDs for EVIDENCE_TENSION. */
  contradicting_evidence_ids?: string[];
  /** Claim IDs whose intervals end at/before `at` (temporal coverage). */
  prior_claim_ids?: string[];
  /** Claim IDs whose intervals start after `at` (temporal coverage). */
  later_claim_ids?: string[];
  /** Human-readable structural note — never an inquiry/action request. */
  note?: string;
}

/**
 * One structural epistemic gap for an explicit query scope.
 * Not severity/priority. Not an investigation recommendation.
 */
export interface EpistemicGap {
  kind: EpistemicGapKind;
  subject_id: string;
  predicate_kind: ClaimPredicateKind;
  predicate: string;
  at: string;
  claim_ids: string[];
  evidence_ids: string[];
  details: EpistemicGapDetails;
}

export interface EpistemicGapAssessment {
  query: BeliefQuery;
  belief_assessment: BeliefAssessment;
  gaps: EpistemicGap[];
  has_gaps: boolean;
}

/** Claim with subject_id === null — unresolved identity, not attached to an Entity. */
export interface UnresolvedSubjectClaimView {
  claim: Claim;
  applicable_at_query: boolean | null;
}
