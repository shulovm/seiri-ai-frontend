/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Result Interpretation Policy (GROUND-185).
 *
 * Pure composition of:
 *   GROUND-180 Availability Source Aggregation Policy Set
 *   + explicit Result Interpretation Policy Specification
 *
 * Declaration only. Does NOT consume current GROUND-183 Result values.
 * Does NOT apply mappings. Does NOT create Interpretation Basis.
 *
 * MUST NOT import GROUND-183/182/181/179 builders or project persistence.
 * GROUND-183 ResultValue type may be referenced via types only.
 *
 * INTERPRET_AS_SUPPORTING_... ≠ objectively AVAILABLE
 * Result HOLDS ≠ SUPPORTING unless explicitly mapped
 * unusual mappings legal; partial Policy valid; explicit empty ≠ absence
 * ALL+DNH has no built-in contradiction mapping
 */

import type {
  DeclaredResourceAvailabilitySourceAggregationPolicy,
  DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment,
} from "./declared-resource-availability-source-aggregation-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationResultValue,
} from "./declared-resource-availability-source-aggregation-result-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationResultInterpretation,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingInput,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyEvalInput,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyInput,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyModelLimitation,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySpecification,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyStatus,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationSourceValue,
} from "./declared-resource-availability-source-aggregation-result-interpretation-policy-types.js";

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_PROPOSITION =
  "SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyModelLimitation[] =
  [
    "AVAILABILITY_AGGREGATION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
    "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED",
    "CURRENT_AVAILABILITY_AGGREGATION_RESULT_MAPPING_RESOLUTION_NOT_MODELED",
    "NO_CURRENT_AVAILABILITY_EVIDENCE_CANONICALIZATION_NOT_MODELED",
    "AVAILABILITY_SOURCE_PRIORITY_NOT_MODELED",
    "AVAILABILITY_SOURCE_AUTHORITY_WEIGHTING_NOT_MODELED",
    "AVAILABILITY_DECLARATION_SUPERSESSION_NOT_MODELED",
    "OBJECTIVE_RESOURCE_AVAILABILITY_TRUTH_NOT_MODELED",
    "EFFECTIVE_RESOURCE_AVAILABILITY_NOT_MODELED",
    "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "QUANTITY_AVAILABILITY_HETEROGENEOUS_COMPOSITION_NOT_MODELED",
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

export const EMPTY_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET =
  "EMPTY_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET" as const;

export const CANONICAL_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_ORDER: DeclaredResourceAvailabilitySourceAggregationResultInterpretation[] =
  [
    "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE",
    "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE",
  ];

export const CANONICAL_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_VALUE_ORDER: DeclaredResourceAvailabilitySourceAggregationResultValue[] =
  [
    "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS",
    "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD",
  ];

const INTERPRETATION_ORDER = new Map(
  CANONICAL_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_ORDER.map(
    (value, index) => [value, index]
  )
);

const RESULT_VALUE_ORDER = new Map(
  CANONICAL_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_VALUE_ORDER.map(
    (value, index) => [value, index]
  )
);

const STATUS_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" as const;
const STATUS_NO_POLICY =
  "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY" as const;
const STATUS_PRESENT =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeInterpretation(
  interpretation: DeclaredResourceAvailabilitySourceAggregationResultInterpretation
): DeclaredResourceAvailabilitySourceAggregationResultInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown Declared Resource Availability Source Aggregation Result Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

function normalizeSourceResultValue(
  value: DeclaredResourceAvailabilitySourceAggregationResultInterpretationSourceValue
): DeclaredResourceAvailabilitySourceAggregationResultInterpretationSourceValue {
  if (!RESULT_VALUE_ORDER.has(value)) {
    throw new Error(
      `Unknown Declared Resource Availability Source Aggregation Result value: ${String(value)}`
    );
  }
  return value;
}

/**
 * Mapping identity — value-level source only.
 * declared-resource-availability-source-aggregation-result-interpretation-mapping|
 * ground180AggregationPolicyKey|sourceResultValue|interpretation
 */
export function declaredResourceAvailabilitySourceAggregationResultInterpretationMappingKey(params: {
  availability_source_aggregation_policy_key: string;
  source_result_value: DeclaredResourceAvailabilitySourceAggregationResultInterpretationSourceValue;
  interpretation: DeclaredResourceAvailabilitySourceAggregationResultInterpretation;
}): string {
  return [
    "declared-resource-availability-source-aggregation-result-interpretation-mapping",
    params.availability_source_aggregation_policy_key,
    params.source_result_value,
    params.interpretation,
  ].join("|");
}

export function buildCanonicalDeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingSetKey(
  mappings: readonly DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping[]
): string {
  if (mappings.length === 0) {
    return EMPTY_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET;
  }
  return mappings
    .map((mapping) => mapping.key)
    .sort(compareStrings)
    .join(",");
}

/**
 * Conceptual identity:
 * declared-resource-availability-source-aggregation-result-interpretation-policy|
 * ground180AggregationPolicyKey|
 * SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE|
 * canonicalMappingSetKey
 *
 * Excludes: evaluationAt, readiness keys, current Result key/value, operands.
 */
export function declaredResourceAvailabilitySourceAggregationResultInterpretationPolicyKey(params: {
  availability_source_aggregation_policy_key: string;
  mappings: readonly DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping[];
}): string {
  return [
    "declared-resource-availability-source-aggregation-result-interpretation-policy",
    params.availability_source_aggregation_policy_key,
    DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_PROPOSITION,
    buildCanonicalDeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingSetKey(
      params.mappings
    ),
  ].join("|");
}

/**
 * Canonicalize exact Result-value mappings.
 * Duplicate identical → one. Same source + different interpretation → reject.
 * Mapping order ≠ priority. Unusual mappings legal. Empty set valid.
 */
export function canonicalizeDeclaredResourceAvailabilitySourceAggregationResultInterpretationMappings(
  availability_source_aggregation_policy_key: string,
  mappingInputs: readonly DeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingInput[]
): DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping[] {
  if (!Array.isArray(mappingInputs)) {
    throw new Error("mappings must be an array");
  }

  const byResultValue = new Map<
    DeclaredResourceAvailabilitySourceAggregationResultInterpretationSourceValue,
    DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping
  >();

  for (const entry of mappingInputs) {
    const source_result_value = normalizeSourceResultValue(
      entry.source_result_value
    );
    const interpretation = normalizeInterpretation(entry.interpretation);
    const mapping: DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping =
      {
        key: declaredResourceAvailabilitySourceAggregationResultInterpretationMappingKey(
          {
            availability_source_aggregation_policy_key,
            source_result_value,
            interpretation,
          }
        ),
        source_result_value,
        interpretation,
      };

    const existing = byResultValue.get(source_result_value);
    if (existing) {
      if (existing.interpretation !== interpretation) {
        throw new Error(
          `Conflicting Declared Resource Availability Source Aggregation Result Interpretation mappings for ${source_result_value}`
        );
      }
      continue;
    }
    byResultValue.set(source_result_value, mapping);
  }

  return [...byResultValue.values()].sort((a, b) => {
    const valueCompare =
      (RESULT_VALUE_ORDER.get(a.source_result_value) ?? 0) -
      (RESULT_VALUE_ORDER.get(b.source_result_value) ?? 0);
    if (valueCompare !== 0) return valueCompare;
    return (
      (INTERPRETATION_ORDER.get(a.interpretation) ?? 0) -
      (INTERPRETATION_ORDER.get(b.interpretation) ?? 0)
    );
  });
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

  for (const policy of aggregationPolicySet.aggregation_policies) {
    const indexed = byKey.get(policy.key);
    if (!indexed) {
      throw new Error(
        `Malformed GROUND-180 Set: aggregation_policies entry ${policy.key} missing from resource_assessments`
      );
    }
  }

  return byKey;
}

/**
 * Validates and normalizes Interpretation Policy specification against
 * authoritative GROUND-180 Aggregation Policy Set.
 */
export function normalizeDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySpecification(
  aggregationPolicySet: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment,
  specification: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySpecification
): DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySpecification {
  const policiesByKey = collectAggregationPoliciesByKey(aggregationPolicySet);
  const byAggregationPolicyKey = new Map<
    string,
    DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyInput
  >();

  if (!Array.isArray(specification.policies)) {
    throw new Error("policies must be an array");
  }

  for (const entry of specification.policies) {
    if (
      !entry.availability_source_aggregation_policy_key ||
      entry.availability_source_aggregation_policy_key.trim().length === 0
    ) {
      throw new Error(
        "availability_source_aggregation_policy_key must be non-empty"
      );
    }

    const target = policiesByKey.get(
      entry.availability_source_aggregation_policy_key
    );
    if (!target) {
      throw new Error(
        `Unknown or stale Declared Resource Availability Source Aggregation Policy key ${entry.availability_source_aggregation_policy_key}`
      );
    }

    const mappings =
      canonicalizeDeclaredResourceAvailabilitySourceAggregationResultInterpretationMappings(
        entry.availability_source_aggregation_policy_key,
        entry.mappings
      );

    const existing = byAggregationPolicyKey.get(
      entry.availability_source_aggregation_policy_key
    );
    if (existing) {
      const existingCanonical =
        canonicalizeDeclaredResourceAvailabilitySourceAggregationResultInterpretationMappings(
          entry.availability_source_aggregation_policy_key,
          existing.mappings
        );
      if (
        buildCanonicalDeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingSetKey(
          existingCanonical
        ) !==
        buildCanonicalDeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingSetKey(
          mappings
        )
      ) {
        throw new Error(
          `Conflicting Declared Resource Availability Source Aggregation Result Interpretation Policies declared for Aggregation Policy ${entry.availability_source_aggregation_policy_key}`
        );
      }
      continue;
    }

    byAggregationPolicyKey.set(entry.availability_source_aggregation_policy_key, {
      availability_source_aggregation_policy_key:
        entry.availability_source_aggregation_policy_key,
      mappings,
    });
  }

  const policies = [...byAggregationPolicyKey.values()].sort((a, b) =>
    compareStrings(
      a.availability_source_aggregation_policy_key,
      b.availability_source_aggregation_policy_key
    )
  );

  return { policies };
}

function buildInterpretationPolicy(
  aggregationPolicy: DeclaredResourceAvailabilitySourceAggregationPolicy,
  mappingInputs: readonly DeclaredResourceAvailabilitySourceAggregationResultInterpretationMappingInput[]
): DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy {
  const canonicalMappings =
    canonicalizeDeclaredResourceAvailabilitySourceAggregationResultInterpretationMappings(
      aggregationPolicy.key,
      mappingInputs
    );

  return {
    key: declaredResourceAvailabilitySourceAggregationResultInterpretationPolicyKey(
      {
        availability_source_aggregation_policy_key: aggregationPolicy.key,
        mappings: canonicalMappings,
      }
    ),
    resource_declaration_id: aggregationPolicy.resource_declaration_id,
    availability_source_aggregation_policy_key: aggregationPolicy.key,
    availability_source_aggregation_policy: aggregationPolicy,
    proposition:
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_PROPOSITION,
    mappings: canonicalMappings,
  };
}

function assertResourceAssessmentInvariant(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment
): void {
  if (assessment.status === STATUS_PRESENT) {
    if (assessment.interpretation_policy === null) {
      throw new Error(
        `Availability Source Aggregation Result Interpretation Policy invariant violated: PRESENT requires non-null policy for resource ${assessment.resource_declaration_id}`
      );
    }
    if (!assessment.has_explicit_result_interpretation_policy) {
      throw new Error(
        `Availability Source Aggregation Result Interpretation Policy invariant violated: PRESENT requires boolean true for resource ${assessment.resource_declaration_id}`
      );
    }
    return;
  }

  if (assessment.interpretation_policy !== null) {
    throw new Error(
      `Availability Source Aggregation Result Interpretation Policy invariant violated: non-PRESENT status requires null policy for resource ${assessment.resource_declaration_id}`
    );
  }
  if (assessment.has_explicit_result_interpretation_policy) {
    throw new Error(
      `Availability Source Aggregation Result Interpretation Policy invariant violated: non-PRESENT status requires boolean false for resource ${assessment.resource_declaration_id}`
    );
  }
}

function assessResource(params: {
  aggregationAssessment: DeclaredResourceAvailabilitySourceAggregationPolicyResourceAssessment;
  policiesByAggregationPolicyKey: ReadonlyMap<
    string,
    DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyInput
  >;
}): DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment {
  const aggregationAssessment = params.aggregationAssessment;

  if (
    aggregationAssessment.status ===
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" ||
    aggregationAssessment.aggregation_policy === null
  ) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment =
      {
        resource_declaration_id: aggregationAssessment.resource_declaration_id,
        availability_source_aggregation_policy_assessment:
          aggregationAssessment,
        status: STATUS_NOT_APPLICABLE,
        interpretation_policy: null,
        has_explicit_result_interpretation_policy: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  const declared = params.policiesByAggregationPolicyKey.get(
    aggregationAssessment.aggregation_policy.key
  );
  if (!declared) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment =
      {
        resource_declaration_id: aggregationAssessment.resource_declaration_id,
        availability_source_aggregation_policy_assessment:
          aggregationAssessment,
        status: STATUS_NO_POLICY,
        interpretation_policy: null,
        has_explicit_result_interpretation_policy: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment =
    {
      resource_declaration_id: aggregationAssessment.resource_declaration_id,
      availability_source_aggregation_policy_assessment: aggregationAssessment,
      status: STATUS_PRESENT,
      interpretation_policy: buildInterpretationPolicy(
        aggregationAssessment.aggregation_policy,
        declared.mappings
      ),
      has_explicit_result_interpretation_policy: true,
    };
  assertResourceAssessmentInvariant(assessment);
  return assessment;
}

function classifyMappingCompleteness(
  mappings: readonly DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping[]
): "empty" | "partial" | "complete" {
  if (mappings.length === 0) return "empty";
  if (mappings.length >= 2) return "complete";
  return "partial";
}

/**
 * Build stable Declared Resource Availability Source Aggregation Result
 * Interpretation Policy Set.
 *
 * Cardinality: 0..1 Policy per exact GROUND-180 Aggregation Policy.
 * Empty mappings remain POLICY_PRESENT. No current Result application.
 */
export function buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet(
  input: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyEvalInput
): DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment {
  if (!input.availability_source_aggregation_policy_set) {
    throw new Error("availability_source_aggregation_policy_set is required");
  }
  if (!input.specification || !Array.isArray(input.specification.policies)) {
    throw new Error("specification.policies must be an array");
  }

  const normalizedSpecification =
    normalizeDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySpecification(
      input.availability_source_aggregation_policy_set,
      input.specification
    );

  const policiesByAggregationPolicyKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.availability_source_aggregation_policy_key,
      entry,
    ])
  );

  const resource_assessments: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment[] =
    [...input.availability_source_aggregation_policy_set.resource_assessments]
      .sort((a, b) =>
        compareStrings(a.resource_declaration_id, b.resource_declaration_id)
      )
      .map((aggregationAssessment) =>
        assessResource({
          aggregationAssessment,
          policiesByAggregationPolicyKey,
        })
      );

  const interpretation_policies = resource_assessments
    .map((assessment) => assessment.interpretation_policy)
    .filter(
      (
        policy
      ): policy is DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy =>
        policy !== null
    );

  let has_empty_mapping_policies = false;
  let has_partial_mapping_policies = false;
  let has_complete_mapping_policies = false;
  for (const policy of interpretation_policies) {
    const completeness = classifyMappingCompleteness(policy.mappings);
    if (completeness === "empty") has_empty_mapping_policies = true;
    if (completeness === "partial") has_partial_mapping_policies = true;
    if (completeness === "complete") has_complete_mapping_policies = true;
  }

  return {
    availability_source_aggregation_policy_set:
      input.availability_source_aggregation_policy_set,
    specification: normalizedSpecification,
    resource_assessments,
    interpretation_policies,
    has_explicit_result_interpretation_policies:
      interpretation_policies.length > 0,
    has_empty_mapping_policies,
    has_partial_mapping_policies,
    has_complete_mapping_policies,
    model_limitations:
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  };
}
