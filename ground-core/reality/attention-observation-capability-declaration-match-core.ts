/**
 * Reality Core v0.7 — Attention Observation Capability Declaration Match (GROUND-050).
 *
 * Pure composition of GROUND-048 Capability Requirement + GROUND-049 Observer Candidate
 * + explicit CapabilityDeclaration collection.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Capability verification/availability assessment,
 * Permission, Authority, Resource, Commitment assessment APIs.
 *
 * Structural match = exact holder_entity_id + exact capability_key only.
 * Scope / temporal / verification / availability remain unresolved.
 */

import type { CapabilityDeclaration } from "../types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationObserverCandidateAssessment,
  AttentionObservationObserverCandidate,
  AttentionObservationObserverCandidateSetAssessment,
} from "./attention-observation-observer-candidate-types.js";
import type {
  AttentionCandidateObservationCapabilityDeclarationAssessment,
  AttentionObservationCapabilityDeclarationMatch,
  AttentionObservationCapabilityDeclarationMatchInput,
  AttentionObservationCapabilityDeclarationMatchModelLimitation,
  AttentionObservationCapabilityDeclarationMatchSetAssessment,
  AttentionObservationCapabilityDeclarationMatchStatus,
  AttentionObservationCapabilityRequirementMatchPosition,
  AttentionObservationObserverCapabilityDeclarationBasis,
} from "./attention-observation-capability-declaration-match-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_MATCH_MODEL_LIMITATIONS: AttentionObservationCapabilityDeclarationMatchModelLimitation[] =
  [
    "CAPABILITY_DECLARATION_TRUTH_NOT_MODELED",
    "CAPABILITY_SCOPE_REQUIREMENT_NOT_MODELED",
    "CAPABILITY_SCOPE_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_VERIFICATION_MATCHING_NOT_MODELED",
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

export function attentionObservationCapabilityDeclarationMatchKey(
  observationNeedKey: string,
  observerEntityId: string,
  capabilitySemanticKey: string,
  capabilityDeclarationId: string
): string {
  return [
    "attention-observation-capability-declaration-match",
    observationNeedKey,
    observerEntityId,
    capabilitySemanticKey,
    capabilityDeclarationId,
  ].join("|");
}

export function attentionObservationCapabilityRequirementMatchPositionKey(
  observationNeedKey: string,
  attentionCandidateKey: string,
  observerCandidateKey: string,
  capabilityRequirementKey: string
): string {
  return [
    "attention-observation-capability-requirement-match-position",
    observationNeedKey,
    attentionCandidateKey,
    observerCandidateKey,
    capabilityRequirementKey,
  ].join("|");
}

/**
 * Exact-id CapabilityDeclaration catalog. Rejects duplicate or empty ids.
 */
export function normalizeCapabilityDeclarationCollection(
  declarations: CapabilityDeclaration[]
): ReadonlyMap<string, CapabilityDeclaration> {
  const byId = new Map<string, CapabilityDeclaration>();

  for (const declaration of declarations) {
    if (!declaration.id || declaration.id.trim().length === 0) {
      throw new Error("CapabilityDeclaration id must be non-empty");
    }
    if (byId.has(declaration.id)) {
      throw new Error(`Duplicate CapabilityDeclaration id ${declaration.id}`);
    }
    byId.set(declaration.id, declaration);
  }

  return byId;
}

/**
 * Index: holder → capability_key → declarations sorted by id.
 */
function buildHolderCapabilityIndex(
  declarations: CapabilityDeclaration[]
): Map<string, Map<string, CapabilityDeclaration[]>> {
  const index = new Map<string, Map<string, CapabilityDeclaration[]>>();

  for (const declaration of declarations) {
    let byCapability = index.get(declaration.holder_entity_id);
    if (!byCapability) {
      byCapability = new Map();
      index.set(declaration.holder_entity_id, byCapability);
    }
    const existing = byCapability.get(declaration.capability_key) ?? [];
    existing.push(declaration);
    byCapability.set(declaration.capability_key, existing);
  }

  for (const byCapability of index.values()) {
    for (const [capabilityKey, list] of byCapability.entries()) {
      byCapability.set(
        capabilityKey,
        [...list].sort((a, b) => compareIds(a.id, b.id))
      );
    }
  }

  return index;
}

/**
 * Validates 048/049 sibling sets share the same observation planning context
 * via canonical AttentionCandidate keys and ObservationNeed keys — not object identity.
 */
export function assertCompatibleObservationCapabilitySiblingContexts(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  observerCandidateSet: AttentionObservationObserverCandidateSetAssessment
): void {
  const reqCandidates = capabilityRequirementSet.candidate_requirements;
  const obsCandidates = observerCandidateSet.candidate_assessments;

  if (reqCandidates.length !== obsCandidates.length) {
    throw new Error(
      "Capability Requirement set and Observer Candidate set do not share the same observation planning context: AttentionCandidate count mismatch"
    );
  }

  for (let i = 0; i < reqCandidates.length; i++) {
    const req = reqCandidates[i];
    const obs = obsCandidates[i];

    if (req.candidate_key !== obs.candidate_key) {
      throw new Error(
        `Capability Requirement set and Observer Candidate set do not share the same observation planning context: AttentionCandidate key mismatch at index ${i} (${req.candidate_key} vs ${obs.candidate_key})`
      );
    }

    const reqPlanningKey = req.planning.planning_basis?.key ?? null;
    const obsPlanningKey = obs.planning.planning_basis?.key ?? null;
    if (reqPlanningKey !== obsPlanningKey) {
      throw new Error(
        `Capability Requirement set and Observer Candidate set do not share the same observation planning context: Planning Basis key mismatch for AttentionCandidate ${req.candidate_key}`
      );
    }

    const reqNeedKey =
      req.capability_requirement_basis?.observation_need_key ??
      req.planning.planning_basis?.observation_need_key ??
      null;
    const obsNeedKey =
      obs.observer_candidate_basis?.observation_need_key ??
      obs.planning.planning_basis?.observation_need_key ??
      null;
    if (reqNeedKey !== obsNeedKey) {
      throw new Error(
        `Capability Requirement set and Observer Candidate set do not share the same observation planning context: ObservationNeed key mismatch for AttentionCandidate ${req.candidate_key}`
      );
    }
  }
}

function buildStructuralMatches(
  attentionCandidateKey: string,
  observationNeedKey: string,
  observerCandidate: AttentionObservationObserverCandidate,
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  holderCapabilityIndex: Map<string, Map<string, CapabilityDeclaration[]>>
): AttentionObservationCapabilityDeclarationMatch[] {
  const byCapability = holderCapabilityIndex.get(
    observerCandidate.observer_entity_id
  );
  const declarations =
    byCapability?.get(capabilityRequirement.capability_semantic_key) ?? [];

  return declarations.map((declaration) => ({
    key: attentionObservationCapabilityDeclarationMatchKey(
      observationNeedKey,
      observerCandidate.observer_entity_id,
      capabilityRequirement.capability_semantic_key,
      declaration.id
    ),
    observation_need_key: observationNeedKey,
    attention_candidate_key: attentionCandidateKey,
    observer_candidate_key: observerCandidate.key,
    observer_entity_id: observerCandidate.observer_entity_id,
    capability_requirement_key: capabilityRequirement.key,
    capability_semantic_key: capabilityRequirement.capability_semantic_key,
    capability_declaration_id: declaration.id,
    capability_declaration: declaration,
  }));
}

function buildRequirementMatchPosition(
  attentionCandidateKey: string,
  observationNeedKey: string,
  observerCandidate: AttentionObservationObserverCandidate,
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  holderCapabilityIndex: Map<string, Map<string, CapabilityDeclaration[]>>
): AttentionObservationCapabilityRequirementMatchPosition {
  const structurally_matching_declarations = buildStructuralMatches(
    attentionCandidateKey,
    observationNeedKey,
    observerCandidate,
    capabilityRequirement,
    holderCapabilityIndex
  );

  return {
    key: attentionObservationCapabilityRequirementMatchPositionKey(
      observationNeedKey,
      attentionCandidateKey,
      observerCandidate.key,
      capabilityRequirement.key
    ),
    observation_need_key: observationNeedKey,
    attention_candidate_key: attentionCandidateKey,
    observer_candidate: observerCandidate,
    capability_requirement: capabilityRequirement,
    structurally_matching_declarations,
    status:
      structurally_matching_declarations.length > 0
        ? "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT"
        : "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS",
  };
}

/**
 * Pure per-AttentionCandidate structural declaration-match assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES
 * 4. structural matching statuses
 */
export function assessAttentionCandidateObservationCapabilityDeclarationMatch(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  observerCandidateAssessment: AttentionCandidateObservationObserverCandidateAssessment,
  holderCapabilityIndex: Map<string, Map<string, CapabilityDeclaration[]>>
): AttentionCandidateObservationCapabilityDeclarationAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityDeclarationMatchStatus
  ): AttentionCandidateObservationCapabilityDeclarationAssessment => ({
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    observer_candidate_assessment: observerCandidateAssessment,
    status,
    observer_capability_bases: [],
    has_structurally_matching_capability_declarations: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_MATCH_MODEL_LIMITATIONS,
    ],
  });

  if (
    capabilityRequirementAssessment.planning.status !==
      "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT" ||
    observerCandidateAssessment.planning.status !==
      "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    capabilityRequirementAssessment.status ===
      "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED" ||
    !capabilityRequirementAssessment.has_explicit_capability_requirements ||
    capabilityRequirementAssessment.capability_requirement_basis === null ||
    capabilityRequirementAssessment.capability_requirement_basis.requirements
      .length === 0
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    observerCandidateAssessment.status ===
      "NO_EXPLICIT_OBSERVER_CANDIDATES_DECLARED" ||
    !observerCandidateAssessment.has_explicit_observer_candidates ||
    observerCandidateAssessment.observer_candidate_basis === null ||
    observerCandidateAssessment.observer_candidate_basis.candidates.length === 0
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_OBSERVER_CANDIDATES");
  }

  const observationNeedKey =
    capabilityRequirementAssessment.capability_requirement_basis
      .observation_need_key;
  const requirements =
    capabilityRequirementAssessment.capability_requirement_basis.requirements;
  const observers =
    observerCandidateAssessment.observer_candidate_basis.candidates;

  const observer_capability_bases: AttentionObservationObserverCapabilityDeclarationBasis[] =
    observers.map((observer_candidate) => ({
      observation_need_key: observationNeedKey,
      observer_candidate,
      requirement_match_positions: requirements.map((capability_requirement) =>
        buildRequirementMatchPosition(
          candidate_key,
          observationNeedKey,
          observer_candidate,
          capability_requirement,
          holderCapabilityIndex
        )
      ),
    }));

  const has_structurally_matching_capability_declarations =
    observer_capability_bases.some((basis) =>
      basis.requirement_match_positions.some(
        (position) =>
          position.status ===
          "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT"
      )
    );

  return {
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    observer_candidate_assessment: observerCandidateAssessment,
    status: has_structurally_matching_capability_declarations
      ? "STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS_PRESENT"
      : "NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS",
    observer_capability_bases,
    has_structurally_matching_capability_declarations,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_MATCH_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level structural declaration-match composition.
 * Preserves GROUND-047 / 048 / 049 AttentionCandidate order.
 */
export function buildAttentionObservationCapabilityDeclarationMatchSet(
  input: AttentionObservationCapabilityDeclarationMatchInput
): AttentionObservationCapabilityDeclarationMatchSetAssessment {
  assertCompatibleObservationCapabilitySiblingContexts(
    input.capability_requirement_set,
    input.observer_candidate_set
  );

  // Validate unique declaration ids; index for matching.
  normalizeCapabilityDeclarationCollection(input.capability_declarations);
  const holderCapabilityIndex = buildHolderCapabilityIndex(
    input.capability_declarations
  );

  const candidate_assessments =
    input.capability_requirement_set.candidate_requirements.map(
      (capabilityRequirementAssessment, index) =>
        assessAttentionCandidateObservationCapabilityDeclarationMatch(
          capabilityRequirementAssessment,
          input.observer_candidate_set.candidate_assessments[index],
          holderCapabilityIndex
        )
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    observer_candidate_set: input.observer_candidate_set,
    candidate_assessments,
    has_structurally_matching_capability_declarations:
      candidate_assessments.some(
        (c) => c.has_structurally_matching_capability_declarations
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DECLARATION_MATCH_MODEL_LIMITATIONS,
    ],
  };
}
