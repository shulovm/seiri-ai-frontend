import { countDownstreamUnlocks } from "./scoring.js";
import type { DirectorReport } from "./types.js";
import type {
  Blocker,
  NextAction,
  ProjectState,
} from "../types.js";
import type {
  PortfolioRecommendationReason,
  ProjectHealthStatus,
} from "./portfolio-types.js";

const OPEN_BLOCKER_STATUSES = new Set<Blocker["status"]>(["open"]);

const META_KEYWORDS = [
  "schema",
  "cli",
  "director",
  "patch",
  "projectstate",
  "validate",
  "engine",
  "docs",
  "補完",
  "手動運用",
  "field を洗い出",
];

const EXECUTION_KEYWORDS = [
  "phase0",
  "manual_test",
  "field",
  "現場",
  "配布",
  "検証",
  "試験",
  "実験",
  "現地",
];

export interface ProjectScoreContext {
  state: ProjectState;
  report: DirectorReport;
  primary: DirectorReport["recommendation"]["primary_recommendation"];
  eligible: boolean;
  downstream_unlock_count: number;
  open_blockers: Blocker[];
  primary_blocker: Blocker | null;
  in_progress_count: number;
  pending_count: number;
  meta_keyword_hits: number;
  execution_keyword_hits: number;
  is_meta_work: boolean;
  is_field_validation: boolean;
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

function normalizeText(parts: string[]): string {
  return parts.join(" ").toLowerCase();
}

function countKeywordHits(text: string, keywords: string[]): number {
  const normalized = text.toLowerCase();
  return keywords.reduce((count, keyword) => {
    return normalized.includes(keyword.toLowerCase()) ? count + 1 : count;
  }, 0);
}

function collectOpenBlockers(state: ProjectState): Blocker[] {
  return state.blockers.filter((blocker) => OPEN_BLOCKER_STATUSES.has(blocker.status));
}

function findPrimaryBlocker(
  primary: DirectorReport["recommendation"]["primary_recommendation"],
  openBlockers: Blocker[]
): Blocker | null {
  if (primary.related_blocker_ids.length === 0) {
    return null;
  }

  return (
    openBlockers.find((blocker) => primary.related_blocker_ids.includes(blocker.id)) ??
    null
  );
}

function collectTextParts(state: ProjectState, primaryAction: NextAction | undefined): string[] {
  const goal = state.goals.find((entry) => entry.id === state.current_state.primary_goal_id);
  const parts = [
    state.project.title,
    state.project.summary,
    state.current_state.summary,
    state.current_state.phase ?? "",
    goal?.title ?? "",
    goal?.description ?? "",
    primaryAction?.title ?? "",
    primaryAction?.description ?? "",
  ];

  for (const doc of state.reference_docs ?? []) {
    parts.push(doc.title, doc.summary ?? "");
  }

  return parts;
}

export function buildProjectScoreContext(
  state: ProjectState,
  report: DirectorReport
): ProjectScoreContext {
  const primary = report.recommendation.primary_recommendation;
  const openBlockers = collectOpenBlockers(state);
  const primaryAction = state.next_actions.find((action) => action.id === primary.entity_id);
  const textParts = collectTextParts(state, primaryAction);
  const combinedText = normalizeText(textParts);

  const metaKeywordHits = countKeywordHits(combinedText, META_KEYWORDS);
  const executionKeywordHits = countKeywordHits(combinedText, EXECUTION_KEYWORDS);

  const downstreamUnlockCount = primaryAction
    ? countDownstreamUnlocks(primaryAction.id, state.next_actions)
    : 0;

  const primaryBlocker = findPrimaryBlocker(primary, openBlockers);
  const inProgressCount = state.next_actions.filter(
    (action) => action.status === "in_progress"
  ).length;
  const pendingCount = state.next_actions.filter(
    (action) => action.status === "pending" || action.status === "in_progress"
  ).length;

  const isMetaWork =
    metaKeywordHits >= 2 &&
    downstreamUnlockCount <= 1 &&
    (primaryBlocker === null || primaryBlocker.severity === "medium" || primaryBlocker.severity === "low");

  const isFieldValidation =
    executionKeywordHits >= 1 &&
    primaryBlocker !== null &&
    (primaryBlocker.severity === "high" || primaryBlocker.severity === "critical") &&
    downstreamUnlockCount >= 1 &&
    pendingCount >= 3 &&
    !isMetaWork;

  return {
    state,
    report,
    primary,
    eligible: primary.eligible_for_primary,
    downstream_unlock_count: downstreamUnlockCount,
    open_blockers: openBlockers,
    primary_blocker: primaryBlocker,
    in_progress_count: inProgressCount,
    pending_count: pendingCount,
    meta_keyword_hits: metaKeywordHits,
    execution_keyword_hits: executionKeywordHits,
    is_meta_work: isMetaWork,
    is_field_validation: isFieldValidation,
  };
}

export function computeBlockerScore(context: ProjectScoreContext): number {
  if (context.open_blockers.length === 0) {
    return 0;
  }

  const severityWeight: Record<Blocker["severity"], number> = {
    low: 0.15,
    medium: 0.35,
    high: 0.7,
    critical: 0.95,
  };

  const maxSeverity = Math.max(
    ...context.open_blockers.map((blocker) => severityWeight[blocker.severity])
  );
  const density = Math.min(1, context.open_blockers.length / 4);

  return clamp(maxSeverity * 0.7 + density * 0.3);
}

export function computeMomentumScore(context: ProjectScoreContext): number {
  let score = 0;
  const reasons: PortfolioRecommendationReason[] = [];

  if (context.in_progress_count > 0) {
    score += 0.35;
    reasons.push({
      kind: "momentum_signal",
      message: `in_progress action が ${context.in_progress_count} 件ある`,
      weight: 1,
      score_delta: 0.35,
    });
  }

  if (context.primary.matches_current_primary) {
    score += 0.2;
    reasons.push({
      kind: "momentum_signal",
      message: "Director 推薦が current primary と一致している",
      weight: 1,
      score_delta: 0.2,
    });
  }

  const confidence = context.state.current_state.confidence;
  if (confidence !== null && confidence >= 0.7) {
    score += 0.15;
    reasons.push({
      kind: "momentum_signal",
      message: `current_state.confidence が ${confidence.toFixed(2)}`,
      weight: 1,
      score_delta: 0.15,
    });
  }

  const recentObservation = (context.state.observations ?? []).some((observation) => {
    const createdAt = new Date(observation.created_at).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return createdAt >= thirtyDaysAgo;
  });

  if (recentObservation) {
    score += 0.1;
    reasons.push({
      kind: "momentum_signal",
      message: "30 日以内の observation がある",
      weight: 1,
      score_delta: 0.1,
    });
  }

  if (context.eligible && context.pending_count > 0) {
    score += 0.05;
  }

  if (!context.eligible) {
    score -= 0.25;
  }

  if (context.state.project.status !== "active") {
    score -= 0.5;
  }

  if (!context.eligible && context.primary.reasons.some((r) => r.kind === "no_eligible_actions")) {
    score -= 0.4;
  }

  return clamp(score);
}

export function computeUrgencyScore(context: ProjectScoreContext): number {
  let score = 0;

  if (context.primary_blocker) {
    const blockerDelta =
      context.primary_blocker.severity === "critical"
        ? 0.3
        : context.primary_blocker.severity === "high"
          ? 0.25
          : context.primary_blocker.severity === "medium"
            ? 0.12
            : 0.05;
    score += blockerDelta;
  }

  if (context.eligible) {
    score += 0.2;
  }

  if (context.downstream_unlock_count > 0) {
    score += Math.min(0.25, context.downstream_unlock_count * 0.08);
  }

  score += context.report.recommendation.confidence * 0.15;

  if (context.primary_blocker === null && context.open_blockers.length > 0) {
    score += 0.05;
  }

  if (context.is_field_validation) {
    score += 0.08;
  }

  if (context.state.project.status !== "active") {
    score -= 0.3;
  }

  if (context.is_meta_work) {
    score -= 0.1;
  }

  return clamp(score);
}

export interface CrossProjectScoreResult {
  score: number;
  reasons: PortfolioRecommendationReason[];
}

export function computeCrossProjectScore(context: ProjectScoreContext): CrossProjectScoreResult {
  const reasons: PortfolioRecommendationReason[] = [];
  let raw = 0;

  const recommendationScore = context.primary.score;
  const directorComponent = recommendationScore * 0.4;
  raw += directorComponent;
  reasons.push({
    kind: "director_primary",
    message: `project 内 Director 推薦 score ${recommendationScore.toFixed(2)} を横断比較に反映`,
    entity_type: "next_action",
    entity_id: context.primary.entity_id,
    weight: 1,
    score_delta: directorComponent,
  });

  if (context.primary_blocker) {
    const severityDelta =
      context.primary_blocker.severity === "critical" || context.primary_blocker.severity === "high"
        ? 0.1
        : 0.05;
    raw += severityDelta;
    reasons.push({
      kind: "blocker_severity",
      message: `primary action に紐づく open blocker severity: ${context.primary_blocker.severity}`,
      entity_type: "blocker",
      entity_id: context.primary_blocker.id,
      weight: 1,
      score_delta: severityDelta,
    });
  }

  if (context.downstream_unlock_count > 0) {
    const delta = Math.min(0.16, context.downstream_unlock_count * 0.04);
    raw += delta;
    reasons.push({
      kind: "downstream_unlock",
      message: `完了で ${context.downstream_unlock_count} 件の downstream action が解放される`,
      entity_type: "next_action",
      entity_id: context.primary.entity_id,
      weight: 1,
      score_delta: delta,
    });
  }

  if (context.eligible) {
    raw += 0.1;
    reasons.push({
      kind: "dependency_ready",
      message: "前提 action は完了済み（または依存なし）で着手可能",
      entity_type: "next_action",
      entity_id: context.primary.entity_id,
      weight: 1,
      score_delta: 0.1,
    });
  } else {
    raw -= 0.35;
    reasons.push({
      kind: "dependency_blocked",
      message: "primary action が依存未完了のため横断 primary 候補から外れる",
      entity_type: "next_action",
      entity_id: context.primary.entity_id,
      weight: -1,
      score_delta: -0.35,
    });
  }

  if (context.state.project.status === "active") {
    raw += 0.05;
    reasons.push({
      kind: "project_active",
      message: "project.status が active",
      entity_type: "project",
      entity_id: context.state.project.id,
      weight: 1,
      score_delta: 0.05,
    });
  }

  const urgencyScore = computeUrgencyScore(context);
  const urgencyComponent = urgencyScore * 0.25;
  raw += urgencyComponent;
  reasons.push({
    kind: "urgency_high",
    message: `urgency ${urgencyScore.toFixed(2)} を横断比較に反映`,
    weight: 1,
    score_delta: urgencyComponent,
  });

  const momentumScore = computeMomentumScore(context);
  const momentumComponent = momentumScore * 0.1;
  raw += momentumComponent;
  reasons.push({
    kind: "momentum_signal",
    message: `momentum ${momentumScore.toFixed(2)} を横断比較に反映`,
    weight: 1,
    score_delta: momentumComponent,
  });

  if (context.is_field_validation) {
    raw += 0.08;
    reasons.push({
      kind: "field_validation_priority",
      message: "現場検証・実行チェーン先頭の構造シグナル",
      entity_type: "project",
      entity_id: context.state.project.id,
      weight: 1,
      score_delta: 0.08,
    });
  }

  if (context.is_meta_work) {
    raw -= 0.12;
    reasons.push({
      kind: "meta_work_defer",
      message: "メタ改善系 project — 実行系 project を優先するため減点",
      entity_type: "project",
      entity_id: context.state.project.id,
      weight: -1,
      score_delta: -0.12,
    });
  }

  if (context.state.project.status === "paused" || context.state.project.status === "archived") {
    raw -= 0.4;
    reasons.push({
      kind: "project_inactive_penalty",
      message: `project.status が ${context.state.project.status}`,
      entity_type: "project",
      entity_id: context.state.project.id,
      weight: -1,
      score_delta: -0.4,
    });
  }

  if (context.state.project.status === "completed") {
    raw -= 0.6;
    reasons.push({
      kind: "project_inactive_penalty",
      message: "project.status が completed",
      entity_type: "project",
      entity_id: context.state.project.id,
      weight: -1,
      score_delta: -0.6,
    });
  }

  if (
    !context.eligible &&
    context.primary.reasons.some((reason) => reason.kind === "no_eligible_actions")
  ) {
    raw -= 0.5;
    reasons.push({
      kind: "no_eligible_actions",
      message: "推薦可能 action がない",
      entity_type: "project",
      entity_id: context.state.project.id,
      weight: -1,
      score_delta: -0.5,
    });
  }

  const momentum = computeMomentumScore(context);
  if (context.eligible && momentum < 0.25 && context.pending_count > 0) {
    raw -= 0.15;
    reasons.push({
      kind: "stalled_penalty",
      message: "movement シグナルが弱く stalled 寄り",
      entity_type: "project",
      entity_id: context.state.project.id,
      weight: -1,
      score_delta: -0.15,
    });
  }

  return {
    score: clamp(raw),
    reasons,
  };
}

export function computeHealthScore(input: {
  recommendationScore: number;
  momentumScore: number;
  urgencyScore: number;
  blockerScore: number;
  stalledPenalty: boolean;
  inactivePenalty: boolean;
}): number {
  let score =
    0.35 * input.recommendationScore +
    0.25 * input.momentumScore +
    0.25 * input.urgencyScore +
    0.15 * (1 - input.blockerScore);

  if (input.stalledPenalty) {
    score -= 0.15;
  }

  if (input.inactivePenalty) {
    score -= 0.3;
  }

  return clamp(score);
}

export function resolveHealthStatus(input: {
  projectStatus: ProjectState["project"]["status"];
  eligible: boolean;
  momentumScore: number;
  noEligibleActions: boolean;
}): ProjectHealthStatus {
  if (input.projectStatus === "paused" || input.projectStatus === "archived") {
    return "paused";
  }

  if (input.projectStatus === "completed" || input.noEligibleActions) {
    return "completed";
  }

  if (!input.eligible) {
    return "blocked";
  }

  if (input.momentumScore >= 0.55) {
    return "progressing";
  }

  if (input.momentumScore >= 0.25) {
    return "ready";
  }

  return "stalled";
}
