import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { cmdIntake } from "../cli.js";
import { listProjects, saveProject } from "../file-store.js";
import { createProjectFromExperimentSeed } from "../intake/create-project-from-seed.js";
import { validateExperimentSeed } from "../intake/validate-seed.js";
import { runStudioBriefPipeline } from "../studio/studio-brief.js";
import { applyPatch } from "../state-engine.js";
import { ruleDirector } from "../director/rule-director.js";
import { validateProjectState } from "../validate.js";

const SAMPLE_SEED_PATH = join(
  process.cwd(),
  "ground-core/examples/experiment-seeds/sample.json"
);

const MULTI_SEED_SAMPLES = [
  {
    file: "business-sample.json",
    kind: "business",
    expectedTag: "experiment:business",
    expectedFirstAction: "検証場所の候補を3つ出す",
  },
  {
    file: "research-sample.json",
    kind: "research",
    expectedTag: "experiment:research",
    expectedFirstAction: "関連分野を5つに分類する",
  },
  {
    file: "product-sample.json",
    kind: "product",
    expectedTag: "experiment:product",
    expectedFirstAction: "想定ユーザーを1人に絞る",
  },
] as const;

function loadSeedFromExamples(filename: string) {
  const path = join(process.cwd(), "ground-core/examples/experiment-seeds", filename);
  return validateExperimentSeed(JSON.parse(readFileSync(path, "utf8")));
}

describe("Experiment Intake", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-intake-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("loads sample seed JSON", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);

    assert.equal(seed.kind, "content");
    assert.equal(seed.title, "仮説型コンテンツ実験 v0.1");
  });

  it("validateExperimentSeed succeeds for sample seed", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    assert.doesNotThrow(() => validateExperimentSeed(raw));
  });

  it("createProjectFromExperimentSeed returns valid ProjectState", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    assert.equal(state.project.title, seed.title);
    assert.match(state.project.id, /^[0-9a-f-]{36}$/);
  });

  it("sets experiment tags on project", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    assert.ok(state.project.tags?.includes("experiment"));
    assert.ok(state.project.tags?.includes("experiment:content"));
    assert.ok(state.project.tags?.includes("content-experiment"));
  });

  it("stores extensions.intake metadata", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);
    const intake = state.extensions.intake as Record<string, unknown>;

    assert.equal(intake.source, "experiment_seed");
    assert.equal(intake.seed_kind, "content");
    assert.equal(intake.created_from, "ground-core/intake");
    assert.equal(intake.target_output, "60秒動画の制作計画");
    assert.deepEqual(intake.assumptions, seed.assumptions);
    assert.deepEqual(intake.risks, seed.risks);
  });

  it("does not convert risks into blockers", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    assert.equal(state.blockers.length, 0);
    const intake = state.extensions.intake as Record<string, unknown>;
    assert.deepEqual(intake.risks, seed.risks);
  });

  it("converts only initial_blockers into blockers", () => {
    const seed = validateExperimentSeed({
      kind: "content",
      title: "Blocker test",
      description: "Blocker test description",
      initial_blockers: ["素材が未確保"],
    });
    const state = createProjectFromExperimentSeed(seed);

    assert.equal(state.blockers.length, 1);
    assert.equal(state.blockers[0]?.title, "素材が未確保");
  });

  it("does not convert assumptions into hypotheses", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    for (const assumption of seed.assumptions ?? []) {
      assert.ok(!state.hypotheses.some((hypothesis) => hypothesis.statement === assumption));
    }
    const intake = state.extensions.intake as Record<string, unknown>;
    assert.deepEqual(intake.assumptions, seed.assumptions);
  });

  it("converts only initial_hypotheses into hypotheses", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    assert.equal(state.hypotheses.length, seed.initial_hypotheses?.length);
    for (const statement of seed.initial_hypotheses ?? []) {
      assert.ok(state.hypotheses.some((hypothesis) => hypothesis.statement === statement));
    }
  });

  it("chains next_actions with depends_on_action_id", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    assert.ok(state.next_actions.length >= 2);
    assert.equal(state.next_actions[0]?.depends_on_action_id, null);
    assert.equal(
      state.next_actions[1]?.depends_on_action_id,
      state.next_actions[0]?.id
    );
  });

  it("creates goals, next_actions, and valid primary references", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    assert.ok(state.goals.length >= 1);
    assert.ok(state.next_actions.length >= 1);
    assert.ok(state.hypotheses.length >= 1);
    assert.ok(state.decisions.length >= 1);

    const primaryGoalId = state.current_state.primary_goal_id;
    const primaryActionId = state.current_state.primary_next_action_id;

    assert.ok(primaryGoalId);
    assert.ok(primaryActionId);
    assert.ok(state.goals.some((goal) => goal.id === primaryGoalId));
    assert.ok(state.next_actions.some((action) => action.id === primaryActionId));
  });

  it("passes validateProjectState", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);
    const validation = validateProjectState(state);

    assert.equal(validation.valid, true);
  });

  it("saveProject makes project visible in listProjects", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    saveProject(state, { storageDir: tempDir });
    const projectIds = listProjects({ storageDir: tempDir });

    assert.ok(projectIds.includes(state.project.id));
  });

  it("runStudioBriefPipeline does not throw", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);

    assert.doesNotThrow(() => runStudioBriefPipeline({ project_states: [state] }));
  });

  it("cmdIntake saves project and returns metadata", () => {
    const stdout: string[] = [];
    const result = cmdIntake(
      ["--file", SAMPLE_SEED_PATH],
      {
        storageDir: tempDir,
        writeOut: (message: string) => stdout.push(message),
        writeErr: () => {},
      }
    );

    assert.equal(result.saved, true);
    assert.match(result.project_id, /^[0-9a-f-]{36}$/);
    assert.equal(result.title, "仮説型コンテンツ実験 v0.1");
    assert.ok(result.primary_next_action_title.includes("動画テーマを1つ決める"));
    assert.ok(listProjects({ storageDir: tempDir }).includes(result.project_id));
    assert.ok(stdout.some((line) => line.includes("project_id:")));
  });

  it("cmdIntake --dry-run does not save", () => {
    const result = cmdIntake(
      ["--file", SAMPLE_SEED_PATH, "--dry-run"],
      {
        storageDir: tempDir,
        writeOut: () => {},
        writeErr: () => {},
      }
    );

    assert.equal(result.saved, false);
    assert.equal(listProjects({ storageDir: tempDir }).length, 0);
  });

  it("validateExperimentSeed rejects invalid kind", () => {
    assert.throws(
      () =>
        validateExperimentSeed({
          kind: "invalid",
          title: "Test",
          description: "Test description",
        }),
      /kind must be one of/
    );
  });

  it("completing first next_action makes second action eligible primary", () => {
    const raw = JSON.parse(readFileSync(SAMPLE_SEED_PATH, "utf8"));
    const seed = validateExperimentSeed(raw);
    const state = createProjectFromExperimentSeed(seed);
    const actions = [...state.next_actions].sort((a, b) => a.sort_order - b.sort_order);
    const firstAction = actions[0];
    const secondAction = actions[1];

    assert.ok(firstAction);
    assert.ok(secondAction);
    assert.equal(secondAction.depends_on_action_id, firstAction.id);

    const updated = applyPatch(state, {
      schema_version: "0.1.1",
      project_id: state.project.id,
      source: "manual",
      operations: [
        {
          op: "status_change",
          entity: "next_action",
          entity_id: firstAction.id,
          status: "done",
        },
        {
          op: "upsert",
          entity: "current_state",
          entity_id: state.current_state.id,
          payload: {
            primary_next_action_id: secondAction.id,
            summary: "動画テーマを決定。次は視聴者への約束を1行で書く。",
          },
        },
      ],
    });

    const completed = updated.next_actions.find((action) => action.id === firstAction.id);
    const next = updated.next_actions.find((action) => action.id === secondAction.id);

    assert.equal(completed?.status, "done");
    assert.equal(updated.current_state.primary_next_action_id, secondAction.id);
    assert.equal(next?.status, "pending");

    const report = ruleDirector.recommend({ project_state: updated });
    assert.equal(report.recommendation.primary_recommendation.entity_id, secondAction.id);
    assert.equal(report.recommendation.primary_recommendation.eligible_for_primary, true);

    assert.doesNotThrow(() => runStudioBriefPipeline({ project_states: [updated] }));
    const validation = validateProjectState(updated);
    assert.equal(validation.valid, true);
  });
});

describe("Multi-Seed Samples", () => {
  for (const sample of MULTI_SEED_SAMPLES) {
    it(`${sample.file} is a valid seed and converts to ProjectState`, () => {
      const seed = loadSeedFromExamples(sample.file);
      assert.equal(seed.kind, sample.kind);

      const state = createProjectFromExperimentSeed(seed);

      assert.ok(state.project.tags?.includes("experiment"));
      assert.ok(state.project.tags?.includes(sample.expectedTag));
      assert.ok(state.next_actions.length >= 1);

      const intake = state.extensions.intake as Record<string, unknown>;
      assert.deepEqual(intake.risks, seed.risks);
      assert.deepEqual(intake.assumptions, seed.assumptions);
      assert.equal(state.blockers.length, 0);

      for (const assumption of seed.assumptions ?? []) {
        assert.ok(!state.hypotheses.some((h) => h.statement === assumption));
      }
      for (const statement of seed.initial_hypotheses ?? []) {
        assert.ok(state.hypotheses.some((h) => h.statement === statement));
      }

      const primaryAction = state.next_actions.find(
        (action) => action.id === state.current_state.primary_next_action_id
      );
      assert.equal(primaryAction?.title, sample.expectedFirstAction);

      const validation = validateProjectState(state);
      assert.equal(validation.valid, true);
    });
  }
});

describe("Action intent metadata v0.4.11", () => {
  const baseSeed = {
    kind: "content" as const,
    title: "Intent test",
    description: "Intent test description",
    initial_next_actions: ["Action A", "Action B"],
  };

  it("seed without action_intents still creates valid ProjectState", () => {
    const seed = validateExperimentSeed(baseSeed);
    const state = createProjectFromExperimentSeed(seed);
    const intake = state.extensions.intake as Record<string, unknown>;

    assert.equal(intake.action_intents, undefined);
    assert.equal(validateProjectState(state).valid, true);
  });

  it("stores action_intents on extensions.intake with linked action_id", () => {
    const seed = validateExperimentSeed({
      ...baseSeed,
      action_intents: [
        { action_index: 0, intent: "decision", rationale: "first action" },
        { action_index: 1, intent: "deep_work" },
      ],
    });
    const state = createProjectFromExperimentSeed(seed);
    const intake = state.extensions.intake as {
      action_intents?: Array<{
        action_id: string;
        action_title: string;
        action_index: number;
        intent: string;
        rationale?: string;
        source: string;
      }>;
    };

    assert.ok(intake.action_intents);
    assert.equal(intake.action_intents.length, 2);

    const sorted = [...state.next_actions].sort((a, b) => a.sort_order - b.sort_order);
    const first = intake.action_intents.find((entry) => entry.action_index === 0);
    const second = intake.action_intents.find((entry) => entry.action_index === 1);

    assert.equal(first?.action_id, sorted[0]?.id);
    assert.equal(first?.action_title, "Action A");
    assert.equal(first?.intent, "decision");
    assert.equal(first?.rationale, "first action");
    assert.equal(first?.source, "seed");
    assert.equal(second?.action_id, sorted[1]?.id);
    assert.equal(second?.action_title, "Action B");
    assert.equal(second?.intent, "deep_work");
  });

  it("rejects unknown intent", () => {
    assert.throws(
      () =>
        validateExperimentSeed({
          ...baseSeed,
          action_intents: [{ action_index: 0, intent: "deepwork" }],
        }),
      /intent must be one of/
    );
  });

  it("rejects action_index out of range", () => {
    assert.throws(
      () =>
        validateExperimentSeed({
          ...baseSeed,
          action_intents: [{ action_index: 999, intent: "decision" }],
        }),
      /out of range/
    );
  });

  it("rejects duplicate action_index", () => {
    assert.throws(
      () =>
        validateExperimentSeed({
          ...baseSeed,
          action_intents: [
            { action_index: 0, intent: "decision" },
            { action_index: 0, intent: "design" },
          ],
        }),
      /duplicate action_index/
    );
  });

  it("multi-seed samples validate with action_intents", () => {
    for (const sample of MULTI_SEED_SAMPLES) {
      const seed = loadSeedFromExamples(sample.file);
      assert.ok(seed.action_intents && seed.action_intents.length > 0);

      const state = createProjectFromExperimentSeed(seed);
      const intake = state.extensions.intake as {
        action_intents?: Array<{ action_id: string; intent: string }>;
      };

      assert.ok(intake.action_intents);
      assert.equal(intake.action_intents.length, seed.action_intents?.length);

      for (const record of intake.action_intents) {
        assert.ok(state.next_actions.some((action) => action.id === record.action_id));
      }
    }
  });

  it("research sample includes deep_work intent", () => {
    const seed = loadSeedFromExamples("research-sample.json");
    const state = createProjectFromExperimentSeed(seed);
    const intake = state.extensions.intake as {
      action_intents?: Array<{ intent: string }>;
    };

    assert.ok(intake.action_intents?.some((entry) => entry.intent === "deep_work"));
  });
});
