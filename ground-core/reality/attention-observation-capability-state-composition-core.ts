/**
 * Reality Core v0.7 — Attention Observation Capability State Composition (GROUND-053).
 *
 * Pure composition of GROUND-051 Verification Basis + GROUND-052 Availability Basis.
 *
 * Composition ≠ resolution / effective Capability state / current Availability /
 * Requirement satisfaction / Permission / Resource readiness / can_execute.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, capability-core active/effective helpers, Permission, Authority,
 * Resource, Commitment assessment APIs.
 *
 * Join at exact CapabilityDeclarationMatch.key / CapabilityDeclaration.id.
 * No Verification × Availability Cartesian product.
 */

import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatchSetAssessment,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionCandidateObservationCapabilityAvailabilityAssessment,
  AttentionObservationCapabilityAvailabilitySetAssessment,
  AttentionObservationCapabilityDeclarationAvailabilityPosition,
  AttentionObservationCapabilityRequirementAvailabilityPosition,
} from "./attention-observation-capability-availability-types.js";
import type {
  AttentionCandidateObservationCapabilityVerificationAssessment,
  AttentionObservationCapabilityDeclarationVerificationPosition,
  AttentionObservationCapabilityRequirementVerificationPosition,
  AttentionObservationCapabilityVerificationSetAssessment,
} from "./attention-observation-capability-verification-types.js";
import type {
  AttentionCandidateObservationCapabilityStateCompositionAssessment,
  AttentionObservationCapabilityDeclarationCompositionStatus,
  AttentionObservationCapabilityDeclarationStateCompositionPosition,
  AttentionObservationCapabilityRequirementStateCompositionPosition,
  AttentionObservationCapabilityStateCompositionInput,
  AttentionObservationCapabilityStateCompositionModelLimitation,
  AttentionObservationCapabilityStateCompositionSetAssessment,
  AttentionObservationCapabilityStateCompositionStatus,
  AttentionObservationObserverCapabilityStateCompositionBasis,
} from "./attention-observation-capability-state-composition-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_STATE_COMPOSITION_MODEL_LIMITATIONS: AttentionObservationCapabilityStateCompositionModelLimitation[] =
  [
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_VERIFICATION_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_VERIFICATION_RECENCY_POLICY_NOT_MODELED",
    "CAPABILITY_VERIFICATION_AUTHORITY_POLICY_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_RECENCY_POLICY_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_AUTHORITY_POLICY_NOT_MODELED",
    "CAPABILITY_SCOPE_REQUIREMENT_NOT_MODELED",
    "CAPABILITY_SCOPE_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_INHERITANCE_NOT_MODELED",
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
    "OBSERVATION_VALUE_NOT_MODELED",
    "INFORMATION_GAIN_NOT_MODELED",
    "VALUE_OF_INFORMATION_NOT_MODELED",
    "OBSERVATION_COST_NOT_MODELED",
    "OBSERVATION_LATENCY_NOT_MODELED",
    "TEMPORAL_URGENCY_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_COMMITMENT_NOT_MODELED",
    "OBSERVATION_RESULT_INGESTION_NOT_MODELED",
    "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED",
    "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Capability Verification set and Capability Availability set do not share the same Capability Declaration Match context";

export function attentionObservationCapabilityDeclarationStateCompositionKey(
  observationNeedKey: string,
  observerEntityId: string,
  capabilitySemanticKey: string,
  capabilityDeclarationId: string
): string {
  return [
    "attention-observation-capability-state-composition",
    observationNeedKey,
    observerEntityId,
    capabilitySemanticKey,
    capabilityDeclarationId,
  ].join("|");
}

export function attentionObservationCapabilityRequirementStateCompositionKey(
  requirementMatchPositionKey: string
): string {
  return [
    "attention-observation-capability-requirement-state-composition",
    requirementMatchPositionKey,
  ].join("|");
}

function declarationCompositionStatus(
  hasVerification: boolean,
  hasAvailability: boolean
): AttentionObservationCapabilityDeclarationCompositionStatus {
  if (hasVerification && hasAvailability) {
    return "VERIFICATION_AND_AVAILABILITY_DECLARATIONS_PRESENT";
  }
  if (hasVerification) {
    return "VERIFICATION_DECLARATIONS_PRESENT_AVAILABILITY_DECLARATIONS_ABSENT";
  }
  if (hasAvailability) {
    return "VERIFICATION_DECLARATIONS_ABSENT_AVAILABILITY_DECLARATIONS_PRESENT";
  }
  return "NO_VERIFICATION_OR_AVAILABILITY_DECLARATIONS_REPRESENTED";
}

function collectDeclarationMatchKeys(
  matchSet: AttentionObservationCapabilityDeclarationMatchSetAssessment
): string[] {
  const keys: string[] = [];
  for (const candidate of matchSet.candidate_assessments) {
    for (const basis of candidate.observer_capability_bases) {
      for (const position of basis.requirement_match_positions) {
        for (const declarationMatch of position.structurally_matching_declarations) {
          keys.push(declarationMatch.key);
        }
      }
    }
  }
  return keys;
}

/**
 * Validates 051/052 sibling sets share the same GROUND-050 Declaration Match context
 * via canonical keys — not object identity.
 */
export function assertCompatibleCapabilityStateCompositionSiblingContexts(
  verificationSet: AttentionObservationCapabilityVerificationSetAssessment,
  availabilitySet: AttentionObservationCapabilityAvailabilitySetAssessment
): void {
  const verMatch = verificationSet.capability_declaration_match_set;
  const availMatch = availabilitySet.capability_declaration_match_set;

  const verCandidates = verificationSet.candidate_assessments;
  const availCandidates = availabilitySet.candidate_assessments;

  if (verCandidates.length !== availCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate count mismatch`
    );
  }

  if (
    verMatch.candidate_assessments.length !==
    availMatch.candidate_assessments.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: embedded Declaration Match AttentionCandidate count mismatch`
    );
  }

  for (let i = 0; i < verCandidates.length; i++) {
    const ver = verCandidates[i];
    const avail = availCandidates[i];

    if (ver.candidate_key !== avail.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch at index ${i} (${ver.candidate_key} vs ${avail.candidate_key})`
      );
    }

    const verDecl = ver.capability_declaration_match_assessment;
    const availDecl = avail.capability_declaration_match_assessment;

    if (verDecl.candidate_key !== availDecl.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: embedded Declaration Match AttentionCandidate key mismatch for ${ver.candidate_key}`
      );
    }

    if (verDecl.status !== availDecl.status) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Declaration Match status mismatch for AttentionCandidate ${ver.candidate_key} (${verDecl.status} vs ${availDecl.status})`
      );
    }

    if (
      verDecl.observer_capability_bases.length !==
      availDecl.observer_capability_bases.length
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Observer Candidate count mismatch for AttentionCandidate ${ver.candidate_key}`
      );
    }

    // Also require sibling branch bases to align when structural matches exist.
    if (
      ver.observer_verification_bases.length !==
      avail.observer_availability_bases.length
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Observer Capability Basis count mismatch for AttentionCandidate ${ver.candidate_key}`
      );
    }

    for (let o = 0; o < ver.observer_verification_bases.length; o++) {
      const verBasis = ver.observer_verification_bases[o];
      const availBasis = avail.observer_availability_bases[o];

      if (
        verBasis.observer_candidate.key !== availBasis.observer_candidate.key
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: ObserverCandidate key mismatch for AttentionCandidate ${ver.candidate_key}`
        );
      }

      if (verBasis.observation_need_key !== availBasis.observation_need_key) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for AttentionCandidate ${ver.candidate_key}`
        );
      }

      if (
        verBasis.requirement_verification_positions.length !==
        availBasis.requirement_availability_positions.length
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement position count mismatch for ObserverCandidate ${verBasis.observer_candidate.key}`
        );
      }

      for (
        let r = 0;
        r < verBasis.requirement_verification_positions.length;
        r++
      ) {
        const verReq = verBasis.requirement_verification_positions[r];
        const availReq = availBasis.requirement_availability_positions[r];

        if (
          verReq.capability_requirement_match_position.key !==
          availReq.capability_requirement_match_position.key
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement match position key mismatch (${verReq.capability_requirement_match_position.key} vs ${availReq.capability_requirement_match_position.key})`
          );
        }

        if (
          verReq.capability_requirement_match_position.capability_requirement
            .key !==
          availReq.capability_requirement_match_position.capability_requirement
            .key
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement key mismatch`
          );
        }

        const verDeclKeys = verReq.declaration_verification_positions.map(
          (p) => p.capability_declaration_match.key
        );
        const availDeclKeys = availReq.declaration_availability_positions.map(
          (p) => p.capability_declaration_match.key
        );

        if (verDeclKeys.length !== availDeclKeys.length) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: CapabilityDeclarationMatch count mismatch for CapabilityRequirement ${verReq.capability_requirement_match_position.capability_requirement.key}`
          );
        }

        for (let d = 0; d < verDeclKeys.length; d++) {
          if (verDeclKeys[d] !== availDeclKeys[d]) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: CapabilityDeclarationMatch key mismatch (${verDeclKeys[d]} vs ${availDeclKeys[d]})`
            );
          }

          const verDeclId =
            verReq.declaration_verification_positions[d]
              .capability_declaration_match.capability_declaration_id;
          const availDeclId =
            availReq.declaration_availability_positions[d]
              .capability_declaration_match.capability_declaration_id;
          if (verDeclId !== availDeclId) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: CapabilityDeclaration.id mismatch (${verDeclId} vs ${availDeclId})`
            );
          }
        }
      }
    }
  }

  const verMatchKeys = collectDeclarationMatchKeys(verMatch);
  const availMatchKeys = collectDeclarationMatchKeys(availMatch);
  if (verMatchKeys.length !== availMatchKeys.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: embedded Declaration Match key count mismatch`
    );
  }
  for (let i = 0; i < verMatchKeys.length; i++) {
    if (verMatchKeys[i] !== availMatchKeys[i]) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: embedded Declaration Match key mismatch (${verMatchKeys[i]} vs ${availMatchKeys[i]})`
      );
    }
  }
}

function buildDeclarationCompositionPosition(
  verificationPosition: AttentionObservationCapabilityDeclarationVerificationPosition,
  availabilityPosition: AttentionObservationCapabilityDeclarationAvailabilityPosition
): AttentionObservationCapabilityDeclarationStateCompositionPosition {
  if (
    verificationPosition.capability_declaration_match.key !==
    availabilityPosition.capability_declaration_match.key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: CapabilityDeclarationMatch key mismatch (${verificationPosition.capability_declaration_match.key} vs ${availabilityPosition.capability_declaration_match.key})`
    );
  }

  const hasVerification =
    verificationPosition.verification_links.length > 0;
  const hasAvailability =
    availabilityPosition.availability_links.length > 0;

  const match = verificationPosition.capability_declaration_match;

  return {
    key: attentionObservationCapabilityDeclarationStateCompositionKey(
      match.observation_need_key,
      match.observer_entity_id,
      match.capability_semantic_key,
      match.capability_declaration_id
    ),
    capability_declaration_match: match,
    verification_position: verificationPosition,
    availability_position: availabilityPosition,
    status: declarationCompositionStatus(hasVerification, hasAvailability),
  };
}

function buildRequirementCompositionPosition(
  verificationRequirement: AttentionObservationCapabilityRequirementVerificationPosition,
  availabilityRequirement: AttentionObservationCapabilityRequirementAvailabilityPosition
): AttentionObservationCapabilityRequirementStateCompositionPosition {
  const requirementMatchPosition =
    verificationRequirement.capability_requirement_match_position;

  const verificationByMatchKey = new Map(
    verificationRequirement.declaration_verification_positions.map((p) => [
      p.capability_declaration_match.key,
      p,
    ])
  );
  const availabilityByMatchKey = new Map(
    availabilityRequirement.declaration_availability_positions.map((p) => [
      p.capability_declaration_match.key,
      p,
    ])
  );

  // Preserve GROUND-050 structural declaration order from the requirement match position.
  const declaration_composition_positions: AttentionObservationCapabilityDeclarationStateCompositionPosition[] =
    requirementMatchPosition.structurally_matching_declarations.map(
      (declarationMatch) => {
        const verificationPosition = verificationByMatchKey.get(
          declarationMatch.key
        );
        const availabilityPosition = availabilityByMatchKey.get(
          declarationMatch.key
        );

        if (!verificationPosition) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Verification Declaration position for CapabilityDeclarationMatch ${declarationMatch.key}`
          );
        }
        if (!availabilityPosition) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Availability Declaration position for CapabilityDeclarationMatch ${declarationMatch.key}`
          );
        }

        return buildDeclarationCompositionPosition(
          verificationPosition,
          availabilityPosition
        );
      }
    );

  // Extra sibling positions would indicate structural inconsistency.
  if (
    verificationByMatchKey.size !== declaration_composition_positions.length ||
    availabilityByMatchKey.size !== declaration_composition_positions.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: Declaration position set mismatch for CapabilityRequirement ${requirementMatchPosition.capability_requirement.key}`
    );
  }

  return {
    key: attentionObservationCapabilityRequirementStateCompositionKey(
      requirementMatchPosition.key
    ),
    capability_requirement_match_position: requirementMatchPosition,
    declaration_composition_positions,
  };
}

function mapStructuralNotApplicable(
  declarationMatchStatus: AttentionCandidateObservationCapabilityDeclarationAssessment["status"]
): AttentionObservationCapabilityStateCompositionStatus | null {
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
 * Pure per-AttentionCandidate Capability State Composition assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS
 * 5. CAPABILITY_STATE_COMPOSITION_BASIS_PRESENT
 *    (even when Verification and Availability child records are both absent)
 */
export function assessAttentionCandidateObservationCapabilityStateComposition(
  verificationAssessment: AttentionCandidateObservationCapabilityVerificationAssessment,
  availabilityAssessment: AttentionCandidateObservationCapabilityAvailabilityAssessment
): AttentionCandidateObservationCapabilityStateCompositionAssessment {
  const candidate_key = verificationAssessment.candidate_key;
  const declarationMatchAssessment =
    verificationAssessment.capability_declaration_match_assessment;

  const notApplicableStatus = mapStructuralNotApplicable(
    declarationMatchAssessment.status
  );

  if (notApplicableStatus !== null) {
    return {
      candidate_key,
      capability_declaration_match_assessment: declarationMatchAssessment,
      capability_verification_assessment: verificationAssessment,
      capability_availability_assessment: availabilityAssessment,
      status: notApplicableStatus,
      observer_capability_state_bases: [],
      has_capability_state_composition_basis: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_STATE_COMPOSITION_MODEL_LIMITATIONS,
      ],
    };
  }

  const observer_capability_state_bases: AttentionObservationObserverCapabilityStateCompositionBasis[] =
    verificationAssessment.observer_verification_bases.map(
      (verBasis, observerIndex) => {
        const availBasis =
          availabilityAssessment.observer_availability_bases[observerIndex];

        return {
          observation_need_key: verBasis.observation_need_key,
          observer_candidate: verBasis.observer_candidate,
          requirement_composition_positions:
            verBasis.requirement_verification_positions.map(
              (verReq, requirementIndex) =>
                buildRequirementCompositionPosition(
                  verReq,
                  availBasis.requirement_availability_positions[
                    requirementIndex
                  ]
                )
            ),
        };
      }
    );

  return {
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    capability_verification_assessment: verificationAssessment,
    capability_availability_assessment: availabilityAssessment,
    status: "CAPABILITY_STATE_COMPOSITION_BASIS_PRESENT",
    observer_capability_state_bases,
    has_capability_state_composition_basis: true,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_STATE_COMPOSITION_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability State Composition.
 * Preserves GROUND-050 / 051 / 052 AttentionCandidate order.
 */
export function buildAttentionObservationCapabilityStateCompositionSet(
  input: AttentionObservationCapabilityStateCompositionInput
): AttentionObservationCapabilityStateCompositionSetAssessment {
  assertCompatibleCapabilityStateCompositionSiblingContexts(
    input.capability_verification_set,
    input.capability_availability_set
  );

  const candidate_assessments =
    input.capability_verification_set.candidate_assessments.map(
      (verificationAssessment, index) =>
        assessAttentionCandidateObservationCapabilityStateComposition(
          verificationAssessment,
          input.capability_availability_set.candidate_assessments[index]
        )
    );

  return {
    capability_verification_set: input.capability_verification_set,
    capability_availability_set: input.capability_availability_set,
    candidate_assessments,
    has_capability_state_composition_basis: candidate_assessments.some(
      (c) => c.has_capability_state_composition_basis
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_STATE_COMPOSITION_MODEL_LIMITATIONS,
    ],
  };
}
