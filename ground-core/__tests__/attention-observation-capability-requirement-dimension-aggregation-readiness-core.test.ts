/**
 * GROUND-070 — Observation Core XXIV / Capability Requirement Dimension
 * Aggregation Readiness Basis
 *
 * Pure 067 Evaluation States + 069 Readiness Policy
 * (readiness-policy-condition HOLDS / DOES_NOT_HOLD only;
 * no READY/NOT_READY / 068 aggregation / Requirement Satisfaction).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_MODEL_LIMITATIONS,
  assertCompatibleCapabilityRequirementDimensionAggregationReadinessContexts,
  assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadiness,
  attentionObservationCapabilityRequirementDimensionAggregationReadinessKey,
  buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessSet,
  isResolvedCapabilityRequiredDimensionEvaluationState,
} from "../reality/attention-observation-capability-requirement-dimension-aggregation-readiness-core.js";
import type {
  AttentionObservationCapabilityRequiredDimensionEvaluationState,
} from "../reality/attention-observation-capability-required-dimension-evaluation-state-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "../reality/attention-observation-capability-evaluation-dimension-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const READINESS_KIND =
  "REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION" as const;

const REQ_KEY = "req";
const NEED_KEY = "need";
const EVAL_POLICY_KEY = "eval-policy-key";
const READINESS_POLICY_KEY = "readiness-policy-key";

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_READY"/.test(json));
  assert.ok(!/"unresolved_count"/.test(json));
  assert.ok(!/"resolved_count"/.test(json));
  assert.ok(!/"has_ready_requirement"/.test(json));
  assert.ok(!/"all_requirements_ready"/.test(json));
  assert.ok(!/"REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

function mockEvalStateBasis(
  dimension: AttentionObservationCapabilityEvaluationDimension,
  state: AttentionObservationCapabilityRequiredDimensionEvaluationState
) {
  return {
    key: `state|${REQ_KEY}|${dimension}|${state}`,
    capability_requirement_key: REQ_KEY,
    observation_need_key: NEED_KEY,
    required_dimension: dimension,
    state,
    source_aggregation_outcome_basis_key:
      state === "SOURCE_AGGREGATION_CONDITION_HOLDS" ||
      state === "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
        ? `outcome|${dimension}`
        : null,
  };
}

function mockEvalAssessment(
  dimension: AttentionObservationCapabilityEvaluationDimension,
  state: AttentionObservationCapabilityRequiredDimensionEvaluationState
) {
  return {
    required_dimension: dimension,
    source_aggregation_assessment: {} as never,
    evaluation_state_basis: mockEvalStateBasis(dimension, state),
  };
}

function mockEvalRequirementAssessment(
  dimensionStates: {
    dimension: AttentionObservationCapabilityEvaluationDimension;
    state: AttentionObservationCapabilityRequiredDimensionEvaluationState;
  }[]
) {
  return {
    capability_requirement: {
      key: REQ_KEY,
      observation_need_key: NEED_KEY,
      capability_semantic_key: "inspect",
    } as never,
    dimension_source_aggregation_assessment: {} as never,
    required_dimension_evaluation_assessments: dimensionStates.map((d) =>
      mockEvalAssessment(d.dimension, d.state)
    ),
    has_capability_required_dimension_evaluation_states:
      dimensionStates.length > 0,
  };
}

function mockReadinessPolicyAssessment(options: {
  status:
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
    | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
    | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED"
    | "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT";
  requiredDimensions?: AttentionObservationCapabilityEvaluationDimension[];
}) {
  const requiredDimensions = options.requiredDimensions ?? [
    "CAPABILITY_AVAILABILITY_REPRESENTATION",
    "CAPABILITY_VERIFICATION_REPRESENTATION",
  ];
  const policyPresent =
    options.status ===
    "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT";
  const evalPolicyPresent =
    options.status !==
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY";

  return {
    capability_requirement: {
      key: REQ_KEY,
      observation_need_key: NEED_KEY,
      capability_semantic_key: "inspect",
    } as never,
    evaluation_dimension_policy_assessment: {
      capability_requirement: {
        key: REQ_KEY,
        observation_need_key: NEED_KEY,
        capability_semantic_key: "inspect",
      } as never,
      status: evalPolicyPresent
        ? ("EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT" as const)
        : ("NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED" as const),
      evaluation_dimension_policy_basis: {
        capability_requirement: {
          key: REQ_KEY,
          observation_need_key: NEED_KEY,
          capability_semantic_key: "inspect",
        } as never,
        evaluation_dimension_policy: evalPolicyPresent
          ? {
              key: EVAL_POLICY_KEY,
              capability_requirement_key: REQ_KEY,
              observation_need_key: NEED_KEY,
              capability_semantic_key: "inspect" as const,
              required_dimensions:
                options.status ===
                "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
                  ? ([] as AttentionObservationCapabilityEvaluationDimension[])
                  : [...requiredDimensions],
            }
          : null,
      },
    },
    status: options.status,
    requirement_dimension_aggregation_readiness_policy: policyPresent
      ? {
          key: READINESS_POLICY_KEY,
          capability_requirement_key: REQ_KEY,
          observation_need_key: NEED_KEY,
          capability_semantic_key: "inspect" as const,
          evaluation_dimension_policy_key: EVAL_POLICY_KEY,
          readiness_kind: READINESS_KIND,
        }
      : null,
  };
}

function mockEvalCandidate(requirementAssessment: ReturnType<typeof mockEvalRequirementAssessment>) {
  return {
    candidate_key: "cand",
    dimension_source_aggregation_outcome_assessment: {} as never,
    status: "CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATES_PRESENT" as const,
    requirement_dimension_evaluation_state_assessments: [requirementAssessment],
    has_capability_required_dimension_evaluation_states: true,
    model_limitations: [],
  };
}

function mockPolicyCandidate(
  policyAssessment: ReturnType<typeof mockReadinessPolicyAssessment>
) {
  return {
    candidate_key: "cand",
    evaluation_dimension_policy_assessment: {} as never,
    status:
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICIES_PRESENT" as const,
    requirement_dimension_aggregation_readiness_policy_assessments: [
      policyAssessment,
    ],
    has_explicit_capability_requirement_dimension_aggregation_readiness_policies:
      policyAssessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT",
    model_limitations: [],
  };
}

function buildSet(
  dimensionStates: {
    dimension: AttentionObservationCapabilityEvaluationDimension;
    state: AttentionObservationCapabilityRequiredDimensionEvaluationState;
  }[],
  policyStatus:
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
    | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
    | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED"
    | "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT" = "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT"
) {
  const dimensions = dimensionStates.map((d) => d.dimension);
  const evalCandidate = mockEvalCandidate(
    mockEvalRequirementAssessment(dimensionStates)
  );
  const policyCandidate = mockPolicyCandidate(
    mockReadinessPolicyAssessment({
      status: policyStatus,
      requiredDimensions:
        policyStatus === "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
          ? []
          : dimensions.length > 0
            ? dimensions
            : ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
    })
  );

  return buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessSet(
    {
      capability_required_dimension_evaluation_state_set: {
        capability_dimension_source_aggregation_outcome_set: {} as never,
        candidate_assessments: [evalCandidate],
        has_capability_required_dimension_evaluation_states: true,
        model_limitations: [],
      },
      capability_requirement_dimension_aggregation_readiness_policy_set: {
        capability_evaluation_dimension_policy_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [policyCandidate],
        has_explicit_capability_requirement_dimension_aggregation_readiness_policies:
          policyCandidate.has_explicit_capability_requirement_dimension_aggregation_readiness_policies,
        model_limitations: [],
      },
    }
  );
}

describe("Attention Observation Capability Requirement Dimension Aggregation Readiness Basis (GROUND-070)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 067+069 only; no 068 / READY / aggregation execution", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-dimension-aggregation-readiness-core.ts"
        ),
        "utf8"
      );
      assert.ok(
        /capability_required_dimension_evaluation_state_set/.test(core)
      );
      assert.ok(
        /capability_requirement_dimension_aggregation_readiness_policy_set/.test(
          core
        )
      );
      assert.ok(
        /REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-policy-core/.test(core)
      );
      assert.ok(
        !/from ["'].*dimension-source-aggregation-outcome-core/.test(core)
      );
      assert.ok(
        !/from ["'].*dimension-source-aggregation-policy-core/.test(core)
      );
      assert.ok(!/ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION/.test(core));
      assert.ok(!/ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION/.test(core));
      assert.ok(!/"READY"/.test(core));
      assert.ok(!/"NOT_READY"/.test(core));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_MODEL_LIMITATIONS.includes(
          "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED"
        )
      );
    });
  });

  describe("resolved classifier", () => {
    it("HOLDS and DOES_NOT_HOLD are resolved; all UNRESOLVED are unresolved", () => {
      assert.equal(
        isResolvedCapabilityRequiredDimensionEvaluationState(
          "SOURCE_AGGREGATION_CONDITION_HOLDS"
        ),
        true
      );
      assert.equal(
        isResolvedCapabilityRequiredDimensionEvaluationState(
          "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
        ),
        true
      );
      assert.equal(
        isResolvedCapabilityRequiredDimensionEvaluationState(
          "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED"
        ),
        false
      );
      assert.equal(
        isResolvedCapabilityRequiredDimensionEvaluationState(
          "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED"
        ),
        false
      );
      assert.equal(
        isResolvedCapabilityRequiredDimensionEvaluationState(
          "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED"
        ),
        false
      );
    });
  });

  describe("readiness outcome evaluation", () => {
    it("all HOLDS → readiness condition HOLDS", () => {
      const result = buildSet([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
        {
          dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
      ]);
      const assessment =
        result.candidate_assessments[0].requirement_readiness_assessments[0];
      assert.equal(
        assessment.status,
        "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT"
      );
      assert.equal(
        assessment.readiness_basis?.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
      );
      assert.equal(assessment.readiness_basis?.unresolved_dimension_refs.length, 0);
      assertNoForbiddenSemantics(result);
    });

    it("HOLDS + DOES_NOT_HOLD → readiness condition HOLDS (resolved != HOLDS)", () => {
      const result = buildSet([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
        {
          dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        },
      ]);
      assert.equal(
        result.candidate_assessments[0].requirement_readiness_assessments[0]
          .readiness_basis?.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
      );
    });

    it("all DOES_NOT_HOLD → readiness condition HOLDS", () => {
      const result = buildSet([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        },
        {
          dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        },
      ]);
      assert.equal(
        result.candidate_assessments[0].requirement_readiness_assessments[0]
          .readiness_basis?.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
      );
    });

    it("one unresolved criterion → DOES_NOT_HOLD with exact ref", () => {
      const result = buildSet([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
        {
          dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        },
        {
          dimension: "CAPABILITY_SCOPE_APPLICABILITY",
          state: "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
        },
      ]);
      const basis =
        result.candidate_assessments[0].requirement_readiness_assessments[0]
          .readiness_basis!;
      assert.equal(
        basis.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(basis.unresolved_dimension_refs.length, 1);
      assert.equal(
        basis.unresolved_dimension_refs[0].required_dimension,
        "CAPABILITY_SCOPE_APPLICABILITY"
      );
      assert.equal(
        basis.unresolved_dimension_refs[0].unresolved_state,
        "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED"
      );
      assert.equal(basis.required_dimension_evaluation_state_basis_keys.length, 3);
    });

    it("mixed three unresolved reasons preserve all refs in canonical order", () => {
      const result = buildSet([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED",
        },
        {
          dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
          state: "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
        },
        {
          dimension: "CAPABILITY_SCOPE_APPLICABILITY",
          state: "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED",
        },
      ]);
      const refs =
        result.candidate_assessments[0].requirement_readiness_assessments[0]
          .readiness_basis!.unresolved_dimension_refs;
      assert.equal(refs.length, 3);
      assert.deepEqual(
        refs.map((r) => r.required_dimension),
        [
          "CAPABILITY_SCOPE_APPLICABILITY",
          "CAPABILITY_VERIFICATION_REPRESENTATION",
          "CAPABILITY_AVAILABILITY_REPRESENTATION",
        ]
      );
      assert.deepEqual(
        refs.map((r) => r.unresolved_state),
        [
          "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED",
          "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
          "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED",
        ]
      );
    });
  });

  describe("policy absence / empty domain", () => {
    it("policy absent → no readiness basis (not DOES_NOT_HOLD)", () => {
      const result = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED"
      );
      const assessment =
        result.candidate_assessments[0].requirement_readiness_assessments[0];
      assert.equal(
        assessment.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY"
      );
      assert.equal(assessment.readiness_basis, null);
      assert.equal(
        result.has_capability_requirement_dimension_aggregation_readiness_basis,
        false
      );
    });

    it("empty required dimensions → no basis; no vacuous HOLDS", () => {
      const evalCandidate = mockEvalCandidate(
        mockEvalRequirementAssessment([])
      );
      const policyCandidate = mockPolicyCandidate(
        mockReadinessPolicyAssessment({
          status: "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED",
          requiredDimensions: [],
        })
      );
      const result =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessSet(
          {
            capability_required_dimension_evaluation_state_set: {
              capability_dimension_source_aggregation_outcome_set: {} as never,
              candidate_assessments: [evalCandidate],
              has_capability_required_dimension_evaluation_states: false,
              model_limitations: [],
            },
            capability_requirement_dimension_aggregation_readiness_policy_set: {
              capability_evaluation_dimension_policy_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [policyCandidate],
              has_explicit_capability_requirement_dimension_aggregation_readiness_policies:
                false,
              model_limitations: [],
            },
          }
        );
      assert.equal(
        result.candidate_assessments[0].requirement_readiness_assessments[0]
          .status,
        "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
      );
      assert.equal(
        result.candidate_assessments[0].requirement_readiness_assessments[0]
          .readiness_basis,
        null
      );
    });

    it("malformed policy PRESENT + empty domain rejects", () => {
      const evalCandidate = mockEvalCandidate(
        mockEvalRequirementAssessment([])
      );
      const policyAssessment = mockReadinessPolicyAssessment({
        status:
          "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT",
        requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
      });
      // Force empty domain while PRESENT
      policyAssessment.evaluation_dimension_policy_assessment.evaluation_dimension_policy_basis.evaluation_dimension_policy!.required_dimensions =
        [];
      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadiness(
            evalCandidate,
            mockPolicyCandidate(policyAssessment)
          ),
        /empty required Dimension domain/
      );
    });
  });

  describe("domain invariants", () => {
    it("missing Dimension Evaluation State rejects", () => {
      const evalCandidate = mockEvalCandidate(
        mockEvalRequirementAssessment([
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ])
      );
      const policyCandidate = mockPolicyCandidate(
        mockReadinessPolicyAssessment({
          status:
            "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT",
          requiredDimensions: [
            "CAPABILITY_AVAILABILITY_REPRESENTATION",
            "CAPABILITY_VERIFICATION_REPRESENTATION",
          ],
        })
      );
      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadiness(
            evalCandidate,
            policyCandidate
          ),
        /Missing required Dimension Evaluation State/
      );
    });

    it("extra Dimension Evaluation State rejects", () => {
      const evalCandidate = mockEvalCandidate(
        mockEvalRequirementAssessment([
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
          {
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ])
      );
      const policyCandidate = mockPolicyCandidate(
        mockReadinessPolicyAssessment({
          status:
            "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT",
          requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
        })
      );
      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadiness(
            evalCandidate,
            policyCandidate
          ),
        /Extra Dimension Evaluation State|Required dimension set mismatch/
      );
    });

    it("duplicate Dimension Evaluation State rejects", () => {
      const evalReq = mockEvalRequirementAssessment([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
      ]);
      evalReq.required_dimension_evaluation_assessments.push(
        mockEvalAssessment(
          "CAPABILITY_AVAILABILITY_REPRESENTATION",
          "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
        )
      );
      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadiness(
            mockEvalCandidate(evalReq),
            mockPolicyCandidate(
              mockReadinessPolicyAssessment({
                status:
                  "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT",
                requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
              })
            )
          ),
        /Duplicate required Dimension Evaluation State/
      );
    });
  });

  describe("boolean / identity / immutability", () => {
    it("candidate boolean true when only DOES_NOT_HOLD readiness outcomes", () => {
      const result = buildSet([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED",
        },
      ]);
      assert.equal(
        result.candidate_assessments[0]
          .has_capability_requirement_dimension_aggregation_readiness_basis,
        true
      );
      assert.equal(
        result.has_capability_requirement_dimension_aggregation_readiness_basis,
        true
      );
      assert.equal(
        result.candidate_assessments[0].requirement_readiness_assessments[0]
          .readiness_basis?.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        Object.keys(result.candidate_assessments[0]).includes(
          "has_ready_requirement"
        ),
        false
      );
    });

    it("basis identity changes when Dimension state changes", () => {
      const unresolved = buildSet([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
        },
      ]);
      const resolved = buildSet([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        },
      ]);
      assert.notEqual(
        unresolved.candidate_assessments[0].requirement_readiness_assessments[0]
          .readiness_basis?.key,
        resolved.candidate_assessments[0].requirement_readiness_assessments[0]
          .readiness_basis?.key
      );
    });

    it("deep-cloned inputs yield identical output; inputs unchanged", () => {
      const evalSet = {
        capability_dimension_source_aggregation_outcome_set: {} as never,
        candidate_assessments: [
          mockEvalCandidate(
            mockEvalRequirementAssessment([
              {
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
              },
            ])
          ),
        ],
        has_capability_required_dimension_evaluation_states: true,
        model_limitations: [],
      };
      const policySet = {
        capability_evaluation_dimension_policy_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [
          mockPolicyCandidate(
            mockReadinessPolicyAssessment({
              status:
                "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT",
              requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
            })
          ),
        ],
        has_explicit_capability_requirement_dimension_aggregation_readiness_policies:
          true,
        model_limitations: [],
      };
      const evalBefore = structuredClone(evalSet);
      const policyBefore = structuredClone(policySet);
      const first =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessSet(
          {
            capability_required_dimension_evaluation_state_set:
              structuredClone(evalSet),
            capability_requirement_dimension_aggregation_readiness_policy_set:
              structuredClone(policySet),
          }
        );
      const second =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessSet(
          {
            capability_required_dimension_evaluation_state_set:
              structuredClone(evalSet),
            capability_requirement_dimension_aggregation_readiness_policy_set:
              structuredClone(policySet),
          }
        );
      assert.deepEqual(first, second);
      assert.deepEqual(evalSet, evalBefore);
      assert.deepEqual(policySet, policyBefore);
      assertCompatibleCapabilityRequirementDimensionAggregationReadinessContexts(
        evalSet,
        policySet
      );
      assert.ok(
        attentionObservationCapabilityRequirementDimensionAggregationReadinessKey(
          REQ_KEY,
          EVAL_POLICY_KEY,
          READINESS_POLICY_KEY,
          "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS",
          ["k"],
          []
        ).includes("readiness")
      );
    });
  });
});
