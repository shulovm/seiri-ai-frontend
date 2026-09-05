import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Canonical Authority State (GROUND-116).
 *
 * Pure normalization of GROUND-115 Authority Evidence Evaluation State
 * Interpretation Basis into canonical Observation-Context AUTHORITY State.
 *
 * Must not import GROUND-114/113/111/110/109/108/020/019, ProjectState,
 * Permission, Standing, Mandate, Capability, Commitment, or OE semantics.
 *
 * EXPLICITLY_INTERPRETED_* ≠ effective/legal Authority
 * UNRESOLVED_NO_POLICY ≠ negative Authority
 * UNRESOLVED_NO_MAPPING ≠ negative Authority
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSetAssessment,
} from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment,
  AttentionObservationOperationalEligibilityCanonicalAuthorityState,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateCandidateStatus,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateEvalInput,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateModelLimitation,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateSetAssessment,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue,
} from "./attention-observation-operational-eligibility-canonical-authority-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityCanonicalAuthorityStateModelLimitation[] =
  [
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const NONE_TOKEN = "NONE" as const;

export function buildCanonicalAuthorityStateValueCanonicalKey(
  value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue
): string {
  return value;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-canonical-authority-state-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * authorityBindingKey|holderEntityId|authorityPower|governanceScopeKey|
 * evaluationInstantKey|authorityEvaluationAt|
 * currentAuthorityEvidenceEvaluationStateKey|currentAuthorityEvidenceEvaluationStateBasisKey|
 * interpretationBasisStatus|interpretationBasisKey-or-NONE|
 * interpretationPolicyKey-or-NONE|interpretation-or-NONE|canonicalAuthorityStateValue
 */
export function attentionObservationOperationalEligibilityCanonicalAuthorityStateBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: string;
  governance_scope_key: string;
  authority_evaluation_instant_key: string;
  authority_evaluation_at: string;
  authority_evidence_evaluation_state_key: string;
  authority_evidence_evaluation_state_basis_key: string;
  authority_evidence_evaluation_state_interpretation_basis_status: string;
  authority_evidence_evaluation_state_interpretation_basis_key: string | null;
  authority_evidence_evaluation_state_interpretation_policy_key: string | null;
  interpretation: string | null;
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-canonical-authority-state-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.authority_observation_context_binding_key,
    params.authority_holder_entity_id,
    params.authority_power,
    params.governance_scope_key,
    params.authority_evaluation_instant_key,
    temporalInstantKey(params.authority_evaluation_at),
    params.authority_evidence_evaluation_state_key,
    params.authority_evidence_evaluation_state_basis_key,
    params.authority_evidence_evaluation_state_interpretation_basis_status,
    params.authority_evidence_evaluation_state_interpretation_basis_key ??
      NONE_TOKEN,
    params.authority_evidence_evaluation_state_interpretation_policy_key ??
      NONE_TOKEN,
    params.interpretation ?? NONE_TOKEN,
    buildCanonicalAuthorityStateValueCanonicalKey(
      params.canonical_authority_state_value
    ),
  ].join("|");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-canonical-authority-state|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * authorityBindingKey|holderEntityId|authorityPower|governanceScopeKey|
 * authorityEvaluationAt|canonicalAuthorityStateValue|canonicalAuthorityStateBasisKey
 */
export function attentionObservationOperationalEligibilityCanonicalAuthorityStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: string;
  governance_scope_key: string;
  authority_evaluation_at: string;
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
  canonical_authority_state_basis_key: string;
}): string {
  return [
    "attention-observation-operational-eligibility-canonical-authority-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.authority_observation_context_binding_key,
    params.authority_holder_entity_id,
    params.authority_power,
    params.governance_scope_key,
    temporalInstantKey(params.authority_evaluation_at),
    buildCanonicalAuthorityStateValueCanonicalKey(
      params.canonical_authority_state_value
    ),
    params.canonical_authority_state_basis_key,
  ].join("|");
}

export function isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved(
  value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue
): boolean {
  return (
    value === "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE" ||
    value === "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
  );
}

export function isCanonicalAuthorityStateExplicitlyInterpretedPositive(
  value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue
): boolean {
  return value === "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE";
}

function assertInterpretationBasisPresentInvariant(
  assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment
): void {
  if (
    assessment.status ===
    "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.authority_evidence_evaluation_state_interpretation_basis === null) {
      throw new Error(
        `Authority Evidence Evaluation State Interpretation Basis invariant violated: PRESENT requires non-null basis for State ${assessment.authority_evidence_evaluation_state.key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED" ||
    assessment.status ===
      "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
  ) {
    if (
      assessment.authority_evidence_evaluation_state_interpretation_basis !==
      null
    ) {
      throw new Error(
        `Authority Evidence Evaluation State Interpretation Basis invariant violated: non-present status requires null basis for State ${assessment.authority_evidence_evaluation_state.key}`
      );
    }
  }
}

function assertPolicyAbsenceInvariant(
  assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment
): void {
  const policyBindingAssessment =
    assessment.authority_evidence_evaluation_state_interpretation_policy_binding_assessment;
  if (
    policyBindingAssessment.status ===
      "EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    policyBindingAssessment.authority_evidence_evaluation_state_interpretation_policy !==
      null
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: policy-absence status must not carry policy PRESENT for State ${assessment.authority_evidence_evaluation_state.key}`
    );
  }
}

function assertNoMappingInvariant(
  assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment
): void {
  const policyBindingAssessment =
    assessment.authority_evidence_evaluation_state_interpretation_policy_binding_assessment;
  if (
    policyBindingAssessment.status !==
      "EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    policyBindingAssessment.authority_evidence_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: no-mapping status requires explicit Interpretation Policy PRESENT for State ${assessment.authority_evidence_evaluation_state.key}`
    );
  }
}

function assertEvidenceStateBasisLineage(
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment,
  assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment
): {
  authority_evaluation_instant_key: string;
  authority_evidence_evaluation_state_basis_key: string;
} {
  const state = assessment.authority_evidence_evaluation_state;
  const evidenceBasis =
    candidateAssessment.authority_evidence_evaluation_state_assessment.authority_evidence_evaluation_state_bases.find(
      (basis) => basis.key === state.authority_evidence_evaluation_state_basis_key
    );
  if (!evidenceBasis) {
    throw new Error(
      `Canonical Authority State invariant violated: missing evidence State Basis lineage for State ${state.key}`
    );
  }
  if (
    evidenceBasis.candidate_key !== state.candidate_key ||
    evidenceBasis.observation_need_key !== state.observation_need_key ||
    evidenceBasis.capability_requirement_set_key !==
      state.capability_requirement_set_key ||
    evidenceBasis.authority_holder_entity_id !==
      state.authority_holder_entity_id ||
    evidenceBasis.authority_power !== state.authority_power ||
    evidenceBasis.governance_scope_key !== state.governance_scope_key ||
    compareTemporalInstants(evidenceBasis.authority_evaluation_at, state.authority_evaluation_at) !== 0
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: evidence State/Basis context mismatch for State ${state.key}`
    );
  }

  const binding =
    assessment.authority_evidence_evaluation_state_interpretation_policy_binding_assessment
      .authority_observation_context_binding;
  if (
    evidenceBasis.authority_observation_context_binding_key !== binding.key ||
    evidenceBasis.authority_holder_entity_id !== binding.authority_holder_entity_id ||
    evidenceBasis.authority_power !== binding.authority_power ||
    evidenceBasis.governance_scope_key !== binding.governance_scope_key
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: binding context mismatch for State ${state.key}`
    );
  }

  return {
    authority_evaluation_instant_key:
      evidenceBasis.authority_evaluation_instant_key,
    authority_evidence_evaluation_state_basis_key: evidenceBasis.key,
  };
}

/**
 * Exhaustive GROUND-115 per-State → canonical Authority State mapping.
 * No fallback coercion. No evidence reinterpretation.
 */
export function mapAuthorityEvidenceEvaluationStateInterpretationBasisAssessmentToCanonicalAuthorityStateValue(
  assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment
): AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue {
  assertInterpretationBasisPresentInvariant(assessment);

  switch (assessment.status) {
    case "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED":
      assertPolicyAbsenceInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY";

    case "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE":
      assertNoMappingInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE";

    case "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT": {
      const basis =
        assessment.authority_evidence_evaluation_state_interpretation_basis!;
      switch (basis.interpretation) {
        case "INTERPRET_AS_AUTHORITY_STATE_POSITIVE":
          return "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE";
        case "INTERPRET_AS_AUTHORITY_STATE_NEGATIVE":
          return "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE";
        default:
          throw new Error(
            `Unknown Authority Evidence Evaluation State Interpretation: ${String(basis.interpretation)}`
          );
      }
    }
  }
}

function buildCanonicalAuthorityStateBasis(
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment,
  assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment,
  canonicalValue: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue
): AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis {
  const state = assessment.authority_evidence_evaluation_state;
  const binding =
    assessment.authority_evidence_evaluation_state_interpretation_policy_binding_assessment
      .authority_observation_context_binding;
  const interpretationBasis =
    assessment.authority_evidence_evaluation_state_interpretation_basis;
  const policy =
    assessment.authority_evidence_evaluation_state_interpretation_policy_binding_assessment
      .authority_evidence_evaluation_state_interpretation_policy;

  const lineage = assertEvidenceStateBasisLineage(candidateAssessment, assessment);

  let interpretationBasisKey: string | null = null;
  let interpretationPolicyKey: string | null = null;
  let interpretation =
    null as AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis["interpretation"];

  if (
    canonicalValue === "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE" ||
    canonicalValue === "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
  ) {
    if (interpretationBasis === null) {
      throw new Error(
        `Canonical Authority State invariant violated: ${canonicalValue} requires non-null Interpretation Basis for State ${state.key}`
      );
    }
    if (
      interpretationBasis.authority_evidence_evaluation_state_key !== state.key
    ) {
      throw new Error(
        `Stale Authority Evidence Evaluation State Interpretation Basis for State ${state.key}: basis state key mismatch`
      );
    }
    if (
      (canonicalValue === "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE" &&
        interpretationBasis.interpretation !==
          "INTERPRET_AS_AUTHORITY_STATE_POSITIVE") ||
      (canonicalValue === "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE" &&
        interpretationBasis.interpretation !==
          "INTERPRET_AS_AUTHORITY_STATE_NEGATIVE")
    ) {
      throw new Error(
        `Canonical Authority State invariant violated: ${canonicalValue} requires matching interpretation basis for State ${state.key}`
      );
    }
    interpretationBasisKey = interpretationBasis.key;
    interpretationPolicyKey =
      interpretationBasis.authority_evidence_evaluation_state_interpretation_policy_key;
    interpretation = interpretationBasis.interpretation;
  } else if (
    canonicalValue ===
    "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY"
  ) {
    if (interpretationBasis !== null || policy !== null) {
      throw new Error(
        `Canonical Authority State invariant violated: policy-absence state must not carry interpretation basis or policy for State ${state.key}`
      );
    }
  } else if (
    canonicalValue ===
    "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
  ) {
    if (interpretationBasis !== null) {
      throw new Error(
        `Canonical Authority State invariant violated: no-mapping state requires null Interpretation Basis for State ${state.key}`
      );
    }
    if (policy === null) {
      throw new Error(
        `Canonical Authority State invariant violated: no-mapping state requires non-null Interpretation Policy for State ${state.key}`
      );
    }
    interpretationPolicyKey = policy.key;
  }

  return {
    key: attentionObservationOperationalEligibilityCanonicalAuthorityStateBasisKey(
      {
        candidate_key: state.candidate_key,
        observation_need_key: state.observation_need_key,
        capability_requirement_set_key: state.capability_requirement_set_key,
        authority_observation_context_binding_key: binding.key,
        authority_holder_entity_id: binding.authority_holder_entity_id,
        authority_power: binding.authority_power,
        governance_scope_key: binding.governance_scope_key,
        authority_evaluation_instant_key: lineage.authority_evaluation_instant_key,
        authority_evaluation_at: state.authority_evaluation_at,
        authority_evidence_evaluation_state_key: state.key,
        authority_evidence_evaluation_state_basis_key:
          lineage.authority_evidence_evaluation_state_basis_key,
        authority_evidence_evaluation_state_interpretation_basis_status:
          assessment.status,
        authority_evidence_evaluation_state_interpretation_basis_key:
          interpretationBasisKey,
        authority_evidence_evaluation_state_interpretation_policy_key:
          interpretationPolicyKey,
        interpretation,
        canonical_authority_state_value: canonicalValue,
      }
    ),
    candidate_key: state.candidate_key,
    observation_need_key: state.observation_need_key,
    capability_requirement_set_key: state.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key: binding.key,
    authority_holder_entity_id: binding.authority_holder_entity_id,
    authority_power: binding.authority_power,
    governance_scope: binding.governance_scope,
    governance_scope_key: binding.governance_scope_key,
    authority_evaluation_instant_key: lineage.authority_evaluation_instant_key,
    authority_evaluation_at: state.authority_evaluation_at,
    authority_evidence_evaluation_state_key: state.key,
    authority_evidence_evaluation_state_basis_key:
      lineage.authority_evidence_evaluation_state_basis_key,
    authority_evidence_evaluation_state_interpretation_basis_status:
      assessment.status,
    authority_evidence_evaluation_state_interpretation_basis_key:
      interpretationBasisKey,
    authority_evidence_evaluation_state_interpretation_policy_key:
      interpretationPolicyKey,
    interpretation,
    canonical_authority_state_value: canonicalValue,
  };
}

function buildCanonicalAuthorityState(
  basis: AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis
): AttentionObservationOperationalEligibilityCanonicalAuthorityState {
  return {
    key: attentionObservationOperationalEligibilityCanonicalAuthorityStateKey({
      candidate_key: basis.candidate_key,
      observation_need_key: basis.observation_need_key,
      capability_requirement_set_key: basis.capability_requirement_set_key,
      authority_observation_context_binding_key:
        basis.authority_observation_context_binding_key,
      authority_holder_entity_id: basis.authority_holder_entity_id,
      authority_power: basis.authority_power,
      governance_scope_key: basis.governance_scope_key,
      authority_evaluation_at: basis.authority_evaluation_at,
      canonical_authority_state_value: basis.canonical_authority_state_value,
      canonical_authority_state_basis_key: basis.key,
    }),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key:
      basis.authority_observation_context_binding_key,
    authority_holder_entity_id: basis.authority_holder_entity_id,
    authority_power: basis.authority_power,
    governance_scope_key: basis.governance_scope_key,
    authority_evaluation_at: basis.authority_evaluation_at,
    value: basis.canonical_authority_state_value,
    canonical_authority_state_basis_key: basis.key,
  };
}

function summarizeCanonicalStates(
  bases: readonly AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis[]
): {
  has_canonical_authority_states: boolean;
  has_resolved_canonical_authority_states: boolean;
  has_unresolved_canonical_authority_states: boolean;
  has_explicitly_interpreted_authority_positive_states: boolean;
  has_explicitly_interpreted_authority_negative_states: boolean;
} {
  let has_canonical_authority_states = bases.length > 0;
  let has_resolved_canonical_authority_states = false;
  let has_unresolved_canonical_authority_states = false;
  let has_explicitly_interpreted_authority_positive_states = false;
  let has_explicitly_interpreted_authority_negative_states = false;

  for (const basis of bases) {
    if (
      isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved(
        basis.canonical_authority_state_value
      )
    ) {
      has_resolved_canonical_authority_states = true;
    } else {
      has_unresolved_canonical_authority_states = true;
    }
    if (
      basis.canonical_authority_state_value ===
      "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
    ) {
      has_explicitly_interpreted_authority_positive_states = true;
    }
    if (
      basis.canonical_authority_state_value ===
      "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
    ) {
      has_explicitly_interpreted_authority_negative_states = true;
    }
  }

  return {
    has_canonical_authority_states,
    has_resolved_canonical_authority_states,
    has_unresolved_canonical_authority_states,
    has_explicitly_interpreted_authority_positive_states,
    has_explicitly_interpreted_authority_negative_states,
  };
}

function assertCandidateStateInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment
): void {
  const summary = summarizeCanonicalStates(
    assessment.canonical_authority_state_bases
  );

  if (assessment.has_canonical_authority_states !== summary.has_canonical_authority_states) {
    throw new Error(
      `Canonical Authority State invariant violated: has_states summary mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_resolved_canonical_authority_states !==
    summary.has_resolved_canonical_authority_states
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: has_resolved summary mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_unresolved_canonical_authority_states !==
    summary.has_unresolved_canonical_authority_states
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: has_unresolved summary mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_explicitly_interpreted_authority_positive_states !==
    summary.has_explicitly_interpreted_authority_positive_states
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: has_positive summary mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_explicitly_interpreted_authority_negative_states !==
    summary.has_explicitly_interpreted_authority_negative_states
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: has_negative summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.canonical_authority_state_bases.length !==
    assessment.canonical_authority_states.length
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: basis/state cardinality mismatch for candidate ${assessment.candidate_key}`
    );
  }

  for (let i = 0; i < assessment.canonical_authority_state_bases.length; i++) {
    const basis = assessment.canonical_authority_state_bases[i]!;
    const state = assessment.canonical_authority_states[i]!;
    if (state.canonical_authority_state_basis_key !== basis.key) {
      throw new Error(
        `Canonical Authority State invariant violated: state/basis key mismatch for candidate ${assessment.candidate_key}`
      );
    }
    if (state.value !== basis.canonical_authority_state_value) {
      throw new Error(
        `Canonical Authority State invariant violated: state/basis value mismatch for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    assessment.status === "CANONICAL_AUTHORITY_STATES_PRESENT" &&
    assessment.canonical_authority_state_bases.length === 0
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: PRESENT requires non-empty states for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "CANONICAL_AUTHORITY_STATES_PRESENT" &&
    assessment.canonical_authority_state_bases.length !== 0
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: non-present candidate status requires empty states for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "CANONICAL_AUTHORITY_STATES_PRESENT" &&
    assessment.authority_evidence_evaluation_state_interpretation_basis_assessment
      .interpretation_basis_assessments.length !==
      assessment.canonical_authority_state_bases.length
  ) {
    throw new Error(
      `Canonical Authority State cardinality invariant violated for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure Candidate-level canonical Authority State composition from GROUND-115.
 */
export function assessAttentionCandidateObservationOperationalEligibilityCanonicalAuthorityState(
  interpretationBasisAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment
): AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityCanonicalAuthorityStateCandidateStatus,
    canonical_authority_state_bases: AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis[],
    canonical_authority_states: AttentionObservationOperationalEligibilityCanonicalAuthorityState[]
  ): AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment => {
    const summary = summarizeCanonicalStates(canonical_authority_state_bases);
    const assessment: AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment =
      {
        candidate_key: interpretationBasisAssessment.candidate_key,
        authority_evidence_evaluation_state_interpretation_basis_assessment:
          interpretationBasisAssessment,
        status,
        canonical_authority_state_bases,
        canonical_authority_states,
        ...summary,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateStateInvariant(assessment);
    return assessment;
  };

  if (
    interpretationBasisAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", [], []);
  }

  if (
    interpretationBasisAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", [], []);
  }

  if (
    interpretationBasisAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    return wrap("NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED", [], []);
  }

  if (
    interpretationBasisAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  ) {
    return wrap("NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED", [], []);
  }

  if (
    interpretationBasisAssessment.status !==
    "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_ASSESSMENTS_PRESENT"
  ) {
    throw new Error(
      `Canonical Authority State invariant violated: unexpected Interpretation Basis candidate status for ${interpretationBasisAssessment.candidate_key}`
    );
  }

  const canonical_authority_state_bases =
    interpretationBasisAssessment.interpretation_basis_assessments.map(
      (assessment) => {
        const canonicalValue =
          mapAuthorityEvidenceEvaluationStateInterpretationBasisAssessmentToCanonicalAuthorityStateValue(
            assessment
          );
        return buildCanonicalAuthorityStateBasis(
          interpretationBasisAssessment,
          assessment,
          canonicalValue
        );
      }
    );
  const canonical_authority_states = canonical_authority_state_bases.map(
    buildCanonicalAuthorityState
  );

  return wrap(
    "CANONICAL_AUTHORITY_STATES_PRESENT",
    canonical_authority_state_bases,
    canonical_authority_states
  );
}

export function buildAttentionObservationOperationalEligibilityCanonicalAuthorityStateSet(
  input: AttentionObservationOperationalEligibilityCanonicalAuthorityStateEvalInput
): AttentionObservationOperationalEligibilityCanonicalAuthorityStateSetAssessment {
  const candidate_assessments =
    input.authority_evidence_evaluation_state_interpretation_basis_set.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityCanonicalAuthorityState
    );

  const has_canonical_authority_states = candidate_assessments.some(
    (candidate) => candidate.has_canonical_authority_states
  );
  const has_resolved_canonical_authority_states = candidate_assessments.some(
    (candidate) => candidate.has_resolved_canonical_authority_states
  );
  const has_unresolved_canonical_authority_states = candidate_assessments.some(
    (candidate) => candidate.has_unresolved_canonical_authority_states
  );
  const has_explicitly_interpreted_authority_positive_states =
    candidate_assessments.some(
      (candidate) =>
        candidate.has_explicitly_interpreted_authority_positive_states
    );
  const has_explicitly_interpreted_authority_negative_states =
    candidate_assessments.some(
      (candidate) =>
        candidate.has_explicitly_interpreted_authority_negative_states
    );

  return {
    authority_evidence_evaluation_state_interpretation_basis_set:
      input.authority_evidence_evaluation_state_interpretation_basis_set,
    candidate_assessments,
    has_canonical_authority_states,
    has_resolved_canonical_authority_states,
    has_unresolved_canonical_authority_states,
    has_explicitly_interpreted_authority_positive_states,
    has_explicitly_interpreted_authority_negative_states,
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_MODEL_LIMITATIONS,
    ],
  };
}
