/** Observation recency is a proposition, not timestamp cleanliness. */
import { compareTemporalInstants, TemporalResolutionError } from "./temporal.js";
import type { ProjectState } from "./types.js";
export type ObservationRecency =
  | { status: "RESOLVED"; value: boolean }
  | { status: "UNRESOLVED"; error: TemporalResolutionError };
export function assessObservationRecency(
  observations: ProjectState["observations"], days = 30, now = Date.now()
): ObservationRecency {
  const threshold = new Date(now - days * 86400000).toISOString();
  let unresolved: TemporalResolutionError | undefined;
  for (const observation of observations) {
    try {
      if (compareTemporalInstants(observation.created_at, threshold,
        `Observation ${observation.id}: recent observation exists (${days} days)`) >= 0) {
        return { status: "RESOLVED", value: true };
      }
    } catch (error) {
      if (!(error instanceof TemporalResolutionError)) throw error;
      unresolved ??= error;
    }
  }
  return unresolved ? { status: "UNRESOLVED", error: unresolved }
    : { status: "RESOLVED", value: false };
}
export function requireObservationRecency(result: ObservationRecency): boolean {
  if (result.status === "UNRESOLVED") throw result.error;
  return result.value;
}
