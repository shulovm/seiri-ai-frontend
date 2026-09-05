import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  BriefRendererError,
  renderStudioBrief,
  ruleBriefRenderer,
} from "../studio/brief-renderer.js";
import type { StudioReport } from "../studio/brief-types.js";

const PROJECT_A = "10000000-0000-4000-8000-000000000001";
const PROJECT_B = "20000000-0000-4000-8000-000000000002";
const PROJECT_C = "30000000-0000-4000-8000-000000000003";
const PROJECT_D = "40000000-0000-4000-8000-000000000004";
const ACTION_A1 = "a1000000-0000-4000-8000-000000000001";
const ACTION_B1 = "b1000000-0000-4000-8000-000000000001";
const ACTION_C1 = "c1000000-0000-4000-8000-000000000001";
const ACTION_D1 = "d1000000-0000-4000-8000-000000000001";

function buildFixtureReport(): StudioReport {
  return {
    schema_version: "0.5.0",
    engine: "fixture-studio-v1",
    generated_at: "2026-06-07T08:00:00.000Z",
    portfolio_primary: {
      project_id: PROJECT_A,
      project_title: "Field Validation Project",
      next_action_id: ACTION_A1,
      next_action_label: "入口条件を1つ決める",
      confidence: 0.73,
      reasons: [
        {
          kind: "cross_project_rank",
          message: "Portfolio 1 位 — high blocker 解消で downstream 解放",
          weight: 1,
        },
      ],
      why_not_alternatives: [
        {
          compared_project_id: PROJECT_B,
          compared_project_title: "Creative Production Project",
          compared_next_action_id: ACTION_B1,
          compared_next_action_label: "チェーン先頭ルールを整理する",
          reasons: [
            {
              kind: "cross_project_rank",
              message: "横断スコア差 0.10 — Field Validation Project の方が高い",
              weight: 1,
            },
          ],
        },
      ],
    },
    today_focus: {
      primary: {
        project_id: PROJECT_A,
        project_title: "Field Validation Project",
        action_id: ACTION_A1,
        action_title: "入口条件を1つ決める",
        confidence: 0.73,
        reason_messages: ["Portfolio 1 位 — high blocker 解消で downstream 解放"],
      },
      alternatives: [
        {
          project_id: PROJECT_B,
          project_title: "Creative Production Project",
          action_id: ACTION_B1,
          action_title: "チェーン先頭ルールを整理する",
          confidence: 0.65,
          reason_messages: ["Portfolio 2 位"],
        },
        {
          project_id: PROJECT_D,
          project_title: "Meta Infra Project",
          action_id: ACTION_D1,
          action_title: "次フェーズ範囲を定義する",
          confidence: 0.58,
          reason_messages: ["Portfolio 3 位"],
        },
      ],
    },
    priority_stack: {
      alternatives: [
        {
          project_id: PROJECT_C,
          project_title: "Problem Solving Project",
          action_id: ACTION_C1,
          action_title: "観測メモを追加する",
          confidence: 0.4,
          reason_messages: ["defer 寄り"],
        },
      ],
    },
    flow_proposal: {
      steps: [
        {
          order: 1,
          time_box: "morning",
          project_id: PROJECT_A,
          project_title: "Field Validation Project",
          action_id: ACTION_A1,
          action_title: "入口条件を1つ決める",
          intent: "deep_work",
          reason_messages: ["チェーン先頭"],
        },
        {
          order: 2,
          time_box: "session",
          project_id: PROJECT_A,
          project_title: "Field Validation Project",
          action_id: ACTION_A1,
          action_title: "入口条件を1つ決める",
          intent: "deep_work",
          reason_messages: ["2 時間 deep work"],
        },
        {
          order: 3,
          time_box: "now",
          project_id: PROJECT_A,
          project_title: "Field Validation Project",
          action_id: ACTION_A1,
          action_title: "入口条件を1つ決める",
          intent: "deep_work",
          reason_messages: ["1 テーマ集中"],
        },
        {
          order: 4,
          time_box: "afternoon",
          project_id: PROJECT_B,
          project_title: "Creative Production Project",
          action_id: ACTION_B1,
          action_title: "チェーン先頭ルールを整理する",
          intent: "deep_work",
          reason_messages: ["余力時"],
        },
        {
          order: 5,
          time_box: "later",
          project_id: PROJECT_D,
          project_title: "Meta Infra Project",
          action_id: ACTION_D1,
          action_title: "次フェーズ範囲を定義する",
          intent: "defer",
          reason_messages: ["実行系優先"],
        },
      ],
    },
    at_risk_projects: [
      {
        project_id: PROJECT_C,
        project_title: "Problem Solving Project",
        health_status: "stalled",
        blocker_title: null,
        blocked_action_title: null,
        blocker_severity: null,
        reason_messages: ["30 日 observation なし"],
      },
      {
        project_id: PROJECT_B,
        project_title: "Creative Production Project",
        health_status: "blocked",
        blocker_title: "一貫性 blocker",
        blocked_action_title: "チェーン先頭ルールを整理する",
        blocker_severity: "medium",
        reason_messages: ["medium blocker"],
      },
      {
        project_id: PROJECT_A,
        project_title: "Field Validation Project",
        health_status: "blocked",
        blocker_title: "入口 blocker",
        blocked_action_title: "入口条件を1つ決める",
        blocker_severity: "high",
        reason_messages: ["high blocker"],
      },
    ],
    growing_projects: [
      {
        project_id: PROJECT_A,
        project_title: "Field Validation Project",
        momentum_score: 0.5,
        signal_messages: ["primary 確定"],
      },
      {
        project_id: PROJECT_B,
        project_title: "Creative Production Project",
        momentum_score: 0.45,
        signal_messages: ["confidence 0.7+"],
      },
    ],
    explicit_deferrals: [
      {
        project_id: PROJECT_D,
        project_title: "Meta Infra Project",
        action_id: ACTION_D1,
        action_title: "次フェーズ範囲を定義する",
        defer_reason_messages: ["実行系 project を先に"],
      },
      {
        project_id: PROJECT_C,
        project_title: "Problem Solving Project",
        action_id: ACTION_C1,
        action_title: "観測メモを追加する",
        defer_reason_messages: ["観測不足のまま deep work 非推奨"],
      },
    ],
    risk_warnings: [
      {
        kind: "observation_gap",
        severity: "high",
        message: "Problem Solving Project: 観測不足",
        entity_type: "project",
        entity_id: PROJECT_C,
        mitigation_messages: ["短い observation 追加を検討"],
      },
      {
        kind: "resource_overload",
        severity: "medium",
        message: "4 project 同日 deep — 並行上限 2",
        mitigation_messages: ["注意力分散に注意"],
      },
      {
        kind: "decision_pending",
        severity: "low",
        message: "Meta Infra Project: 接続方針未確定",
        entity_type: "decision",
        mitigation_messages: ["今日決める必要は低"],
      },
    ],
    decision_brief: {
      active_decisions: [
        {
          project_id: PROJECT_D,
          project_title: "Meta Infra Project",
          decision_id: "dec-0001",
          decision_title: "自動適用禁止を維持する",
          rationale: "人間の決定権を守るため",
          pending_question: "今日の判断: なし（遵守のみ）",
          status: "active",
        },
        {
          project_id: PROJECT_D,
          project_title: "Meta Infra Project",
          decision_id: "dec-0002",
          decision_title: "本体接続方針は未確定",
          rationale: "CLI Core 安定後に決める",
          pending_question: "v0.5 で範囲を定義するか",
          status: "active",
        },
        {
          project_id: PROJECT_D,
          project_title: "Meta Infra Project",
          decision_id: "dec-old",
          decision_title: "旧 decision",
          rationale: "superseded",
          pending_question: "n/a",
          status: "superseded",
        },
      ],
    },
    portfolio_alignment: {
      primary_project_id: PROJECT_A,
      primary_action_id: ACTION_A1,
      alignment: "complemented",
      note: "Portfolio 1 位と同一。Brief は時間分割のみ補完。",
    },
    confidence: 0.73,
    requires_human_decision: true,
  };
}

describe("Studio Brief Renderer v0.5.2", () => {
  const report = buildFixtureReport();

  it("Morning render", () => {
    const brief = ruleBriefRenderer.render({ report, brief_type: "morning" });
    assert.equal(brief.brief_type, "morning");
    assert.match(brief.headline, /今日の焦点/);
    assert.ok(brief.blocked_items.length >= 1);
    assert.ok(brief.growth_items.length >= 1);
    assert.ok(brief.recommended_flow.length >= 3);
  });

  it("Session render", () => {
    const brief = ruleBriefRenderer.render({ report, brief_type: "session" });
    assert.equal(brief.brief_type, "session");
    assert.match(brief.headline, /次の 2 時間/);
    assert.ok(brief.recommended_flow.length <= 2);
    assert.equal(brief.growth_items.length, 0);
  });

  it("DeepWork render", () => {
    const brief = ruleBriefRenderer.render({ report, brief_type: "deep-work" });
    assert.equal(brief.brief_type, "deep-work");
    assert.match(brief.headline, /今集中/);
    assert.equal(brief.secondary_focuses.length, 0);
    assert.equal(brief.recommended_flow.length, 1);
  });

  it("primary_focus が portfolio_primary と一致", () => {
    const brief = renderStudioBrief({ report, brief_type: "morning" });
    assert.equal(brief.primary_focus.project_id, report.portfolio_primary.project_id);
    assert.equal(brief.primary_focus.action_id, report.portfolio_primary.next_action_id);
    assert.equal(brief.primary_focus.source, "portfolio_primary");
  });

  it("secondary 件数制限", () => {
    const morning = renderStudioBrief({ report, brief_type: "morning" });
    const session = renderStudioBrief({ report, brief_type: "session" });
    const deep = renderStudioBrief({ report, brief_type: "deep-work" });

    assert.ok(morning.secondary_focuses.length <= 3);
    assert.ok(session.secondary_focuses.length <= 1);
    assert.equal(deep.secondary_focuses.length, 0);
  });

  it("flow 件数制限", () => {
    const morning = renderStudioBrief({ report, brief_type: "morning" });
    const session = renderStudioBrief({ report, brief_type: "session" });
    const deep = renderStudioBrief({ report, brief_type: "deep-work" });

    assert.equal(morning.recommended_flow.length, report.flow_proposal.steps.length);
    assert.ok(session.recommended_flow.length <= 2);
    assert.equal(deep.recommended_flow.length, 1);
  });

  it("blocked severity 降順", () => {
    const brief = renderStudioBrief({ report, brief_type: "morning" });
    const severities = brief.blocked_items.map((entry) => entry.severity);
    const rank = (value: typeof severities[number]) =>
      value === "critical"
        ? 4
        : value === "high"
          ? 3
          : value === "medium"
            ? 2
            : value === "low"
              ? 1
              : 0;

    for (let index = 1; index < severities.length; index += 1) {
      assert.ok(rank(severities[index - 1]) >= rank(severities[index]));
    }
  });

  it("reasons 空禁止", () => {
    const brief = renderStudioBrief({ report, brief_type: "morning" });
    assert.ok(brief.primary_focus.reason_summary.trim().length > 0);
    for (const item of brief.secondary_focuses) {
      assert.ok(item.reason_summary.trim().length > 0);
    }
    for (const item of brief.blocked_items) {
      assert.ok(item.reason_summary.trim().length > 0);
    }
    for (const item of brief.recommended_flow) {
      assert.ok(item.reason_summary.trim().length > 0);
    }
  });

  it("deferred reason 必須", () => {
    const brief = renderStudioBrief({ report, brief_type: "morning" });
    assert.ok(brief.deferred_items.length >= 1);
    for (const item of brief.deferred_items) {
      assert.ok(item.defer_reason.trim().length > 0);
    }
  });

  it("why_not_summary 必須", () => {
    const brief = renderStudioBrief({ report, brief_type: "morning" });
    assert.ok(brief.why_not_summary.length >= 1);
    for (const item of brief.why_not_summary) {
      assert.ok(item.summary.trim().length > 0);
    }
  });

  it("StudioReport 不変", () => {
    const snapshot = JSON.stringify(report);
    renderStudioBrief({ report, brief_type: "session" });
    assert.equal(JSON.stringify(report), snapshot);
  });

  it("primary 不整合で BriefRendererError", () => {
    const broken = structuredClone(report);
    broken.today_focus.primary.action_id = ACTION_B1;
    assert.throws(
      () => renderStudioBrief({ report: broken, brief_type: "morning" }),
      BriefRendererError
    );
  });

  it("requires_human_decision true", () => {
    const brief = renderStudioBrief({ report, brief_type: "morning" });
    assert.equal(brief.requires_human_decision, true);
  });

  it("summary_text 生成", () => {
    const brief = renderStudioBrief({ report, brief_type: "morning" });
    assert.match(brief.summary_text, /GROUND Studio Brief/);
    assert.match(brief.summary_text, /requires_human_decision: true/);
    assert.match(brief.summary_text, /入口条件を1つ決める/);
  });

  it("Renderer source に project 固有名詞 hardcode がない", () => {
    const files = [
      "ground-core/studio/brief-renderer.ts",
      "ground-core/studio/brief-formatters.ts",
      "ground-core/studio/brief-types.ts",
    ];

    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      assert.equal(source.includes("桃太郎"), false, file);
      assert.equal(source.includes("Momotaro"), false, file);
      assert.equal(source.includes("FreeWater"), false, file);
      assert.equal(source.includes("SISTER"), false, file);
      assert.equal(source.includes("新宿"), false, file);
    }
  });

  it("Renderer は saveProject / applyPatch を import しない", () => {
    const files = [
      "ground-core/studio/brief-renderer.ts",
      "ground-core/studio/brief-formatters.ts",
    ];

    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      assert.equal(source.includes("saveProject"), false, file);
      assert.equal(source.includes("applyPatch"), false, file);
      assert.equal(source.includes("openai"), false, file);
      assert.equal(source.includes("anthropic"), false, file);
    }
  });
});
