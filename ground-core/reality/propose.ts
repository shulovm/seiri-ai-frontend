import { randomUUID } from "node:crypto";
import type { ProposeExtractor } from "../extraction/propose.js";
import { runPropose } from "../extraction/propose.js";
import { isClarification } from "../extraction/types.js";
import { ruleModalityDetector } from "../extraction/semantic/rule-modality-detector.js";
import type { ProjectState } from "../types.js";
import { proposeFromRealitySemantics } from "./draft.js";
import { proposeCanonicalTranslation } from "./canonical-translation.js";
import type {
  GroundEvent,
  GroundEventSource,
  RealityProposeInput,
  RealityProposeResult,
} from "./types.js";

function nowIso(): string {
  return new Date().toISOString();
}

function deriveTitle(inputText: string): string {
  const trimmed = inputText.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 40) {
    return trimmed.length > 0 ? trimmed : "現実イベント";
  }

  return `${trimmed.slice(0, 39)}…`;
}

export function buildGroundEvent(
  input: RealityProposeInput,
  options?: { id?: string; createdAt?: string }
): GroundEvent {
  const createdAt = options?.createdAt ?? nowIso();
  const source: GroundEventSource = input.source ?? "manual";

  return {
    schema_version: "0.6.0",
    id: options?.id ?? randomUUID(),
    project_id: input.project_id,
    source,
    occurred_at: input.occurred_at ?? createdAt,
    input_text: input.input_text,
    title: deriveTitle(input.input_text),
    summary: input.input_text.trim(),
    created_at: createdAt,
  };
}

/**
 * Reality Loop Stage 1〜2 (v0.6.1):
 * Event 入力 → Patch Proposal
 *
 * 経路:
 * 1. 既存 Semantic modality（Candidate/Decision/...）が検出できれば再利用
 * 2. そうでなければ Reality Semantics（observation/progress/intention）
 * 3. いずれも不足なら Reality 向け Clarification
 *
 * 副作用なし。ProjectState は変更しない。
 */
export function proposeFromReality(
  projectState: ProjectState,
  input: RealityProposeInput,
  extractor: ProposeExtractor | "canonical" = "semantic"
): RealityProposeResult {
  if (projectState.project.id !== input.project_id) {
    throw new Error(
      `project_id mismatch: input=${input.project_id} state=${projectState.project.id}`
    );
  }

  const text = input.input_text.trim();
  if (!text) {
    throw new Error("Reality event input_text is empty");
  }

  const groundEvent = buildGroundEvent(input);
  const extractionInput = {
    project_id: input.project_id,
    input_text: text,
    project_state: projectState,
    source: input.source ?? "manual",
  };

  if (extractor === "canonical") {
    const translation = proposeCanonicalTranslation(projectState, input);
    if (translation) return Object.assign({
      schema_version: "0.6.1" as const, ground_event: groundEvent,
      result: translation.result, project_state_mutated: false as const,
      loop_stage: "propose" as const, requires_human_apply: true as const,
      reality_classification: null,
    }, { translation_trace: translation.trace });
  }

  // mock 経路は fixture 依存の旧 extractor をそのまま使う（回帰互換）
  if (extractor === "mock") {
    const result = runPropose(extractionInput, "mock");
    return {
      schema_version: "0.6.1",
      ground_event: groundEvent,
      result,
      project_state_mutated: false,
      loop_stage: "propose",
      requires_human_apply: true,
      reality_classification: null,
    };
  }

  // 既存 modality が取れるなら最優先で既存 semantic propose を再利用
  const modalityEvents = ruleModalityDetector.detect(extractionInput).events;
  if (modalityEvents.length > 0) {
    const result = runPropose(extractionInput, "semantic");
    return {
      schema_version: "0.6.1",
      ground_event: groundEvent,
      result,
      project_state_mutated: false,
      loop_stage: "propose",
      requires_human_apply: true,
      reality_classification: null,
    };
  }

  // Reality Semantics — observation / progress / intention
  const reality = proposeFromRealitySemantics(extractionInput, {
    source: input.source ?? "manual",
  });

  return {
    schema_version: "0.6.1",
    ground_event: groundEvent,
    result: reality.result,
    project_state_mutated: false,
    loop_stage: "propose",
    requires_human_apply: true,
    reality_classification: reality.classification,
  };
}

export function isRealityProposalReady(
  proposeResult: RealityProposeResult
): boolean {
  return !isClarification(proposeResult.result);
}
