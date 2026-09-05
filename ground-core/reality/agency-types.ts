/**
 * Reality Core v0.7 — Agency Composition I derived types (GROUND-026).
 *
 * Actor Candidate ≠ selected actor / executor / Intent / Commitment.
 * Requirement match ≠ satisfaction / feasibility / Resource sufficiency.
 */

import type { CapabilityAssessment } from "./capability-types.js";
import type { DecisionSpaceAssessment } from "./decision-types.js";
import type { InterventionSpecificationAssessment } from "./intervention-types.js";
import type {
  DeclaredInterventionPermissionAssessment,
  InterventionPermissionGovernanceAssessment,
} from "./permission-types.js";
import type { ResourceAssessment } from "./resource-types.js";
import type {
  CapabilityScope,
  ReferenceDeclarer,
  ResourceRequirementAmount,
  ResourceScope,
} from "../types.js";

export interface DecisionOptionActorCandidatePosition {
  key: string;
  decision_space_id: string;
  intervention_id: string;
  actor_entity_id: string;
  candidate_declaration_ids: string[];
  supporting_option_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

export interface CapabilityRequirementMatchAssessment {
  capability_key: string;
  capability_scope: CapabilityScope;
  requirement_declaration_ids: string[];
  actor_entity_id: string;
  matching_capability_declaration_ids: string[];
  matching_capability_assessments: CapabilityAssessment[];
  has_matching_capability_declaration: boolean;
  has_matching_active_verification: boolean;
  has_matching_available_declaration: boolean;
  has_matching_unavailable_declaration: boolean;
  has_matching_contested_availability: boolean;
}

export interface ResourceRequirementMatchAssessment {
  resource_key: string;
  unit: string;
  resource_scope: ResourceScope;
  requirement_declaration_ids: string[];
  required_amounts: ResourceRequirementAmount[];
  has_requirement_divergence: boolean;
  matching_resource_declaration_ids: string[];
  matching_resource_assessments: ResourceAssessment[];
  matching_resource_holder_ids: string[];
  has_matching_resource_declaration: boolean;
  has_matching_capacity_declaration: boolean;
  has_matching_capacity_divergence: boolean;
  has_matching_available_declaration: boolean;
  has_matching_unavailable_declaration: boolean;
  has_matching_contested_availability: boolean;
}

export interface DecisionOptionActorCompositionAssessment {
  candidate_position: DecisionOptionActorCandidatePosition;
  at: string;
  decision_space_id: string;
  intervention_id: string;
  actor_entity_id: string;
  intervention_specification: InterventionSpecificationAssessment;
  permission: DeclaredInterventionPermissionAssessment;
  permission_governance: InterventionPermissionGovernanceAssessment | null;
  capability_requirement_matches: CapabilityRequirementMatchAssessment[];
  resource_requirement_matches: ResourceRequirementMatchAssessment[];
  has_capability_requirements: boolean;
  has_resource_requirements: boolean;
  has_capability_requirement_without_match: boolean;
  has_resource_requirement_without_match: boolean;
  has_matching_verified_capability: boolean;
  has_matching_available_capability: boolean;
  has_matching_available_resource: boolean;
  has_permission_declarations: boolean;
  has_permission_conflict: boolean;
  has_decision_space_temporal_mismatch: boolean;
  has_option_temporal_mismatch: boolean;
  has_intervention_temporal_mismatch: boolean;
  has_temporal_basis_mismatch: boolean;
}

export interface DecisionSpaceActorCompositionAssessment {
  decision_space_id: string;
  at: string;
  decision_space: DecisionSpaceAssessment;
  actor_candidate_positions: DecisionOptionActorCandidatePosition[];
  actor_compositions: DecisionOptionActorCompositionAssessment[];
  actor_candidate_count: number;
  intervention_option_ids_without_actor_candidates: string[];
  has_actor_candidates: boolean;
}
