/**
 * Reality Core v0.7 — Attention Observation Capability Required Dimension Coverage
 * types (GROUND-062).
 *
 * Derived only. Not persisted.
 *
 * GROUND-060 Capability Applicability Composition Basis
 * + GROUND-061 Explicit Capability Evaluation Dimension Policy
 * → Required Capability Evaluation Dimension Coverage Basis only.
 *
 * required dimension + represented evaluation basis ≠ accepted dimension
 * required dimension + no represented evaluation basis ≠ failed dimension
 * required-dimension coverage ≠ Capability Requirement satisfaction
 *
 * REPRESENTED ≠ PASS
 * NOT_REPRESENTED ≠ FAIL
 */

import type {
  AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  AttentionObservationCapabilityApplicabilityCompositionSetAssessment,
} from "./attention-observation-capability-applicability-composition-types.js";
import type {
  AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  AttentionObservationCapabilityEvaluationDimension,
  AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";

/**
 * Combined evaluation input.
 * Consumes 060 + 061 — not ProjectState / Permission / Resource / 050–059 rematch.
 */
export interface AttentionObservationCapabilityRequiredDimensionCoverageInput {
  capability_applicability_composition_set: AttentionObservationCapabilityApplicabilityCompositionSetAssessment;
  capability_evaluation_dimension_policy_set: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment;
}

/**
 * Presence/absence of canonical evaluation basis for a required dimension.
 * Not PASS / FAIL / MET / UNSATISFIED.
 */
export type AttentionObservationCapabilityRequiredDimensionCoverageStatus =
  | "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
  | "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED";

/**
 * Exact provenance refs to upstream 060-preserved representations.
 * No duplicated verdicts / acceptance outcomes.
 */
export type AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef =
  | {
      kind: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH";
      capability_declaration_match_key: string;
      capability_declaration_id: string;
      observer_candidate_key: string;
    }
  | {
      kind: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT";
      capability_scope_requirement_key: string;
    }
  | {
      kind: "CAPABILITY_SCOPE_APPLICABILITY";
      capability_declaration_id: string;
      scope_applicability_position_key: string;
      observer_candidate_key: string;
    }
  | {
      kind: "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT";
      capability_temporal_requirement_key: string;
    }
  | {
      kind: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY";
      capability_declaration_id: string;
      declaration_temporal_position_key: string;
      observer_candidate_key: string;
    }
  | {
      kind: "CAPABILITY_VERIFICATION_REPRESENTATION";
      capability_declaration_id: string;
      capability_verification_declaration_id: string;
      observer_candidate_key: string;
    }
  | {
      kind: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY";
      capability_declaration_id: string;
      capability_verification_declaration_id: string;
      verification_temporal_position_key: string;
      observer_candidate_key: string;
    }
  | {
      kind: "CAPABILITY_AVAILABILITY_REPRESENTATION";
      capability_declaration_id: string;
      capability_availability_declaration_id: string;
      observer_candidate_key: string;
    }
  | {
      kind: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY";
      capability_declaration_id: string;
      capability_availability_declaration_id: string;
      availability_temporal_position_key: string;
      observer_candidate_key: string;
    };

/**
 * One required dimension → coverage presence assessment.
 * NOT_REPRESENTED still yields a coverage basis record.
 */
export interface AttentionObservationCapabilityRequiredDimensionCoverageBasis {
  key: string;
  capability_requirement_key: string;
  required_dimension: AttentionObservationCapabilityEvaluationDimension;
  status: AttentionObservationCapabilityRequiredDimensionCoverageStatus;
  represented_basis_refs: AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef[];
}

/**
 * Per Capability Requirement required-dimension coverage aggregation.
 * No all_covered / complete / passed.
 */
export interface AttentionObservationCapabilityRequirementRequiredDimensionCoverageAssessment {
  capability_requirement: AttentionObservationCapabilityRequirement;
  evaluation_dimension_policy_assessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment;
  required_dimension_coverage_bases: AttentionObservationCapabilityRequiredDimensionCoverageBasis[];
  has_required_dimension_coverage_assessment: boolean;
}

/**
 * Candidate-level coverage status.
 * Not ALL_COVERED / COMPLETE / SATISFIED / READY.
 */
export type AttentionObservationCapabilityRequiredDimensionCoverageCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  | "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  | "REQUIRED_CAPABILITY_EVALUATION_DIMENSION_COVERAGE_BASIS_PRESENT";

export type AttentionObservationCapabilityRequiredDimensionCoverageModelLimitation =
  | "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED"
  | "CAPABILITY_MISSING_DIMENSION_SEMANTICS_NOT_MODELED"
  | "CAPABILITY_DIMENSION_AGGREGATION_NOT_MODELED"
  | "CAPABILITY_DIMENSION_WEIGHTING_NOT_MODELED"
  | "CAPABILITY_REQUIRED_DIMENSION_COMPLETENESS_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED"
  | "CAPABILITY_APPLICABILITY_POLICY_PRECEDENCE_NOT_MODELED"
  | "CAPABILITY_APPLICABILITY_POLICY_AUTHORITY_NOT_MODELED"
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
  | "OBSERVATION_PRIORITY_NOT_MODELED"
  | "OBSERVATION_RANKING_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-AttentionCandidate required-dimension coverage assessment.
 * has_required_dimension_coverage_basis is coverage-assessment existence only
 * (includes NOT_REPRESENTED records).
 */
export interface AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment {
  candidate_key: string;
  applicability_composition_assessment: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment;
  evaluation_dimension_policy_assessment: AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment;
  status: AttentionObservationCapabilityRequiredDimensionCoverageCandidateStatus;
  requirement_coverage_assessments: AttentionObservationCapabilityRequirementRequiredDimensionCoverageAssessment[];
  has_required_dimension_coverage_basis: boolean;
  model_limitations: AttentionObservationCapabilityRequiredDimensionCoverageModelLimitation[];
}

/**
 * Set-level Required Dimension Coverage assessment.
 * No coverage_complete / all_represented / satisfied_requirements.
 */
export interface AttentionObservationCapabilityRequiredDimensionCoverageSetAssessment {
  capability_applicability_composition_set: AttentionObservationCapabilityApplicabilityCompositionSetAssessment;
  capability_evaluation_dimension_policy_set: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment;
  candidate_assessments: AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment[];
  has_required_dimension_coverage_basis: boolean;
  model_limitations: AttentionObservationCapabilityRequiredDimensionCoverageModelLimitation[];
}
