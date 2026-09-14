import { canonicalValueKey } from "./semantic-equality.js";
/**
 * Reality Core v0.7 — Feasibility Basis I assessment (GROUND-027).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 * Consumes GROUND-026 composition. Does not reimplement matching.
 * FeasibilityBasis ≠ FeasibilityVerdict / satisfaction / can_execute.
 */

import {
  assessDecisionOptionActorComposition,
  assessDecisionSpaceActorComposition,
} from "./agency-core.js";
import { capabilityScopeKey } from "./capability-core.js";
import { resourceScopeKey } from "./resource-core.js";
import type {
  DecisionOptionActorCandidatePosition,
  DecisionOptionActorCompositionAssessment,
} from "./agency-types.js";
import type {
  CapabilityRequirementMatchAssessment,
  ResourceRequirementMatchAssessment,
} from "./feasibility-types.js";
import type {
  CapabilityFeasibilityBasis,
  DecisionOptionActorFeasibilityBasisAssessment,
  DecisionSpaceFeasibilityBasisAssessment,
  DeclaredExecutionConstraint,
  DeclaredExecutionConstraintKind,
  FeasibilityBasisContest,
  FeasibilityBasisContestKind,
  FeasibilityBasisGap,
  FeasibilityBasisGapKind,
  FeasibilityModelLimitation,
  PermissionFeasibilityBasis,
  ResourceFeasibilityBasis,
} from "./feasibility-types.js";
import type { ProjectState } from "../types.js";

const GAP_KIND_ORDER: FeasibilityBasisGapKind[] = [
  "CAPABILITY_EXACT_MATCH_ABSENT",
  "CAPABILITY_ACTIVE_VERIFICATION_ABSENT",
  "CAPABILITY_AVAILABILITY_UNDECLARED",
  "RESOURCE_EXACT_MATCH_ABSENT",
  "RESOURCE_CAPACITY_UNDECLARED",
  "RESOURCE_AVAILABILITY_UNDECLARED",
  "INTERVENTION_PERMISSION_UNDECLARED",
  "TEMPORAL_BASIS_MISMATCH",
];

const CONTEST_KIND_ORDER: FeasibilityBasisContestKind[] = [
  "CAPABILITY_AVAILABILITY_CONTEST_PRESENT",
  "RESOURCE_CAPACITY_DIVERGENCE_PRESENT",
  "RESOURCE_AVAILABILITY_CONTEST_PRESENT",
  "INTERVENTION_PERMISSION_CONTEST_PRESENT",
  "PERMISSION_ISSUER_AUTHORITY_CONTEST_PRESENT",
];

const CONSTRAINT_KIND_ORDER: DeclaredExecutionConstraintKind[] = [
  "CAPABILITY_UNAVAILABLE_DECLARATION_PRESENT",
  "RESOURCE_UNAVAILABLE_DECLARATION_PRESENT",
  "INTERVENTION_PROHIBIT_DECLARATION_PRESENT",
];

const MODEL_LIMITATION_ORDER: FeasibilityModelLimitation[] = [
  "EFFECTIVE_CAPABILITY_NOT_MODELED",
  "EFFECTIVE_PERMISSION_NOT_MODELED",
  "AUTHORITY_PRECEDENCE_NOT_MODELED",
  "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
  "RESOURCE_ACCESS_PERMISSION_NOT_MODELED",
  "RESOURCE_RESERVATION_NOT_MODELED",
  "COMMITMENT_NOT_MODELED",
  "EXECUTION_CONDITIONS_NOT_MODELED",
];

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortGaps(gaps: FeasibilityBasisGap[]): FeasibilityBasisGap[] {
  return [...gaps].sort((a, b) => {
    const kindCmp =
      GAP_KIND_ORDER.indexOf(a.kind) - GAP_KIND_ORDER.indexOf(b.kind);
    if (kindCmp !== 0) {
      return kindCmp;
    }
    if (a.related_key !== b.related_key) {
      return a.related_key < b.related_key ? -1 : 1;
    }
    return a.key.localeCompare(b.key);
  });
}

function sortContests(
  contests: FeasibilityBasisContest[]
): FeasibilityBasisContest[] {
  return [...contests].sort((a, b) => {
    const kindCmp =
      CONTEST_KIND_ORDER.indexOf(a.kind) - CONTEST_KIND_ORDER.indexOf(b.kind);
    if (kindCmp !== 0) {
      return kindCmp;
    }
    if (a.related_key !== b.related_key) {
      return a.related_key < b.related_key ? -1 : 1;
    }
    return a.key.localeCompare(b.key);
  });
}

function sortConstraints(
  constraints: DeclaredExecutionConstraint[]
): DeclaredExecutionConstraint[] {
  return [...constraints].sort((a, b) => {
    const kindCmp =
      CONSTRAINT_KIND_ORDER.indexOf(a.kind) -
      CONSTRAINT_KIND_ORDER.indexOf(b.kind);
    if (kindCmp !== 0) {
      return kindCmp;
    }
    const aSource = a.source_declaration_ids[0] ?? "";
    const bSource = b.source_declaration_ids[0] ?? "";
    if (aSource !== bSource) {
      return compareIds(aSource, bSource);
    }
    return a.key.localeCompare(b.key);
  });
}

export function buildCapabilityFeasibilityBasis(
  match: CapabilityRequirementMatchAssessment
): CapabilityFeasibilityBasis {
  const has_any_availability_declaration =
    match.matching_capability_assessments.some(
      (entry) =>
        entry.availability.status !== "NO_AVAILABILITY_DECLARATIONS"
    );

  return {
    actor_entity_id: match.actor_entity_id,
    capability_key: match.capability_key,
    capability_scope: match.capability_scope,
    requirement_declaration_ids: match.requirement_declaration_ids,
    matching_capability_declaration_ids: match.matching_capability_declaration_ids,
    matching_capability_assessments: match.matching_capability_assessments,
    has_exact_match: match.has_matching_capability_declaration,
    has_active_verification: match.has_matching_active_verification,
    has_any_availability_declaration,
    has_available_declaration: match.has_matching_available_declaration,
    has_unavailable_declaration: match.has_matching_unavailable_declaration,
    has_existing_contested_availability:
      match.has_matching_contested_availability,
  };
}

export function buildResourceFeasibilityBasis(
  match: ResourceRequirementMatchAssessment
): ResourceFeasibilityBasis {
  const has_any_availability_declaration =
    match.matching_resource_assessments.some(
      (entry) =>
        entry.availability.status !== "NO_AVAILABILITY_DECLARATIONS"
    );

  return {
    resource_key: match.resource_key,
    unit: match.unit,
    resource_scope: match.resource_scope,
    requirement_declaration_ids: match.requirement_declaration_ids,
    required_amounts: match.required_amounts,
    has_requirement_divergence: match.has_requirement_divergence,
    matching_resource_declaration_ids: match.matching_resource_declaration_ids,
    matching_resource_assessments: match.matching_resource_assessments,
    matching_resource_holder_ids: match.matching_resource_holder_ids,
    has_exact_match: match.has_matching_resource_declaration,
    has_any_capacity_declaration: match.has_matching_capacity_declaration,
    has_capacity_divergence: match.has_matching_capacity_divergence,
    has_any_availability_declaration,
    has_available_declaration: match.has_matching_available_declaration,
    has_unavailable_declaration: match.has_matching_unavailable_declaration,
    has_existing_contested_availability:
      match.has_matching_contested_availability,
  };
}

export function buildPermissionFeasibilityBasis(
  candidateComposition: DecisionOptionActorCompositionAssessment
): PermissionFeasibilityBasis {
  const permission = candidateComposition.permission;
  return {
    actor_entity_id: candidateComposition.actor_entity_id,
    intervention_id: candidateComposition.intervention_id,
    permission_status: permission.status,
    permission_declaration_ids: permission.permission_declaration_ids,
    permit_declaration_ids: permission.permit_declaration_ids,
    prohibit_declaration_ids: permission.prohibit_declaration_ids,
    has_permit_declaration: permission.has_permit_declaration,
    has_prohibit_declaration: permission.has_prohibit_declaration,
    has_permission_conflict: permission.has_permission_conflict,
    governance: candidateComposition.permission_governance,
  };
}

export function deriveFeasibilityBasisGaps(
  candidateComposition: DecisionOptionActorCompositionAssessment,
  capabilityBases: CapabilityFeasibilityBasis[],
  resourceBases: ResourceFeasibilityBasis[],
  permissionBasis: PermissionFeasibilityBasis
): FeasibilityBasisGap[] {
  const candidateKey = candidateComposition.candidate_position.key;
  const gaps: FeasibilityBasisGap[] = [];

  for (const basis of capabilityBases) {
    const related = canonicalValueKey([basis.capability_key, basis.capability_scope]);
    if (!basis.has_exact_match) {
      gaps.push({
        key: `feasibility-gap|${candidateKey}|capability|${related}|exact-match-absent`,
        kind: "CAPABILITY_EXACT_MATCH_ABSENT",
        related_key: related,
      });
      continue;
    }
    if (!basis.has_active_verification) {
      gaps.push({
        key: `feasibility-gap|${candidateKey}|capability|${related}|verification-absent`,
        kind: "CAPABILITY_ACTIVE_VERIFICATION_ABSENT",
        related_key: related,
      });
    }
    if (!basis.has_any_availability_declaration) {
      gaps.push({
        key: `feasibility-gap|${candidateKey}|capability|${related}|availability-undeclared`,
        kind: "CAPABILITY_AVAILABILITY_UNDECLARED",
        related_key: related,
      });
    }
  }

  for (const basis of resourceBases) {
    const related = canonicalValueKey([basis.resource_key, basis.unit, basis.resource_scope]);
    if (!basis.has_exact_match) {
      gaps.push({
        key: `feasibility-gap|${candidateKey}|resource|${related}|exact-match-absent`,
        kind: "RESOURCE_EXACT_MATCH_ABSENT",
        related_key: related,
      });
      continue;
    }
    if (!basis.has_any_capacity_declaration) {
      gaps.push({
        key: `feasibility-gap|${candidateKey}|resource|${related}|capacity-undeclared`,
        kind: "RESOURCE_CAPACITY_UNDECLARED",
        related_key: related,
      });
    }
    if (!basis.has_any_availability_declaration) {
      gaps.push({
        key: `feasibility-gap|${candidateKey}|resource|${related}|availability-undeclared`,
        kind: "RESOURCE_AVAILABILITY_UNDECLARED",
        related_key: related,
      });
    }
  }

  if (permissionBasis.permission_status === "NO_PERMISSION_DECLARATIONS") {
    gaps.push({
      key: `feasibility-gap|${candidateKey}|permission|undeclared`,
      kind: "INTERVENTION_PERMISSION_UNDECLARED",
      related_key: "permission",
    });
  }

  if (candidateComposition.has_decision_space_temporal_mismatch) {
    gaps.push({
      key: `feasibility-gap|${candidateKey}|temporal|decision-space`,
      kind: "TEMPORAL_BASIS_MISMATCH",
      related_key: "decision-space",
    });
  }
  if (candidateComposition.has_option_temporal_mismatch) {
    gaps.push({
      key: `feasibility-gap|${candidateKey}|temporal|option`,
      kind: "TEMPORAL_BASIS_MISMATCH",
      related_key: "option",
    });
  }
  if (candidateComposition.has_intervention_temporal_mismatch) {
    gaps.push({
      key: `feasibility-gap|${candidateKey}|temporal|intervention`,
      kind: "TEMPORAL_BASIS_MISMATCH",
      related_key: "intervention",
    });
  }

  return sortGaps(gaps);
}

export function deriveFeasibilityBasisContests(
  candidateComposition: DecisionOptionActorCompositionAssessment,
  capabilityBases: CapabilityFeasibilityBasis[],
  resourceBases: ResourceFeasibilityBasis[]
): FeasibilityBasisContest[] {
  const candidateKey = candidateComposition.candidate_position.key;
  const contests: FeasibilityBasisContest[] = [];

  for (const basis of capabilityBases) {
    const contested = basis.matching_capability_assessments.filter(
      (entry) => entry.availability.status === "CONTESTED_AVAILABILITY"
    );
    if (contested.length === 0) {
      continue;
    }
    const related = canonicalValueKey([basis.capability_key, basis.capability_scope]);
    contests.push({
      key: `feasibility-contest|${candidateKey}|capability|${related}|availability`,
      kind: "CAPABILITY_AVAILABILITY_CONTEST_PRESENT",
      related_key: related,
      source_ids: contested.map((entry) => entry.capability.id).sort(compareIds),
    });
  }

  for (const basis of resourceBases) {
    const related = canonicalValueKey([basis.resource_key, basis.unit, basis.resource_scope]);
    const divergent = basis.matching_resource_assessments.filter(
      (entry) => entry.has_capacity_divergence
    );
    if (divergent.length > 0) {
      contests.push({
        key: `feasibility-contest|${candidateKey}|resource|${related}|capacity-divergence`,
        kind: "RESOURCE_CAPACITY_DIVERGENCE_PRESENT",
        related_key: related,
        source_ids: divergent.map((entry) => entry.resource.id).sort(compareIds),
      });
    }
    const contested = basis.matching_resource_assessments.filter(
      (entry) => entry.availability.status === "CONTESTED_AVAILABILITY"
    );
    if (contested.length > 0) {
      contests.push({
        key: `feasibility-contest|${candidateKey}|resource|${related}|availability`,
        kind: "RESOURCE_AVAILABILITY_CONTEST_PRESENT",
        related_key: related,
        source_ids: contested.map((entry) => entry.resource.id).sort(compareIds),
      });
    }
  }

  if (candidateComposition.permission.has_permission_conflict) {
    contests.push({
      key: `feasibility-contest|${candidateKey}|permission`,
      kind: "INTERVENTION_PERMISSION_CONTEST_PRESENT",
      related_key: "permission",
      source_ids: [
        ...candidateComposition.permission.permission_declaration_ids,
      ].sort(compareIds),
    });
  }

  const governance = candidateComposition.permission_governance;
  if (governance?.has_permission_from_contested_authority_path) {
    const source_ids = governance.declaration_governance_contexts
      .filter((entry) => entry.has_contested_authority_path)
      .map((entry) => entry.permission_declaration_id)
      .sort(compareIds);
    contests.push({
      key: `feasibility-contest|${candidateKey}|permission-issuer-authority`,
      kind: "PERMISSION_ISSUER_AUTHORITY_CONTEST_PRESENT",
      related_key: "permission-issuer-authority",
      source_ids,
    });
  }

  return sortContests(contests);
}

export function deriveDeclaredExecutionConstraints(
  candidateComposition: DecisionOptionActorCompositionAssessment,
  capabilityBases: CapabilityFeasibilityBasis[],
  resourceBases: ResourceFeasibilityBasis[]
): DeclaredExecutionConstraint[] {
  const candidateKey = candidateComposition.candidate_position.key;
  const constraints: DeclaredExecutionConstraint[] = [];

  for (const basis of capabilityBases) {
    for (const assessment of basis.matching_capability_assessments) {
      if (assessment.availability.unavailable_declaration_ids.length === 0) {
        continue;
      }
      const related = canonicalValueKey([basis.capability_key, basis.capability_scope]);
      const source_declaration_ids = [
        ...assessment.availability.unavailable_declaration_ids,
      ].sort(compareIds);
      constraints.push({
        key: `execution-constraint|${candidateKey}|capability|${related}|unavailable|${assessment.capability.id}`,
        kind: "CAPABILITY_UNAVAILABLE_DECLARATION_PRESENT",
        source_declaration_ids,
      });
    }
  }

  for (const basis of resourceBases) {
    for (const assessment of basis.matching_resource_assessments) {
      if (assessment.availability.unavailable_declaration_ids.length === 0) {
        continue;
      }
      const related = canonicalValueKey([basis.resource_key, basis.unit, basis.resource_scope]);
      const source_declaration_ids = [
        ...assessment.availability.unavailable_declaration_ids,
      ].sort(compareIds);
      constraints.push({
        key: `execution-constraint|${candidateKey}|resource|${related}|unavailable|${assessment.resource.id}`,
        kind: "RESOURCE_UNAVAILABLE_DECLARATION_PRESENT",
        source_declaration_ids,
      });
    }
  }

  for (const permissionId of [
    ...candidateComposition.permission.prohibit_declaration_ids,
  ].sort(compareIds)) {
    constraints.push({
      key: `execution-constraint|${candidateKey}|permission|prohibit|${permissionId}`,
      kind: "INTERVENTION_PROHIBIT_DECLARATION_PRESENT",
      source_declaration_ids: [permissionId],
    });
  }

  return sortConstraints(constraints);
}

export function deriveFeasibilityModelLimitations(
  candidateComposition: DecisionOptionActorCompositionAssessment
): FeasibilityModelLimitation[] {
  const limitations = new Set<FeasibilityModelLimitation>([
    "EFFECTIVE_PERMISSION_NOT_MODELED",
    "COMMITMENT_NOT_MODELED",
    "EXECUTION_CONDITIONS_NOT_MODELED",
  ]);

  if (candidateComposition.has_capability_requirements) {
    limitations.add("EFFECTIVE_CAPABILITY_NOT_MODELED");
  }

  if (candidateComposition.has_permission_declarations) {
    limitations.add("AUTHORITY_PRECEDENCE_NOT_MODELED");
  }

  if (candidateComposition.has_resource_requirements) {
    limitations.add("RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED");
    limitations.add("RESOURCE_ACCESS_PERMISSION_NOT_MODELED");
    limitations.add("RESOURCE_RESERVATION_NOT_MODELED");
  }

  return MODEL_LIMITATION_ORDER.filter((entry) => limitations.has(entry));
}

export function assessDecisionOptionActorFeasibilityBasisFromComposition(
  candidateComposition: DecisionOptionActorCompositionAssessment
): DecisionOptionActorFeasibilityBasisAssessment {
  const capability_bases = candidateComposition.capability_requirement_matches
    .map(buildCapabilityFeasibilityBasis)
    .sort((a, b) => {
      if (a.capability_key !== b.capability_key) {
        return a.capability_key < b.capability_key ? -1 : 1;
      }
      return capabilityScopeKey(a.capability_scope).localeCompare(
        capabilityScopeKey(b.capability_scope)
      );
    });

  const resource_bases = candidateComposition.resource_requirement_matches
    .map(buildResourceFeasibilityBasis)
    .sort((a, b) => {
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

  const permission_basis = buildPermissionFeasibilityBasis(candidateComposition);
  const gaps = deriveFeasibilityBasisGaps(
    candidateComposition,
    capability_bases,
    resource_bases,
    permission_basis
  );
  const contests = deriveFeasibilityBasisContests(
    candidateComposition,
    capability_bases,
    resource_bases
  );
  const declared_constraints = deriveDeclaredExecutionConstraints(
    candidateComposition,
    capability_bases,
    resource_bases
  );
  const model_limitations = deriveFeasibilityModelLimitations(
    candidateComposition
  );

  return {
    candidate_composition: candidateComposition,
    at: candidateComposition.at,
    capability_bases,
    resource_bases,
    permission_basis,
    gaps,
    contests,
    declared_constraints,
    model_limitations,
    has_gaps: gaps.length > 0,
    has_contests: contests.length > 0,
    has_declared_constraints: declared_constraints.length > 0,
    has_model_limitations: model_limitations.length > 0,
  };
}

export function assessDecisionOptionActorFeasibilityBasis(
  projectState: ProjectState,
  candidatePosition: DecisionOptionActorCandidatePosition,
  at: string
): DecisionOptionActorFeasibilityBasisAssessment {
  const candidateComposition = assessDecisionOptionActorComposition(
    projectState,
    candidatePosition,
    at
  );
  return assessDecisionOptionActorFeasibilityBasisFromComposition(
    candidateComposition
  );
}

export function assessDecisionSpaceFeasibilityBasis(
  projectState: ProjectState,
  decisionSpaceId: string,
  at: string
): DecisionSpaceFeasibilityBasisAssessment {
  const actor_composition = assessDecisionSpaceActorComposition(
    projectState,
    decisionSpaceId,
    at
  );
  const actor_feasibility_bases = actor_composition.actor_compositions.map(
    (composition) =>
      assessDecisionOptionActorFeasibilityBasisFromComposition(composition)
  );

  return {
    decision_space_id: decisionSpaceId,
    at,
    actor_composition,
    actor_feasibility_bases,
    intervention_option_ids_without_actor_candidates:
      actor_composition.intervention_option_ids_without_actor_candidates,
    has_actor_feasibility_bases: actor_feasibility_bases.length > 0,
  };
}
