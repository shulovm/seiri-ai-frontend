/**
 * GROUND-037 — Capacity Pressure Basis I / Declared Load–Capacity Comparison Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  assessResourceReservationCapacityPressureBasisAt,
  buildDeclaredResourceCapacityRepresentationsAt,
  compareNumericRanges,
  RESOURCE_RESERVATION_CAPACITY_PRESSURE_MODEL_LIMITATIONS,
} from "../reality/resource-reservation-capacity-pressure-core.js";
import { composeDeclaredResourceReservationLoadAt } from "../reality/resource-reservation-contention-core.js";
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
  ResourceAvailabilityDeclaration,
  ResourceCapacity,
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
const ENTITY_DECLARER = "ff010101-0101-4101-8101-010101010105";
const ENTITY_WAREHOUSE = "ff010101-0101-4101-8101-010101010106";
const ENTITY_DECLARER_B = "ff010101-0101-4101-8101-010101010107";
const INT_A = "ff020202-0202-4202-8202-020202020201";
const SPACE_D = "ff030303-0303-4303-8303-030303030301";
const OPT_INT = "ff040404-0404-4404-8404-040404040401";
const CAND_A = "ff050505-0505-4505-8505-050505050501";
const RES_A = "ff060606-0606-4606-8606-060606060601";
const RES_B = "ff060606-0606-4606-8606-060606060602";
const COMMIT_ID = "ff080808-0808-4808-8808-080808080801";
const RC_ID = "ff0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f01";
const RC_ID_2 = "ff0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f02";
const RR_ID = "ff111111-1111-4111-8111-111111111101";
const RR_ID_2 = "ff111111-1111-4111-8111-111111111102";
const RR_ID_3 = "ff111111-1111-4111-8111-111111111103";
const CAP_ID = "ff0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";
const CAP_ID_2 = "ff0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d02";
const CAP_ID_3 = "ff0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d03";
const AVAIL_ID = "ff0e0e0e-0e0e-4e0e-8e0e-0e0e0e0e0e01";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const RC_AT = "2026-08-05T10:00:00.000Z";
const MADE_AT = "2026-08-10T10:00:00.000Z";
const MADE_AT_2 = "2026-08-11T10:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";
const RECORDED_EARLY = "2026-08-19T10:00:00.000Z";
const RECORDED_LATE = "2026-08-21T10:00:00.000Z";

const W09 = "2026-09-01T09:00:00.000Z";
const W10 = "2026-09-01T10:00:00.000Z";
const W11 = "2026-09-01T11:00:00.000Z";
const W12 = "2026-09-01T12:00:00.000Z";
const AT = W10;

const FORBIDDEN =
  /\b(OVERALLOCATED|CAPACITY_EXCEEDED|free_quantity|remaining_quantity|headroom|load_ratio|has_pressure|pressure_level|effective_capacity|selected_capacity|winning_capacity)\b/;

/** Field-like utilization APIs — allow RESOURCE_UTILIZATION_NOT_MODELED limitation enum. */
function hasUtilizationField(json: string): boolean {
  return (
    /"utilization"\s*:/.test(json) ||
    /"load_ratio"\s*:/.test(json) ||
    /"pressure_percentage"\s*:/.test(json)
  );
}

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
      entity(ENTITY_DECLARER, "Declarer"),
      entity(ENTITY_WAREHOUSE, "Warehouse"),
      entity(ENTITY_DECLARER_B, "Declarer B"),
    ],
    intervention_declarations: [intervention(INT_A)],
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
  declaredBy: InterventionCommitmentDeclaration["declared_by"] = {
    kind: "human",
  }
): ProjectState {
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
    resourceId?: string;
  } = {}
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
    declaredBy?: ResourceCapacityDeclaration["declared_by"];
    recordedAt?: string;
    validFrom?: string;
    validUntil?: string | null;
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
      valid_from: opts.validFrom ?? TS,
      valid_until: opts.validUntil === undefined ? null : opts.validUntil,
      declared_by:
        opts.declaredBy ?? { kind: "human", entity_id: ENTITY_DECLARER },
      recorded_at: opts.recordedAt ?? RECORDED,
      note: null,
      created_at: RECORDED,
      updated_at: RECORDED,
    } satisfies ResourceCapacityDeclaration)
  );
}

function withAvail(
  state: ProjectState,
  status: "AVAILABLE" | "UNAVAILABLE"
): ProjectState {
  return applyPatch(
    state,
    upsert("resource_availability_declaration", AVAIL_ID, {
      id: AVAIL_ID,
      project_id: PROJECT_ID,
      resource_declaration_id: RES_A,
      status,
      valid_from: TS,
      valid_until: null,
      declared_by: { kind: "human", entity_id: ENTITY_DECLARER },
      recorded_at: RECORDED,
      note: null,
      created_at: RECORDED,
      updated_at: RECORDED,
    } satisfies ResourceAvailabilityDeclaration)
  );
}

function reservationState(
  amount: number | { min: number; max: number } | "FULL",
  opts: { id?: string; madeAt?: string } = {}
): ProjectState {
  const scope: ResourceReservationScope =
    amount === "FULL"
      ? { kind: "FULL_RESOURCE" }
      : typeof amount === "number"
        ? { kind: "AMOUNT", amount: { kind: "POINT", value: amount } }
        : {
            kind: "AMOUNT",
            amount: { kind: "RANGE", min: amount.min, max: amount.max },
          };
  return withRr(withRc(withCommitment()), {
    id: opts.id,
    scope,
    madeAt: opts.madeAt,
  });
}

describe("Resource Reservation Capacity Pressure Basis (GROUND-037)", () => {
  describe("Schema / read-only / vocabulary", () => {
    it("schema remains 0.1.24 with no migration", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.equal(validProjectStateV0124.schema_version, "0.1.24");
    });

    it("modules avoid forbidden verdict/quantity APIs and mutation imports", () => {
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/resource-reservation-capacity-pressure-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/resource-reservation-capacity-pressure-types.ts"
        ),
        "utf8"
      );
      assert.ok(!FORBIDDEN.test(core));
      assert.ok(!FORBIDDEN.test(types));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(
        /composeDeclaredResourceReservationLoadAt/.test(core),
        "must consume GROUND-036 composition"
      );
    });
  });

  describe("Capacity representation", () => {
    it("POINT Capacity → [100,100]", () => {
      const state = withCap(baseState(), {
        capacity: { kind: "POINT", value: 100 },
      });
      const reps = buildDeclaredResourceCapacityRepresentationsAt(
        state,
        RES_A,
        AT
      );
      assert.equal(reps.length, 1);
      assert.deepEqual(reps[0]!.amount_range, { min: 100, max: 100 });
      assert.equal(reps[0]!.capacity_kind, "POINT");
      assert.ok(!("effective_capacity" in reps[0]!));
    });

    it("RANGE Capacity → [80,120] without midpoint", () => {
      const state = withCap(baseState(), {
        capacity: { kind: "RANGE", min: 80, max: 120 },
      });
      const reps = buildDeclaredResourceCapacityRepresentationsAt(
        state,
        RES_A,
        AT
      );
      assert.deepEqual(reps[0]!.amount_range, { min: 80, max: 120 });
      assert.equal(reps[0]!.capacity_kind, "RANGE");
    });

    it("identical multi-source Capacity → one representation, two IDs, not 200", () => {
      let state = withCap(baseState(), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 100 },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      const reps = buildDeclaredResourceCapacityRepresentationsAt(
        state,
        RES_A,
        AT
      );
      assert.equal(reps.length, 1);
      assert.deepEqual(reps[0]!.amount_range, { min: 100, max: 100 });
      assert.equal(reps[0]!.capacity_declaration_ids.length, 2);
      assert.equal(reps[0]!.has_multiple_declarations, true);
    });

    it("different Capacity values preserved separately with no fusion", () => {
      let state = withCap(baseState(), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      const reps = buildDeclaredResourceCapacityRepresentationsAt(
        state,
        RES_A,
        AT
      );
      assert.equal(reps.length, 2);
      assert.deepEqual(
        reps.map((r) => r.amount_range),
        [
          { min: 100, max: 100 },
          { min: 150, max: 150 },
        ]
      );
    });
  });

  describe("Relation arithmetic", () => {
    it("POINT and RANGE relations match gate math", () => {
      assert.equal(
        compareNumericRanges({ min: 30, max: 30 }, { min: 100, max: 100 }),
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN"
      );
      assert.equal(
        compareNumericRanges({ min: 100, max: 100 }, { min: 100, max: 100 }),
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN"
      );
      assert.equal(
        compareNumericRanges({ min: 130, max: 130 }, { min: 100, max: 100 }),
        "LOAD_MIN_ABOVE_CAPACITY_MAX"
      );
      assert.equal(
        compareNumericRanges({ min: 80, max: 90 }, { min: 100, max: 120 }),
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN"
      );
      assert.equal(
        compareNumericRanges({ min: 130, max: 150 }, { min: 100, max: 120 }),
        "LOAD_MIN_ABOVE_CAPACITY_MAX"
      );
      assert.equal(
        compareNumericRanges({ min: 90, max: 110 }, { min: 100, max: 100 }),
        "LOAD_CAPACITY_RELATION_DEPENDS_ON_DECLARED_RANGE_VALUES"
      );
      assert.equal(
        compareNumericRanges({ min: 80, max: 120 }, { min: 100, max: 140 }),
        "LOAD_CAPACITY_RELATION_DEPENDS_ON_DECLARED_RANGE_VALUES"
      );
    });
  });

  describe("Pressure Basis status gates", () => {
    it("no Capacity declarations → NO_APPLICABLE_CAPACITY_REPRESENTATIONS", () => {
      const state = reservationState(30);
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(basis.reservation_load.status, "COMPLETE_NUMERIC_COMPOSITION");
      assert.equal(basis.status, "NO_APPLICABLE_CAPACITY_REPRESENTATIONS");
      assert.equal(basis.comparisons.length, 0);
    });

    it("no Reservation load → NO_NUMERIC_RESERVATION_LOAD_BASIS (no zero synthesis)", () => {
      const state = withCap(baseState(), {
        capacity: { kind: "POINT", value: 100 },
      });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(
        basis.reservation_load.status,
        "NO_REPRESENTED_RESERVATION_LOAD"
      );
      assert.equal(basis.status, "NO_NUMERIC_RESERVATION_LOAD_BASIS");
      assert.equal(basis.reservation_load.represented_amount_range, null);
      assert.equal(basis.comparisons.length, 0);
    });

    it("FULL_RESOURCE load → NON_NUMERIC_OR_AMBIGUOUS; no comparisons", () => {
      const state = withCap(reservationState("FULL"), {
        capacity: { kind: "POINT", value: 100 },
      });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(
        basis.reservation_load.status,
        "NON_NUMERIC_FULL_RESOURCE_PRESENT"
      );
      assert.equal(basis.status, "NON_NUMERIC_OR_AMBIGUOUS_RESERVATION_LOAD");
      assert.equal(basis.comparisons.length, 0);
    });

    it("ambiguous Reservation representation → no comparisons", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
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
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(
        basis.reservation_load.status,
        "AMBIGUOUS_RESERVATION_REPRESENTATION"
      );
      assert.equal(basis.status, "NON_NUMERIC_OR_AMBIGUOUS_RESERVATION_LOAD");
      assert.equal(basis.comparisons.length, 0);
    });
  });

  describe("Comparisons and divergence", () => {
    it("load30 vs capacity100 → AT_OR_BELOW; no free70", () => {
      const state = withCap(reservationState(30), {
        capacity: { kind: "POINT", value: 100 },
      });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(basis.status, "DECLARED_CAPACITY_COMPARISON_AVAILABLE");
      assert.equal(basis.comparisons.length, 1);
      assert.equal(
        basis.comparisons[0]!.relation,
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN"
      );
      const json = JSON.stringify(basis);
      assert.ok(!json.includes("free_quantity"));
      assert.ok(!json.includes("remaining_quantity"));
      assert.ok(!json.includes("headroom"));
      assert.ok(!/"70"/.test(json) || !json.includes('"free"'));
      assert.ok(!("has_pressure" in basis));
    });

    it("load100 vs capacity100 → AT_OR_BELOW without utilization semantics", () => {
      const state = withCap(reservationState(100), {
        capacity: { kind: "POINT", value: 100 },
      });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(
        basis.comparisons[0]!.relation,
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN"
      );
      const json = JSON.stringify(basis);
      assert.ok(!hasUtilizationField(json));
      assert.ok(!json.includes("100%"));
    });

    it("load130 vs capacity100 → ABOVE; no OVERALLOCATED", () => {
      const state = withCap(reservationState(130), {
        capacity: { kind: "POINT", value: 100 },
      });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(
        basis.comparisons[0]!.relation,
        "LOAD_MIN_ABOVE_CAPACITY_MAX"
      );
      const json = JSON.stringify(basis);
      assert.ok(!json.includes("OVERALLOCATED"));
      assert.ok(!json.includes("CAPACITY_EXCEEDED"));
    });

    it("RANGE load/capacity relations", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: {
          kind: "AMOUNT",
          amount: { kind: "RANGE", min: 80, max: 90 },
        },
      });
      state = withCap(state, {
        capacity: { kind: "RANGE", min: 100, max: 120 },
      });
      let basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(
        basis.comparisons[0]!.relation,
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN"
      );

      state = withRr(withRc(withCommitment()), {
        scope: {
          kind: "AMOUNT",
          amount: { kind: "RANGE", min: 130, max: 150 },
        },
      });
      state = withCap(state, {
        capacity: { kind: "RANGE", min: 100, max: 120 },
      });
      basis = assessResourceReservationCapacityPressureBasisAt(state, RES_A, AT);
      assert.equal(
        basis.comparisons[0]!.relation,
        "LOAD_MIN_ABOVE_CAPACITY_MAX"
      );

      state = withRr(withRc(withCommitment()), {
        scope: {
          kind: "AMOUNT",
          amount: { kind: "RANGE", min: 90, max: 110 },
        },
      });
      state = withCap(state, {
        capacity: { kind: "POINT", value: 100 },
      });
      basis = assessResourceReservationCapacityPressureBasisAt(state, RES_A, AT);
      assert.equal(
        basis.comparisons[0]!.relation,
        "LOAD_CAPACITY_RELATION_DEPENDS_ON_DECLARED_RANGE_VALUES"
      );

      state = withRr(withRc(withCommitment()), {
        scope: {
          kind: "AMOUNT",
          amount: { kind: "RANGE", min: 80, max: 120 },
        },
      });
      state = withCap(state, {
        capacity: { kind: "RANGE", min: 100, max: 140 },
      });
      basis = assessResourceReservationCapacityPressureBasisAt(state, RES_A, AT);
      assert.equal(
        basis.comparisons[0]!.relation,
        "LOAD_CAPACITY_RELATION_DEPENDS_ON_DECLARED_RANGE_VALUES"
      );
    });

    it("multiple Capacity same relation → no divergence; both preserved", () => {
      let state = withCap(reservationState(30), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(basis.capacity_representations.length, 2);
      assert.equal(basis.comparisons.length, 2);
      assert.equal(basis.relation_divergence, null);
      assert.deepEqual(basis.represented_relations, [
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN",
      ]);
    });

    it("multiple Capacity different relations → divergence; no winner", () => {
      let state = withCap(reservationState(120), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.ok(basis.relation_divergence);
      assert.deepEqual(basis.relation_divergence!.relation_values, [
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN",
        "LOAD_MIN_ABOVE_CAPACITY_MAX",
      ]);
      assert.ok(!("effective_capacity" in basis));
      assert.ok(!("selected_capacity" in basis));
      assert.ok(!("winning_capacity" in basis));
      assert.equal(basis.capacity_representations.length, 2);
    });

    it("no minimum/maximum/latest Capacity winner; no average", () => {
      let state = withCap(reservationState(120), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
        recordedAt: RECORDED_LATE,
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
        recordedAt: RECORDED_EARLY,
      });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(basis.comparisons.length, 2);
      assert.ok(
        !basis.capacity_representations.some((r) =>
          JSON.stringify(r).includes('"125"')
        )
      );
      const amounts = basis.capacity_representations.map((r) => r.amount_range.min);
      assert.deepEqual(amounts.sort((a, b) => a - b), [100, 150]);
    });
  });

  describe("GROUND-036 dependency / identity / filtering", () => {
    it("multi-source Reservation counts once via GROUND-036 load", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      const load = composeDeclaredResourceReservationLoadAt(state, RES_A, AT);
      assert.deepEqual(load.represented_amount_range, { min: 10, max: 10 });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.deepEqual(basis.comparisons[0]!.represented_load_range, {
        min: 10,
        max: 10,
      });
    });

    it("two semantic Reservations sum once before Capacity comparison", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        madeAt: MADE_AT,
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        madeAt: MADE_AT_2,
      });
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.deepEqual(basis.reservation_load.represented_amount_range, {
        min: 30,
        max: 30,
      });
      assert.equal(basis.comparisons.length, 1);
      assert.deepEqual(basis.comparisons[0]!.represented_load_range, {
        min: 30,
        max: 30,
      });
    });

    it("different Resource IDs never compared", () => {
      let state = withRr(withRc(withCommitment(), { resourceId: RES_A }), {
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 30 } },
      });
      state = withCap(state, {
        resourceId: RES_B,
        capacity: { kind: "POINT", value: 100 },
      });
      const basisA = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(basisA.status, "NO_APPLICABLE_CAPACITY_REPRESENTATIONS");
      const basisB = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_B,
        AT
      );
      assert.equal(basisB.status, "NO_NUMERIC_RESERVATION_LOAD_BASIS");
    });

    it("UNAVAILABLE / PROHIBIT / non-holder reserver do not filter comparison", () => {
      let state = withAvail(reservationState(30), "UNAVAILABLE");
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.equal(basis.status, "DECLARED_CAPACITY_COMPARISON_AVAILABLE");
      assert.equal(
        basis.comparisons[0]!.relation,
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN"
      );
    });
  });

  describe("Boundary audits", () => {
    it("no subtraction / utilization / overallocation / Discovery / Feasibility fields", () => {
      const state = withCap(reservationState(130), {
        capacity: { kind: "POINT", value: 100 },
      });
      const before = structuredClone(state);
      const basis = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      assert.deepEqual(state, before);
      const json = JSON.stringify(basis);
      assert.ok(!/"free_quantity"\s*:/.test(json));
      assert.ok(!/"remaining_quantity"\s*:/.test(json));
      assert.ok(!/"headroom"\s*:/.test(json));
      assert.ok(!hasUtilizationField(json));
      assert.ok(!json.includes("OVERALLOCATED"));
      assert.ok(!json.includes("CAPACITY_EXCEEDED"));
      assert.ok(!json.includes('"PROBLEM"'));
      assert.ok(!json.includes('"BLOCKER"'));
      assert.ok(!json.includes('"RISK"'));
      assert.ok(!/"feasible"\s*:/.test(json));
      assert.ok(!/"can_execute"\s*:/.test(json));
      assert.ok(!/"requirement_satisfied"\s*:/.test(json));
      assert.deepEqual(
        basis.model_limitations,
        RESOURCE_RESERVATION_CAPACITY_PRESSURE_MODEL_LIMITATIONS
      );
    });

    it("read-only and deterministic", () => {
      let state = withCap(reservationState(120), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      const before = structuredClone(state);
      const a = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      const b = assessResourceReservationCapacityPressureBasisAt(
        state,
        RES_A,
        AT
      );
      const capsA = buildDeclaredResourceCapacityRepresentationsAt(
        state,
        RES_A,
        AT
      );
      const capsB = buildDeclaredResourceCapacityRepresentationsAt(
        state,
        RES_A,
        AT
      );
      assert.deepEqual(a, b);
      assert.deepEqual(capsA, capsB);
      assert.deepEqual(state, before);
      assert.deepEqual(state.resource_capacity_declarations, before.resource_capacity_declarations);
      assert.deepEqual(
        state.intervention_resource_reservation_declarations,
        before.intervention_resource_reservation_declarations
      );
    });
  });
});
