/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Policy (GROUND-145).
 *
 * Pure composition of GROUND-133 RESOURCE_READINESS Observation-Context Binding
 * + explicit Binding Evidence Composition Policy Specification.
 *
 * Declaration only. Must not import GROUND-141/140/139/137/135/134/132,
 * project persistence, Permission, Authority, Reservation, Commitment, Contention,
 * Feasibility, or OE semantics.
 *
 * ANY ≠ alternative physical resources
 * ALL ≠ cumulative physical supply
 * policy present ≠ CONDITION_HOLDS / Resource Readiness / currently evaluable
 * policy absent ≠ CONDITION_DOES_NOT_HOLD
 * empty member set / vacuous ANY/ALL forbidden
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyStatus,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyModelLimitation[] =
  [
    "CURRENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_NOT_CONSUMED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_NOT_MODELED",
    "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED",
    "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED",
    "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED",
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
 * Canonical composition-kind order — serialization only, not preference.
 */
export const CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_KIND_ORDER: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind[] =
  [
    "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
    "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
  ];

const COMPOSITION_KIND_ORDER = new Map(
  CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_KIND_ORDER.map(
    (kind, index) => [kind, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeCompositionKind(
  kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind {
  if (!COMPOSITION_KIND_ORDER.has(kind)) {
    throw new Error(
      `Unknown RESOURCE_READINESS Binding Evidence Composition kind: ${String(kind)}`
    );
  }
  return kind;
}

/**
 * Canonical member-set identity from sorted unique exact binding keys.
 */
export function buildCanonicalResourceReadinessBindingEvidenceCompositionMemberSetKey(
  memberBindingKeys: readonly string[]
): string {
  return canonicalizeResourceReadinessBindingEvidenceCompositionMemberKeys(
    memberBindingKeys
  ).join(",");
}

/**
 * Exact duplicates → one. Order has no semantic meaning.
 * Empty after normalization is rejected by callers (vacuous ANY/ALL forbidden).
 */
export function canonicalizeResourceReadinessBindingEvidenceCompositionMemberKeys(
  memberBindingKeys: readonly string[]
): string[] {
  const unique = new Set<string>();
  for (const raw of memberBindingKeys) {
    if (!raw || raw.trim().length === 0) {
      throw new Error("member_binding_keys entries must be non-empty");
    }
    unique.add(raw);
  }
  return [...unique].sort(compareStrings);
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|canonicalMemberBindingSetKey|compositionKind
 */
export function attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  member_binding_keys: readonly string[];
  composition_kind: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionKind;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    buildCanonicalResourceReadinessBindingEvidenceCompositionMemberSetKey(
      params.member_binding_keys
    ),
    params.composition_kind,
  ].join("|");
}

interface RequirementContext {
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment;
  requirementAssessment: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment;
  bindingByKey: Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding
  >;
}

function collectRequirementContexts(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment
): Map<string, RequirementContext[]> {
  const byRequirementKey = new Map<string, RequirementContext[]>();

  for (const candidate of bindingSet.candidate_assessments) {
    for (const requirementAssessment of candidate.requirement_binding_assessments) {
      const bindingByKey = new Map<
        string,
        AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding
      >();
      for (const binding of requirementAssessment.bindings) {
        if (bindingByKey.has(binding.key)) {
          throw new Error(
            `Ambiguous RESOURCE_READINESS Observation Context Binding key ${binding.key}`
          );
        }
        bindingByKey.set(binding.key, binding);
      }

      const contexts = byRequirementKey.get(
        requirementAssessment.observation_resource_requirement_key
      ) ?? [];
      contexts.push({
        candidateAssessment: candidate,
        requirementAssessment,
        bindingByKey,
      });
      byRequirementKey.set(
        requirementAssessment.observation_resource_requirement_key,
        contexts
      );
    }
  }

  return byRequirementKey;
}

function policiesEqual(
  a: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput,
  b: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput
): boolean {
  if (a.composition_kind !== b.composition_kind) {
    return false;
  }
  if (
    a.observation_resource_requirement_key !==
    b.observation_resource_requirement_key
  ) {
    return false;
  }
  const membersA = canonicalizeResourceReadinessBindingEvidenceCompositionMemberKeys(
    a.member_binding_keys
  );
  const membersB = canonicalizeResourceReadinessBindingEvidenceCompositionMemberKeys(
    b.member_binding_keys
  );
  if (membersA.length !== membersB.length) {
    return false;
  }
  for (let i = 0; i < membersA.length; i++) {
    if (membersA[i] !== membersB[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Validates and normalizes Binding Evidence Composition Policy specification
 * against authoritative GROUND-133 Requirement / Binding structure.
 *
 * Exact duplicate requirement policies → one.
 * Same requirement + different policy → reject.
 * Empty / unknown / cross-context members → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification {
  const requirementContexts = collectRequirementContexts(bindingSet);
  const byRequirementKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput
  >();

  if (!Array.isArray(specification.requirement_policies)) {
    throw new Error("requirement_policies must be an array");
  }

  for (const entry of specification.requirement_policies) {
    if (
      !entry.observation_resource_requirement_key ||
      entry.observation_resource_requirement_key.trim().length === 0
    ) {
      throw new Error("observation_resource_requirement_key must be non-empty");
    }

    if (!Array.isArray(entry.member_binding_keys)) {
      throw new Error(
        `member_binding_keys must be an array for requirement ${entry.observation_resource_requirement_key}`
      );
    }

    const contexts = requirementContexts.get(
      entry.observation_resource_requirement_key
    );
    if (!contexts || contexts.length === 0) {
      throw new Error(
        `Observation Resource Requirement ${entry.observation_resource_requirement_key} not found in RESOURCE_READINESS Observation Context Binding set`
      );
    }
    if (contexts.length > 1) {
      throw new Error(
        `Ambiguous Observation Resource Requirement ${entry.observation_resource_requirement_key} across Candidates`
      );
    }

    const context = contexts[0]!;
    if (context.requirementAssessment.bindings.length === 0) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Policy requires at least one GROUND-133 binding for requirement ${entry.observation_resource_requirement_key}`
      );
    }

    const composition_kind = normalizeCompositionKind(entry.composition_kind);
    const member_binding_keys =
      canonicalizeResourceReadinessBindingEvidenceCompositionMemberKeys(
        entry.member_binding_keys
      );

    if (member_binding_keys.length === 0) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Policy forbids empty member sets for requirement ${entry.observation_resource_requirement_key} (vacuous ANY/ALL forbidden)`
      );
    }

    const requirement = context.requirementAssessment.resource_requirement;
    for (const memberKey of member_binding_keys) {
      const binding = context.bindingByKey.get(memberKey);
      if (!binding) {
        throw new Error(
          `Unknown or stale RESOURCE_READINESS Observation Context Binding key ${memberKey} for requirement ${entry.observation_resource_requirement_key}`
        );
      }
      if (binding.candidate_key !== requirement.candidate_key) {
        throw new Error(
          `Cross-Candidate RESOURCE_READINESS Binding Evidence Composition member ${memberKey}`
        );
      }
      if (binding.observation_need_key !== requirement.observation_need_key) {
        throw new Error(
          `Cross-Need RESOURCE_READINESS Binding Evidence Composition member ${memberKey}`
        );
      }
      if (
        binding.capability_requirement_set_key !==
        requirement.capability_requirement_set_key
      ) {
        throw new Error(
          `Cross-Capability Requirement-set RESOURCE_READINESS Binding Evidence Composition member ${memberKey}`
        );
      }
      if (
        binding.observation_resource_requirement_key !==
        requirement.key
      ) {
        throw new Error(
          `Cross-requirement RESOURCE_READINESS Binding Evidence Composition member ${memberKey}`
        );
      }
    }

    const normalized: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput =
      {
        observation_resource_requirement_key:
          entry.observation_resource_requirement_key,
        member_binding_keys,
        composition_kind,
      };

    const existing = byRequirementKey.get(
      entry.observation_resource_requirement_key
    );
    if (existing) {
      if (!policiesEqual(existing, normalized)) {
        throw new Error(
          `Conflicting RESOURCE_READINESS Binding Evidence Composition Policies declared for requirement ${entry.observation_resource_requirement_key}`
        );
      }
      continue;
    }

    byRequirementKey.set(
      entry.observation_resource_requirement_key,
      normalized
    );
  }

  const requirement_policies = [...byRequirementKey.values()].sort((a, b) =>
    compareStrings(
      a.observation_resource_requirement_key,
      b.observation_resource_requirement_key
    )
  );

  return { requirement_policies };
}

function buildPolicy(
  requirementAssessment: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
  input: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy {
  const requirement = requirementAssessment.resource_requirement;
  const member_binding_keys =
    canonicalizeResourceReadinessBindingEvidenceCompositionMemberKeys(
      input.member_binding_keys
    );
  const composition_kind = normalizeCompositionKind(input.composition_kind);

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyKey(
      {
        candidate_key: requirement.candidate_key,
        observation_need_key: requirement.observation_need_key,
        capability_requirement_set_key:
          requirement.capability_requirement_set_key,
        observation_resource_requirement_key: requirement.key,
        member_binding_keys,
        composition_kind,
      }
    ),
    candidate_key: requirement.candidate_key,
    observation_need_key: requirement.observation_need_key,
    capability_requirement_set_key: requirement.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: requirement.key,
    member_binding_keys,
    composition_kind,
  };
}

function assertRequirementPolicyAssessmentInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_PRESENT"
  ) {
    if (assessment.policy === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Policy invariant violated: PRESENT requires non-null policy for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (!assessment.has_explicit_resource_readiness_binding_evidence_composition_policy) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Policy invariant violated: PRESENT requires boolean true for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.policy.member_binding_keys.length === 0) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Policy invariant violated: empty member set for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_DECLARED"
  ) {
    if (assessment.policy !== null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Policy invariant violated: NO_POLICY requires null policy for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.has_explicit_resource_readiness_binding_evidence_composition_policy) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Policy invariant violated: NO_POLICY requires boolean false for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown RESOURCE_READINESS Binding Evidence Composition Policy status: ${String(assessment.status)}`
  );
}

function assessRequirementPolicy(
  requirementAssessment: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
  declared: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput | undefined
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment {
  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment =
      {
        observation_resource_requirement_key:
          requirementAssessment.observation_resource_requirement_key,
        requirement_binding_assessment: requirementAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_DECLARED",
        policy: null,
        has_explicit_resource_readiness_binding_evidence_composition_policy: false,
      };
    assertRequirementPolicyAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyRequirementAssessment =
    {
      observation_resource_requirement_key:
        requirementAssessment.observation_resource_requirement_key,
      requirement_binding_assessment: requirementAssessment,
      status:
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_PRESENT",
      policy: buildPolicy(requirementAssessment, declared),
      has_explicit_resource_readiness_binding_evidence_composition_policy: true,
    };
  assertRequirementPolicyAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Binding Evidence Composition Policy assessment.
 * Does not consume GROUND-141 States or evaluate ANY/ALL.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  policyByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyAssessment {
  const requirement_policy_assessments =
    bindingAssessment.requirement_binding_assessments.map(
      (requirementAssessment) =>
        assessRequirementPolicy(
          requirementAssessment,
          policyByRequirementKey.get(
            requirementAssessment.observation_resource_requirement_key
          )
        )
    );

  return {
    candidate_key: bindingAssessment.candidate_key,
    resource_readiness_observation_context_binding_assessment: bindingAssessment,
    requirement_policy_assessments,
    has_explicit_resource_readiness_binding_evidence_composition_policies:
      requirement_policy_assessments.some(
        (assessment) =>
          assessment.has_explicit_resource_readiness_binding_evidence_composition_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit RESOURCE_READINESS Binding Evidence Composition Policy.
 * Preserves GROUND-133 AttentionCandidate order.
 * Does not match current GROUND-141 States or produce composition results.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySet(
  input: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification(
      input.resource_readiness_observation_context_binding_set,
      input.specification
    );

  const policyByRequirementKey = new Map(
    normalizedSpecification.requirement_policies.map((entry) => [
      entry.observation_resource_requirement_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_observation_context_binding_set.candidate_assessments.map(
      (bindingAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicy(
          bindingAssessment,
          policyByRequirementKey
        )
    );

  return {
    resource_readiness_observation_context_binding_set:
      input.resource_readiness_observation_context_binding_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_resource_readiness_binding_evidence_composition_policies:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_resource_readiness_binding_evidence_composition_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
