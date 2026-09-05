import { getDecisionSnapshotVerification } from "../decision-snapshot-verification.js";
import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Intent Core I assessment (GROUND-029).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Intent != Decision / Mandate / Permission / Capability / Resource /
 * Commitment / Execution. No effective / current / latest Intent.
 */

import { deriveDecisionContextCaptureRelation } from "./decision-memory-core.js";
import type {
  DecisionIntentDispositionRelation,
  DecisionSelectedActorRelation,
  DeclaredInterventionIntentAssessment,
  DeclaredInterventionIntentStatus,
  IntentDecisionBasisAssessment,
  IntentDispositionConflict,
  InterventionIntentHistory,
  InterventionIntentPosition,
} from "./intent-types.js";
import type {
  InterventionIntentDeclaration,
  InterventionIntentDisposition,
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

const DISPOSITION_ORDER: Record<InterventionIntentDisposition, number> = {
  PURSUE: 0,
  REFRAIN: 1,
};

export function isInterventionIntentActiveAt(
  declaration: InterventionIntentDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.intent_formed_at, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

export function interventionIntentPositionKey(
  holderEntityId: string,
  interventionId: string,
  disposition: InterventionIntentDisposition
): string {
  return `intent-position|${holderEntityId}|${interventionId}|${disposition}`;
}

export function intentDispositionConflictKey(
  holderEntityId: string,
  interventionId: string,
  at: string
): string {
  return `intent-conflict|${holderEntityId}|${interventionId}|${temporalInstantKey(at)}`;
}

export function compareInterventionIntentDeclarations(
  a: InterventionIntentDeclaration,
  b: InterventionIntentDeclaration
): number {
  if (a.intent_holder_entity_id !== b.intent_holder_entity_id) {
    return compareIds(a.intent_holder_entity_id, b.intent_holder_entity_id);
  }
  if (a.intervention_id !== b.intervention_id) {
    return compareIds(a.intervention_id, b.intervention_id);
  }
  if (compareTemporalInstants(a.intent_formed_at, b.intent_formed_at) !== 0) {
    return compareTemporalInstants(a.intent_formed_at, b.intent_formed_at) < 0 ? -1 : 1;
  }
  if (a.disposition !== b.disposition) {
    return DISPOSITION_ORDER[a.disposition] - DISPOSITION_ORDER[b.disposition];
  }
  return compareIds(a.id, b.id);
}

export function getApplicableInterventionIntentDeclarations(
  projectState: ProjectState,
  intentHolderEntityId: string,
  interventionId: string,
  at: string
): InterventionIntentDeclaration[] {
  return projectState.intervention_intent_declarations
    .filter(
      (entry) =>
        entry.intent_holder_entity_id === intentHolderEntityId &&
        entry.intervention_id === interventionId &&
        isInterventionIntentActiveAt(entry, at)
    )
    .sort(compareInterventionIntentDeclarations);
}

export function assessDeclaredInterventionIntent(
  projectState: ProjectState,
  intentHolderEntityId: string,
  interventionId: string,
  at: string
): DeclaredInterventionIntentAssessment {
  const active = getApplicableInterventionIntentDeclarations(
    projectState,
    intentHolderEntityId,
    interventionId,
    at
  );

  const pursue_declaration_ids = active
    .filter((entry) => entry.disposition === "PURSUE")
    .map((entry) => entry.id);
  const refrain_declaration_ids = active
    .filter((entry) => entry.disposition === "REFRAIN")
    .map((entry) => entry.id);

  let status: DeclaredInterventionIntentStatus;
  if (active.length === 0) {
    status = "NO_INTENT_DECLARATIONS";
  } else if (
    pursue_declaration_ids.length > 0 &&
    refrain_declaration_ids.length > 0
  ) {
    status = "CONTESTED_INTENT";
  } else if (pursue_declaration_ids.length > 0) {
    status = "PURSUE_DECLARED";
  } else {
    status = "REFRAIN_DECLARED";
  }

  return {
    intent_holder_entity_id: intentHolderEntityId,
    intervention_id: interventionId,
    at,
    status,
    intent_declaration_ids: active.map((entry) => entry.id),
    pursue_declaration_ids,
    refrain_declaration_ids,
    declarers: sortDeclarers(active.map((entry) => entry.declared_by)),
    has_pursue_declaration: pursue_declaration_ids.length > 0,
    has_refrain_declaration: refrain_declaration_ids.length > 0,
    has_intent_conflict: status === "CONTESTED_INTENT",
  };
}

export function groupInterventionIntentPositions(
  projectState: ProjectState,
  intentHolderEntityId: string,
  interventionId: string,
  at: string
): InterventionIntentPosition[] {
  const active = getApplicableInterventionIntentDeclarations(
    projectState,
    intentHolderEntityId,
    interventionId,
    at
  );

  const byDisposition = new Map<
    InterventionIntentDisposition,
    InterventionIntentDeclaration[]
  >();
  for (const entry of active) {
    const group = byDisposition.get(entry.disposition) ?? [];
    group.push(entry);
    byDisposition.set(entry.disposition, group);
  }

  const dispositions: InterventionIntentDisposition[] = ["PURSUE", "REFRAIN"];
  const positions: InterventionIntentPosition[] = [];
  for (const disposition of dispositions) {
    const group = byDisposition.get(disposition);
    if (!group || group.length === 0) {
      continue;
    }
    positions.push({
      key: interventionIntentPositionKey(
        intentHolderEntityId,
        interventionId,
        disposition
      ),
      intent_holder_entity_id: intentHolderEntityId,
      intervention_id: interventionId,
      disposition,
      intent_declaration_ids: group.map((entry) => entry.id),
      declarers: sortDeclarers(group.map((entry) => entry.declared_by)),
      has_multiple_declarations: group.length > 1,
    });
  }
  return positions;
}

export function detectIntentDispositionConflict(
  projectState: ProjectState,
  intentHolderEntityId: string,
  interventionId: string,
  at: string
): IntentDispositionConflict | null {
  const assessment = assessDeclaredInterventionIntent(
    projectState,
    intentHolderEntityId,
    interventionId,
    at
  );
  if (!assessment.has_intent_conflict) {
    return null;
  }
  return {
    key: intentDispositionConflictKey(
      intentHolderEntityId,
      interventionId,
      at
    ),
    intent_holder_entity_id: intentHolderEntityId,
    intervention_id: interventionId,
    at,
    pursue_declaration_ids: assessment.pursue_declaration_ids,
    refrain_declaration_ids: assessment.refrain_declaration_ids,
    declarers: assessment.declarers,
  };
}

export function assessIntentDecisionBasis(
  projectState: ProjectState,
  intentDeclarationId: string
): IntentDecisionBasisAssessment {
  const declaration = projectState.intervention_intent_declarations.find(
    (entry) => entry.id === intentDeclarationId
  );
  if (!declaration) {
    throw new Error(
      `InterventionIntentDeclaration ${intentDeclarationId} not found in project state`
    );
  }

  const decisionBasisId = declaration.decision_basis_declaration_id ?? null;
  if (!decisionBasisId) {
    return {
      intent_declaration_id: declaration.id,
      decision_basis_declaration_id: null,
      has_decision_basis: false,
      decision_selected_actor_entity_id: null,
      selected_actor_relation: null,
      holder_was_candidate_in_decision_snapshot: null,
      disposition_relation: null,
      decision_context_capture_relation: null,
      decision_snapshot_verification: null,
    };
  }

  const decision = projectState.reality_decision_declarations.find(
    (entry) => entry.id === decisionBasisId
  );
  if (!decision) {
    throw new Error(
      `RealityDecisionDeclaration ${decisionBasisId} not found in project state`
    );
  }

  const selectedActor = decision.selected_actor_entity_id ?? null;
  let selected_actor_relation: DecisionSelectedActorRelation;
  if (selectedActor === null) {
    selected_actor_relation = "DECISION_HAS_NO_SELECTED_ACTOR";
  } else if (selectedActor === declaration.intent_holder_entity_id) {
    selected_actor_relation = "INTENT_HOLDER_IS_SELECTED_ACTOR";
  } else {
    selected_actor_relation = "INTENT_HOLDER_DIFFERS_FROM_SELECTED_ACTOR";
  }

  const holder_was_candidate_in_decision_snapshot =
    decision.context_snapshot.actor_candidates.some(
      (candidate) =>
        candidate.actor_entity_id === declaration.intent_holder_entity_id &&
        candidate.intervention_id === declaration.intervention_id
    );

  const disposition_relation: DecisionIntentDispositionRelation =
    declaration.disposition === "PURSUE"
      ? "PURSUES_SELECTED_INTERVENTION"
      : "REFRAINS_FROM_SELECTED_INTERVENTION";

  return {
    intent_declaration_id: declaration.id,
    decision_basis_declaration_id: decisionBasisId,
    has_decision_basis: true,
    decision_selected_actor_entity_id: selectedActor,
    selected_actor_relation,
    holder_was_candidate_in_decision_snapshot,
    disposition_relation,
    decision_snapshot_verification: getDecisionSnapshotVerification(decision),
    decision_context_capture_relation: deriveDecisionContextCaptureRelation(
      decision.decided_at,
      decision.context_snapshot.captured_at
    ),
  };
}

export function getInterventionIntentHistory(
  projectState: ProjectState,
  intentHolderEntityId: string,
  interventionId: string
): InterventionIntentHistory {
  const declarations = projectState.intervention_intent_declarations
    .filter(
      (entry) =>
        entry.intent_holder_entity_id === intentHolderEntityId &&
        entry.intervention_id === interventionId
    )
    .sort(compareInterventionIntentDeclarations);

  return {
    intent_holder_entity_id: intentHolderEntityId,
    intervention_id: interventionId,
    declarations,
    has_declarations: declarations.length > 0,
  };
}
