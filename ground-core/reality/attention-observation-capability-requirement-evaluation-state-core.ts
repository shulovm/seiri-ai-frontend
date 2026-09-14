/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Evaluation
 * State (GROUND-072).
 *
 * Pure normalization of GROUND-071 Capability Requirement Dimension Aggregation Result.
 *
 * Must not import GROUND-050–070 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * Aggregation HOLDS ≠ SATISFIED
 * Aggregation DOES_NOT_HOLD ≠ UNSATISFIED
 * readiness DOES_NOT_HOLD ≠ aggregation DOES_NOT_HOLD
 * NO_REQUIRED_DIMENSIONS ≠ SATISFIED / UNSATISFIED
 */

import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationOutcome,
  AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationResultSetAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationResultStatus,
} from "./attention-observation-capability-requirement-dimension-aggregation-result-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment,
  AttentionObservationCapabilityRequirementEvaluationAssessment,
  AttentionObservationCapabilityRequirementEvaluationState,
  AttentionObservationCapabilityRequirementEvaluationStateBasis,
  AttentionObservationCapabilityRequirementEvaluationStateCandidateStatus,
  AttentionObservationCapabilityRequirementEvaluationStateInput,
  AttentionObservationCapabilityRequirementEvaluationStateModelLimitation,
  AttentionObservationCapabilityRequirementEvaluationStateSetAssessment,
} from "./attention-observation-capability-requirement-evaluation-state-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_EVALUATION_STATE_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementEvaluationStateModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AGGREGATION_HOLDS_TO_SATISFACTION_MAPPING_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AGGREGATION_DOES_NOT_HOLD_TO_UNSATISFACTION_MAPPING_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_NO_REQUIRED_DIMENSIONS_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_MISSING_EVALUATION_POLICY_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_MISSING_AGGREGATION_POLICY_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_MISSING_READINESS_POLICY_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_READINESS_DOES_NOT_HOLD_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PROVENANCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AUTHORITY_NOT_MODELED",
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

export function attentionObservationCapabilityRequirementEvaluationStateKey(
  capabilityRequirementKey: string,
  state: AttentionObservationCapabilityRequirementEvaluationState,
  aggregationResultBasisKey: string | null,
  readinessBasisKey: string | null
): string {
  return [
    "attention-observation-capability-requirement-evaluation-state",
    capabilityRequirementKey,
    state,
    aggregationResultBasisKey ?? "none",
    readinessBasisKey ?? "none",
  ].join("|");
}

function assertAggregationResultPresentInvariant(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment
): void {
  if (
    assessment.status ===
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT"
  ) {
    if (assessment.aggregation_result_basis === null) {
      throw new Error(
        `Requirement Dimension Aggregation Result invariant violated: PRESENT requires non-null aggregation result basis for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    return;
  }

  if (assessment.aggregation_result_basis !== null) {
    throw new Error(
      `Requirement Dimension Aggregation Result invariant violated: non-applicable status requires null aggregation result basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function assertReadinessDoesNotHoldLineage(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment
): void {
  const readiness =
    assessment.requirement_dimension_aggregation_readiness_assessment;
  if (
    readiness.status !==
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT"
  ) {
    throw new Error(
      `Requirement Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires readiness basis PRESENT for capability requirement ${assessment.capability_requirement.key}`
    );
  }
  if (readiness.readiness_basis === null) {
    throw new Error(
      `Requirement Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires non-null readiness basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }
  if (
    readiness.readiness_basis.outcome !==
    "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    throw new Error(
      `Requirement Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires readiness outcome DOES_NOT_HOLD for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function assertMissingReadinessPolicyInvariant(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment
): void {
  const readiness =
    assessment.requirement_dimension_aggregation_readiness_assessment;
  if (
    readiness.status ===
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT" ||
    readiness.readiness_basis !== null
  ) {
    throw new Error(
      `Requirement Evaluation State invariant violated: missing readiness policy status must not carry readiness basis PRESENT for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function mapAggregationOutcomeToEvaluationState(
  outcome: AttentionObservationCapabilityRequirementDimensionAggregationOutcome
): AttentionObservationCapabilityRequirementEvaluationState {
  switch (outcome) {
    case "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS":
      return "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS";
    case "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD":
      return "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD";
  }
}

/**
 * Exhaustive 071 → 072 semantic mapping. No fallback coercion.
 */
export function mapRequirementDimensionAggregationAssessmentToEvaluationState(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment
): AttentionObservationCapabilityRequirementEvaluationState {
  assertAggregationResultPresentInvariant(assessment);

  const status: AttentionObservationCapabilityRequirementDimensionAggregationResultStatus =
    assessment.status;

  switch (status) {
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY":
      return "UNRESOLVED_CAPABILITY_EVALUATION_DIMENSION_POLICY_NOT_DECLARED";

    case "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS":
      return "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED";

    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY":
      return "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_DECLARED";

    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY":
      assertMissingReadinessPolicyInvariant(assessment);
      return "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_NOT_DECLARED";

    case "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD":
      assertReadinessDoesNotHoldLineage(assessment);
      return "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

    case "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT":
      return mapAggregationOutcomeToEvaluationState(
        assessment.aggregation_result_basis!.outcome
      );
  }
}

function buildEvaluationStateBasis(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment,
  state: AttentionObservationCapabilityRequirementEvaluationState
): AttentionObservationCapabilityRequirementEvaluationStateBasis {
  const aggregationResultBasisKey =
    assessment.aggregation_result_basis?.key ?? null;
  const readinessBasisKey =
    assessment.requirement_dimension_aggregation_readiness_assessment
      .readiness_basis?.key ?? null;

  if (
    state === "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS" ||
    state === "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  ) {
    if (aggregationResultBasisKey === null) {
      throw new Error(
        `Requirement Evaluation State invariant violated: resolved aggregation state ${state} requires aggregation result basis key for capability requirement ${assessment.capability_requirement.key}`
      );
    }
  }

  if (
    state ===
    "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    if (aggregationResultBasisKey !== null) {
      throw new Error(
        `Requirement Evaluation State invariant violated: readiness-unresolved state requires null aggregation result basis key for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    if (readinessBasisKey === null) {
      throw new Error(
        `Requirement Evaluation State invariant violated: readiness-unresolved state requires readiness basis key for capability requirement ${assessment.capability_requirement.key}`
      );
    }
  }

  if (
    state ===
      "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_NOT_DECLARED" &&
    readinessBasisKey !== null
  ) {
    throw new Error(
      `Requirement Evaluation State invariant violated: missing readiness policy state must not synthesize readiness basis key for capability requirement ${assessment.capability_requirement.key}`
    );
  }

  if (
    (state ===
      "UNRESOLVED_CAPABILITY_EVALUATION_DIMENSION_POLICY_NOT_DECLARED" ||
      state === "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED" ||
      state ===
        "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_DECLARED" ||
      state ===
        "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_NOT_DECLARED") &&
    aggregationResultBasisKey !== null
  ) {
    throw new Error(
      `Requirement Evaluation State invariant violated: non-result state ${state} must not carry aggregation result basis key for capability requirement ${assessment.capability_requirement.key}`
    );
  }

  return {
    key: attentionObservationCapabilityRequirementEvaluationStateKey(
      assessment.capability_requirement.key,
      state,
      aggregationResultBasisKey,
      readinessBasisKey
    ),
    capability_requirement_key: assessment.capability_requirement.key,
    observation_need_key:
      assessment.capability_requirement.observation_need_key,
    state,
    requirement_dimension_aggregation_result_basis_key:
      aggregationResultBasisKey,
    requirement_dimension_aggregation_readiness_basis_key: readinessBasisKey,
  };
}

function assessRequirementEvaluation(
  aggregationAssessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment
): AttentionObservationCapabilityRequirementEvaluationAssessment {
  const state =
    mapRequirementDimensionAggregationAssessmentToEvaluationState(
      aggregationAssessment
    );

  return {
    capability_requirement: aggregationAssessment.capability_requirement,
    requirement_dimension_aggregation_assessment: aggregationAssessment,
    evaluation_state_basis: buildEvaluationStateBasis(
      aggregationAssessment,
      state
    ),
  };
}

function resolveCandidateEvaluationStateStatus(
  aggregationAssessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment,
  hasEvaluationStates: boolean
): AttentionObservationCapabilityRequirementEvaluationStateCandidateStatus {
  if (
    aggregationAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
  }
  if (
    aggregationAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
  }
  if (!hasEvaluationStates) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
  }
  return "CAPABILITY_REQUIREMENT_EVALUATION_STATES_PRESENT";
}

export function assessAttentionCandidateObservationCapabilityRequirementEvaluationState(
  aggregationAssessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment
): AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment {
  const requirement_evaluation_assessments =
    aggregationAssessment.requirement_aggregation_assessments.map(
      assessRequirementEvaluation
    );

  const has_capability_requirement_evaluation_states =
    requirement_evaluation_assessments.length > 0;

  return {
    candidate_key: aggregationAssessment.candidate_key,
    requirement_dimension_aggregation_assessment: aggregationAssessment,
    status: resolveCandidateEvaluationStateStatus(
      aggregationAssessment,
      has_capability_requirement_evaluation_states
    ),
    requirement_evaluation_assessments,
    has_capability_requirement_evaluation_states,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateRequirementEvaluationStates(
  assessments: AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_requirement_evaluation_states) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Capability Requirement Evaluation State composition.
 * Does not derive Capability Requirement Satisfaction / Unsatisfaction.
 */
export function buildAttentionObservationCapabilityRequirementEvaluationStateSet(
  input: AttentionObservationCapabilityRequirementEvaluationStateInput
): AttentionObservationCapabilityRequirementEvaluationStateSetAssessment {
  const aggregationResultSet: AttentionObservationCapabilityRequirementDimensionAggregationResultSetAssessment =
    input.capability_requirement_dimension_aggregation_result_set;

  const candidate_assessments =
    aggregationResultSet.candidate_assessments.map(
      assessAttentionCandidateObservationCapabilityRequirementEvaluationState
    );

  return {
    capability_requirement_dimension_aggregation_result_set:
      aggregationResultSet,
    candidate_assessments,
    has_capability_requirement_evaluation_states:
      hasAnyCandidateRequirementEvaluationStates(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
