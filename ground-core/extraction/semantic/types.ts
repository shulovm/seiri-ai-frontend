export type SemanticEventType =
  | "CandidateCreated"
  | "DecisionMade"
  | "ActionDeferred"
  | "PriorityChanged"
  | "StopRequested";

export type SemanticModality = "intent" | "commitment" | "deferred" | "negative";

export type SemanticTargetKind = "location" | "next_action" | "project" | "unknown";

export type SemanticResolverStrategy = "none" | "semantic_match_next_action";

export interface SemanticResolverHint {
  strategy: SemanticResolverStrategy;
  role?: string;
  raw_target_span?: string;
}

export interface SemanticEvent {
  id: string;
  type: SemanticEventType;
  target_kind: SemanticTargetKind;
  modality: SemanticModality;
  confidence: number;
  evidence: string[];
  raw_span?: string;
  resolver_hint?: SemanticResolverHint;
}

export interface SemanticExtractionResult {
  events: SemanticEvent[];
  raw_input: string;
  created_at: string;
}
