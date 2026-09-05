import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import {
  assessProblemImpactScope,
  assessReferenceDeviationImpactScope,
  assessRiskImpactScope,
  detectImpactDirectionConflicts,
  getApplicableImpactDeclarations,
} from "../reality/impact-core.js";
import { discoverNormativeFindings } from "../reality/normative-discovery.js";
import { assessProspectiveRisk } from "../reality/prospective-risk-discovery.js";
import { applyPatch } from "../state-engine.js";
import { PatchError } from "../errors.js";
import type {
  FutureScenario,
  ImpactDeclaration,
  ProjectState,
  RealityEntity,
  ReferenceCondition,
  ScenarioLikelihoodEstimate,
  ScenarioStateProjection,
} from "../types.js";
import {
  validateProjectState,
  validateProjectStateV016,
} from "../validate.js";
import { migrateProjectState } from "../migrate.js";
import {
  PROJECT_ID,
  validProjectStateV016,
  validProjectStateV0124,
} from "./fixtures.js";

const ENTITY_PIPE = "f1010101-0101-4101-8101-010101010101";
const ENTITY_HOSPITAL = "f1010101-0101-4101-8101-010101010102";
const ENTITY_SUPPLIER = "f1010101-0101-4101-8101-010101010103";
const DECLARER_ID = "f1010101-0101-4101-8101-010101010104";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060901";
const REF_EXPECTED = "f6060606-0606-4606-8606-060606060902";
const IMPACT_A = "f7070707-0707-4707-8707-070707070901";
const IMPACT_B = "f7070707-0707-4707-8707-070707070902";
const IMPACT_C = "f7070707-0707-4707-8707-070707070903";
const IMPACT_D = "f7070707-0707-4707-8707-070707070904";
const SCENARIO_ID = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const PROJ_A = "fb0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const LIK_A = "fc0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const TS = "2026-08-24T12:00:00.000Z";
const FROM = "2026-08-24T00:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";
const PROJ_FOR = "2026-08-24T14:00:00.000Z";

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
    declared_by: { kind: "organization", entity_id: DECLARER_ID },
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
    declared_by: { kind: "human", entity_id: DECLARER_ID },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function projectWith(input: {
  entities?: RealityEntity[];
  references?: ReferenceCondition[];
  impacts?: ImpactDeclaration[];
  states?: ProjectState["reality_states"];
  scenarios?: FutureScenario[];
  projections?: ScenarioStateProjection[];
  likelihoods?: ScenarioLikelihoodEstimate[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [
      entity(ENTITY_PIPE, "pipe-A"),
      entity(ENTITY_HOSPITAL, "hospital-B"),
      entity(ENTITY_SUPPLIER, "supplier-D"),
      entity(DECLARER_ID, "org-A", { kind: "organization" }),
    ],
    reference_conditions: input.references ?? [acceptableRef()],
    impact_declarations: input.impacts ?? [],
    reality_states: input.states ?? [],
    future_scenarios: input.scenarios ?? [],
    scenario_state_projections: input.projections ?? [],
    scenario_likelihood_estimates: input.likelihoods ?? [],
  };
}

function assertNoForbidden(value: unknown) {
  const json = JSON.stringify(value);
  for (const token of [
    '"OPPORTUNITY"',
    '"severity"',
    '"impact_score"',
    '"risk_level"',
    '"priority"',
    '"CAUSES"',
    '"causal_strength"',
    '"caused_by"',
  ]) {
    assert.equal(json.includes(token), false, `forbidden: ${token}`);
  }
}

describe("Impact Core (GROUND-017)", () => {
  it("persists ImpactDeclaration via StatePatch roundtrip", () => {
    const base = projectWith({});
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "impact_declaration",
          entity_id: IMPACT_A,
          payload: impactDecl(),
        },
      ],
    });
    assert.equal(next.impact_declarations.length, 1);
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.impact-test-tmp");
    saveProject(next, { storageDir: dir });
    const loaded = loadProject(PROJECT_ID, { storageDir: dir });
    assert.equal(loaded.impact_declarations[0]?.id, IMPACT_A);
  });

  it("migrates 0.1.6 → 0.1.7 with empty impact_declarations", () => {
    assert.ok(validateProjectStateV016(validProjectStateV016).valid);
    const migrated = migrateProjectState(validProjectStateV016);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.impact_declarations, []);
    assert.deepEqual(migrated.impact_measure_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("rejects basis on EXPECTED Reference", () => {
    const project = projectWith({
      references: [
        acceptableRef({
          id: REF_EXPECTED,
          reference_kind: "EXPECTED",
        }),
      ],
    });
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "impact_declaration",
              entity_id: IMPACT_A,
              payload: impactDecl({
                basis: {
                  kind: "REFERENCE_DEVIATION",
                  reference_condition_id: REF_EXPECTED,
                },
              }),
            },
          ],
        }),
      /ACCEPTABLE ReferenceCondition/
    );
  });

  it("rejects unknown Reference and affected Entity", () => {
    const project = projectWith({});
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "impact_declaration",
              entity_id: IMPACT_A,
              payload: impactDecl({
                basis: {
                  kind: "REFERENCE_DEVIATION",
                  reference_condition_id: "00000000-0000-4000-8000-000000000099",
                },
              }),
            },
          ],
        }),
      /missing ReferenceCondition/
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "impact_declaration",
              entity_id: IMPACT_A,
              payload: impactDecl({
                affected_entity_id: "00000000-0000-4000-8000-000000000099",
              }),
            },
          ],
        }),
      /missing affected_entity_id/
    );
  });

  it("assessProblemImpactScope — hospital affected, Problem unchanged", () => {
    const project = projectWith({
      impacts: [impactDecl()],
      states: [
        {
          id: "f3030303-0303-4303-8303-030303030901",
          project_id: PROJECT_ID,
          subject_id: ENTITY_PIPE,
          kind: "pressure",
          value: 55,
          valid_from: FROM,
          valid_until: null,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
    });
    const problems = discoverNormativeFindings(project, ENTITY_PIPE, AT);
    const problem = problems.find((entry) => entry.kind === "PROBLEM");
    assert.ok(problem);
    const scope = assessProblemImpactScope(project, problem!);
    assert.equal(scope.has_declared_affectedness, true);
    assert.deepEqual(scope.adverse_affected_entity_ids, [ENTITY_HOSPITAL]);
    assert.equal(scope.positions.length, 1);
    const before = structuredClone(problems);
    assessProblemImpactScope(project, problem!);
    assert.deepEqual(discoverNormativeFindings(project, ENTITY_PIPE, AT), before);
    assertNoForbidden(scope);
  });

  it("assessRiskImpactScope — same declaration at projected_for", () => {
    const project = projectWith({
      impacts: [impactDecl()],
      scenarios: [
        {
          id: SCENARIO_ID,
          project_id: PROJECT_ID,
          label: "pressure drop",
          as_of: "2026-08-24T10:00:00.000Z",
          declared_by: { kind: "human", entity_id: DECLARER_ID },
          recorded_at: TS,
          basis_state_ids: [],
          basis_claim_ids: [],
          basis_evidence_ids: [],
          created_at: TS,
          updated_at: TS,
        },
      ],
      projections: [
        {
          id: PROJ_A,
          project_id: PROJECT_ID,
          scenario_id: SCENARIO_ID,
          subject_id: ENTITY_PIPE,
          state_kind: "pressure",
          projected_value: 55,
          projected_for: PROJ_FOR,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      likelihoods: [
        {
          id: LIK_A,
          project_id: PROJECT_ID,
          scenario_id: SCENARIO_ID,
          probability: 0.3,
          estimated_by: { kind: "model", label: "model-A" },
          estimated_at: "2026-08-24T10:00:00.000Z",
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
    });
    const risk = assessProspectiveRisk(project, SCENARIO_ID).risk_findings[0];
    assert.ok(risk);
    const scope = assessRiskImpactScope(project, risk!);
    assert.equal(scope.has_declared_affectedness, true);
    assert.equal(scope.at, PROJ_FOR);
    assert.equal(risk!.reference_condition_id, REF_ACCEPTABLE);
  });

  it("no ImpactDeclaration — Problem and Risk remain, has_declared_affectedness false", () => {
    const project = projectWith({
      states: [
        {
          id: "f3030303-0303-4303-8303-030303030901",
          project_id: PROJECT_ID,
          subject_id: ENTITY_PIPE,
          kind: "pressure",
          value: 55,
          valid_from: FROM,
          valid_until: null,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      scenarios: [
        {
          id: SCENARIO_ID,
          project_id: PROJECT_ID,
          label: "s",
          as_of: "2026-08-24T10:00:00.000Z",
          declared_by: { kind: "human", entity_id: DECLARER_ID },
          recorded_at: TS,
          basis_state_ids: [],
          basis_claim_ids: [],
          basis_evidence_ids: [],
          created_at: TS,
          updated_at: TS,
        },
      ],
      projections: [
        {
          id: PROJ_A,
          project_id: PROJECT_ID,
          scenario_id: SCENARIO_ID,
          subject_id: ENTITY_PIPE,
          state_kind: "pressure",
          projected_value: 55,
          projected_for: PROJ_FOR,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      likelihoods: [
        {
          id: LIK_A,
          project_id: PROJECT_ID,
          scenario_id: SCENARIO_ID,
          probability: 0.3,
          estimated_by: { kind: "model", label: "m" },
          estimated_at: "2026-08-24T10:00:00.000Z",
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
    });
    const problem = discoverNormativeFindings(project, ENTITY_PIPE, AT).find(
      (entry) => entry.kind === "PROBLEM"
    );
    assert.ok(problem);
    assert.equal(assessProblemImpactScope(project, problem!).has_declared_affectedness, false);
    const risk = assessProspectiveRisk(project, SCENARIO_ID).risk_findings[0];
    assert.ok(risk);
    assert.equal(assessRiskImpactScope(project, risk!).has_declared_affectedness, false);
  });

  it("self affectedness is not automatic", () => {
    const project = projectWith({});
    const scope = assessReferenceDeviationImpactScope(project, REF_ACCEPTABLE, AT);
    assert.deepEqual(scope.affected_entity_ids, []);
    const withSelf = projectWith({
      impacts: [
        impactDecl({
          affected_entity_id: ENTITY_PIPE,
          dimension: "physical_integrity",
        }),
      ],
    });
    const selfScope = assessReferenceDeviationImpactScope(
      withSelf,
      REF_ACCEPTABLE,
      AT
    );
    assert.ok(selfScope.affected_entity_ids.includes(ENTITY_PIPE));
    assert.equal(selfScope.has_cross_entity_affectedness, false);
  });

  it("cross-entity affectedness", () => {
    const project = projectWith({ impacts: [impactDecl()] });
    const scope = assessReferenceDeviationImpactScope(project, REF_ACCEPTABLE, AT);
    assert.equal(scope.has_cross_entity_affectedness, true);
    assert.equal(scope.deviation_subject_id, ENTITY_PIPE);
  });

  it("multiple dimensions — two positions", () => {
    const project = projectWith({
      impacts: [
        impactDecl(),
        impactDecl({
          id: IMPACT_B,
          dimension: "economic_cost",
        }),
      ],
    });
    const scope = assessReferenceDeviationImpactScope(project, REF_ACCEPTABLE, AT);
    assert.equal(scope.positions.length, 2);
    assert.equal(scope.impact_dimensions.length, 2);
  });

  it("same direction multiple declarers — one position, two declaration IDs", () => {
    const project = projectWith({
      impacts: [
        impactDecl(),
        impactDecl({
          id: IMPACT_B,
          declared_by: { kind: "organization", entity_id: DECLARER_ID },
        }),
      ],
    });
    const scope = assessReferenceDeviationImpactScope(project, REF_ACCEPTABLE, AT);
    assert.equal(scope.positions.length, 1);
    assert.equal(scope.positions[0]!.declaration_ids.length, 2);
    assert.equal(scope.positions[0]!.declarers.length, 2);
  });

  it("opposite direction conflict — no winner", () => {
    const project = projectWith({
      impacts: [
        impactDecl(),
        impactDecl({
          id: IMPACT_B,
          direction: "BENEFICIAL",
          declared_by: { kind: "model", label: "model-B" },
        }),
      ],
    });
    const conflicts = detectImpactDirectionConflicts(
      project,
      REF_ACCEPTABLE,
      AT
    );
    assert.equal(conflicts.length, 1);
    assert.ok(conflicts[0]!.adverse_declaration_ids.length >= 1);
    assert.ok(conflicts[0]!.beneficial_declaration_ids.length >= 1);
    const scope = assessReferenceDeviationImpactScope(project, REF_ACCEPTABLE, AT);
    assert.equal(scope.has_direction_conflict, true);
    assert.equal(scope.positions.length, 2);
  });

  it("different dimensions are not direction conflict", () => {
    const project = projectWith({
      impacts: [
        impactDecl({ direction: "ADVERSE" }),
        impactDecl({
          id: IMPACT_B,
          dimension: "economic_cost",
          direction: "BENEFICIAL",
        }),
      ],
    });
    assert.equal(
      detectImpactDirectionConflicts(project, REF_ACCEPTABLE, AT).length,
      0
    );
  });

  it("temporal applicability [valid_from, valid_until)", () => {
    const project = projectWith({
      impacts: [
        impactDecl({
          valid_from: "2026-08-24T10:00:00.000Z",
          valid_until: "2026-08-24T11:00:00.000Z",
        }),
      ],
    });
    assert.equal(
      getApplicableImpactDeclarations(
        project,
        REF_ACCEPTABLE,
        "2026-08-24T09:59:00.000Z"
      ).length,
      0
    );
    assert.equal(
      getApplicableImpactDeclarations(
        project,
        REF_ACCEPTABLE,
        "2026-08-24T10:00:00.000Z"
      ).length,
      1
    );
    assert.equal(
      getApplicableImpactDeclarations(
        project,
        REF_ACCEPTABLE,
        "2026-08-24T10:59:00.000Z"
      ).length,
      1
    );
    assert.equal(
      getApplicableImpactDeclarations(
        project,
        REF_ACCEPTABLE,
        "2026-08-24T11:00:00.000Z"
      ).length,
      0
    );
  });

  it("Risk uses projected_for not scenario.as_of", () => {
    const project = projectWith({
      impacts: [
        impactDecl({
          valid_from: "2026-08-24T10:00:00.000Z",
          valid_until: "2026-08-24T11:00:00.000Z",
        }),
      ],
      scenarios: [
        {
          id: SCENARIO_ID,
          project_id: PROJECT_ID,
          label: "s",
          as_of: "2026-08-24T10:00:00.000Z",
          declared_by: { kind: "human", entity_id: DECLARER_ID },
          recorded_at: TS,
          basis_state_ids: [],
          basis_claim_ids: [],
          basis_evidence_ids: [],
          created_at: TS,
          updated_at: TS,
        },
      ],
      projections: [
        {
          id: PROJ_A,
          project_id: PROJECT_ID,
          scenario_id: SCENARIO_ID,
          subject_id: ENTITY_PIPE,
          state_kind: "pressure",
          projected_value: 55,
          projected_for: PROJ_FOR,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      likelihoods: [
        {
          id: LIK_A,
          project_id: PROJECT_ID,
          scenario_id: SCENARIO_ID,
          probability: 0.3,
          estimated_by: { kind: "model", label: "m" },
          estimated_at: "2026-08-24T10:00:00.000Z",
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
    });
    const risk = assessProspectiveRisk(project, SCENARIO_ID).risk_findings[0]!;
    assert.equal(assessRiskImpactScope(project, risk).has_declared_affectedness, false);
  });

  it("deletion guards for Reference and Entity", () => {
    const project = applyPatch(projectWith({}), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "impact_declaration",
          entity_id: IMPACT_A,
          payload: impactDecl(),
        },
      ],
    });
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reference_condition", entity_id: REF_ACCEPTABLE },
          ],
        }),
      (error: unknown) =>
        error instanceof PatchError &&
        /impact_declaration/.test(error.message)
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reality_entity", entity_id: ENTITY_HOSPITAL },
          ],
        }),
      (error: unknown) =>
        error instanceof PatchError &&
        /impact_declaration.affected_entity_id/.test(error.message)
    );
  });

  it("firewalls — ontic/epistemic/discovery/prospective/legacy read-only", () => {
    const project = projectWith({ impacts: [impactDecl()] });
    const before = structuredClone(project);
    assessReferenceDeviationImpactScope(project, REF_ACCEPTABLE, AT);
    assert.deepEqual(project, before);
    const source = readFileSync(
      join(process.cwd(), "ground-core/reality/impact-core.ts"),
      "utf8"
    );
    assert.ok(
      !source.split("\n").some(
        (line) =>
          /^\s*import\b/.test(line) &&
          /state-engine|file-store|studio\//.test(line)
      )
    );
  });

  it("determinism — repeated assessment deepEqual", () => {
    const project = projectWith({
      impacts: [
        impactDecl(),
        impactDecl({ id: IMPACT_B, dimension: "economic_cost" }),
      ],
    });
    const a = assessReferenceDeviationImpactScope(project, REF_ACCEPTABLE, AT);
    const b = assessReferenceDeviationImpactScope(project, REF_ACCEPTABLE, AT);
    assert.deepEqual(a, b);
  });
});
