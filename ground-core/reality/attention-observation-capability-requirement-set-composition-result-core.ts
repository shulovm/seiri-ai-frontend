/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Composition Result (GROUND-079).
 *
 * Pure composition of:
 *   GROUND-075 Current Capability Requirement Satisfaction States
 *   GROUND-076 Explicit Capability Requirement Set Composition Policy
 *   GROUND-078 Capability Requirement Set Composition Readiness Basis
 *
 * Answers only whether the exact GROUND-076 ANY/ALL condition holds over
 * readiness-authorized resolved GROUND-075 Satisfaction States.
 *
 * Must not import GROUND-061–074 / GROUND-077 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * composition condition HOLDS ≠ Capability truth
 * composition condition DOES_NOT_HOLD ≠ Capability absence
 * readiness DOES_NOT_HOLD ≠ composition DOES_NOT_HOLD
 * READY / PASS / FAIL / HAS_CAPABILITY vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionState,
} from "./attention-observation-capability-requirement-satisfaction-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment,
  AttentionObservationCapabilityRequirementSetCompositionPolicy,
  AttentionObservationCapabilityRequirementSetCompositionPolicyKind,
  AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment,
} from "./attention-observation-capability-requirement-set-composition-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment,
  AttentionObservationCapabilityRequirementSetCompositionReadinessBasis,
  AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment,
} from "./attention-observation-capability-requirement-set-composition-readiness-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment,
  AttentionObservationCapabilityRequirementSetCompositionInput,
  AttentionObservationCapabilityRequirementSetCompositionModelLimitation,
  AttentionObservationCapabilityRequirementSetCompositionOutcome,
  AttentionObservationCapabilityRequirementSetCompositionResultBasis,
  AttentionObservationCapabilityRequirementSetCompositionSetAssessment,
  AttentionObservationCapabilityRequirementSetCompositionStatus,
} from "./attention-observation-capability-requirement-set-composition-result-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementSetCompositionModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_NOT_MODELED",
    "CAPABILITY_COMPOSITION_INTERPRETATION_POLICY_NOT_MODELED",
    "CAPABILITY_COMPOSITION_INTERPRETATION_BASIS_NOT_MODELED",
    "CAPABILITY_STATE_NOT_MODELED",
    "CAPABILITY_TRUTH_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_COMPOSITION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_RESOLVED_SUBSET_COMPOSITION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_AS_UNSATISFIED_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_UNRESOLVED_IGNORE_SEMANTICS_NOT_MODELED",
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
  "Capability Requirement Satisfaction set, Requirement Set Composition Policy set, and Requirement Set Composition Readiness set do not share the same Capability Requirement context";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function stringSetsEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort(compareStrings);
  const sortedB = [...b].sort(compareStrings);
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
}

function isResolvedCompositionSatisfactionState(
  state: AttentionObservationCapabilityRequirementSatisfactionState
): state is "SATISFIED" | "UNSATISFIED" {
  return state === "SATISFIED" || state === "UNSATISFIED";
}

export function buildCanonicalCapabilityRequirementSatisfactionStateBasisSetKeyForComposition(
  satisfactionStateBasisKeys: readonly string[]
): string {
  const canonical = [...satisfactionStateBasisKeys].sort(compareStrings);
  return canonical.length > 0 ? canonical.join(",") : "none";
}

export function attentionObservationCapabilityRequirementSetCompositionResultKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  compositionPolicyKey: string,
  readinessBasisKey: string,
  satisfactionStateBasisKeys: readonly string[],
  outcome: AttentionObservationCapabilityRequirementSetCompositionOutcome
): string {
  return [
    "attention-observation-capability-requirement-set-composition-result",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    compositionPolicyKey,
    readinessBasisKey,
    buildCanonicalCapabilityRequirementSatisfactionStateBasisSetKeyForComposition(
      satisfactionStateBasisKeys
    ),
    outcome,
  ].join("|");
}

/**
 * ANY / ALL over exact non-empty resolved Requirement Satisfaction States.
 * Empty domain is an invariant violation — never vacuous truth / vacuous false.
 */
export function evaluateRequirementSetCompositionPolicyCondition(
  compositionKind: AttentionObservationCapabilityRequirementSetCompositionPolicyKind,
  satisfactionStates: readonly AttentionObservationCapabilityRequirementSatisfactionState[]
): AttentionObservationCapabilityRequirementSetCompositionOutcome {
  if (satisfactionStates.length === 0) {
    throw new Error(
      "Requirement Set Composition Result invariant violated: empty Capability Requirement domain (vacuous ANY/ALL forbidden)"
    );
  }

  for (const state of satisfactionStates) {
    if (!isResolvedCompositionSatisfactionState(state)) {
      throw new Error(
        `Requirement Set Composition Result invariant violated: unresolved Satisfaction State ${state} under readiness HOLDS`
      );
    }
  }

  if (
    compositionKind ===
    "ANY_CAPABILITY_REQUIREMENT_SATISFACTION_STATE_IS_SATISFIED"
  ) {
    // Non-empty precondition asserted above.
    return satisfactionStates.some((state) => state === "SATISFIED")
      ? "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS"
      : "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD";
  }

  if (
    compositionKind ===
    "ALL_CAPABILITY_REQUIREMENT_SATISFACTION_STATES_ARE_SATISFIED"
  ) {
    // Non-empty precondition asserted above.
    return satisfactionStates.every((state) => state === "SATISFIED")
      ? "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS"
      : "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD";
  }

  throw new Error(
    `Unknown Capability Requirement Set Composition Policy kind: ${String(compositionKind)}`
  );
}

export function assertCompatibleCapabilityRequirementSetCompositionContexts(
  satisfactionSet: AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
  compositionPolicySet: AttentionObservationCapabilityRequirementSetCompositionPolicySetAssessment,
  readinessSet: AttentionObservationCapabilityRequirementSetCompositionReadinessSetAssessment
): void {
  const satisfactionCandidates = satisfactionSet.candidate_assessments;
  const policyCandidates = compositionPolicySet.candidate_assessments;
  const readinessCandidates = readinessSet.candidate_assessments;

  if (
    satisfactionCandidates.length !== policyCandidates.length ||
    satisfactionCandidates.length !== readinessCandidates.length
  ) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const policyByKey = new Map(
    policyCandidates.map((c) => [c.candidate_key, c])
  );
  const readinessByKey = new Map(
    readinessCandidates.map((c) => [c.candidate_key, c])
  );

  for (const satisfactionCandidate of satisfactionCandidates) {
    const policyCandidate = policyByKey.get(
      satisfactionCandidate.candidate_key
    );
    const readinessCandidate = readinessByKey.get(
      satisfactionCandidate.candidate_key
    );
    if (!policyCandidate || !readinessCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing candidate ${satisfactionCandidate.candidate_key}`
      );
    }

    if (
      satisfactionCandidate.candidate_key !== policyCandidate.candidate_key ||
      satisfactionCandidate.candidate_key !== readinessCandidate.candidate_key
    ) {
      throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch`);
    }

    const policy =
      policyCandidate.capability_requirement_set_composition_policy;
    const readinessBasis = readinessCandidate.readiness_basis;
    const satisfactionReqs =
      satisfactionCandidate.requirement_satisfaction_assessments;

    if (
      policyCandidate.status ===
        "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT" &&
      policy !== null &&
      readinessCandidate.status ===
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT" &&
      readinessBasis !== null
    ) {
      assertSharedDomainConsistency(
        satisfactionCandidate.candidate_key,
        satisfactionReqs,
        policy,
        readinessBasis
      );
    }
  }
}

function assertSharedDomainConsistency(
  candidateKey: string,
  satisfactionReqs: readonly AttentionObservationCapabilityRequirementSatisfactionAssessment[],
  policy: AttentionObservationCapabilityRequirementSetCompositionPolicy,
  readinessBasis: AttentionObservationCapabilityRequirementSetCompositionReadinessBasis
): void {
  const satisfactionKeys = canonicalizeCapabilityRequirementKeys(
    satisfactionReqs.map((r) => r.capability_requirement.key)
  );
  const policyKeys = canonicalizeCapabilityRequirementKeys(
    policy.capability_requirement_keys
  );

  if (!stringSetsEqual(satisfactionKeys, policyKeys)) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidateKey}: Requirement-key set mismatch with composition policy`
    );
  }

  if (satisfactionKeys.length === 0) {
    throw new Error(
      `Requirement Set Composition Result invariant violated: empty Capability Requirement domain for candidate ${candidateKey}`
    );
  }

  const observationNeedKey =
    satisfactionReqs[0]!.capability_requirement.observation_need_key;
  for (const assessment of satisfactionReqs) {
    if (
      assessment.capability_requirement.observation_need_key !==
      observationNeedKey
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidateKey}: ObservationNeed key mismatch within Satisfaction set`
      );
    }
  }

  if (
    policy.observation_need_key !== observationNeedKey ||
    readinessBasis.observation_need_key !== observationNeedKey
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidateKey}: ObservationNeed key mismatch`
    );
  }

  if (
    policy.candidate_key !== candidateKey ||
    readinessBasis.candidate_key !== candidateKey
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidateKey}: Candidate key mismatch in policy/readiness lineage`
    );
  }

  const derivedSetKey = buildAttentionObservationCapabilityRequirementSetKey(
    candidateKey,
    observationNeedKey,
    satisfactionKeys
  );
  if (
    derivedSetKey !== policy.capability_requirement_set_key ||
    derivedSetKey !== readinessBasis.capability_requirement_set_key ||
    policy.capability_requirement_set_key !==
      readinessBasis.capability_requirement_set_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidateKey}: Requirement-set key mismatch`
    );
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

function assertResultInvariant(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment
): void {
  if (
    assessment.status ===
      "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT" &&
    assessment.composition_result_basis === null
  ) {
    throw new Error(
      `Requirement Set Composition Result invariant violated: PRESENT requires non-null basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT" &&
    assessment.composition_result_basis !== null
  ) {
    throw new Error(
      `Requirement Set Composition Result invariant violated: non-present status requires null basis for candidate ${assessment.candidate_key}`
    );
  }
}

function buildCompositionResultBasis(
  candidateKey: string,
  policy: AttentionObservationCapabilityRequirementSetCompositionPolicy,
  readinessBasis: AttentionObservationCapabilityRequirementSetCompositionReadinessBasis,
  satisfactionByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityRequirementSatisfactionAssessment
  >
): AttentionObservationCapabilityRequirementSetCompositionResultBasis {
  const requirementKeys = canonicalizeCapabilityRequirementKeys(
    policy.capability_requirement_keys
  );

  if (requirementKeys.length === 0) {
    throw new Error(
      `Requirement Set Composition Result invariant violated: empty Capability Requirement domain for candidate ${candidateKey}`
    );
  }

  // Stale readiness firewall: current 075 state basis set must equal 078 lineage.
  const currentStateBasisKeys: string[] = [];
  const satisfactionStates: AttentionObservationCapabilityRequirementSatisfactionState[] =
    [];

  for (const requirementKey of requirementKeys) {
    const assessment = satisfactionByRequirementKey.get(requirementKey);
    if (!assessment) {
      throw new Error(
        `Missing Capability Requirement Satisfaction State for capability requirement ${requirementKey} on candidate ${candidateKey}`
      );
    }
    currentStateBasisKeys.push(assessment.satisfaction_state_basis.key);
    satisfactionStates.push(
      assessment.satisfaction_state_basis.satisfaction_state
    );
  }

  if (
    !stringSetsEqual(
      currentStateBasisKeys,
      readinessBasis.capability_requirement_satisfaction_state_basis_keys
    )
  ) {
    throw new Error(
      `Requirement Set Composition Result invariant violated: stale readiness basis for candidate ${candidateKey} (current 075 Satisfaction State Basis set differs from 078 evaluated set)`
    );
  }

  // Contract check under readiness HOLDS — not readiness recomputation.
  for (const state of satisfactionStates) {
    if (!isResolvedCompositionSatisfactionState(state)) {
      throw new Error(
        `Requirement Set Composition Result invariant violated: unresolved Satisfaction State ${state} under readiness HOLDS for candidate ${candidateKey}`
      );
    }
  }

  const outcome = evaluateRequirementSetCompositionPolicyCondition(
    policy.composition_kind,
    satisfactionStates
  );

  return {
    key: attentionObservationCapabilityRequirementSetCompositionResultKey(
      candidateKey,
      policy.observation_need_key,
      policy.capability_requirement_set_key,
      policy.key,
      readinessBasis.key,
      currentStateBasisKeys,
      outcome
    ),
    candidate_key: candidateKey,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    requirement_set_composition_policy_key: policy.key,
    requirement_set_composition_readiness_basis_key: readinessBasis.key,
    composition_kind: policy.composition_kind,
    capability_requirement_satisfaction_state_basis_keys: currentStateBasisKeys,
    outcome,
  };
}

/**
 * Pure per-Candidate Requirement Set Composition Result assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_...COMPOSITION_POLICY
 * 4. NOT_APPLICABLE_NO_EXPLICIT_...READINESS_POLICY
 * 5. NOT_APPLICABLE_...READINESS_POLICY_CONDITION_DOES_NOT_HOLD
 * 6. CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT
 *
 * Does not recompute readiness.
 * Does not derive Capability truth.
 */
export function assessAttentionCandidateObservationCapabilityRequirementSetComposition(
  satisfactionAssessment: AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment,
  compositionPolicyAssessment: AttentionCandidateObservationCapabilityRequirementSetCompositionPolicyAssessment,
  readinessAssessment: AttentionCandidateObservationCapabilityRequirementSetCompositionReadinessAssessment
): AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment {
  const candidate_key = satisfactionAssessment.candidate_key;

  if (
    candidate_key !== compositionPolicyAssessment.candidate_key ||
    candidate_key !== readinessAssessment.candidate_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch (${candidate_key})`
    );
  }

  const notApplicable = (
    status: AttentionObservationCapabilityRequirementSetCompositionStatus
  ): AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment => {
    const assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment =
      {
        candidate_key,
        capability_requirement_satisfaction_assessment: satisfactionAssessment,
        capability_requirement_set_composition_policy_assessment:
          compositionPolicyAssessment,
        capability_requirement_set_composition_readiness_assessment:
          readinessAssessment,
        status,
        composition_result_basis: null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_MODEL_LIMITATIONS,
        ],
      };
    assertResultInvariant(assessment);
    return assessment;
  };

  if (
    satisfactionAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    compositionPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    readinessAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    satisfactionAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    compositionPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    readinessAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    compositionPolicyAssessment.status ===
      "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_DECLARED" ||
    compositionPolicyAssessment.capability_requirement_set_composition_policy ===
      null
  ) {
    return notApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY"
    );
  }

  if (
    readinessAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY" ||
    readinessAssessment.readiness_basis === null
  ) {
    // Distinguish readiness DOES_NOT_HOLD (basis present) from policy absence.
    if (
      readinessAssessment.status ===
        "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT" &&
      readinessAssessment.readiness_basis === null
    ) {
      throw new Error(
        `Requirement Set Composition Result invariant violated: readiness BASIS_PRESENT with null basis for candidate ${candidate_key}`
      );
    }
    return notApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY"
    );
  }

  const readinessBasis = readinessAssessment.readiness_basis;

  if (
    readinessBasis.outcome ===
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    return notApplicable(
      "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
    );
  }

  if (
    readinessBasis.outcome !==
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
  ) {
    throw new Error(
      `Requirement Set Composition Result invariant violated: unknown readiness outcome ${String(readinessBasis.outcome)} for candidate ${candidate_key}`
    );
  }

  if (
    readinessAssessment.status !==
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT"
  ) {
    throw new Error(
      `Requirement Set Composition Result invariant violated: readiness HOLDS requires BASIS_PRESENT for candidate ${candidate_key}`
    );
  }

  if (
    compositionPolicyAssessment.status !==
    "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT"
  ) {
    throw new Error(
      `Requirement Set Composition Result invariant violated: composition execution requires composition policy PRESENT for candidate ${candidate_key}`
    );
  }

  const policy =
    compositionPolicyAssessment.capability_requirement_set_composition_policy;

  assertSharedDomainConsistency(
    candidate_key,
    satisfactionAssessment.requirement_satisfaction_assessments,
    policy,
    readinessBasis
  );

  const satisfactionByRequirementKey = assertSatisfactionStateDomainExactness(
    satisfactionAssessment.requirement_satisfaction_assessments,
    canonicalizeCapabilityRequirementKeys(policy.capability_requirement_keys),
    candidate_key
  );

  const composition_result_basis = buildCompositionResultBasis(
    candidate_key,
    policy,
    readinessBasis,
    satisfactionByRequirementKey
  );

  const assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment =
    {
      candidate_key,
      capability_requirement_satisfaction_assessment: satisfactionAssessment,
      capability_requirement_set_composition_policy_assessment:
        compositionPolicyAssessment,
      capability_requirement_set_composition_readiness_assessment:
        readinessAssessment,
      status: "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT",
      composition_result_basis,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_MODEL_LIMITATIONS,
      ],
    };
  assertResultInvariant(assessment);
  return assessment;
}

function hasAnyCompositionResult(
  assessments: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Capability Requirement Set Composition Result composition.
 * Preserves Candidate order from GROUND-075.
 * Does not recompute readiness or derive Capability truth.
 */
export function buildAttentionObservationCapabilityRequirementSetCompositionSet(
  input: AttentionObservationCapabilityRequirementSetCompositionInput
): AttentionObservationCapabilityRequirementSetCompositionSetAssessment {
  assertCompatibleCapabilityRequirementSetCompositionContexts(
    input.capability_requirement_satisfaction_set,
    input.capability_requirement_set_composition_policy_set,
    input.capability_requirement_set_composition_readiness_set
  );

  const policyByCandidateKey = new Map(
    input.capability_requirement_set_composition_policy_set.candidate_assessments.map(
      (assessment) => [assessment.candidate_key, assessment]
    )
  );
  const readinessByCandidateKey = new Map(
    input.capability_requirement_set_composition_readiness_set.candidate_assessments.map(
      (assessment) => [assessment.candidate_key, assessment]
    )
  );

  const candidate_assessments =
    input.capability_requirement_satisfaction_set.candidate_assessments.map(
      (satisfactionAssessment) => {
        const policyAssessment = policyByCandidateKey.get(
          satisfactionAssessment.candidate_key
        );
        const readinessAssessment = readinessByCandidateKey.get(
          satisfactionAssessment.candidate_key
        );
        if (!policyAssessment || !readinessAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing policy/readiness assessment for candidate ${satisfactionAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationCapabilityRequirementSetComposition(
          satisfactionAssessment,
          policyAssessment,
          readinessAssessment
        );
      }
    );

  return {
    capability_requirement_satisfaction_set:
      input.capability_requirement_satisfaction_set,
    capability_requirement_set_composition_policy_set:
      input.capability_requirement_set_composition_policy_set,
    capability_requirement_set_composition_readiness_set:
      input.capability_requirement_set_composition_readiness_set,
    candidate_assessments,
    has_capability_requirement_set_composition_result:
      hasAnyCompositionResult(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_COMPOSITION_MODEL_LIMITATIONS,
    ],
  };
}
