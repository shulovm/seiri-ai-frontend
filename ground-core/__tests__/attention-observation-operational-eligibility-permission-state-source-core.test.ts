/**
 * GROUND-093 — Observation Core XLVII / Operational Eligibility Permission
 * State Source Bridge Foundation
 *
 * Pure GROUND-091 projection (raw Permission State preserved; 0..many sources
 * per Candidate; no polarity / acceptance / aggregation / effective Permission /
 * GROUND-084 policy / OE result).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_STATE_SOURCE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityPermissionStateSource,
  attentionObservationOperationalEligibilityPermissionStateSourceKey,
  buildAttentionObservationOperationalEligibilityPermissionStateSourceSet,
} from "../reality/attention-observation-operational-eligibility-permission-state-source-core.js";
import type {
  AttentionCandidateObservationPermissionStateAssessment,
  AttentionObservationPermissionState,
  AttentionObservationPermissionStateBasis,
  AttentionObservationPermissionStateBindingAssessment,
} from "../reality/attention-observation-permission-state-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const NEED_KEY_2 = "need-b";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const SET_KEY_2 =
  "attention-observation-capability-requirement-set|cand|need|req-b";
const BINDING_KEY =
  "attention-observation-permission-context-binding|cand|need|set|actor|int";
const BINDING_KEY_B =
  "attention-observation-permission-context-binding|cand|need|set|actorB|intB";
const AT = "2026-08-24T11:00:00.000Z";
const AT_ALT = "2026-08-24T11:30:00.000Z";
const BASIS_KEY = "091-permission-state-basis|cand|binding";
const BASIS_KEY_ALT = "091-permission-state-basis|cand|binding|alt";

const PERMITTED = "PERMISSION_PERMITTED" as const;
const PROHIBITED = "PERMISSION_PROHIBITED" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY" as const;
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"POSITIVE"/.test(json));
  assert.ok(!/"NEGATIVE"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"has_permission"\s*:/.test(json));
  assert.ok(!/"has_permitted_permission"/.test(json));
  assert.ok(!/"is_permitted"/.test(json));
  assert.ok(!/"permission_ok"/.test(json));
  assert.ok(!/"accepted_permission_states"/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
  assert.ok(!/"capability_state"\s*:/.test(json));
  assert.ok(!/"authority_state"\s*:/.test(json));
  assert.ok(!/"resource_readiness_state"\s*:/.test(json));
  assert.ok(!/"feasibility_state"\s*:/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

function mockBasis(options: {
  permission_state: AttentionObservationPermissionState;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
  binding_key?: string;
  basis_key?: string;
  at?: string;
}): AttentionObservationPermissionStateBasis {
  const candidate_key = options.candidate_key ?? CAND;
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const binding_key = options.binding_key ?? BINDING_KEY;
  const at = options.at ?? AT;
  const basis_key = options.basis_key ?? BASIS_KEY;
  return {
    key: basis_key,
    candidate_key,
    observation_need_key,
    capability_requirement_set_key: set_key,
    permission_context_binding_key: binding_key,
    current_declared_permission_assessment_key: `088|${binding_key}|${at}`,
    permission_evaluation_at: at,
    current_declared_permission_status: "PERMIT_DECLARED",
    permission_state: options.permission_state,
    declared_permission_interpretation_basis_key:
      options.permission_state === PERMITTED ||
      options.permission_state === PROHIBITED
        ? "090-basis"
        : null,
    declared_permission_interpretation_policy_key:
      options.permission_state === UNRESOLVED_POLICY ? null : "089-policy",
  };
}

function mockBinding(options: {
  permission_state: AttentionObservationPermissionState;
  binding_key?: string;
  basis_key?: string;
  at?: string;
  set_key?: string;
  observation_need_key?: string;
  forceBindingKeyMismatch?: boolean;
}): AttentionObservationPermissionStateBindingAssessment {
  const binding_key = options.binding_key ?? BINDING_KEY;
  const basis = mockBasis({
    permission_state: options.permission_state,
    binding_key: options.forceBindingKeyMismatch
      ? `${binding_key}|mismatch`
      : binding_key,
    basis_key: options.basis_key,
    at: options.at,
    set_key: options.set_key,
    observation_need_key: options.observation_need_key,
  });
  return {
    permission_context_binding_key: binding_key,
    declared_permission_interpretation_assessment: {} as never,
    permission_state_basis: basis,
  };
}

function mockPermissionCandidate(options: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
    | "PERMISSION_STATE_ASSESSMENTS_PRESENT";
  bindings?: AttentionObservationPermissionStateBindingAssessment[];
  candidate_key?: string;
}): AttentionCandidateObservationPermissionStateAssessment {
  const status = options.status ?? "PERMISSION_STATE_ASSESSMENTS_PRESENT";
  const present = status === "PERMISSION_STATE_ASSESSMENTS_PRESENT";
  const bindings = present
    ? (options.bindings ?? [mockBinding({ permission_state: PERMITTED })])
    : [];
  return {
    candidate_key: options.candidate_key ?? CAND,
    declared_permission_interpretation_assessment: {} as never,
    status,
    permission_state_binding_assessments: bindings,
    has_permission_states: bindings.length > 0,
    model_limitations: [],
  };
}

function buildSet(
  candidates: AttentionCandidateObservationPermissionStateAssessment[] = [
    mockPermissionCandidate({}),
  ]
) {
  return buildAttentionObservationOperationalEligibilityPermissionStateSourceSet(
    {
      permission_state_set: {
        declared_permission_interpretation_set: {} as never,
        candidate_assessments: candidates,
        has_permission_states: candidates.some((c) => c.has_permission_states),
        model_limitations: [],
      },
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-093 Operational Eligibility Permission State Source Bridge", () => {
  describe("raw Permission State source preservation", () => {
    it("PERMISSION_PERMITTED → source PRESENT with exact raw state", () => {
      const set = buildSet([
        mockPermissionCandidate({
          bindings: [mockBinding({ permission_state: PERMITTED })],
        }),
      ]);
      const candidate = set.candidate_assessments[0]!;
      assert.equal(
        candidate.status,
        "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT"
      );
      assert.equal(candidate.permission_state_sources.length, 1);
      const source = candidate.permission_state_sources[0]!;
      assert.equal(source.dimension, "PERMISSION");
      assert.equal(source.permission_state, PERMITTED);
      assert.equal(source.permission_state_basis_key, BASIS_KEY);
      assert.equal(source.permission_evaluation_at, AT);
      assert.equal(source.permission_context_binding_key, BINDING_KEY);
      assertNoForbiddenSemantics(set);
    });

    it("PERMISSION_PROHIBITED → source PRESENT (not missing)", () => {
      const source = buildSet([
        mockPermissionCandidate({
          bindings: [mockBinding({ permission_state: PROHIBITED })],
        }),
      ]).candidate_assessments[0]!.permission_state_sources[0]!;
      assert.equal(source.permission_state, PROHIBITED);
      assert.equal(source.dimension, "PERMISSION");
    });

    it("both UNRESOLVED states → source PRESENT", () => {
      for (const permission_state of [
        UNRESOLVED_POLICY,
        UNRESOLVED_MAPPING,
      ] as const) {
        const source = buildSet([
          mockPermissionCandidate({
            bindings: [mockBinding({ permission_state })],
          }),
        ]).candidate_assessments[0]!.permission_state_sources[0]!;
        assert.equal(source.permission_state, permission_state);
      }
    });

    it("all four Permission State values represented without coercion", () => {
      const set = buildSet([
        mockPermissionCandidate({
          bindings: [
            mockBinding({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockBinding({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
            mockBinding({
              permission_state: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|3`,
              basis_key: `${BASIS_KEY}|3`,
            }),
            mockBinding({
              permission_state: UNRESOLVED_MAPPING,
              binding_key: `${BINDING_KEY}|4`,
              basis_key: `${BASIS_KEY}|4`,
            }),
          ],
        }),
      ]);
      const states = set.candidate_assessments[0]!.permission_state_sources.map(
        (s) => s.permission_state
      );
      assert.deepEqual(states, [
        PERMITTED,
        PROHIBITED,
        UNRESOLVED_POLICY,
        UNRESOLVED_MAPPING,
      ]);
      assert.equal(
        set.candidate_assessments[0]!
          .has_permission_state_operational_eligibility_sources,
        true
      );
    });

    it("source PRESENT != PERMISSION_PERMITTED polarity", () => {
      const prohibited = buildSet([
        mockPermissionCandidate({
          bindings: [mockBinding({ permission_state: PROHIBITED })],
        }),
      ]).candidate_assessments[0]!;
      assert.equal(
        prohibited.status,
        "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT"
      );
      assert.notEqual(
        prohibited.permission_state_sources[0]!.permission_state,
        PERMITTED
      );
    });
  });

  describe("lineage / identity", () => {
    it("retains 091 basis / binding / evaluation instant / context keys", () => {
      const source = buildSet().candidate_assessments[0]!
        .permission_state_sources[0]!;
      assert.equal(
        source.key,
        attentionObservationOperationalEligibilityPermissionStateSourceKey(
          CAND,
          NEED_KEY,
          SET_KEY,
          BINDING_KEY,
          BASIS_KEY,
          AT,
          PERMITTED
        )
      );
      assert.equal(source.candidate_key, CAND);
      assert.equal(source.observation_need_key, NEED_KEY);
      assert.equal(source.capability_requirement_set_key, SET_KEY);
    });

    it("basis / at / binding / state / set / need change identity", () => {
      const base = buildSet([
        mockPermissionCandidate({
          bindings: [mockBinding({ permission_state: PERMITTED })],
        }),
      ]).candidate_assessments[0]!.permission_state_sources[0]!.key;

      assert.notEqual(
        base,
        buildSet([
          mockPermissionCandidate({
            bindings: [
              mockBinding({
                permission_state: PERMITTED,
                basis_key: BASIS_KEY_ALT,
              }),
            ],
          }),
        ]).candidate_assessments[0]!.permission_state_sources[0]!.key
      );
      assert.notEqual(
        base,
        buildSet([
          mockPermissionCandidate({
            bindings: [
              mockBinding({
                permission_state: PERMITTED,
                at: AT_ALT,
                basis_key: BASIS_KEY_ALT,
              }),
            ],
          }),
        ]).candidate_assessments[0]!.permission_state_sources[0]!.key
      );
      assert.notEqual(
        base,
        buildSet([
          mockPermissionCandidate({
            bindings: [
              mockBinding({
                permission_state: PERMITTED,
                binding_key: BINDING_KEY_B,
                basis_key: BASIS_KEY_ALT,
              }),
            ],
          }),
        ]).candidate_assessments[0]!.permission_state_sources[0]!.key
      );
      assert.notEqual(
        base,
        buildSet([
          mockPermissionCandidate({
            bindings: [mockBinding({ permission_state: PROHIBITED })],
          }),
        ]).candidate_assessments[0]!.permission_state_sources[0]!.key
      );
      assert.notEqual(
        base,
        buildSet([
          mockPermissionCandidate({
            bindings: [
              mockBinding({
                permission_state: PERMITTED,
                set_key: SET_KEY_2,
                basis_key: BASIS_KEY_ALT,
              }),
            ],
          }),
        ]).candidate_assessments[0]!.permission_state_sources[0]!.key
      );
      assert.notEqual(
        base,
        buildSet([
          mockPermissionCandidate({
            bindings: [
              mockBinding({
                permission_state: PERMITTED,
                observation_need_key: NEED_KEY_2,
                basis_key: BASIS_KEY_ALT,
              }),
            ],
          }),
        ]).candidate_assessments[0]!.permission_state_sources[0]!.key
      );
    });
  });

  describe("outer statuses / cardinality / multiple sources", () => {
    it("outer statuses produce no sources", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const set = buildSet([mockPermissionCandidate({ status })]);
        assert.equal(set.candidate_assessments[0]!.status, status);
        assert.deepEqual(
          set.candidate_assessments[0]!.permission_state_sources,
          []
        );
        assert.equal(
          set.candidate_assessments[0]!
            .has_permission_state_operational_eligibility_sources,
          false
        );
      }
    });

    it("one source per 091 State; mixed states independent; no ANY/ALL/veto/CONTESTED", () => {
      const set = buildSet([
        mockPermissionCandidate({
          bindings: [
            mockBinding({
              permission_state: PERMITTED,
              binding_key: BINDING_KEY,
              basis_key: `${BASIS_KEY}|a`,
            }),
            mockBinding({
              permission_state: PROHIBITED,
              binding_key: BINDING_KEY_B,
              basis_key: `${BASIS_KEY}|b`,
            }),
            mockBinding({
              permission_state: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|c`,
              basis_key: `${BASIS_KEY}|c`,
            }),
          ],
        }),
      ]);
      const sources = set.candidate_assessments[0]!.permission_state_sources;
      assert.equal(sources.length, 3);
      assert.deepEqual(
        sources.map((s) => s.permission_state),
        [PERMITTED, PROHIBITED, UNRESOLVED_POLICY]
      );
      assert.equal(set.has_permission_state_operational_eligibility_sources, true);
      assert.ok(
        !/"CONTESTED_PERMISSION"/.test(
          JSON.stringify({
            status: set.candidate_assessments[0]!.status,
            states: sources.map((s) => s.permission_state),
          })
        )
      );
      assertNoForbiddenSemantics(set);
    });

    it("all prohibited / all unresolved → boolean true", () => {
      assert.equal(
        buildSet([
          mockPermissionCandidate({
            bindings: [mockBinding({ permission_state: PROHIBITED })],
          }),
        ]).has_permission_state_operational_eligibility_sources,
        true
      );
      assert.equal(
        buildSet([
          mockPermissionCandidate({
            bindings: [mockBinding({ permission_state: UNRESOLVED_POLICY })],
          }),
        ]).has_permission_state_operational_eligibility_sources,
        true
      );
    });

    it("binding-State context contradiction rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityPermissionStateSource(
          mockPermissionCandidate({
            bindings: [
              mockBinding({
                permission_state: PERMITTED,
                forceBindingKeyMismatch: true,
              }),
            ],
          })
        )
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        permission_state_set: {
          declared_permission_interpretation_set: {} as never,
          candidate_assessments: [mockPermissionCandidate({})],
          has_permission_states: true,
          model_limitations: [],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionStateSourceSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionStateSourceSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionStateSourceSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 084/085/024–090 cores; no acceptance/aggregation/OE result", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_STATE_SOURCE_MODEL_LIMITATIONS.slice(
          0,
          4
        ),
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_MATCH_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_REQUIRED_DIMENSION_COVERAGE_NOT_MODELED",
        ]
      );
      assert.ok(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_STATE_SOURCE_MODEL_LIMITATIONS.includes(
          "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN"
        )
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-state-source-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-state-source-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(/attention-observation-permission-state-types/.test(core));
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*operational-eligibility-capability-state-source/.test(src)
      );
      assert.ok(!/from ["'].*permission-core/.test(src));
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
        !/from ["'].*declared-permission-interpretation-core/.test(src)
      );
      assert.ok(!/required_dimensions/.test(src));
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/from ["'].*\.\.\/types/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
      assert.ok(!/assessDeclaredInterventionPermission/.test(coreCode));
      assert.ok(!/ANY_SOURCE|ALL_SOURCES|"ANY"|"ALL"/.test(src));
    });
  });
});
