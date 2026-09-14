/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Composition Readiness Basis (GROUND-078).
 *
 * Pure composition of:
 *   GROUND-075 Current Capability Requirement Satisfaction States
 *   GROUND-077 Explicit Capability Requirement Set Composition Readiness Policy
 *
 * Answers only whether the explicit all-resolved readiness-policy condition
 * currently holds over the exact Requirement set.
 *
 * Must not import GROUND-061–074 / GROUND-076 runtime cores.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * readiness policy condition HOLDS ≠ Requirement-set composition result
 * readiness policy condition DOES_NOT_HOLD ≠ Capability absence
 * resolved = SATISFIED or UNSATISFIED
 * resolved ≠ SATISFIED-only
 * all resolved ≠ all SATISFIED
 * READY / NOT_READY vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionState,
} from "./attention-observation-capability-requirement-satisfaction-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessPolicyAssessment,
  AttentionObservationCapabilityRequirementSetCompositionReadinessPolicy,
  AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySetAssessment,
} from "./attention-observation-capability-requirement-set-composition-readiness-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment,
  AttentionObservationCapabilityRequirementSetCompositionReadinessBasis,
  AttentionObservationCapabilityRequirementSetCompositionReadinessInput,
  AttentionObservationCapabilityRequirementSetCompositionReadinessModelLimitation,
  AttentionObservationCapabilityRequirementSetCompositionReadinessOutcome,
  AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment,
  AttentionObservationCapabilityRequirementSetCompositionReadinessStatus,
  AttentionObservationCapabilityRequirementSetCompositionUnresolvedRequirementRef,
  AttentionObservationCapabilityRequirementSetCompositionUnresolvedSatisfactionState,
} from "./attention-observation-capability-requirement-set-composition-readiness-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementSetCompositionReadinessModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_STATE_NOT_MODELED",
    "CAPABILITY_TRUTH_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_READINESS_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_RESOLVED_SUBSET_COMPOSITION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_AS_UNSATISFIED_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_IGNORE_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_READINESS_PARTIALITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_READINESS_SCORE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_READINESS_THRESHOLD_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_READINESS_WEIGHTING_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_READINESS_MAJORITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_READINESS_VETO_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_MANDATORY_GROUPS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_ALTERNATIVE_GROUPS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_PRIORITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_RECENCY_PRECEDENCE_NOT_MODELED",
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

const CONTEXT_MISMATCH_PREFIX =
  "Capability Requirement Satisfaction set and Requirement Set Composition Readiness Policy set do not share the same Capability Requirement context";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Exhaustive resolved-state classifier authorized by GROUND-077 readiness policy.
 * SATISFIED and UNSATISFIED are both resolved.
 * Both UNRESOLVED_* states are unresolved.
 * No fallback coercion.
 * Not a Capability-truth classifier.
 */
export function isResolvedCapabilityRequirementSatisfactionState(
  state: AttentionObservationCapabilityRequirementSatisfactionState
): boolean {
  switch (state) {
    case "SATISFIED":
      return true;
    case "UNSATISFIED":
      return true;
    case "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY":
      return false;
    case "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE":
      return false;
  }
}

function isUnresolvedSatisfactionState(
  state: AttentionObservationCapabilityRequirementSatisfactionState
): state is AttentionObservationCapabilityRequirementSetCompositionUnresolvedSatisfactionState {
  return !isResolvedCapabilityRequirementSatisfactionState(state);
}

export function buildCanonicalCapabilityRequirementSatisfactionStateBasisSetKey(
  satisfactionStateBasisKeys: readonly string[]
): string {
  const canonical = [...satisfactionStateBasisKeys].sort(compareStrings);
  return canonical.length > 0 ? canonical.join(",") : "none";
}

export function attentionObservationCapabilityRequirementSetCompositionReadinessBasisKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  readinessPolicyKey: string,
  satisfactionStateBasisKeys: readonly string[],
  outcome: AttentionObservationCapabilityRequirementSetCompositionReadinessOutcome
): string {
  return [
    "attention-observation-capability-requirement-set-composition-readiness-basis",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    readinessPolicyKey,
    buildCanonicalCapabilityRequirementSatisfactionStateBasisSetKey(
      satisfactionStateBasisKeys
    ),
    outcome,
  ].join("|");
}

function stringSetsEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function assertCompatibleCapabilityRequirementSetCompositionReadinessContexts(
  satisfactionSet: AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
  readinessPolicySet: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicySetAssessment
): void {
  const satisfactionCandidates = satisfactionSet.candidate_assessments;
  const policyCandidates = readinessPolicySet.candidate_assessments;

  if (satisfactionCandidates.length !== policyCandidates.length) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const policyByKey = new Map(
    policyCandidates.map((c) => [c.candidate_key, c])
  );

  for (const satisfactionCandidate of satisfactionCandidates) {
    const policyCandidate = policyByKey.get(
      satisfactionCandidate.candidate_key
    );
    if (!policyCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing candidate ${satisfactionCandidate.candidate_key}`
      );
    }

    if (
      satisfactionCandidate.candidate_key !== policyCandidate.candidate_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch`
      );
    }

    const satisfactionReqs =
      satisfactionCandidate.requirement_satisfaction_assessments;
    const policy = policyCandidate.capability_requirement_set_composition_readiness_policy;

    if (
      policyCandidate.status ===
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_PRESENT" &&
      policy !== null
    ) {
      if (policy.capability_requirement_keys.length === 0) {
        throw new Error(
          `Requirement Set Composition Readiness invariant violated: readiness policy PRESENT with empty Requirement domain for candidate ${satisfactionCandidate.candidate_key}`
        );
      }

      const satisfactionKeys = canonicalizeCapabilityRequirementKeys(
        satisfactionReqs.map((r) => r.capability_requirement.key)
      );
      const policyKeys = canonicalizeCapabilityRequirementKeys(
        policy.capability_requirement_keys
      );

      if (!stringSetsEqual(satisfactionKeys, policyKeys)) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX} for candidate ${satisfactionCandidate.candidate_key}: Requirement-key set mismatch`
        );
      }

      if (satisfactionReqs.length > 0) {
        const observationNeedKey =
          satisfactionReqs[0]!.capability_requirement.observation_need_key;
        for (const assessment of satisfactionReqs) {
          if (
            assessment.capability_requirement.observation_need_key !==
            observationNeedKey
          ) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX} for candidate ${satisfactionCandidate.candidate_key}: ObservationNeed key mismatch within Satisfaction set`
            );
          }
        }
        if (policy.observation_need_key !== observationNeedKey) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX} for candidate ${satisfactionCandidate.candidate_key}: ObservationNeed key mismatch`
          );
        }

        const derivedSetKey = buildAttentionObservationCapabilityRequirementSetKey(
          satisfactionCandidate.candidate_key,
          observationNeedKey,
          satisfactionKeys
        );
        if (derivedSetKey !== policy.capability_requirement_set_key) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX} for candidate ${satisfactionCandidate.candidate_key}: Requirement-set key mismatch`
          );
        }
      }
    }
  }
}

function assertSatisfactionStateDomainExactness(
  assessments: readonly AttentionObservationCapabilityRequirementSatisfactionAssessment[],
  expectedRequirementKeys: readonly string[],
  candidateKey: string
): Map<string, AttentionObservationCapabilityRequirementSatisfactionAssessment> {
  const byKey = new Map<
    string,
    AttentionObservationCapabilityRequirementSatisfactionAssessment
  >();

  for (const assessment of assessments) {
    const reqKey = assessment.capability_requirement.key;
    if (byKey.has(reqKey)) {
      throw new Error(
        `Duplicate Capability Requirement Satisfaction State for capability requirement ${reqKey} on candidate ${candidateKey}`
      );
    }
    byKey.set(reqKey, assessment);
  }

  for (const expectedKey of expectedRequirementKeys) {
    if (!byKey.has(expectedKey)) {
      throw new Error(
        `Missing Capability Requirement Satisfaction State for capability requirement ${expectedKey} on candidate ${candidateKey}`
      );
    }
  }

  if (byKey.size !== expectedRequirementKeys.length) {
    throw new Error(
      `Extra Capability Requirement Satisfaction State for candidate ${candidateKey}`
    );
  }

  return byKey;
}

function assertReadinessBasisInvariant(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment
): void {
  if (
    assessment.status ===
      "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT" &&
    assessment.readiness_basis === null
  ) {
    throw new Error(
      `Requirement Set Composition Readiness invariant violated: PRESENT requires non-null basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT" &&
    assessment.readiness_basis !== null
  ) {
    throw new Error(
      `Requirement Set Composition Readiness invariant violated: non-present status requires null basis for candidate ${assessment.candidate_key}`
    );
  }
}

function evaluateReadinessBasis(
  candidateKey: string,
  policy: AttentionObservationCapabilityRequirementSetCompositionReadinessPolicy,
  satisfactionByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityRequirementSatisfactionAssessment
  >
): AttentionObservationCapabilityRequirementSetCompositionReadinessBasis {
  const requirementKeys = canonicalizeCapabilityRequirementKeys(
    policy.capability_requirement_keys
  );

  if (requirementKeys.length === 0) {
    throw new Error(
      `Requirement Set Composition Readiness invariant violated: empty Requirement domain for candidate ${candidateKey}`
    );
  }

  const satisfactionStateBasisKeys: string[] = [];
  const unresolvedRequirementRefs: AttentionObservationCapabilityRequirementSetCompositionUnresolvedRequirementRef[] =
    [];

  for (const requirementKey of requirementKeys) {
    const assessment = satisfactionByRequirementKey.get(requirementKey);
    if (!assessment) {
      throw new Error(
        `Missing Capability Requirement Satisfaction State for capability requirement ${requirementKey} on candidate ${candidateKey}`
      );
    }

    const stateBasis = assessment.satisfaction_state_basis;
    satisfactionStateBasisKeys.push(stateBasis.key);

    const state = stateBasis.satisfaction_state;
    if (isUnresolvedSatisfactionState(state)) {
      unresolvedRequirementRefs.push({
        capability_requirement_key: requirementKey,
        satisfaction_state_basis_key: stateBasis.key,
        unresolved_satisfaction_state: state,
      });
    }
  }

  // Non-empty domain already asserted — all-resolved readiness evaluation.
  const outcome: AttentionObservationCapabilityRequirementSetCompositionReadinessOutcome =
    unresolvedRequirementRefs.length === 0
      ? "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      : "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

  return {
    key: attentionObservationCapabilityRequirementSetCompositionReadinessBasisKey(
      candidateKey,
      policy.observation_need_key,
      policy.capability_requirement_set_key,
      policy.key,
      satisfactionStateBasisKeys,
      outcome
    ),
    candidate_key: candidateKey,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    readiness_policy_key: policy.key,
    readiness_kind: policy.readiness_kind,
    capability_requirement_satisfaction_state_basis_keys:
      satisfactionStateBasisKeys,
    unresolved_requirement_refs: unresolvedRequirementRefs,
    outcome,
  };
}

/**
 * Pure per-Candidate Requirement Set Composition Readiness assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_...READINESS_POLICY
 * 4. CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT
 *
 * Does not execute GROUND-076 ANY/ALL composition.
 * Does not derive Capability truth.
 */
export function assessAttentionCandidateObservationCapabilityRequirementSetCompositionReadiness(
  satisfactionAssessment: AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment,
  readinessPolicyAssessment: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessPolicyAssessment
): AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment {
  const candidate_key = satisfactionAssessment.candidate_key;

  if (candidate_key !== readinessPolicyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch (${candidate_key} vs ${readinessPolicyAssessment.candidate_key})`
    );
  }

  const notApplicable = (
    status: AttentionObservationCapabilityRequirementSetCompositionReadinessStatus
  ): AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment => {
    const assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment =
      {
        candidate_key,
        capability_requirement_satisfaction_assessment: satisfactionAssessment,
        capability_requirement_set_composition_readiness_policy_assessment:
          readinessPolicyAssessment,
        status,
        readiness_basis: null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_MODEL_LIMITATIONS,
        ],
      };
    assertReadinessBasisInvariant(assessment);
    return assessment;
  };

  if (
    satisfactionAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    readinessPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    satisfactionAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    readinessPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    readinessPolicyAssessment.status ===
      "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_DECLARED" ||
    readinessPolicyAssessment.capability_requirement_set_composition_readiness_policy ===
      null
  ) {
    return notApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY"
    );
  }

  const policy =
    readinessPolicyAssessment.capability_requirement_set_composition_readiness_policy;

  if (policy.capability_requirement_keys.length === 0) {
    throw new Error(
      `Requirement Set Composition Readiness invariant violated: readiness policy PRESENT with empty Requirement domain for candidate ${candidate_key}`
    );
  }

  const satisfactionByRequirementKey = assertSatisfactionStateDomainExactness(
    satisfactionAssessment.requirement_satisfaction_assessments,
    canonicalizeCapabilityRequirementKeys(policy.capability_requirement_keys),
    candidate_key
  );

  const readiness_basis = evaluateReadinessBasis(
    candidate_key,
    policy,
    satisfactionByRequirementKey
  );

  const assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment =
    {
      candidate_key,
      capability_requirement_satisfaction_assessment: satisfactionAssessment,
      capability_requirement_set_composition_readiness_policy_assessment:
        readinessPolicyAssessment,
      status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT",
      readiness_basis,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_MODEL_LIMITATIONS,
      ],
    };
  assertReadinessBasisInvariant(assessment);
  return assessment;
}

function hasAnyReadinessBasis(
  assessments: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Capability Requirement Set Composition Readiness Basis composition.
 * Preserves Candidate order from GROUND-075.
 * Does not execute GROUND-076 ANY/ALL or produce Capability truth.
 */
export function buildAttentionObservationCapabilityRequirementSetCompositionReadinessSet(
  input: AttentionObservationCapabilityRequirementSetCompositionReadinessInput
): AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment {
  assertCompatibleCapabilityRequirementSetCompositionReadinessContexts(
    input.capability_requirement_satisfaction_set,
    input.capability_requirement_set_composition_readiness_policy_set
  );

  const policyByCandidateKey = new Map(
    input.capability_requirement_set_composition_readiness_policy_set.candidate_assessments.map(
      (assessment) => [assessment.candidate_key, assessment]
    )
  );

  const candidate_assessments =
    input.capability_requirement_satisfaction_set.candidate_assessments.map(
      (satisfactionAssessment) => {
        const readinessPolicyAssessment = policyByCandidateKey.get(
          satisfactionAssessment.candidate_key
        );
        if (!readinessPolicyAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing readiness policy assessment for candidate ${satisfactionAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationCapabilityRequirementSetCompositionReadiness(
          satisfactionAssessment,
          readinessPolicyAssessment
        );
      }
    );

  return {
    capability_requirement_satisfaction_set:
      input.capability_requirement_satisfaction_set,
    capability_requirement_set_composition_readiness_policy_set:
      input.capability_requirement_set_composition_readiness_policy_set,
    candidate_assessments,
    has_capability_requirement_set_composition_readiness_basis:
      hasAnyReadinessBasis(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_MODEL_LIMITATIONS,
    ],
  };
}
