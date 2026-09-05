/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Aggregation Readiness Basis core (GROUND-100).
 *
 * GROUND-097 PERMISSION Source Acceptance Match
 * + GROUND-098 Explicit PERMISSION Source Aggregation Policy
 * + GROUND-099 Explicit PERMISSION Source Aggregation Readiness Policy
 * → PERMISSION Source Aggregation Readiness Basis only.
 *
 * Exact readiness rule for REQUIRE_NON_EMPTY_…:
 *   matches.length > 0 → HOLDS
 *   matches.length = 0 → DOES_NOT_HOLD
 *
 * Must not import GROUND-093–096 / 084-direct / 091 / 024–090 / 085 /
 * ProjectState.
 *
 * Does not execute ANY/ALL. Does not invent vacuous truth.
 * LISTED/NOT_LISTED polarity is not inspected for readiness.
 * policy absence ≠ readiness DOES_NOT_HOLD
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySetAssessment,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-readiness-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisInput,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisModelLimitation,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisStatus,
  AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessCondition,
} from "./attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
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

export const EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET =
  "EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET" as const;

const CONTEXT_MISMATCH_PREFIX =
  "PERMISSION Source Acceptance Match set, Aggregation Policy set, and Aggregation Readiness Policy set do not share the same observation Candidate context";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildCanonicalPermissionSourceAcceptanceMatchKeySetKey(
  matchKeys: readonly string[]
): string {
  if (matchKeys.length === 0) {
    return EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET;
  }
  return [...matchKeys].sort(compareStrings).join(",");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|
 * permissionSourceAggregationPolicyKey|permissionSourceAggregationKind|
 * permissionSourceAggregationReadinessPolicyKey|permissionSourceAggregationReadinessKind|
 * current097Status|canonicalCurrentAcceptanceMatchKeySet|readinessCondition
 */
export function attentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  permission_source_aggregation_policy_key: string;
  permission_source_aggregation_kind: string;
  permission_source_aggregation_readiness_policy_key: string;
  permission_source_aggregation_readiness_kind: string;
  current_permission_source_acceptance_match_status: string;
  current_permission_source_acceptance_match_keys: readonly string[];
  readiness_condition: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessCondition;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-source-aggregation-readiness-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    params.permission_source_aggregation_policy_key,
    params.permission_source_aggregation_kind,
    params.permission_source_aggregation_readiness_policy_key,
    params.permission_source_aggregation_readiness_kind,
    params.current_permission_source_acceptance_match_status,
    buildCanonicalPermissionSourceAcceptanceMatchKeySetKey(
      params.current_permission_source_acceptance_match_keys
    ),
    params.readiness_condition,
  ].join("|");
}

/**
 * Exact GROUND-099 non-empty-match-set rule evaluation.
 * Cardinality only — no LISTED/NOT_LISTED polarity inspection.
 */
export function evaluatePermissionSourceAggregationReadinessCondition(
  readinessKind: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy["readiness_kind"],
  matchCount: number
): AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessCondition {
  if (
    readinessKind !==
    "REQUIRE_NON_EMPTY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_SET_BEFORE_AGGREGATION"
  ) {
    throw new Error(
      `Unknown Permission Source Aggregation Readiness Policy kind: ${String(readinessKind)}`
    );
  }
  return matchCount > 0
    ? "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
    : "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD";
}

function assertPolicyPairContext(
  aggregationPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  readinessPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy
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
    aggregationPolicy.dimension !== "PERMISSION" ||
    readinessPolicy.dimension !== "PERMISSION"
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: non-PERMISSION dimension for candidate ${aggregationPolicy.candidate_key}`
    );
  }
}

function assertMatchSetAgainstPolicies(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  readinessPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy
): void {
  assertPolicyPairContext(aggregationPolicy, readinessPolicy);

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

  const criteriaPolicy =
    matchAssessment.permission_source_acceptance_criteria_assessment
      .operational_eligibility_dimension_policy_assessment
      .operational_eligibility_dimension_policy;
  if (criteriaPolicy !== null) {
    if (
      criteriaPolicy.observation_need_key !==
      aggregationPolicy.observation_need_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: 097 criteria ObservationNeed key mismatch for candidate ${aggregationPolicy.candidate_key}`
      );
    }
    if (
      criteriaPolicy.capability_requirement_set_key !==
      aggregationPolicy.capability_requirement_set_key
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: 097 criteria Requirement-set key mismatch for candidate ${aggregationPolicy.candidate_key}`
      );
    }
    if (criteriaPolicy.key !== aggregationPolicy.operational_eligibility_dimension_policy_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: 097 criteria OE Dimension Policy key mismatch for candidate ${aggregationPolicy.candidate_key}`
      );
    }
  }
}

/**
 * Candidate/context counterpart invariant for 097 × 098 × 099 join.
 * Missing/extra counterparts reject — do not reinterpret as policy/source absence.
 */
export function assertCompatibleOperationalEligibilityPermissionSourceAggregationReadinessBasisContexts(
  matchSet: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment,
  aggregationPolicySet: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicySetAssessment,
  readinessPolicySet: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicySetAssessment
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
      aggregationCandidate.permission_source_aggregation_policy;
    const readinessPolicy =
      readinessCandidate.permission_source_aggregation_readiness_policy;

    if (aggregationPolicy !== null && readinessPolicy !== null) {
      assertMatchSetAgainstPolicies(
        matchCandidate,
        aggregationPolicy,
        readinessPolicy
      );
    } else if (aggregationPolicy !== null || readinessPolicy !== null) {
      // One present and one absent is a valid declarative combination for
      // candidate assessment (no Basis); context still must not contradict
      // when the present policy is compared against current matches.
      const present = aggregationPolicy ?? readinessPolicy!;
      for (const match of matchCandidate.permission_source_acceptance_matches) {
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
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment
): void {
  const expectedHas =
    assessment.permission_source_aggregation_readiness_basis !== null;
  if (
    assessment.has_permission_source_aggregation_readiness_basis !== expectedHas
  ) {
    throw new Error(
      `Permission Source Aggregation Readiness Basis invariant violated: has_basis mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" &&
    assessment.permission_source_aggregation_readiness_basis === null
  ) {
    throw new Error(
      `Permission Source Aggregation Readiness Basis invariant violated: PRESENT requires non-null Basis for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" &&
    assessment.permission_source_aggregation_readiness_basis !== null
  ) {
    throw new Error(
      `Permission Source Aggregation Readiness Basis invariant violated: non-present status requires null Basis for candidate ${assessment.candidate_key}`
    );
  }
}

function buildReadinessBasis(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  aggregationPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationPolicy,
  readinessPolicy: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicy
): AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis {
  assertMatchSetAgainstPolicies(
    matchAssessment,
    aggregationPolicy,
    readinessPolicy
  );

  const matchKeys = matchAssessment.permission_source_acceptance_matches.map(
    (m) => m.key
  );
  const canonicalMatchKeys = [...matchKeys].sort(compareStrings);
  const readiness_condition = evaluatePermissionSourceAggregationReadinessCondition(
    readinessPolicy.readiness_kind,
    matchKeys.length
  );

  return {
    key: attentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisKey(
      {
        candidate_key: aggregationPolicy.candidate_key,
        observation_need_key: aggregationPolicy.observation_need_key,
        capability_requirement_set_key:
          aggregationPolicy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key:
          aggregationPolicy.operational_eligibility_dimension_policy_key,
        permission_source_aggregation_policy_key: aggregationPolicy.key,
        permission_source_aggregation_kind: aggregationPolicy.aggregation_kind,
        permission_source_aggregation_readiness_policy_key: readinessPolicy.key,
        permission_source_aggregation_readiness_kind:
          readinessPolicy.readiness_kind,
        current_permission_source_acceptance_match_status:
          matchAssessment.status,
        current_permission_source_acceptance_match_keys: canonicalMatchKeys,
        readiness_condition,
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
    permission_source_aggregation_readiness_policy_key: readinessPolicy.key,
    permission_source_aggregation_readiness_kind: readinessPolicy.readiness_kind,
    current_permission_source_acceptance_match_keys: canonicalMatchKeys,
    current_permission_source_acceptance_match_status: matchAssessment.status,
    readiness_condition,
  };
}

/**
 * Pure Candidate-level PERMISSION Source Aggregation Readiness Basis.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY
 * 5. NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED
 * 6. NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED
 * 7. PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis(
  matchAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  aggregationAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationPolicyAssessment,
  readinessAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessPolicyAssessment
): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment {
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
    status: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisStatus,
    basis: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis | null
  ): AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisAssessment =
      {
        candidate_key,
        permission_source_acceptance_match_assessment: matchAssessment,
        permission_source_aggregation_policy_assessment: aggregationAssessment,
        permission_source_aggregation_readiness_policy_assessment:
          readinessAssessment,
        status,
        permission_source_aggregation_readiness_basis: basis,
        has_permission_source_aggregation_readiness_basis: basis !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
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
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" ||
    aggregationAssessment.status ===
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY" ||
    readinessAssessment.status ===
      "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  if (
    aggregationAssessment.status ===
      "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED" ||
    aggregationAssessment.permission_source_aggregation_policy === null
  ) {
    return wrap("NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_DECLARED", null);
  }

  if (
    readinessAssessment.status ===
      "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED" ||
    readinessAssessment.permission_source_aggregation_readiness_policy === null
  ) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_DECLARED",
      null
    );
  }

  if (
    aggregationAssessment.status !==
      "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_POLICY_PRESENT" ||
    readinessAssessment.status !==
      "EXPLICIT_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
  ) {
    throw new Error(
      `Permission Source Aggregation Readiness Basis invariant violated: unexpected policy statuses for candidate ${candidate_key}`
    );
  }

  return wrap(
    "PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT",
    buildReadinessBasis(
      matchAssessment,
      aggregationAssessment.permission_source_aggregation_policy,
      readinessAssessment.permission_source_aggregation_readiness_policy
    )
  );
}

export function buildAttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSet(
  input: AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisInput
): AttentionObservationOperationalEligibilityPermissionSourceAggregationReadinessBasisSetAssessment {
  assertCompatibleOperationalEligibilityPermissionSourceAggregationReadinessBasisContexts(
    input.permission_source_acceptance_match_set,
    input.permission_source_aggregation_policy_set,
    input.permission_source_aggregation_readiness_policy_set
  );

  const aggregationByKey = new Map(
    input.permission_source_aggregation_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );
  const readinessByKey = new Map(
    input.permission_source_aggregation_readiness_policy_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.permission_source_acceptance_match_set.candidate_assessments.map(
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
        return assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAggregationReadinessBasis(
          matchAssessment,
          aggregationAssessment,
          readinessAssessment
        );
      }
    );

  return {
    permission_source_acceptance_match_set:
      input.permission_source_acceptance_match_set,
    permission_source_aggregation_policy_set:
      input.permission_source_aggregation_policy_set,
    permission_source_aggregation_readiness_policy_set:
      input.permission_source_aggregation_readiness_policy_set,
    candidate_assessments,
    has_permission_source_aggregation_readiness_bases:
      candidate_assessments.some(
        (a) => a.has_permission_source_aggregation_readiness_basis
      ),
    has_permission_source_aggregation_readiness_conditions_holding:
      candidate_assessments.some(
        (a) =>
          a.permission_source_aggregation_readiness_basis
            ?.readiness_condition ===
          "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_HOLDS"
      ),
    has_permission_source_aggregation_readiness_conditions_not_holding:
      candidate_assessments.some(
        (a) =>
          a.permission_source_aggregation_readiness_basis
            ?.readiness_condition ===
          "PERMISSION_SOURCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD"
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
