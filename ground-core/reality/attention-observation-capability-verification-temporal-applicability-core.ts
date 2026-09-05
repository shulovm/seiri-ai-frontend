/**
 * Reality Core v0.7 — Attention Observation Capability Verification Temporal
 * Applicability (GROUND-058).
 *
 * Pure composition of GROUND-051 Capability Verification Basis
 * + GROUND-056 Explicit Capability Temporal Requirement.
 *
 * Derives only canonical half-open interval relations for each exact
 * CapabilityVerificationDeclaration validity interval vs required window:
 *   FULL_REQUIRED_WINDOW_COVERAGE
 *   PARTIAL_REQUIRED_WINDOW_OVERLAP
 *   NO_REQUIRED_WINDOW_OVERLAP
 *
 * Sibling of GROUND-057 Declaration Temporal Applicability.
 * No truth / PROVEN / effective Verification / satisfaction / ActiveAt /
 * wall-clock / Availability / Declaration-interval comparison / can_execute.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, GROUND-052–055, GROUND-057, Permission, Authority, Resource,
 * Commitment, isCapability*ActiveAt for relation derivation.
 */

import type {
  AttentionCandidateObservationCapabilityTemporalRequirementAssessment,
  AttentionObservationCapabilityRequirementTemporalAssessment,
  AttentionObservationCapabilityTemporalRequirement,
  AttentionObservationCapabilityTemporalRequirementSetAssessment,
  AttentionObservationRequiredCapabilityTemporalWindow,
} from "./attention-observation-capability-temporal-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityVerificationAssessment,
  AttentionObservationCapabilityDeclarationVerificationPosition,
  AttentionObservationCapabilityRequirementVerificationPosition,
  AttentionObservationCapabilityVerificationLink,
  AttentionObservationCapabilityVerificationSetAssessment,
} from "./attention-observation-capability-verification-types.js";
import type {
  AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment,
  AttentionObservationCapabilityDeclarationVerificationTemporalPosition,
  AttentionObservationCapabilityRequirementVerificationTemporalPosition,
  AttentionObservationCapabilityVerificationTemporalApplicabilityBasis,
  AttentionObservationCapabilityVerificationTemporalApplicabilityInput,
  AttentionObservationCapabilityVerificationTemporalApplicabilityModelLimitation,
  AttentionObservationCapabilityVerificationTemporalApplicabilityPosition,
  AttentionObservationCapabilityVerificationTemporalApplicabilitySetAssessment,
  AttentionObservationCapabilityVerificationTemporalApplicabilityStatus,
  AttentionObservationCapabilityVerificationTemporalRelation,
  AttentionObservationCapabilityVerificationValidityWindow,
  AttentionObservationObserverCapabilityVerificationTemporalBasis,
} from "./attention-observation-capability-verification-temporal-applicability-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS: AttentionObservationCapabilityVerificationTemporalApplicabilityModelLimitation[] =
  [
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_VERIFICATION_TEMPORAL_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_VERIFICATION_RECENCY_POLICY_NOT_MODELED",
    "CAPABILITY_VERIFICATION_AUTHORITY_POLICY_NOT_MODELED",
    "CROSS_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CROSS_DECLARATION_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CROSS_OBSERVER_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CAPABILITY_DECLARATION_VERIFICATION_TEMPORAL_COMPOSITION_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_TEMPORAL_INTERSECTION_NOT_MODELED",
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
  "Capability Verification set and Capability Temporal Requirement set do not share the same Capability Requirement context";

export function attentionObservationCapabilityVerificationTemporalApplicabilityBasisKey(
  capabilityRequirementKey: string,
  capabilityTemporalRequirementKey: string,
  capabilityDeclarationId: string,
  capabilityVerificationDeclarationId: string
): string {
  return [
    "attention-observation-capability-verification-temporal-applicability-basis",
    capabilityRequirementKey,
    capabilityTemporalRequirementKey,
    capabilityDeclarationId,
    capabilityVerificationDeclarationId,
  ].join("|");
}

export function attentionObservationCapabilityVerificationTemporalApplicabilityPositionKey(
  capabilityVerificationLinkKey: string,
  capabilityTemporalRequirementKey: string
): string {
  return [
    "attention-observation-capability-verification-temporal-applicability-position",
    capabilityVerificationLinkKey,
    capabilityTemporalRequirementKey,
  ].join("|");
}

/**
 * Pure analytical half-open interval relation for Verification validity.
 *
 * R = [r0, r1)   r1 null → +∞
 * V = [v0, v1)   v1 null → +∞  (v0 = verified_at)
 *
 * No point sampling. No fake infinity timestamps. No wall-clock.
 * Independent of CapabilityDeclaration validity (GROUND-057).
 */
export function classifyRequiredWindowAgainstCapabilityVerificationValidity(
  requiredWindow: AttentionObservationRequiredCapabilityTemporalWindow,
  verificationWindow: AttentionObservationCapabilityVerificationValidityWindow
): AttentionObservationCapabilityVerificationTemporalRelation {
  const r0 = requiredWindow.required_from;
  const r1 = requiredWindow.required_until;
  const v0 = verificationWindow.verified_at;
  const v1 = verificationWindow.valid_until;

  if (verificationFullyCoversRequired(r0, r1, v0, v1)) {
    return "FULL_REQUIRED_WINDOW_COVERAGE";
  }
  if (halfOpenIntervalsOverlap(r0, r1, v0, v1)) {
    return "PARTIAL_REQUIRED_WINDOW_OVERLAP";
  }
  return "NO_REQUIRED_WINDOW_OVERLAP";
}

function verificationFullyCoversRequired(
  r0: string,
  r1: string | null,
  v0: string,
  v1: string | null
): boolean {
  if (v0 > r0) {
    return false;
  }
  if (r1 === null) {
    return v1 === null;
  }
  return v1 === null || v1 >= r1;
}

function halfOpenIntervalsOverlap(
  r0: string,
  r1: string | null,
  v0: string,
  v1: string | null
): boolean {
  const v0BeforeR1 = r1 === null || v0 < r1;
  const r0BeforeV1 = v1 === null || r0 < v1;
  return v0BeforeR1 && r0BeforeV1;
}

/**
 * Validates 051/056 sibling sets share the same Capability Requirement context
 * via canonical AttentionCandidate / CapabilityRequirement keys — not object identity.
 */
export function assertCompatibleCapabilityVerificationTemporalApplicabilitySiblingContexts(
  verificationSet: AttentionObservationCapabilityVerificationSetAssessment,
  temporalRequirementSet: AttentionObservationCapabilityTemporalRequirementSetAssessment
): void {
  const matchReqSet =
    verificationSet.capability_declaration_match_set.capability_requirement_set;
  const temporalReqSet = temporalRequirementSet.capability_requirement_set;

  const verificationCandidates = verificationSet.candidate_assessments;
  const temporalCandidates = temporalRequirementSet.candidate_assessments;

  if (verificationCandidates.length !== temporalCandidates.length) {
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

  for (let i = 0; i < verificationCandidates.length; i++) {
    const verificationCandidate = verificationCandidates[i];
    const temporalCandidate = temporalCandidates[i];

    if (
      verificationCandidate.candidate_key !== temporalCandidate.candidate_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch at index ${i} (${verificationCandidate.candidate_key} vs ${temporalCandidate.candidate_key})`
      );
    }

    const matchReqAssessment = matchReqSet.candidate_requirements[i];
    const temporalReqAssessment = temporalReqSet.candidate_requirements[i];

    if (
      matchReqAssessment.candidate_key !==
        temporalReqAssessment.candidate_key ||
      matchReqAssessment.candidate_key !== verificationCandidate.candidate_key
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
        `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for AttentionCandidate ${verificationCandidate.candidate_key}`
      );
    }

    const matchRequirements =
      matchReqAssessment.capability_requirement_basis?.requirements ?? [];
    const temporalRequirements =
      temporalReqAssessment.capability_requirement_basis?.requirements ?? [];

    if (matchRequirements.length !== temporalRequirements.length) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement count mismatch for AttentionCandidate ${verificationCandidate.candidate_key}`
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
        `${CONTEXT_MISMATCH_PREFIX}: Temporal Requirement assessment count mismatch for AttentionCandidate ${verificationCandidate.candidate_key}`
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
  verificationLink: AttentionObservationCapabilityVerificationLink,
  temporalRequirement: AttentionObservationCapabilityTemporalRequirement,
  relation: AttentionObservationCapabilityVerificationTemporalRelation
): AttentionObservationCapabilityVerificationTemporalApplicabilityBasis {
  const verification_window: AttentionObservationCapabilityVerificationValidityWindow =
    {
      verified_at:
        verificationLink.capability_verification_declaration.verified_at,
      valid_until:
        verificationLink.capability_verification_declaration.valid_until,
    };

  return {
    key: attentionObservationCapabilityVerificationTemporalApplicabilityBasisKey(
      verificationLink.capability_requirement_key,
      temporalRequirement.key,
      verificationLink.capability_declaration_id,
      verificationLink.capability_verification_declaration_id
    ),
    observation_need_key: verificationLink.observation_need_key,
    attention_candidate_key: verificationLink.attention_candidate_key,
    observer_candidate_key: verificationLink.observer_candidate_key,
    observer_entity_id: verificationLink.observer_entity_id,
    capability_requirement_key: verificationLink.capability_requirement_key,
    capability_semantic_key: verificationLink.capability_semantic_key,
    capability_temporal_requirement_key: temporalRequirement.key,
    capability_declaration_id: verificationLink.capability_declaration_id,
    capability_verification_link_key: verificationLink.key,
    capability_verification_declaration_id:
      verificationLink.capability_verification_declaration_id,
    relation,
    required_window: {
      required_from: temporalRequirement.required_window.required_from,
      required_until: temporalRequirement.required_window.required_until,
    },
    verification_window,
  };
}

function buildVerificationTemporalPosition(
  verificationLink: AttentionObservationCapabilityVerificationLink,
  temporalRequirement: AttentionObservationCapabilityTemporalRequirement
): AttentionObservationCapabilityVerificationTemporalApplicabilityPosition {
  const verification_window: AttentionObservationCapabilityVerificationValidityWindow =
    {
      verified_at:
        verificationLink.capability_verification_declaration.verified_at,
      valid_until:
        verificationLink.capability_verification_declaration.valid_until,
    };

  const relation = classifyRequiredWindowAgainstCapabilityVerificationValidity(
    temporalRequirement.required_window,
    verification_window
  );

  return {
    key: attentionObservationCapabilityVerificationTemporalApplicabilityPositionKey(
      verificationLink.key,
      temporalRequirement.key
    ),
    capability_verification_link: verificationLink,
    capability_temporal_requirement: temporalRequirement,
    relation,
    applicability_basis: buildApplicabilityBasis(
      verificationLink,
      temporalRequirement,
      relation
    ),
  };
}

function buildDeclarationVerificationTemporalPosition(
  declarationVerificationPosition: AttentionObservationCapabilityDeclarationVerificationPosition,
  temporalRequirement: AttentionObservationCapabilityTemporalRequirement
): AttentionObservationCapabilityDeclarationVerificationTemporalPosition {
  return {
    capability_declaration_match:
      declarationVerificationPosition.capability_declaration_match,
    capability_declaration_verification_position:
      declarationVerificationPosition,
    verification_temporal_positions:
      declarationVerificationPosition.verification_links.map((link) =>
        buildVerificationTemporalPosition(link, temporalRequirement)
      ),
  };
}

function buildRequirementVerificationTemporalPosition(
  requirementVerificationPosition: AttentionObservationCapabilityRequirementVerificationPosition,
  temporalRequirementAssessment: AttentionObservationCapabilityRequirementTemporalAssessment
): AttentionObservationCapabilityRequirementVerificationTemporalPosition {
  const temporalRequirement =
    temporalRequirementAssessment.temporal_requirement_basis
      .temporal_requirement;

  // No explicit Temporal Requirement → no Verification temporal positions.
  if (
    temporalRequirementAssessment.status !==
      "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT" ||
    temporalRequirement === null
  ) {
    return {
      capability_requirement:
        requirementVerificationPosition.capability_requirement_match_position
          .capability_requirement,
      temporal_requirement_assessment: temporalRequirementAssessment,
      declaration_verification_temporal_positions: [],
    };
  }

  return {
    capability_requirement:
      requirementVerificationPosition.capability_requirement_match_position
        .capability_requirement,
    temporal_requirement_assessment: temporalRequirementAssessment,
    declaration_verification_temporal_positions:
      requirementVerificationPosition.declaration_verification_positions.map(
        (declarationVerificationPosition) =>
          buildDeclarationVerificationTemporalPosition(
            declarationVerificationPosition,
            temporalRequirement
          )
      ),
  };
}

function mapVerificationUpstreamNotApplicable(
  verificationStatus: AttentionCandidateObservationCapabilityVerificationAssessment["status"]
): AttentionObservationCapabilityVerificationTemporalApplicabilityStatus | null {
  switch (verificationStatus) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES":
      return "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES";
    case "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS":
      return "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS";
    case "NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED":
      return "NOT_APPLICABLE_NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED";
    case "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT":
      return null;
  }
}

/**
 * Pure per-AttentionCandidate Verification Temporal Applicability assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS
 * 5. NOT_APPLICABLE_NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED
 * 6. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS
 * 7. NO_CAPABILITY_VERIFICATION_TEMPORAL_RELATION_BASIS_REPRESENTED
 * 8. CAPABILITY_VERIFICATION_TEMPORAL_RELATION_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityVerificationTemporalApplicability(
  verificationAssessment: AttentionCandidateObservationCapabilityVerificationAssessment,
  temporalRequirementAssessment: AttentionCandidateObservationCapabilityTemporalRequirementAssessment
): AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment {
  const candidate_key = verificationAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityVerificationTemporalApplicabilityStatus
  ): AttentionCandidateObservationCapabilityVerificationTemporalApplicabilityAssessment => ({
    candidate_key,
    capability_verification_assessment: verificationAssessment,
    capability_temporal_requirement_assessment: temporalRequirementAssessment,
    status,
    observer_verification_temporal_bases: [],
    has_capability_verification_temporal_relation_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  });

  const upstreamStatus = mapVerificationUpstreamNotApplicable(
    verificationAssessment.status
  );
  if (upstreamStatus !== null) {
    return notApplicable(upstreamStatus);
  }

  const temporalByRequirementKey = new Map(
    temporalRequirementAssessment.requirement_temporal_assessments.map(
      (assessment) => [assessment.capability_requirement.key, assessment]
    )
  );

  const observer_verification_temporal_bases: AttentionObservationObserverCapabilityVerificationTemporalBasis[] =
    verificationAssessment.observer_verification_bases.map((basis) => ({
      observation_need_key: basis.observation_need_key,
      observer_candidate: basis.observer_candidate,
      requirement_verification_temporal_positions:
        basis.requirement_verification_positions.map(
          (requirementVerificationPosition) => {
            const reqKey =
              requirementVerificationPosition
                .capability_requirement_match_position.capability_requirement
                .key;
            const temporalAssessment = temporalByRequirementKey.get(reqKey);
            if (!temporalAssessment) {
              throw new Error(
                `${CONTEXT_MISMATCH_PREFIX}: missing Temporal Requirement assessment for CapabilityRequirement ${reqKey}`
              );
            }
            return buildRequirementVerificationTemporalPosition(
              requirementVerificationPosition,
              temporalAssessment
            );
          }
        ),
    }));

  const evaluatedPositions = observer_verification_temporal_bases.flatMap(
    (basis) =>
      basis.requirement_verification_temporal_positions.flatMap((reqPos) =>
        reqPos.declaration_verification_temporal_positions.flatMap(
          (declPos) => declPos.verification_temporal_positions
        )
      )
  );

  if (evaluatedPositions.length > 0) {
    return {
      candidate_key,
      capability_verification_assessment: verificationAssessment,
      capability_temporal_requirement_assessment: temporalRequirementAssessment,
      status: "CAPABILITY_VERIFICATION_TEMPORAL_RELATION_BASIS_PRESENT",
      observer_verification_temporal_bases,
      has_capability_verification_temporal_relation_basis: true,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
      ],
    };
  }

  // No exact Verification × Temporal Requirement pairs.
  // Distinguish: no temporal requirements at all vs disjoint existential presence.
  const hasExplicitTemporalSomewhere =
    temporalRequirementAssessment.has_explicit_capability_temporal_requirements ||
    temporalRequirementAssessment.status ===
      "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_PRESENT";

  if (!hasExplicitTemporalSomewhere) {
    return {
      candidate_key,
      capability_verification_assessment: verificationAssessment,
      capability_temporal_requirement_assessment: temporalRequirementAssessment,
      status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS",
      observer_verification_temporal_bases,
      has_capability_verification_temporal_relation_basis: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
      ],
    };
  }

  return {
    candidate_key,
    capability_verification_assessment: verificationAssessment,
    capability_temporal_requirement_assessment: temporalRequirementAssessment,
    status: "NO_CAPABILITY_VERIFICATION_TEMPORAL_RELATION_BASIS_REPRESENTED",
    observer_verification_temporal_bases,
    has_capability_verification_temporal_relation_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability Verification Temporal Applicability Basis composition.
 * Preserves GROUND-051 Candidate / Observer / Requirement / Declaration / Verification order.
 */
export function buildAttentionObservationCapabilityVerificationTemporalApplicabilitySet(
  input: AttentionObservationCapabilityVerificationTemporalApplicabilityInput
): AttentionObservationCapabilityVerificationTemporalApplicabilitySetAssessment {
  assertCompatibleCapabilityVerificationTemporalApplicabilitySiblingContexts(
    input.capability_verification_set,
    input.capability_temporal_requirement_set
  );

  const candidate_assessments =
    input.capability_verification_set.candidate_assessments.map(
      (verificationAssessment, index) =>
        assessAttentionCandidateObservationCapabilityVerificationTemporalApplicability(
          verificationAssessment,
          input.capability_temporal_requirement_set.candidate_assessments[index]
        )
    );

  return {
    capability_verification_set: input.capability_verification_set,
    capability_temporal_requirement_set:
      input.capability_temporal_requirement_set,
    candidate_assessments,
    has_capability_verification_temporal_relation_basis:
      candidate_assessments.some(
        (c) => c.has_capability_verification_temporal_relation_basis
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_MODEL_LIMITATIONS,
    ],
  };
}
