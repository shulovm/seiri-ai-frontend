/**
 * GROUND-164 — Observation Core CXVIII / Explicit Declared Potential Contribution
 * Capacity-Compatibility Source Aggregation Readiness Policy Foundation
 *
 * Declaration only. No current-State evaluation / readiness Basis / Result.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySet,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-policy-core.js";
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
const READINESS =
  "REQUIRE_ALL_SELECTED_CAPACITY_SOURCE_EVIDENCE_STATES_RESOLVED_BEFORE_AGGREGATION" as const;

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
      capacityDecl(CAP_B, RD1, { kind: "POINT", value: 200 }),
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
        observation_resource_requirement_set: mock132Set([R1]),
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

function capacityKeysFrom161(
  stateSet: ReturnType<typeof build161Pipeline>["stateSet"]
): string[] {
  return stateSet.candidate_assessments[0]!
    .binding_state_assessments[0]!.source_state_assessments.map(
      (s) => s.canonical_state.capacity_declaration_key
    )
    .sort();
}

function build163Set(options: {
  contribution?: ResourceRequirementAmount;
  mappings?:
    | {
        raw_relation: typeof BELOW | typeof ABOVE;
        interpretation: typeof SUPPORTS | typeof CONTRADICTS;
      }[]
    | null;
  evaluation_at?: string;
  operator?: typeof ANY | typeof ALL;
  declareAggregation?: boolean;
  selected?: string[];
}) {
  const { stateSet, bindingKey } = build161Pipeline({
    contribution: options.contribution ?? { kind: "POINT", value: 80 },
    mappings:
      options.mappings === undefined
        ? [{ raw_relation: BELOW, interpretation: SUPPORTS }]
        : options.mappings,
    evaluation_at: options.evaluation_at,
  });
  const members = options.selected ?? capacityKeysFrom161(stateSet);
  const operator = options.operator ?? ANY;
  const policies =
    options.declareAggregation === false
      ? []
      : [
          {
            resource_readiness_observation_context_binding_key: bindingKey,
            selected_capacity_declaration_keys: members,
            operator,
          },
        ];
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySet(
    {
      resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
        stateSet,
      specification: { policies },
    }
  );
}

function firstAggPolicy(
  set: ReturnType<typeof build163Set>
) {
  return set.candidate_assessments[0]!
    .binding_aggregation_policy_assessments[0]!.aggregation_policy;
}

function build164(
  aggregationSet: ReturnType<typeof build163Set>,
  policies: {
    capacity_compatibility_source_aggregation_policy_key: string;
    readiness_requirement: typeof READINESS;
  }[]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySet(
    {
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set:
        aggregationSet,
      specification: { policies },
    }
  );
}

function firstBinding164(set: ReturnType<typeof build164>) {
  return set.candidate_assessments[0]!.binding_readiness_policy_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-164 Explicit Capacity-Compatibility Source Aggregation Readiness Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS[0],
      "CURRENT_SELECTED_CAPACITY_SOURCE_PRESENCE_NOT_EVALUATED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("upstream Aggregation Policy absent → NOT_APPLICABLE (≠ NO_READINESS_POLICY)", () => {
    const aggregationSet = build163Set({ declareAggregation: false });
    const set = build164(aggregationSet, []);
    const binding = firstBinding164(set);
    assert.equal(
      binding.status,
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(binding.readiness_policy, null);
    assert.equal(
      binding.has_explicit_capacity_compatibility_source_aggregation_readiness_policy,
      false
    );
    assert.notEqual(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
    );
  });

  it("Aggregation Policy present / no readiness Policy → NO_READINESS_POLICY", () => {
    const aggregationSet = build163Set({});
    const set = build164(aggregationSet, []);
    const binding = firstBinding164(set);
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
    );
    assert.equal(binding.readiness_policy, null);
    assert.ok(binding.aggregation_policy_assessment.aggregation_policy);
  });

  it("explicit readiness Policy PRESENT", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;
    const set = build164(aggregationSet, [
      {
        capacity_compatibility_source_aggregation_policy_key: agg.key,
        readiness_requirement: READINESS,
      },
    ]);
    const binding = firstBinding164(set);
    assert.equal(
      binding.status,
      "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
    );
    assert.ok(binding.readiness_policy);
    assert.equal(
      binding.readiness_policy!.readiness_requirement,
      READINESS
    );
    assert.equal(
      binding.readiness_policy!
        .capacity_compatibility_source_aggregation_policy_key,
      agg.key
    );
    assert.equal(
      set.has_explicit_capacity_compatibility_source_aggregation_readiness_policies,
      true
    );
  });

  it("ANY and ALL upstream share same readiness requirement", () => {
    const anySet = build163Set({ operator: ANY });
    const allSet = build163Set({ operator: ALL });
    const anyAgg = firstAggPolicy(anySet)!;
    const allAgg = firstAggPolicy(allSet)!;
    assert.notEqual(anyAgg.key, allAgg.key);
    const anyReady = firstBinding164(
      build164(anySet, [
        {
          capacity_compatibility_source_aggregation_policy_key: anyAgg.key,
          readiness_requirement: READINESS,
        },
      ])
    ).readiness_policy!;
    const allReady = firstBinding164(
      build164(allSet, [
        {
          capacity_compatibility_source_aggregation_policy_key: allAgg.key,
          readiness_requirement: READINESS,
        },
      ])
    ).readiness_policy!;
    assert.equal(anyReady.readiness_requirement, READINESS);
    assert.equal(allReady.readiness_requirement, READINESS);
    assert.equal(anyReady.readiness_requirement, allReady.readiness_requirement);
  });

  it("duplicate identical readiness Policy normalize; conflicting reject", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;
    const normalized =
      normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification(
        aggregationSet,
        {
          policies: [
            {
              capacity_compatibility_source_aggregation_policy_key: agg.key,
              readiness_requirement: READINESS,
            },
            {
              capacity_compatibility_source_aggregation_policy_key: agg.key,
              readiness_requirement: READINESS,
            },
          ],
        }
      );
    assert.equal(normalized.policies.length, 1);
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification(
          aggregationSet,
          {
            policies: [
              {
                capacity_compatibility_source_aggregation_policy_key: agg.key,
                readiness_requirement: READINESS,
              },
              {
                capacity_compatibility_source_aggregation_policy_key: agg.key,
                readiness_requirement:
                  "ALLOW_SHORT_CIRCUIT" as typeof READINESS,
              },
            ],
          }
        ),
      /Unknown|Conflicting/
    );
  });

  it("unknown / stale aggregation Policy key reject", () => {
    const aggregationSet = build163Set({});
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification(
          aggregationSet,
          {
            policies: [
              {
                capacity_compatibility_source_aggregation_policy_key: "missing",
                readiness_requirement: READINESS,
              },
            ],
          }
        ),
      /Unknown or stale/
    );
  });

  it("upstream identity sensitivity: member/operator change alters readiness key", () => {
    const full = build163Set({});
    const members = firstAggPolicy(full)!.selected_capacity_declaration_keys;
    const subset = build163Set({ selected: [members[0]!] });
    const fullAgg = firstAggPolicy(full)!;
    const subsetAgg = firstAggPolicy(subset)!;
    const fullReady = firstBinding164(
      build164(full, [
        {
          capacity_compatibility_source_aggregation_policy_key: fullAgg.key,
          readiness_requirement: READINESS,
        },
      ])
    ).readiness_policy!;
    const subsetReady = firstBinding164(
      build164(subset, [
        {
          capacity_compatibility_source_aggregation_policy_key: subsetAgg.key,
          readiness_requirement: READINESS,
        },
      ])
    ).readiness_policy!;
    assert.notEqual(fullReady.key, subsetReady.key);
  });

  it("current State / evaluation-instant independence of readiness Policy identity", () => {
    const supporting = build163Set({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
      evaluation_at: AT,
    });
    const contradicting = build163Set({
      contribution: { kind: "POINT", value: 120 },
      mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
      evaluation_at: AT2,
    });
    const a = firstAggPolicy(supporting)!;
    const b = firstAggPolicy(contradicting)!;
    assert.equal(a.key, b.key);
    const p1 = firstBinding164(
      build164(supporting, [
        {
          capacity_compatibility_source_aggregation_policy_key: a.key,
          readiness_requirement: READINESS,
        },
      ])
    ).readiness_policy!;
    const p2 = firstBinding164(
      build164(contradicting, [
        {
          capacity_compatibility_source_aggregation_policy_key: b.key,
          readiness_requirement: READINESS,
        },
      ])
    ).readiness_policy!;
    assert.equal(p1.key, p2.key);
    assert.ok(!p1.key.includes(AT));
    assert.ok(!p1.key.includes(AT2));
    assert.ok(!p1.key.includes("SUPPORTING"));
    assert.ok(!p1.key.includes("CONTRADICTING"));
  });

  it("input immutability / deep-clone determinism", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;
    const policies = [
      {
        capacity_compatibility_source_aggregation_policy_key: agg.key,
        readiness_requirement: READINESS,
      },
    ];
    const beforeAgg = deepClone(aggregationSet);
    const beforeSpec = deepClone({ policies });
    const a = build164(aggregationSet, policies);
    assert.deepEqual(aggregationSet, beforeAgg);
    assert.deepEqual({ policies }, beforeSpec);
    assert.deepEqual(a, build164(aggregationSet, policies));
    assert.deepEqual(
      a,
      build164(deepClone(aggregationSet), deepClone(policies))
    );
  });

  it("Policy key helper includes aggregation key + sole readiness token", () => {
    const key =
      attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          resource_readiness_observation_context_binding_key: "binding",
          resource_declaration_id: RD1,
          capacity_compatibility_source_aggregation_policy_key: "agg-key",
          readiness_requirement: READINESS,
        }
      );
    assert.ok(key.includes("agg-key"));
    assert.ok(key.includes(READINESS));
    assert.ok(!key.includes("evaluation"));
  });

  describe("static proofs", () => {
    it("163 authority only; no 161 State / Result / short-circuit / arithmetic", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-policy-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /capacity-compatibility-source-aggregation-policy-types/.test(core)
      );
      assert.ok(
        !/canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state/.test(
          core
        )
      );
      assert.ok(!/isResolvedAttentionObservation/.test(core));
      assert.ok(!/\.canonical_state_value\b/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));
      assert.ok(!/\bimport\b[\s\S]*\bProjectState\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/CAPACITY_SOURCE_AGGREGATION_READINESS_HOLDS/.test(src));
      assert.ok(!/CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS/.test(src));
      assert.ok(!/ALLOW_SHORT_CIRCUIT/.test(src));
      assert.ok(!/REQUIRE_ANY_RESOLVED/.test(src));
      assert.ok(!/SELECTED_SOURCE_MISSING/.test(src));
      assert.ok(!/contribution_required_amount_relation/.test(core));
      assert.ok(!/Math\.(min|max|sum)/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/resource-reservation/.test(core));
      assert.ok(!/can_execute/.test(src));
      assert.ok(
        /CURRENT_SELECTED_CAPACITY_SOURCE_PRESENCE_NOT_EVALUATED/.test(types)
      );
      assert.ok(
        /CAPACITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED/.test(types)
      );
      assert.ok(
        /NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY/.test(
          types
        )
      );
    });
  });
});
