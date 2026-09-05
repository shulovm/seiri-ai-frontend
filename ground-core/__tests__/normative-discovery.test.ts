import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { buildSituation } from "../reality/situation.js";
import {
  assessNormativeDiscovery,
  assessNormativeSituation,
  discoverNormativeFindings,
} from "../reality/normative-discovery.js";
import type { NormativeFinding } from "../reality/normative-discovery-types.js";
import type {
  ProjectState,
  RealityEntity,
  RealityState,
  ReferenceCondition,
} from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_ID = "g1010101-0101-4101-8101-010101010101";
const DECLARER_ID = "g1010101-0101-4101-8101-010101010102";
const REF_ACCEPTABLE = "g6060606-0606-4606-8606-060606060601";
const REF_ACCEPTABLE_A = "g6060606-0606-4606-8606-060606060602";
const REF_ACCEPTABLE_B = "g6060606-0606-4606-8606-060606060603";
const REF_EXPECTED = "g6060606-0606-4606-8606-060606060604";
const REF_DESIRED_A = "g6060606-0606-4606-8606-060606060605";
const REF_DESIRED_B = "g6060606-0606-4606-8606-060606060606";
const STATE_NORMAL = "g3030303-0303-4303-8303-030303030301";
const STATE_LEAKING = "g3030303-0303-4303-8303-030303030302";
const TS = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";

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
    id: STATE_NORMAL,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    kind: "condition",
    value: "normal",
    valid_from: "2026-08-24T00:00:00.000Z",
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
    valid_from: "2026-08-24T00:00:00.000Z",
    valid_until: null,
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
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [entity(), declarerEntity()],
    reality_states: input.states ?? [],
    reference_conditions: input.references ?? [],
  };
}

function assertNoForbidden(value: unknown) {
  const json = JSON.stringify(value);
  for (const forbidden of [
    "priority",
    "severity",
    "urgency",
    "risk_score",
    "impact_score",
    "authorized",
    "binding",
    "official",
    "must_fix",
    "NEED",
    "RISK",
    "BLOCKER",
    "OPPORTUNITY",
  ]) {
    assert.ok(!json.includes(`"${forbidden}"`), forbidden);
  }
}

describe("Normative Discovery (GROUND-012)", () => {
  it("Acceptable deviation → PROBLEM with provenance", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 55 })],
      references: [reference()],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.equal(assessment.problem_findings.length, 1);
    const problem = assessment.problem_findings[0]!;
    assert.equal(problem.kind, "PROBLEM");
    assert.equal(problem.reference_kind, "ACCEPTABLE");
    assert.deepEqual(problem.comparison_results, ["DEVIATES"]);
    assert.deepEqual(problem.reference_condition_ids, [REF_ACCEPTABLE]);
    assert.equal(problem.basis_status, "UNCONTESTED_REFERENCE");
    assert.equal(assessment.has_uncontested_problem, true);
    assertNoForbidden(assessment);
  });

  it("Acceptable match → no PROBLEM", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 80 })],
      references: [reference()],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.equal(assessment.problem_findings.length, 0);
    assert.ok(!assessment.findings.some((f) => f.kind === "PROBLEM"));
    assertNoForbidden(assessment);
  });

  it("Expected deviation only — no PROBLEM", () => {
    const project = projectWith({
      states: [state({ kind: "visitors", value: 80 })],
      references: [
        reference({
          id: REF_EXPECTED,
          state_kind: "visitors",
          reference_kind: "EXPECTED",
          criterion: { kind: "EQUALS", value: 100 },
        }),
      ],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(assessment.findings.some((f) => f.kind === "EXPECTED_DEVIATION"));
    assert.equal(assessment.problem_findings.length, 0);
  });

  it("Desired gap only — no NEED, no PROBLEM", () => {
    const project = projectWith({
      states: [state({ kind: "color", value: "blue" })],
      references: [
        reference({
          id: REF_DESIRED_A,
          state_kind: "color",
          reference_kind: "DESIRED",
          criterion: { kind: "EQUALS", value: "green" },
        }),
      ],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(assessment.findings.some((f) => f.kind === "DESIRED_GAP"));
    assert.equal(assessment.problem_findings.length, 0);
    assertNoForbidden(assessment);
  });

  it("leaking without Reference → PROBLEM absent (hidden-policy guard)", () => {
    const project = projectWith({
      states: [state({ value: "leaking" })],
      references: [],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.deepEqual(assessment.findings, []);
    assert.equal(assessment.has_findings, false);
    assert.equal(assessment.has_reference_relative_problem, false);
  });

  it("CURRENT_STATE_MISSING — no PROBLEM", () => {
    const project = projectWith({
      references: [reference()],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(assessment.findings.some((f) => f.kind === "CURRENT_STATE_MISSING"));
    assert.equal(assessment.problem_findings.length, 0);
  });

  it("CURRENT_STATE_CONFLICT — no PROBLEM", () => {
    const project = projectWith({
      states: [
        state({ id: STATE_NORMAL, value: "normal" }),
        state({ id: STATE_LEAKING, value: "leaking" }),
      ],
      references: [
        reference({
          state_kind: "condition",
          criterion: { kind: "EQUALS", value: "normal" },
        }),
      ],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(
      assessment.findings.some((f) => f.kind === "CURRENT_STATE_CONFLICT")
    );
    assert.equal(assessment.problem_findings.length, 0);
  });

  it("UNSUPPORTED_REFERENCE_COMPARISON — no PROBLEM", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: "high" })],
      references: [
        reference({
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 0,
            max: 10,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(
      assessment.findings.some(
        (f) => f.kind === "UNSUPPORTED_REFERENCE_COMPARISON"
      )
    );
    assert.equal(assessment.problem_findings.length, 0);
  });

  it("conflicting Acceptable References — PROBLEM tied to B, contested basis", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 80 })],
      references: [
        reference({
          id: REF_ACCEPTABLE_A,
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 90,
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
            min_inclusive: false,
            max_inclusive: true,
          },
        }),
      ],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(assessment.has_reference_conflict);
    const problemB = assessment.problem_findings.find((p) =>
      p.reference_condition_ids.includes(REF_ACCEPTABLE_B)
    );
    assert.ok(problemB);
    assert.equal(problemB?.basis_status, "CONTESTED_REFERENCE");
    assert.equal(assessment.has_reference_relative_problem, true);
    assert.equal(assessment.has_uncontested_problem, false);
    assert.ok(
      !assessment.problem_findings.some((p) =>
        p.reference_condition_ids.includes(REF_ACCEPTABLE_A)
      )
    );
  });

  it("uncontested Acceptable deviation — has_uncontested_problem", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 55 })],
      references: [reference()],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.equal(assessment.problem_findings[0]?.basis_status, "UNCONTESTED_REFERENCE");
    assert.equal(assessment.has_uncontested_problem, true);
  });

  it("conflicting Desired References — DESIRED_GAP + REFERENCE_CONFLICT, no PROBLEM", () => {
    const project = projectWith({
      states: [state({ kind: "color", value: "blue" })],
      references: [
        reference({
          id: REF_DESIRED_A,
          state_kind: "color",
          reference_kind: "DESIRED",
          criterion: { kind: "EQUALS", value: "green" },
        }),
        reference({
          id: REF_DESIRED_B,
          state_kind: "color",
          reference_kind: "DESIRED",
          criterion: { kind: "EQUALS", value: "red" },
        }),
      ],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(assessment.findings.some((f) => f.kind === "REFERENCE_CONFLICT"));
    assert.ok(assessment.findings.filter((f) => f.kind === "DESIRED_GAP").length >= 2);
    assert.equal(assessment.problem_findings.length, 0);
  });

  it("Expected deviation + Acceptable match coexist without merged semantics", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 80 })],
      references: [
        reference({ id: REF_ACCEPTABLE, reference_kind: "ACCEPTABLE" }),
        reference({
          id: REF_EXPECTED,
          reference_kind: "EXPECTED",
          criterion: { kind: "EQUALS", value: 100 },
        }),
      ],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.ok(assessment.findings.some((f) => f.kind === "EXPECTED_DEVIATION"));
    assert.equal(assessment.problem_findings.length, 0);
  });

  it("no References — findings empty, not healthy", () => {
    const project = projectWith({
      states: [state({ value: "normal" })],
    });
    const assessment = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.deepEqual(assessment.findings, []);
    assert.equal(assessment.has_findings, false);
  });

  it("Desired gap Current=0 Desired=1 — no NEED", () => {
    const project = projectWith({
      states: [state({ kind: "count", value: 0 })],
      references: [
        reference({
          state_kind: "count",
          reference_kind: "DESIRED",
          criterion: { kind: "EQUALS", value: 1 },
        }),
      ],
    });
    const findings = discoverNormativeFindings(project, ENTITY_ID, AT);
    assert.ok(findings.some((f) => f.kind === "DESIRED_GAP"));
    assertNoForbidden(findings);
  });

  it("determinism — repeated assessment deepEqual", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 55 })],
      references: [reference()],
    });
    const a = assessNormativeDiscovery(project, ENTITY_ID, AT);
    const b = assessNormativeDiscovery(project, ENTITY_ID, AT);
    assert.deepEqual(a, b);
  });

  it("read-only — ProjectState and Situation unchanged", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 55 })],
      references: [reference()],
    });
    const beforeProject = JSON.stringify(project);
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    const beforeSituation = JSON.stringify(situation);
    assessNormativeSituation(project, { subjectId: ENTITY_ID, at: AT });
    assert.equal(JSON.stringify(project), beforeProject);
    assert.equal(JSON.stringify(situation), beforeSituation);
  });

  it("layer reuse + import guards", () => {
    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/normative-discovery.ts"),
      "utf8"
    );
    assert.ok(src.includes("assessReferenceStateAt"));
    assert.ok(!src.includes("compareValueToCriterion"));
    assert.ok(!src.includes("criteriaAreCompatible"));
    assert.ok(!/\brandomUUID\s*\(/.test(src));
    const imports = src.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert.ok(
      !imports.some((line) =>
        /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );
  });

  it("assessNormativeSituation includes situation_key", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 55 })],
      references: [reference()],
    });
    const assessment = assessNormativeSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.ok(assessment.situation_key?.startsWith("sit|"));
    assert.equal(assessment.findings[0]?.situation_key, assessment.situation_key);
  });

  it("schema remains 0.1.4 — no persisted normative findings", () => {
    const project = projectWith({});
    assert.equal(project.schema_version, "0.1.24");
    assert.equal(
      (project as ProjectState & { normative_findings?: NormativeFinding[] })
        .normative_findings,
      undefined
    );
  });
});
