/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Result (GROUND-148).
 *
 * Pure composition of GROUND-147 Composition Readiness Basis Set only.
 *
 * Answers only whether the exact GROUND-145 ANY/ALL condition holds over
 * readiness-authorized resolved GROUND-141 binding Evidence States preserved
 * inside GROUND-147.
 *
 * Must not import GROUND-146/145/141/140/139/137/135/134/133/132 builders,
 * project persistence, Permission, Authority, Reservation, Commitment,
 * Contention, Feasibility, or OE semantics.
 *
 * readiness HOLDS ≠ Composition Result HOLDS ≠ Resource Ready
 * readiness DOES_NOT_HOLD ≠ Composition Result DOES_NOT_HOLD ≠ Resource Not Ready
 * Result present ≠ Result HOLDS
 * Result absent ≠ Result DOES_NOT_HOLD
 * ANY ≠ physical alternatives
 * ALL ≠ cumulative physical supply
 */

import type {
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue,
} from "./attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResult,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultStatus,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultModelLimitation[] =
  [
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
    "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED",
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

const POSITIVE =
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE" as const;
const NEGATIVE =
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Canonical member Evidence lineage key for Result identity.
 * Exact binding→State-key→State-value triples, ordered by binding key.
 */
export function buildCanonicalResourceReadinessBindingEvidenceCompositionMemberEvidenceLineageKey(
  memberBindingKeys: readonly string[],
  memberEvidenceStateKeys: readonly string[],
  memberEvidenceStateValues: readonly AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue[]
): string {
  if (
    memberBindingKeys.length !== memberEvidenceStateKeys.length ||
    memberBindingKeys.length !== memberEvidenceStateValues.length
  ) {
    throw new Error(
      "RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member Evidence lineage cardinality mismatch"
    );
  }

  const triples = memberBindingKeys.map((bindingKey, index) =>
    [
      bindingKey,
      memberEvidenceStateKeys[index]!,
      memberEvidenceStateValues[index]!,
    ].join("=")
  );
  return [...triples].sort(compareStrings).join(",");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|compositionPolicyKey|compositionReadinessPolicyKey|
 * compositionReadinessBasisKey|canonicalMemberEvidenceLineageKey|compositionKind|compositionCondition
 */
export function attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_binding_evidence_composition_policy_key: string;
  resource_readiness_binding_evidence_composition_readiness_policy_key: string;
  resource_readiness_binding_evidence_composition_readiness_basis_key: string;
  member_binding_keys: readonly string[];
  member_evidence_state_keys: readonly string[];
  member_evidence_state_values: readonly AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue[];
  composition_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind;
  composition_condition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_binding_evidence_composition_policy_key,
    params.resource_readiness_binding_evidence_composition_readiness_policy_key,
    params.resource_readiness_binding_evidence_composition_readiness_basis_key,
    buildCanonicalResourceReadinessBindingEvidenceCompositionMemberEvidenceLineageKey(
      params.member_binding_keys,
      params.member_evidence_state_keys,
      params.member_evidence_state_values
    ),
    params.composition_kind,
    params.composition_condition,
  ].join("|");
}

/**
 * Pure ANY/ALL evaluation over already-validated resolved canonical State values.
 * No project persistence. No resolvedness recomputation. No older evidence.
 * Empty domain rejects — vacuous truth/false forbidden.
 */
export function deriveAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition(
  compositionKind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind,
  resolvedMemberStateValues: readonly AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue[]
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition {
  if (resolvedMemberStateValues.length === 0) {
    throw new Error(
      "RESOURCE_READINESS Binding Evidence Composition Result invariant violated: empty selected member domain (vacuous ANY/ALL forbidden)"
    );
  }

  for (const value of resolvedMemberStateValues) {
    if (value !== POSITIVE && value !== NEGATIVE) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: non-resolved State value ${value} under readiness HOLDS`
      );
    }
  }

  if (
    compositionKind === "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS"
  ) {
    return resolvedMemberStateValues.some((value) => value === POSITIVE)
      ? "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      : "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD";
  }

  if (
    compositionKind ===
    "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD"
  ) {
    return resolvedMemberStateValues.every((value) => value === POSITIVE)
      ? "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      : "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD";
  }

  const _exhaustive: never = compositionKind;
  void _exhaustive;
  throw new Error(
    `Unknown RESOURCE_READINESS Binding Evidence Composition kind: ${String(compositionKind)}`
  );
}

/**
 * Validates GROUND-147 Basis consistency under readiness HOLDS.
 * Does not recompute readiness. Rejects malformed upstream Basis.
 */
export function assertResourceReadinessBindingEvidenceCompositionReadinessHoldsBasisConsistency(
  basis: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis
): void {
  if (
    basis.readiness_policy_condition !==
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
  ) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: Basis ${basis.key} is not readiness HOLDS`
    );
  }

  if (basis.member_binding_keys.length === 0) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: empty member set for Basis ${basis.key}`
    );
  }

  if (
    basis.member_readiness_assessments.length !==
    basis.member_binding_keys.length
  ) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member assessment cardinality mismatch for Basis ${basis.key}`
    );
  }

  const seenBindings = new Set<string>();
  for (let i = 0; i < basis.member_binding_keys.length; i++) {
    const expectedBindingKey = basis.member_binding_keys[i]!;
    const assessment = basis.member_readiness_assessments[i]!;

    if (
      assessment.resource_readiness_observation_context_binding_key !==
      expectedBindingKey
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member assessment order/key mismatch for Basis ${basis.key}`
      );
    }

    if (seenBindings.has(expectedBindingKey)) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: duplicate member binding ${expectedBindingKey} for Basis ${basis.key}`
      );
    }
    seenBindings.add(expectedBindingKey);

    if (
      assessment.status !==
      "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_PRESENT_RESOLVED"
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member ${expectedBindingKey} status is not PRESENT_RESOLVED under readiness HOLDS for Basis ${basis.key}`
      );
    }

    if (!assessment.is_resolved_for_composition_readiness) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member ${expectedBindingKey} is_resolved=false under readiness HOLDS for Basis ${basis.key}`
      );
    }

    if (
      !assessment.has_current_canonical_binding_evidence_state ||
      assessment.canonical_binding_evidence_state === null ||
      assessment.canonical_binding_evidence_state_key === null ||
      assessment.canonical_binding_evidence_state_value === null
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member ${expectedBindingKey} missing current State lineage under readiness HOLDS for Basis ${basis.key}`
      );
    }

    const value = assessment.canonical_binding_evidence_state_value;
    if (value !== POSITIVE && value !== NEGATIVE) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member ${expectedBindingKey} has unresolved State ${value} under readiness HOLDS for Basis ${basis.key}`
      );
    }

    if (
      assessment.canonical_binding_evidence_state.key !==
      assessment.canonical_binding_evidence_state_key
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member ${expectedBindingKey} State key mismatch for Basis ${basis.key}`
      );
    }

    if (
      assessment.canonical_binding_evidence_state.state !==
      assessment.canonical_binding_evidence_state_value
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member ${expectedBindingKey} State value mismatch for Basis ${basis.key}`
      );
    }

    if (
      assessment.canonical_binding_evidence_state
        .resource_readiness_observation_context_binding_key !==
      expectedBindingKey
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: member ${expectedBindingKey} State binding-key mismatch for Basis ${basis.key}`
      );
    }
  }
}

function assertRequirementResultInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_RESULT_PRESENT"
  ) {
    if (assessment.composition_result === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: RESULT_PRESENT requires non-null result for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.composition_condition === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: RESULT_PRESENT requires non-null condition for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      !assessment.has_resource_readiness_binding_evidence_composition_result
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: RESULT_PRESENT requires has_result true for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.composition_condition !==
      assessment.composition_result.composition_condition
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: condition mismatch for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED" ||
    assessment.status ===
      "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    if (assessment.composition_result !== null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: non-present status requires null result for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.composition_condition !== null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: non-present status requires null condition for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.has_resource_readiness_binding_evidence_composition_result
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: non-present status requires has_result false for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown RESOURCE_READINESS Binding Evidence Composition Result status: ${String(assessment.status)}`
  );
}

function buildCompositionResult(
  basis: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResult {
  assertResourceReadinessBindingEvidenceCompositionReadinessHoldsBasisConsistency(
    basis
  );

  const member_binding_keys = [...basis.member_binding_keys];
  const member_evidence_state_keys = basis.member_readiness_assessments.map(
    (assessment) => assessment.canonical_binding_evidence_state_key!
  );
  const member_evidence_state_values = basis.member_readiness_assessments.map(
    (assessment) => assessment.canonical_binding_evidence_state_value!
  );

  const composition_condition =
    deriveAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition(
      basis.composition_kind,
      member_evidence_state_values
    );

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultKey(
      {
        candidate_key: basis.candidate_key,
        observation_need_key: basis.observation_need_key,
        capability_requirement_set_key: basis.capability_requirement_set_key,
        observation_resource_requirement_key:
          basis.observation_resource_requirement_key,
        resource_readiness_binding_evidence_composition_policy_key:
          basis.resource_readiness_binding_evidence_composition_policy_key,
        resource_readiness_binding_evidence_composition_readiness_policy_key:
          basis.resource_readiness_binding_evidence_composition_readiness_policy_key,
        resource_readiness_binding_evidence_composition_readiness_basis_key:
          basis.key,
        member_binding_keys,
        member_evidence_state_keys,
        member_evidence_state_values,
        composition_kind: basis.composition_kind,
        composition_condition,
      }
    ),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      basis.observation_resource_requirement_key,
    resource_readiness_binding_evidence_composition_policy_key:
      basis.resource_readiness_binding_evidence_composition_policy_key,
    resource_readiness_binding_evidence_composition_readiness_policy_key:
      basis.resource_readiness_binding_evidence_composition_readiness_policy_key,
    resource_readiness_binding_evidence_composition_readiness_basis_key:
      basis.key,
    member_binding_keys,
    composition_kind: basis.composition_kind,
    member_evidence_state_keys,
    member_evidence_state_values,
    composition_condition,
  };
}

function noResultAssessment(
  basisAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment,
  status: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultStatus
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment {
  const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment =
    {
      observation_resource_requirement_key:
        basisAssessment.observation_resource_requirement_key,
      composition_readiness_basis_assessment: basisAssessment,
      status,
      composition_result: null,
      composition_condition: null,
      has_resource_readiness_binding_evidence_composition_result: false,
    };
  assertRequirementResultInvariant(assessment);
  return assessment;
}

function assessRequirementCompositionResult(
  basisAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment {
  if (
    basisAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
  ) {
    return noResultAssessment(
      basisAssessment,
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
    );
  }

  if (
    basisAssessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
  ) {
    return noResultAssessment(
      basisAssessment,
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
    );
  }

  if (
    basisAssessment.status ===
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    // readiness DOES_NOT_HOLD ≠ composition DOES_NOT_HOLD — no Result.
    return noResultAssessment(
      basisAssessment,
      "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
    );
  }

  if (
    basisAssessment.status !==
      "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS" ||
    basisAssessment.readiness_basis === null ||
    basisAssessment.readiness_policy_condition !==
      "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
  ) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result invariant violated: unexpected GROUND-147 status ${basisAssessment.status} for requirement ${basisAssessment.observation_resource_requirement_key}`
    );
  }

  const composition_result = buildCompositionResult(
    basisAssessment.readiness_basis
  );

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment =
    {
      observation_resource_requirement_key:
        basisAssessment.observation_resource_requirement_key,
      composition_readiness_basis_assessment: basisAssessment,
      status:
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_RESULT_PRESENT",
      composition_result,
      composition_condition: composition_result.composition_condition,
      has_resource_readiness_binding_evidence_composition_result: true,
    };
  assertRequirementResultInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Binding Evidence Composition Result assessment.
 * Sole authority: GROUND-147 Candidate readiness Basis assessment.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResult(
  readinessBasisAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment {
  const requirement_composition_result_assessments =
    readinessBasisAssessment.requirement_readiness_basis_assessments.map(
      (basisAssessment) => assessRequirementCompositionResult(basisAssessment)
    );

  return {
    candidate_key: readinessBasisAssessment.candidate_key,
    resource_readiness_binding_evidence_composition_readiness_basis_assessment:
      readinessBasisAssessment,
    requirement_composition_result_assessments,
    has_resource_readiness_binding_evidence_composition_results:
      requirement_composition_result_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_result
      ),
    has_resource_readiness_binding_evidence_composition_conditions_holding:
      requirement_composition_result_assessments.some(
        (assessment) =>
          assessment.composition_condition ===
          "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      ),
    has_resource_readiness_binding_evidence_composition_conditions_not_holding:
      requirement_composition_result_assessments.some(
        (assessment) =>
          assessment.composition_condition ===
          "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level RESOURCE_READINESS Binding Evidence Composition Result.
 * Preserves GROUND-147 AttentionCandidate order.
 * Sole semantic input: GROUND-147.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment {
  const readinessBasisSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment =
    input.resource_readiness_binding_evidence_composition_readiness_basis_set;

  const candidate_assessments =
    readinessBasisSet.candidate_assessments.map((readinessBasisAssessment) =>
      assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResult(
        readinessBasisAssessment
      )
    );

  return {
    resource_readiness_binding_evidence_composition_readiness_basis_set:
      readinessBasisSet,
    candidate_assessments,
    has_resource_readiness_binding_evidence_composition_results:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_results
      ),
    has_resource_readiness_binding_evidence_composition_conditions_holding:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_conditions_holding
      ),
    has_resource_readiness_binding_evidence_composition_conditions_not_holding:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_conditions_not_holding
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_MODEL_LIMITATIONS,
    ],
  };
}
