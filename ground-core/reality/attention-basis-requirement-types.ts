/**
 * Reality Core v0.7 — Attention Basis Requirement types (GROUND-043).
 *
 * Derived only. Not persisted.
 *
 * Coverage + explicit Requirement → requirement-relative basis state.
 * basis absence ≠ requirement
 * capability gap ≠ requirement
 * explicit requirement ≠ selection rule / readiness / world Unknown
 */

import type {
  AttentionBasisCapabilityGap,
  AttentionBasisCoverageSetAssessment,
  AttentionBasisCoverageStatus,
  AttentionCandidateBasisCoverageAssessment,
  AttentionDimensionCoverageAssessment,
} from "./attention-basis-coverage-types.js";
import type { AttentionConsiderationDimension } from "./attention-consideration-types.js";

/**
 * Explicit evaluation requirement only — not objectively necessary,
 * authoritative, or a selection gate.
 */
export type AttentionBasisRequirementStatus =
  | "EXPLICITLY_REQUIRED"
  | "NOT_DECLARED_REQUIRED";

/**
 * Cross-product of explicit requirement × GROUND-042 coverage.
 * Not SATISFIED/UNSATISFIED/READY/BLOCKED.
 */
export type AttentionRequiredBasisState =
  | "NOT_DECLARED_REQUIRED"
  | "REQUIRED_AND_DIRECT_BASIS_AVAILABLE"
  | "REQUIRED_BUT_SOURCE_DOES_NOT_REPRESENT_DIMENSION"
  | "REQUIRED_BUT_MODEL_LINKAGE_NOT_AVAILABLE"
  | "REQUIRED_BUT_MODEL_ESTIMATION_NOT_AVAILABLE";

export type AttentionRequiredBasisGapKind =
  | "SOURCE_NON_REPRESENTATION_GAP"
  | "MODEL_LINKAGE_CAPABILITY_GAP"
  | "MODEL_ESTIMATION_CAPABILITY_GAP";

/**
 * Requirement-relative basis gap — evaluation context only.
 * Not world Unknown / Inquiry / ObservationNeed / selection failure.
 */
export interface AttentionRequiredBasisGap {
  key: string;
  candidate_key: string;
  dimension: AttentionConsiderationDimension;
  gap_kind: AttentionRequiredBasisGapKind;
  coverage_status: AttentionBasisCoverageStatus;
  capability_gap: AttentionBasisCapabilityGap | null;
}

export interface AttentionCandidateBasisRequirement {
  candidate_key: string;
  required_dimensions: AttentionConsiderationDimension[];
}

/**
 * Runtime evaluation input — not canonical persisted Attention policy.
 * No provenance / Authority / hard-soft strength.
 */
export interface AttentionBasisRequirementSpecification {
  required_for_all_candidates: AttentionConsiderationDimension[];
  candidate_requirements: AttentionCandidateBasisRequirement[];
}

export interface AttentionDimensionRequirementAssessment {
  dimension: AttentionConsiderationDimension;
  requirement_status: AttentionBasisRequirementStatus;
  coverage: AttentionDimensionCoverageAssessment;
  required_basis_state: AttentionRequiredBasisState;
  required_basis_gap: AttentionRequiredBasisGap | null;
}

export type AttentionBasisRequirementModelLimitation =
  | "ATTENTION_REQUIREMENT_PROVENANCE_NOT_MODELED"
  | "ATTENTION_REQUIREMENT_AUTHORITY_NOT_MODELED"
  | "ATTENTION_REQUIREMENT_POLICY_NOT_MODELED"
  | "ATTENTION_REQUIREMENT_STRENGTH_NOT_MODELED"
  | "ATTENTION_REQUIREMENT_NEGATION_NOT_MODELED"
  | "ATTENTION_SELECTION_READINESS_NOT_MODELED"
  | "ATTENTION_REQUIREMENT_SATISFACTION_GATE_NOT_MODELED"
  | "REQUIRED_BASIS_ACQUISITION_PATHWAY_NOT_MODELED"
  | "REQUIRED_BASIS_TO_WORLD_UNKNOWN_BRIDGE_NOT_MODELED"
  | "REQUIRED_BASIS_TO_INQUIRY_BRIDGE_NOT_MODELED"
  | "REQUIRED_BASIS_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED"
  | "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED"
  | "OBSERVATION_COST_MODEL_NOT_MODELED"
  | "INFORMATION_GAIN_MODEL_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "TEMPORAL_URGENCY_MODEL_NOT_MODELED"
  | "CROSS_CANDIDATE_COMPARISON_NOT_MODELED"
  | "CROSS_DIMENSION_COMPARISON_NOT_MODELED"
  | "ATTENTION_SCORING_NOT_MODELED"
  | "ATTENTION_PRIORITY_NOT_MODELED"
  | "ATTENTION_RANKING_NOT_MODELED"
  | "ATTENTION_SELECTION_NOT_MODELED"
  | "ATTENTION_ALLOCATION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-Candidate requirement assessment.
 * has_required_basis_gaps is descriptive only — not blocked/invalid/not ready.
 */
export interface AttentionCandidateRequirementAssessment {
  candidate_key: string;
  coverage: AttentionCandidateBasisCoverageAssessment;
  effective_required_dimensions: AttentionConsiderationDimension[];
  dimensions: AttentionDimensionRequirementAssessment[];
  required_basis_gaps: AttentionRequiredBasisGap[];
  has_explicit_requirements: boolean;
  has_required_basis_gaps: boolean;
  model_limitations: AttentionBasisRequirementModelLimitation[];
}

/**
 * Set-level requirement assessment.
 * No ranking / selection / readiness / completeness score.
 */
export interface AttentionBasisRequirementSetAssessment {
  coverage_set: AttentionBasisCoverageSetAssessment;
  specification: AttentionBasisRequirementSpecification;
  candidate_requirements: AttentionCandidateRequirementAssessment[];
  required_basis_gaps: AttentionRequiredBasisGap[];
  has_explicit_requirements: boolean;
  has_required_basis_gaps: boolean;
  model_limitations: AttentionBasisRequirementModelLimitation[];
}
