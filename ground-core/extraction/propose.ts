import { randomUUID } from "node:crypto";
import { ValidationError } from "../errors.js";
import { validateStatePatch } from "../validate.js";
import { dryRunPatch } from "./dry-run.js";
import {
  assertSafePatch,
  mockExtractor,
  PROPOSE_CONFIDENCE_THRESHOLD,
} from "./mock-extractor.js";
import { runSemanticPropose } from "./semantic/semantic-propose.js";
import type {
  ClarificationResponse,
  ExtractionDraft,
  ExtractionInput,
  Extractor,
  PatchProposal,
} from "./types.js";
import { isClarification } from "./types.js";

export type ProposeExtractor = "semantic" | "mock";

export class ProposalBuildError extends Error {
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ProposalBuildError";
    this.details = details;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function buildLowConfidenceClarification(
  input: ExtractionInput,
  confidence: number
): ClarificationResponse {
  return {
    type: "clarification",
    project_id: input.project_id,
    input_text: input.input_text,
    reason: `confidence (${confidence.toFixed(2)}) が閾値 ${PROPOSE_CONFIDENCE_THRESHOLD} 未満のため patch 提案を保留`,
    questions: [
      "意図をもう少し具体的に書けますか？",
      "更新対象の action / blocker / observation を明示できますか？",
    ],
    risk_level: "medium",
    created_at: nowIso(),
  };
}

export function buildProposalFromDraft(
  input: ExtractionInput,
  draft: ExtractionDraft,
  options?: { id?: string; createdAt?: string }
): PatchProposal | ClarificationResponse {
  if (draft.confidence < PROPOSE_CONFIDENCE_THRESHOLD) {
    return buildLowConfidenceClarification(input, draft.confidence);
  }

  assertSafePatch(draft.proposed_patch);

  const validation = validateStatePatch(draft.proposed_patch);
  if (!validation.valid) {
    throw new ProposalBuildError("Invalid proposed patch", validation.errors);
  }

  const dryRunResult = dryRunPatch(input.project_state, draft.proposed_patch);
  if (!dryRunResult.would_apply) {
    throw new ProposalBuildError("Dry-run applyPatch failed", dryRunResult.errors);
  }

  return {
    id: options?.id ?? randomUUID(),
    project_id: input.project_id,
    input_text: input.input_text,
    summary: draft.summary,
    confidence: draft.confidence,
    risk_level: draft.risk_level,
    proposed_patch: draft.proposed_patch,
    dry_run_result: dryRunResult,
    requires_human_approval: true,
    clarification_question: draft.clarification_question,
    semantic_events: draft.semantic_events,
    resolution_results: draft.resolution_results,
    created_at: options?.createdAt ?? nowIso(),
  };
}

export function buildProposal(
  input: ExtractionInput,
  extractor: Extractor = mockExtractor,
  options?: { id?: string; createdAt?: string }
): PatchProposal | ClarificationResponse {
  const extracted = extractor.propose(input);

  if (isClarification(extracted)) {
    return extracted;
  }

  return buildProposalFromDraft(input, extracted, options);
}

export function runPropose(
  input: ExtractionInput,
  extractor: ProposeExtractor = "semantic"
): PatchProposal | ClarificationResponse {
  try {
    if (extractor === "semantic") {
      return runSemanticPropose(input);
    }

    return buildProposal(input, mockExtractor);
  } catch (error) {
    if (error instanceof ProposalBuildError) {
      throw error;
    }

    if (error instanceof ValidationError) {
      throw new ProposalBuildError(error.message, error.details);
    }

    throw error;
  }
}
