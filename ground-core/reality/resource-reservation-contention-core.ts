import { canonicalValueKey } from "./semantic-equality.js";
import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Resource Reservation Structural Contention (GROUND-036).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 *
 * structural overlap != operational conflict
 * represented load composition != effective reserved / free inventory
 * No double-booking / overallocation / Capacity comparison / precedence.
 */

import { interventionCommitmentSemanticKey } from "./commitment-core.js";
import { resourceCommitmentSemanticKey } from "./resource-commitment-core.js";
import {
  doesResourceReservationWindowCoverAt,
  resourceReservationAmountKey,
  resourceReservationScopeKey,
  resourceReservationSemanticKey,
  resourceReservationWindowKey,
} from "./resource-reservation-core.js";
import type { ResourceReservationWindow } from "./resource-reservation-types.js";
import type {
  DeclaredReservationLoadCompositionStatus,
  DeclaredResourceReservationLoadCompositionAt,
  ReservationEventCoverageStatusAt,
  ReservationEventLoadBasisAt,
  ReservationEventLoadBasisStatus,
  ResourceReservationContentionAssessment,
  ResourceReservationContentionModelLimitation,
  ResourceReservationEventRepresentationAssessment,
  ResourceReservationOverlapCandidate,
  ResourceReservationOverlapWindow,
  ResourceReservationRepresentation,
  ResourceReservationScopeInteraction,
} from "./resource-reservation-contention-types.js";
import type {
  InterventionCommitmentDeclaration,
  InterventionResourceCommitmentDeclaration,
  InterventionResourceReservationDeclaration,
  ProjectState,
  ReferenceDeclarer,
  ResourceReservationScope,
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

export const RESOURCE_RESERVATION_CONTENTION_MODEL_LIMITATIONS: ResourceReservationContentionModelLimitation[] =
  [
    "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED",
    "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED",
    "RESOURCE_USE_PERMISSION_NOT_MODELED",
    "RESERVATION_OVERLAP_ADJUDICATION_NOT_MODELED",
    "DOUBLE_BOOKING_NOT_MODELED",
    "OVERALLOCATION_NOT_MODELED",
    "RESOURCE_RESERVATION_PRECEDENCE_NOT_MODELED",
    "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
    "RESOURCE_FREE_QUANTITY_NOT_MODELED",
    "RESOURCE_REMAINING_QUANTITY_NOT_MODELED",
    "CAPACITY_COMPARISON_NOT_MODELED",
    "FULL_RESOURCE_NUMERIC_EQUIVALENCE_NOT_MODELED",
    "RESOURCE_ALLOCATION_NOT_MODELED",
    "RESOURCE_CONSUMPTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function resourceReservationRepresentationKey(
  reservationPositionKey: string,
  scopeKey: string,
  windowKey: string
): string {
  return [
    "reservation-representation",
    reservationPositionKey,
    scopeKey,
    windowKey,
  ].join("|");
}

export function resourceReservationOverlapCandidateKey(
  resourceDeclarationId: string,
  leftRepresentationKey: string,
  rightRepresentationKey: string
): string {
  const [minKey, maxKey] =
    leftRepresentationKey < rightRepresentationKey
      ? [leftRepresentationKey, rightRepresentationKey]
      : [rightRepresentationKey, leftRepresentationKey];
  return ["reservation-overlap", resourceDeclarationId, minKey, maxKey].join(
    "|"
  );
}

function resolveResourceCommitment(
  projectState: ProjectState,
  resourceCommitmentDeclarationId: string
): InterventionResourceCommitmentDeclaration | null {
  return (
    projectState.intervention_resource_commitment_declarations.find(
      (entry) => entry.id === resourceCommitmentDeclarationId
    ) ?? null
  );
}

function resolveCommitment(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentDeclaration | null {
  return (
    projectState.intervention_commitment_declarations.find(
      (entry) => entry.id === commitmentDeclarationId
    ) ?? null
  );
}

function resourceCommitmentSemanticKeyFor(
  projectState: ProjectState,
  resourceCommitment: InterventionResourceCommitmentDeclaration
): string | null {
  const commitment = resolveCommitment(
    projectState,
    resourceCommitment.commitment_declaration_id
  );
  if (!commitment) {
    return null;
  }
  return resourceCommitmentSemanticKey(
    interventionCommitmentSemanticKey(
      commitment.commitment_holder_entity_id,
      commitment.intervention_id,
      commitment.committed_at
    ),
    resourceCommitment.resource_declaration_id,
    resourceCommitment.resource_committer_entity_id,
    resourceCommitment.resource_committed_at
  );
}

function commitmentSemanticKeyFor(
  commitment: InterventionCommitmentDeclaration
): string {
  return interventionCommitmentSemanticKey(
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  );
}

/**
 * Half-open interval overlap: [a,b) ∩ [c,d) nonempty iff max(a,c) < min(b,d)
 * with null upper bound treated as open-ended.
 */
export function doReservationWindowsOverlap(
  left: ResourceReservationWindow,
  right: ResourceReservationWindow
): boolean {
  const start = compareTemporalInstants(left.reserved_from, right.reserved_from) > 0
    ? left.reserved_from
    : right.reserved_from;
  const leftEnd = left.reserved_until;
  const rightEnd = right.reserved_until;
  if (leftEnd === null && rightEnd === null) {
    return true;
  }
  if (leftEnd === null) {
    return compareTemporalInstants(start, (rightEnd as string)) < 0;
  }
  if (rightEnd === null) {
    return compareTemporalInstants(start, leftEnd) < 0;
  }
  const end = compareTemporalInstants(leftEnd, rightEnd) < 0 ? leftEnd : rightEnd;
  return compareTemporalInstants(start, end) < 0;
}

export function getReservationWindowOverlap(
  left: ResourceReservationWindow,
  right: ResourceReservationWindow
): ResourceReservationOverlapWindow | null {
  if (!doReservationWindowsOverlap(left, right)) {
    return null;
  }
  const overlap_from =
    compareTemporalInstants(left.reserved_from, right.reserved_from) > 0
      ? left.reserved_from
      : right.reserved_from;
  let overlap_until: string | null;
  if (left.reserved_until === null && right.reserved_until === null) {
    overlap_until = null;
  } else if (left.reserved_until === null) {
    overlap_until = right.reserved_until;
  } else if (right.reserved_until === null) {
    overlap_until = left.reserved_until;
  } else {
    overlap_until =
      compareTemporalInstants(left.reserved_until, right.reserved_until) < 0
        ? left.reserved_until
        : right.reserved_until;
  }
  return { overlap_from, overlap_until };
}

export function assessResourceReservationScopeInteraction(
  left: ResourceReservationScope,
  right: ResourceReservationScope
): ResourceReservationScopeInteraction {
  if (left.kind === "FULL_RESOURCE" && right.kind === "FULL_RESOURCE") {
    return "FULL_RESOURCE_WITH_FULL_RESOURCE";
  }
  if (left.kind === "FULL_RESOURCE" || right.kind === "FULL_RESOURCE") {
    return "FULL_RESOURCE_WITH_AMOUNT";
  }
  return "AMOUNT_WITH_AMOUNT";
}

/**
 * Build source-supported joint (scope, window) representations for one Resource.
 * Never forms a cartesian product of divergent scopes × windows.
 */
export function buildResourceReservationRepresentations(
  projectState: ProjectState,
  resourceDeclarationId: string
): ResourceReservationRepresentation[] {
  const groups = new Map<string, ResourceReservationRepresentation>();

  for (const entry of projectState.intervention_resource_reservation_declarations) {
    const resourceCommitment = resolveResourceCommitment(
      projectState,
      entry.resource_commitment_declaration_id
    );
    if (!resourceCommitment) {
      continue;
    }
    if (resourceCommitment.resource_declaration_id !== resourceDeclarationId) {
      continue;
    }
    const commitment = resolveCommitment(
      projectState,
      resourceCommitment.commitment_declaration_id
    );
    if (!commitment) {
      continue;
    }
    const resource_commitment_semantic_key = resourceCommitmentSemanticKeyFor(
      projectState,
      resourceCommitment
    );
    if (!resource_commitment_semantic_key) {
      continue;
    }

    const reservation_position_key = resourceReservationSemanticKey(
      resource_commitment_semantic_key,
      entry.reserved_by_entity_id,
      entry.reservation_made_at
    );
    const scope_key = resourceReservationScopeKey(entry.reservation_scope);
    const window: ResourceReservationWindow = {
      reserved_from: entry.reserved_from,
      reserved_until: entry.reserved_until,
    };
    const window_key = resourceReservationWindowKey(window);
    const key = resourceReservationRepresentationKey(
      reservation_position_key,
      scope_key,
      window_key
    );

    const existing = groups.get(key);
    if (existing) {
      existing.reservation_declaration_ids.push(entry.id);
      existing.targeted_resource_commitment_declaration_ids.push(
        entry.resource_commitment_declaration_id
      );
      existing.declarers.push(entry.declared_by);
    } else {
      groups.set(key, {
        key,
        reservation_position_key,
        resource_commitment_semantic_key,
        commitment_semantic_key: commitmentSemanticKeyFor(commitment),
        resource_declaration_id: resourceDeclarationId,
        resource_committer_entity_id:
          resourceCommitment.resource_committer_entity_id,
        reserved_by_entity_id: entry.reserved_by_entity_id,
        reservation_made_at: entry.reservation_made_at,
        reservation_scope: entry.reservation_scope,
        scope_key,
        window,
        window_key,
        reservation_declaration_ids: [entry.id],
        targeted_resource_commitment_declaration_ids: [
          entry.resource_commitment_declaration_id,
        ],
        declarers: [entry.declared_by],
      });
    }
  }

  return [...groups.values()]
    .map((rep) => ({
      ...rep,
      reservation_declaration_ids: [...rep.reservation_declaration_ids].sort(
        compareIds
      ),
      targeted_resource_commitment_declaration_ids: [
        ...new Set(rep.targeted_resource_commitment_declaration_ids),
      ].sort(compareIds),
      declarers: sortDeclarers(rep.declarers),
    }))
    .sort((a, b) => {
      if (a.reservation_position_key !== b.reservation_position_key) {
        return a.reservation_position_key < b.reservation_position_key
          ? -1
          : 1;
      }
      if (a.scope_key !== b.scope_key) {
        return a.scope_key < b.scope_key ? -1 : 1;
      }
      return a.window_key < b.window_key
        ? -1
        : a.window_key > b.window_key
          ? 1
          : 0;
    });
}

export function assessResourceReservationEventRepresentations(
  projectState: ProjectState,
  resourceDeclarationId: string
): ResourceReservationEventRepresentationAssessment[] {
  const representations = buildResourceReservationRepresentations(
    projectState,
    resourceDeclarationId
  );
  const byPosition = new Map<
    string,
    ResourceReservationRepresentation[]
  >();
  for (const rep of representations) {
    const list = byPosition.get(rep.reservation_position_key) ?? [];
    list.push(rep);
    byPosition.set(rep.reservation_position_key, list);
  }

  return [...byPosition.entries()]
    .map(([reservation_position_key, reps]) => {
      const scopeKeys = new Set(reps.map((r) => r.scope_key));
      const windowKeys = new Set(reps.map((r) => r.window_key));
      const amountKeys = new Set(
        reps
          .filter(
            (
              r
            ): r is ResourceReservationRepresentation & {
              reservation_scope: Extract<
                ResourceReservationScope,
                { kind: "AMOUNT" }
              >;
            } => r.reservation_scope.kind === "AMOUNT"
          )
          .map((r) =>
            resourceReservationAmountKey(r.reservation_scope.amount)
          )
      );
      return {
        reservation_position_key,
        representations: reps,
        has_multiple_representations: reps.length > 1,
        has_scope_divergence: scopeKeys.size > 1,
        has_amount_divergence: amountKeys.size > 1,
        has_window_divergence: windowKeys.size > 1,
      };
    })
    .sort((a, b) =>
      a.reservation_position_key < b.reservation_position_key
        ? -1
        : a.reservation_position_key > b.reservation_position_key
          ? 1
          : 0
    );
}

export function detectResourceReservationOverlapCandidates(
  projectState: ProjectState,
  resourceDeclarationId: string
): ResourceReservationOverlapCandidate[] {
  const representations = buildResourceReservationRepresentations(
    projectState,
    resourceDeclarationId
  );
  const candidates: ResourceReservationOverlapCandidate[] = [];

  for (let i = 0; i < representations.length; i++) {
    for (let j = i + 1; j < representations.length; j++) {
      const left = representations[i]!;
      const right = representations[j]!;
      if (left.reservation_position_key === right.reservation_position_key) {
        continue;
      }
      const overlap_window = getReservationWindowOverlap(
        left.window,
        right.window
      );
      if (!overlap_window) {
        continue;
      }

      const [canonLeft, canonRight] =
        left.key < right.key ? [left, right] : [right, left];

      candidates.push({
        key: resourceReservationOverlapCandidateKey(
          resourceDeclarationId,
          canonLeft.key,
          canonRight.key
        ),
        resource_declaration_id: resourceDeclarationId,
        left_reservation_position_key: canonLeft.reservation_position_key,
        right_reservation_position_key: canonRight.reservation_position_key,
        left_representation_key: canonLeft.key,
        right_representation_key: canonRight.key,
        overlap_window,
        scope_interaction: assessResourceReservationScopeInteraction(
          canonLeft.reservation_scope,
          canonRight.reservation_scope
        ),
        same_resource_commitment:
          canonLeft.resource_commitment_semantic_key ===
          canonRight.resource_commitment_semantic_key,
        same_intervention_commitment:
          canonLeft.commitment_semantic_key ===
          canonRight.commitment_semantic_key,
        same_reserver:
          canonLeft.reserved_by_entity_id === canonRight.reserved_by_entity_id,
        left_scope: canonLeft.reservation_scope,
        right_scope: canonRight.reservation_scope,
        left_reservation_declaration_ids: [
          ...canonLeft.reservation_declaration_ids,
        ],
        right_reservation_declaration_ids: [
          ...canonRight.reservation_declaration_ids,
        ],
      });
    }
  }

  return candidates.sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0
  );
}

export function assessResourceReservationContention(
  projectState: ProjectState,
  resourceDeclarationId: string
): ResourceReservationContentionAssessment {
  const reservation_event_representations =
    assessResourceReservationEventRepresentations(
      projectState,
      resourceDeclarationId
    );
  const overlap_candidates = detectResourceReservationOverlapCandidates(
    projectState,
    resourceDeclarationId
  );
  const representation_count = reservation_event_representations.reduce(
    (sum, event) => sum + event.representations.length,
    0
  );

  return {
    resource_declaration_id: resourceDeclarationId,
    reservation_event_representations,
    overlap_candidates,
    semantic_reservation_event_count: reservation_event_representations.length,
    representation_count,
    has_overlap_candidates: overlap_candidates.length > 0,
    model_limitations: [...RESOURCE_RESERVATION_CONTENTION_MODEL_LIMITATIONS],
  };
}

function amountRangeFromScope(
  scope: Extract<ResourceReservationScope, { kind: "AMOUNT" }>
): { min: number; max: number } {
  if (scope.amount.kind === "POINT") {
    return { min: scope.amount.value, max: scope.amount.value };
  }
  return { min: scope.amount.min, max: scope.amount.max };
}

export function assessReservationEventLoadBasisAt(
  projectState: ProjectState,
  reservationPositionKey: string,
  at: string
): ReservationEventLoadBasisAt {
  const resourceIdFromKey = (() => {
    // Find any representation for this position across all resources via declarations
    for (const entry of projectState.intervention_resource_reservation_declarations) {
      const rc = resolveResourceCommitment(
        projectState,
        entry.resource_commitment_declaration_id
      );
      if (!rc) {
        continue;
      }
      const rcSem = resourceCommitmentSemanticKeyFor(projectState, rc);
      if (!rcSem) {
        continue;
      }
      const positionKey = resourceReservationSemanticKey(
        rcSem,
        entry.reserved_by_entity_id,
        entry.reservation_made_at
      );
      if (positionKey === reservationPositionKey) {
        return rc.resource_declaration_id;
      }
    }
    return null;
  })();

  if (!resourceIdFromKey) {
    throw new Error(
      `Reservation position ${reservationPositionKey} not found in project state`
    );
  }

  const event =
    assessResourceReservationEventRepresentations(
      projectState,
      resourceIdFromKey
    ).find((e) => e.reservation_position_key === reservationPositionKey);

  if (!event) {
    throw new Error(
      `Reservation position ${reservationPositionKey} not found for resource ${resourceIdFromKey}`
    );
  }

  const covering = event.representations.filter((rep) =>
    doesResourceReservationWindowCoverAt(
      rep.window.reserved_from,
      rep.window.reserved_until,
      at
    )
  );
  const nonCovering = event.representations.filter(
    (rep) =>
      !doesResourceReservationWindowCoverAt(
        rep.window.reserved_from,
        rep.window.reserved_until,
        at
      )
  );

  let coverage_status: ReservationEventCoverageStatusAt;
  let load_basis_status: ReservationEventLoadBasisStatus;
  let amount_range: { min: number; max: number } | null = null;
  let representation_keys: string[] = [];

  if (covering.length === 0) {
    coverage_status = "NO_REPRESENTED_WINDOW_COVERS_AT";
    load_basis_status = "NOT_REPRESENTED_AT";
    representation_keys = event.representations.map((r) => r.key).sort();
  } else if (nonCovering.length > 0) {
    coverage_status = "CONTESTED_REPRESENTED_WINDOW_COVERAGE";
    load_basis_status = "AMBIGUOUS_COVERAGE";
    representation_keys = event.representations.map((r) => r.key).sort();
  } else {
    coverage_status = "REPRESENTED_WINDOW_COVERS_AT";
    representation_keys = covering.map((r) => r.key).sort();
    const scopeKeys = new Set(covering.map((r) => r.scope_key));
    const amountKeys = new Set(
      covering
        .filter(
          (
            r
          ): r is ResourceReservationRepresentation & {
            reservation_scope: Extract<
              ResourceReservationScope,
              { kind: "AMOUNT" }
            >;
          } => r.reservation_scope.kind === "AMOUNT"
        )
        .map((r) =>
          resourceReservationAmountKey(r.reservation_scope.amount)
        )
    );
    const hasFull = covering.some(
      (r) => r.reservation_scope.kind === "FULL_RESOURCE"
    );
    const hasAmount = covering.some(
      (r) => r.reservation_scope.kind === "AMOUNT"
    );

    if (scopeKeys.size > 1 || amountKeys.size > 1 || (hasFull && hasAmount)) {
      load_basis_status = "AMBIGUOUS_SCOPE_OR_AMOUNT";
    } else if (hasFull) {
      load_basis_status = "UNAMBIGUOUS_FULL_RESOURCE";
    } else {
      const scope = covering[0]!.reservation_scope;
      if (scope.kind !== "AMOUNT") {
        load_basis_status = "AMBIGUOUS_SCOPE_OR_AMOUNT";
      } else {
        load_basis_status = "UNAMBIGUOUS_AMOUNT";
        amount_range = amountRangeFromScope(scope);
      }
    }
  }

  return {
    reservation_position_key: reservationPositionKey,
    resource_declaration_id: resourceIdFromKey,
    at,
    coverage_status,
    load_basis_status,
    amount_range,
    representation_keys,
  };
}

export function composeDeclaredResourceReservationLoadAt(
  projectState: ProjectState,
  resourceDeclarationId: string,
  at: string
): DeclaredResourceReservationLoadCompositionAt {
  const events = assessResourceReservationEventRepresentations(
    projectState,
    resourceDeclarationId
  );
  const event_load_bases = events
    .map((event) =>
      assessReservationEventLoadBasisAt(
        projectState,
        event.reservation_position_key,
        at
      )
    )
    .sort((a, b) =>
      a.reservation_position_key < b.reservation_position_key
        ? -1
        : a.reservation_position_key > b.reservation_position_key
          ? 1
          : 0
    );

  const represented = event_load_bases.filter(
    (basis) => basis.load_basis_status !== "NOT_REPRESENTED_AT"
  );
  const ambiguous = represented.filter(
    (basis) =>
      basis.load_basis_status === "AMBIGUOUS_COVERAGE" ||
      basis.load_basis_status === "AMBIGUOUS_SCOPE_OR_AMOUNT"
  );
  const fullResource = represented.filter(
    (basis) => basis.load_basis_status === "UNAMBIGUOUS_FULL_RESOURCE"
  );
  const unambiguousAmounts = represented.filter(
    (basis) => basis.load_basis_status === "UNAMBIGUOUS_AMOUNT"
  );

  let status: DeclaredReservationLoadCompositionStatus;
  let represented_amount_range: { min: number; max: number } | null = null;
  let included_reservation_position_keys: string[] = [];
  let non_numeric_reservation_position_keys: string[] = [];
  let ambiguous_reservation_position_keys: string[] = [];

  if (represented.length === 0) {
    status = "NO_REPRESENTED_RESERVATION_LOAD";
  } else if (ambiguous.length > 0) {
    status = "AMBIGUOUS_RESERVATION_REPRESENTATION";
    ambiguous_reservation_position_keys = ambiguous
      .map((b) => b.reservation_position_key)
      .sort();
    non_numeric_reservation_position_keys = fullResource
      .map((b) => b.reservation_position_key)
      .sort();
  } else if (fullResource.length > 0) {
    status = "NON_NUMERIC_FULL_RESOURCE_PRESENT";
    non_numeric_reservation_position_keys = fullResource
      .map((b) => b.reservation_position_key)
      .sort();
    included_reservation_position_keys = unambiguousAmounts
      .map((b) => b.reservation_position_key)
      .sort();
  } else {
    status = "COMPLETE_NUMERIC_COMPOSITION";
    included_reservation_position_keys = unambiguousAmounts
      .map((b) => b.reservation_position_key)
      .sort();
    let min = 0;
    let max = 0;
    for (const basis of unambiguousAmounts) {
      min += basis.amount_range!.min;
      max += basis.amount_range!.max;
    }
    represented_amount_range = { min, max };
  }

  return {
    resource_declaration_id: resourceDeclarationId,
    at,
    event_load_bases,
    status,
    represented_amount_range,
    included_reservation_position_keys,
    non_numeric_reservation_position_keys,
    ambiguous_reservation_position_keys,
    model_limitations: [...RESOURCE_RESERVATION_CONTENTION_MODEL_LIMITATIONS],
  };
}
