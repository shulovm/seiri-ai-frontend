/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Satisfaction
 * Interpretation Basis (GROUND-074).
 *
 * Pure composition of:
 *   GROUND-072 Current Capability Requirement Evaluation State
 *   GROUND-073 Explicit Satisfaction Interpretation Policy
 *
 * Answers only whether the exact current Requirement Evaluation State has an
 * exact explicitly declared Satisfaction Interpretation mapping.
 *
 * Must not import GROUND-048–071 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * Interpretation Basis ≠ Satisfaction State
 * INTERPRET_AS_SATISFIED ≠ current SATISFIED
 * INTERPRET_AS_UNSATISFIED ≠ current UNSATISFIED
 * policy absent ≠ policy present but no mapping
 * no mapping ≠ INTERPRET_AS_UNSATISFIED
 * no default HOLDS→SATISFIED / DOES_NOT_HOLD→UNSATISFIED
 */

import type {
  AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment,
  AttentionObservationCapabilityRequirementEvaluationAssessment,
  AttentionObservationCapabilityRequirementEvaluationState,
  AttentionObservationCapabilityRequirementEvaluationStateSetAssessment,
} from "./attention-observation-capability-requirement-evaluation-state-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretation,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicy,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySetAssessment,
} from "./attention-observation-capability-requirement-satisfaction-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationBasis,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationCandidateStatus,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationInput,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationModelLimitation,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationSetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationStatus,
} from "./attention-observation-capability-requirement-satisfaction-interpretation-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementSatisfactionInterpretationModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_SATISFACTION_STATE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFIED_STATE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNSATISFIED_STATE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_NO_INTERPRETATION_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_INTERPRETATION_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_INTERPRETATION_WILDCARD_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_INTERPRETATION_GROUPING_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_INTERPRETATION_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_INTERPRETATION_PROVENANCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_INTERPRETATION_AUTHORITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_EFFECTIVE_STATE_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Capability Requirement Evaluation State set and Satisfaction Interpretation Policy set do not share the same Capability Requirement context";

export function attentionObservationCapabilityRequirementSatisfactionInterpretationBasisKey(
  capabilityRequirementKey: string,
  requirementEvaluationStateBasisKey: string,
  satisfactionInterpretationPolicyKey: string,
  evaluationState: AttentionObservationCapabilityRequirementEvaluationState,
  interpretation: AttentionObservationCapabilityRequirementSatisfactionInterpretation
): string {
  return [
    "attention-observation-capability-requirement-satisfaction-interpretation-basis",
    capabilityRequirementKey,
    requirementEvaluationStateBasisKey,
    satisfactionInterpretationPolicyKey,
    evaluationState,
    interpretation,
  ].join("|");
}

/**
 * Exact current-state mapping lookup.
 * At most one mapping per Evaluation State (073 invariant); multiplicity rejects.
 * No fuzzy / wildcard / hierarchy matching.
 */
export function findExactSatisfactionInterpretationMapping(
  mappings: readonly AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[],
  currentState: AttentionObservationCapabilityRequirementEvaluationState
): AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping | null {
  let found: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    if (mapping.evaluation_state === currentState) {
      if (found !== null) {
        throw new Error(
          `Satisfaction Interpretation mapping multiplicity invariant violated for evaluation state ${currentState}`
        );
      }
      found = mapping;
    }
  }

  return found;
}

export function assertCompatibleCapabilityRequirementSatisfactionInterpretationContexts(
  evaluationStateSet: AttentionObservationCapabilityRequirementEvaluationStateSetAssessment,
  interpretationPolicySet: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySetAssessment
): void {
  const evalCandidates = evaluationStateSet.candidate_assessments;
  const policyCandidates = interpretationPolicySet.candidate_assessments;

  if (evalCandidates.length !== policyCandidates.length) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const policyByKey = new Map(
    policyCandidates.map((c) => [c.candidate_key, c])
  );

  for (const evalCandidate of evalCandidates) {
    const policyCandidate = policyByKey.get(evalCandidate.candidate_key);
    if (!policyCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing candidate ${evalCandidate.candidate_key}`
      );
    }

    const evalReqs = evalCandidate.requirement_evaluation_assessments;
    const policyReqs =
      policyCandidate.requirement_satisfaction_interpretation_policy_assessments;

    if (evalReqs.length !== policyReqs.length) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX} for candidate ${evalCandidate.candidate_key}: requirement count mismatch`
      );
    }

    const policyReqByKey = new Map(
      policyReqs.map((r) => [r.capability_requirement.key, r])
    );

    for (const evalReq of evalReqs) {
      const reqKey = evalReq.capability_requirement.key;
      const policyReq = policyReqByKey.get(reqKey);
      if (!policyReq) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX} for candidate ${evalCandidate.candidate_key}: missing requirement ${reqKey}`
        );
      }

      if (
        evalReq.capability_requirement.observation_need_key !==
        policyReq.capability_requirement.observation_need_key
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for capability requirement ${reqKey}`
        );
      }
    }
  }
}

function assertInterpretationAssessmentInvariant(
  assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment
): void {
  if (
    assessment.status ===
      "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT" &&
    assessment.interpretation_basis === null
  ) {
    throw new Error(
      `Satisfaction Interpretation Basis invariant violated: PRESENT requires non-null basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }

  if (
    assessment.status !==
      "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT" &&
    assessment.interpretation_basis !== null
  ) {
    throw new Error(
      `Satisfaction Interpretation Basis invariant violated: non-present status requires null basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function buildInterpretationBasis(
  evalReq: AttentionObservationCapabilityRequirementEvaluationAssessment,
  policy: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicy,
  matchedMapping: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping
): AttentionObservationCapabilityRequirementSatisfactionInterpretationBasis {
  const currentState = evalReq.evaluation_state_basis.state;
  const interpretation = matchedMapping.interpretation;

  if (matchedMapping.evaluation_state !== currentState) {
    throw new Error(
      `Satisfaction Interpretation Basis invariant violated: matched mapping state ${matchedMapping.evaluation_state} does not equal current state ${currentState}`
    );
  }

  if (
    interpretation !== "INTERPRET_AS_SATISFIED" &&
    interpretation !== "INTERPRET_AS_UNSATISFIED"
  ) {
    throw new Error(
      `Unknown Capability Requirement Satisfaction Interpretation: ${String(interpretation)}`
    );
  }

  return {
    key: attentionObservationCapabilityRequirementSatisfactionInterpretationBasisKey(
      evalReq.capability_requirement.key,
      evalReq.evaluation_state_basis.key,
      policy.key,
      currentState,
      interpretation
    ),
    capability_requirement_key: evalReq.capability_requirement.key,
    observation_need_key: evalReq.capability_requirement.observation_need_key,
    requirement_evaluation_state_basis_key: evalReq.evaluation_state_basis.key,
    current_requirement_evaluation_state: currentState,
    satisfaction_interpretation_policy_key: policy.key,
    matched_mapping: {
      evaluation_state: matchedMapping.evaluation_state,
      interpretation: matchedMapping.interpretation,
    },
    interpretation,
  };
}

function assessRequirementSatisfactionInterpretation(
  evalReq: AttentionObservationCapabilityRequirementEvaluationAssessment,
  policyReq: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment
): AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment {
  const wrap = (
    status: AttentionObservationCapabilityRequirementSatisfactionInterpretationStatus,
    interpretation_basis: AttentionObservationCapabilityRequirementSatisfactionInterpretationBasis | null
  ): AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment => {
    const assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment =
      {
        capability_requirement: evalReq.capability_requirement,
        requirement_evaluation_assessment: evalReq,
        satisfaction_interpretation_policy_assessment: policyReq,
        status,
        interpretation_basis,
      };
    assertInterpretationAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    policyReq.status ===
    "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED",
      null
    );
  }

  if (
    policyReq.status !==
      "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT" ||
    policyReq.satisfaction_interpretation_policy === null
  ) {
    throw new Error(
      `Satisfaction Interpretation Policy invariant violated: unexpected policy assessment status for capability requirement ${evalReq.capability_requirement.key}`
    );
  }

  const policy = policyReq.satisfaction_interpretation_policy;
  const currentState = evalReq.evaluation_state_basis.state;
  const matched = findExactSatisfactionInterpretationMapping(
    policy.mappings,
    currentState
  );

  if (matched === null) {
    return wrap(
      "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE",
      null
    );
  }

  return wrap(
    "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT",
    buildInterpretationBasis(evalReq, policy, matched)
  );
}

function hasAnyInterpretationBasis(
  assessments: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure per-AttentionCandidate Satisfaction Interpretation Basis assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_REPRESENTED
 * 4. CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityRequirementSatisfactionInterpretation(
  evaluationStateAssessment: AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment,
  interpretationPolicyAssessment: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment
): AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment {
  const candidate_key = evaluationStateAssessment.candidate_key;

  if (candidate_key !== interpretationPolicyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key} vs ${interpretationPolicyAssessment.candidate_key})`
    );
  }

  const notApplicable = (
    status: AttentionObservationCapabilityRequirementSatisfactionInterpretationCandidateStatus
  ): AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment => ({
    candidate_key,
    requirement_evaluation_state_assessment: evaluationStateAssessment,
    satisfaction_interpretation_policy_assessment:
      interpretationPolicyAssessment,
    status,
    requirement_satisfaction_interpretation_assessments: [],
    has_capability_requirement_satisfaction_interpretation_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_MODEL_LIMITATIONS,
    ],
  });

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    interpretationPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    interpretationPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  const evalReqs = evaluationStateAssessment.requirement_evaluation_assessments;
  const policyReqs =
    interpretationPolicyAssessment.requirement_satisfaction_interpretation_policy_assessments;

  if (evalReqs.length !== policyReqs.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidate_key}: requirement count mismatch`
    );
  }

  const policyReqByKey = new Map(
    policyReqs.map((r) => [r.capability_requirement.key, r])
  );

  const requirement_satisfaction_interpretation_assessments = evalReqs.map(
    (evalReq) => {
      const policyReq = policyReqByKey.get(evalReq.capability_requirement.key);
      if (!policyReq) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidate_key}: missing requirement ${evalReq.capability_requirement.key}`
        );
      }
      return assessRequirementSatisfactionInterpretation(evalReq, policyReq);
    }
  );

  for (const assessment of requirement_satisfaction_interpretation_assessments) {
    assertInterpretationAssessmentInvariant(assessment);
  }

  const has_capability_requirement_satisfaction_interpretation_basis =
    hasAnyInterpretationBasis(
      requirement_satisfaction_interpretation_assessments
    );

  return {
    candidate_key,
    requirement_evaluation_state_assessment: evaluationStateAssessment,
    satisfaction_interpretation_policy_assessment:
      interpretationPolicyAssessment,
    status: has_capability_requirement_satisfaction_interpretation_basis
      ? "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_PRESENT"
      : "NO_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASES_REPRESENTED",
    requirement_satisfaction_interpretation_assessments,
    has_capability_requirement_satisfaction_interpretation_basis,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateInterpretationBasis(
  assessments: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_requirement_satisfaction_interpretation_basis) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Satisfaction Interpretation Basis composition.
 * Does not emit final SATISFIED / UNSATISFIED Satisfaction State.
 */
export function buildAttentionObservationCapabilityRequirementSatisfactionInterpretationSet(
  input: AttentionObservationCapabilityRequirementSatisfactionInterpretationInput
): AttentionObservationCapabilityRequirementSatisfactionInterpretationSetAssessment {
  const evaluationStateSet =
    input.capability_requirement_evaluation_state_set;
  const interpretationPolicySet =
    input.capability_requirement_satisfaction_interpretation_policy_set;

  assertCompatibleCapabilityRequirementSatisfactionInterpretationContexts(
    evaluationStateSet,
    interpretationPolicySet
  );

  const policyByKey = new Map(
    interpretationPolicySet.candidate_assessments.map((c) => [
      c.candidate_key,
      c,
    ])
  );

  const candidate_assessments = evaluationStateSet.candidate_assessments.map(
    (evalCandidate) => {
      const policyCandidate = policyByKey.get(evalCandidate.candidate_key)!;
      return assessAttentionCandidateObservationCapabilityRequirementSatisfactionInterpretation(
        evalCandidate,
        policyCandidate
      );
    }
  );

  return {
    capability_requirement_evaluation_state_set: evaluationStateSet,
    capability_requirement_satisfaction_interpretation_policy_set:
      interpretationPolicySet,
    candidate_assessments,
    has_capability_requirement_satisfaction_interpretation_basis:
      hasAnyCandidateInterpretationBasis(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_MODEL_LIMITATIONS,
    ],
  };
}
