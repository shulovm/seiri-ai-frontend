/**
 * Reality Core v0.7 — Inquiry / Question Formation types (GROUND-007).
 *
 * Derived only. Not persisted.
 * Question = what proposition needs an answer
 * Inquiry = knowledge objective grouping Questions + resolution conditions
 * Neither is an Action / ObservationRequest / Attention score.
 */

import type { BeliefQuery } from "./belief-types.js";
import type {
  EpistemicGap,
  EpistemicGapAssessment,
  EpistemicGapKind,
} from "./epistemic-gap-types.js";
import type { ClaimPredicateKind } from "../types.js";

export type InquiryQuestionKind =
  | "ESTABLISH_PROPOSITION"
  | "DISAMBIGUATE_POSITIONS"
  | "FIND_SUPPORTING_EVIDENCE"
  | "RESOLVE_EVIDENCE_TENSION"
  | "FILL_TEMPORAL_COVERAGE"
  | "RESOLVE_SUBJECT_IDENTITY";

export type ExpectedAnswerShape =
  | "proposition_value"
  | "position_choice_or_other"
  | "evidence_bearing_on_claim"
  | "tension_discrimination"
  | "temporal_proposition_value"
  | "subject_entity_identity";

/**
 * Structural resolution target — not "truth established".
 * STRUCTURALLY_UNSPECIFIED = no safe automatic condition yet.
 */
export type InquiryResolutionConditionKind =
  | "APPLICABLE_CLAIM_EXISTS"
  | "BELIEF_NOT_CONTESTED"
  | "CLAIM_HAS_EVIDENCE_LINK"
  | "EVIDENCE_TENSION_ABSENT"
  | "STRUCTURALLY_UNSPECIFIED";

export interface InquiryResolutionCondition {
  kind: InquiryResolutionConditionKind;
  /** Related claim IDs when applicable. */
  claim_ids: string[];
  note: string;
}

export interface InquiryQuestion {
  /** Deterministic semantic key — not a random UUID. */
  key: string;
  kind: InquiryQuestionKind;
  subject_id: string | null;
  predicate_kind: ClaimPredicateKind | null;
  predicate: string | null;
  at: string | null;
  originating_gap_kinds: EpistemicGapKind[];
  originating_claim_ids: string[];
  originating_evidence_ids: string[];
  /** Contested position value_keys when DISAMBIGUATE_POSITIONS. */
  candidate_value_keys: string[];
  expected_answer_shape: ExpectedAnswerShape;
  /** Temporal coverage context when present. */
  prior_claim_ids: string[];
  later_claim_ids: string[];
}

export type InquiryStatus = "OPEN";

export interface Inquiry {
  /** Deterministic semantic key. */
  key: string;
  status: InquiryStatus;
  subject_id: string | null;
  query: BeliefQuery | null;
  originating_gaps: EpistemicGap[];
  questions: InquiryQuestion[];
  resolution_conditions: InquiryResolutionCondition[];
  gap_assessment: EpistemicGapAssessment | null;
}
