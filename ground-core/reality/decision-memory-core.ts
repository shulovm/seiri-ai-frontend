import { getDecisionSnapshotVerification } from "../decision-snapshot-verification.js";
import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Decision Memory I assessment (GROUND-028).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Decision ≠ Commitment / Intent / Execution / Authority / feasibility verdict.
 * chosen != correct / feasible / authorized / committed / executed.
 *
 * Snapshot builder: pure / deterministic.
 * History/assessment APIs: read-only, do not mutate ProjectState.
 */

import {
  assessDecisionSpaceFeasibilityBasis,
  buildCapabilityFeasibilityBasis,
  buildPermissionFeasibilityBasis,
  buildResourceFeasibilityBasis,
} from "./feasibility-core.js";
import {
  assessDecisionSpace,
  decisionBasisKey,
  decisionOptionSemanticKey,
} from "./decision-core.js";
import { assessDecisionSpaceActorComposition } from "./agency-core.js";
import { capabilityScopeKey } from "./capability-core.js";
import { resourceScopeKey } from "./resource-core.js";
import type {
  DecisionActorCandidateSnapshot,
  DecisionActorFeasibilityBasisSnapshot,
  DecisionBasisContestSnapshot,
  DecisionBasisGapSnapshot,
  DecisionCapabilityBasisSnapshot,
  DecisionContextSnapshotV1,
  DecisionDeclaredConstraintSnapshot,
  DecisionOptionSnapshot,
  DecisionPermissionBasisSnapshot,
  DecisionResourceBasisSnapshot,
  ProjectState,
  RealityDecisionDeclaration,
  RealityDecisionSelection,
  ReferenceDeclarer,
} from "../types.js";
import type {
  DecisionContextCaptureRelation,
  DecisionMemoryAssessment,
  DecisionSelectionConflict,
  DecisionSpaceDecisionHistory,
  RealityDecisionPosition,
} from "./decision-memory-types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ─── Semantic key helpers ─────────────────────────────────────────────────────

/** Canonical key for a RealityDecisionSelection. */
export function realityDecisionSelectionKey(
  selection: RealityDecisionSelection
): string {
  if (selection.kind === "DO_NOTHING") {
    return "DO_NOTHING";
  }
  return `INTERVENTION|${selection.intervention_id}`;
}

/**
 * Deterministic semantic key for a full Decision declaration identity.
 * Format: decision|{spaceId}|{makerId}|{decidedAt}|{selectionKey}|{actorOrNone}
 */
export function realityDecisionSemanticKey(
  decisionSpaceId: string,
  decisionMakerEntityId: string,
  decidedAt: string,
  selectedOption: RealityDecisionSelection,
  selectedActorEntityId: string | null | undefined
): string {
  const selKey = realityDecisionSelectionKey(selectedOption);
  const actorPart = selectedActorEntityId ?? "NONE";
  return `decision|${decisionSpaceId}|${decisionMakerEntityId}|${temporalInstantKey(decidedAt)}|${selKey}|${actorPart}`;
}

/** Key for grouping conflict scope: (space, maker, decidedAt). */
function decisionConflictScopeKey(
  decisionSpaceId: string,
  decisionMakerEntityId: string,
  decidedAt: string
): string {
  return `conflict|${decisionSpaceId}|${decisionMakerEntityId}|${temporalInstantKey(decidedAt)}`;
}

// ─── Filtered ProjectState view ───────────────────────────────────────────────

/**
 * Returns a ProjectState view that excludes any declaration whose
 * recorded_at > capturedAt.
 *
 * This prevents future-recorded declarations from entering snapshots
 * of earlier capture times. Does NOT reconstruct exact historical knowledge.
 */
function filteredProjectState(
  projectState: ProjectState,
  capturedAt: string
): ProjectState {
  function filterArr<T extends { recorded_at: string }>(arr: T[]): T[] {
    return arr.filter((d) => compareTemporalInstants(d.recorded_at, capturedAt) <= 0);
  }
  return {
    ...projectState,
    reality_events: filterArr(projectState.reality_events),
    reality_states: filterArr(projectState.reality_states),
    epistemic_observations: filterArr(projectState.epistemic_observations),
    // reality_entities: not filtered (no recorded_at field)
    evidence: filterArr(projectState.evidence),
    claims: filterArr(projectState.claims),
    claim_evidence_links: filterArr(projectState.claim_evidence_links),
    reference_conditions: filterArr(projectState.reference_conditions),
    reality_objectives: filterArr(projectState.reality_objectives),
    objective_requirements: filterArr(projectState.objective_requirements),
    objective_dependencies: filterArr(projectState.objective_dependencies),
    future_scenarios: filterArr(projectState.future_scenarios),
    scenario_state_projections: filterArr(projectState.scenario_state_projections),
    scenario_likelihood_estimates: filterArr(projectState.scenario_likelihood_estimates),
    impact_declarations: filterArr(projectState.impact_declarations),
    impact_measure_declarations: filterArr(projectState.impact_measure_declarations),
    authority_declarations: filterArr(projectState.authority_declarations),
    standing_declarations: filterArr(projectState.standing_declarations),
    mandate_declarations: filterArr(projectState.mandate_declarations),
    authority_delegation_declarations: filterArr(projectState.authority_delegation_declarations),
    authority_contest_declarations: filterArr(projectState.authority_contest_declarations),
    capability_declarations: filterArr(projectState.capability_declarations),
    capability_verification_declarations: filterArr(projectState.capability_verification_declarations),
    capability_availability_declarations: filterArr(projectState.capability_availability_declarations),
    resource_declarations: filterArr(projectState.resource_declarations),
    resource_capacity_declarations: filterArr(projectState.resource_capacity_declarations),
    resource_availability_declarations: filterArr(projectState.resource_availability_declarations),
    intervention_declarations: filterArr(projectState.intervention_declarations),
    intervention_capability_requirement_declarations: filterArr(
      projectState.intervention_capability_requirement_declarations
    ),
    intervention_resource_requirement_declarations: filterArr(
      projectState.intervention_resource_requirement_declarations
    ),
    intervention_permission_declarations: filterArr(projectState.intervention_permission_declarations),
    decision_space_declarations: filterArr(projectState.decision_space_declarations),
    decision_option_declarations: filterArr(projectState.decision_option_declarations),
    decision_option_actor_candidate_declarations: filterArr(
      projectState.decision_option_actor_candidate_declarations
    ),
    reality_decision_declarations: filterArr(projectState.reality_decision_declarations),
  };
}

// ─── Snapshot builder ─────────────────────────────────────────────────────────

/**
 * Builds a deterministic frozen DecisionContextSnapshotV1.
 *
 * assessedAt = decided_at (the declared Decision time).
 * capturedAt = recorded_at (when GROUND accepts the record).
 *
 * Source declarations with recorded_at > capturedAt are excluded.
 * This does NOT reconstruct exact historical knowledge at assessedAt
 * when capturedAt > assessedAt.
 */
export function buildDecisionContextSnapshot(
  projectState: ProjectState,
  decisionSpaceId: string,
  assessedAt: string,
  capturedAt: string
): DecisionContextSnapshotV1 {
  const filtered = filteredProjectState(projectState, capturedAt);

  // Basis keys from Decision Space
  const spaceDecl = filtered.decision_space_declarations.find(
    (d) => d.id === decisionSpaceId
  );
  const basis_keys: string[] = spaceDecl
    ? [...spaceDecl.basis].map(decisionBasisKey).sort()
    : [];

  // Option positions from Decision Space assessment
  const spaceAssessment = assessDecisionSpace(filtered, decisionSpaceId, assessedAt);
  const option_positions: DecisionOptionSnapshot[] = spaceAssessment.option_positions
    .map((pos) => {
      const optionTarget =
        pos.kind === "INTERVENTION"
          ? ({ kind: "INTERVENTION", intervention_id: pos.intervention_id! } as const)
          : ({ kind: "DO_NOTHING" } as const);
      return {
        option_key: decisionOptionSemanticKey(optionTarget),
        kind: pos.kind as "INTERVENTION" | "DO_NOTHING",
        intervention_id: pos.intervention_id,
        option_declaration_ids: [...pos.option_declaration_ids].sort(compareIds),
      };
    })
    .sort((a, b) => a.option_key.localeCompare(b.option_key));

  // Actor compositions from Agency Composition assessment
  const spaceComposition = assessDecisionSpaceActorComposition(
    filtered,
    decisionSpaceId,
    assessedAt
  );

  const actor_candidates: DecisionActorCandidateSnapshot[] =
    spaceComposition.actor_candidate_positions
      .map((pos) => ({
        candidate_key: pos.key,
        intervention_id: pos.intervention_id,
        actor_entity_id: pos.actor_entity_id,
        candidate_declaration_ids: [...pos.candidate_declaration_ids].sort(compareIds),
      }))
      .sort((a, b) => a.candidate_key.localeCompare(b.candidate_key));

  // Feasibility Basis per candidate
  const feasibilityAssessment = assessDecisionSpaceFeasibilityBasis(
    filtered,
    decisionSpaceId,
    assessedAt
  );

  const actor_feasibility_bases: DecisionActorFeasibilityBasisSnapshot[] =
    feasibilityAssessment.actor_feasibility_bases.map((fb) => {
      const comp = fb.candidate_composition;

      const capability_bases: DecisionCapabilityBasisSnapshot[] =
        fb.capability_bases
          .map((cb) => ({
            capability_key: cb.capability_key,
            capability_scope_key: capabilityScopeKey(cb.capability_scope),
            requirement_declaration_ids: [...cb.requirement_declaration_ids].sort(compareIds),
            matching_capability_declaration_ids: [...cb.matching_capability_declaration_ids].sort(
              compareIds
            ),
            has_exact_match: cb.has_exact_match,
            has_active_verification: cb.has_active_verification,
            has_any_availability_declaration: cb.has_any_availability_declaration,
            has_available_declaration: cb.has_available_declaration,
            has_unavailable_declaration: cb.has_unavailable_declaration,
            has_existing_contested_availability: cb.has_existing_contested_availability,
          }))
          .sort((a, b) => {
            if (a.capability_key !== b.capability_key) {
              return a.capability_key < b.capability_key ? -1 : 1;
            }
            return a.capability_scope_key.localeCompare(b.capability_scope_key);
          });

      const resource_bases: DecisionResourceBasisSnapshot[] =
        fb.resource_bases
          .map((rb) => ({
            resource_key: rb.resource_key,
            unit: rb.unit,
            resource_scope_key: resourceScopeKey(rb.resource_scope),
            requirement_declaration_ids: [...rb.requirement_declaration_ids].sort(compareIds),
            required_amounts: rb.required_amounts,
            matching_resource_declaration_ids: [...rb.matching_resource_declaration_ids].sort(
              compareIds
            ),
            matching_holder_ids: [...rb.matching_resource_holder_ids].sort(compareIds),
            has_exact_match: rb.has_exact_match,
            has_any_capacity_declaration: rb.has_any_capacity_declaration,
            has_capacity_divergence: rb.has_capacity_divergence,
            has_available_declaration: rb.has_available_declaration,
            has_unavailable_declaration: rb.has_unavailable_declaration,
            has_existing_contested_availability: rb.has_existing_contested_availability,
          }))
          .sort((a, b) => {
            if (a.resource_key !== b.resource_key) {
              return a.resource_key < b.resource_key ? -1 : 1;
            }
            if (a.unit !== b.unit) {
              return a.unit < b.unit ? -1 : 1;
            }
            return a.resource_scope_key.localeCompare(b.resource_scope_key);
          });

      const permBasis = buildPermissionFeasibilityBasis(comp);
      const permission: DecisionPermissionBasisSnapshot = {
        permission_status: permBasis.permission_status,
        permission_declaration_ids: [...permBasis.permission_declaration_ids].sort(compareIds),
        permit_declaration_ids: [...permBasis.permit_declaration_ids].sort(compareIds),
        prohibit_declaration_ids: [...permBasis.prohibit_declaration_ids].sort(compareIds),
        has_permit_declaration: permBasis.has_permit_declaration,
        has_prohibit_declaration: permBasis.has_prohibit_declaration,
        has_permission_conflict: permBasis.has_permission_conflict,
      };

      const gaps: DecisionBasisGapSnapshot[] = fb.gaps.map((g) => ({
        key: g.key,
        kind: g.kind,
        related_key: g.related_key,
      }));

      const contests: DecisionBasisContestSnapshot[] = fb.contests.map((c) => ({
        key: c.key,
        kind: c.kind,
        related_key: c.related_key,
        source_ids: [...c.source_ids].sort(compareIds),
      }));

      const declared_constraints: DecisionDeclaredConstraintSnapshot[] =
        fb.declared_constraints.map((dc) => ({
          key: dc.key,
          kind: dc.kind,
          source_declaration_ids: [...dc.source_declaration_ids].sort(compareIds),
        }));

      return {
        candidate_key: comp.candidate_position.key,
        intervention_id: comp.intervention_id,
        actor_entity_id: comp.actor_entity_id,
        capability_bases,
        resource_bases,
        permission,
        gaps,
        contests,
        declared_constraints,
        model_limitations: fb.model_limitations,
      } satisfies DecisionActorFeasibilityBasisSnapshot;
    })
    .sort((a, b) => a.candidate_key.localeCompare(b.candidate_key));

  const intervention_option_ids_without_actor_candidates =
    [...spaceComposition.intervention_option_ids_without_actor_candidates].sort();

  return {
    version: "1",
    decision_space_id: decisionSpaceId,
    assessed_at: assessedAt,
    captured_at: capturedAt,
    basis_keys,
    option_positions,
    actor_candidates,
    actor_feasibility_bases,
    intervention_option_ids_without_actor_candidates,
  };
}

// ─── Collection reads ─────────────────────────────────────────────────────────

/** Returns all RealityDecisionDeclarations for a given Decision Space. */
export function getRealityDecisionDeclarationsForSpace(
  projectState: ProjectState,
  decisionSpaceId: string
): RealityDecisionDeclaration[] {
  return projectState.reality_decision_declarations
    .filter((d) => d.decision_space_id === decisionSpaceId)
    .sort((a, b) => {
      if (compareTemporalInstants(a.decided_at, b.decided_at) !== 0) {
        return compareTemporalInstants(a.decided_at, b.decided_at) < 0 ? -1 : 1;
      }
      if (a.decision_maker_entity_id !== b.decision_maker_entity_id) {
        return compareIds(a.decision_maker_entity_id, b.decision_maker_entity_id);
      }
      const aKey = realityDecisionSemanticKey(
        a.decision_space_id,
        a.decision_maker_entity_id,
        a.decided_at,
        a.selected_option,
        a.selected_actor_entity_id
      );
      const bKey = realityDecisionSemanticKey(
        b.decision_space_id,
        b.decision_maker_entity_id,
        b.decided_at,
        b.selected_option,
        b.selected_actor_entity_id
      );
      if (aKey !== bKey) {
        return aKey < bKey ? -1 : 1;
      }
      return compareIds(a.id, b.id);
    });
}

// ─── Derived groupings ────────────────────────────────────────────────────────

function declarerKey(d: ReferenceDeclarer): string {
  return [d.kind, d.entity_id ?? "", d.external_id ?? "", d.label ?? ""].join("|");
}

/**
 * Groups declarations into semantic Decision positions.
 * Declarations with same (space, maker, decidedAt, selection, actor) → one position.
 * No truth winner; no source voting.
 */
export function groupRealityDecisionPositions(
  declarations: RealityDecisionDeclaration[]
): RealityDecisionPosition[] {
  const map = new Map<string, RealityDecisionDeclaration[]>();

  for (const decl of declarations) {
    const key = realityDecisionSemanticKey(
      decl.decision_space_id,
      decl.decision_maker_entity_id,
      decl.decided_at,
      decl.selected_option,
      decl.selected_actor_entity_id
    );
    const arr = map.get(key) ?? [];
    arr.push(decl);
    map.set(key, arr);
  }

  const positions: RealityDecisionPosition[] = [];
  for (const [key, decls] of map) {
    const first = decls[0]!;
    const allDeclarers = decls.map((d) => d.declared_by);
    const uniqueDeclarers = [...new Map(allDeclarers.map((d) => [declarerKey(d), d])).values()];
    positions.push({
      key,
      decision_space_id: first.decision_space_id,
      decision_maker_entity_id: first.decision_maker_entity_id,
      decided_at: first.decided_at,
      selected_option: first.selected_option,
      selected_actor_entity_id: first.selected_actor_entity_id ?? null,
      decision_declaration_ids: decls.map((d) => d.id).sort(compareIds),
      declarers: uniqueDeclarers.sort((a, b) =>
        declarerKey(a).localeCompare(declarerKey(b))
      ),
      has_multiple_declarations: decls.length > 1,
    });
  }

  return positions.sort((a, b) => {
    if (compareTemporalInstants(a.decided_at, b.decided_at) !== 0) {
      return compareTemporalInstants(a.decided_at, b.decided_at) < 0 ? -1 : 1;
    }
    if (a.decision_maker_entity_id !== b.decision_maker_entity_id) {
      return compareIds(a.decision_maker_entity_id, b.decision_maker_entity_id);
    }
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });
}

/**
 * Detects selection conflicts: same (space, maker, decidedAt) scope
 * but different semantic selections.
 * No winner. Different Decision makers are NOT automatically a conflict.
 */
export function detectDecisionSelectionConflicts(
  positions: RealityDecisionPosition[]
): DecisionSelectionConflict[] {
  const scopeMap = new Map<string, RealityDecisionPosition[]>();

  for (const pos of positions) {
    const scopeKey = decisionConflictScopeKey(
      pos.decision_space_id,
      pos.decision_maker_entity_id,
      pos.decided_at
    );
    const arr = scopeMap.get(scopeKey) ?? [];
    arr.push(pos);
    scopeMap.set(scopeKey, arr);
  }

  const conflicts: DecisionSelectionConflict[] = [];
  for (const [scopeKey, scopePositions] of scopeMap) {
    if (scopePositions.length > 1) {
      const first = scopePositions[0]!;
      conflicts.push({
        key: scopeKey,
        decision_space_id: first.decision_space_id,
        decision_maker_entity_id: first.decision_maker_entity_id,
        decided_at: first.decided_at,
        conflicting_positions: scopePositions.sort((a, b) =>
          a.key < b.key ? -1 : a.key > b.key ? 1 : 0
        ),
      });
    }
  }

  return conflicts.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
}

/**
 * Derives the capture relation between decided_at and recorded_at.
 * Exact equality → CAPTURED_AT_DECISION_TIME.
 * captured_at > decided_at → RETROSPECTIVE_RECONSTRUCTION.
 */
export function deriveDecisionContextCaptureRelation(
  decidedAt: string,
  capturedAt: string
): DecisionContextCaptureRelation {
  return compareTemporalInstants(decidedAt, capturedAt) === 0
    ? "CAPTURED_AT_DECISION_TIME"
    : "RETROSPECTIVE_RECONSTRUCTION";
}

/**
 * Builds a DecisionMemoryAssessment for a single RealityDecisionDeclaration.
 * Read-only. Does not mutate ProjectState.
 */
export function assessDecisionMemory(
  decl: RealityDecisionDeclaration
): DecisionMemoryAssessment {
  const context_capture_relation = deriveDecisionContextCaptureRelation(
    decl.decided_at,
    decl.context_snapshot.captured_at
  );

  const actorEntityId = decl.selected_actor_entity_id ?? null;

  let selected_actor_was_candidate: boolean | null = null;
  let selected_actor_feasibility_basis: DecisionActorFeasibilityBasisSnapshot | null = null;

  if (decl.selected_option.kind === "INTERVENTION" && actorEntityId !== null) {
    const interventionId = decl.selected_option.intervention_id;
    const candidate = decl.context_snapshot.actor_candidates.find(
      (c) =>
        c.intervention_id === interventionId && c.actor_entity_id === actorEntityId
    );
    selected_actor_was_candidate = candidate !== undefined;
    if (selected_actor_was_candidate) {
      selected_actor_feasibility_basis =
        decl.context_snapshot.actor_feasibility_bases.find(
          (fb) =>
            fb.intervention_id === interventionId &&
            fb.actor_entity_id === actorEntityId
        ) ?? null;
    }
  }

  return {
    decision_declaration: decl,
    snapshot_verification: getDecisionSnapshotVerification(decl),
    context_capture_relation,
    selected_option_was_represented: true,
    selected_actor_was_candidate,
    selected_actor_feasibility_basis,
    decision_authority_modeled: false,
    outcome_modeled: false,
  };
}

/**
 * Returns the full Decision history for a Decision Space.
 * No current/effective Decision. No supersession. No lifecycle.
 */
export function getDecisionSpaceDecisionHistory(
  projectState: ProjectState,
  decisionSpaceId: string
): DecisionSpaceDecisionHistory {
  const decision_declarations = getRealityDecisionDeclarationsForSpace(
    projectState,
    decisionSpaceId
  );
  const decision_positions = groupRealityDecisionPositions(decision_declarations);
  const selection_conflicts = detectDecisionSelectionConflicts(decision_positions);

  return {
    decision_space_id: decisionSpaceId,
    decision_declarations,
    decision_positions,
    selection_conflicts,
    has_decisions: decision_declarations.length > 0,
    has_selection_conflicts: selection_conflicts.length > 0,
  };
}
