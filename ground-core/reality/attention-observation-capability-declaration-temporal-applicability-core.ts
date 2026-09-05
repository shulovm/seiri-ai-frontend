/**
 * Reality Core v0.7 — Attention Observation Capability Declaration Temporal
 * Applicability (GROUND-057).
 *
 * Pure composition of GROUND-050 Structural Declaration Match
 * + GROUND-056 Explicit Capability Temporal Requirement.
 *
 * Derives only canonical half-open interval relations:
 *   FULL_REQUIRED_WINDOW_COVERAGE
 *   PARTIAL_REQUIRED_WINDOW_OVERLAP
 *   NO_REQUIRED_WINDOW_OVERLAP
 *
 * Sibling of GROUND-055 Scope Applicability.
 * No hierarchy / satisfaction / CURRENT/ACTIVE / ActiveAt / wall-clock /
 * Verification / Availability temporal comparison / can_execute.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, GROUND-051–055, Permission, Authority, Resource, Commitment,
 * isCapability*ActiveAt / isIntervalActiveAt for relation derivation.
 */

import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityDeclarationMatchSetAssessment,
  AttentionObservationCapabilityRequirementMatchPosition,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionCandidateObservationCapabilityTemporalRequirementAssessment,
  AttentionObservationCapabilityRequirementTemporalAssessment,
  AttentionObservationCapabilityTemporalRequirement,
  AttentionObservationCapabilityTemporalRequirementSetAssessment,
  AttentionObservationRequiredCapabilityTemporalWindow,
} from "./attention-observation-capability-temporal-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment,
  AttentionObservationCapabilityDeclarationTemporalApplicabilityBasis,
  AttentionObservationCapabilityDeclarationTemporalApplicabilityInput,
  AttentionObservationCapabilityDeclarationTemporalApplicabilityModelLimitation,
  AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition,
  AttentionObservationCapabilityDeclarationTemporalApplicabilitySetAssessment,
  AttentionObservationCapabilityDeclarationTemporalApplicabilityStatus,
  AttentionObservationCapabilityDeclarationTemporalRelation,
  AttentionObservationCapabilityDeclarationValidityWindow,
  AttentionObservationCapabilityRequirementTemporalApplicabilityPosition,
  AttentionObservationObserverCapabilityTemporalApplicabilityBasis,
} from "./attention-observation-capability-declaration-temporal-applicability-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS: AttentionObservationCapabilityDeclarationTemporalApplicabilityModelLimitation[] =
  [
    "CAPABILITY_TEMPORAL_POINT_REQUIREMENT_NOT_MODELED",
    "CAPABILITY_LEFT_UNBOUNDED_TEMPORAL_REQUIREMENT_NOT_MODELED",
    "CAPABILITY_MULTIPLE_TEMPORAL_WINDOWS_NOT_MODELED",
    "CAPABILITY_RECURRING_TEMPORAL_REQUIREMENT_NOT_MODELED",
    "CROSS_DECLARATION_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CROSS_OBSERVER_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_TEMPORAL_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_SCOPE_NON_EXACT_APPLICABILITY_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_EXECUTION_TIME_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Capability Declaration Match set and Capability Temporal Requirement set do not share the same Capability Requirement context";

export function attentionObservationCapabilityDeclarationTemporalApplicabilityBasisKey(
  capabilityRequirementKey: string,
  capabilityTemporalRequirementKey: string,
  capabilityDeclarationId: string
): string {
  return [
    "attention-observation-capability-declaration-temporal-applicability-basis",
    capabilityRequirementKey,
    capabilityTemporalRequirementKey,
    capabilityDeclarationId,
  ].join("|");
}

export function attentionObservationCapabilityDeclarationTemporalApplicabilityPositionKey(
  capabilityDeclarationMatchKey: string,
  capabilityTemporalRequirementKey: string
): string {
  return [
    "attention-observation-capability-declaration-temporal-applicability-position",
    capabilityDeclarationMatchKey,
    capabilityTemporalRequirementKey,
  ].join("|");
}

/**
 * Pure analytical half-open interval relation.
 *
 * R = [r0, r1)   r1 null → +∞
 * D = [d0, d1)   d1 null → +∞
 *
 * FULL iff d0 <= r0 AND declaration end covers requirement end
 *   (finite r1 → d1 null OR d1 >= r1; open r1 → d1 must be null)
 * OVERLAP iff d0 < r1 AND r0 < d1 (null end = +∞)
 * PARTIAL iff overlap AND not FULL
 * NO_OVERLAP iff no overlap
 *
 * No point sampling. No fake infinity timestamps. No wall-clock.
 */
export function classifyRequiredWindowAgainstCapabilityDeclarationValidity(
  requiredWindow: AttentionObservationRequiredCapabilityTemporalWindow,
  declarationWindow: AttentionObservationCapabilityDeclarationValidityWindow
): AttentionObservationCapabilityDeclarationTemporalRelation {
  const r0 = requiredWindow.required_from;
  const r1 = requiredWindow.required_until;
  const d0 = declarationWindow.valid_from;
  const d1 = declarationWindow.valid_until;

  if (declarationFullyCoversRequired(r0, r1, d0, d1)) {
    return "FULL_REQUIRED_WINDOW_COVERAGE";
  }
  if (halfOpenIntervalsOverlap(r0, r1, d0, d1)) {
    return "PARTIAL_REQUIRED_WINDOW_OVERLAP";
  }
  return "NO_REQUIRED_WINDOW_OVERLAP";
}

function declarationFullyCoversRequired(
  r0: string,
  r1: string | null,
  d0: string,
  d1: string | null
): boolean {
  if (d0 > r0) {
    return false;
  }
  if (r1 === null) {
    // Open-ended required window can only be fully covered by open-ended declaration.
    return d1 === null;
  }
  // Finite required end: open-ended declaration OR declaration ends at/after r1.
  return d1 === null || d1 >= r1;
}

function halfOpenIntervalsOverlap(
  r0: string,
  r1: string | null,
  d0: string,
  d1: string | null
): boolean {
  // d0 < r1 (r1 null → +∞ ⇒ always true for any finite d0)
  const d0BeforeR1 = r1 === null || d0 < r1;
  // r0 < d1 (d1 null → +∞ ⇒ always true for any finite r0)
  const r0BeforeD1 = d1 === null || r0 < d1;
  return d0BeforeR1 && r0BeforeD1;
}

/**
 * Validates 050/056 sibling sets share the same Capability Requirement context
 * via canonical AttentionCandidate / CapabilityRequirement keys — not object identity.
 */
export function assertCompatibleCapabilityTemporalApplicabilitySiblingContexts(
  declarationMatchSet: AttentionObservationCapabilityDeclarationMatchSetAssessment,
  temporalRequirementSet: AttentionObservationCapabilityTemporalRequirementSetAssessment
): void {
  const matchReqSet = declarationMatchSet.capability_requirement_set;
  const temporalReqSet = temporalRequirementSet.capability_requirement_set;

  const matchCandidates = declarationMatchSet.candidate_assessments;
  const temporalCandidates = temporalRequirementSet.candidate_assessments;

  if (matchCandidates.length !== temporalCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate count mismatch`
    );
  }

  if (
    matchReqSet.candidate_requirements.length !==
    temporalReqSet.candidate_requirements.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: embedded Capability Requirement AttentionCandidate count mismatch`
    );
  }

  for (let i = 0; i < matchCandidates.length; i++) {
    const matchCandidate = matchCandidates[i];
    const temporalCandidate = temporalCandidates[i];

    if (matchCandidate.candidate_key !== temporalCandidate.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch at index ${i} (${matchCandidate.candidate_key} vs ${temporalCandidate.candidate_key})`
      );
    }

    const matchReqAssessment = matchReqSet.candidate_requirements[i];
    const temporalReqAssessment = temporalReqSet.candidate_requirements[i];

    if (
      matchReqAssessment.candidate_key !== temporalReqAssessment.candidate_key ||
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
    const temporalNeedKey =
      temporalReqAssessment.capability_requirement_basis?.observation_need_key ??
      temporalReqAssessment.planning.planning_basis?.observation_need_key ??
      null;
    if (matchNeedKey !== temporalNeedKey) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for AttentionCandidate ${matchCandidate.candidate_key}`
      );
    }

    const matchRequirements =
      matchReqAssessment.capability_requirement_basis?.requirements ?? [];
    const temporalRequirements =
      temporalReqAssessment.capability_requirement_basis?.requirements ?? [];

    if (matchRequirements.length !== temporalRequirements.length) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement count mismatch for AttentionCandidate ${matchCandidate.candidate_key}`
      );
    }

    for (let r = 0; r < matchRequirements.length; r++) {
      if (matchRequirements[r].key !== temporalRequirements[r].key) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement key mismatch (${matchRequirements[r].key} vs ${temporalRequirements[r].key})`
        );
      }
    }

    const temporalAssessments =
      temporalCandidate.requirement_temporal_assessments;
    if (
      temporalAssessments.length > 0 &&
      temporalAssessments.length !== matchRequirements.length
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Temporal Requirement assessment count mismatch for AttentionCandidate ${matchCandidate.candidate_key}`
      );
    }
    for (let r = 0; r < temporalAssessments.length; r++) {
      if (
        temporalAssessments[r].capability_requirement.key !==
        matchRequirements[r].key
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: Temporal Requirement CapabilityRequirement key mismatch`
        );
      }
    }
  }
}

function buildApplicabilityBasis(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  temporalRequirement: AttentionObservationCapabilityTemporalRequirement,
  relation: AttentionObservationCapabilityDeclarationTemporalRelation
): AttentionObservationCapabilityDeclarationTemporalApplicabilityBasis {
  const declaration_window: AttentionObservationCapabilityDeclarationValidityWindow =
    {
      valid_from: declarationMatch.capability_declaration.valid_from,
      valid_until: declarationMatch.capability_declaration.valid_until,
    };

  return {
    key: attentionObservationCapabilityDeclarationTemporalApplicabilityBasisKey(
      declarationMatch.capability_requirement_key,
      temporalRequirement.key,
      declarationMatch.capability_declaration_id
    ),
    observation_need_key: declarationMatch.observation_need_key,
    attention_candidate_key: declarationMatch.attention_candidate_key,
    observer_candidate_key: declarationMatch.observer_candidate_key,
    observer_entity_id: declarationMatch.observer_entity_id,
    capability_requirement_key: declarationMatch.capability_requirement_key,
    capability_semantic_key: declarationMatch.capability_semantic_key,
    capability_temporal_requirement_key: temporalRequirement.key,
    capability_declaration_match_key: declarationMatch.key,
    capability_declaration_id: declarationMatch.capability_declaration_id,
    relation,
    basis_kind: relation,
    required_window: {
      required_from: temporalRequirement.required_window.required_from,
      required_until: temporalRequirement.required_window.required_until,
    },
    declaration_window,
  };
}

function buildDeclarationTemporalPosition(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  temporalRequirement: AttentionObservationCapabilityTemporalRequirement
): AttentionObservationCapabilityDeclarationTemporalApplicabilityPosition {
  const declaration_window: AttentionObservationCapabilityDeclarationValidityWindow =
    {
      valid_from: declarationMatch.capability_declaration.valid_from,
      valid_until: declarationMatch.capability_declaration.valid_until,
    };

  const relation = classifyRequiredWindowAgainstCapabilityDeclarationValidity(
    temporalRequirement.required_window,
    declaration_window
  );

  return {
    key: attentionObservationCapabilityDeclarationTemporalApplicabilityPositionKey(
      declarationMatch.key,
      temporalRequirement.key
    ),
    capability_declaration_match: declarationMatch,
    capability_temporal_requirement: temporalRequirement,
    relation,
    applicability_basis: buildApplicabilityBasis(
      declarationMatch,
      temporalRequirement,
      relation
    ),
  };
}

function buildRequirementTemporalPosition(
  requirementMatchPosition: AttentionObservationCapabilityRequirementMatchPosition,
  temporalRequirementAssessment: AttentionObservationCapabilityRequirementTemporalAssessment
): AttentionObservationCapabilityRequirementTemporalApplicabilityPosition {
  const temporalRequirement =
    temporalRequirementAssessment.temporal_requirement_basis
      .temporal_requirement;

  // No explicit Temporal Requirement → no relation positions (do not synthesize now/all-time).
  if (
    temporalRequirementAssessment.status !==
      "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT" ||
    temporalRequirement === null
  ) {
    return {
      capability_requirement: requirementMatchPosition.capability_requirement,
      temporal_requirement_assessment: temporalRequirementAssessment,
      declaration_temporal_positions: [],
    };
  }

  return {
    capability_requirement: requirementMatchPosition.capability_requirement,
    temporal_requirement_assessment: temporalRequirementAssessment,
    declaration_temporal_positions:
      requirementMatchPosition.structurally_matching_declarations.map(
        (declarationMatch) =>
          buildDeclarationTemporalPosition(
            declarationMatch,
            temporalRequirement
          )
      ),
  };
}

function mapStructuralNotApplicable(
  declarationMatchStatus: AttentionCandidateObservationCapabilityDeclarationAssessment["status"]
): AttentionObservationCapabilityDeclarationTemporalApplicabilityStatus | null {
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
 * Pure per-AttentionCandidate Declaration Temporal Applicability assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS
 * 5. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT
 * 6. CAPABILITY_DECLARATION_TEMPORAL_RELATION_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityTemporalApplicability(
  declarationMatchAssessment: AttentionCandidateObservationCapabilityDeclarationAssessment,
  temporalRequirementAssessment: AttentionCandidateObservationCapabilityTemporalRequirementAssessment
): AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment {
  const candidate_key = declarationMatchAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityDeclarationTemporalApplicabilityStatus
  ): AttentionCandidateObservationCapabilityTemporalApplicabilityAssessment => ({
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    capability_temporal_requirement_assessment: temporalRequirementAssessment,
    status,
    observer_temporal_bases: [],
    has_capability_declaration_temporal_relation_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  });

  const structuralStatus = mapStructuralNotApplicable(
    declarationMatchAssessment.status
  );
  if (structuralStatus !== null) {
    return notApplicable(structuralStatus);
  }

  const temporalByRequirementKey = new Map(
    temporalRequirementAssessment.requirement_temporal_assessments.map(
      (assessment) => [assessment.capability_requirement.key, assessment]
    )
  );

  const observer_temporal_bases: AttentionObservationObserverCapabilityTemporalApplicabilityBasis[] =
    declarationMatchAssessment.observer_capability_bases.map((basis) => ({
      observation_need_key: basis.observation_need_key,
      observer_candidate: basis.observer_candidate,
      requirement_temporal_positions: basis.requirement_match_positions.map(
        (requirementMatchPosition) => {
          const temporalAssessment = temporalByRequirementKey.get(
            requirementMatchPosition.capability_requirement.key
          );
          if (!temporalAssessment) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: missing Temporal Requirement assessment for CapabilityRequirement ${requirementMatchPosition.capability_requirement.key}`
            );
          }
          return buildRequirementTemporalPosition(
            requirementMatchPosition,
            temporalAssessment
          );
        }
      ),
    }));

  const evaluatedPositions = observer_temporal_bases.flatMap((basis) =>
    basis.requirement_temporal_positions.flatMap(
      (position) => position.declaration_temporal_positions
    )
  );

  if (evaluatedPositions.length === 0) {
    return {
      candidate_key,
      capability_declaration_match_assessment: declarationMatchAssessment,
      capability_temporal_requirement_assessment: temporalRequirementAssessment,
      status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
      observer_temporal_bases,
      has_capability_declaration_temporal_relation_basis: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
      ],
    };
  }

  return {
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    capability_temporal_requirement_assessment: temporalRequirementAssessment,
    status: "CAPABILITY_DECLARATION_TEMPORAL_RELATION_BASIS_PRESENT",
    observer_temporal_bases,
    has_capability_declaration_temporal_relation_basis: true,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability Declaration Temporal Applicability Basis composition.
 * Preserves GROUND-050 AttentionCandidate / Observer / Requirement / Declaration order.
 */
export function buildAttentionObservationCapabilityDeclarationTemporalApplicabilitySet(
  input: AttentionObservationCapabilityDeclarationTemporalApplicabilityInput
): AttentionObservationCapabilityDeclarationTemporalApplicabilitySetAssessment {
  assertCompatibleCapabilityTemporalApplicabilitySiblingContexts(
    input.capability_declaration_match_set,
    input.capability_temporal_requirement_set
  );

  const candidate_assessments =
    input.capability_declaration_match_set.candidate_assessments.map(
      (declarationMatchAssessment, index) =>
        assessAttentionCandidateObservationCapabilityTemporalApplicability(
          declarationMatchAssessment,
          input.capability_temporal_requirement_set.candidate_assessments[index]
        )
    );

  return {
    capability_declaration_match_set: input.capability_declaration_match_set,
    capability_temporal_requirement_set:
      input.capability_temporal_requirement_set,
    candidate_assessments,
    has_capability_declaration_temporal_relation_basis:
      candidate_assessments.some(
        (c) => c.has_capability_declaration_temporal_relation_basis
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  };
}
