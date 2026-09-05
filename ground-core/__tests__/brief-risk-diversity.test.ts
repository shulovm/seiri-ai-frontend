import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { createProjectFromExperimentSeed } from "../intake/create-project-from-seed.js";
import { validateExperimentSeed } from "../intake/validate-seed.js";
import {
  mapRiskBriefs,
  selectDiverseRiskWarnings,
} from "../studio/brief-formatters.js";
import type { StudioRiskWarningSource } from "../studio/brief-types.js";
import { renderStudioBrief } from "../studio/brief-renderer.js";
import {
  formatStudioBriefText,
  runStudioBriefPipeline,
} from "../studio/studio-brief.js";
import type { ProjectState } from "../types.js";
import { buildFreeWaterPhase0Fixture } from "./fixtures.js";

const SEED_DIR = join(process.cwd(), "ground-core/examples/experiment-seeds");
const FREEWATER_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";

function loadExperimentSeed(filename: string) {
  const raw = JSON.parse(readFileSync(join(SEED_DIR, filename), "utf8"));
  return createProjectFromExperimentSeed(validateExperimentSeed(raw));
}

function loadFixture(_project: "freewater"): ProjectState {
  return buildFreeWaterPhase0Fixture();
}

function observationGap(projectId: string, title: string): StudioRiskWarningSource {
  return {
    kind: "observation_gap",
    severity: "high",
    message: `${title} — 30 日以内の observation がない — 判断材料不足`,
    entity_type: "project",
    entity_id: projectId,
    project_id: projectId,
    project_title: title,
    mitigation_messages: ["判断材料不足"],
  };
}

describe("Risk signal diversity v0.4.4", () => {
  it("aggregates multiple observation_gap warnings into one slot", () => {
    const warnings: StudioRiskWarningSource[] = [
      observationGap("p1", "Business"),
      observationGap("p2", "Research"),
      observationGap("p3", "Product"),
      {
        kind: "untested_hypothesis",
        severity: "medium",
        message: "Primary hypothesis",
        entity_type: "hypothesis",
        entity_id: "h1",
        project_id: "p1",
        project_title: "Business",
        mitigation_messages: ["検証観測が未実施"],
      },
    ];

    const selected = selectDiverseRiskWarnings(warnings, 3, "p1");

    assert.equal(selected.filter((entry) => entry.kind === "observation_gap").length, 1);
    assert.match(selected[0]?.message ?? "", /3 projects — 30日以内の observation がない/);
    assert.ok(selected.some((entry) => entry.kind === "untested_hypothesis"));
  });

  it("prefers blocker_pressure over observation_gap", () => {
    const warnings: StudioRiskWarningSource[] = [
      observationGap("p1", "Business"),
      {
        kind: "blocker_pressure",
        severity: "high",
        message: "Business — open blocker severity high",
        entity_type: "project",
        entity_id: "p1",
        project_id: "p1",
        project_title: "Business",
        mitigation_messages: ["open blocker severity high"],
      },
    ];

    const selected = selectDiverseRiskWarnings(warnings, 2, "p1");

    assert.equal(selected[0]?.kind, "blocker_pressure");
    assert.ok(selected.some((entry) => entry.kind === "observation_gap"));
  });

  it("multi-seed portfolio brief diversifies RISKS", () => {
    const business = loadExperimentSeed("business-sample.json");
    const research = loadExperimentSeed("research-sample.json");
    const product = loadExperimentSeed("product-sample.json");

    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
    });
    const risks = result.brief.risk_briefs;
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");

    assert.ok(risks.length <= 3);
    assert.equal(risks.filter((entry) => entry.kind === "observation_gap").length, 1);
    assert.match(risks[0]?.message ?? "", /3 projects — 30日以内の observation がない/);
    assert.ok(risks.some((entry) => entry.kind === "untested_hypothesis"));
    assert.doesNotMatch(text, /observation_gap \(high\).*observation_gap \(high\).*observation_gap \(high\)/);
  });

  it("freewater fixture keeps diverse risk kinds in renderer path", () => {
    const freewater = loadFixture("freewater");
    const result = runStudioBriefPipeline({ project_states: [freewater] });
    const brief = renderStudioBrief({
      report: result.renderer_report,
      brief_type: "morning",
    });
    const risks = mapRiskBriefs(result.renderer_report, 3);

    assert.ok(risks.length >= 1);
    assert.ok(risks.every((entry) => entry.message.trim().length > 0));
    assert.ok(brief.risk_briefs.length >= 1);
  });
});
