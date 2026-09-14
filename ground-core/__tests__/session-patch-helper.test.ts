import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdBuildCompleteActionPatch } from "../cli.js";
import { saveProject } from "../file-store.js";
import { ruleDirector } from "../director/rule-director.js";
import { createProjectFromExperimentSeed } from "../intake/create-project-from-seed.js";
import { validateExperimentSeed } from "../intake/validate-seed.js";
import { buildCompleteActionPatch } from "../session/build-complete-action-patch.js";
import { formatBuildCompleteActionPatchPreview } from "../session/preview-formatters.js";
import { applyPatch } from "../state-engine.js";
import { runStudioBriefPipeline } from "../studio/studio-brief.js";
import { ValidationError } from "../errors.js";
import { validateStatePatch } from "../validate.js";

const SAMPLE_SEED_PATH = join(
  process.cwd(),
  "ground-core/examples/experiment-seeds/sample.json"
);

function loadSampleState() {
  const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
  const seed = validateExperimentSeed(raw);
  return createProjectFromExperimentSeed(seed);
}

function sortedActions(state: ReturnType<typeof loadSampleState>) {
  return [...state.next_actions].sort((a, b) => a.sort_order - b.sort_order);
}

describe("Session Patch Helper", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-session-patch-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("builds complete-action patch from pending action", () => {
    const state = loadSampleState();
    const first = sortedActions(state)[0];
    assert.ok(first);

    const result = buildCompleteActionPatch(state, {
      action_id: first.id,
    });

    assert.equal(result.completed_action_title, first.title);
    assert.ok(result.operation_count >= 2);
    assert.equal(result.patch.project_id, state.project.id);
  });

  it("patch passes validateStatePatch", () => {
    const state = loadSampleState();
    const first = sortedActions(state)[0];
    assert.ok(first);

    const { patch } = buildCompleteActionPatch(state, { action_id: first.id });
    const validation = validateStatePatch(patch);

    assert.equal(validation.valid, true);
  });

  it("applyPatch marks target action done and advances primary", () => {
    const state = loadSampleState();
    const [first, second] = sortedActions(state);
    assert.ok(first);
    assert.ok(second);

    const { patch } = buildCompleteActionPatch(state, { action_id: first.id });
    const next = applyPatch(state, patch);

    const completed = next.next_actions.find((action) => action.id === first.id);
    assert.equal(completed?.status, "done");
    assert.equal(next.current_state.primary_next_action_id, second.id);
  });

  it("includes decision upsert when decision_title is provided", () => {
    const state = loadSampleState();
    const first = sortedActions(state)[0];
    assert.ok(first);

    const { patch } = buildCompleteActionPatch(state, {
      action_id: first.id,
      decision_title: "テーマを決定",
      decision_rationale: "60秒構成に向くため",
    });

    const decisionOp = patch.operations.find(
      (operation) => operation.entity === "decision"
    );
    assert.ok(decisionOp);
    assert.equal(
      decisionOp?.entity === "decision" ? decisionOp.payload?.title : undefined,
      "テーマを決定"
    );
  });

  it("includes observation upsert when observation_body is provided", () => {
    const state = loadSampleState();
    const first = sortedActions(state)[0];
    assert.ok(first);

    const { patch } = buildCompleteActionPatch(state, {
      action_id: first.id,
      observation_body: "視覚的展開が作りやすい",
    });

    const observationOp = patch.operations.find(
      (operation) => operation.entity === "observation"
    );
    assert.ok(observationOp);
    assert.equal(
      observationOp?.entity === "observation"
        ? observationOp.payload?.body
        : undefined,
      "視覚的展開が作りやすい"
    );
  });

  it("supports next_action_id override", () => {
    const state = loadSampleState();
    const [first, second] = sortedActions(state);
    assert.ok(first);
    assert.ok(second);

    const auto = buildCompleteActionPatch(state, { action_id: first.id });
    const overridden = buildCompleteActionPatch(state, {
      action_id: first.id,
      next_action_id: second.id,
    });

    assert.equal(overridden.next_primary_action_id, second.id);
    assert.equal(
      overridden.next_primary_action_id,
      auto.next_primary_action_id
    );

    const next = applyPatch(state, overridden.patch);
    assert.equal(next.current_state.primary_next_action_id, second.id);
  });

  it("rejects invalid action_id", () => {
    const state = loadSampleState();
    assert.throws(
      () =>
        buildCompleteActionPatch(state, {
          action_id: "00000000-0000-4000-8000-000000000000",
        }),
      ValidationError
    );
  });

  it("rejects already done action", () => {
    const state = loadSampleState();
    const first = sortedActions(state)[0];
    assert.ok(first);

    const doneState = applyPatch(state, {
      schema_version: "0.1.1",
      project_id: state.project.id,
      source: "manual",
      operations: [
        {
          op: "status_change",
          entity: "next_action",
          entity_id: first.id,
          status: "done",
        },
      ],
    });

    assert.throws(
      () => buildCompleteActionPatch(doneState, { action_id: first.id }),
      /not completable/
    );
  });

  it("rejects next_action override when dependencies are not ready", () => {
    const state = loadSampleState();
    const [first, , third] = sortedActions(state);
    assert.ok(first);
    assert.ok(third);

    assert.throws(
      () =>
        buildCompleteActionPatch(state, {
          action_id: first.id,
          next_action_id: third.id,
        }),
      /dependencies are not ready/
    );
  });

  it("advances studio-brief TODAY after applying generated patch", () => {
    const state = loadSampleState();
    const [first, second] = sortedActions(state);
    assert.ok(first);
    assert.ok(second);

    const before = runStudioBriefPipeline({ project_states: [state] });
    const { patch } = buildCompleteActionPatch(state, {
      action_id: first.id,
      summary: "テーマ決定済み。次は視聴者への約束。",
    });
    const next = applyPatch(state, patch);
    const after = runStudioBriefPipeline({ project_states: [next] });

    assert.match(before.display_brief.primary_focus.action_title, /動画テーマ/);
    assert.equal(after.display_brief.primary_focus.action_title, second.title);

    const report = ruleDirector.recommend({ project_state: next });
    assert.equal(
      report.recommendation.primary_recommendation.entity_id,
      second.id
    );
  });

  it("cmdBuildCompleteActionPatch returns result without saving", () => {
    const state = loadSampleState();
    const first = sortedActions(state)[0];
    assert.ok(first);

    saveProject(state, { storageDir: tempDir });

    const stdout: string[] = [];
    const result = cmdBuildCompleteActionPatch(
      [state.project.id, "--action", first.id, "--format", "json"],
      {
        storageDir: tempDir,
        writeOut: (message: string) => stdout.push(message),
        writeErr: () => {},
      }
    );

    assert.equal(result.completed_action_title, first.title);
    assert.equal(validateStatePatch(result.patch).valid, true);
    assert.ok(stdout.join("\n").includes('"schema_version"'));
  });

  describe("text preview", () => {
    function buildRichResult() {
      const state = loadSampleState();
      const first = sortedActions(state)[0];
      assert.ok(first);

      return buildCompleteActionPatch(state, {
        action_id: first.id,
        decision_title: "テーマを決定",
        observation_title: "作業メモ",
        observation_body: "視覚的展開が作りやすい",
        summary: "テーマ決定済み。次は視聴者への約束。",
      });
    }

    it("shows completed action and next primary action with --out", () => {
      const result = buildRichResult();
      const preview = formatBuildCompleteActionPatchPreview(
        result,
        "/tmp/session.patch.json"
      );

      assert.match(preview, /completed action:/);
      assert.match(preview, /動画テーマを1つ決める/);
      assert.match(preview, /next primary action:/);
      assert.match(preview, /視聴者への約束を1行で書く/);
    });

    it("shows decision and observation titles in operations", () => {
      const result = buildRichResult();
      const preview = formatBuildCompleteActionPatchPreview(
        result,
        "/tmp/session.patch.json"
      );

      assert.match(preview, /upsert decision: テーマを決定/);
      assert.match(preview, /upsert observation: 作業メモ/);
    });

    it("shows apply command when --out is provided", () => {
      const result = buildRichResult();
      const preview = formatBuildCompleteActionPatchPreview(
        result,
        "/tmp/session.patch.json"
      );

      assert.match(
        preview,
        /npm run ground-core -- patch .+ --file \/tmp\/session\.patch\.json/
      );
    });

    it("shows save guidance when --out is missing", () => {
      const result = buildRichResult();
      const preview = formatBuildCompleteActionPatchPreview(result, undefined);

      assert.match(preview, /not saved/);
      assert.match(preview, /use --out <path> to save/);
      assert.match(preview, /provide --out <path> to save this patch/);
    });

    it("cmdBuildCompleteActionPatch text preview includes operations", () => {
      const state = loadSampleState();
      const first = sortedActions(state)[0];
      assert.ok(first);

      saveProject(state, { storageDir: tempDir });
      const outPath = join(tempDir, "session.patch.json");
      const stdout: string[] = [];

      cmdBuildCompleteActionPatch(
        [
          state.project.id,
          "--action",
          first.id,
          "--decision-title",
          "テーマを決定",
          "--observation-title",
          "作業メモ",
          "--summary",
          "テーマ決定済み",
          "--out",
          outPath,
          "--format",
          "text",
        ],
        {
          storageDir: tempDir,
          writeOut: (message: string) => stdout.push(message),
          writeErr: () => {},
        }
      );

      const output = stdout.join("\n");
      assert.match(output, /status_change next_action -> done/);
      assert.match(output, /primary_next_action_id:/);
      assert.match(output, /summary: テーマ決定済み/);
      assert.match(output, /npm run ground-core -- patch/);
    });

    it("cmdBuildCompleteActionPatch --format json outputs pure JSON", () => {
      const state = loadSampleState();
      const first = sortedActions(state)[0];
      assert.ok(first);

      saveProject(state, { storageDir: tempDir });
      const stdout: string[] = [];

      cmdBuildCompleteActionPatch(
        [state.project.id, "--action", first.id, "--format", "json"],
        {
          storageDir: tempDir,
          writeOut: (message: string) => stdout.push(message),
          writeErr: () => {},
        }
      );

      const output = stdout.join("\n").trim();
      assert.doesNotThrow(() => JSON.parse(output));
      assert.ok(!output.includes("patch created"));
      assert.ok(!output.includes("apply:"));
    });
  });
});
