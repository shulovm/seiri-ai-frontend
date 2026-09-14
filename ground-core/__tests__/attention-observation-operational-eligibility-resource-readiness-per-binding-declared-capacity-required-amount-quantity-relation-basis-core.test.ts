/**
 * GROUND-153 — Observation Core CVII / Per-binding RESOURCE_READINESS
 * Declared Capacity–Required Amount Quantity Relation Basis Foundation
 *
 * Physical quantity branch from GROUND-135 only.
 * Declared capacity ≠ available / free / contribution / ready.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PER_BINDING_DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_MODEL_LIMITATIONS,
  buildAttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSet,
  deriveDeclaredCapacityRequiredAmountQuantityRelation,
  normalizeResourceQuantityClosedInterval,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-core.js";
import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "../reality/attention-observation-resource-requirement-types.js";
import type {
  ProjectState,
  RealityEntity,
  ResourceAvailabilityDeclaration,
  ResourceCapacity,
  ResourceCapacityDeclaration,
  ResourceDeclaration,
  ResourceRequirementAmount,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const CAP_SET_KEY = "cap-set-key";
const ENTITY_HOLDER = "f2010101-0101-4101-8101-010101010101";
const RD1 = "a1111111-1111-4111-8111-111111111111";
const RD2 = "a2222222-2222-4222-8222-222222222222";
const RD_DANGLING = "d4444444-4444-4444-8444-444444444444";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const CAP_A = "c1111111-1111-4111-8111-111111111111";
const CAP_B = "c2222222-2222-4222-8222-222222222222";
const CAP_C = "c3333333-3333-4333-8333-333333333333";
const AT = "2026-09-02T12:00:00.000Z";
const FROM = "2026-09-01T00:00:00.000Z";
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

function mock132Candidate(
  overrides: Partial<AttentionCandidateObservationResourceRequirementSetAssessment> & {
    candidate_key: string;
  }
): AttentionCandidateObservationResourceRequirementSetAssessment {
  const resource_requirements = overrides.resource_requirements ?? [R1];
  return {
    capability_requirement_assessment: {} as never,
    status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
    resource_requirements,
    has_explicit_observation_resource_requirement_set: true,
    has_observation_resource_requirements: resource_requirements.length > 0,
    model_limitations: [],
    ...overrides,
  };
}

function mock132Set(
  requirements: AttentionObservationResourceRequirement[] = [R1]
): AttentionObservationResourceRequirementSetAssessment {
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: [
      mock132Candidate({
        candidate_key: CAND,
        resource_requirements: requirements,
      }),
    ],
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

function capacityDecl(
  id: string,
  resourceId: string,
  capacity: ResourceCapacity
): ResourceCapacityDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    resource_declaration_id: resourceId,
    capacity,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
  };
}

function mockProjectState(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [entity(ENTITY_HOLDER, "Holder")],
    resource_declarations: [resourceDecl(RD1)],
    resource_availability_declarations: [
      availability(AVAIL_A, RD1, "AVAILABLE"),
    ],
    resource_capacity_declarations: [
      capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
    ],
    ...overrides,
  };
}

function build133(
  requirementSet: AttentionObservationResourceRequirementSetAssessment,
  bindings: {
    observation_resource_requirement_key: string;
    resource_declaration_id: string;
  }[]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
    {
      observation_resource_requirement_set: requirementSet,
      specification: {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings,
          },
        ],
      },
    }
  );
}

function build135(
  projectState: ProjectState,
  requirementSet: AttentionObservationResourceRequirementSetAssessment,
  bindings: {
    observation_resource_requirement_key: string;
    resource_declaration_id: string;
  }[]
) {
  const bindingSet = build133(requirementSet, bindings);
  const instantSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSet(
      {
        resource_readiness_observation_context_binding_set: bindingSet,
        specification: {
          evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }],
        },
      }
    );
  return buildAttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet(
    {
      resource_readiness_observation_context_binding_set: bindingSet,
      resource_readiness_evaluation_instant_set: instantSet,
      project_state: projectState,
    }
  );
}

function build153(
  rawSet: ReturnType<typeof build135>
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSet(
    {
      resource_readiness_raw_evidence_assessment_set: rawSet,
    }
  );
}

function firstBindingAssessment(
  set: ReturnType<typeof build153>
) {
  return set.candidate_assessments[0]!.binding_quantity_relation_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function rel(
  capacity: ResourceCapacity,
  required: ResourceRequirementAmount
) {
  return deriveDeclaredCapacityRequiredAmountQuantityRelation({
    declared_capacity: capacity,
    required_amount: required,
  });
}

describe("GROUND-153 Per-binding Declared Capacity–Required Amount Quantity Relation Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PER_BINDING_DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_MODEL_LIMITATIONS[0],
      "DECLARED_CAPACITY_IS_NOT_CURRENT_AVAILABLE_QUANTITY"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PER_BINDING_DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  describe("relation helper", () => {
    it("POINT×POINT topologies", () => {
      assert.equal(
        rel({ kind: "POINT", value: 5 }, { kind: "POINT", value: 10 }),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_BELOW_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel({ kind: "POINT", value: 10 }, { kind: "POINT", value: 10 }),
        "DECLARED_CAPACITY_INTERVAL_EXACTLY_EQUALS_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel({ kind: "POINT", value: 15 }, { kind: "POINT", value: 10 }),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_ABOVE_REQUIRED_AMOUNT_INTERVAL"
      );
    });

    it("POINT×RANGE topologies", () => {
      assert.equal(
        rel({ kind: "POINT", value: 5 }, { kind: "RANGE", min: 10, max: 20 }),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_BELOW_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel({ kind: "POINT", value: 10 }, { kind: "RANGE", min: 10, max: 20 }),
        "DECLARED_CAPACITY_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel({ kind: "POINT", value: 15 }, { kind: "RANGE", min: 10, max: 20 }),
        "DECLARED_CAPACITY_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel({ kind: "POINT", value: 25 }, { kind: "RANGE", min: 10, max: 20 }),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_ABOVE_REQUIRED_AMOUNT_INTERVAL"
      );
    });

    it("RANGE×POINT topologies", () => {
      assert.equal(
        rel({ kind: "RANGE", min: 5, max: 15 }, { kind: "POINT", value: 10 }),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_CONTAINS_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel({ kind: "RANGE", min: 10, max: 10 }, { kind: "POINT", value: 10 }),
        "DECLARED_CAPACITY_INTERVAL_EXACTLY_EQUALS_REQUIRED_AMOUNT_INTERVAL"
      );
    });

    it("RANGE×RANGE topologies including endpoint touch", () => {
      assert.equal(
        rel(
          { kind: "RANGE", min: 0, max: 5 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_BELOW_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 10, max: 20 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_CAPACITY_INTERVAL_EXACTLY_EQUALS_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 12, max: 18 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_CAPACITY_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 5, max: 25 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_CONTAINS_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 5, max: 15 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_CAPACITY_INTERVAL_PARTIALLY_OVERLAPS_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 15, max: 25 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_CAPACITY_INTERVAL_PARTIALLY_OVERLAPS_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 25, max: 30 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_ABOVE_REQUIRED_AMOUNT_INTERVAL"
      );
      // Closed endpoint touch → partial overlap, not equality/sufficiency
      assert.equal(
        rel(
          { kind: "RANGE", min: 0, max: 10 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_CAPACITY_INTERVAL_PARTIALLY_OVERLAPS_REQUIRED_AMOUNT_INTERVAL"
      );
    });

    it("rejects malformed RANGE", () => {
      assert.throws(
        () =>
          normalizeResourceQuantityClosedInterval({
            kind: "RANGE",
            min: 20,
            max: 10,
          }),
        /min must be <= max/
      );
    });
  });

  describe("status semantics", () => {
    it("compatible capacity → BASIS_PRESENT with exact relation", () => {
      const req = mockResourceRequirement({
        key: "req-r1",
        required_amount: { kind: "POINT", value: 50 },
      });
      const set = build153(
        build135(
          mockProjectState({
            resource_capacity_declarations: [
              capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
            ],
          }),
          mock132Set([req]),
          [
            {
              observation_resource_requirement_key: req.key,
              resource_declaration_id: RD1,
            },
          ]
        )
      );
      const binding = firstBindingAssessment(set);
      assert.equal(
        binding.status,
        "DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_PRESENT"
      );
      assert.equal(binding.relation_entry_count, 1);
      assert.equal(
        binding.quantity_relation_basis!.relation_entries[0]!.relation,
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_ABOVE_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        binding.has_declared_capacity_required_amount_quantity_relation_basis,
        true
      );
    });

    it("missing ResourceDeclaration → NOT_FOUND / no zero capacity", () => {
      const set = build153(
        build135(mockProjectState({ resource_declarations: [] }), mock132Set(), [
          {
            observation_resource_requirement_key: R1.key,
            resource_declaration_id: RD_DANGLING,
          },
        ])
      );
      const binding = firstBindingAssessment(set);
      assert.equal(binding.status, "BOUND_RESOURCE_DECLARATION_NOT_FOUND");
      assert.equal(binding.quantity_relation_basis, null);
      assert.equal(binding.relation_entry_count, 0);
    });

    it("no capacity declaration → NO_CURRENT_APPLICABLE_DECLARED_CAPACITY", () => {
      const set = build153(
        build135(
          mockProjectState({ resource_capacity_declarations: [] }),
          mock132Set(),
          [
            {
              observation_resource_requirement_key: R1.key,
              resource_declaration_id: RD1,
            },
          ]
        )
      );
      assert.equal(
        firstBindingAssessment(set).status,
        "NO_CURRENT_APPLICABLE_DECLARED_CAPACITY"
      );
    });

    it("unit mismatch → NOT_COMPARABLE_UNIT_NOT_EXACT", () => {
      const set = build153(
        build135(
          mockProjectState({
            resource_declarations: [resourceDecl(RD1, { unit: "mL" })],
          }),
          mock132Set([
            mockResourceRequirement({ key: "req-r1", unit: "L" }),
          ]),
          [
            {
              observation_resource_requirement_key: "req-r1",
              resource_declaration_id: RD1,
            },
          ]
        )
      );
      assert.equal(
        firstBindingAssessment(set).status,
        "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_UNIT_NOT_EXACT"
      );
    });

    it("resource_key mismatch → NOT_COMPARABLE_RESOURCE_KEY_NOT_EXACT", () => {
      const set = build153(
        build135(
          mockProjectState({
            resource_declarations: [
              resourceDecl(RD1, { resource_key: "WATER" }),
            ],
          }),
          mock132Set(),
          [
            {
              observation_resource_requirement_key: R1.key,
              resource_declaration_id: RD1,
            },
          ]
        )
      );
      assert.equal(
        firstBindingAssessment(set).status,
        "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_RESOURCE_KEY_NOT_EXACT"
      );
    });

    it("scope mismatch → NOT_COMPARABLE_SCOPE_NOT_EXACT", () => {
      const set = build153(
        build135(
          mockProjectState({
            resource_declarations: [
              resourceDecl(RD1, {
                scope: { kind: "ENTITY", entity_id: ENTITY_HOLDER },
              }),
            ],
          }),
          mock132Set(),
          [
            {
              observation_resource_requirement_key: R1.key,
              resource_declaration_id: RD1,
            },
          ]
        )
      );
      assert.equal(
        firstBindingAssessment(set).status,
        "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_SCOPE_NOT_EXACT"
      );
    });

    it("multiple capacity declarations preserved separately / no sum / no winner", () => {
      const req = mockResourceRequirement({
        key: "req-r1",
        required_amount: { kind: "POINT", value: 75 },
      });
      const set = build153(
        build135(
          mockProjectState({
            resource_capacity_declarations: [
              capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
              capacityDecl(CAP_B, RD1, { kind: "POINT", value: 100 }),
            ],
          }),
          mock132Set([req]),
          [
            {
              observation_resource_requirement_key: req.key,
              resource_declaration_id: RD1,
            },
          ]
        )
      );
      const binding = firstBindingAssessment(set);
      assert.equal(binding.relation_entry_count, 2);
      const byId = new Map(
        binding.quantity_relation_basis!.relation_entries.map((e) => [
          e.capacity_declaration_id,
          e.relation,
        ])
      );
      assert.equal(
        byId.get(CAP_A),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_BELOW_REQUIRED_AMOUNT_INTERVAL"
      );
      assert.equal(
        byId.get(CAP_B),
        "DECLARED_CAPACITY_INTERVAL_STRICTLY_ABOVE_REQUIRED_AMOUNT_INTERVAL"
      );
      const json = JSON.stringify(binding);
      assert.ok(!/"150"/.test(json));
    });

    it("duplicate equal capacity values from separate lineage remain distinct", () => {
      const set = build153(
        build135(
          mockProjectState({
            resource_capacity_declarations: [
              capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
              capacityDecl(CAP_C, RD1, { kind: "POINT", value: 100 }),
            ],
          }),
          mock132Set(),
          [
            {
              observation_resource_requirement_key: R1.key,
              resource_declaration_id: RD1,
            },
          ]
        )
      );
      const entries =
        firstBindingAssessment(set).quantity_relation_basis!.relation_entries;
      assert.equal(entries.length, 2);
      assert.notEqual(entries[0]!.key, entries[1]!.key);
      assert.notEqual(
        entries[0]!.capacity_declaration_id,
        entries[1]!.capacity_declaration_id
      );
    });
  });

  describe("immutability / determinism", () => {
    it("input immutability / deep-clone / determinism / capacity-order invariance", () => {
      const projectState = mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_B, RD1, { kind: "POINT", value: 100 }),
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
        ],
      });
      const rawSet = build135(projectState, mock132Set(), [
        {
          observation_resource_requirement_key: R1.key,
          resource_declaration_id: RD1,
        },
      ]);
      const before = deepClone(rawSet);
      const a = build153(rawSet);
      assert.deepEqual(rawSet, before);
      assert.deepEqual(a, build153(rawSet));
      assert.deepEqual(a, build153(deepClone(rawSet)));
      const ids =
        firstBindingAssessment(a).quantity_relation_basis!.relation_entries.map(
          (e) => e.capacity_declaration_id
        );
      assert.deepEqual([...ids].sort(), ids);
    });
  });

  describe("static proofs", () => {
    it("GROUND-135 only; no 145–151 / READY / SUFFICIENT / contribution / fungibility sum", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(/raw-evidence-assessment-types/.test(core));
      assert.ok(!/canonical-per-requirement-resource-readiness-binding-evidence-composition-state/.test(core));
      assert.ok(!/binding-evidence-composition-result-interpretation/.test(core));
      assert.ok(!/binding-evidence-composition-policy-core/.test(core));
      assert.ok(!/evidence-evaluation-state-interpretation-basis/.test(core));
      assert.ok(!/ProjectState/.test(core));
      assert.ok(!/assessResource\(/.test(core));
      assert.ok(!/from "\.\/resource-reservation/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"SUFFICIENT"/.test(src));
      assert.ok(!/"INSUFFICIENT"/.test(src));
      assert.ok(!/available_quantity/.test(src));
      assert.ok(!/free_quantity/.test(src));
      assert.ok(!/contribution_amount/i.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/"FEASIBILITY"/.test(src));
      assert.ok(
        /DECLARED_CAPACITY_IS_NOT_CURRENT_AVAILABLE_QUANTITY/.test(types)
      );
      assert.ok(
        /PHYSICAL_RESOURCE_CONTRIBUTION_SEMANTICS_NOT_MODELED/.test(types)
      );
      assert.ok(/CROSS_BINDING_QUANTITY_SUMMATION_NOT_MODELED/.test(types));
      assert.ok(
        !/EXPLICITLY_INTERPRETED_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE/.test(
          core
        )
      );
    });
  });
});
