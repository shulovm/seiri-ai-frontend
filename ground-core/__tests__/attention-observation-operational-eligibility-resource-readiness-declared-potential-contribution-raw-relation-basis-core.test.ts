/**
 * GROUND-157 — Observation Core CXI / Declared Potential Contribution
 * Raw Capacity & Required-Amount Relation Basis Foundation
 *
 * Raw topology only — never consistency / sufficiency / ready / free.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-core.js";
import {
  attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment,
  buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_MODEL_LIMITATIONS,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSet,
  deriveDeclaredPotentialContributionRawQuantityRelation,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-core.js";
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
    required_amount: { kind: "POINT", value: 100 },
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
  resourceId: string
): ResourceAvailabilityDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    resource_declaration_id: resourceId,
    status: "AVAILABLE",
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
    resource_availability_declarations: [availability(AVAIL_A, RD1)],
    resource_capacity_declarations: [
      capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
    ],
    ...overrides,
  };
}

function build153(options?: {
  projectState?: ProjectState;
  requirements?: AttentionObservationResourceRequirement[];
}) {
  const requirements = options?.requirements ?? [R1];
  const requirementSet = mock132Set(requirements);
  const bindingSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
      {
        observation_resource_requirement_set: requirementSet,
        specification: {
          candidate_binding_sets: [
            {
              candidate_key: CAND,
              bindings: [
                {
                  observation_resource_requirement_key: requirements[0]!.key,
                  resource_declaration_id: RD1,
                },
              ],
            },
          ],
        },
      }
    );
  const instantSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSet(
      {
        resource_readiness_observation_context_binding_set: bindingSet,
        specification: {
          evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }],
        },
      }
    );
  const rawSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet(
      {
        resource_readiness_observation_context_binding_set: bindingSet,
        resource_readiness_evaluation_instant_set: instantSet,
        project_state: options?.projectState ?? mockProjectState(),
      }
    );
  return buildAttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSet(
    {
      resource_readiness_raw_evidence_assessment_set: rawSet,
    }
  );
}

function firstContextKey(quantitySet: ReturnType<typeof build153>): string {
  return attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
    quantitySet.candidate_assessments[0]!
      .binding_quantity_relation_assessments[0]!
  );
}

function build155(
  quantitySet: ReturnType<typeof build153>,
  quantity: ResourceRequirementAmount | null
) {
  const declarations =
    quantity === null
      ? []
      : [
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              firstContextKey(quantitySet),
            declared_potential_contribution_quantity: quantity,
          },
        ];
  return buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet(
    {
      resource_readiness_declared_capacity_required_amount_quantity_relation_set:
        quantitySet,
      specification: { declarations },
    }
  );
}

function build157(
  quantitySet: ReturnType<typeof build153>,
  contributionSet: ReturnType<typeof build155>
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSet(
    {
      resource_readiness_declared_capacity_required_amount_quantity_relation_set:
        quantitySet,
      resource_readiness_physical_potential_contribution_declaration_set:
        contributionSet,
    }
  );
}

function firstBinding(set: ReturnType<typeof build157>) {
  return set.candidate_assessments[0]!.binding_raw_relation_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function rel(
  contribution: ResourceRequirementAmount,
  reference: ResourceRequirementAmount | ResourceCapacity
) {
  return deriveDeclaredPotentialContributionRawQuantityRelation({
    contribution,
    reference,
  });
}

describe("GROUND-157 Declared Potential Contribution Raw Relation Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_MODEL_LIMITATIONS[0],
      "DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_IS_NOT_CONSISTENCY_VERDICT"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  describe("relation helper", () => {
    it("POINT×POINT required-axis topologies", () => {
      assert.equal(
        rel({ kind: "POINT", value: 50 }, { kind: "POINT", value: 100 }),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL"
      );
      assert.equal(
        rel({ kind: "POINT", value: 100 }, { kind: "POINT", value: 100 }),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL"
      );
      assert.equal(
        rel({ kind: "POINT", value: 150 }, { kind: "POINT", value: 100 }),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL"
      );
    });

    it("RANGE topologies including endpoint touch", () => {
      assert.equal(
        rel(
          { kind: "RANGE", min: 0, max: 5 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 10, max: 20 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 12, max: 18 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REFERENCE_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 5, max: 25 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_CONTAINS_REFERENCE_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 5, max: 15 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_PARTIALLY_OVERLAPS_REFERENCE_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 25, max: 30 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL"
      );
      assert.equal(
        rel(
          { kind: "RANGE", min: 0, max: 10 },
          { kind: "RANGE", min: 10, max: 20 }
        ),
        "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_PARTIALLY_OVERLAPS_REFERENCE_INTERVAL"
      );
    });
  });

  it("no declaration → NO_DECLARATION / null basis", () => {
    const quantitySet = build153();
    const set = build157(quantitySet, build155(quantitySet, null));
    const binding = firstBinding(set);
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION"
    );
    assert.equal(binding.raw_relation_basis, null);
    assert.equal(
      binding.has_declared_potential_contribution_raw_relation_basis,
      false
    );
  });

  it("POINT contribution vs required POINT axes", () => {
    const quantitySet = build153({
      requirements: [
        mockResourceRequirement({
          key: "req-r1",
          required_amount: { kind: "POINT", value: 100 },
        }),
      ],
    });
    const set = build157(
      quantitySet,
      build155(quantitySet, { kind: "POINT", value: 50 })
    );
    const basis = firstBinding(set).raw_relation_basis!;
    assert.equal(
      basis.contribution_required_amount_relation.relation,
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL"
    );
    assert.equal(
      build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 100 }))
        .candidate_assessments[0]!.binding_raw_relation_assessments[0]!
        .raw_relation_basis!.contribution_required_amount_relation.relation,
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL"
    );
    assert.equal(
      build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 150 }))
        .candidate_assessments[0]!.binding_raw_relation_assessments[0]!
        .raw_relation_basis!.contribution_required_amount_relation.relation,
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL"
    );
  });

  it("multiple capacities produce independent raw relations / no winner", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
          capacityDecl(CAP_B, RD1, { kind: "POINT", value: 100 }),
          capacityDecl(CAP_C, RD1, { kind: "POINT", value: 200 }),
        ],
      }),
    });
    const set = build157(
      quantitySet,
      build155(quantitySet, { kind: "POINT", value: 80 })
    );
    const entries =
      firstBinding(set).raw_relation_basis!.contribution_capacity_relation_entries;
    assert.equal(entries.length, 3);
    const byId = new Map(
      entries.map((entry) => [entry.capacity_declaration_id, entry.relation])
    );
    assert.equal(
      byId.get(CAP_A),
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL"
    );
    assert.equal(
      byId.get(CAP_B),
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL"
    );
    assert.equal(
      byId.get(CAP_C),
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL"
    );
    assert.deepEqual(
      entries.map((entry) => entry.capacity_declaration_id),
      [...entries.map((entry) => entry.capacity_declaration_id)].sort()
    );
  });

  it("equal capacity values from distinct lineage remain separate", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
          capacityDecl(CAP_C, RD1, { kind: "POINT", value: 100 }),
        ],
      }),
    });
    const entries = firstBinding(
      build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 80 }))
    ).raw_relation_basis!.contribution_capacity_relation_entries;
    assert.equal(entries.length, 2);
    assert.notEqual(entries[0]!.key, entries[1]!.key);
  });

  it("no capacity Basis → required relation exists / capacity entries empty", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [],
      }),
    });
    assert.equal(
      quantitySet.candidate_assessments[0]!
        .binding_quantity_relation_assessments[0]!.status,
      "NO_CURRENT_APPLICABLE_DECLARED_CAPACITY"
    );
    const binding = firstBinding(
      build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 80 }))
    );
    assert.equal(
      binding.status,
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_PRESENT"
    );
    assert.ok(binding.raw_relation_basis);
    assert.equal(binding.capacity_relation_entry_count, 0);
    assert.equal(binding.has_capacity_relation_entries, false);
    assert.equal(
      binding.raw_relation_basis!.contribution_required_amount_relation.relation,
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL"
    );
  });

  it("contribution > capacity is raw ABOVE only / no invalidation", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
        ],
      }),
    });
    const contributionSet = build155(quantitySet, {
      kind: "POINT",
      value: 120,
    });
    const before = deepClone(contributionSet);
    const binding = firstBinding(build157(quantitySet, contributionSet));
    assert.equal(
      binding.raw_relation_basis!.contribution_capacity_relation_entries[0]!
        .relation,
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL"
    );
    assert.deepEqual(contributionSet, before);
    assert.deepEqual(
      binding.physical_potential_contribution_declaration_assessment.declaration!
        .declared_potential_contribution_quantity,
      { kind: "POINT", value: 120 }
    );
  });

  it("contribution == / < / > required produce no sufficiency verdicts", () => {
    const quantitySet = build153();
    const equal = firstBinding(
      build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 100 }))
    );
    const below = firstBinding(
      build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 50 }))
    );
    const above = firstBinding(
      build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 150 }))
    );
    assert.equal(
      equal.raw_relation_basis!.contribution_required_amount_relation.relation,
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL"
    );
    assert.equal(
      below.raw_relation_basis!.contribution_required_amount_relation.relation,
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL"
    );
    assert.equal(
      above.raw_relation_basis!.contribution_required_amount_relation.relation,
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL"
    );
    for (const assessment of [equal, below, above]) {
      const json = JSON.stringify(assessment);
      assert.ok(!/"SUFFICIENT"/.test(json));
      assert.ok(!/"INSUFFICIENT"/.test(json));
      assert.ok(!/"SATISFIED"/.test(json));
      assert.ok(!/"CONSISTENT"/.test(json));
      assert.ok(!/"INCONSISTENT"/.test(json));
    }
  });

  it("input immutability / deep-clone / determinism", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, {
      kind: "POINT",
      value: 80,
    });
    const beforeQ = deepClone(quantitySet);
    const beforeC = deepClone(contributionSet);
    const a = build157(quantitySet, contributionSet);
    assert.deepEqual(quantitySet, beforeQ);
    assert.deepEqual(contributionSet, beforeC);
    assert.deepEqual(a, build157(quantitySet, contributionSet));
    assert.deepEqual(
      a,
      build157(deepClone(quantitySet), deepClone(contributionSet))
    );
  });

  describe("static proofs", () => {
    it("153+155 only; no consistency/sufficiency/Reservation/141–151", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(/quantity-relation-basis-core/.test(core));
      assert.ok(/physical-potential-contribution-declaration/.test(core));
      assert.ok(!/canonical-per-requirement-resource-readiness-binding-evidence-composition-state/.test(core));
      assert.ok(!/canonical-per-binding-resource-readiness-evidence-state/.test(core));
      assert.ok(!/ProjectState/.test(core));
      assert.ok(!/resource-reservation/.test(core));
      assert.ok(!/assessResource\(/.test(core));
      assert.ok(!/"CONSISTENT"/.test(src));
      assert.ok(!/"INCONSISTENT"/.test(src));
      assert.ok(!/"SUFFICIENT"/.test(src));
      assert.ok(!/"INSUFFICIENT"/.test(src));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/free_quantity/.test(src));
      assert.ok(!/effective_potential/.test(src));
      assert.ok(!/available_amount/.test(src));
      assert.ok(!/Math\.min/.test(core));
      assert.ok(
        /DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_IS_NOT_CONSISTENCY_VERDICT/.test(
          types
        )
      );
      assert.ok(
        /CONTRIBUTION_CAPACITY_CONSISTENCY_INTERPRETATION_POLICY_NOT_MODELED/.test(
          types
        )
      );
    });
  });
});
