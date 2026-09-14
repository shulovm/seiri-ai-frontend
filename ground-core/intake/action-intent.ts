import type { ActionIntent, ActionIntentRecord } from "./types.js";
import type { ProjectState } from "../types.js";

function readActionIntentRecords(state: ProjectState): ActionIntentRecord[] {
  const intake = state.extensions.intake as { action_intents?: ActionIntentRecord[] } | undefined;
  return intake?.action_intents ?? [];
}

export function getActionIntentRecords(state: ProjectState): ActionIntentRecord[] {
  return readActionIntentRecords(state);
}

export function getActionIntent(
  state: ProjectState,
  actionId: string
): ActionIntent | undefined {
  return readActionIntentRecords(state).find((entry) => entry.action_id === actionId)?.intent;
}
