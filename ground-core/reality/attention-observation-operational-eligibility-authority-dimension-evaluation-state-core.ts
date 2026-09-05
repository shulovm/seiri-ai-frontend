/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Dimension Evaluation State core (GROUND-127).
 *
 * Pure normalization of GROUND-125 AUTHORITY Source Aggregation Result.
 *
 * Must not import GROUND-117–124 / 116 / 084-direct / ProjectState runtime cores.
 *
 * aggregation HOLDS ≠ SATISFIED
 * aggregation DOES_NOT_HOLD ≠ UNSATISFIED
 * readiness DOES_NOT_HOLD ≠ aggregation DOES_NOT_HOLD
 * 119 UNRESOLVED ≠ Evaluation State unresolved
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-result-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasis,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInput,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateStatus,
  AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue,
} from "./attention-observation-operational-eligibility-authority-dimension-evaluation-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED",
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

export const NO_AGGREGATION_RESULT = "NO_AGGREGATION_RESULT" as const;
export const NO_READINESS_BASIS = "NO_READINESS_BASIS" as const;
export const NO_AGGREGATION_POLICY = "NO_AGGREGATION_POLICY" as const;
export const EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET =
  "EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildCanonicalAuthorityDimensionEvaluationMatchKeySetKey(
  matchKeys: readonly string[]
): string {
  if (matchKeys.length === 0) {
    return EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET;
  }
  return [...matchKeys].sort(compareStrings).join(",");
}

/**
 * HOLDS and DOES_NOT_HOLD are both resolved.
 * All three UNRESOLVED_* states are unresolved.
 */
export function isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
  state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue
): boolean {
  switch (state) {
    case "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS":
      return true;
    case "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD":
      return true;
    case "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED":
      return false;
    case "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED":
      return false;
    case "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD":
      return false;
  }
}

export function attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  authority_source_aggregation_result_assessment_status: string;
  authority_source_aggregation_result_key: string | null;
  authority_source_aggregation_readiness_basis_key: string | null;
  authority_source_aggregation_policy_key: string | null;
  authority_source_aggregation_kind: string | null;
  current_authority_source_acceptance_match_keys: readonly string[];
}): string {
  return [
    "attention-observation-operational-eligibility-authority-dimension-evaluation-state-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.authority_dimension_evaluation_state,
    params.authority_source_aggregation_result_assessment_status,
    params.authority_source_aggregation_result_key ?? NO_AGGREGATION_RESULT,
    params.authority_source_aggregation_readiness_basis_key ?? NO_READINESS_BASIS,
    params.authority_source_aggregation_policy_key ?? NO_AGGREGATION_POLICY,
    params.authority_source_aggregation_kind ?? NO_AGGREGATION_POLICY,
    buildCanonicalAuthorityDimensionEvaluationMatchKeySetKey(
      params.current_authority_source_acceptance_match_keys
    ),
  ].join("|");
}

export function attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  authority_dimension_evaluation_state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue;
  authority_dimension_evaluation_state_basis_key: string;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-dimension-evaluation-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.authority_dimension_evaluation_state,
    params.authority_dimension_evaluation_state_basis_key,
  ].join("|");
}

function assertResultPresentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): void {
  if (assessment.status === "AUTHORITY_SOURCE_AGGREGATION_RESULT_PRESENT") {
    if (assessment.authority_source_aggregation_result === null) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: RESULT_PRESENT requires non-null aggregation result for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (assessment.authority_source_aggregation_result !== null) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: non-result status ${assessment.status} must not carry aggregation result for candidate ${assessment.candidate_key}`
    );
  }
}

function assertResultPresentReadinessHolds(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): void {
  const readinessAssessment =
    assessment.authority_source_aggregation_readiness_basis_assessment;
  if (
    readinessAssessment.status !==
    "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: RESULT_PRESENT requires readiness Basis PRESENT for candidate ${assessment.candidate_key}`
    );
  }
  const basis =
    readinessAssessment.authority_source_aggregation_readiness_basis;
  if (basis === null) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: RESULT_PRESENT requires non-null readiness Basis for candidate ${assessment.candidate_key}`
    );
  }
  if (
    basis.readiness_condition !==
    "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: RESULT_PRESENT requires readiness condition HOLDS for candidate ${assessment.candidate_key}`
    );
  }
}

function assertMissingAggregationPolicyInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): void {
  const policyAssessment =
    assessment.authority_source_aggregation_policy_assessment;
  if (
    policyAssessment.status ===
      "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT" ||
    policyAssessment.authority_source_aggregation_policy !== null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: missing aggregation policy status must not claim Aggregation Policy PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function assertMissingReadinessPolicyInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): void {
  const readinessAssessment =
    assessment.authority_source_aggregation_readiness_basis_assessment;
  if (
    readinessAssessment.status ===
      "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" ||
    readinessAssessment.authority_source_aggregation_readiness_basis !== null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: missing readiness policy status must not carry readiness Basis PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function assertReadinessDoesNotHoldLineage(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): void {
  const readinessAssessment =
    assessment.authority_source_aggregation_readiness_basis_assessment;
  if (
    readinessAssessment.status !==
    "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires readiness Basis PRESENT for candidate ${assessment.candidate_key}`
    );
  }
  const basis =
    readinessAssessment.authority_source_aggregation_readiness_basis;
  if (basis === null) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires non-null readiness Basis for candidate ${assessment.candidate_key}`
    );
  }
  if (
    basis.readiness_condition !==
    "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires readiness condition DOES_NOT_HOLD for candidate ${assessment.candidate_key}`
    );
  }
  if (assessment.authority_source_aggregation_result !== null) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: readiness DOES_NOT_HOLD must not embed aggregation result for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Exhaustive 125 → 127 semantic mapping for applicable AUTHORITY domain.
 * Outer NOT_APPLICABLE / not-required statuses are handled separately.
 */
export function mapAuthoritySourceAggregationResultAssessmentToEvaluationState(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue {
  assertResultPresentInvariant(assessment);

  switch (assessment.status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
    case "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED":
    case "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY":
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: outer status ${assessment.status} has no Evaluation State domain for candidate ${assessment.candidate_key}`
      );

    case "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED":
      assertMissingAggregationPolicyInvariant(assessment);
      return "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED";

    case "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED":
      assertMissingReadinessPolicyInvariant(assessment);
      return "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED";

    case "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD":
      assertReadinessDoesNotHoldLineage(assessment);
      return "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

    case "AUTHORITY_SOURCE_AGGREGATION_RESULT_PRESENT": {
      assertResultPresentReadinessHolds(assessment);
      const condition =
        assessment.authority_source_aggregation_result!.aggregation_condition;
      if (condition === "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS") {
        return "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS";
      }
      if (condition === "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD") {
        return "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";
      }
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: unknown aggregation condition ${String(condition)} for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function resolveEvaluationContext(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): {
  observation_need_key: string;
  capability_requirement_set_key: string;
} {
  const result = assessment.authority_source_aggregation_result;
  if (result !== null) {
    return {
      observation_need_key: result.observation_need_key,
      capability_requirement_set_key: result.capability_requirement_set_key,
    };
  }

  const readinessBasis =
    assessment.authority_source_aggregation_readiness_basis_assessment
      .authority_source_aggregation_readiness_basis;
  if (readinessBasis !== null) {
    return {
      observation_need_key: readinessBasis.observation_need_key,
      capability_requirement_set_key:
        readinessBasis.capability_requirement_set_key,
    };
  }

  const aggregationPolicy =
    assessment.authority_source_aggregation_policy_assessment
      .authority_source_aggregation_policy;
  if (aggregationPolicy !== null) {
    return {
      observation_need_key: aggregationPolicy.observation_need_key,
      capability_requirement_set_key:
        aggregationPolicy.capability_requirement_set_key,
    };
  }

  const oePolicy =
    assessment.authority_source_aggregation_policy_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy ??
    assessment.authority_source_acceptance_match_assessment
      .authority_source_acceptance_criteria_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy;

  if (oePolicy !== null) {
    return {
      observation_need_key: oePolicy.observation_need_key,
      capability_requirement_set_key: oePolicy.capability_requirement_set_key,
    };
  }

  const matches =
    assessment.authority_source_acceptance_match_assessment
      .authority_source_acceptance_matches;
  if (matches.length > 0) {
    return {
      observation_need_key: matches[0]!.observation_need_key,
      capability_requirement_set_key: matches[0]!.capability_requirement_set_key,
    };
  }

  throw new Error(
    `AUTHORITY Dimension Evaluation State invariant violated: applicable Evaluation State requires exact context for candidate ${assessment.candidate_key}`
  );
}

function resolveMatchKeys(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): string[] {
  const result = assessment.authority_source_aggregation_result;
  if (result !== null) {
    return [...result.current_authority_source_acceptance_match_keys].sort(
      compareStrings
    );
  }

  const readinessBasis =
    assessment.authority_source_aggregation_readiness_basis_assessment
      .authority_source_aggregation_readiness_basis;
  if (readinessBasis !== null) {
    return [
      ...readinessBasis.current_authority_source_acceptance_match_keys,
    ].sort(compareStrings);
  }

  return assessment.authority_source_acceptance_match_assessment.authority_source_acceptance_matches
    .map((m) => m.key)
    .sort(compareStrings);
}

function resolveAggregationPolicyLineage(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): {
  authority_source_aggregation_policy_key: string | null;
  authority_source_aggregation_kind: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasis["authority_source_aggregation_kind"];
} {
  const result = assessment.authority_source_aggregation_result;
  if (result !== null) {
    return {
      authority_source_aggregation_policy_key:
        result.authority_source_aggregation_policy_key,
      authority_source_aggregation_kind: result.authority_source_aggregation_kind,
    };
  }

  const readinessBasis =
    assessment.authority_source_aggregation_readiness_basis_assessment
      .authority_source_aggregation_readiness_basis;
  if (readinessBasis !== null) {
    return {
      authority_source_aggregation_policy_key:
        readinessBasis.authority_source_aggregation_policy_key,
      authority_source_aggregation_kind:
        readinessBasis.authority_source_aggregation_kind,
    };
  }

  const policy =
    assessment.authority_source_aggregation_policy_assessment
      .authority_source_aggregation_policy;
  if (policy !== null) {
    return {
      authority_source_aggregation_policy_key: policy.key,
      authority_source_aggregation_kind: policy.aggregation_kind,
    };
  }

  return {
    authority_source_aggregation_policy_key: null,
    authority_source_aggregation_kind: null,
  };
}

function buildEvaluationStateBasis(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment,
  state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateValue
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasis {
  const resultKey = assessment.authority_source_aggregation_result?.key ?? null;
  const readinessBasisKey =
    assessment.authority_source_aggregation_readiness_basis_assessment
      .authority_source_aggregation_readiness_basis?.key ?? null;
  const policyLineage = resolveAggregationPolicyLineage(assessment);
  const matchKeys = resolveMatchKeys(assessment);
  const context = resolveEvaluationContext(assessment);

  if (
    state === "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS" ||
    state === "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  ) {
    if (resultKey === null) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: resolved state ${state} requires aggregation result key for candidate ${assessment.candidate_key}`
      );
    }
    if (readinessBasisKey === null) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: resolved state ${state} requires readiness Basis key for candidate ${assessment.candidate_key}`
      );
    }
    if (
      policyLineage.authority_source_aggregation_policy_key === null ||
      policyLineage.authority_source_aggregation_kind === null
    ) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: resolved state ${state} requires aggregation policy lineage for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    state ===
    "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    if (resultKey !== null) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: readiness-unresolved state must not carry aggregation result key for candidate ${assessment.candidate_key}`
      );
    }
    if (readinessBasisKey === null) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: readiness-unresolved state requires readiness Basis key for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    state ===
      "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED" &&
    readinessBasisKey !== null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: missing readiness policy state must not synthesize readiness Basis key for candidate ${assessment.candidate_key}`
    );
  }

  if (state === "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED") {
    if (resultKey !== null || readinessBasisKey !== null) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: missing aggregation policy state must not carry result/readiness keys for candidate ${assessment.candidate_key}`
      );
    }
    if (
      policyLineage.authority_source_aggregation_policy_key !== null ||
      policyLineage.authority_source_aggregation_kind !== null
    ) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: missing aggregation policy state must not fabricate policy lineage for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    (state === "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_DECLARED" ||
      state ===
        "UNRESOLVED_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED") &&
    resultKey !== null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: missing-policy state ${state} must not carry aggregation result key for candidate ${assessment.candidate_key}`
    );
  }

  const basisFields = {
    candidate_key: assessment.candidate_key,
    observation_need_key: context.observation_need_key,
    capability_requirement_set_key: context.capability_requirement_set_key,
    authority_dimension_evaluation_state: state,
    authority_source_aggregation_result_assessment_status: assessment.status,
    authority_source_aggregation_result_key: resultKey,
    authority_source_aggregation_readiness_basis_key: readinessBasisKey,
    authority_source_aggregation_policy_key:
      policyLineage.authority_source_aggregation_policy_key,
    authority_source_aggregation_kind:
      policyLineage.authority_source_aggregation_kind,
    current_authority_source_acceptance_match_keys: matchKeys,
  };

  return {
    key: attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasisKey(
      basisFields
    ),
    candidate_key: basisFields.candidate_key,
    observation_need_key: basisFields.observation_need_key,
    capability_requirement_set_key: basisFields.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_dimension_evaluation_state: state,
    authority_source_aggregation_result_assessment_status: assessment.status,
    authority_source_aggregation_result_key: resultKey,
    authority_source_aggregation_readiness_basis_key: readinessBasisKey,
    authority_source_aggregation_policy_key:
      policyLineage.authority_source_aggregation_policy_key,
    authority_source_aggregation_kind:
      policyLineage.authority_source_aggregation_kind,
    current_authority_source_acceptance_match_keys: matchKeys,
  };
}

function buildEvaluationStateRecord(
  basis: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasis
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState {
  return {
    key: attentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateKey(
      {
        candidate_key: basis.candidate_key,
        observation_need_key: basis.observation_need_key,
        capability_requirement_set_key: basis.capability_requirement_set_key,
        authority_dimension_evaluation_state:
          basis.authority_dimension_evaluation_state,
        authority_dimension_evaluation_state_basis_key: basis.key,
      }
    ),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_dimension_evaluation_state:
      basis.authority_dimension_evaluation_state,
    authority_dimension_evaluation_state_basis_key: basis.key,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment
): void {
  const expectedHas =
    assessment.authority_dimension_evaluation_state_basis !== null;
  if (assessment.has_authority_dimension_evaluation_state !== expectedHas) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: has_state mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (assessment.has_authority_dimension_evaluation_state) {
    const stateValue =
      assessment.authority_dimension_evaluation_state_basis!
        .authority_dimension_evaluation_state;
    const resolved =
      isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
        stateValue
      );
    if (
      assessment.has_resolved_authority_dimension_evaluation_state !== resolved
    ) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: has_resolved mismatch for candidate ${assessment.candidate_key}`
      );
    }
    if (
      assessment.has_unresolved_authority_dimension_evaluation_state ===
      resolved
    ) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: resolved/unresolved booleans must be mutually exclusive for candidate ${assessment.candidate_key}`
      );
    }
  } else if (
    assessment.has_resolved_authority_dimension_evaluation_state ||
    assessment.has_unresolved_authority_dimension_evaluation_state
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: no State requires resolved/unresolved false for candidate ${assessment.candidate_key}`
    );
  }

  if (assessment.status === "AUTHORITY_DIMENSION_EVALUATION_STATE_PRESENT") {
    if (
      assessment.authority_dimension_evaluation_state_basis === null ||
      assessment.authority_dimension_evaluation_state === null
    ) {
      throw new Error(
        `AUTHORITY Dimension Evaluation State invariant violated: PRESENT requires non-null Basis and State for candidate ${assessment.candidate_key}`
      );
    }
  } else if (
    assessment.authority_dimension_evaluation_state_basis !== null ||
    assessment.authority_dimension_evaluation_state !== null
  ) {
    throw new Error(
      `AUTHORITY Dimension Evaluation State invariant violated: outer status requires null Basis and State for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationState(
  aggregationResultAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateStatus,
    basis: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateBasis | null,
    state: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState | null
  ): AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment => {
    const resolved =
      basis !== null
        ? isResolvedAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationState(
            basis.authority_dimension_evaluation_state
          )
        : false;
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationStateAssessment =
      {
        candidate_key: aggregationResultAssessment.candidate_key,
        authority_source_aggregation_result_assessment:
          aggregationResultAssessment,
        status,
        authority_dimension_evaluation_state_basis: basis,
        authority_dimension_evaluation_state: state,
        has_authority_dimension_evaluation_state: basis !== null,
        has_resolved_authority_dimension_evaluation_state: resolved,
        has_unresolved_authority_dimension_evaluation_state:
          basis !== null && !resolved,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    aggregationResultAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null, null);
  }

  if (
    aggregationResultAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null, null);
  }

  if (
    aggregationResultAssessment.status ===
    "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      null,
      null
    );
  }

  if (
    aggregationResultAssessment.status ===
    "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null, null);
  }

  const evaluationState =
    mapAuthoritySourceAggregationResultAssessmentToEvaluationState(
      aggregationResultAssessment
    );
  const basis = buildEvaluationStateBasis(
    aggregationResultAssessment,
    evaluationState
  );
  const state = buildEvaluationStateRecord(basis);

  return wrap("AUTHORITY_DIMENSION_EVALUATION_STATE_PRESENT", basis, state);
}

export function buildAttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSet(
  input: AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateInput
): AttentionObservationOperationalEligibilityAuthorityDimensionEvaluationStateSetAssessment {
  const resultSet: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSetAssessment =
    input.authority_source_aggregation_result_set;

  const candidate_assessments = resultSet.candidate_assessments.map(
    assessAttentionCandidateObservationOperationalEligibilityAuthorityDimensionEvaluationState
  );

  return {
    authority_source_aggregation_result_set: resultSet,
    candidate_assessments,
    has_authority_dimension_evaluation_states: candidate_assessments.some(
      (a) => a.has_authority_dimension_evaluation_state
    ),
    has_resolved_authority_dimension_evaluation_states: candidate_assessments.some(
      (a) => a.has_resolved_authority_dimension_evaluation_state
    ),
    has_unresolved_authority_dimension_evaluation_states: candidate_assessments.some(
      (a) => a.has_unresolved_authority_dimension_evaluation_state
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
