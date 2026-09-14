/** Patch admission is not temporal verification. Only proven violations reject.
 * Strict temporal consumers (Worldline and identity builders) remain unchanged.
 */
import { TemporalResolutionError, compareTemporalInstants } from "./temporal.js";
export type TemporalPrerequisite<T> =
  | { status: "VERIFIED"; value: T }
  | { status: "UNRESOLVED"; error: TemporalResolutionError };
export function assessTemporalPrerequisite<T>(evaluate: () => T): TemporalPrerequisite<T> {
  try { return { status: "VERIFIED", value: evaluate() }; }
  catch (error) {
    if (error instanceof TemporalResolutionError) return { status: "UNRESOLVED", error };
    throw error; // Syntax, schema, structural and all other failures remain failures.
  }
}
export type TemporalRelationOperator = "<" | "<=" | ">" | ">=" | "===" | "!==";
export function assessAdmissionTemporalRelation(a: string, b: string, op: TemporalRelationOperator): TemporalPrerequisite<boolean> {
  return assessTemporalPrerequisite(() => {
    const order = compareTemporalInstants(a, b, "patch temporal invariant");
    switch(op) {
      case "<": return order < 0;
      case "<=": return order <= 0;
      case ">": return order > 0;
      case ">=": return order >= 0;
      case "===": return order === 0;
      case "!==": return order !== 0;
    }
  });
}
/** false means relation NOT PROVEN, not that its negation was verified. */
export function isAdmissionTemporalRelationProven(a: string, b: string, op: TemporalRelationOperator): boolean {
  const result = assessAdmissionTemporalRelation(a, b, op);
  return result.status === "VERIFIED" && result.value;
}
export function haveVerifiedEqualValues<T>(a: TemporalPrerequisite<T>, b: TemporalPrerequisite<T>): boolean {
  return a.status === "VERIFIED" && b.status === "VERIFIED" && a.value === b.value;
}
