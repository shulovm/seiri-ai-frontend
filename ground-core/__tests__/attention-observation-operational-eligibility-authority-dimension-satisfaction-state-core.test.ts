/**
 * GROUND-130 — Observation Core LXXXIV / AUTHORITY Dimension Satisfaction State Foundation
 *
 * Pure GROUND-127 current Evaluation State + GROUND-128 interpretation policy
 * (exact token lookup; NO_POLICY ≠ NO_MAPPING; no Satisfaction).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSet,
} from "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-basis-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfaction,
  attentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasisKey,
  attentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateKey,
  buildAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSet,
  isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState,
  mapInterpretationBasisAssessmentToAuthorityDimensionSatisfactionState,
} from "../reality/attention-observation-operational-eligibility-authority-dimension-satisfaction-state-core.js";
import { buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet } from "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-core.js";
import { buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySet } from "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-core.js";
import { buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSet } from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-result-core.js";
import { buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet } from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch,
} from "../reality/attention-observation-operational-eligibility-authority-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy,
} from "../reality/attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-types.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
} from "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-types.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const AGG_POLICY_KEY =
  "attention-observation-operational-eligibility-authority-source-aggregation-policy|cand|need|set|084|AUTHORITY|ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE";
const READY_POLICY_KEY =
  "attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy|cand|need|set|084|AUTHORITY|REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION";
const ANY =
  "ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE" as const;
const NON_EMPTY =
  "REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION" as const;
const LISTED = "LISTED_AS_ACCEPTABLE" as const;
const NOT_LISTED = "NOT_LISTED_AS_ACCEPTABLE" as const;

const HOLDS =
  "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS" as const;
const DOES_NOT_HOLD =
  "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_POLICY =
  "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_CONDITION =
  "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" as const;

const AS_SATISFIED =
  "INTERPRET_AS_AUTHORITY_DIMENSION_SATISFIED" as const;
const AS_UNSATISFIED =
  "INTERPRET_AS_AUTHORITY_DIMENSION_UNSATISFIED" as const;

function mapping(
  state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
  interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping {
  return {
    authority_dimension_evaluation_state: state,
    interpretation,
  };
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"has_effective_authority"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
}

function mockMatch(options: {
  match: "LISTED_AS_ACCEPTABLE" | "NOT_LISTED_AS_ACCEPTABLE";
  binding_suffix?: string;
}): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch {
  const suffix = options.binding_suffix ?? "a";
  return {
    key: `121-match|${CAND}|${suffix}|${options.match}`,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key: `binding|${suffix}`,
    authority_holder_entity_id: `holder|${suffix}`,
    authority_power: "AUTHORIZE_INTERVENTION",
    governance_scope: { kind: "INTERVENTION_DECLARATION", intervention_id: "int-1" },
    governance_scope_key: "governance-scope|int-1",
    authority_evaluation_instant_key: `instant|${suffix}`,
    authority_evaluation_at: "2026-08-24T11:00:00.000Z",
    authority_source_key: `117-source|${suffix}`,
    canonical_authority_state_key: `state|${suffix}`,
    canonical_authority_state_basis_key: `basis|${suffix}`,
    canonical_authority_state_value: "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE",
    authority_source_acceptance_criterion_key: "120-criterion",
    match: options.match,
  };
}

function mockMatchAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment["status"];
  matches?: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch[];
  required_dimensions?: ("AUTHORITY" | "CAPABILITY_STATE")[];
  policy_key?: string;
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment {
  const status =
    options?.status ?? "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT";
  const matches =
    options?.matches ??
    (status === "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      ? [mockMatch({ match: LISTED })]
      : []);
  const required_dimensions = options?.required_dimensions ?? ["AUTHORITY"];
  const policy_key = options?.policy_key ?? POLICY_KEY;

  return {
    candidate_key: CAND,
    authority_source_bridge_assessment: {} as never,
    authority_source_acceptance_criteria_assessment: {
      candidate_key: CAND,
      operational_eligibility_dimension_policy_assessment: {
        candidate_key: CAND,
        capability_requirement_assessment: {} as never,
        status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
        operational_eligibility_dimension_policy: {
          key: policy_key,
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          capability_requirement_keys: ["req"],
          required_dimensions,
        },
        model_limitations: [],
      },
      status: "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT",
      authority_source_acceptance_criterion: null,
      has_explicit_authority_source_acceptance_criterion: false,
      model_limitations: [],
    },
    status,
    authority_source_acceptance_matches: matches,
    has_authority_source_acceptance_matches: matches.length > 0,
    has_listed_as_acceptable_authority_sources: matches.some(
      (m) => m.match === LISTED
    ),
    has_not_listed_as_acceptable_authority_sources: matches.some(
      (m) => m.match === NOT_LISTED
    ),
    model_limitations: [],
  };
}

function mockAggregationAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment["status"];
  kind?: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind;
  policy_key?: string;
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment {
  const status =
    options?.status ?? "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT";
  const oePolicyKey = options?.policy_key ?? POLICY_KEY;
  const policy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy | null =
    present
      ? {
          key: AGG_POLICY_KEY,
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          dimension: "AUTHORITY",
          operational_eligibility_dimension_policy_key: oePolicyKey,
          aggregation_kind: options?.kind ?? ANY,
        }
      : null;

  return {
    candidate_key: CAND,
    operational_eligibility_dimension_policy_assessment: {
      candidate_key: CAND,
      capability_requirement_assessment: {} as never,
      status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
      operational_eligibility_dimension_policy: {
        key: oePolicyKey,
        candidate_key: CAND,
        observation_need_key: NEED_KEY,
        capability_requirement_set_key: SET_KEY,
        capability_requirement_keys: ["req"],
        required_dimensions: ["AUTHORITY"],
      },
      model_limitations: [],
    },
    status,
    authority_source_aggregation_policy: policy,
    has_explicit_authority_source_aggregation_policy: policy !== null,
    model_limitations: [],
  };
}

function mockReadinessAssessment(options?: {
  status?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment["status"];
  policy_key?: string;
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT";
  const oePolicyKey = options?.policy_key ?? POLICY_KEY;
  const policy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy | null =
    present
      ? {
          key: READY_POLICY_KEY,
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: SET_KEY,
          dimension: "AUTHORITY",
          operational_eligibility_dimension_policy_key: oePolicyKey,
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
        key: oePolicyKey,
        candidate_key: CAND,
        observation_need_key: NEED_KEY,
        capability_requirement_set_key: SET_KEY,
        capability_requirement_keys: ["req"],
        required_dimensions: ["AUTHORITY"],
      },
      model_limitations: [],
    },
    status,
    authority_source_aggregation_readiness_policy: policy,
    has_explicit_authority_source_aggregation_readiness_policy:
      policy !== null,
    model_limitations: [],
  };
}

function build125(
  match = mockMatchAssessment(),
  aggregation = mockAggregationAssessment(),
  readiness = mockReadinessAssessment()
) {
  const readinessSet =
    buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet(
      {
        authority_source_acceptance_match_set: {
          authority_source_bridge_set: {} as never,
          authority_source_acceptance_criteria_set: {} as never,
          candidate_assessments: [match],
          has_authority_source_acceptance_matches:
            match.has_authority_source_acceptance_matches,
          has_listed_as_acceptable_authority_sources:
            match.has_listed_as_acceptable_authority_sources,
          has_not_listed_as_acceptable_authority_sources:
            match.has_not_listed_as_acceptable_authority_sources,
          model_limitations: [],
        },
        authority_source_aggregation_policy_set: {
          operational_eligibility_dimension_policy_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [aggregation],
          has_explicit_authority_source_aggregation_policies:
            aggregation.has_explicit_authority_source_aggregation_policy,
          model_limitations: [],
        },
        authority_source_aggregation_readiness_policy_set: {
          operational_eligibility_dimension_policy_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [readiness],
          has_explicit_authority_source_aggregation_readiness_policies:
            readiness.has_explicit_authority_source_aggregation_readiness_policy,
          model_limitations: [],
        },
      }
    );

  return buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSet(
    {
      authority_source_acceptance_match_set:
        readinessSet.authority_source_acceptance_match_set,
      authority_source_aggregation_policy_set:
        readinessSet.authority_source_aggregation_policy_set,
      authority_source_aggregation_readiness_basis_set: readinessSet,
    }
  );
}

function build127(
  match = mockMatchAssessment(),
  aggregation?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  readiness?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment
) {
  const oePolicyKey =
    match.authority_source_acceptance_criteria_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy?.key ?? POLICY_KEY;
  const agg =
    aggregation ??
    mockAggregationAssessment({ policy_key: oePolicyKey });
  const ready =
    readiness ?? mockReadinessAssessment({ policy_key: oePolicyKey });
  return buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet(
    {
      authority_source_aggregation_result_set: build125(match, agg, ready),
    }
  );
}

function build127NotRequired() {
  return build127(
    mockMatchAssessment({
      status: "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
      matches: [],
    }),
    mockAggregationAssessment({
      status: "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
    }),
    mockReadinessAssessment({
      status: "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
    })
  );
}


function build127Options(options?: {
  matches?: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch[];
  aggregationStatus?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment["status"];
  readinessStatus?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment["status"];
  matchStatus?: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment["status"];
}) {
  return build127(
    mockMatchAssessment({
      status: options?.matchStatus,
      matches: options?.matches,
    }),
    options?.aggregationStatus
      ? mockAggregationAssessment({ status: options.aggregationStatus })
      : undefined,
    options?.readinessStatus
      ? mockReadinessAssessment({ status: options.readinessStatus })
      : undefined
  );
}

function pmap(
  ...mappings: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[]
) {
  return [{ candidate_key: CAND, mappings }];
}

function build128(
  evaluation127 = build127(),
  policies: {
    candidate_key: string;
    mappings: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[];
  }[] | null = [{ candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] }]
) {
  return buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySet(
    {
      authority_dimension_evaluation_state_set: evaluation127,
      specification: {
        policies:
          policies === null
            ? []
            : policies,
      },
    }
  );
}

function build129(
  state127 = build127(),
  policy128 = build128(state127)
) {
  return buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSet(
    {
      authority_dimension_evaluation_state_set: state127,
      authority_dimension_evaluation_state_interpretation_policy_set: policy128,
    }
  );
}

function build128Set(
  evaluation127 = build127(),
  policies: {
    candidate_key: string;
    mappings: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[];
  }[] = [{ candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] }]
) {
  return buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySet(
    {
      authority_dimension_evaluation_state_set: evaluation127,
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

function build130(basis129 = build129()) {
  return buildAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSet(
    {
      authority_dimension_evaluation_state_interpretation_basis_set: basis129,
    }
  );
}

function firstState(set: ReturnType<typeof build130>) {
  return set.candidate_assessments[0]!
    .authority_dimension_satisfaction_state!.satisfaction_state;
}

function firstBasis(set: ReturnType<typeof build130>) {
  return set.candidate_assessments[0]!.authority_dimension_satisfaction_basis!;
}

describe("GROUND-130 AUTHORITY Dimension Satisfaction State", () => {
  describe("129 → 130 mappings", () => {
    it("BASIS_PRESENT + SATISFIED interpretation → AUTHORITY_DIMENSION_SATISFIED", () => {
      const set = build130(
        build129(build127(), build128(build127(), pmap(mapping(HOLDS, AS_SATISFIED))))
      );
      assert.equal(firstState(set), "AUTHORITY_DIMENSION_SATISFIED");
      assert.equal(
        set.candidate_assessments[0]!.status,
        "AUTHORITY_DIMENSION_SATISFACTION_STATE_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[0]!.has_authority_dimension_satisfaction_state,
        true
      );
      assert.equal(
        firstBasis(set).interpretation,
        AS_SATISFIED
      );
      assertNoForbiddenSemantics(set);
    });

    it("BASIS_PRESENT + UNSATISFIED interpretation → AUTHORITY_DIMENSION_UNSATISFIED", () => {
      const set = build130(
        build129(
          build127Options({ matches: [mockMatch({ match: NOT_LISTED })] }),
          build128(build127(), pmap(mapping(DOES_NOT_HOLD, AS_UNSATISFIED)))
        )
      );
      assert.equal(firstState(set), "AUTHORITY_DIMENSION_UNSATISFIED");
      assert.equal(firstBasis(set).authority_dimension_evaluation_state, DOES_NOT_HOLD);
    });

    it("reverse HOLDS mapping → AUTHORITY_DIMENSION_UNSATISFIED", () => {
      const set = build130(
        build129(build127(), build128(build127(), pmap(mapping(HOLDS, AS_UNSATISFIED))))
      );
      assert.equal(firstState(set), "AUTHORITY_DIMENSION_UNSATISFIED");
      assert.equal(firstBasis(set).authority_dimension_evaluation_state, HOLDS);
    });

    it("reverse DOES_NOT_HOLD mapping → AUTHORITY_DIMENSION_SATISFIED", () => {
      const set = build130(
        build129(
          build127Options({ matches: [mockMatch({ match: NOT_LISTED })] }),
          build128(build127(), pmap(mapping(DOES_NOT_HOLD, AS_SATISFIED)))
        )
      );
      assert.equal(firstState(set), "AUTHORITY_DIMENSION_SATISFIED");
      assert.equal(firstBasis(set).authority_dimension_evaluation_state, DOES_NOT_HOLD);
    });

    it("unresolved 127 ancestry + explicit SATISFIED interpretation → SATISFIED; 103 remains unresolved", () => {
      const set = build130(
        build129(
          build127Options({
            aggregationStatus:
              "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED",
          }),
          build128(build127(), pmap(mapping(UNRESOLVED_POLICY, AS_SATISFIED)))
        )
      );
      assert.equal(firstState(set), "AUTHORITY_DIMENSION_SATISFIED");
      assert.equal(
        firstBasis(set).authority_dimension_evaluation_state,
        UNRESOLVED_POLICY
      );
      assert.equal(
        set.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_basis_assessment
          .authority_dimension_evaluation_state_assessment
          .authority_dimension_evaluation_state!
          .authority_dimension_evaluation_state,
        UNRESOLVED_POLICY
      );
    });

    it("unresolved 127 ancestry + explicit UNSATISFIED interpretation → UNSATISFIED", () => {
      const set = build130(
        build129(
          build127Options({
            aggregationStatus:
              "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED",
          }),
          build128(build127(), pmap(mapping(UNRESOLVED_POLICY, AS_UNSATISFIED)))
        )
      );
      assert.equal(firstState(set), "AUTHORITY_DIMENSION_UNSATISFIED");
    });

    it("129 NO_POLICY → unresolved policy absence; not UNSATISFIED", () => {
      const set = build130(build129(build127(), build128(build127(), null)));
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY"
      );
      assert.equal(firstBasis(set).interpretation, null);
      assert.equal(
        firstBasis(set).authority_dimension_evaluation_state_interpretation_policy_key,
        null
      );
      assert.equal(
        firstBasis(set).authority_dimension_evaluation_state_interpretation_basis_key,
        null
      );
    });

    it("129 NO_MAPPING → unresolved mapping absence; not UNSATISFIED; policy lineage retained", () => {
      const set = build130(build129(build127(), build128(build127(), pmap())));
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
      assert.equal(firstBasis(set).interpretation, null);
      assert.ok(
        firstBasis(set).authority_dimension_evaluation_state_interpretation_policy_key!
          .length > 0
      );
      assert.equal(
        firstBasis(set).authority_dimension_evaluation_state_interpretation_basis_key,
        null
      );
    });

    it("partial policy unmapped current state → NO_MAPPING unresolved", () => {
      const set = build130(
        build129(
          build127Options({ matches: [mockMatch({ match: NOT_LISTED })] }),
          build128(build127(), pmap(mapping(HOLDS, AS_SATISFIED)))
        )
      );
      assert.equal(
        firstState(set),
        "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
    });

    it("NO_POLICY != NO_MAPPING distinct states", () => {
      const noPolicy = build130(build129(build127(), build128(build127(), null)));
      const noMapping = build130(build129(build127(), build128(build127(), pmap())));
      assert.notEqual(firstState(noPolicy), firstState(noMapping));
    });
  });

  describe("resolved helper / booleans / outer", () => {
    it("SATISFIED and UNSATISFIED resolved; unresolved states not resolved", () => {
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState(
          "AUTHORITY_DIMENSION_SATISFIED"
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState(
          "AUTHORITY_DIMENSION_UNSATISFIED"
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState(
          "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY"
        ),
        false
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState(
          "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
        ),
        false
      );
    });

    it("all four canonical states have has_authority_dimension_satisfaction_state = true", () => {
      for (const basisSet of [
        build129(build127(), build128(build127(), pmap(mapping(HOLDS, AS_SATISFIED)))),
        build129(build127(), build128(build127(), pmap(mapping(HOLDS, AS_UNSATISFIED)))),
        build129(build127(), build128(build127(), null)),
        build129(build127(), build128(build127(), pmap())),
      ]) {
        const set = build130(basisSet);
        assert.equal(
          set.candidate_assessments[0]!.has_authority_dimension_satisfaction_state,
          true
        );
      }
    });

    it("outer statuses → no Satisfaction State; has = false", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
      ] as const) {
        const stateSet = build127Options({
          matchStatus: status as never,
          aggregationStatus: status as never,
          readinessStatus: status as never,
          matches: [],
        });
        const policySet =
          status === "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
            ? build128(build127NotRequired(), null)
            : build128(
                build127Options({
                  matchStatus: status as never,
                  aggregationStatus: status as never,
                  readinessStatus: status as never,
                  matches: [],
                }),
                null
              );
        const set = build130(build129(stateSet, policySet));
        assert.equal(set.candidate_assessments[0]!.status, status);
        assert.equal(
          set.candidate_assessments[0]!.authority_dimension_satisfaction_state,
          null
        );
        assert.equal(
          set.candidate_assessments[0]!.has_authority_dimension_satisfaction_state,
          false
        );
      }
    });

    it("set booleans are existence summaries only", () => {
      const set = build130(
        build129(build127(), build128(build127(), pmap(mapping(HOLDS, AS_SATISFIED))))
      );
      assert.equal(set.has_authority_dimension_satisfaction_states, true);
      assert.equal(set.has_resolved_authority_dimension_satisfaction_states, true);
      assert.equal(set.has_unresolved_authority_dimension_satisfaction_states, false);
      assert.equal(
        set.candidate_assessments[0]!.has_resolved_authority_dimension_satisfaction_state,
        true
      );
      assert.equal(
        set.candidate_assessments[0]!.has_unresolved_authority_dimension_satisfaction_state,
        false
      );
    });
  });

  describe("identity / provenance / malformed", () => {
    it("Satisfaction Basis and State keys rebuild; provenance preserved", () => {
      const set = build130();
      const basis = firstBasis(set);
      const state = set.candidate_assessments[0]!.authority_dimension_satisfaction_state!;
      const basis129 =
        set.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_basis_assessment
          .authority_dimension_evaluation_state_interpretation_basis!;

      assert.equal(
        basis.key,
        attentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasisKey(
          {
            candidate_key: basis.candidate_key,
            observation_need_key: basis.observation_need_key,
            capability_requirement_set_key: basis.capability_requirement_set_key,
            interpretation_basis_status: basis.interpretation_basis_status,
            authority_dimension_evaluation_state_interpretation_basis_key:
              basis.authority_dimension_evaluation_state_interpretation_basis_key,
            authority_dimension_evaluation_state_key:
              basis.authority_dimension_evaluation_state_key,
            authority_dimension_evaluation_state_basis_key:
              basis.authority_dimension_evaluation_state_basis_key,
            authority_dimension_evaluation_state:
              basis.authority_dimension_evaluation_state,
            authority_dimension_evaluation_state_interpretation_policy_key:
              basis.authority_dimension_evaluation_state_interpretation_policy_key,
            matched_interpretation_mapping_key:
              basis.matched_interpretation_mapping_key,
            interpretation: basis.interpretation,
            satisfaction_state: basis.satisfaction_state,
          }
        )
      );
      assert.equal(
        state.key,
        attentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateKey(
          {
            basis_key: basis.key,
            candidate_key: state.candidate_key,
            observation_need_key: state.observation_need_key,
            capability_requirement_set_key: state.capability_requirement_set_key,
            satisfaction_state: state.satisfaction_state,
          }
        )
      );
      assert.equal(
        basis.authority_dimension_evaluation_state_interpretation_basis_key,
        basis129.key
      );
      assert.equal(
        basis.authority_dimension_evaluation_state_interpretation_policy_key,
        basis129.authority_dimension_evaluation_state_interpretation_policy_key
      );
    });

    it("interpretation target change changes Satisfaction Basis key", () => {
      const sat = build130(
        build129(build127(), build128(build127(), pmap(mapping(HOLDS, AS_SATISFIED))))
      );
      const unsat = build130(
        build129(build127(), build128(build127(), pmap(mapping(HOLDS, AS_UNSATISFIED))))
      );
      assert.notEqual(firstBasis(sat).key, firstBasis(unsat).key);
      assert.notEqual(
        sat.candidate_assessments[0]!.authority_dimension_satisfaction_state!.key,
        unsat.candidate_assessments[0]!.authority_dimension_satisfaction_state!.key
      );
    });

    it("malformed 129 BASIS_PRESENT + null Basis rejects", () => {
      const basisSet = build129();
      const forged = {
        ...basisSet,
        candidate_assessments: [
          {
            ...basisSet.candidate_assessments[0]!,
            authority_dimension_evaluation_state_interpretation_basis: null,
            has_authority_dimension_evaluation_state_interpretation_basis: false,
          },
        ],
      };
      assert.throws(
        () =>
          assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfaction(
            forged.candidate_assessments[0]!
          ),
        /requires non-null Interpretation Basis/
      );
    });

    it("malformed 129 NO_POLICY + Basis rejects", () => {
      const basisSet = build129(build127(), build128(build127(), null));
      const forged = {
        ...basisSet.candidate_assessments[0]!,
        status:
          "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED" as const,
        authority_dimension_evaluation_state_interpretation_basis: {
          ...basisSet.candidate_assessments[0]!
            .authority_dimension_evaluation_state_interpretation_basis!,
        },
        has_authority_dimension_evaluation_state_interpretation_basis: true,
      };
      assert.throws(
        () =>
          mapInterpretationBasisAssessmentToAuthorityDimensionSatisfactionState(forged),
        /non-present Interpretation Basis status requires null Basis/
      );
    });

    it("malformed 129 NO_MAPPING + Basis rejects", () => {
      const basisSet = build129(build127(), build128(build127(), pmap()));
      const forged = {
        ...basisSet.candidate_assessments[0]!,
        authority_dimension_evaluation_state_interpretation_basis: {
          ...build129(build127(), build128(build127(), pmap(mapping(HOLDS, AS_SATISFIED))))
            .candidate_assessments[0]!
            .authority_dimension_evaluation_state_interpretation_basis!,
        },
        has_authority_dimension_evaluation_state_interpretation_basis: true,
      };
      assert.throws(
        () =>
          mapInterpretationBasisAssessmentToAuthorityDimensionSatisfactionState(forged),
        /non-present Interpretation Basis status requires null Basis/
      );
    });
  });

  describe("immutability / static boundaries", () => {
    it("input immutability + deep-cloned same output + determinism", () => {
      const input = {
        authority_dimension_evaluation_state_interpretation_basis_set: build129(
          build127(),
          build128(
            build127(),
            pmap(mapping(HOLDS, AS_SATISFIED), mapping(DOES_NOT_HOLD, AS_UNSATISFIED))
          )
        ),
      };
      const before = deepClone(input);
      const a = buildAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSet(
        input
      );
      const b = buildAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSet(
        deepClone(input)
      );
      const c = buildAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSet(
        input
      );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; 129-only runtime; no 127/128 polarity inference", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_MODEL_LIMITATIONS[0],
        "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
      );

      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-authority-dimension-satisfaction-state-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-authority-dimension-satisfaction-state-types.ts"
      );
      const src =
        stripComments(readFileSync(corePath, "utf8")) +
        "\n" +
        stripComments(readFileSync(typesPath, "utf8"));

      assert.ok(
        /authority-dimension-evaluation-state-interpretation-basis-types\.js/.test(
          src
        )
      );
      assert.ok(
        !/authority-dimension-evaluation-state-interpretation-basis-core/.test(
          src
        )
      );
      assert.ok(!/authority-dimension-evaluation-state-core/.test(src));
      assert.ok(
        !/authority-dimension-evaluation-state-interpretation-policy-core/.test(
          src
        )
      );
      assert.ok(!/authority-source-aggregation-result-core/.test(src));
      assert.ok(!/authority-required-dimension-coverage/.test(src));
      assert.ok(!/authority-source-resolution-classification/.test(src));
      assert.ok(!/operational-eligibility-dimension-policy-core/.test(src));
      assert.ok(!/from ["'].*state-engine/.test(src));
      assert.ok(!/ProjectState/.test(src));
      assert.ok(!/applyPatch/.test(src));
      assert.ok(!/saveProject/.test(src));
      assert.ok(!/Date\.now\(/.test(src));
      assert.ok(!/new Date\(/.test(src));
      assert.ok(!/performance\.now\(/.test(src));
      assert.ok(!/AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS/.test(src));
      assert.ok(!/AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD/.test(src));
      assert.ok(!/findExactPermissionDimension/.test(src));
      assert.ok(!/HOLDS.*SATISFIED.*default/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/"effective_authority"\s*:/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"NOT_REPRESENTED"/.test(src));
    });
  });
});
