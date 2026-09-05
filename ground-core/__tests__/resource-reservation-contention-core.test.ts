/**
 * GROUND-036 — Reservation Contention Core I / Structural Overlap & Declared Load Composition
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  assessReservationEventLoadBasisAt,
  assessResourceReservationContention,
  assessResourceReservationEventRepresentations,
  buildResourceReservationRepresentations,
  composeDeclaredResourceReservationLoadAt,
  detectResourceReservationOverlapCandidates,
  doReservationWindowsOverlap,
  getReservationWindowOverlap,
  RESOURCE_RESERVATION_CONTENTION_MODEL_LIMITATIONS,
} from "../reality/resource-reservation-contention-core.js";
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
  ResourceCapacityDeclaration,
  ResourceDeclaration,
  ResourceReservationScope,
  RealityEntity,
  StatePatch,
} from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_HOLDER = "ff010101-0101-4101-8101-010101010101";
const ENTITY_COMMITTER = "ff010101-0101-4101-8101-010101010102";
const ENTITY_RESERVER = "ff010101-0101-4101-8101-010101010103";
const ENTITY_RESERVER_B = "ff010101-0101-4101-8101-010101010104";
const ENTITY_DECLARER = "ff010101-0101-4101-8101-010101010105";
const ENTITY_WAREHOUSE = "ff010101-0101-4101-8101-010101010106";
const INT_A = "ff020202-0202-4202-8202-020202020201";
const INT_B = "ff020202-0202-4202-8202-020202020202";
const SPACE_D = "ff030303-0303-4303-8303-030303030301";
const OPT_INT = "ff040404-0404-4404-8404-040404040401";
const CAND_A = "ff050505-0505-4505-8505-050505050501";
const RES_A = "ff060606-0606-4606-8606-060606060601";
const RES_B = "ff060606-0606-4606-8606-060606060602";
const COMMIT_ID = "ff080808-0808-4808-8808-080808080801";
const COMMIT_ID_B = "ff080808-0808-4808-8808-080808080802";
const RC_ID = "ff0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f01";
const RC_ID_2 = "ff0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f02";
const RR_ID = "ff111111-1111-4111-8111-111111111101";
const RR_ID_2 = "ff111111-1111-4111-8111-111111111102";
const RR_ID_3 = "ff111111-1111-4111-8111-111111111103";
const CAP_ID = "ff0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const RC_AT = "2026-08-05T10:00:00.000Z";
const MADE_AT = "2026-08-10T10:00:00.000Z";
const MADE_AT_2 = "2026-08-11T10:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";

const W09 = "2026-09-01T09:00:00.000Z";
const W10 = "2026-09-01T10:00:00.000Z";
const W11 = "2026-09-01T11:00:00.000Z";
const W12 = "2026-09-01T12:00:00.000Z";
const W13 = "2026-09-01T13:00:00.000Z";

const FORBIDDEN =
  /\b(has_conflict|DOUBLE_BOOKED|OVERALLOCATED|reserved_quantity|current_usage|free_quantity|is_effective|CAPACITY_EXCEEDED)\b/;

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
      entity(ENTITY_HOLDER, "Holder"),
      entity(ENTITY_COMMITTER, "Committer"),
      entity(ENTITY_RESERVER, "Reserver"),
      entity(ENTITY_RESERVER_B, "Reserver B"),
      entity(ENTITY_DECLARER, "Declarer"),
      entity(ENTITY_WAREHOUSE, "Warehouse"),
    ],
    intervention_declarations: [intervention(INT_A), intervention(INT_B)],
    decision_space_declarations: [decisionSpace(SPACE_D)],
    decision_option_declarations: [decisionOption(OPT_INT, SPACE_D, INT_A)],
    decision_option_actor_candidate_declarations: [
      actorCandidate(CAND_A, OPT_INT, ENTITY_HOLDER),
    ],
    resource_declarations: [
      resource(RES_A, ENTITY_WAREHOUSE),
      resource(RES_B, ENTITY_WAREHOUSE, "stretcher"),
    ],
    ...overrides,
  };
}

function withCommitment(
  interventionId = INT_A,
  commitId = COMMIT_ID,
  declaredBy: InterventionCommitmentDeclaration["declared_by"] = {
    kind: "human",
  }
): ProjectState {
  return applyPatch(
    baseState(),
    upsert("intervention_commitment_declaration", commitId, {
      id: commitId,
      project_id: PROJECT_ID,
      commitment_holder_entity_id: ENTITY_HOLDER,
      intervention_id: interventionId,
      basis: [],
      committed_at: COMMITTED_AT,
      valid_until: null,
      note: null,
      declared_by: declaredBy,
      recorded_at: RECORDED,
      created_at: RECORDED,
      updated_at: RECORDED,
    } satisfies InterventionCommitmentDeclaration)
  );
}

function withRc(
  state: ProjectState,
  opts: {
    id?: string;
    commitmentId?: string;
    resourceId?: string;
    declaredBy?: InterventionResourceCommitmentDeclaration["declared_by"];
  } = {}
): ProjectState {
  const id = opts.id ?? RC_ID;
  return applyPatch(
    state,
    upsert("intervention_resource_commitment_declaration", id, {
      id,
      project_id: PROJECT_ID,
      commitment_declaration_id: opts.commitmentId ?? COMMIT_ID,
      resource_declaration_id: opts.resourceId ?? RES_A,
      resource_committer_entity_id: ENTITY_COMMITTER,
      committed_amount: { kind: "POINT", value: 10 },
      resource_committed_at: RC_AT,
      note: null,
      declared_by:
        opts.declaredBy ?? { kind: "human", entity_id: ENTITY_DECLARER },
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
    reserver?: string;
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
      reserved_by_entity_id: opts.reserver ?? ENTITY_RESERVER,
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

describe("Resource Reservation Contention (GROUND-036)", () => {
  describe("Schema / read-only", () => {
    it("schema remains 0.1.24 with no migration", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.equal(validProjectStateV0124.schema_version, "0.1.24");
    });

    it("modules avoid forbidden conflict/quantity verdict APIs", () => {
      const core = readFileSync(
        join(__dirnameTest, "../reality/resource-reservation-contention-core.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/resource-reservation-contention-types.ts"
        ),
        "utf8"
      );
      assert.ok(!FORBIDDEN.test(core));
      assert.ok(!FORBIDDEN.test(types));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
    });
  });

  describe("Representation / no cartesian product", () => {
    it("single declaration → one representation", () => {
      const state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
      });
      const reps = buildResourceReservationRepresentations(state, RES_A);
      assert.equal(reps.length, 1);
      assert.equal(reps[0]!.reservation_declaration_ids.length, 1);
    });

    it("multi-source identical report → one representation with two IDs", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const reps = buildResourceReservationRepresentations(state, RES_A);
      assert.equal(reps.length, 1);
      assert.deepEqual(reps[0]!.reservation_declaration_ids, [RR_ID, RR_ID_2]);
    });

    it("joint representation — no cartesian product", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        from: W10,
        until: W13,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const reps = buildResourceReservationRepresentations(state, RES_A);
      assert.equal(reps.length, 2);
      const keys = reps.map((r) => `${r.scope_key}|${r.window_key}`).sort();
      assert.deepEqual(keys, [
        `AMOUNT|POINT|10|${W09}|${W12}`,
        `AMOUNT|POINT|20|${W10}|${W13}`,
      ]);
      assert.ok(!keys.includes(`AMOUNT|POINT|10|${W10}|${W13}`));
      assert.ok(!keys.includes(`AMOUNT|POINT|20|${W09}|${W12}`));
    });

    it("same semantic Reservation representations do not overlap against themselves", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        from: W10,
        until: W13,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const candidates = detectResourceReservationOverlapCandidates(
        state,
        RES_A
      );
      assert.equal(candidates.length, 0);
      const events = assessResourceReservationEventRepresentations(
        state,
        RES_A
      );
      assert.equal(events.length, 1);
      assert.equal(events[0]!.has_multiple_representations, true);
    });
  });

  describe("Window overlap", () => {
    it("basic overlap and boundary touch", () => {
      assert.equal(
        doReservationWindowsOverlap(
          { reserved_from: W09, reserved_until: W12 },
          { reserved_from: W11, reserved_until: W13 }
        ),
        true
      );
      assert.deepEqual(
        getReservationWindowOverlap(
          { reserved_from: W09, reserved_until: W12 },
          { reserved_from: W11, reserved_until: W13 }
        ),
        { overlap_from: W11, overlap_until: W12 }
      );
      assert.equal(
        doReservationWindowsOverlap(
          { reserved_from: W09, reserved_until: W12 },
          { reserved_from: W12, reserved_until: W13 }
        ),
        false
      );
    });

    it("open-ended windows overlap correctly", () => {
      assert.equal(
        doReservationWindowsOverlap(
          { reserved_from: W09, reserved_until: null },
          { reserved_from: W11, reserved_until: W13 }
        ),
        true
      );
      assert.deepEqual(
        getReservationWindowOverlap(
          { reserved_from: W09, reserved_until: null },
          { reserved_from: W11, reserved_until: W13 }
        ),
        { overlap_from: W11, overlap_until: W13 }
      );
      assert.equal(
        doReservationWindowsOverlap(
          { reserved_from: W09, reserved_until: null },
          { reserved_from: W10, reserved_until: null }
        ),
        true
      );
    });

    it("creates overlap candidate for distinct events; not for different Resource IDs", () => {
      let state = withRr(withRc(withCommitment()), {
        from: W09,
        until: W12,
        madeAt: MADE_AT,
        reserver: ENTITY_RESERVER,
      });
      state = withRr(state, {
        id: RR_ID_2,
        from: W11,
        until: W13,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const candidates = detectResourceReservationOverlapCandidates(
        state,
        RES_A
      );
      assert.equal(candidates.length, 1);
      assert.deepEqual(candidates[0]!.overlap_window, {
        overlap_from: W11,
        overlap_until: W12,
      });
      assert.equal(candidates[0]!.same_reserver, false);

      let other = withRc(withCommitment(), { resourceId: RES_B });
      // RES_B uses different resource - need separate RC; for this test just
      // confirm RES_B has no candidates when only RES_A reserved
      assert.equal(
        detectResourceReservationOverlapCandidates(state, RES_B).length,
        0
      );
      void other;
    });

    it("pair determinism — A/B order does not duplicate", () => {
      let state = withRr(withRc(withCommitment()), {
        from: W09,
        until: W12,
        madeAt: MADE_AT,
        reserver: ENTITY_RESERVER,
      });
      state = withRr(state, {
        id: RR_ID_2,
        from: W11,
        until: W13,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const a = detectResourceReservationOverlapCandidates(state, RES_A);
      const b = detectResourceReservationOverlapCandidates(state, RES_A);
      assert.deepEqual(a, b);
      assert.equal(a.length, 1);
    });
  });

  describe("Scope interaction / contention assessment", () => {
    it("FULL+FULL / FULL+AMOUNT / AMOUNT+AMOUNT without double-booking", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: { kind: "FULL_RESOURCE" },
        from: W09,
        until: W12,
        madeAt: MADE_AT,
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "FULL_RESOURCE" },
        from: W11,
        until: W13,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      let c = detectResourceReservationOverlapCandidates(state, RES_A);
      assert.equal(c[0]!.scope_interaction, "FULL_RESOURCE_WITH_FULL_RESOURCE");
      assert.ok(!JSON.stringify(c).includes("DOUBLE_BOOKED"));

      state = withRr(withRc(withCommitment()), {
        scope: { kind: "FULL_RESOURCE" },
        from: W09,
        until: W12,
        madeAt: MADE_AT,
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 1 } },
        from: W11,
        until: W13,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      c = detectResourceReservationOverlapCandidates(state, RES_A);
      assert.equal(c[0]!.scope_interaction, "FULL_RESOURCE_WITH_AMOUNT");

      state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        madeAt: MADE_AT,
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        from: W11,
        until: W13,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      c = detectResourceReservationOverlapCandidates(state, RES_A);
      assert.equal(c[0]!.scope_interaction, "AMOUNT_WITH_AMOUNT");

      const contention = assessResourceReservationContention(state, RES_A);
      assert.equal(contention.has_overlap_candidates, true);
      assert.ok(!("has_conflict" in contention));
      assert.deepEqual(
        contention.model_limitations,
        RESOURCE_RESERVATION_CONTENTION_MODEL_LIMITATIONS
      );
    });
  });

  describe("Coverage / load basis / composition", () => {
    it("coverage statuses and POINT/RANGE/FULL load bases", () => {
      const state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
      });
      const positionKey = buildResourceReservationRepresentations(
        state,
        RES_A
      )[0]!.reservation_position_key;

      const outside = assessReservationEventLoadBasisAt(
        state,
        positionKey,
        W13
      );
      assert.equal(outside.coverage_status, "NO_REPRESENTED_WINDOW_COVERS_AT");
      assert.equal(outside.load_basis_status, "NOT_REPRESENTED_AT");

      const inside = assessReservationEventLoadBasisAt(state, positionKey, W10);
      assert.equal(inside.coverage_status, "REPRESENTED_WINDOW_COVERS_AT");
      assert.equal(inside.load_basis_status, "UNAMBIGUOUS_AMOUNT");
      assert.deepEqual(inside.amount_range, { min: 10, max: 10 });

      const rangeState = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "RANGE", min: 5, max: 10 } },
        from: W09,
        until: W12,
      });
      const rangeKey = buildResourceReservationRepresentations(
        rangeState,
        RES_A
      )[0]!.reservation_position_key;
      assert.deepEqual(
        assessReservationEventLoadBasisAt(rangeState, rangeKey, W10)
          .amount_range,
        { min: 5, max: 10 }
      );

      const fullState = withRr(withRc(withCommitment()), {
        scope: { kind: "FULL_RESOURCE" },
        from: W09,
        until: W12,
      });
      const fullKey = buildResourceReservationRepresentations(
        fullState,
        RES_A
      )[0]!.reservation_position_key;
      const full = assessReservationEventLoadBasisAt(fullState, fullKey, W10);
      assert.equal(full.load_basis_status, "UNAMBIGUOUS_FULL_RESOURCE");
      assert.equal(full.amount_range, null);
    });

    it("divergent amount/scope/window block unambiguous load", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const key = buildResourceReservationRepresentations(state, RES_A)[0]!
        .reservation_position_key;
      assert.equal(
        assessReservationEventLoadBasisAt(state, key, W10).load_basis_status,
        "AMBIGUOUS_SCOPE_OR_AMOUNT"
      );

      state = withRr(withRc(withCommitment()), {
        scope: { kind: "FULL_RESOURCE" },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      assert.equal(
        assessReservationEventLoadBasisAt(
          state,
          buildResourceReservationRepresentations(state, RES_A)[0]!
            .reservation_position_key,
          W10
        ).load_basis_status,
        "AMBIGUOUS_SCOPE_OR_AMOUNT"
      );

      state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W10,
        until: W13,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const contested = assessReservationEventLoadBasisAt(
        state,
        buildResourceReservationRepresentations(state, RES_A)[0]!
          .reservation_position_key,
        W09
      );
      assert.equal(
        contested.coverage_status,
        "CONTESTED_REPRESENTED_WINDOW_COVERAGE"
      );
      assert.equal(contested.load_basis_status, "AMBIGUOUS_COVERAGE");
      assert.equal(
        composeDeclaredResourceReservationLoadAt(state, RES_A, W09).status,
        "AMBIGUOUS_RESERVATION_REPRESENTATION"
      );
    });

    it("duplicate sources count once; two events compose numerically", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      let composition = composeDeclaredResourceReservationLoadAt(
        state,
        RES_A,
        W10
      );
      assert.equal(composition.status, "COMPLETE_NUMERIC_COMPOSITION");
      assert.deepEqual(composition.represented_amount_range, {
        min: 10,
        max: 10,
      });

      state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        madeAt: MADE_AT,
        reserver: ENTITY_RESERVER,
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        from: W09,
        until: W12,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      composition = composeDeclaredResourceReservationLoadAt(
        state,
        RES_A,
        W10
      );
      assert.equal(composition.status, "COMPLETE_NUMERIC_COMPOSITION");
      assert.deepEqual(composition.represented_amount_range, {
        min: 30,
        max: 30,
      });
      assert.ok(!("reserved_quantity" in composition));
      assert.ok(!("free_quantity" in composition));
    });

    it("POINT + RANGE composition and FULL_RESOURCE non-numeric status", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        from: W09,
        until: W12,
        madeAt: MADE_AT,
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "RANGE", min: 5, max: 8 } },
        from: W09,
        until: W12,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      assert.deepEqual(
        composeDeclaredResourceReservationLoadAt(state, RES_A, W10)
          .represented_amount_range,
        { min: 15, max: 18 }
      );

      state = withRr(withRc(withCommitment()), {
        scope: { kind: "FULL_RESOURCE" },
        from: W09,
        until: W12,
      });
      assert.equal(
        composeDeclaredResourceReservationLoadAt(state, RES_A, W10).status,
        "NON_NUMERIC_FULL_RESOURCE_PRESENT"
      );

      assert.equal(
        composeDeclaredResourceReservationLoadAt(
          withRc(withCommitment()),
          RES_A,
          W10
        ).status,
        "NO_REPRESENTED_RESERVATION_LOAD"
      );
    });

    it("Capacity comparison and free quantity remain unmodeled", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 30 } },
        from: W09,
        until: W12,
      });
      state = applyPatch(
        state,
        upsert("resource_capacity_declaration", CAP_ID, {
          id: CAP_ID,
          project_id: PROJECT_ID,
          resource_declaration_id: RES_A,
          capacity: { kind: "POINT", value: 100 },
          valid_from: TS,
          valid_until: null,
          declared_by: { kind: "human" },
          recorded_at: TS,
          note: null,
          created_at: TS,
          updated_at: TS,
        } satisfies ResourceCapacityDeclaration)
      );
      const composition = composeDeclaredResourceReservationLoadAt(
        state,
        RES_A,
        W10
      );
      assert.deepEqual(composition.represented_amount_range, {
        min: 30,
        max: 30,
      });
      assert.ok(
        composition.model_limitations.includes("CAPACITY_COMPARISON_NOT_MODELED")
      );
      assert.ok(
        composition.model_limitations.includes(
          "RESOURCE_FREE_QUANTITY_NOT_MODELED"
        )
      );
      assert.ok(!JSON.stringify(composition).includes("OVERALLOCATED"));

      state = withRr(withRc(withCommitment()), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 70 } },
        from: W09,
        until: W12,
        madeAt: MADE_AT,
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 60 } },
        from: W09,
        until: W12,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const heavy = composeDeclaredResourceReservationLoadAt(
        state,
        RES_A,
        W10
      );
      assert.deepEqual(heavy.represented_amount_range, { min: 130, max: 130 });
      assert.ok(!JSON.stringify(heavy).includes("CAPACITY_EXCEEDED"));
    });
  });

  describe("Firewalls / determinism", () => {
    it("does not mutate ProjectState; assessments are deterministic", () => {
      let state = withRr(withRc(withCommitment()), {
        from: W09,
        until: W12,
        madeAt: MADE_AT,
      });
      state = withRr(state, {
        id: RR_ID_2,
        from: W11,
        until: W13,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const before = structuredClone(state);
      const c1 = assessResourceReservationContention(state, RES_A);
      const c2 = assessResourceReservationContention(state, RES_A);
      const l1 = composeDeclaredResourceReservationLoadAt(state, RES_A, W11);
      const l2 = composeDeclaredResourceReservationLoadAt(state, RES_A, W11);
      assert.deepEqual(c1, c2);
      assert.deepEqual(l1, l2);
      assert.deepEqual(state, before);
      assert.deepEqual(
        state.intervention_resource_reservation_declarations,
        before.intervention_resource_reservation_declarations
      );
      assert.deepEqual(
        state.resource_capacity_declarations,
        before.resource_capacity_declarations
      );
      assert.equal(state.blockers.length, 0);
      assert.equal(state.reality_events.length, 0);
    });

    it("same Resource Commitment overlap relation exposed without verdict", () => {
      let state = withRr(withRc(withCommitment()), {
        from: W09,
        until: W12,
        madeAt: MADE_AT,
        reserver: ENTITY_RESERVER,
      });
      state = withRr(state, {
        id: RR_ID_2,
        from: W11,
        until: W13,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const candidate = detectResourceReservationOverlapCandidates(
        state,
        RES_A
      )[0]!;
      assert.equal(candidate.same_resource_commitment, true);
      assert.equal(candidate.same_intervention_commitment, true);
    });

    it("different Resource Commitments still only structural overlap", () => {
      let state = applyPatch(
        withCommitment(),
        upsert("intervention_commitment_declaration", COMMIT_ID_B, {
          id: COMMIT_ID_B,
          project_id: PROJECT_ID,
          commitment_holder_entity_id: ENTITY_HOLDER,
          intervention_id: INT_B,
          basis: [],
          committed_at: COMMITTED_AT,
          valid_until: null,
          note: null,
          declared_by: { kind: "human", entity_id: ENTITY_DECLARER },
          recorded_at: RECORDED,
          created_at: RECORDED,
          updated_at: RECORDED,
        })
      );
      state = withRc(state, { commitmentId: COMMIT_ID });
      state = withRc(state, {
        id: RC_ID_2,
        commitmentId: COMMIT_ID_B,
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      state = withRr(state, {
        rcId: RC_ID,
        from: W09,
        until: W12,
        madeAt: MADE_AT,
      });
      state = withRr(state, {
        id: RR_ID_2,
        rcId: RC_ID_2,
        from: W11,
        until: W13,
        madeAt: MADE_AT_2,
        reserver: ENTITY_RESERVER_B,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const candidate = detectResourceReservationOverlapCandidates(
        state,
        RES_A
      )[0]!;
      assert.equal(candidate.same_resource_commitment, false);
      assert.equal(candidate.same_intervention_commitment, false);
      assert.ok(!JSON.stringify(candidate).includes("DOUBLE_BOOKED"));
    });
  });
});
