/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Authority Evidence Evaluation State Interpretation Basis (GROUND-115).
 *
 * GROUND-113 current Authority Evidence Evaluation State
 * + GROUND-114 Explicit Authority Evidence Evaluation State Interpretation Policy
 * → Authority Evidence Evaluation State Interpretation Basis only.
 *
 * Exact canonical structured-value matching only.
 * NO_POLICY ≠ NO_MAPPING; BASIS_PRESENT ≠ canonical Authority State
 *
 * Must not import GROUND-111/110/109/108/020/019, persisted project state, Permission, OE.
 */

import { buildAuthorityEvidenceEvaluationStateValueCanonicalKey } from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue,
} from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicy,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-types.js";
import type { GovernanceScope } from "../types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasis,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisCandidateStatus,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisEvalInput,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisStatus,
} from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_NOT_MODELED",
    "FINAL_CANONICAL_AUTHORITY_STATE_VOCABULARY_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Authority Evidence Evaluation State set and Interpretation Policy set do not share the same observation Candidate context";

function governanceScopeCanonicalJson(scope: GovernanceScope): string {
  return JSON.stringify(scope);
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * authorityBindingKey|holderEntityId|authorityPower|governanceScopeKey|
 * evaluationInstantKey|authorityEvaluationAt|authorityEvidenceEvaluationStateKey|
 * authorityEvidenceEvaluationStateBasisKey|currentStructuredStateCanonicalKey|
 * interpretationPolicyKey|matchedMappingSourceCanonicalKey|interpretation
 */
export function attentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisKey(params: {
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
  authority_evidence_evaluation_state_value_canonical_key: string;
  authority_evidence_evaluation_state_interpretation_policy_key: string;
  matched_mapping_source_value_canonical_key: string;
  interpretation: string;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.authority_observation_context_binding_key,
    params.authority_holder_entity_id,
    params.authority_power,
    params.governance_scope_key,
    params.authority_evaluation_instant_key,
    params.authority_evaluation_at,
    params.authority_evidence_evaluation_state_key,
    params.authority_evidence_evaluation_state_basis_key,
    params.authority_evidence_evaluation_state_value_canonical_key,
    params.authority_evidence_evaluation_state_interpretation_policy_key,
    params.matched_mapping_source_value_canonical_key,
    params.interpretation,
  ].join("|");
}

/**
 * Exact canonical structured-value mapping lookup.
 * At most one semantically distinct interpretation per current value.
 */
export function findExactAuthorityEvidenceEvaluationStateInterpretationMapping(
  mappings: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[],
  currentValue: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping | null {
  const currentKey =
    buildAuthorityEvidenceEvaluationStateValueCanonicalKey(currentValue);
  let found: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    const sourceKey = buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
      mapping.authority_evidence_evaluation_state_value
    );
    if (sourceKey !== currentKey) {
      continue;
    }
    if (found !== null && found.interpretation !== mapping.interpretation) {
      throw new Error(
        `Authority Evidence Evaluation State Interpretation mapping multiplicity invariant violated for structured state ${currentKey}`
      );
    }
    if (found === null) {
      found = mapping;
    }
  }

  return found;
}

function indexBasesByKey(
  bases: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis[]
): Map<string, AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis> {
  const byKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis
  >();
  for (const basis of bases) {
    if (byKey.has(basis.key)) {
      throw new Error(
        `Authority Evidence Evaluation State Interpretation Basis invariant violated: duplicate Basis key ${basis.key}`
      );
    }
    byKey.set(basis.key, basis);
  }
  return byKey;
}

function indexPolicyBindingAssessmentsByKey(
  assessments: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment[]
): Map<
  string,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment
> {
  const byKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment
  >();
  for (const assessment of assessments) {
    const bindingKey = assessment.authority_observation_context_binding.key;
    if (byKey.has(bindingKey)) {
      throw new Error(
        `Authority Evidence Evaluation State Interpretation Basis invariant violated: duplicate policy binding assessment for ${bindingKey}`
      );
    }
    byKey.set(bindingKey, assessment);
  }
  return byKey;
}

function assertCurrentStateSelfConsistency(
  state: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment["authority_evidence_evaluation_states"][number],
  basis: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis
): void {
  if (state.authority_evidence_evaluation_state_basis_key !== basis.key) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: State/Basis key mismatch for State ${state.key}`
    );
  }

  const stateValueKey = buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
    state.value
  );
  const basisValueKey = buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
    basis.authority_evidence_evaluation_state_value
  );
  if (stateValueKey !== basisValueKey) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: forged State value for State ${state.key}`
    );
  }

  if (
    state.candidate_key !== basis.candidate_key ||
    state.observation_need_key !== basis.observation_need_key ||
    state.capability_requirement_set_key !==
      basis.capability_requirement_set_key ||
    state.authority_holder_entity_id !== basis.authority_holder_entity_id ||
    state.authority_power !== basis.authority_power ||
    state.governance_scope_key !== basis.governance_scope_key ||
    state.authority_evaluation_at !== basis.authority_evaluation_at
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: State/Basis context mismatch for State ${state.key}`
    );
  }
}

function assertBindingContextAlignment(
  basis: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis,
  policyBindingAssessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment
): void {
  const binding = policyBindingAssessment.authority_observation_context_binding;

  if (
    basis.authority_observation_context_binding_key !== binding.key ||
    basis.candidate_key !== binding.candidate_key ||
    basis.observation_need_key !== binding.observation_need_key ||
    basis.capability_requirement_set_key !==
      binding.capability_requirement_set_key ||
    basis.authority_holder_entity_id !== binding.authority_holder_entity_id ||
    basis.authority_power !== binding.authority_power ||
    basis.governance_scope_key !== binding.governance_scope_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: binding context mismatch for binding ${binding.key}`
    );
  }

  if (
    governanceScopeCanonicalJson(basis.governance_scope) !==
    governanceScopeCanonicalJson(binding.governance_scope)
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: GovernanceScope mismatch for binding ${binding.key}`
    );
  }
}

function assertPolicySelfConsistency(
  policy: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicy
): void {
  const seen = new Map<string, string>();
  for (const mapping of policy.mappings) {
    const sourceKey = buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
      mapping.authority_evidence_evaluation_state_value
    );
    const existing = seen.get(sourceKey);
    if (existing !== undefined && existing !== mapping.interpretation) {
      throw new Error(
        `Authority Evidence Evaluation State Interpretation Basis invariant violated: conflicting policy mappings for structured state ${sourceKey}`
      );
    }
    seen.set(sourceKey, mapping.interpretation);
  }
}

function assertPerStateAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment
): void {
  const expectedHas =
    assessment.authority_evidence_evaluation_state_interpretation_basis !==
    null;

  if (
    assessment.has_authority_evidence_evaluation_state_interpretation_basis !==
    expectedHas
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: has_basis mismatch for State ${assessment.authority_evidence_evaluation_state.key}`
    );
  }

  if (
    assessment.status ===
      "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    assessment.authority_evidence_evaluation_state_interpretation_basis ===
      null
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: PRESENT requires non-null Basis for State ${assessment.authority_evidence_evaluation_state.key}`
    );
  }

  if (
    assessment.status !==
      "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    assessment.authority_evidence_evaluation_state_interpretation_basis !==
      null
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: non-present status requires null Basis for State ${assessment.authority_evidence_evaluation_state.key}`
    );
  }
}

function buildInterpretationBasis(params: {
  state: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment["authority_evidence_evaluation_states"][number];
  basis: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis;
  policy: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicy;
  matchedMapping: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping;
}): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasis {
  const { state, basis, policy, matchedMapping } = params;
  const currentValueKey = buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
    state.value
  );
  const matchedSourceKey = buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
    matchedMapping.authority_evidence_evaluation_state_value
  );

  if (currentValueKey !== matchedSourceKey) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: matched mapping source ${matchedSourceKey} does not equal current structured state ${currentValueKey}`
    );
  }

  if (
    matchedMapping.interpretation !== "INTERPRET_AS_AUTHORITY_STATE_POSITIVE" &&
    matchedMapping.interpretation !== "INTERPRET_AS_AUTHORITY_STATE_NEGATIVE"
  ) {
    throw new Error(
      `Unknown Authority Evidence Evaluation State Interpretation: ${String(matchedMapping.interpretation)}`
    );
  }

  return {
    key: attentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisKey(
      {
        candidate_key: state.candidate_key,
        observation_need_key: state.observation_need_key,
        capability_requirement_set_key: state.capability_requirement_set_key,
        authority_observation_context_binding_key:
          basis.authority_observation_context_binding_key,
        authority_holder_entity_id: basis.authority_holder_entity_id,
        authority_power: basis.authority_power,
        governance_scope_key: basis.governance_scope_key,
        authority_evaluation_instant_key: basis.authority_evaluation_instant_key,
        authority_evaluation_at: basis.authority_evaluation_at,
        authority_evidence_evaluation_state_key: state.key,
        authority_evidence_evaluation_state_basis_key: basis.key,
        authority_evidence_evaluation_state_value_canonical_key: currentValueKey,
        authority_evidence_evaluation_state_interpretation_policy_key:
          policy.key,
        matched_mapping_source_value_canonical_key: matchedSourceKey,
        interpretation: matchedMapping.interpretation,
      }
    ),
    candidate_key: state.candidate_key,
    observation_need_key: state.observation_need_key,
    capability_requirement_set_key: state.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key:
      basis.authority_observation_context_binding_key,
    authority_holder_entity_id: basis.authority_holder_entity_id,
    authority_power: basis.authority_power,
    governance_scope: basis.governance_scope,
    governance_scope_key: basis.governance_scope_key,
    authority_evaluation_instant_key: basis.authority_evaluation_instant_key,
    authority_evaluation_at: basis.authority_evaluation_at,
    authority_evidence_evaluation_state_key: state.key,
    authority_evidence_evaluation_state_basis_key: basis.key,
    authority_evidence_evaluation_state_value: state.value,
    authority_evidence_evaluation_state_value_canonical_key: currentValueKey,
    authority_evidence_evaluation_state_interpretation_policy_key: policy.key,
    matched_mapping_source_value_canonical_key: matchedSourceKey,
    interpretation: matchedMapping.interpretation,
  };
}

function assessPerStateInterpretationBasis(
  state: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment["authority_evidence_evaluation_states"][number],
  basis: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis,
  policyBindingAssessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment {
  assertCurrentStateSelfConsistency(state, basis);
  assertBindingContextAlignment(basis, policyBindingAssessment);

  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisStatus,
    interpretationBasis: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasis | null
  ): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment => {
    const assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment =
      {
        authority_evidence_evaluation_state: state,
        authority_evidence_evaluation_state_interpretation_policy_binding_assessment:
          policyBindingAssessment,
        status,
        authority_evidence_evaluation_state_interpretation_basis:
          interpretationBasis,
        has_authority_evidence_evaluation_state_interpretation_basis:
          interpretationBasis !== null,
      };
    assertPerStateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    policyBindingAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (
      policyBindingAssessment.authority_evidence_evaluation_state_interpretation_policy !==
      null
    ) {
      throw new Error(
        `Authority Evidence Evaluation State Interpretation Basis invariant violated: NO_POLICY must not carry policy record for binding ${basis.authority_observation_context_binding_key}`
      );
    }
    return wrap(
      "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED",
      null
    );
  }

  if (
    policyBindingAssessment.status !==
      "EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    policyBindingAssessment.authority_evidence_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: unexpected policy binding status for binding ${basis.authority_observation_context_binding_key}`
    );
  }

  const policy =
    policyBindingAssessment.authority_evidence_evaluation_state_interpretation_policy;
  assertPolicySelfConsistency(policy);

  const matched = findExactAuthorityEvidenceEvaluationStateInterpretationMapping(
    policy.mappings,
    state.value
  );

  if (matched === null) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
      null
    );
  }

  return wrap(
    "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT",
    buildInterpretationBasis({ state, basis, policy, matchedMapping: matched })
  );
}

function isOuterStatus(status: string): boolean {
  return (
    status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    status === "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
    status === "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  );
}

function mapOuterStatusToBasisCandidateStatus(
  status: string
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisCandidateStatus {
  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED":
      return "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED";
    case "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED":
      return "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED";
    default:
      throw new Error(
        `Authority Evidence Evaluation State Interpretation Basis invariant violated: not an outer status ${status}`
      );
  }
}

function summarizePerStateAssessments(
  assessments: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment[]
): {
  has_authority_evidence_evaluation_state_interpretation_bases: boolean;
  has_states_without_explicit_authority_evidence_interpretation_policy: boolean;
  has_states_without_explicit_authority_evidence_interpretation_mapping: boolean;
} {
  let has_authority_evidence_evaluation_state_interpretation_bases = false;
  let has_states_without_explicit_authority_evidence_interpretation_policy =
    false;
  let has_states_without_explicit_authority_evidence_interpretation_mapping =
    false;

  for (const assessment of assessments) {
    if (assessment.has_authority_evidence_evaluation_state_interpretation_basis) {
      has_authority_evidence_evaluation_state_interpretation_bases = true;
    }
    if (
      assessment.status ===
      "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
    ) {
      has_states_without_explicit_authority_evidence_interpretation_policy =
        true;
    }
    if (
      assessment.status ===
      "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
    ) {
      has_states_without_explicit_authority_evidence_interpretation_mapping =
        true;
    }
  }

  return {
    has_authority_evidence_evaluation_state_interpretation_bases,
    has_states_without_explicit_authority_evidence_interpretation_policy,
    has_states_without_explicit_authority_evidence_interpretation_mapping,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment
): void {
  const stateCount =
    assessment.authority_evidence_evaluation_state_assessment
      .authority_evidence_evaluation_states.length;
  const summary = summarizePerStateAssessments(
    assessment.interpretation_basis_assessments
  );

  if (
    assessment.has_authority_evidence_evaluation_state_interpretation_bases !==
    summary.has_authority_evidence_evaluation_state_interpretation_bases
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: has_bases summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.has_states_without_explicit_authority_evidence_interpretation_policy !==
    summary.has_states_without_explicit_authority_evidence_interpretation_policy
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: has_without_policy summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.has_states_without_explicit_authority_evidence_interpretation_mapping !==
    summary.has_states_without_explicit_authority_evidence_interpretation_mapping
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: has_without_mapping summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
    "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_ASSESSMENTS_PRESENT"
  ) {
    if (assessment.interpretation_basis_assessments.length !== stateCount) {
      throw new Error(
        `Authority Evidence Evaluation State Interpretation Basis cardinality invariant violated for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (assessment.interpretation_basis_assessments.length !== 0) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: non-present candidate status requires empty per-State assessments for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Candidate/context counterpart invariant for GROUND-113 × GROUND-114 join.
 */
export function assertCompatibleAuthorityEvidenceEvaluationStateInterpretationBasisContexts(
  evaluationStateSet: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSetAssessment,
  interpretationPolicySet: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySetAssessment
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

    const evalOuter = isOuterStatus(evalCandidate.status);
    const policyOuter = isOuterStatus(policyCandidate.status);

    if (evalOuter && policyOuter) {
      if (
        mapOuterStatusToBasisCandidateStatus(evalCandidate.status) !==
        mapOuterStatusToBasisCandidateStatus(policyCandidate.status)
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: outer-status mismatch for candidate ${evalCandidate.candidate_key}`
        );
      }
      continue;
    }

    if (
      evalCandidate.status ===
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED" &&
      policyCandidate.status ===
        "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_BINDING_ASSESSMENTS_PRESENT"
    ) {
      continue;
    }

    if (evalOuter !== policyOuter) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: outer/applicable domain contradiction for candidate ${evalCandidate.candidate_key}`
      );
    }

    if (
      evalCandidate.status !== "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT" ||
      policyCandidate.status !==
        "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_BINDING_ASSESSMENTS_PRESENT"
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: applicable domain status mismatch for candidate ${evalCandidate.candidate_key}`
      );
    }
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
 * Pure Candidate-level Authority Evidence Evaluation State Interpretation Basis.
 *
 * Precedence per current State:
 * 1. outer NOT_APPLICABLE / no bindings / no instant
 * 2. require current GROUND-113 State
 * 3. 114 policy absent for binding → NO_POLICY
 * 4. policy present + no exact mapping → NO_MAPPING
 * 5. exact mapping → BASIS_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasis(
  evaluationStateAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment,
  interpretationPolicyAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment {
  const candidate_key = evaluationStateAssessment.candidate_key;

  if (candidate_key !== interpretationPolicyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch for ${candidate_key}`
    );
  }

  const empty = (
    status: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisCandidateStatus
  ) => {
    const assessment = {
      candidate_key,
      authority_evidence_evaluation_state_assessment:
        evaluationStateAssessment,
      authority_evidence_evaluation_state_interpretation_policy_assessment:
        interpretationPolicyAssessment,
      status,
      interpretation_basis_assessments: [],
      has_authority_evidence_evaluation_state_interpretation_bases: false,
      has_states_without_explicit_authority_evidence_interpretation_policy:
        false,
      has_states_without_explicit_authority_evidence_interpretation_mapping:
        false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
      ],
    };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    interpretationPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return empty("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    interpretationPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return empty("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    evaluationStateAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
    interpretationPolicyAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED");
  }

  if (
    evaluationStateAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED");
  }

  if (
    evaluationStateAssessment.status !==
      "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT" ||
    interpretationPolicyAssessment.status !==
      "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_BINDING_ASSESSMENTS_PRESENT"
  ) {
    throw new Error(
      `Authority Evidence Evaluation State Interpretation Basis invariant violated: applicable domain requires current States and policy binding assessments for candidate ${candidate_key}`
    );
  }

  const basisByKey = indexBasesByKey(
    evaluationStateAssessment.authority_evidence_evaluation_state_bases
  );
  const policyBindingByKey = indexPolicyBindingAssessmentsByKey(
    interpretationPolicyAssessment.binding_policy_assessments
  );

  const interpretation_basis_assessments =
    evaluationStateAssessment.authority_evidence_evaluation_states.map(
      (state) => {
        const basis = basisByKey.get(
          state.authority_evidence_evaluation_state_basis_key
        );
        if (!basis) {
          throw new Error(
            `Authority Evidence Evaluation State Interpretation Basis invariant violated: missing Basis for State ${state.key}`
          );
        }

        const policyBindingAssessment = policyBindingByKey.get(
          basis.authority_observation_context_binding_key
        );
        if (!policyBindingAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Interpretation Policy binding assessment for binding ${basis.authority_observation_context_binding_key}`
          );
        }

        return assessPerStateInterpretationBasis(
          state,
          basis,
          policyBindingAssessment
        );
      }
    );

  const summary = summarizePerStateAssessments(interpretation_basis_assessments);
  const assessment = {
    candidate_key,
    authority_evidence_evaluation_state_assessment: evaluationStateAssessment,
    authority_evidence_evaluation_state_interpretation_policy_assessment:
      interpretationPolicyAssessment,
    status:
      "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_ASSESSMENTS_PRESENT" as const,
    interpretation_basis_assessments,
    ...summary,
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

export function buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet(
  input: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisEvalInput
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSetAssessment {
  assertCompatibleAuthorityEvidenceEvaluationStateInterpretationBasisContexts(
    input.authority_evidence_evaluation_state_set,
    input.authority_evidence_evaluation_state_interpretation_policy_set
  );

  const policyByKey = new Map(
    input.authority_evidence_evaluation_state_interpretation_policy_set.candidate_assessments.map(
      (candidate) => [candidate.candidate_key, candidate]
    )
  );

  const candidate_assessments =
    input.authority_evidence_evaluation_state_set.candidate_assessments.map(
      (evaluationStateAssessment) => {
        const interpretationPolicyAssessment = policyByKey.get(
          evaluationStateAssessment.candidate_key
        );
        if (!interpretationPolicyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Interpretation Policy counterpart for candidate ${evaluationStateAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasis(
          evaluationStateAssessment,
          interpretationPolicyAssessment
        );
      }
    );

  const has_authority_evidence_evaluation_state_interpretation_bases =
    candidate_assessments.some(
      (candidate) =>
        candidate.has_authority_evidence_evaluation_state_interpretation_bases
    );
  const has_states_without_explicit_authority_evidence_interpretation_policy =
    candidate_assessments.some(
      (candidate) =>
        candidate.has_states_without_explicit_authority_evidence_interpretation_policy
    );
  const has_states_without_explicit_authority_evidence_interpretation_mapping =
    candidate_assessments.some(
      (candidate) =>
        candidate.has_states_without_explicit_authority_evidence_interpretation_mapping
    );

  return {
    authority_evidence_evaluation_state_set:
      input.authority_evidence_evaluation_state_set,
    authority_evidence_evaluation_state_interpretation_policy_set:
      input.authority_evidence_evaluation_state_interpretation_policy_set,
    candidate_assessments,
    has_authority_evidence_evaluation_state_interpretation_bases,
    has_states_without_explicit_authority_evidence_interpretation_policy,
    has_states_without_explicit_authority_evidence_interpretation_mapping,
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
