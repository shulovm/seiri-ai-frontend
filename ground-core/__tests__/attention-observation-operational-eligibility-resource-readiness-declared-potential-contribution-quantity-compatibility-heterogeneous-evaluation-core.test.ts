/**
 * GROUND-177 — Observation Core CXXXI / Declared Potential Contribution
 * Quantity-Compatibility Heterogeneous Evaluation State Foundation
 *
 * GROUND-169 + GROUND-175 → heterogeneous quantity-compatibility Evaluation State
 * No scalarization. No ANY/ALL. Asymmetric NOT_APPLICABLE.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-aggregated-declared-potential-contribution-capacity-compatibility-evidence-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-types.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_MODEL_LIMITATIONS,
  DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_DOMAIN,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationStateKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSet,
  toQuantityCompatibilityCapacityDimensionCategory,
  toQuantityCompatibilityRequiredAmountDimensionCategory,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-core.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED = "need";
const CAP = "cap-set";
const REQ = "req-key";
const BINDING = "binding-a";
const RD = "rd-1";
const EVAL_AT = "2026-01-01T00:00:00.000Z";
const EVAL_AT_B = "2026-01-02T00:00:00.000Z";
const CONTRIB = "contrib-decl-key";
const CONTRIB_B = "contrib-decl-key-b";

const CAP_NA =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" as const;
const CAP_UNRESOLVED =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const CAP_SUPPORTING =
  "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_SUPPORTING" as const;
const CAP_CONTRADICTING =
  "EXPLICITLY_INTERPRETED_AGGREGATED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_EVIDENCE_CONTRADICTING" as const;

const REQ_NA =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION" as const;
const REQ_UNRESOLVED =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION" as const;
const REQ_SUPPORTING =
  "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_SUPPORTING" as const;
const REQ_CONTRADICTING =
  "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_CONTRADICTING" as const;

function makeNested161Binding(params: {
  contribution_key: string | null;
  evaluation_at: string;
}) {
  const raw_relation_basis =
    params.contribution_key === null
      ? null
      : {
          key: "raw-basis",
          candidate_key: CAND,
          observation_need_key: NEED,
          capability_requirement_set_key: CAP,
          dimension: "RESOURCE_READINESS" as const,
          observation_resource_requirement_key: REQ,
          resource_readiness_observation_context_binding_key: BINDING,
          resource_declaration_id: RD,
          resource_readiness_evaluation_instant_key: `instant|${params.evaluation_at}`,
          evaluation_at: params.evaluation_at,
          resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
            "ctx",
          physical_potential_contribution_declaration_key:
            params.contribution_key,
          declared_potential_contribution_quantity: {
            kind: "POINT" as const,
            value: 1,
          },
          contribution_required_amount_relation: {} as never,
          contribution_capacity_relation_entries: [],
          capacity_relation_entry_count: 0,
          has_capacity_relation_entries: false,
        };

  return {
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    capacity_relation_interpretation_basis_binding_assessment: {
      observation_resource_requirement_key: REQ,
      resource_readiness_observation_context_binding_key: BINDING,
      resource_declaration_id: RD,
      raw_relation_binding_assessment: {
        observation_resource_requirement_key: REQ,
        resource_readiness_observation_context_binding_key: BINDING,
        resource_declaration_id: RD,
        resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
          "ctx",
        physical_potential_contribution_declaration_assessment: {
          observation_resource_requirement_key: REQ,
          resource_readiness_observation_context_binding_key: BINDING,
          resource_declaration_id: RD,
          resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
            "ctx",
          quantity_relation_binding_assessment: {} as never,
          status:
            params.contribution_key === null
              ? ("NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION" as const)
              : ("EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT" as const),
          declaration:
            params.contribution_key === null
              ? null
              : {
                  key: params.contribution_key,
                  candidate_key: CAND,
                  observation_need_key: NEED,
                  capability_requirement_set_key: CAP,
                  dimension: "RESOURCE_READINESS" as const,
                  observation_resource_requirement_key: REQ,
                  resource_readiness_observation_context_binding_key: BINDING,
                  resource_declaration_id: RD,
                  resource_readiness_evaluation_instant_key: `instant|${params.evaluation_at}`,
                  evaluation_at: params.evaluation_at,
                  declared_potential_contribution_quantity: {
                    kind: "POINT" as const,
                    value: 1,
                  },
                  resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
                    "ctx",
                },
          has_explicit_physical_potential_contribution_declaration:
            params.contribution_key !== null,
        },
        quantity_relation_binding_assessment: {} as never,
        status:
          params.contribution_key === null
            ? ("NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION" as const)
            : ("RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_PRESENT" as const),
        raw_relation_basis,
        has_declared_potential_contribution_raw_relation_basis:
          raw_relation_basis !== null,
        capacity_relation_entry_count: 0,
        has_capacity_relation_entries: false,
      },
      capacity_relation_interpretation_policy_assessment: {} as never,
      capacity_source_interpretation_basis_assessments: [],
      capacity_source_count: 0,
      interpretation_basis_count: 0,
      has_capacity_relation_interpretation_bases: false,
      has_supporting_capacity_relation_interpretations: false,
      has_contradicting_capacity_relation_interpretations: false,
    },
    source_state_assessments: [],
    capacity_source_count: 0,
    canonical_state_count: 0,
    has_supporting_capacity_relation_evidence_states: false,
    has_contradicting_capacity_relation_evidence_states: false,
    has_unresolved_capacity_relation_evidence_states: false,
  };
}

function makeCapacityState(params: {
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue;
  state_key?: string;
  evaluation_at?: string | null;
}): AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceState {
  const evaluation_at =
    params.evaluation_at === undefined
      ? params.value === CAP_NA
        ? null
        : EVAL_AT
      : params.evaluation_at;
  const value = params.value;
  return {
    key:
      params.state_key ??
      `cap-state|${value}|${evaluation_at ?? "NONE"}`,
    candidate_key: CAND,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    evaluation_at,
    capacity_compatibility_source_aggregation_policy_key:
      value === CAP_NA ? null : "agg-policy",
    aggregation_result_interpretation_basis_key:
      value === CAP_SUPPORTING || value === CAP_CONTRADICTING
        ? "interp-basis"
        : null,
    value,
  };
}

function makeRequiredState(params: {
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue;
  state_key?: string;
  contribution_key?: string | null;
  evaluation_at?: string | null;
}): AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState {
  const value = params.value;
  const contribution_key =
    params.contribution_key === undefined
      ? value === REQ_NA
        ? null
        : CONTRIB
      : params.contribution_key;
  const evaluation_at =
    params.evaluation_at === undefined
      ? value === REQ_NA
        ? null
        : EVAL_AT
      : params.evaluation_at;
  return {
    key:
      params.state_key ??
      `req-state|${value}|${contribution_key ?? "NONE"}|${evaluation_at ?? "NONE"}`,
    candidate_key: CAND,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    evaluation_at,
    physical_potential_contribution_declaration_key: contribution_key,
    required_amount_compatibility_basis_key:
      value === REQ_NA ? null : "req-basis",
    unresolved_reasons: [],
    value,
  };
}

function makeCapacityBinding(params: {
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue;
  state_key?: string;
  evaluation_at?: string | null;
  contribution_key?: string | null;
  nested_evaluation_at?: string;
}): AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateBindingAssessment {
  const state = makeCapacityState(params);
  return {
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    aggregation_result_interpretation_basis_assessment: {} as never,
    canonical_state: state,
    canonical_state_value: params.value,
  };
}

function makeRequiredBinding(params: {
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue;
  state_key?: string;
  contribution_key?: string | null;
  evaluation_at?: string | null;
}): AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateBindingAssessment {
  const state = makeRequiredState(params);
  return {
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    required_amount_compatibility_basis_assessment: {} as never,
    canonical_state: state,
    canonical_state_value: params.value,
  };
}

function makeCapacityCandidate(params: {
  bindings: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateBindingAssessment[];
  contribution_key?: string | null;
  nested_evaluation_at?: string;
  nested_bindings?: ReturnType<typeof makeNested161Binding>[];
}): AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment {
  const contribution_key =
    params.contribution_key === undefined ? CONTRIB : params.contribution_key;
  const nested_evaluation_at = params.nested_evaluation_at ?? EVAL_AT;
  const nested_bindings =
    params.nested_bindings ??
    [
      makeNested161Binding({
        contribution_key,
        evaluation_at: nested_evaluation_at,
      }),
    ];

  return {
    candidate_key: CAND,
    capacity_compatibility_source_aggregation_result_interpretation_basis_assessment:
      {
        candidate_key: CAND,
        capacity_compatibility_source_aggregation_result_assessment: {
          candidate_key: CAND,
          capacity_compatibility_source_aggregation_readiness_basis_assessment:
            {
              candidate_key: CAND,
              canonical_per_source_capacity_relation_evidence_state_assessment:
                {
                  candidate_key: CAND,
                  capacity_relation_interpretation_basis_assessment:
                    {} as never,
                  binding_state_assessments: nested_bindings as never,
                  has_supporting_capacity_relation_evidence_states: false,
                  has_contradicting_capacity_relation_evidence_states: false,
                  has_unresolved_capacity_relation_evidence_states: false,
                  model_limitations: [],
                },
              capacity_compatibility_source_aggregation_readiness_policy_assessment:
                {} as never,
              binding_readiness_basis_assessments: [],
              has_aggregation_readiness_bases: false,
              has_aggregation_readiness_condition_holds: false,
              has_aggregation_readiness_condition_does_not_hold: false,
              model_limitations: [],
            },
          binding_aggregation_result_assessments: [],
          has_aggregation_results: false,
          has_aggregation_result_condition_holds: false,
          has_aggregation_result_condition_does_not_hold: false,
          model_limitations: [],
        },
        capacity_compatibility_source_aggregation_result_interpretation_policy_assessment:
          {} as never,
        binding_interpretation_basis_assessments: [],
        has_interpretation_bases: false,
        has_supporting_aggregated_capacity_compatibility_evidence_interpretations:
          false,
        has_contradicting_aggregated_capacity_compatibility_evidence_interpretations:
          false,
        model_limitations: [],
      },
    binding_state_assessments: params.bindings,
    has_applicable_aggregated_capacity_compatibility_evidence_states:
      params.bindings.some((b) => b.canonical_state_value !== CAP_NA),
    has_resolved_aggregated_capacity_compatibility_evidence_states:
      params.bindings.some(
        (b) =>
          b.canonical_state_value === CAP_SUPPORTING ||
          b.canonical_state_value === CAP_CONTRADICTING
      ),
    has_supporting_aggregated_capacity_compatibility_evidence_states:
      params.bindings.some((b) => b.canonical_state_value === CAP_SUPPORTING),
    has_contradicting_aggregated_capacity_compatibility_evidence_states:
      params.bindings.some(
        (b) => b.canonical_state_value === CAP_CONTRADICTING
      ),
    has_unresolved_aggregated_capacity_compatibility_evidence_states:
      params.bindings.some((b) =>
        b.canonical_state_value.startsWith("UNRESOLVED_")
      ),
    model_limitations: [],
  };
}

function makeRequiredCandidate(
  bindings: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateBindingAssessment[]
): AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment {
  return {
    candidate_key: CAND,
    required_amount_compatibility_basis_assessment: {} as never,
    binding_state_assessments: bindings,
    has_applicable_required_amount_compatibility_evidence_states:
      bindings.some((b) => b.canonical_state_value !== REQ_NA),
    has_resolved_required_amount_compatibility_evidence_states: bindings.some(
      (b) =>
        b.canonical_state_value === REQ_SUPPORTING ||
        b.canonical_state_value === REQ_CONTRADICTING
    ),
    has_supporting_required_amount_compatibility_evidence_states:
      bindings.some((b) => b.canonical_state_value === REQ_SUPPORTING),
    has_contradicting_required_amount_compatibility_evidence_states:
      bindings.some((b) => b.canonical_state_value === REQ_CONTRADICTING),
    has_unresolved_required_amount_compatibility_evidence_states:
      bindings.some((b) => b.canonical_state_value.startsWith("UNRESOLVED_")),
    model_limitations: [],
  };
}

function makeCapacitySet(
  candidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateAssessment
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateSetAssessment {
  return {
    resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_result_interpretation_basis_set:
      {} as never,
    candidate_assessments: [candidate],
    has_applicable_aggregated_capacity_compatibility_evidence_states:
      candidate.has_applicable_aggregated_capacity_compatibility_evidence_states,
    has_resolved_aggregated_capacity_compatibility_evidence_states:
      candidate.has_resolved_aggregated_capacity_compatibility_evidence_states,
    has_supporting_aggregated_capacity_compatibility_evidence_states:
      candidate.has_supporting_aggregated_capacity_compatibility_evidence_states,
    has_contradicting_aggregated_capacity_compatibility_evidence_states:
      candidate.has_contradicting_aggregated_capacity_compatibility_evidence_states,
    has_unresolved_aggregated_capacity_compatibility_evidence_states:
      candidate.has_unresolved_aggregated_capacity_compatibility_evidence_states,
    model_limitations: [],
  };
}

function makeRequiredSet(
  candidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateAssessment
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSetAssessment {
  return {
    required_amount_compatibility_basis_set: {} as never,
    candidate_assessments: [candidate],
    has_applicable_required_amount_compatibility_evidence_states:
      candidate.has_applicable_required_amount_compatibility_evidence_states,
    has_resolved_required_amount_compatibility_evidence_states:
      candidate.has_resolved_required_amount_compatibility_evidence_states,
    has_supporting_required_amount_compatibility_evidence_states:
      candidate.has_supporting_required_amount_compatibility_evidence_states,
    has_contradicting_required_amount_compatibility_evidence_states:
      candidate.has_contradicting_required_amount_compatibility_evidence_states,
    has_unresolved_required_amount_compatibility_evidence_states:
      candidate.has_unresolved_required_amount_compatibility_evidence_states,
    model_limitations: [],
  };
}

function build177(params: {
  capacity_value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalAggregatedDeclaredPotentialContributionCapacityCompatibilityEvidenceStateValue;
  required_value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue;
  capacity_state_key?: string;
  required_state_key?: string;
  contribution_key?: string | null;
  capacity_evaluation_at?: string | null;
  required_evaluation_at?: string | null;
  nested_contribution_key?: string | null;
  nested_evaluation_at?: string;
}) {
  const contribution_key =
    params.contribution_key === undefined
      ? params.required_value === REQ_NA
        ? null
        : CONTRIB
      : params.contribution_key;
  const nested_contribution_key =
    params.nested_contribution_key === undefined
      ? contribution_key
      : params.nested_contribution_key;
  const nested_evaluation_at =
    params.nested_evaluation_at ??
    (params.required_evaluation_at === undefined
      ? EVAL_AT
      : params.required_evaluation_at ?? EVAL_AT);

  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSet(
    {
      canonical_capacity_compatibility_evidence_state_set: makeCapacitySet(
        makeCapacityCandidate({
          bindings: [
            makeCapacityBinding({
              value: params.capacity_value,
              state_key: params.capacity_state_key,
              evaluation_at: params.capacity_evaluation_at,
            }),
          ],
          contribution_key: nested_contribution_key,
          nested_evaluation_at,
        })
      ),
      canonical_required_amount_compatibility_evidence_state_set:
        makeRequiredSet(
          makeRequiredCandidate([
            makeRequiredBinding({
              value: params.required_value,
              state_key: params.required_state_key,
              contribution_key,
              evaluation_at: params.required_evaluation_at,
            }),
          ])
        ),
    }
  );
}

function firstBinding(set: ReturnType<typeof build177>) {
  return set.candidate_assessments[0]!.binding_heterogeneous_evaluation_assessments[0]!;
}

describe("GROUND-177 Quantity-Compatibility Heterogeneous Evaluation State", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("domain constant exact", () => {
    assert.equal(
      DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_DOMAIN,
      "DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY"
    );
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_MODEL_LIMITATIONS[0],
      "QUANTITY_COMPATIBILITY_SCALAR_COMPOSITION_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("category helpers map NA / unresolved / SUPPORTING / CONTRADICTING", () => {
    assert.equal(toQuantityCompatibilityCapacityDimensionCategory(CAP_NA), "NOT_APPLICABLE");
    assert.equal(
      toQuantityCompatibilityCapacityDimensionCategory(CAP_UNRESOLVED),
      "UNRESOLVED"
    );
    assert.equal(
      toQuantityCompatibilityCapacityDimensionCategory(CAP_SUPPORTING),
      "SUPPORTING"
    );
    assert.equal(
      toQuantityCompatibilityCapacityDimensionCategory(CAP_CONTRADICTING),
      "CONTRADICTING"
    );
    assert.equal(toQuantityCompatibilityRequiredAmountDimensionCategory(REQ_NA), "NOT_APPLICABLE");
    assert.equal(
      toQuantityCompatibilityRequiredAmountDimensionCategory(REQ_UNRESOLVED),
      "UNRESOLVED"
    );
    assert.equal(
      toQuantityCompatibilityRequiredAmountDimensionCategory(REQ_SUPPORTING),
      "SUPPORTING"
    );
    assert.equal(
      toQuantityCompatibilityRequiredAmountDimensionCategory(REQ_CONTRADICTING),
      "CONTRADICTING"
    );
  });

  it("both SUPPORTING preserves pair without scalar result", () => {
    const binding = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_SUPPORTING,
      })
    );
    assert.equal(
      binding.status,
      "DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_STATE_PRESENT"
    );
    assert.equal(binding.has_evaluation_state, true);
    assert.ok(binding.evaluation_state);
    assert.equal(
      binding.evaluation_state!.capacity_compatibility_dimension.category,
      "SUPPORTING"
    );
    assert.equal(
      binding.evaluation_state!.required_amount_compatibility_dimension.category,
      "SUPPORTING"
    );
    assert.equal(
      binding.evaluation_state!.capacity_compatibility_dimension
        .canonical_capacity_compatibility_evidence_state_value,
      CAP_SUPPORTING
    );
    assert.equal(
      binding.evaluation_state!.required_amount_compatibility_dimension
        .canonical_required_amount_compatibility_evidence_state_value,
      REQ_SUPPORTING
    );
    assert.equal(
      "result" in binding.evaluation_state!,
      false
    );
  });

  it("capacity SUPPORTING / required CONTRADICTING retains both", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_CONTRADICTING,
      })
    ).evaluation_state!;
    assert.equal(state.capacity_compatibility_dimension.category, "SUPPORTING");
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "CONTRADICTING"
    );
  });

  it("capacity CONTRADICTING / required SUPPORTING retains both", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_CONTRADICTING,
        required_value: REQ_SUPPORTING,
      })
    ).evaluation_state!;
    assert.equal(
      state.capacity_compatibility_dimension.category,
      "CONTRADICTING"
    );
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "SUPPORTING"
    );
  });

  it("both CONTRADICTING retains both without scalar negative", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_CONTRADICTING,
        required_value: REQ_CONTRADICTING,
      })
    ).evaluation_state!;
    assert.equal(
      state.capacity_compatibility_dimension.category,
      "CONTRADICTING"
    );
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "CONTRADICTING"
    );
  });

  it("SUPPORTING / unresolved preserves pair", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_UNRESOLVED,
      })
    ).evaluation_state!;
    assert.equal(state.capacity_compatibility_dimension.category, "SUPPORTING");
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "UNRESOLVED"
    );
  });

  it("CONTRADICTING / unresolved preserves pair", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_CONTRADICTING,
        required_value: REQ_UNRESOLVED,
      })
    ).evaluation_state!;
    assert.equal(
      state.capacity_compatibility_dimension.category,
      "CONTRADICTING"
    );
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "UNRESOLVED"
    );
  });

  it("unresolved / SUPPORTING preserves pair", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_UNRESOLVED,
        required_value: REQ_SUPPORTING,
        capacity_evaluation_at: EVAL_AT,
      })
    ).evaluation_state!;
    assert.equal(state.capacity_compatibility_dimension.category, "UNRESOLVED");
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "SUPPORTING"
    );
  });

  it("both unresolved preserves independently", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_UNRESOLVED,
        required_value: REQ_UNRESOLVED,
        capacity_evaluation_at: EVAL_AT,
      })
    ).evaluation_state!;
    assert.equal(state.capacity_compatibility_dimension.category, "UNRESOLVED");
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "UNRESOLVED"
    );
  });

  it("capacity NA / required SUPPORTING → State PRESENT (axis NA only)", () => {
    const binding = firstBinding(
      build177({
        capacity_value: CAP_NA,
        required_value: REQ_SUPPORTING,
      })
    );
    assert.equal(
      binding.status,
      "DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_STATE_PRESENT"
    );
    assert.equal(
      binding.evaluation_state!.capacity_compatibility_dimension.category,
      "NOT_APPLICABLE"
    );
    assert.equal(
      binding.evaluation_state!.required_amount_compatibility_dimension.category,
      "SUPPORTING"
    );
  });

  it("capacity NA / required CONTRADICTING → State PRESENT", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_NA,
        required_value: REQ_CONTRADICTING,
      })
    ).evaluation_state!;
    assert.equal(
      state.capacity_compatibility_dimension.category,
      "NOT_APPLICABLE"
    );
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "CONTRADICTING"
    );
  });

  it("capacity NA / required unresolved → State PRESENT", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_NA,
        required_value: REQ_UNRESOLVED,
      })
    ).evaluation_state!;
    assert.equal(
      state.capacity_compatibility_dimension.category,
      "NOT_APPLICABLE"
    );
    assert.equal(
      state.required_amount_compatibility_dimension.category,
      "UNRESOLVED"
    );
  });

  it("required NA → whole NOT_APPLICABLE with null evaluation_state", () => {
    const binding = firstBinding(
      build177({
        capacity_value: CAP_NA,
        required_value: REQ_NA,
        contribution_key: null,
        nested_contribution_key: null,
      })
    );
    assert.equal(
      binding.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION"
    );
    assert.equal(binding.evaluation_state, null);
    assert.equal(binding.has_evaluation_state, false);
  });

  it("required NA + capacity unresolved → whole NOT_APPLICABLE", () => {
    const binding = firstBinding(
      build177({
        capacity_value: CAP_UNRESOLVED,
        required_value: REQ_NA,
        contribution_key: null,
        nested_contribution_key: null,
        capacity_evaluation_at: EVAL_AT,
      })
    );
    assert.equal(
      binding.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION"
    );
    assert.equal(binding.evaluation_state, null);
  });

  it("required NA + capacity SUPPORTING rejects malformed", () => {
    assert.throws(
      () =>
        build177({
          capacity_value: CAP_SUPPORTING,
          required_value: REQ_NA,
          contribution_key: null,
          nested_contribution_key: null,
        }),
      /no contribution subject/
    );
  });

  it("required NA + capacity CONTRADICTING rejects malformed", () => {
    assert.throws(
      () =>
        build177({
          capacity_value: CAP_CONTRADICTING,
          required_value: REQ_NA,
          contribution_key: null,
          nested_contribution_key: null,
        }),
      /no contribution subject/
    );
  });

  it("cross-instant mismatch rejects", () => {
    assert.throws(
      () =>
        build177({
          capacity_value: CAP_SUPPORTING,
          required_value: REQ_SUPPORTING,
          capacity_evaluation_at: EVAL_AT,
          required_evaluation_at: EVAL_AT_B,
          nested_evaluation_at: EVAL_AT,
        }),
      /evaluation_at mismatch/
    );
  });

  it("contribution-key mismatch rejects", () => {
    assert.throws(
      () =>
        build177({
          capacity_value: CAP_SUPPORTING,
          required_value: REQ_SUPPORTING,
          contribution_key: CONTRIB,
          nested_contribution_key: CONTRIB_B,
        }),
      /contribution-key mismatch/
    );
  });

  it("missing capacity Binding rejects", () => {
    assert.throws(() => {
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSet(
        {
          canonical_capacity_compatibility_evidence_state_set: makeCapacitySet(
            makeCapacityCandidate({ bindings: [] })
          ),
          canonical_required_amount_compatibility_evidence_state_set:
            makeRequiredSet(
              makeRequiredCandidate([
                makeRequiredBinding({ value: REQ_SUPPORTING }),
              ])
            ),
        }
      );
    }, /no matching GROUND-169/);
  });

  it("extra unmatched capacity Binding rejects", () => {
    const extra = makeCapacityBinding({ value: CAP_SUPPORTING });
    const extraMut = {
      ...extra,
      observation_resource_requirement_key: "req-extra",
      canonical_state: {
        ...extra.canonical_state,
        observation_resource_requirement_key: "req-extra",
        key: "cap-extra",
      },
    };
    assert.throws(() => {
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSet(
        {
          canonical_capacity_compatibility_evidence_state_set: makeCapacitySet(
            makeCapacityCandidate({
              bindings: [
                makeCapacityBinding({ value: CAP_SUPPORTING }),
                extraMut,
              ],
            })
          ),
          canonical_required_amount_compatibility_evidence_state_set:
            makeRequiredSet(
              makeRequiredCandidate([
                makeRequiredBinding({ value: REQ_SUPPORTING }),
              ])
            ),
        }
      );
    }, /no matching GROUND-175/);
  });

  it("duplicate Binding rejects", () => {
    assert.throws(() => {
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSet(
        {
          canonical_capacity_compatibility_evidence_state_set: makeCapacitySet(
            makeCapacityCandidate({
              bindings: [
                makeCapacityBinding({ value: CAP_SUPPORTING }),
                makeCapacityBinding({
                  value: CAP_SUPPORTING,
                  state_key: "dup-cap",
                }),
              ],
            })
          ),
          canonical_required_amount_compatibility_evidence_state_set:
            makeRequiredSet(
              makeRequiredCandidate([
                makeRequiredBinding({ value: REQ_SUPPORTING }),
                makeRequiredBinding({
                  value: REQ_SUPPORTING,
                  state_key: "dup-req",
                }),
              ])
            ),
        }
      );
    }, /duplicate Binding/);
  });

  it("same categories / different capacity State key → distinct Evaluation State key", () => {
    const a = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_SUPPORTING,
        capacity_state_key: "cap-A",
        required_state_key: "req-shared",
      })
    ).evaluation_state!;
    const b = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_SUPPORTING,
        capacity_state_key: "cap-C",
        required_state_key: "req-shared",
      })
    ).evaluation_state!;
    assert.notEqual(a.key, b.key);
    assert.equal(a.capacity_compatibility_dimension.category, "SUPPORTING");
    assert.equal(b.capacity_compatibility_dimension.category, "SUPPORTING");
  });

  it("same categories / different required State key → distinct Evaluation State key", () => {
    const a = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_SUPPORTING,
        capacity_state_key: "cap-shared",
        required_state_key: "req-B",
      })
    ).evaluation_state!;
    const b = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_SUPPORTING,
        capacity_state_key: "cap-shared",
        required_state_key: "req-D",
      })
    ).evaluation_state!;
    assert.notEqual(a.key, b.key);
  });

  it("input permutation yields same semantic output", () => {
    const forward = build177({
      capacity_value: CAP_SUPPORTING,
      required_value: REQ_CONTRADICTING,
      capacity_state_key: "cap-same",
      required_state_key: "req-same",
    });
    const reverseInput = {
      canonical_required_amount_compatibility_evidence_state_set:
        forward.canonical_required_amount_compatibility_evidence_state_set,
      canonical_capacity_compatibility_evidence_state_set:
        forward.canonical_capacity_compatibility_evidence_state_set,
    };
    const reverse =
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationSet(
        reverseInput
      );
    assert.equal(
      firstBinding(forward).evaluation_state!.key,
      firstBinding(reverse).evaluation_state!.key
    );
  });

  it("Evaluation State identity includes both axis State keys and values", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_SUPPORTING,
        capacity_state_key: "cap-id",
        required_state_key: "req-id",
      })
    ).evaluation_state!;
    assert.equal(
      state.key,
      attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionQuantityCompatibilityHeterogeneousEvaluationStateKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED,
          capability_requirement_set_key: CAP,
          observation_resource_requirement_key: REQ,
          resource_readiness_observation_context_binding_key: BINDING,
          resource_declaration_id: RD,
          evaluation_at: EVAL_AT,
          physical_potential_contribution_declaration_key: CONTRIB,
          ground169_state_key: "cap-id",
          ground169_state_value: CAP_SUPPORTING,
          ground175_state_key: "req-id",
          ground175_state_value: REQ_SUPPORTING,
        }
      )
    );
  });

  it("no whole-state scalarization vocabulary on Evaluation State fields", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-core.ts"
      ),
      "utf8"
    );
    const types = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-types.ts"
      ),
      "utf8"
    );
    assert.ok(!/\bQUANTITY_COMPATIBILITY_SUPPORTING\b/.test(core + types));
    assert.ok(!/\bQUANTITY_COMPATIBILITY_CONTRADICTING\b/.test(core + types));
    assert.ok(!/\bresult_value\b/.test(types));
    assert.ok(!/\bis_overall_resolved\b/.test(types));
    assert.match(
      types,
      /DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_COMPATIBILITY_HETEROGENEOUS_EVALUATION_STATE_PRESENT/
    );
    assert.ok(!/\bresult\s*:/.test(types));
  });

  it("no ANY/ALL / Composition Policy / readiness / availability imports", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-core.ts"
      ),
      "utf8"
    );
    assert.ok(!/\bANY_SELECTED|\bALL_SELECTED|executeAny|executeAll/.test(core));
    assert.ok(!/CompositionPolicy|RequiredDimensionPolicy/.test(core));
    assert.ok(
      !/from "\.\/.*resource-availability|from "\.\/.*resource-reservation|from "\.\/.*feasibility/.test(
        core
      )
    );
  });

  it("no ProjectState / persistence mutation imports", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-quantity-compatibility-heterogeneous-evaluation-core.ts"
      ),
      "utf8"
    );
    assert.ok(!/applyPatch|saveProject/.test(core));
    assert.ok(!/^import .*ProjectState/m.test(core));
    assert.ok(!/^import .*StatePatch/m.test(core));
  });

  it("preserves exact axis lineage keys", () => {
    const state = firstBinding(
      build177({
        capacity_value: CAP_SUPPORTING,
        required_value: REQ_SUPPORTING,
        capacity_state_key: "exact-cap-key",
        required_state_key: "exact-req-key",
      })
    ).evaluation_state!;
    assert.equal(
      state.capacity_compatibility_dimension
        .canonical_capacity_compatibility_evidence_state_key,
      "exact-cap-key"
    );
    assert.equal(
      state.required_amount_compatibility_dimension
        .canonical_required_amount_compatibility_evidence_state_key,
      "exact-req-key"
    );
  });
});
