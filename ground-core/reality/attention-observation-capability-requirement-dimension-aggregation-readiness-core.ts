/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Dimension
 * Aggregation Readiness Basis (GROUND-070).
 *
 * Pure composition of:
 *   GROUND-067 Required Dimension Evaluation States
 *   GROUND-069 Requirement Dimension Aggregation Readiness Policy
 *
 * Answers only whether the explicit readiness-policy condition currently holds.
 *
 * Must not import GROUND-050–066 / GROUND-068 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * readiness policy condition HOLDS ≠ Requirement aggregation result
 * readiness policy condition DOES_NOT_HOLD ≠ Requirement UNSATISFIED
 * resolved ≠ HOLDS
 * DOES_NOT_HOLD Dimension state is still resolved
 * READY / NOT_READY vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment,
  AttentionObservationCapabilityRequiredDimensionEvaluationState,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment,
  AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
} from "./attention-observation-capability-required-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySetAssessment,
} from "./attention-observation-capability-requirement-dimension-aggregation-readiness-policy-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessBasis,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessCandidateStatus,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessInput,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessModelLimitation,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessOutcome,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessSetAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessStatus,
  AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedDimensionRef,
  AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedState,
} from "./attention-observation-capability-requirement-dimension-aggregation-readiness-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementDimensionAggregationReadinessModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_READINESS_PARTIALITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_READINESS_SCORE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_READINESS_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_IGNORE_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_NON_HOLDING_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNRESOLVED_DIMENSION_HOLDING_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_RESOLVED_SUBSET_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_THRESHOLD_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_WEIGHTED_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_VETO_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_MAJORITY_AGGREGATION_NOT_MODELED",
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

const CONTEXT_MISMATCH_PREFIX =
  "Capability Required Dimension Evaluation State set and Requirement Dimension Aggregation Readiness Policy set do not share the same Capability Requirement context";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Exhaustive resolved-state classifier authorized by GROUND-069 readiness policy.
 * HOLDS and DOES_NOT_HOLD are both resolved. All UNRESOLVED_* are unresolved.
 * No fallback coercion.
 */
export function isResolvedCapabilityRequiredDimensionEvaluationState(
  state: AttentionObservationCapabilityRequiredDimensionEvaluationState
): boolean {
  switch (state) {
    case "SOURCE_AGGREGATION_CONDITION_HOLDS":
      return true;
    case "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD":
      return true;
    case "UNRESOLVED_EVALUATION_BASIS_NOT_REPRESENTED":
      return false;
    case "UNRESOLVED_ACCEPTANCE_CRITERION_NOT_DECLARED":
      return false;
    case "UNRESOLVED_SOURCE_AGGREGATION_POLICY_NOT_DECLARED":
      return false;
  }
}

function isUnresolvedState(
  state: AttentionObservationCapabilityRequiredDimensionEvaluationState
): state is AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedState {
  return !isResolvedCapabilityRequiredDimensionEvaluationState(state);
}

export function attentionObservationCapabilityRequirementDimensionAggregationReadinessKey(
  capabilityRequirementKey: string,
  evaluationDimensionPolicyKey: string,
  readinessPolicyKey: string,
  outcome: AttentionObservationCapabilityRequirementDimensionAggregationReadinessOutcome,
  requiredDimensionEvaluationStateBasisKeys: readonly string[],
  unresolvedDimensionRefs: readonly AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedDimensionRef[]
): string {
  const stateKeys = [...requiredDimensionEvaluationStateBasisKeys]
    .sort(compareStrings)
    .join(",");
  const unresolvedKeys = unresolvedDimensionRefs
    .map(
      (ref) =>
        `${ref.required_dimension}|${ref.evaluation_state_basis_key}|${ref.unresolved_state}`
    )
    .sort(compareStrings)
    .join(",");
  return [
    "attention-observation-capability-requirement-dimension-aggregation-readiness",
    capabilityRequirementKey,
    evaluationDimensionPolicyKey,
    readinessPolicyKey,
    outcome,
    stateKeys.length > 0 ? stateKeys : "none",
    unresolvedKeys.length > 0 ? unresolvedKeys : "none",
  ].join("|");
}

function dimensionSetsEqual(
  a: ReadonlySet<AttentionObservationCapabilityEvaluationDimension>,
  b: ReadonlySet<AttentionObservationCapabilityEvaluationDimension>
): boolean {
  if (a.size !== b.size) return false;
  for (const dimension of a) {
    if (!b.has(dimension)) return false;
  }
  return true;
}

function sortDimensionsCanonical(
  dimensions: readonly AttentionObservationCapabilityEvaluationDimension[]
): AttentionObservationCapabilityEvaluationDimension[] {
  return [...dimensions].sort(
    (x, y) => (DIMENSION_ORDER.get(x) ?? 0) - (DIMENSION_ORDER.get(y) ?? 0)
  );
}

export function assertCompatibleCapabilityRequirementDimensionAggregationReadinessContexts(
  evaluationStateSet: AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment,
  readinessPolicySet: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySetAssessment
): void {
  const evalCandidates = evaluationStateSet.candidate_assessments;
  const policyCandidates = readinessPolicySet.candidate_assessments;

  if (evalCandidates.length !== policyCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`
    );
  }

  const policyByKey = new Map(
    policyCandidates.map((c) => [c.candidate_key, c])
  );

  for (const evalCandidate of evalCandidates) {
    const policyCandidate = policyByKey.get(evalCandidate.candidate_key);
    if (!policyCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing candidate ${evalCandidate.candidate_key}`
      );
    }

    const evalReqs =
      evalCandidate.requirement_dimension_evaluation_state_assessments;
    const policyReqs =
      policyCandidate.requirement_dimension_aggregation_readiness_policy_assessments;

    if (evalReqs.length !== policyReqs.length) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX} for candidate ${evalCandidate.candidate_key}: requirement count mismatch`
      );
    }

    const policyReqByKey = new Map(
      policyReqs.map((r) => [r.capability_requirement.key, r])
    );

    for (const evalReq of evalReqs) {
      const reqKey = evalReq.capability_requirement.key;
      const policyReq = policyReqByKey.get(reqKey);
      if (!policyReq) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX} for candidate ${evalCandidate.candidate_key}: missing requirement ${reqKey}`
        );
      }

      if (
        evalReq.capability_requirement.observation_need_key !==
        policyReq.capability_requirement.observation_need_key
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for capability requirement ${reqKey}`
        );
      }

      const evalDims = new Set(
        evalReq.required_dimension_evaluation_assessments.map(
          (a) => a.required_dimension
        )
      );
      const policyEvalDims =
        policyReq.evaluation_dimension_policy_assessment
          .evaluation_dimension_policy_basis.evaluation_dimension_policy
          ?.required_dimensions ?? [];
      const policyDims = new Set(policyEvalDims);

      if (
        policyReq.status ===
          "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT" ||
        policyReq.status ===
          "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED"
      ) {
        if (!dimensionSetsEqual(evalDims, policyDims)) {
          throw new Error(
            `Required dimension set mismatch for capability requirement ${reqKey} in candidate ${evalCandidate.candidate_key}`
          );
        }
      }
    }
  }
}

function assertNoDuplicateDimensions(
  assessments: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment["required_dimension_evaluation_assessments"],
  requirementKey: string
): void {
  const seen = new Set<AttentionObservationCapabilityEvaluationDimension>();
  for (const assessment of assessments) {
    if (seen.has(assessment.required_dimension)) {
      throw new Error(
        `Duplicate required Dimension Evaluation State for capability requirement ${requirementKey} dimension ${assessment.required_dimension}`
      );
    }
    seen.add(assessment.required_dimension);
  }
}

function assertDomainConsistencyForReadinessEvaluation(
  evalReq: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
  policyReq: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment,
  requiredDimensions: readonly AttentionObservationCapabilityEvaluationDimension[]
): void {
  if (requiredDimensions.length === 0) {
    throw new Error(
      `Requirement Dimension Aggregation Readiness Basis invariant violated: empty required Dimension domain with readiness policy PRESENT for capability requirement ${evalReq.capability_requirement.key}`
    );
  }

  assertNoDuplicateDimensions(
    evalReq.required_dimension_evaluation_assessments,
    evalReq.capability_requirement.key
  );

  const evalDims = new Set(
    evalReq.required_dimension_evaluation_assessments.map(
      (a) => a.required_dimension
    )
  );
  const policyDims = new Set(requiredDimensions);

  for (const dimension of policyDims) {
    if (!evalDims.has(dimension)) {
      throw new Error(
        `Missing required Dimension Evaluation State for capability requirement ${evalReq.capability_requirement.key} dimension ${dimension}`
      );
    }
  }

  for (const dimension of evalDims) {
    if (!policyDims.has(dimension)) {
      throw new Error(
        `Extra Dimension Evaluation State for capability requirement ${evalReq.capability_requirement.key} dimension ${dimension}`
      );
    }
  }

  const readinessPolicy =
    policyReq.requirement_dimension_aggregation_readiness_policy!;
  const evaluationDimensionPolicy =
    policyReq.evaluation_dimension_policy_assessment
      .evaluation_dimension_policy_basis.evaluation_dimension_policy!;

  if (
    readinessPolicy.evaluation_dimension_policy_key !==
    evaluationDimensionPolicy.key
  ) {
    throw new Error(
      `Evaluation Dimension Policy key mismatch for capability requirement ${evalReq.capability_requirement.key}`
    );
  }
}

function buildReadinessBasis(
  evalReq: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
  policyReq: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment
): AttentionObservationCapabilityRequirementDimensionAggregationReadinessBasis {
  const readinessPolicy =
    policyReq.requirement_dimension_aggregation_readiness_policy!;
  const evaluationDimensionPolicy =
    policyReq.evaluation_dimension_policy_assessment
      .evaluation_dimension_policy_basis.evaluation_dimension_policy!;

  assertDomainConsistencyForReadinessEvaluation(
    evalReq,
    policyReq,
    evaluationDimensionPolicy.required_dimensions
  );

  if (
    readinessPolicy.readiness_kind !==
    "REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION"
  ) {
    throw new Error(
      `Unknown Capability Requirement Dimension Aggregation Readiness Policy kind: ${String(readinessPolicy.readiness_kind)}`
    );
  }

  const assessmentsByDimension = new Map(
    evalReq.required_dimension_evaluation_assessments.map((a) => [
      a.required_dimension,
      a,
    ])
  );

  const orderedDimensions = sortDimensionsCanonical(
    evaluationDimensionPolicy.required_dimensions
  );

  const required_dimension_evaluation_state_basis_keys: string[] = [];
  const unresolved_dimension_refs: AttentionObservationCapabilityRequirementDimensionAggregationUnresolvedDimensionRef[] =
    [];

  for (const dimension of orderedDimensions) {
    const assessment = assessmentsByDimension.get(dimension)!;
    const basis = assessment.evaluation_state_basis;
    required_dimension_evaluation_state_basis_keys.push(basis.key);

    if (isUnresolvedState(basis.state)) {
      unresolved_dimension_refs.push({
        required_dimension: dimension,
        evaluation_state_basis_key: basis.key,
        unresolved_state: basis.state,
      });
    }
  }

  const outcome: AttentionObservationCapabilityRequirementDimensionAggregationReadinessOutcome =
    unresolved_dimension_refs.length === 0
      ? "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
      : "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

  return {
    key: attentionObservationCapabilityRequirementDimensionAggregationReadinessKey(
      evalReq.capability_requirement.key,
      evaluationDimensionPolicy.key,
      readinessPolicy.key,
      outcome,
      required_dimension_evaluation_state_basis_keys,
      unresolved_dimension_refs
    ),
    capability_requirement_key: evalReq.capability_requirement.key,
    observation_need_key: evalReq.capability_requirement.observation_need_key,
    evaluation_dimension_policy_key: evaluationDimensionPolicy.key,
    readiness_policy_key: readinessPolicy.key,
    readiness_kind: readinessPolicy.readiness_kind,
    required_dimension_evaluation_state_basis_keys,
    unresolved_dimension_refs,
    outcome,
  };
}

function assertReadinessAssessmentInvariant(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment
): void {
  if (
    assessment.status ===
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT" &&
    assessment.readiness_basis === null
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Readiness Basis invariant violated: PRESENT requires non-null basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }

  if (
    assessment.status !==
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT" &&
    assessment.readiness_basis !== null
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Readiness Basis invariant violated: non-present status requires null basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function assessRequirementDimensionAggregationReadiness(
  evalReq: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
  policyReq: AttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment
): AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment {
  if (
    policyReq.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  ) {
    const assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment =
      {
        capability_requirement: evalReq.capability_requirement,
        dimension_evaluation_state_assessment: evalReq,
        readiness_policy_assessment: policyReq,
        status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY",
        readiness_basis: null,
      };
    assertReadinessAssessmentInvariant(assessment);
    return assessment;
  }

  if (
    policyReq.status === "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  ) {
    const assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment =
      {
        capability_requirement: evalReq.capability_requirement,
        dimension_evaluation_state_assessment: evalReq,
        readiness_policy_assessment: policyReq,
        status: "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS",
        readiness_basis: null,
      };
    assertReadinessAssessmentInvariant(assessment);
    return assessment;
  }

  if (
    policyReq.status ===
    "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED"
  ) {
    const assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment =
      {
        capability_requirement: evalReq.capability_requirement,
        dimension_evaluation_state_assessment: evalReq,
        readiness_policy_assessment: policyReq,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY",
        readiness_basis: null,
      };
    assertReadinessAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment =
    {
      capability_requirement: evalReq.capability_requirement,
      dimension_evaluation_state_assessment: evalReq,
      readiness_policy_assessment: policyReq,
      status: "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT",
      readiness_basis: buildReadinessBasis(evalReq, policyReq),
    };
  assertReadinessAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyReadinessBasis(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

function allRequirementsHaveEmptyRequiredDimensions(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment[]
): boolean {
  if (assessments.length === 0) return false;
  for (const assessment of assessments) {
    if (
      assessment.status !==
      "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
    ) {
      return false;
    }
  }
  return true;
}

function hasAnyNonEmptyDomainOrReadinessContext(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status !==
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY" &&
      assessment.status !==
        "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure per-AttentionCandidate Requirement Dimension Aggregation Readiness assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES
 * 4. NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED
 * 5. NO_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASES_REPRESENTED
 * 6. CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASES_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadiness(
  evaluationStateAssessment: AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment,
  readinessPolicyAssessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessPolicyAssessment
): AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment {
  const candidate_key = evaluationStateAssessment.candidate_key;

  if (candidate_key !== readinessPolicyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key} vs ${readinessPolicyAssessment.candidate_key})`
    );
  }

  const notApplicable = (
    status: AttentionObservationCapabilityRequirementDimensionAggregationReadinessCandidateStatus
  ): AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment => ({
    candidate_key,
    required_dimension_evaluation_state_assessment: evaluationStateAssessment,
    readiness_policy_assessment: readinessPolicyAssessment,
    status,
    requirement_readiness_assessments: [],
    has_capability_requirement_dimension_aggregation_readiness_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_MODEL_LIMITATIONS,
    ],
  });

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    readinessPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    readinessPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES" ||
    readinessPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  ) {
    return notApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
    );
  }

  const evalReqs =
    evaluationStateAssessment.requirement_dimension_evaluation_state_assessments;
  const policyReqs =
    readinessPolicyAssessment.requirement_dimension_aggregation_readiness_policy_assessments;

  if (evalReqs.length !== policyReqs.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidate_key}: requirement count mismatch`
    );
  }

  const policyReqByKey = new Map(
    policyReqs.map((r) => [r.capability_requirement.key, r])
  );

  const requirement_readiness_assessments = evalReqs.map((evalReq) => {
    const policyReq = policyReqByKey.get(evalReq.capability_requirement.key);
    if (!policyReq) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidate_key}: missing requirement ${evalReq.capability_requirement.key}`
      );
    }
    return assessRequirementDimensionAggregationReadiness(evalReq, policyReq);
  });

  for (const assessment of requirement_readiness_assessments) {
    assertReadinessAssessmentInvariant(assessment);
  }

  if (!hasAnyNonEmptyDomainOrReadinessContext(requirement_readiness_assessments)) {
    return {
      candidate_key,
      required_dimension_evaluation_state_assessment: evaluationStateAssessment,
      readiness_policy_assessment: readinessPolicyAssessment,
      status: allRequirementsHaveEmptyRequiredDimensions(
        requirement_readiness_assessments
      )
        ? "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
        : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES",
      requirement_readiness_assessments,
      has_capability_requirement_dimension_aggregation_readiness_basis: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_MODEL_LIMITATIONS,
      ],
    };
  }

  const has_capability_requirement_dimension_aggregation_readiness_basis =
    hasAnyReadinessBasis(requirement_readiness_assessments);

  return {
    candidate_key,
    required_dimension_evaluation_state_assessment: evaluationStateAssessment,
    readiness_policy_assessment: readinessPolicyAssessment,
    status: has_capability_requirement_dimension_aggregation_readiness_basis
      ? "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASES_PRESENT"
      : "NO_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASES_REPRESENTED",
    requirement_readiness_assessments,
    has_capability_requirement_dimension_aggregation_readiness_basis,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateReadinessBasis(
  assessments: AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_requirement_dimension_aggregation_readiness_basis) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Requirement Dimension Aggregation Readiness Basis composition.
 * Does not execute GROUND-068 ANY/ALL or produce Requirement Satisfaction.
 */
export function buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessSet(
  input: AttentionObservationCapabilityRequirementDimensionAggregationReadinessInput
): AttentionObservationCapabilityRequirementDimensionAggregationReadinessSetAssessment {
  const evaluationStateSet =
    input.capability_required_dimension_evaluation_state_set;
  const readinessPolicySet =
    input.capability_requirement_dimension_aggregation_readiness_policy_set;

  assertCompatibleCapabilityRequirementDimensionAggregationReadinessContexts(
    evaluationStateSet,
    readinessPolicySet
  );

  const policyByCandidateKey = new Map(
    readinessPolicySet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  const candidate_assessments = evaluationStateSet.candidate_assessments.map(
    (evalCandidate) => {
      const policyCandidate = policyByCandidateKey.get(
        evalCandidate.candidate_key
      )!;
      return assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationReadiness(
        evalCandidate,
        policyCandidate
      );
    }
  );

  return {
    capability_required_dimension_evaluation_state_set: evaluationStateSet,
    capability_requirement_dimension_aggregation_readiness_policy_set:
      readinessPolicySet,
    candidate_assessments,
    has_capability_requirement_dimension_aggregation_readiness_basis:
      hasAnyCandidateReadinessBasis(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_MODEL_LIMITATIONS,
    ],
  };
}
