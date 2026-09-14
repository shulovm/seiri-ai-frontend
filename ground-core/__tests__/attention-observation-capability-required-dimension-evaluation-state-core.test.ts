/**
 * GROUND-067 — Observation Core XXI / Required Capability Dimension Evaluation State
 *
 * Pure GROUND-066 normalization (five evaluation states; no PASS/FAIL).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationCapabilityRequiredDimensionEvaluationState,
  attentionObservationCapabilityRequiredDimensionEvaluationStateKey,
  buildAttentionObservationCapabilityRequiredDimensionEvaluationStateSet,
  mapSourceAggregationAssessmentToEvaluationState,
} from "../reality/attention-observation-capability-required-dimension-evaluation-state-core.js";
import type {
  AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationStatus,
} from "../reality/attention-observation-capability-dimension-source-aggregation-outcome-types.js";
import type {
  AttentionObservationCapabilityRequiredDimensionEvaluationState,
} from "../reality/attention-observation-capability-required-dimension-evaluation-state-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

function mockAggregationAssessment(
  status: AttentionObservationCapabilityRequiredDimensionSourceAggregationStatus,
  outcome?: "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS" | "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
): AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment {
  const outcomePresent =
    status === "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT";
  return {
    required_dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
    source_acceptance_assessment: {} as never,
    source_aggregation_policy_assessment: {} as never,
    status,
    source_aggregation_outcome_basis: outcomePresent
      ? {
          key: "outcome-basis-key",
          capability_requirement_key: "req",
          observation_need_key: "need",
          required_dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          acceptance_criterion_key: "criterion",
          source_aggregation_policy_key: "policy",
          aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
          source_acceptance_match_basis_keys: ["k1"],
          outcome: outcome!,
        }
      : null,
  };
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"MET"/.test(json));
  assert.ok(!/"UNMET"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"DIMENSION_ACCEPTED"/.test(json));
  assert.ok(!/"DIMENSION_REJECTED"/.test(json));
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"resolved_count"/.test(json));
  assert.ok(!/"unresolved_count"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

describe("Attention Observation Capability Required Dimension Evaluation State (GROUND-067)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 066-only runtime; no aggregation recomputation", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-required-dimension-evaluation-state-core.ts"
        ),
        "utf8"
      );
      assert.ok(/capability_dimension_source_aggregation_outcome_set/.test(core));
      assert.ok(/SOURCE_AGGREGATION_CONDITION_HOLDS/.test(core));
      assert.ok(/UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED/.test(core));
      assert.ok(!/from ["'].*source-acceptance-match-core/.test(core));
      assert.ok(!/from ["'].*dimension-source-aggregation-policy-core/.test(core));
      assert.ok(!/from ["'].*dimension-source-aggregation-outcome-core/.test(core));
      assert.ok(!/\.some\s*\(/.test(core));
      assert.ok(!/\.every\s*\(/.test(core));
      assert.ok(!/LISTED_AS_ACCEPTABLE/.test(core));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS.includes(
          "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
        )
      );
    });
  });

  describe("exhaustive 066 → 067 mapping", () => {
    const cases: {
      status: AttentionObservationCapabilityRequiredDimensionSourceAggregationStatus;
      outcome?: "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS" | "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD";
      expected: AttentionObservationCapabilityRequiredDimensionEvaluationState;
    }[] = [
      {
        status:
          "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED",
        expected: "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED",
      },
      {
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION",
        expected: "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
      },
      {
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY",
        expected: "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED",
      },
      {
        status: "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT",
        outcome: "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS",
        expected: "SOURCE_AGGREGATION_CONDITION_HOLDS",
      },
      {
        status: "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT",
        outcome: "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD",
        expected: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
      },
    ];

    for (const { status, outcome, expected } of cases) {
      it(`maps ${status}${outcome ? ` + ${outcome}` : ""} → ${expected}`, () => {
        const assessment = mockAggregationAssessment(status, outcome);
        assert.equal(
          mapSourceAggregationAssessmentToEvaluationState(assessment),
          expected
        );
        const basis = assessAttentionCandidateObservationCapabilityRequiredDimensionEvaluationState(
          {
            candidate_key: "cand",
            source_acceptance_match_assessment: {} as never,
            source_aggregation_policy_assessment: {} as never,
            status: "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOMES_PRESENT",
            requirement_dimension_aggregation_assessments: [
              {
                capability_requirement: {
                  key: "req",
                  observation_need_key: "need",
                  capability_semantic_key: "inspect",
                } as never,
                source_acceptance_assessment: {} as never,
                source_aggregation_policy_assessment: {} as never,
                required_dimension_aggregation_assessments: [assessment],
                has_capability_dimension_source_aggregation_outcome:
                  outcomePresent(status),
              },
            ],
            has_capability_dimension_source_aggregation_outcome:
              outcomePresent(status),
            model_limitations: [],
          }
        ).requirement_dimension_evaluation_state_assessments[0]
          .required_dimension_evaluation_assessments[0].evaluation_state_basis;

        if (
          expected === "SOURCE_AGGREGATION_CONDITION_HOLDS" ||
          expected === "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
        ) {
          assert.equal(basis.source_aggregation_outcome_basis_key, "outcome-basis-key");
        } else {
          assert.equal(basis.source_aggregation_outcome_basis_key, null);
        }
      });
    }

    function outcomePresent(
      status: AttentionObservationCapabilityRequiredDimensionSourceAggregationStatus
    ): boolean {
      return status === "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT";
    }
  });

  describe("state basis identity", () => {
    it("state transition changes key; unresolved uses none suffix", () => {
      const holdsKey = attentionObservationCapabilityRequiredDimensionEvaluationStateKey(
        "req",
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
        "SOURCE_AGGREGATION_CONDITION_HOLDS",
        "outcome-key"
      );
      const unresolvedKey =
        attentionObservationCapabilityRequiredDimensionEvaluationStateKey(
          "req",
          "CAPABILITY_AVAILABILITY_REPRESENTATION",
          "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
          null
        );
      assert.ok(holdsKey.includes("SOURCE_AGGREGATION_CONDITION_HOLDS"));
      assert.ok(unresolvedKey.endsWith("|none"));
      assert.notEqual(holdsKey, unresolvedKey);
    });
  });

  describe("invariant violations", () => {
    it("OUTCOME_PRESENT with null basis rejects", () => {
      const assessment = mockAggregationAssessment(
        "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT",
        "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
      assessment.source_aggregation_outcome_basis = null;
      assert.throws(
        () => mapSourceAggregationAssessmentToEvaluationState(assessment),
        /invariant violated/
      );
    });

    it("non-applicable with non-null outcome basis rejects", () => {
      const assessment = mockAggregationAssessment(
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
      );
      assessment.source_aggregation_outcome_basis = {
        key: "bad",
      } as never;
      assert.throws(
        () => mapSourceAggregationAssessmentToEvaluationState(assessment),
        /non-applicable status requires null outcome basis/
      );
    });
  });

  describe("semantic firewalls", () => {
    it("HOLDS != PASS; DOES_NOT_HOLD != FAIL; UNRESOLVED != FAIL", () => {
      const states: AttentionObservationCapabilityRequiredDimensionEvaluationState[] = [
        "SOURCE_AGGREGATION_CONDITION_HOLDS",
        "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED",
        "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
        "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED",
      ];
      for (const state of states) {
        assert.notEqual(state, "PASS" as never);
        assert.notEqual(state, "FAIL" as never);
        assert.notEqual(state, "SATISFIED" as never);
        assert.notEqual(state, "UNSATISFIED" as never);
      }
      for (const unresolved of states.slice(2)) {
        assert.notEqual(
          unresolved,
          "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
        );
      }
    });

    it("unresolved reasons do not collapse to DOES_NOT_HOLD", () => {
      assert.notEqual(
        mapSourceAggregationAssessmentToEvaluationState(
          mockAggregationAssessment(
            "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
          )
        ),
        "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.notEqual(
        mapSourceAggregationAssessmentToEvaluationState(
          mockAggregationAssessment(
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
          )
        ),
        "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.notEqual(
        mapSourceAggregationAssessmentToEvaluationState(
          mockAggregationAssessment(
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY"
          )
        ),
        "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
    });
  });

  describe("one state per required dimension", () => {
    it("exactly one evaluation state per 066 dimension assessment; no duplicates", () => {
      const dimensions = [
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
        "CAPABILITY_VERIFICATION_REPRESENTATION",
      ] as const;
      const assessments = dimensions.map((dimension, index) => {
        const a = mockAggregationAssessment(
          index === 0
            ? "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT"
            : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION",
          index === 0 ? "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS" : undefined
        );
        a.required_dimension = dimension;
        if (a.source_aggregation_outcome_basis) {
          a.source_aggregation_outcome_basis.required_dimension = dimension;
        }
        return a;
      });

      const result = assessAttentionCandidateObservationCapabilityRequiredDimensionEvaluationState(
        mockOutcomeCandidateAssessment(assessments)
      );
      const evals =
        result.requirement_dimension_evaluation_state_assessments[0]
          .required_dimension_evaluation_assessments;
      assert.equal(evals.length, 2);
      assert.equal(new Set(evals.map((e) => e.required_dimension)).size, 2);
      assert.equal(new Set(evals.map((e) => e.evaluation_state_basis.key)).size, 2);
    });
  });

  describe("boolean semantics", () => {
    it("requirement boolean true with all unresolved states", () => {
      const result = assessAttentionCandidateObservationCapabilityRequiredDimensionEvaluationState(
        mockOutcomeCandidateAssessment([
          mockAggregationAssessment(
            "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
          ),
          mockAggregationAssessment(
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
          ),
          mockAggregationAssessment(
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY"
          ),
        ])
      );
      assert.equal(result.has_capability_required_dimension_evaluation_states, true);
      assert.equal(
        result.requirement_dimension_evaluation_state_assessments[0]
          .has_capability_required_dimension_evaluation_states,
        true
      );
    });

    it("set boolean true with all DOES_NOT_HOLD; no positive aggregate fields", () => {
      const outcomeCandidate = mockOutcomeCandidateAssessment([
        mockAggregationAssessment(
          "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT",
          "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
        ),
      ]);
      const set = buildAttentionObservationCapabilityRequiredDimensionEvaluationStateSet(
        {
          capability_dimension_source_aggregation_outcome_set:
            mockOutcomeSetAssessment(outcomeCandidate),
        }
      );
      assert.equal(set.has_capability_required_dimension_evaluation_states, true);
      assert.equal(
        Object.keys(set.candidate_assessments[0]).includes("has_holding_dimension"),
        false
      );
      assertNoForbiddenSemantics(set);
    });
  });

  describe("mixed dimension states", () => {
    it("preserves HOLDS, DOES_NOT_HOLD, and unresolved independently", () => {
      const result = assessAttentionCandidateObservationCapabilityRequiredDimensionEvaluationState(
        mockOutcomeCandidateAssessment([
          mockAggregationAssessment(
            "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT",
            "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
          ),
          mockAggregationAssessment(
            "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT",
            "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
          ),
          mockAggregationAssessment(
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
          ),
          mockAggregationAssessment(
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY"
          ),
          mockAggregationAssessment(
            "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
          ),
        ])
      );

      const states =
        result.requirement_dimension_evaluation_state_assessments[0].required_dimension_evaluation_assessments.map(
          (a) => a.evaluation_state_basis.state
        );
      assert.deepEqual(states, [
        "SOURCE_AGGREGATION_CONDITION_HOLDS",
        "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
        "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED",
        "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED",
      ]);
      assert.equal(result.has_capability_required_dimension_evaluation_states, true);
      assert.equal(result.status, "CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATES_PRESENT");
      assertNoForbiddenSemantics(result);
    });
  });

  describe("determinism / immutability", () => {
    it("deep-cloned 066 input yields identical output; input unchanged", () => {
      const outcomeSet = mockOutcomeSetAssessment(
        mockOutcomeCandidateAssessment([
          mockAggregationAssessment(
            "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT",
            "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
          ),
        ])
      );
      const before = structuredClone(outcomeSet);
      const first = buildAttentionObservationCapabilityRequiredDimensionEvaluationStateSet(
        { capability_dimension_source_aggregation_outcome_set: structuredClone(outcomeSet) }
      );
      const second = buildAttentionObservationCapabilityRequiredDimensionEvaluationStateSet(
        { capability_dimension_source_aggregation_outcome_set: structuredClone(outcomeSet) }
      );
      assert.deepEqual(first, second);
      assert.deepEqual(outcomeSet, before);
    });
  });
});

function mockOutcomeCandidateAssessment(
  required_dimension_aggregation_assessments: AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment[]
) {
  const hasOutcome = required_dimension_aggregation_assessments.some(
    (a) =>
      a.status === "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT"
  );
  return {
    candidate_key: "cand",
    source_acceptance_match_assessment: {} as never,
    source_aggregation_policy_assessment: {} as never,
    status: "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOMES_PRESENT" as const,
    requirement_dimension_aggregation_assessments: [
      {
        capability_requirement: {
          key: "req",
          observation_need_key: "need",
          capability_semantic_key: "inspect",
        } as never,
        source_acceptance_assessment: {} as never,
        source_aggregation_policy_assessment: {} as never,
        required_dimension_aggregation_assessments,
        has_capability_dimension_source_aggregation_outcome: hasOutcome,
      },
    ],
    has_capability_dimension_source_aggregation_outcome: hasOutcome,
    model_limitations: [],
  };
}

function mockOutcomeSetAssessment(
  candidate: ReturnType<typeof mockOutcomeCandidateAssessment>
) {
  return {
    capability_source_acceptance_match_set: {} as never,
    capability_dimension_source_aggregation_policy_set: {} as never,
    candidate_assessments: [candidate],
    has_capability_dimension_source_aggregation_outcome:
      candidate.has_capability_dimension_source_aggregation_outcome,
    model_limitations: [],
  };
}
