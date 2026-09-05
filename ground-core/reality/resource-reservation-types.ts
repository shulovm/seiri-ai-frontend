/**
 * Reality Core v0.7 — Resource Reservation derived types (GROUND-035).
 *
 * Read-only assessment types. Must not import state-engine / file-store / studio.
 * Reservation != Resource Commitment / Availability / Capacity /
 * Allocation / Consumption / ownership / Authority / Permission /
 * effective exclusive control / double-booking / execution.
 */

import type { InterventionResourceCommitmentContextAssessment } from "./resource-commitment-types.js";
import type { ResourceAssessment } from "./resource-types.js";
import type {
  InterventionResourceCommitmentDeclaration,
  InterventionResourceReservationDeclaration,
  ReferenceDeclarer,
  ResourceDeclaration,
  ResourceReservationScope,
} from "../types.js";

export type ResourceReservationSourceRelation =
  | "SELF_DECLARED_BY_RESOURCE_RESERVER"
  | "DECLARED_BY_OTHER_ENTITY"
  | "DECLARED_BY_NON_ENTITY_SOURCE";

export type ResourceReserverCommitterRelation =
  | "RESOURCE_RESERVER_IS_RESOURCE_COMMITTER"
  | "RESOURCE_RESERVER_DIFFERS_FROM_RESOURCE_COMMITTER";

export type ResourceReserverHolderRelation =
  | "RESOURCE_RESERVER_IS_RESOURCE_HOLDER"
  | "RESOURCE_RESERVER_DIFFERS_FROM_RESOURCE_HOLDER";

export type ResourceReserverCommitmentHolderRelation =
  | "RESOURCE_RESERVER_IS_COMMITMENT_HOLDER"
  | "RESOURCE_RESERVER_DIFFERS_FROM_COMMITMENT_HOLDER";

export type DeclaredInterventionResourceReservationStatus =
  | "NO_RESOURCE_RESERVATION_DECLARATIONS"
  | "RESOURCE_RESERVATION_DECLARED";

export type ResourceReservationModelLimitation =
  | "RESOURCE_RESERVATION_ACCEPTANCE_NOT_MODELED"
  | "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED"
  | "RESOURCE_USE_PERMISSION_NOT_MODELED"
  | "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED"
  | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
  | "RESOURCE_FREE_QUANTITY_NOT_MODELED"
  | "RESOURCE_REMAINING_QUANTITY_NOT_MODELED"
  | "RESOURCE_RESERVATION_CAPACITY_SUFFICIENCY_NOT_MODELED"
  | "RESOURCE_RESERVATION_CONFLICT_ADJUDICATION_NOT_MODELED"
  | "RESOURCE_RESERVATION_PRECEDENCE_NOT_MODELED"
  | "RESOURCE_ALLOCATION_NOT_MODELED"
  | "RESOURCE_CONSUMPTION_NOT_MODELED"
  | "RESOURCE_RESERVATION_RELEASE_NOT_MODELED"
  | "COMMITMENT_TERM_PROPAGATION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface ResourceReservationWindow {
  reserved_from: string;
  reserved_until: string | null;
}

export interface InterventionResourceReservationPosition {
  key: string;
  resource_commitment_semantic_key: string;
  commitment_semantic_key: string;
  intervention_id: string;
  resource_declaration_id: string;
  resource_committer_entity_id: string;
  reserved_by_entity_id: string;
  reservation_made_at: string;
  resource_reservation_declaration_ids: string[];
  targeted_resource_commitment_declaration_ids: string[];
  declared_scopes: ResourceReservationScope[];
  declared_windows: ResourceReservationWindow[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

export interface ResourceReservationScopeDivergence {
  key: string;
  resource_reservation_position_key: string;
  scope_keys: string[];
  reservation_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface ResourceReservationAmountDivergence {
  key: string;
  resource_reservation_position_key: string;
  amount_keys: string[];
  reservation_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface ResourceReservationWindowDivergence {
  key: string;
  resource_reservation_position_key: string;
  window_keys: string[];
  reservation_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface DeclaredInterventionResourceReservationAssessment {
  resource_commitment_semantic_key: string;
  positions: InterventionResourceReservationPosition[];
  scope_divergences: ResourceReservationScopeDivergence[];
  amount_divergences: ResourceReservationAmountDivergence[];
  window_divergences: ResourceReservationWindowDivergence[];
  has_reservations: boolean;
  has_scope_divergence: boolean;
  has_amount_divergence: boolean;
  has_window_divergence: boolean;
  status: DeclaredInterventionResourceReservationStatus;
}

export interface InterventionResourceReservationContextAssessment {
  reservation: InterventionResourceReservationDeclaration;
  resource_commitment: InterventionResourceCommitmentDeclaration;
  resource_commitment_context: InterventionResourceCommitmentContextAssessment;
  resource: ResourceDeclaration;
  resource_assessment: ResourceAssessment;
  source_relation: ResourceReservationSourceRelation;
  reserver_committer_relation: ResourceReserverCommitterRelation;
  reserver_resource_holder_relation: ResourceReserverHolderRelation;
  reserver_commitment_holder_relation: ResourceReserverCommitmentHolderRelation;
  /** Interval math only: at ∈ [reserved_from, reserved_until). Not effective/active. */
  window_covers_at: boolean;
  model_limitations: ResourceReservationModelLimitation[];
}

export interface InterventionResourceReservationHistory {
  resource_commitment_semantic_key: string;
  declarations: InterventionResourceReservationDeclaration[];
  positions: InterventionResourceReservationPosition[];
  scope_divergences: ResourceReservationScopeDivergence[];
  amount_divergences: ResourceReservationAmountDivergence[];
  window_divergences: ResourceReservationWindowDivergence[];
  has_declarations: boolean;
}
