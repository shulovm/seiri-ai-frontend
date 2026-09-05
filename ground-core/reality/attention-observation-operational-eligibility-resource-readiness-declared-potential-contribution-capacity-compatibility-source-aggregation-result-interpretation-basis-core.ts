import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Declared Potential Contribution Capacity-Compatibility
 * Source Aggregation Result Interpretation Basis (GROUND-168).
 *
 * Pure composition of:
 *   current GROUND-166 Aggregation Result Set
 *   + GROUND-167 stable Result Interpretation Policy Set
 *
 * Exact current Result + exact explicit mapping lookup only.
 *
 * Must not import GROUND-165/164/163/161 builders or project persistence.
 * GROUND-166/167 types and nested lineage only.
 *
 * NO_CURRENT_RESULT ≠ NO_MAPPING
 * NO_POLICY ≠ NO_MAPPING
 * NO_MAPPING ≠ CONTRADICTING
 * unusual explicit mappings are authoritative
 * BASIS_PRESENT ≠ canonical aggregated evidence State
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResult,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasis,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisModelLimitation[] =
  [
    "AGGREGATED_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_NOT_MODELED",
    "CAPACITY_COMPATIBILITY_PROPOSITION_TRUTH_NOT_MODELED",
    "MULTIPLE_CAPACITY_SOURCE_AGGREGATION_GROUPS_PER_BINDING_NOT_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_PROVENANCE_CARDINALITY_SEMANTICS_REQUIRE_REAUDIT_BEFORE_CONTRIBUTION_VERIFICATION",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_CONTRIBUTION_EVIDENCE_EVALUATION_STATE_NOT_MODELED",
    "PHYSICAL_CONTRIBUTION_EVIDENCE_COMPOSITION_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED",
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
  "Declared Potential Contribution Capacity-Compatibility Source Aggregation Result set and Result Interpretation Policy set do not share compatible stable aggregation context";

const INTERP_SUPPORTING =
  "INTERPRET_AS_SUPPORTING_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE" as const;
const INTERP_CONTRADICTING =
  "INTERPRET_AS_CONTRADICTING_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE" as const;

const RESULT_HOLDS =
  "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const RESULT_DNH =
  "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;

/**
 * Conceptual identity:
 * ...source-aggregation-result-interpretation-basis|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|
 * evaluationAt|aggregationPolicyKey|aggregationResultKey|
 * currentAggregationResultValue|interpretationPolicyKey|
 * matchedMappingKey|interpretation
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  capacity_compatibility_source_aggregation_policy_key: string;
  capacity_compatibility_source_aggregation_result_key: string;
  current_aggregation_result_value: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue;
  aggregation_result_interpretation_policy_key: string;
  matched_mapping_key: string;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.capacity_compatibility_source_aggregation_policy_key,
    params.capacity_compatibility_source_aggregation_result_key,
    params.current_aggregation_result_value,
    params.aggregation_result_interpretation_policy_key,
    params.matched_mapping_key,
    params.interpretation,
  ].join("|");
}

function bindingJoinKey(params: {
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
}): string {
  return [
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
  ].join("|");
}

/**
 * Exact aggregation_result_value mapping lookup.
 * 0 → null; 1 → mapping; >1 conflicting → reject.
 */
export function findExactDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping[],
  currentResultValue: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping | null {
  let found: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    if (mapping.aggregation_result_value !== currentResultValue) {
      continue;
    }
    if (found !== null && found.interpretation !== mapping.interpretation) {
      throw new Error(
        `Declared Potential Contribution Capacity-Compatibility Source Aggregation Result Interpretation mapping multiplicity invariant violated for ${currentResultValue}`
      );
    }
    if (found === null) {
      found = mapping;
    }
  }

  return found;
}

function extractAggregationPolicyKeyFromResultBinding(
  resultAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment
): string | null {
  if (resultAssessment.aggregation_result !== null) {
    return resultAssessment.aggregation_result
      .capacity_compatibility_source_aggregation_policy_key;
  }

  const readinessBasis =
    resultAssessment.aggregation_readiness_basis_assessment.readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.capacity_compatibility_source_aggregation_policy_key;
  }

  return (
    resultAssessment.aggregation_readiness_basis_assessment
      .aggregation_readiness_policy_assessment.aggregation_policy_assessment
      .aggregation_policy?.key ?? null
  );
}

function extractAggregationPolicyKeyFromInterpretationPolicyBinding(
  policyAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment
): string | null {
  if (policyAssessment.interpretation_policy !== null) {
    return policyAssessment.interpretation_policy
      .capacity_compatibility_source_aggregation_policy_key;
  }

  return (
    policyAssessment.aggregation_policy_assessment.aggregation_policy?.key ??
    null
  );
}

function assertCompatibleResultAndPolicyContexts(
  resultSet: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSetAssessment,
  policySet: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySetAssessment
): void {
  const resultByCandidate = new Map(
    resultSet.candidate_assessments.map((c) => [c.candidate_key, c])
  );
  const policyByCandidate = new Map(
    policySet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  if (resultByCandidate.size !== resultSet.candidate_assessments.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in GROUND-166 set`
    );
  }
  if (policyByCandidate.size !== policySet.candidate_assessments.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in GROUND-167 set`
    );
  }

  if (resultByCandidate.size !== policyByCandidate.size) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  for (const [candidateKey, resultCandidate] of resultByCandidate) {
    const policyCandidate = policyByCandidate.get(candidateKey);
    if (!policyCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-167 candidate ${candidateKey}`
      );
    }

    const resultByBinding = new Map(
      resultCandidate.binding_aggregation_result_assessments.map((a) => [
        bindingJoinKey(a),
        a,
      ])
    );
    const policyByBinding = new Map(
      policyCandidate.binding_interpretation_policy_assessments.map((a) => [
        bindingJoinKey(a),
        a,
      ])
    );

    if (resultByBinding.size !== policyByBinding.size) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Binding count mismatch for candidate ${candidateKey}`
      );
    }

    for (const [joinKey, resultAssessment] of resultByBinding) {
      const policyAssessment = policyByBinding.get(joinKey);
      if (!policyAssessment) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-167 Binding assessment ${joinKey} for candidate ${candidateKey}`
        );
      }

      const resultPolicyKey =
        extractAggregationPolicyKeyFromResultBinding(resultAssessment);
      const policyPolicyKey =
        extractAggregationPolicyKeyFromInterpretationPolicyBinding(
          policyAssessment
        );

      if (resultPolicyKey !== policyPolicyKey) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: aggregation-policy key mismatch for Binding ${joinKey}`
        );
      }

      const resultNotApplicable =
        resultAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY";
      const policyNotApplicable =
        policyAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY";

      if (resultNotApplicable !== policyNotApplicable) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: inconsistent NOT_APPLICABLE Aggregation-Policy lineage for Binding ${joinKey}`
        );
      }
    }
  }

  for (const candidateKey of policyByCandidate.keys()) {
    if (!resultByCandidate.has(candidateKey)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-166 candidate ${candidateKey}`
      );
    }
  }
}

function assertBindingBasisInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: PRESENT requires non-null basis for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_interpretation_basis) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: PRESENT requires has_basis true for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: PRESENT requires interpretation for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.interpretation !==
      assessment.interpretation_basis.interpretation
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: interpretation mismatch for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.interpretation_basis !== null) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: non-present status requires null basis for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.has_interpretation_basis) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: non-present status requires has_basis false for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.interpretation !== null) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: non-present status requires null interpretation for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

function buildInterpretationBasis(
  aggregationResult: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResult,
  interpretationPolicy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicy,
  matchedMapping: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasis {
  if (
    aggregationResult.capacity_compatibility_source_aggregation_policy_key !==
    interpretationPolicy.capacity_compatibility_source_aggregation_policy_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: aggregation-policy key mismatch between Result and Interpretation Policy`
    );
  }

  if (
    matchedMapping.aggregation_result_value !== aggregationResult.value
  ) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: matched mapping source ${matchedMapping.aggregation_result_value} != current Result ${aggregationResult.value}`
    );
  }

  if (
    matchedMapping.interpretation !== INTERP_SUPPORTING &&
    matchedMapping.interpretation !== INTERP_CONTRADICTING
  ) {
    throw new Error(
      `Unknown Capacity-Compatibility Source Aggregation Result Interpretation: ${String(matchedMapping.interpretation)}`
    );
  }

  if (
    aggregationResult.value !== RESULT_HOLDS &&
    aggregationResult.value !== RESULT_DNH
  ) {
    throw new Error(
      `Unknown Capacity-Compatibility Source Aggregation Result value: ${String(aggregationResult.value)}`
    );
  }

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisKey(
      {
        candidate_key: aggregationResult.candidate_key,
        observation_need_key: aggregationResult.observation_need_key,
        capability_requirement_set_key:
          aggregationResult.capability_requirement_set_key,
        observation_resource_requirement_key:
          aggregationResult.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          aggregationResult.resource_readiness_observation_context_binding_key,
        resource_declaration_id: aggregationResult.resource_declaration_id,
        evaluation_at: aggregationResult.evaluation_at,
        capacity_compatibility_source_aggregation_policy_key:
          aggregationResult.capacity_compatibility_source_aggregation_policy_key,
        capacity_compatibility_source_aggregation_result_key:
          aggregationResult.key,
        current_aggregation_result_value: aggregationResult.value,
        aggregation_result_interpretation_policy_key: interpretationPolicy.key,
        matched_mapping_key: matchedMapping.key,
        interpretation: matchedMapping.interpretation,
      }
    ),
    candidate_key: aggregationResult.candidate_key,
    observation_need_key: aggregationResult.observation_need_key,
    capability_requirement_set_key:
      aggregationResult.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      aggregationResult.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      aggregationResult.resource_readiness_observation_context_binding_key,
    resource_declaration_id: aggregationResult.resource_declaration_id,
    evaluation_at: aggregationResult.evaluation_at,
    capacity_compatibility_source_aggregation_policy_key:
      aggregationResult.capacity_compatibility_source_aggregation_policy_key,
    capacity_compatibility_source_aggregation_result_key:
      aggregationResult.key,
    current_aggregation_result_value: aggregationResult.value,
    aggregation_result_interpretation_policy_key: interpretationPolicy.key,
    matched_mapping_key: matchedMapping.key,
    interpretation: matchedMapping.interpretation,
  };
}

function nullBasisAssessment(
  resultAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment,
  policyAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment,
  status: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment["status"]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment {
  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment =
    {
      observation_resource_requirement_key:
        resultAssessment.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        resultAssessment.resource_readiness_observation_context_binding_key,
      resource_declaration_id: resultAssessment.resource_declaration_id,
      aggregation_result_assessment: resultAssessment,
      aggregation_result_interpretation_policy_assessment: policyAssessment,
      status,
      interpretation_basis: null,
      interpretation: null,
      has_interpretation_basis: false,
    };
  assertBindingBasisInvariant(assessment);
  return assessment;
}

function assessBindingInterpretationBasis(
  resultAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment,
  policyAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment {
  const resultPolicyKey =
    extractAggregationPolicyKeyFromResultBinding(resultAssessment);
  const policyPolicyKey =
    extractAggregationPolicyKeyFromInterpretationPolicyBinding(policyAssessment);

  if (resultPolicyKey !== policyPolicyKey) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: aggregation-policy key mismatch for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  // 1. NOT_APPLICABLE — no Aggregation Policy domain
  if (
    resultAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" ||
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" ||
    resultPolicyKey === null
  ) {
    if (
      resultAssessment.status !==
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" ||
      policyAssessment.status !==
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: inconsistent NOT_APPLICABLE lineage for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
      );
    }

    return nullBasisAssessment(
      resultAssessment,
      policyAssessment,
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
    );
  }

  // 2. NO_READINESS_POLICY — before no-current-Result / Policy lookup
  if (
    resultAssessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  ) {
    if (resultAssessment.aggregation_result !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: NO_READINESS_POLICY must not carry Result for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return nullBasisAssessment(
      resultAssessment,
      policyAssessment,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
    );
  }

  // 3. NO_CURRENT_RESULT because readiness DNH — before NO_POLICY/NO_MAPPING
  if (
    resultAssessment.status ===
    "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
  ) {
    if (resultAssessment.aggregation_result !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: NO_CURRENT_RESULT must not carry Result for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return nullBasisAssessment(
      resultAssessment,
      policyAssessment,
      "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
  }

  // Current Result must be PRESENT from here.
  if (
    resultAssessment.status !==
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_PRESENT" ||
    resultAssessment.aggregation_result === null ||
    resultAssessment.result_value === null
  ) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: unexpected GROUND-166 status ${resultAssessment.status} for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (
    resultAssessment.aggregation_result.value !== resultAssessment.result_value
  ) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: Result status/value coherence failure for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  // 4. NO_INTERPRETATION_POLICY
  if (
    policyAssessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (policyAssessment.interpretation_policy !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: NO_POLICY must not carry Policy for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return nullBasisAssessment(
      resultAssessment,
      policyAssessment,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_DECLARED"
    );
  }

  if (
    policyAssessment.status !==
    "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT"
  ) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: unexpected GROUND-167 status ${policyAssessment.status} for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (policyAssessment.interpretation_policy === null) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result Interpretation Basis invariant violated: POLICY_PRESENT requires non-null Policy for Binding ${resultAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  // 5. Exact mapping lookup — NO_MAPPING or BASIS_PRESENT
  const matchedMapping =
    findExactDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping(
      policyAssessment.interpretation_policy.mappings,
      resultAssessment.aggregation_result.value
    );

  if (!matchedMapping) {
    return nullBasisAssessment(
      resultAssessment,
      policyAssessment,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
  }

  const interpretation_basis = buildInterpretationBasis(
    resultAssessment.aggregation_result,
    policyAssessment.interpretation_policy,
    matchedMapping
  );

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment =
    {
      observation_resource_requirement_key:
        resultAssessment.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        resultAssessment.resource_readiness_observation_context_binding_key,
      resource_declaration_id: resultAssessment.resource_declaration_id,
      aggregation_result_assessment: resultAssessment,
      aggregation_result_interpretation_policy_assessment: policyAssessment,
      status:
        "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT",
      interpretation_basis,
      interpretation: interpretation_basis.interpretation,
      has_interpretation_basis: true,
    };
  assertBindingBasisInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Result Interpretation Basis assessment.
 * Exact mapping lookup only — no Result recomputation / readiness re-evaluation.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasis(
  resultAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultAssessment,
  policyAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisAssessment {
  if (resultAssessment.candidate_key !== policyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch (${resultAssessment.candidate_key} vs ${policyAssessment.candidate_key})`
    );
  }

  const policyByBinding = new Map(
    policyAssessment.binding_interpretation_policy_assessments.map((a) => [
      bindingJoinKey(a),
      a,
    ])
  );

  const binding_interpretation_basis_assessments =
    resultAssessment.binding_aggregation_result_assessments.map(
      (bindingResultAssessment) => {
        const bindingPolicyAssessment = policyByBinding.get(
          bindingJoinKey(bindingResultAssessment)
        );
        if (!bindingPolicyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-167 Binding ${bindingJoinKey(bindingResultAssessment)}`
          );
        }
        return assessBindingInterpretationBasis(
          bindingResultAssessment,
          bindingPolicyAssessment
        );
      }
    );

  return {
    candidate_key: resultAssessment.candidate_key,
    capacity_compatibility_source_aggregation_result_assessment:
      resultAssessment,
    capacity_compatibility_source_aggregation_result_interpretation_policy_assessment:
      policyAssessment,
    binding_interpretation_basis_assessments,
    has_interpretation_bases: binding_interpretation_basis_assessments.some(
      (assessment) => assessment.has_interpretation_basis
    ),
    has_supporting_aggregated_capacity_compatibility_evidence_interpretations:
      binding_interpretation_basis_assessments.some(
        (assessment) => assessment.interpretation === INTERP_SUPPORTING
      ),
    has_contradicting_aggregated_capacity_compatibility_evidence_interpretations:
      binding_interpretation_basis_assessments.some(
        (assessment) => assessment.interpretation === INTERP_CONTRADICTING
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capacity-Compatibility Source Aggregation Result
 * Interpretation Basis. Preserves GROUND-166 AttentionCandidate order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisSetAssessment {
  assertCompatibleResultAndPolicyContexts(
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_set,
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_policy_set
  );

  const policyByCandidate = new Map(
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_policy_set.candidate_assessments.map(
      (assessment) => [assessment.candidate_key, assessment]
    )
  );

  const candidate_assessments =
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_set.candidate_assessments.map(
      (resultAssessment) => {
        const policyAssessment = policyByCandidate.get(
          resultAssessment.candidate_key
        );
        if (!policyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-167 candidate ${resultAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasis(
          resultAssessment,
          policyAssessment
        );
      }
    );

  return {
    resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_set:
      input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_set,
    resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_policy_set:
      input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_policy_set,
    candidate_assessments,
    has_interpretation_bases: candidate_assessments.some(
      (assessment) => assessment.has_interpretation_bases
    ),
    has_supporting_aggregated_capacity_compatibility_evidence_interpretations:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_supporting_aggregated_capacity_compatibility_evidence_interpretations
      ),
    has_contradicting_aggregated_capacity_compatibility_evidence_interpretations:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_contradicting_aggregated_capacity_compatibility_evidence_interpretations
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
