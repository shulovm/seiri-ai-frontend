import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Permission State (GROUND-091).
 *
 * Pure normalization of GROUND-090 Declared Permission Interpretation
 * Assessment / Basis into current context-relative Permission State.
 *
 * Must not import GROUND-024/087/088/089 runtime cores directly.
 * Must not re-match mappings, inspect raw status names for inference,
 * or reopen policy mapping arrays.
 *
 * Forbidden: ProjectState, wall-clock, Feasibility, Decision, Operational
 * Eligibility, effective Permission, can_execute, assignment/selection/execution.
 *
 * PERMISSION_PERMITTED / PERMISSION_PROHIBITED are explicit-policy-derived only.
 * policy absent ≠ PERMISSION_PROHIBITED
 * current raw status unmapped ≠ PERMISSION_PROHIBITED
 * explicit empty policy → no-mapping unresolved
 * CONTESTED interpretation ≠ declaration winner
 * multiple binding Permission States remain independent
 */

import type {
  AttentionObservationDeclaredPermissionInterpretation,
} from "./attention-observation-declared-permission-interpretation-policy-types.js";
import type {
  AttentionCandidateObservationDeclaredPermissionInterpretationAssessment,
  AttentionObservationDeclaredPermissionInterpretationBindingAssessment,
  AttentionObservationDeclaredPermissionInterpretationBindingStatus,
  AttentionObservationDeclaredPermissionInterpretationSetAssessment,
} from "./attention-observation-declared-permission-interpretation-types.js";
import type {
  AttentionCandidateObservationPermissionStateAssessment,
  AttentionObservationPermissionState,
  AttentionObservationPermissionStateBasis,
  AttentionObservationPermissionStateBindingAssessment,
  AttentionObservationPermissionStateCandidateStatus,
  AttentionObservationPermissionStateInput,
  AttentionObservationPermissionStateModelLimitation,
  AttentionObservationPermissionStateSetAssessment,
} from "./attention-observation-permission-state-types.js";

export const ATTENTION_OBSERVATION_PERMISSION_STATE_MODEL_LIMITATIONS: AttentionObservationPermissionStateModelLimitation[] =
  [
    "PERMISSION_EFFECTIVE_STATE_NOT_MODELED",
    "PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED",
    "PERMISSION_DECLARATION_LEVEL_CONFLICT_RESOLUTION_NOT_MODELED",
    "PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "PERMISSION_RECENCY_PRECEDENCE_NOT_MODELED",
    "PERMISSION_STATE_PROVENANCE_NOT_MODELED",
    "PERMISSION_STATE_AUTHORITY_NOT_MODELED",
    "PERMISSION_STATE_HISTORY_NOT_MODELED",
    "PERMISSION_STATE_PERSISTENCE_NOT_MODELED",
    "PERMISSION_STATE_TEMPORAL_VALIDITY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_COVERAGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function attentionObservationPermissionStateKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  permissionContextBindingKey: string,
  currentDeclaredPermissionAssessmentKey: string,
  permissionEvaluationAt: string,
  permissionState: AttentionObservationPermissionState,
  declaredPermissionInterpretationBasisKey: string | null,
  declaredPermissionInterpretationPolicyKey: string | null
): string {
  return [
    "attention-observation-permission-state",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    permissionContextBindingKey,
    currentDeclaredPermissionAssessmentKey,
    temporalInstantKey(permissionEvaluationAt),
    permissionState,
    declaredPermissionInterpretationBasisKey ?? "none",
    declaredPermissionInterpretationPolicyKey ?? "none",
  ].join("|");
}

function assertInterpretationBasisPresentInvariant(
  assessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment
): void {
  if (assessment.status === "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT") {
    if (assessment.interpretation_basis === null) {
      throw new Error(
        `Declared Permission Interpretation Basis invariant violated: PRESENT requires non-null basis for binding ${assessment.permission_context_binding_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED" ||
    assessment.status ===
      "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
  ) {
    if (assessment.interpretation_basis !== null) {
      throw new Error(
        `Declared Permission Interpretation Basis invariant violated: non-present status requires null basis for binding ${assessment.permission_context_binding_key}`
      );
    }
  }
}

function assertPolicyAbsenceInvariant(
  assessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment
): void {
  const policyAssessment =
    assessment.declared_permission_interpretation_policy_assessment;
  if (
    policyAssessment.status ===
      "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.declared_permission_interpretation_policy !== null
  ) {
    throw new Error(
      `Permission State invariant violated: policy-absence status must not carry policy PRESENT for binding ${assessment.permission_context_binding_key}`
    );
  }
}

function assertNoMappingInvariant(
  assessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment
): void {
  const policyAssessment =
    assessment.declared_permission_interpretation_policy_assessment;
  if (
    policyAssessment.status !==
      "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.declared_permission_interpretation_policy === null
  ) {
    throw new Error(
      `Permission State invariant violated: no-mapping status requires explicit Declared Permission Interpretation Policy PRESENT for binding ${assessment.permission_context_binding_key}`
    );
  }
}

function mapInterpretationToPermissionState(
  interpretation: AttentionObservationDeclaredPermissionInterpretation
): AttentionObservationPermissionState {
  switch (interpretation) {
    case "INTERPRET_AS_PERMISSION_PERMITTED":
      return "PERMISSION_PERMITTED";
    case "INTERPRET_AS_PERMISSION_PROHIBITED":
      return "PERMISSION_PROHIBITED";
  }
}

/**
 * Exhaustive 090 binding → 091 Permission State mapping.
 * No fallback coercion. No raw-token name inference.
 */
export function mapDeclaredPermissionInterpretationBindingToPermissionState(
  assessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment
): AttentionObservationPermissionState {
  assertInterpretationBasisPresentInvariant(assessment);

  const status: AttentionObservationDeclaredPermissionInterpretationBindingStatus =
    assessment.status;

  switch (status) {
    case "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED":
      assertPolicyAbsenceInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY";

    case "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS":
      assertNoMappingInvariant(assessment);
      return "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS";

    case "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT":
      return mapInterpretationToPermissionState(
        assessment.interpretation_basis!.interpretation
      );
  }
}

function buildPermissionStateBasis(
  assessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment,
  permissionState: AttentionObservationPermissionState
): AttentionObservationPermissionStateBasis {
  const permissionBinding =
    assessment.declared_permission_binding_assessment;
  const interpretationBasis = assessment.interpretation_basis;
  const policy =
    assessment.declared_permission_interpretation_policy_assessment
      .declared_permission_interpretation_policy;

  let interpretationBasisKey: string | null = null;
  let interpretationPolicyKey: string | null = null;

  if (
    permissionState === "PERMISSION_PERMITTED" ||
    permissionState === "PERMISSION_PROHIBITED"
  ) {
    if (interpretationBasis === null) {
      throw new Error(
        `Permission State invariant violated: ${permissionState} requires non-null Interpretation Basis for binding ${assessment.permission_context_binding_key}`
      );
    }
    if (
      interpretationBasis.current_declared_permission_assessment_key !==
      permissionBinding.key
    ) {
      throw new Error(
        `Stale Declared Permission Interpretation Basis for binding ${assessment.permission_context_binding_key}: Interpretation Basis assessment key differs from embedded current declared-permission assessment`
      );
    }
    if (
      compareTemporalInstants(interpretationBasis.permission_evaluation_at, permissionBinding.permission_evaluation_at) !== 0
    ) {
      throw new Error(
        `Stale Declared Permission Interpretation Basis for binding ${assessment.permission_context_binding_key}: evaluation instant mismatch`
      );
    }
    if (
      permissionState === "PERMISSION_PERMITTED" &&
      interpretationBasis.interpretation !== "INTERPRET_AS_PERMISSION_PERMITTED"
    ) {
      throw new Error(
        `Permission State invariant violated: PERMISSION_PERMITTED requires INTERPRET_AS_PERMISSION_PERMITTED basis for binding ${assessment.permission_context_binding_key}`
      );
    }
    if (
      permissionState === "PERMISSION_PROHIBITED" &&
      interpretationBasis.interpretation !==
        "INTERPRET_AS_PERMISSION_PROHIBITED"
    ) {
      throw new Error(
        `Permission State invariant violated: PERMISSION_PROHIBITED requires INTERPRET_AS_PERMISSION_PROHIBITED basis for binding ${assessment.permission_context_binding_key}`
      );
    }
    interpretationBasisKey = interpretationBasis.key;
    interpretationPolicyKey =
      interpretationBasis.declared_permission_interpretation_policy_key;
  } else if (
    permissionState ===
    "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY"
  ) {
    if (interpretationBasis !== null || policy !== null) {
      throw new Error(
        `Permission State invariant violated: policy-absence state must not carry interpretation basis or policy for binding ${assessment.permission_context_binding_key}`
      );
    }
  } else if (
    permissionState ===
    "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS"
  ) {
    if (interpretationBasis !== null) {
      throw new Error(
        `Permission State invariant violated: no-mapping state requires null Interpretation Basis for binding ${assessment.permission_context_binding_key}`
      );
    }
    if (policy === null) {
      throw new Error(
        `Permission State invariant violated: no-mapping state requires non-null Declared Permission Interpretation Policy for binding ${assessment.permission_context_binding_key}`
      );
    }
    interpretationPolicyKey = policy.key;
  }

  return {
    key: attentionObservationPermissionStateKey(
      permissionBinding.candidate_key,
      permissionBinding.observation_need_key,
      permissionBinding.capability_requirement_set_key,
      permissionBinding.permission_context_binding_key,
      permissionBinding.key,
      permissionBinding.permission_evaluation_at,
      permissionState,
      interpretationBasisKey,
      interpretationPolicyKey
    ),
    candidate_key: permissionBinding.candidate_key,
    observation_need_key: permissionBinding.observation_need_key,
    capability_requirement_set_key:
      permissionBinding.capability_requirement_set_key,
    permission_context_binding_key:
      permissionBinding.permission_context_binding_key,
    current_declared_permission_assessment_key: permissionBinding.key,
    permission_evaluation_at: permissionBinding.permission_evaluation_at,
    current_declared_permission_status:
      permissionBinding.declared_permission_status,
    permission_state: permissionState,
    declared_permission_interpretation_basis_key: interpretationBasisKey,
    declared_permission_interpretation_policy_key: interpretationPolicyKey,
  };
}

/**
 * Pure per-binding Permission State composition from GROUND-090.
 */
export function assessAttentionObservationPermissionStateBinding(
  interpretationAssessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment
): AttentionObservationPermissionStateBindingAssessment {
  const permissionState =
    mapDeclaredPermissionInterpretationBindingToPermissionState(
      interpretationAssessment
    );
  const permission_state_basis = buildPermissionStateBasis(
    interpretationAssessment,
    permissionState
  );

  return {
    permission_context_binding_key:
      interpretationAssessment.permission_context_binding_key,
    declared_permission_interpretation_assessment: interpretationAssessment,
    permission_state_basis,
  };
}

function assertCandidateStateInvariant(
  assessment: AttentionCandidateObservationPermissionStateAssessment
): void {
  const expectedHasStates =
    assessment.permission_state_binding_assessments.length > 0;
  if (assessment.has_permission_states !== expectedHasStates) {
    throw new Error(
      `Permission State invariant violated: has_permission_states mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "PERMISSION_STATE_ASSESSMENTS_PRESENT" &&
    assessment.permission_state_binding_assessments.length !== 0
  ) {
    throw new Error(
      `Permission State invariant violated: non-present candidate status requires empty binding assessments for ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "PERMISSION_STATE_ASSESSMENTS_PRESENT" &&
    assessment.permission_state_binding_assessments.length === 0
  ) {
    throw new Error(
      `Permission State invariant violated: PERMISSION_STATE_ASSESSMENTS_PRESENT requires non-empty binding assessments for ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure Candidate-level Permission State composition.
 * Does not derive effective Permission / can_execute / OE / composition.
 */
export function assessAttentionCandidateObservationPermissionState(
  interpretationAssessment: AttentionCandidateObservationDeclaredPermissionInterpretationAssessment
): AttentionCandidateObservationPermissionStateAssessment {
  const wrap = (
    status: AttentionObservationPermissionStateCandidateStatus,
    permission_state_binding_assessments: AttentionObservationPermissionStateBindingAssessment[]
  ): AttentionCandidateObservationPermissionStateAssessment => {
    const assessment: AttentionCandidateObservationPermissionStateAssessment = {
      candidate_key: interpretationAssessment.candidate_key,
      declared_permission_interpretation_assessment: interpretationAssessment,
      status,
      permission_state_binding_assessments,
      has_permission_states: permission_state_binding_assessments.length > 0,
      model_limitations: [
        ...ATTENTION_OBSERVATION_PERMISSION_STATE_MODEL_LIMITATIONS,
      ],
    };
    assertCandidateStateInvariant(assessment);
    return assessment;
  };

  if (
    interpretationAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", []);
  }

  if (
    interpretationAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", []);
  }

  if (
    interpretationAssessment.status ===
    "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      []
    );
  }

  if (
    interpretationAssessment.status ===
    "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  ) {
    return wrap("NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED", []);
  }

  if (
    interpretationAssessment.status !==
    "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT"
  ) {
    throw new Error(
      `Permission State invariant violated: unexpected Declared Permission Interpretation status ${interpretationAssessment.status} for candidate ${interpretationAssessment.candidate_key}`
    );
  }

  const permission_state_binding_assessments =
    interpretationAssessment.binding_interpretation_assessments.map(
      assessAttentionObservationPermissionStateBinding
    );

  return wrap(
    "PERMISSION_STATE_ASSESSMENTS_PRESENT",
    permission_state_binding_assessments
  );
}

function hasAnyCandidatePermissionStates(
  assessments: AttentionCandidateObservationPermissionStateAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_permission_states) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Permission State composition.
 * Does not emit effective Permission / OE PERMISSION source / can_execute.
 */
export function buildAttentionObservationPermissionStateSet(
  input: AttentionObservationPermissionStateInput
): AttentionObservationPermissionStateSetAssessment {
  const interpretationSet: AttentionObservationDeclaredPermissionInterpretationSetAssessment =
    input.declared_permission_interpretation_set;

  const candidate_assessments = interpretationSet.candidate_assessments.map(
    assessAttentionCandidateObservationPermissionState
  );

  return {
    declared_permission_interpretation_set: interpretationSet,
    candidate_assessments,
    has_permission_states:
      hasAnyCandidatePermissionStates(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_PERMISSION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
