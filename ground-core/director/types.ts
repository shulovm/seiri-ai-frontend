import type { BlockerSeverity, BlockerStatus, ProjectStatus } from "../types.js";

export type RecommendationEntityType = "next_action";

export type RecommendationReasonKind =
  | "primary_action"
  | "dependency_ready"
  | "dependency_blocked"
  | "blocker_link"
  | "blocker_severity"
  | "goal_alignment"
  | "sort_order"
  | "unlocks_downstream"
  | "status_penalty"
  | "project_status"
  | "primary_mismatch"
  | "no_eligible_actions";

export interface RecommendationReason {
  kind: RecommendationReasonKind;
  message: string;
  entity_type?: "next_action" | "blocker" | "goal" | "project";
  entity_id?: string;
  weight: number;
  score_delta?: number;
}

export interface ActionRecommendation {
  entity_type: RecommendationEntityType;
  entity_id: string;
  label: string;
  score: number;
  reasons: RecommendationReason[];
  related_blocker_ids: string[];
  blocked_by_action_ids: string[];
  matches_current_primary: boolean;
  /** depends_on が完了済み（またはなし）で primary 候補になり得る */
  eligible_for_primary: boolean;
}

export interface Recommendation {
  recommendation_id: string;
  project_id: string;
  primary_recommendation: ActionRecommendation;
  alternative_recommendations: ActionRecommendation[];
  confidence: number;
  requires_human_decision: true;
  generated_at: string;
}

export interface SituationSnapshot {
  project_title: string;
  project_status: ProjectStatus;
  phase: string | null;
  primary_goal_id: string | null;
  primary_goal_title: string | null;
  primary_next_action_id: string | null;
  primary_next_action_title: string | null;
  state_summary: string;
  state_confidence: number | null;
  pending_action_count: number;
  open_blocker_count: number;
}

export interface BlockerSnapshot {
  blocker_id: string;
  title: string;
  severity: BlockerSeverity;
  status: BlockerStatus;
  linked_action_ids: string[];
}

export interface ConfidenceFactor {
  label: string;
  value: number;
  explanation: string;
}

export interface DirectorReport {
  schema_version: "0.3.0";
  engine: string;
  project_id: string;
  generated_at: string;
  situation: SituationSnapshot;
  open_blockers: BlockerSnapshot[];
  recommendation: Recommendation;
  confidence_factors: ConfidenceFactor[];
  summary_text: string;
}

export interface DirectorOptions {
  max_alternatives?: number;
  include_in_progress?: boolean;
}

export interface DirectorInput {
  project_state: import("../types.js").ProjectState;
  options?: DirectorOptions;
}

export interface DirectorEngine {
  readonly name: string;
  recommend(input: DirectorInput): DirectorReport;
}

export const RECOMMENDABLE_ACTION_STATUSES = ["pending", "in_progress"] as const;
