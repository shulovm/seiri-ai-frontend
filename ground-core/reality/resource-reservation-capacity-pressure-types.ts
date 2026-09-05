/**
 * Reality Core v0.7 — Declared Capacity Pressure Basis types (GROUND-037).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 *
 * declared load–capacity comparison != operational capacity verdict
 * Pressure Basis = evidence for a future pressure judgment, not a pressure verdict.
 * No free/remaining/available quantity, load-ratio fields, overallocation, or Capacity winner.
 */

import type { ReferenceDeclarer } from "../types.js";
import type { DeclaredResourceReservationLoadCompositionAt } from "./resource-reservation-contention-types.js";

/**
 * Neutral interval relation between represented Reservation load and one
 * represented Capacity amount. Not sufficiency / overallocation / violation.
 */
export type ResourceReservationDeclaredCapacityRelation =
  | "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN"
  | "LOAD_MIN_ABOVE_CAPACITY_MAX"
  | "LOAD_CAPACITY_RELATION_DEPENDS_ON_DECLARED_RANGE_VALUES";

/**
 * Basis-status only — not operational Capacity pressure state.
 */
export type ResourceReservationCapacityPressureBasisStatus =
  | "NO_NUMERIC_RESERVATION_LOAD_BASIS"
  | "NON_NUMERIC_OR_AMBIGUOUS_RESERVATION_LOAD"
  | "NO_APPLICABLE_CAPACITY_REPRESENTATIONS"
  | "DECLARED_CAPACITY_COMPARISON_AVAILABLE";

export type ResourceReservationCapacityPressureModelLimitation =
  | "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED"
  | "EFFECTIVE_RESOURCE_CAPACITY_NOT_MODELED"
  | "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED"
  | "RESOURCE_CAPACITY_AUTHORITY_NOT_MODELED"
  | "RESOURCE_USE_PERMISSION_NOT_MODELED"
  | "RESOURCE_CAPACITY_PRECEDENCE_NOT_MODELED"
  | "FULL_RESOURCE_NUMERIC_EQUIVALENCE_NOT_MODELED"
  | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
  | "RESOURCE_FREE_QUANTITY_NOT_MODELED"
  | "RESOURCE_REMAINING_QUANTITY_NOT_MODELED"
  | "RESOURCE_UTILIZATION_NOT_MODELED"
  | "OVERALLOCATION_VERDICT_NOT_MODELED"
  | "DOUBLE_BOOKING_VERDICT_NOT_MODELED"
  | "RESERVATION_CONFLICT_ADJUDICATION_NOT_MODELED"
  | "RESOURCE_ALLOCATION_NOT_MODELED"
  | "RESOURCE_CONSUMPTION_NOT_MODELED"
  | "REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "EFFECTIVE_FEASIBILITY_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Grouped declared Capacity amount applicable at `at`.
 * Multi-source identical values share one representation — never summed.
 */
export interface DeclaredResourceCapacityRepresentationAt {
  key: string;
  resource_declaration_id: string;
  at: string;
  amount_range: { min: number; max: number };
  capacity_kind: "POINT" | "RANGE";
  capacity_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

/**
 * One numeric comparison of semantic-event Reservation load vs one Capacity
 * representation. Not a sufficiency / overallocation / remaining verdict.
 */
export interface ResourceReservationCapacityComparison {
  key: string;
  resource_declaration_id: string;
  at: string;
  represented_load_range: { min: number; max: number };
  capacity_representation_key: string;
  capacity_amount_range: { min: number; max: number };
  capacity_declaration_ids: string[];
  relation: ResourceReservationDeclaredCapacityRelation;
}

/**
 * Multiple Capacity representations yield more than one relation category.
 * Not Capacity-source conflict adjudication.
 */
export interface ResourceReservationCapacityRelationDivergence {
  key: string;
  resource_declaration_id: string;
  at: string;
  relation_values: ResourceReservationDeclaredCapacityRelation[];
  capacity_representation_keys: string[];
  capacity_declaration_ids: string[];
}

/**
 * Declared Capacity Pressure Basis at an explicit time.
 * Evidence for a future pressure judgment — not a pressure existence or level verdict.
 */
export interface ResourceReservationCapacityPressureBasisAt {
  resource_declaration_id: string;
  at: string;
  reservation_load: DeclaredResourceReservationLoadCompositionAt;
  capacity_representations: DeclaredResourceCapacityRepresentationAt[];
  comparisons: ResourceReservationCapacityComparison[];
  relation_divergence: ResourceReservationCapacityRelationDivergence | null;
  status: ResourceReservationCapacityPressureBasisStatus;
  represented_relations: ResourceReservationDeclaredCapacityRelation[];
  model_limitations: ResourceReservationCapacityPressureModelLimitation[];
}
