import { compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Intervention Core I assessment (GROUND-023).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Intervention ≠ execution / feasibility / Permission / matching.
 */

import { capabilityScopeKey } from "./capability-core.js";
import { resourceScopeKey } from "./resource-core.js";
import type {
  FindDeclaredInterventionsQuery,
  InterventionCapabilityRequirementGroup,
  InterventionResourceRequirementGroup,
  InterventionSpecificationAssessment,
  InterventionDeclarationAssessmentStatus,
} from "./intervention-types.js";
import type {
  InterventionCapabilityRequirementDeclaration,
  InterventionDeclaration,
  InterventionResourceRequirementDeclaration,
  InterventionScope,
  ProjectState,
  ResourceRequirementAmount,
} from "../types.js";

export type { FindDeclaredInterventionsQuery };

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function interventionScopeKey(scope: InterventionScope): string {
  switch (scope.kind) {
    case "UNSCOPED":
      return "UNSCOPED";
    case "ENTITY":
      return `ENTITY|${scope.entity_id}`;
    case "SUBJECT_STATE":
      return `SUBJECT_STATE|${scope.subject_id}|${scope.state_kind}`;
  }
}

export function interventionScopesEqual(
  a: InterventionScope,
  b: InterventionScope
): boolean {
  return interventionScopeKey(a) === interventionScopeKey(b);
}

export function resourceRequirementAmountKey(
  amount: ResourceRequirementAmount
): string {
  if (amount.kind === "POINT") {
    return `POINT|${amount.value}`;
  }
  return `RANGE|${amount.min}|${amount.max}`;
}

export function resourceRequirementAmountsEqual(
  a: ResourceRequirementAmount,
  b: ResourceRequirementAmount
): boolean {
  return resourceRequirementAmountKey(a) === resourceRequirementAmountKey(b);
}

export function isInterventionDeclarationActiveAt(
  declaration: InterventionDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.valid_from, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

export function isInterventionCapabilityRequirementActiveAt(
  declaration: InterventionCapabilityRequirementDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.valid_from, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

export function isInterventionResourceRequirementActiveAt(
  declaration: InterventionResourceRequirementDeclaration,
  at: string
): boolean {
  if (compareTemporalInstants(declaration.valid_from, at) > 0) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, declaration.valid_until) < 0;
}

function compareInterventions(
  a: InterventionDeclaration,
  b: InterventionDeclaration
): number {
  if (a.intervention_key !== b.intervention_key) {
    return a.intervention_key < b.intervention_key ? -1 : 1;
  }
  const scopeCmp = interventionScopeKey(a.target_scope).localeCompare(
    interventionScopeKey(b.target_scope)
  );
  if (scopeCmp !== 0) {
    return scopeCmp;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareCapabilityRequirements(
  a: InterventionCapabilityRequirementDeclaration,
  b: InterventionCapabilityRequirementDeclaration
): number {
  if (a.capability_key !== b.capability_key) {
    return a.capability_key < b.capability_key ? -1 : 1;
  }
  const scopeCmp = capabilityScopeKey(a.capability_scope).localeCompare(
    capabilityScopeKey(b.capability_scope)
  );
  if (scopeCmp !== 0) {
    return scopeCmp;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareResourceRequirements(
  a: InterventionResourceRequirementDeclaration,
  b: InterventionResourceRequirementDeclaration
): number {
  if (a.resource_key !== b.resource_key) {
    return a.resource_key < b.resource_key ? -1 : 1;
  }
  if (a.unit !== b.unit) {
    return a.unit < b.unit ? -1 : 1;
  }
  const scopeCmp = resourceScopeKey(a.resource_scope).localeCompare(
    resourceScopeKey(b.resource_scope)
  );
  if (scopeCmp !== 0) {
    return scopeCmp;
  }
  const amountCmp = resourceRequirementAmountKey(a.required_amount).localeCompare(
    resourceRequirementAmountKey(b.required_amount)
  );
  if (amountCmp !== 0) {
    return amountCmp;
  }
  if (compareTemporalInstants(a.valid_from, b.valid_from) !== 0) {
    return compareTemporalInstants(a.valid_from, b.valid_from) < 0 ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

export function getApplicableInterventions(
  projectState: ProjectState,
  at: string
): InterventionDeclaration[] {
  return projectState.intervention_declarations
    .filter((entry) => isInterventionDeclarationActiveAt(entry, at))
    .sort(compareInterventions);
}

export function findDeclaredInterventions(
  projectState: ProjectState,
  query: FindDeclaredInterventionsQuery
): InterventionDeclaration[] {
  const scopeKey = interventionScopeKey(query.targetScope);
  return projectState.intervention_declarations
    .filter(
      (entry) =>
        entry.intervention_key === query.interventionKey &&
        interventionScopeKey(entry.target_scope) === scopeKey &&
        isInterventionDeclarationActiveAt(entry, query.at)
    )
    .sort(compareInterventions);
}

export function getApplicableInterventionCapabilityRequirements(
  projectState: ProjectState,
  interventionId: string,
  at: string
): InterventionCapabilityRequirementDeclaration[] {
  return projectState.intervention_capability_requirement_declarations
    .filter(
      (entry) =>
        entry.intervention_id === interventionId &&
        isInterventionCapabilityRequirementActiveAt(entry, at)
    )
    .sort(compareCapabilityRequirements);
}

export function getApplicableInterventionResourceRequirements(
  projectState: ProjectState,
  interventionId: string,
  at: string
): InterventionResourceRequirementDeclaration[] {
  return projectState.intervention_resource_requirement_declarations
    .filter(
      (entry) =>
        entry.intervention_id === interventionId &&
        isInterventionResourceRequirementActiveAt(entry, at)
    )
    .sort(compareResourceRequirements);
}

export function groupInterventionCapabilityRequirements(
  projectState: ProjectState,
  interventionId: string,
  at: string
): InterventionCapabilityRequirementGroup[] {
  const applicable = getApplicableInterventionCapabilityRequirements(
    projectState,
    interventionId,
    at
  );
  const groups = new Map<string, InterventionCapabilityRequirementGroup>();
  for (const entry of applicable) {
    const key = `${entry.capability_key}|${capabilityScopeKey(entry.capability_scope)}`;
    const existing = groups.get(key);
    if (existing) {
      existing.requirement_declaration_ids.push(entry.id);
    } else {
      groups.set(key, {
        intervention_id: interventionId,
        capability_key: entry.capability_key,
        capability_scope: entry.capability_scope,
        requirement_declaration_ids: [entry.id],
      });
    }
  }
  return [...groups.values()].sort((a, b) => {
    if (a.capability_key !== b.capability_key) {
      return a.capability_key < b.capability_key ? -1 : 1;
    }
    return capabilityScopeKey(a.capability_scope).localeCompare(
      capabilityScopeKey(b.capability_scope)
    );
  });
}

export function groupInterventionResourceRequirements(
  projectState: ProjectState,
  interventionId: string,
  at: string
): InterventionResourceRequirementGroup[] {
  const applicable = getApplicableInterventionResourceRequirements(
    projectState,
    interventionId,
    at
  );
  const groups = new Map<string, InterventionResourceRequirementGroup>();
  for (const entry of applicable) {
    const key = [
      entry.resource_key,
      entry.unit,
      resourceScopeKey(entry.resource_scope),
    ].join("|");
    const existing = groups.get(key);
    if (existing) {
      existing.requirement_declaration_ids.push(entry.id);
      existing.required_amounts.push(entry.required_amount);
      existing.has_requirement_divergence =
        new Set(
          existing.required_amounts.map(resourceRequirementAmountKey)
        ).size > 1;
    } else {
      groups.set(key, {
        intervention_id: interventionId,
        resource_key: entry.resource_key,
        unit: entry.unit,
        resource_scope: entry.resource_scope,
        requirement_declaration_ids: [entry.id],
        required_amounts: [entry.required_amount],
        has_requirement_divergence: false,
      });
    }
  }
  return [...groups.values()].sort((a, b) => {
    if (a.resource_key !== b.resource_key) {
      return a.resource_key < b.resource_key ? -1 : 1;
    }
    if (a.unit !== b.unit) {
      return a.unit < b.unit ? -1 : 1;
    }
    return resourceScopeKey(a.resource_scope).localeCompare(
      resourceScopeKey(b.resource_scope)
    );
  });
}

export function assessInterventionSpecification(
  projectState: ProjectState,
  interventionId: string,
  at: string
): InterventionSpecificationAssessment {
  const intervention = projectState.intervention_declarations.find(
    (entry) => entry.id === interventionId
  );
  if (!intervention) {
    throw new Error(
      `InterventionDeclaration ${interventionId} not found in project state`
    );
  }

  const declaration_active = isInterventionDeclarationActiveAt(
    intervention,
    at
  );
  const declaration_status: InterventionDeclarationAssessmentStatus =
    declaration_active
      ? "INTERVENTION_DECLARATION_ACTIVE"
      : "INTERVENTION_DECLARATION_NOT_ACTIVE";

  const applicable_capability_requirements =
    getApplicableInterventionCapabilityRequirements(
      projectState,
      interventionId,
      at
    );
  const applicable_resource_requirements =
    getApplicableInterventionResourceRequirements(
      projectState,
      interventionId,
      at
    );

  const has_capability_requirements =
    applicable_capability_requirements.length > 0;
  const has_resource_requirements = applicable_resource_requirements.length > 0;
  const has_temporal_basis_mismatch =
    !declaration_active &&
    (has_capability_requirements || has_resource_requirements);

  return {
    intervention,
    at,
    declaration_status,
    applicable_capability_requirements,
    applicable_resource_requirements,
    has_capability_requirements,
    has_resource_requirements,
    has_temporal_basis_mismatch,
  };
}
