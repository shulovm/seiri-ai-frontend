/**
 * GROUND-104 — Observation Core LVIII / Explicit Permission Dimension
 * Evaluation State Interpretation Policy Foundation
 *
 * Pure 084 Dimension Policy + explicit interpretation-policy specification
 * (declarative only; no current 103; no Satisfaction).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_ORDER,
  CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_ORDER,
  EMPTY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET,
  assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy,
  attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyKey,
  buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySet,
  buildCanonicalPermissionDimensionEvaluationStateInterpretationMappingSetKey,
  canonicalizePermissionDimensionEvaluationStateInterpretationMappings,
  normalizeAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";

const HOLDS =
  "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS" as const;
const DOES_NOT_HOLD =
  "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_POLICY =
  "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_CONDITION =
  "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" as const;

const AS_SATISFIED =
  "INTERPRET_AS_PERMISSION_DIMENSION_SATISFIED" as const;
const AS_UNSATISFIED =
  "INTERPRET_AS_PERMISSION_DIMENSION_UNSATISFIED" as const;

function mapping(
  state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
  interpretation: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping {
  return {
    permission_dimension_evaluation_state: state,
    interpretation,
  };
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PERMISSION_DIMENSION_SATISFIED"/.test(json));
  assert.ok(!/"PERMISSION_DIMENSION_UNSATISFIED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"permission_dimension_evaluation_state_basis"/.test(json));
  assert.ok(!/"DEFAULT"/.test(json));
  assert.ok(!/"ALL_RESOLVED_STATES"/.test(json));
}

function mockPolicy(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
    | "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  required_dimensions?: AttentionObservationOperationalEligibilityDimension[];
  policy_key?: string;
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  const required_dimensions = options?.required_dimensions ?? [
    "CAPABILITY_STATE",
    "PERMISSION",
  ];
  const policy: AttentionObservationOperationalEligibilityDimensionPolicy | null =
    present
      ? {
          key: options?.policy_key ?? POLICY_KEY,
          candidate_key: options?.candidate_key ?? CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          capability_requirement_keys: ["req"],
          required_dimensions,
        }
      : null;

  return {
    candidate_key: options?.candidate_key ?? CAND,
    capability_requirement_assessment: {} as never,
    status,
    operational_eligibility_dimension_policy: policy,
    model_limitations: [],
  };
}

function buildSet(
  policy = mockPolicy(),
  policies: {
    candidate_key: string;
    mappings: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[];
  }[] = [{ candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] }]
) {
  return buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySet(
    {
      operational_eligibility_dimension_policy_set: {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [policy],
        has_explicit_operational_eligibility_dimension_policies:
          policy.operational_eligibility_dimension_policy !== null,
        model_limitations: [],
      },
      specification: { policies },
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

describe("GROUND-104 Explicit Permission Dimension Evaluation State Interpretation Policy", () => {
  describe("mapping vocabulary and unusual mappings", () => {
    it("conventional HOLDS → SATISFIED interpretation; no current Satisfaction", () => {
      const set = buildSet(mockPolicy(), [
        { candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] },
      ]);
      const policy =
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!;
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT"
      );
      assert.deepEqual(policy.mappings, [mapping(HOLDS, AS_SATISFIED)]);
      assertNoForbiddenSemantics(set);
    });

    it("conventional DOES_NOT_HOLD → UNSATISFIED interpretation", () => {
      const set = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          mappings: [mapping(DOES_NOT_HOLD, AS_UNSATISFIED)],
        },
      ]);
      assert.deepEqual(
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!
          .mappings,
        [mapping(DOES_NOT_HOLD, AS_UNSATISFIED)]
      );
    });

    it("reverse HOLDS → UNSATISFIED and DOES_NOT_HOLD → SATISFIED allowed", () => {
      const set = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          mappings: [
            mapping(HOLDS, AS_UNSATISFIED),
            mapping(DOES_NOT_HOLD, AS_SATISFIED),
          ],
        },
      ]);
      assert.deepEqual(
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!
          .mappings,
        [
          mapping(HOLDS, AS_UNSATISFIED),
          mapping(DOES_NOT_HOLD, AS_SATISFIED),
        ]
      );
    });

    it("unresolved states may map either way; all five mappable", () => {
      const mappings = [
        mapping(HOLDS, AS_SATISFIED),
        mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
        mapping(UNRESOLVED_POLICY, AS_SATISFIED),
        mapping(UNRESOLVED_READINESS_POLICY, AS_UNSATISFIED),
        mapping(UNRESOLVED_READINESS_CONDITION, AS_SATISFIED),
      ];
      const set = buildSet(mockPolicy(), [
        { candidate_key: CAND, mappings },
      ]);
      assert.deepEqual(
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!
          .mappings,
        canonicalizePermissionDimensionEvaluationStateInterpretationMappings(
          mappings
        )
      );
      assert.deepEqual(
        CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_ORDER,
        [
          HOLDS,
          DOES_NOT_HOLD,
          UNRESOLVED_POLICY,
          UNRESOLVED_READINESS_POLICY,
          UNRESOLVED_READINESS_CONDITION,
        ]
      );
      assert.deepEqual(
        CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_ORDER,
        [AS_SATISFIED, AS_UNSATISFIED]
      );
    });

    it("partial and single mapping valid", () => {
      assert.equal(
        buildSet(mockPolicy(), [
          {
            candidate_key: CAND,
            mappings: [
              mapping(HOLDS, AS_SATISFIED),
              mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
            ],
          },
        ]).candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!
          .mappings.length,
        2
      );
      assert.equal(
        buildSet(mockPolicy(), [
          { candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] },
        ]).candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!
          .mappings.length,
        1
      );
    });
  });

  describe("empty / absence / uniqueness / identity", () => {
    it("explicit empty mapping set → PRESENT; != absence", () => {
      const empty = buildSet(mockPolicy(), [
        { candidate_key: CAND, mappings: [] },
      ]);
      assert.equal(
        empty.candidate_assessments[0]!.status,
        "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(
        empty.candidate_assessments[0]!
          .has_explicit_permission_dimension_evaluation_state_interpretation_policy,
        true
      );
      assert.deepEqual(
        empty.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!
          .mappings,
        []
      );
      assert.ok(
        empty.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!.key.includes(
          EMPTY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET
        )
      );

      const absent = buildSet(mockPolicy(), []);
      assert.equal(
        absent.candidate_assessments[0]!.status,
        "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        absent.candidate_assessments[0]!
          .has_explicit_permission_dimension_evaluation_state_interpretation_policy,
        false
      );
      assert.equal(
        absent.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy,
        null
      );
    });

    it("duplicate same mapping normalizes; conflict rejects; order invariant", () => {
      const dup = canonicalizePermissionDimensionEvaluationStateInterpretationMappings(
        [
          mapping(HOLDS, AS_SATISFIED),
          mapping(HOLDS, AS_SATISFIED),
          mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
        ]
      );
      assert.deepEqual(dup, [
        mapping(HOLDS, AS_SATISFIED),
        mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
      ]);

      assert.throws(
        () =>
          canonicalizePermissionDimensionEvaluationStateInterpretationMappings([
            mapping(HOLDS, AS_SATISFIED),
            mapping(HOLDS, AS_UNSATISFIED),
          ]),
        /Conflicting/
      );

      const a = buildCanonicalPermissionDimensionEvaluationStateInterpretationMappingSetKey(
        [
          mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
          mapping(HOLDS, AS_SATISFIED),
        ]
      );
      const b = buildCanonicalPermissionDimensionEvaluationStateInterpretationMappingSetKey(
        [
          mapping(HOLDS, AS_SATISFIED),
          mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
        ]
      );
      assert.equal(a, b);

      const setA = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          mappings: [
            mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
            mapping(HOLDS, AS_SATISFIED),
          ],
        },
      ]);
      const setB = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          mappings: [
            mapping(HOLDS, AS_SATISFIED),
            mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
          ],
        },
      ]);
      assert.equal(
        setA.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!.key,
        setB.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_policy!.key
      );
    });

    it("exact duplicate policy normalizes; different mapping sets reject; no merge", () => {
      const policySet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [mockPolicy()],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };

      const normalized =
        normalizeAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification(
          policySet,
          {
            policies: [
              {
                candidate_key: CAND,
                mappings: [mapping(HOLDS, AS_SATISFIED)],
              },
              {
                candidate_key: CAND,
                mappings: [mapping(HOLDS, AS_SATISFIED)],
              },
            ],
          }
        );
      assert.equal(normalized.policies.length, 1);

      assert.throws(
        () =>
          normalizeAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification(
            policySet,
            {
              policies: [
                {
                  candidate_key: CAND,
                  mappings: [mapping(HOLDS, AS_SATISFIED)],
                },
                {
                  candidate_key: CAND,
                  mappings: [mapping(DOES_NOT_HOLD, AS_UNSATISFIED)],
                },
              ],
            }
          ),
        /Conflicting Permission Dimension Evaluation State Interpretation Policies/
      );
    });

    it("mapping-set / interpretation-target / 084 policy change identity", () => {
      const base = buildSet(mockPolicy(), [
        { candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] },
      ]).candidate_assessments[0]!
        .permission_dimension_evaluation_state_interpretation_policy!.key;

      const changedSet = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          mappings: [
            mapping(HOLDS, AS_SATISFIED),
            mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
          ],
        },
      ]).candidate_assessments[0]!
        .permission_dimension_evaluation_state_interpretation_policy!.key;
      assert.notEqual(base, changedSet);

      const changedTarget = buildSet(mockPolicy(), [
        { candidate_key: CAND, mappings: [mapping(HOLDS, AS_UNSATISFIED)] },
      ]).candidate_assessments[0]!
        .permission_dimension_evaluation_state_interpretation_policy!.key;
      assert.notEqual(base, changedTarget);

      const changed084 = buildSet(
        mockPolicy({ policy_key: "084-oe-dimension-policy|cand|alt" }),
        [{ candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] }]
      ).candidate_assessments[0]!
        .permission_dimension_evaluation_state_interpretation_policy!.key;
      assert.notEqual(base, changed084);

      const rebuilt =
        attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            mappings: [mapping(HOLDS, AS_SATISFIED)],
          }
        );
      assert.equal(base, rebuilt);
    });
  });

  describe("outer / invalid targets", () => {
    it("no planning / no Requirements / no OE / not required / empty 084", () => {
      assert.equal(
        buildSet(
          mockPolicy({ status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" }),
          []
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        buildSet(
          mockPolicy({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          }),
          []
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        buildSet(
          mockPolicy({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          []
        ).candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        buildSet(
          mockPolicy({ required_dimensions: ["CAPABILITY_STATE"] }),
          []
        ).candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        buildSet(mockPolicy({ required_dimensions: [] }), []).candidate_assessments[0]!
          .status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
    });

    it("specification targeting non-required / no-policy / unknown / ambiguous rejects", () => {
      assert.throws(
        () =>
          buildSet(
            mockPolicy({ required_dimensions: ["CAPABILITY_STATE"] }),
            [{ candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] }]
          ),
        /PERMISSION to be explicitly required/
      );

      assert.throws(
        () =>
          buildSet(
            mockPolicy({
              status:
                "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
            }),
            [{ candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] }]
          ),
        /requires an explicit Operational Eligibility Dimension Policy/
      );

      assert.throws(
        () =>
          buildSet(mockPolicy(), [
            {
              candidate_key: "unknown",
              mappings: [mapping(HOLDS, AS_SATISFIED)],
            },
          ]),
        /not found/
      );

      assert.throws(
        () =>
          normalizeAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification(
            {
              capability_requirement_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [
                mockPolicy(),
                mockPolicy({ policy_key: "084-other" }),
              ],
              has_explicit_operational_eligibility_dimension_policies: true,
              model_limitations: [],
            },
            {
              policies: [
                {
                  candidate_key: CAND,
                  mappings: [mapping(HOLDS, AS_SATISFIED)],
                },
              ],
            }
          ),
        /Ambiguous/
      );
    });
  });

  describe("immutability / determinism / assess API", () => {
    it("input immutability + deep-cloned same output + determinism", () => {
      const input = {
        operational_eligibility_dimension_policy_set: {
          capability_requirement_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [mockPolicy()],
          has_explicit_operational_eligibility_dimension_policies: true,
          model_limitations: [],
        },
        specification: {
          policies: [
            {
              candidate_key: CAND,
              mappings: [
                mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
                mapping(HOLDS, AS_SATISFIED),
              ],
            },
          ],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySet(
          deepClone(input)
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySet(
          input
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
      assert.equal(
        a.has_explicit_permission_dimension_evaluation_state_interpretation_policies,
        true
      );
    });

    it("assess helper exposes candidate-level API", () => {
      const normalized =
        normalizeAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification(
          {
            capability_requirement_set: {} as never,
            specification: { policies: [] },
            candidate_assessments: [mockPolicy()],
            has_explicit_operational_eligibility_dimension_policies: true,
            model_limitations: [],
          },
          {
            policies: [
              {
                candidate_key: CAND,
                mappings: [mapping(HOLDS, AS_SATISFIED)],
              },
            ],
          }
        );
      const assessment =
        assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy(
          mockPolicy(),
          normalized
        );
      assert.equal(
        assessment.status,
        "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT"
      );
    });
  });

  describe("static / architectural boundaries", () => {
    it("schema 0.1.24; 084+spec only; type-only 103; no current 103/Satisfaction", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_NOT_MODELED"
      );

      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-types.ts"
      );
      const coreCode = stripComments(readFileSync(corePath, "utf8"));
      const typesCode = stripComments(readFileSync(typesPath, "utf8"));
      const src = coreCode + "\n" + typesCode;

      assert.ok(
        /permission-dimension-evaluation-state-types\.js/.test(coreCode)
      );
      assert.ok(
        !/permission-dimension-evaluation-state-core/.test(src)
      );
      assert.ok(!/permission-source-aggregation-result/.test(src));
      assert.ok(!/permission-source-aggregation-readiness/.test(src));
      assert.ok(!/permission-source-acceptance-match/.test(src));
      assert.ok(!/permission-source-resolution-classification/.test(src));
      assert.ok(!/permission-required-dimension-coverage/.test(src));
      assert.ok(!/permission-state-source-core/.test(src));
      assert.ok(!/from ["'].*state-engine/.test(src));
      assert.ok(!/from ["'].*file-store/.test(src));
      assert.ok(!/ProjectState/.test(src));
      assert.ok(!/applyPatch/.test(src));
      assert.ok(!/saveProject/.test(src));
      assert.ok(!/Date\.now\(/.test(src));
      assert.ok(!/new Date\(/.test(src));
      assert.ok(!/performance\.now\(/.test(src));
      assert.ok(!/"PERMISSION_DIMENSION_SATISFIED"/.test(src));
      assert.ok(!/"PERMISSION_DIMENSION_UNSATISFIED"/.test(src));
      assert.ok(!/OPERATIONALLY_ELIGIBLE/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/effective_permission/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(coreCode));
      assert.ok(!/ALL_RESOLVED_STATES/.test(src));
      assert.ok(!/otherwise/.test(coreCode));
      assert.ok(!/HOLDS.*SATISFIED.*default/.test(coreCode));
    });
  });
});
