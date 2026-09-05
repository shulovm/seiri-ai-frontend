/**
 * GROUND-059 — Observation Core XIII / Capability Availability Temporal Applicability Basis
 *
 * Pure 052 Availability Basis + 056 Temporal Requirement composition
 * (half-open Availability interval relations; raw polarity orthogonal; no effective state).
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
import { buildAttentionObservationCapabilityTemporalRequirementSet } from "../reality/attention-observation-capability-temporal-requirement-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
  assertCompatibleCapabilityAvailabilityTemporalApplicabilitySiblingContexts,
  buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet,
  classifyRequiredWindowAgainstCapabilityAvailabilityInterval,
} from "../reality/attention-observation-capability-availability-temporal-applicability-core.js";
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
const AVAIL_A1 = "11111111-1111-4111-8111-111111111111";
const AVAIL_A2 = "22222222-2222-4222-8222-222222222222";
const AVAIL_A3 = "33333333-3333-4333-8333-333333333333";
const AVAIL_A4 = "44444444-4444-4444-8444-444444444444";
const AVAIL_A5 = "55555555-5555-4555-8555-555555555555";

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

function availability(
  overrides: Partial<CapabilityAvailabilityDeclaration> = {}
): CapabilityAvailabilityDeclaration {
  return {
    id: AVAIL_A1,
    project_id: PROJECT_ID,
    capability_declaration_id: DECL_D1,
    status: "AVAILABLE",
    valid_from: T10,
    valid_until: T12,
    declared_by: { kind: "organization", entity_id: ENTITY_E2 },
    recorded_at: AT,
    note: null,
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
  availabilities?: CapabilityAvailabilityDeclaration[];
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

  const capability_availability_set =
    buildAttentionObservationCapabilityAvailabilitySet({
      capability_declaration_match_set,
      capability_availability_declarations: options?.availabilities ?? [
        availability(),
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
    capability_availability_set,
    capability_temporal_requirement_set,
    capability_requirement_set,
  };
}

function reqKey(cap = CAP_C1): string {
  return attentionObservationCapabilityRequirementKey(NEED_KEY, cap);
}

function firstAvailabilityPositions(
  result: ReturnType<
    typeof buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet
  >
) {
  return result.candidate_assessments[0].observer_availability_temporal_bases[0]
    .requirement_availability_temporal_positions[0]
    .declaration_availability_temporal_positions[0]
    .availability_temporal_positions;
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"effectively_available"/.test(json));
  assert.ok(!/"currently_available"/.test(json));
  assert.ok(!/"EFFECTIVE_AVAILABLE"/.test(json));
  assert.ok(!/"EFFECTIVE_UNAVAILABLE"/.test(json));
  assert.ok(!/"FULLY_AVAILABLE"/.test(json));
  assert.ok(!/"PARTIALLY_AVAILABLE"/.test(json));
  assert.ok(!/"AVAILABLE_FOR_REQUIREMENT"/.test(json));
  assert.ok(!/"UNAVAILABLE_FOR_REQUIREMENT"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"deadline"\s*:/.test(json));
  assert.ok(!/"urgency"\s*:/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
}

describe("Attention Observation Capability Availability Temporal Applicability (GROUND-059)", () => {
  describe("Availability interval / purity / architecture", () => {
    it("schema 0.1.24; 059-local classifier; no 051/053–055/057–058 / ActiveAt / wall-clock", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-availability-temporal-applicability-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-availability-temporal-applicability-types.ts"
        ),
        "utf8"
      );
      const capabilityTypes = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );

      assert.ok(/CapabilityAvailabilityStatus = "AVAILABLE" \| "UNAVAILABLE"/.test(
        capabilityTypes
      ));
      assert.ok(
        /classifyRequiredWindowAgainstCapabilityAvailabilityInterval/.test(
          core
        )
      );
      assert.ok(!/from ["'].*capability-verification/.test(core));
      assert.ok(!/from ["'].*state-composition/.test(core));
      assert.ok(!/from ["'].*scope-requirement/.test(core));
      assert.ok(!/from ["'].*scope-applicability/.test(core));
      assert.ok(!/from ["'].*declaration-temporal-applicability/.test(core));
      assert.ok(!/from ["'].*verification-temporal-applicability/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(!/\bisCapability.*ActiveAt\s*\(/.test(core));
      assert.ok(!/9999-12-31/.test(core));
      assert.ok(/raw_availability_status/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS
          .length === 27
      );
    });
  });

  describe("Pure Availability interval relation + polarity orthogonality", () => {
    const R = (from: string, until: string | null) => ({
      required_from: from,
      required_until: until,
    });
    const A = (from: string, until: string | null) => ({
      valid_from: from,
      valid_until: until,
    });
    const classify =
      classifyRequiredWindowAgainstCapabilityAvailabilityInterval;

    it("exact / wider / open-ended / adjacency relations", () => {
      assert.equal(classify(R(T10, T12), A(T10, T12)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), A(T08, T15)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), A(T09, T11)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), A(T11, T13)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), A(T08, T10)), "NO_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), A(T12, T14)), "NO_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), A(T09, null)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), A(T11, null)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, null), A(T09, T20)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, null), A(T08, null)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, null), A(T12, null)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
    });

    it("FULL+AVAILABLE and FULL+UNAVAILABLE both preserved; polarity ignored by classifier", () => {
      const key = reqKey();
      for (const status of ["AVAILABLE", "UNAVAILABLE"] as const) {
        const inputs = siblingInputs({
          availabilities: [
            availability({
              id: AVAIL_A1,
              status,
              valid_from: T09,
              valid_until: T15,
            }),
          ],
          temporalSpec: [
            {
              capability_requirement_key: key,
              required_window: { required_from: T10, required_until: T12 },
            },
          ],
        });
        const result =
          buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
            inputs
          );
        const pos = firstAvailabilityPositions(result)[0];
        assert.equal(pos.relation, "FULL_REQUIRED_WINDOW_COVERAGE");
        assert.equal(pos.applicability_basis.raw_availability_status, status);
        assert.equal(
          pos.capability_availability_link.capability_availability_declaration
            .status,
          status
        );
      }
    });
  });

  describe("Composition / independence / firewalls", () => {
    it("no Temporal Requirement → NOT_APPLICABLE…; absence ≠ UNAVAILABLE ≠ NO_OVERLAP", () => {
      const inputs = siblingInputs({
        availabilities: [
          availability({ status: "AVAILABLE", valid_from: T10, valid_until: T12 }),
        ],
        temporalSpec: [],
      });
      const before052 = structuredClone(inputs.capability_availability_set);
      const before056 = structuredClone(
        inputs.capability_temporal_requirement_set
      );
      const result =
        buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
          inputs
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS"
      );
      assert.deepEqual(
        result.candidate_assessments[0].observer_availability_temporal_bases[0]
          .requirement_availability_temporal_positions[0]
          .declaration_availability_temporal_positions,
        []
      );
      assert.deepEqual(inputs.capability_availability_set, before052);
      assert.deepEqual(inputs.capability_temporal_requirement_set, before056);
      assertNoForbiddenSemantics(result);
    });

    it("no Availability → NOT_APPLICABLE_NO_…AVAILABILITY…; not synthetic UNAVAILABLE", () => {
      const inputs = siblingInputs({
        availabilities: [],
        temporalSpec: [
          {
            capability_requirement_key: reqKey(),
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });
      const result =
        buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
          inputs
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED"
      );
    });

    it("multi-Availability: FULL AVAILABLE/UNAVAILABLE coexist; adjacent halves no union", () => {
      const key = reqKey();
      const inputs = siblingInputs({
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
          availability({
            id: AVAIL_A3,
            status: "AVAILABLE",
            valid_from: T10,
            valid_until: T12,
          }),
          availability({
            id: AVAIL_A4,
            status: "UNAVAILABLE",
            valid_from: T12,
            valid_until: T14,
          }),
          availability({
            id: AVAIL_A5,
            status: "AVAILABLE",
            valid_from: T14,
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
        buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
          inputs
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_PRESENT"
      );
      const positions = firstAvailabilityPositions(result);
      assert.equal(positions.length, 5);
      const byId = Object.fromEntries(
        positions.map((p) => [
          p.capability_availability_link.capability_availability_declaration_id,
          {
            relation: p.relation,
            status: p.applicability_basis.raw_availability_status,
          },
        ])
      );
      assert.deepEqual(byId[AVAIL_A1], {
        relation: "FULL_REQUIRED_WINDOW_COVERAGE",
        status: "AVAILABLE",
      });
      assert.deepEqual(byId[AVAIL_A2], {
        relation: "FULL_REQUIRED_WINDOW_COVERAGE",
        status: "UNAVAILABLE",
      });
      assert.deepEqual(byId[AVAIL_A3], {
        relation: "PARTIAL_REQUIRED_WINDOW_OVERLAP",
        status: "AVAILABLE",
      });
      assert.deepEqual(byId[AVAIL_A4], {
        relation: "PARTIAL_REQUIRED_WINDOW_OVERLAP",
        status: "UNAVAILABLE",
      });
      assert.deepEqual(byId[AVAIL_A5], {
        relation: "NO_REQUIRED_WINDOW_OVERLAP",
        status: "AVAILABLE",
      });
      assertNoForbiddenSemantics(result);
    });

    it("candidate basis PRESENT with only UNAVAILABLE records; disjoint existential → NO_RELATION", () => {
      const onlyUnavailable = siblingInputs({
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
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });
      const onlyResult =
        buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
          onlyUnavailable
        );
      assert.equal(
        onlyResult.candidate_assessments[0].status,
        "CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_PRESENT"
      );
      assert.equal(
        firstAvailabilityPositions(onlyResult)[0].applicability_basis
          .raw_availability_status,
        "UNAVAILABLE"
      );

      const disjoint = siblingInputs({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
        declarations: [
          capability({ id: DECL_D1, capability_key: CAP_C1 }),
          capability({ id: DECL_D2, capability_key: CAP_C2 }),
        ],
        availabilities: [
          availability({
            id: AVAIL_A1,
            capability_declaration_id: DECL_D1,
            status: "AVAILABLE",
          }),
        ],
        temporalSpec: [
          {
            capability_requirement_key: reqKey(CAP_C2),
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });
      const disjointResult =
        buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
          disjoint
        );
      assert.equal(
        disjointResult.candidate_assessments[0].status,
        "NO_CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_REPRESENTED"
      );
      assert.equal(
        disjointResult.has_capability_availability_temporal_relation_basis,
        false
      );
    });

    it("deep-clone compose; mismatch rejects; no upstream circular imports", () => {
      const key = reqKey();
      const inputs = siblingInputs({
        availabilities: [
          availability({
            status: "AVAILABLE",
            valid_from: T08,
            valid_until: T15,
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
        buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
          inputs
        );
      const b =
        buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
          {
            capability_availability_set: structuredClone(
              inputs.capability_availability_set
            ),
            capability_temporal_requirement_set: structuredClone(
              inputs.capability_temporal_requirement_set
            ),
          }
        );
      assert.deepEqual(a, b);

      const broken = structuredClone(
        inputs.capability_temporal_requirement_set
      );
      broken.candidate_assessments[0] = {
        ...broken.candidate_assessments[0],
        candidate_key: "attention-candidate|other",
      };
      assert.throws(
        () =>
          assertCompatibleCapabilityAvailabilityTemporalApplicabilitySiblingContexts(
            inputs.capability_availability_set,
            broken
          ),
        /do not share the same Capability Requirement context/
      );

      const availCore = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-availability-core.ts"
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
      const verTemporal = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-temporal-applicability-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/availability-temporal-applicability/.test(availCore));
      assert.ok(!/availability-temporal-applicability/.test(temporalReq));
      assert.ok(!/availability-temporal-applicability/.test(verTemporal));
    });
  });
});
