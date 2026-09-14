/**
 * GROUND-171 — Observation Core CXXV / Explicit Observation Resource
 * Required-Amount Semantic Declaration Foundation
 *
 * GROUND-132 + explicit semantics specification
 * → per-requirement amount_role + quantity_kind declaration
 *
 * No GROUND-157 relation polarity / satisfaction / readiness.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  attentionObservationResourceRequirementKey,
} from "../reality/attention-observation-resource-requirement-core.js";
import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "../reality/attention-observation-resource-requirement-types.js";
import {
  ATTENTION_OBSERVATION_RESOURCE_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_MODEL_LIMITATIONS,
  attentionObservationResourceRequiredAmountSemanticDeclarationKey,
  buildAttentionObservationResourceRequiredAmountSemanticDeclarationSet,
  GROUND_155_SINGLETON_AUTHORITATIVE_SPECIFICATION_INVARIANT,
  normalizeAttentionObservationResourceRequiredAmountSemanticDeclarationSpecification,
} from "../reality/attention-observation-resource-required-amount-semantic-declaration-core.js";
import type {
  AttentionObservationResourceRequiredAmountSemanticDeclarationInput,
  AttentionObservationResourceRequiredAmountSemanticDeclarationSpecification,
} from "../reality/attention-observation-resource-required-amount-semantic-declaration-types.js";
import type { ResourceRequirementAmount, ResourceScope } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_B = "cand-b";
const NEED_KEY = "need";
const CAP_SET_KEY = "cap-set-key";
const SCOPE: ResourceScope = { kind: "UNSCOPED" };

const MINIMUM = "MINIMUM_REQUIRED_AMOUNT" as const;
const TARGET = "TARGET_REQUIRED_AMOUNT" as const;
const EXACT = "EXACT_REQUIRED_AMOUNT" as const;
const STOCK = "STOCK_QUANTITY" as const;
const FLOW = "FLOW_QUANTITY" as const;
const UNDECLARED = "UNDECLARED_QUANTITY_KIND" as const;

function makeRequirement(params: {
  candidate_key?: string;
  resource_key: string;
  unit?: string;
  required_amount: ResourceRequirementAmount;
}): AttentionObservationResourceRequirement {
  const candidate_key = params.candidate_key ?? CAND;
  const unit = params.unit ?? "WH";
  return {
    key: attentionObservationResourceRequirementKey(
      candidate_key,
      NEED_KEY,
      CAP_SET_KEY,
      params.resource_key,
      unit,
      SCOPE,
      params.required_amount,
      null,
      null
    ),
    candidate_key,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: CAP_SET_KEY,
    resource_key: params.resource_key,
    unit,
    resource_scope: SCOPE,
    required_amount: params.required_amount,
    valid_from: null,
    valid_until: null,
  };
}

const R_POINT = makeRequirement({
  resource_key: "SENSOR_POWER",
  required_amount: { kind: "POINT", value: 50 },
});
const R_RANGE = makeRequirement({
  resource_key: "NETWORK_BANDWIDTH",
  unit: "MBPS",
  required_amount: { kind: "RANGE", min: 10, max: 20 },
});
const R_OTHER_CAND = makeRequirement({
  candidate_key: CAND_B,
  resource_key: "SENSOR_POWER",
  required_amount: { kind: "POINT", value: 50 },
});

function mockCandidate(
  candidate_key: string,
  resource_requirements: AttentionObservationResourceRequirement[]
): AttentionCandidateObservationResourceRequirementSetAssessment {
  return {
    candidate_key,
    capability_requirement_assessment: {} as never,
    status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
    resource_requirements,
    has_explicit_observation_resource_requirement_set: true,
    has_observation_resource_requirements: resource_requirements.length > 0,
    model_limitations: [],
  };
}

function mock132Set(
  candidates: AttentionCandidateObservationResourceRequirementSetAssessment[]
): AttentionObservationResourceRequirementSetAssessment {
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: candidates,
    has_explicit_observation_resource_requirement_sets: true,
    has_observation_resource_requirements: candidates.some(
      (c) => c.has_observation_resource_requirements
    ),
    model_limitations: [],
  };
}

function build171(
  set: AttentionObservationResourceRequirementSetAssessment,
  declarations: AttentionObservationResourceRequiredAmountSemanticDeclarationInput[]
) {
  return buildAttentionObservationResourceRequiredAmountSemanticDeclarationSet({
    observation_resource_requirement_set: set,
    specification: { declarations },
  });
}

function firstReq(
  set: ReturnType<typeof build171>,
  requirementKey = R_POINT.key
) {
  for (const candidate of set.candidate_assessments) {
    const found = candidate.requirement_semantic_declaration_assessments.find(
      (a) => a.observation_resource_requirement_key === requirementKey
    );
    if (found) return found;
  }
  throw new Error(`requirement not found: ${requirementKey}`);
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const default132 = () =>
  mock132Set([
    mockCandidate(CAND, [R_POINT, R_RANGE]),
    mockCandidate(CAND_B, [R_OTHER_CAND]),
  ]);

describe("GROUND-171 Required Amount Semantic Declaration", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order; GROUND-155 singleton invariant retained", () => {
    assert.equal(
      ATTENTION_OBSERVATION_RESOURCE_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_MODEL_LIMITATIONS[0],
      "REQUIRED_AMOUNT_RELATION_INTERPRETATION_POLICY_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_RESOURCE_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
    assert.match(
      GROUND_155_SINGLETON_AUTHORITATIVE_SPECIFICATION_INVARIANT,
      /singleton authoritative specification/
    );
  });

  it("required_amount always present on GROUND-132 Requirement → no NOT_APPLICABLE status", () => {
    assert.ok(R_POINT.required_amount);
    assert.ok(R_RANGE.required_amount);
    const absent = firstReq(build171(default132(), []));
    assert.equal(
      absent.status,
      "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION"
    );
    assert.notEqual(
      absent.status,
      "NOT_APPLICABLE_NO_REQUIRED_AMOUNT_DECLARED" as string
    );
  });

  it("no semantic declaration → NO_DECLARATION", () => {
    const assessment = firstReq(build171(default132(), []));
    assert.equal(
      assessment.status,
      "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION"
    );
    assert.equal(assessment.semantic_declaration, null);
    assert.equal(assessment.has_explicit_required_amount_semantic_declaration, false);
  });

  it("all role × kind combinations PRESENT without polarity", () => {
    const cases: AttentionObservationResourceRequiredAmountSemanticDeclarationInput[] =
      [
        { observation_resource_requirement_key: R_POINT.key, amount_role: MINIMUM, quantity_kind: STOCK },
        { observation_resource_requirement_key: R_POINT.key, amount_role: TARGET, quantity_kind: STOCK },
        { observation_resource_requirement_key: R_POINT.key, amount_role: EXACT, quantity_kind: STOCK },
        { observation_resource_requirement_key: R_POINT.key, amount_role: MINIMUM, quantity_kind: FLOW },
        { observation_resource_requirement_key: R_POINT.key, amount_role: TARGET, quantity_kind: FLOW },
        { observation_resource_requirement_key: R_POINT.key, amount_role: EXACT, quantity_kind: FLOW },
      ];
    for (const entry of cases) {
      const assessment = firstReq(build171(default132(), [entry]));
      assert.equal(
        assessment.status,
        "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT"
      );
      assert.equal(assessment.semantic_declaration!.amount_role, entry.amount_role);
      assert.equal(
        assessment.semantic_declaration!.quantity_kind,
        entry.quantity_kind
      );
      assert.equal(assessment.semantic_declaration!.dimension, "RESOURCE_READINESS");
    }
  });

  it("explicit UNDECLARED quantity kind PRESENT and distinct from absence", () => {
    const declared = firstReq(
      build171(default132(), [
        {
          observation_resource_requirement_key: R_POINT.key,
          amount_role: MINIMUM,
          quantity_kind: UNDECLARED,
        },
      ])
    );
    const absent = firstReq(build171(default132(), []));
    assert.equal(
      declared.status,
      "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT"
    );
    assert.equal(declared.semantic_declaration!.quantity_kind, UNDECLARED);
    assert.notEqual(declared.status, absent.status);
  });

  it("POINT can be MINIMUM / TARGET / EXACT; RANGE declarations valid without polarity", () => {
    for (const role of [MINIMUM, TARGET, EXACT] as const) {
      const point = firstReq(
        build171(default132(), [
          {
            observation_resource_requirement_key: R_POINT.key,
            amount_role: role,
            quantity_kind: STOCK,
          },
        ])
      );
      assert.equal(R_POINT.required_amount.kind, "POINT");
      assert.equal(point.semantic_declaration!.amount_role, role);

      const range = firstReq(
        build171(default132(), [
          {
            observation_resource_requirement_key: R_RANGE.key,
            amount_role: role,
            quantity_kind: STOCK,
          },
        ]),
        R_RANGE.key
      );
      assert.equal(R_RANGE.required_amount.kind, "RANGE");
      assert.equal(range.status, "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT");
    }
  });

  it("duplicate identical declarations normalize; conflicting role/kind reject", () => {
    const normalized = build171(default132(), [
      {
        observation_resource_requirement_key: R_POINT.key,
        amount_role: MINIMUM,
        quantity_kind: STOCK,
      },
      {
        observation_resource_requirement_key: R_POINT.key,
        amount_role: MINIMUM,
        quantity_kind: STOCK,
      },
    ]);
    assert.equal(
      firstReq(normalized).status,
      "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT"
    );

    assert.throws(() =>
      build171(default132(), [
        {
          observation_resource_requirement_key: R_POINT.key,
          amount_role: MINIMUM,
          quantity_kind: STOCK,
        },
        {
          observation_resource_requirement_key: R_POINT.key,
          amount_role: EXACT,
          quantity_kind: STOCK,
        },
      ])
    );
    assert.throws(() =>
      build171(default132(), [
        {
          observation_resource_requirement_key: R_POINT.key,
          amount_role: MINIMUM,
          quantity_kind: STOCK,
        },
        {
          observation_resource_requirement_key: R_POINT.key,
          amount_role: MINIMUM,
          quantity_kind: FLOW,
        },
      ])
    );
  });

  it("unknown Requirement target and cross-candidate misuse reject", () => {
    assert.throws(() =>
      build171(default132(), [
        {
          observation_resource_requirement_key: "missing-req",
          amount_role: MINIMUM,
          quantity_kind: STOCK,
        },
      ])
    );

    // R_OTHER_CAND belongs to CAND_B; targeting it from a set that only has CAND fails
    const onlyCandA = mock132Set([mockCandidate(CAND, [R_POINT, R_RANGE])]);
    assert.throws(() =>
      build171(onlyCandA, [
        {
          observation_resource_requirement_key: R_OTHER_CAND.key,
          amount_role: MINIMUM,
          quantity_kind: STOCK,
        },
      ])
    );
  });

  it("unsupported role/kind tokens reject", () => {
    const reqIndex = new Map([[R_POINT.key, R_POINT]]);
    assert.throws(() =>
      normalizeAttentionObservationResourceRequiredAmountSemanticDeclarationSpecification(
        {
          declarations: [
            {
              observation_resource_requirement_key: R_POINT.key,
              amount_role: "NOT_A_ROLE" as never,
              quantity_kind: STOCK,
            },
          ],
        },
        reqIndex
      )
    );
    assert.throws(() =>
      normalizeAttentionObservationResourceRequiredAmountSemanticDeclarationSpecification(
        {
          declarations: [
            {
              observation_resource_requirement_key: R_POINT.key,
              amount_role: MINIMUM,
              quantity_kind: "RATE_QUANTITY" as never,
            },
          ],
        },
        reqIndex
      )
    );
  });

  it("declaration identity is stable and current-independent", () => {
    const assessment = firstReq(
      build171(default132(), [
        {
          observation_resource_requirement_key: R_POINT.key,
          amount_role: MINIMUM,
          quantity_kind: STOCK,
        },
      ])
    );
    const declaration = assessment.semantic_declaration!;
    const helper = attentionObservationResourceRequiredAmountSemanticDeclarationKey({
      candidate_key: declaration.candidate_key,
      observation_need_key: declaration.observation_need_key,
      capability_requirement_set_key: declaration.capability_requirement_set_key,
      observation_resource_requirement_key:
        declaration.observation_resource_requirement_key,
      amount_role: declaration.amount_role,
      quantity_kind: declaration.quantity_kind,
    });
    assert.equal(declaration.key, helper);
    assert.ok(!("evaluation_at" in declaration));
    assert.ok(!declaration.key.includes("evaluation"));
  });

  it("input immutability and pointer-identity equivalence", () => {
    const set = default132();
    const specification: AttentionObservationResourceRequiredAmountSemanticDeclarationSpecification =
      {
        declarations: [
          {
            observation_resource_requirement_key: R_POINT.key,
            amount_role: TARGET,
            quantity_kind: FLOW,
          },
        ],
      };
    const snapSet = deepClone(set);
    const snapSpec = deepClone(specification);
    const out1 = buildAttentionObservationResourceRequiredAmountSemanticDeclarationSet({
      observation_resource_requirement_set: set,
      specification,
    });
    assert.deepEqual(set, snapSet);
    assert.deepEqual(specification, snapSpec);
    const out2 = buildAttentionObservationResourceRequiredAmountSemanticDeclarationSet({
      observation_resource_requirement_set: deepClone(set),
      specification: deepClone(specification),
    });
    assert.deepEqual(out1, out2);
  });

  it("summary booleans are existence-only; set exposes GROUND-132 lineage", () => {
    const set = build171(default132(), [
      {
        observation_resource_requirement_key: R_POINT.key,
        amount_role: MINIMUM,
        quantity_kind: STOCK,
      },
    ]);
    assert.equal(set.has_explicit_required_amount_semantic_declarations, true);
    assert.equal(
      set.candidate_assessments[0]!.has_explicit_required_amount_semantic_declarations,
      true
    );
    assert.equal(
      set.candidate_assessments[0]!.resource_requirement_set_assessment.candidate_key,
      CAND
    );
    // second requirement remains undeclared
    assert.equal(
      firstReq(set, R_RANGE.key).status,
      "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION"
    );
  });

  it("132 authority only; no 157/169/155/availability/Reservation/OE polarity", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-resource-required-amount-semantic-declaration-core.ts"
      ),
      "utf8"
    );
    const types = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-resource-required-amount-semantic-declaration-types.ts"
      ),
      "utf8"
    );
    const src = `${core}\n${types}`;
    assert.ok(!/declared-potential-contribution-raw-relation/.test(core));
    assert.ok(!/canonical-aggregated-declared-potential/.test(core));
    assert.ok(!/physical-potential-contribution-declaration-core/.test(core));
    assert.ok(!/source-aggregation-result/.test(core));
    assert.ok(!/\bProjectState\b/.test(core));
    assert.ok(!/\bStatePatch\b/.test(core));
    assert.ok(!/\bapplyPatch\b/.test(core));
    assert.ok(!/\bsaveProject\b/.test(core));
    assert.ok(!/STRICTLY_BELOW/.test(src));
    assert.ok(!/EXACTLY_EQUALS/.test(src));
    assert.ok(!/"SUFFICIENT"/.test(src));
    assert.ok(!/"SATISFIED"/.test(src));
    assert.ok(!/INTERPRET_AS_SUPPORTING/.test(src));
    assert.ok(!/"RESOURCE_READY"/.test(src));
    assert.ok(!/can_execute/.test(src));
    assert.ok(!/required_amount\.kind\s*===\s*"POINT"/.test(core));
    assert.ok(!/\/s|per_hour/.test(core));
    assert.ok(/REQUIRED_AMOUNT_RELATION_INTERPRETATION_POLICY_NOT_MODELED/.test(types));
    assert.ok(/singleton authoritative specification/.test(src));
  });
});
