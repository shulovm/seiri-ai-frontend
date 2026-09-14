import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Explicit Per-binding RESOURCE_READINESS Physical Potential Contribution
 * Declaration (GROUND-155).
 *
 * Pure physical-branch derivation from:
 *   GROUND-153 Quantity Relation Binding context
 *   + explicit Potential Contribution Specification
 *
 * Must not import GROUND-137–151, Reservation, Commitment, Feasibility,
 * Permission, Authority, or OE semantics.
 *
 * Must not derive contribution from capacity / required_amount.
 * Must not invent zero-to-capacity intervals or capacity/required_amount auto-fill.
 * Declaration ≠ verified / effective / free / allocated / ready.
 */

import {
  resourceRequirementAmountCanonicalKey,
} from "./attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionSpecification,
} from "./attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.js";
import type { ResourceRequirementAmount } from "../types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationModelLimitation[] =
  [
    "DECLARED_POTENTIAL_CONTRIBUTION_IS_NOT_VERIFIED_PHYSICAL_CONTRIBUTION",
    "DECLARED_CAPACITY_TO_POTENTIAL_CONTRIBUTION_CONSISTENCY_NOT_MODELED",
    "REQUIRED_AMOUNT_TO_POTENTIAL_CONTRIBUTION_CONSISTENCY_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED",
    "RESOURCE_CAPACITY_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "RESOURCE_QUALITY_COMPATIBILITY_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_INCLUDED",
    "RESERVATION_AWARE_EFFECTIVE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_PHYSICAL_CONTRIBUTION_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED",
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

/**
 * Stable exact GROUND-153 Binding physical context identity.
 * Independent of capacity-relation Basis presence / relation entries.
 */
export function attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-binding-context",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
  ].join("|");
}

export function attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
  binding: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment
): string {
  const raw = binding.raw_binding_evidence_assessment;
  return attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKey(
    {
      candidate_key: raw.candidate_key,
      observation_need_key: raw.observation_need_key,
      capability_requirement_set_key: raw.capability_requirement_set_key,
      observation_resource_requirement_key:
        binding.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        binding.resource_readiness_observation_context_binding_key,
      resource_declaration_id: binding.resource_declaration_id,
      evaluation_at: raw.evaluation_at,
    }
  );
}

export function attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  declared_potential_contribution_quantity_canonical_key: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.declared_potential_contribution_quantity_canonical_key,
  ].join("|");
}

/**
 * Structural validation only — mirrors Observation Resource Requirement amount rules.
 * Zero is not legal for ResourceRequirementAmount POINT/RANGE reuse.
 */
export function assertDeclaredPotentialContributionQuantity(
  amount: ResourceRequirementAmount
): ResourceRequirementAmount {
  if (amount == null || typeof amount !== "object" || !("kind" in amount)) {
    throw new Error(
      "declared_potential_contribution_quantity must be POINT or RANGE"
    );
  }
  if (amount.kind === "POINT") {
    if (!Number.isFinite(amount.value) || amount.value <= 0) {
      throw new Error(
        "POINT declared_potential_contribution_quantity must be a finite number greater than 0"
      );
    }
    return { kind: "POINT", value: amount.value };
  }
  if (amount.kind === "RANGE") {
    if (
      !Number.isFinite(amount.min) ||
      !Number.isFinite(amount.max) ||
      amount.min < 0 ||
      amount.min > amount.max ||
      amount.max <= 0
    ) {
      throw new Error(
        "RANGE declared_potential_contribution_quantity must be finite with 0 <= min <= max and max > 0"
      );
    }
    return { kind: "RANGE", min: amount.min, max: amount.max };
  }
  throw new Error(
    "declared_potential_contribution_quantity.kind must be POINT or RANGE"
  );
}

function resourceRequirementAmountsSemanticallyEqual(
  a: ResourceRequirementAmount,
  b: ResourceRequirementAmount
): boolean {
  return (
    resourceRequirementAmountCanonicalKey(a) ===
    resourceRequirementAmountCanonicalKey(b)
  );
}

function indexBindingContexts(
  quantityRelationSet: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationEvalInput["resource_readiness_declared_capacity_required_amount_quantity_relation_set"]
): Map<
  string,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment
> {
  const index = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment
  >();

  for (const candidate of quantityRelationSet.candidate_assessments) {
    for (const binding of candidate.binding_quantity_relation_assessments) {
      const contextKey =
        attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
          binding
        );
      if (index.has(contextKey)) {
        throw new Error(
          `GROUND-155 invariant violated: duplicate Binding physical context key ${contextKey}`
        );
      }
      index.set(contextKey, binding);
    }
  }

  return index;
}

function resolveSpecificationDeclarations(
  specification: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionSpecification,
  contextIndex: Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment
  >
): Map<string, ResourceRequirementAmount> {
  const resolved = new Map<string, ResourceRequirementAmount>();

  for (const entry of specification.declarations) {
    const contextKey =
      entry.resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key;
    if (!contextIndex.has(contextKey)) {
      throw new Error(
        `GROUND-155 unknown or stale Binding physical context key: ${contextKey}`
      );
    }

    const quantity = assertDeclaredPotentialContributionQuantity(
      entry.declared_potential_contribution_quantity
    );

    const existing = resolved.get(contextKey);
    if (existing !== undefined) {
      if (!resourceRequirementAmountsSemanticallyEqual(existing, quantity)) {
        throw new Error(
          `GROUND-155 conflicting declared potential contribution quantities for Binding physical context ${contextKey}`
        );
      }
      continue;
    }

    resolved.set(contextKey, quantity);
  }

  return resolved;
}

function buildDeclaration(params: {
  binding: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment;
  binding_context_key: string;
  declared_potential_contribution_quantity: ResourceRequirementAmount;
}): AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration {
  const raw = params.binding.raw_binding_evidence_assessment;
  const quantity = params.declared_potential_contribution_quantity;
  const quantityCanonicalKey = resourceRequirementAmountCanonicalKey(quantity);

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationKey(
      {
        candidate_key: raw.candidate_key,
        observation_need_key: raw.observation_need_key,
        capability_requirement_set_key: raw.capability_requirement_set_key,
        observation_resource_requirement_key:
          params.binding.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          params.binding.resource_readiness_observation_context_binding_key,
        resource_declaration_id: params.binding.resource_declaration_id,
        evaluation_at: raw.evaluation_at,
        declared_potential_contribution_quantity_canonical_key:
          quantityCanonicalKey,
      }
    ),
    candidate_key: raw.candidate_key,
    observation_need_key: raw.observation_need_key,
    capability_requirement_set_key: raw.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      params.binding.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      params.binding.resource_readiness_observation_context_binding_key,
    resource_declaration_id: params.binding.resource_declaration_id,
    resource_readiness_evaluation_instant_key:
      raw.resource_readiness_evaluation_instant_key,
    evaluation_at: raw.evaluation_at,
    declared_potential_contribution_quantity: quantity,
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      params.binding_context_key,
  };
}

function assertBindingAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT"
  ) {
    if (assessment.declaration === null) {
      throw new Error(
        `GROUND-155 invariant violated: DECLARATION_PRESENT requires non-null declaration for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_explicit_physical_potential_contribution_declaration) {
      throw new Error(
        `GROUND-155 invariant violated: DECLARATION_PRESENT requires has_declaration true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.declaration !== null) {
    throw new Error(
      `GROUND-155 invariant violated: NO_DECLARATION requires null declaration for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.has_explicit_physical_potential_contribution_declaration) {
    throw new Error(
      `GROUND-155 invariant violated: NO_DECLARATION requires has_declaration false for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

export function assessAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBinding(
  binding: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment,
  resolvedDeclarations: Map<string, ResourceRequirementAmount>
): AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment {
  const binding_context_key =
    attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionBindingContextKeyFromQuantityRelationBindingAssessment(
      binding
    );
  const quantity = resolvedDeclarations.get(binding_context_key);

  if (quantity === undefined) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment =
      {
        observation_resource_requirement_key:
          binding.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          binding.resource_readiness_observation_context_binding_key,
        resource_declaration_id: binding.resource_declaration_id,
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          binding_context_key,
        quantity_relation_binding_assessment: binding,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION",
        declaration: null,
        has_explicit_physical_potential_contribution_declaration: false,
      };
    assertBindingAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment =
    {
      observation_resource_requirement_key:
        binding.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        binding.resource_readiness_observation_context_binding_key,
      resource_declaration_id: binding.resource_declaration_id,
      resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
        binding_context_key,
      quantity_relation_binding_assessment: binding,
      status:
        "EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT",
      declaration: buildDeclaration({
        binding,
        binding_context_key,
        declared_potential_contribution_quantity: quantity,
      }),
      has_explicit_physical_potential_contribution_declaration: true,
    };
  assertBindingAssessmentInvariant(assessment);
  return assessment;
}

export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration(
  quantityRelationCandidate: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationEvalInput["resource_readiness_declared_capacity_required_amount_quantity_relation_set"]["candidate_assessments"][number],
  resolvedDeclarations: Map<string, ResourceRequirementAmount>
): AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment {
  const binding_potential_contribution_declaration_assessments =
    quantityRelationCandidate.binding_quantity_relation_assessments.map(
      (binding) =>
        assessAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBinding(
          binding,
          resolvedDeclarations
        )
    );

  const requirement_potential_contribution_declaration_assessments: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationRequirementAssessment[] =
    quantityRelationCandidate.requirement_quantity_relation_assessments.map(
      (requirementAssessment) => {
        const binding_assessments =
          binding_potential_contribution_declaration_assessments.filter(
            (assessment) =>
              assessment.observation_resource_requirement_key ===
              requirementAssessment.observation_resource_requirement_key
          );
        return {
          observation_resource_requirement_key:
            requirementAssessment.observation_resource_requirement_key,
          binding_potential_contribution_declaration_assessments:
            binding_assessments,
          has_explicit_physical_potential_contribution_declarations:
            binding_assessments.some(
              (assessment) =>
                assessment.has_explicit_physical_potential_contribution_declaration
            ),
        };
      }
    );

  return {
    candidate_key: quantityRelationCandidate.candidate_key,
    resource_readiness_declared_capacity_required_amount_quantity_relation_assessment:
      quantityRelationCandidate,
    requirement_potential_contribution_declaration_assessments,
    binding_potential_contribution_declaration_assessments,
    has_explicit_physical_potential_contribution_declarations:
      binding_potential_contribution_declaration_assessments.some(
        (assessment) =>
          assessment.has_explicit_physical_potential_contribution_declaration
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Potential Contribution Declaration foundation.
 * Preserves GROUND-153 Candidate / Binding order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment {
  const contextIndex = indexBindingContexts(
    input.resource_readiness_declared_capacity_required_amount_quantity_relation_set
  );
  const resolvedDeclarations = resolveSpecificationDeclarations(
    input.specification,
    contextIndex
  );

  const candidate_assessments =
    input.resource_readiness_declared_capacity_required_amount_quantity_relation_set.candidate_assessments.map(
      (candidate) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration(
          candidate,
          resolvedDeclarations
        )
    );

  return {
    resource_readiness_declared_capacity_required_amount_quantity_relation_set:
      input.resource_readiness_declared_capacity_required_amount_quantity_relation_set,
    specification: input.specification,
    candidate_assessments,
    has_explicit_physical_potential_contribution_declarations:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_physical_potential_contribution_declarations
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_MODEL_LIMITATIONS,
    ],
  };
}
