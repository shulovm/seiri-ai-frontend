/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Capability
 * State Source Bridge (GROUND-085).
 *
 * Pure projection of GROUND-083 Capability State into an Operational Eligibility
 * CAPABILITY_STATE source bridge.
 *
 * Must not import GROUND-084 policy cores / GROUND-048–082 runtime cores.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, persisted
 * project state, Permission / Authority / Resource / Feasibility bridges.
 *
 * Source representation ≠ acceptance ≠ resolution ≠ Operational Eligibility
 * CAPABILITY_ABSENT / UNRESOLVED_* remain represented sources
 * No generic POSITIVE / NEGATIVE / PASS / FAIL coercion
 * No effective Capability / can_execute
 */

import type {
  AttentionCandidateObservationCapabilityStateAssessment,
  AttentionObservationCapabilityState,
  AttentionObservationCapabilityStateBasis,
} from "./attention-observation-capability-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment,
  AttentionObservationOperationalEligibilityCapabilityStateSourceBridge,
  AttentionObservationOperationalEligibilityCapabilityStateSourceInput,
  AttentionObservationOperationalEligibilityCapabilityStateSourceModelLimitation,
  AttentionObservationOperationalEligibilityCapabilityStateSourceSetAssessment,
  AttentionObservationOperationalEligibilityCapabilityStateSourceStatus,
} from "./attention-observation-operational-eligibility-capability-state-source-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityCapabilityStateSourceModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_DIMENSION_COVERAGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_DIMENSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_READINESS_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function attentionObservationOperationalEligibilityCapabilityStateSourceKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  capabilityStateBasisKey: string,
  capabilityState: AttentionObservationCapabilityState
): string {
  return [
    "attention-observation-operational-eligibility-capability-state-source",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    capabilityStateBasisKey,
    capabilityState,
  ].join("|");
}

function assertSourceAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment
): void {
  if (
    assessment.status ===
      "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT" &&
    assessment.capability_state_source === null
  ) {
    throw new Error(
      `Operational Eligibility Capability State Source invariant violated: PRESENT requires non-null source for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT" &&
    assessment.capability_state_source !== null
  ) {
    throw new Error(
      `Operational Eligibility Capability State Source invariant violated: non-present status requires null source for candidate ${assessment.candidate_key}`
    );
  }
}

function assertCapabilityStateBasisContext(
  assessment: AttentionCandidateObservationCapabilityStateAssessment,
  basis: AttentionObservationCapabilityStateBasis
): void {
  if (basis.candidate_key !== assessment.candidate_key) {
    throw new Error(
      `Stale Capability State Basis for candidate ${assessment.candidate_key}: Basis candidate_key differs from containing assessment`
    );
  }

  const interpretationAssessment =
    assessment.capability_interpretation_assessment;
  const evalBasis =
    interpretationAssessment.capability_requirement_set_evaluation_state_assessment
      .evaluation_state_basis;

  if (evalBasis !== null) {
    if (basis.observation_need_key !== evalBasis.observation_need_key) {
      throw new Error(
        `Stale Capability State Basis for candidate ${assessment.candidate_key}: observation_need_key differs from embedded Evaluation State Basis`
      );
    }
    if (
      basis.capability_requirement_set_key !==
      evalBasis.capability_requirement_set_key
    ) {
      throw new Error(
        `Stale Capability State Basis for candidate ${assessment.candidate_key}: capability_requirement_set_key differs from embedded Evaluation State Basis`
      );
    }
  }
}

function buildCapabilityStateSourceBridge(
  assessment: AttentionCandidateObservationCapabilityStateAssessment,
  basis: AttentionObservationCapabilityStateBasis
): AttentionObservationOperationalEligibilityCapabilityStateSourceBridge {
  assertCapabilityStateBasisContext(assessment, basis);

  return {
    key: attentionObservationOperationalEligibilityCapabilityStateSourceKey(
      basis.candidate_key,
      basis.observation_need_key,
      basis.capability_requirement_set_key,
      basis.key,
      basis.capability_state
    ),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "CAPABILITY_STATE",
    capability_state_basis_key: basis.key,
    capability_state: basis.capability_state,
  };
}

/**
 * Pure Candidate-level Operational Eligibility CAPABILITY_STATE source bridge.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT
 *
 * Does not filter by Capability polarity.
 * Does not consume GROUND-084 required_dimensions.
 */
export function assessAttentionCandidateObservationOperationalEligibilityCapabilityStateSource(
  capabilityStateAssessment: AttentionCandidateObservationCapabilityStateAssessment
): AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment {
  const candidate_key = capabilityStateAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationOperationalEligibilityCapabilityStateSourceStatus
  ): AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment =
      {
        candidate_key,
        capability_state_assessment: capabilityStateAssessment,
        status,
        capability_state_source: null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_MODEL_LIMITATIONS,
        ],
      };
    assertSourceAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    capabilityStateAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    if (capabilityStateAssessment.capability_state_basis !== null) {
      throw new Error(
        `Operational Eligibility Capability State Source invariant violated: NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS requires null Capability State Basis for candidate ${candidate_key}`
      );
    }
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    capabilityStateAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    if (capabilityStateAssessment.capability_state_basis !== null) {
      throw new Error(
        `Operational Eligibility Capability State Source invariant violated: NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS requires null Capability State Basis for candidate ${candidate_key}`
      );
    }
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    capabilityStateAssessment.status !== "CAPABILITY_STATE_BASIS_PRESENT" ||
    capabilityStateAssessment.capability_state_basis === null
  ) {
    throw new Error(
      `Operational Eligibility Capability State Source invariant violated: CAPABILITY_STATE_BASIS_PRESENT with non-null basis required for candidate ${candidate_key}`
    );
  }

  const assessment: AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment =
    {
      candidate_key,
      capability_state_assessment: capabilityStateAssessment,
      status: "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT",
      capability_state_source: buildCapabilityStateSourceBridge(
        capabilityStateAssessment,
        capabilityStateAssessment.capability_state_basis
      ),
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_MODEL_LIMITATIONS,
      ],
    };
  assertSourceAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyCapabilityStateSources(
  assessments: AttentionCandidateObservationOperationalEligibilityCapabilityStateSourceAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "CAPABILITY_STATE_OPERATIONAL_ELIGIBILITY_SOURCE_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Operational Eligibility CAPABILITY_STATE source bridge.
 * Preserves GROUND-083 Candidate order (no Capability polarity reordering).
 */
export function buildAttentionObservationOperationalEligibilityCapabilityStateSourceSet(
  input: AttentionObservationOperationalEligibilityCapabilityStateSourceInput
): AttentionObservationOperationalEligibilityCapabilityStateSourceSetAssessment {
  const candidate_assessments =
    input.capability_state_set.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityCapabilityStateSource
    );

  return {
    capability_state_set: input.capability_state_set,
    candidate_assessments,
    has_capability_state_operational_eligibility_sources:
      hasAnyCapabilityStateSources(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CAPABILITY_STATE_SOURCE_MODEL_LIMITATIONS,
    ],
  };
}
