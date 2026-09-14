/**
 * Reality Core v0.7 — Attention Observation Capability Dimension Source
 * Aggregation Outcome types (GROUND-066).
 *
 * Derived only. Not persisted.
 *
 * GROUND-064 Capability Source Acceptance Match Basis
 * + GROUND-065 Explicit Capability Dimension Source Aggregation Policy
 * → Capability Dimension Source Aggregation Outcome only.
 *
 * HOLDS / DOES_NOT_HOLD ≠ PASS / FAIL ≠ Requirement Satisfaction
 * zero-source ≠ aggregation outcome
 * NOT_REPRESENTED / criterion absent / policy absent preserved separately
 */

import type {
  AttentionObservationCapabilityDimensionSourceAggregationPolicyKind,
} from "./attention-observation-capability-dimension-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment,
  AttentionObservationCapabilityDimensionSourceAggregationPolicySetAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment,
  AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment,
} from "./attention-observation-capability-dimension-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment,
  AttentionObservationCapabilitySourceAcceptanceMatchSetAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment,
  AttentionObservationCapabilityRequirementSourceAcceptanceAssessment,
} from "./attention-observation-capability-source-acceptance-match-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-064 + GROUND-065 — not 062/063 direct / ProjectState.
 */
export interface AttentionObservationCapabilityDimensionSourceAggregationOutcomeInput {
  capability_source_acceptance_match_set: AttentionObservationCapabilitySourceAcceptanceMatchSetAssessment;
  capability_dimension_source_aggregation_policy_set: AttentionObservationCapabilityDimensionSourceAggregationPolicySetAssessment;
}

/**
 * Dimension-relative aggregation-policy condition result only.
 * Not PASS/FAIL / ACCEPTED/REJECTED / SATISFIED/UNSATISFIED.
 */
export type AttentionObservationCapabilityDimensionSourceAggregationOutcome =
  | "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
  | "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD";

export interface AttentionObservationCapabilityDimensionSourceAggregationOutcomeBasis {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  acceptance_criterion_key: string;
  source_aggregation_policy_key: string;
  aggregation_kind: AttentionObservationCapabilityDimensionSourceAggregationPolicyKind;
  source_acceptance_match_basis_keys: string[];
  outcome: AttentionObservationCapabilityDimensionSourceAggregationOutcome;
}

export type AttentionObservationCapabilityRequiredDimensionSourceAggregationStatus =
  | "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY"
  | "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT";

export interface AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment {
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  source_acceptance_assessment: AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment;
  source_aggregation_policy_assessment: AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment;
  status: AttentionObservationCapabilityRequiredDimensionSourceAggregationStatus;
  source_aggregation_outcome_basis: AttentionObservationCapabilityDimensionSourceAggregationOutcomeBasis | null;
}

export interface AttentionObservationCapabilityRequirementDimensionAggregationAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  source_acceptance_assessment: AttentionObservationCapabilityRequirementSourceAcceptanceAssessment;
  source_aggregation_policy_assessment: AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment;
  required_dimension_aggregation_assessments: AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment[];
  has_capability_dimension_source_aggregation_outcome: boolean;
}

export type AttentionObservationCapabilityDimensionSourceAggregationOutcomeCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOMES_REPRESENTED"
  | "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOMES_PRESENT";

export type AttentionObservationCapabilityDimensionSourceAggregationOutcomeModelLimitation =
  | "CAPABILITY_ZERO_SOURCE_AGGREGATION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_DIMENSION_FINAL_OUTCOME_NOT_MODELED"
  | "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_MISSING_CRITERION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_MISSING_SOURCE_AGGREGATION_POLICY_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AGGREGATION_POLICY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_SOURCE_MAJORITY_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_SOURCE_VETO_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_SOURCE_THRESHOLD_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_SOURCE_WEIGHTED_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_SOURCE_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_SOURCE_AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_SOURCE_RECENCY_PRECEDENCE_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment {
  candidate_key: string;
  source_acceptance_match_assessment: AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment;
  source_aggregation_policy_assessment: AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment;
  status: AttentionObservationCapabilityDimensionSourceAggregationOutcomeCandidateStatus;
  requirement_dimension_aggregation_assessments: AttentionObservationCapabilityRequirementDimensionAggregationAssessment[];
  has_capability_dimension_source_aggregation_outcome: boolean;
  model_limitations: AttentionObservationCapabilityDimensionSourceAggregationOutcomeModelLimitation[];
}

export interface AttentionObservationCapabilityDimensionSourceAggregationOutcomeSetAssessment {
  capability_source_acceptance_match_set: AttentionObservationCapabilitySourceAcceptanceMatchSetAssessment;
  capability_dimension_source_aggregation_policy_set: AttentionObservationCapabilityDimensionSourceAggregationPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment[];
  has_capability_dimension_source_aggregation_outcome: boolean;
  model_limitations: AttentionObservationCapabilityDimensionSourceAggregationOutcomeModelLimitation[];
}
