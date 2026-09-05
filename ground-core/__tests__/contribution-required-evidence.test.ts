import test from "node:test";
import assert from "node:assert/strict";
import { declareContributionRequiredEvidence, assessContributionRequiredEvidence } from "../reality/contribution-required-evidence-core.js";
import type { ContributionEvidenceBinding, ContributionRequiredEvidenceDimension, ContributionRequiredEvidenceInput } from "../reality/contribution-required-evidence-types.js";
import { buildAvailabilityEvidenceContract, contributionAvailabilityContext } from "../reality/contribution-availability-applicability-core.js";
import { composeContributionQuantityAvailabilityEvidence } from "../reality/contribution-availability-composition-core.js";
import { quantity, currentAvailability, declare } from "./fixtures/contribution-availability.js";

const binding: ContributionEvidenceBinding = { key: "binding", candidate_key: "candidate", observation_need_key: "need",
  capability_requirement_set_key: "requirements", observation_resource_requirement_key: "requirement", resource_declaration_id: "r" };
const dims = ["CAPACITY_COMPATIBILITY", "REQUIRED_AMOUNT_COMPATIBILITY", "AVAILABILITY_EVIDENCE"] as const;
function declaration(required: readonly ContributionRequiredEvidenceDimension[] = dims) {
  return declareContributionRequiredEvidence({ binding, specification: { binding_key: binding.key, required_dimensions: required } });
}
function setup(required: readonly ContributionRequiredEvidenceDimension[] = dims, options: Parameters<typeof currentAvailability>[0] = {}) {
  const q = quantity();
  const current = currentAvailability(options);
  const contract = buildAvailabilityEvidenceContract(current.policy!);
  const applicability = declare(q, contract);
  const composition = composeContributionQuantityAvailabilityEvidence({ quantity_evaluation_state: q, applicability_declaration: applicability, current_availability_evidence_state_set: current.states });
  const input: ContributionRequiredEvidenceInput = { declaration: declaration(required), contribution_context: contributionAvailabilityContext(q),
    availability_evidence_contract: contract, quantity_evaluation_state: q, availability_reference_assessment: composition.availability_reference_assessment };
  return { input, q, contract, applicability, composition };
}
test("all independent positive operands covered, exact states and provenance retained", () => {
  const { input, q } = setup();
  const r = assessContributionRequiredEvidence(input);
  assert.deepEqual(r.summary, { required_count: 3, represented_count: 3, not_represented_count: 0,
    canonically_resolved_count: 3, canonically_unresolved_count: 0, canonically_not_applicable_count: 0 });
  assert.equal(r.required_dimension_assessments[0]!.operand, q.capacity_compatibility_dimension);
  assert.equal(r.required_dimension_assessments[1]!.operand, q.required_amount_compatibility_dimension);
  assert.equal(r.required_dimension_assessments[2]!.operand, input.availability_reference_assessment!.referenced_evidence_state);
  assert.equal(r.quantity_evaluation_state, q);
  assert.equal(r.availability_reference_assessment, input.availability_reference_assessment);
});
test("negative amount and availability remain covered and resolved without a proposition result", () => {
  const { input, q } = setup(dims, { status: "UNAVAILABLE" });
  q.required_amount_compatibility_dimension = { canonical_required_amount_compatibility_evidence_state_key: "negative",
    canonical_required_amount_compatibility_evidence_state_value: "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_CONTRADICTING", category: "CONTRADICTING" };
  const r = assessContributionRequiredEvidence(input);
  assert.equal(r.summary.represented_count, 3);
  assert.equal(r.summary.canonically_resolved_count, 3);
  assert.equal(r.required_dimension_assessments[1]!.operand, q.required_amount_compatibility_dimension);
  assert.deepEqual(Object.keys(r).sort(), [...Object.keys(input), "required_dimension_assessments", "summary"].sort());
});
test("negative capacity is independently covered and resolved", () => {
  const { input, q } = setup(["CAPACITY_COMPATIBILITY"]);
  q.capacity_compatibility_dimension.canonical_capacity_compatibility_evidence_state_value = "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_CONTRADICTING";
  q.capacity_compatibility_dimension.category = "CONTRADICTING";
  assert.equal(assessContributionRequiredEvidence(input).summary.canonically_resolved_count, 1);
});
test("unresolved amount is present and preserves its precise unresolved cause", () => {
  const { input, q } = setup(["REQUIRED_AMOUNT_COMPATIBILITY"]);
  q.required_amount_compatibility_dimension.canonical_required_amount_compatibility_evidence_state_value = "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED";
  q.required_amount_compatibility_dimension.category = "UNRESOLVED";
  const r = assessContributionRequiredEvidence(input);
  assert.equal(r.summary.represented_count, 1);
  assert.equal(r.summary.canonically_unresolved_count, 1);
  assert.equal(r.required_dimension_assessments[0]!.operand, q.required_amount_compatibility_dimension);
});
test("capacity NOT_APPLICABLE is covered and neither resolved nor unresolved", () => {
  const { input, q } = setup(["CAPACITY_COMPATIBILITY"]);
  q.capacity_compatibility_dimension.canonical_capacity_compatibility_evidence_state_value = "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY";
  q.capacity_compatibility_dimension.category = "NOT_APPLICABLE";
  const r = assessContributionRequiredEvidence(input);
  assert.equal(r.required_dimension_assessments[0]!.operand, q.capacity_compatibility_dimension);
  assert.deepEqual(r.required_dimension_assessments[0]!.canonical_classification, { is_applicable: false, is_resolved: false, is_unresolved: false });
  assert.equal(r.summary.canonically_not_applicable_count, 1);
  assert.equal(r.summary.not_represented_count, 0);
});
test("capacity unresolved is distinct from absent and NOT_APPLICABLE", () => {
  const { input, q } = setup(["CAPACITY_COMPATIBILITY"]);
  q.capacity_compatibility_dimension.canonical_capacity_compatibility_evidence_state_value = "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY";
  q.capacity_compatibility_dimension.category = "UNRESOLVED";
  const r = assessContributionRequiredEvidence(input);
  assert.deepEqual(r.required_dimension_assessments[0]!.canonical_classification, { is_applicable: true, is_resolved: false, is_unresolved: true });
  assert.equal(r.summary.not_represented_count, 0);
});
for (const option of [{ missing: true }, { noReadiness: true }, { emptyMappings: true }]) {
  test(`unresolved availability remains covered: ${JSON.stringify(option)}`, () => {
    const { input } = setup(["AVAILABILITY_EVIDENCE"], option);
    const r = assessContributionRequiredEvidence(input);
    assert.equal(r.summary.represented_count, 1);
    assert.equal(r.summary.canonically_unresolved_count, 1);
    assert.equal(r.required_dimension_assessments[0]!.operand, input.availability_reference_assessment!.referenced_evidence_state);
  });
}
test("absent operands have no synthetic canonical state", () => {
  const { input } = setup();
  input.quantity_evaluation_state = null;
  input.availability_reference_assessment = null;
  const r = assessContributionRequiredEvidence(input);
  assert.equal(r.summary.not_represented_count, 3);
  assert.equal(r.summary.canonically_unresolved_count, 0);
  assert.ok(r.required_dimension_assessments.every(a => a.operand === null && a.canonical_classification === null));
});
for (const required of [["CAPACITY_COMPATIBILITY", "REQUIRED_AMOUNT_COMPATIBILITY"], ["AVAILABILITY_EVIDENCE"]] as const) {
  test(`null composition preserves independent coverage for ${required.join(",")}`, () => {
    const { input, q, applicability } = setup(required);
    const absent = currentAvailability({ noInterpretation: true });
    const composition = composeContributionQuantityAvailabilityEvidence({ quantity_evaluation_state: q, applicability_declaration: applicability, current_availability_evidence_state_set: absent.states });
    assert.equal(composition.composition, null);
    const r = assessContributionRequiredEvidence({ ...input, quantity_evaluation_state: composition.quantity_evaluation_state,
      availability_reference_assessment: composition.availability_reference_assessment });
    assert.equal(r.summary.represented_count, required.length === 2 ? 2 : 0);
  });
}
test("optional unresolved availability does not enter required summary", () => {
  const { input } = setup(["REQUIRED_AMOUNT_COMPATIBILITY"], { missing: true });
  const r = assessContributionRequiredEvidence(input);
  assert.equal(r.summary.represented_count, 1);
  assert.equal(r.summary.canonically_unresolved_count, 0);
});
test("availability coverage does not require a current quantity operand", () => {
  const { input } = setup(["AVAILABILITY_EVIDENCE"]);
  input.quantity_evaluation_state = null;
  assert.equal(assessContributionRequiredEvidence(input).summary.represented_count, 1);
});
for (const field of ["candidate_key", "observation_need_key", "capability_requirement_set_key", "observation_resource_requirement_key", "resource_readiness_observation_context_binding_key", "resource_declaration_id", "evaluation_at", "physical_potential_contribution_declaration_key"] as const) {
  test(`quantity with wrong ${field} is not covered`, () => {
    const { input, q } = setup(["CAPACITY_COMPATIBILITY", "REQUIRED_AMOUNT_COMPATIBILITY"]);
    input.quantity_evaluation_state = { ...q, [field]: "other" };
    assert.equal(assessContributionRequiredEvidence(input).summary.not_represented_count, 2);
  });
}
test("same resource alone cannot confer availability applicability on another contribution", () => {
  const { input } = setup(["AVAILABILITY_EVIDENCE"]);
  input.contribution_context = { ...input.contribution_context, physical_potential_contribution_declaration_key: "other" };
  assert.equal(assessContributionRequiredEvidence(input).summary.not_represented_count, 1);
});
test("wrong selected availability contract cannot count as coverage", () => {
  const { input } = setup(["AVAILABILITY_EVIDENCE"]);
  input.availability_evidence_contract = buildAvailabilityEvidenceContract(currentAvailability({ inverted: true }).policy!);
  assert.equal(assessContributionRequiredEvidence(input).summary.not_represented_count, 1);
});
test("missing explicit target contract does not become an implicit availability contract", () => {
  const { input } = setup(["AVAILABILITY_EVIDENCE"]);
  input.availability_evidence_contract = null;
  assert.equal(assessContributionRequiredEvidence(input).summary.not_represented_count, 1);
});
test("forged detached availability state is rejected by lineage checks", () => {
  const { input } = setup(["AVAILABILITY_EVIDENCE"]);
  input.availability_reference_assessment = { ...input.availability_reference_assessment!, referenced_evidence_state: { ...input.availability_reference_assessment!.referenced_evidence_state! } };
  assert.throws(() => assessContributionRequiredEvidence(input), /lineage mismatch/);
});
test("required set has canonical order/deduplication and changing it changes identity", () => {
  assert.equal(declaration([dims[2], dims[0], dims[0]]).key, declaration([dims[0], dims[2]]).key);
  assert.notEqual(declaration([dims[0]]).key, declaration([dims[1]]).key);
  assert.notEqual(declaration([]).key, declaration(dims).key);
});
test("explicit empty set is no implicit all-required or successful verdict", () => {
  const { input } = setup([]);
  const r = assessContributionRequiredEvidence(input);
  assert.equal(r.required_dimension_assessments.length, 0);
  assert.ok(Object.values(r.summary).every(v => v === 0));
});
test("missing specification and wrong owner are rejected", () => {
  assert.throws(() => declareContributionRequiredEvidence({ binding, specification: null as never }), /Explicit/);
  assert.throws(() => declareContributionRequiredEvidence({ binding, specification: { binding_key: "other", required_dimensions: [] } }), /Binding/);
  const { input } = setup();
  input.contribution_context = { ...input.contribution_context, observation_need_key: "other" };
  assert.throws(() => assessContributionRequiredEvidence(input), /declared Binding/);
});
test("declaration tampering and unknown dimensions are rejected", () => {
  const { input } = setup();
  input.declaration = { ...input.declaration, required_dimensions: [] };
  assert.throws(() => assessContributionRequiredEvidence(input), /identity mismatch/);
  assert.throws(() => declaration(["QUANTITY" as never]), /Unknown/);
});
test("current evidence/time/contribution changes preserve stable Binding requiredness identity", () => {
  const { input, q } = setup();
  const before = assessContributionRequiredEvidence(input);
  const nextTime = "2026-09-03T12:00:00.000Z";
  const nextQ = { ...q, key: "new177", evaluation_at: nextTime, physical_potential_contribution_declaration_key: "new-contribution" };
  const current = currentAvailability({ status: "UNAVAILABLE", evaluationAt: nextTime });
  const contract = buildAvailabilityEvidenceContract(current.policy!);
  const composition = composeContributionQuantityAvailabilityEvidence({ quantity_evaluation_state: nextQ,
    applicability_declaration: declare(nextQ, contract), current_availability_evidence_state_set: current.states });
  const after = assessContributionRequiredEvidence({ ...input, contribution_context: contributionAvailabilityContext(nextQ),
    quantity_evaluation_state: nextQ, availability_evidence_contract: contract,
    availability_reference_assessment: composition.availability_reference_assessment });
  assert.equal(after.declaration, before.declaration);
  assert.equal(after.declaration.key, declaration().key);
  assert.equal(after.summary.represented_count, 3);
  assert.notEqual(after.required_dimension_assessments[2]!.operand, before.required_dimension_assessments[2]!.operand);
});
test("interpreted polarity is preserved even when selected raw source is UNAVAILABLE", () => {
  const { input } = setup(["AVAILABILITY_EVIDENCE"], { status: "UNAVAILABLE", inverted: true });
  const r = assessContributionRequiredEvidence(input);
  const a = r.required_dimension_assessments[0]!;
  assert.ok(a.dimension === "AVAILABILITY_EVIDENCE" && a.operand?.value.endsWith("SUPPORTING"));
  assert.equal(r.summary.canonically_resolved_count, 1);
});
