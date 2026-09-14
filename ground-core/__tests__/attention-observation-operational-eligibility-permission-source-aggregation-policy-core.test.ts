/**
 * GROUND-098 — Observation Core LII / Explicit Operational Eligibility
 * Permission Source Aggregation Policy Foundation
 *
 * Pure 084 Dimension Policy + explicit ANY/ALL aggregation-policy specification
 * (declarative only; no 093–097; no zero-source/vacuous truth; no result).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  attentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKey,
  buildAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySet,
  canonicalizePermissionSourceAggregationPolicyKind,
  normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-policy-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind } from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_B = "cand-b";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const POLICY_KEY_ALT = "084-oe-dimension-policy|cand|alt";

const ANY =
  "ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE" as const;
const ALL =
  "ALL_PERMISSION_SOURCES_LISTED_AS_ACCEPTABLE" as const;

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
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"accepted_permission_states"/.test(json));
  assert.ok(!/"permission_state_sources"/.test(json));
  assert.ok(!/"VETO_PROHIBITED"/.test(json));
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
    aggregation_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
  }[] = [{ candidate_key: CAND, aggregation_kind: ANY }]
) {
  return buildAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySet(
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

describe("GROUND-098 Explicit Operational Eligibility Permission Source Aggregation Policy", () => {
  describe("policy declaration semantics", () => {
    it("required PERMISSION + explicit ANY → PRESENT; no result", () => {
      const set = buildSet();
      const assessment = set.candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        assessment.has_explicit_permission_source_aggregation_policy,
        true
      );
      const aggregationPolicy =
        assessment.permission_source_aggregation_policy!;
      assert.equal(aggregationPolicy.aggregation_kind, ANY);
      assert.equal(aggregationPolicy.dimension, "PERMISSION");
      assert.equal(
        aggregationPolicy.operational_eligibility_dimension_policy_key,
        POLICY_KEY
      );
      assertNoForbiddenSemantics(set);
    });

    it("required PERMISSION + explicit ALL → PRESENT; no result", () => {
      const aggregationPolicy = buildSet(mockPolicy(), [
        { candidate_key: CAND, aggregation_kind: ALL },
      ]).candidate_assessments[0]!.permission_source_aggregation_policy!;
      assert.equal(aggregationPolicy.aggregation_kind, ALL);
      assert.ok(
        !/"AGGREGATION_CONDITION_HOLDS"/.test(JSON.stringify(aggregationPolicy))
      );
    });

    it("required PERMISSION + no policy → NO_POLICY; no default ANY/ALL", () => {
      const assessment = buildSet(mockPolicy(), []).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(
        assessment.has_explicit_permission_source_aggregation_policy,
        false
      );
      assert.equal(assessment.permission_source_aggregation_policy, null);
      assert.ok(!/"default"/.test(JSON.stringify(assessment)));
    });

    it("PERMISSION_PROHIBITED is not hidden veto vocabulary", () => {
      const set = buildSet(mockPolicy(), [
        { candidate_key: CAND, aggregation_kind: ANY },
      ]);
      assert.ok(!/"PERMISSION_PROHIBITED"/.test(JSON.stringify(set)));
      assert.ok(!/"VETO"/.test(JSON.stringify(set)));
    });
  });

  describe("normalization / conflicts / identity", () => {
    it("duplicate same kind normalizes; ANY+ALL conflict rejects; no merge", () => {
      const policySet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [mockPolicy()],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };

      const normalizedAny =
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification(
          policySet,
          {
            policies: [
              { candidate_key: CAND, aggregation_kind: ANY },
              { candidate_key: CAND, aggregation_kind: ANY },
            ],
          }
        );
      assert.equal(normalizedAny.policies.length, 1);
      assert.equal(normalizedAny.policies[0]!.aggregation_kind, ANY);

      const normalizedAll =
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification(
          policySet,
          {
            policies: [
              { candidate_key: CAND, aggregation_kind: ALL },
              { candidate_key: CAND, aggregation_kind: ALL },
            ],
          }
        );
      assert.equal(normalizedAll.policies.length, 1);
      assert.equal(normalizedAll.policies[0]!.aggregation_kind, ALL);

      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification(
          policySet,
          {
            policies: [
              { candidate_key: CAND, aggregation_kind: ANY },
              { candidate_key: CAND, aggregation_kind: ALL },
            ],
          }
        )
      );

      assert.equal(
        canonicalizePermissionSourceAggregationPolicyKind(ANY),
        ANY
      );
      assert.equal(
        canonicalizePermissionSourceAggregationPolicyKind(ALL),
        ALL
      );
    });

    it("kind / 084-policy / context change identity; source/match cannot", () => {
      const base =
        attentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKey(
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
        attentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            aggregation_kind: ALL,
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY_ALT,
            aggregation_kind: ANY,
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKey(
          {
            candidate_key: CAND_B,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            aggregation_kind: ANY,
          }
        )
      );
      assert.ok(!base.includes("permission_state_source"));
      assert.ok(!base.includes("acceptance-match"));
      assert.ok(!base.includes("source-count"));
    });
  });

  describe("outer status / invalid targets", () => {
    it("no planning / no Requirements / no policy → no aggregation policy", () => {
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
          { candidate_key: CAND, aggregation_kind: ANY },
        ])
      );
      assert.throws(() =>
        buildSet(
          mockPolicy({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          [{ candidate_key: CAND, aggregation_kind: ANY }]
        )
      );
      assert.throws(() =>
        buildSet(mockPolicy(), [
          { candidate_key: "unknown-cand", aggregation_kind: ANY },
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
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification(
          ambiguousSet,
          {
            policies: [{ candidate_key: CAND, aggregation_kind: ANY }],
          }
        )
      );
    });
  });

  describe("set boolean / independence", () => {
    it("set boolean true for ANY/ALL; false when absent", () => {
      assert.equal(
        buildSet(mockPolicy(), [
          { candidate_key: CAND, aggregation_kind: ANY },
        ]).has_explicit_permission_source_aggregation_policies,
        true
      );
      assert.equal(
        buildSet(mockPolicy(), [
          { candidate_key: CAND, aggregation_kind: ALL },
        ]).has_explicit_permission_source_aggregation_policies,
        true
      );
      assert.equal(
        buildSet(mockPolicy(), [])
          .has_explicit_permission_source_aggregation_policies,
        false
      );
    });

    it("Permission independent from Authority/Capability/Resource/Feasibility tokens in policy", () => {
      const json = JSON.stringify(
        buildSet().candidate_assessments[0]!
          .permission_source_aggregation_policy
      );
      assert.ok(!/"AUTHORITY"/.test(json));
      assert.ok(!/"RESOURCE_READINESS"/.test(json));
      assert.ok(!/"FEASIBILITY"/.test(json));
      assert.ok(!/"capability_state"/.test(json));
    });

    it("policy may exist without criterion/sources/matches conceptually", () => {
      const assessment = buildSet().candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.ok(!("accepted_permission_states" in assessment));
      assert.ok(!("permission_state_sources" in assessment));
      assert.ok(!("permission_source_acceptance_matches" in assessment));
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
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 093–097; no LISTED/execution/result/vacuous truth", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-aggregation-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-aggregation-policy-types.ts"
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
      assert.ok(!/"LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"NOT_LISTED_AS_ACCEPTABLE"/.test(src));
      assert.ok(!/"accepted_permission_states"/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));
      assert.ok(!/"AGGREGATION_CONDITION_HOLDS"/.test(src));
      assert.ok(!/"AGGREGATION_CONDITION_DOES_NOT_HOLD"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
      assert.ok(!/vacuous/.test(coreCode));
      assert.ok(!/source_count|sourceCount|sources\.length/.test(coreCode));

      // assess helper without set builder still works for NO_POLICY
      const noPolicy =
        assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicy(
          mockPolicy(),
          { policies: [] }
        );
      assert.equal(
        noPolicy.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED"
      );

      // multi-candidate isolation
      const multi =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySet(
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
              policies: [{ candidate_key: CAND, aggregation_kind: ANY }],
            },
          }
        );
      assert.equal(
        multi.candidate_assessments[0]!.status,
        "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        multi.candidate_assessments[1]!.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
    });
  });
});
