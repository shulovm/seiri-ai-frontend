/**
 * GROUND-163 — Observation Core CXVII / Explicit Declared Potential Contribution
 * Capacity-Compatibility Source Aggregation Policy Foundation
 *
 * Declaration only. No current-State evaluation / readiness / Result.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySet,
  canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberKeys,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-core.js";
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
const CAP_C = "c3333333-3333-4333-8333-333333333333";
const CAP_D = "c4444444-4444-4444-8444-444444444444";
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
const ABOVE =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL" as const;

const ANY =
  "ANY_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITION_HOLDS" as const;
const ALL =
  "ALL_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITIONS_HOLD" as const;

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
  required_amount: { kind: "POINT", value: 10 },
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
      capacityDecl(CAP_B, RD1, { kind: "POINT", value: 200 }),
    ],
    ...overrides,
  };
}

function build153(options?: {
  projectState?: ProjectState;
  evaluation_at?: string;
  requirements?: AttentionObservationResourceRequirement[];
  bindings?: {
    observation_resource_requirement_key: string;
    resource_declaration_id: string;
  }[];
}) {
  const evaluation_at = options?.evaluation_at ?? AT;
  const requirements = options?.requirements ?? [R1];
  const bindings = options?.bindings ?? [
    {
      observation_resource_requirement_key: requirements[0]!.key,
      resource_declaration_id: RD1,
    },
  ];
  const bindingSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
      {
        observation_resource_requirement_set: mock132Set(requirements),
        specification: {
          candidate_binding_sets: [{ candidate_key: CAND, bindings }],
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

function build161Pipeline(options: {
  projectState?: ProjectState;
  evaluation_at?: string;
  contribution: ResourceRequirementAmount;
  mappings:
    | {
        raw_relation: typeof BELOW | typeof ABOVE;
        interpretation: typeof SUPPORTS | typeof CONTRADICTS;
      }[]
    | null;
}) {
  const quantitySet = build153({
    projectState: options.projectState,
    evaluation_at: options.evaluation_at,
  });
  const contributionSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet(
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_set:
          quantitySet,
        specification: {
          declarations: [
            {
              resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
                firstContextKey(quantitySet),
              declared_potential_contribution_quantity: options.contribution,
            },
          ],
        },
      }
    );
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
  const basisSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSet(
      {
        resource_readiness_declared_potential_contribution_raw_relation_set:
          rawSet,
        resource_readiness_declared_potential_contribution_capacity_relation_interpretation_policy_set:
          policySet,
      }
    );
  return {
    quantitySet,
    bindingKey,
    stateSet:
      buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSet(
        {
          resource_readiness_declared_potential_contribution_capacity_relation_interpretation_basis_set:
            basisSet,
        }
      ),
  };
}

function build163(
  stateSet: ReturnType<typeof build161Pipeline>["stateSet"],
  policies: {
    resource_readiness_observation_context_binding_key: string;
    selected_capacity_declaration_keys: string[];
    operator: typeof ANY | typeof ALL;
  }[]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySet(
    {
      resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
        stateSet,
      specification: { policies },
    }
  );
}

function firstBinding(set: ReturnType<typeof build163>) {
  return set.candidate_assessments[0]!.binding_aggregation_policy_assessments[0]!;
}

function capacityKeysFrom161(
  stateSet: ReturnType<typeof build161Pipeline>["stateSet"]
): string[] {
  return stateSet.candidate_assessments[0]!
    .binding_state_assessments[0]!.source_state_assessments.map(
      (s) => s.canonical_state.capacity_declaration_key
    )
    .sort();
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-163 Explicit Capacity-Compatibility Source Aggregation Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS[0],
      "CURRENT_SELECTED_CAPACITY_SOURCE_PRESENCE_READINESS_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("no Policy → NO_POLICY", () => {
    const { stateSet } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const set = build163(stateSet, []);
    const binding = firstBinding(set);
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_DECLARED"
    );
    assert.equal(binding.aggregation_policy, null);
    assert.equal(
      binding.has_explicit_capacity_compatibility_source_aggregation_policy,
      false
    );
  });

  it("explicit ANY Policy PRESENT", () => {
    const { stateSet, bindingKey } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const members = capacityKeysFrom161(stateSet);
    const set = build163(stateSet, [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        selected_capacity_declaration_keys: members,
        operator: ANY,
      },
    ]);
    const binding = firstBinding(set);
    assert.equal(
      binding.status,
      "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_PRESENT"
    );
    assert.ok(binding.aggregation_policy);
    assert.deepEqual(
      binding.aggregation_policy!.selected_capacity_declaration_keys,
      members.sort()
    );
    assert.equal(binding.aggregation_policy!.operator, ANY);
  });

  it("empty member set rejects", () => {
    const { stateSet, bindingKey } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification(
          stateSet,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key: bindingKey,
                selected_capacity_declaration_keys: [],
                operator: ANY,
              },
            ],
          }
        ),
      /empty member|vacuous/
    );
  });

  it("duplicate members normalize; order invariance", () => {
    assert.deepEqual(
      canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberKeys(
        [CAP_B, CAP_A, CAP_A]
      ),
      [CAP_A, CAP_B]
    );
    const { stateSet, bindingKey } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const members = capacityKeysFrom161(stateSet);
    const a = firstBinding(
      build163(stateSet, [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          selected_capacity_declaration_keys: [...members].reverse(),
          operator: ANY,
        },
      ])
    ).aggregation_policy!;
    const b = firstBinding(
      build163(stateSet, [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          selected_capacity_declaration_keys: members,
          operator: ANY,
        },
      ])
    ).aggregation_policy!;
    assert.equal(a.key, b.key);
  });

  it("member subset / operator identity sensitivity", () => {
    const { stateSet, bindingKey } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const members = capacityKeysFrom161(stateSet);
    assert.ok(members.length >= 2);
    const subset = firstBinding(
      build163(stateSet, [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          selected_capacity_declaration_keys: [members[0]!],
          operator: ANY,
        },
      ])
    ).aggregation_policy!;
    const full = firstBinding(
      build163(stateSet, [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          selected_capacity_declaration_keys: members,
          operator: ANY,
        },
      ])
    ).aggregation_policy!;
    const allOp = firstBinding(
      build163(stateSet, [
        {
          resource_readiness_observation_context_binding_key: bindingKey,
          selected_capacity_declaration_keys: members,
          operator: ALL,
        },
      ])
    ).aggregation_policy!;
    assert.notEqual(subset.key, full.key);
    assert.notEqual(full.key, allOp.key);
  });

  it("unknown / empty Binding target reject", () => {
    const { stateSet } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification(
          stateSet,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key: "missing",
                selected_capacity_declaration_keys: [CAP_A],
                operator: ANY,
              },
            ],
          }
        ),
      /Unknown or stale/
    );
  });

  it("unknown member reject", () => {
    const { stateSet, bindingKey } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification(
          stateSet,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key: bindingKey,
                selected_capacity_declaration_keys: [CAP_D],
                operator: ANY,
              },
            ],
          }
        ),
      /Unknown, stale, or cross-Binding/
    );
  });

  it("cross-RD / cross-Binding member reject", () => {
    const projectState = mockProjectState({
      resource_declarations: [
        resourceDecl(RD1),
        resourceDecl(RD2, { resource_key: "NETWORK", unit: "MBPS" }),
      ],
      resource_availability_declarations: [
        availability(AVAIL_A, RD1),
        availability(AVAIL_B, RD2),
      ],
      resource_capacity_declarations: [
        capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
        capacityDecl(CAP_D, RD2, { kind: "POINT", value: 10 }),
      ],
    });
    const quantitySet = build153({
      projectState,
      requirements: [R1, R2],
      bindings: [
        {
          observation_resource_requirement_key: R1.key,
          resource_declaration_id: RD1,
        },
        {
          observation_resource_requirement_key: R2.key,
          resource_declaration_id: RD2,
        },
      ],
    });
    const declarations = quantitySet.candidate_assessments[0]!
      .binding_quantity_relation_assessments.map((b) => ({
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
            b
          ),
        declared_potential_contribution_quantity: {
          kind: "POINT" as const,
          value: 50,
        },
      }));
    const contributionSet =
      buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet(
        {
          resource_readiness_declared_capacity_required_amount_quantity_relation_set:
            quantitySet,
          specification: { declarations },
        }
      );
    const rawSet =
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSet(
        {
          resource_readiness_declared_capacity_required_amount_quantity_relation_set:
            quantitySet,
          resource_readiness_physical_potential_contribution_declaration_set:
            contributionSet,
        }
      );
    const bindingKeys = quantitySet.candidate_assessments[0]!
      .binding_quantity_relation_assessments.map(
        (b) => b.resource_readiness_observation_context_binding_key
      );
    const policySet =
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySet(
        {
          resource_readiness_physical_potential_contribution_declaration_set:
            contributionSet,
          specification: {
            policies: bindingKeys.map((key) => ({
              resource_readiness_observation_context_binding_key: key,
              mappings: [
                { raw_relation: BELOW, interpretation: SUPPORTS },
                { raw_relation: ABOVE, interpretation: CONTRADICTS },
              ],
            })),
          },
        }
      );
    const basisSet =
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSet(
        {
          resource_readiness_declared_potential_contribution_raw_relation_set:
            rawSet,
          resource_readiness_declared_potential_contribution_capacity_relation_interpretation_policy_set:
            policySet,
        }
      );
    const stateSet =
      buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSet(
        {
          resource_readiness_declared_potential_contribution_capacity_relation_interpretation_basis_set:
            basisSet,
        }
      );
    const binding1Key =
      stateSet.candidate_assessments[0]!.binding_state_assessments.find(
        (b) => b.resource_declaration_id === RD1
      )!.resource_readiness_observation_context_binding_key;
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification(
          stateSet,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key: binding1Key,
                selected_capacity_declaration_keys: [CAP_D],
                operator: ANY,
              },
            ],
          }
        ),
      /cross-Binding|Unknown/
    );
  });

  it("CONTRADICTING and unresolved selected members accepted", () => {
    // contribution 100 vs CAP50→ABOVE CONTRADICTS, CAP100→EQUALS unmapped, CAP200→BELOW SUPPORTS
    const { stateSet, bindingKey } = build161Pipeline({
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
    });
    const sources =
      stateSet.candidate_assessments[0]!.binding_state_assessments[0]!
        .source_state_assessments;
    const contradicting = sources.find(
      (s) =>
        s.canonical_state_value ===
        "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_CONTRADICTING"
    )!;
    const unresolved = sources.find((s) =>
      s.canonical_state_value.includes("UNRESOLVED")
    )!;
    const set = build163(stateSet, [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        selected_capacity_declaration_keys: [
          contradicting.canonical_state.capacity_declaration_key,
          unresolved.canonical_state.capacity_declaration_key,
        ],
        operator: ANY,
      },
    ]);
    assert.equal(
      firstBinding(set).has_explicit_capacity_compatibility_source_aggregation_policy,
      true
    );
  });

  it("explicit subset; unselected ignored; Policy independent of current State values", () => {
    const supporting = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const contradicting = build161Pipeline({
      contribution: { kind: "POINT", value: 120 },
      mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
    });
    assert.equal(supporting.bindingKey, contradicting.bindingKey);
    const members = capacityKeysFrom161(supporting.stateSet);
    const selected = [members[0]!];
    const p1 = firstBinding(
      build163(supporting.stateSet, [
        {
          resource_readiness_observation_context_binding_key:
            supporting.bindingKey,
          selected_capacity_declaration_keys: selected,
          operator: ANY,
        },
      ])
    ).aggregation_policy!;
    const p2 = firstBinding(
      build163(contradicting.stateSet, [
        {
          resource_readiness_observation_context_binding_key:
            contradicting.bindingKey,
          selected_capacity_declaration_keys: selected,
          operator: ANY,
        },
      ])
    ).aggregation_policy!;
    assert.equal(p1.key, p2.key);
    assert.ok(!p1.key.includes("SUPPORTING"));
    assert.ok(!p1.key.includes("CONTRADICTING"));
  });

  it("evaluation-instant independence", () => {
    const t1 = build161Pipeline({
      evaluation_at: AT,
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const t2 = build161Pipeline({
      evaluation_at: AT2,
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    assert.equal(t1.bindingKey, t2.bindingKey);
    const members = capacityKeysFrom161(t1.stateSet);
    const p1 = firstBinding(
      build163(t1.stateSet, [
        {
          resource_readiness_observation_context_binding_key: t1.bindingKey,
          selected_capacity_declaration_keys: members,
          operator: ALL,
        },
      ])
    ).aggregation_policy!;
    const p2 = firstBinding(
      build163(t2.stateSet, [
        {
          resource_readiness_observation_context_binding_key: t2.bindingKey,
          selected_capacity_declaration_keys: members,
          operator: ALL,
        },
      ])
    ).aggregation_policy!;
    assert.equal(p1.key, p2.key);
    assert.ok(!p1.key.includes(AT));
    assert.ok(!p1.key.includes(AT2));
  });

  it("duplicate identical Policy normalize; conflicting reject", () => {
    const { stateSet, bindingKey } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const members = capacityKeysFrom161(stateSet);
    const normalized =
      normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification(
        stateSet,
        {
          policies: [
            {
              resource_readiness_observation_context_binding_key: bindingKey,
              selected_capacity_declaration_keys: members,
              operator: ANY,
            },
            {
              resource_readiness_observation_context_binding_key: bindingKey,
              selected_capacity_declaration_keys: [...members].reverse(),
              operator: ANY,
            },
          ],
        }
      );
    assert.equal(normalized.policies.length, 1);
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification(
          stateSet,
          {
            policies: [
              {
                resource_readiness_observation_context_binding_key: bindingKey,
                selected_capacity_declaration_keys: members,
                operator: ANY,
              },
              {
                resource_readiness_observation_context_binding_key: bindingKey,
                selected_capacity_declaration_keys: members,
                operator: ALL,
              },
            ],
          }
        ),
      /Conflicting/
    );
  });

  it("input immutability / deep-clone", () => {
    const { stateSet, bindingKey } = build161Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const members = capacityKeysFrom161(stateSet);
    const policies = [
      {
        resource_readiness_observation_context_binding_key: bindingKey,
        selected_capacity_declaration_keys: members,
        operator: ANY as typeof ANY,
      },
    ];
    const beforeState = deepClone(stateSet);
    const beforeSpec = deepClone({ policies });
    const a = build163(stateSet, policies);
    assert.deepEqual(stateSet, beforeState);
    assert.deepEqual({ policies }, beforeSpec);
    assert.deepEqual(a, build163(stateSet, policies));
    assert.deepEqual(a, build163(deepClone(stateSet), deepClone(policies)));
  });

  it("Policy key helper excludes State values", () => {
    const key =
      attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          resource_readiness_observation_context_binding_key: "binding",
          resource_declaration_id: RD1,
          selected_capacity_declaration_keys: [CAP_B, CAP_A],
          operator: ANY,
        }
      );
    assert.ok(key.includes(CAP_A));
    assert.ok(key.includes(CAP_B));
    assert.ok(key.includes(ANY));
    assert.ok(!key.includes("SUPPORTING"));
    assert.ok(!key.includes("evaluation"));
  });

  describe("static proofs", () => {
    it("161 identity only; no State-value / Result / readiness / arithmetic", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-types/.test(
          core
        )
      );
      assert.ok(!/canonical-per-source-.*-evidence-state-core/.test(core));
      assert.ok(!/isResolvedAttentionObservation/.test(core));
      assert.ok(!/\.canonical_state_value\b/.test(core));
      assert.ok(
        !/EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SUPPORTING/.test(
          core
        )
      );
      assert.ok(
        !/EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_CONTRADICTING/.test(
          core
        )
      );
      assert.ok(
        !/UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY/.test(
          core
        )
      );
      assert.ok(!/REQUIRE_ALL_SELECTED_CAPACITY_SOURCE/.test(src));
      assert.ok(!/CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS/.test(src));
      assert.ok(!/\bProjectState\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/contribution_required_amount_relation/.test(core));
      assert.ok(!/Math\.(min|max|sum)/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/canonical-per-binding-resource-readiness-evidence-state/.test(core));
      assert.ok(!/canonical-per-requirement-resource-readiness-binding-evidence-composition-state/.test(core));
      assert.ok(!/resource-reservation/.test(core));
      assert.ok(!/can_execute/.test(src));
      assert.ok(/CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED/.test(types));
      assert.ok(/CAPACITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED/.test(types));
      // no ANY/ALL evaluation branches on State
      assert.ok(!/switch\s*\(\s*.*canonical_state/.test(core));
      assert.ok(!/\.some\s*\(\s*.*SUPPORTING/.test(core));
      assert.ok(!/\.every\s*\(\s*.*SUPPORTING/.test(core));
    });
  });
});
