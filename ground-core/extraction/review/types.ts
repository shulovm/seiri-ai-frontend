import type { SemanticEventType } from "../semantic/types.js";
import type { PatchProposal } from "../types.js";
import type { ProjectState, StatePatch } from "../../types.js";

export type ReviewDecision =
  | "approve_resolution"
  | "reject_resolution"
  | "clarify";

export type ReviewEntityType = "next_action";

export interface ReviewSelection {
  schema_version: "0.2.3";
  proposal_id: string;
  project_id: string;
  event_id: string;
  selected_entity_type?: ReviewEntityType;
  selected_entity_id?: string;
  reviewer: "human";
  decision: ReviewDecision;
  note?: string;
  created_at: string;
}

export interface BuildApprovedPatchInput {
  proposal: PatchProposal;
  selection?: ReviewSelection;
  project_state: ProjectState;
}

export interface BuildApprovedPatchSuccess {
  type: "approved_patch";
  approved_patch: StatePatch;
  summary: string;
  semantic_event_type: SemanticEventType;
  gates_passed: string[];
}

export interface ReviewBridgeClarification {
  type: "clarification";
  reason: string;
  questions: string[];
  proposal_id: string;
  review_selection: ReviewSelection;
}

export type BuildApprovedPatchResult =
  | BuildApprovedPatchSuccess
  | ReviewBridgeClarification;
