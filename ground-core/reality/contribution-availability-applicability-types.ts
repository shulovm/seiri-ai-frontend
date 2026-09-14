/**
 * Stable contract references and explicit contribution-contextual applicability.
 * Derived, runtime-only. No current availability resolution or composition verdict.
 * Human decision: aggregation + interpretation policy identify the contract.
 */
import type { DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy } from "./declared-resource-availability-source-aggregation-result-interpretation-policy-types.js";
import type { AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationState } from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-types.js";

export type ContributionQuantityEvaluationState = AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationState;

/** Existing 185 authority retained exactly; no source selection or mapping execution. */
export interface AvailabilityEvidenceContract {
  key: string;
  resource_declaration_id: string;
  aggregation_policy_key: string;
  interpretation_policy_key: string;
  interpretation_policy: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy;
}

/** Subject identity, not current quantity evidence identity. */
export type ContributionAvailabilityContext = Pick<ContributionQuantityEvaluationState,
  "candidate_key" | "observation_need_key" | "capability_requirement_set_key" |
  "observation_resource_requirement_key" | "resource_readiness_observation_context_binding_key" |
  "resource_declaration_id" | "evaluation_at" | "physical_potential_contribution_declaration_key">;

/** Sole declaration authority. Every entry explicitly names a context and contract. */
export interface ContributionAvailabilityApplicabilitySpecification {
  contribution_context_key: string;
  availability_evidence_contract_key: string;
}

/**
 * One explicit reference relation. No exclusivity/cardinality rule across declarations.
 * Applicability is not evidence presence, temporal alignment, authorization or readiness.
 */
export interface ContributionAvailabilityApplicabilityDeclaration {
  key: string;
  contribution_context_key: string;
  contribution_context: ContributionAvailabilityContext;
  availability_evidence_contract: AvailabilityEvidenceContract;
}
