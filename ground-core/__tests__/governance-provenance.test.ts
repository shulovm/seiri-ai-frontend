import assert from "node:assert/strict";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessDeclaredAuthority,
} from "../reality/governance-core.js";
import {
  assessAuthorityContest,
  assessAuthorityDelegation,
  assessAuthorityProvenance,
  assessContestStandingContext,
  getApplicableAuthorityDelegationsToHolder,
  getAuthorityProvenancePaths,
} from "../reality/governance-provenance.js";
import { detectImpactDirectionConflicts } from "../reality/impact-core.js";
import { detectReferenceConflicts } from "../reality/reference-state.js";
import { applyPatch } from "../state-engine.js";
import type {
  AuthorityContestDeclaration,
  AuthorityDeclaration,
  AuthorityDelegationDeclaration,
  ImpactDeclaration,
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
  validateProjectStateV019,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV0124,
  validProjectStateV019,
} from "./fixtures.js";

const ENTITY_PIPE = "f1010101-0101-4101-8101-010101010101";
const ENTITY_HOSPITAL = "f1010101-0101-4101-8101-010101010102";
const ORG_A = "f1010101-0101-4101-8101-010101010103";
const ORG_B = "f1010101-0101-4101-8101-010101010104";
const ORG_C = "f1010101-0101-4101-8101-010101010105";
const DECLARER_A = "f1010101-0101-4101-8101-010101010106";
const DECLARER_B = "f1010101-0101-4101-8101-010101010107";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060901";
const REF_DESIRED = "f6060606-0606-4606-8606-060606060701";
const REF_ACCEPTABLE_B = "f6060606-0606-4606-8606-060606060903";
const OBJECTIVE_A = "f5050505-0505-4505-8505-050505050901";
const IMPACT_A = "f7070707-0707-4707-8707-070707070901";
const IMPACT_B = "f7070707-0707-4707-8707-070707070902";
const AUTHORITY_A = "f9090909-0909-4909-8909-090909090901";
const AUTHORITY_B = "f9090909-0909-4909-8909-090909090902";
const DELEGATION_A = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const DELEGATION_B = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a02";
const CONTEST_A = "fb1b1b1b-1b1b-4b1b-8b1b-1b1b1b1b1b01";
const CONTEST_B = "fb1b1b1b-1b1b-4b1b-8b1b-1b1b1b1b1b02";
const STANDING_A = "fc2c2c2c-2c2c-4c2c-8c2c-2c2c2c2c2c01";
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

function desiredRef(
  overrides: Partial<ReferenceCondition> = {}
): ReferenceCondition {
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
    ...overrides,
  };
}

function acceptableRef(
  overrides: Partial<ReferenceCondition> = {}
): ReferenceCondition {
  return {
    id: REF_ACCEPTABLE,
    project_id: PROJECT_ID,
    subject_id: ENTITY_PIPE,
    state_kind: "pressure",
    reference_kind: "ACCEPTABLE",
    criterion: {
      kind: "NUMERIC_RANGE",
      min: 70,
      max: 90,
      min_inclusive: true,
      max_inclusive: true,
    },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ORG_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function objective(overrides: Partial<RealityObjective> = {}): RealityObjective {
  return {
    id: OBJECTIVE_A,
    project_id: PROJECT_ID,
    kind: "STATE_TARGET",
    label: "restore pressure",
    target_reference_condition_ids: [REF_DESIRED],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ORG_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function authorityGov(
  overrides: Partial<AuthorityDeclaration> = {}
): AuthorityDeclaration {
  return {
    id: AUTHORITY_A,
    project_id: PROJECT_ID,
    holder_entity_id: ORG_A,
    power: "GOVERN_OBJECTIVE",
    scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function authorityEstablish(
  overrides: Partial<AuthorityDeclaration> = {}
): AuthorityDeclaration {
  return {
    id: AUTHORITY_A,
    project_id: PROJECT_ID,
    holder_entity_id: ORG_A,
    power: "ESTABLISH_REFERENCE",
    scope: {
      kind: "SUBJECT_STATE",
      subject_id: ENTITY_PIPE,
      state_kind: "pressure",
    },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function delegation(
  overrides: Partial<AuthorityDelegationDeclaration> = {}
): AuthorityDelegationDeclaration {
  return {
    id: DELEGATION_A,
    project_id: PROJECT_ID,
    delegator_entity_id: ORG_A,
    delegatee_entity_id: ORG_B,
    power: "GOVERN_OBJECTIVE",
    scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
    source_authority_declaration_ids: [AUTHORITY_A],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function contest(
  overrides: Partial<AuthorityContestDeclaration> = {}
): AuthorityContestDeclaration {
  return {
    id: CONTEST_A,
    project_id: PROJECT_ID,
    contesting_entity_id: ENTITY_HOSPITAL,
    target: {
      kind: "AUTHORITY_DECLARATION",
      authority_declaration_id: AUTHORITY_A,
    },
    note: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_B },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function standing(
  overrides: Partial<StandingDeclaration> = {}
): StandingDeclaration {
  return {
    id: STANDING_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_HOSPITAL,
    scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
    rights: ["CONTEST"],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function impactDecl(
  overrides: Partial<ImpactDeclaration> = {}
): ImpactDeclaration {
  return {
    id: IMPACT_A,
    project_id: PROJECT_ID,
    basis: {
      kind: "REFERENCE_DEVIATION",
      reference_condition_id: REF_ACCEPTABLE,
    },
    affected_entity_id: ENTITY_HOSPITAL,
    dimension: "service_availability",
    direction: "ADVERSE",
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ORG_A },
    recorded_at: TS,
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
      entity(ENTITY_HOSPITAL, "hospital-B", { kind: "organization" }),
      entity(ORG_A, "org-A"),
      entity(ORG_B, "org-B"),
      entity(ORG_C, "org-C"),
      entity(DECLARER_A, "declarer-A"),
      entity(DECLARER_B, "declarer-B"),
    ],
    reference_conditions: [acceptableRef(), desiredRef()],
    reality_objectives: [objective()],
    impact_declarations: [impactDecl()],
    authority_declarations: [authorityGov()],
    standing_declarations: [],
    mandate_declarations: [],
    authority_delegation_declarations: [],
    authority_contest_declarations: [],
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

const SCOPE_OBJ = {
  kind: "REALITY_OBJECTIVE" as const,
  objective_id: OBJECTIVE_A,
};

describe("Governance Provenance (GROUND-020)", () => {
  it("migrates 0.1.9 → 0.1.13 with empty delegation/contest/capability arrays", () => {
    assert.ok(validateProjectStateV019(validProjectStateV019).valid);
    const migrated = migrateProjectState(validProjectStateV019);
    assert.equal(migrated.schema_version, "0.1.25");
    assert.deepEqual(migrated.authority_delegation_declarations, []);
    assert.deepEqual(migrated.authority_contest_declarations, []);
    assert.deepEqual(migrated.capability_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("persists AuthorityDelegationDeclaration via StatePatch roundtrip", () => {
    const next = applyPatch(
      baseProject(),
      patch("authority_delegation_declaration", DELEGATION_A, delegation())
    );
    assert.equal(next.authority_delegation_declarations.length, 1);
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.governance-prov-tmp");
    saveProject(next, { storageDir: dir });
    const loaded = loadProject(PROJECT_ID, { storageDir: dir });
    assert.equal(loaded.authority_delegation_declarations[0]?.id, DELEGATION_A);
  });

  it("rejects empty/wrong/unknown/self source Authority basis", () => {
    const project = baseProject();
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("authority_delegation_declaration", DELEGATION_A, delegation({
            source_authority_declaration_ids: [],
          }))
        ),
      /non-empty source_authority_declaration_ids/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("authority_delegation_declaration", DELEGATION_A, delegation({
            delegator_entity_id: ORG_C,
          }))
        ),
      /holder must equal delegator/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("authority_delegation_declaration", DELEGATION_A, delegation({
            power: "ESTABLISH_REFERENCE",
            scope: {
              kind: "SUBJECT_STATE",
              subject_id: ENTITY_PIPE,
              state_kind: "pressure",
            },
          }))
        ),
      /power must match|scope must match|missing AuthorityDeclaration/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("authority_delegation_declaration", DELEGATION_A, delegation({
            source_authority_declaration_ids: [
              "00000000-0000-4000-8000-000000000099",
            ],
          }))
        ),
      /missing AuthorityDeclaration/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("authority_delegation_declaration", DELEGATION_A, delegation({
            delegatee_entity_id: ORG_A,
          }))
        ),
      /self-delegation/
    );
  });

  it("assesses active / inactive source / inactive delegation basis", () => {
    const project = applyPatch(
      baseProject({
        authority_declarations: [
          authorityGov({ valid_from: FROM, valid_until: UNTIL_NOON }),
        ],
      }),
      patch(
        "authority_delegation_declaration",
        DELEGATION_A,
        delegation({ valid_from: FROM, valid_until: null })
      )
    );
    const active = assessAuthorityDelegation(project, DELEGATION_A, AT);
    assert.equal(active.basis_status, "SOURCE_DECLARED_AUTHORITY_ACTIVE");
    const sourceInactive = assessAuthorityDelegation(
      project,
      DELEGATION_A,
      AFTER_NOON
    );
    assert.equal(sourceInactive.delegation_active, true);
    assert.equal(
      sourceInactive.basis_status,
      "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE"
    );

    const inactiveDelegation = applyPatch(
      baseProject(),
      patch(
        "authority_delegation_declaration",
        DELEGATION_A,
        delegation({ valid_from: FROM, valid_until: UNTIL_NOON })
      )
    );
    assert.equal(
      assessAuthorityDelegation(inactiveDelegation, DELEGATION_A, AFTER_NOON)
        .basis_status,
      "DELEGATION_NOT_ACTIVE"
    );
  });

  it("keeps GROUND-019 NO_DECLARED_AUTHORITY for delegated-only holder", () => {
    const project = applyPatch(
      baseProject(),
      patch("authority_delegation_declaration", DELEGATION_A, delegation())
    );
    assert.equal(
      assessDeclaredAuthority(
        project,
        ORG_B,
        "GOVERN_OBJECTIVE",
        SCOPE_OBJ,
        AT
      ).status,
      "NO_DECLARED_AUTHORITY"
    );
    const provenance = assessAuthorityProvenance(
      project,
      ORG_B,
      "GOVERN_OBJECTIVE",
      SCOPE_OBJ,
      AT
    );
    assert.equal(provenance.has_delegated_authority_claim, true);
    assert.equal(provenance.has_direct_declared_authority, false);
    assert.equal(provenance.has_delegation_with_active_source_basis, true);
  });

  it("exposes direct + delegated coexistence and multiple delegators without winner", () => {
    let project = applyPatch(
      baseProject({
        authority_declarations: [
          authorityGov(),
          authorityGov({
            id: AUTHORITY_B,
            holder_entity_id: ORG_C,
          }),
          authorityGov({
            id: "f9090909-0909-4909-8909-090909090903",
            holder_entity_id: ORG_B,
          }),
        ],
      }),
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "authority_delegation_declaration",
            entity_id: DELEGATION_A,
            payload: delegation(),
          },
          {
            op: "upsert",
            entity: "authority_delegation_declaration",
            entity_id: DELEGATION_B,
            payload: delegation({
              id: DELEGATION_B,
              delegator_entity_id: ORG_C,
              source_authority_declaration_ids: [AUTHORITY_B],
            }),
          },
        ],
      }
    );
    const provenance = assessAuthorityProvenance(
      project,
      ORG_B,
      "GOVERN_OBJECTIVE",
      SCOPE_OBJ,
      AT
    );
    assert.equal(provenance.has_direct_declared_authority, true);
    assert.equal(provenance.has_delegated_authority_claim, true);
    assert.equal(provenance.applicable_delegations_to_holder.length, 2);
    assert.equal(provenance.provenance_paths.length, 3);
    const json = JSON.stringify(provenance);
    assert.equal(json.includes("preferred_path"), false);
    assert.equal(json.includes("effective_authority"), false);
    assert.equal(json.includes("winner"), false);
  });

  it("does not allow transitive delegation via type/ref contract", () => {
    const project = applyPatch(
      baseProject(),
      patch("authority_delegation_declaration", DELEGATION_A, delegation())
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch("authority_delegation_declaration", DELEGATION_B, delegation({
            id: DELEGATION_B,
            delegator_entity_id: ORG_B,
            delegatee_entity_id: ORG_C,
            source_authority_declaration_ids: [DELEGATION_A],
          }))
        ),
      /missing AuthorityDeclaration/
    );
  });

  it("delegation does not create Mandate / Capability / Permission / Commitment", () => {
    const next = applyPatch(
      baseProject(),
      patch("authority_delegation_declaration", DELEGATION_A, delegation())
    );
    assert.deepEqual(next.mandate_declarations, []);
    const json = JSON.stringify(next);
    for (const token of [
      '"Capability"',
      '"can_execute"',
      '"Commitment"',
      '"accepted_by"',
      '"effective_authority"',
    ]) {
      assert.equal(json.includes(token), false, token);
    }
  });

  it("persists contests for Authority and Delegation", () => {
    const withDelegation = applyPatch(
      baseProject(),
      patch("authority_delegation_declaration", DELEGATION_A, delegation())
    );
    const next = applyPatch(
      withDelegation,
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "authority_contest_declaration",
            entity_id: CONTEST_A,
            payload: contest(),
          },
          {
            op: "upsert",
            entity: "authority_contest_declaration",
            entity_id: CONTEST_B,
            payload: contest({
              id: CONTEST_B,
              target: {
                kind: "AUTHORITY_DELEGATION",
                authority_delegation_id: DELEGATION_A,
              },
            }),
          },
        ],
      }
    );
    assert.equal(next.authority_contest_declarations.length, 2);
  });

  it("rejects unknown contest target", () => {
    assert.throws(
      () =>
        applyPatch(
          baseProject(),
          patch("authority_contest_declaration", CONTEST_A, contest({
            target: {
              kind: "AUTHORITY_DECLARATION",
              authority_declaration_id: "00000000-0000-4000-8000-000000000099",
            },
          }))
        ),
      /missing AuthorityDeclaration/
    );
  });

  it("contest is not revocation — Authority and Delegation remain visible", () => {
    const project = applyPatch(
      applyPatch(
        baseProject(),
        patch("authority_delegation_declaration", DELEGATION_A, delegation())
      ),
      patch("authority_contest_declaration", CONTEST_A, contest())
    );
    assert.equal(
      assessDeclaredAuthority(
        project,
        ORG_A,
        "GOVERN_OBJECTIVE",
        SCOPE_OBJ,
        AT
      ).status,
      "DECLARED_AUTHORITY_PRESENT"
    );
    assert.equal(
      getApplicableAuthorityDelegationsToHolder(
        project,
        ORG_B,
        "GOVERN_OBJECTIVE",
        SCOPE_OBJ,
        AT
      ).length,
      1
    );
  });

  it("Standing without Contest and Contest without Standing", () => {
    const standingOnly = applyPatch(
      baseProject(),
      patch("standing_declaration", STANDING_A, standing())
    );
    const contestAssessment = assessAuthorityContest(
      standingOnly,
      {
        kind: "AUTHORITY_DECLARATION",
        authority_declaration_id: AUTHORITY_A,
      },
      AT
    );
    assert.equal(contestAssessment.has_active_contest, false);

    const contestOnly = applyPatch(
      baseProject(),
      patch("authority_contest_declaration", CONTEST_A, contest())
    );
    const withContest = assessAuthorityContest(
      contestOnly,
      {
        kind: "AUTHORITY_DECLARATION",
        authority_declaration_id: AUTHORITY_A,
      },
      AT
    );
    assert.equal(withContest.has_active_contest, true);
    assert.equal(
      withContest.standing_contexts[0]?.status,
      "NO_DECLARED_CONTEST_STANDING"
    );
  });

  it("Contest with Standing and SUBJECT_STATE standing not mappable", () => {
    const withStanding = applyPatch(
      applyPatch(
        baseProject(),
        patch("standing_declaration", STANDING_A, standing())
      ),
      patch("authority_contest_declaration", CONTEST_A, contest())
    );
    assert.equal(
      assessAuthorityContest(
        withStanding,
        {
          kind: "AUTHORITY_DECLARATION",
          authority_declaration_id: AUTHORITY_A,
        },
        AT
      ).standing_contexts[0]?.status,
      "DECLARED_CONTEST_STANDING_PRESENT"
    );

    const subjectAuthProject = applyPatch(
      baseProject({
        authority_declarations: [authorityEstablish()],
      }),
      patch(
        "authority_contest_declaration",
        CONTEST_A,
        contest({
          target: {
            kind: "AUTHORITY_DECLARATION",
            authority_declaration_id: AUTHORITY_A,
          },
        })
      )
    );
    const entry = assessContestStandingContext(
      subjectAuthProject,
      subjectAuthProject.authority_contest_declarations[0]!,
      AT
    );
    assert.equal(entry.status, "STANDING_SCOPE_NOT_MAPPABLE");
  });

  it("exposes contested delegation and contested source without suppression", () => {
    const project = applyPatch(
      applyPatch(
        baseProject(),
        patch("authority_delegation_declaration", DELEGATION_A, delegation())
      ),
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "authority_contest_declaration",
            entity_id: CONTEST_A,
            payload: contest(),
          },
          {
            op: "upsert",
            entity: "authority_contest_declaration",
            entity_id: CONTEST_B,
            payload: contest({
              id: CONTEST_B,
              target: {
                kind: "AUTHORITY_DELEGATION",
                authority_delegation_id: DELEGATION_A,
              },
            }),
          },
        ],
      }
    );
    const paths = getAuthorityProvenancePaths(
      project,
      ORG_B,
      "GOVERN_OBJECTIVE",
      SCOPE_OBJ,
      AT
    );
    const delegated = paths.find((p) => p.kind === "ONE_HOP_DELEGATION");
    assert.ok(delegated);
    assert.equal(delegated!.contested, true);
    assert.equal(delegated!.has_contested_source_authority, true);
    assert.ok(delegated!.delegation_declaration_ids.includes(DELEGATION_A));
  });

  it("does not resolve ReferenceConflict or ImpactDirectionConflict", () => {
    const project = applyPatch(
      baseProject({
        reference_conditions: [
          acceptableRef(),
          desiredRef(),
          acceptableRef({
            id: REF_ACCEPTABLE_B,
            criterion: {
              kind: "NUMERIC_RANGE",
              min: 10,
              max: 20,
              min_inclusive: true,
              max_inclusive: true,
            },
          }),
        ],
        impact_declarations: [
          impactDecl(),
          impactDecl({
            id: IMPACT_B,
            direction: "BENEFICIAL",
            declared_by: { kind: "human", entity_id: ORG_B },
          }),
        ],
      }),
      patch("authority_delegation_declaration", DELEGATION_A, delegation())
    );
    assert.ok(
      detectReferenceConflicts(
        project.reference_conditions.filter(
          (entry) =>
            entry.reference_kind === "ACCEPTABLE" &&
            entry.subject_id === ENTITY_PIPE &&
            entry.state_kind === "pressure"
        ),
        AT
      ).length > 0
    );
    assert.ok(
      detectImpactDirectionConflicts(project, REF_ACCEPTABLE, AT).length > 0
    );
  });

  it("does not gate StatePatch on delegated/contested Authority", () => {
    const project = applyPatch(
      applyPatch(
        baseProject(),
        patch("authority_delegation_declaration", DELEGATION_A, delegation())
      ),
      patch("authority_contest_declaration", CONTEST_A, contest())
    );
    const next = applyPatch(
      project,
      patch("reference_condition", REF_ACCEPTABLE, acceptableRef())
    );
    assert.ok(validateProjectState(next).valid);
  });

  it("rejects duplicate same-declarer delegation/contest; preserves different declarers", () => {
    const project = applyPatch(baseProject(), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_delegation_declaration",
          entity_id: DELEGATION_A,
          payload: delegation({
            declared_by: { kind: "organization", entity_id: DECLARER_A },
          }),
        },
        {
          op: "upsert",
          entity: "authority_delegation_declaration",
          entity_id: DELEGATION_B,
          payload: delegation({
            id: DELEGATION_B,
            declared_by: { kind: "organization", entity_id: DECLARER_B },
          }),
        },
      ],
    });
    assert.throws(
      () =>
        applyPatch(
          project,
          patch(
            "authority_delegation_declaration",
            "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a03",
            delegation({
              id: "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a03",
              declared_by: { kind: "organization", entity_id: DECLARER_A },
            })
          )
        ),
      /duplicates overlapping/
    );

    const withContest = applyPatch(project, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_contest_declaration",
          entity_id: CONTEST_A,
          payload: contest({
            declared_by: { kind: "organization", entity_id: DECLARER_A },
          }),
        },
        {
          op: "upsert",
          entity: "authority_contest_declaration",
          entity_id: CONTEST_B,
          payload: contest({
            id: CONTEST_B,
            declared_by: { kind: "organization", entity_id: DECLARER_B },
          }),
        },
      ],
    });
    assert.throws(
      () =>
        applyPatch(
          withContest,
          patch(
            "authority_contest_declaration",
            "fb1b1b1b-1b1b-4b1b-8b1b-1b1b1b1b1b03",
            contest({
              id: "fb1b1b1b-1b1b-4b1b-8b1b-1b1b1b1b1b03",
              declared_by: { kind: "organization", entity_id: DECLARER_A },
            })
          )
        ),
      /duplicates overlapping/
    );
  });

  it("rejects deletion of source Authority / contested targets / entities", () => {
    const project = applyPatch(
      applyPatch(
        baseProject(),
        patch("authority_delegation_declaration", DELEGATION_A, delegation())
      ),
      patch("authority_contest_declaration", CONTEST_A, contest())
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "authority_declaration", entity_id: AUTHORITY_A },
          ],
        }),
      /authority_delegation_declaration|authority_contest_declaration/
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reality_entity", entity_id: ORG_B },
          ],
        }),
      /delegatee_entity_id/
    );
  });

  it("firewall: no ontic/epistemic/discovery/impact/standing/mandate mutation", () => {
    const before = baseProject();
    const after = applyPatch(before, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_delegation_declaration",
          entity_id: DELEGATION_A,
          payload: delegation(),
        },
        {
          op: "upsert",
          entity: "authority_contest_declaration",
          entity_id: CONTEST_A,
          payload: contest(),
        },
      ],
    });
    assert.deepEqual(after.reality_events, before.reality_events);
    assert.deepEqual(after.reality_states, before.reality_states);
    assert.deepEqual(after.claims, before.claims);
    assert.deepEqual(after.evidence, before.evidence);
    assert.deepEqual(after.impact_declarations, before.impact_declarations);
    assert.deepEqual(after.standing_declarations, before.standing_declarations);
    assert.deepEqual(after.mandate_declarations, before.mandate_declarations);
    assert.deepEqual(after.goals, before.goals);
  });

  it("assessment is read-only and deterministic", () => {
    const project = applyPatch(
      baseProject(),
      patch("authority_delegation_declaration", DELEGATION_A, delegation())
    );
    const before = structuredClone(project);
    const a = assessAuthorityProvenance(
      project,
      ORG_B,
      "GOVERN_OBJECTIVE",
      SCOPE_OBJ,
      AT
    );
    const b = assessAuthorityProvenance(
      project,
      ORG_B,
      "GOVERN_OBJECTIVE",
      SCOPE_OBJ,
      AT
    );
    assert.deepEqual(a, b);
    assert.deepEqual(project, before);
  });
});
