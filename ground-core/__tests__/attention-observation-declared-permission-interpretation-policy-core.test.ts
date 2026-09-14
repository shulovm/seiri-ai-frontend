/**
 * GROUND-089 — Observation Core XLIII / Explicit Declared Permission
 * Interpretation Policy Foundation
 *
 * Pure 087 Binding + explicit interpretation policy specification
 * (declaration only; no 088 current assessment matching / Permission State /
 * OE / defaults).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationDeclaredPermissionInterpretationPolicyKey,
  buildAttentionObservationDeclaredPermissionInterpretationPolicySet,
  buildCanonicalDeclaredPermissionInterpretationMappingSetKey,
  canonicalizeDeclaredPermissionInterpretationMappings,
  CANONICAL_DECLARED_INTERVENTION_PERMISSION_STATUS_ORDER,
  CANONICAL_DECLARED_PERMISSION_INTERPRETATION_ORDER,
  normalizeAttentionObservationDeclaredPermissionInterpretationPolicySpecification,
} from "../reality/attention-observation-declared-permission-interpretation-policy-core.js";
import type {
  AttentionObservationDeclaredPermissionInterpretationMapping,
} from "../reality/attention-observation-declared-permission-interpretation-policy-types.js";
import {
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
  ProjectState,
  RealityEntity,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ENTITY_B = "f4010101-0101-4101-8101-010101010102";
const INT_A = "f4020202-0202-4202-8202-020202020201";
const INT_B = "f4020202-0202-4202-8202-020202020202";
const TS = "2026-08-24T10:00:00.000Z";

const NO_DECL = "NO_PERMISSION_DECLARATIONS" as const;
const PERMIT_DECL = "PERMIT_DECLARED" as const;
const PROHIBIT_DECL = "PROHIBIT_DECLARED" as const;
const CONTESTED = "CONTESTED_PERMISSION" as const;
const AS_PERMITTED = "INTERPRET_AS_PERMISSION_PERMITTED" as const;
const AS_PROHIBITED = "INTERPRET_AS_PERMISSION_PROHIBITED" as const;

function assertNoCurrentPermissionSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PERMISSION_PERMITTED"/.test(json));
  assert.ok(!/"PERMISSION_PROHIBITED"/.test(json));
  assert.ok(!/"PERMITTED"/.test(json));
  assert.ok(!/"PROHIBITED"/.test(json));
  assert.ok(!/"DENIED"/.test(json));
  assert.ok(!/"ALLOWED"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"is_permitted"/.test(json));
  assert.ok(!/"permission_winner"/.test(json));
  assert.ok(!/"permission_evaluation_at"/.test(json));
  assert.ok(!/"current_declared_permission_status"/.test(json));
  assert.ok(!/"declared_permission_assessment"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
}

function entity(id: string): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "organization",
    label: id,
    created_at: TS,
    updated_at: TS,
  };
}

function intervention(id: string): InterventionDeclaration {
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
  };
}

function mockProjectState(): ProjectState {
  return {
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: [entity(ENTITY_A), entity(ENTITY_B)],
    intervention_declarations: [intervention(INT_A), intervention(INT_B)],
    intervention_permission_declarations: [],
  } as unknown as ProjectState;
}

function mockRequirementSet(options?: {
  candidates?: {
    candidate_key: string;
    status?:
      | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      | "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
      | "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
    requirements?: { key: string; semantic: string }[];
  }[];
}): AttentionObservationCapabilityRequirementSetAssessment {
  const candidates = options?.candidates ?? [
    {
      candidate_key: "cand",
      status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" as const,
      requirements: [{ key: REQ_KEY, semantic: "inspect" }],
    },
  ];

  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: candidates.map((c) => {
      const status =
        c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
      const requirements = c.requirements ?? [];
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
                observation_need_key: NEED_KEY,
                requirements: requirements.map((r) => ({
                  key: r.key,
                  observation_need_key: NEED_KEY,
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

function buildBindingSet(
  bindings: {
    candidate_key: string;
    permission_actor_entity_id: string;
    permission_intervention_id: string;
  }[],
  requirementSet?: AttentionObservationCapabilityRequirementSetAssessment
): AttentionObservationPermissionContextBindingSetAssessment {
  return buildAttentionObservationPermissionContextBindingSet({
    capability_requirement_set: requirementSet ?? mockRequirementSet(),
    project_state: mockProjectState(),
    specification: { bindings },
  });
}

function defaultBindings() {
  return [
    {
      candidate_key: "cand",
      permission_actor_entity_id: ENTITY_A,
      permission_intervention_id: INT_A,
    },
  ];
}

function buildSet(
  policies: {
    permission_context_binding_key: string;
    mappings: AttentionObservationDeclaredPermissionInterpretationMapping[];
  }[],
  options?: {
    bindings?: {
      candidate_key: string;
      permission_actor_entity_id: string;
      permission_intervention_id: string;
    }[];
    bindingSet?: AttentionObservationPermissionContextBindingSetAssessment;
  }
) {
  const bindingSet =
    options?.bindingSet ??
    buildBindingSet(options?.bindings ?? defaultBindings());
  return buildAttentionObservationDeclaredPermissionInterpretationPolicySet({
    permission_context_binding_set: bindingSet,
    specification: { policies },
  });
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

function firstBindingKey(
  bindingSet: AttentionObservationPermissionContextBindingSetAssessment
): string {
  return bindingSet.candidate_assessments[0]!.permission_context_bindings[0]!
    .key;
}

function firstBindingPolicy(set: ReturnType<typeof buildSet>) {
  return firstCandidate(set).binding_policy_assessments[0]!;
}

describe("GROUND-089 Explicit Declared Permission Interpretation Policy", () => {
  describe("mappings / defaults / empty", () => {
    it("PERMIT → permitted interpretation policy PRESENT; no current state", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const set = buildSet(
        [
          {
            permission_context_binding_key: firstBindingKey(bindingSet),
            mappings: [
              {
                declared_permission_status: PERMIT_DECL,
                interpretation: AS_PERMITTED,
              },
            ],
          },
        ],
        { bindingSet }
      );
      const bindingPolicy = firstBindingPolicy(set);
      assert.equal(
        firstCandidate(set).status,
        "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT"
      );
      assert.equal(
        bindingPolicy.status,
        "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT"
      );
      assert.deepEqual(
        bindingPolicy.declared_permission_interpretation_policy!.mappings,
        [
          {
            declared_permission_status: PERMIT_DECL,
            interpretation: AS_PERMITTED,
          },
        ]
      );
      assertNoCurrentPermissionSemantics(set);
    });

    it("PROHIBIT / NO_DECLARATIONS / CONTESTED / unusual mappings all valid explicitly", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const key = firstBindingKey(bindingSet);

      for (const mappings of [
        [{ declared_permission_status: PROHIBIT_DECL, interpretation: AS_PROHIBITED }],
        [{ declared_permission_status: NO_DECL, interpretation: AS_PERMITTED }],
        [{ declared_permission_status: NO_DECL, interpretation: AS_PROHIBITED }],
        [{ declared_permission_status: CONTESTED, interpretation: AS_PERMITTED }],
        [{ declared_permission_status: CONTESTED, interpretation: AS_PROHIBITED }],
        [{ declared_permission_status: PERMIT_DECL, interpretation: AS_PROHIBITED }],
        [{ declared_permission_status: PROHIBIT_DECL, interpretation: AS_PERMITTED }],
      ] as AttentionObservationDeclaredPermissionInterpretationMapping[][]) {
        const set = buildSet(
          [{ permission_context_binding_key: key, mappings }],
          { bindingSet }
        );
        assert.equal(
          firstBindingPolicy(set).status,
          "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT"
        );
        assert.equal(
          Object.prototype.hasOwnProperty.call(
            firstBindingPolicy(set).declared_permission_interpretation_policy!,
            "permission_winner"
          ),
          false
        );
      }
    });

    it("partial policy valid; empty PRESENT; empty != absence / polarity", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const key = firstBindingKey(bindingSet);

      const partial = buildSet(
        [
          {
            permission_context_binding_key: key,
            mappings: [
              {
                declared_permission_status: PERMIT_DECL,
                interpretation: AS_PERMITTED,
              },
              {
                declared_permission_status: PROHIBIT_DECL,
                interpretation: AS_PROHIBITED,
              },
            ],
          },
        ],
        { bindingSet }
      );
      assert.equal(
        firstBindingPolicy(partial).declared_permission_interpretation_policy!
          .mappings.length,
        2
      );

      const empty = buildSet(
        [{ permission_context_binding_key: key, mappings: [] }],
        { bindingSet }
      );
      assert.equal(
        firstBindingPolicy(empty).status,
        "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT"
      );
      assert.deepEqual(
        firstBindingPolicy(empty).declared_permission_interpretation_policy!
          .mappings,
        []
      );
      assert.ok(
        firstBindingPolicy(
          empty
        ).declared_permission_interpretation_policy!.key.includes(
          "EMPTY_MAPPING_SET"
        )
      );
      assert.equal(
        empty.has_explicit_declared_permission_interpretation_policies,
        true
      );

      const absent = buildSet([], { bindingSet });
      assert.equal(
        firstBindingPolicy(absent).status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        firstBindingPolicy(absent).declared_permission_interpretation_policy,
        null
      );
      assert.notEqual(
        firstBindingPolicy(empty).status,
        firstBindingPolicy(absent).status
      );
      assert.equal(
        absent.has_explicit_declared_permission_interpretation_policies,
        false
      );
      assertNoCurrentPermissionSemantics(empty);
    });

    it("no implicit defaults for any of four raw states", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const absent = buildSet([], { bindingSet });
      assert.equal(
        firstBindingPolicy(absent).declared_permission_interpretation_policy,
        null
      );
      const empty = buildSet(
        [
          {
            permission_context_binding_key: firstBindingKey(bindingSet),
            mappings: [],
          },
        ],
        { bindingSet }
      );
      assert.deepEqual(
        firstBindingPolicy(empty).declared_permission_interpretation_policy!
          .mappings,
        []
      );
    });
  });

  describe("conflicts / identity / multiplicity", () => {
    it("duplicate mapping normalize; conflicting same-state reject; reorder same key", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const key = firstBindingKey(bindingSet);

      const a = buildSet(
        [
          {
            permission_context_binding_key: key,
            mappings: [
              {
                declared_permission_status: PERMIT_DECL,
                interpretation: AS_PERMITTED,
              },
              {
                declared_permission_status: PERMIT_DECL,
                interpretation: AS_PERMITTED,
              },
              {
                declared_permission_status: PROHIBIT_DECL,
                interpretation: AS_PROHIBITED,
              },
            ],
          },
        ],
        { bindingSet }
      );
      const b = buildSet(
        [
          {
            permission_context_binding_key: key,
            mappings: [
              {
                declared_permission_status: PROHIBIT_DECL,
                interpretation: AS_PROHIBITED,
              },
              {
                declared_permission_status: PERMIT_DECL,
                interpretation: AS_PERMITTED,
              },
            ],
          },
        ],
        { bindingSet }
      );
      assert.deepEqual(
        a.candidate_assessments[0]!.binding_policy_assessments[0]!
          .declared_permission_interpretation_policy!.mappings,
        b.candidate_assessments[0]!.binding_policy_assessments[0]!
          .declared_permission_interpretation_policy!.mappings
      );
      assert.equal(
        a.candidate_assessments[0]!.binding_policy_assessments[0]!
          .declared_permission_interpretation_policy!.key,
        b.candidate_assessments[0]!.binding_policy_assessments[0]!
          .declared_permission_interpretation_policy!.key
      );

      assert.throws(() =>
        canonicalizeDeclaredPermissionInterpretationMappings([
          {
            declared_permission_status: PERMIT_DECL,
            interpretation: AS_PERMITTED,
          },
          {
            declared_permission_status: PERMIT_DECL,
            interpretation: AS_PROHIBITED,
          },
        ])
      );
    });

    it("duplicate policy normalize; conflicting / partial merge reject", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const key = firstBindingKey(bindingSet);
      const mappings = [
        {
          declared_permission_status: PERMIT_DECL,
          interpretation: AS_PERMITTED,
        },
      ] as AttentionObservationDeclaredPermissionInterpretationMapping[];

      const dup = buildSet(
        [
          { permission_context_binding_key: key, mappings },
          { permission_context_binding_key: key, mappings },
        ],
        { bindingSet }
      );
      assert.equal(dup.specification.policies.length, 1);

      assert.throws(() =>
        buildSet(
          [
            {
              permission_context_binding_key: key,
              mappings: [
                {
                  declared_permission_status: PERMIT_DECL,
                  interpretation: AS_PERMITTED,
                },
              ],
            },
            {
              permission_context_binding_key: key,
              mappings: [
                {
                  declared_permission_status: PROHIBIT_DECL,
                  interpretation: AS_PROHIBITED,
                },
              ],
            },
          ],
          { bindingSet }
        )
      );
    });

    it("binding / mapping-set change identity; empty policy stable identity", () => {
      const bindingSet = buildBindingSet([
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
      ]);
      const keyA =
        bindingSet.candidate_assessments[0]!.permission_context_bindings[0]!
          .key;
      const keyB =
        bindingSet.candidate_assessments[0]!.permission_context_bindings[1]!
          .key;

      const permitOnly = firstBindingPolicy(
        buildSet(
          [
            {
              permission_context_binding_key: keyA,
              mappings: [
                {
                  declared_permission_status: PERMIT_DECL,
                  interpretation: AS_PERMITTED,
                },
              ],
            },
          ],
          { bindingSet }
        )
      ).declared_permission_interpretation_policy!;
      const both = firstBindingPolicy(
        buildSet(
          [
            {
              permission_context_binding_key: keyA,
              mappings: [
                {
                  declared_permission_status: PERMIT_DECL,
                  interpretation: AS_PERMITTED,
                },
                {
                  declared_permission_status: PROHIBIT_DECL,
                  interpretation: AS_PROHIBITED,
                },
              ],
            },
          ],
          { bindingSet }
        )
      ).declared_permission_interpretation_policy!;
      assert.notEqual(permitOnly.key, both.key);

      const otherBinding = buildSet(
        [
          {
            permission_context_binding_key: keyB,
            mappings: [
              {
                declared_permission_status: PERMIT_DECL,
                interpretation: AS_PERMITTED,
              },
            ],
          },
        ],
        { bindingSet }
      ).candidate_assessments[0]!.binding_policy_assessments.find(
        (a) => a.permission_context_binding_key === keyB
      )!.declared_permission_interpretation_policy!;
      assert.notEqual(permitOnly.key, otherBinding.key);

      assert.equal(
        buildCanonicalDeclaredPermissionInterpretationMappingSetKey([]),
        "EMPTY_MAPPING_SET"
      );
      const empty = firstBindingPolicy(
        buildSet(
          [{ permission_context_binding_key: keyA, mappings: [] }],
          { bindingSet }
        )
      ).declared_permission_interpretation_policy!;
      assert.equal(
        empty.key,
        attentionObservationDeclaredPermissionInterpretationPolicyKey(
          keyA,
          "EMPTY_MAPPING_SET"
        )
      );
    });

    it("multiple bindings independent; mixed presence; candidate boolean", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
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
      ]);
      const [b1, b2, b3] =
        bindingSet.candidate_assessments[0]!.permission_context_bindings;
      const set = buildSet(
        [
          {
            permission_context_binding_key: b1!.key,
            mappings: [
              {
                declared_permission_status: PERMIT_DECL,
                interpretation: AS_PERMITTED,
              },
            ],
          },
          {
            permission_context_binding_key: b3!.key,
            mappings: [],
          },
        ],
        { bindingSet }
      );
      const assessments = firstCandidate(set).binding_policy_assessments;
      assert.equal(assessments.length, 3);
      assert.equal(
        assessments[0]!.status,
        "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(
        assessments[1]!.permission_context_binding_key,
        b2!.key
      );
      assert.equal(
        assessments[1]!.status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        assessments[2]!.status,
        "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT"
      );
      assert.deepEqual(assessments[2]!.declared_permission_interpretation_policy!.mappings, []);
      assert.equal(
        firstCandidate(set).has_explicit_declared_permission_interpretation_policies,
        true
      );
      assert.equal(
        set.has_explicit_declared_permission_interpretation_policies,
        true
      );

      const none = buildSet([], { bindingSet });
      assert.equal(
        firstCandidate(none)
          .has_explicit_declared_permission_interpretation_policies,
        false
      );

      const onlyEmpty = buildSet(
        [{ permission_context_binding_key: b1!.key, mappings: [] }],
        { bindingSet }
      );
      assert.equal(
        firstCandidate(onlyEmpty)
          .has_explicit_declared_permission_interpretation_policies,
        true
      );
    });
  });

  describe("domain / determinism / static proofs", () => {
    it("no bindings / unknown binding / non-applicable", () => {
      const noBindings = buildBindingSet([]);
      const set = buildSet([], { bindingSet: noBindings });
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(firstCandidate(set).binding_policy_assessments.length, 0);

      assert.throws(() =>
        buildSet([
          {
            permission_context_binding_key: "missing-binding",
            mappings: [],
          },
        ])
      );

      const notApplicable = buildBindingSet([], mockRequirementSet({
        candidates: [
          {
            candidate_key: "cand",
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            requirements: [],
          },
        ],
      }));
      // empty bindings for not-applicable candidate from 087
      const naSet = buildAttentionObservationDeclaredPermissionInterpretationPolicySet({
        permission_context_binding_set: notApplicable,
        specification: { policies: [] },
      });
      assert.equal(
        naSet.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });

    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_B,
        },
        {
          candidate_key: "cand",
          permission_actor_entity_id: ENTITY_A,
          permission_intervention_id: INT_A,
        },
      ]);
      const key =
        bindingSet.candidate_assessments[0]!.permission_context_bindings[0]!
          .key;
      const specification = {
        policies: [
          {
            permission_context_binding_key: key,
            mappings: [
              {
                declared_permission_status: CONTESTED,
                interpretation: AS_PROHIBITED,
              },
              {
                declared_permission_status: PERMIT_DECL,
                interpretation: AS_PERMITTED,
              },
            ],
          },
        ],
      };
      const beforeBinding = structuredClone(bindingSet);
      const beforeSpec = structuredClone(specification);
      const a =
        buildAttentionObservationDeclaredPermissionInterpretationPolicySet({
          permission_context_binding_set: bindingSet,
          specification,
        });
      const b =
        buildAttentionObservationDeclaredPermissionInterpretationPolicySet({
          permission_context_binding_set: bindingSet,
          specification,
        });
      assert.deepEqual(a, b);
      assert.deepEqual(bindingSet, beforeBinding);
      assert.deepEqual(specification, beforeSpec);

      const cloned = {
        permission_context_binding_set: structuredClone(bindingSet),
        specification: structuredClone(specification),
      };
      const c =
        buildAttentionObservationDeclaredPermissionInterpretationPolicySet(
          cloned
        );
      assert.deepEqual(a, c);
      assert.notEqual(
        a.permission_context_binding_set,
        cloned.permission_context_binding_set
      );
    });

    it("canonical orders; schema 0.1.24; no 088 / ProjectState / wall-clock / OE", () => {
      assert.deepEqual(CANONICAL_DECLARED_INTERVENTION_PERMISSION_STATUS_ORDER, [
        NO_DECL,
        PERMIT_DECL,
        PROHIBIT_DECL,
        CONTESTED,
      ]);
      assert.deepEqual(CANONICAL_DECLARED_PERMISSION_INTERPRETATION_ORDER, [
        AS_PERMITTED,
        AS_PROHIBITED,
      ]);
      assert.equal(
        ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
        "DECLARED_PERMISSION_INTERPRETATION_MATCH_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_POLICY_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );

      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-declared-permission-interpretation-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-declared-permission-interpretation-policy-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);
      const typesCode = stripComments(types);

      assert.ok(
        /attention-observation-permission-context-binding-types/.test(core)
      );
      assert.ok(/permission-types/.test(core));
      assert.ok(
        !/from ["'].*declared-permission-assessment-core/.test(src)
      );
      assert.ok(
        !/from ["'].*declared-permission-assessment-types/.test(src)
      );
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
      assert.ok(!/\bProjectState\b/.test(typesCode));
      assert.ok(!/from ["'].*\.\.\/types/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));
      assert.ok(!/permission_evaluation_at/.test(src));
      assert.ok(!/current_declared_permission_status/.test(src));
      assert.ok(!/"PERMISSION_PERMITTED"/.test(src));
      assert.ok(!/"PERMISSION_PROHIBITED"/.test(src));
      assert.ok(!/\b"PERMITTED"\b/.test(src));
      assert.ok(!/\b"PROHIBITED"\b/.test(src));
      assert.ok(!/permission_winner/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
    });

    it("normalize rejects empty binding key", () => {
      assert.throws(() =>
        normalizeAttentionObservationDeclaredPermissionInterpretationPolicySpecification(
          buildBindingSet(defaultBindings()),
          {
            policies: [
              {
                permission_context_binding_key: "  ",
                mappings: [],
              },
            ],
          }
        )
      );
    });
  });
});
