/**
 * GROUND-035 — Resource Reservation Core I / Operational Hold Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { PatchError } from "../errors.js";
import { migrateProjectState } from "../migrate.js";
import { assessDeclaredCommitmentAcceptance } from "../reality/commitment-acceptance-core.js";
import { assessDeclaredCommitmentConditionalTerms } from "../reality/commitment-conditional-term-core.js";
import { assessDeclaredCommitmentTemporalTerms } from "../reality/commitment-temporal-term-core.js";
import { assessDeclaredInterventionResourceCommitments } from "../reality/resource-commitment-core.js";
import { assessResource } from "../reality/resource-core.js";
import {
  assessDeclaredInterventionResourceReservations,
  assessInterventionResourceReservationContext,
  assessResourceReservationSourceRelation,
  assessResourceReserverCommitterRelation,
  assessResourceReserverCommitmentHolderRelation,
  assessResourceReserverHolderRelation,
  doesResourceReservationWindowCoverAt,
  getInterventionResourceReservationHistory,
  RESOURCE_RESERVATION_MODEL_LIMITATIONS,
  resourceReservationScopeKey,
} from "../reality/resource-reservation-core.js";
import { applyPatch } from "../state-engine.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionCommitmentDeclaration,
  InterventionDeclaration,
  InterventionResourceCommitmentDeclaration,
  InterventionResourceRequirementDeclaration,
  InterventionResourceReservationDeclaration,
  ProjectState,
  ResourceAvailabilityDeclaration,
  ResourceCapacityDeclaration,
  ResourceDeclaration,
  ResourceReservationScope,
  RealityEntity,
  StatePatch,
} from "../types.js";
import {
  PROJECT_ID,
  validProjectStateV0123,
  validProjectStateV0124,
} from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_HOLDER = "fe010101-0101-4101-8101-010101010101";
const ENTITY_COMMITTER = "fe010101-0101-4101-8101-010101010102";
const ENTITY_RESERVER = "fe010101-0101-4101-8101-010101010103";
const ENTITY_DECLARER = "fe010101-0101-4101-8101-010101010104";
const ENTITY_WAREHOUSE = "fe010101-0101-4101-8101-010101010105";
const INT_A = "fe020202-0202-4202-8202-020202020201";
const INT_B = "fe020202-0202-4202-8202-020202020202";
const SPACE_D = "fe030303-0303-4303-8303-030303030301";
const OPT_INT = "fe040404-0404-4404-8404-040404040401";
const CAND_A = "fe050505-0505-4505-8505-050505050501";
const RES_A = "fe060606-0606-4606-8606-060606060601";
const COMMIT_ID = "fe080808-0808-4808-8808-080808080801";
const COMMIT_ID_B = "fe080808-0808-4808-8808-080808080802";
const RC_ID = "fe0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f01";
const RC_ID_2 = "fe0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f02";
const RR_ID = "fe111111-1111-4111-8111-111111111101";
const RR_ID_2 = "fe111111-1111-4111-8111-111111111102";
const ACCEPT_ID = "fe090909-0909-4909-8909-090909090901";
const TERM_ID = "fe0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const COND_ID = "fe0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const REQ_ID = "fe0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const CAP_ID = "fe0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";
const AVAIL_ID = "fe0e0e0e-0e0e-4e0e-8e0e-0e0e0e0e0e01";
const PERM_ID = "fe121212-1212-4121-8121-121212121201";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const RC_AT = "2026-08-05T10:00:00.000Z";
const MADE_AT = "2026-08-10T10:00:00.000Z";
const FROM = "2026-09-01T08:00:00.000Z";
const UNTIL = "2026-09-01T18:00:00.000Z";
const FROM_2 = "2026-09-01T08:00:00.000Z";
const UNTIL_2 = "2026-09-01T20:00:00.000Z";
const ACCEPTED_AT = "2026-08-01T12:00:00.000Z";
const DEADLINE = "2026-09-10T18:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";

const FORBIDDEN_API =
  /\b(is_active|is_effective|effective_reservation|total_reserved|free_quantity|remaining_quantity|DOUBLE_BOOKED|OVERALLOCATED|allocation_id|consumed_amount)\b/;

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

function resource(id: string, holderId: string): ResourceDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    holder_entity_id: holderId,
    resource_key: "ambulance",
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
      entity(ENTITY_DECLARER, "Declarer"),
      entity(ENTITY_WAREHOUSE, "Warehouse"),
    ],
    intervention_declarations: [intervention(INT_A), intervention(INT_B)],
    decision_space_declarations: [decisionSpace(SPACE_D)],
    decision_option_declarations: [decisionOption(OPT_INT, SPACE_D, INT_A)],
    decision_option_actor_candidate_declarations: [
      actorCandidate(CAND_A, OPT_INT, ENTITY_HOLDER),
    ],
    resource_declarations: [resource(RES_A, ENTITY_WAREHOUSE)],
    ...overrides,
  };
}

function withCommitment(): ProjectState {
  return applyPatch(
    baseState(),
    upsert("intervention_commitment_declaration", COMMIT_ID, {
      id: COMMIT_ID,
      project_id: PROJECT_ID,
      commitment_holder_entity_id: ENTITY_HOLDER,
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

function withResourceCommitment(
  state: ProjectState = withCommitment(),
  opts: {
    id?: string;
    amount?: InterventionResourceCommitmentDeclaration["committed_amount"];
    committer?: string;
    commitmentId?: string;
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
      resource_declaration_id: RES_A,
      resource_committer_entity_id: opts.committer ?? ENTITY_COMMITTER,
      committed_amount: opts.amount === undefined ? { kind: "POINT", value: 10 } : opts.amount,
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

function rrPayload(
  id: string,
  opts: {
    rcId?: string;
    reserver?: string;
    scope?: ResourceReservationScope;
    madeAt?: string;
    from?: string;
    until?: string | null;
    declaredBy?: InterventionResourceReservationDeclaration["declared_by"];
  } = {}
): InterventionResourceReservationDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    resource_commitment_declaration_id: opts.rcId ?? RC_ID,
    reserved_by_entity_id: opts.reserver ?? ENTITY_RESERVER,
    reservation_scope: opts.scope ?? { kind: "FULL_RESOURCE" },
    reservation_made_at: opts.madeAt ?? MADE_AT,
    reserved_from: opts.from ?? FROM,
    reserved_until: opts.until === undefined ? UNTIL : opts.until,
    note: null,
    declared_by:
      opts.declaredBy ?? { kind: "human", entity_id: ENTITY_DECLARER },
    recorded_at: RECORDED,
    created_at: RECORDED,
    updated_at: RECORDED,
  };
}

function withReservation(
  state: ProjectState = withResourceCommitment(),
  opts: Parameters<typeof rrPayload>[1] & { id?: string } = {}
): ProjectState {
  const id = opts.id ?? RR_ID;
  return applyPatch(
    state,
    upsert("intervention_resource_reservation_declaration", id, rrPayload(id, opts))
  );
}

function assertThrowsPatch(fn: () => void, re: RegExp): void {
  assert.throws(fn, (err: unknown) => {
    assert.ok(err instanceof PatchError || err instanceof Error);
    assert.match(String(err), re);
    return true;
  });
}

describe("Resource Reservation (GROUND-035)", () => {
  describe("Migration / persistence", () => {
    it("migrates 0.1.23 → 0.1.24 with empty Reservation array", () => {
      const migrated = migrateProjectState(validProjectStateV0123);
      assert.equal(migrated.schema_version, "0.1.25");
      assert.deepEqual(migrated.intervention_resource_reservation_declarations, []);
    });

    it("SCHEMA_VERSION is 0.1.24", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
    });

    it("persists FULL_RESOURCE without numeric inference", () => {
      const next = withReservation(withResourceCommitment(), {
        scope: { kind: "FULL_RESOURCE" },
      });
      const decl = next.intervention_resource_reservation_declarations[0]!;
      assert.deepEqual(decl.reservation_scope, { kind: "FULL_RESOURCE" });
      assert.equal(resourceReservationScopeKey(decl.reservation_scope), "FULL_RESOURCE");
    });

    it("persists POINT and RANGE amounts", () => {
      const point = withReservation(withResourceCommitment(), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
      });
      assert.deepEqual(
        point.intervention_resource_reservation_declarations[0]?.reservation_scope,
        { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } }
      );
      const range = withReservation(withResourceCommitment(), {
        scope: { kind: "AMOUNT", amount: { kind: "RANGE", min: 5, max: 10 } },
      });
      assert.deepEqual(
        range.intervention_resource_reservation_declarations[0]?.reservation_scope,
        { kind: "AMOUNT", amount: { kind: "RANGE", min: 5, max: 10 } }
      );
    });
  });

  describe("Validation", () => {
    it("rejects unknown Resource Commitment / reserver / declarer", () => {
      assertThrowsPatch(
        () =>
          applyPatch(
            withCommitment(),
            upsert(
              "intervention_resource_reservation_declaration",
              RR_ID,
              rrPayload(RR_ID)
            )
          ),
        /unknown resource_commitment_declaration_id/
      );
      assertThrowsPatch(
        () =>
          withReservation(withResourceCommitment(), {
            reserver: "fe999999-9999-4999-8999-999999999999",
          }),
        /unknown reserved_by_entity_id/
      );
      assertThrowsPatch(
        () =>
          withReservation(withResourceCommitment(), {
            declaredBy: {
              kind: "human",
              entity_id: "fe999999-9999-4999-8999-999999999999",
            },
          }),
        /declared_by.entity_id not found/
      );
    });

    it("rejects temporal ordering violations", () => {
      assertThrowsPatch(
        () =>
          withReservation(withResourceCommitment(), {
            madeAt: "2026-08-01T00:00:00.000Z",
          }),
        /reservation_made_at must be >= resource_commitment.resource_committed_at/
      );
      assertThrowsPatch(
        () =>
          withReservation(withResourceCommitment(), {
            madeAt: "2026-08-21T00:00:00.000Z",
          }),
        /reservation_made_at must be <= recorded_at/
      );
      assertThrowsPatch(
        () =>
          withReservation(withResourceCommitment(), {
            from: "2026-08-09T00:00:00.000Z",
          }),
        /reserved_from must be >= reservation_made_at/
      );
      assertThrowsPatch(
        () =>
          withReservation(withResourceCommitment(), {
            until: FROM,
          }),
        /reserved_until must be null or after reserved_from/
      );
    });

    it("allows future window and open-ended until", () => {
      const future = withReservation(withResourceCommitment(), {
        from: FROM,
        until: UNTIL,
      });
      assert.equal(
        future.intervention_resource_reservation_declarations.length,
        1
      );
      const open = withReservation(withResourceCommitment(), {
        until: null,
      });
      assert.equal(
        open.intervention_resource_reservation_declarations[0]?.reserved_until,
        null
      );
    });
  });

  describe("No auto-inference", () => {
    it("Resource Commitment does not auto-create Reservation", () => {
      const state = withResourceCommitment();
      assert.equal(
        state.intervention_resource_reservation_declarations.length,
        0
      );
      assert.equal(
        assessDeclaredInterventionResourceReservations(state, RC_ID).status,
        "NO_RESOURCE_RESERVATION_DECLARATIONS"
      );
      assert.equal(
        assessDeclaredInterventionResourceCommitments(state, COMMIT_ID)
          .has_resource_commitments,
        true
      );
    });

    it("Acceptance / Temporal / Conditional do not create Reservation", () => {
      let state = withResourceCommitment();
      state = applyPatch(
        state,
        upsert("intervention_commitment_acceptance_declaration", ACCEPT_ID, {
          id: ACCEPT_ID,
          project_id: PROJECT_ID,
          commitment_declaration_id: COMMIT_ID,
          accepted_at: ACCEPTED_AT,
          note: null,
          declared_by: { kind: "human", entity_id: ENTITY_HOLDER },
          recorded_at: RECORDED,
          created_at: RECORDED,
          updated_at: RECORDED,
        })
      );
      state = applyPatch(
        state,
        upsert("intervention_commitment_temporal_term_declaration", TERM_ID, {
          id: TERM_ID,
          project_id: PROJECT_ID,
          commitment_declaration_id: COMMIT_ID,
          term_kind: "COMPLETE_BY",
          deadline_at: DEADLINE,
          note: null,
          declared_by: { kind: "human", entity_id: ENTITY_HOLDER },
          recorded_at: RECORDED,
          created_at: RECORDED,
          updated_at: RECORDED,
        })
      );
      state = applyPatch(
        state,
        upsert(
          "intervention_commitment_conditional_term_declaration",
          COND_ID,
          {
            id: COND_ID,
            project_id: PROJECT_ID,
            commitment_declaration_id: COMMIT_ID,
            condition_key: "weather-ok",
            condition_role: "ACTIVATION_CONDITION",
            description: null,
            note: null,
            declared_by: { kind: "human", entity_id: ENTITY_HOLDER },
            recorded_at: RECORDED,
            created_at: RECORDED,
            updated_at: RECORDED,
          }
        )
      );
      assert.equal(
        state.intervention_resource_reservation_declarations.length,
        0
      );
      assert.equal(
        assessDeclaredCommitmentAcceptance(state, COMMIT_ID).status,
        "ACCEPTANCE_DECLARED"
      );
      assert.equal(
        assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID).has_temporal_terms,
        true
      );
      assert.equal(
        assessDeclaredCommitmentConditionalTerms(state, COMMIT_ID)
          .has_conditional_terms,
        true
      );
    });

    it("Availability / Capacity do not create Reservation", () => {
      let state = withResourceCommitment();
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
      state = applyPatch(
        state,
        upsert("resource_availability_declaration", AVAIL_ID, {
          id: AVAIL_ID,
          project_id: PROJECT_ID,
          resource_declaration_id: RES_A,
          status: "AVAILABLE",
          valid_from: TS,
          valid_until: null,
          declared_by: { kind: "human" },
          recorded_at: TS,
          note: null,
          created_at: TS,
          updated_at: TS,
        } satisfies ResourceAvailabilityDeclaration)
      );
      assert.equal(
        state.intervention_resource_reservation_declarations.length,
        0
      );
    });
  });

  describe("Relations / boundaries", () => {
    it("exposes reserver relations without Authority inference", () => {
      const state = withReservation(withResourceCommitment(), {
        reserver: ENTITY_COMMITTER,
      });
      assert.equal(
        assessResourceReserverCommitterRelation(
          ENTITY_COMMITTER,
          ENTITY_COMMITTER
        ),
        "RESOURCE_RESERVER_IS_RESOURCE_COMMITTER"
      );
      const ctx = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      assert.equal(
        ctx.reserver_committer_relation,
        "RESOURCE_RESERVER_IS_RESOURCE_COMMITTER"
      );
      assert.equal(
        assessResourceReserverHolderRelation(ENTITY_WAREHOUSE, ENTITY_WAREHOUSE),
        "RESOURCE_RESERVER_IS_RESOURCE_HOLDER"
      );
      assert.equal(
        assessResourceReserverCommitmentHolderRelation(
          ENTITY_HOLDER,
          ENTITY_HOLDER
        ),
        "RESOURCE_RESERVER_IS_COMMITMENT_HOLDER"
      );
      assert.ok(
        ctx.model_limitations.includes(
          "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED"
        )
      );
    });

    it("allows different reserver / committer / holder", () => {
      const state = withReservation(withResourceCommitment(), {
        reserver: ENTITY_RESERVER,
      });
      const ctx = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      assert.equal(
        ctx.reserver_committer_relation,
        "RESOURCE_RESERVER_DIFFERS_FROM_RESOURCE_COMMITTER"
      );
      assert.equal(
        ctx.reserver_resource_holder_relation,
        "RESOURCE_RESERVER_DIFFERS_FROM_RESOURCE_HOLDER"
      );
      assert.equal(
        ctx.reserver_commitment_holder_relation,
        "RESOURCE_RESERVER_DIFFERS_FROM_COMMITMENT_HOLDER"
      );
    });

    it("self-declared / third-party / non-entity sources", () => {
      const self = withReservation(withResourceCommitment(), {
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      assert.equal(
        assessResourceReservationSourceRelation(
          self.intervention_resource_reservation_declarations[0]!
        ),
        "SELF_DECLARED_BY_RESOURCE_RESERVER"
      );
      const third = withReservation(withResourceCommitment(), {
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      assert.equal(
        assessResourceReservationSourceRelation(
          third.intervention_resource_reservation_declarations[0]!
        ),
        "DECLARED_BY_OTHER_ENTITY"
      );
      const nonEntity = withReservation(withResourceCommitment(), {
        declaredBy: { kind: "human" },
      });
      assert.equal(
        assessResourceReservationSourceRelation(
          nonEntity.intervention_resource_reservation_declarations[0]!
        ),
        "DECLARED_BY_NON_ENTITY_SOURCE"
      );
    });

    it("FULL_RESOURCE does not equal Capacity; amounts do not imply sufficiency", () => {
      let state = withResourceCommitment(withCommitment(), {
        amount: { kind: "POINT", value: 10 },
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
        })
      );
      const beforeCap = structuredClone(state.resource_capacity_declarations);
      const beforeAvail = structuredClone(
        state.resource_availability_declarations
      );
      const beforeRc = structuredClone(
        state.intervention_resource_commitment_declarations
      );
      state = withReservation(state, {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
      });
      assert.deepEqual(state.resource_capacity_declarations, beforeCap);
      assert.deepEqual(state.resource_availability_declarations, beforeAvail);
      assert.deepEqual(
        state.intervention_resource_commitment_declarations,
        beforeRc
      );
      const ctx = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      assert.ok(!JSON.stringify(ctx).includes("free 90"));
      assert.ok(!JSON.stringify(ctx).includes("remaining"));
      assert.ok(!/"free_quantity"/.test(JSON.stringify(ctx)));
      assert.ok(
        ctx.model_limitations.includes("RESOURCE_FREE_QUANTITY_NOT_MODELED")
      );
      assert.ok(
        ctx.model_limitations.includes(
          "RESOURCE_RESERVATION_CAPACITY_SUFFICIENCY_NOT_MODELED"
        )
      );
    });

    it("allows Reservation larger than Commitment/Capacity and UNAVAILABLE coexistence", () => {
      let state = withResourceCommitment(withCommitment(), {
        amount: { kind: "POINT", value: 10 },
      });
      state = applyPatch(
        state,
        upsert("resource_capacity_declaration", CAP_ID, {
          id: CAP_ID,
          project_id: PROJECT_ID,
          resource_declaration_id: RES_A,
          capacity: { kind: "POINT", value: 10 },
          valid_from: TS,
          valid_until: null,
          declared_by: { kind: "human" },
          recorded_at: TS,
          note: null,
          created_at: TS,
          updated_at: TS,
        })
      );
      state = applyPatch(
        state,
        upsert("resource_availability_declaration", AVAIL_ID, {
          id: AVAIL_ID,
          project_id: PROJECT_ID,
          resource_declaration_id: RES_A,
          status: "UNAVAILABLE",
          valid_from: TS,
          valid_until: null,
          declared_by: { kind: "human" },
          recorded_at: TS,
          note: null,
          created_at: TS,
          updated_at: TS,
        })
      );
      state = withReservation(state, {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
      });
      assert.equal(
        state.intervention_resource_reservation_declarations.length,
        1
      );
      assert.ok(assessResource(state, RES_A, FROM).has_unavailable_declaration);
    });

    it("Requirement + Commitment + Reservation still not satisfied/feasible", () => {
      let state = withResourceCommitment(withCommitment(), {
        amount: { kind: "POINT", value: 10 },
      });
      state = applyPatch(
        state,
        upsert("intervention_resource_requirement_declaration", REQ_ID, {
          id: REQ_ID,
          project_id: PROJECT_ID,
          intervention_id: INT_A,
          resource_key: "ambulance",
          unit: "unit",
          resource_scope: { kind: "UNSCOPED" },
          required_amount: { kind: "POINT", value: 10 },
          valid_from: TS,
          valid_until: null,
          declared_by: { kind: "human" },
          recorded_at: TS,
          note: null,
          created_at: TS,
          updated_at: TS,
        } satisfies InterventionResourceRequirementDeclaration)
      );
      state = withReservation(state, {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
      });
      const ctx = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      assert.ok(!JSON.stringify(ctx).includes("SATISFIED"));
      assert.ok(!JSON.stringify(ctx).includes("feasible"));
      assert.ok(!JSON.stringify(ctx).includes("can_execute"));
    });
  });

  describe("Positions / divergences / overlap", () => {
    it("groups multi-source same event; rejects same-source duplicate", () => {
      let state = withReservation(withResourceCommitment(), {
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
      });
      state = withReservation(state, {
        id: RR_ID_2,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
      });
      const assessment = assessDeclaredInterventionResourceReservations(
        state,
        RC_ID
      );
      assert.equal(assessment.positions.length, 1);
      assert.equal(assessment.has_amount_divergence, true);
      assertThrowsPatch(
        () =>
          withReservation(withReservation(withResourceCommitment()), {
            id: RR_ID_2,
            declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
            scope: { kind: "FULL_RESOURCE" },
          }),
        /semantic duplicate/
      );
    });

    it("FULL_RESOURCE vs AMOUNT is scope divergence", () => {
      let state = withReservation(withResourceCommitment(), {
        scope: { kind: "FULL_RESOURCE" },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withReservation(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 1 } },
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const assessment = assessDeclaredInterventionResourceReservations(
        state,
        RC_ID
      );
      assert.equal(assessment.has_scope_divergence, true);
    });

    it("POINT vs RANGE amount divergence without reconciliation", () => {
      let state = withReservation(withResourceCommitment(), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withReservation(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "RANGE", min: 8, max: 12 } },
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      assert.equal(
        assessDeclaredInterventionResourceReservations(state, RC_ID)
          .has_amount_divergence,
        true
      );
    });

    it("window divergence and coverage helper", () => {
      let state = withReservation(withResourceCommitment(), {
        from: FROM,
        until: UNTIL,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withReservation(state, {
        id: RR_ID_2,
        from: FROM_2,
        until: UNTIL_2,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const assessment = assessDeclaredInterventionResourceReservations(
        state,
        RC_ID
      );
      assert.equal(assessment.has_window_divergence, true);
      assert.equal(
        doesResourceReservationWindowCoverAt(FROM, UNTIL, FROM),
        true
      );
      assert.equal(
        doesResourceReservationWindowCoverAt(FROM, UNTIL, UNTIL),
        false
      );
      const ctx = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      assert.equal(ctx.window_covers_at, true);
      assert.ok(!("is_active" in ctx));
      assert.ok(!("is_effective" in ctx));
    });

    it("equivalent Resource Commitment targets group into one Position", () => {
      let state = withResourceCommitment(withCommitment(), {
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withResourceCommitment(state, {
        id: RC_ID_2,
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      state = withReservation(state, {
        rcId: RC_ID,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withReservation(state, {
        id: RR_ID_2,
        rcId: RC_ID_2,
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      const assessment = assessDeclaredInterventionResourceReservations(
        state,
        RC_ID
      );
      assert.equal(assessment.positions.length, 1);
      assert.deepEqual(
        assessment.positions[0]!.targeted_resource_commitment_declaration_ids,
        [RC_ID, RC_ID_2]
      );
    });

    it("overlapping Reservations allowed without double-booking verdict", () => {
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
      state = withResourceCommitment(state, { commitmentId: COMMIT_ID });
      state = withResourceCommitment(state, {
        id: RC_ID_2,
        commitmentId: COMMIT_ID_B,
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      state = withReservation(state, {
        rcId: RC_ID,
        scope: { kind: "FULL_RESOURCE" },
      });
      state = withReservation(state, {
        id: RR_ID_2,
        rcId: RC_ID_2,
        scope: { kind: "FULL_RESOURCE" },
        declaredBy: { kind: "human", entity_id: ENTITY_RESERVER },
      });
      assert.equal(
        state.intervention_resource_reservation_declarations.length,
        2
      );
      const a = assessDeclaredInterventionResourceReservations(state, RC_ID);
      const b = assessDeclaredInterventionResourceReservations(state, RC_ID_2);
      assert.ok(!JSON.stringify({ a, b }).includes("DOUBLE_BOOKED"));
      assert.ok(!JSON.stringify({ a, b }).toLowerCase().includes("overallocat"));
    });
  });

  describe("Firewalls / append-only / determinism", () => {
    it("exposes model limitations; no Allocation/Consumption/Execution", () => {
      const state = withReservation();
      const ctx = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      assert.deepEqual(
        ctx.model_limitations,
        RESOURCE_RESERVATION_MODEL_LIMITATIONS
      );
      assert.deepEqual(RESOURCE_RESERVATION_MODEL_LIMITATIONS, [
        "RESOURCE_RESERVATION_ACCEPTANCE_NOT_MODELED",
        "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED",
        "RESOURCE_USE_PERMISSION_NOT_MODELED",
        "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED",
        "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
        "RESOURCE_FREE_QUANTITY_NOT_MODELED",
        "RESOURCE_REMAINING_QUANTITY_NOT_MODELED",
        "RESOURCE_RESERVATION_CAPACITY_SUFFICIENCY_NOT_MODELED",
        "RESOURCE_RESERVATION_CONFLICT_ADJUDICATION_NOT_MODELED",
        "RESOURCE_RESERVATION_PRECEDENCE_NOT_MODELED",
        "RESOURCE_ALLOCATION_NOT_MODELED",
        "RESOURCE_CONSUMPTION_NOT_MODELED",
        "RESOURCE_RESERVATION_RELEASE_NOT_MODELED",
        "COMMITMENT_TERM_PROPAGATION_NOT_MODELED",
        "EXECUTION_NOT_MODELED",
      ]);
      const history = getInterventionResourceReservationHistory(state, RC_ID);
      assert.ok(!("current" in history));
      assert.ok(!("effective" in history));
      assert.ok(!("latest" in history));
      assert.equal(state.reality_events.length, 0);
    });

    it("Intervention PERMIT does not create Resource-use Permission", () => {
      let state = withResourceCommitment();
      state = applyPatch(
        state,
        upsert("intervention_permission_declaration", PERM_ID, {
          id: PERM_ID,
          project_id: PROJECT_ID,
          actor_entity_id: ENTITY_RESERVER,
          intervention_id: INT_A,
          effect: "PERMIT",
          valid_from: TS,
          valid_until: null,
          declared_by: { kind: "human" },
          recorded_at: TS,
          note: null,
          created_at: TS,
          updated_at: TS,
        })
      );
      state = withReservation(state);
      const ctx = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      assert.ok(
        ctx.model_limitations.includes("RESOURCE_USE_PERMISSION_NOT_MODELED")
      );
    });

    it("does not mutate Commitment / Decision / Intent / ontic / epistemic / legacy", () => {
      const before = withResourceCommitment();
      const snapshot = {
        commitments: structuredClone(before.intervention_commitment_declarations),
        decisions: structuredClone(before.decisions),
        intents: structuredClone(before.intervention_intent_declarations),
        reality_states: structuredClone(before.reality_states),
        claims: structuredClone(before.claims),
        blockers: structuredClone(before.blockers),
        next_actions: structuredClone(before.next_actions),
        primary: before.current_state.primary_next_action_id,
      };
      const next = withReservation(before);
      assert.deepEqual(
        next.intervention_commitment_declarations,
        snapshot.commitments
      );
      assert.deepEqual(next.decisions, snapshot.decisions);
      assert.deepEqual(next.intervention_intent_declarations, snapshot.intents);
      assert.deepEqual(next.reality_states, snapshot.reality_states);
      assert.deepEqual(next.claims, snapshot.claims);
      assert.deepEqual(next.blockers, snapshot.blockers);
      assert.deepEqual(next.next_actions, snapshot.next_actions);
      assert.equal(next.current_state.primary_next_action_id, snapshot.primary);
    });

    it("rejects update and delete", () => {
      const state = withReservation();
      assertThrowsPatch(
        () =>
          applyPatch(
            state,
            upsert(
              "intervention_resource_reservation_declaration",
              RR_ID,
              rrPayload(RR_ID, { until: null })
            )
          ),
        /append-only/
      );
      assertThrowsPatch(
        () =>
          applyPatch(state, {
            schema_version: SCHEMA_VERSION,
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "delete",
                entity: "intervention_resource_reservation_declaration",
                entity_id: RR_ID,
              },
            ],
          }),
        /append-only/
      );
    });

    it("read assessment is deterministic and read-only", () => {
      const state = withReservation();
      const before = structuredClone(state);
      const a1 = assessDeclaredInterventionResourceReservations(state, RC_ID);
      const a2 = assessDeclaredInterventionResourceReservations(state, RC_ID);
      const c1 = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      const c2 = assessInterventionResourceReservationContext(
        state,
        RR_ID,
        FROM
      );
      const h1 = getInterventionResourceReservationHistory(state, RC_ID);
      const h2 = getInterventionResourceReservationHistory(state, RC_ID);
      assert.deepEqual(a1, a2);
      assert.deepEqual(c1, c2);
      assert.deepEqual(h1, h2);
      assert.deepEqual(state, before);
    });

    it("source modules avoid forbidden APIs and mutation imports", () => {
      const core = readFileSync(
        join(__dirnameTest, "../reality/resource-reservation-core.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(__dirnameTest, "../reality/resource-reservation-types.ts"),
        "utf8"
      );
      assert.ok(!FORBIDDEN_API.test(core));
      assert.ok(!FORBIDDEN_API.test(types));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
    });
  });
});
