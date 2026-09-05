/**
 * Reality Core v0.7 — Resource Reservation assessment (GROUND-035).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Reservation != Resource Commitment / Availability / Capacity /
 * Allocation / Consumption / ownership / Authority / Permission /
 * effective exclusive control. No free/remaining quantity.
 * No double-booking / overallocation / aggregation verdict.
 */

import { interventionCommitmentSemanticKey } from "./commitment-core.js";
import {
  assessInterventionResourceCommitmentContext,
  resourceCommitmentSemanticKey,
} from "./resource-commitment-core.js";
import { assessResource } from "./resource-core.js";
import type {
  DeclaredInterventionResourceReservationAssessment,
  InterventionResourceReservationContextAssessment,
  InterventionResourceReservationHistory,
  InterventionResourceReservationPosition,
  ResourceReservationAmountDivergence,
  ResourceReservationModelLimitation,
  ResourceReservationScopeDivergence,
  ResourceReservationSourceRelation,
  ResourceReservationWindow,
  ResourceReservationWindowDivergence,
  ResourceReserverCommitmentHolderRelation,
  ResourceReserverCommitterRelation,
  ResourceReserverHolderRelation,
} from "./resource-reservation-types.js";
import type {
  InterventionCommitmentDeclaration,
  InterventionResourceCommitmentDeclaration,
  InterventionResourceReservationDeclaration,
  ProjectState,
  ReferenceDeclarer,
  ResourceReservationAmount,
  ResourceReservationScope,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function declarerKey(declarer: ReferenceDeclarer): string {
  return [
    declarer.kind,
    declarer.entity_id ?? "",
    declarer.external_id ?? "",
    declarer.label ?? "",
  ].join("|");
}

function sortDeclarers(declarers: ReferenceDeclarer[]): ReferenceDeclarer[] {
  return [...declarers].sort((a, b) =>
    declarerKey(a).localeCompare(declarerKey(b))
  );
}

export const RESOURCE_RESERVATION_MODEL_LIMITATIONS: ResourceReservationModelLimitation[] =
  [
    "RESOURCE_RESERVATION_ACCEPTANCE_NOT_MODELED",
    "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED",
    "RESOURCE_USE_PERMISSION_NOT_MODELED",
    "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED",
    "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
    "RESOURCE_FREE_QUANTITY_NOT_MODELED",
    "RESOURCE_REMAINING_QUANTITY_NOT_MODELED",
    "RESOURCE_RESERVATION_CAPACITY_SUFFICIENCY_NOT_MODELED",
    "RESOURCE_RESERVATION_CONFLICT_ADJUDICATION_NOT_MODELED",
    "RESOURCE_RESERVATION_PRECEDENCE_NOT_MODELED",
    "RESOURCE_ALLOCATION_NOT_MODELED",
    "RESOURCE_CONSUMPTION_NOT_MODELED",
    "RESOURCE_RESERVATION_RELEASE_NOT_MODELED",
    "COMMITMENT_TERM_PROPAGATION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function resourceReservationAmountKey(
  amount: ResourceReservationAmount
): string {
  if (amount.kind === "POINT") {
    return `POINT|${amount.value}`;
  }
  return `RANGE|${amount.min}|${amount.max}`;
}

export function resourceReservationScopeKey(
  scope: ResourceReservationScope
): string {
  if (scope.kind === "FULL_RESOURCE") {
    return "FULL_RESOURCE";
  }
  return `AMOUNT|${resourceReservationAmountKey(scope.amount)}`;
}

export function resourceReservationWindowKey(
  window: ResourceReservationWindow
): string {
  return `${window.reserved_from}|${window.reserved_until ?? "OPEN"}`;
}

/**
 * Interval coverage only: at ∈ [reserved_from, reserved_until).
 * Not effective / active / binding Reservation.
 */
export function doesResourceReservationWindowCoverAt(
  reservedFrom: string,
  reservedUntil: string | null,
  at: string
): boolean {
  if (at < reservedFrom) {
    return false;
  }
  if (reservedUntil === null) {
    return true;
  }
  return at < reservedUntil;
}

export function resourceReservationSemanticKey(
  resourceCommitmentSemanticKey: string,
  reservedByEntityId: string,
  reservationMadeAt: string
): string {
  return [
    "resource-reservation",
    resourceCommitmentSemanticKey,
    reservedByEntityId,
    reservationMadeAt,
  ].join("|");
}

function resolveResourceCommitment(
  projectState: ProjectState,
  resourceCommitmentDeclarationId: string
): InterventionResourceCommitmentDeclaration {
  const entry = projectState.intervention_resource_commitment_declarations.find(
    (decl) => decl.id === resourceCommitmentDeclarationId
  );
  if (!entry) {
    throw new Error(
      `InterventionResourceCommitmentDeclaration ${resourceCommitmentDeclarationId} not found in project state`
    );
  }
  return entry;
}

function resolveCommitment(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentDeclaration {
  const commitment = projectState.intervention_commitment_declarations.find(
    (entry) => entry.id === commitmentDeclarationId
  );
  if (!commitment) {
    throw new Error(
      `InterventionCommitmentDeclaration ${commitmentDeclarationId} not found in project state`
    );
  }
  return commitment;
}

function resourceCommitmentSemanticKeyFor(
  projectState: ProjectState,
  resourceCommitment: InterventionResourceCommitmentDeclaration
): string {
  const commitment = resolveCommitment(
    projectState,
    resourceCommitment.commitment_declaration_id
  );
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

function declarationsForSemanticResourceCommitment(
  projectState: ProjectState,
  resourceCommitmentSemanticKeyValue: string
): InterventionResourceReservationDeclaration[] {
  return projectState.intervention_resource_reservation_declarations
    .filter((entry) => {
      const rc = projectState.intervention_resource_commitment_declarations.find(
        (c) => c.id === entry.resource_commitment_declaration_id
      );
      if (!rc) {
        return false;
      }
      return (
        resourceCommitmentSemanticKeyFor(projectState, rc) ===
        resourceCommitmentSemanticKeyValue
      );
    })
    .sort((a, b) => {
      if (a.reserved_by_entity_id !== b.reserved_by_entity_id) {
        return a.reserved_by_entity_id < b.reserved_by_entity_id ? -1 : 1;
      }
      if (a.reservation_made_at !== b.reservation_made_at) {
        return a.reservation_made_at < b.reservation_made_at ? -1 : 1;
      }
      return compareIds(a.id, b.id);
    });
}

export function assessResourceReservationSourceRelation(
  declaration: InterventionResourceReservationDeclaration
): ResourceReservationSourceRelation {
  const entityId = declaration.declared_by.entity_id;
  if (entityId == null || entityId === "") {
    return "DECLARED_BY_NON_ENTITY_SOURCE";
  }
  if (entityId === declaration.reserved_by_entity_id) {
    return "SELF_DECLARED_BY_RESOURCE_RESERVER";
  }
  return "DECLARED_BY_OTHER_ENTITY";
}

export function assessResourceReserverCommitterRelation(
  reservedByEntityId: string,
  resourceCommitterEntityId: string
): ResourceReserverCommitterRelation {
  return reservedByEntityId === resourceCommitterEntityId
    ? "RESOURCE_RESERVER_IS_RESOURCE_COMMITTER"
    : "RESOURCE_RESERVER_DIFFERS_FROM_RESOURCE_COMMITTER";
}

export function assessResourceReserverHolderRelation(
  reservedByEntityId: string,
  resourceHolderEntityId: string
): ResourceReserverHolderRelation {
  return reservedByEntityId === resourceHolderEntityId
    ? "RESOURCE_RESERVER_IS_RESOURCE_HOLDER"
    : "RESOURCE_RESERVER_DIFFERS_FROM_RESOURCE_HOLDER";
}

export function assessResourceReserverCommitmentHolderRelation(
  reservedByEntityId: string,
  commitmentHolderEntityId: string
): ResourceReserverCommitmentHolderRelation {
  return reservedByEntityId === commitmentHolderEntityId
    ? "RESOURCE_RESERVER_IS_COMMITMENT_HOLDER"
    : "RESOURCE_RESERVER_DIFFERS_FROM_COMMITMENT_HOLDER";
}

export function groupInterventionResourceReservationPositions(
  projectState: ProjectState,
  resourceCommitmentSemanticKeyValue: string
): InterventionResourceReservationPosition[] {
  const declarations = declarationsForSemanticResourceCommitment(
    projectState,
    resourceCommitmentSemanticKeyValue
  );
  const groups = new Map<string, InterventionResourceReservationPosition>();

  for (const entry of declarations) {
    const resourceCommitment = resolveResourceCommitment(
      projectState,
      entry.resource_commitment_declaration_id
    );
    const commitment = resolveCommitment(
      projectState,
      resourceCommitment.commitment_declaration_id
    );
    const key = resourceReservationSemanticKey(
      resourceCommitmentSemanticKeyValue,
      entry.reserved_by_entity_id,
      entry.reservation_made_at
    );
    const window: ResourceReservationWindow = {
      reserved_from: entry.reserved_from,
      reserved_until: entry.reserved_until,
    };
    const existing = groups.get(key);
    if (existing) {
      existing.resource_reservation_declaration_ids.push(entry.id);
      existing.targeted_resource_commitment_declaration_ids.push(
        entry.resource_commitment_declaration_id
      );
      existing.declarers.push(entry.declared_by);
      const scopeKey = resourceReservationScopeKey(entry.reservation_scope);
      if (
        !existing.declared_scopes.some(
          (s) => resourceReservationScopeKey(s) === scopeKey
        )
      ) {
        existing.declared_scopes.push(entry.reservation_scope);
      }
      const windowKey = resourceReservationWindowKey(window);
      if (
        !existing.declared_windows.some(
          (w) => resourceReservationWindowKey(w) === windowKey
        )
      ) {
        existing.declared_windows.push(window);
      }
      existing.has_multiple_declarations =
        existing.resource_reservation_declaration_ids.length > 1;
    } else {
      groups.set(key, {
        key,
        resource_commitment_semantic_key: resourceCommitmentSemanticKeyValue,
        commitment_semantic_key: commitmentSemanticKeyFor(commitment),
        intervention_id: commitment.intervention_id,
        resource_declaration_id: resourceCommitment.resource_declaration_id,
        resource_committer_entity_id:
          resourceCommitment.resource_committer_entity_id,
        reserved_by_entity_id: entry.reserved_by_entity_id,
        reservation_made_at: entry.reservation_made_at,
        resource_reservation_declaration_ids: [entry.id],
        targeted_resource_commitment_declaration_ids: [
          entry.resource_commitment_declaration_id,
        ],
        declared_scopes: [entry.reservation_scope],
        declared_windows: [window],
        declarers: [entry.declared_by],
        has_multiple_declarations: false,
      });
    }
  }

  return [...groups.values()]
    .map((position) => ({
      ...position,
      resource_reservation_declaration_ids: [
        ...position.resource_reservation_declaration_ids,
      ].sort(compareIds),
      targeted_resource_commitment_declaration_ids: [
        ...new Set(position.targeted_resource_commitment_declaration_ids),
      ].sort(compareIds),
      declared_scopes: [...position.declared_scopes].sort((a, b) =>
        resourceReservationScopeKey(a).localeCompare(
          resourceReservationScopeKey(b)
        )
      ),
      declared_windows: [...position.declared_windows].sort((a, b) =>
        resourceReservationWindowKey(a).localeCompare(
          resourceReservationWindowKey(b)
        )
      ),
      declarers: sortDeclarers(position.declarers),
      has_multiple_declarations:
        position.resource_reservation_declaration_ids.length > 1,
    }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

export function detectResourceReservationScopeDivergences(
  positions: InterventionResourceReservationPosition[]
): ResourceReservationScopeDivergence[] {
  const divergences: ResourceReservationScopeDivergence[] = [];
  for (const position of positions) {
    if (position.declared_scopes.length < 2) {
      continue;
    }
    divergences.push({
      key: `resource-reservation-scope-divergence|${position.key}`,
      resource_reservation_position_key: position.key,
      scope_keys: position.declared_scopes
        .map(resourceReservationScopeKey)
        .sort((a, b) => a.localeCompare(b)),
      reservation_declaration_ids: [
        ...position.resource_reservation_declaration_ids,
      ],
      declarers: [...position.declarers],
    });
  }
  return divergences.sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0
  );
}

export function detectResourceReservationAmountDivergences(
  positions: InterventionResourceReservationPosition[]
): ResourceReservationAmountDivergence[] {
  const divergences: ResourceReservationAmountDivergence[] = [];
  for (const position of positions) {
    const amountKeys = [
      ...new Set(
        position.declared_scopes
          .filter(
            (scope): scope is Extract<ResourceReservationScope, { kind: "AMOUNT" }> =>
              scope.kind === "AMOUNT"
          )
          .map((scope) => resourceReservationAmountKey(scope.amount))
      ),
    ].sort((a, b) => a.localeCompare(b));
    if (amountKeys.length < 2) {
      continue;
    }
    divergences.push({
      key: `resource-reservation-amount-divergence|${position.key}`,
      resource_reservation_position_key: position.key,
      amount_keys: amountKeys,
      reservation_declaration_ids: [
        ...position.resource_reservation_declaration_ids,
      ],
      declarers: [...position.declarers],
    });
  }
  return divergences.sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0
  );
}

export function detectResourceReservationWindowDivergences(
  positions: InterventionResourceReservationPosition[]
): ResourceReservationWindowDivergence[] {
  const divergences: ResourceReservationWindowDivergence[] = [];
  for (const position of positions) {
    if (position.declared_windows.length < 2) {
      continue;
    }
    divergences.push({
      key: `resource-reservation-window-divergence|${position.key}`,
      resource_reservation_position_key: position.key,
      window_keys: position.declared_windows
        .map(resourceReservationWindowKey)
        .sort((a, b) => a.localeCompare(b)),
      reservation_declaration_ids: [
        ...position.resource_reservation_declaration_ids,
      ],
      declarers: [...position.declarers],
    });
  }
  return divergences.sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0
  );
}

export function assessDeclaredInterventionResourceReservations(
  projectState: ProjectState,
  resourceCommitmentDeclarationId: string
): DeclaredInterventionResourceReservationAssessment {
  const resourceCommitment = resolveResourceCommitment(
    projectState,
    resourceCommitmentDeclarationId
  );
  const resource_commitment_semantic_key = resourceCommitmentSemanticKeyFor(
    projectState,
    resourceCommitment
  );
  const positions = groupInterventionResourceReservationPositions(
    projectState,
    resource_commitment_semantic_key
  );
  const scope_divergences =
    detectResourceReservationScopeDivergences(positions);
  const amount_divergences =
    detectResourceReservationAmountDivergences(positions);
  const window_divergences =
    detectResourceReservationWindowDivergences(positions);
  const has_reservations = positions.length > 0;

  return {
    resource_commitment_semantic_key,
    positions,
    scope_divergences,
    amount_divergences,
    window_divergences,
    has_reservations,
    has_scope_divergence: scope_divergences.length > 0,
    has_amount_divergence: amount_divergences.length > 0,
    has_window_divergence: window_divergences.length > 0,
    status: has_reservations
      ? "RESOURCE_RESERVATION_DECLARED"
      : "NO_RESOURCE_RESERVATION_DECLARATIONS",
  };
}

export function assessInterventionResourceReservationContext(
  projectState: ProjectState,
  reservationDeclarationId: string,
  at: string
): InterventionResourceReservationContextAssessment {
  const reservation =
    projectState.intervention_resource_reservation_declarations.find(
      (entry) => entry.id === reservationDeclarationId
    );
  if (!reservation) {
    throw new Error(
      `InterventionResourceReservationDeclaration ${reservationDeclarationId} not found in project state`
    );
  }

  const resource_commitment = resolveResourceCommitment(
    projectState,
    reservation.resource_commitment_declaration_id
  );
  const resource = projectState.resource_declarations.find(
    (entry) => entry.id === resource_commitment.resource_declaration_id
  );
  if (!resource) {
    throw new Error(
      `ResourceDeclaration ${resource_commitment.resource_declaration_id} not found in project state`
    );
  }
  const commitment = resolveCommitment(
    projectState,
    resource_commitment.commitment_declaration_id
  );

  return {
    reservation,
    resource_commitment,
    resource_commitment_context: assessInterventionResourceCommitmentContext(
      projectState,
      resource_commitment.id,
      at
    ),
    resource,
    resource_assessment: assessResource(projectState, resource.id, at),
    source_relation: assessResourceReservationSourceRelation(reservation),
    reserver_committer_relation: assessResourceReserverCommitterRelation(
      reservation.reserved_by_entity_id,
      resource_commitment.resource_committer_entity_id
    ),
    reserver_resource_holder_relation: assessResourceReserverHolderRelation(
      reservation.reserved_by_entity_id,
      resource.holder_entity_id
    ),
    reserver_commitment_holder_relation:
      assessResourceReserverCommitmentHolderRelation(
        reservation.reserved_by_entity_id,
        commitment.commitment_holder_entity_id
      ),
    window_covers_at: doesResourceReservationWindowCoverAt(
      reservation.reserved_from,
      reservation.reserved_until,
      at
    ),
    model_limitations: [...RESOURCE_RESERVATION_MODEL_LIMITATIONS],
  };
}

export function getInterventionResourceReservationHistory(
  projectState: ProjectState,
  resourceCommitmentDeclarationId: string
): InterventionResourceReservationHistory {
  const resourceCommitment = resolveResourceCommitment(
    projectState,
    resourceCommitmentDeclarationId
  );
  const resource_commitment_semantic_key = resourceCommitmentSemanticKeyFor(
    projectState,
    resourceCommitment
  );
  const declarations = declarationsForSemanticResourceCommitment(
    projectState,
    resource_commitment_semantic_key
  );
  const positions = groupInterventionResourceReservationPositions(
    projectState,
    resource_commitment_semantic_key
  );

  return {
    resource_commitment_semantic_key,
    declarations,
    positions,
    scope_divergences: detectResourceReservationScopeDivergences(positions),
    amount_divergences: detectResourceReservationAmountDivergences(positions),
    window_divergences: detectResourceReservationWindowDivergences(positions),
    has_declarations: declarations.length > 0,
  };
}
