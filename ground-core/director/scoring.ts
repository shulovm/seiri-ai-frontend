import type {
  Blocker,
  NextAction,
  ProjectState,
} from "../types.js";
import type { RecommendationReason } from "./types.js";

export interface ScoredAction {
  action: NextAction;
  score: number;
  raw_score: number;
  reasons: RecommendationReason[];
  related_blocker_ids: string[];
  blocked_by_action_ids: string[];
  matches_current_primary: boolean;
  eligible_for_primary: boolean;
  downstream_unlock_count: number;
}

const OPEN_BLOCKER_STATUSES = new Set<Blocker["status"]>(["open"]);

export function isDependencyReady(
  action: NextAction,
  actionsById: Map<string, NextAction>
): boolean {
  if (!action.depends_on_action_id) {
    return true;
  }

  const dependency = actionsById.get(action.depends_on_action_id);
  return dependency?.status === "done";
}

export function countDownstreamUnlocks(
  actionId: string,
  actions: NextAction[]
): number {
  return actions.filter((candidate) => candidate.depends_on_action_id === actionId)
    .length;
}

function sortOrderBonus(sortOrder: number): number {
  return Math.max(0, 0.1 - sortOrder * 0.025);
}

function clampScore(value: number): number {
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

export function scoreAction(
  state: ProjectState,
  action: NextAction,
  actionsById: Map<string, NextAction>,
  openBlockersById: Map<string, Blocker>
): ScoredAction {
  const reasons: RecommendationReason[] = [];
  let rawScore = 0;

  const dependencyReady = isDependencyReady(action, actionsById);
  const blockedByActionIds =
    action.depends_on_action_id && !dependencyReady
      ? [action.depends_on_action_id]
      : [];

  if (dependencyReady) {
    rawScore += 0.2;
    reasons.push({
      kind: "dependency_ready",
      message: "前提 action は完了済み（または依存なし）で着手可能",
      weight: 1,
      score_delta: 0.2,
    });
  } else {
    const dependency = actionsById.get(action.depends_on_action_id ?? "");
    rawScore -= 0.5;
    reasons.push({
      kind: "dependency_blocked",
      message: dependency
        ? `前提 action「${dependency.title}」が未完了のため primary 推薦不可`
        : "前提 action が未完了のため primary 推薦不可",
      entity_type: "next_action",
      entity_id: action.depends_on_action_id ?? undefined,
      weight: -1,
      score_delta: -0.5,
    });
  }

  const matchesPrimary =
    state.current_state.primary_next_action_id === action.id;

  if (matchesPrimary) {
    rawScore += 0.35;
    reasons.push({
      kind: "primary_action",
      message: `current_state の primary_next_action と一致: ${action.title}`,
      entity_type: "next_action",
      entity_id: action.id,
      weight: 1,
      score_delta: 0.35,
    });
  }

  if (
    state.current_state.primary_goal_id &&
    action.goal_id === state.current_state.primary_goal_id
  ) {
    const goal = state.goals.find((entry) => entry.id === action.goal_id);
    rawScore += 0.15;
    reasons.push({
      kind: "goal_alignment",
      message: goal
        ? `primary goal「${goal.title}」に属する`
        : "primary goal に属する",
      entity_type: "goal",
      entity_id: action.goal_id ?? undefined,
      weight: 1,
      score_delta: 0.15,
    });
  }

  const relatedBlockerIds: string[] = [];
  if (action.blocker_id) {
    const blocker = openBlockersById.get(action.blocker_id);
    if (blocker) {
      relatedBlockerIds.push(blocker.id);
      rawScore += 0.1;
      reasons.push({
        kind: "blocker_link",
        message: `open blocker「${blocker.title}」の解消に直結`,
        entity_type: "blocker",
        entity_id: blocker.id,
        weight: 1,
        score_delta: 0.1,
      });

      if (blocker.severity === "high" || blocker.severity === "critical") {
        rawScore -= 0.1;
        reasons.push({
          kind: "blocker_severity",
          message: `未解決 blocker の severity が ${blocker.severity}`,
          entity_type: "blocker",
          entity_id: blocker.id,
          weight: -1,
          score_delta: -0.1,
        });
      } else {
        reasons.push({
          kind: "blocker_severity",
          message: `blocker severity: ${blocker.severity}`,
          entity_type: "blocker",
          entity_id: blocker.id,
          weight: 0,
          score_delta: 0,
        });
      }
    }
  }

  const downstreamUnlockCount = countDownstreamUnlocks(action.id, state.next_actions);
  if (downstreamUnlockCount > 0) {
    const delta = Math.min(0.15, downstreamUnlockCount * 0.05);
    rawScore += delta;
    reasons.push({
      kind: "unlocks_downstream",
      message: `完了すると ${downstreamUnlockCount} 件の downstream action が解放される`,
      weight: 1,
      score_delta: delta,
    });
  }

  const sortBonus = sortOrderBonus(action.sort_order);
  if (sortBonus > 0) {
    rawScore += sortBonus;
    reasons.push({
      kind: "sort_order",
      message: `action chain 上の sort_order=${action.sort_order}`,
      entity_type: "next_action",
      entity_id: action.id,
      weight: 1,
      score_delta: sortBonus,
    });
  }

  if (state.project.status !== "active") {
    rawScore -= 0.3;
    reasons.push({
      kind: "project_status",
      message: `project.status が ${state.project.status} のため推薦 confidence を下げる`,
      entity_type: "project",
      entity_id: state.project.id,
      weight: -1,
      score_delta: -0.3,
    });
  }

  if (
    state.current_state.primary_next_action_id &&
    !matchesPrimary &&
    dependencyReady
  ) {
    const currentPrimary = actionsById.get(state.current_state.primary_next_action_id);
    if (currentPrimary && rawScore > 0) {
      reasons.push({
        kind: "primary_mismatch",
        message: currentPrimary
          ? `current primary は「${currentPrimary.title}」だが、スコア上はこの action を推奨`
          : "current primary と異なる action を推奨",
        entity_type: "next_action",
        entity_id: state.current_state.primary_next_action_id,
        weight: 0,
        score_delta: 0,
      });
    }
  }

  if (reasons.length === 0) {
    reasons.push({
      kind: "sort_order",
      message: `pending action: ${action.title}`,
      entity_type: "next_action",
      entity_id: action.id,
      weight: 0,
      score_delta: 0,
    });
  }

  return {
    action,
    score: clampScore(rawScore),
    raw_score: rawScore,
    reasons,
    related_blocker_ids: relatedBlockerIds,
    blocked_by_action_ids: blockedByActionIds,
    matches_current_primary: matchesPrimary,
    eligible_for_primary: dependencyReady,
    downstream_unlock_count: downstreamUnlockCount,
  };
}

export function scoreAllActions(state: ProjectState): ScoredAction[] {
  const actionsById = new Map(state.next_actions.map((action) => [action.id, action]));
  const openBlockersById = new Map(
    state.blockers
      .filter((blocker) => OPEN_BLOCKER_STATUSES.has(blocker.status))
      .map((blocker) => [blocker.id, blocker])
  );

  return state.next_actions
    .filter((action) =>
      action.status === "pending" || action.status === "in_progress"
    )
    .map((action) => scoreAction(state, action, actionsById, openBlockersById))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.action.sort_order - b.action.sort_order;
    });
}
