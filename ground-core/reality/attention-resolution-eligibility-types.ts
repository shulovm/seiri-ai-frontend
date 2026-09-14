/**
 * Reality Core v0.7 — Attention Resolution Domain Eligibility types (GROUND-045).
 *
 * Derived only. Not persisted.
 *
 * Resolution Pathway → Resolution Domain Eligibility Basis only.
 * eligibility basis ≠ requirement / selection / action
 * no eligibility basis ≠ ineligible / impossible
 * SOURCE_NON_REPRESENTATION ≠ WORLD_INFORMATION eligibility
 * MODEL_CAPABILITY_PATHWAY_IDENTIFIED ≠ implement model now
 */

import type { AttentionConsiderationDimension } from "./attention-consideration-types.js";
import type {
  AttentionBasisResolutionSetAssessment,
  AttentionCandidateResolutionAssessment,
  AttentionDimensionResolutionAssessment,
  AttentionRequiredBasisResolutionPathway,
} from "./attention-basis-resolution-types.js";

/**
 * Broad resolution domains — not executable pathway kinds.
 */
export type AttentionResolutionDomain =
  | "WORLD_INFORMATION_RESOLUTION"
  | "MODEL_CAPABILITY_RESOLUTION";

/**
 * Per-domain eligibility basis presence.
 * Not selected / feasible / resolvable / authorized.
 */
export type AttentionResolutionDomainEligibilityStatus =
  | "NOT_APPLICABLE_NO_REQUIRED_BASIS_GAP"
  | "DIRECT_ELIGIBILITY_BASIS_PRESENT"
  | "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED";

/**
 * Only model-capability eligibility currently creates a basis.
 * No WORLD_INFORMATION basis kind in GROUND-045.
 */
export type AttentionResolutionDomainEligibilityBasisKind =
  | "IDENTIFIED_MODEL_CAPABILITY_PATHWAY";

/**
 * Direct represented eligibility basis for a resolution domain.
 * References exact GROUND-044 pathway — does not reconstruct it.
 */
export interface AttentionResolutionDomainEligibilityBasis {
  key: string;
  candidate_key: string;
  dimension: AttentionConsiderationDimension;
  domain: AttentionResolutionDomain;
  basis_kind: AttentionResolutionDomainEligibilityBasisKind;
  resolution_pathway_key: string;
  resolution_pathway: AttentionRequiredBasisResolutionPathway;
}

export interface AttentionResolutionDomainAssessment {
  domain: AttentionResolutionDomain;
  eligibility_status: AttentionResolutionDomainEligibilityStatus;
  eligibility_bases: AttentionResolutionDomainEligibilityBasis[];
}

/**
 * Weak dimension-level summary.
 * No WORLD_INFORMATION_REQUIRED / WORLD_INFORMATION_ELIGIBLE —
 * no positive world-information basis exists yet.
 */
export type AttentionResolutionEligibilityState =
  | "NO_REQUIRED_BASIS_GAP"
  | "RESOLUTION_DOMAIN_ELIGIBILITY_UNDETERMINED"
  | "MODEL_CAPABILITY_RESOLUTION_ELIGIBILITY_BASIS_PRESENT";

export interface AttentionDimensionResolutionEligibilityAssessment {
  dimension: AttentionConsiderationDimension;
  resolution: AttentionDimensionResolutionAssessment;
  eligibility_state: AttentionResolutionEligibilityState;
  domains: AttentionResolutionDomainAssessment[];
}

export type AttentionResolutionEligibilityModelLimitation =
  | "WORLD_INFORMATION_ELIGIBILITY_BASIS_NOT_MODELED"
  | "SOURCE_NON_REPRESENTATION_WORLD_INFORMATION_MAPPING_NOT_MODELED"
  | "WORLD_INFORMATION_TARGET_IDENTIFICATION_NOT_MODELED"
  | "WORLD_INFORMATION_ACQUISITION_REQUIREMENT_NOT_MODELED"
  | "WORLD_INFORMATION_ACQUISITION_PATHWAY_NOT_MODELED"
  | "INQUIRY_ELIGIBILITY_NOT_MODELED"
  | "OBSERVATION_ELIGIBILITY_NOT_MODELED"
  | "MODEL_DEVELOPMENT_ELIGIBILITY_NOT_MODELED"
  | "RESOLUTION_DOMAIN_SELECTION_NOT_MODELED"
  | "RESOLUTION_FEASIBILITY_NOT_MODELED"
  | "RESOLUTION_COST_NOT_MODELED"
  | "RESOLUTION_LATENCY_NOT_MODELED"
  | "MODEL_CAPABILITY_DEVELOPMENT_ACTION_NOT_MODELED"
  | "MODEL_CAPABILITY_DEVELOPMENT_PRIORITY_NOT_MODELED"
  | "REQUIRED_BASIS_TO_WORLD_UNKNOWN_BRIDGE_NOT_MODELED"
  | "REQUIRED_BASIS_TO_INQUIRY_BRIDGE_NOT_MODELED"
  | "REQUIRED_BASIS_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "ATTENTION_SCORING_NOT_MODELED"
  | "ATTENTION_PRIORITY_NOT_MODELED"
  | "ATTENTION_RANKING_NOT_MODELED"
  | "ATTENTION_SELECTION_NOT_MODELED"
  | "ATTENTION_ALLOCATION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-Candidate domain eligibility.
 * Flags are descriptive only — not priority / readiness / selection.
 */
export interface AttentionCandidateResolutionEligibilityAssessment {
  candidate_key: string;
  resolution: AttentionCandidateResolutionAssessment;
  dimensions: AttentionDimensionResolutionEligibilityAssessment[];
  has_model_capability_resolution_eligibility_basis: boolean;
  has_world_information_resolution_eligibility_basis: boolean;
  has_undetermined_resolution_domain_eligibility: boolean;
  model_limitations: AttentionResolutionEligibilityModelLimitation[];
}

/**
 * Set-level domain eligibility.
 * No ranking / selection / aggregate readiness.
 */
export interface AttentionResolutionEligibilitySetAssessment {
  resolution_set: AttentionBasisResolutionSetAssessment;
  candidate_eligibility: AttentionCandidateResolutionEligibilityAssessment[];
  has_model_capability_resolution_eligibility_basis: boolean;
  has_world_information_resolution_eligibility_basis: boolean;
  has_undetermined_resolution_domain_eligibility: boolean;
  model_limitations: AttentionResolutionEligibilityModelLimitation[];
}
