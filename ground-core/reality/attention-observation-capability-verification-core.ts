/**
 * Reality Core v0.7 — Attention Observation Capability Verification Basis (GROUND-051).
 *
 * Pure composition of GROUND-050 Structural Declaration Match
 * + explicit CapabilityVerificationDeclaration collection.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, CapabilityAvailabilityDeclaration, capability-core effective
 * assessment helpers that combine Declaration+Verification+Availability,
 * Permission, Authority, Resource, Commitment assessment APIs.
 *
 * Linkage = exact capability_declaration_id === CapabilityDeclaration.id only.
 * Verification present ≠ truth / PROVEN / available / satisfied / suitable / can_execute.
 */

import type { CapabilityVerificationDeclaration } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityRequirementMatchPosition,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionCandidateObservationCapabilityVerificationAssessment,
  AttentionObservationCapabilityDeclarationVerificationPosition,
  AttentionObservationCapabilityRequirementVerificationPosition,
  AttentionObservationCapabilityVerificationInput,
  AttentionObservationCapabilityVerificationLink,
  AttentionObservationCapabilityVerificationModelLimitation,
  AttentionObservationCapabilityVerificationSetAssessment,
  AttentionObservationCapabilityVerificationStatus,
  AttentionObservationObserverCapabilityVerificationBasis,
} from "./attention-observation-capability-verification-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_MODEL_LIMITATIONS: AttentionObservationCapabilityVerificationModelLimitation[] =
  [
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_VERIFICATION_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_VERIFICATION_RECENCY_POLICY_NOT_MODELED",
    "CAPABILITY_VERIFICATION_AUTHORITY_POLICY_NOT_MODELED",
    "CAPABILITY_SCOPE_REQUIREMENT_NOT_MODELED",
    "CAPABILITY_SCOPE_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_MATCHING_NOT_MODELED",
    "CAPABILITY_INHERITANCE_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
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

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function attentionObservationCapabilityVerificationLinkKey(
  observationNeedKey: string,
  observerEntityId: string,
  capabilitySemanticKey: string,
  capabilityDeclarationId: string,
  capabilityVerificationDeclarationId: string
): string {
  return [
    "attention-observation-capability-verification-link",
    observationNeedKey,
    observerEntityId,
    capabilitySemanticKey,
    capabilityDeclarationId,
    capabilityVerificationDeclarationId,
  ].join("|");
}

export function attentionObservationCapabilityDeclarationVerificationPositionKey(
  capabilityDeclarationMatchKey: string
): string {
  return [
    "attention-observation-capability-declaration-verification-position",
    capabilityDeclarationMatchKey,
  ].join("|");
}

export function attentionObservationCapabilityRequirementVerificationPositionKey(
  requirementMatchPositionKey: string
): string {
  return [
    "attention-observation-capability-requirement-verification-position",
    requirementMatchPositionKey,
  ].join("|");
}

/**
 * Exact-id CapabilityVerificationDeclaration catalog. Rejects duplicate or empty ids.
 */
export function normalizeCapabilityVerificationDeclarationCollection(
  declarations: CapabilityVerificationDeclaration[]
): ReadonlyMap<string, CapabilityVerificationDeclaration> {
  const byId = new Map<string, CapabilityVerificationDeclaration>();

  for (const declaration of declarations) {
    if (!declaration.id || declaration.id.trim().length === 0) {
      throw new Error("CapabilityVerificationDeclaration id must be non-empty");
    }
    if (byId.has(declaration.id)) {
      throw new Error(
        `Duplicate CapabilityVerificationDeclaration id ${declaration.id}`
      );
    }
    byId.set(declaration.id, declaration);
  }

  return byId;
}

/**
 * Index: capability_declaration_id → VerificationDeclarations sorted by id.
 */
function buildVerificationByDeclarationIndex(
  declarations: CapabilityVerificationDeclaration[]
): Map<string, CapabilityVerificationDeclaration[]> {
  const index = new Map<string, CapabilityVerificationDeclaration[]>();

  for (const declaration of declarations) {
    const existing =
      index.get(declaration.capability_declaration_id) ?? [];
    existing.push(declaration);
    index.set(declaration.capability_declaration_id, existing);
  }

  for (const [declarationId, list] of index.entries()) {
    index.set(
      declarationId,
      [...list].sort((a, b) => compareIds(a.id, b.id))
    );
  }

  return index;
}

function buildVerificationLinks(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  verifications: CapabilityVerificationDeclaration[]
): AttentionObservationCapabilityVerificationLink[] {
  return verifications.map((verification) => ({
    key: attentionObservationCapabilityVerificationLinkKey(
      declarationMatch.observation_need_key,
      declarationMatch.observer_entity_id,
      declarationMatch.capability_semantic_key,
      declarationMatch.capability_declaration_id,
      verification.id
    ),
    observation_need_key: declarationMatch.observation_need_key,
    attention_candidate_key: declarationMatch.attention_candidate_key,
    observer_candidate_key: declarationMatch.observer_candidate_key,
    observer_entity_id: declarationMatch.observer_entity_id,
    capability_requirement_key: declarationMatch.capability_requirement_key,
    capability_semantic_key: declarationMatch.capability_semantic_key,
    capability_declaration_match_key: declarationMatch.key,
    capability_declaration_id: declarationMatch.capability_declaration_id,
    capability_verification_declaration_id: verification.id,
    capability_verification_declaration: verification,
  }));
}

function buildDeclarationVerificationPosition(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  verificationByDeclaration: Map<string, CapabilityVerificationDeclaration[]>
): AttentionObservationCapabilityDeclarationVerificationPosition {
  const verifications =
    verificationByDeclaration.get(declarationMatch.capability_declaration_id) ??
    [];
  const verification_links = buildVerificationLinks(
    declarationMatch,
    verifications
  );

  return {
    key: attentionObservationCapabilityDeclarationVerificationPositionKey(
      declarationMatch.key
    ),
    capability_declaration_match: declarationMatch,
    status:
      verification_links.length > 0
        ? "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT"
        : "NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED",
    verification_links,
  };
}

function buildRequirementVerificationPosition(
  requirementMatchPosition: AttentionObservationCapabilityRequirementMatchPosition,
  verificationByDeclaration: Map<string, CapabilityVerificationDeclaration[]>
): AttentionObservationCapabilityRequirementVerificationPosition {
  const declaration_verification_positions =
    requirementMatchPosition.structurally_matching_declarations.map(
      (declarationMatch) =>
        buildDeclarationVerificationPosition(
          declarationMatch,
          verificationByDeclaration
        )
    );

  return {
    key: attentionObservationCapabilityRequirementVerificationPositionKey(
      requirementMatchPosition.key
    ),
    capability_requirement_match_position: requirementMatchPosition,
    declaration_verification_positions,
    has_capability_verification_declarations:
      declaration_verification_positions.some(
        (position) =>
          position.status === "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT"
      ),
  };
}

/**
 * Pure per-AttentionCandidate Capability Verification Basis assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS
 * 5. NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED
 * 6. CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityVerification(
  declarationMatchAssessment: AttentionCandidateObservationCapabilityDeclarationAssessment,
  verificationByDeclaration: Map<string, CapabilityVerificationDeclaration[]>
): AttentionCandidateObservationCapabilityVerificationAssessment {
  const candidate_key = declarationMatchAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityVerificationStatus
  ): AttentionCandidateObservationCapabilityVerificationAssessment => ({
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    status,
    observer_verification_bases: [],
    has_capability_verification_declarations: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_MODEL_LIMITATIONS,
    ],
  });

  switch (declarationMatchAssessment.status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
    case "NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES":
      return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES");
    case "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS":
      return notApplicable(
        "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );
    case "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT":
      break;
  }

  const observer_verification_bases: AttentionObservationObserverCapabilityVerificationBasis[] =
    declarationMatchAssessment.observer_capability_bases.map((basis) => ({
      observation_need_key: basis.observation_need_key,
      observer_candidate: basis.observer_candidate,
      requirement_verification_positions: basis.requirement_match_positions.map(
        (requirementMatchPosition) =>
          buildRequirementVerificationPosition(
            requirementMatchPosition,
            verificationByDeclaration
          )
      ),
    }));

  const has_capability_verification_declarations =
    observer_verification_bases.some((basis) =>
      basis.requirement_verification_positions.some(
        (position) => position.has_capability_verification_declarations
      )
    );

  return {
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    status: has_capability_verification_declarations
      ? "CAPABILITY_VERIFICATION_DECLARATIONS_PRESENT"
      : "NO_CAPABILITY_VERIFICATION_DECLARATIONS_REPRESENTED",
    observer_verification_bases,
    has_capability_verification_declarations,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability Verification Basis composition.
 * Preserves GROUND-050 AttentionCandidate / Observer / Requirement / Declaration order.
 */
export function buildAttentionObservationCapabilityVerificationSet(
  input: AttentionObservationCapabilityVerificationInput
): AttentionObservationCapabilityVerificationSetAssessment {
  normalizeCapabilityVerificationDeclarationCollection(
    input.capability_verification_declarations
  );
  const verificationByDeclaration = buildVerificationByDeclarationIndex(
    input.capability_verification_declarations
  );

  const candidate_assessments =
    input.capability_declaration_match_set.candidate_assessments.map(
      (declarationMatchAssessment) =>
        assessAttentionCandidateObservationCapabilityVerification(
          declarationMatchAssessment,
          verificationByDeclaration
        )
    );

  return {
    capability_declaration_match_set: input.capability_declaration_match_set,
    candidate_assessments,
    has_capability_verification_declarations: candidate_assessments.some(
      (c) => c.has_capability_verification_declarations
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_VERIFICATION_MODEL_LIMITATIONS,
    ],
  };
}
