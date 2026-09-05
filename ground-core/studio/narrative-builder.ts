import {
  assertNoBannedPhrases,
  assertNonEmpty,
  countSentences,
} from "./narrative-formatters.js";
import type { NarrativeBuilder, NarrativeBuilderInput, StudioNarrative } from "./narrative-types.js";
import {
  buildBlockerStory,
  buildCurrentSituation,
  buildDecisionStory,
  buildDeferredStory,
  buildFlowStory,
  buildGrowthStory,
  buildHeadline,
  buildRiskStory,
  buildSummaryStory,
  buildTodayFocusStory,
} from "./narrative-rules.js";
import type { StudioReport } from "./types.js";

export const NARRATIVE_ENGINE_NAME = "rule-narrative-v1";

export class NarrativeBuilderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NarrativeBuilderError";
  }
}

function validateNarrativeOutput(narrative: StudioNarrative, report: StudioReport): void {
  const fields: Array<keyof StudioNarrative> = [
    "headline",
    "current_situation",
    "today_focus_story",
    "flow_story",
    "blocker_story",
    "growth_story",
    "risk_story",
    "decision_story",
    "deferred_story",
    "summary_story",
  ];

  for (const field of fields) {
    const value = narrative[field];
    if (typeof value !== "string") {
      continue;
    }
    assertNonEmpty(field, value);
    assertNoBannedPhrases(value);
  }

  if (countSentences(narrative.summary_story) < 3) {
    throw new NarrativeBuilderError("summary_story must contain at least 3 sentences");
  }

  if (!narrative.today_focus_story.includes(report.today_focus.primary.project_title)) {
    throw new NarrativeBuilderError(
      "today_focus_story must reference portfolio primary from StudioReport"
    );
  }

  for (const step of report.recommended_flow) {
    if (step.project_title.length > 0 && !narrative.flow_story.includes(step.project_title)) {
      throw new NarrativeBuilderError(
        "flow_story must preserve recommended_flow project order from StudioReport"
      );
    }
  }
}

function buildStudioNarrative(input: NarrativeBuilderInput): StudioNarrative {
  const { report } = input;

  const headline = buildHeadline(report);
  const currentSituation = buildCurrentSituation(report);
  const todayFocusStory = buildTodayFocusStory(report);
  const flowStory = buildFlowStory(report);
  const blockerStory = buildBlockerStory(report);
  const growthStory = buildGrowthStory(report);
  const riskStory = buildRiskStory(report);
  const decisionStory = buildDecisionStory(report);
  const deferredStory = buildDeferredStory(report);
  const summaryStory = buildSummaryStory(report);

  const narrative: StudioNarrative = {
    schema_version: "0.5.4",
    engine: NARRATIVE_ENGINE_NAME,
    generated_at: new Date().toISOString(),
    headline,
    current_situation: currentSituation,
    today_focus_story: todayFocusStory,
    flow_story: flowStory,
    blocker_story: blockerStory,
    growth_story: growthStory,
    risk_story: riskStory,
    decision_story: decisionStory,
    deferred_story: deferredStory,
    summary_story: summaryStory,
    requires_human_decision: true,
  };

  validateNarrativeOutput(narrative, report);
  return narrative;
}

export const ruleNarrative: NarrativeBuilder = {
  name: NARRATIVE_ENGINE_NAME,
  build: buildStudioNarrative,
};

export { buildStudioNarrative };
