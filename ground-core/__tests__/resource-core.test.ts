import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  findDeclaredCapabilities,
} from "../reality/capability-core.js";
import { assessDeclaredAuthority } from "../reality/governance-core.js";
import { assessAuthorityProvenance } from "../reality/governance-provenance.js";
import {
  assessResource,
  assessResourceAvailability,
  assessResourceCapacity,
  findDeclaredResources,
  getApplicableResourcesForHolder,
  isResourceDeclarationActiveAt,
  resourceCapacityKey,
} from "../reality/resource-core.js";
import { applyPatch } from "../state-engine.js";
import type {
  AuthorityDeclaration,
  AuthorityDelegationDeclaration,
  CapabilityAvailabilityDeclaration,
  CapabilityDeclaration,
  PatchEntity,
  ProjectState,
  RealityEntity,
  RealityState,
  ResourceAvailabilityDeclaration,
  ResourceCapacityDeclaration,
  ResourceDeclaration,
  StatePatch,
} from "../types.js";
import {
  validateProjectState,
  validateProjectStateV0112,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV0112,
  validProjectStateV0124,
} from "./fixtures.js";

const ENTITY_DISTRICT = "f2010101-0101-4101-8101-010101010101";
const ENTITY_UTILITY = "f2010101-0101-4101-8101-010101010102";
const ENTITY_TRUCK = "f2010101-0101-4101-8101-010101010103";
const ENTITY_ORG = "f2010101-0101-4101-8101-010101010104";
const RES_A = "f2020202-0202-4202-8202-020202020201";
const RES_B = "f2020202-0202-4202-8202-020202020202";
const CAPACITY_A = "f2030303-0303-4303-8303-030303030301";
const CAPACITY_B = "f2030303-0303-4303-8303-030303030302";
const AVAIL_A = "f2040404-0404-4404-8404-040404040401";
const AVAIL_B = "f2040404-0404-4404-8404-040404040402";
const CAP_A = "f2050505-0505-4505-8505-050505050501";
const AUTH_A = "f2060606-0606-4606-8606-060606060601";
const DEL_A = "f2070707-0707-4707-8707-070707070701";
const STATE_A = "f20c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";

const TS = "2026-08-24T10:00:00.000Z";
const FROM = "2026-08-24T10:00:00.000Z";
const UNTIL_NOON = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";
const AT_AFTER = "2026-08-24T13:00:00.000Z";

function entity(
  id: string,
  label: string,
  overrides: Partial<RealityEntity> = {}
): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "organization",
    label,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function resource(
  overrides: Partial<ResourceDeclaration> = {}
): ResourceDeclaration {
  return {
    id: RES_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_UTILITY,
    resource_key: "water",
    unit: "liter",
    scope: { kind: "ENTITY", entity_id: ENTITY_DISTRICT },
    resource_entity_id: null,
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function capacity(
  overrides: Partial<ResourceCapacityDeclaration> = {}
): ResourceCapacityDeclaration {
  return {
    id: CAPACITY_A,
    project_id: PROJECT_ID,
    resource_declaration_id: RES_A,
    capacity: { kind: "POINT", value: 100 },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function availability(
  overrides: Partial<ResourceAvailabilityDeclaration> = {}
): ResourceAvailabilityDeclaration {
  return {
    id: AVAIL_A,
    project_id: PROJECT_ID,
    resource_declaration_id: RES_A,
    status: "AVAILABLE",
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function baseProject(
  extras: Partial<ProjectState> = {}
): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_DISTRICT, "district-A", { kind: "place" }),
      entity(ENTITY_UTILITY, "utility-A"),
      entity(ENTITY_TRUCK, "truck-A", { kind: "asset" }),
      entity(ENTITY_ORG, "org-A"),
    ],
    resource_declarations: [],
    resource_capacity_declarations: [],
    resource_availability_declarations: [],
    capability_declarations: [],
    capability_verification_declarations: [],
    capability_availability_declarations: [],
    authority_declarations: [],
    authority_delegation_declarations: [],
    authority_contest_declarations: [],
    standing_declarations: [],
    mandate_declarations: [],
    ...extras,
    schema_version: "0.1.24",
  };
}

function patch(
  entityKind: PatchEntity,
  entityId: string,
  payload: object
): StatePatch {
  return {
    schema_version: "0.1.24",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [{ op: "upsert", entity: entityKind, entity_id: entityId, payload }],
  } as StatePatch;
}

describe("Resource Core (GROUND-022)", () => {
  it("migrates 0.1.12 → 0.1.16 with empty resource collections", () => {
    assert.ok(validateProjectStateV0112(validProjectStateV0112).valid);
    const migrated = migrateProjectState(validProjectStateV0112);
    assert.equal(migrated.schema_version, "0.1.25");
    assert.deepEqual(migrated.resource_declarations, []);
    assert.deepEqual(migrated.resource_capacity_declarations, []);
    assert.deepEqual(migrated.resource_availability_declarations, []);
    assert.deepEqual(migrated.intervention_declarations, []);
    assert.deepEqual(migrated.intervention_capability_requirement_declarations, []);
    assert.deepEqual(migrated.intervention_resource_requirement_declarations, []);
    assert.deepEqual(migrated.intervention_permission_declarations, []);
    assert.deepEqual(migrated.decision_space_declarations, []);
    assert.deepEqual(migrated.decision_option_declarations, [])
    assert.deepEqual(migrated.decision_option_actor_candidate_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("persists ResourceDeclaration via StatePatch roundtrip", () => {
    const next = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    assert.equal(next.resource_declarations.length, 1);
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.resource-tmp");
    try {
      saveProject(next, { storageDir: dir });
      const loaded = loadProject(PROJECT_ID, { storageDir: dir });
      assert.equal(loaded.resource_declarations[0]?.resource_key, "water");
      assert.equal(loaded.resource_declarations[0]?.unit, "liter");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("allows entity-backed and fungible resources", () => {
    const backed = applyPatch(
      baseProject(),
      patch(
        "resource_declaration",
        RES_A,
        resource({
          resource_key: "vehicle",
          unit: "vehicle",
          resource_entity_id: ENTITY_TRUCK,
          scope: { kind: "UNSCOPED" },
        })
      )
    );
    assert.equal(backed.resource_declarations[0]?.resource_entity_id, ENTITY_TRUCK);
    const fungible = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource({ resource_entity_id: null }))
    );
    assert.equal(fungible.resource_declarations[0]?.resource_entity_id, null);
  });

  it("rejects empty resource_key/unit, unknown holder/resource_entity/scope", () => {
    const project = baseProject();
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("resource_declaration", RES_A, resource({ resource_key: "" }))
        ),
      /resource_key must be non-empty/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("resource_declaration", RES_A, resource({ unit: "" }))
        ),
      /unit must be non-empty/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("resource_declaration", RES_A, resource({
            holder_entity_id: "f2999999-9999-4999-8999-999999999999",
          }))
        ),
      /missing holder/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("resource_declaration", RES_A, resource({
            resource_entity_id: "f2999999-9999-4999-8999-999999999999",
          }))
        ),
      /missing resource_entity_id/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("resource_declaration", RES_A, resource({
            scope: {
              kind: "ENTITY",
              entity_id: "f2999999-9999-4999-8999-999999999999",
            },
          }))
        ),
      /missing RealityEntity/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("resource_declaration", RES_A, resource({
            scope: {
              kind: "SUBJECT_STATE",
              subject_id: ENTITY_DISTRICT,
              state_kind: "",
            },
          }))
        ),
      /state_kind must be non-empty/
    );
  });

  it("UNSCOPED is not wildcard; ENTITY does not imply SUBJECT_STATE; unit exact", () => {
    const withUnscoped = applyPatch(
      baseProject(),
      patch(
        "resource_declaration",
        RES_A,
        resource({ scope: { kind: "UNSCOPED" } })
      )
    );
    assert.deepEqual(
      findDeclaredResources(withUnscoped, {
        holderEntityId: ENTITY_UTILITY,
        resourceKey: "water",
        unit: "liter",
        scope: { kind: "ENTITY", entity_id: ENTITY_DISTRICT },
        at: AT,
      }),
      []
    );

    const withEntity = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    assert.deepEqual(
      findDeclaredResources(withEntity, {
        holderEntityId: ENTITY_UTILITY,
        resourceKey: "water",
        unit: "liter",
        scope: {
          kind: "SUBJECT_STATE",
          subject_id: ENTITY_DISTRICT,
          state_kind: "pressure",
        },
        at: AT,
      }),
      []
    );
    assert.deepEqual(
      findDeclaredResources(withEntity, {
        holderEntityId: ENTITY_UTILITY,
        resourceKey: "water",
        unit: "m3",
        scope: { kind: "ENTITY", entity_id: ENTITY_DISTRICT },
        at: AT,
      }),
      []
    );
    assert.equal(
      findDeclaredResources(withEntity, {
        holderEntityId: ENTITY_UTILITY,
        resourceKey: "water",
        unit: "liter",
        scope: { kind: "ENTITY", entity_id: ENTITY_DISTRICT },
        at: AT,
      }).length,
      1
    );
  });

  it("enforces resource temporal [valid_from, valid_until)", () => {
    assert.equal(
      isResourceDeclarationActiveAt(
        resource({ valid_from: FROM, valid_until: UNTIL_NOON }),
        AT
      ),
      true
    );
    assert.equal(
      isResourceDeclarationActiveAt(
        resource({ valid_from: FROM, valid_until: UNTIL_NOON }),
        UNTIL_NOON
      ),
      false
    );
  });

  it("persists POINT and RANGE capacity; validates numbers", () => {
    let next = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    next = applyPatch(
      next,
      patch("resource_capacity_declaration", CAPACITY_A, capacity())
    );
    assert.equal(next.resource_capacity_declarations.length, 1);
    next = applyPatch(
      next,
      patch(
        "resource_capacity_declaration",
        CAPACITY_B,
        capacity({
          id: CAPACITY_B,
          capacity: { kind: "RANGE", min: 0, max: 10 },
          declared_by: { kind: "system", label: "model-b" },
        })
      )
    );
    assert.equal(next.resource_capacity_declarations.length, 2);

    for (const bad of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
      assert.throws(
        () =>
          applyPatch(
            applyPatch(baseProject(), patch("resource_declaration", RES_A, resource())),
            patch("resource_capacity_declaration", CAPACITY_A, capacity({
              capacity: { kind: "POINT", value: bad },
            }))
          ),
        /finite non-negative/
      );
    }
    assert.throws(
      () =>
        applyPatch(
          applyPatch(baseProject(), patch("resource_declaration", RES_A, resource())),
          patch("resource_capacity_declaration", CAPACITY_A, capacity({
            capacity: { kind: "RANGE", min: 10, max: 5 },
          }))
        ),
      /min <= max/
    );
  });

  it("capacity zero does not imply UNAVAILABLE; absence is NO_ACTIVE_CAPACITY", () => {
    let next = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    next = applyPatch(
      next,
      patch(
        "resource_capacity_declaration",
        CAPACITY_A,
        capacity({ capacity: { kind: "POINT", value: 0 } })
      )
    );
    const a = assessResource(next, RES_A, AT);
    assert.equal(a.capacity.status, "ACTIVE_CAPACITY_DECLARATIONS_PRESENT");
    assert.equal(a.availability.status, "NO_AVAILABILITY_DECLARATIONS");

    const none = assessResourceCapacity(
      applyPatch(baseProject(), patch("resource_declaration", RES_A, resource())),
      RES_A,
      AT
    );
    assert.equal(none.status, "NO_ACTIVE_CAPACITY_DECLARATIONS");
  });

  it("detects capacity divergence without fusion; POINT != RANGE[n,n]", () => {
    let next = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    next = applyPatch(
      next,
      patch("resource_capacity_declaration", CAPACITY_A, capacity({
        capacity: { kind: "POINT", value: 10 },
        declared_by: { kind: "human", label: "a" },
      }))
    );
    next = applyPatch(
      next,
      patch("resource_capacity_declaration", CAPACITY_B, capacity({
        id: CAPACITY_B,
        capacity: { kind: "POINT", value: 10 },
        declared_by: { kind: "system", label: "b" },
      }))
    );
    let a = assessResourceCapacity(next, RES_A, AT);
    assert.equal(a.has_multiple_capacity_declarations, true);
    assert.equal(a.has_capacity_divergence, false);

    next = applyPatch(
      applyPatch(baseProject(), patch("resource_declaration", RES_A, resource())),
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "resource_capacity_declaration",
            entity_id: CAPACITY_A,
            payload: capacity({
              capacity: { kind: "POINT", value: 10 },
              declared_by: { kind: "human", label: "a" },
            }),
          },
          {
            op: "upsert",
            entity: "resource_capacity_declaration",
            entity_id: CAPACITY_B,
            payload: capacity({
              id: CAPACITY_B,
              capacity: { kind: "POINT", value: 15 },
              declared_by: { kind: "system", label: "b" },
            }),
          },
        ],
      } as StatePatch
    );
    a = assessResourceCapacity(next, RES_A, AT);
    assert.equal(a.has_capacity_divergence, true);
    assert.equal(resourceCapacityKey({ kind: "POINT", value: 3 }), "POINT|3");
    assert.notEqual(
      resourceCapacityKey({ kind: "POINT", value: 3 }),
      resourceCapacityKey({ kind: "RANGE", min: 3, max: 3 })
    );
  });

  it("assesses availability: none / AVAILABLE / UNAVAILABLE / CONTESTED", () => {
    let next = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    assert.equal(
      assessResourceAvailability(next, RES_A, AT).status,
      "NO_AVAILABILITY_DECLARATIONS"
    );
    next = applyPatch(
      next,
      patch("resource_availability_declaration", AVAIL_A, availability())
    );
    assert.equal(
      assessResourceAvailability(next, RES_A, AT).status,
      "AVAILABLE_DECLARED"
    );
    next = applyPatch(
      applyPatch(baseProject(), patch("resource_declaration", RES_A, resource())),
      patch(
        "resource_availability_declaration",
        AVAIL_A,
        availability({ status: "UNAVAILABLE" })
      )
    );
    assert.equal(
      assessResourceAvailability(next, RES_A, AT).status,
      "UNAVAILABLE_DECLARED"
    );

    next = applyPatch(
      applyPatch(baseProject(), patch("resource_declaration", RES_A, resource())),
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "resource_availability_declaration",
            entity_id: AVAIL_A,
            payload: availability({
              status: "AVAILABLE",
              declared_by: { kind: "human", label: "a" },
            }),
          },
          {
            op: "upsert",
            entity: "resource_availability_declaration",
            entity_id: AVAIL_B,
            payload: availability({
              id: AVAIL_B,
              status: "UNAVAILABLE",
              declared_by: { kind: "system", label: "b" },
            }),
          },
        ],
      } as StatePatch
    );
    assert.equal(
      assessResourceAvailability(next, RES_A, AT).status,
      "CONTESTED_AVAILABILITY"
    );
  });

  it("allows same-source opposite availability; rejects same-status duplicates", () => {
    const next = applyPatch(
      applyPatch(baseProject(), patch("resource_declaration", RES_A, resource())),
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "resource_availability_declaration",
            entity_id: AVAIL_A,
            payload: availability({ status: "AVAILABLE" }),
          },
          {
            op: "upsert",
            entity: "resource_availability_declaration",
            entity_id: AVAIL_B,
            payload: availability({
              id: AVAIL_B,
              status: "UNAVAILABLE",
            }),
          },
        ],
      } as StatePatch
    );
    assert.equal(
      assessResourceAvailability(next, RES_A, AT).status,
      "CONTESTED_AVAILABILITY"
    );

    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "resource_availability_declaration",
              entity_id: "f2040404-0404-4404-8404-040404040499",
              payload: availability({
                id: "f2040404-0404-4404-8404-040404040499",
                status: "AVAILABLE",
              }),
            },
          ],
        } as StatePatch),
      /duplicates overlapping/
    );
  });

  it("AVAILABLE does not invent free_capacity; capacity does not invent AVAILABLE", () => {
    let next = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    next = applyPatch(
      next,
      patch("resource_capacity_declaration", CAPACITY_A, capacity())
    );
    next = applyPatch(
      next,
      patch("resource_availability_declaration", AVAIL_A, availability())
    );
    const a = assessResource(next, RES_A, AT);
    assert.equal(a.availability.status, "AVAILABLE_DECLARED");
    assert.equal(a.capacity.capacities[0]?.kind, "POINT");
    const json = JSON.stringify(a);
    assert.equal(json.includes("free_capacity"), false);
    assert.equal(json.includes("available_quantity"), false);
    assert.equal(json.includes("can_execute"), false);
    assert.equal(json.includes("effective_resource"), false);

    const capOnly = applyPatch(
      applyPatch(baseProject(), patch("resource_declaration", RES_A, resource())),
      patch("resource_capacity_declaration", CAPACITY_A, capacity())
    );
    assert.equal(
      assessResource(capOnly, RES_A, AT).availability.status,
      "NO_AVAILABILITY_DECLARATIONS"
    );
  });

  it("exposes temporal basis mismatch without truncating children", () => {
    let next = applyPatch(
      baseProject(),
      patch(
        "resource_declaration",
        RES_A,
        resource({ valid_from: FROM, valid_until: UNTIL_NOON })
      )
    );
    next = applyPatch(
      next,
      patch(
        "resource_availability_declaration",
        AVAIL_A,
        availability({ valid_from: FROM, valid_until: null })
      )
    );
    const c = assessResource(next, RES_A, AT_AFTER);
    assert.equal(c.has_active_resource_declaration, false);
    assert.equal(c.has_temporal_basis_mismatch, true);
    assert.equal(c.availability.status, "AVAILABLE_DECLARED");
  });

  it("Capability AVAILABLE does not create Resource; Resource does not create Capability", () => {
    let next = applyPatch(
      baseProject(),
      patch("capability_declaration", CAP_A, {
        id: CAP_A,
        project_id: PROJECT_ID,
        holder_entity_id: ENTITY_UTILITY,
        capability_key: "repair_pipe",
        scope: { kind: "ENTITY", entity_id: ENTITY_DISTRICT },
        description: null,
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        created_at: TS,
        updated_at: TS,
      } satisfies CapabilityDeclaration)
    );
    next = applyPatch(
      next,
      patch("capability_availability_declaration", AVAIL_A, {
        id: AVAIL_A,
        project_id: PROJECT_ID,
        capability_declaration_id: CAP_A,
        status: "AVAILABLE",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies CapabilityAvailabilityDeclaration)
    );
    assert.equal(next.resource_declarations.length, 0);
    assert.equal(
      getApplicableResourcesForHolder(next, ENTITY_UTILITY, AT).length,
      0
    );

    next = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    next = applyPatch(
      next,
      patch("resource_availability_declaration", AVAIL_A, availability())
    );
    assert.equal(next.capability_declarations.length, 0);
    assert.deepEqual(
      findDeclaredCapabilities(next, {
        holderEntityId: ENTITY_UTILITY,
        capabilityKey: "water",
        scope: { kind: "ENTITY", entity_id: ENTITY_DISTRICT },
        at: AT,
      }),
      []
    );
  });

  it("Authority/Mandate/Standing/Delegation do not create Resource and reverse", () => {
    const scope = {
      kind: "SUBJECT_STATE" as const,
      subject_id: ENTITY_DISTRICT,
      state_kind: "pressure",
    };
    const project = applyPatch(baseProject(), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: AUTH_A,
          payload: {
            id: AUTH_A,
            holder_entity_id: ENTITY_UTILITY,
            power: "ESTABLISH_REFERENCE",
            scope,
            valid_from: FROM,
            valid_until: null,
            declared_by: { kind: "organization", entity_id: ENTITY_ORG },
            recorded_at: TS,
          } satisfies Partial<AuthorityDeclaration>,
        },
        {
          op: "upsert",
          entity: "authority_delegation_declaration",
          entity_id: DEL_A,
          payload: {
            id: DEL_A,
            delegator_entity_id: ENTITY_UTILITY,
            delegatee_entity_id: ENTITY_ORG,
            power: "ESTABLISH_REFERENCE",
            scope,
            source_authority_declaration_ids: [AUTH_A],
            valid_from: FROM,
            valid_until: null,
            declared_by: { kind: "organization", entity_id: ENTITY_ORG },
            recorded_at: TS,
          } satisfies Partial<AuthorityDelegationDeclaration>,
        },
      ],
    } as StatePatch);
    assert.equal(project.resource_declarations.length, 0);
    assert.equal(
      getApplicableResourcesForHolder(project, ENTITY_UTILITY, AT).length,
      0
    );
    assert.equal(
      assessAuthorityProvenance(
        project,
        ENTITY_ORG,
        "ESTABLISH_REFERENCE",
        scope,
        AT
      ).has_delegated_authority_claim,
      true
    );

    const withResource = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    assert.equal(
      assessDeclaredAuthority(
        withResource,
        ENTITY_UTILITY,
        "ESTABLISH_REFERENCE",
        scope,
        AT
      ).status,
      "NO_DECLARED_AUTHORITY"
    );
    const json = JSON.stringify(assessResource(withResource, RES_A, AT));
    for (const forbidden of [
      "Permission",
      "Commitment",
      "reservation",
      "allocated_quantity",
      "remaining_quantity",
      "free_quantity",
      "can_execute",
    ]) {
      assert.equal(json.includes(forbidden), false, forbidden);
    }
  });

  it("backing Entity RealityState does not drive Resource Availability", () => {
    const state: RealityState = {
      id: STATE_A,
      project_id: PROJECT_ID,
      subject_id: ENTITY_TRUCK,
      kind: "condition",
      value: "operational",
      valid_from: FROM,
      valid_until: null,
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    let next = applyPatch(
      baseProject({ reality_states: [state] }),
      patch(
        "resource_declaration",
        RES_A,
        resource({
          resource_key: "vehicle",
          unit: "vehicle",
          resource_entity_id: ENTITY_TRUCK,
          scope: { kind: "UNSCOPED" },
        })
      )
    );
    assert.equal(
      assessResourceAvailability(next, RES_A, AT).status,
      "NO_AVAILABILITY_DECLARATIONS"
    );

    next = applyPatch(
      next,
      patch("resource_availability_declaration", AVAIL_A, availability())
    );
    assert.equal(next.reality_states[0]?.value, "operational");
  });

  it("no inventory counting from multiple Entities", () => {
    const project = baseProject({
      reality_entities: [
        entity(ENTITY_DISTRICT, "district-A", { kind: "place" }),
        entity(ENTITY_UTILITY, "utility-A"),
        entity(ENTITY_TRUCK, "truck-A", { kind: "asset" }),
        entity(ENTITY_ORG, "truck-B", { kind: "asset" }),
        entity("f2010101-0101-4101-8101-010101010105", "truck-C", {
          kind: "asset",
        }),
      ],
    });
    assert.equal(project.resource_declarations.length, 0);
    assert.equal(project.resource_capacity_declarations.length, 0);
  });

  it("deletion guards for Resource / Entity", () => {
    let next = applyPatch(
      baseProject(),
      patch("resource_declaration", RES_A, resource())
    );
    next = applyPatch(
      next,
      patch("resource_capacity_declaration", CAPACITY_A, capacity())
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "resource_declaration", entity_id: RES_A },
          ],
        } as StatePatch),
      /referenced by resource_capacity_declaration/
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "delete",
              entity: "reality_entity",
              entity_id: ENTITY_UTILITY,
            },
          ],
        } as StatePatch),
      /holder_entity_id/
    );
  });

  it("firewalls: ontic/epistemic/governance/capability/discovery/impact unchanged; read-only; determinism", () => {
    const before = baseProject();
    const after = applyPatch(
      before,
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "resource_declaration",
            entity_id: RES_A,
            payload: resource(),
          },
          {
            op: "upsert",
            entity: "resource_capacity_declaration",
            entity_id: CAPACITY_A,
            payload: capacity(),
          },
          {
            op: "upsert",
            entity: "resource_availability_declaration",
            entity_id: AVAIL_A,
            payload: availability(),
          },
        ],
      } as StatePatch
    );
    assert.deepEqual(after.reality_events, before.reality_events);
    assert.deepEqual(after.reality_states, before.reality_states);
    assert.deepEqual(after.claims, before.claims);
    assert.deepEqual(after.evidence, before.evidence);
    assert.deepEqual(after.authority_declarations, before.authority_declarations);
    assert.deepEqual(after.mandate_declarations, before.mandate_declarations);
    assert.deepEqual(after.capability_declarations, before.capability_declarations);
    assert.deepEqual(after.impact_declarations, before.impact_declarations);
    assert.deepEqual(after.goals, before.goals);

    const snapshot = structuredClone(after);
    const a1 = assessResource(after, RES_A, AT);
    const a2 = assessResource(after, RES_A, AT);
    assert.deepEqual(a1, a2);
    assert.deepEqual(after, snapshot);
    assert.deepEqual(
      getApplicableResourcesForHolder(after, ENTITY_UTILITY, AT),
      getApplicableResourcesForHolder(after, ENTITY_UTILITY, AT)
    );
  });
});
