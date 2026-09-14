import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Per-source Declared Potential Contribution Capacity-Relation
 * Interpretation Basis (GROUND-160).
 *
 * Pure composition of:
 *   current GROUND-157 Raw Relation Basis Set
 *   GROUND-159 Capacity-Relation Interpretation Policy Set
 *
 * Exact current capacity-source relation + exact explicit mapping lookup only.
 *
 * No persistence layer access or mutation. No GROUND-141 / GROUND-151
 * builders. No Reservation, availability, contribution verification,
 * source aggregation, required-axis interpretation, or OE readiness.
 *
 * NO_POLICY ≠ NO_MAPPING ≠ CONTRADICTS
 * SUPPORTS ≠ proposition true; CONTRADICTS ≠ proposition false
 * zero capacity sources ≠ negative evidence
 * BASIS_PRESENT ≠ canonical per-source State / Resource Ready
 * unusual explicit mappings are authoritative
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntry,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasis,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisModelLimitation[] =
  [
    "PER_SOURCE_CAPACITY_RELATION_CANONICAL_STATE_NOT_MODELED",
    "CAPACITY_SOURCE_MEMBER_SET_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_CONTRIBUTION_EVIDENCE_COMPOSITION_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED",
    "RESOURCE_CAPACITY_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "CROSS_BINDING_QUANTITY_COMPOSITION_NOT_MODELED",
    "PHYSICAL_RESOURCE_COMPOSITION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Declared Potential Contribution Raw Relation set and Capacity Relation Interpretation Policy set do not share compatible stable Binding context";

const SUPPORTS =
  "INTERPRET_AS_SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY" as const;
const CONTRADICTS =
  "INTERPRET_AS_CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|bindingKey|resourceDeclarationId|evaluationAt|
 * potentialContributionDeclarationKey|capacityRelationEntryKey|capacityDeclarationKey|
 * currentRawRelation|policyKey|matchedMappingKey|interpretation
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  physical_potential_contribution_declaration_key: string;
  capacity_relation_entry_key: string;
  capacity_declaration_key: string;
  current_raw_relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
  capacity_relation_interpretation_policy_key: string;
  matched_mapping_key: string;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.physical_potential_contribution_declaration_key,
    params.capacity_relation_entry_key,
    params.capacity_declaration_key,
    params.current_raw_relation,
    params.capacity_relation_interpretation_policy_key,
    params.matched_mapping_key,
    params.interpretation,
  ].join("|");
}

/**
 * Exact raw_relation mapping lookup within one GROUND-159 Policy.
 * 0 → null; 1 → mapping; >1 conflicting → reject.
 */
export function findExactDeclaredPotentialContributionCapacityRelationInterpretationMapping(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping[],
  currentRawRelation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping | null {
  let found: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    if (mapping.raw_relation !== currentRawRelation) {
      continue;
    }
    if (found !== null && found.interpretation !== mapping.interpretation) {
      throw new Error(
        `Declared Potential Contribution Capacity Relation Interpretation mapping multiplicity invariant violated for ${currentRawRelation}`
      );
    }
    if (found === null) {
      found = mapping;
    }
  }

  return found;
}

function assertCompatibleRawRelationAndPolicyContexts(
  rawSet: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSetAssessment,
  policySet: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySetAssessment
): void {
  const rawByCandidate = new Map(
    rawSet.candidate_assessments.map((c) => [c.candidate_key, c])
  );
  const policyByCandidate = new Map(
    policySet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  if (rawByCandidate.size !== rawSet.candidate_assessments.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in GROUND-157 set`
    );
  }
  if (policyByCandidate.size !== policySet.candidate_assessments.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in GROUND-159 set`
    );
  }
  if (rawByCandidate.size !== policyByCandidate.size) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  for (const [candidateKey, rawCandidate] of rawByCandidate) {
    const policyCandidate = policyByCandidate.get(candidateKey);
    if (!policyCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-159 candidate ${candidateKey}`
      );
    }

    const rawByBinding = new Map(
      rawCandidate.binding_raw_relation_assessments.map((a) => [
        a.resource_readiness_observation_context_binding_key,
        a,
      ])
    );
    const policyByBinding = new Map(
      policyCandidate.binding_interpretation_policy_assessments.map((a) => [
        a.resource_readiness_observation_context_binding_key,
        a,
      ])
    );

    if (rawByBinding.size !== rawCandidate.binding_raw_relation_assessments.length) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: duplicate Binding keys in GROUND-157 candidate ${candidateKey}`
      );
    }
    if (
      policyByBinding.size !==
      policyCandidate.binding_interpretation_policy_assessments.length
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: duplicate Binding keys in GROUND-159 candidate ${candidateKey}`
      );
    }
    if (rawByBinding.size !== policyByBinding.size) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Binding count mismatch for candidate ${candidateKey}`
      );
    }

    for (const [bindingKey, rawBinding] of rawByBinding) {
      const policyBinding = policyByBinding.get(bindingKey);
      if (!policyBinding) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-159 Binding Policy assessment for binding ${bindingKey}`
        );
      }

      if (
        rawBinding.observation_resource_requirement_key !==
          policyBinding.observation_resource_requirement_key ||
        rawBinding.resource_declaration_id !==
          policyBinding.resource_declaration_id
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: stable Binding lineage mismatch for ${bindingKey}`
        );
      }
    }
  }

  for (const candidateKey of policyByCandidate.keys()) {
    if (!rawByCandidate.has(candidateKey)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-157 candidate ${candidateKey}`
      );
    }
  }
}

function assertSourceAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Capacity Relation Interpretation Basis invariant violated: PRESENT requires non-null basis for capacity entry ${assessment.capacity_relation_entry_key}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `Capacity Relation Interpretation Basis invariant violated: PRESENT requires interpretation for capacity entry ${assessment.capacity_relation_entry_key}`
      );
    }
    if (!assessment.has_capacity_relation_interpretation_basis) {
      throw new Error(
        `Capacity Relation Interpretation Basis invariant violated: PRESENT requires has_basis true for capacity entry ${assessment.capacity_relation_entry_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_RELATION"
  ) {
    if (assessment.interpretation_basis !== null) {
      throw new Error(
        `Capacity Relation Interpretation Basis invariant violated: non-PRESENT requires null basis for capacity entry ${assessment.capacity_relation_entry_key}`
      );
    }
    if (assessment.interpretation !== null) {
      throw new Error(
        `Capacity Relation Interpretation Basis invariant violated: non-PRESENT requires null interpretation for capacity entry ${assessment.capacity_relation_entry_key}`
      );
    }
    if (assessment.has_capacity_relation_interpretation_basis) {
      throw new Error(
        `Capacity Relation Interpretation Basis invariant violated: non-PRESENT requires has_basis false for capacity entry ${assessment.capacity_relation_entry_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown Capacity Relation Interpretation Basis status: ${String(assessment.status)}`
  );
}

function buildInterpretationBasis(params: {
  policy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicy;
  entry: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntry;
  evaluation_at: string;
  physical_potential_contribution_declaration_key: string;
  mapping: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasis {
  const {
    policy,
    entry,
    evaluation_at,
    physical_potential_contribution_declaration_key,
    mapping,
  } = params;

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisKey(
      {
        candidate_key: policy.candidate_key,
        observation_need_key: policy.observation_need_key,
        capability_requirement_set_key: policy.capability_requirement_set_key,
        observation_resource_requirement_key:
          policy.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          policy.resource_readiness_observation_context_binding_key,
        resource_declaration_id: policy.resource_declaration_id,
        evaluation_at,
        physical_potential_contribution_declaration_key,
        capacity_relation_entry_key: entry.key,
        capacity_declaration_key: entry.capacity_declaration_id,
        current_raw_relation: entry.relation,
        capacity_relation_interpretation_policy_key: policy.key,
        matched_mapping_key: mapping.key,
        interpretation: mapping.interpretation,
      }
    ),
    candidate_key: policy.candidate_key,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      policy.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      policy.resource_readiness_observation_context_binding_key,
    resource_declaration_id: policy.resource_declaration_id,
    evaluation_at,
    physical_potential_contribution_declaration_key,
    capacity_relation_entry_key: entry.key,
    capacity_declaration_key: entry.capacity_declaration_id,
    current_raw_relation: entry.relation,
    capacity_relation_interpretation_policy_key: policy.key,
    matched_mapping_key: mapping.key,
    interpretation: mapping.interpretation,
  };
}

function assessCapacitySource(params: {
  entry: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntry;
  policyAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment;
  evaluation_at: string;
  physical_potential_contribution_declaration_key: string;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment {
  const { entry, policyAssessment, evaluation_at, physical_potential_contribution_declaration_key } =
    params;

  if (
    policyAssessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED" ||
    policyAssessment.interpretation_policy === null
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment =
      {
        capacity_relation_entry_key: entry.key,
        capacity_declaration_key: entry.capacity_declaration_id,
        current_raw_relation: entry.relation,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED",
        interpretation_basis: null,
        interpretation: null,
        has_capacity_relation_interpretation_basis: false,
      };
    assertSourceAssessmentInvariant(assessment);
    return assessment;
  }

  const policy = policyAssessment.interpretation_policy;
  const mapping = findExactDeclaredPotentialContributionCapacityRelationInterpretationMapping(
    policy.mappings,
    entry.relation
  );

  if (mapping === null) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment =
      {
        capacity_relation_entry_key: entry.key,
        capacity_declaration_key: entry.capacity_declaration_id,
        current_raw_relation: entry.relation,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_RELATION",
        interpretation_basis: null,
        interpretation: null,
        has_capacity_relation_interpretation_basis: false,
      };
    assertSourceAssessmentInvariant(assessment);
    return assessment;
  }

  const interpretation_basis = buildInterpretationBasis({
    policy,
    entry,
    evaluation_at,
    physical_potential_contribution_declaration_key,
    mapping,
  });

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment =
    {
      capacity_relation_entry_key: entry.key,
      capacity_declaration_key: entry.capacity_declaration_id,
      current_raw_relation: entry.relation,
      status:
        "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_PRESENT",
      interpretation_basis,
      interpretation: mapping.interpretation,
      has_capacity_relation_interpretation_basis: true,
    };
  assertSourceAssessmentInvariant(assessment);
  return assessment;
}

function summarizeSourceAssessments(
  sources: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment[]
): {
  capacity_source_count: number;
  interpretation_basis_count: number;
  has_capacity_relation_interpretation_bases: boolean;
  has_supporting_capacity_relation_interpretations: boolean;
  has_contradicting_capacity_relation_interpretations: boolean;
} {
  let interpretation_basis_count = 0;
  let has_supporting = false;
  let has_contradicting = false;

  for (const source of sources) {
    if (source.has_capacity_relation_interpretation_basis) {
      interpretation_basis_count += 1;
    }
    if (source.interpretation === SUPPORTS) {
      has_supporting = true;
    }
    if (source.interpretation === CONTRADICTS) {
      has_contradicting = true;
    }
  }

  return {
    capacity_source_count: sources.length,
    interpretation_basis_count,
    has_capacity_relation_interpretation_bases: interpretation_basis_count > 0,
    has_supporting_capacity_relation_interpretations: has_supporting,
    has_contradicting_capacity_relation_interpretations: has_contradicting,
  };
}

function assessBindingInterpretationBasis(
  rawBinding: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment,
  policyBinding: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisBindingAssessment {
  const entries =
    rawBinding.raw_relation_basis?.contribution_capacity_relation_entries ?? [];

  const capacity_source_interpretation_basis_assessments = [...entries]
    .sort((a, b) => compareStrings(a.key, b.key))
    .map((entry) => {
      if (rawBinding.raw_relation_basis === null) {
        throw new Error(
          `Capacity Relation Interpretation Basis invariant violated: capacity entry without raw relation basis for binding ${rawBinding.resource_readiness_observation_context_binding_key}`
        );
      }
      return assessCapacitySource({
        entry,
        policyAssessment: policyBinding,
        evaluation_at: rawBinding.raw_relation_basis.evaluation_at,
        physical_potential_contribution_declaration_key:
          rawBinding.raw_relation_basis
            .physical_potential_contribution_declaration_key,
      });
    });

  const summary = summarizeSourceAssessments(
    capacity_source_interpretation_basis_assessments
  );

  return {
    observation_resource_requirement_key:
      rawBinding.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      rawBinding.resource_readiness_observation_context_binding_key,
    resource_declaration_id: rawBinding.resource_declaration_id,
    raw_relation_binding_assessment: rawBinding,
    capacity_relation_interpretation_policy_assessment: policyBinding,
    capacity_source_interpretation_basis_assessments,
    ...summary,
  };
}

/**
 * Pure per-Candidate capacity-relation Interpretation Basis assessment.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasis(
  rawCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisAssessment,
  policyCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisAssessment {
  const policyByBinding = new Map(
    policyCandidate.binding_interpretation_policy_assessments.map((a) => [
      a.resource_readiness_observation_context_binding_key,
      a,
    ])
  );

  const binding_interpretation_basis_assessments =
    rawCandidate.binding_raw_relation_assessments.map((rawBinding) => {
      const policyBinding = policyByBinding.get(
        rawBinding.resource_readiness_observation_context_binding_key
      );
      if (!policyBinding) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-159 Binding Policy assessment for binding ${rawBinding.resource_readiness_observation_context_binding_key}`
        );
      }
      return assessBindingInterpretationBasis(rawBinding, policyBinding);
    });

  binding_interpretation_basis_assessments.sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return {
    candidate_key: rawCandidate.candidate_key,
    declared_potential_contribution_raw_relation_assessment: rawCandidate,
    capacity_relation_interpretation_policy_assessment: policyCandidate,
    binding_interpretation_basis_assessments,
    has_capacity_relation_interpretation_bases:
      binding_interpretation_basis_assessments.some(
        (a) => a.has_capacity_relation_interpretation_bases
      ),
    has_supporting_capacity_relation_interpretations:
      binding_interpretation_basis_assessments.some(
        (a) => a.has_supporting_capacity_relation_interpretations
      ),
    has_contradicting_capacity_relation_interpretations:
      binding_interpretation_basis_assessments.some(
        (a) => a.has_contradicting_capacity_relation_interpretations
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Per-source Declared Potential Contribution Capacity-Relation
 * Interpretation Basis. Preserves AttentionCandidate order.
 * Does not aggregate sources or interpret required_amount axis.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSetAssessment {
  assertCompatibleRawRelationAndPolicyContexts(
    input.resource_readiness_declared_potential_contribution_raw_relation_set,
    input.resource_readiness_declared_potential_contribution_capacity_relation_interpretation_policy_set
  );

  const policyByCandidate = new Map(
    input.resource_readiness_declared_potential_contribution_capacity_relation_interpretation_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.resource_readiness_declared_potential_contribution_raw_relation_set.candidate_assessments.map(
      (rawCandidate) => {
        const policyCandidate = policyByCandidate.get(rawCandidate.candidate_key);
        if (!policyCandidate) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-159 candidate ${rawCandidate.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasis(
          rawCandidate,
          policyCandidate
        );
      }
    );

  return {
    resource_readiness_declared_potential_contribution_raw_relation_set:
      input.resource_readiness_declared_potential_contribution_raw_relation_set,
    resource_readiness_declared_potential_contribution_capacity_relation_interpretation_policy_set:
      input.resource_readiness_declared_potential_contribution_capacity_relation_interpretation_policy_set,
    candidate_assessments,
    has_capacity_relation_interpretation_bases: candidate_assessments.some(
      (a) => a.has_capacity_relation_interpretation_bases
    ),
    has_supporting_capacity_relation_interpretations: candidate_assessments.some(
      (a) => a.has_supporting_capacity_relation_interpretations
    ),
    has_contradicting_capacity_relation_interpretations:
      candidate_assessments.some(
        (a) => a.has_contradicting_capacity_relation_interpretations
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
