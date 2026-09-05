/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Explicit Declared Potential Contribution Capacity-Compatibility
 * Source Aggregation Result Interpretation Policy (GROUND-167).
 *
 * Pure composition of:
 *   GROUND-163 Capacity-Compatibility Source Aggregation Policy Set
 *   + explicit Result Interpretation Policy Specification
 *
 * Declaration only. Does NOT consume current GROUND-166 Result values.
 * Does NOT apply mappings. Does NOT create Interpretation Basis.
 *
 * Must not import GROUND-166/165/164/161 builders or project persistence.
 * GROUND-166 ResultValue type may be referenced via types only.
 *
 * INTERPRET_AS_SUPPORTING_AGGREGATED_* ≠ capacity compatibility true
 * Result HOLDS ≠ SUPPORTING unless explicitly mapped
 * unusual mappings legal; partial Policy valid; explicit empty ≠ absence
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySpecification,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyModelLimitation[] =
  [
    "CURRENT_AGGREGATION_RESULT_INTERPRETATION_NOT_APPLIED",
    "AGGREGATION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
    "AGGREGATED_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_NOT_MODELED",
    "CAPACITY_COMPATIBILITY_PROPOSITION_TRUTH_NOT_MODELED",
    "MULTIPLE_CAPACITY_SOURCE_AGGREGATION_GROUPS_PER_BINDING_NOT_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED",
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

export const EMPTY_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET =
  "EMPTY_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET" as const;

export const CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_ORDER: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretation[] =
  [
    "INTERPRET_AS_SUPPORTING_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE",
    "INTERPRET_AS_CONTRADICTING_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE",
  ];

export const CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_VALUE_ORDER: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue[] =
  [
    "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS",
    "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD",
  ];

const INTERPRETATION_ORDER = new Map(
  CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_ORDER.map(
    (value, index) => [value, index]
  )
);

const RESULT_VALUE_ORDER = new Map(
  CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_VALUE_ORDER.map(
    (value, index) => [value, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeInterpretation(
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretation
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown Declared Potential Contribution Capacity-Compatibility Source Aggregation Result Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

function normalizeAggregationResultValue(
  value: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue {
  if (!RESULT_VALUE_ORDER.has(value)) {
    throw new Error(
      `Unknown Declared Potential Contribution Capacity-Compatibility Source Aggregation Result value: ${String(value)}`
    );
  }
  return value;
}

/**
 * Mapping identity — value-level source only.
 * ...aggregation-result-interpretation-mapping|aggregationResultValue|interpretation
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingKey(params: {
  aggregation_result_value: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-mapping",
    params.aggregation_result_value,
    params.interpretation,
  ].join("|");
}

export function buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingSetKey(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping[]
): string {
  if (mappings.length === 0) {
    return EMPTY_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET;
  }
  return mappings
    .map((mapping) => mapping.key)
    .sort(compareStrings)
    .join(",");
}

/**
 * Conceptual identity:
 * ...capacity-compatibility-source-aggregation-result-interpretation-policy|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|
 * aggregationPolicyKey|canonicalMappingSetKey
 *
 * Excludes: evaluationAt, readinessPolicyKey, readinessBasisKey,
 * current Result key/value, operand State keys/values.
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  capacity_compatibility_source_aggregation_policy_key: string;
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping[];
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.capacity_compatibility_source_aggregation_policy_key,
    buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingSetKey(
      params.mappings
    ),
  ].join("|");
}

/**
 * Canonicalize exact Result-value mappings.
 * Duplicate identical → one. Same source + different interpretation → reject.
 * Mapping order ≠ priority. Unusual mappings legal. Empty set valid.
 */
export function canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappings(
  mappingInputs: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingInput[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping[] {
  if (!Array.isArray(mappingInputs)) {
    throw new Error("mappings must be an array");
  }

  const byResultValue = new Map<
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping
  >();

  for (const entry of mappingInputs) {
    const aggregation_result_value = normalizeAggregationResultValue(
      entry.aggregation_result_value
    );
    const interpretation = normalizeInterpretation(entry.interpretation);
    const mapping: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMapping =
      {
        key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingKey(
          { aggregation_result_value, interpretation }
        ),
        aggregation_result_value,
        interpretation,
      };

    const existing = byResultValue.get(aggregation_result_value);
    if (existing) {
      if (existing.interpretation !== interpretation) {
        throw new Error(
          `Conflicting Declared Potential Contribution Capacity-Compatibility Source Aggregation Result Interpretation mappings for ${aggregation_result_value}`
        );
      }
      continue;
    }
    byResultValue.set(aggregation_result_value, mapping);
  }

  return [...byResultValue.values()].sort((a, b) => {
    const valueCompare =
      (RESULT_VALUE_ORDER.get(a.aggregation_result_value) ?? 0) -
      (RESULT_VALUE_ORDER.get(b.aggregation_result_value) ?? 0);
    if (valueCompare !== 0) return valueCompare;
    return (
      (INTERPRETATION_ORDER.get(a.interpretation) ?? 0) -
      (INTERPRETATION_ORDER.get(b.interpretation) ?? 0)
    );
  });
}

interface AggregationPolicyIndexEntry {
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyAssessment;
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment;
  policy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy;
}

function collectAggregationPoliciesByKey(
  aggregationPolicySet: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySetAssessment
): Map<string, AggregationPolicyIndexEntry> {
  const byKey = new Map<string, AggregationPolicyIndexEntry>();

  for (const candidate of aggregationPolicySet.candidate_assessments) {
    for (const bindingAssessment of candidate.binding_aggregation_policy_assessments) {
      if (
        bindingAssessment.status !==
          "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_PRESENT" ||
        bindingAssessment.aggregation_policy === null
      ) {
        continue;
      }

      const policy = bindingAssessment.aggregation_policy;
      if (byKey.has(policy.key)) {
        throw new Error(
          `Ambiguous Declared Potential Contribution Capacity-Compatibility Source Aggregation Policy key ${policy.key}`
        );
      }
      byKey.set(policy.key, {
        candidateAssessment: candidate,
        bindingAssessment,
        policy,
      });
    }
  }

  return byKey;
}

/**
 * Validates and normalizes Interpretation Policy specification against
 * authoritative GROUND-163 Aggregation Policy Set.
 *
 * Exact duplicate (same aggregation-policy key + same mapping set) → one.
 * Same aggregation-policy key + different mapping sets → reject.
 * Unknown / stale / NO_POLICY targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySpecification(
  aggregationPolicySet: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySpecification
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySpecification {
  const policiesByKey = collectAggregationPoliciesByKey(aggregationPolicySet);
  const byAggregationPolicyKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyInput
  >();

  if (!Array.isArray(specification.policies)) {
    throw new Error("policies must be an array");
  }

  for (const entry of specification.policies) {
    if (
      !entry.capacity_compatibility_source_aggregation_policy_key ||
      entry.capacity_compatibility_source_aggregation_policy_key.trim()
        .length === 0
    ) {
      throw new Error(
        "capacity_compatibility_source_aggregation_policy_key must be non-empty"
      );
    }

    const target = policiesByKey.get(
      entry.capacity_compatibility_source_aggregation_policy_key
    );
    if (!target) {
      throw new Error(
        `Unknown or stale Declared Potential Contribution Capacity-Compatibility Source Aggregation Policy key ${entry.capacity_compatibility_source_aggregation_policy_key}`
      );
    }

    const mappings =
      canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappings(
        entry.mappings
      );

    const existing = byAggregationPolicyKey.get(
      entry.capacity_compatibility_source_aggregation_policy_key
    );
    if (existing) {
      const existingCanonical =
        canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappings(
          existing.mappings
        );
      if (
        buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingSetKey(
          existingCanonical
        ) !==
        buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingSetKey(
          mappings
        )
      ) {
        throw new Error(
          `Conflicting Declared Potential Contribution Capacity-Compatibility Source Aggregation Result Interpretation Policies declared for Aggregation Policy ${entry.capacity_compatibility_source_aggregation_policy_key}`
        );
      }
      continue;
    }

    byAggregationPolicyKey.set(
      entry.capacity_compatibility_source_aggregation_policy_key,
      {
        capacity_compatibility_source_aggregation_policy_key:
          entry.capacity_compatibility_source_aggregation_policy_key,
        mappings,
      }
    );
  }

  const policies = [...byAggregationPolicyKey.values()].sort((a, b) =>
    compareStrings(
      a.capacity_compatibility_source_aggregation_policy_key,
      b.capacity_compatibility_source_aggregation_policy_key
    )
  );

  return { policies };
}

function buildInterpretationPolicy(
  aggregationPolicy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy,
  mappingInputs: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappingInput[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicy {
  const canonicalMappings =
    canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationMappings(
      mappingInputs
    );

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyKey(
      {
        candidate_key: aggregationPolicy.candidate_key,
        observation_need_key: aggregationPolicy.observation_need_key,
        capability_requirement_set_key:
          aggregationPolicy.capability_requirement_set_key,
        observation_resource_requirement_key:
          aggregationPolicy.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          aggregationPolicy.resource_readiness_observation_context_binding_key,
        resource_declaration_id: aggregationPolicy.resource_declaration_id,
        capacity_compatibility_source_aggregation_policy_key:
          aggregationPolicy.key,
        mappings: canonicalMappings,
      }
    ),
    candidate_key: aggregationPolicy.candidate_key,
    observation_need_key: aggregationPolicy.observation_need_key,
    capability_requirement_set_key:
      aggregationPolicy.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      aggregationPolicy.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      aggregationPolicy.resource_readiness_observation_context_binding_key,
    resource_declaration_id: aggregationPolicy.resource_declaration_id,
    capacity_compatibility_source_aggregation_policy_key: aggregationPolicy.key,
    mappings: canonicalMappings,
  };
}

function assertBindingInterpretationPolicyInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT"
  ) {
    if (assessment.interpretation_policy === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Policy invariant violated: PRESENT requires non-null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_explicit_result_interpretation_policy) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Policy invariant violated: PRESENT requires boolean true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.aggregation_policy_assessment.aggregation_policy === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Policy invariant violated: PRESENT requires GROUND-163 Aggregation Policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.interpretation_policy
        .capacity_compatibility_source_aggregation_policy_key !==
      assessment.aggregation_policy_assessment.aggregation_policy.key
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Policy invariant violated: interpretation policy must target exact GROUND-163 Aggregation Policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (assessment.interpretation_policy !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Policy invariant violated: non-present status requires null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.has_explicit_result_interpretation_policy) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result Interpretation Policy invariant violated: non-present status requires boolean false for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown Capacity-Compatibility Source Aggregation Result Interpretation Policy status: ${String(assessment.status)}`
  );
}

function assessBindingInterpretationPolicy(
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment,
  policiesByAggregationPolicyKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyInput
  >
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment {
  if (
    bindingAssessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_DECLARED" ||
    bindingAssessment.aggregation_policy === null
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment =
      {
        observation_resource_requirement_key:
          bindingAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          bindingAssessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id: bindingAssessment.resource_declaration_id,
        aggregation_policy_assessment: bindingAssessment,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY",
        interpretation_policy: null,
        has_explicit_result_interpretation_policy: false,
      };
    assertBindingInterpretationPolicyInvariant(assessment);
    return assessment;
  }

  const declared = policiesByAggregationPolicyKey.get(
    bindingAssessment.aggregation_policy.key
  );
  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment =
      {
        observation_resource_requirement_key:
          bindingAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          bindingAssessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id: bindingAssessment.resource_declaration_id,
        aggregation_policy_assessment: bindingAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_DECLARED",
        interpretation_policy: null,
        has_explicit_result_interpretation_policy: false,
      };
    assertBindingInterpretationPolicyInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyBindingAssessment =
    {
      observation_resource_requirement_key:
        bindingAssessment.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        bindingAssessment.resource_readiness_observation_context_binding_key,
      resource_declaration_id: bindingAssessment.resource_declaration_id,
      aggregation_policy_assessment: bindingAssessment,
      status:
        "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT",
      interpretation_policy: buildInterpretationPolicy(
        bindingAssessment.aggregation_policy,
        declared.mappings
      ),
      has_explicit_result_interpretation_policy: true,
    };
  assertBindingInterpretationPolicyInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Result Interpretation Policy assessment.
 * Does not consume current GROUND-166 Result values.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicy(
  aggregationPolicyAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyAssessment,
  policiesByAggregationPolicyKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyAssessment {
  const binding_interpretation_policy_assessments =
    aggregationPolicyAssessment.binding_aggregation_policy_assessments.map(
      (bindingAssessment) =>
        assessBindingInterpretationPolicy(
          bindingAssessment,
          policiesByAggregationPolicyKey
        )
    );

  binding_interpretation_policy_assessments.sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return {
    candidate_key: aggregationPolicyAssessment.candidate_key,
    capacity_compatibility_source_aggregation_policy_assessment:
      aggregationPolicyAssessment,
    binding_interpretation_policy_assessments,
    has_explicit_aggregation_result_interpretation_policies:
      binding_interpretation_policy_assessments.some(
        (assessment) => assessment.has_explicit_result_interpretation_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Aggregation Result Interpretation Policy.
 * Preserves GROUND-163 AttentionCandidate order.
 * Does not inspect current GROUND-166 Results or apply mappings.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicyEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicySpecification(
      input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set,
      input.specification
    );

  const policiesByAggregationPolicyKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.capacity_compatibility_source_aggregation_policy_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set.candidate_assessments.map(
      (aggregationPolicyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationPolicy(
          aggregationPolicyAssessment,
          policiesByAggregationPolicyKey
        )
    );

  return {
    resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set:
      input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_aggregation_result_interpretation_policies:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_aggregation_result_interpretation_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
