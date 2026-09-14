import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Observation-Context Declared AUTHORITY Assessment (GROUND-110).
 *
 * Pure composition of GROUND-109 AUTHORITY Evaluation Instant Assessment
 * + ProjectState
 * + existing GROUND-019 assessDeclaredAuthority.
 *
 * For each exact GROUND-108 Authority binding embedded in GROUND-109:
 *   assessDeclaredAuthority(holder, power, scope, exact 109 at)
 *
 * Must not call Authority provenance / Delegation / Contest / Standing / Mandate.
 * Must not consume GROUND-020–106 OE semantics.
 *
 * Forbidden: StatePatch, applyPatch, saveProject, wall-clock default.
 *
 * DECLARED_AUTHORITY_PRESENT ≠ AUTHORIZED
 * NO_DECLARED_AUTHORITY ≠ UNAUTHORIZED
 * Multiple bindings ≠ aggregation / winner
 */

import type { AttentionObservationOperationalEligibilityAuthorityObservationContextBinding } from "./attention-observation-operational-eligibility-authority-observation-context-binding-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment,
} from "./attention-observation-operational-eligibility-authority-evaluation-instant-types.js";
import {
  assessDeclaredAuthority,
  governanceScopeKey,
} from "./governance-core.js";
import type {
  DeclaredAuthorityAssessment,
  DeclaredAuthorityStatus,
} from "./governance-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment,
  AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentEvalInput,
  AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentModelLimitation,
  AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSetAssessment,
  AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentStatus,
} from "./attention-observation-operational-eligibility-observation-context-declared-authority-assessment-types.js";
import type { ProjectState } from "../types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_PROVENANCE_ASSESSMENT_NOT_MODELED",
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

/**
 * Canonical identity fragment for a GROUND-019 DeclaredAuthorityAssessment.
 * status + sorted applicable declaration IDs + multiplicity flag.
 */
export function buildDeclaredAuthorityAssessmentCanonicalKey(
  assessment: DeclaredAuthorityAssessment
): string {
  const declarationIds = [...assessment.authority_declaration_ids].sort(
    compareStrings
  );
  const declarationSetKey =
    declarationIds.length === 0
      ? "EMPTY_APPLICABLE_AUTHORITY_DECLARATION_SET"
      : declarationIds.join(",");
  return [
    assessment.status,
    declarationSetKey,
    assessment.has_multiple_declarations ? "MULTIPLE" : "SINGLE",
  ].join("|");
}

export function attentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  authorityObservationContextBindingKey: string,
  authorityHolderEntityId: string,
  authorityPower: string,
  governanceScopeKeyValue: string,
  authorityEvaluationInstantKey: string,
  authorityEvaluationAt: string,
  declaredAuthorityAssessmentCanonicalKey: string
): string {
  return [
    "attention-observation-operational-eligibility-observation-context-declared-authority-assessment",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    "AUTHORITY",
    authorityObservationContextBindingKey,
    authorityHolderEntityId,
    authorityPower,
    governanceScopeKeyValue,
    authorityEvaluationInstantKey,
    temporalInstantKey(authorityEvaluationAt),
    declaredAuthorityAssessmentCanonicalKey,
  ].join("|");
}

function scopesStructurallyEqual(
  a: AttentionObservationOperationalEligibilityAuthorityObservationContextBinding["governance_scope"],
  b: AttentionObservationOperationalEligibilityAuthorityObservationContextBinding["governance_scope"]
): boolean {
  return governanceScopeKey(a) === governanceScopeKey(b);
}

function assertBindingInstantLineageConsistency(
  binding: AttentionObservationOperationalEligibilityAuthorityObservationContextBinding,
  instantAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment
): void {
  const instant = instantAssessment.authority_evaluation_instant;
  if (instant === null) {
    throw new Error(
      `Declared AUTHORITY Assessment requires explicit evaluation instant for binding ${binding.key}`
    );
  }

  if (binding.candidate_key !== instantAssessment.candidate_key) {
    throw new Error(
      `Declared AUTHORITY Assessment candidate mismatch for binding ${binding.key}`
    );
  }
  if (binding.candidate_key !== instant.candidate_key) {
    throw new Error(
      `Declared AUTHORITY Assessment instant candidate mismatch for binding ${binding.key}`
    );
  }
  if (binding.observation_need_key !== instant.observation_need_key) {
    throw new Error(
      `Declared AUTHORITY Assessment ObservationNeed mismatch for binding ${binding.key}`
    );
  }
  if (
    binding.capability_requirement_set_key !== instant.capability_requirement_set_key
  ) {
    throw new Error(
      `Declared AUTHORITY Assessment Requirement-set mismatch for binding ${binding.key}`
    );
  }
}

function assertDeclaredAuthorityContextConsistency(
  binding: AttentionObservationOperationalEligibilityAuthorityObservationContextBinding,
  authorityEvaluationAt: string,
  declared: DeclaredAuthorityAssessment
): void {
  if (declared.holder_entity_id !== binding.authority_holder_entity_id) {
    throw new Error(
      `Declared AUTHORITY Assessment context mismatch for binding ${binding.key}: holder_entity_id differs from GROUND-108 binding`
    );
  }
  if (declared.power !== binding.authority_power) {
    throw new Error(
      `Declared AUTHORITY Assessment context mismatch for binding ${binding.key}: power differs from GROUND-108 binding`
    );
  }
  if (!scopesStructurallyEqual(declared.scope, binding.governance_scope)) {
    throw new Error(
      `Declared AUTHORITY Assessment context mismatch for binding ${binding.key}: scope differs from GROUND-108 binding`
    );
  }
  if (compareTemporalInstants(declared.at, authorityEvaluationAt) !== 0) {
    throw new Error(
      `Declared AUTHORITY Assessment invariant violated: evaluation instant drift for binding ${binding.key}`
    );
  }
}

function buildPerBindingAssessment(
  binding: AttentionObservationOperationalEligibilityAuthorityObservationContextBinding,
  instantAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment,
  projectState: ProjectState
): AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment {
  assertBindingInstantLineageConsistency(binding, instantAssessment);

  const instant = instantAssessment.authority_evaluation_instant!;
  const authority_evaluation_at = instant.authority_evaluation_at;

  const declared_authority_assessment = assessDeclaredAuthority(
    projectState,
    binding.authority_holder_entity_id,
    binding.authority_power,
    binding.governance_scope,
    authority_evaluation_at
  );

  assertDeclaredAuthorityContextConsistency(
    binding,
    authority_evaluation_at,
    declared_authority_assessment
  );

  const declaredAuthorityAssessmentCanonicalKey =
    buildDeclaredAuthorityAssessmentCanonicalKey(declared_authority_assessment);

  return {
    key: attentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentKey(
      binding.candidate_key,
      binding.observation_need_key,
      binding.capability_requirement_set_key,
      binding.key,
      binding.authority_holder_entity_id,
      binding.authority_power,
      binding.governance_scope_key,
      instant.key,
      authority_evaluation_at,
      declaredAuthorityAssessmentCanonicalKey
    ),
    candidate_key: binding.candidate_key,
    observation_need_key: binding.observation_need_key,
    capability_requirement_set_key: binding.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key: binding.key,
    authority_holder_entity_id: binding.authority_holder_entity_id,
    authority_power: binding.authority_power,
    governance_scope: binding.governance_scope,
    governance_scope_key: binding.governance_scope_key,
    authority_evaluation_instant_key: instant.key,
    authority_evaluation_at,
    declared_authority_status: declared_authority_assessment.status,
    declared_authority_assessment,
  };
}

function summarizeRawStatusBooleans(
  assessments: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment[]
): {
  has_observation_context_declared_authority_assessments: boolean;
  has_declared_authority_present_assessments: boolean;
  has_no_declared_authority_assessments: boolean;
  has_declarer_not_entity_assessments: boolean;
} {
  let has_declared_authority_present_assessments = false;
  let has_no_declared_authority_assessments = false;
  let has_declarer_not_entity_assessments = false;

  for (const assessment of assessments) {
    switch (assessment.declared_authority_status) {
      case "DECLARED_AUTHORITY_PRESENT":
        has_declared_authority_present_assessments = true;
        break;
      case "NO_DECLARED_AUTHORITY":
        has_no_declared_authority_assessments = true;
        break;
      case "DECLARER_NOT_ENTITY":
        has_declarer_not_entity_assessments = true;
        break;
    }
  }

  return {
    has_observation_context_declared_authority_assessments:
      assessments.length > 0,
    has_declared_authority_present_assessments,
    has_no_declared_authority_assessments,
    has_declarer_not_entity_assessments,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment
): void {
  const summary = summarizeRawStatusBooleans(
    assessment.observation_context_declared_authority_assessments
  );

  if (
    assessment.has_observation_context_declared_authority_assessments !==
    summary.has_observation_context_declared_authority_assessments
  ) {
    throw new Error(
      `Declared AUTHORITY Assessment invariant violated: has_assessments mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_declared_authority_present_assessments !==
    summary.has_declared_authority_present_assessments
  ) {
    throw new Error(
      `Declared AUTHORITY Assessment invariant violated: has_present mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_no_declared_authority_assessments !==
    summary.has_no_declared_authority_assessments
  ) {
    throw new Error(
      `Declared AUTHORITY Assessment invariant violated: has_no_declared mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_declarer_not_entity_assessments !==
    summary.has_declarer_not_entity_assessments
  ) {
    throw new Error(
      `Declared AUTHORITY Assessment invariant violated: has_declarer_not_entity mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENTS_PRESENT" &&
    assessment.observation_context_declared_authority_assessments.length === 0
  ) {
    throw new Error(
      `Declared AUTHORITY Assessment invariant violated: PRESENT requires non-empty assessments for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENTS_PRESENT" &&
    assessment.observation_context_declared_authority_assessments.length !== 0
  ) {
    throw new Error(
      `Declared AUTHORITY Assessment invariant violated: non-present status requires empty assessments for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure per-Candidate Observation-Context Declared AUTHORITY Assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED
 * 5. OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENTS_PRESENT
 *
 * Does not invent canonical Authority / ANY/ALL / provenance / OE.
 */
export function assessAttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthority(
  instantAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment,
  projectState: ProjectState
): AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment {
  const candidate_key = instantAssessment.candidate_key;
  const bindingAssessment =
    instantAssessment.authority_observation_context_binding_assessment;

  const empty = (
    status: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentStatus
  ): AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment =
      {
        candidate_key,
        authority_evaluation_instant_assessment: instantAssessment,
        status,
        observation_context_declared_authority_assessments: [],
        has_observation_context_declared_authority_assessments: false,
        has_declared_authority_present_assessments: false,
        has_no_declared_authority_assessments: false,
        has_declarer_not_entity_assessments: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENT_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    instantAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return empty("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    instantAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return empty("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    instantAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
    bindingAssessment.authority_observation_context_bindings.length === 0
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED");
  }

  if (
    instantAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED" ||
    instantAssessment.authority_evaluation_instant === null
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED");
  }

  const observation_context_declared_authority_assessments =
    bindingAssessment.authority_observation_context_bindings.map((binding) =>
      buildPerBindingAssessment(binding, instantAssessment, projectState)
    );

  if (
    observation_context_declared_authority_assessments.length !==
    bindingAssessment.authority_observation_context_bindings.length
  ) {
    throw new Error(
      `Declared AUTHORITY Assessment cardinality invariant violated for candidate ${candidate_key}`
    );
  }

  for (let i = 0; i < observation_context_declared_authority_assessments.length; i++) {
    const binding = bindingAssessment.authority_observation_context_bindings[i]!;
    const wrapper = observation_context_declared_authority_assessments[i]!;
    if (
      wrapper.authority_observation_context_binding_key !== binding.key
    ) {
      throw new Error(
        `Declared AUTHORITY Assessment binding lineage mismatch for candidate ${candidate_key}`
      );
    }
    if (compareTemporalInstants(wrapper.authority_evaluation_at, instantAssessment.authority_evaluation_instant!.authority_evaluation_at) !== 0) {
      throw new Error(
        `Declared AUTHORITY Assessment instant mismatch for binding ${binding.key}`
      );
    }
  }

  const summary = summarizeRawStatusBooleans(
    observation_context_declared_authority_assessments
  );

  const assessment: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment =
    {
      candidate_key,
      authority_evaluation_instant_assessment: instantAssessment,
      status: "OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENTS_PRESENT",
      observation_context_declared_authority_assessments,
      ...summary,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENT_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

function aggregateSetBooleans(
  assessments: AttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessment[]
): {
  has_observation_context_declared_authority_assessments: boolean;
  has_declared_authority_present_assessments: boolean;
  has_no_declared_authority_assessments: boolean;
  has_declarer_not_entity_assessments: boolean;
} {
  let has_observation_context_declared_authority_assessments = false;
  let has_declared_authority_present_assessments = false;
  let has_no_declared_authority_assessments = false;
  let has_declarer_not_entity_assessments = false;

  for (const assessment of assessments) {
    if (assessment.has_observation_context_declared_authority_assessments) {
      has_observation_context_declared_authority_assessments = true;
    }
    if (assessment.has_declared_authority_present_assessments) {
      has_declared_authority_present_assessments = true;
    }
    if (assessment.has_no_declared_authority_assessments) {
      has_no_declared_authority_assessments = true;
    }
    if (assessment.has_declarer_not_entity_assessments) {
      has_declarer_not_entity_assessments = true;
    }
  }

  return {
    has_observation_context_declared_authority_assessments,
    has_declared_authority_present_assessments,
    has_no_declared_authority_assessments,
    has_declarer_not_entity_assessments,
  };
}

/**
 * Pure set-level Observation-Context Declared AUTHORITY Assessment.
 * Preserves GROUND-109 Candidate order and per-Candidate binding order.
 */
export function buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet(
  input: AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentEvalInput
): AttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSetAssessment {
  const candidate_assessments =
    input.authority_evaluation_instant_set.candidate_assessments.map(
      (instantAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityObservationContextDeclaredAuthority(
          instantAssessment,
          input.project_state
        )
    );

  return {
    authority_evaluation_instant_set: input.authority_evaluation_instant_set,
    candidate_assessments,
    ...aggregateSetBooleans(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENT_MODEL_LIMITATIONS,
    ],
  };
}
