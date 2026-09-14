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
import type { ActionIntentRecord } from "../intake/types.js";
import type { ProjectState } from "../types.js";

const SEED_DIR = join(process.cwd(), "ground-core/examples/experiment-seeds");

function loadExperimentSeed(filename: string) {
  const raw = JSON.parse(readFileSync(join(SEED_DIR, filename), "utf8"));
  return createProjectFromExperimentSeed(validateExperimentSeed(raw));
}

function loadMixedPortfolio() {
  return {
    business: loadExperimentSeed("business-sample.json"),
    research: loadExperimentSeed("research-sample.json"),
    product: loadExperimentSeed("product-sample.json"),
  };
}

function markDeepWorkActionDone(state: ProjectState): ProjectState {
  const intake = state.extensions.intake as { action_intents?: ActionIntentRecord[] };
  const deepWork = intake.action_intents?.find((entry) => entry.intent === "deep_work");
  if (!deepWork) {
    throw new Error("fixture missing deep_work intent");
  }

  return {
    ...state,
    next_actions: state.next_actions.map((action) =>
      action.id === deepWork.action_id ? { ...action, status: "done" as const } : action
    ),
  };
}

describe("Studio brief deep work candidate flow notes v0.4.14", () => {
  it("product deep-work shows non-primary deep_work_candidate in FLOW NOTES", () => {
    const product = loadExperimentSeed("product-sample.json");
    const result = runStudioBriefPipeline({
      project_states: [product],
      brief_type: "deep-work",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "deep-work");

    assert.match(text, /想定ユーザーを1人に絞る/);
    assert.match(text, /後続に deep-work 候補「1画面フローを文章で描く」があります/);
    assert.match(text, /\(deep_work_candidate\)/);
    assert.equal(result.brief.primary_focus.action_title, "想定ユーザーを1人に絞る");
  });

  it("mixed deep-work shows product candidate while research stays primary", () => {
    const { business, research, product } = loadMixedPortfolio();
    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
      brief_type: "deep-work",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "deep-work");

    assert.equal(result.brief.primary_focus.project_id, research.project.id);
    assert.match(text, /関連分野を5つに分類する/);
    assert.match(text, /deep-work focus — 集中作業向きのAction intentが指定されています/);
    assert.match(text, /後続に deep-work 候補「1画面フローを文章で描く」があります/);
    assert.doesNotMatch(text, /後続に deep-work 候補「関連分野を5つに分類する」/);
  });

  it("morning does not show deep_work_candidate notes", () => {
    const { business, research, product } = loadMixedPortfolio();
    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
      brief_type: "morning",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");

    assert.equal(
      result.brief.flow_note_items.some((item) => item.note_kind === "deep_work_candidate"),
      false
    );
    assert.equal(text.includes("deep_work_candidate"), false);
  });

  it("session does not show deep_work_candidate notes", () => {
    const { business, research, product } = loadMixedPortfolio();
    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
      brief_type: "session",
      session_focus_project_id: business.project.id,
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "session");

    assert.equal(
      result.brief.flow_note_items.some((item) => item.note_kind === "deep_work_candidate"),
      false
    );
    assert.equal(text.includes("deep_work_candidate"), false);
  });

  it("primary deep_work is not duplicated as FLOW NOTES candidate", () => {
    const research = loadExperimentSeed("research-sample.json");
    const result = runStudioBriefPipeline({
      project_states: [research],
      brief_type: "deep-work",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "deep-work");

    assert.match(text, /deep-work focus/);
    assert.equal(
      result.brief.flow_note_items.some((item) => item.note_kind === "deep_work_candidate"),
      false
    );
  });

  it("done non-primary deep_work action is not shown as candidate", () => {
    const product = markDeepWorkActionDone(loadExperimentSeed("product-sample.json"));
    const result = runStudioBriefPipeline({
      project_states: [product],
      brief_type: "deep-work",
    });

    assert.equal(
      result.brief.flow_note_items.some((item) => item.note_kind === "deep_work_candidate"),
      false
    );
  });
});
