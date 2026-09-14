/**
 * GROUND-082 — Observation Core XXXVI / Capability Interpretation Basis
 *
 * Pure 080 Evaluation State + 081 Interpretation Policy
 * (exact current-state mapping lookup only; no CAPABILITY_PRESENT/ABSENT /
 * no default fallbacks / no policy absence ↔ no-mapping collapse).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_MODEL_LIMITATIONS,
  assertCompatibleCapabilityInterpretationContexts,
  assessAttentionCandidateObservationCapabilityInterpretation,
  attentionObservationCapabilityInterpretationBasisKey,
  buildAttentionObservationCapabilityInterpretationSet,
  findExactCapabilityInterpretationMapping,
} from "../reality/attention-observation-capability-interpretation-core.js";
import type {
  AttentionObservationCapabilityInterpretationMapping,
} from "../reality/attention-observation-capability-interpretation-policy-types.js";
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
const STATE_BASIS_KEY = "eval-state-basis|cand";
const POLICY_KEY = "interp-policy|cand";

const HOLDS =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS" as const;
const DOES_NOT_HOLD =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;
const UNRESOLVED_COMPOSITION_POLICY =
  "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_POLICY =
  "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_CONDITION =
  "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" as const;

const PRESENT = "INTERPRET_AS_CAPABILITY_PRESENT" as const;
const ABSENT = "INTERPRET_AS_CAPABILITY_ABSENT" as const;

function assertNoCurrentCapabilityState(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"CAPABILITY_PRESENT"/.test(json));
  assert.ok(!/"CAPABILITY_ABSENT"/.test(json));
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"has_capability_present_interpretation"/.test(json));
  assert.ok(!/"has_capability_absent_interpretation"/.test(json));
  assert.ok(!/"mapping_count"/.test(json));
  assert.ok(!/"coverage"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

function mapping(
  evaluation_state: AttentionObservationCapabilityRequirementSetEvaluationState,
  interpretation: "INTERPRET_AS_CAPABILITY_PRESENT" | "INTERPRET_AS_CAPABILITY_ABSENT"
): AttentionObservationCapabilityInterpretationMapping {
  return { evaluation_state, interpretation };
}

function mockEvalCandidate(options: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT";
  state?: AttentionObservationCapabilityRequirementSetEvaluationState;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
  state_basis_key?: string;
}) {
  const candidate_key = options.candidate_key ?? CAND;
  const need = options.observation_need_key ?? NEED_KEY;
  const setKey =
    options.set_key ??
    buildAttentionObservationCapabilityRequirementSetKey(candidate_key, need, [
      REQ1,
    ]);
  const status =
    options.status ?? "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT";
  const state = options.state ?? HOLDS;
  const present =
    status === "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT";

  return {
    candidate_key,
    capability_requirement_set_composition_assessment: {} as never,
    status,
    evaluation_state_basis: present
      ? {
          key: options.state_basis_key ?? `${STATE_BASIS_KEY}|${state}`,
          candidate_key,
          observation_need_key: need,
          capability_requirement_set_key: setKey,
          state,
          requirement_set_composition_result_basis_key: null,
          requirement_set_composition_readiness_basis_key: null,
        }
      : null,
    has_capability_requirement_set_evaluation_state: present,
    model_limitations: [],
  };
}

function mockPolicyCandidate(options: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
    | "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT";
  mappings?: AttentionObservationCapabilityInterpretationMapping[];
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
  policy_key?: string;
  requirement_keys?: string[];
}) {
  const candidate_key = options.candidate_key ?? CAND;
  const need = options.observation_need_key ?? NEED_KEY;
  const requirement_keys = options.requirement_keys ?? [REQ1];
  const setKey =
    options.set_key ??
    buildAttentionObservationCapabilityRequirementSetKey(
      candidate_key,
      need,
      requirement_keys
    );
  const status =
    options.status ?? "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT";

  return {
    candidate_key,
    capability_requirement_assessment: {} as never,
    status,
    capability_interpretation_policy: present
      ? {
          key: options.policy_key ?? `${POLICY_KEY}|${candidate_key}`,
          candidate_key,
          observation_need_key: need,
          capability_requirement_set_key: setKey,
          capability_requirement_keys: requirement_keys,
          mappings: options.mappings ?? [],
        }
      : null,
    model_limitations: [],
  };
}

function buildSet(
  evalCandidate: ReturnType<typeof mockEvalCandidate>,
  policyCandidate: ReturnType<typeof mockPolicyCandidate>
) {
  return buildAttentionObservationCapabilityInterpretationSet({
    capability_requirement_set_evaluation_state_set: {
      capability_requirement_set_composition_set: {} as never,
      candidate_assessments: [evalCandidate as never],
      has_capability_requirement_set_evaluation_states:
        evalCandidate.has_capability_requirement_set_evaluation_state,
      model_limitations: [],
    },
    capability_interpretation_policy_set: {
      capability_requirement_set: {} as never,
      specification: { policies: [] },
      candidate_assessments: [policyCandidate as never],
      has_explicit_capability_interpretation_policies:
        policyCandidate.status ===
        "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT",
      model_limitations: [],
    },
  });
}

describe("GROUND-082 Capability Interpretation Basis", () => {
  describe("exact current-state matching", () => {
    it("HOLDS → PRESENT match; no CAPABILITY_PRESENT", () => {
      const set = buildSet(
        mockEvalCandidate({ state: HOLDS }),
        mockPolicyCandidate({ mappings: [mapping(HOLDS, PRESENT)] })
      );
      const cand = set.candidate_assessments[0]!;
      assert.equal(cand.status, "CAPABILITY_INTERPRETATION_BASIS_PRESENT");
      assert.equal(cand.interpretation_basis!.interpretation, PRESENT);
      assert.equal(cand.has_capability_interpretation_basis, true);
      assertNoCurrentCapabilityState(set);
    });

    it("DOES_NOT_HOLD → ABSENT match; no CAPABILITY_ABSENT", () => {
      const set = buildSet(
        mockEvalCandidate({ state: DOES_NOT_HOLD }),
        mockPolicyCandidate({
          mappings: [mapping(DOES_NOT_HOLD, ABSENT)],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.interpretation_basis!.interpretation,
        ABSENT
      );
      assert.equal(
        set.candidate_assessments[0]!.has_capability_interpretation_basis,
        true
      );
      assertNoCurrentCapabilityState(set);
    });

    it("unusual HOLDS→ABSENT and DOES_NOT_HOLD→PRESENT honored", () => {
      const holdsAbsent = buildSet(
        mockEvalCandidate({ state: HOLDS }),
        mockPolicyCandidate({ mappings: [mapping(HOLDS, ABSENT)] })
      );
      assert.equal(
        holdsAbsent.candidate_assessments[0]!.interpretation_basis!
          .interpretation,
        ABSENT
      );

      const doesNotPresent = buildSet(
        mockEvalCandidate({ state: DOES_NOT_HOLD }),
        mockPolicyCandidate({
          mappings: [mapping(DOES_NOT_HOLD, PRESENT)],
        })
      );
      assert.equal(
        doesNotPresent.candidate_assessments[0]!.interpretation_basis!
          .interpretation,
        PRESENT
      );
    });

    it("all unresolved states match PRESENT or ABSENT when explicit", () => {
      for (const state of [
        UNRESOLVED_COMPOSITION_POLICY,
        UNRESOLVED_READINESS_POLICY,
        UNRESOLVED_READINESS_CONDITION,
      ] as const) {
        for (const interpretation of [PRESENT, ABSENT] as const) {
          const set = buildSet(
            mockEvalCandidate({ state }),
            mockPolicyCandidate({
              mappings: [mapping(state, interpretation)],
            })
          );
          assert.equal(
            set.candidate_assessments[0]!.status,
            "CAPABILITY_INTERPRETATION_BASIS_PRESENT"
          );
          assert.equal(
            set.candidate_assessments[0]!.interpretation_basis!.interpretation,
            interpretation
          );
        }
      }
    });

    it("all-five policy selects exact current state only", () => {
      const mappings = [
        mapping(HOLDS, PRESENT),
        mapping(DOES_NOT_HOLD, ABSENT),
        mapping(UNRESOLVED_COMPOSITION_POLICY, ABSENT),
        mapping(UNRESOLVED_READINESS_POLICY, PRESENT),
        mapping(UNRESOLVED_READINESS_CONDITION, ABSENT),
      ];
      const set = buildSet(
        mockEvalCandidate({ state: UNRESOLVED_READINESS_POLICY }),
        mockPolicyCandidate({ mappings })
      );
      assert.deepEqual(
        set.candidate_assessments[0]!.interpretation_basis!.matched_mapping,
        mapping(UNRESOLVED_READINESS_POLICY, PRESENT)
      );
    });
  });

  describe("policy absent / empty / no mapping firewalls", () => {
    it("policy absent → NO_POLICY_DECLARED; != no-mapping; != ABSENT", () => {
      const set = buildSet(
        mockEvalCandidate({ state: HOLDS }),
        mockPolicyCandidate({
          status: "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED",
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(set.candidate_assessments[0]!.interpretation_basis, null);
      assert.equal(
        set.candidate_assessments[0]!.has_capability_interpretation_basis,
        false
      );
      assertNoCurrentCapabilityState(set);
    });

    it("explicit empty policy → NO_MAPPING; != policy absent; != ABSENT", () => {
      const empty = buildSet(
        mockEvalCandidate({ state: HOLDS }),
        mockPolicyCandidate({ mappings: [] })
      );
      assert.equal(
        empty.candidate_assessments[0]!.status,
        "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE"
      );
      assert.equal(empty.candidate_assessments[0]!.interpretation_basis, null);

      const absent = buildSet(
        mockEvalCandidate({ state: HOLDS }),
        mockPolicyCandidate({
          status: "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED",
        })
      );
      assert.notEqual(
        empty.candidate_assessments[0]!.status,
        absent.candidate_assessments[0]!.status
      );
      assertNoCurrentCapabilityState(empty);
    });

    it("partial policy: matching → Basis; nonmatching → NO_MAPPING; no opposite inference", () => {
      const match = buildSet(
        mockEvalCandidate({ state: HOLDS }),
        mockPolicyCandidate({ mappings: [mapping(HOLDS, PRESENT)] })
      );
      assert.equal(
        match.candidate_assessments[0]!.status,
        "CAPABILITY_INTERPRETATION_BASIS_PRESENT"
      );

      const noMatch = buildSet(
        mockEvalCandidate({ state: DOES_NOT_HOLD }),
        mockPolicyCandidate({ mappings: [mapping(HOLDS, PRESENT)] })
      );
      assert.equal(
        noMatch.candidate_assessments[0]!.status,
        "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE"
      );
      assert.equal(noMatch.candidate_assessments[0]!.interpretation_basis, null);
    });

    it("no default HOLDS→PRESENT / DOES_NOT_HOLD→ABSENT / unresolved", () => {
      for (const state of [
        HOLDS,
        DOES_NOT_HOLD,
        UNRESOLVED_COMPOSITION_POLICY,
      ] as const) {
        const set = buildSet(
          mockEvalCandidate({ state }),
          mockPolicyCandidate({ mappings: [] })
        );
        assert.equal(
          set.candidate_assessments[0]!.status,
          "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE"
        );
      }
    });
  });

  describe("non-applicable / mixed / booleans", () => {
    it("no planning / no Requirements → no Basis", () => {
      const noPlan = buildSet(
        mockEvalCandidate({
          status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        }),
        mockPolicyCandidate({
          status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        })
      );
      assert.equal(
        noPlan.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(noPlan.candidate_assessments[0]!.interpretation_basis, null);

      const noReq = buildSet(
        mockEvalCandidate({
          status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        }),
        mockPolicyCandidate({
          status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        })
      );
      assert.equal(
        noReq.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });

    it("mixed contexts preserved independently; set boolean true with ABSENT only", () => {
      const set = buildAttentionObservationCapabilityInterpretationSet({
        capability_requirement_set_evaluation_state_set: {
          capability_requirement_set_composition_set: {} as never,
          candidate_assessments: [
            mockEvalCandidate({
              candidate_key: "c1",
              state: HOLDS,
            }) as never,
            mockEvalCandidate({
              candidate_key: "c2",
              state: DOES_NOT_HOLD,
            }) as never,
            mockEvalCandidate({
              candidate_key: "c3",
              state: UNRESOLVED_READINESS_POLICY,
            }) as never,
            mockEvalCandidate({
              candidate_key: "c4",
              state: UNRESOLVED_COMPOSITION_POLICY,
            }) as never,
            mockEvalCandidate({
              candidate_key: "c5",
              status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
            }) as never,
          ],
          has_capability_requirement_set_evaluation_states: true,
          model_limitations: [],
        },
        capability_interpretation_policy_set: {
          capability_requirement_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [
            mockPolicyCandidate({
              candidate_key: "c1",
              mappings: [mapping(HOLDS, PRESENT)],
            }) as never,
            mockPolicyCandidate({
              candidate_key: "c2",
              mappings: [mapping(DOES_NOT_HOLD, ABSENT)],
            }) as never,
            mockPolicyCandidate({
              candidate_key: "c3",
              mappings: [mapping(HOLDS, PRESENT)],
            }) as never,
            mockPolicyCandidate({
              candidate_key: "c4",
              status: "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED",
            }) as never,
            mockPolicyCandidate({
              candidate_key: "c5",
              status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
            }) as never,
          ],
          has_explicit_capability_interpretation_policies: true,
          model_limitations: [],
        },
      });

      assert.equal(
        set.candidate_assessments[0]!.status,
        "CAPABILITY_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[0]!.interpretation_basis!.interpretation,
        PRESENT
      );
      assert.equal(
        set.candidate_assessments[1]!.interpretation_basis!.interpretation,
        ABSENT
      );
      assert.equal(
        set.candidate_assessments[2]!.status,
        "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE"
      );
      assert.equal(
        set.candidate_assessments[3]!.status,
        "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[4]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(set.has_capability_interpretation_basis, true);
      assertNoCurrentCapabilityState(set);

      const onlyAbsent = buildSet(
        mockEvalCandidate({ state: DOES_NOT_HOLD }),
        mockPolicyCandidate({
          mappings: [mapping(DOES_NOT_HOLD, ABSENT)],
        })
      );
      assert.equal(onlyAbsent.has_capability_interpretation_basis, true);
    });
  });

  describe("identity / lineage / mismatches", () => {
    it("retains Evaluation State Basis key, policy key, matched mapping", () => {
      const set = buildSet(
        mockEvalCandidate({
          state: HOLDS,
          state_basis_key: "state-basis-a",
        }),
        mockPolicyCandidate({
          mappings: [mapping(HOLDS, PRESENT)],
          policy_key: "policy-a",
        })
      );
      const basis = set.candidate_assessments[0]!.interpretation_basis!;
      assert.equal(
        basis.requirement_set_evaluation_state_basis_key,
        "state-basis-a"
      );
      assert.equal(basis.capability_interpretation_policy_key, "policy-a");
      assert.deepEqual(basis.matched_mapping, mapping(HOLDS, PRESENT));
      assert.equal(
        basis.key,
        attentionObservationCapabilityInterpretationBasisKey(
          CAND,
          NEED_KEY,
          SET_KEY,
          "state-basis-a",
          "policy-a",
          HOLDS,
          PRESENT
        )
      );
    });

    it("state / basis lineage / policy / interpretation / set change identity", () => {
      const a = buildSet(
        mockEvalCandidate({ state: HOLDS, state_basis_key: "b1" }),
        mockPolicyCandidate({
          mappings: [mapping(HOLDS, PRESENT)],
          policy_key: "p1",
        })
      );
      const b = buildSet(
        mockEvalCandidate({ state: DOES_NOT_HOLD, state_basis_key: "b1" }),
        mockPolicyCandidate({
          mappings: [mapping(DOES_NOT_HOLD, ABSENT)],
          policy_key: "p1",
        })
      );
      assert.notEqual(
        a.candidate_assessments[0]!.interpretation_basis!.key,
        b.candidate_assessments[0]!.interpretation_basis!.key
      );

      const c = buildSet(
        mockEvalCandidate({ state: HOLDS, state_basis_key: "b2" }),
        mockPolicyCandidate({
          mappings: [mapping(HOLDS, PRESENT)],
          policy_key: "p1",
        })
      );
      assert.notEqual(
        a.candidate_assessments[0]!.interpretation_basis!.key,
        c.candidate_assessments[0]!.interpretation_basis!.key
      );

      const d = buildSet(
        mockEvalCandidate({ state: HOLDS, state_basis_key: "b1" }),
        mockPolicyCandidate({
          mappings: [mapping(HOLDS, PRESENT)],
          policy_key: "p2",
        })
      );
      assert.notEqual(
        a.candidate_assessments[0]!.interpretation_basis!.key,
        d.candidate_assessments[0]!.interpretation_basis!.key
      );

      const e = buildSet(
        mockEvalCandidate({ state: HOLDS, state_basis_key: "b1" }),
        mockPolicyCandidate({
          mappings: [mapping(HOLDS, ABSENT)],
          policy_key: "p1",
        })
      );
      assert.notEqual(
        a.candidate_assessments[0]!.interpretation_basis!.key,
        e.candidate_assessments[0]!.interpretation_basis!.key
      );
    });

    it("candidate / ObservationNeed / set-key / lineage mismatch reject", () => {
      assert.throws(() =>
        buildSet(
          mockEvalCandidate({ candidate_key: "a" }),
          mockPolicyCandidate({ candidate_key: "b" })
        )
      );

      assert.throws(() =>
        buildSet(
          mockEvalCandidate({ observation_need_key: "need-a" }),
          mockPolicyCandidate({
            observation_need_key: "need-b",
            mappings: [mapping(HOLDS, PRESENT)],
          })
        )
      );

      assert.throws(() =>
        buildSet(
          mockEvalCandidate({ set_key: "set-a" }),
          mockPolicyCandidate({
            set_key: "set-b",
            mappings: [mapping(HOLDS, PRESENT)],
          })
        )
      );

      assert.throws(() =>
        buildSet(
          mockEvalCandidate({ state: HOLDS }),
          mockPolicyCandidate({
            mappings: [mapping(HOLDS, PRESENT)],
            set_key: SET_KEY,
            requirement_keys: [REQ1, "extra-req"],
          })
        )
      );
    });

    it("mapping multiplicity contradiction rejects", () => {
      assert.throws(() =>
        findExactCapabilityInterpretationMapping(
          [mapping(HOLDS, PRESENT), mapping(HOLDS, ABSENT)],
          HOLDS
        )
      );
    });

    it("EVALUATION_STATE_PRESENT/null contradiction rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationCapabilityInterpretation(
          {
            ...mockEvalCandidate({ state: HOLDS }),
            evaluation_state_basis: null,
          } as never,
          mockPolicyCandidate({
            mappings: [mapping(HOLDS, PRESENT)],
          }) as never
        )
      );
    });

    it("policy PRESENT/null contradiction rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationCapabilityInterpretation(
          mockEvalCandidate({ state: HOLDS }) as never,
          {
            ...mockPolicyCandidate({
              mappings: [mapping(HOLDS, PRESENT)],
            }),
            capability_interpretation_policy: null,
          } as never
        )
      );
    });
  });

  describe("determinism / immutability / isolation", () => {
    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const evalSet = {
        capability_requirement_set_composition_set: {} as never,
        candidate_assessments: [mockEvalCandidate({ state: HOLDS }) as never],
        has_capability_requirement_set_evaluation_states: true,
        model_limitations: [] as const,
      };
      const policySet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] as const },
        candidate_assessments: [
          mockPolicyCandidate({
            mappings: [mapping(HOLDS, PRESENT)],
          }) as never,
        ],
        has_explicit_capability_interpretation_policies: true,
        model_limitations: [] as const,
      };
      const beforeEval = structuredClone(evalSet);
      const beforePolicy = structuredClone(policySet);
      const input = {
        capability_requirement_set_evaluation_state_set: evalSet as never,
        capability_interpretation_policy_set: policySet as never,
      };
      const a = buildAttentionObservationCapabilityInterpretationSet(input);
      const b = buildAttentionObservationCapabilityInterpretationSet(input);
      assert.deepEqual(a, b);
      assert.deepEqual(evalSet, beforeEval);
      assert.deepEqual(policySet, beforePolicy);

      const cloned = {
        capability_requirement_set_evaluation_state_set: structuredClone(
          evalSet
        ) as never,
        capability_interpretation_policy_set: structuredClone(
          policySet
        ) as never,
      };
      const c = buildAttentionObservationCapabilityInterpretationSet(cloned);
      assert.deepEqual(a, c);
      assert.notEqual(
        a.capability_requirement_set_evaluation_state_set,
        cloned.capability_requirement_set_evaluation_state_set
      );
    });

    it("cross-Candidate / ObservationNeed isolation", () => {
      const set = buildAttentionObservationCapabilityInterpretationSet({
        capability_requirement_set_evaluation_state_set: {
          capability_requirement_set_composition_set: {} as never,
          candidate_assessments: [
            mockEvalCandidate({
              candidate_key: "a",
              observation_need_key: "need-a",
              state: HOLDS,
            }) as never,
            mockEvalCandidate({
              candidate_key: "b",
              observation_need_key: "need-b",
              state: DOES_NOT_HOLD,
            }) as never,
          ],
          has_capability_requirement_set_evaluation_states: true,
          model_limitations: [],
        },
        capability_interpretation_policy_set: {
          capability_requirement_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [
            mockPolicyCandidate({
              candidate_key: "a",
              observation_need_key: "need-a",
              mappings: [mapping(HOLDS, PRESENT)],
            }) as never,
            mockPolicyCandidate({
              candidate_key: "b",
              observation_need_key: "need-b",
              mappings: [mapping(DOES_NOT_HOLD, ABSENT)],
            }) as never,
          ],
          has_explicit_capability_interpretation_policies: true,
          model_limitations: [],
        },
      });
      assert.notEqual(
        set.candidate_assessments[0]!.interpretation_basis!.key,
        set.candidate_assessments[1]!.interpretation_basis!.key
      );
    });
  });

  describe("static proofs / schema", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_MODEL_LIMITATIONS[0],
        "CAPABILITY_STATE_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_MODEL_LIMITATIONS.at(-1),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 080+081 only; no 075–079 recomputation", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-interpretation-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-interpretation-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_requirement_set_evaluation_state_set/.test(core));
      assert.ok(/capability_interpretation_policy_set/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));

      assert.ok(!/from ["'].*set-composition-result-core/.test(src));
      assert.ok(!/from ["'].*set-composition-readiness-core/.test(src));
      assert.ok(!/from ["'].*set-composition-policy-core/.test(src));
      assert.ok(!/from ["'].*set-composition-readiness-policy-core/.test(src));
      assert.ok(
        !/from ["'].*capability-requirement-satisfaction-core/.test(src)
      );
      assert.ok(
        !/from ["'].*set-evaluation-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*interpretation-policy-core/.test(src)
      );

      assert.ok(!/evaluateRequirementSetCompositionPolicyCondition/.test(core));
      assert.ok(!/\.every\(/.test(core));
      assert.ok(!/\.some\(/.test(core));
      assert.ok(!/"HAS_CAPABILITY"/.test(core));
      assert.ok(!/"LACKS_CAPABILITY"/.test(core));
      assert.ok(!/"CAPABILITY_PRESENT"/.test(core));
      assert.ok(!/"CAPABILITY_ABSENT"/.test(core));
      assert.ok(!/ANY_UNRESOLVED/.test(core));

      assertCompatibleCapabilityInterpretationContexts(
        {
          capability_requirement_set_composition_set: {} as never,
          candidate_assessments: [
            mockEvalCandidate({ state: HOLDS }) as never,
          ],
          has_capability_requirement_set_evaluation_states: true,
          model_limitations: [],
        },
        {
          capability_requirement_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [
            mockPolicyCandidate({
              mappings: [mapping(HOLDS, PRESENT)],
            }) as never,
          ],
          has_explicit_capability_interpretation_policies: true,
          model_limitations: [],
        }
      );
    });
  });
});
