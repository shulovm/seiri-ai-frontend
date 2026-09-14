/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Dimension Satisfaction State core (GROUND-106).
 *
 * Pure normalization of GROUND-105 Interpretation Basis Assessment.
 *
 * Must not import GROUND-103/104/093–101 runtime cores directly.
 *
 * SATISFIED / UNSATISFIED are explicit-policy-derived via 105 only.
 * NO_POLICY ≠ UNSATISFIED
 * NO_MAPPING ≠ UNSATISFIED
 * Satisfaction ≠ effective Permission / Operational Eligibility / can_execute
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-basis-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionStateAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState,
  AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasis,
  AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateInput,
  AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateModelLimitation,
  AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateRecord,
  AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSetAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateStatus,
} from "./attention-observation-operational-eligibility-permission-dimension-satisfaction-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_REQUIRED_COVERAGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_ACCEPTANCE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const NO_INTERPRETATION_POLICY = "NO_INTERPRETATION_POLICY";
const NO_INTERPRETATION_BASIS = "NO_INTERPRETATION_BASIS";
const NO_INTERPRETATION = "NO_INTERPRETATION";

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-dimension-satisfaction-state-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|PERMISSION|
 * permissionDimensionSatisfactionState|
 * permissionDimensionEvaluationStateKey|permissionDimensionEvaluationStateBasisKey|
 * interpretationPolicyKey-or-NO_INTERPRETATION_POLICY|
 * interpretationBasisKey-or-NO_INTERPRETATION_BASIS|
 * interpretation-or-NO_INTERPRETATION|interpretationBasisStatus
 */
export function attentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_dimension_satisfaction_state: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState;
  permission_dimension_evaluation_state_key: string;
  permission_dimension_evaluation_state_basis_key: string;
  permission_dimension_evaluation_state_interpretation_policy_key: string | null;
  permission_dimension_evaluation_state_interpretation_basis_key: string | null;
  interpretation: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation | null;
  interpretation_basis_status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-dimension-satisfaction-state-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "PERMISSION",
    params.permission_dimension_satisfaction_state,
    params.permission_dimension_evaluation_state_key,
    params.permission_dimension_evaluation_state_basis_key,
    params.permission_dimension_evaluation_state_interpretation_policy_key ??
      NO_INTERPRETATION_POLICY,
    params.permission_dimension_evaluation_state_interpretation_basis_key ??
      NO_INTERPRETATION_BASIS,
    params.interpretation ?? NO_INTERPRETATION,
    params.interpretation_basis_status,
  ].join("|");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-dimension-satisfaction-state|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|PERMISSION|
 * permissionDimensionSatisfactionState|permissionDimensionSatisfactionStateBasisKey
 */
export function attentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_dimension_satisfaction_state: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState;
  permission_dimension_satisfaction_state_basis_key: string;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-dimension-satisfaction-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "PERMISSION",
    params.permission_dimension_satisfaction_state,
    params.permission_dimension_satisfaction_state_basis_key,
  ].join("|");
}

export function isResolvedAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState(
  state: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState
): boolean {
  switch (state) {
    case "PERMISSION_DIMENSION_SATISFIED":
    case "PERMISSION_DIMENSION_UNSATISFIED":
      return true;
    case "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY":
    case "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE":
      return false;
  }
}

function isOuterInterpretationBasisStatus(
  status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus
): status is
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" {
  return (
    status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    status === "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    status === "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  );
}

function mapOuterToSatisfactionStatus(
  status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisStatus
): AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateStatus {
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
        `Permission Dimension Satisfaction State invariant violated: not an outer Interpretation Basis status ${status}`
      );
  }
}

function assertInterpretationBasisPresentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment
): void {
  const status = assessment.status;
  const basis = assessment.permission_dimension_evaluation_state_interpretation_basis;

  if (
    status ===
      "PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    basis === null
  ) {
    throw new Error(
      `Permission Dimension Satisfaction State invariant violated: BASIS_PRESENT requires non-null Interpretation Basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    status !==
      "PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT" &&
    basis !== null
  ) {
    throw new Error(
      `Permission Dimension Satisfaction State invariant violated: non-present Interpretation Basis status requires null Basis for candidate ${assessment.candidate_key}`
    );
  }
}

function assertPolicyAbsenceInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment
): void {
  const policyAssessment =
    assessment.permission_dimension_evaluation_state_interpretation_policy_assessment;
  if (
    policyAssessment.status ===
      "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.permission_dimension_evaluation_state_interpretation_policy !==
      null
  ) {
    throw new Error(
      `Permission Dimension Satisfaction State invariant violated: NO_POLICY must not carry explicit Interpretation Policy for candidate ${assessment.candidate_key}`
    );
  }
}

function assertNoMappingInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment
): void {
  const policyAssessment =
    assessment.permission_dimension_evaluation_state_interpretation_policy_assessment;
  if (
    policyAssessment.status !==
      "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.permission_dimension_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `Permission Dimension Satisfaction State invariant violated: NO_MAPPING requires explicit Interpretation Policy PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function mapInterpretationToSatisfactionState(
  interpretation: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation
): AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState {
  switch (interpretation) {
    case "INTERPRET_AS_PERMISSION_DIMENSION_SATISFIED":
      return "PERMISSION_DIMENSION_SATISFIED";
    case "INTERPRET_AS_PERMISSION_DIMENSION_UNSATISFIED":
      return "PERMISSION_DIMENSION_UNSATISFIED";
  }
}

/**
 * Exhaustive 105 → 106 semantic mapping. No Evaluation State polarity inference.
 */
export function mapInterpretationBasisAssessmentToSatisfactionState(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment
): AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState {
  assertInterpretationBasisPresentInvariant(assessment);

  switch (assessment.status) {
    case "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED":
      assertPolicyAbsenceInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY";

    case "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE":
      assertNoMappingInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE";

    case "PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT":
      return mapInterpretationToSatisfactionState(
        assessment.permission_dimension_evaluation_state_interpretation_basis!
          .interpretation
      );

    default:
      throw new Error(
        `Permission Dimension Satisfaction State invariant violated: unexpected Interpretation Basis status ${assessment.status} for candidate ${assessment.candidate_key}`
      );
  }
}

function buildSatisfactionStateBasis(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment,
  satisfactionState: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState
): AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasis {
  const evalAssessment = assessment.permission_dimension_evaluation_state_assessment;
  const evalState = evalAssessment.permission_dimension_evaluation_state;
  const evalBasis = evalAssessment.permission_dimension_evaluation_state_basis;
  const policyAssessment =
    assessment.permission_dimension_evaluation_state_interpretation_policy_assessment;
  const interpretationBasis =
    assessment.permission_dimension_evaluation_state_interpretation_basis;
  const policy =
    policyAssessment.permission_dimension_evaluation_state_interpretation_policy;

  if (evalState === null || evalBasis === null) {
    throw new Error(
      `Permission Dimension Satisfaction State invariant violated: applicable domain requires current Evaluation State for candidate ${assessment.candidate_key}`
    );
  }

  let interpretationPolicyKey: string | null = null;
  let interpretationBasisKey: string | null = null;
  let interpretation: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation | null =
    null;

  if (
    satisfactionState === "PERMISSION_DIMENSION_SATISFIED" ||
    satisfactionState === "PERMISSION_DIMENSION_UNSATISFIED"
  ) {
    if (interpretationBasis === null) {
      throw new Error(
        `Permission Dimension Satisfaction State invariant violated: ${satisfactionState} requires non-null Interpretation Basis for candidate ${assessment.candidate_key}`
      );
    }
    if (
      interpretationBasis.permission_dimension_evaluation_state_key !==
        evalState.key ||
      interpretationBasis.permission_dimension_evaluation_state_basis_key !==
        evalBasis.key
    ) {
      throw new Error(
        `Permission Dimension Satisfaction State invariant violated: Interpretation Basis lineage mismatch for candidate ${assessment.candidate_key}`
      );
    }
    if (
      satisfactionState === "PERMISSION_DIMENSION_SATISFIED" &&
      interpretationBasis.interpretation !==
        "INTERPRET_AS_PERMISSION_DIMENSION_SATISFIED"
    ) {
      throw new Error(
        `Permission Dimension Satisfaction State invariant violated: SATISFIED requires INTERPRET_AS_PERMISSION_DIMENSION_SATISFIED for candidate ${assessment.candidate_key}`
      );
    }
    if (
      satisfactionState === "PERMISSION_DIMENSION_UNSATISFIED" &&
      interpretationBasis.interpretation !==
        "INTERPRET_AS_PERMISSION_DIMENSION_UNSATISFIED"
    ) {
      throw new Error(
        `Permission Dimension Satisfaction State invariant violated: UNSATISFIED requires INTERPRET_AS_PERMISSION_DIMENSION_UNSATISFIED for candidate ${assessment.candidate_key}`
      );
    }
    interpretationBasisKey = interpretationBasis.key;
    interpretationPolicyKey =
      interpretationBasis.permission_dimension_evaluation_state_interpretation_policy_key;
    interpretation = interpretationBasis.interpretation;
  } else if (
    satisfactionState ===
    "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY"
  ) {
    if (interpretationBasis !== null || policy !== null) {
      throw new Error(
        `Permission Dimension Satisfaction State invariant violated: NO_POLICY unresolved state must not carry Interpretation Basis or policy for candidate ${assessment.candidate_key}`
      );
    }
  } else if (
    satisfactionState ===
    "UNRESOLVED_NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
  ) {
    if (interpretationBasis !== null) {
      throw new Error(
        `Permission Dimension Satisfaction State invariant violated: NO_MAPPING unresolved state requires null Interpretation Basis for candidate ${assessment.candidate_key}`
      );
    }
    if (policy === null) {
      throw new Error(
        `Permission Dimension Satisfaction State invariant violated: NO_MAPPING unresolved state requires non-null Interpretation Policy for candidate ${assessment.candidate_key}`
      );
    }
    interpretationPolicyKey = policy.key;
  }

  return {
    key: attentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasisKey(
      {
        candidate_key: evalState.candidate_key,
        observation_need_key: evalState.observation_need_key,
        capability_requirement_set_key: evalState.capability_requirement_set_key,
        permission_dimension_satisfaction_state: satisfactionState,
        permission_dimension_evaluation_state_key: evalState.key,
        permission_dimension_evaluation_state_basis_key: evalBasis.key,
        permission_dimension_evaluation_state_interpretation_policy_key:
          interpretationPolicyKey,
        permission_dimension_evaluation_state_interpretation_basis_key:
          interpretationBasisKey,
        interpretation,
        interpretation_basis_status: assessment.status,
      }
    ),
    candidate_key: evalState.candidate_key,
    observation_need_key: evalState.observation_need_key,
    capability_requirement_set_key: evalState.capability_requirement_set_key,
    dimension: "PERMISSION",
    permission_dimension_satisfaction_state: satisfactionState,
    permission_dimension_evaluation_state_key: evalState.key,
    permission_dimension_evaluation_state_basis_key: evalBasis.key,
    permission_dimension_evaluation_state:
      evalState.permission_dimension_evaluation_state,
    permission_dimension_evaluation_state_interpretation_policy_key:
      interpretationPolicyKey,
    permission_dimension_evaluation_state_interpretation_basis_key:
      interpretationBasisKey,
    interpretation,
    interpretation_basis_status: assessment.status,
  };
}

function buildSatisfactionStateRecord(
  basis: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateBasis
): AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateRecord {
  return {
    key: attentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateKey(
      {
        candidate_key: basis.candidate_key,
        observation_need_key: basis.observation_need_key,
        capability_requirement_set_key: basis.capability_requirement_set_key,
        permission_dimension_satisfaction_state:
          basis.permission_dimension_satisfaction_state,
        permission_dimension_satisfaction_state_basis_key: basis.key,
      }
    ),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "PERMISSION",
    permission_dimension_satisfaction_state:
      basis.permission_dimension_satisfaction_state,
    permission_dimension_satisfaction_state_basis_key: basis.key,
  };
}

function assertCandidateSatisfactionAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionStateAssessment
): void {
  const expectedHas =
    assessment.permission_dimension_satisfaction_state !== null;
  if (
    assessment.has_permission_dimension_satisfaction_state !== expectedHas
  ) {
    throw new Error(
      `Permission Dimension Satisfaction State invariant violated: has_state mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "PERMISSION_DIMENSION_SATISFACTION_STATE_PRESENT" &&
    (assessment.permission_dimension_satisfaction_state_basis === null ||
      assessment.permission_dimension_satisfaction_state === null)
  ) {
    throw new Error(
      `Permission Dimension Satisfaction State invariant violated: PRESENT requires non-null Basis and State for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "PERMISSION_DIMENSION_SATISFACTION_STATE_PRESENT" &&
    (assessment.permission_dimension_satisfaction_state_basis !== null ||
      assessment.permission_dimension_satisfaction_state !== null)
  ) {
    throw new Error(
      `Permission Dimension Satisfaction State invariant violated: outer status requires null Basis and State for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure Candidate-level Permission Dimension Satisfaction State.
 *
 * Precedence:
 * 1. outer NOT_APPLICABLE / no OE / not required → no Satisfaction State
 * 2. exact 105 status → one of four canonical Satisfaction States
 * 3. exact Satisfaction Basis + State record
 */
export function assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionState(
  interpretationBasisAssessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationBasisAssessment
): AttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionStateAssessment {
  const candidate_key = interpretationBasisAssessment.candidate_key;

  if (isOuterInterpretationBasisStatus(interpretationBasisAssessment.status)) {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionStateAssessment =
      {
        candidate_key,
        permission_dimension_evaluation_state_interpretation_basis_assessment:
          interpretationBasisAssessment,
        status: mapOuterToSatisfactionStatus(
          interpretationBasisAssessment.status
        ),
        permission_dimension_satisfaction_state_basis: null,
        permission_dimension_satisfaction_state: null,
        has_permission_dimension_satisfaction_state: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateSatisfactionAssessmentInvariant(assessment);
    return assessment;
  }

  const satisfactionState =
    mapInterpretationBasisAssessmentToSatisfactionState(
      interpretationBasisAssessment
    );
  const satisfactionStateBasis = buildSatisfactionStateBasis(
    interpretationBasisAssessment,
    satisfactionState
  );
  const satisfactionStateRecord = buildSatisfactionStateRecord(
    satisfactionStateBasis
  );

  const assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionStateAssessment =
    {
      candidate_key,
      permission_dimension_evaluation_state_interpretation_basis_assessment:
        interpretationBasisAssessment,
      status: "PERMISSION_DIMENSION_SATISFACTION_STATE_PRESENT",
      permission_dimension_satisfaction_state_basis: satisfactionStateBasis,
      permission_dimension_satisfaction_state: satisfactionStateRecord,
      has_permission_dimension_satisfaction_state: true,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateSatisfactionAssessmentInvariant(assessment);
  return assessment;
}

export function buildAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSet(
  input: AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateInput
): AttentionObservationOperationalEligibilityPermissionDimensionSatisfactionStateSetAssessment {
  const interpretationBasisSet =
    input.permission_dimension_evaluation_state_interpretation_basis_set;

  const candidate_assessments =
    interpretationBasisSet.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionSatisfactionState
    );

  return {
    permission_dimension_evaluation_state_interpretation_basis_set:
      interpretationBasisSet,
    candidate_assessments,
    has_permission_dimension_satisfaction_states: candidate_assessments.some(
      (a) => a.has_permission_dimension_satisfaction_state
    ),
    has_resolved_permission_dimension_satisfaction_states:
      candidate_assessments.some(
        (a) =>
          a.permission_dimension_satisfaction_state !== null &&
          isResolvedAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState(
            a.permission_dimension_satisfaction_state
              .permission_dimension_satisfaction_state
          )
      ),
    has_unresolved_permission_dimension_satisfaction_states:
      candidate_assessments.some(
        (a) =>
          a.permission_dimension_satisfaction_state !== null &&
          !isResolvedAttentionObservationOperationalEligibilityPermissionDimensionSatisfactionState(
            a.permission_dimension_satisfaction_state
              .permission_dimension_satisfaction_state
          )
      ),
    has_permission_dimension_satisfied_states: candidate_assessments.some(
      (a) =>
        a.permission_dimension_satisfaction_state
          ?.permission_dimension_satisfaction_state ===
        "PERMISSION_DIMENSION_SATISFIED"
    ),
    has_permission_dimension_unsatisfied_states: candidate_assessments.some(
      (a) =>
        a.permission_dimension_satisfaction_state
          ?.permission_dimension_satisfaction_state ===
        "PERMISSION_DIMENSION_UNSATISFIED"
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
