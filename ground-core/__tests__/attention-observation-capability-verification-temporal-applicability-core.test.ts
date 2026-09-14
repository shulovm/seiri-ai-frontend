/**
 * GROUND-058 — Observation Core XII / Capability Verification Temporal Applicability Basis
 *
 * Pure 051 Verification Basis + 056 Temporal Requirement composition
 * (half-open Verification interval relations; no truth / PROVEN / 057).
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
import { buildAttentionObservationCapabilityTemporalRequirementSet } from "../reality/attention-observation-capability-temporal-requirement-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
  assertCompatibleCapabilityVerificationTemporalApplicabilitySiblingContexts,
  buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet,
  classifyRequiredWindowAgainstCapabilityVerificationValidity,
} from "../reality/attention-observation-capability-verification-temporal-applicability-core.js";
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
  CapabilityDeclaration,
  CapabilityVerificationDeclaration,
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
const T10 = "2026-09-01T10:00:00.000Z";
const T11 = "2026-09-01T11:00:00.000Z";
const T12 = "2026-09-01T12:00:00.000Z";
const T13 = "2026-09-01T13:00:00.000Z";
const T14 = "2026-09-01T14:00:00.000Z";
const T15 = "2026-09-01T15:00:00.000Z";
const T18 = "2026-09-01T18:00:00.000Z";
const T20 = "2026-09-01T20:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "inspect";
const CAP_C2 = "human_inspection";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DECL_D2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const VER_V1 = "11111111-1111-4111-8111-111111111111";
const VER_V2 = "22222222-2222-4222-8222-222222222222";
const VER_V3 = "33333333-3333-4333-8333-333333333333";
const VER_V4 = "44444444-4444-4444-8444-444444444444";
const EVIDENCE_A = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const EVIDENCE_B = "ffffffff-ffff-4fff-8fff-ffffffffffff";

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
    verified_at: T10,
    valid_until: T12,
    note: null,
    recorded_at: AT,
    created_at: AT,
    updated_at: AT,
    ...overrides,
  };
}

function siblingInputs(options?: {
  requirements?: {
    observation_need_key: string;
    capability_semantic_key: string;
  }[];
  declarations?: CapabilityDeclaration[];
  verifications?: CapabilityVerificationDeclaration[];
  temporalSpec?: {
    capability_requirement_key: string;
    required_window: {
      required_from: string;
      required_until: string | null;
    };
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
        requirements: options?.requirements ?? [
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
      capability_verification_declarations: options?.verifications ?? [
        verification(),
      ],
    });

  const capability_temporal_requirement_set =
    buildAttentionObservationCapabilityTemporalRequirementSet({
      capability_requirement_set,
      specification: {
        requirements: options?.temporalSpec ?? [],
      },
    });

  return {
    capability_verification_set,
    capability_temporal_requirement_set,
    capability_requirement_set,
  };
}

function reqKey(cap = CAP_C1): string {
  return attentionObservationCapabilityRequirementKey(NEED_KEY, cap);
}

function firstVerificationPositions(
  result: ReturnType<
    typeof buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet
  >
) {
  return result.candidate_assessments[0].observer_verification_temporal_bases[0]
    .requirement_verification_temporal_positions[0]
    .declaration_verification_temporal_positions[0]
    .verification_temporal_positions;
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PROVEN"/.test(json));
  assert.ok(!/"effectively_verified"/.test(json));
  assert.ok(!/"TEMPORALLY_APPLICABLE"/.test(json));
  assert.ok(!/"VERIFICATION_TEMPORALLY_APPLICABLE"/.test(json));
  assert.ok(!/"CURRENTLY_VERIFIED"/.test(json));
  assert.ok(!/"VERIFIED_FOR_REQUIREMENT"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"verified_observer"/.test(json));
  assert.ok(!/"temporally_verified_observer"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"deadline"\s*:/.test(json));
  assert.ok(!/"urgency"\s*:/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
  assert.ok(!/"FRESH"/.test(json));
  assert.ok(!/"STALE"/.test(json));
}

describe("Attention Observation Capability Verification Temporal Applicability (GROUND-058)", () => {
  describe("Verification interval / purity / architecture", () => {
    it("schema 0.1.24; 058-local classifier; no 052–055/057 / ActiveAt / wall-clock / fake infinity", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-temporal-applicability-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-temporal-applicability-types.ts"
        ),
        "utf8"
      );
      const capabilityTypes = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );

      assert.ok(/verified_at: string/.test(capabilityTypes));
      assert.ok(/Interval: \[verified_at, valid_until\)/.test(capabilityTypes));
      assert.ok(
        /classifyRequiredWindowAgainstCapabilityVerificationValidity/.test(
          core
        )
      );
      assert.ok(
        !/classifyRequiredWindowAgainstCapabilityDeclarationValidity/.test(
          core
        )
      );
      assert.ok(!/from ["'].*declaration-temporal-applicability/.test(core));
      assert.ok(!/from ["'].*capability-availability/.test(core));
      assert.ok(!/from ["'].*state-composition/.test(core));
      assert.ok(!/from ["'].*scope-requirement/.test(core));
      assert.ok(!/from ["'].*scope-applicability/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(!/\bisCapability.*ActiveAt\s*\(/.test(core));
      assert.ok(!/9999-12-31/.test(core));
      assert.ok(!/midpoint/.test(core));
      assert.ok(!/=\s*"SATISFIED"/.test(types));
      assert.ok(!/=\s*"PROVEN"/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS
          .length === 26
      );
    });
  });

  describe("Pure Verification interval relation classification", () => {
    const R = (from: string, until: string | null) => ({
      required_from: from,
      required_until: until,
    });
    const V = (from: string, until: string | null) => ({
      verified_at: from,
      valid_until: until,
    });
    const classify =
      classifyRequiredWindowAgainstCapabilityVerificationValidity;

    it("exact / wider / earlier-equal-end / equal-start-later-end → FULL", () => {
      assert.equal(classify(R(T10, T12), V(T10, T12)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), V(T08, T15)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), V(T08, T12)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), V(T10, T15)), "FULL_REQUIRED_WINDOW_COVERAGE");
    });

    it("left / right / inside partial; half-open adjacency NO_OVERLAP", () => {
      assert.equal(classify(R(T10, T12), V(T09, T11)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), V(T11, T13)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T14), V(T11, T13)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), V(T08, T10)), "NO_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), V(T12, T14)), "NO_REQUIRED_WINDOW_OVERLAP");
    });

    it("open-ended required / verification cases", () => {
      assert.equal(classify(R(T10, T12), V(T09, null)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), V(T11, null)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, null), V(T09, T20)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, null), V(T08, null)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, null), V(T10, null)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, null), V(T12, null)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, null), V(T08, T10)), "NO_REQUIRED_WINDOW_OVERLAP");
    });
  });

  describe("Composition / independence / firewalls", () => {
    it("no Temporal Requirement → NOT_APPLICABLE…; empty positions; absence ≠ NO_OVERLAP", () => {
      const inputs = siblingInputs({
        verifications: [
          verification({ verified_at: T10, valid_until: T12 }),
        ],
        temporalSpec: [],
      });
      const before051 = structuredClone(inputs.capability_verification_set);
      const before056 = structuredClone(
        inputs.capability_temporal_requirement_set
      );

      const result =
        buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
          inputs
        );

      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS"
      );
      assert.equal(
        result.has_capability_verification_temporal_relation_basis,
        false
      );
      assert.deepEqual(
        result.candidate_assessments[0].observer_verification_temporal_bases[0]
          .requirement_verification_temporal_positions[0]
          .declaration_verification_temporal_positions,
        []
      );
      assert.deepEqual(inputs.capability_verification_set, before051);
      assert.deepEqual(inputs.capability_temporal_requirement_set, before056);
      assertNoForbiddenSemantics(result);
    });

    it("no Verification record → NOT_APPLICABLE_NO_…VERIFICATION…; not NO_OVERLAP", () => {
      const inputs = siblingInputs({
        verifications: [],
        temporalSpec: [
          {
            capability_requirement_key: reqKey(),
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });
      const result =
        buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
          inputs
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED"
      );
      assert.equal(
        result.has_capability_verification_temporal_relation_basis,
        false
      );
    });

    it("multi-Verification relations independent; adjacent halves do not union; evidence/verifier ignored", () => {
      const key = reqKey();
      const inputs = siblingInputs({
        declarations: [capability({ id: DECL_D1 })],
        verifications: [
          verification({
            id: VER_V1,
            verified_at: T09,
            valid_until: T15,
            evidence_ids: [EVIDENCE_A],
          }),
          verification({
            id: VER_V2,
            verified_at: T10,
            valid_until: T12,
            evidence_ids: [EVIDENCE_A, EVIDENCE_B],
            verified_by: { kind: "organization", entity_id: ENTITY_E1 },
          }),
          verification({
            id: VER_V3,
            verified_at: T12,
            valid_until: T14,
            evidence_ids: [],
          }),
          verification({
            id: VER_V4,
            verified_at: T14,
            valid_until: T18,
          }),
        ],
        temporalSpec: [
          {
            capability_requirement_key: key,
            required_window: { required_from: T10, required_until: T14 },
          },
        ],
      });

      const result =
        buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
          inputs
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "CAPABILITY_VERIFICATION_TEMPORAL_RELATION_BASIS_PRESENT"
      );
      const positions = firstVerificationPositions(result);
      assert.equal(positions.length, 4);
      const byId = Object.fromEntries(
        positions.map((p) => [
          p.capability_verification_link.capability_verification_declaration_id,
          p.relation,
        ])
      );
      assert.equal(byId[VER_V1], "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(byId[VER_V2], "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(byId[VER_V3], "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(byId[VER_V4], "NO_REQUIRED_WINDOW_OVERLAP");
      assert.ok(
        positions.find(
          (p) =>
            p.capability_verification_link
              .capability_verification_declaration_id === VER_V4
        )!.applicability_basis !== null
      );
      assertNoForbiddenSemantics(result);
    });

    it("disjoint existential: V on R1 / T on R2 → NO_RELATION_BASIS_REPRESENTED", () => {
      const inputs = siblingInputs({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
        declarations: [
          capability({ id: DECL_D1, capability_key: CAP_C1 }),
          capability({
            id: DECL_D2,
            capability_key: CAP_C2,
          }),
        ],
        verifications: [
          verification({
            id: VER_V1,
            capability_declaration_id: DECL_D1,
            verified_at: T10,
            valid_until: T12,
          }),
          // D2 has no Verification
        ],
        temporalSpec: [
          // Temporal only for C2 (which has Declaration but no Verification)
          {
            capability_requirement_key: reqKey(CAP_C2),
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });

      const result =
        buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
          inputs
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_CAPABILITY_VERIFICATION_TEMPORAL_RELATION_BASIS_REPRESENTED"
      );
      assert.equal(
        result.has_capability_verification_temporal_relation_basis,
        false
      );
      assert.equal(
        inputs.capability_verification_set.has_capability_verification_declarations,
        true
      );
      assert.equal(
        inputs.capability_temporal_requirement_set
          .has_explicit_capability_temporal_requirements,
        true
      );
    });

    it("deep-clone compose; context mismatch rejects; no 057 import", () => {
      const key = reqKey();
      const inputs = siblingInputs({
        verifications: [
          verification({ verified_at: T08, valid_until: T15 }),
        ],
        temporalSpec: [
          {
            capability_requirement_key: key,
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });

      const a =
        buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
          inputs
        );
      const b =
        buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
          {
            capability_verification_set: structuredClone(
              inputs.capability_verification_set
            ),
            capability_temporal_requirement_set: structuredClone(
              inputs.capability_temporal_requirement_set
            ),
          }
        );
      assert.deepEqual(a, b);
      assert.equal(
        firstVerificationPositions(a)[0].relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );

      const broken = structuredClone(
        inputs.capability_temporal_requirement_set
      );
      broken.candidate_assessments[0] = {
        ...broken.candidate_assessments[0],
        candidate_key: "attention-candidate|other",
      };
      assert.throws(
        () =>
          assertCompatibleCapabilityVerificationTemporalApplicabilitySiblingContexts(
            inputs.capability_verification_set,
            broken
          ),
        /do not share the same Capability Requirement context/
      );

      const verCore = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-core.ts"
        ),
        "utf8"
      );
      const temporalReq = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-temporal-requirement-core.ts"
        ),
        "utf8"
      );
      const declTemporal = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-temporal-applicability-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/verification-temporal-applicability/.test(verCore));
      assert.ok(!/verification-temporal-applicability/.test(temporalReq));
      assert.ok(!/verification-temporal-applicability/.test(declTemporal));
    });

    it("determinism: repeated deepEqual", () => {
      const key = reqKey();
      const inputs = siblingInputs({
        verifications: [
          verification({
            id: VER_V1,
            verified_at: T11,
            valid_until: T13,
          }),
          verification({
            id: VER_V2,
            verified_at: T08,
            valid_until: T10,
          }),
        ],
        temporalSpec: [
          {
            capability_requirement_key: key,
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });
      const a =
        buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
          inputs
        );
      const b =
        buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
          inputs
        );
      assert.deepEqual(a, b);
      const relations = firstVerificationPositions(a).map((p) => p.relation);
      assert.deepEqual(relations, [
        "PARTIAL_REQUIRED_WINDOW_OVERLAP",
        "NO_REQUIRED_WINDOW_OVERLAP",
      ]);
    });
  });
});
