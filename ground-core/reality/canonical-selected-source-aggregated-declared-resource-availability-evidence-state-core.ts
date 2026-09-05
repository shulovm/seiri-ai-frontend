/**
 * Reality Core v0.7 — Canonical Selected-source Aggregated
 * Declared Resource Availability Evidence State (GROUND-187).
 *
 * Pure normalization of GROUND-186 Aggregation Result Interpretation Basis Set.
 * Sole runtime semantic authority: GROUND-186.
 *
 * Must not import GROUND-185/183/182/181/180/179 builders or project persistence.
 * Nested lineage on GROUND-186 assessments may be read for structural context only.
 *
 * NOT_APPLICABLE ≠ UNRESOLVED
 * NO_POLICY ≠ NO_MAPPING
 * SUPPORTING ≠ objectively AVAILABLE
 * CONTRADICTING ≠ objectively UNAVAILABLE
 * NO_CURRENT_RESULT ≠ CONTRADICTING
 * unusual GROUND-186 interpretations preserved exactly
 * canonical State ≠ effective availability / deliverability / Resource Ready
 */

import type {
  DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment,
} from "./declared-resource-availability-source-aggregation-result-interpretation-basis-types.js";
import type {
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState,
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateEvalInput,
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateModelLimitation,
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResourceAssessment,
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSetAssessment,
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue,
} from "./canonical-selected-source-aggregated-declared-resource-availability-evidence-state-types.js";

export const CANONICAL_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_PROPOSITION =
  "SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;

export const CANONICAL_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_STATE_MODEL_LIMITATIONS: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateModelLimitation[] =
  [
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

const NONE_TOKEN = "NONE" as const;

const INTERP_SUPPORTING =
  "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;
const INTERP_CONTRADICTING =
  "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;

const CANONICAL_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_READINESS =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_CURRENT_RESULT =
  "UNRESOLVED_NO_CURRENT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD" as const;
const CANONICAL_UNRESOLVED_NO_INTERPRETATION_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT" as const;
const CANONICAL_SUPPORTING =
  "EXPLICITLY_INTERPRETED_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING" as const;
const CANONICAL_CONTRADICTING =
  "EXPLICITLY_INTERPRETED_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING" as const;

/**
 * Domain applicability — NOT_APPLICABLE is not unresolved.
 */
export function isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateApplicable(
  value: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue
): boolean {
  return value !== CANONICAL_NOT_APPLICABLE;
}

/**
 * Resolved evidence — SUPPORTING and CONTRADICTING only.
 * isResolved=false does not itself imply UNRESOLVED (NOT_APPLICABLE is separate).
 */
export function isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResolved(
  value: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue
): boolean {
  return value === CANONICAL_SUPPORTING || value === CANONICAL_CONTRADICTING;
}

/**
 * Explicit unresolved causes only — excludes NOT_APPLICABLE.
 */
export function isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateUnresolved(
  value: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue
): boolean {
  return (
    value === CANONICAL_UNRESOLVED_NO_READINESS ||
    value === CANONICAL_UNRESOLVED_NO_CURRENT_RESULT ||
    value === CANONICAL_UNRESOLVED_NO_INTERPRETATION_POLICY ||
    value === CANONICAL_UNRESOLVED_NO_MAPPING
  );
}

export function isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSupporting(
  value: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue
): boolean {
  return value === CANONICAL_SUPPORTING;
}

export function isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateContradicting(
  value: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue
): boolean {
  return value === CANONICAL_CONTRADICTING;
}

/**
 * Conceptual identity (stronger than value alone — preserves nested lineage):
 * canonical-selected-source-aggregated-declared-resource-availability-evidence-state|
 * resourceDeclarationId|evaluationAt-or-NONE|aggregationPolicyKey-or-NONE|
 * currentLineageAnchorKey-or-NONE|interpretationBasisKey-or-NONE|
 * ground186Status|canonicalStateValue
 */
export function canonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateKey(params: {
  resource_declaration_id: string;
  evaluation_at: string | null;
  availability_source_aggregation_policy_key: string | null;
  current_lineage_anchor_key: string | null;
  interpretation_basis_key: string | null;
  ground186_status: string;
  value: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue;
}): string {
  return [
    "canonical-selected-source-aggregated-declared-resource-availability-evidence-state",
    params.resource_declaration_id,
    params.evaluation_at ?? NONE_TOKEN,
    params.availability_source_aggregation_policy_key ?? NONE_TOKEN,
    params.current_lineage_anchor_key ?? NONE_TOKEN,
    params.interpretation_basis_key ?? NONE_TOKEN,
    params.ground186_status,
    params.value,
  ].join("|");
}

function assertBasisPresentInvariant(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment
): void {
  if (
    assessment.status ===
    "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Canonical Selected-source Aggregated Declared Resource Availability Evidence State invariant violated: BASIS_PRESENT requires non-null Basis for resource ${assessment.resource_declaration_id}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `Canonical Selected-source Aggregated Declared Resource Availability Evidence State invariant violated: BASIS_PRESENT requires non-null interpretation for resource ${assessment.resource_declaration_id}`
      );
    }
    if (
      assessment.interpretation !==
      assessment.interpretation_basis.interpretation
    ) {
      throw new Error(
        `Canonical Selected-source Aggregated Declared Resource Availability Evidence State invariant violated: interpretation mismatch for resource ${assessment.resource_declaration_id}`
      );
    }
    return;
  }

  if (assessment.interpretation_basis !== null) {
    throw new Error(
      `Canonical Selected-source Aggregated Declared Resource Availability Evidence State invariant violated: non-present status requires null Basis for resource ${assessment.resource_declaration_id}`
    );
  }
  if (assessment.interpretation !== null) {
    throw new Error(
      `Canonical Selected-source Aggregated Declared Resource Availability Evidence State invariant violated: non-present status requires null interpretation for resource ${assessment.resource_declaration_id}`
    );
  }
}

/**
 * Exhaustive GROUND-186 → canonical State mapping.
 * No Result/Policy reopening. No intuitive polarity.
 */
export function deriveCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment
): CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue {
  assertBasisPresentInvariant(assessment);

  switch (assessment.status) {
    case "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY":
      return CANONICAL_NOT_APPLICABLE;

    case "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY":
      return CANONICAL_UNRESOLVED_NO_READINESS;

    case "UNRESOLVED_NO_CURRENT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD":
      return CANONICAL_UNRESOLVED_NO_CURRENT_RESULT;

    case "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY":
      return CANONICAL_UNRESOLVED_NO_INTERPRETATION_POLICY;

    case "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT":
      return CANONICAL_UNRESOLVED_NO_MAPPING;

    case "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT": {
      const interpretation = assessment.interpretation_basis!.interpretation;
      switch (interpretation) {
        case INTERP_SUPPORTING:
          return CANONICAL_SUPPORTING;
        case INTERP_CONTRADICTING:
          return CANONICAL_CONTRADICTING;
        default: {
          const _exhaustive: never = interpretation;
          void _exhaustive;
          throw new Error(
            `Unknown Declared Resource Availability Source Aggregation Result Interpretation: ${String(interpretation)}`
          );
        }
      }
    }

    default: {
      const _exhaustive: never = assessment.status;
      void _exhaustive;
      throw new Error(
        `Unknown GROUND-186 Aggregation Result Interpretation Basis status: ${String(assessment.status)}`
      );
    }
  }
}

function extractAggregationPolicyKey(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment
): string | null {
  if (assessment.interpretation_basis !== null) {
    return assessment.interpretation_basis
      .availability_source_aggregation_policy_key;
  }

  const interpretationPolicy =
    assessment
      .availability_source_aggregation_result_interpretation_policy_assessment
      .interpretation_policy;
  if (interpretationPolicy !== null) {
    return interpretationPolicy.availability_source_aggregation_policy_key;
  }

  const aggregationResult =
    assessment.availability_source_aggregation_result_assessment
      .aggregation_result;
  if (aggregationResult !== null) {
    return aggregationResult.availability_source_aggregation_policy_key;
  }

  const readinessBasis =
    assessment.availability_source_aggregation_result_assessment
      .availability_source_aggregation_readiness_basis_assessment
      .readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.availability_source_aggregation_policy_key;
  }

  return (
    assessment
      .availability_source_aggregation_result_interpretation_policy_assessment
      .availability_source_aggregation_policy_assessment.aggregation_policy
      ?.key ??
    assessment.availability_source_aggregation_result_assessment
      .availability_source_aggregation_readiness_basis_assessment
      .availability_source_aggregation_readiness_policy_assessment
      .availability_source_aggregation_policy_assessment.aggregation_policy
      ?.key ??
    null
  );
}

function extractEvaluationAt(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment
): string | null {
  if (assessment.interpretation_basis !== null) {
    return assessment.interpretation_basis.evaluation_at;
  }

  const aggregationResult =
    assessment.availability_source_aggregation_result_assessment
      .aggregation_result;
  if (aggregationResult !== null) {
    return aggregationResult.evaluation_at;
  }

  const readinessBasis =
    assessment.availability_source_aggregation_result_assessment
      .availability_source_aggregation_readiness_basis_assessment
      .readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.evaluation_at;
  }

  return null;
}

/**
 * Exact nested lineage anchor — distinguishes same canonical value with
 * different operand / missing-member / Result lineage without new semantics.
 */
function extractCurrentLineageAnchorKey(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment
): string | null {
  if (assessment.interpretation_basis !== null) {
    return assessment.interpretation_basis.key;
  }

  const aggregationResult =
    assessment.availability_source_aggregation_result_assessment
      .aggregation_result;
  if (aggregationResult !== null) {
    return aggregationResult.key;
  }

  const readinessBasis =
    assessment.availability_source_aggregation_result_assessment
      .availability_source_aggregation_readiness_basis_assessment
      .readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.key;
  }

  return (
    assessment
      .availability_source_aggregation_result_interpretation_policy_assessment
      .availability_source_aggregation_policy_assessment.aggregation_policy
      ?.key ??
    assessment.availability_source_aggregation_result_assessment
      .availability_source_aggregation_readiness_basis_assessment
      .availability_source_aggregation_readiness_policy_assessment
      .availability_source_aggregation_policy_assessment.aggregation_policy
      ?.key ??
    null
  );
}

function buildCanonicalState(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment,
  value: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue
): CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState {
  const aggregation_policy_key =
    value === CANONICAL_NOT_APPLICABLE
      ? null
      : extractAggregationPolicyKey(assessment);

  if (value !== CANONICAL_NOT_APPLICABLE && aggregation_policy_key === null) {
    throw new Error(
      `Canonical Selected-source Aggregated Declared Resource Availability Evidence State invariant violated: missing Aggregation Policy lineage for resource ${assessment.resource_declaration_id}`
    );
  }

  const interpretation_basis_key =
    value === CANONICAL_SUPPORTING || value === CANONICAL_CONTRADICTING
      ? assessment.interpretation_basis!.key
      : null;

  if (
    (value === CANONICAL_SUPPORTING || value === CANONICAL_CONTRADICTING) &&
    interpretation_basis_key === null
  ) {
    throw new Error(
      `Canonical Selected-source Aggregated Declared Resource Availability Evidence State invariant violated: interpreted State requires Basis key for resource ${assessment.resource_declaration_id}`
    );
  }

  if (
    value !== CANONICAL_SUPPORTING &&
    value !== CANONICAL_CONTRADICTING &&
    assessment.interpretation_basis !== null
  ) {
    throw new Error(
      `Canonical Selected-source Aggregated Declared Resource Availability Evidence State invariant violated: unresolved/not-applicable State must not carry Basis for resource ${assessment.resource_declaration_id}`
    );
  }

  const evaluation_at = extractEvaluationAt(assessment);
  const current_lineage_anchor_key =
    extractCurrentLineageAnchorKey(assessment);

  return {
    key: canonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateKey(
      {
        resource_declaration_id: assessment.resource_declaration_id,
        evaluation_at,
        availability_source_aggregation_policy_key: aggregation_policy_key,
        current_lineage_anchor_key,
        interpretation_basis_key,
        ground186_status: assessment.status,
        value,
      }
    ),
    resource_declaration_id: assessment.resource_declaration_id,
    evaluation_at,
    availability_source_aggregation_policy_key: aggregation_policy_key,
    interpretation_basis_key,
    current_lineage_anchor_key,
    value,
  };
}

function assessResource(
  assessment: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisResourceAssessment
): CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResourceAssessment {
  const value =
    deriveCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateValue(
      assessment
    );
  const canonical_state = buildCanonicalState(assessment, value);

  return {
    resource_declaration_id: assessment.resource_declaration_id,
    interpretation_basis_assessment: assessment,
    canonical_state,
    is_applicable:
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateApplicable(
        value
      ),
    is_resolved:
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResolved(
        value
      ),
    is_unresolved:
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateUnresolved(
        value
      ),
  };
}

/**
 * Pure set-level Canonical Selected-source Aggregated Declared Resource
 * Availability Evidence State. Exact GROUND-186 normalization only.
 */
export function buildCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSet(
  input: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateEvalInput
): CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSetAssessment {
  if (
    !input.availability_source_aggregation_result_interpretation_basis_set
  ) {
    throw new Error(
      "availability_source_aggregation_result_interpretation_basis_set is required"
    );
  }

  const basisSet =
    input.availability_source_aggregation_result_interpretation_basis_set;

  if (!Array.isArray(basisSet.resource_assessments)) {
    throw new Error(
      "GROUND-186 Interpretation Basis Set requires resource_assessments array"
    );
  }

  const resource_assessments = basisSet.resource_assessments.map((assessment) =>
    assessResource(assessment)
  );

  const canonical_states = resource_assessments.map(
    (assessment) => assessment.canonical_state
  );

  return {
    availability_source_aggregation_result_interpretation_basis_set: basisSet,
    resource_assessments,
    canonical_states,
    has_applicable_states: resource_assessments.some(
      (assessment) => assessment.is_applicable
    ),
    has_resolved_states: resource_assessments.some(
      (assessment) => assessment.is_resolved
    ),
    has_unresolved_states: resource_assessments.some(
      (assessment) => assessment.is_unresolved
    ),
    has_supporting_states: canonical_states.some(
      (state) => state.value === CANONICAL_SUPPORTING
    ),
    has_contradicting_states: canonical_states.some(
      (state) => state.value === CANONICAL_CONTRADICTING
    ),
    has_not_applicable_states: canonical_states.some(
      (state) => state.value === CANONICAL_NOT_APPLICABLE
    ),
    model_limitations: [
      ...CANONICAL_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_STATE_MODEL_LIMITATIONS,
    ],
  };
}
