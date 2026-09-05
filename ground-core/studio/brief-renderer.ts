import {
  buildHeadline,
  buildSummaryText,
  formatDeepWorkFocusNote,
  formatSessionFocusNote,
  getSectionLimits,
  mapBlockedItems,
  mapDecisionBriefs,
  mapDeferredItems,
  mapFlowNoteItems,
  mapFlowSteps,
  mapGrowthItems,
  mapPortfolioNote,
  mapPrimaryFocus,
  mapRiskBriefs,
  mapSecondaryFocuses,
  mapWhyNotSummary,
} from "./brief-formatters.js";
import type {
  BriefRenderer,
  BriefRendererInput,
  StudioBrief,
  StudioReport,
} from "./brief-types.js";

export class BriefRendererError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BriefRendererError";
  }
}

function assertPrimaryAlignment(report: StudioReport): void {
  const portfolio = report.portfolio_primary;
  const focus = report.today_focus.primary;
  const alignment = report.portfolio_alignment;

  if (
    focus.project_id !== portfolio.project_id ||
    focus.action_id !== portfolio.next_action_id
  ) {
    throw new BriefRendererError(
      "today_focus.primary must match portfolio_primary (Renderer must not change primary)"
    );
  }

  if (
    alignment.primary_project_id !== portfolio.project_id ||
    alignment.primary_action_id !== portfolio.next_action_id
  ) {
    throw new BriefRendererError(
      "portfolio_alignment must match portfolio_primary"
    );
  }
}

function validateBriefOutput(brief: StudioBrief, report: StudioReport): void {
  const portfolio = report.portfolio_primary;

  if (
    brief.primary_focus.project_id !== portfolio.project_id ||
    brief.primary_focus.action_id !== portfolio.next_action_id
  ) {
    throw new BriefRendererError("Rendered primary_focus must match portfolio_primary");
  }

  if (!brief.primary_focus.reason_summary.trim()) {
    throw new BriefRendererError("primary_focus.reason_summary must not be empty");
  }

  if (brief.why_not_summary.length === 0) {
    throw new BriefRendererError("why_not_summary must not be empty");
  }

  for (const item of brief.deferred_items) {
    if (!item.defer_reason.trim()) {
      throw new BriefRendererError("deferred_items.defer_reason must not be empty");
    }
  }

  for (const item of [
    brief.primary_focus,
    ...brief.secondary_focuses,
    ...brief.blocked_items.map((entry) => ({ reason_summary: entry.reason_summary })),
    ...brief.flow_note_items.map((entry) => ({ reason_summary: entry.reason_summary })),
    ...brief.recommended_flow.map((entry) => ({ reason_summary: entry.reason_summary })),
  ]) {
    if (!item.reason_summary.trim()) {
      throw new BriefRendererError("reason_summary must not be empty");
    }
  }
}

export function renderStudioBrief(input: BriefRendererInput): StudioBrief {
  const { report, brief_type: briefType } = input;
  assertPrimaryAlignment(report);

  const limits = getSectionLimits(briefType);
  const primaryFocus = mapPrimaryFocus(report);
  if (briefType === "session") {
    const sessionNote = formatSessionFocusNote(report.portfolio_primary.reasons);
    if (sessionNote) {
      primaryFocus.mode_context_note = sessionNote;
    }
  }
  if (briefType === "deep-work") {
    const deepWorkNote = formatDeepWorkFocusNote(report.portfolio_primary.reasons);
    if (deepWorkNote) {
      primaryFocus.mode_context_note = deepWorkNote;
    }
  }
  const secondaryFocuses = mapSecondaryFocuses(
    report,
    primaryFocus,
    limits.maxSecondary
  );
  const blockedItems = limits.includeBlocked
    ? mapBlockedItems(report, limits.maxBlocked)
    : [];
  const flowNoteItems = mapFlowNoteItems(report, limits.maxFlowNotes, {
    briefType,
    projectStates: input.project_states,
  });
  const growthItems = limits.includeGrowing
    ? mapGrowthItems(report, limits.maxGrowing)
    : [];
  const decisionBriefs = limits.includeDecisions
    ? mapDecisionBriefs(report, limits.maxDecisions, primaryFocus.project_id)
    : [];
  const riskBriefs = mapRiskBriefs(report, limits.maxRisks);
  const recommendedFlow = mapFlowSteps(
    report,
    limits.maxFlow,
    limits.filterFlowTimeBoxes
  );
  const deferredItems = mapDeferredItems(report);
  const portfolioNote = mapPortfolioNote(report);
  const whyNotSummary = mapWhyNotSummary(report.portfolio_primary, report.portfolio_alignment);
  const headline = buildHeadline(briefType, primaryFocus);

  const brief: StudioBrief = {
    schema_version: "0.5.1",
    brief_type: briefType,
    engine: ruleBriefRenderer.name,
    generated_at: report.generated_at,
    headline,
    primary_focus: primaryFocus,
    secondary_focuses: secondaryFocuses,
    blocked_items: blockedItems,
    flow_note_items: flowNoteItems,
    growth_items: growthItems,
    decision_briefs: decisionBriefs,
    risk_briefs: riskBriefs,
    recommended_flow: recommendedFlow,
    deferred_items: deferredItems,
    portfolio_note: portfolioNote,
    why_not_summary: whyNotSummary,
    summary_text: "",
    requires_human_decision: true,
  };

  brief.summary_text = buildSummaryText({
    briefType,
    headline,
    primaryFocus,
    secondaryFocuses,
    blockedItems,
    growthItems,
    decisionBriefs,
    riskBriefs,
    recommendedFlow,
    deferredItems,
    portfolioNote,
    whyNotSummary,
  });

  validateBriefOutput(brief, report);
  return brief;
}

export const ruleBriefRenderer: BriefRenderer = {
  name: "rule-brief-renderer-v1",
  render(input: BriefRendererInput): StudioBrief {
    return renderStudioBrief(input);
  },
};
