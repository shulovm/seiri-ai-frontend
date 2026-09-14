/**
 * GROUND-095 — Observation Core XLIX / Operational Eligibility Permission
 * Source Resolution Classification Foundation
 *
 * Pure GROUND-093 PERMISSION source → RESOLVED / UNRESOLVED classification
 * (independent from 084 / 094; PROHIBITED is RESOLVED; unresolved ≠ absent;
 * no acceptance / aggregation / OE / can_execute).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityPermissionSourceResolutionClassification,
  attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey,
  buildAttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSet,
  classifyOperationalEligibilityPermissionSourceResolution,
} from "../reality/attention-observation-operational-eligibility-permission-source-resolution-classification-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
} from "../reality/attention-observation-operational-eligibility-permission-state-source-types.js";
import type { AttentionObservationPermissionState } from "../reality/attention-observation-permission-state-types.js";
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
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"has_permitted_permission"/.test(json));
  assert.ok(!/"permission_ok"/.test(json));
  assert.ok(!/"permission_pass"/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"ANY_SOURCE"/.test(json));
  assert.ok(!/"ALL_SOURCES"/.test(json));
}

function mockSourceBridge(options: {
  permission_state: AttentionObservationPermissionState;
  source_key?: string;
  binding_key?: string;
  basis_key?: string;
  at?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationOperationalEligibilityPermissionStateSourceBridge {
  const candidate_key = options.candidate_key ?? CAND;
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const binding_key = options.binding_key ?? BINDING_KEY;
  const basis_key = options.basis_key ?? BASIS_KEY;
  const at = options.at ?? AT;
  return {
    key:
      options.source_key ??
      [
        "attention-observation-operational-eligibility-permission-state-source",
        candidate_key,
        observation_need_key,
        set_key,
        binding_key,
        basis_key,
        at,
        options.permission_state,
      ].join("|"),
    candidate_key,
    observation_need_key,
    capability_requirement_set_key: set_key,
    permission_context_binding_key: binding_key,
    dimension: "PERMISSION",
    permission_state_basis_key: basis_key,
    permission_evaluation_at: at,
    permission_state: options.permission_state,
  };
}

function mockSourceAssessment(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
    | "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  sources?: AttentionObservationOperationalEligibilityPermissionStateSourceBridge[];
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment {
  const status =
    options?.status ??
    "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  const present =
    status === "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  const sources = present
    ? (options?.sources ?? [
        mockSourceBridge({ permission_state: PERMITTED }),
      ])
    : [];

  return {
    candidate_key: options?.candidate_key ?? CAND,
    permission_state_assessment: {} as never,
    status,
    permission_state_sources: sources,
    has_permission_state_operational_eligibility_sources: sources.length > 0,
    model_limitations: [],
  };
}

function buildSet(
  sources: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment[] = [
    mockSourceAssessment(),
  ]
) {
  return buildAttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSet(
    {
      permission_state_source_set: {
        permission_state_set: {} as never,
        candidate_assessments: sources,
        has_permission_state_operational_eligibility_sources: sources.some(
          (s) => s.has_permission_state_operational_eligibility_sources
        ),
        model_limitations: [],
      },
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-095 Operational Eligibility Permission Source Resolution Classification", () => {
  describe("exact Permission State → resolution mapping", () => {
    it("PERMISSION_PERMITTED → RESOLVED / null", () => {
      const classified =
        classifyOperationalEligibilityPermissionSourceResolution(PERMITTED);
      assert.deepEqual(classified, {
        resolution: "RESOLVED",
        unresolved_reason: null,
      });
      const c = buildSet([
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: PERMITTED })],
        }),
      ]).candidate_assessments[0]!.permission_source_resolution_classifications[0]!;
      assert.equal(c.resolution, "RESOLVED");
      assert.equal(c.unresolved_reason, null);
      assert.equal(c.permission_state, PERMITTED);
      assertNoForbiddenSemantics(c);
    });

    it("PERMISSION_PROHIBITED → RESOLVED / null (not unresolved / rejected)", () => {
      const classified =
        classifyOperationalEligibilityPermissionSourceResolution(PROHIBITED);
      assert.equal(classified.resolution, "RESOLVED");
      assert.equal(classified.unresolved_reason, null);
      const c = buildSet([
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: PROHIBITED })],
        }),
      ]).candidate_assessments[0]!.permission_source_resolution_classifications[0]!;
      assert.equal(c.resolution, "RESOLVED");
      assert.equal(c.permission_state, PROHIBITED);
      assert.notEqual(c.resolution, "UNRESOLVED");
      assert.ok(!/"REJECTED"/.test(JSON.stringify(c)));
    });

    it("policy-absence unresolved → exact reason", () => {
      const classified =
        classifyOperationalEligibilityPermissionSourceResolution(
          UNRESOLVED_POLICY
        );
      assert.deepEqual(classified, {
        resolution: "UNRESOLVED",
        unresolved_reason:
          "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY",
      });
      const c = buildSet([
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: UNRESOLVED_POLICY })],
        }),
      ]).candidate_assessments[0]!.permission_source_resolution_classifications[0]!;
      assert.equal(c.resolution, "UNRESOLVED");
      assert.equal(
        c.unresolved_reason,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY"
      );
      assert.equal(c.permission_state, UNRESOLVED_POLICY);
    });

    it("no-mapping unresolved → exact second reason", () => {
      const classified =
        classifyOperationalEligibilityPermissionSourceResolution(
          UNRESOLVED_MAPPING
        );
      assert.deepEqual(classified, {
        resolution: "UNRESOLVED",
        unresolved_reason:
          "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
      });
      const c = buildSet([
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: UNRESOLVED_MAPPING })],
        }),
      ]).candidate_assessments[0]!.permission_source_resolution_classifications[0]!;
      assert.equal(
        c.unresolved_reason,
        "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
      );
    });

    it("two unresolved reasons remain distinct", () => {
      const a =
        classifyOperationalEligibilityPermissionSourceResolution(
          UNRESOLVED_POLICY
        );
      const b =
        classifyOperationalEligibilityPermissionSourceResolution(
          UNRESOLVED_MAPPING
        );
      assert.notEqual(a.unresolved_reason, b.unresolved_reason);
      assert.equal(a.resolution, "UNRESOLVED");
      assert.equal(b.resolution, "UNRESOLVED");
    });

    it("unresolved != prohibited; resolved != permitted", () => {
      assert.notEqual(UNRESOLVED_POLICY, PROHIBITED);
      assert.notEqual(UNRESOLVED_MAPPING, PROHIBITED);
      const prohibited =
        classifyOperationalEligibilityPermissionSourceResolution(PROHIBITED);
      const permitted =
        classifyOperationalEligibilityPermissionSourceResolution(PERMITTED);
      assert.equal(prohibited.resolution, "RESOLVED");
      assert.equal(permitted.resolution, "RESOLVED");
      // resolvedness is orthogonal to polarity — both map to RESOLVED
      assert.equal(prohibited.resolution, permitted.resolution);
      assert.ok(
        !/"PERMISSION_PERMITTED"/.test(
          JSON.stringify({ resolution: prohibited.resolution })
        )
      );
    });

    it("all four source states classified without polarity filtering", () => {
      const set = buildSet([
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
            mockSourceBridge({
              permission_state: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|3`,
              basis_key: `${BASIS_KEY}|3`,
            }),
            mockSourceBridge({
              permission_state: UNRESOLVED_MAPPING,
              binding_key: `${BINDING_KEY}|4`,
              basis_key: `${BASIS_KEY}|4`,
            }),
          ],
        }),
      ]);
      const classifications =
        set.candidate_assessments[0]!
          .permission_source_resolution_classifications;
      assert.equal(classifications.length, 4);
      assert.deepEqual(
        classifications.map((c) => c.resolution),
        ["RESOLVED", "RESOLVED", "UNRESOLVED", "UNRESOLVED"]
      );
      assert.deepEqual(
        classifications.map((c) => c.permission_state),
        [PERMITTED, PROHIBITED, UNRESOLVED_POLICY, UNRESOLVED_MAPPING]
      );
    });
  });

  describe("lineage / identity / one-per-source", () => {
    it("retains exact 093 source key, Basis, binding, evaluation instant, raw state", () => {
      const source = mockSourceBridge({
        permission_state: PROHIBITED,
        source_key: "exact-093-source-key",
        basis_key: BASIS_KEY,
        binding_key: BINDING_KEY,
        at: AT,
      });
      const c = buildSet([
        mockSourceAssessment({ sources: [source] }),
      ]).candidate_assessments[0]!.permission_source_resolution_classifications[0]!;
      assert.equal(c.permission_state_source_key, "exact-093-source-key");
      assert.equal(c.permission_state_basis_key, BASIS_KEY);
      assert.equal(c.permission_context_binding_key, BINDING_KEY);
      assert.equal(c.permission_evaluation_at, AT);
      assert.equal(c.permission_state, PROHIBITED);
      assert.equal(c.dimension, "PERMISSION");
      assert.equal(c.candidate_key, CAND);
      assert.equal(c.observation_need_key, NEED_KEY);
      assert.equal(c.capability_requirement_set_key, SET_KEY);
    });

    it("one classification per exact source", () => {
      const sources = [
        mockSourceBridge({
          permission_state: PERMITTED,
          binding_key: `${BINDING_KEY}|a`,
          basis_key: `${BASIS_KEY}|a`,
        }),
        mockSourceBridge({
          permission_state: UNRESOLVED_POLICY,
          binding_key: `${BINDING_KEY}|b`,
          basis_key: `${BASIS_KEY}|b`,
        }),
      ];
      const classifications = buildSet([
        mockSourceAssessment({ sources }),
      ]).candidate_assessments[0]!.permission_source_resolution_classifications;
      assert.equal(classifications.length, sources.length);
      assert.deepEqual(
        classifications.map((c) => c.permission_state_source_key),
        sources.map((s) => s.key)
      );
    });

    it("source / Basis / at / binding / State / unresolved reason change identity", () => {
      const base = mockSourceBridge({ permission_state: PERMITTED });
      const baseClassified =
        classifyOperationalEligibilityPermissionSourceResolution(
          base.permission_state
        );
      const baseKey =
        attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey(
          {
            candidate_key: base.candidate_key,
            observation_need_key: base.observation_need_key,
            capability_requirement_set_key: base.capability_requirement_set_key,
            permission_context_binding_key: base.permission_context_binding_key,
            permission_state_source_key: base.key,
            permission_state_basis_key: base.permission_state_basis_key,
            permission_evaluation_at: base.permission_evaluation_at,
            permission_state: base.permission_state,
            resolution: baseClassified.resolution,
            unresolved_reason: baseClassified.unresolved_reason,
          }
        );

      const sourceChanged =
        attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey(
          {
            candidate_key: base.candidate_key,
            observation_need_key: base.observation_need_key,
            capability_requirement_set_key: base.capability_requirement_set_key,
            permission_context_binding_key: base.permission_context_binding_key,
            permission_state_source_key: `${base.key}|alt`,
            permission_state_basis_key: base.permission_state_basis_key,
            permission_evaluation_at: base.permission_evaluation_at,
            permission_state: base.permission_state,
            resolution: baseClassified.resolution,
            unresolved_reason: baseClassified.unresolved_reason,
          }
        );
      assert.notEqual(baseKey, sourceChanged);

      const basisChanged =
        attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey(
          {
            candidate_key: base.candidate_key,
            observation_need_key: base.observation_need_key,
            capability_requirement_set_key: base.capability_requirement_set_key,
            permission_context_binding_key: base.permission_context_binding_key,
            permission_state_source_key: base.key,
            permission_state_basis_key: BASIS_KEY_ALT,
            permission_evaluation_at: base.permission_evaluation_at,
            permission_state: base.permission_state,
            resolution: baseClassified.resolution,
            unresolved_reason: baseClassified.unresolved_reason,
          }
        );
      assert.notEqual(baseKey, basisChanged);

      const atChanged =
        attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey(
          {
            candidate_key: base.candidate_key,
            observation_need_key: base.observation_need_key,
            capability_requirement_set_key: base.capability_requirement_set_key,
            permission_context_binding_key: base.permission_context_binding_key,
            permission_state_source_key: base.key,
            permission_state_basis_key: base.permission_state_basis_key,
            permission_evaluation_at: AT_ALT,
            permission_state: base.permission_state,
            resolution: baseClassified.resolution,
            unresolved_reason: baseClassified.unresolved_reason,
          }
        );
      assert.notEqual(baseKey, atChanged);

      const bindingChanged =
        attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey(
          {
            candidate_key: base.candidate_key,
            observation_need_key: base.observation_need_key,
            capability_requirement_set_key: base.capability_requirement_set_key,
            permission_context_binding_key: BINDING_KEY_B,
            permission_state_source_key: base.key,
            permission_state_basis_key: base.permission_state_basis_key,
            permission_evaluation_at: base.permission_evaluation_at,
            permission_state: base.permission_state,
            resolution: baseClassified.resolution,
            unresolved_reason: baseClassified.unresolved_reason,
          }
        );
      assert.notEqual(baseKey, bindingChanged);

      const prohibitedClassified =
        classifyOperationalEligibilityPermissionSourceResolution(PROHIBITED);
      const stateChanged =
        attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey(
          {
            candidate_key: base.candidate_key,
            observation_need_key: base.observation_need_key,
            capability_requirement_set_key: base.capability_requirement_set_key,
            permission_context_binding_key: base.permission_context_binding_key,
            permission_state_source_key: base.key,
            permission_state_basis_key: base.permission_state_basis_key,
            permission_evaluation_at: base.permission_evaluation_at,
            permission_state: PROHIBITED,
            resolution: prohibitedClassified.resolution,
            unresolved_reason: prohibitedClassified.unresolved_reason,
          }
        );
      assert.notEqual(baseKey, stateChanged);

      const policyClass =
        buildSet([
          mockSourceAssessment({
            sources: [
              mockSourceBridge({ permission_state: UNRESOLVED_POLICY }),
            ],
          }),
        ]).candidate_assessments[0]!
          .permission_source_resolution_classifications[0]!;
      const mappingClass =
        buildSet([
          mockSourceAssessment({
            sources: [
              mockSourceBridge({ permission_state: UNRESOLVED_MAPPING }),
            ],
          }),
        ]).candidate_assessments[0]!
          .permission_source_resolution_classifications[0]!;
      assert.notEqual(policyClass.key, mappingClass.key);
      assert.notEqual(
        policyClass.unresolved_reason,
        mappingClass.unresolved_reason
      );
    });
  });

  describe("multiple sources / no aggregation / no contamination", () => {
    it("mixed sources classify independently without aggregation", () => {
      const set = buildSet([
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
            mockSourceBridge({
              permission_state: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|3`,
              basis_key: `${BASIS_KEY}|3`,
            }),
          ],
        }),
      ]);
      const classifications =
        set.candidate_assessments[0]!
          .permission_source_resolution_classifications;
      assert.deepEqual(
        classifications.map((c) => c.resolution),
        ["RESOLVED", "RESOLVED", "UNRESOLVED"]
      );
      const candidate = set.candidate_assessments[0]!;
      assert.equal(candidate.has_permission_source_resolution_classifications, true);
      assert.equal(candidate.has_resolved_permission_sources, true);
      assert.equal(candidate.has_unresolved_permission_sources, true);
      assert.ok(!/"overall"/.test(JSON.stringify(candidate)));
      assertNoForbiddenSemantics(set);
    });

    it("one unresolved does not contaminate resolved; one resolved does not resolve unresolved", () => {
      const classifications = buildSet([
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockSourceBridge({
              permission_state: UNRESOLVED_MAPPING,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
          ],
        }),
      ]).candidate_assessments[0]!.permission_source_resolution_classifications;
      assert.equal(classifications[0]!.resolution, "RESOLVED");
      assert.equal(classifications[1]!.resolution, "UNRESOLVED");
    });

    it("source order preserved (not resolved-first / permitted-first)", () => {
      const classifications = buildSet([
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|3`,
              basis_key: `${BASIS_KEY}|3`,
            }),
          ],
        }),
      ]).candidate_assessments[0]!.permission_source_resolution_classifications;
      assert.deepEqual(
        classifications.map((c) => c.permission_state),
        [UNRESOLVED_POLICY, PROHIBITED, PERMITTED]
      );
    });
  });

  describe("outer status / source absence", () => {
    it("no planning / no Requirements / no binding / no evaluation instant → no classifications", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const candidate = buildSet([
          mockSourceAssessment({ status }),
        ]).candidate_assessments[0]!;
        assert.equal(candidate.status, status);
        assert.equal(
          candidate.permission_source_resolution_classifications.length,
          0
        );
        assert.equal(
          candidate.has_permission_source_resolution_classifications,
          false
        );
        assert.equal(candidate.has_resolved_permission_sources, false);
        assert.equal(candidate.has_unresolved_permission_sources, false);
      }
    });

    it("source absence != synthetic UNRESOLVED classification", () => {
      const set = buildSet([
        mockSourceAssessment({
          status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        }),
      ]);
      assert.equal(
        set.candidate_assessments[0]!
          .permission_source_resolution_classifications.length,
        0
      );
      assert.equal(set.has_unresolved_permission_sources, false);
      assert.equal(set.has_permission_source_resolution_classifications, false);
      assert.equal(set.has_resolved_permission_sources, false);
    });

    it("sources present → classify every exact source", () => {
      const candidate = buildSet([
        mockSourceAssessment({
          sources: [
            mockSourceBridge({ permission_state: PERMITTED }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: BINDING_KEY_B,
              basis_key: BASIS_KEY_ALT,
            }),
          ],
        }),
      ]).candidate_assessments[0]!;
      assert.equal(
        candidate.status,
        "PERMISSION_SOURCE_RESOLUTION_CLASSIFICATIONS_PRESENT"
      );
      assert.equal(
        candidate.permission_source_resolution_classifications.length,
        2
      );
    });
  });

  describe("candidate / set boolean semantics", () => {
    it("all resolved → true / true / false", () => {
      const candidate = buildSet([
        mockSourceAssessment({
          sources: [
            mockSourceBridge({ permission_state: PERMITTED }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: BINDING_KEY_B,
              basis_key: BASIS_KEY_ALT,
            }),
          ],
        }),
      ]).candidate_assessments[0]!;
      assert.equal(
        candidate.has_permission_source_resolution_classifications,
        true
      );
      assert.equal(candidate.has_resolved_permission_sources, true);
      assert.equal(candidate.has_unresolved_permission_sources, false);
    });

    it("all unresolved → true / false / true", () => {
      const candidate = buildSet([
        mockSourceAssessment({
          sources: [
            mockSourceBridge({ permission_state: UNRESOLVED_POLICY }),
            mockSourceBridge({
              permission_state: UNRESOLVED_MAPPING,
              binding_key: BINDING_KEY_B,
              basis_key: BASIS_KEY_ALT,
            }),
          ],
        }),
      ]).candidate_assessments[0]!;
      assert.equal(
        candidate.has_permission_source_resolution_classifications,
        true
      );
      assert.equal(candidate.has_resolved_permission_sources, false);
      assert.equal(candidate.has_unresolved_permission_sources, true);
    });

    it("mixed → true / true / true", () => {
      const candidate = buildSet([
        mockSourceAssessment({
          sources: [
            mockSourceBridge({ permission_state: PERMITTED }),
            mockSourceBridge({
              permission_state: UNRESOLVED_POLICY,
              binding_key: BINDING_KEY_B,
              basis_key: BASIS_KEY_ALT,
            }),
          ],
        }),
      ]).candidate_assessments[0]!;
      assert.equal(
        candidate.has_permission_source_resolution_classifications,
        true
      );
      assert.equal(candidate.has_resolved_permission_sources, true);
      assert.equal(candidate.has_unresolved_permission_sources, true);
    });

    it("all PERMISSION_PROHIBITED → resolved boolean true; no positive Permission boolean", () => {
      const set = buildSet([
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: PROHIBITED })],
        }),
      ]);
      assert.equal(set.has_resolved_permission_sources, true);
      assert.equal(set.has_unresolved_permission_sources, false);
      assert.ok(!/"has_permitted_permission"/.test(JSON.stringify(set)));
      assert.ok(!/"permission_ok"/.test(JSON.stringify(set)));
    });

    it("no sources → all set booleans false", () => {
      const set = buildSet([
        mockSourceAssessment({
          status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        }),
      ]);
      assert.equal(set.has_permission_source_resolution_classifications, false);
      assert.equal(set.has_resolved_permission_sources, false);
      assert.equal(set.has_unresolved_permission_sources, false);
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        permission_state_source_set: {
          permission_state_set: {} as never,
          candidate_assessments: [
            mockSourceAssessment({
              sources: [
                mockSourceBridge({ permission_state: PERMITTED }),
                mockSourceBridge({
                  permission_state: UNRESOLVED_POLICY,
                  binding_key: BINDING_KEY_B,
                  basis_key: BASIS_KEY_ALT,
                }),
              ],
            }),
          ],
          has_permission_state_operational_eligibility_sources: true,
          model_limitations: [],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 094/084/091-direct/090–024/085; no acceptance/aggregation/OE", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS.slice(
          0,
          4
        ),
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-resolution-classification-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-resolution-classification-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(
        /attention-observation-operational-eligibility-permission-state-source-types/.test(
          core
        )
      );
      assert.ok(
        !/permission-required-dimension-coverage/.test(src)
      );
      assert.ok(
        !/operational-eligibility-dimension-policy/.test(src)
      );
      assert.ok(!/required_dimensions/.test(src));
      assert.ok(!/from ["'].*permission-state-core/.test(src));
      assert.ok(
        !/from ["'].*permission-state-types/.test(coreCode)
      );
      // types may import Permission State type only; core must not import 091 core
      assert.ok(
        /from ["'].*permission-state-types/.test(types) ||
          /AttentionObservationPermissionState/.test(types)
      );
      assert.ok(!/from ["'].*declared-permission-/.test(src));
      assert.ok(
        !/from ["'].*permission-context-binding/.test(src)
      );
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(
        !/from ["'].*operational-eligibility-capability-state-source/.test(src)
      );
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/from ["'].*\.\.\/types/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));
      assert.ok(!/"ACCEPTED"/.test(src));
      assert.ok(!/"REJECTED"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/ANY_SOURCE|ALL_SOURCES/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"NOT_REPRESENTED"/.test(src));

      // resolution independent from 084: classify without required_dimensions
      const withoutRequirement =
        assessAttentionCandidateObservationOperationalEligibilityPermissionSourceResolutionClassification(
          mockSourceAssessment({
            sources: [mockSourceBridge({ permission_state: PROHIBITED })],
          })
        );
      assert.equal(
        withoutRequirement.permission_source_resolution_classifications[0]!
          .resolution,
        "RESOLVED"
      );
      assert.ok(
        !("required_dimensions" in withoutRequirement)
      );
    });
  });
});
