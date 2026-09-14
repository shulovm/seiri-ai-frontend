/**
 * Reality Core v0.7 — Commitment Conditional Term derived types (GROUND-033).
 *
 * Read-only assessment types. Must not import state-engine / file-store / studio.
 * Conditional Term != Requirement / Temporal Term / condition truth /
 * effective Commitment applicability / Acceptance of attached terms.
 *
 * No AND/OR/NOT composition. No current / effective condition set.
 */

import type { InterventionCommitmentContextAssessment } from "./commitment-types.js";
import type { DeclaredCommitmentAcceptanceAssessment } from "./commitment-acceptance-types.js";
import type { DeclaredCommitmentTemporalTermsAssessment } from "./commitment-temporal-term-types.js";
import type {
  CommitmentConditionRole,
  InterventionCommitmentConditionalTermDeclaration,
  InterventionCommitmentDeclaration,
  ReferenceDeclarer,
} from "../types.js";

export type CommitmentConditionalTermSourceRelation =
  | "DECLARED_BY_COMMITMENT_HOLDER"
  | "DECLARED_BY_OTHER_ENTITY"
  | "DECLARED_BY_NON_ENTITY_SOURCE";

export type CommitmentConditionalTermModelLimitation =
  | "CONDITIONAL_TERM_ACCEPTANCE_NOT_MODELED"
  | "CONDITIONAL_TERM_AUTHORITY_NOT_MODELED"
  | "CONDITION_SEMANTIC_BINDING_NOT_MODELED"
  | "CONDITION_TRUTH_EVALUATION_NOT_MODELED"
  | "CONDITION_LOGICAL_COMPOSITION_NOT_MODELED"
  | "EFFECTIVE_COMMITMENT_APPLICABILITY_NOT_MODELED"
  | "CONDITIONAL_TERM_CORRECTION_NOT_MODELED"
  | "CONDITIONAL_TERM_SUPERSESSION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface CommitmentConditionalTermPosition {
  key: string;
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  condition_key: string;
  condition_role: CommitmentConditionRole;
  conditional_term_declaration_ids: string[];
  targeted_commitment_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  descriptions: string[];
  has_multiple_declarations: boolean;
}

export interface CommitmentConditionRoleDivergence {
  key: string;
  commitment_semantic_key: string;
  condition_key: string;
  condition_roles: CommitmentConditionRole[];
  conditional_term_position_keys: string[];
  conditional_term_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface DeclaredCommitmentConditionalTermsAssessment {
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  positions: CommitmentConditionalTermPosition[];
  role_divergences: CommitmentConditionRoleDivergence[];
  has_conditional_terms: boolean;
  has_activation_conditions: boolean;
  has_exception_conditions: boolean;
  has_role_divergence: boolean;
}

export interface CommitmentConditionalTermSourceRelationAssessment {
  conditional_term_declaration_id: string;
  source_relation: CommitmentConditionalTermSourceRelation;
}

export interface CommitmentConditionalTermContextAssessment {
  commitment: InterventionCommitmentDeclaration;
  commitment_context: InterventionCommitmentContextAssessment;
  acceptance: DeclaredCommitmentAcceptanceAssessment;
  temporal_terms: DeclaredCommitmentTemporalTermsAssessment;
  conditional_terms: DeclaredCommitmentConditionalTermsAssessment;
  source_relations: CommitmentConditionalTermSourceRelationAssessment[];
  model_limitations: CommitmentConditionalTermModelLimitation[];
}

export interface CommitmentConditionalTermHistory {
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  declarations: InterventionCommitmentConditionalTermDeclaration[];
  positions: CommitmentConditionalTermPosition[];
  role_divergences: CommitmentConditionRoleDivergence[];
  has_declarations: boolean;
}
