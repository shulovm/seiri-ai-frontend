/**
 * Reality Core v0.7 — Reference State assessment types (GROUND-011).
 *
 * Derived read models only.
 * DEVIATES ≠ PROBLEM / NEED / RISK / unsafe.
 */

import type {
  ReferenceCondition,
  ReferenceCriterion,
  ReferenceKind,
  RealityState,
  RealityStateValue,
} from "../types.js";
import type { ReferenceComparisonResult } from "./reference-criterion.js";

export type CurrentStateStatus =
  | "NO_CURRENT_STATE"
  | "SINGLE_VALUE"
  | "CONFLICTED";

export interface CurrentStateAssessment {
  subject_id: string;
  state_kind: string;
  at: string;
  active_states: RealityState[];
  /** Distinct semantic values (canonical keys sorted). */
  semantic_values: RealityStateValue[];
  status: CurrentStateStatus;
}

export interface ReferenceComparison {
  reference_condition_id: string;
  reference_kind: ReferenceKind;
  current_status: CurrentStateStatus;
  current_value: RealityStateValue | null;
  criterion: ReferenceCriterion;
  result: ReferenceComparisonResult;
}

export type ReferenceConflictKind =
  | "CRITERION_INCOMPATIBLE"
  | "UNSUPPORTED_COMPARISON";

export interface ReferenceConflict {
  key: string;
  subject_id: string;
  state_kind: string;
  reference_kind: ReferenceKind;
  at: string;
  reference_condition_ids: string[];
  conflict_kind: ReferenceConflictKind;
  note: string;
}

export interface ReferenceStateQuery {
  subjectId: string;
  stateKind: string;
  at: string;
}

export interface ReferenceStateAssessment {
  subject_id: string;
  state_kind: string;
  at: string;
  current: CurrentStateAssessment;
  applicable_references: ReferenceCondition[];
  comparisons: ReferenceComparison[];
  reference_conflicts: ReferenceConflict[];
  has_deviation: boolean;
  has_reference_conflict: boolean;
}
