/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Required Dimension Coverage types (GROUND-118).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + GROUND-117 Operational Eligibility AUTHORITY Source Bridge
 * → Required AUTHORITY Dimension Coverage only.
 *
 * required ≠ represented
 * represented ≠ accepted ≠ resolved ≠ Authority positive
 * negative/unresolved AUTHORITY sources still represent AUTHORITY
 * NOT_REPRESENTED ≠ rejected ≠ Authority negative
 * AUTHORITY not required ≠ NOT_REPRESENTED
 * policy absence ≠ AUTHORITY not required
 *
 * No acceptance / resolution / aggregation / OE outcome / can_execute.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-bridge-types.js";

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + GROUND-117 — not GROUND-116 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  authority_source_bridge_set: AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment;
}

/**
 * Binary required-AUTHORITY source representation only.
 * Not PASS / FAIL / ACCEPTED / REJECTED / RESOLVED / positive / negative.
 */
export type AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageValue =
  | "REPRESENTED"
  | "NOT_REPRESENTED";

/**
 * Candidate-level coverage status.
 * REQUIRED_AUTHORITY_DIMENSION_COVERAGE_PRESENT = coverage-record existence only
 * (includes NOT_REPRESENTED records).
 */
export type AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "REQUIRED_AUTHORITY_DIMENSION_COVERAGE_PRESENT";

/**
 * Exact required-AUTHORITY coverage record.
 * REPRESENTED and NOT_REPRESENTED both yield a coverage record.
 */
export interface AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverage {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  operational_eligibility_dimension_policy_key: string;
  coverage: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageValue;
  authority_source_keys: string[];
}

export type AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageModelLimitation =
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "LEGAL_AUTHORITY_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverageAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  authority_source_bridge_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment;
  status: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageStatus;
  authority_required_dimension_coverage: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverage | null;
  has_authority_required_dimension_coverage: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  authority_source_bridge_set: AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverageAssessment[];
  has_authority_required_dimension_coverages: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageModelLimitation[];
}
