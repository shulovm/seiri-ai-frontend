import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { createProjectFromExperimentSeed } from "../intake/create-project-from-seed.js";
import { validateExperimentSeed } from "../intake/validate-seed.js";
import {
  formatStudioBriefText,
  runStudioBriefPipeline,
} from "../studio/studio-brief.js";
import { validateProjectState } from "../validate.js";

const SEED_PATH = join(
  process.cwd(),
  "ground-core/examples/experiment-seeds/moshimo-first-episode.v0.1.0.json"
);

const EXPECTED_TITLE = "もしも動画 1本目制作";
const PRIMARY_ACTION = "第1本目のテーマを1つ決める";
const DEEP_WORK_TITLES = ["60秒構成を作る", "6〜8カットに分解する", "ナレーション台本を書く"];

function loadSeed() {
  const raw = JSON.parse(readFileSync(SEED_PATH, "utf8"));
  return validateExperimentSeed(raw);
}

describe("Moshimo First Episode Seed v0.1.0 — Production Run 01", () => {
  it("validates seed file", () => {
    const seed = loadSeed();
    assert.equal(seed.title, EXPECTED_TITLE);
    assert.equal(seed.kind, "content");
    assert.equal(seed.initial_next_actions?.length, 11);
    assert.equal(seed.action_intents?.length, 11);
  });

  it("creates valid ProjectState with correct structure", () => {
    const seed = loadSeed();
    const state = createProjectFromExperimentSeed(seed);

    assert.equal(validateProjectState(state).valid, true);
    assert.equal(state.project.title, EXPECTED_TITLE);
    assert.equal(state.next_actions.length, 11);
    assert.equal(state.blockers.length, 0);

    const primary = state.next_actions.find(
      (action) => action.id === state.current_state.primary_next_action_id
    );
    assert.equal(primary?.title, PRIMARY_ACTION);

    const intake = state.extensions.intake as {
      assumptions?: string[];
      risks?: string[];
      action_intents?: Array<{ action_index: number; intent: string; action_title: string }>;
    };

    assert.equal(intake.assumptions?.length, 3);
    assert.equal(intake.risks?.length, 3);
    assert.ok(intake.action_intents);
    assert.equal(intake.action_intents.length, 11);

    for (const index of [2, 4, 6]) {
      const record: { action_index: number; intent: string; action_title: string } | undefined =
        intake.action_intents.find((entry) => entry.action_index === index);
      assert.equal(record?.intent, "deep_work", `index ${index} should be deep_work`);
    }

    assert.equal(
      state.hypotheses.some((entry) => entry.statement.includes("もしも〇〇だったら")),
      true
    );
    assert.equal(
      state.hypotheses.some((entry) =>
        intake.assumptions?.some((assumption) => assumption === entry.statement)
      ),
      false
    );
    assert.equal(
      state.blockers.some((blocker) =>
        intake.risks?.some((risk) => risk === blocker.title)
      ),
      false
    );
  });

  it("session brief TODAY shows primary theme decision action", () => {
    const state = createProjectFromExperimentSeed(loadSeed());
    const result = runStudioBriefPipeline({
      project_states: [state],
      brief_type: "session",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "session");

    assert.equal(result.brief.primary_focus.action_title, PRIMARY_ACTION);
    assert.match(text, new RegExp(PRIMARY_ACTION));
  });

  it("deep-work stores downstream deep_work candidates in action_intents", () => {
    const state = createProjectFromExperimentSeed(loadSeed());
    const intake = state.extensions.intake as {
      action_intents?: Array<{ intent: string; action_title: string }>;
    };

    for (const title of DEEP_WORK_TITLES) {
      assert.ok(
        intake.action_intents?.some(
          (entry) => entry.intent === "deep_work" && entry.action_title === title
        ),
        `expected deep_work intent on "${title}"`
      );
    }

    const result = runStudioBriefPipeline({
      project_states: [state],
      brief_type: "deep-work",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "deep-work");

    assert.equal(result.brief.primary_focus.action_title, PRIMARY_ACTION);
    const candidateNote = result.brief.flow_note_items.find(
      (item) => item.note_kind === "deep_work_candidate"
    );
    assert.ok(candidateNote, "expected at least one deep_work_candidate FLOW NOTE");
    assert.match(candidateNote.reason_summary, /60秒構成を作る|6〜8カットに分解する|ナレーション台本を書く/);
  });
});
