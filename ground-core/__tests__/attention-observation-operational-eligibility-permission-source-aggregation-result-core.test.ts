/**
 * GROUND-101 — Observation Core LV / Operational Eligibility Permission
 * Source Aggregation Result Foundation
 *
 * Pure 097 match set + 098 aggregation policy + 100 readiness Basis
 * (ANY/ALL only under readiness HOLDS; no vacuous truth).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
  assertCompatibleOperationalEligibilityPermissionSourceAggregationResultContexts,
  assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResult,
  attentionObservationOperationalEligibilityPermissionSourceAggregationResultKey,
  buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet,
  evaluatePermissionSourceAggregationCondition,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-result-core.js";
import {
  buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSet,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch,
} from "../reality/attention-observation-operational-eligibility-permission-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const AGG_POLICY_KEY =
  "attention-observation-operational-eligibility-permission-source-aggregation-policy|cand|need|set|084|PERMISSION|ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE";
const AGG_POLICY_KEY_ALL =
  "attention-observation-operational-eligibility-permission-source-aggregation-policy|cand|need|set|084|PERMISSION|ALL_PERMISSION_SOURCES_LISTED_AS_ACCEPTABLE";
const READY_POLICY_KEY =
  "attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy|cand|need|set|084|PERMISSION|REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION";

const ANY =
  "ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE" as const;
const ALL =
  "ALL_PERMISSION_SOURCES_LISTED_AS_ACCEPTABLE" as const;
const NON_EMPTY =
  "REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION" as const;

const LISTED = "LISTED_AS_ACCEPTABLE" as const;
const NOT_LISTED = "NOT_LISTED_AS_ACCEPTABLE" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"accepted_permission_states"/.test(json));
  assert.ok(!/"PERMISSION_DIMENSION_EVALUATION_STATE"/.test(json));
}

function mockMatch(options: {
  match: "LISTED_AS_ACCEPTABLE" | "NOT_LISTED_AS_ACCEPTABLE";
  match_key?: string;
  binding_suffix?: string;
}): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch {
  const suffix = options.binding_suffix ?? "a";
  return {
    key:
      options.match_key ??
      `097-match|${CAND}|${suffix}|${options.match}`,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    permission_context_binding_key: `binding|${suffix}`,
    dimension: "PERMISSION",
    permission_state_source_key: `093-source|${suffix}`,
    permission_state_basis_key: `091-basis|${suffix}`,
    permission_evaluation_at: "2026-08-24T11:00:00.000Z",
    permission_state: "PERMISSION_PERMITTED",
    permission_source_acceptance_criterion_key: "096-criterion",
    match: options.match,
  };
}

function mockMatchAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment["status"];
  matches?: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch[];
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment {
  const status =
    options?.status ?? "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT";
  const matches =
    options?.matches ??
    (status === "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      ? [mockMatch({ match: LISTED })]
      : []);

  return {
    candidate_key: options?.candidate_key ?? CAND,
    permission_state_source_assessment: {} as never,
    permission_source_acceptance_criteria_assessment: {
      candidate_key: options?.candidate_key ?? CAND,
      operational_eligibility_dimension_policy_assessment: {
        candidate_key: options?.candidate_key ?? CAND,
        capability_requirement_assessment: {} as never,
        status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
        operational_eligibility_dimension_policy: {
          key: POLICY_KEY,
          candidate_key: options?.candidate_key ?? CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          capability_requirement_keys: ["req"],
          required_dimensions: ["PERMISSION"],
        },
        model_limitations: [],
      },
      status: "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT",
      permission_source_acceptance_criterion: null,
      has_explicit_permission_source_acceptance_criterion: false,
      model_limitations: [],
    },
    status,
    permission_source_acceptance_matches: matches,
    has_permission_source_acceptance_matches: matches.length > 0,
    has_listed_as_acceptable_permission_sources: matches.some(
      (m) => m.match === LISTED
    ),
    has_not_listed_as_acceptable_permission_sources: matches.some(
      (m) => m.match === NOT_LISTED
    ),
    model_limitations: [],
  };
}

function mockAggregationPolicy(options?: {
  kind?: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
  policy_key?: string;
}): AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy {
  const kind = options?.kind ?? ANY;
  return {
    key:
      options?.policy_key ??
      (kind === ALL ? AGG_POLICY_KEY_ALL : AGG_POLICY_KEY),
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    dimension: "PERMISSION",
    operational_eligibility_dimension_policy_key: POLICY_KEY,
    aggregation_kind: kind,
  };
}

function mockAggregationAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment["status"];
  policy?: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy | null;
  kind?: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment {
  const status =
    options?.status ?? "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT";
  const policy = present
    ? (options?.policy ?? mockAggregationPolicy({ kind: options?.kind }))
    : null;

  return {
    candidate_key: options?.candidate_key ?? CAND,
    operational_eligibility_dimension_policy_assessment: {
      candidate_key: options?.candidate_key ?? CAND,
      capability_requirement_assessment: {} as never,
      status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
      operational_eligibility_dimension_policy: {
        key: POLICY_KEY,
        candidate_key: options?.candidate_key ?? CAND,
        observation_need_key: NEED_KEY,
        capability_requirement_set_key: SET_KEY,
        capability_requirement_keys: ["req"],
        required_dimensions: ["PERMISSION"],
      },
      model_limitations: [],
    },
    status,
    permission_source_aggregation_policy: policy,
    has_explicit_permission_source_aggregation_policy: policy !== null,
    model_limitations: [],
  };
}

function mockReadinessPolicy(): AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy {
  return {
    key: READY_POLICY_KEY,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    dimension: "PERMISSION",
    operational_eligibility_dimension_policy_key: POLICY_KEY,
    readiness_kind: NON_EMPTY,
  };
}

function mockReadinessAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment["status"];
  policy?: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy | null;
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const policy = present
    ? (options?.policy ?? mockReadinessPolicy())
    : null;

  return {
    candidate_key: CAND,
    operational_eligibility_dimension_policy_assessment: {
      candidate_key: CAND,
      capability_requirement_assessment: {} as never,
      status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
      operational_eligibility_dimension_policy: {
        key: POLICY_KEY,
        candidate_key: CAND,
        observation_need_key: NEED_KEY,
        capability_requirement_set_key: SET_KEY,
        capability_requirement_keys: ["req"],
        required_dimensions: ["PERMISSION"],
      },
      model_limitations: [],
    },
    status,
    permission_source_aggregation_readiness_policy: policy,
    has_explicit_permission_source_aggregation_readiness_policy:
      policy !== null,
    model_limitations: [],
  };
}

function buildReadinessSet(
  match = mockMatchAssessment(),
  aggregation = mockAggregationAssessment(),
  readiness = mockReadinessAssessment()
) {
  return buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSet(
    {
      permission_source_acceptance_match_set: {
        permission_state_source_set: {} as never,
        permission_source_acceptance_criteria_set: {} as never,
        candidate_assessments: [match],
        has_permission_source_acceptance_matches:
          match.has_permission_source_acceptance_matches,
        has_listed_as_acceptable_permission_sources:
          match.has_listed_as_acceptable_permission_sources,
        has_not_listed_as_acceptable_permission_sources:
          match.has_not_listed_as_acceptable_permission_sources,
        model_limitations: [],
      },
      permission_source_aggregation_policy_set: {
        operational_eligibility_dimension_policy_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [aggregation],
        has_explicit_permission_source_aggregation_policies:
          aggregation.has_explicit_permission_source_aggregation_policy,
        model_limitations: [],
      },
      permission_source_aggregation_readiness_policy_set: {
        operational_eligibility_dimension_policy_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [readiness],
        has_explicit_permission_source_aggregation_readiness_policies:
          readiness.has_explicit_permission_source_aggregation_readiness_policy,
        model_limitations: [],
      },
    }
  );
}

function buildResultSet(
  match = mockMatchAssessment(),
  aggregation = mockAggregationAssessment(),
  readiness = mockReadinessAssessment()
) {
  const readinessSet = buildReadinessSet(match, aggregation, readiness);
  return buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
    {
      permission_source_acceptance_match_set:
        readinessSet.permission_source_acceptance_match_set,
      permission_source_aggregation_policy_set:
        readinessSet.permission_source_aggregation_policy_set,
      permission_source_aggregation_readiness_basis_set: readinessSet,
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

describe("GROUND-101 Operational Eligibility Permission Source Aggregation Result", () => {
  describe("ANY / ALL execution under readiness HOLDS", () => {
    it("ANY + one LISTED → aggregation HOLDS", () => {
      const set = buildResultSet(
        mockMatchAssessment({ matches: [mockMatch({ match: LISTED })] }),
        mockAggregationAssessment({ kind: ANY })
      );
      const result =
        set.candidate_assessments[0]!.permission_source_aggregation_result!;
      assert.equal(
        result.aggregation_condition,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[0]!.has_permission_source_aggregation_result,
        true
      );
      assertNoForbiddenSemantics(set);
    });

    it("ANY + mixed LISTED/NOT_LISTED → HOLDS", () => {
      const set = buildResultSet(
        mockMatchAssessment({
          matches: [
            mockMatch({ match: LISTED, binding_suffix: "a" }),
            mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
          ],
        }),
        mockAggregationAssessment({ kind: ANY })
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_source_aggregation_result!
          .aggregation_condition,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
    });

    it("ANY + all NOT_LISTED → aggregation DOES_NOT_HOLD; readiness still HOLDS", () => {
      const set = buildResultSet(
        mockMatchAssessment({
          matches: [
            mockMatch({ match: NOT_LISTED, binding_suffix: "a" }),
            mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
          ],
        }),
        mockAggregationAssessment({ kind: ANY })
      );
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.permission_source_aggregation_readiness_basis_assessment
          .permission_source_aggregation_readiness_basis!.readiness_condition,
        "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
      assert.equal(
        cand.permission_source_aggregation_result!.aggregation_condition,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(cand.has_permission_source_aggregation_result, true);
    });

    it("ALL + all LISTED → HOLDS", () => {
      assert.equal(
        buildResultSet(
          mockMatchAssessment({
            matches: [
              mockMatch({ match: LISTED, binding_suffix: "a" }),
              mockMatch({ match: LISTED, binding_suffix: "b" }),
            ],
          }),
          mockAggregationAssessment({ kind: ALL })
        ).candidate_assessments[0]!.permission_source_aggregation_result!
          .aggregation_condition,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
    });

    it("ALL + mixed → DOES_NOT_HOLD", () => {
      assert.equal(
        buildResultSet(
          mockMatchAssessment({
            matches: [
              mockMatch({ match: LISTED, binding_suffix: "a" }),
              mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
            ],
          }),
          mockAggregationAssessment({ kind: ALL })
        ).candidate_assessments[0]!.permission_source_aggregation_result!
          .aggregation_condition,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("ALL + all NOT_LISTED → DOES_NOT_HOLD", () => {
      assert.equal(
        buildResultSet(
          mockMatchAssessment({
            matches: [
              mockMatch({ match: NOT_LISTED, binding_suffix: "a" }),
              mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
            ],
          }),
          mockAggregationAssessment({ kind: ALL })
        ).candidate_assessments[0]!.permission_source_aggregation_result!
          .aggregation_condition,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("ANY and ALL differ for same mixed match set", () => {
      const matches = [
        mockMatch({ match: LISTED, binding_suffix: "a" }),
        mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
      ];
      const anySet = buildResultSet(
        mockMatchAssessment({ matches }),
        mockAggregationAssessment({ kind: ANY })
      );
      const allSet = buildResultSet(
        mockMatchAssessment({ matches }),
        mockAggregationAssessment({ kind: ALL })
      );
      assert.equal(
        anySet.candidate_assessments[0]!.permission_source_aggregation_result!
          .aggregation_condition,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
      assert.equal(
        allSet.candidate_assessments[0]!.permission_source_aggregation_result!
          .aggregation_condition,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
    });
  });

  describe("zero-match / readiness DOES_NOT_HOLD firewall", () => {
    it("zero matches + ANY → result null; no aggregation false", () => {
      const set = buildResultSet(
        mockMatchAssessment({
          status: "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          matches: [],
        }),
        mockAggregationAssessment({ kind: ANY })
      );
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(cand.permission_source_aggregation_result, null);
      assert.equal(cand.has_permission_source_aggregation_result, false);
      assert.ok(
        !/"PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"/.test(
          JSON.stringify(cand)
        )
      );
    });

    it("zero matches + ALL → result null; no vacuous true/false", () => {
      const set = buildResultSet(
        mockMatchAssessment({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
          matches: [],
        }),
        mockAggregationAssessment({ kind: ALL })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_source_aggregation_result,
        null
      );
    });

    it("evaluatePermissionSourceAggregationCondition rejects empty set", () => {
      assert.throws(
        () => evaluatePermissionSourceAggregationCondition(ANY, []),
        /vacuous/
      );
      assert.throws(
        () => evaluatePermissionSourceAggregationCondition(ALL, []),
        /vacuous/
      );
    });
  });

  describe("policy / outer-domain absence", () => {
    it("098 aggregation policy absent → no result", () => {
      const set = buildResultSet(
        mockMatchAssessment(),
        mockAggregationAssessment({
          status: "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED",
        }),
        mockReadinessAssessment()
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_source_aggregation_result,
        null
      );
    });

    it("099 readiness policy absent through 100 → no result", () => {
      const set = buildResultSet(
        mockMatchAssessment(),
        mockAggregationAssessment(),
        mockReadinessAssessment({
          status:
            "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_source_aggregation_result,
        null
      );
    });

    it("no planning → no result", () => {
      assert.equal(
        buildResultSet(
          mockMatchAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            matches: [],
          }),
          mockAggregationAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          }),
          mockReadinessAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });

    it("no Requirements → no result", () => {
      assert.equal(
        buildResultSet(
          mockMatchAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
            matches: [],
          }),
          mockAggregationAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          }),
          mockReadinessAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });

    it("no OE policy → no result", () => {
      assert.equal(
        buildResultSet(
          mockMatchAssessment({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
            matches: [],
          }),
          mockAggregationAssessment({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          mockReadinessAssessment({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          })
        ).candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
    });

    it("PERMISSION not required → no result", () => {
      assert.equal(
        buildResultSet(
          mockMatchAssessment({
            status: "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
            matches: [],
          }),
          mockAggregationAssessment({
            status: "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
          }),
          mockReadinessAssessment({
            status: "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
          })
        ).candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
    });
  });

  describe("lineage / identity", () => {
    it("retains exact 097 match keys, 098 policy, 100 readiness lineage", () => {
      const matches = [
        mockMatch({ match: LISTED, binding_suffix: "a" }),
        mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
      ];
      const set = buildResultSet(
        mockMatchAssessment({ matches }),
        mockAggregationAssessment({ kind: ANY })
      );
      const result =
        set.candidate_assessments[0]!.permission_source_aggregation_result!;
      const basis =
        set.candidate_assessments[0]!
          .permission_source_aggregation_readiness_basis_assessment
          .permission_source_aggregation_readiness_basis!;
      assert.deepEqual(
        [...result.current_permission_source_acceptance_match_keys].sort(),
        matches.map((m) => m.key).sort()
      );
      assert.equal(result.permission_source_aggregation_policy_key, AGG_POLICY_KEY);
      assert.equal(result.permission_source_aggregation_kind, ANY);
      assert.equal(
        result.permission_source_aggregation_readiness_basis_key,
        basis.key
      );
      assert.equal(
        result.permission_source_aggregation_readiness_policy_key,
        READY_POLICY_KEY
      );
      assert.equal(
        result.permission_source_aggregation_readiness_kind,
        NON_EMPTY
      );
    });

    it("match order invariance → same result key", () => {
      const m1 = mockMatch({ match: LISTED, binding_suffix: "a" });
      const m2 = mockMatch({ match: NOT_LISTED, binding_suffix: "b" });
      const a = buildResultSet(
        mockMatchAssessment({ matches: [m1, m2] }),
        mockAggregationAssessment({ kind: ANY })
      );
      const b = buildResultSet(
        mockMatchAssessment({ matches: [m2, m1] }),
        mockAggregationAssessment({ kind: ANY })
      );
      assert.equal(
        a.candidate_assessments[0]!.permission_source_aggregation_result!.key,
        b.candidate_assessments[0]!.permission_source_aggregation_result!.key
      );
    });

    it("match-set change changes result key", () => {
      const m1 = mockMatch({ match: LISTED, binding_suffix: "a" });
      const m2 = mockMatch({ match: LISTED, binding_suffix: "b" });
      const one = buildResultSet(
        mockMatchAssessment({ matches: [m1] }),
        mockAggregationAssessment({ kind: ANY })
      );
      const two = buildResultSet(
        mockMatchAssessment({ matches: [m1, m2] }),
        mockAggregationAssessment({ kind: ANY })
      );
      assert.notEqual(
        one.candidate_assessments[0]!.permission_source_aggregation_result!.key,
        two.candidate_assessments[0]!.permission_source_aggregation_result!.key
      );
    });

    it("LISTED↔NOT_LISTED changes result key", () => {
      const listed = buildResultSet(
        mockMatchAssessment({
          matches: [mockMatch({ match: LISTED, binding_suffix: "a" })],
        }),
        mockAggregationAssessment({ kind: ANY })
      );
      const notListed = buildResultSet(
        mockMatchAssessment({
          matches: [mockMatch({ match: NOT_LISTED, binding_suffix: "a" })],
        }),
        mockAggregationAssessment({ kind: ANY })
      );
      assert.notEqual(
        listed.candidate_assessments[0]!.permission_source_aggregation_result!
          .key,
        notListed.candidate_assessments[0]!
          .permission_source_aggregation_result!.key
      );
    });

    it("ANY→ALL changes result key", () => {
      const matches = [
        mockMatch({ match: LISTED, binding_suffix: "a" }),
        mockMatch({ match: LISTED, binding_suffix: "b" }),
      ];
      const anyKey = buildResultSet(
        mockMatchAssessment({ matches }),
        mockAggregationAssessment({ kind: ANY })
      ).candidate_assessments[0]!.permission_source_aggregation_result!.key;
      const allKey = buildResultSet(
        mockMatchAssessment({ matches }),
        mockAggregationAssessment({ kind: ALL })
      ).candidate_assessments[0]!.permission_source_aggregation_result!.key;
      assert.notEqual(anyKey, allKey);
    });

    it("result key encodes conceptual identity components", () => {
      const set = buildResultSet();
      const result =
        set.candidate_assessments[0]!.permission_source_aggregation_result!;
      assert.ok(
        result.key.startsWith(
          "attention-observation-operational-eligibility-permission-source-aggregation-result|"
        )
      );
      assert.ok(result.key.includes(result.permission_source_aggregation_kind));
      assert.ok(
        result.key.includes(
          result.permission_source_aggregation_readiness_basis_key
        )
      );
      assert.ok(result.key.includes(result.aggregation_condition));
      const rebuilt =
        attentionObservationOperationalEligibilityPermissionSourceAggregationResultKey(
          {
            candidate_key: result.candidate_key,
            observation_need_key: result.observation_need_key,
            capability_requirement_set_key:
              result.capability_requirement_set_key,
            operational_eligibility_dimension_policy_key:
              result.operational_eligibility_dimension_policy_key,
            permission_source_aggregation_policy_key:
              result.permission_source_aggregation_policy_key,
            permission_source_aggregation_kind:
              result.permission_source_aggregation_kind,
            permission_source_aggregation_readiness_basis_key:
              result.permission_source_aggregation_readiness_basis_key,
            permission_source_aggregation_readiness_policy_key:
              result.permission_source_aggregation_readiness_policy_key,
            permission_source_aggregation_readiness_kind:
              result.permission_source_aggregation_readiness_kind,
            current_permission_source_acceptance_match_keys:
              result.current_permission_source_acceptance_match_keys,
            aggregation_condition: result.aggregation_condition,
          }
        );
      assert.equal(result.key, rebuilt);
    });
  });

  describe("stale lineage / counterpart reject", () => {
    it("stale 100 match-set lineage rejects", () => {
      const match = mockMatchAssessment({
        matches: [mockMatch({ match: LISTED, binding_suffix: "a" })],
      });
      const aggregation = mockAggregationAssessment({ kind: ANY });
      const readinessSet = buildReadinessSet(match, aggregation);
      const staleMatch = mockMatchAssessment({
        matches: [
          mockMatch({ match: LISTED, binding_suffix: "a" }),
          mockMatch({ match: LISTED, binding_suffix: "b" }),
        ],
      });
      assert.throws(
        () =>
          buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
            {
              permission_source_acceptance_match_set: {
                ...readinessSet.permission_source_acceptance_match_set,
                candidate_assessments: [staleMatch],
              },
              permission_source_aggregation_policy_set:
                readinessSet.permission_source_aggregation_policy_set,
              permission_source_aggregation_readiness_basis_set: readinessSet,
            }
          ),
        /stale Readiness Basis match-set lineage/
      );
    });

    it("stale 098 policy lineage rejects", () => {
      const match = mockMatchAssessment();
      const aggregation = mockAggregationAssessment({ kind: ANY });
      const readinessSet = buildReadinessSet(match, aggregation);
      const swapped = mockAggregationAssessment({ kind: ALL });
      assert.throws(
        () =>
          buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
            {
              permission_source_acceptance_match_set:
                readinessSet.permission_source_acceptance_match_set,
              permission_source_aggregation_policy_set: {
                ...readinessSet.permission_source_aggregation_policy_set,
                candidate_assessments: [swapped],
              },
              permission_source_aggregation_readiness_basis_set: readinessSet,
            }
          ),
        /stale Aggregation Policy lineage/
      );
    });

    it("missing counterpart rejects", () => {
      const readinessSet = buildReadinessSet();
      assert.throws(
        () =>
          assertCompatibleOperationalEligibilityPermissionSourceAggregationResultContexts(
            {
              ...readinessSet.permission_source_acceptance_match_set,
              candidate_assessments: [
                ...readinessSet.permission_source_acceptance_match_set
                  .candidate_assessments,
                mockMatchAssessment({ candidate_key: "extra" }),
              ],
            },
            readinessSet.permission_source_aggregation_policy_set,
            readinessSet
          ),
        /candidate count mismatch/
      );
    });

    it("context mismatch rejects", () => {
      const match = mockMatchAssessment();
      const aggregation = mockAggregationAssessment();
      const readinessSet = buildReadinessSet(match, aggregation);
      const mismatchedMatch: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment =
        {
          ...match,
          permission_source_acceptance_matches: [
            {
              ...match.permission_source_acceptance_matches[0]!,
              observation_need_key: "other-need",
            },
          ],
        };
      assert.throws(
        () =>
          buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
            {
              permission_source_acceptance_match_set: {
                ...readinessSet.permission_source_acceptance_match_set,
                candidate_assessments: [mismatchedMatch],
              },
              permission_source_aggregation_policy_set:
                readinessSet.permission_source_aggregation_policy_set,
              permission_source_aggregation_readiness_basis_set: readinessSet,
            }
          ),
        /ObservationNeed key mismatch|stale/
      );
    });
  });

  describe("immutability / determinism / set booleans", () => {
    it("input immutability + deep-cloned same output + determinism", () => {
      const match = mockMatchAssessment({
        matches: [
          mockMatch({ match: LISTED, binding_suffix: "a" }),
          mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
        ],
      });
      const aggregation = mockAggregationAssessment({ kind: ANY });
      const readiness = mockReadinessAssessment();
      const readinessSet = buildReadinessSet(match, aggregation, readiness);
      const input = {
        permission_source_acceptance_match_set:
          readinessSet.permission_source_acceptance_match_set,
        permission_source_aggregation_policy_set:
          readinessSet.permission_source_aggregation_policy_set,
        permission_source_aggregation_readiness_basis_set: readinessSet,
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
          deepClone(input)
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
          input
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
      assert.equal(a.has_permission_source_aggregation_results, true);
      assert.equal(
        a.has_permission_source_aggregation_conditions_holding,
        true
      );
    });

    it("mixed holding / not-holding set booleans may coexist", () => {
      const listedMatch = mockMatchAssessment({
        candidate_key: "c1",
        matches: [
          {
            ...mockMatch({ match: LISTED }),
            candidate_key: "c1",
          },
        ],
      });
      const notListedMatch = mockMatchAssessment({
        candidate_key: "c2",
        matches: [
          {
            ...mockMatch({ match: NOT_LISTED, binding_suffix: "x" }),
            candidate_key: "c2",
          },
        ],
      });
      const agg1 = {
        ...mockAggregationAssessment({ kind: ANY }),
        candidate_key: "c1",
        permission_source_aggregation_policy: {
          ...mockAggregationPolicy({ kind: ANY }),
          candidate_key: "c1",
        },
      };
      const agg2 = {
        ...mockAggregationAssessment({ kind: ANY }),
        candidate_key: "c2",
        permission_source_aggregation_policy: {
          ...mockAggregationPolicy({ kind: ANY }),
          candidate_key: "c2",
          key: AGG_POLICY_KEY.replace("cand", "c2"),
        },
      };
      const ready1 = {
        ...mockReadinessAssessment(),
        candidate_key: "c1",
        permission_source_aggregation_readiness_policy: {
          ...mockReadinessPolicy(),
          candidate_key: "c1",
          key: READY_POLICY_KEY.replace("cand", "c1"),
        },
      };
      const ready2 = {
        ...mockReadinessAssessment(),
        candidate_key: "c2",
        permission_source_aggregation_readiness_policy: {
          ...mockReadinessPolicy(),
          candidate_key: "c2",
          key: READY_POLICY_KEY.replace("cand", "c2"),
        },
      };

      // Fix OE policy keys in nested assessments for c1/c2
      for (const a of [listedMatch, notListedMatch]) {
        const pol =
          a.permission_source_acceptance_criteria_assessment
            .operational_eligibility_dimension_policy_assessment
            .operational_eligibility_dimension_policy!;
        pol.candidate_key = a.candidate_key;
        pol.key = `084-oe-dimension-policy|${a.candidate_key}`;
        pol.observation_need_key = NEED_KEY;
        pol.capability_requirement_set_key = SET_KEY.replace(
          "cand",
          a.candidate_key
        );
        for (const m of a.permission_source_acceptance_matches) {
          m.capability_requirement_set_key = pol.capability_requirement_set_key;
          m.observation_need_key = NEED_KEY;
        }
      }
      for (const a of [agg1, agg2]) {
        const pol = a.permission_source_aggregation_policy!;
        pol.capability_requirement_set_key = SET_KEY.replace(
          "cand",
          a.candidate_key
        );
        pol.operational_eligibility_dimension_policy_key = `084-oe-dimension-policy|${a.candidate_key}`;
        a.operational_eligibility_dimension_policy_assessment.operational_eligibility_dimension_policy =
          {
            key: pol.operational_eligibility_dimension_policy_key,
            candidate_key: a.candidate_key,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: pol.capability_requirement_set_key,
            capability_requirement_keys: ["req"],
            required_dimensions: ["PERMISSION"],
          };
      }
      for (const a of [ready1, ready2]) {
        const pol = a.permission_source_aggregation_readiness_policy!;
        pol.capability_requirement_set_key = SET_KEY.replace(
          "cand",
          a.candidate_key
        );
        pol.operational_eligibility_dimension_policy_key = `084-oe-dimension-policy|${a.candidate_key}`;
        a.operational_eligibility_dimension_policy_assessment.operational_eligibility_dimension_policy =
          {
            key: pol.operational_eligibility_dimension_policy_key,
            candidate_key: a.candidate_key,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: pol.capability_requirement_set_key,
            capability_requirement_keys: ["req"],
            required_dimensions: ["PERMISSION"],
          };
      }

      const readinessSet =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSet(
          {
            permission_source_acceptance_match_set: {
              permission_state_source_set: {} as never,
              permission_source_acceptance_criteria_set: {} as never,
              candidate_assessments: [listedMatch, notListedMatch],
              has_permission_source_acceptance_matches: true,
              has_listed_as_acceptable_permission_sources: true,
              has_not_listed_as_acceptable_permission_sources: true,
              model_limitations: [],
            },
            permission_source_aggregation_policy_set: {
              operational_eligibility_dimension_policy_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [agg1, agg2],
              has_explicit_permission_source_aggregation_policies: true,
              model_limitations: [],
            },
            permission_source_aggregation_readiness_policy_set: {
              operational_eligibility_dimension_policy_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [ready1, ready2],
              has_explicit_permission_source_aggregation_readiness_policies:
                true,
              model_limitations: [],
            },
          }
        );

      const resultSet =
        buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
          {
            permission_source_acceptance_match_set:
              readinessSet.permission_source_acceptance_match_set,
            permission_source_aggregation_policy_set:
              readinessSet.permission_source_aggregation_policy_set,
            permission_source_aggregation_readiness_basis_set: readinessSet,
          }
        );

      assert.equal(
        resultSet.has_permission_source_aggregation_conditions_holding,
        true
      );
      assert.equal(
        resultSet.has_permission_source_aggregation_conditions_not_holding,
        true
      );
    });
  });

  describe("static / architectural boundaries", () => {
    it("schema 0.1.24; model limitations fixed; no ProjectState/wall-clock/forbidden deps", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_OUTCOME_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
          "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
          "EFFECTIVE_CAPABILITY_NOT_MODELED",
          "CAN_EXECUTE_NOT_MODELED",
          "OBSERVER_ASSIGNMENT_NOT_MODELED",
          "OBSERVER_SELECTION_NOT_MODELED",
          "EXECUTION_NOT_MODELED",
        ]
      );

      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-permission-source-aggregation-result-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-permission-source-aggregation-result-types.ts"
      );
      const coreCode = stripComments(readFileSync(corePath, "utf8"));
      const typesCode = stripComments(readFileSync(typesPath, "utf8"));
      const src = coreCode + "\n" + typesCode;

      assert.ok(
        !/permission-source-aggregation-readiness-policy-core/.test(src)
      );
      assert.ok(
        !/permission-source-acceptance-criteria-core/.test(src)
      );
      assert.ok(
        !/permission-source-resolution-classification/.test(src)
      );
      assert.ok(!/permission-required-coverage/.test(src));
      assert.ok(!/permission-state-source-core/.test(src));
      assert.ok(!/operational-eligibility-dimension-policy-core/.test(src));
      assert.ok(!/from ["'].*state-engine/.test(src));
      assert.ok(!/from ["'].*file-store/.test(src));
      assert.ok(!/ProjectState/.test(src));
      assert.ok(!/applyPatch/.test(src));
      assert.ok(!/saveProject/.test(src));
      assert.ok(!/Date\.now\(/.test(src));
      assert.ok(!/new Date\(/.test(src));
      assert.ok(!/performance\.now\(/.test(src));
      assert.ok(!/accepted_permission_states/.test(src));
      assert.ok(!/PERMISSION_PERMITTED/.test(coreCode));
      assert.ok(!/PERMISSION_PROHIBITED/.test(coreCode));
      assert.ok(!/UNRESOLVED_/.test(coreCode));
      assert.ok(!/"RESOLVED"/.test(coreCode));
      assert.ok(!/"REPRESENTED"/.test(coreCode));
      assert.ok(!/matches\.length\s*>\s*0/.test(coreCode));
      assert.ok(!/OPERATIONALLY_ELIGIBLE/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/effective_permission/.test(src));

      // readiness DOES_NOT_HOLD must gate before ANY/ALL
      assert.ok(
        /PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD/.test(
          coreCode
        )
      );
      assert.ok(
        /PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS/.test(coreCode)
      );
      assert.ok(/vacuous/.test(coreCode));
    });

    it("assess helper exposes candidate-level API", () => {
      const readinessSet = buildReadinessSet();
      const assessment =
        assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResult(
          readinessSet.permission_source_acceptance_match_set
            .candidate_assessments[0]!,
          readinessSet.permission_source_aggregation_policy_set
            .candidate_assessments[0]!,
          readinessSet.candidate_assessments[0]!
        );
      assert.equal(
        assessment.status,
        "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT"
      );
      assert.ok(assessment.permission_source_aggregation_result);
    });
  });
});
