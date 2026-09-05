import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MODE_GOLDEN,
  loadModeGoldenPortfolio,
  modeGoldenOrder,
} from "./fixtures/mode-golden-fixtures.js";
import {
  formatStudioBriefText,
  runStudioBriefPipeline,
} from "../studio/studio-brief.js";
import type { StudioBrief } from "../studio/brief-types.js";

function runGoldenBrief(
  order: ReturnType<typeof modeGoldenOrder>,
  briefType: "morning" | "session" | "deep-work",
  sessionFocusProjectId?: string
) {
  return runStudioBriefPipeline({
    project_states: order,
    brief_type: briefType,
    session_focus_project_id: sessionFocusProjectId,
  });
}

function assertPrimaryFocus(
  brief: StudioBrief,
  projectTitle: string,
  actionTitle: string
): void {
  assert.ok(
    brief.primary_focus.project_title.includes(projectTitle),
    `expected primary project "${projectTitle}", got "${brief.primary_focus.project_title}"`
  );
  assert.equal(brief.primary_focus.action_title, actionTitle);
}

function assertNoDeepWorkCandidateNotes(brief: StudioBrief): void {
  assert.equal(
    brief.flow_note_items.some((item) => item.note_kind === "deep_work_candidate"),
    false
  );
}

describe("Mode Golden Fixtures v0.4.15", () => {
  const portfolio = loadModeGoldenPortfolio();
  const businessFirst = modeGoldenOrder(portfolio, "business-first");
  const researchFirst = modeGoldenOrder(portfolio, "research-first");

  it("morning keeps portfolio-wide primary without session/deep-work notes", () => {
    const result = runGoldenBrief(businessFirst, "morning");
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");

    assertPrimaryFocus(
      result.brief,
      MODE_GOLDEN.research.projectTitle,
      MODE_GOLDEN.research.primaryActionTitle
    );
    assert.equal(result.brief.primary_focus.mode_context_note, undefined);
    assert.equal(text.includes("session focus"), false);
    assert.equal(text.includes("deep-work focus"), false);
    assertNoDeepWorkCandidateNotes(result.brief);
    assert.equal(result.brief.blocked_items.length, 0);
  });

  it("session explicit focus continues business context", () => {
    const result = runGoldenBrief(
      businessFirst,
      "session",
      portfolio.business.project.id
    );
    const text = formatStudioBriefText(result.brief, result.narrative, "session");

    assertPrimaryFocus(
      result.brief,
      MODE_GOLDEN.business.projectTitle,
      MODE_GOLDEN.business.primaryActionTitle
    );
    assert.match(
      result.brief.primary_focus.mode_context_note ?? "",
      /session focus — explicit focus project \(\+0\.03\)/
    );
    assert.equal(text.includes("deep-work focus"), false);
    assertNoDeepWorkCandidateNotes(result.brief);
  });

  it("session fallback uses first project as light focus", () => {
    const result = runGoldenBrief(businessFirst, "session");
    const text = formatStudioBriefText(result.brief, result.narrative, "session");

    assertPrimaryFocus(
      result.brief,
      MODE_GOLDEN.business.projectTitle,
      MODE_GOLDEN.business.primaryActionTitle
    );
    assert.match(
      result.brief.primary_focus.mode_context_note ?? "",
      /session focus — first project fallback \(\+0\.02\)/
    );
    assert.equal(text.includes("deep-work focus"), false);
    assertNoDeepWorkCandidateNotes(result.brief);
  });

  it("session fallback respects project order", () => {
    const result = runGoldenBrief(researchFirst, "session");
    const text = formatStudioBriefText(result.brief, result.narrative, "session");

    assertPrimaryFocus(
      result.brief,
      MODE_GOLDEN.research.projectTitle,
      MODE_GOLDEN.research.primaryActionTitle
    );
    assert.match(
      result.brief.primary_focus.mode_context_note ?? "",
      /session focus — first project fallback \(\+0\.02\)/
    );
    assert.equal(text.includes("deep-work focus"), false);
  });

  it("deep-work uses primary deep_work intent", () => {
    const result = runGoldenBrief(businessFirst, "deep-work");
    const text = formatStudioBriefText(result.brief, result.narrative, "deep-work");

    assertPrimaryFocus(
      result.brief,
      MODE_GOLDEN.research.projectTitle,
      MODE_GOLDEN.research.primaryActionTitle
    );
    assert.match(
      result.brief.primary_focus.mode_context_note ?? "",
      /deep-work focus — 集中作業向きのAction intentが指定されています \(\+0\.03\)/
    );
    assert.equal(text.includes("session focus"), false);
    assert.match(text, /Deep Work Brief — 集中価値の高いActionを優先/);
  });

  it("deep-work shows non-primary deep_work candidate in FLOW NOTES", () => {
    const result = runGoldenBrief(businessFirst, "deep-work");
    const text = formatStudioBriefText(result.brief, result.narrative, "deep-work");

    assert.notEqual(
      result.brief.primary_focus.project_title,
      MODE_GOLDEN.product.projectTitle
    );

    const candidate = result.brief.flow_note_items.find(
      (item) => item.note_kind === "deep_work_candidate"
    );
    assert.ok(candidate);
    assert.ok(candidate.project_title.includes(MODE_GOLDEN.product.projectTitle));
    assert.match(
      candidate.reason_summary,
      new RegExp(
        `後続に deep-work 候補「${MODE_GOLDEN.product.downstreamDeepWorkActionTitle}」があります`
      )
    );
    assert.match(text, /\(deep_work_candidate\)/);
    assert.doesNotMatch(
      text,
      new RegExp(
        `後続に deep-work 候補「${MODE_GOLDEN.research.primaryActionTitle}」`
      )
    );
  });

  it("morning and session do not show deep_work_candidate", () => {
    for (const briefType of ["morning", "session"] as const) {
      const result = runGoldenBrief(
        businessFirst,
        briefType,
        briefType === "session" ? portfolio.business.project.id : undefined
      );
      assertNoDeepWorkCandidateNotes(result.brief);
      const text = formatStudioBriefText(result.brief, result.narrative, briefType);
      assert.equal(text.includes("deep_work_candidate"), false);
    }
  });

  it("blocked section does not include flow notes", () => {
    const result = runGoldenBrief(businessFirst, "morning");
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");

    assert.equal(result.brief.blocked_items.length, 0);
    assert.match(text, /BLOCKED\n  \(none\)/);

    for (const item of result.brief.blocked_items) {
      assert.notEqual(item.reason_summary.includes("downstream 解放"), true);
      assert.notEqual(item.reason_summary.includes("deep-work 候補"), true);
    }

    for (const item of result.brief.flow_note_items) {
      assert.notEqual(item.note_kind, "blocked" as never);
    }
  });

  it("risks remain diverse on morning mixed portfolio", () => {
    const result = runGoldenBrief(businessFirst, "morning");
    const text = formatStudioBriefText(result.brief, result.narrative, "morning");
    const risksSection = text.split("RISKS")[1]?.split("FLOW")[0] ?? "";

    assert.match(risksSection, /observation_gap/);
    assert.match(risksSection, /2 projects — 30日以内の observation がない/);
    assert.match(risksSection, /untested_hypothesis/);
    assert.equal((risksSection.match(/observation_gap/g) ?? []).length, 1);
    assert.ok(result.brief.risk_briefs.length >= 2);
    assert.ok(result.brief.risk_briefs.some((entry) => entry.kind === "untested_hypothesis"));
  });
});
