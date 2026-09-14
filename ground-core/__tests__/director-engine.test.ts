import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdRecommend, runCli } from "../cli.js";
import {
  hasEligiblePrimaryRecommendation,
  ruleDirector,
} from "../director/rule-director.js";
import { saveProject } from "../file-store.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
const MOMOTARO_PROJECT_ID = "839578f5-36e1-4b6f-9be5-a97520f52b66";
const MOMOTARO_CHAR_ACTION_ID = "c3333333-3333-4333-8333-333333333301";
const MOMOTARO_AGE_ACTION_ID = "c3333333-3333-4333-8333-333333333302";
const FREEWATER_LOCATION_ACTION_ID = "f3333333-3333-4333-8333-333333333301";

function loadFixture(project: "freewater" | "momotaro"): ProjectState {
  if (project === "freewater") {
    return buildFreeWaterPhase0Fixture();
  }

  const path = join(process.cwd(), "ground-core/storage/projects", `${MOMOTARO_PROJECT_ID}.json`);

  if (!existsSync(path)) {
    throw new Error(`Missing fixture project file: ${path}`);
  }

  return JSON.parse(readFileSync(path, "utf8")) as ProjectState;
}

describe("Director Engine v0.3", () => {
  it("Momotaro でキャラ固定 action を primary 推薦する", () => {
    const state = loadFixture("momotaro");
    const report = ruleDirector.recommend({ project_state: state });

    assert.equal(
      report.recommendation.primary_recommendation.entity_id,
      MOMOTARO_CHAR_ACTION_ID
    );
    assert.match(report.recommendation.primary_recommendation.label, /キャラクター固定/);
    assert.equal(report.recommendation.primary_recommendation.matches_current_primary, true);
    assert.ok(report.recommendation.primary_recommendation.reasons.length >= 1);
  });

  it("FreeWater で配布場所 action を primary 推薦する", () => {
    const state = loadFixture("freewater");
    const report = ruleDirector.recommend({ project_state: state });

    assert.equal(
      report.recommendation.primary_recommendation.entity_id,
      FREEWATER_LOCATION_ACTION_ID
    );
    assert.match(report.recommendation.primary_recommendation.label, /配布場所/);
    assert.equal(report.recommendation.primary_recommendation.matches_current_primary, true);
  });

  it("done action は推薦対象から除外", () => {
    const state = structuredClone(loadFixture("momotaro"));
    const doneAction = state.next_actions.find((action) => action.id === MOMOTARO_CHAR_ACTION_ID);
    assert.ok(doneAction);
    doneAction.status = "done";

    const report = ruleDirector.recommend({ project_state: state });
    const allIds = [
      report.recommendation.primary_recommendation.entity_id,
      ...report.recommendation.alternative_recommendations.map((entry) => entry.entity_id),
    ];

    assert.equal(allIds.includes(MOMOTARO_CHAR_ACTION_ID), false);
  });

  it("depends_on 未完了 action は primary 推薦不可", () => {
    const state = loadFixture("momotaro");
    const report = ruleDirector.recommend({ project_state: state });

    assert.notEqual(
      report.recommendation.primary_recommendation.entity_id,
      MOMOTARO_AGE_ACTION_ID
    );
    assert.equal(report.recommendation.primary_recommendation.eligible_for_primary, true);

    const blocked = report.recommendation.alternative_recommendations.find(
      (entry) => entry.entity_id === MOMOTARO_AGE_ACTION_ID
    );
    if (blocked) {
      assert.equal(blocked.eligible_for_primary, false);
      assert.ok(
        blocked.reasons.some((reason) => reason.kind === "dependency_blocked")
      );
    }
  });

  it("reasons が空の recommendation は存在しない", () => {
    const report = ruleDirector.recommend({ project_state: loadFixture("freewater") });
    const all = [
      report.recommendation.primary_recommendation,
      ...report.recommendation.alternative_recommendations,
    ];

    for (const entry of all) {
      assert.ok(entry.reasons.length >= 1);
      for (const reason of entry.reasons) {
        assert.ok(reason.message.trim().length > 0);
      }
    }
  });

  it("confidence は 0〜1", () => {
    const report = ruleDirector.recommend({ project_state: loadFixture("momotaro") });
    assert.ok(report.recommendation.confidence >= 0);
    assert.ok(report.recommendation.confidence <= 1);
    assert.ok(report.confidence_factors.length >= 1);
  });

  it("open blocker のみ列挙", () => {
    const state = structuredClone(loadFixture("freewater"));
    state.blockers.push({
      id: "00000000-0000-4000-8000-000000000099",
      project_id: FREEWATER_PROJECT_ID,
      goal_id: state.current_state.primary_goal_id,
      title: "resolved blocker should not appear",
      description: "test",
      severity: "low",
      status: "resolved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const report = ruleDirector.recommend({ project_state: state });
    assert.equal(
      report.open_blockers.some((blocker) => blocker.title.includes("resolved blocker")),
      false
    );
    assert.ok(report.open_blockers.length >= 1);
  });

  it("ProjectState は recommend 実行後も変更されない", () => {
    const state = loadFixture("momotaro");
    const snapshot = JSON.stringify(state);

    ruleDirector.recommend({ project_state: state });

    assert.equal(JSON.stringify(state), snapshot);
  });

  it("Director source に project 固有語条件がない", () => {
    const files = [
      "ground-core/director/rule-director.ts",
      "ground-core/director/scoring.ts",
      "ground-core/director/explain.ts",
      "ground-core/director/types.ts",
    ];

    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      assert.equal(source.includes("桃太郎"), false, file);
      assert.equal(source.includes("Momotaro"), false, file);
      assert.equal(source.includes("FreeWater"), false, file);
      assert.equal(source.includes("新宿"), false, file);
      assert.equal(source.includes("キャラ固定"), false, file);
    }
  });

  it("eligible action が 0 の場合 no_eligible_actions report", () => {
    const state = structuredClone(loadFixture("momotaro"));
    for (const action of state.next_actions) {
      if (action.status === "pending" || action.status === "in_progress") {
        action.status = "done";
      }
    }

    const report = ruleDirector.recommend({ project_state: state });
    assert.equal(hasEligiblePrimaryRecommendation(report), false);
    assert.equal(
      report.recommendation.primary_recommendation.reasons[0]?.kind,
      "no_eligible_actions"
    );
  });
});

describe("cli recommend", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-director-"));
    saveProject(loadFixture("freewater"), { storageDir: tempDir });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("CLI recommend が人間可読要約を出す", () => {
    const stdout: string[] = [];
    const code = runCli(["recommend", FREEWATER_PROJECT_ID], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    const output = stdout.join("\n");
    assert.match(output, /GROUND Core Director Report/);
    assert.match(output, /Primary Recommendation:/);
    assert.match(output, /配布場所/);
  });

  it("CLI recommend --format json が DirectorReport を出す", () => {
    const stdout: string[] = [];
    const code = runCli(
      ["recommend", FREEWATER_PROJECT_ID, "--format", "json"],
      {
        storageDir: tempDir,
        writeOut: (message: string) => stdout.push(message),
        writeErr: () => {},
      }
    );

    assert.equal(code, 0);
    const parsed = JSON.parse(stdout.join("\n")) as {
      schema_version?: string;
      recommendation?: { primary_recommendation?: { label?: string } };
    };
    assert.equal(parsed.schema_version, "0.3.0");
    assert.match(parsed.recommendation?.primary_recommendation?.label ?? "", /配布場所/);
  });

  it("CLI recommend --out で report file を作る", () => {
    const outPath = join(tempDir, "report.json");
    const stdout: string[] = [];
    const code = runCli(
      ["recommend", FREEWATER_PROJECT_ID, "--out", outPath],
      {
        storageDir: tempDir,
        writeOut: (message: string) => stdout.push(message),
        writeErr: () => {},
      }
    );

    assert.equal(code, 0);
    assert.ok(existsSync(outPath));
    const parsed = JSON.parse(readFileSync(outPath, "utf8")) as {
      engine?: string;
    };
    assert.equal(parsed.engine, "rule-director-v1");
    assert.match(stdout.join("\n"), /Primary Recommendation:/);
  });

  it("cmdRecommend は ProjectState を保存しない", () => {
    const before = readFileSync(join(tempDir, `${FREEWATER_PROJECT_ID}.json`), "utf8");

    cmdRecommend([FREEWATER_PROJECT_ID], { storageDir: tempDir });

    const after = readFileSync(join(tempDir, `${FREEWATER_PROJECT_ID}.json`), "utf8");
    assert.equal(after, before);
  });
});
