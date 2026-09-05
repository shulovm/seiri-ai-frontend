/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Dimension Evaluation State core (GROUND-103).
 *
 * Pure normalization of GROUND-101 Permission Source Aggregation Result.
 *
 * Must not import GROUND-094–100 / 093 / 091 / 084-direct / 085 runtime cores.
 *
 * aggregation HOLDS ≠ SATISFIED
 * aggregation DOES_NOT_HOLD ≠ UNSATISFIED
 * readiness DOES_NOT_HOLD ≠ aggregation DOES_NOT_HOLD
 * 095 UNRESOLVED ≠ Evaluation State unresolved
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationResultSetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-result-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasis,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInput,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateModelLimitation,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateRecord,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateStatus,
} from "./attention-observation-operational-eligibility-permission-dimension-evaluation-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_INTERPRETATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_SATISFACTION_INTERPRETATION_BASIS_NOT_MODELED",
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

export const NO_AGGREGATION_RESULT = "NO_AGGREGATION_RESULT" as const;
export const NO_READINESS_BASIS = "NO_READINESS_BASIS" as const;
export const NO_AGGREGATION_POLICY = "NO_AGGREGATION_POLICY" as const;
export const EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET =
  "EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildCanonicalPermissionDimensionEvaluationMatchKeySetKey(
  matchKeys: readonly string[]
): string {
  if (matchKeys.length === 0) {
    return EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET;
  }
  return [...matchKeys].sort(compareStrings).join(",");
}

/**
 * HOLDS and DOES_NOT_HOLD are both resolved.
 * All three UNRESOLVED_* states are unresolved.
 */
export function isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
  state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState
): boolean {
  switch (state) {
    case "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS":
      return true;
    case "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD":
      return true;
    case "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED":
      return false;
    case "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED":
      return false;
    case "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD":
      return false;
  }
}

/**
 * Conceptual Basis identity:
 * attention-observation-operational-eligibility-permission-dimension-evaluation-state-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|PERMISSION|
 * permissionDimensionEvaluationState|current101AssessmentStatus|
 * aggregationResultKey-or-none|readinessBasisKey-or-none|
 * aggregationPolicyKey-or-none|aggregationKind-or-none|
 * canonicalCurrentAcceptanceMatchKeySet
 */
export function attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState;
  permission_source_aggregation_result_assessment_status: string;
  permission_source_aggregation_result_key: string | null;
  permission_source_aggregation_readiness_basis_key: string | null;
  permission_source_aggregation_policy_key: string | null;
  permission_source_aggregation_kind: string | null;
  current_permission_source_acceptance_match_keys: readonly string[];
}): string {
  return [
    "attention-observation-operational-eligibility-permission-dimension-evaluation-state-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "PERMISSION",
    params.permission_dimension_evaluation_state,
    params.permission_source_aggregation_result_assessment_status,
    params.permission_source_aggregation_result_key ?? NO_AGGREGATION_RESULT,
    params.permission_source_aggregation_readiness_basis_key ??
      NO_READINESS_BASIS,
    params.permission_source_aggregation_policy_key ?? NO_AGGREGATION_POLICY,
    params.permission_source_aggregation_kind ?? NO_AGGREGATION_POLICY,
    buildCanonicalPermissionDimensionEvaluationMatchKeySetKey(
      params.current_permission_source_acceptance_match_keys
    ),
  ].join("|");
}

/**
 * Conceptual State identity:
 * attention-observation-operational-eligibility-permission-dimension-evaluation-state|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|PERMISSION|
 * permissionDimensionEvaluationState|permissionDimensionEvaluationStateBasisKey
 */
export function attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_dimension_evaluation_state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState;
  permission_dimension_evaluation_state_basis_key: string;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-dimension-evaluation-state",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "PERMISSION",
    params.permission_dimension_evaluation_state,
    params.permission_dimension_evaluation_state_basis_key,
  ].join("|");
}

function assertResultPresentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): void {
  if (
    assessment.status === "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT"
  ) {
    if (assessment.permission_source_aggregation_result === null) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: RESULT_PRESENT requires non-null aggregation result for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (assessment.permission_source_aggregation_result !== null) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: non-result status ${assessment.status} must not carry aggregation result for candidate ${assessment.candidate_key}`
    );
  }
}

function assertMissingAggregationPolicyInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): void {
  const policyAssessment =
    assessment.permission_source_aggregation_policy_assessment;
  if (
    policyAssessment.status ===
      "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT" ||
    policyAssessment.permission_source_aggregation_policy !== null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: missing aggregation policy status must not claim Aggregation Policy PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function assertMissingReadinessPolicyInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): void {
  const readinessAssessment =
    assessment.permission_source_aggregation_readiness_basis_assessment;
  if (
    readinessAssessment.status ===
      "PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" ||
    readinessAssessment.permission_source_aggregation_readiness_basis !== null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: missing readiness policy status must not carry readiness Basis PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function assertReadinessDoesNotHoldLineage(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): void {
  const readinessAssessment =
    assessment.permission_source_aggregation_readiness_basis_assessment;
  if (
    readinessAssessment.status !==
    "PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
  ) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires readiness Basis PRESENT for candidate ${assessment.candidate_key}`
    );
  }
  const basis =
    readinessAssessment.permission_source_aggregation_readiness_basis;
  if (basis === null) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires non-null readiness Basis for candidate ${assessment.candidate_key}`
    );
  }
  if (
    basis.readiness_condition !==
    "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
  ) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires readiness condition DOES_NOT_HOLD for candidate ${assessment.candidate_key}`
    );
  }
  if (assessment.permission_source_aggregation_result !== null) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: readiness DOES_NOT_HOLD must not embed aggregation result for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Exhaustive 101 → 103 semantic mapping for applicable PERMISSION domain.
 * Outer NOT_APPLICABLE / not-required statuses are handled separately.
 */
export function mapPermissionSourceAggregationResultAssessmentToEvaluationState(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState {
  assertResultPresentInvariant(assessment);

  switch (assessment.status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
    case "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED":
    case "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY":
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: outer status ${assessment.status} has no Evaluation State domain for candidate ${assessment.candidate_key}`
      );

    case "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED":
      assertMissingAggregationPolicyInvariant(assessment);
      return "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED";

    case "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED":
      assertMissingReadinessPolicyInvariant(assessment);
      return "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED";

    case "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD":
      assertReadinessDoesNotHoldLineage(assessment);
      return "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

    case "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT": {
      const condition =
        assessment.permission_source_aggregation_result!.aggregation_condition;
      if (condition === "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS") {
        return "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS";
      }
      if (
        condition === "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      ) {
        return "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";
      }
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: unknown aggregation condition ${String(condition)} for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function resolveEvaluationContext(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): {
  observation_need_key: string;
  capability_requirement_set_key: string;
} {
  const result = assessment.permission_source_aggregation_result;
  if (result !== null) {
    return {
      observation_need_key: result.observation_need_key,
      capability_requirement_set_key: result.capability_requirement_set_key,
    };
  }

  const readinessBasis =
    assessment.permission_source_aggregation_readiness_basis_assessment
      .permission_source_aggregation_readiness_basis;
  if (readinessBasis !== null) {
    return {
      observation_need_key: readinessBasis.observation_need_key,
      capability_requirement_set_key:
        readinessBasis.capability_requirement_set_key,
    };
  }

  const aggregationPolicy =
    assessment.permission_source_aggregation_policy_assessment
      .permission_source_aggregation_policy;
  if (aggregationPolicy !== null) {
    return {
      observation_need_key: aggregationPolicy.observation_need_key,
      capability_requirement_set_key:
        aggregationPolicy.capability_requirement_set_key,
    };
  }

  const oePolicy =
    assessment.permission_source_aggregation_policy_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy ??
    assessment.permission_source_acceptance_match_assessment
      .permission_source_acceptance_criteria_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy;

  if (oePolicy !== null) {
    return {
      observation_need_key: oePolicy.observation_need_key,
      capability_requirement_set_key: oePolicy.capability_requirement_set_key,
    };
  }

  const matches =
    assessment.permission_source_acceptance_match_assessment
      .permission_source_acceptance_matches;
  if (matches.length > 0) {
    return {
      observation_need_key: matches[0]!.observation_need_key,
      capability_requirement_set_key: matches[0]!.capability_requirement_set_key,
    };
  }

  throw new Error(
    `Permission Dimension Evaluation State invariant violated: applicable Evaluation State requires exact context for candidate ${assessment.candidate_key}`
  );
}

function resolveMatchKeys(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): string[] {
  const result = assessment.permission_source_aggregation_result;
  if (result !== null) {
    return [...result.current_permission_source_acceptance_match_keys].sort(
      compareStrings
    );
  }

  const readinessBasis =
    assessment.permission_source_aggregation_readiness_basis_assessment
      .permission_source_aggregation_readiness_basis;
  if (readinessBasis !== null) {
    return [
      ...readinessBasis.current_permission_source_acceptance_match_keys,
    ].sort(compareStrings);
  }

  return assessment.permission_source_acceptance_match_assessment.permission_source_acceptance_matches
    .map((m) => m.key)
    .sort(compareStrings);
}

function resolveAggregationPolicyLineage(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): {
  permission_source_aggregation_policy_key: string | null;
  permission_source_aggregation_kind: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasis["permission_source_aggregation_kind"];
} {
  const result = assessment.permission_source_aggregation_result;
  if (result !== null) {
    return {
      permission_source_aggregation_policy_key:
        result.permission_source_aggregation_policy_key,
      permission_source_aggregation_kind:
        result.permission_source_aggregation_kind,
    };
  }

  const readinessBasis =
    assessment.permission_source_aggregation_readiness_basis_assessment
      .permission_source_aggregation_readiness_basis;
  if (readinessBasis !== null) {
    return {
      permission_source_aggregation_policy_key:
        readinessBasis.permission_source_aggregation_policy_key,
      permission_source_aggregation_kind:
        readinessBasis.permission_source_aggregation_kind,
    };
  }

  const policy =
    assessment.permission_source_aggregation_policy_assessment
      .permission_source_aggregation_policy;
  if (policy !== null) {
    return {
      permission_source_aggregation_policy_key: policy.key,
      permission_source_aggregation_kind: policy.aggregation_kind,
    };
  }

  return {
    permission_source_aggregation_policy_key: null,
    permission_source_aggregation_kind: null,
  };
}

function buildEvaluationStateBasis(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment,
  state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationState
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasis {
  const resultKey = assessment.permission_source_aggregation_result?.key ?? null;
  const readinessBasisKey =
    assessment.permission_source_aggregation_readiness_basis_assessment
      .permission_source_aggregation_readiness_basis?.key ?? null;
  const policyLineage = resolveAggregationPolicyLineage(assessment);
  const matchKeys = resolveMatchKeys(assessment);
  const context = resolveEvaluationContext(assessment);

  if (
    state === "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS" ||
    state === "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  ) {
    if (resultKey === null) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: resolved state ${state} requires aggregation result key for candidate ${assessment.candidate_key}`
      );
    }
    if (readinessBasisKey === null) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: resolved state ${state} requires readiness Basis key for candidate ${assessment.candidate_key}`
      );
    }
    if (
      policyLineage.permission_source_aggregation_policy_key === null ||
      policyLineage.permission_source_aggregation_kind === null
    ) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: resolved state ${state} requires aggregation policy lineage for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    state ===
    "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    if (resultKey !== null) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: readiness-unresolved state must not carry aggregation result key for candidate ${assessment.candidate_key}`
      );
    }
    if (readinessBasisKey === null) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: readiness-unresolved state requires readiness Basis key for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    state ===
      "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED" &&
    readinessBasisKey !== null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: missing readiness policy state must not synthesize readiness Basis key for candidate ${assessment.candidate_key}`
    );
  }

  if (
    state === "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED"
  ) {
    if (resultKey !== null || readinessBasisKey !== null) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: missing aggregation policy state must not carry result/readiness keys for candidate ${assessment.candidate_key}`
      );
    }
    if (
      policyLineage.permission_source_aggregation_policy_key !== null ||
      policyLineage.permission_source_aggregation_kind !== null
    ) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: missing aggregation policy state must not fabricate policy lineage for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    (state ===
      "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_DECLARED" ||
      state ===
        "UNRESOLVED_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_DECLARED") &&
    resultKey !== null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: missing-policy state ${state} must not carry aggregation result key for candidate ${assessment.candidate_key}`
    );
  }

  const basisFields = {
    candidate_key: assessment.candidate_key,
    observation_need_key: context.observation_need_key,
    capability_requirement_set_key: context.capability_requirement_set_key,
    permission_dimension_evaluation_state: state,
    permission_source_aggregation_result_assessment_status: assessment.status,
    permission_source_aggregation_result_key: resultKey,
    permission_source_aggregation_readiness_basis_key: readinessBasisKey,
    permission_source_aggregation_policy_key:
      policyLineage.permission_source_aggregation_policy_key,
    permission_source_aggregation_kind:
      policyLineage.permission_source_aggregation_kind,
    current_permission_source_acceptance_match_keys: matchKeys,
  };

  return {
    key: attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasisKey(
      basisFields
    ),
    candidate_key: basisFields.candidate_key,
    observation_need_key: basisFields.observation_need_key,
    capability_requirement_set_key: basisFields.capability_requirement_set_key,
    dimension: "PERMISSION",
    permission_dimension_evaluation_state: state,
    permission_source_aggregation_result_assessment_status: assessment.status,
    permission_source_aggregation_result_key: resultKey,
    permission_source_aggregation_readiness_basis_key: readinessBasisKey,
    permission_source_aggregation_policy_key:
      policyLineage.permission_source_aggregation_policy_key,
    permission_source_aggregation_kind:
      policyLineage.permission_source_aggregation_kind,
    current_permission_source_acceptance_match_keys: matchKeys,
  };
}

function buildEvaluationStateRecord(
  basis: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasis
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateRecord {
  return {
    key: attentionObservationOperationalEligibilityPermissionDimensionEvaluationStateKey(
      {
        candidate_key: basis.candidate_key,
        observation_need_key: basis.observation_need_key,
        capability_requirement_set_key: basis.capability_requirement_set_key,
        permission_dimension_evaluation_state:
          basis.permission_dimension_evaluation_state,
        permission_dimension_evaluation_state_basis_key: basis.key,
      }
    ),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "PERMISSION",
    permission_dimension_evaluation_state:
      basis.permission_dimension_evaluation_state,
    permission_dimension_evaluation_state_basis_key: basis.key,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment
): void {
  const expectedHas =
    assessment.permission_dimension_evaluation_state_basis !== null;
  if (assessment.has_permission_dimension_evaluation_state !== expectedHas) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: has_state mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "PERMISSION_DIMENSION_EVALUATION_STATE_PRESENT"
  ) {
    if (
      assessment.permission_dimension_evaluation_state_basis === null ||
      assessment.permission_dimension_evaluation_state === null
    ) {
      throw new Error(
        `Permission Dimension Evaluation State invariant violated: PRESENT requires non-null Basis and State for candidate ${assessment.candidate_key}`
      );
    }
  } else if (
    assessment.permission_dimension_evaluation_state_basis !== null ||
    assessment.permission_dimension_evaluation_state !== null
  ) {
    throw new Error(
      `Permission Dimension Evaluation State invariant violated: outer status requires null Basis and State for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure Candidate-level PERMISSION Dimension Evaluation State.
 *
 * Outer statuses → no State.
 * Applicable domain → one of five canonical states + Basis + State record.
 */
export function assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationState(
  aggregationResultAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateStatus,
    basis: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateBasis | null,
    state: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateRecord | null
  ): AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationStateAssessment =
      {
        candidate_key: aggregationResultAssessment.candidate_key,
        permission_source_aggregation_result_assessment:
          aggregationResultAssessment,
        status,
        permission_dimension_evaluation_state_basis: basis,
        permission_dimension_evaluation_state: state,
        has_permission_dimension_evaluation_state: basis !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
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
    "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap(
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
      null,
      null
    );
  }

  const evaluationState =
    mapPermissionSourceAggregationResultAssessmentToEvaluationState(
      aggregationResultAssessment
    );
  const basis = buildEvaluationStateBasis(
    aggregationResultAssessment,
    evaluationState
  );
  const state = buildEvaluationStateRecord(basis);

  return wrap("PERMISSION_DIMENSION_EVALUATION_STATE_PRESENT", basis, state);
}

export function buildAttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSet(
  input: AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateInput
): AttentionObservationOperationalEligibilityPermissionDimensionEvaluationStateSetAssessment {
  const resultSet: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultSetAssessment =
    input.permission_source_aggregation_result_set;

  const candidate_assessments = resultSet.candidate_assessments.map(
    assessAttentionCandidateObservationOperationalEligibilityPermissionDimensionEvaluationState
  );

  return {
    permission_source_aggregation_result_set: resultSet,
    candidate_assessments,
    has_permission_dimension_evaluation_states: candidate_assessments.some(
      (a) => a.has_permission_dimension_evaluation_state
    ),
    has_resolved_permission_dimension_evaluation_states:
      candidate_assessments.some(
        (a) =>
          a.permission_dimension_evaluation_state_basis !== null &&
          isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
            a.permission_dimension_evaluation_state_basis
              .permission_dimension_evaluation_state
          )
      ),
    has_unresolved_permission_dimension_evaluation_states:
      candidate_assessments.some(
        (a) =>
          a.permission_dimension_evaluation_state_basis !== null &&
          !isResolvedAttentionObservationOperationalEligibilityPermissionDimensionEvaluationState(
            a.permission_dimension_evaluation_state_basis
              .permission_dimension_evaluation_state
          )
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
