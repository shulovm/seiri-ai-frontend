/**
 * GROUND-057 — Observation Core XI / Capability Declaration Temporal Applicability Basis
 *
 * Pure 050 Declaration Match + 056 Temporal Requirement composition
 * (half-open interval relations only; no satisfaction / ActiveAt / wall-clock).
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
import { buildAttentionObservationCapabilityScopeRequirementSet } from "../reality/attention-observation-capability-scope-requirement-core.js";
import { buildAttentionObservationCapabilityScopeApplicabilitySet } from "../reality/attention-observation-capability-scope-applicability-core.js";
import { buildAttentionObservationCapabilityTemporalRequirementSet } from "../reality/attention-observation-capability-temporal-requirement-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
  assertCompatibleCapabilityTemporalApplicabilitySiblingContexts,
  buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet,
  classifyRequiredWindowAgainstCapabilityDeclarationValidity,
} from "../reality/attention-observation-capability-declaration-temporal-applicability-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import type {
  SalienceSignal,
  SalienceSignalKind,
} from "../reality/situation-types.js";
import type { CapabilityDeclaration, RealityEntity } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const ENTITY_E1 = "ff111111-1111-4111-8111-111111111111";
const ENTITY_E2 = "ff222222-2222-4222-8222-222222222222";
const FACILITY_1 = "ff777777-7777-4777-8777-777777777777";
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
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DECL_D2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const DECL_D3 = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const DECL_D4 = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";

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
    scope: { kind: "ENTITY", entity_id: FACILITY_1 },
    description: null,
    valid_from: T10,
    valid_until: T12,
    declared_by: { kind: "organization", entity_id: ENTITY_E2 },
    recorded_at: AT,
    created_at: AT,
    updated_at: AT,
    ...overrides,
  };
}

function siblingInputs(options?: {
  declarations?: CapabilityDeclaration[];
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

  const capability_temporal_requirement_set =
    buildAttentionObservationCapabilityTemporalRequirementSet({
      capability_requirement_set,
      specification: {
        requirements: options?.temporalSpec ?? [],
      },
    });

  return {
    capability_declaration_match_set,
    capability_temporal_requirement_set,
    capability_requirement_set,
  };
}

function reqKey(): string {
  return attentionObservationCapabilityRequirementKey(NEED_KEY, CAP_C1);
}

function firstPositions(
  result: ReturnType<
    typeof buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet
  >
) {
  return result.candidate_assessments[0].observer_temporal_bases[0]
    .requirement_temporal_positions[0].declaration_temporal_positions;
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"TEMPORALLY_APPLICABLE"/.test(json));
  assert.ok(!/"TEMPORALLY_INAPPLICABLE"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"CURRENTLY_VALID"/.test(json));
  assert.ok(!/"EXPIRED"/.test(json));
  assert.ok(!/"FUTURE"/.test(json));
  assert.ok(!/"ACTIVE"/.test(json));
  assert.ok(!/"INACTIVE"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"temporally_valid_observer"/.test(json));
  assert.ok(!/"temporally_qualified_observer"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"deadline"\s*:/.test(json));
  assert.ok(!/"urgency"\s*:/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
}

describe("Attention Observation Capability Declaration Temporal Applicability (GROUND-057)", () => {
  describe("Interval semantics / purity / architecture", () => {
    it("schema 0.1.24; half-open helpers; no 051–055 / ActiveAt / wall-clock / fake infinity", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-temporal-applicability-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-temporal-applicability-types.ts"
        ),
        "utf8"
      );

      assert.ok(/FULL_REQUIRED_WINDOW_COVERAGE/.test(types));
      assert.ok(/PARTIAL_REQUIRED_WINDOW_OVERLAP/.test(types));
      assert.ok(/NO_REQUIRED_WINDOW_OVERLAP/.test(types));
      assert.ok(
        /classifyRequiredWindowAgainstCapabilityDeclarationValidity/.test(core)
      );

      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*capability-verification/.test(core));
      assert.ok(!/from ["'].*capability-availability/.test(core));
      assert.ok(!/from ["'].*state-composition/.test(core));
      assert.ok(!/from ["'].*scope-requirement/.test(core));
      assert.ok(!/from ["'].*scope-applicability/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(!/\bisCapability.*ActiveAt\s*\(/.test(core));
      assert.ok(!/\bisIntervalActiveAt\s*\(/.test(core));
      assert.ok(!/9999-12-31/.test(core));
      assert.ok(!/midpoint/.test(core));
      assert.ok(!/epsilon/.test(core));
      assert.ok(!/=\s*"SATISFIED"/.test(types));
      assert.ok(!/=\s*"TEMPORALLY_APPLICABLE"/.test(types));
      assert.ok(!/=\s*"CURRENTLY_VALID"/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS
          .length === 25
      );
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS.includes(
          "CROSS_DECLARATION_TEMPORAL_COMPOSITION_NOT_MODELED"
        )
      );
    });
  });

  describe("Pure interval relation classification", () => {
    const R = (from: string, until: string | null) => ({
      required_from: from,
      required_until: until,
    });
    const D = (from: string, until: string | null) => ({
      valid_from: from,
      valid_until: until,
    });
    const classify = classifyRequiredWindowAgainstCapabilityDeclarationValidity;

    it("exact / wider / earlier-equal-end / equal-start-later-end → FULL", () => {
      assert.equal(classify(R(T10, T12), D(T10, T12)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), D(T08, T15)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), D(T08, T12)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), D(T10, T15)), "FULL_REQUIRED_WINDOW_COVERAGE");
    });

    it("left / right / inside partial overlaps", () => {
      assert.equal(classify(R(T10, T12), D(T09, T11)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), D(T11, T13)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T14), D(T11, T13)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
    });

    it("half-open adjacency and before/after → NO_OVERLAP", () => {
      assert.equal(classify(R(T10, T12), D(T08, T10)), "NO_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), D(T12, T14)), "NO_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), D(T08, T09)), "NO_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, T12), D(T13, T15)), "NO_REQUIRED_WINDOW_OVERLAP");
    });

    it("open-ended required / declaration cases", () => {
      assert.equal(classify(R(T10, T12), D(T09, null)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, T12), D(T11, null)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, null), D(T09, T20)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, null), D(T08, null)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, null), D(T10, null)), "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(classify(R(T10, null), D(T12, null)), "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(classify(R(T10, null), D(T08, T10)), "NO_REQUIRED_WINDOW_OVERLAP");
    });
  });

  describe("Composition / independence / firewalls", () => {
    it("no Temporal Requirement → NOT_APPLICABLE…; empty positions; no synthetic interval", () => {
      const inputs = siblingInputs({
        declarations: [capability({ valid_from: T10, valid_until: T12 })],
        temporalSpec: [],
      });
      const before050 = structuredClone(inputs.capability_declaration_match_set);
      const before056 = structuredClone(inputs.capability_temporal_requirement_set);

      const result =
        buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet(
          inputs
        );

      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT"
      );
      assert.equal(
        result.has_capability_declaration_temporal_relation_basis,
        false
      );
      assert.deepEqual(
        result.candidate_assessments[0].observer_temporal_bases[0]
          .requirement_temporal_positions[0].declaration_temporal_positions,
        []
      );
      assert.deepEqual(inputs.capability_declaration_match_set, before050);
      assert.deepEqual(inputs.capability_temporal_requirement_set, before056);
      assertNoForbiddenSemantics(result);
    });

    it("multi-declaration relations preserved independently; adjacent halves do not union to FULL", () => {
      const key = reqKey();
      const inputs = siblingInputs({
        declarations: [
          capability({
            id: DECL_D1,
            valid_from: T09,
            valid_until: T15,
          }),
          capability({
            id: DECL_D2,
            valid_from: T10,
            valid_until: T12,
          }),
          capability({
            id: DECL_D3,
            valid_from: T12,
            valid_until: T14,
          }),
          capability({
            id: DECL_D4,
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
        buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet(
          inputs
        );
      assert.equal(
        result.candidate_assessments[0].status,
        "CAPABILITY_DECLARATION_TEMPORAL_RELATION_BASIS_PRESENT"
      );
      const positions = firstPositions(result);
      assert.equal(positions.length, 4);
      const byId = Object.fromEntries(
        positions.map((p) => [
          p.capability_declaration_match.capability_declaration_id,
          p.relation,
        ])
      );
      assert.equal(byId[DECL_D1], "FULL_REQUIRED_WINDOW_COVERAGE");
      assert.equal(byId[DECL_D2], "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(byId[DECL_D3], "PARTIAL_REQUIRED_WINDOW_OVERLAP");
      assert.equal(byId[DECL_D4], "NO_REQUIRED_WINDOW_OVERLAP");
      // NO_OVERLAP still has a basis object
      const noOverlap = positions.find(
        (p) =>
          p.capability_declaration_match.capability_declaration_id === DECL_D4
      )!;
      assert.ok(noOverlap.applicability_basis !== null);
      assert.equal(
        noOverlap.applicability_basis.relation,
        "NO_REQUIRED_WINDOW_OVERLAP"
      );
      assertNoForbiddenSemantics(result);
    });

    it("FULL coverage != satisfaction; deep-clone compose; mismatch rejects", () => {
      const key = reqKey();
      const inputs = siblingInputs({
        declarations: [
          capability({ valid_from: T08, valid_until: T15 }),
        ],
        temporalSpec: [
          {
            capability_requirement_key: key,
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });

      const a =
        buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet(
          inputs
        );
      const b =
        buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet({
          capability_declaration_match_set: structuredClone(
            inputs.capability_declaration_match_set
          ),
          capability_temporal_requirement_set: structuredClone(
            inputs.capability_temporal_requirement_set
          ),
        });
      assert.deepEqual(a, b);
      assert.equal(firstPositions(a)[0].relation, "FULL_REQUIRED_WINDOW_COVERAGE");
      assertNoForbiddenSemantics(a);

      const other = siblingInputs({
        declarations: [capability({ valid_from: T10, valid_until: T12 })],
        temporalSpec: [],
      });
      // Mismatch: different temporal requirement set shape vs match set with same candidate but empty temporal assessments vs populated — use candidate key swap
      const broken = structuredClone(inputs.capability_temporal_requirement_set);
      broken.candidate_assessments[0] = {
        ...broken.candidate_assessments[0],
        candidate_key: "attention-candidate|other",
      };
      assert.throws(
        () =>
          assertCompatibleCapabilityTemporalApplicabilitySiblingContexts(
            inputs.capability_declaration_match_set,
            broken
          ),
        /do not share the same Capability Requirement context/
      );
      void other;
    });

    it("Scope 055 independence: temporal FULL with no scope basis remain representable", () => {
      const key = reqKey();
      const inputs = siblingInputs({
        declarations: [
          capability({
            scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            valid_from: T08,
            valid_until: null,
          }),
        ],
        temporalSpec: [
          {
            capability_requirement_key: key,
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });

      const temporal =
        buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet(
          inputs
        );
      assert.equal(
        firstPositions(temporal)[0].relation,
        "FULL_REQUIRED_WINDOW_COVERAGE"
      );

      // Scope applicability without matching scope requirement → no direct scope basis
      const scopeReq = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set: inputs.capability_requirement_set,
        specification: { requirements: [] },
      });
      const scopeApp = buildAttentionObservationCapabilityScopeApplicabilitySet({
        capability_declaration_match_set:
          inputs.capability_declaration_match_set,
        capability_scope_requirement_set: scopeReq,
      });
      assert.equal(
        scopeApp.has_direct_scope_applicability_basis,
        false
      );
      // Temporal still independently FULL
      assert.equal(
        temporal.has_capability_declaration_temporal_relation_basis,
        true
      );
    });

    it("050/056 do not import 057; 057 does not import 051–055", () => {
      const matchCore = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-core.ts"
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
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-temporal-applicability-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/declaration-temporal-applicability/.test(matchCore));
      assert.ok(!/declaration-temporal-applicability/.test(temporalReq));
      assert.ok(!/capability-verification/.test(core));
      assert.ok(!/capability-availability/.test(core));
      assert.ok(!/state-composition/.test(core));
      assert.ok(!/scope-requirement/.test(core));
      assert.ok(!/scope-applicability/.test(core));
    });

    it("determinism: repeated deepEqual", () => {
      const key = reqKey();
      const inputs = siblingInputs({
        declarations: [
          capability({ id: DECL_D1, valid_from: T11, valid_until: T13 }),
          capability({ id: DECL_D2, valid_from: T08, valid_until: T10 }),
        ],
        temporalSpec: [
          {
            capability_requirement_key: key,
            required_window: { required_from: T10, required_until: T12 },
          },
        ],
      });
      const a =
        buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet(
          inputs
        );
      const b =
        buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet(
          inputs
        );
      assert.deepEqual(a, b);
      const relations = firstPositions(a).map((p) => p.relation);
      assert.deepEqual(relations, [
        "PARTIAL_REQUIRED_WINDOW_OVERLAP",
        "NO_REQUIRED_WINDOW_OVERLAP",
      ]);
    });
  });
});
