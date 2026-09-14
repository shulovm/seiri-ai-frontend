/**
 * Reality Core v0.7 — Observation Need / Evidence Requirements (GROUND-008).
 *
 * Derived only. Not persisted.
 * ObservationNeed = what inspectable information would bear on a Question
 * ObservationNeed != ObservationRequest / observer / Attention / Action
 */

import type { EpistemicGapKind } from "./epistemic-gap-types.js";
import type { ClaimPredicateKind } from "../types.js";

export type ObservationNeedKind =
  | "OBSERVE_PROPOSITION"
  | "DISCRIMINATE_POSITIONS"
  | "OBTAIN_CLAIM_EVIDENCE"
  | "CLARIFY_EVIDENCE_TENSION"
  | "OBSERVE_TEMPORAL_GAP"
  | "IDENTIFY_SUBJECT";

export type EvidenceRequirementKind =
  | "BEARS_ON_PROPOSITION"
  | "BEARS_ON_CLAIM"
  | "DISTINGUISHES_POSITIONS"
  | "BEARS_ON_EVIDENCE_TENSION"
  | "ESTABLISHES_SUBJECT_IDENTITY";

/**
 * Temporal requirement for observation.
 * Do not invent bounds that are not known from Inquiry/Question.
 */
export type TemporalObservationScope =
  | { kind: "POINT"; at: string }
  | { kind: "INTERVAL"; from: string; until: string }
  | { kind: "UNSPECIFIED" };

export type ObservationTarget =
  | {
      kind: "PROPOSITION_TARGET";
      subject_id: string;
      predicate_kind: ClaimPredicateKind;
      predicate: string;
    }
  | {
      kind: "CLAIM_TARGET";
      claim_id: string;
    }
  | {
      kind: "EVIDENCE_TENSION_TARGET";
      claim_id: string;
      supporting_evidence_ids: string[];
      contradicting_evidence_ids: string[];
    }
  | {
      kind: "SUBJECT_IDENTITY_TARGET";
      claim_id: string;
    };

export type ObservationNeedSatisfactionKind =
  | "EPISTEMIC_RECORD_BEARS_ON_PROPOSITION"
  | "RESULT_MUST_BEAR_ON_POSITION_DISCRIMINATION"
  | "NEW_EVIDENCE_LINKED_TO_CLAIM"
  | "STRUCTURALLY_UNSPECIFIED";

export interface ObservationNeedSatisfaction {
  kind: ObservationNeedSatisfactionKind;
  note: string;
}

export interface EvidenceRequirement {
  kind: EvidenceRequirementKind;
  target: ObservationTarget;
  temporal_scope: TemporalObservationScope;
  must_be_inspectable: true;
  /**
   * Neutral relation intent — never "must support Claim".
   * bears_on = may support or contradict.
   */
  required_relation: "bears_on" | "distinguishes" | "identifies_subject";
  distinguishing_value_keys: string[];
}

/**
 * Informational observation requirement derived from InquiryQuestion.
 * Not a dispatch, observer choice, or priority score.
 */
export interface ObservationNeed {
  key: string;
  kind: ObservationNeedKind;
  question_keys: string[];
  subject_id: string | null;
  predicate_kind: ClaimPredicateKind | null;
  predicate: string | null;
  temporal_scope: TemporalObservationScope;
  target: ObservationTarget;
  evidence_requirements: EvidenceRequirement[];
  discriminates_between_value_keys: string[];
  originating_gap_kinds: EpistemicGapKind[];
  originating_claim_ids: string[];
  originating_evidence_ids: string[];
  prior_claim_ids: string[];
  later_claim_ids: string[];
  satisfaction_condition: ObservationNeedSatisfaction;
}
