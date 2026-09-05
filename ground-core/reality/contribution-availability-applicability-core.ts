/**
 * Stable Availability Evidence Contract + explicit Applicability declaration.
 * Authorities: 185 for contract; 177 for subject; runtime specification for relation.
 * No 187 input: current evidence changes cannot alter this declaration identity.
 * No persistence, raw source lookup, source selection, evidence interpretation or verdict.
 */
import type { DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy } from "./declared-resource-availability-source-aggregation-result-interpretation-policy-types.js";
import type {
  AvailabilityEvidenceContract, ContributionAvailabilityContext,
  ContributionAvailabilityApplicabilityDeclaration,
  ContributionAvailabilityApplicabilitySpecification, ContributionQuantityEvaluationState,
} from "./contribution-availability-applicability-types.js";

function requireKey(value: string, field: string): void {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing ${field}`);
  }
}

/** Keys are opaque upstream identities, never recomputed from evidence or mappings. */
export function availabilityEvidenceContractKey(aggregationPolicyKey: string, interpretationPolicyKey: string): string {
  requireKey(aggregationPolicyKey, "aggregation policy key");
  requireKey(interpretationPolicyKey, "interpretation policy key");
  return JSON.stringify(["availability-evidence-contract", aggregationPolicyKey, interpretationPolicyKey]);
}

/** Absence is not a contract. Callers must supply an existing canonical 185 policy. */
export function buildAvailabilityEvidenceContract(
  policy: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicy,
): AvailabilityEvidenceContract {
  if (!policy || !policy.availability_source_aggregation_policy) {
    throw new Error("An existing interpretation policy and aggregation policy are required");
  }
  const aggregation = policy.availability_source_aggregation_policy;
  requireKey(policy.resource_declaration_id, "resource declaration id");
  if (policy.availability_source_aggregation_policy_key !== aggregation.key ||
      policy.resource_declaration_id !== aggregation.resource_declaration_id) {
    throw new Error("Interpretation/aggregation policy subject mismatch");
  }
  return {
    key: availabilityEvidenceContractKey(aggregation.key, policy.key),
    resource_declaration_id: policy.resource_declaration_id,
    aggregation_policy_key: aggregation.key,
    interpretation_policy_key: policy.key,
    interpretation_policy: policy,
  };
}

export function contributionAvailabilityContextKey(context: ContributionAvailabilityContext): string {
  const values = [context.candidate_key, context.observation_need_key,
    context.capability_requirement_set_key, context.observation_resource_requirement_key,
    context.resource_readiness_observation_context_binding_key, context.resource_declaration_id,
    context.evaluation_at, context.physical_potential_contribution_declaration_key];
  values.forEach(value => requireKey(value, "contribution context identity"));
  return JSON.stringify(["contribution-availability-context", ...values]);
}

/** Extract only the already-authoritative 177 subject, not either evidence dimension. */
export function contributionAvailabilityContext(state: ContributionQuantityEvaluationState): ContributionAvailabilityContext {
  if (!state || state.dimension !== "RESOURCE_READINESS") {
    throw new Error("An existing GROUND-177 quantity evaluation state is required");
  }
  const context: ContributionAvailabilityContext = {
    candidate_key: state.candidate_key,
    observation_need_key: state.observation_need_key,
    capability_requirement_set_key: state.capability_requirement_set_key,
    observation_resource_requirement_key: state.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key: state.resource_readiness_observation_context_binding_key,
    resource_declaration_id: state.resource_declaration_id,
    evaluation_at: state.evaluation_at,
    physical_potential_contribution_declaration_key: state.physical_potential_contribution_declaration_key,
  };
  contributionAvailabilityContextKey(context);
  return context;
}

export function declareContributionAvailabilityApplicability(input: {
  quantity_evaluation_state: ContributionQuantityEvaluationState;
  availability_evidence_contract: AvailabilityEvidenceContract;
  specification: ContributionAvailabilityApplicabilitySpecification;
}): ContributionAvailabilityApplicabilityDeclaration {
  if (!input.specification) throw new Error("Explicit Applicability specification is required");
  const context = contributionAvailabilityContext(input.quantity_evaluation_state);
  const contextKey = contributionAvailabilityContextKey(context);
  const contract = input.availability_evidence_contract;
  if (!contract) throw new Error("An existing Availability Evidence Contract is required");
  // Structural wrapper integrity only. Preserve the supplied canonical policy authority.
  const authoritative = buildAvailabilityEvidenceContract(contract.interpretation_policy);
  if (contract.key !== authoritative.key ||
      contract.resource_declaration_id !== authoritative.resource_declaration_id ||
      contract.aggregation_policy_key !== authoritative.aggregation_policy_key ||
      contract.interpretation_policy_key !== authoritative.interpretation_policy_key) {
    throw new Error("Availability Evidence Contract identity mismatch");
  }
  if (context.resource_declaration_id !== contract.resource_declaration_id) {
    throw new Error("Contribution/availability contract resource mismatch");
  }
  if (input.specification.contribution_context_key !== contextKey ||
      input.specification.availability_evidence_contract_key !== contract.key) {
    throw new Error("Applicability specification does not target this exact context and contract");
  }
  return {
    key: JSON.stringify(["contribution-availability-applicability", contextKey, contract.key]),
    contribution_context_key: contextKey,
    contribution_context: context,
    availability_evidence_contract: contract,
  };
}
