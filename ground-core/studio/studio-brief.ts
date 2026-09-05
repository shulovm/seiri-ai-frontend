import type { PortfolioReport } from "../director/portfolio-types.js";
import type { ProjectState } from "../types.js";
import { ruleDirector } from "../director/rule-director.js";
import { rulePortfolioDirector } from "../director/portfolio-director.js";
import { adaptToBriefRendererReport } from "./brief-adapter.js";
import { buildHeadline } from "./brief-formatters.js";
import { renderStudioBrief } from "./brief-renderer.js";
import type {
  StudioBrief,
  StudioBriefType,
  StudioReport as BriefRendererStudioReport,
} from "./brief-types.js";
import { ruleNarrative } from "./narrative-builder.js";
import type { StudioNarrative } from "./narrative-types.js";
import { ruleStudio } from "./rule-studio.js";
import type { StudioReport as EngineStudioReport } from "./types.js";

export interface StudioBriefPipelineInput {
  project_states: ProjectState[];
  brief_type?: StudioBriefType;
  session_focus_project_id?: string;
}

export interface StudioBriefPipelineResult {
  portfolio_report: PortfolioReport;
  studio_report: EngineStudioReport;
  narrative: StudioNarrative;
  renderer_report: BriefRendererStudioReport;
  brief: StudioBrief;
  display_brief: StudioBrief;
}

const BRIEF_TYPE_LABEL: Record<StudioBriefType, string> = {
  morning: "Morning Brief",
  session: "Session Brief",
  "deep-work": "Deep Work Brief",
};

function applyNarrativePresentation(
  brief: StudioBrief,
  narrative: StudioNarrative
): StudioBrief {
  return {
    ...brief,
    headline: narrative.headline,
    summary_text: narrative.summary_story,
  };
}

export function runStudioBriefPipeline(
  input: StudioBriefPipelineInput
): StudioBriefPipelineResult {
  const briefType = input.brief_type ?? "morning";
  const directorReports = input.project_states.map((state) =>
    ruleDirector.recommend({ project_state: state })
  );
  const portfolioReport = rulePortfolioDirector.recommendPortfolio({
    project_states: input.project_states,
    director_reports: directorReports,
    options: {
      brief_type: briefType,
      session_focus_project_id: input.session_focus_project_id,
    },
  });
  const studioReport = ruleStudio.analyze({
    portfolio_report: portfolioReport,
    director_reports: directorReports,
    project_states: input.project_states,
  });
  const narrative = ruleNarrative.build({ report: studioReport });
  const rendererReport = adaptToBriefRendererReport({
    studio_report: studioReport,
    narrative,
    portfolio_report: portfolioReport,
  });
  const brief = renderStudioBrief({
    report: rendererReport,
    brief_type: briefType,
    project_states: input.project_states,
  });
  const displayBrief = applyNarrativePresentation(brief, narrative);

  return {
    portfolio_report: portfolioReport,
    studio_report: studioReport,
    narrative,
    renderer_report: rendererReport,
    brief,
    display_brief: displayBrief,
  };
}

function formatSection(title: string, lines: string[]): string {
  if (lines.length === 0) {
    return `${title}\n  (none)`;
  }

  return [title, ...lines.map((line) => `  ${line}`)].join("\n");
}

function resolveDisplayHeadline(brief: StudioBrief, briefType: StudioBriefType): string {
  if (briefType === "session" && brief.primary_focus.mode_context_note) {
    return buildHeadline(briefType, brief.primary_focus);
  }

  if (briefType === "deep-work" && brief.primary_focus.mode_context_note) {
    return "Deep Work Brief — 集中価値の高いActionを優先";
  }

  return brief.headline;
}

function buildTodayLines(brief: StudioBrief): string[] {
  const lines = [
    `${brief.primary_focus.project_title} — ${brief.primary_focus.action_title}`,
    brief.primary_focus.reason_summary,
  ];

  if (brief.primary_focus.mode_context_note) {
    lines.push(brief.primary_focus.mode_context_note);
  }

  return lines;
}

export function formatStudioBriefText(
  brief: StudioBrief,
  narrative: StudioNarrative,
  briefType: StudioBriefType = brief.brief_type
): string {
  const display = applyNarrativePresentation(brief, narrative);
  const sections = [
    BRIEF_TYPE_LABEL[briefType],
    "",
    resolveDisplayHeadline(display, briefType),
    "",
    formatSection("TODAY", buildTodayLines(display)),
    "",
    formatSection(
      "BLOCKED",
      display.blocked_items.map(
        (item) =>
          `${item.project_title} (${item.status}${item.severity ? ` / ${item.severity}` : ""}) — ${item.reason_summary}`
      )
    ),
    "",
    formatSection(
      "FLOW NOTES",
      display.flow_note_items.map(
        (item) =>
          `${item.project_title} (${item.note_kind}) — ${item.action_title ? `${item.action_title} — ` : ""}${item.reason_summary}`
      )
    ),
    "",
    formatSection(
      "GROWING",
      display.growth_items.map(
        (item) => `${item.project_title} (momentum ${item.momentum_score.toFixed(2)}) — ${item.signal_summary}`
      )
    ),
    "",
    formatSection(
      "DECISIONS",
      display.decision_briefs.map(
        (item) => `${item.project_title}: ${item.decision_title} — ${item.rationale_summary}`
      )
    ),
    "",
    formatSection(
      "RISKS",
      display.risk_briefs.map((item) => `${item.kind} (${item.severity}) — ${item.message}`)
    ),
    "",
    formatSection(
      "FLOW",
      display.recommended_flow.map(
        (step) =>
          `${step.order}. ${step.project_title} [${step.time_box}/${step.intent}] — ${step.action_title} — ${step.reason_summary}`
      )
    ),
    "",
    formatSection(
      "DEFERRED",
      display.deferred_items.map(
        (item) => `${item.project_title} — ${item.action_title} — ${item.defer_reason}`
      )
    ),
    "",
    display.summary_text,
  ];

  return sections.join("\n");
}

export function formatStudioBriefJson(result: StudioBriefPipelineResult): string {
  return JSON.stringify(
    {
      schema_version: "0.5.5",
      brief_type: result.display_brief.brief_type,
      headline: result.narrative.headline,
      summary_text: result.narrative.summary_story,
      brief: result.display_brief,
      narrative: result.narrative,
      studio_report: result.studio_report,
      portfolio_ranking: result.portfolio_report.project_ranking,
      requires_human_decision: true,
    },
    null,
    2
  );
}
