/**
 * Reality Core v0.7 — Permission Core I derived types (GROUND-024).
 *
 * Permission ≠ Authority / Capability / Resource / Mandate / Standing /
 * Decision / Intent / Commitment / execution / software ACL.
 * Assessment statuses are declaration aggregation only — no effective winner.
 */

import type {
  AuthorityProvenanceAssessment,
  DeclaredAuthorityAssessment,
} from "./governance-types.js";
import type { ReferenceDeclarer } from "../types.js";

export type DeclaredInterventionPermissionStatus =
  | "NO_PERMISSION_DECLARATIONS"
  | "PERMIT_DECLARED"
  | "PROHIBIT_DECLARED"
  | "CONTESTED_PERMISSION";

export interface DeclaredInterventionPermissionAssessment {
  actor_entity_id: string;
  intervention_id: string;
  at: string;
  status: DeclaredInterventionPermissionStatus;
  permission_declaration_ids: string[];
  permit_declaration_ids: string[];
  prohibit_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_permit_declaration: boolean;
  has_prohibit_declaration: boolean;
  has_permission_conflict: boolean;
  intervention_active: boolean;
  has_temporal_basis_mismatch: boolean;
}

export interface PermissionIssuerGovernanceContext {
  permission_declaration_id: string;
  declarer_entity_id: string | null;
  direct_authority: DeclaredAuthorityAssessment;
  authority_provenance: AuthorityProvenanceAssessment | null;
  has_direct_declared_authority: boolean;
  has_delegated_authority_claim: boolean;
  has_contested_authority_path: boolean;
}

/** Descriptive aggregate only — flags do not pick a permission winner. */
export interface InterventionPermissionGovernanceAssessment {
  permission: DeclaredInterventionPermissionAssessment;
  declaration_governance_contexts: PermissionIssuerGovernanceContext[];
  has_permission_from_direct_authority_declarer: boolean;
  has_permission_from_delegated_authority_claim: boolean;
  has_permission_from_declarer_without_declared_authority: boolean;
  has_permission_from_contested_authority_path: boolean;
}
