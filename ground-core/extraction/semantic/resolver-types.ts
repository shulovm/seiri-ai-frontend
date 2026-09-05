import type { SemanticTargetKind } from "./types.js";

export type ResolutionEntityType = "next_action";

export type ResolutionAmbiguityLevel = "none" | "low" | "medium" | "high";

export interface ResolutionCandidate {
  entity_type: ResolutionEntityType;
  entity_id: string;
  label: string;
  score: number;
  matched_terms: string[];
  reason: string;
}

export interface ResolutionResult {
  event_id: string;
  target_kind: SemanticTargetKind;
  raw_target_span: string;
  candidates: ResolutionCandidate[];
  selected_candidate_id?: string;
  ambiguity_level: ResolutionAmbiguityLevel;
  needs_human_review: true;
  resolution_note?: string;
}
