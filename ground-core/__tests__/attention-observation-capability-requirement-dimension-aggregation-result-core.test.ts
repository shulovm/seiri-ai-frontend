/**
 * GROUND-071 — Observation Core XXV / Capability Requirement Dimension
 * Aggregation Result
 *
 * Pure 067 Evaluation States + 068 Aggregation Policy + 070 Readiness Basis
 * (Requirement aggregation-condition HOLDS / DOES_NOT_HOLD only;
 * no SATISFIED/UNSATISFIED / readiness recomputation / unresolved filtering).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS,
  assertCompatibleCapabilityRequirementDimensionAggregationResultContexts,
  assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationResult,
  attentionObservationCapabilityRequirementDimensionAggregationResultKey,
  buildAttentionObservationCapabilityRequirementDimensionAggregationResultSet,
  evaluateRequirementDimensionAggregationPolicyCondition,
} from "../reality/attention-observation-capability-requirement-dimension-aggregation-result-core.js";
import type {
  AttentionObservationCapabilityRequiredDimensionEvaluationState,
} from "../reality/attention-observation-capability-required-dimension-evaluation-state-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "../reality/attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind,
} from "../reality/attention-observation-capability-requirement-dimension-aggregation-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const REQ_KEY = "req";
const NEED_KEY = "need";
const EVAL_POLICY_KEY = "eval-policy-key";
const AGG_POLICY_KEY = "agg-policy-key";
const READINESS_BASIS_KEY = "readiness-basis-key";
const READINESS_POLICY_KEY = "readiness-policy-key";

const ANY =
  "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS" as const;
const ALL =
  "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"has_satisfied_requirement"/.test(json));
  assert.ok(!/"has_holding_requirement"/.test(json));
  assert.ok(!/"holds_count"/.test(json));
  assert.ok(!/"does_not_hold_count"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
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

function mockEvalPolicyAssessment(
  requiredDimensions: AttentionObservationCapabilityEvaluationDimension[],
  empty = false
) {
  return {
    capability_requirement: {
      key: REQ_KEY,
      observation_need_key: NEED_KEY,
      capability_semantic_key: "inspect",
    } as never,
    status: "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT" as const,
    evaluation_dimension_policy_basis: {
      capability_requirement: {
        key: REQ_KEY,
        observation_need_key: NEED_KEY,
        capability_semantic_key: "inspect",
      } as never,
      evaluation_dimension_policy: {
        key: EVAL_POLICY_KEY,
        capability_requirement_key: REQ_KEY,
        observation_need_key: NEED_KEY,
        capability_semantic_key: "inspect" as const,
        required_dimensions: empty ? [] : [...requiredDimensions],
      },
    },
  };
}

function mockAggregationPolicyAssessment(options: {
  status:
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
    | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
    | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_DECLARED"
    | "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT";
  aggregationKind?: AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind;
  requiredDimensions?: AttentionObservationCapabilityEvaluationDimension[];
}) {
  const requiredDimensions = options.requiredDimensions ?? [
    "CAPABILITY_AVAILABILITY_REPRESENTATION",
  ];
  const policyPresent =
    options.status ===
    "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT";
  const evalPolicyPresent =
    options.status !==
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY";
  const empty =
    options.status === "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED";

  return {
    capability_requirement: {
      key: REQ_KEY,
      observation_need_key: NEED_KEY,
      capability_semantic_key: "inspect",
    } as never,
    evaluation_dimension_policy_assessment: evalPolicyPresent
      ? mockEvalPolicyAssessment(requiredDimensions, empty)
      : {
          capability_requirement: {
            key: REQ_KEY,
            observation_need_key: NEED_KEY,
            capability_semantic_key: "inspect",
          } as never,
          status:
            "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED" as const,
          evaluation_dimension_policy_basis: {
            capability_requirement: {
              key: REQ_KEY,
              observation_need_key: NEED_KEY,
              capability_semantic_key: "inspect",
            } as never,
            evaluation_dimension_policy: null,
          },
        },
    status: options.status,
    requirement_dimension_aggregation_policy: policyPresent
      ? {
          key: `${AGG_POLICY_KEY}|${options.aggregationKind ?? ANY}`,
          capability_requirement_key: REQ_KEY,
          observation_need_key: NEED_KEY,
          capability_semantic_key: "inspect" as const,
          evaluation_dimension_policy_key: EVAL_POLICY_KEY,
          aggregation_kind: options.aggregationKind ?? ANY,
        }
      : null,
  };
}

function mockReadinessAssessment(options: {
  status:
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
    | "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY"
    | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT";
  outcome?:
    | "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
    | "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";
  dimensionStates?: {
    dimension: AttentionObservationCapabilityEvaluationDimension;
    state: AttentionObservationCapabilityRequiredDimensionEvaluationState;
  }[];
  stateBasisKeysOverride?: string[];
  readinessBasisKey?: string;
}) {
  const dimensionStates = options.dimensionStates ?? [
    {
      dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
      state: "SOURCE_AGGREGATION_CONDITION_HOLDS" as const,
    },
  ];
  const evalReq = mockEvalRequirementAssessment(dimensionStates);
  const requiredDimensions = dimensionStates.map((d) => d.dimension);
  const basisPresent =
    options.status ===
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT";
  const outcome =
    options.outcome ??
    "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS";
  const stateKeys =
    options.stateBasisKeysOverride ??
    dimensionStates.map((d) => mockEvalStateBasis(d.dimension, d.state).key);

  return {
    capability_requirement: evalReq.capability_requirement,
    dimension_evaluation_state_assessment: evalReq,
    readiness_policy_assessment: {
      capability_requirement: evalReq.capability_requirement,
      evaluation_dimension_policy_assessment: mockEvalPolicyAssessment(
        requiredDimensions,
        options.status ===
          "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
      ),
      status:
        options.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY"
          ? ("NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED" as const)
          : options.status ===
              "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
            ? ("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY" as const)
            : options.status ===
                "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
              ? ("NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED" as const)
              : ("EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT" as const),
      requirement_dimension_aggregation_readiness_policy: basisPresent
        ? {
            key: READINESS_POLICY_KEY,
            capability_requirement_key: REQ_KEY,
            observation_need_key: NEED_KEY,
            capability_semantic_key: "inspect" as const,
            evaluation_dimension_policy_key: EVAL_POLICY_KEY,
            readiness_kind:
              "REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION" as const,
          }
        : null,
    },
    status: options.status,
    readiness_basis: basisPresent
      ? {
          key: options.readinessBasisKey ?? READINESS_BASIS_KEY,
          capability_requirement_key: REQ_KEY,
          observation_need_key: NEED_KEY,
          evaluation_dimension_policy_key: EVAL_POLICY_KEY,
          readiness_policy_key: READINESS_POLICY_KEY,
          readiness_kind:
            "REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION" as const,
          required_dimension_evaluation_state_basis_keys: stateKeys,
          unresolved_dimension_refs:
            outcome ===
            "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
              ? [
                  {
                    required_dimension: dimensionStates[0]!.dimension,
                    evaluation_state_basis_key: stateKeys[0]!,
                    unresolved_state:
                      "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED" as const,
                  },
                ]
              : [],
          outcome,
        }
      : null,
  };
}

function mockEvalCandidate(
  requirementAssessment: ReturnType<typeof mockEvalRequirementAssessment>
) {
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
  policyAssessment: ReturnType<typeof mockAggregationPolicyAssessment>
) {
  return {
    candidate_key: "cand",
    evaluation_dimension_policy_assessment: {} as never,
    status:
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICIES_PRESENT" as const,
    requirement_dimension_aggregation_policy_assessments: [policyAssessment],
    has_explicit_capability_requirement_dimension_aggregation_policies:
      policyAssessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT",
    model_limitations: [],
  };
}

function mockReadinessCandidate(
  readinessAssessment: ReturnType<typeof mockReadinessAssessment>
) {
  return {
    candidate_key: "cand",
    required_dimension_evaluation_state_assessment: {} as never,
    readiness_policy_assessment: {} as never,
    status:
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASES_PRESENT" as const,
    requirement_readiness_assessments: [readinessAssessment],
    has_capability_requirement_dimension_aggregation_readiness_basis:
      readinessAssessment.status ===
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT",
    model_limitations: [],
  };
}

function buildSet(
  dimensionStates: {
    dimension: AttentionObservationCapabilityEvaluationDimension;
    state: AttentionObservationCapabilityRequiredDimensionEvaluationState;
  }[],
  aggregationKind: AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind = ANY,
  options: {
    aggregationPolicyStatus?: ReturnType<
      typeof mockAggregationPolicyAssessment
    >["status"];
    readinessStatus?: ReturnType<typeof mockReadinessAssessment>["status"];
    readinessOutcome?:
      | "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
      | "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";
    stateBasisKeysOverride?: string[];
    readinessBasisKey?: string;
  } = {}
) {
  const dimensions = dimensionStates.map((d) => d.dimension);
  const evalReq = mockEvalRequirementAssessment(dimensionStates);
  const aggregationPolicyStatus =
    options.aggregationPolicyStatus ??
    "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT";
  const readinessStatus =
    options.readinessStatus ??
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT";

  return buildAttentionObservationCapabilityRequirementDimensionAggregationResultSet(
    {
      capability_required_dimension_evaluation_state_set: {
        capability_dimension_source_aggregation_outcome_set: {} as never,
        candidate_assessments: [mockEvalCandidate(evalReq)],
        has_capability_required_dimension_evaluation_states: true,
        model_limitations: [],
      },
      capability_requirement_dimension_aggregation_policy_set: {
        capability_evaluation_dimension_policy_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [
          mockPolicyCandidate(
            mockAggregationPolicyAssessment({
              status: aggregationPolicyStatus,
              aggregationKind,
              requiredDimensions:
                aggregationPolicyStatus ===
                "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
                  ? []
                  : dimensions.length > 0
                    ? dimensions
                    : ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
            })
          ),
        ],
        has_explicit_capability_requirement_dimension_aggregation_policies:
          aggregationPolicyStatus ===
          "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT",
        model_limitations: [],
      },
      capability_requirement_dimension_aggregation_readiness_set: {
        capability_required_dimension_evaluation_state_set: {} as never,
        capability_requirement_dimension_aggregation_readiness_policy_set:
          {} as never,
        candidate_assessments: [
          mockReadinessCandidate(
            mockReadinessAssessment({
              status: readinessStatus,
              outcome: options.readinessOutcome,
              dimensionStates:
                readinessStatus ===
                "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
                  ? []
                  : dimensionStates.length > 0
                    ? dimensionStates
                    : [
                        {
                          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
                        },
                      ],
              stateBasisKeysOverride: options.stateBasisKeysOverride,
              readinessBasisKey: options.readinessBasisKey,
            })
          ),
        ],
        has_capability_requirement_dimension_aggregation_readiness_basis:
          readinessStatus ===
          "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT",
        model_limitations: [],
      },
    }
  );
}

function reqResult(
  set: ReturnType<typeof buildSet>
) {
  return set.candidate_assessments[0]!
    .requirement_aggregation_assessments[0]!;
}

describe("GROUND-071 Capability Requirement Dimension Aggregation Result", () => {
  describe("ANY algorithm", () => {
    it("one HOLDS → aggregation HOLDS", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY
      );
      const result = reqResult(set);
      assert.equal(
        result.status,
        "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT"
      );
      assert.equal(
        result.aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
      assertNoForbiddenSemantics(set);
    });

    it("one DOES_NOT_HOLD → aggregation DOES_NOT_HOLD", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
        ],
        ANY
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("mixed HOLDS + DOES_NOT_HOLD → HOLDS", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
        ],
        ANY
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
    });

    it("all DOES_NOT_HOLD → DOES_NOT_HOLD", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
        ],
        ANY
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("1 HOLDS / 99 DOES_NOT_HOLD → HOLDS (no majority)", () => {
      const dimensionStates: {
        dimension: AttentionObservationCapabilityEvaluationDimension;
        state: AttentionObservationCapabilityRequiredDimensionEvaluationState;
      }[] = [
        {
          dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
      ];
      const extras: AttentionObservationCapabilityEvaluationDimension[] = [
        "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
        "CAPABILITY_SCOPE_APPLICABILITY",
        "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
        "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
        "CAPABILITY_VERIFICATION_REPRESENTATION",
        "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
        "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
      ];
      for (const dimension of extras) {
        dimensionStates.push({
          dimension,
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        });
      }
      // pad conceptually: 1 HOLDS among many DOES_NOT_HOLD is enough for ANY
      const set = buildSet(dimensionStates, ANY);
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
    });
  });

  describe("ALL algorithm", () => {
    it("one HOLDS → HOLDS", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ALL
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
    });

    it("one DOES_NOT_HOLD → DOES_NOT_HOLD", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
        ],
        ALL
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("all HOLDS → HOLDS", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ALL
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
    });

    it("mixed → DOES_NOT_HOLD", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
        ],
        ALL
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("all DOES_NOT_HOLD → DOES_NOT_HOLD", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
        ],
        ALL
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("99 HOLDS / 1 DOES_NOT_HOLD → DOES_NOT_HOLD (no threshold)", () => {
      const dimensionStates: {
        dimension: AttentionObservationCapabilityEvaluationDimension;
        state: AttentionObservationCapabilityRequiredDimensionEvaluationState;
      }[] = [
        {
          dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        },
      ];
      const extras: AttentionObservationCapabilityEvaluationDimension[] = [
        "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
        "CAPABILITY_SCOPE_APPLICABILITY",
        "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
        "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
        "CAPABILITY_VERIFICATION_REPRESENTATION",
        "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
        "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
      ];
      for (const dimension of extras) {
        dimensionStates.push({
          dimension,
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        });
      }
      const set = buildSet(dimensionStates, ALL);
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });
  });

  describe("readiness gate", () => {
    it("readiness DOES_NOT_HOLD + ANY → no aggregation result", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
          },
        ],
        ANY,
        {
          readinessOutcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }
      );
      const result = reqResult(set);
      assert.equal(
        result.status,
        "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(result.aggregation_result_basis, null);
      assert.notEqual(
        result.status,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("readiness DOES_NOT_HOLD + ALL → no aggregation result", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED",
          },
        ],
        ALL,
        {
          readinessOutcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }
      );
      assert.equal(reqResult(set).aggregation_result_basis, null);
    });

    it("readiness DOES_NOT_HOLD != aggregation DOES_NOT_HOLD", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED",
          },
        ],
        ANY,
        {
          readinessOutcome:
            "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
        }
      );
      const result = reqResult(set);
      assert.equal(result.aggregation_result_basis, null);
      assert.ok(
        !JSON.stringify(result).includes(
          '"outcome":"REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"'
        )
      );
    });

    it("readiness policy absent → no result", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY,
        {
          readinessStatus:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY",
        }
      );
      assert.equal(
        reqResult(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY"
      );
      assert.equal(reqResult(set).aggregation_result_basis, null);
    });

    it("aggregation policy absent → no result", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY,
        {
          aggregationPolicyStatus:
            "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_DECLARED",
        }
      );
      assert.equal(
        reqResult(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY"
      );
      assert.equal(reqResult(set).aggregation_result_basis, null);
    });

    it("Evaluation Dimension Policy absent → no result", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY,
        {
          aggregationPolicyStatus:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY",
          readinessStatus:
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY",
        }
      );
      assert.equal(
        reqResult(set).status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
      );
    });

    it("empty required Dimension domain → no result", () => {
      const set = buildSet([], ANY, {
        aggregationPolicyStatus:
          "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED",
        readinessStatus:
          "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS",
      });
      assert.equal(
        reqResult(set).status,
        "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
      );
      assert.equal(reqResult(set).aggregation_result_basis, null);
    });
  });

  describe("empty-domain / unresolved / stale firewalls", () => {
    it("vacuous ANY([]) rejects", () => {
      assert.throws(
        () => evaluateRequirementDimensionAggregationPolicyCondition(ANY, []),
        /empty required Dimension domain/
      );
    });

    it("vacuous ALL([]) rejects", () => {
      assert.throws(
        () => evaluateRequirementDimensionAggregationPolicyCondition(ALL, []),
        /empty required Dimension domain/
      );
    });

    it("readiness HOLDS + unresolved 067 state → invariant reject", () => {
      assert.throws(
        () =>
          buildSet(
            [
              {
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                state: "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED",
              },
            ],
            ANY,
            {
              readinessOutcome:
                "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS",
            }
          ),
        /unresolved Dimension Evaluation State/
      );
    });

    it("stale readiness state-lineage mismatch → reject", () => {
      assert.throws(
        () =>
          buildSet(
            [
              {
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
              },
            ],
            ANY,
            {
              stateBasisKeysOverride: ["stale-key-from-previous-067"],
            }
          ),
        /Stale Requirement Dimension Aggregation Readiness Basis/
      );
    });

    it("Evaluation Dimension Policy key mismatch → reject", () => {
      const dimensionStates = [
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS" as const,
        },
      ];
      const evalReq = mockEvalRequirementAssessment(dimensionStates);
      const policy = mockAggregationPolicyAssessment({
        status:
          "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT",
        aggregationKind: ANY,
        requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
      });
      policy.requirement_dimension_aggregation_policy!.evaluation_dimension_policy_key =
        "other-eval-policy";
      const readiness = mockReadinessAssessment({
        status:
          "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT",
        dimensionStates,
      });

      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationResult(
            mockEvalCandidate(evalReq) as never,
            mockPolicyCandidate(policy) as never,
            mockReadinessCandidate(readiness) as never
          ),
        /Evaluation Dimension Policy key mismatch/
      );
    });

    it("duplicate Dimension Evaluation State → reject", () => {
      const evalReq = mockEvalRequirementAssessment([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
        },
      ]);
      const policy = mockAggregationPolicyAssessment({
        status:
          "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT",
        requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
      });
      const readiness = mockReadinessAssessment({
        status:
          "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT",
        dimensionStates: [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
      });

      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationResult(
            mockEvalCandidate(evalReq) as never,
            mockPolicyCandidate(policy) as never,
            mockReadinessCandidate(readiness) as never
          ),
        /Duplicate required Dimension/
      );
    });

    it("missing Dimension state → reject", () => {
      const evalReq = mockEvalRequirementAssessment([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
      ]);
      const policy = mockAggregationPolicyAssessment({
        status:
          "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT",
        requiredDimensions: [
          "CAPABILITY_AVAILABILITY_REPRESENTATION",
          "CAPABILITY_VERIFICATION_REPRESENTATION",
        ],
      });
      const readiness = mockReadinessAssessment({
        status:
          "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT",
        dimensionStates: [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
          {
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
      });

      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationResult(
            mockEvalCandidate(evalReq) as never,
            mockPolicyCandidate(policy) as never,
            mockReadinessCandidate(readiness) as never
          ),
        /Missing required Dimension|Required dimension set mismatch/
      );
    });

    it("extra Dimension state → reject", () => {
      const evalReq = mockEvalRequirementAssessment([
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
        {
          dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
        },
      ]);
      const policy = mockAggregationPolicyAssessment({
        status:
          "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT",
        requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
      });
      const readiness = mockReadinessAssessment({
        status:
          "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT",
        dimensionStates: [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
      });

      assert.throws(
        () =>
          assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationResult(
            mockEvalCandidate(evalReq) as never,
            mockPolicyCandidate(policy) as never,
            mockReadinessCandidate(readiness) as never
          ),
        /Extra Dimension|Required dimension set mismatch/
      );
    });
  });

  describe("identity / single-dimension / boolean semantics", () => {
    it("single Dimension ANY/ALL policy identities remain separate", () => {
      const dims = [
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS" as const,
        },
      ];
      const anySet = buildSet(dims, ANY);
      const allSet = buildSet(dims, ALL);
      assert.equal(
        reqResult(anySet).aggregation_result_basis!.aggregation_kind,
        ANY
      );
      assert.equal(
        reqResult(allSet).aggregation_result_basis!.aggregation_kind,
        ALL
      );
      assert.notEqual(
        reqResult(anySet).aggregation_result_basis!.key,
        reqResult(allSet).aggregation_result_basis!.key
      );
    });

    it("state change changes result identity", () => {
      const holds = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY
      );
      const notHolds = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
        ],
        ANY
      );
      assert.notEqual(
        reqResult(holds).aggregation_result_basis!.key,
        reqResult(notHolds).aggregation_result_basis!.key
      );
    });

    it("readiness basis key change changes result identity", () => {
      const a = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY,
        { readinessBasisKey: "readiness-a" }
      );
      const b = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY,
        { readinessBasisKey: "readiness-b" }
      );
      assert.notEqual(
        reqResult(a).aggregation_result_basis!.key,
        reqResult(b).aggregation_result_basis!.key
      );
    });

    it("PRESENT != positive; boolean true with only DOES_NOT_HOLD results", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
          },
        ],
        ANY
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_PRESENT"
      );
      assert.equal(
        set.has_capability_requirement_dimension_aggregation_result,
        true
      );
      assert.equal(
        set.candidate_assessments[0]!
          .has_capability_requirement_dimension_aggregation_result,
        true
      );
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("result key uses canonical state-basis-set identity", () => {
      const keys = [
        "state|req|CAPABILITY_AVAILABILITY_REPRESENTATION|SOURCE_AGGREGATION_CONDITION_HOLDS",
      ];
      const key = attentionObservationCapabilityRequirementDimensionAggregationResultKey(
        REQ_KEY,
        EVAL_POLICY_KEY,
        AGG_POLICY_KEY,
        READINESS_BASIS_KEY,
        keys
      );
      assert.ok(
        key.startsWith(
          "attention-observation-capability-requirement-dimension-aggregation-result|"
        )
      );
      assert.ok(key.includes(AGG_POLICY_KEY));
      assert.ok(key.includes(READINESS_BASIS_KEY));
    });
  });

  describe("determinism / immutability / deep-clone", () => {
    it("repeated calls deepEqual", () => {
      const inputDims = [
        {
          dimension: "CAPABILITY_VERIFICATION_REPRESENTATION" as const,
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS" as const,
        },
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
          state: "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD" as const,
        },
      ];
      const a = buildSet(inputDims, ANY);
      const b = buildSet(inputDims, ANY);
      assert.deepEqual(a, b);
    });

    it("deep-cloned semantic inputs compose without pointer identity", () => {
      const dimensionStates = [
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS" as const,
        },
      ];
      const base = buildSet(dimensionStates, ALL);
      const clonedInput = JSON.parse(
        JSON.stringify({
          capability_required_dimension_evaluation_state_set:
            base.capability_required_dimension_evaluation_state_set,
          capability_requirement_dimension_aggregation_policy_set:
            base.capability_requirement_dimension_aggregation_policy_set,
          capability_requirement_dimension_aggregation_readiness_set:
            base.capability_requirement_dimension_aggregation_readiness_set,
        })
      );
      const rebuilt =
        buildAttentionObservationCapabilityRequirementDimensionAggregationResultSet(
          clonedInput
        );
      assert.deepEqual(
        rebuilt.candidate_assessments[0]!.requirement_aggregation_assessments[0]!
          .aggregation_result_basis,
        reqResult(base).aggregation_result_basis
      );
      assert.notEqual(
        rebuilt.capability_required_dimension_evaluation_state_set,
        base.capability_required_dimension_evaluation_state_set
      );
    });

    it("067/068/070 input immutability", () => {
      const dimensionStates = [
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
          state: "SOURCE_AGGREGATION_CONDITION_HOLDS" as const,
        },
      ];
      const set = buildSet(dimensionStates, ANY);
      const before067 = JSON.stringify(
        set.capability_required_dimension_evaluation_state_set
      );
      const before068 = JSON.stringify(
        set.capability_requirement_dimension_aggregation_policy_set
      );
      const before070 = JSON.stringify(
        set.capability_requirement_dimension_aggregation_readiness_set
      );
      buildAttentionObservationCapabilityRequirementDimensionAggregationResultSet(
        {
          capability_required_dimension_evaluation_state_set:
            set.capability_required_dimension_evaluation_state_set,
          capability_requirement_dimension_aggregation_policy_set:
            set.capability_requirement_dimension_aggregation_policy_set,
          capability_requirement_dimension_aggregation_readiness_set:
            set.capability_requirement_dimension_aggregation_readiness_set,
        }
      );
      assert.equal(
        JSON.stringify(
          set.capability_required_dimension_evaluation_state_set
        ),
        before067
      );
      assert.equal(
        JSON.stringify(
          set.capability_requirement_dimension_aggregation_policy_set
        ),
        before068
      );
      assert.equal(
        JSON.stringify(
          set.capability_requirement_dimension_aggregation_readiness_set
        ),
        before070
      );
    });
  });

  describe("model limitations / static proofs", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS[0],
        "CAPABILITY_REQUIREMENT_EVALUATION_STATE_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS.includes(
          "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
        )
      );
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS.includes(
          "CAPABILITY_REQUIREMENT_AGGREGATION_RESULT_TO_SATISFACTION_POLICY_NOT_MODELED"
        )
      );
    });

    it("schema unchanged at 0.1.24", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
    });

    it("no ProjectState / wall-clock / forbidden runtime deps in core source", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-capability-requirement-dimension-aggregation-result-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-capability-requirement-dimension-aggregation-result-types.ts"
      );
      const coreSrc = readFileSync(corePath, "utf8");
      const typesSrc = readFileSync(typesPath, "utf8");
      const src = coreSrc + typesSrc;

      assert.ok(!/Date\.now\(/.test(coreSrc));
      assert.ok(!/new Date\(/.test(coreSrc));
      assert.ok(!/performance\.now\(/.test(coreSrc));
      assert.ok(!/\bsaveProject\b/.test(coreSrc));
      assert.ok(!/\bapplyPatch\b/.test(coreSrc));
      assert.ok(!/\bStatePatch\b/.test(coreSrc));

      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-readiness-policy/.test(src)
      );
      assert.ok(
        !/from ["'].*dimension-source-aggregation-outcome/.test(src)
      );
      assert.ok(
        !/from ["'].*dimension-source-aggregation-policy/.test(src)
      );
      assert.ok(
        !/from ["'].*required-dimension-source-acceptance/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-evaluation-dimension-coverage/.test(src)
      );
      assert.ok(!/from ["'].*state-engine/.test(src));
      assert.ok(!/from ["'].*file-store/.test(src));

      assert.ok(coreSrc.includes("dimensionStates.length === 0"));
      assert.ok(coreSrc.includes(".some("));
      assert.ok(coreSrc.includes(".every("));
    });

    it("HOLDS != SATISFIED and DOES_NOT_HOLD != UNSATISFIED in vocabulary", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY
      );
      assertNoForbiddenSemantics(set);
      assert.equal(
        reqResult(set).aggregation_result_basis!.outcome,
        "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
    });

    it("context assert export is callable", () => {
      const set = buildSet(
        [
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            state: "SOURCE_AGGREGATION_CONDITION_HOLDS",
          },
        ],
        ANY
      );
      assert.doesNotThrow(() =>
        assertCompatibleCapabilityRequirementDimensionAggregationResultContexts(
          set.capability_required_dimension_evaluation_state_set,
          set.capability_requirement_dimension_aggregation_policy_set,
          set.capability_requirement_dimension_aggregation_readiness_set
        )
      );
    });
  });
});
