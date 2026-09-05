/**
 * GROUND-088 — Observation Core XLII / Observation-Context Declared Permission
 * Assessment Foundation
 *
 * Pure 087 Binding + explicit evaluation instant + GROUND-024
 * assessDeclaredInterventionPermission (raw vocabulary preserved; no effective
 * Permission / ANY-ALL / Authority precedence / OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_DECLARED_PERMISSION_ASSESSMENT_MODEL_LIMITATIONS,
  assertPermissionEvaluationAt,
  attentionObservationDeclaredPermissionAssessmentKey,
  buildAttentionObservationDeclaredPermissionAssessmentSet,
  buildDeclaredInterventionPermissionAssessmentCanonicalKey,
  normalizeAttentionObservationDeclaredPermissionEvaluationSpecification,
} from "../reality/attention-observation-declared-permission-assessment-core.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  buildAttentionObservationPermissionContextBindingSet,
} from "../reality/attention-observation-permission-context-binding-core.js";
import type {
  AttentionObservationPermissionContextBindingSetAssessment,
} from "../reality/attention-observation-permission-context-binding-types.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import type {
  InterventionDeclaration,
  InterventionPermissionDeclaration,
  ProjectState,
  RealityEntity,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";

const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ENTITY_B = "f4010101-0101-4101-8101-010101010102";
const INT_A = "f4020202-0202-4202-8202-020202020201";
const INT_B = "f4020202-0202-4202-8202-020202020202";
const PERM_A = "f4030303-0303-4303-8303-030303030301";
const PERM_B = "f4030303-0303-4303-8303-030303030302";
const PERM_C = "f4030303-0303-4303-8303-030303030303";

const TS = "2026-08-24T10:00:00.000Z";
const FROM = "2026-08-24T10:00:00.000Z";
const UNTIL = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";
const AT_BEFORE = "2026-08-24T09:00:00.000Z";
const AT_AFTER = "2026-08-24T13:00:00.000Z";
const AT_ALT = "2026-08-24T11:30:00.000Z";

function assertNoEffectivePermissionSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PERMITTED"/.test(json));
  assert.ok(!/"DENIED"/.test(json));
  assert.ok(!/"ALLOWED"/.test(json));
  assert.ok(!/"NOT_ALLOWED"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"is_permitted"/.test(json));
  assert.ok(!/"is_prohibited"/.test(json));
  assert.ok(!/"permission_winner"/.test(json));
  assert.ok(!/"may_execute"/.test(json));
  assert.ok(!/"has_permission"\s*:/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
}

function entity(
  id: string,
  overrides: Partial<RealityEntity> = {}
): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "organization",
    label: id,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function intervention(
  id: string,
  overrides: Partial<InterventionDeclaration> = {}
): InterventionDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    intervention_key: `key-${id}`,
    target_scope: { kind: "UNSCOPED" },
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function permissionDeclaration(
  overrides: Partial<InterventionPermissionDeclaration> = {}
): InterventionPermissionDeclaration {
  return {
    id: PERM_A,
    project_id: PROJECT_ID,
    actor_entity_id: ENTITY_A,
    intervention_id: INT_A,
    effect: "PERMIT",
    valid_from: FROM,
    valid_until: UNTIL,
    declared_by: { kind: "organization", entity_id: ENTITY_A },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function mockProjectState(options?: {
  entities?: RealityEntity[];
  interventions?: InterventionDeclaration[];
  permission_declarations?: InterventionPermissionDeclaration[];
}): ProjectState {
  return {
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: options?.entities ?? [
      entity(ENTITY_A),
      entity(ENTITY_B),
    ],
    intervention_declarations: options?.interventions ?? [
      intervention(INT_A),
      intervention(INT_B),
    ],
    intervention_permission_declarations:
      options?.permission_declarations ?? [],
  } as ProjectState;
}

function mockRequirementSet(): AttentionObservationCapabilityRequirementSetAssessment {
  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: [
      {
        candidate_key: "cand",
        planning: {} as never,
        status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT",
        capability_requirement_basis: {
          observation_need_key: NEED_KEY,
          requirements: [
            {
              key: REQ_KEY,
              observation_need_key: NEED_KEY,
              capability_semantic_key: "inspect",
            },
            {
              key: REQ_KEY_2,
              observation_need_key: NEED_KEY,
              capability_semantic_key: "human_inspection",
            },
          ],
        },
        has_explicit_capability_requirements: true,
        model_limitations: [],
      },
    ],
    has_explicit_capability_requirements: true,
    model_limitations: [],
  };
}

function buildBindingSet(
  bindings: {
    candidate_key: string;
    permission_actor_entity_id: string;
    permission_intervention_id: string;
  }[],
  projectState: ProjectState = mockProjectState(),
  requirementSet: AttentionObservationCapabilityRequirementSetAssessment = mockRequirementSet()
): AttentionObservationPermissionContextBindingSetAssessment {
  return buildAttentionObservationPermissionContextBindingSet({
    capability_requirement_set: requirementSet,
    project_state: projectState,
    specification: { bindings },
  });
}

function buildSet(options: {
  bindings?: {
    candidate_key: string;
    permission_actor_entity_id: string;
    permission_intervention_id: string;
  }[];
  evaluations?: {
    candidate_key: string;
    permission_evaluation_at: string;
  }[];
  projectState?: ProjectState;
  bindingSet?: AttentionObservationPermissionContextBindingSetAssessment;
}) {
  const projectState = options.projectState ?? mockProjectState();
  const bindingSet =
    options.bindingSet ??
    buildBindingSet(
      options.bindings ?? [
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
      ],
      projectState
    );

  return buildAttentionObservationDeclaredPermissionAssessmentSet({
    permission_context_binding_set: bindingSet,
    project_state: projectState,
    specification: {
      evaluations: options.evaluations ?? [
        { candidate_key: "cand", permission_evaluation_at: AT },
      ],
    },
  });
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

function firstBindingAssessment(set: ReturnType<typeof buildSet>) {
  return firstCandidate(set).declared_permission_binding_assessments[0]!;
}

describe("GROUND-088 Observation-Context Declared Permission Assessment", () => {
  describe("raw GROUND-024 status preservation", () => {
    it("zero declarations → NO_PERMISSION_DECLARATIONS; no ALLOWED/DENIED", () => {
      const set = buildSet({
        projectState: mockProjectState({ permission_declarations: [] }),
      });
      const assessment = firstBindingAssessment(set);
      assert.equal(
        firstCandidate(set).status,
        "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT"
      );
      assert.equal(
        assessment.declared_permission_status,
        "NO_PERMISSION_DECLARATIONS"
      );
      assert.deepEqual(assessment.applicable_permission_declaration_ids, []);
      assertNoEffectivePermissionSemantics(set);
    });

    it("PERMIT only → PERMIT_DECLARED; no PERMITTED", () => {
      const set = buildSet({
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({ effect: "PERMIT" }),
          ],
        }),
      });
      assert.equal(
        firstBindingAssessment(set).declared_permission_status,
        "PERMIT_DECLARED"
      );
      assert.deepEqual(
        firstBindingAssessment(set).applicable_permission_declaration_ids,
        [PERM_A]
      );
      assertNoEffectivePermissionSemantics(set);
    });

    it("PROHIBIT only → PROHIBIT_DECLARED; no DENIED", () => {
      const set = buildSet({
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({ effect: "PROHIBIT" }),
          ],
        }),
      });
      assert.equal(
        firstBindingAssessment(set).declared_permission_status,
        "PROHIBIT_DECLARED"
      );
      assertNoEffectivePermissionSemantics(set);
    });

    it("PERMIT + PROHIBIT → CONTESTED_PERMISSION; no winner", () => {
      const set = buildSet({
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({
              id: PERM_A,
              effect: "PERMIT",
              declared_by: { kind: "organization", entity_id: ENTITY_A },
            }),
            permissionDeclaration({
              id: PERM_B,
              effect: "PROHIBIT",
              declared_by: { kind: "organization", entity_id: ENTITY_B },
            }),
          ],
        }),
      });
      const assessment = firstBindingAssessment(set);
      assert.equal(
        assessment.declared_permission_status,
        "CONTESTED_PERMISSION"
      );
      assert.equal(
        assessment.declared_permission_assessment.has_permission_conflict,
        true
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(assessment, "permission_winner"),
        false
      );
      assertNoEffectivePermissionSemantics(set);
    });
  });

  describe("temporal boundary / evaluation instant", () => {
    it("inactive before valid_from; active at valid_from; inactive at valid_until", () => {
      const projectState = mockProjectState({
        permission_declarations: [
          permissionDeclaration({
            effect: "PERMIT",
            valid_from: FROM,
            valid_until: UNTIL,
          }),
        ],
      });

      const before = buildSet({
        projectState,
        evaluations: [
          { candidate_key: "cand", permission_evaluation_at: AT_BEFORE },
        ],
      });
      assert.equal(
        firstBindingAssessment(before).declared_permission_status,
        "NO_PERMISSION_DECLARATIONS"
      );

      const atFrom = buildSet({
        projectState,
        evaluations: [
          { candidate_key: "cand", permission_evaluation_at: FROM },
        ],
      });
      assert.equal(
        firstBindingAssessment(atFrom).declared_permission_status,
        "PERMIT_DECLARED"
      );

      const atUntil = buildSet({
        projectState,
        evaluations: [
          { candidate_key: "cand", permission_evaluation_at: UNTIL },
        ],
      });
      assert.equal(
        firstBindingAssessment(atUntil).declared_permission_status,
        "NO_PERMISSION_DECLARATIONS"
      );
    });

    it("bindings present + no instant → NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED", () => {
      const set = buildSet({ evaluations: [] });
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
      );
      assert.equal(firstCandidate(set).permission_evaluation_at, null);
      assert.equal(
        firstCandidate(set).declared_permission_binding_assessments.length,
        0
      );
    });

    it("different explicit instant changes assessment key; duplicate instant normalize; conflict reject", () => {
      const projectState = mockProjectState({
        permission_declarations: [
          permissionDeclaration({ effect: "PERMIT" }),
        ],
      });
      const a = firstBindingAssessment(
        buildSet({
          projectState,
          evaluations: [
            { candidate_key: "cand", permission_evaluation_at: AT },
          ],
        })
      );
      const b = firstBindingAssessment(
        buildSet({
          projectState,
          evaluations: [
            { candidate_key: "cand", permission_evaluation_at: AT_ALT },
          ],
        })
      );
      assert.notEqual(a.key, b.key);
      assert.equal(a.permission_evaluation_at, AT);
      assert.equal(b.permission_evaluation_at, AT_ALT);

      const dup = buildSet({
        projectState,
        evaluations: [
          { candidate_key: "cand", permission_evaluation_at: AT },
          { candidate_key: "cand", permission_evaluation_at: AT },
        ],
      });
      assert.equal(dup.specification.evaluations.length, 1);

      assert.throws(() =>
        buildSet({
          projectState,
          evaluations: [
            { candidate_key: "cand", permission_evaluation_at: AT },
            { candidate_key: "cand", permission_evaluation_at: AT_ALT },
          ],
        })
      );

      assert.throws(() => assertPermissionEvaluationAt("not-an-instant"));
      assert.throws(() => assertPermissionEvaluationAt(""));
    });
  });

  describe("binding / multiplicity / lineage", () => {
    it("no binding ≠ NO_PERMISSION_DECLARATIONS; instant + no binding does not synthesize", () => {
      const bindingSet = buildBindingSet([]);
      const set = buildSet({
        bindingSet,
        evaluations: [
          { candidate_key: "cand", permission_evaluation_at: AT },
        ],
      });
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(
        firstCandidate(set).declared_permission_binding_assessments.length,
        0
      );
      assert.equal(firstCandidate(set).permission_evaluation_at, null);
      assert.ok(
        !JSON.stringify(firstCandidate(set)).includes(
          "NO_PERMISSION_DECLARATIONS"
        )
      );
    });

    it("multiple bindings: one assessment each; mixed statuses independent; no ANY/ALL/veto", () => {
      const projectState = mockProjectState({
        permission_declarations: [
          permissionDeclaration({
            id: PERM_A,
            actor_entity_id: ENTITY_A,
            intervention_id: INT_A,
            effect: "PERMIT",
          }),
          permissionDeclaration({
            id: PERM_B,
            actor_entity_id: ENTITY_A,
            intervention_id: INT_B,
            effect: "PROHIBIT",
            declared_by: { kind: "organization", entity_id: ENTITY_B },
          }),
        ],
      });
      const set = buildSet({
        projectState,
        bindings: [
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_A,
          },
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_B,
          },
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_B,
            permission_intervention_id: INT_A,
          },
        ],
      });
      const assessments =
        firstCandidate(set).declared_permission_binding_assessments;
      assert.equal(assessments.length, 3);
      assert.equal(assessments[0]!.declared_permission_status, "PERMIT_DECLARED");
      assert.equal(
        assessments[1]!.declared_permission_status,
        "PROHIBIT_DECLARED"
      );
      assert.equal(
        assessments[2]!.declared_permission_status,
        "NO_PERMISSION_DECLARATIONS"
      );

      const bindingKeys =
        firstCandidate(set).permission_context_binding_assessment
          .permission_context_bindings.map((b) => b.key);
      assert.deepEqual(
        assessments.map((a) => a.permission_context_binding_key),
        bindingKeys
      );

      const json = JSON.stringify(set);
      assert.ok(!/"ANY"/.test(json));
      assert.ok(!/"ALL"/.test(json));
      assert.ok(!/"permission_winner"/.test(json));
      assert.ok(!/"global_veto"/.test(json));
    });

    it("binding lineage retained; declaration reorder same output; declaration-set change changes key", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
      ]);
      const bindingKey =
        bindingSet.candidate_assessments[0]!.permission_context_bindings[0]!
          .key;

      const a = buildSet({
        bindingSet,
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({ id: PERM_A, effect: "PERMIT" }),
            permissionDeclaration({
              id: PERM_C,
              effect: "PERMIT",
              declared_by: { kind: "organization", entity_id: ENTITY_B },
            }),
          ],
        }),
      });
      const b = buildSet({
        bindingSet,
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({
              id: PERM_C,
              effect: "PERMIT",
              declared_by: { kind: "organization", entity_id: ENTITY_B },
            }),
            permissionDeclaration({ id: PERM_A, effect: "PERMIT" }),
          ],
        }),
      });
      assert.deepEqual(
        a.candidate_assessments[0]!.declared_permission_binding_assessments,
        b.candidate_assessments[0]!.declared_permission_binding_assessments
      );
      assert.equal(
        firstBindingAssessment(a).permission_context_binding_key,
        bindingKey
      );

      const oneDecl = buildSet({
        bindingSet,
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({ id: PERM_A, effect: "PERMIT" }),
          ],
        }),
      });
      assert.equal(
        firstBindingAssessment(oneDecl).declared_permission_status,
        "PERMIT_DECLARED"
      );
      assert.notEqual(
        firstBindingAssessment(a).key,
        firstBindingAssessment(oneDecl).key
      );

      // 087 binding identity unchanged when declarations change
      assert.equal(
        a.permission_context_binding_set.candidate_assessments[0]!
          .permission_context_bindings[0]!.key,
        bindingKey
      );
      assert.equal(
        oneDecl.permission_context_binding_set.candidate_assessments[0]!
          .permission_context_bindings[0]!.key,
        bindingKey
      );
    });
  });

  describe("set boolean / validation / determinism", () => {
    it("set boolean true for all NO_DECLARATIONS / PROHIBIT / CONTESTED", () => {
      for (const declarations of [
        [],
        [permissionDeclaration({ effect: "PROHIBIT" })],
        [
          permissionDeclaration({ id: PERM_A, effect: "PERMIT" }),
          permissionDeclaration({
            id: PERM_B,
            effect: "PROHIBIT",
            declared_by: { kind: "organization", entity_id: ENTITY_B },
          }),
        ],
      ]) {
        const set = buildSet({
          projectState: mockProjectState({
            permission_declarations: declarations,
          }),
        });
        assert.equal(
          set.has_observation_context_declared_permission_assessments,
          true
        );
        assert.equal(
          Object.prototype.hasOwnProperty.call(set, "has_permission"),
          false
        );
        assert.equal(
          Object.prototype.hasOwnProperty.call(set, "is_permitted"),
          false
        );
      }
    });

    it("stale actor/intervention reject; unknown evaluation target reject", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
      ]);
      assert.throws(() =>
        buildSet({
          bindingSet,
          projectState: mockProjectState({
            entities: [entity(ENTITY_B)],
            interventions: [intervention(INT_A)],
          }),
        })
      );
      assert.throws(() =>
        buildSet({
          bindingSet,
          projectState: mockProjectState({
            entities: [entity(ENTITY_A)],
            interventions: [intervention(INT_B)],
          }),
        })
      );
      assert.throws(() =>
        buildSet({
          bindingSet,
          evaluations: [
            { candidate_key: "missing", permission_evaluation_at: AT },
          ],
        })
      );
    });

    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const projectState = mockProjectState({
        permission_declarations: [
          permissionDeclaration({ effect: "PERMIT" }),
        ],
      });
      const bindingSet = buildBindingSet(
        [
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_A,
          },
        ],
        projectState
      );
      const specification = {
        evaluations: [
          { candidate_key: "cand", permission_evaluation_at: AT },
        ],
      };
      const beforeBinding = structuredClone(bindingSet);
      const beforeProject = structuredClone(projectState);
      const beforeSpec = structuredClone(specification);

      const a = buildAttentionObservationDeclaredPermissionAssessmentSet({
        permission_context_binding_set: bindingSet,
        project_state: projectState,
        specification,
      });
      const b = buildAttentionObservationDeclaredPermissionAssessmentSet({
        permission_context_binding_set: bindingSet,
        project_state: projectState,
        specification,
      });
      assert.deepEqual(a, b);
      assert.deepEqual(bindingSet, beforeBinding);
      assert.deepEqual(projectState, beforeProject);
      assert.deepEqual(specification, beforeSpec);

      const cloned = {
        permission_context_binding_set: structuredClone(bindingSet),
        project_state: structuredClone(projectState),
        specification: structuredClone(specification),
      };
      const c =
        buildAttentionObservationDeclaredPermissionAssessmentSet(cloned);
      assert.deepEqual(a, c);
      assert.notEqual(
        a.permission_context_binding_set,
        cloned.permission_context_binding_set
      );

      const assessment = firstBindingAssessment(a);
      assert.equal(
        assessment.key,
        attentionObservationDeclaredPermissionAssessmentKey(
          "cand",
          NEED_KEY,
          assessment.capability_requirement_set_key,
          assessment.permission_context_binding_key,
          AT,
          buildDeclaredInterventionPermissionAssessmentCanonicalKey(
            assessment.declared_permission_assessment
          )
        )
      );
      assert.equal(
        assessment.capability_requirement_set_key,
        buildAttentionObservationCapabilityRequirementSetKey("cand", NEED_KEY, [
          REQ_KEY,
          REQ_KEY_2,
        ])
      );
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_DECLARED_PERMISSION_ASSESSMENT_MODEL_LIMITATIONS[0],
        "OBSERVATION_CONTEXT_PERMISSION_CURRENT_STATE_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_DECLARED_PERMISSION_ASSESSMENT_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 087+024 only; no governance / OE / wall-clock / 083–085", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-declared-permission-assessment-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-declared-permission-assessment-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/assessDeclaredInterventionPermission/.test(core));
      assert.ok(
        /attention-observation-permission-context-binding/.test(core)
      );
      assert.ok(!/assessPermissionIssuerGovernance/.test(src));
      assert.ok(!/assessInterventionPermissionGovernance/.test(src));
      assert.ok(
        !/from ["'].*capability-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*operational-eligibility-capability-state-source-core/.test(
          src
        )
      );
      assert.ok(
        !/from ["'].*feasibility-core/.test(src)
      );
      assert.ok(!/\.required_dimensions\b/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/Date\.parse\(/.test(core));
      assert.ok(!/\bsaveProject\s*\(/.test(core));
      assert.ok(!/\bapplyPatch\s*\(/.test(core));
      assert.ok(!/\bStatePatch\b/.test(types));
      assert.ok(!/"PERMITTED"/.test(src));
      assert.ok(!/"DENIED"/.test(src));
      assert.ok(!/"ALLOWED"/.test(src));
      assert.ok(!/permission_winner\s*:/.test(src));
      assert.ok(!/effective_permission\s*:/.test(src));
      assert.ok(!/is_permitted\s*:/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver|dispatchObservation|scheduleObservation/.test(src));
    });

    it("normalize rejects empty candidate key", () => {
      assert.throws(() =>
        normalizeAttentionObservationDeclaredPermissionEvaluationSpecification(
          buildBindingSet([
            {
              candidate_key: "cand",
              permission_actor_entity_id: ENTITY_A,
              permission_intervention_id: INT_A,
            },
          ]),
          {
            evaluations: [
              {
                candidate_key: "  ",
                permission_evaluation_at: AT,
              },
            ],
          }
        )
      );
    });
  });
});
