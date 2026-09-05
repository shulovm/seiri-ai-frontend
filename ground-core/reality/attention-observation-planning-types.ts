/**
 * Reality Core v0.7 — Attention Observation Planning Basis types (GROUND-047).
 *
 * Derived only. Not persisted.
 *
 * Observation Eligibility + explicit ObservationNeed collection → Planning Basis only.
 * ObservationNeed ≠ executable Observation specification
 * Planning Basis ≠ Observation Plan
 * Planning Basis availability ≠ planning completeness
 */

import type { ObservationNeed } from "./observation-need-types.js";
import type {
  AttentionCandidateObservationEligibilityAssessment,
  AttentionObservationEligibilityBasis,
  AttentionObservationEligibilitySetAssessment,
} from "./attention-observation-eligibility-types.js";

/**
 * Read-only resolution context — not a new source of truth.
 */
export interface AttentionObservationPlanningInput {
  eligibility_set: AttentionObservationEligibilitySetAssessment;
  observation_needs: ObservationNeed[];
}

/**
 * Basis-relative planning status.
 * Not COMPLETE_PLAN / READY / PLANNABLE / UNPLANNABLE.
 */
export type AttentionObservationPlanningBasisStatus =
  | "NO_OBSERVATION_PLANNING_BASIS"
  | "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT";

export type AttentionObservationPlanningBasisKind =
  | "CANONICAL_OBSERVATION_NEED_STRUCTURE";

/**
 * Canonical target projection — not observer destination / dispatch command.
 */
export interface AttentionObservationTargetBasis {
  observation_need_key: string;
  target: ObservationNeed["target"];
}

/**
 * Canonical evidence requirement projection — not Capability/Resource/Permission.
 */
export interface AttentionObservationEvidenceRequirementBasis {
  observation_need_key: string;
  evidence_requirements: ObservationNeed["evidence_requirements"];
}

/**
 * Canonical inquiry question-key context — not question selection/priority.
 */
export interface AttentionObservationInquiryContextBasis {
  observation_need_key: string;
  question_keys: string[];
}

/**
 * Read-only planning basis from resolved canonical ObservationNeed.
 * Not plan / request / task / schedule / dispatch.
 */
export interface AttentionObservationPlanningBasis {
  key: string;
  candidate_key: string;
  basis_kind: AttentionObservationPlanningBasisKind;
  observation_eligibility_basis_key: string;
  observation_need_key: string;
  observation_need: ObservationNeed;
  target_basis: AttentionObservationTargetBasis;
  evidence_requirement_basis: AttentionObservationEvidenceRequirementBasis;
  inquiry_context_basis: AttentionObservationInquiryContextBasis;
}

export type AttentionObservationPlanningModelLimitation =
  | "OBSERVATION_PLAN_NOT_MODELED"
  | "OBSERVATION_METHOD_NOT_MODELED"
  | "OBSERVER_CANDIDATES_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVER_CAPABILITY_MATCHING_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "OBSERVATION_PRIORITY_NOT_MODELED"
  | "OBSERVATION_RANKING_NOT_MODELED"
  | "OBSERVATION_VALUE_NOT_MODELED"
  | "INFORMATION_GAIN_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "OBSERVATION_COST_NOT_MODELED"
  | "OBSERVATION_LATENCY_NOT_MODELED"
  | "TEMPORAL_URGENCY_NOT_MODELED"
  | "OBSERVATION_SCHEDULING_NOT_MODELED"
  | "OBSERVATION_DISPATCH_NOT_MODELED"
  | "OBSERVATION_RESULT_INGESTION_NOT_MODELED"
  | "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED"
  | "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED"
  | "GENERIC_WORLD_INFORMATION_TARGET_NOT_MODELED"
  | "OBSERVATION_NEED_LIFECYCLE_NOT_MODELED"
  | "ATTENTION_SELECTION_NOT_MODELED"
  | "ATTENTION_ALLOCATION_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-Candidate planning basis assessment.
 * No ready / selected / priority / plan_status.
 */
export interface AttentionCandidateObservationPlanningAssessment {
  candidate_key: string;
  eligibility: AttentionCandidateObservationEligibilityAssessment;
  status: AttentionObservationPlanningBasisStatus;
  planning_basis: AttentionObservationPlanningBasis | null;
  model_limitations: AttentionObservationPlanningModelLimitation[];
}

/**
 * Set-level planning basis assessment.
 * No plans / selected_plans / observation_queue.
 */
export interface AttentionObservationPlanningSetAssessment {
  eligibility_set: AttentionObservationEligibilitySetAssessment;
  candidate_planning: AttentionCandidateObservationPlanningAssessment[];
  has_observation_planning_basis: boolean;
  model_limitations: AttentionObservationPlanningModelLimitation[];
}

export type { AttentionObservationEligibilityBasis };
