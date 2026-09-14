import { canonicalValueKey } from "./semantic-equality.js";
/**
 * Reality Core v0.7 — Commitment Conditional Term assessment (GROUND-033).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Conditional Term != Requirement / Temporal Term / condition truth /
 * effective Commitment applicability. No AND/OR/NOT composition.
 */

import {
  assessInterventionCommitmentContext,
  interventionCommitmentSemanticKey,
} from "./commitment-core.js";
import { assessDeclaredCommitmentAcceptance } from "./commitment-acceptance-core.js";
import { assessDeclaredCommitmentTemporalTerms } from "./commitment-temporal-term-core.js";
import type {
  CommitmentConditionRoleDivergence,
  CommitmentConditionalTermContextAssessment,
  CommitmentConditionalTermHistory,
  CommitmentConditionalTermModelLimitation,
  CommitmentConditionalTermPosition,
  CommitmentConditionalTermSourceRelation,
  CommitmentConditionalTermSourceRelationAssessment,
  DeclaredCommitmentConditionalTermsAssessment,
} from "./commitment-conditional-term-types.js";
import type {
  CommitmentConditionRole,
  InterventionCommitmentConditionalTermDeclaration,
  InterventionCommitmentDeclaration,
  ProjectState,
  ReferenceDeclarer,
} from "../types.js";

const ROLE_ORDER: Record<CommitmentConditionRole, number> = {
  ACTIVATION_CONDITION: 0,
  EXCEPTION_CONDITION: 1,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareRoles(
  a: CommitmentConditionRole,
  b: CommitmentConditionRole
): number {
  return ROLE_ORDER[a] - ROLE_ORDER[b];
}

function declarerKey(declarer: ReferenceDeclarer): string {
  return canonicalValueKey([declarer.kind, declarer.entity_id ?? "", declarer.external_id ?? "", declarer.label ?? ""]);
}

function sortDeclarers(declarers: ReferenceDeclarer[]): ReferenceDeclarer[] {
  return [...declarers].sort((a, b) =>
    declarerKey(a).localeCompare(declarerKey(b))
  );
}

export const COMMITMENT_CONDITIONAL_TERM_MODEL_LIMITATIONS: CommitmentConditionalTermModelLimitation[] =
  [
    "CONDITIONAL_TERM_ACCEPTANCE_NOT_MODELED",
    "CONDITIONAL_TERM_AUTHORITY_NOT_MODELED",
    "CONDITION_SEMANTIC_BINDING_NOT_MODELED",
    "CONDITION_TRUTH_EVALUATION_NOT_MODELED",
    "CONDITION_LOGICAL_COMPOSITION_NOT_MODELED",
    "EFFECTIVE_COMMITMENT_APPLICABILITY_NOT_MODELED",
    "CONDITIONAL_TERM_CORRECTION_NOT_MODELED",
    "CONDITIONAL_TERM_SUPERSESSION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function commitmentConditionalTermSemanticKey(
  commitmentSemanticKey: string,
  conditionKey: string,
  conditionRole: CommitmentConditionRole
): string {
  return `commitment-conditional-term|${commitmentSemanticKey}|${conditionKey}|${conditionRole}`;
}

export function commitmentConditionRoleDivergenceKey(
  commitmentSemanticKey: string,
  conditionKey: string
): string {
  return `commitment-condition-role-divergence|${commitmentSemanticKey}|${conditionKey}`;
}

export function compareInterventionCommitmentConditionalTermDeclarations(
  a: InterventionCommitmentConditionalTermDeclaration,
  b: InterventionCommitmentConditionalTermDeclaration
): number {
  if (a.condition_key !== b.condition_key) {
    return a.condition_key < b.condition_key ? -1 : 1;
  }
  const roleCmp = compareRoles(a.condition_role, b.condition_role);
  if (roleCmp !== 0) {
    return roleCmp;
  }
  return compareIds(a.id, b.id);
}

export function assessCommitmentConditionalTermSourceRelation(
  term: InterventionCommitmentConditionalTermDeclaration,
  commitment: InterventionCommitmentDeclaration
): CommitmentConditionalTermSourceRelationAssessment {
  const declarerEntityId = term.declared_by.entity_id ?? null;
  let source_relation: CommitmentConditionalTermSourceRelation;
  if (declarerEntityId == null || declarerEntityId === "") {
    source_relation = "DECLARED_BY_NON_ENTITY_SOURCE";
  } else if (declarerEntityId === commitment.commitment_holder_entity_id) {
    source_relation = "DECLARED_BY_COMMITMENT_HOLDER";
  } else {
    source_relation = "DECLARED_BY_OTHER_ENTITY";
  }

  return {
    conditional_term_declaration_id: term.id,
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

export function getCommitmentConditionalTermDeclarations(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentConditionalTermDeclaration[] {
  const equivalentIds = new Set(
    getEquivalentCommitmentDeclarations(
      projectState,
      commitmentDeclarationId
    ).map((entry) => entry.id)
  );
  return projectState.intervention_commitment_conditional_term_declarations
    .filter((entry) => equivalentIds.has(entry.commitment_declaration_id))
    .sort(compareInterventionCommitmentConditionalTermDeclarations);
}

function collectDescriptions(
  declarations: InterventionCommitmentConditionalTermDeclaration[]
): string[] {
  const values = declarations
    .map((entry) => entry.description)
    .filter((value): value is string => typeof value === "string" && value !== "");
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function groupConditionalTermDeclarationsIntoPositions(
  declarations: InterventionCommitmentConditionalTermDeclaration[],
  commitmentSemanticKey: string,
  holderEntityId: string,
  interventionId: string,
  committedAt: string
): CommitmentConditionalTermPosition[] {
  const groups = new Map<
    string,
    InterventionCommitmentConditionalTermDeclaration[]
  >();
  for (const entry of declarations) {
    const key = commitmentConditionalTermSemanticKey(
      commitmentSemanticKey,
      entry.condition_key,
      entry.condition_role
    );
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }

  const positions: CommitmentConditionalTermPosition[] = [];
  for (const group of groups.values()) {
    const sorted = [...group].sort(
      compareInterventionCommitmentConditionalTermDeclarations
    );
    const first = sorted[0]!;
    const targetIds = [
      ...new Set(sorted.map((entry) => entry.commitment_declaration_id)),
    ].sort(compareIds);
    positions.push({
      key: commitmentConditionalTermSemanticKey(
        commitmentSemanticKey,
        first.condition_key,
        first.condition_role
      ),
      commitment_semantic_key: commitmentSemanticKey,
      commitment_holder_entity_id: holderEntityId,
      intervention_id: interventionId,
      committed_at: committedAt,
      condition_key: first.condition_key,
      condition_role: first.condition_role,
      conditional_term_declaration_ids: sorted.map((entry) => entry.id),
      targeted_commitment_declaration_ids: targetIds,
      declarers: sortDeclarers(sorted.map((entry) => entry.declared_by)),
      descriptions: collectDescriptions(sorted),
      has_multiple_declarations: sorted.length > 1,
    });
  }

  return positions.sort((a, b) => {
    if (a.condition_key !== b.condition_key) {
      return a.condition_key < b.condition_key ? -1 : 1;
    }
    const roleCmp = compareRoles(a.condition_role, b.condition_role);
    if (roleCmp !== 0) {
      return roleCmp;
    }
    return a.key.localeCompare(b.key);
  });
}

export function groupCommitmentConditionalTermPositions(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentConditionalTermPosition[] {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const declarations = getCommitmentConditionalTermDeclarations(
    projectState,
    commitmentDeclarationId
  );
  return groupConditionalTermDeclarationsIntoPositions(
    declarations,
    key,
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  );
}

function roleDivergencesFromPositions(
  positions: CommitmentConditionalTermPosition[],
  commitmentSemanticKey: string
): CommitmentConditionRoleDivergence[] {
  const byKey = new Map<string, CommitmentConditionalTermPosition[]>();
  for (const position of positions) {
    const group = byKey.get(position.condition_key) ?? [];
    group.push(position);
    byKey.set(position.condition_key, group);
  }

  const divergences: CommitmentConditionRoleDivergence[] = [];
  for (const [conditionKey, group] of byKey.entries()) {
    const roles = [
      ...new Set(group.map((entry) => entry.condition_role)),
    ].sort(compareRoles);
    if (roles.length < 2) {
      continue;
    }
    const sortedGroup = [...group].sort((a, b) => {
      const roleCmp = compareRoles(a.condition_role, b.condition_role);
      if (roleCmp !== 0) {
        return roleCmp;
      }
      return a.key.localeCompare(b.key);
    });
    divergences.push({
      key: commitmentConditionRoleDivergenceKey(
        commitmentSemanticKey,
        conditionKey
      ),
      commitment_semantic_key: commitmentSemanticKey,
      condition_key: conditionKey,
      condition_roles: roles,
      conditional_term_position_keys: sortedGroup.map((entry) => entry.key),
      conditional_term_declaration_ids: sortedGroup
        .flatMap((entry) => entry.conditional_term_declaration_ids)
        .sort(compareIds),
      declarers: sortDeclarers(
        sortedGroup.flatMap((entry) => entry.declarers)
      ),
    });
  }

  return divergences.sort((a, b) => {
    if (a.condition_key !== b.condition_key) {
      return a.condition_key < b.condition_key ? -1 : 1;
    }
    return a.key.localeCompare(b.key);
  });
}

export function detectCommitmentConditionRoleDivergences(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentConditionRoleDivergence[] {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const positions = groupCommitmentConditionalTermPositions(
    projectState,
    commitmentDeclarationId
  );
  return roleDivergencesFromPositions(positions, key);
}

export function assessDeclaredCommitmentConditionalTerms(
  projectState: ProjectState,
  commitmentDeclarationId: string
): DeclaredCommitmentConditionalTermsAssessment {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const positions = groupCommitmentConditionalTermPositions(
    projectState,
    commitmentDeclarationId
  );
  const role_divergences = roleDivergencesFromPositions(positions, key);

  return {
    commitment_semantic_key: key,
    commitment_holder_entity_id: commitment.commitment_holder_entity_id,
    intervention_id: commitment.intervention_id,
    committed_at: commitment.committed_at,
    positions,
    role_divergences,
    has_conditional_terms: positions.length > 0,
    has_activation_conditions: positions.some(
      (entry) => entry.condition_role === "ACTIVATION_CONDITION"
    ),
    has_exception_conditions: positions.some(
      (entry) => entry.condition_role === "EXCEPTION_CONDITION"
    ),
    has_role_divergence: role_divergences.length > 0,
  };
}

export function assessCommitmentConditionalTermContext(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentConditionalTermContextAssessment {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const declarations = getCommitmentConditionalTermDeclarations(
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
    conditional_terms: assessDeclaredCommitmentConditionalTerms(
      projectState,
      commitmentDeclarationId
    ),
    source_relations: declarations.map((entry) =>
      assessCommitmentConditionalTermSourceRelation(entry, commitment)
    ),
    model_limitations: [...COMMITMENT_CONDITIONAL_TERM_MODEL_LIMITATIONS],
  };
}

export function getCommitmentConditionalTermHistory(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentConditionalTermHistory {
  const commitment = requireCommitment(projectState, commitmentDeclarationId);
  const key = semanticKeyForCommitment(commitment);
  const declarations = getCommitmentConditionalTermDeclarations(
    projectState,
    commitmentDeclarationId
  );
  const positions = groupConditionalTermDeclarationsIntoPositions(
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
    role_divergences: roleDivergencesFromPositions(positions, key),
    has_declarations: declarations.length > 0,
  };
}
