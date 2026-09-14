/**
 * Reality Core v0.7 — Attention Observation Capability Interpretation Basis
 * (GROUND-082).
 *
 * Pure composition of:
 *   GROUND-080 Current Capability Requirement Set Evaluation State
 *   GROUND-081 Explicit Capability Interpretation Policy
 *
 * Answers only whether the exact current Requirement-set Evaluation State has an
 * exact explicitly declared Capability Interpretation mapping.
 *
 * Must not import GROUND-048–079 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, persisted
 * project state, GROUND-041–045, Permission, Authority, Resource.
 *
 * Interpretation Basis ≠ Capability State
 * INTERPRET_AS_CAPABILITY_PRESENT ≠ current CAPABILITY_PRESENT
 * INTERPRET_AS_CAPABILITY_ABSENT ≠ current CAPABILITY_ABSENT
 * policy absent ≠ policy present but current state unmapped
 * no mapping ≠ INTERPRET_AS_CAPABILITY_ABSENT
 * no default HOLDS→PRESENT / DOES_NOT_HOLD→ABSENT
 */

import type {
  AttentionCandidateObservationCapabilityInterpretationPolicyAssessment,
  AttentionObservationCapabilityInterpretation,
  AttentionObservationCapabilityInterpretationMapping,
  AttentionObservationCapabilityInterpretationPolicy,
  AttentionObservationCapabilityInterpretationPolicySetAssessment,
} from "./attention-observation-capability-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment,
  AttentionObservationCapabilityRequirementSetEvaluationState,
  AttentionObservationCapabilityRequirementSetEvaluationStateBasis,
  AttentionObservationCapabilityRequirementSetEvaluationStateSetAssessment,
} from "./attention-observation-capability-requirement-set-evaluation-state-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
} from "./attention-observation-capability-requirement-set-identity.js";
import type {
  AttentionCandidateObservationCapabilityInterpretationAssessment,
  AttentionObservationCapabilityInterpretationBasis,
  AttentionObservationCapabilityInterpretationInput,
  AttentionObservationCapabilityInterpretationModelLimitation,
  AttentionObservationCapabilityInterpretationSetAssessment,
  AttentionObservationCapabilityInterpretationStatus,
} from "./attention-observation-capability-interpretation-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_MODEL_LIMITATIONS: AttentionObservationCapabilityInterpretationModelLimitation[] =
  [
    "CAPABILITY_STATE_NOT_MODELED",
    "CAPABILITY_PRESENT_STATE_NOT_MODELED",
    "CAPABILITY_ABSENT_STATE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_NO_MAPPING_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_WILDCARD_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_GROUPING_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_INHERITANCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_PROVENANCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_AUTHORITY_NOT_MODELED",
    "ZERO_CAPABILITY_REQUIREMENT_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_TRUTH_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
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
  "Capability Requirement Set Evaluation State set and Capability Interpretation Policy set do not share the same Capability Requirement-set context";

export function attentionObservationCapabilityInterpretationBasisKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  requirementSetEvaluationStateBasisKey: string,
  capabilityInterpretationPolicyKey: string,
  evaluationState: AttentionObservationCapabilityRequirementSetEvaluationState,
  interpretation: AttentionObservationCapabilityInterpretation
): string {
  return [
    "attention-observation-capability-interpretation-basis",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    requirementSetEvaluationStateBasisKey,
    capabilityInterpretationPolicyKey,
    evaluationState,
    interpretation,
  ].join("|");
}

/**
 * Exact current-state mapping lookup.
 * At most one mapping per Evaluation State (081 invariant); multiplicity rejects.
 * No fuzzy / wildcard / hierarchy matching.
 */
export function findExactCapabilityInterpretationMapping(
  mappings: readonly AttentionObservationCapabilityInterpretationMapping[],
  currentState: AttentionObservationCapabilityRequirementSetEvaluationState
): AttentionObservationCapabilityInterpretationMapping | null {
  let found: AttentionObservationCapabilityInterpretationMapping | null = null;

  for (const mapping of mappings) {
    if (mapping.evaluation_state === currentState) {
      if (found !== null) {
        throw new Error(
          `Capability Interpretation mapping multiplicity invariant violated for evaluation state ${currentState}`
        );
      }
      found = mapping;
    }
  }

  return found;
}

function assertAlignedPresentContexts(
  evalCandidate: AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment,
  policyCandidate: AttentionCandidateObservationCapabilityInterpretationPolicyAssessment
): AttentionObservationCapabilityRequirementSetEvaluationStateBasis {
  if (evalCandidate.evaluation_state_basis === null) {
    throw new Error(
      `Capability Interpretation Basis invariant violated: EVALUATION_STATE_PRESENT requires non-null evaluation_state_basis for candidate ${evalCandidate.candidate_key}`
    );
  }

  const evalBasis = evalCandidate.evaluation_state_basis;

  if (
    policyCandidate.status ===
    "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
  ) {
    if (policyCandidate.capability_interpretation_policy === null) {
      throw new Error(
        `Capability Interpretation Policy invariant violated: PRESENT requires non-null policy for candidate ${policyCandidate.candidate_key}`
      );
    }

    const policy = policyCandidate.capability_interpretation_policy;

    if (evalBasis.candidate_key !== policy.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Candidate key mismatch for candidate ${evalCandidate.candidate_key}`
      );
    }

    if (evalBasis.observation_need_key !== policy.observation_need_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for candidate ${evalCandidate.candidate_key}`
      );
    }

    if (
      evalBasis.capability_requirement_set_key !==
      policy.capability_requirement_set_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Requirement-set key mismatch for candidate ${evalCandidate.candidate_key}`
      );
    }

    const rebuiltSetKey = buildAttentionObservationCapabilityRequirementSetKey(
      policy.candidate_key,
      policy.observation_need_key,
      policy.capability_requirement_keys
    );
    if (rebuiltSetKey !== policy.capability_requirement_set_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Requirement-set lineage mismatch for candidate ${evalCandidate.candidate_key}`
      );
    }
  } else if (
    policyCandidate.status ===
    "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (policyCandidate.capability_interpretation_policy !== null) {
      throw new Error(
        `Capability Interpretation Policy invariant violated: NO_POLICY_DECLARED requires null policy for candidate ${policyCandidate.candidate_key}`
      );
    }
  } else {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: incompatible policy status ${policyCandidate.status} with Evaluation State PRESENT for candidate ${evalCandidate.candidate_key}`
    );
  }

  return evalBasis;
}

export function assertCompatibleCapabilityInterpretationContexts(
  evaluationStateSet: AttentionObservationCapabilityRequirementSetEvaluationStateSetAssessment,
  interpretationPolicySet: AttentionObservationCapabilityInterpretationPolicySetAssessment
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

    const evalPresent =
      evalCandidate.status ===
      "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT";
    const policyPresent =
      policyCandidate.status ===
      "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT";
    const policyDeclaredAbsent =
      policyCandidate.status ===
      "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED";

    if (evalPresent) {
      assertAlignedPresentContexts(evalCandidate, policyCandidate);
      continue;
    }

    if (
      evalCandidate.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    ) {
      if (
        policyCandidate.status !==
          "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" &&
        policyCandidate.status !==
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      ) {
        // Allow policy side also to be no-planning; reject present-domain policy.
        if (policyPresent || policyDeclaredAbsent) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: planning-basis mismatch for candidate ${evalCandidate.candidate_key}`
          );
        }
      }
      if (evalCandidate.evaluation_state_basis !== null) {
        throw new Error(
          `Capability Interpretation Basis invariant violated: non-present Evaluation State requires null basis for candidate ${evalCandidate.candidate_key}`
        );
      }
      continue;
    }

    if (
      evalCandidate.status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    ) {
      if (policyPresent || policyDeclaredAbsent) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: Requirements-domain mismatch for candidate ${evalCandidate.candidate_key}`
        );
      }
      if (evalCandidate.evaluation_state_basis !== null) {
        throw new Error(
          `Capability Interpretation Basis invariant violated: non-present Evaluation State requires null basis for candidate ${evalCandidate.candidate_key}`
        );
      }
    }
  }
}

function assertInterpretationAssessmentInvariant(
  assessment: AttentionCandidateObservationCapabilityInterpretationAssessment
): void {
  if (
    assessment.status === "CAPABILITY_INTERPRETATION_BASIS_PRESENT" &&
    assessment.interpretation_basis === null
  ) {
    throw new Error(
      `Capability Interpretation Basis invariant violated: PRESENT requires non-null basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "CAPABILITY_INTERPRETATION_BASIS_PRESENT" &&
    assessment.interpretation_basis !== null
  ) {
    throw new Error(
      `Capability Interpretation Basis invariant violated: non-present status requires null basis for candidate ${assessment.candidate_key}`
    );
  }

  const expectedHasBasis =
    assessment.status === "CAPABILITY_INTERPRETATION_BASIS_PRESENT";
  if (assessment.has_capability_interpretation_basis !== expectedHasBasis) {
    throw new Error(
      `Capability Interpretation Basis invariant violated: has_capability_interpretation_basis mismatch for candidate ${assessment.candidate_key}`
    );
  }
}

function buildInterpretationBasis(
  evalBasis: AttentionObservationCapabilityRequirementSetEvaluationStateBasis,
  policy: AttentionObservationCapabilityInterpretationPolicy,
  matchedMapping: AttentionObservationCapabilityInterpretationMapping
): AttentionObservationCapabilityInterpretationBasis {
  const currentState = evalBasis.state;
  const interpretation = matchedMapping.interpretation;

  if (matchedMapping.evaluation_state !== currentState) {
    throw new Error(
      `Capability Interpretation Basis invariant violated: matched mapping state ${matchedMapping.evaluation_state} does not equal current state ${currentState}`
    );
  }

  if (
    interpretation !== "INTERPRET_AS_CAPABILITY_PRESENT" &&
    interpretation !== "INTERPRET_AS_CAPABILITY_ABSENT"
  ) {
    throw new Error(
      `Unknown Capability Interpretation: ${String(interpretation)}`
    );
  }

  return {
    key: attentionObservationCapabilityInterpretationBasisKey(
      evalBasis.candidate_key,
      evalBasis.observation_need_key,
      evalBasis.capability_requirement_set_key,
      evalBasis.key,
      policy.key,
      currentState,
      interpretation
    ),
    candidate_key: evalBasis.candidate_key,
    observation_need_key: evalBasis.observation_need_key,
    capability_requirement_set_key: evalBasis.capability_requirement_set_key,
    requirement_set_evaluation_state_basis_key: evalBasis.key,
    current_requirement_set_evaluation_state: currentState,
    capability_interpretation_policy_key: policy.key,
    matched_mapping: {
      evaluation_state: matchedMapping.evaluation_state,
      interpretation: matchedMapping.interpretation,
    },
    interpretation,
  };
}

/**
 * Pure per-AttentionCandidate Capability Interpretation Basis assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED
 * 4. NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE
 * 5. CAPABILITY_INTERPRETATION_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityInterpretation(
  evaluationStateAssessment: AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment,
  interpretationPolicyAssessment: AttentionCandidateObservationCapabilityInterpretationPolicyAssessment
): AttentionCandidateObservationCapabilityInterpretationAssessment {
  const candidate_key = evaluationStateAssessment.candidate_key;

  if (candidate_key !== interpretationPolicyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key} vs ${interpretationPolicyAssessment.candidate_key})`
    );
  }

  const wrap = (
    status: AttentionObservationCapabilityInterpretationStatus,
    interpretation_basis: AttentionObservationCapabilityInterpretationBasis | null
  ): AttentionCandidateObservationCapabilityInterpretationAssessment => {
    const assessment: AttentionCandidateObservationCapabilityInterpretationAssessment =
      {
        candidate_key,
        capability_requirement_set_evaluation_state_assessment:
          evaluationStateAssessment,
        capability_interpretation_policy_assessment:
          interpretationPolicyAssessment,
        status,
        interpretation_basis,
        has_capability_interpretation_basis:
          status === "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
        model_limitations: [
          ...ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_MODEL_LIMITATIONS,
        ],
      };
    assertInterpretationAssessmentInvariant(assessment);
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
    evaluationStateAssessment.status !==
      "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT" ||
    evaluationStateAssessment.evaluation_state_basis === null
  ) {
    throw new Error(
      `Capability Interpretation Basis invariant violated: expected Evaluation State PRESENT with basis for candidate ${candidate_key}`
    );
  }

  const evalBasis = assertAlignedPresentContexts(
    evaluationStateAssessment,
    interpretationPolicyAssessment
  );

  if (
    interpretationPolicyAssessment.status ===
    "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
  ) {
    return wrap("NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED", null);
  }

  if (
    interpretationPolicyAssessment.status !==
      "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT" ||
    interpretationPolicyAssessment.capability_interpretation_policy === null
  ) {
    throw new Error(
      `Capability Interpretation Policy invariant violated: unexpected policy assessment status for candidate ${candidate_key}`
    );
  }

  const policy =
    interpretationPolicyAssessment.capability_interpretation_policy;
  const matched = findExactCapabilityInterpretationMapping(
    policy.mappings,
    evalBasis.state
  );

  if (matched === null) {
    return wrap(
      "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE",
      null
    );
  }

  return wrap(
    "CAPABILITY_INTERPRETATION_BASIS_PRESENT",
    buildInterpretationBasis(evalBasis, policy, matched)
  );
}

function hasAnyCandidateInterpretationBasis(
  assessments: AttentionCandidateObservationCapabilityInterpretationAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_interpretation_basis) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Capability Interpretation Basis composition.
 * Does not emit current CAPABILITY_PRESENT / CAPABILITY_ABSENT Capability State.
 */
export function buildAttentionObservationCapabilityInterpretationSet(
  input: AttentionObservationCapabilityInterpretationInput
): AttentionObservationCapabilityInterpretationSetAssessment {
  const evaluationStateSet =
    input.capability_requirement_set_evaluation_state_set;
  const interpretationPolicySet = input.capability_interpretation_policy_set;

  assertCompatibleCapabilityInterpretationContexts(
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
      return assessAttentionCandidateObservationCapabilityInterpretation(
        evalCandidate,
        policyCandidate
      );
    }
  );

  return {
    capability_requirement_set_evaluation_state_set: evaluationStateSet,
    capability_interpretation_policy_set: interpretationPolicySet,
    candidate_assessments,
    has_capability_interpretation_basis:
      hasAnyCandidateInterpretationBasis(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_MODEL_LIMITATIONS,
    ],
  };
}
