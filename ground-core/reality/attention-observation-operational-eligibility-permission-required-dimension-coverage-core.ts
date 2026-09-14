/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Required Dimension Coverage (GROUND-094).
 *
 * Pure composition of:
 *   GROUND-084 Explicit Operational Eligibility Dimension Policy
 *   GROUND-093 Operational Eligibility PERMISSION State Source Bridge
 *
 * Answers only: if explicit policy requires PERMISSION, is at least one exact
 * GROUND-093 PERMISSION raw source represented?
 *
 * Must not import GROUND-091 / 024–090 / 085 / ProjectState.
 *
 * Forbidden: acceptance, resolution, aggregation, effective Permission,
 * Operational Eligibility State, can_execute, wall-clock.
 *
 * required ≠ represented
 * represented ≠ accepted ≠ resolved ≠ PERMISSION_PERMITTED
 * PERMISSION_PROHIBITED / UNRESOLVED sources still represent PERMISSION
 * NOT_REPRESENTED ≠ rejected ≠ prohibited
 * policy absence ≠ PERMISSION not required
 * PERMISSION not required ≠ NOT_REPRESENTED
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicy,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
  AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment,
} from "./attention-observation-operational-eligibility-permission-state-source-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverageAssessment,
  AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverage,
  AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageInput,
  AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageModelLimitation,
  AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSetAssessment,
  AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageStatus,
  AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageValue,
} from "./attention-observation-operational-eligibility-permission-required-dimension-coverage-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
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
  "Operational Eligibility Dimension Policy set and PERMISSION State Source set do not share the same observation Candidate context";

const EMPTY_PERMISSION_STATE_SOURCE_SET_KEY = "EMPTY_PERMISSION_STATE_SOURCE_SET";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildCanonicalPermissionStateSourceKeySetKey(
  sourceKeys: readonly string[]
): string {
  if (sourceKeys.length === 0) {
    return EMPTY_PERMISSION_STATE_SOURCE_SET_KEY;
  }
  return [...sourceKeys].sort(compareStrings).join(",");
}

export function attentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  operationalEligibilityDimensionPolicyKey: string,
  coverage: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageValue,
  canonicalPermissionStateSourceKeySet: string
): string {
  return [
    "attention-observation-operational-eligibility-permission-required-dimension-coverage",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    operationalEligibilityDimensionPolicyKey,
    "PERMISSION",
    coverage,
    canonicalPermissionStateSourceKeySet,
  ].join("|");
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverageAssessment
): void {
  const expectedHasCoverage =
    assessment.permission_required_dimension_coverage !== null;
  if (
    assessment.has_permission_required_dimension_coverage !==
    expectedHasCoverage
  ) {
    throw new Error(
      `Operational Eligibility Permission Required Dimension Coverage invariant violated: has_permission_required_dimension_coverage mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "REQUIRED_PERMISSION_DIMENSION_COVERAGE_PRESENT" &&
    assessment.permission_required_dimension_coverage === null
  ) {
    throw new Error(
      `Operational Eligibility Permission Required Dimension Coverage invariant violated: COVERAGE_PRESENT requires non-null coverage for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "REQUIRED_PERMISSION_DIMENSION_COVERAGE_PRESENT" &&
    assessment.permission_required_dimension_coverage !== null
  ) {
    throw new Error(
      `Operational Eligibility Permission Required Dimension Coverage invariant violated: non-present status requires null coverage for candidate ${assessment.candidate_key}`
    );
  }

  if (assessment.permission_required_dimension_coverage !== null) {
    const coverage = assessment.permission_required_dimension_coverage;
    if (
      coverage.coverage === "REPRESENTED" &&
      coverage.permission_state_source_keys.length === 0
    ) {
      throw new Error(
        `Operational Eligibility Permission Required Dimension Coverage invariant violated: REPRESENTED requires non-empty source keys for candidate ${assessment.candidate_key}`
      );
    }
    if (
      coverage.coverage === "NOT_REPRESENTED" &&
      coverage.permission_state_source_keys.length !== 0
    ) {
      throw new Error(
        `Operational Eligibility Permission Required Dimension Coverage invariant violated: NOT_REPRESENTED requires empty source keys for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function policyRequiresPermission(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy
): boolean {
  return policy.required_dimensions.includes("PERMISSION");
}

function collectCanonicalSourceKeys(
  sources: readonly AttentionObservationOperationalEligibilityPermissionStateSourceBridge[],
  expectedCandidateKey: string,
  expectedObservationNeedKey: string,
  expectedRequirementSetKey: string
): string[] {
  const keys: string[] = [];
  for (const source of sources) {
    if (source.dimension !== "PERMISSION") {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: non-PERMISSION source dimension ${source.dimension} for candidate ${expectedCandidateKey}`
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
    keys.push(source.key);
  }
  return [...keys].sort(compareStrings);
}

function buildCoverage(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy,
  sourceKeys: string[],
  coverage: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageValue
): AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverage {
  const canonicalSourceSetKey =
    buildCanonicalPermissionStateSourceKeySetKey(sourceKeys);

  return {
    key: attentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageKey(
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
    dimension: "PERMISSION",
    operational_eligibility_dimension_policy_key: policy.key,
    coverage,
    permission_state_source_keys: sourceKeys,
  };
}

/**
 * Pure Candidate-level Required PERMISSION Dimension Coverage.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY
 * 5. REQUIRED_PERMISSION_DIMENSION_COVERAGE_PRESENT
 *    (coverage REPRESENTED or NOT_REPRESENTED)
 *
 * Does not interpret raw Permission State polarity.
 * Does not consume GROUND-091 or GROUND-085.
 */
export function assessAttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverage(
  policyAssessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  sourceAssessment: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment
): AttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverageAssessment {
  const candidate_key = policyAssessment.candidate_key;

  if (candidate_key !== sourceAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key} vs ${sourceAssessment.candidate_key})`
    );
  }

  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageStatus,
    permission_required_dimension_coverage: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverage | null
  ): AttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverageAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverageAssessment =
      {
        candidate_key,
        operational_eligibility_dimension_policy_assessment: policyAssessment,
        permission_state_source_assessment: sourceAssessment,
        status,
        permission_required_dimension_coverage,
        has_permission_required_dimension_coverage:
          permission_required_dimension_coverage !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
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

  if (!policyRequiresPermission(policy)) {
    return wrap("PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  // PERMISSION required — coverage depends only on whether 093 has sources.
  const sources = sourceAssessment.permission_state_sources;
  if (sources.length > 0) {
    const sourceKeys = collectCanonicalSourceKeys(
      sources,
      policy.candidate_key,
      policy.observation_need_key,
      policy.capability_requirement_set_key
    );
    return wrap(
      "REQUIRED_PERMISSION_DIMENSION_COVERAGE_PRESENT",
      buildCoverage(policy, sourceKeys, "REPRESENTED")
    );
  }

  // Zero sources: NOT_REPRESENTED (covers no-binding / no-instant / empty PRESENT).
  if (
    sourceAssessment.status ===
      "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT" &&
    sources.length === 0
  ) {
    throw new Error(
      `Operational Eligibility Permission State Source invariant violated: SOURCES_PRESENT with empty sources for candidate ${candidate_key}`
    );
  }

  return wrap(
    "REQUIRED_PERMISSION_DIMENSION_COVERAGE_PRESENT",
    buildCoverage(policy, [], "NOT_REPRESENTED")
  );
}

export function assertCompatibleOperationalEligibilityPermissionRequiredDimensionCoverageContexts(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
  sourceSet: AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment
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
      `${CONTEXT_MISMATCH_PREFIX}: duplicate Permission source candidate keys`
    );
  }

  for (const policyCandidate of policyCandidates) {
    const sourceCandidate = sourceByKey.get(policyCandidate.candidate_key);
    if (!sourceCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Permission source candidate ${policyCandidate.candidate_key}`
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
        // Allow Requirements N/A on source side; reject domain-present source.
        if (
          sourceCandidate.status ===
            "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT" ||
          sourceCandidate.status ===
            "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
          sourceCandidate.status ===
            "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
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
        sourceCandidate.status ===
          "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT" ||
        sourceCandidate.status ===
          "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
        sourceCandidate.status ===
          "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
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
          `${CONTEXT_MISMATCH_PREFIX}: policy-domain / Permission-source-domain mismatch for candidate ${policyCandidate.candidate_key}`
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
        `${CONTEXT_MISMATCH_PREFIX}: extra Permission source candidate ${sourceCandidate.candidate_key}`
      );
    }
  }
}

function hasAnyCoverageRecord(
  assessments: AttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverageAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_permission_required_dimension_coverage) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Required PERMISSION Dimension Coverage.
 * Does not emit acceptance / aggregation / Operational Eligibility State.
 */
export function buildAttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSet(
  input: AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageInput
): AttentionObservationOperationalEligibilityPermissionRequiredDimensionCoverageSetAssessment {
  const policySet = input.operational_eligibility_dimension_policy_set;
  const sourceSet = input.permission_state_source_set;

  assertCompatibleOperationalEligibilityPermissionRequiredDimensionCoverageContexts(
    policySet,
    sourceSet
  );

  const sourceByKey = new Map(
    sourceSet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  const candidate_assessments = policySet.candidate_assessments.map(
    (policyCandidate) => {
      const sourceCandidate = sourceByKey.get(policyCandidate.candidate_key)!;
      return assessAttentionCandidateObservationOperationalEligibilityPermissionRequiredDimensionCoverage(
        policyCandidate,
        sourceCandidate
      );
    }
  );

  return {
    operational_eligibility_dimension_policy_set: policySet,
    permission_state_source_set: sourceSet,
    candidate_assessments,
    has_permission_required_dimension_coverages:
      hasAnyCoverageRecord(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
    ],
  };
}
