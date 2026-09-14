import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { runCli } from "../cli.js";
import { saveProject, loadProject } from "../file-store.js";
import { isClarification } from "../extraction/types.js";
import { proposeFromReality } from "../reality/propose.js";
import { classifyRealityText } from "../reality/semantics.js";
import { proposeProgressPhase } from "../reality/draft.js";
import { ruleModalityDetector } from "../extraction/semantic/rule-modality-detector.js";
import { runSemanticPropose } from "../extraction/semantic/semantic-propose.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
const GROUND_CORE_PROJECT_ID = "34092589-569a-4eec-923d-a105b6b1402c";
const MOSHIMO_PROJECT_ID = "4afb2707-4c06-43b7-a9e6-6803e9431b88";

function loadProjectFile(projectId: string): ProjectState {
  if (projectId === FREEWATER_PROJECT_ID) {
    return buildFreeWaterPhase0Fixture();
  }

  const path = join(process.cwd(), "ground-core/storage/projects", `${projectId}.json`);
  if (!existsSync(path)) {
    throw new Error(`Missing fixture: ${path}`);
  }
  return JSON.parse(readFileSync(path, "utf8")) as ProjectState;
}

function minimalState(projectId: string, title: string): ProjectState {
  // Rebind every owned entity, not just Project and CurrentState.
  const base: ProjectState = JSON.parse(JSON.stringify(
    buildFreeWaterPhase0Fixture(),
    (key, value) => key === "project_id" ? projectId : value,
  ));
  return {
    ...base,
    project: {
      ...base.project,
      id: projectId,
      title,
    },
    current_state: {
      ...base.current_state,
      project_id: projectId,
      summary: "test summary",
      phase: "phase0_manual_test",
    },
  };
}

describe("Reality Semantics v0.6.1", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-reality-sem-"));
    saveProject(loadProjectFile(FREEWATER_PROJECT_ID), { storageDir: tempDir });
    saveProject(loadProjectFile(GROUND_CORE_PROJECT_ID), { storageDir: tempDir });
    if (existsSync(join(process.cwd(), "ground-core/storage/projects", `${MOSHIMO_PROJECT_ID}.json`))) {
      saveProject(loadProjectFile(MOSHIMO_PROJECT_ID), { storageDir: tempDir });
    }
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("OBSERVATION: 実装した → Clarification ではなく Proposal", () => {
    const state = loadProject(GROUND_CORE_PROJECT_ID, { storageDir: tempDir });
    const result = proposeFromReality(state, {
      project_id: GROUND_CORE_PROJECT_ID,
      input_text: "GROUND v0.6.0 Reality Loop Phase 1を実装した",
      source: "manual",
    });

    assert.equal(isClarification(result.result), false);
    assert.equal(result.reality_classification?.kind, "observation");
    if (isClarification(result.result)) return;
    assert.ok(
      result.result.proposed_patch.operations.some((op) => op.entity === "observation")
    );
  });

  it("OBSERVATION: 320 pass / 0 fail → observation Proposal", () => {
    const state = loadProject(GROUND_CORE_PROJECT_ID, { storageDir: tempDir });
    const result = proposeFromReality(state, {
      project_id: GROUND_CORE_PROJECT_ID,
      input_text: "テストは320 pass / 0 failだった",
      source: "manual",
    });

    assert.equal(isClarification(result.result), false);
    assert.equal(result.reality_classification?.kind, "observation");
    if (isClarification(result.result)) return;
    const obs = result.result.proposed_patch.operations.find((op) => op.entity === "observation");
    assert.ok(obs);
    assert.match(String((obs?.payload as { body?: string })?.body ?? ""), /320 pass/);
  });

  it("PROGRESS: 段階移行 → Proposal（完了断定しない）", () => {
    const state = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    const result = proposeFromReality(state, {
      project_id: FREEWATER_PROJECT_ID,
      input_text: "サイトを作る段階から実際の活動を増やす段階へ移行している",
      source: "field_test",
    });

    assert.equal(isClarification(result.result), false);
    assert.equal(result.reality_classification?.kind, "progress");
    if (isClarification(result.result)) return;

    const ops = result.result.proposed_patch.operations;
    assert.ok(ops.some((op) => op.entity === "observation"));
    const cs = ops.find((op) => op.entity === "current_state");
    assert.ok(cs);
    const summary = String((cs?.payload as { summary?: string })?.summary ?? "");
    assert.match(summary, /移行中|進捗/);
    assert.equal((cs?.payload as { phase?: string })?.phase, undefined);
    assert.equal(
      proposeProgressPhase(state.current_state.phase, result.ground_event.input_text),
      null
    );
  });

  it("INTENTION: 実験したい → completed fact にならない", () => {
    const state = existsSync(
      join(tempDir, `${MOSHIMO_PROJECT_ID}.json`)
    )
      ? loadProject(MOSHIMO_PROJECT_ID, { storageDir: tempDir })
      : minimalState(MOSHIMO_PROJECT_ID, "もしも動画 1本目制作");

    if (!existsSync(join(tempDir, `${MOSHIMO_PROJECT_ID}.json`))) {
      saveProject(state, { storageDir: tempDir });
    }

    const result = proposeFromReality(state, {
      project_id: state.project.id,
      input_text: "もしも動画を1本作って実験したい",
      source: "conversation",
    });

    assert.equal(isClarification(result.result), false);
    assert.equal(result.reality_classification?.kind, "intention");
    if (isClarification(result.result)) return;

    const ops = result.result.proposed_patch.operations;
    const action = ops.find((op) => op.entity === "next_action");
    assert.ok(action);
    assert.equal((action?.payload as { status?: string })?.status, "pending");
    assert.ok(
      !ops.some(
        (op) =>
          op.entity === "next_action" &&
          (op.op === "status_change" ||
            (op.payload as { status?: string })?.status === "done")
      )
    );
    const obsBody = String(
      (ops.find((op) => op.entity === "observation")?.payload as { body?: string })?.body ??
        ""
    );
    assert.match(obsBody, /未実行の意図/);
  });

  it("NEGATIVE: 曖昧すぎる自然文 → Clarification", () => {
    const state = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    const result = proposeFromReality(state, {
      project_id: FREEWATER_PROJECT_ID,
      input_text: "いろいろ",
      source: "manual",
    });

    assert.equal(isClarification(result.result), true);
    if (!isClarification(result.result)) return;
    assert.ok(
      result.result.questions.some((q) => q.includes("完了した事実") || q.includes("やりたい"))
    );
  });

  it("SAFETY: reality-propose のみでは storage 不変", () => {
    const before = structuredClone(
      loadProject(GROUND_CORE_PROJECT_ID, { storageDir: tempDir })
    );
    const code = runCli(
      [
        "reality-propose",
        GROUND_CORE_PROJECT_ID,
        "--text",
        "GROUND v0.6.0 Reality Loop Phase 1を実装した",
      ],
      { storageDir: tempDir, writeOut: () => {}, writeErr: () => {} }
    );
    assert.equal(code, 0);
    const after = loadProject(GROUND_CORE_PROJECT_ID, { storageDir: tempDir });
    assert.deepEqual(after, before);
  });

  it("REGRESSION: DecisionMade 系は既存 semantic を破壊しない", () => {
    const state = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    const input = {
      project_id: FREEWATER_PROJECT_ID,
      input_text: "配布場所、新宿中央公園に決めた",
      project_state: state,
    };
    const modality = ruleModalityDetector.detect(input);
    assert.equal(modality.events[0]?.type, "DecisionMade");

    const viaReality = proposeFromReality(state, {
      project_id: FREEWATER_PROJECT_ID,
      input_text: input.input_text,
    });
    assert.equal(viaReality.reality_classification, null);
    assert.equal(isClarification(viaReality.result), false);

    const viaSemantic = runSemanticPropose(input);
    assert.equal(isClarification(viaSemantic), false);
  });

  it("REGRESSION: CandidateCreated / Deferred / Stop も既存detectorで検出", () => {
    const state = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });

    const candidate = ruleModalityDetector.detect({
      project_id: FREEWATER_PROJECT_ID,
      input_text: "新宿中央公園でやろうかな",
      project_state: state,
    });
    assert.equal(candidate.events[0]?.type, "CandidateCreated");

    const deferred = ruleModalityDetector.detect({
      project_id: FREEWATER_PROJECT_ID,
      input_text: "MJ文面は後でいい",
      project_state: state,
    });
    assert.equal(deferred.events[0]?.type, "ActionDeferred");

    const stop = ruleModalityDetector.detect({
      project_id: FREEWATER_PROJECT_ID,
      input_text: "もう無理、やめたい",
      project_state: state,
    });
    assert.equal(stop.events[0]?.type, "StopRequested");
  });

  it("classifyRealityText: intention と observation を分離", () => {
    assert.equal(classifyRealityText("実装した").kind, "observation");
    assert.equal(classifyRealityText("移行しつつある").kind, "progress");
    assert.equal(classifyRealityText("実験したい").kind, "intention");
  });
});
