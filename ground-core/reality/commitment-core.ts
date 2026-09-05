import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Commitment Core I assessment (GROUND-030).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Commitment != Intent / Decision / Mandate / Permission / Capability /
 * Resource / Resource reservation / Execution / Acceptance.
 * No effective / current / latest / binding Commitment.
 */

import { deriveDecisionContextCaptureRelation } from "./decision-memory-core.js";
import type {
  CommitmentBasisAssessment,
  CommitmentDecisionActorRelation,
  CommitmentModelLimitation,
  CommitmentSourceRelation,
  CommitmentSourceRelationAssessment,
  DeclaredInterventionCommitmentAssessment,
  DeclaredInterventionCommitmentStatus,
  InterventionCommitmentContextAssessment,
  InterventionCommitmentHistory,
  InterventionCommitmentPosition,
} from "./commitment-types.js";
import type {
  CommitmentBasisReference,
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

export const COMMITMENT_MODEL_LIMITATIONS: CommitmentModelLimitation[] = [
  "COMMITMENT_ACCEPTANCE_NOT_MODELED",
  "COMMITMENT_AUTHORITY_NOT_MODELED",
  "COMMITMENT_COUNTERPARTY_NOT_MODELED",
  "RESOURCE_BINDING_NOT_MODELED",
  "DEADLINE_NOT_MODELED",
  "CONDITIONAL_COMMITMENT_NOT_MODELED",
  "EXECUTION_NOT_MODELED",
];

export function interventionCommitmentSemanticKey(
  holderEntityId: string,
  interventionId: string,
  committedAt: string
): string {
  return `commitment|${holderEntityId}|${interventionId}|${temporalInstantKey(committedAt)}`;
}

export function isInterventionCommitmentActiveAt(
  declaration: InterventionCommitmentDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.committed_at, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

export function compareInterventionCommitmentDeclarations(
  a: InterventionCommitmentDeclaration,
  b: InterventionCommitmentDeclaration
): number {
  if (a.commitment_holder_entity_id !== b.commitment_holder_entity_id) {
    return compareIds(a.commitment_holder_entity_id, b.commitment_holder_entity_id);
  }
  if (a.intervention_id !== b.intervention_id) {
    return compareIds(a.intervention_id, b.intervention_id);
  }
  if (compareTemporalInstants(a.committed_at, b.committed_at) !== 0) {
    return compareTemporalInstants(a.committed_at, b.committed_at) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function compareCommitmentBasisReferences(
  a: CommitmentBasisReference,
  b: CommitmentBasisReference
): number {
  if (a.kind !== b.kind) {
    return a.kind === "REALITY_DECISION" ? -1 : 1;
  }
  if (a.kind === "REALITY_DECISION" && b.kind === "REALITY_DECISION") {
    return compareIds(a.decision_declaration_id, b.decision_declaration_id);
  }
  if (a.kind === "INTERVENTION_INTENT" && b.kind === "INTERVENTION_INTENT") {
    return compareIds(a.intent_declaration_id, b.intent_declaration_id);
  }
  return 0;
}

export function getApplicableInterventionCommitmentDeclarations(
  projectState: ProjectState,
  commitmentHolderEntityId: string,
  interventionId: string,
  at: string
): InterventionCommitmentDeclaration[] {
  return projectState.intervention_commitment_declarations
    .filter(
      (entry) =>
        entry.commitment_holder_entity_id === commitmentHolderEntityId &&
        entry.intervention_id === interventionId &&
        isInterventionCommitmentActiveAt(entry, at)
    )
    .sort(compareInterventionCommitmentDeclarations);
}

function groupDeclarationsIntoPositions(
  declarations: InterventionCommitmentDeclaration[]
): InterventionCommitmentPosition[] {
  const groups = new Map<string, InterventionCommitmentDeclaration[]>();
  for (const entry of declarations) {
    const key = interventionCommitmentSemanticKey(
      entry.commitment_holder_entity_id,
      entry.intervention_id,
      entry.committed_at
    );
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }

  const positions: InterventionCommitmentPosition[] = [];
  for (const group of groups.values()) {
    const sorted = [...group].sort(compareInterventionCommitmentDeclarations);
    const first = sorted[0]!;
    positions.push({
      key: interventionCommitmentSemanticKey(
        first.commitment_holder_entity_id,
        first.intervention_id,
        first.committed_at
      ),
      commitment_holder_entity_id: first.commitment_holder_entity_id,
      intervention_id: first.intervention_id,
      committed_at: first.committed_at,
      commitment_declaration_ids: sorted.map((entry) => entry.id),
      declarers: sortDeclarers(sorted.map((entry) => entry.declared_by)),
      has_multiple_declarations: sorted.length > 1,
    });
  }

  return positions.sort((a, b) => {
    if (a.commitment_holder_entity_id !== b.commitment_holder_entity_id) {
      return compareIds(a.commitment_holder_entity_id, b.commitment_holder_entity_id);
    }
    if (a.intervention_id !== b.intervention_id) {
      return compareIds(a.intervention_id, b.intervention_id);
    }
    if (compareTemporalInstants(a.committed_at, b.committed_at) !== 0) {
      return compareTemporalInstants(a.committed_at, b.committed_at) < 0 ? -1 : 1;
    }
    return 0;
  });
}

export function groupInterventionCommitmentPositions(
  projectState: ProjectState,
  commitmentHolderEntityId: string,
  interventionId: string,
  at: string
): InterventionCommitmentPosition[] {
  return groupDeclarationsIntoPositions(
    getApplicableInterventionCommitmentDeclarations(
      projectState,
      commitmentHolderEntityId,
      interventionId,
      at
    )
  );
}

export function assessDeclaredInterventionCommitment(
  projectState: ProjectState,
  commitmentHolderEntityId: string,
  interventionId: string,
  at: string
): DeclaredInterventionCommitmentAssessment {
  const active = getApplicableInterventionCommitmentDeclarations(
    projectState,
    commitmentHolderEntityId,
    interventionId,
    at
  );
  const status: DeclaredInterventionCommitmentStatus =
    active.length === 0
      ? "NO_COMMITMENT_DECLARATIONS"
      : "COMMITMENT_DECLARED";

  return {
    commitment_holder_entity_id: commitmentHolderEntityId,
    intervention_id: interventionId,
    at,
    status,
    commitment_declaration_ids: active.map((entry) => entry.id),
    declarers: sortDeclarers(active.map((entry) => entry.declared_by)),
    commitment_positions: groupDeclarationsIntoPositions(active),
    has_multiple_declarations: active.length > 1,
  };
}

export function assessCommitmentSourceRelation(
  commitment: InterventionCommitmentDeclaration
): CommitmentSourceRelationAssessment {
  const declarerEntityId = commitment.declared_by.entity_id ?? null;
  let source_relation: CommitmentSourceRelation;
  if (declarerEntityId == null || declarerEntityId === "") {
    source_relation = "DECLARED_BY_NON_ENTITY_SOURCE";
  } else if (declarerEntityId === commitment.commitment_holder_entity_id) {
    source_relation = "SELF_DECLARED_BY_HOLDER";
  } else {
    source_relation = "DECLARED_BY_OTHER_ENTITY";
  }

  return {
    commitment_declaration_id: commitment.id,
    source_relation,
  };
}

function decisionActorRelation(
  selectedActorEntityId: string | null | undefined,
  holderEntityId: string
): CommitmentDecisionActorRelation {
  if (selectedActorEntityId == null || selectedActorEntityId === "") {
    return "DECISION_HAS_NO_SELECTED_ACTOR";
  }
  if (selectedActorEntityId === holderEntityId) {
    return "COMMITMENT_HOLDER_IS_SELECTED_ACTOR";
  }
  return "COMMITMENT_HOLDER_DIFFERS_FROM_SELECTED_ACTOR";
}

export function assessCommitmentBasis(
  projectState: ProjectState,
  commitmentDeclarationId: string
): CommitmentBasisAssessment {
  const commitment = projectState.intervention_commitment_declarations.find(
    (entry) => entry.id === commitmentDeclarationId
  );
  if (!commitment) {
    throw new Error(
      `InterventionCommitmentDeclaration ${commitmentDeclarationId} not found in project state`
    );
  }

  const sortedBasis = [...commitment.basis].sort(compareCommitmentBasisReferences);
  const decision_basis_ids = sortedBasis
    .filter((ref) => ref.kind === "REALITY_DECISION")
    .map((ref) => ref.decision_declaration_id);
  const intent_basis_ids = sortedBasis
    .filter((ref) => ref.kind === "INTERVENTION_INTENT")
    .map((ref) => ref.intent_declaration_id);

  const decision_actor_relations: CommitmentDecisionActorRelation[] = [];
  const decision_context_capture_relations: CommitmentBasisAssessment["decision_context_capture_relations"] =
    [];
  const candidateFlags: boolean[] = [];

  for (const decisionId of decision_basis_ids) {
    const decision = projectState.reality_decision_declarations.find(
      (entry) => entry.id === decisionId
    );
    if (!decision) {
      throw new Error(
        `RealityDecisionDeclaration ${decisionId} not found in project state`
      );
    }
    decision_actor_relations.push(
      decisionActorRelation(
        decision.selected_actor_entity_id,
        commitment.commitment_holder_entity_id
      )
    );
    decision_context_capture_relations.push(
      deriveDecisionContextCaptureRelation(
        decision.decided_at,
        decision.context_snapshot.captured_at
      )
    );
    candidateFlags.push(
      decision.context_snapshot.actor_candidates.some(
        (candidate) =>
          candidate.actor_entity_id === commitment.commitment_holder_entity_id &&
          candidate.intervention_id === commitment.intervention_id
      )
    );
  }

  let holder_was_candidate_in_decision_snapshot: boolean | null = null;
  if (candidateFlags.length > 0) {
    holder_was_candidate_in_decision_snapshot = candidateFlags.every(Boolean);
  }

  return {
    commitment_declaration_id: commitment.id,
    decision_basis_ids,
    intent_basis_ids,
    has_decision_basis: decision_basis_ids.length > 0,
    has_intent_basis: intent_basis_ids.length > 0,
    decision_actor_relations,
    holder_was_candidate_in_decision_snapshot,
    decision_context_capture_relations,
    all_intent_bases_are_pursue: true,
  };
}

export function assessInterventionCommitmentContext(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionCommitmentContextAssessment {
  const commitment = projectState.intervention_commitment_declarations.find(
    (entry) => entry.id === commitmentDeclarationId
  );
  if (!commitment) {
    throw new Error(
      `InterventionCommitmentDeclaration ${commitmentDeclarationId} not found in project state`
    );
  }

  return {
    commitment,
    source_relation: assessCommitmentSourceRelation(commitment).source_relation,
    basis: assessCommitmentBasis(projectState, commitmentDeclarationId),
    model_limitations: [...COMMITMENT_MODEL_LIMITATIONS],
  };
}

export function getInterventionCommitmentHistory(
  projectState: ProjectState,
  commitmentHolderEntityId: string,
  interventionId: string
): InterventionCommitmentHistory {
  const declarations = projectState.intervention_commitment_declarations
    .filter(
      (entry) =>
        entry.commitment_holder_entity_id === commitmentHolderEntityId &&
        entry.intervention_id === interventionId
    )
    .sort(compareInterventionCommitmentDeclarations);

  return {
    commitment_holder_entity_id: commitmentHolderEntityId,
    intervention_id: interventionId,
    declarations,
    positions: groupDeclarationsIntoPositions(declarations),
    has_declarations: declarations.length > 0,
  };
}
