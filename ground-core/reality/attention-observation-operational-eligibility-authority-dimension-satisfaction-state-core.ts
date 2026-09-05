/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Dimension Satisfaction State core (GROUND-130).
 *
 * Pure normalization of GROUND-129 Interpretation Basis Assessment.
 *
 * Must not import GROUND-127/128/118–126 runtime cores directly.
 *
 * SATISFIED / UNSATISFIED are explicit-policy-derived via 129 only.
 * NO_POLICY ≠ UNSATISFIED
 * NO_MAPPING ≠ UNSATISFIED
 * Satisfaction ≠ effective Authority / Operational Eligibility / can_execute
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-basis-types.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfactionAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasis,
  AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionInput,
  AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState,
  AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue,
  AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStatus,
} from "./attention-observation-operational-eligibility-authority-dimension-satisfaction-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionModelLimitation[] =
  [
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const NO_INTERPRETATION_POLICY = "NO_INTERPRETATION_POLICY";
const NO_INTERPRETATION_BASIS = "NO_INTERPRETATION_BASIS";
const NO_MATCHED_MAPPING = "NO_MATCHED_MAPPING";
const NO_INTERPRETATION = "NO_INTERPRETATION";
const NO_EVALUATION_STATE = "NO_EVALUATION_STATE";
const NO_EVALUATION_STATE_BASIS = "NO_EVALUATION_STATE_BASIS";
const NO_EVALUATION_STATE_VALUE = "NO_EVALUATION_STATE_VALUE";

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-dimension-satisfaction-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * ground129Status|ground129BasisKey-or-NONE|
 * evaluationStateKey-or-NONE|evaluationStateBasisKey-or-NONE|evaluationStateValue-or-NONE|
 * interpretationPolicyKey-or-NONE|matchedMappingKey-or-NONE|interpretation-or-NONE|
 * satisfactionState
 */
export function attentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  interpretation_basis_status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus;
  authority_dimension_evaluation_state_interpretation_basis_key: string | null;
  authority_dimension_evaluation_state_key: string | null;
  authority_dimension_evaluation_state_basis_key: string | null;
  authority_dimension_evaluation_state: string | null;
  authority_dimension_evaluation_state_interpretation_policy_key: string | null;
  matched_interpretation_mapping_key: string | null;
  interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation | null;
  satisfaction_state: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-dimension-satisfaction-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.interpretation_basis_status,
    params.authority_dimension_evaluation_state_interpretation_basis_key ??
      NO_INTERPRETATION_BASIS,
    params.authority_dimension_evaluation_state_key ?? NO_EVALUATION_STATE,
    params.authority_dimension_evaluation_state_basis_key ??
      NO_EVALUATION_STATE_BASIS,
    params.authority_dimension_evaluation_state ?? NO_EVALUATION_STATE_VALUE,
    params.authority_dimension_evaluation_state_interpretation_policy_key ??
      NO_INTERPRETATION_POLICY,
    params.matched_interpretation_mapping_key ?? NO_MATCHED_MAPPING,
    params.interpretation ?? NO_INTERPRETATION,
    params.satisfaction_state,
  ].join("|");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-dimension-satisfaction-state|
 * basisKey|candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * satisfactionState
 */
export function attentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateKey(params: {
  basis_key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  satisfaction_state: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-dimension-satisfaction-state",
    params.basis_key,
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.satisfaction_state,
  ].join("|");
}

export function isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState(
  value: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue
): boolean {
  switch (value) {
    case "AUTHORITY_DIMENSION_SATISFIED":
    case "AUTHORITY_DIMENSION_UNSATISFIED":
      return true;
    case "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY":
    case "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE":
      return false;
  }
}

function isOuterInterpretationBasisStatus(
  status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus
): status is
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" {
  return (
    status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    status === "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    status === "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  );
}

function mapOuterToSatisfactionStatus(
  status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisStatus
): AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStatus {
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
        `AUTHORITY Dimension Satisfaction State invariant violated: not an outer Interpretation Basis status ${status}`
      );
  }
}

function assertInterpretationBasisPresentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment
): void {
  const status = assessment.status;
  const basis =
    assessment.authority_dimension_evaluation_state_interpretation_basis;

  if (
    status ===
      "AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    basis === null
  ) {
    throw new Error(
      `AUTHORITY Dimension Satisfaction State invariant violated: BASIS_PRESENT requires non-null Interpretation Basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    status !==
      "AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    basis !== null
  ) {
    throw new Error(
      `AUTHORITY Dimension Satisfaction State invariant violated: non-present Interpretation Basis status requires null Basis for candidate ${assessment.candidate_key}`
    );
  }
}

function assertPolicyAbsenceInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment
): void {
  const policyAssessment =
    assessment.authority_dimension_evaluation_state_interpretation_policy_assessment;
  if (
    policyAssessment.status ===
      "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.authority_dimension_evaluation_state_interpretation_policy !==
      null
  ) {
    throw new Error(
      `AUTHORITY Dimension Satisfaction State invariant violated: NO_POLICY must not carry explicit Interpretation Policy for candidate ${assessment.candidate_key}`
    );
  }
}

function assertNoMappingInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment
): void {
  const policyAssessment =
    assessment.authority_dimension_evaluation_state_interpretation_policy_assessment;
  if (
    policyAssessment.status !==
      "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.authority_dimension_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `AUTHORITY Dimension Satisfaction State invariant violated: NO_MAPPING requires explicit Interpretation Policy PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function mapInterpretationToSatisfactionState(
  interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation
): AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue {
  switch (interpretation) {
    case "INTERPRET_AS_AUTHORITY_DIMENSION_SATISFIED":
      return "AUTHORITY_DIMENSION_SATISFIED";
    case "INTERPRET_AS_AUTHORITY_DIMENSION_UNSATISFIED":
      return "AUTHORITY_DIMENSION_UNSATISFIED";
  }
}

/**
 * Exhaustive 129 → 130 semantic mapping. No Evaluation State polarity inference.
 */
export function mapInterpretationBasisAssessmentToAuthorityDimensionSatisfactionState(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment
): AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue {
  assertInterpretationBasisPresentInvariant(assessment);

  switch (assessment.status) {
    case "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED":
      assertPolicyAbsenceInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY";

    case "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE":
      assertNoMappingInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE";

    case "AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT":
      return mapInterpretationToSatisfactionState(
        assessment.authority_dimension_evaluation_state_interpretation_basis!
          .interpretation
      );

    default:
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: unexpected Interpretation Basis status ${assessment.status} for candidate ${assessment.candidate_key}`
      );
  }
}

function buildSatisfactionBasis(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment,
  satisfactionState: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateValue
): AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasis {
  const evalAssessment =
    assessment.authority_dimension_evaluation_state_assessment;
  const evalState = evalAssessment.authority_dimension_evaluation_state;
  const evalBasis = evalAssessment.authority_dimension_evaluation_state_basis;
  const policyAssessment =
    assessment.authority_dimension_evaluation_state_interpretation_policy_assessment;
  const interpretationBasis =
    assessment.authority_dimension_evaluation_state_interpretation_basis;
  const policy =
    policyAssessment.authority_dimension_evaluation_state_interpretation_policy;

  if (evalState === null || evalBasis === null) {
    throw new Error(
      `AUTHORITY Dimension Satisfaction State invariant violated: applicable domain requires current Evaluation State for candidate ${assessment.candidate_key}`
    );
  }

  let interpretationPolicyKey: string | null = null;
  let interpretationBasisKey: string | null = null;
  let matchedMappingKey: string | null = null;
  let interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation | null =
    null;

  if (
    satisfactionState === "AUTHORITY_DIMENSION_SATISFIED" ||
    satisfactionState === "AUTHORITY_DIMENSION_UNSATISFIED"
  ) {
    if (interpretationBasis === null) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: ${satisfactionState} requires non-null Interpretation Basis for candidate ${assessment.candidate_key}`
      );
    }
    if (
      interpretationBasis.authority_dimension_evaluation_state_key !==
        evalState.key ||
      interpretationBasis.authority_dimension_evaluation_state_basis_key !==
        evalBasis.key
    ) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: Interpretation Basis lineage mismatch for candidate ${assessment.candidate_key}`
      );
    }
    if (
      satisfactionState === "AUTHORITY_DIMENSION_SATISFIED" &&
      interpretationBasis.interpretation !==
        "INTERPRET_AS_AUTHORITY_DIMENSION_SATISFIED"
    ) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: SATISFIED requires INTERPRET_AS_AUTHORITY_DIMENSION_SATISFIED for candidate ${assessment.candidate_key}`
      );
    }
    if (
      satisfactionState === "AUTHORITY_DIMENSION_UNSATISFIED" &&
      interpretationBasis.interpretation !==
        "INTERPRET_AS_AUTHORITY_DIMENSION_UNSATISFIED"
    ) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: UNSATISFIED requires INTERPRET_AS_AUTHORITY_DIMENSION_UNSATISFIED for candidate ${assessment.candidate_key}`
      );
    }
    interpretationBasisKey = interpretationBasis.key;
    interpretationPolicyKey =
      interpretationBasis.authority_dimension_evaluation_state_interpretation_policy_key;
    matchedMappingKey = interpretationBasis.matched_interpretation_mapping_key;
    interpretation = interpretationBasis.interpretation;
  } else if (
    satisfactionState ===
    "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY"
  ) {
    if (interpretationBasis !== null || policy !== null) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: NO_POLICY unresolved state must not carry Interpretation Basis or policy for candidate ${assessment.candidate_key}`
      );
    }
  } else if (
    satisfactionState ===
    "UNRESOLVED_NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
  ) {
    if (interpretationBasis !== null) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: NO_MAPPING unresolved state requires null Interpretation Basis for candidate ${assessment.candidate_key}`
      );
    }
    if (policy === null) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: NO_MAPPING unresolved state requires non-null Interpretation Policy for candidate ${assessment.candidate_key}`
      );
    }
    interpretationPolicyKey = policy.key;
  }

  return {
    key: attentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasisKey(
      {
        candidate_key: evalState.candidate_key,
        observation_need_key: evalState.observation_need_key,
        capability_requirement_set_key: evalState.capability_requirement_set_key,
        interpretation_basis_status: assessment.status,
        authority_dimension_evaluation_state_interpretation_basis_key:
          interpretationBasisKey,
        authority_dimension_evaluation_state_key: evalState.key,
        authority_dimension_evaluation_state_basis_key: evalBasis.key,
        authority_dimension_evaluation_state:
          evalState.authority_dimension_evaluation_state,
        authority_dimension_evaluation_state_interpretation_policy_key:
          interpretationPolicyKey,
        matched_interpretation_mapping_key: matchedMappingKey,
        interpretation,
        satisfaction_state: satisfactionState,
      }
    ),
    candidate_key: evalState.candidate_key,
    observation_need_key: evalState.observation_need_key,
    capability_requirement_set_key: evalState.capability_requirement_set_key,
    dimension: "AUTHORITY",
    satisfaction_state: satisfactionState,
    authority_dimension_evaluation_state_key: evalState.key,
    authority_dimension_evaluation_state_basis_key: evalBasis.key,
    authority_dimension_evaluation_state:
      evalState.authority_dimension_evaluation_state,
    authority_dimension_evaluation_state_interpretation_policy_key:
      interpretationPolicyKey,
    authority_dimension_evaluation_state_interpretation_basis_key:
      interpretationBasisKey,
    matched_interpretation_mapping_key: matchedMappingKey,
    interpretation,
    interpretation_basis_status: assessment.status,
  };
}

function buildSatisfactionStateRecord(
  basis: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionBasis
): AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState {
  return {
    key: attentionObservationOperationalEligibilityAuthorityDimensionSatisfactionStateKey(
      {
        basis_key: basis.key,
        candidate_key: basis.candidate_key,
        observation_need_key: basis.observation_need_key,
        capability_requirement_set_key: basis.capability_requirement_set_key,
        satisfaction_state: basis.satisfaction_state,
      }
    ),
    basis_key: basis.key,
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "AUTHORITY",
    satisfaction_state: basis.satisfaction_state,
  };
}

function assertCandidateSatisfactionAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfactionAssessment
): void {
  const expectedHas = assessment.authority_dimension_satisfaction_state !== null;
  if (assessment.has_authority_dimension_satisfaction_state !== expectedHas) {
    throw new Error(
      `AUTHORITY Dimension Satisfaction State invariant violated: has_state mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (expectedHas) {
    const resolved = isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState(
      assessment.authority_dimension_satisfaction_state!.satisfaction_state
    );
    if (
      assessment.has_resolved_authority_dimension_satisfaction_state !==
      resolved
    ) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: has_resolved mismatch for candidate ${assessment.candidate_key}`
      );
    }
    if (
      assessment.has_unresolved_authority_dimension_satisfaction_state !==
      !resolved
    ) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: has_unresolved mismatch for candidate ${assessment.candidate_key}`
      );
    }
  } else {
    if (
      assessment.has_resolved_authority_dimension_satisfaction_state ||
      assessment.has_unresolved_authority_dimension_satisfaction_state
    ) {
      throw new Error(
        `AUTHORITY Dimension Satisfaction State invariant violated: outer non-applicable requires both resolved flags false for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    assessment.status === "AUTHORITY_DIMENSION_SATISFACTION_STATE_PRESENT" &&
    (assessment.authority_dimension_satisfaction_basis === null ||
      assessment.authority_dimension_satisfaction_state === null)
  ) {
    throw new Error(
      `AUTHORITY Dimension Satisfaction State invariant violated: PRESENT requires non-null Basis and State for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "AUTHORITY_DIMENSION_SATISFACTION_STATE_PRESENT" &&
    (assessment.authority_dimension_satisfaction_basis !== null ||
      assessment.authority_dimension_satisfaction_state !== null)
  ) {
    throw new Error(
      `AUTHORITY Dimension Satisfaction State invariant violated: outer status requires null Basis and State for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure Candidate-level AUTHORITY Dimension Satisfaction State.
 *
 * Precedence:
 * 1. outer NOT_APPLICABLE / no OE / not required → no Satisfaction State
 * 2. exact 129 status → one of four canonical Satisfaction States
 * 3. exact Satisfaction Basis + State record
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfaction(
  interpretationBasisAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationBasisAssessment
): AttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfactionAssessment {
  const candidate_key = interpretationBasisAssessment.candidate_key;

  if (isOuterInterpretationBasisStatus(interpretationBasisAssessment.status)) {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfactionAssessment =
      {
        candidate_key,
        authority_dimension_evaluation_state_interpretation_basis_assessment:
          interpretationBasisAssessment,
        status: mapOuterToSatisfactionStatus(
          interpretationBasisAssessment.status
        ),
        authority_dimension_satisfaction_basis: null,
        authority_dimension_satisfaction_state: null,
        has_authority_dimension_satisfaction_state: false,
        has_resolved_authority_dimension_satisfaction_state: false,
        has_unresolved_authority_dimension_satisfaction_state: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateSatisfactionAssessmentInvariant(assessment);
    return assessment;
  }

  const satisfactionState =
    mapInterpretationBasisAssessmentToAuthorityDimensionSatisfactionState(
      interpretationBasisAssessment
    );
  const satisfactionBasis = buildSatisfactionBasis(
    interpretationBasisAssessment,
    satisfactionState
  );
  const satisfactionStateRecord = buildSatisfactionStateRecord(satisfactionBasis);
  const resolved =
    isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionState(
      satisfactionState
    );

  const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfactionAssessment =
    {
      candidate_key,
      authority_dimension_evaluation_state_interpretation_basis_assessment:
        interpretationBasisAssessment,
      status: "AUTHORITY_DIMENSION_SATISFACTION_STATE_PRESENT",
      authority_dimension_satisfaction_basis: satisfactionBasis,
      authority_dimension_satisfaction_state: satisfactionStateRecord,
      has_authority_dimension_satisfaction_state: true,
      has_resolved_authority_dimension_satisfaction_state: resolved,
      has_unresolved_authority_dimension_satisfaction_state: !resolved,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateSatisfactionAssessmentInvariant(assessment);
  return assessment;
}

export function buildAttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSet(
  input: AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionInput
): AttentionObservationOperationalEligibilityAuthorityDimensionSatisfactionSetAssessment {
  const interpretationBasisSet =
    input.authority_dimension_evaluation_state_interpretation_basis_set;

  const candidate_assessments =
    interpretationBasisSet.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionSatisfaction
    );

  return {
    authority_dimension_evaluation_state_interpretation_basis_set:
      interpretationBasisSet,
    candidate_assessments,
    has_authority_dimension_satisfaction_states: candidate_assessments.some(
      (a) => a.has_authority_dimension_satisfaction_state
    ),
    has_resolved_authority_dimension_satisfaction_states:
      candidate_assessments.some(
        (a) => a.has_resolved_authority_dimension_satisfaction_state
      ),
    has_unresolved_authority_dimension_satisfaction_states:
      candidate_assessments.some(
        (a) => a.has_unresolved_authority_dimension_satisfaction_state
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_MODEL_LIMITATIONS,
    ],
  };
}
