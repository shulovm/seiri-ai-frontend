import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Bridge (GROUND-117).
 *
 * Pure projection of GROUND-116 Canonical Authority State into Operational
 * Eligibility AUTHORITY raw source bridges (0..many per Candidate).
 *
 * Must not import GROUND-115/114/113/111/110/109/108, ProjectState,
 * Permission, Capability, or OE downstream semantics.
 *
 * SOURCE_PRESENT = canonical GROUND-116 Authority State record exists
 * SOURCE_PRESENT ≠ positive Authority
 * negative/unresolved canonical States remain bridgeable sources
 * source ≠ acceptance ≠ resolution ≠ Satisfaction ≠ Operational Eligibility
 */

import {
  attentionObservationOperationalEligibilityCanonicalAuthorityStateKey,
  isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved,
  isCanonicalAuthorityStateExplicitlyInterpretedPositive,
} from "./attention-observation-operational-eligibility-canonical-authority-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment,
  AttentionObservationOperationalEligibilityCanonicalAuthorityState,
  AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis,
} from "./attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySource,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeCandidateStatus,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeEvalInput,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeModelLimitation,
  AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment,
} from "./attention-observation-operational-eligibility-authority-source-bridge-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthoritySourceBridgeModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function attentionObservationOperationalEligibilityAuthoritySourceKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: string;
  governance_scope_key: string;
  authority_evaluation_instant_key: string;
  authority_evaluation_at: string;
  canonical_authority_state_key: string;
  canonical_authority_state_basis_key: string;
  canonical_authority_state_value: string;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-source",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "AUTHORITY",
    params.authority_observation_context_binding_key,
    params.authority_holder_entity_id,
    params.authority_power,
    params.governance_scope_key,
    params.authority_evaluation_instant_key,
    temporalInstantKey(params.authority_evaluation_at),
    params.canonical_authority_state_key,
    params.canonical_authority_state_basis_key,
    params.canonical_authority_state_value,
    "SOURCE_PRESENT",
  ].join("|");
}

function summarizeAuthoritySources(
  authority_sources: readonly AttentionObservationOperationalEligibilityAuthoritySource[]
): {
  has_authority_sources: boolean;
  has_positive_canonical_authority_state_sources: boolean;
  has_negative_canonical_authority_state_sources: boolean;
  has_unresolved_canonical_authority_state_sources: boolean;
} {
  let has_positive_canonical_authority_state_sources = false;
  let has_negative_canonical_authority_state_sources = false;
  let has_unresolved_canonical_authority_state_sources = false;

  for (const source of authority_sources) {
    if (
      isCanonicalAuthorityStateExplicitlyInterpretedPositive(
        source.canonical_authority_state_value
      )
    ) {
      has_positive_canonical_authority_state_sources = true;
    }
    if (
      source.canonical_authority_state_value ===
      "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
    ) {
      has_negative_canonical_authority_state_sources = true;
    }
    if (
      !isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved(
        source.canonical_authority_state_value
      )
    ) {
      has_unresolved_canonical_authority_state_sources = true;
    }
  }

  return {
    has_authority_sources: authority_sources.length > 0,
    has_positive_canonical_authority_state_sources,
    has_negative_canonical_authority_state_sources,
    has_unresolved_canonical_authority_state_sources,
  };
}

function assertSourceAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment
): void {
  const summary = summarizeAuthoritySources(assessment.authority_sources);

  if (assessment.has_authority_sources !== summary.has_authority_sources) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: has_authority_sources mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_positive_canonical_authority_state_sources !==
    summary.has_positive_canonical_authority_state_sources
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: has_positive summary mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_negative_canonical_authority_state_sources !==
    summary.has_negative_canonical_authority_state_sources
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: has_negative summary mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_unresolved_canonical_authority_state_sources !==
    summary.has_unresolved_canonical_authority_state_sources
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: has_unresolved summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "AUTHORITY_SOURCES_PRESENT" &&
    assessment.authority_sources.length === 0
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: SOURCES_PRESENT requires non-empty sources for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "AUTHORITY_SOURCES_PRESENT" &&
    assessment.authority_sources.length !== 0
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: non-present status requires empty sources for candidate ${assessment.candidate_key}`
    );
  }
}

function findCanonicalAuthorityStateBasis(
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment,
  state: AttentionObservationOperationalEligibilityCanonicalAuthorityState
): AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis {
  const basis = candidateAssessment.canonical_authority_state_bases.find(
    (entry) => entry.key === state.canonical_authority_state_basis_key
  );
  if (!basis) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: missing canonical Authority State Basis for State ${state.key}`
    );
  }
  return basis;
}

function assertCanonicalAuthorityStateContext(
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment,
  state: AttentionObservationOperationalEligibilityCanonicalAuthorityState,
  basis: AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis
): void {
  if (state.candidate_key !== candidateAssessment.candidate_key) {
    throw new Error(
      `Stale canonical Authority State for candidate ${candidateAssessment.candidate_key}: state candidate_key mismatch`
    );
  }
  if (basis.candidate_key !== candidateAssessment.candidate_key) {
    throw new Error(
      `Stale canonical Authority State Basis for candidate ${candidateAssessment.candidate_key}: basis candidate_key mismatch`
    );
  }
  if (state.canonical_authority_state_basis_key !== basis.key) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: State/Basis key mismatch for State ${state.key}`
    );
  }
  if (state.value !== basis.canonical_authority_state_value) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: State/Basis value mismatch for State ${state.key}`
    );
  }

  const expectedStateKey =
    attentionObservationOperationalEligibilityCanonicalAuthorityStateKey({
      candidate_key: basis.candidate_key,
      observation_need_key: basis.observation_need_key,
      capability_requirement_set_key: basis.capability_requirement_set_key,
      authority_observation_context_binding_key:
        basis.authority_observation_context_binding_key,
      authority_holder_entity_id: basis.authority_holder_entity_id,
      authority_power: basis.authority_power,
      governance_scope_key: basis.governance_scope_key,
      authority_evaluation_at: basis.authority_evaluation_at,
      canonical_authority_state_value: basis.canonical_authority_state_value,
      canonical_authority_state_basis_key: basis.key,
    });
  if (state.key !== expectedStateKey) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: forged canonical Authority State key for State ${state.key}`
    );
  }

  if (
    state.observation_need_key !== basis.observation_need_key ||
    state.capability_requirement_set_key !==
      basis.capability_requirement_set_key ||
    state.authority_observation_context_binding_key !==
      basis.authority_observation_context_binding_key ||
    state.authority_holder_entity_id !== basis.authority_holder_entity_id ||
    state.authority_power !== basis.authority_power ||
    state.governance_scope_key !== basis.governance_scope_key ||
    compareTemporalInstants(state.authority_evaluation_at, basis.authority_evaluation_at) !== 0
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: State/Basis context mismatch for State ${state.key}`
    );
  }
}

function buildAuthoritySource(
  candidateAssessment: AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment,
  state: AttentionObservationOperationalEligibilityCanonicalAuthorityState,
  basis: AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis
): AttentionObservationOperationalEligibilityAuthoritySource {
  assertCanonicalAuthorityStateContext(candidateAssessment, state, basis);

  return {
    key: attentionObservationOperationalEligibilityAuthoritySourceKey({
      candidate_key: basis.candidate_key,
      observation_need_key: basis.observation_need_key,
      capability_requirement_set_key: basis.capability_requirement_set_key,
      authority_observation_context_binding_key:
        basis.authority_observation_context_binding_key,
      authority_holder_entity_id: basis.authority_holder_entity_id,
      authority_power: basis.authority_power,
      governance_scope_key: basis.governance_scope_key,
      authority_evaluation_instant_key: basis.authority_evaluation_instant_key,
      authority_evaluation_at: basis.authority_evaluation_at,
      canonical_authority_state_key: state.key,
      canonical_authority_state_basis_key: basis.key,
      canonical_authority_state_value: state.value,
    }),
    candidate_key: basis.candidate_key,
    observation_need_key: basis.observation_need_key,
    capability_requirement_set_key: basis.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key:
      basis.authority_observation_context_binding_key,
    authority_holder_entity_id: basis.authority_holder_entity_id,
    authority_power: basis.authority_power,
    governance_scope: basis.governance_scope,
    governance_scope_key: basis.governance_scope_key,
    authority_evaluation_instant_key: basis.authority_evaluation_instant_key,
    authority_evaluation_at: basis.authority_evaluation_at,
    canonical_authority_state_key: state.key,
    canonical_authority_state_basis_key: basis.key,
    canonical_authority_state_value: state.value,
    source_presence: "SOURCE_PRESENT",
  };
}

/**
 * Pure Candidate-level Operational Eligibility AUTHORITY source bridge.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED
 * 5. AUTHORITY_SOURCES_PRESENT
 *
 * Does not filter by Authority polarity or resolvedness.
 * Does not consume downstream OE policy semantics.
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceBridge(
  canonicalAuthorityStateAssessment: AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment
): AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment {
  const candidate_key = canonicalAuthorityStateAssessment.candidate_key;

  const wrap = (
    status: AttentionObservationOperationalEligibilityAuthoritySourceBridgeCandidateStatus,
    authority_sources: AttentionObservationOperationalEligibilityAuthoritySource[]
  ): AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment =
      {
        candidate_key,
        canonical_authority_state_assessment: canonicalAuthorityStateAssessment,
        status,
        authority_sources,
        ...summarizeAuthoritySources(authority_sources),
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_MODEL_LIMITATIONS,
        ],
      };
    assertSourceAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    canonicalAuthorityStateAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    if (
      canonicalAuthorityStateAssessment.canonical_authority_states.length !== 0
    ) {
      throw new Error(
        `Operational Eligibility AUTHORITY Source invariant violated: NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS requires empty canonical Authority States for candidate ${candidate_key}`
      );
    }
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", []);
  }

  if (
    canonicalAuthorityStateAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    if (
      canonicalAuthorityStateAssessment.canonical_authority_states.length !== 0
    ) {
      throw new Error(
        `Operational Eligibility AUTHORITY Source invariant violated: NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS requires empty canonical Authority States for candidate ${candidate_key}`
      );
    }
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", []);
  }

  if (
    canonicalAuthorityStateAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    if (
      canonicalAuthorityStateAssessment.canonical_authority_states.length !== 0
    ) {
      throw new Error(
        `Operational Eligibility AUTHORITY Source invariant violated: NO_BINDINGS requires empty canonical Authority States for candidate ${candidate_key}`
      );
    }
    return wrap("NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED", []);
  }

  if (
    canonicalAuthorityStateAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  ) {
    if (
      canonicalAuthorityStateAssessment.canonical_authority_states.length !== 0
    ) {
      throw new Error(
        `Operational Eligibility AUTHORITY Source invariant violated: NO_EVALUATION_INSTANT requires empty canonical Authority States for candidate ${candidate_key}`
      );
    }
    return wrap("NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED", []);
  }

  if (
    canonicalAuthorityStateAssessment.status !== "CANONICAL_AUTHORITY_STATES_PRESENT"
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: unexpected canonical Authority State status ${canonicalAuthorityStateAssessment.status} for candidate ${candidate_key}`
    );
  }

  if (
    canonicalAuthorityStateAssessment.canonical_authority_states.length === 0
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: CANONICAL_AUTHORITY_STATES_PRESENT requires non-empty canonical Authority States for candidate ${candidate_key}`
    );
  }

  if (
    canonicalAuthorityStateAssessment.canonical_authority_state_bases.length !==
    canonicalAuthorityStateAssessment.canonical_authority_states.length
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: State/Basis cardinality mismatch for candidate ${candidate_key}`
    );
  }

  const authority_sources =
    canonicalAuthorityStateAssessment.canonical_authority_states.map(
      (state) => {
        const basis = findCanonicalAuthorityStateBasis(
          canonicalAuthorityStateAssessment,
          state
        );
        return buildAuthoritySource(
          canonicalAuthorityStateAssessment,
          state,
          basis
        );
      }
    );

  return wrap("AUTHORITY_SOURCES_PRESENT", authority_sources);
}

function hasAnyAuthoritySources(
  assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_authority_sources) {
      return true;
    }
  }
  return false;
}

function hasAnyPositiveAuthoritySources(
  assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_positive_canonical_authority_state_sources) {
      return true;
    }
  }
  return false;
}

function hasAnyNegativeAuthoritySources(
  assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_negative_canonical_authority_state_sources) {
      return true;
    }
  }
  return false;
}

function hasAnyUnresolvedAuthoritySources(
  assessments: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_unresolved_canonical_authority_state_sources) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Operational Eligibility AUTHORITY source bridge.
 * Preserves GROUND-116 Candidate / State order (no polarity reordering).
 */
export function buildAttentionObservationOperationalEligibilityAuthoritySourceBridgeSet(
  input: AttentionObservationOperationalEligibilityAuthoritySourceBridgeEvalInput
): AttentionObservationOperationalEligibilityAuthoritySourceBridgeSetAssessment {
  const candidate_assessments =
    input.canonical_authority_state_set.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceBridge
    );

  return {
    canonical_authority_state_set: input.canonical_authority_state_set,
    candidate_assessments,
    has_authority_sources: hasAnyAuthoritySources(candidate_assessments),
    has_positive_canonical_authority_state_sources:
      hasAnyPositiveAuthoritySources(candidate_assessments),
    has_negative_canonical_authority_state_sources:
      hasAnyNegativeAuthoritySources(candidate_assessments),
    has_unresolved_canonical_authority_state_sources:
      hasAnyUnresolvedAuthoritySources(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_MODEL_LIMITATIONS,
    ],
  };
}
