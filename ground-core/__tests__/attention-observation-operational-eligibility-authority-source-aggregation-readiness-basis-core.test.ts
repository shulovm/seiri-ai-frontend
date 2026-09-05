/**
 * GROUND-124 — Observation Core LXXVIII / Operational Eligibility Authority
 * Source Aggregation Readiness Basis Foundation
 *
 * Pure 121 match set + 122 aggregation policy + 123 readiness policy
 * (cardinality-only readiness; no ANY/ALL execution; no vacuous truth).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
  EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET,
  assertCompatibleOperationalEligibilityAuthoritySourceAggregationReadinessBasisContexts,
  assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis,
  attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisKey,
  buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet,
  buildCanonicalAuthoritySourceAcceptanceMatchKeySetKey,
  evaluateAuthoritySourceAggregationReadinessCondition,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch,
} from "../reality/attention-observation-operational-eligibility-authority-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const AGG_POLICY_KEY =
  "attention-observation-operational-eligibility-authority-source-aggregation-policy|cand|need|set|084|AUTHORITY|ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE";
const AGG_POLICY_KEY_ALL =
  "attention-observation-operational-eligibility-authority-source-aggregation-policy|cand|need|set|084|AUTHORITY|ALL_AUTHORITY_SOURCES_LISTED_AS_ACCEPTABLE";
const READY_POLICY_KEY =
  "attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy|cand|need|set|084|AUTHORITY|REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION";

const ANY =
  "ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE" as const;
const ALL =
  "ALL_AUTHORITY_SOURCES_LISTED_AS_ACCEPTABLE" as const;
const NON_EMPTY =
  "REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION" as const;

const LISTED = "LISTED_AS_ACCEPTABLE" as const;
const NOT_LISTED = "NOT_LISTED_AS_ACCEPTABLE" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"/.test(json));
  assert.ok(
    !/"AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"/.test(json)
  );
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"accepted_authority_states"/.test(json));
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"RESOLVED"/.test(json));
}

function mockMatch(options: {
  match: "LISTED_AS_ACCEPTABLE" | "NOT_LISTED_AS_ACCEPTABLE";
  match_key?: string;
  binding_suffix?: string;
}): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch {
  const suffix = options.binding_suffix ?? "a";
  return {
    key:
      options.match_key ??
      `121-match|${CAND}|${suffix}|${options.match}`,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key: `binding|${suffix}`,
    authority_holder_entity_id: `holder|${suffix}`,
    authority_power: "AUTHORIZE_INTERVENTION",
    governance_scope: { kind: "INTERVENTION_DECLARATION", intervention_id: "int-1" },
    governance_scope_key: "governance-scope|int-1",
    authority_evaluation_instant_key: `instant|${suffix}`,
    authority_evaluation_at: "2026-08-24T11:00:00.000Z",
    authority_source_key: `117-source|${suffix}`,
    canonical_authority_state_key: `state|${suffix}`,
    canonical_authority_state_basis_key: `basis|${suffix}`,
    canonical_authority_state_value: "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE",
    authority_source_acceptance_criterion_key: "120-criterion",
    match: options.match,
  };
}

function mockMatchAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment["status"];
  matches?: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch[];
  candidate_key?: string;
  policy_present?: boolean;
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment {
  const status =
    options?.status ?? "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT";
  const matches =
    options?.matches ??
    (status === "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      ? [mockMatch({ match: LISTED })]
      : []);
  const policyPresent = options?.policy_present ?? true;

  return {
    candidate_key: options?.candidate_key ?? CAND,
    authority_source_bridge_assessment: {} as never,
    authority_source_acceptance_criteria_assessment: {
      candidate_key: options?.candidate_key ?? CAND,
      operational_eligibility_dimension_policy_assessment: {
        candidate_key: options?.candidate_key ?? CAND,
        capability_requirement_assessment: {} as never,
        status: policyPresent
          ? "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT"
          : "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
        operational_eligibility_dimension_policy: policyPresent
          ? {
              key: POLICY_KEY,
              candidate_key: options?.candidate_key ?? CAND,
              observation_need_key: NEED_KEY,
              capability_requirement_set_key: SET_KEY,
              capability_requirement_keys: ["req"],
              required_dimensions: ["AUTHORITY"],
            }
          : null,
        model_limitations: [],
      },
      status: "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT",
      authority_source_acceptance_criterion: null,
      has_explicit_authority_source_acceptance_criterion: false,
      model_limitations: [],
    },
    status,
    authority_source_acceptance_matches: matches,
    has_authority_source_acceptance_matches: matches.length > 0,
    has_listed_as_acceptable_authority_sources: matches.some(
      (m) => m.match === LISTED
    ),
    has_not_listed_as_acceptable_authority_sources: matches.some(
      (m) => m.match === NOT_LISTED
    ),
    model_limitations: [],
  };
}

function mockAggregationPolicy(options?: {
  kind?: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
  policy_key?: string;
}): AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy {
  const kind = options?.kind ?? ANY;
  return {
    key:
      options?.policy_key ??
      (kind === ALL ? AGG_POLICY_KEY_ALL : AGG_POLICY_KEY),
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    dimension: "AUTHORITY",
    operational_eligibility_dimension_policy_key: POLICY_KEY,
    aggregation_kind: kind,
  };
}

function mockAggregationAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment["status"];
  policy?: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy | null;
  kind?: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment {
  const status =
    options?.status ?? "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT";
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
        required_dimensions: ["AUTHORITY"],
      },
      model_limitations: [],
    },
    status,
    authority_source_aggregation_policy: policy,
    has_explicit_authority_source_aggregation_policy: policy !== null,
    model_limitations: [],
  };
}

function mockReadinessPolicy(): AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy {
  return {
    key: READY_POLICY_KEY,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    dimension: "AUTHORITY",
    operational_eligibility_dimension_policy_key: POLICY_KEY,
    readiness_kind: NON_EMPTY,
  };
}

function mockReadinessAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment["status"];
  policy?: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy | null;
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const policy = present
    ? (options?.policy ?? mockReadinessPolicy())
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
        required_dimensions: ["AUTHORITY"],
      },
      model_limitations: [],
    },
    status,
    authority_source_aggregation_readiness_policy: policy,
    has_explicit_authority_source_aggregation_readiness_policy:
      policy !== null,
    model_limitations: [],
  };
}

function buildSet(
  match = mockMatchAssessment(),
  aggregation = mockAggregationAssessment(),
  readiness = mockReadinessAssessment()
) {
  return buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet(
    {
      authority_source_acceptance_match_set: {
        authority_source_bridge_set: {} as never,
        authority_source_acceptance_criteria_set: {} as never,
        candidate_assessments: [match],
        has_authority_source_acceptance_matches:
          match.has_authority_source_acceptance_matches,
        has_listed_as_acceptable_authority_sources:
          match.has_listed_as_acceptable_authority_sources,
        has_not_listed_as_acceptable_authority_sources:
          match.has_not_listed_as_acceptable_authority_sources,
        model_limitations: [],
      },
      authority_source_aggregation_policy_set: {
        operational_eligibility_dimension_policy_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [aggregation],
        has_explicit_authority_source_aggregation_policies:
          aggregation.has_explicit_authority_source_aggregation_policy,
        model_limitations: [],
      },
      authority_source_aggregation_readiness_policy_set: {
        operational_eligibility_dimension_policy_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [readiness],
        has_explicit_authority_source_aggregation_readiness_policies:
          readiness.has_explicit_authority_source_aggregation_readiness_policy,
        model_limitations: [],
      },
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-124 Operational Eligibility Authority Source Aggregation Readiness Basis", () => {
  describe("readiness condition evaluation", () => {
    it("ANY + readiness + one LISTED → HOLDS; no ANY execution", () => {
      const set = buildSet(
        mockMatchAssessment({
          matches: [mockMatch({ match: LISTED })],
        }),
        mockAggregationAssessment({ kind: ANY }),
        mockReadinessAssessment()
      );
      const basis =
        set.candidate_assessments[0]!
          .authority_source_aggregation_readiness_basis!;
      assert.equal(
        basis.readiness_condition,
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
      assert.equal(basis.authority_source_aggregation_kind, ANY);
      assert.equal(basis.authority_source_aggregation_readiness_kind, NON_EMPTY);
      assertNoForbiddenSemantics(set);
    });

    it("ANY + one NOT_LISTED → HOLDS", () => {
      assert.equal(
        buildSet(
          mockMatchAssessment({
            matches: [mockMatch({ match: NOT_LISTED })],
          })
        ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!
          .readiness_condition,
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
    });

    it("ALL + all NOT_LISTED → HOLDS; no ALL result", () => {
      const basis = buildSet(
        mockMatchAssessment({
          matches: [
            mockMatch({ match: NOT_LISTED, binding_suffix: "1" }),
            mockMatch({ match: NOT_LISTED, binding_suffix: "2" }),
          ],
        }),
        mockAggregationAssessment({ kind: ALL })
      ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!;
      assert.equal(
        basis.readiness_condition,
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
      assert.equal(basis.authority_source_aggregation_kind, ALL);
      assert.ok(
        !/"AUTHORITY_SOURCE_AGGREGATION_CONDITION_/.test(JSON.stringify(basis))
      );
    });

    it("mixed LISTED/NOT_LISTED → HOLDS", () => {
      assert.equal(
        buildSet(
          mockMatchAssessment({
            matches: [
              mockMatch({ match: LISTED, binding_suffix: "1" }),
              mockMatch({ match: NOT_LISTED, binding_suffix: "2" }),
            ],
          })
        ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!
          .readiness_condition,
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
    });

    it("zero matches → DOES_NOT_HOLD Basis PRESENT; no ANY/ALL truth", () => {
      for (const kind of [ANY, ALL] as const) {
        const assessment = buildSet(
          mockMatchAssessment({
            status: "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
            matches: [],
          }),
          mockAggregationAssessment({ kind }),
          mockReadinessAssessment()
        ).candidate_assessments[0]!;
        assert.equal(
          assessment.status,
          "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
        );
        assert.equal(
          assessment.has_authority_source_aggregation_readiness_basis,
          true
        );
        const basis = assessment.authority_source_aggregation_readiness_basis!;
        assert.equal(
          basis.readiness_condition,
          "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
        );
        assert.deepEqual(
          basis.current_authority_source_acceptance_match_keys,
          []
        );
        assert.equal(
          basis.current_authority_source_acceptance_match_status,
          "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
        );
      }
    });

    it("no-binding / no-instant zero matches → DOES_NOT_HOLD; 121 status retained", () => {
      for (const status of [
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const basis = buildSet(
          mockMatchAssessment({ status, matches: [] })
        ).candidate_assessments[0]!
          .authority_source_aggregation_readiness_basis!;
        assert.equal(
          basis.readiness_condition,
          "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
        );
        assert.equal(
          basis.current_authority_source_acceptance_match_status,
          status
        );
      }
    });

    it("cardinality helper; polarity unused", () => {
      assert.equal(
        evaluateAuthoritySourceAggregationReadinessCondition(NON_EMPTY, 1),
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
      assert.equal(
        evaluateAuthoritySourceAggregationReadinessCondition(NON_EMPTY, 0),
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        evaluateAuthoritySourceAggregationReadinessCondition(NON_EMPTY, 2),
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
    });
  });

  describe("policy absence / outer domain", () => {
    it("122 absent / 123 absent → no Basis; != DOES_NOT_HOLD", () => {
      const no122 = buildSet(
        mockMatchAssessment(),
        mockAggregationAssessment({
          status: "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED",
          policy: null,
        }),
        mockReadinessAssessment()
      ).candidate_assessments[0]!;
      assert.equal(
        no122.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(no122.authority_source_aggregation_readiness_basis, null);
      assert.equal(no122.has_authority_source_aggregation_readiness_basis, false);

      const no123 = buildSet(
        mockMatchAssessment(),
        mockAggregationAssessment(),
        mockReadinessAssessment({
          status:
            "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
          policy: null,
        })
      ).candidate_assessments[0]!;
      assert.equal(
        no123.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
      );
      assert.equal(no123.authority_source_aggregation_readiness_basis, null);
    });

    it("no planning / no Requirements / no OE / not required → no Basis", () => {
      assert.equal(
        buildSet(
          mockMatchAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            matches: [],
          }),
          mockAggregationAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            policy: null,
          }),
          mockReadinessAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            policy: null,
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        buildSet(
          mockMatchAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
            matches: [],
          }),
          mockAggregationAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
            policy: null,
          }),
          mockReadinessAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
            policy: null,
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        buildSet(
          mockMatchAssessment({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
            matches: [],
            policy_present: false,
          }),
          mockAggregationAssessment({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
            policy: null,
          }),
          mockReadinessAssessment({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
            policy: null,
          })
        ).candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        buildSet(
          mockMatchAssessment({
            status: "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
            matches: [],
          }),
          mockAggregationAssessment({
            status: "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
            policy: null,
          }),
          mockReadinessAssessment({
            status: "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
            policy: null,
          })
        ).candidate_assessments[0]!.status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
    });
  });

  describe("lineage / identity / join", () => {
    it("retains 121/122/123 lineage; match order invariance; set change identity", () => {
      const m1 = mockMatch({ match: LISTED, binding_suffix: "1" });
      const m2 = mockMatch({ match: NOT_LISTED, binding_suffix: "2" });
      const a = buildSet(
        mockMatchAssessment({ matches: [m1, m2] })
      ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!;
      const b = buildSet(
        mockMatchAssessment({ matches: [m2, m1] })
      ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!;
      assert.equal(a.key, b.key);
      assert.deepEqual(a.current_authority_source_acceptance_match_keys, [
        m1.key,
        m2.key,
      ].sort());
      assert.equal(a.authority_source_aggregation_policy_key, AGG_POLICY_KEY);
      assert.equal(
        a.authority_source_aggregation_readiness_policy_key,
        READY_POLICY_KEY
      );
      assert.equal(
        buildCanonicalAuthoritySourceAcceptanceMatchKeySetKey([]),
        EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET
      );

      const one = buildSet(
        mockMatchAssessment({ matches: [m1] })
      ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!;
      assert.notEqual(a.key, one.key);
      assert.equal(
        one.readiness_condition,
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
    });

    it("polarity change changes identity via match key; readiness may remain HOLDS", () => {
      const listed = mockMatch({
        match: LISTED,
        match_key: "121-match|same-source|LISTED",
      });
      const notListed = mockMatch({
        match: NOT_LISTED,
        match_key: "121-match|same-source|NOT_LISTED",
      });
      const a = buildSet(
        mockMatchAssessment({ matches: [listed] })
      ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!;
      const b = buildSet(
        mockMatchAssessment({ matches: [notListed] })
      ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!;
      assert.notEqual(a.key, b.key);
      assert.equal(a.readiness_condition, b.readiness_condition);
      assert.equal(
        a.readiness_condition,
        "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      );
    });

    it("ANY→ALL changes Basis key; readiness may remain HOLDS", () => {
      const anyBasis = buildSet(
        mockMatchAssessment(),
        mockAggregationAssessment({ kind: ANY })
      ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!;
      const allBasis = buildSet(
        mockMatchAssessment(),
        mockAggregationAssessment({ kind: ALL })
      ).candidate_assessments[0]!.authority_source_aggregation_readiness_basis!;
      assert.notEqual(anyBasis.key, allBasis.key);
      assert.equal(anyBasis.readiness_condition, allBasis.readiness_condition);
    });

    it("context mismatch / missing / extra counterpart reject", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis(
          mockMatchAssessment({ candidate_key: "a" }),
          mockAggregationAssessment({ candidate_key: "b" }),
          mockReadinessAssessment({ candidate_key: "a" })
        )
      );
      assert.throws(() =>
        assertCompatibleOperationalEligibilityAuthoritySourceAggregationReadinessBasisContexts(
          {
            authority_source_bridge_set: {} as never,
            authority_source_acceptance_criteria_set: {} as never,
            candidate_assessments: [mockMatchAssessment()],
            has_authority_source_acceptance_matches: true,
            has_listed_as_acceptable_authority_sources: true,
            has_not_listed_as_acceptable_authority_sources: false,
            model_limitations: [],
          },
          {
            operational_eligibility_dimension_policy_set: {} as never,
            specification: { policies: [] },
            candidate_assessments: [
              mockAggregationAssessment(),
              mockAggregationAssessment({ candidate_key: "extra" }),
            ],
            has_explicit_authority_source_aggregation_policies: true,
            model_limitations: [],
          },
          {
            operational_eligibility_dimension_policy_set: {} as never,
            specification: { policies: [] },
            candidate_assessments: [mockReadinessAssessment()],
            has_explicit_authority_source_aggregation_readiness_policies: true,
            model_limitations: [],
          }
        )
      );
    });

    it("set booleans: HOLDS and DOES_NOT_HOLD both count as Basis present", () => {
      assert.equal(
        buildSet().has_authority_source_aggregation_readiness_bases,
        true
      );
      assert.equal(
        buildSet().has_authority_source_aggregation_readiness_conditions_holding,
        true
      );
      assert.equal(
        buildSet().has_authority_source_aggregation_readiness_conditions_not_holding,
        false
      );
      const empty = buildSet(
        mockMatchAssessment({
          status: "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          matches: [],
        })
      );
      assert.equal(empty.has_authority_source_aggregation_readiness_bases, true);
      assert.equal(
        empty.has_authority_source_aggregation_readiness_conditions_holding,
        false
      );
      assert.equal(
        empty.has_authority_source_aggregation_readiness_conditions_not_holding,
        true
      );
      assert.equal(
        buildSet(
          mockMatchAssessment(),
          mockAggregationAssessment({
            status: "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED",
            policy: null,
          })
        ).has_authority_source_aggregation_readiness_bases,
        false
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        authority_source_acceptance_match_set: {
          authority_source_bridge_set: {} as never,
          authority_source_acceptance_criteria_set: {} as never,
          candidate_assessments: [
            mockMatchAssessment({
              matches: [
                mockMatch({ match: NOT_LISTED, binding_suffix: "1" }),
                mockMatch({ match: LISTED, binding_suffix: "2" }),
              ],
            }),
          ],
          has_authority_source_acceptance_matches: true,
          has_listed_as_acceptable_authority_sources: true,
          has_not_listed_as_acceptable_authority_sources: true,
          model_limitations: [],
        },
        authority_source_aggregation_policy_set: {
          operational_eligibility_dimension_policy_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [mockAggregationAssessment({ kind: ALL })],
          has_explicit_authority_source_aggregation_policies: true,
          model_limitations: [],
        },
        authority_source_aggregation_readiness_policy_set: {
          operational_eligibility_dimension_policy_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [mockReadinessAssessment()],
          has_explicit_authority_source_aggregation_readiness_policies: true,
          model_limitations: [],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 117–120/084-direct; no ANY/ALL execution/result", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(/authority-source-acceptance-match-types/.test(core));
      assert.ok(/authority-source-aggregation-policy-types/.test(core));
      assert.ok(
        /authority-source-aggregation-readiness-policy-types/.test(core)
      );
      assert.ok(!/authority-state-source-types/.test(coreCode));
      assert.ok(!/authority-required-dimension-coverage/.test(src));
      assert.ok(!/authority-source-resolution-classification/.test(src));
      assert.ok(!/authority-source-acceptance-criteria-types/.test(coreCode));
      assert.ok(
        !/operational-eligibility-dimension-policy-types/.test(coreCode)
      );
      assert.ok(!/from ["'].*authority-state-core/.test(src));
      assert.ok(!/from ["'].*authority-state-types/.test(src));
      assert.ok(!/from ["'].*declared-authority-/.test(src));
      assert.ok(!/from ["'].*authority-context-binding/.test(src));
      assert.ok(!/from ["'].*authority-core/.test(src));
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/from ["'].*\.\.\/types/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));
      assert.ok(!/\.match\s*===/.test(coreCode));
      assert.ok(!/\.some\(/.test(coreCode) || !/LISTED_AS_ACCEPTABLE/.test(coreCode.replace(/model_limitations[\s\S]*/, "")));
      // readiness uses length only — no polarity branching on match values
      assert.ok(!/LISTED_AS_ACCEPTABLE/.test(coreCode));
      assert.ok(!/NOT_LISTED_AS_ACCEPTABLE/.test(coreCode));
      assert.ok(!/accepted_authority_states/.test(src));
      assert.ok(!/"READY"/.test(src));
      assert.ok(!/"AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
      assert.ok(!/vacuous/.test(coreCode));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));

      // key helper smoke
      const key =
        attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            authority_source_aggregation_policy_key: AGG_POLICY_KEY,
            authority_source_aggregation_kind: ANY,
            authority_source_aggregation_readiness_policy_key: READY_POLICY_KEY,
            authority_source_aggregation_readiness_kind: NON_EMPTY,
            current_authority_source_acceptance_match_status:
              "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT",
            current_authority_source_acceptance_match_keys: ["m2", "m1"],
            readiness_condition:
              "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS",
          }
        );
      assert.ok(key.includes("m1,m2"));
    });
  });
});
