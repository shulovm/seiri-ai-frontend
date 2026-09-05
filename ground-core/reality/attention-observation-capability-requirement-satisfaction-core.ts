/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Satisfaction
 * State (GROUND-075).
 *
 * Pure normalization of GROUND-074 Satisfaction Interpretation Basis.
 *
 * Must not import GROUND-048–073 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * SATISFIED / UNSATISFIED are explicit-policy-derived only.
 * policy absent ≠ UNSATISFIED
 * current-state unmapped ≠ UNSATISFIED
 * SATISFIED ≠ effective Capability / Permission / Resource / can_execute
 */

import type {
  AttentionObservationCapabilityRequirementSatisfactionInterpretation,
} from "./attention-observation-capability-requirement-satisfaction-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationSetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationStatus,
} from "./attention-observation-capability-requirement-satisfaction-interpretation-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionAssessment,
  AttentionObservationCapabilityRequirementSatisfactionCandidateStatus,
  AttentionObservationCapabilityRequirementSatisfactionInput,
  AttentionObservationCapabilityRequirementSatisfactionModelLimitation,
  AttentionObservationCapabilityRequirementSatisfactionSetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionState,
  AttentionObservationCapabilityRequirementSatisfactionStateBasis,
} from "./attention-observation-capability-requirement-satisfaction-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementSatisfactionModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_HISTORY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_PERSISTENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_PROVENANCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_AUTHORITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_INHERITANCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_DEFAULTS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_RESULT_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
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

export function attentionObservationCapabilityRequirementSatisfactionStateKey(
  capabilityRequirementKey: string,
  requirementEvaluationStateBasisKey: string,
  satisfactionState: AttentionObservationCapabilityRequirementSatisfactionState,
  interpretationBasisKey: string | null,
  interpretationPolicyKey: string | null
): string {
  return [
    "attention-observation-capability-requirement-satisfaction-state",
    capabilityRequirementKey,
    requirementEvaluationStateBasisKey,
    satisfactionState,
    interpretationBasisKey ?? "none",
    interpretationPolicyKey ?? "none",
  ].join("|");
}

function assertInterpretationBasisPresentInvariant(
  assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment
): void {
  if (
    assessment.status ===
    "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT"
  ) {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Satisfaction Interpretation Basis invariant violated: PRESENT requires non-null basis for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    return;
  }

  if (assessment.interpretation_basis !== null) {
    throw new Error(
      `Satisfaction Interpretation Basis invariant violated: non-present status requires null basis for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function assertPolicyAbsenceInvariant(
  assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment
): void {
  const policyAssessment =
    assessment.satisfaction_interpretation_policy_assessment;
  if (
    policyAssessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.satisfaction_interpretation_policy !== null
  ) {
    throw new Error(
      `Satisfaction State invariant violated: policy-absence status must not carry policy PRESENT for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function assertNoMappingInvariant(
  assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment
): void {
  const policyAssessment =
    assessment.satisfaction_interpretation_policy_assessment;
  if (
    policyAssessment.status !==
      "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.satisfaction_interpretation_policy === null
  ) {
    throw new Error(
      `Satisfaction State invariant violated: no-mapping status requires explicit Satisfaction Interpretation Policy PRESENT for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function mapInterpretationToSatisfactionState(
  interpretation: AttentionObservationCapabilityRequirementSatisfactionInterpretation
): AttentionObservationCapabilityRequirementSatisfactionState {
  switch (interpretation) {
    case "INTERPRET_AS_SATISFIED":
      return "SATISFIED";
    case "INTERPRET_AS_UNSATISFIED":
      return "UNSATISFIED";
  }
}

/**
 * Exhaustive 074 → 075 semantic mapping. No fallback coercion.
 */
export function mapSatisfactionInterpretationAssessmentToSatisfactionState(
  assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment
): AttentionObservationCapabilityRequirementSatisfactionState {
  assertInterpretationBasisPresentInvariant(assessment);

  const status: AttentionObservationCapabilityRequirementSatisfactionInterpretationStatus =
    assessment.status;

  switch (status) {
    case "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED":
      assertPolicyAbsenceInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY";

    case "NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE":
      assertNoMappingInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE";

    case "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_BASIS_PRESENT":
      return mapInterpretationToSatisfactionState(
        assessment.interpretation_basis!.interpretation
      );
  }
}

function buildSatisfactionStateBasis(
  assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  satisfactionState: AttentionObservationCapabilityRequirementSatisfactionState
): AttentionObservationCapabilityRequirementSatisfactionStateBasis {
  const evaluationStateBasisKey =
    assessment.requirement_evaluation_assessment.evaluation_state_basis.key;
  const interpretationBasis = assessment.interpretation_basis;
  const policy =
    assessment.satisfaction_interpretation_policy_assessment
      .satisfaction_interpretation_policy;

  let interpretationBasisKey: string | null = null;
  let interpretationPolicyKey: string | null = null;

  if (
    satisfactionState === "SATISFIED" ||
    satisfactionState === "UNSATISFIED"
  ) {
    if (interpretationBasis === null) {
      throw new Error(
        `Satisfaction State invariant violated: ${satisfactionState} requires non-null Interpretation Basis for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    if (
      interpretationBasis.requirement_evaluation_state_basis_key !==
      evaluationStateBasisKey
    ) {
      throw new Error(
        `Stale Satisfaction Interpretation Basis for capability requirement ${assessment.capability_requirement.key}: Interpretation Basis Evaluation State key differs from embedded current Evaluation State Basis`
      );
    }
    if (
      satisfactionState === "SATISFIED" &&
      interpretationBasis.interpretation !== "INTERPRET_AS_SATISFIED"
    ) {
      throw new Error(
        `Satisfaction State invariant violated: SATISFIED requires INTERPRET_AS_SATISFIED basis for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    if (
      satisfactionState === "UNSATISFIED" &&
      interpretationBasis.interpretation !== "INTERPRET_AS_UNSATISFIED"
    ) {
      throw new Error(
        `Satisfaction State invariant violated: UNSATISFIED requires INTERPRET_AS_UNSATISFIED basis for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    interpretationBasisKey = interpretationBasis.key;
    interpretationPolicyKey =
      interpretationBasis.satisfaction_interpretation_policy_key;
  } else if (
    satisfactionState ===
    "UNRESOLVED_NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY"
  ) {
    if (interpretationBasis !== null || policy !== null) {
      throw new Error(
        `Satisfaction State invariant violated: policy-absence state must not carry interpretation basis or policy for capability requirement ${assessment.capability_requirement.key}`
      );
    }
  } else if (
    satisfactionState ===
    "UNRESOLVED_NO_EXPLICIT_SATISFACTION_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_EVALUATION_STATE"
  ) {
    if (interpretationBasis !== null) {
      throw new Error(
        `Satisfaction State invariant violated: no-mapping state requires null Interpretation Basis for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    if (policy === null) {
      throw new Error(
        `Satisfaction State invariant violated: no-mapping state requires non-null Satisfaction Interpretation Policy for capability requirement ${assessment.capability_requirement.key}`
      );
    }
    interpretationPolicyKey = policy.key;
  }

  return {
    key: attentionObservationCapabilityRequirementSatisfactionStateKey(
      assessment.capability_requirement.key,
      evaluationStateBasisKey,
      satisfactionState,
      interpretationBasisKey,
      interpretationPolicyKey
    ),
    capability_requirement_key: assessment.capability_requirement.key,
    observation_need_key:
      assessment.capability_requirement.observation_need_key,
    requirement_evaluation_state_basis_key: evaluationStateBasisKey,
    satisfaction_state: satisfactionState,
    satisfaction_interpretation_basis_key: interpretationBasisKey,
    satisfaction_interpretation_policy_key: interpretationPolicyKey,
  };
}

function assessRequirementSatisfaction(
  interpretationAssessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationAssessment
): AttentionObservationCapabilityRequirementSatisfactionAssessment {
  const satisfactionState =
    mapSatisfactionInterpretationAssessmentToSatisfactionState(
      interpretationAssessment
    );

  return {
    capability_requirement: interpretationAssessment.capability_requirement,
    satisfaction_interpretation_assessment: interpretationAssessment,
    satisfaction_state_basis: buildSatisfactionStateBasis(
      interpretationAssessment,
      satisfactionState
    ),
  };
}

function resolveCandidateSatisfactionStatus(
  interpretationAssessment: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment,
  hasSatisfactionStates: boolean
): AttentionObservationCapabilityRequirementSatisfactionCandidateStatus {
  if (
    interpretationAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
  }
  if (
    interpretationAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
  }
  if (!hasSatisfactionStates) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
  }
  return "CAPABILITY_REQUIREMENT_SATISFACTION_STATES_PRESENT";
}

export function assessAttentionCandidateObservationCapabilityRequirementSatisfaction(
  interpretationAssessment: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationAssessment
): AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment {
  const requirement_satisfaction_assessments =
    interpretationAssessment.requirement_satisfaction_interpretation_assessments.map(
      assessRequirementSatisfaction
    );

  const has_capability_requirement_satisfaction_states =
    requirement_satisfaction_assessments.length > 0;

  return {
    candidate_key: interpretationAssessment.candidate_key,
    satisfaction_interpretation_assessment: interpretationAssessment,
    status: resolveCandidateSatisfactionStatus(
      interpretationAssessment,
      has_capability_requirement_satisfaction_states
    ),
    requirement_satisfaction_assessments,
    has_capability_requirement_satisfaction_states,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateSatisfactionStates(
  assessments: AttentionCandidateObservationCapabilityRequirementSatisfactionAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_requirement_satisfaction_states) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Capability Requirement Satisfaction State composition.
 * Does not derive Capability truth / effective Capability / Permission / Resource.
 */
export function buildAttentionObservationCapabilityRequirementSatisfactionSet(
  input: AttentionObservationCapabilityRequirementSatisfactionInput
): AttentionObservationCapabilityRequirementSatisfactionSetAssessment {
  const interpretationSet: AttentionObservationCapabilityRequirementSatisfactionInterpretationSetAssessment =
    input.capability_requirement_satisfaction_interpretation_set;

  const candidate_assessments = interpretationSet.candidate_assessments.map(
    assessAttentionCandidateObservationCapabilityRequirementSatisfaction
  );

  return {
    capability_requirement_satisfaction_interpretation_set: interpretationSet,
    candidate_assessments,
    has_capability_requirement_satisfaction_states:
      hasAnyCandidateSatisfactionStates(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_MODEL_LIMITATIONS,
    ],
  };
}
