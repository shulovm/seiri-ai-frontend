/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Dimension
 * Aggregation Readiness Policy (GROUND-069).
 *
 * Pure composition of GROUND-061 Explicit Capability Evaluation Dimension Policy
 * + explicit runtime Requirement Dimension Aggregation Readiness Policy Specification.
 *
 * Sibling of GROUND-068 Requirement Dimension Aggregation Policy.
 * Must not import GROUND-062–068 / 050–060 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * Readiness Policy ≠ Readiness Evaluation ≠ Aggregation Result ≠ Requirement Satisfaction
 * resolved ≠ HOLDS
 * DOES_NOT_HOLD is still resolved
 * readiness policy absence ≠ READY ≠ NOT_READY
 */

import type {
  AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  AttentionObservationCapabilityEvaluationDimensionPolicy,
  AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirement,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicy,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyCandidateStatus,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyEvalInput,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyInput,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyModelLimitation,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySetAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyStatus,
} from "./attention-observation-capability-requirement-dimension-aggregation-readiness-policy-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_EVALUATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_IGNORE_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_NON_HOLDING_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_HOLDING_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_RESOLVED_SUBSET_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_READINESS_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_AGGREGATION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_THRESHOLD_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_WEIGHTED_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_VETO_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_MAJORITY_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_PRIORITY_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
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

export const CANONICAL_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_KIND_ORDER: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind[] =
  [
    "REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION",
  ];

const READINESS_KIND_ORDER = new Map(
  CANONICAL_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_KIND_ORDER.map(
    (k, i) => [k, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeReadinessKind(
  kind: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind
): AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind {
  if (!READINESS_KIND_ORDER.has(kind)) {
    throw new Error(
      `Unknown Capability Requirement Dimension Aggregation Readiness Policy kind: ${String(kind)}`
    );
  }
  return kind;
}

export function attentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKey(
  capabilityRequirementKey: string,
  evaluationDimensionPolicyKey: string,
  readinessKind: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind
): string {
  return [
    "attention-observation-capability-requirement-dimension-aggregation-readiness-policy",
    capabilityRequirementKey,
    evaluationDimensionPolicyKey,
    readinessKind,
  ].join("|");
}

interface RequirementEvaluationDimensionPolicyContext {
  capabilityRequirement: AttentionObservationCapabilityRequirement;
  evaluationDimensionPolicyAssessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment;
  evaluationDimensionPolicy: AttentionObservationCapabilityEvaluationDimensionPolicy | null;
}

function collectRequirementEvaluationDimensionPolicyContexts(
  evaluationDimensionPolicySet: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment
): Map<string, RequirementEvaluationDimensionPolicyContext> {
  const byRequirementKey = new Map<
    string,
    RequirementEvaluationDimensionPolicyContext
  >();

  for (const candidate of evaluationDimensionPolicySet.candidate_assessments) {
    for (const requirementAssessment of candidate.requirement_policy_assessments) {
      const reqKey = requirementAssessment.capability_requirement.key;
      if (byRequirementKey.has(reqKey)) continue;

      byRequirementKey.set(reqKey, {
        capabilityRequirement: requirementAssessment.capability_requirement,
        evaluationDimensionPolicyAssessment: requirementAssessment,
        evaluationDimensionPolicy:
          requirementAssessment.evaluation_dimension_policy_basis
            .evaluation_dimension_policy,
      });
    }
  }

  return byRequirementKey;
}

function assertEvaluationDimensionPolicyPresentInvariant(
  context: RequirementEvaluationDimensionPolicyContext
): void {
  const { evaluationDimensionPolicyAssessment, evaluationDimensionPolicy } =
    context;

  if (
    evaluationDimensionPolicyAssessment.status ===
      "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT" &&
    evaluationDimensionPolicy === null
  ) {
    throw new Error(
      `Evaluation Dimension Policy invariant violated: PRESENT requires non-null policy for capability requirement ${evaluationDimensionPolicyAssessment.capability_requirement.key}`
    );
  }
}

function assertRequirementAggregationReadinessPolicyInvariant(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT" &&
    assessment.requirement_dimension_aggregation_readiness_policy === null
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Readiness Policy invariant violated: PRESENT requires non-null policy for capability requirement ${assessment.capability_requirement.key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT" &&
    assessment.requirement_dimension_aggregation_readiness_policy !== null
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Readiness Policy invariant violated: non-present status requires null policy for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

/**
 * Validates and normalizes Requirement Dimension Aggregation Readiness Policy
 * specification against GROUND-061.
 *
 * Exact duplicate entries → one.
 * Unknown Requirement / evaluation policy absent / empty required_dimensions → reject.
 * Unknown readiness kind → reject.
 */
export function normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification(
  evaluationDimensionPolicySet: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  specification: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification
): AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification {
  const contexts = collectRequirementEvaluationDimensionPolicyContexts(
    evaluationDimensionPolicySet
  );
  const byRequirementKey = new Map<
    string,
    AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyInput
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
        `Capability Requirement ${entry.capability_requirement_key} not found in capability evaluation dimension policy set`
      );
    }

    assertEvaluationDimensionPolicyPresentInvariant(context);

    const evaluationDimensionPolicyAssessment =
      context.evaluationDimensionPolicyAssessment;

    if (
      evaluationDimensionPolicyAssessment.status !==
      "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT"
    ) {
      throw new Error(
        `Capability Requirement Dimension Aggregation Readiness Policy requires an explicit Evaluation Dimension Policy for capability requirement ${entry.capability_requirement_key}`
      );
    }

    const evaluationDimensionPolicy = context.evaluationDimensionPolicy!;

    if (evaluationDimensionPolicy.required_dimensions.length === 0) {
      throw new Error(
        `Capability Requirement Dimension Aggregation Readiness Policy requires at least one explicit required evaluation dimension for capability requirement ${entry.capability_requirement_key}`
      );
    }

    const normalizedKind = normalizeReadinessKind(entry.readiness_kind);
    const existing = byRequirementKey.get(entry.capability_requirement_key);
    if (existing) {
      if (existing.readiness_kind !== normalizedKind) {
        throw new Error(
          `Multiple Capability Requirement Dimension Aggregation Readiness Policies declared for capability requirement ${entry.capability_requirement_key}`
        );
      }
      continue;
    }

    byRequirementKey.set(entry.capability_requirement_key, {
      capability_requirement_key: entry.capability_requirement_key,
      readiness_kind: normalizedKind,
    });
  }

  const policies = [...byRequirementKey.values()].sort((a, b) =>
    compareStrings(a.capability_requirement_key, b.capability_requirement_key)
  );

  return { policies };
}

function buildRequirementDimensionAggregationReadinessPolicy(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  evaluationDimensionPolicy: AttentionObservationCapabilityEvaluationDimensionPolicy,
  readinessKind: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKind
): AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicy {
  return {
    key: attentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKey(
      capabilityRequirement.key,
      evaluationDimensionPolicy.key,
      readinessKind
    ),
    capability_requirement_key: capabilityRequirement.key,
    observation_need_key: capabilityRequirement.observation_need_key,
    capability_semantic_key: capabilityRequirement.capability_semantic_key,
    evaluation_dimension_policy_key: evaluationDimensionPolicy.key,
    readiness_kind: readinessKind,
  };
}

function assessRequirementDimensionAggregationReadinessPolicy(
  evaluationDimensionPolicyAssessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
  policyInput:
    | AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyInput
    | undefined
): AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment {
  const { capability_requirement, evaluation_dimension_policy_basis, status } =
    evaluationDimensionPolicyAssessment;

  if (status === "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED") {
    return {
      capability_requirement,
      evaluation_dimension_policy_assessment: evaluationDimensionPolicyAssessment,
      status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY",
      requirement_dimension_aggregation_readiness_policy: null,
    };
  }

  const evaluationDimensionPolicy =
    evaluation_dimension_policy_basis.evaluation_dimension_policy;

  if (evaluationDimensionPolicy === null) {
    throw new Error(
      `Evaluation Dimension Policy invariant violated: PRESENT requires non-null policy for capability requirement ${capability_requirement.key}`
    );
  }

  if (evaluationDimensionPolicy.required_dimensions.length === 0) {
    return {
      capability_requirement,
      evaluation_dimension_policy_assessment: evaluationDimensionPolicyAssessment,
      status: "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED",
      requirement_dimension_aggregation_readiness_policy: null,
    };
  }

  if (!policyInput) {
    return {
      capability_requirement,
      evaluation_dimension_policy_assessment: evaluationDimensionPolicyAssessment,
      status:
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED",
      requirement_dimension_aggregation_readiness_policy: null,
    };
  }

  const assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment =
    {
      capability_requirement,
      evaluation_dimension_policy_assessment: evaluationDimensionPolicyAssessment,
      status:
        "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT",
      requirement_dimension_aggregation_readiness_policy:
        buildRequirementDimensionAggregationReadinessPolicy(
          capability_requirement,
          evaluationDimensionPolicy,
          policyInput.readiness_kind
        ),
    };

  assertRequirementAggregationReadinessPolicyInvariant(assessment);
  return assessment;
}

function requirementHasNonEmptyRequiredDimensions(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment
): boolean {
  if (
    assessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  ) {
    return false;
  }
  if (
    assessment.status === "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  ) {
    return false;
  }
  return true;
}

function hasAnyExplicitRequirementDimensionAggregationReadinessPolicy(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

function allRequirementsHaveEmptyRequiredDimensions(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment[]
): boolean {
  if (assessments.length === 0) {
    return false;
  }
  for (const assessment of assessments) {
    if (
      assessment.status !== "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
    ) {
      return false;
    }
  }
  return true;
}

function hasAnyNonEmptyRequiredDimensionContext(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (requirementHasNonEmptyRequiredDimensions(assessment)) {
      return true;
    }
  }
  return false;
}

/**
 * Pure per-AttentionCandidate Requirement Dimension Aggregation Readiness Policy assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES
 * 4. NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED
 * 5. NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICIES_DECLARED
 * 6. EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICIES_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicy(
  evaluationDimensionPolicyAssessment: AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  policiesByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyInput
  >
): AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment {
  const candidate_key = evaluationDimensionPolicyAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyCandidateStatus
  ): AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment => ({
    candidate_key,
    evaluation_dimension_policy_assessment: evaluationDimensionPolicyAssessment,
    status,
    requirement_dimension_aggregation_readiness_policy_assessments: [],
    has_explicit_capability_requirement_dimension_aggregation_readiness_policies:
      false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
    ],
  });

  if (
    evaluationDimensionPolicyAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    evaluationDimensionPolicyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    evaluationDimensionPolicyAssessment.status ===
    "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_DECLARED"
  ) {
    return notApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
    );
  }

  const requirement_dimension_aggregation_readiness_policy_assessments =
    evaluationDimensionPolicyAssessment.requirement_policy_assessments.map(
      (evaluationDimensionPolicyAssessmentEntry) =>
        assessRequirementDimensionAggregationReadinessPolicy(
          evaluationDimensionPolicyAssessmentEntry,
          policiesByRequirementKey.get(
            evaluationDimensionPolicyAssessmentEntry.capability_requirement.key
          )
        )
    );

  for (const assessment of requirement_dimension_aggregation_readiness_policy_assessments) {
    assertRequirementAggregationReadinessPolicyInvariant(assessment);
  }

  if (
    !hasAnyNonEmptyRequiredDimensionContext(
      requirement_dimension_aggregation_readiness_policy_assessments
    )
  ) {
    return {
      candidate_key,
      evaluation_dimension_policy_assessment: evaluationDimensionPolicyAssessment,
      status: allRequirementsHaveEmptyRequiredDimensions(
        requirement_dimension_aggregation_readiness_policy_assessments
      )
        ? "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
        : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES",
      requirement_dimension_aggregation_readiness_policy_assessments,
      has_explicit_capability_requirement_dimension_aggregation_readiness_policies:
        false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
      ],
    };
  }

  const has_explicit_capability_requirement_dimension_aggregation_readiness_policies =
    hasAnyExplicitRequirementDimensionAggregationReadinessPolicy(
      requirement_dimension_aggregation_readiness_policy_assessments
    );

  return {
    candidate_key,
    evaluation_dimension_policy_assessment: evaluationDimensionPolicyAssessment,
    status: has_explicit_capability_requirement_dimension_aggregation_readiness_policies
      ? "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICIES_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICIES_DECLARED",
    requirement_dimension_aggregation_readiness_policy_assessments,
    has_explicit_capability_requirement_dimension_aggregation_readiness_policies,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateExplicitRequirementDimensionAggregationReadinessPolicy(
  assessments: AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.has_explicit_capability_requirement_dimension_aggregation_readiness_policies
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Explicit Capability Requirement Dimension Aggregation Readiness
 * Policy composition.
 * Preserves Candidate → Capability Requirement order.
 * Does not inspect GROUND-067 states, GROUND-068 aggregation policy, or produce
 * readiness / aggregation results.
 */
export function buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet(
  input: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyEvalInput
): AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification(
      input.capability_evaluation_dimension_policy_set,
      input.specification
    );

  const policiesByRequirementKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.capability_requirement_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.capability_evaluation_dimension_policy_set.candidate_assessments.map(
      (evaluationDimensionPolicyAssessment) =>
        assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicy(
          evaluationDimensionPolicyAssessment,
          policiesByRequirementKey
        )
    );

  return {
    capability_evaluation_dimension_policy_set:
      input.capability_evaluation_dimension_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_requirement_dimension_aggregation_readiness_policies:
      hasAnyCandidateExplicitRequirementDimensionAggregationReadinessPolicy(
        candidate_assessments
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
