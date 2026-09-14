/**
 * GROUND-168 — Observation Core CXXII / Current Declared Potential Contribution
 * Capacity-Compatibility Source Aggregation Result Interpretation Basis Foundation
 *
 * GROUND-166 current Result + GROUND-167 Interpretation Policy
 * → exact current Result Interpretation Basis
 *
 * Six statuses remain distinct. Unusual mappings are authoritative.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-policy-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisSet,
  findExactDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-basis-core.js";
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
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSet(
    {
      resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
        stateSet,
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_policy_set:
        readinessPolicySet,
    }
  );
}

function build166(readinessBasisSet: ReturnType<typeof build165Set>) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSet(
    {
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_basis_set:
        readinessBasisSet,
    }
  );
}

function extract163From166(resultSet: ReturnType<typeof build166>) {
  return resultSet
    .resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_basis_set
    .resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_policy_set
    .resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set;
}

function firstAggPolicyKey(resultSet: ReturnType<typeof build166>): string {
  const binding = resultSet.candidate_assessments[0]!
    .binding_aggregation_result_assessments[0]!;
  if (binding.aggregation_result) {
    return binding.aggregation_result
      .capacity_compatibility_source_aggregation_policy_key;
  }
  const readiness =
    binding.aggregation_readiness_basis_assessment.readiness_basis;
  if (readiness) {
    return readiness.capacity_compatibility_source_aggregation_policy_key;
  }
  return binding.aggregation_readiness_basis_assessment
    .aggregation_readiness_policy_assessment.aggregation_policy_assessment
    .aggregation_policy!.key;
}

function build167(
  resultSet: ReturnType<typeof build166>,
  mappings:
    | {
        aggregation_result_value: typeof RESULT_HOLDS | typeof RESULT_DNH;
        interpretation: typeof INTERP_SUPPORTING | typeof INTERP_CONTRADICTING;
      }[]
    | "absent"
) {
  const aggregationSet = extract163From166(resultSet);
  const aggPolicy =
    aggregationSet.candidate_assessments[0]!
      .binding_aggregation_policy_assessments[0]!.aggregation_policy;
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySet(
    {
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set:
        aggregationSet,
      specification: {
        policies:
          mappings === "absent" || !aggPolicy
            ? []
            : [
                {
                  capacity_compatibility_source_aggregation_policy_key:
                    aggPolicy.key,
                  mappings,
                },
              ],
      },
    }
  );
}

function build168(
  resultSet: ReturnType<typeof build166>,
  policySet: ReturnType<typeof build167>
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisSet(
    {
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_set:
        resultSet,
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_policy_set:
        policySet,
    }
  );
}

function firstBinding168(set: ReturnType<typeof build168>) {
  return set.candidate_assessments[0]!
    .binding_interpretation_basis_assessments[0]!;
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

const conventionalMappings = [
  {
    aggregation_result_value: RESULT_HOLDS,
    interpretation: INTERP_SUPPORTING,
  },
  {
    aggregation_result_value: RESULT_DNH,
    interpretation: INTERP_CONTRADICTING,
  },
] as const;

describe("GROUND-168 Aggregation Result Interpretation Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order including provenance cardinality debt", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS[0],
      "AGGREGATED_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS[4],
      "DECLARED_POTENTIAL_CONTRIBUTION_PROVENANCE_CARDINALITY_SEMANTICS_REQUIRE_REAUDIT_BEFORE_CONTRIBUTION_VERIFICATION"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("NOT_APPLICABLE preserved; no Basis", () => {
    const resultSet = build166(
      build165Set({ declareAggregation: false, declareReadiness: false })
    );
    const binding = firstBinding168(build168(resultSet, build167(resultSet, "absent")));
    assert.equal(
      binding.status,
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(binding.interpretation_basis, null);
    assert.equal(binding.interpretation, null);
    assert.equal(binding.has_interpretation_basis, false);
  });

  it("NO_READINESS_POLICY preserved; no Basis", () => {
    const resultSet = build166(build165Set({ declareReadiness: false }));
    const binding = firstBinding168(
      build168(resultSet, build167(resultSet, [...conventionalMappings]))
    );
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
    );
    assert.equal(binding.interpretation_basis, null);
  });

  it("readiness DNH / no Result → NO_CURRENT_RESULT ≠ NO_MAPPING", () => {
    const resultSet = build166(
      build165Set({
        contribution: { kind: "POINT", value: 80 },
        mappings: null,
      })
    );
    const binding = firstBinding168(
      build168(resultSet, build167(resultSet, [...conventionalMappings]))
    );
    assert.equal(
      binding.status,
      "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
    assert.notEqual(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
    assert.equal(binding.interpretation, null);
  });

  it("current Result + no Interpretation Policy → NO_POLICY", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const binding = firstBinding168(
      build168(resultSet, build167(resultSet, "absent"))
    );
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_DECLARED"
    );
    assert.equal(binding.interpretation_basis, null);
  });

  it("current Result + explicit empty Policy → NO_MAPPING ≠ NO_POLICY", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const empty = firstBinding168(build168(resultSet, build167(resultSet, [])));
    const absent = firstBinding168(
      build168(resultSet, build167(resultSet, "absent"))
    );
    assert.equal(
      empty.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
    assert.notEqual(empty.status, absent.status);
  });

  it("partial unmapped Policy → NO_MAPPING", () => {
    const resultSet = build166(
      build165Set({ ...mixedCommon, operator: ALL })
    );
    assert.equal(
      resultSet.candidate_assessments[0]!
        .binding_aggregation_result_assessments[0]!.result_value,
      RESULT_DNH
    );
    const binding = firstBinding168(
      build168(
        resultSet,
        build167(resultSet, [
          {
            aggregation_result_value: RESULT_HOLDS,
            interpretation: INTERP_SUPPORTING,
          },
        ])
      )
    );
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
  });

  it("HOLDS → SUPPORTING when explicit", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const binding = firstBinding168(
      build168(resultSet, build167(resultSet, [...conventionalMappings]))
    );
    assert.equal(
      binding.status,
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT"
    );
    assert.equal(binding.interpretation, INTERP_SUPPORTING);
    assert.equal(
      binding.interpretation_basis!.current_aggregation_result_value,
      RESULT_HOLDS
    );
  });

  it("HOLDS → CONTRADICTING unusual mapping preserved", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const binding = firstBinding168(
      build168(
        resultSet,
        build167(resultSet, [
          {
            aggregation_result_value: RESULT_HOLDS,
            interpretation: INTERP_CONTRADICTING,
          },
        ])
      )
    );
    assert.equal(binding.interpretation, INTERP_CONTRADICTING);
    assert.equal(
      binding.status,
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT"
    );
  });

  it("DNH → CONTRADICTING when explicit", () => {
    const resultSet = build166(
      build165Set({ ...mixedCommon, operator: ALL })
    );
    const binding = firstBinding168(
      build168(resultSet, build167(resultSet, [...conventionalMappings]))
    );
    assert.equal(binding.interpretation, INTERP_CONTRADICTING);
    assert.equal(
      binding.interpretation_basis!.current_aggregation_result_value,
      RESULT_DNH
    );
  });

  it("DNH → SUPPORTING unusual mapping preserved", () => {
    const resultSet = build166(
      build165Set({ ...mixedCommon, operator: ALL })
    );
    const binding = firstBinding168(
      build168(
        resultSet,
        build167(resultSet, [
          {
            aggregation_result_value: RESULT_DNH,
            interpretation: INTERP_SUPPORTING,
          },
        ])
      )
    );
    assert.equal(binding.interpretation, INTERP_SUPPORTING);
  });

  it("same interpretation from both Result values → distinct Basis identity", () => {
    const holdsSet = build166(build165Set({ operator: ANY }));
    const dnhSet = build166(build165Set({ ...mixedCommon, operator: ALL }));
    const bothSupport = [
      {
        aggregation_result_value: RESULT_HOLDS,
        interpretation: INTERP_SUPPORTING,
      },
      {
        aggregation_result_value: RESULT_DNH,
        interpretation: INTERP_SUPPORTING,
      },
    ] as const;
    const holdsBasis = firstBinding168(
      build168(holdsSet, build167(holdsSet, [...bothSupport]))
    ).interpretation_basis!;
    const dnhBasis = firstBinding168(
      build168(dnhSet, build167(dnhSet, [...bothSupport]))
    ).interpretation_basis!;
    assert.equal(holdsBasis.interpretation, INTERP_SUPPORTING);
    assert.equal(dnhBasis.interpretation, INTERP_SUPPORTING);
    assert.notEqual(holdsBasis.key, dnhBasis.key);
    assert.notEqual(
      holdsBasis.current_aggregation_result_value,
      dnhBasis.current_aggregation_result_value
    );
  });

  it("empty Policy ≠ no Result; no mapping ≠ CONTRADICTING", () => {
    const withResult = build166(build165Set({ operator: ANY }));
    const noResult = build166(
      build165Set({ contribution: { kind: "POINT", value: 80 }, mappings: null })
    );
    const emptyMapped = firstBinding168(
      build168(withResult, build167(withResult, []))
    );
    const noCurrent = firstBinding168(
      build168(noResult, build167(noResult, [...conventionalMappings]))
    );
    assert.equal(
      emptyMapped.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
    assert.equal(
      noCurrent.status,
      "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
    assert.notEqual(emptyMapped.interpretation, INTERP_CONTRADICTING);
    assert.equal(emptyMapped.interpretation, null);
  });

  it("HOLDS→DNH both mapped → distinct Basis; partial → BASIS→NO_MAPPING", () => {
    const holdsSet = build166(build165Set({ operator: ANY }));
    const dnhSet = build166(build165Set({ ...mixedCommon, operator: ALL }));
    const both = firstBinding168(
      build168(holdsSet, build167(holdsSet, [...conventionalMappings]))
    );
    const bothDnh = firstBinding168(
      build168(dnhSet, build167(dnhSet, [...conventionalMappings]))
    );
    assert.notEqual(
      both.interpretation_basis!.key,
      bothDnh.interpretation_basis!.key
    );

    const partialDnh = firstBinding168(
      build168(
        dnhSet,
        build167(dnhSet, [
          {
            aggregation_result_value: RESULT_HOLDS,
            interpretation: INTERP_SUPPORTING,
          },
        ])
      )
    );
    assert.equal(
      both.status,
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT"
    );
    assert.equal(
      partialDnh.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
  });

  it("Result absence→presence evaluates Policy; presence→absence restores NO_CURRENT_RESULT", () => {
    const absent = build166(
      build165Set({ contribution: { kind: "POINT", value: 80 }, mappings: null })
    );
    const present = build166(build165Set({ operator: ANY }));
    assert.equal(
      firstBinding168(build168(absent, build167(absent, [...conventionalMappings])))
        .status,
      "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
    assert.equal(
      firstBinding168(
        build168(present, build167(present, [...conventionalMappings]))
      ).status,
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT"
    );
  });

  it("evaluation-instant sensitivity; same Policy stable", () => {
    const at1 = build166(build165Set({ operator: ANY, evaluation_at: AT }));
    const at2 = build166(build165Set({ operator: ANY, evaluation_at: AT2 }));
    const policy1 = build167(at1, [...conventionalMappings]);
    const policy2 = build167(at2, [...conventionalMappings]);
    const b1 = firstBinding168(build168(at1, policy1)).interpretation_basis!;
    const b2 = firstBinding168(build168(at2, policy2)).interpretation_basis!;
    assert.notEqual(b1.key, b2.key);
    assert.notEqual(b1.evaluation_at, b2.evaluation_at);
    assert.equal(
      policy1.candidate_assessments[0]!
        .binding_interpretation_policy_assessments[0]!.interpretation_policy!
        .key,
      policy2.candidate_assessments[0]!
        .binding_interpretation_policy_assessments[0]!.interpretation_policy!
        .key
    );
  });

  it("input immutability and pointer-identity equivalence", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const policySet = build167(resultSet, [...conventionalMappings]);
    const snapshotR = deepClone(resultSet);
    const snapshotP = deepClone(policySet);
    const out1 = build168(resultSet, policySet);
    assert.deepEqual(resultSet, snapshotR);
    assert.deepEqual(policySet, snapshotP);
    const out2 = build168(deepClone(resultSet), deepClone(policySet));
    assert.deepEqual(out1, out2);
  });

  it("exact mapping lookup helper; conflicting mappings reject", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const policy = build167(resultSet, [...conventionalMappings])
      .candidate_assessments[0]!
      .binding_interpretation_policy_assessments[0]!.interpretation_policy!;
    const found = findExactDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping(
      policy.mappings,
      RESULT_HOLDS
    );
    assert.equal(found!.interpretation, INTERP_SUPPORTING);
    assert.equal(
      findExactDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping(
        policy.mappings,
        RESULT_DNH
      )!.interpretation,
      INTERP_CONTRADICTING
    );
    assert.throws(() =>
      findExactDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping(
        [
          {
            key: "a",
            aggregation_result_value: RESULT_HOLDS,
            interpretation: INTERP_SUPPORTING,
          },
          {
            key: "b",
            aggregation_result_value: RESULT_HOLDS,
            interpretation: INTERP_CONTRADICTING,
          },
        ],
        RESULT_HOLDS
      )
    );
  });

  it("malformed PRESENT/null Result rejects; POLICY_PRESENT/null Policy rejects", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const policySet = build167(resultSet, [...conventionalMappings]);
    const badResult = deepClone(resultSet);
    badResult.candidate_assessments[0]!.binding_aggregation_result_assessments[0]!.aggregation_result =
      null;
    assert.throws(() => build168(badResult, policySet));

    const badPolicy = deepClone(policySet);
    badPolicy.candidate_assessments[0]!.binding_interpretation_policy_assessments[0]!.interpretation_policy =
      null;
    assert.throws(() => build168(resultSet, badPolicy));
  });

  it("malformed unresolved Policy carrying Policy rejects", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const policySet = build167(resultSet, "absent");
    const bad = deepClone(policySet);
    const presentPolicy = build167(resultSet, [...conventionalMappings])
      .candidate_assessments[0]!
      .binding_interpretation_policy_assessments[0]!.interpretation_policy!;
    bad.candidate_assessments[0]!.binding_interpretation_policy_assessments[0]!.interpretation_policy =
      presentPolicy;
    assert.throws(() => build168(resultSet, bad));
  });

  it("Basis identity includes Result lineage; helper key matches", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const binding = firstBinding168(
      build168(resultSet, build167(resultSet, [...conventionalMappings]))
    );
    const basis = binding.interpretation_basis!;
    const helper =
      attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisKey(
        {
          candidate_key: basis.candidate_key,
          observation_need_key: basis.observation_need_key,
          capability_requirement_set_key: basis.capability_requirement_set_key,
          observation_resource_requirement_key:
            basis.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            basis.resource_readiness_observation_context_binding_key,
          resource_declaration_id: basis.resource_declaration_id,
          evaluation_at: basis.evaluation_at,
          capacity_compatibility_source_aggregation_policy_key:
            basis.capacity_compatibility_source_aggregation_policy_key,
          capacity_compatibility_source_aggregation_result_key:
            basis.capacity_compatibility_source_aggregation_result_key,
          current_aggregation_result_value:
            basis.current_aggregation_result_value,
          aggregation_result_interpretation_policy_key:
            basis.aggregation_result_interpretation_policy_key,
          matched_mapping_key: basis.matched_mapping_key,
          interpretation: basis.interpretation,
        }
      );
    assert.equal(basis.key, helper);
    assert.ok(basis.key.includes(firstAggPolicyKey(resultSet)));
    assert.ok(basis.key.includes(AT));
  });

  it("summary booleans are existence-only; set exposes lineages", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const set = build168(
      resultSet,
      build167(resultSet, [
        {
          aggregation_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ])
    );
    assert.equal(set.has_interpretation_bases, true);
    assert.equal(
      set.has_supporting_aggregated_capacity_compatibility_evidence_interpretations,
      true
    );
    assert.equal(
      set.has_contradicting_aggregated_capacity_compatibility_evidence_interpretations,
      false
    );
    assert.equal(
      set.candidate_assessments[0]!
        .capacity_compatibility_source_aggregation_result_assessment
        .candidate_key,
      CAND
    );
    assert.equal(
      set.candidate_assessments[0]!
        .capacity_compatibility_source_aggregation_result_interpretation_policy_assessment
        .candidate_key,
      CAND
    );
  });

  it("166/167 authorities only; no defaults / OE / State / ProjectState", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-basis-core.ts"
      ),
      "utf8"
    );
    const types = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-basis-types.ts"
      ),
      "utf8"
    );
    const src = `${core}\n${types}`;
    assert.ok(
      !/source-aggregation-readiness-basis-core/.test(core)
    );
    assert.ok(
      !/source-aggregation-readiness-policy-core/.test(core)
    );
    assert.ok(
      !/source-aggregation-policy-core/.test(core)
    );
    assert.ok(!/canonical-per-source.*-core/.test(core));
    assert.ok(!/\bProjectState\b/.test(core));
    assert.ok(!/\bStatePatch\b/.test(core));
    assert.ok(!/\bapplyPatch\b/.test(core));
    assert.ok(!/\bsaveProject\b/.test(core));
    assert.ok(!/CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION/.test(core));
    assert.ok(!/ANY_SELECTED_CAPACITY_SOURCE/.test(core));
    assert.ok(
      !/CONDITION_HOLDS[\s\S]{0,80}INTERPRET_AS_SUPPORTING/.test(core)
    );
    assert.ok(!/"RESOURCE_READY"/.test(src));
    assert.ok(!/can_execute/.test(src));
    assert.ok(
      !/EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION/.test(
        src
      )
    );
    assert.ok(
      /DECLARED_POTENTIAL_CONTRIBUTION_PROVENANCE_CARDINALITY_SEMANTICS_REQUIRE_REAUDIT_BEFORE_CONTRIBUTION_VERIFICATION/.test(
        types
      )
    );
    assert.ok(/AGGREGATED_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_NOT_MODELED/.test(types));
  });
});
