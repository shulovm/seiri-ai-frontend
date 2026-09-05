import type { StudioFlowStep, StudioReason } from "./types.js";

const BANNED_PHRASES = ["なんとなく", "適当", "よしなに"];

export function truncateText(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 1)}…`;
}

export function joinSentences(sentences: string[]): string {
  return sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0)
    .join("");
}

export function summarizeReasons(reasons: StudioReason[], minCount = 2, maxCount = 4): string[] {
  const messages = reasons
    .map((reason) => reason.message.trim())
    .filter((message) => message.length > 0);

  if (messages.length >= minCount) {
    return messages.slice(0, maxCount);
  }

  return messages;
}

export function formatIntentLabel(intent: StudioFlowStep["intent"]): string {
  switch (intent) {
    case "deep_work":
      return "深い作業";
    case "light_touch":
      return "軽い接触";
    case "defer":
      return "後回し配置";
    case "observe":
      return "観察";
    default:
      return intent;
  }
}

export function formatTimeBoxLabel(timeBox: StudioFlowStep["time_box"]): string {
  switch (timeBox) {
    case "morning":
      return "午前";
    case "afternoon":
      return "午後";
    case "later":
      return "後半";
    case "session":
      return "セッション";
    case "now":
      return "今";
    default:
      return timeBox;
  }
}

export function assertNoBannedPhrases(text: string): void {
  for (const phrase of BANNED_PHRASES) {
    if (text.includes(phrase)) {
      throw new Error(`Narrative contains banned phrase: ${phrase}`);
    }
  }
}

export function assertNonEmpty(fieldName: string, value: string): void {
  if (value.trim().length === 0) {
    throw new Error(`Narrative field "${fieldName}" must not be empty`);
  }
}

export function countSentences(text: string): number {
  return text
    .split(/[。！？]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
}
