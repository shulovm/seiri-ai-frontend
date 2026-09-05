/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis
 * (GROUND-150).
 *
 * Pure composition of:
 *   current GROUND-148 Binding Evidence Composition Result Set
 *   GROUND-149 Result Interpretation Policy Set
 *
 * Exact current Result + exact explicit mapping lookup only.
 *
 * Must not import GROUND-147/146/145/141 builders, project persistence,
 * Permission, Authority, Reservation, Commitment, Contention, Feasibility,
 * or OE semantics.
 *
 * NO_CURRENT_RESULT ≠ NEGATIVE
 * NO_POLICY ≠ NO_MAPPING
 * NO_MAPPING ≠ NEGATIVE
 * HOLDS ≠ POSITIVE; DOES_NOT_HOLD ≠ NEGATIVE
 * BASIS_PRESENT ≠ canonical per-requirement State
 * INTERPRET_AS_*_COMPOSITION_* ≠ RESOURCE_READY / NOT_READY
 * unusual explicit mappings are authoritative
 */

import {
  extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResult,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasis,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisModelLimitation[] =
  [
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

const CONTEXT_MISMATCH_PREFIX =
  "RESOURCE_READINESS Binding Evidence Composition Result set and Result Interpretation Policy set do not share compatible stable composition context";

const POSITIVE =
  "INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE" as const;
const NEGATIVE =
  "INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_NEGATIVE" as const;

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|compositionPolicyKey|currentCompositionResultKey|
 * interpretationPolicyKey|matchedMappingKey|currentCompositionCondition|interpretation
 */
export function attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_binding_evidence_composition_policy_key: string;
  resource_readiness_binding_evidence_composition_result_key: string;
  resource_readiness_binding_evidence_composition_result_interpretation_policy_key: string;
  matched_mapping_key: string;
  current_composition_condition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_binding_evidence_composition_policy_key,
    params.resource_readiness_binding_evidence_composition_result_key,
    params.resource_readiness_binding_evidence_composition_result_interpretation_policy_key,
    params.matched_mapping_key,
    params.current_composition_condition,
    params.interpretation,
  ].join("|");
}

/**
 * Exact composition_condition mapping lookup.
 * 0 → null; 1 → mapping; >1 conflicting → reject.
 */
export function findExactResourceReadinessBindingEvidenceCompositionResultInterpretationMapping(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping[],
  currentCondition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping | null {
  let found: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    if (mapping.composition_condition !== currentCondition) {
      continue;
    }
    if (found !== null && found.interpretation !== mapping.interpretation) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation mapping multiplicity invariant violated for ${currentCondition}`
      );
    }
    if (found === null) {
      found = mapping;
    }
  }

  return found;
}

function extractCompositionPolicyKeyFromResultAssessment(
  resultAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment
): string | null {
  if (
    resultAssessment.status ===
      "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_RESULT_PRESENT" &&
    resultAssessment.composition_result !== null
  ) {
    return resultAssessment.composition_result
      .resource_readiness_binding_evidence_composition_policy_key;
  }

  const policy =
    extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment(
      resultAssessment
    );
  return policy?.key ?? null;
}

function extractCompositionPolicyKeyFromPolicyAssessment(
  policyAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment
): string | null {
  if (
    policyAssessment.status ===
      "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_PRESENT" &&
    policyAssessment.interpretation_policy !== null
  ) {
    return policyAssessment.interpretation_policy
      .resource_readiness_binding_evidence_composition_policy_key;
  }

  if (
    policyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
  ) {
    return null;
  }

  return extractCompositionPolicyKeyFromResultAssessment(
    policyAssessment.binding_evidence_composition_result_assessment
  );
}

function assertCompatibleResultAndPolicyContexts(
  resultSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment,
  policySet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySetAssessment
): void {
  const resultByCandidate = new Map(
    resultSet.candidate_assessments.map((c) => [c.candidate_key, c])
  );
  const policyByCandidate = new Map(
    policySet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  if (resultByCandidate.size !== resultSet.candidate_assessments.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in GROUND-148 set`
    );
  }
  if (policyByCandidate.size !== policySet.candidate_assessments.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in GROUND-149 set`
    );
  }

  if (resultByCandidate.size !== policyByCandidate.size) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  for (const [candidateKey, resultCandidate] of resultByCandidate) {
    const policyCandidate = policyByCandidate.get(candidateKey);
    if (!policyCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-149 candidate ${candidateKey}`
      );
    }

    const resultByRequirement = new Map(
      resultCandidate.requirement_composition_result_assessments.map((a) => [
        a.observation_resource_requirement_key,
        a,
      ])
    );
    const policyByRequirement = new Map(
      policyCandidate.requirement_interpretation_policy_assessments.map(
        (a) => [a.observation_resource_requirement_key, a]
      )
    );

    if (resultByRequirement.size !== policyByRequirement.size) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: requirement count mismatch for candidate ${candidateKey}`
      );
    }

    for (const [requirementKey, resultAssessment] of resultByRequirement) {
      const policyAssessment = policyByRequirement.get(requirementKey);
      if (!policyAssessment) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-149 requirement ${requirementKey} for candidate ${candidateKey}`
        );
      }

      // Nested 149 lineage must refer to the same authoritative 148 assessment.
      if (
        policyAssessment.binding_evidence_composition_result_assessment
          .observation_resource_requirement_key !== requirementKey
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: nested GROUND-148 requirement key mismatch for ${requirementKey}`
        );
      }

      if (
        policyAssessment.binding_evidence_composition_result_assessment
          .status !== resultAssessment.status
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: GROUND-148 status mismatch for requirement ${requirementKey}`
        );
      }

      const resultPolicyKey =
        extractCompositionPolicyKeyFromResultAssessment(resultAssessment);
      const policyPolicyKey =
        extractCompositionPolicyKeyFromPolicyAssessment(policyAssessment);

      if (resultPolicyKey !== policyPolicyKey) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: composition-policy key mismatch for requirement ${requirementKey}`
        );
      }
    }
  }

  for (const candidateKey of policyByCandidate.keys()) {
    if (!resultByCandidate.has(candidateKey)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-148 candidate ${candidateKey}`
      );
    }
  }
}

function assertRequirementBasisInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment
): void {
  if (
    assessment.status ===
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: PRESENT requires non-null basis for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      !assessment.has_resource_readiness_binding_evidence_composition_result_interpretation_basis
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: PRESENT requires has_basis true for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.current_composition_condition === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: PRESENT requires current condition for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.interpretation === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: PRESENT requires interpretation for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.interpretation !==
      assessment.interpretation_basis.interpretation
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: interpretation mismatch for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (assessment.interpretation_basis !== null) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: non-present status requires null basis for requirement ${assessment.observation_resource_requirement_key}`
    );
  }
  if (
    assessment.has_resource_readiness_binding_evidence_composition_result_interpretation_basis
  ) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: non-present status requires has_basis false for requirement ${assessment.observation_resource_requirement_key}`
    );
  }
  if (assessment.interpretation !== null) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: non-present status requires null interpretation for requirement ${assessment.observation_resource_requirement_key}`
    );
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT"
  ) {
    if (assessment.current_composition_condition === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: ${assessment.status} requires current condition for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" ||
    assessment.status ===
      "NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT"
  ) {
    if (assessment.current_composition_condition !== null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: ${assessment.status} requires null current condition for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis status: ${String(assessment.status)}`
  );
}

function buildInterpretationBasis(
  compositionResult: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResult,
  interpretationPolicy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicy,
  matchedMapping: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasis {
  if (
    compositionResult.resource_readiness_binding_evidence_composition_policy_key !==
    interpretationPolicy.resource_readiness_binding_evidence_composition_policy_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: composition-policy key mismatch between Result and Interpretation Policy`
    );
  }

  if (
    matchedMapping.composition_condition !==
    compositionResult.composition_condition
  ) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: matched mapping source ${matchedMapping.composition_condition} != current Result ${compositionResult.composition_condition}`
    );
  }

  if (
    matchedMapping.interpretation !== POSITIVE &&
    matchedMapping.interpretation !== NEGATIVE
  ) {
    throw new Error(
      `Unknown RESOURCE_READINESS Binding Evidence Composition Result Interpretation: ${String(matchedMapping.interpretation)}`
    );
  }

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisKey(
      {
        candidate_key: compositionResult.candidate_key,
        observation_need_key: compositionResult.observation_need_key,
        capability_requirement_set_key:
          compositionResult.capability_requirement_set_key,
        observation_resource_requirement_key:
          compositionResult.observation_resource_requirement_key,
        resource_readiness_binding_evidence_composition_policy_key:
          compositionResult.resource_readiness_binding_evidence_composition_policy_key,
        resource_readiness_binding_evidence_composition_result_key:
          compositionResult.key,
        resource_readiness_binding_evidence_composition_result_interpretation_policy_key:
          interpretationPolicy.key,
        matched_mapping_key: matchedMapping.key,
        current_composition_condition:
          compositionResult.composition_condition,
        interpretation: matchedMapping.interpretation,
      }
    ),
    candidate_key: compositionResult.candidate_key,
    observation_need_key: compositionResult.observation_need_key,
    capability_requirement_set_key:
      compositionResult.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      compositionResult.observation_resource_requirement_key,
    resource_readiness_binding_evidence_composition_policy_key:
      compositionResult.resource_readiness_binding_evidence_composition_policy_key,
    resource_readiness_binding_evidence_composition_result_key:
      compositionResult.key,
    resource_readiness_binding_evidence_composition_result_interpretation_policy_key:
      interpretationPolicy.key,
    current_composition_condition: compositionResult.composition_condition,
    matched_mapping_key: matchedMapping.key,
    interpretation: matchedMapping.interpretation,
  };
}

function assessRequirementInterpretationBasis(
  resultAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment,
  policyAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment {
  const resultPolicyKey =
    extractCompositionPolicyKeyFromResultAssessment(resultAssessment);
  const policyPolicyKey =
    extractCompositionPolicyKeyFromPolicyAssessment(policyAssessment);

  if (resultPolicyKey !== policyPolicyKey) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: composition-policy key mismatch for requirement ${resultAssessment.observation_resource_requirement_key}`
    );
  }

  // 1. NOT_APPLICABLE — no stable composition domain
  if (
    resultAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" ||
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" ||
    resultPolicyKey === null
  ) {
    if (
      resultAssessment.status !==
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" ||
      policyAssessment.status !==
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: inconsistent NOT_APPLICABLE lineage for requirement ${resultAssessment.observation_resource_requirement_key}`
      );
    }

    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment =
      {
        observation_resource_requirement_key:
          resultAssessment.observation_resource_requirement_key,
        binding_evidence_composition_result_assessment: resultAssessment,
        result_interpretation_policy_assessment: policyAssessment,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY",
        interpretation_basis: null,
        current_composition_condition: null,
        interpretation: null,
        has_resource_readiness_binding_evidence_composition_result_interpretation_basis:
          false,
      };
    assertRequirementBasisInvariant(assessment);
    return assessment;
  }

  // 2. NO_CURRENT_RESULT — before NO_POLICY, even if Policy exists
  if (
    resultAssessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED" ||
    resultAssessment.status ===
      "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment =
      {
        observation_resource_requirement_key:
          resultAssessment.observation_resource_requirement_key,
        binding_evidence_composition_result_assessment: resultAssessment,
        result_interpretation_policy_assessment: policyAssessment,
        status:
          "NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT",
        interpretation_basis: null,
        current_composition_condition: null,
        interpretation: null,
        has_resource_readiness_binding_evidence_composition_result_interpretation_basis:
          false,
      };
    assertRequirementBasisInvariant(assessment);
    return assessment;
  }

  // Current Result must be PRESENT from here.
  if (
    resultAssessment.status !==
      "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_RESULT_PRESENT" ||
    resultAssessment.composition_result === null ||
    resultAssessment.composition_condition === null
  ) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: unexpected GROUND-148 status ${resultAssessment.status} for requirement ${resultAssessment.observation_resource_requirement_key}`
    );
  }

  const current_composition_condition =
    resultAssessment.composition_condition;

  // 3. NO_POLICY
  if (
    policyAssessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED" ||
    policyAssessment.interpretation_policy === null
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment =
      {
        observation_resource_requirement_key:
          resultAssessment.observation_resource_requirement_key,
        binding_evidence_composition_result_assessment: resultAssessment,
        result_interpretation_policy_assessment: policyAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED",
        interpretation_basis: null,
        current_composition_condition,
        interpretation: null,
        has_resource_readiness_binding_evidence_composition_result_interpretation_basis:
          false,
      };
    assertRequirementBasisInvariant(assessment);
    return assessment;
  }

  if (
    policyAssessment.status !==
    "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_PRESENT"
  ) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis invariant violated: unexpected GROUND-149 status ${policyAssessment.status} for requirement ${resultAssessment.observation_resource_requirement_key}`
    );
  }

  // 4. Exact mapping lookup — NO_MAPPING or BASIS_PRESENT
  const matchedMapping =
    findExactResourceReadinessBindingEvidenceCompositionResultInterpretationMapping(
      policyAssessment.interpretation_policy.mappings,
      current_composition_condition
    );

  if (!matchedMapping) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment =
      {
        observation_resource_requirement_key:
          resultAssessment.observation_resource_requirement_key,
        binding_evidence_composition_result_assessment: resultAssessment,
        result_interpretation_policy_assessment: policyAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT",
        interpretation_basis: null,
        current_composition_condition,
        interpretation: null,
        has_resource_readiness_binding_evidence_composition_result_interpretation_basis:
          false,
      };
    assertRequirementBasisInvariant(assessment);
    return assessment;
  }

  const interpretation_basis = buildInterpretationBasis(
    resultAssessment.composition_result,
    policyAssessment.interpretation_policy,
    matchedMapping
  );

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment =
    {
      observation_resource_requirement_key:
        resultAssessment.observation_resource_requirement_key,
      binding_evidence_composition_result_assessment: resultAssessment,
      result_interpretation_policy_assessment: policyAssessment,
      status:
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_PRESENT",
      interpretation_basis,
      current_composition_condition,
      interpretation: interpretation_basis.interpretation,
      has_resource_readiness_binding_evidence_composition_result_interpretation_basis:
        true,
    };
  assertRequirementBasisInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Result Interpretation Basis assessment.
 * Exact mapping lookup only — no Result recomputation / readiness re-evaluation.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasis(
  resultAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment,
  policyAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisAssessment {
  if (resultAssessment.candidate_key !== policyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch (${resultAssessment.candidate_key} vs ${policyAssessment.candidate_key})`
    );
  }

  const policyByRequirement = new Map(
    policyAssessment.requirement_interpretation_policy_assessments.map((a) => [
      a.observation_resource_requirement_key,
      a,
    ])
  );

  const requirement_interpretation_basis_assessments =
    resultAssessment.requirement_composition_result_assessments.map(
      (requirementResultAssessment) => {
        const requirementPolicyAssessment = policyByRequirement.get(
          requirementResultAssessment.observation_resource_requirement_key
        );
        if (!requirementPolicyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-149 requirement ${requirementResultAssessment.observation_resource_requirement_key}`
          );
        }
        return assessRequirementInterpretationBasis(
          requirementResultAssessment,
          requirementPolicyAssessment
        );
      }
    );

  return {
    candidate_key: resultAssessment.candidate_key,
    resource_readiness_binding_evidence_composition_result_interpretation_policy_assessment:
      policyAssessment,
    requirement_interpretation_basis_assessments,
    has_resource_readiness_binding_evidence_composition_result_interpretation_bases:
      requirement_interpretation_basis_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_result_interpretation_basis
      ),
    has_resource_readiness_binding_evidence_composition_positive_interpretations:
      requirement_interpretation_basis_assessments.some(
        (assessment) => assessment.interpretation === POSITIVE
      ),
    has_resource_readiness_binding_evidence_composition_negative_interpretations:
      requirement_interpretation_basis_assessments.some(
        (assessment) => assessment.interpretation === NEGATIVE
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level RESOURCE_READINESS Binding Evidence Composition Result
 * Interpretation Basis. Preserves GROUND-148 AttentionCandidate order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSetAssessment {
  assertCompatibleResultAndPolicyContexts(
    input.resource_readiness_binding_evidence_composition_result_set,
    input.resource_readiness_binding_evidence_composition_result_interpretation_policy_set
  );

  const policyByCandidate = new Map(
    input.resource_readiness_binding_evidence_composition_result_interpretation_policy_set.candidate_assessments.map(
      (assessment) => [assessment.candidate_key, assessment]
    )
  );

  const candidate_assessments =
    input.resource_readiness_binding_evidence_composition_result_set.candidate_assessments.map(
      (resultAssessment) => {
        const policyAssessment = policyByCandidate.get(
          resultAssessment.candidate_key
        );
        if (!policyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing GROUND-149 candidate ${resultAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasis(
          resultAssessment,
          policyAssessment
        );
      }
    );

  return {
    resource_readiness_binding_evidence_composition_result_set:
      input.resource_readiness_binding_evidence_composition_result_set,
    resource_readiness_binding_evidence_composition_result_interpretation_policy_set:
      input.resource_readiness_binding_evidence_composition_result_interpretation_policy_set,
    candidate_assessments,
    has_resource_readiness_binding_evidence_composition_result_interpretation_bases:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_result_interpretation_bases
      ),
    has_resource_readiness_binding_evidence_composition_positive_interpretations:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_positive_interpretations
      ),
    has_resource_readiness_binding_evidence_composition_negative_interpretations:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_negative_interpretations
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
