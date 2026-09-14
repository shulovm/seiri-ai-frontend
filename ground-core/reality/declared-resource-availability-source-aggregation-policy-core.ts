/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Policy (GROUND-180).
 *
 * Pure composition of:
 *   ResourceDeclaration stable domain
 *   + ResourceAvailabilityDeclaration stable source domain
 *   + explicit Aggregation Policy Specification
 *
 * Declaration only. Current-independent.
 * MUST NOT consume GROUND-179 current evidence States.
 * MUST NOT include evaluation_at.
 * MUST NOT inspect AVAILABLE/UNAVAILABLE for selection decisions.
 * MUST NOT filter by temporal activity.
 * MUST NOT evaluate ANY/ALL. MUST NOT create readiness / Result.
 *
 * SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION
 * ≠ RESOURCE_IS_AVAILABLE / EFFECTIVE_AVAILABILITY / READY
 * empty member set / vacuous ANY/ALL forbidden
 * 0..1 Policy per ResourceDeclaration × proposition
 * unknown selected member / cross-resource member → reject
 * known but currently inactive selected member → still valid Policy
 */

import type {
  ResourceAvailabilityDeclaration,
  ResourceDeclaration,
} from "../types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationOperator,
  DeclaredResourceAvailabilitySourceAggregationPolicy,
  DeclaredResourceAvailabilitySourceAggregationPolicyEvalInput,
  DeclaredResourceAvailabilitySourceAggregationPolicyInput,
  DeclaredResourceAvailabilitySourceAggregationPolicyModelLimitation,
  DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment,
  DeclaredResourceAvailabilitySourceAggregationPolicySpecification,
  DeclaredResourceAvailabilitySourceAggregationPolicyStatus,
} from "./declared-resource-availability-source-aggregation-policy-types.js";

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_PROPOSITION =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION" as const;

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS: DeclaredResourceAvailabilitySourceAggregationPolicyModelLimitation[] =
  [
    "AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
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

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_OPERATOR_ORDER: DeclaredResourceAvailabilitySourceAggregationOperator[] =
  ["ANY", "ALL"];

const OPERATOR_ORDER = new Map(
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_OPERATOR_ORDER.map(
    (value, index) => [value, index]
  )
);

const STATUS_NO_POLICY =
  "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" as const;
const STATUS_PRESENT =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_PRESENT" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeOperator(
  operator: DeclaredResourceAvailabilitySourceAggregationOperator
): DeclaredResourceAvailabilitySourceAggregationOperator {
  if (!OPERATOR_ORDER.has(operator)) {
    throw new Error(
      `Unknown Declared Resource Availability Source Aggregation operator: ${String(operator)}`
    );
  }
  return operator;
}

/**
 * Exact duplicate member IDs → one. Order has no semantic meaning.
 * Empty after normalization is rejected by callers (vacuous ANY/ALL forbidden).
 */
export function canonicalizeDeclaredResourceAvailabilitySourceAggregationMemberIds(
  selectedAvailabilityDeclarationIds: readonly string[]
): string[] {
  if (!Array.isArray(selectedAvailabilityDeclarationIds)) {
    throw new Error("selected_availability_declaration_ids must be an array");
  }
  const unique = new Set<string>();
  for (const raw of selectedAvailabilityDeclarationIds) {
    if (!raw || raw.trim().length === 0) {
      throw new Error(
        "selected_availability_declaration_ids entries must be non-empty"
      );
    }
    unique.add(raw);
  }
  return [...unique].sort(compareStrings);
}

export function buildCanonicalDeclaredResourceAvailabilitySourceAggregationMemberSetKey(
  selectedAvailabilityDeclarationIds: readonly string[]
): string {
  return canonicalizeDeclaredResourceAvailabilitySourceAggregationMemberIds(
    selectedAvailabilityDeclarationIds
  ).join(",");
}

/**
 * Conceptual identity:
 * declared-resource-availability-source-aggregation-policy|
 * resourceDeclarationId|
 * SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION|
 * operator|
 * canonicalSortedSelectedAvailabilityDeclarationIds
 */
export function declaredResourceAvailabilitySourceAggregationPolicyKey(params: {
  resource_declaration_id: string;
  selected_availability_declaration_ids: readonly string[];
  operator: DeclaredResourceAvailabilitySourceAggregationOperator;
}): string {
  return [
    "declared-resource-availability-source-aggregation-policy",
    params.resource_declaration_id,
    DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_PROPOSITION,
    params.operator,
    buildCanonicalDeclaredResourceAvailabilitySourceAggregationMemberSetKey(
      params.selected_availability_declaration_ids
    ),
  ].join("|");
}

function assertNoDuplicateResourceDeclarationIds(
  resources: ResourceDeclaration[]
): void {
  const seen = new Set<string>();
  for (const resource of resources) {
    if (!resource.id || resource.id.trim().length === 0) {
      throw new Error("Malformed ResourceDeclaration: missing id");
    }
    if (seen.has(resource.id)) {
      throw new Error(
        `Malformed ResourceDeclaration domain: duplicate id ${resource.id}`
      );
    }
    seen.add(resource.id);
  }
}

function assertNoDuplicateAvailabilityDeclarationIds(
  declarations: ResourceAvailabilityDeclaration[]
): void {
  const seen = new Set<string>();
  for (const declaration of declarations) {
    if (!declaration.id || declaration.id.trim().length === 0) {
      throw new Error("Malformed ResourceAvailabilityDeclaration: missing id");
    }
    if (seen.has(declaration.id)) {
      throw new Error(
        `Malformed ResourceAvailabilityDeclaration domain: duplicate id ${declaration.id}`
      );
    }
    seen.add(declaration.id);
  }
}

function policySubjectFingerprint(policy: {
  resource_declaration_id: string;
  selected_availability_declaration_ids: readonly string[];
  operator: DeclaredResourceAvailabilitySourceAggregationOperator;
}): string {
  return declaredResourceAvailabilitySourceAggregationPolicyKey(policy);
}

function buildPolicy(
  resource_declaration_id: string,
  selected_availability_declaration_ids: string[],
  operator: DeclaredResourceAvailabilitySourceAggregationOperator
): DeclaredResourceAvailabilitySourceAggregationPolicy {
  return {
    key: declaredResourceAvailabilitySourceAggregationPolicyKey({
      resource_declaration_id,
      selected_availability_declaration_ids,
      operator,
    }),
    resource_declaration_id,
    proposition: DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_PROPOSITION,
    selected_availability_declaration_ids,
    operator,
  };
}

function constructPolicyFromInput(params: {
  input: DeclaredResourceAvailabilitySourceAggregationPolicyInput;
  resourceIds: Set<string>;
  availabilityById: Map<string, ResourceAvailabilityDeclaration>;
}): DeclaredResourceAvailabilitySourceAggregationPolicy {
  const { input, resourceIds, availabilityById } = params;

  if (
    !input.resource_declaration_id ||
    input.resource_declaration_id.trim().length === 0
  ) {
    throw new Error(
      "Declared Resource Availability Source Aggregation Policy requires resource_declaration_id"
    );
  }
  if (!resourceIds.has(input.resource_declaration_id)) {
    throw new Error(
      `Declared Resource Availability Source Aggregation Policy targets unknown ResourceDeclaration ${input.resource_declaration_id}`
    );
  }

  const operator = normalizeOperator(input.operator);
  const selected =
    canonicalizeDeclaredResourceAvailabilitySourceAggregationMemberIds(
      input.selected_availability_declaration_ids
    );

  if (selected.length === 0) {
    throw new Error(
      `Declared Resource Availability Source Aggregation Policy for ${input.resource_declaration_id} forbids empty selected member set`
    );
  }

  for (const memberId of selected) {
    const declaration = availabilityById.get(memberId);
    if (!declaration) {
      throw new Error(
        `Declared Resource Availability Source Aggregation Policy selects unknown availability_declaration.id ${memberId}`
      );
    }
    if (declaration.resource_declaration_id !== input.resource_declaration_id) {
      throw new Error(
        `Declared Resource Availability Source Aggregation Policy cross-resource member ${memberId}: declaration.resource_declaration_id=${declaration.resource_declaration_id} policy.resource_declaration_id=${input.resource_declaration_id}`
      );
    }
  }

  return buildPolicy(input.resource_declaration_id, selected, operator);
}

/**
 * Build stable Declared Resource Availability Source Aggregation Policy Set.
 *
 * Domain decision:
 * ResourceDeclaration[] + ResourceAvailabilityDeclaration[] + specification
 * so a known resource with no Policy yields NO_POLICY even when it has zero
 * availability declarations. PRESENT Policies still require nonempty real members.
 *
 * Cardinality: 0..1 Policy per ResourceDeclaration × proposition.
 * Identical duplicate specifications normalize; conflicting reject.
 */
export function buildDeclaredResourceAvailabilitySourceAggregationPolicySet(
  input: DeclaredResourceAvailabilitySourceAggregationPolicyEvalInput
): DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment {
  if (!Array.isArray(input.resource_declarations)) {
    throw new Error("resource_declarations must be an array");
  }
  if (!Array.isArray(input.resource_availability_declarations)) {
    throw new Error("resource_availability_declarations must be an array");
  }
  if (
    !input.specification ||
    !Array.isArray(input.specification.policies)
  ) {
    throw new Error("specification.policies must be an array");
  }

  assertNoDuplicateResourceDeclarationIds(input.resource_declarations);
  assertNoDuplicateAvailabilityDeclarationIds(
    input.resource_availability_declarations
  );

  const resourceIds = new Set(
    input.resource_declarations.map((resource) => resource.id)
  );
  const availabilityById = new Map(
    input.resource_availability_declarations.map((declaration) => [
      declaration.id,
      declaration,
    ])
  );

  for (const declaration of input.resource_availability_declarations) {
    if (!resourceIds.has(declaration.resource_declaration_id)) {
      throw new Error(
        `ResourceAvailabilityDeclaration ${declaration.id} references unknown ResourceDeclaration ${declaration.resource_declaration_id}`
      );
    }
  }

  const policiesByResource = new Map<
    string,
    DeclaredResourceAvailabilitySourceAggregationPolicy
  >();

  for (const policyInput of input.specification.policies) {
    const policy = constructPolicyFromInput({
      input: policyInput,
      resourceIds,
      availabilityById,
    });

    const existing = policiesByResource.get(policy.resource_declaration_id);
    if (!existing) {
      policiesByResource.set(policy.resource_declaration_id, policy);
      continue;
    }

    if (
      policySubjectFingerprint(existing) === policySubjectFingerprint(policy)
    ) {
      // identical duplicate specification → normalize to one
      continue;
    }

    throw new Error(
      `Conflicting Declared Resource Availability Source Aggregation Policies for ResourceDeclaration ${policy.resource_declaration_id}`
    );
  }

  const sortedResourceIds = [...resourceIds].sort(compareStrings);
  const resource_assessments: DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment[] =
    sortedResourceIds.map((resource_declaration_id) => {
      const aggregation_policy =
        policiesByResource.get(resource_declaration_id) ?? null;
      const status: DeclaredResourceAvailabilitySourceAggregationPolicyStatus =
        aggregation_policy === null ? STATUS_NO_POLICY : STATUS_PRESENT;
      return {
        resource_declaration_id,
        status,
        aggregation_policy,
        has_explicit_declared_resource_availability_source_aggregation_policy:
          aggregation_policy !== null,
      };
    });

  const aggregation_policies = resource_assessments
    .map((assessment) => assessment.aggregation_policy)
    .filter(
      (policy): policy is DeclaredResourceAvailabilitySourceAggregationPolicy =>
        policy !== null
    );

  return {
    resource_assessments,
    aggregation_policies,
    has_explicit_aggregation_policies: aggregation_policies.length > 0,
    has_any_operator_policies: aggregation_policies.some(
      (policy) => policy.operator === "ANY"
    ),
    has_all_operator_policies: aggregation_policies.some(
      (policy) => policy.operator === "ALL"
    ),
    model_limitations:
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
  };
}
