import type { DirectorReport } from "../director/types.js";
import type { PortfolioReport } from "../director/portfolio-types.js";
import type { BlockerSeverity, ProjectState } from "../types.js";

export type StudioReasonKind =
  | "portfolio_primary"
  | "portfolio_alternative"
  | "cross_project_rank"
  | "blocker_severity"
  | "dependency_ready"
  | "momentum_signal"
  | "observation_gap"
  | "defer_explicit"
  | "flow_sequencing"
  | "resource_overload"
  | "decision_active"
  | "hypothesis_untested"
  | "observation_recent"
  | "situation_summary"
  | "portfolio_alignment"
  | "meta_work_defer"
  | "field_validation";

export interface StudioReason {
  kind: StudioReasonKind;
  message: string;
  weight: number;
}

export interface TodayFocusItem {
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  confidence: number;
  reasons: StudioReason[];
}

export interface TodayFocus {
  /** Q1: 今どこにいるか */
  situation_summary: string;
  /** Q3: 今日何をやるべきか */
  primary: TodayFocusItem;
  alternatives: TodayFocusItem[];
}

export interface StudioBlockedProject {
  project_id: string;
  project_title: string;
  status: "blocked" | "stalled" | "paused";
  blocker_title: string | null;
  action_title: string | null;
  severity: BlockerSeverity | null;
  reasons: StudioReason[];
}

export interface StudioGrowingProject {
  project_id: string;
  project_title: string;
  momentum_score: number;
  reasons: StudioReason[];
}

export type StudioRiskKind =
  | "observation_gap"
  | "stalled"
  | "resource_overload"
  | "blocker_pressure"
  | "scope_creep";

export interface StudioRiskProject {
  project_id: string;
  project_title: string;
  risk_kind: StudioRiskKind;
  severity: "low" | "medium" | "high";
  reasons: StudioReason[];
}

export type StudioDecisionMaterialKind =
  | "decision"
  | "hypothesis"
  | "observation"
  | "portfolio_factor";

export interface StudioDecisionMaterial {
  kind: StudioDecisionMaterialKind;
  project_id: string;
  project_title: string;
  entity_id: string;
  title: string;
  summary: string;
  pending_question?: string;
}

export interface StudioFlowStep {
  order: number;
  time_box: "morning" | "afternoon" | "later" | "session" | "now";
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  intent: "deep_work" | "light_touch" | "defer" | "observe";
  reasons: StudioReason[];
}

export interface StudioDeferredProject {
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  reasons: StudioReason[];
}

export interface PortfolioAlignment {
  primary_project_id: string;
  primary_action_id: string;
  alignment_status: "aligned" | "partially_aligned";
  note: string;
  deep_work_step_count: number;
  deep_work_warning: boolean;
}

export interface StudioReport {
  schema_version: "0.5.3";
  engine: string;
  generated_at: string;
  today_focus: TodayFocus;
  blocked_projects: StudioBlockedProject[];
  growing_projects: StudioGrowingProject[];
  risk_projects: StudioRiskProject[];
  decision_materials: StudioDecisionMaterial[];
  recommended_flow: StudioFlowStep[];
  deferred_projects: StudioDeferredProject[];
  portfolio_alignment: PortfolioAlignment;
  summary_text: string;
  requires_human_decision: true;
}

export interface StudioEngineInput {
  portfolio_report: PortfolioReport;
  director_reports: DirectorReport[];
  /** decision_materials 抽出用。省略時は Portfolio / Director 由来のみ */
  project_states?: ProjectState[];
}

export interface StudioEngine {
  readonly name: string;
  analyze(input: StudioEngineInput): StudioReport;
}

export interface DirectorReportIndex {
  byProjectId: Map<string, DirectorReport>;
}

export interface ProjectStateIndex {
  byProjectId: Map<string, ProjectState>;
}

export const SEVERITY_RANK: Record<BlockerSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};
