/**
 * Reality Core v0.7 — Attention Consideration Basis types (GROUND-041).
 *
 * Derived only. Not persisted.
 *
 * Attention Candidate → Consideration Basis decomposition only.
 * Different dimensions remain different — no score / utility / priority / rank.
 * NO_DIRECT_BASIS_REPRESENTED ≠ zero / irrelevant / low / false.
 */

import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
  AttentionCandidateSourceKind,
} from "./attention-candidate-types.js";

/**
 * Separate Attention consideration dimensions.
 * Fixed serialization order only — not value ordering.
 */
export type AttentionConsiderationDimension =
  | "STRUCTURAL_ACTIVITY"
  | "SITUATION_UNRESOLVEDNESS"
  | "OBSERVATION_NEED"
  | "RESOURCE_STRUCTURAL_DISCOVERY"
  | "IMPACT"
  | "REVERSIBILITY"
  | "OBSERVATION_COST"
  | "INFORMATION_GAIN"
  | "TEMPORAL_URGENCY";

/**
 * DIRECT_BASIS_PRESENT = at least one direct atom from Candidate source.
 * NO_DIRECT_BASIS_REPRESENTED = cannot derive support from this Candidate —
 * not zero / irrelevant / false / low.
 */
export type AttentionDimensionBasisStatus =
  | "DIRECT_BASIS_PRESENT"
  | "NO_DIRECT_BASIS_REPRESENTED";

/**
 * One direct represented reason for considering a Candidate along one dimension.
 */
export interface AttentionConsiderationBasisAtom {
  key: string;
  candidate_key: string;
  dimension: AttentionConsiderationDimension;
  source_kind: AttentionCandidateSourceKind;
  source_semantic_kind: string;
  source_key: string;
}

export interface AttentionConsiderationDimensionAssessment {
  dimension: AttentionConsiderationDimension;
  status: AttentionDimensionBasisStatus;
  basis_atoms: AttentionConsiderationBasisAtom[];
}

export type AttentionConsiderationModelLimitation =
  | "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED"
  | "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED"
  | "OBSERVATION_COST_NOT_MODELED"
  | "INFORMATION_GAIN_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "TEMPORAL_URGENCY_NOT_MODELED"
  | "CROSS_DOMAIN_CANDIDATE_EQUIVALENCE_NOT_MODELED"
  | "CROSS_DIMENSION_COMPARISON_NOT_MODELED"
  | "CROSS_CANDIDATE_COMPARISON_NOT_MODELED"
  | "ATTENTION_SCORING_NOT_MODELED"
  | "ATTENTION_WEIGHTING_NOT_MODELED"
  | "ATTENTION_RANKING_NOT_MODELED"
  | "ATTENTION_PRIORITY_NOT_MODELED"
  | "ATTENTION_SELECTION_NOT_MODELED"
  | "ATTENTION_ALLOCATION_NOT_MODELED"
  | "ATTENTION_BUDGET_NOT_MODELED"
  | "AUTOMATIC_INQUIRY_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-Candidate consideration decomposition.
 * represented_dimensions = direct basis present only — not "matters" / positive value.
 * unrepresented_dimensions = no direct basis — not zero / irrelevant.
 */
export interface AttentionCandidateConsiderationAssessment {
  candidate_key: string;
  candidate: AttentionCandidate;
  dimensions: AttentionConsiderationDimensionAssessment[];
  represented_dimensions: AttentionConsiderationDimension[];
  unrepresented_dimensions: AttentionConsiderationDimension[];
  model_limitations: AttentionConsiderationModelLimitation[];
}

/**
 * Set-level Consideration Basis assessment.
 * Not an Attention Plan. No aggregate score / winner.
 */
export interface AttentionConsiderationBasisSetAssessment {
  candidate_set: AttentionCandidateSetAssessment;
  candidate_assessments: AttentionCandidateConsiderationAssessment[];
  model_limitations: AttentionConsiderationModelLimitation[];
}
