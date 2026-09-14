/**
 * Reality Core v0.7 — Attention Observation Observer Candidate types (GROUND-049).
 *
 * Derived only. Not persisted.
 *
 * Observation Planning Basis + explicit Observer Candidate Specification
 * + explicit RealityEntity collection → Observer Candidate Basis only.
 *
 * Sibling of GROUND-048 Capability Requirement — does not depend on it.
 *
 * Observer Candidate ≠ capable / verified / available / permitted /
 * authorized / selected / feasible observer
 */

import type { RealityEntity } from "../types.js";
import type {
  AttentionCandidateObservationPlanningAssessment,
  AttentionObservationPlanningSetAssessment,
} from "./attention-observation-planning-types.js";

/**
 * Canonical RealityEntity identity for Observer Candidate reference.
 * RealityEntity.id — not observer_key / sensor_key / agent_key.
 */
export type CanonicalObserverEntityId = RealityEntity["id"];

/**
 * Runtime evaluation input — not canonical observer registry / policy.
 * No provenance / Authority / preference.
 */
export interface AttentionObservationObserverCandidateInput {
  observation_need_key: string;
  observer_entity_id: CanonicalObserverEntityId;
}

export interface AttentionObservationObserverCandidateSpecification {
  candidates: AttentionObservationObserverCandidateInput[];
}

/**
 * Combined evaluation input.
 * observer_entities is exact-key resolution context only — not discovery pool.
 */
export interface AttentionObservationObserverCandidateEvalInput {
  planning_set: AttentionObservationPlanningSetAssessment;
  specification: AttentionObservationObserverCandidateSpecification;
  observer_entities: RealityEntity[];
}

export type AttentionObservationObserverCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NO_EXPLICIT_OBSERVER_CANDIDATES_DECLARED"
  | "EXPLICIT_OBSERVER_CANDIDATES_PRESENT";

/**
 * ObservationNeed-relative + RealityEntity-relative candidacy.
 * Not capability_match / verification / availability / permission / score.
 */
export interface AttentionObservationObserverCandidate {
  key: string;
  observation_need_key: string;
  observer_entity_id: CanonicalObserverEntityId;
  observer_entity: RealityEntity;
}

/**
 * Descriptive candidate set for one ObservationNeed.
 * Empty candidates ≠ no observer exists / observation impossible.
 */
export interface AttentionObservationObserverCandidateBasis {
  observation_need_key: string;
  candidates: AttentionObservationObserverCandidate[];
}

export type AttentionObservationObserverCandidateModelLimitation =
  | "OBSERVER_CANDIDATE_PROVENANCE_NOT_MODELED"
  | "OBSERVER_CANDIDATE_AUTHORITY_NOT_MODELED"
  | "OBSERVER_CANDIDATE_POLICY_NOT_MODELED"
  | "OBSERVER_DISCOVERY_NOT_MODELED"
  | "OBSERVER_KIND_ELIGIBILITY_NOT_MODELED"
  | "CAPABILITY_REQUIREMENT_MATCHING_NOT_MODELED"
  | "CAPABILITY_VERIFICATION_MATCHING_NOT_MODELED"
  | "CAPABILITY_AVAILABILITY_MATCHING_NOT_MODELED"
  | "OBSERVER_PERMISSION_NOT_MODELED"
  | "OBSERVER_AUTHORITY_NOT_MODELED"
  | "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED"
  | "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED"
  | "OBSERVER_SUITABILITY_NOT_MODELED"
  | "OBSERVATION_FEASIBILITY_NOT_MODELED"
  | "OBSERVER_SELECTION_NOT_MODELED"
  | "OBSERVATION_METHOD_NOT_MODELED"
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
  | "OBSERVER_COMMITMENT_NOT_MODELED"
  | "OBSERVATION_RESULT_INGESTION_NOT_MODELED"
  | "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED"
  | "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Per-AttentionCandidate Observer Candidate assessment.
 * candidate_key = GROUND-040 AttentionCandidate.key
 * nested Observer Candidates use AttentionObservationObserverCandidate.key
 */
export interface AttentionCandidateObservationObserverCandidateAssessment {
  candidate_key: string;
  planning: AttentionCandidateObservationPlanningAssessment;
  status: AttentionObservationObserverCandidateStatus;
  observer_candidate_basis: AttentionObservationObserverCandidateBasis | null;
  has_explicit_observer_candidates: boolean;
  model_limitations: AttentionObservationObserverCandidateModelLimitation[];
}

/**
 * Set-level Observer Candidate assessment.
 * No matched / suitable / selected / ready lists.
 */
export interface AttentionObservationObserverCandidateSetAssessment {
  planning_set: AttentionObservationPlanningSetAssessment;
  specification: AttentionObservationObserverCandidateSpecification;
  candidate_assessments: AttentionCandidateObservationObserverCandidateAssessment[];
  has_explicit_observer_candidates: boolean;
  model_limitations: AttentionObservationObserverCandidateModelLimitation[];
}
