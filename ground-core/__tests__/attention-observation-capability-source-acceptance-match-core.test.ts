/**
 * GROUND-064 — Observation Core XVIII / Capability Source Acceptance Match Basis
 *
 * Pure 062 Required Dimension Coverage + 063 Acceptance Criteria
 * (LISTED / NOT_LISTED only; no PASS/FAIL / aggregation / satisfaction).
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
import { buildAttentionObservationCapabilityVerificationSet } from "../reality/attention-observation-capability-verification-core.js";
import { buildAttentionObservationCapabilityAvailabilitySet } from "../reality/attention-observation-capability-availability-core.js";
import { buildAttentionObservationCapabilityScopeRequirementSet } from "../reality/attention-observation-capability-scope-requirement-core.js";
import { buildAttentionObservationCapabilityTemporalRequirementSet } from "../reality/attention-observation-capability-temporal-requirement-core.js";
import { buildAttentionObservationCapabilityScopeApplicabilitySet } from "../reality/attention-observation-capability-scope-applicability-core.js";
import { buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet } from "../reality/attention-observation-capability-declaration-temporal-applicability-core.js";
import { buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet } from "../reality/attention-observation-capability-verification-temporal-applicability-core.js";
import { buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet } from "../reality/attention-observation-capability-availability-temporal-applicability-core.js";
import { buildAttentionObservationCapabilityApplicabilityCompositionSet } from "../reality/attention-observation-capability-applicability-composition-core.js";
import { buildAttentionObservationCapabilityEvaluationDimensionPolicySet } from "../reality/attention-observation-capability-evaluation-dimension-policy-core.js";
import { buildAttentionObservationCapabilityRequiredDimensionCoverageSet } from "../reality/attention-observation-capability-required-dimension-coverage-core.js";
import { buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet } from "../reality/attention-observation-capability-dimension-acceptance-criteria-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
  assertCompatibleCapabilitySourceAcceptanceMatchContexts,
  buildAttentionObservationCapabilitySourceAcceptanceMatchSet,
} from "../reality/attention-observation-capability-source-acceptance-match-core.js";
import type {
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification,
  AttentionObservationCapabilityDimensionAcceptanceCriterion,
} from "../reality/attention-observation-capability-dimension-acceptance-criteria-types.js";
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
  CapabilityScope,
  CapabilityVerificationDeclaration,
  RealityEntity,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const ENTITY_E1 = "ff111111-1111-4111-8111-111111111111";
const ENTITY_E2 = "ff222222-2222-4222-8222-222222222222";
const FACILITY_1 = "ff333333-3333-4333-8333-333333333333";
const AT = "2026-09-01T10:00:00.000Z";
const T08 = "2026-09-01T08:00:00.000Z";
const T09 = "2026-09-01T09:00:00.000Z";
const T10 = "2026-09-01T10:00:00.000Z";
const T12 = "2026-09-01T12:00:00.000Z";
const T14 = "2026-09-01T14:00:00.000Z";
const T15 = "2026-09-01T15:00:00.000Z";
const T18 = "2026-09-01T18:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "inspect";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DECL_D2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const VER_V1 = "11111111-1111-4111-8111-111111111111";
const VER_V2 = "22222222-2222-4222-8222-222222222222";
const AVAIL_A1 = "33333333-3333-4333-8333-333333333333";
const AVAIL_A2 = "44444444-4444-4444-8444-444444444444";
const EVIDENCE_A = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

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

function capability(
  overrides: Partial<CapabilityDeclaration> = {}
): CapabilityDeclaration {
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
    ...overrides,
  };
}

function verification(
  overrides: Partial<CapabilityVerificationDeclaration> = {}
): CapabilityVerificationDeclaration {
  return {
    id: VER_V1,
    project_id: PROJECT_ID,
    capability_declaration_id: DECL_D1,
    evidence_ids: [EVIDENCE_A],
    verified_by: { kind: "organization", entity_id: ENTITY_E2 },
    verified_at: T09,
    valid_until: T15,
    note: null,
    recorded_at: AT,
    created_at: AT,
    updated_at: AT,
    ...overrides,
  };
}

function availability(
  overrides: Partial<CapabilityAvailabilityDeclaration> = {}
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

function reqKey(cap = CAP_C1, need = NEED_KEY): string {
  return attentionObservationCapabilityRequirementKey(need, cap);
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

function siblingContext(options?: {
  declarations?: CapabilityDeclaration[];
  verifications?: CapabilityVerificationDeclaration[];
  availabilities?: CapabilityAvailabilityDeclaration[];
  scopeSpec?: {
    capability_requirement_key: string;
    required_scope: CapabilityScope;
  }[];
  temporalSpec?: {
    capability_requirement_key: string;
    required_window: {
      required_from: string;
      required_until: string | null;
    };
  }[];
  requiredDimensions?: AttentionObservationCapabilityEvaluationDimension[];
  policies?: {
    capability_requirement_key: string;
    required_dimensions: AttentionObservationCapabilityEvaluationDimension[];
  }[];
}) {
  const attentionCandidates = [
    baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
  ];
  const planning_set = buildAttentionObservationPlanningSet({
    eligibility_set: buildAttentionObservationEligibilitySet(
      emptyCandidateSet(attentionCandidates)
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
      capability_declarations: options?.declarations ?? [capability()],
    });

  const capability_verification_set =
    buildAttentionObservationCapabilityVerificationSet({
      capability_declaration_match_set,
      capability_verification_declarations: options?.verifications ?? [],
    });

  const capability_availability_set =
    buildAttentionObservationCapabilityAvailabilitySet({
      capability_declaration_match_set,
      capability_availability_declarations: options?.availabilities ?? [],
    });

  const capability_scope_requirement_set =
    buildAttentionObservationCapabilityScopeRequirementSet({
      capability_requirement_set,
      specification: { requirements: options?.scopeSpec ?? [] },
    });

  const capability_temporal_requirement_set =
    buildAttentionObservationCapabilityTemporalRequirementSet({
      capability_requirement_set,
      specification: { requirements: options?.temporalSpec ?? [] },
    });

  const capability_scope_applicability_set =
    buildAttentionObservationCapabilityScopeApplicabilitySet({
      capability_declaration_match_set,
      capability_scope_requirement_set,
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

  const capability_evaluation_dimension_policy_set =
    buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
      capability_requirement_set,
      specification: {
        policies:
          options?.policies ??
          (options?.requiredDimensions !== undefined
            ? [
                {
                  capability_requirement_key: reqKey(),
                  required_dimensions: options.requiredDimensions,
                },
              ]
            : []),
      },
    });

  return {
    capability_applicability_composition_set,
    capability_evaluation_dimension_policy_set,
  };
}

function buildMatchSet(
  contextOptions: Parameters<typeof siblingContext>[0],
  criteriaSpec: AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification
) {
  const ctx = siblingContext(contextOptions);
  const coverage_set =
    buildAttentionObservationCapabilityRequiredDimensionCoverageSet(ctx);
  const dimension_acceptance_criteria_set =
    buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet({
      capability_evaluation_dimension_policy_set:
        ctx.capability_evaluation_dimension_policy_set,
      specification: criteriaSpec,
    });
  return buildAttentionObservationCapabilitySourceAcceptanceMatchSet({
    required_dimension_coverage_set: coverage_set,
    dimension_acceptance_criteria_set,
  });
}

function dimensionAssessment(
  result: ReturnType<typeof buildMatchSet>,
  dimension: AttentionObservationCapabilityEvaluationDimension
) {
  return result.candidate_assessments[0].requirement_source_acceptance_assessments[0]?.required_dimension_source_acceptance_assessments.find(
    (a) => a.required_dimension === dimension
  );
}

function matchBases(
  result: ReturnType<typeof buildMatchSet>,
  dimension: AttentionObservationCapabilityEvaluationDimension
) {
  return dimensionAssessment(result, dimension)?.source_acceptance_match_bases ?? [];
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"MET"/.test(json));
  assert.ok(!/"UNMET"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"MATCH"/.test(json));
  assert.ok(!/"MISMATCH"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"DIMENSION_OUTCOME"/.test(json));
  assert.ok(!/"has_listed_source"/.test(json));
  assert.ok(!/"has_accepted_source"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

describe("Attention Observation Capability Source Acceptance Match (GROUND-064)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 062+063 only; no 050–061 runtime / classifiers / ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-source-acceptance-match-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-source-acceptance-match-types.ts"
        ),
        "utf8"
      );

      assert.ok(/required_dimension_coverage_set/.test(types));
      assert.ok(/dimension_acceptance_criteria_set/.test(types));
      assert.ok(
        /REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE/.test(types)
      );
      assert.ok(
        /REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE/.test(types)
      );
      assert.ok(!/from ["'].*declaration-match-core/.test(core));
      assert.ok(!/from ["'].*capability-verification-core/.test(core));
      assert.ok(!/from ["'].*capability-availability-core/.test(core));
      assert.ok(!/from ["'].*scope-applicability-core/.test(core));
      assert.ok(!/from ["'].*declaration-temporal-applicability-core/.test(core));
      assert.ok(!/from ["'].*verification-temporal-applicability-core/.test(core));
      assert.ok(!/from ["'].*availability-temporal-applicability-core/.test(core));
      assert.ok(!/from ["'].*required-dimension-coverage-core/.test(core));
      assert.ok(!/from ["'].*dimension-acceptance-criteria-core/.test(core));
      assert.ok(!/from ["'].*evaluation-dimension-policy-core/.test(core));
      assert.ok(!/capabilityScopeKey\s*\(/.test(core));
      assert.ok(!/classifyRequiredWindowAgainst/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS.includes(
          "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED"
        )
      );
    });
  });

  describe("presence-only dimensions", () => {
    it("Structural represented + ANY_REPRESENTED_BASIS → LISTED", () => {
      const result = buildMatchSet(
        {
          declarations: [capability()],
          requiredDimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
              },
            },
          ],
        }
      );
      const bases = matchBases(result, "STRUCTURAL_CAPABILITY_DECLARATION_MATCH");
      assert.equal(bases.length, 1);
      assert.equal(
        bases[0].relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
      assertNoForbiddenSemantics(result);
    });

    it("Structural NOT_REPRESENTED → no source match basis; no NOT_LISTED", () => {
      const result = buildMatchSet(
        {
          declarations: [],
          requiredDimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
              },
            },
          ],
        }
      );
      const assessment = dimensionAssessment(
        result,
        "STRUCTURAL_CAPABILITY_DECLARATION_MATCH"
      );
      assert.equal(
        assessment?.status,
        "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
      assert.deepEqual(assessment?.source_acceptance_match_bases, []);
      assert.equal(result.has_capability_source_acceptance_match_basis, false);
    });
  });

  describe("scope dimensions", () => {
    it("Scope Requirement presence-only represented → LISTED", () => {
      const result = buildMatchSet(
        {
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            },
          ],
          requiredDimensions: ["EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
                criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT")[0]?.relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
    });

    it("Scope Applicability DIRECT accepted / NO_DIRECT not accepted", () => {
      const result = buildMatchSet(
        {
          declarations: [
            capability({ scope: { kind: "ENTITY", entity_id: FACILITY_1 } }),
            capability({
              id: DECL_D2,
              scope: { kind: "UNSCOPED" },
            }),
          ],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            },
          ],
          requiredDimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                accepted_position_statuses: [
                  "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                ],
              },
            },
          ],
        }
      );
      const relations = matchBases(
        result,
        "CAPABILITY_SCOPE_APPLICABILITY"
      ).map((b) => b.relation);
      assert.ok(
        relations.includes("REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE")
      );
      assert.ok(
        relations.includes("REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE")
      );
    });

    it("Scope Applicability NO_DIRECT explicitly accepted → LISTED", () => {
      const result = buildMatchSet(
        {
          declarations: [capability({ scope: { kind: "UNSCOPED" } })],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            },
          ],
          requiredDimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                accepted_position_statuses: [
                  "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
                ],
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_SCOPE_APPLICABILITY")[0]?.relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
    });

    it("Scope empty accepted set → NOT_LISTED for represented sources", () => {
      const result = buildMatchSet(
        {
          declarations: [capability({ scope: { kind: "UNSCOPED" } })],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            },
          ],
          requiredDimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                accepted_position_statuses: [],
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_SCOPE_APPLICABILITY")[0]?.relation,
        "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"
      );
    });
  });

  describe("temporal dimensions", () => {
    const temporalSpec = [
      {
        capability_requirement_key: reqKey(),
        required_window: { required_from: T10, required_until: T14 },
      },
    ];

    it("Declaration Temporal FULL accepted / PARTIAL not listed", () => {
      const result = buildMatchSet(
        {
          temporalSpec,
          requiredDimensions: ["CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
                accepted_relations: ["FULL_REQUIRED_WINDOW_COVERAGE"],
              },
            },
          ],
        }
      );
      const relation =
        matchBases(result, "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY")[0]
          ?.relation;
      assert.equal(
        relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
    });

    it("Declaration Temporal NO_OVERLAP explicitly accepted → LISTED", () => {
      const result = buildMatchSet(
        {
          declarations: [
            capability({ valid_from: T15, valid_until: T18 }),
          ],
          temporalSpec,
          requiredDimensions: ["CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
                accepted_relations: ["NO_REQUIRED_WINDOW_OVERLAP"],
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY")[0]
          ?.relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
    });

    it("Declaration Temporal empty criterion → NOT_LISTED", () => {
      const result = buildMatchSet(
        {
          temporalSpec,
          requiredDimensions: ["CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
                accepted_relations: [],
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY")[0]
          ?.relation,
        "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"
      );
    });
  });

  describe("verification dimensions", () => {
    const temporalSpec = [
      {
        capability_requirement_key: reqKey(),
        required_window: { required_from: T10, required_until: T14 },
      },
    ];

    it("Verification Representation presence-only → LISTED", () => {
      const result = buildMatchSet(
        {
          verifications: [verification()],
          requiredDimensions: ["CAPABILITY_VERIFICATION_REPRESENTATION"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
                criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_VERIFICATION_REPRESENTATION")[0]?.relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
    });

    it("Verification Temporal NO_OVERLAP explicitly accepted → LISTED", () => {
      const result = buildMatchSet(
        {
          verifications: [
            verification({ valid_until: T08 }),
          ],
          temporalSpec,
          requiredDimensions: [
            "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
          ],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
                accepted_relations: ["NO_REQUIRED_WINDOW_OVERLAP"],
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY")[0]
          ?.relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
    });
  });

  describe("availability dimensions", () => {
    const temporalSpec = [
      {
        capability_requirement_key: reqKey(),
        required_window: { required_from: T10, required_until: T14 },
      },
    ];

    it("Availability Representation AVAILABLE accepted / UNAVAILABLE not listed", () => {
      const result = buildMatchSet(
        {
          availabilities: [
            availability({ id: AVAIL_A1, status: "AVAILABLE" }),
            availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
          ],
          requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                accepted_raw_statuses: ["AVAILABLE"],
              },
            },
          ],
        }
      );
      const relations = matchBases(
        result,
        "CAPABILITY_AVAILABILITY_REPRESENTATION"
      ).map((b) => b.relation);
      const listed = relations.filter(
        (r) => r === "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
      const notListed = relations.filter(
        (r) => r === "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"
      );
      assert.equal(listed.length, 1);
      assert.equal(notListed.length, 1);
    });

    it("Availability Representation UNAVAILABLE explicitly accepted → LISTED", () => {
      const result = buildMatchSet(
        {
          availabilities: [availability({ status: "UNAVAILABLE" })],
          requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                accepted_raw_statuses: ["UNAVAILABLE"],
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_AVAILABILITY_REPRESENTATION")[0]
          ?.relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
    });

    it("Availability Temporal FULL+UNAVAILABLE explicitly accepted → LISTED", () => {
      const result = buildMatchSet(
        {
          availabilities: [
            availability({
              status: "UNAVAILABLE",
              valid_from: T10,
              valid_until: T14,
            }),
          ],
          temporalSpec,
          requiredDimensions: [
            "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
          ],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
                accepted_pairs: [
                  {
                    relation: "FULL_REQUIRED_WINDOW_COVERAGE",
                    raw_availability_status: "UNAVAILABLE",
                  },
                ],
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY")[0]
          ?.relation,
        "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      );
    });

    it("Availability Temporal exact pair equality; no Cartesian expansion", () => {
      const result = buildMatchSet(
        {
          availabilities: [
            availability({
              status: "AVAILABLE",
              valid_from: T10,
              valid_until: T14,
            }),
          ],
          temporalSpec,
          requiredDimensions: [
            "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
          ],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
                accepted_pairs: [
                  {
                    relation: "FULL_REQUIRED_WINDOW_COVERAGE",
                    raw_availability_status: "UNAVAILABLE",
                  },
                ],
              },
            },
          ],
        }
      );
      assert.equal(
        matchBases(result, "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY")[0]
          ?.relation,
        "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"
      );
    });
  });

  describe("three-way distinction / firewalls", () => {
    it("criterion absent + source represented → no source match basis", () => {
      const result = buildMatchSet(
        {
          declarations: [capability()],
          requiredDimensions: [
            "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            "CAPABILITY_VERIFICATION_REPRESENTATION",
          ],
          verifications: [verification()],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
              },
            },
          ],
        }
      );
      const verificationAssessment = dimensionAssessment(
        result,
        "CAPABILITY_VERIFICATION_REPRESENTATION"
      );
      assert.equal(
        verificationAssessment?.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
      );
      assert.deepEqual(verificationAssessment?.source_acceptance_match_bases, []);
    });

    it("criterion present empty + source represented → NOT_LISTED (not absence)", () => {
      const result = buildMatchSet(
        {
          declarations: [capability()],
          requiredDimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
              },
            },
          ],
        }
      );
      assert.equal(
        dimensionAssessment(result, "STRUCTURAL_CAPABILITY_DECLARATION_MATCH")
          ?.status,
        "CAPABILITY_SOURCE_ACCEPTANCE_MATCH_BASIS_PRESENT"
      );
    });

    it("coverage NOT_REPRESENTED + criterion present → no LISTED/NOT_LISTED", () => {
      const result = buildMatchSet(
        {
          declarations: [],
          requiredDimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
              },
            },
          ],
        }
      );
      assert.deepEqual(
        matchBases(result, "STRUCTURAL_CAPABILITY_DECLARATION_MATCH"),
        []
      );
    });
  });

  describe("multi-source / no aggregation", () => {
    it("mixed LISTED + NOT_LISTED; has_match_basis true with all NOT_LISTED possible", () => {
      const result = buildMatchSet(
        {
          availabilities: [
            availability({ id: AVAIL_A1, status: "UNAVAILABLE" }),
            availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
          ],
          requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                accepted_raw_statuses: ["AVAILABLE"],
              },
            },
          ],
        }
      );
      const bases = matchBases(
        result,
        "CAPABILITY_AVAILABILITY_REPRESENTATION"
      );
      assert.equal(bases.length, 2);
      assert.ok(
        bases.every(
          (b) =>
            b.relation ===
            "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE"
        )
      );
      assert.equal(result.has_capability_source_acceptance_match_basis, true);
      assertNoForbiddenSemantics(result);
    });

    it("two equal-value different source IDs → two match bases; no collapse", () => {
      const result = buildMatchSet(
        {
          verifications: [
            verification({ id: VER_V1 }),
            verification({ id: VER_V2 }),
          ],
          temporalSpec: [
            {
              capability_requirement_key: reqKey(),
              required_window: { required_from: T10, required_until: T14 },
            },
          ],
          requiredDimensions: [
            "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
          ],
        },
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
                accepted_relations: ["FULL_REQUIRED_WINDOW_COVERAGE"],
              },
            },
          ],
        }
      );
      const bases = matchBases(
        result,
        "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY"
      );
      assert.equal(bases.length, 2);
      assert.notEqual(bases[0].key, bases[1].key);
    });
  });

  describe("context consistency / determinism / immutability", () => {
    it("context mismatch → reject", () => {
      const ctx = siblingContext({
        requiredDimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
      });
      const coverage_set =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(ctx);
      const criteria_set =
        buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet({
          capability_evaluation_dimension_policy_set:
            ctx.capability_evaluation_dimension_policy_set,
          specification: {
            criteria: [
              {
                capability_requirement_key: reqKey(),
                criterion: {
                  dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                  criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
                },
              },
            ],
          },
        });
      const mismatchedCriteria = deepClone(criteria_set);
      mismatchedCriteria.candidate_assessments[0].candidate_key =
        "mismatched-candidate";

      assert.throws(
        () =>
          assertCompatibleCapabilitySourceAcceptanceMatchContexts(
            coverage_set,
            mismatchedCriteria
          ),
        /do not share the same Capability Requirement policy context/
      );
    });

    it("062/063 deep clone compose; repeated output deepEqual; input immutability", () => {
      const ctx = siblingContext({
        declarations: [capability()],
        availabilities: [
          availability({ id: AVAIL_A1, status: "AVAILABLE" }),
          availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
        ],
        requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
      });
      const coverageInput = deepClone(ctx);
      const criteriaInput: AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification =
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                accepted_raw_statuses: ["AVAILABLE"],
              },
            },
          ],
        };
      const coverage_set =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          coverageInput
        );
      const criteria_set =
        buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet({
          capability_evaluation_dimension_policy_set: deepClone(
            ctx.capability_evaluation_dimension_policy_set
          ),
          specification: criteriaInput,
        });
      const coverageBefore = deepClone(coverage_set);
      const criteriaBefore = deepClone(criteria_set);

      const input = {
        required_dimension_coverage_set: deepClone(coverage_set),
        dimension_acceptance_criteria_set: deepClone(criteria_set),
      };
      const first = buildAttentionObservationCapabilitySourceAcceptanceMatchSet(
        input
      );
      const second =
        buildAttentionObservationCapabilitySourceAcceptanceMatchSet(input);

      assert.deepEqual(first, second);
      assert.deepEqual(coverage_set, coverageBefore);
      assert.deepEqual(criteria_set, criteriaBefore);
    });
  });
});
