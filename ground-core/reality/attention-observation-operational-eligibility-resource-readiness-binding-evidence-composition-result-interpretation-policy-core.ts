/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Result Interpretation Policy
 * (GROUND-149).
 *
 * Pure composition of stable GROUND-148 Binding Evidence Composition result
 * context + explicit Result Interpretation Policy Specification.
 *
 * Declaration only. Does NOT consume current GROUND-148 Result values.
 * Must not import GROUND-147/146/145/141 builders, project persistence,
 * Permission, Authority, Reservation, Commitment, Contention, Feasibility,
 * or OE semantics.
 *
 * Interpretation Policy ≠ Interpretation Basis ≠ canonical per-requirement State
 * INTERPRET_AS_*_COMPOSITION_POSITIVE/NEGATIVE ≠ RESOURCE_READY / NOT_READY
 * policy absence ≠ explicit empty policy
 * unusual mappings are valid; partial policy is valid
 * HOLDS ≠ POSITIVE; DOES_NOT_HOLD ≠ NEGATIVE (unless explicitly mapped)
 * readiness_policy_key excluded from identity
 */

import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMappingInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyStatus,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyModelLimitation[] =
  [
    "CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_INTERPRETED",
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

export const EMPTY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_SET =
  "EMPTY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_SET" as const;

export const CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_ORDER: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretation[] =
  [
    "INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE",
    "INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_NEGATIVE",
  ];

export const CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_CONDITION_ORDER: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition[] =
  [
    "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS",
    "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD",
  ];

const INTERPRETATION_ORDER = new Map(
  CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_ORDER.map(
    (value, index) => [value, index]
  )
);

const CONDITION_ORDER = new Map(
  CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_CONDITION_ORDER.map(
    (value, index) => [value, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeInterpretation(
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretation
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown RESOURCE_READINESS Binding Evidence Composition Result Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

function normalizeCompositionCondition(
  condition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition {
  if (!CONDITION_ORDER.has(condition)) {
    throw new Error(
      `Unknown RESOURCE_READINESS Binding Evidence Composition Condition: ${String(condition)}`
    );
  }
  return condition;
}

/**
 * Mapping identity — value-level source only.
 * attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-mapping|
 * compositionCondition|interpretation
 */
export function attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMappingKey(params: {
  composition_condition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-mapping",
    params.composition_condition,
    params.interpretation,
  ].join("|");
}

export function buildCanonicalResourceReadinessBindingEvidenceCompositionResultInterpretationMappingSetKey(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping[]
): string {
  if (mappings.length === 0) {
    return EMPTY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_SET;
  }
  return mappings
    .map((mapping) => mapping.key)
    .sort(compareStrings)
    .join(",");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|compositionPolicyKey|canonicalMappingSetKey
 *
 * Excludes: current Result key, readiness Basis key, readiness policy key,
 * current composition_condition, current member State lineage.
 */
export function attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_binding_evidence_composition_policy_key: string;
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping[];
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_binding_evidence_composition_policy_key,
    buildCanonicalResourceReadinessBindingEvidenceCompositionResultInterpretationMappingSetKey(
      params.mappings
    ),
  ].join("|");
}

/**
 * Canonicalize exact Result-value mappings.
 * Duplicate identical → one. Same source + different interpretation → reject.
 * Mapping order ≠ priority.
 */
export function canonicalizeResourceReadinessBindingEvidenceCompositionResultInterpretationMappings(
  mappingInputs: readonly AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMappingInput[]
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping[] {
  if (!Array.isArray(mappingInputs)) {
    throw new Error("mappings must be an array");
  }

  const byCondition = new Map<
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping
  >();

  for (const entry of mappingInputs) {
    const composition_condition = normalizeCompositionCondition(
      entry.composition_condition
    );
    const interpretation = normalizeInterpretation(entry.interpretation);
    const mapping: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMapping =
      {
        key: attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMappingKey(
          { composition_condition, interpretation }
        ),
        composition_condition,
        interpretation,
      };

    const existing = byCondition.get(composition_condition);
    if (existing) {
      if (existing.interpretation !== interpretation) {
        throw new Error(
          `Conflicting RESOURCE_READINESS Binding Evidence Composition Result Interpretation mappings for ${composition_condition}`
        );
      }
      continue;
    }
    byCondition.set(composition_condition, mapping);
  }

  return [...byCondition.values()].sort((a, b) => {
    const conditionCompare =
      (CONDITION_ORDER.get(a.composition_condition) ?? 0) -
      (CONDITION_ORDER.get(b.composition_condition) ?? 0);
    if (conditionCompare !== 0) return conditionCompare;
    return (
      (INTERPRETATION_ORDER.get(a.interpretation) ?? 0) -
      (INTERPRETATION_ORDER.get(b.interpretation) ?? 0)
    );
  });
}

/**
 * Extract stable GROUND-145 Composition Policy from nested GROUND-148 lineage.
 * Uses only nested composition-policy assessment — not current Result value.
 */
export function extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment(
  resultAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy | null {
  const compositionPolicyAssessment =
    resultAssessment.composition_readiness_basis_assessment
      .composition_readiness_policy_assessment
      .binding_evidence_composition_policy_assessment;

  if (
    compositionPolicyAssessment.status ===
      "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_PRESENT" &&
    compositionPolicyAssessment.policy !== null
  ) {
    return compositionPolicyAssessment.policy;
  }

  return null;
}

interface CompositionPolicyIndexEntry {
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment;
  resultAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment;
  compositionPolicy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy;
}

function collectCompositionPoliciesByKey(
  resultSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment
): Map<string, CompositionPolicyIndexEntry> {
  const byKey = new Map<string, CompositionPolicyIndexEntry>();

  for (const candidate of resultSet.candidate_assessments) {
    for (const resultAssessment of candidate.requirement_composition_result_assessments) {
      const compositionPolicy =
        extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment(
          resultAssessment
        );
      if (!compositionPolicy) continue;

      if (byKey.has(compositionPolicy.key)) {
        throw new Error(
          `Ambiguous RESOURCE_READINESS Binding Evidence Composition Policy key ${compositionPolicy.key}`
        );
      }
      byKey.set(compositionPolicy.key, {
        candidateAssessment: candidate,
        resultAssessment,
        compositionPolicy,
      });
    }
  }

  return byKey;
}

/**
 * Validates and normalizes Interpretation Policy specification against
 * stable nested GROUND-145 Composition Policy contexts in GROUND-148.
 *
 * Exact duplicate (same composition-policy key + same mapping set) → one.
 * Same composition-policy key + different mapping sets → reject.
 * Unknown / stale / no-composition-policy targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification(
  resultSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification {
  const policiesByKey = collectCompositionPoliciesByKey(resultSet);
  const byCompositionPolicyKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyInput
  >();

  if (!Array.isArray(specification.requirement_policies)) {
    throw new Error("requirement_policies must be an array");
  }

  for (const entry of specification.requirement_policies) {
    if (
      !entry.resource_readiness_binding_evidence_composition_policy_key ||
      entry.resource_readiness_binding_evidence_composition_policy_key.trim()
        .length === 0
    ) {
      throw new Error(
        "resource_readiness_binding_evidence_composition_policy_key must be non-empty"
      );
    }

    const target = policiesByKey.get(
      entry.resource_readiness_binding_evidence_composition_policy_key
    );
    if (!target) {
      throw new Error(
        `Unknown or stale RESOURCE_READINESS Binding Evidence Composition Policy key ${entry.resource_readiness_binding_evidence_composition_policy_key}`
      );
    }

    const mappings =
      canonicalizeResourceReadinessBindingEvidenceCompositionResultInterpretationMappings(
        entry.mappings
      );

    const existing = byCompositionPolicyKey.get(
      entry.resource_readiness_binding_evidence_composition_policy_key
    );
    if (existing) {
      const existingCanonical =
        canonicalizeResourceReadinessBindingEvidenceCompositionResultInterpretationMappings(
          existing.mappings
        );
      if (
        buildCanonicalResourceReadinessBindingEvidenceCompositionResultInterpretationMappingSetKey(
          existingCanonical
        ) !==
        buildCanonicalResourceReadinessBindingEvidenceCompositionResultInterpretationMappingSetKey(
          mappings
        )
      ) {
        throw new Error(
          `Conflicting RESOURCE_READINESS Binding Evidence Composition Result Interpretation Policies declared for Composition Policy ${entry.resource_readiness_binding_evidence_composition_policy_key}`
        );
      }
      continue;
    }

    byCompositionPolicyKey.set(
      entry.resource_readiness_binding_evidence_composition_policy_key,
      {
        resource_readiness_binding_evidence_composition_policy_key:
          entry.resource_readiness_binding_evidence_composition_policy_key,
        mappings,
      }
    );
  }

  const requirement_policies = [...byCompositionPolicyKey.values()].sort(
    (a, b) =>
      compareStrings(
        a.resource_readiness_binding_evidence_composition_policy_key,
        b.resource_readiness_binding_evidence_composition_policy_key
      )
  );

  return { requirement_policies };
}

function buildInterpretationPolicy(
  compositionPolicy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy,
  mappingInputs: readonly AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationMappingInput[]
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicy {
  const canonicalMappings =
    canonicalizeResourceReadinessBindingEvidenceCompositionResultInterpretationMappings(
      mappingInputs
    );

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyKey(
      {
        candidate_key: compositionPolicy.candidate_key,
        observation_need_key: compositionPolicy.observation_need_key,
        capability_requirement_set_key:
          compositionPolicy.capability_requirement_set_key,
        observation_resource_requirement_key:
          compositionPolicy.observation_resource_requirement_key,
        resource_readiness_binding_evidence_composition_policy_key:
          compositionPolicy.key,
        mappings: canonicalMappings,
      }
    ),
    candidate_key: compositionPolicy.candidate_key,
    observation_need_key: compositionPolicy.observation_need_key,
    capability_requirement_set_key:
      compositionPolicy.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      compositionPolicy.observation_resource_requirement_key,
    resource_readiness_binding_evidence_composition_policy_key:
      compositionPolicy.key,
    mappings: canonicalMappings,
  };
}

function assertRequirementInterpretationPolicyInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_PRESENT"
  ) {
    if (assessment.interpretation_policy === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Policy invariant violated: PRESENT requires non-null policy for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      !assessment.has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Policy invariant violated: PRESENT requires boolean true for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (assessment.interpretation_policy !== null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Policy invariant violated: non-present status requires null policy for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Result Interpretation Policy invariant violated: non-present status requires boolean false for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown RESOURCE_READINESS Binding Evidence Composition Result Interpretation Policy status: ${String(assessment.status)}`
  );
}

function assessRequirementInterpretationPolicy(
  resultAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultRequirementAssessment,
  policiesByCompositionPolicyKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyInput
  >
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment {
  const compositionPolicy =
    extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment(
      resultAssessment
    );

  if (!compositionPolicy) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment =
      {
        observation_resource_requirement_key:
          resultAssessment.observation_resource_requirement_key,
        binding_evidence_composition_result_assessment: resultAssessment,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY",
        interpretation_policy: null,
        has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy:
          false,
      };
    assertRequirementInterpretationPolicyInvariant(assessment);
    return assessment;
  }

  const declared = policiesByCompositionPolicyKey.get(compositionPolicy.key);
  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment =
      {
        observation_resource_requirement_key:
          resultAssessment.observation_resource_requirement_key,
        binding_evidence_composition_result_assessment: resultAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED",
        interpretation_policy: null,
        has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy:
          false,
      };
    assertRequirementInterpretationPolicyInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyRequirementAssessment =
    {
      observation_resource_requirement_key:
        resultAssessment.observation_resource_requirement_key,
      binding_evidence_composition_result_assessment: resultAssessment,
      status:
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_PRESENT",
      interpretation_policy: buildInterpretationPolicy(
        compositionPolicy,
        declared.mappings
      ),
      has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy:
        true,
    };
  assertRequirementInterpretationPolicyInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Result Interpretation Policy assessment.
 * Does not look up current GROUND-148 Result values.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicy(
  resultAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultAssessment,
  policiesByCompositionPolicyKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyAssessment {
  const requirement_interpretation_policy_assessments =
    resultAssessment.requirement_composition_result_assessments.map(
      (requirementAssessment) =>
        assessRequirementInterpretationPolicy(
          requirementAssessment,
          policiesByCompositionPolicyKey
        )
    );

  return {
    candidate_key: resultAssessment.candidate_key,
    resource_readiness_binding_evidence_composition_result_assessment:
      resultAssessment,
    requirement_interpretation_policy_assessments,
    has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policies:
      requirement_interpretation_policy_assessments.some(
        (assessment) =>
          assessment.has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit RESOURCE_READINESS Binding Evidence Composition
 * Result Interpretation Policy. Preserves GROUND-148 AttentionCandidate order.
 * Does not inspect current composition_condition / Result existence for Policy identity.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySet(
  input: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification(
      input.resource_readiness_binding_evidence_composition_result_set,
      input.specification
    );

  const policiesByCompositionPolicyKey = new Map(
    normalizedSpecification.requirement_policies.map((entry) => [
      entry.resource_readiness_binding_evidence_composition_policy_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_binding_evidence_composition_result_set.candidate_assessments.map(
      (resultAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicy(
          resultAssessment,
          policiesByCompositionPolicyKey
        )
    );

  return {
    resource_readiness_binding_evidence_composition_result_set:
      input.resource_readiness_binding_evidence_composition_result_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policies:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
