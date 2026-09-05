/**
 * GROUND-075 — Observation Core XXIX / Capability Requirement Satisfaction State
 *
 * Pure GROUND-074 normalization (SATISFIED / UNSATISFIED / two unresolved states;
 * no Capability truth / no default UNSATISFIED / no 072/073 recomputation).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationCapabilityRequirementSatisfaction,
  attentionObservationCapabilityRequirementSatisfactionStateKey,
  buildAttentionObservationCapabilityRequirementSatisfactionSet,
  mapSatisfactionInterpretationAssessmentToSatisfactionState,
} from "../reality/attention-observation-capability-requirement-satisfaction-core.js";
import type {
  AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationStatus,
} from "../reality/attention-observation-capability-requirement-satisfaction-interpretation-types.js";
import type {
  AttentionObservationCapabilityRequirementSatisfactionInterpretation,
} from "../reality/attention-observation-capability-requirement-satisfaction-interpretation-policy-types.js";
import type {
  AttentionObservationCapabilityRequirementSatisfactionState,
} from "../reality/attention-observation-capability-requirement-satisfaction-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const REQ_KEY = "req";
const NEED_KEY = "need";
const EVAL_STATE_BASIS_KEY = "eval-state-basis|req";
const INTERP_BASIS_KEY = "interp-basis|req";
const POLICY_KEY = "policy|req";

function assertNoCapabilityTruth(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"has_satisfied_requirement"/.test(json));
  assert.ok(!/"all_requirements_satisfied"/.test(json));
  assert.ok(!/"has_unsatisfied_requirement"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"EFFECTIVE_CAPABILITY"/.test(json));
}

function mockInterpretationAssessment(options: {
  status: AttentionObservationCapabilityRequirementSatisfactionInterpretationStatus;
  interpretation?: AttentionObservationCapabilityRequirementSatisfactionInterpretation;
  policyPresent?: boolean;
  evaluationStateBasisKey?: string;
  interpretationBasisKey?: string;
  policyKey?: string;
  requirementKey?: string;
}): AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment {
  const requirementKey = options.requirementKey ?? REQ_KEY;
  const evaluationStateBasisKey =
    options.evaluationStateBasisKey ?? EVAL_STATE_BASIS_KEY;
  const basisPresent =
    options.status ===
    "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT";
  const noMapping =
    options.status ===
    "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE";
  const policyAbsent =
    options.status ===
    "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED";
  const policyPresent =
    options.policyPresent ?? (basisPresent || noMapping);

  return {
    capability_requirement: {
      key: requirementKey,
      observation_need_key: NEED_KEY,
      capability_semantic_key: "inspect",
    } as never,
    requirement_evaluation_assessment: {
      capability_requirement: {
        key: requirementKey,
        observation_need_key: NEED_KEY,
        capability_semantic_key: "inspect",
      } as never,
      requirement_dimension_aggregation_assessment: {} as never,
      evaluation_state_basis: {
        key: evaluationStateBasisKey,
        capability_requirement_key: requirementKey,
        observation_need_key: NEED_KEY,
        state: "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS",
        requirement_dimension_aggregation_result_basis_key: null,
        requirement_dimension_aggregation_readiness_basis_key: null,
      },
    },
    satisfaction_interpretation_policy_assessment: {
      capability_requirement: {
        key: requirementKey,
        observation_need_key: NEED_KEY,
        capability_semantic_key: "inspect",
      } as never,
      status: policyPresent
        ? ("EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT" as const)
        : ("NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED" as const),
      satisfaction_interpretation_policy: policyPresent
        ? {
            key: options.policyKey ?? POLICY_KEY,
            capability_requirement_key: requirementKey,
            observation_need_key: NEED_KEY,
            capability_semantic_key: "inspect" as const,
            mappings: [],
          }
        : null,
    },
    status: options.status,
    interpretation_basis: basisPresent
      ? {
          key: options.interpretationBasisKey ?? INTERP_BASIS_KEY,
          capability_requirement_key: requirementKey,
          observation_need_key: NEED_KEY,
          requirement_evaluation_state_basis_key: evaluationStateBasisKey,
          current_requirement_evaluation_state:
            "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS",
          satisfaction_interpretation_policy_key:
            options.policyKey ?? POLICY_KEY,
          matched_mapping: {
            evaluation_state:
              "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS",
            interpretation: options.interpretation!,
          },
          interpretation: options.interpretation!,
        }
      : null,
  };
}

function buildSet(
  assessments: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment[]
) {
  return buildAttentionObservationCapabilityRequirementSatisfactionSet({
    capability_requirement_satisfaction_interpretation_set: {
      capability_requirement_evaluation_state_set: {} as never,
      capability_requirement_satisfaction_interpretation_policy_set:
        {} as never,
      candidate_assessments: [
        {
          candidate_key: "cand",
          requirement_evaluation_state_assessment: {} as never,
          satisfaction_interpretation_policy_assessment: {} as never,
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_PRESENT" as const,
          requirement_satisfaction_interpretation_assessments: assessments,
          has_capability_requirement_satisfaction_interpretation_basis:
            assessments.some(
              (a) =>
                a.status ===
                "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT"
            ),
          model_limitations: [],
        },
      ],
      has_capability_requirement_satisfaction_interpretation_basis:
        assessments.some(
          (a) =>
            a.status ===
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT"
        ),
      model_limitations: [],
    },
  });
}

function firstState(
  set: ReturnType<typeof buildSet>
): AttentionObservationCapabilityRequirementSatisfactionState {
  return set.candidate_assessments[0]!
    .requirement_satisfaction_assessments[0]!.satisfaction_state_basis
    .satisfaction_state;
}

function firstBasis(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!
    .requirement_satisfaction_assessments[0]!.satisfaction_state_basis;
}

describe("GROUND-075 Capability Requirement Satisfaction State", () => {
  describe("074 → 075 mappings", () => {
    it("INTERPRET_AS_SATISFIED → SATISFIED with Basis lineage", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_SATISFIED",
        }),
      ]);
      assert.equal(firstState(set), "SATISFIED");
      assert.equal(
        firstBasis(set).satisfaction_interpretation_basis_key,
        INTERP_BASIS_KEY
      );
      assert.equal(
        firstBasis(set).satisfaction_interpretation_policy_key,
        POLICY_KEY
      );
      assert.equal(
        firstBasis(set).requirement_evaluation_state_basis_key,
        EVAL_STATE_BASIS_KEY
      );
      assertNoCapabilityTruth(set);
    });

    it("INTERPRET_AS_UNSATISFIED → UNSATISFIED with Basis lineage", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_UNSATISFIED",
        }),
      ]);
      assert.equal(firstState(set), "UNSATISFIED");
      assert.notEqual(firstBasis(set).satisfaction_interpretation_basis_key, null);
    });

    it("policy absent → unresolved policy absence; not UNSATISFIED", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status:
            "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED",
        }),
      ]);
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY"
      );
      assert.equal(firstBasis(set).satisfaction_interpretation_basis_key, null);
      assert.equal(firstBasis(set).satisfaction_interpretation_policy_key, null);
      assert.notEqual(firstState(set), "UNSATISFIED");
    });

    it("policy present / no mapping → unresolved no-mapping; not UNSATISFIED / not policy absence", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status:
            "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
        }),
      ]);
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE"
      );
      assert.equal(firstBasis(set).satisfaction_interpretation_basis_key, null);
      assert.equal(
        firstBasis(set).satisfaction_interpretation_policy_key,
        POLICY_KEY
      );
      assert.notEqual(firstState(set), "UNSATISFIED");
      assert.notEqual(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY"
      );
    });

    it("empty policy (no mapping) != UNSATISFIED", () => {
      assert.equal(
        mapSatisfactionInterpretationAssessmentToSatisfactionState(
          mockInterpretationAssessment({
            status:
              "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
          })
        ),
        "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE"
      );
    });
  });

  describe("unusual explicit mappings / fire walls", () => {
    it("unusual INTERPRET_AS_UNSATISFIED / SATISFIED honored", () => {
      assert.equal(
        firstState(
          buildSet([
            mockInterpretationAssessment({
              status:
                "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
              interpretation: "INTERPRET_AS_UNSATISFIED",
            }),
          ])
        ),
        "UNSATISFIED"
      );
      assert.equal(
        firstState(
          buildSet([
            mockInterpretationAssessment({
              status:
                "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
              interpretation: "INTERPRET_AS_SATISFIED",
            }),
          ])
        ),
        "SATISFIED"
      );
    });

    it("SATISFIED/UNSATISFIED require Basis; policy absent != no mapping", () => {
      assert.throws(
        () =>
          mapSatisfactionInterpretationAssessmentToSatisfactionState({
            ...mockInterpretationAssessment({
              status:
                "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
              interpretation: "INTERPRET_AS_SATISFIED",
            }),
            interpretation_basis: null,
          }),
        /PRESENT requires non-null/
      );

      const absent = mockInterpretationAssessment({
        status:
          "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED",
      });
      const unmapped = mockInterpretationAssessment({
        status:
          "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
      });
      assert.notEqual(
        mapSatisfactionInterpretationAssessmentToSatisfactionState(absent),
        mapSatisfactionInterpretationAssessmentToSatisfactionState(unmapped)
      );
    });
  });

  describe("invariants / contradictions / identity", () => {
    it("policy-absence contradiction rejects", () => {
      assert.throws(
        () =>
          mapSatisfactionInterpretationAssessmentToSatisfactionState(
            mockInterpretationAssessment({
              status:
                "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED",
              policyPresent: true,
            })
          ),
        /must not carry policy PRESENT/
      );
    });

    it("no-mapping contradiction rejects", () => {
      const bad = mockInterpretationAssessment({
        status:
          "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
        policyPresent: false,
      });
      assert.throws(
        () => mapSatisfactionInterpretationAssessmentToSatisfactionState(bad),
        /requires explicit Satisfaction Interpretation Policy PRESENT/
      );
    });

    it("stale Interpretation Basis lineage rejects", () => {
      const bad = mockInterpretationAssessment({
        status:
          "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
        interpretation: "INTERPRET_AS_SATISFIED",
        evaluationStateBasisKey: "current-eval-basis",
      });
      bad.interpretation_basis!.requirement_evaluation_state_basis_key =
        "stale-eval-basis";
      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementSatisfaction({
            candidate_key: "cand",
            requirement_evaluation_state_assessment: {} as never,
            satisfaction_interpretation_policy_assessment: {} as never,
            status:
              "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_PRESENT",
            requirement_satisfaction_interpretation_assessments: [bad],
            has_capability_requirement_satisfaction_interpretation_basis: true,
            model_limitations: [],
          }),
        /Stale Satisfaction Interpretation Basis/
      );
    });

    it("state / policy / polarity change identity", () => {
      const a = buildSet([
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_SATISFIED",
          evaluationStateBasisKey: "eval-a",
          interpretationBasisKey: "interp-a",
          policyKey: "policy-a",
        }),
      ]);
      const b = buildSet([
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_SATISFIED",
          evaluationStateBasisKey: "eval-b",
          interpretationBasisKey: "interp-b",
          policyKey: "policy-a",
        }),
      ]);
      assert.notEqual(firstBasis(a).key, firstBasis(b).key);

      const c = buildSet([
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_SATISFIED",
          evaluationStateBasisKey: "eval-a",
          interpretationBasisKey: "interp-c",
          policyKey: "policy-c",
        }),
      ]);
      assert.notEqual(firstBasis(a).key, firstBasis(c).key);

      const d = buildSet([
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_UNSATISFIED",
          evaluationStateBasisKey: "eval-a",
          interpretationBasisKey: "interp-d",
          policyKey: "policy-a",
        }),
      ]);
      assert.notEqual(firstBasis(a).key, firstBasis(d).key);
    });

    it("exactly one state per Requirement including unresolved", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_SATISFIED",
          requirementKey: "r1",
          evaluationStateBasisKey: "e1",
          interpretationBasisKey: "i1",
          policyKey: "p1",
        }),
        mockInterpretationAssessment({
          status:
            "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED",
          requirementKey: "r2",
          evaluationStateBasisKey: "e2",
        }),
        mockInterpretationAssessment({
          status:
            "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
          requirementKey: "r3",
          evaluationStateBasisKey: "e3",
          policyKey: "p3",
        }),
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_UNSATISFIED",
          requirementKey: "r4",
          evaluationStateBasisKey: "e4",
          interpretationBasisKey: "i4",
          policyKey: "p4",
        }),
      ]);
      const states = set.candidate_assessments[0]!.requirement_satisfaction_assessments.map(
        (a) => a.satisfaction_state_basis.satisfaction_state
      );
      assert.deepEqual(states, [
        "SATISFIED",
        "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY",
        "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
        "UNSATISFIED",
      ]);
      assert.equal(
        set.candidate_assessments[0]!.status,
        "CAPABILITY_REQUIREMENT_SATISFACTION_STATES_PRESENT"
      );
      assertNoCapabilityTruth(set);
    });
  });

  describe("candidate / set boolean", () => {
    it("boolean true for all SATISFIED / all UNSATISFIED / all unresolved", () => {
      for (const assessments of [
        [
          mockInterpretationAssessment({
            status:
              "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
            interpretation: "INTERPRET_AS_SATISFIED",
          }),
        ],
        [
          mockInterpretationAssessment({
            status:
              "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
            interpretation: "INTERPRET_AS_UNSATISFIED",
          }),
        ],
        [
          mockInterpretationAssessment({
            status:
              "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED",
          }),
        ],
      ]) {
        const set = buildSet(assessments);
        assert.equal(set.has_capability_requirement_satisfaction_states, true);
        assert.equal(
          set.candidate_assessments[0]!
            .has_capability_requirement_satisfaction_states,
          true
        );
      }
    });

    it("all SATISFIED does not imply Capability truth", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_SATISFIED",
          requirementKey: "r1",
          evaluationStateBasisKey: "e1",
          interpretationBasisKey: "i1",
          policyKey: "p1",
        }),
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_SATISFIED",
          requirementKey: "r2",
          evaluationStateBasisKey: "e2",
          interpretationBasisKey: "i2",
          policyKey: "p2",
        }),
      ]);
      assertNoCapabilityTruth(set);
    });
  });

  describe("determinism / immutability / deep-clone", () => {
    it("repeated calls deepEqual; deep-cloned input same output", () => {
      const assessments = [
        mockInterpretationAssessment({
          status:
            "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
          interpretation: "INTERPRET_AS_SATISFIED",
        }),
      ];
      const a = buildSet(assessments);
      const b = buildSet(assessments);
      assert.deepEqual(a, b);

      const cloned = JSON.parse(
        JSON.stringify({
          capability_requirement_satisfaction_interpretation_set:
            a.capability_requirement_satisfaction_interpretation_set,
        })
      );
      const rebuilt =
        buildAttentionObservationCapabilityRequirementSatisfactionSet(cloned);
      assert.deepEqual(
        rebuilt.candidate_assessments[0]!
          .requirement_satisfaction_assessments[0]!.satisfaction_state_basis,
        firstBasis(a)
      );
      assert.notEqual(
        rebuilt.capability_requirement_satisfaction_interpretation_set,
        a.capability_requirement_satisfaction_interpretation_set
      );
    });

    it("074 input immutability", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status:
            "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
        }),
      ]);
      const before = JSON.stringify(
        set.capability_requirement_satisfaction_interpretation_set
      );
      buildAttentionObservationCapabilityRequirementSatisfactionSet({
        capability_requirement_satisfaction_interpretation_set:
          set.capability_requirement_satisfaction_interpretation_set,
      });
      assert.equal(
        JSON.stringify(
          set.capability_requirement_satisfaction_interpretation_set
        ),
        before
      );
    });

    it("state key shape", () => {
      const key = attentionObservationCapabilityRequirementSatisfactionStateKey(
        REQ_KEY,
        EVAL_STATE_BASIS_KEY,
        "SATISFIED",
        INTERP_BASIS_KEY,
        POLICY_KEY
      );
      assert.ok(
        key.startsWith(
          "attention-observation-capability-requirement-satisfaction-state|"
        )
      );
      assert.ok(key.includes("SATISFIED"));
    });
  });

  describe("model limitations / static proofs", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_MODEL_LIMITATIONS[0],
        "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_MODEL_LIMITATIONS.includes(
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_MODELED"
        )
      );
    });

    it("schema 0.1.24; 074-only runtime; no 072/073 recomputation", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-satisfaction-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-satisfaction-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(
        /capability_requirement_satisfaction_interpretation_set/.test(core)
      );
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));

      assert.ok(
        !/from ["'].*requirement-evaluation-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*satisfaction-interpretation-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*satisfaction-interpretation-core/.test(src)
      );
      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-result/.test(src)
      );
      assert.ok(
        !/findExactSatisfactionInterpretationMapping/.test(core)
      );
      assert.ok(!/PARTIALLY_SATISFIED/.test(core));
      assert.ok(!/"has_capability"/.test(core));
      assert.ok(!/all_requirements_satisfied/.test(core));
    });
  });
});
