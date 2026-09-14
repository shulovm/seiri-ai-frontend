/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Dimension
 * Aggregation Readiness Basis types (GROUND-070).
 *
 * Derived only. Not persisted.
 *
 * GROUND-067 Required Dimension Evaluation States
 * + GROUND-069 Requirement Dimension Aggregation Readiness Policy
 * → Requirement Dimension Aggregation Readiness Basis only.
 *
 * Does NOT consume GROUND-068 Requirement Dimension Aggregation Policy.
 *
 * readiness policy condition HOLDS ≠ Requirement aggregation result
 * readiness policy condition DOES_NOT_HOLD ≠ Requirement UNSATISFIED
 * resolved ≠ HOLDS
 * DOES_NOT_HOLD Dimension state is still resolved
 * READY / NOT_READY vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment,
  AttentionObservationCapabilityRequiredDimensionEvaluationState,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment,
  AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
} from "./attention-observation-capability-required-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySetAssessment,
} from "./attention-observation-capability-requirement-dimension-aggregation-readiness-policy-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-067 + GROUND-069 only — not 068 / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessInput {
  capability_required_dimension_evaluation_state_set: AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment;
  capability_requirement_dimension_aggregation_readiness_policy_set: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySetAssessment;
}

/**
 * Exact readiness-policy-condition outcomes only.
 * Not READY / NOT_READY / PASS / FAIL / SATISFIED / UNSATISFIED.
 */
export type AttentionObservationCapabilityRequirementDimensionAggregationReadinessOutcome =
  | "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
  | "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

export type AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedState =
  | "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED"
  | "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED"
  | "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED";

export interface AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedDimensionRef {
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  evaluation_state_basis_key: string;
  unresolved_state: AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedState;
}

export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessBasis {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  evaluation_dimension_policy_key: string;
  readiness_policy_key: string;
  readiness_kind: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind;
  required_dimension_evaluation_state_basis_keys: string[];
  unresolved_dimension_refs: AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedDimensionRef[];
  outcome: AttentionObservationCapabilityRequirementDimensionAggregationReadinessOutcome;
}

export type AttentionObservationCapabilityRequirementDimensionAggregationReadinessStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  | "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT";

export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  dimension_evaluation_state_assessment: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment;
  readiness_policy_assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment;
  status: AttentionObservationCapabilityRequirementDimensionAggregationReadinessStatus;
  readiness_basis: AttentionObservationCapabilityRequirementDimensionAggregationReadinessBasis | null;
}

export type AttentionObservationCapabilityRequirementDimensionAggregationReadinessCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASES_REPRESENTED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASES_PRESENT";

export type AttentionObservationCapabilityRequirementDimensionAggregationReadinessModelLimitation =
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_READINESS_PARTIALITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_READINESS_SCORE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_READINESS_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_IGNORE_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_NON_HOLDING_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_HOLDING_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_RESOLVED_SUBSET_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_THRESHOLD_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_WEIGHTED_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_VETO_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_MAJORITY_AGGREGATION_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment {
  candidate_key: string;
  required_dimension_evaluation_state_assessment: AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment;
  readiness_policy_assessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment;
  status: AttentionObservationCapabilityRequirementDimensionAggregationReadinessCandidateStatus;
  requirement_readiness_assessments: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment[];
  has_capability_requirement_dimension_aggregation_readiness_basis: boolean;
  model_limitations: AttentionObservationCapabilityRequirementDimensionAggregationReadinessModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessSetAssessment {
  capability_required_dimension_evaluation_state_set: AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment;
  capability_requirement_dimension_aggregation_readiness_policy_set: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment[];
  has_capability_requirement_dimension_aggregation_readiness_basis: boolean;
  model_limitations: AttentionObservationCapabilityRequirementDimensionAggregationReadinessModelLimitation[];
}
