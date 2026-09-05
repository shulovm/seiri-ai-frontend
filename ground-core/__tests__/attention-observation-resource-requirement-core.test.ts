/**
 * GROUND-132 — Observation Core LXXXVI / Explicit Observation Resource
 * Requirement Foundation
 *
 * Pure GROUND-048 Capability Requirement Set + explicit Observation Resource
 * Requirement Specification (declaration only; no resource evidence / readiness).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_RESOURCE_REQUIREMENT_MODEL_LIMITATIONS,
  attentionObservationResourceRequirementKey,
  buildAttentionObservationResourceRequirementSetAssessment,
  buildAttentionObservationResourceRequirementSetKey,
  canonicalizeResourceRequirementKeys,
  EMPTY_OBSERVATION_RESOURCE_REQUIREMENT_SET,
  normalizeAttentionObservationResourceRequirementSpecification,
} from "../reality/attention-observation-resource-requirement-core.js";
import type {
  AttentionObservationResourceRequirementInput,
  AttentionObservationResourceRequirementSpecification,
} from "../reality/attention-observation-resource-requirement-types.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import { buildAttentionObservationCapabilityRequirementSetKey } from "../reality/attention-observation-capability-requirement-set-identity.js";
import type { ResourceRequirementAmount, ResourceScope } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const CAND = "cand";
const CAND_2 = "cand-b";
const CAND_OUTER = "cand-outer";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";
const AT_FROM = "2026-09-01T10:00:00.000Z";
const AT_UNTIL = "2026-09-02T10:00:00.000Z";

const SCOPE_UNSCOPED: ResourceScope = { kind: "UNSCOPED" };
const SCOPE_ENTITY: ResourceScope = {
  kind: "ENTITY",
  entity_id: "entity-a",
};
const SCOPE_ENTITY_B: ResourceScope = {
  kind: "ENTITY",
  entity_id: "entity-b",
};

function amountPoint(value: number): ResourceRequirementAmount {
  return { kind: "POINT", value };
}

function amountRange(min: number, max: number): ResourceRequirementAmount {
  return { kind: "RANGE", min, max };
}

function mockRequirement(
  overrides: Partial<AttentionObservationResourceRequirementInput> = {}
): AttentionObservationResourceRequirementInput {
  return {
    resource_key: "SENSOR_POWER",
    unit: "WH",
    resource_scope: SCOPE_UNSCOPED,
    required_amount: amountPoint(50),
    valid_from: null,
    valid_until: null,
    ...overrides,
  };
}

function mockRequirementSet(options?: {
  candidates?: {
    candidate_key: string;
    status?:
      | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      | "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
      | "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
    observation_need_key?: string;
    requirements?: { key: string; semantic: string }[];
  }[];
}): AttentionObservationCapabilityRequirementSetAssessment {
  const candidates = options?.candidates ?? [
    {
      candidate_key: CAND,
      status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" as const,
      observation_need_key: NEED_KEY,
      requirements: [
        { key: REQ_KEY, semantic: "inspect" },
        { key: REQ_KEY_2, semantic: "human_inspection" },
      ],
    },
  ];

  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: candidates.map((c) => ({
      candidate_key: c.candidate_key,
      planning: {} as never,
      status: c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT",
      capability_requirement_basis:
        c.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
        c.status === "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
          ? c.status === "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
            ? {
                observation_need_key: c.observation_need_key ?? NEED_KEY,
                requirements: [],
              }
            : null
          : {
              observation_need_key: c.observation_need_key ?? NEED_KEY,
              requirements: (c.requirements ?? []).map((r) => ({
                key: r.key,
                observation_need_key: c.observation_need_key ?? NEED_KEY,
                capability_semantic_key: r.semantic,
              })),
            },
      has_explicit_capability_requirements:
        (c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT") ===
        "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT",
      model_limitations: [],
    })),
    has_explicit_capability_requirements: candidates.some(
      (c) =>
        (c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT") ===
        "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT"
    ),
    model_limitations: [],
  };
}

function capabilitySetKey(
  candidateKey: string,
  needKey: string,
  requirementKeys: string[]
): string {
  return buildAttentionObservationCapabilityRequirementSetKey(
    candidateKey,
    needKey,
    requirementKeys
  );
}

function build132(
  capabilitySet: AttentionObservationCapabilityRequirementSetAssessment = mockRequirementSet(),
  specification: AttentionObservationResourceRequirementSpecification = {
    candidate_requirement_sets: [],
  }
) {
  return buildAttentionObservationResourceRequirementSetAssessment({
    capability_requirement_set: capabilitySet,
    specification,
  });
}

function assertNoReadinessSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"RESOURCE_READY"/.test(json));
  assert.ok(!/"RESOURCE_NOT_READY"/.test(json));
  assert.ok(!/"resource_readiness"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"feasible"\s*:/.test(json));
  assert.ok(!/"requires_no_resources"/.test(json));
  assert.ok(!/"available_quantity"/.test(json));
  assert.ok(!/"CONFLICTING_RESOURCE_REQUIREMENTS"/.test(json));
}

describe("GROUND-132 Observation Resource Requirement", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(ATTENTION_OBSERVATION_RESOURCE_REQUIREMENT_MODEL_LIMITATIONS, [
      "OBSERVATION_RESOURCE_READINESS_CONTEXT_BINDING_NOT_MODELED",
      "OBSERVATION_RESOURCE_READINESS_EVALUATION_INSTANT_NOT_MODELED",
      "OBSERVATION_RESOURCE_EVIDENCE_ASSESSMENT_NOT_MODELED",
      "OBSERVATION_RESOURCE_QUANTITY_SUFFICIENCY_NOT_MODELED",
      "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_NOT_MODELED",
      "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED",
      "OBSERVATION_RESOURCE_PARTIAL_FULFILLMENT_NOT_MODELED",
      "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_STATE_NOT_MODELED",
      "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
      "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
      "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
      "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
      "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
      "CAN_EXECUTE_NOT_MODELED",
      "EXECUTION_NOT_MODELED",
    ]);
  });

  describe("requirement declaration", () => {
    it("one explicit requirement with exact context lineage", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [mockRequirement()] },
        ],
      });
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT"
      );
      assert.equal(cand.resource_requirements.length, 1);
      const req = cand.resource_requirements[0]!;
      assert.equal(req.candidate_key, CAND);
      assert.equal(req.observation_need_key, NEED_KEY);
      assert.equal(req.resource_key, "SENSOR_POWER");
      assert.equal(req.unit, "WH");
      assert.equal(
        req.capability_requirement_set_key,
        capabilitySetKey(CAND, NEED_KEY, [REQ_KEY, REQ_KEY_2])
      );
      assertNoReadinessSemantics(set);
    });

    it("multiple explicit requirements preserved independently", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [
              mockRequirement({ resource_key: "SENSOR_POWER" }),
              mockRequirement({ resource_key: "NETWORK_BANDWIDTH", unit: "MBPS" }),
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.resource_requirements.length, 2);
      assert.equal(set.has_observation_resource_requirements, true);
    });

    it("exact duplicate requirement normalizes to one", () => {
      const dup = mockRequirement();
      const normalized = normalizeAttentionObservationResourceRequirementSpecification(
        mockRequirementSet(),
        {
          candidate_requirement_sets: [
            {
              candidate_key: CAND,
              requirements: [dup, { ...dup }],
            },
          ],
        }
      );
      assert.equal(normalized.candidate_requirement_sets[0]!.requirements.length, 1);
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [dup, { ...dup }] },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.resource_requirements.length, 1);
    });

    it("same resource_key different amount preserves both", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [
              mockRequirement({
                resource_key: "COMPUTE",
                required_amount: amountPoint(10),
              }),
              mockRequirement({
                resource_key: "COMPUTE",
                required_amount: amountPoint(20),
              }),
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.resource_requirements.length, 2);
    });

    it("same resource_key different unit preserves both", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [
              mockRequirement({ resource_key: "COMPUTE", unit: "GB" }),
              mockRequirement({ resource_key: "COMPUTE", unit: "MB" }),
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.resource_requirements.length, 2);
    });

    it("same resource_key different scope preserves both", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [
              mockRequirement({ resource_scope: SCOPE_ENTITY }),
              mockRequirement({ resource_scope: SCOPE_ENTITY_B }),
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.resource_requirements.length, 2);
    });

    it("same resource_key different interval preserves both", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [
              mockRequirement({ valid_from: AT_FROM, valid_until: AT_UNTIL }),
              mockRequirement({ valid_from: AT_FROM, valid_until: null }),
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.resource_requirements.length, 2);
    });

    it("no semantic conflict verdict", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [
              mockRequirement({
                resource_key: "COMPUTE",
                required_amount: amountPoint(10),
              }),
              mockRequirement({
                resource_key: "COMPUTE",
                required_amount: amountPoint(20),
              }),
            ],
          },
        ],
      });
      assertNoReadinessSemantics(set);
      assert.ok(
        !JSON.stringify(set).includes("CONFLICTING_RESOURCE_REQUIREMENTS")
      );
    });
  });

  describe("explicit empty vs absence", () => {
    it("explicit empty requirement set PRESENT with zero requirements", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [{ candidate_key: CAND, requirements: [] }],
      });
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT"
      );
      assert.equal(cand.resource_requirements.length, 0);
      assert.equal(cand.has_explicit_observation_resource_requirement_set, true);
      assert.equal(cand.has_observation_resource_requirements, false);
      assert.equal(set.has_explicit_observation_resource_requirement_sets, true);
      assert.equal(set.has_observation_resource_requirements, false);
    });

    it("no explicit requirement set declared", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [],
      });
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
      );
      assert.equal(cand.has_explicit_observation_resource_requirement_set, false);
      assert.equal(cand.has_observation_resource_requirements, false);
      assert.equal(set.has_explicit_observation_resource_requirement_sets, false);
    });

    it("empty != absence distinct status and booleans", () => {
      const empty = build132(mockRequirementSet(), {
        candidate_requirement_sets: [{ candidate_key: CAND, requirements: [] }],
      });
      const absent = build132(mockRequirementSet(), {
        candidate_requirement_sets: [],
      });
      const emptyCand = empty.candidate_assessments[0]!;
      const absentCand = absent.candidate_assessments[0]!;
      assert.notEqual(emptyCand.status, absentCand.status);
      assert.notEqual(
        emptyCand.has_explicit_observation_resource_requirement_set,
        absentCand.has_explicit_observation_resource_requirement_set
      );
    });

    it("explicit empty set identity token", () => {
      const capSetKey = capabilitySetKey(CAND, NEED_KEY, [REQ_KEY, REQ_KEY_2]);
      const setKey = buildAttentionObservationResourceRequirementSetKey(
        CAND,
        NEED_KEY,
        capSetKey,
        []
      );
      assert.ok(setKey.includes(EMPTY_OBSERVATION_RESOURCE_REQUIREMENT_SET));
    });
  });

  describe("readiness firewalls (static)", () => {
    it("requirement absence != ready", () => {
      const src = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-resource-requirement-core.ts"
        ),
        "utf8"
      );
      assert.ok(
        !src.includes("RESOURCE_READY") && !src.includes("RESOURCE_NOT_READY")
      );
      assert.ok(
        src.includes("NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED")
      );
    });

    it("explicit empty != ready", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [{ candidate_key: CAND, requirements: [] }],
      });
      assertNoReadinessSemantics(set);
    });

    it("non-empty != not ready", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [mockRequirement()] },
        ],
      });
      assertNoReadinessSemantics(set);
    });

    it("no implicit ALL / ANY / summation / sufficiency arithmetic", () => {
      const src = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-resource-requirement-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/\ball must be satisfied\b/i.test(src));
      assert.ok(!/\bany must be satisfied\b/i.test(src));
      assert.ok(!/available\s*>=\s*required/.test(src));
      assert.ok(!/capacity\s*>=\s*required/.test(src));
      assert.ok(!/\.reduce\(/.test(src));
    });

    it("no resource evidence / OE runtime imports", () => {
      const coreSrc = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-resource-requirement-core.ts"
        ),
        "utf8"
      );
      const typesSrc = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-resource-requirement-types.ts"
        ),
        "utf8"
      );
      const src = coreSrc + typesSrc;

      assert.ok(!/from ["'].*state-engine/.test(src));
      assert.ok(!/from ["'].*file-store/.test(src));
      assert.ok(!/from ["'].*feasibility-core/.test(src));
      assert.ok(!/from ["'].*resource-types/.test(src));
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy/.test(src)
      );
      assert.ok(
        !/from ["'].*operational-eligibility-authority-dimension/.test(src)
      );
      assert.ok(coreSrc.includes("./intervention-core.js"));
      assert.ok(coreSrc.includes("./resource-core.js"));
      assert.ok(coreSrc.includes("resourceRequirementAmountKey"));
      assert.ok(coreSrc.includes("resourceScopeKey"));
    });

    it("no wall-clock", () => {
      const src = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-resource-requirement-core.ts"
        ),
        "utf8"
      );
      assert.ok(!src.includes("Date.now"));
      assert.ok(!src.includes("new Date("));
      assert.ok(!src.includes("performance.now"));
    });
  });

  describe("identity", () => {
    it("requirement identity field sensitivity", () => {
      const capSetKey = capabilitySetKey(CAND, NEED_KEY, [REQ_KEY, REQ_KEY_2]);
      const base = attentionObservationResourceRequirementKey(
        CAND,
        NEED_KEY,
        capSetKey,
        "COMPUTE",
        "GB",
        SCOPE_UNSCOPED,
        amountPoint(10),
        null,
        null
      );
      const variants = [
        attentionObservationResourceRequirementKey(
          "other",
          NEED_KEY,
          capSetKey,
          "COMPUTE",
          "GB",
          SCOPE_UNSCOPED,
          amountPoint(10),
          null,
          null
        ),
        attentionObservationResourceRequirementKey(
          CAND,
          "other-need",
          capSetKey,
          "COMPUTE",
          "GB",
          SCOPE_UNSCOPED,
          amountPoint(10),
          null,
          null
        ),
        attentionObservationResourceRequirementKey(
          CAND,
          NEED_KEY,
          "other-set",
          "COMPUTE",
          "GB",
          SCOPE_UNSCOPED,
          amountPoint(10),
          null,
          null
        ),
        attentionObservationResourceRequirementKey(
          CAND,
          NEED_KEY,
          capSetKey,
          "OTHER",
          "GB",
          SCOPE_UNSCOPED,
          amountPoint(10),
          null,
          null
        ),
        attentionObservationResourceRequirementKey(
          CAND,
          NEED_KEY,
          capSetKey,
          "COMPUTE",
          "MB",
          SCOPE_UNSCOPED,
          amountPoint(10),
          null,
          null
        ),
        attentionObservationResourceRequirementKey(
          CAND,
          NEED_KEY,
          capSetKey,
          "COMPUTE",
          "GB",
          SCOPE_ENTITY,
          amountPoint(10),
          null,
          null
        ),
        attentionObservationResourceRequirementKey(
          CAND,
          NEED_KEY,
          capSetKey,
          "COMPUTE",
          "GB",
          SCOPE_UNSCOPED,
          amountPoint(20),
          null,
          null
        ),
        attentionObservationResourceRequirementKey(
          CAND,
          NEED_KEY,
          capSetKey,
          "COMPUTE",
          "GB",
          SCOPE_UNSCOPED,
          amountPoint(10),
          AT_FROM,
          null
        ),
        attentionObservationResourceRequirementKey(
          CAND,
          NEED_KEY,
          capSetKey,
          "COMPUTE",
          "GB",
          SCOPE_UNSCOPED,
          amountPoint(10),
          null,
          AT_UNTIL
        ),
      ];
      for (const variant of variants) {
        assert.notEqual(base, variant);
      }
    });

    it("requirement-set identity order invariance", () => {
      const capSetKey = capabilitySetKey(CAND, NEED_KEY, [REQ_KEY, REQ_KEY_2]);
      const reqA = mockRequirement({ resource_key: "A" });
      const reqB = mockRequirement({ resource_key: "B" });
      const set1 = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [reqA, reqB] },
        ],
      });
      const set2 = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [reqB, reqA] },
        ],
      });
      const keys1 = set1.candidate_assessments[0]!.resource_requirements.map(
        (r) => r.key
      );
      const keys2 = set2.candidate_assessments[0]!.resource_requirements.map(
        (r) => r.key
      );
      assert.deepEqual(keys1, keys2);
    });
  });

  describe("outer applicability and specification validation", () => {
    it("outer no planning propagates", () => {
      const set = build132(
        mockRequirementSet({
          candidates: [
            {
              candidate_key: CAND_OUTER,
              status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(set.candidate_assessments[0]!.resource_requirements.length, 0);
    });

    it("outer no capability requirements propagates", () => {
      const set = build132(
        mockRequirementSet({
          candidates: [
            {
              candidate_key: CAND,
              status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });

    it("specification targeting outer candidate rejects", () => {
      assert.throws(
        () =>
          build132(
            mockRequirementSet({
              candidates: [
                {
                  candidate_key: CAND_OUTER,
                  status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
                },
              ],
            }),
            {
              candidate_requirement_sets: [
                { candidate_key: CAND_OUTER, requirements: [mockRequirement()] },
              ],
            }
          ),
        /requires an applicable Capability Requirement context/
      );
    });

    it("unknown candidate rejects", () => {
      assert.throws(
        () =>
          build132(mockRequirementSet(), {
            candidate_requirement_sets: [
              { candidate_key: "unknown", requirements: [mockRequirement()] },
            ],
          }),
        /not found in explicit capability requirement set/
      );
    });

    it("missing candidate entry valid absence", () => {
      const set = build132(mockRequirementSet());
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
      );
    });

    it("duplicate identical candidate declaration normalizes", () => {
      const spec = {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [mockRequirement()] },
          { candidate_key: CAND, requirements: [mockRequirement()] },
        ],
      };
      const normalized =
        normalizeAttentionObservationResourceRequirementSpecification(
          mockRequirementSet(),
          spec
        );
      assert.equal(normalized.candidate_requirement_sets.length, 1);
    });

    it("competing candidate requirement sets reject", () => {
      assert.throws(
        () =>
          build132(mockRequirementSet(), {
            candidate_requirement_sets: [
              {
                candidate_key: CAND,
                requirements: [mockRequirement({ resource_key: "A" })],
              },
              {
                candidate_key: CAND,
                requirements: [mockRequirement({ resource_key: "B" })],
              },
            ],
          }),
        /Conflicting Observation Resource Requirement sets/
      );
    });

    it("candidate entry order invariance", () => {
      const capSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: CAND,
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
          {
            candidate_key: CAND_2,
            requirements: [{ key: REQ_KEY_2, semantic: "human_inspection" }],
          },
        ],
      });
      const spec = {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [mockRequirement({ resource_key: "A" })],
          },
          {
            candidate_key: CAND_2,
            requirements: [mockRequirement({ resource_key: "B" })],
          },
        ],
      };
      const set1 = build132(capSet, spec);
      const set2 = build132(capSet, {
        candidate_requirement_sets: [...spec.candidate_requirement_sets].reverse(),
      });
      assert.deepEqual(
        set1.candidate_assessments.map((c) => c.resource_requirements),
        set2.candidate_assessments.map((c) => c.resource_requirements)
      );
    });
  });

  describe("candidate mixed behavior", () => {
    it("C1 explicit non-empty, C2 explicit empty, C3 absent, C4 outer coexist", () => {
      const capSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "c1",
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
          {
            candidate_key: "c2",
            requirements: [{ key: REQ_KEY_2, semantic: "human_inspection" }],
          },
          {
            candidate_key: "c3",
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
          {
            candidate_key: "c4",
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          },
        ],
      });
      const set = build132(capSet, {
        candidate_requirement_sets: [
          {
            candidate_key: "c1",
            requirements: [mockRequirement()],
          },
          { candidate_key: "c2", requirements: [] },
        ],
      });
      const byKey = new Map(
        set.candidate_assessments.map((c) => [c.candidate_key, c])
      );
      assert.equal(
        byKey.get("c1")!.status,
        "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT"
      );
      assert.equal(byKey.get("c1")!.has_observation_resource_requirements, true);
      assert.equal(
        byKey.get("c2")!.status,
        "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT"
      );
      assert.equal(byKey.get("c2")!.has_observation_resource_requirements, false);
      assert.equal(
        byKey.get("c3")!.status,
        "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
      );
      assert.equal(
        byKey.get("c4")!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });
  });

  describe("structural validation", () => {
    it("temporal structural validation valid_until after valid_from", () => {
      assert.throws(
        () =>
          build132(mockRequirementSet(), {
            candidate_requirement_sets: [
              {
                candidate_key: CAND,
                requirements: [
                  mockRequirement({
                    valid_from: AT_UNTIL,
                    valid_until: AT_FROM,
                  }),
                ],
              },
            ],
          }),
        /valid_until must be after valid_from/
      );
    });

    it("numeric structural validation rejects malformed POINT", () => {
      assert.throws(
        () =>
          build132(mockRequirementSet(), {
            candidate_requirement_sets: [
              {
                candidate_key: CAND,
                requirements: [
                  mockRequirement({
                    required_amount: { kind: "POINT", value: 0 },
                  }),
                ],
              },
            ],
          }),
        /greater than 0/
      );
    });

    it("RANGE amount declarative only", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [
              mockRequirement({ required_amount: amountRange(5, 10) }),
            ],
          },
        ],
      });
      assert.equal(
        set.candidate_assessments[0]!.resource_requirements[0]!.required_amount
          .kind,
        "RANGE"
      );
      assertNoReadinessSemantics(set);
    });
  });

  describe("determinism and immutability", () => {
    it("input immutability deepEqual", () => {
      const capSet = mockRequirementSet();
      const spec = {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [mockRequirement()] },
        ],
      };
      const capBefore = structuredClone(capSet);
      const specBefore = structuredClone(spec);
      build132(capSet, spec);
      assert.deepEqual(capSet, capBefore);
      assert.deepEqual(spec, specBefore);
    });

    it("deep-cloned equivalent inputs same output", () => {
      const capSet = mockRequirementSet();
      const spec = {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [mockRequirement()] },
        ],
      };
      const a = build132(structuredClone(capSet), structuredClone(spec));
      const b = build132(structuredClone(capSet), structuredClone(spec));
      assert.deepEqual(a, b);
    });

    it("repeated output deepEqual", () => {
      const capSet = mockRequirementSet();
      const spec = {
        candidate_requirement_sets: [
          { candidate_key: CAND, requirements: [mockRequirement()] },
        ],
      };
      const first = build132(capSet, spec);
      const second = build132(capSet, spec);
      assert.deepEqual(first, second);
    });
  });

  describe("exact resource_key semantics", () => {
    it("resource_key A != resource_key B unless exact equality", () => {
      const set = build132(mockRequirementSet(), {
        candidate_requirement_sets: [
          {
            candidate_key: CAND,
            requirements: [
              mockRequirement({ resource_key: "GPU" }),
              mockRequirement({ resource_key: "COMPUTE" }),
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.resource_requirements.length, 2);
      const keys = set.candidate_assessments[0]!.resource_requirements.map(
        (r) => r.key
      );
      assert.notEqual(keys[0], keys[1]);
    });
  });

  it("canonicalizeResourceRequirementKeys deterministic sort", () => {
    assert.deepEqual(
      canonicalizeResourceRequirementKeys(["b", "a", "a"]),
      ["a", "a", "b"]
    );
  });
});
