/**
 * Reality Core v0.7 — Attention Observation Capability Scope Requirement (GROUND-054).
 *
 * Pure composition of GROUND-048 Capability Requirement
 * + explicit Capability Scope Requirement Specification.
 *
 * Sibling of GROUND-050–053 Capability state branch — must not import
 * declaration-match, verification, availability, or composition cores.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, Commitment assessment APIs,
 * CapabilityDeclaration matching / active-at / effective Capability helpers.
 *
 * Absent Scope Requirement ≠ UNSCOPED required.
 * Explicit required scope ≠ scope applicability / Requirement satisfaction.
 */

import type { CapabilityScope } from "../types.js";
import { capabilityScopeKey } from "./capability-core.js";
import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityScopeRequirementAssessment,
  AttentionObservationCapabilityRequirementScopeAssessment,
  AttentionObservationCapabilityScopeRequirement,
  AttentionObservationCapabilityScopeRequirementCandidateStatus,
  AttentionObservationCapabilityScopeRequirementEvalInput,
  AttentionObservationCapabilityScopeRequirementInput,
  AttentionObservationCapabilityScopeRequirementModelLimitation,
  AttentionObservationCapabilityScopeRequirementSetAssessment,
  AttentionObservationCapabilityScopeRequirementSpecification,
  AttentionObservationRequiredCapabilityScope,
} from "./attention-observation-capability-scope-requirement-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_SCOPE_REQUIREMENT_MODEL_LIMITATIONS: AttentionObservationCapabilityScopeRequirementModelLimitation[] =
  [
    "CAPABILITY_SCOPE_REQUIREMENT_PROVENANCE_NOT_MODELED",
    "CAPABILITY_SCOPE_REQUIREMENT_AUTHORITY_NOT_MODELED",
    "CAPABILITY_SCOPE_REQUIREMENT_POLICY_NOT_MODELED",
    "OBSERVATION_NEED_TO_CAPABILITY_SCOPE_REQUIREMENT_BRIDGE_NOT_MODELED",
    "OBSERVATION_TARGET_TO_CAPABILITY_SCOPE_REQUIREMENT_BRIDGE_NOT_MODELED",
    "OBSERVATION_SUBJECT_TO_CAPABILITY_SCOPE_REQUIREMENT_BRIDGE_NOT_MODELED",
    "OBSERVATION_PREDICATE_TO_CAPABILITY_SCOPE_REQUIREMENT_BRIDGE_NOT_MODELED",
    "CAPABILITY_SCOPE_HIERARCHY_NOT_MODELED",
    "CAPABILITY_SCOPE_SUBSUMPTION_NOT_MODELED",
    "CAPABILITY_SCOPE_COMPATIBILITY_NOT_MODELED",
    "CAPABILITY_SCOPE_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_PRIORITY_NOT_MODELED",
    "OBSERVATION_RANKING_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Deterministic canonical CapabilityScope key.
 * Exact GROUND-021 capabilityScopeKey semantics — no broadness/rank/alias.
 */
export function buildCanonicalCapabilityScopeKey(
  scope: AttentionObservationRequiredCapabilityScope
): string {
  return capabilityScopeKey(scope);
}

export function attentionObservationCapabilityScopeRequirementKey(
  capabilityRequirementKey: string,
  requiredScope: AttentionObservationRequiredCapabilityScope
): string {
  return [
    "attention-observation-capability-scope-requirement",
    capabilityRequirementKey,
    buildCanonicalCapabilityScopeKey(requiredScope),
  ].join("|");
}

function assertValidCapabilityScope(
  scope: CapabilityScope
): asserts scope is CapabilityScope {
  if (!scope || typeof scope !== "object" || !("kind" in scope)) {
    throw new Error("CapabilityScope must be a canonical discriminated union");
  }
  switch (scope.kind) {
    case "UNSCOPED":
      return;
    case "ENTITY":
      if (!scope.entity_id || scope.entity_id.trim().length === 0) {
        throw new Error("CapabilityScope ENTITY entity_id must be non-empty");
      }
      return;
    case "SUBJECT_STATE":
      if (!scope.subject_id || scope.subject_id.trim().length === 0) {
        throw new Error(
          "CapabilityScope SUBJECT_STATE subject_id must be non-empty"
        );
      }
      if (!scope.state_kind || scope.state_kind.trim().length === 0) {
        throw new Error(
          "CapabilityScope SUBJECT_STATE state_kind must be non-empty"
        );
      }
      return;
    default: {
      const _exhaustive: never = scope;
      void _exhaustive;
      throw new Error("Unknown CapabilityScope kind");
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
 * Validates and normalizes explicit Capability Scope Requirement specification
 * against represented GROUND-048 Capability Requirement keys.
 *
 * Exact duplicate (same requirement key + deep-equal canonical scope) → one.
 * Same requirement key + different scopes → deterministic reject.
 * Unknown capability_requirement_key → deterministic reject.
 */
export function normalizeAttentionObservationCapabilityScopeRequirementSpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  specification: AttentionObservationCapabilityScopeRequirementSpecification
): AttentionObservationCapabilityScopeRequirementSpecification {
  const knownRequirements = collectCapabilityRequirementKeys(
    capabilityRequirementSet
  );

  const byRequirementKey = new Map<
    string,
    AttentionObservationCapabilityScopeRequirementInput
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

    assertValidCapabilityScope(entry.required_scope);

    const existing = byRequirementKey.get(entry.capability_requirement_key);
    if (existing) {
      const existingKey = buildCanonicalCapabilityScopeKey(
        existing.required_scope
      );
      const nextKey = buildCanonicalCapabilityScopeKey(entry.required_scope);
      if (existingKey !== nextKey) {
        throw new Error(
          `Multiple Capability Scope Requirements declared for capability requirement ${entry.capability_requirement_key}`
        );
      }
      // Exact duplicate — keep first (identical).
      continue;
    }

    byRequirementKey.set(entry.capability_requirement_key, {
      capability_requirement_key: entry.capability_requirement_key,
      required_scope: entry.required_scope,
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
    return buildCanonicalCapabilityScopeKey(a.required_scope).localeCompare(
      buildCanonicalCapabilityScopeKey(b.required_scope)
    );
  });

  return { requirements };
}

function buildScopeRequirement(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  requiredScope: AttentionObservationRequiredCapabilityScope
): AttentionObservationCapabilityScopeRequirement {
  return {
    key: attentionObservationCapabilityScopeRequirementKey(
      capabilityRequirement.key,
      requiredScope
    ),
    capability_requirement_key: capabilityRequirement.key,
    observation_need_key: capabilityRequirement.observation_need_key,
    capability_semantic_key: capabilityRequirement.capability_semantic_key,
    required_scope: requiredScope,
  };
}

function assessRequirementScope(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  scopeByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityScopeRequirementInput
  >
): AttentionObservationCapabilityRequirementScopeAssessment {
  const declared = scopeByRequirementKey.get(capabilityRequirement.key);

  if (!declared) {
    return {
      capability_requirement: capabilityRequirement,
      status: "NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_DECLARED",
      scope_requirement_basis: {
        capability_requirement: capabilityRequirement,
        scope_requirement: null,
      },
    };
  }

  const scope_requirement = buildScopeRequirement(
    capabilityRequirement,
    declared.required_scope
  );

  return {
    capability_requirement: capabilityRequirement,
    status: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_PRESENT",
    scope_requirement_basis: {
      capability_requirement: capabilityRequirement,
      scope_requirement,
    },
  };
}

/**
 * Pure per-AttentionCandidate Capability Scope Requirement assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_DECLARED
 * 4. EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_PRESENT
 *
 * Does not synthesize UNSCOPED when scope is absent.
 */
export function assessAttentionCandidateObservationCapabilityScopeRequirements(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  scopeByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityScopeRequirementInput
  >
): AttentionCandidateObservationCapabilityScopeRequirementAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityScopeRequirementCandidateStatus
  ): AttentionCandidateObservationCapabilityScopeRequirementAssessment => ({
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    status,
    requirement_scope_assessments: [],
    has_explicit_capability_scope_requirements: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_SCOPE_REQUIREMENT_MODEL_LIMITATIONS,
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

  const requirement_scope_assessments =
    capabilityRequirementAssessment.capability_requirement_basis.requirements.map(
      (capabilityRequirement) =>
        assessRequirementScope(capabilityRequirement, scopeByRequirementKey)
    );

  const has_explicit_capability_scope_requirements =
    requirement_scope_assessments.some(
      (assessment) =>
        assessment.status === "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_PRESENT"
    );

  return {
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    status: has_explicit_capability_scope_requirements
      ? "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_DECLARED",
    requirement_scope_assessments,
    has_explicit_capability_scope_requirements,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_SCOPE_REQUIREMENT_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Capability Scope Requirement composition.
 * Preserves GROUND-048 AttentionCandidate / Capability Requirement order.
 */
export function buildAttentionObservationCapabilityScopeRequirementSet(
  input: AttentionObservationCapabilityScopeRequirementEvalInput
): AttentionObservationCapabilityScopeRequirementSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationCapabilityScopeRequirementSpecification(
      input.capability_requirement_set,
      input.specification
    );

  const scopeByRequirementKey = new Map(
    normalizedSpecification.requirements.map((entry) => [
      entry.capability_requirement_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.capability_requirement_set.candidate_requirements.map(
      (capabilityRequirementAssessment) =>
        assessAttentionCandidateObservationCapabilityScopeRequirements(
          capabilityRequirementAssessment,
          scopeByRequirementKey
        )
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_scope_requirements: candidate_assessments.some(
      (c) => c.has_explicit_capability_scope_requirements
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_SCOPE_REQUIREMENT_MODEL_LIMITATIONS,
    ],
  };
}
