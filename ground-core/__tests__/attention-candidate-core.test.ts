/**
 * GROUND-040 — Attention Core I / Candidate & Basis Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_CANDIDATE_MODEL_LIMITATIONS,
  ATTENTION_CANDIDATE_SOURCE_KIND_ORDER,
  buildAttentionCandidateSet,
} from "../reality/attention-candidate-core.js";
import { composeResourceAwareSituation } from "../reality/resource-situation.js";
import { applyPatch } from "../state-engine.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  Claim,
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionCommitmentDeclaration,
  InterventionDeclaration,
  InterventionResourceCommitmentDeclaration,
  InterventionResourceReservationDeclaration,
  ProjectState,
  ResourceCapacity,
  ResourceCapacityDeclaration,
  ResourceDeclaration,
  ResourceReservationScope,
  RealityEntity,
  RealityEvent,
  RealityState,
  StatePatch,
} from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_A = "ff010101-0101-4101-8101-010101010101";
const ENTITY_B = "ff010101-0101-4101-8101-010101010102";
const ENTITY_COMMITTER = "ff010101-0101-4101-8101-010101010103";
const ENTITY_RESERVER = "ff010101-0101-4101-8101-010101010104";
const ENTITY_DECLARER = "ff010101-0101-4101-8101-010101010105";
const ENTITY_DECLARER_B = "ff010101-0101-4101-8101-010101010107";
const INT_A = "ff020202-0202-4202-8202-020202020201";
const SPACE_D = "ff030303-0303-4303-8303-030303030301";
const OPT_INT = "ff040404-0404-4404-8404-040404040401";
const CAND_A = "ff050505-0505-4505-8505-050505050501";
const RES_A = "ff060606-0606-4606-8606-060606060601";
const RES_B = "ff060606-0606-4606-8606-060606060602";
const COMMIT_ID = "ff080808-0808-4808-8808-080808080801";
const RC_ID = "ff0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f01";
const RR_ID = "ff111111-1111-4111-8111-111111111101";
const RR_ID_2 = "ff111111-1111-4111-8111-111111111102";
const RR_ID_3 = "ff111111-1111-4111-8111-111111111103";
const CAP_ID = "ff0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";
const CAP_ID_2 = "ff0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d02";
const EVENT_A = "ff121212-1212-4212-8212-121212121201";
const STATE_A = "ff131313-1313-4313-8313-131313131301";
const STATE_B = "ff131313-1313-4313-8313-131313131302";
const CLAIM_A = "ff141414-1414-4414-8414-141414141401";
const CLAIM_B = "ff141414-1414-4414-8414-141414141402";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const RC_AT = "2026-08-05T10:00:00.000Z";
const MADE_AT = "2026-08-10T10:00:00.000Z";
const MADE_AT_2 = "2026-08-11T10:00:00.000Z";
const MADE_AT_3 = "2026-08-12T10:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";

const W09 = "2026-09-01T09:00:00.000Z";
const W10 = "2026-09-01T10:00:00.000Z";
const W11 = "2026-09-01T11:00:00.000Z";
const W12 = "2026-09-01T12:00:00.000Z";
const W13 = "2026-09-01T13:00:00.000Z";
const AT = W10;

const FORBIDDEN_FIELDS =
  /\b(priority|rank|score|weight|severity|urgency|selected|allocated|focused|attention_score|attention_budget|top_candidate)\b/;

function entity(id: string, label: string): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "person",
    label,
    created_at: TS,
    updated_at: TS,
  };
}

function intervention(id: string): InterventionDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    intervention_key: `key-${id}`,
    target_scope: { kind: "UNSCOPED" },
    description: null,
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function decisionSpace(id: string): DecisionSpaceDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    label: "Space",
    description: null,
    basis: [],
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function decisionOption(
  id: string,
  spaceId: string,
  interventionId: string
): DecisionOptionDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    decision_space_id: spaceId,
    option: { kind: "INTERVENTION", intervention_id: interventionId },
    label: null,
    description: null,
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function actorCandidate(
  id: string,
  optionDeclarationId: string,
  actorId: string
): DecisionOptionActorCandidateDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    decision_option_declaration_id: optionDeclarationId,
    actor_entity_id: actorId,
    note: null,
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function resource(
  id: string,
  holderId: string,
  key = "ambulance"
): ResourceDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    holder_entity_id: holderId,
    resource_key: key,
    unit: "unit",
    scope: { kind: "UNSCOPED" },
    resource_entity_id: null,
    description: null,
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function upsert(entityKind: string, entityId: string, payload: object): StatePatch {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: entityKind,
        entity_id: entityId,
        payload,
      } as StatePatch["operations"][number],
    ],
  };
}

function baseState(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_A, "Hospital A"),
      entity(ENTITY_B, "Org B"),
      entity(ENTITY_COMMITTER, "Committer"),
      entity(ENTITY_RESERVER, "Reserver"),
      entity(ENTITY_DECLARER, "Declarer"),
      entity(ENTITY_DECLARER_B, "Declarer B"),
    ],
    intervention_declarations: [intervention(INT_A)],
    decision_space_declarations: [decisionSpace(SPACE_D)],
    decision_option_declarations: [decisionOption(OPT_INT, SPACE_D, INT_A)],
    decision_option_actor_candidate_declarations: [
      actorCandidate(CAND_A, OPT_INT, ENTITY_A),
    ],
    resource_declarations: [
      resource(RES_A, ENTITY_A),
      resource(RES_B, ENTITY_B, "stretcher"),
    ],
    ...overrides,
  };
}

function withCommitment(state = baseState()): ProjectState {
  return applyPatch(
    state,
    upsert("intervention_commitment_declaration", COMMIT_ID, {
      id: COMMIT_ID,
      project_id: PROJECT_ID,
      commitment_holder_entity_id: ENTITY_A,
      intervention_id: INT_A,
      basis: [],
      committed_at: COMMITTED_AT,
      valid_until: null,
      note: null,
      declared_by: { kind: "human" },
      recorded_at: RECORDED,
      created_at: RECORDED,
      updated_at: RECORDED,
    } satisfies InterventionCommitmentDeclaration)
  );
}

function withRc(
  state: ProjectState,
  opts: { id?: string; resourceId?: string } = {}
): ProjectState {
  const id = opts.id ?? RC_ID;
  return applyPatch(
    state,
    upsert("intervention_resource_commitment_declaration", id, {
      id,
      project_id: PROJECT_ID,
      commitment_declaration_id: COMMIT_ID,
      resource_declaration_id: opts.resourceId ?? RES_A,
      resource_committer_entity_id: ENTITY_COMMITTER,
      committed_amount: { kind: "POINT", value: 10 },
      resource_committed_at: RC_AT,
      note: null,
      declared_by: { kind: "human", entity_id: ENTITY_DECLARER },
      recorded_at: RECORDED,
      created_at: RECORDED,
      updated_at: RECORDED,
    } satisfies InterventionResourceCommitmentDeclaration)
  );
}

function withRr(
  state: ProjectState,
  opts: {
    id?: string;
    rcId?: string;
    scope?: ResourceReservationScope;
    madeAt?: string;
    from?: string;
    until?: string | null;
    declaredBy?: InterventionResourceReservationDeclaration["declared_by"];
  }
): ProjectState {
  const id = opts.id ?? RR_ID;
  return applyPatch(
    state,
    upsert("intervention_resource_reservation_declaration", id, {
      id,
      project_id: PROJECT_ID,
      resource_commitment_declaration_id: opts.rcId ?? RC_ID,
      reserved_by_entity_id: ENTITY_RESERVER,
      reservation_scope:
        opts.scope ?? {
          kind: "AMOUNT",
          amount: { kind: "POINT", value: 10 },
        },
      reservation_made_at: opts.madeAt ?? MADE_AT,
      reserved_from: opts.from ?? W09,
      reserved_until: opts.until === undefined ? W12 : opts.until,
      note: null,
      declared_by:
        opts.declaredBy ?? { kind: "human", entity_id: ENTITY_DECLARER },
      recorded_at: RECORDED,
      created_at: RECORDED,
      updated_at: RECORDED,
    } satisfies InterventionResourceReservationDeclaration)
  );
}

function withCap(
  state: ProjectState,
  opts: { id?: string; resourceId?: string; capacity: ResourceCapacity }
): ProjectState {
  const id = opts.id ?? CAP_ID;
  return applyPatch(
    state,
    upsert("resource_capacity_declaration", id, {
      id,
      project_id: PROJECT_ID,
      resource_declaration_id: opts.resourceId ?? RES_A,
      capacity: opts.capacity,
      valid_from: TS,
      valid_until: null,
      declared_by: { kind: "human", entity_id: ENTITY_DECLARER },
      recorded_at: RECORDED,
      note: null,
      created_at: RECORDED,
      updated_at: RECORDED,
    } satisfies ResourceCapacityDeclaration)
  );
}

function situationQuery(subjectId = ENTITY_A) {
  return { subjectId, at: AT };
}

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"weight"\s*:/.test(json));
  assert.ok(!/"severity"\s*:/.test(json));
  assert.ok(!/"urgency"\s*:/.test(json));
  assert.ok(!/"selected"\s*:/.test(json));
  assert.ok(!/"allocated"\s*:/.test(json));
  assert.ok(!/"attention_score"\s*:/.test(json));
  assert.ok(!/"attention_budget"\s*:/.test(json));
  assert.ok(!/"top_candidate"\s*:/.test(json));
  assert.ok(!json.includes('"PROBLEM"'));
  assert.ok(!json.includes('"NEED"'));
  assert.ok(!json.includes('"BLOCKER"'));
  assert.ok(!json.includes('"RISK"'));
}

describe("Attention Candidate Set (GROUND-040)", () => {
  describe("Schema / architecture / read-only", () => {
    it("schema 0.1.24; consumes 039 only; no recalculation cores", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(__dirnameTest, "../reality/attention-candidate-core.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(__dirnameTest, "../reality/attention-candidate-types.ts"),
        "utf8"
      );
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(/composeResourceAwareSituation/.test(core));
      assert.ok(!/from ["'].*resource-contention-discovery["']/.test(core));
      assert.ok(
        !/from ["'].*resource-reservation-contention-core/.test(core)
      );
      assert.ok(
        !/from ["'].*resource-reservation-capacity-pressure-core/.test(core)
      );
      assert.ok(!/"priority"\s*:/.test(types));
      assert.deepEqual(ATTENTION_CANDIDATE_SOURCE_KIND_ORDER, [
        "BASE_SITUATION_SALIENCE",
        "RESOURCE_SITUATION_SALIENCE",
      ]);
    });
  });

  describe("Base Situation candidates", () => {
    it("quiet / no Resource scope / no Salience → NO_ATTENTION_CANDIDATES", () => {
      const assessment = buildAttentionCandidateSet(baseState(), {
        situation_query: situationQuery(),
        resource_declaration_ids: [],
      });
      assert.equal(assessment.status, "NO_ATTENTION_CANDIDATES");
      assert.deepEqual(assessment.candidates, []);
      assert.equal(assessment.candidate_count, 0);
      assert.equal(assessment.situation.base_situation.status, "QUIET");
      assertNoForbidden(assessment);
    });

    it("ONTIC_EVENT_PRESENT → one BASE candidate", () => {
      const state = baseState({
        reality_events: [
          {
            id: EVENT_A,
            project_id: PROJECT_ID,
            kind: "incident",
            subject_ids: [ENTITY_A],
            occurred_at: AT,
            recorded_at: RECORDED,
            summary: "event",
            created_at: RECORDED,
            updated_at: RECORDED,
          } satisfies RealityEvent,
        ],
      });
      const assessment = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [],
      });
      assert.equal(assessment.base_situation_candidate_count, 1);
      assert.equal(assessment.resource_candidate_count, 0);
      assert.equal(assessment.candidates[0]!.source_kind, "BASE_SITUATION_SALIENCE");
      assert.equal(
        assessment.candidates[0]!.basis.kind === "BASE_SITUATION_SALIENCE" &&
          assessment.candidates[0]!.basis.salience_signal_kind,
        "ONTIC_EVENT_PRESENT"
      );
    });

    it("STATE_CONFLICT → one candidate; ACTIVE status alone does not invent candidates", () => {
      const conflictState = baseState({
        reality_states: [
          {
            id: STATE_A,
            project_id: PROJECT_ID,
            subject_id: ENTITY_A,
            kind: "condition",
            value: "open",
            valid_from: TS,
            valid_until: null,
            recorded_at: RECORDED,
            created_at: RECORDED,
            updated_at: RECORDED,
          } satisfies RealityState,
          {
            id: STATE_B,
            project_id: PROJECT_ID,
            subject_id: ENTITY_A,
            kind: "condition",
            value: "closed",
            valid_from: TS,
            valid_until: null,
            recorded_at: RECORDED,
            created_at: RECORDED,
            updated_at: RECORDED,
          } satisfies RealityState,
        ],
      });
      const withConflict = buildAttentionCandidateSet(conflictState, {
        situation_query: situationQuery(),
        resource_declaration_ids: [],
      });
      assert.ok(
        withConflict.candidates.some(
          (c) =>
            c.basis.kind === "BASE_SITUATION_SALIENCE" &&
            c.basis.salience_signal_kind === "STATE_CONFLICT"
        )
      );

      // ACTIVE via single state — no STATE_CONFLICT signal required for ACTIVE
      const activeOnly = baseState({
        reality_states: [
          {
            id: STATE_A,
            project_id: PROJECT_ID,
            subject_id: ENTITY_A,
            kind: "condition",
            value: "open",
            valid_from: TS,
            valid_until: null,
            recorded_at: RECORDED,
            created_at: RECORDED,
            updated_at: RECORDED,
          } satisfies RealityState,
        ],
      });
      const activeAssessment = buildAttentionCandidateSet(activeOnly, {
        situation_query: situationQuery(),
        resource_declaration_ids: [],
      });
      assert.equal(activeAssessment.situation.base_situation.status, "ACTIVE");
      // ACTIVE_STATE_PRESENT is not a SalienceSignal — no synthetic status candidate
      assert.equal(activeAssessment.candidate_count, 0);
      assert.ok(
        !activeAssessment.candidates.some((c) =>
          JSON.stringify(c).includes("UNRESOLVED_SITUATION")
        )
      );
    });

    it("EPISTEMIC_GAP / contested claims produce base candidates without Inquiry bridge", () => {
      const state = baseState({
        claims: [
          {
            id: CLAIM_A,
            project_id: PROJECT_ID,
            subject_id: ENTITY_A,
            predicate_kind: "state",
            predicate: "condition",
            value: "normal",
            provenance: { kind: "human" },
            confidence: 0.7,
            applicable_from: TS,
            applicable_until: null,
            recorded_at: RECORDED,
            created_at: RECORDED,
            updated_at: RECORDED,
          } satisfies Claim,
          {
            id: CLAIM_B,
            project_id: PROJECT_ID,
            subject_id: ENTITY_A,
            predicate_kind: "state",
            predicate: "condition",
            value: "broken",
            provenance: { kind: "human" },
            confidence: 0.7,
            applicable_from: TS,
            applicable_until: null,
            recorded_at: RECORDED,
            created_at: RECORDED,
            updated_at: RECORDED,
          } satisfies Claim,
        ],
      });
      const assessment = buildAttentionCandidateSet(state, {
        situation_query: {
          subjectId: ENTITY_A,
          at: AT,
          predicateScopes: [
            { predicateKind: "state", predicate: "condition" },
          ],
        },
        resource_declaration_ids: [],
      });
      assert.ok(assessment.candidate_count >= 1);
      assert.equal(assessment.resource_candidate_count, 0);
      assertNoForbidden(assessment);
    });
  });

  describe("Resource candidates / coexistence", () => {
    it("QUIET base + Resource Finding → RESOURCE candidate; base stays QUIET", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W11,
        until: W13,
      });
      const assessment = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.equal(assessment.situation.base_situation.status, "QUIET");
      assert.equal(assessment.base_situation_candidate_count, 0);
      assert.ok(assessment.resource_candidate_count >= 1);
      assert.equal(assessment.status, "ATTENTION_CANDIDATES_PRESENT");
      assert.ok(
        assessment.candidates.every(
          (c) => c.source_kind === "RESOURCE_SITUATION_SALIENCE"
        )
      );
    });

    it("many overlap pairs → one Attention Candidate", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W13,
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W10,
        until: W13,
      });
      state = withRr(state, {
        id: RR_ID_3,
        madeAt: MADE_AT_3,
        from: W11,
        until: W13,
      });
      const assessment = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      const overlaps = assessment.candidates.filter(
        (c) =>
          c.basis.kind === "RESOURCE_SITUATION_SALIENCE" &&
          c.basis.resource_finding_kind ===
            "RESOURCE_RESERVATION_OVERLAP_PRESENT"
      );
      assert.equal(overlaps.length, 1);
    });

    it("multi Finding kinds → one candidate each; Findings not dual-path converted", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W13,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 70 } },
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W09,
        until: W13,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 60 } },
      });
      state = withCap(state, {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      const situation = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      const assessment = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.equal(
        assessment.resource_candidate_count,
        situation.resource_salience_signals.length
      );
      assert.equal(
        assessment.resource_candidate_count,
        situation.resource_findings.length
      );
      // no extra candidates from findings beyond salience
      assert.equal(
        assessment.candidates.filter(
          (c) => c.source_kind === "RESOURCE_SITUATION_SALIENCE"
        ).length,
        situation.resource_salience_signals.length
      );
    });

    it("holder-matching unscoped Resource excluded; foreign holder scoped included", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W11,
        until: W13,
      });
      const unscoped = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(ENTITY_A),
        resource_declaration_ids: [],
      });
      assert.equal(unscoped.resource_candidate_count, 0);

      let foreign = withRc(withCommitment(), { resourceId: RES_B });
      foreign = withRr(foreign, {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
      });
      foreign = withRr(foreign, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W11,
        until: W13,
      });
      const scoped = buildAttentionCandidateSet(foreign, {
        situation_query: situationQuery(ENTITY_A),
        resource_declaration_ids: [RES_B],
      });
      assert.ok(scoped.resource_candidate_count >= 1);
    });

    it("base + Resource candidates coexist without cross-domain merge", () => {
      let state = baseState({
        reality_events: [
          {
            id: EVENT_A,
            project_id: PROJECT_ID,
            kind: "incident",
            subject_ids: [ENTITY_A],
            occurred_at: AT,
            recorded_at: RECORDED,
            summary: "event",
            created_at: RECORDED,
            updated_at: RECORDED,
          } satisfies RealityEvent,
        ],
      });
      state = withRr(withRc(withCommitment(state)), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 30 } },
      });
      const assessment = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.ok(assessment.base_situation_candidate_count >= 1);
      assert.ok(assessment.resource_candidate_count >= 1);
      assert.equal(
        assessment.candidate_count,
        assessment.base_situation_candidate_count +
          assessment.resource_candidate_count
      );
      // base first then resource (serialization order)
      const firstResource = assessment.candidates.findIndex(
        (c) => c.source_kind === "RESOURCE_SITUATION_SALIENCE"
      );
      const lastBase = assessment.candidates
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => c.source_kind === "BASE_SITUATION_SALIENCE")
        .map(({ i }) => i)
        .pop();
      assert.ok(lastBase !== undefined && firstResource > lastBase);
    });

    it("duplicate Resource IDs and input order do not change candidates", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W13,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 130 } },
      });
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      const before = structuredClone(state);
      const a = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A, RES_A, RES_B],
      });
      const b = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_B, RES_A],
      });
      assert.deepEqual(a.candidates, b.candidates);
      assert.deepEqual(state, before);
      assert.deepEqual(a.situation.resource_declaration_ids, [RES_A, RES_B]);
    });
  });

  describe("Boundaries / determinism", () => {
    it("situation assessment untouched; model limitations present; no bridges", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 130 } },
      });
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      const before = structuredClone(state);
      const situationBefore = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      const assessment = buildAttentionCandidateSet(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.deepEqual(state, before);
      assert.deepEqual(assessment.situation, situationBefore);
      assert.deepEqual(
        assessment.model_limitations,
        ATTENTION_CANDIDATE_MODEL_LIMITATIONS
      );
      assertNoForbidden(assessment);
      assert.ok(!FORBIDDEN_FIELDS.test(JSON.stringify(assessment.candidates)));
    });
  });
});
