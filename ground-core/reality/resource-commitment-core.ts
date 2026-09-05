/**
 * Reality Core v0.7 — Resource Commitment assessment (GROUND-034).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Resource Commitment != Availability / Capacity / Requirement /
 * Reservation / Allocation / Consumption / ownership / access Permission.
 * No free/remaining quantity. No sufficiency. No double-booking verdict.
 */

import {
  assessInterventionCommitmentContext,
  interventionCommitmentSemanticKey,
} from "./commitment-core.js";
import { groupInterventionResourceRequirements } from "./intervention-core.js";
import { assessResource, resourceScopesEqual } from "./resource-core.js";
import type {
  DeclaredInterventionResourceCommitmentAssessment,
  InterventionResourceCommitmentContextAssessment,
  InterventionResourceCommitmentHistory,
  InterventionResourceCommitmentPosition,
  ResourceCommitmentAmountDivergence,
  ResourceCommitmentModelLimitation,
  ResourceCommitmentRequirementRelation,
  ResourceCommitmentSourceRelation,
  ResourceCommitterCommitmentHolderRelation,
  ResourceCommitterHolderRelation,
} from "./resource-commitment-types.js";
import type {
  InterventionCommitmentDeclaration,
  InterventionResourceCommitmentDeclaration,
  ProjectState,
  ReferenceDeclarer,
  ResourceCommitmentAmount,
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

export const RESOURCE_COMMITMENT_MODEL_LIMITATIONS: ResourceCommitmentModelLimitation[] =
  [
    "RESOURCE_COMMITMENT_ACCEPTANCE_NOT_MODELED",
    "RESOURCE_CONTROL_AUTHORITY_NOT_MODELED",
    "RESOURCE_ACCESS_PERMISSION_NOT_MODELED",
    "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
    "RESOURCE_FREE_QUANTITY_NOT_MODELED",
    "RESOURCE_COMMITMENT_AMOUNT_SUFFICIENCY_NOT_MODELED",
    "RESOURCE_RESERVATION_NOT_MODELED",
    "RESOURCE_ALLOCATION_NOT_MODELED",
    "RESOURCE_CONSUMPTION_NOT_MODELED",
    "RESOURCE_COMMITMENT_RELEASE_NOT_MODELED",
    "COMMITMENT_TERM_PROPAGATION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function resourceCommitmentAmountKey(
  amount: ResourceCommitmentAmount
): string {
  if (amount.kind === "POINT") {
    return `POINT|${amount.value}`;
  }
  return `RANGE|${amount.min}|${amount.max}`;
}

export function resourceCommitmentSemanticKey(
  commitmentSemanticKey: string,
  resourceDeclarationId: string,
  resourceCommitterEntityId: string,
  resourceCommittedAt: string
): string {
  return [
    "resource-commitment",
    commitmentSemanticKey,
    resourceDeclarationId,
    resourceCommitterEntityId,
    resourceCommittedAt,
  ].join("|");
}

export function resourceCommitmentAmountDivergenceKey(
  positionKey: string
): string {
  return `resource-commitment-amount-divergence|${positionKey}`;
}

export function compareInterventionResourceCommitmentDeclarations(
  a: InterventionResourceCommitmentDeclaration,
  b: InterventionResourceCommitmentDeclaration
): number {
  if (a.resource_declaration_id !== b.resource_declaration_id) {
    return a.resource_declaration_id < b.resource_declaration_id ? -1 : 1;
  }
  if (a.resource_committer_entity_id !== b.resource_committer_entity_id) {
    return a.resource_committer_entity_id < b.resource_committer_entity_id
      ? -1
      : 1;
  }
  if (a.resource_committed_at !== b.resource_committed_at) {
    return a.resource_committed_at < b.resource_committed_at ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function resolveCommitment(
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

function commitmentSemanticKeyFor(
  commitment: InterventionCommitmentDeclaration
): string {
  return interventionCommitmentSemanticKey(
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  );
}

function declarationsForSemanticCommitment(
  projectState: ProjectState,
  commitmentSemanticKey: string
): InterventionResourceCommitmentDeclaration[] {
  return projectState.intervention_resource_commitment_declarations
    .filter((entry) => {
      const commitment = projectState.intervention_commitment_declarations.find(
        (c) => c.id === entry.commitment_declaration_id
      );
      if (!commitment) {
        return false;
      }
      return commitmentSemanticKeyFor(commitment) === commitmentSemanticKey;
    })
    .sort((a, b) => {
      const ca = resolveCommitment(projectState, a.commitment_declaration_id);
      const cb = resolveCommitment(projectState, b.commitment_declaration_id);
      const keyA = resourceCommitmentSemanticKey(
        commitmentSemanticKeyFor(ca),
        a.resource_declaration_id,
        a.resource_committer_entity_id,
        a.resource_committed_at
      );
      const keyB = resourceCommitmentSemanticKey(
        commitmentSemanticKeyFor(cb),
        b.resource_declaration_id,
        b.resource_committer_entity_id,
        b.resource_committed_at
      );
      if (keyA !== keyB) {
        return keyA < keyB ? -1 : 1;
      }
      return compareInterventionResourceCommitmentDeclarations(a, b);
    });
}

export function assessResourceCommitmentSourceRelation(
  declaration: InterventionResourceCommitmentDeclaration
): ResourceCommitmentSourceRelation {
  const entityId = declaration.declared_by.entity_id;
  if (entityId == null || entityId === "") {
    return "DECLARED_BY_NON_ENTITY_SOURCE";
  }
  if (entityId === declaration.resource_committer_entity_id) {
    return "SELF_DECLARED_BY_RESOURCE_COMMITTER";
  }
  return "DECLARED_BY_OTHER_ENTITY";
}

export function assessResourceCommitterHolderRelation(
  resourceCommitterEntityId: string,
  resourceHolderEntityId: string
): ResourceCommitterHolderRelation {
  return resourceCommitterEntityId === resourceHolderEntityId
    ? "RESOURCE_COMMITTER_IS_RESOURCE_HOLDER"
    : "RESOURCE_COMMITTER_DIFFERS_FROM_RESOURCE_HOLDER";
}

export function assessResourceCommitterCommitmentHolderRelation(
  resourceCommitterEntityId: string,
  commitmentHolderEntityId: string
): ResourceCommitterCommitmentHolderRelation {
  return resourceCommitterEntityId === commitmentHolderEntityId
    ? "RESOURCE_COMMITTER_IS_COMMITMENT_HOLDER"
    : "RESOURCE_COMMITTER_DIFFERS_FROM_COMMITMENT_HOLDER";
}

export function groupInterventionResourceCommitmentPositions(
  projectState: ProjectState,
  commitmentSemanticKey: string
): InterventionResourceCommitmentPosition[] {
  const declarations = declarationsForSemanticCommitment(
    projectState,
    commitmentSemanticKey
  );
  const groups = new Map<string, InterventionResourceCommitmentPosition>();

  for (const entry of declarations) {
    const commitment = resolveCommitment(
      projectState,
      entry.commitment_declaration_id
    );
    const key = resourceCommitmentSemanticKey(
      commitmentSemanticKey,
      entry.resource_declaration_id,
      entry.resource_committer_entity_id,
      entry.resource_committed_at
    );
    const existing = groups.get(key);
    const amount = entry.committed_amount ?? null;
    if (existing) {
      existing.resource_commitment_declaration_ids.push(entry.id);
      existing.targeted_commitment_declaration_ids.push(
        entry.commitment_declaration_id
      );
      existing.declarers.push(entry.declared_by);
      if (amount == null) {
        existing.has_unspecified_amount = true;
      } else {
        const amountKey = resourceCommitmentAmountKey(amount);
        if (
          !existing.declared_amounts.some(
            (a) => resourceCommitmentAmountKey(a) === amountKey
          )
        ) {
          existing.declared_amounts.push(amount);
        }
      }
      existing.has_multiple_declarations =
        existing.resource_commitment_declaration_ids.length > 1;
    } else {
      groups.set(key, {
        key,
        commitment_semantic_key: commitmentSemanticKey,
        intervention_id: commitment.intervention_id,
        commitment_holder_entity_id: commitment.commitment_holder_entity_id,
        resource_declaration_id: entry.resource_declaration_id,
        resource_committer_entity_id: entry.resource_committer_entity_id,
        resource_committed_at: entry.resource_committed_at,
        resource_commitment_declaration_ids: [entry.id],
        targeted_commitment_declaration_ids: [entry.commitment_declaration_id],
        declared_amounts: amount == null ? [] : [amount],
        has_unspecified_amount: amount == null,
        declarers: [entry.declared_by],
        has_multiple_declarations: false,
      });
    }
  }

  return [...groups.values()]
    .map((position) => ({
      ...position,
      resource_commitment_declaration_ids: [
        ...position.resource_commitment_declaration_ids,
      ].sort(compareIds),
      targeted_commitment_declaration_ids: [
        ...new Set(position.targeted_commitment_declaration_ids),
      ].sort(compareIds),
      declared_amounts: [...position.declared_amounts].sort((a, b) =>
        resourceCommitmentAmountKey(a).localeCompare(
          resourceCommitmentAmountKey(b)
        )
      ),
      declarers: sortDeclarers(position.declarers),
      has_multiple_declarations:
        position.resource_commitment_declaration_ids.length > 1,
    }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

export function detectResourceCommitmentAmountDivergences(
  positions: InterventionResourceCommitmentPosition[]
): ResourceCommitmentAmountDivergence[] {
  const divergences: ResourceCommitmentAmountDivergence[] = [];
  for (const position of positions) {
    if (position.declared_amounts.length < 2) {
      continue;
    }
    const specified_amount_keys = position.declared_amounts
      .map(resourceCommitmentAmountKey)
      .sort((a, b) => a.localeCompare(b));
    divergences.push({
      key: resourceCommitmentAmountDivergenceKey(position.key),
      resource_commitment_position_key: position.key,
      specified_amount_keys,
      resource_commitment_declaration_ids: [
        ...position.resource_commitment_declaration_ids,
      ],
      declarers: [...position.declarers],
    });
  }
  return divergences.sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0
  );
}

export function assessResourceCommitmentRequirementRelation(
  projectState: ProjectState,
  resourceCommitment: InterventionResourceCommitmentDeclaration,
  at: string
): ResourceCommitmentRequirementRelation {
  const commitment = resolveCommitment(
    projectState,
    resourceCommitment.commitment_declaration_id
  );
  const resource = projectState.resource_declarations.find(
    (entry) => entry.id === resourceCommitment.resource_declaration_id
  );
  if (!resource) {
    throw new Error(
      `ResourceDeclaration ${resourceCommitment.resource_declaration_id} not found in project state`
    );
  }

  const groups = groupInterventionResourceRequirements(
    projectState,
    commitment.intervention_id,
    at
  );
  const matching = groups.filter(
    (group) =>
      group.resource_key === resource.resource_key &&
      group.unit === resource.unit &&
      resourceScopesEqual(group.resource_scope, resource.scope)
  );
  const matching_requirement_declaration_ids = matching
    .flatMap((group) => group.requirement_declaration_ids)
    .sort(compareIds);

  return {
    commitment_declaration_id: resourceCommitment.commitment_declaration_id,
    intervention_id: commitment.intervention_id,
    resource_declaration_id: resource.id,
    matching_requirement_declaration_ids,
    has_exact_requirement_match: matching_requirement_declaration_ids.length > 0,
    has_requirement_amount_divergence: matching.some(
      (group) => group.has_requirement_divergence
    ),
  };
}

export function assessDeclaredInterventionResourceCommitments(
  projectState: ProjectState,
  commitmentDeclarationId: string
): DeclaredInterventionResourceCommitmentAssessment {
  const commitment = resolveCommitment(projectState, commitmentDeclarationId);
  const commitment_semantic_key = commitmentSemanticKeyFor(commitment);
  const positions = groupInterventionResourceCommitmentPositions(
    projectState,
    commitment_semantic_key
  );
  const amount_divergences =
    detectResourceCommitmentAmountDivergences(positions);
  const has_resource_commitments = positions.length > 0;

  return {
    commitment_semantic_key,
    positions,
    amount_divergences,
    has_resource_commitments,
    has_amount_divergence: amount_divergences.length > 0,
    status: has_resource_commitments
      ? "RESOURCE_COMMITMENT_DECLARED"
      : "NO_RESOURCE_COMMITMENT_DECLARATIONS",
  };
}

export function assessInterventionResourceCommitmentContext(
  projectState: ProjectState,
  resourceCommitmentDeclarationId: string,
  at: string
): InterventionResourceCommitmentContextAssessment {
  const resource_commitment =
    projectState.intervention_resource_commitment_declarations.find(
      (entry) => entry.id === resourceCommitmentDeclarationId
    );
  if (!resource_commitment) {
    throw new Error(
      `InterventionResourceCommitmentDeclaration ${resourceCommitmentDeclarationId} not found in project state`
    );
  }

  const commitment = resolveCommitment(
    projectState,
    resource_commitment.commitment_declaration_id
  );
  const resource = projectState.resource_declarations.find(
    (entry) => entry.id === resource_commitment.resource_declaration_id
  );
  if (!resource) {
    throw new Error(
      `ResourceDeclaration ${resource_commitment.resource_declaration_id} not found in project state`
    );
  }

  return {
    resource_commitment,
    commitment,
    commitment_context: assessInterventionCommitmentContext(
      projectState,
      commitment.id
    ),
    resource,
    resource_assessment: assessResource(projectState, resource.id, at),
    source_relation: assessResourceCommitmentSourceRelation(resource_commitment),
    resource_holder_relation: assessResourceCommitterHolderRelation(
      resource_commitment.resource_committer_entity_id,
      resource.holder_entity_id
    ),
    commitment_holder_relation: assessResourceCommitterCommitmentHolderRelation(
      resource_commitment.resource_committer_entity_id,
      commitment.commitment_holder_entity_id
    ),
    requirement_relation: assessResourceCommitmentRequirementRelation(
      projectState,
      resource_commitment,
      at
    ),
    model_limitations: [...RESOURCE_COMMITMENT_MODEL_LIMITATIONS],
  };
}

export function getInterventionResourceCommitmentHistory(
  projectState: ProjectState,
  commitmentDeclarationId: string
): InterventionResourceCommitmentHistory {
  const commitment = resolveCommitment(projectState, commitmentDeclarationId);
  const commitment_semantic_key = commitmentSemanticKeyFor(commitment);
  const declarations = declarationsForSemanticCommitment(
    projectState,
    commitment_semantic_key
  );
  const positions = groupInterventionResourceCommitmentPositions(
    projectState,
    commitment_semantic_key
  );
  const amount_divergences =
    detectResourceCommitmentAmountDivergences(positions);

  return {
    commitment_semantic_key,
    declarations,
    positions,
    amount_divergences,
    has_declarations: declarations.length > 0,
  };
}

/** Helper view: Resource Commitment positions targeting a ResourceDeclaration. */
export function getResourceCommitmentPositionsForResource(
  projectState: ProjectState,
  resourceDeclarationId: string
): InterventionResourceCommitmentPosition[] {
  const keys = new Set<string>();
  for (const entry of projectState.intervention_resource_commitment_declarations) {
    if (entry.resource_declaration_id !== resourceDeclarationId) {
      continue;
    }
    const commitment = projectState.intervention_commitment_declarations.find(
      (c) => c.id === entry.commitment_declaration_id
    );
    if (!commitment) {
      continue;
    }
    keys.add(commitmentSemanticKeyFor(commitment));
  }
  const positions: InterventionResourceCommitmentPosition[] = [];
  for (const key of [...keys].sort()) {
    positions.push(
      ...groupInterventionResourceCommitmentPositions(projectState, key).filter(
        (p) => p.resource_declaration_id === resourceDeclarationId
      )
    );
  }
  return positions.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/** Helper view: Resource Commitment positions by resource committer. */
export function getResourceCommitmentPositionsForCommitter(
  projectState: ProjectState,
  resourceCommitterEntityId: string
): InterventionResourceCommitmentPosition[] {
  const keys = new Set<string>();
  for (const entry of projectState.intervention_resource_commitment_declarations) {
    if (entry.resource_committer_entity_id !== resourceCommitterEntityId) {
      continue;
    }
    const commitment = projectState.intervention_commitment_declarations.find(
      (c) => c.id === entry.commitment_declaration_id
    );
    if (!commitment) {
      continue;
    }
    keys.add(commitmentSemanticKeyFor(commitment));
  }
  const positions: InterventionResourceCommitmentPosition[] = [];
  for (const key of [...keys].sort()) {
    positions.push(
      ...groupInterventionResourceCommitmentPositions(projectState, key).filter(
        (p) => p.resource_committer_entity_id === resourceCommitterEntityId
      )
    );
  }
  return positions.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}
