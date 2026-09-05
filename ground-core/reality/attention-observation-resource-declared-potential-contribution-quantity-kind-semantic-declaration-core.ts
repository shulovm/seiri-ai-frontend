/**
 * Reality Core v0.7 — Attention Observation Declared Potential Contribution
 * Quantity-Kind Semantic Declaration (GROUND-173).
 *
 * Pure composition of:
 *   GROUND-155 Physical Potential Contribution Declaration Set
 *   + explicit Potential Contribution Quantity-Kind Semantic Specification
 *
 * Declaration only. Does NOT interpret GROUND-157 raw relations.
 * Does NOT match against GROUND-171 required_amount quantity_kind.
 * Does NOT emit sufficiency / satisfaction / polarity / Resource Ready.
 *
 * Must not import GROUND-171/169/157 runtime authorities, Availability,
 * Reservation, or project persistence.
 *
 * POINT/RANGE ≠ STOCK/FLOW; unit ≠ STOCK/FLOW
 * PRESENT + UNDECLARED_QUANTITY_KIND ≠ NO_QUANTITY_KIND_DECLARATION
 *
 * Architecture invariant (GROUND-170):
 * GROUND-155 declared potential contribution is a singleton authoritative
 * specification, not a multi-source evidence claim. No repair required.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.js";
import type {
  AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKind,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclaration,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationEvalInput,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationModelLimitation,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSetAssessment,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification,
} from "./attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration-types.js";

export const ATTENTION_OBSERVATION_RESOURCE_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_MODEL_LIMITATIONS: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationModelLimitation[] =
  [
    "POTENTIAL_CONTRIBUTION_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED",
    "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
    "TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "FLOW_TIME_BASIS_NOT_MODELED",
    "FLOW_INTEGRATION_WINDOW_NOT_MODELED",
    "CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MATCH_NOT_EVALUATED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
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

/**
 * GROUND-170 architecture invariant retained as documentation constant.
 * GROUND-155 remains a singleton authoritative specification.
 */
export const GROUND_155_SINGLETON_AUTHORITATIVE_SPECIFICATION_INVARIANT =
  "GROUND-155 declared potential contribution is a singleton authoritative specification, not a multi-source evidence claim" as const;

const QUANTITY_KINDS =
  new Set<AttentionObservationResourceDeclaredPotentialContributionQuantityKind>(
    ["STOCK_QUANTITY", "FLOW_QUANTITY", "UNDECLARED_QUANTITY_KIND"]
  );

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Conceptual identity:
 * attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|evaluationAt|
 * ground155ContributionDeclarationKey|quantityKind
 */
export function attentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  physical_potential_contribution_declaration_key: string;
  quantity_kind: AttentionObservationResourceDeclaredPotentialContributionQuantityKind;
}): string {
  return [
    "attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.evaluation_at,
    params.physical_potential_contribution_declaration_key,
    params.quantity_kind,
  ].join("|");
}

function normalizeQuantityKind(
  value: AttentionObservationResourceDeclaredPotentialContributionQuantityKind
): AttentionObservationResourceDeclaredPotentialContributionQuantityKind {
  if (!QUANTITY_KINDS.has(value)) {
    throw new Error(
      `Unknown AttentionObservationResourceDeclaredPotentialContributionQuantityKind: ${String(value)}`
    );
  }
  return value;
}

/**
 * Normalize specification declarations against exact GROUND-155 declaration keys.
 * Duplicate identical → one. Same contribution different kind → reject.
 * Unknown / stale contribution declaration key → reject.
 */
export function normalizeAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification(
  specification: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification,
  contributionByKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration
  >
): AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput[] {
  if (!specification || !Array.isArray(specification.declarations)) {
    throw new Error("specification.declarations must be an array");
  }

  const byContributionKey = new Map<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput
  >();

  for (const entry of specification.declarations) {
    if (
      !entry.physical_potential_contribution_declaration_key ||
      entry.physical_potential_contribution_declaration_key.trim().length === 0
    ) {
      throw new Error(
        "physical_potential_contribution_declaration_key must be non-empty"
      );
    }

    if (
      !contributionByKey.has(entry.physical_potential_contribution_declaration_key)
    ) {
      throw new Error(
        `Unknown or stale Physical Potential Contribution Declaration key ${entry.physical_potential_contribution_declaration_key}`
      );
    }

    const quantity_kind = normalizeQuantityKind(entry.quantity_kind);
    const normalized: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput =
      {
        physical_potential_contribution_declaration_key:
          entry.physical_potential_contribution_declaration_key,
        quantity_kind,
      };

    const existing = byContributionKey.get(
      entry.physical_potential_contribution_declaration_key
    );
    if (existing) {
      if (existing.quantity_kind !== normalized.quantity_kind) {
        throw new Error(
          `Conflicting Declared Potential Contribution Quantity-Kind Semantic Declarations for Physical Potential Contribution Declaration ${entry.physical_potential_contribution_declaration_key}`
        );
      }
      continue;
    }

    byContributionKey.set(
      entry.physical_potential_contribution_declaration_key,
      normalized
    );
  }

  return [...byContributionKey.values()].sort((a, b) =>
    compareStrings(
      a.physical_potential_contribution_declaration_key,
      b.physical_potential_contribution_declaration_key
    )
  );
}

function buildDeclaration(
  contribution: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration,
  quantity_kind: AttentionObservationResourceDeclaredPotentialContributionQuantityKind
): AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclaration {
  return {
    key: attentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationKey(
      {
        candidate_key: contribution.candidate_key,
        observation_need_key: contribution.observation_need_key,
        capability_requirement_set_key:
          contribution.capability_requirement_set_key,
        observation_resource_requirement_key:
          contribution.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          contribution.resource_readiness_observation_context_binding_key,
        resource_declaration_id: contribution.resource_declaration_id,
        evaluation_at: contribution.evaluation_at,
        physical_potential_contribution_declaration_key: contribution.key,
        quantity_kind,
      }
    ),
    candidate_key: contribution.candidate_key,
    observation_need_key: contribution.observation_need_key,
    capability_requirement_set_key: contribution.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      contribution.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      contribution.resource_readiness_observation_context_binding_key,
    resource_declaration_id: contribution.resource_declaration_id,
    evaluation_at: contribution.evaluation_at,
    physical_potential_contribution_declaration_key: contribution.key,
    quantity_kind,
  };
}

function assertBindingAssessmentInvariant(
  assessment: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_PRESENT"
  ) {
    if (assessment.semantic_declaration === null) {
      throw new Error(
        `GROUND-173 invariant violated: PRESENT requires non-null declaration for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      !assessment.has_explicit_potential_contribution_quantity_kind_semantic_declaration
    ) {
      throw new Error(
        `GROUND-173 invariant violated: PRESENT requires boolean true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.physical_potential_contribution_declaration === null) {
      throw new Error(
        `GROUND-173 invariant violated: PRESENT requires non-null GROUND-155 declaration for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.semantic_declaration !== null) {
    throw new Error(
      `GROUND-173 invariant violated: non-PRESENT requires null semantic declaration for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (
    assessment.has_explicit_potential_contribution_quantity_kind_semantic_declaration
  ) {
    throw new Error(
      `GROUND-173 invariant violated: non-PRESENT requires boolean false for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (
    assessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION"
  ) {
    if (assessment.physical_potential_contribution_declaration !== null) {
      throw new Error(
        `GROUND-173 invariant violated: NOT_APPLICABLE requires null GROUND-155 declaration for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.physical_potential_contribution_declaration === null) {
    throw new Error(
      `GROUND-173 invariant violated: NO_DECLARATION requires non-null GROUND-155 declaration for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

function assessBinding(
  binding: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
  declarationsByContributionKey: ReadonlyMap<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput
  >
): AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment {
  const contribution = binding.declaration;

  if (
    contribution === null ||
    binding.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION"
  ) {
    const assessment: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment =
      {
        observation_resource_requirement_key:
          binding.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          binding.resource_readiness_observation_context_binding_key,
        resource_declaration_id: binding.resource_declaration_id,
        physical_potential_contribution_declaration_binding_assessment: binding,
        physical_potential_contribution_declaration: null,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION",
        semantic_declaration: null,
        has_explicit_potential_contribution_quantity_kind_semantic_declaration:
          false,
      };
    assertBindingAssessmentInvariant(assessment);
    return assessment;
  }

  const declared = declarationsByContributionKey.get(contribution.key);
  if (!declared) {
    const assessment: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment =
      {
        observation_resource_requirement_key:
          binding.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          binding.resource_readiness_observation_context_binding_key,
        resource_declaration_id: binding.resource_declaration_id,
        physical_potential_contribution_declaration_binding_assessment: binding,
        physical_potential_contribution_declaration: contribution,
        status:
          "NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION",
        semantic_declaration: null,
        has_explicit_potential_contribution_quantity_kind_semantic_declaration:
          false,
      };
    assertBindingAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment =
    {
      observation_resource_requirement_key:
        binding.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        binding.resource_readiness_observation_context_binding_key,
      resource_declaration_id: binding.resource_declaration_id,
      physical_potential_contribution_declaration_binding_assessment: binding,
      physical_potential_contribution_declaration: contribution,
      status:
        "EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_PRESENT",
      semantic_declaration: buildDeclaration(
        contribution,
        declared.quantity_kind
      ),
      has_explicit_potential_contribution_quantity_kind_semantic_declaration:
        true,
    };
  assertBindingAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Declared Potential Contribution Quantity-Kind Semantic Declaration.
 */
export function assessAttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclaration(
  contributionCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment,
  declarationsByContributionKey: ReadonlyMap<
    string,
    AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationInput
  >
): AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment {
  const binding_quantity_kind_semantic_declaration_assessments =
    contributionCandidate.binding_potential_contribution_declaration_assessments.map(
      (binding) => assessBinding(binding, declarationsByContributionKey)
    );

  return {
    candidate_key: contributionCandidate.candidate_key,
    physical_potential_contribution_declaration_assessment:
      contributionCandidate,
    binding_quantity_kind_semantic_declaration_assessments,
    has_explicit_potential_contribution_quantity_kind_semantic_declarations:
      binding_quantity_kind_semantic_declaration_assessments.some(
        (assessment) =>
          assessment.has_explicit_potential_contribution_quantity_kind_semantic_declaration
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_RESOURCE_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_MODEL_LIMITATIONS,
    ],
  };
}

function indexContributions(
  contributionSet: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment
): Map<
  string,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration
> {
  const index = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration
  >();

  for (const candidate of contributionSet.candidate_assessments) {
    for (const binding of candidate.binding_potential_contribution_declaration_assessments) {
      const contribution = binding.declaration;
      if (contribution === null) {
        continue;
      }
      if (index.has(contribution.key)) {
        throw new Error(
          `GROUND-173 invariant violated: duplicate Physical Potential Contribution Declaration key ${contribution.key}`
        );
      }
      if (contribution.candidate_key !== candidate.candidate_key) {
        throw new Error(
          `GROUND-173 invariant violated: contribution candidate mismatch for ${contribution.key}`
        );
      }
      index.set(contribution.key, contribution);
    }
  }

  return index;
}

/**
 * Pure set-level Declared Potential Contribution Quantity-Kind Semantic Declaration.
 * Preserves GROUND-155 Candidate / Binding order.
 */
export function buildAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSet(
  input: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationEvalInput
): AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSetAssessment {
  const contributionByKey = indexContributions(
    input.physical_potential_contribution_declaration_set
  );
  const normalizedDeclarations =
    normalizeAttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSpecification(
      input.specification,
      contributionByKey
    );
  const declarationsByContributionKey = new Map(
    normalizedDeclarations.map((entry) => [
      entry.physical_potential_contribution_declaration_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.physical_potential_contribution_declaration_set.candidate_assessments.map(
      (candidateAssessment) =>
        assessAttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclaration(
          candidateAssessment,
          declarationsByContributionKey
        )
    );

  return {
    physical_potential_contribution_declaration_set:
      input.physical_potential_contribution_declaration_set,
    specification: input.specification,
    candidate_assessments,
    has_explicit_potential_contribution_quantity_kind_semantic_declarations:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_potential_contribution_quantity_kind_semantic_declarations
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_RESOURCE_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_MODEL_LIMITATIONS,
    ],
  };
}
