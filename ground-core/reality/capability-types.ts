/**
 * Reality Core v0.7 — Capability Core I derived types (GROUND-021).
 *
 * Capability ≠ Authority / Permission / Mandate / Resource / Commitment.
 * Verification ≠ PROVEN / availability. Availability ≠ can_execute.
 */

import type {
  CapabilityAvailabilityStatus,
  CapabilityDeclaration,
  CapabilityScope,
  ReferenceDeclarer,
} from "../types.js";

export type CapabilityDeclarationAssessmentStatus =
  | "CAPABILITY_DECLARATION_ACTIVE"
  | "CAPABILITY_DECLARATION_NOT_ACTIVE";

export type CapabilityVerificationAssessmentStatus =
  | "NO_ACTIVE_VERIFICATION"
  | "ACTIVE_VERIFICATION_PRESENT";

export interface CapabilityVerificationAssessment {
  capability_declaration_id: string;
  at: string;
  status: CapabilityVerificationAssessmentStatus;
  verification_declaration_ids: string[];
  evidence_ids: string[];
  verifiers: ReferenceDeclarer[];
  has_multiple_verifications: boolean;
}

export type CapabilityAvailabilityAssessmentStatus =
  | "NO_AVAILABILITY_DECLARATIONS"
  | "AVAILABLE_DECLARED"
  | "UNAVAILABLE_DECLARED"
  | "CONTESTED_AVAILABILITY";

export interface CapabilityAvailabilityAssessment {
  capability_declaration_id: string;
  at: string;
  status: CapabilityAvailabilityAssessmentStatus;
  availability_declaration_ids: string[];
  available_declaration_ids: string[];
  unavailable_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface CapabilityAssessment {
  capability: CapabilityDeclaration;
  at: string;
  declaration_status: CapabilityDeclarationAssessmentStatus;
  verification: CapabilityVerificationAssessment;
  availability: CapabilityAvailabilityAssessment;
  has_active_declared_capability: boolean;
  has_active_verification: boolean;
  has_available_declaration: boolean;
  has_unavailable_declaration: boolean;
  has_contested_availability: boolean;
  has_temporal_basis_mismatch: boolean;
}

export interface FindDeclaredCapabilitiesQuery {
  holderEntityId: string;
  capabilityKey: string;
  scope: CapabilityScope;
  at: string;
}

export type { CapabilityAvailabilityStatus };
