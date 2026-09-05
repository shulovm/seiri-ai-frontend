/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Acceptance Match core (GROUND-121).
 *
 * GROUND-117 AUTHORITY Source Bridge
 * + GROUND-120 Explicit AUTHORITY Source Acceptance Criterion
 * → exact AUTHORITY Source Acceptance Match only.
 *
 * Exact rule:
 *   criterion.accepted_canonical_authority_states.includes(
 *     source.canonical_authority_state_value
 *   )
 *     → LISTED_AS_ACCEPTABLE
 *     → otherwise NOT_LISTED_AS_ACCEPTABLE
 *
 * Must not import GROUND-118 / 119 / 084-direct / 116-core / ProjectState.
 *
 * LISTED_AS_ACCEPTABLE ≠ ACCEPTED ≠ PASS
 * NOT_LISTED_AS_ACCEPTABLE ≠ REJECTED ≠ FAIL
 * criterion absence ≠ NOT_LISTED
 * source absence ≠ NOT_LISTED
 * acceptance match ≠ resolution ≠ coverage ≠ aggregation ≠ OE
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion,
} from "./attention-observation-operational-eligibility-authority-source-acceptance-criteria-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySource,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-bridge-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchInput,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchModelLimitation,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchStatus,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchValue,
} from "./attention-observation-operational-eligibility-authority-source-acceptance-match-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED",
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

const CONTEXT_MISMATCH_PREFIX =
  "AUTHORITY Source Bridge set and AUTHORITY Source Acceptance Criteria set do not share the same observation Candidate context";

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-source-acceptance-match|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * authorityBindingKey|holderEntityId|authorityPower|governanceScopeKey|
 * evaluationInstantKey|authorityEvaluationAt|authoritySourceKey|
 * canonicalAuthorityStateKey|canonicalAuthorityStateBasisKey|
 * canonicalAuthorityStateValue|authoritySourceAcceptanceCriterionKey|matchValue
 */
export function attentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: string;
  governance_scope_key: string;
  authority_evaluation_instant_key: string;
  authority_evaluation_at: string;
  authority_source_key: string;
  canonical_authority_state_key: string;
  canonical_authority_state_basis_key: string;
  canonical_authority_state_value: string;
  authority_source_acceptance_criterion_key: string;
  match: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchValue;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-source-acceptance-match",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.authority_observation_context_binding_key,
    params.authority_holder_entity_id,
    params.authority_power,
    params.governance_scope_key,
    params.authority_evaluation_instant_key,
    params.authority_evaluation_at,
    params.authority_source_key,
    params.canonical_authority_state_key,
    params.canonical_authority_state_basis_key,
    params.canonical_authority_state_value,
    params.authority_source_acceptance_criterion_key,
    params.match,
  ].join("|");
}

/**
 * Exact enum-value membership only.
 * No polarity / resolution / wildcard / fallback inference.
 */
export function matchOperationalEligibilityAuthoritySourceAcceptance(
  accepted_canonical_authority_states: readonly string[],
  canonical_authority_state_value: string
): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchValue {
  return accepted_canonical_authority_states.includes(
    canonical_authority_state_value
  )
    ? "LISTED_AS_ACCEPTABLE"
    : "NOT_LISTED_AS_ACCEPTABLE";
}

function assertAuthoritySourceSelfConsistency(
  source: AttentionObservationOperationalEligibilityAuthoritySource,
  candidate_key: string
): void {
  if (source.dimension !== "AUTHORITY") {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: non-AUTHORITY source dimension ${source.dimension} for candidate ${candidate_key}`
    );
  }
  if (source.source_presence !== "SOURCE_PRESENT") {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: source_presence must be SOURCE_PRESENT for candidate ${candidate_key}`
    );
  }
  if (source.candidate_key !== candidate_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: source candidate_key mismatch for candidate ${candidate_key}`
    );
  }
  if (!source.authority_observation_context_binding_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing binding key for candidate ${candidate_key}`
    );
  }
  if (!source.authority_holder_entity_id) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing holder for candidate ${candidate_key}`
    );
  }
  if (!source.authority_power) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing authority_power for candidate ${candidate_key}`
    );
  }
  if (!source.governance_scope_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing governance_scope_key for candidate ${candidate_key}`
    );
  }
  if (!source.authority_evaluation_instant_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing evaluation instant key for candidate ${candidate_key}`
    );
  }
  if (!source.authority_evaluation_at) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing evaluation_at for candidate ${candidate_key}`
    );
  }
  if (!source.canonical_authority_state_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing canonical Authority State key for candidate ${candidate_key}`
    );
  }
  if (!source.canonical_authority_state_basis_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing canonical Authority State Basis key for candidate ${candidate_key}`
    );
  }
  if (!source.canonical_authority_state_value) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing canonical Authority State value for candidate ${candidate_key}`
    );
  }
  if (!source.key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing authority source key for candidate ${candidate_key}`
    );
  }
}

function assertCriterionSelfConsistency(
  criterion: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion,
  candidate_key: string
): void {
  if (criterion.dimension !== "AUTHORITY") {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: non-AUTHORITY criterion dimension ${criterion.dimension} for candidate ${candidate_key}`
    );
  }
  if (criterion.candidate_key !== candidate_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: criterion candidate_key mismatch for candidate ${candidate_key}`
    );
  }
  if (!criterion.observation_need_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing criterion observation_need_key for candidate ${candidate_key}`
    );
  }
  if (!criterion.capability_requirement_set_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing criterion capability_requirement_set_key for candidate ${candidate_key}`
    );
  }
  if (!criterion.operational_eligibility_dimension_policy_key) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: missing criterion OE policy key for candidate ${candidate_key}`
    );
  }
  const seen = new Set<string>();
  for (const state of criterion.accepted_canonical_authority_states) {
    if (seen.has(state)) {
      throw new Error(
        `AUTHORITY Source Acceptance Match invariant violated: duplicate accepted canonical Authority State ${state} in criterion for candidate ${candidate_key}`
      );
    }
    seen.add(state);
  }
}

function assertSourceCriterionContext(
  source: AttentionObservationOperationalEligibilityAuthoritySource,
  criterion: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion
): void {
  assertAuthoritySourceSelfConsistency(source, criterion.candidate_key);
  assertCriterionSelfConsistency(criterion, criterion.candidate_key);

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
}

function buildMatch(
  source: AttentionObservationOperationalEligibilityAuthoritySource,
  criterion: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion
): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch {
  assertSourceCriterionContext(source, criterion);
  const match = matchOperationalEligibilityAuthoritySourceAcceptance(
    criterion.accepted_canonical_authority_states,
    source.canonical_authority_state_value
  );
  return {
    key: attentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchKey(
      {
        candidate_key: source.candidate_key,
        observation_need_key: source.observation_need_key,
        capability_requirement_set_key: source.capability_requirement_set_key,
        authority_observation_context_binding_key:
          source.authority_observation_context_binding_key,
        authority_holder_entity_id: source.authority_holder_entity_id,
        authority_power: source.authority_power,
        governance_scope_key: source.governance_scope_key,
        authority_evaluation_instant_key: source.authority_evaluation_instant_key,
        authority_evaluation_at: source.authority_evaluation_at,
        authority_source_key: source.key,
        canonical_authority_state_key: source.canonical_authority_state_key,
        canonical_authority_state_basis_key:
          source.canonical_authority_state_basis_key,
        canonical_authority_state_value: source.canonical_authority_state_value,
        authority_source_acceptance_criterion_key: criterion.key,
        match,
      }
    ),
    candidate_key: source.candidate_key,
    observation_need_key: source.observation_need_key,
    capability_requirement_set_key: source.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key:
      source.authority_observation_context_binding_key,
    authority_holder_entity_id: source.authority_holder_entity_id,
    authority_power: source.authority_power,
    governance_scope: source.governance_scope,
    governance_scope_key: source.governance_scope_key,
    authority_evaluation_instant_key: source.authority_evaluation_instant_key,
    authority_evaluation_at: source.authority_evaluation_at,
    authority_source_key: source.key,
    canonical_authority_state_key: source.canonical_authority_state_key,
    canonical_authority_state_basis_key:
      source.canonical_authority_state_basis_key,
    canonical_authority_state_value: source.canonical_authority_state_value,
    authority_source_acceptance_criterion_key: criterion.key,
    match,
  };
}

function assertUniqueSourceKeys(
  sources: readonly AttentionObservationOperationalEligibilityAuthoritySource[],
  candidate_key: string
): void {
  const seen = new Set<string>();
  for (const source of sources) {
    if (seen.has(source.key)) {
      throw new Error(
        `AUTHORITY Source Acceptance Match invariant violated: duplicate authority source key ${source.key} for candidate ${candidate_key}`
      );
    }
    seen.add(source.key);
  }
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment
): void {
  const matches = assessment.authority_source_acceptance_matches;
  const expectedHasMatches = matches.length > 0;
  if (
    assessment.has_authority_source_acceptance_matches !== expectedHasMatches
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: has_matches mismatch for candidate ${assessment.candidate_key}`
    );
  }

  const expectedListed = matches.some(
    (m) => m.match === "LISTED_AS_ACCEPTABLE"
  );
  if (
    assessment.has_listed_as_acceptable_authority_sources !== expectedListed
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: has_listed mismatch for candidate ${assessment.candidate_key}`
    );
  }

  const expectedNotListed = matches.some(
    (m) => m.match === "NOT_LISTED_AS_ACCEPTABLE"
  );
  if (
    assessment.has_not_listed_as_acceptable_authority_sources !==
    expectedNotListed
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: has_not_listed mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT" &&
    matches.length === 0
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: MATCHES_PRESENT requires non-empty matches for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT" &&
    matches.length !== 0
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: non-present status requires empty matches for candidate ${assessment.candidate_key}`
    );
  }

  const matchSourceKeys = new Set<string>();
  for (const match of matches) {
    if (matchSourceKeys.has(match.authority_source_key)) {
      throw new Error(
        `AUTHORITY Source Acceptance Match invariant violated: duplicate match for source ${match.authority_source_key} for candidate ${assessment.candidate_key}`
      );
    }
    matchSourceKeys.add(match.authority_source_key);
  }
}

/**
 * Candidate/context counterpart invariant for 117 × 120 join.
 * Missing/extra counterparts reject — do not reinterpret as no-criterion/no-source.
 */
export function assertCompatibleOperationalEligibilityAuthoritySourceAcceptanceMatchContexts(
  bridgeSet: AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment,
  criteriaSet: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSetAssessment
): void {
  const bridgeCandidates = bridgeSet.candidate_assessments;
  const criteriaCandidates = criteriaSet.candidate_assessments;

  if (bridgeCandidates.length !== criteriaCandidates.length) {
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

  const bridgeByKey = new Map(
    bridgeCandidates.map((c) => [c.candidate_key, c])
  );
  if (bridgeByKey.size !== bridgeCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate AUTHORITY source bridge candidate keys`
    );
  }

  for (const bridgeCandidate of bridgeCandidates) {
    const criteriaCandidate = criteriaByKey.get(bridgeCandidate.candidate_key);
    if (!criteriaCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Acceptance Criteria candidate ${bridgeCandidate.candidate_key}`
      );
    }

    const criterion =
      criteriaCandidate.authority_source_acceptance_criterion;
    if (criterion !== null) {
      if (criterion.candidate_key !== bridgeCandidate.candidate_key) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: criterion Candidate mismatch for ${bridgeCandidate.candidate_key}`
        );
      }
      assertCriterionSelfConsistency(
        criterion,
        bridgeCandidate.candidate_key
      );
      for (const source of bridgeCandidate.authority_sources) {
        assertSourceCriterionContext(source, criterion);
      }
    } else {
      const policy =
        criteriaCandidate.operational_eligibility_dimension_policy_assessment
          .operational_eligibility_dimension_policy;
      if (policy !== null) {
        for (const source of bridgeCandidate.authority_sources) {
          if (source.observation_need_key !== policy.observation_need_key) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for candidate ${bridgeCandidate.candidate_key}`
            );
          }
          if (
            source.capability_requirement_set_key !==
            policy.capability_requirement_set_key
          ) {
            throw new Error(
              `${CONTEXT_MISMATCH_PREFIX}: Requirement-set key mismatch for candidate ${bridgeCandidate.candidate_key}`
            );
          }
        }
      }
    }

    assertUniqueSourceKeys(
      bridgeCandidate.authority_sources,
      bridgeCandidate.candidate_key
    );
  }

  for (const criteriaCandidate of criteriaCandidates) {
    if (!bridgeByKey.has(criteriaCandidate.candidate_key)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing AUTHORITY source bridge candidate ${criteriaCandidate.candidate_key}`
      );
    }
  }
}

/**
 * Pure Candidate-level AUTHORITY Source Acceptance Match.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY
 * 5. NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED
 * 6. NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 7. NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED
 * 8. AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatch(
  bridgeAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  criteriaAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment
): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment {
  const candidate_key = bridgeAssessment.candidate_key;

  if (candidate_key !== criteriaAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key} vs ${criteriaAssessment.candidate_key})`
    );
  }

  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchStatus,
    authority_source_acceptance_matches: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatch[]
  ): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatchAssessment =
      {
        candidate_key,
        authority_source_bridge_assessment: bridgeAssessment,
        authority_source_acceptance_criteria_assessment: criteriaAssessment,
        status,
        authority_source_acceptance_matches,
        has_authority_source_acceptance_matches:
          authority_source_acceptance_matches.length > 0,
        has_listed_as_acceptable_authority_sources:
          authority_source_acceptance_matches.some(
            (m) => m.match === "LISTED_AS_ACCEPTABLE"
          ),
        has_not_listed_as_acceptable_authority_sources:
          authority_source_acceptance_matches.some(
            (m) => m.match === "NOT_LISTED_AS_ACCEPTABLE"
          ),
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    criteriaAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    bridgeAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", []);
  }

  if (
    criteriaAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    bridgeAssessment.status ===
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
    "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
  ) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", []);
  }

  if (
    criteriaAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
      []
    );
  }

  if (
    criteriaAssessment.status !==
      "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT" ||
    criteriaAssessment.authority_source_acceptance_criterion === null
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: unexpected criteria status ${criteriaAssessment.status} for candidate ${candidate_key}`
    );
  }

  const criterion = criteriaAssessment.authority_source_acceptance_criterion;
  assertCriterionSelfConsistency(criterion, candidate_key);

  if (
    bridgeAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      []
    );
  }

  if (
    bridgeAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  ) {
    return wrap("NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED", []);
  }

  if (bridgeAssessment.status !== "AUTHORITY_SOURCES_PRESENT") {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: unexpected bridge status ${bridgeAssessment.status} for candidate ${candidate_key}`
    );
  }

  const sources = bridgeAssessment.authority_sources;
  if (sources.length === 0) {
    throw new Error(
      `AUTHORITY Source Acceptance Match invariant violated: SOURCES_PRESENT with empty sources for candidate ${candidate_key}`
    );
  }

  assertUniqueSourceKeys(sources, candidate_key);

  const authority_source_acceptance_matches = sources.map((source) =>
    buildMatch(source, criterion)
  );

  return wrap(
    "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT",
    authority_source_acceptance_matches
  );
}

export function buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSet(
  input: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchInput
): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSetAssessment {
  assertCompatibleOperationalEligibilityAuthoritySourceAcceptanceMatchContexts(
    input.authority_source_bridge_set,
    input.authority_source_acceptance_criteria_set
  );

  const criteriaByKey = new Map(
    input.authority_source_acceptance_criteria_set.candidate_assessments.map(
      (c) => [c.candidate_key, c]
    )
  );

  const candidate_assessments =
    input.authority_source_bridge_set.candidate_assessments.map(
      (bridgeAssessment) => {
        const criteriaAssessment = criteriaByKey.get(
          bridgeAssessment.candidate_key
        );
        if (!criteriaAssessment) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: missing Acceptance Criteria candidate ${bridgeAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatch(
          bridgeAssessment,
          criteriaAssessment
        );
      }
    );

  return {
    authority_source_bridge_set: input.authority_source_bridge_set,
    authority_source_acceptance_criteria_set:
      input.authority_source_acceptance_criteria_set,
    candidate_assessments,
    has_authority_source_acceptance_matches: candidate_assessments.some(
      (a) => a.has_authority_source_acceptance_matches
    ),
    has_listed_as_acceptable_authority_sources: candidate_assessments.some(
      (a) => a.has_listed_as_acceptable_authority_sources
    ),
    has_not_listed_as_acceptable_authority_sources: candidate_assessments.some(
      (a) => a.has_not_listed_as_acceptable_authority_sources
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
    ],
  };
}
