/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Declared Potential Contribution Raw Capacity & Required-Amount
 * Relation Basis (GROUND-157).
 *
 * Pure physical-branch derivation from GROUND-153 + GROUND-155 only.
 *
 * Must not import GROUND-137–151, Reservation, Commitment, Feasibility,
 * Permission, Authority, or OE semantics.
 *
 * raw relation ≠ consistency / sufficiency / availability / free /
 * effective / verified / Resource Ready
 * Does not invalidate or correct GROUND-155 declarations.
 */

import {
  normalizeResourceQuantityClosedInterval,
  resourceCapacityCanonicalKey,
  resourceRequirementAmountCanonicalKey,
} from "./attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-types.js";
import {
  attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntry,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasis,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountRawRelation,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-types.js";
import type {
  ResourceCapacity,
  ResourceRequirementAmount,
} from "../types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisModelLimitation[] =
  [
    "DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_IS_NOT_CONSISTENCY_VERDICT",
    "DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_IS_NOT_SUFFICIENCY_VERDICT",
    "DECLARED_POTENTIAL_CONTRIBUTION_IS_NOT_VERIFIED_PHYSICAL_CONTRIBUTION",
    "DECLARED_CAPACITY_IS_NOT_CURRENT_AVAILABLE_QUANTITY",
    "DECLARED_CAPACITY_IS_NOT_RESERVATION_AWARE_FREE_QUANTITY",
    "CONTRIBUTION_CAPACITY_CONSISTENCY_INTERPRETATION_POLICY_NOT_MODELED",
    "CONTRIBUTION_REQUIRED_AMOUNT_INTERPRETATION_POLICY_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_EFFECT_ON_CAPACITY_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED",
    "RESOURCE_CAPACITY_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "PHYSICAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "CROSS_BINDING_QUANTITY_SUMMATION_NOT_MODELED",
    "SHARED_RESOURCE_SIMULTANEOUS_SATISFIABILITY_NOT_MODELED",
    "PHYSICAL_RESOURCE_COMPOSITION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Exhaustive mutually exclusive closed-interval topology for contribution vs reference.
 * Reuses GROUND-153 mathematical discipline with contribution-as-subject naming.
 * Never encodes consistency / sufficiency / readiness.
 */
export function deriveDeclaredPotentialContributionRawQuantityRelation(params: {
  contribution: ResourceRequirementAmount;
  reference: ResourceRequirementAmount | ResourceCapacity;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation {
  const contribution = normalizeResourceQuantityClosedInterval(
    params.contribution
  );
  const reference = normalizeResourceQuantityClosedInterval(params.reference);
  const cL = contribution.lower;
  const cU = contribution.upper;
  const rL = reference.lower;
  const rU = reference.upper;

  if (cU < rL) {
    return "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL";
  }
  if (cL > rU) {
    return "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL";
  }
  if (cL === rL && cU === rU) {
    return "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL";
  }
  if (rL <= cL && cU <= rU) {
    return "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REFERENCE_INTERVAL";
  }
  if (cL <= rL && rU <= cU) {
    return "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_CONTAINS_REFERENCE_INTERVAL";
  }
  return "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_PARTIALLY_OVERLAPS_REFERENCE_INTERVAL";
}

export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountRawRelationKey(params: {
  physical_potential_contribution_declaration_key: string;
  contribution_canonical_key: string;
  required_amount_canonical_key: string;
  relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-raw-relation",
    params.physical_potential_contribution_declaration_key,
    params.contribution_canonical_key,
    params.required_amount_canonical_key,
    params.relation,
  ].join("|");
}

export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntryKey(params: {
  physical_potential_contribution_declaration_key: string;
  capacity_declaration_id: string;
  contribution_canonical_key: string;
  capacity_canonical_key: string;
  relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-raw-relation-entry",
    params.physical_potential_contribution_declaration_key,
    params.capacity_declaration_id,
    params.contribution_canonical_key,
    params.capacity_canonical_key,
    params.relation,
  ].join("|");
}

function buildCanonicalCapacityRelationEntrySetKey(
  entries: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntry[]
): string {
  return (
    entries
      .map((entry) => entry.key)
      .slice()
      .sort(compareStrings)
      .join(",") || "NONE"
  );
}

export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  physical_potential_contribution_declaration_key: string;
  required_amount_relation_key: string;
  canonical_capacity_relation_entry_set_key: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.evaluation_at,
    params.physical_potential_contribution_declaration_key,
    params.required_amount_relation_key,
    params.canonical_capacity_relation_entry_set_key,
  ].join("|");
}

function resolveRequiredAmount(params: {
  quantityBinding: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment;
  quantityCandidate: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisEvalInput["resource_readiness_declared_capacity_required_amount_quantity_relation_set"]["candidate_assessments"][number];
}): ResourceRequirementAmount {
  const basis = params.quantityBinding.quantity_relation_basis;
  if (basis !== null) {
    return basis.required_amount;
  }

  const requirementAssessment =
    params.quantityCandidate.resource_readiness_raw_evidence_assessment.requirement_raw_evidence_assessments.find(
      (assessment) =>
        assessment.observation_resource_requirement_key ===
        params.quantityBinding.observation_resource_requirement_key
    );

  if (requirementAssessment === undefined) {
    throw new Error(
      `GROUND-157 malformed input: required_amount lineage missing for requirement ${params.quantityBinding.observation_resource_requirement_key}`
    );
  }

  return requirementAssessment.resource_requirement.required_amount;
}

function assertBindingContextsMatch(
  contributionBinding: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
  quantityBinding: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment
): void {
  const nested = contributionBinding.quantity_relation_binding_assessment;
  if (
    nested.resource_readiness_observation_context_binding_key !==
      quantityBinding.resource_readiness_observation_context_binding_key ||
    nested.observation_resource_requirement_key !==
      quantityBinding.observation_resource_requirement_key ||
    nested.resource_declaration_id !== quantityBinding.resource_declaration_id ||
    nested.raw_binding_evidence_assessment.evaluation_at !==
      quantityBinding.raw_binding_evidence_assessment.evaluation_at ||
    nested.raw_binding_evidence_assessment.candidate_key !==
      quantityBinding.raw_binding_evidence_assessment.candidate_key
  ) {
    throw new Error(
      `GROUND-157 malformed input: GROUND-155 nested GROUND-153 Binding context mismatches EvalInput GROUND-153 Binding for ${contributionBinding.resource_readiness_observation_context_binding_key}`
    );
  }

  const contributionContextKey =
    contributionBinding.resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key;
  const quantityContextKey =
    attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
      quantityBinding
    );
  if (contributionContextKey !== quantityContextKey) {
    throw new Error(
      `GROUND-157 malformed input: Binding physical context key mismatch (${contributionContextKey} vs ${quantityContextKey})`
    );
  }

  if (contributionBinding.has_explicit_physical_potential_contribution_declaration) {
    const declaration = contributionBinding.declaration;
    if (declaration === null) {
      throw new Error(
        `GROUND-157 malformed input: GROUND-155 DECLARATION_PRESENT with null declaration for binding ${contributionBinding.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      declaration.resource_readiness_observation_context_binding_key !==
        quantityBinding.resource_readiness_observation_context_binding_key ||
      declaration.resource_declaration_id !==
        quantityBinding.resource_declaration_id ||
      declaration.evaluation_at !==
        quantityBinding.raw_binding_evidence_assessment.evaluation_at ||
      declaration.observation_resource_requirement_key !==
        quantityBinding.observation_resource_requirement_key
    ) {
      throw new Error(
        `GROUND-157 malformed input: GROUND-155 declaration context inconsistent with GROUND-153 Binding`
      );
    }
  }
}

function buildRequiredAmountRelation(params: {
  declaration: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration;
  required_amount: ResourceRequirementAmount;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountRawRelation {
  const contribution = params.declaration.declared_potential_contribution_quantity;
  const contributionBounds = normalizeResourceQuantityClosedInterval(contribution);
  const requiredBounds = normalizeResourceQuantityClosedInterval(
    params.required_amount
  );
  const relation = deriveDeclaredPotentialContributionRawQuantityRelation({
    contribution,
    reference: params.required_amount,
  });

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountRawRelationKey(
      {
        physical_potential_contribution_declaration_key: params.declaration.key,
        contribution_canonical_key:
          resourceRequirementAmountCanonicalKey(contribution),
        required_amount_canonical_key: resourceRequirementAmountCanonicalKey(
          params.required_amount
        ),
        relation,
      }
    ),
    reference_kind: "REQUIRED_AMOUNT",
    declared_potential_contribution_quantity: contribution,
    contribution_lower_bound: contributionBounds.lower,
    contribution_upper_bound: contributionBounds.upper,
    required_amount: params.required_amount,
    required_amount_lower_bound: requiredBounds.lower,
    required_amount_upper_bound: requiredBounds.upper,
    relation,
  };
}

function buildCapacityRelationEntries(params: {
  declaration: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration;
  quantityBinding: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntry[] {
  const basis = params.quantityBinding.quantity_relation_basis;
  if (basis === null) {
    return [];
  }

  const contribution = params.declaration.declared_potential_contribution_quantity;
  const contributionBounds = normalizeResourceQuantityClosedInterval(contribution);
  const contributionCanonicalKey =
    resourceRequirementAmountCanonicalKey(contribution);

  const entries: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntry[] =
    basis.relation_entries.map((capacityEntry) => {
      const declared_capacity = capacityEntry.declared_capacity;
      const capacityBounds =
        normalizeResourceQuantityClosedInterval(declared_capacity);
      if (
        capacityBounds.lower !== capacityEntry.declared_capacity_lower_bound ||
        capacityBounds.upper !== capacityEntry.declared_capacity_upper_bound
      ) {
        throw new Error(
          `GROUND-157 malformed input: GROUND-153 capacity bounds mismatch for capacity declaration ${capacityEntry.capacity_declaration_id}`
        );
      }
      const relation = deriveDeclaredPotentialContributionRawQuantityRelation({
        contribution,
        reference: declared_capacity,
      });
      return {
        key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRawRelationEntryKey(
          {
            physical_potential_contribution_declaration_key:
              params.declaration.key,
            capacity_declaration_id: capacityEntry.capacity_declaration_id,
            contribution_canonical_key: contributionCanonicalKey,
            capacity_canonical_key:
              resourceCapacityCanonicalKey(declared_capacity),
            relation,
          }
        ),
        capacity_declaration_id: capacityEntry.capacity_declaration_id,
        resource_declaration_id: capacityEntry.resource_declaration_id,
        reference_kind: "DECLARED_CAPACITY",
        declared_potential_contribution_quantity: contribution,
        contribution_lower_bound: contributionBounds.lower,
        contribution_upper_bound: contributionBounds.upper,
        declared_capacity,
        declared_capacity_lower_bound: capacityBounds.lower,
        declared_capacity_upper_bound: capacityBounds.upper,
        relation,
      };
    });

  return entries.sort((a, b) =>
    compareStrings(a.capacity_declaration_id, b.capacity_declaration_id)
  );
}

function buildRawRelationBasis(params: {
  declaration: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration;
  quantityBinding: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment;
  required_amount: ResourceRequirementAmount;
  binding_context_key: string;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasis {
  const contribution_required_amount_relation = buildRequiredAmountRelation({
    declaration: params.declaration,
    required_amount: params.required_amount,
  });
  const contribution_capacity_relation_entries = buildCapacityRelationEntries({
    declaration: params.declaration,
    quantityBinding: params.quantityBinding,
  });
  const canonical_capacity_relation_entry_set_key =
    buildCanonicalCapacityRelationEntrySetKey(
      contribution_capacity_relation_entries
    );

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisKey(
      {
        candidate_key: params.declaration.candidate_key,
        observation_need_key: params.declaration.observation_need_key,
        capability_requirement_set_key:
          params.declaration.capability_requirement_set_key,
        observation_resource_requirement_key:
          params.declaration.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          params.declaration.resource_readiness_observation_context_binding_key,
        resource_declaration_id: params.declaration.resource_declaration_id,
        evaluation_at: params.declaration.evaluation_at,
        physical_potential_contribution_declaration_key:
          params.declaration.key,
        required_amount_relation_key: contribution_required_amount_relation.key,
        canonical_capacity_relation_entry_set_key,
      }
    ),
    candidate_key: params.declaration.candidate_key,
    observation_need_key: params.declaration.observation_need_key,
    capability_requirement_set_key:
      params.declaration.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      params.declaration.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      params.declaration.resource_readiness_observation_context_binding_key,
    resource_declaration_id: params.declaration.resource_declaration_id,
    resource_readiness_evaluation_instant_key:
      params.declaration.resource_readiness_evaluation_instant_key,
    evaluation_at: params.declaration.evaluation_at,
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      params.binding_context_key,
    physical_potential_contribution_declaration_key: params.declaration.key,
    declared_potential_contribution_quantity:
      params.declaration.declared_potential_contribution_quantity,
    contribution_required_amount_relation,
    contribution_capacity_relation_entries,
    capacity_relation_entry_count: contribution_capacity_relation_entries.length,
    has_capacity_relation_entries:
      contribution_capacity_relation_entries.length > 0,
  };
}

function assertBindingAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_PRESENT"
  ) {
    if (assessment.raw_relation_basis === null) {
      throw new Error(
        `GROUND-157 invariant violated: BASIS_PRESENT requires non-null basis for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_declared_potential_contribution_raw_relation_basis) {
      throw new Error(
        `GROUND-157 invariant violated: BASIS_PRESENT requires has_basis true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.capacity_relation_entry_count !==
      assessment.raw_relation_basis.contribution_capacity_relation_entries.length
    ) {
      throw new Error(
        `GROUND-157 invariant violated: capacity_relation_entry_count mismatch for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.raw_relation_basis !== null) {
    throw new Error(
      `GROUND-157 invariant violated: NO_DECLARATION requires null basis for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.has_declared_potential_contribution_raw_relation_basis) {
    throw new Error(
      `GROUND-157 invariant violated: NO_DECLARATION requires has_basis false for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.capacity_relation_entry_count !== 0) {
    throw new Error(
      `GROUND-157 invariant violated: NO_DECLARATION requires capacity_relation_entry_count 0 for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

export function assessAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBinding(
  contributionBinding: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
  quantityBinding: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment,
  quantityCandidate: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisEvalInput["resource_readiness_declared_capacity_required_amount_quantity_relation_set"]["candidate_assessments"][number]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment {
  assertBindingContextsMatch(contributionBinding, quantityBinding);

  const binding_context_key =
    contributionBinding.resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key;

  if (
    contributionBinding.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION" ||
    !contributionBinding.has_explicit_physical_potential_contribution_declaration
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment =
      {
        observation_resource_requirement_key:
          contributionBinding.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          contributionBinding.resource_readiness_observation_context_binding_key,
        resource_declaration_id: contributionBinding.resource_declaration_id,
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          binding_context_key,
        physical_potential_contribution_declaration_assessment:
          contributionBinding,
        quantity_relation_binding_assessment: quantityBinding,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION",
        raw_relation_basis: null,
        has_declared_potential_contribution_raw_relation_basis: false,
        capacity_relation_entry_count: 0,
        has_capacity_relation_entries: false,
      };
    assertBindingAssessmentInvariant(assessment);
    return assessment;
  }

  const declaration = contributionBinding.declaration!;
  const required_amount = resolveRequiredAmount({
    quantityBinding,
    quantityCandidate,
  });
  const raw_relation_basis = buildRawRelationBasis({
    declaration,
    quantityBinding,
    required_amount,
    binding_context_key,
  });

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment =
    {
      observation_resource_requirement_key:
        contributionBinding.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        contributionBinding.resource_readiness_observation_context_binding_key,
      resource_declaration_id: contributionBinding.resource_declaration_id,
      resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
        binding_context_key,
      physical_potential_contribution_declaration_assessment:
        contributionBinding,
      quantity_relation_binding_assessment: quantityBinding,
      status:
        "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_PRESENT",
      raw_relation_basis,
      has_declared_potential_contribution_raw_relation_basis: true,
      capacity_relation_entry_count:
        raw_relation_basis.capacity_relation_entry_count,
      has_capacity_relation_entries:
        raw_relation_basis.has_capacity_relation_entries,
    };
  assertBindingAssessmentInvariant(assessment);
  return assessment;
}

export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasis(
  quantityCandidate: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisEvalInput["resource_readiness_declared_capacity_required_amount_quantity_relation_set"]["candidate_assessments"][number],
  contributionCandidate: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisEvalInput["resource_readiness_physical_potential_contribution_declaration_set"]["candidate_assessments"][number]
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisAssessment {
  if (quantityCandidate.candidate_key !== contributionCandidate.candidate_key) {
    throw new Error(
      `GROUND-157 malformed input: candidate_key mismatch (${quantityCandidate.candidate_key} vs ${contributionCandidate.candidate_key})`
    );
  }

  const quantityByContext = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment
  >();
  for (const binding of quantityCandidate.binding_quantity_relation_assessments) {
    const contextKey =
      attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
        binding
      );
    if (quantityByContext.has(contextKey)) {
      throw new Error(
        `GROUND-157 invariant violated: duplicate GROUND-153 Binding context ${contextKey}`
      );
    }
    quantityByContext.set(contextKey, binding);
  }

  const binding_raw_relation_assessments: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment[] =
    [];

  for (const contributionBinding of contributionCandidate.binding_potential_contribution_declaration_assessments) {
    const contextKey =
      contributionBinding.resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key;
    const quantityBinding = quantityByContext.get(contextKey);
    if (quantityBinding === undefined) {
      throw new Error(
        `GROUND-157 malformed input: GROUND-155 Binding context ${contextKey} not found in GROUND-153 set`
      );
    }
    binding_raw_relation_assessments.push(
      assessAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBinding(
        contributionBinding,
        quantityBinding,
        quantityCandidate
      )
    );
  }

  if (
    binding_raw_relation_assessments.length !==
    quantityCandidate.binding_quantity_relation_assessments.length
  ) {
    throw new Error(
      `GROUND-157 malformed input: GROUND-155 Binding count ${binding_raw_relation_assessments.length} != GROUND-153 Binding count ${quantityCandidate.binding_quantity_relation_assessments.length} for candidate ${quantityCandidate.candidate_key}`
    );
  }

  const requirement_raw_relation_assessments: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationRequirementAssessment[] =
    contributionCandidate.requirement_potential_contribution_declaration_assessments.map(
      (requirementAssessment) => {
        const binding_assessments = binding_raw_relation_assessments.filter(
          (assessment) =>
            assessment.observation_resource_requirement_key ===
            requirementAssessment.observation_resource_requirement_key
        );
        return {
          observation_resource_requirement_key:
            requirementAssessment.observation_resource_requirement_key,
          binding_raw_relation_assessments: binding_assessments,
          has_declared_potential_contribution_raw_relation_bases:
            binding_assessments.some(
              (assessment) =>
                assessment.has_declared_potential_contribution_raw_relation_basis
            ),
          has_capacity_relation_entries: binding_assessments.some(
            (assessment) => assessment.has_capacity_relation_entries
          ),
        };
      }
    );

  return {
    candidate_key: quantityCandidate.candidate_key,
    resource_readiness_declared_capacity_required_amount_quantity_relation_assessment:
      quantityCandidate,
    resource_readiness_physical_potential_contribution_declaration_assessment:
      contributionCandidate,
    requirement_raw_relation_assessments,
    binding_raw_relation_assessments,
    has_declared_potential_contribution_raw_relation_bases:
      binding_raw_relation_assessments.some(
        (assessment) =>
          assessment.has_declared_potential_contribution_raw_relation_basis
      ),
    has_capacity_relation_entries: binding_raw_relation_assessments.some(
      (assessment) => assessment.has_capacity_relation_entries
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Declared Potential Contribution Raw Relation Basis.
 * Preserves GROUND-155 Candidate / Binding order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSetAssessment {
  const quantityByCandidate = new Map(
    input.resource_readiness_declared_capacity_required_amount_quantity_relation_set.candidate_assessments.map(
      (candidate) => [candidate.candidate_key, candidate] as const
    )
  );

  const candidate_assessments =
    input.resource_readiness_physical_potential_contribution_declaration_set.candidate_assessments.map(
      (contributionCandidate) => {
        const quantityCandidate = quantityByCandidate.get(
          contributionCandidate.candidate_key
        );
        if (quantityCandidate === undefined) {
          throw new Error(
            `GROUND-157 malformed input: GROUND-155 candidate ${contributionCandidate.candidate_key} not found in GROUND-153 set`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasis(
          quantityCandidate,
          contributionCandidate
        );
      }
    );

  if (
    candidate_assessments.length !==
    input.resource_readiness_declared_capacity_required_amount_quantity_relation_set
      .candidate_assessments.length
  ) {
    throw new Error(
      `GROUND-157 malformed input: GROUND-155 candidate count != GROUND-153 candidate count`
    );
  }

  return {
    resource_readiness_declared_capacity_required_amount_quantity_relation_set:
      input.resource_readiness_declared_capacity_required_amount_quantity_relation_set,
    resource_readiness_physical_potential_contribution_declaration_set:
      input.resource_readiness_physical_potential_contribution_declaration_set,
    candidate_assessments,
    has_declared_potential_contribution_raw_relation_bases:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_declared_potential_contribution_raw_relation_bases
      ),
    has_capacity_relation_entries: candidate_assessments.some(
      (assessment) => assessment.has_capacity_relation_entries
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
