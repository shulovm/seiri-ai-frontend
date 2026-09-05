/**
 * GROUND-099 — Observation Core LIII / Explicit Operational Eligibility
 * Permission Source Aggregation Readiness Policy Foundation
 *
 * Pure 084 Dimension Policy + explicit non-empty-match-set readiness-policy
 * specification (declarative only; no 093–098; no READY/result/vacuous truth).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy,
  attentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKey,
  buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySet,
  canonicalizePermissionSourceAggregationReadinessPolicyKind,
  normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind } from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_B = "cand-b";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const POLICY_KEY_ALT = "084-oe-dimension-policy|cand|alt";

const NON_EMPTY =
  "REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"LISTED_AS_ACCEPTABLE"/.test(json));
  assert.ok(!/"NOT_LISTED_AS_ACCEPTABLE"/.test(json));
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"RESOLVED"/.test(json));
  assert.ok(!/"AGGREGATION_CONDITION_HOLDS"/.test(json));
  assert.ok(!/"AGGREGATION_CONDITION_DOES_NOT_HOLD"/.test(json));
  assert.ok(!/"READINESS_HOLDS"/.test(json));
  assert.ok(!/"READINESS_DOES_NOT_HOLD"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"accepted_permission_states"/.test(json));
  assert.ok(!/"permission_state_sources"/.test(json));
  assert.ok(!/"ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE"/.test(json));
  assert.ok(!/"ALL_PERMISSION_SOURCES_LISTED_AS_ACCEPTABLE"/.test(json));
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

function buildSet(
  policy = mockPolicy(),
  policies: {
    candidate_key: string;
    readiness_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKind;
  }[] = [{ candidate_key: CAND, readiness_kind: NON_EMPTY }]
) {
  return buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySet(
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
      specification: { policies },
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-099 Explicit Operational Eligibility Permission Source Aggregation Readiness Policy", () => {
  describe("policy declaration semantics", () => {
    it("required PERMISSION + explicit readiness policy → PRESENT; no READY", () => {
      const set = buildSet();
      const assessment = set.candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
      );
      assert.equal(
        assessment.has_explicit_permission_source_aggregation_readiness_policy,
        true
      );
      const readinessPolicy =
        assessment.permission_source_aggregation_readiness_policy!;
      assert.equal(readinessPolicy.readiness_kind, NON_EMPTY);
      assert.equal(readinessPolicy.dimension, "PERMISSION");
      assert.equal(
        readinessPolicy.operational_eligibility_dimension_policy_key,
        POLICY_KEY
      );
      assertNoForbiddenSemantics(set);
    });

    it("required PERMISSION + no readiness policy → NO_POLICY; no NOT_READY", () => {
      const assessment = buildSet(mockPolicy(), []).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
      );
      assert.equal(
        assessment.has_explicit_permission_source_aggregation_readiness_policy,
        false
      );
      assert.equal(
        assessment.permission_source_aggregation_readiness_policy,
        null
      );
      assert.ok(!/"NOT_READY"/.test(JSON.stringify(assessment)));
    });

    it("exact readiness kind only; canonicalize accepts it", () => {
      assert.equal(
        canonicalizePermissionSourceAggregationReadinessPolicyKind(NON_EMPTY),
        NON_EMPTY
      );
      assert.equal(
        buildSet().candidate_assessments[0]!
          .permission_source_aggregation_readiness_policy!.readiness_kind,
        NON_EMPTY
      );
    });
  });

  describe("normalization / identity independence", () => {
    it("duplicate identical policy normalizes", () => {
      const policySet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [mockPolicy()],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };
      const normalized =
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySpecification(
          policySet,
          {
            policies: [
              { candidate_key: CAND, readiness_kind: NON_EMPTY },
              { candidate_key: CAND, readiness_kind: NON_EMPTY },
            ],
          }
        );
      assert.equal(normalized.policies.length, 1);
      assert.equal(normalized.policies[0]!.readiness_kind, NON_EMPTY);
    });

    it("084 policy-key / context change identity; source/match/098 do not", () => {
      const base =
        attentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            readiness_kind: NON_EMPTY,
          }
        );
      const same =
        attentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            readiness_kind: NON_EMPTY,
          }
        );
      assert.equal(base, same);
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY_ALT,
            readiness_kind: NON_EMPTY,
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyKey(
          {
            candidate_key: CAND_B,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            readiness_kind: NON_EMPTY,
          }
        )
      );
      assert.ok(!base.includes("permission_state_source"));
      assert.ok(!base.includes("acceptance-match"));
      assert.ok(!base.includes("aggregation-policy"));
      assert.ok(!base.includes("ANY_PERMISSION"));
      assert.ok(!base.includes("ALL_PERMISSION"));
      assert.ok(!base.includes("source-count"));
      assert.ok(!base.includes("LISTED_AS_ACCEPTABLE"));
      assert.ok(!base.includes("NOT_LISTED"));
    });
  });

  describe("outer status / invalid targets", () => {
    it("no planning / no Requirements / no policy → no readiness policy", () => {
      assert.equal(
        buildSet(
          mockPolicy({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          }),
          []
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        buildSet(
          mockPolicy({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          }),
          []
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        buildSet(
          mockPolicy({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          []
        ).candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
    });

    it("PERMISSION not required / explicit empty 084 policy → NOT_REQUIRED", () => {
      assert.equal(
        buildSet(
          mockPolicy({ required_dimensions: ["AUTHORITY"] }),
          []
        ).candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        buildSet(
          mockPolicy({ required_dimensions: [] }),
          []
        ).candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
    });

    it("specification targeting not-required / policy-absent / unknown / ambiguous → reject", () => {
      assert.throws(() =>
        buildSet(mockPolicy({ required_dimensions: ["AUTHORITY"] }), [
          { candidate_key: CAND, readiness_kind: NON_EMPTY },
        ])
      );
      assert.throws(() =>
        buildSet(
          mockPolicy({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          [{ candidate_key: CAND, readiness_kind: NON_EMPTY }]
        )
      );
      assert.throws(() =>
        buildSet(mockPolicy(), [
          { candidate_key: "unknown-cand", readiness_kind: NON_EMPTY },
        ])
      );

      const ambiguousSet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [
          mockPolicy({ candidate_key: CAND }),
          mockPolicy({
            candidate_key: CAND,
            policy_key: POLICY_KEY_ALT,
            observation_need_key: "need-other",
          }),
        ],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };
      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySpecification(
          ambiguousSet,
          {
            policies: [{ candidate_key: CAND, readiness_kind: NON_EMPTY }],
          }
        )
      );
    });
  });

  describe("set boolean / independence", () => {
    it("set boolean true when present; false when absent", () => {
      assert.equal(
        buildSet().has_explicit_permission_source_aggregation_readiness_policies,
        true
      );
      assert.equal(
        buildSet(mockPolicy(), [])
          .has_explicit_permission_source_aggregation_readiness_policies,
        false
      );
    });

    it("policy may exist without 098/096/093/097 conceptually", () => {
      const assessment = buildSet().candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
      );
      assert.ok(!("aggregation_kind" in assessment));
      assert.ok(!("accepted_permission_states" in assessment));
      assert.ok(!("permission_state_sources" in assessment));
      assert.ok(!("permission_source_acceptance_matches" in assessment));
    });

    it("structural non-empty rule is polarity-independent (static semantic)", () => {
      const kind = buildSet().candidate_assessments[0]!
        .permission_source_aggregation_readiness_policy!.readiness_kind;
      assert.equal(kind, NON_EMPTY);
      assert.ok(!kind.includes("LISTED"));
      assert.ok(!kind.includes("RESOLVED"));
      assert.ok(!kind.includes("PERMITTED"));
      assert.ok(kind.includes("NON_EMPTY"));
      assert.ok(kind.includes("MATCH_SET"));
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
        specification: {
          policies: [{ candidate_key: CAND, readiness_kind: NON_EMPTY }],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 093–098; no READY/match-count/result/vacuous truth", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(
        /attention-observation-operational-eligibility-dimension-policy-types/.test(
          core
        )
      );
      assert.ok(!/permission-state-source/.test(src));
      assert.ok(!/permission-required-dimension-coverage/.test(src));
      assert.ok(!/permission-source-resolution-classification/.test(src));
      assert.ok(!/permission-source-acceptance-criteria/.test(src));
      assert.ok(!/permission-source-acceptance-match/.test(src));
      // Do not import 098 aggregation-policy modules (filename contains
      // aggregation-policy without readiness).
      assert.ok(
        !/from ["'].*permission-source-aggregation-policy-/.test(src)
      );
      assert.ok(!/from ["'].*permission-state-core/.test(src));
      assert.ok(!/from ["'].*permission-state-types/.test(src));
      assert.ok(!/from ["'].*declared-permission-/.test(src));
      assert.ok(!/from ["'].*permission-context-binding/.test(src));
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(
        !/from ["'].*operational-eligibility-capability-state-source/.test(src)
      );
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/from ["'].*\.\.\/types/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));
      assert.ok(!/"READY"/.test(src));
      assert.ok(!/"NOT_READY"/.test(src));
      assert.ok(!/"LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"NOT_LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"ALL_PERMISSION_SOURCES_LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"accepted_permission_states"/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));
      assert.ok(!/"AGGREGATION_CONDITION_HOLDS"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
      assert.ok(!/vacuous/.test(coreCode));
      assert.ok(!/source_count|sourceCount|sources\.length|matches\.length/.test(coreCode));

      const noPolicy =
        assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy(
          mockPolicy(),
          { policies: [] }
        );
      assert.equal(
        noPolicy.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
      );

      const multi =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySet(
          {
            operational_eligibility_dimension_policy_set: {
              capability_requirement_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [
                mockPolicy(),
                mockPolicy({
                  candidate_key: CAND_B,
                  policy_key: "084-oe-dimension-policy|cand-b",
                  set_key:
                    "attention-observation-capability-requirement-set|cand-b|need|req",
                }),
              ],
              has_explicit_operational_eligibility_dimension_policies: true,
              model_limitations: [],
            },
            specification: {
              policies: [{ candidate_key: CAND, readiness_kind: NON_EMPTY }],
            },
          }
        );
      assert.equal(
        multi.candidate_assessments[0]!.status,
        "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
      );
      assert.equal(
        multi.candidate_assessments[1]!.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
      );
    });
  });
});
