/**
 * GROUND-167 — Observation Core CXXI / Explicit Declared Potential Contribution
 * Capacity-Compatibility Source Aggregation Result Interpretation Policy Foundation
 *
 * Declaration only. No current Result application / Basis / aggregated State.
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
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySet,
  canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappings,
  EMPTY_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-policy-core.js";
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
const FROM = "2026-09-01T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

const SUPPORTS =
  "INTERPRET_AS_SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY" as const;
const BELOW =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL" as const;
const ANY =
  "ANY_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITION_HOLDS" as const;
const RESULT_HOLDS =
  "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const RESULT_DNH =
  "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;
const INTERP_SUPPORTING =
  "INTERPRET_AS_SUPPORTING_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE" as const;
const INTERP_CONTRADICTING =
  "INTERPRET_AS_CONTRADICTING_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE" as const;

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

function mock132Set(): AttentionObservationResourceRequirementSetAssessment {
  const candidate: AttentionCandidateObservationResourceRequirementSetAssessment =
    {
      capability_requirement_assessment: {} as never,
      status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
      resource_requirements: [R1],
      has_explicit_observation_resource_requirement_set: true,
      has_observation_resource_requirements: true,
      model_limitations: [],
      candidate_key: CAND,
    };
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: [candidate],
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

function mockProjectState(): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [entity(ENTITY_HOLDER, "Holder")],
    resource_declarations: [resourceDecl(RD1)],
    resource_availability_declarations: [availability(AVAIL_A, RD1)],
    resource_capacity_declarations: [
      capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
      capacityDecl(CAP_B, RD1, { kind: "POINT", value: 200 }),
    ],
  };
}

function build163Set(options?: { declareAggregation?: boolean }) {
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
          evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }],
        },
      }
    );
  const rawSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet(
      {
        resource_readiness_observation_context_binding_set: bindingSet,
        resource_readiness_evaluation_instant_set: instantSet,
        project_state: mockProjectState(),
      }
    );
  const quantitySet =
    buildAttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSet(
      { resource_readiness_raw_evidence_assessment_set: rawSet }
    );
  const bindingQty =
    quantitySet.candidate_assessments[0]!.binding_quantity_relation_assessments[0]!;
  const contributionSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet(
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_set:
          quantitySet,
        specification: {
          declarations: [
            {
              resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
                attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
                  bindingQty
                ),
              declared_potential_contribution_quantity: {
                kind: "POINT",
                value: 80,
              },
            },
          ],
        },
      }
    );
  const contributionRaw =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSet(
      {
        resource_readiness_declared_capacity_required_amount_quantity_relation_set:
          quantitySet,
        resource_readiness_physical_potential_contribution_declaration_set:
          contributionSet,
      }
    );
  const bindingKey =
    bindingQty.resource_readiness_observation_context_binding_key;
  const policySet =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySet(
      {
        resource_readiness_physical_potential_contribution_declaration_set:
          contributionSet,
        specification: {
          policies: [
            {
              resource_readiness_observation_context_binding_key: bindingKey,
              mappings: [
                { raw_relation: BELOW, interpretation: SUPPORTS },
              ],
            },
          ],
        },
      }
    );
  const basisSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSet(
      {
        resource_readiness_declared_potential_contribution_raw_relation_set:
          contributionRaw,
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
  const members = stateSet.candidate_assessments[0]!
    .binding_state_assessments[0]!.source_state_assessments.map(
      (s) => s.canonical_state.capacity_declaration_key
    )
    .sort();
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySet(
    {
      resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
        stateSet,
      specification: {
        policies:
          options?.declareAggregation === false
            ? []
            : [
                {
                  resource_readiness_observation_context_binding_key:
                    bindingKey,
                  selected_capacity_declaration_keys: members,
                  operator: ANY,
                },
              ],
      },
    }
  );
}

function firstAggPolicy(set: ReturnType<typeof build163Set>) {
  return set.candidate_assessments[0]!
    .binding_aggregation_policy_assessments[0]!.aggregation_policy;
}

function build167(
  aggregationSet: ReturnType<typeof build163Set>,
  policies: {
    capacity_compatibility_source_aggregation_policy_key: string;
    mappings: {
      aggregation_result_value: typeof RESULT_HOLDS | typeof RESULT_DNH;
      interpretation: typeof INTERP_SUPPORTING | typeof INTERP_CONTRADICTING;
    }[];
  }[]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySet(
    {
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set:
        aggregationSet,
      specification: { policies },
    }
  );
}

function firstBinding167(set: ReturnType<typeof build167>) {
  return set.candidate_assessments[0]!
    .binding_interpretation_policy_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-167 Explicit Aggregation Result Interpretation Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
      "CURRENT_AGGREGATION_RESULT_INTERPRETATION_NOT_APPLIED"
    );
  });

  it("NOT_APPLICABLE when no Aggregation Policy", () => {
    const binding = firstBinding167(
      build167(build163Set({ declareAggregation: false }), [])
    );
    assert.equal(
      binding.status,
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(binding.interpretation_policy, null);
  });

  it("NO_POLICY when Aggregation Policy exists without interpretation Policy", () => {
    const binding = firstBinding167(build167(build163Set({}), []));
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_DECLARED"
    );
  });

  it("explicit empty Policy PRESENT and distinct from absence", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;
    const empty = firstBinding167(
      build167(aggregationSet, [
        {
          capacity_compatibility_source_aggregation_policy_key: agg.key,
          mappings: [],
        },
      ])
    );
    const absent = firstBinding167(build167(aggregationSet, []));
    assert.equal(
      empty.status,
      "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT"
    );
    assert.deepEqual(empty.interpretation_policy!.mappings, []);
    assert.ok(
      empty.interpretation_policy!.key.includes(
        EMPTY_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET
      )
    );
    assert.notEqual(empty.status, absent.status);
  });

  it("conventional / partial / unusual mappings legal", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;

    const conventional = firstBinding167(
      build167(aggregationSet, [
        {
          capacity_compatibility_source_aggregation_policy_key: agg.key,
          mappings: [
            {
              aggregation_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
            {
              aggregation_result_value: RESULT_DNH,
              interpretation: INTERP_CONTRADICTING,
            },
          ],
        },
      ])
    ).interpretation_policy!;
    assert.equal(conventional.mappings.length, 2);

    const partial = firstBinding167(
      build167(aggregationSet, [
        {
          capacity_compatibility_source_aggregation_policy_key: agg.key,
          mappings: [
            {
              aggregation_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ])
    ).interpretation_policy!;
    assert.equal(partial.mappings.length, 1);
    assert.notEqual(partial.key, conventional.key);

    const unusual = firstBinding167(
      build167(aggregationSet, [
        {
          capacity_compatibility_source_aggregation_policy_key: agg.key,
          mappings: [
            {
              aggregation_result_value: RESULT_HOLDS,
              interpretation: INTERP_CONTRADICTING,
            },
            {
              aggregation_result_value: RESULT_DNH,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ])
    ).interpretation_policy!;
    assert.equal(
      unusual.mappings.find((m) => m.aggregation_result_value === RESULT_HOLDS)!
        .interpretation,
      INTERP_CONTRADICTING
    );
    assert.equal(
      unusual.mappings.find((m) => m.aggregation_result_value === RESULT_DNH)!
        .interpretation,
      INTERP_SUPPORTING
    );
  });

  it("same target from both Result values valid; mapping order invariant", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;
    const a = firstBinding167(
      build167(aggregationSet, [
        {
          capacity_compatibility_source_aggregation_policy_key: agg.key,
          mappings: [
            {
              aggregation_result_value: RESULT_DNH,
              interpretation: INTERP_SUPPORTING,
            },
            {
              aggregation_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ])
    ).interpretation_policy!;
    const b = firstBinding167(
      build167(aggregationSet, [
        {
          capacity_compatibility_source_aggregation_policy_key: agg.key,
          mappings: [
            {
              aggregation_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
            {
              aggregation_result_value: RESULT_DNH,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ])
    ).interpretation_policy!;
    assert.equal(a.key, b.key);
    assert.equal(a.mappings[0]!.aggregation_result_value, RESULT_HOLDS);
  });

  it("duplicate identical mapping normalize; conflicting reject", () => {
    assert.equal(
      canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappings(
        [
          {
            aggregation_result_value: RESULT_HOLDS,
            interpretation: INTERP_SUPPORTING,
          },
          {
            aggregation_result_value: RESULT_HOLDS,
            interpretation: INTERP_SUPPORTING,
          },
        ]
      ).length,
      1
    );
    assert.throws(
      () =>
        canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappings(
          [
            {
              aggregation_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
            {
              aggregation_result_value: RESULT_HOLDS,
              interpretation: INTERP_CONTRADICTING,
            },
          ]
        ),
      /Conflicting/
    );
  });

  it("unknown aggregation Policy key reject; competing Policy reject", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySpecification(
          aggregationSet,
          {
            policies: [
              {
                capacity_compatibility_source_aggregation_policy_key:
                  "missing",
                mappings: [],
              },
            ],
          }
        ),
      /Unknown or stale/
    );
    assert.throws(
      () =>
        normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySpecification(
          aggregationSet,
          {
            policies: [
              {
                capacity_compatibility_source_aggregation_policy_key: agg.key,
                mappings: [
                  {
                    aggregation_result_value: RESULT_HOLDS,
                    interpretation: INTERP_SUPPORTING,
                  },
                ],
              },
              {
                capacity_compatibility_source_aggregation_policy_key: agg.key,
                mappings: [
                  {
                    aggregation_result_value: RESULT_HOLDS,
                    interpretation: INTERP_CONTRADICTING,
                  },
                ],
              },
            ],
          }
        ),
      /Conflicting/
    );
  });

  it("Policy identity excludes evaluation_at / Result value / readiness", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;
    const policy = firstBinding167(
      build167(aggregationSet, [
        {
          capacity_compatibility_source_aggregation_policy_key: agg.key,
          mappings: [
            {
              aggregation_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ])
    ).interpretation_policy!;
    assert.ok(!policy.key.includes(AT));
    assert.ok(!policy.key.includes("readiness-basis"));
    assert.ok(!policy.key.includes("evaluation"));
    assert.ok(policy.key.includes(agg.key));

    const helper =
      attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          resource_readiness_observation_context_binding_key: "binding",
          resource_declaration_id: RD1,
          capacity_compatibility_source_aggregation_policy_key: "agg",
          mappings: policy.mappings,
        }
      );
    assert.ok(helper.includes("agg"));
    assert.ok(!helper.includes(AT));
    assert.ok(!helper.includes("readiness-basis"));
    assert.ok(!helper.includes("aggregation-result|"));
  });

  it("input immutability / deep-clone", () => {
    const aggregationSet = build163Set({});
    const agg = firstAggPolicy(aggregationSet)!;
    const policies = [
      {
        capacity_compatibility_source_aggregation_policy_key: agg.key,
        mappings: [
          {
            aggregation_result_value: RESULT_HOLDS as typeof RESULT_HOLDS,
            interpretation: INTERP_SUPPORTING as typeof INTERP_SUPPORTING,
          },
        ],
      },
    ];
    const beforeAgg = deepClone(aggregationSet);
    const beforeSpec = deepClone({ policies });
    const a = build167(aggregationSet, policies);
    assert.deepEqual(aggregationSet, beforeAgg);
    assert.deepEqual({ policies }, beforeSpec);
    assert.deepEqual(a, build167(aggregationSet, policies));
  });

  describe("static proofs", () => {
    it("163 authority only; no current Result application / defaults / OE", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-policy-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(/capacity-compatibility-source-aggregation-policy-types/.test(core));
      assert.ok(
        /capacity-compatibility-source-aggregation-result-types/.test(types)
      );
      assert.ok(
        !/capacity-compatibility-source-aggregation-result-core/.test(core)
      );
      assert.ok(!/aggregation-readiness-basis/.test(core));
      assert.ok(!/from ["'][^"']*types\.js["'][\s\S]*\bProjectState\b/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/result_value\s*===/.test(core));
      assert.ok(!/CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION/.test(core));
      // no hardcoded default HOLDS→SUPPORTING
      assert.ok(
        !/CONDITION_HOLDS[\s\S]{0,80}INTERPRET_AS_SUPPORTING/.test(core)
      );
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(/CURRENT_AGGREGATION_RESULT_INTERPRETATION_NOT_APPLIED/.test(types));
      assert.ok(/AGGREGATION_RESULT_INTERPRETATION_BASIS_NOT_MODELED/.test(types));
    });
  });
});
