/**
 * Reality Core v0.7 — Attention Observation Capability Required Dimension
 * Evaluation State types (GROUND-067).
 *
 * Derived only. Not persisted.
 *
 * GROUND-066 Capability Dimension Source Aggregation Outcome
 * → Required Capability Dimension Evaluation State only.
 *
 * HOLDS / DOES_NOT_HOLD ≠ PASS / FAIL
 * UNRESOLVED ≠ FAIL
 * Evaluation State ≠ Requirement Satisfaction
 */

import type {
  AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment,
  AttentionObservationCapabilityDimensionSourceAggregationOutcomeSetAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationAssessment,
} from "./attention-observation-capability-dimension-source-aggregation-outcome-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-066 only — not 062/063/064/065 direct / ProjectState.
 */
export interface AttentionObservationCapabilityRequiredDimensionEvaluationStateInput {
  capability_dimension_source_aggregation_outcome_set: AttentionObservationCapabilityDimensionSourceAggregationOutcomeSetAssessment;
}

/**
 * Unified required-dimension evaluation state surface.
 * Not PASS/FAIL / SATISFIED/UNSATISFIED / UNKNOWN.
 */
export type AttentionObservationCapabilityRequiredDimensionEvaluationState =
  | "SOURCE_AGGREGATION_CONDITION_HOLDS"
  | "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  | "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED"
  | "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED"
  | "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED";

export interface AttentionObservationCapabilityRequiredDimensionEvaluationStateBasis {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  state: AttentionObservationCapabilityRequiredDimensionEvaluationState;
  source_aggregation_outcome_basis_key: string | null;
}

export interface AttentionObservationCapabilityRequiredDimensionEvaluationAssessment {
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  source_aggregation_assessment: AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment;
  evaluation_state_basis: AttentionObservationCapabilityRequiredDimensionEvaluationStateBasis;
}

export interface AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  dimension_source_aggregation_assessment: AttentionObservationCapabilityRequirementDimensionAggregationAssessment;
  required_dimension_evaluation_assessments: AttentionObservationCapabilityRequiredDimensionEvaluationAssessment[];
  has_capability_required_dimension_evaluation_states: boolean;
}

export type AttentionObservationCapabilityRequiredDimensionEvaluationStateCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "CAPABILITY_REQUIRED_DIMENSION_EVALUATION_STATES_PRESENT";

export type AttentionObservationCapabilityRequiredDimensionEvaluationStateModelLimitation =
  | "CAPABILITY_FINAL_DIMENSION_OUTCOME_NOT_MODELED"
  | "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_MISSING_CRITERION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_MISSING_SOURCE_AGGREGATION_POLICY_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_ZERO_SOURCE_AGGREGATION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_DIMENSION_WEIGHTING_NOT_MODELED"
  | "CAPABILITY_DIMENSION_PRIORITY_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment {
  candidate_key: string;
  dimension_source_aggregation_outcome_assessment: AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment;
  status: AttentionObservationCapabilityRequiredDimensionEvaluationStateCandidateStatus;
  requirement_dimension_evaluation_state_assessments: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment[];
  has_capability_required_dimension_evaluation_states: boolean;
  model_limitations: AttentionObservationCapabilityRequiredDimensionEvaluationStateModelLimitation[];
}

export interface AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment {
  capability_dimension_source_aggregation_outcome_set: AttentionObservationCapabilityDimensionSourceAggregationOutcomeSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment[];
  has_capability_required_dimension_evaluation_states: boolean;
  model_limitations: AttentionObservationCapabilityRequiredDimensionEvaluationStateModelLimitation[];
}
