/**
 * GROUND-053 — Observation Core VII / Capability State Composition Basis
 *
 * Pure composition of 051 Verification + 052 Availability sibling outputs
 * (no effective Capability state / no V×A Cartesian product / no satisfaction).
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
import { buildAttentionObservationCapabilityVerificationSet } from "../reality/attention-observation-capability-verification-core.js";
import { buildAttentionObservationCapabilityAvailabilitySet } from "../reality/attention-observation-capability-availability-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_STATE_COMPOSITION_MODEL_LIMITATIONS,
  assertCompatibleCapabilityStateCompositionSiblingContexts,
  attentionObservationCapabilityDeclarationStateCompositionKey,
  buildAttentionObservationCapabilityStateCompositionSet,
} from "../reality/attention-observation-capability-state-composition-core.js";
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
const OTHER_NEED_KEY = "observation-need|other|q|2";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "satellite_imaging";
const CAP_C2 = "human_inspection";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DECL_D2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const VER_V1 = "11111111-1111-4111-8111-111111111111";
const VER_V2 = "22222222-2222-4222-8222-222222222222";
const AVAIL_A1 = "33333333-3333-4333-8333-333333333333";
const AVAIL_A2 = "44444444-4444-4444-8444-444444444444";
const AVAIL_A3 = "55555555-5555-4555-8555-555555555555";
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

function availability(
  overrides: Partial<CapabilityAvailabilityDeclaration> = {}
): CapabilityAvailabilityDeclaration {
  return {
    id: AVAIL_A1,
    project_id: PROJECT_ID,
    capability_declaration_id: DECL_D1,
    status: "AVAILABLE",
    valid_from: "2021-01-01T00:00:00.000Z",
    valid_until: "2029-01-01T00:00:00.000Z",
    declared_by: { kind: "organization", entity_id: ENTITY_E2 },
    recorded_at: AT,
    note: null,
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
  needs?: ObservationNeed[];
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
    observer_entities: [sampleEntity(ENTITY_E1), sampleEntity(ENTITY_E2)],
  });

  return buildAttentionObservationCapabilityDeclarationMatchSet({
    capability_requirement_set,
    observer_candidate_set,
    capability_declarations: options?.declarations ?? [capability()],
  });
}

function siblingSets(options?: {
  match?: ReturnType<typeof matchSet>;
  verifications?: CapabilityVerificationDeclaration[];
  availabilities?: CapabilityAvailabilityDeclaration[];
}) {
  const capability_declaration_match_set = options?.match ?? matchSet();
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
  return { capability_verification_set, capability_availability_set };
}

function firstDeclarationComposition(
  result: ReturnType<typeof buildAttentionObservationCapabilityStateCompositionSet>
) {
  return result.candidate_assessments[0].observer_capability_state_bases[0]
    .requirement_composition_positions[0].declaration_composition_positions[0];
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"effective_state"/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"UNVERIFIED_AND_UNAVAILABLE"/.test(json));
  assert.ok(!/"VERIFIED_AND_AVAILABLE"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"USABLE"/.test(json));
  assert.ok(!/"OPERATIONAL"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"CONFLICTED"/.test(json));
  assert.ok(!/"RESOLVED"/.test(json));
  assert.ok(!/"EFFECTIVE_AVAILABLE"/.test(json));
  assert.ok(!/"EFFECTIVE_UNAVAILABLE"/.test(json));
  assert.ok(!/"ready_observers"/.test(json));
  assert.ok(!/"capable_observers"/.test(json));
  assert.ok(!/"effective_capability_states"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
}

describe("Attention Observation Capability State Composition (GROUND-053)", () => {
  describe("Purity / schema / vocabulary", () => {
    it("schema 0.1.24; composition != effective state; no active-at / wall-clock / ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-state-composition-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-state-composition-types.ts"
        ),
        "utf8"
      );

      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/from ["'].*capability-core/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bisCapabilityVerificationActiveAt\s*\(/.test(core));
      assert.ok(!/\bisCapabilityAvailabilityActiveAt\s*\(/.test(core));
      assert.ok(!/\bassessCapability\s*\(/.test(core));
      assert.ok(!/Date\.now\s*\(/.test(core));
      assert.ok(!/new Date\s*\(/.test(core));
      assert.ok(!/attention-resolution-/.test(core));
      assert.ok(!/effective_state/.test(types));
      assert.ok(!/has_capability\s*[:=]/.test(types));
      assert.ok(!/=\s*"READY"/.test(types));
      assert.ok(!/=\s*"USABLE"/.test(types));
      assert.ok(!/=\s*"SATISFIED"/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_STATE_COMPOSITION_MODEL_LIMITATIONS
          .length === 40
      );
    });
  });

  describe("Sibling composition / consistency", () => {
    it("semantically equivalent 051/052 from same 050 compose; pointer independence", () => {
      const a = siblingSets({
        verifications: [verification()],
        availabilities: [availability()],
      });
      const b = siblingSets({
        verifications: [verification()],
        availabilities: [availability()],
      });
      assert.notEqual(
        a.capability_verification_set,
        b.capability_verification_set
      );

      assertCompatibleCapabilityStateCompositionSiblingContexts(
        a.capability_verification_set,
        b.capability_availability_set
      );

      const result = buildAttentionObservationCapabilityStateCompositionSet({
        capability_verification_set: a.capability_verification_set,
        capability_availability_set: b.capability_availability_set,
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "CAPABILITY_STATE_COMPOSITION_BASIS_PRESENT"
      );
      assert.equal(
        firstDeclarationComposition(result).status,
        "VERIFICATION_AND_AVAILABILITY_DECLARATIONS_PRESENT"
      );
    });

    it("mismatched AttentionCandidate / ObservationNeed contexts reject", () => {
      const left = siblingSets({
        match: matchSet({
          attentionCandidates: [
            baseCandidate("OBSERVATION_NEED", {
              signalKey: "sig|need-a",
              observationNeedKeys: [NEED_KEY],
            }),
          ],
          needs: [sampleObservationNeed(NEED_KEY)],
        }),
      });
      const right = siblingSets({
        match: matchSet({
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
          declarations: [
            capability({ holder_entity_id: ENTITY_E1, capability_key: CAP_C1 }),
          ],
        }),
      });

      assert.throws(
        () =>
          buildAttentionObservationCapabilityStateCompositionSet({
            capability_verification_set: left.capability_verification_set,
            capability_availability_set: right.capability_availability_set,
          }),
        /do not share the same Capability Declaration Match context/
      );
    });

    it("mismatched CapabilityDeclarationMatch / ObserverCandidate contexts reject", () => {
      const left = siblingSets({
        match: matchSet({
          declarations: [capability({ id: DECL_D1 })],
        }),
      });
      const right = siblingSets({
        match: matchSet({
          declarations: [
            capability({
              id: DECL_D2,
              holder_entity_id: ENTITY_E1,
              capability_key: CAP_C1,
            }),
          ],
        }),
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityStateCompositionSet({
            capability_verification_set: left.capability_verification_set,
            capability_availability_set: right.capability_availability_set,
          }),
        /CapabilityDeclarationMatch key mismatch|CapabilityDeclaration\.id mismatch/
      );

      const obsMismatchLeft = siblingSets({
        match: matchSet({
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
          ],
        }),
      });
      const obsMismatchRight = siblingSets({
        match: matchSet({
          candidates: [
            { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E2 },
          ],
          declarations: [
            capability({ holder_entity_id: ENTITY_E2, capability_key: CAP_C1 }),
          ],
        }),
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityStateCompositionSet({
            capability_verification_set:
              obsMismatchLeft.capability_verification_set,
            capability_availability_set:
              obsMismatchRight.capability_availability_set,
          }),
        /do not share the same Capability Declaration Match context/
      );
    });
  });

  describe("Representation-pattern statuses", () => {
    it("neither Verification nor Availability", () => {
      const result = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets()
      );
      assert.equal(
        result.candidate_assessments[0].status,
        "CAPABILITY_STATE_COMPOSITION_BASIS_PRESENT"
      );
      assert.equal(
        result.candidate_assessments[0].has_capability_state_composition_basis,
        true
      );
      assert.equal(
        firstDeclarationComposition(result).status,
        "NO_VERIFICATION_OR_AVAILABILITY_DECLARATIONS_REPRESENTED"
      );
      assertNoForbiddenSemantics(result);
    });

    it("Verification only", () => {
      const result = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets({ verifications: [verification()] })
      );
      assert.equal(
        firstDeclarationComposition(result).status,
        "VERIFICATION_DECLARATIONS_PRESENT_AVAILABILITY_DECLARATIONS_ABSENT"
      );
      assertNoForbiddenSemantics(result);
    });

    it("Availability only", () => {
      const result = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets({ availabilities: [availability()] })
      );
      assert.equal(
        firstDeclarationComposition(result).status,
        "VERIFICATION_DECLARATIONS_ABSENT_AVAILABILITY_DECLARATIONS_PRESENT"
      );
      assertNoForbiddenSemantics(result);
    });

    it("Verification + Availability; raw statuses preserved; no V×A Cartesian product", () => {
      const result = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets({
          verifications: [
            verification({ id: VER_V1 }),
            verification({
              id: VER_V2,
              evidence_ids: [EVIDENCE_A, EVIDENCE_A],
              verified_at: "2025-01-01T00:00:00.000Z",
            }),
          ],
          availabilities: [
            availability({ id: AVAIL_A1, status: "AVAILABLE" }),
            availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
            availability({ id: AVAIL_A3, status: "AVAILABLE" }),
          ],
        })
      );

      const position = firstDeclarationComposition(result);
      assert.equal(
        position.status,
        "VERIFICATION_AND_AVAILABILITY_DECLARATIONS_PRESENT"
      );
      assert.equal(position.verification_position.verification_links.length, 2);
      assert.equal(
        position.availability_position.availability_links.length,
        3
      );
      assert.deepEqual(
        position.availability_position.availability_links.map(
          (l) => l.capability_availability_declaration.status
        ),
        ["AVAILABLE", "UNAVAILABLE", "AVAILABLE"]
      );
      assert.equal(
        position.key,
        attentionObservationCapabilityDeclarationStateCompositionKey(
          NEED_KEY,
          ENTITY_E1,
          CAP_C1,
          DECL_D1
        )
      );
      // One composition position — not 2×3=6 pair records
      assert.equal(
        result.candidate_assessments[0].observer_capability_state_bases[0]
          .requirement_composition_positions[0]
          .declaration_composition_positions.length,
        1
      );
      assertNoForbiddenSemantics(result);
    });

    it("same holder/key D1/D2 remain separate composition positions", () => {
      const result = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets({
          match: matchSet({
            declarations: [
              capability({
                id: DECL_D1,
                scope: { kind: "ENTITY", entity_id: SUBJECT },
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
          }),
          verifications: [
            verification({
              id: VER_V1,
              capability_declaration_id: DECL_D1,
            }),
          ],
          availabilities: [
            availability({
              id: AVAIL_A1,
              capability_declaration_id: DECL_D2,
              status: "UNAVAILABLE",
            }),
          ],
        })
      );

      const positions =
        result.candidate_assessments[0].observer_capability_state_bases[0]
          .requirement_composition_positions[0]
          .declaration_composition_positions;
      assert.equal(positions.length, 2);
      const byId = Object.fromEntries(
        positions.map((p) => [
          p.capability_declaration_match.capability_declaration_id,
          p,
        ])
      );
      assert.equal(
        byId[DECL_D1].status,
        "VERIFICATION_DECLARATIONS_PRESENT_AVAILABILITY_DECLARATIONS_ABSENT"
      );
      assert.equal(
        byId[DECL_D2].status,
        "VERIFICATION_DECLARATIONS_ABSENT_AVAILABILITY_DECLARATIONS_PRESENT"
      );
      assert.equal(
        byId[DECL_D2].availability_position.availability_links[0]
          .capability_availability_declaration.status,
        "UNAVAILABLE"
      );
    });
  });

  describe("NOT_APPLICABLE precedence", () => {
    it("planning-negative / no-requirements / no structural declarations", () => {
      const planningNeg = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets({
          match: matchSet({
            attentionCandidates: [baseCandidate("EPISTEMIC_GAP")],
            requirements: [],
            candidates: [],
            declarations: [],
          }),
        })
      );
      assert.equal(
        planningNeg.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );

      const noReq = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets({
          match: matchSet({
            requirements: [],
            candidates: [
              { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
            ],
          }),
        })
      );
      assert.equal(
        noReq.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );

      const noStruct = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets({
          match: matchSet({
            declarations: [
              capability({
                holder_entity_id: ENTITY_E2,
                capability_key: CAP_C1,
              }),
            ],
          }),
        })
      );
      assert.equal(
        noStruct.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
      assert.equal(
        noStruct.candidate_assessments[0].has_capability_state_composition_basis,
        false
      );
    });

    it("no observers → NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES", () => {
      const result = buildAttentionObservationCapabilityStateCompositionSet(
        siblingSets({
          match: matchSet({
            requirements: [
              {
                observation_need_key: NEED_KEY,
                capability_semantic_key: CAP_C1,
              },
            ],
            candidates: [],
          }),
        })
      );
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES"
      );
    });
  });

  describe("Immutability / determinism / dependency firewalls", () => {
    it("051/052 inputs remain deepEqual; repeated output deepequal", () => {
      const sets = siblingSets({
        verifications: [
          verification({ id: VER_V2 }),
          verification({ id: VER_V1 }),
        ],
        availabilities: [
          availability({ id: AVAIL_A2, status: "UNAVAILABLE" }),
          availability({ id: AVAIL_A1, status: "AVAILABLE" }),
        ],
      });
      const verSnap = structuredClone(sets.capability_verification_set);
      const availSnap = structuredClone(sets.capability_availability_set);

      const result1 = buildAttentionObservationCapabilityStateCompositionSet(
        sets
      );
      const result2 = buildAttentionObservationCapabilityStateCompositionSet(
        sets
      );

      assert.deepEqual(sets.capability_verification_set, verSnap);
      assert.deepEqual(sets.capability_availability_set, availSnap);
      assert.deepEqual(result1, result2);

      const position = firstDeclarationComposition(result1);
      assert.deepEqual(
        position.verification_position.verification_links.map(
          (l) => l.capability_verification_declaration_id
        ),
        [VER_V1, VER_V2]
      );
      assert.deepEqual(
        position.availability_position.availability_links.map(
          (l) => l.capability_availability_declaration_id
        ),
        [AVAIL_A1, AVAIL_A2]
      );
    });

    it("050/051/052 do not import 053; 053 does not import capability-core / Permission / Resource", () => {
      const core050 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-core.ts"
        ),
        "utf8"
      );
      const core051 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-verification-core.ts"
        ),
        "utf8"
      );
      const core052 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-availability-core.ts"
        ),
        "utf8"
      );
      const core053 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-state-composition-core.ts"
        ),
        "utf8"
      );
      const types053 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-state-composition-types.ts"
        ),
        "utf8"
      );

      assert.ok(!/state-composition/.test(core050));
      assert.ok(!/state-composition/.test(core051));
      assert.ok(!/state-composition/.test(core052));
      assert.ok(!/from ["'].*capability-core/.test(core053));
      assert.ok(!/ResourceAvailability/.test(types053));
      assert.ok(!/from ["'].*permission/.test(core053));
      assert.ok(!/from ["'].*authority/.test(core053));
      assert.ok(!/from ["'].*resource-/.test(core053));
      assert.ok(!/attention-resolution-/.test(core053));
    });
  });
});
