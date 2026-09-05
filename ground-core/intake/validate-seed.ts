import {
  ACTION_INTENTS,
  type ActionIntent,
  type ExperimentSeed,
  type ExperimentSeedKind,
} from "./types.js";

const ALLOWED_KINDS: ExperimentSeedKind[] = [
  "content",
  "business",
  "product",
  "research",
  "other",
];

const STRING_ARRAY_FIELDS = [
  "assumptions",
  "constraints",
  "risks",
  "notes",
  "initial_next_actions",
  "initial_decisions",
  "initial_hypotheses",
  "initial_blockers",
  "tags",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertNonEmptyString(
  value: unknown,
  field: string,
  errors: string[]
): value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${field} must be a non-empty string`);
    return false;
  }
  return true;
}

function assertStringArray(
  value: unknown,
  field: string,
  errors: string[]
): value is string[] | undefined {
  if (value === undefined) {
    return true;
  }

  if (!Array.isArray(value)) {
    errors.push(`${field} must be an array of strings`);
    return false;
  }

  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    if (typeof item !== "string") {
      errors.push(`${field}[${index}] must be a string`);
    }
  }

  return errors.length === 0 || !errors.some((message) => message.startsWith(`${field}[`));
}

function assertActionIntents(
  value: unknown,
  actionCount: number,
  errors: string[]
): value is ExperimentSeed["action_intents"] {
  if (value === undefined) {
    return true;
  }

  if (!Array.isArray(value)) {
    errors.push("action_intents must be an array");
    return false;
  }

  const seenIndices = new Set<number>();

  for (let index = 0; index < value.length; index += 1) {
    const entry = value[index];
    const prefix = `action_intents[${index}]`;

    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      errors.push(`${prefix} must be an object`);
      continue;
    }

    const record = entry as Record<string, unknown>;

    if (typeof record.action_index !== "number" || !Number.isInteger(record.action_index)) {
      errors.push(`${prefix}.action_index must be an integer`);
    } else if (record.action_index < 0) {
      errors.push(`${prefix}.action_index must be >= 0`);
    } else if (actionCount === 0) {
      errors.push(`${prefix}.action_index is out of range (no initial_next_actions)`);
    } else if (record.action_index >= actionCount) {
      errors.push(
        `${prefix}.action_index ${record.action_index} is out of range (initial_next_actions length: ${actionCount})`
      );
    } else if (seenIndices.has(record.action_index)) {
      errors.push(`action_intents: duplicate action_index ${record.action_index}`);
    } else if (typeof record.action_index === "number" && Number.isInteger(record.action_index)) {
      seenIndices.add(record.action_index);
    }

    if (typeof record.intent !== "string") {
      errors.push(`${prefix}.intent must be a string`);
    } else if (!ACTION_INTENTS.includes(record.intent as ActionIntent)) {
      errors.push(
        `${prefix}.intent must be one of: ${ACTION_INTENTS.join(", ")}`
      );
    }

    if (
      record.rationale !== undefined &&
      (typeof record.rationale !== "string" || record.rationale.trim().length === 0)
    ) {
      errors.push(`${prefix}.rationale must be a non-empty string when provided`);
    }
  }

  return errors.length === 0 || !errors.some((message) => message.includes("action_intents"));
}

export function validateExperimentSeed(seed: unknown): ExperimentSeed {
  const errors: string[] = [];

  if (!isRecord(seed)) {
    throw new Error("ExperimentSeed must be a JSON object");
  }

  if (
    !assertNonEmptyString(seed.title, "title", errors) ||
    !assertNonEmptyString(seed.description, "description", errors)
  ) {
    // continue collecting other errors
  }

  if (typeof seed.kind !== "string" || !ALLOWED_KINDS.includes(seed.kind as ExperimentSeedKind)) {
    errors.push(`kind must be one of: ${ALLOWED_KINDS.join(", ")}`);
  }

  if (seed.id !== undefined && (typeof seed.id !== "string" || seed.id.trim().length === 0)) {
    errors.push("id must be a non-empty string when provided");
  }

  if (seed.summary !== undefined && typeof seed.summary !== "string") {
    errors.push("summary must be a string when provided");
  }

  if (seed.goal !== undefined && typeof seed.goal !== "string") {
    errors.push("goal must be a string when provided");
  }

  if (seed.target_output !== undefined && typeof seed.target_output !== "string") {
    errors.push("target_output must be a string when provided");
  }

  if (seed.created_at !== undefined && typeof seed.created_at !== "string") {
    errors.push("created_at must be a string when provided");
  }

  for (const field of STRING_ARRAY_FIELDS) {
    assertStringArray(seed[field], field, errors);
  }

  const actionCount = Array.isArray(seed.initial_next_actions)
    ? seed.initial_next_actions.length
    : 0;
  assertActionIntents(seed.action_intents, actionCount, errors);

  if (errors.length > 0) {
    throw new Error(`Invalid ExperimentSeed:\n- ${errors.join("\n- ")}`);
  }

  return seed as ExperimentSeed;
}
