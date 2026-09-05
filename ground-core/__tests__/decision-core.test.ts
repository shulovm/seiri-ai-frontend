import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessDecisionOption,
  assessDecisionSpace,
  decisionBasisKey,
  decisionOptionSemanticKey,
  getApplicableDecisionOptions,
  groupDecisionOptionPositions,
  isDecisionOptionDeclarationActiveAt,
  isDecisionSpaceActiveAt,
} from "../reality/decision-core.js";
import {
  assessDeclaredInterventionPermission,
} from "../reality/permission-core.js";
import { applyPatch } from "../state-engine.js";
import type {
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  FutureScenario,
  InterventionDeclaration,
  PatchEntity,
  ProjectState,
  RealityEntity,
  RealityObjective,
  ReferenceCondition,
  StatePatch,
} from "../types.js";
import {
  validateProjectState,
  validateProjectStateV0114,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV0114,
  validProjectStateV0124,
} from "./fixtures.js";

const ENTITY_PIPE = "f4010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR = "f4010101-0101-4101-8101-010101010102";
const ENTITY_DECLARER_A = "f4010101-0101-4101-8101-010101010103";
const ENTITY_DECLARER_B = "f4010101-0101-4101-8101-010101010104";
const SPACE_D = "f4020202-0202-4202-8202-020202020201";
const OPT_INT_A = "f4030303-0303-4303-8303-030303030301";
const OPT_INT_B = "f4030303-0303-4303-8303-030303030302";
const OPT_DN_A = "f4030303-0303-4303-8303-030303030303";
const OPT_DN_B = "f4030303-0303-4303-8303-030303030304";
const INT_A = "f4040404-0404-4404-8404-040404040401";
const OBJ_A = "f5050505-0505-4505-8505-050505050501";
const REF_A = "f6060606-0606-4606-8606-060606060601";
const SCENARIO_A = "f7070707-0707-4707-8707-070707070701";
const PERM_A = "f8080808-0808-4808-8808-080808080801";

const TS = "2026-08-24T10:00:00.000Z";
const FROM = "2026-08-24T10:00:00.000Z";
const UNTIL_NOON = "2026-08-24T12:00:00.000Z";
const UNTIL_TWO = "2026-08-24T14:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";
const AT_AFTER = "2026-08-24T13:00:00.000Z";

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

function intervention(
  overrides: Partial<InterventionDeclaration> = {}
): InterventionDeclaration {
  return {
    id: INT_A,
    project_id: PROJECT_ID,
    intervention_key: "repair_pipe",
    target_scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
    description: null,
    valid_from: FROM,
    valid_until: UNTIL_NOON,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function decisionSpace(
  overrides: Partial<DecisionSpaceDeclaration> = {}
): DecisionSpaceDeclaration {
  return {
    id: SPACE_D,
    project_id: PROJECT_ID,
    label: "respond to pipe condition",
    description: null,
    basis: [],
    valid_from: FROM,
    valid_until: UNTIL_NOON,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function decisionOption(
  overrides: Partial<DecisionOptionDeclaration> = {}
): DecisionOptionDeclaration {
  return {
    id: OPT_INT_A,
    project_id: PROJECT_ID,
    decision_space_id: SPACE_D,
    option: { kind: "INTERVENTION", intervention_id: INT_A },
    label: "repair",
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops-a" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function objective(referenceId: string = REF_A): RealityObjective {
  return {
    id: OBJ_A,
    project_id: PROJECT_ID,
    kind: "STATE_TARGET",
    label: "stable pressure",
    description: null,
    target_reference_condition_ids: [referenceId],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function referenceCondition(): ReferenceCondition {
  return {
    id: REF_A,
    project_id: PROJECT_ID,
    subject_id: ENTITY_PIPE,
    state_kind: "pressure",
    reference_kind: "DESIRED",
    criterion: { kind: "EQUALS", value: 90 },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function futureScenario(): FutureScenario {
  return {
    id: SCENARIO_A,
    project_id: PROJECT_ID,
    label: "pipe burst",
    description: null,
    as_of: FROM,
    basis_state_ids: [],
    basis_claim_ids: [],
    basis_evidence_ids: [],
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function baseProject(extras: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_PIPE, "pipe-A"),
      entity(ENTITY_ACTOR, "actor-A"),
      entity(ENTITY_DECLARER_A, "declarer-A"),
      entity(ENTITY_DECLARER_B, "declarer-B"),
    ],
    intervention_declarations: [],
    decision_space_declarations: [],
    decision_option_declarations: [],
    intervention_permission_declarations: [],
    capability_declarations: [],
    capability_verification_declarations: [],
    capability_availability_declarations: [],
    ...extras,
    schema_version: "0.1.24",
  };
}

function patch(
  entityKind: PatchEntity,
  entityId: string,
  payload: object
): StatePatch {
  return {
    schema_version: "0.1.24",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [{ op: "upsert", entity: entityKind, entity_id: entityId, payload }],
  } as StatePatch;
}

function withSpaceAndIntervention(): ProjectState {
  let next = applyPatch(
    baseProject(),
    patch("intervention_declaration", INT_A, intervention())
  );
  next = applyPatch(
    next,
    patch("decision_space_declaration", SPACE_D, decisionSpace())
  );
  return next;
}

describe("Decision Core (GROUND-025)", () => {
  it("migrates 0.1.14 → 0.1.16 with empty decision arrays", () => {
    assert.ok(validateProjectStateV0114(validProjectStateV0114).valid);
    const migrated = migrateProjectState(validProjectStateV0114);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.decision_space_declarations, []);
    assert.deepEqual(migrated.decision_option_declarations, []);
    assert.deepEqual(migrated.decision_option_actor_candidate_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("persists DecisionSpaceDeclaration roundtrip", () => {
    const next = applyPatch(
      baseProject(),
      patch("decision_space_declaration", SPACE_D, decisionSpace())
    );
    assert.equal(next.decision_space_declarations[0]?.label, "respond to pipe condition");
    assert.ok(validateProjectState(next).valid);
    const dir = join(process.cwd(), "ground-core/storage/.decision-tmp");
    try {
      saveProject(next, { storageDir: dir });
      const loaded = loadProject(PROJECT_ID, { storageDir: dir });
      assert.equal(loaded.decision_space_declarations[0]?.id, SPACE_D);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("allows empty basis without inference", () => {
    const next = applyPatch(
      baseProject(),
      patch("decision_space_declaration", SPACE_D, decisionSpace({ basis: [] }))
    );
    assert.deepEqual(next.decision_space_declarations[0]?.basis, []);
  });

  it("accepts REALITY_OBJECTIVE basis and rejects unknown objective", () => {
    let next = applyPatch(
      baseProject(),
      patch("reference_condition", REF_A, referenceCondition())
    );
    next = applyPatch(
      next,
      patch("reality_objective", OBJ_A, objective())
    );
    next = applyPatch(
      next,
      patch(
        "decision_space_declaration",
        SPACE_D,
        decisionSpace({
          basis: [{ kind: "REALITY_OBJECTIVE", objective_id: OBJ_A }],
        })
      )
    );
    assert.equal(next.decision_space_declarations[0]?.basis[0]?.kind, "REALITY_OBJECTIVE");
    assert.throws(
      () =>
        applyPatch(
          baseProject(),
          patch(
            "decision_space_declaration",
            SPACE_D,
            decisionSpace({
              basis: [
                {
                  kind: "REALITY_OBJECTIVE",
                  objective_id: "f4999999-9999-4999-8999-999999999999",
                },
              ],
            })
          )
        ),
      /missing RealityObjective/
    );
  });

  it("accepts REFERENCE_CONDITION and FUTURE_SCENARIO basis", () => {
    let next = applyPatch(
      baseProject(),
      patch("reference_condition", REF_A, referenceCondition())
    );
    next = applyPatch(
      next,
      patch("reality_objective", OBJ_A, objective())
    );
    next = applyPatch(
      next,
      patch("future_scenario", SCENARIO_A, futureScenario())
    );
    next = applyPatch(
      next,
      patch(
        "decision_space_declaration",
        SPACE_D,
        decisionSpace({
          basis: [
            { kind: "REFERENCE_CONDITION", reference_condition_id: REF_A },
            { kind: "FUTURE_SCENARIO", scenario_id: SCENARIO_A },
            { kind: "REALITY_OBJECTIVE", objective_id: OBJ_A },
          ],
        })
      )
    );
    assert.equal(next.decision_space_declarations[0]?.basis.length, 3);
    assert.throws(
      () =>
        applyPatch(
          next,
          patch(
            "decision_space_declaration",
            SPACE_D,
            decisionSpace({
              basis: [
                { kind: "REFERENCE_CONDITION", reference_condition_id: REF_A },
                { kind: "REFERENCE_CONDITION", reference_condition_id: REF_A },
              ],
            })
          )
        ),
      /duplicate basis/
    );
    assert.throws(
      () =>
        applyPatch(
          baseProject(),
          patch(
            "decision_space_declaration",
            SPACE_D,
            decisionSpace({
              basis: [
                {
                  kind: "REFERENCE_CONDITION",
                  reference_condition_id: "f4999999-9999-4999-8999-999999999999",
                },
              ],
            })
          )
        ),
      /missing ReferenceCondition/
    );
  });

  it("persists INTERVENTION and DO_NOTHING options without synthetic Intervention", () => {
    let next = withSpaceAndIntervention();
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_INT_A, decisionOption())
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_DN_A,
        decisionOption({
          id: OPT_DN_A,
          option: { kind: "DO_NOTHING" },
        })
      )
    );
    assert.equal(next.decision_option_declarations.length, 2);
    assert.equal(
      next.intervention_declarations.filter((e) => e.intervention_key === "do_nothing")
        .length,
      0
    );
    assert.equal(next.future_scenarios.length, 0);
  });

  it("has_options false when no options; existing Intervention not auto-option", () => {
    const project = applyPatch(
      baseProject(),
      patch("decision_space_declaration", SPACE_D, decisionSpace())
    );
    project.intervention_declarations.push(intervention());
    const assessment = assessDecisionSpace(project, SPACE_D, AT);
    assert.equal(assessment.has_options, false);
    assert.equal(assessment.has_intervention_options, false);
  });

  it("rejects same declarer duplicate semantic option with overlap", () => {
    let next = withSpaceAndIntervention();
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_INT_A, decisionOption())
    );
    assert.throws(
      () =>
        applyPatch(
          next,
          patch(
            "decision_option_declaration",
            OPT_INT_B,
            decisionOption({
              id: OPT_INT_B,
              label: "alternate label",
            })
          )
        ),
      /duplicates overlapping/
    );
  });

  it("preserves same Intervention option from different declarers in one position", () => {
    let next = withSpaceAndIntervention();
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_INT_A, decisionOption())
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_INT_B,
        decisionOption({
          id: OPT_INT_B,
          declared_by: { kind: "human", label: "ops-b" },
          label: "repair alt",
        })
      )
    );
    const positions = groupDecisionOptionPositions(next, SPACE_D, AT);
    assert.equal(positions.length, 1);
    assert.equal(positions[0]?.option_declaration_ids.length, 2);
    assert.equal(positions[0]?.has_multiple_declarations, true);
    assert.equal(decisionOptionSemanticKey({ kind: "INTERVENTION", intervention_id: INT_A }), positions[0]?.key);
  });

  it("groups multiple DO_NOTHING declarers into one semantic position", () => {
    let next = applyPatch(
      baseProject(),
      patch("decision_space_declaration", SPACE_D, decisionSpace())
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_DN_A,
        decisionOption({
          id: OPT_DN_A,
          option: { kind: "DO_NOTHING" },
          declared_by: { kind: "human", label: "a" },
        })
      )
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_DN_B,
        decisionOption({
          id: OPT_DN_B,
          option: { kind: "DO_NOTHING" },
          declared_by: { kind: "human", label: "b" },
        })
      )
    );
    const positions = groupDecisionOptionPositions(next, SPACE_D, AT);
    assert.equal(positions.length, 1);
    assert.equal(positions[0]?.kind, "DO_NOTHING");
    assert.equal(positions[0]?.option_declaration_ids.length, 2);
  });

  it("exposes temporal mismatch when space inactive and option active", () => {
    let next = withSpaceAndIntervention();
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_INT_A,
        decisionOption({ valid_from: FROM, valid_until: UNTIL_TWO })
      )
    );
    const assessment = assessDecisionSpace(next, SPACE_D, AT_AFTER);
    assert.equal(assessment.declaration_status, "DECISION_SPACE_NOT_ACTIVE");
    assert.equal(assessment.has_temporal_basis_mismatch, true);
    assert.equal(assessment.applicable_option_declarations.length, 1);
  });

  it("exposes intervention temporal mismatch without invalidating option", () => {
    let next = withSpaceAndIntervention();
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_INT_A,
        decisionOption({ valid_from: FROM, valid_until: UNTIL_TWO })
      )
    );
    const assessment = assessDecisionSpace(next, SPACE_D, AT_AFTER);
    const optionAssessment = assessment.option_assessments[0];
    assert.equal(optionAssessment?.intervention_active, false);
    assert.equal(optionAssessment?.has_intervention_temporal_mismatch, true);
  });

  it("DO_NOTHING assessment has no intervention specification", () => {
    let next = applyPatch(
      baseProject(),
      patch("decision_space_declaration", SPACE_D, decisionSpace())
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_DN_A,
        decisionOption({ id: OPT_DN_A, option: { kind: "DO_NOTHING" } })
      )
    );
    const assessment = assessDecisionSpace(next, SPACE_D, AT);
    assert.equal(assessment.has_do_nothing_option, true);
    const dn = assessment.option_assessments.find(
      (entry) => entry.position.kind === "DO_NOTHING"
    );
    assert.equal(dn?.intervention_specification, null);
    assert.equal(dn?.intervention_active, null);
  });

  it("does not evaluate Permission or Capability matching on options", () => {
    let next = withSpaceAndIntervention();
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_INT_A, decisionOption())
    );
    next = applyPatch(
      next,
      patch("intervention_permission_declaration", PERM_A, {
        id: PERM_A,
        project_id: PROJECT_ID,
        actor_entity_id: ENTITY_ACTOR,
        intervention_id: INT_A,
        effect: "PROHIBIT",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "gov" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      })
    );
    const permission = assessDeclaredInterventionPermission(
      next,
      ENTITY_ACTOR,
      INT_A,
      AT
    );
    assert.equal(permission.status, "PROHIBIT_DECLARED");
    const assessment = assessDecisionSpace(next, SPACE_D, AT);
    const json = JSON.stringify(assessment);
    assert.doesNotMatch(json, /feasible|candidate_actor|rank|score|winner|selected/);
  });

  it("assessment is read-only and deterministic", () => {
    let next = withSpaceAndIntervention();
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_INT_A, decisionOption())
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_DN_A,
        decisionOption({ id: OPT_DN_A, option: { kind: "DO_NOTHING" } })
      )
    );
    const before = structuredClone(next);
    const a = assessDecisionSpace(next, SPACE_D, AT);
    const b = assessDecisionSpace(next, SPACE_D, AT);
    assert.deepEqual(a, b);
    assert.deepEqual(next, before);
    assert.equal(a.semantic_option_count, 2);
    assert.equal(a.has_intervention_options, true);
    assert.equal(decisionBasisKey({ kind: "REALITY_OBJECTIVE", objective_id: OBJ_A }), `REALITY_OBJECTIVE|${OBJ_A}`);
  });

  it("legacy primary_next_action_id is unchanged by Decision Space/options", () => {
    const primaryBefore = baseProject().current_state.primary_next_action_id;
    let next = withSpaceAndIntervention();
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_INT_A, decisionOption())
    );
    assert.equal(next.current_state.primary_next_action_id, primaryBefore);
    assert.notEqual(next.current_state.primary_next_action_id, OPT_INT_A);
  });

  it("enforces deletion guards for space, intervention, and basis targets", () => {
    let next = applyPatch(
      baseProject(),
      patch("reference_condition", REF_A, referenceCondition())
    );
    next = applyPatch(
      next,
      patch("reality_objective", OBJ_A, objective())
    );
    next = applyPatch(
      next,
      patch("future_scenario", SCENARIO_A, futureScenario())
    );
    next = applyPatch(
      next,
      patch(
        "decision_space_declaration",
        SPACE_D,
        decisionSpace({
          basis: [
            { kind: "REALITY_OBJECTIVE", objective_id: OBJ_A },
            { kind: "REFERENCE_CONDITION", reference_condition_id: REF_A },
            { kind: "FUTURE_SCENARIO", scenario_id: SCENARIO_A },
          ],
        })
      )
    );
    next = applyPatch(
      next,
      patch("intervention_declaration", INT_A, intervention({ valid_until: null }))
    );
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_INT_A, decisionOption())
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "decision_space_declaration", entity_id: SPACE_D },
          ],
        }),
      /decision_option_declaration/
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "intervention_declaration", entity_id: INT_A },
          ],
        }),
      /decision_option_declaration/
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reality_objective", entity_id: OBJ_A },
          ],
        }),
      /decision_space_declaration.basis/
    );
  });

  it("uses [valid_from, valid_until) applicability for options", () => {
    const option = decisionOption({
      valid_from: FROM,
      valid_until: UNTIL_NOON,
    });
    assert.equal(isDecisionOptionDeclarationActiveAt(option, AT), true);
    assert.equal(isDecisionOptionDeclarationActiveAt(option, UNTIL_NOON), false);
    assert.equal(isDecisionSpaceActiveAt(decisionSpace(), AT), true);
    assert.equal(
      getApplicableDecisionOptions(
        applyPatch(
          withSpaceAndIntervention(),
          patch("decision_option_declaration", OPT_INT_A, option)
        ),
        SPACE_D,
        AT
      ).length,
      1
    );
  });

  it("contract: DecisionSpaceAssessment has no selection or ranking fields", () => {
    const assessment = assessDecisionSpace(withSpaceAndIntervention(), SPACE_D, AT);
    const keys = Object.keys(assessment).sort().join(",");
    assert.doesNotMatch(keys, /selected|winner|rank|score|recommended|feasible/);
    for (const optionAssessment of assessment.option_assessments) {
      const position = assessDecisionOption(
        withSpaceAndIntervention(),
        optionAssessment.position,
        AT
      );
      assert.doesNotMatch(JSON.stringify(position), /feasible|actor|executor|outcome|effect/);
    }
  });
});
