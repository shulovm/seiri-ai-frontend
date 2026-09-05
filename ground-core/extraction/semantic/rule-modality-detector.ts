import { randomUUID } from "node:crypto";
import type { ExtractionInput } from "../types.js";
import type { EventDetector } from "./event-detector.js";
import type {
  SemanticEvent,
  SemanticEventType,
  SemanticExtractionResult,
  SemanticModality,
  SemanticResolverHint,
  SemanticTargetKind,
} from "./types.js";

const NEGATIVE_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "やめたい", pattern: /やめたい/ },
  { label: "無理", pattern: /無理/ },
  { label: "だるい", pattern: /だるい/ },
];

const PRIORITY_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "まず", pattern: /まず/ },
  { label: "先に", pattern: /先に/ },
  { label: "からやる", pattern: /からやる/ },
  { label: "優先", pattern: /優先/ },
  { label: "次は", pattern: /次は/ },
];

const DEFERRED_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "考える", pattern: /考える/ },
  { label: "保留", pattern: /保留/ },
  { label: "後で", pattern: /後で/ },
];

const COMMITMENT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "決めた", pattern: /決めた/ },
  { label: "確定", pattern: /確定/ },
  { label: "これでいく", pattern: /これでいく/ },
];

const INTENT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "しようと思う", pattern: /しようと思う/ },
  { label: "かな", pattern: /かな/ },
  { label: "候補", pattern: /候補/ },
  { label: "やろう", pattern: /やろう/ },
];

const LOCATION_SLOT_PATTERNS = [/場所/, /会場/, /配布/, /スポット/];

function matchPatterns(
  text: string,
  patterns: Array<{ label: string; pattern: RegExp }>
): string[] {
  return patterns.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
}

function extractPriorityTargetSpan(text: string): string | undefined {
  const patterns = [
    /(?:まず|先に|次は)(.+?)からやる/,
    /先に(.+?)を(?:決める|する|やる)/,
    /(?:まず|先に|次は)(.+?)を(?:決める|する|やる)/,
    /(?:まず|先に|次は)(.+?)(?:する|やる)$/,
    /(.+?)を優先/,
    /優先(?:は|の)?(.+)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

function extractDeferredTargetSpan(text: string): string | undefined {
  const patterns = [/^(.+?)は後で/, /(.+?)を後で/, /(.+?)は後回し/];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

function detectTargetKind(text: string, type: SemanticEventType): SemanticTargetKind {
  if (type === "PriorityChanged" || type === "ActionDeferred") {
    return "next_action";
  }

  if (LOCATION_SLOT_PATTERNS.some((pattern) => pattern.test(text))) {
    return "location";
  }

  return "unknown";
}

function confidenceFor(type: SemanticEventType): number {
  switch (type) {
    case "CandidateCreated":
      return 0.62;
    case "DecisionMade":
      return 0.75;
    case "ActionDeferred":
      return 0.7;
    case "PriorityChanged":
      return 0.7;
    case "StopRequested":
      return 0.88;
  }
}

function buildResolverHint(
  type: SemanticEventType,
  text: string
): SemanticResolverHint {
  if (type === "PriorityChanged") {
    return {
      strategy: "semantic_match_next_action",
      raw_target_span: extractPriorityTargetSpan(text),
    };
  }

  if (type === "ActionDeferred") {
    const rawTargetSpan = extractDeferredTargetSpan(text);
    if (rawTargetSpan) {
      return {
        strategy: "semantic_match_next_action",
        raw_target_span: rawTargetSpan,
      };
    }
  }

  return { strategy: "none" };
}

function buildEvent(
  input: ExtractionInput,
  type: SemanticEventType,
  modality: SemanticModality,
  evidence: string[]
): SemanticEvent {
  return {
    id: randomUUID(),
    type,
    target_kind: detectTargetKind(input.input_text, type),
    modality,
    confidence: confidenceFor(type),
    evidence,
    raw_span: input.input_text,
    resolver_hint: buildResolverHint(type, input.input_text),
  };
}

function detectEvent(input: ExtractionInput): SemanticEvent | null {
  const text = input.input_text;

  const negative = matchPatterns(text, NEGATIVE_PATTERNS);
  if (negative.length > 0) {
    return buildEvent(input, "StopRequested", "negative", negative);
  }

  const priority = matchPatterns(text, PRIORITY_PATTERNS);
  if (priority.length > 0) {
    return buildEvent(input, "PriorityChanged", "commitment", priority);
  }

  const deferred = matchPatterns(text, DEFERRED_PATTERNS);
  if (deferred.length > 0) {
    return buildEvent(input, "ActionDeferred", "deferred", deferred);
  }

  const commitment = matchPatterns(text, COMMITMENT_PATTERNS);
  if (commitment.length > 0) {
    return buildEvent(input, "DecisionMade", "commitment", commitment);
  }

  const intent = matchPatterns(text, INTENT_PATTERNS);
  if (intent.length > 0) {
    return buildEvent(input, "CandidateCreated", "intent", intent);
  }

  return null;
}

export const ruleModalityDetector: EventDetector = {
  name: "rule-modality-v1",
  detect(input: ExtractionInput): SemanticExtractionResult {
    const event = detectEvent(input);

    return {
      events: event ? [event] : [],
      raw_input: input.input_text,
      created_at: new Date().toISOString(),
    };
  },
};
