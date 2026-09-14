/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Composition Policy (GROUND-076).
 *
 * Pure composition of GROUND-048 Explicit Capability Requirement Set
 * + explicit Requirement Set Composition Policy Specification.
 *
 * Independent policy branch over the exact Requirement set.
 * Must not import GROUND-061–075 runtime cores / Satisfaction States.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * Composition Policy ≠ Composition Result ≠ effective Capability
 * ANY / ALL declaration ≠ Capability present
 * policy absence ≠ ANY ≠ ALL
 * Requirement plurality ≠ implicit ALL
 * unresolved Satisfaction semantics not defined here
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment,
  AttentionObservationCapabilityRequirementSetCompositionPolicy,
  AttentionObservationCapabilityRequirementSetCompositionPolicyEvalInput,
  AttentionObservationCapabilityRequirementSetCompositionPolicyInput,
  AttentionObservationCapabilityRequirementSetCompositionPolicyKind,
  AttentionObservationCapabilityRequirementSetCompositionPolicyModelLimitation,
  AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment,
  AttentionObservationCapabilityRequirementSetCompositionPolicySpecification,
  AttentionObservationCapabilityRequirementSetCompositionPolicyStatus,
} from "./attention-observation-capability-requirement-set-composition-policy-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementSetCompositionPolicyModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_SATISFACTION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_COMPOSITION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_THRESHOLD_COMPOSITION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_WEIGHTED_COMPOSITION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_MAJORITY_COMPOSITION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_VETO_COMPOSITION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_MANDATORY_GROUPS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_ALTERNATIVE_GROUPS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_NESTED_BOOLEAN_COMPOSITION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_PRIORITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_RECENCY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_TRUTH_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Canonical composition-kind order — serialization only, not preference.
 */
export const CANONICAL_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_KIND_ORDER: AttentionObservationCapabilityRequirementSetCompositionPolicyKind[] =
  [
    "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED",
    "ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_ARE_SATISFIED",
  ];

const COMPOSITION_KIND_ORDER = new Map(
  CANONICAL_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_KIND_ORDER.map(
    (k, i) => [k, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeCompositionKind(
  kind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind
): AttentionObservationCapabilityRequirementSetCompositionPolicyKind {
  if (!COMPOSITION_KIND_ORDER.has(kind)) {
    throw new Error(
      `Unknown Capability Requirement Set Composition Policy kind: ${String(kind)}`
    );
  }
  return kind;
}

export function attentionObservationCapabilityRequirementSetCompositionPolicyKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  compositionKind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind
): string {
  return [
    "attention-observation-capability-requirement-set-composition-policy",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    compositionKind,
  ].join("|");
}

interface RequirementSetContext {
  candidateAssessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  observationNeedKey: string;
  requirements: AttentionObservationCapabilityRequirement[];
  capabilityRequirementKeys: string[];
  capabilityRequirementSetKey: string;
}

function collectRequirementSetContexts(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment
): Map<string, RequirementSetContext> {
  const byCandidateKey = new Map<string, RequirementSetContext>();

  for (const candidate of capabilityRequirementSet.candidate_requirements) {
    if (byCandidateKey.has(candidate.candidate_key)) {
      throw new Error(
        `Ambiguous Capability Requirement set context for candidate ${candidate.candidate_key}`
      );
    }

    const requirements =
      candidate.capability_requirement_basis?.requirements ?? [];
    const observationNeedKey =
      candidate.capability_requirement_basis?.observation_need_key ?? "";
    const capabilityRequirementKeys = canonicalizeCapabilityRequirementKeys(
      requirements.map((r) => r.key)
    );
    const capabilityRequirementSetKey =
      requirements.length === 0
        ? ""
        : buildAttentionObservationCapabilityRequirementSetKey(
            candidate.candidate_key,
            observationNeedKey,
            capabilityRequirementKeys
          );

    byCandidateKey.set(candidate.candidate_key, {
      candidateAssessment: candidate,
      observationNeedKey,
      requirements,
      capabilityRequirementKeys,
      capabilityRequirementSetKey,
    });
  }

  return byCandidateKey;
}

/**
 * Validates and normalizes Requirement Set Composition Policy specification
 * against represented GROUND-048 Candidate / non-empty Requirement set contexts.
 *
 * Exact duplicate entries → one.
 * Same Candidate + different composition kinds → reject.
 * Unknown Candidate / zero-Requirement domain → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationCapabilityRequirementSetCompositionPolicySpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  specification: AttentionObservationCapabilityRequirementSetCompositionPolicySpecification
): AttentionObservationCapabilityRequirementSetCompositionPolicySpecification {
  const contexts = collectRequirementSetContexts(capabilityRequirementSet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationCapabilityRequirementSetCompositionPolicyInput
  >();

  for (const entry of specification.policies) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const context = contexts.get(entry.candidate_key);
    if (!context) {
      throw new Error(
        `Candidate ${entry.candidate_key} not found in explicit capability requirement set`
      );
    }

    if (
      context.candidateAssessment.status ===
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      context.candidateAssessment.capability_requirement_basis === null
    ) {
      throw new Error(
        `Capability Requirement Set Composition Policy requires an Observation planning basis for candidate ${entry.candidate_key}`
      );
    }

    if (
      context.candidateAssessment.status ===
        "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED" ||
      !context.candidateAssessment.has_explicit_capability_requirements ||
      context.requirements.length === 0
    ) {
      throw new Error(
        `Capability Requirement Set Composition Policy requires a non-empty Capability Requirement set for candidate ${entry.candidate_key}`
      );
    }

    const normalizedKind = normalizeCompositionKind(entry.composition_kind);
    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (existing.composition_kind !== normalizedKind) {
        throw new Error(
          `Conflicting Capability Requirement Set Composition Policies declared for candidate ${entry.candidate_key}`
        );
      }
      // Exact duplicate — keep one.
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      composition_kind: normalizedKind,
    });
  }

  const policies = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { policies };
}

function assertPolicyAssessmentInvariant(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT" &&
    assessment.capability_requirement_set_composition_policy === null
  ) {
    throw new Error(
      `Requirement Set Composition Policy invariant violated: PRESENT requires non-null policy for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT" &&
    assessment.capability_requirement_set_composition_policy !== null
  ) {
    throw new Error(
      `Requirement Set Composition Policy invariant violated: non-present status requires null policy for candidate ${assessment.candidate_key}`
    );
  }

  const policy = assessment.capability_requirement_set_composition_policy;
  if (policy !== null) {
    const expectedKeys = canonicalizeCapabilityRequirementKeys(
      assessment.capability_requirement_assessment.capability_requirement_basis
        ?.requirements.map((r) => r.key) ?? []
    );
    const actualKeys = canonicalizeCapabilityRequirementKeys(
      policy.capability_requirement_keys
    );
    let keysEqual =
      expectedKeys.length === actualKeys.length;
    if (keysEqual) {
      for (let i = 0; i < expectedKeys.length; i++) {
        if (expectedKeys[i] !== actualKeys[i]) {
          keysEqual = false;
          break;
        }
      }
    }
    if (!keysEqual) {
      throw new Error(
        `Requirement Set Composition Policy invariant violated: capability_requirement_keys must exactly equal GROUND-048 set for candidate ${assessment.candidate_key}`
      );
    }
    if (policy.capability_requirement_keys.length === 0) {
      throw new Error(
        `Requirement Set Composition Policy invariant violated: empty Requirement domain for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function buildCompositionPolicy(
  context: RequirementSetContext,
  compositionKind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind
): AttentionObservationCapabilityRequirementSetCompositionPolicy {
  return {
    key: attentionObservationCapabilityRequirementSetCompositionPolicyKey(
      context.candidateAssessment.candidate_key,
      context.observationNeedKey,
      context.capabilityRequirementSetKey,
      compositionKind
    ),
    candidate_key: context.candidateAssessment.candidate_key,
    observation_need_key: context.observationNeedKey,
    capability_requirement_set_key: context.capabilityRequirementSetKey,
    capability_requirement_keys: [...context.capabilityRequirementKeys],
    composition_kind: compositionKind,
  };
}

/**
 * Pure per-AttentionCandidate Requirement Set Composition Policy assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_..._POLICY_DECLARED
 * 4. EXPLICIT_..._POLICY_PRESENT
 *
 * Does not inspect current GROUND-075 Satisfaction States.
 * Does not execute ANY/ALL composition.
 */
export function assessAttentionCandidateObservationCapabilityRequirementSetCompositionPolicy(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  policyByCandidateKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityRequirementSetCompositionPolicyInput
  >,
  context: RequirementSetContext
): AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityRequirementSetCompositionPolicyStatus
  ): AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment => {
    const assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment =
      {
        candidate_key,
        capability_requirement_assessment: capabilityRequirementAssessment,
        status,
        capability_requirement_set_composition_policy: null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_MODEL_LIMITATIONS,
        ],
      };
    assertPolicyAssessmentInvariant(assessment);
    return assessment;
  };

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
    context.requirements.length === 0
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  const declared = policyByCandidateKey.get(candidate_key);
  if (!declared) {
    return notApplicable(
      "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED"
    );
  }

  const assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment =
    {
      candidate_key,
      capability_requirement_assessment: capabilityRequirementAssessment,
      status:
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT",
      capability_requirement_set_composition_policy: buildCompositionPolicy(
        context,
        declared.composition_kind
      ),
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_MODEL_LIMITATIONS,
      ],
    };
  assertPolicyAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitPolicy(
  assessments: AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Explicit Capability Requirement Set Composition Policy composition.
 * Preserves GROUND-048 AttentionCandidate order.
 * Does not match current GROUND-075 Satisfaction States or produce composition results.
 */
export function buildAttentionObservationCapabilityRequirementSetCompositionPolicySet(
  input: AttentionObservationCapabilityRequirementSetCompositionPolicyEvalInput
): AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment {
  const contexts = collectRequirementSetContexts(
    input.capability_requirement_set
  );

  const normalizedSpecification =
    normalizeAttentionObservationCapabilityRequirementSetCompositionPolicySpecification(
      input.capability_requirement_set,
      input.specification
    );

  const policyByCandidateKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.candidate_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.capability_requirement_set.candidate_requirements.map(
      (capabilityRequirementAssessment) => {
        const context = contexts.get(
          capabilityRequirementAssessment.candidate_key
        );
        if (!context) {
          throw new Error(
            `Capability Requirement set context missing for candidate ${capabilityRequirementAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationCapabilityRequirementSetCompositionPolicy(
          capabilityRequirementAssessment,
          policyByCandidateKey,
          context
        );
      }
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_requirement_set_composition_policies:
      hasAnyExplicitPolicy(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
