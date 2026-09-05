/**
 * GROUND-135 — Observation Core LXXXIX / Operational Eligibility
 * RESOURCE_READINESS Raw Evidence Assessment Foundation
 *
 * GROUND-133 bindings + GROUND-134 evaluation instant + ProjectState resource evidence
 * → raw structural evidence assessment (no readiness verdict).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evaluation-instant-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENT_MODEL_LIMITATIONS,
  assessObservationResourceRequirementTemporalRelation,
  buildAttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet,
  isObservationResourceRequirementApplicableAt,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-core.js";
import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "../reality/attention-observation-resource-requirement-types.js";
import type {
  ProjectState,
  RealityEntity,
  ResourceAvailabilityDeclaration,
  ResourceCapacityDeclaration,
  ResourceDeclaration,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_2 = "cand-b";
const NEED_KEY = "need";
const CAP_SET_KEY = "cap-set-key";
const ENTITY_HOLDER = "f2010101-0101-4101-8101-010101010101";
const RD1 = "a1111111-1111-4111-8111-111111111111";
const RD2 = "a2222222-2222-4222-8222-222222222222";
const RD3 = "a3333333-3333-4333-8333-333333333333";
const RD_DANGLING = "d4444444-4444-4444-8444-444444444444";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const CAP_A = "c1111111-1111-4111-8111-111111111111";
const AT = "2026-09-02T12:00:00.000Z";
const FROM = "2026-09-01T00:00:00.000Z";
const UNTIL = "2026-09-03T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

function mockResourceRequirement(
  overrides: Partial<AttentionObservationResourceRequirement> & { key: string }
): AttentionObservationResourceRequirement {
  return {
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: CAP_SET_KEY,
    resource_key: "SENSOR_POWER",
    unit: "WH",
    resource_scope: { kind: "UNSCOPED" },
    required_amount: { kind: "POINT", value: 50 },
    valid_from: null,
    valid_until: null,
    ...overrides,
  };
}

const R1 = mockResourceRequirement({ key: "req-r1" });
const R2 = mockResourceRequirement({
  key: "req-r2",
  resource_key: "NETWORK",
  unit: "MBPS",
});
const R3 = mockResourceRequirement({
  key: "req-r3",
  resource_key: "COMPUTE",
  unit: "GB",
});

function mock132Candidate(
  overrides: Partial<AttentionCandidateObservationResourceRequirementSetAssessment> & {
    candidate_key: string;
  }
): AttentionCandidateObservationResourceRequirementSetAssessment {
  const resource_requirements = overrides.resource_requirements ?? [R1, R2, R3];
  return {
    capability_requirement_assessment: {} as never,
    status:
      overrides.status ??
      "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
    resource_requirements,
    has_explicit_observation_resource_requirement_set: true,
    has_observation_resource_requirements: resource_requirements.length > 0,
    model_limitations: [],
    ...overrides,
  };
}

function mock132Set(options?: {
  candidates?: ReturnType<typeof mock132Candidate>[];
}): AttentionObservationResourceRequirementSetAssessment {
  const candidates = options?.candidates ?? [mock132Candidate({ candidate_key: CAND })];
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: candidates,
    has_explicit_observation_resource_requirement_sets: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
  };
}

function entity(id: string, label: string): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "organization",
    label,
    created_at: TS,
    updated_at: TS,
  };
}

function resourceDecl(
  id: string,
  overrides: Partial<ResourceDeclaration> = {}
): ResourceDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_HOLDER,
    resource_key: "SENSOR_POWER",
    unit: "WH",
    scope: { kind: "UNSCOPED" },
    resource_entity_id: null,
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

function availability(
  id: string,
  resourceId: string,
  status: "AVAILABLE" | "UNAVAILABLE"
): ResourceAvailabilityDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    resource_declaration_id: resourceId,
    status,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
  };
}

function capacity(
  id: string,
  resourceId: string
): ResourceCapacityDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    resource_declaration_id: resourceId,
    capacity: { kind: "POINT", value: 100 },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
  };
}

function mockProjectState(
  overrides: Partial<ProjectState> = {}
): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [entity(ENTITY_HOLDER, "Holder")],
    resource_declarations: [resourceDecl(RD1)],
    resource_availability_declarations: [availability(AVAIL_A, RD1, "AVAILABLE")],
    resource_capacity_declarations: [capacity(CAP_A, RD1)],
    ...overrides,
  };
}

function build133(
  requirementSet = mock132Set(),
  specification: {
    candidate_binding_sets: {
      candidate_key: string;
      bindings: {
        observation_resource_requirement_key: string;
        resource_declaration_id: string;
      }[];
    }[];
  } = {
    candidate_binding_sets: [
      {
        candidate_key: CAND,
        bindings: [
          { observation_resource_requirement_key: R1.key, resource_declaration_id: RD1 },
        ],
      },
    ],
  }
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
    {
      observation_resource_requirement_set: requirementSet,
      specification,
    }
  );
}

function build134(
  bindingSet: ReturnType<typeof build133>,
  evaluationInstants: { candidate_key: string; evaluation_at: string }[] = [
    { candidate_key: CAND, evaluation_at: AT },
  ]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSet(
    {
      resource_readiness_observation_context_binding_set: bindingSet,
      specification: { evaluation_instants: evaluationInstants },
    }
  );
}

function build135(
  projectState: ProjectState,
  bindingSet: ReturnType<typeof build133>,
  instantSet: ReturnType<typeof build134>
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet(
    {
      resource_readiness_observation_context_binding_set: bindingSet,
      resource_readiness_evaluation_instant_set: instantSet,
      project_state: projectState,
    }
  );
}

function pipeline(
  projectState: ProjectState,
  bindingSpec?: Parameters<typeof build133>[1],
  instantSpec?: { candidate_key: string; evaluation_at: string }[]
) {
  const bindingSet = build133(mock132Set(), bindingSpec);
  const instantSet = build134(bindingSet, instantSpec);
  return build135(projectState, bindingSet, instantSet);
}

function assertNoReadinessPolarity(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"RESOURCE_READY"/.test(json));
  assert.ok(!/"RESOURCE_NOT_READY"/.test(json));
  assert.ok(!/"RESOURCE_REQUIREMENT_SATISFIED"/.test(json));
  assert.ok(!/"RESOURCE_REQUIREMENT_UNSATISFIED"/.test(json));
  assert.ok(!/"MATCHES_REQUIREMENT"/.test(json));
}

describe("GROUND-135 RESOURCE_READINESS Raw Evidence Assessment", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENT_MODEL_LIMITATIONS,
      [
        "OBSERVATION_RESOURCE_REQUIREMENT_SATISFACTION_NOT_MODELED",
        "OBSERVATION_RESOURCE_QUANTITY_SUFFICIENCY_NOT_MODELED",
        "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_BEYOND_EXACT_MATCH_NOT_MODELED",
        "OBSERVATION_RESOURCE_SCOPE_SUBSUMPTION_NOT_MODELED",
        "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED",
        "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_MODELED_IN_RAW_READINESS_ASSESSMENT",
        "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_MODELED_IN_RAW_READINESS_ASSESSMENT",
        "OBSERVATION_RESOURCE_PARTIAL_FULFILLMENT_NOT_MODELED",
        "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_NOT_MODELED",
        "EXPLICIT_RESOURCE_READINESS_INTERPRETATION_POLICY_NOT_MODELED",
        "RESOURCE_READINESS_INTERPRETATION_BASIS_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_STATE_NOT_MODELED",
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

  describe("binding evidence assessments", () => {
    it("one binding / declaration FOUND → one raw assessment", () => {
      const set = pipeline(mockProjectState());
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT"
      );
      assert.equal(cand.raw_binding_evidence_assessments.length, 1);
      const raw = cand.raw_binding_evidence_assessments[0]!;
      assert.equal(raw.resource_declaration_lookup_status, "BOUND_RESOURCE_DECLARATION_FOUND");
      assert.equal(raw.resource_key_relation, "RESOURCE_KEY_EXACT_MATCH");
      assert.equal(raw.resource_unit_relation, "RESOURCE_UNIT_EXACT_MATCH");
      assert.equal(raw.resource_scope_relation, "RESOURCE_SCOPE_EXACT_MATCH");
      assert.ok(raw.resource_assessment !== null);
      assert.equal(raw.resource_assessment!.availability.status, "AVAILABLE_DECLARED");
      assert.equal(raw.evaluation_at, AT);
      assertNoReadinessPolarity(set);
    });

    it("one binding / declaration NOT_FOUND → one raw assessment", () => {
      const set = pipeline(mockProjectState(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD_DANGLING,
              },
            ],
          },
        ],
      });
      const raw = set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!;
      assert.equal(raw.resource_declaration_lookup_status, "BOUND_RESOURCE_DECLARATION_NOT_FOUND");
      assert.equal(raw.resource_key_relation, null);
      assert.equal(raw.resource_unit_relation, null);
      assert.equal(raw.resource_scope_relation, null);
      assert.equal(raw.resource_assessment, null);
      assert.equal(set.has_resource_readiness_raw_evidence_assessments, true);
    });

    it("dangling binding not discarded", () => {
      const set = pipeline(mockProjectState(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              { observation_resource_requirement_key: R1.key, resource_declaration_id: RD_DANGLING },
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.raw_binding_evidence_assessments.length, 1);
    });

    it("multiple bindings mixed FOUND and NOT_FOUND", () => {
      const set = pipeline(mockProjectState(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              { observation_resource_requirement_key: R1.key, resource_declaration_id: RD1 },
              { observation_resource_requirement_key: R1.key, resource_declaration_id: RD_DANGLING },
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.raw_binding_evidence_assessments.length, 2);
      const statuses = set
        .candidate_assessments[0]!
        .raw_binding_evidence_assessments.map((r) => r.resource_declaration_lookup_status)
        .sort();
      assert.deepEqual(statuses, [
        "BOUND_RESOURCE_DECLARATION_FOUND",
        "BOUND_RESOURCE_DECLARATION_NOT_FOUND",
      ]);
    });

    it("strict N bindings → N raw assessments", () => {
      const set = pipeline(mockProjectState(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              { observation_resource_requirement_key: R1.key, resource_declaration_id: RD1 },
              { observation_resource_requirement_key: R2.key, resource_declaration_id: RD1 },
              { observation_resource_requirement_key: R3.key, resource_declaration_id: RD_DANGLING },
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.raw_binding_evidence_assessments.length, 3);
    });

    it("all NOT_FOUND still has_resource_readiness_raw_evidence_assessments true", () => {
      const set = pipeline(mockProjectState(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              { observation_resource_requirement_key: R1.key, resource_declaration_id: RD_DANGLING },
              { observation_resource_requirement_key: R2.key, resource_declaration_id: RD2 },
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.has_resource_readiness_raw_evidence_assessments, true);
      assert.equal(set.has_resource_readiness_raw_evidence_assessments, true);
    });
  });

  describe("structural relations", () => {
    it("FOUND + resource-key mismatch preserved", () => {
      const set = pipeline(
        mockProjectState({
          resource_declarations: [
            resourceDecl(RD1, { resource_key: "OTHER_KEY" }),
          ],
        })
      );
      const raw = set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!;
      assert.equal(raw.resource_key_relation, "RESOURCE_KEY_DOES_NOT_EXACT_MATCH");
      assert.equal(raw.resource_declaration_lookup_status, "BOUND_RESOURCE_DECLARATION_FOUND");
    });

    it("FOUND + unit mismatch preserved", () => {
      const set = pipeline(
        mockProjectState({
          resource_declarations: [resourceDecl(RD1, { unit: "KWH" })],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!.resource_unit_relation,
        "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH"
      );
    });

    it("FOUND + scope mismatch preserved", () => {
      const set = pipeline(
        mockProjectState({
          resource_declarations: [
            resourceDecl(RD1, {
              scope: { kind: "ENTITY", entity_id: ENTITY_HOLDER },
            }),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!.resource_scope_relation,
        "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH"
      );
    });
  });

  describe("requirement temporal relation", () => {
    it("APPLIES at evaluation instant", () => {
      const set = pipeline(mockProjectState());
      assert.equal(
        set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!
          .requirement_temporal_relation,
        "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT"
      );
    });

    it("DOES_NOT_APPLY when valid_from after instant", () => {
      const reqSet = mock132Set({
        candidates: [
          mock132Candidate({
            candidate_key: CAND,
            resource_requirements: [
              mockResourceRequirement({
                key: "req-r1",
                valid_from: "2026-09-03T00:00:00.000Z",
              }),
            ],
          }),
        ],
      });
      const bindingSet = build133(reqSet);
      const instantSet = build134(bindingSet);
      const set = build135(mockProjectState(), bindingSet, instantSet);
      assert.equal(
        set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!
          .requirement_temporal_relation,
        "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT"
      );
    });

    it("exclusive upper bound matches GROUND-023/026 (at >= valid_until → does not apply)", () => {
      const req = mockResourceRequirement({
        key: "req-r1",
        valid_from: null,
        valid_until: UNTIL,
      });
      assert.equal(isObservationResourceRequirementApplicableAt(req, AT), true);
      assert.equal(
        isObservationResourceRequirementApplicableAt(req, UNTIL),
        false
      );
      assert.equal(
        assessObservationResourceRequirementTemporalRelation(req, UNTIL),
        "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT"
      );
    });

    it("FOUND + DOES_NOT_APPLY coexist", () => {
      const reqSet = mock132Set({
        candidates: [
          mock132Candidate({
            candidate_key: CAND,
            resource_requirements: [
              mockResourceRequirement({
                key: "req-r1",
                valid_from: "2026-09-03T00:00:00.000Z",
              }),
            ],
          }),
        ],
      });
      const bindingSet = build133(reqSet);
      const instantSet = build134(bindingSet);
      const set = build135(mockProjectState(), bindingSet, instantSet);
      const raw = set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!;
      assert.equal(raw.resource_declaration_lookup_status, "BOUND_RESOURCE_DECLARATION_FOUND");
      assert.equal(
        raw.requirement_temporal_relation,
        "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT"
      );
    });
  });

  describe("nested ResourceAssessment", () => {
    it("AVAILABLE_DECLARED retained without READY", () => {
      const set = pipeline(mockProjectState());
      assert.equal(
        set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!
          .resource_assessment!.availability.status,
        "AVAILABLE_DECLARED"
      );
      assertNoReadinessPolarity(set);
    });

    it("UNAVAILABLE_DECLARED retained", () => {
      const set = pipeline(
        mockProjectState({
          resource_availability_declarations: [
            availability(AVAIL_A, RD1, "UNAVAILABLE"),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!
          .resource_assessment!.availability.status,
        "UNAVAILABLE_DECLARED"
      );
    });

    it("CONTESTED_AVAILABILITY retained", () => {
      const set = pipeline(
        mockProjectState({
          resource_availability_declarations: [
            availability(AVAIL_A, RD1, "AVAILABLE"),
            availability(AVAIL_B, RD1, "UNAVAILABLE"),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!
          .resource_assessment!.availability.status,
        "CONTESTED_AVAILABILITY"
      );
    });

    it("capacity evidence retained without required-amount comparison", () => {
      const set = pipeline(mockProjectState());
      const cap =
        set.candidate_assessments[0]!.raw_binding_evidence_assessments[0]!
          .resource_assessment!.capacity;
      assert.equal(cap.status, "ACTIVE_CAPACITY_DECLARATIONS_PRESENT");
      assert.equal(cap.capacities[0]!.kind, "POINT");
    });
  });

  describe("status propagation / no instant", () => {
    it("bindings present + instant present → RAW_EVIDENCE_ASSESSMENTS_PRESENT", () => {
      const set = pipeline(mockProjectState());
      assert.equal(
        set.candidate_assessments[0]!.status,
        "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT"
      );
    });

    it("bindings present + no instant → no raw assessments", () => {
      const bindingSet = build133();
      const instantSet = build134(bindingSet, []);
      const set = build135(mockProjectState(), bindingSet, instantSet);
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
      );
      assert.equal(set.candidate_assessments[0]!.raw_binding_evidence_assessments.length, 0);
      assert.equal(set.has_resource_readiness_raw_evidence_assessments, false);
    });

    it("no bindings propagates", () => {
      const reqSet = mock132Set();
      const bindingSet =
        buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
          {
            observation_resource_requirement_set: reqSet,
            specification: { candidate_binding_sets: [] },
          }
        );
      const instantSet = build134(bindingSet, []);
      const set = build135(mockProjectState(), bindingSet, instantSet);
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
    });

    it("explicit empty requirements propagates", () => {
      const reqSet = mock132Set({
        candidates: [
          mock132Candidate({
            candidate_key: CAND,
            resource_requirements: [],
            status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
          }),
        ],
      });
      (reqSet.candidate_assessments[0] as { has_observation_resource_requirements: boolean }).has_observation_resource_requirements =
        false;
      const bindingSet = build133(reqSet, { candidate_binding_sets: [] });
      const instantSet = build134(bindingSet, []);
      const set = build135(mockProjectState(), bindingSet, instantSet);
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
      );
    });
  });

  describe("cross-input validation", () => {
    it("stale GROUND-134 vs GROUND-133 rejects", () => {
      const bindingSet = build133();
      const instantSet = build134(bindingSet);
      const staleBindingSet = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD2,
              },
            ],
          },
        ],
      });
      assert.throws(() =>
        build135(mockProjectState(), staleBindingSet, instantSet)
      );
    });

    it("missing candidate counterpart rejects", () => {
      const bindingSet = build133();
      const instantSet = build134(bindingSet);
      instantSet.candidate_assessments = [];
      assert.throws(() => build135(mockProjectState(), bindingSet, instantSet));
    });

    it("extra candidate counterpart rejects", () => {
      const bindingSet = build133();
      const instantSet = build134(bindingSet);
      instantSet.candidate_assessments.push(
        structuredClone(instantSet.candidate_assessments[0]!)
      );
      instantSet.candidate_assessments[1]!.candidate_key = CAND_2;
      assert.throws(() => build135(mockProjectState(), bindingSet, instantSet));
    });

    it("duplicate candidate rejects", () => {
      const bindingSet = build133();
      const instantSet = build134(bindingSet);
      const dupBindingSet = structuredClone(bindingSet);
      dupBindingSet.candidate_assessments.push(
        structuredClone(bindingSet.candidate_assessments[0]!)
      );
      assert.throws(() => build135(mockProjectState(), dupBindingSet, instantSet));
    });
  });

  describe("immutability / determinism", () => {
    it("ProjectState read-only", () => {
      const projectState = mockProjectState();
      const before = structuredClone(projectState);
      const bindingSet = build133();
      const instantSet = build134(bindingSet);
      build135(projectState, bindingSet, instantSet);
      assert.deepEqual(projectState, before);
    });

    it("GROUND-133 / GROUND-134 input immutability", () => {
      const projectState = mockProjectState();
      const bindingSet = build133();
      const instantSet = build134(bindingSet);
      const beforeBinding = structuredClone(bindingSet);
      const beforeInstant = structuredClone(instantSet);
      build135(projectState, bindingSet, instantSet);
      assert.deepEqual(bindingSet, beforeBinding);
      assert.deepEqual(instantSet, beforeInstant);
    });

    it("deterministic repeated output", () => {
      const projectState = mockProjectState();
      const bindingSet = build133();
      const instantSet = build134(bindingSet);
      const a = build135(projectState, bindingSet, instantSet);
      const b = build135(projectState, bindingSet, instantSet);
      assert.deepEqual(a, b);
    });
  });

  describe("static proofs", () => {
    it("uses assessResource only; no reservation/commitment/feasibility/wall-clock", () => {
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/assessResource\(/.test(core));
      assert.ok(/resourceScopesEqual/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/resource_reservation/.test(src));
      assert.ok(!/ResourceReservation/.test(src));
      assert.ok(!/resource_commitment/.test(src));
      assert.ok(!/ResourceCommitment/.test(src));
      assert.ok(!/resource_contention/.test(src));
      assert.ok(!/ResourceContention/.test(src));
      assert.ok(!/ResourceFeasibility/.test(src));
      assert.ok(!/assessPermission/.test(src));
      assert.ok(!/assessDeclaredAuthority/.test(src));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/findDeclaredResources/.test(core));
      assert.ok(!/getApplicableResourcesForHolder/.test(core));
      assert.ok(
        !/buildAttentionObservationResourceRequirementSetAssessment/.test(core)
      );
      assert.ok(
        !/buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment/.test(
          core
        )
      );
    });
  });
});
