/**
 * GROUND-050 — Observation Core IV / Observer Capability Declaration Match Basis
 *
 * Pure composition of 048 + 049 + CapabilityDeclaration[] (no ProjectState /
 * no 041–045 / no Verification / Availability / Permission / satisfaction).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { buildAttentionObservationEligibilitySet } from "../reality/attention-observation-eligibility-core.js";
import { buildAttentionObservationPlanningSet } from "../reality/attention-observation-planning-core.js";
import { buildAttentionObservationCapabilityRequirementSet } from "../reality/attention-observation-capability-requirement-core.js";
import { buildAttentionObservationObserverCandidateSet } from "../reality/attention-observation-observer-candidate-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_MATCH_MODEL_LIMITATIONS,
  assertCompatibleObservationCapabilitySiblingContexts,
  attentionObservationCapabilityDeclarationMatchKey,
  buildAttentionObservationCapabilityDeclarationMatchSet,
  normalizeCapabilityDeclarationCollection,
} from "../reality/attention-observation-capability-declaration-match-core.js";
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
  RealityEntity,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const SUBJECT_S2 = "ff020202-0202-4202-8202-020202020202";
const ENTITY_E1 = "ff111111-1111-4111-8111-111111111111";
const ENTITY_E2 = "ff222222-2222-4222-8222-222222222222";
const ENTITY_E3 = "ff333333-3333-4333-8333-333333333333";
const ORG_O = "ff444444-4444-4444-8444-444444444444";
const ASSET_A = "ff555555-5555-4555-8555-555555555555";
const OWNER_P = "ff666666-6666-4666-8666-666666666666";
const AT = "2026-09-01T10:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const OTHER_NEED_KEY = "observation-need|other|q|2";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "satellite_imaging";
const CAP_C2 = "human_inspection";
const CAP_C3 = "spectral_analysis";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DECL_D2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const DECL_D3 = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

function sampleEntity(
  id: string,
  kind = "person",
  label = "observer"
): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind,
    label,
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

function planningSetFor(
  candidates: AttentionCandidate[],
  observationNeeds: ObservationNeed[]
) {
  const eligibilitySet = buildAttentionObservationEligibilitySet(
    emptyCandidateSet(candidates)
  );
  return buildAttentionObservationPlanningSet({
    eligibility_set: eligibilitySet,
    observation_needs: observationNeeds,
  });
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
    valid_from: "2020-01-01T00:00:00.000Z",
    valid_until: "2030-01-01T00:00:00.000Z",
    declared_by: { kind: "organization", entity_id: ORG_O },
    recorded_at: AT,
    created_at: AT,
    updated_at: AT,
    ...overrides,
  };
}

function siblingSets(options?: {
  requirements?: { observation_need_key: string; capability_semantic_key: string }[];
  candidates?: { observation_need_key: string; observer_entity_id: string }[];
  entities?: RealityEntity[];
  needs?: ObservationNeed[];
  attentionCandidates?: AttentionCandidate[];
}) {
  const attentionCandidates =
    options?.attentionCandidates ?? [
      baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
    ];
  const needs = options?.needs ?? [sampleObservationNeed(NEED_KEY)];
  const planning_set = planningSetFor(attentionCandidates, needs);

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
    observer_entities:
      options?.entities ?? [
        sampleEntity(ENTITY_E1),
        sampleEntity(ENTITY_E2),
        sampleEntity(ENTITY_E3),
        sampleEntity(ORG_O, "organization", "org"),
        sampleEntity(ASSET_A, "asset", "asset"),
        sampleEntity(OWNER_P),
      ],
  });

  return { capability_requirement_set, observer_candidate_set, planning_set };
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"MET"/.test(json));
  assert.ok(!/"UNMET"/.test(json));
  assert.ok(!/"FULFILLED"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"QUALIFIED"/.test(json));
  assert.ok(!/"UNQUALIFIED"/.test(json));
  assert.ok(!/"matching_observers"/.test(json));
  assert.ok(!/"capable_observers"/.test(json));
  assert.ok(!/"qualified_observers"/.test(json));
  assert.ok(!/"suitable_observers"/.test(json));
  assert.ok(!/"ALL_MATCHED"/.test(json));
  assert.ok(!/"PARTIALLY_MATCHED"/.test(json));
  assert.ok(!/"NONE_MATCHED"/.test(json));
  assert.ok(!/"PARTIALLY_CAPABLE"/.test(json));
  assert.ok(!/"SCOPE_APPLICABLE"/.test(json));
  assert.ok(!/"SCOPE_NOT_APPLICABLE"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"INFEASIBLE"/.test(json));
  assert.ok(!/"CAN_OBSERVE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"ACTIVE"/.test(json));
  assert.ok(!/"EXPIRED"/.test(json));
  assert.ok(!/"CURRENT"/.test(json));
  assert.ok(!/"NOT_YET_ACTIVE"/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
}

describe("Attention Observation Capability Declaration Match (GROUND-050)", () => {
  describe("CapabilityDeclaration audit / purity / schema", () => {
    it("schema 0.1.24; CapabilityDeclaration fields; no ProjectState / 041-045 / verification runtime", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-types.ts"
        ),
        "utf8"
      );
      const capabilityTypes = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );

      assert.ok(/export interface CapabilityDeclaration/.test(capabilityTypes));
      assert.ok(/holder_entity_id: string/.test(capabilityTypes));
      assert.ok(/capability_key: string/.test(capabilityTypes));
      assert.ok(/scope: CapabilityScope/.test(capabilityTypes));
      assert.ok(/valid_from: string/.test(capabilityTypes));
      assert.ok(/valid_until: string \| null/.test(capabilityTypes));
      assert.ok(/declared_by: ReferenceDeclarer/.test(capabilityTypes));
      assert.ok(/recorded_at: string/.test(capabilityTypes));
      assert.ok(
        /export interface CapabilityVerificationDeclaration/.test(
          capabilityTypes
        )
      );
      assert.ok(
        /export interface CapabilityAvailabilityDeclaration/.test(
          capabilityTypes
        )
      );

      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/from ["'].*capability-core/.test(core));
      assert.ok(!/from ["'].*types\.js["'].*ProjectState|ProjectState.*from/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bimport\s+\{[^}]*StatePatch/.test(core));
      assert.ok(!/saveProject/.test(core));
      assert.ok(!/applyPatch/.test(core));
      assert.ok(!/attention-resolution-/.test(core));
      assert.ok(!/attention-basis-requirement/.test(core));
      assert.ok(!/isCapabilityDeclarationActiveAt/.test(core));
      assert.ok(!/CapabilityVerificationDeclaration\[\]/.test(types));
      assert.ok(!/CapabilityAvailabilityDeclaration\[\]/.test(types));
      assert.ok(
        !/AttentionObservationCapabilityDeclarationMatchStatus[\s\S]*SATISFIED/.test(
          types
        )
      );
      assert.ok(!/has_capability\s*[:=]/.test(types));
      assert.ok(!/=\s*"QUALIFIED"/.test(types));
      assert.ok(!/=\s*"SATISFIED"/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_MATCH_MODEL_LIMITATIONS
          .length === 33
      );
    });
  });

  describe("Branch consistency", () => {
    it("compatible sibling 048/049 contexts compose; equivalent structures without pointer identity", () => {
      const a = siblingSets();
      const b = siblingSets();
      assert.notEqual(
        a.capability_requirement_set,
        b.capability_requirement_set
      );
      assert.notEqual(a.observer_candidate_set, b.observer_candidate_set);

      assertCompatibleObservationCapabilitySiblingContexts(
        a.capability_requirement_set,
        b.observer_candidate_set
      );

      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set: a.capability_requirement_set,
        observer_candidate_set: b.observer_candidate_set,
        capability_declarations: [capability()],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT"
      );
    });

    it("mismatched ObservationNeed / AttentionCandidate contexts reject deterministically", () => {
      const left = siblingSets({
        attentionCandidates: [
          baseCandidate("OBSERVATION_NEED", {
            signalKey: "sig|need-a",
            observationNeedKeys: [NEED_KEY],
          }),
        ],
        needs: [sampleObservationNeed(NEED_KEY)],
      });
      const right = siblingSets({
        attentionCandidates: [
          baseCandidate("OBSERVATION_NEED", {
            signalKey: "sig|need-b",
            observationNeedKeys: [OTHER_NEED_KEY],
          }),
        ],
        needs: [sampleObservationNeed(OTHER_NEED_KEY)],
        requirements: [
          {
            observation_need_key: OTHER_NEED_KEY,
            capability_semantic_key: CAP_C1,
          },
        ],
        candidates: [
          {
            observation_need_key: OTHER_NEED_KEY,
            observer_entity_id: ENTITY_E1,
          },
        ],
      });

      assert.throws(
        () =>
          buildAttentionObservationCapabilityDeclarationMatchSet({
            capability_requirement_set: left.capability_requirement_set,
            observer_candidate_set: right.observer_candidate_set,
            capability_declarations: [],
          }),
        /do not share the same observation planning context/
      );
    });
  });

  describe("Structural match rule", () => {
    it("one Requirement × one Observer × one matching Declaration", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      const decl = capability();
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [decl],
      });

      const assessment = result.candidate_assessments[0];
      assert.equal(
        assessment.status,
        "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT"
      );
      assert.equal(assessment.observer_capability_bases.length, 1);
      const positions =
        assessment.observer_capability_bases[0].requirement_match_positions;
      assert.equal(positions.length, 1);
      assert.equal(
        positions[0].status,
        "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT"
      );
      assert.equal(positions[0].structurally_matching_declarations.length, 1);
      assert.equal(
        positions[0].structurally_matching_declarations[0]
          .capability_declaration_id,
        DECL_D1
      );
      assert.equal(
        positions[0].structurally_matching_declarations[0].key,
        attentionObservationCapabilityDeclarationMatchKey(
          NEED_KEY,
          ENTITY_E1,
          CAP_C1,
          DECL_D1
        )
      );
      assertNoForbiddenSemantics(result);
    });

    it("exact capability key mismatch → no structural match", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({ capability_key: CAP_C2 }),
        ],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
    });

    it("exact holder mismatch → no structural match", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({ holder_entity_id: ENTITY_E2 }),
        ],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
    });

    it("holder + capability both exact → positive structural match", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [capability()],
      });
      assert.equal(
        result.has_structurally_matching_capability_declarations,
        true
      );
    });
  });

  describe("Scope / temporal preservation", () => {
    it("scoped declaration still structurally matches; scope preserved; no applicability", () => {
      const scoped = capability({
        scope: {
          kind: "SUBJECT_STATE",
          subject_id: SUBJECT_S2,
          state_kind: "condition",
        },
      });
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [scoped],
      });
      const match =
        result.candidate_assessments[0].observer_capability_bases[0]
          .requirement_match_positions[0].structurally_matching_declarations[0];
      assert.deepEqual(match.capability_declaration.scope, scoped.scope);
      assert.equal(match.capability_declaration.scope.kind, "SUBJECT_STATE");
      if (match.capability_declaration.scope.kind === "SUBJECT_STATE") {
        assert.equal(
          match.capability_declaration.scope.subject_id,
          SUBJECT_S2
        );
        assert.notEqual(
          match.capability_declaration.scope.subject_id,
          SUBJECT
        );
      }
      assertNoForbiddenSemantics(result);
    });

    it("UNSCOPED does not imply universally applicable; temporal fields preserved without active evaluation", () => {
      const unscoped = capability({
        scope: { kind: "UNSCOPED" },
        valid_from: "2010-01-01T00:00:00.000Z",
        valid_until: "2011-01-01T00:00:00.000Z",
      });
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [unscoped],
      });
      const match =
        result.candidate_assessments[0].observer_capability_bases[0]
          .requirement_match_positions[0].structurally_matching_declarations[0]
          .capability_declaration;
      assert.deepEqual(match.scope, { kind: "UNSCOPED" });
      assert.equal(match.valid_from, "2010-01-01T00:00:00.000Z");
      assert.equal(match.valid_until, "2011-01-01T00:00:00.000Z");
      assert.equal(match.declared_by.kind, "organization");
      assertNoForbiddenSemantics(result);
    });

    it("no scope ranking / no temporal ranking vocabulary", () => {
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-types.ts"
        ),
        "utf8"
      );
      assert.ok(!/scope_rank|temporal_rank|broader_scope/.test(types));
    });
  });

  describe("Catalog / identity / discovery firewalls", () => {
    it("multiple same-holder/same-key declarations all preserved; no dedupe", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({
            id: DECL_D1,
            scope: { kind: "UNSCOPED" },
          }),
          capability({
            id: DECL_D2,
            scope: {
              kind: "SUBJECT_STATE",
              subject_id: SUBJECT,
              state_kind: "condition",
            },
          }),
        ],
      });
      const matches =
        result.candidate_assessments[0].observer_capability_bases[0]
          .requirement_match_positions[0].structurally_matching_declarations;
      assert.equal(matches.length, 2);
      assert.deepEqual(
        matches.map((m) => m.capability_declaration_id),
        [DECL_D1, DECL_D2]
      );
    });

    it("duplicate CapabilityDeclaration id rejects deterministically", () => {
      assert.throws(
        () =>
          normalizeCapabilityDeclarationCollection([
            capability({ id: DECL_D1 }),
            capability({ id: DECL_D1 }),
          ]),
        /Duplicate CapabilityDeclaration id/
      );
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      assert.throws(
        () =>
          buildAttentionObservationCapabilityDeclarationMatchSet({
            capability_requirement_set,
            observer_candidate_set,
            capability_declarations: [
              capability({ id: DECL_D1 }),
              capability({ id: DECL_D1 }),
            ],
          }),
        /Duplicate CapabilityDeclaration id aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/
      );
    });

    it("empty declaration catalog yields zero-match positions", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets();
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
      assert.equal(
        result.candidate_assessments[0].observer_capability_bases[0]
          .requirement_match_positions[0].structurally_matching_declarations
          .length,
        0
      );
    });

    it("declaration holder not an Observer Candidate is ignored (no discovery)", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
          ],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({ holder_entity_id: ENTITY_E3, capability_key: CAP_C1 }),
        ],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
      assert.equal(
        result.candidate_assessments[0].observer_capability_bases.length,
        1
      );
      assert.equal(
        result.candidate_assessments[0].observer_capability_bases[0]
          .observer_candidate.observer_entity_id,
        ENTITY_E1
      );
    });

    it("declaration capability not explicitly required is ignored (no requirement discovery)", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          requirements: [
            { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          ],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({ capability_key: CAP_C1 }),
          capability({ id: DECL_D2, capability_key: CAP_C3 }),
        ],
      });
      const positions =
        result.candidate_assessments[0].observer_capability_bases[0]
          .requirement_match_positions;
      assert.equal(positions.length, 1);
      assert.equal(
        positions[0].capability_requirement.capability_semantic_key,
        CAP_C1
      );
      assert.equal(positions[0].structurally_matching_declarations.length, 1);
      assert.equal(
        positions[0].structurally_matching_declarations[0]
          .capability_semantic_key,
        CAP_C1
      );
    });
  });

  describe("Inheritance firewalls", () => {
    it("organization declaration does not match member Candidate", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
          ],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({ holder_entity_id: ORG_O, capability_key: CAP_C1 }),
        ],
      });
      assert.equal(
        result.candidate_assessments[0].has_structurally_matching_capability_declarations,
        false
      );
    });

    it("member declaration does not match organization Candidate", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ORG_O },
          ],
          entities: [sampleEntity(ORG_O, "organization", "org")],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({ holder_entity_id: ENTITY_E1, capability_key: CAP_C1 }),
        ],
      });
      assert.equal(
        result.candidate_assessments[0].has_structurally_matching_capability_declarations,
        false
      );
    });

    it("asset capability does not match owner Candidate", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: OWNER_P },
          ],
          entities: [sampleEntity(OWNER_P)],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({ holder_entity_id: ASSET_A, capability_key: CAP_C1 }),
        ],
      });
      assert.equal(
        result.candidate_assessments[0].has_structurally_matching_capability_declarations,
        false
      );
    });
  });

  describe("Pairwise evaluation / partial match firewall", () => {
    it("two Requirements × two Observers → exactly four pair positions; no aggregation verdict", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          requirements: [
            { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
            { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
          ],
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E2 },
          ],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({
            id: DECL_D1,
            holder_entity_id: ENTITY_E1,
            capability_key: CAP_C1,
          }),
        ],
      });
      const bases = result.candidate_assessments[0].observer_capability_bases;
      assert.equal(bases.length, 2);
      const positionCount = bases.reduce(
        (n, b) => n + b.requirement_match_positions.length,
        0
      );
      assert.equal(positionCount, 4);
      assert.equal(
        result.candidate_assessments[0].has_structurally_matching_capability_declarations,
        true
      );
      assertNoForbiddenSemantics(result);
    });

    it("partial structural presence: boolean true from one match only; no all-requirements satisfaction", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          requirements: [
            { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
            { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
          ],
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
          ],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [
          capability({
            holder_entity_id: ENTITY_E1,
            capability_key: CAP_C1,
          }),
        ],
      });
      const positions =
        result.candidate_assessments[0].observer_capability_bases[0]
          .requirement_match_positions;
      // 048 sorts capability keys lexicographically: human_inspection before satellite_imaging
      const byKey = Object.fromEntries(
        positions.map((p) => [
          p.capability_requirement.capability_semantic_key,
          p,
        ])
      );
      assert.equal(
        byKey[CAP_C1].status,
        "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT"
      );
      assert.equal(
        byKey[CAP_C2].status,
        "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
      assert.equal(
        result.candidate_assessments[0]
          .has_structurally_matching_capability_declarations,
        true
      );
      assertNoForbiddenSemantics(result);
    });
  });

  describe("NOT_APPLICABLE precedence", () => {
    it("planning-negative → NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          attentionCandidates: [baseCandidate("EPISTEMIC_GAP")],
          needs: [],
          requirements: [],
          candidates: [],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [capability()],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });

    it("no requirements (even with observers) → NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          requirements: [],
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
          ],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [capability()],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        result.candidate_assessments[0].observer_capability_bases.length,
        0
      );
    });

    it("requirements but no observers → NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          requirements: [
            { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          ],
          candidates: [],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [capability()],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
      );
    });

    it("neither requirements nor observers prefers NO_EXPLICIT_CAPABILITY_REQUIREMENTS", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          requirements: [],
          candidates: [],
        });
      const result = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });
  });

  describe("Immutability / determinism / input-order invariance", () => {
    it("048/049/declaration inputs remain deepEqual; reorder declarations → same output; repeated deepEqual", () => {
      const { capability_requirement_set, observer_candidate_set } =
        siblingSets({
          requirements: [
            { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
            { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
          ],
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E2 },
          ],
        });

      const declarations = [
        capability({
          id: DECL_D2,
          holder_entity_id: ENTITY_E1,
          capability_key: CAP_C1,
        }),
        capability({
          id: DECL_D1,
          holder_entity_id: ENTITY_E2,
          capability_key: CAP_C2,
        }),
        capability({
          id: DECL_D3,
          holder_entity_id: ENTITY_E1,
          capability_key: CAP_C1,
          scope: { kind: "ENTITY", entity_id: SUBJECT },
        }),
      ];

      const reqSnap = structuredClone(capability_requirement_set);
      const obsSnap = structuredClone(observer_candidate_set);
      const declSnap = structuredClone(declarations);

      const result1 = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: declarations,
      });
      const result2 = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: [...declarations].reverse(),
      });
      const result3 = buildAttentionObservationCapabilityDeclarationMatchSet({
        capability_requirement_set,
        observer_candidate_set,
        capability_declarations: declarations,
      });

      assert.deepEqual(capability_requirement_set, reqSnap);
      assert.deepEqual(observer_candidate_set, obsSnap);
      assert.deepEqual(declarations, declSnap);
      assert.deepEqual(result1, result2);
      assert.deepEqual(result1, result3);

      const e1C1Position =
        result1.candidate_assessments[0].observer_capability_bases[0]
          .requirement_match_positions.find(
            (p) =>
              p.capability_requirement.capability_semantic_key === CAP_C1
          )!;
      const matches = e1C1Position.structurally_matching_declarations;
      // D2 and D3 both match E1×C1; sorted by CapabilityDeclaration.id
      assert.deepEqual(
        matches.map((m) => m.capability_declaration_id),
        [DECL_D2, DECL_D3]
      );
    });
  });

  describe("Dependency firewalls (static)", () => {
    it("048/049 cores do not import 050; 050 does not import capability-core assessment APIs", () => {
      const core048 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-core.ts"
        ),
        "utf8"
      );
      const core049 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-observer-candidate-core.ts"
        ),
        "utf8"
      );
      const core021 = readFileSync(
        join(__dirnameTest, "../reality/capability-core.ts"),
        "utf8"
      );
      const core050 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-core.ts"
        ),
        "utf8"
      );

      assert.ok(!/capability-declaration-match/.test(core048));
      assert.ok(!/capability-declaration-match/.test(core049));
      assert.ok(!/capability-declaration-match/.test(core021));
      assert.ok(!/from ["'].*capability-core/.test(core050));
      assert.ok(!/assessCapability/.test(core050));
      assert.ok(!/from ["'].*permission/.test(core050));
      assert.ok(!/from ["'].*authority/.test(core050));
      assert.ok(!/from ["'].*mandate/.test(core050));
      assert.ok(!/from ["'].*commitment/.test(core050));
      assert.ok(!/from ["'].*resource-/.test(core050));
    });
  });
});
