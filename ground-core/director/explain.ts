import type {
  ActionRecommendation,
  BlockerSnapshot,
  ConfidenceFactor,
  SituationSnapshot,
} from "./types.js";

function formatReasonLines(recommendation: ActionRecommendation): string[] {
  return recommendation.reasons.map((reason) => {
    const delta =
      reason.score_delta === undefined
        ? ""
        : ` (${reason.score_delta >= 0 ? "+" : ""}${reason.score_delta.toFixed(2)})`;
    return `  - ${reason.message}${delta}`;
  });
}

export function buildSummaryText(input: {
  project_id: string;
  situation: SituationSnapshot;
  open_blockers: BlockerSnapshot[];
  primary: ActionRecommendation;
  alternatives: ActionRecommendation[];
  confidence: number;
}): string {
  const lines: string[] = [
    "GROUND Core Director Report",
    `project: ${input.situation.project_title} (${input.project_id})`,
    "",
    `Current Phase: ${input.situation.phase ?? "(none)"}`,
  ];

  if (input.situation.primary_goal_title) {
    lines.push(`Primary Goal: ${input.situation.primary_goal_title}`);
  }

  lines.push(
    "",
    `Open Blockers (${input.open_blockers.length}):`,
    ...(input.open_blockers.length > 0
      ? input.open_blockers.map(
          (blocker) => `  - [${blocker.severity}] ${blocker.title}`
        )
      : ["  - (none)"])
  );

  lines.push(
    "",
    "Primary Recommendation:",
    `  ${input.primary.label}`,
    `  score: ${input.primary.score.toFixed(2)} | confidence: ${input.confidence.toFixed(2)}`,
    "",
    "Reasons:",
    ...formatReasonLines(input.primary)
  );

  if (input.primary.related_blocker_ids.length > 0) {
    const blockedBy = input.open_blockers.find((blocker) =>
      input.primary.related_blocker_ids.includes(blocker.blocker_id)
    );
    if (blockedBy) {
      lines.push("", `Blocked By: ${blockedBy.title}`);
    }
  }

  lines.push("", "Alternative Recommendations:");
  if (input.alternatives.length === 0) {
    lines.push("  （なし）");
  } else {
    for (const alternative of input.alternatives) {
      lines.push(`  - ${alternative.label} (score: ${alternative.score.toFixed(2)})`);
      for (const line of formatReasonLines(alternative)) {
        lines.push(`    ${line.trimStart()}`);
      }
    }
  }

  lines.push("", "requires_human_decision: true");

  return lines.join("\n");
}

export function computeConfidence(
  primary: ActionRecommendation,
  alternatives: ActionRecommendation[],
  projectStatusFactor: number
): { confidence: number; factors: ConfidenceFactor[] } {
  const dependencyFactor = primary.blocked_by_action_ids.length === 0 ? 1 : 0.5;
  const secondScore = alternatives[0]?.score ?? 0;
  const ambiguityPenalty =
    alternatives.length > 0 && primary.score - secondScore < 0.1 ? 0.85 : 1;

  const confidence = Math.min(
    1,
    Math.max(
      0,
      Number(
        (
          primary.score *
          dependencyFactor *
          projectStatusFactor *
          ambiguityPenalty
        ).toFixed(2)
      )
    )
  );

  const factors: ConfidenceFactor[] = [
    {
      label: "primary_score",
      value: primary.score,
      explanation: `normalized primary score ${primary.score.toFixed(2)}`,
    },
    {
      label: "dependency_factor",
      value: dependencyFactor,
      explanation:
        dependencyFactor === 1
          ? "depends_on なし、または依存先完了"
          : "depends_on 未完了で confidence を下げる",
    },
    {
      label: "project_status_factor",
      value: projectStatusFactor,
      explanation:
        projectStatusFactor === 1
          ? "project.status is active"
          : "project.status is not active",
    },
    {
      label: "ambiguity_penalty",
      value: ambiguityPenalty,
      explanation:
        ambiguityPenalty < 1
          ? "alternative が primary に近い score"
          : "alternative との差が十分",
    },
  ];

  return { confidence, factors };
}

export function toActionRecommendation(scored: {
  action: { id: string; title: string };
  score: number;
  reasons: ActionRecommendation["reasons"];
  related_blocker_ids: string[];
  blocked_by_action_ids: string[];
  matches_current_primary: boolean;
  eligible_for_primary: boolean;
}): ActionRecommendation {
  return {
    entity_type: "next_action",
    entity_id: scored.action.id,
    label: scored.action.title,
    score: scored.score,
    reasons: scored.reasons,
    related_blocker_ids: scored.related_blocker_ids,
    blocked_by_action_ids: scored.blocked_by_action_ids,
    matches_current_primary: scored.matches_current_primary,
    eligible_for_primary: scored.eligible_for_primary,
  };
}

export function buildSituationSnapshot(
  state: import("../types.js").ProjectState,
  openBlockerCount: number,
  pendingActionCount: number
): SituationSnapshot {
  const primaryGoal = state.goals.find(
    (goal) => goal.id === state.current_state.primary_goal_id
  );
  const primaryAction = state.next_actions.find(
    (action) => action.id === state.current_state.primary_next_action_id
  );

  return {
    project_title: state.project.title,
    project_status: state.project.status,
    phase: state.current_state.phase,
    primary_goal_id: state.current_state.primary_goal_id,
    primary_goal_title: primaryGoal?.title ?? null,
    primary_next_action_id: state.current_state.primary_next_action_id,
    primary_next_action_title: primaryAction?.title ?? null,
    state_summary: state.current_state.summary,
    state_confidence: state.current_state.confidence,
    pending_action_count: pendingActionCount,
    open_blocker_count: openBlockerCount,
  };
}

export function collectOpenBlockers(
  state: import("../types.js").ProjectState
): BlockerSnapshot[] {
  return state.blockers
    .filter((blocker) => blocker.status === "open")
    .map((blocker) => ({
      blocker_id: blocker.id,
      title: blocker.title,
      severity: blocker.severity,
      status: blocker.status,
      linked_action_ids: state.next_actions
        .filter((action) => action.blocker_id === blocker.id)
        .map((action) => action.id),
    }));
}

export function buildNoEligiblePrimary(): ActionRecommendation {
  return {
    entity_type: "next_action",
    entity_id: "",
    label: "(no eligible next_action)",
    score: 0,
    reasons: [
      {
        kind: "no_eligible_actions",
        message: "pending / in_progress かつ depends_on 完了済みの action がありません",
        weight: 0,
        score_delta: 0,
      },
    ],
    related_blocker_ids: [],
    blocked_by_action_ids: [],
    matches_current_primary: false,
    eligible_for_primary: false,
  };
}

export function projectStatusFactor(
  status: import("../types.js").ProjectStatus
): number {
  return status === "active" ? 1 : 0.7;
}
