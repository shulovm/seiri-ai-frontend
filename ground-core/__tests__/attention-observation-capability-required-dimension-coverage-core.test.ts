/**
 * GROUND-062 — Observation Core XVI / Required Capability Evaluation Dimension Coverage
 *
 * Pure 060 Composition + 061 Evaluation Dimension Policy
 * (REPRESENTED / NOT_REPRESENTED only; no PASS/FAIL / satisfaction).
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
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
  buildAttentionObservationCapabilityRequiredDimensionCoverageSet,
} from "../reality/attention-observation-capability-required-dimension-coverage-core.js";
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

function coverageBases(
  result: ReturnType<
    typeof buildAttentionObservationCapabilityRequiredDimensionCoverageSet
  >
) {
  return (
    result.candidate_assessments[0].requirement_coverage_assessments[0]
      ?.required_dimension_coverage_bases ?? []
  );
}

function statusOf(
  result: ReturnType<
    typeof buildAttentionObservationCapabilityRequiredDimensionCoverageSet
  >,
  dimension: AttentionObservationCapabilityEvaluationDimension
) {
  return coverageBases(result).find((b) => b.required_dimension === dimension)
    ?.status;
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"MET"/.test(json));
  assert.ok(!/"UNMET"/.test(json));
  assert.ok(!/"ACCEPTABLE"/.test(json));
  assert.ok(!/"UNACCEPTABLE"/.test(json));
  assert.ok(!/"ALL_COVERED"/.test(json));
  assert.ok(!/"coverage_complete"/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"weight"\s*:/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
}

describe("Attention Observation Capability Required Dimension Coverage (GROUND-062)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 060+061 only; no rematch classifiers / ProjectState / wall-clock", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-required-dimension-coverage-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-required-dimension-coverage-types.ts"
        ),
        "utf8"
      );

      assert.ok(/capability_applicability_composition_set/.test(types));
      assert.ok(/capability_evaluation_dimension_policy_set/.test(types));
      assert.ok(
        /REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED/.test(types)
      );
      assert.ok(
        /REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED/.test(types)
      );
      assert.ok(!/from ["'].*declaration-match-core/.test(core));
      assert.ok(!/from ["'].*capability-verification-core/.test(core));
      assert.ok(!/from ["'].*capability-availability-core/.test(core));
      assert.ok(!/from ["'].*scope-applicability-core/.test(core));
      assert.ok(!/from ["'].*declaration-temporal-applicability-core/.test(core));
      assert.ok(!/from ["'].*verification-temporal-applicability-core/.test(core));
      assert.ok(!/from ["'].*availability-temporal-applicability-core/.test(core));
      assert.ok(!/capabilityScopeKey\s*\(/.test(core));
      assert.ok(!/classifyRequiredWindowAgainst/.test(core));
      assert.ok(!/\bisCapability.*ActiveAt\s*\(/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS.includes(
          "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
        )
      );
    });
  });

  describe("policy absence / empty / baseline", () => {
    it("policy absent → no coverage positions; no default dimensions", () => {
      const result =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({ requiredDimensions: undefined, policies: [] })
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
      );
      assert.deepEqual(coverageBases(result), []);
      assert.equal(result.has_required_dimension_coverage_basis, false);
      assertNoForbiddenSemantics(result);
    });

    it("explicit empty policy → NO_REQUIRED_DIMENSIONS; distinct from absence", () => {
      const result =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({ requiredDimensions: [] })
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
      );
      assert.equal(
        result.candidate_assessments[0].requirement_coverage_assessments[0]
          .evaluation_dimension_policy_assessment.status,
        "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT"
      );
      assert.deepEqual(
        result.candidate_assessments[0].requirement_coverage_assessments[0]
          .required_dimension_coverage_bases,
        []
      );
      assertNoForbiddenSemantics(result);
    });

    it("structural required + D exists → REPRESENTED; no D → NOT_REPRESENTED", () => {
      const withD =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            requiredDimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
          })
        );
      assert.equal(
        statusOf(withD, "STRUCTURAL_CAPABILITY_DECLARATION_MATCH"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );

      const noD =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [],
            requiredDimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
          })
        );
      assert.equal(
        statusOf(noD, "STRUCTURAL_CAPABILITY_DECLARATION_MATCH"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
      assertNoForbiddenSemantics(noD);
    });
  });

  describe("dimension mappings", () => {
    it("Scope Requirement / Scope Applicability DIRECT and NO_DIRECT", () => {
      const scopePresent =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [
              capability({ scope: { kind: "ENTITY", entity_id: FACILITY_1 } }),
            ],
            scopeSpec: [
              {
                capability_requirement_key: reqKey(),
                required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
              },
            ],
            requiredDimensions: [
              "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
              "CAPABILITY_SCOPE_APPLICABILITY",
            ],
          })
        );
      assert.equal(
        statusOf(scopePresent, "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );
      assert.equal(
        statusOf(scopePresent, "CAPABILITY_SCOPE_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );

      const noDirect =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability({ scope: { kind: "UNSCOPED" } })],
            scopeSpec: [
              {
                capability_requirement_key: reqKey(),
                required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
              },
            ],
            requiredDimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
          })
        );
      assert.equal(
        statusOf(noDirect, "CAPABILITY_SCOPE_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );
      assertNoForbiddenSemantics(noDirect);

      const noScopeReq =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            scopeSpec: [],
            requiredDimensions: [
              "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
              "CAPABILITY_SCOPE_APPLICABILITY",
            ],
          })
        );
      assert.equal(
        statusOf(noScopeReq, "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
      assert.equal(
        statusOf(noScopeReq, "CAPABILITY_SCOPE_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
    });

    it("Declaration Temporal FULL/PARTIAL/NO_OVERLAP all REPRESENTED", () => {
      for (const [valid_from, valid_until, _label] of [
        [T09, T15, "FULL"],
        [T10, T12, "PARTIAL"],
        [T08, T09, "NO_OVERLAP"],
      ] as const) {
        const result =
          buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
            siblingContext({
              declarations: [capability({ valid_from, valid_until })],
              temporalSpec: [
                {
                  capability_requirement_key: reqKey(),
                  required_window: {
                    required_from: T10,
                    required_until: T14,
                  },
                },
              ],
              requiredDimensions: [
                "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
                "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
              ],
            })
          );
        assert.equal(
          statusOf(result, "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT"),
          "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
        );
        assert.equal(
          statusOf(result, "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"),
          "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
        );
      }

      const noTemporal =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            temporalSpec: [],
            requiredDimensions: [
              "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
            ],
          })
        );
      assert.equal(
        statusOf(noTemporal, "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
    });

    it("Verification Representation vs Temporal; NO_OVERLAP still REPRESENTED", () => {
      const withV =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            verifications: [
              verification({ verified_at: T08, valid_until: T09 }),
            ],
            temporalSpec: [
              {
                capability_requirement_key: reqKey(),
                required_window: {
                  required_from: T10,
                  required_until: T14,
                },
              },
            ],
            requiredDimensions: [
              "CAPABILITY_VERIFICATION_REPRESENTATION",
              "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
            ],
          })
        );
      assert.equal(
        statusOf(withV, "CAPABILITY_VERIFICATION_REPRESENTATION"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );
      assert.equal(
        statusOf(withV, "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );

      const vNoTemporal =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            verifications: [verification()],
            temporalSpec: [],
            requiredDimensions: [
              "CAPABILITY_VERIFICATION_REPRESENTATION",
              "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
            ],
          })
        );
      assert.equal(
        statusOf(vNoTemporal, "CAPABILITY_VERIFICATION_REPRESENTATION"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );
      assert.equal(
        statusOf(vNoTemporal, "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );

      const noV =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            verifications: [],
            requiredDimensions: ["CAPABILITY_VERIFICATION_REPRESENTATION"],
          })
        );
      assert.equal(
        statusOf(noV, "CAPABILITY_VERIFICATION_REPRESENTATION"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
      assertNoForbiddenSemantics(noV);
    });

    it("Availability AVAILABLE/UNAVAILABLE Representation and Temporal combinations", () => {
      const unavailableRep =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            availabilities: [
              availability({ status: "UNAVAILABLE" }),
            ],
            requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
          })
        );
      assert.equal(
        statusOf(unavailableRep, "CAPABILITY_AVAILABILITY_REPRESENTATION"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );

      const fullUnavailable =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            availabilities: [
              availability({
                status: "UNAVAILABLE",
                valid_from: T09,
                valid_until: T15,
              }),
            ],
            temporalSpec: [
              {
                capability_requirement_key: reqKey(),
                required_window: {
                  required_from: T10,
                  required_until: T14,
                },
              },
            ],
            requiredDimensions: [
              "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
            ],
          })
        );
      assert.equal(
        statusOf(
          fullUnavailable,
          "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY"
        ),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );
      assertNoForbiddenSemantics(fullUnavailable);

      const aNoTemporal =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            availabilities: [availability()],
            temporalSpec: [],
            requiredDimensions: [
              "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
            ],
          })
        );
      assert.equal(
        statusOf(aNoTemporal, "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );

      const noA =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [capability()],
            availabilities: [],
            requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
          })
        );
      assert.equal(
        statusOf(noA, "CAPABILITY_AVAILABILITY_REPRESENTATION"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
    });
  });

  describe("firewalls / multi-ref / mixed", () => {
    it("all REPRESENTED ≠ SATISFIED; mixed independent; multi-refs no confidence", () => {
      const allRep =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [
              capability({
                scope: { kind: "ENTITY", entity_id: FACILITY_1 },
                valid_from: T09,
                valid_until: T15,
              }),
              capability({
                id: DECL_D2,
                scope: { kind: "ENTITY", entity_id: FACILITY_1 },
                valid_from: T09,
                valid_until: T15,
              }),
            ],
            verifications: [
              verification({ id: VER_V1 }),
              verification({
                id: VER_V2,
                capability_declaration_id: DECL_D2,
              }),
            ],
            availabilities: [
              availability({ id: AVAIL_A1, status: "AVAILABLE" }),
              availability({
                id: AVAIL_A2,
                status: "UNAVAILABLE",
                capability_declaration_id: DECL_D1,
              }),
            ],
            scopeSpec: [
              {
                capability_requirement_key: reqKey(),
                required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
              },
            ],
            temporalSpec: [
              {
                capability_requirement_key: reqKey(),
                required_window: {
                  required_from: T10,
                  required_until: T14,
                },
              },
            ],
            requiredDimensions: [
              "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
              "CAPABILITY_SCOPE_APPLICABILITY",
              "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
              "CAPABILITY_VERIFICATION_REPRESENTATION",
              "CAPABILITY_AVAILABILITY_REPRESENTATION",
            ],
          })
        );
      const bases = coverageBases(allRep);
      assert.equal(bases.length, 5);
      assert.ok(
        bases.every(
          (b) => b.status === "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
        )
      );
      const structural = bases.find(
        (b) => b.required_dimension === "STRUCTURAL_CAPABILITY_DECLARATION_MATCH"
      );
      assert.equal(structural?.represented_basis_refs.length, 2);
      const avail = bases.find(
        (b) => b.required_dimension === "CAPABILITY_AVAILABILITY_REPRESENTATION"
      );
      assert.equal(avail?.represented_basis_refs.length, 2);
      assertNoForbiddenSemantics(allRep);

      const mixed =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
          siblingContext({
            declarations: [
              capability({
                scope: { kind: "ENTITY", entity_id: FACILITY_1 },
              }),
            ],
            scopeSpec: [
              {
                capability_requirement_key: reqKey(),
                required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
              },
            ],
            temporalSpec: [
              {
                capability_requirement_key: reqKey(),
                required_window: {
                  required_from: T10,
                  required_until: T14,
                },
              },
            ],
            availabilities: [
              availability({
                status: "UNAVAILABLE",
                valid_from: T09,
                valid_until: T15,
              }),
            ],
            requiredDimensions: [
              "CAPABILITY_SCOPE_APPLICABILITY",
              "CAPABILITY_VERIFICATION_REPRESENTATION",
              "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
            ],
          })
        );
      assert.equal(
        statusOf(mixed, "CAPABILITY_SCOPE_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );
      assert.equal(
        statusOf(mixed, "CAPABILITY_VERIFICATION_REPRESENTATION"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
      );
      assert.equal(
        statusOf(mixed, "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY"),
        "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
      );
      assert.equal(
        mixed.candidate_assessments[0].has_required_dimension_coverage_basis,
        true
      );
      assertNoForbiddenSemantics(mixed);
    });

    it("deep-clone compose; immutability; determinism; mismatch reject", () => {
      const input = siblingContext({
        declarations: [capability()],
        requiredDimensions: ["STRUCTURAL_CAPABILITY_DECLARATION_MATCH"],
      });
      const cloned = deepClone(input);
      const a =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(input);
      const b =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(cloned);
      assert.deepEqual(a, b);

      const before = deepClone(input);
      buildAttentionObservationCapabilityRequiredDimensionCoverageSet(input);
      assert.deepEqual(input, before);

      const again =
        buildAttentionObservationCapabilityRequiredDimensionCoverageSet(input);
      assert.deepEqual(a, again);

      // Explicit candidate-key mismatch.
      const mismatchedCandidate = deepClone(input);
      mismatchedCandidate.capability_evaluation_dimension_policy_set.candidate_assessments[0].candidate_key =
        "attention-candidate|mismatched";
      assert.throws(
        () =>
          buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
            mismatchedCandidate
          ),
        /AttentionCandidate key mismatch/
      );
    });
  });
});
