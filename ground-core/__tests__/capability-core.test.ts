import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessCapability,
  assessCapabilityAvailability,
  assessCapabilityVerification,
  findDeclaredCapabilities,
  getApplicableCapabilitiesForHolder,
  isCapabilityDeclarationActiveAt,
} from "../reality/capability-core.js";
import { assessDeclaredAuthority } from "../reality/governance-core.js";
import { assessAuthorityProvenance } from "../reality/governance-provenance.js";
import { applyPatch } from "../state-engine.js";
import type {
  AuthorityDeclaration,
  AuthorityDelegationDeclaration,
  CapabilityAvailabilityDeclaration,
  CapabilityDeclaration,
  CapabilityVerificationDeclaration,
  Evidence,
  EpistemicObservation,
  MandateDeclaration,
  PatchEntity,
  ProjectState,
  RealityEntity,
  RealityObjective,
  ReferenceCondition,
  StandingDeclaration,
  StatePatch,
} from "../types.js";
import {
  validateProjectState,
  validateProjectStateV0110,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV0110,
  validProjectStateV0124,
} from "./fixtures.js";

const ENTITY_PIPE = "f1010101-0101-4101-8101-010101010101";
const ENTITY_TEAM = "f1010101-0101-4101-8101-010101010102";
const ORG_A = "f1010101-0101-4101-8101-010101010103";
const DECLARER_A = "f1010101-0101-4101-8101-010101010104";
const DECLARER_B = "f1010101-0101-4101-8101-010101010105";
const REF_DESIRED = "f6060606-0606-4606-8606-060606060701";
const OBJECTIVE_A = "f5050505-0505-4505-8505-050505050901";
const AUTHORITY_A = "f9090909-0909-4909-8909-090909090901";
const DELEGATION_A = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const MANDATE_A = "fb2b2b2b-2b2b-4b2b-8b2b-2b2b2b2b2b01";
const STANDING_A = "fc2c2c2c-2c2c-4c2c-8c2c-2c2c2c2c2c01";
const CAP_A = "fd3d3d3d-3d3d-4d3d-8d3d-3d3d3d3d3d01";
const CAP_B = "fd3d3d3d-3d3d-4d3d-8d3d-3d3d3d3d3d02";
const VER_A = "fe4e4e4e-4e4e-4e4e-8e4e-4e4e4e4e4e01";
const VER_B = "fe4e4e4e-4e4e-4e4e-8e4e-4e4e4e4e4e02";
const AVAIL_A = "ff5f5f5f-5f5f-4f5f-8f5f-5f5f5f5f5f01";
const AVAIL_B = "ff5f5f5f-5f5f-4f5f-8f5f-5f5f5f5f5f02";
const EPOBS_A = "f0101010-1010-4101-8101-0101010101a1";
const EVIDENCE_A = "f0202020-2020-4202-8202-0202020202a1";
const EVIDENCE_B = "f0202020-2020-4202-8202-0202020202a2";
const TS = "2026-08-24T12:00:00.000Z";
const FROM = "2026-08-24T00:00:00.000Z";
const UNTIL_NOON = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";
const AFTER_NOON = "2026-08-24T13:00:00.000Z";

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

function desiredRef(): ReferenceCondition {
  return {
    id: REF_DESIRED,
    project_id: PROJECT_ID,
    subject_id: ENTITY_PIPE,
    state_kind: "pressure",
    reference_kind: "DESIRED",
    criterion: {
      kind: "NUMERIC_RANGE",
      min: 75,
      max: 85,
      min_inclusive: true,
      max_inclusive: true,
    },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ORG_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function objective(): RealityObjective {
  return {
    id: OBJECTIVE_A,
    project_id: PROJECT_ID,
    kind: "STATE_TARGET",
    label: "restore",
    target_reference_condition_ids: [REF_DESIRED],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ORG_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function epObs(): EpistemicObservation {
  return {
    id: EPOBS_A,
    project_id: PROJECT_ID,
    kind: "sensor_reading",
    content: "pipe inspection note",
    provenance: { kind: "system", label: "sensor" },
    subject_ids: [ENTITY_PIPE],
    observed_at: TS,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function evidence(id: string = EVIDENCE_A): Evidence {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "observation_ref",
    observation_id: EPOBS_A,
    external_ref: null,
    summary: "pipe inspection",
    provenance: { kind: "system", label: "sensor" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function capability(
  overrides: Partial<CapabilityDeclaration> = {}
): CapabilityDeclaration {
  return {
    id: CAP_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_TEAM,
    capability_key: "repair_pipe",
    scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function verification(
  overrides: Partial<CapabilityVerificationDeclaration> = {}
): CapabilityVerificationDeclaration {
  return {
    id: VER_A,
    project_id: PROJECT_ID,
    capability_declaration_id: CAP_A,
    evidence_ids: [EVIDENCE_A],
    verified_by: { kind: "organization", entity_id: DECLARER_A },
    verified_at: FROM,
    valid_until: null,
    note: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function availability(
  overrides: Partial<CapabilityAvailabilityDeclaration> = {}
): CapabilityAvailabilityDeclaration {
  return {
    id: AVAIL_A,
    project_id: PROJECT_ID,
    capability_declaration_id: CAP_A,
    status: "AVAILABLE",
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_A },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function baseProject(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_PIPE, "pipe-A", { kind: "asset" }),
      entity(ENTITY_TEAM, "repair-team-A"),
      entity(ORG_A, "org-A"),
      entity(DECLARER_A, "declarer-A"),
      entity(DECLARER_B, "declarer-B"),
    ],
    reference_conditions: [desiredRef()],
    reality_objectives: [objective()],
    epistemic_observations: [epObs()],
    evidence: [evidence(EVIDENCE_A), evidence(EVIDENCE_B)],
    capability_declarations: [],
    capability_verification_declarations: [],
    capability_availability_declarations: [],
    ...overrides,
  };
}

function patch(
  entityName: PatchEntity,
  entityId: string,
  payload: object
): StatePatch {
  return {
    schema_version: "0.1.24",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [{ op: "upsert", entity: entityName, entity_id: entityId, payload }],
  } as StatePatch;
}

describe("Capability Core (GROUND-021)", () => {
  it("migrates 0.1.10 → 0.1.16 with empty capability collections", () => {
    assert.ok(validateProjectStateV0110(validProjectStateV0110).valid);
    const migrated = migrateProjectState(validProjectStateV0110);
    assert.equal(migrated.schema_version, "0.1.25");
    assert.deepEqual(migrated.capability_declarations, []);
    assert.deepEqual(migrated.capability_verification_declarations, []);
    assert.deepEqual(migrated.capability_availability_declarations, []);
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

  it("persists CapabilityDeclaration via StatePatch roundtrip", () => {
    const next = applyPatch(
      baseProject(),
      patch("capability_declaration", CAP_A, capability())
    );
    assert.equal(next.capability_declarations.length, 1);
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.capability-tmp");
    try {
      saveProject(next, { storageDir: dir });
      const loaded = loadProject(PROJECT_ID, { storageDir: dir });
      assert.equal(
        loaded.capability_declarations[0]?.capability_key,
        "repair_pipe"
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects empty capability_key, unknown holder, unknown scope entity", () => {
    const project = baseProject();
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("capability_declaration", CAP_A, capability({ capability_key: "" }))
        ),
      /capability_key must be non-empty/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("capability_declaration", CAP_A, capability({
            holder_entity_id: "00000000-0000-4000-8000-000000000099",
          }))
        ),
      /missing holder RealityEntity/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("capability_declaration", CAP_A, capability({
            scope: {
              kind: "ENTITY",
              entity_id: "00000000-0000-4000-8000-000000000099",
            },
          }))
        ),
      /missing RealityEntity/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("capability_declaration", CAP_A, capability({
            scope: {
              kind: "SUBJECT_STATE",
              subject_id: ENTITY_PIPE,
              state_kind: "   ",
            },
          }))
        ),
      /non-empty state_kind/
    );
  });

  it("UNSCOPED is not wildcard; ENTITY does not imply SUBJECT_STATE", () => {
    const project = applyPatch(
      baseProject(),
      patch(
        "capability_declaration",
        CAP_A,
        capability({ scope: { kind: "UNSCOPED" } })
      )
    );
    assert.equal(
      findDeclaredCapabilities(project, {
        holderEntityId: ENTITY_TEAM,
        capabilityKey: "repair_pipe",
        scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
        at: AT,
      }).length,
      0
    );

    const entityScoped = applyPatch(
      baseProject(),
      patch("capability_declaration", CAP_A, capability())
    );
    assert.equal(
      findDeclaredCapabilities(entityScoped, {
        holderEntityId: ENTITY_TEAM,
        capabilityKey: "repair_pipe",
        scope: {
          kind: "SUBJECT_STATE",
          subject_id: ENTITY_PIPE,
          state_kind: "pressure",
        },
        at: AT,
      }).length,
      0
    );
  });

  it("enforces capability temporal [valid_from, valid_until)", () => {
    assert.equal(
      isCapabilityDeclarationActiveAt(
        capability({ valid_from: FROM, valid_until: UNTIL_NOON }),
        AT
      ),
      true
    );
    assert.equal(
      isCapabilityDeclarationActiveAt(
        capability({ valid_from: FROM, valid_until: UNTIL_NOON }),
        UNTIL_NOON
      ),
      false
    );
  });

  it("persists verification with Evidence; rejects empty/unknown evidence", () => {
    const withCap = applyPatch(
      baseProject(),
      patch("capability_declaration", CAP_A, capability())
    );
    const next = applyPatch(
      withCap,
      patch("capability_verification_declaration", VER_A, verification())
    );
    assert.equal(next.capability_verification_declarations.length, 1);
    assert.throws(
      () =>
        applyPatch(
          withCap,
          patch("capability_verification_declaration", VER_A, verification({
            evidence_ids: [],
          }))
        ),
      /non-empty evidence_ids/
    );
    assert.throws(
      () =>
        applyPatch(
          withCap,
          patch("capability_verification_declaration", VER_A, verification({
            evidence_ids: ["00000000-0000-4000-8000-000000000099"],
          }))
        ),
      /missing Evidence/
    );
  });

  it("assesses active and expired verification; multiple verifiers no score", () => {
    const project = applyPatch(
      applyPatch(
        baseProject(),
        patch("capability_declaration", CAP_A, capability())
      ),
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "capability_verification_declaration",
            entity_id: VER_A,
            payload: verification({
              verified_at: FROM,
              valid_until: UNTIL_NOON,
            }),
          },
          {
            op: "upsert",
            entity: "capability_verification_declaration",
            entity_id: VER_B,
            payload: verification({
              id: VER_B,
              evidence_ids: [EVIDENCE_B],
              verified_by: { kind: "organization", entity_id: DECLARER_B },
            }),
          },
        ],
      }
    );
    const active = assessCapabilityVerification(project, CAP_A, AT);
    assert.equal(active.status, "ACTIVE_VERIFICATION_PRESENT");
    assert.equal(active.has_multiple_verifications, true);
    assert.equal(
      assessCapabilityVerification(project, CAP_A, AFTER_NOON).status,
      "ACTIVE_VERIFICATION_PRESENT"
    );
    const onlyExpired = applyPatch(
      applyPatch(
        baseProject(),
        patch("capability_declaration", CAP_A, capability())
      ),
      patch(
        "capability_verification_declaration",
        VER_A,
        verification({ verified_at: FROM, valid_until: UNTIL_NOON })
      )
    );
    assert.equal(
      assessCapabilityVerification(onlyExpired, CAP_A, AFTER_NOON).status,
      "NO_ACTIVE_VERIFICATION"
    );
  });

  it("assesses availability: none / AVAILABLE / UNAVAILABLE / CONTESTED", () => {
    const withCap = applyPatch(
      baseProject(),
      patch("capability_declaration", CAP_A, capability())
    );
    assert.equal(
      assessCapabilityAvailability(withCap, CAP_A, AT).status,
      "NO_AVAILABILITY_DECLARATIONS"
    );

    const available = applyPatch(
      withCap,
      patch("capability_availability_declaration", AVAIL_A, availability())
    );
    assert.equal(
      assessCapabilityAvailability(available, CAP_A, AT).status,
      "AVAILABLE_DECLARED"
    );

    const unavailable = applyPatch(
      withCap,
      patch(
        "capability_availability_declaration",
        AVAIL_A,
        availability({ status: "UNAVAILABLE" })
      )
    );
    assert.equal(
      assessCapabilityAvailability(unavailable, CAP_A, AT).status,
      "UNAVAILABLE_DECLARED"
    );

    const contested = applyPatch(withCap, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "capability_availability_declaration",
          entity_id: AVAIL_A,
          payload: availability({
            status: "AVAILABLE",
            declared_by: { kind: "organization", entity_id: DECLARER_A },
          }),
        },
        {
          op: "upsert",
          entity: "capability_availability_declaration",
          entity_id: AVAIL_B,
          payload: availability({
            id: AVAIL_B,
            status: "UNAVAILABLE",
            declared_by: { kind: "organization", entity_id: DECLARER_B },
          }),
        },
      ],
    });
    assert.equal(
      assessCapabilityAvailability(contested, CAP_A, AT).status,
      "CONTESTED_AVAILABILITY"
    );
  });

  it("allows same-source opposite availability; rejects same-status duplicates", () => {
    const withCap = applyPatch(
      baseProject(),
      patch("capability_declaration", CAP_A, capability())
    );
    const opposite = applyPatch(withCap, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "capability_availability_declaration",
          entity_id: AVAIL_A,
          payload: availability({ status: "AVAILABLE" }),
        },
        {
          op: "upsert",
          entity: "capability_availability_declaration",
          entity_id: AVAIL_B,
          payload: availability({
            id: AVAIL_B,
            status: "UNAVAILABLE",
            declared_by: { kind: "organization", entity_id: DECLARER_A },
          }),
        },
      ],
    });
    assert.equal(
      assessCapabilityAvailability(opposite, CAP_A, AT).status,
      "CONTESTED_AVAILABILITY"
    );
    assert.throws(
      () =>
        applyPatch(
          opposite,
          patch(
            "capability_availability_declaration",
            "ff5f5f5f-5f5f-4f5f-8f5f-5f5f5f5f5f03",
            availability({
              id: "ff5f5f5f-5f5f-4f5f-8f5f-5f5f5f5f5f03",
              status: "AVAILABLE",
            })
          )
        ),
      /duplicates overlapping/
    );
  });

  it("available but unverified; verified but unavailable; temporal mismatch", () => {
    const availableUnverified = applyPatch(
      applyPatch(
        baseProject(),
        patch("capability_declaration", CAP_A, capability())
      ),
      patch("capability_availability_declaration", AVAIL_A, availability())
    );
    const a = assessCapability(availableUnverified, CAP_A, AT);
    assert.equal(a.availability.status, "AVAILABLE_DECLARED");
    assert.equal(a.verification.status, "NO_ACTIVE_VERIFICATION");
    const json = JSON.stringify(a);
    assert.equal(json.includes("can_execute"), false);
    assert.equal(json.includes("effective"), false);

    const verifiedUnavailable = applyPatch(
      applyPatch(
        applyPatch(
          baseProject(),
          patch("capability_declaration", CAP_A, capability())
        ),
        patch("capability_verification_declaration", VER_A, verification())
      ),
      patch(
        "capability_availability_declaration",
        AVAIL_A,
        availability({ status: "UNAVAILABLE" })
      )
    );
    const b = assessCapability(verifiedUnavailable, CAP_A, AT);
    assert.equal(b.has_active_verification, true);
    assert.equal(b.has_unavailable_declaration, true);

    const mismatch = applyPatch(
      applyPatch(
        baseProject(),
        patch(
          "capability_declaration",
          CAP_A,
          capability({ valid_from: FROM, valid_until: UNTIL_NOON })
        )
      ),
      patch(
        "capability_availability_declaration",
        AVAIL_A,
        availability({ valid_from: FROM, valid_until: null })
      )
    );
    const c = assessCapability(mismatch, CAP_A, AFTER_NOON);
    assert.equal(c.has_active_declared_capability, false);
    assert.equal(c.has_temporal_basis_mismatch, true);
    assert.equal(c.availability.status, "AVAILABLE_DECLARED");
  });

  it("firewall: Authority / Mandate / Standing / Delegation do not create Capability", () => {
    const project = applyPatch(baseProject(), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: AUTHORITY_A,
          payload: {
            id: AUTHORITY_A,
            holder_entity_id: ENTITY_TEAM,
            power: "GOVERN_OBJECTIVE",
            scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
            valid_from: FROM,
            valid_until: null,
            declared_by: { kind: "organization", entity_id: DECLARER_A },
            recorded_at: TS,
          } satisfies Partial<AuthorityDeclaration>,
        },
        {
          op: "upsert",
          entity: "authority_delegation_declaration",
          entity_id: DELEGATION_A,
          payload: {
            id: DELEGATION_A,
            delegator_entity_id: ENTITY_TEAM,
            delegatee_entity_id: ORG_A,
            power: "GOVERN_OBJECTIVE",
            scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
            source_authority_declaration_ids: [AUTHORITY_A],
            valid_from: FROM,
            valid_until: null,
            declared_by: { kind: "organization", entity_id: DECLARER_A },
            recorded_at: TS,
          } satisfies Partial<AuthorityDelegationDeclaration>,
        },
        {
          op: "upsert",
          entity: "mandate_declaration",
          entity_id: MANDATE_A,
          payload: {
            id: MANDATE_A,
            holder_entity_id: ENTITY_TEAM,
            kind: "PURSUE_OBJECTIVE",
            objective_id: OBJECTIVE_A,
            valid_from: FROM,
            valid_until: null,
            declared_by: { kind: "organization", entity_id: DECLARER_A },
            recorded_at: TS,
          } satisfies Partial<MandateDeclaration>,
        },
        {
          op: "upsert",
          entity: "standing_declaration",
          entity_id: STANDING_A,
          payload: {
            id: STANDING_A,
            holder_entity_id: ENTITY_TEAM,
            scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
            rights: ["CONTEST"],
            valid_from: FROM,
            valid_until: null,
            declared_by: { kind: "organization", entity_id: DECLARER_A },
            recorded_at: TS,
          } satisfies Partial<StandingDeclaration>,
        },
      ],
    });
    assert.equal(project.capability_declarations.length, 0);
    assert.equal(
      getApplicableCapabilitiesForHolder(project, ENTITY_TEAM, AT).length,
      0
    );
    assert.equal(
      assessAuthorityProvenance(
        project,
        ORG_A,
        "GOVERN_OBJECTIVE",
        { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
        AT
      ).has_delegated_authority_claim,
      true
    );
  });

  it("Capability without Authority remains; Capability does not create Permission/Commitment/PROVEN/LATENT", () => {
    const project = applyPatch(
      baseProject(),
      patch("capability_declaration", CAP_A, capability())
    );
    assert.equal(
      assessDeclaredAuthority(
        project,
        ENTITY_TEAM,
        "GOVERN_OBJECTIVE",
        { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
        AT
      ).status,
      "NO_DECLARED_AUTHORITY"
    );
    const json = JSON.stringify(assessCapability(project, CAP_A, AT));
    for (const token of [
      "Permission",
      "Commitment",
      "PROVEN",
      "LATENT",
      "INCAPABLE",
      "IMPOSSIBLE",
      "can_execute",
      "Resource",
    ]) {
      assert.equal(json.includes(token), false, token);
    }
  });

  it("verification does not mutate epistemic layer", () => {
    const before = baseProject();
    const after = applyPatch(
      applyPatch(
        before,
        patch("capability_declaration", CAP_A, capability())
      ),
      patch("capability_verification_declaration", VER_A, verification())
    );
    assert.deepEqual(after.claims, before.claims);
    assert.deepEqual(after.evidence, before.evidence);
    assert.deepEqual(after.epistemic_observations, before.epistemic_observations);
  });

  it("deletion guards for capability, evidence, holder", () => {
    const project = applyPatch(
      applyPatch(
        applyPatch(
          baseProject(),
          patch("capability_declaration", CAP_A, capability())
        ),
        patch("capability_verification_declaration", VER_A, verification())
      ),
      patch("capability_availability_declaration", AVAIL_A, availability())
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "capability_declaration", entity_id: CAP_A },
          ],
        }),
      /capability_verification_declaration|capability_availability_declaration/
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "evidence", entity_id: EVIDENCE_A },
          ],
        }),
      /capability_verification_declaration.evidence_ids/
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reality_entity", entity_id: ENTITY_TEAM },
          ],
        }),
      /capability_declaration.holder_entity_id/
    );
  });

  it("firewall: ontic/governance/discovery/impact/ACL/studio unchanged", () => {
    const before = baseProject();
    const after = applyPatch(before, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "capability_declaration",
          entity_id: CAP_A,
          payload: capability(),
        },
        {
          op: "upsert",
          entity: "capability_verification_declaration",
          entity_id: VER_A,
          payload: verification(),
        },
        {
          op: "upsert",
          entity: "capability_availability_declaration",
          entity_id: AVAIL_A,
          payload: availability(),
        },
      ],
    });
    assert.deepEqual(after.reality_events, before.reality_events);
    assert.deepEqual(after.reality_states, before.reality_states);
    assert.deepEqual(after.authority_declarations, before.authority_declarations);
    assert.deepEqual(after.mandate_declarations, before.mandate_declarations);
    assert.deepEqual(after.impact_declarations, before.impact_declarations);
    assert.deepEqual(after.goals, before.goals);
    const stillOk = applyPatch(
      after,
      patch("reference_condition", REF_DESIRED, desiredRef())
    );
    assert.ok(validateProjectState(stillOk).valid);
  });

  it("assessment is read-only and deterministic", () => {
    const project = applyPatch(
      applyPatch(
        baseProject(),
        patch("capability_declaration", CAP_A, capability())
      ),
      patch("capability_availability_declaration", AVAIL_A, availability())
    );
    const snapshot = structuredClone(project);
    const a = assessCapability(project, CAP_A, AT);
    const b = assessCapability(project, CAP_A, AT);
    assert.deepEqual(a, b);
    assert.deepEqual(project, snapshot);
  });
});
