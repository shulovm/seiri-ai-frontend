import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Reference State assessment (GROUND-011).
 *
 * Current = ontic RealityState only (via Worldline queries).
 * Must not import state-engine / file-store.
 * Must not use Claim/Belief as Current fallback.
 * DEVIATES ≠ PROBLEM.
 */

import { NotFoundError } from "../errors.js";
import {
  compareValueToCriterion,
  criteriaAreCompatible,
  type ReferenceComparisonResult,
} from "./reference-criterion.js";
import { canonicalValueKey } from "./semantic-equality.js";
import { getRealityStatesAt } from "./worldline.js";
import type {
  CurrentStateAssessment,
  ReferenceComparison,
  ReferenceConflict,
  ReferenceStateAssessment,
  ReferenceStateQuery,
} from "./reference-types.js";
import type {
  ProjectState,
  ReferenceCondition,
  ReferenceKind,
  RealityStateValue,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isReferenceConditionActiveAt(
  ref: ReferenceCondition,
  at: string
): boolean {
  if (compareTemporalInstants(ref.valid_from, at) > 0) {
    return false;
  }
  if (ref.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, ref.valid_until) < 0;
}

export function getReferenceConditionsAt(
  projectState: ProjectState,
  subjectId: string,
  stateKind: string,
  at: string
): ReferenceCondition[] {
  const projectId = projectState.project.id;
  return projectState.reference_conditions
    .filter(
      (ref) =>
        ref.project_id === projectId &&
        ref.subject_id === subjectId &&
        ref.state_kind === stateKind &&
        isReferenceConditionActiveAt(ref, at)
    )
    .slice()
    .sort((a, b) => {
      if (a.reference_kind !== b.reference_kind) {
        return a.reference_kind < b.reference_kind ? -1 : 1;
      }
      if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
        return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
      }
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
}

function groupSemanticValues(
  states: Array<{ value: RealityStateValue }>
): RealityStateValue[] {
  const byKey = new Map<string, RealityStateValue>();
  for (const state of states) {
    byKey.set(canonicalValueKey(state.value), state.value);
  }
  return [...byKey.values()].sort((a, b) =>
    canonicalValueKey(a) < canonicalValueKey(b) ? -1 : 1
  );
}

export function assessCurrentStateAt(
  projectState: ProjectState,
  subjectId: string,
  stateKind: string,
  at: string
): CurrentStateAssessment {
  const active_states = getRealityStatesAt(projectState, subjectId, at)
    .filter((state) => state.kind === stateKind)
    .slice()
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const semantic_values = groupSemanticValues(active_states);

  let status: CurrentStateAssessment["status"];
  if (semantic_values.length === 0) {
    status = "NO_CURRENT_STATE";
  } else if (semantic_values.length === 1) {
    status = "SINGLE_VALUE";
  } else {
    status = "CONFLICTED";
  }

  return {
    subject_id: subjectId,
    state_kind: stateKind,
    at,
    active_states,
    semantic_values,
    status,
  };
}

export function compareCurrentToReference(
  currentAssessment: CurrentStateAssessment,
  referenceCondition: ReferenceCondition
): ReferenceComparison {
  let result: ReferenceComparisonResult;
  let current_value: RealityStateValue | null = null;

  if (currentAssessment.status === "NO_CURRENT_STATE") {
    result = "NO_CURRENT_STATE";
  } else if (currentAssessment.status === "CONFLICTED") {
    result = "CURRENT_CONFLICTED";
  } else {
    current_value = currentAssessment.semantic_values[0] ?? null;
    result = compareValueToCriterion(current_value, referenceCondition.criterion);
  }

  return {
    reference_condition_id: referenceCondition.id,
    reference_kind: referenceCondition.reference_kind,
    current_status: currentAssessment.status,
    current_value,
    criterion: referenceCondition.criterion,
    result,
  };
}

function conflictKey(
  subjectId: string,
  stateKind: string,
  referenceKind: ReferenceKind,
  at: string,
  ids: string[]
): string {
  return [
    "ref_conflict",
    subjectId,
    stateKind,
    referenceKind,
    temporalInstantKey(at),
    ...ids.slice().sort(),
  ].join("|");
}

export function detectReferenceConflicts(
  references: ReferenceCondition[],
  at: string
): ReferenceConflict[] {
  const conflicts: ReferenceConflict[] = [];
  const byScope = new Map<string, ReferenceCondition[]>();

  for (const ref of references) {
    if (!isReferenceConditionActiveAt(ref, at)) {
      continue;
    }
    const scopeKey = [
      ref.subject_id,
      ref.state_kind,
      ref.reference_kind,
    ].join("\u0000");
    const group = byScope.get(scopeKey) ?? [];
    group.push(ref);
    byScope.set(scopeKey, group);
  }

  for (const group of byScope.values()) {
    if (group.length < 2) {
      continue;
    }
    const sorted = group.slice().sort((a, b) => compareIds(a.id, b.id));

    for (let i = 0; i < sorted.length; i += 1) {
      for (let j = i + 1; j < sorted.length; j += 1) {
        const a = sorted[i]!;
        const b = sorted[j]!;
        const compatibility = criteriaAreCompatible(a.criterion, b.criterion);
        if (compatibility === "COMPATIBLE") {
          continue;
        }
        if (compatibility === "UNSUPPORTED") {
          conflicts.push({
            key: conflictKey(
              a.subject_id,
              a.state_kind,
              a.reference_kind,
              at,
              [a.id, b.id]
            ),
            subject_id: a.subject_id,
            state_kind: a.state_kind,
            reference_kind: a.reference_kind,
            at,
            reference_condition_ids: [a.id, b.id].sort(),
            conflict_kind: "UNSUPPORTED_COMPARISON",
            note: "Reference criteria cannot be safely compared for compatibility.",
          });
          continue;
        }
        conflicts.push({
          key: conflictKey(
            a.subject_id,
            a.state_kind,
            a.reference_kind,
            at,
            [a.id, b.id]
          ),
          subject_id: a.subject_id,
          state_kind: a.state_kind,
          reference_kind: a.reference_kind,
          at,
          reference_condition_ids: [a.id, b.id].sort(),
          conflict_kind: "CRITERION_INCOMPATIBLE",
          note: "Semantically incompatible ReferenceConditions for the same scope. No winner.",
        });
      }
    }
  }

  return conflicts.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

export function assessReferenceStateAt(
  projectState: ProjectState,
  query: ReferenceStateQuery
): ReferenceStateAssessment {
  const entity = projectState.reality_entities.find(
    (entry) =>
      entry.id === query.subjectId &&
      entry.project_id === projectState.project.id
  );
  if (!entity) {
    throw new NotFoundError(`RealityEntity not found: ${query.subjectId}`);
  }

  const current = assessCurrentStateAt(
    projectState,
    query.subjectId,
    query.stateKind,
    query.at
  );
  const applicable_references = getReferenceConditionsAt(
    projectState,
    query.subjectId,
    query.stateKind,
    query.at
  );
  const comparisons = applicable_references.map((ref) =>
    compareCurrentToReference(current, ref)
  );
  const reference_conflicts = detectReferenceConflicts(
    applicable_references,
    query.at
  );

  const has_deviation = comparisons.some((c) => c.result === "DEVIATES");
  const has_reference_conflict = reference_conflicts.some(
    (c) => c.conflict_kind === "CRITERION_INCOMPATIBLE"
  );

  return {
    subject_id: query.subjectId,
    state_kind: query.stateKind,
    at: query.at,
    current,
    applicable_references,
    comparisons,
    reference_conflicts,
    has_deviation,
    has_reference_conflict,
  };
}
