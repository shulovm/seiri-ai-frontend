/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Explicit Declared Potential Contribution Capacity-Compatibility
 * Source Aggregation Policy (GROUND-163).
 *
 * Pure composition of:
 *   GROUND-161 Canonical Per-source Capacity-Relation Evidence State Set
 *   + explicit Aggregation Policy Specification
 *
 * Declaration only. Uses GROUND-161 solely for stable Binding context and
 * capacity_declaration_key membership domain validation.
 *
 * MUST NOT inspect current State values / isResolved / SUPPORTING /
 * CONTRADICTING / UNRESOLVED* as Policy semantics.
 * MUST NOT evaluate ANY/ALL. MUST NOT create readiness / Result.
 *
 * empty member set / vacuous ANY/ALL forbidden
 * ANY ≠ physical alternative; ALL ≠ cumulative capacity
 * selected membership ≠ preferred / trusted / physically usable
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperator,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyModelLimitation[] =
  [
    "CURRENT_SELECTED_CAPACITY_SOURCE_PRESENCE_READINESS_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
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

export const CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_OPERATOR_ORDER: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperator[] =
  [
    "ANY_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITION_HOLDS",
    "ALL_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITIONS_HOLD",
  ];

const OPERATOR_ORDER = new Map(
  CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_OPERATOR_ORDER.map(
    (value, index) => [value, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeOperator(
  operator: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperator
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperator {
  if (!OPERATOR_ORDER.has(operator)) {
    throw new Error(
      `Unknown Declared Potential Contribution Capacity-Compatibility Source Aggregation operator: ${String(operator)}`
    );
  }
  return operator;
}

/**
 * Exact duplicates → one. Order has no semantic meaning.
 * Empty after normalization is rejected by callers (vacuous ANY/ALL forbidden).
 */
export function canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberKeys(
  selectedCapacityDeclarationKeys: readonly string[]
): string[] {
  if (!Array.isArray(selectedCapacityDeclarationKeys)) {
    throw new Error("selected_capacity_declaration_keys must be an array");
  }
  const unique = new Set<string>();
  for (const raw of selectedCapacityDeclarationKeys) {
    if (!raw || raw.trim().length === 0) {
      throw new Error(
        "selected_capacity_declaration_keys entries must be non-empty"
      );
    }
    unique.add(raw);
  }
  return [...unique].sort(compareStrings);
}

export function buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberSetKey(
  selectedCapacityDeclarationKeys: readonly string[]
): string {
  return canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberKeys(
    selectedCapacityDeclarationKeys
  ).join(",");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|bindingKey|resourceDeclarationId|
 * canonicalSelectedCapacityDeclarationKeySet|operator
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  selected_capacity_declaration_keys: readonly string[];
  operator: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperator;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberSetKey(
      params.selected_capacity_declaration_keys
    ),
    params.operator,
  ].join("|");
}

interface StableBindingDomain {
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateAssessment;
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  capacityDeclarationKeys: ReadonlySet<string>;
}

/**
 * Extract stable Binding domains and capacity_declaration_key membership.
 * Uses only stable identity fields — not current semantic State values.
 */
function collectStableBindingDomains(
  stateSet: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSetAssessment
): Map<string, StableBindingDomain> {
  const byBindingKey = new Map<string, StableBindingDomain>();

  for (const candidate of stateSet.candidate_assessments) {
    for (const binding of candidate.binding_state_assessments) {
      const bindingKey =
        binding.resource_readiness_observation_context_binding_key;

      const capacityDeclarationKeys = new Set<string>();
      for (const source of binding.source_state_assessments) {
        const capacityKey =
          source.canonical_state.capacity_declaration_key;
        if (
          source.canonical_state.resource_readiness_observation_context_binding_key !==
          bindingKey
        ) {
          throw new Error(
            `GROUND-161 Binding/source Binding-key mismatch for ${bindingKey}`
          );
        }
        if (
          source.canonical_state.resource_declaration_id !==
          binding.resource_declaration_id
        ) {
          throw new Error(
            `GROUND-161 Binding/source ResourceDeclaration mismatch for ${bindingKey}`
          );
        }
        capacityDeclarationKeys.add(capacityKey);
      }

      let candidate_key = candidate.candidate_key;
      let observation_need_key = "";
      let capability_requirement_set_key = "";

      if (binding.source_state_assessments.length > 0) {
        const lineage = binding.source_state_assessments[0]!.canonical_state;
        candidate_key = lineage.candidate_key;
        observation_need_key = lineage.observation_need_key;
        capability_requirement_set_key = lineage.capability_requirement_set_key;
      } else {
        const rawBasis =
          binding.capacity_relation_interpretation_basis_binding_assessment
            .raw_relation_binding_assessment.raw_relation_basis;
        if (rawBasis !== null) {
          candidate_key = rawBasis.candidate_key;
          observation_need_key = rawBasis.observation_need_key;
          capability_requirement_set_key =
            rawBasis.capability_requirement_set_key;
        } else {
          const raw =
            binding.capacity_relation_interpretation_basis_binding_assessment
              .raw_relation_binding_assessment
              .quantity_relation_binding_assessment
              .raw_binding_evidence_assessment;
          candidate_key = raw.candidate_key;
          observation_need_key = raw.observation_need_key;
          capability_requirement_set_key = raw.capability_requirement_set_key;
        }
      }

      if (candidate_key !== candidate.candidate_key) {
        throw new Error(
          `GROUND-161 Binding ${bindingKey} candidate mismatch`
        );
      }

      if (byBindingKey.has(bindingKey)) {
        throw new Error(
          `Ambiguous GROUND-161 Binding key ${bindingKey}`
        );
      }

      byBindingKey.set(bindingKey, {
        candidateAssessment: candidate,
        bindingAssessment: binding,
        candidate_key,
        observation_need_key,
        capability_requirement_set_key,
        capacityDeclarationKeys,
      });
    }
  }

  return byBindingKey;
}

function policiesEqual(
  a: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyInput,
  b: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyInput
): boolean {
  if (a.operator !== b.operator) {
    return false;
  }
  if (
    a.resource_readiness_observation_context_binding_key !==
    b.resource_readiness_observation_context_binding_key
  ) {
    return false;
  }
  const membersA =
    canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberKeys(
      a.selected_capacity_declaration_keys
    );
  const membersB =
    canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberKeys(
      b.selected_capacity_declaration_keys
    );
  if (membersA.length !== membersB.length) {
    return false;
  }
  for (let i = 0; i < membersA.length; i++) {
    if (membersA[i] !== membersB[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Validates and normalizes Aggregation Policy specification against
 * authoritative GROUND-161 Binding / capacity_declaration_key domains.
 *
 * Exact duplicate Binding policies → one.
 * Same Binding + different members/operator → reject.
 * Empty / unknown / cross-Binding members → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification(
  stateSet: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification {
  const domainsByBindingKey = collectStableBindingDomains(stateSet);
  const byBindingKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyInput
  >();

  if (!Array.isArray(specification.policies)) {
    throw new Error("policies must be an array");
  }

  for (const entry of specification.policies) {
    if (
      !entry.resource_readiness_observation_context_binding_key ||
      entry.resource_readiness_observation_context_binding_key.trim().length ===
        0
    ) {
      throw new Error(
        "resource_readiness_observation_context_binding_key must be non-empty"
      );
    }

    const domain = domainsByBindingKey.get(
      entry.resource_readiness_observation_context_binding_key
    );
    if (!domain) {
      throw new Error(
        `Unknown or stale RESOURCE_READINESS Observation-Context Binding ${entry.resource_readiness_observation_context_binding_key}`
      );
    }

    const operator = normalizeOperator(entry.operator);
    const selected_capacity_declaration_keys =
      canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberKeys(
        entry.selected_capacity_declaration_keys
      );

    if (selected_capacity_declaration_keys.length === 0) {
      throw new Error(
        `Declared Potential Contribution Capacity-Compatibility Source Aggregation Policy forbids empty member sets for binding ${entry.resource_readiness_observation_context_binding_key} (vacuous ANY/ALL forbidden)`
      );
    }

    for (const capacityKey of selected_capacity_declaration_keys) {
      if (!domain.capacityDeclarationKeys.has(capacityKey)) {
        throw new Error(
          `Unknown, stale, or cross-Binding capacity declaration ${capacityKey} for binding ${entry.resource_readiness_observation_context_binding_key}`
        );
      }
    }

    const normalized: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyInput =
      {
        resource_readiness_observation_context_binding_key:
          entry.resource_readiness_observation_context_binding_key,
        selected_capacity_declaration_keys,
        operator,
      };

    const existing = byBindingKey.get(
      entry.resource_readiness_observation_context_binding_key
    );
    if (existing) {
      if (!policiesEqual(existing, normalized)) {
        throw new Error(
          `Conflicting Declared Potential Contribution Capacity-Compatibility Source Aggregation Policies declared for binding ${entry.resource_readiness_observation_context_binding_key}`
        );
      }
      continue;
    }

    byBindingKey.set(
      entry.resource_readiness_observation_context_binding_key,
      normalized
    );
  }

  const policies = [...byBindingKey.values()].sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return { policies };
}

function buildAggregationPolicy(
  domain: StableBindingDomain,
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy {
  const selected_capacity_declaration_keys =
    canonicalizeDeclaredPotentialContributionCapacityCompatibilitySourceAggregationMemberKeys(
      input.selected_capacity_declaration_keys
    );
  const operator = normalizeOperator(input.operator);

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyKey(
      {
        candidate_key: domain.candidate_key,
        observation_need_key: domain.observation_need_key,
        capability_requirement_set_key: domain.capability_requirement_set_key,
        observation_resource_requirement_key:
          domain.bindingAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          domain.bindingAssessment
            .resource_readiness_observation_context_binding_key,
        resource_declaration_id:
          domain.bindingAssessment.resource_declaration_id,
        selected_capacity_declaration_keys,
        operator,
      }
    ),
    candidate_key: domain.candidate_key,
    observation_need_key: domain.observation_need_key,
    capability_requirement_set_key: domain.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      domain.bindingAssessment.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      domain.bindingAssessment.resource_readiness_observation_context_binding_key,
    resource_declaration_id: domain.bindingAssessment.resource_declaration_id,
    selected_capacity_declaration_keys,
    operator,
  };
}

function assertBindingPolicyInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_PRESENT"
  ) {
    if (assessment.aggregation_policy === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Policy invariant violated: PRESENT requires non-null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.aggregation_policy.selected_capacity_declaration_keys
        .length === 0
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Policy invariant violated: empty member set for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_explicit_capacity_compatibility_source_aggregation_policy) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Policy invariant violated: PRESENT requires boolean true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_DECLARED"
  ) {
    if (assessment.aggregation_policy !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Policy invariant violated: NO_POLICY requires null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.has_explicit_capacity_compatibility_source_aggregation_policy) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Policy invariant violated: NO_POLICY requires boolean false for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown Capacity-Compatibility Source Aggregation Policy status: ${String(assessment.status)}`
  );
}

function assessBindingAggregationPolicy(
  domain: StableBindingDomain,
  policiesByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyInput
  >
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment {
  const declared = policiesByBindingKey.get(
    domain.bindingAssessment.resource_readiness_observation_context_binding_key
  );

  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment =
      {
        observation_resource_requirement_key:
          domain.bindingAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          domain.bindingAssessment
            .resource_readiness_observation_context_binding_key,
        resource_declaration_id:
          domain.bindingAssessment.resource_declaration_id,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_DECLARED",
        aggregation_policy: null,
        has_explicit_capacity_compatibility_source_aggregation_policy: false,
      };
    assertBindingPolicyInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyBindingAssessment =
    {
      observation_resource_requirement_key:
        domain.bindingAssessment.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        domain.bindingAssessment
          .resource_readiness_observation_context_binding_key,
      resource_declaration_id: domain.bindingAssessment.resource_declaration_id,
      status:
        "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_PRESENT",
      aggregation_policy: buildAggregationPolicy(domain, declared),
      has_explicit_capacity_compatibility_source_aggregation_policy: true,
    };
  assertBindingPolicyInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Aggregation Policy assessment.
 * Does not inspect current GROUND-161 State values.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy(
  stateCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateAssessment,
  policiesByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyAssessment {
  const binding_aggregation_policy_assessments =
    stateCandidate.binding_state_assessments.map((binding) => {
      let candidate_key = stateCandidate.candidate_key;
      let observation_need_key = "";
      let capability_requirement_set_key = "";
      const capacityDeclarationKeys = new Set<string>();

      for (const source of binding.source_state_assessments) {
        capacityDeclarationKeys.add(
          source.canonical_state.capacity_declaration_key
        );
      }

      if (binding.source_state_assessments.length > 0) {
        const lineage = binding.source_state_assessments[0]!.canonical_state;
        candidate_key = lineage.candidate_key;
        observation_need_key = lineage.observation_need_key;
        capability_requirement_set_key = lineage.capability_requirement_set_key;
      } else {
        const rawBasis =
          binding.capacity_relation_interpretation_basis_binding_assessment
            .raw_relation_binding_assessment.raw_relation_basis;
        if (rawBasis !== null) {
          candidate_key = rawBasis.candidate_key;
          observation_need_key = rawBasis.observation_need_key;
          capability_requirement_set_key =
            rawBasis.capability_requirement_set_key;
        } else {
          const raw =
            binding.capacity_relation_interpretation_basis_binding_assessment
              .raw_relation_binding_assessment
              .quantity_relation_binding_assessment
              .raw_binding_evidence_assessment;
          candidate_key = raw.candidate_key;
          observation_need_key = raw.observation_need_key;
          capability_requirement_set_key = raw.capability_requirement_set_key;
        }
      }

      const domain: StableBindingDomain = {
        candidateAssessment: stateCandidate,
        bindingAssessment: binding,
        candidate_key,
        observation_need_key,
        capability_requirement_set_key,
        capacityDeclarationKeys,
      };
      return assessBindingAggregationPolicy(domain, policiesByBindingKey);
    });

  binding_aggregation_policy_assessments.sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return {
    candidate_key: stateCandidate.candidate_key,
    canonical_per_source_capacity_relation_evidence_state_assessment:
      stateCandidate,
    binding_aggregation_policy_assessments,
    has_explicit_capacity_compatibility_source_aggregation_policies:
      binding_aggregation_policy_assessments.some(
        (a) => a.has_explicit_capacity_compatibility_source_aggregation_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Capacity-Compatibility Source Aggregation Policy.
 * Preserves AttentionCandidate order. Does not evaluate ANY/ALL or readiness.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicyEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicySpecification(
      input.resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set,
      input.specification
    );

  const policiesByBindingKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.resource_readiness_observation_context_binding_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set.candidate_assessments.map(
      (stateCandidate) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy(
          stateCandidate,
          policiesByBindingKey
        )
    );

  return {
    resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
      input.resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capacity_compatibility_source_aggregation_policies:
      candidate_assessments.some(
        (a) => a.has_explicit_capacity_compatibility_source_aggregation_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
