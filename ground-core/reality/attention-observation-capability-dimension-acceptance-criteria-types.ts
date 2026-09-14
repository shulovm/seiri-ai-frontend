/**
 * Reality Core v0.7 — Attention Observation Capability Dimension Acceptance Criteria
 * types (GROUND-063).
 *
 * Derived only. Not persisted.
 *
 * GROUND-061 Explicit Capability Evaluation Dimension Policy
 * + explicit runtime Acceptance Criteria Specification
 * → Explicit Capability Dimension Acceptance Criteria Foundation only.
 *
 * Sibling of GROUND-062 Required Dimension Coverage.
 * Does NOT consume GROUND-060 / GROUND-062.
 *
 * Acceptance Criterion ≠ Dimension Outcome ≠ current represented value
 * criterion absence ≠ empty accepted set ≠ accept-any ≠ reject-all
 * Acceptance Criteria ≠ Capability Requirement Satisfaction
 */

import type { CapabilityAvailabilityStatus } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  AttentionObservationCapabilityEvaluationDimension,
  AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
  CanonicalCapabilitySemanticKey,
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

/** Presence-only accepted represented-basis class. Not missing-basis semantics. */
export type AttentionObservationCapabilityDimensionPresenceAcceptanceCriterionKind =
  "ANY_REPRESENTED_BASIS_ACCEPTABLE";

export interface StructuralCapabilityDeclarationMatchAcceptanceCriterion {
  dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH";
  criterion_kind: AttentionObservationCapabilityDimensionPresenceAcceptanceCriterionKind;
}

export interface ExplicitCapabilityScopeRequirementAcceptanceCriterion {
  dimension: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT";
  criterion_kind: AttentionObservationCapabilityDimensionPresenceAcceptanceCriterionKind;
}

export interface CapabilityScopeApplicabilityAcceptanceCriterion {
  dimension: "CAPABILITY_SCOPE_APPLICABILITY";
  accepted_position_statuses: AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus[];
}

export interface ExplicitCapabilityTemporalRequirementAcceptanceCriterion {
  dimension: "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT";
  criterion_kind: AttentionObservationCapabilityDimensionPresenceAcceptanceCriterionKind;
}

export interface CapabilityDeclarationTemporalApplicabilityAcceptanceCriterion {
  dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY";
  accepted_relations: AttentionObservationCapabilityDeclarationTemporalRelation[];
}

export interface CapabilityVerificationRepresentationAcceptanceCriterion {
  dimension: "CAPABILITY_VERIFICATION_REPRESENTATION";
  criterion_kind: AttentionObservationCapabilityDimensionPresenceAcceptanceCriterionKind;
}

export interface CapabilityVerificationTemporalApplicabilityAcceptanceCriterion {
  dimension: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY";
  accepted_relations: AttentionObservationCapabilityVerificationTemporalRelation[];
}

export interface CapabilityAvailabilityRepresentationAcceptanceCriterion {
  dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION";
  accepted_raw_statuses: CapabilityAvailabilityStatus[];
}

/**
 * Atomic Availability Temporal accepted pair.
 * Avoids silent Cartesian/conjunction of independent relation/status arrays.
 */
export interface AttentionObservationCapabilityAvailabilityTemporalAcceptedPair {
  relation: AttentionObservationCapabilityAvailabilityTemporalRelation;
  raw_availability_status: CapabilityAvailabilityStatus;
}

export interface CapabilityAvailabilityTemporalApplicabilityAcceptanceCriterion {
  dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY";
  accepted_pairs: AttentionObservationCapabilityAvailabilityTemporalAcceptedPair[];
}

/**
 * Discriminated union of explicit accepted represented-value criteria.
 * No current-value comparison / outcome.
 */
export type AttentionObservationCapabilityDimensionAcceptanceCriterion =
  | StructuralCapabilityDeclarationMatchAcceptanceCriterion
  | ExplicitCapabilityScopeRequirementAcceptanceCriterion
  | CapabilityScopeApplicabilityAcceptanceCriterion
  | ExplicitCapabilityTemporalRequirementAcceptanceCriterion
  | CapabilityDeclarationTemporalApplicabilityAcceptanceCriterion
  | CapabilityVerificationRepresentationAcceptanceCriterion
  | CapabilityVerificationTemporalApplicabilityAcceptanceCriterion
  | CapabilityAvailabilityRepresentationAcceptanceCriterion
  | CapabilityAvailabilityTemporalApplicabilityAcceptanceCriterion;

export interface AttentionObservationCapabilityDimensionAcceptanceCriterionInput {
  capability_requirement_key: string;
  criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion;
}

export interface AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification {
  criteria: AttentionObservationCapabilityDimensionAcceptanceCriterionInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-061 + specification — not 060 / 062 / ProjectState.
 */
export interface AttentionObservationCapabilityDimensionAcceptanceCriteriaEvalInput {
  capability_evaluation_dimension_policy_set: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment;
  specification: AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification;
}

/**
 * Runtime-only acceptance criterion declaration.
 * Not persisted governance / Authority policy.
 */
export interface AttentionObservationCapabilityDimensionAcceptanceCriterionDeclaration {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  dimension: AttentionObservationCapabilityEvaluationDimension;
  criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion;
}

export type AttentionObservationCapabilityDimensionAcceptanceCriterionStatus =
  | "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT"
  | "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_DECLARED";

export interface AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment {
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  status: AttentionObservationCapabilityDimensionAcceptanceCriterionStatus;
  acceptance_criterion: AttentionObservationCapabilityDimensionAcceptanceCriterionDeclaration | null;
}

export type AttentionObservationCapabilityAcceptanceCriteriaRequirementStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED"
  | "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRESENT";

export interface AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  evaluation_dimension_policy_assessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment;
  status: AttentionObservationCapabilityAcceptanceCriteriaRequirementStatus;
  required_dimension_criterion_assessments: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment[];
  has_explicit_capability_dimension_acceptance_criteria: boolean;
}

export type AttentionObservationCapabilityDimensionAcceptanceCriteriaCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED"
  | "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRESENT";

export type AttentionObservationCapabilityDimensionAcceptanceCriteriaModelLimitation =
  | "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_INHERITANCE_NOT_MODELED"
  | "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DEFAULTS_NOT_MODELED"
  | "CAPABILITY_DIMENSION_ACCEPTANCE_MATCH_NOT_MODELED"
  | "CAPABILITY_DIMENSION_SOURCE_OUTCOME_NOT_MODELED"
  | "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED"
  | "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_DIMENSION_MULTI_SOURCE_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_DIMENSION_AGGREGATION_POLICY_NOT_MODELED"
  | "CAPABILITY_DIMENSION_WEIGHTING_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED"
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

export interface AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment {
  candidate_key: string;
  evaluation_dimension_policy_assessment: AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment;
  status: AttentionObservationCapabilityDimensionAcceptanceCriteriaCandidateStatus;
  requirement_acceptance_criteria_assessments: AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment[];
  has_explicit_capability_dimension_acceptance_criteria: boolean;
  model_limitations: AttentionObservationCapabilityDimensionAcceptanceCriteriaModelLimitation[];
}

export interface AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment {
  capability_evaluation_dimension_policy_set: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment;
  specification: AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment[];
  has_explicit_capability_dimension_acceptance_criteria: boolean;
  model_limitations: AttentionObservationCapabilityDimensionAcceptanceCriteriaModelLimitation[];
}
