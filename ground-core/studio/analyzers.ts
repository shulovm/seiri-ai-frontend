import type { DirectorReport } from "../director/types.js";
import type { PortfolioReport } from "../director/portfolio-types.js";
import type { BlockerSeverity, ProjectState } from "../types.js";
import type {
  DirectorReportIndex,
  ProjectStateIndex,
  StudioReason,
} from "./types.js";
import { SEVERITY_RANK } from "./types.js";

const META_KEYWORDS = [
  "schema",
  "cli",
  "director",
  "patch",
  "projectstate",
  "validate",
  "engine",
  "studio",
  "補完",
  "手動運用",
];

const EXECUTION_KEYWORDS = [
  "phase0",
  "manual_test",
  "field",
  "現場",
  "配布",
  "検証",
  "試験",
  "実験",
  "現地",
];

export function indexDirectorReports(reports: DirectorReport[]): DirectorReportIndex {
  return {
    byProjectId: new Map(reports.map((report) => [report.project_id, report])),
  };
}

export function indexProjectStates(states: ProjectState[] | undefined): ProjectStateIndex {
  return {
    byProjectId: new Map((states ?? []).map((state) => [state.project.id, state])),
  };
}

export function compareSeverity(
  a: BlockerSeverity | null,
  b: BlockerSeverity | null
): number {
  return (b ? SEVERITY_RANK[b] : 0) - (a ? SEVERITY_RANK[a] : 0);
}

function normalizeText(parts: string[]): string {
  return parts.join(" ").toLowerCase();
}

function countKeywordHits(text: string, keywords: string[]): number {
  const normalized = text.toLowerCase();
  return keywords.reduce(
    (count, keyword) => (normalized.includes(keyword.toLowerCase()) ? count + 1 : count),
    0
  );
}

export function collectProjectText(
  state: ProjectState | undefined,
  director: DirectorReport | undefined
): string {
  const parts: string[] = [];
  if (state) {
    parts.push(
      state.project.title,
      state.project.summary,
      state.current_state.summary,
      state.current_state.phase ?? ""
    );
    const goal = state.goals.find((entry) => entry.id === state.current_state.primary_goal_id);
    if (goal) {
      parts.push(goal.title, goal.description);
    }
    for (const doc of state.reference_docs ?? []) {
      parts.push(doc.title, doc.summary);
    }
  }
  if (director) {
    parts.push(
      director.situation.project_title,
      director.situation.state_summary,
      director.situation.phase ?? ""
    );
  }
  return normalizeText(parts);
}

export function isMetaInfraPattern(text: string): boolean {
  return countKeywordHits(text, META_KEYWORDS) >= 2;
}

export function isFieldValidationPattern(text: string): boolean {
  return countKeywordHits(text, EXECUTION_KEYWORDS) >= 1;
}

export function hasRecentObservation(state: ProjectState | undefined, days = 30): boolean {
  if (!state) {
    return false;
  }

  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return (state.observations ?? []).some(
    (observation) => new Date(observation.created_at).getTime() >= threshold
  );
}

export function highestOpenBlockerSeverity(
  director: DirectorReport | undefined
): BlockerSeverity | null {
  if (!director || director.open_blockers.length === 0) {
    return null;
  }

  return director.open_blockers.reduce<BlockerSeverity | null>((current, blocker) => {
    if (!current) {
      return blocker.severity;
    }
    return SEVERITY_RANK[blocker.severity] > SEVERITY_RANK[current]
      ? blocker.severity
      : current;
  }, null);
}

export function buildSituationSummary(
  portfolio: PortfolioReport,
  directors: DirectorReportIndex
): string {
  const activeCount = portfolio.project_ranking.length;
  const parts = [`${activeCount} project を横断監視中。`];

  for (const entry of portfolio.project_ranking.slice(0, 4)) {
    const director = directors.byProjectId.get(entry.project_id);
    const phase = director?.situation.phase ?? "unknown";
    parts.push(
      `${entry.project_title} は rank ${entry.rank} / phase ${phase} / cross_project_score ${entry.cross_project_score.toFixed(2)}。`
    );
  }

  return parts.join(" ");
}

export function portfolioReasonToStudioReason(
  message: string,
  kind: StudioReason["kind"] = "portfolio_primary"
): StudioReason {
  return {
    kind,
    message,
    weight: 1,
  };
}

export function ensureMinimumReasons(
  reasons: StudioReason[],
  fallback: StudioReason[]
): StudioReason[] {
  if (reasons.length >= 2) {
    return reasons;
  }

  return [...reasons, ...fallback].slice(0, Math.max(2, reasons.length));
}
