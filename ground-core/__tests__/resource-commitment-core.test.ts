/**
 * GROUND-034 — Resource Commitment Core I / Explicit Resource Undertaking Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { migrateProjectState } from "../migrate.js";
import { assessDeclaredCommitmentAcceptance } from "../reality/commitment-acceptance-core.js";
import { assessDeclaredCommitmentConditionalTerms } from "../reality/commitment-conditional-term-core.js";
import { assessDeclaredCommitmentTemporalTerms } from "../reality/commitment-temporal-term-core.js";
import { assessResource } from "../reality/resource-core.js";
import {
  assessDeclaredInterventionResourceCommitments,
  assessInterventionResourceCommitmentContext,
  assessResourceCommitmentSourceRelation,
  assessResourceCommitterCommitmentHolderRelation,
  assessResourceCommitterHolderRelation,
  getInterventionResourceCommitmentHistory,
  RESOURCE_COMMITMENT_MODEL_LIMITATIONS,
  resourceCommitmentAmountKey,
  resourceCommitmentSemanticKey,
} from "../reality/resource-commitment-core.js";
import { applyPatch } from "../state-engine.js";
import { PatchError } from "../errors.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionCommitmentDeclaration,
  InterventionDeclaration,
  InterventionResourceCommitmentDeclaration,
  InterventionResourceRequirementDeclaration,
  ProjectState,
  ResourceAvailabilityDeclaration,
  ResourceCapacityDeclaration,
  ResourceCommitmentAmount,
  ResourceDeclaration,
  RealityEntity,
  StatePatch,
} from "../types.js";
import {
  PROJECT_ID,
  validProjectStateV0122,
  validProjectStateV0124,
} from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_HOLDER = "fd010101-0101-4101-8101-010101010101";
const ENTITY_COMMITTER = "fd010101-0101-4101-8101-010101010102";
const ENTITY_DECLARER = "fd010101-0101-4101-8101-010101010103";
const ENTITY_WAREHOUSE = "fd010101-0101-4101-8101-010101010104";
const INT_A = "fd020202-0202-4202-8202-020202020201";
const INT_B = "fd020202-0202-4202-8202-020202020202";
const SPACE_D = "fd030303-0303-4303-8303-030303030301";
const OPT_INT = "fd040404-0404-4404-8404-040404040401";
const CAND_A = "fd050505-0505-4505-8505-050505050501";
const RES_A = "fd060606-0606-4606-8606-060606060601";
const RES_B = "fd060606-0606-4606-8606-060606060602";
const COMMIT_ID = "fd080808-0808-4808-8808-080808080801";
const COMMIT_ID_2 = "fd080808-0808-4808-8808-080808080802";
const COMMIT_ID_B = "fd080808-0808-4808-8808-080808080803";
const ACCEPT_ID = "fd090909-0909-4909-8909-090909090901";
const TERM_ID = "fd0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const COND_ID = "fd0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const REQ_ID = "fd0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const CAP_ID = "fd0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";
const AVAIL_ID = "fd0e0e0e-0e0e-4e0e-8e0e-0e0e0e0e0e01";
const RC_ID = "fd0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f01";
const RC_ID_2 = "fd0f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f02";
const PERM_ID = "fd101010-1010-4101-8101-101010101001";
const STATE_ID = "fd111111-1111-4111-8111-111111111111";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const RC_AT = "2026-08-05T10:00:00.000Z";
const RC_AT_2 = "2026-08-06T10:00:00.000Z";
const ACCEPTED_AT = "2026-08-01T12:00:00.000Z";
const DEADLINE = "2026-09-10T18:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";

const FORBIDDEN_API =
  /\b(reserved_from|reserved_until|reservation_status|exclusive|allocated_to|allocation_status|consumed_amount|used_amount|remaining_amount|free_amount|effective_resource_commitment|current_resource_commitment|binding_resource_commitment|RESOURCE_REQUIREMENT_SATISFIED)\b/;

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
  overrides: Partial<ResourceDeclaration> = {}
): ResourceDeclaration {
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
    ...overrides,
  };
}

function baseState(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_HOLDER, "Holder A"),
      entity(ENTITY_COMMITTER, "Committer B"),
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

function commitmentPayload(
  id: string,
  opts: {
    holder?: string;
    interventionId?: string;
    declaredBy?: InterventionCommitmentDeclaration["declared_by"];
  } = {}
): InterventionCommitmentDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    commitment_holder_entity_id: opts.holder ?? ENTITY_HOLDER,
    intervention_id: opts.interventionId ?? INT_A,
    basis: [],
    committed_at: COMMITTED_AT,
    valid_until: null,
    note: null,
    declared_by: opts.declaredBy ?? { kind: "human" },
    recorded_at: RECORDED,
    created_at: RECORDED,
    updated_at: RECORDED,
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

function withCommitment(
  opts: Parameters<typeof commitmentPayload>[1] = {}
): ProjectState {
  return applyPatch(
    baseState(),
    upsert(
      "intervention_commitment_declaration",
      COMMIT_ID,
      commitmentPayload(COMMIT_ID, opts)
    )
  );
}

function rcPayload(
  id: string,
  opts: {
    commitmentId?: string;
    resourceId?: string;
    committer?: string;
    amount?: ResourceCommitmentAmount | null;
    at?: string;
    declaredBy?: InterventionResourceCommitmentDeclaration["declared_by"];
    note?: string | null;
  } = {}
): InterventionResourceCommitmentDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    commitment_declaration_id: opts.commitmentId ?? COMMIT_ID,
    resource_declaration_id: opts.resourceId ?? RES_A,
    resource_committer_entity_id: opts.committer ?? ENTITY_COMMITTER,
    committed_amount: opts.amount === undefined ? null : opts.amount,
    resource_committed_at: opts.at ?? RC_AT,
    note: opts.note === undefined ? null : opts.note,
    declared_by:
      opts.declaredBy ?? { kind: "human", entity_id: ENTITY_DECLARER },
    recorded_at: RECORDED,
    created_at: RECORDED,
    updated_at: RECORDED,
  };
}

function withResourceCommitment(
  state: ProjectState = withCommitment(),
  opts: Parameters<typeof rcPayload>[1] & { id?: string } = {}
): ProjectState {
  const id = opts.id ?? RC_ID;
  return applyPatch(
    state,
    upsert("intervention_resource_commitment_declaration", id, rcPayload(id, opts))
  );
}

function assertThrowsPatch(fn: () => void, re: RegExp): void {
  assert.throws(fn, (err: unknown) => {
    assert.ok(err instanceof PatchError || err instanceof Error);
    assert.match(String(err), re);
    return true;
  });
}

describe("Resource Commitment (GROUND-034)", () => {
  describe("Migration / schema", () => {
    it("migrates 0.1.22 → 0.1.23 with empty Resource Commitment array", () => {
      const migrated = migrateProjectState(validProjectStateV0122);
      assert.equal(migrated.schema_version, "0.1.24");
      assert.deepEqual(migrated.intervention_resource_commitment_declarations, []);
    });

    it("does not backfill Resource Commitments", () => {
      const migrated = migrateProjectState(validProjectStateV0122);
      assert.equal(
        migrated.intervention_resource_commitment_declarations.length,
        0
      );
    });

    it("SCHEMA_VERSION is 0.1.23", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
    });
  });

  describe("Persistence", () => {
    it("persists Resource Commitment without amount", () => {
      const next = withResourceCommitment(withCommitment(), { amount: null });
      assert.equal(next.intervention_resource_commitment_declarations.length, 1);
      const decl = next.intervention_resource_commitment_declarations[0]!;
      assert.equal(decl.committed_amount, null);
      assert.notEqual(decl.committed_amount, 0);
    });

    it("persists POINT amount", () => {
      const next = withResourceCommitment(withCommitment(), {
        amount: { kind: "POINT", value: 10 },
      });
      assert.deepEqual(
        next.intervention_resource_commitment_declarations[0]?.committed_amount,
        { kind: "POINT", value: 10 }
      );
    });

    it("persists RANGE amount", () => {
      const next = withResourceCommitment(withCommitment(), {
        amount: { kind: "RANGE", min: 5, max: 10 },
      });
      assert.deepEqual(
        next.intervention_resource_commitment_declarations[0]?.committed_amount,
        { kind: "RANGE", min: 5, max: 10 }
      );
    });
  });

  describe("Referential / temporal / amount validation", () => {
    it("rejects unknown Commitment", () => {
      assertThrowsPatch(
        () =>
          applyPatch(
            baseState(),
            upsert(
              "intervention_resource_commitment_declaration",
              RC_ID,
              rcPayload(RC_ID)
            )
          ),
        /unknown commitment_declaration_id/
      );
    });

    it("rejects unknown Resource", () => {
      assertThrowsPatch(
        () =>
          withResourceCommitment(withCommitment(), {
            resourceId: "fd999999-9999-4999-8999-999999999999",
          }),
        /unknown resource_declaration_id/
      );
    });

    it("rejects unknown committer Entity", () => {
      assertThrowsPatch(
        () =>
          withResourceCommitment(withCommitment(), {
            committer: "fd999999-9999-4999-8999-999999999999",
          }),
        /unknown resource_committer_entity_id/
      );
    });

    it("rejects unknown declarer Entity", () => {
      assertThrowsPatch(
        () =>
          withResourceCommitment(withCommitment(), {
            declaredBy: {
              kind: "human",
              entity_id: "fd999999-9999-4999-8999-999999999999",
            },
          }),
        /declared_by.entity_id not found/
      );
    });

    it("rejects resource_committed_at before Commitment", () => {
      assertThrowsPatch(
        () =>
          withResourceCommitment(withCommitment(), {
            at: "2026-07-01T00:00:00.000Z",
          }),
        /resource_committed_at must be >= commitment.committed_at/
      );
    });

    it("rejects resource_committed_at after recorded_at", () => {
      assertThrowsPatch(
        () =>
          withResourceCommitment(withCommitment(), {
            at: "2026-08-21T00:00:00.000Z",
          }),
        /resource_committed_at must be <= recorded_at/
      );
    });

    it("rejects POINT <= 0", () => {
      assertThrowsPatch(
        () =>
          withResourceCommitment(withCommitment(), {
            amount: { kind: "POINT", value: 0 },
          }),
        /greater than 0/
      );
    });

    it("rejects invalid RANGE", () => {
      assertThrowsPatch(
        () =>
          withResourceCommitment(withCommitment(), {
            amount: { kind: "RANGE", min: 10, max: 5 },
          }),
        /max >= min/
      );
      assertThrowsPatch(
        () =>
          withResourceCommitment(withCommitment(), {
            amount: { kind: "RANGE", min: 0, max: 5 },
          }),
        /min > 0/
      );
    });
  });

  describe("No auto-inference", () => {
    it("Acceptance does not create Resource Commitment", () => {
      const state = applyPatch(
        withCommitment(),
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
      assert.equal(
        state.intervention_resource_commitment_declarations.length,
        0
      );
      assert.equal(
        assessDeclaredCommitmentAcceptance(state, COMMIT_ID).status,
        "ACCEPTANCE_DECLARED"
      );
    });

    it("Temporal Terms do not create Resource Commitment", () => {
      const state = applyPatch(
        withCommitment(),
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
      assert.equal(
        state.intervention_resource_commitment_declarations.length,
        0
      );
      assert.equal(
        assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID).has_temporal_terms,
        true
      );
    });

    it("Conditional Terms do not create Resource Commitment", () => {
      const state = applyPatch(
        withCommitment(),
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
        state.intervention_resource_commitment_declarations.length,
        0
      );
      assert.equal(
        assessDeclaredCommitmentConditionalTerms(state, COMMIT_ID)
          .has_conditional_terms,
        true
      );
    });

    it("Resource AVAILABLE / Capacity / Requirement do not create Resource Commitment", () => {
      let state = withCommitment();
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
      assert.equal(
        state.intervention_resource_commitment_declarations.length,
        0
      );
    });
  });

  describe("Source / holder relations", () => {
    it("self-declared by resource committer", () => {
      const state = withResourceCommitment(withCommitment(), {
        committer: ENTITY_COMMITTER,
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      const decl = state.intervention_resource_commitment_declarations[0]!;
      assert.equal(
        assessResourceCommitmentSourceRelation(decl),
        "SELF_DECLARED_BY_RESOURCE_COMMITTER"
      );
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.ok(
        !JSON.stringify(ctx).includes("RESOURCE_COMMITMENT_ACCEPTED")
      );
    });

    it("third-party report preserved", () => {
      const state = withResourceCommitment(withCommitment(), {
        committer: ENTITY_COMMITTER,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      assert.equal(
        assessResourceCommitmentSourceRelation(
          state.intervention_resource_commitment_declarations[0]!
        ),
        "DECLARED_BY_OTHER_ENTITY"
      );
    });

    it("committer == resource holder relation", () => {
      const state = withResourceCommitment(withCommitment(), {
        committer: ENTITY_WAREHOUSE,
      });
      assert.equal(
        assessResourceCommitterHolderRelation(
          ENTITY_WAREHOUSE,
          ENTITY_WAREHOUSE
        ),
        "RESOURCE_COMMITTER_IS_RESOURCE_HOLDER"
      );
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.equal(
        ctx.resource_holder_relation,
        "RESOURCE_COMMITTER_IS_RESOURCE_HOLDER"
      );
    });

    it("committer != resource holder allowed", () => {
      const state = withResourceCommitment(withCommitment(), {
        committer: ENTITY_COMMITTER,
      });
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.equal(
        ctx.resource_holder_relation,
        "RESOURCE_COMMITTER_DIFFERS_FROM_RESOURCE_HOLDER"
      );
    });

    it("committer vs Commitment holder relations", () => {
      assert.equal(
        assessResourceCommitterCommitmentHolderRelation(
          ENTITY_HOLDER,
          ENTITY_HOLDER
        ),
        "RESOURCE_COMMITTER_IS_COMMITMENT_HOLDER"
      );
      const state = withResourceCommitment(withCommitment(), {
        committer: ENTITY_COMMITTER,
      });
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.equal(
        ctx.commitment_holder_relation,
        "RESOURCE_COMMITTER_DIFFERS_FROM_COMMITMENT_HOLDER"
      );
    });
  });

  describe("Requirement relation / no satisfaction", () => {
    it("exact Requirement match without satisfaction", () => {
      let state = withCommitment();
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
        })
      );
      state = withResourceCommitment(state, {
        amount: { kind: "POINT", value: 10 },
      });
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.equal(ctx.requirement_relation.has_exact_requirement_match, true);
      assert.deepEqual(
        ctx.requirement_relation.matching_requirement_declaration_ids,
        [REQ_ID]
      );
      assert.ok(!JSON.stringify(ctx).includes("SATISFIED"));
      assert.ok(!JSON.stringify(ctx).includes("feasible"));
      assert.ok(
        ctx.model_limitations.includes(
          "RESOURCE_COMMITMENT_AMOUNT_SUFFICIENCY_NOT_MODELED"
        )
      );
    });

    it("no Requirement match allowed", () => {
      const state = withResourceCommitment();
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.equal(ctx.requirement_relation.has_exact_requirement_match, false);
      assert.ok(!JSON.stringify(ctx).toLowerCase().includes("unnecessary"));
    });
  });

  describe("Capacity / Availability boundaries", () => {
    it("Capacity + committed amount does not yield remaining/reserved", () => {
      let state = withCommitment();
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
      const before = structuredClone(
        state.resource_capacity_declarations
      );
      const beforeAvail = structuredClone(
        state.resource_availability_declarations
      );
      state = withResourceCommitment(state, {
        amount: { kind: "POINT", value: 10 },
      });
      assert.deepEqual(state.resource_capacity_declarations, before);
      assert.deepEqual(state.resource_availability_declarations, beforeAvail);
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.ok(!JSON.stringify(ctx).includes("remaining"));
      assert.ok(!JSON.stringify(ctx).includes("reserved"));
      assert.ok(
        ctx.model_limitations.includes("RESOURCE_RESERVATION_NOT_MODELED")
      );
      assert.ok(
        ctx.model_limitations.includes(
          "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
        )
      );
      assert.ok(
        ctx.model_limitations.includes("RESOURCE_FREE_QUANTITY_NOT_MODELED")
      );
    });

    it("UNAVAILABLE + Resource Commitment allowed", () => {
      let state = withCommitment();
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
      state = withResourceCommitment(state);
      const assessment = assessResource(state, RES_A, RC_AT);
      assert.ok(assessment.has_unavailable_declaration);
      assert.equal(
        state.intervention_resource_commitment_declarations.length,
        1
      );
    });

    it("committed amount above Capacity allowed", () => {
      let state = withCommitment();
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
      const next = withResourceCommitment(state, {
        amount: { kind: "POINT", value: 20 },
      });
      assert.equal(
        next.intervention_resource_commitment_declarations.length,
        1
      );
      const ctx = assessInterventionResourceCommitmentContext(
        next,
        RC_ID,
        RC_AT
      );
      assert.ok(!JSON.stringify(ctx).toLowerCase().includes("impossible"));
      assert.ok(!JSON.stringify(ctx).toLowerCase().includes("insufficient"));
    });
  });

  describe("Positions / amount divergence", () => {
    it("unspecified + POINT is not amount divergence", () => {
      let state = withResourceCommitment(withCommitment(), {
        amount: null,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withResourceCommitment(state, {
        id: RC_ID_2,
        amount: { kind: "POINT", value: 10 },
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      const assessment = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      assert.equal(assessment.positions.length, 1);
      assert.equal(assessment.positions[0]!.has_unspecified_amount, true);
      assert.deepEqual(assessment.positions[0]!.declared_amounts, [
        { kind: "POINT", value: 10 },
      ]);
      assert.equal(assessment.has_amount_divergence, false);
    });

    it("POINT 10 vs POINT 20 diverges without winner", () => {
      let state = withResourceCommitment(withCommitment(), {
        amount: { kind: "POINT", value: 10 },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withResourceCommitment(state, {
        id: RC_ID_2,
        amount: { kind: "POINT", value: 20 },
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      const assessment = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      assert.equal(assessment.has_amount_divergence, true);
      assert.deepEqual(
        assessment.amount_divergences[0]!.specified_amount_keys.sort(),
        ["POINT|10", "POINT|20"]
      );
    });

    it("POINT vs RANGE diverges without containment reconciliation", () => {
      let state = withResourceCommitment(withCommitment(), {
        amount: { kind: "POINT", value: 10 },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withResourceCommitment(state, {
        id: RC_ID_2,
        amount: { kind: "RANGE", min: 8, max: 12 },
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      const assessment = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      assert.equal(assessment.has_amount_divergence, true);
    });

    it("same-source semantic duplicate rejected even if amount differs", () => {
      const state = withResourceCommitment(withCommitment(), {
        amount: { kind: "POINT", value: 10 },
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      assertThrowsPatch(
        () =>
          withResourceCommitment(state, {
            id: RC_ID_2,
            amount: { kind: "POINT", value: 20 },
            declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
          }),
        /semantic duplicate/
      );
    });

    it("equivalent Commitment targets group into one Position", () => {
      let state = applyPatch(
        withCommitment({
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        }),
        upsert(
          "intervention_commitment_declaration",
          COMMIT_ID_2,
          commitmentPayload(COMMIT_ID_2, {
            declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
          })
        )
      );
      state = withResourceCommitment(state, {
        commitmentId: COMMIT_ID,
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      state = withResourceCommitment(state, {
        id: RC_ID_2,
        commitmentId: COMMIT_ID_2,
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      const assessment = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      assert.equal(assessment.positions.length, 1);
      assert.deepEqual(
        assessment.positions[0]!.targeted_commitment_declaration_ids,
        [COMMIT_ID, COMMIT_ID_2]
      );
    });

    it("distinct ResourceDeclaration IDs are not collapsed by key/unit/scope", () => {
      // Resource Core rejects overlapping holder/key/unit/scope pools at
      // persistence. GROUND-034 still treats ResourceDeclaration.id as the
      // committed Resource identity — no casual collapse in read grouping.
      const state = withCommitment();
      state.resource_declarations.push(resource(RES_B, ENTITY_WAREHOUSE));
      state.intervention_resource_commitment_declarations.push(
        rcPayload(RC_ID, {
          resourceId: RES_A,
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        }),
        rcPayload(RC_ID_2, {
          resourceId: RES_B,
          declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
        })
      );
      const assessment = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      assert.equal(assessment.positions.length, 2);
      assert.notEqual(
        assessment.positions[0]!.resource_declaration_id,
        assessment.positions[1]!.resource_declaration_id
      );
    });

    it("same Resource toward C1 and C2 allowed (no double-booking)", () => {
      let state = applyPatch(
        withCommitment(),
        upsert(
          "intervention_commitment_declaration",
          COMMIT_ID_B,
          commitmentPayload(COMMIT_ID_B, { interventionId: INT_B })
        )
      );
      state = withResourceCommitment(state, { commitmentId: COMMIT_ID });
      state = withResourceCommitment(state, {
        id: RC_ID_2,
        commitmentId: COMMIT_ID_B,
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      assert.equal(
        state.intervention_resource_commitment_declarations.length,
        2
      );
      const a = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      const b = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID_B
      );
      assert.equal(a.positions.length, 1);
      assert.equal(b.positions.length, 1);
      assert.ok(!JSON.stringify({ a, b }).toLowerCase().includes("double"));
    });

    it("same Resource at different times are separate events", () => {
      let state = withResourceCommitment(withCommitment(), { at: RC_AT });
      state = withResourceCommitment(state, {
        id: RC_ID_2,
        at: RC_AT_2,
        declaredBy: { kind: "human", entity_id: ENTITY_COMMITTER },
      });
      const assessment = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      assert.equal(assessment.positions.length, 2);
    });
  });

  describe("Term / Permission / firewall boundaries", () => {
    it("Temporal / Conditional Terms do not propagate", () => {
      let state = applyPatch(
        withCommitment(),
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
      state = withResourceCommitment(state);
      const decl = state.intervention_resource_commitment_declarations[0]!;
      assert.ok(!("valid_until" in decl));
      assert.ok(!("reserved_until" in decl));
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.ok(
        ctx.model_limitations.includes("COMMITMENT_TERM_PROPAGATION_NOT_MODELED")
      );
    });

    it("Intervention PERMIT does not grant Resource use Permission", () => {
      let state = withCommitment();
      state = applyPatch(
        state,
        upsert("intervention_permission_declaration", PERM_ID, {
          id: PERM_ID,
          project_id: PROJECT_ID,
          actor_entity_id: ENTITY_COMMITTER,
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
      state = withResourceCommitment(state);
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.ok(
        ctx.model_limitations.includes(
          "RESOURCE_ACCESS_PERMISSION_NOT_MODELED"
        )
      );
    });

    it("does not mutate Commitment / Acceptance / Decision / Intent", () => {
      const before = withCommitment();
      const beforeCommit = structuredClone(
        before.intervention_commitment_declarations
      );
      const beforeDecisions = structuredClone(before.decisions);
      const beforeIntent = structuredClone(
        before.intervention_intent_declarations
      );
      const next = withResourceCommitment(before);
      assert.deepEqual(
        next.intervention_commitment_declarations,
        beforeCommit
      );
      assert.deepEqual(next.decisions, beforeDecisions);
      assert.deepEqual(next.intervention_intent_declarations, beforeIntent);
    });

    it("Ontic / Epistemic / Discovery / legacy firewalls", () => {
      const before = withCommitment();
      const snapshot = {
        reality_states: structuredClone(before.reality_states),
        reality_events: structuredClone(before.reality_events),
        claims: structuredClone(before.claims),
        evidence: structuredClone(before.evidence),
        blockers: structuredClone(before.blockers),
        next_actions: structuredClone(before.next_actions),
        primary: before.current_state.primary_next_action_id,
      };
      const next = withResourceCommitment(before);
      assert.deepEqual(next.reality_states, snapshot.reality_states);
      assert.deepEqual(next.reality_events, snapshot.reality_events);
      assert.deepEqual(next.claims, snapshot.claims);
      assert.deepEqual(next.evidence, snapshot.evidence);
      assert.deepEqual(next.blockers, snapshot.blockers);
      assert.deepEqual(next.next_actions, snapshot.next_actions);
      assert.equal(next.current_state.primary_next_action_id, snapshot.primary);
      assert.equal(
        next.intervention_commitment_declarations.length,
        1
      );
      assert.equal(
        next.intervention_commitment_declarations[0]?.id,
        COMMIT_ID
      );
    });
  });

  describe("Append-only / deletion guards", () => {
    it("rejects update and delete", () => {
      const state = withResourceCommitment();
      assertThrowsPatch(
        () =>
          applyPatch(
            state,
            upsert(
              "intervention_resource_commitment_declaration",
              RC_ID,
              rcPayload(RC_ID, { note: "changed" })
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
                entity: "intervention_resource_commitment_declaration",
                entity_id: RC_ID,
              },
            ],
          }),
        /append-only/
      );
    });

    it("rejects Resource deletion when referenced", () => {
      const state = withResourceCommitment();
      assertThrowsPatch(
        () =>
          applyPatch(state, {
            schema_version: SCHEMA_VERSION,
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "delete",
                entity: "resource_declaration",
                entity_id: RES_A,
              },
            ],
          }),
        /intervention_resource_commitment_declaration/
      );
    });
  });

  describe("Read models / determinism / contract absence", () => {
    it("context exposes model limitations in fixed order", () => {
      const state = withResourceCommitment();
      const ctx = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      assert.deepEqual(
        ctx.model_limitations,
        RESOURCE_COMMITMENT_MODEL_LIMITATIONS
      );
      assert.deepEqual(
        RESOURCE_COMMITMENT_MODEL_LIMITATIONS,
        [
          "RESOURCE_COMMITMENT_ACCEPTANCE_NOT_MODELED",
          "RESOURCE_CONTROL_AUTHORITY_NOT_MODELED",
          "RESOURCE_ACCESS_PERMISSION_NOT_MODELED",
          "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
          "RESOURCE_FREE_QUANTITY_NOT_MODELED",
          "RESOURCE_COMMITMENT_AMOUNT_SUFFICIENCY_NOT_MODELED",
          "RESOURCE_RESERVATION_NOT_MODELED",
          "RESOURCE_ALLOCATION_NOT_MODELED",
          "RESOURCE_CONSUMPTION_NOT_MODELED",
          "RESOURCE_COMMITMENT_RELEASE_NOT_MODELED",
          "COMMITMENT_TERM_PROPAGATION_NOT_MODELED",
          "EXECUTION_NOT_MODELED",
        ]
      );
    });

    it("history has no current/effective semantics", () => {
      const state = withResourceCommitment();
      const history = getInterventionResourceCommitmentHistory(
        state,
        COMMIT_ID
      );
      assert.equal(history.has_declarations, true);
      assert.ok(!("current" in history));
      assert.ok(!("effective" in history));
      assert.ok(!("latest" in history));
    });

    it("read assessment is deterministic and read-only", () => {
      const state = withResourceCommitment(withCommitment(), {
        amount: { kind: "POINT", value: 10 },
      });
      const before = structuredClone(state);
      const a1 = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      const a2 = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      const c1 = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      const c2 = assessInterventionResourceCommitmentContext(
        state,
        RC_ID,
        RC_AT
      );
      const h1 = getInterventionResourceCommitmentHistory(state, COMMIT_ID);
      const h2 = getInterventionResourceCommitmentHistory(state, COMMIT_ID);
      assert.deepEqual(a1, a2);
      assert.deepEqual(c1, c2);
      assert.deepEqual(h1, h2);
      assert.deepEqual(state, before);
    });

    it("amount key helper is deterministic", () => {
      assert.equal(
        resourceCommitmentAmountKey({ kind: "POINT", value: 10 }),
        "POINT|10"
      );
      assert.equal(
        resourceCommitmentAmountKey({ kind: "RANGE", min: 5, max: 10 }),
        "RANGE|5|10"
      );
    });

    it("semantic key excludes amount", () => {
      const key = resourceCommitmentSemanticKey(
        "commitment|x",
        RES_A,
        ENTITY_COMMITTER,
        RC_AT
      );
      assert.ok(key.startsWith("resource-commitment|"));
      assert.ok(!key.includes("POINT"));
    });

    it("source modules avoid forbidden reservation/allocation APIs", () => {
      const core = readFileSync(
        join(__dirnameTest, "../reality/resource-commitment-core.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(__dirnameTest, "../reality/resource-commitment-types.ts"),
        "utf8"
      );
      assert.ok(!FORBIDDEN_API.test(core));
      assert.ok(!FORBIDDEN_API.test(types));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/from ["'].*state-engine/.test(types));
      assert.ok(!/from ["'].*file-store/.test(types));
      assert.ok(!/from ["'].*studio\//.test(types));
    });

    it("no progressive Commitment rank / no Execution fields", () => {
      const state = withResourceCommitment();
      const assessment = assessDeclaredInterventionResourceCommitments(
        state,
        COMMIT_ID
      );
      assert.ok(!("commitment_level" in assessment));
      assert.ok(!("score" in assessment));
      assert.ok(!("rank" in assessment));
      const decl = state.intervention_resource_commitment_declarations[0]!;
      assert.ok(!("action_id" in decl));
      assert.ok(!("execution_id" in decl));
      assert.equal(state.reality_events.length, 0);
    });
  });
});
