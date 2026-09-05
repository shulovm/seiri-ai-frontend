/**
 * GROUND-060 — Observation Core XIV / Capability Applicability Composition Basis
 *
 * Pure composition of 055 + 057 + 058 + 059 (side-by-side dimensions;
 * no resolution / satisfaction / effective state / V×A product).
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
import {
  ATTENTION_OBSERVATION_CAPABILITY_APPLICABILITY_COMPOSITION_MODEL_LIMITATIONS,
  assertCompatibleCapabilityApplicabilityCompositionContexts,
  buildAttentionObservationCapabilityApplicabilityCompositionSet,
} from "../reality/attention-observation-capability-applicability-composition-core.js";
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
const NEED_KEY_2 = "observation-need|observe-proposition|q|2";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "inspect";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DECL_D2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const VER_V1 = "11111111-1111-4111-8111-111111111111";
const VER_V2 = "22222222-2222-4222-8222-222222222222";
const AVAIL_A1 = "33333333-3333-4333-8333-333333333333";
const AVAIL_A2 = "44444444-4444-4444-8444-444444444444";
const AVAIL_A3 = "55555555-5555-4555-8555-555555555555";
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

function fourWayInputs(options?: {
  requirements?: {
    observation_need_key: string;
    capability_semantic_key: string;
  }[];
  candidates?: {
    observation_need_key: string;
    observer_entity_id: string;
  }[];
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
  attentionCandidates?: AttentionCandidate[];
  needs?: ObservationNeed[];
}) {
  const attentionCandidates =
    options?.attentionCandidates ?? [
      baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
    ];
  const needs = options?.needs ?? [sampleObservationNeed(NEED_KEY)];
  const planning_set = buildAttentionObservationPlanningSet({
    eligibility_set: buildAttentionObservationEligibilitySet(
      emptyCandidateSet(attentionCandidates)
    ),
    observation_needs: needs,
  });

  const capability_requirement_set =
    buildAttentionObservationCapabilityRequirementSet({
      planning_set,
      specification: {
        requirements: options?.requirements ?? [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
        ],
      },
    });

  const observer_candidate_set = buildAttentionObservationObserverCandidateSet({
    planning_set,
    specification: {
      candidates: options?.candidates ?? [
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
      specification: {
        requirements: options?.scopeSpec ?? [],
      },
    });

  const capability_temporal_requirement_set =
    buildAttentionObservationCapabilityTemporalRequirementSet({
      capability_requirement_set,
      specification: {
        requirements: options?.temporalSpec ?? [],
      },
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

  return {
    capability_scope_applicability_set,
    capability_declaration_temporal_applicability_set,
    capability_verification_temporal_applicability_set,
    capability_availability_temporal_applicability_set,
  };
}

function firstCompositionPosition(
  result: ReturnType<
    typeof buildAttentionObservationCapabilityApplicabilityCompositionSet
  >
) {
  return result.candidate_assessments[0].observer_applicability_bases[0]
    .requirement_composition_positions[0].declaration_composition_positions[0];
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"USABLE"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"INFEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"CAN_EXECUTE"/.test(json));
  assert.ok(!/"effectively_available"/.test(json));
  assert.ok(!/"EFFECTIVE_AVAILABLE"/.test(json));
  assert.ok(!/"EFFECTIVE_UNAVAILABLE"/.test(json));
  assert.ok(!/"VERIFIED_AND_AVAILABLE"/.test(json));
  assert.ok(!/"PROVEN"/.test(json));
  assert.ok(!/"COMPLETE"/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"effective_window"/.test(json));
  assert.ok(!/"scope_and_time_applicable"/.test(json));
}

describe("Attention Observation Capability Applicability Composition (GROUND-060)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; composes 055/057/058/059; no 053/041–045/classifiers/ActiveAt/wall-clock", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-applicability-composition-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-applicability-composition-types.ts"
        ),
        "utf8"
      );

      assert.ok(/capability_scope_applicability_set/.test(types));
      assert.ok(/capability_declaration_temporal_applicability_set/.test(types));
      assert.ok(/capability_verification_temporal_applicability_set/.test(types));
      assert.ok(/capability_availability_temporal_applicability_set/.test(types));
      assert.ok(!/from ["'].*state-composition/.test(core));
      assert.ok(!/from ["'].*capability-state-composition/.test(core));
      assert.ok(!/from ["'].*observation-eligibility/.test(core));
      assert.ok(!/from ["'].*observation-planning/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(!/\bisCapability.*ActiveAt\s*\(/.test(core));
      assert.ok(!/capabilityScopeKey\s*\(/.test(core));
      assert.ok(
        !/classifyRequiredWindowAgainstCapabilityDeclarationInterval/.test(core)
      );
      assert.ok(
        !/classifyRequiredWindowAgainstCapabilityVerificationValidity/.test(
          core
        )
      );
      assert.ok(
        !/classifyRequiredWindowAgainstCapabilityAvailabilityInterval/.test(
          core
        )
      );
      assert.ok(
        /CAPABILITY_APPLICABILITY_COMPOSITION_BASIS_PRESENT/.test(types)
      );
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_APPLICABILITY_COMPOSITION_MODEL_LIMITATIONS.includes(
          "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
        )
      );
    });
  });

  describe("four-way sibling composition", () => {
    it("composes semantically equivalent 055/057/058/059 from same context", () => {
      const input = fourWayInputs({
        declarations: [
          capability({
            scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            valid_from: T09,
            valid_until: T15,
          }),
        ],
        verifications: [verification({ verified_at: T09, valid_until: T15 })],
        availabilities: [
          availability({
            status: "AVAILABLE",
            valid_from: T09,
            valid_until: T15,
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
      });

      const result =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(input);
      assert.equal(
        result.candidate_assessments[0].status,
        "CAPABILITY_APPLICABILITY_COMPOSITION_BASIS_PRESENT"
      );
      assert.equal(result.has_capability_applicability_composition_basis, true);

      const pos = firstCompositionPosition(result);
      assert.equal(
        pos.scope_dimension.scope_applicability_position?.status,
        "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      );
      assert.equal(
        pos.declaration_temporal_dimension
          .declaration_temporal_applicability_position?.relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
      assert.equal(
        pos.verification_temporal_dimension.verification_temporal_positions[0]
          .relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
      assert.equal(
        pos.availability_temporal_dimension.availability_temporal_positions[0]
          .relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
      assert.equal(
        pos.availability_temporal_dimension.availability_temporal_positions[0]
          .capability_availability_link.capability_availability_declaration
          .status,
        "AVAILABLE"
      );
      assertNoForbiddenSemantics(result);
    });

    it("deep-cloned equivalent inputs compose (pointer independence)", () => {
      const input = fourWayInputs({
        declarations: [capability()],
        temporalSpec: [
          {
            capability_requirement_key: reqKey(),
            required_window: { required_from: T10, required_until: T14 },
          },
        ],
      });
      const cloned = deepClone(input);
      const a =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(input);
      const b =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(cloned);
      assert.deepEqual(a, b);
    });

    it("preserves input immutability for all four sibling sets", () => {
      const input = fourWayInputs({
        declarations: [capability()],
        verifications: [verification()],
        availabilities: [availability()],
        scopeSpec: [
          {
            capability_requirement_key: reqKey(),
            required_scope: { kind: "UNSCOPED" },
          },
        ],
        temporalSpec: [
          {
            capability_requirement_key: reqKey(),
            required_window: { required_from: T10, required_until: T14 },
          },
        ],
      });
      const before = deepClone(input);
      buildAttentionObservationCapabilityApplicabilityCompositionSet(input);
      assert.deepEqual(input, before);
    });

    it("is deterministic across repeated calls", () => {
      const input = fourWayInputs({
        declarations: [capability()],
        verifications: [verification(), verification({ id: VER_V2 })],
        availabilities: [
          availability(),
          availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
        ],
        temporalSpec: [
          {
            capability_requirement_key: reqKey(),
            required_window: { required_from: T10, required_until: T14 },
          },
        ],
      });
      const a =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(input);
      const b =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(input);
      assert.deepEqual(a, b);
    });
  });

  describe("context mismatch rejection", () => {
    it("rejects AttentionCandidate mismatch", () => {
      const a = fourWayInputs();
      const b = fourWayInputs({
        attentionCandidates: [
          baseCandidate("OBSERVATION_NEED", {
            signalKey: "sig|other",
            observationNeedKeys: [NEED_KEY],
          }),
        ],
      });
      assert.throws(
        () =>
          assertCompatibleCapabilityApplicabilityCompositionContexts({
            capability_scope_applicability_set:
              a.capability_scope_applicability_set,
            capability_declaration_temporal_applicability_set:
              b.capability_declaration_temporal_applicability_set,
            capability_verification_temporal_applicability_set:
              a.capability_verification_temporal_applicability_set,
            capability_availability_temporal_applicability_set:
              a.capability_availability_temporal_applicability_set,
          }),
        /Capability Applicability inputs do not share the same Capability Declaration Match context/
      );
    });

    it("rejects ObservationNeed / CapabilityDeclaration.id mismatch via different needs", () => {
      const a = fourWayInputs();
      const b = fourWayInputs({
        needs: [sampleObservationNeed(NEED_KEY_2)],
        attentionCandidates: [
          baseCandidate("OBSERVATION_NEED", {
            signalKey: "sig|need2",
            observationNeedKeys: [NEED_KEY_2],
          }),
        ],
        requirements: [
          {
            observation_need_key: NEED_KEY_2,
            capability_semantic_key: CAP_C1,
          },
        ],
        candidates: [
          {
            observation_need_key: NEED_KEY_2,
            observer_entity_id: ENTITY_E1,
          },
        ],
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityApplicabilityCompositionSet({
            capability_scope_applicability_set:
              a.capability_scope_applicability_set,
            capability_declaration_temporal_applicability_set:
              b.capability_declaration_temporal_applicability_set,
            capability_verification_temporal_applicability_set:
              a.capability_verification_temporal_applicability_set,
            capability_availability_temporal_applicability_set:
              a.capability_availability_temporal_applicability_set,
          }),
        /Capability Applicability inputs do not share the same Capability Declaration Match context/
      );
    });

    it("rejects CapabilityDeclaration.id mismatch (D1 vs D2)", () => {
      const a = fourWayInputs({
        declarations: [capability({ id: DECL_D1 })],
      });
      const b = fourWayInputs({
        declarations: [capability({ id: DECL_D2 })],
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityApplicabilityCompositionSet({
            capability_scope_applicability_set:
              a.capability_scope_applicability_set,
            capability_declaration_temporal_applicability_set:
              b.capability_declaration_temporal_applicability_set,
            capability_verification_temporal_applicability_set:
              a.capability_verification_temporal_applicability_set,
            capability_availability_temporal_applicability_set:
              a.capability_availability_temporal_applicability_set,
          }),
        /CapabilityDeclaration\.id mismatch|CapabilityDeclarationMatch key mismatch/
      );
    });
  });

  describe("declaration identity / optional dimensions", () => {
    it("keeps same holder/key D1/D2 as separate composition positions", () => {
      const input = fourWayInputs({
        declarations: [
          capability({
            id: DECL_D1,
            scope: { kind: "ENTITY", entity_id: FACILITY_1 },
          }),
          capability({
            id: DECL_D2,
            scope: { kind: "UNSCOPED" },
          }),
        ],
      });
      const result =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(input);
      const positions =
        result.candidate_assessments[0].observer_applicability_bases[0]
          .requirement_composition_positions[0]
          .declaration_composition_positions;
      assert.equal(positions.length, 2);
      assert.equal(
        positions[0].capability_declaration_match.capability_declaration_id,
        DECL_D1
      );
      assert.equal(
        positions[1].capability_declaration_match.capability_declaration_id,
        DECL_D2
      );
    });

    it("creates composition position when all optional dimensions absent", () => {
      const input = fourWayInputs({
        declarations: [capability()],
        verifications: [],
        availabilities: [],
        scopeSpec: [],
        temporalSpec: [],
      });
      const result =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(input);
      assert.equal(
        result.candidate_assessments[0].status,
        "CAPABILITY_APPLICABILITY_COMPOSITION_BASIS_PRESENT"
      );
      const pos = firstCompositionPosition(result);
      assert.equal(pos.scope_dimension.scope_applicability_position, null);
      assert.equal(
        pos.declaration_temporal_dimension
          .declaration_temporal_applicability_position,
        null
      );
      assert.deepEqual(
        pos.verification_temporal_dimension.verification_temporal_positions,
        []
      );
      assert.deepEqual(
        pos.availability_temporal_dimension.availability_temporal_positions,
        []
      );
      assert.ok(!/"UNSCOPED"/.test(JSON.stringify(pos.scope_dimension)));
      assertNoForbiddenSemantics(result);
    });

    it("preserves scope exact / no-direct-basis without satisfaction or inapplicability", () => {
      const exact = fourWayInputs({
        declarations: [
          capability({ scope: { kind: "ENTITY", entity_id: FACILITY_1 } }),
        ],
        scopeSpec: [
          {
            capability_requirement_key: reqKey(),
            required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
          },
        ],
      });
      const exactPos = firstCompositionPosition(
        buildAttentionObservationCapabilityApplicabilityCompositionSet(exact)
      );
      assert.equal(
        exactPos.scope_dimension.scope_applicability_position?.status,
        "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      );

      const noDirect = fourWayInputs({
        declarations: [capability({ scope: { kind: "UNSCOPED" } })],
        scopeSpec: [
          {
            capability_requirement_key: reqKey(),
            required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
          },
        ],
      });
      const noDirectResult =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          noDirect
        );
      const noDirectPos = firstCompositionPosition(noDirectResult);
      assert.equal(
        noDirectPos.scope_dimension.scope_applicability_position?.status,
        "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
      );
      assert.ok(!/"INAPPLICABLE"/.test(JSON.stringify(noDirectResult)));
    });
  });

  describe("temporal / verification / availability dimensions", () => {
    it("preserves Declaration FULL/PARTIAL/NO without satisfaction inference", () => {
      const full = firstCompositionPosition(
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [
              capability({ valid_from: T09, valid_until: T15 }),
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
          })
        )
      );
      assert.equal(
        full.declaration_temporal_dimension
          .declaration_temporal_applicability_position?.relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );

      const partial = firstCompositionPosition(
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [
              capability({ valid_from: T10, valid_until: T12 }),
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
          })
        )
      );
      assert.equal(
        partial.declaration_temporal_dimension
          .declaration_temporal_applicability_position?.relation,
        "PARTIAL_REQUIRED_WINDOW_OVERLAP"
      );

      const none = firstCompositionPosition(
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [
              capability({ valid_from: T08, valid_until: T09 }),
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
          })
        )
      );
      assert.equal(
        none.declaration_temporal_dimension
          .declaration_temporal_applicability_position?.relation,
        "NO_REQUIRED_WINDOW_OVERLAP"
      );
    });

    it("preserves multiple Verification relations independently; absence ≠ failed", () => {
      const absent = firstCompositionPosition(
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [capability()],
            verifications: [],
            temporalSpec: [
              {
                capability_requirement_key: reqKey(),
                required_window: {
                  required_from: T10,
                  required_until: T14,
                },
              },
            ],
          })
        )
      );
      assert.deepEqual(
        absent.verification_temporal_dimension.verification_temporal_positions,
        []
      );

      const multi = firstCompositionPosition(
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [capability()],
            verifications: [
              verification({
                id: VER_V1,
                verified_at: T09,
                valid_until: T15,
              }),
              verification({
                id: VER_V2,
                verified_at: T10,
                valid_until: T12,
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
          })
        )
      );
      assert.equal(
        multi.verification_temporal_dimension.verification_temporal_positions
          .length,
        2
      );
      assert.equal(
        multi.verification_temporal_dimension.verification_temporal_positions[0]
          .relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
      assert.equal(
        multi.verification_temporal_dimension.verification_temporal_positions[1]
          .relation,
        "PARTIAL_REQUIRED_WINDOW_OVERLAP"
      );
    });

    it("preserves Availability two axes and conflicting records without winner", () => {
      const result =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [capability()],
            availabilities: [
              availability({
                id: AVAIL_A1,
                status: "AVAILABLE",
                valid_from: T09,
                valid_until: T15,
              }),
              availability({
                id: AVAIL_A2,
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
          })
        );
      const positions =
        firstCompositionPosition(result).availability_temporal_dimension
          .availability_temporal_positions;
      assert.equal(positions.length, 2);
      assert.equal(
        positions[0].capability_availability_link
          .capability_availability_declaration.status,
        "AVAILABLE"
      );
      assert.equal(positions[0].relation, "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(
        positions[1].capability_availability_link
          .capability_availability_declaration.status,
        "UNAVAILABLE"
      );
      assert.equal(positions[1].relation, "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.ok(!/"CONFLICTED"/.test(JSON.stringify(result)));
      assertNoForbiddenSemantics(result);
    });

    it("does not create V×A Cartesian product (2V × 3A → 1 D + 2 V + 3 A)", () => {
      const result =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [capability()],
            verifications: [
              verification({ id: VER_V1 }),
              verification({ id: VER_V2 }),
            ],
            availabilities: [
              availability({ id: AVAIL_A1 }),
              availability({ id: AVAIL_A2 }),
              availability({ id: AVAIL_A3 }),
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
          })
        );
      const decls =
        result.candidate_assessments[0].observer_applicability_bases[0]
          .requirement_composition_positions[0]
          .declaration_composition_positions;
      assert.equal(decls.length, 1);
      assert.equal(
        decls[0].verification_temporal_dimension.verification_temporal_positions
          .length,
        2
      );
      assert.equal(
        decls[0].availability_temporal_dimension.availability_temporal_positions
          .length,
        3
      );
      assert.equal(decls[0].key.includes(DECL_D1), true);
    });
  });

  describe("strong-looking combination firewall", () => {
    it("scope exact + D FULL + V FULL + A FULL AVAILABLE does not yield SATISFIED/HAS_CAPABILITY/READY/USABLE/FEASIBLE/CAN_EXECUTE", () => {
      const result =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [
              capability({
                scope: { kind: "ENTITY", entity_id: FACILITY_1 },
                valid_from: T09,
                valid_until: T15,
              }),
            ],
            verifications: [
              verification({ verified_at: T09, valid_until: T15 }),
            ],
            availabilities: [
              availability({
                status: "AVAILABLE",
                valid_from: T09,
                valid_until: T15,
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
          })
        );
      assertNoForbiddenSemantics(result);
      const pos = firstCompositionPosition(result);
      assert.equal(
        pos.scope_dimension.scope_applicability_position?.status,
        "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      );
      assert.equal(
        pos.declaration_temporal_dimension
          .declaration_temporal_applicability_position?.relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
      assert.equal(
        pos.verification_temporal_dimension.verification_temporal_positions[0]
          .relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
      assert.equal(
        pos.availability_temporal_dimension.availability_temporal_positions[0]
          .relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
      assert.equal(
        pos.availability_temporal_dimension.availability_temporal_positions[0]
          .capability_availability_link.capability_availability_declaration
          .status,
        "AVAILABLE"
      );
    });

    it("preserves scope exact + D FULL + V FULL with conflicting A AVAILABLE/UNAVAILABLE", () => {
      const result =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [
              capability({
                scope: { kind: "ENTITY", entity_id: FACILITY_1 },
                valid_from: T09,
                valid_until: T15,
              }),
            ],
            verifications: [
              verification({ verified_at: T09, valid_until: T15 }),
            ],
            availabilities: [
              availability({
                id: AVAIL_A1,
                status: "AVAILABLE",
                valid_from: T09,
                valid_until: T15,
              }),
              availability({
                id: AVAIL_A2,
                status: "UNAVAILABLE",
                valid_from: T09,
                valid_until: T15,
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
          })
        );
      const avail =
        firstCompositionPosition(result).availability_temporal_dimension
          .availability_temporal_positions;
      assert.equal(avail.length, 2);
      assertNoForbiddenSemantics(result);
    });

    it("preserves D FULL / V NO_OVERLAP and D NO_OVERLAP / V FULL independently", () => {
      const dFullVNone = firstCompositionPosition(
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [
              capability({ valid_from: T09, valid_until: T15 }),
            ],
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
          })
        )
      );
      assert.equal(
        dFullVNone.declaration_temporal_dimension
          .declaration_temporal_applicability_position?.relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
      assert.equal(
        dFullVNone.verification_temporal_dimension
          .verification_temporal_positions[0].relation,
        "NO_REQUIRED_WINDOW_OVERLAP"
      );

      const dNoneVFull = firstCompositionPosition(
        buildAttentionObservationCapabilityApplicabilityCompositionSet(
          fourWayInputs({
            declarations: [
              capability({ valid_from: T08, valid_until: T09 }),
            ],
            verifications: [
              verification({ verified_at: T09, valid_until: T15 }),
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
          })
        )
      );
      assert.equal(
        dNoneVFull.declaration_temporal_dimension
          .declaration_temporal_applicability_position?.relation,
        "NO_REQUIRED_WINDOW_OVERLAP"
      );
      assert.equal(
        dNoneVFull.verification_temporal_dimension
          .verification_temporal_positions[0].relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );
    });
  });

  describe("observer / cross-declaration firewalls", () => {
    it("does not pool identical Declarations across Observer contexts", () => {
      const input = fourWayInputs({
        candidates: [
          { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
          { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E2 },
        ],
        declarations: [
          capability({ holder_entity_id: ENTITY_E1 }),
          capability({ id: DECL_D2, holder_entity_id: ENTITY_E2 }),
        ],
      });
      const result =
        buildAttentionObservationCapabilityApplicabilityCompositionSet(input);
      assert.equal(
        result.candidate_assessments[0].observer_applicability_bases.length,
        2
      );
      assert.equal(
        result.candidate_assessments[0].observer_applicability_bases[0]
          .observer_candidate.observer_entity_id,
        ENTITY_E1
      );
      assert.equal(
        result.candidate_assessments[0].observer_applicability_bases[1]
          .observer_candidate.observer_entity_id,
        ENTITY_E2
      );
    });
  });
});
