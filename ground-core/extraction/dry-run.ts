import { PatchError } from "../errors.js";
import { applyPatch } from "../state-engine.js";
import type { PatchOperation, ProjectState, StatePatch } from "../types.js";
import type { DryRunResult, OperationSummary } from "./types.js";

function summarizeOperation(operation: PatchOperation, state: ProjectState): OperationSummary {
  const base = {
    operation: operation.op,
    entity: operation.entity,
    entity_id: operation.entity_id,
  };

  if (operation.op === "status_change") {
    const label = findEntityLabel(state, operation.entity, operation.entity_id);
    return {
      ...base,
      label,
      effect: `${label} → ${operation.status ?? "unknown"}`,
    };
  }

  if (operation.op === "delete") {
    const label = findEntityLabel(state, operation.entity, operation.entity_id);
    return {
      ...base,
      label,
      effect: `delete ${label}`,
    };
  }

  if (operation.entity === "observation") {
    const title =
      typeof operation.payload?.title === "string"
        ? operation.payload.title
        : operation.entity_id;
    return {
      ...base,
      label: `observation: ${title}`,
      effect: "新規 observation を追加",
    };
  }

  if (operation.entity === "current_state") {
    const primaryId =
      typeof operation.payload?.primary_next_action_id === "string"
        ? operation.payload.primary_next_action_id
        : null;
    const nextAction = primaryId
      ? state.next_actions.find((action) => action.id === primaryId)
      : undefined;
    const label = nextAction?.title ?? primaryId ?? "current_state";
    return {
      ...base,
      label: `current_state: ${label}`,
      effect: primaryId
        ? `primary_next_action_id → ${label}`
        : "current_state を更新",
    };
  }

  const label = findEntityLabel(state, operation.entity, operation.entity_id);
  return {
    ...base,
    label,
    effect: `${label} を更新`,
  };
}

function findEntityLabel(
  state: ProjectState,
  entity: PatchOperation["entity"],
  entityId: string
): string {
  switch (entity) {
    case "next_action": {
      const action = state.next_actions.find((entry) => entry.id === entityId);
      return action ? `next_action: ${action.title}` : entityId;
    }
    case "blocker": {
      const blocker = state.blockers.find((entry) => entry.id === entityId);
      return blocker ? `blocker: ${blocker.title}` : entityId;
    }
    case "project":
      return `project: ${state.project.title}`;
    case "goal": {
      const goal = state.goals.find((entry) => entry.id === entityId);
      return goal ? `goal: ${goal.title}` : entityId;
    }
    default:
      return `${entity}: ${entityId}`;
  }
}

export function dryRunPatch(state: ProjectState, patch: StatePatch): DryRunResult {
  const operation_summaries = patch.operations.map((operation) =>
    summarizeOperation(operation, state)
  );

  try {
    applyPatch(state, patch);
    return {
      valid: true,
      would_apply: true,
      operation_count: patch.operations.length,
      operation_summaries,
    };
  } catch (error) {
    const message =
      error instanceof PatchError
        ? error.message
        : error instanceof Error
          ? error.message
          : String(error);

    return {
      valid: false,
      would_apply: false,
      operation_count: patch.operations.length,
      operation_summaries,
      errors: [message],
    };
  }
}
