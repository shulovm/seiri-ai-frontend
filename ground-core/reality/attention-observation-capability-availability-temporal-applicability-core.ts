/**
 * Reality Core v0.7 — Attention Observation Capability Availability Temporal
 * Applicability (GROUND-059).
 *
 * Pure composition of GROUND-052 Capability Availability Basis
 * + GROUND-056 Explicit Capability Temporal Requirement.
 *
 * Derives only canonical half-open interval relations for each exact
 * CapabilityAvailabilityDeclaration interval vs required window:
 *   FULL_REQUIRED_WINDOW_COVERAGE
 *   PARTIAL_REQUIRED_WINDOW_OVERLAP
 *   NO_REQUIRED_WINDOW_OVERLAP
 *
 * Raw AVAILABLE / UNAVAILABLE polarity is preserved orthogonally.
 * temporal coverage ≠ Availability polarity ≠ effective Availability /
 * satisfaction / Resource readiness / can_execute.
 *
 * Sibling of GROUND-057 / GROUND-058.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, GROUND-051, GROUND-053–055, GROUND-057–058, Permission,
 * Authority, Resource, Commitment, isCapability*ActiveAt for relation derivation.
 */

import type {
  AttentionCandidateObservationCapabilityTemporalRequirementAssessment,
  AttentionObservationCapabilityRequirementTemporalAssessment,
  AttentionObservationCapabilityTemporalRequirement,
  AttentionObservationCapabilityTemporalRequirementSetAssessment,
  AttentionObservationRequiredCapabilityTemporalWindow,
} from "./attention-observation-capability-temporal-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityAvailabilityAssessment,
  AttentionObservationCapabilityAvailabilityLink,
  AttentionObservationCapabilityAvailabilitySetAssessment,
  AttentionObservationCapabilityDeclarationAvailabilityPosition,
  AttentionObservationCapabilityRequirementAvailabilityPosition,
} from "./attention-observation-capability-availability-types.js";
import type {
  AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilityBasis,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilityInput,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilityModelLimitation,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilitySetAssessment,
  AttentionObservationCapabilityAvailabilityTemporalApplicabilityStatus,
  AttentionObservationCapabilityAvailabilityTemporalRelation,
  AttentionObservationCapabilityAvailabilityValidityWindow,
  AttentionObservationCapabilityDeclarationAvailabilityTemporalPosition,
  AttentionObservationCapabilityRequirementAvailabilityTemporalPosition,
  AttentionObservationObserverCapabilityAvailabilityTemporalBasis,
} from "./attention-observation-capability-availability-temporal-applicability-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS: AttentionObservationCapabilityAvailabilityTemporalApplicabilityModelLimitation[] =
  [
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_TEMPORAL_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_RECENCY_POLICY_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_AUTHORITY_POLICY_NOT_MODELED",
    "CROSS_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CROSS_DECLARATION_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CROSS_OBSERVER_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CAPABILITY_DECLARATION_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CAPABILITY_VERIFICATION_AVAILABILITY_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_TEMPORAL_INTERSECTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
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
  "Capability Availability set and Capability Temporal Requirement set do not share the same Capability Requirement context";

export function attentionObservationCapabilityAvailabilityTemporalApplicabilityBasisKey(
  capabilityRequirementKey: string,
  capabilityTemporalRequirementKey: string,
  capabilityDeclarationId: string,
  capabilityAvailabilityDeclarationId: string
): string {
  return [
    "attention-observation-capability-availability-temporal-applicability-basis",
    capabilityRequirementKey,
    capabilityTemporalRequirementKey,
    capabilityDeclarationId,
    capabilityAvailabilityDeclarationId,
  ].join("|");
}

export function attentionObservationCapabilityAvailabilityTemporalApplicabilityPositionKey(
  capabilityAvailabilityLinkKey: string,
  capabilityTemporalRequirementKey: string
): string {
  return [
    "attention-observation-capability-availability-temporal-applicability-position",
    capabilityAvailabilityLinkKey,
    capabilityTemporalRequirementKey,
  ].join("|");
}

/**
 * Pure analytical half-open interval relation for Availability validity.
 *
 * R = [r0, r1)   r1 null → +∞
 * A = [a0, a1)   a1 null → +∞
 *
 * Classifier depends only on interval endpoints — not raw AVAILABLE/UNAVAILABLE.
 * No point sampling. No fake infinity timestamps. No wall-clock.
 */
export function classifyRequiredWindowAgainstCapabilityAvailabilityInterval(
  requiredWindow: AttentionObservationRequiredCapabilityTemporalWindow,
  availabilityWindow: AttentionObservationCapabilityAvailabilityValidityWindow
): AttentionObservationCapabilityAvailabilityTemporalRelation {
  const r0 = requiredWindow.required_from;
  const r1 = requiredWindow.required_until;
  const a0 = availabilityWindow.valid_from;
  const a1 = availabilityWindow.valid_until;

  if (availabilityFullyCoversRequired(r0, r1, a0, a1)) {
    return "FULL_REQUIRED_WINDOW_COVERAGE";
  }
  if (halfOpenIntervalsOverlap(r0, r1, a0, a1)) {
    return "PARTIAL_REQUIRED_WINDOW_OVERLAP";
  }
  return "NO_REQUIRED_WINDOW_OVERLAP";
}

function availabilityFullyCoversRequired(
  r0: string,
  r1: string | null,
  a0: string,
  a1: string | null
): boolean {
  if (a0 > r0) {
    return false;
  }
  if (r1 === null) {
    return a1 === null;
  }
  return a1 === null || a1 >= r1;
}

function halfOpenIntervalsOverlap(
  r0: string,
  r1: string | null,
  a0: string,
  a1: string | null
): boolean {
  const a0BeforeR1 = r1 === null || a0 < r1;
  const r0BeforeA1 = a1 === null || r0 < a1;
  return a0BeforeR1 && r0BeforeA1;
}

/**
 * Validates 052/056 sibling sets share the same Capability Requirement context
 * via canonical AttentionCandidate / CapabilityRequirement keys — not object identity.
 */
export function assertCompatibleCapabilityAvailabilityTemporalApplicabilitySiblingContexts(
  availabilitySet: AttentionObservationCapabilityAvailabilitySetAssessment,
  temporalRequirementSet: AttentionObservationCapabilityTemporalRequirementSetAssessment
): void {
  const matchReqSet =
    availabilitySet.capability_declaration_match_set.capability_requirement_set;
  const temporalReqSet = temporalRequirementSet.capability_requirement_set;

  const availabilityCandidates = availabilitySet.candidate_assessments;
  const temporalCandidates = temporalRequirementSet.candidate_assessments;

  if (availabilityCandidates.length !== temporalCandidates.length) {
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

  for (let i = 0; i < availabilityCandidates.length; i++) {
    const availabilityCandidate = availabilityCandidates[i];
    const temporalCandidate = temporalCandidates[i];

    if (
      availabilityCandidate.candidate_key !== temporalCandidate.candidate_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch at index ${i} (${availabilityCandidate.candidate_key} vs ${temporalCandidate.candidate_key})`
      );
    }

    const matchReqAssessment = matchReqSet.candidate_requirements[i];
    const temporalReqAssessment = temporalReqSet.candidate_requirements[i];

    if (
      matchReqAssessment.candidate_key !==
        temporalReqAssessment.candidate_key ||
      matchReqAssessment.candidate_key !== availabilityCandidate.candidate_key
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
        `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for AttentionCandidate ${availabilityCandidate.candidate_key}`
      );
    }

    const matchRequirements =
      matchReqAssessment.capability_requirement_basis?.requirements ?? [];
    const temporalRequirements =
      temporalReqAssessment.capability_requirement_basis?.requirements ?? [];

    if (matchRequirements.length !== temporalRequirements.length) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement count mismatch for AttentionCandidate ${availabilityCandidate.candidate_key}`
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
        `${CONTEXT_MISMATCH_PREFIX}: Temporal Requirement assessment count mismatch for AttentionCandidate ${availabilityCandidate.candidate_key}`
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
  availabilityLink: AttentionObservationCapabilityAvailabilityLink,
  temporalRequirement: AttentionObservationCapabilityTemporalRequirement,
  relation: AttentionObservationCapabilityAvailabilityTemporalRelation
): AttentionObservationCapabilityAvailabilityTemporalApplicabilityBasis {
  const declaration = availabilityLink.capability_availability_declaration;
  const availability_window: AttentionObservationCapabilityAvailabilityValidityWindow =
    {
      valid_from: declaration.valid_from,
      valid_until: declaration.valid_until,
    };

  return {
    key: attentionObservationCapabilityAvailabilityTemporalApplicabilityBasisKey(
      availabilityLink.capability_requirement_key,
      temporalRequirement.key,
      availabilityLink.capability_declaration_id,
      availabilityLink.capability_availability_declaration_id
    ),
    observation_need_key: availabilityLink.observation_need_key,
    attention_candidate_key: availabilityLink.attention_candidate_key,
    observer_candidate_key: availabilityLink.observer_candidate_key,
    observer_entity_id: availabilityLink.observer_entity_id,
    capability_requirement_key: availabilityLink.capability_requirement_key,
    capability_semantic_key: availabilityLink.capability_semantic_key,
    capability_temporal_requirement_key: temporalRequirement.key,
    capability_declaration_id: availabilityLink.capability_declaration_id,
    capability_availability_link_key: availabilityLink.key,
    capability_availability_declaration_id:
      availabilityLink.capability_availability_declaration_id,
    relation,
    raw_availability_status: declaration.status,
    required_window: {
      required_from: temporalRequirement.required_window.required_from,
      required_until: temporalRequirement.required_window.required_until,
    },
    availability_window,
  };
}

function buildAvailabilityTemporalPosition(
  availabilityLink: AttentionObservationCapabilityAvailabilityLink,
  temporalRequirement: AttentionObservationCapabilityTemporalRequirement
): AttentionObservationCapabilityAvailabilityTemporalApplicabilityPosition {
  const declaration = availabilityLink.capability_availability_declaration;
  const availability_window: AttentionObservationCapabilityAvailabilityValidityWindow =
    {
      valid_from: declaration.valid_from,
      valid_until: declaration.valid_until,
    };

  const relation = classifyRequiredWindowAgainstCapabilityAvailabilityInterval(
    temporalRequirement.required_window,
    availability_window
  );

  return {
    key: attentionObservationCapabilityAvailabilityTemporalApplicabilityPositionKey(
      availabilityLink.key,
      temporalRequirement.key
    ),
    capability_availability_link: availabilityLink,
    capability_temporal_requirement: temporalRequirement,
    relation,
    applicability_basis: buildApplicabilityBasis(
      availabilityLink,
      temporalRequirement,
      relation
    ),
  };
}

function buildDeclarationAvailabilityTemporalPosition(
  declarationAvailabilityPosition: AttentionObservationCapabilityDeclarationAvailabilityPosition,
  temporalRequirement: AttentionObservationCapabilityTemporalRequirement
): AttentionObservationCapabilityDeclarationAvailabilityTemporalPosition {
  return {
    capability_declaration_match:
      declarationAvailabilityPosition.capability_declaration_match,
    capability_declaration_availability_position:
      declarationAvailabilityPosition,
    availability_temporal_positions:
      declarationAvailabilityPosition.availability_links.map((link) =>
        buildAvailabilityTemporalPosition(link, temporalRequirement)
      ),
  };
}

function buildRequirementAvailabilityTemporalPosition(
  requirementAvailabilityPosition: AttentionObservationCapabilityRequirementAvailabilityPosition,
  temporalRequirementAssessment: AttentionObservationCapabilityRequirementTemporalAssessment
): AttentionObservationCapabilityRequirementAvailabilityTemporalPosition {
  const temporalRequirement =
    temporalRequirementAssessment.temporal_requirement_basis
      .temporal_requirement;

  if (
    temporalRequirementAssessment.status !==
      "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT" ||
    temporalRequirement === null
  ) {
    return {
      capability_requirement:
        requirementAvailabilityPosition.capability_requirement_match_position
          .capability_requirement,
      temporal_requirement_assessment: temporalRequirementAssessment,
      declaration_availability_temporal_positions: [],
    };
  }

  return {
    capability_requirement:
      requirementAvailabilityPosition.capability_requirement_match_position
        .capability_requirement,
    temporal_requirement_assessment: temporalRequirementAssessment,
    declaration_availability_temporal_positions:
      requirementAvailabilityPosition.declaration_availability_positions.map(
        (declarationAvailabilityPosition) =>
          buildDeclarationAvailabilityTemporalPosition(
            declarationAvailabilityPosition,
            temporalRequirement
          )
      ),
  };
}

function mapAvailabilityUpstreamNotApplicable(
  availabilityStatus: AttentionCandidateObservationCapabilityAvailabilityAssessment["status"]
): AttentionObservationCapabilityAvailabilityTemporalApplicabilityStatus | null {
  switch (availabilityStatus) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES":
      return "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES";
    case "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS":
      return "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS";
    case "NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED":
      return "NOT_APPLICABLE_NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED";
    case "CAPABILITY_AVAILABILITY_DECLARATIONS_PRESENT":
      return null;
  }
}

/**
 * Pure per-AttentionCandidate Availability Temporal Applicability assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS
 * 5. NOT_APPLICABLE_NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED
 * 6. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS
 * 7. NO_CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_REPRESENTED
 * 8. CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityAvailabilityTemporalApplicability(
  availabilityAssessment: AttentionCandidateObservationCapabilityAvailabilityAssessment,
  temporalRequirementAssessment: AttentionCandidateObservationCapabilityTemporalRequirementAssessment
): AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment {
  const candidate_key = availabilityAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityAvailabilityTemporalApplicabilityStatus
  ): AttentionCandidateObservationCapabilityAvailabilityTemporalApplicabilityAssessment => ({
    candidate_key,
    capability_availability_assessment: availabilityAssessment,
    capability_temporal_requirement_assessment: temporalRequirementAssessment,
    status,
    observer_availability_temporal_bases: [],
    has_capability_availability_temporal_relation_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  });

  const upstreamStatus = mapAvailabilityUpstreamNotApplicable(
    availabilityAssessment.status
  );
  if (upstreamStatus !== null) {
    return notApplicable(upstreamStatus);
  }

  const temporalByRequirementKey = new Map(
    temporalRequirementAssessment.requirement_temporal_assessments.map(
      (assessment) => [assessment.capability_requirement.key, assessment]
    )
  );

  const observer_availability_temporal_bases: AttentionObservationObserverCapabilityAvailabilityTemporalBasis[] =
    availabilityAssessment.observer_availability_bases.map((basis) => ({
      observation_need_key: basis.observation_need_key,
      observer_candidate: basis.observer_candidate,
      requirement_availability_temporal_positions:
        basis.requirement_availability_positions.map(
          (requirementAvailabilityPosition) => {
            const reqKey =
              requirementAvailabilityPosition
                .capability_requirement_match_position.capability_requirement
                .key;
            const temporalAssessment = temporalByRequirementKey.get(reqKey);
            if (!temporalAssessment) {
              throw new Error(
                `${CONTEXT_MISMATCH_PREFIX}: missing Temporal Requirement assessment for CapabilityRequirement ${reqKey}`
              );
            }
            return buildRequirementAvailabilityTemporalPosition(
              requirementAvailabilityPosition,
              temporalAssessment
            );
          }
        ),
    }));

  const evaluatedPositions = observer_availability_temporal_bases.flatMap(
    (basis) =>
      basis.requirement_availability_temporal_positions.flatMap((reqPos) =>
        reqPos.declaration_availability_temporal_positions.flatMap(
          (declPos) => declPos.availability_temporal_positions
        )
      )
  );

  if (evaluatedPositions.length > 0) {
    return {
      candidate_key,
      capability_availability_assessment: availabilityAssessment,
      capability_temporal_requirement_assessment: temporalRequirementAssessment,
      status: "CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_PRESENT",
      observer_availability_temporal_bases,
      has_capability_availability_temporal_relation_basis: true,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
      ],
    };
  }

  const hasExplicitTemporalSomewhere =
    temporalRequirementAssessment.has_explicit_capability_temporal_requirements ||
    temporalRequirementAssessment.status ===
      "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_PRESENT";

  if (!hasExplicitTemporalSomewhere) {
    return {
      candidate_key,
      capability_availability_assessment: availabilityAssessment,
      capability_temporal_requirement_assessment: temporalRequirementAssessment,
      status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS",
      observer_availability_temporal_bases,
      has_capability_availability_temporal_relation_basis: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
      ],
    };
  }

  return {
    candidate_key,
    capability_availability_assessment: availabilityAssessment,
    capability_temporal_requirement_assessment: temporalRequirementAssessment,
    status: "NO_CAPABILITY_AVAILABILITY_TEMPORAL_RELATION_BASIS_REPRESENTED",
    observer_availability_temporal_bases,
    has_capability_availability_temporal_relation_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability Availability Temporal Applicability Basis composition.
 * Preserves GROUND-052 Candidate / Observer / Requirement / Declaration / Availability order.
 */
export function buildAttentionObservationCapabilityAvailabilityTemporalApplicabilitySet(
  input: AttentionObservationCapabilityAvailabilityTemporalApplicabilityInput
): AttentionObservationCapabilityAvailabilityTemporalApplicabilitySetAssessment {
  assertCompatibleCapabilityAvailabilityTemporalApplicabilitySiblingContexts(
    input.capability_availability_set,
    input.capability_temporal_requirement_set
  );

  const candidate_assessments =
    input.capability_availability_set.candidate_assessments.map(
      (availabilityAssessment, index) =>
        assessAttentionCandidateObservationCapabilityAvailabilityTemporalApplicability(
          availabilityAssessment,
          input.capability_temporal_requirement_set.candidate_assessments[index]
        )
    );

  return {
    capability_availability_set: input.capability_availability_set,
    capability_temporal_requirement_set:
      input.capability_temporal_requirement_set,
    candidate_assessments,
    has_capability_availability_temporal_relation_basis:
      candidate_assessments.some(
        (c) => c.has_capability_availability_temporal_relation_basis
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  };
}
