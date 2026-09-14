/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Evaluation
 * State types (GROUND-072).
 *
 * Derived only. Not persisted.
 *
 * GROUND-071 Capability Requirement Dimension Aggregation Result
 * → Capability Requirement Evaluation State only.
 *
 * Aggregation HOLDS ≠ SATISFIED
 * Aggregation DOES_NOT_HOLD ≠ UNSATISFIED
 * readiness DOES_NOT_HOLD ≠ aggregation DOES_NOT_HOLD
 * NO_REQUIRED_DIMENSIONS ≠ SATISFIED / UNSATISFIED
 * PASS / FAIL / UNKNOWN vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationResultSetAssessment,
} from "./attention-observation-capability-requirement-dimension-aggregation-result-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-071 only — not 050–070 direct / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementEvaluationStateInput {
  capability_requirement_dimension_aggregation_result_set: AttentionObservationCapabilityRequirementDimensionAggregationResultSetAssessment;
}

/**
 * Unified Capability Requirement evaluation state surface.
 * Not SATISFIED / UNSATISFIED / PARTIALLY_SATISFIED / PASS / FAIL / UNKNOWN.
 */
export type AttentionObservationCapabilityRequirementEvaluationState =
  | "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS"
  | "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  | "UNRESOLVED_CAPABILITY_EVALUATION_DIMENSION_POLICY_NOT_DECLARED"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_DECLARED"
  | "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_NOT_DECLARED"
  | "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

export interface AttentionObservationCapabilityRequirementEvaluationStateBasis {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  state: AttentionObservationCapabilityRequirementEvaluationState;
  requirement_dimension_aggregation_result_basis_key: string | null;
  requirement_dimension_aggregation_readiness_basis_key: string | null;
}

export interface AttentionObservationCapabilityRequirementEvaluationAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  requirement_dimension_aggregation_assessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment;
  evaluation_state_basis: AttentionObservationCapabilityRequirementEvaluationStateBasis;
}

export type AttentionObservationCapabilityRequirementEvaluationStateCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "CAPABILITY_REQUIREMENT_EVALUATION_STATES_PRESENT";

export type AttentionObservationCapabilityRequirementEvaluationStateModelLimitation =
  | "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AGGREGATION_HOLDS_TO_SATISFACTION_MAPPING_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AGGREGATION_DOES_NOT_HOLD_TO_UNSATISFACTION_MAPPING_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_NO_REQUIRED_DIMENSIONS_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_MISSING_EVALUATION_POLICY_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_MISSING_AGGREGATION_POLICY_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_MISSING_READINESS_POLICY_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_READINESS_DOES_NOT_HOLD_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AUTHORITY_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment {
  candidate_key: string;
  requirement_dimension_aggregation_assessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment;
  status: AttentionObservationCapabilityRequirementEvaluationStateCandidateStatus;
  requirement_evaluation_assessments: AttentionObservationCapabilityRequirementEvaluationAssessment[];
  has_capability_requirement_evaluation_states: boolean;
  model_limitations: AttentionObservationCapabilityRequirementEvaluationStateModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementEvaluationStateSetAssessment {
  capability_requirement_dimension_aggregation_result_set: AttentionObservationCapabilityRequirementDimensionAggregationResultSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementEvaluationStateAssessment[];
  has_capability_requirement_evaluation_states: boolean;
  model_limitations: AttentionObservationCapabilityRequirementEvaluationStateModelLimitation[];
}
