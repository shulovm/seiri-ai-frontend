/**
 * Reality Core v0.7 — Prospective Core assessment (GROUND-015).
 *
 * Consumes GROUND-011 criterion comparison only.
 * Must not import state-engine / file-store.
 * No RISK / OPPORTUNITY / probability fusion / Reality mutation.
 */

import { NotFoundError } from "../errors.js";
import { compareValueToCriterion } from "./reference-criterion.js";
import {
  detectReferenceConflicts,
  getReferenceConditionsAt,
} from "./reference-state.js";
import { canonicalValueKey } from "./semantic-equality.js";
import type {
  FutureScenarioAssessment,
  ProjectedReferenceComparison,
  ProjectedReferenceComparisonResult,
  ProjectedReferenceFinding,
  ProjectedReferenceFindingKind,
  ScenarioLikelihoodAssessment,
  ScenarioProjectionConflict,
  ScenarioReferenceAssessment,
} from "./prospective-types.js";
import type {
  FutureScenario,
  ProjectState,
  ReferenceKind,
  ScenarioLikelihoodEstimate,
  ScenarioStateProjection,
} from "../types.js";

const FINDING_KIND_ORDER: Record<ProjectedReferenceFindingKind, number> = {
  PROJECTED_ACCEPTABLE_DEVIATION: 0,
  PROJECTED_REFERENCE_CONFLICT: 1,
  PROJECTED_UNSUPPORTED_COMPARISON: 2,
  PROJECTED_EXPECTED_DEVIATION: 3,
  PROJECTED_DESIRED_GAP: 4,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareProjections(a: ScenarioStateProjection, b: ScenarioStateProjection): number {
  if (a.projected_for !== b.projected_for) {
    return a.projected_for < b.projected_for ? -1 : 1;
  }
  if (a.subject_id !== b.subject_id) {
    return compareIds(a.subject_id, b.subject_id);
  }
  if (a.state_kind !== b.state_kind) {
    return a.state_kind < b.state_kind ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareLikelihoodEstimates(
  a: ScenarioLikelihoodEstimate,
  b: ScenarioLikelihoodEstimate
): number {
  if (a.estimated_at !== b.estimated_at) {
    return a.estimated_at < b.estimated_at ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareFindings(
  a: ProjectedReferenceFinding,
  b: ProjectedReferenceFinding
): number {
  const kindDiff = FINDING_KIND_ORDER[a.kind] - FINDING_KIND_ORDER[b.kind];
  if (kindDiff !== 0) {
    return kindDiff;
  }
  if (a.projected_for !== b.projected_for) {
    return a.projected_for < b.projected_for ? -1 : 1;
  }
  if (a.subject_id !== b.subject_id) {
    return compareIds(a.subject_id, b.subject_id);
  }
  if (a.state_kind !== b.state_kind) {
    return a.state_kind < b.state_kind ? -1 : 1;
  }
  const refA = a.reference_kind ?? "";
  const refB = b.reference_kind ?? "";
  if (refA !== refB) {
    return refA < refB ? -1 : 1;
  }
  const idsA = a.reference_condition_ids.join(",");
  const idsB = b.reference_condition_ids.join(",");
  if (idsA !== idsB) {
    return idsA < idsB ? -1 : 1;
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function dedupeFindings(
  findings: ProjectedReferenceFinding[]
): ProjectedReferenceFinding[] {
  const byKey = new Map<string, ProjectedReferenceFinding>();
  for (const finding of findings) {
    byKey.set(finding.key, finding);
  }
  return [...byKey.values()].sort(compareFindings);
}

function mapComparisonResult(
  result: string
): ProjectedReferenceComparisonResult {
  if (result === "MATCH" || result === "DEVIATES") {
    return result;
  }
  return "UNSUPPORTED_COMPARISON";
}

function findingKindForComparison(
  referenceKind: ReferenceKind,
  result: ProjectedReferenceComparisonResult
): ProjectedReferenceFindingKind | null {
  if (result === "MATCH") {
    return null;
  }
  if (result === "UNSUPPORTED_COMPARISON") {
    return "PROJECTED_UNSUPPORTED_COMPARISON";
  }
  if (referenceKind === "ACCEPTABLE") {
    return "PROJECTED_ACCEPTABLE_DEVIATION";
  }
  if (referenceKind === "EXPECTED") {
    return "PROJECTED_EXPECTED_DEVIATION";
  }
  return "PROJECTED_DESIRED_GAP";
}

function projectionConflictKey(
  scenarioId: string,
  subjectId: string,
  stateKind: string,
  projectedFor: string,
  projectionIds: string[]
): string {
  return [
    "proj_conflict",
    scenarioId,
    subjectId,
    stateKind,
    projectedFor,
    ...projectionIds.slice().sort(),
  ].join("|");
}

function projectedFindingKey(
  kind: ProjectedReferenceFindingKind,
  scenarioId: string,
  projectionId: string,
  referenceId: string | null,
  conflictKey?: string
): string {
  if (kind === "PROJECTED_REFERENCE_CONFLICT" && conflictKey) {
    return ["proj", kind, scenarioId, projectionId, conflictKey].join("|");
  }
  return ["proj", kind, scenarioId, projectionId, referenceId ?? "none"].join(
    "|"
  );
}

export function getFutureScenario(
  projectState: ProjectState,
  scenarioId: string
): FutureScenario {
  const scenario = projectState.future_scenarios.find(
    (entry) =>
      entry.id === scenarioId && entry.project_id === projectState.project.id
  );
  if (!scenario) {
    throw new NotFoundError(`FutureScenario not found: ${scenarioId}`);
  }
  return scenario;
}

export function getScenarioProjections(
  projectState: ProjectState,
  scenarioId: string
): ScenarioStateProjection[] {
  getFutureScenario(projectState, scenarioId);
  return projectState.scenario_state_projections
    .filter(
      (entry) =>
        entry.project_id === projectState.project.id &&
        entry.scenario_id === scenarioId
    )
    .slice()
    .sort(compareProjections);
}

export function getScenarioLikelihoodEstimates(
  projectState: ProjectState,
  scenarioId: string
): ScenarioLikelihoodEstimate[] {
  getFutureScenario(projectState, scenarioId);
  return projectState.scenario_likelihood_estimates
    .filter(
      (entry) =>
        entry.project_id === projectState.project.id &&
        entry.scenario_id === scenarioId
    )
    .slice()
    .sort(compareLikelihoodEstimates);
}

export function detectScenarioProjectionConflicts(
  projectState: ProjectState,
  scenarioId: string
): ScenarioProjectionConflict[] {
  const projections = getScenarioProjections(projectState, scenarioId);
  const byScope = new Map<string, ScenarioStateProjection[]>();

  for (const projection of projections) {
    const scopeKey = [
      projection.subject_id,
      projection.state_kind,
      projection.projected_for,
    ].join("\u0000");
    const group = byScope.get(scopeKey) ?? [];
    group.push(projection);
    byScope.set(scopeKey, group);
  }

  const conflicts: ScenarioProjectionConflict[] = [];
  for (const group of byScope.values()) {
    const valueKeys = new Set<string>();
    for (const projection of group) {
      valueKeys.add(canonicalValueKey(projection.projected_value));
    }
    if (valueKeys.size < 2) {
      continue;
    }
    const sorted = group.slice().sort((a, b) => compareIds(a.id, b.id));
    const projection_ids = sorted.map((entry) => entry.id);
    const first = sorted[0]!;
    conflicts.push({
      key: projectionConflictKey(
        scenarioId,
        first.subject_id,
        first.state_kind,
        first.projected_for,
        projection_ids
      ),
      scenario_id: scenarioId,
      subject_id: first.subject_id,
      state_kind: first.state_kind,
      projected_for: first.projected_for,
      projection_ids,
      value_keys: [...valueKeys].sort(),
    });
  }

  return conflicts.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

export function assessScenarioLikelihood(
  projectState: ProjectState,
  scenarioId: string
): ScenarioLikelihoodAssessment {
  const estimates = getScenarioLikelihoodEstimates(projectState, scenarioId);
  const probability_values = estimates
    .map((entry) => entry.probability)
    .slice()
    .sort((a, b) => a - b);

  const distinctValues = new Set(probability_values);
  const source_summary = estimates
    .map((entry) => {
      const label =
        entry.estimated_by.label ??
        entry.estimated_by.kind +
          (entry.estimated_by.entity_id
            ? `:${entry.estimated_by.entity_id}`
            : "");
      return `${label}=${entry.probability}`;
    })
    .sort();

  return {
    scenario_id: scenarioId,
    estimates,
    status: estimates.length === 0 ? "NO_ESTIMATES" : "ESTIMATED",
    probability_values,
    min_probability:
      probability_values.length === 0 ? null : probability_values[0]!,
    max_probability:
      probability_values.length === 0
        ? null
        : probability_values[probability_values.length - 1]!,
    has_multiple_values: distinctValues.size > 1,
    source_summary,
  };
}

function referenceIdInConflict(
  referenceId: string,
  referenceKind: ReferenceKind,
  conflicts: ReturnType<typeof detectReferenceConflicts>
): boolean {
  return conflicts.some(
    (conflict) =>
      conflict.reference_kind === referenceKind &&
      conflict.conflict_kind === "CRITERION_INCOMPATIBLE" &&
      conflict.reference_condition_ids.includes(referenceId)
  );
}

export function assessScenarioReferences(
  projectState: ProjectState,
  scenarioId: string
): ScenarioReferenceAssessment {
  const projections = getScenarioProjections(projectState, scenarioId);
  const projection_conflicts = detectScenarioProjectionConflicts(
    projectState,
    scenarioId
  );
  const projected_reference_comparisons: ProjectedReferenceComparison[] = [];
  const findings: ProjectedReferenceFinding[] = [];
  const emittedConflictKeys = new Set<string>();

  for (const projection of projections) {
    const applicable = getReferenceConditionsAt(
      projectState,
      projection.subject_id,
      projection.state_kind,
      projection.projected_for
    );
    const reference_conflicts = detectReferenceConflicts(
      applicable,
      projection.projected_for
    );
    const valueKey = canonicalValueKey(projection.projected_value);

    for (const conflict of reference_conflicts) {
      if (conflict.conflict_kind !== "CRITERION_INCOMPATIBLE") {
        continue;
      }
      const conflictEmitKey = `${projection.id}|${conflict.key}`;
      if (emittedConflictKeys.has(conflictEmitKey)) {
        continue;
      }
      emittedConflictKeys.add(conflictEmitKey);
      findings.push({
        key: projectedFindingKey(
          "PROJECTED_REFERENCE_CONFLICT",
          scenarioId,
          projection.id,
          null,
          conflict.key
        ),
        kind: "PROJECTED_REFERENCE_CONFLICT",
        scenario_id: scenarioId,
        projection_id: projection.id,
        subject_id: projection.subject_id,
        state_kind: projection.state_kind,
        projected_for: projection.projected_for,
        reference_condition_ids: conflict.reference_condition_ids.slice().sort(),
        reference_kind: conflict.reference_kind,
        projected_value_key: valueKey,
        comparison_results: [],
        reference_basis_contested: true,
        reference_conflict_key: conflict.key,
      });
    }

    for (const ref of applicable) {
      const raw = compareValueToCriterion(
        projection.projected_value,
        ref.criterion
      );
      const result = mapComparisonResult(raw);
      projected_reference_comparisons.push({
        scenario_id: scenarioId,
        projection_id: projection.id,
        subject_id: projection.subject_id,
        state_kind: projection.state_kind,
        projected_for: projection.projected_for,
        reference_condition_id: ref.id,
        reference_kind: ref.reference_kind,
        projected_value_key: valueKey,
        result,
      });

      const kind = findingKindForComparison(ref.reference_kind, result);
      if (!kind) {
        continue;
      }

      const contested = referenceIdInConflict(
        ref.id,
        ref.reference_kind,
        reference_conflicts
      );

      findings.push({
        key: projectedFindingKey(kind, scenarioId, projection.id, ref.id),
        kind,
        scenario_id: scenarioId,
        projection_id: projection.id,
        subject_id: projection.subject_id,
        state_kind: projection.state_kind,
        projected_for: projection.projected_for,
        reference_condition_ids: [ref.id],
        reference_kind: ref.reference_kind,
        projected_value_key: valueKey,
        comparison_results: [result],
        reference_basis_contested: contested,
      });
    }
  }

  const sortedComparisons = projected_reference_comparisons.sort((a, b) => {
    if (a.projected_for !== b.projected_for) {
      return a.projected_for < b.projected_for ? -1 : 1;
    }
    if (a.subject_id !== b.subject_id) {
      return compareIds(a.subject_id, b.subject_id);
    }
    if (a.state_kind !== b.state_kind) {
      return a.state_kind < b.state_kind ? -1 : 1;
    }
    if (a.reference_kind !== b.reference_kind) {
      return a.reference_kind < b.reference_kind ? -1 : 1;
    }
    return compareIds(a.reference_condition_id, b.reference_condition_id);
  });

  const sortedFindings = dedupeFindings(findings);

  return {
    scenario_id: scenarioId,
    projection_assessments: projections,
    projected_reference_comparisons: sortedComparisons,
    projected_reference_findings: sortedFindings,
    projection_conflicts,
    has_projected_acceptable_deviation: sortedFindings.some(
      (f) => f.kind === "PROJECTED_ACCEPTABLE_DEVIATION"
    ),
    has_reference_conflict: sortedFindings.some(
      (f) => f.kind === "PROJECTED_REFERENCE_CONFLICT"
    ),
    has_projection_conflict: projection_conflicts.length > 0,
    has_unsupported_comparison: sortedFindings.some(
      (f) => f.kind === "PROJECTED_UNSUPPORTED_COMPARISON"
    ),
  };
}

export function assessFutureScenario(
  projectState: ProjectState,
  scenarioId: string
): FutureScenarioAssessment {
  const scenario = getFutureScenario(projectState, scenarioId);
  const projections = getScenarioProjections(projectState, scenarioId);
  const projection_conflicts = detectScenarioProjectionConflicts(
    projectState,
    scenarioId
  );
  const likelihood_assessment = assessScenarioLikelihood(
    projectState,
    scenarioId
  );
  const reference_assessment = assessScenarioReferences(
    projectState,
    scenarioId
  );

  return {
    scenario,
    projections,
    projection_conflicts,
    likelihood_assessment,
    reference_assessment,
  };
}
