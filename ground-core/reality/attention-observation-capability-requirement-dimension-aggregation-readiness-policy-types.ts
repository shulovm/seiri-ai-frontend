/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Dimension
 * Aggregation Readiness Policy types (GROUND-069).
 *
 * Derived only. Not persisted.
 *
 * GROUND-061 Explicit Capability Evaluation Dimension Policy
 * + explicit runtime Requirement Dimension Aggregation Readiness Policy Specification
 * → Explicit Requirement Dimension Aggregation Readiness Policy Foundation only.
 *
 * Sibling of GROUND-068 Requirement Dimension Aggregation Policy.
 * Does NOT consume GROUND-067 Dimension Evaluation States or GROUND-068 Aggregation Policy.
 *
 * Readiness Policy ≠ Readiness Evaluation ≠ Aggregation Result ≠ Requirement Satisfaction
 * resolved ≠ HOLDS
 * DOES_NOT_HOLD is still resolved
 * readiness policy absence ≠ READY ≠ NOT_READY
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
 * Explicit Requirement-level aggregation readiness prerequisite kinds only.
 * Currently one canonical kind: all required Dimension Evaluation States must be
 * resolved before future Requirement aggregation may execute.
 */
export type AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind =
  "REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION";

export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyInput {
  capability_requirement_key: string;
  readiness_kind: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind;
}

export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification {
  policies: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-061 + specification — not 067 / 068 / ProjectState.
 */
export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyEvalInput {
  capability_evaluation_dimension_policy_set: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment;
  specification: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification;
}

/**
 * Runtime-only Requirement-level dimension aggregation readiness policy declaration.
 * Anchored to exact GROUND-061 Evaluation Dimension Policy identity.
 */
export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicy {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  evaluation_dimension_policy_key: string;
  readiness_kind: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind;
}

export type AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT";

export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  evaluation_dimension_policy_assessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment;
  status: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyStatus;
  requirement_dimension_aggregation_readiness_policy: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicy | null;
}

export type AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICIES_DECLARED"
  | "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICIES_PRESENT";

export type AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyModelLimitation =
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_EVALUATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_IGNORE_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_NON_HOLDING_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_HOLDING_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_RESOLVED_SUBSET_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_READINESS_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_AGGREGATION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_THRESHOLD_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_WEIGHTED_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_VETO_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_MAJORITY_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_DIMENSION_PRIORITY_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment {
  candidate_key: string;
  evaluation_dimension_policy_assessment: AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment;
  status: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyCandidateStatus;
  requirement_dimension_aggregation_readiness_policy_assessments: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment[];
  has_explicit_capability_requirement_dimension_aggregation_readiness_policies: boolean;
  model_limitations: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyModelLimitation[];
}

export interface AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySetAssessment {
  capability_evaluation_dimension_policy_set: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment;
  specification: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment[];
  has_explicit_capability_requirement_dimension_aggregation_readiness_policies: boolean;
  model_limitations: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyModelLimitation[];
}
