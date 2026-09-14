import type { DecisionSnapshotVerification } from "../types.js";
/**
 * Reality Core v0.7 — Intent Core I derived types (GROUND-029).
 *
 * Read-only assessment types. Must not import state-engine / file-store / studio.
 * Intent != Decision / Mandate / Permission / Capability / Resource /
 * Commitment / Execution.
 *
 * PURSUE != committed / permitted / feasible / will execute.
 * REFRAIN != PROHIBIT / Decision revoked / Commitment cancelled.
 * NO_INTENT_DECLARATIONS != REFRAIN.
 */

import type { DecisionContextCaptureRelation } from "./decision-memory-types.js";
import type {
  InterventionIntentDeclaration,
  InterventionIntentDisposition,
  ReferenceDeclarer,
} from "../types.js";

export type DeclaredInterventionIntentStatus =
  | "NO_INTENT_DECLARATIONS"
  | "PURSUE_DECLARED"
  | "REFRAIN_DECLARED"
  | "CONTESTED_INTENT";

export interface DeclaredInterventionIntentAssessment {
  intent_holder_entity_id: string;
  intervention_id: string;
  at: string;
  status: DeclaredInterventionIntentStatus;
  intent_declaration_ids: string[];
  pursue_declaration_ids: string[];
  refrain_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_pursue_declaration: boolean;
  has_refrain_declaration: boolean;
  has_intent_conflict: boolean;
}

export interface IntentDispositionConflict {
  key: string;
  intent_holder_entity_id: string;
  intervention_id: string;
  at: string;
  pursue_declaration_ids: string[];
  refrain_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface InterventionIntentPosition {
  key: string;
  intent_holder_entity_id: string;
  intervention_id: string;
  disposition: InterventionIntentDisposition;
  intent_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  has_multiple_declarations: boolean;
}

export type DecisionSelectedActorRelation =
  | "DECISION_HAS_NO_SELECTED_ACTOR"
  | "INTENT_HOLDER_IS_SELECTED_ACTOR"
  | "INTENT_HOLDER_DIFFERS_FROM_SELECTED_ACTOR";

export type DecisionIntentDispositionRelation =
  | "PURSUES_SELECTED_INTERVENTION"
  | "REFRAINS_FROM_SELECTED_INTERVENTION";

/**
 * Descriptive relation between an Intent declaration and an optional
 * RealityDecisionDeclaration basis. No validity / compliance / violation verdict.
 */
export interface IntentDecisionBasisAssessment {
  intent_declaration_id: string;
  decision_basis_declaration_id: string | null;
  has_decision_basis: boolean;
  decision_selected_actor_entity_id: string | null;
  selected_actor_relation: DecisionSelectedActorRelation | null;
  holder_was_candidate_in_decision_snapshot: boolean | null;
  disposition_relation: DecisionIntentDispositionRelation | null;
  decision_context_capture_relation: DecisionContextCaptureRelation | null;
  decision_snapshot_verification: DecisionSnapshotVerification | null;
}

export interface InterventionIntentHistory {
  intent_holder_entity_id: string;
  intervention_id: string;
  declarations: InterventionIntentDeclaration[];
  has_declarations: boolean;
}
