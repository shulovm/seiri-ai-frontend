import type { DecisionSnapshotVerification } from "../types.js";
/**
 * Reality Core v0.7 — Decision Memory I derived types (GROUND-028).
 *
 * Read-only assessment types. Must not import state-engine / file-store / studio.
 * Decision ≠ Commitment / Intent / Execution / Authority / feasibility verdict.
 * chosen != correct / feasible / authorized / committed / executed.
 */

import type {
  DecisionActorFeasibilityBasisSnapshot,
  RealityDecisionDeclaration,
  RealityDecisionSelection,
  ReferenceDeclarer,
} from "../types.js";

/**
 * Describes the epistemic relation between the snapshot capture time
 * and the declared Decision time.
 *
 * CAPTURED_AT_DECISION_TIME: captured_at === decided_at.
 * RETROSPECTIVE_RECONSTRUCTION: captured_at > decided_at.
 *   Does NOT mean the snapshot is false or the Decision is invalid.
 *   Consumers must not interpret the snapshot as strict proof of
 *   what GROUND knew at decided_at.
 */
export type DecisionContextCaptureRelation =
  | "CAPTURED_AT_DECISION_TIME"
  | "RETROSPECTIVE_RECONSTRUCTION";

/**
 * Derived grouping of Decision declarations that share the same
 * semantic Decision identity:
 *   decision_space + decision_maker + decided_at + selected_option + selected_actor
 *
 * Multiple declarations may exist (multiple provenance sources).
 * No truth winner. No source voting.
 */
export interface RealityDecisionPosition {
  key: string;
  decision_space_id: string;
  decision_maker_entity_id: string;
  decided_at: string;
  selected_option: RealityDecisionSelection;
  selected_actor_entity_id: string | null;
  decision_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

/**
 * Detected conflict: multiple Decision positions with different semantic selections
 * for the same (decision_space, decision_maker, decided_at) scope.
 *
 * No winner. No automatic resolution. Latest record does NOT win.
 * Different decision makers at the same time are NOT a conflict.
 */
export interface DecisionSelectionConflict {
  key: string;
  decision_space_id: string;
  decision_maker_entity_id: string;
  decided_at: string;
  conflicting_positions: RealityDecisionPosition[];
}

/**
 * Decision Memory assessment for a single RealityDecisionDeclaration.
 *
 * Invariants modeled by GROUND-028:
 *   decision_authority_modeled = false (not implemented)
 *   outcome_modeled = false (not implemented)
 *
 * selected_option_was_represented = true because write-time validation
 * guarantees membership in the recorded snapshot. This does not itself prove
 * that snapshot was verified: consult snapshot_verification for historical authority.
 */
export interface DecisionMemoryAssessment {
  decision_declaration: RealityDecisionDeclaration;
  snapshot_verification: DecisionSnapshotVerification;
  context_capture_relation: DecisionContextCaptureRelation;
  selected_option_was_represented: true;
  selected_actor_was_candidate: boolean | null;
  selected_actor_feasibility_basis: DecisionActorFeasibilityBasisSnapshot | null;
  decision_authority_modeled: false;
  outcome_modeled: false;
}

/**
 * Full Decision history for a Decision Space.
 * Sorted deterministically (decided_at, decision_maker, semantic key, id).
 * No current/effective Decision. No supersession. No lifecycle.
 */
export interface DecisionSpaceDecisionHistory {
  decision_space_id: string;
  decision_declarations: RealityDecisionDeclaration[];
  decision_positions: RealityDecisionPosition[];
  selection_conflicts: DecisionSelectionConflict[];
  has_decisions: boolean;
  has_selection_conflicts: boolean;
}
