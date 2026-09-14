/**
 * GROUND-073 — Observation Core XXVII / Explicit Capability Requirement
 * Satisfaction Interpretation Policy Foundation
 *
 * Pure 048 Capability Requirement + explicit Satisfaction Interpretation Policy
 * Specification (policy declaration only; no 072 current-state matching /
 * no SATISFIED/UNSATISFIED current result).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationCapabilityRequirementSatisfactionInterpretationPolicyKey,
  buildAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySet,
  buildCanonicalCapabilityRequirementSatisfactionInterpretationMappingSetKey,
  CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER,
  CANONICAL_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_ORDER,
  normalizeAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification,
  normalizeSatisfactionInterpretationMappings,
} from "../reality/attention-observation-capability-requirement-satisfaction-interpretation-policy-core.js";
import type {
  AttentionObservationCapabilityRequirementEvaluationState,
} from "../reality/attention-observation-capability-requirement-evaluation-state-types.js";
import type {
  AttentionObservationCapabilityRequirementSatisfactionInterpretation,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping,
} from "../reality/attention-observation-capability-requirement-satisfaction-interpretation-policy-types.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 = "attention-observation-capability-requirement|need|human_inspection";

const HOLDS =
  "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS" as const;
const DOES_NOT_HOLD =
  "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD" as const;
const UNRESOLVED_EVAL_POLICY =
  "UNRESOLVED_CAPABILITY_EVALUATION_DIMENSION_POLICY_NOT_DECLARED" as const;
const NO_REQUIRED =
  "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED" as const;
const UNRESOLVED_AGG_POLICY =
  "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_POLICY =
  "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_CONDITION =
  "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" as const;

function assertNoCurrentSatisfactionSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"ANY_UNRESOLVED_STATE"/.test(json));
  assert.ok(!/"ANY_STATE"/.test(json));
  assert.ok(!/"DEFAULT"/.test(json));
  assert.ok(!/"policy_complete"/.test(json));
  assert.ok(!/"coverage"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"current_state"/.test(json));
  assert.ok(!/"evaluation_state_basis"/.test(json));
}

function mockRequirementSet(
  requirements: { key: string; semantic: string }[] = [
    { key: REQ_KEY, semantic: "inspect" },
  ]
): AttentionObservationCapabilityRequirementSetAssessment {
  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: [
      {
        candidate_key: "cand",
        planning: {} as never,
        status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT",
        capability_requirement_basis: {
          observation_need_key: NEED_KEY,
          requirements: requirements.map((r) => ({
            key: r.key,
            observation_need_key: NEED_KEY,
            capability_semantic_key: r.semantic,
          })),
        },
        has_explicit_capability_requirements: true,
        model_limitations: [],
      },
    ],
    has_explicit_capability_requirements: true,
    model_limitations: [],
  };
}

function mapping(
  evaluation_state: AttentionObservationCapabilityRequirementEvaluationState,
  interpretation: AttentionObservationCapabilityRequirementSatisfactionInterpretation
): AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping {
  return { evaluation_state, interpretation };
}

function buildSet(
  policies: {
    capability_requirement_key: string;
    mappings: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[];
  }[],
  requirementSet: AttentionObservationCapabilityRequirementSetAssessment = mockRequirementSet()
) {
  return buildAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySet(
    {
      capability_requirement_set: requirementSet,
      specification: { policies },
    }
  );
}

function firstPolicy(
  set: ReturnType<typeof buildSet>
) {
  return set.candidate_assessments[0]!
    .requirement_satisfaction_interpretation_policy_assessments[0]!;
}

describe("GROUND-073 Satisfaction Interpretation Policy", () => {
  describe("baseline mappings", () => {
    it("HOLDS → INTERPRET_AS_SATISFIED policy PRESENT; no current Satisfaction", () => {
      const set = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
        },
      ]);
      const assessment = firstPolicy(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT"
      );
      assert.notEqual(assessment.satisfaction_interpretation_policy, null);
      assert.deepEqual(assessment.satisfaction_interpretation_policy!.mappings, [
        mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
      ]);
      assertNoCurrentSatisfactionSemantics(set);
    });

    it("DOES_NOT_HOLD → INTERPRET_AS_UNSATISFIED valid", () => {
      const set = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: [mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED")],
        },
      ]);
      assert.equal(
        firstPolicy(set).satisfaction_interpretation_policy!.mappings[0]!
          .interpretation,
        "INTERPRET_AS_UNSATISFIED"
      );
      assertNoCurrentSatisfactionSemantics(set);
    });

    it("typical two-mapping policy; no implied second mapping from single", () => {
      const two = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: [
            mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
            mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED"),
          ],
        },
      ]);
      assert.equal(
        firstPolicy(two).satisfaction_interpretation_policy!.mappings.length,
        2
      );

      const one = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
        },
      ]);
      assert.equal(
        firstPolicy(one).satisfaction_interpretation_policy!.mappings.length,
        1
      );
      assert.equal(
        firstPolicy(one).satisfaction_interpretation_policy!.mappings[0]!
          .evaluation_state,
        HOLDS
      );
    });
  });

  describe("explicit permissiveness for all seven states", () => {
    const allStates = CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER;

    for (const state of allStates) {
      it(`${state} → INTERPRET_AS_SATISFIED allowed`, () => {
        const set = buildSet([
          {
            capability_requirement_key: REQ_KEY,
            mappings: [mapping(state, "INTERPRET_AS_SATISFIED")],
          },
        ]);
        assert.equal(
          firstPolicy(set).status,
          "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT"
        );
      });

      it(`${state} → INTERPRET_AS_UNSATISFIED allowed`, () => {
        const set = buildSet([
          {
            capability_requirement_key: REQ_KEY,
            mappings: [mapping(state, "INTERPRET_AS_UNSATISFIED")],
          },
        ]);
        assert.equal(
          firstPolicy(set).status,
          "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT"
        );
      });
    }

    it("all seven states mapped is valid", () => {
      const set = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: allStates.map((s, i) =>
            mapping(
              s,
              i % 2 === 0
                ? "INTERPRET_AS_SATISFIED"
                : "INTERPRET_AS_UNSATISFIED"
            )
          ),
        },
      ]);
      assert.equal(
        firstPolicy(set).satisfaction_interpretation_policy!.mappings.length,
        7
      );
      assertNoCurrentSatisfactionSemantics(set);
    });
  });

  describe("defaults / empty / absence", () => {
    it("no default HOLDS/DOES_NOT_HOLD/unresolved/zero-Dimension mappings when absent", () => {
      const set = buildSet([]);
      assert.equal(
        firstPolicy(set).status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(firstPolicy(set).satisfaction_interpretation_policy, null);
      assert.equal(
        set.has_explicit_capability_requirement_satisfaction_interpretation_policies,
        false
      );
    });

    it("explicit empty policy PRESENT and distinct from absence", () => {
      const empty = buildSet([
        { capability_requirement_key: REQ_KEY, mappings: [] },
      ]);
      assert.equal(
        firstPolicy(empty).status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT"
      );
      assert.deepEqual(
        firstPolicy(empty).satisfaction_interpretation_policy!.mappings,
        []
      );
      assert.ok(
        firstPolicy(empty).satisfaction_interpretation_policy!.key.includes(
          "EMPTY_MAPPING_SET"
        )
      );

      const absent = buildSet([]);
      assert.notEqual(firstPolicy(empty).status, firstPolicy(absent).status);
      assertNoCurrentSatisfactionSemantics(empty);
    });
  });

  describe("normalize / conflict / identity", () => {
    it("exact duplicate mapping normalizes; reorder same key", () => {
      const a = normalizeSatisfactionInterpretationMappings([
        mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
        mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
        mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED"),
      ]);
      assert.equal(a.length, 2);

      const key1 =
        attentionObservationCapabilityRequirementSatisfactionInterpretationPolicyKey(
          REQ_KEY,
          [mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED"), mapping(HOLDS, "INTERPRET_AS_SATISFIED")]
        );
      const key2 =
        attentionObservationCapabilityRequirementSatisfactionInterpretationPolicyKey(
          REQ_KEY,
          [mapping(HOLDS, "INTERPRET_AS_SATISFIED"), mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED")]
        );
      assert.equal(key1, key2);
    });

    it("conflicting mapping for same state rejects", () => {
      assert.throws(
        () =>
          normalizeSatisfactionInterpretationMappings([
            mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
            mapping(HOLDS, "INTERPRET_AS_UNSATISFIED"),
          ]),
        /Conflicting/
      );
    });

    it("exact duplicate policy normalizes; different mapping set rejects; no merge", () => {
      const reqSet = mockRequirementSet();
      const normalized =
        normalizeAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification(
          reqSet,
          {
            policies: [
              {
                capability_requirement_key: REQ_KEY,
                mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
              },
              {
                capability_requirement_key: REQ_KEY,
                mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
              },
            ],
          }
        );
      assert.equal(normalized.policies.length, 1);

      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification(
            reqSet,
            {
              policies: [
                {
                  capability_requirement_key: REQ_KEY,
                  mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
                },
                {
                  capability_requirement_key: REQ_KEY,
                  mappings: [mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED")],
                },
              ],
            }
          ),
        /Multiple Capability Requirement Satisfaction Interpretation Policies/
      );
    });

    it("specification reorder deepEqual; policy identity changes with interpretation", () => {
      const a = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: [
            mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED"),
            mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
          ],
        },
      ]);
      const b = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: [
            mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
            mapping(DOES_NOT_HOLD, "INTERPRET_AS_UNSATISFIED"),
          ],
        },
      ]);
      assert.deepEqual(a, b);

      const holdsSat = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
        },
      ]);
      const holdsUnsat = buildSet([
        {
          capability_requirement_key: REQ_KEY,
          mappings: [mapping(HOLDS, "INTERPRET_AS_UNSATISFIED")],
        },
      ]);
      assert.notEqual(
        firstPolicy(holdsSat).satisfaction_interpretation_policy!.key,
        firstPolicy(holdsUnsat).satisfaction_interpretation_policy!.key
      );
    });

    it("unknown Requirement rejects", () => {
      assert.throws(
        () =>
          buildSet([
            {
              capability_requirement_key: "unknown-req",
              mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
            },
          ]),
        /not found in explicit capability requirement set/
      );
    });

    it("unknown Evaluation State rejects", () => {
      assert.throws(
        () =>
          normalizeSatisfactionInterpretationMappings([
            {
              evaluation_state: "NOT_A_REAL_STATE" as never,
              interpretation: "INTERPRET_AS_SATISFIED",
            },
          ]),
        /Unknown Capability Requirement Evaluation State/
      );
    });

    it("unknown interpretation rejects", () => {
      assert.throws(
        () =>
          normalizeSatisfactionInterpretationMappings([
            {
              evaluation_state: HOLDS,
              interpretation: "INTERPRET_AS_PARTIALLY_SATISFIED" as never,
            },
          ]),
        /Unknown Capability Requirement Satisfaction Interpretation/
      );
    });

    it("empty mapping set key is stable EMPTY_MAPPING_SET", () => {
      assert.equal(
        buildCanonicalCapabilityRequirementSatisfactionInterpretationMappingSetKey(
          []
        ),
        "EMPTY_MAPPING_SET"
      );
    });
  });

  describe("candidate / mixed / set", () => {
    it("mixed full / empty / absent coexistence", () => {
      const reqSet = mockRequirementSet([
        { key: REQ_KEY, semantic: "inspect" },
        { key: REQ_KEY_2, semantic: "human_inspection" },
        {
          key: "attention-observation-capability-requirement|need|other",
          semantic: "other",
        },
      ]);
      const set = buildSet(
        [
          {
            capability_requirement_key: REQ_KEY,
            mappings: [mapping(HOLDS, "INTERPRET_AS_SATISFIED")],
          },
          {
            capability_requirement_key: REQ_KEY_2,
            mappings: [],
          },
        ],
        reqSet
      );
      const assessments =
        set.candidate_assessments[0]!
          .requirement_satisfaction_interpretation_policy_assessments;
      assert.equal(assessments.length, 3);
      assert.equal(
        assessments[0]!.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(
        assessments[1]!.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(assessments[1]!.satisfaction_interpretation_policy!.mappings.length, 0);
      assert.equal(
        assessments[2]!.status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        set.has_explicit_capability_requirement_satisfaction_interpretation_policies,
        true
      );
    });

    it("no planning / no requirements candidate statuses", () => {
      const noPlan =
        buildAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySet(
          {
            capability_requirement_set: {
              planning_set: {} as never,
              specification: { requirements: [] },
              candidate_requirements: [
                {
                  candidate_key: "cand",
                  planning: {} as never,
                  status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
                  capability_requirement_basis: null,
                  has_explicit_capability_requirements: false,
                  model_limitations: [],
                },
              ],
              has_explicit_capability_requirements: false,
              model_limitations: [],
            },
            specification: { policies: [] },
          }
        );
      assert.equal(
        noPlan.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });
  });

  describe("determinism / immutability / deep-clone", () => {
    it("repeated calls deepEqual; deep-cloned input same output", () => {
      const input = {
        capability_requirement_set: mockRequirementSet(),
        specification: {
          policies: [
            {
              capability_requirement_key: REQ_KEY,
              mappings: [
                mapping(NO_REQUIRED, "INTERPRET_AS_SATISFIED"),
                mapping(HOLDS, "INTERPRET_AS_SATISFIED"),
              ],
            },
          ],
        },
      };
      const a =
        buildAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySet(
          input
        );
      const b =
        buildAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySet(
          input
        );
      assert.deepEqual(a, b);

      const cloned = JSON.parse(JSON.stringify(input));
      const rebuilt =
        buildAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySet(
          cloned
        );
      assert.deepEqual(
        rebuilt.candidate_assessments[0]!
          .requirement_satisfaction_interpretation_policy_assessments[0]!
          .satisfaction_interpretation_policy,
        a.candidate_assessments[0]!
          .requirement_satisfaction_interpretation_policy_assessments[0]!
          .satisfaction_interpretation_policy
      );
      assert.notEqual(
        rebuilt.capability_requirement_set,
        a.capability_requirement_set
      );
    });

    it("048 set and specification immutability", () => {
      const capability_requirement_set = mockRequirementSet();
      const specification = {
        policies: [
          {
            capability_requirement_key: REQ_KEY,
            mappings: [mapping(UNRESOLVED_AGG_POLICY, "INTERPRET_AS_UNSATISFIED")],
          },
        ],
      };
      const before048 = JSON.stringify(capability_requirement_set);
      const beforeSpec = JSON.stringify(specification);
      buildAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySet(
        { capability_requirement_set, specification }
      );
      assert.equal(JSON.stringify(capability_requirement_set), before048);
      assert.equal(JSON.stringify(specification), beforeSpec);
    });
  });

  describe("model limitations / static proofs", () => {
    it("fixed model limitation and canonical orders", () => {
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
        "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_EVALUATION_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
      assert.equal(CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER.length, 7);
      assert.deepEqual(
        CANONICAL_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_ORDER,
        ["INTERPRET_AS_SATISFIED", "INTERPRET_AS_UNSATISFIED"]
      );
      assert.ok(
        CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER.includes(
          UNRESOLVED_EVAL_POLICY
        )
      );
      assert.ok(
        CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER.includes(
          UNRESOLVED_READINESS_POLICY
        )
      );
      assert.ok(
        CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER.includes(
          UNRESOLVED_READINESS_CONDITION
        )
      );
    });

    it("schema 0.1.24; 048-only runtime; type-only 072; no current-state matching", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-satisfaction-interpretation-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-satisfaction-interpretation-policy-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_requirement_set/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));

      assert.ok(
        /import type \{[\s\S]*AttentionObservationCapabilityRequirementEvaluationState/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*requirement-evaluation-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-result/.test(src)
      );
      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-readiness/.test(src)
      );
      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-policy/.test(src)
      );
      assert.ok(
        !/from ["'].*evaluation-dimension-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*required-dimension-evaluation-state/.test(src)
      );

      assert.ok(!/evaluation_state_basis/.test(core));
      assert.ok(!/current_state/.test(core));
      assert.ok(!/aggregation_result_basis/.test(core));
      assert.ok(!/readiness_basis/.test(core));
      assert.ok(!/\.find\(/.test(core));
      assert.ok(!/"SATISFIED"/.test(core));
      assert.ok(!/"UNSATISFIED"/.test(core));
      assert.ok(!/ANY_UNRESOLVED_STATE/.test(core));
      assert.ok(!/INTERPRET_AS_PARTIALLY_SATISFIED/.test(core));
    });
  });
});
