/**
 * GROUND-074 — Observation Core XXVIII / Capability Requirement Satisfaction
 * Interpretation Basis
 *
 * Pure 072 Evaluation State + 073 Interpretation Policy
 * (exact current-state mapping lookup only; no SATISFIED/UNSATISFIED current state /
 * no default fallbacks / no policy absence ↔ no-mapping collapse).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_MODEL_LIMITATIONS,
  assertCompatibleCapabilityRequirementSatisfactionInterpretationContexts,
  assessAttentionCandidateObservationCapabilityRequirementSatisfactionInterpretation,
  attentionObservationCapabilityRequirementSatisfactionInterpretationBasisKey,
  buildAttentionObservationCapabilityRequirementSatisfactionInterpretationSet,
  findExactSatisfactionInterpretationMapping,
} from "../reality/attention-observation-capability-requirement-satisfaction-interpretation-core.js";
import type {
  AttentionObservationCapabilityRequirementEvaluationState,
} from "../reality/attention-observation-capability-requirement-evaluation-state-types.js";
import type {
  AttentionObservationCapabilityRequirementSatisfactionInterpretation,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping,
} from "../reality/attention-observation-capability-requirement-satisfaction-interpretation-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const REQ_KEY = "req";
const NEED_KEY = "need";
const STATE_BASIS_KEY = "eval-state-basis|req";
const POLICY_KEY = "policy|req";

const HOLDS =
  "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS" as const;
const DOES_NOT_HOLD =
  "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD" as const;
const UNRESOLVED_EVAL =
  "UNRESOLVED_CAPABILITY_EVALUATION_DIMENSION_POLICY_NOT_DECLARED" as const;
const NO_REQUIRED =
  "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED" as const;
const UNRESOLVED_AGG =
  "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_POLICY =
  "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_CONDITION =
  "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" as const;

function assertNoCurrentSatisfactionState(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"has_satisfied_interpretation"/.test(json));
  assert.ok(!/"has_unsatisfied_interpretation"/.test(json));
  assert.ok(!/"all_satisfied"/.test(json));
  assert.ok(!/"mapping_count"/.test(json));
  assert.ok(!/"coverage"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
}

function mapping(
  evaluation_state: AttentionObservationCapabilityRequirementEvaluationState,
  interpretation: AttentionObservationCapabilityRequirementSatisfactionInterpretation
): AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping {
  return { evaluation_state, interpretation };
}

function mockEvalAssessment(
  state: AttentionObservationCapabilityRequirementEvaluationState,
  options: { requirementKey?: string; stateBasisKey?: string } = {}
) {
  const requirementKey = options.requirementKey ?? REQ_KEY;
  const stateBasisKey =
    options.stateBasisKey ?? `${STATE_BASIS_KEY}|${state}`;
  return {
    capability_requirement: {
      key: requirementKey,
      observation_need_key: NEED_KEY,
      capability_semantic_key: "inspect",
    } as never,
    requirement_dimension_aggregation_assessment: {} as never,
    evaluation_state_basis: {
      key: stateBasisKey,
      capability_requirement_key: requirementKey,
      observation_need_key: NEED_KEY,
      state,
      requirement_dimension_aggregation_result_basis_key: null,
      requirement_dimension_aggregation_readiness_basis_key: null,
    },
  };
}

function mockPolicyAssessment(options: {
  status:
    | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
    | "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT";
  mappings?: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[];
  requirementKey?: string;
  policyKey?: string;
}) {
  const requirementKey = options.requirementKey ?? REQ_KEY;
  const policyPresent =
    options.status ===
    "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT";
  return {
    capability_requirement: {
      key: requirementKey,
      observation_need_key: NEED_KEY,
      capability_semantic_key: "inspect",
    } as never,
    status: options.status,
    satisfaction_interpretation_policy: policyPresent
      ? {
          key: options.policyKey ?? `${POLICY_KEY}|${requirementKey}`,
          capability_requirement_key: requirementKey,
          observation_need_key: NEED_KEY,
          capability_semantic_key: "inspect" as const,
          mappings: options.mappings ?? [],
        }
      : null,
  };
}

function mockEvalCandidate(
  assessments: ReturnType<typeof mockEvalAssessment>[]
) {
  return {
    candidate_key: "cand",
    requirement_dimension_aggregation_assessment: {} as never,
    status: "CAPABILITY_REQUIREMENT_EVALUATION_STATES_PRESENT" as const,
    requirement_evaluation_assessments: assessments,
    has_capability_requirement_evaluation_states: assessments.length > 0,
    model_limitations: [],
  };
}

function mockPolicyCandidate(
  assessments: ReturnType<typeof mockPolicyAssessment>[]
) {
  return {
    candidate_key: "cand",
    capability_requirement_assessment: {} as never,
    status:
      "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICIES_PRESENT" as const,
    requirement_satisfaction_interpretation_policy_assessments: assessments,
    has_explicit_capability_requirement_satisfaction_interpretation_policies:
      assessments.some(
        (a) =>
          a.status ===
          "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT"
      ),
    model_limitations: [],
  };
}

function buildSet(
  currentState: AttentionObservationCapabilityRequirementEvaluationState,
  policyStatus:
    | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
    | "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
  mappings: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[] = [],
  options: {
    stateBasisKey?: string;
    policyKey?: string;
    requirementKey?: string;
  } = {}
) {
  const requirementKey = options.requirementKey ?? REQ_KEY;
  return buildAttentionObservationCapabilityRequirementSatisfactionInterpretationSet(
    {
      capability_requirement_evaluation_state_set: {
        capability_requirement_dimension_aggregation_result_set: {} as never,
        candidate_assessments: [
          mockEvalCandidate([
            mockEvalAssessment(currentState, {
              requirementKey,
              stateBasisKey: options.stateBasisKey,
            }),
          ]) as never,
        ],
        has_capability_requirement_evaluation_states: true,
        model_limitations: [],
      },
      capability_requirement_satisfaction_interpretation_policy_set: {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [
          mockPolicyCandidate([
            mockPolicyAssessment({
              status: policyStatus,
              mappings,
              requirementKey,
              policyKey: options.policyKey,
            }),
          ]) as never,
        ],
        has_explicit_capability_requirement_satisfaction_interpretation_policies:
          policyStatus ===
          "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        model_limitations: [],
      },
    }
  );
}

function firstAssessment(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!
    .requirement_satisfaction_interpretation_assessments[0]!;
}

describe("GROUND-074 Satisfaction Interpretation Basis", () => {
  describe("exact mapping matches", () => {
    it("typical HOLDS → INTERPRET_AS_SATISFIED; no current SATISFIED", () => {
      const set = buildSet(HOLDS, "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT", [
        mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
      ]);
      const a = firstAssessment(set);
      assert.equal(
        a.status,
        "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(a.interpretation_basis!.interpretation, "INTERPRET_AS_SATISFIED");
      assert.equal(
        a.interpretation_basis!.current_requirement_evaluation_state,
        HOLDS
      );
      assert.ok(
        a.interpretation_basis!.requirement_evaluation_state_basis_key.length > 0
      );
      assert.ok(
        a.interpretation_basis!.satisfaction_interpretation_policy_key.length > 0
      );
      assertNoCurrentSatisfactionState(set);
    });

    it("typical DOES_NOT_HOLD → INTERPRET_AS_UNSATISFIED; no current UNSATISFIED", () => {
      const set = buildSet(
        DOES_NOT_HOLD,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED")]
      );
      assert.equal(
        firstAssessment(set).interpretation_basis!.interpretation,
        "INTERPRET_AS_UNSATISFIED"
      );
      assertNoCurrentSatisfactionState(set);
    });

    it("unusual HOLDS → UNSATISFIED and DOES_NOT_HOLD → SATISFIED honored", () => {
      assert.equal(
        firstAssessment(
          buildSet(HOLDS, "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT", [
            mapping(HOLDS, "INTERPRET_AS_UNSATISFIED"),
          ])
        ).interpretation_basis!.interpretation,
        "INTERPRET_AS_UNSATISFIED"
      );
      assert.equal(
        firstAssessment(
          buildSet(
            DOES_NOT_HOLD,
            "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
            [mapping(DOES_NOT_HOLD, "INTERPRET_AS_SATISFIED")]
          )
        ).interpretation_basis!.interpretation,
        "INTERPRET_AS_SATISFIED"
      );
    });

    it("unresolved / NO_REQUIRED_DIMENSIONS unusual mappings honored", () => {
      for (const state of [
        UNRESOLVED_EVAL,
        UNRESOLVED_AGG,
        UNRESOLVED_READINESS_POLICY,
        UNRESOLVED_READINESS_CONDITION,
        NO_REQUIRED,
      ] as const) {
        assert.equal(
          firstAssessment(
            buildSet(
              state,
              "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
              [mapping(state, "INTERPRET_AS_SATISFIED")]
            )
          ).interpretation_basis!.interpretation,
          "INTERPRET_AS_SATISFIED"
        );
        assert.equal(
          firstAssessment(
            buildSet(
              state,
              "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
              [mapping(state, "INTERPRET_AS_UNSATISFIED")]
            )
          ).interpretation_basis!.interpretation,
          "INTERPRET_AS_UNSATISFIED"
        );
      }
    });
  });

  describe("policy absent / empty / no mapping", () => {
    it("policy absent → NO_EXPLICIT_POLICY; no Basis", () => {
      const set = buildSet(
        HOLDS,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        firstAssessment(set).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(firstAssessment(set).interpretation_basis, null);
    });

    it("explicit empty policy → NO_MAPPING, not policy absent / not UNSATISFIED", () => {
      const set = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        []
      );
      assert.equal(
        firstAssessment(set).status,
        "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE"
      );
      assert.equal(firstAssessment(set).interpretation_basis, null);
      assert.notEqual(
        firstAssessment(set).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
      );
      assertNoCurrentSatisfactionState(set);
    });

    it("partial policy: match PRESENT; non-match NO_MAPPING; no opposite inference", () => {
      const matched = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_SATISFIED")]
      );
      assert.equal(
        firstAssessment(matched).status,
        "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT"
      );

      const unmatched = buildSet(
        DOES_NOT_HOLD,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_SATISFIED")]
      );
      assert.equal(
        firstAssessment(unmatched).status,
        "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE"
      );
      assert.equal(firstAssessment(unmatched).interpretation_basis, null);
    });

    it("no mapping / policy absence ≠ INTERPRET_AS_*", () => {
      for (const set of [
        buildSet(
          HOLDS,
          "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
        ),
        buildSet(
          HOLDS,
          "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
          []
        ),
        buildSet(
          DOES_NOT_HOLD,
          "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
          [mapping(HOLDS, "INTERPRET_AS_SATISFIED")]
        ),
      ]) {
        const assessment = firstAssessment(set);
        assert.equal(assessment.interpretation_basis, null);
        assert.notEqual(
          assessment.status,
          "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT"
        );
      }
    });

    it("no default HOLDS/DOES_NOT_HOLD/unresolved/NO_REQUIRED inference", () => {
      for (const state of [
        HOLDS,
        DOES_NOT_HOLD,
        UNRESOLVED_EVAL,
        NO_REQUIRED,
      ] as const) {
        const set = buildSet(
          state,
          "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
          []
        );
        assert.equal(
          firstAssessment(set).status,
          "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE"
        );
      }
    });
  });

  describe("identity / lineage / invariants", () => {
    it("state / policy / interpretation change Basis identity", () => {
      const holds = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
        { stateBasisKey: "state-holds", policyKey: "policy-a" }
      );
      const doesNotHold = buildSet(
        DOES_NOT_HOLD,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED")],
        { stateBasisKey: "state-dnh", policyKey: "policy-a" }
      );
      assert.notEqual(
        firstAssessment(holds).interpretation_basis!.key,
        firstAssessment(doesNotHold).interpretation_basis!.key
      );

      const policyB = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
        { stateBasisKey: "state-holds", policyKey: "policy-b" }
      );
      assert.notEqual(
        firstAssessment(holds).interpretation_basis!.key,
        firstAssessment(policyB).interpretation_basis!.key
      );

      const flipped = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_UNSATISFIED")],
        { stateBasisKey: "state-holds", policyKey: "policy-a" }
      );
      assert.notEqual(
        firstAssessment(holds).interpretation_basis!.key,
        firstAssessment(flipped).interpretation_basis!.key
      );
    });

    it("stale state basis key changes Basis identity", () => {
      const a = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
        { stateBasisKey: "basis-v1" }
      );
      const b = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
        { stateBasisKey: "basis-v2" }
      );
      assert.notEqual(
        firstAssessment(a).interpretation_basis!.key,
        firstAssessment(b).interpretation_basis!.key
      );
    });

    it("mapping multiplicity rejects; findExact returns null when absent", () => {
      assert.throws(
        () =>
          findExactSatisfactionInterpretationMapping(
            [
              mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
              mapping(HOLDS, "INTERPRET_AS_UNSATISFIED"),
            ],
            HOLDS
          ),
        /multiplicity/
      );
      assert.equal(
        findExactSatisfactionInterpretationMapping(
          [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
          DOES_NOT_HOLD
        ),
        null
      );
    });

    it("all-seven policy selects only exact current state mapping", () => {
      const mappings = [
        mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
        mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED"),
        mapping(UNRESOLVED_EVAL, "INTERPRET_AS_UNSATISFIED"),
        mapping(NO_REQUIRED, "INTERPRET_AS_SATISFIED"),
        mapping(UNRESOLVED_AGG, "INTERPRET_AS_UNSATISFIED"),
        mapping(UNRESOLVED_READINESS_POLICY, "INTERPRET_AS_UNSATISFIED"),
        mapping(UNRESOLVED_READINESS_CONDITION, "INTERPRET_AS_UNSATISFIED"),
      ];
      const set = buildSet(
        NO_REQUIRED,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        mappings
      );
      assert.equal(
        firstAssessment(set).interpretation_basis!.matched_mapping
          .evaluation_state,
        NO_REQUIRED
      );
      assert.equal(
        firstAssessment(set).interpretation_basis!.interpretation,
        "INTERPRET_AS_SATISFIED"
      );
    });

    it("Requirement / ObservationNeed / Candidate mismatch rejects", () => {
      const evalCand = mockEvalCandidate([mockEvalAssessment(HOLDS)]);
      const policyCand = mockPolicyCandidate([
        mockPolicyAssessment({
          status:
            "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
          mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
          requirementKey: "other-req",
        }),
      ]);
      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementSatisfactionInterpretation(
            evalCand as never,
            policyCand as never
          ),
        /missing requirement|mismatch/
      );

      const badNeed = mockPolicyAssessment({
        status:
          "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
      });
      badNeed.capability_requirement = {
        key: REQ_KEY,
        observation_need_key: "other-need",
        capability_semantic_key: "inspect",
      } as never;
      assert.throws(
        () =>
          assertCompatibleCapabilityRequirementSatisfactionInterpretationContexts(
            {
              capability_requirement_dimension_aggregation_result_set:
                {} as never,
              candidate_assessments: [mockEvalCandidate([mockEvalAssessment(HOLDS)]) as never],
              has_capability_requirement_evaluation_states: true,
              model_limitations: [],
            },
            {
              capability_requirement_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [
                mockPolicyCandidate([badNeed]) as never,
              ],
              has_explicit_capability_requirement_satisfaction_interpretation_policies:
                true,
              model_limitations: [],
            }
          ),
        /ObservationNeed key mismatch/
      );
    });
  });

  describe("candidate / set boolean", () => {
    it("Basis PRESENT != polarity; boolean true with only UNSATISFIED interpretations", () => {
      const set = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_UNSATISFIED")]
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_PRESENT"
      );
      assert.equal(
        set.has_capability_requirement_satisfaction_interpretation_basis,
        true
      );
      assert.equal(
        set.candidate_assessments[0]!
          .has_capability_requirement_satisfaction_interpretation_basis,
        true
      );
      assert.equal(
        firstAssessment(set).interpretation_basis!.interpretation,
        "INTERPRET_AS_UNSATISFIED"
      );
    });

    it("NO_BASES when policy absent or unmapped", () => {
      const absent = buildSet(
        HOLDS,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        absent.candidate_assessments[0]!.status,
        "NO_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_REPRESENTED"
      );
      assert.equal(
        absent.has_capability_requirement_satisfaction_interpretation_basis,
        false
      );
    });
  });

  describe("determinism / immutability / deep-clone", () => {
    it("repeated calls deepEqual; deep-cloned inputs compose", () => {
      const a = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [
          mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
          mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED"),
        ]
      );
      const b = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [
          mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
          mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED"),
        ]
      );
      assert.deepEqual(a, b);

      const cloned = JSON.parse(
        JSON.stringify({
          capability_requirement_evaluation_state_set:
            a.capability_requirement_evaluation_state_set,
          capability_requirement_satisfaction_interpretation_policy_set:
            a.capability_requirement_satisfaction_interpretation_policy_set,
        })
      );
      const rebuilt =
        buildAttentionObservationCapabilityRequirementSatisfactionInterpretationSet(
          cloned
        );
      assert.deepEqual(
        rebuilt.candidate_assessments[0]!
          .requirement_satisfaction_interpretation_assessments[0]!
          .interpretation_basis,
        firstAssessment(a).interpretation_basis
      );
      assert.notEqual(
        rebuilt.capability_requirement_evaluation_state_set,
        a.capability_requirement_evaluation_state_set
      );
    });

    it("072/073 input immutability", () => {
      const set = buildSet(
        HOLDS,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
        [mapping(HOLDS, "INTERPRET_AS_SATISFIED")]
      );
      const before072 = JSON.stringify(
        set.capability_requirement_evaluation_state_set
      );
      const before073 = JSON.stringify(
        set.capability_requirement_satisfaction_interpretation_policy_set
      );
      buildAttentionObservationCapabilityRequirementSatisfactionInterpretationSet(
        {
          capability_requirement_evaluation_state_set:
            set.capability_requirement_evaluation_state_set,
          capability_requirement_satisfaction_interpretation_policy_set:
            set.capability_requirement_satisfaction_interpretation_policy_set,
        }
      );
      assert.equal(
        JSON.stringify(set.capability_requirement_evaluation_state_set),
        before072
      );
      assert.equal(
        JSON.stringify(
          set.capability_requirement_satisfaction_interpretation_policy_set
        ),
        before073
      );
    });

    it("basis key shape", () => {
      const key =
        attentionObservationCapabilityRequirementSatisfactionInterpretationBasisKey(
          REQ_KEY,
          STATE_BASIS_KEY,
          POLICY_KEY,
          HOLDS,
          "INTERPRET_AS_SATISFIED"
        );
      assert.ok(
        key.startsWith(
          "attention-observation-capability-requirement-satisfaction-interpretation-basis|"
        )
      );
      assert.ok(key.includes(HOLDS));
      assert.ok(key.includes("INTERPRET_AS_SATISFIED"));
    });
  });

  describe("model limitations / static proofs", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_MODEL_LIMITATIONS[0],
        "CAPABILITY_REQUIREMENT_SATISFACTION_STATE_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 072+073 only; no older reopening / no SATISFIED state", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-satisfaction-interpretation-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-satisfaction-interpretation-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_requirement_evaluation_state_set/.test(core));
      assert.ok(
        /capability_requirement_satisfaction_interpretation_policy_set/.test(
          core
        )
      );
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));

      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-result/.test(src)
      );
      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-readiness/.test(src)
      );
      assert.ok(
        !/from ["'].*required-dimension-evaluation-state/.test(src)
      );
      assert.ok(
        !/from ["'].*evaluation-dimension-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-requirement-core/.test(src)
      );

      assert.ok(!/"SATISFIED"/.test(core));
      assert.ok(!/"UNSATISFIED"/.test(core));
      assert.ok(!/ANY_UNRESOLVED_STATE/.test(core));
      assert.ok(!/INTERPRET_AS_PARTIALLY_SATISFIED/.test(core));
    });
  });
});
