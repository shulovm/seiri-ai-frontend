/**
 * Reality Core v0.7 — Commitment Temporal Term derived types (GROUND-032).
 *
 * Read-only assessment types. Must not import state-engine / file-store / studio.
 * Temporal Term != Commitment / Acceptance / execution schedule /
 * Commitment.valid_until / Resource reservation / legal obligation /
 * effective deadline.
 *
 * No current / effective / binding / accepted deadline.
 * No deadline satisfaction verdict.
 */

import type { InterventionCommitmentContextAssessment } from "./commitment-types.js";
import type { DeclaredCommitmentAcceptanceAssessment } from "./commitment-acceptance-types.js";
import type {
  CommitmentTemporalTermKind,
  InterventionCommitmentDeclaration,
  InterventionCommitmentTemporalTermDeclaration,
  ReferenceDeclarer,
} from "../types.js";

export type CommitmentTemporalTermSourceRelation =
  | "DECLARED_BY_COMMITMENT_HOLDER"
  | "DECLARED_BY_OTHER_ENTITY"
  | "DECLARED_BY_NON_ENTITY_SOURCE";

export type CommitmentTemporalTermModelLimitation =
  | "TEMPORAL_TERM_ACCEPTANCE_NOT_MODELED"
  | "TEMPORAL_TERM_AUTHORITY_NOT_MODELED"
  | "EFFECTIVE_DEADLINE_NOT_MODELED"
  | "EXECUTION_START_NOT_MODELED"
  | "EXECUTION_COMPLETION_NOT_MODELED"
  | "DEADLINE_SATISFACTION_NOT_MODELED"
  | "TEMPORAL_TERM_CORRECTION_NOT_MODELED"
  | "TEMPORAL_TERM_SUPERSESSION_NOT_MODELED";

export interface CommitmentTemporalTermPosition {
  key: string;
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  term_kind: CommitmentTemporalTermKind;
  deadline_at: string;
  temporal_term_declaration_ids: string[];
  targeted_commitment_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

export interface CommitmentTemporalTermDivergence {
  key: string;
  commitment_semantic_key: string;
  term_kind: CommitmentTemporalTermKind;
  deadline_values: string[];
  temporal_term_position_keys: string[];
  temporal_term_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface DeclaredCommitmentTemporalTermsAssessment {
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  positions: CommitmentTemporalTermPosition[];
  divergences: CommitmentTemporalTermDivergence[];
  has_temporal_terms: boolean;
  has_start_by_terms: boolean;
  has_complete_by_terms: boolean;
  has_start_by_divergence: boolean;
  has_complete_by_divergence: boolean;
}

export interface CommitmentTemporalTermSourceRelationAssessment {
  temporal_term_declaration_id: string;
  source_relation: CommitmentTemporalTermSourceRelation;
}

export interface CommitmentTemporalTermContextAssessment {
  commitment: InterventionCommitmentDeclaration;
  commitment_context: InterventionCommitmentContextAssessment;
  acceptance: DeclaredCommitmentAcceptanceAssessment;
  temporal_terms: DeclaredCommitmentTemporalTermsAssessment;
  source_relations: CommitmentTemporalTermSourceRelationAssessment[];
  model_limitations: CommitmentTemporalTermModelLimitation[];
}

export interface CommitmentTemporalTermHistory {
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  declarations: InterventionCommitmentTemporalTermDeclaration[];
  positions: CommitmentTemporalTermPosition[];
  divergences: CommitmentTemporalTermDivergence[];
  has_declarations: boolean;
}
