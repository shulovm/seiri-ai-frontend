import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Canonical Per-source Declared Potential Contribution
 * Capacity-Relation Evidence State (GROUND-161).
 *
 * Pure normalization of GROUND-160 Per-source Interpretation Basis Set.
 * Sole runtime semantic authority: GROUND-160.
 *
 * No persistence layer access or mutation. No GROUND-159 / 157 / 155 /
 * 153 / 141 / 151 builders. No Reservation, availability, contribution
 * verification, source aggregation, required-axis interpretation, or OE readiness.
 *
 * SUPPORTING ≠ HOLDS; CONTRADICTING ≠ DOES_NOT_HOLD
 * CONTRADICTING = resolved; UNRESOLVED_* = unresolved
 * zero capacity sources → zero canonical States
 * unusual GROUND-160 interpretations preserved exactly
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSourceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_PER_SOURCE_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_EVIDENCE_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateModelLimitation[] =
  [
    "CAPACITY_SOURCE_MEMBER_SET_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "CAPACITY_COMPATIBILITY_PROPOSITION_STATE_NOT_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_CONTRIBUTION_EVIDENCE_EVALUATION_STATE_NOT_MODELED",
    "PHYSICAL_CONTRIBUTION_EVIDENCE_COMPOSITION_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED",
    "RESOURCE_CAPACITY_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_FULLY_MODELED",
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
 * SUPPORTING / CONTRADICTING → true
 * UNRESOLVED_NO_POLICY / UNRESOLVED_NO_MAPPING → false
 */
export function isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState(
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue
): boolean {
  return value === SUPPORTING || value === CONTRADICTING;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|bindingKey|resourceDeclarationId|evaluationAt|
 * capacityRelationEntryKey|capacityDeclarationKey|ground160Status|basisKey-or-NONE|canonicalValue
 */
export function attentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  evaluation_at: string;
  capacity_relation_entry_key: string;
  capacity_declaration_key: string;
  ground160_status: string;
  capacity_relation_interpretation_basis_key: string | null;
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-canonical-per-source-declared-potential-contribution-capacity-relation-evidence-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.capacity_relation_entry_key,
    params.capacity_declaration_key,
    params.ground160_status,
    params.capacity_relation_interpretation_basis_key ?? "NONE",
    params.value,
  ].join("|");
}

/**
 * Exhaustive GROUND-160 source → canonical Evidence State mapping.
 * No fallback. No raw-relation / Policy reopening.
 */
export function deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue(
  sourceAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue {
  switch (sourceAssessment.status) {
    case "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED":
      if (
        sourceAssessment.interpretation_basis !== null ||
        sourceAssessment.interpretation !== null ||
        sourceAssessment.has_capacity_relation_interpretation_basis
      ) {
        throw new Error(
          `Canonical Capacity-Relation Evidence State invariant violated: NO_POLICY must not carry Basis for capacity entry ${sourceAssessment.capacity_relation_entry_key}`
        );
      }
      return UNRESOLVED_NO_POLICY;

    case "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_RELATION":
      if (
        sourceAssessment.interpretation_basis !== null ||
        sourceAssessment.interpretation !== null ||
        sourceAssessment.has_capacity_relation_interpretation_basis
      ) {
        throw new Error(
          `Canonical Capacity-Relation Evidence State invariant violated: NO_MAPPING must not carry Basis for capacity entry ${sourceAssessment.capacity_relation_entry_key}`
        );
      }
      return UNRESOLVED_NO_MAPPING;

    case "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_BASIS_PRESENT": {
      if (
        sourceAssessment.interpretation_basis === null ||
        sourceAssessment.interpretation === null ||
        !sourceAssessment.has_capacity_relation_interpretation_basis
      ) {
        throw new Error(
          `Canonical Capacity-Relation Evidence State invariant violated: BASIS_PRESENT requires Basis for capacity entry ${sourceAssessment.capacity_relation_entry_key}`
        );
      }
      if (
        sourceAssessment.interpretation !==
        sourceAssessment.interpretation_basis.interpretation
      ) {
        throw new Error(
          `Canonical Capacity-Relation Evidence State invariant violated: source interpretation mismatch for capacity entry ${sourceAssessment.capacity_relation_entry_key}`
        );
      }
      switch (sourceAssessment.interpretation_basis.interpretation) {
        case "INTERPRET_AS_SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY":
          return SUPPORTING;
        case "INTERPRET_AS_CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY":
          return CONTRADICTING;
        default: {
          const _exhaustive: never =
            sourceAssessment.interpretation_basis.interpretation;
          void _exhaustive;
          throw new Error(
            `Unknown Declared Potential Contribution Capacity Relation Interpretation: ${String(sourceAssessment.interpretation_basis.interpretation)}`
          );
        }
      }
    }

    default: {
      const _exhaustive: never = sourceAssessment.status;
      void _exhaustive;
      throw new Error(
        `Unknown GROUND-160 Capacity Relation Interpretation Basis status: ${String(sourceAssessment.status)}`
      );
    }
  }
}

function extractBindingLineage(
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisBindingAssessment
): {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  evaluation_at: string;
} {
  const rawBasis =
    bindingAssessment.raw_relation_binding_assessment.raw_relation_basis;
  if (rawBasis === null) {
    throw new Error(
      `Canonical Capacity-Relation Evidence State invariant violated: capacity sources require raw relation Basis for binding ${bindingAssessment.resource_readiness_observation_context_binding_key}`
    );
  }
  return {
    candidate_key: rawBasis.candidate_key,
    observation_need_key: rawBasis.observation_need_key,
    capability_requirement_set_key: rawBasis.capability_requirement_set_key,
    evaluation_at: rawBasis.evaluation_at,
  };
}

function buildCanonicalState(params: {
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisBindingAssessment;
  sourceAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment;
  value: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue;
}): AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState {
  const { bindingAssessment, sourceAssessment, value } = params;
  const lineage = extractBindingLineage(bindingAssessment);
  const capacity_relation_interpretation_basis_key =
    sourceAssessment.interpretation_basis?.key ?? null;

  if (
    (value === SUPPORTING || value === CONTRADICTING) &&
    capacity_relation_interpretation_basis_key === null
  ) {
    throw new Error(
      `Canonical Capacity-Relation Evidence State invariant violated: resolved State requires Basis key for capacity entry ${sourceAssessment.capacity_relation_entry_key}`
    );
  }
  if (
    (value === UNRESOLVED_NO_POLICY || value === UNRESOLVED_NO_MAPPING) &&
    capacity_relation_interpretation_basis_key !== null
  ) {
    throw new Error(
      `Canonical Capacity-Relation Evidence State invariant violated: unresolved State must not carry Basis key for capacity entry ${sourceAssessment.capacity_relation_entry_key}`
    );
  }

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateKey(
      {
        candidate_key: lineage.candidate_key,
        observation_need_key: lineage.observation_need_key,
        capability_requirement_set_key: lineage.capability_requirement_set_key,
        observation_resource_requirement_key:
          bindingAssessment.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          bindingAssessment.resource_readiness_observation_context_binding_key,
        resource_declaration_id: bindingAssessment.resource_declaration_id,
        evaluation_at: lineage.evaluation_at,
        capacity_relation_entry_key:
          sourceAssessment.capacity_relation_entry_key,
        capacity_declaration_key: sourceAssessment.capacity_declaration_key,
        ground160_status: sourceAssessment.status,
        capacity_relation_interpretation_basis_key,
        value,
      }
    ),
    candidate_key: lineage.candidate_key,
    observation_need_key: lineage.observation_need_key,
    capability_requirement_set_key: lineage.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      bindingAssessment.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      bindingAssessment.resource_readiness_observation_context_binding_key,
    resource_declaration_id: bindingAssessment.resource_declaration_id,
    evaluation_at: lineage.evaluation_at,
    capacity_relation_entry_key: sourceAssessment.capacity_relation_entry_key,
    capacity_declaration_key: sourceAssessment.capacity_declaration_key,
    value,
    capacity_relation_interpretation_basis_key,
  };
}

function assessSourceState(
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisBindingAssessment,
  sourceAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisSourceAssessment
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSourceAssessment {
  const value =
    deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateValue(
      sourceAssessment
    );
  const canonical_state = buildCanonicalState({
    bindingAssessment,
    sourceAssessment,
    value,
  });

  return {
    capacity_relation_interpretation_basis_source_assessment: sourceAssessment,
    canonical_state,
    canonical_state_value: value,
  };
}

function summarizeSourceStates(
  sources: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSourceAssessment[]
): {
  capacity_source_count: number;
  canonical_state_count: number;
  has_supporting_capacity_relation_evidence_states: boolean;
  has_contradicting_capacity_relation_evidence_states: boolean;
  has_unresolved_capacity_relation_evidence_states: boolean;
} {
  let has_supporting = false;
  let has_contradicting = false;
  let has_unresolved = false;

  for (const source of sources) {
    if (source.canonical_state_value === SUPPORTING) {
      has_supporting = true;
    } else if (source.canonical_state_value === CONTRADICTING) {
      has_contradicting = true;
    } else {
      has_unresolved = true;
    }
  }

  return {
    capacity_source_count: sources.length,
    canonical_state_count: sources.length,
    has_supporting_capacity_relation_evidence_states: has_supporting,
    has_contradicting_capacity_relation_evidence_states: has_contradicting,
    has_unresolved_capacity_relation_evidence_states: has_unresolved,
  };
}

function assessBindingState(
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisBindingAssessment
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateBindingAssessment {
  const source_state_assessments = [
    ...bindingAssessment.capacity_source_interpretation_basis_assessments,
  ]
    .sort((a, b) =>
      compareStrings(a.capacity_relation_entry_key, b.capacity_relation_entry_key)
    )
    .map((sourceAssessment) =>
      assessSourceState(bindingAssessment, sourceAssessment)
    );

  if (
    source_state_assessments.length !== bindingAssessment.capacity_source_count
  ) {
    throw new Error(
      `Canonical Capacity-Relation Evidence State cardinality invariant violated for binding ${bindingAssessment.resource_readiness_observation_context_binding_key}`
    );
  }

  const summary = summarizeSourceStates(source_state_assessments);

  return {
    observation_resource_requirement_key:
      bindingAssessment.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      bindingAssessment.resource_readiness_observation_context_binding_key,
    resource_declaration_id: bindingAssessment.resource_declaration_id,
    capacity_relation_interpretation_basis_binding_assessment: bindingAssessment,
    source_state_assessments,
    ...summary,
  };
}

/**
 * Pure per-Candidate canonical Capacity-Relation Evidence State assessment.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState(
  basisCandidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationBasisAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateAssessment {
  const binding_state_assessments =
    basisCandidate.binding_interpretation_basis_assessments.map((binding) =>
      assessBindingState(binding)
    );

  binding_state_assessments.sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return {
    candidate_key: basisCandidate.candidate_key,
    capacity_relation_interpretation_basis_assessment: basisCandidate,
    binding_state_assessments,
    has_supporting_capacity_relation_evidence_states:
      binding_state_assessments.some(
        (a) => a.has_supporting_capacity_relation_evidence_states
      ),
    has_contradicting_capacity_relation_evidence_states:
      binding_state_assessments.some(
        (a) => a.has_contradicting_capacity_relation_evidence_states
      ),
    has_unresolved_capacity_relation_evidence_states:
      binding_state_assessments.some(
        (a) => a.has_unresolved_capacity_relation_evidence_states
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_PER_SOURCE_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_EVIDENCE_STATE_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Canonical Per-source Declared Potential Contribution
 * Capacity-Relation Evidence State. Preserves AttentionCandidate order.
 * Does not aggregate sources or invent zero-source States.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceStateSetAssessment {
  const candidate_assessments =
    input.resource_readiness_declared_potential_contribution_capacity_relation_interpretation_basis_set.candidate_assessments.map(
      (basisCandidate) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessCanonicalPerSourceDeclaredPotentialContributionCapacityRelationEvidenceState(
          basisCandidate
        )
    );

  return {
    resource_readiness_declared_potential_contribution_capacity_relation_interpretation_basis_set:
      input.resource_readiness_declared_potential_contribution_capacity_relation_interpretation_basis_set,
    candidate_assessments,
    has_supporting_capacity_relation_evidence_states: candidate_assessments.some(
      (a) => a.has_supporting_capacity_relation_evidence_states
    ),
    has_contradicting_capacity_relation_evidence_states:
      candidate_assessments.some(
        (a) => a.has_contradicting_capacity_relation_evidence_states
      ),
    has_unresolved_capacity_relation_evidence_states: candidate_assessments.some(
      (a) => a.has_unresolved_capacity_relation_evidence_states
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_PER_SOURCE_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_EVIDENCE_STATE_MODEL_LIMITATIONS,
    ],
  };
}
