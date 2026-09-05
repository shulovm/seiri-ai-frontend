import { canonicalValueKey } from "./semantic-equality.js";
import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Declared Capacity Pressure Basis (GROUND-037).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 *
 * declared load–capacity comparison != operational capacity verdict
 * Consumes GROUND-036 semantic-event load composition (never re-sums raw reservations).
 * Reuses Resource Core Capacity temporal applicability and amount keys.
 */

import {
  isResourceCapacityActiveAt,
  resourceCapacityKey,
} from "./resource-core.js";
import { composeDeclaredResourceReservationLoadAt } from "./resource-reservation-contention-core.js";
import type { DeclaredResourceReservationLoadCompositionAt } from "./resource-reservation-contention-types.js";
import type {
  DeclaredResourceCapacityRepresentationAt,
  ResourceReservationCapacityComparison,
  ResourceReservationCapacityPressureBasisAt,
  ResourceReservationCapacityPressureBasisStatus,
  ResourceReservationCapacityPressureModelLimitation,
  ResourceReservationCapacityRelationDivergence,
  ResourceReservationDeclaredCapacityRelation,
} from "./resource-reservation-capacity-pressure-types.js";
import type {
  ProjectState,
  ReferenceDeclarer,
  ResourceCapacity,
  ResourceCapacityDeclaration,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function declarerKey(declarer: ReferenceDeclarer): string {
  return canonicalValueKey([declarer.kind, declarer.entity_id ?? "", declarer.external_id ?? "", declarer.label ?? ""]);
}

function sortDeclarers(declarers: ReferenceDeclarer[]): ReferenceDeclarer[] {
  return [...declarers].sort((a, b) =>
    declarerKey(a).localeCompare(declarerKey(b))
  );
}

export const RESOURCE_RESERVATION_CAPACITY_PRESSURE_MODEL_LIMITATIONS: ResourceReservationCapacityPressureModelLimitation[] =
  [
    "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED",
    "EFFECTIVE_RESOURCE_CAPACITY_NOT_MODELED",
    "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED",
    "RESOURCE_CAPACITY_AUTHORITY_NOT_MODELED",
    "RESOURCE_USE_PERMISSION_NOT_MODELED",
    "RESOURCE_CAPACITY_PRECEDENCE_NOT_MODELED",
    "FULL_RESOURCE_NUMERIC_EQUIVALENCE_NOT_MODELED",
    "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
    "RESOURCE_FREE_QUANTITY_NOT_MODELED",
    "RESOURCE_REMAINING_QUANTITY_NOT_MODELED",
    "RESOURCE_UTILIZATION_NOT_MODELED",
    "OVERALLOCATION_VERDICT_NOT_MODELED",
    "DOUBLE_BOOKING_VERDICT_NOT_MODELED",
    "RESERVATION_CONFLICT_ADJUDICATION_NOT_MODELED",
    "RESOURCE_ALLOCATION_NOT_MODELED",
    "RESOURCE_CONSUMPTION_NOT_MODELED",
    "REQUIREMENT_SATISFACTION_NOT_MODELED",
    "EFFECTIVE_FEASIBILITY_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const RELATION_ORDER: ResourceReservationDeclaredCapacityRelation[] = [
  "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN",
  "LOAD_MIN_ABOVE_CAPACITY_MAX",
  "LOAD_CAPACITY_RELATION_DEPENDS_ON_DECLARED_RANGE_VALUES",
];

function compareRelations(
  a: ResourceReservationDeclaredCapacityRelation,
  b: ResourceReservationDeclaredCapacityRelation
): number {
  return RELATION_ORDER.indexOf(a) - RELATION_ORDER.indexOf(b);
}

export function declaredResourceCapacityRepresentationKey(
  resourceDeclarationId: string,
  amountKey: string
): string {
  return ["declared-capacity-representation", resourceDeclarationId, amountKey].join(
    "|"
  );
}

export function resourceReservationCapacityComparisonKey(
  resourceDeclarationId: string,
  at: string,
  capacityRepresentationKey: string
): string {
  return [
    "reservation-capacity-comparison",
    resourceDeclarationId,
    temporalInstantKey(at),
    capacityRepresentationKey,
  ].join("|");
}

export function resourceReservationCapacityRelationDivergenceKey(
  resourceDeclarationId: string,
  at: string
): string {
  return [
    "reservation-capacity-relation-divergence",
    resourceDeclarationId,
    temporalInstantKey(at),
  ].join("|");
}

/** Arithmetic normalization only — not effective Capacity. */
export function capacityAmountRangeFromCapacity(
  capacity: ResourceCapacity
): { min: number; max: number } {
  if (capacity.kind === "POINT") {
    return { min: capacity.value, max: capacity.value };
  }
  return { min: capacity.min, max: capacity.max };
}

/**
 * Neutral interval relation:
 * Lmax <= Cmin → LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN
 * Lmin > Cmax → LOAD_MIN_ABOVE_CAPACITY_MAX
 * otherwise → LOAD_CAPACITY_RELATION_DEPENDS_ON_DECLARED_RANGE_VALUES
 */
export function compareNumericRanges(
  loadRange: { min: number; max: number },
  capacityRange: { min: number; max: number }
): ResourceReservationDeclaredCapacityRelation {
  if (loadRange.max <= capacityRange.min) {
    return "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN";
  }
  if (loadRange.min > capacityRange.max) {
    return "LOAD_MIN_ABOVE_CAPACITY_MAX";
  }
  return "LOAD_CAPACITY_RELATION_DEPENDS_ON_DECLARED_RANGE_VALUES";
}

/**
 * Build Capacity representations applicable at `at` for one exact Resource.
 * Identical amount keys group (multi-source != arithmetic sum).
 */
export function buildDeclaredResourceCapacityRepresentationsAt(
  projectState: ProjectState,
  resourceDeclarationId: string,
  at: string
): DeclaredResourceCapacityRepresentationAt[] {
  const active = projectState.resource_capacity_declarations.filter(
    (entry) =>
      entry.resource_declaration_id === resourceDeclarationId &&
      isResourceCapacityActiveAt(entry, at)
  );

  const groups = new Map<
    string,
    {
      amountKey: string;
      capacity: ResourceCapacity;
      declarations: ResourceCapacityDeclaration[];
    }
  >();

  for (const entry of active) {
    const amountKey = resourceCapacityKey(entry.capacity);
    const existing = groups.get(amountKey);
    if (existing) {
      existing.declarations.push(entry);
    } else {
      groups.set(amountKey, {
        amountKey,
        capacity: entry.capacity,
        declarations: [entry],
      });
    }
  }

  return [...groups.values()]
    .sort((a, b) =>
      a.amountKey < b.amountKey ? -1 : a.amountKey > b.amountKey ? 1 : 0
    )
    .map((group) => {
      const declarationIds = group.declarations
        .map((d) => d.id)
        .sort(compareIds);
      const key = declaredResourceCapacityRepresentationKey(
        resourceDeclarationId,
        group.amountKey
      );
      return {
        key,
        resource_declaration_id: resourceDeclarationId,
        at,
        amount_range: capacityAmountRangeFromCapacity(group.capacity),
        capacity_kind: group.capacity.kind,
        capacity_declaration_ids: declarationIds,
        declarers: sortDeclarers(
          group.declarations.map((d) => d.declared_by)
        ),
        has_multiple_declarations: declarationIds.length > 1,
      };
    });
}

export function compareDeclaredReservationLoadToCapacityRepresentation(
  reservationLoad: DeclaredResourceReservationLoadCompositionAt,
  capacityRepresentation: DeclaredResourceCapacityRepresentationAt
): ResourceReservationCapacityComparison | null {
  if (
    reservationLoad.status !== "COMPLETE_NUMERIC_COMPOSITION" ||
    reservationLoad.represented_amount_range === null
  ) {
    return null;
  }
  if (
    reservationLoad.resource_declaration_id !==
    capacityRepresentation.resource_declaration_id
  ) {
    return null;
  }
  if (compareTemporalInstants(reservationLoad.at, capacityRepresentation.at) !== 0) {
    return null;
  }

  const represented_load_range = reservationLoad.represented_amount_range;
  const relation = compareNumericRanges(
    represented_load_range,
    capacityRepresentation.amount_range
  );

  return {
    key: resourceReservationCapacityComparisonKey(
      reservationLoad.resource_declaration_id,
      reservationLoad.at,
      capacityRepresentation.key
    ),
    resource_declaration_id: reservationLoad.resource_declaration_id,
    at: reservationLoad.at,
    represented_load_range,
    capacity_representation_key: capacityRepresentation.key,
    capacity_amount_range: { ...capacityRepresentation.amount_range },
    capacity_declaration_ids: [
      ...capacityRepresentation.capacity_declaration_ids,
    ],
    relation,
  };
}

export function assessResourceReservationCapacityRelationDivergence(
  resourceDeclarationId: string,
  at: string,
  comparisons: ResourceReservationCapacityComparison[]
): ResourceReservationCapacityRelationDivergence | null {
  const relationValues = [
    ...new Set(comparisons.map((c) => c.relation)),
  ].sort(compareRelations);

  if (relationValues.length <= 1) {
    return null;
  }

  const capacity_representation_keys = [
    ...new Set(comparisons.map((c) => c.capacity_representation_key)),
  ].sort();
  const capacity_declaration_ids = [
    ...new Set(comparisons.flatMap((c) => c.capacity_declaration_ids)),
  ].sort(compareIds);

  return {
    key: resourceReservationCapacityRelationDivergenceKey(
      resourceDeclarationId,
      at
    ),
    resource_declaration_id: resourceDeclarationId,
    at,
    relation_values: relationValues,
    capacity_representation_keys,
    capacity_declaration_ids,
  };
}

export function assessResourceReservationCapacityPressureBasisAt(
  projectState: ProjectState,
  resourceDeclarationId: string,
  at: string
): ResourceReservationCapacityPressureBasisAt {
  const reservation_load = composeDeclaredResourceReservationLoadAt(
    projectState,
    resourceDeclarationId,
    at
  );
  const capacity_representations =
    buildDeclaredResourceCapacityRepresentationsAt(
      projectState,
      resourceDeclarationId,
      at
    );

  let status: ResourceReservationCapacityPressureBasisStatus;
  let comparisons: ResourceReservationCapacityComparison[] = [];

  if (reservation_load.status === "NO_REPRESENTED_RESERVATION_LOAD") {
    status = "NO_NUMERIC_RESERVATION_LOAD_BASIS";
  } else if (
    reservation_load.status === "NON_NUMERIC_FULL_RESOURCE_PRESENT" ||
    reservation_load.status === "AMBIGUOUS_RESERVATION_REPRESENTATION"
  ) {
    status = "NON_NUMERIC_OR_AMBIGUOUS_RESERVATION_LOAD";
  } else if (reservation_load.status === "COMPLETE_NUMERIC_COMPOSITION") {
    if (capacity_representations.length === 0) {
      status = "NO_APPLICABLE_CAPACITY_REPRESENTATIONS";
    } else {
      status = "DECLARED_CAPACITY_COMPARISON_AVAILABLE";
      comparisons = capacity_representations
        .map((cap) =>
          compareDeclaredReservationLoadToCapacityRepresentation(
            reservation_load,
            cap
          )
        )
        .filter(
          (c): c is ResourceReservationCapacityComparison => c !== null
        )
        .sort((a, b) =>
          a.capacity_representation_key < b.capacity_representation_key
            ? -1
            : a.capacity_representation_key > b.capacity_representation_key
              ? 1
              : 0
        );
    }
  } else {
    status = "NO_NUMERIC_RESERVATION_LOAD_BASIS";
  }

  const relation_divergence =
    assessResourceReservationCapacityRelationDivergence(
      resourceDeclarationId,
      at,
      comparisons
    );

  const represented_relations = [
    ...new Set(comparisons.map((c) => c.relation)),
  ].sort(compareRelations);

  return {
    resource_declaration_id: resourceDeclarationId,
    at,
    reservation_load,
    capacity_representations,
    comparisons,
    relation_divergence,
    status,
    represented_relations,
    model_limitations: [
      ...RESOURCE_RESERVATION_CAPACITY_PRESSURE_MODEL_LIMITATIONS,
    ],
  };
}
