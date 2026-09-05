/**
 * GROUND-091 — Observation Core XLV / Permission State Foundation
 *
 * Pure GROUND-090 normalization (PERMISSION_PERMITTED / PERMISSION_PROHIBITED /
 * policy-absence unresolved / no-mapping unresolved; no effective Permission /
 * no raw-token inference / no OE / no multiple-binding composition).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_PERMISSION_STATE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationPermissionState,
  assessAttentionObservationPermissionStateBinding,
  attentionObservationPermissionStateKey,
  buildAttentionObservationPermissionStateSet,
  mapDeclaredPermissionInterpretationBindingToPermissionState,
} from "../reality/attention-observation-permission-state-core.js";
import type {
  AttentionCandidateObservationDeclaredPermissionInterpretationAssessment,
  AttentionObservationDeclaredPermissionInterpretationBindingAssessment,
  AttentionObservationDeclaredPermissionInterpretationBindingStatus,
} from "../reality/attention-observation-declared-permission-interpretation-types.js";
import type { DeclaredInterventionPermissionStatus } from "../reality/permission-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const BINDING_KEY =
  "attention-observation-permission-context-binding|cand|need|set|actor|int";
const BINDING_KEY_B =
  "attention-observation-permission-context-binding|cand|need|set|actorB|intB";
const ACTOR = "actor-a";
const ACTOR_B = "actor-b";
const INT = "intervention-a";
const INT_B = "intervention-b";
const AT = "2026-08-24T11:00:00.000Z";
const AT_ALT = "2026-08-24T11:30:00.000Z";
const ASSESSMENT_KEY = "088-assessment|cand|binding|at";
const ASSESSMENT_KEY_ALT = "088-assessment|cand|binding|at-alt";
const INTERP_BASIS_KEY = "090-interp-basis|cand|binding";
const INTERP_BASIS_KEY_ALT = "090-interp-basis|cand|binding|alt";
const POLICY_KEY = "089-policy|binding|mappings";
const POLICY_KEY_ALT = "089-policy|binding|mappings-alt";

const NO_DECL = "NO_PERMISSION_DECLARATIONS" as const;
const PERMIT_DECL = "PERMIT_DECLARED" as const;
const PROHIBIT_DECL = "PROHIBIT_DECLARED" as const;
const CONTESTED = "CONTESTED_PERMISSION" as const;
const AS_PERMITTED = "INTERPRET_AS_PERMISSION_PERMITTED" as const;
const AS_PROHIBITED = "INTERPRET_AS_PERMISSION_PROHIBITED" as const;

function assertNoEffectivePermissionSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/\b"PERMITTED"\b/.test(json));
  assert.ok(!/\b"PROHIBITED"\b/.test(json));
  assert.ok(!/"DENIED"/.test(json));
  assert.ok(!/"ALLOWED"/.test(json));
  assert.ok(!/"NOT_ALLOWED"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"is_permitted"/.test(json));
  assert.ok(!/"has_permission"\s*:/.test(json));
  assert.ok(!/"has_permitted_permission"/.test(json));
  assert.ok(!/"may_execute"/.test(json));
  assert.ok(!/"permission_winner"/.test(json));
  assert.ok(!/"winning_declaration_id"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
}

function mockBindingInterpretation(options: {
  status: AttentionObservationDeclaredPermissionInterpretationBindingStatus;
  interpretation?:
    | "INTERPRET_AS_PERMISSION_PERMITTED"
    | "INTERPRET_AS_PERMISSION_PROHIBITED";
  raw_status?: DeclaredInterventionPermissionStatus;
  binding_key?: string;
  assessment_key?: string;
  at?: string;
  actor?: string;
  intervention?: string;
  interp_basis_key?: string;
  policy_key?: string;
  forcePolicyPresent?: boolean;
  forcePolicyNull?: boolean;
  forceInterpBasis?: AttentionObservationDeclaredPermissionInterpretationBindingAssessment["interpretation_basis"];
}): AttentionObservationDeclaredPermissionInterpretationBindingAssessment {
  const binding_key = options.binding_key ?? BINDING_KEY;
  const assessment_key = options.assessment_key ?? ASSESSMENT_KEY;
  const at = options.at ?? AT;
  const actor = options.actor ?? ACTOR;
  const intervention = options.intervention ?? INT;
  const raw_status = options.raw_status ?? PERMIT_DECL;
  const basisPresent =
    options.status === "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT";
  const noMapping =
    options.status ===
    "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS";
  const noPolicy =
    options.status ===
    "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED";

  const policyPresent =
    options.forcePolicyNull === true
      ? false
      : (options.forcePolicyPresent ?? (basisPresent || noMapping));

  const interpretationBasis =
    options.forceInterpBasis !== undefined
      ? options.forceInterpBasis
      : basisPresent
        ? {
            key: options.interp_basis_key ?? INTERP_BASIS_KEY,
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            permission_context_binding_key: binding_key,
            current_declared_permission_assessment_key: assessment_key,
            permission_evaluation_at: at,
            current_declared_permission_status: raw_status,
            declared_permission_interpretation_policy_key:
              options.policy_key ?? POLICY_KEY,
            matched_mapping: {
              declared_permission_status: raw_status,
              interpretation: options.interpretation!,
            },
            interpretation: options.interpretation!,
          }
        : null;

  return {
    permission_context_binding_key: binding_key,
    declared_permission_binding_assessment: {
      key: assessment_key,
      candidate_key: CAND,
      observation_need_key: NEED_KEY,
      capability_requirement_set_key: SET_KEY,
      permission_context_binding_key: binding_key,
      permission_actor_entity_id: actor,
      permission_intervention_id: intervention,
      permission_evaluation_at: at,
      declared_permission_status: raw_status,
      applicable_permission_declaration_ids:
        raw_status === NO_DECL ? [] : ["decl-1"],
      declared_permission_assessment: {
        actor_entity_id: actor,
        intervention_id: intervention,
        at,
        status: raw_status,
        permission_declaration_ids:
          raw_status === NO_DECL ? [] : ["decl-1"],
        permit_declaration_ids: [],
        prohibit_declaration_ids: [],
        declarers: [],
        has_permit_declaration: false,
        has_prohibit_declaration: false,
        has_permission_conflict: raw_status === CONTESTED,
        has_temporal_basis_mismatch: false,
        intervention_active: true,
      },
    },
    declared_permission_interpretation_policy_assessment: {
      permission_context_binding_key: binding_key,
      candidate_key: CAND,
      observation_need_key: NEED_KEY,
      capability_requirement_set_key: SET_KEY,
      permission_actor_entity_id: actor,
      permission_intervention_id: intervention,
      status: policyPresent
        ? "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT"
        : "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
      declared_permission_interpretation_policy: policyPresent
        ? {
            key: options.policy_key ?? POLICY_KEY,
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            permission_context_binding_key: binding_key,
            permission_actor_entity_id: actor,
            permission_intervention_id: intervention,
            mappings: [],
          }
        : null,
    },
    status: options.status,
    interpretation_basis: interpretationBasis,
    has_declared_permission_interpretation_basis: basisPresent,
  };
}

function mockInterpretationCandidate(options: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
    | "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT";
  bindings?: AttentionObservationDeclaredPermissionInterpretationBindingAssessment[];
}): AttentionCandidateObservationDeclaredPermissionInterpretationAssessment {
  const status =
    options.status ?? "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT";
  const present =
    status === "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT";
  const bindings = present
    ? (options.bindings ?? [
        mockBindingInterpretation({
          status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
          interpretation: AS_PERMITTED,
        }),
      ])
    : [];

  return {
    candidate_key: CAND,
    declared_permission_assessment: {} as never,
    declared_permission_interpretation_policy_assessment: {} as never,
    status,
    binding_interpretation_assessments: bindings,
    has_declared_permission_interpretation_bases: bindings.some(
      (b) => b.has_declared_permission_interpretation_basis
    ),
    model_limitations: [],
  };
}

function buildSet(
  candidate = mockInterpretationCandidate({})
) {
  return buildAttentionObservationPermissionStateSet({
    declared_permission_interpretation_set: {
      declared_permission_assessment_set: {} as never,
      declared_permission_interpretation_policy_set: {} as never,
      candidate_assessments: [candidate],
      has_declared_permission_interpretation_bases:
        candidate.has_declared_permission_interpretation_bases,
      model_limitations: [],
    },
  });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-091 Permission State Foundation", () => {
  describe("090 → 091 mapping", () => {
    it("permitted interpretation → PERMISSION_PERMITTED", () => {
      const binding = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
          interpretation: AS_PERMITTED,
        })
      );
      assert.equal(
        binding.permission_state_basis.permission_state,
        "PERMISSION_PERMITTED"
      );
      assert.equal(
        binding.permission_state_basis
          .declared_permission_interpretation_basis_key,
        INTERP_BASIS_KEY
      );
      assert.equal(
        binding.permission_state_basis
          .declared_permission_interpretation_policy_key,
        POLICY_KEY
      );
      assertNoEffectivePermissionSemantics(binding);
    });

    it("prohibited interpretation → PERMISSION_PROHIBITED", () => {
      const binding = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
          interpretation: AS_PROHIBITED,
        })
      );
      assert.equal(
        binding.permission_state_basis.permission_state,
        "PERMISSION_PROHIBITED"
      );
    });

    it("policy absent → UNRESOLVED_NO_POLICY (not prohibited)", () => {
      const binding = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status:
            "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
        })
      );
      assert.equal(
        binding.permission_state_basis.permission_state,
        "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY"
      );
      assert.equal(
        binding.permission_state_basis
          .declared_permission_interpretation_basis_key,
        null
      );
      assert.equal(
        binding.permission_state_basis
          .declared_permission_interpretation_policy_key,
        null
      );
      assert.notEqual(
        binding.permission_state_basis.permission_state,
        "PERMISSION_PROHIBITED"
      );
    });

    it("no mapping → UNRESOLVED_NO_MAPPING (not prohibited); policy key retained", () => {
      const binding = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status:
            "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
        })
      );
      assert.equal(
        binding.permission_state_basis.permission_state,
        "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
      );
      assert.equal(
        binding.permission_state_basis
          .declared_permission_interpretation_basis_key,
        null
      );
      assert.equal(
        binding.permission_state_basis
          .declared_permission_interpretation_policy_key,
        POLICY_KEY
      );
    });

    it("explicit empty policy (090 NO_MAPPING) → no-mapping unresolved", () => {
      const state = mapDeclaredPermissionInterpretationBindingToPermissionState(
        mockBindingInterpretation({
          status:
            "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
          policy_key: `${POLICY_KEY}|EMPTY_MAPPING_SET`,
        })
      );
      assert.equal(
        state,
        "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
      );
    });

    it("policy absence != no mapping", () => {
      assert.notEqual(
        mapDeclaredPermissionInterpretationBindingToPermissionState(
          mockBindingInterpretation({
            status:
              "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
          })
        ),
        mapDeclaredPermissionInterpretationBindingToPermissionState(
          mockBindingInterpretation({
            status:
              "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
          })
        )
      );
    });
  });

  describe("unusual / NO_DECLARATIONS / CONTESTED through 090 Basis only", () => {
    it("unusual PERMIT_DECLARED → prohibited interpretation → PERMISSION_PROHIBITED", () => {
      const binding = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
          interpretation: AS_PROHIBITED,
          raw_status: PERMIT_DECL,
        })
      );
      assert.equal(
        binding.permission_state_basis.permission_state,
        "PERMISSION_PROHIBITED"
      );
    });

    it("unusual PROHIBIT_DECLARED → permitted interpretation → PERMISSION_PERMITTED", () => {
      const binding = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
          interpretation: AS_PERMITTED,
          raw_status: PROHIBIT_DECL,
        })
      );
      assert.equal(
        binding.permission_state_basis.permission_state,
        "PERMISSION_PERMITTED"
      );
    });

    it("NO_DECLARATIONS explicit permitted / prohibited", () => {
      assert.equal(
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PERMITTED,
            raw_status: NO_DECL,
          })
        ).permission_state_basis.permission_state,
        "PERMISSION_PERMITTED"
      );
      assert.equal(
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PROHIBITED,
            raw_status: NO_DECL,
          })
        ).permission_state_basis.permission_state,
        "PERMISSION_PROHIBITED"
      );
    });

    it("CONTESTED explicit permitted / prohibited; no winner", () => {
      const prohibited = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
          interpretation: AS_PROHIBITED,
          raw_status: CONTESTED,
        })
      );
      assert.equal(
        prohibited.permission_state_basis.permission_state,
        "PERMISSION_PROHIBITED"
      );
      assert.equal(
        prohibited.permission_state_basis.current_declared_permission_status,
        CONTESTED
      );
      assert.ok(
        !/"permission_winner"|"winning_declaration_id"/.test(
          JSON.stringify(prohibited)
        )
      );
      assert.equal(
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PERMITTED,
            raw_status: CONTESTED,
          })
        ).permission_state_basis.permission_state,
        "PERMISSION_PERMITTED"
      );
    });
  });

  describe("lineage / identity", () => {
    it("retains 088 assessment key, evaluation instant, binding key", () => {
      const basis = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
          interpretation: AS_PERMITTED,
        })
      ).permission_state_basis;
      assert.equal(
        basis.current_declared_permission_assessment_key,
        ASSESSMENT_KEY
      );
      assert.equal(basis.permission_evaluation_at, AT);
      assert.equal(basis.permission_context_binding_key, BINDING_KEY);
      assert.equal(
        basis.key,
        attentionObservationPermissionStateKey(
          CAND,
          NEED_KEY,
          SET_KEY,
          BINDING_KEY,
          ASSESSMENT_KEY,
          AT,
          "PERMISSION_PERMITTED",
          INTERP_BASIS_KEY,
          POLICY_KEY
        )
      );
    });

    it("raw assessment / instant / policy / interpretation / state / binding change identity", () => {
      const base = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
          interpretation: AS_PERMITTED,
        })
      ).permission_state_basis.key;

      assert.notEqual(
        base,
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PERMITTED,
            assessment_key: ASSESSMENT_KEY_ALT,
          })
        ).permission_state_basis.key
      );
      assert.notEqual(
        base,
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PERMITTED,
            at: AT_ALT,
            assessment_key: ASSESSMENT_KEY_ALT,
          })
        ).permission_state_basis.key
      );
      assert.notEqual(
        base,
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PERMITTED,
            policy_key: POLICY_KEY_ALT,
          })
        ).permission_state_basis.key
      );
      assert.notEqual(
        base,
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PERMITTED,
            interp_basis_key: INTERP_BASIS_KEY_ALT,
          })
        ).permission_state_basis.key
      );
      assert.notEqual(
        base,
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PROHIBITED,
          })
        ).permission_state_basis.key
      );
      assert.notEqual(
        base,
        assessAttentionObservationPermissionStateBinding(
          mockBindingInterpretation({
            status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
            interpretation: AS_PERMITTED,
            binding_key: BINDING_KEY_B,
            actor: ACTOR_B,
            intervention: INT_B,
          })
        ).permission_state_basis.key
      );
    });

    it("UNRESOLVED states still create State records with assessment lineage", () => {
      const absent = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status:
            "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
        })
      );
      assert.ok(absent.permission_state_basis);
      assert.equal(
        absent.permission_state_basis.current_declared_permission_assessment_key,
        ASSESSMENT_KEY
      );
      const unmapped = assessAttentionObservationPermissionStateBinding(
        mockBindingInterpretation({
          status:
            "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
        })
      );
      assert.ok(unmapped.permission_state_basis);
      assert.equal(
        unmapped.permission_state_basis
          .declared_permission_interpretation_policy_key,
        POLICY_KEY
      );
    });
  });

  describe("candidate outer statuses / cardinality / mixed bindings", () => {
    it("outer statuses produce no Permission State", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const set = buildSet(mockInterpretationCandidate({ status }));
        assert.equal(set.candidate_assessments[0]!.status, status);
        assert.deepEqual(
          set.candidate_assessments[0]!.permission_state_binding_assessments,
          []
        );
        assert.equal(set.candidate_assessments[0]!.has_permission_states, false);
      }
    });

    it("one state per current binding; mixed states independent; no ANY/ALL/veto/CONTESTED", () => {
      const set = buildSet(
        mockInterpretationCandidate({
          bindings: [
            mockBindingInterpretation({
              status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
              interpretation: AS_PERMITTED,
              binding_key: BINDING_KEY,
              assessment_key: `${ASSESSMENT_KEY}|a`,
            }),
            mockBindingInterpretation({
              status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
              interpretation: AS_PROHIBITED,
              binding_key: BINDING_KEY_B,
              actor: ACTOR_B,
              intervention: INT_B,
              assessment_key: `${ASSESSMENT_KEY}|b`,
            }),
            mockBindingInterpretation({
              status:
                "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
              binding_key: `${BINDING_KEY}|c`,
              actor: "actor-c",
              intervention: "int-c",
              assessment_key: `${ASSESSMENT_KEY}|c`,
            }),
            mockBindingInterpretation({
              status:
                "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
              binding_key: `${BINDING_KEY}|d`,
              actor: "actor-d",
              intervention: "int-d",
              assessment_key: `${ASSESSMENT_KEY}|d`,
            }),
          ],
        })
      );
      const states =
        set.candidate_assessments[0]!.permission_state_binding_assessments;
      assert.equal(states.length, 4);
      assert.equal(
        states[0]!.permission_state_basis.permission_state,
        "PERMISSION_PERMITTED"
      );
      assert.equal(
        states[1]!.permission_state_basis.permission_state,
        "PERMISSION_PROHIBITED"
      );
      assert.equal(
        states[2]!.permission_state_basis.permission_state,
        "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY"
      );
      assert.equal(
        states[3]!.permission_state_basis.permission_state,
        "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
      );
      assert.equal(set.has_permission_states, true);
      assert.equal(
        set.candidate_assessments[0]!.status,
        "PERMISSION_STATE_ASSESSMENTS_PRESENT"
      );
      assert.ok(
        !/"CONTESTED_PERMISSION"/.test(
          JSON.stringify({
            status: set.candidate_assessments[0]!.status,
            states: states.map((s) => s.permission_state_basis.permission_state),
          })
        )
      );
      assertNoEffectivePermissionSemantics(set);
    });

    it("all prohibited / all unresolved → has_permission_states true", () => {
      assert.equal(
        buildSet(
          mockInterpretationCandidate({
            bindings: [
              mockBindingInterpretation({
                status: "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
                interpretation: AS_PROHIBITED,
              }),
            ],
          })
        ).has_permission_states,
        true
      );
      assert.equal(
        buildSet(
          mockInterpretationCandidate({
            bindings: [
              mockBindingInterpretation({
                status:
                  "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
              }),
            ],
          })
        ).has_permission_states,
        true
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        declared_permission_interpretation_set: {
          declared_permission_assessment_set: {} as never,
          declared_permission_interpretation_policy_set: {} as never,
          candidate_assessments: [mockInterpretationCandidate({})],
          has_declared_permission_interpretation_bases: true,
          model_limitations: [],
        },
      };
      const before = deepClone(input);
      const a = buildAttentionObservationPermissionStateSet(input);
      const b = buildAttentionObservationPermissionStateSet(input);
      const c = buildAttentionObservationPermissionStateSet(deepClone(input));
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 024/087/088/089 cores; no raw inference; no OE/wall-clock", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_PERMISSION_STATE_MODEL_LIMITATIONS.slice(0, 4),
        [
          "PERMISSION_EFFECTIVE_STATE_NOT_MODELED",
          "PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED",
          "PERMISSION_DECLARATION_LEVEL_CONFLICT_RESOLUTION_NOT_MODELED",
          "PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-permission-state-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-permission-state-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(
        /attention-observation-declared-permission-interpretation-types/.test(
          core
        )
      );
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(!/assessDeclaredInterventionPermission/.test(coreCode));
      assert.ok(
        !/from ["'].*permission-context-binding-core/.test(src)
      );
      assert.ok(
        !/from ["'].*declared-permission-assessment-core/.test(src)
      );
      assert.ok(
        !/from ["'].*declared-permission-interpretation-policy-core/.test(src)
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
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/from ["'].*\.\.\/types/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));

      // No raw-token inference switch for Permission State derivation.
      assert.ok(
        !/case\s+"PERMIT_DECLARED"|case\s+"PROHIBIT_DECLARED"|case\s+"NO_PERMISSION_DECLARATIONS"|case\s+"CONTESTED_PERMISSION"/.test(
          coreCode
        )
      );
      assert.ok(!/findExactDeclaredPermissionInterpretationMapping/.test(src));
      assert.ok(!/"winning_declaration_id"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
    });

    it("candidate assessor exported", () => {
      assert.doesNotThrow(() =>
        assessAttentionCandidateObservationPermissionState(
          mockInterpretationCandidate({})
        )
      );
    });
  });
});
