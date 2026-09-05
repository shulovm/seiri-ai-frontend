/**
 * GROUND-090 — Observation Core XLIV / Declared Permission Interpretation
 * Basis Foundation
 *
 * Pure 088 current raw Declared Permission Assessment + 089 Explicit
 * Interpretation Policy (exact raw-status mapping lookup only; no Permission
 * State / defaults / winner / OE / multiple-binding composition).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_MODEL_LIMITATIONS,
  assertCompatibleDeclaredPermissionInterpretationContexts,
  assessAttentionCandidateObservationDeclaredPermissionInterpretation,
  assessAttentionObservationDeclaredPermissionInterpretationBinding,
  attentionObservationDeclaredPermissionInterpretationBasisKey,
  buildAttentionObservationDeclaredPermissionInterpretationSet,
  findExactDeclaredPermissionInterpretationMapping,
} from "../reality/attention-observation-declared-permission-interpretation-core.js";
import type {
  AttentionObservationDeclaredPermissionBindingAssessment,
} from "../reality/attention-observation-declared-permission-assessment-types.js";
import type {
  AttentionObservationDeclaredPermissionInterpretationMapping,
  AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment,
} from "../reality/attention-observation-declared-permission-interpretation-policy-types.js";
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
const POLICY_KEY = "089-policy|binding|mappings";
const POLICY_KEY_ALT = "089-policy|binding|mappings-alt";

const NO_DECL = "NO_PERMISSION_DECLARATIONS" as const;
const PERMIT_DECL = "PERMIT_DECLARED" as const;
const PROHIBIT_DECL = "PROHIBIT_DECLARED" as const;
const CONTESTED = "CONTESTED_PERMISSION" as const;
const AS_PERMITTED = "INTERPRET_AS_PERMISSION_PERMITTED" as const;
const AS_PROHIBITED = "INTERPRET_AS_PERMISSION_PROHIBITED" as const;

function assertNoPermissionState(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PERMISSION_PERMITTED"/.test(json));
  assert.ok(!/"PERMISSION_PROHIBITED"/.test(json));
  assert.ok(!/\b"PERMITTED"\b/.test(json));
  assert.ok(!/\b"PROHIBITED"\b/.test(json));
  assert.ok(!/"DENIED"/.test(json));
  assert.ok(!/"ALLOWED"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"is_permitted"/.test(json));
  assert.ok(!/"permission_winner"/.test(json));
  assert.ok(!/"has_permitted_permission"/.test(json));
  assert.ok(!/"may_execute"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
}

function mapping(
  declared_permission_status: DeclaredInterventionPermissionStatus,
  interpretation:
    | "INTERPRET_AS_PERMISSION_PERMITTED"
    | "INTERPRET_AS_PERMISSION_PROHIBITED"
): AttentionObservationDeclaredPermissionInterpretationMapping {
  return { declared_permission_status, interpretation };
}

function mockPermissionBinding(options?: {
  key?: string;
  binding_key?: string;
  status?: DeclaredInterventionPermissionStatus;
  at?: string;
  actor?: string;
  intervention?: string;
  declaration_ids?: string[];
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationDeclaredPermissionBindingAssessment {
  const status = options?.status ?? PERMIT_DECL;
  const declaration_ids = options?.declaration_ids ?? ["decl-1"];
  return {
    key: options?.key ?? ASSESSMENT_KEY,
    candidate_key: options?.candidate_key ?? CAND,
    observation_need_key: options?.observation_need_key ?? NEED_KEY,
    capability_requirement_set_key: options?.set_key ?? SET_KEY,
    permission_context_binding_key: options?.binding_key ?? BINDING_KEY,
    permission_actor_entity_id: options?.actor ?? ACTOR,
    permission_intervention_id: options?.intervention ?? INT,
    permission_evaluation_at: options?.at ?? AT,
    declared_permission_status: status,
    applicable_permission_declaration_ids: declaration_ids,
    declared_permission_assessment: {
      actor_entity_id: options?.actor ?? ACTOR,
      intervention_id: options?.intervention ?? INT,
      at: options?.at ?? AT,
      status,
      permission_declaration_ids: declaration_ids,
      permit_declaration_ids: status === PERMIT_DECL ? declaration_ids : [],
      prohibit_declaration_ids:
        status === PROHIBIT_DECL ? declaration_ids : [],
      declarers: [],
      has_permit_declaration: status === PERMIT_DECL || status === CONTESTED,
      has_prohibit_declaration:
        status === PROHIBIT_DECL || status === CONTESTED,
      has_permission_conflict: status === CONTESTED,
      has_temporal_basis_mismatch: false,
      intervention_active: true,
    },
  };
}

function mockPolicyBinding(options?: {
  binding_key?: string;
  status?:
    | "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
    | "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT";
  mappings?: AttentionObservationDeclaredPermissionInterpretationMapping[];
  policy_key?: string;
  actor?: string;
  intervention?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment {
  const status =
    options?.status ??
    "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT";
  const mappings = options?.mappings ?? [mapping(PERMIT_DECL, AS_PERMITTED)];
  const binding_key = options?.binding_key ?? BINDING_KEY;
  const present =
    status === "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT";

  return {
    permission_context_binding_key: binding_key,
    candidate_key: options?.candidate_key ?? CAND,
    observation_need_key: options?.observation_need_key ?? NEED_KEY,
    capability_requirement_set_key: options?.set_key ?? SET_KEY,
    permission_actor_entity_id: options?.actor ?? ACTOR,
    permission_intervention_id: options?.intervention ?? INT,
    status,
    declared_permission_interpretation_policy: present
      ? {
          key: options?.policy_key ?? POLICY_KEY,
          candidate_key: options?.candidate_key ?? CAND,
          observation_need_key: options?.observation_need_key ?? NEED_KEY,
          capability_requirement_set_key: options?.set_key ?? SET_KEY,
          permission_context_binding_key: binding_key,
          permission_actor_entity_id: options?.actor ?? ACTOR,
          permission_intervention_id: options?.intervention ?? INT,
          mappings,
        }
      : null,
  };
}

function mockPermissionCandidate(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
    | "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT";
  bindings?: AttentionObservationDeclaredPermissionBindingAssessment[];
  at?: string | null;
  candidate_key?: string;
}) {
  const status =
    options?.status ??
    "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT";
  const present =
    status === "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT";
  const bindings = present
    ? (options?.bindings ?? [mockPermissionBinding()])
    : [];

  return {
    candidate_key: options?.candidate_key ?? CAND,
    permission_context_binding_assessment: {} as never,
    status,
    permission_evaluation_at: present
      ? (options?.at ?? AT)
      : options?.at === undefined
        ? null
        : options.at,
    declared_permission_binding_assessments: bindings,
    model_limitations: [],
  };
}

function mockPolicyCandidate(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT";
  bindings?: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment[];
  candidate_key?: string;
}) {
  const status =
    options?.status ??
    "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT";
  const present =
    status === "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT";
  const bindings = present
    ? (options?.bindings ?? [mockPolicyBinding()])
    : [];

  return {
    candidate_key: options?.candidate_key ?? CAND,
    permission_context_binding_assessment: {} as never,
    status,
    binding_policy_assessments: bindings,
    has_explicit_declared_permission_interpretation_policies: bindings.some(
      (b) =>
        b.status ===
        "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT"
    ),
    model_limitations: [],
  };
}

function mockPermissionSet(
  candidates = [mockPermissionCandidate()]
) {
  return {
    permission_context_binding_set: {} as never,
    specification: { evaluations: [] },
    candidate_assessments: candidates,
    has_observation_context_declared_permission_assessments: candidates.some(
      (c) =>
        c.status ===
        "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT"
    ),
    model_limitations: [],
  };
}

function mockPolicySet(candidates = [mockPolicyCandidate()]) {
  return {
    permission_context_binding_set: {} as never,
    specification: { policies: [] },
    candidate_assessments: candidates,
    has_explicit_declared_permission_interpretation_policies: candidates.some(
      (c) => c.has_explicit_declared_permission_interpretation_policies
    ),
    model_limitations: [],
  };
}

function buildSet(
  permissionCandidate = mockPermissionCandidate(),
  policyCandidate = mockPolicyCandidate()
) {
  return buildAttentionObservationDeclaredPermissionInterpretationSet({
    declared_permission_assessment_set: mockPermissionSet([
      permissionCandidate,
    ]),
    declared_permission_interpretation_policy_set: mockPolicySet([
      policyCandidate,
    ]),
  });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-090 Declared Permission Interpretation Basis", () => {
  describe("exact mapping matches", () => {
    it("PERMIT raw + explicit permitted mapping → Basis PRESENT", () => {
      const set = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: PERMIT_DECL })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PERMIT_DECL, AS_PERMITTED)],
            }),
          ],
        })
      );
      const binding = set.candidate_assessments[0]!
        .binding_interpretation_assessments[0]!;
      assert.equal(
        binding.status,
        "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(binding.interpretation_basis!.interpretation, AS_PERMITTED);
      assert.equal(
        binding.interpretation_basis!.current_declared_permission_status,
        PERMIT_DECL
      );
      assertNoPermissionState(set);
    });

    it("PERMIT raw + unusual prohibited mapping → Basis PRESENT (no correction)", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: PERMIT_DECL })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PERMIT_DECL, AS_PROHIBITED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(
        binding.status,
        "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(
        binding.interpretation_basis!.interpretation,
        AS_PROHIBITED
      );
      assert.equal(binding.has_declared_permission_interpretation_basis, true);
    });

    it("PROHIBIT raw + prohibited mapping → Basis PRESENT", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: PROHIBIT_DECL })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PROHIBIT_DECL, AS_PROHIBITED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(
        binding.interpretation_basis!.interpretation,
        AS_PROHIBITED
      );
    });

    it("PROHIBIT raw + unusual permitted mapping → Basis PRESENT", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: PROHIBIT_DECL })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PROHIBIT_DECL, AS_PERMITTED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(binding.interpretation_basis!.interpretation, AS_PERMITTED);
    });

    it("NO_DECLARATIONS + permitted mapping → Basis PRESENT (not open-world default)", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [
            mockPermissionBinding({
              status: NO_DECL,
              declaration_ids: [],
            }),
          ],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(NO_DECL, AS_PERMITTED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(binding.interpretation_basis!.interpretation, AS_PERMITTED);
    });

    it("NO_DECLARATIONS + prohibited mapping → Basis PRESENT (not closed-world default)", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [
            mockPermissionBinding({
              status: NO_DECL,
              declaration_ids: [],
            }),
          ],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(NO_DECL, AS_PROHIBITED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(
        binding.interpretation_basis!.interpretation,
        AS_PROHIBITED
      );
    });

    it("CONTESTED + permitted mapping → Basis PRESENT (no winner)", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: CONTESTED })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(CONTESTED, AS_PERMITTED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(binding.interpretation_basis!.interpretation, AS_PERMITTED);
      assert.equal(
        binding.interpretation_basis!.current_declared_permission_status,
        CONTESTED
      );
      assert.ok(
        !/"permission_winner"/.test(JSON.stringify(binding.interpretation_basis))
      );
    });

    it("CONTESTED + prohibited mapping → Basis PRESENT (no winner)", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: CONTESTED })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(CONTESTED, AS_PROHIBITED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(
        binding.interpretation_basis!.interpretation,
        AS_PROHIBITED
      );
    });
  });

  describe("policy absence / no mapping / empty policy", () => {
    it("policy absent → NO_POLICY, Basis null", () => {
      const binding = buildSet(
        mockPermissionCandidate(),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              status:
                "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
              mappings: [],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(
        binding.status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(binding.interpretation_basis, null);
      assert.equal(binding.has_declared_permission_interpretation_basis, false);
    });

    it("policy present / current raw unmapped → NO_MAPPING", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: PROHIBIT_DECL })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PERMIT_DECL, AS_PERMITTED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(
        binding.status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
      );
      assert.equal(binding.interpretation_basis, null);
    });

    it("explicit empty policy → NO_MAPPING, not NO_POLICY", () => {
      const binding = buildSet(
        mockPermissionCandidate(),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [],
              policy_key: `${POLICY_KEY}|EMPTY_MAPPING_SET`,
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(
        binding.status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
      );
      assert.notEqual(
        binding.status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
      );
    });

    it("policy absence != no mapping", () => {
      const absent = buildSet(
        mockPermissionCandidate(),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              status:
                "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      const unmapped = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: CONTESTED })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PERMIT_DECL, AS_PERMITTED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.notEqual(absent.status, unmapped.status);
    });

    it("no implicit mappings for any raw status", () => {
      for (const status of [
        PERMIT_DECL,
        PROHIBIT_DECL,
        NO_DECL,
        CONTESTED,
      ] as const) {
        const binding = buildSet(
          mockPermissionCandidate({
            bindings: [
              mockPermissionBinding({
                status,
                declaration_ids: status === NO_DECL ? [] : ["d1"],
              }),
            ],
          }),
          mockPolicyCandidate({
            bindings: [mockPolicyBinding({ mappings: [] })],
          })
        ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
        assert.equal(
          binding.status,
          "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
        );
      }
    });

    it("no contraposition from mapped PERMIT", () => {
      const binding = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: PROHIBIT_DECL })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PERMIT_DECL, AS_PERMITTED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!;
      assert.equal(
        binding.status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
      );
    });
  });

  describe("lineage / identity", () => {
    it("retains matched mapping snapshot, 088 assessment key, 089 policy key, evaluation instant", () => {
      const basis = buildSet().candidate_assessments[0]!
        .binding_interpretation_assessments[0]!.interpretation_basis!;
      assert.deepEqual(basis.matched_mapping, {
        declared_permission_status: PERMIT_DECL,
        interpretation: AS_PERMITTED,
      });
      assert.equal(
        basis.current_declared_permission_assessment_key,
        ASSESSMENT_KEY
      );
      assert.equal(
        basis.declared_permission_interpretation_policy_key,
        POLICY_KEY
      );
      assert.equal(basis.permission_evaluation_at, AT);
      assert.equal(
        basis.key,
        attentionObservationDeclaredPermissionInterpretationBasisKey(
          CAND,
          NEED_KEY,
          SET_KEY,
          BINDING_KEY,
          ASSESSMENT_KEY,
          POLICY_KEY,
          PERMIT_DECL,
          AS_PERMITTED
        )
      );
    });

    it("088 assessment key change (declaration set / instant) changes Basis key", () => {
      const a = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ key: ASSESSMENT_KEY })],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!
        .interpretation_basis!.key;
      const b = buildSet(
        mockPermissionCandidate({
          bindings: [
            mockPermissionBinding({
              key: ASSESSMENT_KEY_ALT,
              at: AT_ALT,
              declaration_ids: ["decl-2"],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!
        .interpretation_basis!.key;
      assert.notEqual(a, b);
    });

    it("policy key change changes Basis key", () => {
      const a = buildSet(
        mockPermissionCandidate(),
        mockPolicyCandidate({
          bindings: [mockPolicyBinding({ policy_key: POLICY_KEY })],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!
        .interpretation_basis!.key;
      const b = buildSet(
        mockPermissionCandidate(),
        mockPolicyCandidate({
          bindings: [mockPolicyBinding({ policy_key: POLICY_KEY_ALT })],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!
        .interpretation_basis!.key;
      assert.notEqual(a, b);
    });

    it("interpretation change changes Basis key", () => {
      const a = buildSet(
        mockPermissionCandidate(),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PERMIT_DECL, AS_PERMITTED)],
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!
        .interpretation_basis!.key;
      const b = buildSet(
        mockPermissionCandidate(),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PERMIT_DECL, AS_PROHIBITED)],
              policy_key: POLICY_KEY_ALT,
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!
        .interpretation_basis!.key;
      assert.notEqual(a, b);
    });

    it("binding change changes Basis key", () => {
      const a = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ binding_key: BINDING_KEY })],
        }),
        mockPolicyCandidate({
          bindings: [mockPolicyBinding({ binding_key: BINDING_KEY })],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!
        .interpretation_basis!.key;
      const b = buildSet(
        mockPermissionCandidate({
          bindings: [
            mockPermissionBinding({
              binding_key: BINDING_KEY_B,
              actor: ACTOR_B,
              intervention: INT_B,
            }),
          ],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              binding_key: BINDING_KEY_B,
              actor: ACTOR_B,
              intervention: INT_B,
            }),
          ],
        })
      ).candidate_assessments[0]!.binding_interpretation_assessments[0]!
        .interpretation_basis!.key;
      assert.notEqual(a, b);
    });
  });

  describe("candidate outer statuses", () => {
    it("no evaluation instant → no binding matching even if policies exist", () => {
      const set = buildSet(
        mockPermissionCandidate({
          status: "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED",
        }),
        mockPolicyCandidate()
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
      );
      assert.deepEqual(
        set.candidate_assessments[0]!.binding_interpretation_assessments,
        []
      );
      assert.equal(
        set.candidate_assessments[0]!
          .has_declared_permission_interpretation_bases,
        false
      );
    });

    it("no bindings", () => {
      const set = buildSet(
        mockPermissionCandidate({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        }),
        mockPolicyCandidate({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
    });

    it("no planning / no Requirements", () => {
      assert.equal(
        buildSet(
          mockPermissionCandidate({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          }),
          mockPolicyCandidate({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        buildSet(
          mockPermissionCandidate({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          }),
          mockPolicyCandidate({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });

    it("assessments present with all NO_POLICY → candidate boolean false", () => {
      const set = buildSet(
        mockPermissionCandidate(),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              status:
                "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
            }),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[0]!
          .has_declared_permission_interpretation_bases,
        false
      );
      assert.equal(set.has_declared_permission_interpretation_bases, false);
    });

    it("Basis PRESENT with only prohibited interpretation → boolean true", () => {
      const set = buildSet(
        mockPermissionCandidate({
          bindings: [mockPermissionBinding({ status: PERMIT_DECL })],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              mappings: [mapping(PERMIT_DECL, AS_PROHIBITED)],
            }),
          ],
        })
      );
      assert.equal(set.has_declared_permission_interpretation_bases, true);
      assert.equal(
        set.candidate_assessments[0]!
          .has_declared_permission_interpretation_bases,
        true
      );
    });
  });

  describe("multiple bindings", () => {
    it("preserves mixed outcomes independently; no ANY/ALL/veto/CONTESTED conflation", () => {
      const set = buildSet(
        mockPermissionCandidate({
          bindings: [
            mockPermissionBinding({
              binding_key: BINDING_KEY,
              status: PERMIT_DECL,
              key: `${ASSESSMENT_KEY}|a`,
            }),
            mockPermissionBinding({
              binding_key: BINDING_KEY_B,
              status: PROHIBIT_DECL,
              actor: ACTOR_B,
              intervention: INT_B,
              key: `${ASSESSMENT_KEY}|b`,
            }),
            mockPermissionBinding({
              binding_key: `${BINDING_KEY}|c`,
              status: NO_DECL,
              declaration_ids: [],
              actor: "actor-c",
              intervention: "int-c",
              key: `${ASSESSMENT_KEY}|c`,
            }),
            mockPermissionBinding({
              binding_key: `${BINDING_KEY}|d`,
              status: CONTESTED,
              actor: "actor-d",
              intervention: "int-d",
              key: `${ASSESSMENT_KEY}|d`,
            }),
          ],
        }),
        mockPolicyCandidate({
          bindings: [
            mockPolicyBinding({
              binding_key: BINDING_KEY,
              mappings: [mapping(PERMIT_DECL, AS_PERMITTED)],
            }),
            mockPolicyBinding({
              binding_key: BINDING_KEY_B,
              actor: ACTOR_B,
              intervention: INT_B,
              mappings: [mapping(PROHIBIT_DECL, AS_PROHIBITED)],
            }),
            mockPolicyBinding({
              binding_key: `${BINDING_KEY}|c`,
              actor: "actor-c",
              intervention: "int-c",
              status:
                "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
            }),
            mockPolicyBinding({
              binding_key: `${BINDING_KEY}|d`,
              actor: "actor-d",
              intervention: "int-d",
              mappings: [mapping(PERMIT_DECL, AS_PERMITTED)],
            }),
          ],
        })
      );
      const assessments =
        set.candidate_assessments[0]!.binding_interpretation_assessments;
      assert.equal(assessments.length, 4);
      assert.equal(
        assessments[0]!.status,
        "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(
        assessments[0]!.interpretation_basis!.interpretation,
        AS_PERMITTED
      );
      assert.equal(
        assessments[1]!.status,
        "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(
        assessments[1]!.interpretation_basis!.interpretation,
        AS_PROHIBITED
      );
      assert.equal(
        assessments[2]!.status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        assessments[3]!.status,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT"
      );
      assert.ok(
        !/"CONTESTED_PERMISSION"/.test(
          JSON.stringify({
            status: set.candidate_assessments[0]!.status,
            binding_statuses: assessments.map((a) => a.status),
          })
        )
      );
      assertNoPermissionState(set);
    });

    it("missing policy counterpart rejects", () => {
      assert.throws(() =>
        buildSet(
          mockPermissionCandidate({
            bindings: [
              mockPermissionBinding({ binding_key: BINDING_KEY }),
              mockPermissionBinding({
                binding_key: BINDING_KEY_B,
                actor: ACTOR_B,
                intervention: INT_B,
              }),
            ],
          }),
          mockPolicyCandidate({
            bindings: [mockPolicyBinding({ binding_key: BINDING_KEY })],
          })
        )
      );
    });

    it("extra policy counterpart rejects", () => {
      assert.throws(() =>
        buildSet(
          mockPermissionCandidate({
            bindings: [mockPermissionBinding({ binding_key: BINDING_KEY })],
          }),
          mockPolicyCandidate({
            bindings: [
              mockPolicyBinding({ binding_key: BINDING_KEY }),
              mockPolicyBinding({
                binding_key: BINDING_KEY_B,
                actor: ACTOR_B,
                intervention: INT_B,
              }),
            ],
          })
        )
      );
    });

    it("context mismatch rejects", () => {
      assert.throws(() =>
        assessAttentionObservationDeclaredPermissionInterpretationBinding(
          mockPermissionBinding({ actor: ACTOR }),
          mockPolicyBinding({ actor: ACTOR_B })
        )
      );
    });
  });

  describe("exact matching helpers", () => {
    it("exact equality only; multiplicity rejects", () => {
      assert.deepEqual(
        findExactDeclaredPermissionInterpretationMapping(
          [mapping(PERMIT_DECL, AS_PERMITTED), mapping(PROHIBIT_DECL, AS_PROHIBITED)],
          PERMIT_DECL
        ),
        mapping(PERMIT_DECL, AS_PERMITTED)
      );
      assert.equal(
        findExactDeclaredPermissionInterpretationMapping(
          [mapping(PERMIT_DECL, AS_PERMITTED)],
          PROHIBIT_DECL
        ),
        null
      );
      assert.throws(() =>
        findExactDeclaredPermissionInterpretationMapping(
          [
            mapping(PERMIT_DECL, AS_PERMITTED),
            mapping(PERMIT_DECL, AS_PROHIBITED),
          ],
          PERMIT_DECL
        )
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        declared_permission_assessment_set: mockPermissionSet(),
        declared_permission_interpretation_policy_set: mockPolicySet(),
      };
      const before = deepClone(input);
      const a = buildAttentionObservationDeclaredPermissionInterpretationSet(
        input
      );
      const b = buildAttentionObservationDeclaredPermissionInterpretationSet(
        input
      );
      const c = buildAttentionObservationDeclaredPermissionInterpretationSet(
        deepClone(input)
      );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("canonical orders; schema 0.1.24; no 024/087/083–085 / ProjectState / wall-clock / OE", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_MODEL_LIMITATIONS.slice(
          0,
          4
        ),
        [
          "PERMISSION_CURRENT_STATE_NOT_MODELED",
          "PERMISSION_EFFECTIVE_STATE_NOT_MODELED",
          "PERMISSION_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED",
          "PERMISSION_INTERPRETATION_DEFAULTS_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-declared-permission-interpretation-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-declared-permission-interpretation-types.ts"
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
        /attention-observation-declared-permission-assessment-types/.test(core)
      );
      assert.ok(
        /attention-observation-declared-permission-interpretation-policy-types/.test(
          core
        )
      );
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(
        !/assessDeclaredInterventionPermission/.test(coreCode)
      );
      assert.ok(
        !/from ["'].*permission-context-binding-core/.test(src)
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
      assert.ok(!/"PERMISSION_PERMITTED"/.test(src));
      assert.ok(!/"PERMISSION_PROHIBITED"/.test(src));
      assert.ok(!/\b"PERMITTED"\b/.test(src));
      assert.ok(!/\b"PROHIBITED"\b/.test(src));
      assert.ok(!/permission_winner/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
    });

    it("assertCompatible contexts exported", () => {
      assert.doesNotThrow(() =>
        assertCompatibleDeclaredPermissionInterpretationContexts(
          mockPermissionSet(),
          mockPolicySet()
        )
      );
      assert.doesNotThrow(() =>
        assessAttentionCandidateObservationDeclaredPermissionInterpretation(
          mockPermissionCandidate(),
          mockPolicyCandidate()
        )
      );
    });
  });
});
