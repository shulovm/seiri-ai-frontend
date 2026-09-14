import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Observation-Context AUTHORITY Provenance Assessment (GROUND-111).
 *
 * Pure composition of GROUND-110 Observation-Context Declared AUTHORITY Assessment
 * + ProjectState
 * + existing GROUND-020 assessAuthorityProvenance.
 *
 * For each exact GROUND-110 wrapper:
 *   assessAuthorityProvenance(holder, power, scope, exact at)
 *
 * Direct GROUND-110 raw status does NOT gate provenance evaluation.
 * Must not call GROUND-019 independently, Standing, Mandate, Permission, OE.
 *
 * Forbidden: StatePatch, applyPatch, saveProject, wall-clock default.
 *
 * Provenance ≠ canonical Authority; delegation ≠ effective Authority; contest ≠ revocation
 */

import type {
  AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
} from "./attention-observation-operational-eligibility-observation-context-declared-authority-assessment-types.js";
import { buildDeclaredAuthorityAssessmentCanonicalKey } from "./attention-observation-operational-eligibility-observation-context-declared-authority-assessment-core.js";
import { governanceScopeKey } from "./governance-core.js";
import { assessAuthorityProvenance } from "./governance-provenance.js";
import type {
  AuthorityProvenanceAssessment,
  AuthorityProvenancePath,
} from "./governance-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment,
  AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment,
  AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentEvalInput,
  AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentModelLimitation,
  AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSetAssessment,
  AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentStatus,
} from "./attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-types.js";
import type { ProjectState } from "../types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_SEMANTIC_INTERPRETATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function scopesEqual(
  a: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment["governance_scope"],
  b: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment["governance_scope"]
): boolean {
  return governanceScopeKey(a) === governanceScopeKey(b);
}

/**
 * Canonical identity fragment for a GROUND-020 AuthorityProvenanceAssessment.
 * direct declared canonical key + sorted provenance path keys + delegation basis set.
 */
export function buildAuthorityProvenanceAssessmentCanonicalKey(
  assessment: AuthorityProvenanceAssessment
): string {
  const pathKeys = assessment.provenance_paths
    .map((path) => path.key)
    .sort(compareStrings);
  const pathSetKey =
    pathKeys.length === 0
      ? "EMPTY_PROVENANCE_PATH_SET"
      : pathKeys.join(",");
  const delegationBasisKey = assessment.applicable_delegations_to_holder
    .map((entry) => `${entry.delegation_id}|${entry.basis_status}`)
    .sort(compareStrings)
    .join(";");
  const directCanonical = buildDeclaredAuthorityAssessmentCanonicalKey(
    assessment.direct_authority
  );
  return [directCanonical, pathSetKey, delegationBasisKey].join("|");
}

export function attentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  observationContextDeclaredAuthorityAssessmentKey: string,
  authorityObservationContextBindingKey: string,
  authorityHolderEntityId: string,
  authorityPower: string,
  governanceScopeKeyValue: string,
  authorityEvaluationInstantKey: string,
  authorityEvaluationAt: string,
  authorityProvenanceAssessmentCanonicalKey: string
): string {
  return [
    "attention-observation-operational-eligibility-observation-context-authority-provenance-assessment",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    "AUTHORITY",
    observationContextDeclaredAuthorityAssessmentKey,
    authorityObservationContextBindingKey,
    authorityHolderEntityId,
    authorityPower,
    governanceScopeKeyValue,
    authorityEvaluationInstantKey,
    temporalInstantKey(authorityEvaluationAt),
    authorityProvenanceAssessmentCanonicalKey,
  ].join("|");
}

function assertDeclaredAuthorityWrapperLineage(
  declaredWrapper: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  declaredCandidateAssessment: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment
): void {
  const instantAssessment =
    declaredCandidateAssessment.authority_evaluation_instant_assessment;
  const instant = instantAssessment.authority_evaluation_instant;
  if (instant === null) {
    throw new Error(
      `AUTHORITY Provenance Assessment requires explicit evaluation instant for declared wrapper ${declaredWrapper.key}`
    );
  }

  if (declaredWrapper.candidate_key !== declaredCandidateAssessment.candidate_key) {
    throw new Error(
      `AUTHORITY Provenance Assessment candidate mismatch for declared wrapper ${declaredWrapper.key}`
    );
  }
  if (declaredWrapper.candidate_key !== instant.candidate_key) {
    throw new Error(
      `AUTHORITY Provenance Assessment instant candidate mismatch for declared wrapper ${declaredWrapper.key}`
    );
  }
  if (declaredWrapper.observation_need_key !== instant.observation_need_key) {
    throw new Error(
      `AUTHORITY Provenance Assessment ObservationNeed mismatch for declared wrapper ${declaredWrapper.key}`
    );
  }
  if (
    declaredWrapper.capability_requirement_set_key !==
    instant.capability_requirement_set_key
  ) {
    throw new Error(
      `AUTHORITY Provenance Assessment Requirement-set mismatch for declared wrapper ${declaredWrapper.key}`
    );
  }
  if (declaredWrapper.authority_evaluation_instant_key !== instant.key) {
    throw new Error(
      `AUTHORITY Provenance Assessment instant key mismatch for declared wrapper ${declaredWrapper.key}`
    );
  }
  if (compareTemporalInstants(declaredWrapper.authority_evaluation_at, instant.authority_evaluation_at) !== 0) {
    throw new Error(
      `AUTHORITY Provenance Assessment evaluation-at mismatch for declared wrapper ${declaredWrapper.key}`
    );
  }
}

function assertProvenanceContextConsistency(
  declaredWrapper: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  provenance: AuthorityProvenanceAssessment
): void {
  if (provenance.holder_entity_id !== declaredWrapper.authority_holder_entity_id) {
    throw new Error(
      `AUTHORITY Provenance Assessment context mismatch for declared wrapper ${declaredWrapper.key}: holder_entity_id differs`
    );
  }
  if (provenance.power !== declaredWrapper.authority_power) {
    throw new Error(
      `AUTHORITY Provenance Assessment context mismatch for declared wrapper ${declaredWrapper.key}: power differs`
    );
  }
  if (!scopesEqual(provenance.scope, declaredWrapper.governance_scope)) {
    throw new Error(
      `AUTHORITY Provenance Assessment context mismatch for declared wrapper ${declaredWrapper.key}: scope differs`
    );
  }
  if (compareTemporalInstants(provenance.at, declaredWrapper.authority_evaluation_at) !== 0) {
    throw new Error(
      `AUTHORITY Provenance Assessment context mismatch for declared wrapper ${declaredWrapper.key}: at differs`
    );
  }
}

function summarizeProvenancePaths(paths: readonly AuthorityProvenancePath[]): {
  has_direct_authority_provenance_paths: boolean;
  has_delegated_authority_provenance_paths: boolean;
  has_contested_authority_provenance_paths: boolean;
} {
  let has_direct_authority_provenance_paths = false;
  let has_delegated_authority_provenance_paths = false;
  let has_contested_authority_provenance_paths = false;

  for (const path of paths) {
    if (path.kind === "DIRECT_DECLARATION") {
      has_direct_authority_provenance_paths = true;
    }
    if (path.kind === "ONE_HOP_DELEGATION") {
      has_delegated_authority_provenance_paths = true;
    }
    if (path.contested) {
      has_contested_authority_provenance_paths = true;
    }
  }

  return {
    has_direct_authority_provenance_paths,
    has_delegated_authority_provenance_paths,
    has_contested_authority_provenance_paths,
  };
}

function buildPerWrapperProvenanceAssessment(
  declaredWrapper: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  declaredCandidateAssessment: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  projectState: ProjectState
): AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment {
  assertDeclaredAuthorityWrapperLineage(
    declaredWrapper,
    declaredCandidateAssessment
  );

  const authority_provenance_assessment = assessAuthorityProvenance(
    projectState,
    declaredWrapper.authority_holder_entity_id,
    declaredWrapper.authority_power,
    declaredWrapper.governance_scope,
    declaredWrapper.authority_evaluation_at
  );

  assertProvenanceContextConsistency(
    declaredWrapper,
    authority_provenance_assessment
  );

  const authorityProvenanceAssessmentCanonicalKey =
    buildAuthorityProvenanceAssessmentCanonicalKey(authority_provenance_assessment);

  return {
    key: attentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentKey(
      declaredWrapper.candidate_key,
      declaredWrapper.observation_need_key,
      declaredWrapper.capability_requirement_set_key,
      declaredWrapper.key,
      declaredWrapper.authority_observation_context_binding_key,
      declaredWrapper.authority_holder_entity_id,
      declaredWrapper.authority_power,
      declaredWrapper.governance_scope_key,
      declaredWrapper.authority_evaluation_instant_key,
      declaredWrapper.authority_evaluation_at,
      authorityProvenanceAssessmentCanonicalKey
    ),
    candidate_key: declaredWrapper.candidate_key,
    observation_need_key: declaredWrapper.observation_need_key,
    capability_requirement_set_key: declaredWrapper.capability_requirement_set_key,
    dimension: "AUTHORITY",
    observation_context_declared_authority_assessment_key: declaredWrapper.key,
    authority_observation_context_binding_key:
      declaredWrapper.authority_observation_context_binding_key,
    authority_holder_entity_id: declaredWrapper.authority_holder_entity_id,
    authority_power: declaredWrapper.authority_power,
    governance_scope: declaredWrapper.governance_scope,
    governance_scope_key: declaredWrapper.governance_scope_key,
    authority_evaluation_instant_key: declaredWrapper.authority_evaluation_instant_key,
    authority_evaluation_at: declaredWrapper.authority_evaluation_at,
    authority_provenance_assessment,
  };
}

function summarizeProvenanceAssessments(
  assessments: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment[]
): {
  has_observation_context_authority_provenance_assessments: boolean;
  has_direct_authority_provenance_paths: boolean;
  has_delegated_authority_provenance_paths: boolean;
  has_contested_authority_provenance_paths: boolean;
} {
  let has_observation_context_authority_provenance_assessments = false;
  let has_direct_authority_provenance_paths = false;
  let has_delegated_authority_provenance_paths = false;
  let has_contested_authority_provenance_paths = false;

  for (const assessment of assessments) {
    has_observation_context_authority_provenance_assessments = true;
    const pathSummary = summarizeProvenancePaths(
      assessment.authority_provenance_assessment.provenance_paths
    );
    if (pathSummary.has_direct_authority_provenance_paths) {
      has_direct_authority_provenance_paths = true;
    }
    if (pathSummary.has_delegated_authority_provenance_paths) {
      has_delegated_authority_provenance_paths = true;
    }
    if (pathSummary.has_contested_authority_provenance_paths) {
      has_contested_authority_provenance_paths = true;
    }
  }

  return {
    has_observation_context_authority_provenance_assessments,
    has_direct_authority_provenance_paths,
    has_delegated_authority_provenance_paths,
    has_contested_authority_provenance_paths,
  };
}

function assertCandidateProvenanceAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment
): void {
  const summary = summarizeProvenanceAssessments(
    assessment.observation_context_authority_provenance_assessments
  );

  if (
    assessment.has_observation_context_authority_provenance_assessments !==
    summary.has_observation_context_authority_provenance_assessments
  ) {
    throw new Error(
      `AUTHORITY Provenance Assessment invariant violated: has_assessments mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_direct_authority_provenance_paths !==
    summary.has_direct_authority_provenance_paths
  ) {
    throw new Error(
      `AUTHORITY Provenance Assessment invariant violated: has_direct_paths mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_delegated_authority_provenance_paths !==
    summary.has_delegated_authority_provenance_paths
  ) {
    throw new Error(
      `AUTHORITY Provenance Assessment invariant violated: has_delegated_paths mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_contested_authority_provenance_paths !==
    summary.has_contested_authority_provenance_paths
  ) {
    throw new Error(
      `AUTHORITY Provenance Assessment invariant violated: has_contested_paths mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENTS_PRESENT" &&
    assessment.observation_context_authority_provenance_assessments.length === 0
  ) {
    throw new Error(
      `AUTHORITY Provenance Assessment invariant violated: PRESENT requires non-empty assessments for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENTS_PRESENT" &&
    assessment.observation_context_authority_provenance_assessments.length !== 0
  ) {
    throw new Error(
      `AUTHORITY Provenance Assessment invariant violated: non-present status requires empty assessments for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure per-Candidate Observation-Context AUTHORITY Provenance Assessment.
 *
 * Precedence mirrors GROUND-110 outer statuses.
 * When GROUND-110 wrappers exist, evaluates GROUND-020 provenance for every wrapper
 * regardless of GROUND-110 raw declared status.
 */
export function assessAttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenance(
  declaredCandidateAssessment: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  projectState: ProjectState
): AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment {
  const candidate_key = declaredCandidateAssessment.candidate_key;

  const empty = (
    status: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentStatus
  ): AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment =
      {
        candidate_key,
        observation_context_declared_authority_assessment:
          declaredCandidateAssessment,
        status,
        observation_context_authority_provenance_assessments: [],
        has_observation_context_authority_provenance_assessments: false,
        has_direct_authority_provenance_paths: false,
        has_delegated_authority_provenance_paths: false,
        has_contested_authority_provenance_paths: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENT_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateProvenanceAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    declaredCandidateAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return empty("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    declaredCandidateAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return empty("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    declaredCandidateAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED");
  }

  if (
    declaredCandidateAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED" ||
    declaredCandidateAssessment.authority_evaluation_instant_assessment
      .authority_evaluation_instant === null
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED");
  }

  if (
    declaredCandidateAssessment
      .observation_context_declared_authority_assessments.length === 0
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED");
  }

  const observation_context_authority_provenance_assessments =
    declaredCandidateAssessment.observation_context_declared_authority_assessments.map(
      (declaredWrapper) =>
        buildPerWrapperProvenanceAssessment(
          declaredWrapper,
          declaredCandidateAssessment,
          projectState
        )
    );

  if (
    observation_context_authority_provenance_assessments.length !==
    declaredCandidateAssessment.observation_context_declared_authority_assessments
      .length
  ) {
    throw new Error(
      `AUTHORITY Provenance Assessment cardinality invariant violated for candidate ${candidate_key}`
    );
  }

  for (let i = 0; i < observation_context_authority_provenance_assessments.length; i++) {
    const declaredWrapper =
      declaredCandidateAssessment.observation_context_declared_authority_assessments[
        i
      ]!;
    const provenanceWrapper =
      observation_context_authority_provenance_assessments[i]!;
    if (
      provenanceWrapper.observation_context_declared_authority_assessment_key !==
      declaredWrapper.key
    ) {
      throw new Error(
        `AUTHORITY Provenance Assessment declared-wrapper lineage mismatch for candidate ${candidate_key}`
      );
    }
    if (
      provenanceWrapper.authority_observation_context_binding_key !==
      declaredWrapper.authority_observation_context_binding_key
    ) {
      throw new Error(
        `AUTHORITY Provenance Assessment binding lineage mismatch for candidate ${candidate_key}`
      );
    }
  }

  const summary = summarizeProvenanceAssessments(
    observation_context_authority_provenance_assessments
  );

  const assessment: AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment =
    {
      candidate_key,
      observation_context_declared_authority_assessment:
        declaredCandidateAssessment,
      status: "OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENTS_PRESENT",
      observation_context_authority_provenance_assessments,
      ...summary,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENT_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateProvenanceAssessmentInvariant(assessment);
  return assessment;
}

function aggregateSetBooleans(
  assessments: AttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessment[]
): {
  has_observation_context_authority_provenance_assessments: boolean;
  has_direct_authority_provenance_paths: boolean;
  has_delegated_authority_provenance_paths: boolean;
  has_contested_authority_provenance_paths: boolean;
} {
  let has_observation_context_authority_provenance_assessments = false;
  let has_direct_authority_provenance_paths = false;
  let has_delegated_authority_provenance_paths = false;
  let has_contested_authority_provenance_paths = false;

  for (const assessment of assessments) {
    if (assessment.has_observation_context_authority_provenance_assessments) {
      has_observation_context_authority_provenance_assessments = true;
    }
    if (assessment.has_direct_authority_provenance_paths) {
      has_direct_authority_provenance_paths = true;
    }
    if (assessment.has_delegated_authority_provenance_paths) {
      has_delegated_authority_provenance_paths = true;
    }
    if (assessment.has_contested_authority_provenance_paths) {
      has_contested_authority_provenance_paths = true;
    }
  }

  return {
    has_observation_context_authority_provenance_assessments,
    has_direct_authority_provenance_paths,
    has_delegated_authority_provenance_paths,
    has_contested_authority_provenance_paths,
  };
}

/**
 * Pure set-level Observation-Context AUTHORITY Provenance Assessment.
 * Preserves GROUND-110 Candidate order and per-Candidate wrapper order.
 */
export function buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet(
  input: AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentEvalInput
): AttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSetAssessment {
  const candidate_assessments =
    input.observation_context_declared_authority_assessment_set.candidate_assessments.map(
      (declaredCandidateAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityObservationContextAuthorityProvenance(
          declaredCandidateAssessment,
          input.project_state
        )
    );

  return {
    observation_context_declared_authority_assessment_set:
      input.observation_context_declared_authority_assessment_set,
    candidate_assessments,
    ...aggregateSetBooleans(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENT_MODEL_LIMITATIONS,
    ],
  };
}
