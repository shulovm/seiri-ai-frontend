/**
 * Reality Core v0.7 — Attention Observation Capability Applicability Composition
 * (GROUND-060).
 *
 * Pure composition of:
 *   GROUND-055 Scope Applicability
 *   GROUND-057 Declaration Temporal Applicability
 *   GROUND-058 Verification Temporal Applicability
 *   GROUND-059 Availability Temporal Applicability
 *
 * Side-by-side dimensions for exact CapabilityDeclarationMatch positions.
 * Composition ≠ Resolution ≠ Requirement satisfaction ≠ effective Capability state.
 * No V×A Cartesian product. No interval recomputation. No wall-clock.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, Commitment,
 * ActiveAt helpers, scope/temporal classifiers.
 */

import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityDeclarationMatchSetAssessment,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionObservationCapabilityRequirementScopeAssessment,
} from "./attention-observation-capability-scope-requirement-types.js";
import type {
  AttentionObservationCapabilityRequirementTemporalAssessment,
} from "./attention-observation-capability-temporal-requirement-types.js";
import type {
  AttentionObservationCapabilityDeclarationVerificationPosition,
} from "./attention-observation-capability-verification-types.js";
import type {
  AttentionObservationCapabilityDeclarationAvailabilityPosition,
} from "./attention-observation-capability-availability-types.js";
import type {
  AttentionCandidateObservationCapabilityScopeApplicabilityAssessment,
  AttentionObservationCapabilityDeclarationScopeApplicabilityPosition,
  AttentionObservationCapabilityScopeApplicabilitySetAssessment,
} from "./attention-observation-capability-scope-applicability-types.js";
import type {
  AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment,
  AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition,
  AttentionObservationCapabilityDeclarationTemporalApplicabilitySetAssessment,
} from "./attention-observation-capability-declaration-temporal-applicability-types.js";
import type {
  AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment,
  AttentionObservationCapabilityVerificationTemporalApplicabilityPosition,
  AttentionObservationCapabilityVerificationTemporalApplicabilitySetAssessment,
} from "./attention-observation-capability-verification-temporal-applicability-types.js";
import type {
  AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilitySetAssessment,
} from "./attention-observation-capability-availability-temporal-applicability-types.js";
import type {
  AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  AttentionObservationCapabilityApplicabilityCompositionInput,
  AttentionObservationCapabilityApplicabilityCompositionModelLimitation,
  AttentionObservationCapabilityApplicabilityCompositionSetAssessment,
  AttentionObservationCapabilityApplicabilityCompositionStatus,
  AttentionObservationCapabilityDeclarationApplicabilityCompositionPosition,
  AttentionObservationCapabilityRequirementApplicabilityCompositionPosition,
  AttentionObservationObserverCapabilityApplicabilityCompositionBasis,
} from "./attention-observation-capability-applicability-composition-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_APPLICABILITY_COMPOSITION_MODEL_LIMITATIONS: AttentionObservationCapabilityApplicabilityCompositionModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_TEMPORAL_INTERSECTION_NOT_MODELED",
    "CAPABILITY_SCOPE_TEMPORAL_CONJUNCTION_NOT_MODELED",
    "CAPABILITY_SCOPE_NON_EXACT_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_VERIFICATION_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_VERIFICATION_RECENCY_POLICY_NOT_MODELED",
    "CAPABILITY_VERIFICATION_AUTHORITY_POLICY_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_RECENCY_POLICY_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_AUTHORITY_POLICY_NOT_MODELED",
    "CROSS_DECLARATION_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CROSS_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CROSS_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CROSS_OBSERVER_TEMPORAL_COMPOSITION_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_METHOD_NOT_MODELED",
    "OBSERVATION_PRIORITY_NOT_MODELED",
    "OBSERVATION_RANKING_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Capability Applicability inputs do not share the same Capability Declaration Match context";

export function attentionObservationCapabilityDeclarationApplicabilityCompositionKey(
  observationNeedKey: string,
  observerEntityId: string,
  capabilityRequirementKey: string,
  capabilityDeclarationId: string
): string {
  return [
    "attention-observation-capability-applicability-composition",
    observationNeedKey,
    observerEntityId,
    capabilityRequirementKey,
    capabilityDeclarationId,
  ].join("|");
}

function matchSetFromScope(
  scopeSet: AttentionObservationCapabilityScopeApplicabilitySetAssessment
): AttentionObservationCapabilityDeclarationMatchSetAssessment {
  return scopeSet.capability_declaration_match_set;
}

function matchSetFromDeclarationTemporal(
  set: AttentionObservationCapabilityDeclarationTemporalApplicabilitySetAssessment
): AttentionObservationCapabilityDeclarationMatchSetAssessment {
  return set.capability_declaration_match_set;
}

function matchSetFromVerificationTemporal(
  set: AttentionObservationCapabilityVerificationTemporalApplicabilitySetAssessment
): AttentionObservationCapabilityDeclarationMatchSetAssessment {
  return set.capability_verification_set.capability_declaration_match_set;
}

function matchSetFromAvailabilityTemporal(
  set: AttentionObservationCapabilityAvailabilityTemporalApplicabilitySetAssessment
): AttentionObservationCapabilityDeclarationMatchSetAssessment {
  return set.capability_availability_set.capability_declaration_match_set;
}

/**
 * Validates all four applicability inputs share the same GROUND-050 structural context.
 * Uses canonical keys — not object identity.
 */
export function assertCompatibleCapabilityApplicabilityCompositionContexts(
  input: AttentionObservationCapabilityApplicabilityCompositionInput
): void {
  const anchor = matchSetFromScope(input.capability_scope_applicability_set);
  const siblings: {
    label: string;
    matchSet: AttentionObservationCapabilityDeclarationMatchSetAssessment;
  }[] = [
    {
      label: "Declaration Temporal Applicability (057)",
      matchSet: matchSetFromDeclarationTemporal(
        input.capability_declaration_temporal_applicability_set
      ),
    },
    {
      label: "Verification Temporal Applicability (058)",
      matchSet: matchSetFromVerificationTemporal(
        input.capability_verification_temporal_applicability_set
      ),
    },
    {
      label: "Availability Temporal Applicability (059)",
      matchSet: matchSetFromAvailabilityTemporal(
        input.capability_availability_temporal_applicability_set
      ),
    },
  ];

  for (const sibling of siblings) {
    assertMatchSetsCompatible(anchor, sibling.matchSet, sibling.label);
  }

  // Candidate assessment alignment across the four branch candidate arrays.
  const scopeCandidates =
    input.capability_scope_applicability_set.candidate_assessments;
  const declTemporalCandidates =
    input.capability_declaration_temporal_applicability_set.candidate_assessments;
  const verificationCandidates =
    input.capability_verification_temporal_applicability_set.candidate_assessments;
  const availabilityCandidates =
    input.capability_availability_temporal_applicability_set.candidate_assessments;

  const lengths = [
    scopeCandidates.length,
    declTemporalCandidates.length,
    verificationCandidates.length,
    availabilityCandidates.length,
  ];
  if (new Set(lengths).size !== 1) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate assessment count mismatch`
    );
  }

  for (let i = 0; i < scopeCandidates.length; i++) {
    const key = scopeCandidates[i].candidate_key;
    if (
      declTemporalCandidates[i].candidate_key !== key ||
      verificationCandidates[i].candidate_key !== key ||
      availabilityCandidates[i].candidate_key !== key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch at index ${i}`
      );
    }
  }
}

function assertMatchSetsCompatible(
  anchor: AttentionObservationCapabilityDeclarationMatchSetAssessment,
  other: AttentionObservationCapabilityDeclarationMatchSetAssessment,
  label: string
): void {
  if (
    anchor.candidate_assessments.length !== other.candidate_assessments.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate count mismatch vs ${label}`
    );
  }

  for (let i = 0; i < anchor.candidate_assessments.length; i++) {
    const a = anchor.candidate_assessments[i];
    const b = other.candidate_assessments[i];
    if (a.candidate_key !== b.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch vs ${label} (${a.candidate_key} vs ${b.candidate_key})`
      );
    }

    if (a.observer_capability_bases.length !== b.observer_capability_bases.length) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Observer Candidate count mismatch vs ${label} for AttentionCandidate ${a.candidate_key}`
      );
    }

    for (let o = 0; o < a.observer_capability_bases.length; o++) {
      const aObs = a.observer_capability_bases[o];
      const bObs = b.observer_capability_bases[o];
      if (aObs.observer_candidate.key !== bObs.observer_candidate.key) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: ObserverCandidate key mismatch vs ${label}`
        );
      }
      if (aObs.observation_need_key !== bObs.observation_need_key) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch vs ${label}`
        );
      }
      if (
        aObs.requirement_match_positions.length !==
        bObs.requirement_match_positions.length
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement position count mismatch vs ${label}`
        );
      }
      for (let r = 0; r < aObs.requirement_match_positions.length; r++) {
        const aReq = aObs.requirement_match_positions[r];
        const bReq = bObs.requirement_match_positions[r];
        if (
          aReq.capability_requirement.key !== bReq.capability_requirement.key
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement key mismatch vs ${label}`
          );
        }
        if (
          aReq.structurally_matching_declarations.length !==
          bReq.structurally_matching_declarations.length
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: CapabilityDeclaration count mismatch vs ${label}`
          );
        }
        for (
          let d = 0;
          d < aReq.structurally_matching_declarations.length;
          d++
        ) {
          const aDecl = aReq.structurally_matching_declarations[d];
          const bDecl = bReq.structurally_matching_declarations[d];
          if (aDecl.key !== bDecl.key) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: CapabilityDeclarationMatch key mismatch vs ${label}`
            );
          }
          if (aDecl.capability_declaration_id !== bDecl.capability_declaration_id) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: CapabilityDeclaration.id mismatch vs ${label}`
            );
          }
        }
      }
    }
  }
}

function mapStructuralCompositionStatus(
  matchStatus: AttentionCandidateObservationCapabilityDeclarationAssessment["status"]
): AttentionObservationCapabilityApplicabilityCompositionStatus | null {
  switch (matchStatus) {
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

interface SiblingIndexes {
  scopeByMatchKey: Map<
    string,
    AttentionObservationCapabilityDeclarationScopeApplicabilityPosition
  >;
  scopeAssessmentByReqKey: Map<
    string,
    AttentionObservationCapabilityRequirementScopeAssessment
  >;
  declarationTemporalByMatchKey: Map<
    string,
    AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition
  >;
  temporalAssessmentByReqKey: Map<
    string,
    AttentionObservationCapabilityRequirementTemporalAssessment
  >;
  verificationPositionByMatchKey: Map<
    string,
    AttentionObservationCapabilityDeclarationVerificationPosition
  >;
  verificationTemporalByMatchKey: Map<
    string,
    AttentionObservationCapabilityVerificationTemporalApplicabilityPosition[]
  >;
  availabilityPositionByMatchKey: Map<
    string,
    AttentionObservationCapabilityDeclarationAvailabilityPosition
  >;
  availabilityTemporalByMatchKey: Map<
    string,
    AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition[]
  >;
}

function buildSiblingIndexes(
  scopeAssessment: AttentionCandidateObservationCapabilityScopeApplicabilityAssessment,
  declarationTemporalAssessment: AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment,
  verificationTemporalAssessment: AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment,
  availabilityTemporalAssessment: AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment
): SiblingIndexes {
  const scopeByMatchKey = new Map<
    string,
    AttentionObservationCapabilityDeclarationScopeApplicabilityPosition
  >();
  const scopeAssessmentByReqKey = new Map<
    string,
    AttentionObservationCapabilityRequirementScopeAssessment
  >();
  for (const obs of scopeAssessment.observer_scope_bases) {
    for (const req of obs.requirement_scope_positions) {
      scopeAssessmentByReqKey.set(
        req.capability_requirement.key,
        req.scope_requirement_assessment
      );
      for (const pos of req.declaration_scope_positions) {
        scopeByMatchKey.set(pos.capability_declaration_match.key, pos);
      }
    }
  }

  const declarationTemporalByMatchKey = new Map<
    string,
    AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition
  >();
  const temporalAssessmentByReqKey = new Map<
    string,
    AttentionObservationCapabilityRequirementTemporalAssessment
  >();
  for (const obs of declarationTemporalAssessment.observer_temporal_bases) {
    for (const req of obs.requirement_temporal_positions) {
      temporalAssessmentByReqKey.set(
        req.capability_requirement.key,
        req.temporal_requirement_assessment
      );
      for (const pos of req.declaration_temporal_positions) {
        declarationTemporalByMatchKey.set(
          pos.capability_declaration_match.key,
          pos
        );
      }
    }
  }

  // Prefer 056 assessments from temporal requirement assessment when temporal bases empty.
  for (const assessment of declarationTemporalAssessment
    .capability_temporal_requirement_assessment.requirement_temporal_assessments) {
    if (!temporalAssessmentByReqKey.has(assessment.capability_requirement.key)) {
      temporalAssessmentByReqKey.set(
        assessment.capability_requirement.key,
        assessment
      );
    }
  }
  for (const assessment of scopeAssessment.capability_scope_requirement_assessment
    .requirement_scope_assessments) {
    if (!scopeAssessmentByReqKey.has(assessment.capability_requirement.key)) {
      scopeAssessmentByReqKey.set(
        assessment.capability_requirement.key,
        assessment
      );
    }
  }

  const verificationPositionByMatchKey = new Map<
    string,
    AttentionObservationCapabilityDeclarationVerificationPosition
  >();
  const verificationTemporalByMatchKey = new Map<
    string,
    AttentionObservationCapabilityVerificationTemporalApplicabilityPosition[]
  >();
  // Structural Verification positions from embedded 051 (always when structural D present).
  for (const obs of verificationTemporalAssessment
    .capability_verification_assessment.observer_verification_bases) {
    for (const req of obs.requirement_verification_positions) {
      for (const decl of req.declaration_verification_positions) {
        verificationPositionByMatchKey.set(
          decl.capability_declaration_match.key,
          decl
        );
      }
    }
  }
  for (const obs of verificationTemporalAssessment.observer_verification_temporal_bases) {
    for (const req of obs.requirement_verification_temporal_positions) {
      for (const decl of req.declaration_verification_temporal_positions) {
        verificationTemporalByMatchKey.set(
          decl.capability_declaration_match.key,
          decl.verification_temporal_positions
        );
      }
    }
  }

  const availabilityPositionByMatchKey = new Map<
    string,
    AttentionObservationCapabilityDeclarationAvailabilityPosition
  >();
  const availabilityTemporalByMatchKey = new Map<
    string,
    AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition[]
  >();
  for (const obs of availabilityTemporalAssessment
    .capability_availability_assessment.observer_availability_bases) {
    for (const req of obs.requirement_availability_positions) {
      for (const decl of req.declaration_availability_positions) {
        availabilityPositionByMatchKey.set(
          decl.capability_declaration_match.key,
          decl
        );
      }
    }
  }
  for (const obs of availabilityTemporalAssessment.observer_availability_temporal_bases) {
    for (const req of obs.requirement_availability_temporal_positions) {
      for (const decl of req.declaration_availability_temporal_positions) {
        availabilityTemporalByMatchKey.set(
          decl.capability_declaration_match.key,
          decl.availability_temporal_positions
        );
      }
    }
  }

  return {
    scopeByMatchKey,
    scopeAssessmentByReqKey,
    declarationTemporalByMatchKey,
    temporalAssessmentByReqKey,
    verificationPositionByMatchKey,
    verificationTemporalByMatchKey,
    availabilityPositionByMatchKey,
    availabilityTemporalByMatchKey,
  };
}

function buildDeclarationCompositionPosition(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  indexes: SiblingIndexes
): AttentionObservationCapabilityDeclarationApplicabilityCompositionPosition {
  const matchKey = declarationMatch.key;
  const reqKey = declarationMatch.capability_requirement_key;

  const scopeAssessment = indexes.scopeAssessmentByReqKey.get(reqKey);
  const temporalAssessment = indexes.temporalAssessmentByReqKey.get(reqKey);
  const verificationPosition =
    indexes.verificationPositionByMatchKey.get(matchKey);
  const availabilityPosition =
    indexes.availabilityPositionByMatchKey.get(matchKey);

  if (!scopeAssessment) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: missing Scope Requirement assessment for CapabilityRequirement ${reqKey}`
    );
  }
  if (!temporalAssessment) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: missing Temporal Requirement assessment for CapabilityRequirement ${reqKey}`
    );
  }
  if (!verificationPosition) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: missing CapabilityDeclaration Verification position for match ${matchKey}`
    );
  }
  if (!availabilityPosition) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: missing CapabilityDeclaration Availability position for match ${matchKey}`
    );
  }

  return {
    key: attentionObservationCapabilityDeclarationApplicabilityCompositionKey(
      declarationMatch.observation_need_key,
      declarationMatch.observer_entity_id,
      declarationMatch.capability_requirement_key,
      declarationMatch.capability_declaration_id
    ),
    observation_need_key: declarationMatch.observation_need_key,
    attention_candidate_key: declarationMatch.attention_candidate_key,
    observer_candidate_key: declarationMatch.observer_candidate_key,
    observer_entity_id: declarationMatch.observer_entity_id,
    capability_requirement_key: declarationMatch.capability_requirement_key,
    capability_semantic_key: declarationMatch.capability_semantic_key,
    capability_declaration_match: declarationMatch,
    scope_dimension: {
      capability_scope_requirement_assessment: scopeAssessment,
      scope_applicability_position:
        indexes.scopeByMatchKey.get(matchKey) ?? null,
    },
    declaration_temporal_dimension: {
      temporal_requirement_assessment: temporalAssessment,
      declaration_temporal_applicability_position:
        indexes.declarationTemporalByMatchKey.get(matchKey) ?? null,
    },
    verification_temporal_dimension: {
      capability_declaration_verification_position: verificationPosition,
      verification_temporal_positions:
        indexes.verificationTemporalByMatchKey.get(matchKey) ?? [],
    },
    availability_temporal_dimension: {
      capability_declaration_availability_position: availabilityPosition,
      availability_temporal_positions:
        indexes.availabilityTemporalByMatchKey.get(matchKey) ?? [],
    },
  };
}

/**
 * Pure per-AttentionCandidate Capability Applicability Composition.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS
 * 5. CAPABILITY_APPLICABILITY_COMPOSITION_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityApplicabilityComposition(
  scopeAssessment: AttentionCandidateObservationCapabilityScopeApplicabilityAssessment,
  declarationTemporalAssessment: AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment,
  verificationTemporalAssessment: AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment,
  availabilityTemporalAssessment: AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment
): AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment {
  const candidate_key = scopeAssessment.candidate_key;
  const matchAssessment =
    scopeAssessment.capability_declaration_match_assessment;

  const notApplicable = (
    status: AttentionObservationCapabilityApplicabilityCompositionStatus
  ): AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment => ({
    candidate_key,
    scope_applicability_assessment: scopeAssessment,
    declaration_temporal_applicability_assessment: declarationTemporalAssessment,
    verification_temporal_applicability_assessment:
      verificationTemporalAssessment,
    availability_temporal_applicability_assessment:
      availabilityTemporalAssessment,
    status,
    observer_applicability_bases: [],
    has_capability_applicability_composition_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_APPLICABILITY_COMPOSITION_MODEL_LIMITATIONS,
    ],
  });

  const structuralStatus = mapStructuralCompositionStatus(
    matchAssessment.status
  );
  if (structuralStatus !== null) {
    return notApplicable(structuralStatus);
  }

  const indexes = buildSiblingIndexes(
    scopeAssessment,
    declarationTemporalAssessment,
    verificationTemporalAssessment,
    availabilityTemporalAssessment
  );

  const observer_applicability_bases: AttentionObservationObserverCapabilityApplicabilityCompositionBasis[] =
    matchAssessment.observer_capability_bases.map((basis) => ({
      observation_need_key: basis.observation_need_key,
      observer_candidate: basis.observer_candidate,
      requirement_composition_positions: basis.requirement_match_positions.map(
        (requirementMatchPosition) => {
          const reqKey =
            requirementMatchPosition.capability_requirement.key;
          const scopeReqAssessment =
            indexes.scopeAssessmentByReqKey.get(reqKey);
          const temporalReqAssessment =
            indexes.temporalAssessmentByReqKey.get(reqKey);
          if (!scopeReqAssessment || !temporalReqAssessment) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: missing Scope/Temporal Requirement assessment for CapabilityRequirement ${reqKey}`
            );
          }
          return {
            capability_requirement:
              requirementMatchPosition.capability_requirement,
            capability_scope_requirement_assessment: scopeReqAssessment,
            capability_temporal_requirement_assessment: temporalReqAssessment,
            declaration_composition_positions:
              requirementMatchPosition.structurally_matching_declarations.map(
                (declarationMatch) =>
                  buildDeclarationCompositionPosition(
                    declarationMatch,
                    indexes
                  )
              ),
          } satisfies AttentionObservationCapabilityRequirementApplicabilityCompositionPosition;
        }
      ),
    }));

  const has_capability_applicability_composition_basis =
    observer_applicability_bases.some((basis) =>
      basis.requirement_composition_positions.some(
        (req) => req.declaration_composition_positions.length > 0
      )
    );

  return {
    candidate_key,
    scope_applicability_assessment: scopeAssessment,
    declaration_temporal_applicability_assessment: declarationTemporalAssessment,
    verification_temporal_applicability_assessment:
      verificationTemporalAssessment,
    availability_temporal_applicability_assessment:
      availabilityTemporalAssessment,
    status: has_capability_applicability_composition_basis
      ? "CAPABILITY_APPLICABILITY_COMPOSITION_BASIS_PRESENT"
      : "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS",
    observer_applicability_bases,
    has_capability_applicability_composition_basis,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_APPLICABILITY_COMPOSITION_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability Applicability Composition.
 * Preserves GROUND-050 AttentionCandidate / Observer / Requirement / Declaration order.
 * Does not recompute 055/057/058/059 classifiers.
 */
export function buildAttentionObservationCapabilityApplicabilityCompositionSet(
  input: AttentionObservationCapabilityApplicabilityCompositionInput
): AttentionObservationCapabilityApplicabilityCompositionSetAssessment {
  assertCompatibleCapabilityApplicabilityCompositionContexts(input);

  const candidate_assessments =
    input.capability_scope_applicability_set.candidate_assessments.map(
      (scopeAssessment, index) =>
        assessAttentionCandidateObservationCapabilityApplicabilityComposition(
          scopeAssessment,
          input.capability_declaration_temporal_applicability_set
            .candidate_assessments[index],
          input.capability_verification_temporal_applicability_set
            .candidate_assessments[index],
          input.capability_availability_temporal_applicability_set
            .candidate_assessments[index]
        )
    );

  return {
    capability_scope_applicability_set:
      input.capability_scope_applicability_set,
    capability_declaration_temporal_applicability_set:
      input.capability_declaration_temporal_applicability_set,
    capability_verification_temporal_applicability_set:
      input.capability_verification_temporal_applicability_set,
    capability_availability_temporal_applicability_set:
      input.capability_availability_temporal_applicability_set,
    candidate_assessments,
    has_capability_applicability_composition_basis: candidate_assessments.some(
      (c) => c.has_capability_applicability_composition_basis
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_APPLICABILITY_COMPOSITION_MODEL_LIMITATIONS,
    ],
  };
}
