import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  assessObjectiveDiscovery,
  discoverObjectiveFindings,
  discoverObjectiveFindingsAt,
} from "../reality/objective-discovery.js";
import {
  assessNormativeDiscovery,
} from "../reality/normative-discovery.js";
import type {
  ObjectiveDependency,
  ObjectiveRequirement,
  ProjectState,
  RealityEntity,
  RealityObjective,
  RealityState,
  ReferenceCondition,
} from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_ID = "f1010101-0101-4101-8101-010101010101";
const DECLARER_ID = "f1010101-0101-4101-8101-010101010102";
const REF_DESIRED = "f6060606-0606-4606-8606-060606060801";
const REF_EXPECTED = "f6060606-0606-4606-8606-060606060802";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060803";
const REF_ACCEPTABLE_B = "f6060606-0606-4606-8606-060606060804";
const REF_REQ = "f6060606-0606-4606-8606-060606060805";
const REF_REQ_2 = "f6060606-0606-4606-8606-060606060806";
const OBJ_A = "f7070707-0707-4707-8707-070707070801";
const OBJ_B = "f7070707-0707-4707-8707-070707070802";
const REQ_A = "f8080808-0808-4808-8808-080808080801";
const REQ_B = "f8080808-0808-4808-8808-080808080802";
const DEP_A = "f9090909-0909-4909-8909-090909090801";
const DEP_B = "f9090909-0909-4909-8909-090909090802";
const STATE_ID = "f3030303-0303-4303-8303-030303030801";
const STATE_ID_B = "f3030303-0303-4303-8303-030303030802";
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
    value: 55,
    valid_from: FROM,
    valid_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function reference(
  overrides: Partial<ReferenceCondition> = {}
): ReferenceCondition {
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

function desiredRef(
  overrides: Partial<ReferenceCondition> = {}
): ReferenceCondition {
  return reference({
    id: REF_DESIRED,
    reference_kind: "DESIRED",
    criterion: { kind: "EQUALS", value: 90 },
    ...overrides,
  });
}

function objective(overrides: Partial<RealityObjective> = {}): RealityObjective {
  return {
    id: OBJ_A,
    project_id: PROJECT_ID,
    kind: "STATE_TARGET",
    label: "restore service",
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
    label: "pressure band required",
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
  goals?: ProjectState["goals"];
  blockers?: ProjectState["blockers"];
  next_actions?: ProjectState["next_actions"];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [entity(), declarerEntity()],
    reality_states: input.states ?? [],
    reference_conditions: input.references ?? [],
    reality_objectives: input.objectives ?? [],
    objective_requirements: input.requirements ?? [],
    objective_dependencies: input.dependencies ?? [],
    ...(input.goals ? { goals: input.goals } : {}),
    ...(input.blockers ? { blockers: input.blockers } : {}),
    ...(input.next_actions ? { next_actions: input.next_actions } : {}),
  };
}

function assertNoForbidden(value: unknown) {
  const json = JSON.stringify(value);
  for (const token of [
    '"RISK"',
    '"OPPORTUNITY"',
    '"authorized"',
    '"binding"',
    '"official"',
    '"must_execute"',
    '"priority"',
    '"severity"',
    '"urgency"',
    '"ready_to_execute"',
    '"must_act"',
  ]) {
    assert.ok(!json.includes(token), token);
  }
}

describe("Objective Discovery (GROUND-014)", () => {
  it("active unsatisfied Requirement + Dependency → NEED + BLOCKER with provenance", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(assessment.has_need, true);
    assert.equal(assessment.has_blocker, true);
    assert.equal(assessment.need_findings.length, 1);
    assert.equal(assessment.blocker_findings.length, 1);

    const need = assessment.need_findings[0]!;
    assert.equal(need.kind, "NEED");
    assert.equal(need.objective_id, OBJ_A);
    assert.equal(need.requirement_id, REQ_A);
    assert.equal(need.dependency_id, DEP_A);
    assert.equal(need.reference_condition_id, REF_REQ);
    assert.equal(need.requirement_status, "UNSATISFIED");
    assert.equal(need.comparison_result, "DEVIATES");
    assert.equal(need.key, `need|${OBJ_A}|${REQ_A}|${AT}`);
    assert.ok(need.provenance.objective_declarer);
    assert.ok(need.provenance.requirement_declarer);
    assert.ok(need.provenance.dependency_declarer);
    assert.ok(need.provenance.reference_declarer);
    assert.ok(need.current_state_ids.includes(STATE_ID));

    const blocker = assessment.blocker_findings[0]!;
    assert.equal(blocker.kind, "BLOCKER");
    assert.equal(blocker.dependency_id, DEP_A);
    assert.equal(blocker.dependency_status, "PREREQUISITE_UNSATISFIED");
    assert.equal(blocker.key, `blocker|${DEP_A}|${AT}`);
    assertNoForbidden(assessment);
  });

  it("standalone unsatisfied Requirement → no NEED / BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [reference()],
      requirements: [requirement()],
    });
    assert.deepEqual(discoverObjectiveFindingsAt(project, AT), []);
  });

  it("satisfied prerequisite → no NEED / BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: 80 })],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(assessment.has_need, false);
    assert.equal(assessment.has_blocker, false);
    assert.deepEqual(assessment.findings, []);
  });

  it("INDETERMINATE — no Current → no NEED / BLOCKER", () => {
    const project = projectWith({
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(assessment.has_need, false);
    assert.equal(assessment.has_blocker, false);
    assert.equal(assessment.has_indeterminate_prerequisite, true);
    assert.ok(assessment.indeterminate_dependency_ids.includes(DEP_A));
  });

  it("INDETERMINATE — Current conflict → no NEED / BLOCKER", () => {
    const project = projectWith({
      states: [
        state({ id: STATE_ID, value: 80 }),
        state({ id: STATE_ID_B, value: 55 }),
      ],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(assessment.has_need, false);
    assert.equal(assessment.has_blocker, false);
    assert.equal(assessment.has_indeterminate_prerequisite, true);
  });

  it("inactive Objective → no NEED / BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
      objectives: [
        objective({
          valid_from: "2026-08-20T00:00:00.000Z",
          valid_until: "2026-08-24T00:00:00.000Z",
        }),
      ],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.deepEqual(assessment.findings, []);
    assert.equal(assessment.structure_assessment, null);
    assert.deepEqual(discoverObjectiveFindingsAt(project, AT), []);
  });

  it("inactive Dependency → no NEED / BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [
        dependency({
          valid_from: "2026-08-20T00:00:00.000Z",
          valid_until: "2026-08-24T00:00:00.000Z",
        }),
      ],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.deepEqual(assessment.findings, []);
  });

  it("Requirement outside applicability → no NEED / BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [
        requirement({
          valid_from: "2026-08-20T00:00:00.000Z",
          valid_until: "2026-08-24T00:00:00.000Z",
        }),
      ],
      dependencies: [dependency()],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.deepEqual(assessment.findings, []);
    assert.equal(assessment.has_indeterminate_prerequisite, true);
  });

  it("DESIRED_GAP without Requirement structure → no NEED", () => {
    const project = projectWith({
      states: [state({ kind: "color", value: "blue" })],
      references: [
        desiredRef({
          id: REF_DESIRED,
          state_kind: "color",
          criterion: { kind: "EQUALS", value: "green" },
        }),
      ],
    });
    const normative = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(normative.findings.some((f) => f.kind === "DESIRED_GAP"));
    assert.deepEqual(discoverObjectiveFindingsAt(project, AT), []);
  });

  it("PROBLEM without Requirement structure → no NEED", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [reference({ id: REF_ACCEPTABLE, reference_kind: "ACCEPTABLE" })],
    });
    const normative = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(normative.problem_findings.length >= 1);
    assert.deepEqual(discoverObjectiveFindingsAt(project, AT), []);
  });

  it("ACCEPTABLE required → PROBLEM + NEED + BLOCKER remain separate", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const normative = assessNormativeDiscovery(project, ENTITY_ID, AT);
    const objectiveDisc = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.ok(normative.problem_findings.length >= 1);
    assert.equal(objectiveDisc.has_need, true);
    assert.equal(objectiveDisc.has_blocker, true);
    assert.ok(!objectiveDisc.findings.some((f) => f.kind === ("PROBLEM" as never)));
  });

  it("EXPECTED required → EXPECTED_DEVIATION + NEED + BLOCKER, no PROBLEM", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [
        desiredRef(),
        reference({
          id: REF_EXPECTED,
          reference_kind: "EXPECTED",
          criterion: { kind: "EQUALS", value: 100 },
        }),
      ],
      objectives: [objective()],
      requirements: [requirement({ reference_condition_id: REF_EXPECTED })],
      dependencies: [dependency()],
    });
    const normative = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(normative.findings.some((f) => f.kind === "EXPECTED_DEVIATION"));
    assert.equal(normative.problem_findings.length, 0);
    const objectiveDisc = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(objectiveDisc.has_need, true);
    assert.equal(objectiveDisc.has_blocker, true);
  });

  it("DESIRED required → DESIRED_GAP + NEED + BLOCKER, no PROBLEM from Desired", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef({ criterion: { kind: "EQUALS", value: 90 } })],
      objectives: [objective()],
      requirements: [requirement({ reference_condition_id: REF_DESIRED })],
      dependencies: [dependency()],
    });
    const normative = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(normative.findings.some((f) => f.kind === "DESIRED_GAP"));
    assert.equal(normative.problem_findings.length, 0);
    const objectiveDisc = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(objectiveDisc.has_need, true);
    assert.equal(objectiveDisc.has_blocker, true);
  });

  it("TARGETS_SATISFIED + unsatisfied prerequisite → NEED + BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: 90 })],
      references: [
        desiredRef({ criterion: { kind: "EQUALS", value: 90 } }),
        reference({
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 85,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(
      assessment.structure_assessment?.target_assessment.status,
      "TARGETS_SATISFIED"
    );
    assert.equal(assessment.has_need, true);
    assert.equal(assessment.has_blocker, true);
    const json = JSON.stringify(assessment);
    assert.ok(!json.includes("completed"));
    assert.ok(!json.includes("FAILED"));
  });

  it("contested reference basis preserves NEED/BLOCKER without winner", () => {
    const project = projectWith({
      states: [state({ value: 80 })],
      references: [
        desiredRef(),
        reference({
          id: REF_ACCEPTABLE,
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 75,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
        reference({
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
      objectives: [objective()],
      requirements: [
        requirement({ reference_condition_id: REF_ACCEPTABLE }),
      ],
      dependencies: [dependency()],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(assessment.has_need, true);
    assert.equal(assessment.has_blocker, true);
    assert.equal(assessment.has_contested_need, true);
    assert.equal(assessment.has_uncontested_need, false);
    assert.equal(
      assessment.need_findings[0]?.reference_basis_contested,
      true
    );
    assertNoForbidden(assessment);
  });

  it("shared Requirement → objective-relative NEED + dependency-specific BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
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
    const all = discoverObjectiveFindingsAt(project, AT);
    assert.equal(all.length, 2);
    const needs = all.flatMap((a) => a.need_findings);
    const blockers = all.flatMap((a) => a.blocker_findings);
    assert.equal(needs.length, 2);
    assert.equal(blockers.length, 2);
    assert.deepEqual(
      needs.map((n) => n.objective_id).sort(),
      [OBJ_A, OBJ_B].sort()
    );
    assert.deepEqual(
      blockers.map((b) => b.dependency_id).sort(),
      [DEP_A, DEP_B].sort()
    );
  });

  it("multiple dependencies — only unsatisfied Requirement produces findings", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [
        desiredRef(),
        reference(),
        reference({
          id: REF_REQ_2,
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 0,
            max: 100,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
      objectives: [objective()],
      requirements: [
        requirement(),
        requirement({
          id: REQ_B,
          reference_condition_id: REF_REQ_2,
          label: "satisfied band",
        }),
      ],
      dependencies: [
        dependency(),
        dependency({ id: DEP_B, requirement_id: REQ_B }),
      ],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(assessment.need_findings.length, 1);
    assert.equal(assessment.need_findings[0]?.requirement_id, REQ_A);
    assert.equal(assessment.blocker_findings.length, 1);
    assert.equal(assessment.blocker_findings[0]?.dependency_id, DEP_A);
  });

  it("legacy Blocker / Action firewall + no automatic Task", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const before = {
      goals: JSON.stringify(project.goals),
      blockers: JSON.stringify(project.blockers),
      next_actions: JSON.stringify(project.next_actions),
      current_state: JSON.stringify(project.current_state),
    };
    assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(JSON.stringify(project.goals), before.goals);
    assert.equal(JSON.stringify(project.blockers), before.blockers);
    assert.equal(JSON.stringify(project.next_actions), before.next_actions);
    assert.equal(JSON.stringify(project.current_state), before.current_state);
  });

  it("determinism + read-only + layer reuse", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    const before = JSON.stringify(project);
    const a = assessObjectiveDiscovery(project, OBJ_A, AT);
    const b = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.deepEqual(a, b);
    assert.equal(JSON.stringify(project), before);

    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/objective-discovery.ts"),
      "utf8"
    );
    assert.ok(src.includes("assessObjectiveStructureAt"));
    assert.ok(!src.includes("compareValueToCriterion"));
    assert.ok(
      !src.split("\n").some(
        (line) =>
          /^\s*import\b/.test(line) &&
          /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );
  });

  it("schema remains 0.1.5 — findings not persisted", () => {
    const project = projectWith({
      states: [state({ value: 55 })],
      references: [desiredRef(), reference()],
      objectives: [objective()],
      requirements: [requirement()],
      dependencies: [dependency()],
    });
    assert.equal(project.schema_version, "0.1.24");
    assert.ok(!("needs" in project));
    assert.ok(!("objective_blockers" in project));
  });
});
