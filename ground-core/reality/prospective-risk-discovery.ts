import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Prospective Risk Discovery (GROUND-016).
 *
 * Consumes GROUND-015 assessFutureScenario only.
 * Must not import state-engine / file-store / studio modules.
 *
 * RISK = PROJECTED_ACCEPTABLE_DEVIATION + >=1 ScenarioLikelihoodEstimate with probability > 0
 * No severity / fusion / Action / Reality mutation.
 */

import { assessFutureScenario } from "./prospective-core.js";
import type {
  ProspectiveRiskAssessment,
  ProspectiveRiskFinding,
} from "./prospective-risk-discovery-types.js";
import type { FutureScenarioAssessment } from "./prospective-types.js";
import type { ProjectState } from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function sortUniqueNumbers(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

export function prospectiveRiskKey(
  scenarioId: string,
  projectionId: string,
  referenceConditionId: string
): string {
  return ["risk", scenarioId, projectionId, referenceConditionId].join("|");
}

function compareRiskFindings(
  a: ProspectiveRiskFinding,
  b: ProspectiveRiskFinding
): number {
  if (compareTemporalInstants(a.projected_for, b.projected_for) !== 0) {
    return compareTemporalInstants(a.projected_for, b.projected_for) < 0 ? -1 : 1;
  }
  if (a.subject_id !== b.subject_id) {
    return compareIds(a.subject_id, b.subject_id);
  }
  if (a.state_kind !== b.state_kind) {
    return a.state_kind < b.state_kind ? -1 : 1;
  }
  if (a.scenario_id !== b.scenario_id) {
    return compareIds(a.scenario_id, b.scenario_id);
  }
  if (a.projection_id !== b.projection_id) {
    return compareIds(a.projection_id, b.projection_id);
  }
  if (a.reference_condition_id !== b.reference_condition_id) {
    return compareIds(a.reference_condition_id, b.reference_condition_id);
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function contestedProjectionIds(
  scenarioAssessment: FutureScenarioAssessment
): Set<string> {
  const ids = new Set<string>();
  for (const conflict of scenarioAssessment.reference_assessment
    .projection_conflicts) {
    for (const projectionId of conflict.projection_ids) {
      ids.add(projectionId);
    }
  }
  return ids;
}

function buildRiskFindings(
  projectState: ProjectState,
  scenarioAssessment: FutureScenarioAssessment
): ProspectiveRiskFinding[] {
  const { scenario, likelihood_assessment, reference_assessment } =
    scenarioAssessment;

  const positiveEstimates = likelihood_assessment.estimates.filter(
    (entry) => entry.probability > 0
  );
  if (positiveEstimates.length === 0) {
    return [];
  }

  const acceptableDeviations =
    reference_assessment.projected_reference_findings.filter(
      (finding) => finding.kind === "PROJECTED_ACCEPTABLE_DEVIATION"
    );

  const allEstimateIds = sortUniqueIds(
    likelihood_assessment.estimates.map((entry) => entry.id)
  );
  const positiveEstimateIds = sortUniqueIds(
    positiveEstimates.map((entry) => entry.id)
  );
  const zeroEstimateIds = sortUniqueIds(
    likelihood_assessment.estimates
      .filter((entry) => entry.probability === 0)
      .map((entry) => entry.id)
  );
  const scenarioProbabilityValues = sortUniqueNumbers(
    likelihood_assessment.probability_values
  );
  const positiveProbabilityValues = sortUniqueNumbers(
    positiveEstimates.map((entry) => entry.probability)
  );
  const likelihoodDiverges = likelihood_assessment.has_multiple_values;
  const projectionContested = contestedProjectionIds(scenarioAssessment);

  const byKey = new Map<string, ProspectiveRiskFinding>();

  for (const finding of acceptableDeviations) {
    for (const referenceConditionId of finding.reference_condition_ids) {
      const reference = projectState.reference_conditions.find(
        (entry) =>
          entry.id === referenceConditionId &&
          entry.project_id === projectState.project.id
      );
      if (!reference) {
        continue;
      }

      const key = prospectiveRiskKey(
        scenario.id,
        finding.projection_id,
        referenceConditionId
      );
      const projectionContestedFlag = projectionContested.has(
        finding.projection_id
      );
      const referenceContestedFlag = finding.reference_basis_contested;

      byKey.set(key, {
        key,
        kind: "RISK",
        scenario_id: scenario.id,
        projection_id: finding.projection_id,
        subject_id: finding.subject_id,
        state_kind: finding.state_kind,
        projected_for: finding.projected_for,
        projected_value_key: finding.projected_value_key,
        reference_condition_id: referenceConditionId,
        reference_kind: "ACCEPTABLE",
        projected_comparison_result: "DEVIATES",
        likelihood_scope: "SCENARIO",
        all_likelihood_estimate_ids: allEstimateIds,
        positive_likelihood_estimate_ids: positiveEstimateIds,
        zero_likelihood_estimate_ids: zeroEstimateIds,
        scenario_probability_values: scenarioProbabilityValues,
        positive_probability_values: positiveProbabilityValues,
        reference_basis_contested: referenceContestedFlag,
        projection_basis_contested: projectionContestedFlag,
        likelihood_estimates_diverge: likelihoodDiverges,
        basis_contested: referenceContestedFlag || projectionContestedFlag,
        provenance: {
          scenario_declarer: scenario.declared_by,
          reference_declarer: reference.declared_by,
          likelihood_estimators: likelihood_assessment.estimates
            .slice()
            .sort((a, b) => {
              if (compareTemporalInstants(a.estimated_at, b.estimated_at) !== 0) {
                return compareTemporalInstants(a.estimated_at, b.estimated_at) < 0 ? -1 : 1;
              }
              return compareIds(a.id, b.id);
            })
            .map((entry) => entry.estimated_by),
        },
        details: {},
      });
    }
  }

  return [...byKey.values()].sort(compareRiskFindings);
}

export function discoverProspectiveRisks(
  projectState: ProjectState,
  scenarioId: string
): ProspectiveRiskFinding[] {
  const scenarioAssessment = assessFutureScenario(projectState, scenarioId);
  return buildRiskFindings(projectState, scenarioAssessment);
}

export function getProspectiveRiskFindings(
  projectState: ProjectState,
  scenarioId: string
): ProspectiveRiskFinding[] {
  return discoverProspectiveRisks(projectState, scenarioId);
}

export function assessProspectiveRisk(
  projectState: ProjectState,
  scenarioId: string
): ProspectiveRiskAssessment {
  const scenario_assessment = assessFutureScenario(projectState, scenarioId);
  const risk_findings = buildRiskFindings(projectState, scenario_assessment);
  const likelihood = scenario_assessment.likelihood_assessment;
  const hasAcceptableDeviation =
    scenario_assessment.reference_assessment.has_projected_acceptable_deviation;

  return {
    scenario_id: scenarioId,
    scenario_assessment,
    risk_findings,
    has_risk: risk_findings.length > 0,
    has_uncontested_risk: risk_findings.some((finding) => !finding.basis_contested),
    has_contested_risk: risk_findings.some((finding) => finding.basis_contested),
    has_divergent_likelihood_estimates: likelihood.has_multiple_values,
    has_projected_acceptable_deviation_without_likelihood:
      hasAcceptableDeviation && likelihood.status === "NO_ESTIMATES",
    has_projected_acceptable_deviation_with_only_zero_estimates:
      hasAcceptableDeviation &&
      likelihood.status === "ESTIMATED" &&
      likelihood.probability_values.length > 0 &&
      likelihood.probability_values.every((value) => value === 0),
  };
}

export function assessAllProspectiveRisks(
  projectState: ProjectState
): ProspectiveRiskAssessment[] {
  const scenarioIds = projectState.future_scenarios
    .filter((entry) => entry.project_id === projectState.project.id)
    .map((entry) => entry.id)
    .sort(compareIds);

  return scenarioIds.map((scenarioId) =>
    assessProspectiveRisk(projectState, scenarioId)
  );
}
