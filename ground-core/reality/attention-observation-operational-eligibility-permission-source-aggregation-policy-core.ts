/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Aggregation Policy core (GROUND-098).
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit PERMISSION Source Aggregation Policy Specification
 * → Explicit PERMISSION Source Aggregation Policy only.
 *
 * Declarative. Does not inspect current 093 sources / 094 coverage / 095
 * resolution / 096 criteria / 097 matches. Does not execute ANY/ALL.
 *
 * Must not import GROUND-093 / 094 / 095 / 096 / 097 / 091 / 024–090 / 085 /
 * ProjectState.
 *
 * aggregation policy ≠ aggregation result
 * ANY / ALL ≠ current condition holds
 * policy absence ≠ ANY ≠ ALL
 * ANY/ALL ≠ zero-source / vacuous-truth semantics
 * aggregation policy ≠ acceptance criterion ≠ resolution ≠ coverage
 * PERMISSION_PROHIBITED ≠ hidden veto
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicy,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyEvalInput,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyInput,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyStatus,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export const CANONICAL_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_KIND_ORDER: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind[] =
  [
    "ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE",
    "ALL_PERMISSION_SOURCES_LISTED_AS_ACCEPTABLE",
  ];

const AGGREGATION_KIND_ORDER = new Map(
  CANONICAL_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_KIND_ORDER.map(
    (k, i) => [k, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function canonicalizePermissionSourceAggregationPolicyKind(
  kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind
): AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind {
  if (!AGGREGATION_KIND_ORDER.has(kind)) {
    throw new Error(
      `Unknown Permission Source Aggregation Policy kind: ${String(kind)}`
    );
  }
  return kind;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-source-aggregation-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|PERMISSION|aggregationKind
 */
export function attentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  aggregation_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-source-aggregation-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    "PERMISSION",
    params.aggregation_kind,
  ].join("|");
}

function policyRequiresPermission(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy
): boolean {
  return policy.required_dimensions.includes("PERMISSION");
}

function collectPolicyAssessmentsByCandidateKey(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment
): Map<
  string,
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
> {
  const byCandidate = new Map<
    string,
    AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
  >();
  for (const assessment of policySet.candidate_assessments) {
    const existing = byCandidate.get(assessment.candidate_key) ?? [];
    existing.push(assessment);
    byCandidate.set(assessment.candidate_key, existing);
  }
  return byCandidate;
}

function resolveExactPolicyAssessment(
  byCandidate: Map<
    string,
    AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
  >,
  candidateKey: string
): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const matches = byCandidate.get(candidateKey);
  if (!matches || matches.length === 0) {
    throw new Error(
      `Permission Source Aggregation Policy target Candidate ${candidateKey} not found in Operational Eligibility Dimension Policy set`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `Ambiguous Permission Source Aggregation Policy target for Candidate ${candidateKey}: multiple Operational Eligibility Dimension Policy assessments`
    );
  }
  return matches[0]!;
}

/**
 * Validates and normalizes specification against exact GROUND-084 contexts.
 *
 * Exact duplicate (same context + same aggregation kind) → one.
 * Same context + different kinds → reject (no merge / latest / ANY-wins / ALL-wins).
 * Unknown / ambiguous / policy-absent / PERMISSION-not-required targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
  specification: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification
): AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification {
  const byCandidate = collectPolicyAssessmentsByCandidateKey(policySet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyInput
  >();

  for (const entry of specification.policies) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const policyAssessment = resolveExactPolicyAssessment(
      byCandidate,
      entry.candidate_key
    );

    if (
      policyAssessment.status ===
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      policyAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    ) {
      throw new Error(
        `Permission Source Aggregation Policy requires an applicable Operational Eligibility Dimension Policy context for candidate ${entry.candidate_key}`
      );
    }

    if (
      policyAssessment.status ===
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
      policyAssessment.operational_eligibility_dimension_policy === null
    ) {
      throw new Error(
        `Permission Source Aggregation Policy requires an explicit Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const policy = policyAssessment.operational_eligibility_dimension_policy;
    if (!policyRequiresPermission(policy)) {
      throw new Error(
        `Permission Source Aggregation Policy requires PERMISSION to be explicitly required by Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const aggregation_kind = canonicalizePermissionSourceAggregationPolicyKind(
      entry.aggregation_kind
    );
    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (existing.aggregation_kind !== aggregation_kind) {
        throw new Error(
          `Conflicting Permission Source Aggregation Policies declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      aggregation_kind,
    });
  }

  const policies = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { policies };
}

function buildAggregationPolicy(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy,
  aggregation_kind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind
): AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy {
  return {
    key: attentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKey(
      {
        candidate_key: policy.candidate_key,
        observation_need_key: policy.observation_need_key,
        capability_requirement_set_key: policy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key: policy.key,
        aggregation_kind,
      }
    ),
    candidate_key: policy.candidate_key,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    dimension: "PERMISSION",
    operational_eligibility_dimension_policy_key: policy.key,
    aggregation_kind,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment
): void {
  const expectedHas = assessment.permission_source_aggregation_policy !== null;
  if (
    assessment.has_explicit_permission_source_aggregation_policy !== expectedHas
  ) {
    throw new Error(
      `Permission Source Aggregation Policy invariant violated: has_explicit mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT" &&
    assessment.permission_source_aggregation_policy === null
  ) {
    throw new Error(
      `Permission Source Aggregation Policy invariant violated: PRESENT requires non-null policy for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT" &&
    assessment.permission_source_aggregation_policy !== null
  ) {
    throw new Error(
      `Permission Source Aggregation Policy invariant violated: non-present status requires null policy for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicy(
  policyAssessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  normalizedSpecification: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification
): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyStatus,
    aggregationPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy | null
  ): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment =
      {
        candidate_key: policyAssessment.candidate_key,
        operational_eligibility_dimension_policy_assessment: policyAssessment,
        status,
        permission_source_aggregation_policy: aggregationPolicy,
        has_explicit_permission_source_aggregation_policy:
          aggregationPolicy !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    policyAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    policyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    policyAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    policyAssessment.operational_eligibility_dimension_policy === null
  ) {
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      null
    );
  }

  const policy = policyAssessment.operational_eligibility_dimension_policy;

  if (!policyRequiresPermission(policy)) {
    return wrap("PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  const declared = normalizedSpecification.policies.find(
    (p) => p.candidate_key === policyAssessment.candidate_key
  );

  if (!declared) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED",
      null
    );
  }

  return wrap(
    "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT",
    buildAggregationPolicy(policy, declared.aggregation_kind)
  );
}

export function buildAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySet(
  input: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyEvalInput
): AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySpecification(
      input.operational_eligibility_dimension_policy_set,
      input.specification
    );

  const candidate_assessments =
    input.operational_eligibility_dimension_policy_set.candidate_assessments.map(
      (policyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicy(
          policyAssessment,
          normalizedSpecification
        )
    );

  return {
    operational_eligibility_dimension_policy_set:
      input.operational_eligibility_dimension_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_permission_source_aggregation_policies:
      candidate_assessments.some(
        (a) => a.has_explicit_permission_source_aggregation_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
