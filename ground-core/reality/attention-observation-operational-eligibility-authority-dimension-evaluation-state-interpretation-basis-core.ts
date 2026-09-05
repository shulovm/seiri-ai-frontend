/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Dimension Evaluation State Interpretation Basis core (GROUND-129).
 *
 * GROUND-127 current AUTHORITY Dimension Evaluation State
 * + GROUND-128 Explicit AUTHORITY Dimension Evaluation State Interpretation Policy
 * → AUTHORITY Dimension Evaluation State Interpretation Basis only.
 *
 * Exact current-state token lookup only.
 * NO_POLICY ≠ NO_MAPPING
 * explicit empty policy → NO_MAPPING
 * Interpretation Basis ≠ Satisfaction State
 *
 * Must not import GROUND-125-direct / 118–126 / 084-direct / ProjectState.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasis,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisInput,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "AUTHORITY Dimension Evaluation State set and Interpretation Policy set do not share the same observation Candidate context";

/**
 * Deterministic matched-mapping identity for one explicit source-State mapping.
 */
export function attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMappingKey(params: {
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation;
}): string {
  return `${params.authority_dimension_evaluation_state}|${params.interpretation}`;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * authorityDimensionEvaluationStateKey|authorityDimensionEvaluationStateBasisKey|
 * currentEvaluationStateValue|interpretationPolicyKey|matchedMappingKey|interpretation
 */
export function attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  authority_dimension_evaluation_state_key: string;
  authority_dimension_evaluation_state_basis_key: string;
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  authority_dimension_evaluation_state_interpretation_policy_key: string;
  matched_interpretation_mapping_key: string;
  interpretation: string;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.authority_dimension_evaluation_state_key,
    params.authority_dimension_evaluation_state_basis_key,
    params.authority_dimension_evaluation_state,
    params.authority_dimension_evaluation_state_interpretation_policy_key,
    params.matched_interpretation_mapping_key,
    params.interpretation,
  ].join("|");
}

/**
 * Exact current-state mapping lookup.
 * At most one mapping per Evaluation State (128 invariant); multiplicity rejects.
 * No fuzzy / wildcard / hierarchy matching.
 */
export function findExactAuthorityDimensionEvaluationStateInterpretationMapping(
  mappings: readonly AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[],
  currentState: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping | null {
  let found: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    if (mapping.authority_dimension_evaluation_state === currentState) {
      if (found !== null) {
        throw new Error(
          `AUTHORITY Dimension Evaluation State Interpretation mapping multiplicity invariant violated for evaluation state ${currentState}`
        );
      }
      found = mapping;
    }
  }

  return found;
}

function resolveOperationalEligibilityDimensionPolicyKeyFrom127(
  evaluationStateAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment
): string | null {
  const aggregationResultAssessment =
    evaluationStateAssessment.authority_source_aggregation_result_assessment;
  const result =
    aggregationResultAssessment.authority_source_aggregation_result;
  if (result !== null) {
    return result.operational_eligibility_dimension_policy_key;
  }

  const readinessBasis =
    aggregationResultAssessment.authority_source_aggregation_readiness_basis_assessment
      .authority_source_aggregation_readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.operational_eligibility_dimension_policy_key;
  }

  const aggregationPolicy =
    aggregationResultAssessment.authority_source_aggregation_policy_assessment
      .authority_source_aggregation_policy;
  if (aggregationPolicy !== null) {
    return aggregationPolicy.operational_eligibility_dimension_policy_key;
  }

  const oePolicy =
    aggregationResultAssessment.authority_source_aggregation_policy_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy ??
    aggregationResultAssessment.authority_source_acceptance_match_assessment
      .authority_source_acceptance_criteria_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy;

  return oePolicy?.key ?? null;
}

/**
 * Candidate/context counterpart invariant for 127 × 128 join.
 * Missing/extra counterparts reject — do not reinterpret as policy absence.
 */
export function assertCompatibleOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisContexts(
  evaluationStateSet: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment,
  interpretationPolicySet: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySetAssessment
): void {
  const evalCandidates = evaluationStateSet.candidate_assessments;
  const policyCandidates =
    interpretationPolicySet.candidate_assessments;

  if (evalCandidates.length !== policyCandidates.length) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const policyByKey = new Map(
    policyCandidates.map((c) => [c.candidate_key, c])
  );
  const evalByKey = new Map(evalCandidates.map((c) => [c.candidate_key, c]));

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

    const evalOuter = isOuterStatus(evalCandidate.status);
    const policyOuter = isOuterStatus(policyCandidate.status);

    if (evalOuter && policyOuter) {
      if (
        normalizeOuterStatus(evalCandidate.status) !==
        normalizeOuterStatus(policyCandidate.status)
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: outer-status mismatch for candidate ${evalCandidate.candidate_key}`
        );
      }
      continue;
    }

    if (evalOuter !== policyOuter) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: outer/applicable domain contradiction for candidate ${evalCandidate.candidate_key}`
      );
    }

    const evalState = evalCandidate.authority_dimension_evaluation_state;
    const evalBasis = evalCandidate.authority_dimension_evaluation_state_basis;
    const policy =
      policyCandidate.authority_dimension_evaluation_state_interpretation_policy;

    if (evalState !== null && policy !== null) {
      if (
        evalState.observation_need_key !== policy.observation_need_key ||
        evalState.capability_requirement_set_key !==
          policy.capability_requirement_set_key ||
        evalState.dimension !== policy.dimension
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: Need/Requirement-set/dimension mismatch for candidate ${evalCandidate.candidate_key}`
        );
      }
      if (evalBasis !== null) {
        if (
          evalBasis.observation_need_key !== policy.observation_need_key ||
          evalBasis.capability_requirement_set_key !==
            policy.capability_requirement_set_key ||
          evalBasis.dimension !== policy.dimension
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: Evaluation State Basis context mismatch for candidate ${evalCandidate.candidate_key}`
          );
        }
      }
      const oePolicyKey =
        resolveOperationalEligibilityDimensionPolicyKeyFrom127(evalCandidate);
      if (
        oePolicyKey !== null &&
        oePolicyKey !== policy.operational_eligibility_dimension_policy_key
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: Operational Eligibility Dimension Policy key mismatch for candidate ${evalCandidate.candidate_key}`
        );
      }
    }

    if (
      evalCandidate.status === "AUTHORITY_DIMENSION_EVALUATION_STATE_PRESENT" &&
      policyCandidate.status ===
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Evaluation State PRESENT contradicts AUTHORITY not required for candidate ${evalCandidate.candidate_key}`
      );
    }

    if (
      evalCandidate.status ===
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" &&
      (policyCandidate.status ===
        "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
        policyCandidate.status ===
          "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED")
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AUTHORITY not required contradicts Interpretation Policy domain for candidate ${evalCandidate.candidate_key}`
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

function isOuterStatus(status: string): boolean {
  return (
    status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    status === "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    status === "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  );
}

function normalizeOuterStatus(
  status: string
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus {
  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED":
      return "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED";
    case "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY":
      return "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY";
    default:
      throw new Error(
        `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: not an outer status ${status}`
      );
  }
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment
): void {
  const expectedHas =
    assessment.authority_dimension_evaluation_state_interpretation_basis !==
    null;
  if (
    assessment.has_authority_dimension_evaluation_state_interpretation_basis !==
    expectedHas
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: has_basis mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    assessment.authority_dimension_evaluation_state_interpretation_basis ===
      null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: PRESENT requires non-null Basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    assessment.authority_dimension_evaluation_state_interpretation_basis !==
      null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: non-present status requires null Basis for candidate ${assessment.candidate_key}`
    );
  }
}

function buildInterpretationBasis(
  stateAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment,
  policy: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy,
  matchedMapping: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasis {
  const stateRecord = stateAssessment.authority_dimension_evaluation_state;
  const stateBasis = stateAssessment.authority_dimension_evaluation_state_basis;
  if (stateRecord === null || stateBasis === null) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: exact mapping requires current Evaluation State for candidate ${stateAssessment.candidate_key}`
    );
  }

  const currentState = stateRecord.authority_dimension_evaluation_state;
  if (matchedMapping.authority_dimension_evaluation_state !== currentState) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: matched mapping state ${matchedMapping.authority_dimension_evaluation_state} does not equal current state ${currentState}`
    );
  }

  if (
    stateBasis.authority_dimension_evaluation_state !== currentState ||
    stateRecord.authority_dimension_evaluation_state_basis_key !==
      stateBasis.key
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: Evaluation State/Basis lineage mismatch for candidate ${stateAssessment.candidate_key}`
    );
  }

  const interpretation = matchedMapping.interpretation;
  if (
    interpretation !== "INTERPRET_AS_AUTHORITY_DIMENSION_SATISFIED" &&
    interpretation !== "INTERPRET_AS_AUTHORITY_DIMENSION_UNSATISFIED"
  ) {
    throw new Error(
      `Unknown AUTHORITY Dimension Evaluation State Interpretation: ${String(interpretation)}`
    );
  }

  const matchedMappingKey =
    attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMappingKey(
      {
        authority_dimension_evaluation_state: currentState,
        interpretation,
      }
    );

  return {
    key: attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisKey(
      {
        candidate_key: stateRecord.candidate_key,
        observation_need_key: stateRecord.observation_need_key,
        capability_requirement_set_key:
          stateRecord.capability_requirement_set_key,
        authority_dimension_evaluation_state_key: stateRecord.key,
        authority_dimension_evaluation_state_basis_key: stateBasis.key,
        authority_dimension_evaluation_state: currentState,
        authority_dimension_evaluation_state_interpretation_policy_key:
          policy.key,
        matched_interpretation_mapping_key: matchedMappingKey,
        interpretation,
      }
    ),
    candidate_key: stateRecord.candidate_key,
    observation_need_key: stateRecord.observation_need_key,
    capability_requirement_set_key: stateRecord.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_dimension_evaluation_state_key: stateRecord.key,
    authority_dimension_evaluation_state_basis_key: stateBasis.key,
    authority_dimension_evaluation_state: currentState,
    authority_dimension_evaluation_state_interpretation_policy_key: policy.key,
    matched_interpretation_mapping_key: matchedMappingKey,
    interpretation,
  };
}

/**
 * Pure Candidate-level AUTHORITY Dimension Evaluation State Interpretation Basis.
 *
 * Precedence:
 * 1. outer NOT_APPLICABLE / no OE / not required
 * 2. require current 127 Evaluation State
 * 3. 128 policy absent → NO_POLICY
 * 4. policy present + no exact mapping → NO_MAPPING
 * 5. exact mapping → BASIS_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasis(
  evaluationStateAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment,
  interpretationPolicyAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment {
  const candidate_key = evaluationStateAssessment.candidate_key;

  if (candidate_key !== interpretationPolicyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch for ${candidate_key}`
    );
  }

  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus,
    basis: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasis | null
  ): AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment =
      {
        candidate_key,
        authority_dimension_evaluation_state_assessment:
          evaluationStateAssessment,
        authority_dimension_evaluation_state_interpretation_policy_assessment:
          interpretationPolicyAssessment,
        status,
        authority_dimension_evaluation_state_interpretation_basis: basis,
        has_authority_dimension_evaluation_state_interpretation_basis:
          basis !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
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
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    interpretationPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    evaluationStateAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    interpretationPolicyAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      null
    );
  }

  if (
    evaluationStateAssessment.status ===
      "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" ||
    interpretationPolicyAssessment.status ===
      "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  if (
    evaluationStateAssessment.status !==
      "AUTHORITY_DIMENSION_EVALUATION_STATE_PRESENT" ||
    evaluationStateAssessment.authority_dimension_evaluation_state === null ||
    evaluationStateAssessment.authority_dimension_evaluation_state_basis ===
      null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: applicable domain requires current Evaluation State for candidate ${candidate_key}`
    );
  }

  if (
    interpretationPolicyAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (
      interpretationPolicyAssessment.authority_dimension_evaluation_state_interpretation_policy !==
      null
    ) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: NO_POLICY must not carry policy record for candidate ${candidate_key}`
      );
    }
    return wrap(
      "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED",
      null
    );
  }

  if (
    interpretationPolicyAssessment.status !==
      "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    interpretationPolicyAssessment.authority_dimension_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Basis invariant violated: unexpected Interpretation Policy status for candidate ${candidate_key}`
    );
  }

  const policy =
    interpretationPolicyAssessment.authority_dimension_evaluation_state_interpretation_policy;
  const currentState =
    evaluationStateAssessment.authority_dimension_evaluation_state
      .authority_dimension_evaluation_state;
  const matched = findExactAuthorityDimensionEvaluationStateInterpretationMapping(
    policy.mappings,
    currentState
  );

  if (matched === null) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
      null
    );
  }

  return wrap(
    "AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT",
    buildInterpretationBasis(evaluationStateAssessment, policy, matched)
  );
}

export function buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSet(
  input: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisInput
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisSetAssessment {
  assertCompatibleOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisContexts(
    input.authority_dimension_evaluation_state_set,
    input.authority_dimension_evaluation_state_interpretation_policy_set
  );

  const policyByKey = new Map(
    input.authority_dimension_evaluation_state_interpretation_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.authority_dimension_evaluation_state_set.candidate_assessments.map(
      (evaluationStateAssessment) => {
        const interpretationPolicyAssessment = policyByKey.get(
          evaluationStateAssessment.candidate_key
        );
        if (!interpretationPolicyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Interpretation Policy counterpart for candidate ${evaluationStateAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasis(
          evaluationStateAssessment,
          interpretationPolicyAssessment
        );
      }
    );

  return {
    authority_dimension_evaluation_state_set:
      input.authority_dimension_evaluation_state_set,
    authority_dimension_evaluation_state_interpretation_policy_set:
      input.authority_dimension_evaluation_state_interpretation_policy_set,
    candidate_assessments,
    has_authority_dimension_evaluation_state_interpretation_bases:
      candidate_assessments.some(
        (a) => a.has_authority_dimension_evaluation_state_interpretation_basis
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
