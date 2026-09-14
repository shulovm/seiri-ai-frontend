import type { PortfolioReport, PortfolioRecommendationReason } from "../director/portfolio-types.js";
import type { StudioNarrative } from "./narrative-types.js";
import { truncateText } from "./narrative-formatters.js";
import type {
  StudioAtRiskProject,
  StudioDecisionBriefSource,
  StudioDecisionSource,
  StudioDeferralSource,
  StudioFlowStepSource,
  StudioGrowingProject as BriefGrowingProject,
  StudioPortfolioAlignment,
  StudioPortfolioPrimary,
  StudioReport as BriefRendererStudioReport,
  StudioRiskWarningSource,
  RiskBriefKind,
} from "./brief-types.js";
import type {
  StudioDecisionMaterial,
  StudioReason,
  StudioReasonKind,
  StudioReport as EngineStudioReport,
  StudioRiskKind,
  StudioRiskProject,
} from "./types.js";

export const BRIEF_ADAPTER_NAME = "rule-brief-adapter-v1";

export interface BriefAdapterInput {
  studio_report: EngineStudioReport;
  narrative: StudioNarrative;
  portfolio_report: PortfolioReport;
}

export class BriefAdapterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BriefAdapterError";
  }
}

const REASON_KIND_MAP: Partial<
  Record<StudioReasonKind, PortfolioRecommendationReason["kind"]>
> = {
  portfolio_primary: "director_primary",
  portfolio_alternative: "director_primary",
  cross_project_rank: "cross_project_rank",
  blocker_severity: "blocker_severity",
  dependency_ready: "dependency_ready",
  momentum_signal: "momentum_signal",
  observation_gap: "stalled_penalty",
  defer_explicit: "defer_explicit",
  flow_sequencing: "cross_project_rank",
  resource_overload: "stalled_penalty",
  meta_work_defer: "meta_work_defer",
  field_validation: "field_validation_priority",
  portfolio_alignment: "director_primary",
  decision_active: "director_primary",
  hypothesis_untested: "director_primary",
  observation_recent: "director_primary",
  situation_summary: "director_primary",
};

const RISK_KIND_MAP: Record<StudioRiskKind, RiskBriefKind> = {
  observation_gap: "observation_gap",
  stalled: "decision_pending",
  resource_overload: "resource_overload",
  blocker_pressure: "blocker_pressure",
  scope_creep: "scope_creep",
};

function toPortfolioReason(reason: StudioReason): PortfolioRecommendationReason {
  return {
    kind: REASON_KIND_MAP[reason.kind] ?? "cross_project_rank",
    message: reason.message,
    weight: reason.weight,
  };
}

function reasonMessages(reasons: StudioReason[], narrativeHint?: string): string[] {
  const messages = reasons.map((reason) => reason.message.trim()).filter((message) => message.length > 0);

  if (messages.length > 0) {
    return messages.slice(0, 3);
  }

  if (narrativeHint && narrativeHint.trim().length > 0) {
    return [truncateText(narrativeHint, 140)];
  }

  return ["構造シグナルに基づく StudioReport 由来の説明"];
}

function mapPortfolioPrimary(
  report: EngineStudioReport,
  portfolio: PortfolioReport,
  narrative: StudioNarrative
): StudioPortfolioPrimary {
  const primary = report.today_focus.primary;
  const portfolioPrimary = portfolio.primary_recommendation;

  return {
    project_id: primary.project_id,
    project_title: primary.project_title,
    next_action_id: primary.action_id,
    next_action_label: primary.action_title,
    confidence: primary.confidence,
    reasons:
      portfolioPrimary.reasons.length > 0
        ? portfolioPrimary.reasons
        : primary.reasons.map(toPortfolioReason),
    why_not_alternatives: portfolioPrimary.why_not_alternatives.map((entry) => ({
      compared_project_id: entry.compared_project_id,
      compared_project_title: entry.compared_project_title,
      compared_next_action_id: entry.compared_next_action_id,
      compared_next_action_label: entry.compared_next_action_label,
      reasons: entry.reasons,
    })),
  };
}

function mapAtRiskProjects(
  report: EngineStudioReport,
  narrative: StudioNarrative
): StudioAtRiskProject[] {
  return report.blocked_projects.map((entry) => ({
    project_id: entry.project_id,
    project_title: entry.project_title,
    health_status: entry.status,
    blocker_title: entry.blocker_title,
    blocked_action_title: entry.action_title,
    blocker_severity: entry.severity,
    reason_messages: reasonMessages(entry.reasons, narrative.blocker_story),
  }));
}

function mapGrowingProjects(
  report: EngineStudioReport,
  narrative: StudioNarrative
): BriefGrowingProject[] {
  return report.growing_projects.map((entry) => ({
    project_id: entry.project_id,
    project_title: entry.project_title,
    momentum_score: entry.momentum_score,
    signal_messages: reasonMessages(entry.reasons, narrative.growth_story),
  }));
}

function mapDeferrals(
  report: EngineStudioReport,
  narrative: StudioNarrative
): StudioDeferralSource[] {
  return report.deferred_projects.map((entry) => ({
    project_id: entry.project_id,
    project_title: entry.project_title,
    action_id: entry.action_id,
    action_title: entry.action_title,
    defer_reason_messages: reasonMessages(entry.reasons, narrative.deferred_story),
  }));
}

function mapFlowSteps(
  report: EngineStudioReport,
  narrative: StudioNarrative
): StudioFlowStepSource[] {
  return report.recommended_flow.map((step) => ({
    order: step.order,
    time_box: step.time_box,
    project_id: step.project_id,
    project_title: step.project_title,
    action_id: step.action_id,
    action_title: step.action_title,
    intent: step.intent,
    reason_messages: reasonMessages(step.reasons, narrative.flow_story),
  }));
}

function mapRiskWarnings(
  report: EngineStudioReport,
  narrative: StudioNarrative
): StudioRiskWarningSource[] {
  const warnings: StudioRiskWarningSource[] = report.risk_projects.map((entry) =>
    mapRiskProject(entry, narrative.risk_story)
  );

  for (const material of report.decision_materials) {
    if (material.kind !== "hypothesis") {
      continue;
    }

    warnings.push({
      kind: "untested_hypothesis",
      severity: "medium",
      message: material.title,
      entity_type: "hypothesis",
      entity_id: material.entity_id,
      project_id: material.project_id,
      project_title: material.project_title,
      mitigation_messages: [material.pending_question ?? material.summary],
    });
  }

  if (report.portfolio_alignment.deep_work_warning) {
    warnings.push({
      kind: "portfolio_misalignment",
      severity: "medium",
      message: narrative.headline,
      entity_type: "project",
      entity_id: report.today_focus.primary.project_id,
      mitigation_messages: [report.portfolio_alignment.note],
    });
  }

  return warnings;
}

function mapRiskProject(
  entry: StudioRiskProject,
  narrativeHint: string
): StudioRiskWarningSource {
  const detail = entry.reasons[0]?.message ?? entry.risk_kind;
  return {
    kind: RISK_KIND_MAP[entry.risk_kind],
    severity: entry.severity,
    message: `${entry.project_title} — ${detail}`,
    entity_type: "project",
    entity_id: entry.project_id,
    project_id: entry.project_id,
    project_title: entry.project_title,
    mitigation_messages: reasonMessages(entry.reasons, narrativeHint),
  };
}

function mapDecisionBrief(materials: StudioDecisionMaterial[]): StudioDecisionBriefSource {
  return {
    active_decisions: materials
      .filter((entry) => entry.kind === "decision")
      .map((entry) => ({
        project_id: entry.project_id,
        project_title: entry.project_title,
        decision_id: entry.entity_id,
        decision_title: entry.title,
        rationale: entry.summary,
        pending_question: entry.pending_question ?? "判断待ち",
        status: "active" as const,
      })),
  };
}

function mapPortfolioAlignment(
  report: EngineStudioReport,
  narrative: StudioNarrative
): StudioPortfolioAlignment {
  const alignment = report.portfolio_alignment;
  const mappedAlignment: StudioPortfolioAlignment["alignment"] =
    alignment.alignment_status === "aligned" ? "identical" : "time_split";

  return {
    primary_project_id: alignment.primary_project_id,
    primary_action_id: alignment.primary_action_id,
    alignment: mappedAlignment,
    note: alignment.note || truncateText(narrative.current_situation, 160),
  };
}

function assertAdapterInvariants(
  engineReport: EngineStudioReport,
  adapted: BriefRendererStudioReport
): void {
  const enginePrimary = engineReport.today_focus.primary;
  const adaptedPrimary = adapted.portfolio_primary;

  if (
    enginePrimary.project_id !== adaptedPrimary.project_id ||
    enginePrimary.action_id !== adaptedPrimary.next_action_id
  ) {
    throw new BriefAdapterError("Adapter must preserve Portfolio primary project/action");
  }

  const engineFlowIds = engineReport.recommended_flow.map((step) => step.project_id);
  const adaptedFlowIds = adapted.flow_proposal.steps.map((step) => step.project_id);
  if (JSON.stringify(engineFlowIds) !== JSON.stringify(adaptedFlowIds)) {
    throw new BriefAdapterError("Adapter must preserve recommended_flow order");
  }
}

export function adaptToBriefRendererReport(input: BriefAdapterInput): BriefRendererStudioReport {
  const { studio_report: report, narrative, portfolio_report: portfolio } = input;
  const primary = report.today_focus.primary;

  const adapted: BriefRendererStudioReport = {
    schema_version: "0.5.0",
    engine: BRIEF_ADAPTER_NAME,
    generated_at: report.generated_at,
    portfolio_primary: mapPortfolioPrimary(report, portfolio, narrative),
    today_focus: {
      primary: {
        project_id: primary.project_id,
        project_title: primary.project_title,
        action_id: primary.action_id,
        action_title: primary.action_title,
        confidence: primary.confidence,
        reason_messages: reasonMessages(primary.reasons, narrative.today_focus_story),
      },
      alternatives: report.today_focus.alternatives.map((entry) => ({
        project_id: entry.project_id,
        project_title: entry.project_title,
        action_id: entry.action_id,
        action_title: entry.action_title,
        confidence: entry.confidence,
        reason_messages: reasonMessages(entry.reasons),
      })),
    },
    priority_stack: {
      alternatives: portfolio.alternative_recommendations
        .filter(
          (entry) =>
            !report.today_focus.alternatives.some(
              (alternative) => alternative.project_id === entry.project_id
            )
        )
        .slice(0, 3)
        .map((entry) => ({
          project_id: entry.project_id,
          project_title: entry.project_title,
          action_id: entry.next_action_id,
          action_title: entry.next_action_label,
          confidence: entry.recommendation_score,
          reason_messages: entry.reasons.map((reason) => reason.message),
        })),
    },
    flow_proposal: {
      steps: mapFlowSteps(report, narrative),
    },
    at_risk_projects: mapAtRiskProjects(report, narrative),
    growing_projects: mapGrowingProjects(report, narrative),
    explicit_deferrals: mapDeferrals(report, narrative),
    risk_warnings: mapRiskWarnings(report, narrative),
    decision_brief: mapDecisionBrief(report.decision_materials),
    portfolio_alignment: mapPortfolioAlignment(report, narrative),
    cross_project_bottlenecks: [
      {
        project_id: portfolio.portfolio_bottleneck.project_id,
        project_title: portfolio.portfolio_bottleneck.project_title,
        next_action_id: portfolio.portfolio_bottleneck.next_action_id,
        next_action_title: portfolio.portfolio_bottleneck.next_action_title,
        blocker_title: portfolio.portfolio_bottleneck.blocker_title,
        blocker_severity: null,
        reason_messages: portfolio.portfolio_bottleneck.reasons.map((reason) => reason.message),
      },
    ],
    confidence: primary.confidence,
    requires_human_decision: true,
  };

  assertAdapterInvariants(report, adapted);
  return adapted;
}
