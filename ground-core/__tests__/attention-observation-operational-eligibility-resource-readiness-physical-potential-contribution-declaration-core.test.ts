/**
 * GROUND-155 — Observation Core CIX / Explicit Per-binding RESOURCE_READINESS
 * Physical Potential Contribution Declaration Foundation
 *
 * Explicit declaration only — never derived from capacity.
 * declared potential ≠ available / free / effective / ready / verified.
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
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_MODEL_LIMITATIONS,
  assertDeclaredPotentialContributionQuantity,
  attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment,
  buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-core.js";
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
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const CAP_A = "c1111111-1111-4111-8111-111111111111";
const CAP_B = "c2222222-2222-4222-8222-222222222222";
const AT = "2026-09-02T12:00:00.000Z";
const AT2 = "2026-09-03T12:00:00.000Z";
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
const R2 = mockResourceRequirement({
  key: "req-r2",
  required_amount: { kind: "POINT", value: 80 },
});

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

function build153(options?: {
  projectState?: ProjectState;
  requirements?: AttentionObservationResourceRequirement[];
  bindings?: {
    observation_resource_requirement_key: string;
    resource_declaration_id: string;
  }[];
  evaluation_at?: string;
}) {
  const requirements = options?.requirements ?? [R1];
  const bindings = options?.bindings ?? [
    {
      observation_resource_requirement_key: requirements[0]!.key,
      resource_declaration_id: RD1,
    },
  ];
  const evaluation_at = options?.evaluation_at ?? AT;
  const requirementSet = mock132Set(requirements);
  const bindingSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
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
  const instantSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSet(
      {
        resource_readiness_observation_context_binding_set: bindingSet,
        specification: {
          evaluation_instants: [{ candidate_key: CAND, evaluation_at }],
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

function firstBindingContextKey(
  quantitySet: ReturnType<typeof build153>
): string {
  const binding =
    quantitySet.candidate_assessments[0]!
      .binding_quantity_relation_assessments[0]!;
  return attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
    binding
  );
}

function build155(
  quantitySet: ReturnType<typeof build153>,
  declarations: {
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key: string;
    declared_potential_contribution_quantity: ResourceRequirementAmount;
  }[]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet(
    {
      resource_readiness_declared_capacity_required_amount_quantity_relation_set:
        quantitySet,
      specification: { declarations },
    }
  );
}

function firstBindingAssessment(set: ReturnType<typeof build155>) {
  return set.candidate_assessments[0]!
    .binding_potential_contribution_declaration_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-155 Explicit Per-binding Physical Potential Contribution Declaration", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_MODEL_LIMITATIONS[0],
      "DECLARED_POTENTIAL_CONTRIBUTION_IS_NOT_VERIFIED_PHYSICAL_CONTRIBUTION"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("no declaration → NO_DECLARATION / null / false (not zero)", () => {
    const quantitySet = build153();
    const set = build155(quantitySet, []);
    const binding = firstBindingAssessment(set);
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION"
    );
    assert.equal(binding.declaration, null);
    assert.equal(
      binding.has_explicit_physical_potential_contribution_declaration,
      false
    );
    assert.equal(set.has_explicit_physical_potential_contribution_declarations, false);
  });

  it("explicit POINT declaration present", () => {
    const quantitySet = build153();
    const contextKey = firstBindingContextKey(quantitySet);
    const set = build155(quantitySet, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          contextKey,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 60,
        },
      },
    ]);
    const binding = firstBindingAssessment(set);
    assert.equal(
      binding.status,
      "EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT"
    );
    assert.deepEqual(
      binding.declaration!.declared_potential_contribution_quantity,
      { kind: "POINT", value: 60 }
    );
    assert.equal(
      binding.has_explicit_physical_potential_contribution_declaration,
      true
    );
  });

  it("explicit RANGE declaration present without RANGE interpretation", () => {
    const quantitySet = build153();
    const contextKey = firstBindingContextKey(quantitySet);
    const set = build155(quantitySet, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          contextKey,
        declared_potential_contribution_quantity: {
          kind: "RANGE",
          min: 10,
          max: 40,
        },
      },
    ]);
    assert.deepEqual(
      firstBindingAssessment(set).declaration!
        .declared_potential_contribution_quantity,
      { kind: "RANGE", min: 10, max: 40 }
    );
  });

  it("duplicate identical declarations normalize", () => {
    const quantitySet = build153();
    const contextKey = firstBindingContextKey(quantitySet);
    const set = build155(quantitySet, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          contextKey,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 60,
        },
      },
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          contextKey,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 60,
        },
      },
    ]);
    assert.equal(
      firstBindingAssessment(set).status,
      "EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT"
    );
  });

  it("conflicting declarations reject", () => {
    const quantitySet = build153();
    const contextKey = firstBindingContextKey(quantitySet);
    assert.throws(
      () =>
        build155(quantitySet, [
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              contextKey,
            declared_potential_contribution_quantity: {
              kind: "POINT",
              value: 60,
            },
          },
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              contextKey,
            declared_potential_contribution_quantity: {
              kind: "POINT",
              value: 70,
            },
          },
        ]),
      /conflicting declared potential contribution/
    );
  });

  it("unknown / stale target rejects", () => {
    const quantitySet = build153();
    assert.throws(
      () =>
        build155(quantitySet, [
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              "stale-context-key",
            declared_potential_contribution_quantity: {
              kind: "POINT",
              value: 60,
            },
          },
        ]),
      /unknown or stale/
    );
  });

  it("declaration may exist without GROUND-153 capacity Basis", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [],
      }),
    });
    const binding153 =
      quantitySet.candidate_assessments[0]!
        .binding_quantity_relation_assessments[0]!;
    assert.equal(
      binding153.status,
      "NO_CURRENT_APPLICABLE_DECLARED_CAPACITY"
    );
    assert.equal(binding153.quantity_relation_basis, null);
    const contextKey =
      attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
        binding153
      );
    const set = build155(quantitySet, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          contextKey,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 25,
        },
      },
    ]);
    assert.equal(
      firstBindingAssessment(set).status,
      "EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT"
    );
  });

  it("capacity below contribution does not reject", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 10 }),
        ],
      }),
    });
    const contextKey = firstBindingContextKey(quantitySet);
    const set = build155(quantitySet, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          contextKey,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 999,
        },
      },
    ]);
    assert.deepEqual(
      firstBindingAssessment(set).declaration!
        .declared_potential_contribution_quantity,
      { kind: "POINT", value: 999 }
    );
  });

  it("contribution above required_amount does not reject", () => {
    const quantitySet = build153();
    const contextKey = firstBindingContextKey(quantitySet);
    const set = build155(quantitySet, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          contextKey,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 500,
        },
      },
    ]);
    assert.deepEqual(
      firstBindingAssessment(set).declaration!
        .declared_potential_contribution_quantity,
      { kind: "POINT", value: 500 }
    );
  });

  it("no capacity auto-fill when capacity exists but no specification", () => {
    const quantitySet = build153();
    assert.equal(
      quantitySet.candidate_assessments[0]!
        .binding_quantity_relation_assessments[0]!
        .has_declared_capacity_required_amount_quantity_relation_basis,
      true
    );
    const set = build155(quantitySet, []);
    assert.equal(
      firstBindingAssessment(set).status,
      "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION"
    );
  });

  it("same ResourceDeclaration / different Requirements are independent", () => {
    const quantitySet = build153({
      requirements: [R1, R2],
      bindings: [
        {
          observation_resource_requirement_key: R1.key,
          resource_declaration_id: RD1,
        },
        {
          observation_resource_requirement_key: R2.key,
          resource_declaration_id: RD1,
        },
      ],
    });
    const bindings =
      quantitySet.candidate_assessments[0]!
        .binding_quantity_relation_assessments;
    assert.equal(bindings.length, 2);
    const key1 =
      attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
        bindings[0]!
      );
    const key2 =
      attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
        bindings[1]!
      );
    assert.notEqual(key1, key2);
    const set = build155(quantitySet, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          key1,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 20,
        },
      },
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          key2,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 80,
        },
      },
    ]);
    const assessments =
      set.candidate_assessments[0]!
        .binding_potential_contribution_declaration_assessments;
    assert.deepEqual(
      assessments[0]!.declaration!.declared_potential_contribution_quantity,
      { kind: "POINT", value: 20 }
    );
    assert.deepEqual(
      assessments[1]!.declaration!.declared_potential_contribution_quantity,
      { kind: "POINT", value: 80 }
    );
  });

  it("same Binding / different evaluation instants are independent", () => {
    const setAt1 = build153({ evaluation_at: AT });
    const setAt2 = build153({ evaluation_at: AT2 });
    const key1 = firstBindingContextKey(setAt1);
    const key2 = firstBindingContextKey(setAt2);
    assert.notEqual(key1, key2);
    const decl1 = build155(setAt1, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          key1,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 11,
        },
      },
    ]);
    assert.throws(
      () =>
        build155(setAt2, [
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              key1,
            declared_potential_contribution_quantity: {
              kind: "POINT",
              value: 11,
            },
          },
        ]),
      /unknown or stale/
    );
    assert.equal(
      firstBindingAssessment(decl1).declaration!.evaluation_at,
      AT
    );
  });

  it("same Requirement / different Bindings are independent", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_declarations: [resourceDecl(RD1), resourceDecl(RD2)],
        resource_availability_declarations: [
          availability(AVAIL_A, RD1, "AVAILABLE"),
          availability(AVAIL_B, RD2, "AVAILABLE"),
        ],
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
          capacityDecl(CAP_B, RD2, { kind: "POINT", value: 100 }),
        ],
      }),
      bindings: [
        {
          observation_resource_requirement_key: R1.key,
          resource_declaration_id: RD1,
        },
        {
          observation_resource_requirement_key: R1.key,
          resource_declaration_id: RD2,
        },
      ],
    });
    const bindings =
      quantitySet.candidate_assessments[0]!
        .binding_quantity_relation_assessments;
    const key1 =
      attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
        bindings[0]!
      );
    const key2 =
      attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
        bindings[1]!
      );
    const set = build155(quantitySet, [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          key1,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 30,
        },
      },
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          key2,
        declared_potential_contribution_quantity: {
          kind: "POINT",
          value: 40,
        },
      },
    ]);
    const assessments =
      set.candidate_assessments[0]!
        .binding_potential_contribution_declaration_assessments;
    assert.equal(assessments[0]!.resource_declaration_id, RD1);
    assert.equal(assessments[1]!.resource_declaration_id, RD2);
    assert.deepEqual(
      assessments[0]!.declaration!.declared_potential_contribution_quantity,
      { kind: "POINT", value: 30 }
    );
    assert.deepEqual(
      assessments[1]!.declaration!.declared_potential_contribution_quantity,
      { kind: "POINT", value: 40 }
    );
  });

  it("explicit zero rejected by ResourceRequirementAmount positivity", () => {
    assert.throws(
      () =>
        assertDeclaredPotentialContributionQuantity({
          kind: "POINT",
          value: 0,
        }),
      /greater than 0/
    );
  });

  it("POINT 10 and RANGE [10,10] remain distinct (no collapse)", () => {
    const quantitySet = build153();
    const contextKey = firstBindingContextKey(quantitySet);
    assert.throws(
      () =>
        build155(quantitySet, [
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              contextKey,
            declared_potential_contribution_quantity: {
              kind: "POINT",
              value: 10,
            },
          },
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              contextKey,
            declared_potential_contribution_quantity: {
              kind: "RANGE",
              min: 10,
              max: 10,
            },
          },
        ]),
      /conflicting/
    );
  });

  it("input immutability / deep-clone / ordering invariance", () => {
    const quantitySet = build153();
    const contextKey = firstBindingContextKey(quantitySet);
    const declarations = [
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          contextKey,
        declared_potential_contribution_quantity: {
          kind: "POINT" as const,
          value: 60,
        },
      },
    ];
    const beforeQuantity = deepClone(quantitySet);
    const beforeSpec = deepClone({ declarations });
    const a = build155(quantitySet, declarations);
    assert.deepEqual(quantitySet, beforeQuantity);
    assert.deepEqual({ declarations }, beforeSpec);
    assert.deepEqual(a, build155(quantitySet, declarations));
    assert.deepEqual(
      a,
      build155(deepClone(quantitySet), deepClone(declarations))
    );
    assert.deepEqual(
      a,
      build155(quantitySet, [...declarations].reverse())
    );
  });

  describe("static proofs", () => {
    it("no capacity derivation / free / ready / 141–151 / Reservation / fungibility", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /per-binding-declared-capacity-required-amount-quantity-relation-basis/.test(
          core
        )
      );
      assert.ok(!/canonical-per-requirement-resource-readiness-binding-evidence-composition-state/.test(core));
      assert.ok(!/canonical-per-binding-resource-readiness-evidence-state/.test(core));
      assert.ok(!/raw-evidence-assessment-core/.test(core));
      assert.ok(!/ProjectState/.test(core));
      assert.ok(!/resource-reservation/.test(core));
      assert.ok(!/assessResource\(/.test(core));
      assert.ok(!/Math\.min/.test(core));
      assert.ok(!/min\(capacity,\s*required_amount\)/.test(core));
      assert.ok(!/\[0,\s*capacity\]/.test(src));
      assert.ok(!/\[0,\s*C\]/.test(src));
      assert.ok(!/available_amount/.test(src));
      assert.ok(!/free_quantity/.test(src));
      assert.ok(!/effective_amount/.test(src));
      assert.ok(!/contribution_amount/.test(src));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"SUFFICIENT"/.test(src));
      assert.ok(!/"INSUFFICIENT"/.test(src));
      assert.ok(!/"ELIGIBLE"/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/"FEASIBILITY"/.test(src));
      assert.ok(!/CONTRIBUTION_WITHIN_CAPACITY/.test(src));
      assert.ok(!/CONTRIBUTION_EXCEEDS_CAPACITY/.test(src));
      assert.ok(
        /DECLARED_POTENTIAL_CONTRIBUTION_IS_NOT_VERIFIED_PHYSICAL_CONTRIBUTION/.test(
          types
        )
      );
      assert.ok(
        /DECLARED_CAPACITY_TO_POTENTIAL_CONTRIBUTION_CONSISTENCY_NOT_MODELED/.test(
          types
        )
      );
      assert.ok(/declared_potential_contribution_quantity/.test(types));
      assert.ok(
        !/EXPLICITLY_INTERPRETED_RESOURCE_READINESS/.test(core)
      );
    });
  });
});
