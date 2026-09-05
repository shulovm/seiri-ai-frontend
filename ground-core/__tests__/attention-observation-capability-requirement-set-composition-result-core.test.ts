/**
 * GROUND-079 — Observation Core XXXIII / Capability Requirement Set Composition
 * Result
 *
 * Pure 075 Satisfaction States + 076 Composition Policy + 078 Readiness Basis
 * (ANY/ALL only under readiness HOLDS; no Capability truth; stale readiness reject;
 * readiness DOES_NOT_HOLD ≠ composition DOES_NOT_HOLD).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_MODEL_LIMITATIONS,
  attentionObservationCapabilityRequirementSetCompositionResultKey,
  buildAttentionObservationCapabilityRequirementSetCompositionSet,
  evaluateRequirementSetCompositionPolicyCondition,
} from "../reality/attention-observation-capability-requirement-set-composition-result-core.js";
import type {
  AttentionObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionState,
} from "../reality/attention-observation-capability-requirement-satisfaction-types.js";
import type {
  AttentionObservationCapabilityRequirementSetCompositionPolicyKind,
  AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment,
} from "../reality/attention-observation-capability-requirement-set-composition-policy-types.js";
import type {
  AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment,
} from "../reality/attention-observation-capability-requirement-set-composition-readiness-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
} from "../reality/attention-observation-capability-requirement-set-identity.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const CAND = "cand";
const REQ1 = "attention-observation-capability-requirement|need|inspect";
const REQ2 =
  "attention-observation-capability-requirement|need|human_inspection";
const ANY =
  "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED" as const;
const ALL =
  "ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_ARE_SATISFIED" as const;
const COMPOSITION_HOLDS =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS" as const;
const COMPOSITION_DOES_NOT_HOLD =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD" as const;
const READINESS_HOLDS =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS" as const;
const READINESS_DOES_NOT_HOLD =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" as const;
const ALL_RESOLVED =
  "REQUIRE_ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_RESOLVED_BEFORE_COMPOSITION" as const;
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE" as const;

function assertNoCapabilityTruth(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"CAPABILITY_PRESENT"/.test(json));
  assert.ok(!/"CAPABILITY_ABSENT"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"has_holding_requirement_set"/.test(json));
  assert.ok(!/"all_compositions_hold"/.test(json));
}

function satisfactionAssessment(
  requirementKey: string,
  state: AttentionObservationCapabilityRequirementSatisfactionState,
  semantic: string
): AttentionObservationCapabilityRequirementSatisfactionAssessment {
  return {
    capability_requirement: {
      key: requirementKey,
      observation_need_key: NEED_KEY,
      capability_semantic_key: semantic,
    },
    satisfaction_interpretation_assessment: {} as never,
    satisfaction_state_basis: {
      key: `satisfaction-state-basis|${requirementKey}|${state}`,
      capability_requirement_key: requirementKey,
      observation_need_key: NEED_KEY,
      requirement_evaluation_state_basis_key: `eval|${requirementKey}`,
      satisfaction_state: state,
      satisfaction_interpretation_basis_key:
        state === "SATISFIED" || state === "UNSATISFIED"
          ? `interp|${requirementKey}`
          : null,
      satisfaction_interpretation_policy_key: `policy|${requirementKey}`,
    },
  };
}

function mockSatisfactionSet(
  states: {
    key: string;
    state: AttentionObservationCapabilityRequirementSatisfactionState;
    semantic: string;
  }[],
  options?: {
    candidate_key?: string;
    status?:
      | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      | "CAPABILITY_REQUIREMENT_SATISFACTION_STATES_PRESENT";
  }
): AttentionObservationCapabilityRequirementSatisfactionSetAssessment {
  const candidate_key = options?.candidate_key ?? CAND;
  const status =
    options?.status ??
    (states.length > 0
      ? "CAPABILITY_REQUIREMENT_SATISFACTION_STATES_PRESENT"
      : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  return {
    capability_requirement_satisfaction_interpretation_set: {} as never,
    candidate_assessments: [
      {
        candidate_key,
        satisfaction_interpretation_assessment: {} as never,
        status,
        requirement_satisfaction_assessments: states.map((s) =>
          satisfactionAssessment(s.key, s.state, s.semantic)
        ),
        has_capability_requirement_satisfaction_states: states.length > 0,
        model_limitations: [],
      },
    ],
    has_capability_requirement_satisfaction_states: states.length > 0,
    model_limitations: [],
  };
}

function mockCompositionPolicySet(options: {
  candidate_key?: string;
  composition_kind?: AttentionObservationCapabilityRequirementSetCompositionPolicyKind;
  requirement_keys: string[];
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"
    | "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT";
}): AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment {
  const candidate_key = options.candidate_key ?? CAND;
  const requirement_keys = [...options.requirement_keys].sort();
  const status =
    options.status ??
    "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT";
  const composition_kind = options.composition_kind ?? ANY;
  const setKey =
    requirement_keys.length === 0
      ? ""
      : buildAttentionObservationCapabilityRequirementSetKey(
          candidate_key,
          NEED_KEY,
          requirement_keys
        );
  const present =
    status ===
    "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT";

  return {
    capability_requirement_set: {} as never,
    specification: { policies: [] },
    candidate_assessments: [
      {
        candidate_key,
        capability_requirement_assessment: {} as never,
        status,
        capability_requirement_set_composition_policy: present
          ? {
              key: [
                "attention-observation-capability-requirement-set-composition-policy",
                candidate_key,
                NEED_KEY,
                setKey,
                composition_kind,
              ].join("|"),
              candidate_key,
              observation_need_key: NEED_KEY,
              capability_requirement_set_key: setKey,
              capability_requirement_keys: requirement_keys,
              composition_kind,
            }
          : null,
        model_limitations: [],
      },
    ],
    has_explicit_capability_requirement_set_composition_policies: present,
    model_limitations: [],
  };
}

function mockReadinessSet(options: {
  candidate_key?: string;
  requirement_keys: string[];
  satisfaction_state_basis_keys: string[];
  outcome?:
    | typeof READINESS_HOLDS
    | typeof READINESS_DOES_NOT_HOLD;
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY"
    | "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT";
}): AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment {
  const candidate_key = options.candidate_key ?? CAND;
  const requirement_keys = [...options.requirement_keys].sort();
  const status =
    options.status ??
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT";
  const outcome = options.outcome ?? READINESS_HOLDS;
  const setKey =
    requirement_keys.length === 0
      ? ""
      : buildAttentionObservationCapabilityRequirementSetKey(
          candidate_key,
          NEED_KEY,
          requirement_keys
        );
  const present =
    status === "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT";
  const readinessPolicyKey = [
    "attention-observation-capability-requirement-set-composition-readiness-policy",
    candidate_key,
    NEED_KEY,
    setKey,
    ALL_RESOLVED,
  ].join("|");
  const readinessBasisKey = [
    "attention-observation-capability-requirement-set-composition-readiness-basis",
    candidate_key,
    NEED_KEY,
    setKey,
    readinessPolicyKey,
    [...options.satisfaction_state_basis_keys].sort().join(","),
    outcome,
  ].join("|");

  return {
    capability_requirement_satisfaction_set: {} as never,
    capability_requirement_set_composition_readiness_policy_set: {} as never,
    candidate_assessments: [
      {
        candidate_key,
        capability_requirement_satisfaction_assessment: {} as never,
        capability_requirement_set_composition_readiness_policy_assessment:
          {} as never,
        status,
        readiness_basis: present
          ? {
              key: readinessBasisKey,
              candidate_key,
              observation_need_key: NEED_KEY,
              capability_requirement_set_key: setKey,
              readiness_policy_key: readinessPolicyKey,
              readiness_kind: ALL_RESOLVED,
              capability_requirement_satisfaction_state_basis_keys: [
                ...options.satisfaction_state_basis_keys,
              ],
              unresolved_requirement_refs:
                outcome === READINESS_DOES_NOT_HOLD
                  ? [
                      {
                        capability_requirement_key: requirement_keys[0]!,
                        satisfaction_state_basis_key:
                          options.satisfaction_state_basis_keys[0]!,
                        unresolved_satisfaction_state: UNRESOLVED_MAPPING,
                      },
                    ]
                  : [],
              outcome,
            }
          : null,
        model_limitations: [],
      },
    ],
    has_capability_requirement_set_composition_readiness_basis: present,
    model_limitations: [],
  };
}

function buildSet(
  states: {
    key: string;
    state: AttentionObservationCapabilityRequirementSatisfactionState;
    semantic: string;
  }[],
  composition_kind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind,
  options?: {
    readinessOutcome?: typeof READINESS_HOLDS | typeof READINESS_DOES_NOT_HOLD;
    compositionPolicyStatus?: AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment["candidate_assessments"][0]["status"];
    readinessStatus?: AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment["candidate_assessments"][0]["status"];
    satisfactionStatus?: AttentionObservationCapabilityRequirementSatisfactionSetAssessment["candidate_assessments"][0]["status"];
    staleReadiness?: boolean;
  }
) {
  const satisfaction = mockSatisfactionSet(states, {
    status: options?.satisfactionStatus,
  });
  const requirement_keys = states.map((s) => s.key);
  const stateBasisKeys = satisfaction.candidate_assessments[0]!.requirement_satisfaction_assessments.map(
    (a) => a.satisfaction_state_basis.key
  );
  const composition = mockCompositionPolicySet({
    composition_kind,
    requirement_keys,
    status: options?.compositionPolicyStatus,
  });
  const readiness = mockReadinessSet({
    requirement_keys,
    satisfaction_state_basis_keys: options?.staleReadiness
      ? stateBasisKeys.map((k) => `${k}|stale`)
      : stateBasisKeys,
    outcome: options?.readinessOutcome,
    status: options?.readinessStatus,
  });

  return buildAttentionObservationCapabilityRequirementSetCompositionSet({
    capability_requirement_satisfaction_set: satisfaction,
    capability_requirement_set_composition_policy_set: composition,
    capability_requirement_set_composition_readiness_set: readiness,
  });
}

function first(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-079 Capability Requirement Set Composition Result", () => {
  describe("ANY composition", () => {
    it("one SATISFIED → HOLDS", () => {
      const set = buildSet(
        [{ key: REQ1, state: "SATISFIED", semantic: "inspect" }],
        ANY
      );
      assert.equal(
        first(set).status,
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT"
      );
      assert.equal(first(set).composition_result_basis!.outcome, COMPOSITION_HOLDS);
      assertNoCapabilityTruth(set);
    });

    it("one UNSATISFIED → DOES_NOT_HOLD", () => {
      const set = buildSet(
        [{ key: REQ1, state: "UNSATISFIED", semantic: "inspect" }],
        ANY
      );
      assert.equal(
        first(set).composition_result_basis!.outcome,
        COMPOSITION_DOES_NOT_HOLD
      );
    });

    it("mixed SATISFIED+UNSATISFIED → HOLDS", () => {
      const set = buildSet(
        [
          { key: REQ1, state: "SATISFIED", semantic: "inspect" },
          { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
        ],
        ANY
      );
      assert.equal(first(set).composition_result_basis!.outcome, COMPOSITION_HOLDS);
    });

    it("all UNSATISFIED → DOES_NOT_HOLD", () => {
      const set = buildSet(
        [
          { key: REQ1, state: "UNSATISFIED", semantic: "inspect" },
          { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
        ],
        ANY
      );
      assert.equal(
        first(set).composition_result_basis!.outcome,
        COMPOSITION_DOES_NOT_HOLD
      );
    });

    it("1 SATISFIED / many UNSATISFIED → HOLDS (no majority)", () => {
      const states = [
        { key: REQ1, state: "SATISFIED" as const, semantic: "inspect" },
        ...Array.from({ length: 5 }, (_, i) => ({
          key: `attention-observation-capability-requirement|need|u${i}`,
          state: "UNSATISFIED" as const,
          semantic: `u${i}`,
        })),
      ];
      const set = buildSet(states, ANY);
      assert.equal(first(set).composition_result_basis!.outcome, COMPOSITION_HOLDS);
    });
  });

  describe("ALL composition", () => {
    it("one SATISFIED → HOLDS", () => {
      const set = buildSet(
        [{ key: REQ1, state: "SATISFIED", semantic: "inspect" }],
        ALL
      );
      assert.equal(first(set).composition_result_basis!.outcome, COMPOSITION_HOLDS);
    });

    it("one UNSATISFIED → DOES_NOT_HOLD", () => {
      const set = buildSet(
        [{ key: REQ1, state: "UNSATISFIED", semantic: "inspect" }],
        ALL
      );
      assert.equal(
        first(set).composition_result_basis!.outcome,
        COMPOSITION_DOES_NOT_HOLD
      );
    });

    it("all SATISFIED → HOLDS", () => {
      const set = buildSet(
        [
          { key: REQ1, state: "SATISFIED", semantic: "inspect" },
          { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
        ],
        ALL
      );
      assert.equal(first(set).composition_result_basis!.outcome, COMPOSITION_HOLDS);
    });

    it("mixed → DOES_NOT_HOLD", () => {
      const set = buildSet(
        [
          { key: REQ1, state: "SATISFIED", semantic: "inspect" },
          { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
        ],
        ALL
      );
      assert.equal(
        first(set).composition_result_basis!.outcome,
        COMPOSITION_DOES_NOT_HOLD
      );
    });

    it("99 SATISFIED / 1 UNSATISFIED → DOES_NOT_HOLD (no threshold)", () => {
      const states = [
        ...Array.from({ length: 4 }, (_, i) => ({
          key: `attention-observation-capability-requirement|need|s${i}`,
          state: "SATISFIED" as const,
          semantic: `s${i}`,
        })),
        { key: REQ2, state: "UNSATISFIED" as const, semantic: "human_inspection" },
      ];
      const set = buildSet(states, ALL);
      assert.equal(
        first(set).composition_result_basis!.outcome,
        COMPOSITION_DOES_NOT_HOLD
      );
    });
  });

  describe("readiness gate", () => {
    it("readiness DOES_NOT_HOLD + ANY → no composition result", () => {
      const set = buildSet(
        [
          { key: REQ1, state: "SATISFIED", semantic: "inspect" },
          { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
        ],
        ANY,
        { readinessOutcome: READINESS_DOES_NOT_HOLD }
      );
      assert.equal(
        first(set).status,
        "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(first(set).composition_result_basis, null);
    });

    it("readiness DOES_NOT_HOLD != composition DOES_NOT_HOLD", () => {
      const set = buildSet(
        [{ key: REQ1, state: "SATISFIED", semantic: "inspect" }],
        ALL,
        { readinessOutcome: READINESS_DOES_NOT_HOLD }
      );
      assert.equal(first(set).composition_result_basis, null);
      assert.notEqual(
        first(set).status,
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT"
      );
    });

    it("composition policy absent → no result", () => {
      const set = buildSet(
        [{ key: REQ1, state: "SATISFIED", semantic: "inspect" }],
        ANY,
        {
          compositionPolicyStatus:
            "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED",
        }
      );
      assert.equal(
        first(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY"
      );
    });

    it("readiness policy absent → no result", () => {
      const set = buildSet(
        [{ key: REQ1, state: "SATISFIED", semantic: "inspect" }],
        ANY,
        {
          readinessStatus:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY",
        }
      );
      assert.equal(
        first(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY"
      );
    });

    it("no Requirements / no planning → no result", () => {
      const noReq = buildSet([], ANY, {
        satisfactionStatus: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        compositionPolicyStatus:
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        readinessStatus: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
      });
      assert.equal(
        first(noReq).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );

      const noPlan = buildSet([], ANY, {
        satisfactionStatus: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        compositionPolicyStatus: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        readinessStatus: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
      });
      assert.equal(
        first(noPlan).status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });
  });

  describe("stale readiness / empty domain / evaluator", () => {
    it("stale readiness basis → reject", () => {
      assert.throws(
        () =>
          buildSet(
            [
              { key: REQ1, state: "SATISFIED", semantic: "inspect" },
              { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
            ],
            ANY,
            { staleReadiness: true }
          ),
        /stale readiness/
      );
    });

    it("empty domain ANY/ALL evaluator rejects", () => {
      assert.throws(
        () => evaluateRequirementSetCompositionPolicyCondition(ANY, []),
        /empty Capability Requirement domain/
      );
      assert.throws(
        () => evaluateRequirementSetCompositionPolicyCondition(ALL, []),
        /empty Capability Requirement domain/
      );
    });

    it("unresolved under readiness HOLDS → reject (no recompute/filter)", () => {
      assert.throws(
        () =>
          evaluateRequirementSetCompositionPolicyCondition(ANY, [
            "SATISFIED",
            UNRESOLVED_MAPPING,
          ]),
        /unresolved Satisfaction State/
      );
    });

    it("single Requirement ANY/ALL identities remain distinct; no bypass", () => {
      const anySet = buildSet(
        [{ key: REQ1, state: "SATISFIED", semantic: "inspect" }],
        ANY
      );
      const allSet = buildSet(
        [{ key: REQ1, state: "SATISFIED", semantic: "inspect" }],
        ALL
      );
      assert.notEqual(
        first(anySet).composition_result_basis!.requirement_set_composition_policy_key,
        first(allSet).composition_result_basis!.requirement_set_composition_policy_key
      );
      assert.notEqual(
        first(anySet).composition_result_basis!.key,
        first(allSet).composition_result_basis!.key
      );
      assert.ok(
        first(anySet).composition_result_basis!
          .requirement_set_composition_readiness_basis_key.length > 0
      );
    });
  });

  describe("booleans / lineage / determinism", () => {
    it("PRESENT != positive; set boolean true with only DOES_NOT_HOLD", () => {
      const set = buildSet(
        [{ key: REQ1, state: "UNSATISFIED", semantic: "inspect" }],
        ANY
      );
      assert.equal(
        set.has_capability_requirement_set_composition_result,
        true
      );
      assert.equal(
        first(set).composition_result_basis!.outcome,
        COMPOSITION_DOES_NOT_HOLD
      );
      assert.ok(!("has_holding_requirement_set" in set));
      assert.ok(!("has_capability" in set));
    });

    it("result key matches helper; shared set identity", () => {
      const set = buildSet(
        [
          { key: REQ1, state: "SATISFIED", semantic: "inspect" },
          { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
        ],
        ANY
      );
      const basis = first(set).composition_result_basis!;
      assert.equal(
        basis.capability_requirement_set_key,
        buildAttentionObservationCapabilityRequirementSetKey(CAND, NEED_KEY, [
          REQ1,
          REQ2,
        ])
      );
      assert.equal(
        basis.key,
        attentionObservationCapabilityRequirementSetCompositionResultKey(
          CAND,
          NEED_KEY,
          basis.capability_requirement_set_key,
          basis.requirement_set_composition_policy_key,
          basis.requirement_set_composition_readiness_basis_key,
          basis.capability_requirement_satisfaction_state_basis_keys,
          COMPOSITION_HOLDS
        )
      );
    });

    it("input immutability + deep clone determinism", () => {
      const states = [
        { key: REQ1, state: "SATISFIED" as const, semantic: "inspect" },
        {
          key: REQ2,
          state: "UNSATISFIED" as const,
          semantic: "human_inspection",
        },
      ];
      const satisfaction = mockSatisfactionSet(states);
      const stateKeys =
        satisfaction.candidate_assessments[0]!.requirement_satisfaction_assessments.map(
          (a) => a.satisfaction_state_basis.key
        );
      const composition = mockCompositionPolicySet({
        composition_kind: ALL,
        requirement_keys: [REQ1, REQ2],
      });
      const readiness = mockReadinessSet({
        requirement_keys: [REQ1, REQ2],
        satisfaction_state_basis_keys: stateKeys,
      });
      const beforeSat = structuredClone(satisfaction);
      const beforePol = structuredClone(composition);
      const beforeReady = structuredClone(readiness);
      const a = buildAttentionObservationCapabilityRequirementSetCompositionSet({
        capability_requirement_satisfaction_set: satisfaction,
        capability_requirement_set_composition_policy_set: composition,
        capability_requirement_set_composition_readiness_set: readiness,
      });
      const b = buildAttentionObservationCapabilityRequirementSetCompositionSet({
        capability_requirement_satisfaction_set: structuredClone(satisfaction),
        capability_requirement_set_composition_policy_set:
          structuredClone(composition),
        capability_requirement_set_composition_readiness_set:
          structuredClone(readiness),
      });
      assert.deepEqual(satisfaction, beforeSat);
      assert.deepEqual(composition, beforePol);
      assert.deepEqual(readiness, beforeReady);
      assert.deepEqual(a, b);
    });
  });

  describe("static proofs / schema", () => {
    it("schema 0.1.24; 075+076+078 only; no 077/074/073/072; no Capability truth", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-composition-result-core.ts"
        ),
        "utf8"
      );
      assert.ok(
        !/attention-observation-capability-requirement-set-composition-readiness-policy-core/.test(
          core
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-satisfaction-interpretation-core/.test(
          core
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-evaluation-state-core/.test(
          core
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-dimension-aggregation-result-core/.test(
          core
        )
      );
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*ProjectState/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/"HAS_CAPABILITY"/.test(core));
      assert.ok(!/"LACKS_CAPABILITY"/.test(core));
      assert.ok(!/INTERPRET_AS_/.test(core));
      assert.ok(core.includes("stale readiness"));
      assert.ok(
        core.includes("evaluateRequirementSetCompositionPolicyCondition")
      );
      assert.deepEqual(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_MODEL_LIMITATIONS.slice(
          0,
          5
        ),
        [
          "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_NOT_MODELED",
          "CAPABILITY_COMPOSITION_INTERPRETATION_POLICY_NOT_MODELED",
          "CAPABILITY_COMPOSITION_INTERPRETATION_BASIS_NOT_MODELED",
          "CAPABILITY_STATE_NOT_MODELED",
          "CAPABILITY_TRUTH_NOT_MODELED",
        ]
      );
    });
  });
});
