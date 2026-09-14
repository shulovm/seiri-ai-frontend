/**
 * GROUND-103 — Observation Core LVII / Operational Eligibility Permission
 * Dimension Evaluation State Foundation
 *
 * Pure 101 → five-state normalization (no 094/095 override; no Satisfaction).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
  EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET,
  NO_AGGREGATION_POLICY,
  NO_AGGREGATION_RESULT,
  NO_READINESS_BASIS,
  assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationState,
  attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasisKey,
  attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateKey,
  buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSet,
  isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
  mapPermissionSourceAggregationResultAssessmentToEvaluationState,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-core.js";
import {
  buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet,
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
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-result-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const AGG_POLICY_KEY =
  "attention-observation-operational-eligibility-permission-source-aggregation-policy|cand|need|set|084|PERMISSION|ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE";
const READY_POLICY_KEY =
  "attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy|cand|need|set|084|PERMISSION|REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION";

const ANY =
  "ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE" as const;
const NON_EMPTY =
  "REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION" as const;
const LISTED = "LISTED_AS_ACCEPTABLE" as const;
const NOT_LISTED = "NOT_LISTED_AS_ACCEPTABLE" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"INTERPRET_AS_SATISFIED"/.test(json));
  assert.ok(!/"INTERPRET_AS_UNSATISFIED"/.test(json));
}

function mockMatch(options: {
  match: "LISTED_AS_ACCEPTABLE" | "NOT_LISTED_AS_ACCEPTABLE";
  match_key?: string;
  binding_suffix?: string;
  permission_state?: string;
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
    permission_state: (options.permission_state ??
      "PERMISSION_PERMITTED") as AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch["permission_state"],
    permission_source_acceptance_criterion_key: "096-criterion",
    match: options.match,
  };
}

function mockMatchAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment["status"];
  matches?: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch[];
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment {
  const status =
    options?.status ?? "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT";
  const matches =
    options?.matches ??
    (status === "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      ? [mockMatch({ match: LISTED })]
      : []);

  return {
    candidate_key: CAND,
    permission_state_source_assessment: {} as never,
    permission_source_acceptance_criteria_assessment: {
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
}): AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy {
  const kind = options?.kind ?? ANY;
  return {
    key: AGG_POLICY_KEY,
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
  kind?: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment {
  const status =
    options?.status ?? "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT";
  const policy = present
    ? mockAggregationPolicy({ kind: options?.kind })
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
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const policy = present ? mockReadinessPolicy() : null;

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

function build101(
  match = mockMatchAssessment(),
  aggregation = mockAggregationAssessment(),
  readiness = mockReadinessAssessment()
) {
  const readinessSet =
    buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSet(
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

function build103(
  match = mockMatchAssessment(),
  aggregation = mockAggregationAssessment(),
  readiness = mockReadinessAssessment()
) {
  return buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSet(
    {
      permission_source_aggregation_result_set: build101(
        match,
        aggregation,
        readiness
      ),
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

describe("GROUND-103 Operational Eligibility Permission Dimension Evaluation State", () => {
  describe("101 → 103 mapping", () => {
    it("101 HOLDS → resolved HOLDS; not SATISFIED", () => {
      const set = build103();
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "PERMISSION_DIMENSION_EVALUATION_STATE_PRESENT"
      );
      assert.equal(cand.has_permission_dimension_evaluation_state, true);
      assert.equal(
        cand.permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
        ),
        true
      );
      assert.equal(
        cand.permission_dimension_evaluation_state_basis!
          .permission_source_aggregation_result_key,
        cand.permission_source_aggregation_result_assessment
          .permission_source_aggregation_result!.key
      );
      assertNoForbiddenSemantics(set);
    });

    it("101 DOES_NOT_HOLD → resolved DOES_NOT_HOLD; not UNSATISFIED", () => {
      const set = build103(
        mockMatchAssessment({
          matches: [
            mockMatch({ match: NOT_LISTED, binding_suffix: "a" }),
            mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
          ],
        })
      );
      const state =
        set.candidate_assessments[0]!.permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state;
      assert.equal(
        state,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          state
        ),
        true
      );
      assert.equal(
        set.candidate_assessments[0]!.has_permission_dimension_evaluation_state,
        true
      );
    });

    it("aggregation policy absent → UNRESOLVED_*_POLICY_NOT_DECLARED", () => {
      const set = build103(
        mockMatchAssessment(),
        mockAggregationAssessment({
          status: "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED",
        })
      );
      const basis =
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_basis!;
      assert.equal(
        basis.permission_dimension_evaluation_state,
        "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED"
      );
      assert.equal(basis.permission_source_aggregation_result_key, null);
      assert.equal(basis.permission_source_aggregation_readiness_basis_key, null);
      assert.equal(basis.permission_source_aggregation_policy_key, null);
      assert.equal(basis.permission_source_aggregation_kind, null);
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          basis.permission_dimension_evaluation_state
        ),
        false
      );
    });

    it("readiness policy absent → UNRESOLVED_*_READINESS_POLICY_NOT_DECLARED", () => {
      const set = build103(
        mockMatchAssessment(),
        mockAggregationAssessment(),
        mockReadinessAssessment({
          status:
            "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
        })
      );
      const basis =
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_basis!;
      assert.equal(
        basis.permission_dimension_evaluation_state,
        "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED"
      );
      assert.equal(basis.permission_source_aggregation_result_key, null);
      assert.equal(basis.permission_source_aggregation_readiness_basis_key, null);
      assert.equal(
        basis.permission_source_aggregation_policy_key,
        AGG_POLICY_KEY
      );
      assert.equal(basis.permission_source_aggregation_kind, ANY);
    });

    it("readiness DOES_NOT_HOLD → UNRESOLVED readiness-condition; ≠ aggregation DOES_NOT_HOLD", () => {
      const set = build103(
        mockMatchAssessment({
          status: "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          matches: [],
        })
      );
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state,
        "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.notEqual(
        cand.permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        cand.permission_dimension_evaluation_state_basis!
          .permission_source_aggregation_result_key,
        null
      );
      assert.ok(
        cand.permission_dimension_evaluation_state_basis!
          .permission_source_aggregation_readiness_basis_key
      );
      assert.equal(
        cand.permission_source_aggregation_result_assessment
          .permission_source_acceptance_match_assessment.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
    });
  });

  describe("critical unresolved-raw cases", () => {
    it("UNRESOLVED raw explicitly accepted + aggregation HOLDS → 103 HOLDS", () => {
      const set = build103(
        mockMatchAssessment({
          matches: [
            mockMatch({
              match: LISTED,
              permission_state: UNRESOLVED_POLICY,
            }),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
    });

    it("UNRESOLVED raw NOT listed + aggregation DOES_NOT_HOLD → resolved DOES_NOT_HOLD", () => {
      const set = build103(
        mockMatchAssessment({
          matches: [
            mockMatch({
              match: NOT_LISTED,
              permission_state: UNRESOLVED_POLICY,
            }),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state,
        "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
        ),
        true
      );
    });
  });

  describe("outer NOT_APPLICABLE / provenance / identity", () => {
    it("outer statuses → no State; ≠ unresolved Evaluation State", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
      ] as const) {
        const set = build103(
          mockMatchAssessment({ status, matches: [] }),
          {
            ...mockAggregationAssessment({ status: status as never }),
            status: status as never,
            permission_source_aggregation_policy: null,
            has_explicit_permission_source_aggregation_policy: false,
          },
          {
            ...mockReadinessAssessment({ status: status as never }),
            status: status as never,
            permission_source_aggregation_readiness_policy: null,
            has_explicit_permission_source_aggregation_readiness_policy: false,
          }
        );
        const cand = set.candidate_assessments[0]!;
        assert.equal(cand.status, status);
        assert.equal(cand.has_permission_dimension_evaluation_state, false);
        assert.equal(cand.permission_dimension_evaluation_state, null);
        assert.equal(cand.permission_dimension_evaluation_state_basis, null);
      }
    });

    it("no-binding / no-instant → readiness-unresolved + nested 097 cause", () => {
      for (const status of [
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const set = build103(
          mockMatchAssessment({ status, matches: [] })
        );
        assert.equal(
          set.candidate_assessments[0]!.permission_dimension_evaluation_state!
            .permission_dimension_evaluation_state,
          "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
        );
        assert.equal(
          set.candidate_assessments[0]!
            .permission_source_aggregation_result_assessment
            .permission_source_acceptance_match_assessment.status,
          status
        );
      }
    });

    it("same state token + different match-key lineage → different Basis/State keys", () => {
      const a = build103(
        mockMatchAssessment({
          matches: [mockMatch({ match: LISTED, binding_suffix: "a" })],
        })
      );
      const b = build103(
        mockMatchAssessment({
          matches: [
            mockMatch({ match: LISTED, binding_suffix: "a" }),
            mockMatch({ match: LISTED, binding_suffix: "b" }),
          ],
        })
      );
      assert.equal(
        a.candidate_assessments[0]!.permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state,
        b.candidate_assessments[0]!.permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state
      );
      assert.notEqual(
        a.candidate_assessments[0]!.permission_dimension_evaluation_state_basis!
          .key,
        b.candidate_assessments[0]!.permission_dimension_evaluation_state_basis!
          .key
      );
      assert.notEqual(
        a.candidate_assessments[0]!.permission_dimension_evaluation_state!.key,
        b.candidate_assessments[0]!.permission_dimension_evaluation_state!.key
      );
    });

    it("State key encodes Basis key; identity helpers rebuild", () => {
      const set = build103();
      const basis =
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_basis!;
      const state =
        set.candidate_assessments[0]!.permission_dimension_evaluation_state!;
      assert.equal(
        state.permission_dimension_evaluation_state_basis_key,
        basis.key
      );
      assert.equal(
        basis.key,
        attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasisKey(
          {
            candidate_key: basis.candidate_key,
            observation_need_key: basis.observation_need_key,
            capability_requirement_set_key:
              basis.capability_requirement_set_key,
            permission_dimension_evaluation_state:
              basis.permission_dimension_evaluation_state,
            permission_source_aggregation_result_assessment_status:
              basis.permission_source_aggregation_result_assessment_status,
            permission_source_aggregation_result_key:
              basis.permission_source_aggregation_result_key,
            permission_source_aggregation_readiness_basis_key:
              basis.permission_source_aggregation_readiness_basis_key,
            permission_source_aggregation_policy_key:
              basis.permission_source_aggregation_policy_key,
            permission_source_aggregation_kind:
              basis.permission_source_aggregation_kind,
            current_permission_source_acceptance_match_keys:
              basis.current_permission_source_acceptance_match_keys,
          }
        )
      );
      assert.equal(
        state.key,
        attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateKey(
          {
            candidate_key: state.candidate_key,
            observation_need_key: state.observation_need_key,
            capability_requirement_set_key:
              state.capability_requirement_set_key,
            permission_dimension_evaluation_state:
              state.permission_dimension_evaluation_state,
            permission_dimension_evaluation_state_basis_key: basis.key,
          }
        )
      );
      assert.equal(EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET.length > 0, true);
      assert.equal(NO_AGGREGATION_RESULT.length > 0, true);
      assert.equal(NO_READINESS_BASIS.length > 0, true);
      assert.equal(NO_AGGREGATION_POLICY.length > 0, true);
    });
  });

  describe("set booleans / malformed / immutability", () => {
    it("set resolved / unresolved / mixed booleans", () => {
      const resolved = build103();
      assert.equal(resolved.has_permission_dimension_evaluation_states, true);
      assert.equal(
        resolved.has_resolved_permission_dimension_evaluation_states,
        true
      );
      assert.equal(
        resolved.has_unresolved_permission_dimension_evaluation_states,
        false
      );

      const unresolved = build103(
        mockMatchAssessment({
          status: "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          matches: [],
        })
      );
      assert.equal(
        unresolved.has_resolved_permission_dimension_evaluation_states,
        false
      );
      assert.equal(
        unresolved.has_unresolved_permission_dimension_evaluation_states,
        true
      );
    });

    it("malformed RESULT_PRESENT with null result rejects", () => {
      const set = build101();
      const forged: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment =
        {
          ...set.candidate_assessments[0]!,
          status: "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT",
          permission_source_aggregation_result: null,
          has_permission_source_aggregation_result: false,
        };
      assert.throws(
        () =>
          mapPermissionSourceAggregationResultAssessmentToEvaluationState(
            forged
          ),
        /RESULT_PRESENT/
      );
    });

    it("malformed readiness-failure with aggregation result rejects", () => {
      const holds = build101();
      const zero = build101(
        mockMatchAssessment({
          status: "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          matches: [],
        })
      );
      const forged: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment =
        {
          ...zero.candidate_assessments[0]!,
          permission_source_aggregation_result:
            holds.candidate_assessments[0]!
              .permission_source_aggregation_result,
          has_permission_source_aggregation_result: true,
        };
      assert.throws(
        () =>
          assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationState(
            forged
          ),
        /must not (embed|carry) aggregation result/
      );
    });

    it("self-contradictory policy-absence with policy PRESENT rejects", () => {
      const set = build101();
      const forged: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment =
        {
          ...set.candidate_assessments[0]!,
          status: "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED",
          permission_source_aggregation_result: null,
          has_permission_source_aggregation_result: false,
        };
      assert.throws(
        () =>
          mapPermissionSourceAggregationResultAssessmentToEvaluationState(
            forged
          ),
        /missing aggregation policy/
      );
    });

    it("input immutability + deep-cloned same output + determinism", () => {
      const resultSet = build101();
      const input = {
        permission_source_aggregation_result_set: resultSet,
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSet(
          deepClone(input)
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSet(
          input
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });
  });

  describe("static / architectural boundaries", () => {
    it("schema 0.1.24; no 094/095/097–100 cores; no Satisfaction/OE/can_execute", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_INTERPRETATION_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_INTERPRETATION_BASIS_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
        ]
      );

      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.ts"
      );
      const src =
        stripComments(readFileSync(corePath, "utf8")) +
        "\n" +
        stripComments(readFileSync(typesPath, "utf8"));

      assert.ok(
        !/permission-source-aggregation-readiness-basis-core/.test(src)
      );
      assert.ok(
        !/permission-source-aggregation-readiness-policy-core/.test(src)
      );
      assert.ok(!/permission-source-aggregation-policy-core/.test(src));
      assert.ok(!/permission-source-acceptance-match-core/.test(src));
      assert.ok(!/permission-source-acceptance-criteria-core/.test(src));
      assert.ok(!/permission-source-resolution-classification/.test(src));
      assert.ok(!/permission-required-dimension-coverage/.test(src));
      assert.ok(!/permission-state-source-core/.test(src));
      assert.ok(!/from ["'].*state-engine/.test(src));
      assert.ok(!/from ["'].*file-store/.test(src));
      assert.ok(!/ProjectState/.test(src));
      assert.ok(!/applyPatch/.test(src));
      assert.ok(!/saveProject/.test(src));
      assert.ok(!/Date\.now\(/.test(src));
      assert.ok(!/new Date\(/.test(src));
      assert.ok(!/performance\.now\(/.test(src));
      assert.ok(!/"SATISFIED"/.test(src));
      assert.ok(!/"UNSATISFIED"/.test(src));
      assert.ok(!/OPERATIONALLY_ELIGIBLE/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/effective_permission/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));

      // runtime import is only 101 types + 103 types
      assert.ok(
        /permission-source-aggregation-result-types\.js/.test(
          stripComments(readFileSync(corePath, "utf8"))
        )
      );
    });

    it("resolved helper exact mapping for all five states", () => {
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED"
        ),
        false
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED"
        ),
        false
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
          "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
        ),
        false
      );
    });
  });
});
