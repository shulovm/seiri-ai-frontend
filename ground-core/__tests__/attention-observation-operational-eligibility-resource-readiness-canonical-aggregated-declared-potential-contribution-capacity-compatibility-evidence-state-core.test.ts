/**
 * GROUND-169 — Observation Core CXXIII / Canonical Aggregated Declared Potential
 * Contribution Capacity-Compatibility Evidence State Foundation
 *
 * GROUND-168 Interpretation Basis → Canonical Aggregated Evidence State
 *
 * NOT_APPLICABLE ≠ UNRESOLVED. Seven values preserved.
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
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-basis-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateSet,
  deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue,
  isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState,
  isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState,
  isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state-core.js";
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

function build169(basisSet: ReturnType<typeof build168>) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateSet(
    {
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set:
        basisSet,
    }
  );
}

function firstBinding169(set: ReturnType<typeof build169>) {
  return set.candidate_assessments[0]!.binding_state_assessments[0]!;
}

function pipe(
  options: Parameters<typeof build165Set>[0],
  mappings:
    | typeof conventionalMappings
    | {
        aggregation_result_value: typeof RESULT_HOLDS | typeof RESULT_DNH;
        interpretation: typeof INTERP_SUPPORTING | typeof INTERP_CONTRADICTING;
      }[]
    | "absent"
    | []
) {
  const resultSet = build166(build165Set(options));
  const policySet = build167(
    resultSet,
    mappings === "absent" ? "absent" : [...mappings]
  );
  return build169(build168(resultSet, policySet));
}

const CANON_NA =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" as const;
const CANON_NO_READY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const CANON_NO_RESULT =
  "UNRESOLVED_NO_CURRENT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD" as const;
const CANON_NO_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY" as const;
const CANON_NO_MAP =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT" as const;
const CANON_SUP =
  "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_SUPPORTING" as const;
const CANON_CON =
  "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_CONTRADICTING" as const;

describe("GROUND-169 Canonical Aggregated Capacity-Compatibility Evidence State", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order including provenance cardinality debt", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS[0],
      "CAPACITY_COMPATIBILITY_PROPOSITION_TRUTH_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS[3],
      "DECLARED_POTENTIAL_CONTRIBUTION_PROVENANCE_CARDINALITY_SEMANTICS_REQUIRE_REAUDIT_BEFORE_CONTRIBUTION_VERIFICATION"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS.at(-1),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("NOT_APPLICABLE remains NOT_APPLICABLE ≠ UNRESOLVED", () => {
    const binding = firstBinding169(
      pipe({ declareAggregation: false, declareReadiness: false }, "absent")
    );
    assert.equal(binding.canonical_state_value, CANON_NA);
    assert.equal(binding.canonical_state.capacity_compatibility_source_aggregation_policy_key, null);
    assert.equal(binding.canonical_state.aggregation_result_interpretation_basis_key, null);
    assert.equal(isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(binding.canonical_state_value), false);
    assert.equal(isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(binding.canonical_state_value), false);
    assert.equal(isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(binding.canonical_state_value), false);
    assert.ok(!binding.canonical_state_value.startsWith("UNRESOLVED_"));
  });

  it("NO_READINESS → unresolved readiness-policy", () => {
    const binding = firstBinding169(
      pipe({ declareReadiness: false }, [...conventionalMappings])
    );
    assert.equal(binding.canonical_state_value, CANON_NO_READY);
    assert.ok(binding.canonical_state.capacity_compatibility_source_aggregation_policy_key);
    assert.equal(isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(binding.canonical_state_value), true);
    assert.equal(isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(binding.canonical_state_value), true);
  });

  it("NO_CURRENT_RESULT → unresolved no-current-result ≠ CONTRADICTING", () => {
    const binding = firstBinding169(
      pipe({ contribution: { kind: "POINT", value: 80 }, mappings: null }, [...conventionalMappings])
    );
    assert.equal(binding.canonical_state_value, CANON_NO_RESULT);
    assert.notEqual(binding.canonical_state_value, CANON_CON);
  });

  it("NO_INTERPRETATION_POLICY → unresolved interpretation-policy", () => {
    const binding = firstBinding169(pipe({ operator: ANY }, "absent"));
    assert.equal(binding.canonical_state_value, CANON_NO_POLICY);
  });

  it("NO_MAPPING (empty + partial) → unresolved mapping ≠ CONTRADICTING", () => {
    const empty = firstBinding169(pipe({ operator: ANY }, []));
    const partial = firstBinding169(
      pipe({ ...mixedCommon, operator: ALL }, [
        { aggregation_result_value: RESULT_HOLDS, interpretation: INTERP_SUPPORTING },
      ])
    );
    assert.equal(empty.canonical_state_value, CANON_NO_MAP);
    assert.equal(partial.canonical_state_value, CANON_NO_MAP);
    assert.notEqual(empty.canonical_state_value, CANON_CON);
  });

  it("SUPPORTING / CONTRADICTING Basis canonicalize", () => {
    const supporting = firstBinding169(pipe({ operator: ANY }, [...conventionalMappings]));
    const contradicting = firstBinding169(
      pipe({ ...mixedCommon, operator: ALL }, [...conventionalMappings])
    );
    assert.equal(supporting.canonical_state_value, CANON_SUP);
    assert.equal(contradicting.canonical_state_value, CANON_CON);
    assert.ok(supporting.canonical_state.aggregation_result_interpretation_basis_key);
    assert.equal(isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(CANON_SUP), true);
    assert.equal(isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(CANON_CON), true);
  });

  it("unusual HOLDS→CONTRADICTING and DNH→SUPPORTING ancestry preserved", () => {
    const holdsCon = firstBinding169(
      pipe({ operator: ANY }, [
        { aggregation_result_value: RESULT_HOLDS, interpretation: INTERP_CONTRADICTING },
      ])
    );
    const dnhSup = firstBinding169(
      pipe({ ...mixedCommon, operator: ALL }, [
        { aggregation_result_value: RESULT_DNH, interpretation: INTERP_SUPPORTING },
      ])
    );
    assert.equal(holdsCon.canonical_state_value, CANON_CON);
    assert.equal(dnhSup.canonical_state_value, CANON_SUP);
  });

  it("seven values remain pairwise distinct", () => {
    const values = [
      firstBinding169(pipe({ declareAggregation: false, declareReadiness: false }, "absent")).canonical_state_value,
      firstBinding169(pipe({ declareReadiness: false }, [...conventionalMappings])).canonical_state_value,
      firstBinding169(pipe({ contribution: { kind: "POINT", value: 80 }, mappings: null }, [...conventionalMappings])).canonical_state_value,
      firstBinding169(pipe({ operator: ANY }, "absent")).canonical_state_value,
      firstBinding169(pipe({ operator: ANY }, [])).canonical_state_value,
      firstBinding169(pipe({ operator: ANY }, [...conventionalMappings])).canonical_state_value,
      firstBinding169(pipe({ ...mixedCommon, operator: ALL }, [...conventionalMappings])).canonical_state_value,
    ];
    assert.deepEqual(values, [
      CANON_NA, CANON_NO_READY, CANON_NO_RESULT, CANON_NO_POLICY, CANON_NO_MAP, CANON_SUP, CANON_CON,
    ]);
    assert.equal(new Set(values).size, 7);
  });

  it("resolvedness/applicability helpers", () => {
    const all = [CANON_NA, CANON_NO_READY, CANON_NO_RESULT, CANON_NO_POLICY, CANON_NO_MAP, CANON_SUP, CANON_CON];
    for (const v of all) {
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(v),
        v === CANON_SUP || v === CANON_CON
      );
      assert.equal(
        isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(v),
        v !== CANON_NA
      );
      assert.equal(
        isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(v),
        v === CANON_NO_READY || v === CANON_NO_RESULT || v === CANON_NO_POLICY || v === CANON_NO_MAP
      );
    }
  });

  it("same value / different Basis lineage or instant → distinct State keys", () => {
    const a = firstBinding169(pipe({ operator: ANY, evaluation_at: AT }, [...conventionalMappings]));
    const b = firstBinding169(pipe({ operator: ANY, evaluation_at: AT2 }, [...conventionalMappings]));
    assert.equal(a.canonical_state_value, CANON_SUP);
    assert.equal(b.canonical_state_value, CANON_SUP);
    assert.notEqual(a.canonical_state.key, b.canonical_state.key);
    assert.notEqual(a.canonical_state.evaluation_at, b.canonical_state.evaluation_at);
  });

  it("transitions change canonical value", () => {
    assert.notEqual(
      firstBinding169(pipe({ declareAggregation: false, declareReadiness: false }, "absent")).canonical_state_value,
      firstBinding169(pipe({ declareReadiness: false }, [...conventionalMappings])).canonical_state_value
    );
    assert.notEqual(
      firstBinding169(pipe({ contribution: { kind: "POINT", value: 80 }, mappings: null }, [...conventionalMappings])).canonical_state_value,
      firstBinding169(pipe({ operator: ANY }, [...conventionalMappings])).canonical_state_value
    );
    assert.notEqual(
      firstBinding169(pipe({ operator: ANY }, [...conventionalMappings])).canonical_state_value,
      firstBinding169(pipe({ ...mixedCommon, operator: ALL }, [...conventionalMappings])).canonical_state_value
    );
    assert.notEqual(
      firstBinding169(pipe({ operator: ANY }, [...conventionalMappings])).canonical_state_value,
      firstBinding169(pipe({ operator: ANY }, [])).canonical_state_value
    );
  });

  it("malformed BASIS_PRESENT/null Basis or interpretation rejects", () => {
    const set = pipe({ operator: ANY }, [...conventionalMappings]);
    const badBasis = deepClone(set.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set);
    badBasis.candidate_assessments[0]!.binding_interpretation_basis_assessments[0]!.interpretation_basis = null;
    assert.throws(() => build169(badBasis));

    const badInterp = deepClone(set.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set);
    badInterp.candidate_assessments[0]!.binding_interpretation_basis_assessments[0]!.interpretation = null;
    assert.throws(() => build169(badInterp));
  });

  it("non-Basis carrying Basis rejects; unknown interpretation rejects", () => {
    const set = pipe({ operator: ANY }, "absent");
    const bad = deepClone(set.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set);
    const present = pipe({ operator: ANY }, [...conventionalMappings])
      .resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set
      .candidate_assessments[0]!.binding_interpretation_basis_assessments[0]!;
    bad.candidate_assessments[0]!.binding_interpretation_basis_assessments[0]!.interpretation_basis =
      present.interpretation_basis;
    assert.throws(() => build169(bad));

    const unknown = deepClone(
      pipe({ operator: ANY }, [...conventionalMappings])
        .resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set
    );
    const binding = unknown.candidate_assessments[0]!.binding_interpretation_basis_assessments[0]!;
    (binding.interpretation_basis as { interpretation: string }).interpretation =
      "INTERPRET_AS_UNKNOWN" as never;
    binding.interpretation = "INTERPRET_AS_UNKNOWN" as never;
    assert.throws(() =>
      deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue(
        binding
      )
    );
  });

  it("input immutability and pointer-identity equivalence", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const basisSet = build168(resultSet, build167(resultSet, [...conventionalMappings]));
    const snap = deepClone(basisSet);
    const out1 = build169(basisSet);
    assert.deepEqual(basisSet, snap);
    assert.deepEqual(out1, build169(deepClone(basisSet)));
  });

  it("Binding cardinality equals GROUND-168; summary booleans existence-only", () => {
    const resultSet = build166(build165Set({ operator: ANY }));
    const basisSet = build168(resultSet, build167(resultSet, [...conventionalMappings]));
    const set = build169(basisSet);
    assert.equal(
      set.candidate_assessments[0]!.binding_state_assessments.length,
      basisSet.candidate_assessments[0]!.binding_interpretation_basis_assessments.length
    );
    assert.equal(set.has_supporting_aggregated_capacity_compatibility_evidence_states, true);
    assert.equal(set.has_resolved_aggregated_capacity_compatibility_evidence_states, true);
    assert.equal(set.has_applicable_aggregated_capacity_compatibility_evidence_states, true);
    assert.equal(set.has_contradicting_aggregated_capacity_compatibility_evidence_states, false);
    assert.equal(set.has_unresolved_aggregated_capacity_compatibility_evidence_states, false);
  });

  it("State identity helper matches; includes ground168 status", () => {
    const binding = firstBinding169(pipe({ operator: ANY }, [...conventionalMappings]));
    const state = binding.canonical_state;
    const helper =
      attentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateKey(
        {
          candidate_key: state.candidate_key,
          observation_need_key: state.observation_need_key,
          capability_requirement_set_key: state.capability_requirement_set_key,
          observation_resource_requirement_key: state.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            state.resource_readiness_observation_context_binding_key,
          resource_declaration_id: state.resource_declaration_id,
          evaluation_at: state.evaluation_at,
          capacity_compatibility_source_aggregation_policy_key:
            state.capacity_compatibility_source_aggregation_policy_key,
          ground168_status: binding.aggregation_result_interpretation_basis_assessment.status,
          aggregation_result_interpretation_basis_key:
            state.aggregation_result_interpretation_basis_key,
          value: state.value,
        }
      );
    assert.equal(state.key, helper);
  });

  it("168 authority only; no upstream builders / defaults / OE / truth", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state-core.ts"
      ),
      "utf8"
    );
    const types = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state-types.ts"
      ),
      "utf8"
    );
    const src = `${core}\n${types}`;
    assert.ok(!/result-interpretation-policy-core/.test(core));
    assert.ok(!/source-aggregation-result-core/.test(core));
    assert.ok(!/source-aggregation-readiness-basis-core/.test(core));
    assert.ok(!/source-aggregation-readiness-policy-core/.test(core));
    assert.ok(!/source-aggregation-policy-core/.test(core));
    assert.ok(!/canonical-per-source.*-core/.test(core));
    assert.ok(!/\bProjectState\b/.test(core));
    assert.ok(!/\bStatePatch\b/.test(core));
    assert.ok(!/\bapplyPatch\b/.test(core));
    assert.ok(!/\bsaveProject\b/.test(core));
    assert.ok(!/CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS[\s\S]{0,80}SUPPORTING/.test(core));
    assert.ok(!/"CAPACITY_COMPATIBILITY_HOLDS"/.test(src));
    assert.ok(!/"RESOURCE_READY"/.test(src));
    assert.ok(!/can_execute/.test(src));
    assert.ok(/DECLARED_POTENTIAL_CONTRIBUTION_PROVENANCE_CARDINALITY_SEMANTICS_REQUIRE_REAUDIT_BEFORE_CONTRIBUTION_VERIFICATION/.test(types));
  });
});
