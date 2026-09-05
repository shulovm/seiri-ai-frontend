import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { SCHEMA_VERSION } from "../types.js";
import type { ResourceDeclaration, ResourceAvailabilityDeclaration } from "../types.js";
import { buildDeclaredResourceAvailabilitySourceAggregationPolicySet } from "../reality/declared-resource-availability-source-aggregation-policy-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet } from "../reality/declared-resource-availability-source-aggregation-result-interpretation-policy-core.js";
import {
  buildAvailabilityEvidenceContract, contributionAvailabilityContext,
  contributionAvailabilityContextKey, declareContributionAvailabilityApplicability,
} from "../reality/contribution-availability-applicability-core.js";
import type { AvailabilityEvidenceContract, ContributionQuantityEvaluationState } from "../reality/contribution-availability-applicability-types.js";

const at = "2026-09-02T12:00:00.000Z";
const resource: ResourceDeclaration = {
  id: "r", project_id: "p", holder_entity_id: "h", resource_key: "water", unit: "litre",
  scope: { kind: "UNSCOPED" }, resource_entity_id: null, description: null,
  valid_from: at, valid_until: null, declared_by: { kind: "human" }, recorded_at: at,
  created_at: at, updated_at: at,
};
const source: ResourceAvailabilityDeclaration = {
  id: "s", project_id: "p", resource_declaration_id: "r", status: "AVAILABLE",
  valid_from: at, valid_until: null, declared_by: { kind: "human" }, recorded_at: at,
  note: null, created_at: at, updated_at: at,
};
function policy(options: { inverted?: boolean; empty?: boolean; absent?: boolean; operator?: "ANY" | "ALL" } = {}) {
  const aggregation = buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: [resource], resource_availability_declarations: [source],
    specification: { policies: [{ resource_declaration_id: "r", selected_availability_declaration_ids: ["s"], operator: options.operator ?? "ANY" }] },
  });
  return buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet({
    availability_source_aggregation_policy_set: aggregation,
    specification: { policies: options.absent ? [] : [{
      availability_source_aggregation_policy_key: aggregation.aggregation_policies[0]!.key,
      mappings: options.empty ? [] : [{
        source_result_value: "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS",
        interpretation: options.inverted
          ? "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE"
          : "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE",
      }],
    }] },
  }).resource_assessments[0]!.interpretation_policy;
}
function quantity(): ContributionQuantityEvaluationState {
  return {
    key: "177-current-evidence", candidate_key: "candidate", observation_need_key: "need",
    capability_requirement_set_key: "requirements", dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: "requirement", resource_readiness_observation_context_binding_key: "binding",
    resource_declaration_id: "r", evaluation_at: at, physical_potential_contribution_declaration_key: "contribution",
    capacity_compatibility_dimension: {
      canonical_capacity_compatibility_evidence_state_key: "capacity-state",
      canonical_capacity_compatibility_evidence_state_value: "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_SUPPORTING",
      category: "SUPPORTING",
    },
    required_amount_compatibility_dimension: {
      canonical_required_amount_compatibility_evidence_state_key: "required-state",
      canonical_required_amount_compatibility_evidence_state_value: "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_SUPPORTING",
      category: "SUPPORTING",
    },
  };
}
function specification(q: ContributionQuantityEvaluationState, c: AvailabilityEvidenceContract) {
  return { contribution_context_key: contributionAvailabilityContextKey(contributionAvailabilityContext(q)), availability_evidence_contract_key: c.key };
}
function declare(q = quantity(), c = buildAvailabilityEvidenceContract(policy()!)) {
  return declareContributionAvailabilityApplicability({ quantity_evaluation_state: q, availability_evidence_contract: c, specification: specification(q, c) });
}

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
