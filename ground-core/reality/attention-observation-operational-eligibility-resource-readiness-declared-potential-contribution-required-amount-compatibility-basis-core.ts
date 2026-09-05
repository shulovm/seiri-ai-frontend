/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Deterministic POINT-STOCK Declared Potential Contribution
 * Required-Amount Compatibility Relation Basis (GROUND-174).
 *
 * Pure composition of:
 *   GROUND-157 Raw Relation Basis Set
 *   + GROUND-171 Required Amount Semantic Declaration Set
 *   + GROUND-173 Contribution Quantity-Kind Semantic Declaration Set
 *
 * No arbitrary Interpretation Policy.
 * Does NOT recompute interval topology from quantities.
 * Does NOT emit Requirement Satisfaction / verification / Resource Ready.
 *
 * Must not import GROUND-169/168/167/166/165/164/163/161/159,
 * Availability, Reservation, or project persistence.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-types.js";
import type {
  AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment,
  AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment,
  AttentionObservationResourceRequiredAmountSemanticDeclarationSetAssessment,
} from "./attention-observation-resource-required-amount-semantic-declaration-types.js";
import type {
  AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSetAssessment,
} from "./attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasis,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisStatus,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilitySupportedRawRelation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilitySupportedRole,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-compatibility-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisModelLimitation[] =
  [
    "TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
    "POTENTIAL_CONTRIBUTION_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "FLOW_TIME_BASIS_NOT_MODELED",
    "FLOW_INTEGRATION_WINDOW_NOT_MODELED",
    "CANONICAL_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_STATE_NOT_MODELED",
    "REQUIREMENT_SATISFACTION_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
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

const RAW_BELOW =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL" as const;
const RAW_EQUALS =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL" as const;
const RAW_ABOVE =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL" as const;

const SUPPORTING =
  "SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE" as const;
const CONTRADICTING =
  "CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE" as const;

const UNRESOLVED_REASON_PRECEDENCE: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[] =
  [
    "NO_EXPLICIT_CONTRIBUTION_QUANTITY_KIND_DECLARATION",
    "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
    "CONTRIBUTION_QUANTITY_KIND_UNDECLARED",
    "REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED",
    "CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH",
    "CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
    "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
    "TARGET_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
  ];

const UNRESOLVED_REASON_TO_STATUS: Record<
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisStatus
> = {
  NO_EXPLICIT_CONTRIBUTION_QUANTITY_KIND_DECLARATION:
    "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION",
  NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION:
    "UNRESOLVED_NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
  CONTRIBUTION_QUANTITY_KIND_UNDECLARED:
    "UNRESOLVED_CONTRIBUTION_QUANTITY_KIND_UNDECLARED",
  REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED:
    "UNRESOLVED_REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED",
  CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH:
    "UNRESOLVED_CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH",
  CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED:
    "UNRESOLVED_CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
  REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED:
    "UNRESOLVED_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
  TARGET_ACCEPTANCE_SEMANTICS_NOT_MODELED:
    "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
  FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED:
    "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
};

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUnresolvedReasons(
  reasons: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[] {
  return [...new Set(reasons)].sort((a, b) => {
    const ia = UNRESOLVED_REASON_PRECEDENCE.indexOf(a);
    const ib = UNRESOLVED_REASON_PRECEDENCE.indexOf(b);
    if (ia !== ib) return ia - ib;
    return compareStrings(a, b);
  });
}

function primaryUnresolvedStatus(
  reasons: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisStatus {
  const sorted = sortUnresolvedReasons(reasons);
  if (sorted.length === 0) {
    throw new Error("GROUND-174 invariant violated: primary unresolved status requires reasons");
  }
  return UNRESOLVED_REASON_TO_STATUS[sorted[0]!];
}

/**
 * Conceptual identity:
 * ...required-amount-compatibility-basis|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|evaluationAt|
 * ground155ContributionKey|ground173KindDeclarationKey|ground171RequiredAmountDeclarationKey|
 * rawRelationBasisKey|contributionKind|requiredKind|amountRole|rawRelation|interpretation
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  physical_potential_contribution_declaration_key: string;
  contribution_quantity_kind_semantic_declaration_key: string;
  required_amount_semantic_declaration_key: string;
  raw_relation_basis_key: string;
  contribution_quantity_kind: "STOCK_QUANTITY";
  required_amount_quantity_kind: "STOCK_QUANTITY";
  required_amount_role: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilitySupportedRole;
  contribution_required_amount_relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilitySupportedRawRelation;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-compatibility-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.evaluation_at,
    params.physical_potential_contribution_declaration_key,
    params.contribution_quantity_kind_semantic_declaration_key,
    params.required_amount_semantic_declaration_key,
    params.raw_relation_basis_key,
    params.contribution_quantity_kind,
    params.required_amount_quantity_kind,
    params.required_amount_role,
    params.contribution_required_amount_relation,
    params.interpretation,
  ].join("|");
}

function isSupportedRawRelation(
  relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation
): relation is AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilitySupportedRawRelation {
  return (
    relation === RAW_BELOW ||
    relation === RAW_EQUALS ||
    relation === RAW_ABOVE
  );
}

/**
 * Deterministic MINIMUM / EXACT polarity tables.
 * No unusual / arbitrary remapping.
 */
export function deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation(params: {
  required_amount_role: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilitySupportedRole;
  contribution_required_amount_relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilitySupportedRawRelation;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation {
  const { required_amount_role, contribution_required_amount_relation } =
    params;

  if (required_amount_role === "MINIMUM_REQUIRED_AMOUNT") {
    if (contribution_required_amount_relation === RAW_BELOW) {
      return CONTRADICTING;
    }
    return SUPPORTING;
  }

  // EXACT_REQUIRED_AMOUNT
  if (contribution_required_amount_relation === RAW_EQUALS) {
    return SUPPORTING;
  }
  return CONTRADICTING;
}

function assertBindingAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment
): void {
  if (
    assessment.status ===
    "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT"
  ) {
    if (assessment.compatibility_basis === null) {
      throw new Error(
        `GROUND-174 invariant violated: BASIS_PRESENT requires non-null basis for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `GROUND-174 invariant violated: BASIS_PRESENT requires non-null interpretation for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_compatibility_basis) {
      throw new Error(
        `GROUND-174 invariant violated: BASIS_PRESENT requires boolean true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.unresolved_reasons.length !== 0) {
      throw new Error(
        `GROUND-174 invariant violated: BASIS_PRESENT requires empty unresolved_reasons for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.compatibility_basis !== null) {
    throw new Error(
      `GROUND-174 invariant violated: non-PRESENT requires null basis for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.interpretation !== null) {
    throw new Error(
      `GROUND-174 invariant violated: non-PRESENT requires null interpretation for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.has_compatibility_basis) {
    throw new Error(
      `GROUND-174 invariant violated: non-PRESENT requires boolean false for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (
    assessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION"
  ) {
    if (assessment.unresolved_reasons.length !== 0) {
      throw new Error(
        `GROUND-174 invariant violated: NOT_APPLICABLE requires empty unresolved_reasons for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.unresolved_reasons.length === 0) {
    throw new Error(
      `GROUND-174 invariant violated: unresolved status requires non-empty unresolved_reasons for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.status !== primaryUnresolvedStatus(assessment.unresolved_reasons)) {
    throw new Error(
      `GROUND-174 invariant violated: outer unresolved status must match primary reason for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

function indexRequiredAmountAssessments(
  set: AttentionObservationResourceRequiredAmountSemanticDeclarationSetAssessment
): Map<string, AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment> {
  const index = new Map<
    string,
    AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment
  >();
  for (const candidate of set.candidate_assessments) {
    for (const assessment of candidate.requirement_semantic_declaration_assessments) {
      if (index.has(assessment.observation_resource_requirement_key)) {
        throw new Error(
          `GROUND-174 invariant violated: duplicate GROUND-171 Requirement key ${assessment.observation_resource_requirement_key}`
        );
      }
      index.set(assessment.observation_resource_requirement_key, assessment);
    }
  }
  return index;
}

function indexContributionKindAssessments(
  set: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSetAssessment
): {
  byContributionKey: Map<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
  >;
  byBindingKey: Map<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
  >;
} {
  const byContributionKey = new Map<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
  >();
  const byBindingKey = new Map<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
  >();

  for (const candidate of set.candidate_assessments) {
    for (const assessment of candidate.binding_quantity_kind_semantic_declaration_assessments) {
      const bindingKey = [
        candidate.candidate_key,
        assessment.observation_resource_requirement_key,
        assessment.resource_readiness_observation_context_binding_key,
        assessment.resource_declaration_id,
      ].join("|");
      if (byBindingKey.has(bindingKey)) {
        throw new Error(
          `GROUND-174 invariant violated: duplicate GROUND-173 Binding key ${bindingKey}`
        );
      }
      byBindingKey.set(bindingKey, assessment);

      const contribution =
        assessment.physical_potential_contribution_declaration;
      if (contribution !== null) {
        if (byContributionKey.has(contribution.key)) {
          throw new Error(
            `GROUND-174 invariant violated: duplicate GROUND-173 contribution key ${contribution.key}`
          );
        }
        byContributionKey.set(contribution.key, assessment);
      }
    }
  }

  return { byContributionKey, byBindingKey };
}

function indexCandidate171(
  set: AttentionObservationResourceRequiredAmountSemanticDeclarationSetAssessment
): Map<string, AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment> {
  const index = new Map<
    string,
    AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment
  >();
  for (const candidate of set.candidate_assessments) {
    index.set(candidate.candidate_key, candidate);
  }
  return index;
}

function indexCandidate173(
  set: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSetAssessment
): Map<
  string,
  AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment
> {
  const index = new Map<
    string,
    AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment
  >();
  for (const candidate of set.candidate_assessments) {
    index.set(candidate.candidate_key, candidate);
  }
  return index;
}

function assessBinding(params: {
  rawBinding: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment;
  requiredAmountByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment
  >;
  contributionKindByContributionKey: ReadonlyMap<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
  >;
  contributionKindByBindingKey: ReadonlyMap<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
  >;
  candidate_key: string;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment {
  const { rawBinding } = params;

  const contributionDeclaration =
    rawBinding.physical_potential_contribution_declaration_assessment
      .declaration;

  if (
    contributionDeclaration === null ||
    rawBinding.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION" ||
    rawBinding.raw_relation_basis === null
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment =
      {
        observation_resource_requirement_key:
          rawBinding.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          rawBinding.resource_readiness_observation_context_binding_key,
        resource_declaration_id: rawBinding.resource_declaration_id,
        raw_relation_binding_assessment: rawBinding,
        required_amount_semantic_declaration_assessment:
          params.requiredAmountByRequirementKey.get(
            rawBinding.observation_resource_requirement_key
          ) ?? null,
        contribution_quantity_kind_semantic_declaration_assessment:
          params.contributionKindByBindingKey.get(
            [
              params.candidate_key,
              rawBinding.observation_resource_requirement_key,
              rawBinding.resource_readiness_observation_context_binding_key,
              rawBinding.resource_declaration_id,
            ].join("|")
          ) ?? null,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION",
        unresolved_reasons: [],
        compatibility_basis: null,
        interpretation: null,
        has_compatibility_basis: false,
      };
    assertBindingAssessmentInvariant(assessment);
    return assessment;
  }

  const rawBasis = rawBinding.raw_relation_basis;
  const requiredAssessment =
    params.requiredAmountByRequirementKey.get(
      rawBinding.observation_resource_requirement_key
    ) ?? null;
  const kindAssessment =
    params.contributionKindByContributionKey.get(contributionDeclaration.key) ??
    null;

  if (requiredAssessment === null) {
    throw new Error(
      `GROUND-174 cross-input join failed: missing GROUND-171 assessment for Requirement ${rawBinding.observation_resource_requirement_key}`
    );
  }
  if (kindAssessment === null) {
    throw new Error(
      `GROUND-174 cross-input join failed: missing GROUND-173 assessment for contribution ${contributionDeclaration.key}`
    );
  }

  const reasons: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[] =
    [];

  if (
    kindAssessment.status ===
    "NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION"
  ) {
    reasons.push("NO_EXPLICIT_CONTRIBUTION_QUANTITY_KIND_DECLARATION");
  } else if (
    kindAssessment.status ===
      "EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_PRESENT" &&
    kindAssessment.semantic_declaration!.quantity_kind ===
      "UNDECLARED_QUANTITY_KIND"
  ) {
    reasons.push("CONTRIBUTION_QUANTITY_KIND_UNDECLARED");
  }

  if (
    requiredAssessment.status ===
    "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION"
  ) {
    reasons.push("NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION");
  } else if (
    requiredAssessment.status ===
      "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT"
  ) {
    const requiredDecl = requiredAssessment.semantic_declaration!;
    if (requiredDecl.quantity_kind === "UNDECLARED_QUANTITY_KIND") {
      reasons.push("REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED");
    }
    if (requiredDecl.amount_role === "TARGET_REQUIRED_AMOUNT") {
      reasons.push("TARGET_ACCEPTANCE_SEMANTICS_NOT_MODELED");
    }
  }

  const contributionShape =
    rawBasis.declared_potential_contribution_quantity.kind;
  const requiredShape =
    requiredAssessment.resource_requirement.required_amount.kind;
  const requiredShapeFrom157 =
    rawBasis.contribution_required_amount_relation.required_amount.kind;
  if (requiredShape !== requiredShapeFrom157) {
    throw new Error(
      `GROUND-174 cross-input integrity violated: required_amount shape mismatch between GROUND-171 and GROUND-157 for Requirement ${rawBinding.observation_resource_requirement_key}`
    );
  }

  if (contributionShape === "RANGE") {
    reasons.push("CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED");
  }
  if (requiredShape === "RANGE") {
    reasons.push("REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED");
  }

  const contributionKind =
    kindAssessment.semantic_declaration?.quantity_kind ?? null;
  const requiredKind =
    requiredAssessment.semantic_declaration?.quantity_kind ?? null;

  if (
    contributionKind !== null &&
    requiredKind !== null &&
    contributionKind !== "UNDECLARED_QUANTITY_KIND" &&
    requiredKind !== "UNDECLARED_QUANTITY_KIND" &&
    contributionKind !== requiredKind
  ) {
    reasons.push("CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH");
  }

  if (
    contributionKind === "FLOW_QUANTITY" ||
    requiredKind === "FLOW_QUANTITY"
  ) {
    reasons.push("FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED");
  }

  const unresolved_reasons = sortUnresolvedReasons(reasons);
  if (unresolved_reasons.length > 0) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment =
      {
        observation_resource_requirement_key:
          rawBinding.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          rawBinding.resource_readiness_observation_context_binding_key,
        resource_declaration_id: rawBinding.resource_declaration_id,
        raw_relation_binding_assessment: rawBinding,
        required_amount_semantic_declaration_assessment: requiredAssessment,
        contribution_quantity_kind_semantic_declaration_assessment:
          kindAssessment,
        status: primaryUnresolvedStatus(unresolved_reasons),
        unresolved_reasons,
        compatibility_basis: null,
        interpretation: null,
        has_compatibility_basis: false,
      };
    assertBindingAssessmentInvariant(assessment);
    return assessment;
  }

  // Supported subset gate
  if (
    contributionShape !== "POINT" ||
    requiredShape !== "POINT" ||
    contributionKind !== "STOCK_QUANTITY" ||
    requiredKind !== "STOCK_QUANTITY"
  ) {
    throw new Error(
      `GROUND-174 invariant violated: empty unresolved reasons but supported subset not met for binding ${rawBinding.resource_readiness_observation_context_binding_key}`
    );
  }

  const requiredDecl = requiredAssessment.semantic_declaration!;
  const kindDecl = kindAssessment.semantic_declaration!;
  const role = requiredDecl.amount_role;
  if (role !== "MINIMUM_REQUIRED_AMOUNT" && role !== "EXACT_REQUIRED_AMOUNT") {
    throw new Error(
      `GROUND-174 invariant violated: supported subset requires MINIMUM|EXACT for binding ${rawBinding.resource_readiness_observation_context_binding_key}`
    );
  }

  const rawRelation =
    rawBasis.contribution_required_amount_relation.relation;
  if (!isSupportedRawRelation(rawRelation)) {
    throw new Error(
      `GROUND-174 malformed cross-input: POINT×POINT contribution↔required_amount relation ${rawRelation} is structurally impossible`
    );
  }

  const interpretation =
    deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation(
      {
        required_amount_role: role,
        contribution_required_amount_relation: rawRelation,
      }
    );

  const compatibility_basis: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasis =
    {
      key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisKey(
        {
          candidate_key: rawBasis.candidate_key,
          observation_need_key: rawBasis.observation_need_key,
          capability_requirement_set_key:
            rawBasis.capability_requirement_set_key,
          observation_resource_requirement_key:
            rawBasis.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            rawBasis.resource_readiness_observation_context_binding_key,
          resource_declaration_id: rawBasis.resource_declaration_id,
          evaluation_at: rawBasis.evaluation_at,
          physical_potential_contribution_declaration_key:
            rawBasis.physical_potential_contribution_declaration_key,
          contribution_quantity_kind_semantic_declaration_key: kindDecl.key,
          required_amount_semantic_declaration_key: requiredDecl.key,
          raw_relation_basis_key: rawBasis.key,
          contribution_quantity_kind: "STOCK_QUANTITY",
          required_amount_quantity_kind: "STOCK_QUANTITY",
          required_amount_role: role,
          contribution_required_amount_relation: rawRelation,
          interpretation,
        }
      ),
      candidate_key: rawBasis.candidate_key,
      observation_need_key: rawBasis.observation_need_key,
      capability_requirement_set_key: rawBasis.capability_requirement_set_key,
      dimension: "RESOURCE_READINESS",
      observation_resource_requirement_key:
        rawBasis.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        rawBasis.resource_readiness_observation_context_binding_key,
      resource_declaration_id: rawBasis.resource_declaration_id,
      evaluation_at: rawBasis.evaluation_at,
      physical_potential_contribution_declaration_key:
        rawBasis.physical_potential_contribution_declaration_key,
      contribution_quantity_kind_semantic_declaration_key: kindDecl.key,
      required_amount_semantic_declaration_key: requiredDecl.key,
      raw_relation_basis_key: rawBasis.key,
      contribution_quantity_kind: "STOCK_QUANTITY",
      required_amount_quantity_kind: "STOCK_QUANTITY",
      required_amount_role: role,
      contribution_required_amount_relation: rawRelation,
      interpretation,
    };

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment =
    {
      observation_resource_requirement_key:
        rawBinding.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        rawBinding.resource_readiness_observation_context_binding_key,
      resource_declaration_id: rawBinding.resource_declaration_id,
      raw_relation_binding_assessment: rawBinding,
      required_amount_semantic_declaration_assessment: requiredAssessment,
      contribution_quantity_kind_semantic_declaration_assessment:
        kindAssessment,
      status:
        "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
      unresolved_reasons: [],
      compatibility_basis,
      interpretation,
      has_compatibility_basis: true,
    };
  assertBindingAssessmentInvariant(assessment);
  return assessment;
}

function isUnresolvedStatus(
  status: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisStatus
): boolean {
  return status.startsWith("UNRESOLVED_");
}

export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasis(
  rawCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisAssessment,
  requiredAmountByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment
  >,
  contributionKindByContributionKey: ReadonlyMap<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
  >,
  contributionKindByBindingKey: ReadonlyMap<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
  >,
  requiredAmountCandidate: AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment | null,
  contributionKindCandidate: AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment | null
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisAssessment {
  const binding_compatibility_basis_assessments =
    rawCandidate.binding_raw_relation_assessments.map((rawBinding) =>
      assessBinding({
        rawBinding,
        requiredAmountByRequirementKey,
        contributionKindByContributionKey,
        contributionKindByBindingKey,
        candidate_key: rawCandidate.candidate_key,
      })
    );

  return {
    candidate_key: rawCandidate.candidate_key,
    declared_potential_contribution_raw_relation_assessment: rawCandidate,
    required_amount_semantic_declaration_assessment: requiredAmountCandidate,
    contribution_quantity_kind_semantic_declaration_assessment:
      contributionKindCandidate,
    binding_compatibility_basis_assessments,
    has_required_amount_compatibility_bases:
      binding_compatibility_basis_assessments.some(
        (a) => a.has_compatibility_basis
      ),
    has_supporting_required_amount_compatibility_evidence:
      binding_compatibility_basis_assessments.some(
        (a) => a.interpretation === SUPPORTING
      ),
    has_contradicting_required_amount_compatibility_evidence:
      binding_compatibility_basis_assessments.some(
        (a) => a.interpretation === CONTRADICTING
      ),
    has_unresolved_required_amount_compatibility_assessments:
      binding_compatibility_basis_assessments.some((a) =>
        isUnresolvedStatus(a.status)
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Deterministic POINT-STOCK Required-Amount Compatibility Basis.
 * Preserves GROUND-157 Candidate / Binding order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSetAssessment {
  const requiredAmountByRequirementKey = indexRequiredAmountAssessments(
    input.required_amount_semantic_declaration_set
  );
  const { byContributionKey, byBindingKey } = indexContributionKindAssessments(
    input.declared_potential_contribution_quantity_kind_semantic_declaration_set
  );
  const candidate171 = indexCandidate171(
    input.required_amount_semantic_declaration_set
  );
  const candidate173 = indexCandidate173(
    input.declared_potential_contribution_quantity_kind_semantic_declaration_set
  );

  const candidate_assessments =
    input.physical_potential_contribution_raw_relation_basis_set.candidate_assessments.map(
      (rawCandidate) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasis(
          rawCandidate,
          requiredAmountByRequirementKey,
          byContributionKey,
          byBindingKey,
          candidate171.get(rawCandidate.candidate_key) ?? null,
          candidate173.get(rawCandidate.candidate_key) ?? null
        )
    );

  return {
    physical_potential_contribution_raw_relation_basis_set:
      input.physical_potential_contribution_raw_relation_basis_set,
    required_amount_semantic_declaration_set:
      input.required_amount_semantic_declaration_set,
    declared_potential_contribution_quantity_kind_semantic_declaration_set:
      input.declared_potential_contribution_quantity_kind_semantic_declaration_set,
    candidate_assessments,
    has_required_amount_compatibility_bases: candidate_assessments.some(
      (a) => a.has_required_amount_compatibility_bases
    ),
    has_supporting_required_amount_compatibility_evidence:
      candidate_assessments.some(
        (a) => a.has_supporting_required_amount_compatibility_evidence
      ),
    has_contradicting_required_amount_compatibility_evidence:
      candidate_assessments.some(
        (a) => a.has_contradicting_required_amount_compatibility_evidence
      ),
    has_unresolved_required_amount_compatibility_assessments:
      candidate_assessments.some(
        (a) => a.has_unresolved_required_amount_compatibility_assessments
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
