import { randomUUID } from "node:crypto";
import {
  isDependencyReady,
  scoreAllActions,
} from "../director/scoring.js";
import { ValidationError } from "../errors.js";
import { applyPatch } from "../state-engine.js";
import type {
  NextAction,
  ProjectState,
  StatePatch,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { validateProjectState, validateStatePatch } from "../validate.js";
import type {
  BuildCompleteActionPatchInput,
  BuildCompleteActionPatchResult,
} from "./types.js";

const COMPLETABLE_STATUSES = new Set<NextAction["status"]>([
  "pending",
  "in_progress",
]);

function nowIso(): string {
  return new Date().toISOString();
}

function findAction(state: ProjectState, actionId: string): NextAction {
  const action = state.next_actions.find((entry) => entry.id === actionId);
  if (!action) {
    throw new ValidationError(`next_action not found: ${actionId}`);
  }
  return action;
}

function assertCompletable(action: NextAction): void {
  if (!COMPLETABLE_STATUSES.has(action.status)) {
    throw new ValidationError(
      `next_action ${action.id} is not completable (status: ${action.status})`
    );
  }
}

function pickNextPrimaryAction(
  stateAfterComplete: ProjectState
): NextAction | null {
  const scored = scoreAllActions(stateAfterComplete);
  const eligible = scored.filter((entry) => entry.eligible_for_primary);
  return eligible[0]?.action ?? null;
}

function resolveNextPrimaryAction(
  state: ProjectState,
  completedActionId: string,
  overrideNextActionId: string | undefined
): NextAction | null {
  const simulated = applyPatch(state, {
    schema_version: SCHEMA_VERSION,
    project_id: state.project.id,
    source: "manual",
    operations: [
      {
        op: "status_change",
        entity: "next_action",
        entity_id: completedActionId,
        status: "done",
      },
    ],
  });

  if (overrideNextActionId) {
    const override = findAction(simulated, overrideNextActionId);
    if (!COMPLETABLE_STATUSES.has(override.status)) {
      throw new ValidationError(
        `next_action ${overrideNextActionId} is not eligible for primary (status: ${override.status})`
      );
    }

    const actionsById = new Map(
      simulated.next_actions.map((action) => [action.id, action])
    );
    if (!isDependencyReady(override, actionsById)) {
      throw new ValidationError(
        `next_action ${overrideNextActionId} dependencies are not ready`
      );
    }

    return override;
  }

  return pickNextPrimaryAction(simulated);
}

export function buildCompleteActionPatch(
  state: ProjectState,
  input: BuildCompleteActionPatchInput
): BuildCompleteActionPatchResult {
  const completedAction = findAction(state, input.action_id);
  assertCompletable(completedAction);

  const nextPrimary = resolveNextPrimaryAction(
    state,
    input.action_id,
    input.next_action_id
  );

  const now = input.applied_at ?? nowIso();
  const goalId =
    completedAction.goal_id ?? state.current_state.primary_goal_id ?? null;

  const operations: StatePatch["operations"] = [
    {
      op: "status_change",
      entity: "next_action",
      entity_id: completedAction.id,
      status: "done",
    },
  ];

  if (input.decision_title) {
    const decisionId = randomUUID();
    operations.push({
      op: "upsert",
      entity: "decision",
      entity_id: decisionId,
      payload: {
        id: decisionId,
        project_id: state.project.id,
        goal_id: goalId,
        title: input.decision_title,
        rationale: input.decision_rationale ?? input.decision_title,
        alternatives_considered: [],
        status: "active",
        decided_at: now,
        created_at: now,
        updated_at: now,
      },
    });
  }

  if (input.observation_title || input.observation_body) {
    const observationId = randomUUID();
    operations.push({
      op: "upsert",
      entity: "observation",
      entity_id: observationId,
      payload: {
        id: observationId,
        project_id: state.project.id,
        goal_id: goalId,
        title: input.observation_title ?? "作業メモ",
        body: input.observation_body ?? input.observation_title ?? "",
        source: "manual",
        observed_at: now,
        created_at: now,
        updated_at: now,
      },
    });
  }

  const currentStatePayload: Record<string, unknown> = {
    primary_next_action_id: nextPrimary?.id ?? null,
  };
  if (input.summary !== undefined) {
    currentStatePayload.summary = input.summary;
  }

  operations.push({
    op: "upsert",
    entity: "current_state",
    entity_id: state.current_state.id,
    payload: currentStatePayload,
  });

  const patch: StatePatch = {
    schema_version: SCHEMA_VERSION,
    project_id: state.project.id,
    source: input.source ?? "manual",
    operations,
    applied_at: input.applied_at,
  };

  const patchValidation = validateStatePatch(patch);
  if (!patchValidation.valid) {
    throw new ValidationError(
      "buildCompleteActionPatch produced invalid StatePatch",
      patchValidation.errors
    );
  }

  const dryRun = applyPatch(state, patch);
  const stateValidation = validateProjectState(dryRun);
  if (!stateValidation.valid) {
    throw new ValidationError(
      "buildCompleteActionPatch produced patch that fails applyPatch validation",
      stateValidation.errors
    );
  }

  const completed = dryRun.next_actions.find(
    (action) => action.id === completedAction.id
  );
  if (completed?.status !== "done") {
    throw new ValidationError(
      "buildCompleteActionPatch dry-run did not mark action as done"
    );
  }

  if (nextPrimary) {
    if (dryRun.current_state.primary_next_action_id !== nextPrimary.id) {
      throw new ValidationError(
        "buildCompleteActionPatch dry-run primary_next_action_id mismatch"
      );
    }
  } else if (dryRun.current_state.primary_next_action_id !== null) {
    throw new ValidationError(
      "buildCompleteActionPatch dry-run should clear primary_next_action_id when no next action"
    );
  }

  return {
    patch,
    completed_action_title: completedAction.title,
    next_primary_action_id: nextPrimary?.id ?? null,
    next_primary_action_title: nextPrimary?.title ?? null,
    operation_count: operations.length,
  };
}
