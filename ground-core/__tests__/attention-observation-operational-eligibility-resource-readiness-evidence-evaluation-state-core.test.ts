/**
 * GROUND-137 — Observation Core XCI / Operational Eligibility
 * RESOURCE_READINESS Evidence Evaluation State Foundation
 *
 * Pure GROUND-135 Raw Binding Evidence → structured per-binding Evaluation State
 * (no readiness polarity / interpretation / OE / multi-binding composition).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSet,
  deriveAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.js";
import type { ResourceAssessment } from "../reality/resource-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const CAP_SET_KEY = "cap-set-key";
const REQ1 = "req-r1";
const REQ2 = "req-r2";
const BINDING1 = "binding|req-r1|rd-1";
const BINDING2 = "binding|req-r1|rd-2";
const BINDING3 = "binding|req-r2|rd-1";
const RD1 = "rd-1";
const RD2 = "rd-2";
const RD_DANGLING = "rd-dangling";
const INSTANT_KEY = "instant|cand|need|cap-set|RESOURCE_READINESS|2026-09-02T12:00:00.000Z";
const AT = "2026-09-02T12:00:00.000Z";
const AT_ALT = "2026-09-02T13:00:00.000Z";

function mockResourceAssessment(
  overrides: Partial<ResourceAssessment> = {}
): ResourceAssessment {
  return {
    resource: {
      id: RD1,
      project_id: "p",
      holder_entity_id: "h",
      resource_key: "SENSOR_POWER",
      unit: "WH",
      scope: { kind: "UNSCOPED" },
      resource_entity_id: null,
      description: null,
      valid_from: "2026-09-01T00:00:00.000Z",
      valid_until: null,
      declared_by: { kind: "human", label: "ops" },
      recorded_at: "2026-09-01T00:00:00.000Z",
      created_at: "2026-09-01T00:00:00.000Z",
      updated_at: "2026-09-01T00:00:00.000Z",
    },
    at: AT,
    declaration_status: "RESOURCE_DECLARATION_ACTIVE",
    capacity: {
      resource_declaration_id: RD1,
      at: AT,
      status: "ACTIVE_CAPACITY_DECLARATIONS_PRESENT",
      capacity_declaration_ids: ["cap-1"],
      capacities: [{ kind: "POINT", value: 100 }],
      declarers: [{ kind: "human", label: "ops" }],
      has_multiple_capacity_declarations: false,
      has_capacity_divergence: false,
    },
    availability: {
      resource_declaration_id: RD1,
      at: AT,
      status: "AVAILABLE_DECLARED",
      availability_declaration_ids: ["avail-1"],
      available_declaration_ids: ["avail-1"],
      unavailable_declaration_ids: [],
      declarers: [{ kind: "human", label: "ops" }],
    },
    has_active_resource_declaration: true,
    has_capacity_declaration: true,
    has_capacity_divergence: false,
    has_available_declaration: true,
    has_unavailable_declaration: false,
    has_contested_availability: false,
    has_temporal_basis_mismatch: false,
    ...overrides,
  };
}

function mockRaw(
  overrides: Partial<AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment> & {
    key: string;
  }
): AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment {
  const found =
    overrides.resource_declaration_lookup_status !==
    "BOUND_RESOURCE_DECLARATION_NOT_FOUND";
  return {
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: CAP_SET_KEY,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: REQ1,
    resource_readiness_observation_context_binding_key: BINDING1,
    resource_declaration_id: RD1,
    resource_readiness_evaluation_instant_key: INSTANT_KEY,
    evaluation_at: AT,
    resource_declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_FOUND",
    requirement_temporal_relation:
      "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT",
    resource_key_relation: found ? "RESOURCE_KEY_EXACT_MATCH" : null,
    resource_unit_relation: found ? "RESOURCE_UNIT_EXACT_MATCH" : null,
    resource_scope_relation: found ? "RESOURCE_SCOPE_EXACT_MATCH" : null,
    resource_assessment: found ? mockResourceAssessment() : null,
    ...overrides,
  };
}

function mockRawNotFound(
  overrides: Partial<AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment> = {}
): AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment {
  return mockRaw({
    key: overrides.key ?? `raw|${BINDING2}|${RD_DANGLING}|NOT_FOUND`,
    resource_readiness_observation_context_binding_key:
      overrides.resource_readiness_observation_context_binding_key ?? BINDING2,
    resource_declaration_id: overrides.resource_declaration_id ?? RD_DANGLING,
    resource_declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_NOT_FOUND",
    resource_key_relation: null,
    resource_unit_relation: null,
    resource_scope_relation: null,
    resource_assessment: null,
    ...overrides,
  });
}

function mock135Candidate(
  overrides: Partial<AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment> & {
    candidate_key?: string;
    raws?: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment[];
    status?: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment["status"];
  } = {}
): AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment {
  const raws =
    overrides.raws ??
    [
      mockRaw({
        key: `raw|${BINDING1}|${RD1}|FOUND`,
      }),
    ];
  const status =
    overrides.status ??
    (raws.length > 0
      ? "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT"
      : "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED");
  return {
    candidate_key: overrides.candidate_key ?? CAND,
    resource_readiness_evaluation_instant_assessment: {} as never,
    status,
    requirement_raw_evidence_assessments: [],
    raw_binding_evidence_assessments: raws,
    has_resource_readiness_raw_evidence_assessments: raws.length > 0,
    model_limitations: [],
  };
}

function mock135Set(
  candidates: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment[] = [
    mock135Candidate(),
  ]
): AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet {
  return {
    resource_readiness_observation_context_binding_set: {} as never,
    resource_readiness_evaluation_instant_set: {} as never,
    candidate_assessments: candidates,
    has_resource_readiness_raw_evidence_assessments: candidates.some(
      (c) => c.has_resource_readiness_raw_evidence_assessments
    ),
    model_limitations: [],
  };
}

function build137(
  set: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet = mock135Set()
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSet(
    { resource_readiness_raw_evidence_assessment_set: set }
  );
}

function assertNoReadinessPolarity(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"RESOURCE_READY"/.test(json));
  assert.ok(!/"RESOURCE_NOT_READY"/.test(json));
  assert.ok(!/"RESOURCE_REQUIREMENT_SATISFIED"/.test(json));
  assert.ok(!/"RESOURCE_REQUIREMENT_UNSATISFIED"/.test(json));
  assert.ok(!/"INTERPRET_AS_RESOURCE_READY"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"is_resolved"/.test(json));
  assert.ok(!/"is_unresolved"/.test(json));
}

describe("GROUND-137 RESOURCE_READINESS Evidence Evaluation State", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
      [
        "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
        "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_BEYOND_EXACT_MATCH_NOT_MODELED",
        "OBSERVATION_RESOURCE_SCOPE_SUBSUMPTION_NOT_MODELED",
        "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED",
        "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED",
        "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED",
        "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED",
        "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_NOT_MODELED",
        "RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_NOT_MODELED",
        "PER_BINDING_CANONICAL_RESOURCE_READINESS_STATE_NOT_MODELED",
        "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_NOT_MODELED",
        "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_STATE_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
        "CAN_EXECUTE_NOT_MODELED",
        "EXECUTION_NOT_MODELED",
      ]
    );
  });

  describe("FOUND / NOT_FOUND states", () => {
    it("FOUND canonical State preserves all exact axes", () => {
      const set = build137();
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT"
      );
      assert.equal(cand.evidence_evaluation_states.length, 1);
      assert.equal(cand.evidence_evaluation_state_bases.length, 1);
      const state = cand.evidence_evaluation_states[0]!;
      const value = state.evaluation_state;
      assert.equal(value.declaration_lookup_status, "BOUND_RESOURCE_DECLARATION_FOUND");
      assert.equal(
        value.requirement_temporal_relation,
        "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT"
      );
      assert.equal(value.resource_key_relation, "RESOURCE_KEY_EXACT_MATCH");
      assert.equal(value.resource_unit_relation, "RESOURCE_UNIT_EXACT_MATCH");
      assert.equal(value.resource_scope_relation, "RESOURCE_SCOPE_EXACT_MATCH");
      assert.equal(value.resource_declaration_assessment_status, "RESOURCE_DECLARATION_ACTIVE");
      assert.equal(value.availability_assessment_status, "AVAILABLE_DECLARED");
      assert.equal(value.capacity_assessment_status, "ACTIVE_CAPACITY_DECLARATIONS_PRESENT");
      assert.equal(value.has_multiple_capacity_declarations, false);
      assert.equal(value.has_capacity_divergence, false);
      assert.equal(value.has_temporal_basis_mismatch, false);
      assert.ok(state.raw_binding_evidence_assessment_key.length > 0);
      assert.equal(state.basis_key, cand.evidence_evaluation_state_bases[0]!.key);
      assertNoReadinessPolarity(set);
    });

    it("NOT_FOUND canonical State with null declaration-dependent axes", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [mockRawNotFound()],
          }),
        ])
      );
      const state = set.candidate_assessments[0]!.evidence_evaluation_states[0]!;
      const value = state.evaluation_state;
      assert.equal(value.declaration_lookup_status, "BOUND_RESOURCE_DECLARATION_NOT_FOUND");
      assert.equal(value.resource_key_relation, null);
      assert.equal(value.resource_unit_relation, null);
      assert.equal(value.resource_scope_relation, null);
      assert.equal(value.resource_declaration_assessment_status, null);
      assert.equal(value.availability_assessment_status, null);
      assert.equal(value.capacity_assessment_status, null);
      assert.equal(value.has_multiple_capacity_declarations, null);
      assert.equal(value.has_capacity_divergence, null);
      assert.equal(value.has_temporal_basis_mismatch, null);
      assert.equal(
        value.requirement_temporal_relation,
        "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT"
      );
    });

    it("NOT_FOUND State is not suppressed", () => {
      const set = build137(
        mock135Set([mock135Candidate({ raws: [mockRawNotFound()] })])
      );
      assert.equal(set.candidate_assessments[0]!.evidence_evaluation_states.length, 1);
      assert.equal(
        set.candidate_assessments[0]!.has_resource_readiness_evidence_evaluation_states,
        true
      );
    });

    it("N raw assessments → N States", () => {
      const raws = [
        mockRaw({ key: "raw-a", resource_readiness_observation_context_binding_key: BINDING1 }),
        mockRawNotFound({ key: "raw-b" }),
        mockRaw({
          key: "raw-c",
          observation_resource_requirement_key: REQ2,
          resource_readiness_observation_context_binding_key: BINDING3,
        }),
      ];
      const set = build137(mock135Set([mock135Candidate({ raws })]));
      assert.equal(set.candidate_assessments[0]!.evidence_evaluation_states.length, 3);
      assert.equal(set.candidate_assessments[0]!.evidence_evaluation_state_bases.length, 3);
    });

    it("all NOT_FOUND still has_resource_readiness_evidence_evaluation_states true", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRawNotFound({ key: "raw-1" }),
              mockRawNotFound({
                key: "raw-2",
                resource_declaration_id: "rd-other",
                resource_readiness_observation_context_binding_key: BINDING3,
              }),
            ],
          }),
        ])
      );
      assert.equal(
        set.candidate_assessments[0]!.has_resource_readiness_evidence_evaluation_states,
        true
      );
      assert.equal(set.has_resource_readiness_evidence_evaluation_states, true);
    });
  });

  describe("identity / lineage", () => {
    it("same values / different binding lineage → distinct identities", () => {
      const valueAxes = {
        resource_key_relation: "RESOURCE_KEY_EXACT_MATCH" as const,
        resource_unit_relation: "RESOURCE_UNIT_EXACT_MATCH" as const,
        resource_scope_relation: "RESOURCE_SCOPE_EXACT_MATCH" as const,
      };
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-b1",
                resource_readiness_observation_context_binding_key: BINDING1,
                ...valueAxes,
              }),
              mockRaw({
                key: "raw-b2",
                resource_readiness_observation_context_binding_key: BINDING2,
                resource_declaration_id: RD2,
                resource_assessment: mockResourceAssessment({
                  resource: {
                    ...mockResourceAssessment().resource,
                    id: RD2,
                  },
                }),
                ...valueAxes,
              }),
            ],
          }),
        ])
      );
      const [s1, s2] = set.candidate_assessments[0]!.evidence_evaluation_states;
      assert.deepEqual(s1!.evaluation_state, s2!.evaluation_state);
      assert.notEqual(s1!.key, s2!.key);
      assert.notEqual(s1!.basis_key, s2!.basis_key);
    });

    it("same values / different requirement lineage → distinct identities", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-r1",
                observation_resource_requirement_key: REQ1,
                resource_readiness_observation_context_binding_key: BINDING1,
              }),
              mockRaw({
                key: "raw-r2",
                observation_resource_requirement_key: REQ2,
                resource_readiness_observation_context_binding_key: BINDING3,
              }),
            ],
          }),
        ])
      );
      const [s1, s2] = set.candidate_assessments[0]!.evidence_evaluation_states;
      assert.deepEqual(s1!.evaluation_state, s2!.evaluation_state);
      assert.notEqual(s1!.key, s2!.key);
    });

    it("same values / different ResourceDeclaration ID → distinct identities", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({ key: "raw-rd1", resource_declaration_id: RD1 }),
              mockRaw({
                key: "raw-rd2",
                resource_declaration_id: RD2,
                resource_readiness_observation_context_binding_key: BINDING2,
                resource_assessment: mockResourceAssessment({
                  resource: { ...mockResourceAssessment().resource, id: RD2 },
                }),
              }),
            ],
          }),
        ])
      );
      assert.notEqual(
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.key,
        set.candidate_assessments[0]!.evidence_evaluation_states[1]!.key
      );
    });

    it("same raw assessment / deterministic repeat → same identity", () => {
      const input = mock135Set();
      const a = build137(input);
      const b = build137(input);
      assert.deepEqual(a, b);
    });

    it("different evaluation instant through raw lineage → different identity", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-t1",
                evaluation_at: AT,
                resource_readiness_evaluation_instant_key: INSTANT_KEY,
              }),
              mockRaw({
                key: "raw-t2",
                evaluation_at: AT_ALT,
                resource_readiness_evaluation_instant_key: `${INSTANT_KEY}|alt`,
                resource_readiness_observation_context_binding_key: BINDING2,
              }),
            ],
          }),
        ])
      );
      assert.notEqual(
        set.candidate_assessments[0]!.evidence_evaluation_state_bases[0]!.key,
        set.candidate_assessments[0]!.evidence_evaluation_state_bases[1]!.key
      );
    });
  });

  describe("structural / availability / capacity axes", () => {
    it("FOUND + key mismatch preserved", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-mismatch-key",
                resource_key_relation: "RESOURCE_KEY_DOES_NOT_EXACT_MATCH",
              }),
            ],
          }),
        ])
      );
      assert.equal(
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.evaluation_state
          .resource_key_relation,
        "RESOURCE_KEY_DOES_NOT_EXACT_MATCH"
      );
      assertNoReadinessPolarity(set);
    });

    it("FOUND + unit / scope mismatch preserved", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-mismatch-unit-scope",
                resource_unit_relation: "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH",
                resource_scope_relation: "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH",
              }),
            ],
          }),
        ])
      );
      const v =
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.evaluation_state;
      assert.equal(v.resource_unit_relation, "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH");
      assert.equal(v.resource_scope_relation, "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH");
    });

    it("DOES_NOT_APPLY preserved without NOT_READY", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-does-not-apply",
                requirement_temporal_relation:
                  "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT",
              }),
            ],
          }),
        ])
      );
      assert.equal(
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.evaluation_state
          .requirement_temporal_relation,
        "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT"
      );
      assertNoReadinessPolarity(set);
    });

    it("UNAVAILABLE_DECLARED / CONTESTED / NO_AVAILABILITY preserved", () => {
      for (const status of [
        "UNAVAILABLE_DECLARED",
        "CONTESTED_AVAILABILITY",
        "NO_AVAILABILITY_DECLARATIONS",
      ] as const) {
        const set = build137(
          mock135Set([
            mock135Candidate({
              raws: [
                mockRaw({
                  key: `raw-${status}`,
                  resource_assessment: mockResourceAssessment({
                    availability: {
                      ...mockResourceAssessment().availability,
                      status,
                    },
                  }),
                }),
              ],
            }),
          ])
        );
        assert.equal(
          set.candidate_assessments[0]!.evidence_evaluation_states[0]!
            .evaluation_state.availability_assessment_status,
          status
        );
        assertNoReadinessPolarity(set);
      }
    });

    it("capacity divergence / multiple / temporal-basis mismatch preserved", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-cap-flags",
                resource_assessment: mockResourceAssessment({
                  capacity: {
                    ...mockResourceAssessment().capacity,
                    has_multiple_capacity_declarations: true,
                    has_capacity_divergence: true,
                  },
                  has_capacity_divergence: true,
                  has_temporal_basis_mismatch: true,
                }),
              }),
            ],
          }),
        ])
      );
      const v =
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.evaluation_state;
      assert.equal(v.has_multiple_capacity_declarations, true);
      assert.equal(v.has_capacity_divergence, true);
      assert.equal(v.has_temporal_basis_mismatch, true);
    });

    it("FOUND + structural exact + UNAVAILABLE coexistence", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-exact-unavail",
                resource_assessment: mockResourceAssessment({
                  availability: {
                    ...mockResourceAssessment().availability,
                    status: "UNAVAILABLE_DECLARED",
                  },
                }),
              }),
            ],
          }),
        ])
      );
      const v =
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.evaluation_state;
      assert.equal(v.resource_key_relation, "RESOURCE_KEY_EXACT_MATCH");
      assert.equal(v.availability_assessment_status, "UNAVAILABLE_DECLARED");
    });

    it("FOUND + mismatch + AVAILABLE coexistence", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-mismatch-avail",
                resource_key_relation: "RESOURCE_KEY_DOES_NOT_EXACT_MATCH",
              }),
            ],
          }),
        ])
      );
      const v =
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.evaluation_state;
      assert.equal(v.resource_key_relation, "RESOURCE_KEY_DOES_NOT_EXACT_MATCH");
      assert.equal(v.availability_assessment_status, "AVAILABLE_DECLARED");
    });

    it("DOES_NOT_APPLY + AVAILABLE coexistence", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRaw({
                key: "raw-temporal-avail",
                requirement_temporal_relation:
                  "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT",
              }),
            ],
          }),
        ])
      );
      const v =
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.evaluation_state;
      assert.equal(
        v.requirement_temporal_relation,
        "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT"
      );
      assert.equal(v.availability_assessment_status, "AVAILABLE_DECLARED");
    });

    it("NOT_FOUND + APPLIES coexistence", () => {
      const set = build137(
        mock135Set([
          mock135Candidate({
            raws: [
              mockRawNotFound({
                requirement_temporal_relation:
                  "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT",
              }),
            ],
          }),
        ])
      );
      const v =
        set.candidate_assessments[0]!.evidence_evaluation_states[0]!.evaluation_state;
      assert.equal(v.declaration_lookup_status, "BOUND_RESOURCE_DECLARATION_NOT_FOUND");
      assert.equal(
        v.requirement_temporal_relation,
        "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT"
      );
    });
  });

  describe("malformed input rejection", () => {
    it("NOT_FOUND malformed with non-null declaration-dependent axes rejects", () => {
      assert.throws(() =>
        build137(
          mock135Set([
            mock135Candidate({
              raws: [
                {
                  ...mockRawNotFound(),
                  resource_key_relation: "RESOURCE_KEY_EXACT_MATCH",
                },
              ],
            }),
          ])
        )
      );
    });

    it("FOUND malformed with null ResourceAssessment rejects", () => {
      assert.throws(() =>
        build137(
          mock135Set([
            mock135Candidate({
              raws: [
                mockRaw({
                  key: "raw-bad-found",
                  resource_assessment: null,
                }),
              ],
            }),
          ])
        )
      );
    });
  });

  describe("status propagation", () => {
    const outerStatuses = [
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
      "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED",
      "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY",
      "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED",
    ] as const;

    for (const status of outerStatuses) {
      it(`${status} → zero States`, () => {
        const set = build137(
          mock135Set([
            mock135Candidate({
              status,
              raws: [],
            }),
          ])
        );
        assert.equal(set.candidate_assessments[0]!.status, status);
        assert.equal(
          set.candidate_assessments[0]!.evidence_evaluation_states.length,
          0
        );
        assert.equal(
          set.candidate_assessments[0]!
            .has_resource_readiness_evidence_evaluation_states,
          false
        );
      });
    }
  });

  describe("immutability / determinism / value key", () => {
    it("input immutability", () => {
      const input = mock135Set();
      const before = structuredClone(input);
      build137(input);
      assert.deepEqual(input, before);
    });

    it("deep-cloned equivalent input → same output", () => {
      const input = mock135Set();
      const a = build137(input);
      const b = build137(structuredClone(input));
      assert.deepEqual(a, b);
    });

    it("canonical structured-key order invariance", () => {
      const value =
        deriveAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue(
          mockRaw({ key: "raw-key" })
        );
      const k1 =
        attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
          value
        );
      const k2 =
        attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
          { ...value }
        );
      assert.equal(k1, k2);
      assert.ok(k1.includes("BOUND_RESOURCE_DECLARATION_FOUND"));
      assert.ok(k1.includes("AVAILABLE_DECLARED"));
    });

    it("NOT_FOUND value key uses NONE tokens", () => {
      const value =
        deriveAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue(
          mockRawNotFound()
        );
      const key =
        attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
          value
        );
      assert.ok(key.includes("NONE"));
      assert.ok(key.includes("BOUND_RESOURCE_DECLARATION_NOT_FOUND"));
    });
  });

  describe("static proofs", () => {
    it("sole GROUND-135 authority; no ProjectState/assessResource/OE polarity", () => {
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/resource_readiness_raw_evidence_assessment_set/.test(core));
      assert.ok(
        /deriveAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue/.test(
          core
        )
      );
      assert.ok(!/assessResource\(/.test(core));
      assert.ok(!/from ["']\.\.\/types\.js["']/.test(core));
      assert.ok(!/from ["'].*resource-core/.test(core));
      assert.ok(
        !/from ["'].*resource-readiness-evaluation-instant-core/.test(core)
      );
      assert.ok(
        !/from ["'].*resource-readiness-observation-context-binding-core/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*attention-observation-resource-requirement-core/.test(core)
      );
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/ResourceReservation/.test(src));
      assert.ok(!/ResourceCommitment/.test(src));
      assert.ok(!/ResourceContention/.test(src));
      assert.ok(!/ResourceFeasibility/.test(src));
      assert.ok(!/assessPermission/.test(src));
      assert.ok(!/assessDeclaredAuthority/.test(src));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/isPositiveResourceReadiness/.test(src));
      assert.ok(!/required_amount/.test(core));
      assert.ok(!/capacity\s*>=/.test(core));
      assert.ok(!/ANY_BINDING/.test(src));
      assert.ok(!/ALL_BINDING/.test(src));
    });
  });
});
