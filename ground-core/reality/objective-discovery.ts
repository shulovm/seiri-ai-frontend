import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Objective Discovery (GROUND-014).
 *
 * Consumes GROUND-013 ObjectiveStructureAssessment only.
 * Must not re-evaluate Reference criteria.
 * Must not import state-engine / file-store.
 *
 * NEED  = active Objective + active REQUIRES + active Requirement UNSATISFIED
 * BLOCKER = DependencyAssessment PREREQUISITE_UNSATISFIED
 *
 * Requirement UNSATISFIED alone ≠ NEED.
 * BLOCKER ≠ legacy blockers[].
 */

import { NotFoundError } from "../errors.js";
import { assessCurrentStateAt } from "./reference-state.js";
import {
  assessObjectiveStructureAt,
  getApplicableObjectivesAt,
  isIntervalActiveAt,
} from "./objective-core.js";
import { canonicalValueKey } from "./semantic-equality.js";
import type {
  ObjectiveDiscoveryAssessment,
  ObjectiveDiscoveryFinding,
  ObjectiveDiscoveryFindingKind,
  ObjectiveDiscoveryProvenance,
} from "./objective-discovery-types.js";
import type {
  ObjectiveStructureAssessment,
  RequirementAssessment,
} from "./objective-types.js";
import type {
  ObjectiveDependency,
  ObjectiveRequirement,
  ProjectState,
  RealityObjective,
  ReferenceCondition,
} from "../types.js";

const FINDING_KIND_ORDER: Record<ObjectiveDiscoveryFindingKind, number> = {
  NEED: 0,
  BLOCKER: 1,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareFindings(
  a: ObjectiveDiscoveryFinding,
  b: ObjectiveDiscoveryFinding
): number {
  const kindDiff = FINDING_KIND_ORDER[a.kind] - FINDING_KIND_ORDER[b.kind];
  if (kindDiff !== 0) {
    return kindDiff;
  }
  if (a.objective_id !== b.objective_id) {
    return compareIds(a.objective_id, b.objective_id);
  }
  if (a.requirement_id !== b.requirement_id) {
    return compareIds(a.requirement_id, b.requirement_id);
  }
  const depA = a.dependency_id ?? "";
  const depB = b.dependency_id ?? "";
  if (depA !== depB) {
    return compareIds(depA, depB);
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function dedupeFindings(
  findings: ObjectiveDiscoveryFinding[]
): ObjectiveDiscoveryFinding[] {
  const byKey = new Map<string, ObjectiveDiscoveryFinding>();
  for (const finding of findings) {
    byKey.set(finding.key, finding);
  }
  return [...byKey.values()].sort(compareFindings);
}

function needKey(objectiveId: string, requirementId: string, at: string): string {
  return ["need", objectiveId, requirementId, temporalInstantKey(at)].join("|");
}

function blockerKey(dependencyId: string, at: string): string {
  return ["blocker", dependencyId, temporalInstantKey(at)].join("|");
}

function findObjective(
  projectState: ProjectState,
  objectiveId: string
): RealityObjective {
  const objective = projectState.reality_objectives.find(
    (entry) =>
      entry.id === objectiveId && entry.project_id === projectState.project.id
  );
  if (!objective) {
    throw new NotFoundError(`RealityObjective not found: ${objectiveId}`);
  }
  return objective;
}

function findRequirement(
  projectState: ProjectState,
  requirementId: string
): ObjectiveRequirement {
  const requirement = projectState.objective_requirements.find(
    (entry) =>
      entry.id === requirementId && entry.project_id === projectState.project.id
  );
  if (!requirement) {
    throw new NotFoundError(`ObjectiveRequirement not found: ${requirementId}`);
  }
  return requirement;
}

function findDependency(
  projectState: ProjectState,
  dependencyId: string
): ObjectiveDependency {
  const dependency = projectState.objective_dependencies.find(
    (entry) =>
      entry.id === dependencyId && entry.project_id === projectState.project.id
  );
  if (!dependency) {
    throw new NotFoundError(`ObjectiveDependency not found: ${dependencyId}`);
  }
  return dependency;
}

function findReference(
  projectState: ProjectState,
  referenceId: string
): ReferenceCondition {
  const reference = projectState.reference_conditions.find(
    (entry) =>
      entry.id === referenceId && entry.project_id === projectState.project.id
  );
  if (!reference) {
    throw new NotFoundError(`ReferenceCondition not found: ${referenceId}`);
  }
  return reference;
}

function buildProvenance(
  objective: RealityObjective,
  requirement: ObjectiveRequirement,
  dependency: ObjectiveDependency,
  reference: ReferenceCondition
): ObjectiveDiscoveryProvenance {
  return {
    objective_declarer: objective.declared_by,
    requirement_declarer: requirement.declared_by,
    dependency_declarer: dependency.declared_by,
    reference_declarer: reference.declared_by,
  };
}

function currentProvenance(
  projectState: ProjectState,
  reference: ReferenceCondition,
  at: string,
  requirementAssessment: RequirementAssessment
): { current_state_ids: string[]; current_value_keys: string[] } {
  const current = assessCurrentStateAt(
    projectState,
    reference.subject_id,
    reference.state_kind,
    at
  );
  const current_state_ids = current.active_states
    .map((state) => state.id)
    .slice()
    .sort(compareIds);
  const fromComparison = requirementAssessment.reference_comparison?.current_value;
  const current_value_keys =
    fromComparison !== undefined && fromComparison !== null
      ? [canonicalValueKey(fromComparison)]
      : current.semantic_values.map((value) => canonicalValueKey(value)).sort();
  return { current_state_ids, current_value_keys };
}

function emptyAssessment(
  objectiveId: string,
  at: string,
  structure: ObjectiveStructureAssessment | null
): ObjectiveDiscoveryAssessment {
  return {
    objective_id: objectiveId,
    at,
    structure_assessment: structure,
    findings: [],
    need_findings: [],
    blocker_findings: [],
    indeterminate_requirement_ids: [],
    indeterminate_dependency_ids: [],
    has_need: false,
    has_blocker: false,
    has_uncontested_need: false,
    has_uncontested_blocker: false,
    has_contested_need: false,
    has_contested_blocker: false,
    has_indeterminate_prerequisite: false,
  };
}

function classifyFromStructure(
  projectState: ProjectState,
  structure: ObjectiveStructureAssessment
): ObjectiveDiscoveryAssessment {
  const { objective, at } = structure;
  const findings: ObjectiveDiscoveryFinding[] = [];
  const indeterminate_requirement_ids: string[] = [];
  const indeterminate_dependency_ids: string[] = [];
  const needSeen = new Set<string>();

  for (const depAssessment of structure.dependency_assessments) {
    if (depAssessment.status === "PREREQUISITE_INDETERMINATE") {
      indeterminate_dependency_ids.push(depAssessment.dependency_id);
      if (depAssessment.requirement_assessment?.status === "INDETERMINATE") {
        indeterminate_requirement_ids.push(depAssessment.requirement_id);
      } else if (!depAssessment.requirement_assessment) {
        indeterminate_requirement_ids.push(depAssessment.requirement_id);
      }
      continue;
    }

    if (depAssessment.status !== "PREREQUISITE_UNSATISFIED") {
      continue;
    }

    const requirementAssessment = depAssessment.requirement_assessment;
    if (
      !requirementAssessment ||
      requirementAssessment.status !== "UNSATISFIED"
    ) {
      // Defensive: unsatisfied dependency without unsatisfied requirement is indeterminate.
      indeterminate_dependency_ids.push(depAssessment.dependency_id);
      continue;
    }

    const dependency = findDependency(projectState, depAssessment.dependency_id);
    const requirement = findRequirement(
      projectState,
      depAssessment.requirement_id
    );
    const reference = findReference(
      projectState,
      requirementAssessment.reference_condition_id
    );
    const provenance = buildProvenance(
      objective,
      requirement,
      dependency,
      reference
    );
    const { current_state_ids, current_value_keys } = currentProvenance(
      projectState,
      reference,
      at,
      requirementAssessment
    );

    const needKeyValue = needKey(objective.id, requirement.id, at);
    if (!needSeen.has(needKeyValue)) {
      needSeen.add(needKeyValue);
      findings.push({
        key: needKeyValue,
        kind: "NEED",
        at,
        objective_id: objective.id,
        requirement_id: requirement.id,
        dependency_id: dependency.id,
        reference_condition_id: reference.id,
        reference_kind: reference.reference_kind,
        requirement_status: requirementAssessment.status,
        dependency_status: depAssessment.status,
        objective_target_status: structure.target_assessment.status,
        reference_basis_contested:
          requirementAssessment.reference_basis_contested,
        current_state_ids,
        current_value_keys,
        comparison_result:
          requirementAssessment.reference_comparison?.result ?? null,
        provenance,
        details: {
          note: "Objective currently has an unmet explicitly declared required condition.",
        },
      });
    }

    findings.push({
      key: blockerKey(dependency.id, at),
      kind: "BLOCKER",
      at,
      objective_id: objective.id,
      requirement_id: requirement.id,
      dependency_id: dependency.id,
      reference_condition_id: reference.id,
      reference_kind: reference.reference_kind,
      requirement_status: requirementAssessment.status,
      dependency_status: depAssessment.status,
      objective_target_status: structure.target_assessment.status,
      reference_basis_contested:
        requirementAssessment.reference_basis_contested,
      current_state_ids,
      current_value_keys,
      comparison_result:
        requirementAssessment.reference_comparison?.result ?? null,
      provenance,
      details: {
        note: "Declared REQUIRES dependency currently has an unsatisfied prerequisite.",
      },
    });
  }

  // Also capture indeterminate requirements present in structure but not via deps.
  for (const reqAssessment of structure.requirement_assessments) {
    if (
      reqAssessment.status === "INDETERMINATE" &&
      !indeterminate_requirement_ids.includes(reqAssessment.requirement_id)
    ) {
      indeterminate_requirement_ids.push(reqAssessment.requirement_id);
    }
  }

  const sortedFindings = dedupeFindings(findings);
  const need_findings = sortedFindings.filter((f) => f.kind === "NEED");
  const blocker_findings = sortedFindings.filter((f) => f.kind === "BLOCKER");
  const indeterminateReqs = [...new Set(indeterminate_requirement_ids)].sort(
    compareIds
  );
  const indeterminateDeps = [...new Set(indeterminate_dependency_ids)].sort(
    compareIds
  );

  return {
    objective_id: objective.id,
    at,
    structure_assessment: structure,
    findings: sortedFindings,
    need_findings,
    blocker_findings,
    indeterminate_requirement_ids: indeterminateReqs,
    indeterminate_dependency_ids: indeterminateDeps,
    has_need: need_findings.length > 0,
    has_blocker: blocker_findings.length > 0,
    has_uncontested_need: need_findings.some((f) => !f.reference_basis_contested),
    has_uncontested_blocker: blocker_findings.some(
      (f) => !f.reference_basis_contested
    ),
    has_contested_need: need_findings.some((f) => f.reference_basis_contested),
    has_contested_blocker: blocker_findings.some(
      (f) => f.reference_basis_contested
    ),
    has_indeterminate_prerequisite:
      indeterminateReqs.length > 0 || indeterminateDeps.length > 0,
  };
}

/**
 * Discover NEED/BLOCKER findings for one Objective at `at`.
 * Inactive Objectives yield no findings.
 */
export function discoverObjectiveFindings(
  projectState: ProjectState,
  objectiveId: string,
  at: string
): ObjectiveDiscoveryFinding[] {
  return assessObjectiveDiscovery(projectState, objectiveId, at).findings;
}

/**
 * Full Objective Discovery assessment for one Objective.
 */
export function assessObjectiveDiscovery(
  projectState: ProjectState,
  objectiveId: string,
  at: string
): ObjectiveDiscoveryAssessment {
  const objective = findObjective(projectState, objectiveId);

  if (!isIntervalActiveAt(objective.valid_from, objective.valid_until, at)) {
    return emptyAssessment(objectiveId, at, null);
  }

  const structure = assessObjectiveStructureAt(
    projectState,
    objectiveId,
    at
  );
  return classifyFromStructure(projectState, structure);
}

/**
 * Discover findings for all applicable Objectives at `at`.
 * Deterministic by objective id.
 */
export function discoverObjectiveFindingsAt(
  projectState: ProjectState,
  at: string
): ObjectiveDiscoveryAssessment[] {
  return getApplicableObjectivesAt(projectState, at).map((objective) =>
    assessObjectiveDiscovery(projectState, objective.id, at)
  );
}
