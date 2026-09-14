/**
 * Reality Core v0.7 — Attention Observation Observer Candidate (GROUND-049).
 *
 * Pure transformation of GROUND-047 Planning Basis
 * + explicit Observer Candidate Specification
 * + explicit RealityEntity collection.
 *
 * Must not import state-engine / file-store / studio / ProjectState /
 * GROUND-041–045 / GROUND-048 capability-requirement /
 * Capability / Permission / Authority / Resource / Commitment runtimes.
 *
 * Observer Candidate ≠ capable / verified / available / permitted /
 * authorized / selected / feasible observer
 * Entity catalog ≠ discovery pool
 */

import type { RealityEntity } from "../types.js";
import type {
  AttentionCandidateObservationPlanningAssessment,
  AttentionObservationPlanningSetAssessment,
} from "./attention-observation-planning-types.js";
import type {
  AttentionCandidateObservationObserverCandidateAssessment,
  AttentionObservationObserverCandidate,
  AttentionObservationObserverCandidateBasis,
  AttentionObservationObserverCandidateEvalInput,
  AttentionObservationObserverCandidateInput,
  AttentionObservationObserverCandidateModelLimitation,
  AttentionObservationObserverCandidateSetAssessment,
  AttentionObservationObserverCandidateSpecification,
  CanonicalObserverEntityId,
} from "./attention-observation-observer-candidate-types.js";

export const ATTENTION_OBSERVATION_OBSERVER_CANDIDATE_MODEL_LIMITATIONS: AttentionObservationObserverCandidateModelLimitation[] =
  [
    "OBSERVER_CANDIDATE_PROVENANCE_NOT_MODELED",
    "OBSERVER_CANDIDATE_AUTHORITY_NOT_MODELED",
    "OBSERVER_CANDIDATE_POLICY_NOT_MODELED",
    "OBSERVER_DISCOVERY_NOT_MODELED",
    "OBSERVER_KIND_ELIGIBILITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_MATCHING_NOT_MODELED",
    "CAPABILITY_VERIFICATION_MATCHING_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_MATCHING_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
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
    "OBSERVER_COMMITMENT_NOT_MODELED",
    "OBSERVATION_RESULT_INGESTION_NOT_MODELED",
    "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED",
    "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function attentionObservationObserverCandidateKey(
  observationNeedKey: string,
  observerEntityId: CanonicalObserverEntityId
): string {
  return [
    "attention-observation-observer-candidate",
    observationNeedKey,
    observerEntityId,
  ].join("|");
}

/**
 * Exact-key RealityEntity catalog. Rejects duplicate or empty ids.
 */
export function normalizeObserverEntityCollection(
  observerEntities: RealityEntity[]
): ReadonlyMap<string, RealityEntity> {
  const byId = new Map<string, RealityEntity>();

  for (const entity of observerEntities) {
    if (!entity.id || entity.id.trim().length === 0) {
      throw new Error("RealityEntity id must be non-empty");
    }
    if (byId.has(entity.id)) {
      throw new Error(`Duplicate RealityEntity id ${entity.id}`);
    }
    byId.set(entity.id, entity);
  }

  return byId;
}

/**
 * Validates and normalizes Observer Candidate specification against planning set
 * and exact RealityEntity catalog.
 */
export function normalizeAttentionObservationObserverCandidateSpecification(
  planningSet: AttentionObservationPlanningSetAssessment,
  specification: AttentionObservationObserverCandidateSpecification,
  observerEntityById: ReadonlyMap<string, RealityEntity>
): AttentionObservationObserverCandidateSpecification {
  const planningNeedKeys = new Set(
    planningSet.candidate_planning
      .filter((c) => c.status === "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT")
      .map((c) => c.planning_basis!.observation_need_key)
  );

  const byPair = new Map<string, AttentionObservationObserverCandidateInput>();

  for (const cand of specification.candidates) {
    if (
      !cand.observation_need_key ||
      cand.observation_need_key.trim().length === 0
    ) {
      throw new Error("ObservationNeed key must be non-empty");
    }
    if (
      !cand.observer_entity_id ||
      cand.observer_entity_id.trim().length === 0
    ) {
      throw new Error("Observer entity id must be non-empty");
    }
    if (!planningNeedKeys.has(cand.observation_need_key)) {
      throw new Error(
        `ObservationNeed ${cand.observation_need_key} not found in observation planning basis set`
      );
    }
    if (!observerEntityById.has(cand.observer_entity_id)) {
      throw new Error(
        `RealityEntity ${cand.observer_entity_id} not found for observer candidate`
      );
    }

    const pairKey = [cand.observation_need_key, cand.observer_entity_id].join(
      "|"
    );
    byPair.set(pairKey, {
      observation_need_key: cand.observation_need_key,
      observer_entity_id: cand.observer_entity_id,
    });
  }

  const candidates = [...byPair.values()].sort((a, b) => {
    const needDiff = compareIds(a.observation_need_key, b.observation_need_key);
    if (needDiff !== 0) {
      return needDiff;
    }
    return compareIds(a.observer_entity_id, b.observer_entity_id);
  });

  return { candidates };
}

function candidatesForNeed(
  observationNeedKey: string,
  normalizedSpecification: AttentionObservationObserverCandidateSpecification,
  observerEntityById: ReadonlyMap<string, RealityEntity>
): AttentionObservationObserverCandidate[] {
  return normalizedSpecification.candidates
    .filter((c) => c.observation_need_key === observationNeedKey)
    .map((c) => {
      const entity = observerEntityById.get(c.observer_entity_id)!;
      return {
        key: attentionObservationObserverCandidateKey(
          c.observation_need_key,
          c.observer_entity_id
        ),
        observation_need_key: c.observation_need_key,
        observer_entity_id: c.observer_entity_id,
        observer_entity: entity,
      };
    });
}

/**
 * Pure per-AttentionCandidate Observer Candidate assessment.
 * Does not discover candidates from entity catalog / Capability / subject / relations.
 */
export function assessAttentionCandidateObservationObserverCandidates(
  planning: AttentionCandidateObservationPlanningAssessment,
  normalizedSpecification: AttentionObservationObserverCandidateSpecification,
  observerEntityById: ReadonlyMap<string, RealityEntity>
): AttentionCandidateObservationObserverCandidateAssessment {
  if (
    planning.status !== "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT" ||
    planning.planning_basis === null
  ) {
    return {
      candidate_key: planning.candidate_key,
      planning,
      status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
      observer_candidate_basis: null,
      has_explicit_observer_candidates: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OBSERVER_CANDIDATE_MODEL_LIMITATIONS,
      ],
    };
  }

  const observationNeedKey = planning.planning_basis.observation_need_key;
  const candidates = candidatesForNeed(
    observationNeedKey,
    normalizedSpecification,
    observerEntityById
  );

  const observer_candidate_basis: AttentionObservationObserverCandidateBasis = {
    observation_need_key: observationNeedKey,
    candidates,
  };

  const has_explicit = candidates.length > 0;

  return {
    candidate_key: planning.candidate_key,
    planning,
    status: has_explicit
      ? "EXPLICIT_OBSERVER_CANDIDATES_PRESENT"
      : "NO_EXPLICIT_OBSERVER_CANDIDATES_DECLARED",
    observer_candidate_basis,
    has_explicit_observer_candidates: has_explicit,
    model_limitations: [
      ...ATTENTION_OBSERVATION_OBSERVER_CANDIDATE_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Observer Candidate assessment. Preserves GROUND-047 Candidate order.
 */
export function buildAttentionObservationObserverCandidateSet(
  input: AttentionObservationObserverCandidateEvalInput
): AttentionObservationObserverCandidateSetAssessment {
  const observerEntityById = normalizeObserverEntityCollection(
    input.observer_entities
  );

  const normalizedSpecification =
    normalizeAttentionObservationObserverCandidateSpecification(
      input.planning_set,
      input.specification,
      observerEntityById
    );

  const candidate_assessments = input.planning_set.candidate_planning.map(
    (planning) =>
      assessAttentionCandidateObservationObserverCandidates(
        planning,
        normalizedSpecification,
        observerEntityById
      )
  );

  return {
    planning_set: input.planning_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_observer_candidates: candidate_assessments.some(
      (c) => c.has_explicit_observer_candidates
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OBSERVER_CANDIDATE_MODEL_LIMITATIONS,
    ],
  };
}
