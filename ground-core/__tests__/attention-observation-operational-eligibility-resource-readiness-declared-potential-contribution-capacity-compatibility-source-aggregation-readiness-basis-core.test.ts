/**
 * GROUND-165 — Observation Core CXIX / Current Declared Potential Contribution
 * Capacity-Compatibility Source Aggregation Readiness Basis Foundation
 *
 * Current selected-source presence + resolvedness only.
 * No short-circuit / ANY/ALL execution / Aggregation Result.
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
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-basis-core.js";
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
const ABOVE =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL" as const;
const ANY =
  "ANY_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITION_HOLDS" as const;
const ALL =
  "ALL_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITIONS_HOLD" as const;
const READINESS =
  "REQUIRE_ALL_SELECTED_CAPACITY_SOURCE_EVIDENCE_STATES_RESOLVED_BEFORE_AGGREGATION" as const;
const HOLDS = "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS" as const;
const DNH =
  "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD" as const;
const SUPPORTING =
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SUPPORTING" as const;
const CONTRADICTING =
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_CONTRADICTING" as const;

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

function build164Pipeline(options: {
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
  const readinessSet =
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
  return { stateSet, aggregationSet, readinessSet, aggPolicy };
}

function build165(
  stateSet: ReturnType<typeof build161>["stateSet"],
  readinessSet: ReturnType<typeof build164Pipeline>["readinessSet"]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSet(
    {
      resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
        stateSet,
      resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_policy_set:
        readinessSet,
    }
  );
}

function firstBinding165(set: ReturnType<typeof build165>) {
  return set.candidate_assessments[0]!.binding_readiness_basis_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-165 Current Capacity-Compatibility Source Aggregation Readiness Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS[0],
      "CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS[1],
      "CAPACITY_SOURCE_AGGREGATION_OPERATOR_NOT_EXECUTED"
    );
  });

  it("NOT_APPLICABLE when no Aggregation Policy", () => {
    const pipe = build164Pipeline({
      declareAggregation: false,
      declareReadiness: false,
    });
    const binding = firstBinding165(build165(pipe.stateSet, pipe.readinessSet));
    assert.equal(
      binding.status,
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(binding.readiness_basis, null);
    assert.equal(binding.readiness_condition, null);
  });

  it("NO_READINESS_POLICY when Aggregation Policy exists without readiness Policy", () => {
    const pipe = build164Pipeline({ declareReadiness: false });
    const binding = firstBinding165(build165(pipe.stateSet, pipe.readinessSet));
    assert.equal(
      binding.status,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
    );
    assert.equal(binding.readiness_basis, null);
  });

  it("all SUPPORTING → HOLDS; no Aggregation Result", () => {
    const pipe = build164Pipeline({});
    const binding = firstBinding165(build165(pipe.stateSet, pipe.readinessSet));
    assert.equal(
      binding.status,
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
    );
    assert.equal(binding.readiness_condition, HOLDS);
    assert.ok(binding.readiness_basis);
    assert.equal(binding.readiness_basis!.missing_selected_source_count, 0);
    assert.equal(binding.readiness_basis!.unresolved_selected_source_count, 0);
    assert.ok(
      binding.readiness_basis!.selected_source_readiness_assessments.every(
        (a) => a.status === "SELECTED_CAPACITY_SOURCE_PRESENT_AND_RESOLVED"
      )
    );
  });

  it("all CONTRADICTING → HOLDS (CONTRADICTING is resolved)", () => {
    const pipe = build164Pipeline({
      contribution: { kind: "POINT", value: 300 },
      mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
    });
    const binding = firstBinding165(build165(pipe.stateSet, pipe.readinessSet));
    assert.equal(binding.readiness_condition, HOLDS);
    assert.ok(
      binding.readiness_basis!.selected_source_readiness_assessments.every(
        (a) =>
          a.is_resolved &&
          a.canonical_source_state_value === CONTRADICTING
      )
    );
  });

  it("mixed SUPPORTING + CONTRADICTING → HOLDS under ANY and ALL", () => {
    const projectState = mockProjectState({
      resource_capacity_declarations: [
        capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
        capacityDecl(CAP_B, RD1, { kind: "POINT", value: 200 }),
      ],
    });
    const common = {
      projectState,
      contribution: { kind: "POINT" as const, value: 100 },
      mappings: [
        { raw_relation: ABOVE, interpretation: CONTRADICTS },
        { raw_relation: BELOW, interpretation: SUPPORTS },
      ],
    };
    const anyPipe = build164Pipeline({ ...common, operator: ANY });
    const allPipe = build164Pipeline({ ...common, operator: ALL });
    assert.equal(
      firstBinding165(build165(anyPipe.stateSet, anyPipe.readinessSet))
        .readiness_condition,
      HOLDS
    );
    assert.equal(
      firstBinding165(build165(allPipe.stateSet, allPipe.readinessSet))
        .readiness_condition,
      HOLDS
    );
  });

  it("SUPPORTING + unresolved-no-mapping → DNH; both assessments preserved; ANY no short-circuit", () => {
    const projectState = mockProjectState({
      resource_capacity_declarations: [
        capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
        capacityDecl(CAP_B, RD1, { kind: "POINT", value: 100 }),
        capacityDecl(CAP_C, RD1, { kind: "POINT", value: 200 }),
      ],
    });
    // contribution 100: CAP_A ABOVE CONTRADICTS, CAP_B EQUALS unmapped, CAP_C BELOW SUPPORTS
    const pipe = build164Pipeline({
      projectState,
      contribution: { kind: "POINT", value: 100 },
      mappings: [
        { raw_relation: ABOVE, interpretation: CONTRADICTS },
        { raw_relation: BELOW, interpretation: SUPPORTS },
      ],
      operator: ANY,
      selected: [CAP_B, CAP_C],
    });
    const basis = firstBinding165(
      build165(pipe.stateSet, pipe.readinessSet)
    ).readiness_basis!;
    assert.equal(basis.readiness_condition, DNH);
    assert.equal(basis.selected_source_readiness_assessments.length, 2);
    const byKey = Object.fromEntries(
      basis.selected_source_readiness_assessments.map((a) => [
        a.capacity_declaration_key,
        a,
      ])
    );
    assert.equal(
      byKey[CAP_C]!.status,
      "SELECTED_CAPACITY_SOURCE_PRESENT_AND_RESOLVED"
    );
    assert.equal(
      byKey[CAP_B]!.status,
      "SELECTED_CAPACITY_SOURCE_PRESENT_BUT_UNRESOLVED_NO_EXPLICIT_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_RELATION"
    );
  });

  it("CONTRADICTING + unresolved-no-policy → DNH; ALL no short-circuit", () => {
    const pipe = build164Pipeline({
      contribution: { kind: "POINT", value: 300 },
      mappings: null,
      operator: ALL,
    });
    const basis = firstBinding165(
      build165(pipe.stateSet, pipe.readinessSet)
    ).readiness_basis!;
    // mappings null → all UNRESOLVED_NO_POLICY
    assert.equal(basis.readiness_condition, DNH);
    assert.ok(
      basis.selected_source_readiness_assessments.every(
        (a) =>
          a.status ===
          "SELECTED_CAPACITY_SOURCE_PRESENT_BUT_UNRESOLVED_NO_EXPLICIT_CAPACITY_RELATION_INTERPRETATION_POLICY"
      )
    );
  });

  it("missing selected source → DNH; Policy remains; counts invariant", () => {
    const full = build164Pipeline({
      selected: [CAP_A, CAP_B],
    });
    const currentOnlyA = build161({
      projectState: mockProjectState({
        resource_capacity_declarations: [
          capacityDecl(CAP_A, RD1, { kind: "POINT", value: 100 }),
        ],
      }),
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const binding = firstBinding165(
      build165(currentOnlyA.stateSet, full.readinessSet)
    );
    assert.equal(binding.readiness_condition, DNH);
    const basis = binding.readiness_basis!;
    assert.equal(basis.selected_source_count, 2);
    assert.equal(basis.present_selected_source_count, 1);
    assert.equal(basis.missing_selected_source_count, 1);
    assert.equal(basis.resolved_selected_source_count, 1);
    assert.equal(basis.unresolved_selected_source_count, 0);
    assert.equal(
      basis.selected_source_readiness_assessments.find(
        (a) => a.capacity_declaration_key === CAP_B
      )!.status,
      "SELECTED_CAPACITY_SOURCE_MISSING"
    );
    assert.ok(
      binding.aggregation_readiness_policy_assessment.readiness_policy
    );
  });

  it("unselected unresolved source ignored", () => {
    const projectState = mockProjectState({
      resource_capacity_declarations: [
        capacityDecl(CAP_A, RD1, { kind: "POINT", value: 50 }),
        capacityDecl(CAP_B, RD1, { kind: "POINT", value: 100 }),
        capacityDecl(CAP_C, RD1, { kind: "POINT", value: 200 }),
      ],
    });
    // Select only CAP_C (SUPPORTING); CAP_B unresolved unselected
    const pipe = build164Pipeline({
      projectState,
      contribution: { kind: "POINT", value: 100 },
      mappings: [
        { raw_relation: ABOVE, interpretation: CONTRADICTS },
        { raw_relation: BELOW, interpretation: SUPPORTS },
      ],
      selected: [CAP_C],
    });
    const binding = firstBinding165(build165(pipe.stateSet, pipe.readinessSet));
    assert.equal(binding.readiness_condition, HOLDS);
    assert.equal(
      binding.readiness_basis!.selected_source_readiness_assessments.length,
      1
    );
  });

  it("SUPPORTING→CONTRADICTING keeps HOLDS; identity reflects State lineage", () => {
    const supporting = build164Pipeline({
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
      selected: [CAP_A],
    });
    const contradicting = build161({
      contribution: { kind: "POINT", value: 150 },
      mappings: [{ raw_relation: ABOVE, interpretation: CONTRADICTS }],
    });
    // Use readiness from supporting selection CAP_A; current contradicting CAP_A
    const h1 = firstBinding165(
      build165(supporting.stateSet, supporting.readinessSet)
    );
    const h2 = firstBinding165(
      build165(contradicting.stateSet, supporting.readinessSet)
    );
    assert.equal(h1.readiness_condition, HOLDS);
    assert.equal(h2.readiness_condition, HOLDS);
    assert.notEqual(h1.readiness_basis!.key, h2.readiness_basis!.key);
    assert.equal(
      h1.readiness_basis!.selected_source_readiness_assessments[0]!
        .canonical_source_state_value,
      SUPPORTING
    );
    assert.equal(
      h2.readiness_basis!.selected_source_readiness_assessments[0]!
        .canonical_source_state_value,
      CONTRADICTING
    );
  });

  it("evaluation-instant change alters Basis identity; Policies stable", () => {
    const t1 = build164Pipeline({ evaluation_at: AT, selected: [CAP_A] });
    const t2State = build161({
      evaluation_at: AT2,
      contribution: { kind: "POINT", value: 80 },
      mappings: [{ raw_relation: BELOW, interpretation: SUPPORTS }],
    });
    const b1 = firstBinding165(build165(t1.stateSet, t1.readinessSet))
      .readiness_basis!;
    const b2 = firstBinding165(build165(t2State.stateSet, t1.readinessSet))
      .readiness_basis!;
    assert.equal(b1.readiness_condition, HOLDS);
    assert.equal(b2.readiness_condition, HOLDS);
    assert.notEqual(b1.key, b2.key);
    assert.equal(b1.evaluation_at, AT);
    assert.equal(b2.evaluation_at, AT2);
    assert.equal(
      b1.capacity_compatibility_source_aggregation_readiness_policy_key,
      b2.capacity_compatibility_source_aggregation_readiness_policy_key
    );
  });

  it("ANY vs ALL same readiness condition; different Basis identity via aggregation lineage", () => {
    const anyPipe = build164Pipeline({ operator: ANY });
    const allPipe = build164Pipeline({ operator: ALL });
    const anyBasis = firstBinding165(
      build165(anyPipe.stateSet, anyPipe.readinessSet)
    ).readiness_basis!;
    const allBasis = firstBinding165(
      build165(allPipe.stateSet, allPipe.readinessSet)
    ).readiness_basis!;
    assert.equal(anyBasis.readiness_condition, allBasis.readiness_condition);
    assert.notEqual(anyBasis.key, allBasis.key);
    assert.notEqual(
      anyBasis.capacity_compatibility_source_aggregation_policy_key,
      allBasis.capacity_compatibility_source_aggregation_policy_key
    );
  });

  it("input immutability / deep-clone determinism", () => {
    const pipe = build164Pipeline({});
    const beforeState = deepClone(pipe.stateSet);
    const beforeReady = deepClone(pipe.readinessSet);
    const a = build165(pipe.stateSet, pipe.readinessSet);
    assert.deepEqual(pipe.stateSet, beforeState);
    assert.deepEqual(pipe.readinessSet, beforeReady);
    assert.deepEqual(a, build165(pipe.stateSet, pipe.readinessSet));
    assert.deepEqual(
      a,
      build165(deepClone(pipe.stateSet), deepClone(pipe.readinessSet))
    );
  });

  describe("static proofs", () => {
    it("161+164 only; no Result / short-circuit / arithmetic / OE", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-basis-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-basis-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state/.test(
          core
        )
      );
      assert.ok(
        /capacity-compatibility-source-aggregation-readiness-policy-types/.test(
          core
        )
      );
      assert.ok(
        /isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState/.test(
          core
        )
      );
      assert.ok(!/\bimport\b[\s\S]*\bProjectState\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(
        !/CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS/.test(src)
      );
      assert.ok(!/ALLOW_SHORT_CIRCUIT/.test(src));
      assert.ok(!/operator\s*===\s*"ANY_SELECTED/.test(core));
      assert.ok(!/operator\s*===\s*"ALL_SELECTED/.test(core));
      assert.ok(!/contribution_required_amount_relation/.test(core));
      assert.ok(!/Math\.(min|max|sum)/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/resource-reservation/.test(core));
      assert.ok(!/can_execute/.test(src));
      assert.ok(/CAPACITY_SOURCE_AGGREGATION_OPERATOR_NOT_EXECUTED/.test(types));
      assert.ok(/CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED/.test(types));
    });
  });
});
