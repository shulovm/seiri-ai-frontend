/**
 * Reality Core v0.7 — Attention Observation Capability Temporal Requirement (GROUND-056).
 *
 * Pure composition of GROUND-048 Capability Requirement
 * + explicit Capability Temporal Requirement Specification.
 *
 * Sibling of GROUND-054 Scope Requirement and GROUND-050–053 Capability state branch.
 * Must not import declaration-match, verification, availability, composition,
 * scope-requirement, or scope-applicability cores.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, Commitment assessment APIs,
 * CapabilityDeclaration matching / active-at / effective Capability helpers,
 * wall-clock current time for temporal semantic evaluation.
 *
 * Absent Temporal Requirement ≠ open-ended / always / now.
 * Explicit required window ≠ temporal applicability / schedule /
 * Requirement satisfaction.
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityTemporalRequirementAssessment,
  AttentionObservationCapabilityRequirementTemporalAssessment,
  AttentionObservationCapabilityTemporalRequirement,
  AttentionObservationCapabilityTemporalRequirementCandidateStatus,
  AttentionObservationCapabilityTemporalRequirementEvalInput,
  AttentionObservationCapabilityTemporalRequirementInput,
  AttentionObservationCapabilityTemporalRequirementModelLimitation,
  AttentionObservationCapabilityTemporalRequirementSetAssessment,
  AttentionObservationCapabilityTemporalRequirementSpecification,
  AttentionObservationRequiredCapabilityTemporalWindow,
} from "./attention-observation-capability-temporal-requirement-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_TEMPORAL_REQUIREMENT_MODEL_LIMITATIONS: AttentionObservationCapabilityTemporalRequirementModelLimitation[] =
  [
    "CAPABILITY_TEMPORAL_REQUIREMENT_PROVENANCE_NOT_MODELED",
    "CAPABILITY_TEMPORAL_REQUIREMENT_AUTHORITY_NOT_MODELED",
    "CAPABILITY_TEMPORAL_REQUIREMENT_POLICY_NOT_MODELED",
    "OBSERVATION_TEMPORAL_SCOPE_TO_CAPABILITY_TEMPORAL_REQUIREMENT_BRIDGE_NOT_MODELED",
    "SITUATION_TIME_TO_CAPABILITY_TEMPORAL_REQUIREMENT_BRIDGE_NOT_MODELED",
    "CAPABILITY_TEMPORAL_POINT_REQUIREMENT_NOT_MODELED",
    "CAPABILITY_MULTIPLE_TEMPORAL_WINDOWS_NOT_MODELED",
    "CAPABILITY_RECURRING_TEMPORAL_REQUIREMENT_NOT_MODELED",
    "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "OBSERVATION_EXECUTION_TIME_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_PRIORITY_NOT_MODELED",
    "OBSERVATION_RANKING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Deterministic canonical required-window key.
 * Exact interval structure only — no applicability / duration / urgency inference.
 *
 * Uses lexicographic ISO-8601 string comparison conventions already used by
 * CapabilityDeclaration.valid_from / valid_until.
 */
export function buildCanonicalCapabilityTemporalRequirementWindowKey(
  window: AttentionObservationRequiredCapabilityTemporalWindow
): string {
  return [
    "REQUIRED_WINDOW",
    window.required_from,
    window.required_until === null ? "OPEN" : window.required_until,
  ].join("|");
}

export function attentionObservationCapabilityTemporalRequirementKey(
  capabilityRequirementKey: string,
  requiredWindow: AttentionObservationRequiredCapabilityTemporalWindow
): string {
  return [
    "attention-observation-capability-temporal-requirement",
    capabilityRequirementKey,
    buildCanonicalCapabilityTemporalRequirementWindowKey(requiredWindow),
  ].join("|");
}

/**
 * Validates required Capability temporal window under half-open semantics
 * [required_from, required_until) matching CapabilityDeclaration conventions.
 *
 * Does not use wall-clock now. Does not rewrite timestamps.
 * Instant/point requirement (required_from === required_until) is invalid/empty under half-open.
 */
export function assertValidRequiredCapabilityTemporalWindow(
  window: AttentionObservationRequiredCapabilityTemporalWindow
): asserts window is AttentionObservationRequiredCapabilityTemporalWindow {
  if (!window || typeof window !== "object") {
    throw new Error(
      "Capability Temporal Requirement window must be an object"
    );
  }
  if (
    typeof window.required_from !== "string" ||
    window.required_from.trim().length === 0
  ) {
    throw new Error(
      "Capability Temporal Requirement required_from must be a non-empty timestamp string"
    );
  }
  if (window.required_until !== null) {
    if (
      typeof window.required_until !== "string" ||
      window.required_until.trim().length === 0
    ) {
      throw new Error(
        "Capability Temporal Requirement required_until must be null or a non-empty timestamp string"
      );
    }
    // Half-open [from, until): until must be strictly after from
    // (same convention as CapabilityDeclaration: valid_until must be after valid_from)
    if (window.required_until <= window.required_from) {
      throw new Error(
        "Capability Temporal Requirement required_until must be after required_from"
      );
    }
  }
}

/**
 * Collects all Capability Requirement keys represented in the GROUND-048 set.
 */
function collectCapabilityRequirementKeys(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment
): Map<string, AttentionObservationCapabilityRequirement> {
  const byKey = new Map<string, AttentionObservationCapabilityRequirement>();

  for (const candidate of capabilityRequirementSet.candidate_requirements) {
    const requirements =
      candidate.capability_requirement_basis?.requirements ?? [];
    for (const requirement of requirements) {
      byKey.set(requirement.key, requirement);
    }
  }

  return byKey;
}

/**
 * Validates and normalizes explicit Capability Temporal Requirement specification
 * against represented GROUND-048 Capability Requirement keys.
 *
 * Exact duplicate (same requirement key + identical canonical window) → one.
 * Same requirement key + different windows → deterministic reject.
 * Unknown capability_requirement_key → deterministic reject.
 */
export function normalizeAttentionObservationCapabilityTemporalRequirementSpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  specification: AttentionObservationCapabilityTemporalRequirementSpecification
): AttentionObservationCapabilityTemporalRequirementSpecification {
  const knownRequirements = collectCapabilityRequirementKeys(
    capabilityRequirementSet
  );

  const byRequirementKey = new Map<
    string,
    AttentionObservationCapabilityTemporalRequirementInput
  >();

  for (const entry of specification.requirements) {
    if (
      !entry.capability_requirement_key ||
      entry.capability_requirement_key.trim().length === 0
    ) {
      throw new Error("Capability Requirement key must be non-empty");
    }

    if (!knownRequirements.has(entry.capability_requirement_key)) {
      throw new Error(
        `Capability Requirement ${entry.capability_requirement_key} not found in observation capability requirement set`
      );
    }

    assertValidRequiredCapabilityTemporalWindow(entry.required_window);

    const existing = byRequirementKey.get(entry.capability_requirement_key);
    if (existing) {
      const existingKey = buildCanonicalCapabilityTemporalRequirementWindowKey(
        existing.required_window
      );
      const nextKey = buildCanonicalCapabilityTemporalRequirementWindowKey(
        entry.required_window
      );
      if (existingKey !== nextKey) {
        throw new Error(
          `Multiple Capability Temporal Requirements declared for capability requirement ${entry.capability_requirement_key}`
        );
      }
      // Exact duplicate — keep first (identical).
      continue;
    }

    byRequirementKey.set(entry.capability_requirement_key, {
      capability_requirement_key: entry.capability_requirement_key,
      required_window: {
        required_from: entry.required_window.required_from,
        required_until: entry.required_window.required_until,
      },
    });
  }

  const requirements = [...byRequirementKey.values()].sort((a, b) => {
    const keyDiff =
      a.capability_requirement_key < b.capability_requirement_key
        ? -1
        : a.capability_requirement_key > b.capability_requirement_key
          ? 1
          : 0;
    if (keyDiff !== 0) {
      return keyDiff;
    }
    return buildCanonicalCapabilityTemporalRequirementWindowKey(
      a.required_window
    ).localeCompare(
      buildCanonicalCapabilityTemporalRequirementWindowKey(b.required_window)
    );
  });

  return { requirements };
}

function buildTemporalRequirement(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  requiredWindow: AttentionObservationRequiredCapabilityTemporalWindow
): AttentionObservationCapabilityTemporalRequirement {
  return {
    key: attentionObservationCapabilityTemporalRequirementKey(
      capabilityRequirement.key,
      requiredWindow
    ),
    capability_requirement_key: capabilityRequirement.key,
    observation_need_key: capabilityRequirement.observation_need_key,
    capability_semantic_key: capabilityRequirement.capability_semantic_key,
    required_window: {
      required_from: requiredWindow.required_from,
      required_until: requiredWindow.required_until,
    },
  };
}

function assessRequirementTemporal(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  temporalByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityTemporalRequirementInput
  >
): AttentionObservationCapabilityRequirementTemporalAssessment {
  const declared = temporalByRequirementKey.get(capabilityRequirement.key);

  if (!declared) {
    return {
      capability_requirement: capabilityRequirement,
      status: "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_DECLARED",
      temporal_requirement_basis: {
        capability_requirement: capabilityRequirement,
        temporal_requirement: null,
      },
    };
  }

  const temporal_requirement = buildTemporalRequirement(
    capabilityRequirement,
    declared.required_window
  );

  return {
    capability_requirement: capabilityRequirement,
    status: "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT",
    temporal_requirement_basis: {
      capability_requirement: capabilityRequirement,
      temporal_requirement,
    },
  };
}

/**
 * Pure per-AttentionCandidate Capability Temporal Requirement assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_DECLARED
 * 4. EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_PRESENT
 *
 * Does not synthesize open-ended / now when temporal requirement is absent.
 */
export function assessAttentionCandidateObservationCapabilityTemporalRequirements(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  temporalByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityTemporalRequirementInput
  >
): AttentionCandidateObservationCapabilityTemporalRequirementAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityTemporalRequirementCandidateStatus
  ): AttentionCandidateObservationCapabilityTemporalRequirementAssessment => ({
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    status,
    requirement_temporal_assessments: [],
    has_explicit_capability_temporal_requirements: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_TEMPORAL_REQUIREMENT_MODEL_LIMITATIONS,
    ],
  });

  if (
    capabilityRequirementAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
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

  const requirement_temporal_assessments =
    capabilityRequirementAssessment.capability_requirement_basis.requirements.map(
      (capabilityRequirement) =>
        assessRequirementTemporal(
          capabilityRequirement,
          temporalByRequirementKey
        )
    );

  const has_explicit_capability_temporal_requirements =
    requirement_temporal_assessments.some(
      (assessment) =>
        assessment.status === "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT"
    );

  return {
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    status: has_explicit_capability_temporal_requirements
      ? "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_DECLARED",
    requirement_temporal_assessments,
    has_explicit_capability_temporal_requirements,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_TEMPORAL_REQUIREMENT_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Capability Temporal Requirement composition.
 * Preserves GROUND-048 AttentionCandidate / Capability Requirement order.
 */
export function buildAttentionObservationCapabilityTemporalRequirementSet(
  input: AttentionObservationCapabilityTemporalRequirementEvalInput
): AttentionObservationCapabilityTemporalRequirementSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationCapabilityTemporalRequirementSpecification(
      input.capability_requirement_set,
      input.specification
    );

  const temporalByRequirementKey = new Map(
    normalizedSpecification.requirements.map((entry) => [
      entry.capability_requirement_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.capability_requirement_set.candidate_requirements.map(
      (capabilityRequirementAssessment) =>
        assessAttentionCandidateObservationCapabilityTemporalRequirements(
          capabilityRequirementAssessment,
          temporalByRequirementKey
        )
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_temporal_requirements: candidate_assessments.some(
      (c) => c.has_explicit_capability_temporal_requirements
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_TEMPORAL_REQUIREMENT_MODEL_LIMITATIONS,
    ],
  };
}
