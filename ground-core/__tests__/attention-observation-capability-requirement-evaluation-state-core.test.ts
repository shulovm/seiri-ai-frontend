/**
 * GROUND-072 — Observation Core XXVI / Capability Requirement Evaluation State
 *
 * Pure GROUND-071 normalization (seven Requirement Evaluation States;
 * no SATISFIED/UNSATISFIED / aggregation recomputation / readiness recomputation).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_EVALUATION_STATE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationCapabilityRequirementEvaluationState,
  attentionObservationCapabilityRequirementEvaluationStateKey,
  buildAttentionObservationCapabilityRequirementEvaluationStateSet,
  mapRequirementDimensionAggregationAssessmentToEvaluationState,
} from "../reality/attention-observation-capability-requirement-evaluation-state-core.js";
import type {
  AttentionObservationCapabilityRequirementDimensionAggregationOutcome,
  AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationResultStatus,
} from "../reality/attention-observation-capability-requirement-dimension-aggregation-result-types.js";
import type {
  AttentionObservationCapabilityRequirementEvaluationState,
} from "../reality/attention-observation-capability-requirement-evaluation-state-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const REQ_KEY = "req";
const NEED_KEY = "need";

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"CAPABLE"/.test(json));
  assert.ok(!/"INCAPABLE"/.test(json));
  assert.ok(!/"has_satisfied_requirement"/.test(json));
  assert.ok(!/"has_holding_requirement"/.test(json));
  assert.ok(!/"all_requirements_hold"/.test(json));
  assert.ok(!/"all_requirements_resolved"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
}

function mockRequirementAggregationAssessment(options: {
  status: AttentionObservationCapabilityRequirementDimensionAggregationResultStatus;
  outcome?: AttentionObservationCapabilityRequirementDimensionAggregationOutcome;
  readinessBasisPresent?: boolean;
  readinessOutcome?:
    | "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
    | "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";
  requirementKey?: string;
}): AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment {
  const requirementKey = options.requirementKey ?? REQ_KEY;
  const resultPresent =
    options.status ===
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT";
  const readinessDoesNotHold =
    options.status ===
    "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";
  const missingReadinessPolicy =
    options.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY";

  const readinessBasisPresent =
    options.readinessBasisPresent ??
    (resultPresent || readinessDoesNotHold);

  return {
    capability_requirement: {
      key: requirementKey,
      observation_need_key: NEED_KEY,
      capability_semantic_key: "inspect",
    } as never,
    required_dimension_evaluation_state_assessment: {} as never,
    requirement_dimension_aggregation_policy_assessment: {} as never,
    requirement_dimension_aggregation_readiness_assessment: {
      capability_requirement: {
        key: requirementKey,
        observation_need_key: NEED_KEY,
        capability_semantic_key: "inspect",
      } as never,
      dimension_evaluation_state_assessment: {} as never,
      readiness_policy_assessment: {} as never,
      status: readinessBasisPresent
        ? ("CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT" as const)
        : missingReadinessPolicy
          ? ("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY" as const)
          : ("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY" as const),
      readiness_basis: readinessBasisPresent
        ? {
            key: `readiness|${requirementKey}`,
            capability_requirement_key: requirementKey,
            observation_need_key: NEED_KEY,
            evaluation_dimension_policy_key: "eval-policy",
            readiness_policy_key: "readiness-policy",
            readiness_kind:
              "REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION" as const,
            required_dimension_evaluation_state_basis_keys: ["state-a"],
            unresolved_dimension_refs: readinessDoesNotHold
              ? [
                  {
                    required_dimension:
                      "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
                    evaluation_state_basis_key: "state-a",
                    unresolved_state:
                      "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED" as const,
                  },
                ]
              : [],
            outcome:
              options.readinessOutcome ??
              (readinessDoesNotHold
                ? "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
                : "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"),
          }
        : null,
    },
    status: options.status,
    aggregation_result_basis: resultPresent
      ? {
          key: `agg-result|${requirementKey}`,
          capability_requirement_key: requirementKey,
          observation_need_key: NEED_KEY,
          evaluation_dimension_policy_key: "eval-policy",
          requirement_dimension_aggregation_policy_key: "agg-policy",
          requirement_dimension_aggregation_readiness_basis_key: `readiness|${requirementKey}`,
          aggregation_kind:
            "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
          required_dimension_evaluation_state_basis_keys: ["state-a"],
          outcome: options.outcome!,
        }
      : null,
  };
}

function mockCandidate(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment[],
  status:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_PRESENT"
    | "NO_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_REPRESENTED" = "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_PRESENT"
) {
  return {
    candidate_key: "cand",
    required_dimension_evaluation_state_assessment: {} as never,
    requirement_dimension_aggregation_policy_assessment: {} as never,
    requirement_dimension_aggregation_readiness_assessment: {} as never,
    status,
    requirement_aggregation_assessments: assessments,
    has_capability_requirement_dimension_aggregation_result: assessments.some(
      (a) =>
        a.status ===
        "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT"
    ),
    model_limitations: [],
  };
}

function buildSet(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment[]
) {
  return buildAttentionObservationCapabilityRequirementEvaluationStateSet({
    capability_requirement_dimension_aggregation_result_set: {
      capability_required_dimension_evaluation_state_set: {} as never,
      capability_requirement_dimension_aggregation_policy_set: {} as never,
      capability_requirement_dimension_aggregation_readiness_set: {} as never,
      candidate_assessments: [mockCandidate(assessments) as never],
      has_capability_requirement_dimension_aggregation_result:
        assessments.some(
          (a) =>
            a.status ===
            "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT"
        ),
      model_limitations: [],
    },
  });
}

function firstState(
  set: ReturnType<typeof buildSet>
): AttentionObservationCapabilityRequirementEvaluationState {
  return set.candidate_assessments[0]!
    .requirement_evaluation_assessments[0]!.evaluation_state_basis.state;
}

describe("GROUND-072 Capability Requirement Evaluation State", () => {
  describe("071 → 072 mappings", () => {
    it("aggregation HOLDS → REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
        }),
      ]);
      assert.equal(
        firstState(set),
        "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS"
      );
      assert.equal(
        set.candidate_assessments[0]!.requirement_evaluation_assessments[0]!
          .evaluation_state_basis
          .requirement_dimension_aggregation_result_basis_key,
        "agg-result|req"
      );
      assertNoForbiddenSemantics(set);
    });

    it("aggregation DOES_NOT_HOLD → corresponding state", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      assert.equal(
        firstState(set),
        "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("missing Evaluation Dimension Policy mapping", () => {
      assert.equal(
        firstState(
          buildSet([
            mockRequirementAggregationAssessment({
              status:
                "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY",
            }),
          ])
        ),
        "UNRESOLVED_CAPABILITY_EVALUATION_DIMENSION_POLICY_NOT_DECLARED"
      );
    });

    it("zero required Dimensions mapping", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status: "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS",
        }),
      ]);
      assert.equal(
        firstState(set),
        "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
      );
      assertNoForbiddenSemantics(set);
    });

    it("missing Requirement aggregation policy mapping", () => {
      assert.equal(
        firstState(
          buildSet([
            mockRequirementAggregationAssessment({
              status:
                "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY",
            }),
          ])
        ),
        "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_DECLARED"
      );
    });

    it("missing readiness policy mapping", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY",
        }),
      ]);
      assert.equal(
        firstState(set),
        "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_NOT_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[0]!.requirement_evaluation_assessments[0]!
          .evaluation_state_basis
          .requirement_dimension_aggregation_readiness_basis_key,
        null
      );
    });

    it("readiness condition DOES_NOT_HOLD mapping != aggregation DOES_NOT_HOLD", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      const basis =
        set.candidate_assessments[0]!.requirement_evaluation_assessments[0]!
          .evaluation_state_basis;
      assert.equal(
        basis.state,
        "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.notEqual(
        basis.state,
        "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        basis.requirement_dimension_aggregation_result_basis_key,
        null
      );
      assert.equal(
        basis.requirement_dimension_aggregation_readiness_basis_key,
        "readiness|req"
      );
    });
  });

  describe("firewalls / invariants", () => {
    it("HOLDS != SATISFIED; DOES_NOT_HOLD != UNSATISFIED; zero dims != verdict", () => {
      for (const assessment of [
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
        }),
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
        mockRequirementAggregationAssessment({
          status: "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS",
        }),
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY",
        }),
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY",
        }),
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY",
        }),
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]) {
        assertNoForbiddenSemantics(
          mapRequirementDimensionAggregationAssessmentToEvaluationState(
            assessment
          )
        );
      }
    });

    it("exactly one state per Requirement; unresolved still present", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY",
          requirementKey: "r1",
        }),
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
          requirementKey: "r2",
        }),
      ]);
      assert.equal(
        set.candidate_assessments[0]!.requirement_evaluation_assessments.length,
        2
      );
      assert.equal(
        set.candidate_assessments[0]!.has_capability_requirement_evaluation_states,
        true
      );
    });

    it("RESULT_PRESENT/null contradiction rejects", () => {
      const bad = mockRequirementAggregationAssessment({
        status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
        outcome:
          "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
      });
      bad.aggregation_result_basis = null;
      assert.throws(
        () => mapRequirementDimensionAggregationAssessmentToEvaluationState(bad),
        /PRESENT requires non-null/
      );
    });

    it("NOT_APPLICABLE/non-null aggregation result contradiction rejects", () => {
      const bad = mockRequirementAggregationAssessment({
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY",
      });
      bad.aggregation_result_basis = {
        key: "synthetic",
        capability_requirement_key: REQ_KEY,
        observation_need_key: NEED_KEY,
        evaluation_dimension_policy_key: "eval",
        requirement_dimension_aggregation_policy_key: "agg",
        requirement_dimension_aggregation_readiness_basis_key: "ready",
        aggregation_kind:
          "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
        required_dimension_evaluation_state_basis_keys: [],
        outcome: "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
      };
      assert.throws(
        () => mapRequirementDimensionAggregationAssessmentToEvaluationState(bad),
        /non-applicable status requires null/
      );
    });

    it("readiness DOES_NOT_HOLD lineage contradiction rejects", () => {
      const bad = mockRequirementAggregationAssessment({
        status:
          "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
      });
      bad.requirement_dimension_aggregation_readiness_assessment.readiness_basis!.outcome =
        "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS";
      assert.throws(
        () => mapRequirementDimensionAggregationAssessmentToEvaluationState(bad),
        /readiness outcome DOES_NOT_HOLD/
      );
    });

    it("missing readiness policy with contradictory basis rejects", () => {
      const bad = mockRequirementAggregationAssessment({
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY",
        readinessBasisPresent: true,
        readinessOutcome:
          "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS",
      });
      assert.throws(
        () => mapRequirementDimensionAggregationAssessmentToEvaluationState(bad),
        /must not carry readiness basis PRESENT/
      );
    });
  });

  describe("candidate / set / mixed states", () => {
    it("mixed Requirement states preserved independently", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
          requirementKey: "r1",
        }),
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD",
          requirementKey: "r2",
        }),
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY",
          requirementKey: "r3",
        }),
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
          requirementKey: "r4",
        }),
        mockRequirementAggregationAssessment({
          status: "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS",
          requirementKey: "r5",
        }),
      ]);
      const states = set.candidate_assessments[0]!.requirement_evaluation_assessments.map(
        (a) => a.evaluation_state_basis.state
      );
      assert.deepEqual(states, [
        "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS",
        "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_DECLARED",
        "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED",
      ]);
      assert.equal(
        set.candidate_assessments[0]!.status,
        "CAPABILITY_REQUIREMENT_EVALUATION_STATES_PRESENT"
      );
      assertNoForbiddenSemantics(set);
    });

    it("candidate boolean true with all unresolved / all DOES_NOT_HOLD", () => {
      const unresolved = buildSet([
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY",
        }),
      ]);
      assert.equal(
        unresolved.has_capability_requirement_evaluation_states,
        true
      );

      const doesNotHold = buildSet([
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      assert.equal(
        doesNotHold.has_capability_requirement_evaluation_states,
        true
      );
    });

    it("all HOLDS Requirements → independent states only", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
          requirementKey: "r1",
        }),
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
          requirementKey: "r2",
        }),
      ]);
      assert.equal(
        set.candidate_assessments[0]!.requirement_evaluation_assessments.length,
        2
      );
      assertNoForbiddenSemantics(set);
    });

    it("no planning basis / no requirements candidate statuses", () => {
      const noPlan =
        assessAttentionCandidateObservationCapabilityRequirementEvaluationState(
          mockCandidate([], "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS") as never
        );
      assert.equal(
        noPlan.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );

      const noReq =
        assessAttentionCandidateObservationCapabilityRequirementEvaluationState(
          mockCandidate(
            [],
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
          ) as never
        );
      assert.equal(
        noReq.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });
  });

  describe("identity / determinism / immutability", () => {
    it("state identity includes state and lineage keys", () => {
      const key = attentionObservationCapabilityRequirementEvaluationStateKey(
        REQ_KEY,
        "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS",
        "agg-result|req",
        "readiness|req"
      );
      assert.ok(
        key.startsWith(
          "attention-observation-capability-requirement-evaluation-state|"
        )
      );
      assert.ok(key.includes("REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS"));
    });

    it("state change changes identity", () => {
      const a = buildSet([
        mockRequirementAggregationAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY",
        }),
      ]);
      const b = buildSet([
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
        }),
      ]);
      assert.notEqual(
        a.candidate_assessments[0]!.requirement_evaluation_assessments[0]!
          .evaluation_state_basis.key,
        b.candidate_assessments[0]!.requirement_evaluation_assessments[0]!
          .evaluation_state_basis.key
      );
    });

    it("determinism and deep-cloned input", () => {
      const assessments = [
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS",
        }),
      ];
      const a = buildSet(assessments);
      const b = buildSet(assessments);
      assert.deepEqual(a, b);

      const cloned = JSON.parse(
        JSON.stringify({
          capability_requirement_dimension_aggregation_result_set:
            a.capability_requirement_dimension_aggregation_result_set,
        })
      );
      const rebuilt =
        buildAttentionObservationCapabilityRequirementEvaluationStateSet(cloned);
      assert.deepEqual(
        rebuilt.candidate_assessments[0]!.requirement_evaluation_assessments[0]!
          .evaluation_state_basis,
        a.candidate_assessments[0]!.requirement_evaluation_assessments[0]!
          .evaluation_state_basis
      );
      assert.notEqual(
        rebuilt.capability_requirement_dimension_aggregation_result_set,
        a.capability_requirement_dimension_aggregation_result_set
      );
    });

    it("071 input immutability", () => {
      const set = buildSet([
        mockRequirementAggregationAssessment({
          status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
          outcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      const before = JSON.stringify(
        set.capability_requirement_dimension_aggregation_result_set
      );
      buildAttentionObservationCapabilityRequirementEvaluationStateSet({
        capability_requirement_dimension_aggregation_result_set:
          set.capability_requirement_dimension_aggregation_result_set,
      });
      assert.equal(
        JSON.stringify(
          set.capability_requirement_dimension_aggregation_result_set
        ),
        before
      );
    });
  });

  describe("model limitations / static proofs", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_EVALUATION_STATE_MODEL_LIMITATIONS[0],
        "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_EVALUATION_STATE_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 071-only runtime; no recomputation", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-evaluation-state-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-evaluation-state-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(
        /capability_requirement_dimension_aggregation_result_set/.test(core)
      );
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));

      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-readiness-core/.test(src)
      );
      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*required-dimension-evaluation-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*aggregation-readiness-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*dimension-source-aggregation-outcome-core/.test(src)
      );

      assert.ok(!/\.some\(/.test(core));
      assert.ok(!/\.every\(/.test(core));
      assert.ok(!/isResolvedCapabilityRequiredDimensionEvaluationState/.test(core));
      assert.ok(
        !/evaluateRequirementDimensionAggregationPolicyCondition/.test(core)
      );
      assert.ok(!/"SATISFIED"/.test(core));
      assert.ok(!/"UNSATISFIED"/.test(core));
      assert.ok(!/"UNKNOWN"/.test(core));
    });
  });
});
