/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Required Dimension Coverage (GROUND-118).
 *
 * Pure composition of:
 *   GROUND-084 Explicit Operational Eligibility Dimension Policy
 *   GROUND-117 Operational Eligibility AUTHORITY Source Bridge
 *
 * Answers only: if explicit policy requires AUTHORITY, is at least one exact
 * GROUND-117 AUTHORITY raw source represented?
 *
 * Must not import GROUND-116 / 115–108 / ProjectState / GROUND-093–095.
 *
 * Forbidden: acceptance, resolution, aggregation, effective Authority,
 * Operational Eligibility State, can_execute, wall-clock.
 *
 * required ≠ represented
 * represented ≠ accepted ≠ resolved ≠ Authority positive
 * negative/unresolved AUTHORITY sources still represent AUTHORITY
 * NOT_REPRESENTED ≠ rejected ≠ Authority negative
 * policy absence ≠ AUTHORITY not required
 * AUTHORITY not required ≠ NOT_REPRESENTED
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicy,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySource,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-bridge-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverageAssessment,
  AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverage,
  AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageInput,
  AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageStatus,
  AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageValue,
} from "./attention-observation-operational-eligibility-authority-required-dimension-coverage-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
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
  "Operational Eligibility Dimension Policy set and AUTHORITY Source Bridge set do not share the same observation Candidate context";

export const EMPTY_AUTHORITY_SOURCE_SET_KEY = "EMPTY_AUTHORITY_SOURCE_SET";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildCanonicalAuthoritySourceKeySetKey(
  sourceKeys: readonly string[]
): string {
  if (sourceKeys.length === 0) {
    return EMPTY_AUTHORITY_SOURCE_SET_KEY;
  }
  return [...sourceKeys].sort(compareStrings).join(",");
}

export function attentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  operationalEligibilityDimensionPolicyKey: string,
  coverage: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageValue,
  canonicalAuthoritySourceKeySet: string
): string {
  return [
    "attention-observation-operational-eligibility-authority-required-dimension-coverage",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    "AUTHORITY",
    operationalEligibilityDimensionPolicyKey,
    coverage,
    canonicalAuthoritySourceKeySet,
  ].join("|");
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverageAssessment
): void {
  const expectedHasCoverage =
    assessment.authority_required_dimension_coverage !== null;
  if (
    assessment.has_authority_required_dimension_coverage !== expectedHasCoverage
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Required Dimension Coverage invariant violated: has_authority_required_dimension_coverage mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "REQUIRED_AUTHORITY_DIMENSION_COVERAGE_PRESENT" &&
    assessment.authority_required_dimension_coverage === null
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Required Dimension Coverage invariant violated: COVERAGE_PRESENT requires non-null coverage for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "REQUIRED_AUTHORITY_DIMENSION_COVERAGE_PRESENT" &&
    assessment.authority_required_dimension_coverage !== null
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Required Dimension Coverage invariant violated: non-present status requires null coverage for candidate ${assessment.candidate_key}`
    );
  }

  if (assessment.authority_required_dimension_coverage !== null) {
    const coverage = assessment.authority_required_dimension_coverage;
    if (
      coverage.coverage === "REPRESENTED" &&
      coverage.authority_source_keys.length === 0
    ) {
      throw new Error(
        `Operational Eligibility AUTHORITY Required Dimension Coverage invariant violated: REPRESENTED requires non-empty source keys for candidate ${assessment.candidate_key}`
      );
    }
    if (
      coverage.coverage === "NOT_REPRESENTED" &&
      coverage.authority_source_keys.length !== 0
    ) {
      throw new Error(
        `Operational Eligibility AUTHORITY Required Dimension Coverage invariant violated: NOT_REPRESENTED requires empty source keys for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function policyRequiresAuthority(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy
): boolean {
  return policy.required_dimensions.includes("AUTHORITY");
}

function collectCanonicalSourceKeys(
  sources: readonly AttentionObservationOperationalEligibilityAuthoritySource[],
  expectedCandidateKey: string,
  expectedObservationNeedKey: string,
  expectedRequirementSetKey: string
): string[] {
  const keys: string[] = [];
  const seen = new Set<string>();

  for (const source of sources) {
    if (source.dimension !== "AUTHORITY") {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: non-AUTHORITY source dimension ${source.dimension} for candidate ${expectedCandidateKey}`
      );
    }
    if (source.candidate_key !== expectedCandidateKey) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: source candidate mismatch for ${expectedCandidateKey}`
      );
    }
    if (source.observation_need_key !== expectedObservationNeedKey) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for candidate ${expectedCandidateKey}`
      );
    }
    if (source.capability_requirement_set_key !== expectedRequirementSetKey) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: Requirement-set key mismatch for candidate ${expectedCandidateKey}`
      );
    }
    if (seen.has(source.key)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: duplicate AUTHORITY source key ${source.key} for candidate ${expectedCandidateKey}`
      );
    }
    seen.add(source.key);
    keys.push(source.key);
  }
  return [...keys].sort(compareStrings);
}

function buildCoverage(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy,
  sourceKeys: string[],
  coverage: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageValue
): AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverage {
  const canonicalSourceSetKey = buildCanonicalAuthoritySourceKeySetKey(sourceKeys);

  return {
    key: attentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageKey(
      policy.candidate_key,
      policy.observation_need_key,
      policy.capability_requirement_set_key,
      policy.key,
      coverage,
      canonicalSourceSetKey
    ),
    candidate_key: policy.candidate_key,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    dimension: "AUTHORITY",
    operational_eligibility_dimension_policy_key: policy.key,
    coverage,
    authority_source_keys: sourceKeys,
  };
}

/**
 * Pure Candidate-level Required AUTHORITY Dimension Coverage.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY
 * 5. REQUIRED_AUTHORITY_DIMENSION_COVERAGE_PRESENT
 *    (coverage REPRESENTED or NOT_REPRESENTED)
 *
 * Does not interpret canonical Authority State polarity or resolvedness.
 * Does not consume GROUND-116 or direct GROUND-084 policy construction.
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverage(
  policyAssessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  sourceAssessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment
): AttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverageAssessment {
  const candidate_key = policyAssessment.candidate_key;

  if (candidate_key !== sourceAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key} vs ${sourceAssessment.candidate_key})`
    );
  }

  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageStatus,
    authority_required_dimension_coverage: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverage | null
  ): AttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverageAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverageAssessment =
      {
        candidate_key,
        operational_eligibility_dimension_policy_assessment: policyAssessment,
        authority_source_bridge_assessment: sourceAssessment,
        status,
        authority_required_dimension_coverage,
        has_authority_required_dimension_coverage:
          authority_required_dimension_coverage !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    sourceAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    sourceAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    policyAssessment.status ===
    "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
  ) {
    if (policyAssessment.operational_eligibility_dimension_policy !== null) {
      throw new Error(
        `Operational Eligibility Dimension Policy invariant violated: NO_POLICY requires null policy for candidate ${candidate_key}`
      );
    }
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      null
    );
  }

  if (
    policyAssessment.status !==
      "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT" ||
    policyAssessment.operational_eligibility_dimension_policy === null
  ) {
    throw new Error(
      `Operational Eligibility Dimension Policy invariant violated: unexpected policy status ${policyAssessment.status} for candidate ${candidate_key}`
    );
  }

  const policy = policyAssessment.operational_eligibility_dimension_policy;

  if (!policyRequiresAuthority(policy)) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  const sources = sourceAssessment.authority_sources;
  if (sources.length > 0) {
    const sourceKeys = collectCanonicalSourceKeys(
      sources,
      policy.candidate_key,
      policy.observation_need_key,
      policy.capability_requirement_set_key
    );
    return wrap(
      "REQUIRED_AUTHORITY_DIMENSION_COVERAGE_PRESENT",
      buildCoverage(policy, sourceKeys, "REPRESENTED")
    );
  }

  if (
    sourceAssessment.status === "AUTHORITY_SOURCES_PRESENT" &&
    sources.length === 0
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: SOURCES_PRESENT with empty sources for candidate ${candidate_key}`
    );
  }

  return wrap(
    "REQUIRED_AUTHORITY_DIMENSION_COVERAGE_PRESENT",
    buildCoverage(policy, [], "NOT_REPRESENTED")
  );
}

export function assertCompatibleOperationalEligibilityAuthorityRequiredDimensionCoverageContexts(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
  sourceSet: AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment
): void {
  const policyCandidates = policySet.candidate_assessments;
  const sourceCandidates = sourceSet.candidate_assessments;

  if (policyCandidates.length !== sourceCandidates.length) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const sourceByKey = new Map(
    sourceCandidates.map((c) => [c.candidate_key, c])
  );

  if (sourceByKey.size !== sourceCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate AUTHORITY source candidate keys`
    );
  }

  for (const policyCandidate of policyCandidates) {
    const sourceCandidate = sourceByKey.get(policyCandidate.candidate_key);
    if (!sourceCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing AUTHORITY source candidate ${policyCandidate.candidate_key}`
      );
    }

    const policyPresent =
      policyCandidate.status ===
      "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
    const policyAbsent =
      policyCandidate.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED";

    if (
      policyCandidate.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    ) {
      if (
        sourceCandidate.status !==
          "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" &&
        sourceCandidate.status !==
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      ) {
        if (
          sourceCandidate.status === "AUTHORITY_SOURCES_PRESENT" ||
          sourceCandidate.status ===
            "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
          sourceCandidate.status ===
            "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: planning-basis mismatch for candidate ${policyCandidate.candidate_key}`
          );
        }
      }
      continue;
    }

    if (
      policyCandidate.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    ) {
      if (
        sourceCandidate.status === "AUTHORITY_SOURCES_PRESENT" ||
        sourceCandidate.status ===
          "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
        sourceCandidate.status ===
          "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: Requirements-domain mismatch for candidate ${policyCandidate.candidate_key}`
        );
      }
      continue;
    }

    if (policyAbsent || policyPresent) {
      if (
        sourceCandidate.status ===
          "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
        sourceCandidate.status ===
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: policy-domain / AUTHORITY-source-domain mismatch for candidate ${policyCandidate.candidate_key}`
        );
      }
    }
  }

  for (const sourceCandidate of sourceCandidates) {
    if (
      !policyCandidates.some(
        (p) => p.candidate_key === sourceCandidate.candidate_key
      )
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: extra AUTHORITY source candidate ${sourceCandidate.candidate_key}`
      );
    }
  }
}

function hasAnyCoverageRecord(
  assessments: AttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverageAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_authority_required_dimension_coverage) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Required AUTHORITY Dimension Coverage.
 * Does not emit acceptance / aggregation / Operational Eligibility State.
 */
export function buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet(
  input: AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageInput
): AttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSetAssessment {
  const policySet = input.operational_eligibility_dimension_policy_set;
  const sourceSet = input.authority_source_bridge_set;

  assertCompatibleOperationalEligibilityAuthorityRequiredDimensionCoverageContexts(
    policySet,
    sourceSet
  );

  const sourceByKey = new Map(
    sourceSet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  const candidate_assessments = policySet.candidate_assessments.map(
    (policyCandidate) => {
      const sourceCandidate = sourceByKey.get(policyCandidate.candidate_key)!;
      return assessAttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverage(
        policyCandidate,
        sourceCandidate
      );
    }
  );

  return {
    operational_eligibility_dimension_policy_set: policySet,
    authority_source_bridge_set: sourceSet,
    candidate_assessments,
    has_authority_required_dimension_coverages:
      hasAnyCoverageRecord(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
    ],
  };
}
