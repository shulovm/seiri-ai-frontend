/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * State Source Bridge (GROUND-093).
 *
 * Pure projection of GROUND-091 Permission State into Operational Eligibility
 * PERMISSION raw source bridges (0..many per Candidate).
 *
 * Must not import GROUND-084 policy cores / GROUND-024–090 runtime cores /
 * GROUND-085 Capability source cores.
 *
 * Forbidden: ProjectState, wall-clock, acceptance, aggregation, effective
 * Permission, Authority precedence, Operational Eligibility result, can_execute.
 *
 * Source representation ≠ acceptance ≠ resolution ≠ Operational Eligibility
 * PERMISSION_PROHIBITED / UNRESOLVED_* remain represented sources
 * source PRESENT ≠ PERMISSION_PERMITTED ≠ accepted ≠ can_execute
 * multiple sources ≠ ANY / ALL / veto / CONTESTED_PERMISSION / conflict
 */

import type {
  AttentionCandidateObservationPermissionStateAssessment,
  AttentionObservationPermissionState,
  AttentionObservationPermissionStateBasis,
  AttentionObservationPermissionStateBindingAssessment,
} from "./attention-observation-permission-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
  AttentionObservationOperationalEligibilityPermissionStateSourceInput,
  AttentionObservationOperationalEligibilityPermissionStateSourceModelLimitation,
  AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceStatus,
} from "./attention-observation-operational-eligibility-permission-state-source-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_STATE_SOURCE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionStateSourceModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_REQUIRED_DIMENSION_COVERAGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_READINESS_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function attentionObservationOperationalEligibilityPermissionStateSourceKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  permissionContextBindingKey: string,
  permissionStateBasisKey: string,
  permissionEvaluationAt: string,
  permissionState: AttentionObservationPermissionState
): string {
  return [
    "attention-observation-operational-eligibility-permission-state-source",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    permissionContextBindingKey,
    permissionStateBasisKey,
    permissionEvaluationAt,
    permissionState,
  ].join("|");
}

function assertSourceAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment
): void {
  const expectedHasSources =
    assessment.permission_state_sources.length > 0;
  if (
    assessment.has_permission_state_operational_eligibility_sources !==
    expectedHasSources
  ) {
    throw new Error(
      `Operational Eligibility Permission State Source invariant violated: has_permission_state_operational_eligibility_sources mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT" &&
    assessment.permission_state_sources.length === 0
  ) {
    throw new Error(
      `Operational Eligibility Permission State Source invariant violated: SOURCES_PRESENT requires non-empty sources for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT" &&
    assessment.permission_state_sources.length !== 0
  ) {
    throw new Error(
      `Operational Eligibility Permission State Source invariant violated: non-present status requires empty sources for candidate ${assessment.candidate_key}`
    );
  }
}

function assertPermissionStateBasisContext(
  candidateAssessment: AttentionCandidateObservationPermissionStateAssessment,
  bindingAssessment: AttentionObservationPermissionStateBindingAssessment,
  basis: AttentionObservationPermissionStateBasis
): void {
  if (basis.candidate_key !== candidateAssessment.candidate_key) {
    throw new Error(
      `Stale Permission State Basis for candidate ${candidateAssessment.candidate_key}: Basis candidate_key differs from containing assessment`
    );
  }

  if (
    bindingAssessment.permission_context_binding_key !==
    basis.permission_context_binding_key
  ) {
    throw new Error(
      `Stale Permission State Basis for candidate ${candidateAssessment.candidate_key}: binding assessment key ${bindingAssessment.permission_context_binding_key} differs from Basis binding key ${basis.permission_context_binding_key}`
    );
  }

  if (basis.candidate_key !== candidateAssessment.candidate_key) {
    throw new Error(
      `Permission State context mismatch for candidate ${candidateAssessment.candidate_key}`
    );
  }
}

function buildPermissionStateSourceBridge(
  candidateAssessment: AttentionCandidateObservationPermissionStateAssessment,
  bindingAssessment: AttentionObservationPermissionStateBindingAssessment
): AttentionObservationOperationalEligibilityPermissionStateSourceBridge {
  const basis = bindingAssessment.permission_state_basis;
  assertPermissionStateBasisContext(
    candidateAssessment,
    bindingAssessment,
    basis
  );

  return {
    key: attentionObservationOperationalEligibilityPermissionStateSourceKey(
      basis.candidate_key,
      basis.observation_need_key,
      basis.capability_requirement_set_key,
      basis.permission_context_binding_key,
      basis.key,
      basis.permission_evaluation_at,
      basis.permission_state
    ),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    permission_context_binding_key: basis.permission_context_binding_key,
    dimension: "PERMISSION",
    permission_state_basis_key: basis.key,
    permission_evaluation_at: basis.permission_evaluation_at,
    permission_state: basis.permission_state,
  };
}

/**
 * Pure Candidate-level Operational Eligibility PERMISSION source bridge.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED
 * 5. PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT
 *
 * Does not filter by Permission polarity.
 * Does not consume GROUND-084 required_dimensions.
 * Does not aggregate multiple Permission sources.
 */
export function assessAttentionCandidateObservationOperationalEligibilityPermissionStateSource(
  permissionStateAssessment: AttentionCandidateObservationPermissionStateAssessment
): AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment {
  const candidate_key = permissionStateAssessment.candidate_key;

  const wrap = (
    status: AttentionObservationOperationalEligibilityPermissionStateSourceStatus,
    permission_state_sources: AttentionObservationOperationalEligibilityPermissionStateSourceBridge[]
  ): AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment =
      {
        candidate_key,
        permission_state_assessment: permissionStateAssessment,
        status,
        permission_state_sources,
        has_permission_state_operational_eligibility_sources:
          permission_state_sources.length > 0,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_STATE_SOURCE_MODEL_LIMITATIONS,
        ],
      };
    assertSourceAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    permissionStateAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    if (
      permissionStateAssessment.permission_state_binding_assessments.length !==
      0
    ) {
      throw new Error(
        `Operational Eligibility Permission State Source invariant violated: NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS requires empty Permission State binding assessments for candidate ${candidate_key}`
      );
    }
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", []);
  }

  if (
    permissionStateAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    if (
      permissionStateAssessment.permission_state_binding_assessments.length !==
      0
    ) {
      throw new Error(
        `Operational Eligibility Permission State Source invariant violated: NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS requires empty Permission State binding assessments for candidate ${candidate_key}`
      );
    }
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", []);
  }

  if (
    permissionStateAssessment.status ===
    "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    if (
      permissionStateAssessment.permission_state_binding_assessments.length !==
      0
    ) {
      throw new Error(
        `Operational Eligibility Permission State Source invariant violated: NO_BINDINGS requires empty Permission State binding assessments for candidate ${candidate_key}`
      );
    }
    return wrap(
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      []
    );
  }

  if (
    permissionStateAssessment.status ===
    "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  ) {
    if (
      permissionStateAssessment.permission_state_binding_assessments.length !==
      0
    ) {
      throw new Error(
        `Operational Eligibility Permission State Source invariant violated: NO_EVALUATION_INSTANT requires empty Permission State binding assessments for candidate ${candidate_key}`
      );
    }
    return wrap("NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED", []);
  }

  if (
    permissionStateAssessment.status !== "PERMISSION_STATE_ASSESSMENTS_PRESENT"
  ) {
    throw new Error(
      `Operational Eligibility Permission State Source invariant violated: unexpected Permission State status ${permissionStateAssessment.status} for candidate ${candidate_key}`
    );
  }

  if (
    permissionStateAssessment.permission_state_binding_assessments.length === 0
  ) {
    throw new Error(
      `Operational Eligibility Permission State Source invariant violated: PERMISSION_STATE_ASSESSMENTS_PRESENT requires non-empty binding assessments for candidate ${candidate_key}`
    );
  }

  const permission_state_sources =
    permissionStateAssessment.permission_state_binding_assessments.map(
      (bindingAssessment) =>
        buildPermissionStateSourceBridge(
          permissionStateAssessment,
          bindingAssessment
        )
    );

  return wrap(
    "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT",
    permission_state_sources
  );
}

function hasAnyPermissionStateSources(
  assessments: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_permission_state_operational_eligibility_sources) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Operational Eligibility PERMISSION source bridge.
 * Preserves GROUND-091 Candidate / binding order (no Permission polarity reordering).
 */
export function buildAttentionObservationOperationalEligibilityPermissionStateSourceSet(
  input: AttentionObservationOperationalEligibilityPermissionStateSourceInput
): AttentionObservationOperationalEligibilityPermissionStateSourceSetAssessment {
  const candidate_assessments =
    input.permission_state_set.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityPermissionStateSource
    );

  return {
    permission_state_set: input.permission_state_set,
    candidate_assessments,
    has_permission_state_operational_eligibility_sources:
      hasAnyPermissionStateSources(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_STATE_SOURCE_MODEL_LIMITATIONS,
    ],
  };
}
