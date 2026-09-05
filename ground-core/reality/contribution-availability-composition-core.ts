import { compareTemporalInstants } from "../temporal.js";
/**
 * Read-only reference resolution into authoritative GROUND-187, followed by
 * lossless GROUND-177 + GROUND-187 composition under explicit Applicability.
 * Nested Set time is structural lineage only. No source, Result or mapping execution.
 * No time shifting, interval acceptance, latest-wins, scalarization or persistence.
 */
import {
  buildAvailabilityEvidenceContract, contributionAvailabilityContext,
  contributionAvailabilityContextKey,
} from "./contribution-availability-applicability-core.js";
import type { ContributionAvailabilityApplicabilityDeclaration, ContributionQuantityEvaluationState } from "./contribution-availability-applicability-types.js";
import type { CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSetAssessment } from "./canonical-selected-source-aggregated-declared-resource-availability-evidence-state-types.js";
import type { ContributionAvailabilityReferenceAssessment, ContributionQuantityAvailabilityCompositionAssessment } from "./contribution-availability-composition-types.js";

export function resolveContributionAvailabilityReference(input: {
  applicability_declaration: ContributionAvailabilityApplicabilityDeclaration;
  current_availability_evidence_state_set: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSetAssessment;
}): ContributionAvailabilityReferenceAssessment {
  const declaration = input.applicability_declaration;
  if (!declaration) throw new Error("Explicit Applicability declaration is required");
  const contextKey = contributionAvailabilityContextKey(declaration.contribution_context);
  const declaredContract = declaration.availability_evidence_contract;
  const contract = buildAvailabilityEvidenceContract(declaredContract.interpretation_policy);
  if (declaredContract.key !== contract.key ||
      declaredContract.aggregation_policy_key !== contract.aggregation_policy_key ||
      declaredContract.interpretation_policy_key !== contract.interpretation_policy_key ||
      declaredContract.resource_declaration_id !== contract.resource_declaration_id ||
      contract.resource_declaration_id !== declaration.contribution_context.resource_declaration_id ||
      declaration.contribution_context_key !== contextKey ||
      declaration.key !== JSON.stringify(["contribution-availability-applicability", contextKey, contract.key])) {
    throw new Error("Applicability declaration identity mismatch");
  }
  const set = input.current_availability_evidence_state_set;
  if (!set || !Array.isArray(set.resource_assessments)) throw new Error("GROUND-187 Set is required");
  // The exact current Set still has an evaluation instant even when its canonical
  // resource State has null evaluation_at (e.g. no explicit readiness policy).
  const readinessSet = set.availability_source_aggregation_result_interpretation_basis_set
    .availability_source_aggregation_result_set.availability_source_aggregation_readiness_basis_set;
  const at = readinessSet.evaluation_at;
  if (!at || compareTemporalInstants(at, readinessSet.per_source_availability_evidence_state_set.evaluation_at) !== 0 ||
      compareTemporalInstants(at, declaration.contribution_context.evaluation_at) !== 0) {
    throw new Error("Contribution/current availability evaluation_at mismatch");
  }
  const matches = set.resource_assessments.filter(a => a.resource_declaration_id === contract.resource_declaration_id);
  if (matches.length > 1) throw new Error("Duplicate current availability resource assessments");
  const assessment = matches[0] ?? null;
  const base = {
    applicability_declaration: declaration,
    current_availability_evidence_state_set: set,
    evaluation_at: at,
    resource_assessment: assessment,
  };
  if (!assessment) return { ...base, current_contract: null, status: "NO_CURRENT_RESOURCE_EVIDENCE_ASSESSMENT", referenced_evidence_state: null };
  const state = assessment.canonical_state;
  const basis = assessment.interpretation_basis_assessment;
  if (state.resource_declaration_id !== contract.resource_declaration_id ||
      basis.resource_declaration_id !== contract.resource_declaration_id ||
      (state.evaluation_at !== null && compareTemporalInstants(state.evaluation_at, at) !== 0)) {
    throw new Error("Current availability State context mismatch");
  }
  const policy = basis.availability_source_aggregation_result_interpretation_policy_assessment.interpretation_policy;
  if (!policy) return { ...base, current_contract: null, status: "NO_CURRENT_INTERPRETATION_CONTRACT", referenced_evidence_state: null };
  const currentContract = buildAvailabilityEvidenceContract(policy);
  if (currentContract.resource_declaration_id !== state.resource_declaration_id ||
      currentContract.aggregation_policy_key !== state.availability_source_aggregation_policy_key) {
    throw new Error("Current availability State contract lineage mismatch");
  }
  if (currentContract.key !== contract.key) return { ...base, current_contract: currentContract, status: "CURRENT_AVAILABILITY_CONTRACT_MISMATCH", referenced_evidence_state: null };
  return { ...base, current_contract: currentContract, status: "CURRENT_CONTRACT_EVIDENCE_REFERENCED", referenced_evidence_state: state };
}

/**
 * Existing quantity and availability States are the only evidence operands.
 * Missing reference does not fabricate an operand. Unresolved evidence is retained
 * when referenced: referenceability is not evidence resolvedness.
 */
export function composeContributionQuantityAvailabilityEvidence(input: {
  quantity_evaluation_state: ContributionQuantityEvaluationState;
  applicability_declaration: ContributionAvailabilityApplicabilityDeclaration;
  current_availability_evidence_state_set: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSetAssessment;
}): ContributionQuantityAvailabilityCompositionAssessment {
  const quantity = input.quantity_evaluation_state;
  const contextKey = contributionAvailabilityContextKey(contributionAvailabilityContext(quantity));
  if (!input.applicability_declaration || contextKey !== input.applicability_declaration.contribution_context_key) {
    throw new Error("Quantity evaluation does not match declared Applicability context");
  }
  const reference = resolveContributionAvailabilityReference(input);
  const availability = reference.referenced_evidence_state;
  return {
    quantity_evaluation_state: quantity,
    availability_reference_assessment: reference,
    composition: availability === null ? null : {
      key: JSON.stringify(["contribution-quantity-availability-evidence-composition",
        input.applicability_declaration.key, quantity.key,
        quantity.capacity_compatibility_dimension.canonical_capacity_compatibility_evidence_state_key,
        quantity.capacity_compatibility_dimension.canonical_capacity_compatibility_evidence_state_value,
        quantity.required_amount_compatibility_dimension.canonical_required_amount_compatibility_evidence_state_key,
        quantity.required_amount_compatibility_dimension.canonical_required_amount_compatibility_evidence_state_value,
        availability.key, availability.value]),
      applicability_declaration: input.applicability_declaration,
      quantity_evaluation_state: quantity,
      availability_reference_assessment: reference,
      capacity_compatibility_dimension: quantity.capacity_compatibility_dimension,
      required_amount_compatibility_dimension: quantity.required_amount_compatibility_dimension,
      availability_evidence_dimension: availability,
    },
  };
}
