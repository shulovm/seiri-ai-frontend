/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Acceptance Criteria types (GROUND-120).
 *
 * Derived only. Not persisted.
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit AUTHORITY Source Acceptance Criteria Specification
 * → Explicit AUTHORITY Source Acceptance Criterion only.
 *
 * Independent from GROUND-117 / 118 / 119.
 *
 * criterion declaration ≠ current source
 * accepted value specification ≠ current accepted result
 * POSITIVE is NOT implicitly accepted
 * NEGATIVE / UNRESOLVED are NOT implicitly rejected
 * explicit empty criterion ≠ criterion absence ≠ policy absence
 * criterion absence ≠ accept-any ≠ reject-all
 * acceptance ≠ resolution ≠ aggregation ≠ OE outcome
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue } from "./attention-observation-operational-eligibility-canonical-authority-state-types.js";

/**
 * Specification entry. Context resolves via candidate_key against exact 084
 * assessments; observation_need_key / capability_requirement_set_key / policy
 * key are derived from GROUND-084 policy.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionInput {
  candidate_key: string;
  accepted_canonical_authority_states: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification {
  criteria: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-084 + specification — not 117 / 118 / 119 / ProjectState.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaEvalInput {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification;
}

/**
 * Runtime-only declarative acceptance criterion.
 * No current source keys / resolution / match result.
 */
export interface AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  operational_eligibility_dimension_policy_key: string;
  accepted_canonical_authority_states: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[];
}

export type AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  | "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
  | "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT";

export type AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaModelLimitation =
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

/**
 * Candidate-level declarative criterion assessment.
 * has_explicit_* means criterion-record existence only — not current acceptance.
 */
export interface AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment {
  candidate_key: string;
  operational_eligibility_dimension_policy_assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment;
  status: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionStatus;
  authority_source_acceptance_criterion: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion | null;
  has_explicit_authority_source_acceptance_criterion: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSetAssessment {
  operational_eligibility_dimension_policy_set: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment;
  specification: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment[];
  has_explicit_authority_source_acceptance_criteria: boolean;
  model_limitations: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaModelLimitation[];
}
