/**
 * Reality Core v0.7 — Structural Finding / Discovery types (GROUND-010).
 *
 * Derived only. Not persisted.
 * StructuralFinding ≠ Problem / Risk / Need / Blocker / Opportunity.
 * Finding status is structural presence only — not a lifecycle.
 */

import type { ClaimPredicateKind } from "../types.js";
import type { RealityStateConflictKind } from "./worldline-types.js";

export type StructuralFindingKind =
  | "ONTIC_STATE_CONFLICT"
  | "EPISTEMIC_POSITION_CONFLICT"
  | "KNOWLEDGE_GAP"
  | "EVIDENCE_DEFICIT"
  | "EVIDENCE_TENSION"
  | "TEMPORAL_KNOWLEDGE_GAP"
  | "UNRESOLVED_SUBJECT"
  | "UNPLACED_EVENT"
  | "OBSERVATION_NEED_PRESENT";

/**
 * Derived-only status. Absence of a Finding means it no longer derives —
 * not RESOLVED / CLOSED / MITIGATED.
 */
export type StructuralFindingStatus = "OPEN";

export interface StructuralFindingDetails {
  conflict_kind?: RealityStateConflictKind;
  state_kind?: string;
  position_value_keys?: string[];
  supporting_evidence_ids?: string[];
  contradicting_evidence_ids?: string[];
  prior_claim_ids?: string[];
  later_claim_ids?: string[];
  note?: string;
}

/**
 * One structurally identifiable unresolved/noteworthy condition inside a Situation
 * (or project-level unresolved-subject discovery).
 *
 * Not severity. Not priority. Not a Problem verdict.
 */
export interface StructuralFinding {
  key: string;
  kind: StructuralFindingKind;
  subject_id: string | null;
  situation_key: string | null;
  predicate_kind: ClaimPredicateKind | null;
  predicate: string | null;
  at: string | null;
  source_signal_kinds: string[];
  source_gap_kinds: string[];
  state_ids: string[];
  event_ids: string[];
  claim_ids: string[];
  evidence_ids: string[];
  inquiry_keys: string[];
  observation_need_keys: string[];
  details: StructuralFindingDetails;
  status: StructuralFindingStatus;
}

export interface DiscoveryAssessment {
  situation_key: string;
  subject_id: string;
  at: string;
  findings: StructuralFinding[];
  has_findings: boolean;
  finding_kinds: StructuralFindingKind[];
}
