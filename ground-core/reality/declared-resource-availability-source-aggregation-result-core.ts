import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Result (GROUND-183).
 *
 * Pure composition of GROUND-182 Current Aggregation Readiness Basis Set.
 * Sole runtime authority: GROUND-182.
 *
 * Executes explicit ANY/ALL evidence-composition only when readiness HOLDS.
 * Materializes all selected operands before Boolean evaluation
 * (no evidence-lineage short-circuit).
 *
 * readiness DNH ≠ Result DNH
 * Result HOLDS ≠ resource AVAILABLE ≠ effective availability
 * Result DOES_NOT_HOLD ≠ resource UNAVAILABLE
 * No Result Interpretation. No aggregated State. No Resource Readiness.
 *
 * MUST NOT reopen GROUND-179 / raw declarations / active-at helpers /
 * availability Assessment aggregates / ProjectState / 177 / OE / execution.
 */

import type {
  DeclaredResourceAvailabilityPerSourceEvidenceStateValue,
} from "./declared-resource-availability-per-source-evidence-state-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationOperator,
} from "./declared-resource-availability-source-aggregation-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationReadinessBasis,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment,
} from "./declared-resource-availability-source-aggregation-readiness-basis-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationOperand,
  DeclaredResourceAvailabilitySourceAggregationOperandCondition,
  DeclaredResourceAvailabilitySourceAggregationResult,
  DeclaredResourceAvailabilitySourceAggregationResultEvalInput,
  DeclaredResourceAvailabilitySourceAggregationResultModelLimitation,
  DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultSetAssessment,
  DeclaredResourceAvailabilitySourceAggregationResultStatus,
  DeclaredResourceAvailabilitySourceAggregationResultValue,
} from "./declared-resource-availability-source-aggregation-result-types.js";

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS: DeclaredResourceAvailabilitySourceAggregationResultModelLimitation[] =
  [
    "AVAILABILITY_AGGREGATION_RESULT_INTERPRETATION_NOT_MODELED",
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

const SUPPORTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING" as const;
const CONTRADICTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING" as const;

const OPERAND_HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_OPERAND_HOLDS" as const;
const OPERAND_DNH =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_OPERAND_DOES_NOT_HOLD" as const;

const RESULT_HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const RESULT_DNH =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;

const READINESS_HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION_HOLDS" as const;
const READINESS_DNH =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD" as const;

const STATUS_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" as const;
const STATUS_NO_READINESS_POLICY =
  "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const STATUS_NO_RESULT_READINESS_DNH =
  "NO_CURRENT_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD" as const;
const STATUS_RESULT_PRESENT =
  "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_PRESENT" as const;

const MEMBER_PRESENT_AND_RESOLVED =
  "CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE_PRESENT_AND_RESOLVED" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Operand identity segment.
 * Same Result value with different operand lineage remains distinct.
 */
export function declaredResourceAvailabilitySourceAggregationOperandKey(params: {
  availability_declaration_id: string;
  current_source_evidence_state_key: string;
  current_source_evidence_state_value: DeclaredResourceAvailabilityPerSourceEvidenceStateValue;
  operand_condition: DeclaredResourceAvailabilitySourceAggregationOperandCondition;
}): string {
  return [
    params.availability_declaration_id,
    params.current_source_evidence_state_key,
    params.current_source_evidence_state_value,
    params.operand_condition,
  ].join("|");
}

export function buildCanonicalDeclaredResourceAvailabilitySourceAggregationOperandSetKey(
  operands: readonly DeclaredResourceAvailabilitySourceAggregationOperand[]
): string {
  // Preserve GROUND-180 selected member order — do not reorder by condition.
  const keys = operands.map((operand) =>
    declaredResourceAvailabilitySourceAggregationOperandKey({
      availability_declaration_id: operand.availability_declaration_id,
      current_source_evidence_state_key:
        operand.current_source_evidence_state_key,
      current_source_evidence_state_value:
        operand.current_source_evidence_state_value,
      operand_condition: operand.operand_condition,
    })
  );
  return keys.length > 0 ? keys.join(",") : "none";
}

/**
 * Conceptual identity:
 * declared-resource-availability-source-aggregation-result|
 * resourceDeclarationId|evaluationAt|
 * ground180AggregationPolicyKey|ground181ReadinessPolicyKey|
 * ground182ReadinessBasisKey|operator|
 * canonicalSelectedMemberIds|canonicalOperandLineage|resultValue
 */
export function declaredResourceAvailabilitySourceAggregationResultKey(params: {
  resource_declaration_id: string;
  evaluation_at: string;
  availability_source_aggregation_policy_key: string;
  availability_source_aggregation_readiness_policy_key: string;
  availability_source_aggregation_readiness_basis_key: string;
  operator: DeclaredResourceAvailabilitySourceAggregationOperator;
  selected_availability_declaration_ids: readonly string[];
  operands: readonly DeclaredResourceAvailabilitySourceAggregationOperand[];
  value: DeclaredResourceAvailabilitySourceAggregationResultValue;
}): string {
  return [
    "declared-resource-availability-source-aggregation-result",
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.availability_source_aggregation_policy_key,
    params.availability_source_aggregation_readiness_policy_key,
    params.availability_source_aggregation_readiness_basis_key,
    params.operator,
    params.selected_availability_declaration_ids.join(","),
    buildCanonicalDeclaredResourceAvailabilitySourceAggregationOperandSetKey(
      params.operands
    ),
    params.value,
  ].join("|");
}

function mapCanonicalStateToOperandCondition(
  value: DeclaredResourceAvailabilityPerSourceEvidenceStateValue
): DeclaredResourceAvailabilitySourceAggregationOperandCondition {
  switch (value) {
    case SUPPORTING:
      return OPERAND_HOLDS;
    case CONTRADICTING:
      return OPERAND_DNH;
    default: {
      const _exhaustive: never = value;
      void _exhaustive;
      throw new Error(
        `Availability Source Aggregation Result invariant violated: unknown/unresolved canonical State ${String(value)} under readiness HOLDS`
      );
    }
  }
}

/**
 * Materialize all operands first, then evaluate ANY/ALL.
 * Boolean short-circuit must not omit operand lineage.
 */
export function deriveDeclaredResourceAvailabilitySourceAggregationResultValue(
  operator: DeclaredResourceAvailabilitySourceAggregationOperator,
  operands: readonly DeclaredResourceAvailabilitySourceAggregationOperand[]
): DeclaredResourceAvailabilitySourceAggregationResultValue {
  if (operands.length === 0) {
    throw new Error(
      "Availability Source Aggregation Result forbids empty operand sets (vacuous ANY/ALL forbidden)"
    );
  }

  switch (operator) {
    case "ANY": {
      const anyHolds = operands.some(
        (operand) => operand.operand_condition === OPERAND_HOLDS
      );
      return anyHolds ? RESULT_HOLDS : RESULT_DNH;
    }
    case "ALL": {
      const allHold = operands.every(
        (operand) => operand.operand_condition === OPERAND_HOLDS
      );
      return allHold ? RESULT_HOLDS : RESULT_DNH;
    }
    default: {
      const _exhaustive: never = operator;
      void _exhaustive;
      throw new Error(
        `Unknown Declared Resource Availability Source Aggregation operator: ${String(operator)}`
      );
    }
  }
}

export function assertDeclaredResourceAvailabilitySourceAggregationReadinessHoldsBasisConsistency(
  basis: DeclaredResourceAvailabilitySourceAggregationReadinessBasis
): void {
  if (basis.condition !== READINESS_HOLDS) {
    throw new Error(
      `Availability Source Aggregation Result invariant violated: Basis ${basis.key} is not readiness HOLDS`
    );
  }

  if (basis.selected_availability_declaration_ids.length === 0) {
    throw new Error(
      `Availability Source Aggregation Result invariant violated: empty selected member set for Basis ${basis.key}`
    );
  }

  if (
    basis.member_assessments.length !==
    basis.selected_availability_declaration_ids.length
  ) {
    throw new Error(
      `Availability Source Aggregation Result invariant violated: member assessment cardinality mismatch for Basis ${basis.key}`
    );
  }

  const seen = new Set<string>();
  for (let i = 0; i < basis.selected_availability_declaration_ids.length; i++) {
    const expectedId = basis.selected_availability_declaration_ids[i]!;
    const assessment = basis.member_assessments[i]!;

    if (assessment.availability_declaration_id !== expectedId) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: member assessment order/id mismatch for Basis ${basis.key}`
      );
    }

    if (seen.has(expectedId)) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: duplicate selected member ${expectedId} for Basis ${basis.key}`
      );
    }
    seen.add(expectedId);

    if (assessment.status !== MEMBER_PRESENT_AND_RESOLVED) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: member ${expectedId} status is not PRESENT_AND_RESOLVED under readiness HOLDS for Basis ${basis.key}`
      );
    }
    if (!assessment.is_present || !assessment.is_resolved) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: member ${expectedId} flags inconsistent under readiness HOLDS for Basis ${basis.key}`
      );
    }
    if (
      assessment.current_source_evidence_state_key === null ||
      assessment.current_source_evidence_state_value === null
    ) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: member ${expectedId} missing current State key/value under readiness HOLDS for Basis ${basis.key}`
      );
    }
  }
}

function materializeOperands(
  basis: DeclaredResourceAvailabilitySourceAggregationReadinessBasis
): DeclaredResourceAvailabilitySourceAggregationOperand[] {
  assertDeclaredResourceAvailabilitySourceAggregationReadinessHoldsBasisConsistency(
    basis
  );

  return basis.member_assessments.map((assessment) => {
    const stateKey = assessment.current_source_evidence_state_key;
    const stateValue = assessment.current_source_evidence_state_value;
    if (stateKey === null || stateValue === null) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: null current State under readiness HOLDS for member ${assessment.availability_declaration_id}`
      );
    }

    return {
      availability_declaration_id: assessment.availability_declaration_id,
      current_source_evidence_state_key: stateKey,
      current_source_evidence_state_value: stateValue,
      operand_condition: mapCanonicalStateToOperandCondition(stateValue),
    };
  });
}

function buildAggregationResult(
  basis: DeclaredResourceAvailabilitySourceAggregationReadinessBasis
): DeclaredResourceAvailabilitySourceAggregationResult {
  const operands = materializeOperands(basis);
  const value = deriveDeclaredResourceAvailabilitySourceAggregationResultValue(
    basis.operator,
    operands
  );

  return {
    key: declaredResourceAvailabilitySourceAggregationResultKey({
      resource_declaration_id: basis.resource_declaration_id,
      evaluation_at: basis.evaluation_at,
      availability_source_aggregation_policy_key:
        basis.availability_source_aggregation_policy_key,
      availability_source_aggregation_readiness_policy_key:
        basis.availability_source_aggregation_readiness_policy_key,
      availability_source_aggregation_readiness_basis_key: basis.key,
      operator: basis.operator,
      selected_availability_declaration_ids:
        basis.selected_availability_declaration_ids,
      operands,
      value,
    }),
    resource_declaration_id: basis.resource_declaration_id,
    evaluation_at: basis.evaluation_at,
    availability_source_aggregation_policy_key:
      basis.availability_source_aggregation_policy_key,
    availability_source_aggregation_readiness_policy_key:
      basis.availability_source_aggregation_readiness_policy_key,
    availability_source_aggregation_readiness_basis_key: basis.key,
    operator: basis.operator,
    selected_availability_declaration_ids: [
      ...basis.selected_availability_declaration_ids,
    ],
    operands,
    value,
  };
}

function assertResourceAssessmentInvariant(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment
): void {
  if (assessment.status === STATUS_RESULT_PRESENT) {
    if (assessment.aggregation_result === null) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: PRESENT requires non-null result for resource ${assessment.resource_declaration_id}`
      );
    }
    if (!assessment.has_aggregation_result) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: PRESENT requires has_aggregation_result true for resource ${assessment.resource_declaration_id}`
      );
    }
    if (assessment.result_value === null) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: PRESENT requires non-null result_value for resource ${assessment.resource_declaration_id}`
      );
    }
    if (assessment.result_value !== assessment.aggregation_result.value) {
      throw new Error(
        `Availability Source Aggregation Result invariant violated: result_value mismatch for resource ${assessment.resource_declaration_id}`
      );
    }
    return;
  }

  if (assessment.aggregation_result !== null) {
    throw new Error(
      `Availability Source Aggregation Result invariant violated: non-PRESENT status requires null result for resource ${assessment.resource_declaration_id}`
    );
  }
  if (assessment.has_aggregation_result) {
    throw new Error(
      `Availability Source Aggregation Result invariant violated: non-PRESENT status requires has_aggregation_result false for resource ${assessment.resource_declaration_id}`
    );
  }
  if (assessment.result_value !== null) {
    throw new Error(
      `Availability Source Aggregation Result invariant violated: non-PRESENT status requires null result_value for resource ${assessment.resource_declaration_id}`
    );
  }
}

function assessResource(
  basisAssessment: DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment
): DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment {
  if (
    basisAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
  ) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment =
      {
        resource_declaration_id: basisAssessment.resource_declaration_id,
        availability_source_aggregation_readiness_basis_assessment:
          basisAssessment,
        status: STATUS_NOT_APPLICABLE,
        aggregation_result: null,
        result_value: null,
        has_aggregation_result: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  if (
    basisAssessment.status ===
    "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
  ) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment =
      {
        resource_declaration_id: basisAssessment.resource_declaration_id,
        availability_source_aggregation_readiness_basis_assessment:
          basisAssessment,
        status: STATUS_NO_READINESS_POLICY,
        aggregation_result: null,
        result_value: null,
        has_aggregation_result: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  if (
    basisAssessment.status !==
      "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" ||
    basisAssessment.readiness_basis === null
  ) {
    throw new Error(
      `Malformed GROUND-182 Resource assessment for ${basisAssessment.resource_declaration_id}: expected readiness Basis PRESENT`
    );
  }

  const basis = basisAssessment.readiness_basis;

  if (
    basisAssessment.readiness_condition !== basis.condition ||
    (basis.condition !== READINESS_HOLDS &&
      basis.condition !== READINESS_DNH)
  ) {
    throw new Error(
      `Malformed GROUND-182 readiness condition coherence for resource ${basisAssessment.resource_declaration_id}`
    );
  }

  if (basis.condition === READINESS_DNH) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment =
      {
        resource_declaration_id: basisAssessment.resource_declaration_id,
        availability_source_aggregation_readiness_basis_assessment:
          basisAssessment,
        status: STATUS_NO_RESULT_READINESS_DNH,
        aggregation_result: null,
        result_value: null,
        has_aggregation_result: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  const aggregation_result = buildAggregationResult(basis);
  const assessment: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment =
    {
      resource_declaration_id: basisAssessment.resource_declaration_id,
      availability_source_aggregation_readiness_basis_assessment:
        basisAssessment,
      status: STATUS_RESULT_PRESENT,
      aggregation_result,
      result_value: aggregation_result.value,
      has_aggregation_result: true,
    };
  assertResourceAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Build Declared Resource Availability Source Aggregation Result Set.
 *
 * Sole authority: GROUND-182 readiness Basis Set.
 * ANY/ALL only when readiness HOLDS. All operands preserved.
 */
export function buildDeclaredResourceAvailabilitySourceAggregationResultSet(
  input: DeclaredResourceAvailabilitySourceAggregationResultEvalInput
): DeclaredResourceAvailabilitySourceAggregationResultSetAssessment {
  if (!input.availability_source_aggregation_readiness_basis_set) {
    throw new Error(
      "availability_source_aggregation_readiness_basis_set is required"
    );
  }

  const readinessBasisSet =
    input.availability_source_aggregation_readiness_basis_set;

  if (!Array.isArray(readinessBasisSet.resource_assessments)) {
    throw new Error(
      "GROUND-182 Aggregation Readiness Basis Set requires resource_assessments array"
    );
  }

  const resource_assessments: DeclaredResourceAvailabilitySourceAggregationResultResourceAssessment[] =
    [...readinessBasisSet.resource_assessments]
      .sort((a, b) =>
        compareStrings(a.resource_declaration_id, b.resource_declaration_id)
      )
      .map((basisAssessment) => assessResource(basisAssessment));

  const aggregation_results = resource_assessments
    .map((assessment) => assessment.aggregation_result)
    .filter(
      (
        result
      ): result is DeclaredResourceAvailabilitySourceAggregationResult =>
        result !== null
    );

  let has_composition_condition_holds_results = false;
  let has_composition_condition_does_not_hold_results = false;
  for (const result of aggregation_results) {
    if (result.value === RESULT_HOLDS) {
      has_composition_condition_holds_results = true;
    } else if (result.value === RESULT_DNH) {
      has_composition_condition_does_not_hold_results = true;
    }
  }

  return {
    availability_source_aggregation_readiness_basis_set: readinessBasisSet,
    resource_assessments,
    aggregation_results,
    has_aggregation_results: aggregation_results.length > 0,
    has_composition_condition_holds_results,
    has_composition_condition_does_not_hold_results,
    model_limitations:
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
  };
}
