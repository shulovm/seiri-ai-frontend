/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition
 * State (GROUND-151).
 *
 * Pure normalization of GROUND-150 Result Interpretation Basis into one
 * canonical per-requirement Binding Evidence Composition State.
 *
 * Must not import GROUND-149/148/147/146/145/141 builders, project persistence,
 * Permission, Authority, Reservation, Commitment, Contention, Feasibility,
 * or OE semantics.
 *
 * Sole polarity authority for BASIS_PRESENT: GROUND-150 Basis.interpretation
 * HOLDS / DOES_NOT_HOLD must not be reopened.
 * unusual explicit mappings remain authoritative.
 *
 * EXPLICITLY_INTERPRETED_*_COMPOSITION_* ≠ RESOURCE_READY / NOT_READY
 * UNRESOLVED_* ≠ NEGATIVE
 * NOT_APPLICABLE ≠ UNRESOLVED
 * resolved ≠ positive (NEGATIVE is resolved)
 * canonical State ≠ true Resource Readiness
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState,
  AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateEvalInput,
  AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateModelLimitation,
  AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateRequirementAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateSetAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue,
} from "./attention-observation-operational-eligibility-canonical-per-requirement-resource-readiness-binding-evidence-composition-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_PER_REQUIREMENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateModelLimitation[] =
  [
    "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED",
    "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED",
    "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
    "RESOURCE_QUANTITY_CONTRIBUTION_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const NONE_TOKEN = "NONE" as const;

const POSITIVE_INTERPRETATION =
  "INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE" as const;
const NEGATIVE_INTERPRETATION =
  "INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_NEGATIVE" as const;

const CANONICAL_POSITIVE =
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE" as const;
const CANONICAL_NEGATIVE =
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_NEGATIVE" as const;
const CANONICAL_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_CURRENT_RESULT =
  "UNRESOLVED_NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT" as const;
const CANONICAL_UNRESOLVED_NO_POLICY =
  "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT" as const;

/**
 * Domain applicability — NOT_APPLICABLE is not unresolved.
 */
export function isApplicableAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
  value: AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue
): boolean {
  return value !== CANONICAL_NOT_APPLICABLE;
}

/**
 * Resolvedness — POSITIVE and NEGATIVE are both resolved.
 * isResolved=false does not itself imply UNRESOLVED (NOT_APPLICABLE is separate).
 */
export function isResolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
  value: AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue
): boolean {
  return value === CANONICAL_POSITIVE || value === CANONICAL_NEGATIVE;
}

export function isUnresolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
  value: AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue
): boolean {
  return (
    value === CANONICAL_UNRESOLVED_NO_CURRENT_RESULT ||
    value === CANONICAL_UNRESOLVED_NO_POLICY ||
    value === CANONICAL_UNRESOLVED_NO_MAPPING
  );
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-canonical-per-requirement-resource-readiness-binding-evidence-composition-state|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|compositionPolicyKey-or-NONE|
 * interpretationBasisKey-or-NONE|ground150Status|canonicalValue
 */
export function attentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_binding_evidence_composition_policy_key: string | null;
  resource_readiness_binding_evidence_composition_result_interpretation_basis_key: string | null;
  ground150_status: string;
  value: AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-canonical-per-requirement-resource-readiness-binding-evidence-composition-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_binding_evidence_composition_policy_key ??
      NONE_TOKEN,
    params.resource_readiness_binding_evidence_composition_result_interpretation_basis_key ??
      NONE_TOKEN,
    params.ground150_status,
    params.value,
  ].join("|");
}

function assertBasisPresentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: BASIS_PRESENT requires non-null Basis for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: BASIS_PRESENT requires non-null interpretation for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.interpretation !==
      assessment.interpretation_basis.interpretation
    ) {
      throw new Error(
        `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: interpretation mismatch for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (assessment.interpretation_basis !== null) {
    throw new Error(
      `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: non-present status requires null Basis for requirement ${assessment.observation_resource_requirement_key}`
    );
  }
  if (assessment.interpretation !== null) {
    throw new Error(
      `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: non-present status requires null interpretation for requirement ${assessment.observation_resource_requirement_key}`
    );
  }
}

/**
 * Exhaustive GROUND-150 → canonical State mapping.
 * No HOLDS/DOES_NOT_HOLD reopening. No fallback coercion.
 */
export function deriveAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment
): AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue {
  assertBasisPresentInvariant(assessment);

  switch (assessment.status) {
    case "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY":
      return CANONICAL_NOT_APPLICABLE;

    case "NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT":
      return CANONICAL_UNRESOLVED_NO_CURRENT_RESULT;

    case "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED":
      return CANONICAL_UNRESOLVED_NO_POLICY;

    case "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT":
      return CANONICAL_UNRESOLVED_NO_MAPPING;

    case "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_PRESENT": {
      const interpretation = assessment.interpretation_basis!.interpretation;
      switch (interpretation) {
        case POSITIVE_INTERPRETATION:
          return CANONICAL_POSITIVE;
        case NEGATIVE_INTERPRETATION:
          return CANONICAL_NEGATIVE;
        default: {
          const _exhaustive: never = interpretation;
          void _exhaustive;
          throw new Error(
            `Unknown RESOURCE_READINESS Binding Evidence Composition Result Interpretation: ${String(interpretation)}`
          );
        }
      }
    }

    default: {
      const _exhaustive: never = assessment.status;
      void _exhaustive;
      throw new Error(
        `Unknown RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis status: ${String(assessment.status)}`
      );
    }
  }
}

function extractCompositionPolicyKey(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment
): string | null {
  if (assessment.interpretation_basis !== null) {
    return assessment.interpretation_basis
      .resource_readiness_binding_evidence_composition_policy_key;
  }

  const interpretationPolicy =
    assessment.result_interpretation_policy_assessment.interpretation_policy;
  if (interpretationPolicy !== null) {
    return interpretationPolicy.resource_readiness_binding_evidence_composition_policy_key;
  }

  const compositionResult =
    assessment.binding_evidence_composition_result_assessment
      .composition_result;
  if (compositionResult !== null) {
    return compositionResult.resource_readiness_binding_evidence_composition_policy_key;
  }

  const readinessBasis =
    assessment.binding_evidence_composition_result_assessment
      .composition_readiness_basis_assessment.readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.resource_readiness_binding_evidence_composition_policy_key;
  }

  const compositionPolicy =
    assessment.binding_evidence_composition_result_assessment
      .composition_readiness_basis_assessment
      .composition_readiness_policy_assessment
      .binding_evidence_composition_policy_assessment.policy;
  if (compositionPolicy !== null) {
    return compositionPolicy.key;
  }

  return null;
}

function extractContextKeys(
  candidate_key: string,
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment
): {
  observation_need_key: string;
  capability_requirement_set_key: string;
} {
  if (assessment.interpretation_basis !== null) {
    return {
      observation_need_key: assessment.interpretation_basis.observation_need_key,
      capability_requirement_set_key:
        assessment.interpretation_basis.capability_requirement_set_key,
    };
  }

  const interpretationPolicy =
    assessment.result_interpretation_policy_assessment.interpretation_policy;
  if (interpretationPolicy !== null) {
    return {
      observation_need_key: interpretationPolicy.observation_need_key,
      capability_requirement_set_key:
        interpretationPolicy.capability_requirement_set_key,
    };
  }

  const compositionResult =
    assessment.binding_evidence_composition_result_assessment
      .composition_result;
  if (compositionResult !== null) {
    return {
      observation_need_key: compositionResult.observation_need_key,
      capability_requirement_set_key:
        compositionResult.capability_requirement_set_key,
    };
  }

  const readinessBasis =
    assessment.binding_evidence_composition_result_assessment
      .composition_readiness_basis_assessment.readiness_basis;
  if (readinessBasis !== null) {
    return {
      observation_need_key: readinessBasis.observation_need_key,
      capability_requirement_set_key:
        readinessBasis.capability_requirement_set_key,
    };
  }

  const compositionPolicy =
    assessment.binding_evidence_composition_result_assessment
      .composition_readiness_basis_assessment
      .composition_readiness_policy_assessment
      .binding_evidence_composition_policy_assessment.policy;
  if (compositionPolicy !== null) {
    return {
      observation_need_key: compositionPolicy.observation_need_key,
      capability_requirement_set_key:
        compositionPolicy.capability_requirement_set_key,
    };
  }

  const resourceRequirement =
    assessment.binding_evidence_composition_result_assessment
      .composition_readiness_basis_assessment
      .composition_readiness_policy_assessment
      .binding_evidence_composition_policy_assessment
      .requirement_binding_assessment.resource_requirement;

  if (resourceRequirement.candidate_key !== candidate_key) {
    throw new Error(
      `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: candidate key mismatch for requirement ${assessment.observation_resource_requirement_key}`
    );
  }

  return {
    observation_need_key: resourceRequirement.observation_need_key,
    capability_requirement_set_key:
      resourceRequirement.capability_requirement_set_key,
  };
}

function buildCanonicalState(
  candidate_key: string,
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment,
  value: AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue
): AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState {
  const context = extractContextKeys(candidate_key, assessment);
  const composition_policy_key =
    value === CANONICAL_NOT_APPLICABLE
      ? null
      : extractCompositionPolicyKey(assessment);

  if (value !== CANONICAL_NOT_APPLICABLE && composition_policy_key === null) {
    throw new Error(
      `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: missing composition policy lineage for requirement ${assessment.observation_resource_requirement_key}`
    );
  }

  const interpretation_basis_key =
    value === CANONICAL_POSITIVE || value === CANONICAL_NEGATIVE
      ? assessment.interpretation_basis!.key
      : null;

  if (
    (value === CANONICAL_POSITIVE || value === CANONICAL_NEGATIVE) &&
    interpretation_basis_key === null
  ) {
    throw new Error(
      `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: interpreted State requires Basis key for requirement ${assessment.observation_resource_requirement_key}`
    );
  }

  if (
    value !== CANONICAL_POSITIVE &&
    value !== CANONICAL_NEGATIVE &&
    assessment.interpretation_basis !== null
  ) {
    throw new Error(
      `Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State invariant violated: unresolved/not-applicable State must not carry Basis for requirement ${assessment.observation_resource_requirement_key}`
    );
  }

  return {
    key: attentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateKey(
      {
        candidate_key,
        observation_need_key: context.observation_need_key,
        capability_requirement_set_key: context.capability_requirement_set_key,
        observation_resource_requirement_key:
          assessment.observation_resource_requirement_key,
        resource_readiness_binding_evidence_composition_policy_key:
          composition_policy_key,
        resource_readiness_binding_evidence_composition_result_interpretation_basis_key:
          interpretation_basis_key,
        ground150_status: assessment.status,
        value,
      }
    ),
    candidate_key,
    observation_need_key: context.observation_need_key,
    capability_requirement_set_key: context.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      assessment.observation_resource_requirement_key,
    value,
    resource_readiness_binding_evidence_composition_policy_key:
      composition_policy_key,
    resource_readiness_binding_evidence_composition_result_interpretation_basis_key:
      interpretation_basis_key,
  };
}

function assessRequirementCanonicalState(
  candidate_key: string,
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment
): AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateRequirementAssessment {
  const canonical_state_value =
    deriveAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue(
      assessment
    );
  const canonical_state = buildCanonicalState(
    candidate_key,
    assessment,
    canonical_state_value
  );

  return {
    observation_resource_requirement_key:
      assessment.observation_resource_requirement_key,
    result_interpretation_basis_assessment: assessment,
    canonical_state,
    canonical_state_value,
  };
}

/**
 * Pure per-Candidate canonical State assessment.
 * One State per exact GROUND-150 Requirement assessment — none dropped.
 */
export function assessAttentionCandidateObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
  basisAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisAssessment
): AttentionCandidateObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateAssessment {
  const requirement_canonical_state_assessments =
    basisAssessment.requirement_interpretation_basis_assessments.map(
      (requirementAssessment) =>
        assessRequirementCanonicalState(
          basisAssessment.candidate_key,
          requirementAssessment
        )
    );

  return {
    candidate_key: basisAssessment.candidate_key,
    resource_readiness_binding_evidence_composition_result_interpretation_basis_assessment:
      basisAssessment,
    requirement_canonical_state_assessments,
    has_explicitly_interpreted_resource_readiness_binding_evidence_composition_positive_states:
      requirement_canonical_state_assessments.some(
        (a) => a.canonical_state_value === CANONICAL_POSITIVE
      ),
    has_explicitly_interpreted_resource_readiness_binding_evidence_composition_negative_states:
      requirement_canonical_state_assessments.some(
        (a) => a.canonical_state_value === CANONICAL_NEGATIVE
      ),
    has_unresolved_resource_readiness_binding_evidence_composition_states:
      requirement_canonical_state_assessments.some((a) =>
        isUnresolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          a.canonical_state_value
        )
      ),
    has_not_applicable_resource_readiness_binding_evidence_composition_states:
      requirement_canonical_state_assessments.some(
        (a) => a.canonical_state_value === CANONICAL_NOT_APPLICABLE
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_PER_REQUIREMENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_STATE_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level canonical State. Preserves GROUND-150 AttentionCandidate order.
 */
export function buildAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateSet(
  input: AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateEvalInput
): AttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateSetAssessment {
  const candidate_assessments =
    input.resource_readiness_binding_evidence_composition_result_interpretation_basis_set.candidate_assessments.map(
      (basisAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          basisAssessment
        )
    );

  return {
    resource_readiness_binding_evidence_composition_result_interpretation_basis_set:
      input.resource_readiness_binding_evidence_composition_result_interpretation_basis_set,
    candidate_assessments,
    has_explicitly_interpreted_resource_readiness_binding_evidence_composition_positive_states:
      candidate_assessments.some(
        (a) =>
          a.has_explicitly_interpreted_resource_readiness_binding_evidence_composition_positive_states
      ),
    has_explicitly_interpreted_resource_readiness_binding_evidence_composition_negative_states:
      candidate_assessments.some(
        (a) =>
          a.has_explicitly_interpreted_resource_readiness_binding_evidence_composition_negative_states
      ),
    has_unresolved_resource_readiness_binding_evidence_composition_states:
      candidate_assessments.some(
        (a) =>
          a.has_unresolved_resource_readiness_binding_evidence_composition_states
      ),
    has_not_applicable_resource_readiness_binding_evidence_composition_states:
      candidate_assessments.some(
        (a) =>
          a.has_not_applicable_resource_readiness_binding_evidence_composition_states
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_PER_REQUIREMENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
