/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Dimension Evaluation State Interpretation Policy core (GROUND-104).
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit interpretation-policy specification
 * → Explicit Permission Dimension Evaluation State Interpretation Policy only.
 *
 * Declarative. Does not inspect current GROUND-103 Evaluation State.
 * Does not produce Interpretation Basis or Satisfaction State.
 *
 * Type-only dependency on GROUND-103 Evaluation State vocabulary.
 *
 * Must not import GROUND-103 core / 093–101 / 091 / 024–090 / 085 / ProjectState.
 *
 * policy value ≠ current Satisfaction
 * HOLDS ≠ default SATISFIED
 * DOES_NOT_HOLD ≠ default UNSATISFIED
 * explicit empty policy ≠ policy absence
 * unusual mappings are valid
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicy,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyEvalInput,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyInput,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySetAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyStatus,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Canonical GROUND-103 Evaluation State order — serialization only, not preference.
 */
export const CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_ORDER: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState[] =
  [
    "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
    "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
    "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED",
    "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED",
    "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
  ];

/**
 * Canonical interpretation order — serialization only, not preference.
 */
export const CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_ORDER: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation[] =
  [
    "INTERPRET_AS_PERMISSION_DIMENSION_SATISFIED",
    "INTERPRET_AS_PERMISSION_DIMENSION_UNSATISFIED",
  ];

export const EMPTY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET =
  "EMPTY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET" as const;

const EVALUATION_STATE_ORDER = new Map(
  CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_ORDER.map((s, i) => [s, i])
);

const INTERPRETATION_ORDER = new Map(
  CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_ORDER.map(
    (v, i) => [v, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeEvaluationState(
  state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState {
  if (!EVALUATION_STATE_ORDER.has(state)) {
    throw new Error(
      `Unknown Permission Dimension Evaluation State: ${String(state)}`
    );
  }
  return state;
}

function normalizeInterpretation(
  interpretation: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown Permission Dimension Evaluation State Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

/**
 * Canonical mapping-set key (deduped by evaluation state + fixed state order).
 * Empty mapping set serializes as EMPTY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET.
 */
export function buildCanonicalPermissionDimensionEvaluationStateInterpretationMappingSetKey(
  mappings: readonly AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[]
): string {
  const normalized =
    canonicalizePermissionDimensionEvaluationStateInterpretationMappings(
      mappings
    );
  if (normalized.length === 0) {
    return EMPTY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET;
  }
  return normalized
    .map(
      (m) =>
        `${m.permission_dimension_evaluation_state}|${m.interpretation}`
    )
    .join(",");
}

export function canonicalizePermissionDimensionEvaluationStateInterpretationMappings(
  mappings: readonly AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[]
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[] {
  const byState = new Map<
    AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
    AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretation
  >();

  for (const mapping of mappings) {
    const permission_dimension_evaluation_state = normalizeEvaluationState(
      mapping.permission_dimension_evaluation_state
    );
    const interpretation = normalizeInterpretation(mapping.interpretation);
    const existing = byState.get(permission_dimension_evaluation_state);
    if (existing !== undefined) {
      if (existing !== interpretation) {
        throw new Error(
          `Conflicting Permission Dimension Evaluation State Interpretation mappings for evaluation state ${permission_dimension_evaluation_state}`
        );
      }
      continue;
    }
    byState.set(permission_dimension_evaluation_state, interpretation);
  }

  const result: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[] =
    [];
  for (const permission_dimension_evaluation_state of CANONICAL_PERMISSION_DIMENSION_EVALUATION_STATE_ORDER) {
    const interpretation = byState.get(permission_dimension_evaluation_state);
    if (interpretation !== undefined) {
      result.push({
        permission_dimension_evaluation_state,
        interpretation,
      });
    }
  }
  return result;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|PERMISSION|canonicalMappingSet
 */
export function attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  mappings: readonly AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[];
}): string {
  return [
    "attention-observation-operational-eligibility-permission-dimension-evaluation-state-interpretation-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    "PERMISSION",
    buildCanonicalPermissionDimensionEvaluationStateInterpretationMappingSetKey(
      params.mappings
    ),
  ].join("|");
}

function policyRequiresPermission(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy
): boolean {
  return policy.required_dimensions.includes("PERMISSION");
}

function collectPolicyAssessmentsByCandidateKey(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment
): Map<
  string,
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
> {
  const byCandidate = new Map<
    string,
    AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
  >();
  for (const assessment of policySet.candidate_assessments) {
    const existing = byCandidate.get(assessment.candidate_key) ?? [];
    existing.push(assessment);
    byCandidate.set(assessment.candidate_key, existing);
  }
  return byCandidate;
}

function resolveExactPolicyAssessment(
  byCandidate: Map<
    string,
    AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
  >,
  candidateKey: string
): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const matches = byCandidate.get(candidateKey);
  if (!matches || matches.length === 0) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Policy target Candidate ${candidateKey} not found in Operational Eligibility Dimension Policy set`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `Ambiguous Permission Dimension Evaluation State Interpretation Policy target for Candidate ${candidateKey}: multiple Operational Eligibility Dimension Policy assessments`
    );
  }
  return matches[0]!;
}

function mappingSetsEqual(
  a: readonly AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[],
  b: readonly AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[]
): boolean {
  return (
    buildCanonicalPermissionDimensionEvaluationStateInterpretationMappingSetKey(
      a
    ) ===
    buildCanonicalPermissionDimensionEvaluationStateInterpretationMappingSetKey(
      b
    )
  );
}

/**
 * Validates and normalizes specification against exact GROUND-084 contexts.
 *
 * Exact duplicate (same context + same mapping set) → one.
 * Same context + different mapping sets → reject (no merge / union / latest).
 * Unknown / ambiguous / policy-absent / PERMISSION-not-required targets → reject.
 * Conflicting mappings for same Evaluation State → reject.
 * Specification / mapping order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
  specification: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification {
  const byCandidate = collectPolicyAssessmentsByCandidateKey(policySet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyInput
  >();

  for (const entry of specification.policies) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const policyAssessment = resolveExactPolicyAssessment(
      byCandidate,
      entry.candidate_key
    );

    if (
      policyAssessment.status ===
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      policyAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    ) {
      throw new Error(
        `Permission Dimension Evaluation State Interpretation Policy requires an applicable Operational Eligibility Dimension Policy context for candidate ${entry.candidate_key}`
      );
    }

    if (
      policyAssessment.status ===
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
      policyAssessment.operational_eligibility_dimension_policy === null
    ) {
      throw new Error(
        `Permission Dimension Evaluation State Interpretation Policy requires an explicit Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const policy = policyAssessment.operational_eligibility_dimension_policy;
    if (!policyRequiresPermission(policy)) {
      throw new Error(
        `Permission Dimension Evaluation State Interpretation Policy requires PERMISSION to be explicitly required by Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const mappings =
      canonicalizePermissionDimensionEvaluationStateInterpretationMappings(
        entry.mappings
      );

    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (!mappingSetsEqual(existing.mappings, mappings)) {
        throw new Error(
          `Conflicting Permission Dimension Evaluation State Interpretation Policies declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      mappings,
    });
  }

  const policies = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { policies };
}

function buildInterpretationPolicy(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy,
  mappings: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationMapping[]
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy {
  return {
    key: attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyKey(
      {
        candidate_key: policy.candidate_key,
        observation_need_key: policy.observation_need_key,
        capability_requirement_set_key: policy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key: policy.key,
        mappings,
      }
    ),
    candidate_key: policy.candidate_key,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    dimension: "PERMISSION",
    operational_eligibility_dimension_policy_key: policy.key,
    mappings,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment
): void {
  const expectedHas =
    assessment.permission_dimension_evaluation_state_interpretation_policy !==
    null;
  if (
    assessment.has_explicit_permission_dimension_evaluation_state_interpretation_policy !==
    expectedHas
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Policy invariant violated: has_explicit mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" &&
    assessment.permission_dimension_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Policy invariant violated: PRESENT requires non-null policy for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" &&
    assessment.permission_dimension_evaluation_state_interpretation_policy !==
      null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State Interpretation Policy invariant violated: non-present status requires null policy for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy(
  policyAssessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  normalizedSpecification: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification
): AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyStatus,
    interpretationPolicy: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy | null
  ): AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyAssessment =
      {
        candidate_key: policyAssessment.candidate_key,
        operational_eligibility_dimension_policy_assessment: policyAssessment,
        status,
        permission_dimension_evaluation_state_interpretation_policy:
          interpretationPolicy,
        has_explicit_permission_dimension_evaluation_state_interpretation_policy:
          interpretationPolicy !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    policyAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    policyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    policyAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    policyAssessment.operational_eligibility_dimension_policy === null
  ) {
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      null
    );
  }

  const policy = policyAssessment.operational_eligibility_dimension_policy;

  if (!policyRequiresPermission(policy)) {
    return wrap("PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  const declared = normalizedSpecification.policies.find(
    (p) => p.candidate_key === policyAssessment.candidate_key
  );

  if (!declared) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED",
      null
    );
  }

  return wrap(
    "EXPLICIT_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT",
    buildInterpretationPolicy(policy, declared.mappings)
  );
}

export function buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySet(
  input: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicyEvalInput
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicySpecification(
      input.operational_eligibility_dimension_policy_set,
      input.specification
    );

  const candidate_assessments =
    input.operational_eligibility_dimension_policy_set.candidate_assessments.map(
      (policyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateInterpretationPolicy(
          policyAssessment,
          normalizedSpecification
        )
    );

  return {
    operational_eligibility_dimension_policy_set:
      input.operational_eligibility_dimension_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_permission_dimension_evaluation_state_interpretation_policies:
      candidate_assessments.some(
        (a) =>
          a.has_explicit_permission_dimension_evaluation_state_interpretation_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
