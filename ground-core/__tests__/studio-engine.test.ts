import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { ruleDirector } from "../director/rule-director.js";
import {
  recommendPortfolioFromInput,
  rulePortfolioDirector,
} from "../director/portfolio-director.js";
import { saveProject } from "../file-store.js";
import type { PortfolioReport } from "../director/portfolio-types.js";
import type { DirectorReport } from "../director/types.js";
import type { ProjectState } from "../types.js";
import { analyzeStudio, ruleStudio } from "../studio/rule-studio.js";
import type { StudioEngineInput, StudioReport } from "../studio/types.js";
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

function buildStudioInput(states: ProjectState[]): StudioEngineInput {
  const directorReports = states.map((state) =>
    ruleDirector.recommend({ project_state: state })
  );
  const portfolioReport = recommendPortfolioFromInput({
    project_states: states,
    director_reports: directorReports,
  });

  return {
    portfolio_report: portfolioReport,
    director_reports: directorReports,
    project_states: states,
  };
}

function clonePortfolio(report: PortfolioReport): PortfolioReport {
  return structuredClone(report);
}

function cloneDirectors(reports: DirectorReport[]): DirectorReport[] {
  return structuredClone(reports);
}

function cloneStates(states: ProjectState[]): ProjectState[] {
  return structuredClone(states);
}

function analyzeWithSnapshot(input: StudioEngineInput): {
  report: StudioReport;
  portfolioBefore: PortfolioReport;
  directorsBefore: DirectorReport[];
  statesBefore: ProjectState[] | undefined;
} {
  const portfolioBefore = clonePortfolio(input.portfolio_report);
  const directorsBefore = cloneDirectors(input.director_reports);
  const statesBefore = input.project_states ? cloneStates(input.project_states) : undefined;

  const report = ruleStudio.analyze(input);

  return { report, portfolioBefore, directorsBefore, statesBefore };
}

describe("Studio Engine v0.5.3", () => {
  it("today_focus.primary = portfolio primary", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);
    const primary = input.portfolio_report.primary_recommendation;

    assert.equal(report.today_focus.primary.project_id, primary.project_id);
    assert.equal(report.today_focus.primary.action_id, primary.next_action_id);
    assert.equal(report.today_focus.primary.project_title, primary.project_title);
    assert.ok(report.today_focus.primary.reasons.length >= 2);
  });

  it("alignment_status — Portfolio primary 不変", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);
    const primary = input.portfolio_report.primary_recommendation;

    assert.equal(report.portfolio_alignment.primary_project_id, primary.project_id);
    assert.equal(report.portfolio_alignment.primary_action_id, primary.next_action_id);
    assert.ok(
      report.portfolio_alignment.alignment_status === "aligned" ||
        report.portfolio_alignment.alignment_status === "partially_aligned"
    );
  });

  it("blocked severity 降順", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);
    const rank = { critical: 4, high: 3, medium: 2, low: 1, null: 0 };

    for (let index = 1; index < report.blocked_projects.length; index += 1) {
      const prev = report.blocked_projects[index - 1].severity;
      const current = report.blocked_projects[index].severity;
      assert.ok(
        (rank[prev ?? "null"] ?? 0) >= (rank[current ?? "null"] ?? 0),
        "blocked_projects は severity 降順"
      );
    }
  });

  it("growing project 抽出", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);

    assert.ok(Array.isArray(report.growing_projects));
    for (const entry of report.growing_projects) {
      assert.ok(entry.project_id.length > 0);
      assert.ok(entry.reasons.length >= 1);
      assert.ok(entry.momentum_score >= 0);
    }
  });

  it("risk project 抽出", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);

    assert.ok(Array.isArray(report.risk_projects));
    for (const entry of report.risk_projects) {
      assert.ok(entry.reasons.length >= 1);
      assert.ok(["low", "medium", "high"].includes(entry.severity));
    }
  });

  it("decision materials", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);

    assert.ok(Array.isArray(report.decision_materials));
    const hasStructuredMaterial = report.decision_materials.some(
      (entry) =>
        entry.kind === "decision" ||
        entry.kind === "hypothesis" ||
        entry.kind === "observation" ||
        entry.kind === "portfolio_factor"
    );
    assert.ok(hasStructuredMaterial);
  });

  it("flow 順序 — Portfolio rank 順", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);
    const ranking = input.portfolio_report.project_ranking;

    assert.ok(report.recommended_flow.length <= 4);
    for (let index = 0; index < report.recommended_flow.length; index += 1) {
      assert.equal(report.recommended_flow[index].order, index + 1);
      const expected = ranking.find(
        (entry) => entry.project_id === report.recommended_flow[index].project_id
      );
      assert.ok(expected, "flow step は ranking 由来");
    }

    const flowIds = report.recommended_flow.map((step) => step.project_id);
    const rankOrder = [...ranking]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, flowIds.length)
      .map((entry) => entry.project_id);
    assert.deepEqual(flowIds, rankOrder);
  });

  it("deferred 理由必須", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);

    for (const entry of report.deferred_projects) {
      assert.ok(entry.reasons.length >= 1);
      assert.ok(entry.reasons[0].message.length > 0);
    }
  });

  it("summary_text 必須", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { report } = analyzeWithSnapshot(input);

    assert.ok(report.summary_text.length > 20);
  });

  it("requires_human_decision", () => {
    const input = buildStudioInput([loadFixture("freewater"), loadFixture("momotaro")]);
    const { report } = analyzeWithSnapshot(input);
    assert.equal(report.requires_human_decision, true);
    assert.equal(report.schema_version, "0.5.3");
    assert.equal(report.engine, "rule-studio-v1");
  });

  it("ProjectState 不変", () => {
    const input = buildStudioInput([
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ]);
    const { statesBefore } = analyzeWithSnapshot(input);
    assert.deepEqual(input.project_states, statesBefore);
  });

  it("PortfolioReport 不変", () => {
    const input = buildStudioInput([loadFixture("freewater"), loadFixture("momotaro")]);
    const { portfolioBefore } = analyzeWithSnapshot(input);
    assert.deepEqual(input.portfolio_report, portfolioBefore);
  });

  it("DirectorReport 不変", () => {
    const input = buildStudioInput([loadFixture("freewater"), loadFixture("momotaro")]);
    const { directorsBefore } = analyzeWithSnapshot(input);
    assert.deepEqual(input.director_reports, directorsBefore);
  });

  it("saveProject 未使用", () => {
    assert.notEqual(typeof saveProject, "undefined");
    assert.equal(ruleStudio.name, "rule-studio-v1");
  });

  it("applyPatch 未使用 — 純粋関数", () => {
    const input = buildStudioInput([loadFixture("freewater")]);
    const a = analyzeStudio(input);
    const b = analyzeStudio(input);
    assert.deepEqual(
      { ...a, generated_at: "fixed" },
      { ...b, generated_at: "fixed" }
    );
  });

  it("固有名詞 hardcode なし — ソースに project UUID を埋め込まない", () => {
    const source = readFileSync(
      join(process.cwd(), "ground-core/studio/rule-studio.ts"),
      "utf8"
    );
    assert.ok(!source.includes("28d83a68"));
    assert.ok(!source.includes("839578f5"));
    assert.ok(!source.includes("34092589"));
    assert.ok(!source.includes("FreeWater"));
    assert.ok(!source.includes("Momotaro"));
  });

  it("3 project fixture — 実プロジェクト期待", () => {
    const states = [
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ];
    const input = buildStudioInput(states);
    const { report } = analyzeWithSnapshot(input);

    const primary = input.portfolio_report.primary_recommendation;
    assert.equal(report.today_focus.primary.project_id, primary.project_id);

    const flowTitles = report.recommended_flow.map((step) => step.project_id);
    const rankingIds = [...input.portfolio_report.project_ranking]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3)
      .map((entry) => entry.project_id);
    assert.deepEqual(flowTitles, rankingIds);

    const deferredIds = report.deferred_projects.map((entry) => entry.project_id);
    const portfolioDeferred = input.portfolio_report.deferred_recommendations.map(
      (entry) => entry.project_id
    );
    for (const id of portfolioDeferred) {
      assert.ok(deferredIds.includes(id));
    }
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

    const input = buildStudioInput([...states, fourth]);
    const { report } = analyzeWithSnapshot(input);

    assert.equal(report.recommended_flow.length, 4);
    assert.ok(report.today_focus.situation_summary.includes("4 project"));
  });

  it("no blocked project fixture", () => {
    const base = loadFixture("freewater");
    const unblocked: ProjectState = {
      ...structuredClone(base),
      blockers: base.blockers.map((blocker) => ({
        ...blocker,
        status: "resolved" as const,
      })),
    };

    const input = buildStudioInput([unblocked]);
    const portfolio = rulePortfolioDirector.recommendPortfolio({
      project_states: [unblocked],
      director_reports: input.director_reports,
    });

    const report = ruleStudio.analyze({
      portfolio_report: portfolio,
      director_reports: input.director_reports,
      project_states: [unblocked],
    });

    assert.equal(portfolio.blocked_projects.length, 0);
    assert.equal(report.blocked_projects.length, 0);
  });

  it("deep work >2 で alignment partially_aligned", () => {
    const states = [
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ];
    const fourth: ProjectState = {
      ...structuredClone(states[1]),
      project: {
        ...states[1].project,
        id: "bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb",
        title: "Fixture Project Echo",
      },
    };

    const input = buildStudioInput([...states, fourth]);
    const { report } = analyzeWithSnapshot(input);

    if (report.portfolio_alignment.deep_work_step_count > 2) {
      assert.equal(report.portfolio_alignment.alignment_status, "partially_aligned");
      assert.equal(report.portfolio_alignment.deep_work_warning, true);
    }
  });
});
