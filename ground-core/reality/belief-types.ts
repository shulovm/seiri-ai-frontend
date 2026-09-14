/**
 * Reality Core v0.7 — Belief / Reconciliation derived types (GROUND-005).
 *
 * Derived only. Not persisted. Not ontic truth.
 * Belief != Truth. UNCONTESTED != TRUE.
 */

import type {
  Claim,
  ClaimPredicateKind,
  Evidence,
  EpistemicProvenance,
  RealityStateValue,
} from "../types.js";

export type BeliefStatus = "NO_CLAIMS" | "UNCONTESTED" | "CONTESTED";

/**
 * Descriptive confidence distribution — NOT fused belief certainty.
 * mean_confidence is descriptive arithmetic only; not epistemic fusion.
 */
export interface PositionConfidenceSummary {
  claim_confidences: number[];
  min_confidence: number;
  max_confidence: number;
  /** Descriptive average of claim_confidences. Not a Belief score. */
  mean_confidence: number;
}

/** Deterministic provenance fingerprint for visibility — not a trust score. */
export interface ProvenanceSummaryEntry {
  kind: EpistemicProvenance["kind"];
  entity_id: string | null;
  external_id: string | null;
  label: string | null;
}

/**
 * One semantic value position for a reconciliation scope.
 * Multiple Claims may share a position when values are semantically equal.
 */
export interface EpistemicPosition {
  value: RealityStateValue;
  /** Canonical key used for grouping (deterministic). */
  value_key: string;
  claim_ids: string[];
  claims: Claim[];
  supporting_evidence: Evidence[];
  contradicting_evidence: Evidence[];
  confidence_summary: PositionConfidenceSummary;
  provenance_summary: ProvenanceSummaryEntry[];
  /** True if any claim in this position has both SUPPORTS and CONTRADICTS. */
  has_evidence_tension: boolean;
}

export interface BeliefAssessment {
  subject_id: string;
  predicate_kind: ClaimPredicateKind;
  predicate: string;
  at: string;
  applicable_claims: Claim[];
  positions: EpistemicPosition[];
  status: BeliefStatus;
  /**
   * Sole position when UNCONTESTED; otherwise null.
   * Never a truth verdict. CONTESTED → always null.
   */
  leading_position: EpistemicPosition | null;
  unresolved_reasons: string[];
}

export interface BeliefQuery {
  subjectId: string;
  predicateKind: ClaimPredicateKind;
  predicate: string;
  at: string;
}

export interface ClaimDivergence {
  subject_id: string;
  predicate_kind: ClaimPredicateKind;
  predicate: string;
  at: string;
  positions: EpistemicPosition[];
}
