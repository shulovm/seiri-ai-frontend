/**
 * Reality Core v0.7 — Attention Candidate types (GROUND-040).
 *
 * Derived only. Not persisted.
 *
 * Salience → Attention Candidate only.
 * Candidate ≠ selected / allocated / ranked / scored / urgent / Action.
 * Array order is serialization/determinism only — not ranking.
 */

import type { SalienceSignal, SalienceSignalKind } from "./situation-types.js";
import type { ResourceAwareSituationQuery } from "./resource-situation-types.js";
import type { ResourceAwareSituationAssessment } from "./resource-situation-types.js";
import type { ResourceSituationSalienceSignal } from "./resource-situation-types.js";
import type { ResourceContentionFindingKind } from "./resource-contention-discovery-types.js";

/**
 * Candidate source family.
 * Order BASE then RESOURCE is serialization only — not precedence.
 */
export type AttentionCandidateSourceKind =
  | "BASE_SITUATION_SALIENCE"
  | "RESOURCE_SITUATION_SALIENCE";

export type AttentionCandidateBasis =
  | {
      kind: "BASE_SITUATION_SALIENCE";
      situation_subject_id: string;
      situation_at: string;
      salience_signal_key: string;
      salience_signal_kind: SalienceSignalKind;
      salience_signal: SalienceSignal;
    }
  | {
      kind: "RESOURCE_SITUATION_SALIENCE";
      situation_subject_id: string;
      situation_at: string;
      resource_declaration_id: string;
      resource_salience_signal_key: string;
      resource_finding_key: string;
      resource_finding_kind: ResourceContentionFindingKind;
      resource_salience_signal: ResourceSituationSalienceSignal;
    };

/**
 * Structurally represented Salience item eligible for future Attention reasoning.
 * Not allocated, selected, ranked, scored, or dispatched.
 */
export interface AttentionCandidate {
  key: string;
  source_kind: AttentionCandidateSourceKind;
  situation_subject_id: string;
  at: string;
  basis: AttentionCandidateBasis;
}

/**
 * Weak descriptive Candidate Set status.
 * NO_ATTENTION_CANDIDATES ≠ healthy/safe/complete.
 * ATTENTION_CANDIDATES_PRESENT ≠ required / allocated / urgent.
 */
export type AttentionCandidateSetStatus =
  | "NO_ATTENTION_CANDIDATES"
  | "ATTENTION_CANDIDATES_PRESENT";

export type AttentionCandidateModelLimitation =
  | "ATTENTION_PRIORITY_NOT_MODELED"
  | "ATTENTION_RANKING_NOT_MODELED"
  | "ATTENTION_WEIGHTING_NOT_MODELED"
  | "ATTENTION_SEVERITY_NOT_MODELED"
  | "ATTENTION_URGENCY_NOT_MODELED"
  | "ATTENTION_SELECTION_NOT_MODELED"
  | "ATTENTION_ALLOCATION_NOT_MODELED"
  | "ATTENTION_BUDGET_NOT_MODELED"
  | "ATTENTION_SCHEDULING_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "OBSERVATION_COST_NOT_MODELED"
  | "CROSS_DOMAIN_ATTENTION_EQUIVALENCE_NOT_MODELED"
  | "AUTOMATIC_UNKNOWN_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_INQUIRY_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_DECISION_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_INTERVENTION_BRIDGE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Attention Candidate Set — not an Attention Plan.
 * candidate_count is descriptive inspection only — not pressure/severity/priority.
 */
export interface AttentionCandidateSetAssessment {
  query: ResourceAwareSituationQuery;
  situation: ResourceAwareSituationAssessment;
  candidates: AttentionCandidate[];
  status: AttentionCandidateSetStatus;
  candidate_count: number;
  base_situation_candidate_count: number;
  resource_candidate_count: number;
  has_candidates: boolean;
  model_limitations: AttentionCandidateModelLimitation[];
}
