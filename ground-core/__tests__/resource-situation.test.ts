/**
 * GROUND-039 — Situation Core II / Explicit Resource Discovery Composition & Salience Surface
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  composeResourceAwareSituation,
  RESOURCE_SITUATION_MODEL_LIMITATIONS,
} from "../reality/resource-situation.js";
import { buildSituation } from "../reality/situation.js";
import { applyPatch } from "../state-engine.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
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
const RES_UNKNOWN = "ff060606-0606-4606-8606-060606060699";
const COMMIT_ID = "ff080808-0808-4808-8808-080808080801";
const RC_ID = "ff0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f01";
const RC_ID_2 = "ff0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f02";
const RR_ID = "ff111111-1111-4111-8111-111111111101";
const RR_ID_2 = "ff111111-1111-4111-8111-111111111102";
const RR_ID_3 = "ff111111-1111-4111-8111-111111111103";
const CAP_ID = "ff0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";
const CAP_ID_2 = "ff0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d02";
const EVENT_A = "ff121212-1212-4212-8212-121212121201";
const STATE_A = "ff131313-1313-4313-8313-131313131301";

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

const FORBIDDEN =
  /\b(attention_score|attention_required|priority|severity|urgency|weight|OVERALLOCATED|CAPACITY_EXCEEDED|DOUBLE_BOOKED|HEALTHY|SAFE)\b/;

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
  opts: {
    id?: string;
    resourceId?: string;
    capacity: ResourceCapacity;
  }
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

function assertNoVerdictFields(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!FORBIDDEN.test(json));
  assert.ok(!json.includes('"PROBLEM"'));
  assert.ok(!json.includes('"NEED"'));
  assert.ok(!json.includes('"BLOCKER"'));
  assert.ok(!json.includes('"RISK"'));
  assert.ok(!/"InquiryQuestion"/.test(json));
  assert.ok(!/"ObservationNeed"/.test(json));
}

describe("Resource-aware Situation (GROUND-039)", () => {
  describe("Schema / architecture / read-only", () => {
    it("schema 0.1.24; additive API; consumes 038 not recalculation cores", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(__dirnameTest, "../reality/resource-situation.ts"),
        "utf8"
      );
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(/discoverResourceContentionFindings/.test(core));
      assert.ok(/buildSituation/.test(core));
      assert.ok(
        !/from ["'].*resource-reservation-contention-core/.test(core)
      );
      assert.ok(
        !/from ["'].*resource-reservation-capacity-pressure-core/.test(core)
      );
    });
  });

  describe("Explicit Resource scope", () => {
    it("empty Resource scope → NO_RESOURCE_SCOPE; base Situation still composed", () => {
      const state = baseState();
      const query = situationQuery();
      const base = buildSituation(state, query);
      const aware = composeResourceAwareSituation(state, {
        situation_query: query,
        resource_declaration_ids: [],
      });
      assert.equal(aware.resource_salience_status, "NO_RESOURCE_SCOPE");
      assert.deepEqual(aware.resource_findings, []);
      assert.deepEqual(aware.resource_salience_signals, []);
      assert.deepEqual(aware.base_situation, base);
      assert.equal(aware.has_resource_scope, false);
    });

    it("empty scope does not scan project Resources with Findings", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W11,
        until: W13,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
      });
      const aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [],
      });
      assert.equal(aware.resource_salience_status, "NO_RESOURCE_SCOPE");
      assert.equal(aware.resource_findings.length, 0);
    });

    it("subject holder match does NOT auto-include Resource", () => {
      // RES_A holder = ENTITY_A = Situation subject, but omitted from scope
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
      const aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(ENTITY_A),
        resource_declaration_ids: [],
      });
      assert.equal(aware.resource_findings.length, 0);
      assert.ok(
        !aware.resource_declaration_ids.includes(RES_A)
      );
    });

    it("explicit foreign-holder Resource is included", () => {
      let state = withRc(withCommitment(), { resourceId: RES_B });
      state = withRr(state, {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W11,
        until: W13,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
      });
      // Situation subject A; Resource holder B
      const aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(ENTITY_A),
        resource_declaration_ids: [RES_B],
      });
      assert.equal(aware.resource_salience_status, "RESOURCE_SALIENCE_PRESENT");
      assert.ok(
        aware.resource_salience_signals.some(
          (s) =>
            s.resource_finding_kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT"
        )
      );
    });

    it("unknown Resource ID throws deterministic query error", () => {
      assert.throws(
        () =>
          composeResourceAwareSituation(baseState(), {
            situation_query: situationQuery(),
            resource_declaration_ids: [RES_UNKNOWN],
          }),
        /ResourceDeclaration .* not found/
      );
    });

    it("duplicate Resource IDs normalize to one", () => {
      const aware = composeResourceAwareSituation(baseState(), {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A, RES_A, RES_A],
      });
      assert.deepEqual(aware.resource_declaration_ids, [RES_A]);
      assert.equal(aware.resource_facets.length, 1);
    });
  });

  describe("Salience mapping / status / base firewall", () => {
    it("scoped Resource with no Findings → NO_RESOURCE_SALIENCE", () => {
      const aware = composeResourceAwareSituation(baseState(), {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.equal(aware.resource_salience_status, "NO_RESOURCE_SALIENCE");
      assert.equal(aware.has_resource_findings, false);
      assertNoVerdictFields(aware);
    });

    it("overlap Finding → one Salience signal; many pairs still one signal", () => {
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
      const aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      const overlapSignals = aware.resource_salience_signals.filter(
        (s) =>
          s.resource_finding_kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT"
      );
      assert.equal(overlapSignals.length, 1);
      assert.equal(aware.resource_salience_status, "RESOURCE_SALIENCE_PRESENT");
      if (overlapSignals[0]!.basis.kind === "RESERVATION_OVERLAP") {
        assert.ok(overlapSignals[0]!.basis.overlap_candidate_keys.length >= 2);
      }
    });

    it("ambiguity / capacity missing / divergence / above each map to one signal", () => {
      // ambiguity
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      let aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.ok(
        aware.resource_salience_signals.some(
          (s) =>
            s.resource_finding_kind ===
            "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
        )
      );
      assert.equal(aware.base_situation.status, "QUIET");

      // capacity missing
      state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 30 } },
      });
      aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.ok(
        aware.resource_salience_signals.some(
          (s) => s.resource_finding_kind === "RESOURCE_CAPACITY_BASIS_MISSING"
        )
      );

      // above + divergence
      state = withCap(
        withRr(withRc(withCommitment()), {
          scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 120 } },
        }),
        { id: CAP_ID, capacity: { kind: "POINT", value: 100 } }
      );
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      const kinds = aware.resource_salience_signals.map(
        (s) => s.resource_finding_kind
      );
      assert.ok(kinds.includes("RESOURCE_CAPACITY_RELATION_DIVERGENCE"));
      assert.ok(kinds.includes("RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS"));
      assertNoVerdictFields(aware);
    });

    it("multiple Finding kinds → one signal each; no ranking fields", () => {
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
      const aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.ok(aware.resource_salience_signals.length >= 3);
      assert.equal(
        aware.resource_salience_signals.length,
        aware.resource_findings.length
      );
      assert.deepEqual(
        aware.model_limitations,
        RESOURCE_SITUATION_MODEL_LIMITATIONS
      );
    });

    it("base Situation deepEquals standalone buildSituation; QUIET + Resource Salience", () => {
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
      const query = situationQuery();
      const base = buildSituation(state, query);
      assert.equal(base.status, "QUIET");
      const beforeSignals = structuredClone(base.salience_signals);
      const aware = composeResourceAwareSituation(state, {
        situation_query: query,
        resource_declaration_ids: [RES_A],
      });
      assert.deepEqual(aware.base_situation, base);
      assert.equal(aware.base_situation.status, "QUIET");
      assert.equal(
        aware.resource_salience_status,
        "RESOURCE_SALIENCE_PRESENT"
      );
      assert.deepEqual(aware.base_situation.salience_signals, beforeSignals);
      assert.ok(
        !aware.base_situation.salience_signals.some((s) =>
          String(s.kind).includes("RESOURCE")
        )
      );
    });

    it("ACTIVE base + Resource Salience remain independent", () => {
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
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W11,
        until: W13,
      });
      const query = situationQuery();
      const base = buildSituation(state, query);
      assert.equal(base.status, "ACTIVE");
      const aware = composeResourceAwareSituation(state, {
        situation_query: query,
        resource_declaration_ids: [RES_A],
      });
      assert.equal(aware.base_situation.status, "ACTIVE");
      assert.equal(
        aware.resource_salience_status,
        "RESOURCE_SALIENCE_PRESENT"
      );
      assert.deepEqual(aware.base_situation, base);
    });

    it("ACTIVE base + no Resource Salience", () => {
      const state = baseState({
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
      const query = situationQuery();
      const base = buildSituation(state, query);
      assert.equal(base.status, "ACTIVE");
      const aware = composeResourceAwareSituation(state, {
        situation_query: query,
        resource_declaration_ids: [RES_A],
      });
      assert.equal(aware.base_situation.status, "ACTIVE");
      assert.equal(aware.resource_salience_status, "NO_RESOURCE_SALIENCE");
    });
  });

  describe("Multi-resource / relation / mutation boundaries", () => {
    it("two Resources ordered by resource ID then finding kind", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 130 } },
      });
      state = withCap(state, {
        resourceId: RES_A,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withRc(state, { id: RC_ID_2, resourceId: RES_B });
      state = withRr(state, {
        id: RR_ID_2,
        rcId: RC_ID_2,
        madeAt: MADE_AT_2,
        from: W09,
        until: W12,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 40 } },
      });
      const before = structuredClone(state);
      const a = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_B, RES_A],
      });
      const b = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_B, RES_A],
      });
      assert.deepEqual(a, b);
      assert.deepEqual(state, before);
      assert.deepEqual(a.resource_declaration_ids, [RES_A, RES_B]);
      for (let i = 1; i < a.resource_salience_signals.length; i++) {
        const prev = a.resource_salience_signals[i - 1]!;
        const cur = a.resource_salience_signals[i]!;
        if (prev.resource_declaration_id !== cur.resource_declaration_id) {
          assert.ok(
            prev.resource_declaration_id < cur.resource_declaration_id
          );
        }
      }
    });

    it("omitted Resource connected via committer/reserver is excluded", () => {
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
      const aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(ENTITY_COMMITTER),
        resource_declaration_ids: [],
      });
      assert.equal(aware.resource_findings.length, 0);
    });

    it("read-only and no Attention/Inquiry/Decision bridges", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 130 } },
      });
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      const before = structuredClone(state);
      const aware = composeResourceAwareSituation(state, {
        situation_query: situationQuery(),
        resource_declaration_ids: [RES_A],
      });
      assert.deepEqual(state, before);
      assertNoVerdictFields(aware);
      assert.ok(!("attention_score" in aware));
      assert.ok(!("priority" in aware));
    });
  });
});
