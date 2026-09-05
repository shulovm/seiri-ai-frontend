/**
 * Reality Core v0.7 — Resource Commitment derived types (GROUND-034).
 *
 * Read-only assessment types. Must not import state-engine / file-store / studio.
 * Resource Commitment != Availability / Capacity / Requirement /
 * Reservation / Allocation / Consumption / ownership / access Permission /
 * effective Resource Commitment / requirement satisfaction.
 */

import type { InterventionCommitmentContextAssessment } from "./commitment-types.js";
import type { ResourceAssessment } from "./resource-types.js";
import type {
  InterventionCommitmentDeclaration,
  InterventionResourceCommitmentDeclaration,
  ReferenceDeclarer,
  ResourceCommitmentAmount,
  ResourceDeclaration,
} from "../types.js";

export type ResourceCommitmentSourceRelation =
  | "SELF_DECLARED_BY_RESOURCE_COMMITTER"
  | "DECLARED_BY_OTHER_ENTITY"
  | "DECLARED_BY_NON_ENTITY_SOURCE";

export type ResourceCommitterHolderRelation =
  | "RESOURCE_COMMITTER_IS_RESOURCE_HOLDER"
  | "RESOURCE_COMMITTER_DIFFERS_FROM_RESOURCE_HOLDER";

export type ResourceCommitterCommitmentHolderRelation =
  | "RESOURCE_COMMITTER_IS_COMMITMENT_HOLDER"
  | "RESOURCE_COMMITTER_DIFFERS_FROM_COMMITMENT_HOLDER";

export type DeclaredInterventionResourceCommitmentStatus =
  | "NO_RESOURCE_COMMITMENT_DECLARATIONS"
  | "RESOURCE_COMMITMENT_DECLARED";

export type ResourceCommitmentModelLimitation =
  | "RESOURCE_COMMITMENT_ACCEPTANCE_NOT_MODELED"
  | "RESOURCE_CONTROL_AUTHORITY_NOT_MODELED"
  | "RESOURCE_ACCESS_PERMISSION_NOT_MODELED"
  | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
  | "RESOURCE_FREE_QUANTITY_NOT_MODELED"
  | "RESOURCE_COMMITMENT_AMOUNT_SUFFICIENCY_NOT_MODELED"
  | "RESOURCE_RESERVATION_NOT_MODELED"
  | "RESOURCE_ALLOCATION_NOT_MODELED"
  | "RESOURCE_CONSUMPTION_NOT_MODELED"
  | "RESOURCE_COMMITMENT_RELEASE_NOT_MODELED"
  | "COMMITMENT_TERM_PROPAGATION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface InterventionResourceCommitmentPosition {
  key: string;
  commitment_semantic_key: string;
  intervention_id: string;
  commitment_holder_entity_id: string;
  resource_declaration_id: string;
  resource_committer_entity_id: string;
  resource_committed_at: string;
  resource_commitment_declaration_ids: string[];
  targeted_commitment_declaration_ids: string[];
  declared_amounts: ResourceCommitmentAmount[];
  has_unspecified_amount: boolean;
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

export interface ResourceCommitmentAmountDivergence {
  key: string;
  resource_commitment_position_key: string;
  specified_amount_keys: string[];
  resource_commitment_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface ResourceCommitmentRequirementRelation {
  commitment_declaration_id: string;
  intervention_id: string;
  resource_declaration_id: string;
  matching_requirement_declaration_ids: string[];
  has_exact_requirement_match: boolean;
  has_requirement_amount_divergence: boolean;
}

export interface DeclaredInterventionResourceCommitmentAssessment {
  commitment_semantic_key: string;
  positions: InterventionResourceCommitmentPosition[];
  amount_divergences: ResourceCommitmentAmountDivergence[];
  has_resource_commitments: boolean;
  has_amount_divergence: boolean;
  status: DeclaredInterventionResourceCommitmentStatus;
}

export interface InterventionResourceCommitmentContextAssessment {
  resource_commitment: InterventionResourceCommitmentDeclaration;
  commitment: InterventionCommitmentDeclaration;
  commitment_context: InterventionCommitmentContextAssessment;
  resource: ResourceDeclaration;
  resource_assessment: ResourceAssessment;
  source_relation: ResourceCommitmentSourceRelation;
  resource_holder_relation: ResourceCommitterHolderRelation;
  commitment_holder_relation: ResourceCommitterCommitmentHolderRelation;
  requirement_relation: ResourceCommitmentRequirementRelation;
  model_limitations: ResourceCommitmentModelLimitation[];
}

export interface InterventionResourceCommitmentHistory {
  commitment_semantic_key: string;
  declarations: InterventionResourceCommitmentDeclaration[];
  positions: InterventionResourceCommitmentPosition[];
  amount_divergences: ResourceCommitmentAmountDivergence[];
  has_declarations: boolean;
}
