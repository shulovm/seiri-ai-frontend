import type { PortfolioRecommendationReason } from "../director/portfolio-types.js";
import type { ProjectState } from "../types.js";

/** v0.5.0 — Studio Engine 出力（Renderer 入力）。Studio Engine 未実装時は fixture で供給 */
export interface StudioReport {
  schema_version: "0.5.0";
  engine: string;
  generated_at: string;

  /** Portfolio primary — Renderer 不変条件の基準 */
  portfolio_primary: StudioPortfolioPrimary;

  today_focus: StudioTodayFocus;
  priority_stack: StudioPriorityStack;
  flow_proposal: StudioFlowProposal;
  at_risk_projects: StudioAtRiskProject[];
  growing_projects: StudioGrowingProject[];
  explicit_deferrals: StudioDeferralSource[];
  risk_warnings: StudioRiskWarningSource[];
  decision_brief: StudioDecisionBriefSource;
  portfolio_alignment: StudioPortfolioAlignment;

  cross_project_bottlenecks?: StudioBottleneckSource[];
  confidence: number;
  requires_human_decision: true;
}

export interface StudioPortfolioPrimary {
  project_id: string;
  project_title: string;
  next_action_id: string;
  next_action_label: string;
  confidence: number;
  reasons: PortfolioRecommendationReason[];
  why_not_alternatives: StudioWhyNotAlternativeSource[];
}

export interface StudioWhyNotAlternativeSource {
  compared_project_id: string;
  compared_project_title: string;
  compared_next_action_id: string;
  compared_next_action_label: string;
  reasons: PortfolioRecommendationReason[];
}

export interface StudioFocusSnapshot {
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  confidence: number;
  reason_messages: string[];
}

export interface StudioTodayFocus {
  primary: StudioFocusSnapshot;
  alternatives: StudioFocusSnapshot[];
}

export interface StudioPriorityStack {
  alternatives: StudioFocusSnapshot[];
}

export interface StudioFlowStepSource {
  order: number;
  time_box: "morning" | "afternoon" | "session" | "now" | "later";
  project_id: string;
  project_title: string;
  action_id: string | null;
  action_title: string;
  intent: "deep_work" | "light_touch" | "defer" | "observe";
  reason_messages: string[];
}

export interface StudioFlowProposal {
  steps: StudioFlowStepSource[];
}

export interface StudioAtRiskProject {
  project_id: string;
  project_title: string;
  health_status: "blocked" | "stalled" | "paused";
  blocker_title: string | null;
  blocked_action_title: string | null;
  blocker_severity: "low" | "medium" | "high" | "critical" | null;
  reason_messages: string[];
}

export interface StudioGrowingProject {
  project_id: string;
  project_title: string;
  momentum_score: number;
  signal_messages: string[];
}

export interface StudioDeferralSource {
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  defer_reason_messages: string[];
}

export interface StudioRiskWarningSource {
  kind: RiskBriefKind;
  severity: "low" | "medium" | "high";
  message: string;
  entity_type?: "project" | "blocker" | "hypothesis" | "decision";
  entity_id?: string;
  project_id?: string;
  project_title?: string;
  mitigation_messages: string[];
}

export interface StudioDecisionSource {
  project_id: string;
  project_title: string;
  decision_id: string;
  decision_title: string;
  rationale: string;
  pending_question: string;
  status: "active" | "superseded" | "reversed";
}

export interface StudioDecisionBriefSource {
  active_decisions: StudioDecisionSource[];
}

export interface StudioPortfolioAlignment {
  primary_project_id: string;
  primary_action_id: string;
  alignment: "identical" | "complemented" | "time_split";
  note: string;
}

export interface StudioBottleneckSource {
  project_id: string;
  project_title: string;
  next_action_id: string;
  next_action_title: string;
  blocker_title: string | null;
  blocker_severity: "low" | "medium" | "high" | "critical" | null;
  reason_messages: string[];
}

export type StudioBriefType = "morning" | "session" | "deep-work";

export type RiskBriefKind =
  | "observation_gap"
  | "untested_hypothesis"
  | "blocker_pressure"
  | "resource_overload"
  | "decision_pending"
  | "scope_creep"
  | "portfolio_misalignment";

export type FocusItemSource =
  | "portfolio_primary"
  | "portfolio_alternative"
  | "studio_session"
  | "studio_deep_work";

export interface FocusItem {
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  reason_summary: string;
  confidence: number;
  source: FocusItemSource;
  /** Session / deep-work mode: portfolio focus reason for brief TODAY section. */
  mode_context_note?: string;
}

export interface BlockedItem {
  project_id: string;
  project_title: string;
  status: "blocked" | "stalled" | "paused";
  blocker_title: string | null;
  action_title: string | null;
  severity: "low" | "medium" | "high" | "critical" | null;
  reason_summary: string;
}

export type FlowNoteKind = "unlock" | "bottleneck" | "flow_note" | "deep_work_candidate";

/** Structural flow signal — not an open blocker (downstream unlock, chain head, etc.) */
export interface FlowNoteItem {
  project_id: string;
  project_title: string;
  action_title: string | null;
  note_kind: FlowNoteKind;
  reason_summary: string;
}

export interface GrowthItem {
  project_id: string;
  project_title: string;
  momentum_score: number;
  signal_summary: string;
}

export interface DecisionBrief {
  project_id: string;
  project_title: string;
  decision_id: string;
  decision_title: string;
  rationale_summary: string;
  pending_question: string;
}

export interface RiskBrief {
  kind: RiskBriefKind;
  severity: "low" | "medium" | "high";
  message: string;
  entity_type?: "project" | "blocker" | "hypothesis" | "decision";
  entity_id?: string;
  mitigation_hint: string;
}

export interface FlowStep {
  order: number;
  time_box: "morning" | "afternoon" | "session" | "now" | "later";
  project_id: string;
  project_title: string;
  action_id: string | null;
  action_title: string;
  intent: "deep_work" | "light_touch" | "defer" | "observe";
  reason_summary: string;
}

export interface DeferredItem {
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  defer_reason: string;
}

export interface PortfolioNote {
  primary_project_id: string;
  primary_action_id: string;
  alignment: "identical" | "complemented" | "time_split";
  note: string;
}

export interface WhyNotSummary {
  compared_project_id: string;
  compared_action_title: string;
  summary: string;
}

export interface StudioBrief {
  schema_version: "0.5.1";
  brief_type: StudioBriefType;
  engine: string;
  generated_at: string;
  headline: string;
  primary_focus: FocusItem;
  secondary_focuses: FocusItem[];
  blocked_items: BlockedItem[];
  flow_note_items: FlowNoteItem[];
  growth_items: GrowthItem[];
  decision_briefs: DecisionBrief[];
  risk_briefs: RiskBrief[];
  recommended_flow: FlowStep[];
  deferred_items: DeferredItem[];
  portfolio_note: PortfolioNote;
  why_not_summary: WhyNotSummary[];
  summary_text: string;
  requires_human_decision: true;
}

export type MorningBrief = StudioBrief & { brief_type: "morning" };
export type SessionBrief = StudioBrief & { brief_type: "session" };
export type DeepWorkBrief = StudioBrief & { brief_type: "deep-work" };

export interface BriefRendererInput {
  report: StudioReport;
  brief_type: StudioBriefType;
  /** Deep-work mode: source for non-primary deep_work FLOW NOTES candidates. */
  project_states?: ProjectState[];
}

export interface BriefRenderer {
  readonly name: string;
  render(input: BriefRendererInput): StudioBrief;
}

export interface BriefSectionLimits {
  maxSecondary: number;
  maxFlow: number | null;
  maxBlocked: number;
  maxFlowNotes: number;
  maxGrowing: number;
  maxDecisions: number;
  maxRisks: number;
  includeBlocked: boolean;
  includeGrowing: boolean;
  includeDecisions: boolean;
  filterFlowTimeBoxes?: Array<FlowStep["time_box"]>;
}
