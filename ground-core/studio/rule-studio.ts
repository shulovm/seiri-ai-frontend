import { compareTemporalInstants } from "../temporal.js";
import type { ProjectState } from "../types.js";
import {
  buildSituationSummary,
  indexDirectorReports,
  indexProjectStates,
  portfolioReasonToStudioReason,
} from "./analyzers.js";
import {
  buildBlockedProjects,
  buildDeferredProjects,
  buildGrowingProjects,
  buildRecommendedFlow,
  buildRiskProjects,
  buildTodayFocus,
  countDeepWorkSteps,
} from "./scoring.js";
import type {
  PortfolioAlignment,
  StudioDecisionMaterial,
  StudioEngine,
  StudioEngineInput,
  StudioReport,
} from "./types.js";

export const STUDIO_ENGINE_NAME = "rule-studio-v1";

const OBSERVATION_RECENCY_DAYS = 30;
const MAX_DECISION_MATERIALS = 12;

function buildDecisionMaterials(
  states: ProjectState[] | undefined
): StudioDecisionMaterial[] {
  if (!states || states.length === 0) {
    return [];
  }

  const materials: StudioDecisionMaterial[] = [];
  const observationThreshold =
    new Date(Date.now() - OBSERVATION_RECENCY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  for (const state of states) {
    if (materials.length >= MAX_DECISION_MATERIALS) break;
    const projectTitle = state.project.title;

    for (const decision of state.decisions) {
      if (decision.status !== "active") {
        continue;
      }

      materials.push({
        kind: "decision",
        project_id: state.project.id,
        project_title: projectTitle,
        entity_id: decision.id,
        title: decision.title,
        summary: decision.rationale,
        pending_question: decision.alternatives_considered[0] ?? undefined,
      });
    }

    for (const hypothesis of state.hypotheses) {
      if (hypothesis.status !== "untested") {
        continue;
      }

      materials.push({
        kind: "hypothesis",
        project_id: state.project.id,
        project_title: projectTitle,
        entity_id: hypothesis.id,
        title: hypothesis.statement,
        summary: hypothesis.statement,
        pending_question: "検証観測が未実施",
      });
    }

    if (materials.length >= MAX_DECISION_MATERIALS) break;
    const recentObservations = [...(state.observations ?? [])]
      .filter(
        (observation) =>
          compareTemporalInstants(observation.created_at, observationThreshold,
            `Observation ${observation.id}: recent decision material membership`) >= 0
      )
      .sort(
        (a, b) =>
          compareTemporalInstants(b.created_at, a.created_at, "recent decision material ordering")
      );

    for (const observation of recentObservations.slice(0, 2)) {
      materials.push({
        kind: "observation",
        project_id: state.project.id,
        project_title: projectTitle,
        entity_id: observation.id,
        title: observation.title,
        summary: observation.title,
      });
    }
  }

  return materials.slice(0, MAX_DECISION_MATERIALS);
}

function buildPortfolioAlignment(
  portfolio: StudioEngineInput["portfolio_report"],
  flowDeepWorkCount: number
): PortfolioAlignment {
  const primary = portfolio.primary_recommendation;
  const deepWorkWarning = flowDeepWorkCount > 2;

  return {
    primary_project_id: primary.project_id,
    primary_action_id: primary.next_action_id,
    alignment_status: deepWorkWarning ? "partially_aligned" : "aligned",
    note: deepWorkWarning
      ? "Portfolio primary は不変。Flow 上の deep work が 2 件超 — 人間が時間配分を判断"
      : "Studio は Portfolio primary を変更していない",
    deep_work_step_count: flowDeepWorkCount,
    deep_work_warning: deepWorkWarning,
  };
}

function buildSummaryText(
  portfolio: StudioEngineInput["portfolio_report"],
  todayFocus: StudioReport["today_focus"],
  flow: StudioReport["recommended_flow"],
  deferred: StudioReport["deferred_projects"],
  alignment: PortfolioAlignment
): string {
  const primary = portfolio.primary_recommendation;
  const flowLine =
    flow.length > 0
      ? flow.map((step) => `${step.project_title}(${step.intent})`).join(" → ")
      : primary.project_title;

  const deferredLine =
    deferred.length > 0
      ? deferred.map((entry) => entry.project_title).join("、")
      : "なし";

  return [
    `今日の primary は Portfolio 推奨どおり ${primary.project_title} / ${primary.next_action_label}。`,
    `横断フロー: ${flowLine}。`,
    `後回し: ${deferredLine}。`,
    alignment.deep_work_warning
      ? "deep work 同時実行が 2 件超 — 順序と時間配分は人間判断。"
      : "Portfolio と aligned — Studio は判断を上書きしていない。",
  ].join(" ");
}

function analyzeStudio(input: StudioEngineInput): StudioReport {
  const { portfolio_report: portfolio, director_reports, project_states } = input;
  const directors = indexDirectorReports(director_reports);
  const states = indexProjectStates(project_states);

  const todayFocus = buildTodayFocus(portfolio);
  todayFocus.situation_summary = buildSituationSummary(portfolio, directors);

  const blockedProjects = buildBlockedProjects(portfolio, directors);
  const growingProjects = buildGrowingProjects(portfolio, directors, states);
  const riskProjects = buildRiskProjects(portfolio, directors, states);
  const decisionMaterials = buildDecisionMaterials(project_states);
  const deferredProjects = buildDeferredProjects(portfolio);
  const recommendedFlow = buildRecommendedFlow(portfolio, directors, states);
  const deepWorkCount = countDeepWorkSteps(recommendedFlow);
  const portfolioAlignment = buildPortfolioAlignment(portfolio, deepWorkCount);

  if (decisionMaterials.length === 0 && portfolio.confidence_factors.length > 0) {
    for (const factor of portfolio.confidence_factors.slice(0, 3)) {
      decisionMaterials.push({
        kind: "portfolio_factor",
        project_id: portfolio.primary_recommendation.project_id,
        project_title: portfolio.primary_recommendation.project_title,
        entity_id: factor.label,
        title: factor.label,
        summary: factor.explanation,
      });
    }
  }

  return {
    schema_version: "0.5.3",
    engine: STUDIO_ENGINE_NAME,
    generated_at: new Date().toISOString(),
    today_focus: todayFocus,
    blocked_projects: blockedProjects,
    growing_projects: growingProjects,
    risk_projects: riskProjects,
    decision_materials: decisionMaterials,
    recommended_flow: recommendedFlow,
    deferred_projects: deferredProjects,
    portfolio_alignment: portfolioAlignment,
    summary_text: buildSummaryText(
      portfolio,
      todayFocus,
      recommendedFlow,
      deferredProjects,
      portfolioAlignment
    ),
    requires_human_decision: true,
  };
}

export const ruleStudio: StudioEngine = {
  name: STUDIO_ENGINE_NAME,
  analyze: analyzeStudio,
};

export { analyzeStudio };
