/**
 * Reality Core v0.7 — Attention Observation Declared Permission Assessment
 * (GROUND-088).
 *
 * Pure composition of GROUND-087 Permission Observation-Context Binding
 * + GROUND-024 assessDeclaredInterventionPermission
 * + explicit Permission evaluation instant.
 *
 * Must not invent PERMITTED / DENIED / effective Permission / conflict winner.
 * Must not call Permission governance / Authority precedence.
 * Must not consume GROUND-083–085 / Operational Eligibility.
 *
 * Forbidden: StatePatch, applyPatch, saveProject, wall-clock default.
 *
 * Declared Permission Assessment ≠ current/effective Permission
 * Multiple bindings remain independent assessments
 * NO_EXPLICIT_*_BINDINGS ≠ NO_PERMISSION_DECLARATIONS
 * missing evaluation instant ≠ wall-clock now
 */

import {
  assertPermissionActorEntityExists,
  assertPermissionInterventionExists,
} from "./attention-observation-permission-context-binding-core.js";
import type {
  AttentionCandidateObservationPermissionContextBindingAssessment,
  AttentionObservationPermissionContextBinding,
  AttentionObservationPermissionContextBindingSetAssessment,
} from "./attention-observation-permission-context-binding-types.js";
import { assessDeclaredInterventionPermission } from "./permission-core.js";
import type {
  DeclaredInterventionPermissionAssessment,
} from "./permission-types.js";
import type {
  AttentionCandidateObservationDeclaredPermissionAssessment,
  AttentionObservationDeclaredPermissionAssessmentInput,
  AttentionObservationDeclaredPermissionAssessmentModelLimitation,
  AttentionObservationDeclaredPermissionAssessmentSet,
  AttentionObservationDeclaredPermissionAssessmentStatus,
  AttentionObservationDeclaredPermissionBindingAssessment,
  AttentionObservationDeclaredPermissionEvaluationInput,
  AttentionObservationDeclaredPermissionEvaluationSpecification,
} from "./attention-observation-declared-permission-assessment-types.js";
import type { ProjectState } from "../types.js";

export const ATTENTION_OBSERVATION_DECLARED_PERMISSION_ASSESSMENT_MODEL_LIMITATIONS: AttentionObservationDeclaredPermissionAssessmentModelLimitation[] =
  [
    "OBSERVATION_CONTEXT_PERMISSION_CURRENT_STATE_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_EFFECTIVE_STATE_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_DECLARATION_INTERPRETATION_POLICY_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_DECLARATION_INTERPRETATION_BASIS_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_CONFLICT_RESOLUTION_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_RECENCY_PRECEDENCE_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_MULTI_INSTANT_HISTORY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_COVERAGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Lexicographic ISO-8601 instant validation.
 * No Date.parse / locale / timezone coercion.
 */
const PERMISSION_EVALUATION_AT_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function assertPermissionEvaluationAt(
  permissionEvaluationAt: string
): string {
  if (
    !permissionEvaluationAt ||
    permissionEvaluationAt.trim().length === 0
  ) {
    throw new Error("permission_evaluation_at must be non-empty");
  }
  if (!PERMISSION_EVALUATION_AT_PATTERN.test(permissionEvaluationAt)) {
    throw new Error(
      `Malformed permission_evaluation_at: ${permissionEvaluationAt}`
    );
  }
  return permissionEvaluationAt;
}

/**
 * Canonical identity fragment for a GROUND-024 DeclaredInterventionPermissionAssessment.
 * status + sorted applicable declaration IDs.
 */
export function buildDeclaredInterventionPermissionAssessmentCanonicalKey(
  assessment: DeclaredInterventionPermissionAssessment
): string {
  const declarationIds = [...assessment.permission_declaration_ids].sort(
    compareStrings
  );
  const declarationSetKey =
    declarationIds.length === 0
      ? "EMPTY_APPLICABLE_PERMISSION_DECLARATION_SET"
      : declarationIds.join(",");
  return [assessment.status, declarationSetKey].join("|");
}

export function attentionObservationDeclaredPermissionAssessmentKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  permissionContextBindingKey: string,
  permissionEvaluationAt: string,
  declaredPermissionAssessmentCanonicalKey: string
): string {
  return [
    "attention-observation-declared-permission-assessment",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    permissionContextBindingKey,
    permissionEvaluationAt,
    declaredPermissionAssessmentCanonicalKey,
  ].join("|");
}

/**
 * Validates and normalizes evaluation-instant specification against 087 contexts.
 *
 * Exact duplicate instants for same Candidate → one.
 * Different instants for same Candidate → reject (no latest-wins).
 * Unknown Candidate → reject.
 * NOT_APPLICABLE contexts → reject.
 * NO_BINDINGS contexts may carry a dormant evaluation instant (no assessment synthesized).
 */
export function normalizeAttentionObservationDeclaredPermissionEvaluationSpecification(
  permissionContextBindingSet: AttentionObservationPermissionContextBindingSetAssessment,
  specification: AttentionObservationDeclaredPermissionEvaluationSpecification
): AttentionObservationDeclaredPermissionEvaluationSpecification {
  const byCandidateKey = new Map<
    string,
    AttentionCandidateObservationPermissionContextBindingAssessment
  >();
  for (const assessment of permissionContextBindingSet.candidate_assessments) {
    if (byCandidateKey.has(assessment.candidate_key)) {
      throw new Error(
        `Ambiguous Permission Observation-Context Binding assessment for candidate ${assessment.candidate_key}`
      );
    }
    byCandidateKey.set(assessment.candidate_key, assessment);
  }

  const evaluationByCandidateKey = new Map<
    string,
    AttentionObservationDeclaredPermissionEvaluationInput
  >();

  for (const entry of specification.evaluations) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const bindingAssessment = byCandidateKey.get(entry.candidate_key);
    if (!bindingAssessment) {
      throw new Error(
        `Candidate ${entry.candidate_key} not found in Permission Observation-Context Binding set`
      );
    }

    if (
      bindingAssessment.status ===
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      bindingAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    ) {
      throw new Error(
        `Declared Permission evaluation instant requires an applicable observation Permission Binding domain for candidate ${entry.candidate_key}`
      );
    }

    const permission_evaluation_at = assertPermissionEvaluationAt(
      entry.permission_evaluation_at
    );

    const existing = evaluationByCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (existing.permission_evaluation_at !== permission_evaluation_at) {
        throw new Error(
          `Conflicting Permission evaluation instants declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    evaluationByCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      permission_evaluation_at,
    });
  }

  const evaluations = [...evaluationByCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { evaluations };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationDeclaredPermissionAssessment
): void {
  if (
    assessment.status ===
    "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT"
  ) {
    if (assessment.permission_evaluation_at === null) {
      throw new Error(
        `Declared Permission Assessment invariant violated: PRESENT requires non-null evaluation instant for candidate ${assessment.candidate_key}`
      );
    }
    if (assessment.declared_permission_binding_assessments.length === 0) {
      throw new Error(
        `Declared Permission Assessment invariant violated: PRESENT requires non-empty assessments for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (
    assessment.status === "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  ) {
    if (assessment.permission_evaluation_at !== null) {
      throw new Error(
        `Declared Permission Assessment invariant violated: missing-instant status requires null evaluation instant for candidate ${assessment.candidate_key}`
      );
    }
  }

  if (assessment.declared_permission_binding_assessments.length !== 0) {
    throw new Error(
      `Declared Permission Assessment invariant violated: non-present status requires empty assessments for candidate ${assessment.candidate_key}`
    );
  }
}

function assertBindingContextConsistency(
  binding: AttentionObservationPermissionContextBinding,
  declared: DeclaredInterventionPermissionAssessment
): void {
  if (declared.actor_entity_id !== binding.permission_actor_entity_id) {
    throw new Error(
      `Declared Permission Assessment context mismatch for binding ${binding.key}: actor_entity_id differs from GROUND-087 binding`
    );
  }
  if (declared.intervention_id !== binding.permission_intervention_id) {
    throw new Error(
      `Declared Permission Assessment context mismatch for binding ${binding.key}: intervention_id differs from GROUND-087 binding`
    );
  }
}

function buildPerBindingAssessment(
  binding: AttentionObservationPermissionContextBinding,
  permissionEvaluationAt: string,
  projectState: ProjectState
): AttentionObservationDeclaredPermissionBindingAssessment {
  assertPermissionActorEntityExists(
    projectState,
    binding.permission_actor_entity_id
  );
  assertPermissionInterventionExists(
    projectState,
    binding.permission_intervention_id
  );

  const declared_permission_assessment = assessDeclaredInterventionPermission(
    projectState,
    binding.permission_actor_entity_id,
    binding.permission_intervention_id,
    permissionEvaluationAt
  );

  assertBindingContextConsistency(binding, declared_permission_assessment);

  if (declared_permission_assessment.at !== permissionEvaluationAt) {
    throw new Error(
      `Declared Permission Assessment invariant violated: evaluation instant drift for binding ${binding.key}`
    );
  }

  const applicable_permission_declaration_ids = [
    ...declared_permission_assessment.permission_declaration_ids,
  ];
  const declaredPermissionAssessmentCanonicalKey =
    buildDeclaredInterventionPermissionAssessmentCanonicalKey(
      declared_permission_assessment
    );

  return {
    key: attentionObservationDeclaredPermissionAssessmentKey(
      binding.candidate_key,
      binding.observation_need_key,
      binding.capability_requirement_set_key,
      binding.key,
      permissionEvaluationAt,
      declaredPermissionAssessmentCanonicalKey
    ),
    candidate_key: binding.candidate_key,
    observation_need_key: binding.observation_need_key,
    capability_requirement_set_key: binding.capability_requirement_set_key,
    permission_context_binding_key: binding.key,
    permission_actor_entity_id: binding.permission_actor_entity_id,
    permission_intervention_id: binding.permission_intervention_id,
    permission_evaluation_at: permissionEvaluationAt,
    declared_permission_status: declared_permission_assessment.status,
    applicable_permission_declaration_ids,
    declared_permission_assessment,
  };
}

/**
 * Pure Candidate-level Observation-Context Declared Permission Assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED
 * 5. OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT
 *
 * Does not invent effective Permission / ANY/ALL / Authority precedence.
 */
export function assessAttentionCandidateObservationDeclaredPermission(
  bindingAssessment: AttentionCandidateObservationPermissionContextBindingAssessment,
  evaluationByCandidateKey: ReadonlyMap<
    string,
    AttentionObservationDeclaredPermissionEvaluationInput
  >,
  projectState: ProjectState
): AttentionCandidateObservationDeclaredPermissionAssessment {
  const candidate_key = bindingAssessment.candidate_key;

  const empty = (
    status: AttentionObservationDeclaredPermissionAssessmentStatus,
    permission_evaluation_at: string | null
  ): AttentionCandidateObservationDeclaredPermissionAssessment => {
    const assessment: AttentionCandidateObservationDeclaredPermissionAssessment =
      {
        candidate_key,
        permission_context_binding_assessment: bindingAssessment,
        status,
        permission_evaluation_at,
        declared_permission_binding_assessments: [],
        model_limitations: [
          ...ATTENTION_OBSERVATION_DECLARED_PERMISSION_ASSESSMENT_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    bindingAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return empty("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", null);
  }

  if (
    bindingAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return empty("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", null);
  }

  if (
    bindingAssessment.status ===
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
    bindingAssessment.permission_context_bindings.length === 0
  ) {
    // Dormant evaluation instant may exist; do not synthesize Permission context.
    return empty(
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      null
    );
  }

  const evaluation = evaluationByCandidateKey.get(candidate_key);
  if (!evaluation) {
    return empty("NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED", null);
  }

  const permission_evaluation_at = evaluation.permission_evaluation_at;
  const declared_permission_binding_assessments =
    bindingAssessment.permission_context_bindings.map((binding) =>
      buildPerBindingAssessment(
        binding,
        permission_evaluation_at,
        projectState
      )
    );

  if (
    declared_permission_binding_assessments.length !==
    bindingAssessment.permission_context_bindings.length
  ) {
    throw new Error(
      `Declared Permission Assessment cardinality invariant violated for candidate ${candidate_key}`
    );
  }

  for (let i = 0; i < declared_permission_binding_assessments.length; i++) {
    const binding = bindingAssessment.permission_context_bindings[i]!;
    const perBinding = declared_permission_binding_assessments[i]!;
    if (perBinding.permission_context_binding_key !== binding.key) {
      throw new Error(
        `Declared Permission Assessment binding lineage mismatch for candidate ${candidate_key}`
      );
    }
    if (perBinding.candidate_key !== binding.candidate_key) {
      throw new Error(
        `Declared Permission Assessment candidate mismatch for binding ${binding.key}`
      );
    }
    if (perBinding.observation_need_key !== binding.observation_need_key) {
      throw new Error(
        `Declared Permission Assessment ObservationNeed mismatch for binding ${binding.key}`
      );
    }
    if (
      perBinding.capability_requirement_set_key !==
      binding.capability_requirement_set_key
    ) {
      throw new Error(
        `Declared Permission Assessment Requirement-set mismatch for binding ${binding.key}`
      );
    }
    if (
      perBinding.permission_actor_entity_id !==
      binding.permission_actor_entity_id
    ) {
      throw new Error(
        `Declared Permission Assessment actor mismatch for binding ${binding.key}`
      );
    }
    if (
      perBinding.permission_intervention_id !==
      binding.permission_intervention_id
    ) {
      throw new Error(
        `Declared Permission Assessment intervention mismatch for binding ${binding.key}`
      );
    }
  }

  const assessment: AttentionCandidateObservationDeclaredPermissionAssessment =
    {
      candidate_key,
      permission_context_binding_assessment: bindingAssessment,
      status: "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT",
      permission_evaluation_at,
      declared_permission_binding_assessments,
      model_limitations: [
        ...ATTENTION_OBSERVATION_DECLARED_PERMISSION_ASSESSMENT_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyDeclaredPermissionAssessments(
  assessments: AttentionCandidateObservationDeclaredPermissionAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Observation-Context Declared Permission Assessment.
 * Preserves GROUND-087 Candidate order and per-Candidate binding order.
 */
export function buildAttentionObservationDeclaredPermissionAssessmentSet(
  input: AttentionObservationDeclaredPermissionAssessmentInput
): AttentionObservationDeclaredPermissionAssessmentSet {
  const normalizedSpecification =
    normalizeAttentionObservationDeclaredPermissionEvaluationSpecification(
      input.permission_context_binding_set,
      input.specification
    );

  const evaluationByCandidateKey = new Map(
    normalizedSpecification.evaluations.map((entry) => [
      entry.candidate_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.permission_context_binding_set.candidate_assessments.map(
      (bindingAssessment) =>
        assessAttentionCandidateObservationDeclaredPermission(
          bindingAssessment,
          evaluationByCandidateKey,
          input.project_state
        )
    );

  return {
    permission_context_binding_set: input.permission_context_binding_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_observation_context_declared_permission_assessments:
      hasAnyDeclaredPermissionAssessments(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_DECLARED_PERMISSION_ASSESSMENT_MODEL_LIMITATIONS,
    ],
  };
}
