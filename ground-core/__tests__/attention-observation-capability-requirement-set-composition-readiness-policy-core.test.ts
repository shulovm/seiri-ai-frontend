/**
 * GROUND-077 — Observation Core XXXI / Explicit Capability Requirement Set
 * Composition Readiness Policy Foundation
 *
 * Pure 048 Capability Requirement Set + explicit Readiness Policy Specification
 * (policy declaration only; no 075 current Satisfaction States / no 076
 * Composition Policy / no readiness result / no Capability truth).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_MODEL_LIMITATIONS,
  attentionObservationCapabilityRequirementSetCompositionReadinessPolicyKey,
  buildAttentionObservationCapabilityRequirementSetCompositionReadinessPolicySet,
  CANONICAL_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_KIND_ORDER,
  FUTURE_CAPABILITY_REQUIREMENT_SATISFACTION_RESOLVED_STATES,
  FUTURE_CAPABILITY_REQUIREMENT_SATISFACTION_UNRESOLVED_STATES,
  normalizeAttentionObservationCapabilityRequirementSetCompositionReadinessPolicySpecification,
} from "../reality/attention-observation-capability-requirement-set-composition-readiness-policy-core.js";
import type {
  AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyKind,
} from "../reality/attention-observation-capability-requirement-set-composition-readiness-policy-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetCompositionPolicySet,
} from "../reality/attention-observation-capability-requirement-set-composition-policy-core.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "../reality/attention-observation-capability-requirement-set-identity.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const NEED_KEY_2 = "need-b";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";
const REQ_KEY_3 =
  "attention-observation-capability-requirement|need|satellite_imaging";
const ALL_RESOLVED =
  "REQUIRE_ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_RESOLVED_BEFORE_COMPOSITION" as const;
const COMPOSITION_ANY =
  "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED" as const;
const COMPOSITION_ALL =
  "ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_ARE_SATISFIED" as const;

function assertNoReadinessResultOrCapabilityTruth(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/READINESS_POLICY_CONDITION_HOLDS/.test(json));
  assert.ok(!/READINESS_POLICY_CONDITION_DOES_NOT_HOLD/.test(json));
  assert.ok(!/CONDITION_HOLDS/.test(json));
  assert.ok(!/CONDITION_DOES_NOT_HOLD/.test(json));
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"composition_result"/.test(json));
  assert.ok(!/"readiness_result"/.test(json));
  assert.ok(!/"satisfied_count"/.test(json));
  assert.ok(!/"unsatisfied_count"/.test(json));
  assert.ok(!/"unresolved_count"/.test(json));
  assert.ok(!/"resolved_count"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
}

function mockRequirementSet(options?: {
  candidates?: {
    candidate_key: string;
    status?:
      | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      | "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
      | "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
    observation_need_key?: string;
    requirements?: { key: string; semantic: string }[];
  }[];
}): AttentionObservationCapabilityRequirementSetAssessment {
  const candidates = options?.candidates ?? [
    {
      candidate_key: "cand",
      status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" as const,
      observation_need_key: NEED_KEY,
      requirements: [
        { key: REQ_KEY, semantic: "inspect" },
        { key: REQ_KEY_2, semantic: "human_inspection" },
      ],
    },
  ];

  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: candidates.map((c) => {
      const status =
        c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
      const requirements = c.requirements ?? [];
      const observation_need_key = c.observation_need_key ?? NEED_KEY;
      const hasExplicit =
        status === "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
        requirements.length > 0;

      return {
        candidate_key: c.candidate_key,
        planning: {} as never,
        status,
        capability_requirement_basis:
          status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            ? null
            : {
                observation_need_key,
                requirements: requirements.map((r) => ({
                  key: r.key,
                  observation_need_key,
                  capability_semantic_key: r.semantic,
                })),
              },
        has_explicit_capability_requirements: hasExplicit,
        model_limitations: [],
      };
    }),
    has_explicit_capability_requirements: candidates.some(
      (c) =>
        (c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT") ===
          "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
        (c.requirements?.length ?? 0) > 0
    ),
    model_limitations: [],
  };
}

function buildSet(
  policies: {
    candidate_key: string;
    readiness_kind: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyKind;
  }[],
  requirementSet: AttentionObservationCapabilityRequirementSetAssessment = mockRequirementSet()
) {
  return buildAttentionObservationCapabilityRequirementSetCompositionReadinessPolicySet(
    {
      capability_requirement_set: requirementSet,
      specification: { policies },
    }
  );
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-077 Capability Requirement Set Composition Readiness Policy", () => {
  describe("baseline readiness policy", () => {
    it("all-resolved readiness policy PRESENT; no Satisfaction-state inspection", () => {
      const set = buildSet([
        { candidate_key: "cand", readiness_kind: ALL_RESOLVED },
      ]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT"
      );
      assert.notEqual(
        assessment.capability_requirement_set_composition_readiness_policy,
        null
      );
      assert.equal(
        assessment.capability_requirement_set_composition_readiness_policy!
          .readiness_kind,
        ALL_RESOLVED
      );
      assert.deepEqual(
        assessment.capability_requirement_set_composition_readiness_policy!
          .capability_requirement_keys,
        canonicalizeCapabilityRequirementKeys([REQ_KEY, REQ_KEY_2])
      );
      assert.equal(
        set.has_explicit_capability_requirement_set_composition_readiness_policies,
        true
      );
      assertNoReadinessResultOrCapabilityTruth(set);
    });

    it("no readiness policy → NO_EXPLICIT_...READINESS_POLICY_DECLARED; no default", () => {
      const set = buildSet([]);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_DECLARED"
      );
      assert.equal(
        firstCandidate(set)
          .capability_requirement_set_composition_readiness_policy,
        null
      );
      assert.equal(
        set.has_explicit_capability_requirement_set_composition_readiness_policies,
        false
      );
    });

    it("no explicit Requirements → NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
            requirements: [],
          },
        ],
      });
      const set = buildSet([], requirementSet);
      assert.equal(
        firstCandidate(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });

    it("no planning basis → NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            requirements: [],
          },
        ],
      });
      const set = buildSet([], requirementSet);
      assert.equal(
        firstCandidate(set).status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });
  });

  describe("empty domain / conflicts / duplicates", () => {
    it("zero Requirement set + readiness policy input → reject", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
            requirements: [],
          },
        ],
      });
      assert.throws(
        () =>
          buildSet(
            [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
            requirementSet
          ),
        /non-empty Capability Requirement set/
      );
    });

    it("exact duplicate readiness policy → normalize", () => {
      const set = buildSet([
        { candidate_key: "cand", readiness_kind: ALL_RESOLVED },
        { candidate_key: "cand", readiness_kind: ALL_RESOLVED },
      ]);
      assert.equal(set.specification.policies.length, 1);
      assert.equal(set.specification.policies[0]!.readiness_kind, ALL_RESOLVED);
    });

    it("specification reorder → deepEqual", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand-a",
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
          {
            candidate_key: "cand-b",
            observation_need_key: NEED_KEY_2,
            requirements: [
              {
                key: "attention-observation-capability-requirement|need-b|inspect",
                semantic: "inspect",
              },
            ],
          },
        ],
      });
      const a = buildSet(
        [
          { candidate_key: "cand-a", readiness_kind: ALL_RESOLVED },
          { candidate_key: "cand-b", readiness_kind: ALL_RESOLVED },
        ],
        requirementSet
      );
      const b = buildSet(
        [
          { candidate_key: "cand-b", readiness_kind: ALL_RESOLVED },
          { candidate_key: "cand-a", readiness_kind: ALL_RESOLVED },
        ],
        requirementSet
      );
      assert.deepEqual(a.specification, b.specification);
      assert.deepEqual(
        a.candidate_assessments.map(
          (c) =>
            c.capability_requirement_set_composition_readiness_policy?.key
        ),
        b.candidate_assessments.map(
          (c) =>
            c.capability_requirement_set_composition_readiness_policy?.key
        )
      );
    });

    it("unknown readiness kind → reject", () => {
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementSetCompositionReadinessPolicySpecification(
            mockRequirementSet(),
            {
              policies: [
                {
                  candidate_key: "cand",
                  readiness_kind:
                    "ALLOW_RESOLVED_SUBSET_COMPOSITION" as AttentionObservationCapabilityRequirementSetCompositionReadinessPolicyKind,
                },
              ],
            }
          ),
        /Unknown/
      );
    });

    it("unknown candidate → reject", () => {
      assert.throws(
        () =>
          buildSet([
            { candidate_key: "missing", readiness_kind: ALL_RESOLVED },
          ]),
        /not found/
      );
    });
  });

  describe("identity / 076 consistency", () => {
    it("Requirement-set reorder → same semantic policy/key", () => {
      const a = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            requirements: [
              { key: REQ_KEY, semantic: "inspect" },
              { key: REQ_KEY_2, semantic: "human_inspection" },
            ],
          },
        ],
      });
      const b = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            requirements: [
              { key: REQ_KEY_2, semantic: "human_inspection" },
              { key: REQ_KEY, semantic: "inspect" },
            ],
          },
        ],
      });
      const setA = buildSet(
        [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
        a
      );
      const setB = buildSet(
        [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
        b
      );
      assert.equal(
        firstCandidate(setA)
          .capability_requirement_set_composition_readiness_policy!.key,
        firstCandidate(setB)
          .capability_requirement_set_composition_readiness_policy!.key
      );
    });

    it("Requirement-set change → set key and 077 key change", () => {
      const two = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            requirements: [
              { key: REQ_KEY, semantic: "inspect" },
              { key: REQ_KEY_2, semantic: "human_inspection" },
            ],
          },
        ],
      });
      const three = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            requirements: [
              { key: REQ_KEY, semantic: "inspect" },
              { key: REQ_KEY_2, semantic: "human_inspection" },
              { key: REQ_KEY_3, semantic: "satellite_imaging" },
            ],
          },
        ],
      });
      const setTwo = buildSet(
        [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
        two
      );
      const setThree = buildSet(
        [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
        three
      );
      const pTwo =
        firstCandidate(setTwo)
          .capability_requirement_set_composition_readiness_policy!;
      const pThree =
        firstCandidate(setThree)
          .capability_requirement_set_composition_readiness_policy!;
      assert.notEqual(
        pTwo.capability_requirement_set_key,
        pThree.capability_requirement_set_key
      );
      assert.notEqual(pTwo.key, pThree.key);
    });

    it("076 / 077 Requirement-set key consistency without 076 runtime dependency in 077", () => {
      const requirementSet = mockRequirementSet();
      const composition =
        buildAttentionObservationCapabilityRequirementSetCompositionPolicySet({
          capability_requirement_set: requirementSet,
          specification: {
            policies: [
              { candidate_key: "cand", composition_kind: COMPOSITION_ALL },
            ],
          },
        });
      const readiness = buildSet(
        [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
        requirementSet
      );
      assert.equal(
        composition.candidate_assessments[0]!
          .capability_requirement_set_composition_policy!
          .capability_requirement_set_key,
        readiness.candidate_assessments[0]!
          .capability_requirement_set_composition_readiness_policy!
          .capability_requirement_set_key
      );
      assert.equal(
        readiness.candidate_assessments[0]!
          .capability_requirement_set_composition_readiness_policy!
          .capability_requirement_set_key,
        buildAttentionObservationCapabilityRequirementSetKey(
          "cand",
          NEED_KEY,
          [REQ_KEY, REQ_KEY_2]
        )
      );
    });

    it("GROUND-076 key regression after shared identity helper extraction", () => {
      const requirementSet = mockRequirementSet();
      const composition =
        buildAttentionObservationCapabilityRequirementSetCompositionPolicySet({
          capability_requirement_set: requirementSet,
          specification: {
            policies: [
              { candidate_key: "cand", composition_kind: COMPOSITION_ANY },
            ],
          },
        });
      const setKey = buildAttentionObservationCapabilityRequirementSetKey(
        "cand",
        NEED_KEY,
        [REQ_KEY, REQ_KEY_2]
      );
      assert.equal(
        composition.candidate_assessments[0]!
          .capability_requirement_set_composition_policy!
          .capability_requirement_set_key,
        setKey
      );
      assert.match(
        composition.candidate_assessments[0]!
          .capability_requirement_set_composition_policy!.key,
        /^attention-observation-capability-requirement-set-composition-policy\|/
      );
    });

    it("policy key matches identity helper", () => {
      const set = buildSet([
        { candidate_key: "cand", readiness_kind: ALL_RESOLVED },
      ]);
      const policy =
        firstCandidate(set)
          .capability_requirement_set_composition_readiness_policy!;
      const setKey = buildAttentionObservationCapabilityRequirementSetKey(
        "cand",
        NEED_KEY,
        [REQ_KEY, REQ_KEY_2]
      );
      assert.equal(policy.capability_requirement_set_key, setKey);
      assert.equal(
        policy.key,
        attentionObservationCapabilityRequirementSetCompositionReadinessPolicyKey(
          "cand",
          NEED_KEY,
          setKey,
          ALL_RESOLVED
        )
      );
    });
  });

  describe("single Requirement / no default / 076 inference firewall", () => {
    it("single Requirement readiness policy valid; absent does not bypass", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
        ],
      });
      const present = buildSet(
        [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
        requirementSet
      );
      assert.equal(
        firstCandidate(present).status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT"
      );
      const absent = buildSet([], requirementSet);
      assert.equal(
        firstCandidate(absent).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_DECLARED"
      );
    });

    it("076 ANY / ALL do not infer readiness policy", () => {
      const requirementSet = mockRequirementSet();
      buildAttentionObservationCapabilityRequirementSetCompositionPolicySet({
        capability_requirement_set: requirementSet,
        specification: {
          policies: [
            { candidate_key: "cand", composition_kind: COMPOSITION_ANY },
          ],
        },
      });
      buildAttentionObservationCapabilityRequirementSetCompositionPolicySet({
        capability_requirement_set: requirementSet,
        specification: {
          policies: [
            { candidate_key: "cand", composition_kind: COMPOSITION_ALL },
          ],
        },
      });
      const readiness = buildSet([], requirementSet);
      assert.equal(
        firstCandidate(readiness).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_DECLARED"
      );
    });
  });

  describe("future resolved / unresolved vocabulary", () => {
    it("SATISFIED and UNSATISFIED documented as future resolved; resolved != SATISFIED-only", () => {
      assert.deepEqual(FUTURE_CAPABILITY_REQUIREMENT_SATISFACTION_RESOLVED_STATES, [
        "SATISFIED",
        "UNSATISFIED",
      ]);
      assert.ok(
        FUTURE_CAPABILITY_REQUIREMENT_SATISFACTION_RESOLVED_STATES.includes(
          "UNSATISFIED"
        )
      );
      assert.notEqual(
        FUTURE_CAPABILITY_REQUIREMENT_SATISFACTION_RESOLVED_STATES.length,
        1
      );
    });

    it("exact two future unresolved Satisfaction states documented", () => {
      assert.deepEqual(
        FUTURE_CAPABILITY_REQUIREMENT_SATISFACTION_UNRESOLVED_STATES,
        [
          "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY",
          "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
        ]
      );
    });

    it("no all-SATISFIED readiness semantics in policy kind", () => {
      assert.equal(ALL_RESOLVED.includes("RESOLVED"), true);
      assert.equal(ALL_RESOLVED.includes("SATISFIED"), false);
      assert.deepEqual(
        CANONICAL_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_KIND_ORDER,
        [ALL_RESOLVED]
      );
    });
  });

  describe("mixed candidates / set boolean", () => {
    it("mixed candidate behavior; set boolean true without readiness result", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "c1",
            requirements: [
              { key: REQ_KEY, semantic: "inspect" },
              { key: REQ_KEY_2, semantic: "human_inspection" },
            ],
          },
          {
            candidate_key: "c2",
            observation_need_key: NEED_KEY_2,
            requirements: [
              {
                key: "attention-observation-capability-requirement|need-b|inspect",
                semantic: "inspect",
              },
            ],
          },
          {
            candidate_key: "c3",
            status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
            requirements: [],
          },
        ],
      });
      const set = buildSet(
        [{ candidate_key: "c1", readiness_kind: ALL_RESOLVED }],
        requirementSet
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[2]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        set.has_explicit_capability_requirement_set_composition_readiness_policies,
        true
      );
      assertNoReadinessResultOrCapabilityTruth(set);
    });
  });

  describe("cross-context / determinism / immutability", () => {
    it("cross-Candidate and cross-ObservationNeed isolation", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "c1",
            observation_need_key: NEED_KEY,
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
          {
            candidate_key: "c2",
            observation_need_key: NEED_KEY_2,
            requirements: [
              {
                key: "attention-observation-capability-requirement|need-b|inspect",
                semantic: "inspect",
              },
            ],
          },
        ],
      });
      const set = buildSet(
        [{ candidate_key: "c1", readiness_kind: ALL_RESOLVED }],
        requirementSet
      );
      assert.equal(
        set.candidate_assessments[0]!
          .capability_requirement_set_composition_readiness_policy!
          .candidate_key,
        "c1"
      );
      assert.equal(
        set.candidate_assessments[1]!
          .capability_requirement_set_composition_readiness_policy,
        null
      );
    });

    it("deep-cloned GROUND-048 input → same output; no pointer identity", () => {
      const requirementSet = mockRequirementSet();
      const cloned = structuredClone(requirementSet);
      const a = buildSet(
        [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
        requirementSet
      );
      const b = buildSet(
        [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
        cloned
      );
      assert.deepEqual(a, b);
      assert.notEqual(
        a.capability_requirement_set,
        b.capability_requirement_set
      );
    });

    it("input immutability + determinism", () => {
      const requirementSet = mockRequirementSet();
      const specification = {
        policies: [{ candidate_key: "cand", readiness_kind: ALL_RESOLVED }],
      };
      const beforeSet = structuredClone(requirementSet);
      const beforeSpec = structuredClone(specification);
      const first =
        buildAttentionObservationCapabilityRequirementSetCompositionReadinessPolicySet(
          {
            capability_requirement_set: requirementSet,
            specification,
          }
        );
      const second =
        buildAttentionObservationCapabilityRequirementSetCompositionReadinessPolicySet(
          {
            capability_requirement_set: requirementSet,
            specification,
          }
        );
      assert.deepEqual(requirementSet, beforeSet);
      assert.deepEqual(specification, beforeSpec);
      assert.deepEqual(first, second);
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("schema 0.1.24; 048-only runtime; no 061–076 / no Satisfaction evaluation", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-composition-readiness-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-composition-readiness-policy-types.ts"
        ),
        "utf8"
      );

      assert.ok(
        !/attention-observation-capability-requirement-satisfaction-core/.test(
          core
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-satisfaction-types/.test(
          core
        )
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
        !/attention-observation-capability-requirement-dimension-aggregation/.test(
          core
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-evaluation-state/.test(
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
      assert.ok(!/\.some\(/.test(core));
      assert.ok(!/\.every\(/.test(core));
      assert.ok(!/"READY"/.test(core));
      assert.ok(!/"NOT_READY"/.test(core));
      assert.ok(!/CONDITION_HOLDS/.test(core));
      assert.ok(!/CONDITION_DOES_NOT_HOLD/.test(core));
      assert.ok(!/HAS_CAPABILITY/.test(core));
      assert.ok(!/satisfied_count/.test(core));
      assert.ok(!/unsatisfied_count/.test(core));
      assert.ok(!/unresolved_count/.test(core));
      assert.ok(!/resolved_count/.test(core));
      assert.ok(!/ALLOW_RESOLVED_SUBSET/.test(types));
      assert.ok(!/TREAT_UNRESOLVED_AS_UNSATISFIED/.test(types));
      assert.ok(!/IGNORE_UNRESOLVED/.test(types));
      assert.ok(!/PARTIALLY_SATISFIED/.test(types));
      assert.ok(
        types.includes(
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_EVALUATION_NOT_MODELED"
        )
      );
      assert.ok(
        core.includes("FUTURE_CAPABILITY_REQUIREMENT_SATISFACTION_RESOLVED_STATES")
      );
      assert.deepEqual(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_MODEL_LIMITATIONS,
        [
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_EVALUATION_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_SATISFACTION_SEMANTICS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_READINESS_SEMANTICS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_RESOLVED_SUBSET_COMPOSITION_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_READINESS_THRESHOLD_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_READINESS_WEIGHTING_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_READINESS_MAJORITY_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_READINESS_VETO_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_MANDATORY_GROUPS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_ALTERNATIVE_GROUPS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_PRIORITY_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_PRECEDENCE_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_AUTHORITY_PRECEDENCE_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_RECENCY_PRECEDENCE_NOT_MODELED",
          "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
          "CAPABILITY_TRUTH_NOT_MODELED",
          "OBSERVER_SUITABILITY_NOT_MODELED",
          "OBSERVER_PERMISSION_NOT_MODELED",
          "OBSERVER_AUTHORITY_NOT_MODELED",
          "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
          "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
          "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
          "OBSERVATION_FEASIBILITY_NOT_MODELED",
          "CAN_EXECUTE_NOT_MODELED",
          "OBSERVER_SELECTION_NOT_MODELED",
          "OBSERVATION_SCHEDULING_NOT_MODELED",
          "OBSERVATION_DISPATCH_NOT_MODELED",
          "EXECUTION_NOT_MODELED",
        ]
      );
    });
  });
});
