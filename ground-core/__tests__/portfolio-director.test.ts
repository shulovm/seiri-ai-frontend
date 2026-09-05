import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdRecommendPortfolio, runCli } from "../cli.js";
import { ruleDirector } from "../director/rule-director.js";
import {
  PortfolioDirectorError,
  recommendPortfolioFromInput,
  rulePortfolioDirector,
} from "../director/portfolio-director.js";
import { saveProject } from "../file-store.js";
import { createProjectFromExperimentSeed } from "../intake/create-project-from-seed.js";
import { validateExperimentSeed } from "../intake/validate-seed.js";
import { buildCompleteActionPatch } from "../session/build-complete-action-patch.js";
import { applyPatch } from "../state-engine.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const SEED_DIR = join(process.cwd(), "ground-core/examples/experiment-seeds");

function loadExperimentSeed(filename: string) {
  const raw = JSON.parse(readFileSync(join(SEED_DIR, filename), "utf8"));
  return createProjectFromExperimentSeed(validateExperimentSeed(raw));
}

const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
const MOMOTARO_PROJECT_ID = "839578f5-36e1-4b6f-9be5-a97520f52b66";
const GROUND_CORE_PROJECT_ID = "34092589-569a-4eec-923d-a105b6b1402c";
const FREEWATER_LOCATION_ACTION_ID = "f3333333-3333-4333-8333-333333333301";
const MOMOTARO_CHAR_ACTION_ID = "c3333333-3333-4333-8333-333333333301";

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

function buildPortfolioInput(
  states: ProjectState[],
  options?: {
    brief_type?: "morning" | "session" | "deep-work";
    session_focus_project_id?: string;
  }
) {
  const directorReports = states.map((state) =>
    ruleDirector.recommend({ project_state: state })
  );

  return {
    project_states: states,
    director_reports: directorReports,
    options,
  };
}

function loadPatchedMixedPortfolioV045(): {
  business: ProjectState;
  research: ProjectState;
  product: ProjectState;
} {
  let business = loadExperimentSeed("business-sample.json");
  const research = loadExperimentSeed("research-sample.json");
  const product = loadExperimentSeed("product-sample.json");
  const primaryActionId = business.current_state.primary_next_action_id;
  if (!primaryActionId) {
    throw new Error("business seed missing primary_next_action_id");
  }

  const { patch } = buildCompleteActionPatch(business, {
    action_id: primaryActionId,
    decision_title: "初回検証場所の候補を3つに絞る",
    decision_rationale:
      "受取率・怪しさ・導線の違いを比較しやすく、100本規模の小規模テストに向いているため。",
    observation_title: "検証場所候補メモ",
    observation_body:
      "初回は人通りの多さだけでなく、配布行為が自然に見える場所を優先する。",
    summary: "検証場所候補を3つに絞った。次は配布する対象物と数量を決める。",
  });
  business = applyPatch(business, patch);

  return { business, research, product };
}

describe("Portfolio Director v0.4", () => {
  it("FreeWater を top recommendation にする", () => {
    const states = [
      loadFixture("freewater"),
      loadFixture("momotaro"),
      loadFixture("ground"),
    ];
    const report = rulePortfolioDirector.recommendPortfolio(buildPortfolioInput(states));

    assert.equal(report.primary_recommendation.project_id, FREEWATER_PROJECT_ID);
    assert.equal(report.primary_recommendation.next_action_id, FREEWATER_LOCATION_ACTION_ID);
  });

  it("Momotaro が alternative に入る", () => {
    const report = rulePortfolioDirector.recommendPortfolio(
      buildPortfolioInput([
        loadFixture("freewater"),
        loadFixture("momotaro"),
        loadFixture("ground"),
      ])
    );

    assert.ok(report.alternative_recommendations.length >= 1);
    const momotaro = report.alternative_recommendations.find(
      (entry) => entry.project_id === MOMOTARO_PROJECT_ID
    );
    assert.ok(momotaro, "Momotaro should appear in alternatives");
    assert.equal(momotaro.next_action_id, MOMOTARO_CHAR_ACTION_ID);
  });

  it("GROUND Core が deferred に入る", () => {
    const report = rulePortfolioDirector.recommendPortfolio(
      buildPortfolioInput([
        loadFixture("freewater"),
        loadFixture("momotaro"),
        loadFixture("ground"),
      ])
    );

    const deferred = report.deferred_recommendations.find(
      (entry) => entry.project_id === GROUND_CORE_PROJECT_ID
    );
    assert.ok(deferred);
    assert.ok(
      deferred.defer_reasons.some((reason) => reason.kind === "defer_explicit")
    );
  });

  it("reasons が空でない", () => {
    const report = rulePortfolioDirector.recommendPortfolio(
      buildPortfolioInput([loadFixture("freewater"), loadFixture("momotaro")])
    );

    assert.ok(report.primary_recommendation.reasons.length >= 2);
    for (const recommendation of [
      report.primary_recommendation,
      ...report.alternative_recommendations,
    ]) {
      for (const reason of recommendation.reasons) {
        assert.ok(reason.message.trim().length > 0);
      }
    }
  });

  it("why_not_alternatives がある", () => {
    const report = rulePortfolioDirector.recommendPortfolio(
      buildPortfolioInput([
        loadFixture("freewater"),
        loadFixture("momotaro"),
        loadFixture("ground"),
      ])
    );

    assert.ok(report.primary_recommendation.why_not_alternatives.length >= 1);
    for (const entry of report.primary_recommendation.why_not_alternatives) {
      assert.ok(entry.reasons.length >= 1);
    }
  });

  it("deferred_recommendations がある", () => {
    const report = rulePortfolioDirector.recommendPortfolio(
      buildPortfolioInput([
        loadFixture("freewater"),
        loadFixture("momotaro"),
        loadFixture("ground"),
      ])
    );

    assert.ok(report.deferred_recommendations.length >= 2);
    for (const entry of report.deferred_recommendations) {
      assert.ok(entry.defer_reasons.length >= 1);
    }
  });

  it("project_health が 3 件ある", () => {
    const report = rulePortfolioDirector.recommendPortfolio(
      buildPortfolioInput([
        loadFixture("freewater"),
        loadFixture("momotaro"),
        loadFixture("ground"),
      ])
    );

    assert.equal(report.project_health.length, 3);
  });

  it("blocked_projects が出る", () => {
    const freewater = structuredClone(loadFixture("freewater"));
    freewater.project.status = "paused";

    const report = rulePortfolioDirector.recommendPortfolio(
      buildPortfolioInput([freewater, loadFixture("momotaro")])
    );

    assert.ok(report.blocked_projects.length >= 1);
    assert.ok(
      report.blocked_projects.some(
        (entry) =>
          entry.health_status === "stalled" ||
          entry.health_status === "blocked" ||
          entry.health_status === "paused"
      )
    );
  });

  it("confidence が 0〜1", () => {
    const report = rulePortfolioDirector.recommendPortfolio(
      buildPortfolioInput([loadFixture("freewater"), loadFixture("momotaro")])
    );

    assert.ok(report.confidence >= 0);
    assert.ok(report.confidence <= 1);
    assert.ok(report.confidence_factors.length >= 1);
  });

  it("ProjectState を変更しない", () => {
    const states = [
      structuredClone(loadFixture("freewater")),
      structuredClone(loadFixture("momotaro")),
    ];
    const snapshots = states.map((state) => JSON.stringify(state));

    rulePortfolioDirector.recommendPortfolio(buildPortfolioInput(states));

    for (let index = 0; index < states.length; index += 1) {
      assert.equal(JSON.stringify(states[index]), snapshots[index]);
    }
  });

  it("Portfolio source に project 固有名詞 hardcode がない", () => {
    const files = [
      "ground-core/director/portfolio-director.ts",
      "ground-core/director/portfolio-scoring.ts",
      "ground-core/director/portfolio-types.ts",
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

  it("dependency blocked project は blocked status になる", () => {
    const freewater = structuredClone(loadFixture("freewater"));
    const momotaro = structuredClone(loadFixture("momotaro"));
    momotaro.project.status = "paused";

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([freewater, momotaro])
    );

    assert.ok(
      report.blocked_projects.some((entry) => entry.health_status === "paused") ||
        report.project_health.some((entry) => entry.status === "paused")
    );
  });
});

describe("Portfolio tie-break v0.4.2", () => {
  it("uses portfolio input order when cross_project scores tie", () => {
    const business = loadExperimentSeed("business-sample.json");
    const research = loadExperimentSeed("research-sample.json");
    const product = loadExperimentSeed("product-sample.json");

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product])
    );

    assert.equal(report.primary_recommendation.project_id, business.project.id);
    assert.equal(report.project_ranking[0]?.project_id, business.project.id);
    assert.equal(report.project_ranking[0]?.rank, 1);
    assert.equal(
      report.primary_recommendation.project_id,
      report.project_ranking[0]?.project_id
    );
  });

  it("changes primary when input order changes under tied scores", () => {
    const business = loadExperimentSeed("business-sample.json");
    const research = loadExperimentSeed("research-sample.json");
    const product = loadExperimentSeed("product-sample.json");

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([research, business, product])
    );

    assert.equal(report.primary_recommendation.project_id, research.project.id);
    assert.equal(report.project_ranking[0]?.project_id, research.project.id);
  });

  it("prefers higher score over input order when scores differ", () => {
    const business = loadExperimentSeed("business-sample.json");
    const research = loadExperimentSeed("research-sample.json");
    const freewater = loadFixture("freewater");

    const tiedOnly = recommendPortfolioFromInput(
      buildPortfolioInput([business, research])
    );
    const mixed = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, freewater])
    );

    assert.equal(mixed.primary_recommendation.project_id, FREEWATER_PROJECT_ID);
    assert.ok(mixed.primary_recommendation.score >= tiedOnly.primary_recommendation.score);
  });

  it("deferred message does not use less-than when scores tie", () => {
    const business = loadExperimentSeed("business-sample.json");
    const research = loadExperimentSeed("research-sample.json");
    const product = loadExperimentSeed("product-sample.json");

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product])
    );

    for (const deferred of report.deferred_recommendations) {
      const explicit = deferred.defer_reasons.find(
        (reason) => reason.kind === "defer_explicit"
      );
      assert.ok(explicit);
      assert.equal(explicit.message.includes("< primary"), false);
      if (deferred.project_id !== business.project.id) {
        assert.match(
          explicit.message,
          /同点|後回し|後続/
        );
      }
    }
  });

  it("deferred message uses less-than when primary score is higher", () => {
    const freewater = loadFixture("freewater");
    const ground = loadFixture("ground");

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([freewater, ground])
    );

    const deferredGround = report.deferred_recommendations.find(
      (entry) => entry.project_id === GROUND_CORE_PROJECT_ID
    );
    assert.ok(deferredGround);
    const explicit = deferredGround.defer_reasons.find(
      (reason) => reason.kind === "defer_explicit"
    );
    assert.ok(explicit);
    assert.match(explicit.message, /</);
    assert.ok(report.primary_recommendation.score > report.project_ranking.find(
      (entry) => entry.project_id === GROUND_CORE_PROJECT_ID
    )!.cross_project_score);
  });
});

describe("cli recommend-portfolio", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-portfolio-"));
    saveProject(loadFixture("freewater"), { storageDir: tempDir });
    saveProject(loadFixture("momotaro"), { storageDir: tempDir });
    saveProject(loadFixture("ground"), { storageDir: tempDir });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("CLI recommend-portfolio text 出力", () => {
    const stdout: string[] = [];
    const code = runCli(["recommend-portfolio"], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    const output = stdout.join("\n");
    assert.match(output, /GROUND Core Portfolio Director Report/);
    assert.match(output, /Top Recommendation/);
    assert.match(output, /配布場所/);
  });

  it("CLI recommend-portfolio --format json", () => {
    const stdout: string[] = [];
    const code = runCli(["recommend-portfolio", "--format", "json"], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    const parsed = JSON.parse(stdout.join("\n")) as {
      schema_version?: string;
      primary_recommendation?: { project_id?: string };
    };
    assert.equal(parsed.schema_version, "0.4.0");
    assert.equal(parsed.primary_recommendation?.project_id, FREEWATER_PROJECT_ID);
  });

  it("CLI recommend-portfolio --out", () => {
    const outPath = join(tempDir, "portfolio-report.json");
    const stdout: string[] = [];
    const code = runCli(["recommend-portfolio", "--out", outPath], {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: () => {},
    });

    assert.equal(code, 0);
    assert.ok(existsSync(outPath));
    const parsed = JSON.parse(readFileSync(outPath, "utf8")) as { engine?: string };
    assert.equal(parsed.engine, "rule-portfolio-director-v1");
    assert.match(stdout.join("\n"), /Top Recommendation/);
  });

  it("--projects id,id で対象限定できる", () => {
    const stdout: string[] = [];
    const code = runCli(
      [
        "recommend-portfolio",
        "--projects",
        `${FREEWATER_PROJECT_ID},${MOMOTARO_PROJECT_ID}`,
        "--format",
        "json",
      ],
      {
        storageDir: tempDir,
        writeOut: (message: string) => stdout.push(message),
        writeErr: () => {},
      }
    );

    assert.equal(code, 0);
    const parsed = JSON.parse(stdout.join("\n")) as {
      project_health?: Array<{ project_id: string }>;
    };
    assert.equal(parsed.project_health?.length, 2);
    assert.equal(
      parsed.project_health?.some((entry) => entry.project_id === GROUND_CORE_PROJECT_ID),
      false
    );
  });

  it("cmdRecommendPortfolio は saveProject / applyPatch を呼ばない", () => {
    const freewaterPath = join(tempDir, `${FREEWATER_PROJECT_ID}.json`);
    const before = readFileSync(freewaterPath, "utf8");

    cmdRecommendPortfolio([], { storageDir: tempDir });

    const after = readFileSync(freewaterPath, "utf8");
    assert.equal(after, before);
  });
});

describe("Session focus portfolio v0.4.8", () => {
  it("morning mixed portfolio keeps research primary after business session-01", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], { brief_type: "morning" })
    );

    assert.equal(report.primary_recommendation.project_id, research.project.id);
    assert.equal(
      report.primary_recommendation.reasons.some((reason) => reason.kind === "session_focus"),
      false
    );
  });

  it("session explicit focus promotes business with session_focus reason", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], {
        brief_type: "session",
        session_focus_project_id: business.project.id,
      })
    );

    assert.equal(report.primary_recommendation.project_id, business.project.id);
    assert.ok(
      report.primary_recommendation.reasons.some(
        (reason) =>
          reason.kind === "session_focus" &&
          reason.message.includes("explicit focus project")
      )
    );
    assert.equal(report.project_ranking[0]?.project_id, business.project.id);
  });

  it("session fallback uses first project in input order", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], { brief_type: "session" })
    );

    assert.equal(report.primary_recommendation.project_id, business.project.id);
    assert.ok(
      report.primary_recommendation.reasons.some(
        (reason) =>
          reason.kind === "session_focus" &&
          reason.message.includes("first project fallback")
      )
    );
  });

  it("session fallback respects reordered projects", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([research, business, product], { brief_type: "session" })
    );

    assert.equal(report.primary_recommendation.project_id, research.project.id);
    assert.ok(
      report.primary_recommendation.reasons.some(
        (reason) =>
          reason.kind === "session_focus" &&
          reason.message.includes("first project fallback")
      )
    );
  });

  it("rejects session_focus_project_id outside project_states", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    assert.throws(
      () =>
        recommendPortfolioFromInput(
          buildPortfolioInput([business, research, product], {
            brief_type: "session",
            session_focus_project_id: "00000000-0000-4000-8000-000000000099",
          })
        ),
      PortfolioDirectorError
    );
  });

  it("deep-work primary matches morning on patched mixed portfolio but adds deep_work_focus", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    const morning = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], { brief_type: "morning" })
    );
    const deepWork = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], { brief_type: "deep-work" })
    );

    assert.equal(deepWork.primary_recommendation.project_id, morning.primary_recommendation.project_id);
    assert.equal(
      deepWork.primary_recommendation.reasons.some((reason) => reason.kind === "session_focus"),
      false
    );
    assert.ok(
      deepWork.primary_recommendation.reasons.some(
        (reason) =>
          reason.kind === "deep_work_focus" && reason.message.includes("deep_work")
      )
    );
    assert.equal(
      morning.primary_recommendation.reasons.some((reason) => reason.kind === "deep_work_focus"),
      false
    );
  });

  it("cmdRecommendPortfolio supports --type session --focus-project", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();
    const tempDir = mkdtempSync(join(tmpdir(), "ground-core-session-focus-"));
    try {
      saveProject(business, { storageDir: tempDir });
      saveProject(research, { storageDir: tempDir });
      saveProject(product, { storageDir: tempDir });

      const report = cmdRecommendPortfolio(
        [
          "--projects",
          `${business.project.id},${research.project.id},${product.project.id}`,
          "--type",
          "session",
          "--focus-project",
          business.project.id,
        ],
        { storageDir: tempDir, writeErr: () => {} }
      );

      assert.equal(report.primary_recommendation.project_id, business.project.id);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("cmdRecommendPortfolio rejects unknown --focus-project", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();
    const tempDir = mkdtempSync(join(tmpdir(), "ground-core-session-focus-"));
    try {
      saveProject(business, { storageDir: tempDir });
      saveProject(research, { storageDir: tempDir });
      saveProject(product, { storageDir: tempDir });

      assert.throws(
        () =>
          cmdRecommendPortfolio(
            [
              "--projects",
              `${business.project.id},${research.project.id},${product.project.id}`,
              "--type",
              "session",
              "--focus-project",
              "00000000-0000-4000-8000-000000000099",
            ],
            { storageDir: tempDir, writeErr: () => {} }
          ),
        /not included in --projects/
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe("Deep work focus portfolio v0.4.12", () => {
  function loadUnpatchedMixedPortfolio() {
    return {
      business: loadExperimentSeed("business-sample.json"),
      research: loadExperimentSeed("research-sample.json"),
      product: loadExperimentSeed("product-sample.json"),
    };
  }

  function makePrimaryIneligible(state: ProjectState): ProjectState {
    const primaryId = state.current_state.primary_next_action_id;
    const dependency = state.next_actions.find(
      (action) => action.id !== primaryId && action.status === "pending"
    );
    if (!primaryId || !dependency) {
      throw new Error("fixture missing primary or dependency action");
    }

    return {
      ...state,
      next_actions: state.next_actions.map((action) =>
        action.id === primaryId
          ? { ...action, depends_on_action_id: dependency.id }
          : action
      ),
    };
  }

  it("deep-work intent reason on primary with deep_work action_intent", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], { brief_type: "deep-work" })
    );

    assert.equal(report.primary_recommendation.project_id, research.project.id);
    assert.ok(
      report.primary_recommendation.reasons.some(
        (reason) =>
          reason.kind === "deep_work_focus" && reason.message.includes("deep_work")
      )
    );
  });

  it("morning unchanged — no deep_work_focus reason", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], { brief_type: "morning" })
    );

    assert.equal(
      report.primary_recommendation.reasons.some((reason) => reason.kind === "deep_work_focus"),
      false
    );
  });

  it("session explicit focus unchanged — session_focus yes, deep_work_focus no", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], {
        brief_type: "session",
        session_focus_project_id: business.project.id,
      })
    );

    assert.equal(report.primary_recommendation.project_id, business.project.id);
    assert.ok(
      report.primary_recommendation.reasons.some((reason) => reason.kind === "session_focus")
    );
    assert.equal(
      report.primary_recommendation.reasons.some((reason) => reason.kind === "deep_work_focus"),
      false
    );
  });

  it("deep-work primary can differ from morning when deep_work intent tips ranking", () => {
    const { business, research, product } = loadUnpatchedMixedPortfolio();

    const morning = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], { brief_type: "morning" })
    );
    const deepWork = recommendPortfolioFromInput(
      buildPortfolioInput([business, research, product], { brief_type: "deep-work" })
    );

    assert.equal(morning.primary_recommendation.project_id, business.project.id);
    assert.equal(deepWork.primary_recommendation.project_id, research.project.id);
    assert.ok(
      deepWork.primary_recommendation.reasons.some((reason) => reason.kind === "deep_work_focus")
    );
  });

  it("unlock fallback bonus when no deep_work intent on eligible primaries", () => {
    const { business, product } = loadUnpatchedMixedPortfolio();

    const report = recommendPortfolioFromInput(
      buildPortfolioInput([business, product], { brief_type: "deep-work" })
    );

    assert.ok(
      report.primary_recommendation.reasons.some(
        (reason) =>
          reason.kind === "deep_work_focus" && reason.message.includes("fallback")
      )
    );
    assert.equal(
      report.primary_recommendation.reasons.some((reason) => reason.message.includes("deep_work")),
      false
    );
  });

  it("ineligible deep_work intent project does not receive bonus", () => {
    const { business, research, product } = loadUnpatchedMixedPortfolio();
    const blockedResearch = makePrimaryIneligible(research);

    const morning = recommendPortfolioFromInput(
      buildPortfolioInput([business, blockedResearch, product], { brief_type: "morning" })
    );
    const deepWork = recommendPortfolioFromInput(
      buildPortfolioInput([business, blockedResearch, product], { brief_type: "deep-work" })
    );

    assert.notEqual(deepWork.primary_recommendation.project_id, blockedResearch.project.id);

    const morningResearch = morning.project_ranking.find(
      (entry) => entry.project_id === blockedResearch.project.id
    );
    const deepWorkResearch = deepWork.project_ranking.find(
      (entry) => entry.project_id === blockedResearch.project.id
    );

    assert.equal(
      morningResearch?.cross_project_score,
      deepWorkResearch?.cross_project_score,
      "ineligible research score must not gain deep-work bonus"
    );
  });

  it("cmdRecommendPortfolio deep-work JSON includes deep_work_focus", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();
    const tempDir = mkdtempSync(join(tmpdir(), "ground-core-deep-work-focus-"));
    try {
      saveProject(business, { storageDir: tempDir });
      saveProject(research, { storageDir: tempDir });
      saveProject(product, { storageDir: tempDir });

      const report = cmdRecommendPortfolio(
        [
          "--projects",
          `${business.project.id},${research.project.id},${product.project.id}`,
          "--type",
          "deep-work",
          "--format",
          "json",
        ],
        { storageDir: tempDir, writeErr: () => {} }
      );

      assert.ok(
        report.primary_recommendation.reasons.some((reason) => reason.kind === "deep_work_focus")
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
