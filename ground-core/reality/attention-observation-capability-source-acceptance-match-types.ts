/**
 * Reality Core v0.7 — Attention Observation Capability Source Acceptance Match
 * types (GROUND-064).
 *
 * Derived only. Not persisted.
 *
 * GROUND-062 Required Dimension Coverage
 * + GROUND-063 Explicit Dimension Acceptance Criteria
 * → Capability Source Acceptance Match Basis only.
 *
 * LISTED / NOT_LISTED ≠ PASS / FAIL ≠ Dimension Outcome
 * NOT_REPRESENTED ≠ NOT_LISTED
 * criterion absent ≠ NOT_LISTED
 * Source Acceptance Match ≠ Requirement Satisfaction
 */

import type { CapabilityAvailabilityStatus } from "../types.js";
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
  AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment,
  AttentionObservationCapabilityRequiredDimensionCoverageBasis,
  AttentionObservationCapabilityRequiredDimensionCoverageSetAssessment,
  AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
  AttentionObservationCapabilityRequirementRequiredDimensionCoverageAssessment,
} from "./attention-observation-capability-required-dimension-coverage-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus,
} from "./attention-observation-capability-scope-applicability-types.js";
import type {
  AttentionObservationCapabilityDeclarationTemporalRelation,
} from "./attention-observation-capability-declaration-temporal-applicability-types.js";
import type {
  AttentionObservationCapabilityVerificationTemporalRelation,
} from "./attention-observation-capability-verification-temporal-applicability-types.js";
import type {
  AttentionObservationCapabilityAvailabilityTemporalRelation,
} from "./attention-observation-capability-availability-temporal-applicability-types.js";

/**
 * Combined evaluation input.
 * Consumes 062 + 063 — not 060/061 direct / ProjectState.
 */
export interface AttentionObservationCapabilitySourceAcceptanceMatchInput {
  required_dimension_coverage_set: AttentionObservationCapabilityRequiredDimensionCoverageSetAssessment;
  dimension_acceptance_criteria_set: AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment;
}

/**
 * Source-level criterion-membership relation only.
 * Not MATCH/MISMATCH / PASS/FAIL / ACCEPTED/REJECTED.
 */
export type AttentionObservationCapabilitySourceAcceptanceRelation =
  | "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
  | "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE";

/**
 * Canonical criterion-comparable represented source value.
 * Separate from source identity (062 ref).
 */
export type AttentionObservationCapabilityRepresentedDimensionSourceValue =
  | {
      dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH";
      value_kind: "REPRESENTED_BASIS";
    }
  | {
      dimension: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT";
      value_kind: "REPRESENTED_BASIS";
    }
  | {
      dimension: "CAPABILITY_SCOPE_APPLICABILITY";
      value_kind: "SCOPE_APPLICABILITY_POSITION_STATUS";
      position_status: AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus;
    }
  | {
      dimension: "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT";
      value_kind: "REPRESENTED_BASIS";
    }
  | {
      dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY";
      value_kind: "DECLARATION_TEMPORAL_RELATION";
      relation: AttentionObservationCapabilityDeclarationTemporalRelation;
    }
  | {
      dimension: "CAPABILITY_VERIFICATION_REPRESENTATION";
      value_kind: "REPRESENTED_BASIS";
    }
  | {
      dimension: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY";
      value_kind: "VERIFICATION_TEMPORAL_RELATION";
      relation: AttentionObservationCapabilityVerificationTemporalRelation;
    }
  | {
      dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION";
      value_kind: "AVAILABILITY_RAW_STATUS";
      raw_availability_status: CapabilityAvailabilityStatus;
    }
  | {
      dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY";
      value_kind: "AVAILABILITY_TEMPORAL_PAIR";
      relation: AttentionObservationCapabilityAvailabilityTemporalRelation;
      raw_availability_status: CapabilityAvailabilityStatus;
    };

/**
 * One exact represented source × explicit criterion membership comparison.
 */
export interface AttentionObservationCapabilitySourceAcceptanceMatchBasis {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  coverage_basis_key: string;
  acceptance_criterion_key: string;
  represented_basis_ref: AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef;
  represented_source_value: AttentionObservationCapabilityRepresentedDimensionSourceValue;
  relation: AttentionObservationCapabilitySourceAcceptanceRelation;
}

export type AttentionObservationCapabilityRequiredDimensionSourceAcceptanceStatus =
  | "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
  | "CAPABILITY_SOURCE_ACCEPTANCE_MATCH_BASIS_PRESENT";

export interface AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment {
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  required_dimension_coverage_basis: AttentionObservationCapabilityRequiredDimensionCoverageBasis;
  acceptance_criterion_assessment: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment;
  status: AttentionObservationCapabilityRequiredDimensionSourceAcceptanceStatus;
  source_acceptance_match_bases: AttentionObservationCapabilitySourceAcceptanceMatchBasis[];
}

export interface AttentionObservationCapabilityRequirementSourceAcceptanceAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  required_dimension_coverage_assessment: AttentionObservationCapabilityRequirementRequiredDimensionCoverageAssessment;
  acceptance_criteria_assessment: AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment;
  required_dimension_source_acceptance_assessments: AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment[];
  has_capability_source_acceptance_match_basis: boolean;
}

export type AttentionObservationCapabilitySourceAcceptanceMatchCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_CAPABILITY_SOURCE_ACCEPTANCE_MATCH_BASIS_REPRESENTED"
  | "CAPABILITY_SOURCE_ACCEPTANCE_MATCH_BASIS_PRESENT";

export type AttentionObservationCapabilitySourceAcceptanceMatchModelLimitation =
  | "CAPABILITY_SOURCE_ACCEPTANCE_OUTCOME_NOT_MODELED"
  | "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED"
  | "CAPABILITY_DIMENSION_MULTI_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "CAPABILITY_DIMENSION_MULTI_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_MISSING_CRITERION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_AGGREGATION_POLICY_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_CONFLICT_RESOLUTION_NOT_MODELED"
  | "CAPABILITY_SCOPE_NON_EXACT_APPLICABILITY_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment {
  candidate_key: string;
  required_dimension_coverage_assessment: AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment;
  acceptance_criteria_assessment: AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment;
  status: AttentionObservationCapabilitySourceAcceptanceMatchCandidateStatus;
  requirement_source_acceptance_assessments: AttentionObservationCapabilityRequirementSourceAcceptanceAssessment[];
  has_capability_source_acceptance_match_basis: boolean;
  model_limitations: AttentionObservationCapabilitySourceAcceptanceMatchModelLimitation[];
}

export interface AttentionObservationCapabilitySourceAcceptanceMatchSetAssessment {
  required_dimension_coverage_set: AttentionObservationCapabilityRequiredDimensionCoverageSetAssessment;
  dimension_acceptance_criteria_set: AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment[];
  has_capability_source_acceptance_match_basis: boolean;
  model_limitations: AttentionObservationCapabilitySourceAcceptanceMatchModelLimitation[];
}
