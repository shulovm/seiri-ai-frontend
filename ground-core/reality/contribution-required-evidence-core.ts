import { isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState as capacityApplicable, isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState as capacityResolved, isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState as capacityUnresolved } from "./attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state-core.js";
import { isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState as amountApplicable, isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState as amountResolved, isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState as amountUnresolved } from "./attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-core.js";
import { isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateApplicable as availabilityApplicable, isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResolved as availabilityResolved, isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateUnresolved as availabilityUnresolved } from "./canonical-selected-source-aggregated-declared-resource-availability-evidence-state-core.js";
import { buildAvailabilityEvidenceContract, contributionAvailabilityContext, contributionAvailabilityContextKey } from "./contribution-availability-applicability-core.js";
import { resolveContributionAvailabilityReference } from "./contribution-availability-composition-core.js";
import type { ContributionAvailabilityContext } from "./contribution-availability-applicability-types.js";
import type { ContributionEvidenceBinding, ContributionRequiredEvidenceSpecification, ContributionRequiredEvidenceDeclaration, ContributionRequiredEvidenceInput, ContributionRequiredEvidenceAssessment, ContributionRequiredEvidenceDimension, ContributionRequiredEvidenceDimensionAssessment } from "./contribution-required-evidence-types.js";

const dimensions: readonly ContributionRequiredEvidenceDimension[] = ["CAPACITY_COMPATIBILITY", "REQUIRED_AMOUNT_COMPATIBILITY", "AVAILABILITY_EVIDENCE"];
function bindingIdentity(b: ContributionEvidenceBinding): string {
  const fields = [b.key, b.candidate_key, b.observation_need_key, b.capability_requirement_set_key, b.observation_resource_requirement_key, b.resource_declaration_id];
  if (fields.some(v => typeof v !== "string" || v.length === 0)) throw new Error("Canonical Binding identity is required");
  return JSON.stringify(fields);
}
function contextBinding(c: ContributionAvailabilityContext): ContributionEvidenceBinding {
  return { key: c.resource_readiness_observation_context_binding_key, candidate_key: c.candidate_key,
    observation_need_key: c.observation_need_key, capability_requirement_set_key: c.capability_requirement_set_key,
    observation_resource_requirement_key: c.observation_resource_requirement_key, resource_declaration_id: c.resource_declaration_id };
}
/** Existing 133 subject; 159 precedent discards evaluation/current quantity from Binding policy identity.
 * 061 pattern only: explicit required set is normalized into declaration identity.
 * No global cardinality, policy precedence, consumer verdict or new persisted entity.
 */
export function declareContributionRequiredEvidence(input: {
  binding: ContributionEvidenceBinding; specification: ContributionRequiredEvidenceSpecification;
}): ContributionRequiredEvidenceDeclaration {
  const { binding, specification } = input;
  const identity = bindingIdentity(binding);
  if (!specification || specification.binding_key !== binding.key || !Array.isArray(specification.required_dimensions)) {
    throw new Error("Explicit required evidence specification must target this Binding");
  }
  if (specification.required_dimensions.some(d => !dimensions.includes(d))) throw new Error("Unknown contribution evidence dimension");
  const required = dimensions.filter(d => specification.required_dimensions.includes(d));
  return { key: JSON.stringify(["contribution-required-evidence", identity, required]), binding, required_dimensions: required };
}

/** Coverage consumes independent operands. No source evidence, mapping or quantity recomputation. */
export function assessContributionRequiredEvidence(input: ContributionRequiredEvidenceInput): ContributionRequiredEvidenceAssessment {
  const { declaration, contribution_context: context, quantity_evaluation_state: quantity,
    availability_reference_assessment: reference, availability_evidence_contract: contract } = input;
  const rebuilt = declareContributionRequiredEvidence({ binding: declaration.binding,
    specification: { binding_key: declaration.binding.key, required_dimensions: declaration.required_dimensions } });
  if (rebuilt.key !== declaration.key) throw new Error("Required evidence declaration identity mismatch");
  if (bindingIdentity(declaration.binding) !== bindingIdentity(contextBinding(context))) throw new Error("Evaluation target does not belong to declared Binding");
  const contextKey = contributionAvailabilityContextKey(context);
  const boundQuantity = quantity && contributionAvailabilityContextKey(contributionAvailabilityContext(quantity)) === contextKey ? quantity : null;
  let availability = null;
  if (contract) {
    const rebuiltContract = buildAvailabilityEvidenceContract(contract.interpretation_policy);
    if (JSON.stringify([contract.key, contract.resource_declaration_id, contract.aggregation_policy_key, contract.interpretation_policy_key]) !==
        JSON.stringify([rebuiltContract.key, rebuiltContract.resource_declaration_id, rebuiltContract.aggregation_policy_key, rebuiltContract.interpretation_policy_key]) ||
        contract.resource_declaration_id !== context.resource_declaration_id) throw new Error("Target availability contract identity mismatch");
  }
  if (reference && contract && reference.applicability_declaration.contribution_context_key === contextKey &&
      reference.applicability_declaration.availability_evidence_contract.key === contract.key) {
    // Reuse reference authority/lineage checks, never trust a detached copied status/state.
    const verified = resolveContributionAvailabilityReference(reference);
    if (verified.status !== reference.status || verified.referenced_evidence_state !== reference.referenced_evidence_state ||
        verified.evaluation_at !== reference.evaluation_at) throw new Error("Availability reference assessment lineage mismatch");
    availability = verified.referenced_evidence_state;
  }
  const assessments: ContributionRequiredEvidenceDimensionAssessment[] = rebuilt.required_dimensions.map(d => {
    if (d === "CAPACITY_COMPATIBILITY" && boundQuantity) {
      const operand = boundQuantity.capacity_compatibility_dimension;
      const value = operand.canonical_capacity_compatibility_evidence_state_value;
      return { dimension: d, coverage: "REPRESENTED", operand, canonical_classification: {
        is_applicable: capacityApplicable(value), is_resolved: capacityResolved(value), is_unresolved: capacityUnresolved(value) } };
    }
    if (d === "REQUIRED_AMOUNT_COMPATIBILITY" && boundQuantity) {
      const operand = boundQuantity.required_amount_compatibility_dimension;
      const value = operand.canonical_required_amount_compatibility_evidence_state_value;
      return { dimension: d, coverage: "REPRESENTED", operand, canonical_classification: {
        is_applicable: amountApplicable(value), is_resolved: amountResolved(value), is_unresolved: amountUnresolved(value) } };
    }
    if (d === "AVAILABILITY_EVIDENCE" && availability) {
      return { dimension: d, coverage: "REPRESENTED", operand: availability, canonical_classification: {
        is_applicable: availabilityApplicable(availability.value), is_resolved: availabilityResolved(availability.value), is_unresolved: availabilityUnresolved(availability.value) } };
    }
    return { dimension: d, coverage: "NOT_REPRESENTED", operand: null, canonical_classification: null };
  });
  const represented = assessments.filter(a => a.coverage === "REPRESENTED");
  return { ...input, required_dimension_assessments: assessments, summary: {
    required_count: assessments.length, represented_count: represented.length,
    not_represented_count: assessments.length - represented.length,
    canonically_resolved_count: represented.filter(a => a.canonical_classification.is_resolved).length,
    canonically_unresolved_count: represented.filter(a => a.canonical_classification.is_unresolved).length,
    canonically_not_applicable_count: represented.filter(a => !a.canonical_classification.is_applicable).length,
  } };
}
