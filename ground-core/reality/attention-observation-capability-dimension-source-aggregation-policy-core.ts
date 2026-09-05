/**
 * Reality Core v0.7 — Attention Observation Capability Dimension Source
 * Aggregation Policy (GROUND-065).
 *
 * Pure composition of GROUND-063 Explicit Capability Dimension Acceptance Criteria
 * + explicit runtime Source Aggregation Policy Specification.
 *
 * Sibling of GROUND-064 Source Acceptance Match.
 * Must not import GROUND-060 / 061 / 062 / 064 / 050–059 runtime cores.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * Aggregation Policy ≠ Aggregation Result ≠ Dimension Outcome
 * ANY / ALL ≠ PASS / FAIL
 * policy absence ≠ ANY ≠ ALL
 */

import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment,
  AttentionObservationCapabilityDimensionAcceptanceCriterionDeclaration,
  AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment,
  AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment,
} from "./attention-observation-capability-dimension-acceptance-criteria-types.js";
import type {
  AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment,
  AttentionObservationCapabilityDimensionSourceAggregationPolicy,
  AttentionObservationCapabilityDimensionSourceAggregationPolicyCandidateStatus,
  AttentionObservationCapabilityDimensionSourceAggregationPolicyEvalInput,
  AttentionObservationCapabilityDimensionSourceAggregationPolicyInput,
  AttentionObservationCapabilityDimensionSourceAggregationPolicyKind,
  AttentionObservationCapabilityDimensionSourceAggregationPolicyModelLimitation,
  AttentionObservationCapabilityDimensionSourceAggregationPolicySetAssessment,
  AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification,
  AttentionObservationCapabilityDimensionSourceAggregationPolicyStatus,
  AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment,
  AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment,
  AttentionObservationCapabilitySourceAggregationPolicyRequirementStatus,
} from "./attention-observation-capability-dimension-source-aggregation-policy-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS: AttentionObservationCapabilityDimensionSourceAggregationPolicyModelLimitation[] =
  [
    "CAPABILITY_DIMENSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED",
    "CAPABILITY_SOURCE_ACCEPTANCE_OUTCOME_NOT_MODELED",
    "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "CAPABILITY_MISSING_CRITERION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_ZERO_SOURCE_AGGREGATION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_SOURCE_MAJORITY_AGGREGATION_NOT_MODELED",
    "CAPABILITY_SOURCE_VETO_AGGREGATION_NOT_MODELED",
    "CAPABILITY_SOURCE_THRESHOLD_AGGREGATION_NOT_MODELED",
    "CAPABILITY_SOURCE_WEIGHTED_AGGREGATION_NOT_MODELED",
    "CAPABILITY_SOURCE_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_SOURCE_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_SOURCE_RECENCY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AGGREGATION_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
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

export const CANONICAL_SOURCE_AGGREGATION_POLICY_KIND_ORDER: AttentionObservationCapabilityDimensionSourceAggregationPolicyKind[] =
  [
    "ANY_SOURCE_LISTED_AS_ACCEPTABLE",
    "ALL_SOURCES_LISTED_AS_ACCEPTABLE",
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

const AGGREGATION_KIND_ORDER = new Map(
  CANONICAL_SOURCE_AGGREGATION_POLICY_KIND_ORDER.map((k, i) => [k, i])
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeAggregationKind(
  kind: AttentionObservationCapabilityDimensionSourceAggregationPolicyKind
): AttentionObservationCapabilityDimensionSourceAggregationPolicyKind {
  if (!AGGREGATION_KIND_ORDER.has(kind)) {
    throw new Error(
      `Unknown Capability Dimension Source Aggregation Policy kind: ${String(kind)}`
    );
  }
  return kind;
}

export function attentionObservationCapabilityDimensionSourceAggregationPolicyKey(
  capabilityRequirementKey: string,
  dimension: AttentionObservationCapabilityEvaluationDimension,
  acceptanceCriterionKey: string,
  aggregationKind: AttentionObservationCapabilityDimensionSourceAggregationPolicyKind
): string {
  return [
    "attention-observation-capability-dimension-source-aggregation-policy",
    capabilityRequirementKey,
    dimension,
    acceptanceCriterionKey,
    aggregationKind,
  ].join("|");
}

interface DimensionCriterionContext {
  dimension: AttentionObservationCapabilityEvaluationDimension;
  criterionAssessment: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment;
}

interface RequirementCriterionContext {
  acceptanceCriteriaAssessment: AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment;
  dimensionsByKey: Map<
    AttentionObservationCapabilityEvaluationDimension,
    DimensionCriterionContext
  >;
}

function collectRequirementCriterionContexts(
  criteriaSet: AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment
): Map<string, RequirementCriterionContext> {
  const byRequirementKey = new Map<string, RequirementCriterionContext>();

  for (const candidate of criteriaSet.candidate_assessments) {
    for (const requirementAssessment of candidate.requirement_acceptance_criteria_assessments) {
      const reqKey = requirementAssessment.capability_requirement.key;
      if (byRequirementKey.has(reqKey)) continue;

      const dimensionsByKey = new Map<
        AttentionObservationCapabilityEvaluationDimension,
        DimensionCriterionContext
      >();

      for (const criterionAssessment of requirementAssessment.required_dimension_criterion_assessments) {
        dimensionsByKey.set(criterionAssessment.required_dimension, {
          dimension: criterionAssessment.required_dimension,
          criterionAssessment,
        });
      }

      byRequirementKey.set(reqKey, {
        acceptanceCriteriaAssessment: requirementAssessment,
        dimensionsByKey,
      });
    }
  }

  return byRequirementKey;
}

function assertCriterionAssessmentInvariant(
  assessment: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT" &&
    assessment.acceptance_criterion === null
  ) {
    throw new Error(
      `Acceptance criterion invariant violated: PRESENT requires non-null criterion for dimension ${assessment.required_dimension}`
    );
  }
  if (
    assessment.status ===
      "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_DECLARED" &&
    assessment.acceptance_criterion !== null
  ) {
    throw new Error(
      `Acceptance criterion invariant violated: absent requires null criterion for dimension ${assessment.required_dimension}`
    );
  }
}

/**
 * Validates and normalizes Source Aggregation Policy specification against GROUND-063.
 *
 * Exact duplicate entries → one.
 * Same Requirement × Dimension + different aggregation kind → reject.
 * Unknown Requirement / criterion absent / non-required dimension → reject.
 */
export function normalizeAttentionObservationCapabilityDimensionSourceAggregationPolicySpecification(
  criteriaSet: AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment,
  specification: AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification
): AttentionObservationCapabilityDimensionSourceAggregationPolicySpecification {
  const contexts = collectRequirementCriterionContexts(criteriaSet);
  const byReqDim = new Map<
    string,
    AttentionObservationCapabilityDimensionSourceAggregationPolicyInput
  >();

  for (const entry of specification.policies) {
    if (
      !entry.capability_requirement_key ||
      entry.capability_requirement_key.trim().length === 0
    ) {
      throw new Error("Capability Requirement key must be non-empty");
    }

    const context = contexts.get(entry.capability_requirement_key);
    if (!context) {
      throw new Error(
        `Capability Requirement ${entry.capability_requirement_key} not found in capability dimension acceptance criteria set`
      );
    }

    const reqAssessment = context.acceptanceCriteriaAssessment;

    if (
      reqAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      reqAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
      reqAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY" ||
      reqAssessment.status ===
        "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED" ||
      reqAssessment.status ===
        "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED"
    ) {
      throw new Error(
        `Capability Requirement ${entry.capability_requirement_key} has no explicit Capability Evaluation Dimension Policy / Acceptance Criteria context for Source Aggregation Policy`
      );
    }

    const dimensionContext = context.dimensionsByKey.get(entry.dimension);
    if (!dimensionContext) {
      throw new Error(
        `Capability Evaluation Dimension ${entry.dimension} is not required by policy for capability requirement ${entry.capability_requirement_key}`
      );
    }

    assertCriterionAssessmentInvariant(dimensionContext.criterionAssessment);

    if (
      dimensionContext.criterionAssessment.status !==
      "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT"
    ) {
      throw new Error(
        `Capability Dimension Source Aggregation Policy requires an explicit Acceptance Criterion for capability requirement ${entry.capability_requirement_key} dimension ${entry.dimension}`
      );
    }

    const normalizedKind = normalizeAggregationKind(entry.aggregation_kind);
    const mapKey = `${entry.capability_requirement_key}|${entry.dimension}`;
    const existing = byReqDim.get(mapKey);
    if (existing) {
      if (existing.aggregation_kind !== normalizedKind) {
        throw new Error(
          `Multiple Capability Dimension Source Aggregation Policies declared for capability requirement ${entry.capability_requirement_key} dimension ${entry.dimension}`
        );
      }
      continue;
    }

    byReqDim.set(mapKey, {
      capability_requirement_key: entry.capability_requirement_key,
      dimension: entry.dimension,
      aggregation_kind: normalizedKind,
    });
  }

  const policies = [...byReqDim.values()].sort((a, b) => {
    const reqDiff = compareStrings(
      a.capability_requirement_key,
      b.capability_requirement_key
    );
    if (reqDiff !== 0) return reqDiff;
    return (
      (DIMENSION_ORDER.get(a.dimension) ?? 0) -
      (DIMENSION_ORDER.get(b.dimension) ?? 0)
    );
  });

  return { policies };
}

function buildSourceAggregationPolicy(
  criterionDeclaration: AttentionObservationCapabilityDimensionAcceptanceCriterionDeclaration,
  aggregationKind: AttentionObservationCapabilityDimensionSourceAggregationPolicyKind
): AttentionObservationCapabilityDimensionSourceAggregationPolicy {
  return {
    key: attentionObservationCapabilityDimensionSourceAggregationPolicyKey(
      criterionDeclaration.capability_requirement_key,
      criterionDeclaration.dimension,
      criterionDeclaration.key,
      aggregationKind
    ),
    capability_requirement_key: criterionDeclaration.capability_requirement_key,
    observation_need_key: criterionDeclaration.observation_need_key,
    capability_semantic_key: criterionDeclaration.capability_semantic_key,
    dimension: criterionDeclaration.dimension,
    acceptance_criterion_key: criterionDeclaration.key,
    aggregation_kind: aggregationKind,
  };
}

function assessRequiredDimensionSourceAggregationPolicy(
  criterionAssessment: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment,
  policyInput:
    | AttentionObservationCapabilityDimensionSourceAggregationPolicyInput
    | undefined
): AttentionObservationCapabilityRequiredDimensionSourceAggregationPolicyAssessment {
  assertCriterionAssessmentInvariant(criterionAssessment);

  if (
    criterionAssessment.status ===
    "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_DECLARED"
  ) {
    return {
      required_dimension: criterionAssessment.required_dimension,
      acceptance_criterion_assessment: criterionAssessment,
      status:
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION",
      source_aggregation_policy: null,
    };
  }

  if (!policyInput) {
    return {
      required_dimension: criterionAssessment.required_dimension,
      acceptance_criterion_assessment: criterionAssessment,
      status:
        "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_DECLARED",
      source_aggregation_policy: null,
    };
  }

  const criterionDeclaration = criterionAssessment.acceptance_criterion!;

  return {
    required_dimension: criterionAssessment.required_dimension,
    acceptance_criterion_assessment: criterionAssessment,
    status: "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_PRESENT",
    source_aggregation_policy: buildSourceAggregationPolicy(
      criterionDeclaration,
      policyInput.aggregation_kind
    ),
  };
}

function assessRequirementSourceAggregationPolicy(
  acceptanceCriteriaAssessment: AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment,
  policiesByDimension: ReadonlyMap<
    AttentionObservationCapabilityEvaluationDimension,
    AttentionObservationCapabilityDimensionSourceAggregationPolicyInput
  >
): AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment {
  const mapNotApplicable = (
    status: AttentionObservationCapabilitySourceAggregationPolicyRequirementStatus
  ): AttentionObservationCapabilityRequirementSourceAggregationPolicyAssessment => ({
    capability_requirement: acceptanceCriteriaAssessment.capability_requirement,
    acceptance_criteria_assessment: acceptanceCriteriaAssessment,
    status,
    required_dimension_source_aggregation_policy_assessments: [],
    has_explicit_capability_dimension_source_aggregation_policies: false,
  });

  if (
    acceptanceCriteriaAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    acceptanceCriteriaAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return mapNotApplicable(acceptanceCriteriaAssessment.status);
  }

  if (
    acceptanceCriteriaAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  ) {
    return mapNotApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
    );
  }

  if (
    acceptanceCriteriaAssessment.status ===
    "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  ) {
    return mapNotApplicable("NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED");
  }

  if (
    acceptanceCriteriaAssessment.status ===
    "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED"
  ) {
    return mapNotApplicable(
      "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED"
    );
  }

  const required_dimension_source_aggregation_policy_assessments =
    acceptanceCriteriaAssessment.required_dimension_criterion_assessments
      .slice()
      .sort(
        (a, b) =>
          (DIMENSION_ORDER.get(a.required_dimension) ?? 0) -
          (DIMENSION_ORDER.get(b.required_dimension) ?? 0)
      )
      .map((criterionAssessment) =>
        assessRequiredDimensionSourceAggregationPolicy(
          criterionAssessment,
          policiesByDimension.get(criterionAssessment.required_dimension)
        )
      );

  const has_explicit_capability_dimension_source_aggregation_policies =
    required_dimension_source_aggregation_policy_assessments.some(
      (a) =>
        a.status ===
        "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_PRESENT"
    );

  return {
    capability_requirement: acceptanceCriteriaAssessment.capability_requirement,
    acceptance_criteria_assessment: acceptanceCriteriaAssessment,
    status: has_explicit_capability_dimension_source_aggregation_policies
      ? "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICIES_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICIES_DECLARED",
    required_dimension_source_aggregation_policy_assessments,
    has_explicit_capability_dimension_source_aggregation_policies,
  };
}

/**
 * Pure per-AttentionCandidate Source Aggregation Policy assessment.
 */
export function assessAttentionCandidateObservationCapabilityDimensionSourceAggregationPolicy(
  acceptanceCriteriaAssessment: AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment,
  policiesByRequirementDimension: ReadonlyMap<
    string,
    Map<
      AttentionObservationCapabilityEvaluationDimension,
      AttentionObservationCapabilityDimensionSourceAggregationPolicyInput
    >
  >
): AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment {
  const candidate_key = acceptanceCriteriaAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityDimensionSourceAggregationPolicyCandidateStatus
  ): AttentionCandidateObservationCapabilityDimensionSourceAggregationPolicyAssessment => ({
    candidate_key,
    acceptance_criteria_assessment: acceptanceCriteriaAssessment,
    status,
    requirement_source_aggregation_policy_assessments: [],
    has_explicit_capability_dimension_source_aggregation_policies: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
    ],
  });

  if (
    acceptanceCriteriaAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    acceptanceCriteriaAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    acceptanceCriteriaAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  ) {
    return notApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
    );
  }

  const requirement_source_aggregation_policy_assessments =
    acceptanceCriteriaAssessment.requirement_acceptance_criteria_assessments.map(
      (reqCriteria) =>
        assessRequirementSourceAggregationPolicy(
          reqCriteria,
          policiesByRequirementDimension.get(
            reqCriteria.capability_requirement.key
          ) ?? new Map()
        )
    );

  const hasAnyRequiredDimensions =
    requirement_source_aggregation_policy_assessments.some(
      (a) =>
        a.status !==
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY" &&
        a.status !== "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED" &&
        a.required_dimension_source_aggregation_policy_assessments.length > 0
    );

  if (!hasAnyRequiredDimensions) {
    const allEmptyPolicy =
      requirement_source_aggregation_policy_assessments.every(
        (a) =>
          a.status === "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
      );
    return {
      candidate_key,
      acceptance_criteria_assessment: acceptanceCriteriaAssessment,
      status: allEmptyPolicy
        ? "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
        : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES",
      requirement_source_aggregation_policy_assessments,
      has_explicit_capability_dimension_source_aggregation_policies: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
      ],
    };
  }

  const has_explicit_capability_dimension_source_aggregation_policies =
    requirement_source_aggregation_policy_assessments.some(
      (a) => a.has_explicit_capability_dimension_source_aggregation_policies
    );

  const hasAnyCriteria =
    acceptanceCriteriaAssessment.has_explicit_capability_dimension_acceptance_criteria;

  return {
    candidate_key,
    acceptance_criteria_assessment: acceptanceCriteriaAssessment,
    status: has_explicit_capability_dimension_source_aggregation_policies
      ? "EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICIES_PRESENT"
      : hasAnyCriteria
        ? "NO_EXPLICIT_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICIES_DECLARED"
        : "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED",
    requirement_source_aggregation_policy_assessments,
    has_explicit_capability_dimension_source_aggregation_policies,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Capability Dimension Source Aggregation Policy composition.
 * Preserves Candidate → Requirement → required dimension order.
 * Does not inspect 064 source matches or produce aggregation results.
 */
export function buildAttentionObservationCapabilityDimensionSourceAggregationPolicySet(
  input: AttentionObservationCapabilityDimensionSourceAggregationPolicyEvalInput
): AttentionObservationCapabilityDimensionSourceAggregationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationCapabilityDimensionSourceAggregationPolicySpecification(
      input.capability_dimension_acceptance_criteria_set,
      input.specification
    );

  const policiesByRequirementDimension = new Map<
    string,
    Map<
      AttentionObservationCapabilityEvaluationDimension,
      AttentionObservationCapabilityDimensionSourceAggregationPolicyInput
    >
  >();

  for (const entry of normalizedSpecification.policies) {
    let byDim = policiesByRequirementDimension.get(
      entry.capability_requirement_key
    );
    if (!byDim) {
      byDim = new Map();
      policiesByRequirementDimension.set(
        entry.capability_requirement_key,
        byDim
      );
    }
    byDim.set(entry.dimension, entry);
  }

  const candidate_assessments =
    input.capability_dimension_acceptance_criteria_set.candidate_assessments.map(
      (acceptanceCriteriaAssessment) =>
        assessAttentionCandidateObservationCapabilityDimensionSourceAggregationPolicy(
          acceptanceCriteriaAssessment,
          policiesByRequirementDimension
        )
    );

  return {
    capability_dimension_acceptance_criteria_set:
      input.capability_dimension_acceptance_criteria_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_dimension_source_aggregation_policies:
      candidate_assessments.some(
        (c) => c.has_explicit_capability_dimension_source_aggregation_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
