/**
 * Reality Core v0.7 — Commitment Core I derived types (GROUND-030).
 *
 * Read-only assessment types. Must not import state-engine / file-store / studio.
 * Commitment != Intent / Decision / Mandate / Permission / Capability /
 * Resource / Resource reservation / Execution / Acceptance.
 *
 * COMMITMENT_DECLARED != legally bound / accepted / resourced / scheduled /
 * executable.
 */

import type { DecisionContextCaptureRelation } from "./decision-memory-types.js";
import type {
  InterventionCommitmentDeclaration,
  ReferenceDeclarer,
} from "../types.js";

export type DeclaredInterventionCommitmentStatus =
  | "NO_COMMITMENT_DECLARATIONS"
  | "COMMITMENT_DECLARED";

export type CommitmentSourceRelation =
  | "SELF_DECLARED_BY_HOLDER"
  | "DECLARED_BY_OTHER_ENTITY"
  | "DECLARED_BY_NON_ENTITY_SOURCE";

export type CommitmentDecisionActorRelation =
  | "DECISION_HAS_NO_SELECTED_ACTOR"
  | "COMMITMENT_HOLDER_IS_SELECTED_ACTOR"
  | "COMMITMENT_HOLDER_DIFFERS_FROM_SELECTED_ACTOR";

export type CommitmentModelLimitation =
  | "COMMITMENT_ACCEPTANCE_NOT_MODELED"
  | "COMMITMENT_AUTHORITY_NOT_MODELED"
  | "COMMITMENT_COUNTERPARTY_NOT_MODELED"
  | "RESOURCE_BINDING_NOT_MODELED"
  | "DEADLINE_NOT_MODELED"
  | "CONDITIONAL_COMMITMENT_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface InterventionCommitmentPosition {
  key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  commitment_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

export interface DeclaredInterventionCommitmentAssessment {
  commitment_holder_entity_id: string;
  intervention_id: string;
  at: string;
  status: DeclaredInterventionCommitmentStatus;
  commitment_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  commitment_positions: InterventionCommitmentPosition[];
  has_multiple_declarations: boolean;
}

/**
 * Descriptive relation between a Commitment declaration and optional
 * Decision / Intent bases. No validity / causation / acceptance verdict.
 */
export interface CommitmentBasisAssessment {
  commitment_declaration_id: string;
  decision_basis_ids: string[];
  intent_basis_ids: string[];
  has_decision_basis: boolean;
  has_intent_basis: boolean;
  decision_actor_relations: CommitmentDecisionActorRelation[];
  holder_was_candidate_in_decision_snapshot: boolean | null;
  decision_context_capture_relations: DecisionContextCaptureRelation[];
  all_intent_bases_are_pursue: true;
}

export interface CommitmentSourceRelationAssessment {
  commitment_declaration_id: string;
  source_relation: CommitmentSourceRelation;
}

export interface InterventionCommitmentContextAssessment {
  commitment: InterventionCommitmentDeclaration;
  source_relation: CommitmentSourceRelation;
  basis: CommitmentBasisAssessment;
  model_limitations: CommitmentModelLimitation[];
}

export interface InterventionCommitmentHistory {
  commitment_holder_entity_id: string;
  intervention_id: string;
  declarations: InterventionCommitmentDeclaration[];
  positions: InterventionCommitmentPosition[];
  has_declarations: boolean;
}
