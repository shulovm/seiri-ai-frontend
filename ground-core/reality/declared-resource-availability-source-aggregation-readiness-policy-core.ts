/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Readiness Policy (GROUND-181).
 *
 * Pure composition of:
 *   GROUND-180 Availability Source Aggregation Policy Set
 *   + explicit Aggregation Readiness Policy Specification
 *
 * Declaration only. Current-independent.
 * MUST NOT import GROUND-179 builders / current States / evaluation_at /
 * availability active-at helpers / ProjectState / readiness Basis / Result /
 * ANY/ALL evaluation / Resource Readiness / OE / execution.
 *
 * readiness policy ≠ readiness currently HOLDS
 * NO_READINESS_POLICY ≠ readiness DOES_NOT_HOLD
 * NOT_APPLICABLE ≠ readiness failure
 * SUPPORTING and CONTRADICTING are both resolved
 * missing current selected source ≠ CONTRADICTING
 * ANY/ALL short-circuit readiness not modeled
 * same readiness rule for ANY and ALL aggregation operators
 */

import type {
  DeclaredResourceAvailabilitySourceAggregationPolicy,
  DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment,
} from "./declared-resource-availability-source-aggregation-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicy,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicyEvalInput,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicyInput,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicyModelLimitation,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicySpecification,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicyStatus,
  DeclaredResourceAvailabilitySourceAggregationReadinessRule,
} from "./declared-resource-availability-source-aggregation-readiness-policy-types.js";

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_PROPOSITION =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION" as const;

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyModelLimitation[] =
  [
    "AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
    "AVAILABILITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED",
    "NO_CURRENT_AVAILABILITY_EVIDENCE_CANONICALIZATION_NOT_MODELED",
    "AVAILABILITY_SOURCE_PRIORITY_NOT_MODELED",
    "AVAILABILITY_SOURCE_AUTHORITY_WEIGHTING_NOT_MODELED",
    "AVAILABILITY_DECLARATION_SUPERSESSION_NOT_MODELED",
    "OBJECTIVE_RESOURCE_AVAILABILITY_TRUTH_NOT_MODELED",
    "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_RESOURCE_AVAILABILITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "PHYSICAL_EVIDENCE_REQUIRED_DIMENSION_POLICY_NOT_MODELED",
    "PHYSICAL_EVIDENCE_DIMENSION_READINESS_NOT_MODELED",
    "QUANTITY_AVAILABILITY_HETEROGENEOUS_COMPOSITION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_DELIVERABILITY_NOT_MODELED",
    "REQUIREMENT_SATISFACTION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_RULE_ORDER: DeclaredResourceAvailabilitySourceAggregationReadinessRule[] =
  [
    "REQUIRE_ALL_SELECTED_AVAILABILITY_SOURCE_EVIDENCE_STATES_PRESENT_AND_RESOLVED_BEFORE_AGGREGATION",
  ];

/**
 * Future GROUND-182 resolved GROUND-179 State vocabulary (documentation only).
 * GROUND-181 does not classify current states.
 * resolved = SUPPORTING or CONTRADICTING (not SUPPORTING-only).
 */
export const FUTURE_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESOLVED_STATES =
  [
    "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING",
    "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING",
  ] as const;

const READINESS_RULE_ORDER = new Map(
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_RULE_ORDER.map(
    (value, index) => [value, index]
  )
);

const STATUS_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" as const;
const STATUS_NO_READINESS_POLICY =
  "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const STATUS_PRESENT =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeReadinessRule(
  rule: DeclaredResourceAvailabilitySourceAggregationReadinessRule
): DeclaredResourceAvailabilitySourceAggregationReadinessRule {
  if (!READINESS_RULE_ORDER.has(rule)) {
    throw new Error(
      `Unknown Declared Resource Availability Source Aggregation Readiness rule: ${String(rule)}`
    );
  }
  return rule;
}

/**
 * Conceptual identity:
 * declared-resource-availability-source-aggregation-readiness-policy|
 * ground180AggregationPolicyKey|
 * SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION|
 * REQUIRE_ALL_SELECTED_AVAILABILITY_SOURCE_EVIDENCE_STATES_PRESENT_AND_RESOLVED_BEFORE_AGGREGATION
 */
export function declaredResourceAvailabilitySourceAggregationReadinessPolicyKey(params: {
  availability_source_aggregation_policy_key: string;
  rule: DeclaredResourceAvailabilitySourceAggregationReadinessRule;
}): string {
  return [
    "declared-resource-availability-source-aggregation-readiness-policy",
    params.availability_source_aggregation_policy_key,
    DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_PROPOSITION,
    params.rule,
  ].join("|");
}

function collectAggregationPoliciesByKey(
  aggregationPolicySet: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment
): Map<
  string,
  {
    resourceAssessment: DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment;
    policy: DeclaredResourceAvailabilitySourceAggregationPolicy;
  }
> {
  const byKey = new Map<
    string,
    {
      resourceAssessment: DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment;
      policy: DeclaredResourceAvailabilitySourceAggregationPolicy;
    }
  >();

  for (const resourceAssessment of aggregationPolicySet.resource_assessments) {
    if (
      resourceAssessment.status !==
        "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_PRESENT" ||
      resourceAssessment.aggregation_policy === null
    ) {
      continue;
    }

    const policy = resourceAssessment.aggregation_policy;
    if (byKey.has(policy.key)) {
      throw new Error(
        `Ambiguous Declared Resource Availability Source Aggregation Policy key ${policy.key}`
      );
    }
    byKey.set(policy.key, { resourceAssessment, policy });
  }

  // Also ensure aggregation_policies list is consistent.
  for (const policy of aggregationPolicySet.aggregation_policies) {
    const indexed = byKey.get(policy.key);
    if (!indexed) {
      throw new Error(
        `Malformed GROUND-180 Set: aggregation_policies entry ${policy.key} missing from resource_assessments`
      );
    }
    if (indexed.policy.key !== policy.key) {
      throw new Error(
        `Malformed GROUND-180 Set: aggregation_policies mismatch for ${policy.key}`
      );
    }
  }

  return byKey;
}

function readinessSubjectFingerprint(params: {
  availability_source_aggregation_policy_key: string;
  rule: DeclaredResourceAvailabilitySourceAggregationReadinessRule;
}): string {
  return declaredResourceAvailabilitySourceAggregationReadinessPolicyKey(params);
}

function buildReadinessPolicy(
  aggregationPolicy: DeclaredResourceAvailabilitySourceAggregationPolicy,
  rule: DeclaredResourceAvailabilitySourceAggregationReadinessRule
): DeclaredResourceAvailabilitySourceAggregationReadinessPolicy {
  return {
    key: declaredResourceAvailabilitySourceAggregationReadinessPolicyKey({
      availability_source_aggregation_policy_key: aggregationPolicy.key,
      rule,
    }),
    resource_declaration_id: aggregationPolicy.resource_declaration_id,
    availability_source_aggregation_policy_key: aggregationPolicy.key,
    availability_source_aggregation_policy: aggregationPolicy,
    proposition:
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_PROPOSITION,
    rule,
  };
}

/**
 * Build stable Declared Resource Availability Source Aggregation Readiness Policy Set.
 *
 * Cardinality: 0..1 readiness Policy per exact GROUND-180 Aggregation Policy.
 * Identical duplicate specifications normalize; unknown/detached/conflicting reject.
 */
export function buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet(
  input: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyEvalInput
): DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment {
  if (!input.availability_source_aggregation_policy_set) {
    throw new Error(
      "availability_source_aggregation_policy_set is required"
    );
  }
  if (
    !input.specification ||
    !Array.isArray(input.specification.policies)
  ) {
    throw new Error("specification.policies must be an array");
  }

  const aggregationPolicySet =
    input.availability_source_aggregation_policy_set;
  const policiesByKey = collectAggregationPoliciesByKey(aggregationPolicySet);

  const readinessByAggregationKey = new Map<
    string,
    DeclaredResourceAvailabilitySourceAggregationReadinessPolicy
  >();

  for (const readinessInput of input.specification.policies) {
    if (
      !readinessInput.availability_source_aggregation_policy_key ||
      readinessInput.availability_source_aggregation_policy_key.trim()
        .length === 0
    ) {
      throw new Error(
        "Declared Resource Availability Source Aggregation Readiness Policy requires availability_source_aggregation_policy_key"
      );
    }

    const target = policiesByKey.get(
      readinessInput.availability_source_aggregation_policy_key
    );
    if (!target) {
      throw new Error(
        `Declared Resource Availability Source Aggregation Readiness Policy targets unknown GROUND-180 Aggregation Policy key ${readinessInput.availability_source_aggregation_policy_key}`
      );
    }

    const rule = normalizeReadinessRule(readinessInput.rule);
    const readinessPolicy = buildReadinessPolicy(target.policy, rule);

    const existing = readinessByAggregationKey.get(
      readinessInput.availability_source_aggregation_policy_key
    );
    if (!existing) {
      readinessByAggregationKey.set(
        readinessInput.availability_source_aggregation_policy_key,
        readinessPolicy
      );
      continue;
    }

    if (
      readinessSubjectFingerprint({
        availability_source_aggregation_policy_key:
          existing.availability_source_aggregation_policy_key,
        rule: existing.rule,
      }) ===
      readinessSubjectFingerprint({
        availability_source_aggregation_policy_key:
          readinessPolicy.availability_source_aggregation_policy_key,
        rule: readinessPolicy.rule,
      })
    ) {
      continue;
    }

    throw new Error(
      `Conflicting Declared Resource Availability Source Aggregation Readiness Policies for GROUND-180 Aggregation Policy ${readinessInput.availability_source_aggregation_policy_key}`
    );
  }

  const resource_assessments: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyResourceAssessment[] =
    [...aggregationPolicySet.resource_assessments]
      .sort((a, b) =>
        compareStrings(a.resource_declaration_id, b.resource_declaration_id)
      )
      .map((aggregationAssessment) => {
        if (
          aggregationAssessment.status ===
            "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" ||
          aggregationAssessment.aggregation_policy === null
        ) {
          return {
            resource_declaration_id:
              aggregationAssessment.resource_declaration_id,
            availability_source_aggregation_policy_assessment:
              aggregationAssessment,
            status: STATUS_NOT_APPLICABLE,
            readiness_policy: null,
            has_explicit_declared_resource_availability_source_aggregation_readiness_policy:
              false,
          };
        }

        const aggregationPolicy = aggregationAssessment.aggregation_policy;
        const readiness_policy =
          readinessByAggregationKey.get(aggregationPolicy.key) ?? null;

        const status: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyStatus =
          readiness_policy === null
            ? STATUS_NO_READINESS_POLICY
            : STATUS_PRESENT;

        return {
          resource_declaration_id:
            aggregationAssessment.resource_declaration_id,
          availability_source_aggregation_policy_assessment:
            aggregationAssessment,
          status,
          readiness_policy,
          has_explicit_declared_resource_availability_source_aggregation_readiness_policy:
            readiness_policy !== null,
        };
      });

  const readiness_policies = resource_assessments
    .map((assessment) => assessment.readiness_policy)
    .filter(
      (
        policy
      ): policy is DeclaredResourceAvailabilitySourceAggregationReadinessPolicy =>
        policy !== null
    );

  return {
    availability_source_aggregation_policy_set: aggregationPolicySet,
    specification: input.specification,
    resource_assessments,
    readiness_policies,
    has_explicit_readiness_policies: readiness_policies.length > 0,
    model_limitations:
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
  };
}
