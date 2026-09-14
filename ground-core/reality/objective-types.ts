/**
 * Reality Core v0.7 — Objective Core assessment types (GROUND-013).
 *
 * Derived read models only. No NEED / BLOCKER / priority / Action.
 */

import type { ReferenceComparison } from "./reference-types.js";
import type {
  ObjectiveDependency,
  ObjectiveRequirement,
  RealityObjective,
} from "../types.js";

export type RequirementAssessmentStatus =
  | "SATISFIED"
  | "UNSATISFIED"
  | "INDETERMINATE";

export interface RequirementAssessment {
  requirement_id: string;
  reference_condition_id: string;
  at: string;
  reference_comparison: ReferenceComparison | null;
  status: RequirementAssessmentStatus;
  /** True if the Requirement's ReferenceCondition participates in a same-kind conflict. */
  reference_basis_contested: boolean;
  note?: string | null;
}

export type ObjectiveTargetAssessmentStatus =
  | "TARGETS_SATISFIED"
  | "TARGETS_UNSATISFIED"
  | "TARGETS_INDETERMINATE";

export interface ObjectiveTargetAssessment {
  objective_id: string;
  at: string;
  target_comparisons: ReferenceComparison[];
  status: ObjectiveTargetAssessmentStatus;
}

export type DependencyAssessmentStatus =
  | "PREREQUISITE_SATISFIED"
  | "PREREQUISITE_UNSATISFIED"
  | "PREREQUISITE_INDETERMINATE";

export interface DependencyAssessment {
  dependency_id: string;
  objective_id: string;
  requirement_id: string;
  at: string;
  requirement_assessment: RequirementAssessment | null;
  status: DependencyAssessmentStatus;
  note?: string | null;
}

export interface ObjectiveStructureAssessment {
  objective: RealityObjective;
  at: string;
  target_assessment: ObjectiveTargetAssessment;
  applicable_dependencies: ObjectiveDependency[];
  requirement_assessments: RequirementAssessment[];
  dependency_assessments: DependencyAssessment[];
  has_unsatisfied_requirement: boolean;
  has_indeterminate_requirement: boolean;
}

export type { ObjectiveDependency, ObjectiveRequirement, RealityObjective };
