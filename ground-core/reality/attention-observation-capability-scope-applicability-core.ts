/**
 * Reality Core v0.7 — Attention Observation Capability Scope Applicability (GROUND-055).
 *
 * Pure composition of GROUND-050 Structural Declaration Match
 * + GROUND-054 Explicit Capability Scope Requirement.
 *
 * Positive basis = exact capabilityScopeKey equality only.
 * No hierarchy / subsumption / wildcard / final APPLICABLE verdict /
 * Requirement satisfaction / Verification / Availability / can_execute.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, GROUND-051/052/053, Permission, Authority, Resource,
 * Commitment, active-at / effective Capability helpers.
 */

import { capabilityScopeKey } from "./capability-core.js";
import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityDeclarationMatchSetAssessment,
  AttentionObservationCapabilityRequirementMatchPosition,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionCandidateObservationCapabilityScopeRequirementAssessment,
  AttentionObservationCapabilityRequirementScopeAssessment,
  AttentionObservationCapabilityScopeRequirement,
  AttentionObservationCapabilityScopeRequirementSetAssessment,
} from "./attention-observation-capability-scope-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityScopeApplicabilityAssessment,
  AttentionObservationCapabilityDeclarationScopeApplicabilityPosition,
  AttentionObservationCapabilityRequirementScopeApplicabilityPosition,
  AttentionObservationCapabilityScopeApplicabilityBasis,
  AttentionObservationCapabilityScopeApplicabilityCandidateStatus,
  AttentionObservationCapabilityScopeApplicabilityInput,
  AttentionObservationCapabilityScopeApplicabilityModelLimitation,
  AttentionObservationCapabilityScopeApplicabilitySetAssessment,
  AttentionObservationObserverCapabilityScopeApplicabilityBasis,
} from "./attention-observation-capability-scope-applicability-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_SCOPE_APPLICABILITY_MODEL_LIMITATIONS: AttentionObservationCapabilityScopeApplicabilityModelLimitation[] =
  [
    "CAPABILITY_SCOPE_HIERARCHY_NOT_MODELED",
    "CAPABILITY_SCOPE_SUBSUMPTION_NOT_MODELED",
    "CAPABILITY_SCOPE_COMPATIBILITY_NOT_MODELED",
    "CAPABILITY_SCOPE_NON_EXACT_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_TEMPORAL_REQUIREMENT_NOT_MODELED",
    "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_PRIORITY_NOT_MODELED",
    "OBSERVATION_RANKING_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Capability Declaration Match set and Capability Scope Requirement set do not share the same Capability Requirement context";

export function attentionObservationCapabilityScopeApplicabilityBasisKey(
  capabilityRequirementKey: string,
  capabilityScopeRequirementKey: string,
  capabilityDeclarationId: string
): string {
  return [
    "attention-observation-capability-scope-applicability-basis",
    capabilityRequirementKey,
    capabilityScopeRequirementKey,
    capabilityDeclarationId,
  ].join("|");
}

export function attentionObservationCapabilityDeclarationScopeApplicabilityPositionKey(
  capabilityDeclarationMatchKey: string,
  capabilityScopeRequirementKey: string
): string {
  return [
    "attention-observation-capability-declaration-scope-applicability-position",
    capabilityDeclarationMatchKey,
    capabilityScopeRequirementKey,
  ].join("|");
}

/**
 * Exact canonical CapabilityScope correspondence only.
 */
export function hasExactCanonicalCapabilityScopeCorrespondence(
  requiredScope: AttentionObservationCapabilityScopeRequirement["required_scope"],
  declaredScope: AttentionObservationCapabilityDeclarationMatch["capability_declaration"]["scope"]
): boolean {
  return capabilityScopeKey(requiredScope) === capabilityScopeKey(declaredScope);
}

/**
 * Validates 050/054 sibling sets share the same Capability Requirement context
 * via canonical AttentionCandidate / CapabilityRequirement keys — not object identity.
 */
export function assertCompatibleCapabilityScopeApplicabilitySiblingContexts(
  declarationMatchSet: AttentionObservationCapabilityDeclarationMatchSetAssessment,
  scopeRequirementSet: AttentionObservationCapabilityScopeRequirementSetAssessment
): void {
  const matchReqSet = declarationMatchSet.capability_requirement_set;
  const scopeReqSet = scopeRequirementSet.capability_requirement_set;

  const matchCandidates = declarationMatchSet.candidate_assessments;
  const scopeCandidates = scopeRequirementSet.candidate_assessments;

  if (matchCandidates.length !== scopeCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate count mismatch`
    );
  }

  if (
    matchReqSet.candidate_requirements.length !==
    scopeReqSet.candidate_requirements.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: embedded Capability Requirement AttentionCandidate count mismatch`
    );
  }

  for (let i = 0; i < matchCandidates.length; i++) {
    const matchCandidate = matchCandidates[i];
    const scopeCandidate = scopeCandidates[i];

    if (matchCandidate.candidate_key !== scopeCandidate.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch at index ${i} (${matchCandidate.candidate_key} vs ${scopeCandidate.candidate_key})`
      );
    }

    const matchReqAssessment = matchReqSet.candidate_requirements[i];
    const scopeReqAssessment = scopeReqSet.candidate_requirements[i];

    if (
      matchReqAssessment.candidate_key !== scopeReqAssessment.candidate_key ||
      matchReqAssessment.candidate_key !== matchCandidate.candidate_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: embedded Capability Requirement AttentionCandidate key mismatch`
      );
    }

    const matchNeedKey =
      matchReqAssessment.capability_requirement_basis?.observation_need_key ??
      matchReqAssessment.planning.planning_basis?.observation_need_key ??
      null;
    const scopeNeedKey =
      scopeReqAssessment.capability_requirement_basis?.observation_need_key ??
      scopeReqAssessment.planning.planning_basis?.observation_need_key ??
      null;
    if (matchNeedKey !== scopeNeedKey) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for AttentionCandidate ${matchCandidate.candidate_key}`
      );
    }

    const matchRequirements =
      matchReqAssessment.capability_requirement_basis?.requirements ?? [];
    const scopeRequirements =
      scopeReqAssessment.capability_requirement_basis?.requirements ?? [];

    if (matchRequirements.length !== scopeRequirements.length) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement count mismatch for AttentionCandidate ${matchCandidate.candidate_key}`
      );
    }

    for (let r = 0; r < matchRequirements.length; r++) {
      if (matchRequirements[r].key !== scopeRequirements[r].key) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement key mismatch (${matchRequirements[r].key} vs ${scopeRequirements[r].key})`
        );
      }
    }

    // Align 054 requirement_scope_assessments with 048 requirement keys when present.
    const scopeAssessments = scopeCandidate.requirement_scope_assessments;
    if (
      scopeAssessments.length > 0 &&
      scopeAssessments.length !== matchRequirements.length
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Scope Requirement assessment count mismatch for AttentionCandidate ${matchCandidate.candidate_key}`
      );
    }
    for (let r = 0; r < scopeAssessments.length; r++) {
      if (
        scopeAssessments[r].capability_requirement.key !==
        matchRequirements[r].key
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: Scope Requirement CapabilityRequirement key mismatch`
        );
      }
    }
  }
}

function buildApplicabilityBasis(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  scopeRequirement: AttentionObservationCapabilityScopeRequirement
): AttentionObservationCapabilityScopeApplicabilityBasis {
  return {
    key: attentionObservationCapabilityScopeApplicabilityBasisKey(
      declarationMatch.capability_requirement_key,
      scopeRequirement.key,
      declarationMatch.capability_declaration_id
    ),
    observation_need_key: declarationMatch.observation_need_key,
    attention_candidate_key: declarationMatch.attention_candidate_key,
    observer_candidate_key: declarationMatch.observer_candidate_key,
    observer_entity_id: declarationMatch.observer_entity_id,
    capability_requirement_key: declarationMatch.capability_requirement_key,
    capability_semantic_key: declarationMatch.capability_semantic_key,
    capability_scope_requirement_key: scopeRequirement.key,
    capability_declaration_match_key: declarationMatch.key,
    capability_declaration_id: declarationMatch.capability_declaration_id,
    basis_kind: "EXACT_CANONICAL_CAPABILITY_SCOPE_CORRESPONDENCE",
    required_scope: scopeRequirement.required_scope,
    declared_scope: declarationMatch.capability_declaration.scope,
  };
}

function buildDeclarationScopePosition(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  scopeRequirement: AttentionObservationCapabilityScopeRequirement
): AttentionObservationCapabilityDeclarationScopeApplicabilityPosition {
  const exact = hasExactCanonicalCapabilityScopeCorrespondence(
    scopeRequirement.required_scope,
    declarationMatch.capability_declaration.scope
  );

  return {
    key: attentionObservationCapabilityDeclarationScopeApplicabilityPositionKey(
      declarationMatch.key,
      scopeRequirement.key
    ),
    capability_declaration_match: declarationMatch,
    capability_scope_requirement: scopeRequirement,
    status: exact
      ? "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      : "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
    applicability_basis: exact
      ? buildApplicabilityBasis(declarationMatch, scopeRequirement)
      : null,
  };
}

function buildRequirementScopePosition(
  requirementMatchPosition: AttentionObservationCapabilityRequirementMatchPosition,
  scopeRequirementAssessment: AttentionObservationCapabilityRequirementScopeAssessment
): AttentionObservationCapabilityRequirementScopeApplicabilityPosition {
  const scopeRequirement =
    scopeRequirementAssessment.scope_requirement_basis.scope_requirement;

  // No explicit Scope Requirement → no applicability positions (do not synthesize UNSCOPED).
  if (
    scopeRequirementAssessment.status !==
      "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_PRESENT" ||
    scopeRequirement === null
  ) {
    return {
      capability_requirement: requirementMatchPosition.capability_requirement,
      scope_requirement_assessment: scopeRequirementAssessment,
      declaration_scope_positions: [],
    };
  }

  return {
    capability_requirement: requirementMatchPosition.capability_requirement,
    scope_requirement_assessment: scopeRequirementAssessment,
    declaration_scope_positions:
      requirementMatchPosition.structurally_matching_declarations.map(
        (declarationMatch) =>
          buildDeclarationScopePosition(declarationMatch, scopeRequirement)
      ),
  };
}

function mapStructuralNotApplicable(
  declarationMatchStatus: AttentionCandidateObservationCapabilityDeclarationAssessment["status"]
): AttentionObservationCapabilityScopeApplicabilityCandidateStatus | null {
  switch (declarationMatchStatus) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES":
      return "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES";
    case "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS":
      return "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS";
    case "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT":
      return null;
  }
}

/**
 * Pure per-AttentionCandidate Scope Applicability assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS
 * 5. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS
 * 6. NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED
 * 7. DIRECT_SCOPE_APPLICABILITY_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityScopeApplicability(
  declarationMatchAssessment: AttentionCandidateObservationCapabilityDeclarationAssessment,
  scopeRequirementAssessment: AttentionCandidateObservationCapabilityScopeRequirementAssessment
): AttentionCandidateObservationCapabilityScopeApplicabilityAssessment {
  const candidate_key = declarationMatchAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityScopeApplicabilityCandidateStatus
  ): AttentionCandidateObservationCapabilityScopeApplicabilityAssessment => ({
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    capability_scope_requirement_assessment: scopeRequirementAssessment,
    status,
    observer_scope_bases: [],
    has_direct_scope_applicability_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_SCOPE_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  });

  const structuralStatus = mapStructuralNotApplicable(
    declarationMatchAssessment.status
  );
  if (structuralStatus !== null) {
    return notApplicable(structuralStatus);
  }

  const scopeByRequirementKey = new Map(
    scopeRequirementAssessment.requirement_scope_assessments.map(
      (assessment) => [assessment.capability_requirement.key, assessment]
    )
  );

  const observer_scope_bases: AttentionObservationObserverCapabilityScopeApplicabilityBasis[] =
    declarationMatchAssessment.observer_capability_bases.map((basis) => ({
      observation_need_key: basis.observation_need_key,
      observer_candidate: basis.observer_candidate,
      requirement_scope_positions: basis.requirement_match_positions.map(
        (requirementMatchPosition) => {
          const scopeAssessment = scopeByRequirementKey.get(
            requirementMatchPosition.capability_requirement.key
          );
          if (!scopeAssessment) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: missing Scope Requirement assessment for CapabilityRequirement ${requirementMatchPosition.capability_requirement.key}`
            );
          }
          return buildRequirementScopePosition(
            requirementMatchPosition,
            scopeAssessment
          );
        }
      ),
    }));

  const evaluatedPositions = observer_scope_bases.flatMap((basis) =>
    basis.requirement_scope_positions.flatMap(
      (position) => position.declaration_scope_positions
    )
  );

  if (evaluatedPositions.length === 0) {
    return {
      candidate_key,
      capability_declaration_match_assessment: declarationMatchAssessment,
      capability_scope_requirement_assessment: scopeRequirementAssessment,
      status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS",
      observer_scope_bases,
      has_direct_scope_applicability_basis: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_SCOPE_APPLICABILITY_MODEL_LIMITATIONS,
      ],
    };
  }

  const has_direct_scope_applicability_basis = evaluatedPositions.some(
    (position) =>
      position.status === "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
  );

  return {
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    capability_scope_requirement_assessment: scopeRequirementAssessment,
    status: has_direct_scope_applicability_basis
      ? "DIRECT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      : "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
    observer_scope_bases,
    has_direct_scope_applicability_basis,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_SCOPE_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability Scope Applicability Basis composition.
 * Preserves GROUND-050 AttentionCandidate / Observer / Requirement / Declaration order.
 */
export function buildAttentionObservationCapabilityScopeApplicabilitySet(
  input: AttentionObservationCapabilityScopeApplicabilityInput
): AttentionObservationCapabilityScopeApplicabilitySetAssessment {
  assertCompatibleCapabilityScopeApplicabilitySiblingContexts(
    input.capability_declaration_match_set,
    input.capability_scope_requirement_set
  );

  const candidate_assessments =
    input.capability_declaration_match_set.candidate_assessments.map(
      (declarationMatchAssessment, index) =>
        assessAttentionCandidateObservationCapabilityScopeApplicability(
          declarationMatchAssessment,
          input.capability_scope_requirement_set.candidate_assessments[index]
        )
    );

  return {
    capability_declaration_match_set: input.capability_declaration_match_set,
    capability_scope_requirement_set: input.capability_scope_requirement_set,
    candidate_assessments,
    has_direct_scope_applicability_basis: candidate_assessments.some(
      (c) => c.has_direct_scope_applicability_basis
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_SCOPE_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  };
}
