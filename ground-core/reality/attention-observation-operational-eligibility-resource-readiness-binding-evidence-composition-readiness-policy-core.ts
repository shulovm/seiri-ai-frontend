/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Readiness Policy (GROUND-146).
 *
 * Pure composition of GROUND-145 Binding Evidence Composition Policy Set
 * + explicit Composition Readiness Policy Specification.
 *
 * Declaration only. Must not import GROUND-141/140/139/137/135/134/133/132,
 * project persistence, Permission, Authority, Reservation, Commitment,
 * Contention, Feasibility, or OE semantics.
 *
 * readiness policy ≠ readiness currently HOLDS
 * NO_READINESS_POLICY ≠ readiness DOES_NOT_HOLD
 * NOT_APPLICABLE ≠ readiness failure
 * all-selected-resolved ≠ all POSITIVE
 * NEGATIVE is resolved; resolved ≠ positive
 * ANY/ALL short-circuit readiness not modeled
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyStatus,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyModelLimitation[] =
  [
    "CURRENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_NOT_CONSUMED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
    "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED",
    "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED",
    "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED",
    "BOOLEAN_SHORT_CIRCUIT_COMPOSITION_READINESS_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED",
    "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Canonical readiness-kind order — serialization only, not preference.
 * Currently one kind only.
 */
export const CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_KIND_ORDER: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind[] =
  [
    "REQUIRE_ALL_SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_RESOLVED_BEFORE_COMPOSITION",
  ];

/**
 * Future GROUND-147 resolved GROUND-141 State vocabulary (documentation only).
 * GROUND-146 does not classify current states.
 * resolved = POSITIVE or NEGATIVE (not POSITIVE-only).
 */
export const FUTURE_RESOURCE_READINESS_BINDING_EVIDENCE_RESOLVED_STATES = [
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE",
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE",
] as const;

/**
 * Future GROUND-147 unresolved GROUND-141 State vocabulary (documentation only).
 * GROUND-146 does not inspect current states.
 */
export const FUTURE_RESOURCE_READINESS_BINDING_EVIDENCE_UNRESOLVED_STATES = [
  "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY",
  "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
] as const;

const READINESS_KIND_ORDER = new Map(
  CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_KIND_ORDER.map(
    (kind, index) => [kind, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeReadinessKind(
  kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind {
  if (!READINESS_KIND_ORDER.has(kind)) {
    throw new Error(
      `Unknown RESOURCE_READINESS Binding Evidence Composition Readiness Policy kind: ${String(kind)}`
    );
  }
  return kind;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|compositionPolicyKey|readinessKind
 */
export function attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_binding_evidence_composition_policy_key: string;
  readiness_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_binding_evidence_composition_policy_key,
    params.readiness_kind,
  ].join("|");
}

interface CompositionPolicyIndexEntry {
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment;
  requirementAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment;
  policy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy;
}

function collectCompositionPoliciesByKey(
  compositionPolicySet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment
): Map<string, CompositionPolicyIndexEntry> {
  const byKey = new Map<string, CompositionPolicyIndexEntry>();

  for (const candidate of compositionPolicySet.candidate_assessments) {
    for (const requirementAssessment of candidate.requirement_policy_assessments) {
      if (
        requirementAssessment.status !==
          "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_PRESENT" ||
        requirementAssessment.policy === null
      ) {
        continue;
      }

      const policy = requirementAssessment.policy;
      if (byKey.has(policy.key)) {
        throw new Error(
          `Ambiguous RESOURCE_READINESS Binding Evidence Composition Policy key ${policy.key}`
        );
      }
      byKey.set(policy.key, {
        candidateAssessment: candidate,
        requirementAssessment,
        policy,
      });
    }
  }

  return byKey;
}

/**
 * Validates and normalizes Composition Readiness Policy specification
 * against authoritative GROUND-145 Composition Policy Set.
 *
 * Exact duplicate (same composition-policy key + same readiness kind) → one.
 * Same composition-policy key + different readiness kinds → reject.
 * Unknown / stale / NO_POLICY targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification(
  compositionPolicySet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification {
  const policiesByKey = collectCompositionPoliciesByKey(compositionPolicySet);
  const byCompositionPolicyKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyInput
  >();

  if (!Array.isArray(specification.composition_readiness_policies)) {
    throw new Error("composition_readiness_policies must be an array");
  }

  for (const entry of specification.composition_readiness_policies) {
    if (
      !entry.resource_readiness_binding_evidence_composition_policy_key ||
      entry.resource_readiness_binding_evidence_composition_policy_key.trim()
        .length === 0
    ) {
      throw new Error(
        "resource_readiness_binding_evidence_composition_policy_key must be non-empty"
      );
    }

    const target = policiesByKey.get(
      entry.resource_readiness_binding_evidence_composition_policy_key
    );
    if (!target) {
      throw new Error(
        `Unknown or stale RESOURCE_READINESS Binding Evidence Composition Policy key ${entry.resource_readiness_binding_evidence_composition_policy_key}`
      );
    }

    const readiness_kind = normalizeReadinessKind(entry.readiness_kind);
    const existing = byCompositionPolicyKey.get(
      entry.resource_readiness_binding_evidence_composition_policy_key
    );
    if (existing) {
      if (existing.readiness_kind !== readiness_kind) {
        throw new Error(
          `Conflicting RESOURCE_READINESS Binding Evidence Composition Readiness Policies declared for Composition Policy ${entry.resource_readiness_binding_evidence_composition_policy_key}`
        );
      }
      continue;
    }

    byCompositionPolicyKey.set(
      entry.resource_readiness_binding_evidence_composition_policy_key,
      {
        resource_readiness_binding_evidence_composition_policy_key:
          entry.resource_readiness_binding_evidence_composition_policy_key,
        readiness_kind,
      }
    );
  }

  const composition_readiness_policies = [
    ...byCompositionPolicyKey.values(),
  ].sort((a, b) =>
    compareStrings(
      a.resource_readiness_binding_evidence_composition_policy_key,
      b.resource_readiness_binding_evidence_composition_policy_key
    )
  );

  return { composition_readiness_policies };
}

function buildReadinessPolicy(
  compositionPolicy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy,
  readinessKind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessKind
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy {
  const readiness_kind = normalizeReadinessKind(readinessKind);

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyKey(
      {
        candidate_key: compositionPolicy.candidate_key,
        observation_need_key: compositionPolicy.observation_need_key,
        capability_requirement_set_key:
          compositionPolicy.capability_requirement_set_key,
        observation_resource_requirement_key:
          compositionPolicy.observation_resource_requirement_key,
        resource_readiness_binding_evidence_composition_policy_key:
          compositionPolicy.key,
        readiness_kind,
      }
    ),
    candidate_key: compositionPolicy.candidate_key,
    observation_need_key: compositionPolicy.observation_need_key,
    capability_requirement_set_key:
      compositionPolicy.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      compositionPolicy.observation_resource_requirement_key,
    resource_readiness_binding_evidence_composition_policy_key:
      compositionPolicy.key,
    member_binding_keys: [...compositionPolicy.member_binding_keys],
    composition_kind: compositionPolicy.composition_kind,
    readiness_kind,
  };
}

function assertRequirementReadinessAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_PRESENT"
  ) {
    if (assessment.readiness_policy === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Policy invariant violated: PRESENT requires non-null policy for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      !assessment.has_explicit_resource_readiness_binding_evidence_composition_readiness_policy
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Policy invariant violated: PRESENT requires boolean true for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.binding_evidence_composition_policy_assessment.policy === null
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Policy invariant violated: PRESENT requires GROUND-145 Composition Policy for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.readiness_policy
        .resource_readiness_binding_evidence_composition_policy_key !==
      assessment.binding_evidence_composition_policy_assessment.policy.key
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Policy invariant violated: readiness policy must target exact GROUND-145 Composition Policy for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
  ) {
    if (assessment.readiness_policy !== null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Policy invariant violated: non-present status requires null policy for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.has_explicit_resource_readiness_binding_evidence_composition_readiness_policy
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Policy invariant violated: non-present status requires boolean false for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown RESOURCE_READINESS Binding Evidence Composition Readiness Policy status: ${String(assessment.status)}`
  );
}

function assessRequirementReadinessPolicy(
  requirementAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment,
  readinessByCompositionPolicyKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyInput
  >
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment {
  if (
    requirementAssessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_DECLARED" ||
    requirementAssessment.policy === null
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment =
      {
        observation_resource_requirement_key:
          requirementAssessment.observation_resource_requirement_key,
        binding_evidence_composition_policy_assessment: requirementAssessment,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY",
        readiness_policy: null,
        has_explicit_resource_readiness_binding_evidence_composition_readiness_policy:
          false,
      };
    assertRequirementReadinessAssessmentInvariant(assessment);
    return assessment;
  }

  const declared = readinessByCompositionPolicyKey.get(
    requirementAssessment.policy.key
  );
  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment =
      {
        observation_resource_requirement_key:
          requirementAssessment.observation_resource_requirement_key,
        binding_evidence_composition_policy_assessment: requirementAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED",
        readiness_policy: null,
        has_explicit_resource_readiness_binding_evidence_composition_readiness_policy:
          false,
      };
    assertRequirementReadinessAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment =
    {
      observation_resource_requirement_key:
        requirementAssessment.observation_resource_requirement_key,
      binding_evidence_composition_policy_assessment: requirementAssessment,
      status:
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_PRESENT",
      readiness_policy: buildReadinessPolicy(
        requirementAssessment.policy,
        declared.readiness_kind
      ),
      has_explicit_resource_readiness_binding_evidence_composition_readiness_policy:
        true,
    };
  assertRequirementReadinessAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Binding Evidence Composition Readiness Policy assessment.
 * Does not consume GROUND-141 States or evaluate readiness HOLDS.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy(
  compositionPolicyAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment,
  readinessByCompositionPolicyKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyAssessment {
  const requirement_readiness_policy_assessments =
    compositionPolicyAssessment.requirement_policy_assessments.map(
      (requirementAssessment) =>
        assessRequirementReadinessPolicy(
          requirementAssessment,
          readinessByCompositionPolicyKey
        )
    );

  return {
    candidate_key: compositionPolicyAssessment.candidate_key,
    resource_readiness_binding_evidence_composition_policy_assessment:
      compositionPolicyAssessment,
    requirement_readiness_policy_assessments,
    has_explicit_resource_readiness_binding_evidence_composition_readiness_policies:
      requirement_readiness_policy_assessments.some(
        (assessment) =>
          assessment.has_explicit_resource_readiness_binding_evidence_composition_readiness_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit RESOURCE_READINESS Binding Evidence Composition
 * Readiness Policy. Preserves GROUND-145 AttentionCandidate order.
 * Does not inspect current GROUND-141 States or produce readiness results.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet(
  input: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification(
      input.resource_readiness_binding_evidence_composition_policy_set,
      input.specification
    );

  const readinessByCompositionPolicyKey = new Map(
    normalizedSpecification.composition_readiness_policies.map((entry) => [
      entry.resource_readiness_binding_evidence_composition_policy_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_binding_evidence_composition_policy_set.candidate_assessments.map(
      (compositionPolicyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy(
          compositionPolicyAssessment,
          readinessByCompositionPolicyKey
        )
    );

  return {
    resource_readiness_binding_evidence_composition_policy_set:
      input.resource_readiness_binding_evidence_composition_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_resource_readiness_binding_evidence_composition_readiness_policies:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_resource_readiness_binding_evidence_composition_readiness_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
