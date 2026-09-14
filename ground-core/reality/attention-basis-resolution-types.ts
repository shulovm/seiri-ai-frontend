/**
 * Reality Core v0.7 — Attention Basis Resolution Pathway types (GROUND-044).
 *
 * Derived only. Not persisted.
 *
 * Required Basis Gap → resolution pathway classification only.
 * required-basis gap ≠ world-information requirement
 * resolution pathway classification ≠ resolution action
 * model capability pathway ≠ world observation pathway
 */

import type { AttentionConsiderationDimension } from "./attention-consideration-types.js";
import type {
  AttentionBasisRequirementSetAssessment,
  AttentionCandidateRequirementAssessment,
  AttentionDimensionRequirementAssessment,
  AttentionRequiredBasisGap,
} from "./attention-basis-requirement-types.js";

/**
 * Classification of whether a resolution pathway class can be identified.
 * Not resolved / complete / ready / blocked / resolvable.
 */
export type AttentionRequiredBasisResolutionStatus =
  | "NO_REQUIRED_BASIS_GAP"
  | "RESOLUTION_PATHWAY_UNDETERMINED"
  | "MODEL_CAPABILITY_PATHWAY_IDENTIFIED";

/**
 * Identified internal model-capability pathway families only.
 * No WORLD_INFORMATION_ACQUISITION / INQUIRY / OBSERVATION / DEVELOPMENT_TASK.
 */
export type AttentionRequiredBasisResolutionPathwayKind =
  | "EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY"
  | "ESTIMATION_CAPABILITY";

/**
 * Gap-relative resolution pathway classification.
 * Exists only when a required basis gap exists.
 * pathway_kind null means pathway type is undetermined (source nonrepresentation).
 */
export interface AttentionRequiredBasisResolutionPathway {
  key: string;
  candidate_key: string;
  dimension: AttentionConsiderationDimension;
  required_basis_gap_key: string;
  status: AttentionRequiredBasisResolutionStatus;
  pathway_kind: AttentionRequiredBasisResolutionPathwayKind | null;
  required_basis_gap: AttentionRequiredBasisGap;
}

export interface AttentionDimensionResolutionAssessment {
  dimension: AttentionConsiderationDimension;
  requirement: AttentionDimensionRequirementAssessment;
  resolution_status: AttentionRequiredBasisResolutionStatus;
  resolution_pathway: AttentionRequiredBasisResolutionPathway | null;
}

export type AttentionBasisResolutionModelLimitation =
  | "WORLD_INFORMATION_RESOLUTION_PATHWAY_NOT_MODELED"
  | "SOURCE_NON_REPRESENTATION_RESOLUTION_PATHWAY_NOT_MODELED"
  | "REQUIRED_BASIS_ACQUISITION_REQUIREMENT_NOT_MODELED"
  | "REQUIRED_BASIS_RESOLUTION_ACTION_NOT_MODELED"
  | "REQUIRED_BASIS_PATHWAY_SELECTION_NOT_MODELED"
  | "MODEL_CAPABILITY_DEVELOPMENT_ACTION_NOT_MODELED"
  | "MODEL_CAPABILITY_DEVELOPMENT_PRIORITY_NOT_MODELED"
  | "REQUIRED_BASIS_TO_WORLD_UNKNOWN_BRIDGE_NOT_MODELED"
  | "REQUIRED_BASIS_TO_INQUIRY_BRIDGE_NOT_MODELED"
  | "REQUIRED_BASIS_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED"
  | "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED"
  | "OBSERVATION_COST_MODEL_NOT_MODELED"
  | "INFORMATION_GAIN_MODEL_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "TEMPORAL_URGENCY_MODEL_NOT_MODELED"
  | "ATTENTION_SCORING_NOT_MODELED"
  | "ATTENTION_PRIORITY_NOT_MODELED"
  | "ATTENTION_RANKING_NOT_MODELED"
  | "ATTENTION_SELECTION_NOT_MODELED"
  | "ATTENTION_ALLOCATION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-Candidate resolution pathway classification.
 * Flags are descriptive only — not priority / readiness / resolvability.
 */
export interface AttentionCandidateResolutionAssessment {
  candidate_key: string;
  requirement: AttentionCandidateRequirementAssessment;
  dimensions: AttentionDimensionResolutionAssessment[];
  required_basis_resolution_pathways: AttentionRequiredBasisResolutionPathway[];
  has_required_basis_gaps: boolean;
  has_identified_model_capability_pathways: boolean;
  has_undetermined_resolution_pathways: boolean;
  model_limitations: AttentionBasisResolutionModelLimitation[];
}

/**
 * Set-level resolution pathway classification.
 * No ranking / selection / readiness / aggregate completeness.
 */
export interface AttentionBasisResolutionSetAssessment {
  requirement_set: AttentionBasisRequirementSetAssessment;
  candidate_resolution: AttentionCandidateResolutionAssessment[];
  required_basis_resolution_pathways: AttentionRequiredBasisResolutionPathway[];
  has_identified_model_capability_pathways: boolean;
  has_undetermined_resolution_pathways: boolean;
  model_limitations: AttentionBasisResolutionModelLimitation[];
}
