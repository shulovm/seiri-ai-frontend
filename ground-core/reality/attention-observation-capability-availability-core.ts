/**
 * Reality Core v0.7 — Attention Observation Capability Availability Basis (GROUND-052).
 *
 * Pure composition of GROUND-050 Structural Declaration Match
 * + explicit CapabilityAvailabilityDeclaration collection.
 *
 * Sibling of GROUND-051 Verification Basis — must not import verification-core
 * or require VerificationSetAssessment.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, GROUND-051 Verification Basis, capability-core effective
 * assessment helpers that combine Declaration+Verification+Availability,
 * Permission, Authority, Resource, Commitment assessment APIs.
 *
 * Linkage = exact capability_declaration_id === CapabilityDeclaration.id only.
 * Availability present ≠ effective/current Availability / Verification /
 * Permission / Resource readiness / satisfied / suitable / can_execute.
 */

import type { CapabilityAvailabilityDeclaration } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityRequirementMatchPosition,
} from "./attention-observation-capability-declaration-match-types.js";
import type {
  AttentionCandidateObservationCapabilityAvailabilityAssessment,
  AttentionObservationCapabilityAvailabilityInput,
  AttentionObservationCapabilityAvailabilityLink,
  AttentionObservationCapabilityAvailabilityModelLimitation,
  AttentionObservationCapabilityAvailabilitySetAssessment,
  AttentionObservationCapabilityAvailabilityStatus,
  AttentionObservationCapabilityDeclarationAvailabilityPosition,
  AttentionObservationCapabilityRequirementAvailabilityPosition,
  AttentionObservationObserverCapabilityAvailabilityBasis,
} from "./attention-observation-capability-availability-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_MODEL_LIMITATIONS: AttentionObservationCapabilityAvailabilityModelLimitation[] =
  [
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_CONFLICT_RESOLUTION_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_RECENCY_POLICY_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_AUTHORITY_POLICY_NOT_MODELED",
    "CAPABILITY_VERIFICATION_COMPOSITION_NOT_MODELED",
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

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function attentionObservationCapabilityAvailabilityLinkKey(
  observationNeedKey: string,
  observerEntityId: string,
  capabilitySemanticKey: string,
  capabilityDeclarationId: string,
  capabilityAvailabilityDeclarationId: string
): string {
  return [
    "attention-observation-capability-availability-link",
    observationNeedKey,
    observerEntityId,
    capabilitySemanticKey,
    capabilityDeclarationId,
    capabilityAvailabilityDeclarationId,
  ].join("|");
}

export function attentionObservationCapabilityDeclarationAvailabilityPositionKey(
  capabilityDeclarationMatchKey: string
): string {
  return [
    "attention-observation-capability-declaration-availability-position",
    capabilityDeclarationMatchKey,
  ].join("|");
}

export function attentionObservationCapabilityRequirementAvailabilityPositionKey(
  requirementMatchPositionKey: string
): string {
  return [
    "attention-observation-capability-requirement-availability-position",
    requirementMatchPositionKey,
  ].join("|");
}

/**
 * Exact-id CapabilityAvailabilityDeclaration catalog. Rejects duplicate or empty ids.
 */
export function normalizeCapabilityAvailabilityDeclarationCollection(
  declarations: CapabilityAvailabilityDeclaration[]
): ReadonlyMap<string, CapabilityAvailabilityDeclaration> {
  const byId = new Map<string, CapabilityAvailabilityDeclaration>();

  for (const declaration of declarations) {
    if (!declaration.id || declaration.id.trim().length === 0) {
      throw new Error("CapabilityAvailabilityDeclaration id must be non-empty");
    }
    if (byId.has(declaration.id)) {
      throw new Error(
        `Duplicate CapabilityAvailabilityDeclaration id ${declaration.id}`
      );
    }
    byId.set(declaration.id, declaration);
  }

  return byId;
}

/**
 * Index: capability_declaration_id → AvailabilityDeclarations sorted by id.
 */
function buildAvailabilityByDeclarationIndex(
  declarations: CapabilityAvailabilityDeclaration[]
): Map<string, CapabilityAvailabilityDeclaration[]> {
  const index = new Map<string, CapabilityAvailabilityDeclaration[]>();

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

function buildAvailabilityLinks(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  availabilities: CapabilityAvailabilityDeclaration[]
): AttentionObservationCapabilityAvailabilityLink[] {
  return availabilities.map((availability) => ({
    key: attentionObservationCapabilityAvailabilityLinkKey(
      declarationMatch.observation_need_key,
      declarationMatch.observer_entity_id,
      declarationMatch.capability_semantic_key,
      declarationMatch.capability_declaration_id,
      availability.id
    ),
    observation_need_key: declarationMatch.observation_need_key,
    attention_candidate_key: declarationMatch.attention_candidate_key,
    observer_candidate_key: declarationMatch.observer_candidate_key,
    observer_entity_id: declarationMatch.observer_entity_id,
    capability_requirement_key: declarationMatch.capability_requirement_key,
    capability_semantic_key: declarationMatch.capability_semantic_key,
    capability_declaration_match_key: declarationMatch.key,
    capability_declaration_id: declarationMatch.capability_declaration_id,
    capability_availability_declaration_id: availability.id,
    capability_availability_declaration: availability,
  }));
}

function buildDeclarationAvailabilityPosition(
  declarationMatch: AttentionObservationCapabilityDeclarationMatch,
  availabilityByDeclaration: Map<string, CapabilityAvailabilityDeclaration[]>
): AttentionObservationCapabilityDeclarationAvailabilityPosition {
  const availabilities =
    availabilityByDeclaration.get(declarationMatch.capability_declaration_id) ??
    [];
  const availability_links = buildAvailabilityLinks(
    declarationMatch,
    availabilities
  );

  return {
    key: attentionObservationCapabilityDeclarationAvailabilityPositionKey(
      declarationMatch.key
    ),
    capability_declaration_match: declarationMatch,
    status:
      availability_links.length > 0
        ? "CAPABILITY_AVAILABILITY_DECLARATIONS_PRESENT"
        : "NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED",
    availability_links,
  };
}

function buildRequirementAvailabilityPosition(
  requirementMatchPosition: AttentionObservationCapabilityRequirementMatchPosition,
  availabilityByDeclaration: Map<string, CapabilityAvailabilityDeclaration[]>
): AttentionObservationCapabilityRequirementAvailabilityPosition {
  const declaration_availability_positions =
    requirementMatchPosition.structurally_matching_declarations.map(
      (declarationMatch) =>
        buildDeclarationAvailabilityPosition(
          declarationMatch,
          availabilityByDeclaration
        )
    );

  return {
    key: attentionObservationCapabilityRequirementAvailabilityPositionKey(
      requirementMatchPosition.key
    ),
    capability_requirement_match_position: requirementMatchPosition,
    declaration_availability_positions,
    has_capability_availability_declarations:
      declaration_availability_positions.some(
        (position) =>
          position.status === "CAPABILITY_AVAILABILITY_DECLARATIONS_PRESENT"
      ),
  };
}

/**
 * Pure per-AttentionCandidate Capability Availability Basis assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS
 * 5. NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED
 * 6. CAPABILITY_AVAILABILITY_DECLARATIONS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityAvailability(
  declarationMatchAssessment: AttentionCandidateObservationCapabilityDeclarationAssessment,
  availabilityByDeclaration: Map<string, CapabilityAvailabilityDeclaration[]>
): AttentionCandidateObservationCapabilityAvailabilityAssessment {
  const candidate_key = declarationMatchAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityAvailabilityStatus
  ): AttentionCandidateObservationCapabilityAvailabilityAssessment => ({
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    status,
    observer_availability_bases: [],
    has_capability_availability_declarations: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_MODEL_LIMITATIONS,
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

  const observer_availability_bases: AttentionObservationObserverCapabilityAvailabilityBasis[] =
    declarationMatchAssessment.observer_capability_bases.map((basis) => ({
      observation_need_key: basis.observation_need_key,
      observer_candidate: basis.observer_candidate,
      requirement_availability_positions: basis.requirement_match_positions.map(
        (requirementMatchPosition) =>
          buildRequirementAvailabilityPosition(
            requirementMatchPosition,
            availabilityByDeclaration
          )
      ),
    }));

  const has_capability_availability_declarations =
    observer_availability_bases.some((basis) =>
      basis.requirement_availability_positions.some(
        (position) => position.has_capability_availability_declarations
      )
    );

  return {
    candidate_key,
    capability_declaration_match_assessment: declarationMatchAssessment,
    status: has_capability_availability_declarations
      ? "CAPABILITY_AVAILABILITY_DECLARATIONS_PRESENT"
      : "NO_CAPABILITY_AVAILABILITY_DECLARATIONS_REPRESENTED",
    observer_availability_bases,
    has_capability_availability_declarations,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability Availability Basis composition.
 * Preserves GROUND-050 AttentionCandidate / Observer / Requirement / Declaration order.
 * Does not consume GROUND-051 Verification Basis.
 */
export function buildAttentionObservationCapabilityAvailabilitySet(
  input: AttentionObservationCapabilityAvailabilityInput
): AttentionObservationCapabilityAvailabilitySetAssessment {
  normalizeCapabilityAvailabilityDeclarationCollection(
    input.capability_availability_declarations
  );
  const availabilityByDeclaration = buildAvailabilityByDeclarationIndex(
    input.capability_availability_declarations
  );

  const candidate_assessments =
    input.capability_declaration_match_set.candidate_assessments.map(
      (declarationMatchAssessment) =>
        assessAttentionCandidateObservationCapabilityAvailability(
          declarationMatchAssessment,
          availabilityByDeclaration
        )
    );

  return {
    capability_declaration_match_set: input.capability_declaration_match_set,
    candidate_assessments,
    has_capability_availability_declarations: candidate_assessments.some(
      (c) => c.has_capability_availability_declarations
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_AVAILABILITY_MODEL_LIMITATIONS,
    ],
  };
}
