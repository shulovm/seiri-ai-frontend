/**
 * GROUND-123 — Observation Core LXXVII / Explicit Operational Eligibility
 * AUTHORITY Source Aggregation Readiness Policy Foundation
 *
 * Pure 084 Dimension Policy + explicit non-empty-match-set readiness-policy
 * specification (declarative only; no 117–122; no HOLDS/result/vacuous truth).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy,
  attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKey,
  buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySet,
  canonicalizeAuthoritySourceAggregationReadinessPolicyKind,
  normalizeAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind } from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-types.js";
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
  "REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION" as const;

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
  assert.ok(!/"READINESS_CONDITION_HOLDS"/.test(json));
  assert.ok(!/"READINESS_CONDITION_DOES_NOT_HOLD"/.test(json));
  assert.ok(!/"READINESS_HOLDS"/.test(json));
  assert.ok(!/"READINESS_DOES_NOT_HOLD"/.test(json));
  assert.ok(!/"AGGREGATION_CONDITION_HOLDS"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE"/.test(json));
  assert.ok(!/"ALL_AUTHORITY_SOURCES_LISTED_AS_ACCEPTABLE"/.test(json));
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
    "AUTHORITY",
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
    readiness_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind;
  }[] = [{ candidate_key: CAND, readiness_kind: NON_EMPTY }]
) {
  return buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySet(
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
  return structuredClone(value);
}

describe("GROUND-123 Explicit Operational Eligibility AUTHORITY Source Aggregation Readiness Policy", () => {
  describe("policy declaration semantics", () => {
    it("required AUTHORITY + explicit readiness policy → PRESENT; no HOLDS", () => {
      const set = buildSet();
      const assessment = set.candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
      );
      assert.equal(
        assessment.has_explicit_authority_source_aggregation_readiness_policy,
        true
      );
      const readinessPolicy =
        assessment.authority_source_aggregation_readiness_policy!;
      assert.equal(readinessPolicy.readiness_kind, NON_EMPTY);
      assert.equal(readinessPolicy.dimension, "AUTHORITY");
      assert.equal(
        readinessPolicy.operational_eligibility_dimension_policy_key,
        POLICY_KEY
      );
      assertNoForbiddenSemantics(set);
    });

    it("required AUTHORITY + no readiness policy → NO_POLICY; no DOES_NOT_HOLD", () => {
      const assessment = buildSet(mockPolicy(), []).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
      );
      assert.equal(
        assessment.has_explicit_authority_source_aggregation_readiness_policy,
        false
      );
      assert.equal(
        assessment.authority_source_aggregation_readiness_policy,
        null
      );
      assert.ok(!/"DOES_NOT_HOLD"/.test(JSON.stringify(assessment)));
    });

    it("exact readiness kind only; canonicalize accepts it", () => {
      assert.equal(
        canonicalizeAuthoritySourceAggregationReadinessPolicyKind(NON_EMPTY),
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
        normalizeAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification(
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

    it("084 policy-key / context change identity; 122 ANY/ALL do not", () => {
      const base =
        attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            readiness_kind: NON_EMPTY,
          }
        );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY_ALT,
            readiness_kind: NON_EMPTY,
          }
        )
      );
      assert.ok(!base.includes("authority_source"));
      assert.ok(!base.includes("acceptance-match"));
      assert.ok(!base.includes("aggregation-policy"));
      assert.ok(!base.includes("ANY_AUTHORITY"));
      assert.ok(!base.includes("ALL_AUTHORITY"));
      assert.ok(!base.includes("LISTED_AS_ACCEPTABLE"));
      assert.ok(!base.includes("NOT_LISTED"));
    });
  });

  describe("outer status / invalid targets", () => {
    it("no planning / no Requirements / no policy → no readiness policy", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      ] as const) {
        assert.equal(
          buildSet(mockPolicy({ status }), []).candidate_assessments[0]!.status,
          status
        );
      }
    });

    it("AUTHORITY not required / explicit empty 084 → NOT_REQUIRED", () => {
      assert.equal(
        buildSet(mockPolicy({ required_dimensions: ["PERMISSION"] }), [])
          .candidate_assessments[0]!.status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        buildSet(mockPolicy({ required_dimensions: [] }), []).candidate_assessments[0]!
          .status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
    });

    it("invalid targets reject", () => {
      assert.throws(() =>
        buildSet(mockPolicy({ required_dimensions: ["PERMISSION"] }), [
          { candidate_key: CAND, readiness_kind: NON_EMPTY },
        ])
      );
      assert.throws(() =>
        buildSet(
          mockPolicy({
            status: "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          [{ candidate_key: CAND, readiness_kind: NON_EMPTY }]
        )
      );
      assert.throws(() =>
        buildSet(mockPolicy(), [
          { candidate_key: "unknown", readiness_kind: NON_EMPTY },
        ])
      );
    });
  });

  describe("set boolean / 122 independence", () => {
    it("set boolean true when present; false when absent", () => {
      assert.equal(
        buildSet().has_explicit_authority_source_aggregation_readiness_policies,
        true
      );
      assert.equal(
        buildSet(mockPolicy(), [])
          .has_explicit_authority_source_aggregation_readiness_policies,
        false
      );
    });

    it("aggregation policy absent + readiness policy present → PRESENT", () => {
      const assessment = buildSet().candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
      );
      assert.ok(!("aggregation_kind" in assessment));
    });

    it("aggregation policy present conceptually does not create readiness policy", () => {
      const absent = buildSet(mockPolicy(), []).candidate_assessments[0]!;
      assert.equal(
        absent.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
      );
    });

    it("policy may exist without 122/120/121/117 conceptually", () => {
      const assessment = buildSet().candidate_assessments[0]!;
      assert.ok(!("accepted_canonical_authority_states" in assessment));
      assert.ok(!("authority_sources" in assessment));
      assert.ok(!("authority_source_acceptance_matches" in assessment));
      assert.ok(!("aggregation_kind" in assessment));
    });

    it("structural non-empty rule is polarity-independent", () => {
      const kind = buildSet().candidate_assessments[0]!
        .authority_source_aggregation_readiness_policy!.readiness_kind;
      assert.equal(kind, NON_EMPTY);
      assert.ok(!kind.includes("LISTED"));
      assert.ok(!kind.includes("RESOLVED"));
      assert.ok(!kind.includes("NEGATIVE"));
      assert.ok(kind.includes("NON_EMPTY"));
      assert.ok(kind.includes("MATCH_SET"));
    });

    it("zero current matches does not block policy declaration", () => {
      const assessment =
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy(
          mockPolicy(),
          { policies: [{ candidate_key: CAND, readiness_kind: NON_EMPTY }] }
        );
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
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
        specification: {
          policies: [{ candidate_key: CAND, readiness_kind: NON_EMPTY }],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; 084 only; no 117–122; no HOLDS/match-count/result", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-types.ts"
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
      assert.ok(!/authority-source-bridge/.test(src));
      assert.ok(!/authority-required-dimension-coverage/.test(src));
      assert.ok(!/authority-source-resolution-classification/.test(src));
      assert.ok(!/authority-source-acceptance-criteria/.test(src));
      assert.ok(!/authority-source-acceptance-match/.test(src));
      assert.ok(
        !/from ["'].*authority-source-aggregation-policy-/.test(src)
      );
      assert.ok(!/from ["'].*canonical-authority-state-core/.test(src));
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/"READINESS_CONDITION_HOLDS"/.test(src));
      assert.ok(!/"READINESS_CONDITION_DOES_NOT_HOLD"/.test(src));
      assert.ok(!/"LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"NOT_LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"ALL_AUTHORITY_SOURCES_LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));
      assert.ok(!/vacuous/.test(coreCode));
      assert.ok(!/source_count|sourceCount|authority_sources|acceptance_matches/.test(coreCode));

      const noPolicy =
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy(
          mockPolicy(),
          { policies: [] }
        );
      assert.equal(
        noPolicy.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
      );
    });
  });
});
