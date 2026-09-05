/** Exact instant mechanics. Declaration text is never rewritten.
 * Syntax authority: the same ajv-formats full date-time validator used by validate.ts.
 * No clock, Date parser, precision limit, leap-second calendar or persisted state.
 */
import { fullFormats } from "ajv-formats/dist/formats.js";
import { GroundCoreError, ValidationError } from "./errors.js";

export interface ExactTemporalInstant {
  day: number;
  second: number;
  fraction: string;
  key: string;
}
export type TemporalResolution =
  | { status: "RESOLVED"; declaration: string; instant: ExactTemporalInstant }
  | { status: "UNRESOLVED"; declaration: string; reason: "LEAP_SECOND_AUTHORITY_NOT_AVAILABLE" }
  | { status: "INVALID"; declaration: string; reason: "INVALID_TIMESTAMP_SYNTAX" };

export class TemporalResolutionError extends GroundCoreError {
  readonly declaration: string;
  readonly operation: string;
  readonly reason: "LEAP_SECOND_AUTHORITY_NOT_AVAILABLE";
  constructor(resolution: Extract<TemporalResolution, { status: "UNRESOLVED" }>, operation: string) {
    super(`Cannot resolve timestamp for ${operation}: ${resolution.declaration}`, "TEMPORAL_RESOLUTION_UNAVAILABLE");
    this.name = "TemporalResolutionError";
    this.declaration = resolution.declaration;
    this.operation = operation;
    this.reason = resolution.reason;
  }
}
const format = fullFormats["date-time"] as { validate: (value: string) => boolean };
function leap(year: number): boolean { return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0); }
function daysInMonth(year: number, month: number): number {
  return [31, leap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]!;
}
/** Proleptic Gregorian day number; integer arithmetic, including year zero. */
function dayNumber(y: number, m: number, d: number): number {
  const prior = y - 1;
  let day = 365 * prior + Math.floor(prior / 4) - Math.floor(prior / 100) + Math.floor(prior / 400) + d;
  for (let month = 1; month < m; month++) day += daysInMonth(y, month);
  return day;
}
export function resolveTemporalInstant(declaration: string): TemporalResolution {
  if (typeof declaration !== "string" || !format.validate(declaration)) {
    return { status: "INVALID", declaration, reason: "INVALID_TIMESTAMP_SYNTAX" };
  }
  const [date, time] = declaration.split(/t|\s/i);
  let [year, month, day] = date!.split("-").map(Number) as [number, number, number];
  const parts = /^(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(z|([+-])(\d{2})(?::?(\d{2}))?)$/i.exec(time!)!;
  const seconds = Number(parts[3]);
  if (seconds === 60) return { status: "UNRESOLVED", declaration, reason: "LEAP_SECOND_AUTHORITY_NOT_AVAILABLE" };
  const fraction = (parts[4] ?? "").replace(/0+$/, "");
  const offset = (parts[6] === "-" ? -1 : 1) * (Number(parts[7] ?? 0) * 60 + Number(parts[8] ?? 0));
  let second = Number(parts[1]) * 3600 + Number(parts[2]) * 60 + seconds - offset * 60;
  const shift = Math.floor(second / 86400);
  second -= shift * 86400;
  const ordinal = dayNumber(year, month, day) + shift;
  day += shift;
  if (day < 1) { month--; if (month < 1) { year--; month = 12; } day += daysInMonth(year, month); }
  if (day > daysInMonth(year, month)) { day -= daysInMonth(year, month); month++; if (month > 12) { year++; month = 1; } }
  const pad = (n: number) => String(n).padStart(2, "0");
  const yearText = year < 0 ? "-" + String(-year).padStart(6, "0") : year > 9999 ? "+" + String(year).padStart(6, "0") : String(year).padStart(4, "0");
  // Preserve ordinary legacy millisecond keys while removing representation-only differences.
  const key = `${yearText}-${pad(month)}-${pad(day)}T${pad(Math.floor(second / 3600))}:${pad(Math.floor(second % 3600 / 60))}:${pad(second % 60)}.${fraction.padEnd(3, "0")}Z`;
  return { status: "RESOLVED", declaration, instant: { day: ordinal, second, fraction, key } };
}
export function requireTemporalInstant(declaration: string, operation = "temporal instant consumption"): ExactTemporalInstant {
  const resolution = resolveTemporalInstant(declaration);
  if (resolution.status === "UNRESOLVED") throw new TemporalResolutionError(resolution, operation);
  if (resolution.status === "INVALID") throw new ValidationError("Invalid timestamp syntax", { declaration, operation, reason: resolution.reason });
  return resolution.instant;
}
export function temporalInstantKey(declaration: string, operation = "canonical temporal identity"): string {
  return requireTemporalInstant(declaration, operation).key;
}
export function compareTemporalInstants(a: string, b: string, operation = "temporal comparison"): number {
  const x = requireTemporalInstant(a, operation);
  const y = requireTemporalInstant(b, operation);
  if (x.day !== y.day) return x.day < y.day ? -1 : 1;
  if (x.second !== y.second) return x.second < y.second ? -1 : 1;
  // Decimal fractions compare lexically after right-padding, without numeric conversion.
  const width = Math.max(x.fraction.length, y.fraction.length);
  const xf = x.fraction.padEnd(width, "0"), yf = y.fraction.padEnd(width, "0");
  return xf < yf ? -1 : xf > yf ? 1 : 0;
}
