import { canonicalValueKey } from "./semantic-equality.js";
import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Impact Measurement assessment (GROUND-018).
 *
 * Consumes GROUND-017 ImpactScopeAssessment + ImpactMeasureDeclaration.
 * Must not import state-engine / file-store / studio.
 * No severity / fusion / unit conversion / expected_loss / Reality mutation.
 */

import {
  assessProblemImpactScope,
  assessReferenceDeviationImpactScope,
  assessRiskImpactScope,
  isImpactDeclarationActiveAt,
} from "./impact-core.js";
import type {
  ImpactMeasurementAssessment,
  ImpactMetricAssessment,
} from "./impact-measurement-types.js";
import type { ImpactScopeAssessment } from "./impact-types.js";
import type { NormativeFinding } from "./normative-discovery-types.js";
import type { ProspectiveRiskFinding } from "./prospective-risk-discovery-types.js";
import type {
  ImpactDeclaration,
  ImpactMeasure,
  ImpactMeasureDeclaration,
  ProjectState,
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

/** Deterministic semantic key for an ImpactMeasure — no floating tolerance. */
export function impactMeasureSemanticKey(measure: ImpactMeasure): string {
  if (measure.kind === "POINT") {
    return `POINT|${measure.value}`;
  }
  return `RANGE|${measure.min}|${measure.max}`;
}

export function isImpactMeasureDeclarationActiveAt(
  declaration: ImpactMeasureDeclaration,
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

function compareMeasureDeclarations(
  a: ImpactMeasureDeclaration,
  b: ImpactMeasureDeclaration
): number {
  if (a.impact_declaration_id !== b.impact_declaration_id) {
    return compareIds(a.impact_declaration_id, b.impact_declaration_id);
  }
  if (a.metric_key !== b.metric_key) {
    return a.metric_key < b.metric_key ? -1 : 1;
  }
  if (a.unit !== b.unit) {
    return a.unit < b.unit ? -1 : 1;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareMetricAssessments(
  a: ImpactMetricAssessment,
  b: ImpactMetricAssessment
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
  if (a.metric_key !== b.metric_key) {
    return a.metric_key < b.metric_key ? -1 : 1;
  }
  if (a.unit !== b.unit) {
    return a.unit < b.unit ? -1 : 1;
  }
  return 0;
}

export function getApplicableImpactMeasureDeclarations(
  projectState: ProjectState,
  impactDeclarationIds: string[],
  at: string
): ImpactMeasureDeclaration[] {
  const idSet = new Set(impactDeclarationIds);
  const parentById = new Map(
    projectState.impact_declarations
      .filter((entry) => entry.project_id === projectState.project.id)
      .map((entry) => [entry.id, entry])
  );

  return projectState.impact_measure_declarations
    .filter((entry) => {
      if (entry.project_id !== projectState.project.id) {
        return false;
      }
      if (!idSet.has(entry.impact_declaration_id)) {
        return false;
      }
      const parent = parentById.get(entry.impact_declaration_id);
      if (!parent || !isImpactDeclarationActiveAt(parent, at)) {
        return false;
      }
      return isImpactMeasureDeclarationActiveAt(entry, at);
    })
    .slice()
    .sort(compareMeasureDeclarations);
}

function buildMetricAssessments(
  impactDeclarations: ImpactDeclaration[],
  measures: ImpactMeasureDeclaration[]
): ImpactMetricAssessment[] {
  const parentById = new Map(
    impactDeclarations.map((entry) => [entry.id, entry])
  );
  const byScope = new Map<string, ImpactMeasureDeclaration[]>();

  for (const measure of measures) {
    const parent = parentById.get(measure.impact_declaration_id);
    if (!parent) {
      continue;
    }
    const scopeKey = [
      parent.affected_entity_id,
      parent.dimension,
      parent.direction,
      measure.metric_key,
      measure.unit,
    ].join("\u0000");
    const group = byScope.get(scopeKey) ?? [];
    group.push(measure);
    byScope.set(scopeKey, group);
  }

  const assessments: ImpactMetricAssessment[] = [];

  for (const group of byScope.values()) {
    const sorted = group.slice().sort((a, b) => {
      const keyA = impactMeasureSemanticKey(a.measure);
      const keyB = impactMeasureSemanticKey(b.measure);
      if (keyA !== keyB) {
        return keyA < keyB ? -1 : 1;
      }
      return compareIds(a.id, b.id);
    });
    const first = sorted[0]!;
    const parent = parentById.get(first.impact_declaration_id)!;

    const semanticKeys = new Set(
      sorted.map((entry) => impactMeasureSemanticKey(entry.measure))
    );
    const point_values = sorted
      .filter((entry) => entry.measure.kind === "POINT")
      .map((entry) => (entry.measure as { kind: "POINT"; value: number }).value)
      .slice()
      .sort((a, b) => a - b);
    const ranges = sorted
      .filter((entry) => entry.measure.kind === "RANGE")
      .map((entry) => {
        const range = entry.measure as { kind: "RANGE"; min: number; max: number };
        return { min: range.min, max: range.max };
      })
      .sort((a, b) => {
        if (a.min !== b.min) {
          return a.min - b.min;
        }
        return a.max - b.max;
      });

    const declarerMap = new Map<string, ReferenceDeclarer>();
    for (const entry of sorted) {
      declarerMap.set(declarerKey(entry.declared_by), entry.declared_by);
    }

    assessments.push({
      affected_entity_id: parent.affected_entity_id,
      dimension: parent.dimension,
      direction: parent.direction,
      metric_key: first.metric_key,
      unit: first.unit,
      impact_declaration_ids: sortUniqueIds(
        sorted.map((entry) => entry.impact_declaration_id)
      ),
      measure_declaration_ids: sorted.map((entry) => entry.id),
      measures: sorted.map((entry) => entry.measure),
      point_values: [...new Set(point_values)].sort((a, b) => a - b),
      ranges: ranges.filter((range, index, arr) => {
        if (index === 0) {
          return true;
        }
        const prev = arr[index - 1]!;
        return prev.min !== range.min || prev.max !== range.max;
      }),
      has_multiple_declared_measures: sorted.length > 1,
      has_measure_divergence: semanticKeys.size > 1,
      declarers: [...declarerMap.values()].sort((a, b) =>
        declarerKey(a).localeCompare(declarerKey(b))
      ),
    });
  }

  return assessments.sort(compareMetricAssessments);
}

export function assessImpactMeasurementsForScope(
  projectState: ProjectState,
  impactScope: ImpactScopeAssessment
): ImpactMeasurementAssessment {
  const impactDeclarationIds = impactScope.applicable_declarations.map(
    (entry) => entry.id
  );
  const measures = getApplicableImpactMeasureDeclarations(
    projectState,
    impactDeclarationIds,
    impactScope.at
  );
  const metric_assessments = buildMetricAssessments(
    impactScope.applicable_declarations,
    measures
  );

  return {
    impact_scope: impactScope,
    metric_assessments,
    metric_keys: sortUniqueStrings(
      metric_assessments.map((entry) => entry.metric_key)
    ),
    units: sortUniqueStrings(metric_assessments.map((entry) => entry.unit)),
    measure_declaration_ids: sortUniqueIds(measures.map((entry) => entry.id)),
    has_measurements: measures.length > 0,
    has_measure_divergence: metric_assessments.some(
      (entry) => entry.has_measure_divergence
    ),
    has_multiple_metrics: new Set(
      metric_assessments.map((entry) => entry.metric_key)
    ).size > 1,
    has_multiple_units:
      new Set(metric_assessments.map((entry) => entry.unit)).size > 1,
  };
}

export function assessReferenceDeviationImpactMeasurements(
  projectState: ProjectState,
  referenceConditionId: string,
  at: string
): ImpactMeasurementAssessment {
  const impactScope = assessReferenceDeviationImpactScope(
    projectState,
    referenceConditionId,
    at
  );
  return assessImpactMeasurementsForScope(projectState, impactScope);
}

export function assessProblemImpactMeasurements(
  projectState: ProjectState,
  problemFinding: NormativeFinding
): ImpactMeasurementAssessment {
  const impactScope = assessProblemImpactScope(projectState, problemFinding);
  return assessImpactMeasurementsForScope(projectState, impactScope);
}

export function assessRiskImpactMeasurements(
  projectState: ProjectState,
  riskFinding: ProspectiveRiskFinding
): ImpactMeasurementAssessment {
  const impactScope = assessRiskImpactScope(projectState, riskFinding);
  return assessImpactMeasurementsForScope(projectState, impactScope);
}
