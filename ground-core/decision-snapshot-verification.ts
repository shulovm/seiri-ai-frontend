/** Frozen content integrity and stored persistence-time verification only.
 * No current ProjectState, temporal evaluation, or read-time revalidation.
 */
import { createHash } from "node:crypto";
import { ValidationError } from "./errors.js";
import { canonicalValueKey } from "./reality/semantic-equality.js";
import type { DecisionSnapshotVerification, RealityDecisionDeclaration } from "./types.js";

/** Content fingerprint, NOT a semantic instant key. Source timestamp spelling is retained.
 * Binding exact content is stronger than semantic equality and cannot authorize a
 * semantically changed snapshot. It grants no temporal resolution to unresolved text.
 */
export function decisionSnapshotContentDigest(decl: RealityDecisionDeclaration): string {
  const content = {
    project_id: decl.project_id, decision_id: decl.id,
    decision_space_id: decl.decision_space_id,
    decision_maker_entity_id: decl.decision_maker_entity_id,
    selected_option: decl.selected_option,
    selected_actor_entity_id: decl.selected_actor_entity_id ?? null,
    decided_at: decl.decided_at, recorded_at: decl.recorded_at,
    context_snapshot: decl.context_snapshot,
  };
  return `sha256:${createHash("sha256").update(canonicalValueKey(content)).digest("hex")}`;
}

/** Missing historical evidence is not evidence of failed or incomplete verification. */
export function legacyDecisionSnapshotVerification(decl: RealityDecisionDeclaration): DecisionSnapshotVerification {
  return { decision_id: decl.id, snapshot_content_digest: decisionSnapshotContentDigest(decl),
    status: "NOT_RECORDED", persisted_at: null, reason: "LEGACY_VERIFICATION_FACT_NOT_RECORDED" };
}

/** Public read boundary: never manufacture a historical success from current Reality. */
export function getDecisionSnapshotVerification(decl: RealityDecisionDeclaration): DecisionSnapshotVerification {
  const fact = decl.snapshot_verification ?? legacyDecisionSnapshotVerification(decl);
  if (fact.decision_id !== decl.id || fact.snapshot_content_digest !== decisionSnapshotContentDigest(decl)) {
    throw new ValidationError("Decision snapshot verification is bound to different frozen content");
  }
  return structuredClone(fact);
}

/** Raw recorded basis always travels with its historical verification fact. */
export function getDecisionHistoricalSnapshot(decl: RealityDecisionDeclaration) {
  return { snapshot: structuredClone(decl.context_snapshot), verification: getDecisionSnapshotVerification(decl) };
}
