/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Authority
 * Source Aggregation Result core (GROUND-125).
 *
 * GROUND-121 AUTHORITY Source Acceptance Match
 * + GROUND-122 Explicit AUTHORITY Source Aggregation Policy
 * + GROUND-124 AUTHORITY Source Aggregation Readiness Basis
 * → AUTHORITY Source Aggregation Result only.
 *
 * Executes exact ANY/ALL ONLY when readiness HOLDS.
 * readiness DOES_NOT_HOLD → no result (≠ aggregation DOES_NOT_HOLD).
 * Never evaluates [].some / [].every as semantic aggregation.
 *
 * Must not import GROUND-123-direct / 117–120 / 084-direct / 116 / 024–090 /
 * 085 / ProjectState.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-policy-types.js";
import {
  buildCanonicalAuthoritySourceAcceptanceMatchKeySetKey,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationCondition,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationResult,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultInput,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultModelLimitation,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultStatus,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-result-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
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

const CONTEXT_MISMATCH_PREFIX =
  "AUTHORITY Source Acceptance Match set, Aggregation Policy set, and Aggregation Readiness Basis set do not share the same observation Candidate context";

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
 * attention-observation-operational-eligibility-authority-source-aggregation-result|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|
 * authoritySourceAggregationPolicyKey|authoritySourceAggregationKind|
 * authoritySourceAggregationReadinessBasisKey|
 * authoritySourceAggregationReadinessPolicyKey|authoritySourceAggregationReadinessKind|
 * canonicalCurrentAcceptanceMatchKeySet|aggregationCondition
 */
export function attentionObservationOperationalEligibilityAuthoritySourceAggregationResultKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  authority_source_aggregation_policy_key: string;
  authority_source_aggregation_kind: string;
  authority_source_aggregation_readiness_basis_key: string;
  authority_source_aggregation_readiness_policy_key: string;
  authority_source_aggregation_readiness_kind: string;
  current_authority_source_acceptance_match_keys: readonly string[];
  aggregation_condition: AttentionObservationOperationalEligibilityAuthoritySourceAggregationCondition;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-source-aggregation-result",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    params.authority_source_aggregation_policy_key,
    params.authority_source_aggregation_kind,
    params.authority_source_aggregation_readiness_basis_key,
    params.authority_source_aggregation_readiness_policy_key,
    params.authority_source_aggregation_readiness_kind,
    buildCanonicalAuthoritySourceAcceptanceMatchKeySetKey(
      params.current_authority_source_acceptance_match_keys
    ),
    params.aggregation_condition,
  ].join("|");
}

/**
 * Exact ANY/ALL over a NON-EMPTY exact 121 match set.
 * Callers MUST gate on readiness HOLDS before invoking.
 * Empty arrays are an invariant violation (vacuous truth forbidden).
 */
export function evaluateAuthoritySourceAggregationCondition(
  aggregationKind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicyKind,
  matches: readonly AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch[]
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationCondition {
  if (matches.length === 0) {
    throw new Error(
      "Authority Source Aggregation Result invariant violated: empty match set (vacuous ANY/ALL forbidden; readiness MUST gate)"
    );
  }

  for (const match of matches) {
    if (
      match.match !== "LISTED_AS_ACCEPTABLE" &&
      match.match !== "NOT_LISTED_AS_ACCEPTABLE"
    ) {
      throw new Error(
        `Authority Source Aggregation Result invariant violated: unknown match value ${String(match.match)}`
      );
    }
  }

  if (aggregationKind === "ANY_AUTHORITY_SOURCE_LISTED_AS_ACCEPTABLE") {
    return matches.some((m) => m.match === LISTED_AS_ACCEPTABLE)
      ? "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
      : "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";
  }

  if (aggregationKind === "ALL_AUTHORITY_SOURCES_LISTED_AS_ACCEPTABLE") {
    return matches.every((m) => m.match === LISTED_AS_ACCEPTABLE)
      ? "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
      : "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD";
  }

  throw new Error(
    `Unknown Authority Source Aggregation Policy kind: ${String(aggregationKind)}`
  );
}

function assertResultContext(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  readinessBasis: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis
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
    aggregationPolicy.dimension !== "AUTHORITY" ||
    readinessBasis.dimension !== "AUTHORITY"
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: aggregation/readiness context mismatch for candidate ${aggregationPolicy.candidate_key}`
    );
  }

  for (const match of matchAssessment.authority_source_acceptance_matches) {
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
    if (match.dimension !== "AUTHORITY") {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: non-AUTHORITY match dimension for candidate ${aggregationPolicy.candidate_key}`
      );
    }
  }
}

/**
 * Lineage validation only — does not recompute readiness.
 * Exact 124 Basis must authorize the exact current 121 match set and 122 policy.
 */
function assertReadinessBasisLineage(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  readinessBasis: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis
): void {
  assertResultContext(matchAssessment, aggregationPolicy, readinessBasis);

  if (
    readinessBasis.authority_source_aggregation_policy_key !==
      aggregationPolicy.key ||
    readinessBasis.authority_source_aggregation_kind !==
      aggregationPolicy.aggregation_kind
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: stale Aggregation Policy lineage for candidate ${aggregationPolicy.candidate_key}`
    );
  }

  const currentMatchKeys =
    matchAssessment.authority_source_acceptance_matches.map((m) => m.key);
  if (
    !matchKeySetsEqual(
      currentMatchKeys,
      readinessBasis.current_authority_source_acceptance_match_keys
    )
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: stale Readiness Basis match-set lineage for candidate ${aggregationPolicy.candidate_key}`
    );
  }
}

/**
 * Candidate/context counterpart invariant for 121 × 122 × 124 join.
 * Missing/extra counterparts reject — do not reinterpret as policy/source absence.
 */
export function assertCompatibleOperationalEligibilityAuthoritySourceAggregationResultContexts(
  matchSet: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment,
  aggregationPolicySet: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment,
  readinessBasisSet: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSetAssessment
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
      readinessCandidate.authority_source_acceptance_match_assessment
        .candidate_key !== matchCandidate.candidate_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: embedded 121 mismatch for candidate ${matchCandidate.candidate_key}`
      );
    }

    const aggregationPolicy =
      aggregationCandidate.authority_source_aggregation_policy;
    const readinessBasis =
      readinessCandidate.authority_source_aggregation_readiness_basis;

    if (aggregationPolicy !== null && readinessBasis !== null) {
      assertResultContext(
        matchCandidate,
        aggregationPolicy,
        readinessBasis
      );
    } else if (aggregationPolicy !== null) {
      for (const match of matchCandidate.authority_source_acceptance_matches) {
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
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment
): void {
  const expectedHas =
    assessment.authority_source_aggregation_result !== null;
  if (
    assessment.has_authority_source_aggregation_result !== expectedHas
  ) {
    throw new Error(
      `Authority Source Aggregation Result invariant violated: has_result mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "AUTHORITY_SOURCE_AGGREGATION_RESULT_PRESENT" &&
    assessment.authority_source_aggregation_result === null
  ) {
    throw new Error(
      `Authority Source Aggregation Result invariant violated: PRESENT requires non-null result for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "AUTHORITY_SOURCE_AGGREGATION_RESULT_PRESENT" &&
    assessment.authority_source_aggregation_result !== null
  ) {
    throw new Error(
      `Authority Source Aggregation Result invariant violated: non-present status requires null result for candidate ${assessment.candidate_key}`
    );
  }
}

function buildAggregationResult(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  readinessBasis: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationResult {
  assertReadinessBasisLineage(
    matchAssessment,
    aggregationPolicy,
    readinessBasis
  );

  if (
    readinessBasis.readiness_condition !==
    "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
  ) {
    throw new Error(
      `Authority Source Aggregation Result invariant violated: aggregation execution requires readiness HOLDS for candidate ${aggregationPolicy.candidate_key}`
    );
  }

  const matches = matchAssessment.authority_source_acceptance_matches;
  if (matches.length === 0) {
    throw new Error(
      `Authority Source Aggregation Result invariant violated: readiness HOLDS with empty match set for candidate ${aggregationPolicy.candidate_key}`
    );
  }

  const aggregation_condition = evaluateAuthoritySourceAggregationCondition(
    aggregationPolicy.aggregation_kind,
    matches
  );

  const canonicalMatchKeys = [...matches.map((m) => m.key)].sort(
    compareStrings
  );

  return {
    key: attentionObservationOperationalEligibilityAuthoritySourceAggregationResultKey(
      {
        candidate_key: aggregationPolicy.candidate_key,
        observation_need_key: aggregationPolicy.observation_need_key,
        capability_requirement_set_key:
          aggregationPolicy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key:
          aggregationPolicy.operational_eligibility_dimension_policy_key,
        authority_source_aggregation_policy_key: aggregationPolicy.key,
        authority_source_aggregation_kind: aggregationPolicy.aggregation_kind,
        authority_source_aggregation_readiness_basis_key: readinessBasis.key,
        authority_source_aggregation_readiness_policy_key:
          readinessBasis.authority_source_aggregation_readiness_policy_key,
        authority_source_aggregation_readiness_kind:
          readinessBasis.authority_source_aggregation_readiness_kind,
        current_authority_source_acceptance_match_keys: canonicalMatchKeys,
        aggregation_condition,
      }
    ),
    candidate_key: aggregationPolicy.candidate_key,
    observation_need_key: aggregationPolicy.observation_need_key,
    capability_requirement_set_key:
      aggregationPolicy.capability_requirement_set_key,
    dimension: "AUTHORITY",
    operational_eligibility_dimension_policy_key:
      aggregationPolicy.operational_eligibility_dimension_policy_key,
    authority_source_aggregation_policy_key: aggregationPolicy.key,
    authority_source_aggregation_kind: aggregationPolicy.aggregation_kind,
    authority_source_aggregation_readiness_basis_key: readinessBasis.key,
    authority_source_aggregation_readiness_policy_key:
      readinessBasis.authority_source_aggregation_readiness_policy_key,
    authority_source_aggregation_readiness_kind:
      readinessBasis.authority_source_aggregation_readiness_kind,
    current_authority_source_acceptance_match_keys: canonicalMatchKeys,
    aggregation_condition,
  };
}

/**
 * Pure Candidate-level AUTHORITY Source Aggregation Result.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY
 * 5. NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED
 * 6. NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED
 * 7. AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD
 * 8. AUTHORITY_SOURCE_AGGREGATION_RESULT_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResult(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  aggregationAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  readinessBasisAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment
): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment {
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
    status: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultStatus,
    result: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResult | null
  ): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResultAssessment =
      {
        candidate_key,
        authority_source_acceptance_match_assessment: matchAssessment,
        authority_source_aggregation_policy_assessment: aggregationAssessment,
        authority_source_aggregation_readiness_basis_assessment:
          readinessBasisAssessment,
        status,
        authority_source_aggregation_result: result,
        has_authority_source_aggregation_result: result !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
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
      "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" ||
    aggregationAssessment.status ===
      "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" ||
    readinessBasisAssessment.status ===
      "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  if (
    aggregationAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED" ||
    aggregationAssessment.authority_source_aggregation_policy === null ||
    readinessBasisAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED"
  ) {
    return wrap("NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED", null);
  }

  if (
    readinessBasisAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
      null
    );
  }

  if (
    readinessBasisAssessment.status !==
      "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" ||
    readinessBasisAssessment.authority_source_aggregation_readiness_basis ===
      null
  ) {
    throw new Error(
      `Authority Source Aggregation Result invariant violated: unexpected readiness Basis status for candidate ${candidate_key}`
    );
  }

  const readinessBasis =
    readinessBasisAssessment.authority_source_aggregation_readiness_basis;

  if (
    readinessBasis.readiness_condition ===
    "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
  ) {
    const currentMatchCount =
      matchAssessment.authority_source_acceptance_matches.length;
    if (currentMatchCount !== 0) {
      throw new Error(
        `AUTHORITY Source Aggregation Result invariant violated: readiness DOES_NOT_HOLD with non-empty match set for candidate ${candidate_key}`
      );
    }
    return wrap(
      "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD",
      null
    );
  }

  if (
    readinessBasis.readiness_condition !==
    "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
  ) {
    throw new Error(
      `Authority Source Aggregation Result invariant violated: unknown readiness condition for candidate ${candidate_key}`
    );
  }

  if (
    aggregationAssessment.status !==
    "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT"
  ) {
    throw new Error(
      `Authority Source Aggregation Result invariant violated: unexpected aggregation policy status for candidate ${candidate_key}`
    );
  }

  return wrap(
    "AUTHORITY_SOURCE_AGGREGATION_RESULT_PRESENT",
    buildAggregationResult(
      matchAssessment,
      aggregationAssessment.authority_source_aggregation_policy,
      readinessBasis
    )
  );
}

export function buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSet(
  input: AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultInput
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationResultSetAssessment {
  assertCompatibleOperationalEligibilityAuthoritySourceAggregationResultContexts(
    input.authority_source_acceptance_match_set,
    input.authority_source_aggregation_policy_set,
    input.authority_source_aggregation_readiness_basis_set
  );

  const aggregationByKey = new Map(
    input.authority_source_aggregation_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );
  const readinessByKey = new Map(
    input.authority_source_aggregation_readiness_basis_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.authority_source_acceptance_match_set.candidate_assessments.map(
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
        return assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationResult(
          matchAssessment,
          aggregationAssessment,
          readinessBasisAssessment
        );
      }
    );

  return {
    authority_source_acceptance_match_set:
      input.authority_source_acceptance_match_set,
    authority_source_aggregation_policy_set:
      input.authority_source_aggregation_policy_set,
    authority_source_aggregation_readiness_basis_set:
      input.authority_source_aggregation_readiness_basis_set,
    candidate_assessments,
    has_authority_source_aggregation_results: candidate_assessments.some(
      (a) => a.has_authority_source_aggregation_result
    ),
    has_authority_source_aggregation_conditions_holding:
      candidate_assessments.some(
        (a) =>
          a.authority_source_aggregation_result?.aggregation_condition ===
          "AUTHORITY_SOURCE_AGGREGATION_CONDITION_HOLDS"
      ),
    has_authority_source_aggregation_conditions_not_holding:
      candidate_assessments.some(
        (a) =>
          a.authority_source_aggregation_result?.aggregation_condition ===
          "AUTHORITY_SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
    ],
  };
}
