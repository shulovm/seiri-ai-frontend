import { canonicalValueKey } from "./semantic-equality.js";
import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Capability Core I assessment (GROUND-021).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Capability ≠ Authority / Permission / Mandate / Resource / can_execute.
 */

import type {
  CapabilityAssessment,
  CapabilityAvailabilityAssessment,
  CapabilityAvailabilityAssessmentStatus,
  CapabilityDeclarationAssessmentStatus,
  CapabilityVerificationAssessment,
  FindDeclaredCapabilitiesQuery,
} from "./capability-types.js";
import type {
  CapabilityAvailabilityDeclaration,
  CapabilityDeclaration,
  CapabilityScope,
  CapabilityVerificationDeclaration,
  ProjectState,
  ReferenceDeclarer,
} from "../types.js";

export type { FindDeclaredCapabilitiesQuery };

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function declarerKey(declarer: ReferenceDeclarer): string {
  return canonicalValueKey([declarer.kind, declarer.entity_id ?? "", declarer.external_id ?? "", declarer.label ?? ""]);
}

function sortDeclarers(declarers: ReferenceDeclarer[]): ReferenceDeclarer[] {
  return [...declarers].sort((a, b) =>
    declarerKey(a).localeCompare(declarerKey(b))
  );
}

export function capabilityScopeKey(scope: CapabilityScope): string {
  switch (scope.kind) {
    case "UNSCOPED":
      return "UNSCOPED";
    case "ENTITY":
      return `ENTITY|${scope.entity_id}`;
    case "SUBJECT_STATE":
      return `SUBJECT_STATE|${scope.subject_id}|${scope.state_kind}`;
  }
}

export function capabilityScopesEqual(
  a: CapabilityScope,
  b: CapabilityScope
): boolean {
  return capabilityScopeKey(a) === capabilityScopeKey(b);
}

export function isCapabilityDeclarationActiveAt(
  declaration: CapabilityDeclaration,
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

/** Verification interval: [verified_at, valid_until) */
export function isCapabilityVerificationActiveAt(
  declaration: CapabilityVerificationDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.verified_at, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

export function isCapabilityAvailabilityActiveAt(
  declaration: CapabilityAvailabilityDeclaration,
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

function compareCapabilityDeclarations(
  a: CapabilityDeclaration,
  b: CapabilityDeclaration
): number {
  if (a.holder_entity_id !== b.holder_entity_id) {
    return compareIds(a.holder_entity_id, b.holder_entity_id);
  }
  if (a.capability_key !== b.capability_key) {
    return a.capability_key < b.capability_key ? -1 : 1;
  }
  const scopeCmp = capabilityScopeKey(a.scope).localeCompare(
    capabilityScopeKey(b.scope)
  );
  if (scopeCmp !== 0) {
    return scopeCmp;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareVerifications(
  a: CapabilityVerificationDeclaration,
  b: CapabilityVerificationDeclaration
): number {
  if (compareTemporalInstants(a.verified_at, b.verified_at) !== 0) {
    return compareTemporalInstants(a.verified_at, b.verified_at) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareAvailabilities(
  a: CapabilityAvailabilityDeclaration,
  b: CapabilityAvailabilityDeclaration
): number {
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  if (a.status !== b.status) {
    return a.status < b.status ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function getApplicableCapabilitiesForHolder(
  projectState: ProjectState,
  holderEntityId: string,
  at: string
): CapabilityDeclaration[] {
  return projectState.capability_declarations
    .filter(
      (entry) =>
        entry.holder_entity_id === holderEntityId &&
        isCapabilityDeclarationActiveAt(entry, at)
    )
    .sort(compareCapabilityDeclarations);
}

export function findDeclaredCapabilities(
  projectState: ProjectState,
  query: FindDeclaredCapabilitiesQuery
): CapabilityDeclaration[] {
  const scopeKey = capabilityScopeKey(query.scope);
  return projectState.capability_declarations
    .filter(
      (entry) =>
        entry.holder_entity_id === query.holderEntityId &&
        entry.capability_key === query.capabilityKey &&
        capabilityScopeKey(entry.scope) === scopeKey &&
        isCapabilityDeclarationActiveAt(entry, query.at)
    )
    .sort(compareCapabilityDeclarations);
}

export function assessCapabilityVerification(
  projectState: ProjectState,
  capabilityDeclarationId: string,
  at: string
): CapabilityVerificationAssessment {
  const active = projectState.capability_verification_declarations
    .filter(
      (entry) =>
        entry.capability_declaration_id === capabilityDeclarationId &&
        isCapabilityVerificationActiveAt(entry, at)
    )
    .sort(compareVerifications);

  const evidence_ids = sortUniqueIds(
    active.flatMap((entry) => entry.evidence_ids)
  );

  return {
    capability_declaration_id: capabilityDeclarationId,
    at,
    status:
      active.length > 0
        ? "ACTIVE_VERIFICATION_PRESENT"
        : "NO_ACTIVE_VERIFICATION",
    verification_declaration_ids: active.map((entry) => entry.id),
    evidence_ids,
    verifiers: sortDeclarers(active.map((entry) => entry.verified_by)),
    has_multiple_verifications: active.length > 1,
  };
}

export function assessCapabilityAvailability(
  projectState: ProjectState,
  capabilityDeclarationId: string,
  at: string
): CapabilityAvailabilityAssessment {
  const active = projectState.capability_availability_declarations
    .filter(
      (entry) =>
        entry.capability_declaration_id === capabilityDeclarationId &&
        isCapabilityAvailabilityActiveAt(entry, at)
    )
    .sort(compareAvailabilities);

  const available_declaration_ids = active
    .filter((entry) => entry.status === "AVAILABLE")
    .map((entry) => entry.id);
  const unavailable_declaration_ids = active
    .filter((entry) => entry.status === "UNAVAILABLE")
    .map((entry) => entry.id);

  let status: CapabilityAvailabilityAssessmentStatus;
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
    capability_declaration_id: capabilityDeclarationId,
    at,
    status,
    availability_declaration_ids: active.map((entry) => entry.id),
    available_declaration_ids,
    unavailable_declaration_ids,
    declarers: sortDeclarers(active.map((entry) => entry.declared_by)),
  };
}

export function assessCapability(
  projectState: ProjectState,
  capabilityDeclarationId: string,
  at: string
): CapabilityAssessment {
  const capability = projectState.capability_declarations.find(
    (entry) => entry.id === capabilityDeclarationId
  );
  if (!capability) {
    throw new Error(
      `CapabilityDeclaration ${capabilityDeclarationId} not found in project state`
    );
  }

  const declaration_active = isCapabilityDeclarationActiveAt(capability, at);
  const declaration_status: CapabilityDeclarationAssessmentStatus =
    declaration_active
      ? "CAPABILITY_DECLARATION_ACTIVE"
      : "CAPABILITY_DECLARATION_NOT_ACTIVE";

  const verification = assessCapabilityVerification(
    projectState,
    capabilityDeclarationId,
    at
  );
  const availability = assessCapabilityAvailability(
    projectState,
    capabilityDeclarationId,
    at
  );

  const has_active_verification =
    verification.status === "ACTIVE_VERIFICATION_PRESENT";
  const has_available_declaration =
    availability.available_declaration_ids.length > 0;
  const has_unavailable_declaration =
    availability.unavailable_declaration_ids.length > 0;
  const has_contested_availability =
    availability.status === "CONTESTED_AVAILABILITY";

  const childActive =
    has_active_verification ||
    availability.status !== "NO_AVAILABILITY_DECLARATIONS";
  const has_temporal_basis_mismatch = !declaration_active && childActive;

  return {
    capability,
    at,
    declaration_status,
    verification,
    availability,
    has_active_declared_capability: declaration_active,
    has_active_verification,
    has_available_declaration,
    has_unavailable_declaration,
    has_contested_availability,
    has_temporal_basis_mismatch,
  };
}
