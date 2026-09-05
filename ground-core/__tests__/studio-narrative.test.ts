import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { ruleDirector } from "../director/rule-director.js";
import { recommendPortfolioFromInput } from "../director/portfolio-director.js";
import { saveProject } from "../file-store.js";
import { buildStudioNarrative, ruleNarrative } from "../studio/narrative-builder.js";
import { ruleStudio } from "../studio/rule-studio.js";
import type { StudioNarrative } from "../studio/narrative-types.js";
import type { StudioEngineInput, StudioReport } from "../studio/types.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

function loadFixture(project: "freewater" | "momotaro" | "ground"): ProjectState {
  if (project === "freewater") {
    return buildFreeWaterPhase0Fixture();
  }

  const projectIds = {
    momotaro: "839578f5-36e1-4b6f-9be5-a97520f52b66",
    ground: "34092589-569a-4eec-923d-a105b6b1402c",
  } as const;

  const path = join(
    process.cwd(),
    "ground-core/storage/projects",
    `${projectIds[project]}.json`
  );

  if (!existsSync(path)) {
    throw new Error(`Missing fixture project file: ${path}`);
  }

  return JSON.parse(readFileSync(path, "utf8")) as ProjectState;
}

function buildStudioReport(states: ProjectState[]): StudioReport {
  const directorReports = states.map((state) =>
    ruleDirector.recommend({ project_state: state })
  );
  const portfolioReport = recommendPortfolioFromInput({
    project_states: states,
    director_reports: directorReports,
  });

  return ruleStudio.analyze({
    portfolio_report: portfolioReport,
    director_reports: directorReports,
    project_states: states,
  });
}

function buildNarrativeFromStates(states: ProjectState[]): {
  report: StudioReport;
  narrative: StudioNarrative;
} {
  const report = buildStudioReport(states);
  const reportBefore = structuredClone(report);
  const narrative = ruleNarrative.build({ report });
  assert.deepEqual(report, reportBefore, "StudioReport must remain unchanged");
  return { report, narrative };
}

function minimalReport(overrides: Partial<StudioReport> = {}): StudioReport {
  const base: StudioReport = {
    schema_version: "0.5.3",
    engine: "rule-studio-v1",
    generated_at: "2026-06-07T00:00:00.000Z",
    today_focus: {
      situation_summary: "2 project を横断監視中。",
      primary: {
        project_id: "11111111-1111-4111-8111-111111111111",
        project_title: "Alpha Project",
        action_id: "22222222-2222-4222-8222-222222222222",
        action_title: "Alpha primary action",
        confidence: 0.8,
        reasons: [
          { kind: "portfolio_primary", message: "Portfolio rank 1", weight: 1 },
          { kind: "cross_project_rank", message: "cross_project_score 0.90", weight: 1 },
        ],
      },
      alternatives: [],
    },
    blocked_projects: [],
    growing_projects: [],
    risk_projects: [],
    decision_materials: [],
    recommended_flow: [
      {
        order: 1,
        time_box: "morning",
        project_id: "11111111-1111-4111-8111-111111111111",
        project_title: "Alpha Project",
        action_id: "22222222-2222-4222-8222-222222222222",
        action_title: "Alpha primary action",
        intent: "deep_work",
        reasons: [{ kind: "flow_sequencing", message: "rank 1", weight: 1 }],
      },
      {
        order: 2,
        time_box: "afternoon",
        project_id: "33333333-3333-4333-8333-333333333333",
        project_title: "Beta Project",
        action_id: "44444444-4444-4444-8444-444444444444",
        action_title: "Beta action",
        intent: "light_touch",
        reasons: [{ kind: "flow_sequencing", message: "rank 2", weight: 1 }],
      },
    ],
    deferred_projects: [],
    portfolio_alignment: {
      primary_project_id: "11111111-1111-4111-8111-111111111111",
      primary_action_id: "22222222-2222-4222-8222-222222222222",
      alignment_status: "aligned",
      note: "Studio は Portfolio primary を変更していない",
      deep_work_step_count: 1,
      deep_work_warning: false,
    },
    summary_text: "Alpha を primary に据えた横断状況。",
    requires_human_decision: true,
  };

  return { ...base, ...overrides };
}

function assertNonEmptyStory(narrative: StudioNarrative): void {
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
    if (typeof value === "string") {
      assert.ok(value.trim().length > 0, `${field} must not be empty`);
      assert.ok(!value.includes("なんとなく"), `${field} must not contain vague phrasing`);
    }
  }
}

function assertFlowOrderPreserved(report: StudioReport, narrative: StudioNarrative): void {
  const titles = report.recommended_flow.map((step) => step.project_title);
  let lastIndex = -1;

  for (const title of titles) {
    const index = narrative.flow_story.indexOf(title);
    assert.ok(index >= 0, `flow_story must mention ${title}`);
    assert.ok(index > lastIndex, "flow_story must preserve Portfolio rank order");
    lastIndex = index;
  }
}

describe("Studio Narrative Layer v0.5.4", () => {
  it("headline 生成", () => {
    const { narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    assert.ok(narrative.headline.length > 10);
    assert.equal(narrative.schema_version, "0.5.4");
    assert.equal(narrative.engine, "rule-narrative-v1");
  });

  it("today_focus_story", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
    ]);
    assert.ok(narrative.today_focus_story.includes(report.today_focus.primary.project_title));
    assert.ok(narrative.today_focus_story.includes(report.today_focus.primary.action_title));
    assert.ok(
      report.today_focus.primary.reasons.filter((reason) =>
        narrative.today_focus_story.includes(reason.message)
      ).length >= 1 ||
        narrative.today_focus_story.includes("Portfolio primary")
    );
  });

  it("flow_story", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    assertFlowOrderPreserved(report, narrative);
  });

  it("blocker_story", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    if (report.blocked_projects.length > 0) {
      assert.ok(narrative.blocker_story.includes("停止要因"));
    } else {
      assert.ok(narrative.blocker_story.includes("open blocker"));
    }
  });

  it("growth_story", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    if (report.growing_projects.length > 0) {
      assert.ok(narrative.growth_story.includes("伸びている"));
    } else {
      assert.ok(narrative.growth_story.includes("記録されていません"));
    }
  });

  it("risk_story", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    if (report.risk_projects.length > 0) {
      assert.ok(narrative.risk_story.includes("注意"));
    } else {
      assert.ok(narrative.risk_story.includes("ありません"));
    }
  });

  it("decision_story", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    if (report.decision_materials.length > 0) {
      assert.ok(narrative.decision_story.includes("判断材料"));
    } else {
      assert.ok(narrative.decision_story.includes("含まれていません"));
    }
  });

  it("deferred_story", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    for (const entry of report.deferred_projects) {
      assert.ok(narrative.deferred_story.includes(entry.project_title));
      assert.ok(
        entry.reasons.some((reason) => narrative.deferred_story.includes(reason.message)) ||
          narrative.deferred_story.includes("Portfolio deferred")
      );
    }
  });

  it("summary_story", () => {
    const { narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const sentenceCount = narrative.summary_story
      .split(/[。！？]/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0).length;
    assert.ok(sentenceCount >= 3);
    assert.ok(sentenceCount <= 8);
  });

  it("Portfolio 順位不変 — flow_story が recommended_flow 順を保持", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    assertFlowOrderPreserved(report, narrative);
    assert.ok(narrative.today_focus_story.includes("Portfolio の順位を変更していません"));
  });

  it("StudioReport 不変", () => {
    const report = buildStudioReport([
      loadFixture("freewater"),
      loadFixture("momotaro"),
    ]);
    const before = structuredClone(report);
    ruleNarrative.build({ report });
    assert.deepEqual(report, before);
  });

  it("saveProject 未使用", () => {
    const sources = [
      "narrative-builder.ts",
      "narrative-rules.ts",
      "narrative-formatters.ts",
      "narrative-types.ts",
    ];
    for (const file of sources) {
      const source = readFileSync(join(process.cwd(), "ground-core/studio", file), "utf8");
      assert.ok(!source.includes("saveProject"));
    }
    assert.notEqual(typeof saveProject, "undefined");
  });

  it("applyPatch 未使用", () => {
    const sources = [
      "narrative-builder.ts",
      "narrative-rules.ts",
      "narrative-formatters.ts",
    ];
    for (const file of sources) {
      const source = readFileSync(join(process.cwd(), "ground-core/studio", file), "utf8");
      assert.ok(!source.includes("applyPatch"));
      assert.ok(!source.includes("StatePatch"));
    }
  });

  it("固有名詞 hardcode なし — Narrative ソースに fixture UUID を埋め込まない", () => {
    const sources = [
      "narrative-builder.ts",
      "narrative-rules.ts",
      "narrative-formatters.ts",
      "narrative-types.ts",
    ];
    for (const file of sources) {
      const source = readFileSync(join(process.cwd(), "ground-core/studio", file), "utf8");
      assert.ok(!source.includes("28d83a68"));
      assert.ok(!source.includes("839578f5"));
      assert.ok(!source.includes("34092589"));
      assert.ok(!source.includes("FreeWater"));
      assert.ok(!source.includes("Momotaro"));
    }
  });

  it("3 project fixture", () => {
    const { report, narrative } = buildNarrativeFromStates([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    assertNonEmptyStory(narrative);
    assert.equal(report.recommended_flow.length, 3);
    assertFlowOrderPreserved(report, narrative);
    assert.equal(narrative.requires_human_decision, true);
  });

  it("4 project fixture", () => {
    const states = [
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ];
    const fourth: ProjectState = {
      ...structuredClone(states[0]),
      project: {
        ...states[0].project,
        id: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa",
        title: "Fixture Project Delta",
      },
    };

    const { report, narrative } = buildNarrativeFromStates([...states, fourth]);
    assert.equal(report.recommended_flow.length, 4);
    assertNonEmptyStory(narrative);
    assertFlowOrderPreserved(report, narrative);
  });

  it("blocked なし", () => {
    const report = minimalReport({ blocked_projects: [] });
    const narrative = buildStudioNarrative({ report });
    assert.ok(narrative.blocker_story.includes("open blocker"));
    assertNonEmptyStory(narrative);
  });

  it("risk なし", () => {
    const report = minimalReport({ risk_projects: [] });
    const narrative = buildStudioNarrative({ report });
    assert.ok(narrative.risk_story.includes("ありません"));
    assertNonEmptyStory(narrative);
  });

  it("deferred なし", () => {
    const report = minimalReport({ deferred_projects: [] });
    const narrative = buildStudioNarrative({ report });
    assert.ok(narrative.deferred_story.includes("後回し project はありません"));
    assertNonEmptyStory(narrative);
  });

  it("純粋関数 — 同一入力で同一出力（generated_at 除く）", () => {
    const report = buildStudioReport([loadFixture("freewater"), loadFixture("momotaro")]);
    const a = buildStudioNarrative({ report });
    const b = buildStudioNarrative({ report });
    assert.deepEqual(
      { ...a, generated_at: "fixed" },
      { ...b, generated_at: "fixed" }
    );
  });
});
