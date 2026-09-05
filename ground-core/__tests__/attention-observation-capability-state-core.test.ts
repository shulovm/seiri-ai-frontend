/**
 * GROUND-083 — Observation Core XXXVII / Capability State Foundation
 *
 * Pure GROUND-082 normalization (CAPABILITY_PRESENT / CAPABILITY_ABSENT /
 * policy-absence unresolved / no-mapping unresolved; no HAS_CAPABILITY /
 * no effective Capability / no 080 Evaluation State inference).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_STATE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationCapabilityState,
  attentionObservationCapabilityStateKey,
  buildAttentionObservationCapabilityStateSet,
  mapCapabilityInterpretationAssessmentToCapabilityState,
} from "../reality/attention-observation-capability-state-core.js";
import type {
  AttentionCandidateObservationCapabilityInterpretationAssessment,
  AttentionObservationCapabilityInterpretationStatus,
} from "../reality/attention-observation-capability-interpretation-types.js";
import type {
  AttentionObservationCapabilityState,
} from "../reality/attention-observation-capability-state-types.js";
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
const EVAL_BASIS_KEY = "eval-state-basis|cand";
const INTERP_BASIS_KEY = "interp-basis|cand";
const POLICY_KEY = "interp-policy|cand";

const PRESENT = "INTERPRET_AS_CAPABILITY_PRESENT" as const;
const ABSENT = "INTERPRET_AS_CAPABILITY_ABSENT" as const;
const HOLDS =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"CAPABLE"/.test(json));
  assert.ok(!/"INCAPABLE"/.test(json));
  assert.ok(!/"EFFECTIVE_CAPABILITY_PRESENT"/.test(json));
  assert.ok(!/"PARTIAL"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"is_capable"/.test(json));
  assert.ok(!/"has_present_capability_state"/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"confidence"/.test(json));
}

function mockInterpretationAssessment(options: {
  status: AttentionObservationCapabilityInterpretationStatus;
  interpretation?: "INTERPRET_AS_CAPABILITY_PRESENT" | "INTERPRET_AS_CAPABILITY_ABSENT";
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
  eval_basis_key?: string;
  interp_basis_key?: string;
  policy_key?: string;
  forceInterpBasis?: AttentionCandidateObservationCapabilityInterpretationAssessment["interpretation_basis"];
  forcePolicyPresent?: boolean;
  forcePolicy?: AttentionCandidateObservationCapabilityInterpretationAssessment["capability_interpretation_policy_assessment"]["capability_interpretation_policy"];
}): AttentionCandidateObservationCapabilityInterpretationAssessment {
  const candidate_key = options.candidate_key ?? CAND;
  const need = options.observation_need_key ?? NEED_KEY;
  const setKey =
    options.set_key ??
    buildAttentionObservationCapabilityRequirementSetKey(candidate_key, need, [
      REQ1,
    ]);
  const evalBasisKey = options.eval_basis_key ?? `${EVAL_BASIS_KEY}|${candidate_key}`;
  const basisPresent =
    options.status === "CAPABILITY_INTERPRETATION_BASIS_PRESENT";
  const noMapping =
    options.status ===
    "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE";
  const noPolicy =
    options.status === "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED";
  const notApplicable =
    options.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    options.status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";

  const policyPresent =
    options.forcePolicyPresent ?? (basisPresent || noMapping);

  const interpretationBasis =
    options.forceInterpBasis !== undefined
      ? options.forceInterpBasis
      : basisPresent
        ? {
            key: options.interp_basis_key ?? `${INTERP_BASIS_KEY}|${candidate_key}`,
            candidate_key,
            observation_need_key: need,
            capability_requirement_set_key: setKey,
            requirement_set_evaluation_state_basis_key: evalBasisKey,
            current_requirement_set_evaluation_state: HOLDS,
            capability_interpretation_policy_key:
              options.policy_key ?? `${POLICY_KEY}|${candidate_key}`,
            matched_mapping: {
              evaluation_state: HOLDS,
              interpretation: options.interpretation!,
            },
            interpretation: options.interpretation!,
          }
        : null;

  const policy =
    options.forcePolicy !== undefined
      ? options.forcePolicy
      : policyPresent
        ? {
            key: options.policy_key ?? `${POLICY_KEY}|${candidate_key}`,
            candidate_key,
            observation_need_key: need,
            capability_requirement_set_key: setKey,
            capability_requirement_keys: [REQ1],
            mappings: [],
          }
        : null;

  return {
    candidate_key,
    capability_requirement_set_evaluation_state_assessment: {
      candidate_key,
      capability_requirement_set_composition_assessment: {} as never,
      status: notApplicable
        ? (options.status as
            | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS")
        : "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT",
      evaluation_state_basis: notApplicable
        ? null
        : {
            key: evalBasisKey,
            candidate_key,
            observation_need_key: need,
            capability_requirement_set_key: setKey,
            state: HOLDS,
            requirement_set_composition_result_basis_key: null,
            requirement_set_composition_readiness_basis_key: null,
          },
      has_capability_requirement_set_evaluation_state: !notApplicable,
      model_limitations: [],
    },
    capability_interpretation_policy_assessment: {
      candidate_key,
      capability_requirement_assessment: {} as never,
      status: notApplicable
        ? (options.status as
            | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS")
        : policyPresent
          ? "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
          : noPolicy
            ? "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
            : "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED",
      capability_interpretation_policy: policy,
      model_limitations: [],
    },
    status: options.status,
    interpretation_basis: interpretationBasis,
    has_capability_interpretation_basis: basisPresent,
    model_limitations: [],
  };
}

function buildSet(
  assessments: AttentionCandidateObservationCapabilityInterpretationAssessment[]
) {
  return buildAttentionObservationCapabilityStateSet({
    capability_interpretation_set: {
      capability_requirement_set_evaluation_state_set: {} as never,
      capability_interpretation_policy_set: {} as never,
      candidate_assessments: assessments,
      has_capability_interpretation_basis: assessments.some(
        (a) => a.has_capability_interpretation_basis
      ),
      model_limitations: [],
    },
  });
}

function firstState(
  set: ReturnType<typeof buildSet>
): AttentionObservationCapabilityState {
  return set.candidate_assessments[0]!.capability_state_basis!.capability_state;
}

describe("GROUND-083 Capability State", () => {
  describe("082 → 083 mappings", () => {
    it("PRESENT interpretation → CAPABILITY_PRESENT", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: PRESENT,
        }),
      ]);
      assert.equal(firstState(set), "CAPABILITY_PRESENT");
      assert.equal(
        set.candidate_assessments[0]!.status,
        "CAPABILITY_STATE_BASIS_PRESENT"
      );
      assertNoForbiddenSemantics(set);
    });

    it("ABSENT interpretation → CAPABILITY_ABSENT", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: ABSENT,
        }),
      ]);
      assert.equal(firstState(set), "CAPABILITY_ABSENT");
      assert.equal(
        set.candidate_assessments[0]!.has_capability_state,
        true
      );
      assertNoForbiddenSemantics(set);
    });

    it("policy absent → unresolved; != CAPABILITY_ABSENT; != no-mapping", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status: "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED",
        }),
      ]);
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY"
      );
      assert.notEqual(firstState(set), "CAPABILITY_ABSENT");
      const basis = set.candidate_assessments[0]!.capability_state_basis!;
      assert.equal(basis.capability_interpretation_basis_key, null);
      assert.equal(basis.capability_interpretation_policy_key, null);
      assert.ok(basis.requirement_set_evaluation_state_basis_key.length > 0);
    });

    it("no mapping / empty policy → unresolved no-mapping; != ABSENT; != policy absent", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          status:
            "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE",
        }),
      ]);
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE"
      );
      assert.notEqual(firstState(set), "CAPABILITY_ABSENT");
      const basis = set.candidate_assessments[0]!.capability_state_basis!;
      assert.equal(basis.capability_interpretation_basis_key, null);
      assert.equal(
        basis.capability_interpretation_policy_key,
        `${POLICY_KEY}|${CAND}`
      );
    });

    it("unusual ABSENT/PRESENT interpretations honored exactly", () => {
      assert.equal(
        firstState(
          buildSet([
            mockInterpretationAssessment({
              status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
              interpretation: ABSENT,
            }),
          ])
        ),
        "CAPABILITY_ABSENT"
      );
      assert.equal(
        firstState(
          buildSet([
            mockInterpretationAssessment({
              status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
              interpretation: PRESENT,
            }),
          ])
        ),
        "CAPABILITY_PRESENT"
      );
    });

    it("no planning / no Requirements → no Capability State Basis", () => {
      const noPlan = assessAttentionCandidateObservationCapabilityState(
        mockInterpretationAssessment({
          status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        })
      );
      assert.equal(
        noPlan.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(noPlan.capability_state_basis, null);
      assert.equal(noPlan.has_capability_state, false);

      const noReq = assessAttentionCandidateObservationCapabilityState(
        mockInterpretationAssessment({
          status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        })
      );
      assert.equal(
        noReq.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(noReq.capability_state_basis, null);
    });
  });

  describe("lineage / invariants / contradictions", () => {
    it("PRESENT/ABSENT require Interpretation Basis; unresolved retain Evaluation State key", () => {
      const present = buildSet([
        mockInterpretationAssessment({
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: PRESENT,
          interp_basis_key: "ib-1",
          policy_key: "pk-1",
          eval_basis_key: "eb-1",
        }),
      ]);
      const pb = present.candidate_assessments[0]!.capability_state_basis!;
      assert.equal(pb.capability_interpretation_basis_key, "ib-1");
      assert.equal(pb.capability_interpretation_policy_key, "pk-1");
      assert.equal(pb.requirement_set_evaluation_state_basis_key, "eb-1");

      const absent = buildSet([
        mockInterpretationAssessment({
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: ABSENT,
        }),
      ]);
      assert.ok(
        absent.candidate_assessments[0]!.capability_state_basis!
          .capability_interpretation_basis_key !== null
      );
    });

    it("identity changes with eval basis / policy / polarity / set", () => {
      const a = buildSet([
        mockInterpretationAssessment({
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: PRESENT,
          eval_basis_key: "eb-a",
          policy_key: "pk-a",
          interp_basis_key: "ib-a",
        }),
      ]);
      const b = buildSet([
        mockInterpretationAssessment({
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: PRESENT,
          eval_basis_key: "eb-b",
          policy_key: "pk-a",
          interp_basis_key: "ib-b",
        }),
      ]);
      assert.notEqual(
        a.candidate_assessments[0]!.capability_state_basis!.key,
        b.candidate_assessments[0]!.capability_state_basis!.key
      );

      const c = buildSet([
        mockInterpretationAssessment({
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: ABSENT,
          eval_basis_key: "eb-a",
          policy_key: "pk-a",
          interp_basis_key: "ib-c",
        }),
      ]);
      assert.notEqual(
        a.candidate_assessments[0]!.capability_state_basis!.key,
        c.candidate_assessments[0]!.capability_state_basis!.key
      );

      assert.equal(
        a.candidate_assessments[0]!.capability_state_basis!.key,
        attentionObservationCapabilityStateKey(
          CAND,
          NEED_KEY,
          SET_KEY,
          "eb-a",
          "CAPABILITY_PRESENT",
          "ib-a",
          "pk-a"
        )
      );
    });

    it("PRESENT/null Basis contradiction rejects", () => {
      assert.throws(() =>
        mapCapabilityInterpretationAssessmentToCapabilityState(
          mockInterpretationAssessment({
            status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
            interpretation: PRESENT,
            forceInterpBasis: null,
          })
        )
      );
    });

    it("policy-absence contradiction rejects", () => {
      assert.throws(() =>
        mapCapabilityInterpretationAssessmentToCapabilityState(
          mockInterpretationAssessment({
            status: "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED",
            forcePolicyPresent: true,
          })
        )
      );
    });

    it("no-mapping contradiction rejects", () => {
      assert.throws(() =>
        mapCapabilityInterpretationAssessmentToCapabilityState(
          mockInterpretationAssessment({
            status:
              "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE",
            forcePolicyPresent: false,
            forcePolicy: null,
          })
        )
      );
    });

    it("stale Interpretation Basis lineage rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationCapabilityState(
          mockInterpretationAssessment({
            status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
            interpretation: PRESENT,
            eval_basis_key: "eb-current",
            forceInterpBasis: {
              key: "ib",
              candidate_key: CAND,
              observation_need_key: NEED_KEY,
              capability_requirement_set_key: SET_KEY,
              requirement_set_evaluation_state_basis_key: "eb-stale",
              current_requirement_set_evaluation_state: HOLDS,
              capability_interpretation_policy_key: POLICY_KEY,
              matched_mapping: {
                evaluation_state: HOLDS,
                interpretation: PRESENT,
              },
              interpretation: PRESENT,
            },
          })
        )
      );
    });
  });

  describe("mixed / booleans / isolation", () => {
    it("mixed contexts preserved; set boolean true with ABSENT/unresolved", () => {
      const set = buildSet([
        mockInterpretationAssessment({
          candidate_key: "c1",
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: PRESENT,
        }),
        mockInterpretationAssessment({
          candidate_key: "c2",
          status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
          interpretation: ABSENT,
        }),
        mockInterpretationAssessment({
          candidate_key: "c3",
          status: "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED",
        }),
        mockInterpretationAssessment({
          candidate_key: "c4",
          status:
            "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE",
        }),
        mockInterpretationAssessment({
          candidate_key: "c5",
          status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        }),
      ]);

      assert.deepEqual(
        set.candidate_assessments.map((c) =>
          c.capability_state_basis?.capability_state ?? null
        ),
        [
          "CAPABILITY_PRESENT",
          "CAPABILITY_ABSENT",
          "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY",
          "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE",
          null,
        ]
      );
      assert.equal(set.has_capability_states, true);
      assert.equal(set.candidate_assessments[1]!.has_capability_state, true);
      assert.equal(set.candidate_assessments[2]!.has_capability_state, true);
      assert.equal(set.candidate_assessments[4]!.has_capability_state, false);
      assertNoForbiddenSemantics(set);
    });

    it("cross-Candidate isolation; determinism; immutability", () => {
      const assessment = mockInterpretationAssessment({
        status: "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
        interpretation: PRESENT,
      });
      const input = {
        capability_interpretation_set: {
          capability_requirement_set_evaluation_state_set: {} as never,
          capability_interpretation_policy_set: {} as never,
          candidate_assessments: [assessment],
          has_capability_interpretation_basis: true,
          model_limitations: [] as const,
        },
      };
      const before = structuredClone(input);
      const a = buildAttentionObservationCapabilityStateSet(input as never);
      const b = buildAttentionObservationCapabilityStateSet(input as never);
      assert.deepEqual(a, b);
      assert.deepEqual(input, before);
      const c = buildAttentionObservationCapabilityStateSet(
        structuredClone(input) as never
      );
      assert.deepEqual(a, c);
    });
  });

  describe("static proofs / schema", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_STATE_MODEL_LIMITATIONS[0],
        "CAPABILITY_TRUTH_BOOLEAN_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_STATE_MODEL_LIMITATIONS.at(-1),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 082-only runtime; no 080/081 matching", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-state-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-state-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_interpretation_set/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));

      assert.ok(!/from ["'].*interpretation-policy-core/.test(src));
      assert.ok(!/from ["'].*set-evaluation-state-core/.test(src));
      assert.ok(!/from ["'].*set-composition-result-core/.test(src));
      assert.ok(!/from ["'].*interpretation-core/.test(src));

      assert.ok(!/findExactCapabilityInterpretationMapping/.test(core));
      assert.ok(!/COMPOSITION_CONDITION_HOLDS/.test(core));
      assert.ok(!/COMPOSITION_CONDITION_DOES_NOT_HOLD/.test(core));
      assert.ok(!/"HAS_CAPABILITY"/.test(core));
      assert.ok(!/"LACKS_CAPABILITY"/.test(core));
      assert.ok(!/\.some\(/.test(core));
      assert.ok(!/\.every\(/.test(core));
      assert.ok(!/\.find\(/.test(core));
    });
  });
});
