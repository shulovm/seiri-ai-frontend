/**
 * GROUND-173 — Observation Core CXXVII / Explicit Declared Potential
 * Contribution Quantity-Kind Semantic Declaration Foundation
 *
 * GROUND-155 + explicit quantity-kind specification
 * → per-contribution STOCK/FLOW/UNDECLARED declaration
 *
 * No GROUND-157 polarity / GROUND-171 match / readiness.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationKey,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.js";
import {
  ATTENTION_OBSERVATION_RESOURCE_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_MODEL_LIMITATIONS,
  attentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationKey,
  buildAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSet,
  GROUND_155_SINGLETON_AUTHORITATIVE_SPECIFICATION_INVARIANT,
  normalizeAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification,
} from "../reality/attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration-core.js";
import type {
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification,
} from "../reality/attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration-types.js";
import type { ResourceRequirementAmount } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_B = "cand-b";
const NEED = "need";
const CAP = "cap-set";
const REQ = "req-key";
const REQ_B = "req-key-b";
const BINDING = "binding-a";
const BINDING_B = "binding-b";
const RD = "rd-1";
const RD_B = "rd-2";
const EVAL_AT = "2026-01-01T00:00:00.000Z";
const EVAL_AT_B = "2026-01-02T00:00:00.000Z";

const STOCK = "STOCK_QUANTITY" as const;
const FLOW = "FLOW_QUANTITY" as const;
const UNDECLARED = "UNDECLARED_QUANTITY_KIND" as const;

function makeContribution(params: {
  candidate_key?: string;
  observation_resource_requirement_key?: string;
  binding_key?: string;
  resource_declaration_id?: string;
  evaluation_at?: string;
  quantity: ResourceRequirementAmount;
}): AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration {
  const candidate_key = params.candidate_key ?? CAND;
  const observation_resource_requirement_key =
    params.observation_resource_requirement_key ?? REQ;
  const binding_key = params.binding_key ?? BINDING;
  const resource_declaration_id = params.resource_declaration_id ?? RD;
  const evaluation_at = params.evaluation_at ?? EVAL_AT;
  const quantityCanonicalKey =
    params.quantity.kind === "POINT"
      ? `POINT|${params.quantity.value}`
      : `RANGE|${params.quantity.min}|${params.quantity.max}`;
  const key =
    attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationKey(
      {
        candidate_key,
        observation_need_key: NEED,
        capability_requirement_set_key: CAP,
        observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key: binding_key,
        resource_declaration_id,
        evaluation_at,
        declared_potential_contribution_quantity_canonical_key:
          quantityCanonicalKey,
      }
    );
  return {
    key,
    candidate_key,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key: binding_key,
    resource_declaration_id,
    resource_readiness_evaluation_instant_key: `instant|${evaluation_at}`,
    evaluation_at,
    declared_potential_contribution_quantity: params.quantity,
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      `ctx|${binding_key}`,
  };
}

function makeBindingAssessment(params: {
  declaration: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration | null;
}): AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment {
  const declaration = params.declaration;
  if (declaration === null) {
    return {
      observation_resource_requirement_key: REQ,
      resource_readiness_observation_context_binding_key: BINDING,
      resource_declaration_id: RD,
      resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
        "ctx|absent",
      quantity_relation_binding_assessment: {} as never,
      status:
        "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION",
      declaration: null,
      has_explicit_physical_potential_contribution_declaration: false,
    };
  }
  return {
    observation_resource_requirement_key:
      declaration.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      declaration.resource_readiness_observation_context_binding_key,
    resource_declaration_id: declaration.resource_declaration_id,
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      declaration.resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key,
    quantity_relation_binding_assessment: {} as never,
    status:
      "EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT",
    declaration,
    has_explicit_physical_potential_contribution_declaration: true,
  };
}

function mockCandidate(
  candidate_key: string,
  bindings: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment[]
): AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment {
  return {
    candidate_key,
    resource_readiness_declared_capacity_required_amount_quantity_relation_assessment:
      {} as never,
    requirement_potential_contribution_declaration_assessments: [],
    binding_potential_contribution_declaration_assessments: bindings,
    has_explicit_physical_potential_contribution_declarations: bindings.some(
      (b) => b.has_explicit_physical_potential_contribution_declaration
    ),
    model_limitations: [],
  };
}

function mock155Set(
  candidates: AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment[]
): AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment {
  return {
    resource_readiness_declared_capacity_required_amount_quantity_relation_set:
      {} as never,
    specification: { declarations: [] },
    candidate_assessments: candidates,
    has_explicit_physical_potential_contribution_declarations:
      candidates.some(
        (c) => c.has_explicit_physical_potential_contribution_declarations
      ),
    model_limitations: [],
  };
}

const CONTRIB_POINT = makeContribution({
  quantity: { kind: "POINT", value: 12 },
});
const CONTRIB_RANGE = makeContribution({
  binding_key: BINDING_B,
  resource_declaration_id: RD_B,
  evaluation_at: EVAL_AT_B,
  observation_resource_requirement_key: REQ_B,
  quantity: { kind: "RANGE", min: 10, max: 20 },
});
const CONTRIB_OTHER_CAND = makeContribution({
  candidate_key: CAND_B,
  binding_key: "binding-other",
  resource_declaration_id: "rd-other",
  quantity: { kind: "POINT", value: 12 },
});

function build173(
  set: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment,
  declarations: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput[]
) {
  return buildAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSet(
    {
      physical_potential_contribution_declaration_set: set,
      specification: { declarations },
    }
  );
}

function firstBinding(
  set: ReturnType<typeof build173>,
  contributionKey = CONTRIB_POINT.key
) {
  for (const candidate of set.candidate_assessments) {
    const found =
      candidate.binding_quantity_kind_semantic_declaration_assessments.find(
        (a) =>
          a.physical_potential_contribution_declaration?.key ===
            contributionKey ||
          (contributionKey === CONTRIB_POINT.key &&
            a.physical_potential_contribution_declaration === null &&
            a.resource_readiness_observation_context_binding_key === BINDING)
      );
    if (found) return found;
  }
  throw new Error(`binding not found for ${contributionKey}`);
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const default155WithContributions = () =>
  mock155Set([
    mockCandidate(CAND, [
      makeBindingAssessment({ declaration: CONTRIB_POINT }),
      makeBindingAssessment({ declaration: CONTRIB_RANGE }),
    ]),
    mockCandidate(CAND_B, [
      makeBindingAssessment({ declaration: CONTRIB_OTHER_CAND }),
    ]),
  ]);

const default155Absent = () =>
  mock155Set([
    mockCandidate(CAND, [makeBindingAssessment({ declaration: null })]),
  ]);

describe("GROUND-173 Declared Potential Contribution Quantity-Kind Semantic Declaration", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order; GROUND-155 singleton invariant retained", () => {
    assert.equal(
      ATTENTION_OBSERVATION_RESOURCE_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_MODEL_LIMITATIONS[0],
      "POTENTIAL_CONTRIBUTION_RANGE_SEMANTICS_NOT_FULLY_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_RESOURCE_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
    assert.match(
      GROUND_155_SINGLETON_AUTHORITATIVE_SPECIFICATION_INVARIANT,
      /singleton authoritative specification/
    );
  });

  it("upstream GROUND-155 absence → NOT_APPLICABLE (not NO_DECLARATION)", () => {
    const assessment = firstBinding(build173(default155Absent(), []));
    assert.equal(
      assessment.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION"
    );
    assert.equal(assessment.semantic_declaration, null);
    assert.equal(
      assessment.has_explicit_potential_contribution_quantity_kind_semantic_declaration,
      false
    );
    assert.notEqual(
      assessment.status,
      "NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION"
    );
  });

  it("contribution present without kind → NO_DECLARATION", () => {
    const assessment = firstBinding(
      build173(default155WithContributions(), []),
      CONTRIB_POINT.key
    );
    assert.equal(
      assessment.status,
      "NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION"
    );
    assert.equal(assessment.semantic_declaration, null);
  });

  it("STOCK / FLOW / UNDECLARED → PRESENT; UNDECLARED ≠ absence", () => {
    for (const kind of [STOCK, FLOW, UNDECLARED] as const) {
      const assessment = firstBinding(
        build173(default155WithContributions(), [
          {
            physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
            quantity_kind: kind,
          },
        ]),
        CONTRIB_POINT.key
      );
      assert.equal(
        assessment.status,
        "EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_PRESENT"
      );
      assert.equal(assessment.semantic_declaration!.quantity_kind, kind);
      assert.equal(
        assessment.has_explicit_potential_contribution_quantity_kind_semantic_declaration,
        true
      );
    }
  });

  it("POINT+STOCK / POINT+FLOW / RANGE+STOCK / RANGE+FLOW are valid declarations without polarity", () => {
    const cases: {
      contributionKey: string;
      quantity_kind: typeof STOCK | typeof FLOW;
    }[] = [
      { contributionKey: CONTRIB_POINT.key, quantity_kind: STOCK },
      { contributionKey: CONTRIB_POINT.key, quantity_kind: FLOW },
      { contributionKey: CONTRIB_RANGE.key, quantity_kind: STOCK },
      { contributionKey: CONTRIB_RANGE.key, quantity_kind: FLOW },
    ];
    for (const entry of cases) {
      const assessment = firstBinding(
        build173(default155WithContributions(), [
          {
            physical_potential_contribution_declaration_key:
              entry.contributionKey,
            quantity_kind: entry.quantity_kind,
          },
        ]),
        entry.contributionKey
      );
      assert.equal(
        assessment.status,
        "EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_PRESENT"
      );
      assert.equal(
        assessment.semantic_declaration!.quantity_kind,
        entry.quantity_kind
      );
      assert.ok(
        !("SUPPORTING" in (assessment.semantic_declaration as object))
      );
    }
  });

  it("duplicate identical declaration normalizes", () => {
    const out = build173(default155WithContributions(), [
      {
        physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
        quantity_kind: STOCK,
      },
      {
        physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
        quantity_kind: STOCK,
      },
    ]);
    assert.equal(
      firstBinding(out, CONTRIB_POINT.key).semantic_declaration!.quantity_kind,
      STOCK
    );
  });

  it("STOCK/FLOW and STOCK/UNDECLARED conflicts reject", () => {
    assert.throws(() =>
      build173(default155WithContributions(), [
        {
          physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
          quantity_kind: STOCK,
        },
        {
          physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
          quantity_kind: FLOW,
        },
      ])
    );
    assert.throws(() =>
      build173(default155WithContributions(), [
        {
          physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
          quantity_kind: STOCK,
        },
        {
          physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
          quantity_kind: UNDECLARED,
        },
      ])
    );
  });

  it("unknown and cross-Binding/candidate targets reject", () => {
    assert.throws(() =>
      build173(default155WithContributions(), [
        {
          physical_potential_contribution_declaration_key: "missing-contrib",
          quantity_kind: STOCK,
        },
      ])
    );

    const onlyCandA = mock155Set([
      mockCandidate(CAND, [
        makeBindingAssessment({ declaration: CONTRIB_POINT }),
      ]),
    ]);
    assert.throws(() =>
      build173(onlyCandA, [
        {
          physical_potential_contribution_declaration_key:
            CONTRIB_OTHER_CAND.key,
          quantity_kind: STOCK,
        },
      ])
    );
  });

  it("unsupported quantity-kind token rejects", () => {
    const index = new Map([[CONTRIB_POINT.key, CONTRIB_POINT]]);
    assert.throws(() =>
      normalizeAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification(
        {
          declarations: [
            {
              physical_potential_contribution_declaration_key:
                CONTRIB_POINT.key,
              quantity_kind: "RATE_QUANTITY" as never,
            },
          ],
        },
        index
      )
    );
  });

  it("declaration identity inherits evaluation_at via GROUND-155 key", () => {
    const assessment = firstBinding(
      build173(default155WithContributions(), [
        {
          physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
          quantity_kind: STOCK,
        },
      ]),
      CONTRIB_POINT.key
    );
    const declaration = assessment.semantic_declaration!;
    const helper =
      attentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationKey(
        {
          candidate_key: declaration.candidate_key,
          observation_need_key: declaration.observation_need_key,
          capability_requirement_set_key:
            declaration.capability_requirement_set_key,
          observation_resource_requirement_key:
            declaration.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            declaration.resource_readiness_observation_context_binding_key,
          resource_declaration_id: declaration.resource_declaration_id,
          evaluation_at: declaration.evaluation_at,
          physical_potential_contribution_declaration_key:
            declaration.physical_potential_contribution_declaration_key,
          quantity_kind: declaration.quantity_kind,
        }
      );
    assert.equal(declaration.key, helper);
    assert.equal(declaration.evaluation_at, EVAL_AT);
    assert.equal(
      declaration.physical_potential_contribution_declaration_key,
      CONTRIB_POINT.key
    );
  });

  it("input immutability and pointer-identity equivalence", () => {
    const set = default155WithContributions();
    const specification: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification =
      {
        declarations: [
          {
            physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
            quantity_kind: FLOW,
          },
        ],
      };
    const beforeSet = deepClone(set);
    const beforeSpec = deepClone(specification);
    const out1 =
      buildAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSet(
        {
          physical_potential_contribution_declaration_set: set,
          specification,
        }
      );
    assert.deepEqual(set, beforeSet);
    assert.deepEqual(specification, beforeSpec);

    const out2 =
      buildAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSet(
        {
          physical_potential_contribution_declaration_set: deepClone(set),
          specification: deepClone(specification),
        }
      );
    assert.deepEqual(out1.candidate_assessments, out2.candidate_assessments);
  });

  it("ordering invariance of specification declarations", () => {
    const a = build173(default155WithContributions(), [
      {
        physical_potential_contribution_declaration_key: CONTRIB_RANGE.key,
        quantity_kind: STOCK,
      },
      {
        physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
        quantity_kind: FLOW,
      },
    ]);
    const b = build173(default155WithContributions(), [
      {
        physical_potential_contribution_declaration_key: CONTRIB_POINT.key,
        quantity_kind: FLOW,
      },
      {
        physical_potential_contribution_declaration_key: CONTRIB_RANGE.key,
        quantity_kind: STOCK,
      },
    ]);
    assert.deepEqual(
      firstBinding(a, CONTRIB_POINT.key).semantic_declaration,
      firstBinding(b, CONTRIB_POINT.key).semantic_declaration
    );
    assert.deepEqual(
      firstBinding(a, CONTRIB_RANGE.key).semantic_declaration,
      firstBinding(b, CONTRIB_RANGE.key).semantic_declaration
    );
  });

  it("static proofs: no shape/unit inference, no 157/171/polarity/readiness", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration-core.ts"
      ),
      "utf8"
    );
    const types = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration-types.ts"
      ),
      "utf8"
    );
    const src = `${core}\n${types}`;

    assert.ok(!/required-amount-semantic-declaration/.test(core));
    assert.ok(!/raw-relation-basis/.test(core));
    assert.ok(!/canonical-aggregated/.test(core));
    assert.ok(!/ResourceAvailability/.test(src));
    assert.ok(!/ResourceReservation/.test(src));
    assert.ok(!/applyPatch|saveProject|ProjectState/.test(core));
    // Polarity / match vocabulary must not appear as runtime tokens (doc firewalls OK).
    assert.ok(!/"SUPPORTING"|"CONTRADICTING"|"SUFFICIENT"|"INSUFFICIENT"/.test(src));
    assert.ok(!/"HOLDS"|"DOES_NOT_HOLD"|"SATISFIED"|"UNSATISFIED"/.test(src));
    assert.ok(!/"QUANTITY_KIND_MATCH"|"QUANTITY_KIND_MISMATCH"/.test(src));
    assert.ok(!/\/s|per_hour|L\/h|kg\/day/.test(core));
    assert.ok(
      !/if\s*\(.*kind.*POINT.*\)[\s\S]{0,120}STOCK_QUANTITY/.test(core)
    );
    assert.ok(/POINT\/RANGE ≠ STOCK\/FLOW/.test(src) || /POINT\/RANGE ≠ STOCK/.test(src));
    assert.ok(/singleton authoritative specification/.test(src));
  });
});

