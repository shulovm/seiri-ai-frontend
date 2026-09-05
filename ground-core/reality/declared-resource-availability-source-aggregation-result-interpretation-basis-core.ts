import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Result Interpretation Basis (GROUND-186).
 *
 * Pure composition of:
 *   current GROUND-183 Aggregation Result Set
 *   + GROUND-185 stable Result Interpretation Policy Set
 *
 * Exact current Result + exact explicit mapping lookup only.
 *
 * MUST NOT import GROUND-182/181/180/179 builders or project persistence.
 * GROUND-183/185 types and nested lineage only.
 *
 * NO_CURRENT_RESULT ≠ NO_MAPPING
 * NO_POLICY ≠ NO_MAPPING
 * NO_MAPPING ≠ CONTRADICTING
 * unusual explicit mappings are authoritative
 * BASIS_PRESENT ≠ canonical aggregated evidence State
 * full GROUND-183 operand lineage preserved via nested Result
 */

import type {
  DeclaredResourceAvailabilitySourceAggregationResult,
  DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultSetAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultValue,
} from "./declared-resource-availability-source-aggregation-result-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationResultInterpretation,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment,
} from "./declared-resource-availability-source-aggregation-result-interpretation-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasis,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisEvalInput,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisModelLimitation,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisStatus,
} from "./declared-resource-availability-source-aggregation-result-interpretation-basis-types.js";

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisModelLimitation[] =
  [
    "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED",
    "PARTIAL_VS_TOTAL_CURRENT_AVAILABILITY_EVIDENCE_MISSING_CANONICAL_DISTINCTION_NOT_MODELED",
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

const CONTEXT_MISMATCH_PREFIX =
  "Declared Resource Availability Source Aggregation Result set and Result Interpretation Policy set do not share compatible stable aggregation context";

const INTERP_SUPPORTING =
  "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;
const INTERP_CONTRADICTING =
  "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;

const RESULT_HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const RESULT_DNH =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;

const STATUS_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" as const;
const STATUS_NO_READINESS_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const STATUS_NO_CURRENT_RESULT =
  "UNRESOLVED_NO_CURRENT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD" as const;
const STATUS_NO_INTERPRETATION_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY" as const;
const STATUS_NO_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT" as const;
const STATUS_BASIS_PRESENT =
  "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function assertKnownResultValue(
  value: DeclaredResourceAvailabilitySourceAggregationResultValue
): DeclaredResourceAvailabilitySourceAggregationResultValue {
  switch (value) {
    case RESULT_HOLDS:
    case RESULT_DNH:
      return value;
    default: {
      const _exhaustive: never = value;
      void _exhaustive;
      throw new Error(
        `Unknown Declared Resource Availability Source Aggregation Result value: ${String(value)}`
      );
    }
  }
}

function assertKnownInterpretation(
  interpretation: DeclaredResourceAvailabilitySourceAggregationResultInterpretation
): DeclaredResourceAvailabilitySourceAggregationResultInterpretation {
  switch (interpretation) {
    case INTERP_SUPPORTING:
    case INTERP_CONTRADICTING:
      return interpretation;
    default: {
      const _exhaustive: never = interpretation;
      void _exhaustive;
      throw new Error(
        `Unknown Declared Resource Availability Source Aggregation Result Interpretation: ${String(interpretation)}`
      );
    }
  }
}

/**
 * Conceptual identity:
 * declared-resource-availability-source-aggregation-result-interpretation-basis|
 * resourceDeclarationId|evaluationAt|
 * ground180AggregationPolicyKey|ground183ResultKey|
 * currentResultValue|ground185InterpretationPolicyKey|
 * matchedMappingKey|interpretation
 */
export function declaredResourceAvailabilitySourceAggregationResultInterpretationBasisKey(params: {
  resource_declaration_id: string;
  evaluation_at: string;
  availability_source_aggregation_policy_key: string;
  availability_source_aggregation_result_key: string;
  current_result_value: DeclaredResourceAvailabilitySourceAggregationResultValue;
  availability_source_aggregation_result_interpretation_policy_key: string;
  matched_mapping_key: string;
  interpretation: DeclaredResourceAvailabilitySourceAggregationResultInterpretation;
}): string {
  return [
    "declared-resource-availability-source-aggregation-result-interpretation-basis",
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.availability_source_aggregation_policy_key,
    params.availability_source_aggregation_result_key,
    params.current_result_value,
    params.availability_source_aggregation_result_interpretation_policy_key,
    params.matched_mapping_key,
    params.interpretation,
  ].join("|");
}

/**
 * Exact source_result_value mapping lookup.
 * 0 → null; 1 → mapping; >1 conflicting → reject.
 */
export function findExactDeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping(
  mappings: readonly DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping[],
  currentResultValue: DeclaredResourceAvailabilitySourceAggregationResultValue
): DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping | null {
  let found: DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    if (mapping.source_result_value !== currentResultValue) {
      continue;
    }
    if (found !== null && found.interpretation !== mapping.interpretation) {
      throw new Error(
        `Declared Resource Availability Source Aggregation Result Interpretation mapping multiplicity invariant violated for ${currentResultValue}`
      );
    }
    if (found === null) {
      found = mapping;
    }
  }

  return found;
}

function extractAggregationPolicyKeyFromResultAssessment(
  resultAssessment: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment
): string | null {
  if (resultAssessment.aggregation_result !== null) {
    return resultAssessment.aggregation_result
      .availability_source_aggregation_policy_key;
  }

  const readinessBasis =
    resultAssessment.availability_source_aggregation_readiness_basis_assessment
      .readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.availability_source_aggregation_policy_key;
  }

  return (
    resultAssessment.availability_source_aggregation_readiness_basis_assessment
      .availability_source_aggregation_readiness_policy_assessment
      .availability_source_aggregation_policy_assessment.aggregation_policy
      ?.key ?? null
  );
}

function extractAggregationPolicyKeyFromInterpretationPolicyAssessment(
  policyAssessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment
): string | null {
  if (policyAssessment.interpretation_policy !== null) {
    return policyAssessment.interpretation_policy
      .availability_source_aggregation_policy_key;
  }

  return (
    policyAssessment.availability_source_aggregation_policy_assessment
      .aggregation_policy?.key ?? null
  );
}

function assertCompatibleResultAndPolicySets(
  resultSet: DeclaredResourceAvailabilitySourceAggregationResultSetAssessment,
  policySet: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment
): void {
  const resultByResource = new Map(
    resultSet.resource_assessments.map((a) => [a.resource_declaration_id, a])
  );
  const policyByResource = new Map(
    policySet.resource_assessments.map((a) => [a.resource_declaration_id, a])
  );

  if (resultByResource.size !== resultSet.resource_assessments.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate resource keys in GROUND-183 set`
    );
  }
  if (policyByResource.size !== policySet.resource_assessments.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate resource keys in GROUND-185 set`
    );
  }

  if (resultByResource.size !== policyByResource.size) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: resource count mismatch`);
  }

  for (const [resourceId, resultAssessment] of resultByResource) {
    const policyAssessment = policyByResource.get(resourceId);
    if (!policyAssessment) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-185 assessment for resource ${resourceId}`
      );
    }

    const resultAggKey =
      extractAggregationPolicyKeyFromResultAssessment(resultAssessment);
    const policyAggKey =
      extractAggregationPolicyKeyFromInterpretationPolicyAssessment(
        policyAssessment
      );

    if (resultAggKey !== null && policyAggKey !== null) {
      if (resultAggKey !== policyAggKey) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: GROUND-180 Aggregation Policy key mismatch for resource ${resourceId} (${resultAggKey} vs ${policyAggKey})`
        );
      }
    }

    if (
      resultAssessment.resource_declaration_id !==
      policyAssessment.resource_declaration_id
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: ResourceDeclaration mismatch for ${resourceId}`
      );
    }
  }

  for (const resourceId of policyByResource.keys()) {
    if (!resultByResource.has(resourceId)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: detached GROUND-185 assessment for resource ${resourceId}`
      );
    }
  }
}

function assertResourceAssessmentInvariant(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment
): void {
  if (assessment.status === STATUS_BASIS_PRESENT) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Availability Aggregation Result Interpretation Basis invariant violated: PRESENT requires non-null basis for resource ${assessment.resource_declaration_id}`
      );
    }
    if (!assessment.has_interpretation_basis) {
      throw new Error(
        `Availability Aggregation Result Interpretation Basis invariant violated: PRESENT requires has_basis true for resource ${assessment.resource_declaration_id}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `Availability Aggregation Result Interpretation Basis invariant violated: PRESENT requires non-null interpretation for resource ${assessment.resource_declaration_id}`
      );
    }
    if (
      assessment.interpretation !==
      assessment.interpretation_basis.interpretation
    ) {
      throw new Error(
        `Availability Aggregation Result Interpretation Basis invariant violated: interpretation mismatch for resource ${assessment.resource_declaration_id}`
      );
    }
    return;
  }

  if (assessment.interpretation_basis !== null) {
    throw new Error(
      `Availability Aggregation Result Interpretation Basis invariant violated: non-PRESENT status requires null basis for resource ${assessment.resource_declaration_id}`
    );
  }
  if (assessment.has_interpretation_basis) {
    throw new Error(
      `Availability Aggregation Result Interpretation Basis invariant violated: non-PRESENT status requires has_basis false for resource ${assessment.resource_declaration_id}`
    );
  }
  if (assessment.interpretation !== null) {
    throw new Error(
      `Availability Aggregation Result Interpretation Basis invariant violated: non-PRESENT status requires null interpretation for resource ${assessment.resource_declaration_id}`
    );
  }
}

function buildInterpretationBasis(params: {
  aggregationResult: DeclaredResourceAvailabilitySourceAggregationResult;
  interpretationPolicy: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy;
  matchedMapping: DeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping;
}): DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasis {
  const { aggregationResult, interpretationPolicy, matchedMapping } = params;

  if (
    matchedMapping.source_result_value !== aggregationResult.value
  ) {
    throw new Error(
      `Availability Aggregation Result Interpretation Basis invariant violated: matched mapping source ${matchedMapping.source_result_value} != current Result ${aggregationResult.value}`
    );
  }

  if (
    !interpretationPolicy.mappings.some(
      (mapping) => mapping.key === matchedMapping.key
    )
  ) {
    throw new Error(
      `Availability Aggregation Result Interpretation Basis invariant violated: matched mapping ${matchedMapping.key} not owned by Policy ${interpretationPolicy.key}`
    );
  }

  if (
    aggregationResult.availability_source_aggregation_policy_key !==
    interpretationPolicy.availability_source_aggregation_policy_key
  ) {
    throw new Error(
      `Availability Aggregation Result Interpretation Basis invariant violated: GROUND-180 subject mismatch (${aggregationResult.availability_source_aggregation_policy_key} vs ${interpretationPolicy.availability_source_aggregation_policy_key})`
    );
  }

  if (
    aggregationResult.resource_declaration_id !==
    interpretationPolicy.resource_declaration_id
  ) {
    throw new Error(
      `Availability Aggregation Result Interpretation Basis invariant violated: ResourceDeclaration mismatch`
    );
  }

  const interpretation = assertKnownInterpretation(
    matchedMapping.interpretation
  );
  const current_result_value = assertKnownResultValue(aggregationResult.value);

  return {
    key: declaredResourceAvailabilitySourceAggregationResultInterpretationBasisKey(
      {
        resource_declaration_id: aggregationResult.resource_declaration_id,
        evaluation_at: aggregationResult.evaluation_at,
        availability_source_aggregation_policy_key:
          aggregationResult.availability_source_aggregation_policy_key,
        availability_source_aggregation_result_key: aggregationResult.key,
        current_result_value,
        availability_source_aggregation_result_interpretation_policy_key:
          interpretationPolicy.key,
        matched_mapping_key: matchedMapping.key,
        interpretation,
      }
    ),
    resource_declaration_id: aggregationResult.resource_declaration_id,
    evaluation_at: aggregationResult.evaluation_at,
    availability_source_aggregation_policy_key:
      aggregationResult.availability_source_aggregation_policy_key,
    availability_source_aggregation_result_key: aggregationResult.key,
    availability_source_aggregation_result_interpretation_policy_key:
      interpretationPolicy.key,
    matched_mapping_key: matchedMapping.key,
    current_result_value,
    interpretation,
    current_aggregation_result: aggregationResult,
  };
}

function assessResource(params: {
  resultAssessment: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment;
  policyAssessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicyResourceAssessment;
}): DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment {
  const { resultAssessment, policyAssessment } = params;

  if (
    resultAssessment.resource_declaration_id !==
    policyAssessment.resource_declaration_id
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: ResourceDeclaration mismatch (${resultAssessment.resource_declaration_id} vs ${policyAssessment.resource_declaration_id})`
    );
  }

  // Case 1 — structural NOT_APPLICABLE (no mapping inspection).
  if (
    resultAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  ) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment =
      {
        resource_declaration_id: resultAssessment.resource_declaration_id,
        availability_source_aggregation_result_assessment: resultAssessment,
        availability_source_aggregation_result_interpretation_policy_assessment:
          policyAssessment,
        status: STATUS_NOT_APPLICABLE,
        interpretation_basis: null,
        interpretation: null,
        has_interpretation_basis: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  // Case 2 — no readiness Policy (no mapping inspection).
  if (
    resultAssessment.status ===
    "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
  ) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment =
      {
        resource_declaration_id: resultAssessment.resource_declaration_id,
        availability_source_aggregation_result_assessment: resultAssessment,
        availability_source_aggregation_result_interpretation_policy_assessment:
          policyAssessment,
        status: STATUS_NO_READINESS_POLICY,
        interpretation_basis: null,
        interpretation: null,
        has_interpretation_basis: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  // Case 3 — readiness DNH / no current Result (no mapping inspection).
  if (
    resultAssessment.status ===
    "NO_CURRENT_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
  ) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment =
      {
        resource_declaration_id: resultAssessment.resource_declaration_id,
        availability_source_aggregation_result_assessment: resultAssessment,
        availability_source_aggregation_result_interpretation_policy_assessment:
          policyAssessment,
        status: STATUS_NO_CURRENT_RESULT,
        interpretation_basis: null,
        interpretation: null,
        has_interpretation_basis: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  if (
    resultAssessment.status !==
      "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_PRESENT" ||
    resultAssessment.aggregation_result === null
  ) {
    throw new Error(
      `Malformed GROUND-183 Resource assessment for ${resultAssessment.resource_declaration_id}: expected Result PRESENT`
    );
  }

  const aggregationResult = resultAssessment.aggregation_result;

  // Case 4 — Result present, no Interpretation Policy.
  if (
    policyAssessment.status ===
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY" ||
    policyAssessment.interpretation_policy === null
  ) {
    if (
      policyAssessment.status ===
      "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT"
    ) {
      throw new Error(
        `Malformed GROUND-185 assessment: POLICY_PRESENT with null policy for resource ${policyAssessment.resource_declaration_id}`
      );
    }
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment =
      {
        resource_declaration_id: resultAssessment.resource_declaration_id,
        availability_source_aggregation_result_assessment: resultAssessment,
        availability_source_aggregation_result_interpretation_policy_assessment:
          policyAssessment,
        status: STATUS_NO_INTERPRETATION_POLICY,
        interpretation_basis: null,
        interpretation: null,
        has_interpretation_basis: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  if (
    policyAssessment.status !==
    "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT"
  ) {
    throw new Error(
      `Malformed GROUND-185 assessment status ${policyAssessment.status} for resource ${policyAssessment.resource_declaration_id} under current Result`
    );
  }

  const interpretationPolicy = policyAssessment.interpretation_policy;

  if (
    interpretationPolicy.availability_source_aggregation_policy_key !==
    aggregationResult.availability_source_aggregation_policy_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: GROUND-180 subject mismatch for resource ${resultAssessment.resource_declaration_id}`
    );
  }

  if (
    interpretationPolicy.resource_declaration_id !==
    aggregationResult.resource_declaration_id
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: ResourceDeclaration mismatch under Result PRESENT for ${resultAssessment.resource_declaration_id}`
    );
  }

  const currentResultValue = assertKnownResultValue(aggregationResult.value);
  const matchedMapping =
    findExactDeclaredResourceAvailabilitySourceAggregationResultInterpretationMapping(
      interpretationPolicy.mappings,
      currentResultValue
    );

  // Case 5 — Policy PRESENT (including empty) but no mapping for current Result.
  if (matchedMapping === null) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment =
      {
        resource_declaration_id: resultAssessment.resource_declaration_id,
        availability_source_aggregation_result_assessment: resultAssessment,
        availability_source_aggregation_result_interpretation_policy_assessment:
          policyAssessment,
        status: STATUS_NO_MAPPING,
        interpretation_basis: null,
        interpretation: null,
        has_interpretation_basis: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  // Case 6 — exact mapping → Basis PRESENT.
  const interpretation_basis = buildInterpretationBasis({
    aggregationResult,
    interpretationPolicy,
    matchedMapping,
  });

  const assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment =
    {
      resource_declaration_id: resultAssessment.resource_declaration_id,
      availability_source_aggregation_result_assessment: resultAssessment,
      availability_source_aggregation_result_interpretation_policy_assessment:
        policyAssessment,
      status: STATUS_BASIS_PRESENT,
      interpretation_basis,
      interpretation: interpretation_basis.interpretation,
      has_interpretation_basis: true,
    };
  assertResourceAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Build current Declared Resource Availability Source Aggregation Result
 * Interpretation Basis Set.
 *
 * Sole authorities: GROUND-183 + GROUND-185.
 * No default mappings. Unusual mappings authoritative.
 */
export function buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSet(
  input: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisEvalInput
): DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment {
  if (!input.availability_source_aggregation_result_set) {
    throw new Error("availability_source_aggregation_result_set is required");
  }
  if (
    !input.availability_source_aggregation_result_interpretation_policy_set
  ) {
    throw new Error(
      "availability_source_aggregation_result_interpretation_policy_set is required"
    );
  }

  const resultSet = input.availability_source_aggregation_result_set;
  const policySet =
    input.availability_source_aggregation_result_interpretation_policy_set;

  if (!Array.isArray(resultSet.resource_assessments)) {
    throw new Error(
      "GROUND-183 Result Set requires resource_assessments array"
    );
  }
  if (!Array.isArray(policySet.resource_assessments)) {
    throw new Error(
      "GROUND-185 Interpretation Policy Set requires resource_assessments array"
    );
  }

  assertCompatibleResultAndPolicySets(resultSet, policySet);

  const policyByResource = new Map(
    policySet.resource_assessments.map((assessment) => [
      assessment.resource_declaration_id,
      assessment,
    ])
  );

  const resource_assessments: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment[] =
    [...resultSet.resource_assessments]
      .sort((a, b) =>
        compareStrings(a.resource_declaration_id, b.resource_declaration_id)
      )
      .map((resultAssessment) => {
        const policyAssessment = policyByResource.get(
          resultAssessment.resource_declaration_id
        );
        if (!policyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-185 assessment for resource ${resultAssessment.resource_declaration_id}`
          );
        }
        return assessResource({ resultAssessment, policyAssessment });
      });

  const interpretation_bases = resource_assessments
    .map((assessment) => assessment.interpretation_basis)
    .filter(
      (
        basis
      ): basis is DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasis =>
        basis !== null
    );

  let has_supporting_interpretation_bases = false;
  let has_contradicting_interpretation_bases = false;
  for (const basis of interpretation_bases) {
    if (basis.interpretation === INTERP_SUPPORTING) {
      has_supporting_interpretation_bases = true;
    } else if (basis.interpretation === INTERP_CONTRADICTING) {
      has_contradicting_interpretation_bases = true;
    }
  }

  const has_unresolved_assessments = resource_assessments.some(
    (assessment) =>
      assessment.status === STATUS_NO_READINESS_POLICY ||
      assessment.status === STATUS_NO_CURRENT_RESULT ||
      assessment.status === STATUS_NO_INTERPRETATION_POLICY ||
      assessment.status === STATUS_NO_MAPPING
  );

  return {
    availability_source_aggregation_result_set: resultSet,
    availability_source_aggregation_result_interpretation_policy_set:
      policySet,
    resource_assessments,
    interpretation_bases,
    has_interpretation_bases: interpretation_bases.length > 0,
    has_supporting_interpretation_bases,
    has_contradicting_interpretation_bases,
    has_unresolved_assessments,
    model_limitations:
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
  };
}
