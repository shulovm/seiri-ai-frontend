import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Evidence Evaluation State (GROUND-137).
 *
 * Pure normalization of GROUND-135 Raw Binding Evidence Assessment.
 *
 * Sole runtime input: GROUND-135.
 * Must not access ProjectState, GROUND-022 assessResource, GROUND-132–134
 * directly, Reservation / Commitment / Contention / Feasibility /
 * Permission / Authority / Capability State, or OE semantics.
 *
 * Evidence normalization ≠ canonical Resource Readiness polarity
 * FOUND ≠ READY; NOT_FOUND ≠ NOT_READY
 * AVAILABLE_DECLARED ≠ positive; UNAVAILABLE_DECLARED ≠ negative
 * CONTESTED_AVAILABILITY ≠ failure / unresolved process
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentStatus,
} from "./attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInput,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateStatus,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateModelLimitation[] =
  [
    "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
    "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_BEYOND_EXACT_MATCH_NOT_MODELED",
    "OBSERVATION_RESOURCE_SCOPE_SUBSUMPTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED",
    "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_NOT_MODELED",
    "RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_NOT_MODELED",
    "PER_BINDING_CANONICAL_RESOURCE_READINESS_STATE_NOT_MODELED",
    "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_NOT_MODELED",
    "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function nullableAxisToken(
  value: string | boolean | null
): string {
  if (value === null) {
    return "NONE";
  }
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }
  return value;
}

/**
 * Canonical structured evidence value identity in fixed field order.
 * Field order is serialization only — no priority semantics.
 * Explicit NONE tokens for null axes.
 */
export function attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
  value: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue
): string {
  return [
    value.declaration_lookup_status,
    value.requirement_temporal_relation,
    nullableAxisToken(value.resource_key_relation),
    nullableAxisToken(value.resource_unit_relation),
    nullableAxisToken(value.resource_scope_relation),
    nullableAxisToken(value.resource_declaration_assessment_status),
    nullableAxisToken(value.availability_assessment_status),
    nullableAxisToken(value.capacity_assessment_status),
    nullableAxisToken(value.has_multiple_capacity_declarations),
    nullableAxisToken(value.has_capacity_divergence),
    nullableAxisToken(value.has_temporal_basis_mismatch),
  ].join("|");
}

export function attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasisKey(params: {
  candidateKey: string;
  observationNeedKey: string;
  capabilityRequirementSetKey: string;
  observationResourceRequirementKey: string;
  bindingKey: string;
  resourceDeclarationId: string;
  evaluationInstantKey: string;
  evaluationAt: string;
  rawBindingEvidenceAssessmentKey: string;
  evaluationStateValueCanonicalKey: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-basis",
    params.candidateKey,
    params.observationNeedKey,
    params.capabilityRequirementSetKey,
    "RESOURCE_READINESS",
    params.observationResourceRequirementKey,
    params.bindingKey,
    params.resourceDeclarationId,
    params.evaluationInstantKey,
    temporalInstantKey(params.evaluationAt),
    params.rawBindingEvidenceAssessmentKey,
    params.evaluationStateValueCanonicalKey,
  ].join("|");
}

export function attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateKey(params: {
  basisKey: string;
  candidateKey: string;
  observationNeedKey: string;
  capabilityRequirementSetKey: string;
  observationResourceRequirementKey: string;
  bindingKey: string;
  resourceDeclarationId: string;
  rawBindingEvidenceAssessmentKey: string;
  evaluationStateValueCanonicalKey: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state",
    params.basisKey,
    params.candidateKey,
    params.observationNeedKey,
    params.capabilityRequirementSetKey,
    "RESOURCE_READINESS",
    params.observationResourceRequirementKey,
    params.bindingKey,
    params.resourceDeclarationId,
    params.rawBindingEvidenceAssessmentKey,
    params.evaluationStateValueCanonicalKey,
  ].join("|");
}

function assertRawBindingEvidenceConsistency(
  raw: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment
): void {
  if (
    raw.resource_declaration_lookup_status ===
    "BOUND_RESOURCE_DECLARATION_NOT_FOUND"
  ) {
    if (raw.resource_assessment !== null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State: NOT_FOUND raw assessment ${raw.key} must have null resource_assessment`
      );
    }
    if (raw.resource_key_relation !== null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State: NOT_FOUND raw assessment ${raw.key} must have null resource_key_relation`
      );
    }
    if (raw.resource_unit_relation !== null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State: NOT_FOUND raw assessment ${raw.key} must have null resource_unit_relation`
      );
    }
    if (raw.resource_scope_relation !== null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State: NOT_FOUND raw assessment ${raw.key} must have null resource_scope_relation`
      );
    }
    return;
  }

  if (
    raw.resource_declaration_lookup_status ===
    "BOUND_RESOURCE_DECLARATION_FOUND"
  ) {
    if (raw.resource_assessment === null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State: FOUND raw assessment ${raw.key} must have non-null resource_assessment`
      );
    }
    if (raw.resource_key_relation === null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State: FOUND raw assessment ${raw.key} must have non-null resource_key_relation`
      );
    }
    if (raw.resource_unit_relation === null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State: FOUND raw assessment ${raw.key} must have non-null resource_unit_relation`
      );
    }
    if (raw.resource_scope_relation === null) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State: FOUND raw assessment ${raw.key} must have non-null resource_scope_relation`
      );
    }
    return;
  }

  const _exhaustive: never = raw.resource_declaration_lookup_status;
  void _exhaustive;
  throw new Error(
    `Unknown RESOURCE_READINESS declaration lookup status: ${String(raw.resource_declaration_lookup_status)}`
  );
}

/**
 * Pure GROUND-135 RawBindingEvidenceAssessment → structured Evaluation State Value.
 * No recomputation of relations / ResourceAssessment / ProjectState lookup.
 */
export function deriveAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue(
  raw: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue {
  assertRawBindingEvidenceConsistency(raw);

  if (
    raw.resource_declaration_lookup_status ===
    "BOUND_RESOURCE_DECLARATION_NOT_FOUND"
  ) {
    return {
      declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_NOT_FOUND",
      requirement_temporal_relation: raw.requirement_temporal_relation,
      resource_key_relation: null,
      resource_unit_relation: null,
      resource_scope_relation: null,
      resource_declaration_assessment_status: null,
      availability_assessment_status: null,
      capacity_assessment_status: null,
      has_multiple_capacity_declarations: null,
      has_capacity_divergence: null,
      has_temporal_basis_mismatch: null,
    };
  }

  const assessment = raw.resource_assessment!;
  return {
    declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_FOUND",
    requirement_temporal_relation: raw.requirement_temporal_relation,
    resource_key_relation: raw.resource_key_relation,
    resource_unit_relation: raw.resource_unit_relation,
    resource_scope_relation: raw.resource_scope_relation,
    resource_declaration_assessment_status: assessment.declaration_status,
    availability_assessment_status: assessment.availability.status,
    capacity_assessment_status: assessment.capacity.status,
    has_multiple_capacity_declarations:
      assessment.capacity.has_multiple_capacity_declarations,
    has_capacity_divergence: assessment.has_capacity_divergence,
    has_temporal_basis_mismatch: assessment.has_temporal_basis_mismatch,
  };
}

function buildPerRawEvidenceEvaluationState(
  raw: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment
): {
  basis: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis;
  state: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState;
} {
  const evaluation_state_value =
    deriveAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue(
      raw
    );
  const evaluationStateValueCanonicalKey =
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
      evaluation_state_value
    );

  const basisKey =
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasisKey(
      {
        candidateKey: raw.candidate_key,
        observationNeedKey: raw.observation_need_key,
        capabilityRequirementSetKey: raw.capability_requirement_set_key,
        observationResourceRequirementKey:
          raw.observation_resource_requirement_key,
        bindingKey: raw.resource_readiness_observation_context_binding_key,
        resourceDeclarationId: raw.resource_declaration_id,
        evaluationInstantKey: raw.resource_readiness_evaluation_instant_key,
        evaluationAt: raw.evaluation_at,
        rawBindingEvidenceAssessmentKey: raw.key,
        evaluationStateValueCanonicalKey,
      }
    );

  const basis: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateBasis =
    {
      key: basisKey,
      candidate_key: raw.candidate_key,
      observation_need_key: raw.observation_need_key,
      capability_requirement_set_key: raw.capability_requirement_set_key,
      dimension: "RESOURCE_READINESS",
      observation_resource_requirement_key:
        raw.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        raw.resource_readiness_observation_context_binding_key,
      resource_declaration_id: raw.resource_declaration_id,
      resource_readiness_evaluation_instant_key:
        raw.resource_readiness_evaluation_instant_key,
      evaluation_at: raw.evaluation_at,
      raw_binding_evidence_assessment_key: raw.key,
      evaluation_state_value,
    };

  const state: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState =
    {
      key: attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateKey(
        {
          basisKey,
          candidateKey: raw.candidate_key,
          observationNeedKey: raw.observation_need_key,
          capabilityRequirementSetKey: raw.capability_requirement_set_key,
          observationResourceRequirementKey:
            raw.observation_resource_requirement_key,
          bindingKey: raw.resource_readiness_observation_context_binding_key,
          resourceDeclarationId: raw.resource_declaration_id,
          rawBindingEvidenceAssessmentKey: raw.key,
          evaluationStateValueCanonicalKey,
        }
      ),
      basis_key: basisKey,
      candidate_key: raw.candidate_key,
      observation_need_key: raw.observation_need_key,
      capability_requirement_set_key: raw.capability_requirement_set_key,
      dimension: "RESOURCE_READINESS",
      observation_resource_requirement_key:
        raw.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        raw.resource_readiness_observation_context_binding_key,
      resource_declaration_id: raw.resource_declaration_id,
      raw_binding_evidence_assessment_key: raw.key,
      evaluation_state: evaluation_state_value,
    };

  return { basis, state };
}

function assertCandidateEvidenceEvaluationStateInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment
): void {
  const hasStates = assessment.evidence_evaluation_states.length > 0;

  if (
    assessment.has_resource_readiness_evidence_evaluation_states !== hasStates
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Evaluation State invariant violated: has_states mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.evidence_evaluation_state_bases.length !==
    assessment.evidence_evaluation_states.length
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Evaluation State invariant violated: basis/state cardinality mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT" &&
    assessment.evidence_evaluation_states.length === 0
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Evaluation State invariant violated: PRESENT requires non-empty states for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT" &&
    assessment.evidence_evaluation_states.length !== 0
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Evaluation State invariant violated: non-present status requires empty states for candidate ${assessment.candidate_key}`
    );
  }

  for (let i = 0; i < assessment.evidence_evaluation_states.length; i++) {
    const state = assessment.evidence_evaluation_states[i]!;
    const basis = assessment.evidence_evaluation_state_bases[i]!;
    if (state.basis_key !== basis.key) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State invariant violated: state/basis key mismatch for candidate ${assessment.candidate_key}`
      );
    }
    const raw =
      assessment.resource_readiness_raw_evidence_assessment
        .raw_binding_evidence_assessments[i];
    if (!raw || basis.raw_binding_evidence_assessment_key !== raw.key) {
      throw new Error(
        `RESOURCE_READINESS Evidence Evaluation State invariant violated: raw binding lineage mismatch for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function mapRawStatusToEvidenceStatus(
  status: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentStatus
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateStatus {
  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
    case "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED":
    case "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY":
    case "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED":
    case "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED":
      return status;
    case "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT":
      return "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT";
    default: {
      const _exhaustive: never = status;
      void _exhaustive;
      throw new Error(
        `Unknown RESOURCE_READINESS raw evidence status: ${String(status)}`
      );
    }
  }
}

/**
 * Pure per-Candidate RESOURCE_READINESS Evidence Evaluation State assessment.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState(
  rawCandidateAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment
): AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment {
  const candidate_key = rawCandidateAssessment.candidate_key;
  const mappedStatus = mapRawStatusToEvidenceStatus(
    rawCandidateAssessment.status
  );

  const empty = (
    status: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateStatus
  ): AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment =
      {
        candidate_key,
        resource_readiness_raw_evidence_assessment: rawCandidateAssessment,
        status,
        evidence_evaluation_state_bases: [],
        evidence_evaluation_states: [],
        has_resource_readiness_evidence_evaluation_states: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateEvidenceEvaluationStateInvariant(assessment);
    return assessment;
  };

  if (mappedStatus !== "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT") {
    return empty(mappedStatus);
  }

  // Preserve exact GROUND-135 raw assessment order (no ranking).
  const built =
    rawCandidateAssessment.raw_binding_evidence_assessments.map((raw) =>
      buildPerRawEvidenceEvaluationState(raw)
    );

  if (
    built.length !==
    rawCandidateAssessment.raw_binding_evidence_assessments.length
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Evaluation State cardinality invariant violated for candidate ${candidate_key}`
    );
  }

  const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateAssessment =
    {
      candidate_key,
      resource_readiness_raw_evidence_assessment: rawCandidateAssessment,
      status: "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATES_PRESENT",
      evidence_evaluation_state_bases: built.map((entry) => entry.basis),
      evidence_evaluation_states: built.map((entry) => entry.state),
      has_resource_readiness_evidence_evaluation_states: built.length > 0,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateEvidenceEvaluationStateInvariant(assessment);
  return assessment;
}

/**
 * Pure set-level RESOURCE_READINESS Evidence Evaluation State.
 * Preserves GROUND-135 Candidate order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInput
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSetAssessment {
  const candidate_assessments =
    input.resource_readiness_raw_evidence_assessment_set.candidate_assessments.map(
      (rawCandidateAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceEvaluationState(
          rawCandidateAssessment
        )
    );

  return {
    resource_readiness_raw_evidence_assessment_set:
      input.resource_readiness_raw_evidence_assessment_set,
    candidate_assessments,
    has_resource_readiness_evidence_evaluation_states:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_evidence_evaluation_states
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
