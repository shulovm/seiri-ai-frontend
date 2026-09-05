/**
 * Reality Core v0.7 — Resource Contention Discovery (GROUND-038).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 *
 * Finding ≠ Verdict. Structural Resource Finding ≠ PROBLEM / NEED / BLOCKER / RISK.
 * Consumes GROUND-036 contention/load and GROUND-037 Capacity pressure basis only.
 * Does not re-detect overlap, re-sum Reservation amounts, or re-compare Capacity.
 */

import { assessResourceReservationCapacityPressureBasisAt } from "./resource-reservation-capacity-pressure-core.js";
import {
  assessResourceReservationContention,
  composeDeclaredResourceReservationLoadAt,
} from "./resource-reservation-contention-core.js";
import type {
  ResourceContentionDiscoveryAssessment,
  ResourceContentionDiscoveryModelLimitation,
  ResourceContentionFinding,
  ResourceContentionFindingKind,
} from "./resource-contention-discovery-types.js";
import type { ProjectState } from "../types.js";

export const RESOURCE_CONTENTION_DISCOVERY_MODEL_LIMITATIONS: ResourceContentionDiscoveryModelLimitation[] =
  [
    "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED",
    "EFFECTIVE_RESOURCE_CAPACITY_NOT_MODELED",
    "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED",
    "RESOURCE_CAPACITY_AUTHORITY_NOT_MODELED",
    "RESOURCE_USE_PERMISSION_NOT_MODELED",
    "RESERVATION_CONFLICT_ADJUDICATION_NOT_MODELED",
    "DOUBLE_BOOKING_VERDICT_NOT_MODELED",
    "OVERALLOCATION_VERDICT_NOT_MODELED",
    "RESOURCE_CAPACITY_PRECEDENCE_NOT_MODELED",
    "RESOURCE_FREE_QUANTITY_NOT_MODELED",
    "RESOURCE_REMAINING_QUANTITY_NOT_MODELED",
    "REQUIREMENT_SATISFACTION_NOT_MODELED",
    "EFFECTIVE_FEASIBILITY_NOT_MODELED",
    "DISCOVERY_PRIORITY_NOT_MODELED",
    "ATTENTION_NOT_MODELED",
    "AUTOMATIC_INQUIRY_BRIDGE_NOT_MODELED",
    "AUTOMATIC_DECISION_BRIDGE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Deterministic serialization order only — not Attention ranking.
 */
export const RESOURCE_CONTENTION_FINDING_KIND_ORDER: ResourceContentionFindingKind[] =
  [
    "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY",
    "RESOURCE_RESERVATION_OVERLAP_PRESENT",
    "RESOURCE_CAPACITY_BASIS_MISSING",
    "RESOURCE_CAPACITY_RELATION_DIVERGENCE",
    "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
  ];

const FINDING_KIND_ORDER: Record<ResourceContentionFindingKind, number> =
  Object.fromEntries(
    RESOURCE_CONTENTION_FINDING_KIND_ORDER.map((kind, index) => [kind, index])
  ) as Record<ResourceContentionFindingKind, number>;

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUnique(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function compareFindings(
  a: ResourceContentionFinding,
  b: ResourceContentionFinding
): number {
  const kindDiff = FINDING_KIND_ORDER[a.kind] - FINDING_KIND_ORDER[b.kind];
  if (kindDiff !== 0) {
    return kindDiff;
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

export function resourceContentionFindingKey(
  kind: ResourceContentionFindingKind,
  resourceDeclarationId: string,
  at: string
): string {
  return ["resource-contention-finding", kind, resourceDeclarationId, at].join(
    "|"
  );
}

function withLimitations(
  finding: Omit<ResourceContentionFinding, "model_limitations">
): ResourceContentionFinding {
  return {
    ...finding,
    model_limitations: [...RESOURCE_CONTENTION_DISCOVERY_MODEL_LIMITATIONS],
  };
}

export function assessResourceContentionDiscovery(
  projectState: ProjectState,
  resourceDeclarationId: string,
  at: string
): ResourceContentionDiscoveryAssessment {
  const contention = assessResourceReservationContention(
    projectState,
    resourceDeclarationId
  );
  const capacity_pressure_basis =
    assessResourceReservationCapacityPressureBasisAt(
      projectState,
      resourceDeclarationId,
      at
    );
  // Same load composition path as GROUND-037 (via capacity basis) — also
  // available for ambiguity triggers that inspect event load bases.
  const reservation_load = composeDeclaredResourceReservationLoadAt(
    projectState,
    resourceDeclarationId,
    at
  );

  const findings: ResourceContentionFinding[] = [];

  // 1. Representation ambiguity
  {
    const divergentEvents = contention.reservation_event_representations.filter(
      (event) =>
        event.has_scope_divergence ||
        event.has_amount_divergence ||
        event.has_window_divergence
    );
    const ambiguousAt = reservation_load.event_load_bases.filter(
      (basis) =>
        basis.load_basis_status === "AMBIGUOUS_COVERAGE" ||
        basis.load_basis_status === "AMBIGUOUS_SCOPE_OR_AMOUNT"
    );

    if (divergentEvents.length > 0 || ambiguousAt.length > 0) {
      const eventsByKey = new Map(
        contention.reservation_event_representations.map((e) => [
          e.reservation_position_key,
          e,
        ])
      );
      const positionKeys = sortUnique([
        ...divergentEvents.map((e) => e.reservation_position_key),
        ...ambiguousAt.map((b) => b.reservation_position_key),
      ]);
      const representation_keys = sortUnique(
        positionKeys.flatMap((positionKey) => {
          const event = eventsByKey.get(positionKey);
          if (!event) {
            return [];
          }
          return event.representations.map((r) => r.key);
        })
      );
      const reservation_declaration_ids = sortUnique(
        positionKeys.flatMap((positionKey) => {
          const event = eventsByKey.get(positionKey);
          if (!event) {
            return [];
          }
          return event.representations.flatMap(
            (r) => r.reservation_declaration_ids
          );
        })
      );
      const has_scope_divergence = divergentEvents.some(
        (e) => e.has_scope_divergence
      );
      const has_amount_divergence = divergentEvents.some(
        (e) => e.has_amount_divergence
      );
      const has_window_divergence = divergentEvents.some(
        (e) => e.has_window_divergence
      );
      const has_coverage_ambiguity_at = ambiguousAt.some(
        (b) => b.load_basis_status === "AMBIGUOUS_COVERAGE"
      );
      const has_scope_or_amount_ambiguity_at = ambiguousAt.some(
        (b) => b.load_basis_status === "AMBIGUOUS_SCOPE_OR_AMOUNT"
      );

      findings.push(
        withLimitations({
          key: resourceContentionFindingKey(
            "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY",
            resourceDeclarationId,
            at
          ),
          kind: "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY",
          resource_declaration_id: resourceDeclarationId,
          at,
          basis: {
            kind: "RESERVATION_REPRESENTATION_AMBIGUITY",
            reservation_position_keys: positionKeys,
            representation_keys,
            reservation_declaration_ids,
            has_scope_divergence,
            has_amount_divergence,
            has_window_divergence,
            has_coverage_ambiguity_at,
            has_scope_or_amount_ambiguity_at,
          },
          summary:
            "Different represented descriptions exist for one or more Reservation events.",
        })
      );
    }
  }

  // 2. Overlap present — one Finding per resource+at, all candidate keys
  if (contention.has_overlap_candidates) {
    const overlap_candidate_keys = sortUnique(
      contention.overlap_candidates.map((c) => c.key)
    );
    const reservation_position_keys = sortUnique(
      contention.overlap_candidates.flatMap((c) => [
        c.left_reservation_position_key,
        c.right_reservation_position_key,
      ])
    );
    const reservation_declaration_ids = sortUnique(
      contention.overlap_candidates.flatMap((c) => [
        ...c.left_reservation_declaration_ids,
        ...c.right_reservation_declaration_ids,
      ])
    );

    findings.push(
      withLimitations({
        key: resourceContentionFindingKey(
          "RESOURCE_RESERVATION_OVERLAP_PRESENT",
          resourceDeclarationId,
          at
        ),
        kind: "RESOURCE_RESERVATION_OVERLAP_PRESENT",
        resource_declaration_id: resourceDeclarationId,
        at,
        basis: {
          kind: "RESERVATION_OVERLAP",
          overlap_candidate_keys,
          reservation_position_keys,
          reservation_declaration_ids,
        },
        summary:
          "Multiple represented Reservation events have overlapping declared windows.",
      })
    );
  }

  // 3. Capacity basis missing
  if (
    capacity_pressure_basis.status === "NO_APPLICABLE_CAPACITY_REPRESENTATIONS" &&
    capacity_pressure_basis.reservation_load.status ===
      "COMPLETE_NUMERIC_COMPOSITION"
  ) {
    findings.push(
      withLimitations({
        key: resourceContentionFindingKey(
          "RESOURCE_CAPACITY_BASIS_MISSING",
          resourceDeclarationId,
          at
        ),
        kind: "RESOURCE_CAPACITY_BASIS_MISSING",
        resource_declaration_id: resourceDeclarationId,
        at,
        basis: {
          kind: "CAPACITY_BASIS_MISSING",
          reservation_load_status: "COMPLETE_NUMERIC_COMPOSITION",
        },
        summary:
          "Numeric Reservation load exists without an applicable Capacity representation.",
      })
    );
  }

  // 4. Capacity relation divergence
  if (capacity_pressure_basis.relation_divergence !== null) {
    const divergence = capacity_pressure_basis.relation_divergence;
    findings.push(
      withLimitations({
        key: resourceContentionFindingKey(
          "RESOURCE_CAPACITY_RELATION_DIVERGENCE",
          resourceDeclarationId,
          at
        ),
        kind: "RESOURCE_CAPACITY_RELATION_DIVERGENCE",
        resource_declaration_id: resourceDeclarationId,
        at,
        basis: {
          kind: "CAPACITY_RELATION_DIVERGENCE",
          comparison_keys: sortUnique(
            capacity_pressure_basis.comparisons.map((c) => c.key)
          ),
          capacity_representation_keys: [
            ...divergence.capacity_representation_keys,
          ].sort(),
          relation_values: [...divergence.relation_values],
        },
        summary:
          "Represented Reservation load has different numeric relations to supported Capacity representations.",
      })
    );
  }

  // 5. Load wholly above at least one declared Capacity basis
  if (
    capacity_pressure_basis.status === "DECLARED_CAPACITY_COMPARISON_AVAILABLE"
  ) {
    const above = capacity_pressure_basis.comparisons.filter(
      (c) => c.relation === "LOAD_MIN_ABOVE_CAPACITY_MAX"
    );
    if (above.length > 0) {
      findings.push(
        withLimitations({
          key: resourceContentionFindingKey(
            "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
            resourceDeclarationId,
            at
          ),
          kind: "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
          resource_declaration_id: resourceDeclarationId,
          at,
          basis: {
            kind: "LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
            comparison_keys: sortUnique(above.map((c) => c.key)),
            capacity_representation_keys: sortUnique(
              above.map((c) => c.capacity_representation_key)
            ),
          },
          summary:
            "Represented Reservation load is wholly above at least one declared Capacity representation.",
        })
      );
    }
  }

  const sorted = [...findings].sort(compareFindings);

  return {
    resource_declaration_id: resourceDeclarationId,
    at,
    contention,
    capacity_pressure_basis,
    findings: sorted,
    has_findings: sorted.length > 0,
    model_limitations: [...RESOURCE_CONTENTION_DISCOVERY_MODEL_LIMITATIONS],
  };
}

export function discoverResourceContentionFindings(
  projectState: ProjectState,
  resourceDeclarationId: string,
  at: string
): ResourceContentionFinding[] {
  return assessResourceContentionDiscovery(
    projectState,
    resourceDeclarationId,
    at
  ).findings;
}

export function discoverProjectResourceContentionFindings(
  projectState: ProjectState,
  at: string
): ResourceContentionFinding[] {
  const resourceIds = [
    ...new Set(projectState.resource_declarations.map((r) => r.id)),
  ].sort(compareIds);

  const findings: ResourceContentionFinding[] = [];
  for (const resourceId of resourceIds) {
    findings.push(
      ...discoverResourceContentionFindings(projectState, resourceId, at)
    );
  }

  return findings.sort((a, b) => {
    if (a.resource_declaration_id !== b.resource_declaration_id) {
      return compareIds(a.resource_declaration_id, b.resource_declaration_id);
    }
    return compareFindings(a, b);
  });
}
