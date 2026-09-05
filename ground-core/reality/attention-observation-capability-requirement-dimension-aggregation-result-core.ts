/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Dimension
 * Aggregation Result (GROUND-071).
 *
 * Pure composition of:
 *   GROUND-067 Required Dimension Evaluation States
 *   GROUND-068 Requirement Dimension Aggregation Policy
 *   GROUND-070 Requirement Dimension Aggregation Readiness Basis
 *
 * Answers only whether the exact GROUND-068 ANY/ALL condition holds over
 * readiness-authorized resolved GROUND-067 Dimension Evaluation States.
 *
 * Must not import GROUND-050–066 / GROUND-069 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * Requirement aggregation condition HOLDS ≠ Capability Requirement SATISFIED
 * Requirement aggregation condition DOES_NOT_HOLD ≠ UNSATISFIED
 * readiness DOES_NOT_HOLD ≠ aggregation DOES_NOT_HOLD
 * READY / PASS / FAIL vocabulary is not used
 */

import type {
  AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment,
  AttentionObservationCapabilityRequiredDimensionEvaluationState,
  AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment,
  AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
} from "./attention-observation-capability-required-dimension-evaluation-state-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationPolicyAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind,
  AttentionObservationCapabilityRequirementDimensionAggregationPolicySetAssessment,
} from "./attention-observation-capability-requirement-dimension-aggregation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationReadinessSetAssessment,
} from "./attention-observation-capability-requirement-dimension-aggregation-readiness-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationOutcome,
  AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationResultBasis,
  AttentionObservationCapabilityRequirementDimensionAggregationResultCandidateStatus,
  AttentionObservationCapabilityRequirementDimensionAggregationResultInput,
  AttentionObservationCapabilityRequirementDimensionAggregationResultModelLimitation,
  AttentionObservationCapabilityRequirementDimensionAggregationResultSetAssessment,
  AttentionObservationCapabilityRequirementDimensionAggregationResultStatus,
} from "./attention-observation-capability-requirement-dimension-aggregation-result-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementDimensionAggregationResultModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_EVALUATION_STATE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AGGREGATION_RESULT_TO_SATISFACTION_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_READINESS_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AGGREGATION_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_ZERO_DIMENSION_AGGREGATION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_RESOLVED_SUBSET_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_THRESHOLD_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_WEIGHTED_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_VETO_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_MAJORITY_AGGREGATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_DIMENSION_RECENCY_PRECEDENCE_NOT_MODELED",
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
  "Capability Required Dimension Evaluation State set, Requirement Dimension Aggregation Policy set, and Requirement Dimension Aggregation Readiness set do not share the same Capability Requirement context";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortDimensionsCanonical(
  dimensions: readonly AttentionObservationCapabilityEvaluationDimension[]
): AttentionObservationCapabilityEvaluationDimension[] {
  return [...dimensions].sort(
    (x, y) => (DIMENSION_ORDER.get(x) ?? 0) - (DIMENSION_ORDER.get(y) ?? 0)
  );
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

function stateBasisKeySetsEqual(
  a: readonly string[],
  b: readonly string[]
): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort(compareStrings);
  const sortedB = [...b].sort(compareStrings);
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
}

function isResolvedAggregationDimensionState(
  state: AttentionObservationCapabilityRequiredDimensionEvaluationState
): state is
  | "SOURCE_AGGREGATION_CONDITION_HOLDS"
  | "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD" {
  return (
    state === "SOURCE_AGGREGATION_CONDITION_HOLDS" ||
    state === "SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"
  );
}

export function attentionObservationCapabilityRequirementDimensionAggregationResultKey(
  capabilityRequirementKey: string,
  evaluationDimensionPolicyKey: string,
  aggregationPolicyKey: string,
  readinessBasisKey: string,
  requiredDimensionEvaluationStateBasisKeys: readonly string[]
): string {
  const stateSetKey = [...requiredDimensionEvaluationStateBasisKeys]
    .sort(compareStrings)
    .join(",");
  return [
    "attention-observation-capability-requirement-dimension-aggregation-result",
    capabilityRequirementKey,
    evaluationDimensionPolicyKey,
    aggregationPolicyKey,
    readinessBasisKey,
    stateSetKey.length > 0 ? stateSetKey : "none",
  ].join("|");
}

/**
 * ANY / ALL over exact non-empty resolved Dimension Evaluation States.
 * Empty domain is an invariant violation — never vacuous truth / vacuous false.
 */
export function evaluateRequirementDimensionAggregationPolicyCondition(
  aggregationKind: AttentionObservationCapabilityRequirementDimensionAggregationPolicyKind,
  dimensionStates: readonly AttentionObservationCapabilityRequiredDimensionEvaluationState[]
): AttentionObservationCapabilityRequirementDimensionAggregationOutcome {
  if (dimensionStates.length === 0) {
    throw new Error(
      "Requirement Dimension Aggregation Result invariant violated: empty required Dimension domain (vacuous ANY/ALL forbidden)"
    );
  }

  for (const state of dimensionStates) {
    if (!isResolvedAggregationDimensionState(state)) {
      throw new Error(
        `Requirement Dimension Aggregation Result invariant violated: unresolved Dimension Evaluation State ${state} under readiness HOLDS`
      );
    }
  }

  if (
    aggregationKind ===
    "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
  ) {
    return dimensionStates.some(
      (state) => state === "SOURCE_AGGREGATION_CONDITION_HOLDS"
    )
      ? "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
      : "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD";
  }

  if (
    aggregationKind ===
    "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD"
  ) {
    return dimensionStates.every(
      (state) => state === "SOURCE_AGGREGATION_CONDITION_HOLDS"
    )
      ? "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_HOLDS"
      : "REQUIREMENT_DIMENSION_AGGREGATION_POLICY_CONDITION_DOES_NOT_HOLD";
  }

  throw new Error(
    `Unknown Capability Requirement Dimension Aggregation Policy kind: ${String(aggregationKind)}`
  );
}

export function assertCompatibleCapabilityRequirementDimensionAggregationResultContexts(
  evaluationStateSet: AttentionObservationCapabilityRequiredDimensionEvaluationStateSetAssessment,
  aggregationPolicySet: AttentionObservationCapabilityRequirementDimensionAggregationPolicySetAssessment,
  readinessSet: AttentionObservationCapabilityRequirementDimensionAggregationReadinessSetAssessment
): void {
  const evalCandidates = evaluationStateSet.candidate_assessments;
  const policyCandidates = aggregationPolicySet.candidate_assessments;
  const readinessCandidates = readinessSet.candidate_assessments;

  if (
    evalCandidates.length !== policyCandidates.length ||
    evalCandidates.length !== readinessCandidates.length
  ) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const policyByKey = new Map(
    policyCandidates.map((c) => [c.candidate_key, c])
  );
  const readinessByKey = new Map(
    readinessCandidates.map((c) => [c.candidate_key, c])
  );

  for (const evalCandidate of evalCandidates) {
    const policyCandidate = policyByKey.get(evalCandidate.candidate_key);
    const readinessCandidate = readinessByKey.get(evalCandidate.candidate_key);
    if (!policyCandidate || !readinessCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing candidate ${evalCandidate.candidate_key}`
      );
    }

    const evalReqs =
      evalCandidate.requirement_dimension_evaluation_state_assessments;
    const policyReqs =
      policyCandidate.requirement_dimension_aggregation_policy_assessments;
    const readinessReqs =
      readinessCandidate.requirement_readiness_assessments;

    if (
      evalReqs.length !== policyReqs.length ||
      evalReqs.length !== readinessReqs.length
    ) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX} for candidate ${evalCandidate.candidate_key}: requirement count mismatch`
      );
    }

    const policyReqByKey = new Map(
      policyReqs.map((r) => [r.capability_requirement.key, r])
    );
    const readinessReqByKey = new Map(
      readinessReqs.map((r) => [r.capability_requirement.key, r])
    );

    for (const evalReq of evalReqs) {
      const reqKey = evalReq.capability_requirement.key;
      const policyReq = policyReqByKey.get(reqKey);
      const readinessReq = readinessReqByKey.get(reqKey);
      if (!policyReq || !readinessReq) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX} for candidate ${evalCandidate.candidate_key}: missing requirement ${reqKey}`
        );
      }

      if (
        evalReq.capability_requirement.observation_need_key !==
          policyReq.capability_requirement.observation_need_key ||
        evalReq.capability_requirement.observation_need_key !==
          readinessReq.capability_requirement.observation_need_key
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

      const policyEvalPolicy =
        policyReq.evaluation_dimension_policy_assessment
          .evaluation_dimension_policy_basis.evaluation_dimension_policy;
      const readinessEvalPolicy =
        readinessReq.readiness_policy_assessment
          .evaluation_dimension_policy_assessment
          .evaluation_dimension_policy_basis.evaluation_dimension_policy;

      if (policyEvalPolicy && readinessEvalPolicy) {
        if (policyEvalPolicy.key !== readinessEvalPolicy.key) {
          throw new Error(
            `Evaluation Dimension Policy key mismatch for capability requirement ${reqKey}`
          );
        }
        const policyDims = new Set(policyEvalPolicy.required_dimensions);
        const readinessDims = new Set(readinessEvalPolicy.required_dimensions);
        if (
          !dimensionSetsEqual(policyDims, readinessDims) ||
          !dimensionSetsEqual(evalDims, policyDims)
        ) {
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

function assertDomainConsistencyForAggregationExecution(
  evalReq: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
  policyReq: AttentionObservationCapabilityRequirementDimensionAggregationPolicyAssessment,
  readinessReq: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment,
  requiredDimensions: readonly AttentionObservationCapabilityEvaluationDimension[]
): void {
  if (requiredDimensions.length === 0) {
    throw new Error(
      `Requirement Dimension Aggregation Result invariant violated: empty required Dimension domain with readiness HOLDS for capability requirement ${evalReq.capability_requirement.key}`
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

  const aggregationPolicy =
    policyReq.requirement_dimension_aggregation_policy!;
  const readinessBasis = readinessReq.readiness_basis!;
  const evaluationDimensionPolicy =
    policyReq.evaluation_dimension_policy_assessment
      .evaluation_dimension_policy_basis.evaluation_dimension_policy!;

  if (
    aggregationPolicy.evaluation_dimension_policy_key !==
    evaluationDimensionPolicy.key
  ) {
    throw new Error(
      `Evaluation Dimension Policy key mismatch for capability requirement ${evalReq.capability_requirement.key}`
    );
  }

  if (
    readinessBasis.evaluation_dimension_policy_key !==
    evaluationDimensionPolicy.key
  ) {
    throw new Error(
      `Evaluation Dimension Policy key mismatch between readiness basis and Evaluation Dimension Policy for capability requirement ${evalReq.capability_requirement.key}`
    );
  }

  if (
    aggregationPolicy.capability_requirement_key !==
      evalReq.capability_requirement.key ||
    readinessBasis.capability_requirement_key !==
      evalReq.capability_requirement.key
  ) {
    throw new Error(
      `Capability Requirement key mismatch for aggregation execution of ${evalReq.capability_requirement.key}`
    );
  }

  if (
    aggregationPolicy.observation_need_key !==
      evalReq.capability_requirement.observation_need_key ||
    readinessBasis.observation_need_key !==
      evalReq.capability_requirement.observation_need_key
  ) {
    throw new Error(
      `ObservationNeed key mismatch for aggregation execution of ${evalReq.capability_requirement.key}`
    );
  }
}

function buildAggregationResultBasis(
  evalReq: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
  policyReq: AttentionObservationCapabilityRequirementDimensionAggregationPolicyAssessment,
  readinessReq: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment
): AttentionObservationCapabilityRequirementDimensionAggregationResultBasis {
  const aggregationPolicy =
    policyReq.requirement_dimension_aggregation_policy!;
  const readinessBasis = readinessReq.readiness_basis!;
  const evaluationDimensionPolicy =
    policyReq.evaluation_dimension_policy_assessment
      .evaluation_dimension_policy_basis.evaluation_dimension_policy!;

  assertDomainConsistencyForAggregationExecution(
    evalReq,
    policyReq,
    readinessReq,
    evaluationDimensionPolicy.required_dimensions
  );

  if (
    readinessBasis.outcome !==
    "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Result invariant violated: readiness outcome must HOLDS to execute aggregation for capability requirement ${evalReq.capability_requirement.key}`
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
  const dimensionStates: AttentionObservationCapabilityRequiredDimensionEvaluationState[] =
    [];

  for (const dimension of orderedDimensions) {
    const assessment = assessmentsByDimension.get(dimension)!;
    const basis = assessment.evaluation_state_basis;
    required_dimension_evaluation_state_basis_keys.push(basis.key);
    dimensionStates.push(basis.state);
  }

  if (
    !stateBasisKeySetsEqual(
      required_dimension_evaluation_state_basis_keys,
      readinessBasis.required_dimension_evaluation_state_basis_keys
    )
  ) {
    throw new Error(
      `Stale Requirement Dimension Aggregation Readiness Basis for capability requirement ${evalReq.capability_requirement.key}: current GROUND-067 state basis keys differ from readiness-evaluated state basis keys`
    );
  }

  const outcome = evaluateRequirementDimensionAggregationPolicyCondition(
    aggregationPolicy.aggregation_kind,
    dimensionStates
  );

  return {
    key: attentionObservationCapabilityRequirementDimensionAggregationResultKey(
      evalReq.capability_requirement.key,
      evaluationDimensionPolicy.key,
      aggregationPolicy.key,
      readinessBasis.key,
      required_dimension_evaluation_state_basis_keys
    ),
    capability_requirement_key: evalReq.capability_requirement.key,
    observation_need_key: evalReq.capability_requirement.observation_need_key,
    evaluation_dimension_policy_key: evaluationDimensionPolicy.key,
    requirement_dimension_aggregation_policy_key: aggregationPolicy.key,
    requirement_dimension_aggregation_readiness_basis_key: readinessBasis.key,
    aggregation_kind: aggregationPolicy.aggregation_kind,
    required_dimension_evaluation_state_basis_keys,
    outcome,
  };
}

function assertAggregationResultAssessmentInvariant(
  assessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment
): void {
  if (
    assessment.status ===
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT" &&
    assessment.aggregation_result_basis === null
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Result invariant violated: PRESENT requires non-null basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }

  if (
    assessment.status !==
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT" &&
    assessment.aggregation_result_basis !== null
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Result invariant violated: non-present status requires null basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }

  if (
    assessment.status ===
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT"
  ) {
    if (
      assessment.requirement_dimension_aggregation_policy_assessment.status !==
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT"
    ) {
      throw new Error(
        `Requirement Dimension Aggregation Result invariant violated: PRESENT requires 068 policy PRESENT for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    if (
      assessment.requirement_dimension_aggregation_readiness_assessment
        .status !==
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT"
    ) {
      throw new Error(
        `Requirement Dimension Aggregation Result invariant violated: PRESENT requires 070 readiness basis PRESENT for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    if (
      assessment.requirement_dimension_aggregation_readiness_assessment
        .readiness_basis?.outcome !==
      "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
    ) {
      throw new Error(
        `Requirement Dimension Aggregation Result invariant violated: PRESENT requires readiness HOLDS for capability requirement ${assessment.capability_requirement.key}`
      );
    }
  }

  if (
    assessment.requirement_dimension_aggregation_readiness_assessment
      .readiness_basis?.outcome ===
      "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" &&
    assessment.aggregation_result_basis !== null
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Result invariant violated: readiness DOES_NOT_HOLD must not produce aggregation result for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function assessRequirementDimensionAggregationResult(
  evalReq: AttentionObservationCapabilityRequirementDimensionEvaluationStateAssessment,
  policyReq: AttentionObservationCapabilityRequirementDimensionAggregationPolicyAssessment,
  readinessReq: AttentionObservationCapabilityRequirementDimensionAggregationReadinessAssessment
): AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment {
  const wrap = (
    status: AttentionObservationCapabilityRequirementDimensionAggregationResultStatus,
    aggregation_result_basis: AttentionObservationCapabilityRequirementDimensionAggregationResultBasis | null
  ): AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment => {
    const assessment: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment =
      {
        capability_requirement: evalReq.capability_requirement,
        required_dimension_evaluation_state_assessment: evalReq,
        requirement_dimension_aggregation_policy_assessment: policyReq,
        requirement_dimension_aggregation_readiness_assessment: readinessReq,
        status,
        aggregation_result_basis,
      };
    assertAggregationResultAssessmentInvariant(assessment);
    return assessment;
  };

  // Precedence 1: no Evaluation Dimension Policy
  if (
    policyReq.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY" ||
    readinessReq.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
  ) {
    return wrap(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY",
      null
    );
  }

  // Precedence 2: empty required Dimension domain
  if (
    policyReq.status ===
      "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED" ||
    readinessReq.status ===
      "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS"
  ) {
    return wrap(
      "NOT_APPLICABLE_NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS",
      null
    );
  }

  // Precedence 3: no Requirement Dimension Aggregation Policy
  if (
    policyReq.status ===
    "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_DECLARED"
  ) {
    return wrap(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY",
      null
    );
  }

  // Precedence 4: no readiness policy / no readiness basis due to policy absence
  if (
    readinessReq.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY"
  ) {
    return wrap(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY",
      null
    );
  }

  // Precedence 5: readiness basis exists but condition DOES_NOT_HOLD
  if (
    readinessReq.status ===
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT" &&
    readinessReq.readiness_basis?.outcome ===
      "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    return wrap(
      "NOT_APPLICABLE_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
      null
    );
  }

  // Precedence 6: both gates — 068 PRESENT + 070 PRESENT + readiness HOLDS
  if (
    policyReq.status !==
      "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT" ||
    readinessReq.status !==
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_BASIS_PRESENT" ||
    readinessReq.readiness_basis?.outcome !==
      "REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_HOLDS"
  ) {
    throw new Error(
      `Requirement Dimension Aggregation Result invariant violated: unexpected execution gate state for capability requirement ${evalReq.capability_requirement.key}`
    );
  }

  return wrap(
    "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT",
    buildAggregationResultBasis(evalReq, policyReq, readinessReq)
  );
}

function hasAnyAggregationResult(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

function allRequirementsHaveEmptyRequiredDimensions(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment[]
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

function hasAnyNonEmptyDomainOrAggregationContext(
  assessments: AttentionObservationCapabilityRequirementDimensionAggregationResultAssessment[]
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
 * Pure per-AttentionCandidate Requirement Dimension Aggregation Result assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES
 * 4. NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED
 * 5. NO_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_REPRESENTED
 * 6. CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationResult(
  evaluationStateAssessment: AttentionCandidateObservationCapabilityRequiredDimensionEvaluationStateAssessment,
  aggregationPolicyAssessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationPolicyAssessment,
  readinessAssessment: AttentionCandidateObservationCapabilityRequirementDimensionAggregationReadinessAssessment
): AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment {
  const candidate_key = evaluationStateAssessment.candidate_key;

  if (
    candidate_key !== aggregationPolicyAssessment.candidate_key ||
    candidate_key !== readinessAssessment.candidate_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key})`
    );
  }

  const notApplicable = (
    status: AttentionObservationCapabilityRequirementDimensionAggregationResultCandidateStatus
  ): AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment => ({
    candidate_key,
    required_dimension_evaluation_state_assessment: evaluationStateAssessment,
    requirement_dimension_aggregation_policy_assessment:
      aggregationPolicyAssessment,
    requirement_dimension_aggregation_readiness_assessment: readinessAssessment,
    status,
    requirement_aggregation_assessments: [],
    has_capability_requirement_dimension_aggregation_result: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS,
    ],
  });

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    aggregationPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    readinessAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    aggregationPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    readinessAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    evaluationStateAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES" ||
    aggregationPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES" ||
    readinessAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  ) {
    return notApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
    );
  }

  const evalReqs =
    evaluationStateAssessment.requirement_dimension_evaluation_state_assessments;
  const policyReqs =
    aggregationPolicyAssessment.requirement_dimension_aggregation_policy_assessments;
  const readinessReqs = readinessAssessment.requirement_readiness_assessments;

  if (
    evalReqs.length !== policyReqs.length ||
    evalReqs.length !== readinessReqs.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidate_key}: requirement count mismatch`
    );
  }

  const policyReqByKey = new Map(
    policyReqs.map((r) => [r.capability_requirement.key, r])
  );
  const readinessReqByKey = new Map(
    readinessReqs.map((r) => [r.capability_requirement.key, r])
  );

  const requirement_aggregation_assessments = evalReqs.map((evalReq) => {
    const policyReq = policyReqByKey.get(evalReq.capability_requirement.key);
    const readinessReq = readinessReqByKey.get(
      evalReq.capability_requirement.key
    );
    if (!policyReq || !readinessReq) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX} for candidate ${candidate_key}: missing requirement ${evalReq.capability_requirement.key}`
      );
    }
    return assessRequirementDimensionAggregationResult(
      evalReq,
      policyReq,
      readinessReq
    );
  });

  for (const assessment of requirement_aggregation_assessments) {
    assertAggregationResultAssessmentInvariant(assessment);
  }

  if (
    !hasAnyNonEmptyDomainOrAggregationContext(
      requirement_aggregation_assessments
    )
  ) {
    return {
      candidate_key,
      required_dimension_evaluation_state_assessment: evaluationStateAssessment,
      requirement_dimension_aggregation_policy_assessment:
        aggregationPolicyAssessment,
      requirement_dimension_aggregation_readiness_assessment:
        readinessAssessment,
      status: allRequirementsHaveEmptyRequiredDimensions(
        requirement_aggregation_assessments
      )
        ? "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
        : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES",
      requirement_aggregation_assessments,
      has_capability_requirement_dimension_aggregation_result: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS,
      ],
    };
  }

  const has_capability_requirement_dimension_aggregation_result =
    hasAnyAggregationResult(requirement_aggregation_assessments);

  return {
    candidate_key,
    required_dimension_evaluation_state_assessment: evaluationStateAssessment,
    requirement_dimension_aggregation_policy_assessment:
      aggregationPolicyAssessment,
    requirement_dimension_aggregation_readiness_assessment: readinessAssessment,
    status: has_capability_requirement_dimension_aggregation_result
      ? "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_PRESENT"
      : "NO_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULTS_REPRESENTED",
    requirement_aggregation_assessments,
    has_capability_requirement_dimension_aggregation_result,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateAggregationResult(
  assessments: AttentionCandidateObservationCapabilityRequirementDimensionAggregationResultAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_requirement_dimension_aggregation_result) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Requirement Dimension Aggregation Result composition.
 * Does not derive Capability Requirement Satisfaction / Unsatisfaction.
 */
export function buildAttentionObservationCapabilityRequirementDimensionAggregationResultSet(
  input: AttentionObservationCapabilityRequirementDimensionAggregationResultInput
): AttentionObservationCapabilityRequirementDimensionAggregationResultSetAssessment {
  const evaluationStateSet =
    input.capability_required_dimension_evaluation_state_set;
  const aggregationPolicySet =
    input.capability_requirement_dimension_aggregation_policy_set;
  const readinessSet =
    input.capability_requirement_dimension_aggregation_readiness_set;

  assertCompatibleCapabilityRequirementDimensionAggregationResultContexts(
    evaluationStateSet,
    aggregationPolicySet,
    readinessSet
  );

  const policyByKey = new Map(
    aggregationPolicySet.candidate_assessments.map((c) => [c.candidate_key, c])
  );
  const readinessByKey = new Map(
    readinessSet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  const candidate_assessments =
    evaluationStateSet.candidate_assessments.map((evalCandidate) => {
      const policyCandidate = policyByKey.get(evalCandidate.candidate_key)!;
      const readinessCandidate = readinessByKey.get(
        evalCandidate.candidate_key
      )!;
      return assessAttentionCandidateObservationCapabilityRequirementDimensionAggregationResult(
        evalCandidate,
        policyCandidate,
        readinessCandidate
      );
    });

  return {
    capability_required_dimension_evaluation_state_set: evaluationStateSet,
    capability_requirement_dimension_aggregation_policy_set:
      aggregationPolicySet,
    capability_requirement_dimension_aggregation_readiness_set: readinessSet,
    candidate_assessments,
    has_capability_requirement_dimension_aggregation_result:
      hasAnyCandidateAggregationResult(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_MODEL_LIMITATIONS,
    ],
  };
}
