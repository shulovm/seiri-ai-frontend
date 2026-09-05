import { randomUUID } from "node:crypto";
import { assertSafePatch, PROPOSE_CONFIDENCE_THRESHOLD } from "../extraction/mock-extractor.js";
import { buildProposalFromDraft } from "../extraction/propose.js";
import type {
  ClarificationResponse,
  ExtractionDraft,
  ExtractionInput,
  PatchProposal,
} from "../extraction/types.js";
import type { PatchOperation, StatePatch } from "../types.js";
import type { RealityClassification } from "./semantics.js";
import { classifyRealityText } from "./semantics.js";

function nowIso(): string {
  return new Date().toISOString();
}

function buildRealityClarification(
  input: ExtractionInput,
  classification: RealityClassification,
  reason: string,
  questions: string[]
): ClarificationResponse {
  return {
    type: "clarification",
    project_id: input.project_id,
    input_text: input.input_text,
    reason,
    questions,
    risk_level: "medium",
    created_at: nowIso(),
  };
}

function observationOperation(
  input: ExtractionInput,
  title: string,
  body: string,
  observationId: string,
  timestamp: string,
  source: "manual" | "field_test" | "conversation" | "system"
): PatchOperation {
  return {
    op: "upsert",
    entity: "observation",
    entity_id: observationId,
    payload: {
      id: observationId,
      project_id: input.project_state.project.id,
      goal_id: input.project_state.current_state.primary_goal_id,
      title,
      body,
      source,
      observed_at: timestamp,
      created_at: timestamp,
      updated_at: timestamp,
    },
  };
}

/**
 * progress 用 phase 提案。
 * - 「つつある / 移行している」は完了断定しない → phase 変更しない
 * - 文章中の最新 vX.Y(.Z) と「実装/進んだ/到達」がある場合のみ、
 *   現行 phase を上書きする保守的ラベルを提案
 */
export function proposeProgressPhase(
  currentPhase: string | null,
  text: string
): string | null {
  if (/つつある|移行している|移行中/.test(text)) {
    return null;
  }

  const versions = text.match(/v\d+\.\d+(?:\.\d+)?/gi);
  if (!versions || versions.length === 0) {
    return null;
  }

  if (!/実装|進んだ|到達|成立/.test(text)) {
    return null;
  }

  const latest = versions[versions.length - 1];
  if (currentPhase && currentPhase.toLowerCase().includes(latest.toLowerCase())) {
    return null;
  }

  return `${latest}_progress`;
}

function buildProgressSummary(currentSummary: string, text: string): string {
  const note = /つつある|移行している|移行中/.test(text)
    ? `【進捗観測・移行中（完了断定しない）】${text}`
    : `【進捗観測】${text}`;

  if (!currentSummary.trim()) {
    return note;
  }

  return `${note}\n\n（従来 summary）\n${currentSummary}`;
}

function extractIntentionActionTitle(text: string): string {
  const cleaned = text
    .replace(/もしも工場は/g, "")
    .replace(/について/g, "")
    .trim();

  const match = cleaned.match(/(.+?)(?:したい|進めたい|やりたい)/);
  const base = (match?.[1] ?? cleaned).trim();
  if (base.length === 0) {
    return "意図された次アクション";
  }
  if (base.length <= 60) {
    return base;
  }
  return `${base.slice(0, 59)}…`;
}

function mapObservationDraft(
  input: ExtractionInput,
  classification: RealityClassification,
  source: "manual" | "field_test" | "conversation" | "system"
): ExtractionDraft {
  const timestamp = nowIso();
  const observationId = randomUUID();
  const operations: PatchOperation[] = [
    observationOperation(
      input,
      classification.title,
      classification.summary,
      observationId,
      timestamp,
      source
    ),
  ];

  const patch: StatePatch = {
    schema_version: "0.1.1",
    project_id: input.project_state.project.id,
    source: "extraction",
    operations,
  };
  assertSafePatch(patch);

  return {
    summary: `現実の観測事実を observation として記録する提案（evidence: ${classification.evidence.join(", ")}）。`,
    confidence: classification.confidence,
    risk_level: "low",
    proposed_patch: patch,
  };
}

function mapProgressDraft(
  input: ExtractionInput,
  classification: RealityClassification,
  source: "manual" | "field_test" | "conversation" | "system"
): ExtractionDraft {
  const timestamp = nowIso();
  const observationId = randomUUID();
  const state = input.project_state;
  const phaseProposal = proposeProgressPhase(state.current_state.phase, input.input_text);
  const operations: PatchOperation[] = [
    observationOperation(
      input,
      classification.title,
      classification.summary,
      observationId,
      timestamp,
      source
    ),
    {
      op: "upsert",
      entity: "current_state",
      entity_id: state.current_state.id,
      payload: {
        summary: buildProgressSummary(state.current_state.summary, input.input_text),
        ...(phaseProposal ? { phase: phaseProposal } : {}),
        updated_at: timestamp,
      },
    },
  ];

  const patch: StatePatch = {
    schema_version: "0.1.1",
    project_id: state.project.id,
    source: "extraction",
    operations,
  };
  assertSafePatch(patch);

  return {
    summary: phaseProposal
      ? `進捗観測を記録し、summary と保守的な phase 候補（${phaseProposal}）を提案する。自動適用はしない。`
      : `進捗観測を記録し、summary に「移行中/進捗」を反映する提案。phase は完了断定しないため変更しない。`,
    confidence: classification.confidence,
    risk_level: "medium",
    proposed_patch: patch,
  };
}

function mapIntentionDraft(
  input: ExtractionInput,
  classification: RealityClassification,
  source: "manual" | "field_test" | "conversation" | "system"
): ExtractionDraft {
  const timestamp = nowIso();
  const observationId = randomUUID();
  const actionId = randomUUID();
  const state = input.project_state;
  const actionTitle = extractIntentionActionTitle(input.input_text);
  const sortOrder =
    state.next_actions.reduce((max, action) => Math.max(max, action.sort_order), 0) + 10;

  const operations: PatchOperation[] = [
    observationOperation(
      input,
      classification.title,
      `【未実行の意図】${classification.summary}`,
      observationId,
      timestamp,
      source
    ),
    {
      op: "upsert",
      entity: "next_action",
      entity_id: actionId,
      payload: {
        id: actionId,
        project_id: state.project.id,
        goal_id: state.current_state.primary_goal_id,
        blocker_id: null,
        depends_on_action_id: null,
        title: actionTitle,
        description: `Reality intention 由来。完了事実ではない。原文: ${input.input_text}`,
        status: "pending",
        due_at: null,
        sort_order: sortOrder,
        created_at: timestamp,
        updated_at: timestamp,
      },
    },
  ];

  const patch: StatePatch = {
    schema_version: "0.1.1",
    project_id: state.project.id,
    source: "extraction",
    operations,
  };
  assertSafePatch(patch);

  return {
    summary:
      "未実行の意図を observation と pending next_action として提案する。完了・done への変換はしない。",
    confidence: classification.confidence,
    risk_level: "medium",
    proposed_patch: patch,
  };
}

export interface RealityProposeDraftResult {
  classification: RealityClassification;
  result: PatchProposal | ClarificationResponse;
}

/**
 * Reality Semantics → PatchProposal / Clarification
 * 既存 SemanticEvent 経路とは独立。呼び出し側で modality 優先後に使う。
 */
export function proposeFromRealitySemantics(
  input: ExtractionInput,
  options?: {
    source?: "manual" | "field_test" | "conversation" | "system";
  }
): RealityProposeDraftResult {
  const classification = classifyRealityText(input.input_text);
  const source = options?.source ?? "manual";

  if (classification.kind === "ambiguous") {
    return {
      classification,
      result: buildRealityClarification(
        input,
        classification,
        "観測事実と意図の手がかりが同時に含まれ、単一の Reality semantic に確定できない",
        [
          "これは既に完了した事実ですか、それとも今後やりたいことですか？",
          "完了部分と未実行の意図を分けて書けますか？",
        ]
      ),
    };
  }

  if (classification.kind === "unknown") {
    return {
      classification,
      result: buildRealityClarification(
        input,
        classification,
        "Reality Semantics でも既存 modality でも十分な手がかりがなかった",
        [
          "これは既に完了した事実ですか、それとも今後やりたいことですか？",
          "進捗の移行ですか、それとも単発の観測ですか？",
          "もう少し具体的な事実・進捗・意図を書けますか？",
        ]
      ),
    };
  }

  if (classification.confidence < PROPOSE_CONFIDENCE_THRESHOLD) {
    return {
      classification,
      result: buildRealityClarification(
        input,
        classification,
        `Reality semantic confidence (${classification.confidence.toFixed(2)}) が閾値未満`,
        [
          "これは既に完了した事実ですか、それとも今後やりたいことですか？",
          "もう少し具体的に書けますか？",
        ]
      ),
    };
  }

  let draft: ExtractionDraft;
  switch (classification.kind) {
    case "observation":
      draft = mapObservationDraft(input, classification, source);
      break;
    case "progress":
      draft = mapProgressDraft(input, classification, source);
      break;
    case "intention":
      draft = mapIntentionDraft(input, classification, source);
      break;
    default:
      return {
        classification,
        result: buildRealityClarification(
          input,
          classification,
          "未対応の Reality semantic",
          ["別の表現で書けますか？"]
        ),
      };
  }

  return {
    classification,
    result: buildProposalFromDraft(input, draft),
  };
}
