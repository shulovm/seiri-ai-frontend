/**
 * GROUND-066 — Observation Core XX / Capability Dimension Source Aggregation Outcome
 *
 * Pure 064 Source Acceptance Match + 065 Aggregation Policy
 * (HOLDS / DOES_NOT_HOLD only; no PASS/FAIL / zero-source evaluation).
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
import { buildAttentionObservationObserverCandidateSet } from "../reality/attention-observation-observer-candidate-core.js";
import { buildAttentionObservationCapabilityDeclarationMatchSet } from "../reality/attention-observation-capability-declaration-match-core.js";
import { buildAttentionObservationCapabilityAvailabilitySet } from "../reality/attention-observation-capability-availability-core.js";
import { buildAttentionObservationCapabilityScopeRequirementSet } from "../reality/attention-observation-capability-scope-requirement-core.js";
import { buildAttentionObservationCapabilityTemporalRequirementSet } from "../reality/attention-observation-capability-temporal-requirement-core.js";
import { buildAttentionObservationCapabilityVerificationSet } from "../reality/attention-observation-capability-verification-core.js";
import { buildAttentionObservationCapabilityScopeApplicabilitySet } from "../reality/attention-observation-capability-scope-applicability-core.js";
import { buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet } from "../reality/attention-observation-capability-declaration-temporal-applicability-core.js";
import { buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet } from "../reality/attention-observation-capability-verification-temporal-applicability-core.js";
import { buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet } from "../reality/attention-observation-capability-availability-temporal-applicability-core.js";
import { buildAttentionObservationCapabilityApplicabilityCompositionSet } from "../reality/attention-observation-capability-applicability-composition-core.js";
import { buildAttentionObservationCapabilityEvaluationDimensionPolicySet } from "../reality/attention-observation-capability-evaluation-dimension-policy-core.js";
import { buildAttentionObservationCapabilityRequiredDimensionCoverageSet } from "../reality/attention-observation-capability-required-dimension-coverage-core.js";
import { buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet } from "../reality/attention-observation-capability-dimension-acceptance-criteria-core.js";
import { buildAttentionObservationCapabilitySourceAcceptanceMatchSet } from "../reality/attention-observation-capability-source-acceptance-match-core.js";
import { buildAttentionObservationCapabilityDimensionSourceAggregationPolicySet } from "../reality/attention-observation-capability-dimension-source-aggregation-policy-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_MODEL_LIMITATIONS,
  assertCompatibleCapabilityDimensionSourceAggregationOutcomeContexts,
  buildAttentionObservationCapabilityDimensionSourceAggregationOutcomeSet,
  buildCanonicalSourceAcceptanceMatchSetKey,
  evaluateSourceAggregationPolicyCondition,
} from "../reality/attention-observation-capability-dimension-source-aggregation-outcome-core.js";
import type {
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification,
  AttentionObservationCapabilityDimensionAcceptanceCriterion,
} from "../reality/attention-observation-capability-dimension-acceptance-criteria-types.js";
import type {
  AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification,
} from "../reality/attention-observation-capability-dimension-source-aggregation-policy-types.js";
import type {
  AttentionObservationCapabilitySourceAcceptanceMatchBasis,
} from "../reality/attention-observation-capability-source-acceptance-match-types.js";
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
import type {
  CapabilityAvailabilityDeclaration,
  CapabilityDeclaration,
  RealityEntity,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const ENTITY_E1 = "ff111111-1111-4111-8111-111111111111";
const ENTITY_E2 = "ff222222-2222-4222-8222-222222222222";
const AT = "2026-09-01T10:00:00.000Z";
const T08 = "2026-09-01T08:00:00.000Z";
const T09 = "2026-09-01T09:00:00.000Z";
const T15 = "2026-09-01T15:00:00.000Z";
const T18 = "2026-09-01T18:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "inspect";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const AVAIL_A1 = "33333333-3333-4333-8333-333333333333";
const AVAIL_A2 = "44444444-4444-4444-8444-444444444444";
const AVAIL_A3 = "55555555-5555-4555-8555-555555555555";

function sampleEntity(id: string): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "person",
    label: "observer",
    created_at: AT,
    updated_at: AT,
  };
}

function sampleObservationNeed(key: string): ObservationNeed {
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

function baseCandidate(): AttentionCandidate {
  const signalKey = "sig|OBSERVATION_NEED";
  const signal = emptySalience("OBSERVATION_NEED", signalKey, [NEED_KEY]);
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
      salience_signal_kind: "OBSERVATION_NEED",
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
    status: "ATTENTION_CANDIDATES_PRESENT",
    candidate_count: candidates.length,
    base_situation_candidate_count: candidates.length,
    resource_candidate_count: 0,
    has_candidates: true,
    model_limitations: [],
  };
}

function capability(): CapabilityDeclaration {
  return {
    id: DECL_D1,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_E1,
    capability_key: CAP_C1,
    scope: { kind: "UNSCOPED" },
    description: null,
    valid_from: T08,
    valid_until: T18,
    declared_by: { kind: "organization", entity_id: ENTITY_E2 },
    recorded_at: AT,
    created_at: AT,
    updated_at: AT,
  };
}

function availability(
  overrides: Partial<CapabilityAvailabilityDeclaration>
): CapabilityAvailabilityDeclaration {
  return {
    id: AVAIL_A1,
    project_id: PROJECT_ID,
    capability_declaration_id: DECL_D1,
    status: "AVAILABLE",
    valid_from: T09,
    valid_until: T15,
    declared_by: { kind: "organization", entity_id: ENTITY_E2 },
    recorded_at: AT,
    note: null,
    created_at: AT,
    updated_at: AT,
    ...overrides,
  };
}

function reqKey(): string {
  return attentionObservationCapabilityRequirementKey(NEED_KEY, CAP_C1);
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

function criteriaSpec(
  criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion
): AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification {
  return {
    criteria: [
      { capability_requirement_key: reqKey(), criterion },
    ],
  };
}

function buildStack(options: {
  availabilities: CapabilityAvailabilityDeclaration[];
  aggregationKind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE" | "ALL_SOURCES_LISTED_AS_ACCEPTABLE";
  extraRequiredDimensions?: AttentionObservationCapabilityEvaluationDimension[];
  extraCriteria?: AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification["criteria"];
  aggregationPolicies?: AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification["policies"];
}) {
  const planning_set = buildAttentionObservationPlanningSet({
    eligibility_set: buildAttentionObservationEligibilitySet(
      emptyCandidateSet([baseCandidate()])
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
  const observer_candidate_set = buildAttentionObservationObserverCandidateSet({
    planning_set,
    specification: {
      candidates: [
        { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
      ],
    },
    observer_entities: [sampleEntity(ENTITY_E1), sampleEntity(ENTITY_E2)],
  });
  const capability_declaration_match_set =
    buildAttentionObservationCapabilityDeclarationMatchSet({
      capability_requirement_set,
      observer_candidate_set,
      capability_declarations: [capability()],
    });
  const capability_availability_set =
    buildAttentionObservationCapabilityAvailabilitySet({
      capability_declaration_match_set,
      capability_availability_declarations: options.availabilities,
    });
  const capability_scope_requirement_set =
    buildAttentionObservationCapabilityScopeRequirementSet({
      capability_requirement_set,
      specification: { requirements: [] },
    });
  const capability_temporal_requirement_set =
    buildAttentionObservationCapabilityTemporalRequirementSet({
      capability_requirement_set,
      specification: { requirements: [] },
    });
  const capability_scope_applicability_set =
    buildAttentionObservationCapabilityScopeApplicabilitySet({
      capability_declaration_match_set,
      capability_scope_requirement_set,
    });
  const capability_verification_set =
    buildAttentionObservationCapabilityVerificationSet({
      capability_declaration_match_set,
      capability_verification_declarations: [],
    });
  const capability_declaration_temporal_applicability_set =
    buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet({
      capability_declaration_match_set,
      capability_temporal_requirement_set,
    });
  const capability_verification_temporal_applicability_set =
    buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet({
      capability_verification_set,
      capability_temporal_requirement_set,
    });
  const capability_availability_temporal_applicability_set =
    buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet({
      capability_availability_set,
      capability_temporal_requirement_set,
    });
  const capability_applicability_composition_set =
    buildAttentionObservationCapabilityApplicabilityCompositionSet({
      capability_scope_applicability_set,
      capability_declaration_temporal_applicability_set,
      capability_verification_temporal_applicability_set,
      capability_availability_temporal_applicability_set,
    });

  const required_dimensions: AttentionObservationCapabilityEvaluationDimension[] =
    [
      "CAPABILITY_AVAILABILITY_REPRESENTATION",
      ...(options.extraRequiredDimensions ?? []),
    ];

  const capability_evaluation_dimension_policy_set =
    buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
      capability_requirement_set,
      specification: {
        policies: [
          {
            capability_requirement_key: reqKey(),
            required_dimensions,
          },
        ],
      },
    });

  const coverage_ctx = {
    capability_applicability_composition_set,
    capability_evaluation_dimension_policy_set,
  };
  const coverage_set =
    buildAttentionObservationCapabilityRequiredDimensionCoverageSet(coverage_ctx);

  const criteria_set =
    buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet({
      capability_evaluation_dimension_policy_set,
      specification: {
        criteria: [
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["AVAILABLE"],
            },
          },
          ...(options.extraCriteria ?? []),
        ],
      },
    });

  const match_set = buildAttentionObservationCapabilitySourceAcceptanceMatchSet({
    required_dimension_coverage_set: coverage_set,
    dimension_acceptance_criteria_set: criteria_set,
  });

  const policy_set =
    buildAttentionObservationCapabilityDimensionSourceAggregationPolicySet({
      capability_dimension_acceptance_criteria_set: criteria_set,
      specification: {
        policies:
          options.aggregationPolicies ?? [
            {
              capability_requirement_key: reqKey(),
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              aggregation_kind: options.aggregationKind,
            },
          ],
      },
    });

  const outcome_set =
    buildAttentionObservationCapabilityDimensionSourceAggregationOutcomeSet({
      capability_source_acceptance_match_set: match_set,
      capability_dimension_source_aggregation_policy_set: policy_set,
    });

  return { match_set, policy_set, outcome_set, criteria_set, coverage_set };
}

function mockBasis(
  key: string,
  relation: AttentionObservationCapabilitySourceAcceptanceMatchBasis["relation"]
): AttentionObservationCapabilitySourceAcceptanceMatchBasis {
  return {
    key,
    capability_requirement_key: reqKey(),
    observation_need_key: NEED_KEY,
    required_dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
    coverage_basis_key: "coverage",
    acceptance_criterion_key: "criterion",
    represented_basis_ref: {
      kind: "CAPABILITY_AVAILABILITY_REPRESENTATION",
      observer_candidate_key: "obs",
      capability_declaration_id: DECL_D1,
      capability_availability_declaration_id: key,
    },
    represented_source_value: {
      dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
      value_kind: "AVAILABILITY_RAW_STATUS",
      raw_availability_status:
        relation === "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
          ? "AVAILABLE"
          : "UNAVAILABLE",
    },
    relation,
  };
}

function dimensionAggregation(
  result: ReturnType<typeof buildStack>["outcome_set"],
  dimension: AttentionObservationCapabilityEvaluationDimension = "CAPABILITY_AVAILABILITY_REPRESENTATION"
) {
  return result.candidate_assessments[0]
    .requirement_dimension_aggregation_assessments[0]
    ?.required_dimension_aggregation_assessments.find(
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
  assert.ok(!/"DIMENSION_ACCEPTED"/.test(json));
  assert.ok(!/"DIMENSION_REJECTED"/.test(json));
  assert.ok(!/"source_count"/.test(json));
  assert.ok(!/"listed_count"/.test(json));
  assert.ok(!/"MAJORITY"/.test(json));
}

describe("Attention Observation Capability Dimension Source Aggregation Outcome (GROUND-066)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 064+065 only; no 062/063/050–061 runtime", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-dimension-source-aggregation-outcome-core.ts"
        ),
        "utf8"
      );
      assert.ok(/capability_source_acceptance_match_set/.test(core));
      assert.ok(/SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS/.test(core));
      assert.ok(!/from ["'].*required-dimension-coverage-core/.test(core));
      assert.ok(!/from ["'].*dimension-acceptance-criteria-core/.test(core));
      assert.ok(!/from ["'].*source-acceptance-match-core/.test(core));
      assert.ok(!/from ["'].*dimension-source-aggregation-policy-core/.test(core));
      assert.ok(!/accepted_relations\.includes/.test(core));
      assert.ok(!/accepted_raw_statuses\.includes/.test(core));
      assert.ok(/Cannot evaluate source aggregation policy over empty/.test(core));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_MODEL_LIMITATIONS.includes(
          "CAPABILITY_ZERO_SOURCE_AGGREGATION_SEMANTICS_NOT_MODELED"
        )
      );
    });
  });

  describe("evaluateSourceAggregationPolicyCondition unit semantics", () => {
    it("ANY: one LISTED → HOLDS; one NOT_LISTED → DOES_NOT_HOLD; mixed → HOLDS; all NOT_LISTED → DOES_NOT_HOLD", () => {
      assert.equal(
        evaluateSourceAggregationPolicyCondition(
          [mockBasis("k1", "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE")],
          "ANY_SOURCE_LISTED_AS_ACCEPTABLE"
        ),
        "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
      assert.equal(
        evaluateSourceAggregationPolicyCondition(
          [mockBasis("k1", "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE")],
          "ANY_SOURCE_LISTED_AS_ACCEPTABLE"
        ),
        "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        evaluateSourceAggregationPolicyCondition(
          [
            mockBasis("k1", "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"),
            mockBasis("k2", "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"),
          ],
          "ANY_SOURCE_LISTED_AS_ACCEPTABLE"
        ),
        "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
      assert.equal(
        evaluateSourceAggregationPolicyCondition(
          [
            mockBasis("k1", "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"),
            mockBasis("k2", "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"),
          ],
          "ANY_SOURCE_LISTED_AS_ACCEPTABLE"
        ),
        "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("ALL: one LISTED → HOLDS; one NOT_LISTED → DOES_NOT_HOLD; mixed/all NOT_LISTED → DOES_NOT_HOLD", () => {
      assert.equal(
        evaluateSourceAggregationPolicyCondition(
          [mockBasis("k1", "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE")],
          "ALL_SOURCES_LISTED_AS_ACCEPTABLE"
        ),
        "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
      assert.equal(
        evaluateSourceAggregationPolicyCondition(
          [mockBasis("k1", "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE")],
          "ALL_SOURCES_LISTED_AS_ACCEPTABLE"
        ),
        "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        evaluateSourceAggregationPolicyCondition(
          [
            mockBasis("k1", "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"),
            mockBasis("k2", "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"),
          ],
          "ALL_SOURCES_LISTED_AS_ACCEPTABLE"
        ),
        "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
      assert.equal(
        evaluateSourceAggregationPolicyCondition(
          [
            mockBasis("k1", "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"),
            mockBasis("k2", "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"),
          ],
          "ALL_SOURCES_LISTED_AS_ACCEPTABLE"
        ),
        "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("zero-source ANY/ALL throws; no vacuous truth path", () => {
      assert.throws(
        () =>
          evaluateSourceAggregationPolicyCondition(
            [],
            "ANY_SOURCE_LISTED_AS_ACCEPTABLE"
          ),
        /empty source match set/
      );
      assert.throws(
        () =>
          evaluateSourceAggregationPolicyCondition(
            [],
            "ALL_SOURCES_LISTED_AS_ACCEPTABLE"
          ),
        /empty source match set/
      );
    });

    it("duplicate source keys reject", () => {
      const basis = mockBasis(
        "k1",
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
      assert.throws(
        () =>
          evaluateSourceAggregationPolicyCondition(
            [basis, basis],
            "ANY_SOURCE_LISTED_AS_ACCEPTABLE"
          ),
        /Duplicate source acceptance match basis keys/
      );
    });
  });

  describe("integration ANY/ALL over availability sources", () => {
    it("ANY with mixed LISTED/NOT_LISTED → HOLDS", () => {
      const { outcome_set } = buildStack({
        availabilities: [
          availability({ id: AVAIL_A1, status: "AVAILABLE" }),
          availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
        ],
        aggregationKind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
      });
      const assessment = dimensionAggregation(outcome_set);
      assert.equal(
        assessment?.status,
        "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT"
      );
      assert.equal(
        assessment?.source_aggregation_outcome_basis?.outcome,
        "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
      assertNoForbiddenSemantics(outcome_set);
    });

    it("ALL with mixed sources → DOES_NOT_HOLD", () => {
      const { outcome_set } = buildStack({
        availabilities: [
          availability({ id: AVAIL_A1, status: "AVAILABLE" }),
          availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
        ],
        aggregationKind: "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
      });
      assert.equal(
        dimensionAggregation(outcome_set)?.source_aggregation_outcome_basis
          ?.outcome,
        "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("ANY 1 LISTED + 2 NOT_LISTED → HOLDS (no majority)", () => {
      const { outcome_set } = buildStack({
        availabilities: [
          availability({ id: AVAIL_A1, status: "AVAILABLE" }),
          availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
          availability({ id: AVAIL_A3, status: "UNAVAILABLE" }),
        ],
        aggregationKind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
      });
      assert.equal(
        dimensionAggregation(outcome_set)?.source_aggregation_outcome_basis
          ?.outcome,
        "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
      );
    });

    it("ALL all NOT_LISTED → DOES_NOT_HOLD; boolean still true", () => {
      const { outcome_set } = buildStack({
        availabilities: [
          availability({ id: AVAIL_A1, status: "UNAVAILABLE" }),
          availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
        ],
        aggregationKind: "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
      });
      assert.equal(
        dimensionAggregation(outcome_set)?.source_aggregation_outcome_basis
          ?.outcome,
        "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        outcome_set.has_capability_dimension_source_aggregation_outcome,
        true
      );
    });
  });

  describe("non-applicable preservation", () => {
    it("coverage NOT_REPRESENTED → no outcome", () => {
      const { outcome_set } = buildStack({
        availabilities: [],
        aggregationKind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
      });
      const assessment = dimensionAggregation(outcome_set);
      assert.equal(
        assessment?.status,
        "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
      assert.equal(assessment?.source_aggregation_outcome_basis, null);
      assert.equal(
        outcome_set.has_capability_dimension_source_aggregation_outcome,
        false
      );
    });

    it("criterion present + aggregation policy absent → no outcome", () => {
      const { match_set, policy_set, criteria_set } = buildStack({
        availabilities: [
          availability({ id: AVAIL_A1, status: "AVAILABLE" }),
        ],
        aggregationKind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
      });
      const policyNoAgg =
        buildAttentionObservationCapabilityDimensionSourceAggregationPolicySet({
          capability_dimension_acceptance_criteria_set: criteria_set,
          specification: { policies: [] },
        });
      const outcome_set =
        buildAttentionObservationCapabilityDimensionSourceAggregationOutcomeSet({
          capability_source_acceptance_match_set: match_set,
          capability_dimension_source_aggregation_policy_set: policyNoAgg,
        });
      assert.equal(
        dimensionAggregation(outcome_set)?.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY"
      );
      assert.equal(
        dimensionAggregation(outcome_set)?.source_aggregation_outcome_basis,
        null
      );
    });
  });

  describe("outcome basis lineage / determinism", () => {
    it("retains exact source match basis keys; order invariance", () => {
      const { outcome_set, match_set } = buildStack({
        availabilities: [
          availability({ id: AVAIL_A1, status: "AVAILABLE" }),
          availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
        ],
        aggregationKind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
      });
      const basis =
        dimensionAggregation(outcome_set)?.source_aggregation_outcome_basis;
      const matchKeys =
        dimensionAggregation(outcome_set)?.source_acceptance_assessment
          .source_acceptance_match_bases.map((b) => b.key) ?? [];
      assert.deepEqual(
        basis?.source_acceptance_match_basis_keys.sort(),
        [...matchKeys].sort()
      );
      const keys = basis?.source_acceptance_match_basis_keys ?? [];
      const reordered = buildCanonicalSourceAcceptanceMatchSetKey([
        ...keys,
      ].reverse());
      assert.equal(
        reordered,
        buildCanonicalSourceAcceptanceMatchSetKey(keys)
      );
    });

    it("064/065 deep clone compose; input immutability", () => {
      const stack = buildStack({
        availabilities: [availability({})],
        aggregationKind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
      });
      const matchBefore = deepClone(stack.match_set);
      const policyBefore = deepClone(stack.policy_set);
      const first =
        buildAttentionObservationCapabilityDimensionSourceAggregationOutcomeSet({
          capability_source_acceptance_match_set: deepClone(stack.match_set),
          capability_dimension_source_aggregation_policy_set: deepClone(
            stack.policy_set
          ),
        });
      const second =
        buildAttentionObservationCapabilityDimensionSourceAggregationOutcomeSet({
          capability_source_acceptance_match_set: deepClone(stack.match_set),
          capability_dimension_source_aggregation_policy_set: deepClone(
            stack.policy_set
          ),
        });
      assert.deepEqual(first, second);
      assert.deepEqual(stack.match_set, matchBefore);
      assert.deepEqual(stack.policy_set, policyBefore);
    });

    it("context mismatch rejects", () => {
      const stack = buildStack({
        availabilities: [availability({})],
        aggregationKind: "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
      });
      const mismatched = deepClone(stack.policy_set);
      mismatched.candidate_assessments[0].candidate_key = "mismatch";
      assert.throws(
        () =>
          assertCompatibleCapabilityDimensionSourceAggregationOutcomeContexts(
            stack.match_set,
            mismatched
          ),
        /do not share the same Capability Requirement acceptance context/
      );
    });
  });
});
