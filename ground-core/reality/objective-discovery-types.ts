/**
 * Reality Core v0.7 — Objective Discovery types (GROUND-014).
 *
 * Derived only. Not persisted.
 * NEED / BLOCKER are Objective-relative — not legacy Blocker entities.
 * NEED ≠ Requirement. BLOCKER ≠ Dependency.
 * No priority / severity / Action / RISK / OPPORTUNITY.
 */

import type { ReferenceDeclarer, ReferenceKind } from "../types.js";
import type { ReferenceComparisonResult } from "./reference-criterion.js";
import type {
  DependencyAssessmentStatus,
  ObjectiveStructureAssessment,
  ObjectiveTargetAssessmentStatus,
  RequirementAssessmentStatus,
} from "./objective-types.js";

export type ObjectiveDiscoveryFindingKind = "NEED" | "BLOCKER";

export interface ObjectiveDiscoveryProvenance {
  objective_declarer: ReferenceDeclarer;
  requirement_declarer: ReferenceDeclarer;
  dependency_declarer: ReferenceDeclarer;
  reference_declarer: ReferenceDeclarer;
}

export interface ObjectiveDiscoveryFindingDetails {
  note?: string;
}

/**
 * Objective-relative derived finding.
 * BLOCKER here is NOT legacy ProjectState.blockers[].
 */
export interface ObjectiveDiscoveryFinding {
  key: string;
  kind: ObjectiveDiscoveryFindingKind;
  at: string;
  objective_id: string;
  requirement_id: string;
  dependency_id: string | null;
  reference_condition_id: string;
  reference_kind: ReferenceKind;
  requirement_status: RequirementAssessmentStatus;
  dependency_status: DependencyAssessmentStatus | null;
  objective_target_status: ObjectiveTargetAssessmentStatus;
  /** From RequirementAssessment — contested ≠ unauthorized suppression. */
  reference_basis_contested: boolean;
  current_state_ids: string[];
  current_value_keys: string[];
  comparison_result: ReferenceComparisonResult | null;
  provenance: ObjectiveDiscoveryProvenance;
  details: ObjectiveDiscoveryFindingDetails;
}

export interface ObjectiveDiscoveryAssessment {
  objective_id: string;
  at: string;
  structure_assessment: ObjectiveStructureAssessment | null;
  findings: ObjectiveDiscoveryFinding[];
  need_findings: ObjectiveDiscoveryFinding[];
  blocker_findings: ObjectiveDiscoveryFinding[];
  indeterminate_requirement_ids: string[];
  indeterminate_dependency_ids: string[];
  has_need: boolean;
  has_blocker: boolean;
  /**
   * Uncontested = reference_basis_contested === false.
   * Does NOT mean authorized / binding / official / high priority.
   */
  has_uncontested_need: boolean;
  has_uncontested_blocker: boolean;
  has_contested_need: boolean;
  has_contested_blocker: boolean;
  has_indeterminate_prerequisite: boolean;
}
