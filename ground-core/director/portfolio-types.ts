import type { DirectorReport } from "./types.js";
import type { ProjectState } from "../types.js";

export type ProjectHealthStatus =
  | "progressing"
  | "ready"
  | "blocked"
  | "stalled"
  | "completed"
  | "paused";

export type PortfolioRecommendationReasonKind =
  | "director_primary"
  | "cross_project_rank"
  | "urgency_high"
  | "momentum_signal"
  | "downstream_unlock"
  | "blocker_severity"
  | "dependency_ready"
  | "dependency_blocked"
  | "project_active"
  | "project_inactive_penalty"
  | "no_eligible_actions"
  | "stalled_penalty"
  | "meta_work_defer"
  | "field_validation_priority"
  | "defer_explicit"
  | "session_focus"
  | "deep_work_focus";

export interface PortfolioRecommendationReason {
  kind: PortfolioRecommendationReasonKind;
  message: string;
  entity_type?: "project" | "next_action" | "blocker" | "goal";
  entity_id?: string;
  weight: number;
  score_delta?: number;
}

export interface WhyNotAlternative {
  compared_project_id: string;
  compared_project_title: string;
  compared_next_action_id: string;
  compared_next_action_label: string;
  reasons: PortfolioRecommendationReason[];
}

export interface PortfolioRecommendation {
  project_id: string;
  project_title: string;
  next_action_id: string;
  next_action_label: string;
  score: number;
  urgency_score: number;
  momentum_score: number;
  blocker_score: number;
  recommendation_score: number;
  reasons: PortfolioRecommendationReason[];
  why_not_alternatives: WhyNotAlternative[];
}

export interface ProjectHealth {
  project_id: string;
  project_title: string;
  health_score: number;
  momentum_score: number;
  blocker_score: number;
  recommendation_score: number;
  urgency_score: number;
  cross_project_score: number;
  status: ProjectHealthStatus;
}

export interface BlockedProjectSnapshot {
  project_id: string;
  project_title: string;
  health_status: "blocked" | "stalled" | "paused";
  primary_blocker_title: string | null;
  blocked_action_title: string | null;
  reasons: PortfolioRecommendationReason[];
}

export interface ProgressingProjectSnapshot {
  project_id: string;
  project_title: string;
  momentum_score: number;
  in_progress_action_count: number;
  reasons: PortfolioRecommendationReason[];
}

export interface PortfolioBottleneck {
  project_id: string;
  project_title: string;
  next_action_id: string;
  next_action_title: string;
  blocker_title: string | null;
  downstream_unlock_count: number;
  explanation: string;
  reasons: PortfolioRecommendationReason[];
}

export interface DeferredRecommendation {
  project_id: string;
  project_title: string;
  next_action_id: string;
  next_action_title: string;
  defer_reasons: PortfolioRecommendationReason[];
}

export interface RankedProjectEntry {
  rank: number;
  project_id: string;
  project_title: string;
  cross_project_score: number;
  urgency_score: number;
  momentum_score: number;
  recommended_action_id: string;
  recommended_action_title: string;
}

export interface PortfolioConfidenceFactor {
  label: string;
  value: number;
  explanation: string;
}

export interface PortfolioReport {
  schema_version: "0.4.0";
  engine: string;
  generated_at: string;
  primary_recommendation: PortfolioRecommendation;
  alternative_recommendations: PortfolioRecommendation[];
  project_ranking: RankedProjectEntry[];
  project_health: ProjectHealth[];
  blocked_projects: BlockedProjectSnapshot[];
  progressing_projects: ProgressingProjectSnapshot[];
  deferred_recommendations: DeferredRecommendation[];
  portfolio_bottleneck: PortfolioBottleneck;
  confidence: number;
  confidence_factors: PortfolioConfidenceFactor[];
  summary_text: string;
  requires_human_decision: true;
}

export type PortfolioBriefType = "morning" | "session" | "deep-work";

export interface PortfolioDirectorOptions {
  max_alternatives?: number;
  min_eligible_score?: number;
  /** Brief mode — session focus bonus applies only when `"session"`. */
  brief_type?: PortfolioBriefType;
  /** Explicit session focus project (session mode only). */
  session_focus_project_id?: string;
}

export interface PortfolioInput {
  project_states: ProjectState[];
  director_reports: DirectorReport[];
  options?: PortfolioDirectorOptions;
}

export interface PortfolioDirector {
  readonly name: string;
  recommendPortfolio(input: PortfolioInput): PortfolioReport;
}
