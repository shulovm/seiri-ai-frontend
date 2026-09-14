import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Objective Core assessment (GROUND-013).
 *
 * Structure only: Objective / Requirement / Dependency assessments.
 * MUST NOT classify NEED / BLOCKER / RISK / OPPORTUNITY.
 * Must not import state-engine / file-store.
 */

import { NotFoundError } from "../errors.js";
import {
  assessCurrentStateAt,
  compareCurrentToReference,
  detectReferenceConflicts,
  isReferenceConditionActiveAt,
} from "./reference-state.js";
import type {
  DependencyAssessment,
  DependencyAssessmentStatus,
  ObjectiveStructureAssessment,
  ObjectiveTargetAssessment,
  ObjectiveTargetAssessmentStatus,
  RequirementAssessment,
  RequirementAssessmentStatus,
} from "./objective-types.js";
import type {
  ObjectiveDependency,
  ObjectiveRequirement,
  ProjectState,
  RealityObjective,
  ReferenceCondition,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isIntervalActiveAt(
  validFrom: string,
  validUntil: string | null,
  at: string
): boolean {
  if (compareTemporalInstants(validFrom, at) > 0) {
    return false;
  }
  if (validUntil === null) {
    return true;
  }
  return compareTemporalInstants(at, validUntil) < 0;
}

export function getApplicableObjectivesAt(
  projectState: ProjectState,
  at: string
): RealityObjective[] {
  return projectState.reality_objectives
    .filter(
      (objective) =>
        objective.project_id === projectState.project.id &&
        isIntervalActiveAt(objective.valid_from, objective.valid_until, at)
    )
    .slice()
    .sort((a, b) => compareIds(a.id, b.id));
}

export function getApplicableRequirementsAt(
  projectState: ProjectState,
  at: string
): ObjectiveRequirement[] {
  return projectState.objective_requirements
    .filter(
      (requirement) =>
        requirement.project_id === projectState.project.id &&
        isIntervalActiveAt(requirement.valid_from, requirement.valid_until, at)
    )
    .slice()
    .sort((a, b) => compareIds(a.id, b.id));
}

export function getObjectiveDependenciesAt(
  projectState: ProjectState,
  objectiveId: string,
  at: string
): ObjectiveDependency[] {
  return projectState.objective_dependencies
    .filter(
      (dependency) =>
        dependency.project_id === projectState.project.id &&
        dependency.objective_id === objectiveId &&
        isIntervalActiveAt(dependency.valid_from, dependency.valid_until, at)
    )
    .slice()
    .sort((a, b) => compareIds(a.id, b.id));
}

function findReferenceOrThrow(
  projectState: ProjectState,
  referenceId: string
): ReferenceCondition {
  const ref = projectState.reference_conditions.find(
    (entry) =>
      entry.id === referenceId && entry.project_id === projectState.project.id
  );
  if (!ref) {
    throw new NotFoundError(`ReferenceCondition not found: ${referenceId}`);
  }
  return ref;
}

function isReferenceContestedAt(
  projectState: ProjectState,
  reference: ReferenceCondition,
  at: string
): boolean {
  if (!isReferenceConditionActiveAt(reference, at)) {
    return false;
  }
  const sameScope = projectState.reference_conditions.filter(
    (entry) =>
      entry.project_id === projectState.project.id &&
      entry.subject_id === reference.subject_id &&
      entry.state_kind === reference.state_kind &&
      entry.reference_kind === reference.reference_kind &&
      isReferenceConditionActiveAt(entry, at)
  );
  const conflicts = detectReferenceConflicts(sameScope, at);
  return conflicts.some(
    (conflict) =>
      conflict.conflict_kind === "CRITERION_INCOMPATIBLE" &&
      conflict.reference_condition_ids.includes(reference.id)
  );
}

function mapComparisonToRequirementStatus(
  result: string
): RequirementAssessmentStatus {
  if (result === "MATCH") {
    return "SATISFIED";
  }
  if (result === "DEVIATES") {
    return "UNSATISFIED";
  }
  return "INDETERMINATE";
}

export function assessRequirementAt(
  projectState: ProjectState,
  requirementId: string,
  at: string
): RequirementAssessment {
  const requirement = projectState.objective_requirements.find(
    (entry) =>
      entry.id === requirementId && entry.project_id === projectState.project.id
  );
  if (!requirement) {
    throw new NotFoundError(`ObjectiveRequirement not found: ${requirementId}`);
  }

  if (!isIntervalActiveAt(requirement.valid_from, requirement.valid_until, at)) {
    return {
      requirement_id: requirement.id,
      reference_condition_id: requirement.reference_condition_id,
      at,
      reference_comparison: null,
      status: "INDETERMINATE",
      reference_basis_contested: false,
      note: "Requirement is outside its applicability interval at query time.",
    };
  }

  const reference = findReferenceOrThrow(
    projectState,
    requirement.reference_condition_id
  );

  if (!isReferenceConditionActiveAt(reference, at)) {
    return {
      requirement_id: requirement.id,
      reference_condition_id: requirement.reference_condition_id,
      at,
      reference_comparison: null,
      status: "INDETERMINATE",
      reference_basis_contested: false,
      note: "Referenced ReferenceCondition is outside its applicability interval at query time.",
    };
  }

  const current = assessCurrentStateAt(
    projectState,
    reference.subject_id,
    reference.state_kind,
    at
  );
  const comparison = compareCurrentToReference(current, reference);
  const contested = isReferenceContestedAt(projectState, reference, at);

  return {
    requirement_id: requirement.id,
    reference_condition_id: requirement.reference_condition_id,
    at,
    reference_comparison: comparison,
    status: mapComparisonToRequirementStatus(comparison.result),
    reference_basis_contested: contested,
  };
}

function mapTargetStatus(
  comparisons: Array<{ result: string }>
): ObjectiveTargetAssessmentStatus {
  const hasIndeterminate = comparisons.some(
    (comparison) =>
      comparison.result === "NO_CURRENT_STATE" ||
      comparison.result === "CURRENT_CONFLICTED" ||
      comparison.result === "UNSUPPORTED_COMPARISON"
  );
  if (hasIndeterminate) {
    return "TARGETS_INDETERMINATE";
  }
  const hasDeviation = comparisons.some(
    (comparison) => comparison.result === "DEVIATES"
  );
  if (hasDeviation) {
    return "TARGETS_UNSATISFIED";
  }
  return "TARGETS_SATISFIED";
}

export function assessObjectiveTargetsAt(
  projectState: ProjectState,
  objectiveId: string,
  at: string
): ObjectiveTargetAssessment {
  const objective = projectState.reality_objectives.find(
    (entry) =>
      entry.id === objectiveId && entry.project_id === projectState.project.id
  );
  if (!objective) {
    throw new NotFoundError(`RealityObjective not found: ${objectiveId}`);
  }

  const targetIds = objective.target_reference_condition_ids
    .slice()
    .sort(compareIds);
  const target_comparisons = [];

  for (const targetId of targetIds) {
    const reference = findReferenceOrThrow(projectState, targetId);
    if (!isReferenceConditionActiveAt(reference, at)) {
      target_comparisons.push({
        reference_condition_id: reference.id,
        reference_kind: reference.reference_kind,
        current_status: "NO_CURRENT_STATE" as const,
        current_value: null,
        criterion: reference.criterion,
        result: "NO_CURRENT_STATE" as const,
      });
      continue;
    }
    const current = assessCurrentStateAt(
      projectState,
      reference.subject_id,
      reference.state_kind,
      at
    );
    target_comparisons.push(compareCurrentToReference(current, reference));
  }

  return {
    objective_id: objective.id,
    at,
    target_comparisons,
    status: mapTargetStatus(target_comparisons),
  };
}

function mapDependencyStatus(
  requirementStatus: RequirementAssessmentStatus
): DependencyAssessmentStatus {
  if (requirementStatus === "SATISFIED") {
    return "PREREQUISITE_SATISFIED";
  }
  if (requirementStatus === "UNSATISFIED") {
    return "PREREQUISITE_UNSATISFIED";
  }
  return "PREREQUISITE_INDETERMINATE";
}

export function assessDependencyAt(
  projectState: ProjectState,
  dependencyId: string,
  at: string
): DependencyAssessment {
  const dependency = projectState.objective_dependencies.find(
    (entry) =>
      entry.id === dependencyId && entry.project_id === projectState.project.id
  );
  if (!dependency) {
    throw new NotFoundError(`ObjectiveDependency not found: ${dependencyId}`);
  }

  if (!isIntervalActiveAt(dependency.valid_from, dependency.valid_until, at)) {
    return {
      dependency_id: dependency.id,
      objective_id: dependency.objective_id,
      requirement_id: dependency.requirement_id,
      at,
      requirement_assessment: null,
      status: "PREREQUISITE_INDETERMINATE",
      note: "Dependency is outside its applicability interval at query time.",
    };
  }

  const requirement = projectState.objective_requirements.find(
    (entry) =>
      entry.id === dependency.requirement_id &&
      entry.project_id === projectState.project.id
  );
  if (!requirement) {
    throw new NotFoundError(
      `ObjectiveRequirement not found: ${dependency.requirement_id}`
    );
  }

  if (!isIntervalActiveAt(requirement.valid_from, requirement.valid_until, at)) {
    return {
      dependency_id: dependency.id,
      objective_id: dependency.objective_id,
      requirement_id: dependency.requirement_id,
      at,
      requirement_assessment: null,
      status: "PREREQUISITE_INDETERMINATE",
      note: "Linked Requirement is outside its applicability interval at query time.",
    };
  }

  const requirement_assessment = assessRequirementAt(
    projectState,
    dependency.requirement_id,
    at
  );

  return {
    dependency_id: dependency.id,
    objective_id: dependency.objective_id,
    requirement_id: dependency.requirement_id,
    at,
    requirement_assessment,
    status: mapDependencyStatus(requirement_assessment.status),
  };
}

export function assessObjectiveStructureAt(
  projectState: ProjectState,
  objectiveId: string,
  at: string
): ObjectiveStructureAssessment {
  const objective = projectState.reality_objectives.find(
    (entry) =>
      entry.id === objectiveId && entry.project_id === projectState.project.id
  );
  if (!objective) {
    throw new NotFoundError(`RealityObjective not found: ${objectiveId}`);
  }

  const target_assessment = assessObjectiveTargetsAt(
    projectState,
    objectiveId,
    at
  );
  const applicable_dependencies = getObjectiveDependenciesAt(
    projectState,
    objectiveId,
    at
  );
  const dependency_assessments = applicable_dependencies.map((dependency) =>
    assessDependencyAt(projectState, dependency.id, at)
  );
  const requirement_assessments = dependency_assessments
    .map((assessment) => assessment.requirement_assessment)
    .filter((assessment): assessment is RequirementAssessment =>
      Boolean(assessment)
    )
    .sort((a, b) => compareIds(a.requirement_id, b.requirement_id));

  // Deduplicate by requirement_id while preserving order.
  const seen = new Set<string>();
  const uniqueRequirements: RequirementAssessment[] = [];
  for (const assessment of requirement_assessments) {
    if (seen.has(assessment.requirement_id)) {
      continue;
    }
    seen.add(assessment.requirement_id);
    uniqueRequirements.push(assessment);
  }

  return {
    objective,
    at,
    target_assessment,
    applicable_dependencies,
    requirement_assessments: uniqueRequirements,
    dependency_assessments,
    has_unsatisfied_requirement: uniqueRequirements.some(
      (assessment) => assessment.status === "UNSATISFIED"
    ),
    has_indeterminate_requirement: uniqueRequirements.some(
      (assessment) => assessment.status === "INDETERMINATE"
    ),
  };
}
