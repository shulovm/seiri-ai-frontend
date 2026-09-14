/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Aggregation Readiness Policy core (GROUND-123).
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit AUTHORITY Aggregation Readiness Policy Specification
 * → Explicit AUTHORITY Source Aggregation Readiness Policy only.
 *
 * Declarative. Does not inspect current 117–122 state. Does not evaluate
 * match-count / readiness HOLDS / DOES_NOT_HOLD / ANY / ALL / vacuous truth.
 *
 * Must not import GROUND-117–122 / 116-core / 108–115 / ProjectState.
 *
 * readiness policy ≠ current readiness condition
 * policy PRESENT ≠ readiness HOLDS
 * policy absence ≠ readiness DOES_NOT_HOLD
 * non-empty match-set rule ≠ current match inspection
 * LISTED / NOT_LISTED ≠ readiness / unreadiness
 * UNRESOLVED ≠ unreadiness
 * readiness policy ≠ aggregation policy ≠ aggregation result
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicy,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyEvalInput,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyInput,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyModelLimitation,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyStatus,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export const CANONICAL_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_KIND_ORDER: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind[] =
  [
    "REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION",
  ];

const READINESS_KIND_ORDER = new Map(
  CANONICAL_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_KIND_ORDER.map(
    (k, i) => [k, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function canonicalizeAuthoritySourceAggregationReadinessPolicyKind(
  kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind {
  if (!READINESS_KIND_ORDER.has(kind)) {
    throw new Error(
      `Unknown AUTHORITY Source Aggregation Readiness Policy kind: ${String(kind)}`
    );
  }
  return kind;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|AUTHORITY|readinessKind
 */
export function attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  readiness_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    "AUTHORITY",
    params.readiness_kind,
  ].join("|");
}

function policyRequiresAuthority(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy
): boolean {
  return policy.required_dimensions.includes("AUTHORITY");
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
  const assessments = byCandidate.get(candidateKey);
  if (!assessments || assessments.length === 0) {
    throw new Error(
      `AUTHORITY Source Aggregation Readiness Policy target Candidate ${candidateKey} not found in Operational Eligibility Dimension Policy set`
    );
  }
  if (assessments.length > 1) {
    throw new Error(
      `Ambiguous AUTHORITY Source Aggregation Readiness Policy target for Candidate ${candidateKey}: multiple Operational Eligibility Dimension Policy assessments`
    );
  }
  return assessments[0]!;
}

/**
 * Validates and normalizes specification against exact GROUND-084 contexts.
 *
 * Exact duplicate (same context + same readiness kind) → one.
 * Same context + different readiness kinds → reject (no implicit AND/OR).
 * Unknown / ambiguous / policy-absent / AUTHORITY-not-required targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
  specification: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification {
  const byCandidate = collectPolicyAssessmentsByCandidateKey(policySet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyInput
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
        `AUTHORITY Source Aggregation Readiness Policy requires an applicable Operational Eligibility Dimension Policy context for candidate ${entry.candidate_key}`
      );
    }

    if (
      policyAssessment.status ===
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
      policyAssessment.operational_eligibility_dimension_policy === null
    ) {
      throw new Error(
        `AUTHORITY Source Aggregation Readiness Policy requires an explicit Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const policy = policyAssessment.operational_eligibility_dimension_policy;
    if (!policyRequiresAuthority(policy)) {
      throw new Error(
        `AUTHORITY Source Aggregation Readiness Policy requires AUTHORITY to be explicitly required by Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const readiness_kind = canonicalizeAuthoritySourceAggregationReadinessPolicyKind(
      entry.readiness_kind
    );
    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (existing.readiness_kind !== readiness_kind) {
        throw new Error(
          `Conflicting AUTHORITY Source Aggregation Readiness Policies declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      readiness_kind,
    });
  }

  const policies = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { policies };
}

function buildReadinessPolicy(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy,
  readiness_kind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKind
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy {
  return {
    key: attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyKey(
      {
        candidate_key: policy.candidate_key,
        observation_need_key: policy.observation_need_key,
        capability_requirement_set_key: policy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key: policy.key,
        readiness_kind,
      }
    ),
    candidate_key: policy.candidate_key,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    dimension: "AUTHORITY",
    operational_eligibility_dimension_policy_key: policy.key,
    readiness_kind,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment
): void {
  const expectedHas =
    assessment.authority_source_aggregation_readiness_policy !== null;
  if (
    assessment.has_explicit_authority_source_aggregation_readiness_policy !==
    expectedHas
  ) {
    throw new Error(
      `AUTHORITY Source Aggregation Readiness Policy invariant violated: has_explicit mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT" &&
    assessment.authority_source_aggregation_readiness_policy === null
  ) {
    throw new Error(
      `AUTHORITY Source Aggregation Readiness Policy invariant violated: PRESENT requires non-null policy for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT" &&
    assessment.authority_source_aggregation_readiness_policy !== null
  ) {
    throw new Error(
      `AUTHORITY Source Aggregation Readiness Policy invariant violated: non-present status requires null policy for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy(
  policyAssessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  normalizedSpecification: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification
): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyStatus,
    readinessPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy | null
  ): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment =
      {
        candidate_key: policyAssessment.candidate_key,
        operational_eligibility_dimension_policy_assessment: policyAssessment,
        status,
        authority_source_aggregation_readiness_policy: readinessPolicy,
        has_explicit_authority_source_aggregation_readiness_policy:
          readinessPolicy !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
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

  if (!policyRequiresAuthority(policy)) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  const declared = normalizedSpecification.policies.find(
    (p) => p.candidate_key === policyAssessment.candidate_key
  );

  if (!declared) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
      null
    );
  }

  return wrap(
    "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT",
    buildReadinessPolicy(policy, declared.readiness_kind)
  );
}

export function buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySet(
  input: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyEvalInput
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySpecification(
      input.operational_eligibility_dimension_policy_set,
      input.specification
    );

  const candidate_assessments =
    input.operational_eligibility_dimension_policy_set.candidate_assessments.map(
      (policyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy(
          policyAssessment,
          normalizedSpecification
        )
    );

  return {
    operational_eligibility_dimension_policy_set:
      input.operational_eligibility_dimension_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_authority_source_aggregation_readiness_policies:
      candidate_assessments.some(
        (a) => a.has_explicit_authority_source_aggregation_readiness_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
