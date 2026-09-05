/**
 * Reality Core v0.7 — Attention Observation Permission Context Binding
 * (GROUND-087).
 *
 * Pure composition of GROUND-048 Explicit Capability Requirement Set
 * + ProjectState (Entity / Intervention existence validation only)
 * + explicit Permission Observation-Context Binding Specification.
 *
 * Binding identifies:
 *   observation context ↔ permission_actor_entity_id × permission_intervention_id
 *
 * Must not call permission-core declaration aggregation / temporal / governance.
 * Must not consume GROUND-083–085 / Operational Eligibility.
 *
 * Forbidden: StatePatch, applyPatch, saveProject, wall-clock,
 * Permission polarity / effective state / assignment / OE result.
 *
 * Binding ≠ declaration presence ≠ applicability ≠ polarity ≠ effective Permission
 * Multiple bindings ≠ conflict / ANY / ALL
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";
import type {
  AttentionCandidateObservationPermissionContextBindingAssessment,
  AttentionObservationPermissionContextBinding,
  AttentionObservationPermissionContextBindingEvalInput,
  AttentionObservationPermissionContextBindingInput,
  AttentionObservationPermissionContextBindingModelLimitation,
  AttentionObservationPermissionContextBindingSetAssessment,
  AttentionObservationPermissionContextBindingSpecification,
  AttentionObservationPermissionContextBindingStatus,
} from "./attention-observation-permission-context-binding-types.js";
import type { ProjectState } from "../types.js";

export {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export const ATTENTION_OBSERVATION_PERMISSION_CONTEXT_BINDING_MODEL_LIMITATIONS: AttentionObservationPermissionContextBindingModelLimitation[] =
  [
    "OBSERVATION_CONTEXT_PERMISSION_DECLARATION_ASSESSMENT_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_TEMPORAL_APPLICABILITY_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_CURRENT_STATE_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_EFFECTIVE_STATE_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_CONFLICT_RESOLUTION_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "OBSERVATION_CONTEXT_PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED",
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

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function attentionObservationPermissionContextBindingKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  permissionActorEntityId: string,
  permissionInterventionId: string
): string {
  return [
    "attention-observation-permission-context-binding",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    permissionActorEntityId,
    permissionInterventionId,
  ].join("|");
}

interface RequirementSetContext {
  candidateAssessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  observationNeedKey: string;
  requirements: AttentionObservationCapabilityRequirement[];
  capabilityRequirementKeys: string[];
  capabilityRequirementSetKey: string;
}

function collectRequirementSetContexts(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment
): Map<string, RequirementSetContext> {
  const byCandidateKey = new Map<string, RequirementSetContext>();

  for (const candidate of capabilityRequirementSet.candidate_requirements) {
    if (byCandidateKey.has(candidate.candidate_key)) {
      throw new Error(
        `Ambiguous Capability Requirement set context for candidate ${candidate.candidate_key}`
      );
    }

    const requirements =
      candidate.capability_requirement_basis?.requirements ?? [];
    const observationNeedKey =
      candidate.capability_requirement_basis?.observation_need_key ?? "";
    const capabilityRequirementKeys = canonicalizeCapabilityRequirementKeys(
      requirements.map((r) => r.key)
    );
    const capabilityRequirementSetKey =
      requirements.length === 0
        ? ""
        : buildAttentionObservationCapabilityRequirementSetKey(
            candidate.candidate_key,
            observationNeedKey,
            capabilityRequirementKeys
          );

    byCandidateKey.set(candidate.candidate_key, {
      candidateAssessment: candidate,
      observationNeedKey,
      requirements,
      capabilityRequirementKeys,
      capabilityRequirementSetKey,
    });
  }

  return byCandidateKey;
}

function assertNonEmptyId(value: string, label: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`${label} must be non-empty`);
  }
  return value;
}

/**
 * Read-only Entity existence + project consistency validation.
 * Does not inspect Permission declarations.
 */
export function assertPermissionActorEntityExists(
  projectState: ProjectState,
  permissionActorEntityId: string
): void {
  const actorId = assertNonEmptyId(
    permissionActorEntityId,
    "permission_actor_entity_id"
  );
  const entity = projectState.reality_entities.find(
    (entry) => entry.id === actorId
  );
  if (!entity) {
    throw new Error(
      `Unknown permission_actor_entity_id: ${actorId} not found in project reality_entities`
    );
  }
  if (entity.project_id !== projectState.project.id) {
    throw new Error(
      `Cross-project permission_actor_entity_id: ${actorId} belongs to project ${entity.project_id}, not ${projectState.project.id}`
    );
  }
}

/**
 * Read-only Intervention existence + project consistency validation.
 * Does not require Intervention to be temporally active.
 * Does not inspect Permission declarations.
 */
export function assertPermissionInterventionExists(
  projectState: ProjectState,
  permissionInterventionId: string
): void {
  const interventionId = assertNonEmptyId(
    permissionInterventionId,
    "permission_intervention_id"
  );
  const intervention = projectState.intervention_declarations.find(
    (entry) => entry.id === interventionId
  );
  if (!intervention) {
    throw new Error(
      `Unknown permission_intervention_id: ${interventionId} not found in project intervention_declarations`
    );
  }
  if (intervention.project_id !== projectState.project.id) {
    throw new Error(
      `Cross-project permission_intervention_id: ${interventionId} belongs to project ${intervention.project_id}, not ${projectState.project.id}`
    );
  }
}

function bindingPairKey(
  actorEntityId: string,
  interventionId: string
): string {
  return `${actorEntityId}|${interventionId}`;
}

function compareBindingInputs(
  a: AttentionObservationPermissionContextBindingInput,
  b: AttentionObservationPermissionContextBindingInput
): number {
  const actorCmp = compareStrings(
    a.permission_actor_entity_id,
    b.permission_actor_entity_id
  );
  if (actorCmp !== 0) {
    return actorCmp;
  }
  return compareStrings(
    a.permission_intervention_id,
    b.permission_intervention_id
  );
}

/**
 * Validates and normalizes Permission Observation-Context Binding specification.
 *
 * Exact duplicate actor×intervention pairs → one.
 * Distinct pairs retained (0..many). No conflict / ANY / ALL inference.
 * Unknown Candidate / zero-Requirement / no planning → reject.
 * Unknown Entity / Intervention / cross-project → reject.
 * Specification order has no semantic meaning.
 *
 * Does not read intervention_permission_declarations.
 */
export function normalizeAttentionObservationPermissionContextBindingSpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  projectState: ProjectState,
  specification: AttentionObservationPermissionContextBindingSpecification
): AttentionObservationPermissionContextBindingSpecification {
  const contexts = collectRequirementSetContexts(capabilityRequirementSet);
  const byCandidateKey = new Map<
    string,
    Map<string, AttentionObservationPermissionContextBindingInput>
  >();

  for (const entry of specification.bindings) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const context = contexts.get(entry.candidate_key);
    if (!context) {
      throw new Error(
        `Candidate ${entry.candidate_key} not found in explicit capability requirement set`
      );
    }

    if (
      context.candidateAssessment.status ===
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      context.candidateAssessment.capability_requirement_basis === null
    ) {
      throw new Error(
        `Permission Observation-Context Binding requires an Observation planning basis for candidate ${entry.candidate_key}`
      );
    }

    if (
      context.candidateAssessment.status ===
        "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED" ||
      !context.candidateAssessment.has_explicit_capability_requirements ||
      context.requirements.length === 0
    ) {
      throw new Error(
        `Permission Observation-Context Binding requires a non-empty Capability Requirement set for candidate ${entry.candidate_key}`
      );
    }

    const actorId = assertNonEmptyId(
      entry.permission_actor_entity_id,
      "permission_actor_entity_id"
    );
    const interventionId = assertNonEmptyId(
      entry.permission_intervention_id,
      "permission_intervention_id"
    );

    assertPermissionActorEntityExists(projectState, actorId);
    assertPermissionInterventionExists(projectState, interventionId);

    const normalized: AttentionObservationPermissionContextBindingInput = {
      candidate_key: entry.candidate_key,
      permission_actor_entity_id: actorId,
      permission_intervention_id: interventionId,
    };

    let candidateBindings = byCandidateKey.get(entry.candidate_key);
    if (!candidateBindings) {
      candidateBindings = new Map();
      byCandidateKey.set(entry.candidate_key, candidateBindings);
    }

    const pairKey = bindingPairKey(actorId, interventionId);
    if (!candidateBindings.has(pairKey)) {
      candidateBindings.set(pairKey, normalized);
    }
  }

  const bindings: AttentionObservationPermissionContextBindingInput[] = [];
  const candidateKeys = [...byCandidateKey.keys()].sort(compareStrings);
  for (const candidateKey of candidateKeys) {
    const pairs = [...byCandidateKey.get(candidateKey)!.values()].sort(
      compareBindingInputs
    );
    bindings.push(...pairs);
  }

  return { bindings };
}

function assertBindingAssessmentInvariant(
  assessment: AttentionCandidateObservationPermissionContextBindingAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT" &&
    assessment.permission_context_bindings.length === 0
  ) {
    throw new Error(
      `Permission Observation-Context Binding invariant violated: PRESENT requires non-empty bindings for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT" &&
    assessment.permission_context_bindings.length !== 0
  ) {
    throw new Error(
      `Permission Observation-Context Binding invariant violated: non-present status requires empty bindings for candidate ${assessment.candidate_key}`
    );
  }
}

function buildBinding(
  context: RequirementSetContext,
  input: AttentionObservationPermissionContextBindingInput
): AttentionObservationPermissionContextBinding {
  return {
    key: attentionObservationPermissionContextBindingKey(
      context.candidateAssessment.candidate_key,
      context.observationNeedKey,
      context.capabilityRequirementSetKey,
      input.permission_actor_entity_id,
      input.permission_intervention_id
    ),
    candidate_key: context.candidateAssessment.candidate_key,
    observation_need_key: context.observationNeedKey,
    capability_requirement_set_key: context.capabilityRequirementSetKey,
    capability_requirement_keys: [...context.capabilityRequirementKeys],
    permission_actor_entity_id: input.permission_actor_entity_id,
    permission_intervention_id: input.permission_intervention_id,
  };
}

/**
 * Pure per-AttentionCandidate Permission Observation-Context Binding assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT
 *
 * Does not assess Permission declarations / polarity / OE.
 */
export function assessAttentionCandidateObservationPermissionContextBinding(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  bindingsForCandidate: readonly AttentionObservationPermissionContextBindingInput[],
  context: RequirementSetContext
): AttentionCandidateObservationPermissionContextBindingAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationPermissionContextBindingStatus
  ): AttentionCandidateObservationPermissionContextBindingAssessment => {
    const assessment: AttentionCandidateObservationPermissionContextBindingAssessment =
      {
        candidate_key,
        capability_requirement_assessment: capabilityRequirementAssessment,
        status,
        permission_context_bindings: [],
        model_limitations: [
          ...ATTENTION_OBSERVATION_PERMISSION_CONTEXT_BINDING_MODEL_LIMITATIONS,
        ],
      };
    assertBindingAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    capabilityRequirementAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    capabilityRequirementAssessment.status ===
      "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED" ||
    !capabilityRequirementAssessment.has_explicit_capability_requirements ||
    capabilityRequirementAssessment.capability_requirement_basis === null ||
    context.requirements.length === 0
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (bindingsForCandidate.length === 0) {
    return notApplicable(
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    );
  }

  const permission_context_bindings = bindingsForCandidate.map((input) =>
    buildBinding(context, input)
  );

  const assessment: AttentionCandidateObservationPermissionContextBindingAssessment =
    {
      candidate_key,
      capability_requirement_assessment: capabilityRequirementAssessment,
      status: "EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT",
      permission_context_bindings,
      model_limitations: [
        ...ATTENTION_OBSERVATION_PERMISSION_CONTEXT_BINDING_MODEL_LIMITATIONS,
      ],
    };
  assertBindingAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitBindings(
  assessments: AttentionCandidateObservationPermissionContextBindingAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Explicit Permission Observation-Context Binding composition.
 * Preserves GROUND-048 AttentionCandidate order.
 * Does not inspect Permission declarations or produce Permission State / OE.
 */
export function buildAttentionObservationPermissionContextBindingSet(
  input: AttentionObservationPermissionContextBindingEvalInput
): AttentionObservationPermissionContextBindingSetAssessment {
  const contexts = collectRequirementSetContexts(
    input.capability_requirement_set
  );

  const normalizedSpecification =
    normalizeAttentionObservationPermissionContextBindingSpecification(
      input.capability_requirement_set,
      input.project_state,
      input.specification
    );

  const bindingsByCandidateKey = new Map<
    string,
    AttentionObservationPermissionContextBindingInput[]
  >();
  for (const binding of normalizedSpecification.bindings) {
    const existing = bindingsByCandidateKey.get(binding.candidate_key);
    if (existing) {
      existing.push(binding);
    } else {
      bindingsByCandidateKey.set(binding.candidate_key, [binding]);
    }
  }

  const candidate_assessments =
    input.capability_requirement_set.candidate_requirements.map(
      (capabilityRequirementAssessment) => {
        const context = contexts.get(
          capabilityRequirementAssessment.candidate_key
        );
        if (!context) {
          throw new Error(
            `Capability Requirement set context missing for candidate ${capabilityRequirementAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationPermissionContextBinding(
          capabilityRequirementAssessment,
          bindingsByCandidateKey.get(
            capabilityRequirementAssessment.candidate_key
          ) ?? [],
          context
        );
      }
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_permission_observation_context_bindings:
      hasAnyExplicitBindings(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_PERMISSION_CONTEXT_BINDING_MODEL_LIMITATIONS,
    ],
  };
}
