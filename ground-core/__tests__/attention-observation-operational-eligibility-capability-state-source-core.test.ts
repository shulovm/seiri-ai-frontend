/**
 * GROUND-085 — Observation Core XXXIX / Operational Eligibility Capability
 * State Source Bridge Foundation
 *
 * Pure GROUND-083 projection (raw Capability State preserved; no polarity /
 * acceptance / coverage / Operational Eligibility / GROUND-084 policy).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityCapabilityStateSource,
  attentionObservationOperationalEligibilityCapabilityStateSourceKey,
  buildAttentionObservationOperationalEligibilityCapabilityStateSourceSet,
} from "../reality/attention-observation-operational-eligibility-capability-state-source-core.js";
import type {
  AttentionCandidateObservationCapabilityStateAssessment,
  AttentionObservationCapabilityState,
  AttentionObservationCapabilityStateBasis,
  AttentionObservationCapabilityStateSetAssessment,
} from "../reality/attention-observation-capability-state-types.js";
import { buildAttentionObservationCapabilityRequirementSetKey } from "../reality/attention-observation-capability-requirement-set-identity.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const NEED_KEY_2 = "need-b";
const REQ1 = "attention-observation-capability-requirement|need|inspect";
const REQ2 =
  "attention-observation-capability-requirement|need|human_inspection";
const SET_KEY = buildAttentionObservationCapabilityRequirementSetKey(
  CAND,
  NEED_KEY,
  [REQ1]
);
const SET_KEY_2 = buildAttentionObservationCapabilityRequirementSetKey(
  CAND,
  NEED_KEY,
  [REQ1, REQ2]
);

const CAPABILITY_PRESENT = "CAPABILITY_PRESENT" as const;
const CAPABILITY_ABSENT = "CAPABILITY_ABSENT" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY" as const;
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"POSITIVE"/.test(json));
  assert.ok(!/"NEGATIVE"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"accepted_capability_states"/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
  assert.ok(!/"permission_state"\s*:/.test(json));
  assert.ok(!/"authority_state"\s*:/.test(json));
  assert.ok(!/"resource_readiness_state"\s*:/.test(json));
  assert.ok(!/"feasibility_state"\s*:/.test(json));
  assert.ok(!/"has_present_capability_source"/.test(json));
  assert.ok(!/"has_acceptable_capability_source"/.test(json));
  assert.ok(!/"has_operational_capability"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

function mockBasis(options: {
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
  capability_state: AttentionObservationCapabilityState;
  basis_key?: string;
}): AttentionObservationCapabilityStateBasis {
  const candidate_key = options.candidate_key ?? CAND;
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const capability_state = options.capability_state;
  const basis_key =
    options.basis_key ??
    [
      "attention-observation-capability-state",
      candidate_key,
      observation_need_key,
      set_key,
      "eval-basis",
      capability_state,
      "none",
      "none",
    ].join("|");

  return {
    key: basis_key,
    candidate_key,
    observation_need_key,
    capability_requirement_set_key: set_key,
    requirement_set_evaluation_state_basis_key: "eval-basis",
    capability_state,
    capability_interpretation_basis_key: null,
    capability_interpretation_policy_key: null,
  };
}

function mockCapabilityStateAssessment(options: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "CAPABILITY_STATE_BASIS_PRESENT";
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
  capability_state?: AttentionObservationCapabilityState;
  basis?: AttentionObservationCapabilityStateBasis | null;
  forceBasis?: AttentionObservationCapabilityStateBasis | null;
  forceEvalContext?: {
    observation_need_key: string;
    capability_requirement_set_key: string;
  } | null;
}): AttentionCandidateObservationCapabilityStateAssessment {
  const candidate_key = options.candidate_key ?? CAND;
  const status = options.status ?? "CAPABILITY_STATE_BASIS_PRESENT";
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const capability_state = options.capability_state ?? CAPABILITY_PRESENT;
  const notApplicable =
    status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";

  const basis =
    options.forceBasis !== undefined
      ? options.forceBasis
      : options.basis !== undefined
        ? options.basis
        : notApplicable
          ? null
          : mockBasis({
              candidate_key,
              observation_need_key,
              set_key,
              capability_state,
            });

  const evalContext =
    options.forceEvalContext !== undefined
      ? options.forceEvalContext
      : notApplicable
        ? null
        : {
            observation_need_key,
            capability_requirement_set_key: set_key,
          };

  return {
    candidate_key,
    capability_interpretation_assessment: {
      candidate_key,
      capability_requirement_set_evaluation_state_assessment: {
        candidate_key,
        capability_requirement_set_composition_assessment: {} as never,
        status: notApplicable
          ? (status as
              | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
              | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS")
          : "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT",
        evaluation_state_basis:
          evalContext === null
            ? null
            : {
                key: "eval-basis",
                candidate_key,
                observation_need_key: evalContext.observation_need_key,
                capability_requirement_set_key:
                  evalContext.capability_requirement_set_key,
                state: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS",
                requirement_set_composition_result_basis_key: null,
                requirement_set_composition_readiness_basis_key: null,
              },
        has_capability_requirement_set_evaluation_state: evalContext !== null,
        model_limitations: [],
      },
      capability_interpretation_policy_assessment: {} as never,
      status: notApplicable
        ? (status as
            | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS")
        : "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
      interpretation_basis: null,
      has_capability_interpretation_basis: false,
      model_limitations: [],
    },
    status,
    capability_state_basis: basis,
    has_capability_state: basis !== null,
    model_limitations: [],
  };
}

function mockCapabilityStateSet(
  assessments: AttentionCandidateObservationCapabilityStateAssessment[]
): AttentionObservationCapabilityStateSetAssessment {
  return {
    capability_interpretation_set: {} as never,
    candidate_assessments: assessments,
    has_capability_states: assessments.some((a) => a.has_capability_state),
    model_limitations: [],
  };
}

function buildSet(
  assessments: AttentionCandidateObservationCapabilityStateAssessment[]
) {
  return buildAttentionObservationOperationalEligibilityCapabilityStateSourceSet(
    {
      capability_state_set: mockCapabilityStateSet(assessments),
    }
  );
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-085 Operational Eligibility Capability State Source Bridge", () => {
  describe("all four Capability State values as sources", () => {
    it("CAPABILITY_PRESENT source PRESENT; raw value preserved; no positive normalization", () => {
      const set = buildSet([
        mockCapabilityStateAssessment({
          capability_state: CAPABILITY_PRESENT,
        }),
      ]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT"
      );
      assert.notEqual(assessment.capability_state_source, null);
      assert.equal(
        assessment.capability_state_source!.capability_state,
        CAPABILITY_PRESENT
      );
      assert.equal(
        assessment.capability_state_source!.dimension,
        "CAPABILITY_STATE"
      );
      assertNoForbiddenSemantics(set);
    });

    it("CAPABILITY_ABSENT source PRESENT; Source PRESENT != CAPABILITY_PRESENT", () => {
      const set = buildSet([
        mockCapabilityStateAssessment({
          capability_state: CAPABILITY_ABSENT,
        }),
      ]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT"
      );
      assert.equal(
        assessment.capability_state_source!.capability_state,
        CAPABILITY_ABSENT
      );
      assert.notEqual(assessment.status, CAPABILITY_PRESENT);
      assertNoForbiddenSemantics(set);
    });

    it("policy-absence unresolved Capability source PRESENT", () => {
      const set = buildSet([
        mockCapabilityStateAssessment({
          capability_state: UNRESOLVED_POLICY,
        }),
      ]);
      assert.equal(
        firstCandidate(set).status,
        "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT"
      );
      assert.equal(
        firstCandidate(set).capability_state_source!.capability_state,
        UNRESOLVED_POLICY
      );
    });

    it("no-mapping unresolved Capability source PRESENT", () => {
      const set = buildSet([
        mockCapabilityStateAssessment({
          capability_state: UNRESOLVED_MAPPING,
        }),
      ]);
      assert.equal(
        firstCandidate(set).status,
        "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT"
      );
      assert.equal(
        firstCandidate(set).capability_state_source!.capability_state,
        UNRESOLVED_MAPPING
      );
    });

    it("all four Capability State values are representable", () => {
      for (const capability_state of [
        CAPABILITY_PRESENT,
        CAPABILITY_ABSENT,
        UNRESOLVED_POLICY,
        UNRESOLVED_MAPPING,
      ] as const) {
        const assessment = firstCandidate(
          buildSet([mockCapabilityStateAssessment({ capability_state })])
        );
        assert.equal(
          assessment.status,
          "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT"
        );
        assert.equal(
          assessment.capability_state_source!.capability_state,
          capability_state
        );
      }
    });
  });

  describe("context / identity retention", () => {
    it("retains Basis key / Candidate / ObservationNeed / Requirement-set key", () => {
      const basis = mockBasis({
        capability_state: CAPABILITY_PRESENT,
        basis_key: "exact-083-basis-key",
      });
      const source = firstCandidate(
        buildSet([
          mockCapabilityStateAssessment({
            basis,
            capability_state: CAPABILITY_PRESENT,
          }),
        ])
      ).capability_state_source!;

      assert.equal(source.capability_state_basis_key, "exact-083-basis-key");
      assert.equal(source.candidate_key, CAND);
      assert.equal(source.observation_need_key, NEED_KEY);
      assert.equal(source.capability_requirement_set_key, SET_KEY);
      assert.equal(
        source.key,
        attentionObservationOperationalEligibilityCapabilityStateSourceKey(
          CAND,
          NEED_KEY,
          SET_KEY,
          "exact-083-basis-key",
          CAPABILITY_PRESENT
        )
      );
    });

    it("Basis / Capability State value / Requirement-set change identity", () => {
      const a = firstCandidate(
        buildSet([
          mockCapabilityStateAssessment({
            capability_state: CAPABILITY_PRESENT,
            basis: mockBasis({
              capability_state: CAPABILITY_PRESENT,
              basis_key: "basis-a",
            }),
          }),
        ])
      ).capability_state_source!;
      const b = firstCandidate(
        buildSet([
          mockCapabilityStateAssessment({
            capability_state: CAPABILITY_PRESENT,
            basis: mockBasis({
              capability_state: CAPABILITY_PRESENT,
              basis_key: "basis-b",
            }),
          }),
        ])
      ).capability_state_source!;
      assert.notEqual(a.key, b.key);

      const absent = firstCandidate(
        buildSet([
          mockCapabilityStateAssessment({
            capability_state: CAPABILITY_ABSENT,
            basis: mockBasis({
              capability_state: CAPABILITY_ABSENT,
              basis_key: "basis-a",
            }),
          }),
        ])
      ).capability_state_source!;
      assert.notEqual(a.key, absent.key);

      const threeReq = firstCandidate(
        buildSet([
          mockCapabilityStateAssessment({
            capability_state: CAPABILITY_PRESENT,
            set_key: SET_KEY_2,
            basis: mockBasis({
              capability_state: CAPABILITY_PRESENT,
              set_key: SET_KEY_2,
              basis_key: "basis-a",
            }),
          }),
        ])
      ).capability_state_source!;
      assert.notEqual(a.key, threeReq.key);
    });
  });

  describe("NOT_APPLICABLE / no synthetic source", () => {
    it("no planning basis → no source", () => {
      const set = buildSet([
        mockCapabilityStateAssessment({
          status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        }),
      ]);
      assert.equal(
        firstCandidate(set).status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(firstCandidate(set).capability_state_source, null);
      assert.equal(
        set.has_capability_state_operational_eligibility_sources,
        false
      );
    });

    it("no explicit Requirements → no source", () => {
      const set = buildSet([
        mockCapabilityStateAssessment({
          status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        }),
      ]);
      assert.equal(
        firstCandidate(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(firstCandidate(set).capability_state_source, null);
    });

    it("status/Basis contradiction rejects; no synthetic source", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityCapabilityStateSource(
          mockCapabilityStateAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            forceBasis: mockBasis({ capability_state: CAPABILITY_PRESENT }),
          })
        )
      );
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityCapabilityStateSource(
          mockCapabilityStateAssessment({
            status: "CAPABILITY_STATE_BASIS_PRESENT",
            forceBasis: null,
          })
        )
      );
    });
  });

  describe("stale / context mismatch firewall", () => {
    it("Candidate mismatch rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityCapabilityStateSource(
          mockCapabilityStateAssessment({
            candidate_key: CAND,
            forceBasis: mockBasis({
              candidate_key: "other",
              capability_state: CAPABILITY_PRESENT,
            }),
          })
        )
      );
    });

    it("ObservationNeed mismatch rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityCapabilityStateSource(
          mockCapabilityStateAssessment({
            observation_need_key: NEED_KEY,
            forceBasis: mockBasis({
              observation_need_key: NEED_KEY_2,
              capability_state: CAPABILITY_PRESENT,
            }),
          })
        )
      );
    });

    it("Requirement-set mismatch rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityCapabilityStateSource(
          mockCapabilityStateAssessment({
            set_key: SET_KEY,
            forceBasis: mockBasis({
              set_key: SET_KEY_2,
              capability_state: CAPABILITY_PRESENT,
            }),
          })
        )
      );
    });
  });

  describe("set boolean / isolation / determinism", () => {
    it("set boolean true for all ABSENT and all unresolved sources", () => {
      const allAbsent = buildSet([
        mockCapabilityStateAssessment({
          candidate_key: "a",
          capability_state: CAPABILITY_ABSENT,
          set_key: buildAttentionObservationCapabilityRequirementSetKey(
            "a",
            NEED_KEY,
            [REQ1]
          ),
          basis: mockBasis({
            candidate_key: "a",
            capability_state: CAPABILITY_ABSENT,
            set_key: buildAttentionObservationCapabilityRequirementSetKey(
              "a",
              NEED_KEY,
              [REQ1]
            ),
          }),
        }),
        mockCapabilityStateAssessment({
          candidate_key: "b",
          capability_state: CAPABILITY_ABSENT,
          set_key: buildAttentionObservationCapabilityRequirementSetKey(
            "b",
            NEED_KEY,
            [REQ1]
          ),
          basis: mockBasis({
            candidate_key: "b",
            capability_state: CAPABILITY_ABSENT,
            set_key: buildAttentionObservationCapabilityRequirementSetKey(
              "b",
              NEED_KEY,
              [REQ1]
            ),
          }),
        }),
      ]);
      assert.equal(
        allAbsent.has_capability_state_operational_eligibility_sources,
        true
      );

      const allUnresolved = buildSet([
        mockCapabilityStateAssessment({
          candidate_key: "a",
          capability_state: UNRESOLVED_POLICY,
          set_key: buildAttentionObservationCapabilityRequirementSetKey(
            "a",
            NEED_KEY,
            [REQ1]
          ),
          basis: mockBasis({
            candidate_key: "a",
            capability_state: UNRESOLVED_POLICY,
            set_key: buildAttentionObservationCapabilityRequirementSetKey(
              "a",
              NEED_KEY,
              [REQ1]
            ),
          }),
        }),
        mockCapabilityStateAssessment({
          candidate_key: "b",
          capability_state: UNRESOLVED_MAPPING,
          set_key: buildAttentionObservationCapabilityRequirementSetKey(
            "b",
            NEED_KEY,
            [REQ1]
          ),
          basis: mockBasis({
            candidate_key: "b",
            capability_state: UNRESOLVED_MAPPING,
            set_key: buildAttentionObservationCapabilityRequirementSetKey(
              "b",
              NEED_KEY,
              [REQ1]
            ),
          }),
        }),
      ]);
      assert.equal(
        allUnresolved.has_capability_state_operational_eligibility_sources,
        true
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(
          allAbsent,
          "has_present_capability_source"
        ),
        false
      );
    });

    it("cross-Candidate / ObservationNeed / Requirement-set isolation; order preserved", () => {
      const setKeyA = buildAttentionObservationCapabilityRequirementSetKey(
        "a",
        NEED_KEY,
        [REQ1]
      );
      const setKeyB = buildAttentionObservationCapabilityRequirementSetKey(
        "b",
        NEED_KEY_2,
        [REQ2]
      );
      const set = buildSet([
        mockCapabilityStateAssessment({
          candidate_key: "a",
          observation_need_key: NEED_KEY,
          set_key: setKeyA,
          capability_state: CAPABILITY_ABSENT,
          basis: mockBasis({
            candidate_key: "a",
            observation_need_key: NEED_KEY,
            set_key: setKeyA,
            capability_state: CAPABILITY_ABSENT,
          }),
        }),
        mockCapabilityStateAssessment({
          candidate_key: "b",
          observation_need_key: NEED_KEY_2,
          set_key: setKeyB,
          capability_state: CAPABILITY_PRESENT,
          basis: mockBasis({
            candidate_key: "b",
            observation_need_key: NEED_KEY_2,
            set_key: setKeyB,
            capability_state: CAPABILITY_PRESENT,
          }),
        }),
      ]);
      assert.equal(set.candidate_assessments[0]!.candidate_key, "a");
      assert.equal(set.candidate_assessments[1]!.candidate_key, "b");
      assert.notEqual(
        set.candidate_assessments[0]!.capability_state_source!.key,
        set.candidate_assessments[1]!.capability_state_source!.key
      );
    });

    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const capability_state_set = mockCapabilityStateSet([
        mockCapabilityStateAssessment({
          capability_state: CAPABILITY_ABSENT,
        }),
      ]);
      const before = structuredClone(capability_state_set);
      const a =
        buildAttentionObservationOperationalEligibilityCapabilityStateSourceSet(
          { capability_state_set }
        );
      const b =
        buildAttentionObservationOperationalEligibilityCapabilityStateSourceSet(
          { capability_state_set }
        );
      assert.deepEqual(a, b);
      assert.deepEqual(capability_state_set, before);

      const cloned = structuredClone(capability_state_set);
      const c =
        buildAttentionObservationOperationalEligibilityCapabilityStateSourceSet(
          { capability_state_set: cloned }
        );
      assert.deepEqual(a, c);
      assert.notEqual(a.capability_state_set, cloned);
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 083-only runtime; no 084 / polarity / eligibility / other bridges", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-capability-state-source-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-capability-state-source-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_state_set/.test(core));
      assert.ok(
        /attention-observation-capability-state-types/.test(core)
      );
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-interpretation-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-interpretation-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-requirement-set-evaluation-state-core/.test(
          src
        )
      );
      assert.ok(!/\.required_dimensions\b/.test(core));
      assert.ok(!/required_dimensions\s*:/.test(core));

      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));

      assert.ok(!/"POSITIVE"/.test(src));
      assert.ok(!/"NEGATIVE"/.test(src));
      assert.ok(!/"PASS"/.test(src));
      assert.ok(!/"FAIL"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/"effective_capability"/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"NOT_REPRESENTED"/.test(src));
      assert.ok(!/dimension:\s*"PERMISSION"/.test(src));
      assert.ok(!/dimension:\s*"AUTHORITY"/.test(src));
      assert.ok(!/dimension:\s*"RESOURCE_READINESS"/.test(src));
      assert.ok(!/dimension:\s*"FEASIBILITY"/.test(src));
      assert.ok(!/selectObserver|assignObserver|dispatchObservation|scheduleObservation/.test(src));
    });
  });
});
