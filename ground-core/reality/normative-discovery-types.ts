/**
 * Reality Core v0.7 — Normative Discovery types (GROUND-012).
 *
 * Derived only. Not persisted.
 * PROBLEM = reference-relative ACCEPTABLE deviation only.
 * PROBLEM ≠ authorized / must_fix / priority.
 */

import type { ReferenceKind } from "../types.js";
import type { ReferenceComparisonResult } from "./reference-criterion.js";
import type { ReferenceStateAssessment } from "./reference-types.js";

export type NormativeFindingKind =
  | "PROBLEM"
  | "REFERENCE_CONFLICT"
  | "CURRENT_STATE_CONFLICT"
  | "CURRENT_STATE_MISSING"
  | "UNSUPPORTED_REFERENCE_COMPARISON"
  | "EXPECTED_DEVIATION"
  | "DESIRED_GAP";

/**
 * UNCONTESTED_REFERENCE — no applicable Reference conflict for this reference_kind scope.
 * Does NOT mean authorized / binding / official.
 *
 * CONTESTED_REFERENCE — applicable same-kind References conflict.
 *
 * INDETERMINATE — comparison could not be safely evaluated.
 */
export type NormativeBasisStatus =
  | "UNCONTESTED_REFERENCE"
  | "CONTESTED_REFERENCE"
  | "INDETERMINATE";

export interface NormativeFindingDetails {
  reference_conflict_key?: string;
  declarer_kind?: string;
  declarer_entity_id?: string | null;
  note?: string;
}

export interface NormativeFinding {
  key: string;
  kind: NormativeFindingKind;
  subject_id: string;
  state_kind: string;
  at: string;
  situation_key: string | null;
  reference_condition_ids: string[];
  reference_kind: ReferenceKind | null;
  current_state_ids: string[];
  current_value_keys: string[];
  comparison_results: ReferenceComparisonResult[];
  basis_status: NormativeBasisStatus;
  details: NormativeFindingDetails;
}

export interface NormativeDiscoveryAssessment {
  subject_id: string;
  at: string;
  situation_key: string | null;
  reference_state_assessments: ReferenceStateAssessment[];
  findings: NormativeFinding[];
  problem_findings: NormativeFinding[];
  has_findings: boolean;
  has_reference_relative_problem: boolean;
  has_uncontested_problem: boolean;
  has_reference_conflict: boolean;
  has_indeterminate_comparison: boolean;
}
