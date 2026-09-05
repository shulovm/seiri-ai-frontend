/**
 * GROUND-051 — Observation Core V / Capability Verification Basis
 *
 * Pure composition of 050 Structural Declaration Match +
 * CapabilityVerificationDeclaration[] (no ProjectState / no Availability /
 * no capability-core effective helpers / no truth / PROVEN / satisfaction).
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
import { buildAttentionObservationCapabilityDeclarationMatchSet } from "../reality/attention-observation-capability-declaration-match-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_MODEL_LIMITATIONS,
  attentionObservationCapabilityVerificationLinkKey,
  buildAttentionObservationCapabilityVerificationSet,
  normalizeCapabilityVerificationDeclarationCollection,
} from "../reality/attention-observation-capability-verification-core.js";
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
const NEED_KEY = "observation-need|observe-proposition|q|1";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "satellite_imaging";
const CAP_C2 = "human_inspection";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DECL_D2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const DECL_D3 = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const VER_V1 = "11111111-1111-4111-8111-111111111111";
const VER_V2 = "22222222-2222-4222-8222-222222222222";
const VER_V3 = "33333333-3333-4333-8333-333333333333";
const VER_V4 = "44444444-4444-4444-8444-444444444444";
const EVIDENCE_A = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

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
    verified_at: "2021-01-01T00:00:00.000Z",
    valid_until: "2029-01-01T00:00:00.000Z",
    note: null,
    recorded_at: AT,
    created_at: AT,
    updated_at: AT,
    ...overrides,
  };
}

function matchSet(options?: {
  requirements?: {
    observation_need_key: string;
    capability_semantic_key: string;
  }[];
  candidates?: {
    observation_need_key: string;
    observer_entity_id: string;
  }[];
  declarations?: CapabilityDeclaration[];
  attentionCandidates?: AttentionCandidate[];
}) {
  const attentionCandidates =
    options?.attentionCandidates ?? [
      baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
    ];
  const planning_set = planningSetFor(attentionCandidates, [
    sampleObservationNeed(NEED_KEY),
  ]);

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

  return buildAttentionObservationCapabilityDeclarationMatchSet({
    capability_requirement_set,
    observer_candidate_set,
    capability_declarations: options?.declarations ?? [capability()],
  });
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"is_verified"/.test(json));
  assert.ok(!/"verified"\s*:\s*true/.test(json));
  assert.ok(!/"VERIFIED_OBSERVER"/.test(json));
  assert.ok(!/"UNVERIFIED_OBSERVER"/.test(json));
  assert.ok(!/"ALL_VERIFIED"/.test(json));
  assert.ok(!/"PARTIALLY_VERIFIED"/.test(json));
  assert.ok(!/"NONE_VERIFIED"/.test(json));
  assert.ok(!/"PROVEN"/.test(json));
  assert.ok(!/"NOT_PROVEN"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"QUALIFIED"/.test(json));
  assert.ok(!/"verified_observers"/.test(json));
  assert.ok(!/"verified_candidates"/.test(json));
  assert.ok(!/"qualified_observers"/.test(json));
  assert.ok(!/"verified_capabilities"/.test(json));
  assert.ok(!/"SCOPE_APPLICABLE"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"INFEASIBLE"/.test(json));
  assert.ok(!/"CAN_OBSERVE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"fresh"/.test(json));
  assert.ok(!/"stale"/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
}

describe("Attention Observation Capability Verification (GROUND-051)", () => {
  describe("CapabilityVerification audit / purity / schema", () => {
    it("schema 0.1.24; Verification fields; no ProjectState / Availability / effective helpers", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-types.ts"
        ),
        "utf8"
      );
      const capabilityTypes = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );

      assert.ok(
        /export interface CapabilityVerificationDeclaration/.test(
          capabilityTypes
        )
      );
      assert.ok(/capability_declaration_id: string/.test(capabilityTypes));
      assert.ok(/evidence_ids: string\[\]/.test(capabilityTypes));
      assert.ok(/verified_by: ReferenceDeclarer/.test(capabilityTypes));
      assert.ok(/verified_at: string/.test(capabilityTypes));
      assert.ok(/valid_until: string \| null/.test(capabilityTypes));
      assert.ok(/note: string \| null/.test(capabilityTypes));
      // No result/status field on VerificationDeclaration
      const verificationBlock = capabilityTypes.slice(
        capabilityTypes.indexOf(
          "export interface CapabilityVerificationDeclaration"
        ),
        capabilityTypes.indexOf(
          "export type CapabilityAvailabilityStatus"
        )
      );
      assert.ok(!/\bstatus\s*:/.test(verificationBlock));
      assert.ok(!/\bresult\s*:/.test(verificationBlock));

      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/from ["'].*capability-core/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bisCapabilityVerificationActiveAt\s*\(/.test(core));
      assert.ok(!/\bassessCapabilityVerification\s*\(/.test(core));
      assert.ok(!/\bassessCapability\s*\(/.test(core));
      assert.ok(!/CapabilityAvailabilityDeclaration/.test(types));
      assert.ok(!/=\s*"VERIFIED"/.test(types));
      assert.ok(!/=\s*"PROVEN"/.test(types));
      assert.ok(!/=\s*"SATISFIED"/.test(types));
      assert.ok(!/is_verified/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_MODEL_LIMITATIONS
          .length === 35
      );
    });
  });

  describe("Exact declaration-id linkage", () => {
    it("one structural Declaration + one exact Verification reference", () => {
      const capability_declaration_match_set = matchSet();
      const v = verification();
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [v],
      });

      const assessment = result.candidate_assessments[0];
      assert.equal(
        assessment.status,
        "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT"
      );
      assert.equal(assessment.has_capability_verification_declarations, true);

      const declPos =
        assessment.observer_verification_bases[0]
          .requirement_verification_positions[0]
          .declaration_verification_positions[0];
      assert.equal(
        declPos.status,
        "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT"
      );
      assert.equal(declPos.verification_links.length, 1);
      assert.equal(
        declPos.verification_links[0].capability_verification_declaration_id,
        VER_V1
      );
      assert.equal(
        declPos.verification_links[0].key,
        attentionObservationCapabilityVerificationLinkKey(
          NEED_KEY,
          ENTITY_E1,
          CAP_C1,
          DECL_D1,
          VER_V1
        )
      );
      assert.deepEqual(
        declPos.verification_links[0].capability_verification_declaration,
        v
      );
      assertNoForbiddenSemantics(result);
    });

    it("Verification attaches only to exact declaration id (D1 vs D2 same holder/key)", () => {
      const d1 = capability({
        id: DECL_D1,
        scope: { kind: "ENTITY", entity_id: SUBJECT },
      });
      const d2 = capability({
        id: DECL_D2,
        scope: {
          kind: "SUBJECT_STATE",
          subject_id: SUBJECT,
          state_kind: "condition",
        },
      });
      const capability_declaration_match_set = matchSet({
        declarations: [d1, d2],
      });
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [
          verification({
            id: VER_V1,
            capability_declaration_id: DECL_D1,
          }),
        ],
      });

      const positions =
        result.candidate_assessments[0].observer_verification_bases[0]
          .requirement_verification_positions[0]
          .declaration_verification_positions;
      assert.equal(positions.length, 2);

      const byDeclId = Object.fromEntries(
        positions.map((p) => [
          p.capability_declaration_match.capability_declaration_id,
          p,
        ])
      );
      assert.equal(
        byDeclId[DECL_D1].status,
        "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT"
      );
      assert.equal(byDeclId[DECL_D1].verification_links.length, 1);
      assert.equal(
        byDeclId[DECL_D2].status,
        "NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED"
      );
      assert.equal(byDeclId[DECL_D2].verification_links.length, 0);

      // Scope preserved from 050
      assert.deepEqual(
        byDeclId[DECL_D1].capability_declaration_match.capability_declaration
          .scope,
        d1.scope
      );
      assert.deepEqual(
        byDeclId[DECL_D2].capability_declaration_match.capability_declaration
          .scope,
        d2.scope
      );
      assert.equal(
        byDeclId[DECL_D1].capability_declaration_match.capability_declaration
          .valid_from,
        d1.valid_from
      );
    });
  });

  describe("Catalog / identity / discovery firewalls", () => {
    it("zero Verification records → NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED", () => {
      const capability_declaration_match_set = matchSet();
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED"
      );
      assert.equal(
        result.candidate_assessments[0]
          .observer_verification_bases[0]
          .requirement_verification_positions[0]
          .declaration_verification_positions[0].status,
        "NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED"
      );
      assertNoForbiddenSemantics(result);
    });

    it("multiple Verification records all preserved; no winner / latest-wins", () => {
      const capability_declaration_match_set = matchSet();
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [
          verification({
            id: VER_V3,
            verified_at: "2025-01-01T00:00:00.000Z",
            verified_by: { kind: "human", entity_id: ENTITY_E1 },
          }),
          verification({
            id: VER_V1,
            verified_at: "2020-01-01T00:00:00.000Z",
            verified_by: { kind: "organization", entity_id: ENTITY_E2 },
          }),
          verification({
            id: VER_V2,
            verified_at: "2022-01-01T00:00:00.000Z",
            verified_by: { kind: "system" },
          }),
        ],
      });
      const links =
        result.candidate_assessments[0].observer_verification_bases[0]
          .requirement_verification_positions[0]
          .declaration_verification_positions[0].verification_links;
      assert.equal(links.length, 3);
      // Sorted by Verification id, not verified_at / verified_by
      assert.deepEqual(
        links.map((l) => l.capability_verification_declaration_id),
        [VER_V1, VER_V2, VER_V3]
      );
      assert.deepEqual(
        links.map((l) => l.capability_verification_declaration.verified_at),
        [
          "2020-01-01T00:00:00.000Z",
          "2022-01-01T00:00:00.000Z",
          "2025-01-01T00:00:00.000Z",
        ]
      );
    });

    it("duplicate Verification id rejects deterministically", () => {
      assert.throws(
        () =>
          normalizeCapabilityVerificationDeclarationCollection([
            verification({ id: VER_V1 }),
            verification({ id: VER_V1 }),
          ]),
        /Duplicate CapabilityVerificationDeclaration id/
      );
      assert.throws(
        () =>
          buildAttentionObservationCapabilityVerificationSet({
            capability_declaration_match_set: matchSet(),
            capability_verification_declarations: [
              verification({ id: VER_V1 }),
              verification({ id: VER_V1 }),
            ],
          }),
        /Duplicate CapabilityVerificationDeclaration id 11111111-1111-4111-8111-111111111111/
      );
    });

    it("irrelevant Verification records ignored; do not reverse-create Declaration match", () => {
      const capability_declaration_match_set = matchSet({
        declarations: [capability({ id: DECL_D1 })],
      });
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [
          verification({
            id: VER_V4,
            capability_declaration_id: DECL_D3,
          }),
          verification({
            id: VER_V1,
            capability_declaration_id: DECL_D1,
          }),
        ],
      });
      const positions =
        result.candidate_assessments[0].observer_verification_bases[0]
          .requirement_verification_positions[0]
          .declaration_verification_positions;
      assert.equal(positions.length, 1);
      assert.equal(
        positions[0].capability_declaration_match.capability_declaration_id,
        DECL_D1
      );
      assert.equal(positions[0].verification_links.length, 1);
      assert.equal(
        positions[0].verification_links[0].capability_verification_declaration_id,
        VER_V1
      );
    });
  });

  describe("NOT_APPLICABLE precedence", () => {
    it("no structural matches → NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS", () => {
      const capability_declaration_match_set = matchSet({
        declarations: [
          capability({ holder_entity_id: ENTITY_E2, capability_key: CAP_C1 }),
        ],
      });
      assert.equal(
        capability_declaration_match_set.candidate_assessments[0].status,
        "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [
          verification({ capability_declaration_id: DECL_D1 }),
        ],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
      assert.equal(
        result.candidate_assessments[0].observer_verification_bases.length,
        0
      );
    });

    it("no requirements → NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", () => {
      const capability_declaration_match_set = matchSet({
        requirements: [],
        candidates: [
          { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
        ],
        declarations: [capability()],
      });
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [verification()],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });

    it("planning-negative → NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", () => {
      const capability_declaration_match_set = matchSet({
        attentionCandidates: [baseCandidate("EPISTEMIC_GAP")],
        requirements: [],
        candidates: [],
        declarations: [],
      });
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });
  });

  describe("Partial Verification / existential firewall", () => {
    it("one Verification somewhere may yield candidate boolean true without observer-wide verified", () => {
      const capability_declaration_match_set = matchSet({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
        candidates: [
          { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
        ],
        declarations: [
          capability({
            id: DECL_D1,
            holder_entity_id: ENTITY_E1,
            capability_key: CAP_C1,
          }),
        ],
      });
      const result = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [
          verification({
            id: VER_V1,
            capability_declaration_id: DECL_D1,
          }),
        ],
      });

      assert.equal(
        result.candidate_assessments[0].has_capability_verification_declarations,
        true
      );

      const positions =
        result.candidate_assessments[0].observer_verification_bases[0]
          .requirement_verification_positions;
      const byCap = Object.fromEntries(
        positions.map((p) => [
          p.capability_requirement_match_position.capability_requirement
            .capability_semantic_key,
          p,
        ])
      );
      assert.equal(byCap[CAP_C1].has_capability_verification_declarations, true);
      assert.equal(
        byCap[CAP_C2].declaration_verification_positions.length,
        0
      );
      assert.equal(byCap[CAP_C2].has_capability_verification_declarations, false);
      assertNoForbiddenSemantics(result);
    });
  });

  describe("Immutability / determinism / input-order invariance", () => {
    it("050 set and Verification inputs remain deepEqual; reorder → same output; repeated deepEqual", () => {
      const capability_declaration_match_set = matchSet({
        declarations: [
          capability({ id: DECL_D1 }),
          capability({
            id: DECL_D2,
            scope: { kind: "ENTITY", entity_id: SUBJECT },
          }),
        ],
      });
      const verifications = [
        verification({
          id: VER_V2,
          capability_declaration_id: DECL_D1,
          verified_at: "2023-01-01T00:00:00.000Z",
        }),
        verification({
          id: VER_V1,
          capability_declaration_id: DECL_D2,
          verified_at: "2024-01-01T00:00:00.000Z",
        }),
        verification({
          id: VER_V3,
          capability_declaration_id: DECL_D1,
          verified_at: "2019-01-01T00:00:00.000Z",
        }),
      ];

      const matchSnap = structuredClone(capability_declaration_match_set);
      const verSnap = structuredClone(verifications);

      const result1 = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: verifications,
      });
      const result2 = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: [...verifications].reverse(),
      });
      const result3 = buildAttentionObservationCapabilityVerificationSet({
        capability_declaration_match_set,
        capability_verification_declarations: verifications,
      });

      assert.deepEqual(capability_declaration_match_set, matchSnap);
      assert.deepEqual(verifications, verSnap);
      assert.deepEqual(result1, result2);
      assert.deepEqual(result1, result3);

      const d1Links =
        result1.candidate_assessments[0].observer_verification_bases[0]
          .requirement_verification_positions[0]
          .declaration_verification_positions.find(
            (p) =>
              p.capability_declaration_match.capability_declaration_id ===
              DECL_D1
          )!.verification_links;
      assert.deepEqual(
        d1Links.map((l) => l.capability_verification_declaration_id),
        [VER_V2, VER_V3]
      );
    });
  });

  describe("Dependency firewalls (static)", () => {
    it("050/021 do not import 051; 051 does not import capability-core / Availability / 041-045", () => {
      const core050 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-core.ts"
        ),
        "utf8"
      );
      const core021 = readFileSync(
        join(__dirnameTest, "../reality/capability-core.ts"),
        "utf8"
      );
      const core051 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-core.ts"
        ),
        "utf8"
      );
      const types051 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-types.ts"
        ),
        "utf8"
      );

      assert.ok(!/capability-verification-core/.test(core050));
      assert.ok(!/capability-verification-types/.test(core050));
      assert.ok(!/capability-verification/.test(core021));
      assert.ok(!/from ["'].*capability-core/.test(core051));
      assert.ok(!/CapabilityAvailabilityDeclaration/.test(types051));
      assert.ok(!/attention-resolution-/.test(core051));
      assert.ok(!/attention-basis-requirement/.test(core051));
      assert.ok(!/from ["'].*permission/.test(core051));
      assert.ok(!/from ["'].*authority/.test(core051));
      assert.ok(!/from ["'].*resource-/.test(core051));
    });
  });
});
