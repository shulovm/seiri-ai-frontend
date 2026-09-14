import type { ResourceDeclaration, ResourceAvailabilityDeclaration } from "../../types.js";
import { buildDeclaredResourceAvailabilitySourceAggregationPolicySet } from "../../reality/declared-resource-availability-source-aggregation-policy-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet } from "../../reality/declared-resource-availability-source-aggregation-result-interpretation-policy-core.js";
import { buildAvailabilityEvidenceContract, contributionAvailabilityContext, contributionAvailabilityContextKey, declareContributionAvailabilityApplicability } from "../../reality/contribution-availability-applicability-core.js";
import type { AvailabilityEvidenceContract, ContributionQuantityEvaluationState } from "../../reality/contribution-availability-applicability-types.js";
export const at = "2026-09-02T12:00:00.000Z";
export const resource: ResourceDeclaration = {
  id: "r", project_id: "p", holder_entity_id: "h", resource_key: "water", unit: "litre",
  scope: { kind: "UNSCOPED" }, resource_entity_id: null, description: null,
  valid_from: at, valid_until: null, declared_by: { kind: "human" }, recorded_at: at,
  created_at: at, updated_at: at,
};
export const source: ResourceAvailabilityDeclaration = {
  id: "s", project_id: "p", resource_declaration_id: "r", status: "AVAILABLE",
  valid_from: at, valid_until: null, declared_by: { kind: "human" }, recorded_at: at,
  note: null, created_at: at, updated_at: at,
};
export function policy(options: { inverted?: boolean; empty?: boolean; absent?: boolean; operator?: "ANY" | "ALL" } = {}) {
  const aggregation = buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: [resource], resource_availability_declarations: [source],
    specification: { policies: [{ resource_declaration_id: "r", selected_availability_declaration_ids: ["s"], operator: options.operator ?? "ANY" }] },
  });
  return buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet({
    availability_source_aggregation_policy_set: aggregation,
    specification: { policies: options.absent ? [] : [{
      availability_source_aggregation_policy_key: aggregation.aggregation_policies[0]!.key,
      mappings: options.empty ? [] : [{
        source_result_value: "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS",
        interpretation: options.inverted
          ? "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE"
          : "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE",
      }],
    }] },
  }).resource_assessments[0]!.interpretation_policy;
}
export function quantity(): ContributionQuantityEvaluationState {
  return {
    key: "177-current-evidence", candidate_key: "candidate", observation_need_key: "need",
    capability_requirement_set_key: "requirements", dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: "requirement", resource_readiness_observation_context_binding_key: "binding",
    resource_declaration_id: "r", evaluation_at: at, physical_potential_contribution_declaration_key: "contribution",
    capacity_compatibility_dimension: {
      canonical_capacity_compatibility_evidence_state_key: "capacity-state",
      canonical_capacity_compatibility_evidence_state_value: "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_SUPPORTING",
      category: "SUPPORTING",
    },
    required_amount_compatibility_dimension: {
      canonical_required_amount_compatibility_evidence_state_key: "required-state",
      canonical_required_amount_compatibility_evidence_state_value: "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_SUPPORTING",
      category: "SUPPORTING",
    },
  };
}
export function specification(q: ContributionQuantityEvaluationState, c: AvailabilityEvidenceContract) {
  return { contribution_context_key: contributionAvailabilityContextKey(contributionAvailabilityContext(q)), availability_evidence_contract_key: c.key };
}
export function declare(q = quantity(), c = buildAvailabilityEvidenceContract(policy()!)) {
  return declareContributionAvailabilityApplicability({ quantity_evaluation_state: q, availability_evidence_contract: c, specification: specification(q, c) });
}


import { buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet } from "../../reality/declared-resource-availability-per-source-evidence-state-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet } from "../../reality/declared-resource-availability-source-aggregation-readiness-policy-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet } from "../../reality/declared-resource-availability-source-aggregation-readiness-basis-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationResultSet } from "../../reality/declared-resource-availability-source-aggregation-result-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSet } from "../../reality/declared-resource-availability-source-aggregation-result-interpretation-basis-core.js";
import { buildCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSet } from "../../reality/canonical-selected-source-aggregated-declared-resource-availability-evidence-state-core.js";

/** Exercise the real 179–187 builders, including unusual interpretations. */
export function currentAvailability(options: {
  status?: "AVAILABLE" | "UNAVAILABLE"; missing?: boolean; noReadiness?: boolean;
  noInterpretation?: boolean; emptyMappings?: boolean; inverted?: boolean;
  operator?: "ANY" | "ALL"; evaluationAt?: string;
} = {}) {
  const aggregation = buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: [resource], resource_availability_declarations: [source],
    specification: { policies: [{ resource_declaration_id: "r", selected_availability_declaration_ids: ["s"], operator: options.operator ?? "ANY" }] },
  });
  const aggregationKey = aggregation.aggregation_policies[0]!.key;
  const interpretation = buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet({
    availability_source_aggregation_policy_set: aggregation,
    specification: { policies: options.noInterpretation ? [] : [{
      availability_source_aggregation_policy_key: aggregationKey,
      mappings: options.emptyMappings ? [] : [{
        source_result_value: "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS",
        interpretation: options.inverted
          ? "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE"
          : "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE",
      }, {
        source_result_value: "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD",
        interpretation: options.inverted
          ? "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE"
          : "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE",
      }],
    }] },
  });
  const readiness = buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet({
    availability_source_aggregation_policy_set: aggregation,
    specification: { policies: options.noReadiness ? [] : [{
      availability_source_aggregation_policy_key: aggregationKey,
      rule: "REQUIRE_ALL_SELECTED_AVAILABILITY_SOURCE_EVIDENCE_STATES_PRESENT_AND_RESOLVED_BEFORE_AGGREGATION",
    }] },
  });
  const states = buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet({
    resource_availability_declarations: options.missing ? [] : [{ ...source, status: options.status ?? "AVAILABLE" }],
    evaluation_at: options.evaluationAt ?? at,
  });
  const basis = buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet({
    per_source_availability_evidence_state_set: states,
    availability_source_aggregation_readiness_policy_set: readiness,
  });
  const result = buildDeclaredResourceAvailabilitySourceAggregationResultSet({ availability_source_aggregation_readiness_basis_set: basis });
  const interpretationBasis = buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSet({
    availability_source_aggregation_result_set: result,
    availability_source_aggregation_result_interpretation_policy_set: interpretation,
  });
  return {
    policy: interpretation.resource_assessments[0]!.interpretation_policy,
    states: buildCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSet({ availability_source_aggregation_result_interpretation_basis_set: interpretationBasis }),
  };
}
