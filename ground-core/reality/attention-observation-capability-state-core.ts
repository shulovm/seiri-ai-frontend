/**
 * Reality Core v0.7 — Attention Observation Capability State (GROUND-083).
 *
 * Pure normalization of GROUND-082 Capability Interpretation Basis.
 *
 * Must not import GROUND-048–081 runtime cores directly.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, persisted
 * project state, GROUND-041–045, Permission, Authority, Resource.
 *
 * CAPABILITY_PRESENT / CAPABILITY_ABSENT are explicit-policy-derived only.
 * policy absent ≠ CAPABILITY_ABSENT
 * current-state unmapped ≠ CAPABILITY_ABSENT
 * CAPABILITY_PRESENT ≠ effective Capability / Permission / Resource / can_execute
 * HAS_CAPABILITY / LACKS_CAPABILITY vocabulary is not used
 */

import type {
  AttentionObservationCapabilityInterpretation,
} from "./attention-observation-capability-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityInterpretationAssessment,
  AttentionObservationCapabilityInterpretationSetAssessment,
  AttentionObservationCapabilityInterpretationStatus,
} from "./attention-observation-capability-interpretation-types.js";
import type {
  AttentionCandidateObservationCapabilityStateAssessment,
  AttentionObservationCapabilityState,
  AttentionObservationCapabilityStateBasis,
  AttentionObservationCapabilityStateInput,
  AttentionObservationCapabilityStateModelLimitation,
  AttentionObservationCapabilityStateSetAssessment,
} from "./attention-observation-capability-state-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_STATE_MODEL_LIMITATIONS: AttentionObservationCapabilityStateModelLimitation[] =
  [
    "CAPABILITY_TRUTH_BOOLEAN_NOT_MODELED",
    "CAPABILITY_UNIVERSAL_POSSESSION_NOT_MODELED",
    "CAPABILITY_UNIVERSAL_INCAPABILITY_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_STATE_PROVENANCE_NOT_MODELED",
    "CAPABILITY_STATE_AUTHORITY_NOT_MODELED",
    "CAPABILITY_STATE_HISTORY_NOT_MODELED",
    "CAPABILITY_STATE_PERSISTENCE_NOT_MODELED",
    "CAPABILITY_STATE_PARTIALITY_NOT_MODELED",
    "ZERO_CAPABILITY_REQUIREMENT_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_DEFAULTS_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_INHERITANCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_PROVENANCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_AUTHORITY_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function attentionObservationCapabilityStateKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  requirementSetEvaluationStateBasisKey: string,
  capabilityState: AttentionObservationCapabilityState,
  capabilityInterpretationBasisKey: string | null,
  capabilityInterpretationPolicyKey: string | null
): string {
  return [
    "attention-observation-capability-state",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    requirementSetEvaluationStateBasisKey,
    capabilityState,
    capabilityInterpretationBasisKey ?? "none",
    capabilityInterpretationPolicyKey ?? "none",
  ].join("|");
}

function assertInterpretationBasisPresentInvariant(
  assessment: AttentionCandidateObservationCapabilityInterpretationAssessment
): void {
  if (assessment.status === "CAPABILITY_INTERPRETATION_BASIS_PRESENT") {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Capability Interpretation Basis invariant violated: PRESENT requires non-null basis for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED" ||
    assessment.status ===
      "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE"
  ) {
    if (assessment.interpretation_basis !== null) {
      throw new Error(
        `Capability Interpretation Basis invariant violated: non-present status requires null basis for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function assertPolicyAbsenceInvariant(
  assessment: AttentionCandidateObservationCapabilityInterpretationAssessment
): void {
  const policyAssessment =
    assessment.capability_interpretation_policy_assessment;
  if (
    policyAssessment.status ===
      "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.capability_interpretation_policy !== null
  ) {
    throw new Error(
      `Capability State invariant violated: policy-absence status must not carry policy PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function assertNoMappingInvariant(
  assessment: AttentionCandidateObservationCapabilityInterpretationAssessment
): void {
  const policyAssessment =
    assessment.capability_interpretation_policy_assessment;
  if (
    policyAssessment.status !==
      "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.capability_interpretation_policy === null
  ) {
    throw new Error(
      `Capability State invariant violated: no-mapping status requires explicit Capability Interpretation Policy PRESENT for candidate ${assessment.candidate_key}`
    );
  }
}

function mapInterpretationToCapabilityState(
  interpretation: AttentionObservationCapabilityInterpretation
): AttentionObservationCapabilityState {
  switch (interpretation) {
    case "INTERPRET_AS_CAPABILITY_PRESENT":
      return "CAPABILITY_PRESENT";
    case "INTERPRET_AS_CAPABILITY_ABSENT":
      return "CAPABILITY_ABSENT";
  }
}

/**
 * Exhaustive 082 → 083 semantic mapping for non-empty Requirement-set contexts.
 * No fallback coercion. Outer NOT_APPLICABLE Candidate statuses are handled separately.
 */
export function mapCapabilityInterpretationAssessmentToCapabilityState(
  assessment: AttentionCandidateObservationCapabilityInterpretationAssessment
): AttentionObservationCapabilityState {
  assertInterpretationBasisPresentInvariant(assessment);

  const status: AttentionObservationCapabilityInterpretationStatus =
    assessment.status;

  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      throw new Error(
        `Capability State invariant violated: outer Candidate NOT_APPLICABLE status ${status} has no Capability State domain for candidate ${assessment.candidate_key}`
      );

    case "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED":
      assertPolicyAbsenceInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY";

    case "NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE":
      assertNoMappingInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE";

    case "CAPABILITY_INTERPRETATION_BASIS_PRESENT":
      return mapInterpretationToCapabilityState(
        assessment.interpretation_basis!.interpretation
      );
  }
}

function resolveEmbeddedEvaluationStateContext(
  assessment: AttentionCandidateObservationCapabilityInterpretationAssessment
): {
  observation_need_key: string;
  capability_requirement_set_key: string;
  requirement_set_evaluation_state_basis_key: string;
} {
  const evalBasis =
    assessment.capability_requirement_set_evaluation_state_assessment
      .evaluation_state_basis;
  if (evalBasis === null) {
    throw new Error(
      `Capability State invariant violated: non-empty Capability State domain requires Evaluation State Basis for candidate ${assessment.candidate_key}`
    );
  }

  return {
    observation_need_key: evalBasis.observation_need_key,
    capability_requirement_set_key: evalBasis.capability_requirement_set_key,
    requirement_set_evaluation_state_basis_key: evalBasis.key,
  };
}

function buildCapabilityStateBasis(
  assessment: AttentionCandidateObservationCapabilityInterpretationAssessment,
  capabilityState: AttentionObservationCapabilityState
): AttentionObservationCapabilityStateBasis {
  const context = resolveEmbeddedEvaluationStateContext(assessment);
  const interpretationBasis = assessment.interpretation_basis;
  const policy =
    assessment.capability_interpretation_policy_assessment
      .capability_interpretation_policy;

  let interpretationBasisKey: string | null = null;
  let interpretationPolicyKey: string | null = null;

  if (
    capabilityState === "CAPABILITY_PRESENT" ||
    capabilityState === "CAPABILITY_ABSENT"
  ) {
    if (interpretationBasis === null) {
      throw new Error(
        `Capability State invariant violated: ${capabilityState} requires non-null Interpretation Basis for candidate ${assessment.candidate_key}`
      );
    }
    if (
      interpretationBasis.requirement_set_evaluation_state_basis_key !==
      context.requirement_set_evaluation_state_basis_key
    ) {
      throw new Error(
        `Stale Capability Interpretation Basis for candidate ${assessment.candidate_key}: Interpretation Basis Evaluation State key differs from embedded current Evaluation State Basis`
      );
    }
    if (
      capabilityState === "CAPABILITY_PRESENT" &&
      interpretationBasis.interpretation !== "INTERPRET_AS_CAPABILITY_PRESENT"
    ) {
      throw new Error(
        `Capability State invariant violated: CAPABILITY_PRESENT requires INTERPRET_AS_CAPABILITY_PRESENT basis for candidate ${assessment.candidate_key}`
      );
    }
    if (
      capabilityState === "CAPABILITY_ABSENT" &&
      interpretationBasis.interpretation !== "INTERPRET_AS_CAPABILITY_ABSENT"
    ) {
      throw new Error(
        `Capability State invariant violated: CAPABILITY_ABSENT requires INTERPRET_AS_CAPABILITY_ABSENT basis for candidate ${assessment.candidate_key}`
      );
    }
    interpretationBasisKey = interpretationBasis.key;
    interpretationPolicyKey =
      interpretationBasis.capability_interpretation_policy_key;
  } else if (
    capabilityState === "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY"
  ) {
    if (interpretationBasis !== null || policy !== null) {
      throw new Error(
        `Capability State invariant violated: policy-absence state must not carry interpretation basis or policy for candidate ${assessment.candidate_key}`
      );
    }
  } else if (
    capabilityState ===
    "UNRESOLVED_NO_EXPLICIT_CAPABILITY_INTERPRETATION_MAPPING_FOR_CURRENT_REQUIREMENT_SET_EVALUATION_STATE"
  ) {
    if (interpretationBasis !== null) {
      throw new Error(
        `Capability State invariant violated: no-mapping state requires null Interpretation Basis for candidate ${assessment.candidate_key}`
      );
    }
    if (policy === null) {
      throw new Error(
        `Capability State invariant violated: no-mapping state requires non-null Capability Interpretation Policy for candidate ${assessment.candidate_key}`
      );
    }
    interpretationPolicyKey = policy.key;
  }

  return {
    key: attentionObservationCapabilityStateKey(
      assessment.candidate_key,
      context.observation_need_key,
      context.capability_requirement_set_key,
      context.requirement_set_evaluation_state_basis_key,
      capabilityState,
      interpretationBasisKey,
      interpretationPolicyKey
    ),
    candidate_key: assessment.candidate_key,
    observation_need_key: context.observation_need_key,
    capability_requirement_set_key: context.capability_requirement_set_key,
    requirement_set_evaluation_state_basis_key:
      context.requirement_set_evaluation_state_basis_key,
    capability_state: capabilityState,
    capability_interpretation_basis_key: interpretationBasisKey,
    capability_interpretation_policy_key: interpretationPolicyKey,
  };
}

/**
 * Pure Candidate-level Capability State composition.
 * Does not derive HAS_CAPABILITY / effective Capability / Permission / Resource.
 */
export function assessAttentionCandidateObservationCapabilityState(
  interpretationAssessment: AttentionCandidateObservationCapabilityInterpretationAssessment
): AttentionCandidateObservationCapabilityStateAssessment {
  if (
    interpretationAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return {
      candidate_key: interpretationAssessment.candidate_key,
      capability_interpretation_assessment: interpretationAssessment,
      status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
      capability_state_basis: null,
      has_capability_state: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_STATE_MODEL_LIMITATIONS,
      ],
    };
  }

  if (
    interpretationAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return {
      candidate_key: interpretationAssessment.candidate_key,
      capability_interpretation_assessment: interpretationAssessment,
      status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
      capability_state_basis: null,
      has_capability_state: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_STATE_MODEL_LIMITATIONS,
      ],
    };
  }

  const capabilityState =
    mapCapabilityInterpretationAssessmentToCapabilityState(
      interpretationAssessment
    );
  const capability_state_basis = buildCapabilityStateBasis(
    interpretationAssessment,
    capabilityState
  );

  return {
    candidate_key: interpretationAssessment.candidate_key,
    capability_interpretation_assessment: interpretationAssessment,
    status: "CAPABILITY_STATE_BASIS_PRESENT",
    capability_state_basis,
    has_capability_state: true,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_STATE_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateCapabilityStates(
  assessments: AttentionCandidateObservationCapabilityStateAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_capability_state) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Capability State composition.
 * Does not derive HAS_CAPABILITY / effective Capability / Permission / Resource.
 */
export function buildAttentionObservationCapabilityStateSet(
  input: AttentionObservationCapabilityStateInput
): AttentionObservationCapabilityStateSetAssessment {
  const interpretationSet: AttentionObservationCapabilityInterpretationSetAssessment =
    input.capability_interpretation_set;

  const candidate_assessments = interpretationSet.candidate_assessments.map(
    assessAttentionCandidateObservationCapabilityState
  );

  return {
    capability_interpretation_set: interpretationSet,
    candidate_assessments,
    has_capability_states:
      hasAnyCandidateCapabilityStates(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_STATE_MODEL_LIMITATIONS,
    ],
  };
}
