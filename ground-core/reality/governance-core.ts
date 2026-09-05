import { canonicalValueKey } from "./semantic-equality.js";
import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Governance Core assessment (GROUND-019).
 *
 * Read-only derived assessments over AuthorityDeclaration / StandingDeclaration /
 * MandateDeclaration. Must not import state-engine / file-store / studio.
 * Social Authority ≠ runtime ACL — no StatePatch gating.
 */

import type {
  DeclaredAuthorityAssessment,
  DeclaredStandingAssessment,
  ImpactGovernanceContext,
  MandateAssessment,
  ObjectiveGovernanceContext,
  ReferenceGovernanceContext,
} from "./governance-types.js";
import type {
  AuthorityDeclaration,
  AuthorityPower,
  GovernanceScope,
  MandateDeclaration,
  ProjectState,
  ReferenceDeclarer,
  StandingDeclaration,
  StandingRight,
  StandingScope,
} from "../types.js";

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
  return [...declarers].sort((a, b) => declarerKey(a).localeCompare(declarerKey(b)));
}

const STANDING_RIGHT_ORDER: StandingRight[] = ["CONTEST", "PARTICIPATE"];

function sortStandingRights(rights: StandingRight[]): StandingRight[] {
  return [...new Set(rights)].sort(
    (a, b) => STANDING_RIGHT_ORDER.indexOf(a) - STANDING_RIGHT_ORDER.indexOf(b)
  );
}

export function governanceScopeKey(scope: GovernanceScope | StandingScope): string {
  switch (scope.kind) {
    case "SUBJECT_STATE":
      return `SUBJECT_STATE|${scope.subject_id}|${scope.state_kind}`;
    case "REFERENCE_CONDITION":
      return `REFERENCE_CONDITION|${scope.reference_condition_id}`;
    case "REALITY_OBJECTIVE":
      return `REALITY_OBJECTIVE|${scope.objective_id}`;
    case "IMPACT_DECLARATION":
      return `IMPACT_DECLARATION|${scope.impact_declaration_id}`;
    case "INTERVENTION_DECLARATION":
      return `INTERVENTION_DECLARATION|${scope.intervention_id}`;
  }
}

export function governanceScopesEqual(
  a: GovernanceScope,
  b: GovernanceScope
): boolean {
  return governanceScopeKey(a) === governanceScopeKey(b);
}

export function standingScopesEqual(a: StandingScope, b: StandingScope): boolean {
  return governanceScopeKey(a) === governanceScopeKey(b);
}

export function isGovernanceDeclarationActiveAt(
  declaration: { valid_from: string; valid_until: string | null },
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

function compareAuthorityDeclarations(
  a: AuthorityDeclaration,
  b: AuthorityDeclaration
): number {
  if (a.holder_entity_id !== b.holder_entity_id) {
    return compareIds(a.holder_entity_id, b.holder_entity_id);
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
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareStandingDeclarations(
  a: StandingDeclaration,
  b: StandingDeclaration
): number {
  if (a.holder_entity_id !== b.holder_entity_id) {
    return compareIds(a.holder_entity_id, b.holder_entity_id);
  }
  const scopeCmp = governanceScopeKey(a.scope).localeCompare(
    governanceScopeKey(b.scope)
  );
  if (scopeCmp !== 0) {
    return scopeCmp;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareMandateDeclarations(
  a: MandateDeclaration,
  b: MandateDeclaration
): number {
  if (a.objective_id !== b.objective_id) {
    return compareIds(a.objective_id, b.objective_id);
  }
  if (a.holder_entity_id !== b.holder_entity_id) {
    return compareIds(a.holder_entity_id, b.holder_entity_id);
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function getApplicableAuthorityDeclarations(
  projectState: ProjectState,
  holderEntityId: string,
  power: AuthorityPower,
  scope: GovernanceScope,
  at: string
): AuthorityDeclaration[] {
  const scopeKey = governanceScopeKey(scope);
  return projectState.authority_declarations
    .filter(
      (entry) =>
        entry.holder_entity_id === holderEntityId &&
        entry.power === power &&
        governanceScopeKey(entry.scope) === scopeKey &&
        isGovernanceDeclarationActiveAt(entry, at)
    )
    .sort(compareAuthorityDeclarations);
}

export function getAuthorityHolderIdsForScope(
  projectState: ProjectState,
  power: AuthorityPower,
  scope: GovernanceScope,
  at: string
): string[] {
  const scopeKey = governanceScopeKey(scope);
  const holderIds = projectState.authority_declarations
    .filter(
      (entry) =>
        entry.power === power &&
        governanceScopeKey(entry.scope) === scopeKey &&
        isGovernanceDeclarationActiveAt(entry, at)
    )
    .map((entry) => entry.holder_entity_id);
  return sortUniqueIds(holderIds);
}

export function hasMultipleAuthorityHolders(
  projectState: ProjectState,
  power: AuthorityPower,
  scope: GovernanceScope,
  at: string
): boolean {
  return getAuthorityHolderIdsForScope(projectState, power, scope, at).length > 1;
}

export function assessDeclaredAuthority(
  projectState: ProjectState,
  holderEntityId: string | null,
  power: AuthorityPower,
  scope: GovernanceScope,
  at: string
): DeclaredAuthorityAssessment {
  if (holderEntityId === null) {
    return {
      holder_entity_id: null,
      power,
      scope,
      at,
      status: "DECLARER_NOT_ENTITY",
      authority_declaration_ids: [],
      declarers: [],
      has_multiple_declarations: false,
    };
  }

  const applicable = getApplicableAuthorityDeclarations(
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
    status:
      applicable.length > 0
        ? "DECLARED_AUTHORITY_PRESENT"
        : "NO_DECLARED_AUTHORITY",
    authority_declaration_ids: applicable.map((entry) => entry.id),
    declarers: sortDeclarers(applicable.map((entry) => entry.declared_by)),
    has_multiple_declarations: applicable.length > 1,
  };
}

export function assessReferenceDeclarationAuthority(
  projectState: ProjectState,
  referenceConditionId: string,
  at: string
): DeclaredAuthorityAssessment {
  const reference = projectState.reference_conditions.find(
    (entry) => entry.id === referenceConditionId
  );
  if (!reference) {
    throw new Error(
      `ReferenceCondition ${referenceConditionId} not found in project state`
    );
  }

  const holderEntityId = reference.declared_by.entity_id ?? null;
  const scope: GovernanceScope = {
    kind: "SUBJECT_STATE",
    subject_id: reference.subject_id,
    state_kind: reference.state_kind,
  };

  return assessDeclaredAuthority(
    projectState,
    holderEntityId,
    "ESTABLISH_REFERENCE",
    scope,
    at
  );
}

export function assessObjectiveDeclarationAuthority(
  projectState: ProjectState,
  objectiveId: string,
  at: string
): DeclaredAuthorityAssessment {
  const objective = projectState.reality_objectives.find(
    (entry) => entry.id === objectiveId
  );
  if (!objective) {
    throw new Error(`RealityObjective ${objectiveId} not found in project state`);
  }

  const holderEntityId = objective.declared_by.entity_id ?? null;
  const scope: GovernanceScope = {
    kind: "REALITY_OBJECTIVE",
    objective_id: objectiveId,
  };

  return assessDeclaredAuthority(
    projectState,
    holderEntityId,
    "GOVERN_OBJECTIVE",
    scope,
    at
  );
}

export function assessImpactDeclarationAuthority(
  projectState: ProjectState,
  impactDeclarationId: string,
  at: string
): DeclaredAuthorityAssessment {
  const impact = projectState.impact_declarations.find(
    (entry) => entry.id === impactDeclarationId
  );
  if (!impact) {
    throw new Error(
      `ImpactDeclaration ${impactDeclarationId} not found in project state`
    );
  }

  const holderEntityId = impact.declared_by.entity_id ?? null;
  const scope: GovernanceScope = {
    kind: "REFERENCE_CONDITION",
    reference_condition_id: impact.basis.reference_condition_id,
  };

  return assessDeclaredAuthority(
    projectState,
    holderEntityId,
    "DECLARE_IMPACT",
    scope,
    at
  );
}

export function assessImpactMeasureDeclarationAuthority(
  projectState: ProjectState,
  impactMeasureDeclarationId: string,
  at: string
): DeclaredAuthorityAssessment {
  const measure = projectState.impact_measure_declarations.find(
    (entry) => entry.id === impactMeasureDeclarationId
  );
  if (!measure) {
    throw new Error(
      `ImpactMeasureDeclaration ${impactMeasureDeclarationId} not found in project state`
    );
  }

  const holderEntityId = measure.declared_by.entity_id ?? null;
  const scope: GovernanceScope = {
    kind: "IMPACT_DECLARATION",
    impact_declaration_id: measure.impact_declaration_id,
  };

  return assessDeclaredAuthority(
    projectState,
    holderEntityId,
    "DECLARE_IMPACT_MEASURE",
    scope,
    at
  );
}

export function getApplicableStandingDeclarations(
  projectState: ProjectState,
  holderEntityId: string,
  scope: StandingScope,
  at: string
): StandingDeclaration[] {
  const scopeKey = governanceScopeKey(scope);
  return projectState.standing_declarations
    .filter(
      (entry) =>
        entry.holder_entity_id === holderEntityId &&
        governanceScopeKey(entry.scope) === scopeKey &&
        isGovernanceDeclarationActiveAt(entry, at)
    )
    .sort(compareStandingDeclarations);
}

export function assessDeclaredStanding(
  projectState: ProjectState,
  holderEntityId: string,
  scope: StandingScope,
  at: string
): DeclaredStandingAssessment {
  const applicable = getApplicableStandingDeclarations(
    projectState,
    holderEntityId,
    scope,
    at
  );

  const mergedRights = sortStandingRights(
    applicable.flatMap((entry) => entry.rights)
  );

  return {
    holder_entity_id: holderEntityId,
    scope,
    at,
    rights: mergedRights,
    standing_declaration_ids: applicable.map((entry) => entry.id),
    status:
      applicable.length > 0
        ? "DECLARED_STANDING_PRESENT"
        : "NO_DECLARED_STANDING",
  };
}

export function getActiveMandateDeclarations(
  projectState: ProjectState,
  holderEntityId: string,
  objectiveId: string,
  at: string
): MandateDeclaration[] {
  return projectState.mandate_declarations
    .filter(
      (entry) =>
        entry.holder_entity_id === holderEntityId &&
        entry.objective_id === objectiveId &&
        entry.kind === "PURSUE_OBJECTIVE" &&
        isGovernanceDeclarationActiveAt(entry, at)
    )
    .sort(compareMandateDeclarations);
}

export function assessMandate(
  projectState: ProjectState,
  holderEntityId: string,
  objectiveId: string,
  at: string
): MandateAssessment {
  const active = getActiveMandateDeclarations(
    projectState,
    holderEntityId,
    objectiveId,
    at
  );

  return {
    holder_entity_id: holderEntityId,
    objective_id: objectiveId,
    at,
    active_mandate_ids: active.map((entry) => entry.id),
    status:
      active.length > 0 ? "ACTIVE_MANDATE_PRESENT" : "NO_ACTIVE_MANDATE",
    declarers: sortDeclarers(active.map((entry) => entry.declared_by)),
  };
}

export function buildObjectiveGovernanceContext(
  projectState: ProjectState,
  objectiveId: string,
  at: string
): ObjectiveGovernanceContext {
  const standingScope: StandingScope = {
    kind: "REALITY_OBJECTIVE",
    objective_id: objectiveId,
  };

  const standingHolders = sortUniqueIds(
    projectState.standing_declarations
      .filter(
        (entry) =>
          entry.scope.kind === "REALITY_OBJECTIVE" &&
          entry.scope.objective_id === objectiveId &&
          isGovernanceDeclarationActiveAt(entry, at)
      )
      .map((entry) => entry.holder_entity_id)
  );

  const mandateHolders = sortUniqueIds(
    projectState.mandate_declarations
      .filter(
        (entry) =>
          entry.objective_id === objectiveId &&
          isGovernanceDeclarationActiveAt(entry, at)
      )
      .map((entry) => entry.holder_entity_id)
  );

  return {
    objective_id: objectiveId,
    at,
    objective_declarer_authority: assessObjectiveDeclarationAuthority(
      projectState,
      objectiveId,
      at
    ),
    mandate_holder_ids: mandateHolders,
    mandates: mandateHolders.map((holderId) =>
      assessMandate(projectState, holderId, objectiveId, at)
    ),
    standing: standingHolders.map((holderId) =>
      assessDeclaredStanding(projectState, holderId, standingScope, at)
    ),
  };
}

export function buildReferenceGovernanceContext(
  projectState: ProjectState,
  referenceConditionId: string,
  at: string
): ReferenceGovernanceContext {
  const standingScope: StandingScope = {
    kind: "REFERENCE_CONDITION",
    reference_condition_id: referenceConditionId,
  };

  const standingHolders = sortUniqueIds(
    projectState.standing_declarations
      .filter(
        (entry) =>
          entry.scope.kind === "REFERENCE_CONDITION" &&
          entry.scope.reference_condition_id === referenceConditionId &&
          isGovernanceDeclarationActiveAt(entry, at)
      )
      .map((entry) => entry.holder_entity_id)
  );

  return {
    reference_condition_id: referenceConditionId,
    at,
    declarer_authority: assessReferenceDeclarationAuthority(
      projectState,
      referenceConditionId,
      at
    ),
    standing_holders: standingHolders.map((holderId) =>
      assessDeclaredStanding(projectState, holderId, standingScope, at)
    ),
  };
}

export function buildImpactGovernanceContext(
  projectState: ProjectState,
  impactDeclarationId: string,
  at: string
): ImpactGovernanceContext {
  const standingScope: StandingScope = {
    kind: "IMPACT_DECLARATION",
    impact_declaration_id: impactDeclarationId,
  };

  const standingHolders = sortUniqueIds(
    projectState.standing_declarations
      .filter(
        (entry) =>
          entry.scope.kind === "IMPACT_DECLARATION" &&
          entry.scope.impact_declaration_id === impactDeclarationId &&
          isGovernanceDeclarationActiveAt(entry, at)
      )
      .map((entry) => entry.holder_entity_id)
  );

  const measureDeclarerIds = sortUniqueIds(
    projectState.impact_measure_declarations
      .filter((entry) => entry.impact_declaration_id === impactDeclarationId)
      .map((entry) => entry.id)
  );

  return {
    impact_declaration_id: impactDeclarationId,
    at,
    impact_declarer_authority: assessImpactDeclarationAuthority(
      projectState,
      impactDeclarationId,
      at
    ),
    measure_declarer_authorities: measureDeclarerIds.map((measureId) =>
      assessImpactMeasureDeclarationAuthority(projectState, measureId, at)
    ),
    standing_holders: standingHolders.map((holderId) =>
      assessDeclaredStanding(projectState, holderId, standingScope, at)
    ),
  };
}
