import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Declared Potential Contribution Capacity-Compatibility
 * Source Aggregation Result (GROUND-166).
 *
 * Pure composition of GROUND-165 Current Aggregation Readiness Basis Set.
 * Sole runtime authority: GROUND-165.
 *
 * Executes explicit ANY/ALL evidence-composition only when readiness HOLDS.
 * Materializes all selected operand assessments before Boolean evaluation
 * (no evidence-lineage short-circuit).
 *
 * readiness DNH ≠ Result DNH
 * Result HOLDS ≠ capacity compatibility true ≠ contribution verified
 * Result DOES_NOT_HOLD ≠ physical incompatibility
 * No Result Interpretation. No aggregated State. No Resource Readiness.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasis,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandCondition,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResult,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultStatus,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperator,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultModelLimitation[] =
  [
    "CAPACITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
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

const SUPPORTING =
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SUPPORTING" as const;
const CONTRADICTING =
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_CONTRADICTING" as const;
const OPERAND_HOLDS =
  "SELECTED_CAPACITY_SOURCE_EVIDENCE_CONDITION_HOLDS" as const;
const OPERAND_DNH =
  "SELECTED_CAPACITY_SOURCE_EVIDENCE_CONDITION_DOES_NOT_HOLD" as const;
const RESULT_HOLDS =
  "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const RESULT_DNH =
  "CAPACITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;
const ANY =
  "ANY_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITION_HOLDS" as const;
const ALL =
  "ALL_SELECTED_CAPACITY_SOURCE_CAPACITY_COMPATIBILITY_EVIDENCE_CONDITIONS_HOLD" as const;
const READINESS_HOLDS =
  "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS" as const;
const READINESS_DNH =
  "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Operand assessment identity segment.
 * Same Result value with different operand lineage remains distinct.
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessmentKey(params: {
  capacity_declaration_key: string;
  canonical_source_state_key: string;
  canonical_source_state_value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue;
  operand_condition: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandCondition;
}): string {
  return [
    params.capacity_declaration_key,
    params.canonical_source_state_key,
    params.canonical_source_state_value,
    params.operand_condition,
  ].join("|");
}

export function buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessmentSetKey(
  operandAssessments: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessment[]
): string {
  // Preserve selected-member order — do not reorder by operand condition.
  const keys = operandAssessments.map((assessment) =>
    attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessmentKey(
      {
        capacity_declaration_key: assessment.capacity_declaration_key,
        canonical_source_state_key: assessment.canonical_source_state_key,
        canonical_source_state_value: assessment.canonical_source_state_value,
        operand_condition: assessment.operand_condition,
      }
    )
  );
  return keys.length > 0 ? keys.join(",") : "none";
}

/**
 * Conceptual identity:
 * ...capacity-compatibility-source-aggregation-result|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|evaluationAt|
 * aggregationPolicyKey|readinessPolicyKey|readinessBasisKey|
 * canonicalSelectedMemberSet|canonicalOperandAssessmentSet|operator|resultValue
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  capacity_compatibility_source_aggregation_policy_key: string;
  capacity_compatibility_source_aggregation_readiness_policy_key: string;
  capacity_compatibility_source_aggregation_readiness_basis_key: string;
  selected_capacity_declaration_keys: readonly string[];
  selected_source_operand_assessments: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessment[];
  operator: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperator;
  value: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.capacity_compatibility_source_aggregation_policy_key,
    params.capacity_compatibility_source_aggregation_readiness_policy_key,
    params.capacity_compatibility_source_aggregation_readiness_basis_key,
    params.selected_capacity_declaration_keys.join(","),
    buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessmentSetKey(
      params.selected_source_operand_assessments
    ),
    params.operator,
    params.value,
  ].join("|");
}

function mapCanonicalStateToOperandCondition(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandCondition {
  switch (value) {
    case SUPPORTING:
      return OPERAND_HOLDS;
    case CONTRADICTING:
      return OPERAND_DNH;
    default:
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: unresolved/unknown canonical State ${String(value)} under readiness HOLDS`
      );
  }
}

/**
 * Materialize all operands first, then evaluate ANY/ALL.
 * Boolean short-circuit must not omit operand lineage.
 */
export function deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue(
  operator: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperator,
  operandAssessments: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessment[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue {
  if (operandAssessments.length === 0) {
    throw new Error(
      "Capacity-Compatibility Source Aggregation Result forbids empty operand sets (vacuous ANY/ALL forbidden)"
    );
  }

  switch (operator) {
    case ANY: {
      const anyHolds = operandAssessments.some(
        (assessment) => assessment.operand_condition === OPERAND_HOLDS
      );
      return anyHolds ? RESULT_HOLDS : RESULT_DNH;
    }
    case ALL: {
      const allHold = operandAssessments.every(
        (assessment) => assessment.operand_condition === OPERAND_HOLDS
      );
      return allHold ? RESULT_HOLDS : RESULT_DNH;
    }
    default: {
      const _exhaustive: never = operator;
      void _exhaustive;
      throw new Error(
        `Unknown Capacity-Compatibility Source Aggregation operator: ${String(operator)}`
      );
    }
  }
}

export function assertDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessHoldsBasisConsistency(
  basis: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasis
): void {
  if (basis.readiness_condition !== READINESS_HOLDS) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result invariant violated: Basis ${basis.key} is not readiness HOLDS`
    );
  }

  if (basis.selected_capacity_declaration_keys.length === 0) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result invariant violated: empty selected member set for Basis ${basis.key}`
    );
  }

  if (
    basis.selected_source_readiness_assessments.length !==
    basis.selected_capacity_declaration_keys.length
  ) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result invariant violated: member assessment cardinality mismatch for Basis ${basis.key}`
    );
  }

  const seen = new Set<string>();
  for (let i = 0; i < basis.selected_capacity_declaration_keys.length; i++) {
    const expectedKey = basis.selected_capacity_declaration_keys[i]!;
    const assessment = basis.selected_source_readiness_assessments[i]!;

    if (assessment.capacity_declaration_key !== expectedKey) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: member assessment order/key mismatch for Basis ${basis.key}`
      );
    }

    if (seen.has(expectedKey)) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: duplicate selected member ${expectedKey} for Basis ${basis.key}`
      );
    }
    seen.add(expectedKey);

    if (
      assessment.status !== "SELECTED_CAPACITY_SOURCE_PRESENT_AND_RESOLVED"
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: member ${expectedKey} status is not PRESENT_AND_RESOLVED under readiness HOLDS for Basis ${basis.key}`
      );
    }

    if (!assessment.is_present || !assessment.is_resolved) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: member ${expectedKey} presence/resolved flags contradict readiness HOLDS for Basis ${basis.key}`
      );
    }

    if (
      assessment.canonical_source_state_key === null ||
      assessment.canonical_source_state_value === null
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: member ${expectedKey} missing canonical State lineage under readiness HOLDS for Basis ${basis.key}`
      );
    }

    const value = assessment.canonical_source_state_value;
    if (value !== SUPPORTING && value !== CONTRADICTING) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: member ${expectedKey} has unresolved State ${value} under readiness HOLDS for Basis ${basis.key}`
      );
    }
  }
}

function assertReadinessDnhBasisConsistency(
  basis: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasis
): void {
  if (basis.readiness_condition !== READINESS_DNH) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result invariant violated: expected readiness DNH for Basis ${basis.key}`
    );
  }

  const hasFailureCause = basis.selected_source_readiness_assessments.some(
    (assessment) => !assessment.is_present || !assessment.is_resolved
  );
  if (!hasFailureCause) {
    throw new Error(
      `Capacity-Compatibility Source Aggregation Result invariant violated: readiness DNH but all selected members PRESENT_AND_RESOLVED for Basis ${basis.key}`
    );
  }
}

function assertBindingResultInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_PRESENT"
  ) {
    if (assessment.aggregation_result === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: RESULT_PRESENT requires non-null result for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.result_value === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: RESULT_PRESENT requires non-null result_value for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_aggregation_result) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: RESULT_PRESENT requires has_result true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.result_value !== assessment.aggregation_result.value) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: result_value mismatch for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED" ||
    assessment.status ===
      "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
  ) {
    if (assessment.aggregation_result !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: non-present status requires null result for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.result_value !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: non-present status requires null result_value for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.has_aggregation_result) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Result invariant violated: non-present status requires has_result false for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown Capacity-Compatibility Source Aggregation Result status: ${String(assessment.status)}`
  );
}

function buildAggregationResult(
  basis: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasis
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResult {
  assertDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessHoldsBasisConsistency(
    basis
  );

  // Materialize every selected operand first — no lineage short-circuit.
  const selected_source_operand_assessments =
    basis.selected_source_readiness_assessments.map((member) => {
      const canonical_source_state_key = member.canonical_source_state_key!;
      const canonical_source_state_value = member.canonical_source_state_value!;
      const operand_condition = mapCanonicalStateToOperandCondition(
        canonical_source_state_value
      );
      const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationOperandAssessment =
        {
          capacity_declaration_key: member.capacity_declaration_key,
          canonical_source_state_key,
          canonical_source_state_value,
          operand_condition,
        };
      return assessment;
    });

  const value =
    deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultValue(
      basis.operator,
      selected_source_operand_assessments
    );

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultKey(
      {
        candidate_key: basis.candidate_key,
        observation_need_key: basis.observation_need_key,
        capability_requirement_set_key: basis.capability_requirement_set_key,
        observation_resource_requirement_key:
          basis.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          basis.resource_readiness_observation_context_binding_key,
        resource_declaration_id: basis.resource_declaration_id,
        evaluation_at: basis.evaluation_at,
        capacity_compatibility_source_aggregation_policy_key:
          basis.capacity_compatibility_source_aggregation_policy_key,
        capacity_compatibility_source_aggregation_readiness_policy_key:
          basis.capacity_compatibility_source_aggregation_readiness_policy_key,
        capacity_compatibility_source_aggregation_readiness_basis_key:
          basis.key,
        selected_capacity_declaration_keys:
          basis.selected_capacity_declaration_keys,
        selected_source_operand_assessments,
        operator: basis.operator,
        value,
      }
    ),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      basis.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      basis.resource_readiness_observation_context_binding_key,
    resource_declaration_id: basis.resource_declaration_id,
    evaluation_at: basis.evaluation_at,
    capacity_compatibility_source_aggregation_policy_key:
      basis.capacity_compatibility_source_aggregation_policy_key,
    capacity_compatibility_source_aggregation_readiness_policy_key:
      basis.capacity_compatibility_source_aggregation_readiness_policy_key,
    capacity_compatibility_source_aggregation_readiness_basis_key: basis.key,
    selected_capacity_declaration_keys: [
      ...basis.selected_capacity_declaration_keys,
    ],
    operator: basis.operator,
    selected_source_operand_assessments,
    value,
  };
}

function noResultAssessment(
  basisAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment,
  status: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultStatus
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment {
  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment =
    {
      observation_resource_requirement_key:
        basisAssessment.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        basisAssessment.resource_readiness_observation_context_binding_key,
      resource_declaration_id: basisAssessment.resource_declaration_id,
      aggregation_readiness_basis_assessment: basisAssessment,
      status,
      aggregation_result: null,
      result_value: null,
      has_aggregation_result: false,
    };
  assertBindingResultInvariant(assessment);
  return assessment;
}

function assessBindingAggregationResult(
  basisAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment {
  if (
    basisAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
  ) {
    return noResultAssessment(
      basisAssessment,
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
    );
  }

  if (
    basisAssessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  ) {
    return noResultAssessment(
      basisAssessment,
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
    );
  }

  if (
    basisAssessment.status !==
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" ||
    basisAssessment.readiness_basis === null ||
    basisAssessment.readiness_condition === null
  ) {
    throw new Error(
      `Malformed GROUND-165 Binding assessment for ${basisAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (basisAssessment.readiness_condition === READINESS_DNH) {
    assertReadinessDnhBasisConsistency(basisAssessment.readiness_basis);
    return noResultAssessment(
      basisAssessment,
      "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
  }

  if (basisAssessment.readiness_condition !== READINESS_HOLDS) {
    throw new Error(
      `Unknown GROUND-165 readiness condition ${String(basisAssessment.readiness_condition)} for binding ${basisAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  const aggregation_result = buildAggregationResult(
    basisAssessment.readiness_basis
  );
  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultBindingAssessment =
    {
      observation_resource_requirement_key:
        basisAssessment.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        basisAssessment.resource_readiness_observation_context_binding_key,
      resource_declaration_id: basisAssessment.resource_declaration_id,
      aggregation_readiness_basis_assessment: basisAssessment,
      status:
        "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_PRESENT",
      aggregation_result,
      result_value: aggregation_result.value,
      has_aggregation_result: true,
    };
  assertBindingResultInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Aggregation Result assessment.
 * Does not interpret Result as aggregated evidence polarity.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResult(
  readinessBasisCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultAssessment {
  const binding_aggregation_result_assessments =
    readinessBasisCandidate.binding_readiness_basis_assessments.map(
      (basisAssessment) => assessBindingAggregationResult(basisAssessment)
    );

  binding_aggregation_result_assessments.sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return {
    candidate_key: readinessBasisCandidate.candidate_key,
    capacity_compatibility_source_aggregation_readiness_basis_assessment:
      readinessBasisCandidate,
    binding_aggregation_result_assessments,
    has_aggregation_results: binding_aggregation_result_assessments.some(
      (a) => a.has_aggregation_result
    ),
    has_aggregation_result_condition_holds:
      binding_aggregation_result_assessments.some(
        (a) => a.result_value === RESULT_HOLDS
      ),
    has_aggregation_result_condition_does_not_hold:
      binding_aggregation_result_assessments.some(
        (a) => a.result_value === RESULT_DNH
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capacity-Compatibility Source Aggregation Result.
 * Preserves AttentionCandidate order. No cross-Binding aggregation.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultSetAssessment {
  const readinessBasisSet =
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_basis_set;

  const candidate_assessments =
    readinessBasisSet.candidate_assessments.map((readinessBasisCandidate) =>
      assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResult(
        readinessBasisCandidate
      )
    );

  return {
    resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_basis_set:
      readinessBasisSet,
    candidate_assessments,
    has_aggregation_results: candidate_assessments.some(
      (a) => a.has_aggregation_results
    ),
    has_aggregation_result_condition_holds: candidate_assessments.some(
      (a) => a.has_aggregation_result_condition_holds
    ),
    has_aggregation_result_condition_does_not_hold: candidate_assessments.some(
      (a) => a.has_aggregation_result_condition_does_not_hold
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
    ],
  };
}
