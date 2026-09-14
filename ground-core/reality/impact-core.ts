import { canonicalValueKey } from "./semantic-equality.js";
import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Impact Core assessment (GROUND-017).
 *
 * Consumes canonical ImpactDeclaration records only.
 * Must not import state-engine / file-store.
 * No severity / magnitude / graph propagation / OPPORTUNITY.
 */

import { NotFoundError } from "../errors.js";
import type {
  ImpactDirectionConflict,
  ImpactPosition,
  ImpactScopeAssessment,
} from "./impact-types.js";
import type { NormativeFinding } from "./normative-discovery-types.js";
import type { ProspectiveRiskFinding } from "./prospective-risk-discovery-types.js";
import type {
  ImpactDeclaration,
  ProjectState,
  ReferenceCondition,
  ReferenceDeclarer,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function sortUniqueStrings(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function declarerKey(declarer: ReferenceDeclarer): string {
  return canonicalValueKey([declarer.kind, declarer.entity_id ?? "", declarer.external_id ?? "", declarer.label ?? ""]);
}

function compareDeclarations(
  a: ImpactDeclaration,
  b: ImpactDeclaration
): number {
  if (a.affected_entity_id !== b.affected_entity_id) {
    return compareIds(a.affected_entity_id, b.affected_entity_id);
  }
  if (a.dimension !== b.dimension) {
    return a.dimension < b.dimension ? -1 : 1;
  }
  if (a.direction !== b.direction) {
    return a.direction < b.direction ? -1 : 1;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function isImpactDeclarationActiveAt(
  declaration: ImpactDeclaration,
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

function findReferenceCondition(
  projectState: ProjectState,
  referenceConditionId: string
): ReferenceCondition {
  const reference = projectState.reference_conditions.find(
    (entry) =>
      entry.id === referenceConditionId &&
      entry.project_id === projectState.project.id
  );
  if (!reference) {
    throw new NotFoundError(
      `ReferenceCondition not found: ${referenceConditionId}`
    );
  }
  return reference;
}

export function getApplicableImpactDeclarations(
  projectState: ProjectState,
  referenceConditionId: string,
  at: string
): ImpactDeclaration[] {
  const reference = findReferenceCondition(projectState, referenceConditionId);
  if (reference.reference_kind !== "ACCEPTABLE") {
    return [];
  }

  return projectState.impact_declarations
    .filter(
      (entry) =>
        entry.project_id === projectState.project.id &&
        entry.basis.kind === "REFERENCE_DEVIATION" &&
        entry.basis.reference_condition_id === referenceConditionId &&
        isImpactDeclarationActiveAt(entry, at)
    )
    .slice()
    .sort(compareDeclarations);
}

function positionKey(
  affectedEntityId: string,
  dimension: string,
  direction: ImpactDeclaration["direction"]
): string {
  return [affectedEntityId, dimension, direction].join("\u0000");
}

function buildPositions(
  declarations: ImpactDeclaration[]
): ImpactPosition[] {
  const byPosition = new Map<string, ImpactDeclaration[]>();

  for (const declaration of declarations) {
    const key = positionKey(
      declaration.affected_entity_id,
      declaration.dimension,
      declaration.direction
    );
    const group = byPosition.get(key) ?? [];
    group.push(declaration);
    byPosition.set(key, group);
  }

  const positions: ImpactPosition[] = [];
  for (const group of byPosition.values()) {
    const sorted = group.slice().sort((a, b) => compareIds(a.id, b.id));
    const first = sorted[0]!;
    const declarers = sorted.map((entry) => entry.declared_by);
    const uniqueDeclarers = new Map<string, ReferenceDeclarer>();
    for (const declarer of declarers) {
      uniqueDeclarers.set(declarerKey(declarer), declarer);
    }
    positions.push({
      affected_entity_id: first.affected_entity_id,
      dimension: first.dimension,
      direction: first.direction,
      declaration_ids: sorted.map((entry) => entry.id),
      declarers: [...uniqueDeclarers.values()].sort((a, b) =>
        declarerKey(a).localeCompare(declarerKey(b))
      ),
    });
  }

  return positions.sort((a, b) => {
    if (a.affected_entity_id !== b.affected_entity_id) {
      return compareIds(a.affected_entity_id, b.affected_entity_id);
    }
    if (a.dimension !== b.dimension) {
      return a.dimension < b.dimension ? -1 : 1;
    }
    if (a.direction !== b.direction) {
      return a.direction < b.direction ? -1 : 1;
    }
    return 0;
  });
}

export function impactDirectionConflictKey(
  referenceConditionId: string,
  affectedEntityId: string,
  dimension: string,
  at: string
): string {
  return [
    "impact_dir_conflict",
    referenceConditionId,
    affectedEntityId,
    dimension,
    temporalInstantKey(at),
  ].join("|");
}

export function detectImpactDirectionConflicts(
  projectState: ProjectState,
  referenceConditionId: string,
  at: string
): ImpactDirectionConflict[] {
  const declarations = getApplicableImpactDeclarations(
    projectState,
    referenceConditionId,
    at
  );
  const byScope = new Map<string, ImpactDeclaration[]>();

  for (const declaration of declarations) {
    const scopeKey = [
      declaration.affected_entity_id,
      declaration.dimension,
    ].join("\u0000");
    const group = byScope.get(scopeKey) ?? [];
    group.push(declaration);
    byScope.set(scopeKey, group);
  }

  const conflicts: ImpactDirectionConflict[] = [];
  for (const group of byScope.values()) {
    const adverse = group.filter((entry) => entry.direction === "ADVERSE");
    const beneficial = group.filter((entry) => entry.direction === "BENEFICIAL");
    if (adverse.length === 0 || beneficial.length === 0) {
      continue;
    }
    const first = group[0]!;
    conflicts.push({
      key: impactDirectionConflictKey(
        referenceConditionId,
        first.affected_entity_id,
        first.dimension,
        at
      ),
      reference_condition_id: referenceConditionId,
      affected_entity_id: first.affected_entity_id,
      dimension: first.dimension,
      at,
      adverse_declaration_ids: adverse
        .map((entry) => entry.id)
        .sort(compareIds),
      beneficial_declaration_ids: beneficial
        .map((entry) => entry.id)
        .sort(compareIds),
    });
  }

  return conflicts.sort((a, b) => {
    if (a.affected_entity_id !== b.affected_entity_id) {
      return compareIds(a.affected_entity_id, b.affected_entity_id);
    }
    if (a.dimension !== b.dimension) {
      return a.dimension < b.dimension ? -1 : 1;
    }
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });
}

export function assessReferenceDeviationImpactScope(
  projectState: ProjectState,
  referenceConditionId: string,
  at: string
): ImpactScopeAssessment {
  const reference = findReferenceCondition(projectState, referenceConditionId);
  const applicable_declarations = getApplicableImpactDeclarations(
    projectState,
    referenceConditionId,
    at
  );
  const positions = buildPositions(applicable_declarations);
  const direction_conflicts = detectImpactDirectionConflicts(
    projectState,
    referenceConditionId,
    at
  );

  const affected_entity_ids = sortUniqueIds(
    positions.map((entry) => entry.affected_entity_id)
  );
  const adverse_affected_entity_ids = sortUniqueIds(
    positions
      .filter((entry) => entry.direction === "ADVERSE")
      .map((entry) => entry.affected_entity_id)
  );
  const beneficial_affected_entity_ids = sortUniqueIds(
    positions
      .filter((entry) => entry.direction === "BENEFICIAL")
      .map((entry) => entry.affected_entity_id)
  );
  const impact_dimensions = sortUniqueStrings(
    positions.map((entry) => entry.dimension)
  );
  const has_cross_entity_affectedness = positions.some(
    (entry) => entry.affected_entity_id !== reference.subject_id
  );

  return {
    basis_reference_condition_id: referenceConditionId,
    deviation_subject_id: reference.subject_id,
    state_kind: reference.state_kind,
    at,
    applicable_declarations,
    positions,
    direction_conflicts,
    affected_entity_ids,
    adverse_affected_entity_ids,
    beneficial_affected_entity_ids,
    impact_dimensions,
    has_declared_affectedness: applicable_declarations.length > 0,
    has_adverse_affectedness: adverse_affected_entity_ids.length > 0,
    has_beneficial_affectedness: beneficial_affected_entity_ids.length > 0,
    has_cross_entity_affectedness,
    has_direction_conflict: direction_conflicts.length > 0,
  };
}

export function assessProblemImpactScope(
  projectState: ProjectState,
  problemFinding: NormativeFinding
): ImpactScopeAssessment {
  if (problemFinding.kind !== "PROBLEM") {
    throw new Error(
      `assessProblemImpactScope requires NormativeFinding.kind = PROBLEM, got ${problemFinding.kind}`
    );
  }
  const referenceConditionId = problemFinding.reference_condition_ids[0];
  if (!referenceConditionId) {
    throw new Error("PROBLEM finding missing reference_condition_id basis");
  }
  return assessReferenceDeviationImpactScope(
    projectState,
    referenceConditionId,
    problemFinding.at
  );
}

export function assessRiskImpactScope(
  projectState: ProjectState,
  riskFinding: ProspectiveRiskFinding
): ImpactScopeAssessment {
  if (riskFinding.kind !== "RISK") {
    throw new Error(
      `assessRiskImpactScope requires ProspectiveRiskFinding.kind = RISK, got ${riskFinding.kind}`
    );
  }
  return assessReferenceDeviationImpactScope(
    projectState,
    riskFinding.reference_condition_id,
    riskFinding.projected_for
  );
}
