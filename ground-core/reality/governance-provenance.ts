/**
 * Reality Core v0.7 — Governance Core II provenance & contest (GROUND-020).
 *
 * Read-only assessments. Must not import state-engine / file-store / studio.
 * Provenance ≠ precedence. Contest ≠ revocation. Delegation ≠ effective Authority.
 */

import {
  assessDeclaredAuthority,
  assessDeclaredStanding,
  governanceScopeKey,
  governanceScopesEqual,
  isGovernanceDeclarationActiveAt,
} from "./governance-core.js";
import type {
  AuthorityContestAssessment,
  AuthorityDelegationAssessment,
  AuthorityGovernanceContext,
  AuthorityProvenanceAssessment,
  AuthorityProvenancePath,
  ContestStandingContext,
  ContestStandingContextEntry,
  DelegationBasisStatus,
} from "./governance-types.js";
import type {
  AuthorityContestDeclaration,
  AuthorityContestTarget,
  AuthorityDelegationDeclaration,
  AuthorityPower,
  GovernanceScope,
  ProjectState,
  StandingScope,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

export function authorityContestTargetKey(target: AuthorityContestTarget): string {
  if (target.kind === "AUTHORITY_DECLARATION") {
    return `AUTHORITY_DECLARATION|${target.authority_declaration_id}`;
  }
  return `AUTHORITY_DELEGATION|${target.authority_delegation_id}`;
}

export function authorityProvenancePathKey(
  kind: "DIRECT_DECLARATION" | "ONE_HOP_DELEGATION",
  id: string
): string {
  if (kind === "DIRECT_DECLARATION") {
    return `authority-path|direct|${id}`;
  }
  return `authority-path|delegated|${id}`;
}

function compareDelegations(
  a: AuthorityDelegationDeclaration,
  b: AuthorityDelegationDeclaration
): number {
  if (a.delegatee_entity_id !== b.delegatee_entity_id) {
    return compareIds(a.delegatee_entity_id, b.delegatee_entity_id);
  }
  if (a.delegator_entity_id !== b.delegator_entity_id) {
    return compareIds(a.delegator_entity_id, b.delegator_entity_id);
  }
  if (a.power !== b.power) {
    return a.power < b.power ? -1 : 1;
  }
  const scopeCmp = governanceScopeKey(a.scope).localeCompare(
    governanceScopeKey(b.scope)
  );
  if (scopeCmp !== 0) {
    return scopeCmp;
  }
  if (a.valid_from !== b.valid_from) {
    return a.valid_from < b.valid_from ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareContests(
  a: AuthorityContestDeclaration,
  b: AuthorityContestDeclaration
): number {
  const aKey = authorityContestTargetKey(a.target);
  const bKey = authorityContestTargetKey(b.target);
  if (aKey !== bKey) {
    return aKey < bKey ? -1 : 1;
  }
  if (a.contesting_entity_id !== b.contesting_entity_id) {
    return compareIds(a.contesting_entity_id, b.contesting_entity_id);
  }
  if (a.valid_from !== b.valid_from) {
    return a.valid_from < b.valid_from ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareProvenancePaths(
  a: AuthorityProvenancePath,
  b: AuthorityProvenancePath
): number {
  if (a.kind !== b.kind) {
    return a.kind === "DIRECT_DECLARATION" ? -1 : 1;
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function compareStandingContexts(
  a: ContestStandingContextEntry,
  b: ContestStandingContextEntry
): number {
  if (a.contest_declaration_id !== b.contest_declaration_id) {
    return compareIds(a.contest_declaration_id, b.contest_declaration_id);
  }
  return compareIds(a.contesting_entity_id, b.contesting_entity_id);
}

export function getApplicableAuthorityDelegationsToHolder(
  projectState: ProjectState,
  holderEntityId: string,
  power: AuthorityPower,
  scope: GovernanceScope,
  at: string
): AuthorityDelegationDeclaration[] {
  const scopeKey = governanceScopeKey(scope);
  return projectState.authority_delegation_declarations
    .filter(
      (entry) =>
        entry.delegatee_entity_id === holderEntityId &&
        entry.power === power &&
        governanceScopeKey(entry.scope) === scopeKey &&
        isGovernanceDeclarationActiveAt(entry, at)
    )
    .sort(compareDelegations);
}

export function assessAuthorityDelegation(
  projectState: ProjectState,
  delegationId: string,
  at: string
): AuthorityDelegationAssessment {
  const delegation = projectState.authority_delegation_declarations.find(
    (entry) => entry.id === delegationId
  );
  if (!delegation) {
    throw new Error(
      `AuthorityDelegationDeclaration ${delegationId} not found in project state`
    );
  }

  const delegation_active = isGovernanceDeclarationActiveAt(delegation, at);
  const sourceIds = sortUniqueIds(delegation.source_authority_declaration_ids);
  const active_source_authority_declaration_ids: string[] = [];
  const inactive_source_authority_declaration_ids: string[] = [];

  for (const sourceId of sourceIds) {
    const source = projectState.authority_declarations.find(
      (entry) => entry.id === sourceId
    );
    if (source && isGovernanceDeclarationActiveAt(source, at)) {
      active_source_authority_declaration_ids.push(sourceId);
    } else {
      inactive_source_authority_declaration_ids.push(sourceId);
    }
  }

  let basis_status: DelegationBasisStatus;
  if (!delegation_active) {
    basis_status = "DELEGATION_NOT_ACTIVE";
  } else if (active_source_authority_declaration_ids.length > 0) {
    basis_status = "SOURCE_DECLARED_AUTHORITY_ACTIVE";
  } else {
    basis_status = "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE";
  }

  return {
    delegation_id: delegation.id,
    delegator_entity_id: delegation.delegator_entity_id,
    delegatee_entity_id: delegation.delegatee_entity_id,
    power: delegation.power,
    scope: delegation.scope,
    at,
    delegation_active,
    source_authority_declaration_ids: sourceIds,
    active_source_authority_declaration_ids,
    inactive_source_authority_declaration_ids,
    basis_status,
    declared_by: delegation.declared_by,
  };
}

function getActiveContestsForTarget(
  projectState: ProjectState,
  target: AuthorityContestTarget,
  at: string
): AuthorityContestDeclaration[] {
  const key = authorityContestTargetKey(target);
  return projectState.authority_contest_declarations
    .filter(
      (entry) =>
        authorityContestTargetKey(entry.target) === key &&
        isGovernanceDeclarationActiveAt(entry, at)
    )
    .sort(compareContests);
}

export function getApplicableAuthorityContests(
  projectState: ProjectState,
  target: AuthorityContestTarget,
  at: string
): AuthorityContestDeclaration[] {
  return getActiveContestsForTarget(projectState, target, at);
}

function standingScopeForGovernanceScope(
  scope: GovernanceScope
): StandingScope | null {
  if (
    scope.kind === "SUBJECT_STATE" ||
    scope.kind === "INTERVENTION_DECLARATION"
  ) {
    return null;
  }
  return scope;
}

function resolveTargetScope(
  projectState: ProjectState,
  target: AuthorityContestTarget
): GovernanceScope | null {
  if (target.kind === "AUTHORITY_DECLARATION") {
    const authority = projectState.authority_declarations.find(
      (entry) => entry.id === target.authority_declaration_id
    );
    return authority?.scope ?? null;
  }
  const delegation = projectState.authority_delegation_declarations.find(
    (entry) => entry.id === target.authority_delegation_id
  );
  return delegation?.scope ?? null;
}

export function assessContestStandingContext(
  projectState: ProjectState,
  contestDeclaration: AuthorityContestDeclaration,
  at: string
): ContestStandingContextEntry {
  const scope = resolveTargetScope(projectState, contestDeclaration.target);
  if (!scope) {
    return {
      contest_declaration_id: contestDeclaration.id,
      contesting_entity_id: contestDeclaration.contesting_entity_id,
      status: "STANDING_SCOPE_NOT_MAPPABLE",
      standing_declaration_ids: [],
    };
  }

  const standingScope = standingScopeForGovernanceScope(scope);
  if (!standingScope) {
    return {
      contest_declaration_id: contestDeclaration.id,
      contesting_entity_id: contestDeclaration.contesting_entity_id,
      status: "STANDING_SCOPE_NOT_MAPPABLE",
      standing_declaration_ids: [],
    };
  }

  const standing = assessDeclaredStanding(
    projectState,
    contestDeclaration.contesting_entity_id,
    standingScope,
    at
  );

  const hasContestRight = standing.rights.includes("CONTEST");
  const status: ContestStandingContext =
    hasContestRight
      ? "DECLARED_CONTEST_STANDING_PRESENT"
      : "NO_DECLARED_CONTEST_STANDING";

  return {
    contest_declaration_id: contestDeclaration.id,
    contesting_entity_id: contestDeclaration.contesting_entity_id,
    status,
    standing_declaration_ids: hasContestRight
      ? standing.standing_declaration_ids
      : [],
  };
}

export function assessAuthorityContest(
  projectState: ProjectState,
  target: AuthorityContestTarget,
  at: string
): AuthorityContestAssessment {
  const active = getActiveContestsForTarget(projectState, target, at);
  const standing_contexts = active
    .map((entry) => assessContestStandingContext(projectState, entry, at))
    .sort(compareStandingContexts);

  return {
    target_key: authorityContestTargetKey(target),
    at,
    active_contest_declarations: active,
    contesting_entity_ids: sortUniqueIds(
      active.map((entry) => entry.contesting_entity_id)
    ),
    standing_contexts,
    has_active_contest: active.length > 0,
    has_contest_with_declared_standing: standing_contexts.some(
      (entry) => entry.status === "DECLARED_CONTEST_STANDING_PRESENT"
    ),
    has_contest_without_declared_standing: standing_contexts.some(
      (entry) =>
        entry.status === "NO_DECLARED_CONTEST_STANDING" ||
        entry.status === "STANDING_SCOPE_NOT_MAPPABLE"
    ),
  };
}

export function getAuthorityProvenancePaths(
  projectState: ProjectState,
  holderEntityId: string,
  power: AuthorityPower,
  scope: GovernanceScope,
  at: string
): AuthorityProvenancePath[] {
  const paths: AuthorityProvenancePath[] = [];
  const direct = assessDeclaredAuthority(
    projectState,
    holderEntityId,
    power,
    scope,
    at
  );

  for (const authorityId of direct.authority_declaration_ids) {
    const contests = getActiveContestsForTarget(
      projectState,
      {
        kind: "AUTHORITY_DECLARATION",
        authority_declaration_id: authorityId,
      },
      at
    );
    paths.push({
      key: authorityProvenancePathKey("DIRECT_DECLARATION", authorityId),
      kind: "DIRECT_DECLARATION",
      holder_entity_id: holderEntityId,
      power,
      scope,
      at,
      authority_declaration_ids: [authorityId],
      delegation_declaration_ids: [],
      delegator_entity_ids: [],
      source_basis_status: "DIRECT",
      contested: contests.length > 0,
      contest_declaration_ids: contests.map((entry) => entry.id),
      has_contested_source_authority: false,
      source_authority_contest_declaration_ids: [],
    });
  }

  const delegations = getApplicableAuthorityDelegationsToHolder(
    projectState,
    holderEntityId,
    power,
    scope,
    at
  );

  for (const delegation of delegations) {
    const assessment = assessAuthorityDelegation(
      projectState,
      delegation.id,
      at
    );
    const contests = getActiveContestsForTarget(
      projectState,
      {
        kind: "AUTHORITY_DELEGATION",
        authority_delegation_id: delegation.id,
      },
      at
    );

    const sourceContestIds: string[] = [];
    for (const sourceId of assessment.source_authority_declaration_ids) {
      const sourceContests = getActiveContestsForTarget(
        projectState,
        {
          kind: "AUTHORITY_DECLARATION",
          authority_declaration_id: sourceId,
        },
        at
      );
      for (const contest of sourceContests) {
        sourceContestIds.push(contest.id);
      }
    }

    const source_basis_status =
      assessment.basis_status === "SOURCE_DECLARED_AUTHORITY_ACTIVE"
        ? "SOURCE_DECLARED_AUTHORITY_ACTIVE"
        : "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE";

    paths.push({
      key: authorityProvenancePathKey("ONE_HOP_DELEGATION", delegation.id),
      kind: "ONE_HOP_DELEGATION",
      holder_entity_id: holderEntityId,
      power,
      scope,
      at,
      authority_declaration_ids: assessment.source_authority_declaration_ids,
      delegation_declaration_ids: [delegation.id],
      delegator_entity_ids: [delegation.delegator_entity_id],
      source_basis_status,
      contested: contests.length > 0,
      contest_declaration_ids: contests.map((entry) => entry.id),
      has_contested_source_authority: sourceContestIds.length > 0,
      source_authority_contest_declaration_ids: sortUniqueIds(sourceContestIds),
    });
  }

  return paths.sort(compareProvenancePaths);
}

export function assessAuthorityProvenance(
  projectState: ProjectState,
  holderEntityId: string,
  power: AuthorityPower,
  scope: GovernanceScope,
  at: string
): AuthorityProvenanceAssessment {
  const direct_authority = assessDeclaredAuthority(
    projectState,
    holderEntityId,
    power,
    scope,
    at
  );
  const applicable_delegations_to_holder = getApplicableAuthorityDelegationsToHolder(
    projectState,
    holderEntityId,
    power,
    scope,
    at
  ).map((entry) => assessAuthorityDelegation(projectState, entry.id, at));

  const provenance_paths = getAuthorityProvenancePaths(
    projectState,
    holderEntityId,
    power,
    scope,
    at
  );

  return {
    holder_entity_id: holderEntityId,
    power,
    scope,
    at,
    direct_authority,
    applicable_delegations_to_holder,
    provenance_paths,
    has_direct_declared_authority:
      direct_authority.status === "DECLARED_AUTHORITY_PRESENT",
    has_delegated_authority_claim: applicable_delegations_to_holder.length > 0,
    has_delegation_with_active_source_basis: applicable_delegations_to_holder.some(
      (entry) => entry.basis_status === "SOURCE_DECLARED_AUTHORITY_ACTIVE"
    ),
    has_delegation_without_active_source_basis:
      applicable_delegations_to_holder.some(
        (entry) =>
          entry.basis_status === "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE"
      ),
    has_contested_path: provenance_paths.some((path) => path.contested),
  };
}

export function buildAuthorityGovernanceContext(
  projectState: ProjectState,
  holderEntityId: string,
  power: AuthorityPower,
  scope: GovernanceScope,
  at: string
): AuthorityGovernanceContext {
  const provenance = assessAuthorityProvenance(
    projectState,
    holderEntityId,
    power,
    scope,
    at
  );

  // Contests at holder level: aggregate contests on all provenance path targets.
  // Prefer direct authority declarations first, then delegations — for context only.
  const directIds = provenance.direct_authority.authority_declaration_ids;
  const primaryTarget: AuthorityContestTarget | null =
    directIds.length > 0
      ? {
          kind: "AUTHORITY_DECLARATION",
          authority_declaration_id: directIds[0]!,
        }
      : provenance.applicable_delegations_to_holder.length > 0
        ? {
            kind: "AUTHORITY_DELEGATION",
            authority_delegation_id:
              provenance.applicable_delegations_to_holder[0]!.delegation_id,
          }
        : null;

  const contests = primaryTarget
    ? assessAuthorityContest(projectState, primaryTarget, at)
    : {
        target_key: "",
        at,
        active_contest_declarations: [],
        contesting_entity_ids: [],
        standing_contexts: [],
        has_active_contest: false,
        has_contest_with_declared_standing: false,
        has_contest_without_declared_standing: false,
      };

  return {
    holder_entity_id: holderEntityId,
    power,
    scope,
    at,
    provenance,
    contests,
  };
}

/** Re-export for callers that need scope equality without importing governance-core. */
export { governanceScopesEqual };
