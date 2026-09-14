import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessCurrentStateAt,
  assessReferenceStateAt,
  compareCurrentToReference,
  detectReferenceConflicts,
  getReferenceConditionsAt,
  isReferenceConditionActiveAt,
} from "../reality/reference-state.js";
import { applyPatch } from "../state-engine.js";
import type {
  Claim,
  ProjectState,
  RealityEntity,
  RealityState,
  ReferenceCondition,
} from "../types.js";
import { validateProjectState, validateProjectStateV013 } from "../validate.js";
import { PROJECT_ID, validProjectStateV013, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_ID = "f1010101-0101-4101-8101-010101010101";
const DECLARER_ID = "f1010101-0101-4101-8101-010101010102";
const REF_EXPECTED = "f6060606-0606-4606-8606-060606060601";
const REF_DESIRED_A = "f6060606-0606-4606-8606-060606060602";
const REF_DESIRED_B = "f6060606-0606-4606-8606-060606060603";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060604";
const STATE_NORMAL = "f3030303-0303-4303-8303-030303030301";
const STATE_LEAKING = "f3030303-0303-4303-8303-030303030302";
const STATE_DUP = "f3030303-0303-4303-8303-030303030303";
const CLAIM_A = "f4040404-0404-4404-8404-040404040401";
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
    id: REF_EXPECTED,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    state_kind: "condition",
    reference_kind: "EXPECTED",
    criterion: { kind: "EQUALS", value: "normal" },
    valid_from: "2026-08-24T00:00:00.000Z",
    valid_until: null,
    declared_by: { kind: "organization", entity_id: DECLARER_ID },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function claim(overrides: Partial<Claim> = {}): Claim {
  return {
    id: CLAIM_A,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    predicate_kind: "state",
    predicate: "condition",
    value: "leaking",
    provenance: { kind: "human" },
    confidence: 0.8,
    applicable_from: "2026-08-24T00:00:00.000Z",
    applicable_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function projectWith(input: {
  entities?: RealityEntity[];
  states?: RealityState[];
  claims?: Claim[];
  references?: ReferenceCondition[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [entity(), declarerEntity()],
    reality_states: input.states ?? [],
    claims: input.claims ?? [],
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
    "recommended_action",
    "authorized",
    "binding",
    "official",
    "PROBLEM",
    "RISK",
    "BLOCKER",
    "OPPORTUNITY",
  ]) {
    assert.ok(!json.includes(`"${forbidden}"`), forbidden);
  }
}

describe("Reference State Core (GROUND-011)", () => {
  it("persists ReferenceCondition via StatePatch roundtrip", () => {
    const base = projectWith({});
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "reference_condition",
          entity_id: REF_EXPECTED,
          payload: reference(),
        },
      ],
    });
    assert.equal(next.reference_conditions.length, 1);
    assert.equal(next.reference_conditions[0]?.reference_kind, "EXPECTED");
    assert.equal(next.schema_version, "0.1.25");

    const dir = join(process.cwd(), "ground-core/storage/.ref-test-tmp");
    saveProject(next, { storageDir: dir });
    const loaded = loadProject(PROJECT_ID, { storageDir: dir });
    assert.equal(loaded.reference_conditions[0]?.id, REF_EXPECTED);
  });

  it("migrates 0.1.3 → 0.1.4 with empty reference_conditions", () => {
    assert.equal(validProjectStateV013.schema_version, "0.1.3");
    assert.ok(validateProjectStateV013(validProjectStateV013).valid);
    const migrated = migrateProjectState(validProjectStateV013);
    assert.equal(migrated.schema_version, "0.1.25");
    assert.deepEqual(migrated.reference_conditions, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("Expected MATCH when Current equals reference", () => {
    const project = projectWith({
      states: [state({ value: "normal" })],
      references: [reference()],
    });
    const assessment = assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "condition",
      at: AT,
    });
    assert.equal(assessment.comparisons[0]?.result, "MATCH");
    assert.equal(assessment.has_deviation, false);
    assertNoForbidden(assessment);
  });

  it("Expected DEVIATES — not PROBLEM/RISK/ACTION", () => {
    const project = projectWith({
      states: [state({ value: "leaking" })],
      references: [reference({ criterion: { kind: "EQUALS", value: "normal" } })],
    });
    const assessment = assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "condition",
      at: AT,
    });
    assert.equal(assessment.comparisons[0]?.result, "DEVIATES");
    assertNoForbidden(assessment);
  });

  it("Desired DEVIATES without Task/Intent", () => {
    const project = projectWith({
      states: [state({ kind: "color", value: "blue" })],
      references: [
        reference({
          state_kind: "color",
          reference_kind: "DESIRED",
          criterion: { kind: "EQUALS", value: "green" },
        }),
      ],
    });
    const assessment = assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "color",
      at: AT,
    });
    assert.equal(assessment.comparisons[0]?.result, "DEVIATES");
    assertNoForbidden(assessment);
  });

  it("Acceptable ONE_OF MATCH", () => {
    const project = projectWith({
      states: [state({ value: "degraded" })],
      references: [
        reference({
          reference_kind: "ACCEPTABLE",
          criterion: { kind: "ONE_OF", values: ["normal", "degraded"] },
        }),
      ],
    });
    const assessment = assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "condition",
      at: AT,
    });
    assert.equal(assessment.comparisons[0]?.result, "MATCH");
  });

  it("Acceptable NUMERIC_RANGE MATCH with boundary inclusivity", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 80 })],
      references: [
        reference({
          state_kind: "pressure",
          reference_kind: "ACCEPTABLE",
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 90,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
    });
    const assessment = assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "pressure",
      at: AT,
    });
    assert.equal(assessment.comparisons[0]?.result, "MATCH");
  });

  it("Acceptable range DEVIATES — no unsafe label", () => {
    const project = projectWith({
      states: [state({ kind: "pressure", value: 95 })],
      references: [
        reference({
          state_kind: "pressure",
          reference_kind: "ACCEPTABLE",
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 90,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
    });
    const assessment = assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "pressure",
      at: AT,
    });
    assert.equal(assessment.comparisons[0]?.result, "DEVIATES");
    assertNoForbidden(assessment);
  });

  it("NO_CURRENT_STATE when Reference exists but no RealityState", () => {
    const project = projectWith({ references: [reference()] });
    const assessment = assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "condition",
      at: AT,
    });
    assert.equal(assessment.current.status, "NO_CURRENT_STATE");
    assert.equal(assessment.comparisons[0]?.result, "NO_CURRENT_STATE");
  });

  it("CURRENT_CONFLICTED for overlapping distinct values", () => {
    const project = projectWith({
      states: [
        state({ id: STATE_NORMAL, value: "normal" }),
        state({ id: STATE_LEAKING, value: "leaking" }),
      ],
      references: [reference()],
    });
    const assessment = assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "condition",
      at: AT,
    });
    assert.equal(assessment.current.status, "CONFLICTED");
    assert.equal(assessment.comparisons[0]?.result, "CURRENT_CONFLICTED");
  });

  it("duplicate semantically equal object states → SINGLE_VALUE", () => {
    const project = projectWith({
      states: [
        state({ id: STATE_NORMAL, value: { a: 1, b: 2 } }),
        state({ id: STATE_DUP, value: { b: 2, a: 1 } }),
      ],
    });
    const current = assessCurrentStateAt(
      project,
      ENTITY_ID,
      "condition",
      AT
    );
    assert.equal(current.status, "SINGLE_VALUE");
    assert.equal(current.semantic_values.length, 1);
  });

  it("conflicting DESIRED references both persist with conflict exposed", () => {
    const project = projectWith({
      references: [
        reference({
          id: REF_DESIRED_A,
          reference_kind: "DESIRED",
          criterion: { kind: "EQUALS", value: "normal" },
        }),
        reference({
          id: REF_DESIRED_B,
          reference_kind: "DESIRED",
          criterion: { kind: "EQUALS", value: "leaking" },
        }),
      ],
    });
    const conflicts = detectReferenceConflicts(
      getReferenceConditionsAt(project, ENTITY_ID, "condition", AT),
      AT
    );
    assert.ok(conflicts.some((c) => c.conflict_kind === "CRITERION_INCOMPATIBLE"));
    assert.equal(conflicts[0]?.reference_condition_ids.length, 2);
  });

  it("compatible ONE_OF references do not conflict", () => {
    const refs = [
      reference({
        id: REF_DESIRED_A,
        reference_kind: "DESIRED",
        criterion: { kind: "ONE_OF", values: ["normal", "degraded"] },
      }),
      reference({
        id: REF_DESIRED_B,
        reference_kind: "DESIRED",
        criterion: { kind: "ONE_OF", values: ["degraded", "leaking"] },
      }),
    ];
    const conflicts = detectReferenceConflicts(refs, AT);
    assert.equal(conflicts.length, 0);
  });

  it("disjoint numeric ranges → reference conflict", () => {
    const refs = [
      reference({
        id: REF_DESIRED_A,
        reference_kind: "ACCEPTABLE",
        criterion: {
          kind: "NUMERIC_RANGE",
          min: 0,
          max: 10,
          min_inclusive: true,
          max_inclusive: true,
        },
      }),
      reference({
        id: REF_DESIRED_B,
        reference_kind: "ACCEPTABLE",
        criterion: {
          kind: "NUMERIC_RANGE",
          min: 20,
          max: 30,
          min_inclusive: true,
          max_inclusive: true,
        },
      }),
    ];
    const conflicts = detectReferenceConflicts(refs, AT);
    assert.ok(conflicts.some((c) => c.conflict_kind === "CRITERION_INCOMPATIBLE"));
  });

  it("Claim alone does not become Current", () => {
    const project = projectWith({
      claims: [claim()],
      references: [reference()],
    });
    const current = assessCurrentStateAt(
      project,
      ENTITY_ID,
      "condition",
      AT
    );
    assert.equal(current.status, "NO_CURRENT_STATE");
  });

  it("ReferenceCondition does not mutate ontic collections", () => {
    const base = projectWith({ states: [state({ value: "leaking" })] });
    const before = JSON.stringify({
      entities: base.reality_entities,
      states: base.reality_states,
      events: base.reality_events,
    });
    applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "reference_condition",
          entity_id: REF_EXPECTED,
          payload: reference({ criterion: { kind: "EQUALS", value: "normal" } }),
        },
      ],
    });
    const after = JSON.stringify({
      entities: base.reality_entities,
      states: base.reality_states,
      events: base.reality_events,
    });
    assert.equal(before, after);
  });

  it("temporal applicability half-open [from, until)", () => {
    const ref = reference({
      valid_from: "2026-08-24T10:00:00.000Z",
      valid_until: "2026-08-24T11:00:00.000Z",
    });
    assert.equal(
      isReferenceConditionActiveAt(ref, "2026-08-24T09:59:00.000Z"),
      false
    );
    assert.equal(
      isReferenceConditionActiveAt(ref, "2026-08-24T10:00:00.000Z"),
      true
    );
    assert.equal(
      isReferenceConditionActiveAt(ref, "2026-08-24T10:59:00.000Z"),
      true
    );
    assert.equal(
      isReferenceConditionActiveAt(ref, "2026-08-24T11:00:00.000Z"),
      false
    );
  });

  it("rejects unknown subject Entity on upsert", () => {
    assert.throws(() => {
      applyPatch(projectWith({}), {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reference_condition",
            entity_id: REF_EXPECTED,
            payload: reference({
              subject_id: "00000000-0000-4000-8000-000000000099",
            }),
          },
        ],
      });
    });
  });

  it("rejects unknown declarer Entity on upsert", () => {
    assert.throws(() => {
      applyPatch(projectWith({}), {
        schema_version: "0.1.24",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reference_condition",
            entity_id: REF_EXPECTED,
            payload: reference({
              declared_by: {
                kind: "organization",
                entity_id: "00000000-0000-4000-8000-000000000099",
              },
            }),
          },
        ],
      });
    });
  });

  it("read-only assessment leaves ProjectState unchanged", () => {
    const project = projectWith({
      states: [state()],
      references: [reference()],
    });
    const before = JSON.stringify(project);
    assessReferenceStateAt(project, {
      subjectId: ENTITY_ID,
      stateKind: "condition",
      at: AT,
    });
    assert.equal(JSON.stringify(project), before);
  });

  it("import guards — no state-engine in reference-state module", () => {
    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/reference-state.ts"),
      "utf8"
    );
    const imports = src.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert.ok(
      !imports.some((line) =>
        /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );
    assert.ok(src.includes("getRealityStatesAt"));
  });

  it("determinism — repeated assessment deepEqual", () => {
    const project = projectWith({
      states: [state({ value: "leaking" })],
      references: [reference()],
    });
    const q = { subjectId: ENTITY_ID, stateKind: "condition", at: AT };
    assert.deepEqual(
      assessReferenceStateAt(project, q),
      assessReferenceStateAt(project, q)
    );
  });
});
