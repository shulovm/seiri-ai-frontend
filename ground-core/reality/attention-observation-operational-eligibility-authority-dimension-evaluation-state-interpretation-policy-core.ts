/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Dimension Evaluation State Interpretation Policy core (GROUND-128).
 *
 * GROUND-127 AUTHORITY Dimension Evaluation State context
 * + explicit interpretation-policy specification
 * → Explicit AUTHORITY Dimension Evaluation State Interpretation Policy only.
 *
 * Declarative. Does not inspect current GROUND-127 Evaluation State for mapping.
 * Does not produce Interpretation Basis or Satisfaction State.
 *
 * Type-only dependency on GROUND-127 Evaluation State vocabulary.
 *
 * Must not import GROUND-127 core / 125–124 / 118–119 / 116 / 084-direct / ProjectState.
 *
 * policy value ≠ current Satisfaction
 * HOLDS ≠ default SATISFIED
 * DOES_NOT_HOLD ≠ default UNSATISFIED
 * explicit empty policy ≠ policy absence
 * unusual mappings are valid
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-result-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyEvalInput,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyInput,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyStatus,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Canonical GROUND-127 Evaluation State order — serialization only, not preference.
 */
export const CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_ORDER: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue[] =
  [
    "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS",
    "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD",
    "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED",
    "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED",
    "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
  ];

/**
 * Canonical interpretation order — serialization only, not preference.
 */
export const CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_ORDER: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation[] =
  [
    "INTERPRET_AS_AUTHORITY_DIMENSION_SATISFIED",
    "INTERPRET_AS_AUTHORITY_DIMENSION_UNSATISFIED",
  ];

export const EMPTY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET =
  "EMPTY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET" as const;

const EVALUATION_STATE_ORDER = new Map(
  CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_ORDER.map((s, i) => [s, i])
);

const INTERPRETATION_ORDER = new Map(
  CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_ORDER.map(
    (v, i) => [v, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeEvaluationState(
  state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue {
  if (!EVALUATION_STATE_ORDER.has(state)) {
    throw new Error(
      `Unknown AUTHORITY Dimension Evaluation State: ${String(state)}`
    );
  }
  return state;
}

function normalizeInterpretation(
  interpretation: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown AUTHORITY Dimension Evaluation State Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

/**
 * Canonical mapping-set key (deduped by evaluation state + fixed state order).
 * Empty mapping set serializes as EMPTY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET.
 */
export function buildCanonicalAuthorityDimensionEvaluationStateInterpretationMappingSetKey(
  mappings: readonly AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[]
): string {
  const normalized =
    canonicalizeAuthorityDimensionEvaluationStateInterpretationMappings(
      mappings
    );
  if (normalized.length === 0) {
    return EMPTY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_MAPPING_SET;
  }
  return normalized
    .map(
      (m) =>
        `${m.authority_dimension_evaluation_state}|${m.interpretation}`
    )
    .join(",");
}

export function canonicalizeAuthorityDimensionEvaluationStateInterpretationMappings(
  mappings: readonly AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[]
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[] {
  const byState = new Map<
    AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
    AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretation
  >();

  for (const mapping of mappings) {
    const authority_dimension_evaluation_state = normalizeEvaluationState(
      mapping.authority_dimension_evaluation_state
    );
    const interpretation = normalizeInterpretation(mapping.interpretation);
    const existing = byState.get(authority_dimension_evaluation_state);
    if (existing !== undefined) {
      if (existing !== interpretation) {
        throw new Error(
          `Conflicting AUTHORITY Dimension Evaluation State Interpretation mappings for evaluation state ${authority_dimension_evaluation_state}`
        );
      }
      continue;
    }
    byState.set(authority_dimension_evaluation_state, interpretation);
  }

  const result: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[] =
    [];
  for (const authority_dimension_evaluation_state of CANONICAL_AUTHORITY_DIMENSION_EVALUATION_STATE_ORDER) {
    const interpretation = byState.get(authority_dimension_evaluation_state);
    if (interpretation !== undefined) {
      result.push({
        authority_dimension_evaluation_state,
        interpretation,
      });
    }
  }
  return result;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|AUTHORITY|canonicalMappingSet
 */
export function attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  mappings: readonly AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[];
}): string {
  return [
    "attention-observation-operational-eligibility-authority-dimension-evaluation-state-interpretation-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    "AUTHORITY",
    buildCanonicalAuthorityDimensionEvaluationStateInterpretationMappingSetKey(
      params.mappings
    ),
  ].join("|");
}

function resolveOperationalEligibilityDimensionPolicyKey(
  aggregationResultAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): string {
  const result = aggregationResultAssessment.authority_source_aggregation_result;
  if (result !== null) {
    return result.operational_eligibility_dimension_policy_key;
  }

  const readinessBasis =
    aggregationResultAssessment.authority_source_aggregation_readiness_basis_assessment
      .authority_source_aggregation_readiness_basis;
  if (readinessBasis !== null) {
    return readinessBasis.operational_eligibility_dimension_policy_key;
  }

  const aggregationPolicy =
    aggregationResultAssessment.authority_source_aggregation_policy_assessment
      .authority_source_aggregation_policy;
  if (aggregationPolicy !== null) {
    return aggregationPolicy.operational_eligibility_dimension_policy_key;
  }

  const oePolicy =
    aggregationResultAssessment.authority_source_aggregation_policy_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy ??
    aggregationResultAssessment.authority_source_acceptance_match_assessment
      .authority_source_acceptance_criteria_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy;

  if (oePolicy !== null) {
    return oePolicy.key;
  }

  throw new Error(
    `AUTHORITY Dimension Evaluation State Interpretation Policy requires stable Operational Eligibility Dimension Policy context for candidate ${aggregationResultAssessment.candidate_key}`
  );
}

function resolveStableAuthorityContext(
  evaluationStateAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment
): {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
} {
  const state = evaluationStateAssessment.authority_dimension_evaluation_state;
  if (state === null) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Policy requires applicable Evaluation State context for candidate ${evaluationStateAssessment.candidate_key}`
    );
  }

  return {
    candidate_key: state.candidate_key,
    observation_need_key: state.observation_need_key,
    capability_requirement_set_key: state.capability_requirement_set_key,
    operational_eligibility_dimension_policy_key:
      resolveOperationalEligibilityDimensionPolicyKey(
        evaluationStateAssessment.authority_source_aggregation_result_assessment
      ),
  };
}

function collectEvaluationStateAssessmentsByCandidateKey(
  evaluationStateSet: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment
): Map<
  string,
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment[]
> {
  const byCandidate = new Map<
    string,
    AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment[]
  >();
  for (const assessment of evaluationStateSet.candidate_assessments) {
    const existing = byCandidate.get(assessment.candidate_key) ?? [];
    existing.push(assessment);
    byCandidate.set(assessment.candidate_key, existing);
  }
  return byCandidate;
}

function resolveExactEvaluationStateAssessment(
  byCandidate: Map<
    string,
    AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment[]
  >,
  candidateKey: string
): AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment {
  const matches = byCandidate.get(candidateKey);
  if (!matches || matches.length === 0) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Policy target Candidate ${candidateKey} not found in AUTHORITY Dimension Evaluation State set`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `Ambiguous AUTHORITY Dimension Evaluation State Interpretation Policy target for Candidate ${candidateKey}: multiple AUTHORITY Dimension Evaluation State assessments`
    );
  }
  return matches[0]!;
}

function mappingSetsEqual(
  a: readonly AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[],
  b: readonly AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[]
): boolean {
  return (
    buildCanonicalAuthorityDimensionEvaluationStateInterpretationMappingSetKey(
      a
    ) ===
    buildCanonicalAuthorityDimensionEvaluationStateInterpretationMappingSetKey(
      b
    )
  );
}

function isOuterNonApplicableEvaluationStateStatus(
  status: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment["status"]
): boolean {
  return (
    status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    status === "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    status === "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  );
}

/**
 * Validates and normalizes specification against exact GROUND-127 contexts.
 *
 * Exact duplicate (same context + same mapping set) → one.
 * Same context + different mapping sets → reject (no merge / union / latest).
 * Unknown / ambiguous / non-applicable targets → reject.
 * Conflicting mappings for same Evaluation State → reject.
 * Specification / mapping order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification(
  evaluationStateSet: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment,
  specification: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification {
  const byCandidate =
    collectEvaluationStateAssessmentsByCandidateKey(evaluationStateSet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyInput
  >();

  for (const entry of specification.policies) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const evaluationStateAssessment = resolveExactEvaluationStateAssessment(
      byCandidate,
      entry.candidate_key
    );

    if (isOuterNonApplicableEvaluationStateStatus(evaluationStateAssessment.status)) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State Interpretation Policy requires an applicable AUTHORITY Dimension Evaluation State context for candidate ${entry.candidate_key}`
      );
    }

    if (
      evaluationStateAssessment.status !==
      "AUTHORITY_DIMENSION_EVALUATION_STATE_PRESENT"
    ) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State Interpretation Policy requires AUTHORITY_DIMENSION_EVALUATION_STATE_PRESENT context for candidate ${entry.candidate_key}`
      );
    }

    const mappings =
      canonicalizeAuthorityDimensionEvaluationStateInterpretationMappings(
        entry.mappings
      );

    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (!mappingSetsEqual(existing.mappings, mappings)) {
        throw new Error(
          `Conflicting AUTHORITY Dimension Evaluation State Interpretation Policies declared for candidate ${entry.candidate_key}`
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
  context: {
    candidate_key: string;
    observation_need_key: string;
    capability_requirement_set_key: string;
    operational_eligibility_dimension_policy_key: string;
  },
  mappings: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationMapping[]
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy {
  return {
    key: attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyKey(
      {
        candidate_key: context.candidate_key,
        observation_need_key: context.observation_need_key,
        capability_requirement_set_key: context.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key:
          context.operational_eligibility_dimension_policy_key,
        mappings,
      }
    ),
    candidate_key: context.candidate_key,
    observation_need_key: context.observation_need_key,
    capability_requirement_set_key: context.capability_requirement_set_key,
    dimension: "AUTHORITY",
    operational_eligibility_dimension_policy_key:
      context.operational_eligibility_dimension_policy_key,
    mappings,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment
): void {
  const expectedHas =
    assessment.authority_dimension_evaluation_state_interpretation_policy !==
    null;
  if (
    assessment.has_explicit_authority_dimension_evaluation_state_interpretation_policy !==
    expectedHas
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Policy invariant violated: has_explicit mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" &&
    assessment.authority_dimension_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Policy invariant violated: PRESENT requires non-null policy for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" &&
    assessment.authority_dimension_evaluation_state_interpretation_policy !==
      null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State Interpretation Policy invariant violated: non-present status requires null policy for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy(
  evaluationStateAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment,
  normalizedSpecification: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification
): AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyStatus,
    interpretationPolicy: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy | null
  ): AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyAssessment =
      {
        candidate_key: evaluationStateAssessment.candidate_key,
        authority_dimension_evaluation_state_assessment:
          evaluationStateAssessment,
        status,
        authority_dimension_evaluation_state_interpretation_policy:
          interpretationPolicy,
        has_explicit_authority_dimension_evaluation_state_interpretation_policy:
          interpretationPolicy !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    evaluationStateAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    evaluationStateAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    evaluationStateAssessment.status ===
    "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      null
    );
  }

  if (
    evaluationStateAssessment.status ===
    "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  const declared = normalizedSpecification.policies.find(
    (p) => p.candidate_key === evaluationStateAssessment.candidate_key
  );

  if (!declared) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED",
      null
    );
  }

  return wrap(
    "EXPLICIT_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT",
    buildInterpretationPolicy(
      resolveStableAuthorityContext(evaluationStateAssessment),
      declared.mappings
    )
  );
}

export function buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySet(
  input: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicyEvalInput
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicySpecification(
      input.authority_dimension_evaluation_state_set,
      input.specification
    );

  const candidate_assessments =
    input.authority_dimension_evaluation_state_set.candidate_assessments.map(
      (evaluationStateAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateInterpretationPolicy(
          evaluationStateAssessment,
          normalizedSpecification
        )
    );

  return {
    authority_dimension_evaluation_state_set:
      input.authority_dimension_evaluation_state_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_authority_dimension_evaluation_state_interpretation_policies:
      candidate_assessments.some(
        (a) =>
          a.has_explicit_authority_dimension_evaluation_state_interpretation_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
