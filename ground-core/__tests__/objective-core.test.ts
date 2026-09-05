import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessDependencyAt,
  assessObjectiveStructureAt,
  assessObjectiveTargetsAt,
  assessRequirementAt,
  getApplicableObjectivesAt,
  getApplicableRequirementsAt,
  getObjectiveDependenciesAt,
} from "../reality/objective-core.js";
import { applyPatch } from "../state-engine.js";
import { PatchError } from "../errors.js";
import type {
  ObjectiveDependency,
  ObjectiveRequirement,
  ProjectState,
  RealityEntity,
  RealityObjective,
  RealityState,
  ReferenceCondition,
} from "../types.js";
import { validateProjectState, validateProjectStateV015 } from "../validate.js";
import { PROJECT_ID, validProjectStateV014, validProjectStateV015, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_ID = "f1010101-0101-4101-8101-010101010101";
const DECLARER_ID = "f1010101-0101-4101-8101-010101010102";
const REF_DESIRED = "f6060606-0606-4606-8606-060606060701";
const REF_EXPECTED = "f6060606-0606-4606-8606-060606060702";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060703";
const REF_REQ = "f6060606-0606-4606-8606-060606060704";
const OBJ_A = "f7070707-0707-4707-8707-070707070701";
const OBJ_B = "f7070707-0707-4707-8707-070707070702";
const REQ_A = "f8080808-0808-4808-8808-080808080801";
const REQ_B = "f8080808-0808-4808-8808-080808080802";
const DEP_A = "f9090909-0909-4909-8909-090909090901";
const DEP_B = "f9090909-0909-4909-8909-090909090902";
const STATE_ID = "f3030303-0303-4303-8303-030303030701";
const STATE_ID_B = "f3030303-0303-4303-8303-030303030702";
const TS = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";
const FROM = "2026-08-24T00:00:00.000Z";

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

function state(overrides: Partial<RealityState> = {}): RealityState {
  return {
    id: STATE_ID,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    kind: "pressure",
    value: 80,
    valid_from: FROM,
    valid_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function desiredRef(overrides: Partial<ReferenceCondition> = {}): ReferenceCondition {
  return {
    id: REF_DESIRED,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    state_kind: "pressure",
    reference_kind: "DESIRED",
    criterion: { kind: "EQUALS", value: 90 },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_ID },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function reqRef(overrides: Partial<ReferenceCondition> = {}): ReferenceCondition {
  return {
    id: REF_REQ,
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
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_ID },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function objective(overrides: Partial<RealityObjective> = {}): RealityObjective {
  return {
    id: OBJ_A,
    project_id: PROJECT_ID,
    kind: "STATE_TARGET",
    label: "restore pressure target",
    target_reference_condition_ids: [REF_DESIRED],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", entity_id: DECLARER_ID },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function requirement(
  overrides: Partial<ObjectiveRequirement> = {}
): ObjectiveRequirement {
  return {
    id: REQ_A,
    project_id: PROJECT_ID,
    label: "pressure acceptable band",
    reference_condition_id: REF_REQ,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", entity_id: DECLARER_ID },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function dependency(
  overrides: Partial<ObjectiveDependency> = {}
): ObjectiveDependency {
  return {
    id: DEP_A,
    project_id: PROJECT_ID,
    objective_id: OBJ_A,
    requirement_id: REQ_A,
    kind: "REQUIRES",
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
  states?: RealityState[];
  references?: ReferenceCondition[];
  objectives?: RealityObjective[];
  requirements?: ObjectiveRequirement[];
  dependencies?: ObjectiveDependency[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [entity(), declarerEntity()],
    reality_states: input.states ?? [],
    reference_conditions: input.references ?? [],
    reality_objectives: input.objectives ?? [],
    objective_requirements: input.requirements ?? [],
    objective_dependencies: input.dependencies ?? [],
  };
}

function assertNoForbiddenTaxonomy(value: unknown) {
  const json = JSON.stringify(value);
  for (const forbidden of [
    '"NEED"',
    '"BLOCKER"',
    '"RISK"',
    '"OPPORTUNITY"',
    '"authorized"',
    '"binding"',
    '"official"',
    '"must_fix"',
    '"priority"',
    '"severity"',
    '"urgency"',
    '"ready_to_execute"',
    '"blocked"',
  ]) {
    assert.ok(!json.includes(forbidden), forbidden);
  }
}

describe("Objective Core (GROUND-013)", () => {
  it("legacy Goal != RealityObjective — no automatic conversion", () => {
    const base = structuredClone(validProjectStateV0124);
    assert.ok(base.goals.length >= 1);
    assert.deepEqual(base.reality_objectives, []);
    const migrated = migrateProjectState(validProjectStateV014);
    assert.deepEqual(migrated.reality_objectives, []);
    assert.equal(migrated.goals.length, validProjectStateV014.goals.length);
  });

  it("persists Objective targeting DESIRED via StatePatch roundtrip", () => {
    const base = projectWith({
      references: [desiredRef()],
    });
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "reality_objective",
          entity_id: OBJ_A,
          payload: objective(),
        },
      ],
    });
    assert.equal(next.reality_objectives.length, 1);
    assert.equal(next.schema_version, "0.1.24");

    const dir = join(process.cwd(), "ground-core/storage/.obj-test-tmp");
    saveProject(next, { storageDir: dir });
    const loaded = loadProject(PROJECT_ID, { storageDir: dir });
    assert.equal(loaded.reality_objectives[0]?.id, OBJ_A);
    assert.deepEqual(loaded.reality_objectives[0]?.target_reference_condition_ids, [
      REF_DESIRED,
    ]);
  });

  it("rejects Objective target that is EXPECTED or ACCEPTABLE", () => {
    const base = projectWith({
      references: [
        desiredRef({ id: REF_EXPECTED, reference_kind: "EXPECTED" }),
        desiredRef({ id: REF_ACCEPTABLE, reference_kind: "ACCEPTABLE" }),
      ],
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
              entity: "reality_objective",
              entity_id: OBJ_A,
              payload: objective({
                target_reference_condition_ids: [REF_EXPECTED],
              }),
            },
          ],
        }),
      (error: unknown) =>
        error instanceof PatchError && /must be DESIRED/.test(error.message)
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
              entity: "reality_objective",
              entity_id: OBJ_A,
              payload: objective({
                target_reference_condition_ids: [REF_ACCEPTABLE],
              }),
            },
          ],
        }),
      PatchError
    );
  });

  it("rejects STATE_TARGET Objective with zero targets", () => {
    const base = projectWith({ references: [desiredRef()] });
    assert.throws(
      () =>
        applyPatch(base, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "reality_objective",
              entity_id: OBJ_A,
              payload: objective({ target_reference_condition_ids: [] }),
            },
          ],
        }),
      (error: unknown) =>
        error instanceof PatchError && /at least one target/.test(error.message)
    );
  });

  it("persists Requirement and Dependency roundtrip", () => {
    const base = projectWith({
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
    });
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "objective_dependency",
          entity_id: DEP_A,
          payload: dependency(),
        },
      ],
    });
    assert.equal(next.objective_dependencies.length, 1);
    assert.equal(next.objective_dependencies[0]?.kind, "REQUIRES");
  });

  it("Requirement SATISFIED — no NEED", () => {
    const project = projectWith({
      states: [state({ value: 80 })],
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const assessment = assessRequirementAt(project, REQ_A, AT);
    assert.equal(assessment.status, "SATISFIED");
    assert.equal(assessment.reference_comparison?.result, "MATCH");
    assertNoForbiddenTaxonomy(assessment);
  });

  it("Requirement UNSATISFIED — no NEED / BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const assessment = assessRequirementAt(project, REQ_A, AT);
    assert.equal(assessment.status, "UNSATISFIED");
    const structure = assessObjectiveStructureAt(project, OBJ_A, AT);
    assert.equal(structure.has_unsatisfied_requirement, true);
    assertNoForbiddenTaxonomy(structure);
  });

  it("Requirement INDETERMINATE — no Current", () => {
    const project = projectWith({
      references: [desiredRef(), reqRef()],
      requirements: [requirement()],
    });
    const assessment = assessRequirementAt(project, REQ_A, AT);
    assert.equal(assessment.status, "INDETERMINATE");
    assert.equal(assessment.reference_comparison?.result, "NO_CURRENT_STATE");
  });

  it("Requirement INDETERMINATE — Current conflict", () => {
    const project = projectWith({
      states: [
        state({ id: STATE_ID, value: 80 }),
        state({ id: STATE_ID_B, value: 55 }),
      ],
      references: [desiredRef(), reqRef()],
      requirements: [requirement()],
    });
    const assessment = assessRequirementAt(project, REQ_A, AT);
    assert.equal(assessment.status, "INDETERMINATE");
    assert.equal(assessment.reference_comparison?.result, "CURRENT_CONFLICTED");
  });

  it("Objective TARGETS_SATISFIED != completed", () => {
    const project = projectWith({
      states: [state({ value: 90 })],
      references: [desiredRef()],
      objectives: [objective()],
    });
    const assessment = assessObjectiveTargetsAt(project, OBJ_A, AT);
    assert.equal(assessment.status, "TARGETS_SATISFIED");
    assert.ok(!JSON.stringify(assessment).includes("completed"));
    assert.ok(!JSON.stringify(assessment).includes("ACHIEVED"));
  });

  it("Objective TARGETS_UNSATISFIED — no failure label", () => {
    const project = projectWith({
      states: [state({ value: 80 })],
      references: [desiredRef()],
      objectives: [objective()],
    });
    const assessment = assessObjectiveTargetsAt(project, OBJ_A, AT);
    assert.equal(assessment.status, "TARGETS_UNSATISFIED");
    assert.ok(!JSON.stringify(assessment).includes("FAILED"));
  });

  it("Objective TARGETS_INDETERMINATE when Current missing", () => {
    const project = projectWith({
      references: [desiredRef()],
      objectives: [objective()],
    });
    const assessment = assessObjectiveTargetsAt(project, OBJ_A, AT);
    assert.equal(assessment.status, "TARGETS_INDETERMINATE");
  });

  it("Dependency PREREQUISITE_SATISFIED / UNSATISFIED — no BLOCKER", () => {
    const satisfied = projectWith({
      states: [state({ value: 80 })],
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    assert.equal(
      assessDependencyAt(satisfied, DEP_A, AT).status,
      "PREREQUISITE_SATISFIED"
    );

    const unsatisfied = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const dep = assessDependencyAt(unsatisfied, DEP_A, AT);
    assert.equal(dep.status, "PREREQUISITE_UNSATISFIED");
    assertNoForbiddenTaxonomy(dep);
  });

  it("Requirement outside applicability → PREREQUISITE_INDETERMINATE", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [
        requirement({
          valid_from: "2026-08-20T00:00:00.000Z",
          valid_until: "2026-08-24T00:00:00.000Z",
        }),
      ],
      dependencies: [dependency()],
    });
    const dep = assessDependencyAt(project, DEP_A, AT);
    assert.equal(dep.status, "PREREQUISITE_INDETERMINATE");
    assert.match(String(dep.note), /Requirement is outside/);
  });

  it("multiple Objectives may share one Requirement", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reqRef()],
      objectives: [
        objective(),
        objective({ id: OBJ_B, label: "second objective" }),
      ],
      requirements: [requirement()],
      dependencies: [
        dependency(),
        dependency({ id: DEP_B, objective_id: OBJ_B }),
      ],
    });
    assert.equal(getObjectiveDependenciesAt(project, OBJ_A, AT).length, 1);
    assert.equal(getObjectiveDependenciesAt(project, OBJ_B, AT).length, 1);
    assert.equal(
      assessRequirementAt(project, REQ_A, AT).status,
      "UNSATISFIED"
    );
  });

  it("Requirement without Dependency is allowed — no NEED", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [reqRef()],
      requirements: [requirement()],
    });
    assert.equal(getApplicableRequirementsAt(project, AT).length, 1);
    assert.equal(assessRequirementAt(project, REQ_A, AT).status, "UNSATISFIED");
    assert.deepEqual(project.objective_dependencies, []);
  });

  it("deletion guards for Reference / Objective / Requirement", () => {
    const project = projectWith({
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });

    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reference_condition", entity_id: REF_DESIRED },
          ],
        }),
      /referenced by reality_objective/
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reference_condition", entity_id: REF_REQ },
          ],
        }),
      /referenced by objective_requirement/
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reality_objective", entity_id: OBJ_A },
          ],
        }),
      /referenced by objective_dependency/
    );
    assert.throws(
      () =>
        applyPatch(project, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "objective_requirement", entity_id: REQ_A },
          ],
        }),
      /referenced by objective_dependency/
    );
  });

  it("rejects unknown references and duplicate overlapping dependency", () => {
    const base = projectWith({
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
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
              entity: "reality_objective",
              entity_id: OBJ_B,
              payload: objective({
                id: OBJ_B,
                target_reference_condition_ids: [
                  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa9",
                ],
              }),
            },
          ],
        }),
      /missing target ReferenceCondition/
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
              entity: "objective_dependency",
              entity_id: DEP_B,
              payload: dependency({ id: DEP_B }),
            },
          ],
        }),
      /duplicates overlapping REQUIRES/
    );
  });

  it("temporal applicability [from, until)", () => {
    const project = projectWith({
      references: [desiredRef()],
      objectives: [
        objective({
          valid_from: "2026-08-24T10:00:00.000Z",
          valid_until: "2026-08-24T12:00:00.000Z",
        }),
      ],
    });
    assert.equal(getApplicableObjectivesAt(project, "2026-08-24T10:00:00.000Z").length, 1);
    assert.equal(getApplicableObjectivesAt(project, "2026-08-24T11:59:59.000Z").length, 1);
    assert.equal(getApplicableObjectivesAt(project, "2026-08-24T12:00:00.000Z").length, 0);
    assert.equal(getApplicableObjectivesAt(project, "2026-08-24T09:59:59.000Z").length, 0);
  });

  it("read-only assessment + ontic/legacy firewall", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const before = JSON.stringify(project);
    const goalsBefore = JSON.stringify(project.goals);
    const blockersBefore = JSON.stringify(project.blockers);
    const actionsBefore = JSON.stringify(project.next_actions);
    const onticBefore = JSON.stringify({
      reality_entities: project.reality_entities,
      reality_events: project.reality_events,
      reality_states: project.reality_states,
    });

    assessObjectiveStructureAt(project, OBJ_A, AT);
    assert.equal(JSON.stringify(project), before);

    const withObjective = applyPatch(project, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "reality_objective",
          entity_id: OBJ_B,
          payload: objective({ id: OBJ_B, label: "second" }),
        },
      ],
    });
    assert.equal(JSON.stringify(withObjective.goals), goalsBefore);
    assert.equal(JSON.stringify(withObjective.blockers), blockersBefore);
    assert.equal(JSON.stringify(withObjective.next_actions), actionsBefore);
    assert.equal(
      JSON.stringify({
        reality_entities: withObjective.reality_entities,
        reality_events: withObjective.reality_events,
        reality_states: withObjective.reality_states,
      }),
      onticBefore
    );
  });

  it("determinism — repeated assessment deepEqual", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reqRef()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const a = assessObjectiveStructureAt(project, OBJ_A, AT);
    const b = assessObjectiveStructureAt(project, OBJ_A, AT);
    assert.deepEqual(a, b);
  });

  it("migrates 0.1.5 → 0.1.6 with empty prospective collections — no backfill", () => {
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

  it("import guards — objective-core must not import state-engine/file-store", () => {
    const source = readFileSync(
      join(process.cwd(), "ground-core/reality/objective-core.ts"),
      "utf8"
    );
    assert.ok(source.includes("compareCurrentToReference"));
    assert.ok(source.includes("assessCurrentStateAt"));
    assert.ok(
      !source.split("\n").some((line) =>
        /^\s*import\b/.test(line) &&
        /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );
  });
});
