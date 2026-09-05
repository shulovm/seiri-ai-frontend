import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdBuildApprovedPatch, runCli } from "../cli.js";
import { saveProject } from "../file-store.js";
import { buildApprovedPatch } from "../extraction/review/build-approved-patch.js";
import { ReviewBridgeError } from "../extraction/review/review-gates.js";
import type { ReviewSelection } from "../extraction/review/types.js";
import { runSemanticPropose } from "../extraction/semantic/semantic-propose.js";
import { isClarification } from "../extraction/types.js";
import type { PatchProposal } from "../extraction/types.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
const MOMOTARO_PROJECT_ID = "839578f5-36e1-4b6f-9be5-a97520f52b66";
const MOMOTARO_CHAR_ACTION_ID = "c3333333-3333-4333-8333-333333333301";
const MOMOTARO_MJ_ACTION_ID = "c3333333-3333-4333-8333-333333333304";
const FREEWATER_LOCATION_ACTION_ID = "f3333333-3333-4333-8333-333333333301";

function loadFixture(project: "freewater" | "momotaro"): ProjectState {
  if (project === "freewater") {
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

function proposeInput(
  text: string,
  state: ProjectState,
  projectId: string
) {
  return {
    project_id: projectId,
    input_text: text,
    project_state: state,
  };
}

function assertProposal(result: ReturnType<typeof runSemanticPropose>): PatchProposal {
  assert.equal(isClarification(result), false);
  if (isClarification(result)) {
    throw new Error("expected PatchProposal");
  }

  return result;
}

function buildSelection(
  proposal: PatchProposal,
  overrides: Partial<ReviewSelection> = {}
): ReviewSelection {
  const event = proposal.semantic_events?.[0];
  assert.ok(event);

  return {
    schema_version: "0.2.3",
    proposal_id: proposal.id,
    project_id: proposal.project_id,
    event_id: event.id,
    reviewer: "human",
    decision: "approve_resolution",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("Human Review Bridge v0.2.3", () => {
  it("PriorityChanged approve → observation + primary upsert", () => {
    const state = loadFixture("momotaro");
    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("桃太郎はまずキャラ固定からやる", state, MOMOTARO_PROJECT_ID)
      )
    );

    const selection = buildSelection(proposal, {
      selected_entity_type: "next_action",
      selected_entity_id: MOMOTARO_CHAR_ACTION_ID,
    });

    const result = buildApprovedPatch({
      proposal,
      selection,
      project_state: state,
    });

    assert.equal(result.type, "approved_patch");
    if (result.type !== "approved_patch") {
      return;
    }

    assert.equal(result.approved_patch.source, "human_review");
    assert.equal(result.approved_patch.operations.length, 2);
    assert.equal(result.approved_patch.operations[0]?.entity, "observation");
    assert.equal(result.approved_patch.operations[1]?.entity, "current_state");
    const primaryOp = result.approved_patch.operations[1];
    assert.equal(
      primaryOp?.entity === "current_state"
        ? primaryOp.payload?.primary_next_action_id
        : undefined,
      MOMOTARO_CHAR_ACTION_ID
    );
  });

  it("PriorityChanged approve + done action → reject", () => {
    const state = loadFixture("momotaro");
    const doneState = structuredClone(state);
    const action = doneState.next_actions.find((entry) => entry.id === MOMOTARO_CHAR_ACTION_ID);
    assert.ok(action);
    action.status = "done";

    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("桃太郎はまずキャラ固定からやる", doneState, MOMOTARO_PROJECT_ID)
      )
    );

    const resolution = proposal.resolution_results?.[0];
    assert.ok(resolution);
    resolution.candidates = [
      {
        entity_type: "next_action",
        entity_id: MOMOTARO_CHAR_ACTION_ID,
        label: action.title,
        score: 0.9,
        matched_terms: ["固定"],
        reason: "forced candidate for gate test",
      },
    ];
    resolution.ambiguity_level = "none";

    const selection = buildSelection(proposal, {
      selected_entity_type: "next_action",
      selected_entity_id: MOMOTARO_CHAR_ACTION_ID,
    });

    assert.throws(
      () =>
        buildApprovedPatch({
          proposal,
          selection,
          project_state: doneState,
        }),
      /requires selected action status pending/
    );
  });

  it("selected_entity_id が candidates にない → reject", () => {
    const state = loadFixture("momotaro");
    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("桃太郎はまずキャラ固定からやる", state, MOMOTARO_PROJECT_ID)
      )
    );

    const selection = buildSelection(proposal, {
      selected_entity_type: "next_action",
      selected_entity_id: MOMOTARO_MJ_ACTION_ID,
    });

    assert.throws(
      () =>
        buildApprovedPatch({
          proposal,
          selection,
          project_state: state,
        }),
      /not present in resolution_results candidates/
    );
  });

  it("ambiguity high + approve → reject", () => {
    const state = loadFixture("freewater");
    const proposal = assertProposal(
      runSemanticPropose(proposeInput("先に準備する", state, FREEWATER_PROJECT_ID))
    );

    assert.equal(proposal.resolution_results?.[0]?.ambiguity_level, "high");

    const selection = buildSelection(proposal, {
      selected_entity_type: "next_action",
      selected_entity_id: FREEWATER_LOCATION_ACTION_ID,
    });

    assert.throws(
      () =>
        buildApprovedPatch({
          proposal,
          selection,
          project_state: state,
        }),
      /ambiguity_level is high/
    );
  });

  it("ActionDeferred approve → primary 変更なし", () => {
    const state = loadFixture("momotaro");
    const proposal = assertProposal(
      runSemanticPropose(proposeInput("MJ文面は後でいい", state, MOMOTARO_PROJECT_ID))
    );

    const selection = buildSelection(proposal, {
      selected_entity_type: "next_action",
      selected_entity_id: MOMOTARO_MJ_ACTION_ID,
    });

    const result = buildApprovedPatch({
      proposal,
      selection,
      project_state: state,
    });

    assert.equal(result.type, "approved_patch");
    if (result.type !== "approved_patch") {
      return;
    }

    assert.equal(
      result.approved_patch.operations.some((operation) => operation.entity === "current_state"),
      false
    );
    assert.equal(
      result.approved_patch.operations.some(
        (operation) => operation.entity === "next_action" && operation.op === "status_change"
      ),
      false
    );
  });

  it("ActionDeferred note → observation.body に追記", () => {
    const state = loadFixture("momotaro");
    const proposal = assertProposal(
      runSemanticPropose(proposeInput("MJ文面は後でいい", state, MOMOTARO_PROJECT_ID))
    );

    const selection = buildSelection(proposal, {
      selected_entity_type: "next_action",
      selected_entity_id: MOMOTARO_MJ_ACTION_ID,
      note: "MJ文面は後回しで合意",
    });

    const result = buildApprovedPatch({
      proposal,
      selection,
      project_state: state,
    });

    assert.equal(result.type, "approved_patch");
    if (result.type !== "approved_patch") {
      return;
    }

    const observation = result.approved_patch.operations.find(
      (operation) => operation.entity === "observation"
    );
    const body =
      observation?.entity === "observation" ? observation.payload?.body : undefined;
    assert.match(String(body), /\[human_review\]/);
    assert.match(String(body), /MJ文面は後回しで合意/);
    assert.match(String(body), /Midjourneyに投げる本文ルールを確定する/);
  });

  it("reject_resolution → observation のみ、judgment なし", () => {
    const state = loadFixture("momotaro");
    const proposal = assertProposal(
      runSemanticPropose(proposeInput("MJ文面は後でいい", state, MOMOTARO_PROJECT_ID))
    );

    const selection = buildSelection(proposal, {
      decision: "reject_resolution",
      note: "候補が違う",
    });

    const result = buildApprovedPatch({
      proposal,
      selection,
      project_state: state,
    });

    assert.equal(result.type, "approved_patch");
    if (result.type !== "approved_patch") {
      return;
    }

    assert.equal(result.approved_patch.operations.length, 1);
    assert.equal(result.approved_patch.operations[0]?.entity, "observation");
  });

  it("clarify → patch 不出力", () => {
    const state = loadFixture("freewater");
    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("FreeWaterは先に場所を決める", state, FREEWATER_PROJECT_ID)
      )
    );

    const selection = buildSelection(proposal, {
      decision: "clarify",
    });

    const result = buildApprovedPatch({
      proposal,
      selection,
      project_state: state,
    });

    assert.equal(result.type, "clarification");
  });

  it("CandidateCreated → selection なしで observation patch build", () => {
    const state = loadFixture("freewater");
    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("新宿中央公園でやろうかな", state, FREEWATER_PROJECT_ID)
      )
    );

    const result = buildApprovedPatch({
      proposal,
      project_state: state,
    });

    assert.equal(result.type, "approved_patch");
    if (result.type !== "approved_patch") {
      return;
    }

    assert.equal(result.approved_patch.operations.length, 1);
    assert.equal(result.approved_patch.operations[0]?.entity, "observation");
  });

  it("DecisionMade → selection なしで observation + judgment hold build", () => {
    const state = loadFixture("freewater");
    const proposal = assertProposal(
      runSemanticPropose(proposeInput("新宿中央公園に決めた", state, FREEWATER_PROJECT_ID))
    );

    const result = buildApprovedPatch({
      proposal,
      project_state: state,
    });

    assert.equal(result.type, "approved_patch");
    if (result.type !== "approved_patch") {
      return;
    }

    assert.equal(result.approved_patch.operations.length, 2);
    assert.equal(result.approved_patch.operations[0]?.entity, "observation");
    assert.equal(result.approved_patch.operations[1]?.entity, "judgment");
  });

  it("StopRequested / ClarificationResponse → reject", () => {
    const state = loadFixture("freewater");
    const clarification = runSemanticPropose(
      proposeInput("もう無理、やめたい", state, FREEWATER_PROJECT_ID)
    );

    assert.equal(isClarification(clarification), true);

    assert.throws(
      () =>
        buildApprovedPatch({
          proposal: clarification as unknown as PatchProposal,
          project_state: state,
        }),
      ReviewBridgeError
    );

    const syntheticProposal = {
      id: "00000000-0000-4000-8000-000000000001",
      project_id: FREEWATER_PROJECT_ID,
      input_text: "もう無理、やめたい",
      summary: "test",
      confidence: 0.88,
      risk_level: "high" as const,
      proposed_patch: {
        schema_version: "0.1.1" as const,
        project_id: FREEWATER_PROJECT_ID,
        source: "extraction" as const,
        operations: [],
      },
      dry_run_result: {
        valid: true,
        would_apply: true,
        operation_count: 0,
        operation_summaries: [],
      },
      requires_human_approval: true as const,
      semantic_events: [
        {
          id: "evt-stop",
          type: "StopRequested" as const,
          target_kind: "unknown" as const,
          modality: "negative" as const,
          confidence: 0.88,
          evidence: ["無理"],
          raw_span: "もう無理、やめたい",
        },
      ],
      created_at: new Date().toISOString(),
    };

    assert.throws(
      () =>
        buildApprovedPatch({
          proposal: syntheticProposal,
          selection: {
            schema_version: "0.2.3",
            proposal_id: syntheticProposal.id,
            project_id: FREEWATER_PROJECT_ID,
            event_id: "evt-stop",
            reviewer: "human",
            decision: "approve_resolution",
            created_at: new Date().toISOString(),
          },
          project_state: state,
        }),
      /StopRequested is not supported/
    );
  });

  it("proposal_id 不一致 → reject", () => {
    const state = loadFixture("freewater");
    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("FreeWaterは先に場所を決める", state, FREEWATER_PROJECT_ID)
      )
    );

    const selection = buildSelection(proposal, {
      proposal_id: "00000000-0000-4000-8000-000000000099",
      selected_entity_type: "next_action",
      selected_entity_id: FREEWATER_LOCATION_ACTION_ID,
    });

    assert.throws(
      () =>
        buildApprovedPatch({
          proposal,
          selection,
          project_state: state,
        }),
      /proposal_id does not match/
    );
  });

  it("build-approved-patch 後に ProjectState 不変", () => {
    const state = loadFixture("freewater");
    const snapshot = JSON.stringify(state);
    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("FreeWaterは先に場所を決める", state, FREEWATER_PROJECT_ID)
      )
    );

    buildApprovedPatch({
      proposal,
      selection: buildSelection(proposal, {
        selected_entity_type: "next_action",
        selected_entity_id: FREEWATER_LOCATION_ACTION_ID,
      }),
      project_state: state,
    });

    assert.equal(JSON.stringify(state), snapshot);
  });

  it("approved patch が validate + dry-run 通過", () => {
    const state = loadFixture("freewater");
    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("FreeWaterは先に場所を決める", state, FREEWATER_PROJECT_ID)
      )
    );

    const result = buildApprovedPatch({
      proposal,
      selection: buildSelection(proposal, {
        selected_entity_type: "next_action",
        selected_entity_id: FREEWATER_LOCATION_ACTION_ID,
      }),
      project_state: state,
    });

    assert.equal(result.type, "approved_patch");
    if (result.type !== "approved_patch") {
      return;
    }

    assert.ok(result.gates_passed.includes("validateStatePatch"));
    assert.ok(result.gates_passed.includes("dryRunPatch"));
  });

  it("bridge source に project 固有語なし", () => {
    const files = [
      "ground-core/extraction/review/build-approved-patch.ts",
      "ground-core/extraction/review/review-gates.ts",
      "ground-core/extraction/review/types.ts",
    ];

    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      assert.equal(source.includes("桃太郎"), false, file);
      assert.equal(source.includes("Momotaro"), false, file);
      assert.equal(source.includes("FreeWater"), false, file);
      assert.equal(source.includes("新宿"), false, file);
      assert.equal(source.includes("高円寺"), false, file);
      assert.equal(source.includes("キャラ固定"), false, file);
      assert.equal(source.includes("MJ文面"), false, file);
    }
  });
});

describe("cli build-approved-patch", () => {
  let tempDir: string;
  let proposalPath: string;
  let selectionPath: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-review-"));
    const state = loadFixture("freewater");
    saveProject(state, { storageDir: tempDir });

    const proposal = assertProposal(
      runSemanticPropose(
        proposeInput("FreeWaterは先に場所を決める", state, FREEWATER_PROJECT_ID)
      )
    );

    proposalPath = join(tempDir, "proposal.json");
    selectionPath = join(tempDir, "selection.json");
    writeFileSync(proposalPath, `${JSON.stringify(proposal, null, 2)}\n`, "utf8");
    writeFileSync(
      selectionPath,
      `${JSON.stringify(
        buildSelection(proposal, {
          selected_entity_type: "next_action",
          selected_entity_id: FREEWATER_LOCATION_ACTION_ID,
        }),
        null,
        2
      )}\n`,
      "utf8"
    );
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("CLI build-approved-patch が approved StatePatch を出力する", () => {
    const stdout: string[] = [];
    const code = runCli(
      [
        "build-approved-patch",
        "--proposal",
        proposalPath,
        "--selection",
        selectionPath,
      ],
      {
        storageDir: tempDir,
        writeOut: (message: string) => stdout.push(message),
        writeErr: () => {},
      }
    );

    assert.equal(code, 0);
    const output = stdout.join("\n");
    assert.match(output, /approved_patch: ok/);
    assert.match(output, /primary_next_action_id:/);
    assert.match(output, /"source": "human_review"/);
  });

  it("cmdBuildApprovedPatch は ProjectState を保存しない", () => {
    const before = readFileSync(
      join(tempDir, `${FREEWATER_PROJECT_ID}.json`),
      "utf8"
    );

    cmdBuildApprovedPatch(
      ["--proposal", proposalPath, "--selection", selectionPath],
      { storageDir: tempDir }
    );

    const after = readFileSync(join(tempDir, `${FREEWATER_PROJECT_ID}.json`), "utf8");
    assert.equal(after, before);
  });
});
