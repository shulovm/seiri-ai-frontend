import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import { PatchError } from "../errors.js";
import {
  assessReferenceDeviationImpactMeasurements,
  assessProblemImpactMeasurements,
  assessRiskImpactMeasurements,
  getApplicableImpactMeasureDeclarations,
  impactMeasureSemanticKey,
} from "../reality/impact-measurement.js";
import { discoverNormativeFindings } from "../reality/normative-discovery.js";
import { assessProspectiveRisk } from "../reality/prospective-risk-discovery.js";
import { applyPatch } from "../state-engine.js";
import type {
  FutureScenario,
  ImpactDeclaration,
  ImpactMeasureDeclaration,
  ProjectState,
  RealityEntity,
  ReferenceCondition,
  ScenarioLikelihoodEstimate,
  ScenarioStateProjection,
} from "../types.js";
import {
  validateProjectState,
  validateProjectStateV017,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV017,
  validProjectStateV0124,
} from "./fixtures.js";

const ENTITY_PIPE = "f1010101-0101-4101-8101-010101010101";
const ENTITY_HOSPITAL = "f1010101-0101-4101-8101-010101010102";
const DECLARER_A = "f1010101-0101-4101-8101-010101010103";
const DECLARER_B = "f1010101-0101-4101-8101-010101010104";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060901";
const IMPACT_A = "f7070707-0707-4707-8707-070707070901";
const IMPACT_B = "f7070707-0707-4707-8707-070707070902";
const MEASURE_A = "f8080808-0808-4808-8808-080808080901";
const MEASURE_B = "f8080808-0808-4808-8808-080808080902";
const SCENARIO_ID = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const PROJ_A = "fb0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const LIK_A = "fc0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const TS = "2026-08-24T12:00:00.000Z";
const FROM = "2026-08-24T00:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";
const PROJ_FOR = "2026-08-24T14:00:00.000Z";
const AS_OF = "2026-08-24T10:00:00.000Z";

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
    declared_by: { kind: "human", entity_id: DECLARER_A },
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
    metric_key: "outage_duration",
    unit: "hour",
    measure: { kind: "POINT", value: 3 },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", entity_id: DECLARER_A },
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
  measures?: ImpactMeasureDeclaration[];
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
      entity(DECLARER_A, "org-A", { kind: "organization" }),
      entity(DECLARER_B, "model-B", { kind: "organization" }),
    ],
    reference_conditions: input.references ?? [acceptableRef()],
    impact_declarations: input.impacts ?? [impactDecl()],
    impact_measure_declarations: input.measures ?? [],
    reality_states: input.states ?? [],
    future_scenarios: input.scenarios ?? [],
    scenario_state_projections: input.projections ?? [],
    scenario_likelihood_estimates: input.likelihoods ?? [],
  };
}

function riskProject(measures: ImpactMeasureDeclaration[] = []) {
  return projectWith({
    measures,
    scenarios: [
      {
        id: SCENARIO_ID,
        project_id: PROJECT_ID,
        label: "pressure drop",
        as_of: AS_OF,
        declared_by: { kind: "human", entity_id: DECLARER_A },
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
        probability: 0.4,
        estimated_by: { kind: "model", label: "model-A" },
        estimated_at: AS_OF,
        recorded_at: TS,
        created_at: TS,
        updated_at: TS,
      },
    ],
  });
}

function assertNoForbidden(value: unknown) {
  const json = JSON.stringify(value);
  for (const token of [
    '"severity"',
    '"impact_score"',
    '"risk_level"',
    '"expected_loss"',
    '"priority"',
    '"OPPORTUNITY"',
    '"risk_score"',
    '"fused_probability"',
  ]) {
    assert.equal(json.includes(token), false, `forbidden: ${token}`);
  }
}

describe("Impact Measurement (GROUND-018)", () => {
  it("persists ImpactMeasureDeclaration via StatePatch roundtrip", () => {
    const next = applyPatch(projectWith({}), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "impact_measure_declaration",
          entity_id: MEASURE_A,
          payload: measureDecl(),
        },
      ],
    });
    assert.equal(next.impact_measure_declarations.length, 1);
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.impact-measure-tmp");
    saveProject(next, { storageDir: dir });
    const loaded = loadProject(PROJECT_ID, { storageDir: dir });
    assert.equal(loaded.impact_measure_declarations[0]?.id, MEASURE_A);
  });

  it("migrates 0.1.7 → 0.1.13 with empty impact_measure_declarations and governance collections", () => {
    assert.ok(validateProjectStateV017(validProjectStateV017).valid);
    const migrated = migrateProjectState(validProjectStateV017);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.impact_measure_declarations, []);
    assert.deepEqual(migrated.authority_declarations, []);
    assert.deepEqual(migrated.standing_declarations, []);
    assert.deepEqual(migrated.mandate_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("rejects unknown ImpactDeclaration parent", () => {
    assert.throws(
      () =>
        applyPatch(projectWith({ impacts: [] }), {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "impact_measure_declaration",
              entity_id: MEASURE_A,
              payload: measureDecl(),
            },
          ],
        }),
      /missing ImpactDeclaration/
    );
  });

  it("rejects empty metric_key / unit and invalid measures", () => {
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
              entity: "impact_measure_declaration",
              entity_id: MEASURE_A,
              payload: measureDecl({ metric_key: "  " }),
            },
          ],
        }),
      /metric_key must be non-empty/
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
              entity: "impact_measure_declaration",
              entity_id: MEASURE_A,
              payload: measureDecl({ unit: "" }),
            },
          ],
        }),
      /unit must be non-empty/
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
              entity: "impact_measure_declaration",
              entity_id: MEASURE_A,
              payload: measureDecl({ measure: { kind: "POINT", value: -1 } }),
            },
          ],
        }),
      /non-negative/
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
              entity: "impact_measure_declaration",
              entity_id: MEASURE_A,
              payload: measureDecl({
                measure: { kind: "RANGE", min: 5, max: 2 },
              }),
            },
          ],
        }),
      /min <= max/
    );
  });

  it("accepts POINT 0 / RANGE [0,0] and rejects NaN", () => {
    const zero = applyPatch(projectWith({}), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "impact_measure_declaration",
          entity_id: MEASURE_A,
          payload: measureDecl({ measure: { kind: "POINT", value: 0 } }),
        },
      ],
    });
    assert.equal(zero.impact_measure_declarations[0]?.measure.kind, "POINT");
    const range = applyPatch(projectWith({}), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "impact_measure_declaration",
          entity_id: MEASURE_A,
          payload: measureDecl({
            measure: { kind: "RANGE", min: 0, max: 0 },
          }),
        },
      ],
    });
    assert.equal(range.impact_measure_declarations[0]?.measure.kind, "RANGE");
    assert.throws(
      () =>
        applyPatch(projectWith({}), {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "impact_measure_declaration",
              entity_id: MEASURE_A,
              payload: measureDecl({
                measure: { kind: "POINT", value: Number.NaN },
              }),
            },
          ],
        }),
      /finite non-negative/
    );
  });

  it("different units and metrics remain separate — no conversion", () => {
    const project = projectWith({
      measures: [
        measureDecl({ unit: "minute", measure: { kind: "POINT", value: 60 } }),
        measureDecl({
          id: MEASURE_B,
          unit: "hour",
          measure: { kind: "POINT", value: 1 },
          declared_by: { kind: "model", label: "model-B" },
        }),
      ],
    });
    const assessment = assessReferenceDeviationImpactMeasurements(
      project,
      REF_ACCEPTABLE,
      AT
    );
    assert.equal(assessment.metric_assessments.length, 2);
    assert.equal(assessment.has_multiple_units, true);
  });

  it("same value multiple declarers — no divergence; different values diverge", () => {
    const same = projectWith({
      measures: [
        measureDecl(),
        measureDecl({
          id: MEASURE_B,
          declared_by: { kind: "model", entity_id: DECLARER_B },
        }),
      ],
    });
    const sameAssessment = assessReferenceDeviationImpactMeasurements(
      same,
      REF_ACCEPTABLE,
      AT
    );
    assert.equal(sameAssessment.metric_assessments.length, 1);
    assert.equal(sameAssessment.has_measure_divergence, false);
    assert.equal(
      sameAssessment.metric_assessments[0]!.measure_declaration_ids.length,
      2
    );

    const diverge = projectWith({
      measures: [
        measureDecl({ measure: { kind: "POINT", value: 2 } }),
        measureDecl({
          id: MEASURE_B,
          measure: { kind: "POINT", value: 5 },
          declared_by: { kind: "model", label: "model-B" },
        }),
      ],
    });
    const divergeAssessment = assessReferenceDeviationImpactMeasurements(
      diverge,
      REF_ACCEPTABLE,
      AT
    );
    assert.equal(divergeAssessment.has_measure_divergence, true);
    assertNoForbidden(divergeAssessment);
  });

  it("RANGE divergence and POINT vs RANGE remain distinct", () => {
    const ranges = projectWith({
      measures: [
        measureDecl({ measure: { kind: "RANGE", min: 2, max: 4 } }),
        measureDecl({
          id: MEASURE_B,
          measure: { kind: "RANGE", min: 3, max: 5 },
          declared_by: { kind: "model", label: "m" },
        }),
      ],
    });
    assert.equal(
      assessReferenceDeviationImpactMeasurements(ranges, REF_ACCEPTABLE, AT)
        .has_measure_divergence,
      true
    );

    const mixed = projectWith({
      measures: [
        measureDecl({ measure: { kind: "POINT", value: 3 } }),
        measureDecl({
          id: MEASURE_B,
          measure: { kind: "RANGE", min: 2, max: 4 },
          declared_by: { kind: "model", label: "m" },
        }),
      ],
    });
    const mixedAssessment = assessReferenceDeviationImpactMeasurements(
      mixed,
      REF_ACCEPTABLE,
      AT
    );
    assert.equal(mixedAssessment.has_measure_divergence, true);
    assert.equal(mixedAssessment.metric_assessments[0]!.measures.length, 2);
  });

  it("parent/measure temporal applicability", () => {
    const inactiveParent = projectWith({
      impacts: [
        impactDecl({
          valid_from: "2026-08-24T12:00:00.000Z",
          valid_until: null,
        }),
      ],
      measures: [measureDecl()],
    });
    assert.equal(
      getApplicableImpactMeasureDeclarations(
        inactiveParent,
        [IMPACT_A],
        AT
      ).length,
      0
    );

    const inactiveMeasure = projectWith({
      measures: [
        measureDecl({
          valid_from: "2026-08-24T12:00:00.000Z",
          valid_until: null,
        }),
      ],
    });
    assert.equal(
      getApplicableImpactMeasureDeclarations(
        inactiveMeasure,
        [IMPACT_A],
        AT
      ).length,
      0
    );
  });

  it("Problem + Risk measurement integration", () => {
    const problemProject = projectWith({
      measures: [measureDecl()],
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
    const problem = discoverNormativeFindings(
      problemProject,
      ENTITY_PIPE,
      AT
    ).find((entry) => entry.kind === "PROBLEM");
    assert.ok(problem);
    const problemMeasure = assessProblemImpactMeasurements(
      problemProject,
      problem!
    );
    assert.equal(problemMeasure.has_measurements, true);
    assert.equal(problemMeasure.metric_assessments[0]!.metric_key, "outage_duration");

    const rp = riskProject([measureDecl()]);
    const risk = assessProspectiveRisk(rp, SCENARIO_ID).risk_findings[0];
    assert.ok(risk);
    const riskMeasure = assessRiskImpactMeasurements(rp, risk!);
    assert.equal(riskMeasure.has_measurements, true);
    assert.equal(riskMeasure.impact_scope.at, PROJ_FOR);
  });

  it("Risk uses projected_for — measure only valid at as_of is excluded", () => {
    const rp = riskProject([
      measureDecl({
        valid_from: AS_OF,
        valid_until: "2026-08-24T11:00:00.000Z",
      }),
    ]);
    const risk = assessProspectiveRisk(rp, SCENARIO_ID).risk_findings[0]!;
    assert.equal(assessRiskImpactMeasurements(rp, risk).has_measurements, false);
  });

  it("no measurement / no ImpactDeclaration — has_measurements false; findings remain", () => {
    const withImpactOnly = projectWith({ measures: [] });
    assert.equal(
      assessReferenceDeviationImpactMeasurements(
        withImpactOnly,
        REF_ACCEPTABLE,
        AT
      ).has_measurements,
      false
    );

    const noImpact = projectWith({
      impacts: [],
      measures: [],
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
    const problem = discoverNormativeFindings(noImpact, ENTITY_PIPE, AT).find(
      (entry) => entry.kind === "PROBLEM"
    );
    assert.ok(problem);
    assert.equal(
      assessProblemImpactMeasurements(noImpact, problem!).has_measurements,
      false
    );
  });

  it("deviation magnitude firewall — no automatic Impact magnitude from Current/Reference", () => {
    const project = projectWith({
      measures: [],
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
    const assessment = assessReferenceDeviationImpactMeasurements(
      project,
      REF_ACCEPTABLE,
      AT
    );
    assert.equal(assessment.has_measurements, false);
    assert.equal(JSON.stringify(assessment).includes("15"), false);
  });

  it("Scenario likelihood multiplication firewall — no expected_loss", () => {
    const rp = riskProject([
      measureDecl({
        metric_key: "economic_cost",
        unit: "JPY",
        measure: { kind: "POINT", value: 1000000 },
      }),
    ]);
    const risk = assessProspectiveRisk(rp, SCENARIO_ID).risk_findings[0]!;
    const assessment = assessRiskImpactMeasurements(rp, risk);
    assert.equal(assessment.has_measurements, true);
    assertNoForbidden(assessment);
    assert.equal(JSON.stringify(assessment).includes("400000"), false);
  });

  it("direction arithmetic firewall — ADVERSE and BENEFICIAL not netted", () => {
    const project = projectWith({
      impacts: [
        impactDecl({ direction: "ADVERSE" }),
        impactDecl({
          id: IMPACT_B,
          direction: "BENEFICIAL",
          declared_by: { kind: "model", label: "m" },
        }),
      ],
      measures: [
        measureDecl({
          impact_declaration_id: IMPACT_A,
          measure: { kind: "POINT", value: 100 },
        }),
        measureDecl({
          id: MEASURE_B,
          impact_declaration_id: IMPACT_B,
          measure: { kind: "POINT", value: 100 },
          declared_by: { kind: "model", label: "m" },
        }),
      ],
    });
    const assessment = assessReferenceDeviationImpactMeasurements(
      project,
      REF_ACCEPTABLE,
      AT
    );
    assert.equal(assessment.metric_assessments.length, 2);
    assert.ok(
      assessment.metric_assessments.some((entry) => entry.direction === "ADVERSE")
    );
    assert.ok(
      assessment.metric_assessments.some(
        (entry) => entry.direction === "BENEFICIAL"
      )
    );
  });

  it("deletion guard — ImpactDeclaration referenced by measure", () => {
    const project = applyPatch(projectWith({}), {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "impact_measure_declaration",
          entity_id: MEASURE_A,
          payload: measureDecl(),
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
            { op: "delete", entity: "impact_declaration", entity_id: IMPACT_A },
          ],
        }),
      (error: unknown) =>
        error instanceof PatchError &&
        /impact_measure_declaration/.test(error.message)
    );
  });

  it("read-only + firewalls + determinism", () => {
    const project = projectWith({ measures: [measureDecl()] });
    const before = structuredClone(project);
    const a = assessReferenceDeviationImpactMeasurements(
      project,
      REF_ACCEPTABLE,
      AT
    );
    const b = assessReferenceDeviationImpactMeasurements(
      project,
      REF_ACCEPTABLE,
      AT
    );
    assert.deepEqual(project, before);
    assert.deepEqual(a, b);
    assert.equal(impactMeasureSemanticKey({ kind: "POINT", value: 3 }), "POINT|3");
    const source = readFileSync(
      join(process.cwd(), "ground-core/reality/impact-measurement.ts"),
      "utf8"
    );
    assert.ok(
      !source.split("\n").some(
        (line) =>
          /^\s*import\b/.test(line) &&
          /state-engine|file-store|studio\//.test(line)
      )
    );
    assert.equal(source.includes("unitConversion"), false);
  });
});
