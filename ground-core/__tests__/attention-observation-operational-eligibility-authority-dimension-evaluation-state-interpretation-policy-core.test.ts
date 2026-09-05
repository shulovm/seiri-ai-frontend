/**
 * GROUND-128 — Observation Core LXXXII / Explicit Authority Dimension
 * Evaluation State Interpretation Policy Foundation
 *
 * Pure GROUND-127 context + explicit interpretation-policy specification
 * (declarative only; no current State lookup; no Satisfaction).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_ORDER,
  CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_ORDER,
  EMPTY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET,
  assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy,
  attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyKey,
  buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySet,
  buildCanonicalAuthorityDimensionEvaluationStateInterpretationMappingSetKey,
  canonicalizeAuthorityDimensionEvaluationStateInterpretationMappings,
  normalizeAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-core.js";
import { buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet } from "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-core.js";
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
  assert.ok(!/"AUTHORITY_DIMENSION_SATISFIED"/.test(json));
  assert.ok(!/"AUTHORITY_DIMENSION_UNSATISFIED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"authority_dimension_evaluation_state_interpretation_basis"/.test(json));
  assert.ok(!/"DEFAULT"/.test(json));
  assert.ok(!/"ALL_RESOLVED_STATES"/.test(json));
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

function buildSet(
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

describe("GROUND-128 Explicit Authority Dimension Evaluation State Interpretation Policy", () => {
  describe("mapping vocabulary and unusual mappings", () => {
    it("conventional HOLDS → SATISFIED interpretation; no current Satisfaction", () => {
      const set = buildSet(build127(), [
        { candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] },
      ]);
      const policy =
        set.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy!;
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT"
      );
      assert.deepEqual(policy.mappings, [mapping(HOLDS, AS_SATISFIED)]);
      assertNoForbiddenSemantics(set);
    });

    it("conventional DOES_NOT_HOLD → UNSATISFIED interpretation", () => {
      const set = buildSet(build127(), [
        {
          candidate_key: CAND,
          mappings: [mapping(DOES_NOT_HOLD, AS_UNSATISFIED)],
        },
      ]);
      assert.deepEqual(
        set.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy!
          .mappings,
        [mapping(DOES_NOT_HOLD, AS_UNSATISFIED)]
      );
    });

    it("reverse HOLDS → UNSATISFIED and DOES_NOT_HOLD → SATISFIED allowed", () => {
      const set = buildSet(build127(), [
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
          .authority_dimension_evaluation_state_interpretation_policy!
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
      const set = buildSet(build127(), [
        { candidate_key: CAND, mappings },
      ]);
      assert.deepEqual(
        set.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy!
          .mappings,
        canonicalizeAuthorityDimensionEvaluationStateInterpretationMappings(
          mappings
        )
      );
      assert.deepEqual(
        CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_ORDER,
        [
          HOLDS,
          DOES_NOT_HOLD,
          UNRESOLVED_POLICY,
          UNRESOLVED_READINESS_POLICY,
          UNRESOLVED_READINESS_CONDITION,
        ]
      );
      assert.deepEqual(
        CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_ORDER,
        [AS_SATISFIED, AS_UNSATISFIED]
      );
    });

    it("partial and single mapping valid", () => {
      assert.equal(
        buildSet(build127(), [
          {
            candidate_key: CAND,
            mappings: [
              mapping(HOLDS, AS_SATISFIED),
              mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
            ],
          },
        ]).candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy!
          .mappings.length,
        2
      );
      assert.equal(
        buildSet(build127(), [
          { candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] },
        ]).candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy!
          .mappings.length,
        1
      );
    });
  });

  describe("empty / absence / uniqueness / identity", () => {
    it("explicit empty mapping set → PRESENT; != absence", () => {
      const empty = buildSet(build127(), [
        { candidate_key: CAND, mappings: [] },
      ]);
      assert.equal(
        empty.candidate_assessments[0]!.status,
        "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(
        empty.candidate_assessments[0]!
          .has_explicit_authority_dimension_evaluation_state_interpretation_policy,
        true
      );
      assert.deepEqual(
        empty.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy!
          .mappings,
        []
      );
      assert.ok(
        empty.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy!.key.includes(
          EMPTY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET
        )
      );

      const absent = buildSet(build127(), []);
      assert.equal(
        absent.candidate_assessments[0]!.status,
        "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        absent.candidate_assessments[0]!
          .has_explicit_authority_dimension_evaluation_state_interpretation_policy,
        false
      );
      assert.equal(
        absent.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy,
        null
      );
    });

    it("duplicate same mapping normalizes; conflict rejects; order invariant", () => {
      const dup = canonicalizeAuthorityDimensionEvaluationStateInterpretationMappings(
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
          canonicalizeAuthorityDimensionEvaluationStateInterpretationMappings([
            mapping(HOLDS, AS_SATISFIED),
            mapping(HOLDS, AS_UNSATISFIED),
          ]),
        /Conflicting/
      );

      const a = buildCanonicalAuthorityDimensionEvaluationStateInterpretationMappingSetKey(
        [
          mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
          mapping(HOLDS, AS_SATISFIED),
        ]
      );
      const b = buildCanonicalAuthorityDimensionEvaluationStateInterpretationMappingSetKey(
        [
          mapping(HOLDS, AS_SATISFIED),
          mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
        ]
      );
      assert.equal(a, b);

      const setA = buildSet(build127(), [
        {
          candidate_key: CAND,
          mappings: [
            mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
            mapping(HOLDS, AS_SATISFIED),
          ],
        },
      ]);
      const setB = buildSet(build127(), [
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
          .authority_dimension_evaluation_state_interpretation_policy!.key,
        setB.candidate_assessments[0]!
          .authority_dimension_evaluation_state_interpretation_policy!.key
      );
    });

    it("exact duplicate policy normalizes; different mapping sets reject; no merge", () => {
      const policySet = build127();

      const normalized =
        normalizeAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification(
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
          normalizeAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification(
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
        /Conflicting AUTHORITY Dimension Evaluation State Interpretation Policies/
      );
    });

    it("mapping-set / interpretation-target / 127 policy change identity", () => {
      const base = buildSet(build127(), [
        { candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] },
      ]).candidate_assessments[0]!
        .authority_dimension_evaluation_state_interpretation_policy!.key;

      const changedSet = buildSet(build127(), [
        {
          candidate_key: CAND,
          mappings: [
            mapping(HOLDS, AS_SATISFIED),
            mapping(DOES_NOT_HOLD, AS_UNSATISFIED),
          ],
        },
      ]).candidate_assessments[0]!
        .authority_dimension_evaluation_state_interpretation_policy!.key;
      assert.notEqual(base, changedSet);

      const changedTarget = buildSet(build127(), [
        { candidate_key: CAND, mappings: [mapping(HOLDS, AS_UNSATISFIED)] },
      ]).candidate_assessments[0]!
        .authority_dimension_evaluation_state_interpretation_policy!.key;
      assert.notEqual(base, changedTarget);

      const changedOePolicy = buildSet(
        build127(mockMatchAssessment({ policy_key: "084-oe-dimension-policy|cand|alt" })),
        [{ candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] }]
      ).candidate_assessments[0]!
        .authority_dimension_evaluation_state_interpretation_policy!.key;
      assert.notEqual(base, changedOePolicy);

      const rebuilt =
        attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyKey(
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
    it("no planning / no Requirements / no OE / not required", () => {
      assert.equal(
        buildSet(
          build127(
            mockMatchAssessment({
              status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
              matches: [],
            })
          ),
          []
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        buildSet(
          build127(
            mockMatchAssessment({
              status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
              matches: [],
            })
          ),
          []
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        buildSet(
          build127(
            mockMatchAssessment({
              status:
                "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
              matches: [],
            })
          ),
          []
        ).candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        buildSet(build127NotRequired(), []).candidate_assessments[0]!.status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
    });

    it("specification targeting non-required / no-policy / unknown / ambiguous rejects", () => {
      assert.throws(
        () =>
          buildSet(build127NotRequired(), [
            { candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] },
          ]),
        /applicable AUTHORITY Dimension Evaluation State context/
      );

      assert.throws(
        () =>
          buildSet(
            build127(
              mockMatchAssessment({
                status:
                  "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
                matches: [],
              })
            ),
            [{ candidate_key: CAND, mappings: [mapping(HOLDS, AS_SATISFIED)] }]
          ),
        /applicable AUTHORITY Dimension Evaluation State context/
      );

      assert.throws(
        () =>
          buildSet(build127(), [
            {
              candidate_key: "unknown",
              mappings: [mapping(HOLDS, AS_SATISFIED)],
            },
          ]),
        /not found/
      );

      assert.throws(
        () =>
          normalizeAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification(
            build127(),
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
        /Conflicting AUTHORITY Dimension Evaluation State Interpretation Policies/
      );
    });
  });

  describe("immutability / determinism / assess API", () => {
    it("input immutability + deep-cloned same output + determinism", () => {
      const input = {
        authority_dimension_evaluation_state_set: build127(),
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
        buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySet(
          deepClone(input)
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySet(
          input
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
      assert.equal(
        a.has_explicit_authority_dimension_evaluation_state_interpretation_policies,
        true
      );
    });

    it("assess helper exposes candidate-level API", () => {
      const normalized =
        normalizeAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification(
          build127(),
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
        assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy(
          build127().candidate_assessments[0]!,
          normalized
        );
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT"
      );
    });
  });

  describe("static / architectural boundaries", () => {
    it("schema 0.1.24; 127+spec only; type-only 127; no current 127/Satisfaction", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED"
      );

      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-types.ts"
      );
      const coreCode = stripComments(readFileSync(corePath, "utf8"));
      const typesCode = stripComments(readFileSync(typesPath, "utf8"));
      const src = coreCode + "\n" + typesCode;

      assert.ok(
        /authority-dimension-evaluation-state-types\.js/.test(coreCode)
      );
      assert.ok(
        !/authority-dimension-evaluation-state-core/.test(src)
      );
      assert.ok(!/authority-source-aggregation-result-core/.test(src));
      assert.ok(!/authority-source-aggregation-readiness-basis-core/.test(src));
      assert.ok(!/authority-source-acceptance-match/.test(src));
      assert.ok(!/authority-source-resolution-classification/.test(src));
      assert.ok(!/authority-required-dimension-coverage/.test(src));
      assert.ok(!/authority-source-bridge-core/.test(src));
      assert.ok(!/from ["'].*state-engine/.test(src));
      assert.ok(!/from ["'].*file-store/.test(src));
      assert.ok(!/ProjectState/.test(src));
      assert.ok(!/applyPatch/.test(src));
      assert.ok(!/saveProject/.test(src));
      assert.ok(!/Date\.now\(/.test(src));
      assert.ok(!/new Date\(/.test(src));
      assert.ok(!/performance\.now\(/.test(src));
      assert.ok(!/"AUTHORITY_DIMENSION_SATISFIED"/.test(src));
      assert.ok(!/"AUTHORITY_DIMENSION_UNSATISFIED"/.test(src));
      assert.ok(!/OPERATIONALLY_ELIGIBLE/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/effective_authority/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(coreCode));
      assert.ok(!/ALL_RESOLVED_STATES/.test(src));
      assert.ok(!/otherwise/.test(coreCode));
      assert.ok(!/HOLDS.*SATISFIED.*default/.test(coreCode));
    });
  });
});
