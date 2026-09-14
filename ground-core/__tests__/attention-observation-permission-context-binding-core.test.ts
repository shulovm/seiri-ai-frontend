/**
 * GROUND-087 — Observation Core XLI / Explicit Permission Observation-Context
 * Binding Foundation
 *
 * Pure 048 context + Entity/Intervention validation + binding specification
 * (relation only; no Permission declaration aggregation / temporal / OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_PERMISSION_CONTEXT_BINDING_MODEL_LIMITATIONS,
  attentionObservationPermissionContextBindingKey,
  buildAttentionObservationCapabilityRequirementSetKey,
  buildAttentionObservationPermissionContextBindingSet,
  normalizeAttentionObservationPermissionContextBindingSpecification,
} from "../reality/attention-observation-permission-context-binding-core.js";
import type {
  AttentionObservationPermissionContextBindingInput,
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
const NEED_KEY_2 = "need-b";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";
const REQ_KEY_3 =
  "attention-observation-capability-requirement|need|satellite_imaging";

const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ENTITY_B = "f4010101-0101-4101-8101-010101010102";
const ENTITY_OTHER_PROJECT = "f4010101-0101-4101-8101-010101010199";
const INT_A = "f4020202-0202-4202-8202-020202020201";
const INT_B = "f4020202-0202-4202-8202-020202020202";
const INT_OTHER_PROJECT = "f4020202-0202-4202-8202-020202020299";
const PERM_A = "f4030303-0303-4303-8303-030303030301";
const PERM_B = "f4030303-0303-4303-8303-030303030302";
const TS = "2026-08-24T10:00:00.000Z";

function assertNoPermissionSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PERMIT_DECLARED"/.test(json));
  assert.ok(!/"PROHIBIT_DECLARED"/.test(json));
  assert.ok(!/"CONTESTED_PERMISSION"/.test(json));
  assert.ok(!/"NO_PERMISSION_DECLARATIONS"/.test(json));
  assert.ok(!/"permission_effect"/.test(json));
  assert.ok(!/"permission_status"/.test(json));
  assert.ok(!/"permission_declaration_ids"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"is_permitted"/.test(json));
  assert.ok(!/"is_prohibited"/.test(json));
  assert.ok(!/"permission_winner"/.test(json));
  assert.ok(!/"PERMITTED"/.test(json));
  assert.ok(!/"DENIED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
  assert.ok(!/"evaluation_at"/.test(json));
  assert.ok(!/"\bat\b"\s*:/.test(json));
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
    valid_from: TS,
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
    valid_from: TS,
    valid_until: null,
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

function mockRequirementSet(options?: {
  candidates?: {
    candidate_key: string;
    status?:
      | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      | "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
      | "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
    observation_need_key?: string;
    requirements?: { key: string; semantic: string }[];
  }[];
}): AttentionObservationCapabilityRequirementSetAssessment {
  const candidates = options?.candidates ?? [
    {
      candidate_key: "cand",
      status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" as const,
      observation_need_key: NEED_KEY,
      requirements: [
        { key: REQ_KEY, semantic: "inspect" },
        { key: REQ_KEY_2, semantic: "human_inspection" },
      ],
    },
  ];

  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: candidates.map((c) => {
      const status =
        c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
      const requirements = c.requirements ?? [];
      const observation_need_key = c.observation_need_key ?? NEED_KEY;
      const hasExplicit =
        status === "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
        requirements.length > 0;

      return {
        candidate_key: c.candidate_key,
        planning: {} as never,
        status,
        capability_requirement_basis:
          status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            ? null
            : {
                observation_need_key,
                requirements: requirements.map((r) => ({
                  key: r.key,
                  observation_need_key,
                  capability_semantic_key: r.semantic,
                })),
              },
        has_explicit_capability_requirements: hasExplicit,
        model_limitations: [],
      };
    }),
    has_explicit_capability_requirements: candidates.some(
      (c) =>
        (c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT") ===
          "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
        (c.requirements?.length ?? 0) > 0
    ),
    model_limitations: [],
  };
}

function buildSet(
  bindings: AttentionObservationPermissionContextBindingInput[],
  options?: {
    requirementSet?: AttentionObservationCapabilityRequirementSetAssessment;
    projectState?: ProjectState;
  }
) {
  return buildAttentionObservationPermissionContextBindingSet({
    capability_requirement_set:
      options?.requirementSet ?? mockRequirementSet(),
    project_state: options?.projectState ?? mockProjectState(),
    specification: { bindings },
  });
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-087 Explicit Permission Observation-Context Binding", () => {
  describe("basic binding / declaration independence", () => {
    it("basic explicit binding PRESENT; no Permission assessment", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
      ]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
      );
      assert.equal(assessment.permission_context_bindings.length, 1);
      const binding = assessment.permission_context_bindings[0]!;
      assert.equal(binding.permission_actor_entity_id, ENTITY_A);
      assert.equal(binding.permission_intervention_id, INT_A);
      assert.equal(binding.candidate_key, "cand");
      assert.equal(binding.observation_need_key, NEED_KEY);
      assert.equal(
        binding.capability_requirement_set_key,
        buildAttentionObservationCapabilityRequirementSetKey("cand", NEED_KEY, [
          REQ_KEY,
          REQ_KEY_2,
        ])
      );
      assertNoPermissionSemantics(set);
    });

    it("binding valid with zero Permission declarations", () => {
      const set = buildSet(
        [
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_A,
          },
        ],
        {
          projectState: mockProjectState({
            permission_declarations: [],
          }),
        }
      );
      assert.equal(
        firstCandidate(set).status,
        "EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
      );
      assertNoPermissionSemantics(set);
    });

    it("PERMIT / PROHIBIT / contested declarations do not change binding; no aggregation statuses", () => {
      const bindingSpec = [
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
      ];

      const none = buildSet(bindingSpec, {
        projectState: mockProjectState({ permission_declarations: [] }),
      });
      const permit = buildSet(bindingSpec, {
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({ effect: "PERMIT" }),
          ],
        }),
      });
      const prohibit = buildSet(bindingSpec, {
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({ effect: "PROHIBIT" }),
          ],
        }),
      });
      const contested = buildSet(bindingSpec, {
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({ id: PERM_A, effect: "PERMIT" }),
            permissionDeclaration({
              id: PERM_B,
              effect: "PROHIBIT",
            }),
          ],
        }),
      });
      const reordered = buildSet(bindingSpec, {
        projectState: mockProjectState({
          permission_declarations: [
            permissionDeclaration({ id: PERM_B, effect: "PROHIBIT" }),
            permissionDeclaration({ id: PERM_A, effect: "PERMIT" }),
          ],
        }),
      });

      assert.deepEqual(
        none.candidate_assessments[0]!.permission_context_bindings,
        permit.candidate_assessments[0]!.permission_context_bindings
      );
      assert.deepEqual(
        permit.candidate_assessments[0]!.permission_context_bindings,
        prohibit.candidate_assessments[0]!.permission_context_bindings
      );
      assert.deepEqual(
        prohibit.candidate_assessments[0]!.permission_context_bindings,
        contested.candidate_assessments[0]!.permission_context_bindings
      );
      assert.deepEqual(
        contested.candidate_assessments[0]!.permission_context_bindings,
        reordered.candidate_assessments[0]!.permission_context_bindings
      );
      assertNoPermissionSemantics(contested);
    });
  });

  describe("duplicates / multiplicity / identity", () => {
    it("exact duplicate normalize; reorder same keys", () => {
      const a = buildSet([
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
      ]);
      assert.equal(a.specification.bindings.length, 1);
      assert.equal(
        firstCandidate(a).permission_context_bindings.length,
        1
      );

      const b = buildSet([
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_B,
          permission_intervention_id: INT_B,
        },
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
      ]);
      const c = buildSet([
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_B,
          permission_intervention_id: INT_B,
        },
      ]);
      assert.deepEqual(
        b.candidate_assessments[0]!.permission_context_bindings.map((x) => x.key),
        c.candidate_assessments[0]!.permission_context_bindings.map((x) => x.key)
      );
    });

    it("multiple distinct bindings retained; != conflict / ANY / ALL", () => {
      const set = buildSet([
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
      ]);
      assert.equal(
        firstCandidate(set).permission_context_bindings.length,
        3
      );
      assert.equal(
        firstCandidate(set).status,
        "EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
      );
      const json = JSON.stringify(set);
      assert.ok(!/"CONFLICT"/.test(json));
      assert.ok(!/"has_permission_conflict"/.test(json));
      assert.ok(!/"ANY"/.test(json));
      assert.ok(!/"ALL"/.test(json));
      assert.ok(
        !Object.prototype.hasOwnProperty.call(
          firstCandidate(set),
          "binding_composition"
        )
      );
    });

    it("actor / intervention / Requirement-set change identity; Requirement reorder invariant", () => {
      const base = firstCandidate(
        buildSet([
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_A,
          },
        ])
      ).permission_context_bindings[0]!;

      const actorChanged = firstCandidate(
        buildSet([
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_B,
            permission_intervention_id: INT_A,
          },
        ])
      ).permission_context_bindings[0]!;
      assert.notEqual(base.key, actorChanged.key);

      const interventionChanged = firstCandidate(
        buildSet([
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_B,
          },
        ])
      ).permission_context_bindings[0]!;
      assert.notEqual(base.key, interventionChanged.key);

      const setChanged = firstCandidate(
        buildSet(
          [
            {
              candidate_key: "cand",
              permission_actor_entity_id: ENTITY_A,
              permission_intervention_id: INT_A,
            },
          ],
          {
            requirementSet: mockRequirementSet({
              candidates: [
                {
                  candidate_key: "cand",
                  requirements: [
                    { key: REQ_KEY, semantic: "inspect" },
                    { key: REQ_KEY_2, semantic: "human_inspection" },
                    { key: REQ_KEY_3, semantic: "satellite_imaging" },
                  ],
                },
              ],
            }),
          }
        )
      ).permission_context_bindings[0]!;
      assert.notEqual(base.key, setChanged.key);

      const reorderedReqs = firstCandidate(
        buildSet(
          [
            {
              candidate_key: "cand",
              permission_actor_entity_id: ENTITY_A,
              permission_intervention_id: INT_A,
            },
          ],
          {
            requirementSet: mockRequirementSet({
              candidates: [
                {
                  candidate_key: "cand",
                  requirements: [
                    { key: REQ_KEY_2, semantic: "human_inspection" },
                    { key: REQ_KEY, semantic: "inspect" },
                  ],
                },
              ],
            }),
          }
        )
      ).permission_context_bindings[0]!;
      assert.equal(base.key, reorderedReqs.key);
      assert.equal(
        base.key,
        attentionObservationPermissionContextBindingKey(
          "cand",
          NEED_KEY,
          base.capability_requirement_set_key,
          ENTITY_A,
          INT_A
        )
      );
    });
  });

  describe("validation / absence / NOT_APPLICABLE", () => {
    it("unknown actor / intervention / cross-project reject", () => {
      assert.throws(() =>
        buildSet([
          {
            candidate_key: "cand",
            permission_actor_entity_id: "missing-actor",
            permission_intervention_id: INT_A,
          },
        ])
      );
      assert.throws(() =>
        buildSet([
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: "missing-intervention",
          },
        ])
      );
      assert.throws(() =>
        buildSet(
          [
            {
              candidate_key: "cand",
              permission_actor_entity_id: ENTITY_OTHER_PROJECT,
              permission_intervention_id: INT_A,
            },
          ],
          {
            projectState: mockProjectState({
              entities: [
                entity(ENTITY_A),
                entity(ENTITY_OTHER_PROJECT, {
                  project_id: "other-project-id",
                }),
              ],
            }),
          }
        )
      );
      assert.throws(() =>
        buildSet(
          [
            {
              candidate_key: "cand",
              permission_actor_entity_id: ENTITY_A,
              permission_intervention_id: INT_OTHER_PROJECT,
            },
          ],
          {
            projectState: mockProjectState({
              interventions: [
                intervention(INT_A),
                intervention(INT_OTHER_PROJECT, {
                  project_id: "other-project-id",
                }),
              ],
            }),
          }
        )
      );
    });

    it("no binding != NO_PERMISSION_DECLARATIONS; empty spec no Permission semantics", () => {
      const set = buildSet([]);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(firstCandidate(set).permission_context_bindings.length, 0);
      assert.equal(
        set.has_explicit_permission_observation_context_bindings,
        false
      );
      assert.ok(
        !JSON.stringify(set).includes("NO_PERMISSION_DECLARATIONS")
      );
      assertNoPermissionSemantics(set);
    });

    it("no planning / no Requirements NOT_APPLICABLE; binding on non-applicable rejects", () => {
      const set = buildSet(
        [],
        {
          requirementSet: mockRequirementSet({
            candidates: [
              {
                candidate_key: "c1",
                status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
                requirements: [],
              },
              {
                candidate_key: "c2",
                status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
                requirements: [],
              },
            ],
          }),
        }
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );

      assert.throws(() =>
        buildSet(
          [
            {
              candidate_key: "c1",
              permission_actor_entity_id: ENTITY_A,
              permission_intervention_id: INT_A,
            },
          ],
          {
            requirementSet: mockRequirementSet({
              candidates: [
                {
                  candidate_key: "c1",
                  status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
                  requirements: [],
                },
              ],
            }),
          }
        )
      );

      assert.throws(() =>
        buildSet([
          {
            candidate_key: "missing",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_A,
          },
        ])
      );
    });
  });

  describe("isolation / determinism / firewalls", () => {
    it("cross-Candidate isolation; actor binding != Candidate identity; intervention != Need identity", () => {
      const set = buildSet(
        [
          {
            candidate_key: "b",
            permission_actor_entity_id: ENTITY_B,
            permission_intervention_id: INT_B,
          },
          {
            candidate_key: "a",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_A,
          },
        ],
        {
          requirementSet: mockRequirementSet({
            candidates: [
              {
                candidate_key: "a",
                observation_need_key: NEED_KEY,
                requirements: [{ key: REQ_KEY, semantic: "inspect" }],
              },
              {
                candidate_key: "b",
                observation_need_key: NEED_KEY_2,
                requirements: [{ key: REQ_KEY_2, semantic: "human_inspection" }],
              },
            ],
          }),
        }
      );
      assert.equal(set.candidate_assessments[0]!.candidate_key, "a");
      assert.equal(set.candidate_assessments[1]!.candidate_key, "b");
      assert.notEqual(
        set.candidate_assessments[0]!.permission_context_bindings[0]!.key,
        set.candidate_assessments[1]!.permission_context_bindings[0]!.key
      );
      const bindingA =
        set.candidate_assessments[0]!.permission_context_bindings[0]!;
      assert.notEqual(bindingA.candidate_key, bindingA.permission_actor_entity_id);
      assert.notEqual(
        bindingA.observation_need_key,
        bindingA.permission_intervention_id
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(bindingA, "executor_entity_id"),
        false
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(bindingA, "assignment"),
        false
      );
    });

    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const requirementSet = mockRequirementSet();
      const projectState = mockProjectState({
        permission_declarations: [
          permissionDeclaration({ effect: "PROHIBIT" }),
        ],
      });
      const specification = {
        bindings: [
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_B,
            permission_intervention_id: INT_A,
          },
          {
            candidate_key: "cand",
            permission_actor_entity_id: ENTITY_A,
            permission_intervention_id: INT_B,
          },
        ],
      };
      const beforeReq = structuredClone(requirementSet);
      const beforeProject = structuredClone(projectState);
      const beforeSpec = structuredClone(specification);

      const a = buildAttentionObservationPermissionContextBindingSet({
        capability_requirement_set: requirementSet,
        project_state: projectState,
        specification,
      });
      const b = buildAttentionObservationPermissionContextBindingSet({
        capability_requirement_set: requirementSet,
        project_state: projectState,
        specification,
      });
      assert.deepEqual(a, b);
      assert.deepEqual(requirementSet, beforeReq);
      assert.deepEqual(projectState, beforeProject);
      assert.deepEqual(specification, beforeSpec);

      const cloned = {
        capability_requirement_set: structuredClone(requirementSet),
        project_state: structuredClone(projectState),
        specification: structuredClone(specification),
      };
      const c = buildAttentionObservationPermissionContextBindingSet(cloned);
      assert.deepEqual(a, c);
      assert.notEqual(
        a.capability_requirement_set,
        cloned.capability_requirement_set
      );
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_PERMISSION_CONTEXT_BINDING_MODEL_LIMITATIONS[0],
        "OBSERVATION_CONTEXT_PERMISSION_DECLARATION_ASSESSMENT_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_PERMISSION_CONTEXT_BINDING_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; no Permission aggregation / temporal / OE / 083–085", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-permission-context-binding-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-permission-context-binding-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_requirement_set/.test(core));
      assert.ok(/reality_entities/.test(core));
      assert.ok(/intervention_declarations/.test(core));
      assert.ok(
        !/projectState\.intervention_permission_declarations/.test(core)
      );
      assert.ok(
        !/project_state\.intervention_permission_declarations/.test(core)
      );
      assert.ok(
        !/from ["'].*permission-core/.test(src)
      );
      assert.ok(
        !/assessDeclaredInterventionPermission/.test(src)
      );
      assert.ok(!/isInterventionPermissionActiveAt/.test(src));
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
      assert.ok(!/\.required_dimensions\b/.test(core));
      assert.ok(!/required_dimensions\s*:/.test(types));

      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\s*\(/.test(core));
      assert.ok(!/\bapplyPatch\s*\(/.test(core));
      assert.ok(!/\bStatePatch\b/.test(types));

      assert.ok(!/permission_effect\s*:/.test(src));
      assert.ok(!/permission_status\s*:/.test(src));
      assert.ok(!/permission_declaration_ids\s*:/.test(src));
      assert.ok(!/\bat\s*:/.test(types));
      assert.ok(!/evaluation_at\s*:/.test(src));
      assert.ok(!/"PERMITTED"/.test(src));
      assert.ok(!/"DENIED"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver|dispatchObservation|scheduleObservation/.test(src));
    });

    it("normalize rejects empty candidate key", () => {
      assert.throws(() =>
        normalizeAttentionObservationPermissionContextBindingSpecification(
          mockRequirementSet(),
          mockProjectState(),
          {
            bindings: [
              {
                candidate_key: "  ",
                permission_actor_entity_id: ENTITY_A,
                permission_intervention_id: INT_A,
              },
            ],
          }
        )
      );
    });
  });
});
