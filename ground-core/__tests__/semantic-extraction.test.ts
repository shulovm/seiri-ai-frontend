import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdPropose, runCli } from "../cli.js";
import { saveProject } from "../file-store.js";
import { runSemanticPropose, assertPatchHasNoAutoStateAdvance } from "../extraction/semantic/semantic-propose.js";
import { ruleModalityDetector } from "../extraction/semantic/rule-modality-detector.js";
import { isClarification } from "../extraction/types.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
const MOMOTARO_PROJECT_ID = "839578f5-36e1-4b6f-9be5-a97520f52b66";
const MOMOTARO_CHAR_ACTION_ID = "c3333333-3333-4333-8333-333333333301";
const MOMOTARO_MJ_ACTION_ID = "c3333333-3333-4333-8333-333333333304";
const FREEWATER_LOCATION_ACTION_ID = "f3333333-3333-4333-8333-333333333301";

function loadFixture(project: "freewater" | "momotaro" = "freewater"): ProjectState {
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
  state: ProjectState = loadFixture("freewater"),
  projectId: string = FREEWATER_PROJECT_ID
) {
  return {
    project_id: projectId,
    input_text: text,
    project_state: state,
  };
}

function assertProposal(result: ReturnType<typeof runSemanticPropose>) {
  assert.equal(isClarification(result), false);
  if (isClarification(result)) {
    throw new Error("expected PatchProposal");
  }

  return result;
}

function patchOperationsIncludeStatusChange(result: unknown, entity: string): boolean {
  if (typeof result !== "object" || result === null || !("proposed_patch" in result)) {
    return false;
  }

  const patch = (result as { proposed_patch: { operations: Array<{ entity: string; op: string }> } })
    .proposed_patch;

  return patch.operations.some(
    (operation) => operation.entity === entity && operation.op === "status_change"
  );
}

describe("RuleModalityDetector", () => {
  it("「新宿中央公園でやろうかな」→ CandidateCreated", () => {
    const result = ruleModalityDetector.detect(
      proposeInput("新宿中央公園でやろうかな")
    );

    assert.equal(result.events[0]?.type, "CandidateCreated");
    assert.equal(result.events[0]?.modality, "intent");
  });

  it("「高円寺の祭りでやろうかな」→ CandidateCreated", () => {
    const result = ruleModalityDetector.detect(
      proposeInput("高円寺の祭りでやろうかな")
    );

    assert.equal(result.events[0]?.type, "CandidateCreated");
    assert.equal(result.events[0]?.modality, "intent");
  });

  it("異なる固有名詞でも EventDetector のコード変更不要", () => {
    const a = ruleModalityDetector.detect(proposeInput("新宿中央公園でやろうかな"));
    const b = ruleModalityDetector.detect(proposeInput("高円寺の祭りでやろうかな"));

    assert.equal(a.events[0]?.type, b.events[0]?.type);
    assert.equal(a.events[0]?.modality, b.events[0]?.modality);
  });

  it("「新宿中央公園に決めた」→ DecisionMade", () => {
    const result = ruleModalityDetector.detect(proposeInput("新宿中央公園に決めた"));

    assert.equal(result.events[0]?.type, "DecisionMade");
    assert.equal(result.events[0]?.modality, "commitment");
  });

  it("「もう少し考える」→ ActionDeferred", () => {
    const result = ruleModalityDetector.detect(proposeInput("もう少し考える"));

    assert.equal(result.events[0]?.type, "ActionDeferred");
    assert.equal(result.events[0]?.modality, "deferred");
  });

  it("「もう無理、やめたい」→ StopRequested", () => {
    const result = ruleModalityDetector.detect(proposeInput("もう無理、やめたい"));

    assert.equal(result.events[0]?.type, "StopRequested");
    assert.equal(result.events[0]?.modality, "negative");
  });

  it("固有名詞は event.evidence に入れず raw_span にだけ入る", () => {
    const result = ruleModalityDetector.detect(proposeInput("新宿中央公園でやろうかな"));
    const event = result.events[0];

    assert.ok(event);
    assert.equal(event.raw_span, "新宿中央公園でやろうかな");
    assert.deepEqual(event.evidence, ["かな", "やろう"]);
    assert.equal(event.evidence.some((item) => item.includes("新宿")), false);
  });

  it("「桃太郎はまずキャラ固定からやる」→ PriorityChanged", () => {
    const result = ruleModalityDetector.detect(
      proposeInput("桃太郎はまずキャラ固定からやる")
    );

    assert.equal(result.events[0]?.type, "PriorityChanged");
    assert.equal(result.events[0]?.modality, "commitment");
    assert.equal(result.events[0]?.target_kind, "next_action");
    assert.equal(result.events[0]?.resolver_hint?.strategy, "semantic_match_next_action");
    assert.equal(result.events[0]?.resolver_hint?.raw_target_span, "キャラ固定");
  });

  it("「FreeWaterは先に場所を決める」→ PriorityChanged", () => {
    const result = ruleModalityDetector.detect(proposeInput("FreeWaterは先に場所を決める"));

    assert.equal(result.events[0]?.type, "PriorityChanged");
    assert.equal(result.events[0]?.resolver_hint?.raw_target_span, "場所");
  });

  it("「MJ文面は後でいい」→ ActionDeferred + resolver_hint", () => {
    const result = ruleModalityDetector.detect(proposeInput("MJ文面は後でいい"));

    assert.equal(result.events[0]?.type, "ActionDeferred");
    assert.equal(result.events[0]?.resolver_hint?.strategy, "semantic_match_next_action");
    assert.equal(result.events[0]?.resolver_hint?.raw_target_span, "MJ文面");
  });
});

describe("semantic propose pipeline", () => {
  it("CandidateCreated は action done を出さない", () => {
    const result = runSemanticPropose(proposeInput("新宿中央公園でやろうかな"));

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(result.proposed_patch.operations.length, 1);
    assert.equal(result.proposed_patch.operations[0]?.entity, "observation");
    assert.equal(patchOperationsIncludeStatusChange(result, "next_action"), false);
    assertPatchHasNoAutoStateAdvance(result.proposed_patch);
  });

  it("DecisionMade も action done / blocker resolved を出さない", () => {
    const result = runSemanticPropose(proposeInput("新宿中央公園に決めた"));

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(
      result.proposed_patch.operations.some((operation) => operation.entity === "judgment"),
      true
    );
    assert.equal(patchOperationsIncludeStatusChange(result, "next_action"), false);
    assert.equal(patchOperationsIncludeStatusChange(result, "blocker"), false);
    assertPatchHasNoAutoStateAdvance(result.proposed_patch);
  });

  it("StopRequested は ClarificationResponse", () => {
    const result = runSemanticPropose(proposeInput("もう無理、やめたい"));

    assert.equal(isClarification(result), true);
    if (!isClarification(result)) {
      return;
    }

    assert.match(result.reason, /自動で停止判定しない/);
    assert.equal(result.risk_level, "high");
  });

  it("StopRequested は project.status を変えない", () => {
    const state = loadFixture("freewater");
    const beforeStatus = state.project.status;

    runSemanticPropose(proposeInput("もう無理、やめたい", state));

    assert.equal(state.project.status, beforeStatus);
  });

  it("PriorityChanged は primary_next_action_id を更新しない", () => {
    const result = runSemanticPropose(proposeInput("桃太郎はまずキャラ固定からやる"));

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(result.proposed_patch.operations.length, 1);
    assert.equal(result.proposed_patch.operations[0]?.entity, "observation");
    assertPatchHasNoAutoStateAdvance(result.proposed_patch);
  });

  it("PriorityChanged は action done を出さない", () => {
    const result = runSemanticPropose(proposeInput("FreeWaterは先に場所を決める"));

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(patchOperationsIncludeStatusChange(result, "next_action"), false);
    assertPatchHasNoAutoStateAdvance(result.proposed_patch);
  });

  it("PatchProposal に semantic_events[] が含まれる", () => {
    const result = runSemanticPropose(proposeInput("桃太郎はまずキャラ固定からやる"));

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.ok(result.semantic_events);
    assert.equal(result.semantic_events?.length, 1);
    assert.equal(result.semantic_events?.[0]?.type, "PriorityChanged");
    assert.equal(result.semantic_events?.[0]?.resolver_hint?.raw_target_span, "キャラ固定");
  });

  it("ActionDeferred proposal に semantic_events resolver_hint が含まれる", () => {
    const result = runSemanticPropose(proposeInput("MJ文面は後でいい"));

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(result.semantic_events?.[0]?.type, "ActionDeferred");
    assert.equal(result.semantic_events?.[0]?.resolver_hint?.raw_target_span, "MJ文面");
  });
});

describe("cli semantic propose", () => {
  let tempDir: string;
  let stdout: string[];

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-semantic-"));
    stdout = [];
    saveProject(loadFixture("freewater"), { storageDir: tempDir });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("CLI propose が semantic pipeline を使う", () => {
    const code = runCli(
      [
        "propose",
        FREEWATER_PROJECT_ID,
        "--text",
        "FreeWaterは先に場所を決める",
      ],
      {
        storageDir: tempDir,
        writeOut: (message: string) => stdout.push(message),
        writeErr: () => {},
      }
    );

    assert.equal(code, 0);
    const parsed = JSON.parse(stdout.join("\n")) as {
      summary?: string;
      proposed_patch?: { operations: Array<{ entity: string }> };
      resolution_results?: Array<{ raw_target_span?: string; candidates?: unknown[] }>;
    };
    assert.match(parsed.summary ?? "", /優先/);
    assert.equal(parsed.proposed_patch?.operations.length, 1);
    assert.equal(parsed.proposed_patch?.operations[0]?.entity, "observation");
    assert.ok(parsed.resolution_results);
    assert.equal(parsed.resolution_results?.[0]?.raw_target_span, "場所");
    assert.ok((parsed.resolution_results?.[0]?.candidates?.length ?? 0) >= 1);
  });

  it("--extractor mock で旧 MockExtractor を使える", () => {
    const result = cmdPropose(
      [
        FREEWATER_PROJECT_ID,
        "--text",
        "FreeWaterの配布場所、新宿中央公園にしようと思う",
        "--extractor",
        "mock",
      ],
      { storageDir: tempDir }
    );

    assert.equal(isClarification(result), false);
    if (isClarification(result)) {
      return;
    }

    assert.equal(result.proposed_patch.operations.length, 4);
  });
});

describe("mock extractor guard", () => {
  it("RuleModalityDetector ソースに固有名詞条件がない", () => {
    const source = readFileSync(
      join(process.cwd(), "ground-core/extraction/semantic/rule-modality-detector.ts"),
      "utf8"
    );

    assert.equal(source.includes("新宿"), false);
    assert.equal(source.includes("FreeWater"), false);
    assert.equal(source.includes("桃太郎"), false);
    assert.equal(source.includes("Momotaro"), false);
    assert.equal(source.includes("高円寺"), false);
    assert.equal(source.includes("キャラ固定"), false);
    assert.equal(source.includes("MJ文面"), false);
  });

  it("TokenMatchResolver ソースに project 固有語条件がない", () => {
    const source = readFileSync(
      join(process.cwd(), "ground-core/extraction/semantic/token-match-resolver.ts"),
      "utf8"
    );

    assert.equal(source.includes("桃太郎"), false);
    assert.equal(source.includes("Momotaro"), false);
    assert.equal(source.includes("FreeWater"), false);
    assert.equal(source.includes("新宿"), false);
    assert.equal(source.includes("高円寺"), false);
    assert.equal(source.includes("キャラ固定"), false);
    assert.equal(source.includes("MJ文面"), false);
    assert.equal(source.includes("場所"), false);
  });
});

describe("EventResolver v0.2.2", () => {
  it("Momotaro「まずキャラ固定からやる」で next_action candidate が出る", () => {
    const state = loadFixture("momotaro");
    const result = assertProposal(
      runSemanticPropose(
        proposeInput("桃太郎はまずキャラ固定からやる", state, MOMOTARO_PROJECT_ID)
      )
    );

    const resolution = result.resolution_results?.[0];
    assert.ok(resolution);
    assert.equal(resolution.raw_target_span, "キャラ固定");
    assert.ok((resolution.candidates?.length ?? 0) >= 1);
    assert.equal(resolution.candidates?.[0]?.entity_id, MOMOTARO_CHAR_ACTION_ID);
    assert.ok((resolution.candidates?.[0]?.score ?? 0) >= 0.65);
    assert.ok(["none", "low"].includes(resolution.ambiguity_level));
  });

  it("Momotaro「MJ文面は後でいい」で next_action candidate が出る", () => {
    const state = loadFixture("momotaro");
    const result = assertProposal(
      runSemanticPropose(proposeInput("MJ文面は後でいい", state, MOMOTARO_PROJECT_ID))
    );

    const resolution = result.resolution_results?.[0];
    assert.ok(resolution);
    assert.equal(resolution.raw_target_span, "MJ文面");
    assert.equal(resolution.candidates?.[0]?.entity_id, MOMOTARO_MJ_ACTION_ID);
    assert.ok((resolution.candidates?.[0]?.score ?? 0) >= 0.65);
    assert.ok(["none", "low"].includes(resolution.ambiguity_level));
  });

  it("FreeWater「先に場所を決める」で next_action candidate が出る", () => {
    const state = loadFixture("freewater");
    const result = assertProposal(
      runSemanticPropose(proposeInput("FreeWaterは先に場所を決める", state))
    );

    const resolution = result.resolution_results?.[0];
    assert.ok(resolution);
    assert.equal(resolution.raw_target_span, "場所");
    assert.equal(resolution.candidates?.[0]?.entity_id, FREEWATER_LOCATION_ACTION_ID);
    assert.ok((resolution.candidates?.[0]?.score ?? 0) >= 0.65);
    assert.ok(["none", "low"].includes(resolution.ambiguity_level));
  });

  it("曖昧入力「先に準備する」で ambiguity medium/high", () => {
    const state = loadFixture("freewater");
    const result = assertProposal(runSemanticPropose(proposeInput("先に準備する", state)));

    const resolution = result.resolution_results?.[0];
    assert.ok(resolution);
    assert.equal(resolution.raw_target_span, "準備");
    assert.equal(resolution.candidates.length, 0);
    assert.ok(["medium", "high"].includes(resolution.ambiguity_level));
  });

  it("PatchProposal に resolution_results[] が含まれる", () => {
    const result = assertProposal(
      runSemanticPropose(proposeInput("FreeWaterは先に場所を決める"))
    );

    assert.ok(result.resolution_results);
    assert.equal(result.resolution_results?.length, 1);
    assert.equal(result.resolution_results?.[0]?.needs_human_review, true);
  });

  it("selected_candidate_id は自動設定しない", () => {
    const result = assertProposal(
      runSemanticPropose(proposeInput("FreeWaterは先に場所を決める"))
    );

    assert.equal(result.resolution_results?.[0]?.selected_candidate_id, undefined);
  });

  it("proposed_patch に primary_next_action_id 更新が入らない", () => {
    const result = assertProposal(
      runSemanticPropose(proposeInput("桃太郎はまずキャラ固定からやる", loadFixture("momotaro"), MOMOTARO_PROJECT_ID))
    );

    assert.equal(
      result.proposed_patch.operations.some(
        (operation) =>
          operation.entity === "current_state" &&
          operation.payload &&
          "primary_next_action_id" in operation.payload
      ),
      false
    );
    assertPatchHasNoAutoStateAdvance(result.proposed_patch);
  });

  it("proposed_patch に action done が入らない", () => {
    const result = assertProposal(
      runSemanticPropose(proposeInput("MJ文面は後でいい", loadFixture("momotaro"), MOMOTARO_PROJECT_ID))
    );

    assert.equal(patchOperationsIncludeStatusChange(result, "next_action"), false);
    assertPatchHasNoAutoStateAdvance(result.proposed_patch);
  });

  it("proposed_patch に blocker resolved / mitigated が入らない", () => {
    const result = assertProposal(
      runSemanticPropose(proposeInput("FreeWaterは先に場所を決める"))
    );

    assert.equal(patchOperationsIncludeStatusChange(result, "blocker"), false);
    assertPatchHasNoAutoStateAdvance(result.proposed_patch);
  });

  it("ProjectState は propose 後も変更されない", () => {
    const state = loadFixture("freewater");
    const snapshot = JSON.stringify(state);

    runSemanticPropose(proposeInput("FreeWaterは先に場所を決める", state));

    assert.equal(JSON.stringify(state), snapshot);
  });

  it("CandidateCreated は resolution_results を出さない", () => {
    const result = assertProposal(runSemanticPropose(proposeInput("新宿中央公園でやろうかな")));

    assert.equal(result.resolution_results?.length ?? 0, 0);
  });
});
