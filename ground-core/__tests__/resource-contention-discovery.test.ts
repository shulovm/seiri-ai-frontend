/**
 * GROUND-038 — Resource Contention Discovery I / Structural Resource Findings
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  assessResourceContentionDiscovery,
  discoverProjectResourceContentionFindings,
  discoverResourceContentionFindings,
  RESOURCE_CONTENTION_DISCOVERY_MODEL_LIMITATIONS,
  RESOURCE_CONTENTION_FINDING_KIND_ORDER,
} from "../reality/resource-contention-discovery.js";
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
const ENTITY_RESERVER_B = "ff010101-0101-4101-8101-010101010104";
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
const AVAIL_ID = "ff0e0e0e-0e0e-4e0e-8e0e-0e0e0e0e0e01";

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
  /\b(priority|rank|severity|attention_score|urgency|recommended_action|OVERALLOCATED|CAPACITY_EXCEEDED|RESOURCE_SHORTAGE|DOUBLE_BOOKED|HEALTHY|SAFE)\b/;

const FORBIDDEN_KINDS = [
  "PROBLEM",
  "NEED",
  "BLOCKER",
  "RISK",
  "RESOURCE_CONFLICT",
  "DOUBLE_BOOKING",
  "OVERALLOCATION",
  "CAPACITY_EXCEEDED",
  "RESOURCE_SHORTAGE",
];

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

function withCap(
  state: ProjectState,
  opts: {
    id?: string;
    resourceId?: string;
    capacity: ResourceCapacity;
    declaredBy?: ResourceCapacityDeclaration["declared_by"];
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
      declared_by:
        opts.declaredBy ?? { kind: "human", entity_id: ENTITY_DECLARER },
      recorded_at: RECORDED,
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
  amount: number | "FULL",
  opts: { id?: string; madeAt?: string; from?: string; until?: string | null } = {}
): ProjectState {
  const scope: ResourceReservationScope =
    amount === "FULL"
      ? { kind: "FULL_RESOURCE" }
      : { kind: "AMOUNT", amount: { kind: "POINT", value: amount } };
  return withRr(withRc(withCommitment()), {
    id: opts.id,
    scope,
    madeAt: opts.madeAt,
    from: opts.from,
    until: opts.until,
  });
}

function assertNoVerdictKinds(findings: { kind: string }[]): void {
  for (const finding of findings) {
    assert.ok(!FORBIDDEN_KINDS.includes(finding.kind));
  }
}

function assertNoVerdictFields(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!FORBIDDEN_FIELDS.test(json));
  for (const kind of FORBIDDEN_KINDS) {
    assert.ok(!json.includes(`"${kind}"`));
  }
  assert.ok(!/"InquiryQuestion"/.test(json));
  assert.ok(!/"ObservationNeed"/.test(json));
  assert.ok(!/"DecisionSpace"/.test(json));
  assert.ok(!/"recommended_action"/.test(json));
  assert.ok(!/"attention_score"/.test(json));
}

describe("Resource Contention Discovery (GROUND-038)", () => {
  describe("Schema / architecture / read-only", () => {
    it("schema remains 0.1.24; modules are read-only and consume 036/037", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(__dirnameTest, "../reality/resource-contention-discovery.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/resource-contention-discovery-types.ts"
        ),
        "utf8"
      );
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(/assessResourceReservationContention/.test(core));
      assert.ok(
        /assessResourceReservationCapacityPressureBasisAt/.test(core)
      );
      assert.ok(/composeDeclaredResourceReservationLoadAt/.test(core));
      assert.ok(!/"priority"\s*:/.test(types));
      assert.ok(!/"severity"\s*:/.test(types));
      assert.ok(!/"attention_score"\s*:/.test(types));
      assert.deepEqual(RESOURCE_CONTENTION_FINDING_KIND_ORDER, [
        "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY",
        "RESOURCE_RESERVATION_OVERLAP_PRESENT",
        "RESOURCE_CAPACITY_BASIS_MISSING",
        "RESOURCE_CAPACITY_RELATION_DIVERGENCE",
        "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
      ]);
    });
  });

  describe("Overlap / ambiguity findings", () => {
    it("no findings when Resource exists without Reservations", () => {
      const findings = discoverResourceContentionFindings(
        baseState(),
        RES_A,
        AT
      );
      assert.deepEqual(findings, []);
      assertNoVerdictFields(findings);
    });

    it("single Reservation → no overlap Finding", () => {
      const findings = discoverResourceContentionFindings(
        reservationState(10),
        RES_A,
        AT
      );
      assert.ok(
        !findings.some((f) => f.kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT")
      );
    });

    it("two overlapping Reservations → one overlap Finding; no Conflict", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        madeAt: MADE_AT,
        from: W09,
        until: W12,
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        madeAt: MADE_AT_2,
        from: W11,
        until: W13,
      });
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      const overlaps = findings.filter(
        (f) => f.kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT"
      );
      assert.equal(overlaps.length, 1);
      assert.equal(overlaps[0]!.basis.kind, "RESERVATION_OVERLAP");
      if (overlaps[0]!.basis.kind === "RESERVATION_OVERLAP") {
        assert.equal(overlaps[0]!.basis.overlap_candidate_keys.length, 1);
      }
      assertNoVerdictKinds(findings);
      assertNoVerdictFields(findings);
    });

    it("multiple overlap pairs still one top-level overlap Finding", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W13,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W10,
        until: W13,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
      });
      state = withRr(state, {
        id: RR_ID_3,
        madeAt: MADE_AT_3,
        from: W11,
        until: W13,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 30 } },
      });
      const assessment = assessResourceContentionDiscovery(state, RES_A, AT);
      assert.ok(assessment.contention.overlap_candidates.length >= 2);
      const overlaps = assessment.findings.filter(
        (f) => f.kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT"
      );
      assert.equal(overlaps.length, 1);
      if (overlaps[0]!.basis.kind === "RESERVATION_OVERLAP") {
        assert.equal(
          overlaps[0]!.basis.overlap_candidate_keys.length,
          assessment.contention.overlap_candidates.length
        );
      }
    });

    it("boundary-touching windows → no overlap Finding", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
      });
      state = withRr(state, {
        id: RR_ID_2,
        madeAt: MADE_AT_2,
        from: W12,
        until: W13,
      });
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      assert.ok(
        !findings.some((f) => f.kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT")
      );
    });

    it("different Resource IDs → no cross-resource overlap Finding", () => {
      let state = withRr(withRc(withCommitment(), { resourceId: RES_A }), {
        id: RR_ID,
        madeAt: MADE_AT,
        from: W09,
        until: W12,
      });
      state = withRc(state, { id: RC_ID_2, resourceId: RES_B });
      state = withRr(state, {
        id: RR_ID_2,
        rcId: RC_ID_2,
        madeAt: MADE_AT_2,
        from: W09,
        until: W12,
      });
      assert.deepEqual(
        discoverResourceContentionFindings(state, RES_A, AT).filter(
          (f) => f.kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT"
        ),
        []
      );
      assert.deepEqual(
        discoverResourceContentionFindings(state, RES_B, AT).filter(
          (f) => f.kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT"
        ),
        []
      );
    });

    it("same semantic Reservation divergence → ambiguity, not self-overlap", () => {
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
        from: W10,
        until: W13,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      assert.ok(
        findings.some(
          (f) => f.kind === "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
        )
      );
      assert.ok(
        !findings.some((f) => f.kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT")
      );
    });

    it("scope / amount / window divergence each produce ambiguity Finding", () => {
      // scope
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        scope: { kind: "FULL_RESOURCE" },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      assert.ok(
        discoverResourceContentionFindings(state, RES_A, AT).some(
          (f) => f.kind === "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
        )
      );

      // amount only
      state = withRr(withRc(withCommitment()), {
        id: RR_ID,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 10 } },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withRr(state, {
        id: RR_ID_2,
        scope: { kind: "AMOUNT", amount: { kind: "POINT", value: 20 } },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      assert.ok(
        discoverResourceContentionFindings(state, RES_A, AT).some(
          (f) => f.kind === "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
        )
      );

      // window only
      state = withRr(withRc(withCommitment()), {
        id: RR_ID,
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
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      assert.ok(
        discoverResourceContentionFindings(state, RES_A, AT).some(
          (f) => f.kind === "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
        )
      );
    });

    it("multi-source identical Reservation → no ambiguity Finding", () => {
      let state = withRr(withRc(withCommitment()), {
        id: RR_ID,
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
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      assert.ok(
        !findings.some(
          (f) => f.kind === "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
        )
      );
    });
  });

  describe("Capacity findings", () => {
    it("complete numeric load + no Capacity → CAPACITY_BASIS_MISSING", () => {
      const findings = discoverResourceContentionFindings(
        reservationState(30),
        RES_A,
        AT
      );
      assert.deepEqual(
        findings.map((f) => f.kind),
        ["RESOURCE_CAPACITY_BASIS_MISSING"]
      );
    });

    it("no Reservation load + no Capacity → no Capacity missing Finding", () => {
      const findings = discoverResourceContentionFindings(
        baseState(),
        RES_A,
        AT
      );
      assert.ok(
        !findings.some((f) => f.kind === "RESOURCE_CAPACITY_BASIS_MISSING")
      );
    });

    it("FULL_RESOURCE + no Capacity → no Capacity missing Finding", () => {
      const findings = discoverResourceContentionFindings(
        reservationState("FULL"),
        RES_A,
        AT
      );
      assert.ok(
        !findings.some((f) => f.kind === "RESOURCE_CAPACITY_BASIS_MISSING")
      );
    });

    it("load30/100 and load100/100 → no ABOVE finding; no safe finding", () => {
      for (const amount of [30, 100]) {
        const state = withCap(reservationState(amount), {
          capacity: { kind: "POINT", value: 100 },
        });
        const findings = discoverResourceContentionFindings(state, RES_A, AT);
        assert.ok(
          !findings.some(
            (f) => f.kind === "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS"
          )
        );
        assert.ok(!findings.some((f) => /SAFE|SUFFICIENT|HEALTHY/.test(f.kind)));
        assert.equal(findings.length, 0);
      }
    });

    it("load130 vs Capacity100 → LOAD_ABOVE... only; no overallocation/PROBLEM", () => {
      const state = withCap(reservationState(130), {
        capacity: { kind: "POINT", value: 100 },
      });
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      assert.deepEqual(
        findings.map((f) => f.kind),
        ["RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS"]
      );
      assertNoVerdictFields(findings);
    });

    it("load120 vs Cap100+150 → ABOVE + DIVERGENCE; no winner", () => {
      let state = withCap(reservationState(120), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      const kinds = discoverResourceContentionFindings(state, RES_A, AT).map(
        (f) => f.kind
      );
      assert.deepEqual(kinds, [
        "RESOURCE_CAPACITY_RELATION_DIVERGENCE",
        "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
      ]);
    });

    it("load30 vs Cap100+150 → no divergence / no safe Finding", () => {
      let state = withCap(reservationState(30), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      assert.deepEqual(
        discoverResourceContentionFindings(state, RES_A, AT),
        []
      );
    });

    it("range-dependent relation alone → no Finding", () => {
      let state = withRr(withRc(withCommitment()), {
        scope: {
          kind: "AMOUNT",
          amount: { kind: "RANGE", min: 90, max: 110 },
        },
      });
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      assert.deepEqual(
        discoverResourceContentionFindings(state, RES_A, AT),
        []
      );
    });

    it("duplicate Capacity sources → no duplicate Finding", () => {
      let state = withCap(reservationState(130), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 100 },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER_B },
      });
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      assert.equal(
        findings.filter(
          (f) => f.kind === "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS"
        ).length,
        1
      );
    });

    it("all Capacity representations ABOVE → one LOAD_ABOVE Finding", () => {
      let state = withCap(reservationState(200), {
        id: CAP_ID,
        capacity: { kind: "POINT", value: 100 },
      });
      state = withCap(state, {
        id: CAP_ID_2,
        capacity: { kind: "POINT", value: 150 },
      });
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      assert.equal(
        findings.filter(
          (f) => f.kind === "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS"
        ).length,
        1
      );
      assert.ok(
        !findings.some(
          (f) => f.kind === "RESOURCE_CAPACITY_RELATION_DIVERGENCE"
        )
      );
    });
  });

  describe("Boundaries / project aggregation / determinism", () => {
    it("UNAVAILABLE does not suppress Findings", () => {
      let state = withAvail(reservationState(130), "UNAVAILABLE");
      state = withCap(state, { capacity: { kind: "POINT", value: 100 } });
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      assert.ok(
        findings.some(
          (f) => f.kind === "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS"
        )
      );
    });

    it("project aggregation is resource→kind ordered and deterministic", () => {
      let state = withRr(withRc(withCommitment(), { resourceId: RES_A }), {
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
      const a = discoverProjectResourceContentionFindings(state, AT);
      const b = discoverProjectResourceContentionFindings(state, AT);
      assert.deepEqual(a, b);
      assert.deepEqual(state, before);
      assert.ok(a.length >= 2);
      for (let i = 1; i < a.length; i++) {
        const prev = a[i - 1]!;
        const cur = a[i]!;
        if (prev.resource_declaration_id === cur.resource_declaration_id) {
          const prevOrder = RESOURCE_CONTENTION_FINDING_KIND_ORDER.indexOf(
            prev.kind
          );
          const curOrder = RESOURCE_CONTENTION_FINDING_KIND_ORDER.indexOf(
            cur.kind
          );
          assert.ok(prevOrder <= curOrder);
        } else {
          assert.ok(prev.resource_declaration_id < cur.resource_declaration_id);
        }
      }
      assert.deepEqual(
        assessResourceContentionDiscovery(state, RES_A, AT).model_limitations,
        RESOURCE_CONTENTION_DISCOVERY_MODEL_LIMITATIONS
      );
      assertNoVerdictFields(a);
    });

    it("one resource/kind/at = one Finding (dedupe)", () => {
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
      const findings = discoverResourceContentionFindings(state, RES_A, AT);
      const keys = findings.map((f) => f.key);
      assert.equal(keys.length, new Set(keys).size);
      assert.equal(
        findings.filter(
          (f) => f.kind === "RESOURCE_RESERVATION_OVERLAP_PRESENT"
        ).length,
        1
      );
    });
  });
});
