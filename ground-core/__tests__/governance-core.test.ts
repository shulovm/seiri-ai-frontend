import assert from "node:assert/strict";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import { PatchError } from "../errors.js";
import {
  assessDeclaredAuthority,
  assessDeclaredStanding,
  assessImpactDeclarationAuthority,
  assessImpactMeasureDeclarationAuthority,
  assessMandate,
  assessObjectiveDeclarationAuthority,
  assessReferenceDeclarationAuthority,
  buildObjectiveGovernanceContext,
  getApplicableAuthorityDeclarations,
  getAuthorityHolderIdsForScope,
  governanceScopeKey,
  hasMultipleAuthorityHolders,
  isGovernanceDeclarationActiveAt,
} from "../reality/governance-core.js";
import {
  assessReferenceDeviationImpactScope,
  detectImpactDirectionConflicts,
} from "../reality/impact-core.js";
import { detectReferenceConflicts } from "../reality/reference-state.js";
import { applyPatch } from "../state-engine.js";
import type {
  AuthorityDeclaration,
  ImpactDeclaration,
  ImpactMeasureDeclaration,
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
  validateProjectStateV018,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV018,
  validProjectStateV0124,
} from "./fixtures.js";

const ENTITY_PIPE = "f1010101-0101-4101-8101-010101010101";
const ENTITY_HOSPITAL = "f1010101-0101-4101-8101-010101010102";
const ORG_A = "f1010101-0101-4101-8101-010101010103";
const ORG_B = "f1010101-0101-4101-8101-010101010104";
const DECLARER_A = "f1010101-0101-4101-8101-010101010105";
const DECLARER_B = "f1010101-0101-4101-8101-010101010106";
const HOLDER_ONLY = "f1010101-0101-4101-8101-010101010107";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060901";
const REF_DESIRED = "f6060606-0606-4606-8606-060606060701";
const REF_ACCEPTABLE_B = "f6060606-0606-4606-8606-060606060903";
const OBJECTIVE_A = "f5050505-0505-4505-8505-050505050901";
const IMPACT_A = "f7070707-0707-4707-8707-070707070901";
const IMPACT_B = "f7070707-0707-4707-8707-070707070902";
const MEASURE_A = "f8080808-0808-4808-8808-080808080901";
const AUTHORITY_A = "f9090909-0909-4909-8909-090909090901";
const AUTHORITY_B = "f9090909-0909-4909-8909-090909090902";
const STANDING_A = "fa1a1a1a-1a1a-4a1a-8a1a-1a1a1a1a1a01";
const MANDATE_A = "fb2b2b2b-2b2b-4b2b-8b2b-2b2b2b2b2b01";
const TS = "2026-08-24T12:00:00.000Z";
const FROM = "2026-08-24T00:00:00.000Z";
const UNTIL = "2026-08-24T18:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";
const BEFORE = "2026-08-23T23:59:59.999Z";

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

function authorityDecl(
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

function standingDecl(
  overrides: Partial<StandingDeclaration> = {}
): StandingDeclaration {
  return {
    id: STANDING_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_HOSPITAL,
    scope: {
      kind: "REFERENCE_CONDITION",
      reference_condition_id: REF_ACCEPTABLE,
    },
    rights: ["PARTICIPATE", "CONTEST"],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function mandateDecl(
  overrides: Partial<MandateDeclaration> = {}
): MandateDeclaration {
  return {
    id: MANDATE_A,
    project_id: PROJECT_ID,
    holder_entity_id: ORG_A,
    kind: "PURSUE_OBJECTIVE",
    objective_id: OBJECTIVE_A,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function measureDecl(
  overrides: Partial<ImpactMeasureDeclaration> = {}
): ImpactMeasureDeclaration {
  return {
    id: MEASURE_A,
    project_id: PROJECT_ID,
    impact_declaration_id: IMPACT_A,
    metric_key: "downtime_hours",
    unit: "hours",
    measure: { kind: "POINT", value: 4 },
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
      entity(ENTITY_PIPE, "pipe-A"),
      entity(ENTITY_HOSPITAL, "hospital-B"),
      entity(ORG_A, "org-A", { kind: "organization" }),
      entity(ORG_B, "org-B", { kind: "organization" }),
      entity(DECLARER_A, "declarer-A", { kind: "organization" }),
      entity(DECLARER_B, "declarer-B", { kind: "organization" }),
      entity(HOLDER_ONLY, "holder-only", { kind: "organization" }),
    ],
    reference_conditions: [acceptableRef(), desiredRef()],
    reality_objectives: [objective()],
    impact_declarations: [impactDecl()],
    impact_measure_declarations: [measureDecl()],
    authority_declarations: [],
    standing_declarations: [],
    mandate_declarations: [],
    ...overrides,
  };
}

function patch(
  entity: PatchEntity,
  entityId: string,
  payload: object
): StatePatch {
  return {
    schema_version: "0.1.24",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [{ op: "upsert", entity, entity_id: entityId, payload }],
  } as StatePatch;
}

describe("Governance Core (GROUND-019)", () => {
  it("migrates 0.1.8 → 0.1.13 with empty governance collections", () => {
    assert.ok(validateProjectStateV018(validProjectStateV018).valid);
    const migrated = migrateProjectState(validProjectStateV018);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.authority_declarations, []);
    assert.deepEqual(migrated.standing_declarations, []);
    assert.deepEqual(migrated.mandate_declarations, []);
    assert.deepEqual(migrated.authority_delegation_declarations, []);
    assert.deepEqual(migrated.authority_contest_declarations, []);
    assert.deepEqual(migrated.capability_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("persists AuthorityDeclaration via StatePatch roundtrip", () => {
    const next = applyPatch(baseProject(), patch("authority_declaration", AUTHORITY_A, authorityDecl()));
    assert.equal(next.authority_declarations.length, 1);
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.governance-tmp");
    saveProject(next, { storageDir: dir });
    const loaded = loadProject(PROJECT_ID, { storageDir: dir });
    assert.equal(loaded.authority_declarations[0]?.id, AUTHORITY_A);
  });

  it("accepts valid power/scope matrix and rejects invalid combinations", () => {
    const project = baseProject();
    assert.doesNotThrow(() =>
      applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl()))
    );
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl({
          power: "ESTABLISH_REFERENCE",
          scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
        }))),
      /incompatible with scope kind/
    );
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl({
          power: "GOVERN_OBJECTIVE",
          scope: {
            kind: "SUBJECT_STATE",
            subject_id: ENTITY_PIPE,
            state_kind: "pressure",
          },
        }))),
      /incompatible with scope kind/
    );
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl({
          power: "DECLARE_IMPACT",
          scope: { kind: "IMPACT_DECLARATION", impact_declaration_id: IMPACT_A },
        }))),
      /incompatible with scope kind/
    );
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl({
          power: "DECLARE_IMPACT_MEASURE",
          scope: {
            kind: "REFERENCE_CONDITION",
            reference_condition_id: REF_ACCEPTABLE,
          },
        }))),
      /incompatible with scope kind/
    );
  });

  it("rejects unknown holder and scope references", () => {
    const project = baseProject();
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl({
          holder_entity_id: "00000000-0000-4000-8000-000000000099",
        }))),
      /missing holder RealityEntity/
    );
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl({
          scope: {
            kind: "SUBJECT_STATE",
            subject_id: "00000000-0000-4000-8000-000000000099",
            state_kind: "pressure",
          },
        }))),
      /missing RealityEntity/
    );
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl({
          power: "DECLARE_IMPACT",
          scope: {
            kind: "REFERENCE_CONDITION",
            reference_condition_id: "00000000-0000-4000-8000-000000000099",
          },
        }))),
      /missing ReferenceCondition/
    );
  });

  it("enforces [valid_from, valid_until) temporal semantics", () => {
    const project = baseProject();
    assert.equal(
      isGovernanceDeclarationActiveAt(
        { valid_from: FROM, valid_until: UNTIL },
        AT
      ),
      true
    );
    assert.equal(
      isGovernanceDeclarationActiveAt(
        { valid_from: FROM, valid_until: UNTIL },
        UNTIL
      ),
      false
    );
    assert.equal(
      isGovernanceDeclarationActiveAt(
        { valid_from: FROM, valid_until: UNTIL },
        BEFORE
      ),
      false
    );
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl({
          valid_from: FROM,
          valid_until: FROM,
        }))),
      /valid_until must be after valid_from/
    );
  });

  it("assesses reference declarer authority present/absent/non-entity", () => {
    const withAuthority = applyPatch(
      baseProject(),
      patch("authority_declaration", AUTHORITY_A, authorityDecl())
    );
    const present = assessReferenceDeclarationAuthority(withAuthority, REF_ACCEPTABLE, AT);
    assert.equal(present.status, "DECLARED_AUTHORITY_PRESENT");
    assert.equal(present.holder_entity_id, ORG_A);

    const absent = assessReferenceDeclarationAuthority(baseProject(), REF_ACCEPTABLE, AT);
    assert.equal(absent.status, "NO_DECLARED_AUTHORITY");

    const externalRef = baseProject({
      reference_conditions: [
        acceptableRef({
          declared_by: { kind: "external", external_id: "ISO-9001" },
        }),
      ],
    });
    const nonEntity = assessReferenceDeclarationAuthority(externalRef, REF_ACCEPTABLE, AT);
    assert.equal(nonEntity.status, "DECLARER_NOT_ENTITY");
    assert.equal(nonEntity.holder_entity_id, null);
  });

  it("does not gate StatePatch on Authority absence — reference still applies", () => {
    const project = baseProject({
      authority_declarations: [],
      reference_conditions: [desiredRef()],
      reality_objectives: [objective()],
      impact_declarations: [],
      impact_measure_declarations: [],
    });
    const next = applyPatch(
      project,
      patch("reference_condition", REF_ACCEPTABLE, acceptableRef())
    );
    assert.equal(next.reference_conditions.length, 2);
    assert.ok(validateProjectState(next).valid);
  });

  it("allows multiple authority holders without conflict resolution", () => {
    const project = applyPatch(
      baseProject(),
      {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "authority_declaration",
            entity_id: AUTHORITY_A,
            payload: authorityDecl({ holder_entity_id: ORG_A }),
          },
          {
            op: "upsert",
            entity: "authority_declaration",
            entity_id: AUTHORITY_B,
            payload: authorityDecl({
              id: AUTHORITY_B,
              holder_entity_id: ORG_B,
            }),
          },
        ],
      }
    );
    const scope = {
      kind: "SUBJECT_STATE" as const,
      subject_id: ENTITY_PIPE,
      state_kind: "pressure",
    };
    assert.deepEqual(
      getAuthorityHolderIdsForScope(project, "ESTABLISH_REFERENCE", scope, AT),
      [ORG_A, ORG_B]
    );
    assert.equal(
      hasMultipleAuthorityHolders(project, "ESTABLISH_REFERENCE", scope, AT),
      true
    );
  });

  it("preserves same authority from different declarers and rejects duplicate same-declarer overlap", () => {
    const project = applyPatch(baseProject(), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: AUTHORITY_A,
          payload: authorityDecl({
            declared_by: { kind: "organization", entity_id: DECLARER_A },
          }),
        },
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: AUTHORITY_B,
          payload: authorityDecl({
            id: AUTHORITY_B,
            declared_by: { kind: "organization", entity_id: DECLARER_B },
          }),
        },
      ],
    });
    assert.throws(
      () =>
        applyPatch(project, patch("authority_declaration", "f9090909-0909-4909-8909-090909090903", authorityDecl({
          id: "f9090909-0909-4909-8909-090909090903",
          declared_by: { kind: "organization", entity_id: DECLARER_A },
        }))),
      /duplicates overlapping declaration/
    );
  });

  it("persists StandingDeclaration and validates rights", () => {
    const next = applyPatch(baseProject(), patch("standing_declaration", STANDING_A, standingDecl()));
    assert.equal(next.standing_declarations.length, 1);
    assert.throws(
      () =>
        applyPatch(baseProject(), patch("standing_declaration", STANDING_A, standingDecl({
          rights: [],
        }))),
      /non-empty array/
    );
    assert.throws(
      () =>
        applyPatch(baseProject(), patch("standing_declaration", STANDING_A, standingDecl({
          rights: ["PARTICIPATE", "PARTICIPATE"],
        }))),
      /duplicates/
    );
    assert.throws(
      () =>
        applyPatch(baseProject(), patch("standing_declaration", STANDING_A, standingDecl({
          rights: ["VOTE" as "PARTICIPATE"],
        }))),
      /PARTICIPATE or CONTEST/
    );
  });

  it("firewall: affectedness is not Standing", () => {
    const project = baseProject({ standing_declarations: [] });
    const impactScope = assessReferenceDeviationImpactScope(
      project,
      REF_ACCEPTABLE,
      AT
    );
    assert.ok(impactScope.affected_entity_ids.includes(ENTITY_HOSPITAL));
    const standing = assessDeclaredStanding(
      project,
      ENTITY_HOSPITAL,
      {
        kind: "IMPACT_DECLARATION",
        impact_declaration_id: IMPACT_A,
      },
      AT
    );
    assert.equal(standing.status, "NO_DECLARED_STANDING");
  });

  it("firewall: Standing is not Authority and reverse", () => {
    const project = applyPatch(
      baseProject(),
      patch("standing_declaration", STANDING_A, standingDecl())
    );
    const standing = assessDeclaredStanding(
      project,
      ENTITY_HOSPITAL,
      {
        kind: "REFERENCE_CONDITION",
        reference_condition_id: REF_ACCEPTABLE,
      },
      AT
    );
    assert.equal(standing.status, "DECLARED_STANDING_PRESENT");
    const authority = assessDeclaredAuthority(
      project,
      ENTITY_HOSPITAL,
      "ESTABLISH_REFERENCE",
      {
        kind: "SUBJECT_STATE",
        subject_id: ENTITY_PIPE,
        state_kind: "pressure",
      },
      AT
    );
    assert.equal(authority.status, "NO_DECLARED_AUTHORITY");

    const authorityProject = applyPatch(
      baseProject(),
      patch("authority_declaration", AUTHORITY_A, authorityDecl())
    );
    const standingAbsent = assessDeclaredStanding(
      authorityProject,
      ORG_A,
      {
        kind: "REFERENCE_CONDITION",
        reference_condition_id: REF_ACCEPTABLE,
      },
      AT
    );
    assert.equal(standingAbsent.status, "NO_DECLARED_STANDING");
  });

  it("persists MandateDeclaration and assesses active/inactive mandate", () => {
    const next = applyPatch(
      baseProject(),
      patch(
        "mandate_declaration",
        MANDATE_A,
        mandateDecl({ valid_from: FROM, valid_until: UNTIL })
      )
    );
    assert.equal(next.mandate_declarations.length, 1);
    const active = assessMandate(next, ORG_A, OBJECTIVE_A, AT);
    assert.equal(active.status, "ACTIVE_MANDATE_PRESENT");
    const inactive = assessMandate(next, ORG_A, OBJECTIVE_A, UNTIL);
    assert.equal(inactive.status, "NO_ACTIVE_MANDATE");
  });

  it("firewall: Mandate does not imply Authority and reverse", () => {
    const mandateOnly = applyPatch(
      baseProject(),
      patch("mandate_declaration", MANDATE_A, mandateDecl())
    );
    const authority = assessObjectiveDeclarationAuthority(mandateOnly, OBJECTIVE_A, AT);
    assert.equal(authority.status, "NO_DECLARED_AUTHORITY");

    const authorityOnly = applyPatch(
      baseProject(),
      patch("authority_declaration", AUTHORITY_A, authorityDecl({
        power: "GOVERN_OBJECTIVE",
        scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
      }))
    );
    const mandate = assessMandate(authorityOnly, ORG_A, OBJECTIVE_A, AT);
    assert.equal(mandate.status, "NO_ACTIVE_MANDATE");
  });

  it("does not create Intent, Commitment, or Capability outputs from Mandate", () => {
    const next = applyPatch(baseProject(), patch("mandate_declaration", MANDATE_A, mandateDecl()));
    const json = JSON.stringify(next);
    for (const token of [
      '"Intent"',
      '"Commitment"',
      '"Capability"',
      '"can_execute"',
      '"Attention"',
    ]) {
      assert.equal(json.includes(token), false, `forbidden token ${token}`);
    }
  });

  it("assesses objective, impact, and measure declarer authority", () => {
    const project = applyPatch(baseProject(), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: AUTHORITY_A,
          payload: authorityDecl({
            power: "GOVERN_OBJECTIVE",
            scope: { kind: "REALITY_OBJECTIVE", objective_id: OBJECTIVE_A },
          }),
        },
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: AUTHORITY_B,
          payload: authorityDecl({
            id: AUTHORITY_B,
            power: "DECLARE_IMPACT",
            scope: {
              kind: "REFERENCE_CONDITION",
              reference_condition_id: REF_ACCEPTABLE,
            },
          }),
        },
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: "f9090909-0909-4909-8909-090909090903",
          payload: authorityDecl({
            id: "f9090909-0909-4909-8909-090909090903",
            power: "DECLARE_IMPACT_MEASURE",
            scope: {
              kind: "IMPACT_DECLARATION",
              impact_declaration_id: IMPACT_A,
            },
          }),
        },
      ],
    });
    assert.equal(
      assessObjectiveDeclarationAuthority(project, OBJECTIVE_A, AT).status,
      "DECLARED_AUTHORITY_PRESENT"
    );
    assert.equal(
      assessImpactDeclarationAuthority(project, IMPACT_A, AT).status,
      "DECLARED_AUTHORITY_PRESENT"
    );
    assert.equal(
      assessImpactMeasureDeclarationAuthority(project, MEASURE_A, AT).status,
      "DECLARED_AUTHORITY_PRESENT"
    );
  });

  it("does not resolve ReferenceConflict or ImpactDirectionConflict from Authority", () => {
    const project = baseProject({
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
    });
    const withAuthority = applyPatch(project, patch("authority_declaration", AUTHORITY_A, authorityDecl()));
    const refConflicts = detectReferenceConflicts(
      withAuthority.reference_conditions.filter(
        (entry) =>
          entry.reference_kind === "ACCEPTABLE" &&
          entry.subject_id === ENTITY_PIPE &&
          entry.state_kind === "pressure"
      ),
      AT
    );
    assert.ok(refConflicts.length > 0);
    const impactConflicts = detectImpactDirectionConflicts(
      withAuthority,
      REF_ACCEPTABLE,
      AT
    );
    assert.ok(impactConflicts.length > 0);
  });

  it("rejects deletion of entities referenced by governance declarations", () => {
    const project = applyPatch(baseProject(), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: AUTHORITY_A,
          payload: authorityDecl({ holder_entity_id: HOLDER_ONLY }),
        },
        {
          op: "upsert",
          entity: "standing_declaration",
          entity_id: STANDING_A,
          payload: standingDecl({ holder_entity_id: HOLDER_ONLY }),
        },
        {
          op: "upsert",
          entity: "mandate_declaration",
          entity_id: MANDATE_A,
          payload: mandateDecl({ holder_entity_id: HOLDER_ONLY }),
        },
      ],
    });
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [{ op: "delete", entity: "reality_entity", entity_id: HOLDER_ONLY }],
        }),
      /authority_declaration.holder_entity_id/
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [{ op: "delete", entity: "reality_objective", entity_id: OBJECTIVE_A }],
        }),
      /mandate_declaration/
    );
  });

  it("firewall: governance patch does not mutate ontic/epistemic/impact legacy layers", () => {
    const before = baseProject();
    const after = applyPatch(before, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "authority_declaration",
          entity_id: AUTHORITY_A,
          payload: authorityDecl(),
        },
      ],
    });
    assert.deepEqual(after.reality_events, before.reality_events);
    assert.deepEqual(after.reality_states, before.reality_states);
    assert.deepEqual(after.claims, before.claims);
    assert.deepEqual(after.evidence, before.evidence);
    assert.deepEqual(after.impact_declarations, before.impact_declarations);
    assert.deepEqual(after.goals, before.goals);
    assert.deepEqual(after.blockers, before.blockers);
  });

  it("assessment is read-only and deterministic", () => {
    const project = applyPatch(
      baseProject(),
      patch("authority_declaration", AUTHORITY_A, authorityDecl())
    );
    const scope = {
      kind: "SUBJECT_STATE" as const,
      subject_id: ENTITY_PIPE,
      state_kind: "pressure",
    };
    const a = assessDeclaredAuthority(project, ORG_A, "ESTABLISH_REFERENCE", scope, AT);
    const b = assessDeclaredAuthority(project, ORG_A, "ESTABLISH_REFERENCE", scope, AT);
    assert.deepEqual(a, b);
    assert.equal(
      governanceScopeKey(scope),
      "SUBJECT_STATE|f1010101-0101-4101-8101-010101010101|pressure"
    );
    const applicable = getApplicableAuthorityDeclarations(
      project,
      ORG_A,
      "ESTABLISH_REFERENCE",
      scope,
      AT
    );
    assert.equal(applicable.length, 1);
    const context = buildObjectiveGovernanceContext(project, OBJECTIVE_A, AT);
    assert.equal(context.objective_id, OBJECTIVE_A);
  });
});
