import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessContestStandingContext,
} from "../reality/governance-provenance.js";
import {
  assessCapability,
} from "../reality/capability-core.js";
import {
  assessDeclaredInterventionPermission,
  assessInterventionPermissionGovernance,
  assessPermissionIssuerGovernance,
  isInterventionPermissionActiveAt,
} from "../reality/permission-core.js";
import { assessResource } from "../reality/resource-core.js";
import { applyPatch } from "../state-engine.js";
import type {
  AuthorityContestDeclaration,
  AuthorityDeclaration,
  AuthorityDelegationDeclaration,
  CapabilityAvailabilityDeclaration,
  CapabilityDeclaration,
  InterventionDeclaration,
  InterventionPermissionDeclaration,
  PatchEntity,
  ProjectState,
  RealityEntity,
  ResourceAvailabilityDeclaration,
  ResourceDeclaration,
  StatePatch,
} from "../types.js";
import {
  validateProjectState,
  validateProjectStateV0113,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV0113,
  validProjectStateV0124,
} from "./fixtures.js";

const ENTITY_PIPE = "f4010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR = "f4010101-0101-4101-8101-010101010102";
const ENTITY_G = "f4010101-0101-4101-8101-010101010103";
const ENTITY_B = "f4010101-0101-4101-8101-010101010104";
const ENTITY_CONTESTER = "f4010101-0101-4101-8101-010101010105";
const INT_A = "f4020202-0202-4202-8202-020202020201";
const INT_B = "f4020202-0202-4202-8202-020202020202";
const PERM_A = "f4030303-0303-4303-8303-030303030301";
const PERM_B = "f4030303-0303-4303-8303-030303030302";
const AUTH_A = "f4040404-0404-4404-8404-040404040401";
const DEL_A = "f4050505-0505-4505-8505-050505050501";
const CONTEST_A = "f4060606-0606-4606-8606-060606060601";
const CAP_A = "f4070707-0707-4707-8707-070707070701";
const CAP_AVAIL = "f4080808-0808-4808-8808-080808080801";
const RES_A = "f4090909-0909-4909-8909-090909090901";
const RES_AVAIL = "f40a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";

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

function intervention(
  overrides: Partial<InterventionDeclaration> = {}
): InterventionDeclaration {
  return {
    id: INT_A,
    project_id: PROJECT_ID,
    intervention_key: "repair_pipe",
    target_scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
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

function permission(
  overrides: Partial<InterventionPermissionDeclaration> = {}
): InterventionPermissionDeclaration {
  return {
    id: PERM_A,
    project_id: PROJECT_ID,
    actor_entity_id: ENTITY_ACTOR,
    intervention_id: INT_A,
    effect: "PERMIT",
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ENTITY_G },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function authority(
  overrides: Partial<AuthorityDeclaration> = {}
): AuthorityDeclaration {
  return {
    id: AUTH_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_G,
    power: "AUTHORIZE_INTERVENTION",
    scope: { kind: "INTERVENTION_DECLARATION", intervention_id: INT_A },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "charter" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function baseProject(extras: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_PIPE, "pipe-A", { kind: "asset" }),
      entity(ENTITY_ACTOR, "actor-A"),
      entity(ENTITY_G, "gov-G"),
      entity(ENTITY_B, "gov-B"),
      entity(ENTITY_CONTESTER, "contester"),
    ],
    intervention_declarations: [],
    intervention_capability_requirement_declarations: [],
    intervention_resource_requirement_declarations: [],
    intervention_permission_declarations: [],
    authority_declarations: [],
    authority_delegation_declarations: [],
    authority_contest_declarations: [],
    capability_declarations: [],
    capability_verification_declarations: [],
    capability_availability_declarations: [],
    resource_declarations: [],
    resource_capacity_declarations: [],
    resource_availability_declarations: [],
    ...extras,
    schema_version: "0.1.24",
  };
}

function withIntervention(
  extras: Partial<ProjectState> = {}
): ProjectState {
  return applyPatch(
    baseProject(extras),
    patch("intervention_declaration", INT_A, intervention())
  );
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

describe("Permission Core (GROUND-024)", () => {
  it("migrates 0.1.13 → 0.1.16 with empty permission array", () => {
    assert.ok(validateProjectStateV0113(validProjectStateV0113).valid);
    const migrated = migrateProjectState(validProjectStateV0113);
    assert.equal(migrated.schema_version, "0.1.25");
    assert.deepEqual(migrated.intervention_permission_declarations, []);
    assert.deepEqual(migrated.decision_space_declarations, []);
    assert.deepEqual(migrated.decision_option_declarations, []);
    assert.deepEqual(migrated.decision_option_actor_candidate_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("persists PERMIT and PROHIBIT via StatePatch roundtrip", () => {
    let next = withIntervention();
    next = applyPatch(
      next,
      patch("intervention_permission_declaration", PERM_A, permission())
    );
    assert.equal(next.intervention_permission_declarations[0]?.effect, "PERMIT");
    next = applyPatch(
      withIntervention(),
      patch(
        "intervention_permission_declaration",
        PERM_A,
        permission({ effect: "PROHIBIT" })
      )
    );
    assert.equal(next.intervention_permission_declarations[0]?.effect, "PROHIBIT");
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.permission-tmp");
    try {
      saveProject(next, { storageDir: dir });
      const loaded = loadProject(PROJECT_ID, { storageDir: dir });
      assert.equal(
        loaded.intervention_permission_declarations[0]?.effect,
        "PROHIBIT"
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects unknown actor / intervention / effect", () => {
    const project = withIntervention();
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("intervention_permission_declaration", PERM_A, permission({
            actor_entity_id: "f4999999-9999-4999-8999-999999999999",
          }))
        ),
      /missing RealityEntity/
    );
    assert.throws(
      () =>
        applyPatch(
          baseProject(),
          patch("intervention_permission_declaration", PERM_A, permission())
        ),
      /missing InterventionDeclaration/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("intervention_permission_declaration", PERM_A, {
            ...permission(),
            effect: "ALLOW",
          })
        ),
      /PERMIT or PROHIBIT/
    );
  });

  it("enforces Permission temporal [valid_from, valid_until)", () => {
    assert.equal(
      isInterventionPermissionActiveAt(
        permission({ valid_from: FROM, valid_until: UNTIL_NOON }),
        AT
      ),
      true
    );
    assert.equal(
      isInterventionPermissionActiveAt(
        permission({ valid_from: FROM, valid_until: UNTIL_NOON }),
        UNTIL_NOON
      ),
      false
    );
  });

  it("assesses none / PERMIT / PROHIBIT / CONTESTED", () => {
    const base = withIntervention();
    assert.equal(
      assessDeclaredInterventionPermission(base, ENTITY_ACTOR, INT_A, AT).status,
      "NO_PERMISSION_DECLARATIONS"
    );

    let next = applyPatch(
      base,
      patch("intervention_permission_declaration", PERM_A, permission())
    );
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "PERMIT_DECLARED"
    );

    next = applyPatch(
      base,
      patch(
        "intervention_permission_declaration",
        PERM_A,
        permission({ effect: "PROHIBIT" })
      )
    );
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "PROHIBIT_DECLARED"
    );

    next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "intervention_permission_declaration",
          entity_id: PERM_A,
          payload: permission({
            effect: "PERMIT",
            declared_by: { kind: "organization", entity_id: ENTITY_G },
          }),
        },
        {
          op: "upsert",
          entity: "intervention_permission_declaration",
          entity_id: PERM_B,
          payload: permission({
            id: PERM_B,
            effect: "PROHIBIT",
            declared_by: { kind: "organization", entity_id: ENTITY_B },
          }),
        },
      ],
    } as StatePatch);
    const a = assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT);
    assert.equal(a.status, "CONTESTED_PERMISSION");
    assert.equal(a.has_permission_conflict, true);
    assert.equal(JSON.stringify(a).includes("effective_permission"), false);
    assert.equal(JSON.stringify(a).includes("is_permitted"), false);
    assert.equal(JSON.stringify(a).includes("may_execute"), false);
  });

  it("allows same-source opposite effects; rejects same-effect duplicates", () => {
    const next = applyPatch(withIntervention(), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "intervention_permission_declaration",
          entity_id: PERM_A,
          payload: permission({ effect: "PERMIT" }),
        },
        {
          op: "upsert",
          entity: "intervention_permission_declaration",
          entity_id: PERM_B,
          payload: permission({ id: PERM_B, effect: "PROHIBIT" }),
        },
      ],
    } as StatePatch);
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "CONTESTED_PERMISSION"
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
              entity: "intervention_permission_declaration",
              entity_id: "f4030303-0303-4303-8303-030303030399",
              payload: permission({
                id: "f4030303-0303-4303-8303-030303030399",
                effect: "PERMIT",
              }),
            },
          ],
        } as StatePatch),
      /duplicates overlapping/
    );
  });

  it("exposes temporal mismatch when Intervention inactive", () => {
    let next = applyPatch(
      baseProject(),
      patch(
        "intervention_declaration",
        INT_A,
        intervention({ valid_from: FROM, valid_until: UNTIL_NOON })
      )
    );
    next = applyPatch(
      next,
      patch(
        "intervention_permission_declaration",
        PERM_A,
        permission({ valid_from: FROM, valid_until: null })
      )
    );
    const a = assessDeclaredInterventionPermission(
      next,
      ENTITY_ACTOR,
      INT_A,
      AT_AFTER
    );
    assert.equal(a.status, "PERMIT_DECLARED");
    assert.equal(a.intervention_active, false);
    assert.equal(a.has_temporal_basis_mismatch, true);
  });

  it("persists AUTHORIZE_INTERVENTION + INTERVENTION_DECLARATION; rejects bad pairs", () => {
    const next = applyPatch(
      withIntervention(),
      patch("authority_declaration", AUTH_A, authority())
    );
    assert.equal(next.authority_declarations[0]?.power, "AUTHORIZE_INTERVENTION");
    assert.throws(
      () =>
        applyPatch(
          withIntervention(),
          patch("authority_declaration", AUTH_A, authority({
            scope: {
              kind: "SUBJECT_STATE",
              subject_id: ENTITY_PIPE,
              state_kind: "pressure",
            },
          }))
        ),
      /incompatible with scope/
    );
    assert.throws(
      () =>
        applyPatch(
          withIntervention(),
          patch("authority_declaration", AUTH_A, authority({
            scope: { kind: "REALITY_OBJECTIVE", objective_id: INT_A },
          }))
        ),
      /incompatible with scope|missing RealityObjective/
    );
  });

  it("issuer direct Authority context without gating Permission", () => {
    let next = withIntervention();
    next = applyPatch(next, patch("authority_declaration", AUTH_A, authority()));
    next = applyPatch(
      next,
      patch("intervention_permission_declaration", PERM_A, permission())
    );
    const ctx = assessPermissionIssuerGovernance(next, PERM_A, AT);
    assert.equal(ctx.has_direct_declared_authority, true);
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "PERMIT_DECLARED"
    );

    const noAuth = applyPatch(
      withIntervention(),
      patch("intervention_permission_declaration", PERM_A, permission())
    );
    const noAuthCtx = assessPermissionIssuerGovernance(noAuth, PERM_A, AT);
    assert.equal(noAuthCtx.has_direct_declared_authority, false);
    assert.equal(noAuthCtx.has_delegated_authority_claim, false);
    assert.equal(
      assessDeclaredInterventionPermission(noAuth, ENTITY_ACTOR, INT_A, AT)
        .status,
      "PERMIT_DECLARED"
    );
  });

  it("non-Entity declarer Permission remains; Authority alone does not create Permission", () => {
    const next = applyPatch(
      withIntervention(),
      patch(
        "intervention_permission_declaration",
        PERM_A,
        permission({ declared_by: { kind: "document", label: "policy-doc" } })
      )
    );
    const ctx = assessPermissionIssuerGovernance(next, PERM_A, AT);
    assert.equal(ctx.declarer_entity_id, null);
    assert.equal(ctx.authority_provenance, null);

    const authOnly = applyPatch(
      withIntervention(),
      patch("authority_declaration", AUTH_A, authority())
    );
    assert.equal(
      assessDeclaredInterventionPermission(authOnly, ENTITY_ACTOR, INT_A, AT)
        .status,
      "NO_PERMISSION_DECLARATIONS"
    );
  });

  it("delegated issuer Authority provenance without collapsing to direct", () => {
    let next = withIntervention();
    next = applyPatch(
      next,
      patch("authority_declaration", AUTH_A, authority({
        holder_entity_id: ENTITY_G,
      }))
    );
    next = applyPatch(
      next,
      patch("authority_delegation_declaration", DEL_A, {
        id: DEL_A,
        project_id: PROJECT_ID,
        delegator_entity_id: ENTITY_G,
        delegatee_entity_id: ENTITY_B,
        power: "AUTHORIZE_INTERVENTION",
        scope: { kind: "INTERVENTION_DECLARATION", intervention_id: INT_A },
        source_authority_declaration_ids: [AUTH_A],
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "organization", entity_id: ENTITY_G },
        recorded_at: TS,
        created_at: TS,
        updated_at: TS,
      } satisfies AuthorityDelegationDeclaration)
    );
    next = applyPatch(
      next,
      patch(
        "intervention_permission_declaration",
        PERM_A,
        permission({ declared_by: { kind: "organization", entity_id: ENTITY_B } })
      )
    );
    const ctx = assessPermissionIssuerGovernance(next, PERM_A, AT);
    assert.equal(ctx.has_direct_declared_authority, false);
    assert.equal(ctx.has_delegated_authority_claim, true);
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "PERMIT_DECLARED"
    );
  });

  it("Authority does not resolve Permission conflict; contested Authority path visible", () => {
    let next = withIntervention();
    next = applyPatch(next, patch("authority_declaration", AUTH_A, authority()));
    next = applyPatch(next, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "intervention_permission_declaration",
          entity_id: PERM_A,
          payload: permission({
            effect: "PERMIT",
            declared_by: { kind: "organization", entity_id: ENTITY_G },
          }),
        },
        {
          op: "upsert",
          entity: "intervention_permission_declaration",
          entity_id: PERM_B,
          payload: permission({
            id: PERM_B,
            effect: "PROHIBIT",
            declared_by: { kind: "organization", entity_id: ENTITY_B },
          }),
        },
      ],
    } as StatePatch);
    const gov = assessInterventionPermissionGovernance(
      next,
      ENTITY_ACTOR,
      INT_A,
      AT
    );
    assert.equal(gov.permission.status, "CONTESTED_PERMISSION");
    assert.equal(gov.has_permission_from_direct_authority_declarer, true);
    assert.equal(
      gov.has_permission_from_declarer_without_declared_authority,
      true
    );
    assert.equal(JSON.stringify(gov).includes("effective_permission"), false);
    assert.equal(JSON.stringify(gov).includes("permission_winner"), false);

    next = applyPatch(
      next,
      patch("authority_contest_declaration", CONTEST_A, {
        id: CONTEST_A,
        project_id: PROJECT_ID,
        contesting_entity_id: ENTITY_CONTESTER,
        target: {
          kind: "AUTHORITY_DECLARATION",
          authority_declaration_id: AUTH_A,
        },
        note: null,
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "organization", entity_id: ENTITY_CONTESTER },
        recorded_at: TS,
        created_at: TS,
        updated_at: TS,
      } satisfies AuthorityContestDeclaration)
    );
    const standing = assessContestStandingContext(
      next,
      next.authority_contest_declarations[0]!,
      AT
    );
    assert.equal(standing.status, "STANDING_SCOPE_NOT_MAPPABLE");
    const ctx = assessPermissionIssuerGovernance(next, PERM_A, AT);
    assert.equal(ctx.has_contested_authority_path, true);
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "CONTESTED_PERMISSION"
    );
  });

  it("Capability/Resource/Mandate do not create Permission; reverse absences allowed", () => {
    let next = withIntervention();
    next = applyPatch(
      next,
      patch("capability_declaration", CAP_A, {
        id: CAP_A,
        project_id: PROJECT_ID,
        holder_entity_id: ENTITY_ACTOR,
        capability_key: "repair_pipe",
        scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
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
      patch("capability_availability_declaration", CAP_AVAIL, {
        id: CAP_AVAIL,
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
    next = applyPatch(
      next,
      patch("resource_declaration", RES_A, {
        id: RES_A,
        project_id: PROJECT_ID,
        holder_entity_id: ENTITY_ACTOR,
        resource_key: "repair_parts",
        unit: "unit",
        scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
        resource_entity_id: null,
        description: null,
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        created_at: TS,
        updated_at: TS,
      } satisfies ResourceDeclaration)
    );
    next = applyPatch(
      next,
      patch("resource_availability_declaration", RES_AVAIL, {
        id: RES_AVAIL,
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
      } satisfies ResourceAvailabilityDeclaration)
    );
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "NO_PERMISSION_DECLARATIONS"
    );
    assert.equal(assessCapability(next, CAP_A, AT).has_available_declaration, true);
    assert.equal(
      assessResource(next, RES_A, AT).availability.status,
      "AVAILABLE_DECLARED"
    );

    next = applyPatch(
      next,
      patch("intervention_permission_declaration", PERM_A, permission())
    );
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "PERMIT_DECLARED"
    );
  });

  it("Permission is Intervention-ID specific; no ACL / Decision / Intent / Commitment fields", () => {
    let next = applyPatch(baseProject(), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "intervention_declaration",
          entity_id: INT_A,
          payload: intervention(),
        },
        {
          op: "upsert",
          entity: "intervention_declaration",
          entity_id: INT_B,
          payload: intervention({
            id: INT_B,
            intervention_key: "repair_pipe",
            declared_by: { kind: "system", label: "alt" },
          }),
        },
        {
          op: "upsert",
          entity: "intervention_permission_declaration",
          entity_id: PERM_A,
          payload: permission({ intervention_id: INT_A }),
        },
      ],
    } as StatePatch);
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_A, AT).status,
      "PERMIT_DECLARED"
    );
    assert.equal(
      assessDeclaredInterventionPermission(next, ENTITY_ACTOR, INT_B, AT).status,
      "NO_PERMISSION_DECLARATIONS"
    );

    const before = structuredClone(next);
    const a1 = assessDeclaredInterventionPermission(
      next,
      ENTITY_ACTOR,
      INT_A,
      AT
    );
    const a2 = assessDeclaredInterventionPermission(
      next,
      ENTITY_ACTOR,
      INT_A,
      AT
    );
    assert.deepEqual(a1, a2);
    assert.deepEqual(next, before);

    const json = JSON.stringify(
      assessInterventionPermissionGovernance(next, ENTITY_ACTOR, INT_A, AT)
    );
    for (const forbidden of [
      "effective_permission",
      "is_permitted",
      "may_execute",
      "permission_winner",
      "resource_permission",
      "may_allocate_resource",
      "Intent",
      "Commitment",
      "executor",
      "assignee",
      "Decision",
      "can_execute",
    ]) {
      assert.equal(json.includes(forbidden), false, forbidden);
    }

    // PROHIBIT does not block unrelated StatePatch (software ACL firewall)
    next = applyPatch(
      next,
      patch(
        "intervention_permission_declaration",
        PERM_B,
        permission({ id: PERM_B, effect: "PROHIBIT", intervention_id: INT_B })
      )
    );
    next = applyPatch(
      next,
      patch("reality_entity", "f4010101-0101-4101-8101-010101010199", entity(
        "f4010101-0101-4101-8101-010101010199",
        "extra"
      ))
    );
    assert.ok(
      next.reality_entities.some(
        (e) => e.id === "f4010101-0101-4101-8101-010101010199"
      )
    );
    assert.deepEqual(next.reality_events, before.reality_events);
    assert.deepEqual(next.claims, before.claims);
    assert.deepEqual(next.capability_declarations.length, 0);
    assert.deepEqual(next.goals, before.goals);
    assert.deepEqual(next.next_actions, before.next_actions);
  });

  it("deletion guards for Intervention referenced by Permission/Authority scope", () => {
    let next = withIntervention();
    next = applyPatch(
      next,
      patch("intervention_permission_declaration", PERM_A, permission())
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "intervention_declaration", entity_id: INT_A },
          ],
        } as StatePatch),
      /intervention_permission_declaration/
    );

    next = applyPatch(
      withIntervention(),
      patch("authority_declaration", AUTH_A, authority())
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "intervention_declaration", entity_id: INT_A },
          ],
        } as StatePatch),
      /authority_declaration scope/
    );
  });
});
