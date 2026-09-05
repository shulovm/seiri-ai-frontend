/**
 * Reality Core v0.7 — Intervention Core I derived types (GROUND-023).
 *
 * Intervention ≠ executed Action / RealityEvent / NextAction / Decision / Intent.
 * Requirements ≠ feasibility / matching / Permission / Commitment.
 */

import type {
  CapabilityScope,
  InterventionCapabilityRequirementDeclaration,
  InterventionDeclaration,
  InterventionResourceRequirementDeclaration,
  InterventionScope,
  ResourceRequirementAmount,
  ResourceScope,
} from "../types.js";

export type InterventionDeclarationAssessmentStatus =
  | "INTERVENTION_DECLARATION_ACTIVE"
  | "INTERVENTION_DECLARATION_NOT_ACTIVE";

export interface InterventionCapabilityRequirementGroup {
  intervention_id: string;
  capability_key: string;
  capability_scope: CapabilityScope;
  requirement_declaration_ids: string[];
}

export interface InterventionResourceRequirementGroup {
  intervention_id: string;
  resource_key: string;
  unit: string;
  resource_scope: ResourceScope;
  requirement_declaration_ids: string[];
  required_amounts: ResourceRequirementAmount[];
  has_requirement_divergence: boolean;
}

export interface InterventionSpecificationAssessment {
  intervention: InterventionDeclaration;
  at: string;
  declaration_status: InterventionDeclarationAssessmentStatus;
  applicable_capability_requirements: InterventionCapabilityRequirementDeclaration[];
  applicable_resource_requirements: InterventionResourceRequirementDeclaration[];
  has_capability_requirements: boolean;
  has_resource_requirements: boolean;
  has_temporal_basis_mismatch: boolean;
}

export interface FindDeclaredInterventionsQuery {
  interventionKey: string;
  targetScope: InterventionScope;
  at: string;
}
