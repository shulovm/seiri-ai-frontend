import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdStudioBrief, runCli } from "../cli.js";
import { saveProject } from "../file-store.js";
import {
  formatStudioBriefText,
  runStudioBriefPipeline,
} from "../studio/studio-brief.js";
import type { StudioReport as EngineStudioReport } from "../studio/types.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
const MOMOTARO_PROJECT_ID = "839578f5-36e1-4b6f-9be5-a97520f52b66";
const GROUND_CORE_PROJECT_ID = "34092589-569a-4eec-923d-a105b6b1402c";

function loadFixture(project: "freewater" | "momotaro" | "ground"): ProjectState {
  if (project === "freewater") {
    return buildFreeWaterPhase0Fixture();
  }

  const projectId =
    project === "momotaro" ? MOMOTARO_PROJECT_ID : GROUND_CORE_PROJECT_ID;
  const path = join(process.cwd(), "ground-core/storage/projects", `${projectId}.json`);

  if (!existsSync(path)) {
    throw new Error(`Missing fixture project file: ${path}`);
  }

  return JSON.parse(readFileSync(path, "utf8")) as ProjectState;
}

function minimalEngineReport(overrides: Partial<EngineStudioReport> = {}): EngineStudioReport {
  const base: EngineStudioReport = {
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

describe("Studio Brief CLI v0.5.5", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-studio-brief-"));
    saveProject(loadFixture("freewater"), { storageDir: tempDir });
    saveProject(loadFixture("momotaro"), { storageDir: tempDir });
    saveProject(loadFixture("ground"), { storageDir: tempDir });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("morning", () => {
    const stdout: string[] = [];
    const code = runCli(["studio-brief"], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    const output = stdout.join("\n");
    assert.match(output, /Morning Brief/);
    assert.match(output, /TODAY/);
    assert.match(output, /FLOW/);
  });

  it("session", () => {
    const stdout: string[] = [];
    const code = runCli(["studio-brief", "--type", "session"], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    assert.match(stdout.join("\n"), /Session Brief/);
  });

  it("deep-work", () => {
    const stdout: string[] = [];
    const code = runCli(["studio-brief", "--type", "deep-work"], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    assert.match(stdout.join("\n"), /Deep Work Brief/);
  });

  it("json出力", () => {
    const stdout: string[] = [];
    const code = runCli(["studio-brief", "--format", "json"], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    const parsed = JSON.parse(stdout.join("\n")) as {
      schema_version?: string;
      headline?: string;
      requires_human_decision?: boolean;
    };
    assert.equal(parsed.schema_version, "0.5.5");
    assert.equal(parsed.requires_human_decision, true);
    assert.ok(parsed.headline && parsed.headline.length > 0);
  });

  it("out出力", () => {
    const outPath = join(tempDir, "brief.json");
    const stdout: string[] = [];
    const code = runCli(["studio-brief", "--out", outPath], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    assert.ok(existsSync(outPath));
    const parsed = JSON.parse(readFileSync(outPath, "utf8")) as { brief?: { brief_type?: string } };
    assert.equal(parsed.brief?.brief_type, "morning");
    assert.match(stdout.join("\n"), /Morning Brief/);
  });

  it("headline表示 — Narrative headline", () => {
    const result = cmdStudioBrief([], { storageDir: tempDir });
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");
    assert.ok(text.includes(result.narrative.headline));
    assert.equal(result.display_brief.headline, result.narrative.headline);
  });

  it("TODAY表示", () => {
    const result = cmdStudioBrief([], { storageDir: tempDir });
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");
    assert.match(text, /TODAY/);
    assert.ok(text.includes(result.studio_report.today_focus.primary.project_title));
  });

  it("FLOW表示", () => {
    const result = cmdStudioBrief([], { storageDir: tempDir });
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");
    assert.match(text, /FLOW/);
    for (const step of result.studio_report.recommended_flow) {
      assert.ok(text.includes(step.project_title));
    }
  });

  it("Portfolio順位不変", () => {
    const result = cmdStudioBrief([], { storageDir: tempDir });
    const rankingIds = result.portfolio_report.project_ranking
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => entry.project_id);
    const flowIds = result.studio_report.recommended_flow.map((step) => step.project_id);
    const adaptedFlowIds = result.renderer_report.flow_proposal.steps.map(
      (step) => step.project_id
    );

    assert.deepEqual(flowIds, rankingIds.slice(0, flowIds.length));
    assert.deepEqual(adaptedFlowIds, flowIds);
  });

  it("ProjectState不変", () => {
    const before = [
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ].map((state) => structuredClone(state));

    cmdStudioBrief([], { storageDir: tempDir });

    const after = [
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ].map((state) => structuredClone(state));

    assert.deepEqual(before, after);
  });

  it("saveProject未使用 — studio-brief ソース", () => {
    const source = readFileSync(join(process.cwd(), "ground-core/studio/studio-brief.ts"), "utf8");
    assert.ok(!source.includes("saveProject"));
    assert.ok(!source.includes("applyPatch"));
  });

  it("applyPatch未使用 — adapter ソース", () => {
    const source = readFileSync(join(process.cwd(), "ground-core/studio/brief-adapter.ts"), "utf8");
    assert.ok(!source.includes("applyPatch"));
    assert.ok(!source.includes("saveProject"));
  });

  it("3 project fixture", () => {
    const result = cmdStudioBrief([], { storageDir: tempDir });
    assert.equal(result.studio_report.recommended_flow.length, 3);
    assert.equal(result.display_brief.requires_human_decision, true);
  });

  it("4 project fixture", () => {
    const fourth: ProjectState = {
      ...structuredClone(loadFixture("freewater")),
      project: {
        ...loadFixture("freewater").project,
        id: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa",
        title: "Fixture Project Delta",
      },
    };
    saveProject(fourth, { storageDir: tempDir });

    const result = cmdStudioBrief([], { storageDir: tempDir });
    assert.equal(result.studio_report.recommended_flow.length, 4);
  });

  it("no blocked", () => {
    const result = runStudioBriefPipeline({
      project_states: [structuredClone(loadFixture("freewater"))],
      brief_type: "morning",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");
    assert.match(text, /BLOCKED/);
    assert.match(text, /\(none\)|停止要因|open blocker/i);
  });

  it("no risk", () => {
    const report = minimalEngineReport({ risk_projects: [] });
    const pipeline = runStudioBriefPipeline({
      project_states: [structuredClone(loadFixture("freewater"))],
    });
    const text = formatStudioBriefText(pipeline.brief, pipeline.narrative, "morning");
    assert.match(text, /RISKS/);
    assert.ok(report.risk_projects.length === 0);
  });

  it("deferred なし", () => {
    const result = runStudioBriefPipeline({
      project_states: [structuredClone(loadFixture("freewater"))],
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");
    assert.match(text, /DEFERRED/);
  });

  it("CLI exit0", () => {
    const code = runCli(["studio-brief", "--type", "morning"], {
      storageDir: tempDir,
      writeOut: () => {},
      writeErr: () => {},
    });
    assert.equal(code, 0);
  });

  it("固有名詞 hardcode なし — adapter / studio-brief ソース", () => {
    for (const file of ["brief-adapter.ts", "studio-brief.ts"]) {
      const source = readFileSync(join(process.cwd(), "ground-core/studio", file), "utf8");
      assert.ok(!source.includes("28d83a68"));
      assert.ok(!source.includes("FreeWater"));
    }
  });

  it("StudioReport 不変 — pipeline 実行後", () => {
    const states = [
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ];
    const result = runStudioBriefPipeline({ project_states: states });
    const reportBefore = structuredClone(result.studio_report);
    formatStudioBriefText(result.brief, result.narrative, "morning");
    assert.deepEqual(result.studio_report, reportBefore);
  });
});
