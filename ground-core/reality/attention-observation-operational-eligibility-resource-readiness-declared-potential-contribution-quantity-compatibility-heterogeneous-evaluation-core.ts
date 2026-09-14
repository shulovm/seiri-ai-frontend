import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Declared Potential Contribution Quantity-Compatibility
 * Heterogeneous Evaluation State (GROUND-177).
 *
 * Pure composition of:
 *   GROUND-169 Canonical Aggregated Capacity-Compatibility Evidence State Set
 *   + GROUND-175 Canonical Required-Amount Compatibility Evidence State Set
 *
 * Preserves both exact canonical evidence dimensions without scalarization.
 *
 * Must not import GROUND-174/173/171/168/157/155 builders or project persistence.
 * Nested lineage inside 169/175 may be read for authoritative structural identity only.
 *
 * Domain: DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY
 *
 * No ANY/ALL. No Composition Policy. No readiness. No availability.
 * No deliverability / verification / Requirement Satisfaction / Resource Ready.
 * both SUPPORTING ≠ physically deliverable
 * capacity NOT_APPLICABLE ≠ whole evaluation NOT_APPLICABLE
 * required-amount NOT_APPLICABLE (no contribution subject) → whole NOT_APPLICABLE
 */

import {
  isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState,
  isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState,
  isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state-types.js";
import {
  isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState,
  isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityCapacityDimension,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationState,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationStatus,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityRequiredAmountDimension,
  AttentionObservationOperationalEligibilityResourceReadinessQuantityCompatibilityEvidenceDimensionCategory,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationModelLimitation[] =
  [
    "QUANTITY_COMPATIBILITY_SCALAR_COMPOSITION_NOT_MODELED",
    "PHYSICAL_EVIDENCE_REQUIRED_DIMENSION_POLICY_NOT_MODELED",
    "PHYSICAL_EVIDENCE_DIMENSION_READINESS_NOT_MODELED",
    "TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
    "POTENTIAL_CONTRIBUTION_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "FLOW_TIME_BASIS_NOT_MODELED",
    "FLOW_INTEGRATION_WINDOW_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "CANONICAL_RESOURCE_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_DELIVERABILITY_NOT_MODELED",
    "REQUIREMENT_SATISFACTION_NOT_MODELED",
    "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "CROSS_BINDING_QUANTITY_COMPOSITION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export const DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_DOMAIN =
  "DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY" as const;

const REQUIRED_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION" as const;

const CAPACITY_SUPPORTING =
  "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_SUPPORTING" as const;
const CAPACITY_CONTRADICTING =
  "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_CONTRADICTING" as const;

const REQUIRED_SUPPORTING =
  "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_SUPPORTING" as const;
const REQUIRED_CONTRADICTING =
  "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_CONTRADICTING" as const;

const STATUS_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION" as const;
const STATUS_PRESENT =
  "DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_STATE_PRESENT" as const;

function bindingContextKey(params: {
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
}): string {
  return [
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
  ].join("|");
}

/**
 * Conceptual identity:
 * ...declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-state|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|
 * evaluationAt|contributionDeclarationKey|
 * ground169StateKey|ground169StateValue|
 * ground175StateKey|ground175StateValue
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  physical_potential_contribution_declaration_key: string;
  ground169_state_key: string;
  ground169_state_value: string;
  ground175_state_key: string;
  ground175_state_value: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.physical_potential_contribution_declaration_key,
    params.ground169_state_key,
    params.ground169_state_value,
    params.ground175_state_key,
    params.ground175_state_value,
  ].join("|");
}

/**
 * Capacity-axis descriptive category. Precedence: NA → unresolved → SUPPORTING → CONTRADICTING.
 */
export function toQuantityCompatibilityCapacityDimensionCategory(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue
): AttentionObservationOperationalEligibilityResourceReadinessQuantityCompatibilityEvidenceDimensionCategory {
  if (
    !isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
      value
    )
  ) {
    return "NOT_APPLICABLE";
  }
  if (
    isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
      value
    )
  ) {
    return "UNRESOLVED";
  }
  if (value === CAPACITY_SUPPORTING) {
    return "SUPPORTING";
  }
  if (value === CAPACITY_CONTRADICTING) {
    return "CONTRADICTING";
  }
  throw new Error(
    `Unknown GROUND-169 capacity-compatibility evidence State value: ${String(value)}`
  );
}

/**
 * Required-amount-axis descriptive category. Precedence: NA → unresolved → SUPPORTING → CONTRADICTING.
 */
export function toQuantityCompatibilityRequiredAmountDimensionCategory(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue
): AttentionObservationOperationalEligibilityResourceReadinessQuantityCompatibilityEvidenceDimensionCategory {
  if (
    !isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
      value
    )
  ) {
    return "NOT_APPLICABLE";
  }
  if (
    isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
      value
    )
  ) {
    return "UNRESOLVED";
  }
  if (value === REQUIRED_SUPPORTING) {
    return "SUPPORTING";
  }
  if (value === REQUIRED_CONTRADICTING) {
    return "CONTRADICTING";
  }
  throw new Error(
    `Unknown GROUND-175 required-amount compatibility evidence State value: ${String(value)}`
  );
}

/**
 * Authoritative GROUND-169 nested contribution identity extraction path:
 *
 * candidate.capacity_compatibility_source_aggregation_result_interpretation_basis_assessment
 *   .capacity_compatibility_source_aggregation_result_assessment
 *   .capacity_compatibility_source_aggregation_readiness_basis_assessment
 *   .canonical_per_source_capacity_relation_evidence_state_assessment
 *   .binding_state_assessments[exact Binding]
 *   .capacity_relation_interpretation_basis_binding_assessment
 *   .raw_relation_binding_assessment
 *   .raw_relation_basis.physical_potential_contribution_declaration_key
 *   (fallback: declaration.key / interpretation_basis.physical_potential_contribution_declaration_key)
 *
 * Does not reopen GROUND-155 as a third runtime input.
 */
export function extractDeclaredPotentialContributionIdentityFromGround169NestedLineage(params: {
  capacity_candidate_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
}): {
  physical_potential_contribution_declaration_key: string;
  evaluation_at: string;
} | null {
  const nested161Bindings =
    params.capacity_candidate_assessment
      .capacity_compatibility_source_aggregation_result_interpretation_basis_assessment
      .capacity_compatibility_source_aggregation_result_assessment
      .capacity_compatibility_source_aggregation_readiness_basis_assessment
      .canonical_per_source_capacity_relation_evidence_state_assessment
      .binding_state_assessments;

  const matched = nested161Bindings.find(
    (binding) =>
      binding.observation_resource_requirement_key ===
        params.observation_resource_requirement_key &&
      binding.resource_readiness_observation_context_binding_key ===
        params.resource_readiness_observation_context_binding_key &&
      binding.resource_declaration_id === params.resource_declaration_id
  );

  if (!matched) {
    return null;
  }

  const rawRelationBinding =
    matched.capacity_relation_interpretation_basis_binding_assessment
      .raw_relation_binding_assessment;

  const rawBasis = rawRelationBinding.raw_relation_basis;
  if (
    rawBasis !== null &&
    typeof rawBasis.physical_potential_contribution_declaration_key ===
      "string" &&
    rawBasis.physical_potential_contribution_declaration_key.length > 0 &&
    typeof rawBasis.evaluation_at === "string" &&
    rawBasis.evaluation_at.length > 0
  ) {
    return {
      physical_potential_contribution_declaration_key:
        rawBasis.physical_potential_contribution_declaration_key,
      evaluation_at: rawBasis.evaluation_at,
    };
  }

  const declaration =
    rawRelationBinding.physical_potential_contribution_declaration_assessment
      .declaration;
  if (
    declaration !== null &&
    typeof declaration.key === "string" &&
    declaration.key.length > 0 &&
    typeof declaration.evaluation_at === "string" &&
    declaration.evaluation_at.length > 0
  ) {
    return {
      physical_potential_contribution_declaration_key: declaration.key,
      evaluation_at: declaration.evaluation_at,
    };
  }

  const keys = new Set<string>();
  const evaluationAts = new Map<string, string>();
  for (const source of matched.capacity_relation_interpretation_basis_binding_assessment
    .capacity_source_interpretation_basis_assessments) {
    const basis = source.interpretation_basis;
    if (basis === null) {
      continue;
    }
    keys.add(basis.physical_potential_contribution_declaration_key);
    evaluationAts.set(temporalInstantKey(basis.evaluation_at), basis.evaluation_at);
  }

  if (keys.size === 1 && evaluationAts.size === 1) {
    return {
      physical_potential_contribution_declaration_key: [...keys][0]!,
      evaluation_at: [...evaluationAts.values()][0]!,
    };
  }

  return null;
}

function assertNoDuplicateBindings(
  side: "GROUND-169" | "GROUND-175",
  bindings: Array<{
    observation_resource_requirement_key: string;
    resource_readiness_observation_context_binding_key: string;
    resource_declaration_id: string;
  }>
): void {
  const seen = new Set<string>();
  for (const binding of bindings) {
    const key = bindingContextKey(binding);
    if (seen.has(key)) {
      throw new Error(
        `Malformed ${side} Set: duplicate Binding context ${key}`
      );
    }
    seen.add(key);
  }
}

function assessBindingHeterogeneousEvaluation(params: {
  capacity_candidate_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment;
  capacity_binding: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateBindingAssessment;
  required_binding: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateBindingAssessment;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationBindingAssessment {
  const capacityState = params.capacity_binding.canonical_state;
  const requiredState = params.required_binding.canonical_state;
  const capacityValue = params.capacity_binding.canonical_state_value;
  const requiredValue = params.required_binding.canonical_state_value;

  if (
    capacityState.candidate_key !== requiredState.candidate_key ||
    capacityState.observation_need_key !== requiredState.observation_need_key ||
    capacityState.capability_requirement_set_key !==
      requiredState.capability_requirement_set_key ||
    capacityState.observation_resource_requirement_key !==
      requiredState.observation_resource_requirement_key ||
    capacityState.resource_readiness_observation_context_binding_key !==
      requiredState.resource_readiness_observation_context_binding_key ||
    capacityState.resource_declaration_id !==
      requiredState.resource_declaration_id
  ) {
    throw new Error(
      `Malformed cross-input quantity-compatibility composition: Binding identity mismatch for ${bindingContextKey(
        {
          observation_resource_requirement_key:
            requiredState.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            requiredState.resource_readiness_observation_context_binding_key,
          resource_declaration_id: requiredState.resource_declaration_id,
        }
      )}`
    );
  }

  if (requiredValue === REQUIRED_NOT_APPLICABLE) {
    if (
      isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState(
        capacityValue
      )
    ) {
      throw new Error(
        `Malformed lineage: GROUND-175 NOT_APPLICABLE (no contribution subject) with resolved GROUND-169 capacity State ${capacityValue}`
      );
    }

    return {
      observation_resource_requirement_key:
        requiredState.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        requiredState.resource_readiness_observation_context_binding_key,
      resource_declaration_id: requiredState.resource_declaration_id,
      capacity_compatibility_state_assessment: params.capacity_binding,
      required_amount_compatibility_state_assessment: params.required_binding,
      status: STATUS_NOT_APPLICABLE,
      evaluation_state: null,
      has_evaluation_state: false,
    };
  }

  const requiredContributionKey =
    requiredState.physical_potential_contribution_declaration_key;
  if (
    requiredContributionKey === null ||
    requiredContributionKey.length === 0
  ) {
    throw new Error(
      `Malformed GROUND-175 State: applicable required-amount State missing physical_potential_contribution_declaration_key for Binding ${bindingContextKey(
        requiredState
      )}`
    );
  }

  if (
    requiredState.evaluation_at === null ||
    requiredState.evaluation_at.length === 0
  ) {
    throw new Error(
      `Malformed GROUND-175 State: applicable required-amount State missing evaluation_at for Binding ${bindingContextKey(
        requiredState
      )}`
    );
  }

  const capacityContributionIdentity =
    extractDeclaredPotentialContributionIdentityFromGround169NestedLineage({
      capacity_candidate_assessment: params.capacity_candidate_assessment,
      observation_resource_requirement_key:
        requiredState.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        requiredState.resource_readiness_observation_context_binding_key,
      resource_declaration_id: requiredState.resource_declaration_id,
    });

  if (capacityContributionIdentity === null) {
    throw new Error(
      `Malformed cross-input: unable to extract contribution identity from authoritative GROUND-169 nested lineage for Binding ${bindingContextKey(
        requiredState
      )}`
    );
  }

  if (
    capacityContributionIdentity.physical_potential_contribution_declaration_key !==
    requiredContributionKey
  ) {
    throw new Error(
      `Malformed cross-input: contribution-key mismatch GROUND-169=${capacityContributionIdentity.physical_potential_contribution_declaration_key} GROUND-175=${requiredContributionKey}`
    );
  }

  if (
    capacityState.evaluation_at !== null &&
    compareTemporalInstants(capacityState.evaluation_at, capacityContributionIdentity.evaluation_at) !== 0
  ) {
    throw new Error(
      `Malformed GROUND-169 lineage: canonical evaluation_at ${capacityState.evaluation_at} != nested contribution evaluation_at ${capacityContributionIdentity.evaluation_at}`
    );
  }

  const capacityEvaluationAt =
    capacityState.evaluation_at ??
    capacityContributionIdentity.evaluation_at;

  if (compareTemporalInstants(capacityEvaluationAt, requiredState.evaluation_at) !== 0) {
    throw new Error(
      `Malformed cross-input: evaluation_at mismatch GROUND-169=${capacityEvaluationAt} GROUND-175=${requiredState.evaluation_at}`
    );
  }

  const capacityCategory =
    toQuantityCompatibilityCapacityDimensionCategory(capacityValue);
  const requiredCategory =
    toQuantityCompatibilityRequiredAmountDimensionCategory(requiredValue);

  const capacity_compatibility_dimension: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityCapacityDimension =
    {
      canonical_capacity_compatibility_evidence_state_key: capacityState.key,
      canonical_capacity_compatibility_evidence_state_value: capacityValue,
      category: capacityCategory,
    };

  const required_amount_compatibility_dimension: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityRequiredAmountDimension =
    {
      canonical_required_amount_compatibility_evidence_state_key:
        requiredState.key,
      canonical_required_amount_compatibility_evidence_state_value:
        requiredValue,
      category: requiredCategory,
    };

  const evaluation_state: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationState =
    {
      key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationStateKey(
        {
          candidate_key: requiredState.candidate_key,
          observation_need_key: requiredState.observation_need_key,
          capability_requirement_set_key:
            requiredState.capability_requirement_set_key,
          observation_resource_requirement_key:
            requiredState.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            requiredState.resource_readiness_observation_context_binding_key,
          resource_declaration_id: requiredState.resource_declaration_id,
          evaluation_at: requiredState.evaluation_at,
          physical_potential_contribution_declaration_key:
            requiredContributionKey,
          ground169_state_key: capacityState.key,
          ground169_state_value: capacityValue,
          ground175_state_key: requiredState.key,
          ground175_state_value: requiredValue,
        }
      ),
      candidate_key: requiredState.candidate_key,
      observation_need_key: requiredState.observation_need_key,
      capability_requirement_set_key:
        requiredState.capability_requirement_set_key,
      dimension: "RESOURCE_READINESS",
      observation_resource_requirement_key:
        requiredState.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        requiredState.resource_readiness_observation_context_binding_key,
      resource_declaration_id: requiredState.resource_declaration_id,
      evaluation_at: requiredState.evaluation_at,
      physical_potential_contribution_declaration_key: requiredContributionKey,
      capacity_compatibility_dimension,
      required_amount_compatibility_dimension,
    };

  const status: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationStatus =
    STATUS_PRESENT;

  return {
    observation_resource_requirement_key:
      requiredState.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      requiredState.resource_readiness_observation_context_binding_key,
    resource_declaration_id: requiredState.resource_declaration_id,
    capacity_compatibility_state_assessment: params.capacity_binding,
    required_amount_compatibility_state_assessment: params.required_binding,
    status,
    evaluation_state,
    has_evaluation_state: true,
  };
}

function summarizeDimensionFlags(
  bindingAssessments: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationBindingAssessment[]
): {
  has_quantity_compatibility_heterogeneous_evaluation_states: boolean;
  has_capacity_supporting_dimensions: boolean;
  has_capacity_contradicting_dimensions: boolean;
  has_capacity_unresolved_dimensions: boolean;
  has_capacity_not_applicable_dimensions: boolean;
  has_required_amount_supporting_dimensions: boolean;
  has_required_amount_contradicting_dimensions: boolean;
  has_required_amount_unresolved_dimensions: boolean;
  has_required_amount_not_applicable_dimensions: boolean;
} {
  let has_capacity_supporting_dimensions = false;
  let has_capacity_contradicting_dimensions = false;
  let has_capacity_unresolved_dimensions = false;
  let has_capacity_not_applicable_dimensions = false;
  let has_required_amount_supporting_dimensions = false;
  let has_required_amount_contradicting_dimensions = false;
  let has_required_amount_unresolved_dimensions = false;
  let has_required_amount_not_applicable_dimensions = false;
  let has_quantity_compatibility_heterogeneous_evaluation_states = false;

  for (const binding of bindingAssessments) {
    if (binding.has_evaluation_state && binding.evaluation_state !== null) {
      has_quantity_compatibility_heterogeneous_evaluation_states = true;
      const capacityCategory =
        binding.evaluation_state.capacity_compatibility_dimension.category;
      const requiredCategory =
        binding.evaluation_state.required_amount_compatibility_dimension
          .category;
      if (capacityCategory === "SUPPORTING") {
        has_capacity_supporting_dimensions = true;
      }
      if (capacityCategory === "CONTRADICTING") {
        has_capacity_contradicting_dimensions = true;
      }
      if (capacityCategory === "UNRESOLVED") {
        has_capacity_unresolved_dimensions = true;
      }
      if (capacityCategory === "NOT_APPLICABLE") {
        has_capacity_not_applicable_dimensions = true;
      }
      if (requiredCategory === "SUPPORTING") {
        has_required_amount_supporting_dimensions = true;
      }
      if (requiredCategory === "CONTRADICTING") {
        has_required_amount_contradicting_dimensions = true;
      }
      if (requiredCategory === "UNRESOLVED") {
        has_required_amount_unresolved_dimensions = true;
      }
      if (requiredCategory === "NOT_APPLICABLE") {
        has_required_amount_not_applicable_dimensions = true;
      }
    } else {
      // Whole NOT_APPLICABLE preserves required-amount NA existence via Binding assessment.
      has_required_amount_not_applicable_dimensions = true;
      const capacityValue =
        binding.capacity_compatibility_state_assessment.canonical_state_value;
      const capacityCategory =
        toQuantityCompatibilityCapacityDimensionCategory(capacityValue);
      if (capacityCategory === "NOT_APPLICABLE") {
        has_capacity_not_applicable_dimensions = true;
      }
      if (capacityCategory === "UNRESOLVED") {
        has_capacity_unresolved_dimensions = true;
      }
    }
  }

  return {
    has_quantity_compatibility_heterogeneous_evaluation_states,
    has_capacity_supporting_dimensions,
    has_capacity_contradicting_dimensions,
    has_capacity_unresolved_dimensions,
    has_capacity_not_applicable_dimensions,
    has_required_amount_supporting_dimensions,
    has_required_amount_contradicting_dimensions,
    has_required_amount_unresolved_dimensions,
    has_required_amount_not_applicable_dimensions,
  };
}

export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluation(
  capacity_candidate_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment,
  required_candidate_assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationAssessment {
  if (
    capacity_candidate_assessment.candidate_key !==
    required_candidate_assessment.candidate_key
  ) {
    throw new Error(
      `Malformed cross-input: candidate_key mismatch GROUND-169=${capacity_candidate_assessment.candidate_key} GROUND-175=${required_candidate_assessment.candidate_key}`
    );
  }

  assertNoDuplicateBindings(
    "GROUND-169",
    capacity_candidate_assessment.binding_state_assessments
  );
  assertNoDuplicateBindings(
    "GROUND-175",
    required_candidate_assessment.binding_state_assessments
  );

  const capacityByContext = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateBindingAssessment
  >();
  for (const binding of capacity_candidate_assessment.binding_state_assessments) {
    capacityByContext.set(bindingContextKey(binding), binding);
  }

  const matchedCapacityKeys = new Set<string>();
  const binding_heterogeneous_evaluation_assessments: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationBindingAssessment[] =
    [];

  for (const required_binding of required_candidate_assessment.binding_state_assessments) {
    const contextKey = bindingContextKey(required_binding);
    const capacity_binding = capacityByContext.get(contextKey);
    if (!capacity_binding) {
      throw new Error(
        `Malformed input Set: GROUND-175 Binding ${contextKey} has no matching GROUND-169 capacity Binding`
      );
    }
    matchedCapacityKeys.add(contextKey);

    binding_heterogeneous_evaluation_assessments.push(
      assessBindingHeterogeneousEvaluation({
        capacity_candidate_assessment,
        capacity_binding,
        required_binding,
      })
    );
  }

  for (const capacity_binding of capacity_candidate_assessment.binding_state_assessments) {
    const contextKey = bindingContextKey(capacity_binding);
    if (!matchedCapacityKeys.has(contextKey)) {
      throw new Error(
        `Malformed input Set: GROUND-169 Binding ${contextKey} has no matching GROUND-175 required-amount Binding`
      );
    }
  }

  const flags = summarizeDimensionFlags(
    binding_heterogeneous_evaluation_assessments
  );

  return {
    candidate_key: required_candidate_assessment.candidate_key,
    canonical_capacity_compatibility_evidence_state_assessment:
      capacity_candidate_assessment,
    canonical_required_amount_compatibility_evidence_state_assessment:
      required_candidate_assessment,
    binding_heterogeneous_evaluation_assessments,
    ...flags,
    model_limitations:
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_MODEL_LIMITATIONS,
  };
}

export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSetAssessment {
  const capacitySet = input.canonical_capacity_compatibility_evidence_state_set;
  const requiredSet =
    input.canonical_required_amount_compatibility_evidence_state_set;

  const capacityByCandidate = new Map(
    capacitySet.candidate_assessments.map((candidate) => [
      candidate.candidate_key,
      candidate,
    ])
  );
  const requiredByCandidate = new Map(
    requiredSet.candidate_assessments.map((candidate) => [
      candidate.candidate_key,
      candidate,
    ])
  );

  const allCandidateKeys = new Set([
    ...capacityByCandidate.keys(),
    ...requiredByCandidate.keys(),
  ]);

  const candidate_assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationAssessment[] =
    [];

  for (const candidate_key of [...allCandidateKeys].sort()) {
    const capacityCandidate = capacityByCandidate.get(candidate_key);
    const requiredCandidate = requiredByCandidate.get(candidate_key);

    if (!capacityCandidate || !requiredCandidate) {
      throw new Error(
        `Malformed input Set: candidate ${candidate_key} missing on one axis (GROUND-169 present=${Boolean(
          capacityCandidate
        )}, GROUND-175 present=${Boolean(requiredCandidate)})`
      );
    }

    candidate_assessments.push(
      assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluation(
        capacityCandidate,
        requiredCandidate
      )
    );
  }

  const flags = {
    has_quantity_compatibility_heterogeneous_evaluation_states:
      candidate_assessments.some(
        (c) => c.has_quantity_compatibility_heterogeneous_evaluation_states
      ),
    has_capacity_supporting_dimensions: candidate_assessments.some(
      (c) => c.has_capacity_supporting_dimensions
    ),
    has_capacity_contradicting_dimensions: candidate_assessments.some(
      (c) => c.has_capacity_contradicting_dimensions
    ),
    has_capacity_unresolved_dimensions: candidate_assessments.some(
      (c) => c.has_capacity_unresolved_dimensions
    ),
    has_capacity_not_applicable_dimensions: candidate_assessments.some(
      (c) => c.has_capacity_not_applicable_dimensions
    ),
    has_required_amount_supporting_dimensions: candidate_assessments.some(
      (c) => c.has_required_amount_supporting_dimensions
    ),
    has_required_amount_contradicting_dimensions: candidate_assessments.some(
      (c) => c.has_required_amount_contradicting_dimensions
    ),
    has_required_amount_unresolved_dimensions: candidate_assessments.some(
      (c) => c.has_required_amount_unresolved_dimensions
    ),
    has_required_amount_not_applicable_dimensions: candidate_assessments.some(
      (c) => c.has_required_amount_not_applicable_dimensions
    ),
  };

  return {
    canonical_capacity_compatibility_evidence_state_set: capacitySet,
    canonical_required_amount_compatibility_evidence_state_set: requiredSet,
    candidate_assessments,
    ...flags,
    model_limitations:
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_MODEL_LIMITATIONS,
  };
}
