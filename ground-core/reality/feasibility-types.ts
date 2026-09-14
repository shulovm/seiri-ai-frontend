/**
 * Reality Core v0.7 — Feasibility Basis I derived types (GROUND-027).
 *
 * FeasibilityBasis ≠ FeasibilityVerdict / satisfaction / selection / execution.
 * Gap ≠ failure. Constraint ≠ BLOCKER. Model limitation ≠ Reality fact.
 */

import type {
  CapabilityRequirementMatchAssessment,
  DecisionOptionActorCompositionAssessment,
  DecisionSpaceActorCompositionAssessment,
  ResourceRequirementMatchAssessment,
} from "./agency-types.js";
import type { CapabilityAssessment } from "./capability-types.js";
import type {
  DeclaredInterventionPermissionStatus,
  InterventionPermissionGovernanceAssessment,
} from "./permission-types.js";
import type { ResourceAssessment } from "./resource-types.js";
import type {
  CapabilityScope,
  ResourceRequirementAmount,
  ResourceScope,
} from "../types.js";

export interface CapabilityFeasibilityBasis {
  actor_entity_id: string;
  capability_key: string;
  capability_scope: CapabilityScope;
  requirement_declaration_ids: string[];
  matching_capability_declaration_ids: string[];
  matching_capability_assessments: CapabilityAssessment[];
  has_exact_match: boolean;
  has_active_verification: boolean;
  has_any_availability_declaration: boolean;
  has_available_declaration: boolean;
  has_unavailable_declaration: boolean;
  has_existing_contested_availability: boolean;
}

export interface ResourceFeasibilityBasis {
  resource_key: string;
  unit: string;
  resource_scope: ResourceScope;
  requirement_declaration_ids: string[];
  required_amounts: ResourceRequirementAmount[];
  has_requirement_divergence: boolean;
  matching_resource_declaration_ids: string[];
  matching_resource_assessments: ResourceAssessment[];
  matching_resource_holder_ids: string[];
  has_exact_match: boolean;
  has_any_capacity_declaration: boolean;
  has_capacity_divergence: boolean;
  has_any_availability_declaration: boolean;
  has_available_declaration: boolean;
  has_unavailable_declaration: boolean;
  has_existing_contested_availability: boolean;
}

export interface PermissionFeasibilityBasis {
  actor_entity_id: string;
  intervention_id: string;
  permission_status: DeclaredInterventionPermissionStatus;
  permission_declaration_ids: string[];
  permit_declaration_ids: string[];
  prohibit_declaration_ids: string[];
  has_permit_declaration: boolean;
  has_prohibit_declaration: boolean;
  has_permission_conflict: boolean;
  governance: InterventionPermissionGovernanceAssessment | null;
}

export type FeasibilityBasisGapKind =
  | "CAPABILITY_EXACT_MATCH_ABSENT"
  | "CAPABILITY_ACTIVE_VERIFICATION_ABSENT"
  | "CAPABILITY_AVAILABILITY_UNDECLARED"
  | "RESOURCE_EXACT_MATCH_ABSENT"
  | "RESOURCE_CAPACITY_UNDECLARED"
  | "RESOURCE_AVAILABILITY_UNDECLARED"
  | "INTERVENTION_PERMISSION_UNDECLARED"
  | "TEMPORAL_BASIS_MISMATCH";

export interface FeasibilityBasisGap {
  key: string;
  kind: FeasibilityBasisGapKind;
  related_key: string;
}

export type FeasibilityBasisContestKind =
  | "CAPABILITY_AVAILABILITY_CONTEST_PRESENT"
  | "RESOURCE_CAPACITY_DIVERGENCE_PRESENT"
  | "RESOURCE_AVAILABILITY_CONTEST_PRESENT"
  | "INTERVENTION_PERMISSION_CONTEST_PRESENT"
  | "PERMISSION_ISSUER_AUTHORITY_CONTEST_PRESENT";

export interface FeasibilityBasisContest {
  key: string;
  kind: FeasibilityBasisContestKind;
  related_key: string;
  source_ids: string[];
}

export type DeclaredExecutionConstraintKind =
  | "CAPABILITY_UNAVAILABLE_DECLARATION_PRESENT"
  | "RESOURCE_UNAVAILABLE_DECLARATION_PRESENT"
  | "INTERVENTION_PROHIBIT_DECLARATION_PRESENT";

export interface DeclaredExecutionConstraint {
  key: string;
  kind: DeclaredExecutionConstraintKind;
  source_declaration_ids: string[];
}

export type FeasibilityModelLimitation =
  | "EFFECTIVE_CAPABILITY_NOT_MODELED"
  | "EFFECTIVE_PERMISSION_NOT_MODELED"
  | "AUTHORITY_PRECEDENCE_NOT_MODELED"
  | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
  | "RESOURCE_ACCESS_PERMISSION_NOT_MODELED"
  | "RESOURCE_RESERVATION_NOT_MODELED"
  | "COMMITMENT_NOT_MODELED"
  | "EXECUTION_CONDITIONS_NOT_MODELED";

export interface DecisionOptionActorFeasibilityBasisAssessment {
  candidate_composition: DecisionOptionActorCompositionAssessment;
  at: string;
  capability_bases: CapabilityFeasibilityBasis[];
  resource_bases: ResourceFeasibilityBasis[];
  permission_basis: PermissionFeasibilityBasis;
  gaps: FeasibilityBasisGap[];
  contests: FeasibilityBasisContest[];
  declared_constraints: DeclaredExecutionConstraint[];
  model_limitations: FeasibilityModelLimitation[];
  has_gaps: boolean;
  has_contests: boolean;
  has_declared_constraints: boolean;
  has_model_limitations: boolean;
}

export interface DecisionSpaceFeasibilityBasisAssessment {
  decision_space_id: string;
  at: string;
  actor_composition: DecisionSpaceActorCompositionAssessment;
  actor_feasibility_bases: DecisionOptionActorFeasibilityBasisAssessment[];
  intervention_option_ids_without_actor_candidates: string[];
  has_actor_feasibility_bases: boolean;
}

export type {
  CapabilityRequirementMatchAssessment,
  ResourceRequirementMatchAssessment,
};
