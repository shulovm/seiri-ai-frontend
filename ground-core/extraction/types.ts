import type { PatchEntity, PatchOp, ProjectState, StatePatch } from "../types.js";
import type { ResolutionResult } from "./semantic/resolver-types.js";
import type { SemanticEvent } from "./semantic/types.js";

export type RiskLevel = "low" | "medium" | "high";

export interface ExtractionInput {
  project_id: string;
  input_text: string;
  project_state: ProjectState;
}

export interface OperationSummary {
  operation: PatchOp;
  entity: PatchEntity;
  entity_id: string;
  label: string;
  effect: string;
}

export interface DryRunResult {
  valid: boolean;
  would_apply: boolean;
  operation_count: number;
  operation_summaries: OperationSummary[];
  errors?: string[];
}

export interface PatchProposal {
  id: string;
  project_id: string;
  input_text: string;
  summary: string;
  confidence: number;
  risk_level: RiskLevel;
  proposed_patch: StatePatch;
  dry_run_result: DryRunResult;
  requires_human_approval: true;
  clarification_question?: string;
  semantic_events?: SemanticEvent[];
  resolution_results?: ResolutionResult[];
  created_at: string;
}

export interface ClarificationResponse {
  type: "clarification";
  project_id?: string;
  input_text: string;
  reason: string;
  questions: string[];
  risk_level: RiskLevel;
  semantic_events?: SemanticEvent[];
  created_at: string;
}

export type ExtractionResult = PatchProposal | ClarificationResponse;

/** MockExtractor / 将来 LLM が返す patch 草案 */
export interface ExtractionDraft {
  summary: string;
  confidence: number;
  risk_level: RiskLevel;
  proposed_patch: StatePatch;
  clarification_question?: string;
  semantic_events?: SemanticEvent[];
  resolution_results?: ResolutionResult[];
}

export interface Extractor {
  propose(input: ExtractionInput): ExtractionDraft | ClarificationResponse;
}

export function isClarification(
  result: ExtractionDraft | ClarificationResponse
): result is ClarificationResponse {
  return "type" in result && result.type === "clarification";
}

export function isPatchProposal(value: unknown): value is PatchProposal {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if ("type" in value && (value as ClarificationResponse).type === "clarification") {
    return false;
  }

  return "proposed_patch" in value && "requires_human_approval" in value;
}
