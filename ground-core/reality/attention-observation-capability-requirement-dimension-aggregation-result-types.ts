/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Dimension
 * Aggregation Result types (GROUND-071).
 *
 * Derived only. Not persisted.
 *
 * GROUND-067 Required Dimension Evaluation States
 * + GROUND-068 Requirement Dimension Aggregation Policy
 * + GROUND-070 Requirement Dimension Aggregation Readiness Basis
 * → Capability Requirement Dimension Aggregation Result only.
 *
 * Does NOT consume GROUND-069 directly.
 *
 * Requirement aggregation condition HOLDS ≠ Capability Requirement SATISFIED
 * Requirement aggregation condition DOES_NOT_HOLD ≠ UNSATISFIED
 * readiness DOES_NOT_HOLD ≠ aggregation DOES_NOT_HOLD
 * READY / PASS / FAIL vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment,
  AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
} from "./attention-observation-capability-required-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind,
  AttentionObservationCapabilityRequirementDimensionAggregationPolicySetAssessment,
} from "./attention-observation-capability-requirement-dimension-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessSetAssessment,
} from "./attention-observation-capability-requirement-dimension-aggregation-readiness-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-067 + 068 + 070 — not 069 direct / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementDimensionAggregationResultInput {
  capability_required_dimension_evaluation_state_set: AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment;
  capability_requirement_dimension_aggregation_policy_set: AttentionObservationCapabilityRequirementDimensionAggregationPolicySetAssessment;
  capability_requirement_dimension_aggregation_readiness_set: AttentionObservationCapabilityRequirementDimensionAggregationReadinessSetAssessment;
}

/**
 * Exact Requirement-level aggregation-condition outcomes only.
 * Not SATISFIED / UNSATISFIED / PASS / FAIL / READY / NOT_READY.
 */
export type AttentionObservationCapabilityRequirementDimensionAggregationOutcome =
  | "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
  | "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD";

export interface AttentionObservationCapabilityRequirementDimensionAggregationResultBasis {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  evaluation_dimension_policy_key: string;
  requirement_dimension_aggregation_policy_key: string;
  requirement_dimension_aggregation_readiness_basis_key: string;
  aggregation_kind: AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind;
  required_dimension_evaluation_state_basis_keys: string[];
  outcome: AttentionObservationCapabilityRequirementDimensionAggregationOutcome;
}

export type AttentionObservationCapabilityRequirementDimensionAggregationResultStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  | "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY"
  | "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT";

/**
 * Per-Requirement aggregation result assessment (GROUND-071).
 * Named *ResultAssessment to avoid collision with GROUND-066
 * AttentionObservationCapabilityRequirementDimensionAggregationAssessment.
 */
export interface AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  required_dimension_evaluation_state_assessment: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment;
  requirement_dimension_aggregation_policy_assessment: AttentionObservationCapabilityRequirementDimensionAggregationPolicyAssessment;
  requirement_dimension_aggregation_readiness_assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment;
  status: AttentionObservationCapabilityRequirementDimensionAggregationResultStatus;
  aggregation_result_basis: AttentionObservationCapabilityRequirementDimensionAggregationResultBasis | null;
}

export type AttentionObservationCapabilityRequirementDimensionAggregationResultCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_REPRESENTED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_PRESENT";

export type AttentionObservationCapabilityRequirementDimensionAggregationResultModelLimitation =
  | "CAPABILITY_REQUIREMENT_EVALUATION_STATE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AGGREGATION_RESULT_TO_SATISFACTION_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_READINESS_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AGGREGATION_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_AGGREGATION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_RESOLVED_SUBSET_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_THRESHOLD_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_WEIGHTED_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_VETO_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_MAJORITY_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_RECENCY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment {
  candidate_key: string;
  required_dimension_evaluation_state_assessment: AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment;
  requirement_dimension_aggregation_policy_assessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationPolicyAssessment;
  requirement_dimension_aggregation_readiness_assessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment;
  status: AttentionObservationCapabilityRequirementDimensionAggregationResultCandidateStatus;
  requirement_aggregation_assessments: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment[];
  has_capability_requirement_dimension_aggregation_result: boolean;
  model_limitations: AttentionObservationCapabilityRequirementDimensionAggregationResultModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementDimensionAggregationResultSetAssessment {
  capability_required_dimension_evaluation_state_set: AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment;
  capability_requirement_dimension_aggregation_policy_set: AttentionObservationCapabilityRequirementDimensionAggregationPolicySetAssessment;
  capability_requirement_dimension_aggregation_readiness_set: AttentionObservationCapabilityRequirementDimensionAggregationReadinessSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment[];
  has_capability_requirement_dimension_aggregation_result: boolean;
  model_limitations: AttentionObservationCapabilityRequirementDimensionAggregationResultModelLimitation[];
}
