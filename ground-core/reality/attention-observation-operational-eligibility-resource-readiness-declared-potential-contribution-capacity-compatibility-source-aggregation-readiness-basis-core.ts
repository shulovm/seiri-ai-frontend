import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Current Declared Potential Contribution Capacity-Compatibility
 * Source Aggregation Readiness Basis (GROUND-165).
 *
 * Pure composition of:
 *   GROUND-161 current canonical per-source evidence State Set
 *   + GROUND-164 Aggregation Readiness Policy Set
 *
 * GROUND-164 nests exact GROUND-163 Aggregation Policy (members + operator);
 * GROUND-163 is not a separate semantic input.
 *
 * Answers only whether the declared all-selected-resolved readiness rule
 * currently HOLDS over explicitly selected capacity sources.
 *
 * Must not execute ANY/ALL. Must not emit Aggregation Result.
 * Must not short-circuit. Must not treat CONTRADICTING as unresolved.
 * Must not use unselected sources. Must not import project persistence / OE.
 *
 * readiness HOLDS ≠ Aggregation Result HOLDS ≠ compatibility true
 * MISSING ≠ CONTRADICTING ≠ unresolved-policy ≠ unresolved-mapping
 */

import {
  isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasis,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessCondition,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisModelLimitation[] =
  [
    "CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_OPERATOR_NOT_EXECUTED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
    "AGGREGATED_CAPACITY_COMPATIBILITY_EVIDENCE_STATE_NOT_MODELED",
    "MULTIPLE_CAPACITY_SOURCE_AGGREGATION_GROUPS_PER_BINDING_NOT_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_CONTRIBUTION_EVIDENCE_COMPOSITION_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED",
    "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "CROSS_BINDING_QUANTITY_COMPOSITION_NOT_MODELED",
    "PHYSICAL_RESOURCE_COMPOSITION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Canonical per-source capacity-relation evidence State set and Capacity-Compatibility Source Aggregation Readiness Policy set do not share compatible observation Candidate context";

const NONE_TOKEN = "NONE";
const SUPPORTING =
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SUPPORTING" as const;
const CONTRADICTING =
  "EXPLICITLY_INTERPRETED_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_CONTRADICTING" as const;
const UNRESOLVED_NO_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY" as const;
const UNRESOLVED_NO_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_RELATION" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Per-member readiness assessment identity segment.
 * Same condition with different member lineage remains distinct.
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessmentKey(params: {
  capacity_declaration_key: string;
  canonical_source_state_key: string | null;
  canonical_source_state_value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue | null;
  status: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessment["status"];
  is_present: boolean;
  is_resolved: boolean;
}): string {
  return [
    params.capacity_declaration_key,
    params.canonical_source_state_key ?? NONE_TOKEN,
    params.canonical_source_state_value ?? NONE_TOKEN,
    params.status,
    params.is_present ? "true" : "false",
    params.is_resolved ? "true" : "false",
  ].join("|");
}

export function buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessmentSetKey(
  memberAssessments: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessment[]
): string {
  // Preserve GROUND-163 selected member order — do not re-sort by status.
  const keys = memberAssessments.map((assessment) =>
    attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessmentKey(
      {
        capacity_declaration_key: assessment.capacity_declaration_key,
        canonical_source_state_key: assessment.canonical_source_state_key,
        canonical_source_state_value: assessment.canonical_source_state_value,
        status: assessment.status,
        is_present: assessment.is_present,
        is_resolved: assessment.is_resolved,
      }
    )
  );
  return keys.length > 0 ? keys.join(",") : "none";
}

/**
 * Conceptual identity:
 * ...capacity-compatibility-source-aggregation-readiness-basis|
 * candidate|need|capSet|RESOURCE_READINESS|requirement|binding|rd|evaluationAt|
 * aggregationPolicyKey|readinessPolicyKey|
 * canonicalSelectedCapacityDeclarationKeySet|
 * canonicalSelectedSourceReadinessAssessmentSet|readinessCondition
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  capacity_compatibility_source_aggregation_policy_key: string;
  capacity_compatibility_source_aggregation_readiness_policy_key: string;
  selected_capacity_declaration_keys: readonly string[];
  selected_source_readiness_assessments: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessment[];
  readiness_condition: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessCondition;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-compatibility-source-aggregation-readiness-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.capacity_compatibility_source_aggregation_policy_key,
    params.capacity_compatibility_source_aggregation_readiness_policy_key,
    params.selected_capacity_declaration_keys.join(","),
    buildCanonicalDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessmentSetKey(
      params.selected_source_readiness_assessments
    ),
    params.readiness_condition,
  ].join("|");
}

function assertNestedAggregationPolicyLineage(
  readinessPolicy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicy,
  aggregationPolicy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy
): void {
  if (
    aggregationPolicy.key !==
    readinessPolicy.capacity_compatibility_source_aggregation_policy_key
  ) {
    throw new Error(
      `Malformed GROUND-164 Readiness Policy lineage: aggregation-policy key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (aggregationPolicy.candidate_key !== readinessPolicy.candidate_key) {
    throw new Error(
      `Malformed GROUND-164 Readiness Policy lineage: candidate key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (
    aggregationPolicy.observation_need_key !==
    readinessPolicy.observation_need_key
  ) {
    throw new Error(
      `Malformed GROUND-164 Readiness Policy lineage: ObservationNeed key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (
    aggregationPolicy.capability_requirement_set_key !==
    readinessPolicy.capability_requirement_set_key
  ) {
    throw new Error(
      `Malformed GROUND-164 Readiness Policy lineage: Capability Requirement-set key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (
    aggregationPolicy.observation_resource_requirement_key !==
    readinessPolicy.observation_resource_requirement_key
  ) {
    throw new Error(
      `Malformed GROUND-164 Readiness Policy lineage: Resource Requirement key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (
    aggregationPolicy.resource_readiness_observation_context_binding_key !==
    readinessPolicy.resource_readiness_observation_context_binding_key
  ) {
    throw new Error(
      `Malformed GROUND-164 Readiness Policy lineage: Binding key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (
    aggregationPolicy.resource_declaration_id !==
    readinessPolicy.resource_declaration_id
  ) {
    throw new Error(
      `Malformed GROUND-164 Readiness Policy lineage: ResourceDeclaration mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (aggregationPolicy.selected_capacity_declaration_keys.length === 0) {
    throw new Error(
      `Malformed GROUND-163 Aggregation Policy lineage: empty selected member set for readiness policy ${readinessPolicy.key}`
    );
  }
}

function bindingContextKey(params: {
  candidate_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
}): string {
  return [
    params.candidate_key,
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
  ].join("|");
}

function extractBindingEvaluationAt(
  binding: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment
): string {
  if (binding.source_state_assessments.length > 0) {
    const evaluationAts = new Set(
      binding.source_state_assessments.map(
        (source) => source.canonical_state.evaluation_at
      )
    );
    if (evaluationAts.size !== 1) {
      throw new Error(
        `Cross-instant source mixing within GROUND-161 Binding ${binding.resource_readiness_observation_context_binding_key}`
      );
    }
    return [...evaluationAts][0]!;
  }

  const rawBasis =
    binding.capacity_relation_interpretation_basis_binding_assessment
      .raw_relation_binding_assessment.raw_relation_basis;
  if (rawBasis !== null) {
    return rawBasis.evaluation_at;
  }

  const quantityBasis =
    binding.capacity_relation_interpretation_basis_binding_assessment
      .raw_relation_binding_assessment.quantity_relation_binding_assessment
      .quantity_relation_basis;
  if (quantityBasis !== null) {
    return quantityBasis.evaluation_at;
  }

  return binding.capacity_relation_interpretation_basis_binding_assessment
    .raw_relation_binding_assessment.quantity_relation_binding_assessment
    .raw_binding_evidence_assessment.evaluation_at;
}

function collectCurrentStatesByCapacityDeclarationKey(
  binding: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment,
  expectedBindingKey: string,
  expectedResourceDeclarationId: string
): Map<
  string,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState
> {
  if (
    binding.resource_readiness_observation_context_binding_key !==
    expectedBindingKey
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: Binding key mismatch (${expectedBindingKey} vs ${binding.resource_readiness_observation_context_binding_key})`
    );
  }
  if (binding.resource_declaration_id !== expectedResourceDeclarationId) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: ResourceDeclaration mismatch for Binding ${expectedBindingKey}`
    );
  }

  const byCapacityKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState
  >();

  for (const source of binding.source_state_assessments) {
    const state = source.canonical_state;
    if (
      state.resource_readiness_observation_context_binding_key !==
      expectedBindingKey
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: source Binding mismatch for ${expectedBindingKey}`
      );
    }
    if (state.resource_declaration_id !== expectedResourceDeclarationId) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: source ResourceDeclaration mismatch for ${expectedBindingKey}`
      );
    }
    const capacityKey = state.capacity_declaration_key;
    if (byCapacityKey.has(capacityKey)) {
      throw new Error(
        `Duplicate current GROUND-161 canonical source State for capacity declaration ${capacityKey} on Binding ${expectedBindingKey}`
      );
    }
    byCapacityKey.set(capacityKey, state);
  }

  return byCapacityKey;
}

function classifySelectedSourceReadiness(
  capacityDeclarationKey: string,
  state: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState | null
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySelectedSourceReadinessAssessment {
  if (state === null) {
    return {
      capacity_declaration_key: capacityDeclarationKey,
      status: "SELECTED_CAPACITY_SOURCE_MISSING",
      canonical_source_state_key: null,
      canonical_source_state_value: null,
      is_present: false,
      is_resolved: false,
    };
  }

  const value = state.value;
  switch (value) {
    case SUPPORTING:
    case CONTRADICTING: {
      if (
        !isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState(
          value
        )
      ) {
        throw new Error(
          `GROUND-161 resolvedness helper disagreed for value ${value}`
        );
      }
      return {
        capacity_declaration_key: capacityDeclarationKey,
        status: "SELECTED_CAPACITY_SOURCE_PRESENT_AND_RESOLVED",
        canonical_source_state_key: state.key,
        canonical_source_state_value: value,
        is_present: true,
        is_resolved: true,
      };
    }
    case UNRESOLVED_NO_POLICY:
      return {
        capacity_declaration_key: capacityDeclarationKey,
        status:
          "SELECTED_CAPACITY_SOURCE_PRESENT_BUT_UNRESOLVED_NO_EXPLICIT_CAPACITY_RELATION_INTERPRETATION_POLICY",
        canonical_source_state_key: state.key,
        canonical_source_state_value: value,
        is_present: true,
        is_resolved: false,
      };
    case UNRESOLVED_NO_MAPPING:
      return {
        capacity_declaration_key: capacityDeclarationKey,
        status:
          "SELECTED_CAPACITY_SOURCE_PRESENT_BUT_UNRESOLVED_NO_EXPLICIT_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_RELATION",
        canonical_source_state_key: state.key,
        canonical_source_state_value: value,
        is_present: true,
        is_resolved: false,
      };
    default: {
      const _exhaustive: never = value;
      void _exhaustive;
      throw new Error(
        `Unknown GROUND-161 canonical per-source capacity-relation evidence State value: ${String(value)}`
      );
    }
  }
}

function assertBindingBasisInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
  ) {
    if (assessment.readiness_basis === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Basis invariant violated: PRESENT requires non-null basis for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_readiness_basis) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Basis invariant violated: PRESENT requires has_basis true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.readiness_condition === null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Basis invariant violated: PRESENT requires non-null condition for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      assessment.readiness_condition !==
      assessment.readiness_basis.readiness_condition
    ) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Basis invariant violated: condition mismatch for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  ) {
    if (assessment.readiness_basis !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Basis invariant violated: non-present status requires null basis for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.has_readiness_basis) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Basis invariant violated: non-present status requires has_basis false for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.readiness_condition !== null) {
      throw new Error(
        `Capacity-Compatibility Source Aggregation Readiness Basis invariant violated: non-present status requires null condition for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown Capacity-Compatibility Source Aggregation Readiness Basis status: ${String(assessment.status)}`
  );
}

function buildReadinessBasis(
  readinessPolicy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicy,
  aggregationPolicy: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationPolicy,
  statesByCapacityKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState
  >,
  evaluation_at: string
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasis {
  if (
    readinessPolicy.readiness_requirement !==
    "REQUIRE_ALL_SELECTED_CAPACITY_SOURCE_EVIDENCE_STATES_RESOLVED_BEFORE_AGGREGATION"
  ) {
    throw new Error(
      `Unknown Capacity-Compatibility Source Aggregation Readiness requirement: ${String(readinessPolicy.readiness_requirement)}`
    );
  }

  assertNestedAggregationPolicyLineage(readinessPolicy, aggregationPolicy);

  // Selected member order is already canonicalized by GROUND-163.
  // Evaluate every selected member — no short-circuit.
  const selected_source_readiness_assessments =
    aggregationPolicy.selected_capacity_declaration_keys.map(
      (capacityDeclarationKey) =>
        classifySelectedSourceReadiness(
          capacityDeclarationKey,
          statesByCapacityKey.get(capacityDeclarationKey) ?? null
        )
    );

  // Coherence: present selected States must share evaluation_at with Binding context.
  for (const assessment of selected_source_readiness_assessments) {
    if (!assessment.is_present) {
      continue;
    }
    const state = statesByCapacityKey.get(assessment.capacity_declaration_key);
    if (state && compareTemporalInstants(state.evaluation_at, evaluation_at) !== 0) {
      throw new Error(
        `Cross-instant source mixing for selected capacity ${assessment.capacity_declaration_key} on Binding ${aggregationPolicy.resource_readiness_observation_context_binding_key}`
      );
    }
  }

  const selected_source_count =
    aggregationPolicy.selected_capacity_declaration_keys.length;
  const present_selected_source_count =
    selected_source_readiness_assessments.filter((a) => a.is_present).length;
  const resolved_selected_source_count =
    selected_source_readiness_assessments.filter((a) => a.is_resolved).length;
  const missing_selected_source_count =
    selected_source_count - present_selected_source_count;
  const unresolved_selected_source_count =
    present_selected_source_count - resolved_selected_source_count;

  if (
    selected_source_count !==
    present_selected_source_count + missing_selected_source_count
  ) {
    throw new Error("Selected source count invariant violated");
  }
  if (
    present_selected_source_count !==
    resolved_selected_source_count + unresolved_selected_source_count
  ) {
    throw new Error("Present selected source count invariant violated");
  }

  const readiness_condition: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessCondition =
    missing_selected_source_count === 0 &&
    unresolved_selected_source_count === 0
      ? "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      : "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD";

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisKey(
      {
        candidate_key: readinessPolicy.candidate_key,
        observation_need_key: readinessPolicy.observation_need_key,
        capability_requirement_set_key:
          readinessPolicy.capability_requirement_set_key,
        observation_resource_requirement_key:
          readinessPolicy.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          readinessPolicy.resource_readiness_observation_context_binding_key,
        resource_declaration_id: readinessPolicy.resource_declaration_id,
        evaluation_at,
        capacity_compatibility_source_aggregation_policy_key:
          aggregationPolicy.key,
        capacity_compatibility_source_aggregation_readiness_policy_key:
          readinessPolicy.key,
        selected_capacity_declaration_keys:
          aggregationPolicy.selected_capacity_declaration_keys,
        selected_source_readiness_assessments,
        readiness_condition,
      }
    ),
    candidate_key: readinessPolicy.candidate_key,
    observation_need_key: readinessPolicy.observation_need_key,
    capability_requirement_set_key:
      readinessPolicy.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      readinessPolicy.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      readinessPolicy.resource_readiness_observation_context_binding_key,
    resource_declaration_id: readinessPolicy.resource_declaration_id,
    evaluation_at,
    capacity_compatibility_source_aggregation_policy_key: aggregationPolicy.key,
    capacity_compatibility_source_aggregation_readiness_policy_key:
      readinessPolicy.key,
    selected_capacity_declaration_keys: [
      ...aggregationPolicy.selected_capacity_declaration_keys,
    ],
    operator: aggregationPolicy.operator,
    selected_source_readiness_assessments,
    readiness_condition,
    selected_source_count,
    present_selected_source_count,
    resolved_selected_source_count,
    missing_selected_source_count,
    unresolved_selected_source_count,
  };
}

function assessBindingReadinessBasis(
  readinessPolicyAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyBindingAssessment,
  stateBinding: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment | undefined,
  candidateKey: string
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment {
  if (
    readinessPolicyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY"
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment =
      {
        observation_resource_requirement_key:
          readinessPolicyAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          readinessPolicyAssessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id:
          readinessPolicyAssessment.resource_declaration_id,
        aggregation_readiness_policy_assessment: readinessPolicyAssessment,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_POLICY",
        readiness_basis: null,
        has_readiness_basis: false,
        readiness_condition: null,
      };
    assertBindingBasisInvariant(assessment);
    return assessment;
  }

  if (
    readinessPolicyAssessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED" ||
    readinessPolicyAssessment.readiness_policy === null
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment =
      {
        observation_resource_requirement_key:
          readinessPolicyAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          readinessPolicyAssessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id:
          readinessPolicyAssessment.resource_declaration_id,
        aggregation_readiness_policy_assessment: readinessPolicyAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
        readiness_basis: null,
        has_readiness_basis: false,
        readiness_condition: null,
      };
    assertBindingBasisInvariant(assessment);
    return assessment;
  }

  if (
    readinessPolicyAssessment.status !==
      "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT" ||
    readinessPolicyAssessment.aggregation_policy_assessment
      .aggregation_policy === null
  ) {
    throw new Error(
      `Malformed GROUND-164 POLICY_PRESENT Binding assessment for ${readinessPolicyAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (!stateBinding) {
    throw new Error(
      `Malformed cross-input set: GROUND-164 readiness Policy for Binding ${readinessPolicyAssessment.resource_readiness_observation_context_binding_key} on candidate ${candidateKey} lacks matching current GROUND-161 Binding assessment`
    );
  }

  if (
    stateBinding.observation_resource_requirement_key !==
      readinessPolicyAssessment.observation_resource_requirement_key ||
    stateBinding.resource_readiness_observation_context_binding_key !==
      readinessPolicyAssessment.resource_readiness_observation_context_binding_key ||
    stateBinding.resource_declaration_id !==
      readinessPolicyAssessment.resource_declaration_id
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: Binding context mismatch for ${readinessPolicyAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  const aggregationPolicy =
    readinessPolicyAssessment.aggregation_policy_assessment.aggregation_policy;
  const readinessPolicy = readinessPolicyAssessment.readiness_policy;
  const statesByCapacityKey = collectCurrentStatesByCapacityDeclarationKey(
    stateBinding,
    readinessPolicy.resource_readiness_observation_context_binding_key,
    readinessPolicy.resource_declaration_id
  );
  const evaluation_at = extractBindingEvaluationAt(stateBinding);
  const readiness_basis = buildReadinessBasis(
    readinessPolicy,
    aggregationPolicy,
    statesByCapacityKey,
    evaluation_at
  );

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisBindingAssessment =
    {
      observation_resource_requirement_key:
        readinessPolicyAssessment.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        readinessPolicyAssessment.resource_readiness_observation_context_binding_key,
      resource_declaration_id: readinessPolicyAssessment.resource_declaration_id,
      aggregation_readiness_policy_assessment: readinessPolicyAssessment,
      status:
        "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT",
      readiness_basis,
      has_readiness_basis: true,
      readiness_condition: readiness_basis.readiness_condition,
    };
  assertBindingBasisInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Aggregation Readiness Basis assessment.
 * Does not execute ANY/ALL. Does not emit Aggregation Result.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasis(
  stateCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateAssessment,
  readinessPolicyCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisAssessment {
  if (stateCandidate.candidate_key !== readinessPolicyCandidate.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch (${stateCandidate.candidate_key} vs ${readinessPolicyCandidate.candidate_key})`
    );
  }

  const stateBindingsByContext = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment
  >();
  for (const binding of stateCandidate.binding_state_assessments) {
    const key = bindingContextKey({
      candidate_key: stateCandidate.candidate_key,
      observation_resource_requirement_key:
        binding.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        binding.resource_readiness_observation_context_binding_key,
      resource_declaration_id: binding.resource_declaration_id,
    });
    if (stateBindingsByContext.has(key)) {
      throw new Error(
        `Duplicate GROUND-161 Binding assessment for context ${key}`
      );
    }
    stateBindingsByContext.set(key, binding);
  }

  const binding_readiness_basis_assessments =
    readinessPolicyCandidate.binding_readiness_policy_assessments.map(
      (readinessPolicyAssessment) => {
        const key = bindingContextKey({
          candidate_key: readinessPolicyCandidate.candidate_key,
          observation_resource_requirement_key:
            readinessPolicyAssessment.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            readinessPolicyAssessment.resource_readiness_observation_context_binding_key,
          resource_declaration_id:
            readinessPolicyAssessment.resource_declaration_id,
        });
        return assessBindingReadinessBasis(
          readinessPolicyAssessment,
          stateBindingsByContext.get(key),
          stateCandidate.candidate_key
        );
      }
    );

  binding_readiness_basis_assessments.sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return {
    candidate_key: stateCandidate.candidate_key,
    canonical_per_source_capacity_relation_evidence_state_assessment:
      stateCandidate,
    capacity_compatibility_source_aggregation_readiness_policy_assessment:
      readinessPolicyCandidate,
    binding_readiness_basis_assessments,
    has_aggregation_readiness_bases: binding_readiness_basis_assessments.some(
      (a) => a.has_readiness_basis
    ),
    has_aggregation_readiness_condition_holds:
      binding_readiness_basis_assessments.some(
        (a) =>
          a.readiness_condition ===
          "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      ),
    has_aggregation_readiness_condition_does_not_hold:
      binding_readiness_basis_assessments.some(
        (a) =>
          a.readiness_condition ===
          "CAPACITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Current Capacity-Compatibility Source Aggregation
 * Readiness Basis. Preserves AttentionCandidate order.
 * Does not execute ANY/ALL or emit Aggregation Result.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasisSetAssessment {
  const stateSet =
    input.resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set;
  const readinessPolicySet =
    input.resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_policy_set;

  const stateByCandidate = new Map(
    stateSet.candidate_assessments.map((candidate) => [
      candidate.candidate_key,
      candidate,
    ])
  );

  const candidate_assessments =
    readinessPolicySet.candidate_assessments.map((readinessPolicyCandidate) => {
      const stateCandidate = stateByCandidate.get(
        readinessPolicyCandidate.candidate_key
      );
      if (!stateCandidate) {
        const needsCurrentState =
          readinessPolicyCandidate.binding_readiness_policy_assessments.some(
            (binding) =>
              binding.status ===
              "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
          );
        if (needsCurrentState) {
          throw new Error(
            `Malformed cross-input set: GROUND-164 readiness Policy for candidate ${readinessPolicyCandidate.candidate_key} lacks matching current GROUND-161 Candidate assessment`
          );
        }
        // No applicable POLICY_PRESENT Bindings — synthesize empty state candidate
        // only if 161 truly lacks the candidate while 164 only has NOT_APPLICABLE/NO_POLICY.
        // Prefer reject for structural incompleteness of Candidate join.
        throw new Error(
          `Malformed cross-input set: candidate ${readinessPolicyCandidate.candidate_key} present in GROUND-164 but absent from GROUND-161`
        );
      }
      return assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityCompatibilitySourceAggregationReadinessBasis(
        stateCandidate,
        readinessPolicyCandidate
      );
    });

  return {
    resource_readiness_canonical_per_source_declared_potential_contribution_capacity_relation_evidence_state_set:
      stateSet,
    resource_readiness_declared_potential_contribution_capacity_compatibility_source_aggregation_readiness_policy_set:
      readinessPolicySet,
    candidate_assessments,
    has_aggregation_readiness_bases: candidate_assessments.some(
      (a) => a.has_aggregation_readiness_bases
    ),
    has_aggregation_readiness_condition_holds: candidate_assessments.some(
      (a) => a.has_aggregation_readiness_condition_holds
    ),
    has_aggregation_readiness_condition_does_not_hold: candidate_assessments.some(
      (a) => a.has_aggregation_readiness_condition_does_not_hold
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
