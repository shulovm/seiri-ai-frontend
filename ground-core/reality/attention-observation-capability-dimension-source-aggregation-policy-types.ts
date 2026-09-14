/**
 * Reality Core v0.7 — Attention Observation Capability Dimension Source
 * Aggregation Policy types (GROUND-065).
 *
 * Derived only. Not persisted.
 *
 * GROUND-063 Explicit Capability Dimension Acceptance Criteria
 * + explicit runtime Source Aggregation Policy Specification
 * → Explicit Capability Dimension Source Aggregation Policy Foundation only.
 *
 * Sibling of GROUND-064 Source Acceptance Match.
 * Does NOT consume GROUND-060 / 061 / 062 / 064.
 *
 * Aggregation Policy ≠ Aggregation Result ≠ Dimension Outcome
 * ANY / ALL ≠ PASS / FAIL
 * policy absence ≠ ANY ≠ ALL
 */

import type {
  AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment,
  AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment,
  AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment,
} from "./attention-observation-capability-dimension-acceptance-criteria-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Explicit source-level LISTED / NOT_LISTED aggregation rule kinds only.
 * No MAJORITY / VETO / LATEST / WEIGHTED / THRESHOLD.
 */
export type AttentionObservationCapabilityDimensionSourceAggregationPolicyKind =
  | "ANY_SOURCE_LISTED_AS_ACCEPTABLE"
  | "ALL_SOURCES_LISTED_AS_ACCEPTABLE";

export interface AttentionObservationCapabilityDimensionSourceAggregationPolicyInput {
  capability_requirement_key: string;
  dimension: AttentionObservationCapabilityEvaluationDimension;
  aggregation_kind: AttentionObservationCapabilityDimensionSourceAggregationPolicyKind;
}

export interface AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification {
  policies: AttentionObservationCapabilityDimensionSourceAggregationPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-063 + specification — not 064 / ProjectState.
 */
export interface AttentionObservationCapabilityDimensionSourceAggregationPolicyEvalInput {
  capability_dimension_acceptance_criteria_set: AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment;
  specification: AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification;
}

/**
 * Runtime-only source aggregation policy declaration.
 * Anchored to exact GROUND-063 Acceptance Criterion.
 */
export interface AttentionObservationCapabilityDimensionSourceAggregationPolicy {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  dimension: AttentionObservationCapabilityEvaluationDimension;
  acceptance_criterion_key: string;
  aggregation_kind: AttentionObservationCapabilityDimensionSourceAggregationPolicyKind;
}

export type AttentionObservationCapabilityDimensionSourceAggregationPolicyStatus =
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
  | "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_DECLARED"
  | "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_PRESENT";

export interface AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment {
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  acceptance_criterion_assessment: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment;
  status: AttentionObservationCapabilityDimensionSourceAggregationPolicyStatus;
  source_aggregation_policy: AttentionObservationCapabilityDimensionSourceAggregationPolicy | null;
}

export type AttentionObservationCapabilitySourceAggregationPolicyRequirementStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICIES_DECLARED"
  | "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICIES_PRESENT";

export interface AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  acceptance_criteria_assessment: AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment;
  status: AttentionObservationCapabilitySourceAggregationPolicyRequirementStatus;
  required_dimension_source_aggregation_policy_assessments: AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment[];
  has_explicit_capability_dimension_source_aggregation_policies: boolean;
}

export type AttentionObservationCapabilityDimensionSourceAggregationPolicyCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICIES_DECLARED"
  | "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICIES_PRESENT";

export type AttentionObservationCapabilityDimensionSourceAggregationPolicyModelLimitation =
  | "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED"
  | "CAPABILITY_SOURCE_ACCEPTANCE_OUTCOME_NOT_MODELED"
  | "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_MISSING_CRITERION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_ZERO_SOURCE_AGGREGATION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_SOURCE_MAJORITY_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_SOURCE_VETO_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_SOURCE_THRESHOLD_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_SOURCE_WEIGHTED_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_SOURCE_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_SOURCE_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_SOURCE_RECENCY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AGGREGATION_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment {
  candidate_key: string;
  acceptance_criteria_assessment: AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment;
  status: AttentionObservationCapabilityDimensionSourceAggregationPolicyCandidateStatus;
  requirement_source_aggregation_policy_assessments: AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment[];
  has_explicit_capability_dimension_source_aggregation_policies: boolean;
  model_limitations: AttentionObservationCapabilityDimensionSourceAggregationPolicyModelLimitation[];
}

export interface AttentionObservationCapabilityDimensionSourceAggregationPolicySetAssessment {
  capability_dimension_acceptance_criteria_set: AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment;
  specification: AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment[];
  has_explicit_capability_dimension_source_aggregation_policies: boolean;
  model_limitations: AttentionObservationCapabilityDimensionSourceAggregationPolicyModelLimitation[];
}
