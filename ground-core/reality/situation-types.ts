/**
 * Reality Core v0.7 — Situation / Salience types (GROUND-009).
 *
 * Derived only. Not persisted.
 * Situation = bounded reasoning context
 * SalienceSignal ≠ priority / urgency / risk / Attention rank
 */

import type { BeliefAssessment } from "./belief-types.js";
import type {
  EpistemicGap,
  EpistemicGapAssessment,
  UnresolvedSubjectClaimView,
} from "./epistemic-gap-types.js";
import type { Inquiry } from "./inquiry-types.js";
import type { ObservationNeed } from "./observation-need-types.js";
import type {
  RealityEntity,
  RealityEvent,
  RealityState,
  Claim,
  ClaimPredicateKind,
} from "../types.js";
import type { RealityStateConflict } from "./worldline-types.js";

export type SalienceSignalKind =
  | "ONTIC_EVENT_PRESENT"
  | "STATE_CONFLICT"
  | "EPISTEMIC_CONTEST"
  | "EPISTEMIC_GAP"
  | "OPEN_INQUIRY"
  | "OBSERVATION_NEED"
  | "UNPLACED_EVENT";

/**
 * Structural salience only — not importance/urgency/priority.
 */
export interface SalienceSignal {
  kind: SalienceSignalKind;
  /** Deterministic key for ordering / identity within a Situation. */
  key: string;
  event_ids: string[];
  state_ids: string[];
  claim_ids: string[];
  gap_kinds: string[];
  inquiry_keys: string[];
  observation_need_keys: string[];
  note: string;
}

export interface PredicateScope {
  predicateKind: ClaimPredicateKind;
  predicate: string;
}

/**
 * Half-open event window [from, until).
 * If omitted, only Events with occurred_at === at are included (exact point).
 */
export interface SituationEventWindow {
  from: string;
  until: string;
}

export interface SituationQuery {
  subjectId: string;
  at: string;
  /** Explicit proposition scopes. If omitted, use scopes already present on Claims. */
  predicateScopes?: PredicateScope[];
  /** Optional event inclusion window. */
  eventWindow?: SituationEventWindow;
}

/**
 * QUIET: no unresolved salience signals
 * ACTIVE: ontic context present, no unresolved signals
 * UNRESOLVED: conflict / gap / inquiry / need / unplaced event signals present
 *
 * Does NOT mean resolved/closed/critical/escalated.
 */
export type SituationStatus = "QUIET" | "ACTIVE" | "UNRESOLVED";

export interface SituationOnticContext {
  active_states: RealityState[];
  events: RealityEvent[];
  unplaced_events: RealityEvent[];
  state_conflicts: RealityStateConflict[];
}

export interface SituationEpistemicContext {
  belief_assessments: BeliefAssessment[];
  gap_assessments: EpistemicGapAssessment[];
  gaps: EpistemicGap[];
  /** Claims involved in contested beliefs or gaps for this subject (not subject-identity unknowns). */
  unresolved_claims: Claim[];
  /** Subject-identity unresolved views — empty for Entity-scoped Situations. */
  unresolved_subject_claims: UnresolvedSubjectClaimView[];
}

export interface SituationInquiryContext {
  inquiries: Inquiry[];
  observation_needs: ObservationNeed[];
}

export interface Situation {
  key: string;
  subject_id: string;
  at: string;
  event_window: SituationEventWindow | null;
  predicate_scopes: PredicateScope[];
  entity: RealityEntity;
  ontic_context: SituationOnticContext;
  epistemic_context: SituationEpistemicContext;
  inquiry_context: SituationInquiryContext;
  salience_signals: SalienceSignal[];
  status: SituationStatus;
  has_salience: boolean;
  has_unresolved: boolean;
}
