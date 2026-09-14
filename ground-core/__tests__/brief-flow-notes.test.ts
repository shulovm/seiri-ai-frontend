import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { createProjectFromExperimentSeed } from "../intake/create-project-from-seed.js";
import { validateExperimentSeed } from "../intake/validate-seed.js";
import { mapBlockedItems, mapFlowNoteItems } from "../studio/brief-formatters.js";
import { renderStudioBrief } from "../studio/brief-renderer.js";
import type { StudioReport } from "../studio/brief-types.js";
import {
  formatStudioBriefText,
  runStudioBriefPipeline,
} from "../studio/studio-brief.js";

const SEED_DIR = join(process.cwd(), "ground-core/examples/experiment-seeds");

function loadExperimentSeed(filename: string) {
  const raw = JSON.parse(readFileSync(join(SEED_DIR, filename), "utf8"));
  return createProjectFromExperimentSeed(validateExperimentSeed(raw));
}

function buildUnlockOnlyReport(): StudioReport {
  return {
    schema_version: "0.5.0",
    engine: "test",
    generated_at: "2026-06-20T00:00:00.000Z",
    portfolio_primary: {
      project_id: "p1",
      project_title: "Test Project",
      next_action_id: "a1",
      next_action_label: "First action",
      confidence: 0.7,
      reasons: [{ kind: "director_primary", message: "test", weight: 1 }],
      why_not_alternatives: [],
    },
    today_focus: {
      primary: {
        project_id: "p1",
        project_title: "Test Project",
        action_id: "a1",
        action_title: "First action",
        confidence: 0.7,
        reason_messages: ["test"],
      },
      alternatives: [],
    },
    priority_stack: { alternatives: [] },
    flow_proposal: { steps: [] },
    at_risk_projects: [],
    growing_projects: [],
    explicit_deferrals: [],
    risk_warnings: [],
    decision_brief: { active_decisions: [] },
    portfolio_alignment: {
      primary_project_id: "p1",
      primary_action_id: "a1",
      alignment: "identical",
      note: "test",
    },
    cross_project_bottlenecks: [
      {
        project_id: "p1",
        project_title: "Test Project",
        next_action_id: "a1",
        next_action_title: "First action",
        blocker_title: null,
        blocker_severity: null,
        reason_messages: ["downstream 解放 1 件"],
      },
    ],
    confidence: 0.7,
    requires_human_decision: true,
  };
}

describe("Brief flow notes v0.4.3", () => {
  it("does not put cross_project_bottlenecks into blocked_items", () => {
    const report = buildUnlockOnlyReport();
    const blocked = mapBlockedItems(report, 3);
    const flowNotes = mapFlowNoteItems(report, 3);

    assert.equal(blocked.length, 0);
    assert.equal(flowNotes.length, 1);
    assert.equal(flowNotes[0]?.note_kind, "unlock");
    assert.match(flowNotes[0]?.reason_summary ?? "", /後続actionを1件解放/);
  });

  it("unlock flow note does not use (blocked) label", () => {
    const report = buildUnlockOnlyReport();
    const brief = renderStudioBrief({ report, brief_type: "morning" });

    assert.equal(brief.blocked_items.length, 0);
    assert.equal(brief.flow_note_items.length, 1);
    assert.equal(brief.flow_note_items[0]?.note_kind, "unlock");
  });

  it("at_risk open blocker stays in blocked_items", () => {
    const report = buildUnlockOnlyReport();
    report.at_risk_projects.push({
      project_id: "p2",
      project_title: "Blocked Project",
      health_status: "blocked",
      blocker_title: "素材未確保",
      blocked_action_title: "Blocked action",
      blocker_severity: "high",
      reason_messages: ['open blocker「素材未確保」severity high'],
    });

    const blocked = mapBlockedItems(report, 3);
    assert.equal(blocked.length, 1);
    assert.equal(blocked[0]?.status, "blocked");
    assert.equal(blocked[0]?.blocker_title, "素材未確保");
  });

  it("multi-seed portfolio brief has FLOW NOTES not false blocked", () => {
    const business = loadExperimentSeed("business-sample.json");
    const research = loadExperimentSeed("research-sample.json");
    const product = loadExperimentSeed("product-sample.json");

    const result = runStudioBriefPipeline({
      project_states: [business, research, product],
    });
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");

    assert.match(text, /FLOW NOTES/);
    assert.match(text, /\(unlock\)/);
    assert.doesNotMatch(text, /\(blocked\) — downstream 解放/);

    for (const item of result.brief.blocked_items) {
      assert.notEqual(item.reason_summary.includes("downstream 解放"), true);
    }

    assert.ok(result.brief.flow_note_items.length >= 1);
  });
});
