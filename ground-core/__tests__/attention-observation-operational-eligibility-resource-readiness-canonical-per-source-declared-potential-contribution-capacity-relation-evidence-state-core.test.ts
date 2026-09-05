/**
 * GROUND-161 — Observation Core CXV / Canonical Per-source Declared Potential
 * Contribution Capacity-Relation Evidence State Foundation
 *
 * Normalization only over GROUND-160. No aggregation / truth inflation.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-basis-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_PER_SOURCE_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_EVIDENCE_STATE_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSet,
  deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue,
  isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-core.js";
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

const SUPPORTING =
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SUPPORTING" as const;
const CONTRADICTING =
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_CONTRADICTING" as const;
const UNRESOLVED_NO_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY" as const;
const UNRESOLVED_NO_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_RELATION" as const;

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

function mock132Set(): AttentionObservationResourceRequirementSetAssessment {
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: [
      mock132Candidate({ candidate_key: CAND, resource_requirements: [R1] }),
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

function resourceDecl(id: string): ResourceDeclaration {
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
  };
}

function availability(id: string, resourceId: string): ResourceAvailabilityDeclaration {
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
  const bindingSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
      {
        observation_resource_requirement_set: mock132Set(),
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

function build160Pipeline(options: {
  projectState?: ProjectState;
  evaluation_at?: string;
  contribution: ResourceRequirementAmount;
  mappings:
    | {
        raw_relation: typeof BELOW | typeof EQUALS | typeof ABOVE;
        interpretation: typeof SUPPORTS | typeof CONTRADICTS;
      }[]
    | null;
}) {
  const quantitySet = build153({
    projectState: options.projectState,
    evaluation_at: options.evaluation_at,
  });
  const contributionSet = build155(quantitySet, options.contribution);
  const rawSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSet(
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_set:
          quantitySet,
        resource_readiness_physical_potential_contribution_declaration_set:
          contributionSet,
      }
    );
  const bindingKey = firstBinding133Key(quantitySet);
  const policies =
    options.mappings === null
      ? []
      : [
          {
            resource_readiness_observation_context_binding_key: bindingKey,
            mappings: options.mappings,
          },
        ];
  const policySet =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySet(
      {
        resource_readiness_physical_potential_contribution_declaration_set:
          contributionSet,
        specification: { policies },
      }
    );
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSet(
    {
      resource_readiness_declared_potential_contribution_raw_relation_set: rawSet,
      resource_readiness_declared_potential_contribution_capacity_relation_interpretation_policy_set:
        policySet,
    }
  );
}

function build161(basisSet: ReturnType<typeof build160Pipeline>) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSet(
    {
      resource_readiness_declared_potential_contribution_capacity_relation_interpretation_basis_set:
        basisSet,
    }
  );
}

function firstBinding(set: ReturnType<typeof build161>) {
  return set.candidate_assessments[0]!.binding_state_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-161 Canonical Per-source Declared Potential Contribution Capacity-Relation Evidence State", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_PER_SOURCE_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_EVIDENCE_STATE_MODEL_LIMITATIONS[0],
      "CAPACITY_SOURCE_MEMBER_SET_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_PER_SOURCE_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_EVIDENCE_STATE_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("zero sources → zero States", () => {
    const set = build161(
      build160Pipeline({
        projectState: mockProjectState({ resource_capacity_declarations: [] }),
        contribution: { kind: "POINT", value: 80 },
        mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
      })
    );
    const binding = firstBinding(set);
    assert.equal(binding.capacity_source_count, 0);
    assert.equal(binding.canonical_state_count, 0);
    assert.deepEqual(binding.source_state_assessments, []);
    assert.equal(binding.has_supporting_capacity_relation_evidence_states, false);
    assert.equal(binding.has_contradicting_capacity_relation_evidence_states, false);
    assert.equal(binding.has_unresolved_capacity_relation_evidence_states, false);
  });

  it("one source / NO_POLICY → UNRESOLVED_NO_POLICY", () => {
    const set = build161(
      build160Pipeline({
        contribution: { kind: "POINT", value: 120 },
        mappings: null,
      })
    );
    const source = firstBinding(set).source_state_assessments[0]!;
    assert.equal(source.canonical_state_value, UNRESOLVED_NO_POLICY);
    assert.equal(source.canonical_state.capacity_relation_interpretation_basis_key, null);
    assert.equal(
      isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState(
        source.canonical_state_value
      ),
      false
    );
  });

  it("one source / NO_MAPPING → UNRESOLVED_NO_MAPPING", () => {
    const set = build161(
      build160Pipeline({
        contribution: { kind: "POINT", value: 120 },
        mappings: [],
      })
    );
    const source = firstBinding(set).source_state_assessments[0]!;
    assert.equal(source.canonical_state_value, UNRESOLVED_NO_MAPPING);
    assert.notEqual(source.canonical_state_value, UNRESOLVED_NO_POLICY);
    assert.notEqual(source.canonical_state_value, CONTRADICTING);
    assert.equal(
      isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState(
        source.canonical_state_value
      ),
      false
    );
  });

  it("one source / SUPPORTS → SUPPORTING (resolved)", () => {
    const set = build161(
      build160Pipeline({
        contribution: { kind: "POINT", value: 80 },
        mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
      })
    );
    const source = firstBinding(set).source_state_assessments[0]!;
    assert.equal(source.canonical_state_value, SUPPORTING);
    assert.ok(source.canonical_state.capacity_relation_interpretation_basis_key);
    assert.equal(
      isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState(
        source.canonical_state_value
      ),
      true
    );
  });

  it("one source / CONTRADICTS → CONTRADICTING (resolved)", () => {
    const set = build161(
      build160Pipeline({
        contribution: { kind: "POINT", value: 120 },
        mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
      })
    );
    const source = firstBinding(set).source_state_assessments[0]!;
    assert.equal(source.canonical_state_value, CONTRADICTING);
    assert.equal(
      isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState(
        source.canonical_state_value
      ),
      true
    );
  });

  it("unusual ABOVE→SUPPORTS ancestry preserved", () => {
    const set = build161(
      build160Pipeline({
        contribution: { kind: "POINT", value: 120 },
        mappings: [{ raw_relation: ABOVE, interpretation: SUPPORTS }],
      })
    );
    assert.equal(
      firstBinding(set).source_state_assessments[0]!.canonical_state_value,
      SUPPORTING
    );
  });

  it("unusual EQUAL→CONTRADICTS ancestry preserved", () => {
    const set = build161(
      build160Pipeline({
        contribution: { kind: "POINT", value: 100 },
        mappings: [{ raw_relation: EQUALS, interpretation: CONTRADICTS }],
      })
    );
    assert.equal(
      firstBinding(set).source_state_assessments[0]!.canonical_state_value,
      CONTRADICTING
    );
  });

  it("NO_POLICY != NO_MAPPING; cardinality == source count", () => {
    const noPolicy = firstBinding(
      build161(
        build160Pipeline({
          contribution: { kind: "POINT", value: 120 },
          mappings: null,
        })
      )
    );
    const noMapping = firstBinding(
      build161(
        build160Pipeline({
          contribution: { kind: "POINT", value: 120 },
          mappings: [],
        })
      )
    );
    assert.notEqual(
      noPolicy.source_state_assessments[0]!.canonical_state_value,
      noMapping.source_state_assessments[0]!.canonical_state_value
    );
    assert.equal(noPolicy.canonical_state_count, noPolicy.capacity_source_count);
  });

  it("multiple SUPPORTING sources remain independent", () => {
    const set = build161(
      build160Pipeline({
        projectState: mockProjectState({
          resource_capacity_declarations: [
            capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
            capacityDecl(CAP_C, RD1, { kind: "POINT", value: 100 }),
          ],
        }),
        contribution: { kind: "POINT", value: 80 },
        mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
      })
    );
    const sources = firstBinding(set).source_state_assessments;
    assert.equal(sources.length, 2);
    assert.equal(sources[0]!.canonical_state_value, SUPPORTING);
    assert.equal(sources[1]!.canonical_state_value, SUPPORTING);
    assert.notEqual(sources[0]!.canonical_state.key, sources[1]!.canonical_state.key);
    assert.notEqual(
      sources[0]!.canonical_state.capacity_declaration_key,
      sources[1]!.canonical_state.capacity_declaration_key
    );
  });

  it("SUPPORTING + CONTRADICTING + unresolved coexistence", () => {
    // contribution 100: CAP50→ABOVE, CAP100→EQUALS, CAP200→BELOW
    const set = build161(
      build160Pipeline({
        projectState: mockProjectState({
          resource_capacity_declarations: [
            capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
            capacityDecl(CAP_B, RD1, { kind: "POINT", value: 100 }),
            capacityDecl(CAP_C, RD1, { kind: "POINT", value: 200 }),
          ],
        }),
        contribution: { kind: "POINT", value: 100 },
        mappings: [
          { raw_relation: ABOVE, interpretation: CONTRADICTS },
          { raw_relation: BELOW, interpretation: SUPPORTS },
        ],
      })
    );
    const binding = firstBinding(set);
    assert.equal(binding.capacity_source_count, 3);
    assert.equal(binding.canonical_state_count, 3);
    assert.equal(binding.has_supporting_capacity_relation_evidence_states, true);
    assert.equal(binding.has_contradicting_capacity_relation_evidence_states, true);
    assert.equal(binding.has_unresolved_capacity_relation_evidence_states, true);
    const values = new Set(
      binding.source_state_assessments.map((s) => s.canonical_state_value)
    );
    assert.ok(values.has(SUPPORTING));
    assert.ok(values.has(CONTRADICTING));
    assert.ok(values.has(UNRESOLVED_NO_MAPPING));
  });

  it("SUPPORTING + unresolved coexistence", () => {
    const set = build161(
      build160Pipeline({
        projectState: mockProjectState({
          resource_capacity_declarations: [
            capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
            capacityDecl(CAP_B, RD1, { kind: "POINT", value: 100 }),
          ],
        }),
        contribution: { kind: "POINT", value: 80 },
        mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
      })
    );
    const binding = firstBinding(set);
    assert.equal(binding.has_supporting_capacity_relation_evidence_states, true);
    assert.equal(binding.has_unresolved_capacity_relation_evidence_states, true);
    assert.equal(binding.has_contradicting_capacity_relation_evidence_states, false);
  });

  it("same source / different evaluation instant → distinct State", () => {
    const mappings = [{ raw_relation: ABOVE as typeof ABOVE, interpretation: CONTRADICTS }];
    const s1 = firstBinding(
      build161(
        build160Pipeline({
          evaluation_at: AT,
          contribution: { kind: "POINT", value: 120 },
          mappings,
        })
      )
    ).source_state_assessments[0]!.canonical_state;
    const s2 = firstBinding(
      build161(
        build160Pipeline({
          evaluation_at: AT2,
          contribution: { kind: "POINT", value: 120 },
          mappings,
        })
      )
    ).source_state_assessments[0]!.canonical_state;
    assert.notEqual(s1.key, s2.key);
    assert.equal(s1.evaluation_at, AT);
    assert.equal(s2.evaluation_at, AT2);
  });

  it("same canonical value / changed Basis lineage → distinct identity", () => {
    const mappings = [
      { raw_relation: ABOVE as typeof ABOVE, interpretation: SUPPORTS },
      { raw_relation: BELOW as typeof BELOW, interpretation: SUPPORTS },
    ];
    const above = firstBinding(
      build161(
        build160Pipeline({
          contribution: { kind: "POINT", value: 120 },
          mappings,
        })
      )
    ).source_state_assessments[0]!.canonical_state;
    const below = firstBinding(
      build161(
        build160Pipeline({
          contribution: { kind: "POINT", value: 80 },
          mappings,
        })
      )
    ).source_state_assessments[0]!.canonical_state;
    assert.equal(above.value, SUPPORTING);
    assert.equal(below.value, SUPPORTING);
    assert.notEqual(above.key, below.key);
    assert.notEqual(
      above.capacity_relation_interpretation_basis_key,
      below.capacity_relation_interpretation_basis_key
    );
  });

  it("malformed BASIS_PRESENT without Basis rejects", () => {
    const basisSet = build160Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const malformed = deepClone(basisSet);
    const source =
      malformed.candidate_assessments[0]!.binding_interpretation_basis_assessments[0]!
        .capacity_source_interpretation_basis_assessments[0]!;
    source.interpretation_basis = null;
    source.interpretation = null;
    source.has_capacity_relation_interpretation_basis = false;
    assert.throws(
      () => build161(malformed),
      /BASIS_PRESENT requires Basis/
    );
  });

  it("derive helper exhaustiveness / identity helper", () => {
    const basisSet = build160Pipeline({
      contribution: { kind: "POINT", value: 120 },
      mappings: null,
    });
    const source =
      basisSet.candidate_assessments[0]!.binding_interpretation_basis_assessments[0]!
        .capacity_source_interpretation_basis_assessments[0]!;
    assert.equal(
      deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue(
        source
      ),
      UNRESOLVED_NO_POLICY
    );
    const key =
      attentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          resource_readiness_observation_context_binding_key: "binding",
          resource_declaration_id: RD1,
          evaluation_at: AT,
          capacity_relation_entry_key: "entry",
          capacity_declaration_key: CAP_A,
          ground160_status: "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED",
          capacity_relation_interpretation_basis_key: null,
          value: UNRESOLVED_NO_POLICY,
        }
      );
    assert.ok(key.includes("NONE"));
    assert.ok(key.includes(UNRESOLVED_NO_POLICY));
  });

  it("input immutability / deep-clone", () => {
    const basisSet = build160Pipeline({
      contribution: { kind: "POINT", value: 120 },
      mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
    });
    const before = deepClone(basisSet);
    const a = build161(basisSet);
    assert.deepEqual(basisSet, before);
    assert.deepEqual(a, build161(basisSet));
    assert.deepEqual(a, build161(deepClone(basisSet)));
  });

  it("SUPPORTING != HOLDS; CONTRADICTING != DOES_NOT_HOLD (no aggregate verdict)", () => {
    const binding = firstBinding(
      build161(
        build160Pipeline({
          contribution: { kind: "POINT", value: 80 },
          mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
        })
      )
    );
    assert.ok(!("holds" in binding));
    assert.ok(!("compatibility_verdict" in binding));
    assert.ok(!("CAPACITY_COMPATIBILITY_HOLDS" in binding));
  });

  describe("static proofs", () => {
    it("160 sole authority; no aggregation / required / Ready / raw reopen", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(/capacity-relation-interpretation-basis-types/.test(core));
      assert.ok(!/capacity-relation-interpretation-basis-core/.test(core));
      assert.ok(!/capacity-relation-interpretation-policy-core/.test(core));
      assert.ok(!/raw-relation-basis-core/.test(core));
      assert.ok(!/physical-potential-contribution-declaration-core/.test(core));
      assert.ok(!/canonical-per-binding-resource-readiness-evidence-state-core/.test(core));
      assert.ok(!/canonical-per-requirement-resource-readiness-binding-evidence-composition-state-core/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/current_raw_relation/.test(core));
      assert.ok(!/case\s+["']DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL/.test(core));
      assert.ok(!/switch\s*\(\s*.*raw_relation/.test(core));
      assert.ok(!/findExactDeclaredPotentialContributionCapacityRelationInterpretationMapping/.test(core));
      assert.ok(!/"REQUIRED_AMOUNT"/.test(src));
      assert.ok(!/"HOLDS"/.test(src));
      assert.ok(!/"DOES_NOT_HOLD"/.test(src));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"COMPATIBILITY_HOLDS"/.test(src));
      assert.ok(!/"ANY"/.test(src));
      assert.ok(!/"ALL"/.test(src));
      assert.ok(!/winner/.test(src));
      assert.ok(!/free_quantity/.test(src));
      assert.ok(!/effective_potential/.test(src));
      assert.ok(!/available_amount/.test(src));
      assert.ok(/CAPACITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED/.test(types));
      assert.ok(/CAPACITY_COMPATIBILITY_PROPOSITION_STATE_NOT_MODELED/.test(types));
      assert.ok(/REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED/.test(types));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/"FEASIBILITY"/.test(src));
      assert.ok(!/resource-reservation/.test(core));
    });
  });
});
