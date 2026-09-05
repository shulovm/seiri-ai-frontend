/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Dimension
 * Aggregation Policy types (GROUND-068).
 *
 * Derived only. Not persisted.
 *
 * GROUND-061 Explicit Capability Evaluation Dimension Policy
 * + explicit runtime Requirement Dimension Aggregation Policy Specification
 * → Explicit Requirement Dimension Aggregation Policy Foundation only.
 *
 * Sibling of GROUND-062→067 evaluation path.
 * Does NOT consume GROUND-067 Dimension Evaluation States.
 *
 * Aggregation Policy ≠ Aggregation Result ≠ Requirement Satisfaction
 * ANY / ALL ≠ SATISFIED / UNSATISFIED
 * policy absence ≠ ANY ≠ ALL
 * required_dimensions ≠ implicit ALL
 */

import type {
  AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Explicit Requirement-level aggregation rule kinds only.
 * Refers to future interpretation of SOURCE_AGGREGATION_CONDITION_HOLDS states.
 */
export type AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind =
  | "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
  | "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD";

export interface AttentionObservationCapabilityRequirementDimensionAggregationPolicyInput {
  capability_requirement_key: string;
  aggregation_kind: AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind;
}

export interface AttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification {
  policies: AttentionObservationCapabilityRequirementDimensionAggregationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-061 + specification — not 067 / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementDimensionAggregationPolicyEvalInput {
  capability_evaluation_dimension_policy_set: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment;
  specification: AttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification;
}

/**
 * Runtime-only Requirement-level dimension aggregation policy declaration.
 * Anchored to exact GROUND-061 Evaluation Dimension Policy identity.
 */
export interface AttentionObservationCapabilityRequirementDimensionAggregationPolicy {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  evaluation_dimension_policy_key: string;
  aggregation_kind: AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind;
}

export type AttentionObservationCapabilityRequirementDimensionAggregationPolicyStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT";

export interface AttentionObservationCapabilityRequirementDimensionAggregationPolicyAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  evaluation_dimension_policy_assessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment;
  status: AttentionObservationCapabilityRequirementDimensionAggregationPolicyStatus;
  requirement_dimension_aggregation_policy: AttentionObservationCapabilityRequirementDimensionAggregationPolicy | null;
}

export type AttentionObservationCapabilityRequirementDimensionAggregationPolicyCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICIES_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICIES_PRESENT";

export type AttentionObservationCapabilityRequirementDimensionAggregationPolicyModelLimitation =
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_AGGREGATION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_THRESHOLD_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_WEIGHTED_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_VETO_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_MAJORITY_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_RECENCY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_PRIORITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_WEIGHTING_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementDimensionAggregationPolicyAssessment {
  candidate_key: string;
  evaluation_dimension_policy_assessment: AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment;
  status: AttentionObservationCapabilityRequirementDimensionAggregationPolicyCandidateStatus;
  requirement_dimension_aggregation_policy_assessments: AttentionObservationCapabilityRequirementDimensionAggregationPolicyAssessment[];
  has_explicit_capability_requirement_dimension_aggregation_policies: boolean;
  model_limitations: AttentionObservationCapabilityRequirementDimensionAggregationPolicyModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementDimensionAggregationPolicySetAssessment {
  capability_evaluation_dimension_policy_set: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment;
  specification: AttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementDimensionAggregationPolicyAssessment[];
  has_explicit_capability_requirement_dimension_aggregation_policies: boolean;
  model_limitations: AttentionObservationCapabilityRequirementDimensionAggregationPolicyModelLimitation[];
}
