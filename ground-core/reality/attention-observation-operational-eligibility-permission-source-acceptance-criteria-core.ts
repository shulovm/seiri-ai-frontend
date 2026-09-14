/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Acceptance Criteria core (GROUND-096).
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit PERMISSION Source Acceptance Criteria Specification
 * → Explicit PERMISSION Source Acceptance Criterion only.
 *
 * Declarative. Does not inspect current 093 sources / 094 coverage / 095
 * resolution. Does not perform acceptance matching.
 *
 * Must not import GROUND-093 / 094 / 095 / 091-core / 024–090 / 085 /
 * ProjectState.
 *
 * criterion declaration ≠ current source
 * accepted value specification ≠ current accepted result
 * PERMISSION_PERMITTED is NOT implicitly accepted
 * PERMISSION_PROHIBITED / UNRESOLVED are NOT implicitly rejected
 * explicit empty criterion ≠ criterion absence ≠ policy absence
 * criterion absence ≠ accept-any ≠ reject-all
 * acceptance ≠ resolution ≠ aggregation ≠ OE outcome
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicy,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationPermissionState } from "./attention-observation-permission-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaInput,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaModelLimitation,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaStatus,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionInput,
} from "./attention-observation-operational-eligibility-permission-source-acceptance-criteria-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaModelLimitation[] =
  [
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

/**
 * Canonical Permission State vocabulary order for serialization only.
 * Not priority / quality / preference / severity.
 */
export const CANONICAL_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTED_STATE_ORDER: AttentionObservationPermissionState[] =
  [
    "PERMISSION_PERMITTED",
    "PERMISSION_PROHIBITED",
    "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY",
    "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
  ];

export const EMPTY_ACCEPTED_PERMISSION_STATE_SET =
  "EMPTY_ACCEPTED_PERMISSION_STATE_SET" as const;

const ACCEPTED_STATE_ORDER = new Map(
  CANONICAL_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTED_STATE_ORDER.map(
    (s, i) => [s, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function acceptedStateSetsEqual(
  a: readonly AttentionObservationPermissionState[],
  b: readonly AttentionObservationPermissionState[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Deduplicate + canonicalize accepted Permission States.
 * Input order has no semantics.
 */
export function canonicalizeAcceptedPermissionStates(
  states: readonly AttentionObservationPermissionState[]
): AttentionObservationPermissionState[] {
  const seen = new Set<AttentionObservationPermissionState>();
  for (const state of states) {
    if (!ACCEPTED_STATE_ORDER.has(state)) {
      throw new Error(
        `Unknown Permission State in acceptance criterion: ${String(state)}`
      );
    }
    seen.add(state);
  }
  return CANONICAL_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTED_STATE_ORDER.filter(
    (s) => seen.has(s)
  );
}

export function buildCanonicalAcceptedPermissionStateSetKey(
  acceptedStates: readonly AttentionObservationPermissionState[]
): string {
  if (acceptedStates.length === 0) {
    return EMPTY_ACCEPTED_PERMISSION_STATE_SET;
  }
  return canonicalizeAcceptedPermissionStates(acceptedStates).join(",");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-source-acceptance-criterion|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|PERMISSION|canonicalAcceptedPermissionStateSet
 */
export function attentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  accepted_permission_states: readonly AttentionObservationPermissionState[];
}): string {
  return [
    "attention-observation-operational-eligibility-permission-source-acceptance-criterion",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    "PERMISSION",
    buildCanonicalAcceptedPermissionStateSetKey(
      params.accepted_permission_states
    ),
  ].join("|");
}

function policyRequiresPermission(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy
): boolean {
  return policy.required_dimensions.includes("PERMISSION");
}

function collectPolicyAssessmentsByCandidateKey(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment
): Map<
  string,
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
> {
  const byCandidate = new Map<
    string,
    AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
  >();
  for (const assessment of policySet.candidate_assessments) {
    const existing = byCandidate.get(assessment.candidate_key) ?? [];
    existing.push(assessment);
    byCandidate.set(assessment.candidate_key, existing);
  }
  return byCandidate;
}

function resolveExactPolicyAssessment(
  byCandidate: Map<
    string,
    AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
  >,
  candidateKey: string
): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const matches = byCandidate.get(candidateKey);
  if (!matches || matches.length === 0) {
    throw new Error(
      `Permission Source Acceptance Criterion target Candidate ${candidateKey} not found in Operational Eligibility Dimension Policy set`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `Ambiguous Permission Source Acceptance Criterion target for Candidate ${candidateKey}: multiple Operational Eligibility Dimension Policy assessments`
    );
  }
  return matches[0]!;
}

/**
 * Validates and normalizes specification against exact GROUND-084 contexts.
 *
 * Exact duplicate (same context + same accepted set) → one.
 * Same context + different accepted sets → reject (no merge/union/intersection).
 * Unknown / ambiguous / policy-absent / PERMISSION-not-required targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
  specification: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification
): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification {
  const byCandidate = collectPolicyAssessmentsByCandidateKey(policySet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionInput
  >();

  for (const entry of specification.criteria) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const policyAssessment = resolveExactPolicyAssessment(
      byCandidate,
      entry.candidate_key
    );

    if (
      policyAssessment.status ===
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      policyAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    ) {
      throw new Error(
        `Permission Source Acceptance Criterion requires an applicable Operational Eligibility Dimension Policy context for candidate ${entry.candidate_key}`
      );
    }

    if (
      policyAssessment.status ===
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
      policyAssessment.operational_eligibility_dimension_policy === null
    ) {
      throw new Error(
        `Permission Source Acceptance Criterion requires an explicit Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const policy = policyAssessment.operational_eligibility_dimension_policy;
    if (!policyRequiresPermission(policy)) {
      throw new Error(
        `Permission Source Acceptance Criterion requires PERMISSION to be explicitly required by Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const accepted_permission_states = canonicalizeAcceptedPermissionStates(
      entry.accepted_permission_states
    );
    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (
        !acceptedStateSetsEqual(
          existing.accepted_permission_states,
          accepted_permission_states
        )
      ) {
        throw new Error(
          `Conflicting Permission Source Acceptance Criteria declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      accepted_permission_states,
    });
  }

  const criteria = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { criteria };
}

function buildCriterion(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy,
  accepted_permission_states: AttentionObservationPermissionState[]
): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion {
  return {
    key: attentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionKey(
      {
        candidate_key: policy.candidate_key,
        observation_need_key: policy.observation_need_key,
        capability_requirement_set_key: policy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key: policy.key,
        accepted_permission_states,
      }
    ),
    candidate_key: policy.candidate_key,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    dimension: "PERMISSION",
    operational_eligibility_dimension_policy_key: policy.key,
    accepted_permission_states,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment
): void {
  const expectedHas =
    assessment.permission_source_acceptance_criterion !== null;
  if (
    assessment.has_explicit_permission_source_acceptance_criterion !==
    expectedHas
  ) {
    throw new Error(
      `Permission Source Acceptance Criteria invariant violated: has_explicit mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT" &&
    assessment.permission_source_acceptance_criterion === null
  ) {
    throw new Error(
      `Permission Source Acceptance Criteria invariant violated: PRESENT requires non-null criterion for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT" &&
    assessment.permission_source_acceptance_criterion !== null
  ) {
    throw new Error(
      `Permission Source Acceptance Criteria invariant violated: non-present status requires null criterion for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteria(
  policyAssessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  normalizedSpecification: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification
): AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaStatus,
    criterion: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion | null
  ): AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment =
      {
        candidate_key: policyAssessment.candidate_key,
        operational_eligibility_dimension_policy_assessment: policyAssessment,
        status,
        permission_source_acceptance_criterion: criterion,
        has_explicit_permission_source_acceptance_criterion: criterion !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    policyAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    policyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    policyAssessment.status ===
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
    policyAssessment.operational_eligibility_dimension_policy === null
  ) {
    return wrap(
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      null
    );
  }

  const policy = policyAssessment.operational_eligibility_dimension_policy;

  if (!policyRequiresPermission(policy)) {
    return wrap("PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  const declared = normalizedSpecification.criteria.find(
    (c) => c.candidate_key === policyAssessment.candidate_key
  );

  if (!declared) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
      null
    );
  }

  return wrap(
    "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT",
    buildCriterion(policy, declared.accepted_permission_states)
  );
}

export function buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSet(
  input: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaInput
): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification(
      input.operational_eligibility_dimension_policy_set,
      input.specification
    );

  const candidate_assessments =
    input.operational_eligibility_dimension_policy_set.candidate_assessments.map(
      (policyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteria(
          policyAssessment,
          normalizedSpecification
        )
    );

  return {
    operational_eligibility_dimension_policy_set:
      input.operational_eligibility_dimension_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_permission_source_acceptance_criteria:
      candidate_assessments.some(
        (a) => a.has_explicit_permission_source_acceptance_criterion
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
    ],
  };
}
