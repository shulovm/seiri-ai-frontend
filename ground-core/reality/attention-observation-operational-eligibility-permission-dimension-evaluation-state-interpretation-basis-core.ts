/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Dimension Evaluation State Interpretation Basis core (GROUND-105).
 *
 * GROUND-103 current Permission Dimension Evaluation State
 * + GROUND-104 Explicit Permission Dimension Evaluation State Interpretation Policy
 * → Permission Dimension Evaluation State Interpretation Basis only.
 *
 * Exact current-state token lookup only.
 * NO_POLICY ≠ NO_MAPPING
 * explicit empty policy → NO_MAPPING
 * Interpretation Basis ≠ Satisfaction State
 *
 * Must not import GROUND-084-direct / 093–101 / ProjectState.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSetAssessment,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasis,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisInput,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisModelLimitation,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSetAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Permission Dimension Evaluation State set and Interpretation Policy set do not share the same observation Candidate context";

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|PERMISSION|
 * permissionDimensionEvaluationStateKey|permissionDimensionEvaluationStateBasisKey|
 * permissionDimensionEvaluationState|interpretationPolicyKey|interpretation
 */
export function attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_dimension_evaluation_state_key: string;
  permission_dimension_evaluation_state_basis_key: string;
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState;
  permission_dimension_evaluation_state_interpretation_policy_key: string;
  interpretation: string;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "PERMISSION",
    params.permission_dimension_evaluation_state_key,
    params.permission_dimension_evaluation_state_basis_key,
    params.permission_dimension_evaluation_state,
    params.permission_dimension_evaluation_state_interpretation_policy_key,
    params.interpretation,
  ].join("|");
}

/**
 * Exact current-state mapping lookup.
 * At most one mapping per Evaluation State (104 invariant); multiplicity rejects.
 * No fuzzy / wildcard / hierarchy matching.
 */
export function findExactPermissionDimensionEvaluationStateInterpretationMapping(
  mappings: readonly AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[],
  currentState: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping | null {
  let found: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    if (mapping.permission_dimension_evaluation_state === currentState) {
      if (found !== null) {
        throw new Error(
          `Permission Dimension Evaluation State Interpretation mapping multiplicity invariant violated for evaluation state ${currentState}`
        );
      }
      found = mapping;
    }
  }

  return found;
}

/**
 * Candidate/context counterpart invariant for 103 × 104 join.
 * Missing/extra counterparts reject — do not reinterpret as policy absence.
 */
export function assertCompatibleOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisContexts(
  evaluationStateSet: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSetAssessment,
  interpretationPolicySet: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySetAssessment
): void {
  const evalCandidates = evaluationStateSet.candidate_assessments;
  const policyCandidates = interpretationPolicySet.candidate_assessments;

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

    // Both applicable: validate context lineage when available.
    const evalState = evalCandidate.permission_dimension_evaluation_state;
    const evalBasis = evalCandidate.permission_dimension_evaluation_state_basis;
    const policy =
      policyCandidate.permission_dimension_evaluation_state_interpretation_policy;

    if (evalState !== null && policy !== null) {
      if (
        evalState.observation_need_key !== policy.observation_need_key ||
        evalState.capability_requirement_set_key !==
          policy.capability_requirement_set_key
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: Need/Requirement-set mismatch for candidate ${evalCandidate.candidate_key}`
        );
      }
      if (evalBasis !== null) {
        if (
          evalBasis.observation_need_key !== policy.observation_need_key ||
          evalBasis.capability_requirement_set_key !==
            policy.capability_requirement_set_key
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: Evaluation State Basis context mismatch for candidate ${evalCandidate.candidate_key}`
          );
        }
      }
      const oePolicy =
        policyCandidate.operational_eligibility_dimension_policy_assessment
          .operational_eligibility_dimension_policy;
      if (
        oePolicy !== null &&
        oePolicy.key !== policy.operational_eligibility_dimension_policy_key
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: 084 policy key mismatch for candidate ${evalCandidate.candidate_key}`
        );
      }
    }

    if (
      evalCandidate.status === "PERMISSION_DIMENSION_EVALUATION_STATE_PRESENT" &&
      policyCandidate.status ===
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Evaluation State PRESENT contradicts PERMISSION not required for candidate ${evalCandidate.candidate_key}`
      );
    }

    if (
      evalCandidate.status ===
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" &&
      (policyCandidate.status ===
        "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
        policyCandidate.status ===
          "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED")
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: PERMISSION not required contradicts Interpretation Policy domain for candidate ${evalCandidate.candidate_key}`
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
    status === "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  );
}

function normalizeOuterStatus(
  status: string
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus {
  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED":
      return "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED";
    case "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY":
      return "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY";
    default:
      throw new Error(
        `Permission Dimension Evaluation State Interpretation Basis invariant violated: not an outer status ${status}`
      );
  }
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment
): void {
  const expectedHas =
    assessment.permission_dimension_evaluation_state_interpretation_basis !==
    null;
  if (
    assessment.has_permission_dimension_evaluation_state_interpretation_basis !==
    expectedHas
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Basis invariant violated: has_basis mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    assessment.permission_dimension_evaluation_state_interpretation_basis ===
      null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Basis invariant violated: PRESENT requires non-null Basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    assessment.permission_dimension_evaluation_state_interpretation_basis !==
      null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Basis invariant violated: non-present status requires null Basis for candidate ${assessment.candidate_key}`
    );
  }
}

function buildInterpretationBasis(
  stateAssessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment,
  policy: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy,
  matchedMapping: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasis {
  const stateRecord = stateAssessment.permission_dimension_evaluation_state;
  const stateBasis = stateAssessment.permission_dimension_evaluation_state_basis;
  if (stateRecord === null || stateBasis === null) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Basis invariant violated: exact mapping requires current Evaluation State for candidate ${stateAssessment.candidate_key}`
    );
  }

  const currentState = stateRecord.permission_dimension_evaluation_state;
  if (matchedMapping.permission_dimension_evaluation_state !== currentState) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Basis invariant violated: matched mapping state ${matchedMapping.permission_dimension_evaluation_state} does not equal current state ${currentState}`
    );
  }

  if (
    stateBasis.permission_dimension_evaluation_state !== currentState ||
    stateRecord.permission_dimension_evaluation_state_basis_key !==
      stateBasis.key
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Basis invariant violated: Evaluation State/Basis lineage mismatch for candidate ${stateAssessment.candidate_key}`
    );
  }

  const interpretation = matchedMapping.interpretation;
  if (
    interpretation !== "INTERPRET_AS_PERMISSION_DIMENSION_SATISFIED" &&
    interpretation !== "INTERPRET_AS_PERMISSION_DIMENSION_UNSATISFIED"
  ) {
    throw new Error(
      `Unknown Permission Dimension Evaluation State Interpretation: ${String(interpretation)}`
    );
  }

  return {
    key: attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisKey(
      {
        candidate_key: stateRecord.candidate_key,
        observation_need_key: stateRecord.observation_need_key,
        capability_requirement_set_key:
          stateRecord.capability_requirement_set_key,
        permission_dimension_evaluation_state_key: stateRecord.key,
        permission_dimension_evaluation_state_basis_key: stateBasis.key,
        permission_dimension_evaluation_state: currentState,
        permission_dimension_evaluation_state_interpretation_policy_key:
          policy.key,
        interpretation,
      }
    ),
    candidate_key: stateRecord.candidate_key,
    observation_need_key: stateRecord.observation_need_key,
    capability_requirement_set_key: stateRecord.capability_requirement_set_key,
    dimension: "PERMISSION",
    permission_dimension_evaluation_state_key: stateRecord.key,
    permission_dimension_evaluation_state_basis_key: stateBasis.key,
    permission_dimension_evaluation_state: currentState,
    permission_dimension_evaluation_state_interpretation_policy_key: policy.key,
    interpretation,
  };
}

/**
 * Pure Candidate-level Permission Dimension Evaluation State Interpretation Basis.
 *
 * Precedence:
 * 1. outer NOT_APPLICABLE / no OE / not required
 * 2. require current 103 Evaluation State
 * 3. 104 policy absent → NO_POLICY
 * 4. policy present + no exact mapping → NO_MAPPING
 * 5. exact mapping → BASIS_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasis(
  evaluationStateAssessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment,
  interpretationPolicyAssessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment {
  const candidate_key = evaluationStateAssessment.candidate_key;

  if (candidate_key !== interpretationPolicyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch for ${candidate_key}`
    );
  }

  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus,
    basis: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasis | null
  ): AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment =
      {
        candidate_key,
        permission_dimension_evaluation_state_assessment:
          evaluationStateAssessment,
        permission_dimension_evaluation_state_interpretation_policy_assessment:
          interpretationPolicyAssessment,
        status,
        permission_dimension_evaluation_state_interpretation_basis: basis,
        has_permission_dimension_evaluation_state_interpretation_basis:
          basis !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
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
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" ||
    interpretationPolicyAssessment.status ===
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  if (
    evaluationStateAssessment.status !==
      "PERMISSION_DIMENSION_EVALUATION_STATE_PRESENT" ||
    evaluationStateAssessment.permission_dimension_evaluation_state === null ||
    evaluationStateAssessment.permission_dimension_evaluation_state_basis ===
      null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Basis invariant violated: applicable domain requires current Evaluation State for candidate ${candidate_key}`
    );
  }

  if (
    interpretationPolicyAssessment.status ===
    "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (
      interpretationPolicyAssessment.permission_dimension_evaluation_state_interpretation_policy !==
      null
    ) {
      throw new Error(
        `Permission Dimension Evaluation State Interpretation Basis invariant violated: NO_POLICY must not carry policy record for candidate ${candidate_key}`
      );
    }
    return wrap(
      "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED",
      null
    );
  }

  if (
    interpretationPolicyAssessment.status !==
      "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    interpretationPolicyAssessment.permission_dimension_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Basis invariant violated: unexpected Interpretation Policy status for candidate ${candidate_key}`
    );
  }

  const policy =
    interpretationPolicyAssessment.permission_dimension_evaluation_state_interpretation_policy;
  const currentState =
    evaluationStateAssessment.permission_dimension_evaluation_state
      .permission_dimension_evaluation_state;
  const matched = findExactPermissionDimensionEvaluationStateInterpretationMapping(
    policy.mappings,
    currentState
  );

  if (matched === null) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
      null
    );
  }

  return wrap(
    "PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT",
    buildInterpretationBasis(evaluationStateAssessment, policy, matched)
  );
}

export function buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSet(
  input: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisInput
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisSetAssessment {
  assertCompatibleOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisContexts(
    input.permission_dimension_evaluation_state_set,
    input.permission_dimension_evaluation_state_interpretation_policy_set
  );

  const policyByKey = new Map(
    input.permission_dimension_evaluation_state_interpretation_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.permission_dimension_evaluation_state_set.candidate_assessments.map(
      (evaluationStateAssessment) => {
        const interpretationPolicyAssessment = policyByKey.get(
          evaluationStateAssessment.candidate_key
        );
        if (!interpretationPolicyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Interpretation Policy counterpart for candidate ${evaluationStateAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasis(
          evaluationStateAssessment,
          interpretationPolicyAssessment
        );
      }
    );

  return {
    permission_dimension_evaluation_state_set:
      input.permission_dimension_evaluation_state_set,
    permission_dimension_evaluation_state_interpretation_policy_set:
      input.permission_dimension_evaluation_state_interpretation_policy_set,
    candidate_assessments,
    has_permission_dimension_evaluation_state_interpretation_bases:
      candidate_assessments.some(
        (a) => a.has_permission_dimension_evaluation_state_interpretation_basis
      ),
    has_permission_dimension_interpretations_as_satisfied:
      candidate_assessments.some(
        (a) =>
          a.permission_dimension_evaluation_state_interpretation_basis
            ?.interpretation ===
          "INTERPRET_AS_PERMISSION_DIMENSION_SATISFIED"
      ),
    has_permission_dimension_interpretations_as_unsatisfied:
      candidate_assessments.some(
        (a) =>
          a.permission_dimension_evaluation_state_interpretation_basis
            ?.interpretation ===
          "INTERPRET_AS_PERMISSION_DIMENSION_UNSATISFIED"
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
