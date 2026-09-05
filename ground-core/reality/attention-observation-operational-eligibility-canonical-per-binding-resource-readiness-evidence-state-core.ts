/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Canonical per-binding RESOURCE_READINESS Evidence State (GROUND-141).
 *
 * Pure normalization of GROUND-140 RESOURCE_READINESS Evidence Evaluation
 * State Interpretation Basis into canonical per-binding Evidence State.
 *
 * Must not import GROUND-139/137/135/134/133/132/084/022, project persistence,
 * Permission, Authority, Capability, Reservation, Commitment, Contention,
 * Feasibility, or OE semantics.
 *
 * EXPLICITLY_INTERPRETED_* ≠ RESOURCE_READY / requirement satisfied
 * UNRESOLVED_NO_POLICY ≠ NEGATIVE / RESOURCE_NOT_READY
 * UNRESOLVED_NO_MAPPING ≠ NEGATIVE / RESOURCE_NOT_READY
 * resolved ≠ positive
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateBasis,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateInput,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateModelLimitation,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateRequirementAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateStatus,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue,
} from "./attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_PER_BINDING_RESOURCE_READINESS_EVIDENCE_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateModelLimitation[] =
  [
    "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_POLICY_NOT_MODELED",
    "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_READINESS_NOT_MODELED",
    "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_RESULT_NOT_MODELED",
    "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_STATE_NOT_MODELED",
    "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
    "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const NONE_TOKEN = "NONE" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildCanonicalPerBindingResourceReadinessEvidenceStateValueCanonicalKey(
  value: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue
): string {
  return value;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|bindingKey|resourceDeclarationId|
 * ground140Status|ground140BasisKey-or-NONE|ground137StateKey|ground137StateBasisKey|
 * policyKey-or-NONE|matchedMappingKey-or-NONE|interpretation-or-NONE|canonicalState
 */
export function attentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  resource_readiness_evidence_interpretation_basis_status: string;
  resource_readiness_evidence_interpretation_basis_key: string | null;
  resource_readiness_evidence_evaluation_state_key: string;
  resource_readiness_evidence_evaluation_state_basis_key: string;
  resource_readiness_evidence_interpretation_policy_key: string | null;
  matched_interpretation_mapping_key: string | null;
  interpretation: string | null;
  canonical_state: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.resource_readiness_evidence_interpretation_basis_status,
    params.resource_readiness_evidence_interpretation_basis_key ?? NONE_TOKEN,
    params.resource_readiness_evidence_evaluation_state_key,
    params.resource_readiness_evidence_evaluation_state_basis_key,
    params.resource_readiness_evidence_interpretation_policy_key ?? NONE_TOKEN,
    params.matched_interpretation_mapping_key ?? NONE_TOKEN,
    params.interpretation ?? NONE_TOKEN,
    buildCanonicalPerBindingResourceReadinessEvidenceStateValueCanonicalKey(
      params.canonical_state
    ),
  ].join("|");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state|
 * basisKey|candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|bindingKey|resourceDeclarationId|canonicalState
 */
export function attentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateKey(params: {
  basis_key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  canonical_state: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state",
    params.basis_key,
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    buildCanonicalPerBindingResourceReadinessEvidenceStateValueCanonicalKey(
      params.canonical_state
    ),
  ].join("|");
}

export function isResolvedAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState(
  value: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue
): boolean {
  return (
    value === "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE" ||
    value === "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE"
  );
}

function assertInterpretationBasisPresentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: PRESENT requires non-null basis for State ${assessment.resource_readiness_evidence_evaluation_state.key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
  ) {
    if (assessment.interpretation_basis !== null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: non-present status requires null basis for State ${assessment.resource_readiness_evidence_evaluation_state.key}`
      );
    }
  }
}

function assertPolicyAbsenceInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment
): void {
  const policyBindingAssessment =
    assessment.resource_readiness_evidence_interpretation_policy_assessment;
  if (
    policyBindingAssessment.status ===
      "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT" ||
    policyBindingAssessment.policy !== null
  ) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: policy-absence status must not carry policy PRESENT for State ${assessment.resource_readiness_evidence_evaluation_state.key}`
    );
  }
}

function assertNoMappingInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment
): void {
  const policyBindingAssessment =
    assessment.resource_readiness_evidence_interpretation_policy_assessment;
  if (
    policyBindingAssessment.status !==
      "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT" ||
    policyBindingAssessment.policy === null
  ) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: no-mapping status requires explicit Interpretation Policy PRESENT for State ${assessment.resource_readiness_evidence_evaluation_state.key}`
    );
  }
}

/**
 * Exhaustive GROUND-140 per-binding → canonical Evidence State mapping.
 * No fallback coercion. No evidence-axis reinterpretation.
 */
export function deriveAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue {
  assertInterpretationBasisPresentInvariant(assessment);

  switch (assessment.status) {
    case "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED":
      assertPolicyAbsenceInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY";

    case "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE":
      assertNoMappingInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE";

    case "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT": {
      const basis = assessment.interpretation_basis!;
      switch (basis.interpretation) {
        case "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_POSITIVE":
          return "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE";
        case "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_NEGATIVE":
          return "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE";
        default:
          throw new Error(
            `Unknown RESOURCE_READINESS Evidence Evaluation State Interpretation: ${String(basis.interpretation)}`
          );
      }
    }

    default: {
      const _exhaustive: never = assessment.status;
      void _exhaustive;
      throw new Error(
        `Unknown RESOURCE_READINESS Evidence Interpretation Basis status: ${String(assessment.status)}`
      );
    }
  }
}

function buildCanonicalStateBasis(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment,
  canonicalValue: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateBasis {
  const state = assessment.resource_readiness_evidence_evaluation_state;
  const interpretationBasis = assessment.interpretation_basis;
  const policy =
    assessment.resource_readiness_evidence_interpretation_policy_assessment
      .policy;

  let interpretationBasisKey: string | null = null;
  let interpretationPolicyKey: string | null = null;
  let matchedInterpretationMappingKey: string | null = null;
  let interpretation: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateBasis["interpretation"] =
    null;

  if (
    canonicalValue ===
      "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE" ||
    canonicalValue ===
      "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE"
  ) {
    if (interpretationBasis === null) {
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: ${canonicalValue} requires non-null Interpretation Basis for State ${state.key}`
      );
    }
    if (
      interpretationBasis.resource_readiness_evidence_evaluation_state_key !==
      state.key
    ) {
      throw new Error(
        `Stale RESOURCE_READINESS Evidence Evaluation State Interpretation Basis for State ${state.key}: basis state key mismatch`
      );
    }
    if (
      (canonicalValue ===
        "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE" &&
        interpretationBasis.interpretation !==
          "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_POSITIVE") ||
      (canonicalValue ===
        "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE" &&
        interpretationBasis.interpretation !==
          "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_NEGATIVE")
    ) {
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: ${canonicalValue} requires matching interpretation basis for State ${state.key}`
      );
    }
    interpretationBasisKey = interpretationBasis.key;
    interpretationPolicyKey =
      interpretationBasis.resource_readiness_evidence_interpretation_policy_key;
    matchedInterpretationMappingKey =
      interpretationBasis.matched_interpretation_mapping_key;
    interpretation = interpretationBasis.interpretation;
  } else if (
    canonicalValue ===
    "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY"
  ) {
    if (interpretationBasis !== null || policy !== null) {
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: policy-absence state must not carry interpretation basis or policy for State ${state.key}`
      );
    }
  } else if (
    canonicalValue ===
    "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
  ) {
    if (interpretationBasis !== null) {
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: no-mapping state requires null Interpretation Basis for State ${state.key}`
      );
    }
    if (policy === null) {
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: no-mapping state requires non-null Interpretation Policy for State ${state.key}`
      );
    }
    interpretationPolicyKey = policy.key;
  }

  return {
    key: attentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateBasisKey(
      {
        candidate_key: state.candidate_key,
        observation_need_key: state.observation_need_key,
        capability_requirement_set_key: state.capability_requirement_set_key,
        observation_resource_requirement_key:
          state.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          state.resource_readiness_observation_context_binding_key,
        resource_declaration_id: state.resource_declaration_id,
        resource_readiness_evidence_interpretation_basis_status:
          assessment.status,
        resource_readiness_evidence_interpretation_basis_key:
          interpretationBasisKey,
        resource_readiness_evidence_evaluation_state_key: state.key,
        resource_readiness_evidence_evaluation_state_basis_key: state.basis_key,
        resource_readiness_evidence_interpretation_policy_key:
          interpretationPolicyKey,
        matched_interpretation_mapping_key: matchedInterpretationMappingKey,
        interpretation,
        canonical_state: canonicalValue,
      }
    ),
    candidate_key: state.candidate_key,
    observation_need_key: state.observation_need_key,
    capability_requirement_set_key: state.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      state.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      state.resource_readiness_observation_context_binding_key,
    resource_declaration_id: state.resource_declaration_id,
    resource_readiness_evidence_interpretation_basis_status: assessment.status,
    resource_readiness_evidence_interpretation_basis_key: interpretationBasisKey,
    resource_readiness_evidence_evaluation_state_key: state.key,
    resource_readiness_evidence_evaluation_state_basis_key: state.basis_key,
    resource_readiness_evidence_interpretation_policy_key:
      interpretationPolicyKey,
    matched_interpretation_mapping_key: matchedInterpretationMappingKey,
    interpretation,
    canonical_state: canonicalValue,
  };
}

function buildCanonicalState(
  basis: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateBasis
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState {
  return {
    key: attentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateKey(
      {
        basis_key: basis.key,
        candidate_key: basis.candidate_key,
        observation_need_key: basis.observation_need_key,
        capability_requirement_set_key: basis.capability_requirement_set_key,
        observation_resource_requirement_key:
          basis.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          basis.resource_readiness_observation_context_binding_key,
        resource_declaration_id: basis.resource_declaration_id,
        canonical_state: basis.canonical_state,
      }
    ),
    basis_key: basis.key,
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      basis.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      basis.resource_readiness_observation_context_binding_key,
    resource_declaration_id: basis.resource_declaration_id,
    state: basis.canonical_state,
  };
}

function buildPerBindingCanonicalStateAssessment(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment {
  const canonicalValue =
    deriveAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue(
      assessment
    );
  const canonical_state_basis = buildCanonicalStateBasis(
    assessment,
    canonicalValue
  );
  const canonical_state = buildCanonicalState(canonical_state_basis);
  const resolved =
    isResolvedAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState(
      canonicalValue
    );

  return {
    resource_readiness_observation_context_binding_key:
      assessment.resource_readiness_observation_context_binding_key,
    resource_readiness_evidence_interpretation_basis_assessment: assessment,
    canonical_state_basis,
    canonical_state,
    has_canonical_per_binding_resource_readiness_evidence_state: true,
    has_resolved_canonical_per_binding_resource_readiness_evidence_state:
      resolved,
    has_unresolved_canonical_per_binding_resource_readiness_evidence_state:
      !resolved,
  };
}

function summarizeBindingStateAssessments(
  assessments: readonly AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment[]
): {
  has_canonical_per_binding_resource_readiness_evidence_states: boolean;
  has_resolved_canonical_per_binding_resource_readiness_evidence_states: boolean;
  has_unresolved_canonical_per_binding_resource_readiness_evidence_states: boolean;
} {
  let has_resolved_canonical_per_binding_resource_readiness_evidence_states =
    false;
  let has_unresolved_canonical_per_binding_resource_readiness_evidence_states =
    false;

  for (const assessment of assessments) {
    if (
      assessment.has_resolved_canonical_per_binding_resource_readiness_evidence_state
    ) {
      has_resolved_canonical_per_binding_resource_readiness_evidence_states =
        true;
    }
    if (
      assessment.has_unresolved_canonical_per_binding_resource_readiness_evidence_state
    ) {
      has_unresolved_canonical_per_binding_resource_readiness_evidence_states =
        true;
    }
  }

  return {
    has_canonical_per_binding_resource_readiness_evidence_states:
      assessments.length > 0,
    has_resolved_canonical_per_binding_resource_readiness_evidence_states,
    has_unresolved_canonical_per_binding_resource_readiness_evidence_states,
  };
}

function groupBindingStateAssessmentsByRequirement(
  assessments: readonly AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment[]
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateRequirementAssessment[] {
  const byRequirement = new Map<
    string,
    AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment[]
  >();

  for (const assessment of assessments) {
    const requirementKey =
      assessment.canonical_state.observation_resource_requirement_key;
    const existing = byRequirement.get(requirementKey);
    if (existing) {
      existing.push(assessment);
    } else {
      byRequirement.set(requirementKey, [assessment]);
    }
  }

  return [...byRequirement.entries()]
    .sort(([a], [b]) => compareStrings(a, b))
    .map(
      ([
        observation_resource_requirement_key,
        canonical_binding_state_assessments,
      ]) => ({
        observation_resource_requirement_key,
        canonical_binding_state_assessments,
        ...summarizeBindingStateAssessments(canonical_binding_state_assessments),
      })
    );
}

function mapOuterEvaluationStatusToCanonicalCandidateStatus(
  status: string
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateStatus {
  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED":
      return "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED";
    case "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY":
      return "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY";
    case "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED":
      return "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED";
    case "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED":
      return "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED";
    default:
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: unexpected outer Evaluation State status ${status}`
      );
  }
}

function assertCandidateStateInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment
): void {
  const summary = summarizeBindingStateAssessments(
    assessment.canonical_binding_state_assessments
  );

  if (
    assessment.has_canonical_per_binding_resource_readiness_evidence_states !==
    summary.has_canonical_per_binding_resource_readiness_evidence_states
  ) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: has_states summary mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_resolved_canonical_per_binding_resource_readiness_evidence_states !==
    summary.has_resolved_canonical_per_binding_resource_readiness_evidence_states
  ) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: has_resolved summary mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_unresolved_canonical_per_binding_resource_readiness_evidence_states !==
    summary.has_unresolved_canonical_per_binding_resource_readiness_evidence_states
  ) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: has_unresolved summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  const ground140Count =
    assessment.resource_readiness_evidence_interpretation_basis_assessment
      .binding_basis_assessments.length;
  if (assessment.canonical_binding_state_assessments.length !== ground140Count) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State cardinality invariant violated for candidate ${assessment.candidate_key}`
    );
  }

  const groupedCount = assessment.requirement_state_assessments.reduce(
    (sum, requirementAssessment) =>
      sum + requirementAssessment.canonical_binding_state_assessments.length,
    0
  );
  if (groupedCount !== assessment.canonical_binding_state_assessments.length) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State grouped/flat mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "CANONICAL_PER_BINDING_RESOURCE_READINESS_EVIDENCE_STATES_PRESENT" &&
    assessment.canonical_binding_state_assessments.length === 0
  ) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: PRESENT requires non-empty states for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "CANONICAL_PER_BINDING_RESOURCE_READINESS_EVIDENCE_STATES_PRESENT" &&
    assessment.canonical_binding_state_assessments.length !== 0
  ) {
    throw new Error(
      `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: non-present candidate status requires empty states for candidate ${assessment.candidate_key}`
    );
  }

  for (const bindingAssessment of assessment.canonical_binding_state_assessments) {
    if (
      bindingAssessment.has_resolved_canonical_per_binding_resource_readiness_evidence_state ===
      bindingAssessment.has_unresolved_canonical_per_binding_resource_readiness_evidence_state
    ) {
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: resolved/unresolved mutual exclusivity for binding ${bindingAssessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      bindingAssessment.canonical_state.state !==
      bindingAssessment.canonical_state_basis.canonical_state
    ) {
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: state/basis value mismatch for binding ${bindingAssessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (
      bindingAssessment.canonical_state.basis_key !==
      bindingAssessment.canonical_state_basis.key
    ) {
      throw new Error(
        `Canonical per-binding RESOURCE_READINESS Evidence State invariant violated: state/basis key mismatch for binding ${bindingAssessment.resource_readiness_observation_context_binding_key}`
      );
    }
  }
}

/**
 * Pure Candidate-level canonical per-binding RESOURCE_READINESS Evidence State
 * composition from GROUND-140.
 */
export function assessAttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState(
  interpretationBasisAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisAssessment
): AttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateStatus,
    canonical_binding_state_assessments: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment[]
  ): AttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment => {
    const summary = summarizeBindingStateAssessments(
      canonical_binding_state_assessments
    );
    const assessment: AttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment =
      {
        candidate_key: interpretationBasisAssessment.candidate_key,
        resource_readiness_evidence_interpretation_basis_assessment:
          interpretationBasisAssessment,
        status,
        requirement_state_assessments: groupBindingStateAssessmentsByRequirement(
          canonical_binding_state_assessments
        ),
        canonical_binding_state_assessments,
        ...summary,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_PER_BINDING_RESOURCE_READINESS_EVIDENCE_STATE_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateStateInvariant(assessment);
    return assessment;
  };

  if (interpretationBasisAssessment.binding_basis_assessments.length === 0) {
    return wrap(
      mapOuterEvaluationStatusToCanonicalCandidateStatus(
        interpretationBasisAssessment
          .resource_readiness_evidence_evaluation_state_assessment.status
      ),
      []
    );
  }

  const canonical_binding_state_assessments =
    interpretationBasisAssessment.binding_basis_assessments.map(
      buildPerBindingCanonicalStateAssessment
    );

  return wrap(
    "CANONICAL_PER_BINDING_RESOURCE_READINESS_EVIDENCE_STATES_PRESENT",
    canonical_binding_state_assessments
  );
}

export function buildAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateSet(
  input: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateInput
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateSetAssessment {
  const candidate_assessments =
    input.resource_readiness_evidence_interpretation_basis_set.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState
    );

  return {
    resource_readiness_evidence_interpretation_basis_set:
      input.resource_readiness_evidence_interpretation_basis_set,
    candidate_assessments,
    has_canonical_per_binding_resource_readiness_evidence_states:
      candidate_assessments.some(
        (candidate) =>
          candidate.has_canonical_per_binding_resource_readiness_evidence_states
      ),
    has_resolved_canonical_per_binding_resource_readiness_evidence_states:
      candidate_assessments.some(
        (candidate) =>
          candidate.has_resolved_canonical_per_binding_resource_readiness_evidence_states
      ),
    has_unresolved_canonical_per_binding_resource_readiness_evidence_states:
      candidate_assessments.some(
        (candidate) =>
          candidate.has_unresolved_canonical_per_binding_resource_readiness_evidence_states
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_PER_BINDING_RESOURCE_READINESS_EVIDENCE_STATE_MODEL_LIMITATIONS,
    ],
  };
}
