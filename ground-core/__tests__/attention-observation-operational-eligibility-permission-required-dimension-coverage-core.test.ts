/**
 * GROUND-094 — Observation Core XLVIII / Operational Eligibility Permission
 * Required Dimension Coverage Foundation
 *
 * Pure 084 Dimension Policy + 093 PERMISSION source bridge
 * (required ≠ represented; REPRESENTED ≠ accepted / PERMITTED;
 * NOT_REPRESENTED ≠ rejected / prohibited; no aggregation / OE / can_execute).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
  assertCompatibleOperationalEligibilityPermissionRequiredDimensionCoverageContexts,
  assessAttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverage,
  attentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageKey,
  buildAttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSet,
  buildCanonicalPermissionStateSourceKeySetKey,
} from "../reality/attention-observation-operational-eligibility-permission-required-dimension-coverage-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
} from "../reality/attention-observation-operational-eligibility-permission-state-source-types.js";
import type { AttentionObservationPermissionState } from "../reality/attention-observation-permission-state-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const NEED_KEY_2 = "need-b";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const SET_KEY_2 =
  "attention-observation-capability-requirement-set|cand|need|req-b";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const POLICY_KEY_ALT = "084-oe-dimension-policy|cand|alt";
const BINDING_KEY =
  "attention-observation-permission-context-binding|cand|need|set|actor|int";
const AT = "2026-08-24T11:00:00.000Z";

const PERMITTED = "PERMISSION_PERMITTED" as const;
const PROHIBITED = "PERMISSION_PROHIBITED" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY" as const;
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"has_permission"\s*:/.test(json));
  assert.ok(!/"is_permitted"/.test(json));
  assert.ok(!/"ANY_SOURCE"/.test(json));
  assert.ok(!/"ALL_SOURCES"/.test(json));
  assert.ok(!/"capability_state_source"/.test(json));
}

function mockPolicy(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
    | "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  required_dimensions?: AttentionObservationOperationalEligibilityDimension[];
  policy_key?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  const required_dimensions = options?.required_dimensions ?? [
    "CAPABILITY_STATE",
    "PERMISSION",
  ];
  const policy: AttentionObservationOperationalEligibilityDimensionPolicy | null =
    present
      ? {
          key: options?.policy_key ?? POLICY_KEY,
          candidate_key: options?.candidate_key ?? CAND,
          observation_need_key: options?.observation_need_key ?? NEED_KEY,
          capability_requirement_set_key: options?.set_key ?? SET_KEY,
          capability_requirement_keys: ["req"],
          required_dimensions,
        }
      : null;

  return {
    candidate_key: options?.candidate_key ?? CAND,
    capability_requirement_assessment: {} as never,
    status,
    operational_eligibility_dimension_policy: policy,
    model_limitations: [],
  };
}

function mockSourceBridge(options: {
  permission_state: AttentionObservationPermissionState;
  source_key?: string;
  binding_key?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationOperationalEligibilityPermissionStateSourceBridge {
  const candidate_key = options.candidate_key ?? CAND;
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const binding_key = options.binding_key ?? BINDING_KEY;
  return {
    key:
      options.source_key ??
      [
        "attention-observation-operational-eligibility-permission-state-source",
        candidate_key,
        observation_need_key,
        set_key,
        binding_key,
        `basis|${binding_key}`,
        AT,
        options.permission_state,
      ].join("|"),
    candidate_key,
    observation_need_key,
    capability_requirement_set_key: set_key,
    permission_context_binding_key: binding_key,
    dimension: "PERMISSION",
    permission_state_basis_key: `basis|${binding_key}`,
    permission_evaluation_at: AT,
    permission_state: options.permission_state,
  };
}

function mockSourceAssessment(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
    | "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  sources?: AttentionObservationOperationalEligibilityPermissionStateSourceBridge[];
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment {
  const status =
    options?.status ??
    "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  const present =
    status === "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  const sources = present
    ? (options?.sources ?? [
        mockSourceBridge({ permission_state: PERMITTED }),
      ])
    : [];

  return {
    candidate_key: options?.candidate_key ?? CAND,
    permission_state_assessment: {} as never,
    status,
    permission_state_sources: sources,
    has_permission_state_operational_eligibility_sources: sources.length > 0,
    model_limitations: [],
  };
}

function buildSet(
  policy = mockPolicy(),
  source = mockSourceAssessment()
) {
  return buildAttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSet(
    {
      operational_eligibility_dimension_policy_set: {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [policy],
        has_explicit_operational_eligibility_dimension_policies:
          policy.status ===
          "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
        model_limitations: [],
      },
      permission_state_source_set: {
        permission_state_set: {} as never,
        candidate_assessments: [source],
        has_permission_state_operational_eligibility_sources:
          source.has_permission_state_operational_eligibility_sources,
        model_limitations: [],
      },
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-094 Operational Eligibility Permission Required Dimension Coverage", () => {
  describe("required + source representation", () => {
    it("PERMISSION_PERMITTED source → REPRESENTED", () => {
      const set = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: PERMITTED })],
        })
      );
      const coverage =
        set.candidate_assessments[0]!.permission_required_dimension_coverage!;
      assert.equal(
        set.candidate_assessments[0]!.status,
        "REQUIRED_PERMISSION_DIMENSION_COVERAGE_PRESENT"
      );
      assert.equal(coverage.coverage, "REPRESENTED");
      assert.equal(coverage.dimension, "PERMISSION");
      assert.equal(
        coverage.operational_eligibility_dimension_policy_key,
        POLICY_KEY
      );
      assert.ok(coverage.permission_state_source_keys.length > 0);
      assertNoForbiddenSemantics(set);
    });

    it("PERMISSION_PROHIBITED source → REPRESENTED", () => {
      assert.equal(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            sources: [mockSourceBridge({ permission_state: PROHIBITED })],
          })
        ).candidate_assessments[0]!.permission_required_dimension_coverage!
          .coverage,
        "REPRESENTED"
      );
    });

    it("both UNRESOLVED sources → REPRESENTED", () => {
      for (const permission_state of [
        UNRESOLVED_POLICY,
        UNRESOLVED_MAPPING,
      ] as const) {
        assert.equal(
          buildSet(
            mockPolicy(),
            mockSourceAssessment({
              sources: [mockSourceBridge({ permission_state })],
            })
          ).candidate_assessments[0]!.permission_required_dimension_coverage!
            .coverage,
          "REPRESENTED"
        );
      }
    });

    it("mixed multiple sources → REPRESENTED; no aggregation", () => {
      const coverage = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|a`,
              source_key: "src-b",
            }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|b`,
              source_key: "src-a",
            }),
            mockSourceBridge({
              permission_state: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|c`,
              source_key: "src-c",
            }),
          ],
        })
      ).candidate_assessments[0]!.permission_required_dimension_coverage!;
      assert.equal(coverage.coverage, "REPRESENTED");
      assert.deepEqual(coverage.permission_state_source_keys, [
        "src-a",
        "src-b",
        "src-c",
      ]);
    });

    it("required + zero sources → NOT_REPRESENTED", () => {
      const set = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      );
      const coverage =
        set.candidate_assessments[0]!.permission_required_dimension_coverage!;
      assert.equal(coverage.coverage, "NOT_REPRESENTED");
      assert.deepEqual(coverage.permission_state_source_keys, []);
      assert.equal(
        set.candidate_assessments[0]!
          .has_permission_required_dimension_coverage,
        true
      );
    });

    it("required + no evaluation instant → NOT_REPRESENTED", () => {
      assert.equal(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            status: "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED",
          })
        ).candidate_assessments[0]!.permission_required_dimension_coverage!
          .coverage,
        "NOT_REPRESENTED"
      );
    });

    it("UNRESOLVED source != NOT_REPRESENTED; PROHIBITED != NOT_REPRESENTED", () => {
      assert.notEqual(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            sources: [
              mockSourceBridge({ permission_state: UNRESOLVED_POLICY }),
            ],
          })
        ).candidate_assessments[0]!.permission_required_dimension_coverage!
          .coverage,
        "NOT_REPRESENTED"
      );
      assert.notEqual(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            sources: [mockSourceBridge({ permission_state: PROHIBITED })],
          })
        ).candidate_assessments[0]!.permission_required_dimension_coverage!
          .coverage,
        "NOT_REPRESENTED"
      );
    });
  });

  describe("policy presence / requirement", () => {
    it("PERMISSION not required → NOT_REQUIRED; coverage null", () => {
      const set = buildSet(
        mockPolicy({ required_dimensions: ["CAPABILITY_STATE"] }),
        mockSourceAssessment()
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_required_dimension_coverage,
        null
      );
      assert.equal(
        set.candidate_assessments[0]!
          .has_permission_required_dimension_coverage,
        false
      );
    });

    it("explicit empty 084 policy → NOT_REQUIRED (not NO_POLICY)", () => {
      const set = buildSet(
        mockPolicy({ required_dimensions: [] }),
        mockSourceAssessment({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.notEqual(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
    });

    it("policy absent → NO_POLICY; coverage null", () => {
      const set = buildSet(
        mockPolicy({
          status: "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
        }),
        mockSourceAssessment()
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_required_dimension_coverage,
        null
      );
    });

    it("policy absence != not required; not required != NOT_REPRESENTED", () => {
      const absent = buildSet(
        mockPolicy({
          status: "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
        }),
        mockSourceAssessment({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      ).candidate_assessments[0]!.status;
      const notRequired = buildSet(
        mockPolicy({ required_dimensions: ["AUTHORITY"] }),
        mockSourceAssessment({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      ).candidate_assessments[0]!.status;
      const notRepresented = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      ).candidate_assessments[0]!;
      assert.notEqual(absent, notRequired);
      assert.notEqual(notRequired, notRepresented.status);
      assert.equal(
        notRepresented.permission_required_dimension_coverage!.coverage,
        "NOT_REPRESENTED"
      );
    });

    it("source exists but dimension not required → still NOT_REQUIRED", () => {
      const set = buildSet(
        mockPolicy({ required_dimensions: ["FEASIBILITY"] }),
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: PERMITTED })],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_required_dimension_coverage,
        null
      );
    });
  });

  describe("identity / lineage / join", () => {
    it("retains policy key and source keys; source order invariant", () => {
      const a = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: PERMITTED,
              source_key: "z-src",
            }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|b`,
              source_key: "a-src",
            }),
          ],
        })
      ).candidate_assessments[0]!.permission_required_dimension_coverage!;
      const b = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|b`,
              source_key: "a-src",
            }),
            mockSourceBridge({
              permission_state: PERMITTED,
              source_key: "z-src",
            }),
          ],
        })
      ).candidate_assessments[0]!.permission_required_dimension_coverage!;
      assert.deepEqual(a.permission_state_source_keys, ["a-src", "z-src"]);
      assert.equal(a.key, b.key);
      assert.equal(
        a.key,
        attentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageKey(
          CAND,
          NEED_KEY,
          SET_KEY,
          POLICY_KEY,
          "REPRESENTED",
          buildCanonicalPermissionStateSourceKeySetKey(["a-src", "z-src"])
        )
      );
    });

    it("source-set / policy / context change identity", () => {
      const base = buildSet().candidate_assessments[0]!
        .permission_required_dimension_coverage!.key;
      assert.notEqual(
        base,
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            sources: [
              mockSourceBridge({
                permission_state: PERMITTED,
                source_key: "other-src",
              }),
            ],
          })
        ).candidate_assessments[0]!.permission_required_dimension_coverage!.key
      );
      assert.notEqual(
        base,
        buildSet(
          mockPolicy({ policy_key: POLICY_KEY_ALT }),
          mockSourceAssessment()
        ).candidate_assessments[0]!.permission_required_dimension_coverage!.key
      );
      assert.notEqual(
        base,
        buildSet(
          mockPolicy({ observation_need_key: NEED_KEY_2, set_key: SET_KEY_2 }),
          mockSourceAssessment({
            sources: [
              mockSourceBridge({
                permission_state: PERMITTED,
                observation_need_key: NEED_KEY_2,
                set_key: SET_KEY_2,
              }),
            ],
          })
        ).candidate_assessments[0]!.permission_required_dimension_coverage!.key
      );
    });

    it("boolean true for REPRESENTED and NOT_REPRESENTED; false for NOT_REQUIRED/NO_POLICY", () => {
      assert.equal(
        buildSet().candidate_assessments[0]!
          .has_permission_required_dimension_coverage,
        true
      );
      assert.equal(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
          })
        ).has_permission_required_dimension_coverages,
        true
      );
      assert.equal(
        buildSet(
          mockPolicy({ required_dimensions: ["AUTHORITY"] })
        ).has_permission_required_dimension_coverages,
        false
      );
      assert.equal(
        buildSet(
          mockPolicy({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          })
        ).has_permission_required_dimension_coverages,
        false
      );
    });

    it("no planning / no Requirements", () => {
      assert.equal(
        buildSet(
          mockPolicy({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          }),
          mockSourceAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        buildSet(
          mockPolicy({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          }),
          mockSourceAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });

    it("candidate mismatch / missing counterpart rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverage(
          mockPolicy({ candidate_key: "a" }),
          mockSourceAssessment({ candidate_key: "b" })
        )
      );
      assert.throws(() =>
        assertCompatibleOperationalEligibilityPermissionRequiredDimensionCoverageContexts(
          {
            capability_requirement_set: {} as never,
            specification: { policies: [] },
            candidate_assessments: [mockPolicy()],
            has_explicit_operational_eligibility_dimension_policies: true,
            model_limitations: [],
          },
          {
            permission_state_set: {} as never,
            candidate_assessments: [
              mockSourceAssessment(),
              mockSourceAssessment({ candidate_key: "extra" }),
            ],
            has_permission_state_operational_eligibility_sources: true,
            model_limitations: [],
          }
        )
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        operational_eligibility_dimension_policy_set: {
          capability_requirement_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [mockPolicy()],
          has_explicit_operational_eligibility_dimension_policies: true,
          model_limitations: [],
        },
        permission_state_source_set: {
          permission_state_set: {} as never,
          candidate_assessments: [mockSourceAssessment()],
          has_permission_state_operational_eligibility_sources: true,
          model_limitations: [],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 091/085/024–090; no acceptance/aggregation/OE result", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-required-dimension-coverage-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-required-dimension-coverage-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(
        /attention-observation-operational-eligibility-dimension-policy-types/.test(
          core
        )
      );
      assert.ok(
        /attention-observation-operational-eligibility-permission-state-source-types/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*permission-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*permission-state-types/.test(src)
      );
      assert.ok(
        !/from ["'].*operational-eligibility-capability-state-source/.test(src)
      );
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(
        !/from ["'].*declared-permission-/.test(src)
      );
      assert.ok(
        !/from ["'].*permission-context-binding-core/.test(src)
      );
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/from ["'].*\.\.\/types/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/ANY_SOURCE|ALL_SOURCES/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
    });
  });
});
