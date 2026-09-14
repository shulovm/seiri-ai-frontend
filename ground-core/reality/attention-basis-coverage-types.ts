/**
 * Reality Core v0.7 — Attention Basis Coverage types (GROUND-042).
 *
 * Derived only. Not persisted.
 *
 * Consideration Basis → Coverage diagnosis / capability-gap classification.
 * basis absence ≠ information requirement
 * model capability gap ≠ world Unknown
 * No COMPLETE / READY / RequiredDimension / score / ranking.
 */

import type { AttentionCandidate } from "./attention-candidate-types.js";
import type {
  AttentionCandidateConsiderationAssessment,
  AttentionConsiderationBasisAtom,
  AttentionConsiderationBasisSetAssessment,
  AttentionConsiderationDimension,
  AttentionDimensionBasisStatus,
} from "./attention-consideration-types.js";

/**
 * Why a dimension is or is not directly represented for a Candidate.
 * Four statuses are not interchangeable.
 */
export type AttentionBasisCoverageStatus =
  | "DIRECT_BASIS_AVAILABLE"
  | "SOURCE_DOES_NOT_REPRESENT_DIMENSION"
  | "MODEL_LINKAGE_NOT_AVAILABLE"
  | "MODEL_ESTIMATION_NOT_AVAILABLE";

export type AttentionBasisCapabilityGapKind =
  | "EXPLICIT_LINKAGE_CAPABILITY_GAP"
  | "ESTIMATION_CAPABILITY_GAP";

export type AttentionBasisCapabilityGapReason =
  | "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED"
  | "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED"
  | "OBSERVATION_COST_MODEL_NOT_MODELED"
  | "INFORMATION_GAIN_MODEL_NOT_MODELED"
  | "TEMPORAL_URGENCY_MODEL_NOT_MODELED";

/**
 * Weak acquisition-facing status.
 * NO_ACQUISITION_REQUIREMENT_INFERRED ≠ acquisition unnecessary / dimension irrelevant.
 * ACQUISITION_PATHWAY_NOT_MODELED ≠ ask / observe / create Inquiry.
 */
export type AttentionBasisAcquisitionStatus =
  | "BASIS_ALREADY_REPRESENTED"
  | "NO_ACQUISITION_REQUIREMENT_INFERRED"
  | "ACQUISITION_PATHWAY_NOT_MODELED";

/**
 * GROUND Attention architecture cannot currently derive this dimension.
 * Not: dimension required / world Unknown / Inquiry / ObservationNeed.
 */
export interface AttentionBasisCapabilityGap {
  key: string;
  candidate_key: string;
  dimension: AttentionConsiderationDimension;
  gap_kind: AttentionBasisCapabilityGapKind;
  reason: AttentionBasisCapabilityGapReason;
}

export interface AttentionDimensionCoverageAssessment {
  dimension: AttentionConsiderationDimension;
  basis_status: AttentionDimensionBasisStatus;
  coverage_status: AttentionBasisCoverageStatus;
  basis_atoms: AttentionConsiderationBasisAtom[];
  capability_gap: AttentionBasisCapabilityGap | null;
  acquisition_status: AttentionBasisAcquisitionStatus;
}

export type AttentionBasisCoverageModelLimitation =
  | "ATTENTION_DIMENSION_REQUIREMENTS_NOT_MODELED"
  | "ATTENTION_BASIS_ACQUISITION_REQUIREMENTS_NOT_MODELED"
  | "ATTENTION_BASIS_ACQUISITION_PATHWAYS_NOT_MODELED"
  | "MODEL_CAPABILITY_GAP_TO_WORLD_UNKNOWN_BRIDGE_NOT_MODELED"
  | "MODEL_CAPABILITY_GAP_TO_INQUIRY_BRIDGE_NOT_MODELED"
  | "MODEL_CAPABILITY_GAP_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
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
 * Per-Candidate coverage diagnosis.
 * has_capability_gaps is descriptive only — not quality / ranking.
 * No COMPLETE / READY / coverage_score.
 */
export interface AttentionCandidateBasisCoverageAssessment {
  candidate_key: string;
  candidate: AttentionCandidate;
  consideration: AttentionCandidateConsiderationAssessment;
  dimensions: AttentionDimensionCoverageAssessment[];
  capability_gaps: AttentionBasisCapabilityGap[];
  has_capability_gaps: boolean;
  model_limitations: AttentionBasisCoverageModelLimitation[];
}

/**
 * Set-level coverage assessment.
 * No aggregate readiness / comparison.
 */
export interface AttentionBasisCoverageSetAssessment {
  consideration_set: AttentionConsiderationBasisSetAssessment;
  candidate_coverage: AttentionCandidateBasisCoverageAssessment[];
  model_limitations: AttentionBasisCoverageModelLimitation[];
}
