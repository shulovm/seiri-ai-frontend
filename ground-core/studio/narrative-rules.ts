import {
  formatIntentLabel,
  formatTimeBoxLabel,
  joinSentences,
  summarizeReasons,
  truncateText,
} from "./narrative-formatters.js";
import type {
  StudioBlockedProject,
  StudioDecisionMaterial,
  StudioDeferredProject,
  StudioFlowStep,
  StudioGrowingProject,
  StudioReport,
  StudioRiskProject,
} from "./types.js";

const RISK_KIND_LABEL: Record<StudioRiskProject["risk_kind"], string> = {
  observation_gap: "観測不足",
  stalled: "停滞",
  resource_overload: "リソース過負荷",
  blocker_pressure: "ブロッカー圧力",
  scope_creep: "スコープ拡大",
};

const DECISION_KIND_LABEL: Record<StudioDecisionMaterial["kind"], string> = {
  decision: "未確定の判断",
  hypothesis: "未検証の仮説",
  observation: "最新の観測",
  portfolio_factor: "Portfolio 信頼度要因",
};

function hasReasonKind(report: StudioReport, kind: string): boolean {
  return report.today_focus.primary.reasons.some((reason) => reason.kind === kind);
}

export function buildHeadline(report: StudioReport): string {
  const primary = report.today_focus.primary;
  const blockedCount = report.blocked_projects.length;
  const flowCount = report.recommended_flow.length;

  if (hasReasonKind(report, "field_validation")) {
    return "現場検証を先頭に置く構成が、全体の進行ペースを左右する状況です。";
  }

  if (blockedCount > 0) {
    return joinSentences([
      `ブロッカーが ${blockedCount} 件ある横断局面のなか、`,
      `Portfolio primary の ${primary.project_title} が今日の中心です。`,
    ]);
  }

  if (report.portfolio_alignment.deep_work_warning) {
    return joinSentences([
      `deep work が ${report.portfolio_alignment.deep_work_step_count} 件重なるため、`,
      `時間配分の判断が必要な状況です。`,
    ]);
  }

  return joinSentences([
    `${primary.project_title} を today の中心に、`,
    `${flowCount} project の横断フローを組んだ状況です。`,
  ]);
}

export function buildCurrentSituation(report: StudioReport): string {
  const parts = [report.today_focus.situation_summary.trim()];

  if (report.portfolio_alignment.note.trim().length > 0) {
    parts.push(report.portfolio_alignment.note.trim());
  }

  if (report.blocked_projects.length > 0) {
    parts.push(
      `停止要因として ${report.blocked_projects.length} project が Studio に記録されています。`
    );
  }

  return joinSentences(parts.map((part) => (part.endsWith("。") ? part : `${part}。`)));
}

export function buildTodayFocusStory(report: StudioReport): string {
  const primary = report.today_focus.primary;
  const reasonMessages = summarizeReasons(primary.reasons, 2, 4);

  const reasonText =
    reasonMessages.length >= 2
      ? reasonMessages.join("また、")
      : [
          ...reasonMessages,
          `Portfolio primary として ${primary.action_title} が選ばれています`,
          `confidence ${primary.confidence.toFixed(2)} の構造シグナル`,
        ]
          .slice(0, 2)
          .join("また、");

  return joinSentences([
    `今日の primary は ${primary.project_title} の「${primary.action_title}」。`,
    `${reasonText.endsWith("。") ? reasonText : `${reasonText}。`}`,
    "Studio は Portfolio の順位を変更していません。",
  ]);
}

export function buildFlowStory(report: StudioReport): string {
  const flow = report.recommended_flow;

  if (flow.length === 0) {
    return "StudioReport に recommended_flow がないため、横断フローは未構成です。Portfolio primary のみを参照してください。";
  }

  const stepDescriptions = flow.map((step) => describeFlowStep(step));
  const flowLine = stepDescriptions.join(" → ");

  const warning =
    report.portfolio_alignment.deep_work_warning
      ? ` deep work が ${report.portfolio_alignment.deep_work_step_count} 件あり、同時実行は人間が時間配分を判断する必要があります。`
      : "";

  return joinSentences([
    `Portfolio rank 順の横断フロー: ${flowLine}。`,
    warning.length > 0 ? `${warning.trim()}。` : "順序は Portfolio ranking をそのまま反映しています。",
  ]);
}

function describeFlowStep(step: StudioFlowStep): string {
  const intent = formatIntentLabel(step.intent);
  const timeBox = formatTimeBoxLabel(step.time_box);
  const reason = step.reasons[0]?.message ?? "rank 由来";

  return truncateText(
    `${step.order}. ${step.project_title}（${timeBox} / ${intent} — ${step.action_title}。${reason}）`,
    160
  );
}

export function buildBlockerStory(report: StudioReport): string {
  const blocked = report.blocked_projects;

  if (blocked.length === 0) {
    return "現在、StudioReport 上で open blocker として記録された停止要因はありません。フローは Portfolio ranking に従って進められます。";
  }

  const descriptions = blocked.slice(0, 4).map((entry) => describeBlockedProject(entry));
  return joinSentences([
    `停止要因が ${blocked.length} 件あり、流れを止めています（severity 降順）。`,
    descriptions.join(" "),
  ]);
}

function describeBlockedProject(entry: StudioBlockedProject): string {
  const severity = entry.severity ?? "未分類";
  const blocker = entry.blocker_title ?? "ブロッカー未特定";
  const reason = entry.reasons[0]?.message ?? `${entry.status} シグナル`;
  return truncateText(
    `${entry.project_title} は ${entry.status}（severity ${severity}、${blocker}）。理由: ${reason}。`,
    200
  );
}

export function buildGrowthStory(report: StudioReport): string {
  const growing = report.growing_projects;

  if (growing.length === 0) {
    return "momentum や dependency ready の構造シグナルが強い project は、現時点で StudioReport に記録されていません。";
  }

  const descriptions = growing.slice(0, 3).map((entry) => {
    const reason = entry.reasons[0]?.message ?? "momentum シグナル";
    return truncateText(
      `${entry.project_title}（momentum ${entry.momentum_score.toFixed(2)} — ${reason}）`,
      140
    );
  });

  return joinSentences([
    `伸びている project が ${growing.length} 件あります。`,
    descriptions.join(" "),
    "これらは primary を置き換えるものではなく、横断状況の補助情報です。",
  ]);
}

export function buildRiskStory(report: StudioReport): string {
  const risks = report.risk_projects;

  if (risks.length === 0) {
    return "observation gap や resource overload など、StudioReport が検知した横断リスクは現時点でありません。";
  }

  const descriptions = risks.slice(0, 4).map((entry) => describeRiskProject(entry));
  return joinSentences([
    `注意が必要な project / 状況が ${risks.length} 件あります。`,
    descriptions.join(" "),
  ]);
}

function describeRiskProject(entry: StudioRiskProject): string {
  const kindLabel = RISK_KIND_LABEL[entry.risk_kind];
  const reason = entry.reasons[0]?.message ?? kindLabel;
  return truncateText(
    `${entry.project_title} — ${kindLabel}（severity ${entry.severity}。${reason}）`,
    180
  );
}

export function buildDecisionStory(report: StudioReport): string {
  const materials = report.decision_materials;

  if (materials.length === 0) {
    return "active decision / untested hypothesis / 最新 observation は StudioReport に含まれていません。Portfolio confidence_factors も未記録です。";
  }

  const descriptions = materials.slice(0, 5).map((entry) => describeDecisionMaterial(entry));
  return joinSentences([
    `判断材料として ${materials.length} 件を整理しています。`,
    descriptions.join(" "),
    "Narrative は新しい判断を追加しません。",
  ]);
}

function describeDecisionMaterial(entry: StudioDecisionMaterial): string {
  const kindLabel = DECISION_KIND_LABEL[entry.kind];
  const pending = entry.pending_question
    ? ` 未決: ${entry.pending_question}`
    : "";
  return truncateText(
    `[${kindLabel}] ${entry.project_title} — ${entry.title}（${entry.summary}${pending}）`,
    200
  );
}

export function buildDeferredStory(report: StudioReport): string {
  const deferred = report.deferred_projects;

  if (deferred.length === 0) {
    return "Portfolio deferred として StudioReport に記録された後回し project はありません。今日は ranking 上位のフローに集中できます。";
  }

  const descriptions = deferred.map((entry) => {
    const reason = entry.reasons[0]?.message ?? "Portfolio deferred 理由";
    return truncateText(
      `${entry.project_title} の「${entry.action_title}」— 理由: ${reason}。`,
      180
    );
  });

  return joinSentences([
    `後回しにする project が ${deferred.length} 件あります。`,
    descriptions.join(" "),
    "順位の変更は Portfolio が担い、Studio は引き継ぎのみです。",
  ]);
}

export function buildSummaryStory(report: StudioReport): string {
  const primary = report.today_focus.primary;
  const flow = report.recommended_flow;
  const flowTitles =
    flow.length > 0
      ? flow.map((step) => step.project_title).join(" → ")
      : "フロー未構成";

  const sentences = [
    buildHeadline(report),
    `今日は ${primary.project_title} の ${primary.action_title} を Portfolio primary どおり中心に置きます。`,
    `横断フローは ${flow.length} ステップ（${flowTitles}）で、Portfolio rank 順を維持しています。`,
  ];

  if (report.blocked_projects.length > 0) {
    sentences.push(
      `停止要因は ${report.blocked_projects.length} 件 — 最優先は ${report.blocked_projects[0].project_title} です。`
    );
  }

  if (report.risk_projects.length > 0) {
    sentences.push(
      `注意点は ${report.risk_projects.length} 件 — ${report.risk_projects[0].project_title} の ${RISK_KIND_LABEL[report.risk_projects[0].risk_kind]} が先頭です。`
    );
  }

  if (report.deferred_projects.length > 0) {
    sentences.push(
      `後回しは ${report.deferred_projects.length} 件 — ${report.deferred_projects.map((entry) => entry.project_title).join("、")} を今日の primary から外しています。`
    );
  }

  sentences.push("最終判断は人間が行い、Narrative は状況説明のみを担います。");

  return joinSentences(
    sentences.map((sentence) => (sentence.endsWith("。") ? sentence : `${sentence}。`))
  );
}
