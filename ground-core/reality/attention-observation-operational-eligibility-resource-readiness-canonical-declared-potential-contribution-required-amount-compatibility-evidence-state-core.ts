/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Canonical Declared Potential Contribution Required-Amount
 * Compatibility Evidence State (GROUND-175).
 *
 * Pure normalization of GROUND-174 Required-Amount Compatibility Basis Set.
 * Sole runtime semantic authority: GROUND-174.
 *
 * Must not import GROUND-173/171/169/157 builders or project persistence.
 * Nested lineage on GROUND-174 assessments may be read for structural context only.
 *
 * NOT_APPLICABLE ≠ UNRESOLVED
 * SUPPORTING ≠ Requirement satisfied / meets required amount
 * CONTRADICTING ≠ Requirement failed
 * EXPLICITLY_DERIVED (role-derived deterministic) ≠ EXPLICITLY_INTERPRETED (Policy)
 * canonical State ≠ Resource Ready / contribution verified
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-compatibility-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateModelLimitation[] =
  [
    "TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
    "POTENTIAL_CONTRIBUTION_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "FLOW_TIME_BASIS_NOT_MODELED",
    "FLOW_INTEGRATION_WINDOW_NOT_MODELED",
    "REQUIREMENT_SATISFACTION_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "CAPACITY_REQUIRED_AMOUNT_EVIDENCE_COMPOSITION_NOT_MODELED",
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

const NONE_TOKEN = "NONE" as const;

const INTERP_SUPPORTING =
  "SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE" as const;
const INTERP_CONTRADICTING =
  "CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE" as const;

const CANONICAL_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION" as const;
const CANONICAL_SUPPORTING =
  "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_SUPPORTING" as const;
const CANONICAL_CONTRADICTING =
  "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_CONTRADICTING" as const;

const UNRESOLVED_VALUES = new Set<AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue>(
  [
    "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION",
    "UNRESOLVED_NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
    "UNRESOLVED_CONTRIBUTION_QUANTITY_KIND_UNDECLARED",
    "UNRESOLVED_REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED",
    "UNRESOLVED_CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH",
    "UNRESOLVED_CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
    "UNRESOLVED_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
    "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
  ]
);

/**
 * Domain applicability — NOT_APPLICABLE is not unresolved.
 */
export function isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue
): boolean {
  return value !== CANONICAL_NOT_APPLICABLE;
}

/**
 * Resolved evidence — SUPPORTING and CONTRADICTING only.
 * isResolved=false does not itself imply UNRESOLVED (NOT_APPLICABLE is separate).
 */
export function isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue
): boolean {
  return value === CANONICAL_SUPPORTING || value === CANONICAL_CONTRADICTING;
}

/**
 * Explicit unresolved causes only — excludes NOT_APPLICABLE.
 */
export function isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue
): boolean {
  return UNRESOLVED_VALUES.has(value);
}

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function canonicalUnresolvedReasonSetToken(
  reasons: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[]
): string {
  if (reasons.length === 0) {
    return NONE_TOKEN;
  }
  return [...reasons].sort(compareStrings).join(",");
}

/**
 * Conceptual identity:
 * ...canonical-declared-potential-contribution-required-amount-compatibility-evidence-state|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|
 * evaluationAt-or-NONE|contributionDeclarationKey-or-NONE|ground174Status|
 * canonicalUnresolvedReasonSet|ground174BasisKey-or-NONE|canonicalStateValue
 */
export function attentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string | null;
  physical_potential_contribution_declaration_key: string | null;
  ground174_status: string;
  unresolved_reasons: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[];
  required_amount_compatibility_basis_key: string | null;
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.evaluation_at ?? NONE_TOKEN,
    params.physical_potential_contribution_declaration_key ?? NONE_TOKEN,
    params.ground174_status,
    canonicalUnresolvedReasonSetToken(params.unresolved_reasons),
    params.required_amount_compatibility_basis_key ?? NONE_TOKEN,
    params.value,
  ].join("|");
}

function assertGround174BindingInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment
): void {
  if (
    assessment.status ===
    "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT"
  ) {
    if (assessment.compatibility_basis === null) {
      throw new Error(
        `Canonical Required-Amount Compatibility Evidence State invariant violated: BASIS_PRESENT requires non-null Basis for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `Canonical Required-Amount Compatibility Evidence State invariant violated: BASIS_PRESENT requires non-null interpretation for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.interpretation !==
      assessment.compatibility_basis.interpretation
    ) {
      throw new Error(
        `Canonical Required-Amount Compatibility Evidence State invariant violated: interpretation mismatch for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.unresolved_reasons.length !== 0) {
      throw new Error(
        `Canonical Required-Amount Compatibility Evidence State invariant violated: BASIS_PRESENT requires empty unresolved_reasons for Binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (assessment.compatibility_basis !== null) {
    throw new Error(
      `Canonical Required-Amount Compatibility Evidence State invariant violated: non-PRESENT requires null Basis for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
  if (assessment.interpretation !== null) {
    throw new Error(
      `Canonical Required-Amount Compatibility Evidence State invariant violated: non-PRESENT requires null interpretation for Binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

/**
 * Exhaustive GROUND-174 → canonical State mapping.
 * No polarity recomputation. No quantity/kind reopening.
 */
export function deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue {
  assertGround174BindingInvariant(assessment);

  switch (assessment.status) {
    case "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION":
      return CANONICAL_NOT_APPLICABLE;

    case "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION":
      return "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION";

    case "UNRESOLVED_NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION":
      return "UNRESOLVED_NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION";

    case "UNRESOLVED_CONTRIBUTION_QUANTITY_KIND_UNDECLARED":
      return "UNRESOLVED_CONTRIBUTION_QUANTITY_KIND_UNDECLARED";

    case "UNRESOLVED_REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED":
      return "UNRESOLVED_REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED";

    case "UNRESOLVED_CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH":
      return "UNRESOLVED_CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH";

    case "UNRESOLVED_CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED":
      return "UNRESOLVED_CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED";

    case "UNRESOLVED_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED":
      return "UNRESOLVED_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED";

    case "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED":
      return "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED";

    case "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED":
      return "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED";

    case "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT": {
      const interpretation = assessment.compatibility_basis!.interpretation;
      switch (interpretation) {
        case INTERP_SUPPORTING:
          return CANONICAL_SUPPORTING;
        case INTERP_CONTRADICTING:
          return CANONICAL_CONTRADICTING;
        default: {
          const _exhaustive: never = interpretation;
          void _exhaustive;
          throw new Error(
            `Unknown Required-Amount Compatibility Interpretation: ${String(interpretation)}`
          );
        }
      }
    }

    default: {
      const _exhaustive: never = assessment.status;
      void _exhaustive;
      throw new Error(
        `Unknown GROUND-174 Required-Amount Compatibility Basis status: ${String(assessment.status)}`
      );
    }
  }
}

function extractContributionDeclarationKey(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment
): string | null {
  if (assessment.compatibility_basis !== null) {
    return assessment.compatibility_basis
      .physical_potential_contribution_declaration_key;
  }

  const kindAssessment =
    assessment.contribution_quantity_kind_semantic_declaration_assessment;
  if (
    kindAssessment?.physical_potential_contribution_declaration !== null &&
    kindAssessment?.physical_potential_contribution_declaration !== undefined
  ) {
    return kindAssessment.physical_potential_contribution_declaration.key;
  }

  const rawDeclaration =
    assessment.raw_relation_binding_assessment
      .physical_potential_contribution_declaration_assessment.declaration;
  return rawDeclaration?.key ?? null;
}

function extractEvaluationAt(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment
): string | null {
  if (assessment.compatibility_basis !== null) {
    return assessment.compatibility_basis.evaluation_at;
  }

  const kindAssessment =
    assessment.contribution_quantity_kind_semantic_declaration_assessment;
  if (
    kindAssessment?.physical_potential_contribution_declaration !== null &&
    kindAssessment?.physical_potential_contribution_declaration !== undefined
  ) {
    return kindAssessment.physical_potential_contribution_declaration
      .evaluation_at;
  }

  const kindDeclaration = kindAssessment?.semantic_declaration;
  if (kindDeclaration !== null && kindDeclaration !== undefined) {
    return kindDeclaration.evaluation_at;
  }

  const rawBasis =
    assessment.raw_relation_binding_assessment.raw_relation_basis;
  if (rawBasis !== null) {
    return rawBasis.evaluation_at;
  }

  return null;
}

function extractContextKeys(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment,
  nestedContext: {
    observation_need_key: string;
    capability_requirement_set_key: string;
  } | null
): {
  observation_need_key: string;
  capability_requirement_set_key: string;
} {
  if (assessment.compatibility_basis !== null) {
    return {
      observation_need_key: assessment.compatibility_basis.observation_need_key,
      capability_requirement_set_key:
        assessment.compatibility_basis.capability_requirement_set_key,
    };
  }

  const kindDeclaration =
    assessment.contribution_quantity_kind_semantic_declaration_assessment
      ?.semantic_declaration;
  if (kindDeclaration !== null && kindDeclaration !== undefined) {
    return {
      observation_need_key: kindDeclaration.observation_need_key,
      capability_requirement_set_key:
        kindDeclaration.capability_requirement_set_key,
    };
  }

  const contribution =
    assessment.contribution_quantity_kind_semantic_declaration_assessment
      ?.physical_potential_contribution_declaration ??
    assessment.raw_relation_binding_assessment
      .physical_potential_contribution_declaration_assessment.declaration;
  if (contribution !== null && contribution !== undefined) {
    return {
      observation_need_key: contribution.observation_need_key,
      capability_requirement_set_key: contribution.capability_requirement_set_key,
    };
  }

  const requiredDeclaration =
    assessment.required_amount_semantic_declaration_assessment
      ?.semantic_declaration;
  if (requiredDeclaration !== null && requiredDeclaration !== undefined) {
    return {
      observation_need_key: requiredDeclaration.observation_need_key,
      capability_requirement_set_key:
        requiredDeclaration.capability_requirement_set_key,
    };
  }

  const resourceRequirement =
    assessment.required_amount_semantic_declaration_assessment
      ?.resource_requirement;
  if (resourceRequirement !== null && resourceRequirement !== undefined) {
    return {
      observation_need_key: resourceRequirement.observation_need_key,
      capability_requirement_set_key:
        resourceRequirement.capability_requirement_set_key,
    };
  }

  if (nestedContext !== null) {
    return nestedContext;
  }

  throw new Error(
    `Canonical Required-Amount Compatibility Evidence State invariant violated: unable to resolve Need/CapSet lineage for Binding ${assessment.resource_readiness_observation_context_binding_key}`
  );
}

function buildCanonicalState(params: {
  candidate_key: string;
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment;
  nestedContext: {
    observation_need_key: string;
    capability_requirement_set_key: string;
  } | null;
}): AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState {
  const value =
    deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue(
      params.assessment
    );
  const context = extractContextKeys(params.assessment, params.nestedContext);
  const evaluation_at = extractEvaluationAt(params.assessment);
  const physical_potential_contribution_declaration_key =
    value === CANONICAL_NOT_APPLICABLE
      ? null
      : extractContributionDeclarationKey(params.assessment);
  const required_amount_compatibility_basis_key =
    value === CANONICAL_SUPPORTING || value === CANONICAL_CONTRADICTING
      ? params.assessment.compatibility_basis!.key
      : null;
  const unresolved_reasons = [...params.assessment.unresolved_reasons];

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateKey(
      {
        candidate_key: params.candidate_key,
        observation_need_key: context.observation_need_key,
        capability_requirement_set_key: context.capability_requirement_set_key,
        observation_resource_requirement_key:
          params.assessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          params.assessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id: params.assessment.resource_declaration_id,
        evaluation_at,
        physical_potential_contribution_declaration_key,
        ground174_status: params.assessment.status,
        unresolved_reasons,
        required_amount_compatibility_basis_key,
        value,
      }
    ),
    candidate_key: params.candidate_key,
    observation_need_key: context.observation_need_key,
    capability_requirement_set_key: context.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      params.assessment.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      params.assessment.resource_readiness_observation_context_binding_key,
    resource_declaration_id: params.assessment.resource_declaration_id,
    evaluation_at,
    physical_potential_contribution_declaration_key,
    required_amount_compatibility_basis_key,
    unresolved_reasons,
    value,
  };
}

export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
  basisCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment {
  const nestedContext =
    basisCandidate.required_amount_semantic_declaration_assessment
      ?.requirement_semantic_declaration_assessments[0]
      ?.resource_requirement ??
    basisCandidate.contribution_quantity_kind_semantic_declaration_assessment
      ?.binding_quantity_kind_semantic_declaration_assessments[0]
      ?.physical_potential_contribution_declaration ??
    null;

  const nestedKeys =
    nestedContext === null
      ? null
      : {
          observation_need_key: nestedContext.observation_need_key,
          capability_requirement_set_key:
            nestedContext.capability_requirement_set_key,
        };

  const binding_state_assessments =
    basisCandidate.binding_compatibility_basis_assessments.map(
      (assessment) => {
        const canonical_state = buildCanonicalState({
          candidate_key: basisCandidate.candidate_key,
          assessment,
          nestedContext: nestedKeys,
        });
        return {
          observation_resource_requirement_key:
            assessment.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            assessment.resource_readiness_observation_context_binding_key,
          resource_declaration_id: assessment.resource_declaration_id,
          required_amount_compatibility_basis_assessment: assessment,
          canonical_state,
          canonical_state_value: canonical_state.value,
        };
      }
    );

  return {
    candidate_key: basisCandidate.candidate_key,
    required_amount_compatibility_basis_assessment: basisCandidate,
    binding_state_assessments,
    has_applicable_required_amount_compatibility_evidence_states:
      binding_state_assessments.some((a) =>
        isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          a.canonical_state_value
        )
      ),
    has_resolved_required_amount_compatibility_evidence_states:
      binding_state_assessments.some((a) =>
        isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          a.canonical_state_value
        )
      ),
    has_supporting_required_amount_compatibility_evidence_states:
      binding_state_assessments.some(
        (a) => a.canonical_state_value === CANONICAL_SUPPORTING
      ),
    has_contradicting_required_amount_compatibility_evidence_states:
      binding_state_assessments.some(
        (a) => a.canonical_state_value === CANONICAL_CONTRADICTING
      ),
    has_unresolved_required_amount_compatibility_evidence_states:
      binding_state_assessments.some((a) =>
        isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          a.canonical_state_value
        )
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Canonical Required-Amount Compatibility Evidence State.
 * Preserves GROUND-174 Candidate / Binding order.
 * Binding State count == GROUND-174 Binding assessment count.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSetAssessment {
  const candidate_assessments =
    input.required_amount_compatibility_basis_set.candidate_assessments.map(
      (candidate) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          candidate
        )
    );

  return {
    required_amount_compatibility_basis_set:
      input.required_amount_compatibility_basis_set,
    candidate_assessments,
    has_applicable_required_amount_compatibility_evidence_states:
      candidate_assessments.some(
        (a) => a.has_applicable_required_amount_compatibility_evidence_states
      ),
    has_resolved_required_amount_compatibility_evidence_states:
      candidate_assessments.some(
        (a) => a.has_resolved_required_amount_compatibility_evidence_states
      ),
    has_supporting_required_amount_compatibility_evidence_states:
      candidate_assessments.some(
        (a) => a.has_supporting_required_amount_compatibility_evidence_states
      ),
    has_contradicting_required_amount_compatibility_evidence_states:
      candidate_assessments.some(
        (a) =>
          a.has_contradicting_required_amount_compatibility_evidence_states
      ),
    has_unresolved_required_amount_compatibility_evidence_states:
      candidate_assessments.some(
        (a) => a.has_unresolved_required_amount_compatibility_evidence_states
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS,
    ],
  };
}
