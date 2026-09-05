/**
 * GROUND-160 — Observation Core CXIV / Per-source Declared Potential Contribution
 * Capacity-Relation Interpretation Basis Foundation
 *
 * Exact current source + exact GROUND-159 mapping only.
 * NO_POLICY ≠ NO_MAPPING ≠ CONTRADICTS; zero sources ≠ negative.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-policy-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSet,
  findExactDeclaredPotentialContributionCapacityRelationInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-basis-core.js";
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
const ABOVE =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL" as const;

const NO_POLICY =
  "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED" as const;
const NO_MAPPING =
  "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_RELATION" as const;
const BASIS_PRESENT =
  "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_PRESENT" as const;

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
      mock132Candidate({ candidate_key: CAND, resource_requirements: requirements }),
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
  evaluation_at?: string;
}) {
  const evaluation_at = options?.evaluation_at ?? AT;
  const requirementSet = mock132Set([R1]);
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
                  observation_resource_requirement_key: R1.key,
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
    { resource_readiness_raw_evidence_assessment_set: rawSet }
  );
}

function firstContextKey(quantitySet: ReturnType<typeof build153>): string {
  return attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
    quantitySet.candidate_assessments[0]!
      .binding_quantity_relation_assessments[0]!
  );
}

function firstBinding133Key(quantitySet: ReturnType<typeof build153>): string {
  return quantitySet.candidate_assessments[0]!
    .binding_quantity_relation_assessments[0]!
    .resource_readiness_observation_context_binding_key;
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

function build159(
  contributionSet: ReturnType<typeof build155>,
  mappings: {
    raw_relation: typeof BELOW | typeof EQUALS | typeof ABOVE;
    interpretation: typeof SUPPORTS | typeof CONTRADICTS;
  }[] | null
) {
  const bindingKey = firstBinding133Key(
    contributionSet.resource_readiness_declared_capacity_required_amount_quantity_relation_set
  );
  const policies =
    mappings === null
      ? []
      : [
          {
            resource_readiness_observation_context_binding_key: bindingKey,
            mappings,
          },
        ];
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySet(
    {
      resource_readiness_physical_potential_contribution_declaration_set:
        contributionSet,
      specification: { policies },
    }
  );
}

function build160(
  rawSet: ReturnType<typeof build157>,
  policySet: ReturnType<typeof build159>
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSet(
    {
      resource_readiness_declared_potential_contribution_raw_relation_set: rawSet,
      resource_readiness_declared_potential_contribution_capacity_relation_interpretation_policy_set:
        policySet,
    }
  );
}

function firstBinding(set: ReturnType<typeof build160>) {
  return set.candidate_assessments[0]!.binding_interpretation_basis_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-160 Per-source Declared Potential Contribution Capacity-Relation Interpretation Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_MODEL_LIMITATIONS[0],
      "PER_SOURCE_CAPACITY_RELATION_CANONICAL_STATE_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("zero sources / no Policy → 0 source assessments", () => {
    const quantitySet = build153({
      projectState: mockProjectState({ resource_capacity_declarations: [] }),
    });
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 80 });
    const set = build160(build157(quantitySet, contributionSet), build159(contributionSet, null));
    const binding = firstBinding(set);
    assert.equal(binding.capacity_source_count, 0);
    assert.deepEqual(binding.capacity_source_interpretation_basis_assessments, []);
    assert.equal(binding.interpretation_basis_count, 0);
    assert.equal(binding.has_capacity_relation_interpretation_bases, false);
    assert.equal(binding.has_supporting_capacity_relation_interpretations, false);
    assert.equal(binding.has_contradicting_capacity_relation_interpretations, false);
    assert.equal(
      binding.capacity_relation_interpretation_policy_assessment.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED"
    );
  });

  it("zero sources / Policy PRESENT → still 0 source assessments (no vacuous SUPPORTS)", () => {
    const quantitySet = build153({
      projectState: mockProjectState({ resource_capacity_declarations: [] }),
    });
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 80 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [{ raw_relation: ABOVE, interpretation: CONTRADICTS }])
    );
    const binding = firstBinding(set);
    assert.equal(binding.capacity_source_count, 0);
    assert.equal(
      binding.capacity_relation_interpretation_policy_assessment
        .has_explicit_capacity_relation_interpretation_policy,
      true
    );
    assert.equal(binding.has_supporting_capacity_relation_interpretations, false);
    assert.equal(binding.has_contradicting_capacity_relation_interpretations, false);
  });

  it("one source / NO_POLICY", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 120 });
    const set = build160(build157(quantitySet, contributionSet), build159(contributionSet, null));
    const source = firstBinding(set).capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(source.status, NO_POLICY);
    assert.equal(source.interpretation_basis, null);
    assert.equal(source.interpretation, null);
    assert.equal(source.has_capacity_relation_interpretation_basis, false);
    assert.equal(source.current_raw_relation, ABOVE);
  });

  it("one source / explicit empty Policy → NO_MAPPING (not NO_POLICY)", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 120 });
    const set = build160(build157(quantitySet, contributionSet), build159(contributionSet, []));
    const source = firstBinding(set).capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(source.status, NO_MAPPING);
    assert.notEqual(source.status, NO_POLICY);
    assert.equal(
      firstBinding(set).capacity_relation_interpretation_policy_assessment
        .has_explicit_capacity_relation_interpretation_policy,
      true
    );
  });

  it("one source / partial unmapped Policy → NO_MAPPING", () => {
    const quantitySet = build153();
    // contribution 120 vs capacity 100 → ABOVE; Policy maps only BELOW
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 120 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [{ raw_relation: BELOW, interpretation: SUPPORTS }])
    );
    const source = firstBinding(set).capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(source.current_raw_relation, ABOVE);
    assert.equal(source.status, NO_MAPPING);
    assert.equal(source.interpretation, null);
  });

  it("one source / mapped SUPPORTS", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 80 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [{ raw_relation: BELOW, interpretation: SUPPORTS }])
    );
    const source = firstBinding(set).capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(source.status, BASIS_PRESENT);
    assert.equal(source.interpretation, SUPPORTS);
    assert.ok(source.interpretation_basis);
    assert.equal(source.has_capacity_relation_interpretation_basis, true);
  });

  it("one source / mapped CONTRADICTS", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 120 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [{ raw_relation: ABOVE, interpretation: CONTRADICTS }])
    );
    const source = firstBinding(set).capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(source.status, BASIS_PRESENT);
    assert.equal(source.interpretation, CONTRADICTS);
  });

  it("unusual ABOVE→SUPPORTS applied exactly", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 120 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [{ raw_relation: ABOVE, interpretation: SUPPORTS }])
    );
    assert.equal(
      firstBinding(set).capacity_source_interpretation_basis_assessments[0]!
        .interpretation,
      SUPPORTS
    );
  });

  it("unusual EQUAL→CONTRADICTS applied exactly", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 100 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [{ raw_relation: EQUALS, interpretation: CONTRADICTS }])
    );
    const source = firstBinding(set).capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(source.current_raw_relation, EQUALS);
    assert.equal(source.interpretation, CONTRADICTS);
  });

  it("multiple sources same raw relation → independent Bases", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
          capacityDecl(CAP_C, RD1, { kind: "POINT", value: 100 }),
        ],
      }),
    });
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 80 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [{ raw_relation: BELOW, interpretation: SUPPORTS }])
    );
    const sources = firstBinding(set).capacity_source_interpretation_basis_assessments;
    assert.equal(sources.length, 2);
    assert.equal(sources[0]!.status, BASIS_PRESENT);
    assert.equal(sources[1]!.status, BASIS_PRESENT);
    assert.notEqual(
      sources[0]!.interpretation_basis!.key,
      sources[1]!.interpretation_basis!.key
    );
    assert.notEqual(
      sources[0]!.capacity_declaration_key,
      sources[1]!.capacity_declaration_key
    );
  });

  it("multiple sources different relations + SUPPORTS/CONTRADICTS coexistence", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
          capacityDecl(CAP_B, RD1, { kind: "POINT", value: 100 }),
        ],
      }),
    });
    // contribution 80 → ABOVE vs 50, BELOW vs 100
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 80 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [
        { raw_relation: ABOVE, interpretation: CONTRADICTS },
        { raw_relation: BELOW, interpretation: SUPPORTS },
      ])
    );
    const binding = firstBinding(set);
    assert.equal(binding.capacity_source_count, 2);
    assert.equal(binding.has_supporting_capacity_relation_interpretations, true);
    assert.equal(binding.has_contradicting_capacity_relation_interpretations, true);
    assert.equal(binding.interpretation_basis_count, 2);
  });

  it("same interpretation / different sources → distinct Basis identities", () => {
    const quantitySet = build153({
      projectState: mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
          capacityDecl(CAP_B, RD1, { kind: "POINT", value: 200 }),
        ],
      }),
    });
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 80 });
    const set = build160(
      build157(quantitySet, contributionSet),
      build159(contributionSet, [{ raw_relation: BELOW, interpretation: SUPPORTS }])
    );
    const [a, b] = firstBinding(set).capacity_source_interpretation_basis_assessments;
    assert.equal(a!.interpretation, SUPPORTS);
    assert.equal(b!.interpretation, SUPPORTS);
    assert.notEqual(a!.interpretation_basis!.key, b!.interpretation_basis!.key);
  });

  it("same source / different evaluation instant → distinct Basis", () => {
    const q1 = build153({ evaluation_at: AT });
    const q2 = build153({ evaluation_at: AT2 });
    const c1 = build155(q1, { kind: "POINT", value: 120 });
    const c2 = build155(q2, { kind: "POINT", value: 120 });
    const mappings = [{ raw_relation: ABOVE as typeof ABOVE, interpretation: CONTRADICTS }];
    const b1 = firstBinding(
      build160(build157(q1, c1), build159(c1, mappings))
    ).capacity_source_interpretation_basis_assessments[0]!.interpretation_basis!;
    const b2 = firstBinding(
      build160(build157(q2, c2), build159(c2, mappings))
    ).capacity_source_interpretation_basis_assessments[0]!.interpretation_basis!;
    assert.notEqual(b1.key, b2.key);
    assert.equal(b1.evaluation_at, AT);
    assert.equal(b2.evaluation_at, AT2);
  });

  it("same source / different raw relation → distinct Basis", () => {
    const quantitySet = build153();
    const mappings = [
      { raw_relation: ABOVE as typeof ABOVE, interpretation: CONTRADICTS },
      { raw_relation: BELOW as typeof BELOW, interpretation: SUPPORTS },
    ];
    const above = firstBinding(
      build160(
        build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 120 })),
        build159(build155(quantitySet, { kind: "POINT", value: 120 }), mappings)
      )
    ).capacity_source_interpretation_basis_assessments[0]!.interpretation_basis!;
    const below = firstBinding(
      build160(
        build157(quantitySet, build155(quantitySet, { kind: "POINT", value: 80 })),
        build159(build155(quantitySet, { kind: "POINT", value: 80 }), mappings)
      )
    ).capacity_source_interpretation_basis_assessments[0]!.interpretation_basis!;
    assert.notEqual(above.key, below.key);
    assert.equal(above.current_raw_relation, ABOVE);
    assert.equal(below.current_raw_relation, BELOW);
  });

  it("NO_POLICY != NO_MAPPING", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 120 });
    const noPolicy = firstBinding(
      build160(build157(quantitySet, contributionSet), build159(contributionSet, null))
    ).capacity_source_interpretation_basis_assessments[0]!;
    const noMapping = firstBinding(
      build160(build157(quantitySet, contributionSet), build159(contributionSet, []))
    ).capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(noPolicy.status, NO_POLICY);
    assert.equal(noMapping.status, NO_MAPPING);
    assert.notEqual(noPolicy.status, noMapping.status);
  });

  it("NO_MAPPING != CONTRADICTS; zero sources != CONTRADICTS", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 120 });
    const noMapping = firstBinding(
      build160(build157(quantitySet, contributionSet), build159(contributionSet, []))
    ).capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(noMapping.status, NO_MAPPING);
    assert.equal(noMapping.interpretation, null);

    const zeroCap = build153({
      projectState: mockProjectState({ resource_capacity_declarations: [] }),
    });
    const zeroContrib = build155(zeroCap, { kind: "POINT", value: 80 });
    const zeroBinding = firstBinding(
      build160(
        build157(zeroCap, zeroContrib),
        build159(zeroContrib, [{ raw_relation: ABOVE, interpretation: CONTRADICTS }])
      )
    );
    assert.equal(zeroBinding.capacity_source_count, 0);
    assert.equal(zeroBinding.has_contradicting_capacity_relation_interpretations, false);
  });

  it("SUPPORTS != HOLDS; CONTRADICTS != DOES_NOT_HOLD (existence summary only)", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 80 });
    const binding = firstBinding(
      build160(
        build157(quantitySet, contributionSet),
        build159(contributionSet, [{ raw_relation: BELOW, interpretation: SUPPORTS }])
      )
    );
    assert.equal(binding.has_supporting_capacity_relation_interpretations, true);
    assert.ok(!("holds" in binding));
    assert.ok(!("does_not_hold" in binding));
    assert.ok(!("compatibility_verdict" in binding));
  });

  it("findExactMapping: 0 / 1", () => {
    assert.equal(
      findExactDeclaredPotentialContributionCapacityRelationInterpretationMapping(
        [{ key: "m", relation_axis: "DECLARED_CAPACITY", raw_relation: ABOVE, interpretation: SUPPORTS }],
        BELOW
      ),
      null
    );
    const found = findExactDeclaredPotentialContributionCapacityRelationInterpretationMapping(
      [{ key: "m", relation_axis: "DECLARED_CAPACITY", raw_relation: ABOVE, interpretation: SUPPORTS }],
      ABOVE
    );
    assert.equal(found!.interpretation, SUPPORTS);
  });

  it("missing Policy counterpart rejects", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 80 });
    const rawSet = build157(quantitySet, contributionSet);
    const policySet = build159(contributionSet, null);
    // Drop the policy binding assessment to simulate malformed cross-input
    const malformed = deepClone(policySet);
    malformed.candidate_assessments[0]!.binding_interpretation_policy_assessments = [];
    assert.throws(
      () => build160(rawSet, malformed),
      /compatible stable Binding context|missing GROUND-159/
    );
  });

  it("input immutability / deep-clone", () => {
    const quantitySet = build153();
    const contributionSet = build155(quantitySet, { kind: "POINT", value: 120 });
    const rawSet = build157(quantitySet, contributionSet);
    const policySet = build159(contributionSet, [
      { raw_relation: ABOVE, interpretation: CONTRADICTS },
    ]);
    const beforeRaw = deepClone(rawSet);
    const beforePolicy = deepClone(policySet);
    const a = build160(rawSet, policySet);
    assert.deepEqual(rawSet, beforeRaw);
    assert.deepEqual(policySet, beforePolicy);
    assert.deepEqual(a, build160(rawSet, policySet));
    assert.deepEqual(a, build160(deepClone(rawSet), deepClone(policySet)));
  });

  it("Basis identity includes evaluation_at and capacity source lineage", () => {
    const key =
      attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          resource_readiness_observation_context_binding_key: "binding",
          resource_declaration_id: RD1,
          evaluation_at: AT,
          physical_potential_contribution_declaration_key: "decl",
          capacity_relation_entry_key: "entry",
          capacity_declaration_key: CAP_A,
          current_raw_relation: ABOVE,
          capacity_relation_interpretation_policy_key: "policy",
          matched_mapping_key: "mapping",
          interpretation: SUPPORTS,
        }
      );
    assert.ok(key.includes(AT));
    assert.ok(key.includes(CAP_A));
    assert.ok(key.includes(ABOVE));
    assert.ok(key.includes(SUPPORTS));
  });

  describe("static proofs", () => {
    it("157+159 only; no aggregation / required-axis / Ready / intuition", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-basis-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-basis-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(/raw-relation-basis-types/.test(core));
      assert.ok(/capacity-relation-interpretation-policy-types/.test(core));
      assert.ok(!/raw-relation-basis-core/.test(core));
      assert.ok(!/capacity-relation-interpretation-policy-core/.test(core));
      assert.ok(!/physical-potential-contribution-declaration-core/.test(core));
      assert.ok(!/canonical-per-binding-resource-readiness-evidence-state/.test(core));
      assert.ok(!/canonical-per-requirement-resource-readiness-binding-evidence-composition-state/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/contribution_required_amount_relation/.test(core));
      assert.ok(!/SUPPORTS_REQUIRED_AMOUNT/.test(src));
      assert.ok(!/COVERS_DECLARED_REQUIREMENT/.test(src));
      assert.ok(!/"REQUIRED_AMOUNT"/.test(src));
      assert.ok(!/"CONSISTENT"/.test(src));
      assert.ok(!/"INCONSISTENT"/.test(src));
      assert.ok(!/"HOLDS"/.test(src));
      assert.ok(!/"DOES_NOT_HOLD"/.test(src));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/free_quantity/.test(src));
      assert.ok(!/effective_potential/.test(src));
      assert.ok(!/available_amount/.test(src));
      assert.ok(!/"ANY"/.test(src));
      assert.ok(!/"ALL"/.test(src));
      assert.ok(!/winner/.test(src));
      assert.ok(!/deriveDeclaredPotentialContributionRawQuantityRelation/.test(core));
      assert.ok(!/Math\.min/.test(core));
      assert.ok(!/switch\s*\(\s*(entry\.)?relation/.test(core));
      assert.ok(!/case\s+["']DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL/.test(core));
      assert.ok(/CAPACITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED/.test(types));
      assert.ok(/REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED/.test(types));
      assert.ok(/PER_SOURCE_CAPACITY_RELATION_CANONICAL_STATE_NOT_MODELED/.test(types));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/"FEASIBILITY"/.test(src));
      assert.ok(!/resource-reservation/.test(core));
    });
  });
});
