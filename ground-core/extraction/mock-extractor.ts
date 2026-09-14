import { randomUUID } from "node:crypto";
import type {
  Blocker,
  NextAction,
  PatchOperation,
  ProjectState,
  StatePatch,
} from "../types.js";
import type {
  ClarificationResponse,
  ExtractionDraft,
  ExtractionInput,
  Extractor,
} from "./types.js";

export const PROPOSE_CONFIDENCE_THRESHOLD = 0.55;
export const MAX_PATCH_OPERATIONS = 8;

const QUIT_KEYWORDS = ["やめる", "だるい", "もう無理"] as const;

function nowIso(): string {
  return new Date().toISOString();
}

function isFreeWaterProject(state: ProjectState, inputText: string): boolean {
  return (
    state.project.title === "FreeWater" ||
    /freewater/i.test(inputText) ||
    inputText.includes("無料水")
  );
}

function isMomotaroProject(state: ProjectState, inputText: string): boolean {
  return (
    state.project.title.includes("Momotaro") ||
    inputText.includes("桃太郎") ||
    inputText.includes("Momotaro")
  );
}

function matchesQuitInput(inputText: string): boolean {
  return QUIT_KEYWORDS.some((keyword) => inputText.includes(keyword));
}

function matchesLocationInput(inputText: string): boolean {
  return inputText.includes("場所") || inputText.includes("新宿中央公園");
}

function matchesCharacterFocusInput(inputText: string): boolean {
  return inputText.includes("キャラ固定");
}

function findBlockerByTitle(state: ProjectState, titlePart: string): Blocker | undefined {
  return state.blockers.find((blocker) => blocker.title.includes(titlePart));
}

function findNextActionByTitle(
  state: ProjectState,
  titlePart: string
): NextAction | undefined {
  return state.next_actions.find((action) => action.title.includes(titlePart));
}

function buildObservationOperation(
  state: ProjectState,
  title: string,
  body: string,
  observationId: string,
  timestamp: string
): PatchOperation {
  return {
    op: "upsert",
    entity: "observation",
    entity_id: observationId,
    payload: {
      id: observationId,
      project_id: state.project.id,
      goal_id: state.current_state.primary_goal_id,
      title,
      body,
      source: "conversation",
      observed_at: timestamp,
      created_at: timestamp,
      updated_at: timestamp,
    },
  };
}

function buildQuitClarification(input: ExtractionInput): ClarificationResponse {
  return {
    type: "clarification",
    project_id: input.project_id,
    input_text: input.input_text,
    reason: "感情・一時判断の可能性があるため、自動で停止判定しない",
    questions: [
      "今日は一旦 hold にする？",
      "revise として方針修正にする？",
      "本当に stop 判断として記録したい？",
    ],
    risk_level: "high",
    created_at: nowIso(),
  };
}

function buildFreeWaterLocationDraft(input: ExtractionInput): ExtractionDraft | null {
  const { project_state: state } = input;

  if (!isFreeWaterProject(state, input.input_text) || !matchesLocationInput(input.input_text)) {
    return null;
  }

  const locationBlocker = findBlockerByTitle(state, "配布場所");
  const locationAction = findNextActionByTitle(state, "配布場所を1つ決める");
  const nextAction = state.next_actions
    .filter((action) => action.sort_order > (locationAction?.sort_order ?? -1))
    .sort((a, b) => a.sort_order - b.sort_order)[0];

  if (!locationBlocker || !locationAction || !nextAction) {
    return null;
  }

  const timestamp = nowIso();
  const observationId = randomUUID();
  const locationText = input.input_text.includes("新宿中央公園")
    ? "新宿中央公園"
    : "配布場所";

  const operations: PatchOperation[] = [
    buildObservationOperation(
      state,
      "配布場所の検討",
      `配布場所を${locationText}にしようとしている。`,
      observationId,
      timestamp
    ),
    {
      op: "status_change",
      entity: "blocker",
      entity_id: locationBlocker.id,
      status: "mitigated",
    },
    {
      op: "status_change",
      entity: "next_action",
      entity_id: locationAction.id,
      status: "done",
    },
    {
      op: "upsert",
      entity: "current_state",
      entity_id: state.current_state.id,
      payload: {
        primary_next_action_id: nextAction.id,
      },
    },
  ];

  const patch: StatePatch = {
    schema_version: "0.1.1",
    project_id: state.project.id,
    source: "extraction",
    operations,
  };

  return {
    summary:
      "配布場所を決定する方向で observation を記録し、配布場所 action を完了、次の primary action に移す提案。",
    confidence: 0.86,
    risk_level: "low",
    proposed_patch: patch,
  };
}

function buildMomotaroCharacterDraft(input: ExtractionInput): ExtractionDraft | null {
  const { project_state: state } = input;

  if (!isMomotaroProject(state, input.input_text) || !matchesCharacterFocusInput(input.input_text)) {
    return null;
  }

  const characterAction =
    findNextActionByTitle(state, "キャラクター固定") ??
    findNextActionByTitle(state, "キャラ固定");

  if (!characterAction) {
    return null;
  }

  const timestamp = nowIso();
  const observationId = randomUUID();

  const operations: PatchOperation[] = [
    buildObservationOperation(
      state,
      "制作優先順位メモ",
      "桃太郎制作はまずキャラ固定から進める。MJ文面は後回し。",
      observationId,
      timestamp
    ),
    {
      op: "upsert",
      entity: "current_state",
      entity_id: state.current_state.id,
      payload: {
        primary_next_action_id: characterAction.id,
      },
    },
  ];

  const patch: StatePatch = {
    schema_version: "0.1.1",
    project_id: state.project.id,
    source: "extraction",
    operations,
  };

  return {
    summary:
      "キャラ固定を primary action に設定し、優先順位メモを observation として記録する提案。",
    confidence: 0.78,
    risk_level: "low",
    proposed_patch: patch,
  };
}

function buildUnknownClarification(input: ExtractionInput): ClarificationResponse {
  return {
    type: "clarification",
    project_id: input.project_id,
    input_text: input.input_text,
    reason: "MockExtractor に一致するルールがありません",
    questions: [
      "どの next_action / blocker / observation を更新したいですか？",
      "FreeWater 配布場所、Momotaro キャラ固定、または停止意向のどれに近いですか？",
    ],
    risk_level: "medium",
    created_at: nowIso(),
  };
}

export const mockExtractor: Extractor = {
  propose(input: ExtractionInput): ExtractionDraft | ClarificationResponse {
    if (matchesQuitInput(input.input_text)) {
      return buildQuitClarification(input);
    }

    const freeWaterDraft = buildFreeWaterLocationDraft(input);
    if (freeWaterDraft) {
      return freeWaterDraft;
    }

    const momotaroDraft = buildMomotaroCharacterDraft(input);
    if (momotaroDraft) {
      return momotaroDraft;
    }

    return buildUnknownClarification(input);
  },
};

export function assertSafePatch(patch: StatePatch): void {
  if (patch.operations.length > MAX_PATCH_OPERATIONS) {
    throw new Error(`Patch exceeds operation limit (${MAX_PATCH_OPERATIONS})`);
  }

  for (const operation of patch.operations) {
    if (operation.op === "delete") {
      throw new Error("Delete operations are not allowed in proposals");
    }

    if (
      operation.entity === "project" &&
      operation.op === "status_change"
    ) {
      throw new Error("Project status changes are not allowed in proposals");
    }

    if (
      operation.entity === "project" &&
      operation.op === "upsert" &&
      operation.payload &&
      "status" in operation.payload
    ) {
      throw new Error("Project status changes are not allowed in proposals");
    }
  }
}
