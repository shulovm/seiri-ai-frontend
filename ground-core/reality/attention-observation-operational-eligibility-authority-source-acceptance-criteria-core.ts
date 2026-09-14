/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Acceptance Criteria core (GROUND-120).
 *
 * GROUND-084 Explicit Operational Eligibility Dimension Policy
 * + explicit AUTHORITY Source Acceptance Criteria Specification
 * → Explicit AUTHORITY Source Acceptance Criterion only.
 *
 * Declarative. Does not inspect current 117 sources / 118 coverage / 119
 * resolution. Does not perform acceptance matching.
 *
 * Must not import GROUND-117 / 118 / 119 / 116-core / 108–115 / ProjectState.
 *
 * criterion declaration ≠ current source
 * POSITIVE is NOT implicitly accepted
 * NEGATIVE / UNRESOLVED are NOT implicitly rejected
 * explicit empty criterion ≠ criterion absence ≠ policy absence
 * criterion absence ≠ accept-any ≠ reject-all
 * acceptance ≠ resolution ≠ aggregation ≠ OE outcome
 */

import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicy,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue } from "./attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaEvalInput,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaModelLimitation,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionStatus,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionInput,
} from "./attention-observation-operational-eligibility-authority-source-acceptance-criteria-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaModelLimitation[] =
  [
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

/**
 * Canonical Authority State vocabulary order for serialization only.
 * Not priority / quality / preference / severity.
 */
export const CANONICAL_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTED_STATE_ORDER: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[] =
  [
    "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE",
    "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE",
    "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY",
    "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
  ];

export const EMPTY_ACCEPTED_CANONICAL_AUTHORITY_STATE_SET =
  "EMPTY_ACCEPTED_CANONICAL_AUTHORITY_STATE_SET" as const;

const ACCEPTED_STATE_ORDER = new Map(
  CANONICAL_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTED_STATE_ORDER.map(
    (s, i) => [s, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function acceptedStateSetsEqual(
  a: readonly AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[],
  b: readonly AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[]
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
 * Deduplicate + canonicalize accepted canonical Authority States.
 * Input order has no semantics.
 */
export function canonicalizeAcceptedCanonicalAuthorityStates(
  states: readonly AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[]
): AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[] {
  const seen =
    new Set<AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue>();
  for (const state of states) {
    if (!ACCEPTED_STATE_ORDER.has(state)) {
      throw new Error(
        `Unknown canonical Authority State in acceptance criterion: ${String(state)}`
      );
    }
    seen.add(state);
  }
  return CANONICAL_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTED_STATE_ORDER.filter(
    (s) => seen.has(s)
  );
}

export function buildCanonicalAcceptedCanonicalAuthorityStateSetKey(
  acceptedStates: readonly AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[]
): string {
  if (acceptedStates.length === 0) {
    return EMPTY_ACCEPTED_CANONICAL_AUTHORITY_STATE_SET;
  }
  return canonicalizeAcceptedCanonicalAuthorityStates(acceptedStates).join(",");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-source-acceptance-criterion|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * operationalEligibilityDimensionPolicyKey|AUTHORITY|canonicalAcceptedCanonicalAuthorityStateSet
 */
export function attentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  operational_eligibility_dimension_policy_key: string;
  accepted_canonical_authority_states: readonly AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[];
}): string {
  return [
    "attention-observation-operational-eligibility-authority-source-acceptance-criterion",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    params.operational_eligibility_dimension_policy_key,
    "AUTHORITY",
    buildCanonicalAcceptedCanonicalAuthorityStateSetKey(
      params.accepted_canonical_authority_states
    ),
  ].join("|");
}

function policyRequiresAuthority(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy
): boolean {
  return policy.required_dimensions.includes("AUTHORITY");
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
      `AUTHORITY Source Acceptance Criterion target Candidate ${candidateKey} not found in Operational Eligibility Dimension Policy set`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `Ambiguous AUTHORITY Source Acceptance Criterion target for Candidate ${candidateKey}: multiple Operational Eligibility Dimension Policy assessments`
    );
  }
  return matches[0]!;
}

/**
 * Validates and normalizes specification against exact GROUND-084 contexts.
 *
 * Exact duplicate (same context + same accepted set) → one.
 * Same context + different accepted sets → reject (no merge/union/intersection).
 * Unknown / ambiguous / policy-absent / AUTHORITY-not-required targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification(
  policySet: AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
  specification: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification
): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification {
  const byCandidate = collectPolicyAssessmentsByCandidateKey(policySet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionInput
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
        `AUTHORITY Source Acceptance Criterion requires an applicable Operational Eligibility Dimension Policy context for candidate ${entry.candidate_key}`
      );
    }

    if (
      policyAssessment.status ===
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" ||
      policyAssessment.operational_eligibility_dimension_policy === null
    ) {
      throw new Error(
        `AUTHORITY Source Acceptance Criterion requires an explicit Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const policy = policyAssessment.operational_eligibility_dimension_policy;
    if (!policyRequiresAuthority(policy)) {
      throw new Error(
        `AUTHORITY Source Acceptance Criterion requires AUTHORITY to be explicitly required by Operational Eligibility Dimension Policy for candidate ${entry.candidate_key}`
      );
    }

    const accepted_canonical_authority_states =
      canonicalizeAcceptedCanonicalAuthorityStates(
        entry.accepted_canonical_authority_states
      );
    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (
        !acceptedStateSetsEqual(
          existing.accepted_canonical_authority_states,
          accepted_canonical_authority_states
        )
      ) {
        throw new Error(
          `Conflicting AUTHORITY Source Acceptance Criteria declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      accepted_canonical_authority_states,
    });
  }

  const criteria = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { criteria };
}

function buildCriterion(
  policy: AttentionObservationOperationalEligibilityDimensionPolicy,
  accepted_canonical_authority_states: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[]
): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion {
  return {
    key: attentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionKey(
      {
        candidate_key: policy.candidate_key,
        observation_need_key: policy.observation_need_key,
        capability_requirement_set_key: policy.capability_requirement_set_key,
        operational_eligibility_dimension_policy_key: policy.key,
        accepted_canonical_authority_states,
      }
    ),
    candidate_key: policy.candidate_key,
    observation_need_key: policy.observation_need_key,
    capability_requirement_set_key: policy.capability_requirement_set_key,
    dimension: "AUTHORITY",
    operational_eligibility_dimension_policy_key: policy.key,
    accepted_canonical_authority_states,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment
): void {
  const expectedHas = assessment.authority_source_acceptance_criterion !== null;
  if (
    assessment.has_explicit_authority_source_acceptance_criterion !==
    expectedHas
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Criteria invariant violated: has_explicit mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT" &&
    assessment.authority_source_acceptance_criterion === null
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Criteria invariant violated: PRESENT requires non-null criterion for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT" &&
    assessment.authority_source_acceptance_criterion !== null
  ) {
    throw new Error(
      `AUTHORITY Source Acceptance Criteria invariant violated: non-present status requires null criterion for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteria(
  policyAssessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  normalizedSpecification: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification
): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment {
  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionStatus,
    criterion: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion | null
  ): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment =
      {
        candidate_key: policyAssessment.candidate_key,
        operational_eligibility_dimension_policy_assessment: policyAssessment,
        status,
        authority_source_acceptance_criterion: criterion,
        has_explicit_authority_source_acceptance_criterion: criterion !== null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
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

  if (!policyRequiresAuthority(policy)) {
    return wrap("AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY", null);
  }

  const declared = normalizedSpecification.criteria.find(
    (c) => c.candidate_key === policyAssessment.candidate_key
  );

  if (!declared) {
    return wrap(
      "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
      null
    );
  }

  return wrap(
    "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT",
    buildCriterion(policy, declared.accepted_canonical_authority_states)
  );
}

export function buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSet(
  input: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaEvalInput
): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification(
      input.operational_eligibility_dimension_policy_set,
      input.specification
    );

  const candidate_assessments =
    input.operational_eligibility_dimension_policy_set.candidate_assessments.map(
      (policyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteria(
          policyAssessment,
          normalizedSpecification
        )
    );

  return {
    operational_eligibility_dimension_policy_set:
      input.operational_eligibility_dimension_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_authority_source_acceptance_criteria: candidate_assessments.some(
      (a) => a.has_explicit_authority_source_acceptance_criterion
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
    ],
  };
}
