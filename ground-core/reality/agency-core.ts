/**
 * Reality Core v0.7 — Agency Composition I assessment (GROUND-026).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Actor Candidate ≠ selected actor / feasible / executor.
 * Requirement match ≠ satisfaction / sufficiency / can_execute.
 */

import {
  assessCapability,
  capabilityScopeKey,
  findDeclaredCapabilities,
} from "./capability-core.js";
import {
  assessDecisionSpace,
  isDecisionOptionDeclarationActiveAt,
  isDecisionSpaceActiveAt,
} from "./decision-core.js";
import {
  assessInterventionSpecification,
  groupInterventionCapabilityRequirements,
  groupInterventionResourceRequirements,
  isInterventionDeclarationActiveAt,
} from "./intervention-core.js";
import {
  assessDeclaredInterventionPermission,
  assessInterventionPermissionGovernance,
} from "./permission-core.js";
import {
  assessResource,
  isResourceDeclarationActiveAt,
  resourceScopeKey,
  resourceScopesEqual,
} from "./resource-core.js";
import type {
  CapabilityRequirementMatchAssessment,
  DecisionOptionActorCandidatePosition,
  DecisionOptionActorCompositionAssessment,
  DecisionSpaceActorCompositionAssessment,
  ResourceRequirementMatchAssessment,
} from "./agency-types.js";
import type {
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  ProjectState,
  ReferenceDeclarer,
  ResourceDeclaration,
} from "../types.js";

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function declarerKey(declarer: ReferenceDeclarer): string {
  return [
    declarer.kind,
    declarer.entity_id ?? "",
    declarer.external_id ?? "",
    declarer.label ?? "",
  ].join("|");
}

function sortDeclarers(declarers: ReferenceDeclarer[]): ReferenceDeclarer[] {
  return [...declarers].sort((a, b) =>
    declarerKey(a).localeCompare(declarerKey(b))
  );
}

export function decisionOptionActorCandidateSemanticKey(input: {
  decision_space_id: string;
  intervention_id: string;
  actor_entity_id: string;
}): string {
  return [
    "actor-candidate",
    input.decision_space_id,
    input.intervention_id,
    input.actor_entity_id,
  ].join("|");
}

export function isDecisionOptionActorCandidateActiveAt(
  declaration: DecisionOptionActorCandidateDeclaration,
  at: string
): boolean {
  if (declaration.valid_from > at) {
    return false;
  }
  if (declaration.valid_until === null) {
    return true;
  }
  return at < declaration.valid_until;
}

function resolveCandidateSemanticTarget(
  projectState: ProjectState,
  declaration: DecisionOptionActorCandidateDeclaration
): {
  decision_space_id: string;
  intervention_id: string;
  option: DecisionOptionDeclaration;
} | null {
  const option = projectState.decision_option_declarations.find(
    (entry) => entry.id === declaration.decision_option_declaration_id
  );
  if (!option || option.option.kind !== "INTERVENTION") {
    return null;
  }
  return {
    decision_space_id: option.decision_space_id,
    intervention_id: option.option.intervention_id,
    option,
  };
}

function compareCandidateDeclarations(
  a: DecisionOptionActorCandidateDeclaration,
  b: DecisionOptionActorCandidateDeclaration
): number {
  if (a.valid_from !== b.valid_from) {
    return a.valid_from < b.valid_from ? -1 : 1;
  }
  return compareIds(a.id, b.id);
}

function compareCandidatePositions(
  a: DecisionOptionActorCandidatePosition,
  b: DecisionOptionActorCandidatePosition
): number {
  if (a.decision_space_id !== b.decision_space_id) {
    return compareIds(a.decision_space_id, b.decision_space_id);
  }
  if (a.intervention_id !== b.intervention_id) {
    return compareIds(a.intervention_id, b.intervention_id);
  }
  return compareIds(a.actor_entity_id, b.actor_entity_id);
}

export function getApplicableDecisionOptionActorCandidateDeclarations(
  projectState: ProjectState,
  decisionSpaceId: string,
  at: string
): DecisionOptionActorCandidateDeclaration[] {
  return projectState.decision_option_actor_candidate_declarations
    .filter((entry) => {
      if (!isDecisionOptionActorCandidateActiveAt(entry, at)) {
        return false;
      }
      const target = resolveCandidateSemanticTarget(projectState, entry);
      return target?.decision_space_id === decisionSpaceId;
    })
    .sort((a, b) => {
      const aTarget = resolveCandidateSemanticTarget(projectState, a);
      const bTarget = resolveCandidateSemanticTarget(projectState, b);
      const aKey = aTarget
        ? decisionOptionActorCandidateSemanticKey({
            decision_space_id: aTarget.decision_space_id,
            intervention_id: aTarget.intervention_id,
            actor_entity_id: a.actor_entity_id,
          })
        : a.id;
      const bKey = bTarget
        ? decisionOptionActorCandidateSemanticKey({
            decision_space_id: bTarget.decision_space_id,
            intervention_id: bTarget.intervention_id,
            actor_entity_id: b.actor_entity_id,
          })
        : b.id;
      const keyCmp = aKey.localeCompare(bKey);
      if (keyCmp !== 0) {
        return keyCmp;
      }
      return compareCandidateDeclarations(a, b);
    });
}

export function groupDecisionOptionActorCandidatePositions(
  projectState: ProjectState,
  decisionSpaceId: string,
  at: string
): DecisionOptionActorCandidatePosition[] {
  const applicable = getApplicableDecisionOptionActorCandidateDeclarations(
    projectState,
    decisionSpaceId,
    at
  );
  const groups = new Map<string, DecisionOptionActorCandidatePosition>();

  for (const entry of applicable) {
    const target = resolveCandidateSemanticTarget(projectState, entry);
    if (!target) {
      continue;
    }
    const key = decisionOptionActorCandidateSemanticKey({
      decision_space_id: target.decision_space_id,
      intervention_id: target.intervention_id,
      actor_entity_id: entry.actor_entity_id,
    });
    const existing = groups.get(key);
    if (existing) {
      existing.candidate_declaration_ids.push(entry.id);
      existing.supporting_option_declaration_ids.push(
        entry.decision_option_declaration_id
      );
      existing.declarers.push(entry.declared_by);
      existing.has_multiple_declarations = true;
    } else {
      groups.set(key, {
        key,
        decision_space_id: target.decision_space_id,
        intervention_id: target.intervention_id,
        actor_entity_id: entry.actor_entity_id,
        candidate_declaration_ids: [entry.id],
        supporting_option_declaration_ids: [
          entry.decision_option_declaration_id,
        ],
        declarers: [entry.declared_by],
        has_multiple_declarations: false,
      });
    }
  }

  return [...groups.values()]
    .map((position) => ({
      ...position,
      candidate_declaration_ids: [...position.candidate_declaration_ids].sort(
        compareIds
      ),
      supporting_option_declaration_ids: [
        ...new Set(position.supporting_option_declaration_ids),
      ].sort(compareIds),
      declarers: sortDeclarers(position.declarers),
    }))
    .sort(compareCandidatePositions);
}

export function assessCapabilityRequirementMatchesForActor(
  projectState: ProjectState,
  interventionId: string,
  actorEntityId: string,
  at: string
): CapabilityRequirementMatchAssessment[] {
  const groups = groupInterventionCapabilityRequirements(
    projectState,
    interventionId,
    at
  );

  return groups.map((group) => {
    const matching = findDeclaredCapabilities(projectState, {
      holderEntityId: actorEntityId,
      capabilityKey: group.capability_key,
      scope: group.capability_scope,
      at,
    });
    const matching_capability_assessments = matching.map((entry) =>
      assessCapability(projectState, entry.id, at)
    );

    return {
      capability_key: group.capability_key,
      capability_scope: group.capability_scope,
      requirement_declaration_ids: [...group.requirement_declaration_ids].sort(
        compareIds
      ),
      actor_entity_id: actorEntityId,
      matching_capability_declaration_ids: matching.map((entry) => entry.id),
      matching_capability_assessments,
      has_matching_capability_declaration: matching.length > 0,
      has_matching_active_verification: matching_capability_assessments.some(
        (entry) => entry.has_active_verification
      ),
      has_matching_available_declaration: matching_capability_assessments.some(
        (entry) => entry.has_available_declaration
      ),
      has_matching_unavailable_declaration: matching_capability_assessments.some(
        (entry) => entry.has_unavailable_declaration
      ),
      has_matching_contested_availability: matching_capability_assessments.some(
        (entry) => entry.has_contested_availability
      ),
    };
  }).sort((a, b) => {
    if (a.capability_key !== b.capability_key) {
      return a.capability_key < b.capability_key ? -1 : 1;
    }
    return capabilityScopeKey(a.capability_scope).localeCompare(
      capabilityScopeKey(b.capability_scope)
    );
  });
}

function findExactMatchingResources(
  projectState: ProjectState,
  resourceKey: string,
  unit: string,
  resourceScope: ResourceDeclaration["scope"],
  at: string
): ResourceDeclaration[] {
  return projectState.resource_declarations
    .filter(
      (entry) =>
        entry.resource_key === resourceKey &&
        entry.unit === unit &&
        resourceScopesEqual(entry.scope, resourceScope) &&
        isResourceDeclarationActiveAt(entry, at)
    )
    .sort((a, b) => {
      if (a.holder_entity_id !== b.holder_entity_id) {
        return compareIds(a.holder_entity_id, b.holder_entity_id);
      }
      if (a.resource_key !== b.resource_key) {
        return a.resource_key < b.resource_key ? -1 : 1;
      }
      if (a.unit !== b.unit) {
        return a.unit < b.unit ? -1 : 1;
      }
      const scopeCmp = resourceScopeKey(a.scope).localeCompare(
        resourceScopeKey(b.scope)
      );
      if (scopeCmp !== 0) {
        return scopeCmp;
      }
      if (a.valid_from !== b.valid_from) {
        return a.valid_from < b.valid_from ? -1 : 1;
      }
      return compareIds(a.id, b.id);
    });
}

export function assessResourceRequirementMatches(
  projectState: ProjectState,
  interventionId: string,
  at: string
): ResourceRequirementMatchAssessment[] {
  const groups = groupInterventionResourceRequirements(
    projectState,
    interventionId,
    at
  );

  return groups.map((group) => {
    const matching = findExactMatchingResources(
      projectState,
      group.resource_key,
      group.unit,
      group.resource_scope,
      at
    );
    const matching_resource_assessments = matching.map((entry) =>
      assessResource(projectState, entry.id, at)
    );
    const matching_resource_holder_ids = [
      ...new Set(matching.map((entry) => entry.holder_entity_id)),
    ].sort(compareIds);

    return {
      resource_key: group.resource_key,
      unit: group.unit,
      resource_scope: group.resource_scope,
      requirement_declaration_ids: [...group.requirement_declaration_ids].sort(
        compareIds
      ),
      required_amounts: [...group.required_amounts],
      has_requirement_divergence: group.has_requirement_divergence,
      matching_resource_declaration_ids: matching.map((entry) => entry.id),
      matching_resource_assessments,
      matching_resource_holder_ids,
      has_matching_resource_declaration: matching.length > 0,
      has_matching_capacity_declaration: matching_resource_assessments.some(
        (entry) => entry.has_capacity_declaration
      ),
      has_matching_capacity_divergence: matching_resource_assessments.some(
        (entry) => entry.has_capacity_divergence
      ),
      has_matching_available_declaration: matching_resource_assessments.some(
        (entry) => entry.has_available_declaration
      ),
      has_matching_unavailable_declaration: matching_resource_assessments.some(
        (entry) => entry.has_unavailable_declaration
      ),
      has_matching_contested_availability: matching_resource_assessments.some(
        (entry) => entry.has_contested_availability
      ),
    };
  }).sort((a, b) => {
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

export function assessDecisionOptionActorComposition(
  projectState: ProjectState,
  candidatePosition: DecisionOptionActorCandidatePosition,
  at: string
): DecisionOptionActorCompositionAssessment {
  const decision_space = projectState.decision_space_declarations.find(
    (entry) => entry.id === candidatePosition.decision_space_id
  );
  const intervention = projectState.intervention_declarations.find(
    (entry) => entry.id === candidatePosition.intervention_id
  );

  const intervention_specification = assessInterventionSpecification(
    projectState,
    candidatePosition.intervention_id,
    at
  );
  const permission = assessDeclaredInterventionPermission(
    projectState,
    candidatePosition.actor_entity_id,
    candidatePosition.intervention_id,
    at
  );
  const permission_governance = assessInterventionPermissionGovernance(
    projectState,
    candidatePosition.actor_entity_id,
    candidatePosition.intervention_id,
    at
  );

  const capability_requirement_matches =
    assessCapabilityRequirementMatchesForActor(
      projectState,
      candidatePosition.intervention_id,
      candidatePosition.actor_entity_id,
      at
    );
  const resource_requirement_matches = assessResourceRequirementMatches(
    projectState,
    candidatePosition.intervention_id,
    at
  );

  const has_capability_requirements =
    capability_requirement_matches.length > 0;
  const has_resource_requirements = resource_requirement_matches.length > 0;

  const has_decision_space_temporal_mismatch = decision_space
    ? !isDecisionSpaceActiveAt(decision_space, at)
    : true;

  const has_option_temporal_mismatch =
    candidatePosition.supporting_option_declaration_ids.some((optionId) => {
      const option = projectState.decision_option_declarations.find(
        (entry) => entry.id === optionId
      );
      return !option || !isDecisionOptionDeclarationActiveAt(option, at);
    });

  const has_intervention_temporal_mismatch = intervention
    ? !isInterventionDeclarationActiveAt(intervention, at)
    : true;

  return {
    candidate_position: candidatePosition,
    at,
    decision_space_id: candidatePosition.decision_space_id,
    intervention_id: candidatePosition.intervention_id,
    actor_entity_id: candidatePosition.actor_entity_id,
    intervention_specification,
    permission,
    permission_governance,
    capability_requirement_matches,
    resource_requirement_matches,
    has_capability_requirements,
    has_resource_requirements,
    has_capability_requirement_without_match:
      capability_requirement_matches.some(
        (entry) => !entry.has_matching_capability_declaration
      ),
    has_resource_requirement_without_match: resource_requirement_matches.some(
      (entry) => !entry.has_matching_resource_declaration
    ),
    has_matching_verified_capability: capability_requirement_matches.some(
      (entry) => entry.has_matching_active_verification
    ),
    has_matching_available_capability: capability_requirement_matches.some(
      (entry) => entry.has_matching_available_declaration
    ),
    has_matching_available_resource: resource_requirement_matches.some(
      (entry) => entry.has_matching_available_declaration
    ),
    has_permission_declarations:
      permission.status !== "NO_PERMISSION_DECLARATIONS",
    has_permission_conflict: permission.has_permission_conflict,
    has_decision_space_temporal_mismatch,
    has_option_temporal_mismatch,
    has_intervention_temporal_mismatch,
    has_temporal_basis_mismatch:
      has_decision_space_temporal_mismatch ||
      has_option_temporal_mismatch ||
      has_intervention_temporal_mismatch,
  };
}

export function assessDecisionSpaceActorComposition(
  projectState: ProjectState,
  decisionSpaceId: string,
  at: string
): DecisionSpaceActorCompositionAssessment {
  const decision_space = assessDecisionSpace(projectState, decisionSpaceId, at);
  const actor_candidate_positions = groupDecisionOptionActorCandidatePositions(
    projectState,
    decisionSpaceId,
    at
  );
  const actor_compositions = actor_candidate_positions.map((position) =>
    assessDecisionOptionActorComposition(projectState, position, at)
  );

  const interventionsWithCandidates = new Set(
    actor_candidate_positions.map((entry) => entry.intervention_id)
  );

  const intervention_option_ids_without_actor_candidates =
    decision_space.applicable_option_declarations
      .filter(
        (entry) =>
          entry.option.kind === "INTERVENTION" &&
          !interventionsWithCandidates.has(entry.option.intervention_id)
      )
      .map((entry) => entry.id)
      .sort(compareIds);

  return {
    decision_space_id: decisionSpaceId,
    at,
    decision_space,
    actor_candidate_positions,
    actor_compositions,
    actor_candidate_count: actor_candidate_positions.length,
    intervention_option_ids_without_actor_candidates,
    has_actor_candidates: actor_candidate_positions.length > 0,
  };
}
