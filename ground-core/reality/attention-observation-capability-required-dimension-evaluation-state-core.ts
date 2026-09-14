/**
 * Reality Core v0.7 — Attention Observation Capability Required Dimension
 * Evaluation State (GROUND-067).
 *
 * Pure normalization of GROUND-066 Capability Dimension Source Aggregation Outcome.
 *
 * Must not import GROUND-050–065 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * HOLDS / DOES_NOT_HOLD ≠ PASS / FAIL
 * UNRESOLVED ≠ FAIL
 * Evaluation State ≠ Requirement Satisfaction
 */

import type {
  AttentionObservationCapabilityDimensionSourceAggregationOutcome,
} from "./attention-observation-capability-dimension-source-aggregation-outcome-types.js";
import type {
  AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment,
  AttentionObservationCapabilityDimensionSourceAggregationOutcomeSetAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationStatus,
  AttentionObservationCapabilityRequirementDimensionAggregationAssessment,
} from "./attention-observation-capability-dimension-source-aggregation-outcome-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment,
  AttentionObservationCapabilityRequiredDimensionEvaluationState,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateBasis,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateCandidateStatus,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateInput,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateModelLimitation,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment,
  AttentionObservationCapabilityRequiredDimensionEvaluationAssessment,
  AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
} from "./attention-observation-capability-required-dimension-evaluation-state-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS: AttentionObservationCapabilityRequiredDimensionEvaluationStateModelLimitation[] =
  [
    "CAPABILITY_FINAL_DIMENSION_OUTCOME_NOT_MODELED",
    "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "CAPABILITY_MISSING_CRITERION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_MISSING_SOURCE_AGGREGATION_POLICY_SEMANTICS_NOT_MODELED",
    "CAPABILITY_ZERO_SOURCE_AGGREGATION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_DIMENSION_WEIGHTING_NOT_MODELED",
    "CAPABILITY_DIMENSION_PRIORITY_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
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

export function attentionObservationCapabilityRequiredDimensionEvaluationStateKey(
  capabilityRequirementKey: string,
  requiredDimension: AttentionObservationCapabilityEvaluationDimension,
  state: AttentionObservationCapabilityRequiredDimensionEvaluationState,
  sourceAggregationOutcomeBasisKey: string | null
): string {
  return [
    "attention-observation-capability-required-dimension-evaluation-state",
    capabilityRequirementKey,
    requiredDimension,
    state,
    sourceAggregationOutcomeBasisKey ?? "none",
  ].join("|");
}

function assertSourceAggregationOutcomePresentInvariant(
  assessment: AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment
): void {
  if (
    assessment.status ===
    "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT"
  ) {
    if (assessment.source_aggregation_outcome_basis === null) {
      throw new Error(
        `Source aggregation outcome invariant violated: PRESENT requires non-null outcome basis for dimension ${assessment.required_dimension}`
      );
    }
    return;
  }

  if (assessment.source_aggregation_outcome_basis !== null) {
    throw new Error(
      `Source aggregation outcome invariant violated: non-applicable status requires null outcome basis for dimension ${assessment.required_dimension}`
    );
  }
}

/**
 * Exhaustive 066 → 067 semantic mapping. No fallback coercion.
 */
export function mapSourceAggregationAssessmentToEvaluationState(
  assessment: AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment
): AttentionObservationCapabilityRequiredDimensionEvaluationState {
  assertSourceAggregationOutcomePresentInvariant(assessment);

  switch (assessment.status) {
    case "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED":
      return "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED";

    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION":
      return "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED";

    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY":
      return "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED";

    case "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT": {
      const outcome = assessment.source_aggregation_outcome_basis!.outcome;
      return mapSourceAggregationOutcomeToEvaluationState(outcome);
    }
  }
}

function mapSourceAggregationOutcomeToEvaluationState(
  outcome: AttentionObservationCapabilityDimensionSourceAggregationOutcome
): AttentionObservationCapabilityRequiredDimensionEvaluationState {
  switch (outcome) {
    case "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS":
      return "SOURCE_AGGREGATION_CONDITION_HOLDS";
    case "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD":
      return "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";
  }
}

function buildEvaluationStateBasis(
  capabilityRequirementKey: string,
  observationNeedKey: string,
  assessment: AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment,
  state: AttentionObservationCapabilityRequiredDimensionEvaluationState
): AttentionObservationCapabilityRequiredDimensionEvaluationStateBasis {
  const outcomeBasisKey =
    assessment.source_aggregation_outcome_basis?.key ?? null;

  if (
    state === "SOURCE_AGGREGATION_CONDITION_HOLDS" ||
    state === "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  ) {
    if (outcomeBasisKey === null) {
      throw new Error(
        `Evaluation state invariant violated: resolved state ${state} requires source aggregation outcome basis key for dimension ${assessment.required_dimension}`
      );
    }
  } else if (outcomeBasisKey !== null) {
    throw new Error(
      `Evaluation state invariant violated: unresolved state ${state} requires null source aggregation outcome basis key for dimension ${assessment.required_dimension}`
    );
  }

  return {
    key: attentionObservationCapabilityRequiredDimensionEvaluationStateKey(
      capabilityRequirementKey,
      assessment.required_dimension,
      state,
      outcomeBasisKey
    ),
    capability_requirement_key: capabilityRequirementKey,
    observation_need_key: observationNeedKey,
    required_dimension: assessment.required_dimension,
    state,
    source_aggregation_outcome_basis_key: outcomeBasisKey,
  };
}

function assessRequiredDimensionEvaluation(
  capabilityRequirementKey: string,
  observationNeedKey: string,
  sourceAggregationAssessment: AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment
): AttentionObservationCapabilityRequiredDimensionEvaluationAssessment {
  const state =
    mapSourceAggregationAssessmentToEvaluationState(sourceAggregationAssessment);

  return {
    required_dimension: sourceAggregationAssessment.required_dimension,
    source_aggregation_assessment: sourceAggregationAssessment,
    evaluation_state_basis: buildEvaluationStateBasis(
      capabilityRequirementKey,
      observationNeedKey,
      sourceAggregationAssessment,
      state
    ),
  };
}

function assessRequirementDimensionEvaluationState(
  dimensionAggregationAssessment: AttentionObservationCapabilityRequirementDimensionAggregationAssessment
): AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment {
  const requirement = dimensionAggregationAssessment.capability_requirement;
  const required_dimension_evaluation_assessments =
    dimensionAggregationAssessment.required_dimension_aggregation_assessments.map(
      (aggregationAssessment) =>
        assessRequiredDimensionEvaluation(
          requirement.key,
          requirement.observation_need_key,
          aggregationAssessment
        )
    );

  return {
    capability_requirement: requirement,
    dimension_source_aggregation_assessment: dimensionAggregationAssessment,
    required_dimension_evaluation_assessments,
    has_capability_required_dimension_evaluation_states:
      required_dimension_evaluation_assessments.length > 0,
  };
}

function resolveCandidateEvaluationStateStatus(
  aggregationOutcomeAssessment: AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment,
  hasEvaluationStates: boolean
): AttentionObservationCapabilityRequiredDimensionEvaluationStateCandidateStatus {
  if (
    aggregationOutcomeAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
  }
  if (
    aggregationOutcomeAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
  }
  if (
    aggregationOutcomeAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  ) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES";
  }
  if (
    aggregationOutcomeAssessment.status ===
    "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  ) {
    return "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED";
  }
  if (!hasEvaluationStates) {
    throw new Error(
      `Required dimension evaluation state invariant violated: candidate ${aggregationOutcomeAssessment.candidate_key} has required dimensions but no evaluation states`
    );
  }
  return "CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATES_PRESENT";
}

function hasAnyRequiredDimensionEvaluationStates(
  assessments: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_required_dimension_evaluation_states) {
      return true;
    }
  }
  return false;
}

export function assessAttentionCandidateObservationCapabilityRequiredDimensionEvaluationState(
  aggregationOutcomeAssessment: AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment
): AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment {
  const requirement_dimension_evaluation_state_assessments =
    aggregationOutcomeAssessment.requirement_dimension_aggregation_assessments.map(
      assessRequirementDimensionEvaluationState
    );

  const has_capability_required_dimension_evaluation_states =
    hasAnyRequiredDimensionEvaluationStates(
      requirement_dimension_evaluation_state_assessments
    );

  return {
    candidate_key: aggregationOutcomeAssessment.candidate_key,
    dimension_source_aggregation_outcome_assessment: aggregationOutcomeAssessment,
    status: resolveCandidateEvaluationStateStatus(
      aggregationOutcomeAssessment,
      has_capability_required_dimension_evaluation_states
    ),
    requirement_dimension_evaluation_state_assessments,
    has_capability_required_dimension_evaluation_states,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateRequiredDimensionEvaluationStates(
  assessments: AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_required_dimension_evaluation_states) {
      return true;
    }
  }
  return false;
}

export function buildAttentionObservationCapabilityRequiredDimensionEvaluationStateSet(
  input: AttentionObservationCapabilityRequiredDimensionEvaluationStateInput
): AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment {
  const outcomeSet = input.capability_dimension_source_aggregation_outcome_set;

  const candidate_assessments = outcomeSet.candidate_assessments.map(
    assessAttentionCandidateObservationCapabilityRequiredDimensionEvaluationState
  );

  const has_capability_required_dimension_evaluation_states =
    hasAnyCandidateRequiredDimensionEvaluationStates(candidate_assessments);

  return {
    capability_dimension_source_aggregation_outcome_set: outcomeSet,
    candidate_assessments,
    has_capability_required_dimension_evaluation_states,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
