/**
 * GROUND-122 — Observation Core LXXVI / Explicit Operational Eligibility
 * AUTHORITY Source Aggregation Policy Foundation
 *
 * Pure 084 Dimension Policy + explicit ANY/ALL aggregation-policy specification
 * (declarative only; no 117–121; no zero-match/vacuous truth; no result).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  attentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKey,
  buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySet,
  canonicalizeAuthoritySourceAggregationPolicyKind,
  normalizeAttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-policy-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind } from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_B = "cand-b";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const POLICY_KEY_ALT = "084-oe-dimension-policy|cand|alt";

const ANY = "ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE" as const;
const ALL = "ALL_AUTHORITY_SOURCES_LISTED_AS_ACCEPTABLE" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"LISTED_AS_ACCEPTABLE"/.test(json));
  assert.ok(!/"NOT_LISTED_AS_ACCEPTABLE"/.test(json));
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"RESOLVED"/.test(json));
  assert.ok(!/"AGGREGATION_CONDITION_HOLDS"/.test(json));
  assert.ok(!/"AGGREGATION_CONDITION_DOES_NOT_HOLD"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"authority_sources"/.test(json));
  assert.ok(!/"authority_source_acceptance_matches"/.test(json));
  assert.ok(!/"VETO"/.test(json));
  assert.ok(!/"MAJORITY"/.test(json));
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
    aggregation_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
  }[] = [{ candidate_key: CAND, aggregation_kind: ANY }]
) {
  return buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySet(
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

describe("GROUND-122 Explicit Operational Eligibility AUTHORITY Source Aggregation Policy", () => {
  describe("policy declaration semantics", () => {
    it("required AUTHORITY + explicit ANY → PRESENT; no result", () => {
      const set = buildSet();
      const assessment = set.candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        assessment.has_explicit_authority_source_aggregation_policy,
        true
      );
      const aggregationPolicy =
        assessment.authority_source_aggregation_policy!;
      assert.equal(aggregationPolicy.aggregation_kind, ANY);
      assert.equal(aggregationPolicy.dimension, "AUTHORITY");
      assert.equal(
        aggregationPolicy.operational_eligibility_dimension_policy_key,
        POLICY_KEY
      );
      assertNoForbiddenSemantics(set);
    });

    it("required AUTHORITY + explicit ALL → PRESENT; no result", () => {
      const aggregationPolicy = buildSet(mockPolicy(), [
        { candidate_key: CAND, aggregation_kind: ALL },
      ]).candidate_assessments[0]!.authority_source_aggregation_policy!;
      assert.equal(aggregationPolicy.aggregation_kind, ALL);
      assert.ok(
        !/"AGGREGATION_CONDITION_HOLDS"/.test(JSON.stringify(aggregationPolicy))
      );
    });

    it("required AUTHORITY + no policy → NO_POLICY; no default ANY/ALL", () => {
      const assessment = buildSet(mockPolicy(), []).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(
        assessment.has_explicit_authority_source_aggregation_policy,
        false
      );
      assert.equal(assessment.authority_source_aggregation_policy, null);
    });

    it("AUTHORITY required != implicit ALL", () => {
      const assessment = buildSet(mockPolicy(), []).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(assessment.authority_source_aggregation_policy, null);
      assert.ok(
        !assessment.has_explicit_authority_source_aggregation_policy
      );
    });

    it("no negative/NOT_LISTED veto vocabulary", () => {
      const json = JSON.stringify(buildSet());
      assert.ok(!/"EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"/.test(json));
      assert.ok(!/"VETO"/.test(json));
      assert.ok(!/"NOT_LISTED"/.test(json));
    });
  });

  describe("normalization / conflicts / identity", () => {
    it("duplicate same kind normalizes; ANY+ALL conflict rejects", () => {
      const policySet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [mockPolicy()],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };

      assert.equal(
        normalizeAttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySpecification(
          policySet,
          {
            policies: [
              { candidate_key: CAND, aggregation_kind: ANY },
              { candidate_key: CAND, aggregation_kind: ANY },
            ],
          }
        ).policies.length,
        1
      );

      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySpecification(
          policySet,
          {
            policies: [
              { candidate_key: CAND, aggregation_kind: ANY },
              { candidate_key: CAND, aggregation_kind: ALL },
            ],
          }
        )
      );

      assert.equal(canonicalizeAuthoritySourceAggregationPolicyKind(ANY), ANY);
      assert.equal(canonicalizeAuthoritySourceAggregationPolicyKind(ALL), ALL);
    });

    it("ANY identity != ALL identity; no source/match in key", () => {
      const base =
        attentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            aggregation_kind: ANY,
          }
        );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            aggregation_kind: ALL,
          }
        )
      );
      assert.ok(!base.includes("authority_source"));
      assert.ok(!base.includes("acceptance-match"));
      assert.ok(!base.includes("match-count"));
    });
  });

  describe("outer status / invalid targets", () => {
    it("no planning / no Requirements / no policy → no aggregation policy", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      ] as const) {
        assert.equal(
          buildSet(mockPolicy({ status }), []).candidate_assessments[0]!
            .status,
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
          { candidate_key: CAND, aggregation_kind: ANY },
        ])
      );
      assert.throws(() =>
        buildSet(
          mockPolicy({
            status: "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          [{ candidate_key: CAND, aggregation_kind: ANY }]
        )
      );
      assert.throws(() =>
        buildSet(mockPolicy(), [
          { candidate_key: "unknown", aggregation_kind: ANY },
        ])
      );
    });
  });

  describe("set boolean / independence", () => {
    it("set boolean true for ANY/ALL; false when absent", () => {
      assert.equal(
        buildSet(mockPolicy(), [{ candidate_key: CAND, aggregation_kind: ANY }])
          .has_explicit_authority_source_aggregation_policies,
        true
      );
      assert.equal(
        buildSet(mockPolicy(), [{ candidate_key: CAND, aggregation_kind: ALL }])
          .has_explicit_authority_source_aggregation_policies,
        true
      );
      assert.equal(
        buildSet(mockPolicy(), [])
          .has_explicit_authority_source_aggregation_policies,
        false
      );
    });

    it("policy may exist without sources/matches/criterion conceptually", () => {
      const assessment = buildSet().candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.ok(!("accepted_canonical_authority_states" in assessment));
      assert.ok(!("authority_sources" in assessment));
      assert.ok(!("authority_source_acceptance_matches" in assessment));
    });

    it("zero current matches does not block policy declaration", () => {
      const assessment = assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicy(
        mockPolicy(),
        { policies: [{ candidate_key: CAND, aggregation_kind: ALL }] }
      );
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        assessment.authority_source_aggregation_policy!.aggregation_kind,
        ALL
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
          policies: [{ candidate_key: CAND, aggregation_kind: ALL }],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; 084 only; no 117–121; no LISTED/execution/result", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-aggregation-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-aggregation-policy-types.ts"
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
      assert.ok(!/from ["'].*canonical-authority-state-core/.test(src));
      assert.ok(!/from ["'].*canonical-authority-state-types/.test(coreCode));
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/"LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"NOT_LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));
      assert.ok(!/"AGGREGATION_CONDITION_HOLDS"/.test(src));
      assert.ok(!/vacuous/.test(coreCode));
      assert.ok(!/source_count|sourceCount|authority_sources|acceptance_matches/.test(coreCode));
      assert.ok(!/matchOperationalEligibility/.test(coreCode));
    });
  });
});
