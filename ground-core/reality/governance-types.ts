/**
 * Reality Core v0.7 — Governance Core derived types (GROUND-019).
 *
 * AuthorityDeclaration ≠ software permission / Capability / Mandate / legitimacy.
 * StandingDeclaration ≠ Authority / Affectedness.
 * MandateDeclaration ≠ Intent / Commitment / Capability.
 */

import type {
  AuthorityContestDeclaration,
  AuthorityPower,
  GovernanceScope,
  ReferenceDeclarer,
  StandingRight,
  StandingScope,
} from "../types.js";

export type DeclaredAuthorityStatus =
  | "DECLARED_AUTHORITY_PRESENT"
  | "NO_DECLARED_AUTHORITY"
  | "DECLARER_NOT_ENTITY";

export interface DeclaredAuthorityAssessment {
  holder_entity_id: string | null;
  power: AuthorityPower;
  scope: GovernanceScope;
  at: string;
  status: DeclaredAuthorityStatus;
  authority_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

export type DeclaredStandingStatus =
  | "DECLARED_STANDING_PRESENT"
  | "NO_DECLARED_STANDING";

export interface DeclaredStandingAssessment {
  holder_entity_id: string;
  scope: StandingScope;
  at: string;
  rights: StandingRight[];
  standing_declaration_ids: string[];
  status: DeclaredStandingStatus;
}

export type MandateAssessmentStatus =
  | "ACTIVE_MANDATE_PRESENT"
  | "NO_ACTIVE_MANDATE";

export interface MandateAssessment {
  holder_entity_id: string;
  objective_id: string;
  at: string;
  active_mandate_ids: string[];
  status: MandateAssessmentStatus;
  declarers: ReferenceDeclarer[];
}

export interface ObjectiveGovernanceContext {
  objective_id: string;
  at: string;
  objective_declarer_authority: DeclaredAuthorityAssessment;
  mandate_holder_ids: string[];
  mandates: MandateAssessment[];
  standing: DeclaredStandingAssessment[];
}

export interface ReferenceGovernanceContext {
  reference_condition_id: string;
  at: string;
  declarer_authority: DeclaredAuthorityAssessment;
  standing_holders: DeclaredStandingAssessment[];
}

export interface ImpactGovernanceContext {
  impact_declaration_id: string;
  at: string;
  impact_declarer_authority: DeclaredAuthorityAssessment;
  measure_declarer_authorities: DeclaredAuthorityAssessment[];
  standing_holders: DeclaredStandingAssessment[];
}

/**
 * Reality Core v0.7 — Governance Core II derived types (GROUND-020).
 *
 * Provenance ≠ precedence. Contest ≠ revocation. Delegation ≠ effective Authority.
 */

export type DelegationBasisStatus =
  | "SOURCE_DECLARED_AUTHORITY_ACTIVE"
  | "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE"
  | "DELEGATION_NOT_ACTIVE";

export interface AuthorityDelegationAssessment {
  delegation_id: string;
  delegator_entity_id: string;
  delegatee_entity_id: string;
  power: AuthorityPower;
  scope: GovernanceScope;
  at: string;
  delegation_active: boolean;
  source_authority_declaration_ids: string[];
  active_source_authority_declaration_ids: string[];
  inactive_source_authority_declaration_ids: string[];
  basis_status: DelegationBasisStatus;
  declared_by: ReferenceDeclarer;
}

export type AuthorityProvenancePathKind =
  | "DIRECT_DECLARATION"
  | "ONE_HOP_DELEGATION";

export type AuthorityProvenanceSourceBasisStatus =
  | "DIRECT"
  | "SOURCE_DECLARED_AUTHORITY_ACTIVE"
  | "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE";

export interface AuthorityProvenancePath {
  key: string;
  kind: AuthorityProvenancePathKind;
  holder_entity_id: string;
  power: AuthorityPower;
  scope: GovernanceScope;
  at: string;
  authority_declaration_ids: string[];
  delegation_declaration_ids: string[];
  delegator_entity_ids: string[];
  source_basis_status: AuthorityProvenanceSourceBasisStatus;
  contested: boolean;
  contest_declaration_ids: string[];
  has_contested_source_authority: boolean;
  source_authority_contest_declaration_ids: string[];
}

export interface AuthorityProvenanceAssessment {
  holder_entity_id: string;
  power: AuthorityPower;
  scope: GovernanceScope;
  at: string;
  direct_authority: DeclaredAuthorityAssessment;
  applicable_delegations_to_holder: AuthorityDelegationAssessment[];
  provenance_paths: AuthorityProvenancePath[];
  has_direct_declared_authority: boolean;
  has_delegated_authority_claim: boolean;
  has_delegation_with_active_source_basis: boolean;
  has_delegation_without_active_source_basis: boolean;
  has_contested_path: boolean;
}

export type ContestStandingContext =
  | "DECLARED_CONTEST_STANDING_PRESENT"
  | "NO_DECLARED_CONTEST_STANDING"
  | "STANDING_SCOPE_NOT_MAPPABLE";

export interface ContestStandingContextEntry {
  contest_declaration_id: string;
  contesting_entity_id: string;
  status: ContestStandingContext;
  standing_declaration_ids: string[];
}

export interface AuthorityContestAssessment {
  target_key: string;
  at: string;
  active_contest_declarations: AuthorityContestDeclaration[];
  contesting_entity_ids: string[];
  standing_contexts: ContestStandingContextEntry[];
  has_active_contest: boolean;
  has_contest_with_declared_standing: boolean;
  has_contest_without_declared_standing: boolean;
}

export interface AuthorityGovernanceContext {
  holder_entity_id: string;
  power: AuthorityPower;
  scope: GovernanceScope;
  at: string;
  provenance: AuthorityProvenanceAssessment;
  contests: AuthorityContestAssessment;
}
