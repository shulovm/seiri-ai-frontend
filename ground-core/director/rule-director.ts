import { randomUUID } from "node:crypto";
import type { ProjectState } from "../types.js";
import {
  buildNoEligiblePrimary,
  buildSituationSnapshot,
  buildSummaryText,
  collectOpenBlockers,
  computeConfidence,
  projectStatusFactor,
  toActionRecommendation,
} from "./explain.js";
import { scoreAllActions, type ScoredAction } from "./scoring.js";
import type {
  ActionRecommendation,
  DirectorEngine,
  DirectorInput,
  DirectorReport,
  Recommendation,
} from "./types.js";

export class DirectorEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectorEngineError";
  }
}

const DEFAULT_MAX_ALTERNATIVES = 3;

function pickRecommendations(
  scored: ScoredAction[],
  maxAlternatives: number
): {
  primary: ActionRecommendation;
  alternatives: ActionRecommendation[];
  hasEligiblePrimary: boolean;
} {
  const eligible = scored.filter((entry) => entry.eligible_for_primary);

  if (eligible.length === 0) {
    return {
      primary: buildNoEligiblePrimary(),
      alternatives: scored
        .slice(0, maxAlternatives)
        .map((entry) => toActionRecommendation(entry)),
      hasEligiblePrimary: false,
    };
  }

  const primaryScored = eligible[0];
  const primary = toActionRecommendation(primaryScored);

  const alternatives = eligible
    .slice(1, 1 + maxAlternatives)
    .map((entry) => toActionRecommendation(entry));

  return {
    primary,
    alternatives,
    hasEligiblePrimary: true,
  };
}

function countPendingActions(state: ProjectState): number {
  return state.next_actions.filter(
    (action) => action.status === "pending" || action.status === "in_progress"
  ).length;
}

export function recommendFromState(input: DirectorInput): DirectorReport {
  const state = input.project_state;
  const generatedAt = new Date().toISOString();
  const maxAlternatives = input.options?.max_alternatives ?? DEFAULT_MAX_ALTERNATIVES;

  const openBlockers = collectOpenBlockers(state);
  const situation = buildSituationSnapshot(
    state,
    openBlockers.length,
    countPendingActions(state)
  );

  const scored = scoreAllActions(state);
  const { primary, alternatives, hasEligiblePrimary } = pickRecommendations(
    scored,
    maxAlternatives
  );

  const statusFactor = projectStatusFactor(state.project.status);
  const { confidence, factors } = computeConfidence(primary, alternatives, statusFactor);

  const recommendation: Recommendation = {
    recommendation_id: randomUUID(),
    project_id: state.project.id,
    primary_recommendation: primary,
    alternative_recommendations: alternatives,
    confidence,
    requires_human_decision: true,
    generated_at: generatedAt,
  };

  const report: DirectorReport = {
    schema_version: "0.3.0",
    engine: ruleDirector.name,
    project_id: state.project.id,
    generated_at: generatedAt,
    situation,
    open_blockers: openBlockers,
    recommendation,
    confidence_factors: factors,
    summary_text: buildSummaryText({
      project_id: state.project.id,
      situation,
      open_blockers: openBlockers,
      primary,
      alternatives,
      confidence,
    }),
  };

  if (!hasEligiblePrimary) {
    return report;
  }

  for (const candidate of [report.recommendation.primary_recommendation, ...alternatives]) {
    if (candidate.reasons.length === 0) {
      throw new DirectorEngineError("ActionRecommendation must include at least one reason");
    }
  }

  return report;
}

export const ruleDirector: DirectorEngine = {
  name: "rule-director-v1",
  recommend(input: DirectorInput): DirectorReport {
    return recommendFromState(input);
  },
};

export function hasEligiblePrimaryRecommendation(report: DirectorReport): boolean {
  return report.recommendation.primary_recommendation.eligible_for_primary;
}
