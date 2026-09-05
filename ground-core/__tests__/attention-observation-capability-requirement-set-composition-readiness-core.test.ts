/**
 * GROUND-078 — Observation Core XXXII / Capability Requirement Set Composition
 * Readiness Basis
 *
 * Pure 075 Satisfaction States + 077 Readiness Policy evaluation
 * (all-resolved readiness only; no 076 ANY/ALL; no Capability truth;
 * UNSATISFIED is resolved).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_MODEL_LIMITATIONS,
  assertCompatibleCapabilityRequirementSetCompositionReadinessContexts,
  attentionObservationCapabilityRequirementSetCompositionReadinessBasisKey,
  buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet,
  buildCanonicalCapabilityRequirementSatisfactionStateBasisSetKey,
  isResolvedCapabilityRequirementSatisfactionState,
} from "../reality/attention-observation-capability-requirement-set-composition-readiness-core.js";
import type {
  AttentionObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionState,
} from "../reality/attention-observation-capability-requirement-satisfaction-types.js";
import type {
  AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySetAssessment,
} from "../reality/attention-observation-capability-requirement-set-composition-readiness-policy-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
} from "../reality/attention-observation-capability-requirement-set-identity.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const CAND = "cand";
const REQ1 = "attention-observation-capability-requirement|need|inspect";
const REQ2 = "attention-observation-capability-requirement|need|human_inspection";
const REQ3 = "attention-observation-capability-requirement|need|satellite_imaging";
const ALL_RESOLVED =
  "REQUIRE_ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_RESOLVED_BEFORE_COMPOSITION" as const;
const HOLDS =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS" as const;
const DOES_NOT_HOLD =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY" as const;
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE" as const;

function assertNoCompositionOrCapabilityTruth(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"composition_result"/.test(json));
  assert.ok(
    !/CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS/.test(json)
  );
  assert.ok(
    !/CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD/.test(
      json
    )
  );
  assert.ok(!/"satisfied_count"/.test(json));
  assert.ok(!/"unsatisfied_count"/.test(json));
  assert.ok(!/"unresolved_count"/.test(json));
  assert.ok(!/"resolved_count"/.test(json));
  assert.ok(!/"PARTIALLY_READY"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"has_ready_requirement_set"/.test(json));
}

function satisfactionAssessment(
  requirementKey: string,
  state: AttentionObservationCapabilityRequirementSatisfactionState,
  semantic = "inspect"
): AttentionObservationCapabilityRequirementSatisfactionAssessment {
  const basisKey = `satisfaction-state-basis|${requirementKey}|${state}`;
  return {
    capability_requirement: {
      key: requirementKey,
      observation_need_key: NEED_KEY,
      capability_semantic_key: semantic,
    },
    satisfaction_interpretation_assessment: {} as never,
    satisfaction_state_basis: {
      key: basisKey,
      capability_requirement_key: requirementKey,
      observation_need_key: NEED_KEY,
      requirement_evaluation_state_basis_key: `eval|${requirementKey}`,
      satisfaction_state: state,
      satisfaction_interpretation_basis_key:
        state === "SATISFIED" || state === "UNSATISFIED"
          ? `interp|${requirementKey}`
          : null,
      satisfaction_interpretation_policy_key:
        state === UNRESOLVED_POLICY ? null : `policy|${requirementKey}`,
    },
  };
}

function mockSatisfactionSet(
  states: {
    key: string;
    state: AttentionObservationCapabilityRequirementSatisfactionState;
    semantic?: string;
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

function mockReadinessPolicySet(options?: {
  candidate_key?: string;
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_DECLARED"
    | "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT";
  requirement_keys?: string[];
  observation_need_key?: string;
}): AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySetAssessment {
  const candidate_key = options?.candidate_key ?? CAND;
  const requirement_keys = options?.requirement_keys ?? [REQ1, REQ2];
  const observation_need_key = options?.observation_need_key ?? NEED_KEY;
  const status =
    options?.status ??
    "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT";

  const setKey =
    requirement_keys.length === 0
      ? ""
      : buildAttentionObservationCapabilityRequirementSetKey(
          candidate_key,
          observation_need_key,
          requirement_keys
        );

  const policyPresent =
    status ===
    "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT";

  return {
    capability_requirement_set: {} as never,
    specification: { policies: [] },
    candidate_assessments: [
      {
        candidate_key,
        capability_requirement_assessment: {} as never,
        status,
        capability_requirement_set_composition_readiness_policy: policyPresent
          ? {
              key: [
                "attention-observation-capability-requirement-set-composition-readiness-policy",
                candidate_key,
                observation_need_key,
                setKey,
                ALL_RESOLVED,
              ].join("|"),
              candidate_key,
              observation_need_key,
              capability_requirement_set_key: setKey,
              capability_requirement_keys: [...requirement_keys].sort(),
              readiness_kind: ALL_RESOLVED,
            }
          : null,
        model_limitations: [],
      },
    ],
    has_explicit_capability_requirement_set_composition_readiness_policies:
      policyPresent,
    model_limitations: [],
  };
}

function buildSet(
  states: {
    key: string;
    state: AttentionObservationCapabilityRequirementSatisfactionState;
    semantic?: string;
  }[],
  policyOptions?: Parameters<typeof mockReadinessPolicySet>[0],
  satisfactionOptions?: Parameters<typeof mockSatisfactionSet>[1]
) {
  const satisfaction_set = mockSatisfactionSet(states, satisfactionOptions);
  const readiness_policy_set = mockReadinessPolicySet({
    requirement_keys: states.map((s) => s.key),
    ...policyOptions,
  });
  return buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
    {
      capability_requirement_satisfaction_set: satisfaction_set,
      capability_requirement_set_composition_readiness_policy_set:
        readiness_policy_set,
    }
  );
}

function first(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-078 Capability Requirement Set Composition Readiness Basis", () => {
  describe("all-resolved readiness outcomes", () => {
    it("all SATISFIED → CONDITION_HOLDS; no 076 composition", () => {
      const set = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
      ]);
      assert.equal(
        first(set).status,
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT"
      );
      assert.equal(first(set).readiness_basis!.outcome, HOLDS);
      assert.equal(
        first(set).readiness_basis!.unresolved_requirement_refs.length,
        0
      );
      assertNoCompositionOrCapabilityTruth(set);
    });

    it("SATISFIED + UNSATISFIED → CONDITION_HOLDS (resolved != SATISFIED)", () => {
      const set = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
      ]);
      assert.equal(first(set).readiness_basis!.outcome, HOLDS);
      assert.equal(
        first(set).readiness_basis!.unresolved_requirement_refs.length,
        0
      );
    });

    it("all UNSATISFIED → CONDITION_HOLDS; no Capability negative verdict", () => {
      const set = buildSet([
        { key: REQ1, state: "UNSATISFIED", semantic: "inspect" },
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
      ]);
      assert.equal(first(set).readiness_basis!.outcome, HOLDS);
      assertNoCompositionOrCapabilityTruth(set);
    });
  });

  describe("unresolved readiness outcomes", () => {
    it("one policy-absence unresolved → DOES_NOT_HOLD; exact ref preserved", () => {
      const set = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        {
          key: REQ2,
          state: UNRESOLVED_POLICY,
          semantic: "human_inspection",
        },
        { key: REQ3, state: "UNSATISFIED", semantic: "satellite_imaging" },
      ]);
      assert.equal(first(set).readiness_basis!.outcome, DOES_NOT_HOLD);
      assert.equal(
        first(set).readiness_basis!.unresolved_requirement_refs.length,
        1
      );
      assert.equal(
        first(set).readiness_basis!.unresolved_requirement_refs[0]!
          .capability_requirement_key,
        REQ2
      );
      assert.equal(
        first(set).readiness_basis!.unresolved_requirement_refs[0]!
          .unresolved_satisfaction_state,
        UNRESOLVED_POLICY
      );
    });

    it("one no-mapping unresolved → DOES_NOT_HOLD; different reason preserved", () => {
      const set = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        {
          key: REQ2,
          state: UNRESOLVED_MAPPING,
          semantic: "human_inspection",
        },
      ]);
      assert.equal(first(set).readiness_basis!.outcome, DOES_NOT_HOLD);
      assert.equal(
        first(set).readiness_basis!.unresolved_requirement_refs[0]!
          .unresolved_satisfaction_state,
        UNRESOLVED_MAPPING
      );
    });

    it("both unresolved kinds preserved independently", () => {
      const set = buildSet([
        { key: REQ1, state: UNRESOLVED_POLICY, semantic: "inspect" },
        {
          key: REQ2,
          state: UNRESOLVED_MAPPING,
          semantic: "human_inspection",
        },
      ]);
      assert.equal(first(set).readiness_basis!.outcome, DOES_NOT_HOLD);
      assert.equal(
        first(set).readiness_basis!.unresolved_requirement_refs.length,
        2
      );
      const reasons = first(set)
        .readiness_basis!.unresolved_requirement_refs.map(
          (r) => r.unresolved_satisfaction_state
        )
        .sort();
      assert.deepEqual(reasons, [UNRESOLVED_POLICY, UNRESOLVED_MAPPING].sort());
    });

    it("all unresolved → DOES_NOT_HOLD; no Capability failure", () => {
      const set = buildSet([
        { key: REQ1, state: UNRESOLVED_POLICY, semantic: "inspect" },
        {
          key: REQ2,
          state: UNRESOLVED_MAPPING,
          semantic: "human_inspection",
        },
      ]);
      assert.equal(first(set).readiness_basis!.outcome, DOES_NOT_HOLD);
      assert.equal(
        set.has_capability_requirement_set_composition_readiness_basis,
        true
      );
      assertNoCompositionOrCapabilityTruth(set);
    });
  });

  describe("resolved classifier", () => {
    it("exhaustive classifier: SATISFIED/UNSATISFIED resolved; both UNRESOLVED unresolved", () => {
      assert.equal(
        isResolvedCapabilityRequirementSatisfactionState("SATISFIED"),
        true
      );
      assert.equal(
        isResolvedCapabilityRequirementSatisfactionState("UNSATISFIED"),
        true
      );
      assert.equal(
        isResolvedCapabilityRequirementSatisfactionState(UNRESOLVED_POLICY),
        false
      );
      assert.equal(
        isResolvedCapabilityRequirementSatisfactionState(UNRESOLVED_MAPPING),
        false
      );
    });

    it("UNSATISFIED not classified unresolved; readiness DOES_NOT_HOLD != any UNSATISFIED", () => {
      const set = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
      ]);
      assert.equal(first(set).readiness_basis!.outcome, HOLDS);
    });
  });

  describe("status / policy absence", () => {
    it("readiness policy absent → no basis (not DOES_NOT_HOLD)", () => {
      const satisfaction = mockSatisfactionSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
      ]);
      const policy = mockReadinessPolicySet({
        status:
          "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_DECLARED",
        requirement_keys: [REQ1, REQ2],
      });
      const set =
        buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
          {
            capability_requirement_satisfaction_set: satisfaction,
            capability_requirement_set_composition_readiness_policy_set: policy,
          }
        );
      assert.equal(
        first(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY"
      );
      assert.equal(first(set).readiness_basis, null);
    });

    it("no explicit Capability Requirements → no basis", () => {
      const satisfaction = mockSatisfactionSet([], {
        status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
      });
      const policy = mockReadinessPolicySet({
        status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        requirement_keys: [],
      });
      const set =
        buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
          {
            capability_requirement_satisfaction_set: satisfaction,
            capability_requirement_set_composition_readiness_policy_set: policy,
          }
        );
      assert.equal(
        first(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });

    it("no planning basis → no basis", () => {
      const satisfaction = mockSatisfactionSet([], {
        status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
      });
      const policy = mockReadinessPolicySet({
        status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        requirement_keys: [],
      });
      const set =
        buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
          {
            capability_requirement_satisfaction_set: satisfaction,
            capability_requirement_set_composition_readiness_policy_set: policy,
          }
        );
      assert.equal(
        first(set).status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });

    it("malformed policy PRESENT + empty domain → reject (no vacuous HOLDS)", () => {
      const satisfaction = mockSatisfactionSet([]);
      const policy = mockReadinessPolicySet({
        status:
          "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT",
        requirement_keys: [],
      });
      // force empty keys on PRESENT policy
      policy.candidate_assessments[0]!.capability_requirement_set_composition_readiness_policy =
        {
          key: "bad",
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: "",
          capability_requirement_keys: [],
          readiness_kind: ALL_RESOLVED,
        };
      assert.throws(
        () =>
          buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
            {
              capability_requirement_satisfaction_set: satisfaction,
              capability_requirement_set_composition_readiness_policy_set:
                policy,
            }
          ),
        /empty Requirement domain/
      );
    });
  });

  describe("domain consistency / rejects", () => {
    it("missing Satisfaction State → reject (no synthesize unresolved)", () => {
      const satisfaction = mockSatisfactionSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
      ]);
      const policy = mockReadinessPolicySet({
        requirement_keys: [REQ1, REQ2],
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
            {
              capability_requirement_satisfaction_set: satisfaction,
              capability_requirement_set_composition_readiness_policy_set:
                policy,
            }
          ),
        /Requirement-key set mismatch|Missing/
      );
    });

    it("extra Satisfaction State → reject", () => {
      const satisfaction = mockSatisfactionSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
        { key: REQ3, state: "SATISFIED", semantic: "satellite_imaging" },
      ]);
      const policy = mockReadinessPolicySet({
        requirement_keys: [REQ1, REQ2],
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
            {
              capability_requirement_satisfaction_set: satisfaction,
              capability_requirement_set_composition_readiness_policy_set:
                policy,
            }
          ),
        /Requirement-key set mismatch|Extra/
      );
    });

    it("duplicate Satisfaction State → reject", () => {
      const satisfaction = mockSatisfactionSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
      ]);
      satisfaction.candidate_assessments[0]!.requirement_satisfaction_assessments.push(
        satisfactionAssessment(REQ1, "UNSATISFIED", "inspect")
      );
      const policy = mockReadinessPolicySet({
        requirement_keys: [REQ1, REQ2],
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
            {
              capability_requirement_satisfaction_set: satisfaction,
              capability_requirement_set_composition_readiness_policy_set:
                policy,
            }
          ),
        /Duplicate|Requirement-key set mismatch|Extra/
      );
    });

    it("Requirement-set key mismatch → reject", () => {
      const satisfaction = mockSatisfactionSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
      ]);
      const policy = mockReadinessPolicySet({
        requirement_keys: [REQ1, REQ2],
      });
      policy.candidate_assessments[0]!.capability_requirement_set_composition_readiness_policy!.capability_requirement_set_key =
        "wrong-set-key";
      assert.throws(
        () =>
          assertCompatibleCapabilityRequirementSetCompositionReadinessContexts(
            satisfaction,
            policy
          ),
        /Requirement-set key mismatch/
      );
    });

    it("Candidate mismatch → reject", () => {
      const satisfaction = mockSatisfactionSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
      ]);
      const policy = mockReadinessPolicySet({
        candidate_key: "other",
        requirement_keys: [REQ1],
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
            {
              capability_requirement_satisfaction_set: satisfaction,
              capability_requirement_set_composition_readiness_policy_set:
                policy,
            }
          ),
        /missing candidate|candidate count|candidate key/
      );
    });
  });

  describe("lineage / identity / shared set key", () => {
    it("shared Requirement-set identity equals 076/077 helper", () => {
      const set = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
      ]);
      const expected = buildAttentionObservationCapabilityRequirementSetKey(
        CAND,
        NEED_KEY,
        [REQ1, REQ2]
      );
      assert.equal(
        first(set).readiness_basis!.capability_requirement_set_key,
        expected
      );
    });

    it("full Satisfaction State Basis lineage retained", () => {
      const set = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
      ]);
      assert.equal(
        first(set).readiness_basis!
          .capability_requirement_satisfaction_state_basis_keys.length,
        2
      );
      assert.ok(
        first(set).readiness_basis!.readiness_policy_key.includes(
          "readiness-policy"
        )
      );
    });

    it("state change changes Readiness Basis identity", () => {
      const unresolved = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        {
          key: REQ2,
          state: UNRESOLVED_MAPPING,
          semantic: "human_inspection",
        },
      ]);
      const resolved = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
      ]);
      assert.notEqual(
        first(unresolved).readiness_basis!.key,
        first(resolved).readiness_basis!.key
      );
      assert.equal(first(unresolved).readiness_basis!.outcome, DOES_NOT_HOLD);
      assert.equal(first(resolved).readiness_basis!.outcome, HOLDS);
    });

    it("basis key matches identity helper", () => {
      const set = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "SATISFIED", semantic: "human_inspection" },
      ]);
      const basis = first(set).readiness_basis!;
      assert.equal(
        basis.key,
        attentionObservationCapabilityRequirementSetCompositionReadinessBasisKey(
          CAND,
          NEED_KEY,
          basis.capability_requirement_set_key,
          basis.readiness_policy_key,
          basis.capability_requirement_satisfaction_state_basis_keys,
          HOLDS
        )
      );
      assert.ok(
        buildCanonicalCapabilityRequirementSatisfactionStateBasisSetKey(
          basis.capability_requirement_satisfaction_state_basis_keys
        ).length > 0
      );
    });

    it("Requirement set reorder → semantic equality", () => {
      const a = buildSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
      ]);
      const b = buildSet([
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
      ]);
      assert.equal(
        first(a).readiness_basis!.capability_requirement_set_key,
        first(b).readiness_basis!.capability_requirement_set_key
      );
      assert.equal(first(a).readiness_basis!.outcome, first(b).readiness_basis!.outcome);
    });
  });

  describe("booleans / immutability / determinism", () => {
    it("candidate/set boolean true with only DOES_NOT_HOLD; no positive readiness boolean", () => {
      const set = buildSet([
        { key: REQ1, state: UNRESOLVED_POLICY, semantic: "inspect" },
      ]);
      assert.equal(
        set.has_capability_requirement_set_composition_readiness_basis,
        true
      );
      assert.equal(first(set).readiness_basis!.outcome, DOES_NOT_HOLD);
      assert.ok(
        !("has_ready_requirement_set" in set)
      );
    });

    it("deep clone + input immutability + determinism", () => {
      const satisfaction = mockSatisfactionSet([
        { key: REQ1, state: "SATISFIED", semantic: "inspect" },
        { key: REQ2, state: "UNSATISFIED", semantic: "human_inspection" },
      ]);
      const policy = mockReadinessPolicySet({
        requirement_keys: [REQ1, REQ2],
      });
      const beforeSat = structuredClone(satisfaction);
      const beforePol = structuredClone(policy);
      const firstResult =
        buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
          {
            capability_requirement_satisfaction_set: satisfaction,
            capability_requirement_set_composition_readiness_policy_set: policy,
          }
        );
      const secondResult =
        buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
          {
            capability_requirement_satisfaction_set: structuredClone(
              satisfaction
            ),
            capability_requirement_set_composition_readiness_policy_set:
              structuredClone(policy),
          }
        );
      assert.deepEqual(satisfaction, beforeSat);
      assert.deepEqual(policy, beforePol);
      assert.deepEqual(firstResult, secondResult);
      assert.notEqual(
        firstResult.capability_requirement_satisfaction_set,
        secondResult.capability_requirement_satisfaction_set
      );
    });
  });

  describe("static proofs / schema", () => {
    it("schema 0.1.24; 075+077 only; no 076/074/073/072; no composition execution", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-composition-readiness-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-composition-readiness-types.ts"
        ),
        "utf8"
      );

      assert.ok(
        !/attention-observation-capability-requirement-set-composition-policy-core/.test(
          core
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-set-composition-policy-types/.test(
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
        !/attention-observation-capability-requirement-satisfaction-interpretation-policy-core/.test(
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
      assert.ok(!/"READY"/.test(core));
      assert.ok(!/"NOT_READY"/.test(core));
      assert.ok(!/HAS_CAPABILITY/.test(core));
      assert.ok(!/satisfied_count/.test(core));
      assert.ok(!/unresolved_count/.test(core));
      assert.ok(!/INTERPRET_AS_/.test(core));
      assert.ok(!/ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED/.test(core));
      assert.ok(!/ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_ARE_SATISFIED/.test(core));
      assert.ok(types.includes("CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED"));
      assert.deepEqual(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_MODEL_LIMITATIONS.slice(
          0,
          4
        ),
        [
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_STATE_NOT_MODELED",
          "CAPABILITY_TRUTH_NOT_MODELED",
          "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
        ]
      );

      // classifier exists and is named for resolved, not successful/positive
      assert.ok(core.includes("isResolvedCapabilityRequirementSatisfactionState"));
      assert.ok(!/isSuccessful/.test(core));
      assert.ok(!/isPositive/.test(core));
      assert.ok(!/isCapable/.test(core));
    });
  });
});
