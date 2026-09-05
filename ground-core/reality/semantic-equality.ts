/**
 * Deterministic semantic equality for RealityStateValue / Claim values.
 *
 * Object key order does not affect equality.
 * Arrays remain order-sensitive.
 * Primitive type distinctions preserved ("1" !== 1).
 * Pure — no mutation.
 */

export function canonicalizeSemanticValue(value: unknown): unknown {
  if (value === null) {
    return null;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalizeSemanticValue(entry));
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      out[key] = canonicalizeSemanticValue(record[key]);
    }
    return out;
  }
  // Unsupported runtime shapes (undefined, function, symbol) — stringify via tag
  return { __non_json__: String(value) };
}

/** Stable canonical key for grouping / comparison. */
export function canonicalValueKey(value: unknown): string {
  return JSON.stringify(canonicalizeSemanticValue(value));
}

export function semanticValuesEqual(a: unknown, b: unknown): boolean {
  return canonicalValueKey(a) === canonicalValueKey(b);
}
