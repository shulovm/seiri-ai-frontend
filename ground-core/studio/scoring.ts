import type { DirectorReport } from "../director/types.js";
import type {
  PortfolioReport,
  ProjectHealth,
} from "../director/portfolio-types.js";
import type { ProjectState } from "../types.js";
import {
  collectProjectText,
  hasRecentObservation,
  highestOpenBlockerSeverity,
  isFieldValidationPattern,
  isMetaInfraPattern,
  portfolioReasonToStudioReason,
} from "./analyzers.js";
import type {
  DirectorReportIndex,
  ProjectStateIndex,
  StudioBlockedProject,
  StudioDeferredProject,
  StudioFlowStep,
  StudioGrowingProject,
  StudioReason,
  StudioRiskProject,
  TodayFocus,
  TodayFocusItem,
} from "./types.js";
import { SEVERITY_RANK } from "./types.js";

export function buildTodayFocus(portfolio: PortfolioReport): TodayFocus {
  const primary = portfolio.primary_recommendation;
  const primaryReasons = primary.reasons.map((reason) =>
    portfolioReasonToStudioReason(reason.message, "portfolio_primary")
  );

  const primaryItem: TodayFocusItem = {
    project_id: primary.project_id,
    project_title: primary.project_title,
    action_id: primary.next_action_id,
    action_title: primary.next_action_label,
    confidence: portfolio.confidence,
    reasons:
      primaryReasons.length >= 2
        ? primaryReasons.slice(0, 4)
        : [
            ...primaryReasons,
            portfolioReasonToStudioReason(
              `Portfolio 横断スコア ${primary.score.toFixed(2)} で 1 位`,
              "cross_project_rank"
            ),
            portfolioReasonToStudioReason(
              `urgency ${primary.urgency_score.toFixed(2)} / momentum ${primary.momentum_score.toFixed(2)}`,
              "momentum_signal"
            ),
          ].slice(0, 4),
  };

  const alternatives = portfolio.alternative_recommendations.slice(0, 3).map((entry) => ({
    project_id: entry.project_id,
    project_title: entry.project_title,
    action_id: entry.next_action_id,
    action_title: entry.next_action_label,
    confidence: entry.recommendation_score,
    reasons:
      entry.reasons.length > 0
        ? entry.reasons
            .slice(0, 2)
            .map((reason) => portfolioReasonToStudioReason(reason.message, "portfolio_alternative"))
        : [
            portfolioReasonToStudioReason(
              `Portfolio alternative — 横断スコア ${entry.score.toFixed(2)}`,
              "portfolio_alternative"
            ),
          ],
  }));

  return {
    situation_summary: "",
    primary: primaryItem,
    alternatives,
  };
}

export function buildBlockedProjects(
  portfolio: PortfolioReport,
  directors: DirectorReportIndex
): StudioBlockedProject[] {
  const items: StudioBlockedProject[] = [];

  for (const blocked of portfolio.blocked_projects) {
    const director = directors.byProjectId.get(blocked.project_id);
    const severity = highestOpenBlockerSeverity(director);
    items.push({
      project_id: blocked.project_id,
      project_title: blocked.project_title,
      status: blocked.health_status,
      blocker_title: blocked.primary_blocker_title,
      action_title: blocked.blocked_action_title,
      severity,
      reasons:
        blocked.reasons.length > 0
          ? blocked.reasons.map((reason) =>
              portfolioReasonToStudioReason(reason.message, "blocker_severity")
            )
          : [
              portfolioReasonToStudioReason(
                `${blocked.health_status} — ${blocked.primary_blocker_title ?? "movement シグナル弱"}`,
                "blocker_severity"
              ),
            ],
    });
  }

  for (const director of directors.byProjectId.values()) {
    if (director.open_blockers.length === 0) {
      continue;
    }

    const already = items.some((entry) => entry.project_id === director.project_id);
    if (already) {
      continue;
    }

    const topBlocker = [...director.open_blockers].sort(
      (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]
    )[0];

    items.push({
      project_id: director.project_id,
      project_title: director.situation.project_title,
      status: "blocked",
      blocker_title: topBlocker.title,
      action_title: director.recommendation.primary_recommendation.label,
      severity: topBlocker.severity,
      reasons: [
        portfolioReasonToStudioReason(
          `open blocker「${topBlocker.title}」severity ${topBlocker.severity}`,
          "blocker_severity"
        ),
      ],
    });
  }

  return items.sort((a, b) => {
    const severityDiff =
      (b.severity ? SEVERITY_RANK[b.severity] : 0) -
      (a.severity ? SEVERITY_RANK[a.severity] : 0);
    if (severityDiff !== 0) {
      return severityDiff;
    }
    return a.project_title.localeCompare(b.project_title);
  });
}

export function buildGrowingProjects(
  portfolio: PortfolioReport,
  directors: DirectorReportIndex,
  states: ProjectStateIndex
): StudioGrowingProject[] {
  const results: StudioGrowingProject[] = [];

  for (const progressing of portfolio.progressing_projects) {
    results.push({
      project_id: progressing.project_id,
      project_title: progressing.project_title,
      momentum_score: progressing.momentum_score,
      reasons: progressing.reasons.map((reason) =>
        portfolioReasonToStudioReason(reason.message, "momentum_signal")
      ),
    });
  }

  for (const health of portfolio.project_health) {
    if (results.some((entry) => entry.project_id === health.project_id)) {
      continue;
    }

    if (!isGrowingHealth(health)) {
      continue;
    }

    const director = directors.byProjectId.get(health.project_id);
    const state = states.byProjectId.get(health.project_id);
    const reasons: StudioReason[] = [
      portfolioReasonToStudioReason(
        `momentum ${health.momentum_score.toFixed(2)} / status ${health.status}`,
        "momentum_signal"
      ),
    ];

    if (director?.recommendation.primary_recommendation.eligible_for_primary) {
      reasons.push(
        portfolioReasonToStudioReason("primary action は dependency ready", "dependency_ready")
      );
    }

    if (state?.project.status === "active") {
      reasons.push(portfolioReasonToStudioReason("project.status active", "momentum_signal"));
    }

    results.push({
      project_id: health.project_id,
      project_title: health.project_title,
      momentum_score: health.momentum_score,
      reasons,
    });
  }

  return results.sort((a, b) => b.momentum_score - a.momentum_score);
}

function isGrowingHealth(health: ProjectHealth): boolean {
  return (
    health.status === "progressing" ||
    health.status === "ready" ||
    health.momentum_score >= 0.4
  );
}

export function buildRiskProjects(
  portfolio: PortfolioReport,
  directors: DirectorReportIndex,
  states: ProjectStateIndex
): StudioRiskProject[] {
  const risks: StudioRiskProject[] = [];

  for (const health of portfolio.project_health) {
    if (health.status === "stalled" || health.status === "blocked") {
      risks.push({
        project_id: health.project_id,
        project_title: health.project_title,
        risk_kind: "stalled",
        severity: health.status === "blocked" ? "high" : "medium",
        reasons: [
          portfolioReasonToStudioReason(
            `health status ${health.status} — movement シグナル弱`,
            "momentum_signal"
          ),
        ],
      });
    }

    const state = states.byProjectId.get(health.project_id);
    if (state && !hasRecentObservation(state)) {
      risks.push({
        project_id: health.project_id,
        project_title: health.project_title,
        risk_kind: "observation_gap",
        severity: "high",
        reasons: [
          portfolioReasonToStudioReason(
            "30 日以内の observation がない — 判断材料不足",
            "observation_gap"
          ),
        ],
      });
    }
  }

  const deepEligible = portfolio.project_ranking.filter((entry) => entry.cross_project_score >= 0.25);
  if (deepEligible.length > 2) {
    risks.push({
      project_id: portfolio.primary_recommendation.project_id,
      project_title: portfolio.primary_recommendation.project_title,
      risk_kind: "resource_overload",
      severity: "medium",
      reasons: [
        portfolioReasonToStudioReason(
          `${deepEligible.length} project が同日 deep work 候補 — 並行上限 2 を超えない`,
          "resource_overload"
        ),
      ],
    });
  }

  for (const director of directors.byProjectId.values()) {
    const topSeverity = highestOpenBlockerSeverity(director);
    if (topSeverity === "high" || topSeverity === "critical") {
      const exists = risks.some(
        (entry) =>
          entry.project_id === director.project_id && entry.risk_kind === "blocker_pressure"
      );
      if (!exists) {
        risks.push({
          project_id: director.project_id,
          project_title: director.situation.project_title,
          risk_kind: "blocker_pressure",
          severity: "high",
          reasons: [
            portfolioReasonToStudioReason(
              `open blocker severity ${topSeverity}`,
              "blocker_severity"
            ),
          ],
        });
      }
    }
  }

  return risks.sort((a, b) => {
    const rank = { high: 3, medium: 2, low: 1 };
    return rank[b.severity] - rank[a.severity];
  });
}

export function buildDeferredProjects(portfolio: PortfolioReport): StudioDeferredProject[] {
  return portfolio.deferred_recommendations.map((entry) => ({
    project_id: entry.project_id,
    project_title: entry.project_title,
    action_id: entry.next_action_id,
    action_title: entry.next_action_title,
    reasons:
      entry.defer_reasons.length > 0
        ? entry.defer_reasons.map((reason) =>
            portfolioReasonToStudioReason(reason.message, "defer_explicit")
          )
        : [
            portfolioReasonToStudioReason(
              "Portfolio deferred — 今日の primary 候補ではない",
              "defer_explicit"
            ),
          ],
  }));
}

export function buildRecommendedFlow(
  portfolio: PortfolioReport,
  directors: DirectorReportIndex,
  states: ProjectStateIndex
): StudioFlowStep[] {
  const primary = portfolio.primary_recommendation;
  const ranked = [...portfolio.project_ranking].sort((a, b) => a.rank - b.rank);
  const steps: StudioFlowStep[] = [];
  const timeBoxes: StudioFlowStep["time_box"][] = ["morning", "afternoon", "later", "later"];
  let order = 1;

  for (const entry of ranked.slice(0, 4)) {
    const director = directors.byProjectId.get(entry.project_id);
    const state = states.byProjectId.get(entry.project_id);
    const text = collectProjectText(state, director);
    const isPrimary = entry.project_id === primary.project_id;
    const isMeta = isMetaInfraPattern(text);
    const isField = isFieldValidationPattern(text);

    let intent: StudioFlowStep["intent"] = "deep_work";
    if (isMeta && !isPrimary) {
      intent = "defer";
    } else if (entry.rank >= 3 && !isField) {
      intent = "light_touch";
    }

    const timeBox = timeBoxes[Math.min(order - 1, timeBoxes.length - 1)] ?? "later";

    steps.push({
      order,
      time_box: isPrimary ? "morning" : timeBox,
      project_id: entry.project_id,
      project_title: entry.project_title,
      action_id: entry.recommended_action_id,
      action_title: entry.recommended_action_title,
      intent,
      reasons: [
        portfolioReasonToStudioReason(
          `Portfolio rank ${entry.rank} — cross_project_score ${entry.cross_project_score.toFixed(2)}`,
          "flow_sequencing"
        ),
        ...(isMeta && !isPrimary
          ? [portfolioReasonToStudioReason("メタ改善系 — 実行系後に配置", "meta_work_defer")]
          : []),
        ...(isField && isPrimary
          ? [portfolioReasonToStudioReason("現場検証チェーン先頭", "field_validation")]
          : []),
      ],
    });

    order += 1;
  }

  return steps;
}

export function countDeepWorkSteps(steps: StudioFlowStep[]): number {
  return steps.filter((step) => step.intent === "deep_work").length;
}
