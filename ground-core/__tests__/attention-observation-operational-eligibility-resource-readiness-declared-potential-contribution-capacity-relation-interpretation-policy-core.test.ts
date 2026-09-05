/**
 * GROUND-159 — Observation Core CXIII / Explicit Declared Potential Contribution
 * Capacity-Relation Interpretation Policy Foundation
 *
 * Policy declaration only over stable GROUND-155 Binding context.
 * No current GROUND-157 relation lookup. No built-in polarity.
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
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingKey,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySet,
  buildCanonicalDeclaredPotentialContributionCapacityRelationInterpretationMappingSetKey,
  canonicalizeDeclaredPotentialContributionCapacityRelationInterpretationMappings,
  EMPTY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_SET,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-policy-core.js";
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
const CAND2 = "cand-b";
const NEED_KEY = "need";
const CAP_SET_KEY = "cap-set-key";
const ENTITY_HOLDER = "f2010101-0101-4101-8101-010101010101";
const RD1 = "a1111111-1111-4111-8111-111111111111";
const RD2 = "a2222222-2222-4222-8222-222222222222";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const CAP_A = "c1111111-1111-4111-8111-111111111111";
const CAP_B = "c2222222-2222-4222-8222-222222222222";
const AT = "2026-09-02T12:00:00.000Z";
const AT2 = "2026-09-03T12:00:00.000Z";
const FROM = "2026-09-01T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

const SUPPORTS =
  "INTERPRET_AS_SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY" as const;
const CONTRADICTS =
  "INTERPRET_AS_CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY" as const;

const BELOW =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL" as const;
const EQUALS =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL" as const;
const SUBINTERVAL =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REFERENCE_INTERVAL" as const;
const CONTAINS =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_CONTAINS_REFERENCE_INTERVAL" as const;
const OVERLAPS =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_PARTIALLY_OVERLAPS_REFERENCE_INTERVAL" as const;
const ABOVE =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL" as const;

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
  candidate_key: CAND2,
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
  requirements: AttentionObservationResourceRequirement[] = [R1],
  candidateKey = CAND
): AttentionObservationResourceRequirementSetAssessment {
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: [
      mock132Candidate({
        candidate_key: candidateKey,
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
  candidateKey?: string;
  bindings?: {
    observation_resource_requirement_key: string;
    resource_declaration_id: string;
  }[];
  evaluation_at?: string;
}) {
  const candidateKey = options?.candidateKey ?? CAND;
  const requirements = options?.requirements ?? [R1];
  const bindings = options?.bindings ?? [
    {
      observation_resource_requirement_key: requirements[0]!.key,
      resource_declaration_id: RD1,
    },
  ];
  const evaluation_at = options?.evaluation_at ?? AT;
  const requirementSet = mock132Set(requirements, candidateKey);
  const bindingSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
      {
        observation_resource_requirement_set: requirementSet,
        specification: {
          candidate_binding_sets: [
            {
              candidate_key: candidateKey,
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
          evaluation_instants: [{ candidate_key: candidateKey, evaluation_at }],
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

function firstBinding133Key(quantitySet: ReturnType<typeof build153>): string {
  return quantitySet.candidate_assessments[0]!
    .binding_quantity_relation_assessments[0]!
    .resource_readiness_observation_context_binding_key;
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
  }[] = []
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet(
    {
      resource_readiness_declared_capacity_required_amount_quantity_relation_set:
        quantitySet,
      specification: { declarations },
    }
  );
}

function build159(
  declarationSet: ReturnType<typeof build155>,
  policies: {
    resource_readiness_observation_context_binding_key: string;
    mappings: {
      raw_relation:
        | typeof BELOW
        | typeof EQUALS
        | typeof SUBINTERVAL
        | typeof CONTAINS
        | typeof OVERLAPS
        | typeof ABOVE;
      interpretation: typeof SUPPORTS | typeof CONTRADICTS;
    }[];
  }[]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySet(
    {
      resource_readiness_physical_potential_contribution_declaration_set:
        declarationSet,
      specification: { policies },
    }
  );
}

function firstPolicyAssessment(set: ReturnType<typeof build159>) {
  return set.candidate_assessments[0]!
    .binding_interpretation_policy_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-159 Explicit Declared Potential Contribution Capacity-Relation Interpretation Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
      "CURRENT_CAPACITY_RELATION_INTERPRETATION_NOT_APPLIED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("no Policy → NO_POLICY / null / false", () => {
    const declarationSet = build155(build153(), []);
    const set = build159(declarationSet, []);
    const binding = firstPolicyAssessment(set);
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED"
    );
    assert.equal(binding.interpretation_policy, null);
    assert.equal(binding.has_explicit_capacity_relation_interpretation_policy, false);
    assert.equal(set.has_explicit_capacity_relation_interpretation_policies, false);
  });

  it("explicit empty Policy → POLICY_PRESENT / [] / true", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const declarationSet = build155(quantitySet, []);
    const set = build159(declarationSet, [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [],
      },
    ]);
    const binding = firstPolicyAssessment(set);
    assert.equal(
      binding.status,
      "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_PRESENT"
    );
    assert.ok(binding.interpretation_policy !== null);
    assert.deepEqual(binding.interpretation_policy!.mappings, []);
    assert.equal(binding.has_explicit_capacity_relation_interpretation_policy, true);
    assert.ok(
      binding.interpretation_policy!.key.includes(
        EMPTY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_SET
      )
    );
  });

  it("explicit empty != absence", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const declarationSet = build155(quantitySet, []);
    const absent = firstPolicyAssessment(build159(declarationSet, []));
    const empty = firstPolicyAssessment(
      build159(declarationSet, [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          mappings: [],
        },
      ])
    );
    assert.notEqual(absent.status, empty.status);
    assert.equal(absent.interpretation_policy, null);
    assert.ok(empty.interpretation_policy !== null);
  });

  it("partial Policy valid (STRICTLY_ABOVE → CONTRADICTS)", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const set = build159(build155(quantitySet, []), [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
      },
    ]);
    const policy = firstPolicyAssessment(set).interpretation_policy!;
    assert.equal(policy.mappings.length, 1);
    assert.equal(policy.mappings[0]!.raw_relation, ABOVE);
    assert.equal(policy.mappings[0]!.interpretation, CONTRADICTS);
    assert.equal(policy.relation_axis, "DECLARED_CAPACITY");
  });

  it("conventional-looking mappings valid only because explicit", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const set = build159(build155(quantitySet, []), [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [
          { raw_relation: ABOVE, interpretation: CONTRADICTS },
          { raw_relation: EQUALS, interpretation: SUPPORTS },
        ],
      },
    ]);
    assert.equal(
      firstPolicyAssessment(set).interpretation_policy!.mappings.length,
      2
    );
  });

  it("unusual mappings legal", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const set = build159(build155(quantitySet, []), [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [
          { raw_relation: ABOVE, interpretation: SUPPORTS },
          { raw_relation: EQUALS, interpretation: CONTRADICTS },
          { raw_relation: BELOW, interpretation: CONTRADICTS },
        ],
      },
    ]);
    const policy = firstPolicyAssessment(set).interpretation_policy!;
    assert.equal(
      policy.mappings.find((m) => m.raw_relation === ABOVE)!.interpretation,
      SUPPORTS
    );
    assert.equal(
      policy.mappings.find((m) => m.raw_relation === EQUALS)!.interpretation,
      CONTRADICTS
    );
  });

  it("same interpretation for multiple relations valid", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const set = build159(build155(quantitySet, []), [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [
          { raw_relation: BELOW, interpretation: SUPPORTS },
          { raw_relation: EQUALS, interpretation: SUPPORTS },
          { raw_relation: SUBINTERVAL, interpretation: SUPPORTS },
        ],
      },
    ]);
    assert.equal(
      firstPolicyAssessment(set).interpretation_policy!.mappings.length,
      3
    );
  });

  it("duplicate identical mapping normalizes", () => {
    const mappings =
      canonicalizeDeclaredPotentialContributionCapacityRelationInterpretationMappings(
        [
          { raw_relation: ABOVE, interpretation: CONTRADICTS },
          { raw_relation: ABOVE, interpretation: CONTRADICTS },
        ]
      );
    assert.equal(mappings.length, 1);
  });

  it("conflicting same-relation mapping rejects", () => {
    assert.throws(
      () =>
        canonicalizeDeclaredPotentialContributionCapacityRelationInterpretationMappings(
          [
            { raw_relation: ABOVE, interpretation: SUPPORTS },
            { raw_relation: ABOVE, interpretation: CONTRADICTS },
          ]
        ),
      /Conflicting/
    );
  });

  it("mapping order invariance", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const declarationSet = build155(quantitySet, []);
    const a = build159(declarationSet, [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [
          { raw_relation: ABOVE, interpretation: CONTRADICTS },
          { raw_relation: EQUALS, interpretation: SUPPORTS },
        ],
      },
    ]);
    const b = build159(declarationSet, [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [
          { raw_relation: EQUALS, interpretation: SUPPORTS },
          { raw_relation: ABOVE, interpretation: CONTRADICTS },
        ],
      },
    ]);
    assert.equal(
      firstPolicyAssessment(a).interpretation_policy!.key,
      firstPolicyAssessment(b).interpretation_policy!.key
    );
    assert.deepEqual(
      firstPolicyAssessment(a).interpretation_policy!.mappings,
      firstPolicyAssessment(b).interpretation_policy!.mappings
    );
  });

  it("mapping-set identity sensitivity", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const declarationSet = build155(quantitySet, []);
    const partial = firstPolicyAssessment(
      build159(declarationSet, [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
        },
      ])
    ).interpretation_policy!;
    const fuller = firstPolicyAssessment(
      build159(declarationSet, [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          mappings: [
            { raw_relation: ABOVE, interpretation: CONTRADICTS },
            { raw_relation: EQUALS, interpretation: SUPPORTS },
          ],
        },
      ])
    ).interpretation_policy!;
    assert.notEqual(partial.key, fuller.key);
  });

  it("no total mapping coverage requirement (0..6)", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const set = build159(build155(quantitySet, []), [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [{ raw_relation: OVERLAPS, interpretation: SUPPORTS }],
      },
    ]);
    assert.equal(
      firstPolicyAssessment(set).status,
      "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_PRESENT"
    );
  });

  it("Policy PRESENT with current NO_DECLARATION", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const declarationSet = build155(quantitySet, []);
    assert.equal(
      declarationSet.candidate_assessments[0]!
        .binding_potential_contribution_declaration_assessments[0]!.status,
      "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION"
    );
    const set = build159(declarationSet, [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
      },
    ]);
    assert.equal(
      firstPolicyAssessment(set).has_explicit_capacity_relation_interpretation_policy,
      true
    );
  });

  it("current contribution declaration presence independence (same Policy key)", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const contextKey = firstBindingContextKey(quantitySet);
    const mappings = [
      { raw_relation: ABOVE as typeof ABOVE, interpretation: CONTRADICTS },
    ];
    const noDecl = firstPolicyAssessment(
      build159(build155(quantitySet, []), [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          mappings,
        },
      ])
    ).interpretation_policy!;
    const withDecl = firstPolicyAssessment(
      build159(
        build155(quantitySet, [
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              contextKey,
            declared_potential_contribution_quantity: {
              kind: "POINT",
              value: 80,
            },
          },
        ]),
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey,
            mappings,
          },
        ]
      )
    ).interpretation_policy!;
    assert.equal(noDecl.key, withDecl.key);
  });

  it("contribution quantity independence", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const contextKey = firstBindingContextKey(quantitySet);
    const mappings = [
      { raw_relation: EQUALS as typeof EQUALS, interpretation: SUPPORTS },
    ];
    const q80 = firstPolicyAssessment(
      build159(
        build155(quantitySet, [
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              contextKey,
            declared_potential_contribution_quantity: {
              kind: "POINT",
              value: 80,
            },
          },
        ]),
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey,
            mappings,
          },
        ]
      )
    ).interpretation_policy!;
    const q120 = firstPolicyAssessment(
      build159(
        build155(quantitySet, [
          {
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              contextKey,
            declared_potential_contribution_quantity: {
              kind: "POINT",
              value: 120,
            },
          },
        ]),
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey,
            mappings,
          },
        ]
      )
    ).interpretation_policy!;
    assert.equal(q80.key, q120.key);
    assert.ok(!q80.key.includes("80"));
    assert.ok(!q80.key.includes("120"));
  });

  it("evaluation instant independence", () => {
    const q1 = build153({ evaluation_at: AT });
    const q2 = build153({ evaluation_at: AT2 });
    const bindingKey1 = firstBinding133Key(q1);
    const bindingKey2 = firstBinding133Key(q2);
    assert.equal(bindingKey1, bindingKey2);
    const mappings = [
      { raw_relation: BELOW as typeof BELOW, interpretation: SUPPORTS },
    ];
    const p1 = firstPolicyAssessment(
      build159(build155(q1, []), [
        {
          resource_readiness_observation_context_binding_key: bindingKey1,
          mappings,
        },
      ])
    ).interpretation_policy!;
    const p2 = firstPolicyAssessment(
      build159(build155(q2, []), [
        {
          resource_readiness_observation_context_binding_key: bindingKey2,
          mappings,
        },
      ])
    ).interpretation_policy!;
    assert.equal(p1.key, p2.key);
    assert.ok(!p1.key.includes(AT));
    assert.ok(!p1.key.includes(AT2));
  });

  it("Policy PRESENT with zero capacity sources still allowed", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [],
      }),
    });
    const bindingKey = firstBinding133Key(quantitySet);
    const set = build159(build155(quantitySet, []), [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [],
      },
    ]);
    assert.equal(
      firstPolicyAssessment(set).status,
      "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_PRESENT"
    );
  });

  it("capacity-source set change does not affect Policy identity (static key)", () => {
    const key = attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyKey(
      {
        candidate_key: CAND,
        observation_need_key: NEED_KEY,
        capability_requirement_set_key: CAP_SET_KEY,
        observation_resource_requirement_key: R1.key,
        resource_readiness_observation_context_binding_key: "binding-key",
        resource_declaration_id: RD1,
        mappings: [],
      }
    );
    assert.ok(!key.includes(CAP_A));
    assert.ok(!key.includes(CAP_B));
    assert.ok(!key.includes("capacity_declaration"));
  });

  it("unknown Binding target rejects", () => {
    const declarationSet = build155(build153(), []);
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification(
          declarationSet,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key:
                  "missing-binding",
                mappings: [],
              },
            ],
          }
        ),
      /Unknown or stale/
    );
  });

  it("stale Binding target rejects", () => {
    const declarationSet = build155(build153(), []);
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification(
          declarationSet,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key:
                  firstBinding133Key(build153({ evaluation_at: AT2 })) +
                  "|stale-suffix",
                mappings: [],
              },
            ],
          }
        ),
      /Unknown or stale/
    );
  });

  it("cross-candidate Binding target rejects when not in authoritative set", () => {
    const setA = build155(build153({ candidateKey: CAND, requirements: [R1] }), []);
    const setB = build155(
      build153({
        candidateKey: CAND2,
        requirements: [R2],
        bindings: [
          {
            observation_resource_requirement_key: R2.key,
            resource_declaration_id: RD1,
          },
        ],
      }),
      []
    );
    const bindingKeyB = firstBinding133Key(
      setB.resource_readiness_declared_capacity_required_amount_quantity_relation_set
    );
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification(
          setA,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key: bindingKeyB,
                mappings: [],
              },
            ],
          }
        ),
      /Unknown or stale/
    );
  });

  it("competing different Policies for same Binding reject", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const declarationSet = build155(quantitySet, []);
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification(
          declarationSet,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key: bindingKey,
                mappings: [
                  { raw_relation: ABOVE, interpretation: CONTRADICTS },
                ],
              },
              {
                resource_readiness_observation_context_binding_key: bindingKey,
                mappings: [{ raw_relation: ABOVE, interpretation: SUPPORTS }],
              },
            ],
          }
        ),
      /Conflicting/
    );
  });

  it("duplicate identical Policies normalize", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const declarationSet = build155(quantitySet, []);
    const normalized =
      normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification(
        declarationSet,
        {
          policies: [
            {
              resource_readiness_observation_context_binding_key: bindingKey,
              mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
            },
            {
              resource_readiness_observation_context_binding_key: bindingKey,
              mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
            },
          ],
        }
      );
    assert.equal(normalized.policies.length, 1);
  });

  it("mapping identity helper", () => {
    const key =
      attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingKey(
        { raw_relation: ABOVE, interpretation: SUPPORTS }
      );
    assert.ok(key.includes("DECLARED_CAPACITY"));
    assert.ok(key.includes(ABOVE));
    assert.ok(key.includes(SUPPORTS));
  });

  it("empty mapping-set key constant", () => {
    assert.equal(
      buildCanonicalDeclaredPotentialContributionCapacityRelationInterpretationMappingSetKey(
        []
      ),
      EMPTY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_SET
    );
  });

  it("input immutability / deep-clone / ordering invariance", () => {
    const quantitySet = build153();
    const bindingKey = firstBinding133Key(quantitySet);
    const declarationSet = build155(quantitySet, []);
    const policies = [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        mappings: [
          { raw_relation: ABOVE as typeof ABOVE, interpretation: CONTRADICTS },
          { raw_relation: EQUALS as typeof EQUALS, interpretation: SUPPORTS },
        ],
      },
    ];
    const beforeDecl = deepClone(declarationSet);
    const beforeSpec = deepClone({ policies });
    const a = build159(declarationSet, policies);
    assert.deepEqual(declarationSet, beforeDecl);
    assert.deepEqual({ policies }, beforeSpec);
    assert.deepEqual(a, build159(declarationSet, policies));
    assert.deepEqual(
      a,
      build159(deepClone(declarationSet), deepClone(policies))
    );
    assert.deepEqual(
      a,
      build159(declarationSet, [
        {
          ...policies[0]!,
          mappings: [...policies[0]!.mappings].reverse(),
        },
      ])
    );
  });

  describe("static proofs", () => {
    it("155 + type-only 157; no current Basis / required-axis / aggregation / Ready", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-policy-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(/physical-potential-contribution-declaration-types/.test(core));
      assert.ok(
        /declared-potential-contribution-raw-relation-basis-types/.test(core)
      );
      assert.ok(!/raw-relation-basis-core/.test(core));
      assert.ok(
        !/buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSet/.test(
          core
        )
      );
      assert.ok(!/\bProjectState\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/from\s+["'][^"']*\/types\.js["']/.test(core));
      assert.ok(!/canonical-per-requirement-resource-readiness-binding-evidence-composition-state/.test(core));
      assert.ok(!/canonical-per-binding-resource-readiness-evidence-state/.test(core));
      assert.ok(!/resource-reservation/.test(core));
      assert.ok(!/"REQUIRED_AMOUNT"/.test(src));
      assert.ok(!/SUPPORTS_REQUIRED_AMOUNT/.test(src));
      assert.ok(!/CONTRADICTS_REQUIRED_AMOUNT/.test(src));
      assert.ok(!/COVERS_DECLARED_REQUIREMENT/.test(src));
      assert.ok(!/"CONSISTENT"/.test(src));
      assert.ok(!/"INCONSISTENT"/.test(src));
      assert.ok(!/"HOLDS"/.test(src));
      assert.ok(!/"DOES_NOT_HOLD"/.test(src));
      assert.ok(!/"ACCEPTABLE"/.test(src));
      assert.ok(!/"NOT_ACCEPTABLE"/.test(src));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"SUFFICIENT"/.test(src));
      assert.ok(!/"INSUFFICIENT"/.test(src));
      assert.ok(!/free_quantity/.test(src));
      assert.ok(!/effective_potential/.test(src));
      assert.ok(!/available_amount/.test(src));
      assert.ok(!/"ANY"/.test(src));
      assert.ok(!/"ALL"/.test(src));
      assert.ok(!/winner/.test(src));
      assert.ok(/CAPACITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED/.test(types));
      assert.ok(/CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED/.test(types));
      assert.ok(/REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED/.test(types));
      assert.ok(/CURRENT_CAPACITY_RELATION_INTERPRETATION_NOT_APPLIED/.test(types));
      assert.ok(/PER_SOURCE_CAPACITY_RELATION_INTERPRETATION_BASIS_NOT_MODELED/.test(types));
      // Policy identity builder must not embed evaluation_at / capacity declaration ids / contribution quantity
      const policyKeyFn =
        core.match(
          /export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyKey[\s\S]*?\.join\("\|"\);/
        )?.[0] ?? "";
      assert.ok(policyKeyFn.length > 0);
      assert.ok(!/evaluation_at/.test(policyKeyFn));
      assert.ok(!/capacity_declaration_id/.test(policyKeyFn));
      assert.ok(!/declared_potential_contribution_quantity/.test(policyKeyFn));
      assert.ok(!/contribution_declaration/.test(policyKeyFn));
      // No default polarity branches on raw relation tokens
      assert.ok(
        !/STRICTLY_ABOVE[\s\S]{0,80}CONTRADICTS|STRICTLY_BELOW[\s\S]{0,80}SUPPORTS/.test(
          core
        )
      );
      assert.ok(!/case\s+["']DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL/.test(core));
      assert.ok(!/switch\s*\(\s*raw_relation/.test(core));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/"FEASIBILITY"/.test(src));
    });
  });
});
