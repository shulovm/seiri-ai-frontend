import { randomUUID } from "node:crypto";
import type { PatchOperation, StatePatch } from "../../types.js";
import { assertSafePatch, PROPOSE_CONFIDENCE_THRESHOLD } from "../mock-extractor.js";
import { buildProposalFromDraft, ProposalBuildError } from "../propose.js";
import type {
  ClarificationResponse,
  ExtractionDraft,
  ExtractionInput,
  PatchProposal,
  RiskLevel,
} from "../types.js";
import { isClarification } from "../types.js";
import type { EventDetector } from "./event-detector.js";
import type { EventResolver } from "./event-resolver.js";
import { ruleModalityDetector } from "./rule-modality-detector.js";
import { tokenMatchResolver } from "./token-match-resolver.js";
import type { SemanticEvent, SemanticEventType } from "./types.js";

function nowIso(): string {
  return new Date().toISOString();
}

function buildStopClarification(
  input: ExtractionInput,
  event: SemanticEvent
): ClarificationResponse {
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
    semantic_events: [event],
    created_at: nowIso(),
  };
}

function buildUnknownClarification(input: ExtractionInput): ClarificationResponse {
  return {
    type: "clarification",
    project_id: input.project_id,
    input_text: input.input_text,
    reason: "Semantic Event を検出できませんでした",
    questions: [
      "候補・決定・保留・停止のどれに近いですか？",
      "もう少し具体的に書けますか？",
    ],
    risk_level: "medium",
    created_at: nowIso(),
  };
}

function observationTitle(type: SemanticEventType): string {
  switch (type) {
    case "CandidateCreated":
      return "候補の記録";
    case "DecisionMade":
      return "決定の記録";
    case "ActionDeferred":
      return "保留の記録";
    case "PriorityChanged":
      return "優先順位の記録";
    case "StopRequested":
      return "停止意向の記録";
  }
}

function judgmentTitle(type: SemanticEventType): string {
  switch (type) {
    case "DecisionMade":
      return "決定を記録したが、state 更新前に hold";
    case "ActionDeferred":
      return "保留判断";
    case "CandidateCreated":
    case "PriorityChanged":
    case "StopRequested":
      return "";
  }
}

function summaryFor(event: SemanticEvent): string {
  switch (event.type) {
    case "CandidateCreated":
      return "候補が発生したため observation を記録する提案。";
    case "DecisionMade":
      return "決定が発生したため observation と judgment hold を記録する提案。";
    case "ActionDeferred":
      return "保留意向のため observation と judgment hold を記録する提案。";
    case "PriorityChanged":
      return "優先順位が変わったため observation を記録する提案。entity 解決は resolver_hint に委ねる。";
    case "StopRequested":
      return "停止意向のため clarification を返す。";
  }
}

function riskFor(event: SemanticEvent): RiskLevel {
  switch (event.type) {
    case "CandidateCreated":
      return "medium";
    case "DecisionMade":
      return "medium";
    case "ActionDeferred":
      return "low";
    case "PriorityChanged":
      return "medium";
    case "StopRequested":
      return "high";
  }
}

function buildObservationOperation(
  input: ExtractionInput,
  event: SemanticEvent,
  observationId: string,
  timestamp: string
): PatchOperation {
  return {
    op: "upsert",
    entity: "observation",
    entity_id: observationId,
    payload: {
      id: observationId,
      project_id: input.project_state.project.id,
      goal_id: input.project_state.current_state.primary_goal_id,
      title: observationTitle(event.type),
      body: event.raw_span ?? input.input_text,
      source: "conversation",
      observed_at: timestamp,
      created_at: timestamp,
      updated_at: timestamp,
    },
  };
}

function buildJudgmentOperation(
  input: ExtractionInput,
  event: SemanticEvent,
  observationId: string,
  judgmentId: string,
  timestamp: string
): PatchOperation {
  return {
    op: "upsert",
    entity: "judgment",
    entity_id: judgmentId,
    payload: {
      id: judgmentId,
      project_id: input.project_state.project.id,
      goal_id: input.project_state.current_state.primary_goal_id,
      observation_id: observationId,
      title: judgmentTitle(event.type),
      outcome: "hold",
      rationale:
        event.type === "DecisionMade"
          ? "決定が示されたが、action done / blocker resolved は v0.2.1 では自動提案しない。"
          : "保留意向を記録し、自動で state を進めない。",
      decided_at: timestamp,
      created_at: timestamp,
      updated_at: timestamp,
    },
  };
}

export function mapEventToDraft(input: ExtractionInput, event: SemanticEvent): ExtractionDraft {
  const timestamp = nowIso();
  const observationId = randomUUID();
  const operations: PatchOperation[] = [
    buildObservationOperation(input, event, observationId, timestamp),
  ];

  if (event.type === "DecisionMade" || event.type === "ActionDeferred") {
    operations.push(
      buildJudgmentOperation(input, event, observationId, randomUUID(), timestamp)
    );
  }

  const patch: StatePatch = {
    schema_version: "0.1.1",
    project_id: input.project_state.project.id,
    source: "extraction",
    operations,
  };

  assertSafePatch(patch);

  return {
    summary: summaryFor(event),
    confidence: event.confidence,
    risk_level: riskFor(event),
    proposed_patch: patch,
    semantic_events: [event],
  };
}

export function runSemanticPropose(
  input: ExtractionInput,
  detector: EventDetector = ruleModalityDetector,
  resolver: EventResolver = tokenMatchResolver
): PatchProposal | ClarificationResponse {
  const extraction = detector.detect(input);
  const event = extraction.events[0];

  if (!event) {
    return buildUnknownClarification(input);
  }

  if (event.type === "StopRequested") {
    return buildStopClarification(input, event);
  }

  if (event.confidence < PROPOSE_CONFIDENCE_THRESHOLD) {
    return {
      type: "clarification",
      project_id: input.project_id,
      input_text: input.input_text,
      reason: `confidence (${event.confidence.toFixed(2)}) が閾値 ${PROPOSE_CONFIDENCE_THRESHOLD} 未満のため patch 提案を保留`,
      questions: [
        "意図をもう少し具体的に書けますか？",
        "候補・決定・保留のどれに近いですか？",
      ],
      risk_level: "medium",
      semantic_events: [event],
      created_at: nowIso(),
    };
  }

  const draft = mapEventToDraft(input, event);
  draft.resolution_results = resolver.resolve({
    project_state: input.project_state,
    events: [event],
  });

  const proposal = buildProposalFromDraft(input, draft);
  if (!isClarification(proposal)) {
    assertPatchHasNoAutoStateAdvance(proposal.proposed_patch);
  }

  return proposal;
}

export function assertPatchHasNoAutoStateAdvance(patch: StatePatch): void {
  for (const operation of patch.operations) {
    if (operation.op === "delete") {
      throw new ProposalBuildError("Delete operations are not allowed");
    }

    if (operation.entity === "project") {
      throw new ProposalBuildError("Project changes are not allowed");
    }

    if (operation.entity === "next_action" && operation.op === "status_change") {
      throw new ProposalBuildError("Action status changes are not allowed in v0.2.1");
    }

    if (operation.entity === "blocker" && operation.op === "status_change") {
      throw new ProposalBuildError("Blocker status changes are not allowed in v0.2.1");
    }

    if (
      operation.entity === "current_state" &&
      operation.payload &&
      "primary_next_action_id" in operation.payload
    ) {
      throw new ProposalBuildError("Primary action changes are not allowed in v0.2.1");
    }
  }
}
