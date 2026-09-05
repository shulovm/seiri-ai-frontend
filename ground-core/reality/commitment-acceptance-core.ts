import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Commitment Acceptance assessment (GROUND-031).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Acceptance != Commitment / Intent / Permission / Authority /
 * legal enforceability / Resource binding / Execution.
 * No effective / binding / current / latest Acceptance.
 */

import {
  assessInterventionCommitmentContext,
  interventionCommitmentSemanticKey,
} from "./commitment-core.js";
import type {
  CommitmentAcceptanceContextAssessment,
  CommitmentAcceptanceHistory,
  CommitmentAcceptanceModelLimitation,
  CommitmentAcceptancePosition,
  CommitmentAcceptanceSourceRelation,
  CommitmentAcceptanceSourceRelationAssessment,
  DeclaredCommitmentAcceptanceAssessment,
  DeclaredCommitmentAcceptanceStatus,
} from "./commitment-acceptance-types.js";
import type {
  InterventionCommitmentAcceptanceDeclaration,
  InterventionCommitmentDeclaration,
  ProjectState,
  ReferenceDeclarer,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function declarerKey(declarer: ReferenceDeclarer): string {
  return [
    declarer.kind,
    declarer.entity_id ?? "",
    declarer.external_id ?? "",
    declarer.label ?? "",
  ].join("|");
}

function sortDeclarers(declarers: ReferenceDeclarer[]): ReferenceDeclarer[] {
  return [...declarers].sort((a, b) =>
    declarerKey(a).localeCompare(declarerKey(b))
  );
}

export const COMMITMENT_ACCEPTANCE_MODEL_LIMITATIONS: CommitmentAcceptanceModelLimitation[] =
  [
    "COMMITMENT_AUTHORITY_NOT_MODELED",
    "LEGAL_ENFORCEABILITY_NOT_MODELED",
    "COUNTERPARTY_NOT_MODELED",
    "COUNTERPARTY_ACCEPTANCE_NOT_MODELED",
    "RESOURCE_BINDING_NOT_MODELED",
    "DEADLINE_NOT_MODELED",
    "CONDITIONAL_COMMITMENT_NOT_MODELED",
    "COMMITMENT_RELEASE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function commitmentAcceptanceSemanticKey(
  commitmentSemanticKey: string,
  acceptedAt: string
): string {
  return `commitment-acceptance|${commitmentSemanticKey}|${temporalInstantKey(acceptedAt)}`;
}

export function compareInterventionCommitmentAcceptanceDeclarations(
  a: InterventionCommitmentAcceptanceDeclaration,
  b: InterventionCommitmentAcceptanceDeclaration
): number {
  if (compareTemporalInstants(a.accepted_at, b.accepted_at) !== 0) {
    return compareTemporalInstants(a.accepted_at, b.accepted_at) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function assessCommitmentAcceptanceSourceRelation(
  acceptance: InterventionCommitmentAcceptanceDeclaration,
  commitment: InterventionCommitmentDeclaration
): CommitmentAcceptanceSourceRelationAssessment {
  const declarerEntityId = acceptance.declared_by.entity_id ?? null;
  let source_relation: CommitmentAcceptanceSourceRelation;
  if (declarerEntityId == null || declarerEntityId === "") {
    source_relation = "DECLARED_BY_NON_ENTITY_SOURCE";
  } else if (declarerEntityId === commitment.commitment_holder_entity_id) {
    source_relation = "SELF_DECLARED_BY_COMMITMENT_HOLDER";
  } else {
    source_relation = "DECLARED_BY_OTHER_ENTITY";
  }

  return {
    acceptance_declaration_id: acceptance.id,
    source_relation,
  };
}

function requireCommitment(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentDeclaration {
  const commitment = projectState.intervention_commitment_declarations.find(
    (entry) => entry.id === commitmentDeclarationId
  );
  if (!commitment) {
    throw new Error(
      `InterventionCommitmentDeclaration ${commitmentDeclarationId} not found in project state`
    );
  }
  return commitment;
}

function semanticKeyForCommitment(
  commitment: InterventionCommitmentDeclaration
): string {
  return interventionCommitmentSemanticKey(
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  );
}

export function getEquivalentCommitmentDeclarations(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentDeclaration[] {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  return projectState.intervention_commitment_declarations
    .filter((entry) => semanticKeyForCommitment(entry) === key)
    .sort((a, b) => compareIds(a.id, b.id));
}

export function getCommitmentAcceptanceDeclarations(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentAcceptanceDeclaration[] {
  const equivalentIds = new Set(
    getEquivalentCommitmentDeclarations(
      projectState,
      commitmentDeclarationId
    ).map((entry) => entry.id)
  );
  return projectState.intervention_commitment_acceptance_declarations
    .filter((entry) => equivalentIds.has(entry.commitment_declaration_id))
    .sort(compareInterventionCommitmentAcceptanceDeclarations);
}

function groupAcceptanceDeclarationsIntoPositions(
  projectState: ProjectState,
  declarations: InterventionCommitmentAcceptanceDeclaration[],
  commitmentSemanticKey: string,
  holderEntityId: string,
  interventionId: string,
  committedAt: string
): CommitmentAcceptancePosition[] {
  const groups = new Map<
    string,
    InterventionCommitmentAcceptanceDeclaration[]
  >();
  for (const entry of declarations) {
    const key = commitmentAcceptanceSemanticKey(
      commitmentSemanticKey,
      entry.accepted_at
    );
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }

  const positions: CommitmentAcceptancePosition[] = [];
  for (const group of groups.values()) {
    const sorted = [...group].sort(
      compareInterventionCommitmentAcceptanceDeclarations
    );
    const first = sorted[0]!;
    const targetIds = [
      ...new Set(sorted.map((entry) => entry.commitment_declaration_id)),
    ].sort(compareIds);
    positions.push({
      key: commitmentAcceptanceSemanticKey(
        commitmentSemanticKey,
        first.accepted_at
      ),
      commitment_semantic_key: commitmentSemanticKey,
      commitment_holder_entity_id: holderEntityId,
      intervention_id: interventionId,
      committed_at: committedAt,
      accepted_at: first.accepted_at,
      acceptance_declaration_ids: sorted.map((entry) => entry.id),
      targeted_commitment_declaration_ids: targetIds,
      declarers: sortDeclarers(sorted.map((entry) => entry.declared_by)),
      has_multiple_declarations: sorted.length > 1,
    });
  }

  return positions.sort((a, b) => {
    if (compareTemporalInstants(a.accepted_at, b.accepted_at) !== 0) {
      return compareTemporalInstants(a.accepted_at, b.accepted_at) < 0 ? -1 : 1;
    }
    return a.key.localeCompare(b.key);
  });
}

export function groupCommitmentAcceptancePositions(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentAcceptancePosition[] {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const declarations = getCommitmentAcceptanceDeclarations(
    projectState,
    commitmentDeclarationId
  );
  return groupAcceptanceDeclarationsIntoPositions(
    projectState,
    declarations,
    key,
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  );
}

export function assessDeclaredCommitmentAcceptance(
  projectState: ProjectState,
  commitmentDeclarationId: string
): DeclaredCommitmentAcceptanceAssessment {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const declarations = getCommitmentAcceptanceDeclarations(
    projectState,
    commitmentDeclarationId
  );

  const source_relations = declarations.map(
    (entry) =>
      assessCommitmentAcceptanceSourceRelation(entry, commitment).source_relation
  );
  const uniqueRelations = [
    ...new Set(source_relations),
  ] as CommitmentAcceptanceSourceRelation[];
  uniqueRelations.sort((a, b) => a.localeCompare(b));

  const status: DeclaredCommitmentAcceptanceStatus =
    declarations.length === 0
      ? "NO_ACCEPTANCE_DECLARATIONS"
      : "ACCEPTANCE_DECLARED";

  return {
    commitment_semantic_key: key,
    commitment_holder_entity_id: commitment.commitment_holder_entity_id,
    intervention_id: commitment.intervention_id,
    committed_at: commitment.committed_at,
    status,
    acceptance_declaration_ids: declarations.map((entry) => entry.id),
    declarers: sortDeclarers(declarations.map((entry) => entry.declared_by)),
    source_relations: uniqueRelations,
    has_self_declared_acceptance: source_relations.includes(
      "SELF_DECLARED_BY_COMMITMENT_HOLDER"
    ),
    has_other_entity_declared_acceptance: source_relations.includes(
      "DECLARED_BY_OTHER_ENTITY"
    ),
    has_non_entity_declared_acceptance: source_relations.includes(
      "DECLARED_BY_NON_ENTITY_SOURCE"
    ),
    has_multiple_declarations: declarations.length > 1,
  };
}

export function assessCommitmentAcceptanceContext(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentAcceptanceContextAssessment {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  return {
    commitment,
    commitment_context: assessInterventionCommitmentContext(
      projectState,
      commitmentDeclarationId
    ),
    acceptance: assessDeclaredCommitmentAcceptance(
      projectState,
      commitmentDeclarationId
    ),
    model_limitations: [...COMMITMENT_ACCEPTANCE_MODEL_LIMITATIONS],
  };
}

export function getCommitmentAcceptanceHistory(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentAcceptanceHistory {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const declarations = getCommitmentAcceptanceDeclarations(
    projectState,
    commitmentDeclarationId
  );

  return {
    commitment_semantic_key: key,
    commitment_holder_entity_id: commitment.commitment_holder_entity_id,
    intervention_id: commitment.intervention_id,
    committed_at: commitment.committed_at,
    declarations,
    positions: groupAcceptanceDeclarationsIntoPositions(
      projectState,
      declarations,
      key,
      commitment.commitment_holder_entity_id,
      commitment.intervention_id,
      commitment.committed_at
    ),
    has_declarations: declarations.length > 0,
  };
}
