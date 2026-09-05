/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * identity helpers (shared by GROUND-076 / GROUND-077+).
 *
 * Derived only. Not persisted.
 *
 * Canonical identity for the exact non-empty GROUND-048 Requirement set.
 * GROUND-048 remains authoritative for which Requirements exist.
 * This module provides identity anchors only — no policy / no Satisfaction.
 */

/**
 * Stable canonical exact Requirement key ordering (serialization only).
 */
export function canonicalizeCapabilityRequirementKeys(
  keys: readonly string[]
): string[] {
  return [...keys].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/**
 * Runtime-only identity anchor for the exact non-empty GROUND-048 Requirement set.
 * Not a second authority for which Requirements exist.
 *
 * Format:
 * capability-requirement-set|candidateKey|observationNeedKey|canonicalExactCapabilityRequirementKeySet
 */
export function buildAttentionObservationCapabilityRequirementSetKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementKeys: readonly string[]
): string {
  const canonicalKeys = canonicalizeCapabilityRequirementKeys(
    capabilityRequirementKeys
  );
  return [
    "capability-requirement-set",
    candidateKey,
    observationNeedKey,
    canonicalKeys.join(","),
  ].join("|");
}
