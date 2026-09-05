import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdRealityApply, cmdRealityPropose, runCli } from "../cli.js";
import { loadProject, saveProject } from "../file-store.js";
import { isClarification } from "../extraction/types.js";
import { applyRealityProposal, RealityApplyError } from "../reality/apply.js";
import { proposeFromReality } from "../reality/propose.js";
import { runStudioBriefPipeline } from "../studio/studio-brief.js";
import type { ProjectState } from "../types.js";
import { validateProjectState } from "../validate.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
const GROUND_CORE_PROJECT_ID = "34092589-569a-4eec-923d-a105b6b1402c";

function loadFixture(project: "freewater" | "ground"): ProjectState {
  if (project === "freewater") {
    return buildFreeWaterPhase0Fixture();
  }

  const path = join(
    process.cwd(),
    "ground-core/storage/projects",
    `${GROUND_CORE_PROJECT_ID}.json`
  );

  if (!existsSync(path)) {
    throw new Error(`Missing fixture project file: ${path}`);
  }

  return JSON.parse(readFileSync(path, "utf8")) as ProjectState;
}

describe("Reality Loop Phase 1 v0.6.0", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-reality-"));
    saveProject(loadFixture("freewater"), { storageDir: tempDir });
    saveProject(loadFixture("ground"), { storageDir: tempDir });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("Event入力だけでは ProjectState が変わらない", () => {
    const before = structuredClone(loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir }));
    const result = cmdRealityPropose(
      [FREEWATER_PROJECT_ID, "--text", "配布場所、新宿中央公園に決めた", "--extractor", "mock"],
      { storageDir: tempDir }
    );

    assert.equal(result.project_state_mutated, false);
    assert.equal(result.requires_human_apply, true);
    assert.equal(result.ground_event.schema_version, "0.6.0");

    const after = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    assert.deepEqual(after, before);
  });

  it("Proposal生成でも ProjectState が変わらない", () => {
    const before = structuredClone(loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir }));
    const propose = proposeFromReality(
      before,
      {
        project_id: FREEWATER_PROJECT_ID,
        input_text: "配布場所、新宿中央公園に決めた",
      },
      "mock"
    );

    assert.equal(isClarification(propose.result), false);
    const after = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    assert.deepEqual(after, before);
  });

  it("明示的 apply 時のみ変更される", () => {
    const before = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    const observationBefore = before.observations.length;

    const propose = cmdRealityPropose(
      [FREEWATER_PROJECT_ID, "--text", "配布場所、新宿中央公園に決めた", "--extractor", "mock"],
      { storageDir: tempDir }
    );

    assert.equal(isClarification(propose.result), false);
    if (isClarification(propose.result)) {
      return;
    }

    const mid = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    assert.equal(mid.observations.length, observationBefore);

    const applied = applyRealityProposal(
      {
        project_id: FREEWATER_PROJECT_ID,
        proposal: propose.result,
      },
      { storageDir: tempDir }
    );

    const after = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    assert.equal(applied.loop_stage, "applied");
    assert.ok(after.observations.length >= observationBefore);
    assert.notEqual(after.updated_at, before.updated_at);
  });

  it("不正な project_id を拒否", () => {
    assert.throws(
      () =>
        cmdRealityPropose(
          ["00000000-0000-4000-8000-000000000000", "--text", "何か起きた", "--extractor", "mock"],
          { storageDir: tempDir }
        ),
      /not found|No such|Missing|Failed/i
    );
  });

  it("不正 patch を拒否", () => {
    const propose = cmdRealityPropose(
      [FREEWATER_PROJECT_ID, "--text", "配布場所、新宿中央公園に決めた", "--extractor", "mock"],
      { storageDir: tempDir }
    );
    assert.equal(isClarification(propose.result), false);
    if (isClarification(propose.result)) {
      return;
    }

    const broken = structuredClone(propose.result);
    broken.proposed_patch.operations = [];
    broken.proposed_patch.project_id = "11111111-1111-4111-8111-111111111111";

    assert.throws(
      () =>
        applyRealityProposal(
          {
            project_id: FREEWATER_PROJECT_ID,
            proposal: broken,
          },
          { storageDir: tempDir }
        ),
      (error: unknown) =>
        error instanceof RealityApplyError ||
        (error instanceof Error && /project_id|Invalid/i.test(error.message))
    );
  });

  it("apply後の ProjectState を既存 GROUND pipeline が読める", () => {
    const propose = cmdRealityPropose(
      [FREEWATER_PROJECT_ID, "--text", "配布場所、新宿中央公園に決めた", "--extractor", "mock"],
      { storageDir: tempDir }
    );
    assert.equal(isClarification(propose.result), false);
    if (isClarification(propose.result)) {
      return;
    }

    applyRealityProposal(
      {
        project_id: FREEWATER_PROJECT_ID,
        proposal: propose.result,
      },
      { storageDir: tempDir }
    );

    const updated = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    const validation = validateProjectState(updated);
    assert.equal(validation.valid, true);

    const states = [
      updated,
      loadProject(GROUND_CORE_PROJECT_ID, { storageDir: tempDir }),
    ];
    const brief = runStudioBriefPipeline({
      project_states: states,
      brief_type: "morning",
    });
    assert.equal(brief.display_brief.requires_human_decision, true);
    assert.ok(brief.display_brief.headline.length > 0);
  });

  it("CLI reality-propose --out しても state 不変", () => {
    const outPath = join(tempDir, "reality-proposal.json");
    const before = structuredClone(loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir }));
    const code = runCli(
      [
        "reality-propose",
        FREEWATER_PROJECT_ID,
        "--text",
        "配布場所、新宿中央公園に決めた",
        "--extractor",
        "mock",
        "--out",
        outPath,
      ],
      {
        storageDir: tempDir,
        writeOut: () => {},
        writeErr: () => {},
      }
    );

    assert.equal(code, 0);
    assert.ok(existsSync(outPath));
    const after = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    assert.deepEqual(after, before);
  });

  it("CLI reality-apply で明示適用", () => {
    const outPath = join(tempDir, "reality-proposal.json");
    runCli(
      [
        "reality-propose",
        FREEWATER_PROJECT_ID,
        "--text",
        "配布場所、新宿中央公園に決めた",
        "--extractor",
        "mock",
        "--out",
        outPath,
      ],
      { storageDir: tempDir, writeOut: () => {}, writeErr: () => {} }
    );

    const before = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    const stdout: string[] = [];
    const code = runCli(
      ["reality-apply", FREEWATER_PROJECT_ID, "--proposal", outPath],
      {
        storageDir: tempDir,
        writeOut: (message: string) => stdout.push(message),
        writeErr: () => {},
      }
    );

    assert.equal(code, 0);
    assert.match(stdout.join("\n"), /updated_at/);
    const after = loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir });
    assert.notEqual(after.updated_at, before.updated_at);
  });

  it("Clarification は apply できない", () => {
    const clarificationPath = join(tempDir, "clarification.json");
    writeFileSync(
      clarificationPath,
      JSON.stringify(
        {
          schema_version: "0.6.0",
          ground_event: {
            schema_version: "0.6.0",
            id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
            project_id: FREEWATER_PROJECT_ID,
            source: "manual",
            occurred_at: "2026-06-07T00:00:00.000Z",
            input_text: "やめたい",
            title: "やめたい",
            summary: "やめたい",
            created_at: "2026-06-07T00:00:00.000Z",
          },
          result: {
            type: "clarification",
            project_id: FREEWATER_PROJECT_ID,
            input_text: "やめたい",
            reason: "stop",
            questions: ["hold?"],
            risk_level: "high",
            created_at: "2026-06-07T00:00:00.000Z",
          },
          project_state_mutated: false,
          loop_stage: "propose",
          requires_human_apply: true,
        },
        null,
        2
      ),
      "utf8"
    );

    assert.throws(
      () =>
        cmdRealityApply([FREEWATER_PROJECT_ID, "--proposal", clarificationPath], {
          storageDir: tempDir,
        }),
      /Clarification|apply/i
    );
  });

  it("dogfood 3 project — FreeWater + GROUND + 第3 fixture で studio-brief 再評価", () => {
    const third: ProjectState = {
      ...structuredClone(loadFixture("freewater")),
      project: {
        ...loadFixture("freewater").project,
        id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        title: "もしも工場 Fixture",
      },
    };
    saveProject(third, { storageDir: tempDir });

    const propose = cmdRealityPropose(
      [FREEWATER_PROJECT_ID, "--text", "配布場所、新宿中央公園に決めた", "--extractor", "mock"],
      { storageDir: tempDir }
    );
    assert.equal(isClarification(propose.result), false);
    if (isClarification(propose.result)) {
      return;
    }

    applyRealityProposal(
      {
        project_id: FREEWATER_PROJECT_ID,
        proposal: propose.result,
      },
      { storageDir: tempDir }
    );

    const states = [
      loadProject(FREEWATER_PROJECT_ID, { storageDir: tempDir }),
      loadProject(GROUND_CORE_PROJECT_ID, { storageDir: tempDir }),
      loadProject(third.project.id, { storageDir: tempDir }),
    ];

    const brief = runStudioBriefPipeline({ project_states: states });
    assert.equal(brief.studio_report.recommended_flow.length, 3);
    assert.equal(brief.display_brief.requires_human_decision, true);
  });
});
