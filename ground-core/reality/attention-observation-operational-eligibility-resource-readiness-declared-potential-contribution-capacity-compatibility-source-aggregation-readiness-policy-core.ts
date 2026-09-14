/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Explicit Declared Potential Contribution Capacity-Compatibility
 * Source Aggregation Readiness Policy (GROUND-164).
 *
 * Pure composition of:
 *   GROUND-163 Capacity-Compatibility Source Aggregation Policy Set
 *   + explicit Aggregation Readiness Policy Specification
 *
 * Declaration only. Must not import GROUND-161/160/159/157/155/153,
 * project persistence, readiness Basis/Result, ANY/ALL evaluation, or
 * Resource Readiness / OE / execution semantics.
 *
 * readiness policy ≠ readiness currently HOLDS
 * NO_READINESS_POLICY ≠ readiness DOES_NOT_HOLD
 * NOT_APPLICABLE ≠ readiness failure
 * all-selected-resolved ≠ all SUPPORTING
 * CONTRADICTING is resolved; resolved ≠ supporting
 * ANY/ALL short-circuit readiness not modeled
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessRequirement,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyModelLimitation[] =
  [
    "CURRENT_SELECTED_CAPACITY_SOURCE_PRESENCE_NOT_EVALUATED",
    "CURRENT_SELECTED_CAPACITY_SOURCE_RESOLVEDNESS_NOT_EVALUATED",
    "MISSING_SELECTED_CAPACITY_SOURCE_REASON_NOT_MODELED",
    "UNRESOLVED_SELECTED_CAPACITY_SOURCE_REASON_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
    "AGGREGATED_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_NOT_MODELED",
    "MULTIPLE_CAPACITY_SOURCE_AGGREGATION_GROUPS_PER_BINDING_NOT_MODELED",
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

/**
 * Canonical readiness-requirement order — serialization only, not preference.
 * Currently one requirement only.
 */
export const CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_REQUIREMENT_ORDER: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessRequirement[] =
  [
    "REQUIRE_ALL_SELECTED_CAPACITY_SOURCE_EVIDENCE_STATES_RESOLVED_BEFORE_AGGREGATION",
  ];

/**
 * Future GROUND-165 resolved GROUND-161 State vocabulary (documentation only).
 * GROUND-164 does not classify current states.
 * resolved = SUPPORTING or CONTRADICTING (not SUPPORTING-only).
 */
export const FUTURE_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESOLVED_STATES = [
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SUPPORTING",
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_CONTRADICTING",
] as const;

/**
 * Future GROUND-165 unresolved GROUND-161 State vocabulary (documentation only).
 * GROUND-164 does not inspect current states.
 */
export const FUTURE_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_UNRESOLVED_STATES = [
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY",
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
] as const;

const READINESS_REQUIREMENT_ORDER = new Map(
  CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_REQUIREMENT_ORDER.map(
    (value, index) => [value, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeReadinessRequirement(
  requirement: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessRequirement
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessRequirement {
  if (!READINESS_REQUIREMENT_ORDER.has(requirement)) {
    throw new Error(
      `Unknown Declared Potential Contribution Capacity-Compatibility Source Aggregation Readiness requirement: ${String(requirement)}`
    );
  }
  return requirement;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|bindingKey|resourceDeclarationId|
 * aggregationPolicyKey|
 * REQUIRE_ALL_SELECTED_CAPACITY_SOURCE_EVIDENCE_STATES_RESOLVED_BEFORE_AGGREGATION
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  capacity_compatibility_source_aggregation_policy_key: string;
  readiness_requirement: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessRequirement;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.capacity_compatibility_source_aggregation_policy_key,
    params.readiness_requirement,
  ].join("|");
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
 * Validates and normalizes Aggregation Readiness Policy specification
 * against authoritative GROUND-163 Aggregation Policy Set.
 *
 * Exact duplicate (same aggregation-policy key + same readiness requirement) → one.
 * Same aggregation-policy key + different readiness requirements → reject.
 * Unknown / stale / NO_POLICY targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification(
  aggregationPolicySet: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification {
  const policiesByKey = collectAggregationPoliciesByKey(aggregationPolicySet);
  const byAggregationPolicyKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyInput
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

    const readiness_requirement = normalizeReadinessRequirement(
      entry.readiness_requirement
    );
    const existing = byAggregationPolicyKey.get(
      entry.capacity_compatibility_source_aggregation_policy_key
    );
    if (existing) {
      if (existing.readiness_requirement !== readiness_requirement) {
        throw new Error(
          `Conflicting Declared Potential Contribution Capacity-Compatibility Source Aggregation Readiness Policies declared for Aggregation Policy ${entry.capacity_compatibility_source_aggregation_policy_key}`
        );
      }
      continue;
    }

    byAggregationPolicyKey.set(
      entry.capacity_compatibility_source_aggregation_policy_key,
      {
        capacity_compatibility_source_aggregation_policy_key:
          entry.capacity_compatibility_source_aggregation_policy_key,
        readiness_requirement,
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

function buildReadinessPolicy(
  aggregationPolicy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy,
  readinessRequirement: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessRequirement
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicy {
  const readiness_requirement =
    normalizeReadinessRequirement(readinessRequirement);

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyKey(
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
        readiness_requirement,
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
    readiness_requirement,
  };
}

function assertBindingReadinessAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyBindingAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
  ) {
    if (assessment.readiness_policy === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Policy invariant violated: PRESENT requires non-null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      !assessment.has_explicit_capacity_compatibility_source_aggregation_readiness_policy
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Policy invariant violated: PRESENT requires boolean true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.aggregation_policy_assessment.aggregation_policy === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Policy invariant violated: PRESENT requires GROUND-163 Aggregation Policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.readiness_policy
        .capacity_compatibility_source_aggregation_policy_key !==
      assessment.aggregation_policy_assessment.aggregation_policy.key
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Policy invariant violated: readiness policy must target exact GROUND-163 Aggregation Policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  ) {
    if (assessment.readiness_policy !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Policy invariant violated: non-present status requires null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.has_explicit_capacity_compatibility_source_aggregation_readiness_policy
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Policy invariant violated: non-present status requires boolean false for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown Capacity-Compatibility Source Aggregation Readiness Policy status: ${String(assessment.status)}`
  );
}

function assessBindingReadinessPolicy(
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment,
  readinessByAggregationPolicyKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyInput
  >
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyBindingAssessment {
  if (
    bindingAssessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_DECLARED" ||
    bindingAssessment.aggregation_policy === null
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyBindingAssessment =
      {
        observation_resource_requirement_key:
          bindingAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          bindingAssessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id: bindingAssessment.resource_declaration_id,
        aggregation_policy_assessment: bindingAssessment,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY",
        readiness_policy: null,
        has_explicit_capacity_compatibility_source_aggregation_readiness_policy:
          false,
      };
    assertBindingReadinessAssessmentInvariant(assessment);
    return assessment;
  }

  const declared = readinessByAggregationPolicyKey.get(
    bindingAssessment.aggregation_policy.key
  );
  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyBindingAssessment =
      {
        observation_resource_requirement_key:
          bindingAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          bindingAssessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id: bindingAssessment.resource_declaration_id,
        aggregation_policy_assessment: bindingAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
        readiness_policy: null,
        has_explicit_capacity_compatibility_source_aggregation_readiness_policy:
          false,
      };
    assertBindingReadinessAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyBindingAssessment =
    {
      observation_resource_requirement_key:
        bindingAssessment.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        bindingAssessment.resource_readiness_observation_context_binding_key,
      resource_declaration_id: bindingAssessment.resource_declaration_id,
      aggregation_policy_assessment: bindingAssessment,
      status:
        "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT",
      readiness_policy: buildReadinessPolicy(
        bindingAssessment.aggregation_policy,
        declared.readiness_requirement
      ),
      has_explicit_capacity_compatibility_source_aggregation_readiness_policy:
        true,
    };
  assertBindingReadinessAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Aggregation Readiness Policy assessment.
 * Does not consume GROUND-161 States or evaluate readiness HOLDS.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicy(
  aggregationPolicyAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyAssessment,
  readinessByAggregationPolicyKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyAssessment {
  const binding_readiness_policy_assessments =
    aggregationPolicyAssessment.binding_aggregation_policy_assessments.map(
      (bindingAssessment) =>
        assessBindingReadinessPolicy(
          bindingAssessment,
          readinessByAggregationPolicyKey
        )
    );

  binding_readiness_policy_assessments.sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return {
    candidate_key: aggregationPolicyAssessment.candidate_key,
    capacity_compatibility_source_aggregation_policy_assessment:
      aggregationPolicyAssessment,
    binding_readiness_policy_assessments,
    has_explicit_capacity_compatibility_source_aggregation_readiness_policies:
      binding_readiness_policy_assessments.some(
        (assessment) =>
          assessment.has_explicit_capacity_compatibility_source_aggregation_readiness_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Capacity-Compatibility Source Aggregation
 * Readiness Policy. Preserves GROUND-163 AttentionCandidate order.
 * Does not inspect current GROUND-161 States or produce readiness results.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySpecification(
      input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set,
      input.specification
    );

  const readinessByAggregationPolicyKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.capacity_compatibility_source_aggregation_policy_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set.candidate_assessments.map(
      (aggregationPolicyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicy(
          aggregationPolicyAssessment,
          readinessByAggregationPolicyKey
        )
    );

  return {
    resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set:
      input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capacity_compatibility_source_aggregation_readiness_policies:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_capacity_compatibility_source_aggregation_readiness_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
