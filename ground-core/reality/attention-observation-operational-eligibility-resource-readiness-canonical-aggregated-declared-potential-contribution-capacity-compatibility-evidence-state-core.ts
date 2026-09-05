/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Canonical Aggregated Declared Potential Contribution
 * Capacity-Compatibility Evidence State (GROUND-169).
 *
 * Pure normalization of GROUND-168 Aggregation Result Interpretation Basis Set.
 * Sole runtime semantic authority: GROUND-168.
 *
 * Must not import GROUND-167/166/165/164/163/161 builders or project persistence.
 * Nested lineage on GROUND-168 assessments may be read for structural context only.
 *
 * NOT_APPLICABLE ≠ UNRESOLVED
 * SUPPORTING ≠ capacity compatibility true
 * CONTRADICTING ≠ capacity compatibility false
 * NO_CURRENT_RESULT ≠ CONTRADICTING
 * unusual GROUND-168 interpretations preserved exactly
 * canonical State ≠ Resource Ready / contribution verified
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-result-interpretation-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateModelLimitation[] =
  [
    "CAPACITY_COMPATIBILITY_PROPOSITION_TRUTH_NOT_MODELED",
    "MULTIPLE_CAPACITY_SOURCE_AGGREGATION_GROUPS_PER_BINDING_NOT_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_PROVENANCE_CARDINALITY_SEMANTICS_REQUIRE_REAUDIT_BEFORE_CONTRIBUTION_VERIFICATION",
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

const NONE_TOKEN = "NONE" as const;

const INTERP_SUPPORTING =
  "INTERPRET_AS_SUPPORTING_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE" as const;
const INTERP_CONTRADICTING =
  "INTERPRET_AS_CONTRADICTING_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE" as const;

const CANONICAL_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_READINESS =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_CURRENT_RESULT =
  "UNRESOLVED_NO_CURRENT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD" as const;
const CANONICAL_UNRESOLVED_NO_INTERPRETATION_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT" as const;
const CANONICAL_SUPPORTING =
  "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_SUPPORTING" as const;
const CANONICAL_CONTRADICTING =
  "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_CONTRADICTING" as const;

/**
 * Domain applicability — NOT_APPLICABLE is not unresolved.
 */
export function isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue
): boolean {
  return value !== CANONICAL_NOT_APPLICABLE;
}

/**
 * Resolved evidence — SUPPORTING and CONTRADICTING only.
 * isResolved=false does not itself imply UNRESOLVED (NOT_APPLICABLE is separate).
 */
export function isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue
): boolean {
  return value === CANONICAL_SUPPORTING || value === CANONICAL_CONTRADICTING;
}

/**
 * Explicit unresolved causes only — excludes NOT_APPLICABLE.
 */
export function isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue
): boolean {
  return (
    value === CANONICAL_UNRESOLVED_NO_READINESS ||
    value === CANONICAL_UNRESOLVED_NO_CURRENT_RESULT ||
    value === CANONICAL_UNRESOLVED_NO_INTERPRETATION_POLICY ||
    value === CANONICAL_UNRESOLVED_NO_MAPPING
  );
}

/**
 * Conceptual identity:
 * ...canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|
 * evaluationAt-or-NONE|aggregationPolicyKey-or-NONE|ground168Status|
 * interpretationBasisKey-or-NONE|canonicalStateValue
 */
export function attentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string | null;
  capacity_compatibility_source_aggregation_policy_key: string | null;
  ground168_status: string;
  aggregation_result_interpretation_basis_key: string | null;
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.evaluation_at ?? NONE_TOKEN,
    params.capacity_compatibility_source_aggregation_policy_key ?? NONE_TOKEN,
    params.ground168_status,
    params.aggregation_result_interpretation_basis_key ?? NONE_TOKEN,
    params.value,
  ].join("|");
}

function assertBasisPresentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: BASIS_PRESENT requires non-null Basis for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: BASIS_PRESENT requires non-null interpretation for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.interpretation !==
      assessment.interpretation_basis.interpretation
    ) {
      throw new Error(
        `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: interpretation mismatch for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.interpretation_basis !== null) {
    throw new Error(
      `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: non-present status requires null Basis for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.interpretation !== null) {
    throw new Error(
      `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: non-present status requires null interpretation for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

/**
 * Exhaustive GROUND-168 → canonical State mapping.
 * No Result/Policy reopening. No intuitive polarity.
 */
export function deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue {
  assertBasisPresentInvariant(assessment);

  switch (assessment.status) {
    case "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY":
      return CANONICAL_NOT_APPLICABLE;

    case "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED":
      return CANONICAL_UNRESOLVED_NO_READINESS;

    case "NO_CURRENT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD":
      return CANONICAL_UNRESOLVED_NO_CURRENT_RESULT;

    case "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_DECLARED":
      return CANONICAL_UNRESOLVED_NO_INTERPRETATION_POLICY;

    case "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT":
      return CANONICAL_UNRESOLVED_NO_MAPPING;

    case "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT": {
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
            `Unknown Capacity-Compatibility Source Aggregation Result Interpretation: ${String(interpretation)}`
          );
        }
      }
    }

    default: {
      const _exhaustive: never = assessment.status;
      void _exhaustive;
      throw new Error(
        `Unknown GROUND-168 Aggregation Result Interpretation Basis status: ${String(assessment.status)}`
      );
    }
  }
}

function extractAggregationPolicyKey(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment
): string | null {
  if (assessment.interpretation_basis !== null) {
    return assessment.interpretation_basis
      .capacity_compatibility_source_aggregation_policy_key;
  }

  const interpretationPolicy =
    assessment.aggregation_result_interpretation_policy_assessment
      .interpretation_policy;
  if (interpretationPolicy !== null) {
    return interpretationPolicy.capacity_compatibility_source_aggregation_policy_key;
  }

  const aggregationResult =
    assessment.aggregation_result_assessment.aggregation_result;
  if (aggregationResult !== null) {
    return aggregationResult.capacity_compatibility_source_aggregation_policy_key;
  }

  const readinessBasis =
    assessment.aggregation_result_assessment
      .aggregation_readiness_basis_assessment.readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.capacity_compatibility_source_aggregation_policy_key;
  }

  return (
    assessment.aggregation_result_interpretation_policy_assessment
      .aggregation_policy_assessment.aggregation_policy?.key ??
    assessment.aggregation_result_assessment
      .aggregation_readiness_basis_assessment
      .aggregation_readiness_policy_assessment.aggregation_policy_assessment
      .aggregation_policy?.key ??
    null
  );
}

function extractEvaluationAt(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment
): string | null {
  if (assessment.interpretation_basis !== null) {
    return assessment.interpretation_basis.evaluation_at;
  }

  const aggregationResult =
    assessment.aggregation_result_assessment.aggregation_result;
  if (aggregationResult !== null) {
    return aggregationResult.evaluation_at;
  }

  const readinessBasis =
    assessment.aggregation_result_assessment
      .aggregation_readiness_basis_assessment.readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.evaluation_at;
  }

  return null;
}

function extractContextKeys(
  candidate_key: string,
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment,
  nestedContext: {
    observation_need_key: string;
    capability_requirement_set_key: string;
  } | null
): {
  observation_need_key: string;
  capability_requirement_set_key: string;
} {
  if (assessment.interpretation_basis !== null) {
    return {
      observation_need_key: assessment.interpretation_basis.observation_need_key,
      capability_requirement_set_key:
        assessment.interpretation_basis.capability_requirement_set_key,
    };
  }

  const interpretationPolicy =
    assessment.aggregation_result_interpretation_policy_assessment
      .interpretation_policy;
  if (interpretationPolicy !== null) {
    return {
      observation_need_key: interpretationPolicy.observation_need_key,
      capability_requirement_set_key:
        interpretationPolicy.capability_requirement_set_key,
    };
  }

  const aggregationResult =
    assessment.aggregation_result_assessment.aggregation_result;
  if (aggregationResult !== null) {
    return {
      observation_need_key: aggregationResult.observation_need_key,
      capability_requirement_set_key:
        aggregationResult.capability_requirement_set_key,
    };
  }

  const readinessBasis =
    assessment.aggregation_result_assessment
      .aggregation_readiness_basis_assessment.readiness_basis;
  if (readinessBasis !== null) {
    return {
      observation_need_key: readinessBasis.observation_need_key,
      capability_requirement_set_key:
        readinessBasis.capability_requirement_set_key,
    };
  }

  const aggregationPolicy =
    assessment.aggregation_result_interpretation_policy_assessment
      .aggregation_policy_assessment.aggregation_policy ??
    assessment.aggregation_result_assessment
      .aggregation_readiness_basis_assessment
      .aggregation_readiness_policy_assessment.aggregation_policy_assessment
      .aggregation_policy;
  if (aggregationPolicy !== null) {
    return {
      observation_need_key: aggregationPolicy.observation_need_key,
      capability_requirement_set_key:
        aggregationPolicy.capability_requirement_set_key,
    };
  }

  if (nestedContext !== null) {
    return nestedContext;
  }

  throw new Error(
    `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: missing Candidate/Need/CapSet lineage for Binding ${assessment.resource_readiness_observation_context_binding_key} (candidate ${candidate_key})`
  );
}

function extractNestedContextFallback(
  basisCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisAssessment,
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment
): {
  observation_need_key: string;
  capability_requirement_set_key: string;
} | null {
  const bindingStates =
    basisCandidate.capacity_compatibility_source_aggregation_result_assessment
      .capacity_compatibility_source_aggregation_readiness_basis_assessment
      .canonical_per_source_capacity_relation_evidence_state_assessment
      .binding_state_assessments;

  const matched = bindingStates.find(
    (binding) =>
      binding.observation_resource_requirement_key ===
        assessment.observation_resource_requirement_key &&
      binding.resource_readiness_observation_context_binding_key ===
        assessment.resource_readiness_observation_context_binding_key &&
      binding.resource_declaration_id === assessment.resource_declaration_id
  );

  const firstState = matched?.source_state_assessments[0]?.canonical_state;
  if (!firstState) {
    return null;
  }

  return {
    observation_need_key: firstState.observation_need_key,
    capability_requirement_set_key: firstState.capability_requirement_set_key,
  };
}

function buildCanonicalState(
  candidate_key: string,
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisBindingAssessment,
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue,
  nestedContext: {
    observation_need_key: string;
    capability_requirement_set_key: string;
  } | null
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState {
  const context = extractContextKeys(candidate_key, assessment, nestedContext);
  const aggregation_policy_key =
    value === CANONICAL_NOT_APPLICABLE
      ? null
      : extractAggregationPolicyKey(assessment);

  if (value !== CANONICAL_NOT_APPLICABLE && aggregation_policy_key === null) {
    throw new Error(
      `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: missing Aggregation Policy lineage for Binding ${assessment.resource_readiness_observation_context_binding_key}`
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
      `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: interpreted State requires Basis key for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (
    value !== CANONICAL_SUPPORTING &&
    value !== CANONICAL_CONTRADICTING &&
    assessment.interpretation_basis !== null
  ) {
    throw new Error(
      `Canonical Aggregated Capacity-Compatibility Evidence State invariant violated: unresolved/not-applicable State must not carry Basis for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }

  const evaluation_at = extractEvaluationAt(assessment);

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateKey(
      {
        candidate_key,
        observation_need_key: context.observation_need_key,
        capability_requirement_set_key: context.capability_requirement_set_key,
        observation_resource_requirement_key:
          assessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          assessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id: assessment.resource_declaration_id,
        evaluation_at,
        capacity_compatibility_source_aggregation_policy_key:
          aggregation_policy_key,
        ground168_status: assessment.status,
        aggregation_result_interpretation_basis_key: interpretation_basis_key,
        value,
      }
    ),
    candidate_key,
    observation_need_key: context.observation_need_key,
    capability_requirement_set_key: context.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      assessment.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      assessment.resource_readiness_observation_context_binding_key,
    resource_declaration_id: assessment.resource_declaration_id,
    evaluation_at,
    capacity_compatibility_source_aggregation_policy_key: aggregation_policy_key,
    aggregation_result_interpretation_basis_key: interpretation_basis_key,
    value,
  };
}

/**
 * Pure per-Candidate canonical aggregated evidence State assessment.
 * Exact GROUND-168 normalization only.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
  basisAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationResultInterpretationBasisAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment {
  const binding_state_assessments =
    basisAssessment.binding_interpretation_basis_assessments.map(
      (bindingAssessment) => {
        const value =
          deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue(
            bindingAssessment
          );
        const nestedContext = extractNestedContextFallback(
          basisAssessment,
          bindingAssessment
        );
        const canonical_state = buildCanonicalState(
          basisAssessment.candidate_key,
          bindingAssessment,
          value,
          nestedContext
        );

        return {
          observation_resource_requirement_key:
            bindingAssessment.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            bindingAssessment.resource_readiness_observation_context_binding_key,
          resource_declaration_id: bindingAssessment.resource_declaration_id,
          aggregation_result_interpretation_basis_assessment:
            bindingAssessment,
          canonical_state,
          canonical_state_value: value,
        };
      }
    );

  return {
    candidate_key: basisAssessment.candidate_key,
    capacity_compatibility_source_aggregation_result_interpretation_basis_assessment:
      basisAssessment,
    binding_state_assessments,
    has_applicable_aggregated_capacity_compatibility_evidence_states:
      binding_state_assessments.some((assessment) =>
        isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
          assessment.canonical_state_value
        )
      ),
    has_resolved_aggregated_capacity_compatibility_evidence_states:
      binding_state_assessments.some((assessment) =>
        isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
          assessment.canonical_state_value
        )
      ),
    has_supporting_aggregated_capacity_compatibility_evidence_states:
      binding_state_assessments.some(
        (assessment) =>
          assessment.canonical_state_value === CANONICAL_SUPPORTING
      ),
    has_contradicting_aggregated_capacity_compatibility_evidence_states:
      binding_state_assessments.some(
        (assessment) =>
          assessment.canonical_state_value === CANONICAL_CONTRADICTING
      ),
    has_unresolved_aggregated_capacity_compatibility_evidence_states:
      binding_state_assessments.some((assessment) =>
        isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
          assessment.canonical_state_value
        )
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Canonical Aggregated Capacity-Compatibility Evidence State.
 * Preserves GROUND-168 AttentionCandidate / Binding order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateSetAssessment {
  const candidate_assessments =
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set.candidate_assessments.map(
      (basisAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
          basisAssessment
        )
    );

  return {
    resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set:
      input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set,
    candidate_assessments,
    has_applicable_aggregated_capacity_compatibility_evidence_states:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_applicable_aggregated_capacity_compatibility_evidence_states
      ),
    has_resolved_aggregated_capacity_compatibility_evidence_states:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resolved_aggregated_capacity_compatibility_evidence_states
      ),
    has_supporting_aggregated_capacity_compatibility_evidence_states:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_supporting_aggregated_capacity_compatibility_evidence_states
      ),
    has_contradicting_aggregated_capacity_compatibility_evidence_states:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_contradicting_aggregated_capacity_compatibility_evidence_states
      ),
    has_unresolved_aggregated_capacity_compatibility_evidence_states:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_unresolved_aggregated_capacity_compatibility_evidence_states
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS,
    ],
  };
}
