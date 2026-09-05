import { canonicalValueKey } from "./semantic-equality.js";
import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Decision Core I assessment (GROUND-025).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Decision Space ≠ Decision selection / ranking / feasibility / actor.
 */

import {
  assessInterventionSpecification,
  isInterventionDeclarationActiveAt,
} from "./intervention-core.js";
import type {
  DecisionOptionAssessment,
  DecisionOptionPosition,
  DecisionSpaceAssessment,
  DecisionSpaceDeclarationStatus,
} from "./decision-types.js";
import type {
  DecisionBasisReference,
  DecisionOptionDeclaration,
  DecisionOptionTarget,
  DecisionSpaceDeclaration,
  ProjectState,
  ReferenceDeclarer,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function declarerKey(declarer: ReferenceDeclarer): string {
  return canonicalValueKey([declarer.kind, declarer.entity_id ?? "", declarer.external_id ?? "", declarer.label ?? ""]);
}

function sortDeclarers(declarers: ReferenceDeclarer[]): ReferenceDeclarer[] {
  return [...declarers].sort((a, b) =>
    declarerKey(a).localeCompare(declarerKey(b))
  );
}

export function decisionBasisKey(basis: DecisionBasisReference): string {
  switch (basis.kind) {
    case "REALITY_OBJECTIVE":
      return `REALITY_OBJECTIVE|${basis.objective_id}`;
    case "REFERENCE_CONDITION":
      return `REFERENCE_CONDITION|${basis.reference_condition_id}`;
    case "FUTURE_SCENARIO":
      return `FUTURE_SCENARIO|${basis.scenario_id}`;
  }
}

export function decisionBasesEqual(
  a: DecisionBasisReference,
  b: DecisionBasisReference
): boolean {
  return decisionBasisKey(a) === decisionBasisKey(b);
}

export function decisionOptionSemanticKey(option: DecisionOptionTarget): string {
  if (option.kind === "DO_NOTHING") {
    return "DO_NOTHING";
  }
  return `INTERVENTION|${option.intervention_id}`;
}

export function decisionOptionsEqual(
  a: DecisionOptionTarget,
  b: DecisionOptionTarget
): boolean {
  return decisionOptionSemanticKey(a) === decisionOptionSemanticKey(b);
}

export function isDecisionSpaceActiveAt(
  declaration: DecisionSpaceDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.valid_from, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

export function isDecisionOptionDeclarationActiveAt(
  declaration: DecisionOptionDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.valid_from, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

function compareBasis(a: DecisionBasisReference, b: DecisionBasisReference): number {
  return decisionBasisKey(a).localeCompare(decisionBasisKey(b));
}

function compareOptionDeclarations(
  a: DecisionOptionDeclaration,
  b: DecisionOptionDeclaration
): number {
  const keyCmp = decisionOptionSemanticKey(a.option).localeCompare(
    decisionOptionSemanticKey(b.option)
  );
  if (keyCmp !== 0) {
    return keyCmp;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareOptionPositions(
  a: DecisionOptionPosition,
  b: DecisionOptionPosition
): number {
  if (a.kind !== b.kind) {
    // DO_NOTHING first, then INTERVENTION
    if (a.kind === "DO_NOTHING") {
      return -1;
    }
    if (b.kind === "DO_NOTHING") {
      return 1;
    }
  }
  return a.key.localeCompare(b.key);
}

export function getApplicableDecisionOptions(
  projectState: ProjectState,
  decisionSpaceId: string,
  at: string
): DecisionOptionDeclaration[] {
  return projectState.decision_option_declarations
    .filter(
      (entry) =>
        entry.decision_space_id === decisionSpaceId &&
        isDecisionOptionDeclarationActiveAt(entry, at)
    )
    .sort(compareOptionDeclarations);
}

export function groupDecisionOptionPositions(
  projectState: ProjectState,
  decisionSpaceId: string,
  at: string
): DecisionOptionPosition[] {
  const applicable = getApplicableDecisionOptions(
    projectState,
    decisionSpaceId,
    at
  );
  const groups = new Map<string, DecisionOptionPosition>();

  for (const entry of applicable) {
    const key = decisionOptionSemanticKey(entry.option);
    const existing = groups.get(key);
    const label = entry.label?.trim() ? entry.label : null;
    if (existing) {
      existing.option_declaration_ids.push(entry.id);
      existing.declarers.push(entry.declared_by);
      if (label) {
        existing.labels.push(label);
      }
      existing.has_multiple_declarations = true;
    } else {
      groups.set(key, {
        key,
        kind: entry.option.kind,
        intervention_id:
          entry.option.kind === "INTERVENTION"
            ? entry.option.intervention_id
            : null,
        option_declaration_ids: [entry.id],
        declarers: [entry.declared_by],
        labels: label ? [label] : [],
        has_multiple_declarations: false,
      });
    }
  }

  return [...groups.values()]
    .map((position) => ({
      ...position,
      option_declaration_ids: [...position.option_declaration_ids].sort(
        compareIds
      ),
      declarers: sortDeclarers(position.declarers),
      labels: [...new Set(position.labels)].sort((a, b) =>
        a < b ? -1 : a > b ? 1 : 0
      ),
    }))
    .sort(compareOptionPositions);
}

export function assessDecisionOption(
  projectState: ProjectState,
  position: DecisionOptionPosition,
  at: string
): DecisionOptionAssessment {
  const active_option_declaration_ids = [...position.option_declaration_ids].sort(
    compareIds
  );

  if (position.kind === "DO_NOTHING" || position.intervention_id === null) {
    return {
      position,
      at,
      active_option_declaration_ids,
      intervention_specification: null,
      intervention_active: null,
      has_intervention_temporal_mismatch: false,
    };
  }

  const intervention = projectState.intervention_declarations.find(
    (entry) => entry.id === position.intervention_id
  );
  const intervention_active = intervention
    ? isInterventionDeclarationActiveAt(intervention, at)
    : false;

  const intervention_specification = assessInterventionSpecification(
    projectState,
    position.intervention_id,
    at
  );

  return {
    position,
    at,
    active_option_declaration_ids,
    intervention_specification,
    intervention_active,
    has_intervention_temporal_mismatch: !intervention_active,
  };
}

export function assessDecisionSpace(
  projectState: ProjectState,
  decisionSpaceId: string,
  at: string
): DecisionSpaceAssessment {
  const decision_space = projectState.decision_space_declarations.find(
    (entry) => entry.id === decisionSpaceId
  );
  if (!decision_space) {
    throw new Error(
      `DecisionSpaceDeclaration ${decisionSpaceId} not found in project state`
    );
  }

  const space_active = isDecisionSpaceActiveAt(decision_space, at);
  const declaration_status: DecisionSpaceDeclarationStatus = space_active
    ? "DECISION_SPACE_ACTIVE"
    : "DECISION_SPACE_NOT_ACTIVE";

  const applicable_option_declarations = getApplicableDecisionOptions(
    projectState,
    decisionSpaceId,
    at
  );
  const option_positions = groupDecisionOptionPositions(
    projectState,
    decisionSpaceId,
    at
  );
  const option_assessments = option_positions.map((position) =>
    assessDecisionOption(projectState, position, at)
  );

  const has_options = option_positions.length > 0;
  const has_intervention_options = option_positions.some(
    (entry) => entry.kind === "INTERVENTION"
  );
  const has_do_nothing_option = option_positions.some(
    (entry) => entry.kind === "DO_NOTHING"
  );
  const has_temporal_basis_mismatch =
    !space_active && applicable_option_declarations.length > 0;
  const has_intervention_temporal_mismatch = option_assessments.some(
    (entry) => entry.has_intervention_temporal_mismatch
  );

  return {
    decision_space: {
      ...decision_space,
      basis: [...decision_space.basis].sort(compareBasis),
    },
    at,
    declaration_status,
    applicable_option_declarations,
    option_positions,
    option_assessments,
    has_options,
    has_intervention_options,
    has_do_nothing_option,
    semantic_option_count: option_positions.length,
    has_temporal_basis_mismatch,
    has_intervention_temporal_mismatch,
  };
}
