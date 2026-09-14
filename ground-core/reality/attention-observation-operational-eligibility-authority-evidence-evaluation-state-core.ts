import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Authority Evidence Evaluation State (GROUND-113).
 *
 * Pure normalization of GROUND-111 Observation-Context AUTHORITY Provenance Assessment.
 *
 * Sole runtime input: GROUND-111.
 * Must not access external state, GROUND-019/020, GROUND-108–110 directly,
 * Permission, Standing, Mandate, or OE semantics.
 *
 * Evidence normalization ≠ canonical Authority polarity
 * PRESENT ≠ positive; NOT_PRESENT ≠ negative; MULTIPLE ≠ stronger
 */

import { buildAuthorityProvenanceAssessmentCanonicalKey } from "./attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-core.js";
import type {
  AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment,
} from "./attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-types.js";
import type { AuthorityProvenanceAssessment } from "./governance-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationState,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateEvalInput,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateStatus,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue,
  AttentionObservationOperationalEligibilityAuthorityEvidenceMultiplicity,
  AttentionObservationOperationalEligibilityAuthorityEvidencePresence,
} from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment,
  AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentStatus,
} from "./attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_INTERPRETATION_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function presenceFromBoolean(value: boolean): AttentionObservationOperationalEligibilityAuthorityEvidencePresence {
  return value ? "PRESENT" : "NOT_PRESENT";
}

function multiplicityFromCount(
  count: number
): AttentionObservationOperationalEligibilityAuthorityEvidenceMultiplicity {
  return count > 1 ? "MULTIPLE" : "NOT_MULTIPLE";
}

/**
 * Canonical structured evidence value identity in fixed field order.
 * Field order is serialization only — no priority semantics.
 */
export function buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
  value: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue
): string {
  return [
    value.direct_declared_status,
    value.direct_provenance_path_presence,
    value.delegated_provenance_path_presence,
    value.active_source_basis_presence,
    value.inactive_source_basis_presence,
    value.inactive_delegation_presence,
    value.contested_path_presence,
    value.uncontested_path_presence,
    value.direct_declaration_multiplicity,
    value.delegated_path_multiplicity,
  ].join("|");
}

export function attentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasisKey(params: {
  candidateKey: string;
  observationNeedKey: string;
  capabilityRequirementSetKey: string;
  authorityProvenanceWrapperKey: string;
  declaredAuthorityWrapperKey: string;
  authorityBindingKey: string;
  holderEntityId: string;
  authorityPower: string;
  governanceScopeKey: string;
  evaluationInstantKey: string;
  authorityEvaluationAt: string;
  authorityProvenanceAssessmentCanonicalKey: string;
  authorityEvidenceEvaluationStateValueCanonicalKey: string;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-evidence-evaluation-state-basis",
    params.candidateKey,
    params.observationNeedKey,
    params.capabilityRequirementSetKey,
    "AUTHORITY",
    params.authorityProvenanceWrapperKey,
    params.declaredAuthorityWrapperKey,
    params.authorityBindingKey,
    params.holderEntityId,
    params.authorityPower,
    params.governanceScopeKey,
    params.evaluationInstantKey,
    temporalInstantKey(params.authorityEvaluationAt),
    params.authorityProvenanceAssessmentCanonicalKey,
    params.authorityEvidenceEvaluationStateValueCanonicalKey,
  ].join("|");
}

export function attentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateKey(params: {
  candidateKey: string;
  observationNeedKey: string;
  capabilityRequirementSetKey: string;
  holderEntityId: string;
  authorityPower: string;
  governanceScopeKey: string;
  authorityEvaluationAt: string;
  authorityEvidenceEvaluationStateValueCanonicalKey: string;
  authorityEvidenceEvaluationStateBasisKey: string;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-evidence-evaluation-state",
    params.candidateKey,
    params.observationNeedKey,
    params.capabilityRequirementSetKey,
    "AUTHORITY",
    params.holderEntityId,
    params.authorityPower,
    params.governanceScopeKey,
    temporalInstantKey(params.authorityEvaluationAt),
    params.authorityEvidenceEvaluationStateValueCanonicalKey,
    params.authorityEvidenceEvaluationStateBasisKey,
  ].join("|");
}

export function deriveAuthorityEvidenceEvaluationStateValue(
  provenance: AuthorityProvenanceAssessment
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue {
  const paths = provenance.provenance_paths;
  const delegations = provenance.applicable_delegations_to_holder;
  const directAuthority = provenance.direct_authority;

  const directPathCount = paths.filter(
    (path) => path.kind === "DIRECT_DECLARATION"
  ).length;
  const delegatedPathCount = paths.filter(
    (path) => path.kind === "ONE_HOP_DELEGATION"
  ).length;

  return {
    direct_declared_status: directAuthority.status,
    direct_provenance_path_presence: presenceFromBoolean(directPathCount > 0),
    delegated_provenance_path_presence: presenceFromBoolean(delegatedPathCount > 0),
    active_source_basis_presence: presenceFromBoolean(
      paths.some(
        (path) => path.source_basis_status === "SOURCE_DECLARED_AUTHORITY_ACTIVE"
      ) ||
        delegations.some(
          (entry) => entry.basis_status === "SOURCE_DECLARED_AUTHORITY_ACTIVE"
        )
    ),
    inactive_source_basis_presence: presenceFromBoolean(
      paths.some(
        (path) =>
          path.source_basis_status === "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE"
      ) ||
        delegations.some(
          (entry) =>
            entry.basis_status === "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE"
        )
    ),
    inactive_delegation_presence: presenceFromBoolean(
      delegations.some((entry) => entry.basis_status === "DELEGATION_NOT_ACTIVE")
    ),
    contested_path_presence: presenceFromBoolean(
      paths.some((path) => path.contested)
    ),
    uncontested_path_presence: presenceFromBoolean(
      paths.some((path) => !path.contested)
    ),
    direct_declaration_multiplicity: directAuthority.has_multiple_declarations
      ? "MULTIPLE"
      : "NOT_MULTIPLE",
    delegated_path_multiplicity: multiplicityFromCount(delegatedPathCount),
  };
}

function assertProvenanceWrapperLineage(
  wrapper: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment
): void {
  const provenance = wrapper.authority_provenance_assessment;
  const directAuthority = provenance.direct_authority;

  if (provenance.holder_entity_id !== wrapper.authority_holder_entity_id) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State holder mismatch for provenance wrapper ${wrapper.key}`
    );
  }
  if (provenance.power !== wrapper.authority_power) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State power mismatch for provenance wrapper ${wrapper.key}`
    );
  }
  if (compareTemporalInstants(provenance.at, wrapper.authority_evaluation_at) !== 0) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State evaluation-at mismatch for provenance wrapper ${wrapper.key}`
    );
  }
  if (directAuthority.power !== wrapper.authority_power) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State direct-authority power mismatch for provenance wrapper ${wrapper.key}`
    );
  }
  if (compareTemporalInstants(directAuthority.at, wrapper.authority_evaluation_at) !== 0) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State direct-authority at mismatch for provenance wrapper ${wrapper.key}`
    );
  }
  if (
    directAuthority.holder_entity_id !== null &&
    directAuthority.holder_entity_id !== wrapper.authority_holder_entity_id
  ) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State direct-authority holder mismatch for provenance wrapper ${wrapper.key}`
    );
  }
}

function assertProvenanceSummaryConsistency(
  provenance: AuthorityProvenanceAssessment,
  value: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue
): void {
  const paths = provenance.provenance_paths;
  const delegations = provenance.applicable_delegations_to_holder;

  const expectedHasDirectDeclaredAuthority =
    provenance.direct_authority.status === "DECLARED_AUTHORITY_PRESENT";
  const expectedHasDelegatedClaim = delegations.length > 0;
  const expectedHasActiveSourceBasis = delegations.some(
    (entry) => entry.basis_status === "SOURCE_DECLARED_AUTHORITY_ACTIVE"
  );
  const expectedHasInactiveSourceBasis = delegations.some(
    (entry) => entry.basis_status === "SOURCE_DECLARED_AUTHORITY_NOT_ACTIVE"
  );
  const expectedHasContestedPath = paths.some((path) => path.contested);

  if (provenance.has_direct_declared_authority !== expectedHasDirectDeclaredAuthority) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_direct_declared_authority contradicts direct_authority.status"
    );
  }
  if (provenance.has_delegated_authority_claim !== expectedHasDelegatedClaim) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_delegated_authority_claim contradicts applicable_delegations_to_holder"
    );
  }
  if (
    provenance.has_delegation_with_active_source_basis !==
    expectedHasActiveSourceBasis
  ) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_delegation_with_active_source_basis contradicts delegation basis statuses"
    );
  }
  if (
    provenance.has_delegation_without_active_source_basis !==
    expectedHasInactiveSourceBasis
  ) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_delegation_without_active_source_basis contradicts delegation basis statuses"
    );
  }
  if (provenance.has_contested_path !== expectedHasContestedPath) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_contested_path contradicts provenance_paths"
    );
  }

  if (
    provenance.has_direct_declared_authority !==
    (value.direct_provenance_path_presence === "PRESENT")
  ) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_direct_declared_authority contradicts direct provenance path presence"
    );
  }
  if (
    provenance.has_delegated_authority_claim !==
    (value.delegated_provenance_path_presence === "PRESENT")
  ) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_delegated_authority_claim contradicts delegated provenance path presence"
    );
  }
  if (
    provenance.has_delegation_with_active_source_basis &&
    value.active_source_basis_presence !== "PRESENT"
  ) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_delegation_with_active_source_basis contradicts active_source_basis_presence"
    );
  }
  if (
    provenance.has_delegation_without_active_source_basis &&
    value.inactive_source_basis_presence !== "PRESENT"
  ) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_delegation_without_active_source_basis contradicts inactive_source_basis_presence"
    );
  }
  if (
    provenance.has_contested_path !==
    (value.contested_path_presence === "PRESENT")
  ) {
    throw new Error(
      "AUTHORITY Evidence Evaluation State summary inconsistency: has_contested_path contradicts contested_path_presence"
    );
  }
}

function buildPerWrapperEvidenceEvaluationState(
  wrapper: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment
): {
  basis: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis;
  state: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationState;
} {
  assertProvenanceWrapperLineage(wrapper);

  const provenance = wrapper.authority_provenance_assessment;
  const authorityProvenanceAssessmentCanonicalKey =
    buildAuthorityProvenanceAssessmentCanonicalKey(provenance);
  const value = deriveAuthorityEvidenceEvaluationStateValue(provenance);
  assertProvenanceSummaryConsistency(provenance, value);

  const authorityEvidenceEvaluationStateValueCanonicalKey =
    buildAuthorityEvidenceEvaluationStateValueCanonicalKey(value);

  const basisKey = attentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasisKey(
    {
      candidateKey: wrapper.candidate_key,
      observationNeedKey: wrapper.observation_need_key,
      capabilityRequirementSetKey: wrapper.capability_requirement_set_key,
      authorityProvenanceWrapperKey: wrapper.key,
      declaredAuthorityWrapperKey:
        wrapper.observation_context_declared_authority_assessment_key,
      authorityBindingKey: wrapper.authority_observation_context_binding_key,
      holderEntityId: wrapper.authority_holder_entity_id,
      authorityPower: wrapper.authority_power,
      governanceScopeKey: wrapper.governance_scope_key,
      evaluationInstantKey: wrapper.authority_evaluation_instant_key,
      authorityEvaluationAt: wrapper.authority_evaluation_at,
      authorityProvenanceAssessmentCanonicalKey,
      authorityEvidenceEvaluationStateValueCanonicalKey,
    }
  );

  const basis: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateBasis =
    {
      key: basisKey,
      candidate_key: wrapper.candidate_key,
      observation_need_key: wrapper.observation_need_key,
      capability_requirement_set_key: wrapper.capability_requirement_set_key,
      dimension: "AUTHORITY",
      observation_context_authority_provenance_assessment_key: wrapper.key,
      observation_context_declared_authority_assessment_key:
        wrapper.observation_context_declared_authority_assessment_key,
      authority_observation_context_binding_key:
        wrapper.authority_observation_context_binding_key,
      authority_holder_entity_id: wrapper.authority_holder_entity_id,
      authority_power: wrapper.authority_power,
      governance_scope: wrapper.governance_scope,
      governance_scope_key: wrapper.governance_scope_key,
      authority_evaluation_instant_key: wrapper.authority_evaluation_instant_key,
      authority_evaluation_at: wrapper.authority_evaluation_at,
      authority_provenance_assessment_canonical_key:
        authorityProvenanceAssessmentCanonicalKey,
      authority_evidence_evaluation_state_value: value,
    };

  const state: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationState =
    {
      key: attentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateKey(
        {
          candidateKey: wrapper.candidate_key,
          observationNeedKey: wrapper.observation_need_key,
          capabilityRequirementSetKey: wrapper.capability_requirement_set_key,
          holderEntityId: wrapper.authority_holder_entity_id,
          authorityPower: wrapper.authority_power,
          governanceScopeKey: wrapper.governance_scope_key,
          authorityEvaluationAt: wrapper.authority_evaluation_at,
          authorityEvidenceEvaluationStateValueCanonicalKey,
          authorityEvidenceEvaluationStateBasisKey: basisKey,
        }
      ),
      candidate_key: wrapper.candidate_key,
      observation_need_key: wrapper.observation_need_key,
      capability_requirement_set_key: wrapper.capability_requirement_set_key,
      dimension: "AUTHORITY",
      authority_holder_entity_id: wrapper.authority_holder_entity_id,
      authority_power: wrapper.authority_power,
      governance_scope_key: wrapper.governance_scope_key,
      authority_evaluation_at: wrapper.authority_evaluation_at,
      value,
      authority_evidence_evaluation_state_basis_key: basisKey,
    };

  return { basis, state };
}

function assertCandidateEvidenceEvaluationStateInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment
): void {
  const hasStates = assessment.authority_evidence_evaluation_states.length > 0;

  if (assessment.has_authority_evidence_evaluation_states !== hasStates) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State invariant violated: has_states mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.authority_evidence_evaluation_state_bases.length !==
    assessment.authority_evidence_evaluation_states.length
  ) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State invariant violated: basis/state cardinality mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT" &&
    assessment.authority_evidence_evaluation_states.length === 0
  ) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State invariant violated: PRESENT requires non-empty states for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT" &&
    assessment.authority_evidence_evaluation_states.length !== 0
  ) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State invariant violated: non-present status requires empty states for candidate ${assessment.candidate_key}`
    );
  }

  for (let i = 0; i < assessment.authority_evidence_evaluation_states.length; i++) {
    const state = assessment.authority_evidence_evaluation_states[i]!;
    const basis = assessment.authority_evidence_evaluation_state_bases[i]!;
    if (state.authority_evidence_evaluation_state_basis_key !== basis.key) {
      throw new Error(
        `AUTHORITY Evidence Evaluation State invariant violated: state/basis key mismatch for candidate ${assessment.candidate_key}`
      );
    }
    if (
      basis.observation_context_authority_provenance_assessment_key !==
      assessment.observation_context_authority_provenance_assessment
        .observation_context_authority_provenance_assessments[i]?.key
    ) {
      throw new Error(
        `AUTHORITY Evidence Evaluation State invariant violated: provenance wrapper lineage mismatch for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function mapProvenanceStatusToEvidenceStatus(
  status: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentStatus
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateStatus {
  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED":
      return "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED";
    case "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED":
      return "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED";
    case "OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENTS_PRESENT":
      return "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT";
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationState(
  provenanceCandidateAssessment: AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment
): AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment {
  const candidate_key = provenanceCandidateAssessment.candidate_key;
  const mappedStatus = mapProvenanceStatusToEvidenceStatus(
    provenanceCandidateAssessment.status
  );

  const empty = (
    status: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateStatus
  ): AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment =
      {
        candidate_key,
        observation_context_authority_provenance_assessment:
          provenanceCandidateAssessment,
        status,
        authority_evidence_evaluation_state_bases: [],
        authority_evidence_evaluation_states: [],
        has_authority_evidence_evaluation_states: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateEvidenceEvaluationStateInvariant(assessment);
    return assessment;
  };

  if (mappedStatus !== "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT") {
    return empty(mappedStatus);
  }

  const built =
    provenanceCandidateAssessment.observation_context_authority_provenance_assessments.map(
      (wrapper) => buildPerWrapperEvidenceEvaluationState(wrapper)
    );

  if (
    built.length !==
    provenanceCandidateAssessment.observation_context_authority_provenance_assessments
      .length
  ) {
    throw new Error(
      `AUTHORITY Evidence Evaluation State cardinality invariant violated for candidate ${candidate_key}`
    );
  }

  const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateAssessment =
    {
      candidate_key,
      observation_context_authority_provenance_assessment:
        provenanceCandidateAssessment,
      status: "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT",
      authority_evidence_evaluation_state_bases: built.map((entry) => entry.basis),
      authority_evidence_evaluation_states: built.map((entry) => entry.state),
      has_authority_evidence_evaluation_states: built.length > 0,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateEvidenceEvaluationStateInvariant(assessment);
  return assessment;
}

export function buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSet(
  input: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateEvalInput
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSetAssessment {
  const candidate_assessments =
    input.observation_context_authority_provenance_assessment_set.candidate_assessments.map(
      (provenanceCandidateAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationState(
          provenanceCandidateAssessment
        )
    );

  return {
    observation_context_authority_provenance_assessment_set:
      input.observation_context_authority_provenance_assessment_set,
    candidate_assessments,
    has_authority_evidence_evaluation_states: candidate_assessments.some(
      (assessment) => assessment.has_authority_evidence_evaluation_states
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
    ],
  };
}
