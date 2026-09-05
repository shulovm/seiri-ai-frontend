import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Resource Core I assessment (GROUND-022).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Resource ≠ Capability / Authority / Permission / free_capacity / can_execute.
 */

import type {
  FindDeclaredResourcesQuery,
  ResourceAssessment,
  ResourceAvailabilityAssessment,
  ResourceAvailabilityAssessmentStatus,
  ResourceCapacityAssessment,
  ResourceCapacityAssessmentStatus,
  ResourceDeclarationAssessmentStatus,
} from "./resource-types.js";
import type {
  ProjectState,
  ReferenceDeclarer,
  ResourceAvailabilityDeclaration,
  ResourceCapacity,
  ResourceCapacityDeclaration,
  ResourceDeclaration,
  ResourceScope,
} from "../types.js";

export type { FindDeclaredResourcesQuery };

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

export function resourceScopeKey(scope: ResourceScope): string {
  switch (scope.kind) {
    case "UNSCOPED":
      return "UNSCOPED";
    case "ENTITY":
      return `ENTITY|${scope.entity_id}`;
    case "SUBJECT_STATE":
      return `SUBJECT_STATE|${scope.subject_id}|${scope.state_kind}`;
  }
}

export function resourceScopesEqual(
  a: ResourceScope,
  b: ResourceScope
): boolean {
  return resourceScopeKey(a) === resourceScopeKey(b);
}

export function resourceCapacityKey(capacity: ResourceCapacity): string {
  if (capacity.kind === "POINT") {
    return `POINT|${capacity.value}`;
  }
  return `RANGE|${capacity.min}|${capacity.max}`;
}

export function resourceCapacitiesEqual(
  a: ResourceCapacity,
  b: ResourceCapacity
): boolean {
  return resourceCapacityKey(a) === resourceCapacityKey(b);
}

export function isResourceDeclarationActiveAt(
  declaration: ResourceDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.valid_from, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

export function isResourceCapacityActiveAt(
  declaration: ResourceCapacityDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.valid_from, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

export function isResourceAvailabilityActiveAt(
  declaration: ResourceAvailabilityDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.valid_from, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

function compareResourceDeclarations(
  a: ResourceDeclaration,
  b: ResourceDeclaration
): number {
  if (a.holder_entity_id !== b.holder_entity_id) {
    return compareIds(a.holder_entity_id, b.holder_entity_id);
  }
  if (a.resource_key !== b.resource_key) {
    return a.resource_key < b.resource_key ? -1 : 1;
  }
  if (a.unit !== b.unit) {
    return a.unit < b.unit ? -1 : 1;
  }
  const scopeCmp = resourceScopeKey(a.scope).localeCompare(
    resourceScopeKey(b.scope)
  );
  if (scopeCmp !== 0) {
    return scopeCmp;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareCapacities(
  a: ResourceCapacityDeclaration,
  b: ResourceCapacityDeclaration
): number {
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  const capCmp = resourceCapacityKey(a.capacity).localeCompare(
    resourceCapacityKey(b.capacity)
  );
  if (capCmp !== 0) {
    return capCmp;
  }
  return compareIds(a.id, b.id);
}

function compareAvailabilities(
  a: ResourceAvailabilityDeclaration,
  b: ResourceAvailabilityDeclaration
): number {
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  if (a.status !== b.status) {
    return a.status < b.status ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function getApplicableResourcesForHolder(
  projectState: ProjectState,
  holderEntityId: string,
  at: string
): ResourceDeclaration[] {
  return projectState.resource_declarations
    .filter(
      (entry) =>
        entry.holder_entity_id === holderEntityId &&
        isResourceDeclarationActiveAt(entry, at)
    )
    .sort(compareResourceDeclarations);
}

export function findDeclaredResources(
  projectState: ProjectState,
  query: FindDeclaredResourcesQuery
): ResourceDeclaration[] {
  const scopeKey = resourceScopeKey(query.scope);
  return projectState.resource_declarations
    .filter(
      (entry) =>
        entry.holder_entity_id === query.holderEntityId &&
        entry.resource_key === query.resourceKey &&
        entry.unit === query.unit &&
        resourceScopeKey(entry.scope) === scopeKey &&
        isResourceDeclarationActiveAt(entry, query.at)
    )
    .sort(compareResourceDeclarations);
}

export function assessResourceCapacity(
  projectState: ProjectState,
  resourceDeclarationId: string,
  at: string
): ResourceCapacityAssessment {
  const active = projectState.resource_capacity_declarations
    .filter(
      (entry) =>
        entry.resource_declaration_id === resourceDeclarationId &&
        isResourceCapacityActiveAt(entry, at)
    )
    .sort(compareCapacities);

  const capacities = active.map((entry) => entry.capacity);
  const uniqueKeys = new Set(capacities.map(resourceCapacityKey));

  let status: ResourceCapacityAssessmentStatus;
  if (active.length === 0) {
    status = "NO_ACTIVE_CAPACITY_DECLARATIONS";
  } else {
    status = "ACTIVE_CAPACITY_DECLARATIONS_PRESENT";
  }

  return {
    resource_declaration_id: resourceDeclarationId,
    at,
    status,
    capacity_declaration_ids: active.map((entry) => entry.id),
    capacities,
    declarers: sortDeclarers(active.map((entry) => entry.declared_by)),
    has_multiple_capacity_declarations: active.length > 1,
    has_capacity_divergence: uniqueKeys.size > 1,
  };
}

export function assessResourceAvailability(
  projectState: ProjectState,
  resourceDeclarationId: string,
  at: string
): ResourceAvailabilityAssessment {
  const active = projectState.resource_availability_declarations
    .filter(
      (entry) =>
        entry.resource_declaration_id === resourceDeclarationId &&
        isResourceAvailabilityActiveAt(entry, at)
    )
    .sort(compareAvailabilities);

  const available_declaration_ids = active
    .filter((entry) => entry.status === "AVAILABLE")
    .map((entry) => entry.id);
  const unavailable_declaration_ids = active
    .filter((entry) => entry.status === "UNAVAILABLE")
    .map((entry) => entry.id);

  let status: ResourceAvailabilityAssessmentStatus;
  if (active.length === 0) {
    status = "NO_AVAILABILITY_DECLARATIONS";
  } else if (
    available_declaration_ids.length > 0 &&
    unavailable_declaration_ids.length > 0
  ) {
    status = "CONTESTED_AVAILABILITY";
  } else if (available_declaration_ids.length > 0) {
    status = "AVAILABLE_DECLARED";
  } else {
    status = "UNAVAILABLE_DECLARED";
  }

  return {
    resource_declaration_id: resourceDeclarationId,
    at,
    status,
    availability_declaration_ids: active.map((entry) => entry.id),
    available_declaration_ids,
    unavailable_declaration_ids,
    declarers: sortDeclarers(active.map((entry) => entry.declared_by)),
  };
}

export function assessResource(
  projectState: ProjectState,
  resourceDeclarationId: string,
  at: string
): ResourceAssessment {
  const resource = projectState.resource_declarations.find(
    (entry) => entry.id === resourceDeclarationId
  );
  if (!resource) {
    throw new Error(
      `ResourceDeclaration ${resourceDeclarationId} not found in project state`
    );
  }

  const declaration_active = isResourceDeclarationActiveAt(resource, at);
  const declaration_status: ResourceDeclarationAssessmentStatus =
    declaration_active
      ? "RESOURCE_DECLARATION_ACTIVE"
      : "RESOURCE_DECLARATION_NOT_ACTIVE";

  const capacity = assessResourceCapacity(
    projectState,
    resourceDeclarationId,
    at
  );
  const availability = assessResourceAvailability(
    projectState,
    resourceDeclarationId,
    at
  );

  const has_capacity_declaration =
    capacity.status === "ACTIVE_CAPACITY_DECLARATIONS_PRESENT";
  const has_available_declaration =
    availability.available_declaration_ids.length > 0;
  const has_unavailable_declaration =
    availability.unavailable_declaration_ids.length > 0;
  const has_contested_availability =
    availability.status === "CONTESTED_AVAILABILITY";

  const childActive =
    has_capacity_declaration ||
    availability.status !== "NO_AVAILABILITY_DECLARATIONS";
  const has_temporal_basis_mismatch = !declaration_active && childActive;

  return {
    resource,
    at,
    declaration_status,
    capacity,
    availability,
    has_active_resource_declaration: declaration_active,
    has_capacity_declaration,
    has_capacity_divergence: capacity.has_capacity_divergence,
    has_available_declaration,
    has_unavailable_declaration,
    has_contested_availability,
    has_temporal_basis_mismatch,
  };
}
