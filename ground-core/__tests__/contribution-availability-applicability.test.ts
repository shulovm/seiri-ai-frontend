import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { SCHEMA_VERSION } from "../types.js";
import { buildAvailabilityEvidenceContract, contributionAvailabilityContext, declareContributionAvailabilityApplicability } from "../reality/contribution-availability-applicability-core.js";
import { policy, quantity, specification, declare } from "./fixtures/contribution-availability.js";

describe("Stable availability contract and explicit contribution applicability", () => {
  it("preserves the exact 185 policy and nested 180 authority", () => {
    const p = policy()!;
    const c = buildAvailabilityEvidenceContract(p);
    assert.strictEqual(c.interpretation_policy, p);
    assert.equal(c.aggregation_policy_key, p.availability_source_aggregation_policy.key);
    assert.equal(c.interpretation_policy_key, p.key);
  });
  it("absence never becomes a contract; empty explicit mapping remains a contract", () => {
    assert.equal(policy({ absent: true }), null);
    assert.throws(() => buildAvailabilityEvidenceContract(policy({ absent: true })!), /existing interpretation policy/);
    assert.equal(buildAvailabilityEvidenceContract(policy({ empty: true })!).interpretation_policy.mappings.length, 0);
  });
  it("interpretation policy changes require a new explicit applicability", () => {
    const q = quantity(), before = buildAvailabilityEvidenceContract(policy()!);
    const after = buildAvailabilityEvidenceContract(policy({ inverted: true })!);
    assert.equal(before.aggregation_policy_key, after.aggregation_policy_key);
    assert.notEqual(before.key, after.key);
    assert.throws(() => declareContributionAvailabilityApplicability({ quantity_evaluation_state: q, availability_evidence_contract: after, specification: specification(q, before) }), /exact context and contract/);
    assert.notEqual(declare(q, before).key, declare(q, after).key);
  });
  it("aggregation policy changes require a new explicit applicability", () => {
    const q = quantity(), before = buildAvailabilityEvidenceContract(policy()!);
    const after = buildAvailabilityEvidenceContract(policy({ operator: "ALL" })!);
    assert.notEqual(before.key, after.key);
    assert.throws(() => declareContributionAvailabilityApplicability({ quantity_evaluation_state: q, availability_evidence_contract: after, specification: specification(q, before) }), /exact context and contract/);
  });
  it("same resource and instant never imply applicability", () => {
    const q = quantity(), c = buildAvailabilityEvidenceContract(policy()!);
    assert.throws(() => declareContributionAvailabilityApplicability({ quantity_evaluation_state: q, availability_evidence_contract: c, specification: undefined! }), /Explicit/);
    const other = { ...q, resource_readiness_observation_context_binding_key: "other-binding", physical_potential_contribution_declaration_key: "other-contribution" };
    assert.throws(() => declareContributionAvailabilityApplicability({ quantity_evaluation_state: other, availability_evidence_contract: c, specification: specification(q, c) }), /exact context and contract/);
  });
  it("evidence-only quantity changes do not redefine contribution applicability", () => {
    const q = quantity(), c = buildAvailabilityEvidenceContract(policy()!);
    const changed = structuredClone(q);
    changed.key = "new-177-evidence";
    changed.capacity_compatibility_dimension.canonical_capacity_compatibility_evidence_state_key = "new-capacity-lineage";
    changed.capacity_compatibility_dimension.category = "CONTRADICTING";
    changed.capacity_compatibility_dimension.canonical_capacity_compatibility_evidence_state_value = "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_CONTRADICTING";
    assert.deepEqual(declare(q, c), declare(changed, c));
  });
  it("subject changes are not evidence-only updates", () => {
    const q = quantity(), c = buildAvailabilityEvidenceContract(policy()!);
    for (const field of ["candidate_key", "observation_need_key", "capability_requirement_set_key", "observation_resource_requirement_key", "physical_potential_contribution_declaration_key", "evaluation_at"] as const) {
      assert.throws(() => declareContributionAvailabilityApplicability({ quantity_evaluation_state: { ...q, [field]: "changed" }, availability_evidence_contract: c, specification: specification(q, c) }), /exact context and contract/);
    }
  });
  it("rejects cross-resource and malformed policy lineage", () => {
    const p = policy()!, c = buildAvailabilityEvidenceContract(p);
    assert.throws(() => declare({ ...quantity(), resource_declaration_id: "other" }, c), /resource mismatch/);
    assert.throws(() => buildAvailabilityEvidenceContract({ ...p, availability_source_aggregation_policy_key: "detached" }), /subject mismatch/);
    assert.throws(() => declare(quantity(), { ...c, key: "forged" }), /identity mismatch/);
  });
  it("no contribution subject cannot declare applicability", () => {
    assert.throws(() => contributionAvailabilityContext(null!), /existing GROUND-177/);
    assert.throws(() => declare({ ...quantity(), physical_potential_contribution_declaration_key: "" }), /context identity/);
  });
  it("deterministic on cloned input and does not mutate input", () => {
    const q = quantity(), c = buildAvailabilityEvidenceContract(policy()!);
    const before = structuredClone({ q, c });
    const first = declare(q, c);
    assert.deepEqual({ q, c }, before);
    assert.deepEqual(declare(structuredClone(q), structuredClone(c)), first);
    assert.equal("quantity_evaluation_state" in first, false);
    assert.equal("current_state" in first, false);
    assert.equal("result" in first, false);
  });
  it("does not depend on current 187 evidence or execute upstream builders", () => {
    const core = readFileSync(new URL("../reality/contribution-availability-applicability-core.ts", import.meta.url), "utf8");
    assert.doesNotMatch(core, /from .*canonical-selected-source|from .*resource-reservation|from .*feasibility/);
    assert.doesNotMatch(core, /buildDeclaredResourceAvailability|applyPatch|saveProject/);
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });
});
