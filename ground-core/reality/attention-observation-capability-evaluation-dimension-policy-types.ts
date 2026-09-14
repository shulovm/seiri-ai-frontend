/**
 * Reality Core v0.7 — Attention Observation Capability Evaluation Dimension Policy
 * types (GROUND-061).
 *
 * Derived only. Not persisted.
 *
 * GROUND-048 Explicit Capability Requirement
 * + explicit runtime Evaluation Dimension Policy Specification
 * → Explicit Capability Evaluation Dimension Policy Foundation only.
 *
 * Requirement-side sibling of 054 / 056.
 * Does NOT consume GROUND-050–060.
 *
 * required evaluation dimension
 *   ≠ acceptance criterion
 *   ≠ dimension outcome
 *   ≠ Requirement satisfaction
 *   ≠ effective Capability state
 *
 * policy absence ≠ empty policy ≠ all-required ≠ all-optional
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Canonical capability-side evaluation dimensions.
 * Serialization order only — not priority / dependency / importance.
 * No Permission / Resource / Authority dimensions.
 */
export type AttentionObservationCapabilityEvaluationDimension =
  | "STRUCTURAL_CAPABILITY_DECLARATION_MATCH"
  | "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT"
  | "CAPABILITY_SCOPE_APPLICABILITY"
  | "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT"
  | "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"
  | "CAPABILITY_VERIFICATION_REPRESENTATION"
  | "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY"
  | "CAPABILITY_AVAILABILITY_REPRESENTATION"
  | "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY";

/**
 * Runtime evaluation input — not persisted / governance / Authority policy.
 * No provenance / accepted values / pass conditions.
 */
export interface AttentionObservationCapabilityEvaluationDimensionPolicyInput {
  capability_requirement_key: string;
  required_dimensions: AttentionObservationCapabilityEvaluationDimension[];
}

export interface AttentionObservationCapabilityEvaluationDimensionPolicySpecification {
  policies: AttentionObservationCapabilityEvaluationDimensionPolicyInput[];
}

/**
 * Combined evaluation input.
 * Consumes GROUND-048 directly — not GROUND-050–060.
 */
export interface AttentionObservationCapabilityEvaluationDimensionPolicyEvalInput {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityEvaluationDimensionPolicySpecification;
}

/**
 * Per-Capability-Requirement policy status.
 * NO_POLICY ≠ empty required_dimensions.
 */
export type AttentionObservationCapabilityEvaluationDimensionPolicyStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED"
  | "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT";

/**
 * Candidate-level policy status.
 * Not ALL_HAVE_POLICY / PARTIAL_COVERAGE / COMPLETE / SATISFIED.
 */
export type AttentionObservationCapabilityEvaluationDimensionPolicyCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_DECLARED"
  | "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_PRESENT";

/**
 * Explicit Observation Capability Requirement-relative evaluation dimension policy.
 * required_dimensions are set semantics (canonical order) — not AND/OR outcomes.
 */
export interface AttentionObservationCapabilityEvaluationDimensionPolicy {
  key: string;
  capability_requirement_key: string;
  observation_need_key: string;
  capability_semantic_key: CanonicalCapabilitySemanticKey;
  required_dimensions: AttentionObservationCapabilityEvaluationDimension[];
}

/**
 * Requirement exists; Evaluation Dimension Policy may or may not.
 */
export interface AttentionObservationCapabilityEvaluationDimensionPolicyBasis {
  capability_requirement: AttentionObservationCapabilityRequirement;
  evaluation_dimension_policy: AttentionObservationCapabilityEvaluationDimensionPolicy | null;
}

/**
 * Per explicit Capability Requirement evaluation dimension policy assessment.
 */
export interface AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  status: AttentionObservationCapabilityEvaluationDimensionPolicyStatus;
  evaluation_dimension_policy_basis: AttentionObservationCapabilityEvaluationDimensionPolicyBasis;
}

export type AttentionObservationCapabilityEvaluationDimensionPolicyModelLimitation =
  | "CAPABILITY_EVALUATION_POLICY_PROVENANCE_NOT_MODELED"
  | "CAPABILITY_EVALUATION_POLICY_AUTHORITY_NOT_MODELED"
  | "CAPABILITY_EVALUATION_POLICY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_EVALUATION_POLICY_INHERITANCE_NOT_MODELED"
  | "CAPABILITY_EVALUATION_DIMENSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "CAPABILITY_EVALUATION_DIMENSION_OUTCOME_NOT_MODELED"
  | "CAPABILITY_EVALUATION_REQUIRED_DIMENSION_COVERAGE_NOT_MODELED"
  | "CAPABILITY_EVALUATION_MISSING_DIMENSION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_EVALUATION_DIMENSION_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_EVALUATION_DIMENSION_WEIGHTING_NOT_MODELED"
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

/**
 * Per-AttentionCandidate Capability Evaluation Dimension Policy assessment.
 * has_explicit_capability_evaluation_dimension_policies is existential only.
 */
export interface AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment {
  candidate_key: string;
  capability_requirement_assessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  status: AttentionObservationCapabilityEvaluationDimensionPolicyCandidateStatus;
  requirement_policy_assessments: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment[];
  has_explicit_capability_evaluation_dimension_policies: boolean;
  model_limitations: AttentionObservationCapabilityEvaluationDimensionPolicyModelLimitation[];
}

/**
 * Set-level Capability Evaluation Dimension Policy assessment.
 * No policy_complete / all_requirements_governed / satisfied_policies.
 */
export interface AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment {
  capability_requirement_set: AttentionObservationCapabilityRequirementSetAssessment;
  specification: AttentionObservationCapabilityEvaluationDimensionPolicySpecification;
  candidate_assessments: AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment[];
  has_explicit_capability_evaluation_dimension_policies: boolean;
  model_limitations: AttentionObservationCapabilityEvaluationDimensionPolicyModelLimitation[];
}
