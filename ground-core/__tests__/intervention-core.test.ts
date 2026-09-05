import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessCapability,
  findDeclaredCapabilities,
} from "../reality/capability-core.js";
import {
  assessInterventionSpecification,
  findDeclaredInterventions,
  getApplicableInterventions,
  groupInterventionResourceRequirements,
  isInterventionDeclarationActiveAt,
} from "../reality/intervention-core.js";
import {
  assessResource,
  findDeclaredResources,
} from "../reality/resource-core.js";
import { applyPatch } from "../state-engine.js";
import type {
  CapabilityAvailabilityDeclaration,
  CapabilityDeclaration,
  CapabilityVerificationDeclaration,
  Evidence,
  EpistemicObservation,
  PatchEntity,
  ProjectState,
  RealityEntity,
  ResourceAvailabilityDeclaration,
  ResourceCapacityDeclaration,
  ResourceDeclaration,
  InterventionCapabilityRequirementDeclaration,
  InterventionDeclaration,
  InterventionResourceRequirementDeclaration,
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

const ENTITY_PIPE = "f3010101-0101-4101-8101-010101010101";
const ENTITY_TEAM = "f3010101-0101-4101-8101-010101010102";
const INT_A = "f3020202-0202-4202-8202-020202020201";
const CAP_REQ_A = "f3030303-0303-4303-8303-030303030301";
const CAP_REQ_B = "f3030303-0303-4303-8303-030303030302";
const RES_REQ_A = "f3040404-0404-4404-8404-040404040401";
const RES_REQ_B = "f3040404-0404-4404-8404-040404040402";
const CAP_A = "f3050505-0505-4505-8505-050505050501";
const VER_A = "f3060606-0606-4606-8606-060606060601";
const CAP_AVAIL = "f3070707-0707-4707-8707-070707070701";
const RES_A = "f3080808-0808-4808-8808-080808080801";
const CAPACITY_A = "f3090909-0909-4909-8909-090909090901";
const RES_AVAIL = "f30a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const EVIDENCE_A = "f30b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const EPOBS_A = "f30c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";

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
    kind: "asset",
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

function capReq(
  overrides: Partial<InterventionCapabilityRequirementDeclaration> = {}
): InterventionCapabilityRequirementDeclaration {
  return {
    id: CAP_REQ_A,
    project_id: PROJECT_ID,
    intervention_id: INT_A,
    capability_key: "repair_pipe",
    capability_scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
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

function resReq(
  overrides: Partial<InterventionResourceRequirementDeclaration> = {}
): InterventionResourceRequirementDeclaration {
  return {
    id: RES_REQ_A,
    project_id: PROJECT_ID,
    intervention_id: INT_A,
    resource_key: "repair_parts",
    unit: "unit",
    resource_scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
    required_amount: { kind: "POINT", value: 10 },
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

function baseProject(extras: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_PIPE, "pipe-A"),
      entity(ENTITY_TEAM, "repair-team", { kind: "organization" }),
    ],
    intervention_declarations: [],
    intervention_capability_requirement_declarations: [],
    intervention_resource_requirement_declarations: [],
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

describe("Intervention Core (GROUND-023)", () => {
  it("migrates 0.1.13 → 0.1.16 with empty permission collections", () => {
    assert.ok(validateProjectStateV0113(validProjectStateV0113).valid);
    const migrated = migrateProjectState(validProjectStateV0113);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.intervention_declarations, []);
    assert.deepEqual(migrated.intervention_capability_requirement_declarations, []);
    assert.deepEqual(migrated.intervention_resource_requirement_declarations, []);
    assert.deepEqual(migrated.intervention_permission_declarations, []);
    assert.deepEqual(migrated.decision_space_declarations, []);
    assert.deepEqual(migrated.decision_option_declarations, [])
    assert.deepEqual(migrated.decision_option_actor_candidate_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("persists InterventionDeclaration via StatePatch roundtrip", () => {
    const next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    assert.equal(next.intervention_declarations.length, 1);
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.intervention-tmp");
    try {
      saveProject(next, { storageDir: dir });
      const loaded = loadProject(PROJECT_ID, { storageDir: dir });
      assert.equal(loaded.intervention_declarations[0]?.intervention_key, "repair_pipe");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("legacy NextAction does not create Intervention and reverse", () => {
    const withNext = baseProject();
    assert.ok(withNext.next_actions.length >= 0);
    assert.equal(withNext.intervention_declarations.length, 0);
    const withInt = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    assert.deepEqual(withInt.next_actions, withNext.next_actions);
    assert.equal(
      withInt.current_state.primary_next_action_id,
      withNext.current_state.primary_next_action_id
    );
  });

  it("rejects empty key / unknown target / empty SUBJECT_STATE", () => {
    const project = baseProject();
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("intervention_declaration", INT_A, intervention({
            intervention_key: "",
          }))
        ),
      /intervention_key must be non-empty/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("intervention_declaration", INT_A, intervention({
            target_scope: {
              kind: "ENTITY",
              entity_id: "f3999999-9999-4999-8999-999999999999",
            },
          }))
        ),
      /missing RealityEntity/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("intervention_declaration", INT_A, intervention({
            target_scope: {
              kind: "SUBJECT_STATE",
              subject_id: ENTITY_PIPE,
              state_kind: "",
            },
          }))
        ),
      /non-empty state_kind/
    );
  });

  it("UNSCOPED is not wildcard; ENTITY does not imply SUBJECT_STATE; exact key", () => {
    const unscoped = applyPatch(
      baseProject(),
      patch(
        "intervention_declaration",
        INT_A,
        intervention({ target_scope: { kind: "UNSCOPED" } })
      )
    );
    assert.deepEqual(
      findDeclaredInterventions(unscoped, {
        interventionKey: "repair_pipe",
        targetScope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
        at: AT,
      }),
      []
    );
    const withEntity = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    assert.deepEqual(
      findDeclaredInterventions(withEntity, {
        interventionKey: "repair_pipe",
        targetScope: {
          kind: "SUBJECT_STATE",
          subject_id: ENTITY_PIPE,
          state_kind: "pressure",
        },
        at: AT,
      }),
      []
    );
    assert.deepEqual(
      findDeclaredInterventions(withEntity, {
        interventionKey: "repair",
        targetScope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
        at: AT,
      }),
      []
    );
  });

  it("enforces intervention temporal [valid_from, valid_until)", () => {
    assert.equal(
      isInterventionDeclarationActiveAt(
        intervention({ valid_from: FROM, valid_until: UNTIL_NOON }),
        AT
      ),
      true
    );
    assert.equal(
      isInterventionDeclarationActiveAt(
        intervention({ valid_from: FROM, valid_until: UNTIL_NOON }),
        UNTIL_NOON
      ),
      false
    );
  });

  it("contracts contain no actor/executor/assignee/owner/feasibility fields", () => {
    const next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    const json = JSON.stringify(assessInterventionSpecification(next, INT_A, AT));
    for (const forbidden of [
      "actor_entity_id",
      "executor",
      "assignee",
      "owner",
      "feasible",
      "can_execute",
      "ready",
      "Permission",
      "expected_effect",
      "performed_at",
      "STARTED",
      "COMPLETED",
    ]) {
      assert.equal(json.includes(forbidden), false, forbidden);
    }
  });

  it("persists Capability Requirement without CapabilityDeclaration", () => {
    let next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    next = applyPatch(
      next,
      patch("intervention_capability_requirement_declaration", CAP_REQ_A, capReq())
    );
    assert.equal(next.intervention_capability_requirement_declarations.length, 1);
    assert.equal(next.capability_declarations.length, 0);
    const a = assessInterventionSpecification(next, INT_A, AT);
    assert.equal(a.has_capability_requirements, true);
    assert.equal(JSON.stringify(a).includes("requirement_satisfied"), false);
    assert.equal(JSON.stringify(a).includes("feasible"), false);
  });

  it("persists Resource Requirement without ResourceDeclaration; validates amounts", () => {
    let next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    next = applyPatch(
      next,
      patch("intervention_resource_requirement_declaration", RES_REQ_A, resReq())
    );
    assert.equal(next.intervention_resource_requirement_declarations.length, 1);
    assert.equal(next.resource_declarations.length, 0);

    for (const bad of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      assert.throws(
        () =>
          applyPatch(
            applyPatch(baseProject(), patch("intervention_declaration", INT_A, intervention())),
            patch("intervention_resource_requirement_declaration", RES_REQ_A, resReq({
              required_amount: { kind: "POINT", value: bad },
            }))
          ),
        /greater than 0|finite/
      );
    }
    assert.throws(
      () =>
        applyPatch(
          applyPatch(baseProject(), patch("intervention_declaration", INT_A, intervention())),
          patch("intervention_resource_requirement_declaration", RES_REQ_A, resReq({
            required_amount: { kind: "RANGE", min: 0, max: 0 },
          }))
        ),
      /max > 0/
    );
    const rangeOk = applyPatch(
      applyPatch(baseProject(), patch("intervention_declaration", INT_A, intervention())),
      patch("intervention_resource_requirement_declaration", RES_REQ_A, resReq({
        required_amount: { kind: "RANGE", min: 0, max: 10 },
      }))
    );
    assert.equal(rangeOk.intervention_resource_requirement_declarations.length, 1);
  });

  it("target scope does not auto-populate requirement scopes", () => {
    let next = applyPatch(
      baseProject(),
      patch(
        "intervention_declaration",
        INT_A,
        intervention({ target_scope: { kind: "ENTITY", entity_id: ENTITY_PIPE } })
      )
    );
    next = applyPatch(
      next,
      patch(
        "intervention_capability_requirement_declaration",
        CAP_REQ_A,
        capReq({ capability_scope: { kind: "UNSCOPED" } })
      )
    );
    next = applyPatch(
      next,
      patch(
        "intervention_resource_requirement_declaration",
        RES_REQ_A,
        resReq({ resource_scope: { kind: "UNSCOPED" } })
      )
    );
    const a = assessInterventionSpecification(next, INT_A, AT);
    assert.equal(a.applicable_capability_requirements[0]?.capability_scope.kind, "UNSCOPED");
    assert.equal(a.applicable_resource_requirements[0]?.resource_scope.kind, "UNSCOPED");
  });

  it("Capability/Resource AVAILABLE do not satisfy requirements; no matching IDs", () => {
    let next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    next = applyPatch(
      next,
      patch("intervention_capability_requirement_declaration", CAP_REQ_A, capReq())
    );
    next = applyPatch(
      next,
      patch("intervention_resource_requirement_declaration", RES_REQ_A, resReq())
    );
    next = applyPatch(
      next,
      patch("capability_declaration", CAP_A, {
        id: CAP_A,
        project_id: PROJECT_ID,
        holder_entity_id: ENTITY_TEAM,
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
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "epistemic_observation",
            entity_id: EPOBS_A,
            payload: {
              id: EPOBS_A,
              kind: "note",
              content: "verified",
              provenance: { kind: "human", label: "ops" },
              subject_ids: [ENTITY_PIPE],
              observed_at: TS,
              recorded_at: TS,
            } satisfies Partial<EpistemicObservation>,
          },
          {
            op: "upsert",
            entity: "evidence",
            entity_id: EVIDENCE_A,
            payload: {
              id: EVIDENCE_A,
              kind: "observation_ref",
              observation_id: EPOBS_A,
              external_ref: null,
              summary: "ok",
              provenance: { kind: "human", label: "ops" },
              recorded_at: TS,
            } satisfies Partial<Evidence>,
          },
        ],
      } as StatePatch
    );
    next = applyPatch(
      next,
      patch("capability_verification_declaration", VER_A, {
        id: VER_A,
        project_id: PROJECT_ID,
        capability_declaration_id: CAP_A,
        evidence_ids: [EVIDENCE_A],
        verified_by: { kind: "human", label: "ops" },
        verified_at: FROM,
        valid_until: null,
        note: null,
        recorded_at: TS,
        created_at: TS,
        updated_at: TS,
      } satisfies CapabilityVerificationDeclaration)
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
        holder_entity_id: ENTITY_TEAM,
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
      patch("resource_capacity_declaration", CAPACITY_A, {
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
      } satisfies ResourceCapacityDeclaration)
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

    const a = assessInterventionSpecification(next, INT_A, AT);
    const json = JSON.stringify(a);
    assert.equal(json.includes("requirement_satisfied"), false);
    assert.equal(json.includes("feasible"), false);
    assert.equal(json.includes("candidate"), false);
    assert.equal(json.includes("sufficient"), false);
    assert.equal(json.includes("remaining"), false);
    assert.equal(assessCapability(next, CAP_A, AT).has_active_verification, true);
    assert.equal(assessResource(next, RES_A, AT).availability.status, "AVAILABLE_DECLARED");
  });

  it("requirement absence is not requires_none/feasible", () => {
    const next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    const a = assessInterventionSpecification(next, INT_A, AT);
    assert.equal(a.has_capability_requirements, false);
    assert.equal(a.has_resource_requirements, false);
    const json = JSON.stringify(a);
    assert.equal(json.includes("requires_none"), false);
    assert.equal(json.includes("feasible"), false);
    assert.equal(json.includes("ready"), false);
  });

  it("duplicate Capability requirement reject; multi-source preserve", () => {
    let next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    next = applyPatch(
      next,
      patch("intervention_capability_requirement_declaration", CAP_REQ_A, capReq())
    );
    assert.throws(
      () =>
        applyPatch(
          next,
          patch("intervention_capability_requirement_declaration", CAP_REQ_B, capReq({
            id: CAP_REQ_B,
          }))
        ),
      /duplicates overlapping/
    );
    next = applyPatch(
      next,
      patch("intervention_capability_requirement_declaration", CAP_REQ_B, capReq({
        id: CAP_REQ_B,
        declared_by: { kind: "system", label: "model-b" },
      }))
    );
    assert.equal(next.intervention_capability_requirement_declarations.length, 2);
  });

  it("Resource amount divergence preserved; different units separate", () => {
    let next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    next = applyPatch(
      next,
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "intervention_resource_requirement_declaration",
            entity_id: RES_REQ_A,
            payload: resReq({
              required_amount: { kind: "POINT", value: 10 },
              declared_by: { kind: "human", label: "a" },
            }),
          },
          {
            op: "upsert",
            entity: "intervention_resource_requirement_declaration",
            entity_id: RES_REQ_B,
            payload: resReq({
              id: RES_REQ_B,
              required_amount: { kind: "POINT", value: 20 },
              declared_by: { kind: "system", label: "b" },
            }),
          },
        ],
      } as StatePatch
    );
    const groups = groupInterventionResourceRequirements(next, INT_A, AT);
    assert.equal(groups.length, 1);
    assert.equal(groups[0]?.has_requirement_divergence, true);
    assert.equal(groups[0]?.required_amounts.length, 2);

    next = applyPatch(
      applyPatch(baseProject(), patch("intervention_declaration", INT_A, intervention())),
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "intervention_resource_requirement_declaration",
            entity_id: RES_REQ_A,
            payload: resReq({ unit: "liter", required_amount: { kind: "POINT", value: 1000 } }),
          },
          {
            op: "upsert",
            entity: "intervention_resource_requirement_declaration",
            entity_id: RES_REQ_B,
            payload: resReq({
              id: RES_REQ_B,
              unit: "m3",
              required_amount: { kind: "POINT", value: 1 },
              declared_by: { kind: "system", label: "b" },
            }),
          },
        ],
      } as StatePatch
    );
    assert.equal(
      groupInterventionResourceRequirements(next, INT_A, AT).length,
      2
    );
  });

  it("temporal basis mismatch without truncation", () => {
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
        "intervention_resource_requirement_declaration",
        RES_REQ_A,
        resReq({ valid_from: FROM, valid_until: null })
      )
    );
    const a = assessInterventionSpecification(next, INT_A, AT_AFTER);
    assert.equal(a.declaration_status, "INTERVENTION_DECLARATION_NOT_ACTIVE");
    assert.equal(a.has_temporal_basis_mismatch, true);
    assert.equal(a.has_resource_requirements, true);
  });

  it("firewalls: ontic/epistemic/capability/resource/governance/discovery unchanged; read-only; determinism", () => {
    const before = baseProject();
    const after = applyPatch(before, {
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
          entity: "intervention_capability_requirement_declaration",
          entity_id: CAP_REQ_A,
          payload: capReq(),
        },
        {
          op: "upsert",
          entity: "intervention_resource_requirement_declaration",
          entity_id: RES_REQ_A,
          payload: resReq(),
        },
      ],
    } as StatePatch);
    assert.deepEqual(after.reality_events, before.reality_events);
    assert.deepEqual(after.reality_states, before.reality_states);
    assert.deepEqual(after.claims, before.claims);
    assert.deepEqual(after.evidence, before.evidence);
    assert.deepEqual(after.capability_declarations, before.capability_declarations);
    assert.deepEqual(after.resource_declarations, before.resource_declarations);
    assert.deepEqual(after.authority_declarations, before.authority_declarations);
    assert.deepEqual(after.mandate_declarations, before.mandate_declarations);
    assert.deepEqual(after.impact_declarations, before.impact_declarations);
    assert.deepEqual(after.goals, before.goals);
    assert.deepEqual(after.next_actions, before.next_actions);
    assert.equal(after.reality_events.length, 0);

    const snapshot = structuredClone(after);
    const a1 = assessInterventionSpecification(after, INT_A, AT);
    const a2 = assessInterventionSpecification(after, INT_A, AT);
    assert.deepEqual(a1, a2);
    assert.deepEqual(after, snapshot);
    assert.deepEqual(
      getApplicableInterventions(after, AT),
      getApplicableInterventions(after, AT)
    );
    assert.deepEqual(
      findDeclaredCapabilities(after, {
        holderEntityId: ENTITY_TEAM,
        capabilityKey: "repair_pipe",
        scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
        at: AT,
      }),
      []
    );
    assert.deepEqual(
      findDeclaredResources(after, {
        holderEntityId: ENTITY_TEAM,
        resourceKey: "repair_parts",
        unit: "unit",
        scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
        at: AT,
      }),
      []
    );
  });

  it("deletion guard for Intervention with requirements", () => {
    let next = applyPatch(
      baseProject(),
      patch("intervention_declaration", INT_A, intervention())
    );
    next = applyPatch(
      next,
      patch("intervention_capability_requirement_declaration", CAP_REQ_A, capReq())
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
      /referenced by intervention_capability_requirement/
    );
  });
});
