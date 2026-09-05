/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Aggregation Readiness Basis core (GROUND-124).
 *
 * GROUND-121 AUTHORITY Source Acceptance Match
 * + GROUND-122 Explicit AUTHORITY Source Aggregation Policy
 * + GROUND-123 Explicit AUTHORITY Source Aggregation Readiness Policy
 * → AUTHORITY Source Aggregation Readiness Basis only.
 *
 * Exact readiness rule for REQUIRE_NON_EMPTY_…:
 *   matches.length > 0 → HOLDS
 *   matches.length = 0 → DOES_NOT_HOLD
 *
 * Must not import GROUND-117–120 / 084-direct / ProjectState.
 * Does not execute ANY/ALL. Does not invent vacuous truth.
 * LISTED/NOT_LISTED polarity is not inspected for readiness.
 * policy absence ≠ readiness DOES_NOT_HOLD
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-readiness-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisInput,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisModelLimitation,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisStatus,
  AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessCondition,
} from "./attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
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

export const EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET =
  "EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET" as const;

const CONTEXT_MISMATCH_PREFIX =
  "AUTHORITY Source Acceptance Match set, Aggregation Policy set, and Aggregation Readiness Policy set do not share the same observation Candidate context";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildCanonicalAuthoritySourceAcceptanceMatchKeySetKey(
  matchKeys: readonly string[]
): string {
  if (matchKeys.length === 0) {
    return EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET;
  }
  return [...matchKeys].sort(compareStrings).join(",");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|
 * authoritySourceAggregationPolicyKey|authoritySourceAggregationKind|
 * authoritySourceAggregationReadinessPolicyKey|authoritySourceAggregationReadinessKind|
 * current121Status|canonicalCurrentAcceptanceMatchKeySet|readinessCondition
 */
export function attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  authority_source_aggregation_policy_key: string;
  authority_source_aggregation_kind: string;
  authority_source_aggregation_readiness_policy_key: string;
  authority_source_aggregation_readiness_kind: string;
  current_authority_source_acceptance_match_status: string;
  current_authority_source_acceptance_match_keys: readonly string[];
  readiness_condition: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessCondition;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-source-aggregation-readiness-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    params.authority_source_aggregation_policy_key,
    params.authority_source_aggregation_kind,
    params.authority_source_aggregation_readiness_policy_key,
    params.authority_source_aggregation_readiness_kind,
    params.current_authority_source_acceptance_match_status,
    buildCanonicalAuthoritySourceAcceptanceMatchKeySetKey(
      params.current_authority_source_acceptance_match_keys
    ),
    params.readiness_condition,
  ].join("|");
}

/**
 * Exact GROUND-123 non-empty-match-set rule evaluation.
 * Cardinality only — no LISTED/NOT_LISTED polarity inspection.
 */
export function evaluateAuthoritySourceAggregationReadinessCondition(
  readinessKind: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy["readiness_kind"],
  matchCount: number
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessCondition {
  if (
    readinessKind !==
    "REQUIRE_NON_EMPTY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION"
  ) {
    throw new Error(
      `Unknown AUTHORITY Source Aggregation Readiness Policy kind: ${String(readinessKind)}`
    );
  }
  return matchCount > 0
    ? "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
    : "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD";
}

function assertPolicyPairContext(
  aggregationPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  readinessPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy
): void {
  if (aggregationPolicy.candidate_key !== readinessPolicy.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: aggregation/readiness Candidate mismatch`
    );
  }
  if (
    aggregationPolicy.observation_need_key !==
    readinessPolicy.observation_need_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for candidate ${aggregationPolicy.candidate_key}`
    );
  }
  if (
    aggregationPolicy.capability_requirement_set_key !==
    readinessPolicy.capability_requirement_set_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: Requirement-set key mismatch for candidate ${aggregationPolicy.candidate_key}`
    );
  }
  if (
    aggregationPolicy.operational_eligibility_dimension_policy_key !==
    readinessPolicy.operational_eligibility_dimension_policy_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: OE Dimension Policy key mismatch for candidate ${aggregationPolicy.candidate_key}`
    );
  }
  if (
    aggregationPolicy.dimension !== "AUTHORITY" ||
    readinessPolicy.dimension !== "AUTHORITY"
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: non-AUTHORITY dimension for candidate ${aggregationPolicy.candidate_key}`
    );
  }
}

function assertMatchSetAgainstPolicies(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  readinessPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy
): void {
  assertPolicyPairContext(aggregationPolicy, readinessPolicy);

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

  const criteriaPolicy =
    matchAssessment.authority_source_acceptance_criteria_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy;
  if (criteriaPolicy !== null) {
    if (
      criteriaPolicy.observation_need_key !==
      aggregationPolicy.observation_need_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: 121 criteria ObservationNeed key mismatch for candidate ${aggregationPolicy.candidate_key}`
      );
    }
    if (
      criteriaPolicy.capability_requirement_set_key !==
      aggregationPolicy.capability_requirement_set_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: 121 criteria Requirement-set key mismatch for candidate ${aggregationPolicy.candidate_key}`
      );
    }
    if (criteriaPolicy.key !== aggregationPolicy.operational_eligibility_dimension_policy_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: 121 criteria OE Dimension Policy key mismatch for candidate ${aggregationPolicy.candidate_key}`
      );
    }
  }
}

/**
 * Candidate/context counterpart invariant for 121 × 122 × 123 join.
 * Missing/extra counterparts reject — do not reinterpret as policy/source absence.
 */
export function assertCompatibleOperationalEligibilityAuthoritySourceAggregationReadinessBasisContexts(
  matchSet: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment,
  aggregationPolicySet: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicySetAssessment,
  readinessPolicySet: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicySetAssessment
): void {
  const matchCandidates = matchSet.candidate_assessments;
  const aggregationCandidates = aggregationPolicySet.candidate_assessments;
  const readinessCandidates = readinessPolicySet.candidate_assessments;

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

  if (
    aggregationByKey.size !== aggregationCandidates.length ||
    readinessByKey.size !== readinessCandidates.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in policy sets`
    );
  }

  const matchByKey = new Map(
    matchCandidates.map((c) => [c.candidate_key, c])
  );
  if (matchByKey.size !== matchCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in match set`
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
        `${CONTEXT_MISMATCH_PREFIX}: missing Aggregation Readiness Policy candidate ${matchCandidate.candidate_key}`
      );
    }

    const aggregationPolicy =
      aggregationCandidate.authority_source_aggregation_policy;
    const readinessPolicy =
      readinessCandidate.authority_source_aggregation_readiness_policy;

    if (aggregationPolicy !== null && readinessPolicy !== null) {
      assertMatchSetAgainstPolicies(
        matchCandidate,
        aggregationPolicy,
        readinessPolicy
      );
    } else if (aggregationPolicy !== null || readinessPolicy !== null) {
      const present = aggregationPolicy ?? readinessPolicy!;
      for (const match of matchCandidate.authority_source_acceptance_matches) {
        if (match.observation_need_key !== present.observation_need_key) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: match ObservationNeed key mismatch for candidate ${matchCandidate.candidate_key}`
          );
        }
        if (
          match.capability_requirement_set_key !==
          present.capability_requirement_set_key
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: match Requirement-set key mismatch for candidate ${matchCandidate.candidate_key}`
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
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment
): void {
  const expectedHas =
    assessment.authority_source_aggregation_readiness_basis !== null;
  if (
    assessment.has_authority_source_aggregation_readiness_basis !== expectedHas
  ) {
    throw new Error(
      `AUTHORITY Source Aggregation Readiness Basis invariant violated: has_basis mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" &&
    assessment.authority_source_aggregation_readiness_basis === null
  ) {
    throw new Error(
      `AUTHORITY Source Aggregation Readiness Basis invariant violated: PRESENT requires non-null Basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" &&
    assessment.authority_source_aggregation_readiness_basis !== null
  ) {
    throw new Error(
      `AUTHORITY Source Aggregation Readiness Basis invariant violated: non-present status requires null Basis for candidate ${assessment.candidate_key}`
    );
  }
}

function buildReadinessBasis(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationPolicy,
  readinessPolicy: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicy
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis {
  assertMatchSetAgainstPolicies(
    matchAssessment,
    aggregationPolicy,
    readinessPolicy
  );

  const matchKeys = matchAssessment.authority_source_acceptance_matches.map(
    (m) => m.key
  );
  const canonicalMatchKeys = [...matchKeys].sort(compareStrings);
  const readiness_condition = evaluateAuthoritySourceAggregationReadinessCondition(
    readinessPolicy.readiness_kind,
    matchKeys.length
  );

  return {
    key: attentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisKey(
      {
        candidate_key: aggregationPolicy.candidate_key,
        observation_need_key: aggregationPolicy.observation_need_key,
        capability_requirement_set_key:
          aggregationPolicy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key:
          aggregationPolicy.operational_eligibility_dimension_policy_key,
        authority_source_aggregation_policy_key: aggregationPolicy.key,
        authority_source_aggregation_kind: aggregationPolicy.aggregation_kind,
        authority_source_aggregation_readiness_policy_key: readinessPolicy.key,
        authority_source_aggregation_readiness_kind:
          readinessPolicy.readiness_kind,
        current_authority_source_acceptance_match_status:
          matchAssessment.status,
        current_authority_source_acceptance_match_keys: canonicalMatchKeys,
        readiness_condition,
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
    authority_source_aggregation_readiness_policy_key: readinessPolicy.key,
    authority_source_aggregation_readiness_kind: readinessPolicy.readiness_kind,
    current_authority_source_acceptance_match_keys: canonicalMatchKeys,
    current_authority_source_acceptance_match_status: matchAssessment.status,
    readiness_condition,
  };
}

/**
 * Pure Candidate-level AUTHORITY Source Aggregation Readiness Basis.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY
 * 5. NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED
 * 6. NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED
 * 7. AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  aggregationAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationPolicyAssessment,
  readinessAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment {
  const candidate_key = matchAssessment.candidate_key;

  if (
    candidate_key !== aggregationAssessment.candidate_key ||
    candidate_key !== readinessAssessment.candidate_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch for ${candidate_key}`
    );
  }

  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisStatus,
    basis: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis | null
  ): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisAssessment =
      {
        candidate_key,
        authority_source_acceptance_match_assessment: matchAssessment,
        authority_source_aggregation_policy_assessment: aggregationAssessment,
        authority_source_aggregation_readiness_policy_assessment:
          readinessAssessment,
        status,
        authority_source_aggregation_readiness_basis: basis,
        has_authority_source_aggregation_readiness_basis: basis !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    matchAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    aggregationAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    readinessAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    matchAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    aggregationAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    readinessAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    matchAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    aggregationAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    readinessAssessment.status ===
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
    readinessAssessment.status ===
      "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  if (
    aggregationAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED" ||
    aggregationAssessment.authority_source_aggregation_policy === null
  ) {
    return wrap("NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_DECLARED", null);
  }

  if (
    readinessAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED" ||
    readinessAssessment.authority_source_aggregation_readiness_policy === null
  ) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
      null
    );
  }

  if (
    aggregationAssessment.status !==
      "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_POLICY_PRESENT" ||
    readinessAssessment.status !==
      "EXPLICIT_AUTHORITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
  ) {
    throw new Error(
      `AUTHORITY Source Aggregation Readiness Basis invariant violated: unexpected policy statuses for candidate ${candidate_key}`
    );
  }

  return wrap(
    "AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT",
    buildReadinessBasis(
      matchAssessment,
      aggregationAssessment.authority_source_aggregation_policy,
      readinessAssessment.authority_source_aggregation_readiness_policy
    )
  );
}

export function buildAttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSet(
  input: AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisInput
): AttentionObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasisSetAssessment {
  assertCompatibleOperationalEligibilityAuthoritySourceAggregationReadinessBasisContexts(
    input.authority_source_acceptance_match_set,
    input.authority_source_aggregation_policy_set,
    input.authority_source_aggregation_readiness_policy_set
  );

  const aggregationByKey = new Map(
    input.authority_source_aggregation_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );
  const readinessByKey = new Map(
    input.authority_source_aggregation_readiness_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.authority_source_acceptance_match_set.candidate_assessments.map(
      (matchAssessment) => {
        const aggregationAssessment = aggregationByKey.get(
          matchAssessment.candidate_key
        );
        const readinessAssessment = readinessByKey.get(
          matchAssessment.candidate_key
        );
        if (!aggregationAssessment || !readinessAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing policy counterpart for candidate ${matchAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAggregationReadinessBasis(
          matchAssessment,
          aggregationAssessment,
          readinessAssessment
        );
      }
    );

  return {
    authority_source_acceptance_match_set:
      input.authority_source_acceptance_match_set,
    authority_source_aggregation_policy_set:
      input.authority_source_aggregation_policy_set,
    authority_source_aggregation_readiness_policy_set:
      input.authority_source_aggregation_readiness_policy_set,
    candidate_assessments,
    has_authority_source_aggregation_readiness_bases:
      candidate_assessments.some(
        (a) => a.has_authority_source_aggregation_readiness_basis
      ),
    has_authority_source_aggregation_readiness_conditions_holding:
      candidate_assessments.some(
        (a) =>
          a.authority_source_aggregation_readiness_basis
            ?.readiness_condition ===
          "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      ),
    has_authority_source_aggregation_readiness_conditions_not_holding:
      candidate_assessments.some(
        (a) =>
          a.authority_source_aggregation_readiness_basis
            ?.readiness_condition ===
          "AUTHORITY_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
