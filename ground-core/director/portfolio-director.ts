import { randomUUID } from "node:crypto";
import { getActionIntent } from "../intake/action-intent.js";
import type { ProjectState } from "../types.js";
import {
  buildProjectScoreContext,
  computeBlockerScore,
  computeCrossProjectScore,
  computeHealthScore,
  computeMomentumScore,
  computeUrgencyScore,
  resolveHealthStatus,
  type ProjectScoreContext,
} from "./portfolio-scoring.js";
import type {
  BlockedProjectSnapshot,
  DeferredRecommendation,
  PortfolioBottleneck,
  PortfolioConfidenceFactor,
  PortfolioDirector,
  PortfolioInput,
  PortfolioRecommendation,
  PortfolioRecommendationReason,
  PortfolioReport,
  ProgressingProjectSnapshot,
  ProjectHealth,
  RankedProjectEntry,
  WhyNotAlternative,
} from "./portfolio-types.js";

export class PortfolioDirectorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortfolioDirectorError";
  }
}

const DEFAULT_MAX_ALTERNATIVES = 2;
const SESSION_FOCUS_EXPLICIT_BONUS = 0.03;
const SESSION_FOCUS_FALLBACK_BONUS = 0.02;
const DEEP_WORK_INTENT_BONUS = 0.03;
const DEEP_WORK_UNLOCK_FALLBACK_BONUS = 0.02;

interface ScoredProject {
  context: ProjectScoreContext;
  crossProjectScore: number;
  crossProjectReasons: PortfolioRecommendationReason[];
  urgencyScore: number;
  momentumScore: number;
  blockerScore: number;
  healthScore: number;
  healthStatus: ProjectHealth["status"];
  /** Index in portfolio input `project_states` — tie-break when scores match. */
  input_order: number;
  sessionFocusBonus: number;
  sessionFocusReasons: PortfolioRecommendationReason[];
  deepWorkFocusBonus: number;
  deepWorkFocusReasons: PortfolioRecommendationReason[];
}

function effectiveCrossProjectScore(entry: ScoredProject): number {
  return Number(
    (entry.crossProjectScore + entry.sessionFocusBonus + entry.deepWorkFocusBonus).toFixed(2)
  );
}

function comparePortfolioRank(a: ScoredProject, b: ScoredProject): number {
  const aScore = effectiveCrossProjectScore(a);
  const bScore = effectiveCrossProjectScore(b);
  if (bScore !== aScore) {
    return bScore - aScore;
  }
  if (b.urgencyScore !== a.urgencyScore) {
    return b.urgencyScore - a.urgencyScore;
  }
  return a.input_order - b.input_order;
}

function buildDeferExplicitMessage(entry: ScoredProject, primary: ScoredProject): string {
  const scoreDelta = effectiveCrossProjectScore(primary) - effectiveCrossProjectScore(entry);
  if (scoreDelta > 0) {
    return `横断スコア ${effectiveCrossProjectScore(entry).toFixed(2)} < primary ${effectiveCrossProjectScore(primary).toFixed(2)} のため後回し`;
  }
  return "横断スコアは primary と同点。portfolio 入力順により今日の主作業ではなく、FLOW 上の後続候補として保持";
}

function validatePortfolioInput(input: PortfolioInput): void {
  if (input.project_states.length === 0) {
    throw new PortfolioDirectorError("project_states must not be empty");
  }

  const stateIds = new Set(input.project_states.map((state) => state.project.id));
  if (stateIds.size !== input.project_states.length) {
    throw new PortfolioDirectorError("project_states must have unique project_id values");
  }

  if (input.director_reports.length !== input.project_states.length) {
    throw new PortfolioDirectorError(
      "director_reports must match project_states length (1:1)"
    );
  }

  for (const report of input.director_reports) {
    if (!stateIds.has(report.project_id)) {
      throw new PortfolioDirectorError(
        `director_report project_id ${report.project_id} has no matching project_state`
      );
    }
  }

  const focusId = input.options?.session_focus_project_id;
  if (focusId && input.options?.brief_type === "session" && !stateIds.has(focusId)) {
    throw new PortfolioDirectorError(
      `session_focus_project_id ${focusId} is not in project_states`
    );
  }
}

function pairStatesAndReports(input: PortfolioInput): ProjectScoreContext[] {
  const reportByProjectId = new Map(
    input.director_reports.map((report) => [report.project_id, report])
  );

  return input.project_states.map((state) => {
    const report = reportByProjectId.get(state.project.id);
    if (!report) {
      throw new PortfolioDirectorError(`Missing director_report for ${state.project.id}`);
    }
    return buildProjectScoreContext(state, report);
  });
}

function scoreProjects(contexts: ProjectScoreContext[]): ScoredProject[] {
  return contexts.map((context, input_order) => {
    const { score, reasons } = computeCrossProjectScore(context);
    const urgencyScore = computeUrgencyScore(context);
    const momentumScore = computeMomentumScore(context);
    const blockerScore = computeBlockerScore(context);
    const noEligibleActions = context.primary.reasons.some(
      (reason) => reason.kind === "no_eligible_actions"
    );
    const stalledPenalty = context.eligible && momentumScore < 0.25 && context.pending_count > 0;
    const inactivePenalty = context.state.project.status !== "active";

    const healthStatus = resolveHealthStatus({
      projectStatus: context.state.project.status,
      eligible: context.eligible,
      momentumScore,
      noEligibleActions,
    });

    const healthScore = computeHealthScore({
      recommendationScore: context.primary.score,
      momentumScore,
      urgencyScore,
      blockerScore,
      stalledPenalty,
      inactivePenalty,
    });

    return {
      context,
      crossProjectScore: score,
      crossProjectReasons: reasons,
      urgencyScore,
      momentumScore,
      blockerScore,
      healthScore,
      healthStatus,
      input_order,
      sessionFocusBonus: 0,
      sessionFocusReasons: [],
      deepWorkFocusBonus: 0,
      deepWorkFocusReasons: [],
    };
  });
}

type SessionFocusKind = "explicit" | "input_order_fallback";

function resolveSessionFocusTarget(input: PortfolioInput): {
  projectId: string | null;
  kind: SessionFocusKind | null;
} {
  if (input.options?.brief_type !== "session") {
    return { projectId: null, kind: null };
  }

  const explicitId = input.options.session_focus_project_id;
  if (explicitId) {
    return { projectId: explicitId, kind: "explicit" };
  }

  if (input.project_states.length > 1) {
    return {
      projectId: input.project_states[0].project.id,
      kind: "input_order_fallback",
    };
  }

  return { projectId: null, kind: null };
}

function applySessionFocus(scored: ScoredProject[], input: PortfolioInput): ScoredProject[] {
  const { projectId, kind } = resolveSessionFocusTarget(input);
  if (!projectId || !kind) {
    return scored;
  }

  const bonus =
    kind === "explicit" ? SESSION_FOCUS_EXPLICIT_BONUS : SESSION_FOCUS_FALLBACK_BONUS;

  return scored.map((entry) => {
    if (entry.context.state.project.id !== projectId) {
      return entry;
    }

    if (!entry.context.eligible) {
      return {
        ...entry,
        sessionFocusReasons: [
          {
            kind: "session_focus",
            message: "session focus project は eligible ではないため bonus なし",
            entity_type: "project",
            entity_id: projectId,
            weight: 0,
          },
        ],
      };
    }

    const message =
      kind === "explicit"
        ? `session focus: explicit focus project (+${bonus.toFixed(2)})`
        : `session focus: first project fallback (+${bonus.toFixed(2)})`;

    return {
      ...entry,
      sessionFocusBonus: bonus,
      sessionFocusReasons: [
        {
          kind: "session_focus",
          message,
          entity_type: "project",
          entity_id: projectId,
          weight: 1,
          score_delta: bonus,
        },
      ],
    };
  });
}

function applyDeepWorkFocus(scored: ScoredProject[], input: PortfolioInput): ScoredProject[] {
  if (input.options?.brief_type !== "deep-work") {
    return scored;
  }

  let result = scored.map((entry) => {
    const projectId = entry.context.state.project.id;
    const primaryActionId = entry.context.primary.entity_id;
    const intent = getActionIntent(entry.context.state, primaryActionId);

    if (!entry.context.eligible) {
      if (intent === "deep_work") {
        const deepWorkFocusReasons: PortfolioRecommendationReason[] = [
          {
            kind: "deep_work_focus",
            message: "deep_work intent があるが eligible ではないため bonus なし",
            entity_type: "project",
            entity_id: projectId,
            weight: 0,
          },
        ];
        return {
          ...entry,
          deepWorkFocusReasons,
        };
      }
      return entry;
    }

    if (intent === "deep_work") {
      const deepWorkFocusReasons: PortfolioRecommendationReason[] = [
        {
          kind: "deep_work_focus",
          message: `action intent deep_work (+${DEEP_WORK_INTENT_BONUS.toFixed(2)})`,
          entity_type: "next_action",
          entity_id: primaryActionId,
          weight: 1,
          score_delta: DEEP_WORK_INTENT_BONUS,
        },
      ];
      return {
        ...entry,
        deepWorkFocusBonus: DEEP_WORK_INTENT_BONUS,
        deepWorkFocusReasons,
      };
    }

    return entry;
  });

  const eligibleWithoutIntentBonus = result.filter(
    (entry) => entry.context.eligible && entry.deepWorkFocusBonus === 0
  );

  if (eligibleWithoutIntentBonus.length === 0) {
    return result;
  }

  const unlockLeader = [...eligibleWithoutIntentBonus].sort((a, b) => {
    const unlockDiff = b.context.downstream_unlock_count - a.context.downstream_unlock_count;
    if (unlockDiff !== 0) {
      return unlockDiff;
    }
    return a.input_order - b.input_order;
  })[0];

  if (!unlockLeader || unlockLeader.context.downstream_unlock_count <= 0) {
    return result;
  }

  const leaderId = unlockLeader.context.state.project.id;

  return result.map((entry) => {
    if (entry.context.state.project.id !== leaderId) {
      return entry;
    }
    if (entry.deepWorkFocusBonus > 0 || !entry.context.eligible) {
      return entry;
    }

    const deepWorkFocusReasons: PortfolioRecommendationReason[] = [
      {
        kind: "deep_work_focus",
        message: `downstream unlock fallback (+${DEEP_WORK_UNLOCK_FALLBACK_BONUS.toFixed(2)})`,
        entity_type: "project",
        entity_id: leaderId,
        weight: 1,
        score_delta: DEEP_WORK_UNLOCK_FALLBACK_BONUS,
      },
    ];

    return {
      ...entry,
      deepWorkFocusBonus: DEEP_WORK_UNLOCK_FALLBACK_BONUS,
      deepWorkFocusReasons,
    };
  });
}

function buildPortfolioRecommendation(
  scored: ScoredProject,
  rank: number,
  comparedTo: ScoredProject[]
): PortfolioRecommendation {
  const { context, crossProjectScore, crossProjectReasons, urgencyScore, momentumScore, blockerScore } =
    scored;

  const reasons: PortfolioRecommendationReason[] = [
    ...crossProjectReasons.slice(0, 4),
    ...scored.sessionFocusReasons,
    ...scored.deepWorkFocusReasons,
    {
      kind: "cross_project_rank",
      message: `横断スコア ${effectiveCrossProjectScore(scored).toFixed(2)} で ${rank} 位`,
      entity_type: "project",
      entity_id: context.state.project.id,
      weight: 1,
      score_delta: effectiveCrossProjectScore(scored),
    },
  ];

  const whyNotAlternatives: WhyNotAlternative[] = comparedTo.map((other) => ({
    compared_project_id: other.context.state.project.id,
    compared_project_title: other.context.state.project.title,
    compared_next_action_id: other.context.primary.entity_id,
    compared_next_action_label: other.context.primary.label,
    reasons: buildWhyNotReasons(scored, other),
  }));

  return {
    project_id: context.state.project.id,
    project_title: context.state.project.title,
    next_action_id: context.primary.entity_id,
    next_action_label: context.primary.label,
    score: effectiveCrossProjectScore(scored),
    urgency_score: urgencyScore,
    momentum_score: momentumScore,
    blocker_score: blockerScore,
    recommendation_score: context.primary.score,
    reasons,
    why_not_alternatives: whyNotAlternatives,
  };
}

function buildWhyNotReasons(
  winner: ScoredProject,
  other: ScoredProject
): PortfolioRecommendationReason[] {
  const reasons: PortfolioRecommendationReason[] = [];
  const scoreGap = effectiveCrossProjectScore(winner) - effectiveCrossProjectScore(other);

  if (scoreGap > 0) {
    reasons.push({
      kind: "cross_project_rank",
      message: `横断スコア差 ${scoreGap.toFixed(2)} — ${winner.context.state.project.title} の方が高い`,
      weight: 1,
      score_delta: scoreGap,
    });
  } else if (scoreGap === 0) {
    reasons.push({
      kind: "cross_project_rank",
      message: "横断スコアは同点 — portfolio 入力順により 1 位ではない",
      weight: 0,
    });
  }

  if (other.context.is_meta_work && !winner.context.is_meta_work) {
    reasons.push({
      kind: "meta_work_defer",
      message: "メタ改善系 project のため、実行系 project を今日優先",
      entity_type: "project",
      entity_id: other.context.state.project.id,
      weight: -1,
      score_delta: -0.12,
    });
  }

  if (winner.context.is_field_validation && !other.context.is_field_validation) {
    reasons.push({
      kind: "field_validation_priority",
      message: "現場検証チェーン先頭の project を今日優先",
      entity_type: "project",
      entity_id: winner.context.state.project.id,
      weight: 1,
      score_delta: 0.08,
    });
  }

  if (other.urgencyScore < winner.urgencyScore) {
    reasons.push({
      kind: "urgency_high",
      message: `urgency ${other.urgencyScore.toFixed(2)} < ${winner.urgencyScore.toFixed(2)}`,
      weight: 1,
    });
  }

  if (other.context.downstream_unlock_count < winner.context.downstream_unlock_count) {
    reasons.push({
      kind: "downstream_unlock",
      message: `downstream 解放 ${other.context.downstream_unlock_count} < ${winner.context.downstream_unlock_count}`,
      weight: 1,
    });
  }

  if (reasons.length === 0) {
    reasons.push({
      kind: "cross_project_rank",
      message: "横断スコア順位により 1 位ではない",
      weight: 0,
    });
  }

  return reasons;
}

function buildDeferredRecommendations(
  ranked: ScoredProject[],
  primary: ScoredProject
): DeferredRecommendation[] {
  const deferred: DeferredRecommendation[] = [];

  for (const entry of ranked) {
    if (entry.context.state.project.id === primary.context.state.project.id) {
      continue;
    }

    const deferReasons: PortfolioRecommendationReason[] = [];

    if (entry.context.is_meta_work) {
      deferReasons.push({
        kind: "meta_work_defer",
        message: "メタ改善系 project — 実行系 project を先に進める",
        entity_type: "project",
        entity_id: entry.context.state.project.id,
        weight: -1,
        score_delta: -0.12,
      });
    }

    deferReasons.push({
      kind: "defer_explicit",
      message: buildDeferExplicitMessage(entry, primary),
      entity_type: "project",
      entity_id: entry.context.state.project.id,
      weight: -1,
      score_delta: effectiveCrossProjectScore(primary) - effectiveCrossProjectScore(entry),
    });

    if (entry.crossProjectReasons.some((reason) => reason.kind === "stalled_penalty")) {
      deferReasons.push({
        kind: "stalled_penalty",
        message: "movement シグナルが弱い",
        entity_type: "project",
        entity_id: entry.context.state.project.id,
        weight: -1,
        score_delta: -0.15,
      });
    }

    deferred.push({
      project_id: entry.context.state.project.id,
      project_title: entry.context.state.project.title,
      next_action_id: entry.context.primary.entity_id,
      next_action_title: entry.context.primary.label,
      defer_reasons: deferReasons,
    });
  }

  return deferred;
}

function buildBlockedProjects(ranked: ScoredProject[]): BlockedProjectSnapshot[] {
  return ranked
    .filter((entry) =>
      entry.healthStatus === "blocked" ||
      entry.healthStatus === "stalled" ||
      entry.healthStatus === "paused"
    )
    .map((entry) => ({
      project_id: entry.context.state.project.id,
      project_title: entry.context.state.project.title,
      health_status:
        entry.healthStatus === "paused"
          ? "paused"
          : entry.healthStatus === "blocked"
            ? "blocked"
            : "stalled",
      primary_blocker_title: entry.context.primary_blocker?.title ?? null,
      blocked_action_title: entry.context.eligible ? null : entry.context.primary.label,
      reasons: entry.crossProjectReasons.filter((reason) =>
        ["dependency_blocked", "stalled_penalty", "project_inactive_penalty", "no_eligible_actions"].includes(
          reason.kind
        )
      ),
    }));
}

function buildProgressingProjects(ranked: ScoredProject[]): ProgressingProjectSnapshot[] {
  return ranked
    .filter((entry) => entry.healthStatus === "progressing")
    .map((entry) => ({
      project_id: entry.context.state.project.id,
      project_title: entry.context.state.project.title,
      momentum_score: entry.momentumScore,
      in_progress_action_count: entry.context.in_progress_count,
      reasons: [
        {
          kind: "momentum_signal",
          message: `momentum ${entry.momentumScore.toFixed(2)} — in_progress ${entry.context.in_progress_count} 件`,
          entity_type: "project",
          entity_id: entry.context.state.project.id,
          weight: 1,
        },
      ],
    }));
}

function buildPortfolioBottleneck(ranked: ScoredProject[]): PortfolioBottleneck {
  const eligible = ranked.filter((entry) => entry.context.eligible);
  const sorted = [...eligible].sort((a, b) => {
    const unlockDiff = b.context.downstream_unlock_count - a.context.downstream_unlock_count;
    if (unlockDiff !== 0) {
      return unlockDiff;
    }

    const severityWeight = (entry: ScoredProject) =>
      entry.context.primary_blocker?.severity === "critical"
        ? 4
        : entry.context.primary_blocker?.severity === "high"
          ? 3
          : entry.context.primary_blocker?.severity === "medium"
            ? 2
            : entry.context.primary_blocker
              ? 1
              : 0;

    return severityWeight(b) - severityWeight(a) || b.crossProjectScore - a.crossProjectScore;
  });

  const top = sorted[0] ?? ranked[0];
  if (!top) {
    throw new PortfolioDirectorError("Unable to determine portfolio bottleneck");
  }

  const explanation =
    top.context.primary_blocker !== null
      ? `open blocker「${top.context.primary_blocker.title}」が ${top.context.state.project.title} の primary action「${top.context.primary.label}」を止めている`
      : `primary action「${top.context.primary.label}」が ${top.context.state.project.title} のチェーン先頭`;

  return {
    project_id: top.context.state.project.id,
    project_title: top.context.state.project.title,
    next_action_id: top.context.primary.entity_id,
    next_action_title: top.context.primary.label,
    blocker_title: top.context.primary_blocker?.title ?? null,
    downstream_unlock_count: top.context.downstream_unlock_count,
    explanation,
    reasons: [
      {
        kind: "downstream_unlock",
        message: `downstream 解放 ${top.context.downstream_unlock_count} 件`,
        entity_type: "next_action",
        entity_id: top.context.primary.entity_id,
        weight: 1,
      },
      ...(top.context.primary_blocker
        ? [
            {
              kind: "blocker_severity" as const,
              message: `blocker severity: ${top.context.primary_blocker.severity}`,
              entity_type: "blocker" as const,
              entity_id: top.context.primary_blocker.id,
              weight: 1,
            },
          ]
        : []),
    ],
  };
}

function computePortfolioConfidence(
  primary: ScoredProject,
  alternatives: ScoredProject[]
): { confidence: number; factors: PortfolioConfidenceFactor[] } {
  const gap =
    alternatives.length > 0
      ? effectiveCrossProjectScore(primary) - effectiveCrossProjectScore(alternatives[0])
      : 0.2;

  const directorConfidence = primary.context.report.recommendation.confidence;
  const eligibleRatio = primary.context.eligible ? 1 : 0.3;
  const gapFactor = Math.min(1, Math.max(0, gap * 2));

  const confidence = Math.min(
    1,
    Math.max(0, directorConfidence * 0.5 + eligibleRatio * 0.25 + gapFactor * 0.25)
  );

  return {
    confidence: Number(confidence.toFixed(2)),
    factors: [
      {
        label: "director_confidence",
        value: directorConfidence,
        explanation: "primary project の Director confidence",
      },
      {
        label: "cross_project_gap",
        value: gapFactor,
        explanation: "1 位と 2 位の横断スコア差",
      },
      {
        label: "eligible_primary",
        value: eligibleRatio,
        explanation: "primary action が着手可能か",
      },
    ],
  };
}

function formatReasonLines(reasons: PortfolioRecommendationReason[]): string[] {
  return reasons.map((reason) => {
    const delta =
      reason.score_delta === undefined
        ? ""
        : ` (${reason.score_delta >= 0 ? "+" : ""}${reason.score_delta.toFixed(2)})`;
    return `  - ${reason.message}${delta}`;
  });
}

function buildSummaryText(report: PortfolioReport): string {
  const lines: string[] = [
    "GROUND Core Portfolio Director Report",
    `generated: ${report.generated_at}`,
    `engine: ${report.engine}`,
    "",
    "=== Top Recommendation ===",
    `${report.primary_recommendation.project_title} — ${report.primary_recommendation.next_action_label}`,
    `cross_project_score: ${report.primary_recommendation.score.toFixed(2)} | urgency: ${report.primary_recommendation.urgency_score.toFixed(2)} | confidence: ${report.confidence.toFixed(2)}`,
    "",
    "Why:",
    ...formatReasonLines(report.primary_recommendation.reasons.slice(0, 6)),
  ];

  if (report.alternative_recommendations.length > 0) {
    const alt = report.alternative_recommendations[0];
    lines.push(
      "",
      `Why not #2 (${alt.project_title}):`,
      ...formatReasonLines(
        report.primary_recommendation.why_not_alternatives.find(
          (entry) => entry.compared_project_id === alt.project_id
        )?.reasons ?? alt.why_not_alternatives[0]?.reasons ?? []
      )
    );
  }

  lines.push("", "=== Project Ranking ===");
  for (const entry of report.project_ranking) {
    lines.push(
      `${entry.rank}. ${entry.project_title} — ${entry.recommended_action_title} (score: ${entry.cross_project_score.toFixed(2)})`
    );
  }

  lines.push("", "=== Project Health ===");
  for (const health of report.project_health) {
    lines.push(
      `${health.project_title} | status: ${health.status} | health: ${health.health_score.toFixed(2)} | momentum: ${health.momentum_score.toFixed(2)} | urgency: ${health.urgency_score.toFixed(2)}`
    );
  }

  lines.push("", "=== Blocked Projects ===");
  if (report.blocked_projects.length === 0) {
    lines.push("（なし）");
  } else {
    for (const blocked of report.blocked_projects) {
      lines.push(`- ${blocked.project_title} (${blocked.health_status})`);
    }
  }

  lines.push("", "=== Progressing Projects ===");
  if (report.progressing_projects.length === 0) {
    lines.push("（なし）");
  } else {
    for (const progressing of report.progressing_projects) {
      lines.push(`- ${progressing.project_title} (momentum: ${progressing.momentum_score.toFixed(2)})`);
    }
  }

  lines.push(
    "",
    "=== Portfolio Bottleneck ===",
    report.portfolio_bottleneck.explanation,
    "",
    "=== Deferred (today) ==="
  );

  if (report.deferred_recommendations.length === 0) {
    lines.push("（なし）");
  } else {
    for (const deferred of report.deferred_recommendations) {
      lines.push(`- ${deferred.project_title} — ${deferred.next_action_title}`);
      for (const reason of deferred.defer_reasons.slice(0, 2)) {
        lines.push(`    - ${reason.message}`);
      }
    }
  }

  lines.push("", "requires_human_decision: true");
  return lines.join("\n");
}

export function recommendPortfolioFromInput(input: PortfolioInput): PortfolioReport {
  validatePortfolioInput(input);

  const generatedAt = new Date().toISOString();
  const maxAlternatives = input.options?.max_alternatives ?? DEFAULT_MAX_ALTERNATIVES;
  const minEligibleScore = input.options?.min_eligible_score ?? 0.25;

  const contexts = pairStatesAndReports(input);
  let scored = scoreProjects(contexts);
  scored = applySessionFocus(scored, input);
  scored = applyDeepWorkFocus(scored, input);

  const eligibleRanked = scored
    .filter((entry) => entry.context.eligible && entry.crossProjectScore >= minEligibleScore)
    .sort(comparePortfolioRank);

  const allRanked = [...scored].sort(comparePortfolioRank);

  const primaryScored = eligibleRanked[0] ?? allRanked[0];
  if (!primaryScored) {
    throw new PortfolioDirectorError("No projects available for portfolio recommendation");
  }

  const alternativeScored = eligibleRanked
    .slice(1, 1 + maxAlternatives)
    .filter((entry) => entry.context.state.project.id !== primaryScored.context.state.project.id);

  const primaryRecommendation = buildPortfolioRecommendation(
    primaryScored,
    1,
    alternativeScored
  );

  const alternativeRecommendations = alternativeScored.map((entry, index) =>
    buildPortfolioRecommendation(entry, index + 2, [primaryScored])
  );

  if (primaryRecommendation.reasons.length < 2) {
    throw new PortfolioDirectorError("primary_recommendation must include at least two reasons");
  }

  for (const recommendation of [primaryRecommendation, ...alternativeRecommendations]) {
    for (const reason of recommendation.reasons) {
      if (!reason.message.trim()) {
        throw new PortfolioDirectorError("PortfolioRecommendationReason.message must not be empty");
      }
    }
  }

  const projectRanking: RankedProjectEntry[] = allRanked.map((entry, index) => ({
    rank: index + 1,
    project_id: entry.context.state.project.id,
    project_title: entry.context.state.project.title,
    cross_project_score: effectiveCrossProjectScore(entry),
    urgency_score: entry.urgencyScore,
    momentum_score: entry.momentumScore,
    recommended_action_id: entry.context.primary.entity_id,
    recommended_action_title: entry.context.primary.label,
  }));

  const projectHealth: ProjectHealth[] = scored.map((entry) => ({
    project_id: entry.context.state.project.id,
    project_title: entry.context.state.project.title,
    health_score: entry.healthScore,
    momentum_score: entry.momentumScore,
    blocker_score: entry.blockerScore,
    recommendation_score: entry.context.primary.score,
    urgency_score: entry.urgencyScore,
    cross_project_score: entry.crossProjectScore,
    status: entry.healthStatus,
  }));

  const { confidence, factors } = computePortfolioConfidence(
    primaryScored,
    alternativeScored
  );

  const reportWithoutSummary: Omit<PortfolioReport, "summary_text"> = {
    schema_version: "0.4.0",
    engine: rulePortfolioDirector.name,
    generated_at: generatedAt,
    primary_recommendation: primaryRecommendation,
    alternative_recommendations: alternativeRecommendations,
    project_ranking: projectRanking,
    project_health: projectHealth,
    blocked_projects: buildBlockedProjects(scored),
    progressing_projects: buildProgressingProjects(scored),
    deferred_recommendations: buildDeferredRecommendations(allRanked, primaryScored),
    portfolio_bottleneck: buildPortfolioBottleneck(allRanked),
    confidence,
    confidence_factors: factors,
    requires_human_decision: true,
  };

  return {
    ...reportWithoutSummary,
    summary_text: buildSummaryText({
      ...reportWithoutSummary,
      summary_text: "",
    }),
  };
}

export const rulePortfolioDirector: PortfolioDirector = {
  name: "rule-portfolio-director-v1",
  recommendPortfolio(input: PortfolioInput): PortfolioReport {
    return recommendPortfolioFromInput(input);
  },
};

export function hasEligiblePortfolioPrimary(report: PortfolioReport): boolean {
  return report.primary_recommendation.score >= (report.project_health.length > 0 ? 0.25 : 0);
}
