import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { buildAvailabilityEvidenceContract } from "../reality/contribution-availability-applicability-core.js";
import { composeContributionQuantityAvailabilityEvidence, resolveContributionAvailabilityReference } from "../reality/contribution-availability-composition-core.js";
import { at, quantity, declare, currentAvailability } from "./fixtures/contribution-availability.js";

function setup(options: Parameters<typeof currentAvailability>[0] = {}) {
  const q = quantity(), current = currentAvailability(options);
  const declaration = declare(q, buildAvailabilityEvidenceContract(current.policy!));
  return { quantity_evaluation_state: q, applicability_declaration: declaration, current_availability_evidence_state_set: current.states };
}

describe("Contribution-contextual independent quantity and availability evidence", () => {
  it("preserves exact three dimensions and complete upstream references", () => {
    const input = setup(), before = structuredClone(input);
    const result = composeContributionQuantityAvailabilityEvidence(input);
    const c = result.composition!;
    assert.ok(c);
    assert.strictEqual(c.quantity_evaluation_state, input.quantity_evaluation_state);
    assert.strictEqual(c.capacity_compatibility_dimension, input.quantity_evaluation_state.capacity_compatibility_dimension);
    assert.strictEqual(c.required_amount_compatibility_dimension, input.quantity_evaluation_state.required_amount_compatibility_dimension);
    assert.strictEqual(c.availability_evidence_dimension, input.current_availability_evidence_state_set.resource_assessments[0]!.canonical_state);
    assert.strictEqual(c.availability_reference_assessment.current_availability_evidence_state_set, input.current_availability_evidence_state_set);
    assert.deepEqual(input, before);
    assert.deepEqual(composeContributionQuantityAvailabilityEvidence(structuredClone(input)), result);
    for (const field of ["result", "is_overall_resolved", "ready", "can_execute", "overall_supporting"]) assert.equal(field in c, false);
  });
  it("source evidence updates reuse the same declaration but change composition identity", () => {
    const input = setup();
    const first = composeContributionQuantityAvailabilityEvidence(input).composition!;
    const second = composeContributionQuantityAvailabilityEvidence({ ...input, current_availability_evidence_state_set: currentAvailability({ status: "UNAVAILABLE" }).states }).composition!;
    assert.strictEqual(first.applicability_declaration, second.applicability_declaration);
    assert.notEqual(first.key, second.key);
    assert.match(first.availability_evidence_dimension.value, /SUPPORTING$/);
    assert.match(second.availability_evidence_dimension.value, /CONTRADICTING$/);
  });
  it("inverted UNAVAILABLE→SUPPORTING remains evidence, not physical availability", () => {
    const c = composeContributionQuantityAvailabilityEvidence(setup({ inverted: true, status: "UNAVAILABLE" })).composition!;
    assert.match(c.availability_evidence_dimension.value, /SUPPORTING$/);
    assert.equal(c.capacity_compatibility_dimension.category, "SUPPORTING");
    assert.equal(c.required_amount_compatibility_dimension.category, "SUPPORTING");
    assert.equal("ready" in c, false);
  });
  it("missing selected source preserves unresolved evidence without negative scalarization", () => {
    const c = composeContributionQuantityAvailabilityEvidence(setup({ missing: true })).composition!;
    assert.match(c.availability_evidence_dimension.value, /UNRESOLVED_NO_CURRENT/);
    assert.equal(c.capacity_compatibility_dimension.category, "SUPPORTING");
  });
  it("explicit empty interpretation policy is a contract with unresolved mapping evidence", () => {
    const c = composeContributionQuantityAvailabilityEvidence(setup({ emptyMappings: true })).composition!;
    assert.match(c.availability_evidence_dimension.value, /MAPPING_FOR_CURRENT_RESULT$/);
  });
  it("null canonical State time uses exact upstream Set time without rewriting the State", () => {
    const input = setup({ noReadiness: true });
    const result = composeContributionQuantityAvailabilityEvidence(input);
    assert.equal(result.availability_reference_assessment.evaluation_at, at);
    assert.equal(result.composition!.availability_evidence_dimension.evaluation_at, null);
    assert.match(result.composition!.availability_evidence_dimension.value, /UNRESOLVED_NO_EXPLICIT.*READINESS_POLICY/);
  });
  it("missing interpretation contract prevents composition without destroying 187 evidence", () => {
    const input = setup(), current = currentAvailability({ noInterpretation: true }).states;
    const result = composeContributionQuantityAvailabilityEvidence({ ...input, current_availability_evidence_state_set: current });
    assert.equal(result.composition, null);
    assert.equal(result.availability_reference_assessment.status, "NO_CURRENT_INTERPRETATION_CONTRACT");
    assert.equal(current.canonical_states.length, 1);
  });
  it("changed interpretation or aggregation contracts cannot reuse applicability", () => {
    const input = setup();
    for (const options of [{ inverted: true }, { operator: "ALL" as const }]) {
      const result = composeContributionQuantityAvailabilityEvidence({ ...input, current_availability_evidence_state_set: currentAvailability(options).states });
      assert.equal(result.composition, null);
      assert.equal(result.availability_reference_assessment.status, "CURRENT_AVAILABILITY_CONTRACT_MISMATCH");
    }
  });
  it("rejects a different evaluation instant, including when canonical State time is null", () => {
    const input = setup();
    for (const noReadiness of [false, true]) {
      assert.throws(() => composeContributionQuantityAvailabilityEvidence({ ...input, current_availability_evidence_state_set: currentAvailability({ noReadiness, evaluationAt: "2026-09-03T12:00:00.000Z" }).states }), /evaluation_at mismatch/);
    }
  });
  it("absence of the resource assessment does not fabricate evidence", () => {
    const input = setup(), set = structuredClone(input.current_availability_evidence_state_set);
    set.resource_assessments = [];
    set.canonical_states = [];
    const result = composeContributionQuantityAvailabilityEvidence({ ...input, current_availability_evidence_state_set: set });
    assert.equal(result.composition, null);
    assert.equal(result.availability_reference_assessment.status, "NO_CURRENT_RESOURCE_EVIDENCE_ASSESSMENT");
  });
  it("rejects duplicate resources rather than selecting first/latest", () => {
    const input = setup(), set = structuredClone(input.current_availability_evidence_state_set);
    set.resource_assessments.push(structuredClone(set.resource_assessments[0]!));
    assert.throws(() => resolveContributionAvailabilityReference({ ...input, current_availability_evidence_state_set: set }), /Duplicate/);
  });
  it("rejects detached declaration and quantity contexts", () => {
    const input = setup();
    assert.throws(() => composeContributionQuantityAvailabilityEvidence({ ...input, quantity_evaluation_state: { ...input.quantity_evaluation_state, physical_potential_contribution_declaration_key: "other" } }), /context/);
    assert.throws(() => resolveContributionAvailabilityReference({ ...input, applicability_declaration: { ...input.applicability_declaration, key: "forged" } }), /identity mismatch/);
  });
  it("quantity evidence updates change composition, not declaration", () => {
    const input = setup(), q = structuredClone(input.quantity_evaluation_state);
    q.key = "new-quantity-lineage";
    q.required_amount_compatibility_dimension.canonical_required_amount_compatibility_evidence_state_key = "new-required-lineage";
    const first = composeContributionQuantityAvailabilityEvidence(input).composition!;
    const second = composeContributionQuantityAvailabilityEvidence({ ...input, quantity_evaluation_state: q }).composition!;
    assert.notEqual(first.key, second.key);
    assert.strictEqual(first.applicability_declaration, second.applicability_declaration);
  });
  it("runtime does not invoke availability builders, raw matching, reservation or feasibility", () => {
    const core = readFileSync(new URL("../reality/contribution-availability-composition-core.ts", import.meta.url), "utf8");
    assert.doesNotMatch(core, /buildDeclaredResourceAvailability|isResourceAvailabilityActiveAt|applyPatch|saveProject/);
    assert.doesNotMatch(core, /from .*resource-reservation|from .*feasibility/);
  });
});
