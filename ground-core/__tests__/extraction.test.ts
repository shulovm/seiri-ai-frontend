import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdPropose, runCli } from "../cli.js";
import { saveProject } from "../file-store.js";
import { buildProposal } from "../extraction/propose.js";
import { mockExtractor } from "../extraction/mock-extractor.js";
import { isClarification } from "../extraction/types.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
const MOMOTARO_PROJECT_ID = "839578f5-36e1-4b6f-9be5-a97520f52b66";

function loadFixture(name: "freewater" | "momotaro"): ProjectState {
  if (name === "freewater") {
    return buildFreeWaterPhase0Fixture();
  }

  const path = join(
    process.cwd(),
    "ground-core/storage/projects",
    `${MOMOTARO_PROJECT_ID}.json`
  );

  if (!existsSync(path)) {
    throw new Error(`Missing fixture project file: ${path}`);
  }

  return JSON.parse(readFileSync(path, "utf8")) as ProjectState;
}

describe("extraction mock propose", () => {
  it("FreeWater location 入力で PatchProposal が返る", () => {
    const state = loadFixture("freewater");
    const result = buildProposal(
      {
        project_id: FREEWATER_PROJECT_ID,
        input_text: "FreeWaterの配布場所、新宿中央公園にしようと思う",
        project_state: state,
      },
      mockExtractor
    );

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(result.confidence, 0.86);
    assert.equal(result.risk_level, "low");
    assert.equal(result.requires_human_approval, true);
    assert.equal(result.proposed_patch.source, "extraction");
    assert.equal(result.proposed_patch.operations.length, 4);
  });

  it("FreeWater proposal は dry-run would_apply true", () => {
    const state = loadFixture("freewater");
    const result = buildProposal(
      {
        project_id: FREEWATER_PROJECT_ID,
        input_text: "配布場所、新宿中央公園に決めた",
        project_state: state,
      },
      mockExtractor
    );

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(result.dry_run_result.valid, true);
    assert.equal(result.dry_run_result.would_apply, true);
    assert.equal(result.dry_run_result.operation_count, 4);
    assert.ok(result.dry_run_result.operation_summaries.length >= 4);
  });

  it("Momotaro キャラ固定入力で PatchProposal が返る", () => {
    const state = loadFixture("momotaro");
    const result = buildProposal(
      {
        project_id: MOMOTARO_PROJECT_ID,
        input_text: "桃太郎はまずキャラ固定からやる。MJ文面は後でいい",
        project_state: state,
      },
      mockExtractor
    );

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(result.confidence, 0.78);
    assert.equal(result.risk_level, "low");
    assert.equal(result.proposed_patch.operations.length, 2);
    const primaryOp = result.proposed_patch.operations[1];
    assert.equal(primaryOp?.entity, "current_state");
    assert.equal(
      primaryOp?.entity === "current_state"
        ? primaryOp.payload?.primary_next_action_id
        : undefined,
      "c3333333-3333-4333-8333-333333333301"
    );
  });

  it("やめる系入力は ClarificationResponse", () => {
    const state = loadFixture("freewater");
    const result = buildProposal(
      {
        project_id: FREEWATER_PROJECT_ID,
        input_text: "FreeWaterもうだるいからやめる",
        project_state: state,
      },
      mockExtractor
    );

    assert.equal(isClarification(result), true);
    if (!isClarification(result)) {
      return;
    }

    assert.equal(result.type, "clarification");
    assert.equal(result.risk_level, "high");
    assert.match(result.reason, /自動で停止判定しない/);
    assert.equal(result.questions.length, 3);
  });
});

describe("cli propose", () => {
  let tempDir: string;
  let stdout: string[];
  let stderr: string[];

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-propose-"));
    stdout = [];
    stderr = [];
    saveProject(loadFixture("freewater"), { storageDir: tempDir });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  function runtimeOptions() {
    return {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: (message: string) => stderr.push(message),
    };
  }

  it("CLI propose --text が JSON を出す (mock)", () => {
    const result = cmdPropose(
      [
        FREEWATER_PROJECT_ID,
        "--text",
        "FreeWaterの配布場所、新宿中央公園にしようと思う",
        "--extractor",
        "mock",
      ],
      runtimeOptions()
    );

    assert.equal(isClarification(result), false);
    const code = runCli(
      [
        "propose",
        FREEWATER_PROJECT_ID,
        "--text",
        "FreeWaterの配布場所、新宿中央公園にしようと思う",
        "--extractor",
        "mock",
      ],
      runtimeOptions()
    );

    assert.equal(code, 0);
    const parsed = JSON.parse(stdout.join("\n")) as { summary?: string };
    assert.match(parsed.summary ?? "", /配布場所/);
  });

  it("CLI propose --out で proposal ファイルが作られる (mock)", () => {
    const outPath = join(tempDir, "proposal.json");
    const code = runCli(
      [
        "propose",
        FREEWATER_PROJECT_ID,
        "--text",
        "配布場所、新宿中央公園に決めた",
        "--extractor",
        "mock",
        "--out",
        outPath,
      ],
      runtimeOptions()
    );

    assert.equal(code, 0);
    assert.ok(existsSync(outPath));
    const parsed = JSON.parse(readFileSync(outPath, "utf8")) as {
      dry_run_result?: { would_apply?: boolean };
    };
    assert.equal(parsed.dry_run_result?.would_apply, true);
  });

  it("propose は ProjectState を保存しない", () => {
    const before = loadFixture("freewater");
    saveProject(before, { storageDir: tempDir });

    runCli(
      [
        "propose",
        FREEWATER_PROJECT_ID,
        "--text",
        "FreeWaterの配布場所、新宿中央公園にしようと思う",
        "--extractor",
        "mock",
      ],
      runtimeOptions()
    );

    const after = JSON.parse(
      readFileSync(join(tempDir, `${FREEWATER_PROJECT_ID}.json`), "utf8")
    ) as ProjectState;

    assert.equal(after.updated_at, before.updated_at);
    assert.equal(after.observations.length, before.observations.length);
    assert.equal(
      after.next_actions.find((action) => action.id.endsWith("3301"))?.status,
      "pending"
    );
  });

  it("clarification は exitCode 1 (mock)", () => {
    const code = runCli(
      [
        "propose",
        FREEWATER_PROJECT_ID,
        "--text",
        "FreeWaterもうだるいからやめる",
        "--extractor",
        "mock",
      ],
      runtimeOptions()
    );

    assert.equal(code, 1);
    const parsed = JSON.parse(stdout.join("\n")) as { type?: string };
    assert.equal(parsed.type, "clarification");
  });
});
