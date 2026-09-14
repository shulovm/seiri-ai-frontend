/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Set
 * Evaluation State (GROUND-080).
 *
 * Pure normalization of GROUND-079 Capability Requirement Set Composition Result.
 *
 * Must not import GROUND-048–078 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, persisted project
 * state, GROUND-041–045, Permission, Authority, Resource, composition/readiness classifiers.
 *
 * composition HOLDS ≠ HAS_CAPABILITY
 * composition DOES_NOT_HOLD ≠ LACKS_CAPABILITY
 * readiness DOES_NOT_HOLD ≠ composition DOES_NOT_HOLD
 */

import type {
  AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment,
  AttentionObservationCapabilityRequirementSetCompositionOutcome,
  AttentionObservationCapabilityRequirementSetCompositionSetAssessment,
  AttentionObservationCapabilityRequirementSetCompositionStatus,
} from "./attention-observation-capability-requirement-set-composition-result-types.js";
import { buildAttentionObservationCapabilityRequirementSetKey } from "./attention-observation-capability-requirement-set-identity.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment,
  AttentionObservationCapabilityRequirementSetEvaluationState,
  AttentionObservationCapabilityRequirementSetEvaluationStateBasis,
  AttentionObservationCapabilityRequirementSetEvaluationStateCandidateStatus,
  AttentionObservationCapabilityRequirementSetEvaluationStateInput,
  AttentionObservationCapabilityRequirementSetEvaluationStateModelLimitation,
  AttentionObservationCapabilityRequirementSetEvaluationStateSetAssessment,
} from "./attention-observation-capability-requirement-set-evaluation-state-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementSetEvaluationStateModelLimitation[] =
  [
    "CAPABILITY_COMPOSITION_INTERPRETATION_POLICY_NOT_MODELED",
    "CAPABILITY_COMPOSITION_INTERPRETATION_BASIS_NOT_MODELED",
    "CAPABILITY_STATE_NOT_MODELED",
    "CAPABILITY_TRUTH_NOT_MODELED",
    "CAPABILITY_ABSENCE_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PROVENANCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_AUTHORITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_HISTORY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PERSISTENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_ZERO_REQUIREMENT_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_READINESS_POLICY_ABSENCE_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_READINESS_DOES_NOT_HOLD_FINAL_SEMANTICS_NOT_MODELED",
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

export function attentionObservationCapabilityRequirementSetEvaluationStateKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  state: AttentionObservationCapabilityRequirementSetEvaluationState,
  compositionResultBasisKey: string | null,
  readinessBasisKey: string | null
): string {
  return [
    "attention-observation-capability-requirement-set-evaluation-state",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    state,
    compositionResultBasisKey ?? "none",
    readinessBasisKey ?? "none",
  ].join("|");
}

function assertCompositionResultPresentInvariant(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment
): void {
  if (
    assessment.status ===
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT"
  ) {
    if (assessment.composition_result_basis === null) {
      throw new Error(
        `Requirement Set Evaluation State invariant violated: RESULT_PRESENT requires non-null composition result basis for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY" ||
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY" ||
    assessment.status ===
      "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    if (assessment.composition_result_basis !== null) {
      throw new Error(
        `Requirement Set Evaluation State invariant violated: non-result status requires null composition result basis for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function assertReadinessDoesNotHoldLineage(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment
): void {
  const readiness =
    assessment.capability_requirement_set_composition_readiness_assessment;
  if (
    readiness.status !==
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT"
  ) {
    throw new Error(
      `Requirement Set Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires readiness basis PRESENT for candidate ${assessment.candidate_key}`
    );
  }
  if (readiness.readiness_basis === null) {
    throw new Error(
      `Requirement Set Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires non-null readiness basis for candidate ${assessment.candidate_key}`
    );
  }
  if (
    readiness.readiness_basis.outcome !==
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    throw new Error(
      `Requirement Set Evaluation State invariant violated: readiness DOES_NOT_HOLD status requires readiness outcome DOES_NOT_HOLD for candidate ${assessment.candidate_key}`
    );
  }
}

function assertMissingReadinessPolicyInvariant(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment
): void {
  const readiness =
    assessment.capability_requirement_set_composition_readiness_assessment;
  if (
    readiness.status ===
      "CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_BASIS_PRESENT" ||
    readiness.readiness_basis !== null
  ) {
    throw new Error(
      `Requirement Set Evaluation State invariant violated: missing readiness policy status must not carry readiness basis PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function assertMissingCompositionPolicyInvariant(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment
): void {
  const policy =
    assessment.capability_requirement_set_composition_policy_assessment;
  if (
    policy.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_PRESENT" ||
    policy.capability_requirement_set_composition_policy !== null
  ) {
    throw new Error(
      `Requirement Set Evaluation State invariant violated: missing composition policy status must not claim Composition Policy PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function mapCompositionOutcomeToEvaluationState(
  outcome: AttentionObservationCapabilityRequirementSetCompositionOutcome
): AttentionObservationCapabilityRequirementSetEvaluationState {
  switch (outcome) {
    case "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_HOLDS":
      return "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS";
    case "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_CONDITION_DOES_NOT_HOLD":
      return "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD";
  }
}

/**
 * Exhaustive 079 → 080 semantic mapping for non-empty Requirement-set contexts.
 * No fallback coercion. Outer NOT_APPLICABLE Candidate statuses are handled separately.
 */
export function mapCapabilityRequirementSetCompositionAssessmentToEvaluationState(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment
): AttentionObservationCapabilityRequirementSetEvaluationState {
  assertCompositionResultPresentInvariant(assessment);

  const status: AttentionObservationCapabilityRequirementSetCompositionStatus =
    assessment.status;

  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      throw new Error(
        `Requirement Set Evaluation State invariant violated: outer Candidate NOT_APPLICABLE status ${status} has no set Evaluation State domain for candidate ${assessment.candidate_key}`
      );

    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY":
      assertMissingCompositionPolicyInvariant(assessment);
      return "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_DECLARED";

    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY":
      assertMissingReadinessPolicyInvariant(assessment);
      return "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED";

    case "NOT_APPLICABLE_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD":
      assertReadinessDoesNotHoldLineage(assessment);
      return "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

    case "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_PRESENT":
      return mapCompositionOutcomeToEvaluationState(
        assessment.composition_result_basis!.outcome
      );
  }
}

function resolveSetContext(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment
): {
  observation_need_key: string;
  capability_requirement_set_key: string;
} {
  const result = assessment.composition_result_basis;
  if (result !== null) {
    return {
      observation_need_key: result.observation_need_key,
      capability_requirement_set_key: result.capability_requirement_set_key,
    };
  }

  const readiness =
    assessment.capability_requirement_set_composition_readiness_assessment
      .readiness_basis;
  if (readiness !== null) {
    return {
      observation_need_key: readiness.observation_need_key,
      capability_requirement_set_key: readiness.capability_requirement_set_key,
    };
  }

  const policy =
    assessment.capability_requirement_set_composition_policy_assessment
      .capability_requirement_set_composition_policy;
  if (policy !== null) {
    return {
      observation_need_key: policy.observation_need_key,
      capability_requirement_set_key: policy.capability_requirement_set_key,
    };
  }

  const requirementAssessments =
    assessment.capability_requirement_satisfaction_assessment
      .requirement_satisfaction_assessments;
  if (requirementAssessments.length === 0) {
    throw new Error(
      `Requirement Set Evaluation State invariant violated: non-empty Requirement-set Evaluation State requires Requirement context for candidate ${assessment.candidate_key}`
    );
  }

  const observationNeedKey =
    requirementAssessments[0]!.capability_requirement.observation_need_key;
  const requirementKeys = requirementAssessments.map(
    (item) => item.capability_requirement.key
  );

  return {
    observation_need_key: observationNeedKey,
    capability_requirement_set_key:
      buildAttentionObservationCapabilityRequirementSetKey(
        assessment.candidate_key,
        observationNeedKey,
        requirementKeys
      ),
  };
}

function buildEvaluationStateBasis(
  assessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment,
  state: AttentionObservationCapabilityRequirementSetEvaluationState
): AttentionObservationCapabilityRequirementSetEvaluationStateBasis {
  const compositionResultBasisKey =
    assessment.composition_result_basis?.key ?? null;
  const readinessBasisKey =
    assessment.capability_requirement_set_composition_readiness_assessment
      .readiness_basis?.key ?? null;

  if (
    state === "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS" ||
    state === "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD"
  ) {
    if (compositionResultBasisKey === null) {
      throw new Error(
        `Requirement Set Evaluation State invariant violated: resolved composition state ${state} requires composition result basis key for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    state ===
    "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    if (compositionResultBasisKey !== null) {
      throw new Error(
        `Requirement Set Evaluation State invariant violated: readiness-unresolved state requires null composition result basis key for candidate ${assessment.candidate_key}`
      );
    }
    if (readinessBasisKey === null) {
      throw new Error(
        `Requirement Set Evaluation State invariant violated: readiness-unresolved state requires readiness basis key for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (
    state ===
      "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED" &&
    readinessBasisKey !== null
  ) {
    throw new Error(
      `Requirement Set Evaluation State invariant violated: missing readiness policy state must not synthesize readiness basis key for candidate ${assessment.candidate_key}`
    );
  }

  if (
    (state ===
      "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_DECLARED" ||
      state ===
        "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED") &&
    compositionResultBasisKey !== null
  ) {
    throw new Error(
      `Requirement Set Evaluation State invariant violated: missing-policy state ${state} must not carry composition result basis key for candidate ${assessment.candidate_key}`
    );
  }

  const context = resolveSetContext(assessment);

  return {
    key: attentionObservationCapabilityRequirementSetEvaluationStateKey(
      assessment.candidate_key,
      context.observation_need_key,
      context.capability_requirement_set_key,
      state,
      compositionResultBasisKey,
      readinessBasisKey
    ),
    candidate_key: assessment.candidate_key,
    observation_need_key: context.observation_need_key,
    capability_requirement_set_key: context.capability_requirement_set_key,
    state,
    requirement_set_composition_result_basis_key: compositionResultBasisKey,
    requirement_set_composition_readiness_basis_key: readinessBasisKey,
  };
}

/**
 * Pure Candidate-level Capability Requirement Set Evaluation State composition.
 * Does not derive Capability truth / absence / effective Capability.
 */
export function assessAttentionCandidateObservationCapabilityRequirementSetEvaluationState(
  compositionAssessment: AttentionCandidateObservationCapabilityRequirementSetCompositionAssessment
): AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment {
  if (
    compositionAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return {
      candidate_key: compositionAssessment.candidate_key,
      capability_requirement_set_composition_assessment: compositionAssessment,
      status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
      evaluation_state_basis: null,
      has_capability_requirement_set_evaluation_state: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_MODEL_LIMITATIONS,
      ],
    };
  }

  if (
    compositionAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return {
      candidate_key: compositionAssessment.candidate_key,
      capability_requirement_set_composition_assessment: compositionAssessment,
      status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
      evaluation_state_basis: null,
      has_capability_requirement_set_evaluation_state: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_MODEL_LIMITATIONS,
      ],
    };
  }

  const state =
    mapCapabilityRequirementSetCompositionAssessmentToEvaluationState(
      compositionAssessment
    );
  const evaluation_state_basis = buildEvaluationStateBasis(
    compositionAssessment,
    state
  );

  return {
    candidate_key: compositionAssessment.candidate_key,
    capability_requirement_set_composition_assessment: compositionAssessment,
    status: "CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_PRESENT",
    evaluation_state_basis,
    has_capability_requirement_set_evaluation_state: true,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateSetEvaluationStates(
  assessments: AttentionCandidateObservationCapabilityRequirementSetEvaluationStateAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_requirement_set_evaluation_state) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Capability Requirement Set Evaluation State composition.
 * Does not derive HAS_CAPABILITY / LACKS_CAPABILITY / effective Capability.
 */
export function buildAttentionObservationCapabilityRequirementSetEvaluationStateSet(
  input: AttentionObservationCapabilityRequirementSetEvaluationStateInput
): AttentionObservationCapabilityRequirementSetEvaluationStateSetAssessment {
  const compositionSet: AttentionObservationCapabilityRequirementSetCompositionSetAssessment =
    input.capability_requirement_set_composition_set;

  const candidate_assessments = compositionSet.candidate_assessments.map(
    assessAttentionCandidateObservationCapabilityRequirementSetEvaluationState
  );

  return {
    capability_requirement_set_composition_set: compositionSet,
    candidate_assessments,
    has_capability_requirement_set_evaluation_states:
      hasAnyCandidateSetEvaluationStates(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
