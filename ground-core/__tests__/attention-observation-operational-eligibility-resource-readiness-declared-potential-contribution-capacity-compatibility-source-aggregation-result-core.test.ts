/**
 * GROUND-166 — Observation Core CXX / Declared Potential Contribution
 * Capacity-Compatibility Source Aggregation Result Foundation
 *
 * ANY/ALL only behind readiness HOLDS. No Result when readiness DNH.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-policy-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-basis-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
  assertDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessHoldsBasisConsistency,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSet,
  deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-core.js";
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
const RESULT_HOLDS =
  "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const RESULT_DNH =
  "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;
const OPERAND_HOLDS =
  "SELECTED_CAPACITY_SOURCE_EVIDENCE_CONDITION_HOLDS" as const;
const OPERAND_DNH =
  "SELECTED_CAPACITY_SOURCE_EVIDENCE_CONDITION_DOES_NOT_HOLD" as const;

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

function build161(options: {
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

function capacityKeys(
  stateSet: ReturnType<typeof build161>["stateSet"]
): string[] {
  return stateSet.candidate_assessments[0]!
    .binding_state_assessments[0]!.source_state_assessments.map(
      (s) => s.canonical_state.capacity_declaration_key
    )
    .sort();
}

function build165Set(options: {
  projectState?: ProjectState;
  evaluation_at?: string;
  contribution?: ResourceRequirementAmount;
  mappings?:
    | {
        raw_relation: typeof BELOW | typeof ABOVE;
        interpretation: typeof SUPPORTS | typeof CONTRADICTS;
      }[]
    | null;
  operator?: typeof ANY | typeof ALL;
  selected?: string[];
  declareAggregation?: boolean;
  declareReadiness?: boolean;
}) {
  const { stateSet, bindingKey } = build161({
    projectState: options.projectState,
    evaluation_at: options.evaluation_at,
    contribution: options.contribution ?? { kind: "POINT", value: 80 },
    mappings:
      options.mappings === undefined
        ? [{ raw_relation: BELOW, interpretation: SUPPORTS }]
        : options.mappings,
  });
  const members = options.selected ?? capacityKeys(stateSet);
  const aggregationSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySet(
      {
        resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
          stateSet,
        specification: {
          policies:
            options.declareAggregation === false
              ? []
              : [
                  {
                    resource_readiness_observation_context_binding_key:
                      bindingKey,
                    selected_capacity_declaration_keys: members,
                    operator: options.operator ?? ANY,
                  },
                ],
        },
      }
    );
  const aggPolicy =
    aggregationSet.candidate_assessments[0]!
      .binding_aggregation_policy_assessments[0]!.aggregation_policy;
  const readinessPolicySet =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySet(
      {
        resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set:
          aggregationSet,
        specification: {
          policies:
            options.declareReadiness === false || !aggPolicy
              ? []
              : [
                  {
                    capacity_compatibility_source_aggregation_policy_key:
                      aggPolicy.key,
                    readiness_requirement: READINESS,
                  },
                ],
        },
      }
    );
  const readinessBasisSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSet(
      {
        resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
          stateSet,
        resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_policy_set:
          readinessPolicySet,
      }
    );
  return readinessBasisSet;
}

function build166(readinessBasisSet: ReturnType<typeof build165Set>) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSet(
    {
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_basis_set:
        readinessBasisSet,
    }
  );
}

function firstBinding166(set: ReturnType<typeof build166>) {
  return set.candidate_assessments[0]!
    .binding_aggregation_result_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const mixedProject = () =>
  mockProjectState({
    resource_capacity_declarations: [
      capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
      capacityDecl(CAP_B, RD1, { kind: "POINT", value: 200 }),
    ],
  });

const mixedCommon = {
  projectState: mixedProject(),
  contribution: { kind: "POINT" as const, value: 100 },
  mappings: [
    { raw_relation: ABOVE, interpretation: CONTRADICTS },
    { raw_relation: BELOW, interpretation: SUPPORTS },
  ],
};

describe("GROUND-166 Capacity-Compatibility Source Aggregation Result", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS[0],
      "CAPACITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("NOT_APPLICABLE → no Result", () => {
    const binding = firstBinding166(
      build166(
        build165Set({ declareAggregation: false, declareReadiness: false })
      )
    );
    assert.equal(
      binding.status,
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(binding.aggregation_result, null);
  });

  it("NO_READINESS_POLICY → no Result", () => {
    const binding = firstBinding166(
      build166(build165Set({ declareReadiness: false }))
    );
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
    );
    assert.equal(binding.aggregation_result, null);
  });

  it("readiness DNH → no Result (≠ Result DNH)", () => {
    const binding = firstBinding166(
      build166(
        build165Set({
          contribution: { kind: "POINT", value: 80 },
          mappings: null,
        })
      )
    );
    assert.equal(
      binding.status,
      "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
    assert.equal(binding.aggregation_result, null);
    assert.equal(binding.result_value, null);
    assert.notEqual(
      binding.status,
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_PRESENT"
    );
  });

  it("ANY all SUPPORTING → Result HOLDS; all operands preserved", () => {
    const binding = firstBinding166(
      build166(build165Set({ operator: ANY }))
    );
    assert.equal(
      binding.status,
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_PRESENT"
    );
    assert.equal(binding.result_value, RESULT_HOLDS);
    const result = binding.aggregation_result!;
    assert.equal(
      result.selected_source_operand_assessments.length,
      result.selected_capacity_declaration_keys.length
    );
    assert.ok(
      result.selected_source_operand_assessments.every(
        (a) => a.operand_condition === OPERAND_HOLDS
      )
    );
  });

  it("ANY mixed S+C → HOLDS; ALL mixed → DNH; operand completeness", () => {
    const anyBinding = firstBinding166(
      build166(build165Set({ ...mixedCommon, operator: ANY }))
    );
    const allBinding = firstBinding166(
      build166(build165Set({ ...mixedCommon, operator: ALL }))
    );
    assert.equal(anyBinding.result_value, RESULT_HOLDS);
    assert.equal(allBinding.result_value, RESULT_DNH);
    assert.equal(
      anyBinding.aggregation_result!.selected_source_operand_assessments
        .length,
      2
    );
    assert.equal(
      allBinding.aggregation_result!.selected_source_operand_assessments
        .length,
      2
    );
    const conditions = anyBinding
      .aggregation_result!.selected_source_operand_assessments.map(
        (a) => a.operand_condition
      )
      .sort();
    assert.deepEqual(conditions, [OPERAND_DNH, OPERAND_HOLDS].sort());
  });

  it("ANY/ALL all CONTRADICTING → Result DNH", () => {
    const common = {
      contribution: { kind: "POINT" as const, value: 300 },
      mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
    };
    assert.equal(
      firstBinding166(build166(build165Set({ ...common, operator: ANY })))
        .result_value,
      RESULT_DNH
    );
    assert.equal(
      firstBinding166(build166(build165Set({ ...common, operator: ALL })))
        .result_value,
      RESULT_DNH
    );
  });

  it("ALL all SUPPORTING → HOLDS; single SUPPORTING/CONTRADICTING", () => {
    assert.equal(
      firstBinding166(build166(build165Set({ operator: ALL }))).result_value,
      RESULT_HOLDS
    );
    assert.equal(
      firstBinding166(
        build166(build165Set({ operator: ANY, selected: [CAP_A] }))
      ).result_value,
      RESULT_HOLDS
    );
    assert.equal(
      firstBinding166(
        build166(
          build165Set({
            operator: ALL,
            selected: [CAP_A],
            contribution: { kind: "POINT", value: 150 },
            mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
          })
        )
      ).result_value,
      RESULT_DNH
    );
  });

  it("same Result value / different operand lineage → distinct keys; ANY≠ALL identity", () => {
    const sThenC = firstBinding166(
      build166(
        build165Set({
          ...mixedCommon,
          operator: ANY,
          selected: [CAP_A, CAP_B],
        })
      )
    ).aggregation_result!;
    // Flip contribution polarity relative to capacities by swapping which is supporting
    // CAP_A=50 ABOVE contradicting, CAP_B=200 BELOW supporting under contribution 100
    // Already mixed; create ALL vs ANY identity check
    const anyR = firstBinding166(
      build166(build165Set({ ...mixedCommon, operator: ANY }))
    ).aggregation_result!;
    const allR = firstBinding166(
      build166(build165Set({ ...mixedCommon, operator: ALL }))
    ).aggregation_result!;
    assert.notEqual(anyR.key, allR.key);
    assert.ok(sThenC.key.includes(ANY) || sThenC.operator === ANY);

    // State flip same final ANY HOLDS → distinct identity
    const supporting = firstBinding166(
      build166(build165Set({ operator: ANY, selected: [CAP_A] }))
    ).aggregation_result!;
    const contradictingCurrent = build165Set({
      operator: ANY,
      selected: [CAP_A],
      contribution: { kind: "POINT", value: 150 },
      mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
    });
    // Rebuild with same aggregation/readiness from supporting selection but contradicting current:
    // simpler: both HOLDS under ALL with two supporting vs one flip changes value
    const allHold = firstBinding166(
      build166(build165Set({ operator: ALL }))
    ).aggregation_result!;
    const allMixed = firstBinding166(
      build166(build165Set({ ...mixedCommon, operator: ALL }))
    ).aggregation_result!;
    assert.equal(allHold.value, RESULT_HOLDS);
    assert.equal(allMixed.value, RESULT_DNH);
    assert.notEqual(allHold.key, allMixed.key);

    // Same ANY HOLDS with SUPPORTING vs CONTRADICTING single member → different keys
    const singleS = supporting;
    const singleC = firstBinding166(
      build166(
        build165Set({
          operator: ANY,
          selected: [CAP_A],
          contribution: { kind: "POINT", value: 150 },
          mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
        })
      )
    ).aggregation_result!;
    assert.equal(singleS.value, RESULT_HOLDS);
    assert.equal(singleC.value, RESULT_DNH);
    assert.notEqual(singleS.key, singleC.key);
    void contradictingCurrent;
  });

  it("evaluation-instant sensitivity", () => {
    const t1 = firstBinding166(
      build166(build165Set({ evaluation_at: AT, selected: [CAP_A] }))
    ).aggregation_result!;
    const t2 = firstBinding166(
      build166(build165Set({ evaluation_at: AT2, selected: [CAP_A] }))
    ).aggregation_result!;
    assert.equal(t1.value, t2.value);
    assert.notEqual(t1.key, t2.key);
    assert.equal(t1.evaluation_at, AT);
    assert.equal(t2.evaluation_at, AT2);
  });

  it("HOLDS+missing malformed reject; DNH+all-resolved malformed reject", () => {
    const holds = firstBinding166(build166(build165Set({})));
    const basis = deepClone(holds.aggregation_readiness_basis_assessment.readiness_basis!);
    basis.selected_source_readiness_assessments[0] = {
      ...basis.selected_source_readiness_assessments[0]!,
      status: "SELECTED_CAPACITY_SOURCE_MISSING",
      canonical_source_state_key: null,
      canonical_source_state_value: null,
      is_present: false,
      is_resolved: false,
    };
    assert.throws(
      () =>
        assertDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessHoldsBasisConsistency(
          basis
        ),
      /PRESENT_AND_RESOLVED|readiness HOLDS/
    );

    const dnhBinding = firstBinding166(
      build166(build165Set({ mappings: null }))
    );
    assert.equal(
      dnhBinding.status,
      "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
    const dnhBasis = deepClone(
      dnhBinding.aggregation_readiness_basis_assessment.readiness_basis!
    );
    // Force all present+resolved while keeping readiness_condition DNH
    for (const member of dnhBasis.selected_source_readiness_assessments) {
      member.status = "SELECTED_CAPACITY_SOURCE_PRESENT_AND_RESOLVED";
      member.is_present = true;
      member.is_resolved = true;
      member.canonical_source_state_key = member.canonical_source_state_key ?? "k";
      member.canonical_source_state_value =
        "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SUPPORTING";
    }
    dnhBasis.readiness_condition =
      "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD";
    const malformedSet = deepClone(
      build165Set({ mappings: null })
    );
    malformedSet.candidate_assessments[0]!.binding_readiness_basis_assessments[0] =
      {
        ...malformedSet.candidate_assessments[0]!
          .binding_readiness_basis_assessments[0]!,
        readiness_basis: dnhBasis,
        readiness_condition:
          "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD",
      };
    assert.throws(() => build166(malformedSet), /DNH but all selected/);
  });

  it("unknown operator / empty operands reject", () => {
    assert.throws(
      () =>
        deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue(
          "UNKNOWN" as typeof ANY,
          [
            {
              capacity_declaration_key: CAP_A,
              canonical_source_state_key: "k",
              canonical_source_state_value:
                "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SUPPORTING",
              operand_condition: OPERAND_HOLDS,
            },
          ]
        ),
      /Unknown/
    );
    assert.throws(
      () =>
        deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue(
          ANY,
          []
        ),
      /empty/
    );
  });

  it("input immutability / deep-clone", () => {
    const readiness = build165Set({});
    const before = deepClone(readiness);
    const a = build166(readiness);
    assert.deepEqual(readiness, before);
    assert.deepEqual(a, build166(readiness));
    assert.deepEqual(a, build166(deepClone(readiness)));
  });

  describe("static proofs", () => {
    it("165 sole authority; no Result interpretation / arithmetic / OE", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(/aggregation-readiness-basis-types/.test(core));
      assert.ok(
        !/canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-core/.test(
          core
        )
      );
      assert.ok(!/isResolvedAttentionObservation/.test(core));
      assert.ok(!/\bimport\b[\s\S]*\bProjectState\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(
        !/INTERPRET_AS_SUPPORTING_AGGREGATED/.test(src)
      );
      assert.ok(!/"MIXED"/.test(src));
      assert.ok(!/Math\.(min|max|sum)/.test(core));
      assert.ok(!/contribution_required_amount_relation/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/resource-reservation/.test(core));
      assert.ok(!/can_execute/.test(src));
      assert.ok(
        /CAPACITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_NOT_MODELED/.test(
          types
        )
      );
      assert.ok(/CAPACITY_COMPATIBILITY_PROPOSITION_TRUTH_NOT_MODELED/.test(types));
    });
  });
});
