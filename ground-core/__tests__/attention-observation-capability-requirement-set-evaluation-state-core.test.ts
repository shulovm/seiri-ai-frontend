/**
 * GROUND-080 — Observation Core XXXIV / Capability Requirement Set Evaluation
 * State Foundation
 *
 * Pure GROUND-079 normalization (five Requirement-set Evaluation States;
 * no HAS_CAPABILITY / LACKS_CAPABILITY / composition recomputation /
 * readiness recomputation).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationCapabilityRequirementSetEvaluationState,
  attentionObservationCapabilityRequirementSetEvaluationStateKey,
  buildAttentionObservationCapabilityRequirementSetEvaluationStateSet,
  mapCapabilityRequirementSetCompositionAssessmentToEvaluationState,
} from "../reality/attention-observation-capability-requirement-set-evaluation-state-core.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment,
  AttentionObservationCapabilityRequirementSetCompositionOutcome,
  AttentionObservationCapabilityRequirementSetCompositionStatus,
} from "../reality/attention-observation-capability-requirement-set-composition-result-types.js";
import type {
  AttentionObservationCapabilityRequirementSetEvaluationState,
} from "../reality/attention-observation-capability-requirement-set-evaluation-state-types.js";
import { buildAttentionObservationCapabilityRequirementSetKey } from "../reality/attention-observation-capability-requirement-set-identity.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const REQ1 = "attention-observation-capability-requirement|need|inspect";
const SET_KEY = buildAttentionObservationCapabilityRequirementSetKey(
  CAND,
  NEED_KEY,
  [REQ1]
);
const RESULT_KEY = "composition-result|cand";
const READINESS_KEY = "readiness|cand";

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"CAPABILITY_PRESENT"/.test(json));
  assert.ok(!/"CAPABILITY_ABSENT"/.test(json));
  assert.ok(!/"CAPABLE"/.test(json));
  assert.ok(!/"INCAPABLE"/.test(json));
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"PARTIAL"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"has_holding_requirement_set"/.test(json));
  assert.ok(!/"is_capable"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

function mockCompositionAssessment(options: {
  status: AttentionObservationCapabilityRequirementSetCompositionStatus;
  outcome?: AttentionObservationCapabilityRequirementSetCompositionOutcome;
  readinessBasisPresent?: boolean;
  readinessOutcome?:
    | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
    | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";
  compositionPolicyPresent?: boolean;
  candidate_key?: string;
  observation_need_key?: string;
  forceResultBasis?:
    | AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment["composition_result_basis"]
    | undefined;
  forceReadinessBasis?:
    | AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment["capability_requirement_set_composition_readiness_assessment"]["readiness_basis"]
    | undefined;
  forceCompositionPolicy?:
    | AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment["capability_requirement_set_composition_policy_assessment"]["capability_requirement_set_composition_policy"]
    | undefined;
  forceCompositionPolicyStatus?: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment["capability_requirement_set_composition_policy_assessment"]["status"];
  forceReadinessStatus?: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment["capability_requirement_set_composition_readiness_assessment"]["status"];
}): AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment {
  const candidateKey = options.candidate_key ?? CAND;
  const needKey = options.observation_need_key ?? NEED_KEY;
  const setKey = buildAttentionObservationCapabilityRequirementSetKey(
    candidateKey,
    needKey,
    [REQ1]
  );
  const resultPresent =
    options.status === "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT";
  const readinessDoesNotHold =
    options.status ===
    "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";
  const missingReadinessPolicy =
    options.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY";
  const missingCompositionPolicy =
    options.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY";

  const readinessBasisPresent =
    options.readinessBasisPresent ??
    (resultPresent || readinessDoesNotHold);

  const compositionPolicyPresent =
    options.compositionPolicyPresent ??
    (resultPresent || missingReadinessPolicy || readinessDoesNotHold);

  const readinessBasis =
    options.forceReadinessBasis !== undefined
      ? options.forceReadinessBasis
      : readinessBasisPresent
        ? {
            key: `${READINESS_KEY}|${candidateKey}`,
            candidate_key: candidateKey,
            observation_need_key: needKey,
            capability_requirement_set_key: setKey,
            readiness_policy_key: "readiness-policy",
            readiness_kind:
              "REQUIRE_ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_RESOLVED_BEFORE_COMPOSITION" as const,
            capability_requirement_satisfaction_state_basis_keys: [
              "satisfaction|req1",
            ],
            unresolved_requirement_refs: readinessDoesNotHold
              ? [
                  {
                    capability_requirement_key: REQ1,
                    satisfaction_state_basis_key: "satisfaction|req1",
                    unresolved_satisfaction_state:
                      "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE" as const,
                  },
                ]
              : [],
            outcome:
              options.readinessOutcome ??
              (readinessDoesNotHold
                ? "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
                : "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"),
          }
        : null;

  const compositionPolicy =
    options.forceCompositionPolicy !== undefined
      ? options.forceCompositionPolicy
      : compositionPolicyPresent
        ? {
            key: `composition-policy|${candidateKey}`,
            candidate_key: candidateKey,
            observation_need_key: needKey,
            capability_requirement_set_key: setKey,
            capability_requirement_keys: [REQ1],
            composition_kind:
              "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED" as const,
          }
        : null;

  const compositionResultBasis =
    options.forceResultBasis !== undefined
      ? options.forceResultBasis
      : resultPresent
        ? {
            key: `${RESULT_KEY}|${candidateKey}`,
            candidate_key: candidateKey,
            observation_need_key: needKey,
            capability_requirement_set_key: setKey,
            requirement_set_composition_policy_key: `composition-policy|${candidateKey}`,
            requirement_set_composition_readiness_basis_key: `${READINESS_KEY}|${candidateKey}`,
            composition_kind:
              "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED" as const,
            capability_requirement_satisfaction_state_basis_keys: [
              "satisfaction|req1",
            ],
            outcome: options.outcome!,
          }
        : null;

  return {
    candidate_key: candidateKey,
    capability_requirement_satisfaction_assessment: {
      candidate_key: candidateKey,
      status: "CAPABILITY_REQUIREMENT_SATISFACTION_STATES_PRESENT",
      requirement_satisfaction_assessments: [
        {
          capability_requirement: {
            key: REQ1,
            observation_need_key: needKey,
            capability_semantic_key: "inspect",
          },
          satisfaction_interpretation_assessment: {} as never,
          satisfaction_state_basis: {
            key: "satisfaction|req1",
            capability_requirement_key: REQ1,
            observation_need_key: needKey,
            requirement_evaluation_state_basis_key: "eval|req1",
            satisfaction_state: "SATISFIED",
            satisfaction_interpretation_basis_key: "interp|req1",
            satisfaction_interpretation_policy_key: "policy|req1",
          },
        },
      ],
      has_capability_requirement_satisfaction_states: true,
      model_limitations: [],
    } as never,
    capability_requirement_set_composition_policy_assessment: {
      candidate_key: candidateKey,
      capability_requirement_assessment: {} as never,
      status:
        options.forceCompositionPolicyStatus ??
        (compositionPolicyPresent
          ? "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT"
          : missingCompositionPolicy
            ? "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"
            : "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"),
      capability_requirement_set_composition_policy: compositionPolicy,
      model_limitations: [],
    },
    capability_requirement_set_composition_readiness_assessment: {
      candidate_key: candidateKey,
      capability_requirement_satisfaction_assessment: {} as never,
      capability_requirement_set_composition_readiness_policy_assessment:
        {} as never,
      status:
        options.forceReadinessStatus ??
        (readinessBasisPresent
          ? "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT"
          : missingReadinessPolicy
            ? "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY"
            : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"),
      readiness_basis: readinessBasis,
      model_limitations: [],
    },
    status: options.status,
    composition_result_basis: compositionResultBasis,
    model_limitations: [],
  };
}

function buildSet(
  assessments: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment[]
) {
  return buildAttentionObservationCapabilityRequirementSetEvaluationStateSet({
    capability_requirement_set_composition_set: {
      capability_requirement_satisfaction_set: {} as never,
      capability_requirement_set_composition_policy_set: {} as never,
      capability_requirement_set_composition_readiness_set: {} as never,
      candidate_assessments: assessments,
      has_capability_requirement_set_composition_result: assessments.some(
        (a) =>
          a.status === "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT"
      ),
      model_limitations: [],
    },
  });
}

function firstState(
  set: ReturnType<typeof buildSet>
): AttentionObservationCapabilityRequirementSetEvaluationState {
  return set.candidate_assessments[0]!.evaluation_state_basis!.state;
}

describe("GROUND-080 Capability Requirement Set Evaluation State", () => {
  describe("079 → 080 mappings", () => {
    it("composition HOLDS → CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS", () => {
      const set = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
        }),
      ]);
      assert.equal(
        firstState(set),
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS"
      );
      assertNoForbiddenSemantics(set);
    });

    it("composition DOES_NOT_HOLD mapping", () => {
      const set = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      assert.equal(
        firstState(set),
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
      assertNoForbiddenSemantics(set);
    });

    it("missing Composition Policy mapping", () => {
      const set = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
        }),
      ]);
      assert.equal(
        firstState(set),
        "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_DECLARED"
      );
    });

    it("missing Readiness Policy mapping", () => {
      const set = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY",
        }),
      ]);
      assert.equal(
        firstState(set),
        "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED"
      );
    });

    it("readiness DOES_NOT_HOLD mapping != composition DOES_NOT_HOLD", () => {
      const set = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      assert.equal(
        firstState(set),
        "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.notEqual(
        firstState(set),
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("no planning basis / no explicit Requirements remain Candidate NOT_APPLICABLE", () => {
      const noPlan = assessAttentionCandidateObservationCapabilityRequirementSetEvaluationState(
        mockCompositionAssessment({
          status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        })
      );
      assert.equal(noPlan.status, "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
      assert.equal(noPlan.evaluation_state_basis, null);
      assert.equal(noPlan.has_capability_requirement_set_evaluation_state, false);

      const noReq = assessAttentionCandidateObservationCapabilityRequirementSetEvaluationState(
        mockCompositionAssessment({
          status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        })
      );
      assert.equal(
        noReq.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(noReq.evaluation_state_basis, null);
    });
  });

  describe("firewalls / invariants", () => {
    it("HOLDS != HAS_CAPABILITY; DOES_NOT_HOLD != LACKS_CAPABILITY; missing != absence", () => {
      const holds = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
        }),
      ]);
      const doesNot = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      const missingPolicy = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
        }),
      ]);
      const missingReadiness = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY",
        }),
      ]);
      const readinessUnresolved = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);

      for (const set of [
        holds,
        doesNot,
        missingPolicy,
        missingReadiness,
        readinessUnresolved,
      ]) {
        assertNoForbiddenSemantics(set);
        assert.ok(!/"RESOLVED"/.test(JSON.stringify(set)));
        assert.ok(!/"UNRESOLVED"[^_]/.test(JSON.stringify(set)));
      }
    });

    it("exactly one state per non-empty Requirement set; unresolved still PRESENT", () => {
      const set = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
        }),
      ]);
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT"
      );
      assert.equal(cand.has_capability_requirement_set_evaluation_state, true);
      assert.ok(cand.evaluation_state_basis !== null);
    });

    it("no state for zero Requirement domain", () => {
      const cand =
        assessAttentionCandidateObservationCapabilityRequirementSetEvaluationState(
          mockCompositionAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          })
        );
      assert.equal(cand.evaluation_state_basis, null);
    });

    it("RESULT_PRESENT/null contradiction rejects", () => {
      assert.throws(() =>
        mapCapabilityRequirementSetCompositionAssessmentToEvaluationState(
          mockCompositionAssessment({
            status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
            outcome:
              "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
            forceResultBasis: null,
          })
        )
      );
    });

    it("non-result/non-null Result Basis contradiction rejects", () => {
      assert.throws(() =>
        mapCapabilityRequirementSetCompositionAssessmentToEvaluationState(
          mockCompositionAssessment({
            status:
              "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
            forceResultBasis: {
              key: "bogus",
              candidate_key: CAND,
              observation_need_key: NEED_KEY,
              capability_requirement_set_key: SET_KEY,
              requirement_set_composition_policy_key: "p",
              requirement_set_composition_readiness_basis_key: "r",
              composition_kind:
                "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED",
              capability_requirement_satisfaction_state_basis_keys: [],
              outcome:
                "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
            },
          })
        )
      );
    });

    it("readiness DOES_NOT_HOLD lineage contradiction rejects", () => {
      assert.throws(() =>
        mapCapabilityRequirementSetCompositionAssessmentToEvaluationState(
          mockCompositionAssessment({
            status:
              "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
            readinessBasisPresent: false,
          })
        )
      );
    });

    it("missing readiness-policy contradiction rejects", () => {
      assert.throws(() =>
        mapCapabilityRequirementSetCompositionAssessmentToEvaluationState(
          mockCompositionAssessment({
            status:
              "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY",
            readinessBasisPresent: true,
          })
        )
      );
    });

    it("missing composition-policy contradiction rejects", () => {
      assert.throws(() =>
        mapCapabilityRequirementSetCompositionAssessmentToEvaluationState(
          mockCompositionAssessment({
            status:
              "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
            compositionPolicyPresent: true,
          })
        )
      );
    });

    it("result states retain 079 Result Basis key; readiness unresolved retains 078 key", () => {
      const holds = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
        }),
      ]);
      const holdsBasis = holds.candidate_assessments[0]!.evaluation_state_basis!;
      assert.equal(
        holdsBasis.requirement_set_composition_result_basis_key,
        `${RESULT_KEY}|${CAND}`
      );
      assert.ok(holdsBasis.requirement_set_composition_result_basis_key !== null);

      const doesNot = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      assert.ok(
        doesNot.candidate_assessments[0]!.evaluation_state_basis!
          .requirement_set_composition_result_basis_key !== null
      );

      const readinessUnresolved = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      const ru =
        readinessUnresolved.candidate_assessments[0]!.evaluation_state_basis!;
      assert.equal(ru.requirement_set_composition_result_basis_key, null);
      assert.equal(
        ru.requirement_set_composition_readiness_basis_key,
        `${READINESS_KEY}|${CAND}`
      );

      const missingReadiness = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY",
        }),
      ]);
      const mr =
        missingReadiness.candidate_assessments[0]!.evaluation_state_basis!;
      assert.equal(mr.requirement_set_composition_result_basis_key, null);
      assert.equal(mr.requirement_set_composition_readiness_basis_key, null);

      const missingComposition = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
        }),
      ]);
      assert.equal(
        missingComposition.candidate_assessments[0]!.evaluation_state_basis!
          .requirement_set_composition_result_basis_key,
        null
      );
    });
  });

  describe("candidate / set / mixed states", () => {
    it("mixed Candidate states preserved independently; set boolean true with unresolved", () => {
      const set = buildSet([
        mockCompositionAssessment({
          candidate_key: "c1",
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
        }),
        mockCompositionAssessment({
          candidate_key: "c2",
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
        mockCompositionAssessment({
          candidate_key: "c3",
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
        }),
        mockCompositionAssessment({
          candidate_key: "c4",
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY",
        }),
        mockCompositionAssessment({
          candidate_key: "c5",
          status:
            "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);

      const states = set.candidate_assessments.map(
        (c) => c.evaluation_state_basis!.state
      );
      assert.deepEqual(states, [
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS",
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD",
        "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_DECLARED",
        "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED",
        "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
      ]);
      assert.equal(set.has_capability_requirement_set_evaluation_states, true);
      assert.equal(
        set.candidate_assessments[1]!.has_capability_requirement_set_evaluation_state,
        true
      );
      assert.equal(
        set.candidate_assessments[2]!.has_capability_requirement_set_evaluation_state,
        true
      );
      assertNoForbiddenSemantics(set);
    });

    it("candidate PRESENT with composition DOES_NOT_HOLD / unresolved", () => {
      const doesNot =
        assessAttentionCandidateObservationCapabilityRequirementSetEvaluationState(
          mockCompositionAssessment({
            status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
            outcome:
              "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD",
          })
        );
      assert.equal(
        doesNot.status,
        "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT"
      );
      assert.equal(doesNot.has_capability_requirement_set_evaluation_state, true);

      const unresolved =
        assessAttentionCandidateObservationCapabilityRequirementSetEvaluationState(
          mockCompositionAssessment({
            status:
              "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
          })
        );
      assert.equal(
        unresolved.status,
        "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT"
      );
      assert.equal(
        unresolved.has_capability_requirement_set_evaluation_state,
        true
      );
    });

    it("cross-Candidate / ObservationNeed / Requirement-set isolation", () => {
      const set = buildSet([
        mockCompositionAssessment({
          candidate_key: "a",
          observation_need_key: "need-a",
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
        }),
        mockCompositionAssessment({
          candidate_key: "b",
          observation_need_key: "need-b",
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD",
        }),
      ]);
      assert.notEqual(
        set.candidate_assessments[0]!.evaluation_state_basis!.key,
        set.candidate_assessments[1]!.evaluation_state_basis!.key
      );
      assert.equal(
        set.candidate_assessments[0]!.evaluation_state_basis!.candidate_key,
        "a"
      );
      assert.equal(
        set.candidate_assessments[1]!.evaluation_state_basis!.observation_need_key,
        "need-b"
      );
    });
  });

  describe("identity / determinism / immutability", () => {
    it("state identity includes state and lineage keys", () => {
      const key = attentionObservationCapabilityRequirementSetEvaluationStateKey(
        CAND,
        NEED_KEY,
        SET_KEY,
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS",
        RESULT_KEY,
        READINESS_KEY
      );
      assert.equal(
        key,
        [
          "attention-observation-capability-requirement-set-evaluation-state",
          CAND,
          NEED_KEY,
          SET_KEY,
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS",
          RESULT_KEY,
          READINESS_KEY,
        ].join("|")
      );
    });

    it("state change / lineage change changes identity", () => {
      const a = buildSet([
        mockCompositionAssessment({
          status:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY",
        }),
      ]);
      const b = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
        }),
      ]);
      assert.notEqual(
        a.candidate_assessments[0]!.evaluation_state_basis!.key,
        b.candidate_assessments[0]!.evaluation_state_basis!.key
      );

      const r1 = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
          forceResultBasis: {
            key: "result-a",
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            requirement_set_composition_policy_key: "p",
            requirement_set_composition_readiness_basis_key: READINESS_KEY,
            composition_kind:
              "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED",
            capability_requirement_satisfaction_state_basis_keys: [],
            outcome:
              "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
          },
        }),
      ]);
      const r2 = buildSet([
        mockCompositionAssessment({
          status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
          outcome:
            "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
          forceResultBasis: {
            key: "result-b",
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            requirement_set_composition_policy_key: "p",
            requirement_set_composition_readiness_basis_key: READINESS_KEY,
            composition_kind:
              "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED",
            capability_requirement_satisfaction_state_basis_keys: [],
            outcome:
              "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
          },
        }),
      ]);
      assert.notEqual(
        r1.candidate_assessments[0]!.evaluation_state_basis!.key,
        r2.candidate_assessments[0]!.evaluation_state_basis!.key
      );
    });

    it("determinism and deep-cloned 079 input; no pointer identity", () => {
      const assessment = mockCompositionAssessment({
        status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
        outcome:
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
      });
      const input = {
        capability_requirement_set_composition_set: {
          capability_requirement_satisfaction_set: {} as never,
          capability_requirement_set_composition_policy_set: {} as never,
          capability_requirement_set_composition_readiness_set: {} as never,
          candidate_assessments: [assessment],
          has_capability_requirement_set_composition_result: true,
          model_limitations: [],
        },
      };
      const a =
        buildAttentionObservationCapabilityRequirementSetEvaluationStateSet(
          input
        );
      const b =
        buildAttentionObservationCapabilityRequirementSetEvaluationStateSet(
          input
        );
      assert.deepEqual(a, b);

      const cloned = structuredClone(input);
      const c =
        buildAttentionObservationCapabilityRequirementSetEvaluationStateSet(
          cloned
        );
      assert.deepEqual(a, c);
      assert.notEqual(
        a.capability_requirement_set_composition_set,
        cloned.capability_requirement_set_composition_set
      );
    });

    it("079 input immutability", () => {
      const assessment = mockCompositionAssessment({
        status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
        outcome:
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS",
      });
      const compositionSet = {
        capability_requirement_satisfaction_set: {} as never,
        capability_requirement_set_composition_policy_set: {} as never,
        capability_requirement_set_composition_readiness_set: {} as never,
        candidate_assessments: [assessment],
        has_capability_requirement_set_composition_result: true,
        model_limitations: [] as const,
      };
      const before = structuredClone(compositionSet);
      buildAttentionObservationCapabilityRequirementSetEvaluationStateSet({
        capability_requirement_set_composition_set: compositionSet as never,
      });
      assert.deepEqual(compositionSet, before);
    });
  });

  describe("model limitations / static proofs", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_MODEL_LIMITATIONS[0],
        "CAPABILITY_COMPOSITION_INTERPRETATION_POLICY_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 079-only runtime; no recomputation", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-evaluation-state-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-evaluation-state-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_requirement_set_composition_set/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));

      assert.ok(
        !/from ["'].*set-composition-readiness-core/.test(src)
      );
      assert.ok(
        !/from ["'].*set-composition-readiness-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*set-composition-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-requirement-satisfaction-core/.test(src)
      );
      assert.ok(
        !/from ["'].*set-composition-result-core/.test(src)
      );

      assert.ok(!/\.some\(/.test(core));
      assert.ok(!/\.every\(/.test(core));
      assert.ok(!/evaluateRequirementSetCompositionPolicyCondition/.test(core));
      assert.ok(!/"HAS_CAPABILITY"/.test(core));
      assert.ok(!/"LACKS_CAPABILITY"/.test(core));
      assert.ok(!/"UNKNOWN"/.test(core));
      assert.ok(!/"SATISFIED"/.test(core));
      assert.ok(!/"UNSATISFIED"/.test(core));
    });
  });
});
