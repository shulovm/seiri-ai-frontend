/**
 * GROUND-106 — Observation Core LX / Operational Eligibility Permission
 * Dimension Satisfaction State Foundation
 *
 * Pure GROUND-105 normalization (four canonical states;
 * no 103/104 polarity inference; no effective Permission / OE / can_execute).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSet,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-core.js";
import {
  buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSet,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-basis-core.js";
import {
  buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySet,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-core.js";
import {
  buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-result-core.js";
import {
  buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSet,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionState,
  attentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasisKey,
  attentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateKey,
  buildAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSet,
  isResolvedAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState,
  mapInterpretationBasisAssessmentToSatisfactionState,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-satisfaction-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch,
} from "../reality/attention-observation-operational-eligibility-permission-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy,
} from "../reality/attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const AGG_POLICY_KEY =
  "attention-observation-operational-eligibility-permission-source-aggregation-policy|cand|need|set|084|PERMISSION|ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE";
const READY_POLICY_KEY =
  "attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy|cand|need|set|084|PERMISSION|REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION";

const ANY = "ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE" as const;
const NON_EMPTY =
  "REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION" as const;
const LISTED = "LISTED_AS_ACCEPTABLE" as const;
const NOT_LISTED = "NOT_LISTED_AS_ACCEPTABLE" as const;

const HOLDS =
  "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS" as const;
const DOES_NOT_HOLD =
  "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED" as const;

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
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"is_permission_dimension_satisfied"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
}

function mockMatch(options: {
  match: "LISTED_AS_ACCEPTABLE" | "NOT_LISTED_AS_ACCEPTABLE";
  binding_suffix?: string;
}): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch {
  const suffix = options.binding_suffix ?? "a";
  return {
    key: `097-match|${CAND}|${suffix}|${options.match}`,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    permission_context_binding_key: `binding|${suffix}`,
    dimension: "PERMISSION",
    permission_state_source_key: `093-source|${suffix}`,
    permission_state_basis_key: `091-basis|${suffix}`,
    permission_evaluation_at: "2026-08-24T11:00:00.000Z",
    permission_state: "PERMISSION_PERMITTED",
    permission_source_acceptance_criterion_key: "096-criterion",
    match: options.match,
  };
}

function mockMatchAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment["status"];
  matches?: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch[];
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment {
  const status =
    options?.status ?? "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT";
  const matches =
    options?.matches ??
    (status === "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      ? [mockMatch({ match: LISTED })]
      : []);
  return {
    candidate_key: CAND,
    permission_state_source_assessment: {} as never,
    permission_source_acceptance_criteria_assessment: {
      candidate_key: CAND,
      operational_eligibility_dimension_policy_assessment: {
        candidate_key: CAND,
        capability_requirement_assessment: {} as never,
        status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
        operational_eligibility_dimension_policy: {
          key: POLICY_KEY,
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          capability_requirement_keys: ["req"],
          required_dimensions: ["PERMISSION"],
        },
        model_limitations: [],
      },
      status: "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT",
      permission_source_acceptance_criterion: null,
      has_explicit_permission_source_acceptance_criterion: false,
      model_limitations: [],
    },
    status,
    permission_source_acceptance_matches: matches,
    has_permission_source_acceptance_matches: matches.length > 0,
    has_listed_as_acceptable_permission_sources: matches.some(
      (m) => m.match === LISTED
    ),
    has_not_listed_as_acceptable_permission_sources: matches.some(
      (m) => m.match === NOT_LISTED
    ),
    model_limitations: [],
  };
}

function mockAggregationAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment["status"];
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment {
  const status =
    options?.status ?? "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT";
  const policy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy | null =
    present
      ? {
          key: AGG_POLICY_KEY,
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          dimension: "PERMISSION",
          operational_eligibility_dimension_policy_key: POLICY_KEY,
          aggregation_kind: ANY,
        }
      : null;
  return {
    candidate_key: CAND,
    operational_eligibility_dimension_policy_assessment: {
      candidate_key: CAND,
      capability_requirement_assessment: {} as never,
      status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
      operational_eligibility_dimension_policy: {
        key: POLICY_KEY,
        candidate_key: CAND,
        observation_need_key: NEED_KEY,
        capability_requirement_set_key: SET_KEY,
        capability_requirement_keys: ["req"],
        required_dimensions: ["PERMISSION"],
      },
      model_limitations: [],
    },
    status,
    permission_source_aggregation_policy: policy,
    has_explicit_permission_source_aggregation_policy: policy !== null,
    model_limitations: [],
  };
}

function mockReadinessAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment["status"];
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const policy: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy | null =
    present
      ? {
          key: READY_POLICY_KEY,
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          dimension: "PERMISSION",
          operational_eligibility_dimension_policy_key: POLICY_KEY,
          readiness_kind: NON_EMPTY,
        }
      : null;
  return {
    candidate_key: CAND,
    operational_eligibility_dimension_policy_assessment: {
      candidate_key: CAND,
      capability_requirement_assessment: {} as never,
      status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
      operational_eligibility_dimension_policy: {
        key: POLICY_KEY,
        candidate_key: CAND,
        observation_need_key: NEED_KEY,
        capability_requirement_set_key: SET_KEY,
        capability_requirement_keys: ["req"],
        required_dimensions: ["PERMISSION"],
      },
      model_limitations: [],
    },
    status,
    permission_source_aggregation_readiness_policy: policy,
    has_explicit_permission_source_aggregation_readiness_policy:
      policy !== null,
    model_limitations: [],
  };
}

function build103(options?: {
  matches?: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch[];
  aggregationStatus?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment["status"];
  readinessStatus?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment["status"];
  matchStatus?: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment["status"];
}) {
  const match = mockMatchAssessment({
    status: options?.matchStatus,
    matches: options?.matches,
  });
  const aggregation = mockAggregationAssessment({
    status: options?.aggregationStatus,
  });
  const readiness = mockReadinessAssessment({
    status: options?.readinessStatus,
  });
  const readinessSet =
    buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSet(
      {
        permission_source_acceptance_match_set: {
          permission_state_source_set: {} as never,
          permission_source_acceptance_criteria_set: {} as never,
          candidate_assessments: [match],
          has_permission_source_acceptance_matches:
            match.has_permission_source_acceptance_matches,
          has_listed_as_acceptable_permission_sources:
            match.has_listed_as_acceptable_permission_sources,
          has_not_listed_as_acceptable_permission_sources:
            match.has_not_listed_as_acceptable_permission_sources,
          model_limitations: [],
        },
        permission_source_aggregation_policy_set: {
          operational_eligibility_dimension_policy_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [aggregation],
          has_explicit_permission_source_aggregation_policies:
            aggregation.has_explicit_permission_source_aggregation_policy,
          model_limitations: [],
        },
        permission_source_aggregation_readiness_policy_set: {
          operational_eligibility_dimension_policy_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [readiness],
          has_explicit_permission_source_aggregation_readiness_policies:
            readiness.has_explicit_permission_source_aggregation_readiness_policy,
          model_limitations: [],
        },
      }
    );
  const resultSet =
    buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
      {
        permission_source_acceptance_match_set:
          readinessSet.permission_source_acceptance_match_set,
        permission_source_aggregation_policy_set:
          readinessSet.permission_source_aggregation_policy_set,
        permission_source_aggregation_readiness_basis_set: readinessSet,
      }
    );
  return buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSet(
    { permission_source_aggregation_result_set: resultSet }
  );
}

function mockOePolicy(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment["status"];
  required_dimensions?: AttentionObservationOperationalEligibilityDimensionPolicy["required_dimensions"];
}): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  return {
    candidate_key: CAND,
    capability_requirement_assessment: {} as never,
    status,
    operational_eligibility_dimension_policy: present
      ? {
          key: POLICY_KEY,
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          capability_requirement_keys: ["req"],
          required_dimensions: options?.required_dimensions ?? [
            "CAPABILITY_STATE",
            "PERMISSION",
          ],
        }
      : null,
    model_limitations: [],
  };
}

function build104(
  mappings: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[] | null = [
    mapping(HOLDS, AS_SATISFIED),
  ],
  oe = mockOePolicy()
) {
  return buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySet(
    {
      operational_eligibility_dimension_policy_set: {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [oe],
        has_explicit_operational_eligibility_dimension_policies:
          oe.operational_eligibility_dimension_policy !== null,
        model_limitations: [],
      },
      specification: {
        policies:
          mappings === null
            ? []
            : [{ candidate_key: CAND, mappings }],
      },
    }
  );
}

function build105(
  stateSet = build103(),
  policySet = build104()
) {
  return buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSet(
    {
      permission_dimension_evaluation_state_set: stateSet,
      permission_dimension_evaluation_state_interpretation_policy_set: policySet,
    }
  );
}

function build106(basisSet = build105()) {
  return buildAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSet(
    {
      permission_dimension_evaluation_state_interpretation_basis_set: basisSet,
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

function firstState(set: ReturnType<typeof build106>) {
  return set.candidate_assessments[0]!
    .permission_dimension_satisfaction_state!
    .permission_dimension_satisfaction_state;
}

function firstBasis(set: ReturnType<typeof build106>) {
  return set.candidate_assessments[0]!.permission_dimension_satisfaction_state_basis!;
}

describe("GROUND-106 Permission Dimension Satisfaction State", () => {
  describe("105 → 106 mappings", () => {
    it("conventional HOLDS→SATISFIED interpretation → PERMISSION_DIMENSION_SATISFIED", () => {
      const set = build106(
        build105(build103(), build104([mapping(HOLDS, AS_SATISFIED)]))
      );
      assert.equal(firstState(set), "PERMISSION_DIMENSION_SATISFIED");
      assert.equal(
        set.candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_SATISFACTION_STATE_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[0]!.has_permission_dimension_satisfaction_state,
        true
      );
      assert.equal(
        firstBasis(set).interpretation,
        AS_SATISFIED
      );
      assertNoForbiddenSemantics(set);
    });

    it("conventional DOES_NOT_HOLD→UNSATISFIED interpretation → PERMISSION_DIMENSION_UNSATISFIED", () => {
      const set = build106(
        build105(
          build103({ matches: [mockMatch({ match: NOT_LISTED })] }),
          build104([mapping(DOES_NOT_HOLD, AS_UNSATISFIED)])
        )
      );
      assert.equal(firstState(set), "PERMISSION_DIMENSION_UNSATISFIED");
      assert.equal(firstBasis(set).permission_dimension_evaluation_state, DOES_NOT_HOLD);
    });

    it("reverse HOLDS mapping → PERMISSION_DIMENSION_UNSATISFIED", () => {
      const set = build106(
        build105(build103(), build104([mapping(HOLDS, AS_UNSATISFIED)]))
      );
      assert.equal(firstState(set), "PERMISSION_DIMENSION_UNSATISFIED");
      assert.equal(firstBasis(set).permission_dimension_evaluation_state, HOLDS);
    });

    it("reverse DOES_NOT_HOLD mapping → PERMISSION_DIMENSION_SATISFIED", () => {
      const set = build106(
        build105(
          build103({ matches: [mockMatch({ match: NOT_LISTED })] }),
          build104([mapping(DOES_NOT_HOLD, AS_SATISFIED)])
        )
      );
      assert.equal(firstState(set), "PERMISSION_DIMENSION_SATISFIED");
      assert.equal(firstBasis(set).permission_dimension_evaluation_state, DOES_NOT_HOLD);
    });

    it("unresolved 103 + explicit SATISFIED interpretation → SATISFIED; 103 remains unresolved", () => {
      const set = build106(
        build105(
          build103({
            aggregationStatus:
              "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED",
          }),
          build104([mapping(UNRESOLVED_POLICY, AS_SATISFIED)])
        )
      );
      assert.equal(firstState(set), "PERMISSION_DIMENSION_SATISFIED");
      assert.equal(
        firstBasis(set).permission_dimension_evaluation_state,
        UNRESOLVED_POLICY
      );
      assert.equal(
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_basis_assessment
          .permission_dimension_evaluation_state_assessment
          .permission_dimension_evaluation_state!
          .permission_dimension_evaluation_state,
        UNRESOLVED_POLICY
      );
    });

    it("unresolved 103 + explicit UNSATISFIED interpretation → UNSATISFIED", () => {
      const set = build106(
        build105(
          build103({
            aggregationStatus:
              "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED",
          }),
          build104([mapping(UNRESOLVED_POLICY, AS_UNSATISFIED)])
        )
      );
      assert.equal(firstState(set), "PERMISSION_DIMENSION_UNSATISFIED");
    });

    it("105 NO_POLICY → unresolved policy absence; not UNSATISFIED", () => {
      const set = build106(build105(build103(), build104(null)));
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY"
      );
      assert.equal(firstBasis(set).interpretation, null);
      assert.equal(
        firstBasis(set).permission_dimension_evaluation_state_interpretation_policy_key,
        null
      );
      assert.equal(
        firstBasis(set).permission_dimension_evaluation_state_interpretation_basis_key,
        null
      );
    });

    it("105 NO_MAPPING → unresolved mapping absence; not UNSATISFIED; policy lineage retained", () => {
      const set = build106(build105(build103(), build104([])));
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
      assert.equal(firstBasis(set).interpretation, null);
      assert.ok(
        firstBasis(set).permission_dimension_evaluation_state_interpretation_policy_key!
          .length > 0
      );
      assert.equal(
        firstBasis(set).permission_dimension_evaluation_state_interpretation_basis_key,
        null
      );
    });

    it("partial policy unmapped current state → NO_MAPPING unresolved", () => {
      const set = build106(
        build105(
          build103({ matches: [mockMatch({ match: NOT_LISTED })] }),
          build104([mapping(HOLDS, AS_SATISFIED)])
        )
      );
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
    });

    it("NO_POLICY != NO_MAPPING distinct states", () => {
      const noPolicy = build106(build105(build103(), build104(null)));
      const noMapping = build106(build105(build103(), build104([])));
      assert.notEqual(firstState(noPolicy), firstState(noMapping));
    });
  });

  describe("resolved helper / booleans / outer", () => {
    it("SATISFIED and UNSATISFIED resolved; unresolved states not resolved", () => {
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState(
          "PERMISSION_DIMENSION_SATISFIED"
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState(
          "PERMISSION_DIMENSION_UNSATISFIED"
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState(
          "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY"
        ),
        false
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState(
          "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
        ),
        false
      );
    });

    it("all four canonical states have has_permission_dimension_satisfaction_state = true", () => {
      for (const basisSet of [
        build105(build103(), build104([mapping(HOLDS, AS_SATISFIED)])),
        build105(build103(), build104([mapping(HOLDS, AS_UNSATISFIED)])),
        build105(build103(), build104(null)),
        build105(build103(), build104([])),
      ]) {
        const set = build106(basisSet);
        assert.equal(
          set.candidate_assessments[0]!.has_permission_dimension_satisfaction_state,
          true
        );
      }
    });

    it("outer statuses → no Satisfaction State; has = false", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
      ] as const) {
        const stateSet = build103({
          matchStatus: status as never,
          aggregationStatus: status as never,
          readinessStatus: status as never,
          matches: [],
        });
        const policySet =
          status === "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
            ? build104(
                null,
                mockOePolicy({ required_dimensions: ["CAPABILITY_STATE"] })
              )
            : build104(null, mockOePolicy({ status: status as never }));
        const set = build106(build105(stateSet, policySet));
        assert.equal(set.candidate_assessments[0]!.status, status);
        assert.equal(
          set.candidate_assessments[0]!.permission_dimension_satisfaction_state,
          null
        );
        assert.equal(
          set.candidate_assessments[0]!.has_permission_dimension_satisfaction_state,
          false
        );
      }
    });

    it("set booleans are existence summaries only", () => {
      const set = build106(
        build105(build103(), build104([mapping(HOLDS, AS_SATISFIED)]))
      );
      assert.equal(set.has_permission_dimension_satisfaction_states, true);
      assert.equal(set.has_resolved_permission_dimension_satisfaction_states, true);
      assert.equal(set.has_unresolved_permission_dimension_satisfaction_states, false);
      assert.equal(set.has_permission_dimension_satisfied_states, true);
      assert.equal(set.has_permission_dimension_unsatisfied_states, false);
    });
  });

  describe("identity / provenance / malformed", () => {
    it("Satisfaction Basis and State keys rebuild; provenance preserved", () => {
      const set = build106();
      const basis = firstBasis(set);
      const state = set.candidate_assessments[0]!.permission_dimension_satisfaction_state!;
      const basis105 =
        set.candidate_assessments[0]!
          .permission_dimension_evaluation_state_interpretation_basis_assessment
          .permission_dimension_evaluation_state_interpretation_basis!;

      assert.equal(
        basis.key,
        attentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasisKey(
          {
            candidate_key: basis.candidate_key,
            observation_need_key: basis.observation_need_key,
            capability_requirement_set_key: basis.capability_requirement_set_key,
            permission_dimension_satisfaction_state:
              basis.permission_dimension_satisfaction_state,
            permission_dimension_evaluation_state_key:
              basis.permission_dimension_evaluation_state_key,
            permission_dimension_evaluation_state_basis_key:
              basis.permission_dimension_evaluation_state_basis_key,
            permission_dimension_evaluation_state_interpretation_policy_key:
              basis.permission_dimension_evaluation_state_interpretation_policy_key,
            permission_dimension_evaluation_state_interpretation_basis_key:
              basis.permission_dimension_evaluation_state_interpretation_basis_key,
            interpretation: basis.interpretation,
            interpretation_basis_status: basis.interpretation_basis_status,
          }
        )
      );
      assert.equal(
        state.key,
        attentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateKey(
          {
            candidate_key: state.candidate_key,
            observation_need_key: state.observation_need_key,
            capability_requirement_set_key: state.capability_requirement_set_key,
            permission_dimension_satisfaction_state:
              state.permission_dimension_satisfaction_state,
            permission_dimension_satisfaction_state_basis_key: basis.key,
          }
        )
      );
      assert.equal(
        basis.permission_dimension_evaluation_state_interpretation_basis_key,
        basis105.key
      );
      assert.equal(
        basis.permission_dimension_evaluation_state_interpretation_policy_key,
        basis105.permission_dimension_evaluation_state_interpretation_policy_key
      );
    });

    it("interpretation target change changes Satisfaction Basis key", () => {
      const sat = build106(
        build105(build103(), build104([mapping(HOLDS, AS_SATISFIED)]))
      );
      const unsat = build106(
        build105(build103(), build104([mapping(HOLDS, AS_UNSATISFIED)]))
      );
      assert.notEqual(firstBasis(sat).key, firstBasis(unsat).key);
      assert.notEqual(
        sat.candidate_assessments[0]!.permission_dimension_satisfaction_state!.key,
        unsat.candidate_assessments[0]!.permission_dimension_satisfaction_state!.key
      );
    });

    it("malformed 105 BASIS_PRESENT + null Basis rejects", () => {
      const basisSet = build105();
      const forged = {
        ...basisSet,
        candidate_assessments: [
          {
            ...basisSet.candidate_assessments[0]!,
            permission_dimension_evaluation_state_interpretation_basis: null,
            has_permission_dimension_evaluation_state_interpretation_basis: false,
          },
        ],
      };
      assert.throws(
        () =>
          assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionState(
            forged.candidate_assessments[0]!
          ),
        /requires non-null Interpretation Basis/
      );
    });

    it("malformed 105 NO_POLICY + Basis rejects", () => {
      const basisSet = build105(build103(), build104(null));
      const forged = {
        ...basisSet.candidate_assessments[0]!,
        status:
          "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED" as const,
        permission_dimension_evaluation_state_interpretation_basis: {
          ...basisSet.candidate_assessments[0]!
            .permission_dimension_evaluation_state_interpretation_basis!,
        },
        has_permission_dimension_evaluation_state_interpretation_basis: true,
      };
      assert.throws(
        () =>
          mapInterpretationBasisAssessmentToSatisfactionState(forged),
        /non-present Interpretation Basis status requires null Basis/
      );
    });

    it("malformed 105 NO_MAPPING + Basis rejects", () => {
      const basisSet = build105(build103(), build104([]));
      const forged = {
        ...basisSet.candidate_assessments[0]!,
        permission_dimension_evaluation_state_interpretation_basis: {
          ...build105(build103(), build104([mapping(HOLDS, AS_SATISFIED)]))
            .candidate_assessments[0]!
            .permission_dimension_evaluation_state_interpretation_basis!,
        },
        has_permission_dimension_evaluation_state_interpretation_basis: true,
      };
      assert.throws(
        () =>
          mapInterpretationBasisAssessmentToSatisfactionState(forged),
        /non-present Interpretation Basis status requires null Basis/
      );
    });
  });

  describe("immutability / static boundaries", () => {
    it("input immutability + deep-cloned same output + determinism", () => {
      const input = {
        permission_dimension_evaluation_state_interpretation_basis_set: build105(
          build103(),
          build104([
            mapping(HOLDS, AS_SATISFIED),
            mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
          ])
        ),
      };
      const before = deepClone(input);
      const a = buildAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSet(
        input
      );
      const b = buildAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSet(
        deepClone(input)
      );
      const c = buildAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSet(
        input
      );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; 105-only runtime; no 103/104/094/095/091 polarity inference", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
      );

      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-permission-dimension-satisfaction-state-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-permission-dimension-satisfaction-state-types.ts"
      );
      const src =
        stripComments(readFileSync(corePath, "utf8")) +
        "\n" +
        stripComments(readFileSync(typesPath, "utf8"));

      assert.ok(
        /permission-dimension-evaluation-state-interpretation-basis-types\.js/.test(
          src
        )
      );
      assert.ok(
        !/permission-dimension-evaluation-state-interpretation-basis-core/.test(
          src
        )
      );
      assert.ok(
        !/permission-dimension-evaluation-state-core/.test(src)
      );
      assert.ok(
        !/permission-dimension-evaluation-state-interpretation-policy-core/.test(
          src
        )
      );
      assert.ok(!/permission-source-aggregation-result/.test(src));
      assert.ok(!/permission-required-dimension-coverage/.test(src));
      assert.ok(!/permission-source-resolution-classification/.test(src));
      assert.ok(!/declared-permission-state/.test(src));
      assert.ok(!/operational-eligibility-dimension-policy-core/.test(src));
      assert.ok(!/from ["'].*state-engine/.test(src));
      assert.ok(!/ProjectState/.test(src));
      assert.ok(!/applyPatch/.test(src));
      assert.ok(!/saveProject/.test(src));
      assert.ok(!/Date\.now\(/.test(src));
      assert.ok(!/new Date\(/.test(src));
      assert.ok(!/performance\.now\(/.test(src));
      assert.ok(!/PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS/.test(src));
      assert.ok(!/PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD/.test(src));
      assert.ok(!/findExactPermissionDimension/.test(src));
      assert.ok(!/HOLDS.*SATISFIED.*default/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/effective_permission/.test(src));
      assert.ok(!/"PERMISSION_PERMITTED"/.test(src));
      assert.ok(!/"PERMISSION_PROHIBITED"/.test(src));
    });
  });
});
