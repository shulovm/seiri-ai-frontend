/**
 * Reality Core v0.7 — Resource Reservation Contention derived types (GROUND-036).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 *
 * structural overlap != operational conflict
 * represented load composition != effective reserved / free inventory
 * No double-booking / overallocation / Capacity comparison verdict.
 */

import type {
  ReferenceDeclarer,
  ResourceReservationScope,
} from "../types.js";
import type { ResourceReservationWindow } from "./resource-reservation-types.js";

export type ResourceReservationScopeInteraction =
  | "FULL_RESOURCE_WITH_FULL_RESOURCE"
  | "FULL_RESOURCE_WITH_AMOUNT"
  | "AMOUNT_WITH_AMOUNT";

export type ReservationEventCoverageStatusAt =
  | "NO_REPRESENTED_WINDOW_COVERS_AT"
  | "REPRESENTED_WINDOW_COVERS_AT"
  | "CONTESTED_REPRESENTED_WINDOW_COVERAGE";

export type ReservationEventLoadBasisStatus =
  | "NOT_REPRESENTED_AT"
  | "UNAMBIGUOUS_AMOUNT"
  | "UNAMBIGUOUS_FULL_RESOURCE"
  | "AMBIGUOUS_COVERAGE"
  | "AMBIGUOUS_SCOPE_OR_AMOUNT";

export type DeclaredReservationLoadCompositionStatus =
  | "NO_REPRESENTED_RESERVATION_LOAD"
  | "COMPLETE_NUMERIC_COMPOSITION"
  | "NON_NUMERIC_FULL_RESOURCE_PRESENT"
  | "AMBIGUOUS_RESERVATION_REPRESENTATION";

/**
 * Contention = reasoning domain where represented Reservation claims may
 * compete for the same exact Resource/time. Not an operational conflict verdict.
 */
export type ResourceReservationContentionModelLimitation =
  | "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED"
  | "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED"
  | "RESOURCE_USE_PERMISSION_NOT_MODELED"
  | "RESERVATION_OVERLAP_ADJUDICATION_NOT_MODELED"
  | "DOUBLE_BOOKING_NOT_MODELED"
  | "OVERALLOCATION_NOT_MODELED"
  | "RESOURCE_RESERVATION_PRECEDENCE_NOT_MODELED"
  | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
  | "RESOURCE_FREE_QUANTITY_NOT_MODELED"
  | "RESOURCE_REMAINING_QUANTITY_NOT_MODELED"
  | "CAPACITY_COMPARISON_NOT_MODELED"
  | "FULL_RESOURCE_NUMERIC_EQUIVALENCE_NOT_MODELED"
  | "RESOURCE_ALLOCATION_NOT_MODELED"
  | "RESOURCE_CONSUMPTION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Source-supported joint (scope, window) representation of a semantic Reservation.
 * No cartesian product across divergent scopes and windows.
 */
export interface ResourceReservationRepresentation {
  key: string;
  reservation_position_key: string;
  resource_commitment_semantic_key: string;
  commitment_semantic_key: string;
  resource_declaration_id: string;
  resource_committer_entity_id: string;
  reserved_by_entity_id: string;
  reservation_made_at: string;
  reservation_scope: ResourceReservationScope;
  scope_key: string;
  window: ResourceReservationWindow;
  window_key: string;
  reservation_declaration_ids: string[];
  targeted_resource_commitment_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface ResourceReservationEventRepresentationAssessment {
  reservation_position_key: string;
  representations: ResourceReservationRepresentation[];
  has_multiple_representations: boolean;
  has_scope_divergence: boolean;
  has_amount_divergence: boolean;
  has_window_divergence: boolean;
}

/** Interval math only — not conflict window / double-booked interval. */
export interface ResourceReservationOverlapWindow {
  overlap_from: string;
  overlap_until: string | null;
}

/**
 * Structural declared-window overlap between two distinct Reservation events.
 * Not a conflict / double-booking / invalidation verdict.
 */
export interface ResourceReservationOverlapCandidate {
  key: string;
  resource_declaration_id: string;
  left_reservation_position_key: string;
  right_reservation_position_key: string;
  left_representation_key: string;
  right_representation_key: string;
  overlap_window: ResourceReservationOverlapWindow;
  scope_interaction: ResourceReservationScopeInteraction;
  same_resource_commitment: boolean;
  same_intervention_commitment: boolean;
  same_reserver: boolean;
  left_scope: ResourceReservationScope;
  right_scope: ResourceReservationScope;
  left_reservation_declaration_ids: string[];
  right_reservation_declaration_ids: string[];
}

export interface ResourceReservationContentionAssessment {
  resource_declaration_id: string;
  reservation_event_representations: ResourceReservationEventRepresentationAssessment[];
  overlap_candidates: ResourceReservationOverlapCandidate[];
  semantic_reservation_event_count: number;
  representation_count: number;
  has_overlap_candidates: boolean;
  model_limitations: ResourceReservationContentionModelLimitation[];
}

export interface ReservationEventLoadBasisAt {
  reservation_position_key: string;
  resource_declaration_id: string;
  at: string;
  coverage_status: ReservationEventCoverageStatusAt;
  load_basis_status: ReservationEventLoadBasisStatus;
  /** Represented declared amount range only — not inventory consumption. */
  amount_range: { min: number; max: number } | null;
  representation_keys: string[];
}

/**
 * Arithmetic over unambiguous represented Reservation amounts covering `at`.
 * Not inventory reservation totals, current usage, or free inventory.
 */
export interface DeclaredResourceReservationLoadCompositionAt {
  resource_declaration_id: string;
  at: string;
  event_load_bases: ReservationEventLoadBasisAt[];
  status: DeclaredReservationLoadCompositionStatus;
  represented_amount_range: { min: number; max: number } | null;
  included_reservation_position_keys: string[];
  non_numeric_reservation_position_keys: string[];
  ambiguous_reservation_position_keys: string[];
  model_limitations: ResourceReservationContentionModelLimitation[];
}
