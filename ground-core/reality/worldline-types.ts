/**
 * Reality Core v0.7 — Worldline read-model types (GROUND-003).
 *
 * Derived only. Not persisted. Not a second truth store.
 * Consumes canonical RealityEntity / RealityEvent / RealityState only.
 */

import type {
  RealityEntity,
  RealityEvent,
  RealityState,
} from "../types.js";

/** Temporal role of a worldline timeline entry. Distinct meanings — do not collapse. */
export type RealityWorldlineTemporalRole =
  | "EVENT_OCCURRED"
  | "STATE_BECAME_VALID"
  | "STATE_CEASED_VALID";

export type RealityWorldlineRecordType = "event" | "state";

/**
 * One point on the occurrence / validity timeline.
 * `time` is always a known ISO timestamp (never synthesized from recorded_at for events).
 */
export interface RealityWorldlineEntry {
  record_type: RealityWorldlineRecordType;
  record_id: string;
  time: string;
  temporal_role: RealityWorldlineTemporalRole;
  /** Stable reference to the source ontic record id (full records live on the Worldline). */
  source_record_id: string;
}

export interface RealityWorldlineTemporalSummary {
  earliest_time: string | null;
  latest_time: string | null;
  ordered_entry_count: number;
  unplaced_event_count: number;
  conflict_count: number;
  duplicate_overlap_count: number;
}

/**
 * Deterministic temporal view of one RealityEntity.
 * Read-only derived model — never written to ProjectState.
 */
export interface RealityWorldline {
  entity: RealityEntity;
  events: RealityEvent[];
  states: RealityState[];
  /** Temporally ordered known entries (excludes unplaced events). */
  ordered_entries: RealityWorldlineEntry[];
  /** RealityEvents with occurred_at === null — not placed on the occurrence timeline. */
  unplaced_events: RealityEvent[];
  temporal_summary: RealityWorldlineTemporalSummary;
}

/** Same-kind states active at a point in time — 0, 1, or many; no winner. */
export interface RealityStatesByKind {
  kind: string;
  states: RealityState[];
}

export type RealityStateConflictKind = "value_conflict" | "duplicate_overlap";

/**
 * Overlapping same-kind states for one subject.
 * value_conflict = distinct values; duplicate_overlap = identical values.
 * Never auto-resolved.
 */
export interface RealityStateConflict {
  conflict_kind: RealityStateConflictKind;
  subject_id: string;
  kind: string;
  state_ids: string[];
  states: RealityState[];
}
