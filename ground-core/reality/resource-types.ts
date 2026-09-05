/**
 * Reality Core v0.7 — Resource Core I derived types (GROUND-022).
 *
 * Resource ≠ Capability / Authority / Permission / Mandate / Commitment.
 * Capacity ≠ availability / free quantity. Availability ≠ can_execute.
 */

import type {
  ResourceAvailabilityStatus,
  ResourceCapacity,
  ResourceDeclaration,
  ResourceScope,
  ReferenceDeclarer,
} from "../types.js";

export type ResourceDeclarationAssessmentStatus =
  | "RESOURCE_DECLARATION_ACTIVE"
  | "RESOURCE_DECLARATION_NOT_ACTIVE";

export type ResourceCapacityAssessmentStatus =
  | "NO_ACTIVE_CAPACITY_DECLARATIONS"
  | "ACTIVE_CAPACITY_DECLARATIONS_PRESENT";

export interface ResourceCapacityAssessment {
  resource_declaration_id: string;
  at: string;
  status: ResourceCapacityAssessmentStatus;
  capacity_declaration_ids: string[];
  capacities: ResourceCapacity[];
  declarers: ReferenceDeclarer[];
  has_multiple_capacity_declarations: boolean;
  has_capacity_divergence: boolean;
}

export type ResourceAvailabilityAssessmentStatus =
  | "NO_AVAILABILITY_DECLARATIONS"
  | "AVAILABLE_DECLARED"
  | "UNAVAILABLE_DECLARED"
  | "CONTESTED_AVAILABILITY";

export interface ResourceAvailabilityAssessment {
  resource_declaration_id: string;
  at: string;
  status: ResourceAvailabilityAssessmentStatus;
  availability_declaration_ids: string[];
  available_declaration_ids: string[];
  unavailable_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface ResourceAssessment {
  resource: ResourceDeclaration;
  at: string;
  declaration_status: ResourceDeclarationAssessmentStatus;
  capacity: ResourceCapacityAssessment;
  availability: ResourceAvailabilityAssessment;
  has_active_resource_declaration: boolean;
  has_capacity_declaration: boolean;
  has_capacity_divergence: boolean;
  has_available_declaration: boolean;
  has_unavailable_declaration: boolean;
  has_contested_availability: boolean;
  has_temporal_basis_mismatch: boolean;
}

export interface FindDeclaredResourcesQuery {
  holderEntityId: string;
  resourceKey: string;
  unit: string;
  scope: ResourceScope;
  at: string;
}

export type { ResourceAvailabilityStatus };
