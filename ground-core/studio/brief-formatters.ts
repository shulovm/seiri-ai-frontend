import type {
  BlockedItem,
  BriefSectionLimits,
  DecisionBrief,
  DeferredItem,
  FlowNoteItem,
  FlowNoteKind,
  FlowStep,
  FocusItem,
  GrowthItem,
  PortfolioNote,
  RiskBrief,
  RiskBriefKind,
  StudioAtRiskProject,
  StudioBriefType,
  StudioFlowStepSource,
  StudioDeferralSource,
  StudioGrowingProject,
  StudioPortfolioPrimary,
  StudioReport,
  StudioRiskWarningSource,
  StudioBottleneckSource,
  WhyNotSummary,
} from "./brief-types.js";
import type { PortfolioRecommendationReason } from "../director/portfolio-types.js";
import { getActionIntentRecords } from "../intake/action-intent.js";
import type { ProjectState } from "../types.js";

const CLOSED_ACTION_STATUSES = new Set(["done", "cancelled"]);

const SEVERITY_RANK: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const RISK_SEVERITY_RANK: Record<RiskBrief["severity"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function truncateText(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 1)}…`;
}

export function summarizeMessages(messages: string[], maxLength = 120): string {
  const combined = messages
    .map((message) => message.trim())
    .filter((message) => message.length > 0)
    .slice(0, 2)
    .join("；");

  if (combined.length > 0) {
    return truncateText(combined, maxLength);
  }

  return "構造シグナルに基づく提案";
}

/** Brief text line for portfolio session_focus reason (session mode only). */
export function formatSessionFocusNote(
  reasons: PortfolioRecommendationReason[]
): string | undefined {
  const focus = reasons.find((reason) => reason.kind === "session_focus");
  if (!focus || focus.message.includes("bonus なし")) {
    return undefined;
  }

  const delta =
    focus.score_delta !== undefined && focus.score_delta > 0
      ? ` (+${focus.score_delta.toFixed(2)})`
      : "";

  if (focus.message.includes("explicit")) {
    return `session focus — explicit focus project${delta}`;
  }

  if (focus.message.includes("fallback")) {
    return `session focus — first project fallback${delta}`;
  }

  return truncateText(`session focus — ${focus.message}`, 140);
}

/** Brief text line for portfolio deep_work_focus reason (deep-work mode only). */
export function formatDeepWorkFocusNote(
  reasons: PortfolioRecommendationReason[]
): string | undefined {
  const focus = reasons.find((reason) => reason.kind === "deep_work_focus");
  if (!focus || focus.message.includes("bonus なし")) {
    return undefined;
  }

  const delta =
    focus.score_delta !== undefined && focus.score_delta > 0
      ? ` (+${focus.score_delta.toFixed(2)})`
      : "";

  if (focus.message.includes("deep_work")) {
    return `deep-work focus — 集中作業向きのAction intentが指定されています${delta}`;
  }

  if (focus.message.includes("fallback")) {
    return `deep-work focus — downstream unlock fallback${delta}`;
  }

  return truncateText(`deep-work focus — ${focus.message}`, 140);
}

export function compareBlockerSeverity(
  a: BlockedItem["severity"],
  b: BlockedItem["severity"]
): number {
  return (b ? SEVERITY_RANK[b] ?? 0 : 0) - (a ? SEVERITY_RANK[a] ?? 0 : 0);
}

export function compareRiskSeverity(a: RiskBrief["severity"], b: RiskBrief["severity"]): number {
  return RISK_SEVERITY_RANK[b] - RISK_SEVERITY_RANK[a];
}

const RISK_DIVERSITY_KIND_ORDER: RiskBriefKind[] = [
  "blocker_pressure",
  "decision_pending",
  "observation_gap",
  "untested_hypothesis",
  "resource_overload",
  "portfolio_misalignment",
  "scope_creep",
];

function aggregateObservationGapWarnings(
  items: StudioRiskWarningSource[]
): StudioRiskWarningSource {
  const projectTitles = items.map(
    (item) => item.project_title ?? item.message.split(" — ")[0] ?? "project"
  );

  return {
    kind: "observation_gap",
    severity: "high",
    message: `${items.length} projects — 30日以内の observation がない — 判断材料不足`,
    entity_type: "project",
    mitigation_messages: projectTitles,
  };
}

/** Prefer one signal per kind; aggregate duplicate observation_gap across projects. */
export function selectDiverseRiskWarnings(
  warnings: StudioRiskWarningSource[],
  maxCount: number,
  primaryProjectId: string
): StudioRiskWarningSource[] {
  if (maxCount === 0 || warnings.length === 0) {
    return [];
  }

  const grouped = new Map<RiskBriefKind, StudioRiskWarningSource[]>();
  for (const warning of warnings) {
    const bucket = grouped.get(warning.kind) ?? [];
    bucket.push(warning);
    grouped.set(warning.kind, bucket);
  }

  const selected: StudioRiskWarningSource[] = [];
  let aggregatedObservationGap = false;

  for (const kind of RISK_DIVERSITY_KIND_ORDER) {
    if (selected.length >= maxCount) {
      break;
    }

    if (kind === "observation_gap") {
      const items = grouped.get("observation_gap") ?? [];
      if (items.length >= 2) {
        selected.push(aggregateObservationGapWarnings(items));
        aggregatedObservationGap = true;
      } else if (items.length === 1) {
        selected.push(items[0]);
      }
      continue;
    }

    const items = grouped.get(kind) ?? [];
    if (items.length === 0) {
      continue;
    }

    if (kind === "untested_hypothesis") {
      const primaryMatch = items.find((item) => item.project_id === primaryProjectId);
      selected.push(
        primaryMatch ??
          [...items].sort((a, b) => compareRiskSeverity(a.severity, b.severity))[0]
      );
      continue;
    }

    selected.push(
      [...items].sort((a, b) => compareRiskSeverity(a.severity, b.severity))[0]
    );
  }

  if (selected.length < maxCount) {
    const chosen = new Set(selected);
    const remainder = [...warnings]
      .filter((warning) => {
        if (aggregatedObservationGap && warning.kind === "observation_gap") {
          return false;
        }
        return !chosen.has(warning);
      })
      .sort((a, b) => compareRiskSeverity(b.severity, a.severity));

    for (const warning of remainder) {
      if (selected.length >= maxCount) {
        break;
      }
      if (selected.some((entry) => entry.kind === warning.kind && entry.message === warning.message)) {
        continue;
      }
      selected.push(warning);
    }
  }

  return selected.slice(0, maxCount);
}

export function getSectionLimits(briefType: StudioBriefType): BriefSectionLimits {
  switch (briefType) {
    case "morning":
      return {
        maxSecondary: 3,
        maxFlow: null,
        maxBlocked: 3,
        maxFlowNotes: 3,
        maxGrowing: 2,
        maxDecisions: 3,
        maxRisks: 3,
        includeBlocked: true,
        includeGrowing: true,
        includeDecisions: true,
      };
    case "session":
      return {
        maxSecondary: 1,
        maxFlow: 2,
        maxBlocked: 0,
        maxFlowNotes: 0,
        maxGrowing: 0,
        maxDecisions: 0,
        maxRisks: 2,
        includeBlocked: false,
        includeGrowing: false,
        includeDecisions: false,
        filterFlowTimeBoxes: ["session", "now"],
      };
    case "deep-work":
      return {
        maxSecondary: 0,
        maxFlow: 1,
        maxBlocked: 0,
        maxFlowNotes: 3,
        maxGrowing: 0,
        maxDecisions: 0,
        maxRisks: 1,
        includeBlocked: false,
        includeGrowing: false,
        includeDecisions: false,
        filterFlowTimeBoxes: ["now", "session"],
      };
    default:
      return getSectionLimits("morning");
  }
}

export function buildHeadline(
  briefType: StudioBriefType,
  primary: FocusItem
): string {
  switch (briefType) {
    case "session":
      return `次の 2 時間: ${primary.action_title} を優先`;
    case "deep-work":
      return `今集中: ${primary.action_title}（${primary.project_title}）`;
    case "morning":
    default:
      return `今日の焦点: ${primary.project_title} — ${primary.action_title}`;
  }
}

export function mapPrimaryFocus(report: StudioReport): FocusItem {
  const primary = report.portfolio_primary;
  return {
    project_id: primary.project_id,
    project_title: primary.project_title,
    action_id: primary.next_action_id,
    action_title: primary.next_action_label,
    reason_summary: summarizeMessages(
      primary.reasons.map((reason) => reason.message),
      140
    ),
    confidence: primary.confidence,
    source: "portfolio_primary",
  };
}

export function mapSecondaryFocuses(
  report: StudioReport,
  primary: FocusItem,
  maxCount: number
): FocusItem[] {
  if (maxCount === 0) {
    return [];
  }

  const candidates = [
    ...report.today_focus.alternatives,
    ...report.priority_stack.alternatives,
  ];

  const seen = new Set<string>();
  const results: FocusItem[] = [];

  for (const candidate of candidates) {
    const key = `${candidate.project_id}:${candidate.action_id}`;
    if (seen.has(key)) {
      continue;
    }

    if (
      candidate.project_id === primary.project_id &&
      candidate.action_id === primary.action_id
    ) {
      continue;
    }

    seen.add(key);
    results.push({
      project_id: candidate.project_id,
      project_title: candidate.project_title,
      action_id: candidate.action_id,
      action_title: candidate.action_title,
      reason_summary: summarizeMessages(candidate.reason_messages, 120),
      confidence: candidate.confidence,
      source: "portfolio_alternative",
    });

    if (results.length >= maxCount) {
      break;
    }
  }

  return results;
}

export function mapBlockedItems(report: StudioReport, maxCount: number): BlockedItem[] {
  if (maxCount === 0) {
    return [];
  }

  return report.at_risk_projects
    .map((entry) => mapAtRiskProject(entry))
    .sort((a, b) => compareBlockerSeverity(a.severity, b.severity))
    .slice(0, maxCount);
}

function inferFlowNoteKind(bottleneck: StudioBottleneckSource): FlowNoteKind {
  if (bottleneck.blocker_title) {
    return "bottleneck";
  }

  const combined = bottleneck.reason_messages.join(" ").toLowerCase();
  if (combined.includes("downstream") || combined.includes("解放")) {
    return "unlock";
  }

  return "flow_note";
}

function formatFlowNoteSummary(
  bottleneck: StudioBottleneckSource,
  noteKind: FlowNoteKind
): string {
  const unlockMatch = bottleneck.reason_messages
    .join(" ")
    .match(/downstream\s*解放\s*(\d+)\s*件/i);

  if (noteKind === "unlock" && unlockMatch) {
    return `後続actionを${unlockMatch[1]}件解放`;
  }

  if (noteKind === "unlock") {
    return "このactionを進めると後続actionが解放される";
  }

  return summarizeMessages(bottleneck.reason_messages, 120);
}

export function collectNonPrimaryDeepWorkCandidateNotes(
  projectStates: ProjectState[]
): FlowNoteItem[] {
  const items: FlowNoteItem[] = [];

  for (const state of projectStates) {
    const primaryId = state.current_state.primary_next_action_id;
    const actionsById = new Map(state.next_actions.map((action) => [action.id, action]));

    for (const record of getActionIntentRecords(state)) {
      if (record.intent !== "deep_work") {
        continue;
      }
      if (record.action_id === primaryId) {
        continue;
      }

      const action = actionsById.get(record.action_id);
      if (!action || CLOSED_ACTION_STATUSES.has(action.status)) {
        continue;
      }

      items.push({
        project_id: state.project.id,
        project_title: state.project.title,
        action_title: null,
        note_kind: "deep_work_candidate",
        reason_summary: `後続に deep-work 候補「${record.action_title}」があります`,
      });
      break;
    }
  }

  return items;
}

export interface MapFlowNoteItemsOptions {
  briefType?: StudioBriefType;
  projectStates?: ProjectState[];
}

export function mapFlowNoteItems(
  report: StudioReport,
  maxCount: number,
  options?: MapFlowNoteItemsOptions
): FlowNoteItem[] {
  if (maxCount === 0) {
    return [];
  }

  const blockedWithOpenBlocker = new Set(
    report.at_risk_projects
      .filter((entry) => entry.blocker_title !== null)
      .map((entry) => entry.project_id)
  );

  const items: FlowNoteItem[] = [];

  for (const bottleneck of report.cross_project_bottlenecks ?? []) {
    if (bottleneck.blocker_title && blockedWithOpenBlocker.has(bottleneck.project_id)) {
      continue;
    }

    const noteKind = inferFlowNoteKind(bottleneck);
    items.push({
      project_id: bottleneck.project_id,
      project_title: bottleneck.project_title,
      action_title: bottleneck.next_action_title,
      note_kind: noteKind,
      reason_summary: formatFlowNoteSummary(bottleneck, noteKind),
    });
  }

  if (options?.briefType === "deep-work" && options.projectStates) {
    items.push(...collectNonPrimaryDeepWorkCandidateNotes(options.projectStates));
  }

  return items.slice(0, maxCount);
}

function mapAtRiskProject(entry: StudioAtRiskProject): BlockedItem {
  return {
    project_id: entry.project_id,
    project_title: entry.project_title,
    status: entry.health_status,
    blocker_title: entry.blocker_title,
    action_title: entry.blocked_action_title,
    severity: entry.blocker_severity,
    reason_summary: summarizeMessages(entry.reason_messages, 120),
  };
}

export function mapGrowthItems(report: StudioReport, maxCount: number): GrowthItem[] {
  if (maxCount === 0) {
    return [];
  }

  return [...report.growing_projects]
    .sort((a, b) => b.momentum_score - a.momentum_score)
    .slice(0, maxCount)
    .map((entry) => ({
      project_id: entry.project_id,
      project_title: entry.project_title,
      momentum_score: entry.momentum_score,
      signal_summary: summarizeMessages(entry.signal_messages, 100),
    }));
}

export function mapDecisionBriefs(
  report: StudioReport,
  maxCount: number,
  primaryProjectId?: string
): DecisionBrief[] {
  if (maxCount === 0) {
    return [];
  }

  let decisions = report.decision_brief.active_decisions.filter(
    (entry) => entry.status === "active"
  );

  if (primaryProjectId !== undefined && maxCount <= 2) {
    const related = decisions.filter((entry) => entry.project_id === primaryProjectId);
    if (related.length > 0) {
      decisions = related;
    }
  }

  return decisions.slice(0, maxCount).map((entry) => ({
    project_id: entry.project_id,
    project_title: entry.project_title,
    decision_id: entry.decision_id,
    decision_title: entry.decision_title,
    rationale_summary: truncateText(entry.rationale, 120),
    pending_question: entry.pending_question,
  }));
}

export function mapRiskBriefs(report: StudioReport, maxCount: number): RiskBrief[] {
  if (maxCount === 0) {
    return [];
  }

  const selected = selectDiverseRiskWarnings(
    report.risk_warnings,
    maxCount,
    report.portfolio_primary.project_id
  );

  return selected.map(mapRiskWarning);
}

function mapRiskWarning(entry: StudioRiskWarningSource): RiskBrief {
  return {
    kind: entry.kind,
    severity: entry.severity,
    message: entry.message,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id,
    mitigation_hint: summarizeMessages(entry.mitigation_messages, 100),
  };
}

export function mapFlowSteps(
  report: StudioReport,
  maxCount: number | null,
  allowedTimeBoxes?: FlowStep["time_box"][]
): FlowStep[] {
  let steps = [...report.flow_proposal.steps];

  if (allowedTimeBoxes && allowedTimeBoxes.length > 0) {
    const filtered = steps.filter((step) => allowedTimeBoxes.includes(step.time_box));
    if (filtered.length > 0) {
      steps = filtered;
    }
  }

  steps.sort((a, b) => a.order - b.order);

  if (maxCount !== null) {
    steps = steps.slice(0, maxCount);
  }

  return steps.map(mapFlowStep);
}

function mapFlowStep(step: StudioFlowStepSource): FlowStep {
  return {
    order: step.order,
    time_box: step.time_box,
    project_id: step.project_id,
    project_title: step.project_title,
    action_id: step.action_id,
    action_title: step.action_title,
    intent: step.intent,
    reason_summary: summarizeMessages(step.reason_messages, 100),
  };
}

export function mapDeferredItems(report: StudioReport): DeferredItem[] {
  return report.explicit_deferrals.map((entry) => mapDeferralSource(entry));
}

function mapDeferralSource(entry: StudioDeferralSource): DeferredItem {
  return {
    project_id: entry.project_id,
    project_title: entry.project_title,
    action_id: entry.action_id,
    action_title: entry.action_title,
    defer_reason: summarizeMessages(entry.defer_reason_messages, 140),
  };
}

export function mapPortfolioNote(report: StudioReport): PortfolioNote {
  return {
    primary_project_id: report.portfolio_alignment.primary_project_id,
    primary_action_id: report.portfolio_alignment.primary_action_id,
    alignment: report.portfolio_alignment.alignment,
    note: report.portfolio_alignment.note,
  };
}

export function mapWhyNotSummary(
  primary: StudioPortfolioPrimary,
  alignment: StudioReport["portfolio_alignment"]
): WhyNotSummary[] {
  const fromPrimary = primary.why_not_alternatives.map((entry) => ({
    compared_project_id: entry.compared_project_id,
    compared_action_title: entry.compared_next_action_label,
    summary: summarizeMessages(entry.reasons.map((reason) => reason.message), 120),
  }));

  if (fromPrimary.length > 0) {
    return fromPrimary;
  }

  if (alignment.note.trim().length > 0) {
    return [
      {
        compared_project_id: alignment.primary_project_id,
        compared_action_title: "alternative",
        summary: alignment.note,
      },
    ];
  }

  return [
    {
      compared_project_id: primary.project_id,
      compared_action_title: "alternative",
      summary: "Portfolio 1 位を維持 — 横断スコア順位に基づく",
    },
  ];
}

export function buildSummaryText(input: {
  briefType: StudioBriefType;
  headline: string;
  primaryFocus: FocusItem;
  secondaryFocuses: FocusItem[];
  blockedItems: BlockedItem[];
  growthItems: GrowthItem[];
  decisionBriefs: DecisionBrief[];
  riskBriefs: RiskBrief[];
  recommendedFlow: FlowStep[];
  deferredItems: DeferredItem[];
  portfolioNote: PortfolioNote;
  whyNotSummary: WhyNotSummary[];
}): string {
  const lines: string[] = [
    "=== GROUND Studio Brief ===",
    `type: ${input.briefType}`,
    "",
    input.headline,
    "",
    "--- TODAY ---",
    `Primary: ${input.primaryFocus.project_title} — ${input.primaryFocus.action_title}`,
    `Reason: ${input.primaryFocus.reason_summary}`,
    `Confidence: ${input.primaryFocus.confidence.toFixed(2)}`,
  ];

  if (input.whyNotSummary.length > 0) {
    lines.push("", "Why not:");
    for (const entry of input.whyNotSummary.slice(0, 3)) {
      lines.push(`  - ${entry.compared_action_title}: ${entry.summary}`);
    }
  }

  if (input.secondaryFocuses.length > 0) {
    lines.push("", "Secondary:");
    for (const entry of input.secondaryFocuses) {
      lines.push(
        `  - ${entry.project_title} — ${entry.action_title} (${entry.confidence.toFixed(2)})`
      );
    }
  }

  appendSection(lines, "--- BLOCKED ---", input.blockedItems, (entry) =>
    `  - ${entry.project_title} (${entry.status}): ${entry.reason_summary}`
  );

  appendSection(lines, "--- GROWING ---", input.growthItems, (entry) =>
    `  - ${entry.project_title}: ${entry.signal_summary}`
  );

  appendSection(lines, "--- DECISIONS ---", input.decisionBriefs, (entry) =>
    `  - ${entry.project_title}: ${entry.decision_title}`
  );

  appendSection(lines, "--- RISKS ---", input.riskBriefs, (entry) =>
    `  - [${entry.severity}] ${entry.message} — ${entry.mitigation_hint}`
  );

  appendSection(lines, "--- FLOW ---", input.recommendedFlow, (entry) =>
    `  ${entry.order}. ${entry.time_box} / ${entry.project_title} — ${entry.action_title}`
  );

  appendSection(lines, "--- DEFERRED ---", input.deferredItems, (entry) =>
    `  - ${entry.project_title} — ${entry.action_title}: ${entry.defer_reason}`
  );

  lines.push(
    "",
    "portfolio_note:",
    input.portfolioNote.note,
    "",
    "requires_human_decision: true"
  );

  return lines.join("\n");
}

function appendSection<T>(
  lines: string[],
  title: string,
  items: T[],
  format: (item: T) => string
): void {
  if (items.length === 0) {
    return;
  }

  lines.push("", title);
  for (const item of items) {
    lines.push(format(item));
  }
}
