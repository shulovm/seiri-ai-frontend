/**
 * Reality Core v0.7 — Attention Observation Capability Dimension Source
 * Aggregation Outcome (GROUND-066).
 *
 * Pure composition of GROUND-064 Source Acceptance Match
 * + GROUND-065 Explicit Source Aggregation Policy.
 *
 * Must not import GROUND-050–063 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * HOLDS / DOES_NOT_HOLD ≠ PASS / FAIL ≠ Requirement Satisfaction
 * ALL(empty) and ANY(empty) are never evaluated
 */

import type {
  AttentionObservationCapabilityDimensionSourceAggregationPolicyKind,
} from "./attention-observation-capability-dimension-source-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment,
  AttentionObservationCapabilityDimensionSourceAggregationPolicySetAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment,
  AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment,
} from "./attention-observation-capability-dimension-source-aggregation-policy-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment,
  AttentionObservationCapabilitySourceAcceptanceMatchBasis,
  AttentionObservationCapabilitySourceAcceptanceMatchSetAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment,
  AttentionObservationCapabilityRequirementSourceAcceptanceAssessment,
  AttentionObservationCapabilitySourceAcceptanceRelation,
} from "./attention-observation-capability-source-acceptance-match-types.js";
import type {
  AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment,
  AttentionObservationCapabilityDimensionSourceAggregationOutcome,
  AttentionObservationCapabilityDimensionSourceAggregationOutcomeBasis,
  AttentionObservationCapabilityDimensionSourceAggregationOutcomeCandidateStatus,
  AttentionObservationCapabilityDimensionSourceAggregationOutcomeInput,
  AttentionObservationCapabilityDimensionSourceAggregationOutcomeModelLimitation,
  AttentionObservationCapabilityDimensionSourceAggregationOutcomeSetAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationStatus,
  AttentionObservationCapabilityRequirementDimensionAggregationAssessment,
} from "./attention-observation-capability-dimension-source-aggregation-outcome-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_MODEL_LIMITATIONS: AttentionObservationCapabilityDimensionSourceAggregationOutcomeModelLimitation[] =
  [
    "CAPABILITY_ZERO_SOURCE_AGGREGATION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_DIMENSION_FINAL_OUTCOME_NOT_MODELED",
    "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "CAPABILITY_MISSING_CRITERION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_MISSING_SOURCE_AGGREGATION_POLICY_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AGGREGATION_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_SOURCE_MAJORITY_AGGREGATION_NOT_MODELED",
    "CAPABILITY_SOURCE_VETO_AGGREGATION_NOT_MODELED",
    "CAPABILITY_SOURCE_THRESHOLD_AGGREGATION_NOT_MODELED",
    "CAPABILITY_SOURCE_WEIGHTED_AGGREGATION_NOT_MODELED",
    "CAPABILITY_SOURCE_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_SOURCE_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_SOURCE_RECENCY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CANONICAL_EVALUATION_DIMENSION_ORDER: AttentionObservationCapabilityEvaluationDimension[] =
  [
    "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
    "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
    "CAPABILITY_SCOPE_APPLICABILITY",
    "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
    "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
    "CAPABILITY_VERIFICATION_REPRESENTATION",
    "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
    "CAPABILITY_AVAILABILITY_REPRESENTATION",
    "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
  ];

const DIMENSION_ORDER = new Map(
  CANONICAL_EVALUATION_DIMENSION_ORDER.map((d, i) => [d, i])
);

const LISTED_RELATION: AttentionObservationCapabilitySourceAcceptanceRelation =
  "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE";

const NOT_LISTED_RELATION: AttentionObservationCapabilitySourceAcceptanceRelation =
  "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function buildCanonicalSourceAcceptanceMatchSetKey(
  sourceAcceptanceMatchBasisKeys: readonly string[]
): string {
  const unique = [...new Set(sourceAcceptanceMatchBasisKeys)];
  if (unique.length !== sourceAcceptanceMatchBasisKeys.length) {
    throw new Error(
      "Duplicate source acceptance match basis keys in aggregation source set"
    );
  }
  return unique.sort(compareStrings).join(",");
}

export function attentionObservationCapabilityDimensionSourceAggregationOutcomeKey(
  capabilityRequirementKey: string,
  dimension: AttentionObservationCapabilityEvaluationDimension,
  acceptanceCriterionKey: string,
  sourceAggregationPolicyKey: string,
  canonicalSourceMatchSetKey: string
): string {
  return [
    "attention-observation-capability-dimension-source-aggregation-outcome",
    capabilityRequirementKey,
    dimension,
    acceptanceCriterionKey,
    sourceAggregationPolicyKey,
    canonicalSourceMatchSetKey,
  ].join("|");
}

function assertSourceAcceptanceMatchBasisInvariant(
  assessment: AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment
): void {
  if (
    assessment.status ===
      "CAPABILITY_SOURCE_ACCEPTANCE_MATCH_BASIS_PRESENT" &&
    assessment.source_acceptance_match_bases.length < 1
  ) {
    throw new Error(
      `Source acceptance match invariant violated: PRESENT requires at least one source match basis for dimension ${assessment.required_dimension}`
    );
  }
  if (
    assessment.status ===
      "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED" &&
    assessment.source_acceptance_match_bases.length !== 0
  ) {
    throw new Error(
      `Source acceptance match invariant violated: NOT_REPRESENTED requires empty source match bases for dimension ${assessment.required_dimension}`
    );
  }
  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION" &&
    assessment.source_acceptance_match_bases.length !== 0
  ) {
    throw new Error(
      `Source acceptance match invariant violated: criterion absent requires empty source match bases for dimension ${assessment.required_dimension}`
    );
  }
}

function assertSourceAggregationPolicyInvariant(
  assessment: AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_PRESENT" &&
    assessment.source_aggregation_policy === null
  ) {
    throw new Error(
      `Source aggregation policy invariant violated: PRESENT requires non-null policy for dimension ${assessment.required_dimension}`
    );
  }
  if (
    assessment.status ===
      "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_DECLARED" &&
    assessment.source_aggregation_policy !== null
  ) {
    throw new Error(
      `Source aggregation policy invariant violated: absent requires null policy for dimension ${assessment.required_dimension}`
    );
  }
}

function validateSourceMatchRelations(
  bases: readonly AttentionObservationCapabilitySourceAcceptanceMatchBasis[]
): void {
  for (const basis of bases) {
    if (
      basis.relation !== LISTED_RELATION &&
      basis.relation !== NOT_LISTED_RELATION
    ) {
      throw new Error(
        `Invalid source acceptance match relation for basis ${basis.key}: ${basis.relation}`
      );
    }
  }
}

function validateNonEmptySourceMatchSet(
  bases: readonly AttentionObservationCapabilitySourceAcceptanceMatchBasis[]
): void {
  if (bases.length === 0) {
    throw new Error(
      "Cannot evaluate source aggregation policy over empty source match set"
    );
  }
}

function validateCriterionKeyConsistency(
  bases: readonly AttentionObservationCapabilitySourceAcceptanceMatchBasis[],
  expectedCriterionKey: string,
  dimension: AttentionObservationCapabilityEvaluationDimension
): void {
  for (const basis of bases) {
    if (basis.acceptance_criterion_key !== expectedCriterionKey) {
      throw new Error(
        `Acceptance criterion key mismatch for dimension ${dimension}: expected ${expectedCriterionKey}, found ${basis.acceptance_criterion_key}`
      );
    }
    if (basis.required_dimension !== dimension) {
      throw new Error(
        `Required dimension mismatch in source acceptance match basis ${basis.key}`
      );
    }
  }
}

/**
 * Evaluates explicit ANY/ALL over a NON-EMPTY exact source match set.
 * Must never be called with an empty array (vacuous ALL/ANY forbidden).
 */
export function evaluateSourceAggregationPolicyCondition(
  sourceMatchBases: readonly AttentionObservationCapabilitySourceAcceptanceMatchBasis[],
  aggregationKind: AttentionObservationCapabilityDimensionSourceAggregationPolicyKind
): AttentionObservationCapabilityDimensionSourceAggregationOutcome {
  validateNonEmptySourceMatchSet(sourceMatchBases);
  validateSourceMatchRelations(sourceMatchBases);

  const keys = sourceMatchBases.map((b) => b.key);
  if (new Set(keys).size !== keys.length) {
    throw new Error(
      "Duplicate source acceptance match basis keys in aggregation evaluation"
    );
  }

  switch (aggregationKind) {
    case "ANY_SOURCE_LISTED_AS_ACCEPTABLE": {
      const holds = sourceMatchBases.some(
        (basis) => basis.relation === LISTED_RELATION
      );
      return holds
        ? "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
        : "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD";
    }
    case "ALL_SOURCES_LISTED_AS_ACCEPTABLE": {
      const holds = sourceMatchBases.every(
        (basis) => basis.relation === LISTED_RELATION
      );
      return holds
        ? "SOURCE_AGGREGATION_POLICY_CONDITION_HOLDS"
        : "SOURCE_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD";
    }
  }
}

function buildSourceAggregationOutcomeBasis(
  sourceAcceptanceAssessment: AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment,
  policy: NonNullable<
    AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment["source_aggregation_policy"]
  >,
  outcome: AttentionObservationCapabilityDimensionSourceAggregationOutcome
): AttentionObservationCapabilityDimensionSourceAggregationOutcomeBasis {
  const source_acceptance_match_basis_keys = sourceAcceptanceAssessment
    .source_acceptance_match_bases.map((b) => b.key)
    .sort(compareStrings);
  const canonicalSourceMatchSetKey = buildCanonicalSourceAcceptanceMatchSetKey(
    source_acceptance_match_basis_keys
  );

  return {
    key: attentionObservationCapabilityDimensionSourceAggregationOutcomeKey(
      policy.capability_requirement_key,
      policy.dimension,
      policy.acceptance_criterion_key,
      policy.key,
      canonicalSourceMatchSetKey
    ),
    capability_requirement_key: policy.capability_requirement_key,
    observation_need_key: policy.observation_need_key,
    required_dimension: policy.dimension,
    acceptance_criterion_key: policy.acceptance_criterion_key,
    source_aggregation_policy_key: policy.key,
    aggregation_kind: policy.aggregation_kind,
    source_acceptance_match_basis_keys,
    outcome,
  };
}

function assessRequiredDimensionSourceAggregation(
  sourceAcceptanceAssessment: AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment,
  policyAssessment: AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment
): AttentionObservationCapabilityRequiredDimensionSourceAggregationAssessment {
  assertSourceAcceptanceMatchBasisInvariant(sourceAcceptanceAssessment);
  assertSourceAggregationPolicyInvariant(policyAssessment);

  if (
    sourceAcceptanceAssessment.status ===
    "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
  ) {
    return {
      required_dimension: sourceAcceptanceAssessment.required_dimension,
      source_acceptance_assessment: sourceAcceptanceAssessment,
      source_aggregation_policy_assessment: policyAssessment,
      status:
        "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED",
      source_aggregation_outcome_basis: null,
    };
  }

  if (
    sourceAcceptanceAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
  ) {
    return {
      required_dimension: sourceAcceptanceAssessment.required_dimension,
      source_acceptance_assessment: sourceAcceptanceAssessment,
      source_aggregation_policy_assessment: policyAssessment,
      status:
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION",
      source_aggregation_outcome_basis: null,
    };
  }

  if (
    policyAssessment.status ===
    "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_DECLARED"
  ) {
    return {
      required_dimension: sourceAcceptanceAssessment.required_dimension,
      source_acceptance_assessment: sourceAcceptanceAssessment,
      source_aggregation_policy_assessment: policyAssessment,
      status:
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY",
      source_aggregation_outcome_basis: null,
    };
  }

  if (
    policyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION"
  ) {
    return {
      required_dimension: sourceAcceptanceAssessment.required_dimension,
      source_acceptance_assessment: sourceAcceptanceAssessment,
      source_aggregation_policy_assessment: policyAssessment,
      status:
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION",
      source_aggregation_outcome_basis: null,
    };
  }

  const policy = policyAssessment.source_aggregation_policy!;
  const matchBases = sourceAcceptanceAssessment.source_acceptance_match_bases;

  validateCriterionKeyConsistency(
    matchBases,
    policy.acceptance_criterion_key,
    sourceAcceptanceAssessment.required_dimension
  );

  const outcome = evaluateSourceAggregationPolicyCondition(
    matchBases,
    policy.aggregation_kind
  );

  return {
    required_dimension: sourceAcceptanceAssessment.required_dimension,
    source_acceptance_assessment: sourceAcceptanceAssessment,
    source_aggregation_policy_assessment: policyAssessment,
    status: "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_PRESENT",
    source_aggregation_outcome_basis: buildSourceAggregationOutcomeBasis(
      sourceAcceptanceAssessment,
      policy,
      outcome
    ),
  };
}

function assessRequirementDimensionAggregation(
  sourceAcceptanceAssessment: AttentionObservationCapabilityRequirementSourceAcceptanceAssessment,
  policyAssessment: AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment
): AttentionObservationCapabilityRequirementDimensionAggregationAssessment {
  const acceptanceByDimension = new Map(
    sourceAcceptanceAssessment.required_dimension_source_acceptance_assessments.map(
      (a) => [a.required_dimension, a]
    )
  );
  const policyByDimension = new Map(
    policyAssessment.required_dimension_source_aggregation_policy_assessments.map(
      (a) => [a.required_dimension, a]
    )
  );

  const dimensions = [
    ...new Set([
      ...acceptanceByDimension.keys(),
      ...policyByDimension.keys(),
    ]),
  ].sort(
    (a, b) => (DIMENSION_ORDER.get(a) ?? 0) - (DIMENSION_ORDER.get(b) ?? 0)
  );

  for (const dimension of dimensions) {
    const acceptance = acceptanceByDimension.get(dimension);
    const policy = policyByDimension.get(dimension);
    if (!acceptance || !policy) {
      throw new Error(
        `Required dimension set mismatch for capability requirement ${sourceAcceptanceAssessment.capability_requirement.key}: missing ${dimension} in source acceptance or aggregation policy assessment`
      );
    }
  }

  const required_dimension_aggregation_assessments = dimensions.map(
    (dimension) =>
      assessRequiredDimensionSourceAggregation(
        acceptanceByDimension.get(dimension)!,
        policyByDimension.get(dimension)!
      )
  );

  const has_capability_dimension_source_aggregation_outcome =
    required_dimension_aggregation_assessments.some(
      (a) => a.source_aggregation_outcome_basis !== null
    );

  return {
    capability_requirement: sourceAcceptanceAssessment.capability_requirement,
    source_acceptance_assessment: sourceAcceptanceAssessment,
    source_aggregation_policy_assessment: policyAssessment,
    required_dimension_aggregation_assessments,
    has_capability_dimension_source_aggregation_outcome,
  };
}

function resolveCandidateAggregationOutcomeStatus(
  sourceAcceptanceAssessment: AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment,
  hasOutcome: boolean
): AttentionObservationCapabilityDimensionSourceAggregationOutcomeCandidateStatus {
  if (
    sourceAcceptanceAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
  }
  if (
    sourceAcceptanceAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
  }
  if (
    sourceAcceptanceAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  ) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES";
  }
  if (
    sourceAcceptanceAssessment.status ===
    "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  ) {
    return "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED";
  }
  if (!hasOutcome) {
    return "NO_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOMES_REPRESENTED";
  }
  return "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOMES_PRESENT";
}

export function assertCompatibleCapabilityDimensionSourceAggregationOutcomeContexts(
  matchSet: AttentionObservationCapabilitySourceAcceptanceMatchSetAssessment,
  policySet: AttentionObservationCapabilityDimensionSourceAggregationPolicySetAssessment
): void {
  const matchCriteriaSet = matchSet.dimension_acceptance_criteria_set;
  const policyCriteriaSet =
    policySet.capability_dimension_acceptance_criteria_set;

  if (
    matchCriteriaSet !== policyCriteriaSet &&
    JSON.stringify(matchCriteriaSet) !== JSON.stringify(policyCriteriaSet)
  ) {
    throw new Error(
      "Capability Source Acceptance Match set and Capability Dimension Source Aggregation Policy set do not share the same Capability Requirement acceptance context"
    );
  }

  const matchCandidates = matchSet.candidate_assessments;
  const policyCandidates = policySet.candidate_assessments;

  if (matchCandidates.length !== policyCandidates.length) {
    throw new Error(
      "Capability Source Acceptance Match set and Capability Dimension Source Aggregation Policy set do not share the same Capability Requirement acceptance context: candidate count mismatch"
    );
  }

  const policyByKey = new Map(
    policyCandidates.map((c) => [c.candidate_key, c])
  );

  for (const matchCandidate of matchCandidates) {
    const policyCandidate = policyByKey.get(matchCandidate.candidate_key);
    if (!policyCandidate) {
      throw new Error(
        `Capability Source Acceptance Match set and Capability Dimension Source Aggregation Policy set do not share the same Capability Requirement acceptance context: missing candidate ${matchCandidate.candidate_key}`
      );
    }

    const matchRequirements =
      matchCandidate.requirement_source_acceptance_assessments;
    const policyRequirements =
      policyCandidate.requirement_source_aggregation_policy_assessments;

    if (matchRequirements.length !== policyRequirements.length) {
      throw new Error(
        `Capability Source Acceptance Match set and Capability Dimension Source Aggregation Policy set do not share the same Capability Requirement acceptance context for candidate ${matchCandidate.candidate_key}: requirement count mismatch`
      );
    }

    const policyReqByKey = new Map(
      policyRequirements.map((r) => [r.capability_requirement.key, r])
    );

    for (const matchReq of matchRequirements) {
      const reqKey = matchReq.capability_requirement.key;
      const policyReq = policyReqByKey.get(reqKey);
      if (!policyReq) {
        throw new Error(
          `Capability Source Acceptance Match set and Capability Dimension Source Aggregation Policy set do not share the same Capability Requirement acceptance context for candidate ${matchCandidate.candidate_key}: missing requirement ${reqKey}`
        );
      }

      const matchDims = new Set(
        matchReq.required_dimension_source_acceptance_assessments.map(
          (a) => a.required_dimension
        )
      );
      const policyDims = new Set(
        policyReq.required_dimension_source_aggregation_policy_assessments.map(
          (a) => a.required_dimension
        )
      );

      if (
        matchDims.size !== policyDims.size ||
        [...matchDims].some((d) => !policyDims.has(d))
      ) {
        throw new Error(
          `Required dimension set mismatch for capability requirement ${reqKey} in candidate ${matchCandidate.candidate_key}`
        );
      }
    }
  }
}

export function assessAttentionCandidateObservationCapabilityDimensionSourceAggregationOutcome(
  sourceAcceptanceAssessment: AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment,
  policyAssessment: AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment
): AttentionCandidateObservationCapabilityDimensionSourceAggregationOutcomeAssessment {
  const policyByReqKey = new Map(
    policyAssessment.requirement_source_aggregation_policy_assessments.map(
      (r) => [r.capability_requirement.key, r]
    )
  );

  const requirement_dimension_aggregation_assessments =
    sourceAcceptanceAssessment.requirement_source_acceptance_assessments.map(
      (acceptanceReq) => {
        const policyReq = policyByReqKey.get(
          acceptanceReq.capability_requirement.key
        );
        if (!policyReq) {
          throw new Error(
            `Required dimension set mismatch for capability requirement ${acceptanceReq.capability_requirement.key}`
          );
        }
        return assessRequirementDimensionAggregation(acceptanceReq, policyReq);
      }
    );

  const has_capability_dimension_source_aggregation_outcome =
    requirement_dimension_aggregation_assessments.some(
      (r) => r.has_capability_dimension_source_aggregation_outcome
    );

  return {
    candidate_key: sourceAcceptanceAssessment.candidate_key,
    source_acceptance_match_assessment: sourceAcceptanceAssessment,
    source_aggregation_policy_assessment: policyAssessment,
    status: resolveCandidateAggregationOutcomeStatus(
      sourceAcceptanceAssessment,
      has_capability_dimension_source_aggregation_outcome
    ),
    requirement_dimension_aggregation_assessments,
    has_capability_dimension_source_aggregation_outcome,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_MODEL_LIMITATIONS,
    ],
  };
}

export function buildAttentionObservationCapabilityDimensionSourceAggregationOutcomeSet(
  input: AttentionObservationCapabilityDimensionSourceAggregationOutcomeInput
): AttentionObservationCapabilityDimensionSourceAggregationOutcomeSetAssessment {
  const matchSet = input.capability_source_acceptance_match_set;
  const policySet = input.capability_dimension_source_aggregation_policy_set;

  assertCompatibleCapabilityDimensionSourceAggregationOutcomeContexts(
    matchSet,
    policySet
  );

  const policyByCandidateKey = new Map(
    policySet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  const candidate_assessments = matchSet.candidate_assessments.map(
    (matchCandidate) => {
      const policyCandidate = policyByCandidateKey.get(
        matchCandidate.candidate_key
      )!;
      return assessAttentionCandidateObservationCapabilityDimensionSourceAggregationOutcome(
        matchCandidate,
        policyCandidate
      );
    }
  );

  const has_capability_dimension_source_aggregation_outcome =
    candidate_assessments.some(
      (c) => c.has_capability_dimension_source_aggregation_outcome
    );

  return {
    capability_source_acceptance_match_set: matchSet,
    capability_dimension_source_aggregation_policy_set: policySet,
    candidate_assessments,
    has_capability_dimension_source_aggregation_outcome,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_OUTCOME_MODEL_LIMITATIONS,
    ],
  };
}
