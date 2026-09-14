/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Evidence Evaluation State Interpretation Basis (GROUND-140).
 *
 * GROUND-137 current RESOURCE_READINESS Evidence Evaluation State
 * + GROUND-139 Explicit RESOURCE_READINESS Evidence Interpretation Policy
 * → RESOURCE_READINESS Evidence Evaluation State Interpretation Basis only.
 *
 * Exact canonical structured-value matching only.
 * NO_POLICY ≠ NO_MAPPING; BASIS_PRESENT ≠ canonical Resource Readiness Evidence State
 *
 * Must not import GROUND-135/134/133/132/084/022, ProjectState, Permission, Authority, OE.
 */

import {
  attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-types.js";
import {
  attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMappingKey,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationBasis,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisStatus,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisModelLimitation[] =
  [
    "PER_BINDING_CANONICAL_RESOURCE_READINESS_EVIDENCE_STATE_NOT_MODELED",
    "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_POLICY_NOT_MODELED",
    "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_READINESS_NOT_MODELED",
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

const CONTEXT_MISMATCH_PREFIX =
  "RESOURCE_READINESS Evidence Evaluation State set and Interpretation Policy set do not share the same observation Candidate context";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|bindingKey|resourceDeclarationId|
 * currentEvaluationStateKey|currentEvaluationStateBasisKey|canonicalCurrentStateValueKey|
 * interpretationPolicyKey|matchedInterpretationMappingKey|interpretation
 */
export function attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  resource_readiness_evidence_evaluation_state_key: string;
  resource_readiness_evidence_evaluation_state_basis_key: string;
  resource_readiness_evidence_evaluation_state_value_canonical_key: string;
  resource_readiness_evidence_interpretation_policy_key: string;
  matched_interpretation_mapping_key: string;
  interpretation: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    params.resource_readiness_evidence_evaluation_state_key,
    params.resource_readiness_evidence_evaluation_state_basis_key,
    params.resource_readiness_evidence_evaluation_state_value_canonical_key,
    params.resource_readiness_evidence_interpretation_policy_key,
    params.matched_interpretation_mapping_key,
    params.interpretation,
  ].join("|");
}

/**
 * Exact canonical structured-value mapping lookup.
 * At most one semantically distinct interpretation per current value.
 */
export function findExactResourceReadinessEvidenceEvaluationStateInterpretationMapping(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[],
  currentValue: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping | null {
  const currentKey =
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
      currentValue
    );
  let found: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    const sourceKey =
      attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
        mapping.resource_readiness_evidence_evaluation_state_value
      );
    if (sourceKey !== currentKey) {
      continue;
    }
    if (found !== null && found.interpretation !== mapping.interpretation) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State Interpretation mapping multiplicity invariant violated for structured state ${currentKey}`
      );
    }
    if (found === null) {
      found = mapping;
    }
  }

  return found;
}

function indexBasesByKey(
  bases: readonly AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis[]
): Map<
  string,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis
> {
  const byKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis
  >();
  for (const basis of bases) {
    if (byKey.has(basis.key)) {
      throw new Error(
        `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: duplicate State Basis key ${basis.key}`
      );
    }
    byKey.set(basis.key, basis);
  }
  return byKey;
}

function indexPolicyBindingAssessmentsByKey(
  assessments: readonly AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment[]
): Map<
  string,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment
> {
  const byKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment
  >();
  for (const assessment of assessments) {
    const bindingKey =
      assessment.resource_readiness_observation_context_binding_key;
    if (byKey.has(bindingKey)) {
      throw new Error(
        `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: duplicate policy binding assessment for ${bindingKey}`
      );
    }
    byKey.set(bindingKey, assessment);
  }
  return byKey;
}

function assertCurrentStateSelfConsistency(
  state: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState,
  basis: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis
): void {
  if (state.basis_key !== basis.key) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: State/Basis key mismatch for State ${state.key}`
    );
  }

  const stateValueKey =
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
      state.evaluation_state
    );
  const basisValueKey =
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
      basis.evaluation_state_value
    );
  if (stateValueKey !== basisValueKey) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: forged State value for State ${state.key}`
    );
  }

  if (
    state.candidate_key !== basis.candidate_key ||
    state.observation_need_key !== basis.observation_need_key ||
    state.capability_requirement_set_key !==
      basis.capability_requirement_set_key ||
    state.observation_resource_requirement_key !==
      basis.observation_resource_requirement_key ||
    state.resource_readiness_observation_context_binding_key !==
      basis.resource_readiness_observation_context_binding_key ||
    state.resource_declaration_id !== basis.resource_declaration_id ||
    state.raw_binding_evidence_assessment_key !==
      basis.raw_binding_evidence_assessment_key
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: State/Basis context mismatch for State ${state.key}`
    );
  }
}

function assertBindingContextAlignment(
  state: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState,
  basis: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis,
  policyBindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment
): void {
  const binding = policyBindingAssessment.binding;

  if (
    policyBindingAssessment.resource_readiness_observation_context_binding_key !==
      binding.key ||
    state.resource_readiness_observation_context_binding_key !== binding.key ||
    basis.resource_readiness_observation_context_binding_key !== binding.key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: binding key mismatch for binding ${binding.key}`
    );
  }

  if (
    state.candidate_key !== binding.candidate_key ||
    state.observation_need_key !== binding.observation_need_key ||
    state.capability_requirement_set_key !==
      binding.capability_requirement_set_key ||
    state.observation_resource_requirement_key !==
      binding.observation_resource_requirement_key ||
    state.resource_declaration_id !== binding.resource_declaration_id ||
    basis.candidate_key !== binding.candidate_key ||
    basis.observation_need_key !== binding.observation_need_key ||
    basis.capability_requirement_set_key !==
      binding.capability_requirement_set_key ||
    basis.observation_resource_requirement_key !==
      binding.observation_resource_requirement_key ||
    basis.resource_declaration_id !== binding.resource_declaration_id
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: binding context mismatch for binding ${binding.key}`
    );
  }
}

function assertPolicySelfConsistency(
  policy: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicy
): void {
  const seen = new Map<string, string>();
  for (const mapping of policy.mappings) {
    const sourceKey =
      attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
        mapping.resource_readiness_evidence_evaluation_state_value
      );
    const existing = seen.get(sourceKey);
    if (existing !== undefined && existing !== mapping.interpretation) {
      throw new Error(
        `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: conflicting policy mappings for structured state ${sourceKey}`
      );
    }
    seen.set(sourceKey, mapping.interpretation);
  }
}

function assertPerBindingAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment
): void {
  const expectedHas = assessment.interpretation_basis !== null;

  if (
    assessment.has_resource_readiness_evidence_interpretation_basis !==
    expectedHas
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: has_basis mismatch for State ${assessment.resource_readiness_evidence_evaluation_state.key}`
    );
  }

  if (
    assessment.status ===
      "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    assessment.interpretation_basis === null
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: PRESENT requires non-null Basis for State ${assessment.resource_readiness_evidence_evaluation_state.key}`
    );
  }

  if (
    assessment.status !==
      "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    assessment.interpretation_basis !== null
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: non-present status requires null Basis for State ${assessment.resource_readiness_evidence_evaluation_state.key}`
    );
  }

  if (
    assessment.resource_readiness_observation_context_binding_key !==
    assessment.resource_readiness_evidence_evaluation_state
      .resource_readiness_observation_context_binding_key
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: binding key mismatch on assessment for State ${assessment.resource_readiness_evidence_evaluation_state.key}`
    );
  }
}

function buildInterpretationBasis(params: {
  state: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState;
  basis: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis;
  policy: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicy;
  matchedMapping: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping;
}): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationBasis {
  const { state, basis, policy, matchedMapping } = params;
  const currentValueKey =
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
      state.evaluation_state
    );
  const matchedSourceKey =
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
      matchedMapping.resource_readiness_evidence_evaluation_state_value
    );

  if (currentValueKey !== matchedSourceKey) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: matched mapping source ${matchedSourceKey} does not equal current structured state ${currentValueKey}`
    );
  }

  if (
    matchedMapping.interpretation !==
      "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_POSITIVE" &&
    matchedMapping.interpretation !==
      "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_NEGATIVE"
  ) {
    throw new Error(
      `Unknown RESOURCE_READINESS Evidence Evaluation State Interpretation: ${String(matchedMapping.interpretation)}`
    );
  }

  const matched_interpretation_mapping_key =
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMappingKey(
      matchedMapping.resource_readiness_evidence_evaluation_state_value,
      matchedMapping.interpretation
    );

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationBasisKey(
      {
        candidate_key: state.candidate_key,
        observation_need_key: state.observation_need_key,
        capability_requirement_set_key: state.capability_requirement_set_key,
        observation_resource_requirement_key:
          state.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          state.resource_readiness_observation_context_binding_key,
        resource_declaration_id: state.resource_declaration_id,
        resource_readiness_evidence_evaluation_state_key: state.key,
        resource_readiness_evidence_evaluation_state_basis_key: basis.key,
        resource_readiness_evidence_evaluation_state_value_canonical_key:
          currentValueKey,
        resource_readiness_evidence_interpretation_policy_key: policy.key,
        matched_interpretation_mapping_key,
        interpretation: matchedMapping.interpretation,
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
    resource_readiness_evidence_evaluation_state_key: state.key,
    resource_readiness_evidence_evaluation_state_basis_key: basis.key,
    resource_readiness_evidence_evaluation_state_value: state.evaluation_state,
    resource_readiness_evidence_evaluation_state_value_canonical_key:
      currentValueKey,
    resource_readiness_evidence_interpretation_policy_key: policy.key,
    matched_interpretation_mapping_key,
    interpretation: matchedMapping.interpretation,
  };
}

function assessPerBindingInterpretationBasis(
  state: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState,
  basis: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis,
  policyBindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment {
  assertCurrentStateSelfConsistency(state, basis);
  assertBindingContextAlignment(state, basis, policyBindingAssessment);

  const wrap = (
    status: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisStatus,
    interpretationBasis: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationBasis | null
  ): AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment => {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment =
      {
        resource_readiness_observation_context_binding_key:
          state.resource_readiness_observation_context_binding_key,
        resource_readiness_evidence_evaluation_state: state,
        resource_readiness_evidence_interpretation_policy_assessment:
          policyBindingAssessment,
        status,
        interpretation_basis: interpretationBasis,
        has_resource_readiness_evidence_interpretation_basis:
          interpretationBasis !== null,
      };
    assertPerBindingAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    policyBindingAssessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (policyBindingAssessment.policy !== null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: NO_POLICY must not carry policy record for binding ${state.resource_readiness_observation_context_binding_key}`
      );
    }
    return wrap(
      "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED",
      null
    );
  }

  if (
    policyBindingAssessment.status !==
      "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT" ||
    policyBindingAssessment.policy === null
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: unexpected policy binding status for binding ${state.resource_readiness_observation_context_binding_key}`
    );
  }

  const policy = policyBindingAssessment.policy;
  assertPolicySelfConsistency(policy);

  if (
    policy.resource_readiness_observation_context_binding_key !==
      state.resource_readiness_observation_context_binding_key ||
    policy.candidate_key !== state.candidate_key ||
    policy.observation_need_key !== state.observation_need_key ||
    policy.capability_requirement_set_key !==
      state.capability_requirement_set_key ||
    policy.observation_resource_requirement_key !==
      state.observation_resource_requirement_key ||
    policy.resource_declaration_id !== state.resource_declaration_id
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: policy lineage mismatch for binding ${state.resource_readiness_observation_context_binding_key}`
    );
  }

  const matched = findExactResourceReadinessEvidenceEvaluationStateInterpretationMapping(
    policy.mappings,
    state.evaluation_state
  );

  if (matched === null) {
    return wrap(
      "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
      null
    );
  }

  return wrap(
    "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT",
    buildInterpretationBasis({ state, basis, policy, matchedMapping: matched })
  );
}

function isOuterEvaluationStatus(status: string): boolean {
  return (
    status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    status === "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED" ||
    status === "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY" ||
    status ===
      "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
    status === "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
  );
}

function groupBindingBasisAssessmentsByRequirement(
  assessments: readonly AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment[]
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisRequirementAssessment[] {
  const byRequirement = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisBindingAssessment[]
  >();

  for (const assessment of assessments) {
    const requirementKey =
      assessment.resource_readiness_evidence_evaluation_state
        .observation_resource_requirement_key;
    const existing = byRequirement.get(requirementKey);
    if (existing) {
      existing.push(assessment);
    } else {
      byRequirement.set(requirementKey, [assessment]);
    }
  }

  return [...byRequirement.entries()]
    .sort(([a], [b]) => compareStrings(a, b))
    .map(([observation_resource_requirement_key, binding_basis_assessments]) => ({
      observation_resource_requirement_key,
      binding_basis_assessments,
      has_resource_readiness_evidence_interpretation_bases:
        binding_basis_assessments.some(
          (entry) => entry.has_resource_readiness_evidence_interpretation_basis
        ),
    }));
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisAssessment
): void {
  const stateCount =
    assessment.resource_readiness_evidence_evaluation_state_assessment
      .evidence_evaluation_states.length;

  if (assessment.binding_basis_assessments.length !== stateCount) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis cardinality invariant violated for candidate ${assessment.candidate_key}`
    );
  }

  const expectedHas = assessment.binding_basis_assessments.some(
    (entry) => entry.has_resource_readiness_evidence_interpretation_basis
  );
  if (
    assessment.has_resource_readiness_evidence_interpretation_bases !==
    expectedHas
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: has_bases summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  const groupedCount = assessment.requirement_basis_assessments.reduce(
    (sum, requirementAssessment) =>
      sum + requirementAssessment.binding_basis_assessments.length,
    0
  );
  if (groupedCount !== assessment.binding_basis_assessments.length) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis grouped/flat mismatch for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Candidate/context counterpart invariant for GROUND-137 × GROUND-139 join.
 */
export function assertCompatibleResourceReadinessEvidenceInterpretationBasisContexts(
  evaluationStateSet: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSetAssessment,
  interpretationPolicySet: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySetAssessment
): void {
  const evalCandidates = evaluationStateSet.candidate_assessments;
  const policyCandidates = interpretationPolicySet.candidate_assessments;

  if (evalCandidates.length !== policyCandidates.length) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const policyByKey = new Map(
    policyCandidates.map((candidate) => [candidate.candidate_key, candidate])
  );
  const evalByKey = new Map(
    evalCandidates.map((candidate) => [candidate.candidate_key, candidate])
  );

  if (
    policyByKey.size !== policyCandidates.length ||
    evalByKey.size !== evalCandidates.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in input sets`
    );
  }

  for (const evalCandidate of evalCandidates) {
    const policyCandidate = policyByKey.get(evalCandidate.candidate_key);
    if (!policyCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Interpretation Policy candidate ${evalCandidate.candidate_key}`
      );
    }

    if (evalCandidate.candidate_key !== policyCandidate.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch for ${evalCandidate.candidate_key}`
      );
    }

    const bindingAssessment =
      policyCandidate.resource_readiness_observation_context_binding_assessment;

    if (
      evalCandidate.status ===
        "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT"
    ) {
      const policyBindingByKey = indexPolicyBindingAssessmentsByKey(
        policyCandidate.binding_policy_assessments
      );

      for (const state of evalCandidate.evidence_evaluation_states) {
        if (
          !policyBindingByKey.has(
            state.resource_readiness_observation_context_binding_key
          )
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Interpretation Policy binding assessment for binding ${state.resource_readiness_observation_context_binding_key}`
          );
        }
      }
      continue;
    }

    if (isOuterEvaluationStatus(evalCandidate.status)) {
      if (
        evalCandidate.status ===
          "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
      ) {
        // Policy may still exist for stable bindings without current State.
        continue;
      }

      if (
        evalCandidate.status ===
          "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      ) {
        if (
          bindingAssessment.status !==
            "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED" &&
          bindingAssessment.status !==
            "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
        ) {
          // Allow policy side to still carry requirement grouping under NO_BINDINGS.
          if (
            bindingAssessment.status ===
              "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
            bindingAssessment.status ===
              "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
            bindingAssessment.status ===
              "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED" ||
            bindingAssessment.status ===
              "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
          ) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: outer-status mismatch for candidate ${evalCandidate.candidate_key}`
            );
          }
        }
        continue;
      }

      if (bindingAssessment.status !== evalCandidate.status) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: outer-status mismatch for candidate ${evalCandidate.candidate_key}`
        );
      }
      continue;
    }

    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: unknown Evaluation State status for candidate ${evalCandidate.candidate_key}`
    );
  }

  for (const policyCandidate of policyCandidates) {
    if (!evalByKey.has(policyCandidate.candidate_key)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Evaluation State candidate ${policyCandidate.candidate_key}`
      );
    }
  }
}

/**
 * Pure Candidate-level RESOURCE_READINESS Evidence Evaluation State Interpretation Basis.
 *
 * Precedence per current State:
 * 1. outer / no bindings / no instant → zero Basis assessments
 * 2. require current GROUND-137 State
 * 3. 139 policy absent for binding → NO_POLICY
 * 4. policy present + no exact mapping → NO_MAPPING
 * 5. exact mapping → BASIS_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasis(
  evaluationStateAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment,
  interpretationPolicyAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisAssessment {
  const candidate_key = evaluationStateAssessment.candidate_key;

  if (candidate_key !== interpretationPolicyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch for ${candidate_key}`
    );
  }

  const empty =
    (): AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisAssessment => {
      const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisAssessment =
        {
          candidate_key,
          resource_readiness_evidence_evaluation_state_assessment:
            evaluationStateAssessment,
          resource_readiness_evidence_interpretation_policy_assessment:
            interpretationPolicyAssessment,
          requirement_basis_assessments: [],
          binding_basis_assessments: [],
          has_resource_readiness_evidence_interpretation_bases: false,
          model_limitations: [
            ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
          ],
        };
      assertCandidateAssessmentInvariant(assessment);
      return assessment;
    };

  if (isOuterEvaluationStatus(evaluationStateAssessment.status)) {
    return empty();
  }

  if (
    evaluationStateAssessment.status !==
    "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT"
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: applicable domain requires current States for candidate ${candidate_key}`
    );
  }

  const basisByKey = indexBasesByKey(
    evaluationStateAssessment.evidence_evaluation_state_bases
  );
  const policyBindingByKey = indexPolicyBindingAssessmentsByKey(
    interpretationPolicyAssessment.binding_policy_assessments
  );

  const binding_basis_assessments =
    evaluationStateAssessment.evidence_evaluation_states.map((state) => {
      const basis = basisByKey.get(state.basis_key);
      if (!basis) {
        throw new Error(
          `RESOURCE_READINESS Evidence Interpretation Basis invariant violated: missing Basis for State ${state.key}`
        );
      }

      const policyBindingAssessment = policyBindingByKey.get(
        state.resource_readiness_observation_context_binding_key
      );
      if (!policyBindingAssessment) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: missing Interpretation Policy binding assessment for binding ${state.resource_readiness_observation_context_binding_key}`
        );
      }

      return assessPerBindingInterpretationBasis(
        state,
        basis,
        policyBindingAssessment
      );
    });

  const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisAssessment =
    {
      candidate_key,
      resource_readiness_evidence_evaluation_state_assessment:
        evaluationStateAssessment,
      resource_readiness_evidence_interpretation_policy_assessment:
        interpretationPolicyAssessment,
      requirement_basis_assessments: groupBindingBasisAssessmentsByRequirement(
        binding_basis_assessments
      ),
      binding_basis_assessments,
      has_resource_readiness_evidence_interpretation_bases:
        binding_basis_assessments.some(
          (entry) => entry.has_resource_readiness_evidence_interpretation_basis
        ),
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

export function buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisSetAssessment {
  assertCompatibleResourceReadinessEvidenceInterpretationBasisContexts(
    input.resource_readiness_evidence_evaluation_state_set,
    input.resource_readiness_evidence_interpretation_policy_set
  );

  const policyByKey = new Map(
    input.resource_readiness_evidence_interpretation_policy_set.candidate_assessments.map(
      (candidate) => [candidate.candidate_key, candidate]
    )
  );

  const candidate_assessments =
    input.resource_readiness_evidence_evaluation_state_set.candidate_assessments.map(
      (evaluationStateAssessment) => {
        const interpretationPolicyAssessment = policyByKey.get(
          evaluationStateAssessment.candidate_key
        );
        if (!interpretationPolicyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Interpretation Policy counterpart for candidate ${evaluationStateAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasis(
          evaluationStateAssessment,
          interpretationPolicyAssessment
        );
      }
    );

  return {
    resource_readiness_evidence_evaluation_state_set:
      input.resource_readiness_evidence_evaluation_state_set,
    resource_readiness_evidence_interpretation_policy_set:
      input.resource_readiness_evidence_interpretation_policy_set,
    candidate_assessments,
    has_resource_readiness_evidence_interpretation_bases:
      candidate_assessments.some(
        (candidate) =>
          candidate.has_resource_readiness_evidence_interpretation_bases
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
