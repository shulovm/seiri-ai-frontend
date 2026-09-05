import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessFutureScenario,
  assessScenarioLikelihood,
  assessScenarioReferences,
  detectScenarioProjectionConflicts,
} from "../reality/prospective-core.js";
import { applyPatch } from "../state-engine.js";
import { PatchError } from "../errors.js";
import type {
  FutureScenario,
  ProjectState,
  RealityEntity,
  RealityState,
  ReferenceCondition,
  ScenarioLikelihoodEstimate,
  ScenarioStateProjection,
} from "../types.js";
import { validateProjectState, validateProjectStateV015 } from "../validate.js";
import { PROJECT_ID, validProjectStateV015, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_ID = "f1010101-0101-4101-8101-010101010101";
const ENTITY_B = "f1010101-0101-4101-8101-010101010102";
const DECLARER_ID = "f1010101-0101-4101-8101-010101010103";
const SCENARIO_ID = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const PROJ_A = "fb0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const PROJ_B = "fb0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b02";
const PROJ_C = "fb0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b03";
const LIK_A = "fc0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const LIK_B = "fc0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c02";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060901";
const REF_ACCEPTABLE_B = "f6060606-0606-4606-8606-060606060902";
const REF_EXPECTED = "f6060606-0606-4606-8606-060606060903";
const REF_DESIRED = "f6060606-0606-4606-8606-060606060904";
const STATE_ID = "f3030303-0303-4303-8303-030303030901";
const TS = "2026-08-24T12:00:00.000Z";
const AS_OF = "2026-08-24T10:00:00.000Z";
const PROJ_FOR = "2026-08-24T14:00:00.000Z";
const PROJ_FOR_LATE = "2026-08-24T15:00:00.000Z";

function entity(overrides: Partial<RealityEntity> = {}): RealityEntity {
  return {
    id: ENTITY_ID,
    project_id: PROJECT_ID,
    kind: "asset",
    label: "pipe-A",
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function entityB(): RealityEntity {
  return {
    id: ENTITY_B,
    project_id: PROJECT_ID,
    kind: "asset",
    label: "pipe-B",
    created_at: TS,
    updated_at: TS,
  };
}

function declarerEntity(): RealityEntity {
  return {
    id: DECLARER_ID,
    project_id: PROJECT_ID,
    kind: "organization",
    label: "org-A",
    created_at: TS,
    updated_at: TS,
  };
}

function realityState(overrides: Partial<RealityState> = {}): RealityState {
  return {
    id: STATE_ID,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    kind: "pressure",
    value: 80,
    valid_from: "2026-08-24T00:00:00.000Z",
    valid_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function scenario(overrides: Partial<FutureScenario> = {}): FutureScenario {
  return {
    id: SCENARIO_ID,
    project_id: PROJECT_ID,
    label: "pressure drop scenario",
    as_of: AS_OF,
    declared_by: { kind: "human", entity_id: DECLARER_ID },
    recorded_at: TS,
    basis_state_ids: [],
    basis_claim_ids: [],
    basis_evidence_ids: [],
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function projection(
  overrides: Partial<ScenarioStateProjection> = {}
): ScenarioStateProjection {
  return {
    id: PROJ_A,
    project_id: PROJECT_ID,
    scenario_id: SCENARIO_ID,
    subject_id: ENTITY_ID,
    state_kind: "pressure",
    projected_value: 55,
    projected_for: PROJ_FOR,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function likelihood(
  overrides: Partial<ScenarioLikelihoodEstimate> = {}
): ScenarioLikelihoodEstimate {
  return {
    id: LIK_A,
    project_id: PROJECT_ID,
    scenario_id: SCENARIO_ID,
    probability: 0.3,
    estimated_by: { kind: "model", label: "model-A" },
    estimated_at: AS_OF,
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
    subject_id: ENTITY_ID,
    state_kind: "pressure",
    reference_kind: "ACCEPTABLE",
    criterion: {
      kind: "NUMERIC_RANGE",
      min: 70,
      max: 90,
      min_inclusive: true,
      max_inclusive: true,
    },
    valid_from: "2026-08-24T13:00:00.000Z",
    valid_until: "2026-08-24T15:00:00.000Z",
    declared_by: { kind: "organization", entity_id: DECLARER_ID },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function projectWith(input: {
  entities?: RealityEntity[];
  states?: RealityState[];
  references?: ReferenceCondition[];
  scenarios?: FutureScenario[];
  projections?: ScenarioStateProjection[];
  likelihoods?: ScenarioLikelihoodEstimate[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [entity(), entityB(), declarerEntity()],
    reality_states: input.states ?? [],
    reference_conditions: input.references ?? [],
    future_scenarios: input.scenarios ?? [],
    scenario_state_projections: input.projections ?? [],
    scenario_likelihood_estimates: input.likelihoods ?? [],
  };
}

function assertNoForbidden(value: unknown) {
  const json = JSON.stringify(value);
  for (const token of [
    '"RISK"',
    '"risk_score"',
    '"severity"',
    '"priority"',
    '"fused_probability"',
    '"CAUSES"',
    '"caused_by"',
  ]) {
    assert.ok(!json.includes(token), token);
  }
}

describe("Prospective Core (GROUND-015)", () => {
  it("persists FutureScenario via StatePatch roundtrip", () => {
    const base = projectWith({});
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "future_scenario",
          entity_id: SCENARIO_ID,
          payload: scenario(),
        },
      ],
    });
    assert.equal(next.future_scenarios.length, 1);
    assert.equal(next.schema_version, "0.1.24");

    const dir = join(process.cwd(), "ground-core/storage/.prosp-test-tmp");
    saveProject(next, { storageDir: dir });
    const loaded = loadProject(PROJECT_ID, { storageDir: dir });
    assert.equal(loaded.future_scenarios[0]?.id, SCENARIO_ID);
  });

  it("migrates 0.1.5 → 0.1.6 with empty prospective collections", () => {
    assert.ok(validateProjectStateV015(validProjectStateV015).valid);
    const migrated = migrateProjectState(validProjectStateV015);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.future_scenarios, []);
    assert.deepEqual(migrated.scenario_state_projections, []);
    assert.deepEqual(migrated.scenario_likelihood_estimates, []);
    assert.deepEqual(migrated.impact_declarations, []);
    assert.deepEqual(migrated.impact_measure_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("persists valid future projection roundtrip", () => {
    const base = projectWith({ scenarios: [scenario()] });
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "scenario_state_projection",
          entity_id: PROJ_A,
          payload: projection(),
        },
      ],
    });
    assert.equal(next.scenario_state_projections.length, 1);
  });

  it("rejects projection when projected_for <= scenario.as_of", () => {
    const base = projectWith({ scenarios: [scenario()] });
    assert.throws(
      () =>
        applyPatch(base, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "scenario_state_projection",
              entity_id: PROJ_A,
              payload: projection({ projected_for: AS_OF }),
            },
          ],
        }),
      (error: unknown) =>
        error instanceof PatchError && /projected_for must be after/.test(error.message)
    );
  });

  it("allows multi-entity Scenario projections", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [
        projection(),
        projection({
          id: PROJ_B,
          subject_id: ENTITY_B,
          state_kind: "pressure",
          projected_value: 60,
        }),
      ],
    });
    const assessment = assessFutureScenario(project, SCENARIO_ID);
    assert.equal(assessment.projections.length, 2);
  });

  it("rejects exact duplicate semantic projection", () => {
    const base = projectWith({
      scenarios: [scenario()],
      projections: [projection()],
    });
    assert.throws(
      () =>
        applyPatch(base, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "scenario_state_projection",
              entity_id: PROJ_B,
              payload: projection({ id: PROJ_B }),
            },
          ],
        }),
      /duplicates semantic projection/
    );
  });

  it("detects projection conflict for distinct values", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [
        projection({ projected_value: "normal", state_kind: "condition" }),
        projection({
          id: PROJ_B,
          projected_value: "leaking",
          state_kind: "condition",
        }),
      ],
    });
    const conflicts = detectScenarioProjectionConflicts(project, SCENARIO_ID);
    assert.equal(conflicts.length, 1);
    assert.equal(conflicts[0]?.projection_ids.length, 2);
    assert.equal(conflicts[0]?.value_keys.length, 2);
  });

  it("accepts likelihood 0 and 1, rejects out of bounds", () => {
    const base = projectWith({ scenarios: [scenario()] });
    const low = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "scenario_likelihood_estimate",
          entity_id: LIK_A,
          payload: likelihood({ probability: 0 }),
        },
      ],
    });
    assert.equal(low.scenario_likelihood_estimates[0]?.probability, 0);

    const high = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "scenario_likelihood_estimate",
          entity_id: LIK_B,
          payload: likelihood({ id: LIK_B, probability: 1 }),
        },
      ],
    });
    assert.equal(high.scenario_likelihood_estimates[0]?.probability, 1);

    assert.throws(
      () =>
        applyPatch(base, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "scenario_likelihood_estimate",
              entity_id: LIK_A,
              payload: likelihood({ probability: -0.01 }),
            },
          ],
        }),
      PatchError
    );
    assert.throws(
      () =>
        applyPatch(base, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "scenario_likelihood_estimate",
              entity_id: LIK_A,
              payload: likelihood({ probability: 1.01 }),
            },
          ],
        }),
      PatchError
    );
  });

  it("preserves multiple likelihood estimates without fusion", () => {
    const project = projectWith({
      scenarios: [scenario()],
      likelihoods: [
        likelihood({ probability: 0.2 }),
        likelihood({
          id: LIK_B,
          probability: 0.7,
          estimated_by: { kind: "model", label: "model-B" },
        }),
      ],
    });
    const assessment = assessScenarioLikelihood(project, SCENARIO_ID);
    assert.equal(assessment.status, "ESTIMATED");
    assert.equal(assessment.estimates.length, 2);
    assert.equal(assessment.has_multiple_values, true);
    assert.equal(assessment.probability_values.length, 2);
    assertNoForbidden(assessment);
  });

  it("preserves same probability from different sources", () => {
    const project = projectWith({
      scenarios: [scenario()],
      likelihoods: [
        likelihood({ probability: 0.5, estimated_by: { kind: "model", label: "A" } }),
        likelihood({
          id: LIK_B,
          probability: 0.5,
          estimated_by: { kind: "human", label: "B" },
        }),
      ],
    });
    const assessment = assessScenarioLikelihood(project, SCENARIO_ID);
    assert.equal(assessment.estimates.length, 2);
    assert.equal(assessment.source_summary.length, 2);
  });

  it("PROJECTED_ACCEPTABLE_DEVIATION without RISK", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
    });
    const ref = assessScenarioReferences(project, SCENARIO_ID);
    assert.ok(
      ref.projected_reference_findings.some(
        (f) => f.kind === "PROJECTED_ACCEPTABLE_DEVIATION"
      )
    );
    assert.equal(ref.has_projected_acceptable_deviation, true);
    assertNoForbidden(ref);
  });

  it("PROJECTED Acceptable match — no deviation finding", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 80 })],
      references: [acceptableRef()],
    });
    const ref = assessScenarioReferences(project, SCENARIO_ID);
    assert.equal(ref.has_projected_acceptable_deviation, false);
    assert.ok(!JSON.stringify(ref).includes("SAFE"));
  });

  it("PROJECTED_EXPECTED_DEVIATION — no RISK", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [
        acceptableRef({
          id: REF_EXPECTED,
          reference_kind: "EXPECTED",
          criterion: { kind: "EQUALS", value: 100 },
          valid_from: "2026-08-24T00:00:00.000Z",
          valid_until: null,
        }),
      ],
    });
    const ref = assessScenarioReferences(project, SCENARIO_ID);
    assert.ok(
      ref.projected_reference_findings.some(
        (f) => f.kind === "PROJECTED_EXPECTED_DEVIATION"
      )
    );
  });

  it("PROJECTED_DESIRED_GAP — no NEED/OPPORTUNITY", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [
        projection({ projected_value: "blue", state_kind: "color" }),
      ],
      references: [
        acceptableRef({
          id: REF_DESIRED,
          state_kind: "color",
          reference_kind: "DESIRED",
          criterion: { kind: "EQUALS", value: "green" },
          valid_from: "2026-08-24T00:00:00.000Z",
          valid_until: null,
        }),
      ],
    });
    const ref = assessScenarioReferences(project, SCENARIO_ID);
    assert.ok(
      ref.projected_reference_findings.some(
        (f) => f.kind === "PROJECTED_DESIRED_GAP"
      )
    );
    assertNoForbidden(ref);
  });

  it("Reference applicability uses projected_for not as_of", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [
        projection({ projected_value: 80, projected_for: PROJ_FOR }),
        projection({
          id: PROJ_B,
          projected_value: 80,
          projected_for: PROJ_FOR_LATE,
        }),
      ],
      references: [acceptableRef()],
    });
    const ref = assessScenarioReferences(project, SCENARIO_ID);
    const at14 = ref.projected_reference_comparisons.filter(
      (c) => c.projected_for === PROJ_FOR
    );
    const at15 = ref.projected_reference_comparisons.filter(
      (c) => c.projected_for === PROJ_FOR_LATE
    );
    assert.equal(at14.length, 1);
    assert.equal(at15.length, 0);
  });

  it("conflicting future References — no winner", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 72 })],
      references: [
        acceptableRef({
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 75,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
        acceptableRef({
          id: REF_ACCEPTABLE_B,
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 90,
            max: 100,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
    });
    const ref = assessScenarioReferences(project, SCENARIO_ID);
    assert.equal(ref.has_reference_conflict, true);
    const dev = ref.projected_reference_findings.filter(
      (f) => f.kind === "PROJECTED_ACCEPTABLE_DEVIATION"
    );
    const match = ref.projected_reference_comparisons.filter(
      (c) => c.result === "MATCH"
    );
    assert.ok(dev.length >= 1);
    assert.ok(match.length >= 1);
  });

  it("UNSUPPORTED projected comparison", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: "high" })],
      references: [acceptableRef()],
    });
    const ref = assessScenarioReferences(project, SCENARIO_ID);
    assert.ok(
      ref.projected_reference_findings.some(
        (f) => f.kind === "PROJECTED_UNSUPPORTED_COMPARISON"
      )
    );
  });

  it("Scenario with no likelihood — NO_ESTIMATES, no RISK", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
    });
    const assessment = assessFutureScenario(project, SCENARIO_ID);
    assert.equal(assessment.likelihood_assessment.status, "NO_ESTIMATES");
    assertNoForbidden(assessment);
  });

  it("probability 1 does not materialize RealityState", () => {
    const base = projectWith({
      scenarios: [scenario()],
      states: [realityState({ value: "normal", kind: "condition" })],
      projections: [
        projection({
          projected_value: "leaking",
          state_kind: "condition",
        }),
      ],
    });
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "scenario_likelihood_estimate",
          entity_id: LIK_A,
          payload: likelihood({ probability: 1 }),
        },
      ],
    });
    assert.equal(next.reality_states.length, 1);
    assert.equal(next.reality_states[0]?.value, "normal");
    assert.equal(next.scenario_state_projections[0]?.projected_value, "leaking");
  });

  it("scenario basis traceability and unknown basis rejection", () => {
    const base = projectWith({ states: [realityState()] });
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "future_scenario",
          entity_id: SCENARIO_ID,
          payload: scenario({ basis_state_ids: [STATE_ID] }),
        },
      ],
    });
    assert.deepEqual(next.future_scenarios[0]?.basis_state_ids, [STATE_ID]);

    assert.throws(
      () =>
        applyPatch(base, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "future_scenario",
              entity_id: SCENARIO_ID,
              payload: scenario({
                basis_state_ids: ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa9"],
              }),
            },
          ],
        }),
      /missing basis_state_id/
    );
  });

  it("ontic + epistemic + legacy firewalls", () => {
    const base = projectWith({ states: [realityState()] });
    const onticBefore = JSON.stringify({
      reality_entities: base.reality_entities,
      reality_events: base.reality_events,
      reality_states: base.reality_states,
    });
    const epBefore = JSON.stringify({
      claims: base.claims,
      evidence: base.evidence,
      epistemic_observations: base.epistemic_observations,
    });
    const legacyBefore = JSON.stringify({
      goals: base.goals,
      blockers: base.blockers,
      next_actions: base.next_actions,
    });

    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "future_scenario",
          entity_id: SCENARIO_ID,
          payload: scenario(),
        },
        {
          op: "upsert",
          entity: "scenario_state_projection",
          entity_id: PROJ_A,
          payload: projection(),
        },
      ],
    });

    assert.equal(
      JSON.stringify({
        reality_entities: next.reality_entities,
        reality_events: next.reality_events,
        reality_states: next.reality_states,
      }),
      onticBefore
    );
    assert.equal(
      JSON.stringify({
        claims: next.claims,
        evidence: next.evidence,
        epistemic_observations: next.epistemic_observations,
      }),
      epBefore
    );
    assert.equal(
      JSON.stringify({
        goals: next.goals,
        blockers: next.blockers,
        next_actions: next.next_actions,
      }),
      legacyBefore
    );
  });

  it("deletion guard for Scenario with projections", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection()],
    });
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "future_scenario", entity_id: SCENARIO_ID },
          ],
        }),
      /referenced by scenario_state_projection/
    );
  });

  it("read-only assessment + determinism + layer reuse", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [likelihood()],
    });
    const before = JSON.stringify(project);
    const a = assessFutureScenario(project, SCENARIO_ID);
    const b = assessFutureScenario(project, SCENARIO_ID);
    assert.deepEqual(a, b);
    assert.equal(JSON.stringify(project), before);

    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/prospective-core.ts"),
      "utf8"
    );
    assert.ok(src.includes("compareValueToCriterion"));
    assert.ok(
      !src.split("\n").some(
        (line) =>
          /^\s*import\b/.test(line) &&
          /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );
  });

  it("schema remains 0.1.8 — findings not persisted", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection()],
    });
    assert.equal(project.schema_version, "0.1.24");
    assert.ok(!("risks" in project));
  });
});
