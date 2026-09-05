/**
 * Reference criterion validation and deterministic comparison (GROUND-011).
 * Shared by persistence validation and read-only assessment.
 */

import { PatchError } from "../errors.js";
import type { ReferenceCriterion, RealityStateValue } from "../types.js";
import {
  canonicalValueKey,
  semanticValuesEqual,
} from "./semantic-equality.js";

export type ReferenceComparisonResult =
  | "MATCH"
  | "DEVIATES"
  | "NO_CURRENT_STATE"
  | "CURRENT_CONFLICTED"
  | "UNSUPPORTED_COMPARISON";

export type ReferenceConflictResult = "CONFLICT" | "COMPATIBLE" | "UNSUPPORTED";

export function dedupeSemanticValues(
  values: RealityStateValue[]
): RealityStateValue[] {
  const byKey = new Map<string, RealityStateValue>();
  for (const value of values) {
    byKey.set(canonicalValueKey(value), value);
  }
  return [...byKey.values()].sort((a, b) =>
    canonicalValueKey(a) < canonicalValueKey(b) ? -1 : 1
  );
}

export function validateReferenceCriterion(criterion: ReferenceCriterion): void {
  switch (criterion.kind) {
    case "EQUALS":
      if (criterion.value === undefined) {
        throw new PatchError("EQUALS criterion requires value");
      }
      return;
    case "ONE_OF": {
      if (!Array.isArray(criterion.values) || criterion.values.length === 0) {
        throw new PatchError("ONE_OF criterion requires at least one value");
      }
      return;
    }
    case "NUMERIC_RANGE": {
      const { min, max, min_inclusive, max_inclusive } = criterion;
      if (min === null && max === null) {
        throw new PatchError(
          "NUMERIC_RANGE requires min or max (or both)"
        );
      }
      if (min !== null && max !== null) {
        if (min > max) {
          throw new PatchError("NUMERIC_RANGE min must be <= max");
        }
        if (
          min === max &&
          (!min_inclusive || !max_inclusive)
        ) {
          throw new PatchError(
            "NUMERIC_RANGE with min === max requires both endpoints inclusive"
          );
        }
      }
      return;
    }
    default:
      throw new PatchError("Unknown ReferenceCriterion kind");
  }
}

export function normalizeReferenceCriterion(
  criterion: ReferenceCriterion
): ReferenceCriterion {
  validateReferenceCriterion(criterion);
  if (criterion.kind === "ONE_OF") {
    return {
      kind: "ONE_OF",
      values: dedupeSemanticValues(criterion.values),
    };
  }
  return criterion;
}

export function valueSatisfiesCriterion(
  value: RealityStateValue,
  criterion: ReferenceCriterion
): boolean {
  switch (criterion.kind) {
    case "EQUALS":
      return semanticValuesEqual(value, criterion.value);
    case "ONE_OF":
      return criterion.values.some((entry) => semanticValuesEqual(value, entry));
    case "NUMERIC_RANGE":
      if (typeof value !== "number") {
        return false;
      }
      return numericInRange(value, criterion);
    default:
      return false;
  }
}

function numericInRange(
  value: number,
  criterion: Extract<ReferenceCriterion, { kind: "NUMERIC_RANGE" }>
): boolean {
  if (criterion.min !== null) {
    if (criterion.min_inclusive) {
      if (value < criterion.min) {
        return false;
      }
    } else if (value <= criterion.min) {
      return false;
    }
  }
  if (criterion.max !== null) {
    if (criterion.max_inclusive) {
      if (value > criterion.max) {
        return false;
      }
    } else if (value >= criterion.max) {
      return false;
    }
  }
  return true;
}

export function compareValueToCriterion(
  value: RealityStateValue | null,
  criterion: ReferenceCriterion
): ReferenceComparisonResult {
  if (value === null) {
    return "UNSUPPORTED_COMPARISON";
  }
  if (criterion.kind === "NUMERIC_RANGE" && typeof value !== "number") {
    return "UNSUPPORTED_COMPARISON";
  }
  return valueSatisfiesCriterion(value, criterion) ? "MATCH" : "DEVIATES";
}

function satisfiesEquals(
  criterion: Extract<ReferenceCriterion, { kind: "EQUALS" }>,
  other: ReferenceCriterion
): boolean {
  switch (other.kind) {
    case "EQUALS":
      return semanticValuesEqual(criterion.value, other.value);
    case "ONE_OF":
      return other.values.some((v) => semanticValuesEqual(criterion.value, v));
    case "NUMERIC_RANGE":
      if (typeof criterion.value !== "number") {
        return false;
      }
      return numericInRange(criterion.value, other);
    default:
      return false;
  }
}

function satisfiesOneOf(
  criterion: Extract<ReferenceCriterion, { kind: "ONE_OF" }>,
  other: ReferenceCriterion
): boolean {
  switch (other.kind) {
    case "EQUALS":
      return criterion.values.some((v) => semanticValuesEqual(v, other.value));
    case "ONE_OF":
      return criterion.values.some((a) =>
        other.values.some((b) => semanticValuesEqual(a, b))
      );
    case "NUMERIC_RANGE":
      return criterion.values.some(
        (v) => typeof v === "number" && numericInRange(v, other)
      );
    default:
      return false;
  }
}

function numericRangesIntersect(
  a: Extract<ReferenceCriterion, { kind: "NUMERIC_RANGE" }>,
  b: Extract<ReferenceCriterion, { kind: "NUMERIC_RANGE" }>
): boolean {
  const aMin = a.min ?? -Infinity;
  const aMax = a.max ?? Infinity;
  const bMin = b.min ?? -Infinity;
  const bMax = b.max ?? Infinity;

  if (aMax < bMin) {
    return false;
  }
  if (aMax === bMin && !(a.max_inclusive && b.min_inclusive)) {
    return false;
  }
  if (bMax < aMin) {
    return false;
  }
  if (bMax === aMin && !(b.max_inclusive && a.min_inclusive)) {
    return false;
  }
  return true;
}

/** Whether any single value could satisfy both criteria. */
export function criteriaAreCompatible(
  a: ReferenceCriterion,
  b: ReferenceCriterion
): ReferenceConflictResult {
  if (a.kind === "NUMERIC_RANGE" && b.kind === "NUMERIC_RANGE") {
    return numericRangesIntersect(a, b) ? "COMPATIBLE" : "CONFLICT";
  }
  if (a.kind === "EQUALS") {
    return satisfiesEquals(a, b) ? "COMPATIBLE" : "CONFLICT";
  }
  if (a.kind === "ONE_OF") {
    return satisfiesOneOf(a, b) ? "COMPATIBLE" : "CONFLICT";
  }
  if (b.kind === "EQUALS") {
    return satisfiesEquals(b, a) ? "COMPATIBLE" : "CONFLICT";
  }
  if (b.kind === "ONE_OF") {
    return satisfiesOneOf(b, a) ? "COMPATIBLE" : "CONFLICT";
  }
  return "UNSUPPORTED";
}
