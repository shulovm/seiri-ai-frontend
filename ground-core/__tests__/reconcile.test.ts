import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { runCli } from "../cli.js";
import { ValidationError } from "../errors.js";
import { isClarification, isPatchProposal } from "../extraction/types.js";
import { loadProject, saveProject } from "../file-store.js";
import { proposeReconcile } from "../reconcile/propose.js";
import { applyRealityProposal } from "../reality/apply.js";
import { proposeFromReality } from "../reality/propose.js";
import { applyPatch } from "../state-engine.js";
import { runStudioBriefPipeline } from "../studio/studio-brief.js";
import type { ProjectState } from "../types.js";
import { validateProjectState } from "../validate.js";
import {
  buildReconcileFixtureState,
  RECONCILE_BLOCKER_A_ID,
  RECONCILE_BLOCKER_B_ID,
  RECONCILE_BLOCKER_RESOLVED_ID,
  RECONCILE_PRIMARY_ACTION_ID,
  RECONCILE_PROJECT_ID,
  RECONCILE_SECOND_ACTION_ID,
} from "./fixtures.js";

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function primaryChangeOps(
  result: ReturnType<typeof proposeReconcile>
) {
  if (isClarification(result.result)) {
    return [];
  }
  return result.result.proposed_patch.operations.filter(
    (op) =>
      op.entity === "current_state" &&
      op.payload &&
      "primary_next_action_id" in op.payload
  );
}

describe("State Reconciliation Controls v0.6.2", () => {
  let tempDir: string;
  let fixture: ProjectState;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-reconcile-"));
    fixture = structuredClone(buildReconcileFixtureState()) as ProjectState;
    const validation = validateProjectState(fixture);
    assert.equal(validation.valid, true, JSON.stringify(validation.errors));
    saveProject(fixture, { storageDir: tempDir });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("1. resolve blocker: propose のみでは state 不変、apply 後のみ resolved", () => {
    const before = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    const propose = proposeReconcile(before, {
      kind: "resolve_blocker",
      project_id: RECONCILE_PROJECT_ID,
      blocker_id: RECONCILE_BLOCKER_A_ID,
      evidence: "fixture evidence: blocker A resolved by human",
    });

    assert.equal(propose.project_state_mutated, false);
    assert.equal(propose.requires_human_decision, true);
    assert.equal(isClarification(propose.result), false);
    assert.ok(isPatchProposal(propose.result));

    const mid = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    assert.equal(
      mid.blockers.find((b) => b.id === RECONCILE_BLOCKER_A_ID)?.status,
      "open"
    );
    assert.equal(
      mid.blockers.find((b) => b.id === RECONCILE_BLOCKER_B_ID)?.status,
      "open"
    );

    if (isClarification(propose.result)) return;

    const applied = applyRealityProposal(
      { project_id: RECONCILE_PROJECT_ID, proposal: propose.result },
      { storageDir: tempDir }
    );
    assert.ok(applied.proposal_id);

    const after = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    assert.equal(
      after.blockers.find((b) => b.id === RECONCILE_BLOCKER_A_ID)?.status,
      "resolved"
    );
    assert.equal(
      after.blockers.find((b) => b.id === RECONCILE_BLOCKER_B_ID)?.status,
      "open"
    );
    assert.ok(
      after.observations.some((o) => o.title.includes("Blocker resolved"))
    );
  });

  it("2. complete action: done 候補のみ、next primary を自動選択しない", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    const result = proposeReconcile(state, {
      kind: "complete_action",
      project_id: RECONCILE_PROJECT_ID,
      action_id: RECONCILE_SECOND_ACTION_ID,
    });

    assert.equal(isClarification(result.result), false);
    if (isClarification(result.result)) return;

    const ops = result.result.proposed_patch.operations;
    assert.ok(
      ops.some(
        (op) =>
          op.op === "status_change" &&
          op.entity === "next_action" &&
          op.entity_id === RECONCILE_SECOND_ACTION_ID &&
          op.status === "done"
      )
    );
    assert.equal(primaryChangeOps(result).length, 0);

    const simulated = applyPatch(state, result.result.proposed_patch);
    assert.equal(
      simulated.current_state.primary_next_action_id,
      RECONCILE_PRIMARY_ACTION_ID
    );
  });

  it("3. current primary を complete しても他 action を暗黙 primary にしない", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    assert.equal(
      state.current_state.primary_next_action_id,
      RECONCILE_PRIMARY_ACTION_ID
    );

    const result = proposeReconcile(state, {
      kind: "complete_action",
      project_id: RECONCILE_PROJECT_ID,
      action_id: RECONCILE_PRIMARY_ACTION_ID,
    });

    assert.equal(isClarification(result.result), false);
    if (isClarification(result.result)) return;

    const simulated = applyPatch(state, result.result.proposed_patch);
    assert.equal(simulated.current_state.primary_next_action_id, null);
    assert.notEqual(
      simulated.current_state.primary_next_action_id,
      RECONCILE_SECOND_ACTION_ID
    );

    const done = simulated.next_actions.find(
      (a) => a.id === RECONCILE_PRIMARY_ACTION_ID
    );
    assert.equal(done?.status, "done");
    assert.equal(
      simulated.next_actions.find((a) => a.id === RECONCILE_SECOND_ACTION_ID)
        ?.status,
      "pending"
    );
  });

  it("4. explicit set-primary: 指定 action のみ primary になる", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    const result = proposeReconcile(state, {
      kind: "set_primary",
      project_id: RECONCILE_PROJECT_ID,
      action_id: RECONCILE_SECOND_ACTION_ID,
    });

    assert.equal(isClarification(result.result), false);
    if (isClarification(result.result)) return;

    const simulated = applyPatch(state, result.result.proposed_patch);
    assert.equal(
      simulated.current_state.primary_next_action_id,
      RECONCILE_SECOND_ACTION_ID
    );
  });

  it("4b. set-primary new action: 新規 pending を作成し primary にする", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    const result = proposeReconcile(state, {
      kind: "set_primary",
      project_id: RECONCILE_PROJECT_ID,
      new_action: {
        title: "explicit new primary for reconcile fixture",
      },
    });

    assert.equal(isClarification(result.result), false);
    if (isClarification(result.result)) return;

    const simulated = applyPatch(state, result.result.proposed_patch);
    const primaryId = simulated.current_state.primary_next_action_id;
    assert.ok(primaryId);
    assert.notEqual(primaryId, RECONCILE_PRIMARY_ACTION_ID);
    assert.notEqual(primaryId, RECONCILE_SECOND_ACTION_ID);
    const primary = simulated.next_actions.find((a) => a.id === primaryId);
    assert.equal(primary?.status, "pending");
    assert.match(primary?.title ?? "", /explicit new primary/);
  });

  it("5. 存在しない blocker_id / action_id を拒否", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    const missing = "00000000-0000-4000-8000-000000000099";

    assert.throws(
      () =>
        proposeReconcile(state, {
          kind: "resolve_blocker",
          project_id: RECONCILE_PROJECT_ID,
          blocker_id: missing,
          evidence: "x",
        }),
      ValidationError
    );

    assert.throws(
      () =>
        proposeReconcile(state, {
          kind: "complete_action",
          project_id: RECONCILE_PROJECT_ID,
          action_id: missing,
        }),
      ValidationError
    );

    assert.throws(
      () =>
        proposeReconcile(state, {
          kind: "set_primary",
          project_id: RECONCILE_PROJECT_ID,
          action_id: missing,
        }),
      ValidationError
    );
  });

  it("6. 既に resolved / done の対象は Clarification で安全に処理", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });

    const resolveDup = proposeReconcile(state, {
      kind: "resolve_blocker",
      project_id: RECONCILE_PROJECT_ID,
      blocker_id: RECONCILE_BLOCKER_RESOLVED_ID,
      evidence: "again",
    });
    assert.equal(isClarification(resolveDup.result), true);

    const completeOnce = proposeReconcile(state, {
      kind: "complete_action",
      project_id: RECONCILE_PROJECT_ID,
      action_id: RECONCILE_SECOND_ACTION_ID,
    });
    assert.ok(isPatchProposal(completeOnce.result));
    if (isClarification(completeOnce.result)) return;

    const afterDone = applyPatch(state, completeOnce.result.proposed_patch);
    const completeDup = proposeReconcile(afterDone, {
      kind: "complete_action",
      project_id: RECONCILE_PROJECT_ID,
      action_id: RECONCILE_SECOND_ACTION_ID,
    });
    assert.equal(isClarification(completeDup.result), true);
  });

  it("7. Proposal apply 後 ProjectState validation 通過", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    const result = proposeReconcile(state, {
      kind: "resolve_blocker",
      project_id: RECONCILE_PROJECT_ID,
      blocker_id: RECONCILE_BLOCKER_A_ID,
      evidence: "fixture validation evidence",
    });
    if (isClarification(result.result)) {
      assert.fail("expected proposal");
    }

    const next = applyPatch(state, result.result.proposed_patch);
    const validation = validateProjectState(next);
    assert.equal(validation.valid, true);
  });

  it("8. Studio Brief 既存回帰（isolated storage 不変・pipeline 成功）", () => {
    const path = join(tempDir, `${RECONCILE_PROJECT_ID}.json`);
    const before = sha256(path);

    const brief = runStudioBriefPipeline({
      project_states: [
        loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir }),
      ],
      brief_type: "session",
    });
    assert.ok(brief.display_brief);

    assert.equal(sha256(path), before);
  });

  it("9. Reality Semantics v0.6.1 を破壊しない", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    const path = join(tempDir, `${RECONCILE_PROJECT_ID}.json`);
    const before = sha256(path);

    const reality = proposeFromReality(state, {
      project_id: RECONCILE_PROJECT_ID,
      input_text: "reconcile fixture project で Reality Semantics を確認した",
      source: "manual",
    });

    assert.equal(reality.project_state_mutated, false);
    assert.equal(isClarification(reality.result), false);
    assert.equal(reality.reality_classification?.kind, "observation");
    assert.equal(sha256(path), before);
  });

  it("blocker B を resolve しない限り不変（明示なしでは触らない）", () => {
    const state = loadProject(RECONCILE_PROJECT_ID, { storageDir: tempDir });
    const result = proposeReconcile(state, {
      kind: "complete_action",
      project_id: RECONCILE_PROJECT_ID,
      action_id: RECONCILE_PRIMARY_ACTION_ID,
    });
    if (isClarification(result.result)) return;

    const ops = result.result.proposed_patch.operations;
    assert.ok(
      !ops.some(
        (op) =>
          op.entity === "blocker" && op.entity_id === RECONCILE_BLOCKER_B_ID
      )
    );
  });

  it("CLI reconcile-propose は proposal のみで isolated + live storage checksum 不変", () => {
    const livePath = join(
      process.cwd(),
      "ground-core/storage/projects",
      "34092589-569a-4eec-923d-a105b6b1402c.json"
    );
    const liveBefore = sha256(livePath);
    const isolatedPath = join(tempDir, `${RECONCILE_PROJECT_ID}.json`);
    const isolatedBefore = sha256(isolatedPath);

    const code = runCli(
      [
        "reconcile-propose",
        RECONCILE_PROJECT_ID,
        "--op",
        "complete-action",
        "--action-id",
        RECONCILE_PRIMARY_ACTION_ID,
        "--out",
        join(tempDir, "out.json"),
      ],
      {
        storageDir: tempDir,
        writeOut: () => {},
        writeErr: () => {},
      }
    );
    assert.equal(code, 0);
    assert.equal(sha256(isolatedPath), isolatedBefore);
    assert.equal(sha256(livePath), liveBefore);
  });
});
