/**
 * Reality Core v0.7 — Attention Observation Capability Requirement (GROUND-048).
 *
 * Pure transformation of GROUND-047 Planning Basis + explicit Capability Requirement Specification.
 * Must not import state-engine / file-store / studio / ProjectState /
 * or GROUND-041 through GROUND-045 evaluation-branch modules.
 * May import GROUND-021 capability TYPES only — no Capability matching runtime.
 *
 * EvidenceRequirement ≠ ObservationCapabilityRequirement
 * Capability requirement ≠ CapabilityDeclaration / Verification / Availability
 * Capability requirement ≠ actor / Permission / Authority / can_execute
 */

import type {
  AttentionCandidateObservationPlanningAssessment,
  AttentionObservationPlanningSetAssessment,
} from "./attention-observation-planning-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementBasis,
  AttentionObservationCapabilityRequirementEvalInput,
  AttentionObservationCapabilityRequirementInput,
  AttentionObservationCapabilityRequirementModelLimitation,
  AttentionObservationCapabilityRequirementSetAssessment,
  AttentionObservationCapabilityRequirementSpecification,
  CanonicalCapabilitySemanticKey,
} from "./attention-observation-capability-requirement-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_PROVENANCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AUTHORITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_STRENGTH_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_NEGATION_NOT_MODELED",
    "EVIDENCE_REQUIREMENT_TO_CAPABILITY_REQUIREMENT_BRIDGE_NOT_MODELED",
    "OBSERVATION_TARGET_TO_CAPABILITY_REQUIREMENT_BRIDGE_NOT_MODELED",
    "TEMPORAL_SCOPE_TO_CAPABILITY_REQUIREMENT_BRIDGE_NOT_MODELED",
    "OBSERVER_CANDIDATES_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_MATCHING_NOT_MODELED",
    "CAPABILITY_VERIFICATION_MATCHING_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_MATCHING_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
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
    "OBSERVATION_RESULT_INGESTION_NOT_MODELED",
    "OBSERVATION_TO_EVIDENCE_BRIDGE_NOT_MODELED",
    "OBSERVATION_TO_CLAIM_BRIDGE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function attentionObservationCapabilityRequirementKey(
  observationNeedKey: string,
  capabilitySemanticKey: CanonicalCapabilitySemanticKey
): string {
  return [
    "attention-observation-capability-requirement",
    observationNeedKey,
    capabilitySemanticKey,
  ].join("|");
}

/**
 * Validates and normalizes explicit Capability requirement specification
 * against ObservationNeeds that have planning basis in the current set.
 */
export function normalizeAttentionObservationCapabilityRequirementSpecification(
  planningSet: AttentionObservationPlanningSetAssessment,
  specification: AttentionObservationCapabilityRequirementSpecification
): AttentionObservationCapabilityRequirementSpecification {
  const planningNeedKeys = new Set(
    planningSet.candidate_planning
      .filter((c) => c.status === "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT")
      .map((c) => c.planning_basis!.observation_need_key)
  );

  const byPair = new Map<string, AttentionObservationCapabilityRequirementInput>();

  for (const req of specification.requirements) {
    if (!req.observation_need_key || req.observation_need_key.trim().length === 0) {
      throw new Error("ObservationNeed key must be non-empty");
    }
    if (
      !req.capability_semantic_key ||
      req.capability_semantic_key.trim().length === 0
    ) {
      throw new Error("Capability semantic key must be non-empty");
    }
    if (!planningNeedKeys.has(req.observation_need_key)) {
      throw new Error(
        `ObservationNeed ${req.observation_need_key} not found in observation planning basis set`
      );
    }

    const pairKey = [
      req.observation_need_key,
      req.capability_semantic_key,
    ].join("|");
    byPair.set(pairKey, {
      observation_need_key: req.observation_need_key,
      capability_semantic_key: req.capability_semantic_key,
    });
  }

  const requirements = [...byPair.values()].sort((a, b) => {
    const needDiff = compareIds(a.observation_need_key, b.observation_need_key);
    if (needDiff !== 0) {
      return needDiff;
    }
    return compareIds(a.capability_semantic_key, b.capability_semantic_key);
  });

  return { requirements };
}

function requirementsForNeed(
  observationNeedKey: string,
  normalizedSpecification: AttentionObservationCapabilityRequirementSpecification
): AttentionObservationCapabilityRequirement[] {
  return normalizedSpecification.requirements
    .filter((r) => r.observation_need_key === observationNeedKey)
    .map((r) => ({
      key: attentionObservationCapabilityRequirementKey(
        r.observation_need_key,
        r.capability_semantic_key
      ),
      observation_need_key: r.observation_need_key,
      capability_semantic_key: r.capability_semantic_key,
    }));
}

/**
 * Pure per-Candidate Capability requirement assessment.
 * Does not infer requirements from EvidenceRequirement / target / kind / questions.
 */
export function assessAttentionCandidateObservationCapabilityRequirements(
  planning: AttentionCandidateObservationPlanningAssessment,
  normalizedSpecification: AttentionObservationCapabilityRequirementSpecification
): AttentionCandidateObservationCapabilityRequirementAssessment {
  if (
    planning.status !== "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT" ||
    planning.planning_basis === null
  ) {
    return {
      candidate_key: planning.candidate_key,
      planning,
      status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
      capability_requirement_basis: null,
      has_explicit_capability_requirements: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_MODEL_LIMITATIONS,
      ],
    };
  }

  const observationNeedKey = planning.planning_basis.observation_need_key;
  const requirements = requirementsForNeed(
    observationNeedKey,
    normalizedSpecification
  );

  const capability_requirement_basis: AttentionObservationCapabilityRequirementBasis =
    {
      observation_need_key: observationNeedKey,
      requirements,
    };

  const has_explicit = requirements.length > 0;

  return {
    candidate_key: planning.candidate_key,
    planning,
    status: has_explicit
      ? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
    capability_requirement_basis,
    has_explicit_capability_requirements: has_explicit,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Capability requirement assessment. Preserves GROUND-047 Candidate order.
 */
export function buildAttentionObservationCapabilityRequirementSet(
  input: AttentionObservationCapabilityRequirementEvalInput
): AttentionObservationCapabilityRequirementSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationCapabilityRequirementSpecification(
      input.planning_set,
      input.specification
    );

  const candidate_requirements = input.planning_set.candidate_planning.map(
    (planning) =>
      assessAttentionCandidateObservationCapabilityRequirements(
        planning,
        normalizedSpecification
      )
  );

  return {
    planning_set: input.planning_set,
    specification: normalizedSpecification,
    candidate_requirements,
    has_explicit_capability_requirements: candidate_requirements.some(
      (c) => c.has_explicit_capability_requirements
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_MODEL_LIMITATIONS,
    ],
  };
}
