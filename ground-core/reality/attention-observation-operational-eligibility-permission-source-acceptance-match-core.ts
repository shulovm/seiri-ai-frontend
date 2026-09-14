import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Acceptance Match core (GROUND-097).
 *
 * GROUND-093 PERMISSION State Source Bridge
 * + GROUND-096 Explicit PERMISSION Source Acceptance Criterion
 * → exact PERMISSION Source Acceptance Match only.
 *
 * Exact rule:
 *   criterion.accepted_permission_states.includes(source.permission_state)
 *     → LISTED_AS_ACCEPTABLE
 *     → otherwise NOT_LISTED_AS_ACCEPTABLE
 *
 * Must not import GROUND-094 / 095 / 084-direct / 091-core / 024–090 / 085 /
 * ProjectState.
 *
 * LISTED_AS_ACCEPTABLE ≠ ACCEPTED ≠ PASS
 * NOT_LISTED_AS_ACCEPTABLE ≠ REJECTED ≠ FAIL
 * criterion absence ≠ NOT_LISTED
 * source absence ≠ NOT_LISTED
 * acceptance match ≠ resolution ≠ coverage ≠ aggregation ≠ OE
 */

import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion,
} from "./attention-observation-operational-eligibility-permission-source-acceptance-criteria-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
  AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment,
} from "./attention-observation-operational-eligibility-permission-state-source-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchInput,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchModelLimitation,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchStatus,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchValue,
} from "./attention-observation-operational-eligibility-permission-source-acceptance-match-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
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

const CONTEXT_MISMATCH_PREFIX =
  "PERMISSION State Source set and PERMISSION Source Acceptance Criteria set do not share the same observation Candidate context";

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-source-acceptance-match|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * permissionContextBindingKey|permissionStateSourceKey|permissionStateBasisKey|
 * permissionEvaluationAt|permissionSourceAcceptanceCriterionKey|
 * permissionState|match
 */
export function attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  permission_state_source_key: string;
  permission_state_basis_key: string;
  permission_evaluation_at: string;
  permission_source_acceptance_criterion_key: string;
  permission_state: string;
  match: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchValue;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-source-acceptance-match",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.permission_context_binding_key,
    params.permission_state_source_key,
    params.permission_state_basis_key,
    temporalInstantKey(params.permission_evaluation_at),
    params.permission_source_acceptance_criterion_key,
    params.permission_state,
    params.match,
  ].join("|");
}

/**
 * Exact enum-value membership only.
 * No polarity / resolution / wildcard / fallback inference.
 */
export function matchOperationalEligibilityPermissionSourceAcceptance(
  accepted_permission_states: readonly string[],
  permission_state: string
): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchValue {
  return accepted_permission_states.includes(permission_state)
    ? "LISTED_AS_ACCEPTABLE"
    : "NOT_LISTED_AS_ACCEPTABLE";
}

function assertSourceCriterionContext(
  source: AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
  criterion: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion
): void {
  if (source.candidate_key !== criterion.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: source Candidate mismatch for ${criterion.candidate_key}`
    );
  }
  if (source.observation_need_key !== criterion.observation_need_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for candidate ${criterion.candidate_key}`
    );
  }
  if (
    source.capability_requirement_set_key !==
    criterion.capability_requirement_set_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: Requirement-set key mismatch for candidate ${criterion.candidate_key}`
    );
  }
  if (source.dimension !== "PERMISSION") {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: non-PERMISSION source dimension ${source.dimension} for candidate ${criterion.candidate_key}`
    );
  }
}

function buildMatch(
  source: AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
  criterion: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion
): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch {
  assertSourceCriterionContext(source, criterion);
  const match = matchOperationalEligibilityPermissionSourceAcceptance(
    criterion.accepted_permission_states,
    source.permission_state
  );
  return {
    key: attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey(
      {
        candidate_key: source.candidate_key,
        observation_need_key: source.observation_need_key,
        capability_requirement_set_key: source.capability_requirement_set_key,
        permission_context_binding_key: source.permission_context_binding_key,
        permission_state_source_key: source.key,
        permission_state_basis_key: source.permission_state_basis_key,
        permission_evaluation_at: source.permission_evaluation_at,
        permission_source_acceptance_criterion_key: criterion.key,
        permission_state: source.permission_state,
        match,
      }
    ),
    candidate_key: source.candidate_key,
    observation_need_key: source.observation_need_key,
    capability_requirement_set_key: source.capability_requirement_set_key,
    permission_context_binding_key: source.permission_context_binding_key,
    dimension: "PERMISSION",
    permission_state_source_key: source.key,
    permission_state_basis_key: source.permission_state_basis_key,
    permission_evaluation_at: source.permission_evaluation_at,
    permission_state: source.permission_state,
    permission_source_acceptance_criterion_key: criterion.key,
    match,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment
): void {
  const matches = assessment.permission_source_acceptance_matches;
  const expectedHasMatches = matches.length > 0;
  if (assessment.has_permission_source_acceptance_matches !== expectedHasMatches) {
    throw new Error(
      `Permission Source Acceptance Match invariant violated: has_matches mismatch for candidate ${assessment.candidate_key}`
    );
  }

  const expectedListed = matches.some((m) => m.match === "LISTED_AS_ACCEPTABLE");
  if (assessment.has_listed_as_acceptable_permission_sources !== expectedListed) {
    throw new Error(
      `Permission Source Acceptance Match invariant violated: has_listed mismatch for candidate ${assessment.candidate_key}`
    );
  }

  const expectedNotListed = matches.some(
    (m) => m.match === "NOT_LISTED_AS_ACCEPTABLE"
  );
  if (
    assessment.has_not_listed_as_acceptable_permission_sources !==
    expectedNotListed
  ) {
    throw new Error(
      `Permission Source Acceptance Match invariant violated: has_not_listed mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT" &&
    matches.length === 0
  ) {
    throw new Error(
      `Permission Source Acceptance Match invariant violated: MATCHES_PRESENT requires non-empty matches for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT" &&
    matches.length !== 0
  ) {
    throw new Error(
      `Permission Source Acceptance Match invariant violated: non-present status requires empty matches for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Candidate/context counterpart invariant for 093 × 096 join.
 * Missing/extra counterparts reject — do not reinterpret as no-criterion/no-source.
 */
export function assertCompatibleOperationalEligibilityPermissionSourceAcceptanceMatchContexts(
  sourceSet: AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment,
  criteriaSet: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSetAssessment
): void {
  const sourceCandidates = sourceSet.candidate_assessments;
  const criteriaCandidates = criteriaSet.candidate_assessments;

  if (sourceCandidates.length !== criteriaCandidates.length) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const criteriaByKey = new Map(
    criteriaCandidates.map((c) => [c.candidate_key, c])
  );
  if (criteriaByKey.size !== criteriaCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate Acceptance Criteria candidate keys`
    );
  }

  const sourceByKey = new Map(
    sourceCandidates.map((c) => [c.candidate_key, c])
  );
  if (sourceByKey.size !== sourceCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate Permission source candidate keys`
    );
  }

  for (const sourceCandidate of sourceCandidates) {
    const criteriaCandidate = criteriaByKey.get(sourceCandidate.candidate_key);
    if (!criteriaCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Acceptance Criteria candidate ${sourceCandidate.candidate_key}`
      );
    }

    const criterion = criteriaCandidate.permission_source_acceptance_criterion;
    if (criterion !== null) {
      if (criterion.candidate_key !== sourceCandidate.candidate_key) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: criterion Candidate mismatch for ${sourceCandidate.candidate_key}`
        );
      }
      for (const source of sourceCandidate.permission_state_sources) {
        assertSourceCriterionContext(source, criterion);
      }
    } else {
      const policy =
        criteriaCandidate.operational_eligibility_dimension_policy_assessment
          .operational_eligibility_dimension_policy;
      if (policy !== null) {
        for (const source of sourceCandidate.permission_state_sources) {
          if (source.observation_need_key !== policy.observation_need_key) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for candidate ${sourceCandidate.candidate_key}`
            );
          }
          if (
            source.capability_requirement_set_key !==
            policy.capability_requirement_set_key
          ) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: Requirement-set key mismatch for candidate ${sourceCandidate.candidate_key}`
            );
          }
        }
      }
    }
  }

  for (const criteriaCandidate of criteriaCandidates) {
    if (!sourceByKey.has(criteriaCandidate.candidate_key)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Permission source candidate ${criteriaCandidate.candidate_key}`
      );
    }
  }
}

/**
 * Pure Candidate-level PERMISSION Source Acceptance Match.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY
 * 5. NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED
 * 6. NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 7. NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED
 * 8. PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatch(
  sourceAssessment: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  criteriaAssessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment
): AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment {
  const candidate_key = sourceAssessment.candidate_key;

  if (candidate_key !== criteriaAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key} vs ${criteriaAssessment.candidate_key})`
    );
  }

  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchStatus,
    permission_source_acceptance_matches: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatch[]
  ): AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatchAssessment =
      {
        candidate_key,
        permission_state_source_assessment: sourceAssessment,
        permission_source_acceptance_criteria_assessment: criteriaAssessment,
        status,
        permission_source_acceptance_matches,
        has_permission_source_acceptance_matches:
          permission_source_acceptance_matches.length > 0,
        has_listed_as_acceptable_permission_sources:
          permission_source_acceptance_matches.some(
            (m) => m.match === "LISTED_AS_ACCEPTABLE"
          ),
        has_not_listed_as_acceptable_permission_sources:
          permission_source_acceptance_matches.some(
            (m) => m.match === "NOT_LISTED_AS_ACCEPTABLE"
          ),
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    criteriaAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    sourceAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", []);
  }

  if (
    criteriaAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    sourceAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", []);
  }

  if (
    criteriaAssessment.status ===
    "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      []
    );
  }

  if (
    criteriaAssessment.status ===
    "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", []);
  }

  if (
    criteriaAssessment.status ===
    "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
      []
    );
  }

  if (
    criteriaAssessment.status !==
      "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT" ||
    criteriaAssessment.permission_source_acceptance_criterion === null
  ) {
    throw new Error(
      `Permission Source Acceptance Match invariant violated: unexpected criteria status ${criteriaAssessment.status} for candidate ${candidate_key}`
    );
  }

  const criterion = criteriaAssessment.permission_source_acceptance_criterion;

  if (
    sourceAssessment.status ===
    "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      []
    );
  }

  if (
    sourceAssessment.status ===
    "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  ) {
    return wrap("NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED", []);
  }

  if (
    sourceAssessment.status !==
    "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT"
  ) {
    throw new Error(
      `Permission Source Acceptance Match invariant violated: unexpected source status ${sourceAssessment.status} for candidate ${candidate_key}`
    );
  }

  const sources = sourceAssessment.permission_state_sources;
  if (sources.length === 0) {
    throw new Error(
      `Permission Source Acceptance Match invariant violated: SOURCES_PRESENT with empty sources for candidate ${candidate_key}`
    );
  }

  const permission_source_acceptance_matches = sources.map((source) =>
    buildMatch(source, criterion)
  );

  return wrap(
    "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT",
    permission_source_acceptance_matches
  );
}

export function buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSet(
  input: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchInput
): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSetAssessment {
  assertCompatibleOperationalEligibilityPermissionSourceAcceptanceMatchContexts(
    input.permission_state_source_set,
    input.permission_source_acceptance_criteria_set
  );

  const criteriaByKey = new Map(
    input.permission_source_acceptance_criteria_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.permission_state_source_set.candidate_assessments.map(
      (sourceAssessment) => {
        const criteriaAssessment = criteriaByKey.get(
          sourceAssessment.candidate_key
        );
        if (!criteriaAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Acceptance Criteria candidate ${sourceAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatch(
          sourceAssessment,
          criteriaAssessment
        );
      }
    );

  return {
    permission_state_source_set: input.permission_state_source_set,
    permission_source_acceptance_criteria_set:
      input.permission_source_acceptance_criteria_set,
    candidate_assessments,
    has_permission_source_acceptance_matches: candidate_assessments.some(
      (a) => a.has_permission_source_acceptance_matches
    ),
    has_listed_as_acceptable_permission_sources: candidate_assessments.some(
      (a) => a.has_listed_as_acceptable_permission_sources
    ),
    has_not_listed_as_acceptable_permission_sources: candidate_assessments.some(
      (a) => a.has_not_listed_as_acceptable_permission_sources
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
    ],
  };
}
