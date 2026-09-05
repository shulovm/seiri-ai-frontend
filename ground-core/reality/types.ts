import type {
  ClarificationResponse,
  PatchProposal,
} from "../extraction/types.js";
import type { RealityClassification } from "./semantics.js";

export type GroundEventSource =
  | "manual"
  | "field_test"
  | "conversation"
  | "system";

/**
 * Reality Loop Phase 1 — 現実の出来事の記録。
 * これ自体は ProjectState を変更しない。
 */
export interface GroundEvent {
  schema_version: "0.6.0";
  id: string;
  project_id: string;
  source: GroundEventSource;
  occurred_at: string;
  input_text: string;
  title: string;
  summary: string;
  created_at: string;
}

export interface RealityProposeInput {
  project_id: string;
  input_text: string;
  source?: GroundEventSource;
  /** ISO8601。省略時は now */
  occurred_at?: string;
}

export interface RealityProposeResult {
  schema_version: "0.6.0" | "0.6.1";
  ground_event: GroundEvent;
  /** PatchProposal または ClarificationResponse — どちらも ProjectState を変更しない */
  result: PatchProposal | ClarificationResponse;
  project_state_mutated: false;
  loop_stage: "propose";
  requires_human_apply: true;
  /** v0.6.1 — Reality Semantics 分類（existing modality 経路では null） */
  reality_classification: RealityClassification | null;
}

export interface RealityApplyInput {
  project_id: string;
  proposal: PatchProposal;
}

export interface RealityApplyResult {
  schema_version: "0.6.0";
  project_id: string;
  proposal_id: string;
  updated_at: string;
  observation_count_before: number;
  observation_count_after: number;
  loop_stage: "applied";
  next_hint: string;
}
