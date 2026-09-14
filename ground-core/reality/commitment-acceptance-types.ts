/**
 * Reality Core v0.7 — Commitment Acceptance derived types (GROUND-031).
 *
 * Read-only assessment types. Must not import state-engine / file-store / studio.
 * Acceptance != Commitment / Intent / Permission / Authority /
 * legal enforceability / Resource binding / Execution.
 *
 * COMMITMENT_DECLARED + ACCEPTANCE_DECLARED != binding / effective /
 * legal obligation / executable.
 */

import type { InterventionCommitmentContextAssessment } from "./commitment-types.js";
import type {
  InterventionCommitmentAcceptanceDeclaration,
  InterventionCommitmentDeclaration,
  ReferenceDeclarer,
} from "../types.js";

export type DeclaredCommitmentAcceptanceStatus =
  | "NO_ACCEPTANCE_DECLARATIONS"
  | "ACCEPTANCE_DECLARED";

export type CommitmentAcceptanceSourceRelation =
  | "SELF_DECLARED_BY_COMMITMENT_HOLDER"
  | "DECLARED_BY_OTHER_ENTITY"
  | "DECLARED_BY_NON_ENTITY_SOURCE";

export type CommitmentAcceptanceModelLimitation =
  | "COMMITMENT_AUTHORITY_NOT_MODELED"
  | "LEGAL_ENFORCEABILITY_NOT_MODELED"
  | "COUNTERPARTY_NOT_MODELED"
  | "COUNTERPARTY_ACCEPTANCE_NOT_MODELED"
  | "RESOURCE_BINDING_NOT_MODELED"
  | "DEADLINE_NOT_MODELED"
  | "CONDITIONAL_COMMITMENT_NOT_MODELED"
  | "COMMITMENT_RELEASE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface CommitmentAcceptancePosition {
  key: string;
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  accepted_at: string;
  acceptance_declaration_ids: string[];
  targeted_commitment_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

export interface DeclaredCommitmentAcceptanceAssessment {
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  status: DeclaredCommitmentAcceptanceStatus;
  acceptance_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  source_relations: CommitmentAcceptanceSourceRelation[];
  has_self_declared_acceptance: boolean;
  has_other_entity_declared_acceptance: boolean;
  has_non_entity_declared_acceptance: boolean;
  has_multiple_declarations: boolean;
}

export interface CommitmentAcceptanceSourceRelationAssessment {
  acceptance_declaration_id: string;
  source_relation: CommitmentAcceptanceSourceRelation;
}

export interface CommitmentAcceptanceContextAssessment {
  commitment: InterventionCommitmentDeclaration;
  commitment_context: InterventionCommitmentContextAssessment;
  acceptance: DeclaredCommitmentAcceptanceAssessment;
  model_limitations: CommitmentAcceptanceModelLimitation[];
}

export interface CommitmentAcceptanceHistory {
  commitment_semantic_key: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  committed_at: string;
  declarations: InterventionCommitmentAcceptanceDeclaration[];
  positions: CommitmentAcceptancePosition[];
  has_declarations: boolean;
}
