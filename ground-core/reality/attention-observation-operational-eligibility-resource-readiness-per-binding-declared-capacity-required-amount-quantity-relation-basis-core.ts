/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Per-binding RESOURCE_READINESS Declared Capacity–Required Amount
 * Quantity Relation Basis (GROUND-153).
 *
 * Pure physical-quantity branch derivation from GROUND-135 only.
 * GROUND-135 nests GROUND-132 required_amount, GROUND-133 Binding,
 * GROUND-134 evaluation instant, and GROUND-022 ResourceAssessment capacity.
 *
 * Must not import GROUND-137–151, Reservation, Commitment, Feasibility,
 * Permission, Authority, or OE semantics.
 *
 * Declared capacity ≠ available / free / usable / contribution
 * Interval relation ≠ SUFFICIENT / INSUFFICIENT / RESOURCE_READY
 * Binding ≠ physical contribution
 * No cross-binding summation / fungibility / unit conversion
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntry,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasis,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisStatus,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationRequirementAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis-types.js";
import type {
  ResourceCapacity,
  ResourceRequirementAmount,
  ResourceScope,
} from "../types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PER_BINDING_DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisModelLimitation[] =
  [
    "DECLARED_CAPACITY_IS_NOT_CURRENT_AVAILABLE_QUANTITY",
    "DECLARED_CAPACITY_IS_NOT_RESERVATION_AWARE_FREE_QUANTITY",
    "RESOURCE_AVAILABILITY_IS_NOT_A_NUMERICAL_QUANTITY",
    "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED",
    "RESOURCE_UNIT_CONVERSION_NOT_MODELED",
    "RESOURCE_SCOPE_HIERARCHY_NOT_MODELED",
    "PHYSICAL_RESOURCE_CONTRIBUTION_SEMANTICS_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "CROSS_BINDING_QUANTITY_SUMMATION_NOT_MODELED",
    "OBSERVATION_RESOURCE_RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "SHARED_RESOURCE_SIMULTANEOUS_SATISFIABILITY_NOT_MODELED",
    "PHYSICAL_RESOURCE_COMPOSITION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const TEMPORAL_ACTIVE =
  "CAPACITY_DECLARATION_ACTIVE_AT_EVALUATION_INSTANT" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number`);
  }
}

/**
 * Normalize POINT/RANGE into a closed interval [lower, upper].
 * Does not mutate the source amount/capacity object.
 */
export function normalizeResourceQuantityClosedInterval(
  amount: ResourceRequirementAmount | ResourceCapacity
): { lower: number; upper: number } {
  if (amount.kind === "POINT") {
    assertFiniteNumber(amount.value, "POINT value");
    return { lower: amount.value, upper: amount.value };
  }
  assertFiniteNumber(amount.min, "RANGE min");
  assertFiniteNumber(amount.max, "RANGE max");
  if (amount.min > amount.max) {
    throw new Error("RANGE min must be <= max");
  }
  return { lower: amount.min, upper: amount.max };
}

export function resourceRequirementAmountCanonicalKey(
  amount: ResourceRequirementAmount
): string {
  if (amount.kind === "POINT") {
    return `POINT|${amount.value}`;
  }
  return `RANGE|${amount.min}|${amount.max}`;
}

export function resourceCapacityCanonicalKey(capacity: ResourceCapacity): string {
  if (capacity.kind === "POINT") {
    return `POINT|${capacity.value}`;
  }
  return `RANGE|${capacity.min}|${capacity.max}`;
}

/**
 * Exhaustive mutually exclusive closed-interval topology classifier.
 * Never encodes sufficiency / readiness / contribution.
 */
export function deriveDeclaredCapacityRequiredAmountQuantityRelation(params: {
  required_amount: ResourceRequirementAmount;
  declared_capacity: ResourceCapacity;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelation {
  const required = normalizeResourceQuantityClosedInterval(
    params.required_amount
  );
  const capacity = normalizeResourceQuantityClosedInterval(
    params.declared_capacity
  );
  const cL = capacity.lower;
  const cU = capacity.upper;
  const rL = required.lower;
  const rU = required.upper;

  if (cU < rL) {
    return "DECLARED_CAPACITY_INTERVAL_STRICTLY_BELOW_REQUIRED_AMOUNT_INTERVAL";
  }
  if (cL > rU) {
    return "DECLARED_CAPACITY_INTERVAL_STRICTLY_ABOVE_REQUIRED_AMOUNT_INTERVAL";
  }
  if (cL === rL && cU === rU) {
    return "DECLARED_CAPACITY_INTERVAL_EXACTLY_EQUALS_REQUIRED_AMOUNT_INTERVAL";
  }
  if (rL <= cL && cU <= rU) {
    return "DECLARED_CAPACITY_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REQUIRED_AMOUNT_INTERVAL";
  }
  if (cL <= rL && rU <= cU) {
    return "DECLARED_CAPACITY_INTERVAL_STRICTLY_CONTAINS_REQUIRED_AMOUNT_INTERVAL";
  }
  return "DECLARED_CAPACITY_INTERVAL_PARTIALLY_OVERLAPS_REQUIRED_AMOUNT_INTERVAL";
}

export function attentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntryKey(params: {
  capacity_declaration_id: string;
  resource_declaration_id: string;
  required_amount_canonical_key: string;
  declared_capacity_canonical_key: string;
  unit: string;
  relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelation;
  temporal_basis: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-capacity-required-amount-quantity-relation-entry",
    params.capacity_declaration_id,
    params.resource_declaration_id,
    params.required_amount_canonical_key,
    params.declared_capacity_canonical_key,
    params.unit,
    params.relation,
    params.temporal_basis,
  ].join("|");
}

function buildCanonicalCapacityRelationEntrySetKey(
  entries: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntry[]
): string {
  return entries
    .map((entry) => entry.key)
    .slice()
    .sort(compareStrings)
    .join(",") || "NONE";
}

export function attentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  required_amount_canonical_key: string;
  canonical_capacity_relation_entry_set_key: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-per-binding-declared-capacity-required-amount-quantity-relation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.evaluation_at,
    params.required_amount_canonical_key,
    params.canonical_capacity_relation_entry_set_key,
  ].join("|");
}

function assertBindingAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment
): void {
  if (
    assessment.status ===
    "DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_PRESENT"
  ) {
    if (assessment.quantity_relation_basis === null) {
      throw new Error(
        `GROUND-153 invariant violated: BASIS_PRESENT requires non-null basis for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      !assessment.has_declared_capacity_required_amount_quantity_relation_basis
    ) {
      throw new Error(
        `GROUND-153 invariant violated: BASIS_PRESENT requires has_basis true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.relation_entry_count < 1) {
      throw new Error(
        `GROUND-153 invariant violated: BASIS_PRESENT requires >=1 relation entry for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.relation_entry_count !==
      assessment.quantity_relation_basis.relation_entries.length
    ) {
      throw new Error(
        `GROUND-153 invariant violated: relation_entry_count mismatch for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.quantity_relation_basis !== null) {
    throw new Error(
      `GROUND-153 invariant violated: non-present status requires null basis for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.has_declared_capacity_required_amount_quantity_relation_basis) {
    throw new Error(
      `GROUND-153 invariant violated: non-present status requires has_basis false for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.relation_entry_count !== 0) {
    throw new Error(
      `GROUND-153 invariant violated: non-present status requires relation_entry_count 0 for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

function buildRelationEntry(params: {
  capacity_declaration_id: string;
  resource_declaration_id: string;
  required_amount: ResourceRequirementAmount;
  declared_capacity: ResourceCapacity;
  unit: string;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntry {
  const requiredBounds = normalizeResourceQuantityClosedInterval(
    params.required_amount
  );
  const capacityBounds = normalizeResourceQuantityClosedInterval(
    params.declared_capacity
  );
  const relation = deriveDeclaredCapacityRequiredAmountQuantityRelation({
    required_amount: params.required_amount,
    declared_capacity: params.declared_capacity,
  });
  const required_amount_canonical_key = resourceRequirementAmountCanonicalKey(
    params.required_amount
  );
  const declared_capacity_canonical_key = resourceCapacityCanonicalKey(
    params.declared_capacity
  );

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntryKey(
      {
        capacity_declaration_id: params.capacity_declaration_id,
        resource_declaration_id: params.resource_declaration_id,
        required_amount_canonical_key,
        declared_capacity_canonical_key,
        unit: params.unit,
        relation,
        temporal_basis: TEMPORAL_ACTIVE,
      }
    ),
    capacity_declaration_id: params.capacity_declaration_id,
    resource_declaration_id: params.resource_declaration_id,
    required_amount: params.required_amount,
    required_amount_lower_bound: requiredBounds.lower,
    required_amount_upper_bound: requiredBounds.upper,
    declared_capacity: params.declared_capacity,
    declared_capacity_lower_bound: capacityBounds.lower,
    declared_capacity_upper_bound: capacityBounds.upper,
    unit: params.unit,
    relation,
    temporal_basis: TEMPORAL_ACTIVE,
  };
}

function buildQuantityRelationBasis(params: {
  raw: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment;
  resource_key: string;
  unit: string;
  resource_scope: ResourceScope;
  required_amount: ResourceRequirementAmount;
  relation_entries: AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntry[];
}): AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasis {
  const sortedEntries = [...params.relation_entries].sort((a, b) =>
    compareStrings(a.capacity_declaration_id, b.capacity_declaration_id)
  );
  const required_amount_canonical_key = resourceRequirementAmountCanonicalKey(
    params.required_amount
  );
  const canonical_capacity_relation_entry_set_key =
    buildCanonicalCapacityRelationEntrySetKey(sortedEntries);

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisKey(
      {
        candidate_key: params.raw.candidate_key,
        observation_need_key: params.raw.observation_need_key,
        capability_requirement_set_key:
          params.raw.capability_requirement_set_key,
        observation_resource_requirement_key:
          params.raw.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          params.raw.resource_readiness_observation_context_binding_key,
        resource_declaration_id: params.raw.resource_declaration_id,
        evaluation_at: params.raw.evaluation_at,
        required_amount_canonical_key,
        canonical_capacity_relation_entry_set_key,
      }
    ),
    candidate_key: params.raw.candidate_key,
    observation_need_key: params.raw.observation_need_key,
    capability_requirement_set_key: params.raw.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      params.raw.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      params.raw.resource_readiness_observation_context_binding_key,
    resource_declaration_id: params.raw.resource_declaration_id,
    resource_readiness_evaluation_instant_key:
      params.raw.resource_readiness_evaluation_instant_key,
    evaluation_at: params.raw.evaluation_at,
    resource_key: params.resource_key,
    unit: params.unit,
    resource_scope: params.resource_scope,
    required_amount: params.required_amount,
    requirement_temporal_relation: params.raw.requirement_temporal_relation,
    relation_entries: sortedEntries,
  };
}

function emptyBindingAssessment(
  raw: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment,
  status: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisStatus
): AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment {
  const assessment: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment =
    {
      observation_resource_requirement_key:
        raw.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        raw.resource_readiness_observation_context_binding_key,
      resource_declaration_id: raw.resource_declaration_id,
      raw_binding_evidence_assessment: raw,
      status,
      quantity_relation_basis: null,
      has_declared_capacity_required_amount_quantity_relation_basis: false,
      relation_entry_count: 0,
    };
  assertBindingAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Pure per-binding declared-capacity ↔ required_amount assessment.
 * Uses GROUND-135 nested requirement / relation / ResourceAssessment only.
 */
export function assessAttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelation(
  raw: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment,
  required_amount: ResourceRequirementAmount,
  resource_key: string,
  unit: string,
  resource_scope: ResourceScope
): AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment {
  if (
    raw.resource_declaration_lookup_status ===
    "BOUND_RESOURCE_DECLARATION_NOT_FOUND"
  ) {
    return emptyBindingAssessment(
      raw,
      "BOUND_RESOURCE_DECLARATION_NOT_FOUND"
    );
  }

  if (
    raw.requirement_temporal_relation ===
    "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT"
  ) {
    return emptyBindingAssessment(
      raw,
      "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT"
    );
  }

  if (
    raw.resource_key_relation !== "RESOURCE_KEY_EXACT_MATCH" ||
    raw.resource_key_relation === null
  ) {
    return emptyBindingAssessment(
      raw,
      "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_RESOURCE_KEY_NOT_EXACT"
    );
  }

  if (
    raw.resource_unit_relation !== "RESOURCE_UNIT_EXACT_MATCH" ||
    raw.resource_unit_relation === null
  ) {
    return emptyBindingAssessment(
      raw,
      "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_UNIT_NOT_EXACT"
    );
  }

  if (
    raw.resource_scope_relation !== "RESOURCE_SCOPE_EXACT_MATCH" ||
    raw.resource_scope_relation === null
  ) {
    return emptyBindingAssessment(
      raw,
      "REQUIRED_AMOUNT_AND_DECLARED_CAPACITY_NOT_COMPARABLE_SCOPE_NOT_EXACT"
    );
  }

  if (raw.resource_assessment === null) {
    throw new Error(
      `GROUND-153 invariant violated: FOUND declaration requires ResourceAssessment for binding ${raw.resource_readiness_observation_context_binding_key}`
    );
  }

  const capacityAssessment = raw.resource_assessment.capacity;
  if (
    capacityAssessment.status === "NO_ACTIVE_CAPACITY_DECLARATIONS" ||
    capacityAssessment.capacity_declaration_ids.length === 0
  ) {
    return emptyBindingAssessment(
      raw,
      "NO_CURRENT_APPLICABLE_DECLARED_CAPACITY"
    );
  }

  if (
    capacityAssessment.capacity_declaration_ids.length !==
    capacityAssessment.capacities.length
  ) {
    throw new Error(
      `GROUND-153 invariant violated: capacity_declaration_ids/capacities length mismatch for ResourceDeclaration ${raw.resource_declaration_id}`
    );
  }

  const relation_entries: AttentionObservationOperationalEligibilityResourceReadinessDeclaredCapacityRequiredAmountQuantityRelationEntry[] =
    [];

  for (let index = 0; index < capacityAssessment.capacities.length; index += 1) {
    const capacity_declaration_id =
      capacityAssessment.capacity_declaration_ids[index]!;
    const declared_capacity = capacityAssessment.capacities[index]!;
    relation_entries.push(
      buildRelationEntry({
        capacity_declaration_id,
        resource_declaration_id: raw.resource_declaration_id,
        required_amount,
        declared_capacity,
        unit,
      })
    );
  }

  const quantity_relation_basis = buildQuantityRelationBasis({
    raw,
    resource_key,
    unit,
    resource_scope,
    required_amount,
    relation_entries,
  });

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment =
    {
      observation_resource_requirement_key:
        raw.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        raw.resource_readiness_observation_context_binding_key,
      resource_declaration_id: raw.resource_declaration_id,
      raw_binding_evidence_assessment: raw,
      status:
        "DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_PRESENT",
      quantity_relation_basis,
      has_declared_capacity_required_amount_quantity_relation_basis: true,
      relation_entry_count: quantity_relation_basis.relation_entries.length,
    };
  assertBindingAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Quantity Relation assessment over GROUND-135 bindings.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasis(
  rawCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisAssessment {
  const binding_quantity_relation_assessments: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBindingAssessment[] =
    [];

  for (const requirementAssessment of rawCandidate.requirement_raw_evidence_assessments) {
    const requirement = requirementAssessment.resource_requirement;
    for (const rawBinding of requirementAssessment.raw_binding_evidence_assessments) {
      binding_quantity_relation_assessments.push(
        assessAttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelation(
          rawBinding,
          requirement.required_amount,
          requirement.resource_key,
          requirement.unit,
          requirement.resource_scope
        )
      );
    }
  }

  const requirement_quantity_relation_assessments: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationRequirementAssessment[] =
    rawCandidate.requirement_raw_evidence_assessments.map(
      (requirementAssessment) => {
        const binding_assessments =
          binding_quantity_relation_assessments.filter(
            (assessment) =>
              assessment.observation_resource_requirement_key ===
              requirementAssessment.observation_resource_requirement_key
          );
        return {
          observation_resource_requirement_key:
            requirementAssessment.observation_resource_requirement_key,
          binding_quantity_relation_assessments: binding_assessments,
          has_declared_capacity_required_amount_quantity_relation_bases:
            binding_assessments.some(
              (assessment) =>
                assessment.has_declared_capacity_required_amount_quantity_relation_basis
            ),
        };
      }
    );

  return {
    candidate_key: rawCandidate.candidate_key,
    resource_readiness_raw_evidence_assessment: rawCandidate,
    requirement_quantity_relation_assessments,
    binding_quantity_relation_assessments,
    has_declared_capacity_required_amount_quantity_relation_bases:
      binding_quantity_relation_assessments.some(
        (assessment) =>
          assessment.has_declared_capacity_required_amount_quantity_relation_basis
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PER_BINDING_DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Quantity Relation Basis. Preserves GROUND-135 Candidate order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasisSetAssessment {
  const candidate_assessments =
    input.resource_readiness_raw_evidence_assessment_set.candidate_assessments.map(
      (rawCandidate) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessPerBindingDeclaredCapacityRequiredAmountQuantityRelationBasis(
          rawCandidate
        )
    );

  return {
    resource_readiness_raw_evidence_assessment_set:
      input.resource_readiness_raw_evidence_assessment_set,
    candidate_assessments,
    has_declared_capacity_required_amount_quantity_relation_bases:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_declared_capacity_required_amount_quantity_relation_bases
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_PER_BINDING_DECLARED_CAPACITY_REQUIRED_AMOUNT_QUANTITY_RELATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
