/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Aggregation Result core (GROUND-101).
 *
 * GROUND-097 PERMISSION Source Acceptance Match
 * + GROUND-098 Explicit PERMISSION Source Aggregation Policy
 * + GROUND-100 PERMISSION Source Aggregation Readiness Basis
 * → PERMISSION Source Aggregation Result only.
 *
 * Executes exact ANY/ALL ONLY when readiness HOLDS.
 * readiness DOES_NOT_HOLD → no result (≠ aggregation DOES_NOT_HOLD).
 * Never evaluates [].some / [].every as semantic aggregation.
 *
 * Must not import GROUND-099-direct / 093–096 / 084-direct / 091 / 024–090 /
 * 085 / ProjectState.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";
import {
  buildCanonicalPermissionSourceAcceptanceMatchKeySetKey,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationCondition,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationResult,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationResultInput,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationResultModelLimitation,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationResultSetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationResultStatus,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-result-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "PERMISSION Source Acceptance Match set, Aggregation Policy set, and Aggregation Readiness Basis set do not share the same observation Candidate context";

const LISTED_AS_ACCEPTABLE =
  "LISTED_AS_ACCEPTABLE" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function matchKeySetsEqual(
  a: readonly string[],
  b: readonly string[]
): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort(compareStrings);
  const sortedB = [...b].sort(compareStrings);
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-source-aggregation-result|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|
 * permissionSourceAggregationPolicyKey|permissionSourceAggregationKind|
 * permissionSourceAggregationReadinessBasisKey|
 * permissionSourceAggregationReadinessPolicyKey|permissionSourceAggregationReadinessKind|
 * canonicalCurrentAcceptanceMatchKeySet|aggregationCondition
 */
export function attentionObservationOperationalEligibilityPermissionSourceAggregationResultKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  permission_source_aggregation_policy_key: string;
  permission_source_aggregation_kind: string;
  permission_source_aggregation_readiness_basis_key: string;
  permission_source_aggregation_readiness_policy_key: string;
  permission_source_aggregation_readiness_kind: string;
  current_permission_source_acceptance_match_keys: readonly string[];
  aggregation_condition: AttentionObservationOperationalEligibilityPermissionSourceAggregationCondition;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-source-aggregation-result",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    params.permission_source_aggregation_policy_key,
    params.permission_source_aggregation_kind,
    params.permission_source_aggregation_readiness_basis_key,
    params.permission_source_aggregation_readiness_policy_key,
    params.permission_source_aggregation_readiness_kind,
    buildCanonicalPermissionSourceAcceptanceMatchKeySetKey(
      params.current_permission_source_acceptance_match_keys
    ),
    params.aggregation_condition,
  ].join("|");
}

/**
 * Exact ANY/ALL over a NON-EMPTY exact 097 match set.
 * Callers MUST gate on readiness HOLDS before invoking.
 * Empty arrays are an invariant violation (vacuous truth forbidden).
 */
export function evaluatePermissionSourceAggregationCondition(
  aggregationKind: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicyKind,
  matches: readonly AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch[]
): AttentionObservationOperationalEligibilityPermissionSourceAggregationCondition {
  if (matches.length === 0) {
    throw new Error(
      "Permission Source Aggregation Result invariant violated: empty match set (vacuous ANY/ALL forbidden; readiness MUST gate)"
    );
  }

  for (const match of matches) {
    if (
      match.match !== "LISTED_AS_ACCEPTABLE" &&
      match.match !== "NOT_LISTED_AS_ACCEPTABLE"
    ) {
      throw new Error(
        `Permission Source Aggregation Result invariant violated: unknown match value ${String(match.match)}`
      );
    }
  }

  if (aggregationKind === "ANY_PERMISSION_SOURCE_LISTED_AS_ACCEPTABLE") {
    return matches.some((m) => m.match === LISTED_AS_ACCEPTABLE)
      ? "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      : "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";
  }

  if (aggregationKind === "ALL_PERMISSION_SOURCES_LISTED_AS_ACCEPTABLE") {
    return matches.every((m) => m.match === LISTED_AS_ACCEPTABLE)
      ? "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      : "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";
  }

  throw new Error(
    `Unknown Permission Source Aggregation Policy kind: ${String(aggregationKind)}`
  );
}

function assertResultContext(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  readinessBasis: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis
): void {
  if (matchAssessment.candidate_key !== aggregationPolicy.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: match/aggregation Candidate mismatch`
    );
  }
  if (aggregationPolicy.candidate_key !== readinessBasis.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: aggregation/readiness Candidate mismatch`
    );
  }
  if (
    aggregationPolicy.observation_need_key !==
      readinessBasis.observation_need_key ||
    aggregationPolicy.capability_requirement_set_key !==
      readinessBasis.capability_requirement_set_key ||
    aggregationPolicy.operational_eligibility_dimension_policy_key !==
      readinessBasis.operational_eligibility_dimension_policy_key ||
    aggregationPolicy.dimension !== "PERMISSION" ||
    readinessBasis.dimension !== "PERMISSION"
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: aggregation/readiness context mismatch for candidate ${aggregationPolicy.candidate_key}`
    );
  }

  for (const match of matchAssessment.permission_source_acceptance_matches) {
    if (match.candidate_key !== aggregationPolicy.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: match Candidate mismatch for ${aggregationPolicy.candidate_key}`
      );
    }
    if (match.observation_need_key !== aggregationPolicy.observation_need_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: match ObservationNeed key mismatch for candidate ${aggregationPolicy.candidate_key}`
      );
    }
    if (
      match.capability_requirement_set_key !==
      aggregationPolicy.capability_requirement_set_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: match Requirement-set key mismatch for candidate ${aggregationPolicy.candidate_key}`
      );
    }
    if (match.dimension !== "PERMISSION") {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: non-PERMISSION match dimension for candidate ${aggregationPolicy.candidate_key}`
      );
    }
  }
}

/**
 * Lineage validation only — does not recompute readiness.
 * Exact 100 Basis must authorize the exact current 097 match set and 098 policy.
 */
function assertReadinessBasisLineage(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  readinessBasis: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis
): void {
  assertResultContext(matchAssessment, aggregationPolicy, readinessBasis);

  if (
    readinessBasis.permission_source_aggregation_policy_key !==
      aggregationPolicy.key ||
    readinessBasis.permission_source_aggregation_kind !==
      aggregationPolicy.aggregation_kind
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: stale Aggregation Policy lineage for candidate ${aggregationPolicy.candidate_key}`
    );
  }

  const currentMatchKeys =
    matchAssessment.permission_source_acceptance_matches.map((m) => m.key);
  if (
    !matchKeySetsEqual(
      currentMatchKeys,
      readinessBasis.current_permission_source_acceptance_match_keys
    )
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: stale Readiness Basis match-set lineage for candidate ${aggregationPolicy.candidate_key}`
    );
  }
}

/**
 * Candidate/context counterpart invariant for 097 × 098 × 100 join.
 * Missing/extra counterparts reject — do not reinterpret as policy/source absence.
 */
export function assertCompatibleOperationalEligibilityPermissionSourceAggregationResultContexts(
  matchSet: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment,
  aggregationPolicySet: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment,
  readinessBasisSet: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSetAssessment
): void {
  const matchCandidates = matchSet.candidate_assessments;
  const aggregationCandidates = aggregationPolicySet.candidate_assessments;
  const readinessCandidates = readinessBasisSet.candidate_assessments;

  if (
    matchCandidates.length !== aggregationCandidates.length ||
    matchCandidates.length !== readinessCandidates.length
  ) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const aggregationByKey = new Map(
    aggregationCandidates.map((c) => [c.candidate_key, c])
  );
  const readinessByKey = new Map(
    readinessCandidates.map((c) => [c.candidate_key, c])
  );
  const matchByKey = new Map(
    matchCandidates.map((c) => [c.candidate_key, c])
  );

  if (
    aggregationByKey.size !== aggregationCandidates.length ||
    readinessByKey.size !== readinessCandidates.length ||
    matchByKey.size !== matchCandidates.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in input sets`
    );
  }

  for (const matchCandidate of matchCandidates) {
    const aggregationCandidate = aggregationByKey.get(
      matchCandidate.candidate_key
    );
    const readinessCandidate = readinessByKey.get(matchCandidate.candidate_key);
    if (!aggregationCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Aggregation Policy candidate ${matchCandidate.candidate_key}`
      );
    }
    if (!readinessCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Aggregation Readiness Basis candidate ${matchCandidate.candidate_key}`
      );
    }

    if (
      readinessCandidate.permission_source_acceptance_match_assessment
        .candidate_key !== matchCandidate.candidate_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: embedded 097 mismatch for candidate ${matchCandidate.candidate_key}`
      );
    }

    const aggregationPolicy =
      aggregationCandidate.permission_source_aggregation_policy;
    const readinessBasis =
      readinessCandidate.permission_source_aggregation_readiness_basis;

    if (aggregationPolicy !== null && readinessBasis !== null) {
      assertResultContext(
        matchCandidate,
        aggregationPolicy,
        readinessBasis
      );
    } else if (aggregationPolicy !== null) {
      for (const match of matchCandidate.permission_source_acceptance_matches) {
        if (
          match.observation_need_key !== aggregationPolicy.observation_need_key ||
          match.capability_requirement_set_key !==
            aggregationPolicy.capability_requirement_set_key
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: match context mismatch for candidate ${matchCandidate.candidate_key}`
          );
        }
      }
    }
  }

  for (const aggregationCandidate of aggregationCandidates) {
    if (!matchByKey.has(aggregationCandidate.candidate_key)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Acceptance Match candidate ${aggregationCandidate.candidate_key}`
      );
    }
  }
  for (const readinessCandidate of readinessCandidates) {
    if (!matchByKey.has(readinessCandidate.candidate_key)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Acceptance Match candidate ${readinessCandidate.candidate_key}`
      );
    }
  }
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment
): void {
  const expectedHas =
    assessment.permission_source_aggregation_result !== null;
  if (
    assessment.has_permission_source_aggregation_result !== expectedHas
  ) {
    throw new Error(
      `Permission Source Aggregation Result invariant violated: has_result mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT" &&
    assessment.permission_source_aggregation_result === null
  ) {
    throw new Error(
      `Permission Source Aggregation Result invariant violated: PRESENT requires non-null result for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT" &&
    assessment.permission_source_aggregation_result !== null
  ) {
    throw new Error(
      `Permission Source Aggregation Result invariant violated: non-present status requires null result for candidate ${assessment.candidate_key}`
    );
  }
}

function buildAggregationResult(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  readinessBasis: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis
): AttentionObservationOperationalEligibilityPermissionSourceAggregationResult {
  assertReadinessBasisLineage(
    matchAssessment,
    aggregationPolicy,
    readinessBasis
  );

  if (
    readinessBasis.readiness_condition !==
    "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
  ) {
    throw new Error(
      `Permission Source Aggregation Result invariant violated: aggregation execution requires readiness HOLDS for candidate ${aggregationPolicy.candidate_key}`
    );
  }

  const matches = matchAssessment.permission_source_acceptance_matches;
  if (matches.length === 0) {
    throw new Error(
      `Permission Source Aggregation Result invariant violated: readiness HOLDS with empty match set for candidate ${aggregationPolicy.candidate_key}`
    );
  }

  const aggregation_condition = evaluatePermissionSourceAggregationCondition(
    aggregationPolicy.aggregation_kind,
    matches
  );

  const canonicalMatchKeys = [...matches.map((m) => m.key)].sort(
    compareStrings
  );

  return {
    key: attentionObservationOperationalEligibilityPermissionSourceAggregationResultKey(
      {
        candidate_key: aggregationPolicy.candidate_key,
        observation_need_key: aggregationPolicy.observation_need_key,
        capability_requirement_set_key:
          aggregationPolicy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key:
          aggregationPolicy.operational_eligibility_dimension_policy_key,
        permission_source_aggregation_policy_key: aggregationPolicy.key,
        permission_source_aggregation_kind: aggregationPolicy.aggregation_kind,
        permission_source_aggregation_readiness_basis_key: readinessBasis.key,
        permission_source_aggregation_readiness_policy_key:
          readinessBasis.permission_source_aggregation_readiness_policy_key,
        permission_source_aggregation_readiness_kind:
          readinessBasis.permission_source_aggregation_readiness_kind,
        current_permission_source_acceptance_match_keys: canonicalMatchKeys,
        aggregation_condition,
      }
    ),
    candidate_key: aggregationPolicy.candidate_key,
    observation_need_key: aggregationPolicy.observation_need_key,
    capability_requirement_set_key:
      aggregationPolicy.capability_requirement_set_key,
    dimension: "PERMISSION",
    operational_eligibility_dimension_policy_key:
      aggregationPolicy.operational_eligibility_dimension_policy_key,
    permission_source_aggregation_policy_key: aggregationPolicy.key,
    permission_source_aggregation_kind: aggregationPolicy.aggregation_kind,
    permission_source_aggregation_readiness_basis_key: readinessBasis.key,
    permission_source_aggregation_readiness_policy_key:
      readinessBasis.permission_source_aggregation_readiness_policy_key,
    permission_source_aggregation_readiness_kind:
      readinessBasis.permission_source_aggregation_readiness_kind,
    current_permission_source_acceptance_match_keys: canonicalMatchKeys,
    aggregation_condition,
  };
}

/**
 * Pure Candidate-level PERMISSION Source Aggregation Result.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY
 * 5. NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED
 * 6. NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED
 * 7. PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD
 * 8. PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResult(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  aggregationAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  readinessBasisAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment
): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment {
  const candidate_key = matchAssessment.candidate_key;

  if (
    candidate_key !== aggregationAssessment.candidate_key ||
    candidate_key !== readinessBasisAssessment.candidate_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch for ${candidate_key}`
    );
  }

  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultStatus,
    result: AttentionObservationOperationalEligibilityPermissionSourceAggregationResult | null
  ): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResultAssessment =
      {
        candidate_key,
        permission_source_acceptance_match_assessment: matchAssessment,
        permission_source_aggregation_policy_assessment: aggregationAssessment,
        permission_source_aggregation_readiness_basis_assessment:
          readinessBasisAssessment,
        status,
        permission_source_aggregation_result: result,
        has_permission_source_aggregation_result: result !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    matchAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    aggregationAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    readinessBasisAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    matchAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    aggregationAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    readinessBasisAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    matchAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    aggregationAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    readinessBasisAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      null
    );
  }

  if (
    matchAssessment.status ===
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" ||
    aggregationAssessment.status ===
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" ||
    readinessBasisAssessment.status ===
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  if (
    aggregationAssessment.status ===
      "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED" ||
    aggregationAssessment.permission_source_aggregation_policy === null ||
    readinessBasisAssessment.status ===
      "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED"
  ) {
    return wrap("NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED", null);
  }

  if (
    readinessBasisAssessment.status ===
    "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
      null
    );
  }

  if (
    readinessBasisAssessment.status !==
      "PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" ||
    readinessBasisAssessment.permission_source_aggregation_readiness_basis ===
      null
  ) {
    throw new Error(
      `Permission Source Aggregation Result invariant violated: unexpected readiness Basis status for candidate ${candidate_key}`
    );
  }

  const readinessBasis =
    readinessBasisAssessment.permission_source_aggregation_readiness_basis;

  if (
    readinessBasis.readiness_condition ===
    "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
  ) {
    return wrap(
      "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD",
      null
    );
  }

  if (
    readinessBasis.readiness_condition !==
    "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
  ) {
    throw new Error(
      `Permission Source Aggregation Result invariant violated: unknown readiness condition for candidate ${candidate_key}`
    );
  }

  if (
    aggregationAssessment.status !==
    "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT"
  ) {
    throw new Error(
      `Permission Source Aggregation Result invariant violated: unexpected aggregation policy status for candidate ${candidate_key}`
    );
  }

  return wrap(
    "PERMISSION_SOURCE_AGGREGATION_RESULT_PRESENT",
    buildAggregationResult(
      matchAssessment,
      aggregationAssessment.permission_source_aggregation_policy,
      readinessBasis
    )
  );
}

export function buildAttentionObservationOperationalEligibilityPermissionSourceAggregationResultSet(
  input: AttentionObservationOperationalEligibilityPermissionSourceAggregationResultInput
): AttentionObservationOperationalEligibilityPermissionSourceAggregationResultSetAssessment {
  assertCompatibleOperationalEligibilityPermissionSourceAggregationResultContexts(
    input.permission_source_acceptance_match_set,
    input.permission_source_aggregation_policy_set,
    input.permission_source_aggregation_readiness_basis_set
  );

  const aggregationByKey = new Map(
    input.permission_source_aggregation_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );
  const readinessByKey = new Map(
    input.permission_source_aggregation_readiness_basis_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.permission_source_acceptance_match_set.candidate_assessments.map(
      (matchAssessment) => {
        const aggregationAssessment = aggregationByKey.get(
          matchAssessment.candidate_key
        );
        const readinessBasisAssessment = readinessByKey.get(
          matchAssessment.candidate_key
        );
        if (!aggregationAssessment || !readinessBasisAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing counterpart for candidate ${matchAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationResult(
          matchAssessment,
          aggregationAssessment,
          readinessBasisAssessment
        );
      }
    );

  return {
    permission_source_acceptance_match_set:
      input.permission_source_acceptance_match_set,
    permission_source_aggregation_policy_set:
      input.permission_source_aggregation_policy_set,
    permission_source_aggregation_readiness_basis_set:
      input.permission_source_aggregation_readiness_basis_set,
    candidate_assessments,
    has_permission_source_aggregation_results: candidate_assessments.some(
      (a) => a.has_permission_source_aggregation_result
    ),
    has_permission_source_aggregation_conditions_holding:
      candidate_assessments.some(
        (a) =>
          a.permission_source_aggregation_result?.aggregation_condition ===
          "PERMISSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      ),
    has_permission_source_aggregation_conditions_not_holding:
      candidate_assessments.some(
        (a) =>
          a.permission_source_aggregation_result?.aggregation_condition ===
          "PERMISSION_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
    ],
  };
}
