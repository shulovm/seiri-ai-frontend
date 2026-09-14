/**
 * GROUND-065 — Observation Core XIX / Explicit Capability Dimension Source
 * Aggregation Policy Foundation
 *
 * Pure 063 Acceptance Criteria + explicit Aggregation Policy Specification
 * (ANY / ALL policy only; no aggregation result / outcomes / defaults).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { buildAttentionObservationEligibilitySet } from "../reality/attention-observation-eligibility-core.js";
import { buildAttentionObservationPlanningSet } from "../reality/attention-observation-planning-core.js";
import {
  attentionObservationCapabilityRequirementKey,
  buildAttentionObservationCapabilityRequirementSet,
} from "../reality/attention-observation-capability-requirement-core.js";
import { buildAttentionObservationCapabilityEvaluationDimensionPolicySet } from "../reality/attention-observation-capability-evaluation-dimension-policy-core.js";
import { buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet } from "../reality/attention-observation-capability-dimension-acceptance-criteria-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
  buildAttentionObservationCapabilityDimensionSourceAggregationPolicySet,
  CANONICAL_SOURCE_AGGREGATION_POLICY_KIND_ORDER,
  normalizeAttentionObservationCapabilityDimensionSourceAggregationPolicySpecification,
} from "../reality/attention-observation-capability-dimension-source-aggregation-policy-core.js";
import type {
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification,
  AttentionObservationCapabilityDimensionAcceptanceCriterion,
} from "../reality/attention-observation-capability-dimension-acceptance-criteria-types.js";
import type {
  AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification,
} from "../reality/attention-observation-capability-dimension-source-aggregation-policy-types.js";
import type { AttentionObservationCapabilityEvaluationDimension } from "../reality/attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import type {
  SalienceSignal,
  SalienceSignalKind,
} from "../reality/situation-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const AT = "2026-09-01T10:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "inspect";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";

function sampleObservationNeed(
  key: string,
  overrides: Partial<ObservationNeed> = {}
): ObservationNeed {
  return {
    key,
    kind: "OBSERVE_PROPOSITION",
    question_keys: [QUESTION_KEY],
    subject_id: SUBJECT,
    predicate_kind: "state",
    predicate: "condition",
    temporal_scope: { kind: "POINT", at: AT },
    target: {
      kind: "PROPOSITION_TARGET",
      subject_id: SUBJECT,
      predicate_kind: "state",
      predicate: "condition",
    },
    evidence_requirements: [
      {
        kind: "BEARS_ON_PROPOSITION",
        target: {
          kind: "PROPOSITION_TARGET",
          subject_id: SUBJECT,
          predicate_kind: "state",
          predicate: "condition",
        },
        temporal_scope: { kind: "POINT", at: AT },
        must_be_inspectable: true,
        required_relation: "bears_on",
        distinguishing_value_keys: [],
      },
    ],
    discriminates_between_value_keys: [],
    originating_gap_kinds: ["NO_APPLICABLE_CLAIMS"],
    originating_claim_ids: [],
    originating_evidence_ids: [],
    prior_claim_ids: [],
    later_claim_ids: [],
    satisfaction_condition: {
      kind: "EPISTEMIC_RECORD_BEARS_ON_PROPOSITION",
      note: "test",
    },
    ...overrides,
  };
}

function emptySalience(
  kind: SalienceSignalKind,
  key: string,
  observationNeedKeys: string[] = []
): SalienceSignal {
  return {
    kind,
    key,
    event_ids: [],
    state_ids: [],
    claim_ids: [],
    gap_kinds: [],
    inquiry_keys: [],
    observation_need_keys: observationNeedKeys,
    note: "test",
  };
}

function baseCandidate(
  kind: SalienceSignalKind,
  options?: { signalKey?: string; observationNeedKeys?: string[] }
): AttentionCandidate {
  const signalKey = options?.signalKey ?? `sig|${kind}`;
  const observationNeedKeys =
    options?.observationNeedKeys ??
    (kind === "OBSERVATION_NEED" ? [NEED_KEY] : []);
  const signal = emptySalience(kind, signalKey, observationNeedKeys);
  return {
    key: [
      "attention-candidate",
      "base-situation-salience",
      SUBJECT,
      AT,
      signalKey,
    ].join("|"),
    source_kind: "BASE_SITUATION_SALIENCE",
    situation_subject_id: SUBJECT,
    at: AT,
    basis: {
      kind: "BASE_SITUATION_SALIENCE",
      situation_subject_id: SUBJECT,
      situation_at: AT,
      salience_signal_key: signalKey,
      salience_signal_kind: kind,
      salience_signal: signal,
    },
  };
}

function emptyCandidateSet(
  candidates: AttentionCandidate[]
): AttentionCandidateSetAssessment {
  return {
    query: {
      situation_query: { subjectId: SUBJECT, at: AT },
      resource_declaration_ids: [],
    },
    situation: {
      query: {
        situation_query: { subjectId: SUBJECT, at: AT },
        resource_declaration_ids: [],
      },
      base_situation: {
        key: "sit|test",
        subject_id: SUBJECT,
        at: AT,
        event_window: null,
        predicate_scopes: [],
        entity: {
          id: SUBJECT,
          project_id: PROJECT_ID,
          kind: "person",
          label: "A",
          created_at: AT,
          updated_at: AT,
        },
        ontic_context: {
          active_states: [],
          events: [],
          unplaced_events: [],
          state_conflicts: [],
        },
        epistemic_context: {
          belief_assessments: [],
          gap_assessments: [],
          gaps: [],
          unresolved_claims: [],
          unresolved_subject_claims: [],
        },
        inquiry_context: { inquiries: [], observation_needs: [] },
        salience_signals: [],
        status: "QUIET",
        has_salience: false,
        has_unresolved: false,
      },
      resource_declaration_ids: [],
      resource_facets: [],
      resource_findings: [],
      resource_salience_signals: [],
      resource_salience_status: "NO_RESOURCE_SCOPE",
      has_resource_scope: false,
      has_resource_findings: false,
      has_resource_salience: false,
      model_limitations: [],
    },
    candidates,
    status:
      candidates.length > 0
        ? "ATTENTION_CANDIDATES_PRESENT"
        : "NO_ATTENTION_CANDIDATES",
    candidate_count: candidates.length,
    base_situation_candidate_count: candidates.filter(
      (c) => c.source_kind === "BASE_SITUATION_SALIENCE"
    ).length,
    resource_candidate_count: candidates.filter(
      (c) => c.source_kind === "RESOURCE_SITUATION_SALIENCE"
    ).length,
    has_candidates: candidates.length > 0,
    model_limitations: [],
  };
}

function reqKey(cap = CAP_C1, need = NEED_KEY): string {
  return attentionObservationCapabilityRequirementKey(need, cap);
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

function policySet(options?: {
  policies?: {
    capability_requirement_key: string;
    required_dimensions: AttentionObservationCapabilityEvaluationDimension[];
  }[];
}) {
  const planning_set = buildAttentionObservationPlanningSet({
    eligibility_set: buildAttentionObservationEligibilitySet(
      emptyCandidateSet([
        baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
      ])
    ),
    observation_needs: [sampleObservationNeed(NEED_KEY)],
  });

  const capability_requirement_set =
    buildAttentionObservationCapabilityRequirementSet({
      planning_set,
      specification: {
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
        ],
      },
    });

  return buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
    capability_requirement_set,
    specification: {
      policies: options?.policies ?? [
        {
          capability_requirement_key: reqKey(),
          required_dimensions: [
            "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            "CAPABILITY_AVAILABILITY_REPRESENTATION",
            "CAPABILITY_VERIFICATION_REPRESENTATION",
          ],
        },
      ],
    },
  });
}

function buildCriteria(
  policy_set: ReturnType<typeof policySet>,
  criteriaSpec: AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification
) {
  return buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet({
    capability_evaluation_dimension_policy_set: policy_set,
    specification: criteriaSpec,
  });
}

function buildAggregationSet(
  criteriaSet: ReturnType<typeof buildCriteria>,
  policySpec: AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification
) {
  return buildAttentionObservationCapabilityDimensionSourceAggregationPolicySet({
    capability_dimension_acceptance_criteria_set: criteriaSet,
    specification: policySpec,
  });
}

function criteriaSpecFor(
  dimensions: {
    dimension: AttentionObservationCapabilityEvaluationDimension;
    criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion;
  }[]
): AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification {
  return {
    criteria: dimensions.map(({ dimension, criterion }) => ({
      capability_requirement_key: reqKey(),
      criterion,
    })),
  };
}

function criterionAssessment(
  result: ReturnType<typeof buildCriteria>,
  dimension: AttentionObservationCapabilityEvaluationDimension
) {
  return result.candidate_assessments[0].requirement_acceptance_criteria_assessments[0].required_dimension_criterion_assessments.find(
    (a) => a.required_dimension === dimension
  );
}

function dimensionPolicyAssessment(
  result: ReturnType<typeof buildAggregationSet>,
  dimension: AttentionObservationCapabilityEvaluationDimension
) {
  return result.candidate_assessments[0]
    .requirement_source_aggregation_policy_assessments[0]
    ?.required_dimension_source_aggregation_policy_assessments.find(
      (a) => a.required_dimension === dimension
    );
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"MET"/.test(json));
  assert.ok(!/"UNMET"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"AGGREGATION_SATISFIED"/.test(json));
  assert.ok(!/"AGGREGATION_NOT_SATISFIED"/.test(json));
  assert.ok(!/"AGGREGATED_LISTED"/.test(json));
  assert.ok(!/"TRUE"/.test(json));
  assert.ok(!/"FALSE"/.test(json));
  assert.ok(!/"source_count"/.test(json));
  assert.ok(!/"listed_count"/.test(json));
  assert.ok(!/"MAJORITY"/.test(json));
  assert.ok(!/"VETO"/.test(json));
  assert.ok(!/"default_any"/.test(json));
  assert.ok(!/"default_all"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

describe("Attention Observation Capability Dimension Source Aggregation Policy (GROUND-065)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 063-only runtime; no 061/062/064/050–060", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-dimension-source-aggregation-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-dimension-source-aggregation-policy-types.ts"
        ),
        "utf8"
      );

      assert.ok(/capability_dimension_acceptance_criteria_set/.test(types));
      assert.ok(/ANY_SOURCE_LISTED_AS_ACCEPTABLE/.test(types));
      assert.ok(/ALL_SOURCES_LISTED_AS_ACCEPTABLE/.test(types));
      assert.ok(/acceptance_criterion_key/.test(types));
      assert.ok(!/from ["'].*evaluation-dimension-policy-core/.test(core));
      assert.ok(!/from ["'].*dimension-acceptance-criteria-core/.test(core));
      assert.ok(!/from ["'].*required-dimension-coverage/.test(core));
      assert.ok(!/from ["'].*source-acceptance-match/.test(core));
      assert.ok(!/from ["'].*applicability-composition/.test(core));
      assert.ok(!/REPRESENTED_SOURCE_VALUE_LISTED/.test(core));
      assert.ok(!/REPRESENTED_SOURCE_VALUE_NOT_LISTED/.test(core));
      assert.ok(!/source_count/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS.includes(
          "CAPABILITY_ZERO_SOURCE_AGGREGATION_SEMANTICS_NOT_MODELED"
        )
      );
      assert.deepEqual(CANONICAL_SOURCE_AGGREGATION_POLICY_KIND_ORDER, [
        "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
        "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
      ]);
    });
  });

  describe("policy baseline", () => {
    const criteria = buildCriteria(
      policySet(),
      criteriaSpecFor([
        {
          dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
          criterion: {
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
          },
        },
        {
          dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
          criterion: {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            accepted_raw_statuses: ["AVAILABLE"],
          },
        },
      ])
    );

    it("ANY policy → PRESENT; no source inspection", () => {
      const result = buildAggregationSet(criteria, {
        policies: [
          {
            capability_requirement_key: reqKey(),
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
          },
        ],
      });
      const assessment = dimensionPolicyAssessment(
        result,
        "CAPABILITY_AVAILABILITY_REPRESENTATION"
      );
      assert.equal(
        assessment?.status,
        "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        assessment?.source_aggregation_policy?.aggregation_kind,
        "ANY_SOURCE_LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        assessment?.source_aggregation_policy?.acceptance_criterion_key,
        criterionAssessment(criteria, "CAPABILITY_AVAILABILITY_REPRESENTATION")
          ?.acceptance_criterion?.key
      );
      assertNoForbiddenSemantics(result);
    });

    it("ALL policy → PRESENT", () => {
      const result = buildAggregationSet(criteria, {
        policies: [
          {
            capability_requirement_key: reqKey(),
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            aggregation_kind: "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
          },
        ],
      });
      assert.equal(
        dimensionPolicyAssessment(result, "STRUCTURAL_CAPABILITY_DECLARATION_MATCH")
          ?.source_aggregation_policy?.aggregation_kind,
        "ALL_SOURCES_LISTED_AS_ACCEPTABLE"
      );
    });

    it("no aggregation policy → NO_POLICY_DECLARED; no default ANY/ALL", () => {
      const result = buildAggregationSet(criteria, { policies: [] });
      assert.equal(
        dimensionPolicyAssessment(
          result,
          "CAPABILITY_AVAILABILITY_REPRESENTATION"
        )?.status,
        "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(
        dimensionPolicyAssessment(result, "STRUCTURAL_CAPABILITY_DECLARATION_MATCH")
          ?.status,
        "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(
        result.has_explicit_capability_dimension_source_aggregation_policies,
        false
      );
    });
  });

  describe("validation / normalization", () => {
    it("criterion absent → reject policy specification", () => {
      const criteria = buildCriteria(
        policySet(),
        criteriaSpecFor([
          {
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            criterion: {
              dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
              criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
            },
          },
        ])
      );
      assert.throws(
        () =>
          buildAggregationSet(criteria, {
            policies: [
              {
                capability_requirement_key: reqKey(),
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
              },
            ],
          }),
        /requires an explicit Acceptance Criterion/
      );
    });

    it("non-required dimension → reject", () => {
      const criteria = buildCriteria(
        policySet({
          policies: [
            {
              capability_requirement_key: reqKey(),
              required_dimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
            },
          ],
        }),
        criteriaSpecFor([
          {
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            criterion: {
              dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
              criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
            },
          },
        ])
      );
      assert.throws(
        () =>
          buildAggregationSet(criteria, {
            policies: [
              {
                capability_requirement_key: reqKey(),
                dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
              },
            ],
          }),
        /is not required by policy/
      );
    });

    it("unknown Requirement → reject", () => {
      const criteria = buildCriteria(
        policySet(),
        criteriaSpecFor([
          {
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            criterion: {
              dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
              criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
            },
          },
        ])
      );
      assert.throws(
        () =>
          buildAggregationSet(criteria, {
            policies: [
              {
                capability_requirement_key: "unknown|requirement",
                dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
              },
            ],
          }),
        /not found in capability dimension acceptance criteria set/
      );
    });

    it("conflicting ANY/ALL same Requirement × Dimension → reject", () => {
      const criteria = buildCriteria(
        policySet(),
        criteriaSpecFor([
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["AVAILABLE"],
            },
          },
        ])
      );
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityDimensionSourceAggregationPolicySpecification(
            criteria,
            {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                  aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
                },
                {
                  capability_requirement_key: reqKey(),
                  dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                  aggregation_kind: "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
                },
              ],
            }
          ),
        /Multiple Capability Dimension Source Aggregation Policies/
      );
    });

    it("exact duplicate policy → normalize to one", () => {
      const criteria = buildCriteria(
        policySet(),
        criteriaSpecFor([
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["AVAILABLE"],
            },
          },
        ])
      );
      const normalized =
        normalizeAttentionObservationCapabilityDimensionSourceAggregationPolicySpecification(
          criteria,
          {
            policies: [
              {
                capability_requirement_key: reqKey(),
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
              },
              {
                capability_requirement_key: reqKey(),
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
              },
            ],
          }
        );
      assert.equal(normalized.policies.length, 1);
    });

    it("specification reorder → deepEqual output", () => {
      const criteria = buildCriteria(
        policySet(),
        criteriaSpecFor([
          {
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            criterion: {
              dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
              criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
            },
          },
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["AVAILABLE"],
            },
          },
        ])
      );
      const first = buildAggregationSet(criteria, {
        policies: [
          {
            capability_requirement_key: reqKey(),
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
          },
          {
            capability_requirement_key: reqKey(),
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            aggregation_kind: "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
          },
        ],
      });
      const second = buildAggregationSet(criteria, {
        policies: [
          {
            capability_requirement_key: reqKey(),
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            aggregation_kind: "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
          },
          {
            capability_requirement_key: reqKey(),
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
          },
        ],
      });
      assert.deepEqual(first, second);
    });
  });

  describe("criterion variants with aggregation policy", () => {
    it("empty accepted-set criterion + ANY/ALL valid; presence-only + ANY/ALL valid", () => {
      const criteria = buildCriteria(
        policySet({
          policies: [
            {
              capability_requirement_key: reqKey(),
              required_dimensions: [
                "CAPABILITY_VERIFICATION_REPRESENTATION",
                "CAPABILITY_SCOPE_APPLICABILITY",
              ],
            },
          ],
        }),
        criteriaSpecFor([
          {
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            criterion: {
              dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
              criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
            },
          },
          {
            dimension: "CAPABILITY_SCOPE_APPLICABILITY",
            criterion: {
              dimension: "CAPABILITY_SCOPE_APPLICABILITY",
              accepted_position_statuses: [],
            },
          },
        ])
      );
      const result = buildAggregationSet(criteria, {
        policies: [
          {
            capability_requirement_key: reqKey(),
            dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
            aggregation_kind: "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
          },
          {
            capability_requirement_key: reqKey(),
            dimension: "CAPABILITY_SCOPE_APPLICABILITY",
            aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
          },
        ],
      });
      assert.equal(
        dimensionPolicyAssessment(
          result,
          "CAPABILITY_VERIFICATION_REPRESENTATION"
        )?.status,
        "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        dimensionPolicyAssessment(result, "CAPABILITY_SCOPE_APPLICABILITY")
          ?.status,
        "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assertNoForbiddenSemantics(result);
    });
  });

  describe("mixed criteria/policy coexistence", () => {
    it("D1 PRESENT / D2 NO_POLICY / D3 NOT_APPLICABLE_NO_CRITERION", () => {
      const criteria = buildCriteria(
        policySet({
          policies: [
            {
              capability_requirement_key: reqKey(),
              required_dimensions: [
                "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                "CAPABILITY_AVAILABILITY_REPRESENTATION",
                "CAPABILITY_VERIFICATION_REPRESENTATION",
              ],
            },
          ],
        }),
        criteriaSpecFor([
          {
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            criterion: {
              dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
              criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
            },
          },
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["AVAILABLE"],
            },
          },
        ])
      );
      const result = buildAggregationSet(criteria, {
        policies: [
          {
            capability_requirement_key: reqKey(),
            dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
          },
        ],
      });
      assert.equal(
        dimensionPolicyAssessment(result, "STRUCTURAL_CAPABILITY_DECLARATION_MATCH")
          ?.status,
        "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        dimensionPolicyAssessment(
          result,
          "CAPABILITY_AVAILABILITY_REPRESENTATION"
        )?.status,
        "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(
        dimensionPolicyAssessment(
          result,
          "CAPABILITY_VERIFICATION_REPRESENTATION"
        )?.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
      );
    });
  });

  describe("policy identity", () => {
    it("criterion change → different policy key; ANY vs ALL → different key", () => {
      const criteriaAvailable = buildCriteria(
        policySet(),
        criteriaSpecFor([
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["AVAILABLE"],
            },
          },
        ])
      );
      const criteriaUnavailable = buildCriteria(
        policySet(),
        criteriaSpecFor([
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["UNAVAILABLE"],
            },
          },
        ])
      );
      const anyAvailable = buildAggregationSet(criteriaAvailable, {
        policies: [
          {
            capability_requirement_key: reqKey(),
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
          },
        ],
      });
      const allUnavailable = buildAggregationSet(criteriaUnavailable, {
        policies: [
          {
            capability_requirement_key: reqKey(),
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            aggregation_kind: "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
          },
        ],
      });
      const keyAny = dimensionPolicyAssessment(
        anyAvailable,
        "CAPABILITY_AVAILABILITY_REPRESENTATION"
      )?.source_aggregation_policy?.key;
      const keyAll = dimensionPolicyAssessment(
        allUnavailable,
        "CAPABILITY_AVAILABILITY_REPRESENTATION"
      )?.source_aggregation_policy?.key;
      assert.ok(keyAny);
      assert.ok(keyAll);
      assert.notEqual(keyAny, keyAll);
    });
  });

  describe("immutability / determinism", () => {
    it("063 + specification deepEqual preserved; repeated output deepEqual", () => {
      const criteria = buildCriteria(
        policySet(),
        criteriaSpecFor([
          {
            dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["AVAILABLE"],
            },
          },
        ])
      );
      const criteriaBefore = deepClone(criteria);
      const spec: AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification =
        {
          policies: [
            {
              capability_requirement_key: reqKey(),
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              aggregation_kind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
            },
          ],
        };
      const specBefore = deepClone(spec);
      const first = buildAggregationSet(criteria, spec);
      const second = buildAggregationSet(criteria, spec);
      assert.deepEqual(first, second);
      assert.deepEqual(criteria, criteriaBefore);
      assert.deepEqual(spec, specBefore);
    });
  });
});
