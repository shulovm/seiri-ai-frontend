/**
 * GROUND-127 — Observation Core LXXXI / Operational Eligibility Authority
 * Dimension Evaluation State Foundation
 *
 * Pure 125 → five-state normalization (no 118/119 override; no Satisfaction).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
  EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET,
  NO_AGGREGATION_POLICY,
  NO_AGGREGATION_RESULT,
  NO_READINESS_BASIS,
  assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationState,
  attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasisKey,
  attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateKey,
  buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet,
  isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState,
  mapAuthoritySourceAggregationResultAssessmentToEvaluationState,
} from "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSet,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-result-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet,
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
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-result-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const AGG_POLICY_KEY =
  "attention-observation-operational-eligibility-authority-source-aggregation-policy|cand|need|set|084|AUTHORITY|ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE";
const READY_POLICY_KEY =
  "attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy|cand|need|set|084|AUTHORITY|REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION";

const ANY =
  "ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE" as const;
const NON_EMPTY =
  "REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION" as const;
const LISTED = "LISTED_AS_ACCEPTABLE" as const;
const NOT_LISTED = "NOT_LISTED_AS_ACCEPTABLE" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"INTERPRET_AS_SATISFIED"/.test(json));
  assert.ok(!/"INTERPRET_AS_UNSATISFIED"/.test(json));
}

function mockMatch(options: {
  match: "LISTED_AS_ACCEPTABLE" | "NOT_LISTED_AS_ACCEPTABLE";
  match_key?: string;
  binding_suffix?: string;
  canonical_authority_state_value?: string;
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
    canonical_authority_state_value: (options.canonical_authority_state_value ??
      "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE") as AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch["canonical_authority_state_value"],
    authority_source_acceptance_criterion_key: "120-criterion",
    match: options.match,
  };
}

function mockMatchAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment["status"];
  matches?: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch[];
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment {
  const status =
    options?.status ?? "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT";
  const matches =
    options?.matches ??
    (status === "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      ? [mockMatch({ match: LISTED })]
      : []);

  return {
    candidate_key: CAND,
    authority_source_bridge_assessment: {} as never,
    authority_source_acceptance_criteria_assessment: {
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
          required_dimensions: ["AUTHORITY"],
        },
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
}): AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy {
  const kind = options?.kind ?? ANY;
  return {
    key: AGG_POLICY_KEY,
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
  kind?: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment {
  const status =
    options?.status ?? "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT";
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
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
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

function build125(
  match = mockMatchAssessment(),
  aggregation = mockAggregationAssessment(),
  readiness = mockReadinessAssessment()
) {
  const readinessSet =
    buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet(
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

  return buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSet(
    {
      authority_source_acceptance_match_set:
        readinessSet.authority_source_acceptance_match_set,
      authority_source_aggregation_policy_set:
        readinessSet.authority_source_aggregation_policy_set,
      authority_source_aggregation_readiness_basis_set: readinessSet,
    }
  );
}

function build127(
  match = mockMatchAssessment(),
  aggregation = mockAggregationAssessment(),
  readiness = mockReadinessAssessment()
) {
  return buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet(
    {
      authority_source_aggregation_result_set: build125(
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

describe("GROUND-127 Operational Eligibility Authority Dimension Evaluation State", () => {
  describe("125 → 127 mapping", () => {
    it("125 HOLDS → resolved HOLDS; not SATISFIED", () => {
      const set = build127();
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "AUTHORITY_DIMENSION_EVALUATION_STATE_PRESENT"
      );
      assert.equal(cand.has_authority_dimension_evaluation_state, true);
      assert.equal(
        cand.authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state,
        "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
        ),
        true
      );
      assert.equal(cand.has_resolved_authority_dimension_evaluation_state, true);
      assert.equal(
        cand.has_unresolved_authority_dimension_evaluation_state,
        false
      );
      assert.equal(
        cand.authority_dimension_evaluation_state_basis!
          .authority_source_aggregation_result_key,
        cand.authority_source_aggregation_result_assessment
          .authority_source_aggregation_result!.key
      );
      assertNoForbiddenSemantics(set);
    });

    it("125 DOES_NOT_HOLD → resolved DOES_NOT_HOLD; not UNSATISFIED", () => {
      const set = build127(
        mockMatchAssessment({
          matches: [
            mockMatch({ match: NOT_LISTED, binding_suffix: "a" }),
            mockMatch({ match: NOT_LISTED, binding_suffix: "b" }),
          ],
        })
      );
      const state =
        set.candidate_assessments[0]!.authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state;
      assert.equal(
        state,
        "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          state
        ),
        true
      );
      assert.equal(
        set.candidate_assessments[0]!.has_resolved_authority_dimension_evaluation_state,
        true
      );
      assert.equal(
        set.candidate_assessments[0]!.has_unresolved_authority_dimension_evaluation_state,
        false
      );
    });

    it("aggregation policy absent → UNRESOLVED_*_POLICY_NOT_DECLARED", () => {
      const set = build127(
        mockMatchAssessment(),
        mockAggregationAssessment({
          status: "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED",
        })
      );
      const basis =
        set.candidate_assessments[0]!
          .authority_dimension_evaluation_state_basis!;
      assert.equal(
        basis.authority_dimension_evaluation_state,
        "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED"
      );
      assert.equal(basis.authority_source_aggregation_result_key, null);
      assert.equal(basis.authority_source_aggregation_readiness_basis_key, null);
      assert.equal(basis.authority_source_aggregation_policy_key, null);
      assert.equal(basis.authority_source_aggregation_kind, null);
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          basis.authority_dimension_evaluation_state
        ),
        false
      );
    });

    it("readiness policy absent → UNRESOLVED_*_READINESS_POLICY_NOT_DECLARED", () => {
      const set = build127(
        mockMatchAssessment(),
        mockAggregationAssessment(),
        mockReadinessAssessment({
          status:
            "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
        })
      );
      const basis =
        set.candidate_assessments[0]!
          .authority_dimension_evaluation_state_basis!;
      assert.equal(
        basis.authority_dimension_evaluation_state,
        "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED"
      );
      assert.equal(basis.authority_source_aggregation_result_key, null);
      assert.equal(basis.authority_source_aggregation_readiness_basis_key, null);
      assert.equal(
        basis.authority_source_aggregation_policy_key,
        AGG_POLICY_KEY
      );
      assert.equal(basis.authority_source_aggregation_kind, ANY);
    });

    it("readiness DOES_NOT_HOLD → UNRESOLVED readiness-condition; ≠ aggregation DOES_NOT_HOLD", () => {
      const set = build127(
        mockMatchAssessment({
          status: "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          matches: [],
        })
      );
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state,
        "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.notEqual(
        cand.authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state,
        "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        cand.authority_dimension_evaluation_state_basis!
          .authority_source_aggregation_result_key,
        null
      );
      assert.ok(
        cand.authority_dimension_evaluation_state_basis!
          .authority_source_aggregation_readiness_basis_key
      );
      assert.equal(
        cand.authority_source_aggregation_result_assessment
          .authority_source_acceptance_match_assessment.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
    });
  });

  describe("critical unresolved-raw cases", () => {
    it("UNRESOLVED raw explicitly accepted + aggregation HOLDS → 127 HOLDS", () => {
      const set = build127(
        mockMatchAssessment({
          matches: [
            mockMatch({
              match: LISTED,
              canonical_authority_state_value: UNRESOLVED_POLICY,
            }),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state,
        "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
    });

    it("UNRESOLVED raw NOT listed + aggregation DOES_NOT_HOLD → resolved DOES_NOT_HOLD", () => {
      const set = build127(
        mockMatchAssessment({
          matches: [
            mockMatch({
              match: NOT_LISTED,
              canonical_authority_state_value: UNRESOLVED_POLICY,
            }),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state,
        "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
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
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
      ] as const) {
        const set = build127(
          mockMatchAssessment({ status, matches: [] }),
          {
            ...mockAggregationAssessment({ status: status as never }),
            status: status as never,
            authority_source_aggregation_policy: null,
            has_explicit_authority_source_aggregation_policy: false,
          },
          {
            ...mockReadinessAssessment({ status: status as never }),
            status: status as never,
            authority_source_aggregation_readiness_policy: null,
            has_explicit_authority_source_aggregation_readiness_policy: false,
          }
        );
        const cand = set.candidate_assessments[0]!;
        assert.equal(cand.status, status);
        assert.equal(cand.has_authority_dimension_evaluation_state, false);
        assert.equal(cand.authority_dimension_evaluation_state, null);
        assert.equal(cand.authority_dimension_evaluation_state_basis, null);
      }
    });

    it("no-binding / no-instant → readiness-unresolved + nested 121 cause", () => {
      for (const status of [
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const set = build127(
          mockMatchAssessment({ status, matches: [] })
        );
        assert.equal(
          set.candidate_assessments[0]!.authority_dimension_evaluation_state!
            .authority_dimension_evaluation_state,
          "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
        );
        assert.equal(
          set.candidate_assessments[0]!
            .authority_source_aggregation_result_assessment
            .authority_source_acceptance_match_assessment.status,
          status
        );
      }
    });

    it("same state token + different match-key lineage → different Basis/State keys", () => {
      const a = build127(
        mockMatchAssessment({
          matches: [mockMatch({ match: LISTED, binding_suffix: "a" })],
        })
      );
      const b = build127(
        mockMatchAssessment({
          matches: [
            mockMatch({ match: LISTED, binding_suffix: "a" }),
            mockMatch({ match: LISTED, binding_suffix: "b" }),
          ],
        })
      );
      assert.equal(
        a.candidate_assessments[0]!.authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state,
        b.candidate_assessments[0]!.authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state
      );
      assert.notEqual(
        a.candidate_assessments[0]!.authority_dimension_evaluation_state_basis!
          .key,
        b.candidate_assessments[0]!.authority_dimension_evaluation_state_basis!
          .key
      );
      assert.notEqual(
        a.candidate_assessments[0]!.authority_dimension_evaluation_state!.key,
        b.candidate_assessments[0]!.authority_dimension_evaluation_state!.key
      );
    });

    it("State key encodes Basis key; identity helpers rebuild", () => {
      const set = build127();
      const basis =
        set.candidate_assessments[0]!
          .authority_dimension_evaluation_state_basis!;
      const state =
        set.candidate_assessments[0]!.authority_dimension_evaluation_state!;
      assert.equal(
        state.authority_dimension_evaluation_state_basis_key,
        basis.key
      );
      assert.equal(
        basis.key,
        attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasisKey(
          {
            candidate_key: basis.candidate_key,
            observation_need_key: basis.observation_need_key,
            capability_requirement_set_key:
              basis.capability_requirement_set_key,
            authority_dimension_evaluation_state:
              basis.authority_dimension_evaluation_state,
            authority_source_aggregation_result_assessment_status:
              basis.authority_source_aggregation_result_assessment_status,
            authority_source_aggregation_result_key:
              basis.authority_source_aggregation_result_key,
            authority_source_aggregation_readiness_basis_key:
              basis.authority_source_aggregation_readiness_basis_key,
            authority_source_aggregation_policy_key:
              basis.authority_source_aggregation_policy_key,
            authority_source_aggregation_kind:
              basis.authority_source_aggregation_kind,
            current_authority_source_acceptance_match_keys:
              basis.current_authority_source_acceptance_match_keys,
          }
        )
      );
      assert.equal(
        state.key,
        attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateKey(
          {
            candidate_key: state.candidate_key,
            observation_need_key: state.observation_need_key,
            capability_requirement_set_key:
              state.capability_requirement_set_key,
            authority_dimension_evaluation_state:
              state.authority_dimension_evaluation_state,
            authority_dimension_evaluation_state_basis_key: basis.key,
          }
        )
      );
      assert.equal(EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET.length > 0, true);
      assert.equal(NO_AGGREGATION_RESULT.length > 0, true);
      assert.equal(NO_READINESS_BASIS.length > 0, true);
      assert.equal(NO_AGGREGATION_POLICY.length > 0, true);
    });
  });

  describe("set booleans / malformed / immutability", () => {
    it("set resolved / unresolved / mixed booleans", () => {
      const resolved = build127();
      assert.equal(resolved.has_authority_dimension_evaluation_states, true);
      assert.equal(
        resolved.has_resolved_authority_dimension_evaluation_states,
        true
      );
      assert.equal(
        resolved.has_unresolved_authority_dimension_evaluation_states,
        false
      );

      const unresolved = build127(
        mockMatchAssessment({
          status: "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          matches: [],
        })
      );
      assert.equal(
        unresolved.has_resolved_authority_dimension_evaluation_states,
        false
      );
      assert.equal(
        unresolved.has_unresolved_authority_dimension_evaluation_states,
        true
      );
    });

    it("malformed RESULT_PRESENT with null result rejects", () => {
      const set = build125();
      const forged: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment =
        {
          ...set.candidate_assessments[0]!,
          status: "AUTHORITY_SOURCE_AGGREGATION_RESULT_PRESENT",
          authority_source_aggregation_result: null,
          has_authority_source_aggregation_result: false,
        };
      assert.throws(
        () =>
          mapAuthoritySourceAggregationResultAssessmentToEvaluationState(
            forged
          ),
        /RESULT_PRESENT/
      );
    });

    it("malformed readiness-failure with aggregation result rejects", () => {
      const holds = build125();
      const zero = build125(
        mockMatchAssessment({
          status: "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          matches: [],
        })
      );
      const forged: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment =
        {
          ...zero.candidate_assessments[0]!,
          authority_source_aggregation_result:
            holds.candidate_assessments[0]!
              .authority_source_aggregation_result,
          has_authority_source_aggregation_result: true,
        };
      assert.throws(
        () =>
          assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationState(
            forged
          ),
        /must not (embed|carry) aggregation result/
      );
    });

    it("malformed RESULT_PRESENT with nested readiness DOES_NOT_HOLD rejects", () => {
      const holds = build125();
      const forged: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment =
        {
          ...holds.candidate_assessments[0]!,
          authority_source_aggregation_readiness_basis_assessment: {
            ...holds.candidate_assessments[0]!
              .authority_source_aggregation_readiness_basis_assessment,
            authority_source_aggregation_readiness_basis: {
              ...holds.candidate_assessments[0]!
                .authority_source_aggregation_readiness_basis_assessment
                .authority_source_aggregation_readiness_basis!,
              readiness_condition:
                "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD",
            },
          },
        };
      assert.throws(
        () =>
          mapAuthoritySourceAggregationResultAssessmentToEvaluationState(
            forged
          ),
        /readiness condition HOLDS/
      );
    });

    it("self-contradictory policy-absence with policy PRESENT rejects", () => {
      const set = build125();
      const forged: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment =
        {
          ...set.candidate_assessments[0]!,
          status: "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED",
          authority_source_aggregation_result: null,
          has_authority_source_aggregation_result: false,
        };
      assert.throws(
        () =>
          mapAuthoritySourceAggregationResultAssessmentToEvaluationState(
            forged
          ),
        /missing aggregation policy/
      );
    });

    it("input immutability + deep-cloned same output + determinism", () => {
      const resultSet = build125();
      const input = {
        authority_source_aggregation_result_set: resultSet,
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet(
          deepClone(input)
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet(
          input
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });
  });

  describe("static / architectural boundaries", () => {
    it("schema 0.1.24; no 118/119/121–124 cores; no Satisfaction/OE/can_execute", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
        ]
      );

      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-types.ts"
      );
      const src =
        stripComments(readFileSync(corePath, "utf8")) +
        "\n" +
        stripComments(readFileSync(typesPath, "utf8"));

      assert.ok(
        !/authority-source-aggregation-readiness-basis-core/.test(src)
      );
      assert.ok(
        !/authority-source-aggregation-readiness-policy-core/.test(src)
      );
      assert.ok(!/authority-source-aggregation-policy-core/.test(src));
      assert.ok(!/authority-source-acceptance-match-core/.test(src));
      assert.ok(!/authority-source-acceptance-criteria-core/.test(src));
      assert.ok(!/authority-source-resolution-classification/.test(src));
      assert.ok(!/authority-required-dimension-coverage/.test(src));
      assert.ok(!/authority-source-bridge-core/.test(src));
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
      assert.ok(!/effective_authority/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));

      // runtime import is only 125 types + 127 types
      assert.ok(
        /authority-source-aggregation-result-types\.js/.test(
          stripComments(readFileSync(corePath, "utf8"))
        )
      );
    });

    it("resolved helper exact mapping for all five states", () => {
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED"
        ),
        false
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED"
        ),
        false
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
          "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
        ),
        false
      );
    });
  });
});
