/**
 * Reality Core v0.7 — Commitment Temporal Term assessment (GROUND-032).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Temporal Term != Commitment / Acceptance / execution schedule /
 * valid_until / Resource binding / legal obligation / effective deadline.
 * No current / binding / accepted deadline. No wall-clock satisfaction verdict.
 */

import {
  assessInterventionCommitmentContext,
  interventionCommitmentSemanticKey,
} from "./commitment-core.js";
import { assessDeclaredCommitmentAcceptance } from "./commitment-acceptance-core.js";
import type {
  CommitmentTemporalTermContextAssessment,
  CommitmentTemporalTermDivergence,
  CommitmentTemporalTermHistory,
  CommitmentTemporalTermModelLimitation,
  CommitmentTemporalTermPosition,
  CommitmentTemporalTermSourceRelation,
  CommitmentTemporalTermSourceRelationAssessment,
  DeclaredCommitmentTemporalTermsAssessment,
} from "./commitment-temporal-term-types.js";
import type {
  CommitmentTemporalTermKind,
  InterventionCommitmentDeclaration,
  InterventionCommitmentTemporalTermDeclaration,
  ProjectState,
  ReferenceDeclarer,
} from "../types.js";

const TERM_KIND_ORDER: Record<CommitmentTemporalTermKind, number> = {
  START_BY: 0,
  COMPLETE_BY: 1,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareTermKinds(
  a: CommitmentTemporalTermKind,
  b: CommitmentTemporalTermKind
): number {
  return TERM_KIND_ORDER[a] - TERM_KIND_ORDER[b];
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

export const COMMITMENT_TEMPORAL_TERM_MODEL_LIMITATIONS: CommitmentTemporalTermModelLimitation[] =
  [
    "TEMPORAL_TERM_ACCEPTANCE_NOT_MODELED",
    "TEMPORAL_TERM_AUTHORITY_NOT_MODELED",
    "EFFECTIVE_DEADLINE_NOT_MODELED",
    "EXECUTION_START_NOT_MODELED",
    "EXECUTION_COMPLETION_NOT_MODELED",
    "DEADLINE_SATISFACTION_NOT_MODELED",
    "TEMPORAL_TERM_CORRECTION_NOT_MODELED",
    "TEMPORAL_TERM_SUPERSESSION_NOT_MODELED",
  ];

export function commitmentTemporalTermSemanticKey(
  commitmentSemanticKey: string,
  termKind: CommitmentTemporalTermKind,
  deadlineAt: string
): string {
  return `commitment-temporal-term|${commitmentSemanticKey}|${termKind}|${deadlineAt}`;
}

export function commitmentTemporalTermDivergenceKey(
  commitmentSemanticKey: string,
  termKind: CommitmentTemporalTermKind
): string {
  return `commitment-temporal-term-divergence|${commitmentSemanticKey}|${termKind}`;
}

export function compareInterventionCommitmentTemporalTermDeclarations(
  a: InterventionCommitmentTemporalTermDeclaration,
  b: InterventionCommitmentTemporalTermDeclaration
): number {
  const kindCmp = compareTermKinds(a.term_kind, b.term_kind);
  if (kindCmp !== 0) {
    return kindCmp;
  }
  if (a.deadline_at !== b.deadline_at) {
    return a.deadline_at < b.deadline_at ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function assessCommitmentTemporalTermSourceRelation(
  term: InterventionCommitmentTemporalTermDeclaration,
  commitment: InterventionCommitmentDeclaration
): CommitmentTemporalTermSourceRelationAssessment {
  const declarerEntityId = term.declared_by.entity_id ?? null;
  let source_relation: CommitmentTemporalTermSourceRelation;
  if (declarerEntityId == null || declarerEntityId === "") {
    source_relation = "DECLARED_BY_NON_ENTITY_SOURCE";
  } else if (declarerEntityId === commitment.commitment_holder_entity_id) {
    source_relation = "DECLARED_BY_COMMITMENT_HOLDER";
  } else {
    source_relation = "DECLARED_BY_OTHER_ENTITY";
  }

  return {
    temporal_term_declaration_id: term.id,
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

function getEquivalentCommitmentDeclarations(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentDeclaration[] {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  return projectState.intervention_commitment_declarations
    .filter((entry) => semanticKeyForCommitment(entry) === key)
    .sort((a, b) => compareIds(a.id, b.id));
}

export function getCommitmentTemporalTermDeclarations(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentTemporalTermDeclaration[] {
  const equivalentIds = new Set(
    getEquivalentCommitmentDeclarations(
      projectState,
      commitmentDeclarationId
    ).map((entry) => entry.id)
  );
  return projectState.intervention_commitment_temporal_term_declarations
    .filter((entry) => equivalentIds.has(entry.commitment_declaration_id))
    .sort(compareInterventionCommitmentTemporalTermDeclarations);
}

function groupTemporalTermDeclarationsIntoPositions(
  declarations: InterventionCommitmentTemporalTermDeclaration[],
  commitmentSemanticKey: string,
  holderEntityId: string,
  interventionId: string,
  committedAt: string
): CommitmentTemporalTermPosition[] {
  const groups = new Map<
    string,
    InterventionCommitmentTemporalTermDeclaration[]
  >();
  for (const entry of declarations) {
    const key = commitmentTemporalTermSemanticKey(
      commitmentSemanticKey,
      entry.term_kind,
      entry.deadline_at
    );
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }

  const positions: CommitmentTemporalTermPosition[] = [];
  for (const group of groups.values()) {
    const sorted = [...group].sort(
      compareInterventionCommitmentTemporalTermDeclarations
    );
    const first = sorted[0]!;
    const targetIds = [
      ...new Set(sorted.map((entry) => entry.commitment_declaration_id)),
    ].sort(compareIds);
    positions.push({
      key: commitmentTemporalTermSemanticKey(
        commitmentSemanticKey,
        first.term_kind,
        first.deadline_at
      ),
      commitment_semantic_key: commitmentSemanticKey,
      commitment_holder_entity_id: holderEntityId,
      intervention_id: interventionId,
      committed_at: committedAt,
      term_kind: first.term_kind,
      deadline_at: first.deadline_at,
      temporal_term_declaration_ids: sorted.map((entry) => entry.id),
      targeted_commitment_declaration_ids: targetIds,
      declarers: sortDeclarers(sorted.map((entry) => entry.declared_by)),
      has_multiple_declarations: sorted.length > 1,
    });
  }

  return positions.sort((a, b) => {
    const kindCmp = compareTermKinds(a.term_kind, b.term_kind);
    if (kindCmp !== 0) {
      return kindCmp;
    }
    if (a.deadline_at !== b.deadline_at) {
      return a.deadline_at < b.deadline_at ? -1 : 1;
    }
    return a.key.localeCompare(b.key);
  });
}

export function groupCommitmentTemporalTermPositions(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentTemporalTermPosition[] {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const declarations = getCommitmentTemporalTermDeclarations(
    projectState,
    commitmentDeclarationId
  );
  return groupTemporalTermDeclarationsIntoPositions(
    declarations,
    key,
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  );
}

export function detectCommitmentTemporalTermDivergences(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentTemporalTermDivergence[] {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const positions = groupCommitmentTemporalTermPositions(
    projectState,
    commitmentDeclarationId
  );
  return divergencesFromPositions(positions, key);
}

function divergencesFromPositions(
  positions: CommitmentTemporalTermPosition[],
  commitmentSemanticKey: string
): CommitmentTemporalTermDivergence[] {
  const byKind = new Map<
    CommitmentTemporalTermKind,
    CommitmentTemporalTermPosition[]
  >();
  for (const position of positions) {
    const group = byKind.get(position.term_kind) ?? [];
    group.push(position);
    byKind.set(position.term_kind, group);
  }

  const divergences: CommitmentTemporalTermDivergence[] = [];
  for (const [termKind, group] of byKind.entries()) {
    const distinctDeadlines = [
      ...new Set(group.map((entry) => entry.deadline_at)),
    ].sort();
    if (distinctDeadlines.length < 2) {
      continue;
    }
    const sortedGroup = [...group].sort((a, b) => {
      if (a.deadline_at !== b.deadline_at) {
        return a.deadline_at < b.deadline_at ? -1 : 1;
      }
      return a.key.localeCompare(b.key);
    });
    divergences.push({
      key: commitmentTemporalTermDivergenceKey(
        commitmentSemanticKey,
        termKind
      ),
      commitment_semantic_key: commitmentSemanticKey,
      term_kind: termKind,
      deadline_values: distinctDeadlines,
      temporal_term_position_keys: sortedGroup.map((entry) => entry.key),
      temporal_term_declaration_ids: sortedGroup
        .flatMap((entry) => entry.temporal_term_declaration_ids)
        .sort(compareIds),
      declarers: sortDeclarers(
        sortedGroup.flatMap((entry) => entry.declarers)
      ),
    });
  }

  return divergences.sort((a, b) => {
    const kindCmp = compareTermKinds(a.term_kind, b.term_kind);
    if (kindCmp !== 0) {
      return kindCmp;
    }
    return a.key.localeCompare(b.key);
  });
}

export function assessDeclaredCommitmentTemporalTerms(
  projectState: ProjectState,
  commitmentDeclarationId: string
): DeclaredCommitmentTemporalTermsAssessment {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const positions = groupCommitmentTemporalTermPositions(
    projectState,
    commitmentDeclarationId
  );
  const divergences = divergencesFromPositions(positions, key);

  return {
    commitment_semantic_key: key,
    commitment_holder_entity_id: commitment.commitment_holder_entity_id,
    intervention_id: commitment.intervention_id,
    committed_at: commitment.committed_at,
    positions,
    divergences,
    has_temporal_terms: positions.length > 0,
    has_start_by_terms: positions.some((entry) => entry.term_kind === "START_BY"),
    has_complete_by_terms: positions.some(
      (entry) => entry.term_kind === "COMPLETE_BY"
    ),
    has_start_by_divergence: divergences.some(
      (entry) => entry.term_kind === "START_BY"
    ),
    has_complete_by_divergence: divergences.some(
      (entry) => entry.term_kind === "COMPLETE_BY"
    ),
  };
}

export function assessCommitmentTemporalTermContext(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentTemporalTermContextAssessment {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const declarations = getCommitmentTemporalTermDeclarations(
    projectState,
    commitmentDeclarationId
  );
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
    temporal_terms: assessDeclaredCommitmentTemporalTerms(
      projectState,
      commitmentDeclarationId
    ),
    source_relations: declarations.map((entry) =>
      assessCommitmentTemporalTermSourceRelation(entry, commitment)
    ),
    model_limitations: [...COMMITMENT_TEMPORAL_TERM_MODEL_LIMITATIONS],
  };
}

export function getCommitmentTemporalTermHistory(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentTemporalTermHistory {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const declarations = getCommitmentTemporalTermDeclarations(
    projectState,
    commitmentDeclarationId
  );
  const positions = groupTemporalTermDeclarationsIntoPositions(
    declarations,
    key,
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  );

  return {
    commitment_semantic_key: key,
    commitment_holder_entity_id: commitment.commitment_holder_entity_id,
    intervention_id: commitment.intervention_id,
    committed_at: commitment.committed_at,
    declarations,
    positions,
    divergences: divergencesFromPositions(positions, key),
    has_declarations: declarations.length > 0,
  };
}
