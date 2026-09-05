/**
 * GROUND-076 — Observation Core XXX / Explicit Capability Requirement Set
 * Composition Policy Foundation
 *
 * Pure 048 Capability Requirement Set + explicit Composition Policy
 * Specification (policy declaration only; no 075 current Satisfaction States /
 * no composition result / no Capability truth).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_MODEL_LIMITATIONS,
  attentionObservationCapabilityRequirementSetCompositionPolicyKey,
  buildAttentionObservationCapabilityRequirementSetCompositionPolicySet,
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
  CANONICAL_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_KIND_ORDER,
  normalizeAttentionObservationCapabilityRequirementSetCompositionPolicySpecification,
} from "../reality/attention-observation-capability-requirement-set-composition-policy-core.js";
import type {
  AttentionObservationCapabilityRequirementSetCompositionPolicyKind,
} from "../reality/attention-observation-capability-requirement-set-composition-policy-types.js";
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
const ANY =
  "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED" as const;
const ALL =
  "ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_ARE_SATISFIED" as const;

function assertNoCompositionResultOrCapabilityTruth(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(
    !/UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY/.test(
      json
    )
  );
  assert.ok(
    !/UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE/.test(
      json
    )
  );
  assert.ok(!/"CONDITION_HOLDS"/.test(json));
  assert.ok(!/"CONDITION_DOES_NOT_HOLD"/.test(json));
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"composition_result"/.test(json));
  assert.ok(!/"satisfied_count"/.test(json));
  assert.ok(!/"unsatisfied_count"/.test(json));
  assert.ok(!/"unresolved_count"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"threshold"/.test(json));
  assert.ok(!/"weight"/.test(json));
  assert.ok(!/"majority"/.test(json));
  assert.ok(!/"veto"/.test(json));
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
    composition_kind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind;
  }[],
  requirementSet: AttentionObservationCapabilityRequirementSetAssessment = mockRequirementSet()
) {
  return buildAttentionObservationCapabilityRequirementSetCompositionPolicySet({
    capability_requirement_set: requirementSet,
    specification: { policies },
  });
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-076 Capability Requirement Set Composition Policy", () => {
  describe("baseline policies", () => {
    it("ANY policy baseline PRESENT; no Satisfaction-state inspection / result", () => {
      const set = buildSet([{ candidate_key: "cand", composition_kind: ANY }]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT"
      );
      assert.notEqual(
        assessment.capability_requirement_set_composition_policy,
        null
      );
      assert.equal(
        assessment.capability_requirement_set_composition_policy!
          .composition_kind,
        ANY
      );
      assert.deepEqual(
        assessment.capability_requirement_set_composition_policy!
          .capability_requirement_keys,
        canonicalizeCapabilityRequirementKeys([REQ_KEY, REQ_KEY_2])
      );
      assert.equal(
        set.has_explicit_capability_requirement_set_composition_policies,
        true
      );
      assertNoCompositionResultOrCapabilityTruth(set);
    });

    it("ALL policy baseline PRESENT", () => {
      const set = buildSet([{ candidate_key: "cand", composition_kind: ALL }]);
      assert.equal(
        firstCandidate(set).capability_requirement_set_composition_policy!
          .composition_kind,
        ALL
      );
      assertNoCompositionResultOrCapabilityTruth(set);
    });

    it("no composition policy → NO_EXPLICIT_...POLICY_DECLARED; no default", () => {
      const set = buildSet([]);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"
      );
      assert.equal(
        firstCandidate(set).capability_requirement_set_composition_policy,
        null
      );
      assert.equal(
        set.has_explicit_capability_requirement_set_composition_policies,
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
    it("zero Requirement set + policy specification → reject", () => {
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
            [{ candidate_key: "cand", composition_kind: ALL }],
            requirementSet
          ),
        /non-empty Capability Requirement set/
      );
    });

    it("exact duplicate policy → normalize", () => {
      const set = buildSet([
        { candidate_key: "cand", composition_kind: ANY },
        { candidate_key: "cand", composition_kind: ANY },
      ]);
      assert.equal(set.specification.policies.length, 1);
      assert.equal(set.specification.policies[0]!.composition_kind, ANY);
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
          { candidate_key: "cand-a", composition_kind: ANY },
          { candidate_key: "cand-b", composition_kind: ALL },
        ],
        requirementSet
      );
      const b = buildSet(
        [
          { candidate_key: "cand-b", composition_kind: ALL },
          { candidate_key: "cand-a", composition_kind: ANY },
        ],
        requirementSet
      );
      assert.deepEqual(a.specification, b.specification);
      assert.deepEqual(
        a.candidate_assessments.map(
          (c) => c.capability_requirement_set_composition_policy?.key
        ),
        b.candidate_assessments.map(
          (c) => c.capability_requirement_set_composition_policy?.key
        )
      );
    });

    it("ANY + ALL conflict → reject", () => {
      assert.throws(
        () =>
          buildSet([
            { candidate_key: "cand", composition_kind: ANY },
            { candidate_key: "cand", composition_kind: ALL },
          ]),
        /Conflicting/
      );
    });

    it("unknown candidate → reject", () => {
      assert.throws(
        () => buildSet([{ candidate_key: "missing", composition_kind: ANY }]),
        /not found/
      );
    });
  });

  describe("identity / lineage", () => {
    it("Requirement set order reorder → same semantic policy/key", () => {
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
      const setA = buildSet([{ candidate_key: "cand", composition_kind: ALL }], a);
      const setB = buildSet([{ candidate_key: "cand", composition_kind: ALL }], b);
      assert.equal(
        firstCandidate(setA).capability_requirement_set_composition_policy!.key,
        firstCandidate(setB).capability_requirement_set_composition_policy!.key
      );
      assert.equal(
        firstCandidate(setA).capability_requirement_set_composition_policy!
          .capability_requirement_set_key,
        firstCandidate(setB).capability_requirement_set_composition_policy!
          .capability_requirement_set_key
      );
    });

    it("Requirement set changes → Requirement-set key and 076 policy key change", () => {
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
        [{ candidate_key: "cand", composition_kind: ALL }],
        two
      );
      const setThree = buildSet(
        [{ candidate_key: "cand", composition_kind: ALL }],
        three
      );
      const keyTwo =
        firstCandidate(setTwo).capability_requirement_set_composition_policy!;
      const keyThree =
        firstCandidate(setThree).capability_requirement_set_composition_policy!;
      assert.notEqual(
        keyTwo.capability_requirement_set_key,
        keyThree.capability_requirement_set_key
      );
      assert.notEqual(keyTwo.key, keyThree.key);
    });

    it("ANY → ALL changes policy identity", () => {
      const anySet = buildSet([{ candidate_key: "cand", composition_kind: ANY }]);
      const allSet = buildSet([{ candidate_key: "cand", composition_kind: ALL }]);
      assert.notEqual(
        firstCandidate(anySet).capability_requirement_set_composition_policy!
          .key,
        firstCandidate(allSet).capability_requirement_set_composition_policy!
          .key
      );
    });

    it("single Requirement ANY and ALL both valid and distinct", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
        ],
      });
      const anySet = buildSet(
        [{ candidate_key: "cand", composition_kind: ANY }],
        requirementSet
      );
      const allSet = buildSet(
        [{ candidate_key: "cand", composition_kind: ALL }],
        requirementSet
      );
      assert.equal(
        firstCandidate(anySet).status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT"
      );
      assert.equal(
        firstCandidate(allSet).status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT"
      );
      assert.notEqual(
        firstCandidate(anySet).capability_requirement_set_composition_policy!
          .key,
        firstCandidate(allSet).capability_requirement_set_composition_policy!
          .key
      );
    });

    it("no single-Requirement policy bypass — absent remains absent", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
        ],
      });
      const set = buildSet([], requirementSet);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"
      );
    });

    it("policy key matches identity helper", () => {
      const set = buildSet([{ candidate_key: "cand", composition_kind: ALL }]);
      const policy =
        firstCandidate(set).capability_requirement_set_composition_policy!;
      const setKey = buildAttentionObservationCapabilityRequirementSetKey(
        "cand",
        NEED_KEY,
        [REQ_KEY, REQ_KEY_2]
      );
      assert.equal(policy.capability_requirement_set_key, setKey);
      assert.equal(
        policy.key,
        attentionObservationCapabilityRequirementSetCompositionPolicyKey(
          "cand",
          NEED_KEY,
          setKey,
          ALL
        )
      );
    });
  });

  describe("implicit ALL/ANY firewalls", () => {
    it("no implicit ANY / ALL; Requirement plurality does not infer ALL or ANY", () => {
      const set = buildSet([]);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"
      );
      assert.equal(
        firstCandidate(set).capability_requirement_set_composition_policy,
        null
      );
      assert.ok(
        firstCandidate(set).capability_requirement_assessment
          .capability_requirement_basis!.requirements.length >= 2
      );
    });
  });

  describe("mixed candidates / set boolean", () => {
    it("mixed candidate behavior; set boolean true without Capability verdict", () => {
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
              {
                key: "attention-observation-capability-requirement|need-b|human_inspection",
                semantic: "human_inspection",
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
        [{ candidate_key: "c1", composition_kind: ALL }],
        requirementSet
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[2]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        set.has_explicit_capability_requirement_set_composition_policies,
        true
      );
      assertNoCompositionResultOrCapabilityTruth(set);
    });

    it("boolean with ALL / ANY policy is true because policy exists", () => {
      assert.equal(
        buildSet([{ candidate_key: "cand", composition_kind: ALL }])
          .has_explicit_capability_requirement_set_composition_policies,
        true
      );
      assert.equal(
        buildSet([{ candidate_key: "cand", composition_kind: ANY }])
          .has_explicit_capability_requirement_set_composition_policies,
        true
      );
    });
  });

  describe("cross-context / determinism / immutability", () => {
    it("cross-Candidate isolation", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "c1",
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
        [{ candidate_key: "c1", composition_kind: ANY }],
        requirementSet
      );
      assert.equal(
        set.candidate_assessments[0]!.capability_requirement_set_composition_policy!
          .candidate_key,
        "c1"
      );
      assert.equal(
        set.candidate_assessments[1]!.capability_requirement_set_composition_policy,
        null
      );
    });

    it("cross-ObservationNeed isolation via distinct Requirement set keys", () => {
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
        [
          { candidate_key: "c1", composition_kind: ALL },
          { candidate_key: "c2", composition_kind: ALL },
        ],
        requirementSet
      );
      const p1 =
        set.candidate_assessments[0]!
          .capability_requirement_set_composition_policy!;
      const p2 =
        set.candidate_assessments[1]!
          .capability_requirement_set_composition_policy!;
      assert.notEqual(p1.observation_need_key, p2.observation_need_key);
      assert.notEqual(
        p1.capability_requirement_set_key,
        p2.capability_requirement_set_key
      );
      assert.notEqual(p1.key, p2.key);
    });

    it("deep-cloned GROUND-048 input → same output; no pointer identity", () => {
      const requirementSet = mockRequirementSet();
      const cloned = structuredClone(requirementSet);
      const a = buildSet(
        [{ candidate_key: "cand", composition_kind: ANY }],
        requirementSet
      );
      const b = buildSet(
        [{ candidate_key: "cand", composition_kind: ANY }],
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
        policies: [{ candidate_key: "cand", composition_kind: ALL }],
      };
      const beforeSet = structuredClone(requirementSet);
      const beforeSpec = structuredClone(specification);
      const first =
        buildAttentionObservationCapabilityRequirementSetCompositionPolicySet({
          capability_requirement_set: requirementSet,
          specification,
        });
      const second =
        buildAttentionObservationCapabilityRequirementSetCompositionPolicySet({
          capability_requirement_set: requirementSet,
          specification,
        });
      assert.deepEqual(requirementSet, beforeSet);
      assert.deepEqual(specification, beforeSpec);
      assert.deepEqual(first, second);
    });
  });

  describe("PRESENT/null invariants / canonicalize", () => {
    it("PRESENT requires non-null policy; non-PRESENT requires null", () => {
      const present = buildSet([
        { candidate_key: "cand", composition_kind: ANY },
      ]);
      assert.notEqual(
        firstCandidate(present).capability_requirement_set_composition_policy,
        null
      );
      const absent = buildSet([]);
      assert.equal(
        firstCandidate(absent).capability_requirement_set_composition_policy,
        null
      );
    });

    it("canonicalize Requirement keys is order-stable", () => {
      assert.deepEqual(
        canonicalizeCapabilityRequirementKeys([REQ_KEY_2, REQ_KEY, REQ_KEY_3]),
        canonicalizeCapabilityRequirementKeys([REQ_KEY_3, REQ_KEY, REQ_KEY_2])
      );
    });

    it("canonical composition-kind order is ANY then ALL (serialization only)", () => {
      assert.deepEqual(
        CANONICAL_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_KIND_ORDER,
        [ANY, ALL]
      );
    });

    it("normalize rejects unknown composition kind", () => {
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementSetCompositionPolicySpecification(
            mockRequirementSet(),
            {
              policies: [
                {
                  candidate_key: "cand",
                  composition_kind:
                    "THRESHOLD" as AttentionObservationCapabilityRequirementSetCompositionPolicyKind,
                },
              ],
            }
          ),
        /Unknown/
      );
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("schema 0.1.24; 048-only runtime; no 061–075 / no Satisfaction execution", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-composition-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-composition-policy-types.ts"
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
        !/attention-observation-capability-requirement-satisfaction-interpretation/.test(
          core
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-evaluation-state/.test(
          core
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-dimension-aggregation/.test(
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
      assert.ok(!/"SATISFIED"/.test(core));
      assert.ok(!/"UNSATISFIED"/.test(core));
      assert.ok(!/CONDITION_HOLDS/.test(core));
      assert.ok(!/CONDITION_DOES_NOT_HOLD/.test(core));
      assert.ok(!/HAS_CAPABILITY/.test(core));
      assert.ok(!/satisfied_count/.test(core));
      assert.ok(!/unsatisfied_count/.test(core));
      assert.ok(!/unresolved_count/.test(core));
      assert.ok(!/PARTIALLY_SATISFIED/.test(types));
      assert.ok(!/"THRESHOLD"/.test(types));
      assert.ok(!/"READY"/.test(types));
      assert.ok(
        types.includes(
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED"
        )
      );
      assert.ok(
        types.includes(
          "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_SATISFACTION_SEMANTICS_NOT_MODELED"
        )
      );
      assert.deepEqual(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_MODEL_LIMITATIONS,
        [
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_SATISFACTION_SEMANTICS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_COMPOSITION_SEMANTICS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_THRESHOLD_COMPOSITION_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_WEIGHTED_COMPOSITION_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_MAJORITY_COMPOSITION_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_VETO_COMPOSITION_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_MANDATORY_GROUPS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_ALTERNATIVE_GROUPS_NOT_MODELED",
          "CAPABILITY_REQUIREMENT_SET_NESTED_BOOLEAN_COMPOSITION_NOT_MODELED",
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

    it("no .some() / .every() composition execution in core", () => {
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-set-composition-policy-core.ts"
        ),
        "utf8"
      );
      // hasAnyExplicitPolicy uses for-loop, not Array.some for composition
      assert.ok(!/\.some\(/.test(core));
      assert.ok(!/\.every\(/.test(core));
    });
  });
});
