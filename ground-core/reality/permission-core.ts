import { canonicalValueKey } from "./semantic-equality.js";
import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Permission Core I assessment (GROUND-024).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Permission ≠ Authority / Capability / Resource / Mandate / can_execute.
 * No effective permission / winner / precedence.
 */

import type {
  DeclaredInterventionPermissionAssessment,
  DeclaredInterventionPermissionStatus,
  InterventionPermissionGovernanceAssessment,
  PermissionIssuerGovernanceContext,
} from "./permission-types.js";
import { assessDeclaredAuthority } from "./governance-core.js";
import { assessAuthorityProvenance } from "./governance-provenance.js";
import { isInterventionDeclarationActiveAt } from "./intervention-core.js";
import type {
  GovernanceScope,
  InterventionPermissionDeclaration,
  ProjectState,
  ReferenceDeclarer,
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

export function isInterventionPermissionActiveAt(
  declaration: InterventionPermissionDeclaration,
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

function comparePermissionDeclarations(
  a: InterventionPermissionDeclaration,
  b: InterventionPermissionDeclaration
): number {
  if (a.actor_entity_id !== b.actor_entity_id) {
    return compareIds(a.actor_entity_id, b.actor_entity_id);
  }
  if (a.intervention_id !== b.intervention_id) {
    return compareIds(a.intervention_id, b.intervention_id);
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  if (a.effect !== b.effect) {
    return a.effect < b.effect ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function getApplicableInterventionPermissionDeclarations(
  projectState: ProjectState,
  actorEntityId: string,
  interventionId: string,
  at: string
): InterventionPermissionDeclaration[] {
  return projectState.intervention_permission_declarations
    .filter(
      (entry) =>
        entry.actor_entity_id === actorEntityId &&
        entry.intervention_id === interventionId &&
        isInterventionPermissionActiveAt(entry, at)
    )
    .sort(comparePermissionDeclarations);
}

export function assessDeclaredInterventionPermission(
  projectState: ProjectState,
  actorEntityId: string,
  interventionId: string,
  at: string
): DeclaredInterventionPermissionAssessment {
  const active = getApplicableInterventionPermissionDeclarations(
    projectState,
    actorEntityId,
    interventionId,
    at
  );

  const permit_declaration_ids = active
    .filter((entry) => entry.effect === "PERMIT")
    .map((entry) => entry.id);
  const prohibit_declaration_ids = active
    .filter((entry) => entry.effect === "PROHIBIT")
    .map((entry) => entry.id);

  let status: DeclaredInterventionPermissionStatus;
  if (active.length === 0) {
    status = "NO_PERMISSION_DECLARATIONS";
  } else if (
    permit_declaration_ids.length > 0 &&
    prohibit_declaration_ids.length > 0
  ) {
    status = "CONTESTED_PERMISSION";
  } else if (permit_declaration_ids.length > 0) {
    status = "PERMIT_DECLARED";
  } else {
    status = "PROHIBIT_DECLARED";
  }

  const intervention = projectState.intervention_declarations.find(
    (entry) => entry.id === interventionId
  );
  const intervention_active = intervention
    ? isInterventionDeclarationActiveAt(intervention, at)
    : false;

  const has_permit_declaration = permit_declaration_ids.length > 0;
  const has_prohibit_declaration = prohibit_declaration_ids.length > 0;

  return {
    actor_entity_id: actorEntityId,
    intervention_id: interventionId,
    at,
    status,
    permission_declaration_ids: active.map((entry) => entry.id),
    permit_declaration_ids,
    prohibit_declaration_ids,
    declarers: sortDeclarers(active.map((entry) => entry.declared_by)),
    has_permit_declaration,
    has_prohibit_declaration,
    has_permission_conflict: status === "CONTESTED_PERMISSION",
    intervention_active,
    has_temporal_basis_mismatch:
      status !== "NO_PERMISSION_DECLARATIONS" && !intervention_active,
  };
}

function authorizeInterventionScope(interventionId: string): GovernanceScope {
  return {
    kind: "INTERVENTION_DECLARATION",
    intervention_id: interventionId,
  };
}

export function assessPermissionIssuerGovernance(
  projectState: ProjectState,
  permissionDeclarationId: string,
  at: string
): PermissionIssuerGovernanceContext {
  const permission = projectState.intervention_permission_declarations.find(
    (entry) => entry.id === permissionDeclarationId
  );
  if (!permission) {
    throw new Error(
      `InterventionPermissionDeclaration ${permissionDeclarationId} not found in project state`
    );
  }

  const declarer_entity_id = permission.declared_by.entity_id ?? null;
  const scope = authorizeInterventionScope(permission.intervention_id);

  if (declarer_entity_id === null) {
    const direct_authority = assessDeclaredAuthority(
      projectState,
      null,
      "AUTHORIZE_INTERVENTION",
      scope,
      at
    );
    return {
      permission_declaration_id: permissionDeclarationId,
      declarer_entity_id: null,
      direct_authority,
      authority_provenance: null,
      has_direct_declared_authority: false,
      has_delegated_authority_claim: false,
      has_contested_authority_path: false,
    };
  }

  const direct_authority = assessDeclaredAuthority(
    projectState,
    declarer_entity_id,
    "AUTHORIZE_INTERVENTION",
    scope,
    at
  );
  const authority_provenance = assessAuthorityProvenance(
    projectState,
    declarer_entity_id,
    "AUTHORIZE_INTERVENTION",
    scope,
    at
  );

  return {
    permission_declaration_id: permissionDeclarationId,
    declarer_entity_id,
    direct_authority,
    authority_provenance,
    has_direct_declared_authority:
      authority_provenance.has_direct_declared_authority,
    has_delegated_authority_claim:
      authority_provenance.has_delegated_authority_claim,
    has_contested_authority_path: authority_provenance.has_contested_path,
  };
}

export function assessInterventionPermissionGovernance(
  projectState: ProjectState,
  actorEntityId: string,
  interventionId: string,
  at: string
): InterventionPermissionGovernanceAssessment {
  const permission = assessDeclaredInterventionPermission(
    projectState,
    actorEntityId,
    interventionId,
    at
  );

  const declaration_governance_contexts = permission.permission_declaration_ids
    .map((id) => assessPermissionIssuerGovernance(projectState, id, at))
    .sort((a, b) =>
      compareIds(a.permission_declaration_id, b.permission_declaration_id)
    );

  return {
    permission,
    declaration_governance_contexts,
    has_permission_from_direct_authority_declarer:
      declaration_governance_contexts.some(
        (entry) => entry.has_direct_declared_authority
      ),
    has_permission_from_delegated_authority_claim:
      declaration_governance_contexts.some(
        (entry) => entry.has_delegated_authority_claim
      ),
    has_permission_from_declarer_without_declared_authority:
      declaration_governance_contexts.some(
        (entry) =>
          !entry.has_direct_declared_authority &&
          !entry.has_delegated_authority_claim
      ),
    has_permission_from_contested_authority_path:
      declaration_governance_contexts.some(
        (entry) => entry.has_contested_authority_path
      ),
  };
}
