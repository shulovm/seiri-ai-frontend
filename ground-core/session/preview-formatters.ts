import type { PatchOperation, StatePatch } from "../types.js";
import { payloadField } from "../types.js";
import type { BuildCompleteActionPatchResult } from "./types.js";

function formatOperationSummary(operation: PatchOperation, index: number): string {
  const order = `${index + 1}.`;

  if (operation.op === "status_change") {
    return `${order} status_change ${operation.entity} -> ${operation.status ?? "unknown"}`;
  }

  if (operation.op === "delete") {
    return `${order} delete ${operation.entity}`;
  }

  if (operation.entity === "decision") {
    const title =
      typeof operation.payload?.title === "string"
        ? operation.payload.title
        : operation.entity_id;
    return `${order} upsert decision: ${title}`;
  }

  if (operation.entity === "observation") {
    const title =
      typeof operation.payload?.title === "string"
        ? operation.payload.title
        : operation.entity_id;
    return `${order} upsert observation: ${title}`;
  }

  if (operation.entity === "current_state") {
    const primaryId = operation.payload?.primary_next_action_id;
    const primaryLine =
      primaryId === undefined
        ? "   primary_next_action_id: (unchanged)"
        : `   primary_next_action_id: ${primaryId ?? "null"}`;
    const summary =
      typeof operation.payload?.summary === "string"
        ? operation.payload.summary
        : null;
    const summaryLine =
      summary === null
        ? "   summary: (unchanged)"
        : `   summary: ${summary}`;

    return `${order} upsert current_state:\n${primaryLine}\n${summaryLine}`;
  }

  const label =
    typeof payloadField(operation.payload, "title") === "string"
      ? (payloadField(operation.payload, "title") as string)
      : operation.entity_id;

  return `${order} upsert ${operation.entity}: ${label}`;
}

function formatOperationsPreview(patch: StatePatch): string[] {
  return patch.operations.map((operation, index) =>
    formatOperationSummary(operation, index)
  );
}

function formatApplyInstructions(
  projectId: string,
  outPath: string | undefined
): string[] {
  if (outPath) {
    return [
      "apply:",
      `npm run ground-core -- patch ${projectId} --file ${outPath}`,
    ];
  }

  return [
    "apply:",
    "provide --out <path> to save this patch, then apply it with:",
    `npm run ground-core -- patch ${projectId} --file <path>`,
  ];
}

export function formatBuildCompleteActionPatchPreview(
  result: BuildCompleteActionPatchResult,
  outPath: string | undefined
): string {
  const lines = [
    "patch created",
    "",
    `project_id: ${result.patch.project_id}`,
    "",
    "completed action:",
    `- ${result.completed_action_title}`,
    "",
    "next primary action:",
    `- ${result.next_primary_action_title ?? "(none)"}`,
    "",
    "operations:",
    ...formatOperationsPreview(result.patch),
    "",
    "output:",
  ];

  if (outPath) {
    lines.push(`- ${outPath}`);
  } else {
    lines.push("- (not saved — patch body is not written to disk)");
    lines.push("- use --out <path> to save, or --format json to print JSON");
  }

  lines.push("", ...formatApplyInstructions(result.patch.project_id, outPath));

  return lines.join("\n");
}
