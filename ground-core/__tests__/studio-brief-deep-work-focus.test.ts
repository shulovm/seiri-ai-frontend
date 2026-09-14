import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { recommendPortfolioFromInput } from "../director/portfolio-director.js";
import { ruleDirector } from "../director/rule-director.js";
import { createProjectFromExperimentSeed } from "../intake/create-project-from-seed.js";
import { validateExperimentSeed } from "../intake/validate-seed.js";
import { buildCompleteActionPatch } from "../session/build-complete-action-patch.js";
import { applyPatch } from "../state-engine.js";
import {
  formatStudioBriefText,
  runStudioBriefPipeline,
} from "../studio/studio-brief.js";
import type { ProjectState } from "../types.js";

const SEED_DIR = join(process.cwd(), "ground-core/examples/experiment-seeds");

function loadExperimentSeed(filename: string) {
  const raw = JSON.parse(readFileSync(join(SEED_DIR, filename), "utf8"));
  return createProjectFromExperimentSeed(validateExperimentSeed(raw));
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
    observation_body: "初回は人通りの多さだけでなく、配布行為が自然に見える場所を優先する。",
    summary: "検証場所候補を3つに絞った。次は配布する対象物と数量を決める。",
  });
  business = applyPatch(business, patch);

  return { business, research, product };
}

describe("Studio brief deep work focus narrative v0.4.12", () => {
  it("deep-work brief text shows deep_work_focus reason under TODAY", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();
    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
      brief_type: "deep-work",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "deep-work");

    assert.match(text, /関連分野を5つに分類する/);
    assert.match(text, /deep-work focus — 集中作業向きのAction intentが指定されています \(\+0\.03\)/);
    assert.equal(
      result.brief.primary_focus.mode_context_note?.includes("deep-work focus"),
      true
    );
  });

  it("deep-work headline uses focus context when mode_context_note present", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();
    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
      brief_type: "deep-work",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "deep-work");

    assert.match(text, /Deep Work Brief — 集中価値の高いActionを優先/);
  });

  it("morning brief does not show deep-work focus reason", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();
    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
      brief_type: "morning",
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");

    assert.equal(text.includes("deep-work focus"), false);
    assert.equal(result.brief.primary_focus.mode_context_note, undefined);
  });

  it("session brief does not show deep-work focus reason", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();
    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
      brief_type: "session",
      session_focus_project_id: business.project.id,
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "session");

    assert.match(text, /session focus/);
    assert.equal(text.includes("deep-work focus"), false);
  });

  it("recommend-portfolio JSON includes deep_work_focus for deep-work mode", () => {
    const { business, research, product } = loadPatchedMixedPortfolioV045();
    const report = recommendPortfolioFromInput({
      project_states: [business, research, product],
      director_reports: [business, research, product].map((state) =>
        ruleDirector.recommend({ project_state: state })
      ),
      options: { brief_type: "deep-work" },
    });

    assert.ok(
      report.primary_recommendation.reasons.some((reason) => reason.kind === "deep_work_focus")
    );
  });
});
