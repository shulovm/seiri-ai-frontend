/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Observation-Context Binding (GROUND-133).
 *
 * Pure composition of GROUND-132 Explicit Observation Resource Requirement Set
 * + explicit RESOURCE_READINESS Observation-Context Binding Specification.
 *
 * Binding designates which resource_declaration_id may later be inspected as
 * evidence for an exact Observation Resource Requirement — without lookup or match.
 *
 * Forbidden: state-engine, file-store, studio, persisted project state,
 * GROUND-048 direct, GROUND-084, ResourceDeclaration assessment, availability,
 * capacity, commitment, contention, feasibility, Permission, Authority runtime access.
 *
 * Binding ≠ existence ≠ match ≠ selection ≠ allocation ≠ readiness
 * Multiple bindings ≠ conflict / ANY / ALL
 */

import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "./attention-observation-resource-requirement-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetInput,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingStatus,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingModelLimitation[] =
  [
    "RESOURCE_DECLARATION_EXISTENCE_NOT_EVALUATED",
    "RESOURCE_REQUIREMENT_TO_DECLARATION_MATCH_NOT_EVALUATED",
    "OBSERVATION_RESOURCE_READINESS_EVALUATION_INSTANT_NOT_MODELED",
    "OBSERVATION_RESOURCE_EVIDENCE_ASSESSMENT_NOT_MODELED",
    "OBSERVATION_RESOURCE_QUANTITY_SUFFICIENCY_NOT_MODELED",
    "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_PARTIAL_FULFILLMENT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  observationResourceRequirementKey: string,
  resourceDeclarationId: string
): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-observation-context-binding",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    observationResourceRequirementKey,
    resourceDeclarationId,
  ].join("|");
}

interface ResourceRequirementContext {
  candidateAssessment: AttentionCandidateObservationResourceRequirementSetAssessment;
  requirements: AttentionObservationResourceRequirement[];
  requirementByKey: Map<string, AttentionObservationResourceRequirement>;
}

function isExplicitEmptyRequirementSet(
  assessment: AttentionCandidateObservationResourceRequirementSetAssessment
): boolean {
  return (
    assessment.status ===
      "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT" &&
    assessment.has_explicit_observation_resource_requirement_set &&
    assessment.resource_requirements.length === 0
  );
}

function isNonEmptyRequirementSet(
  assessment: AttentionCandidateObservationResourceRequirementSetAssessment
): boolean {
  return (
    assessment.status ===
      "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT" &&
    assessment.has_observation_resource_requirements &&
    assessment.resource_requirements.length > 0
  );
}

function collectResourceRequirementContexts(
  observationResourceRequirementSet: AttentionObservationResourceRequirementSetAssessment
): Map<string, ResourceRequirementContext> {
  const byCandidateKey = new Map<string, ResourceRequirementContext>();

  for (const candidate of observationResourceRequirementSet.candidate_assessments) {
    if (byCandidateKey.has(candidate.candidate_key)) {
      throw new Error(
        `Ambiguous Observation Resource Requirement context for candidate ${candidate.candidate_key}`
      );
    }

    const requirements = [...candidate.resource_requirements].sort((a, b) =>
      compareStrings(a.key, b.key)
    );
    const requirementByKey = new Map<string, AttentionObservationResourceRequirement>();
    for (const requirement of requirements) {
      requirementByKey.set(requirement.key, requirement);
    }

    byCandidateKey.set(candidate.candidate_key, {
      candidateAssessment: candidate,
      requirements,
      requirementByKey,
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

function bindingInputSignature(
  input: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput
): string {
  return `${input.observation_resource_requirement_key}|${input.resource_declaration_id}`;
}

function canonicalizeBindingInputs(
  bindings: readonly AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput[]
): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput[] {
  const bySignature = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput
  >();

  for (const raw of bindings) {
    const observation_resource_requirement_key = assertNonEmptyId(
      raw.observation_resource_requirement_key,
      "observation_resource_requirement_key"
    );
    const resource_declaration_id = assertNonEmptyId(
      raw.resource_declaration_id,
      "resource_declaration_id"
    );
    const normalized = {
      observation_resource_requirement_key,
      resource_declaration_id,
    };
    bySignature.set(bindingInputSignature(normalized), normalized);
  }

  return [...bySignature.values()].sort((a, b) =>
    compareStrings(bindingInputSignature(a), bindingInputSignature(b))
  );
}

function bindingSetsEqual(
  a: readonly AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput[],
  b: readonly AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput[]
): boolean {
  const canonicalA = canonicalizeBindingInputs(a);
  const canonicalB = canonicalizeBindingInputs(b);
  if (canonicalA.length !== canonicalB.length) {
    return false;
  }
  for (let i = 0; i < canonicalA.length; i++) {
    if (
      bindingInputSignature(canonicalA[i]!) !==
      bindingInputSignature(canonicalB[i]!)
    ) {
      return false;
    }
  }
  return true;
}

function resolveRequirementForCandidate(
  context: ResourceRequirementContext,
  candidateKey: string,
  observationResourceRequirementKey: string
): AttentionObservationResourceRequirement {
  const requirement = context.requirementByKey.get(
    observationResourceRequirementKey
  );
  if (!requirement) {
    throw new Error(
      `Unknown observation_resource_requirement_key ${observationResourceRequirementKey} for candidate ${candidateKey}`
    );
  }
  if (requirement.candidate_key !== candidateKey) {
    throw new Error(
      `observation_resource_requirement_key ${observationResourceRequirementKey} does not belong to candidate ${candidateKey}`
    );
  }
  return requirement;
}

function validateBindingsForCandidate(
  context: ResourceRequirementContext,
  candidateKey: string,
  bindings: readonly AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput[]
): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingInput[] {
  const candidateAssessment = context.candidateAssessment;

  if (
    candidateAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    candidateAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    throw new Error(
      `RESOURCE_READINESS Observation Context Binding requires an applicable Observation Resource Requirement context for candidate ${candidateKey}`
    );
  }

  if (
    candidateAssessment.status ===
    "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  ) {
    if (bindings.length > 0) {
      throw new Error(
        `Observation Resource Requirement set is not declared for candidate ${candidateKey}; bindings cannot target requirement keys`
      );
    }
    return [];
  }

  if (isExplicitEmptyRequirementSet(candidateAssessment)) {
    if (bindings.length > 0) {
      throw new Error(
        `Explicit empty Observation Resource Requirement set for candidate ${candidateKey}; bindings cannot target requirement keys`
      );
    }
    return [];
  }

  if (!isNonEmptyRequirementSet(candidateAssessment)) {
    throw new Error(
      `Observation Resource Requirement context is not eligible for binding for candidate ${candidateKey}`
    );
  }

  const normalized = canonicalizeBindingInputs(bindings);
  for (const binding of normalized) {
    resolveRequirementForCandidate(
      context,
      candidateKey,
      binding.observation_resource_requirement_key
    );
  }

  return normalized;
}

/**
 * Validates and normalizes RESOURCE_READINESS Observation Context Binding specification
 * against represented GROUND-132 Candidate / requirement contexts.
 *
 * Exact duplicate candidate entries → one.
 * Same Candidate + different binding sets → reject.
 * Unknown / outer / absent-requirement-set / explicit-empty with bindings → reject.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification(
  observationResourceRequirementSet: AttentionObservationResourceRequirementSetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification
): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification {
  const contexts = collectResourceRequirementContexts(
    observationResourceRequirementSet
  );
  const byCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetInput
  >();

  for (const entry of specification.candidate_binding_sets) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const context = contexts.get(entry.candidate_key);
    if (!context) {
      throw new Error(
        `Candidate ${entry.candidate_key} not found in Observation Resource Requirement set`
      );
    }

    const normalizedBindings = validateBindingsForCandidate(
      context,
      entry.candidate_key,
      entry.bindings
    );

    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (!bindingSetsEqual(existing.bindings, normalizedBindings)) {
        throw new Error(
          `Conflicting RESOURCE_READINESS Observation Context Binding sets declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      bindings: normalizedBindings,
    });
  }

  const candidate_binding_sets = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { candidate_binding_sets };
}

function buildBinding(
  requirement: AttentionObservationResourceRequirement,
  resourceDeclarationId: string
): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding {
  return {
    key: attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey(
      requirement.candidate_key,
      requirement.observation_need_key,
      requirement.capability_requirement_set_key,
      requirement.key,
      resourceDeclarationId
    ),
    candidate_key: requirement.candidate_key,
    observation_need_key: requirement.observation_need_key,
    capability_requirement_set_key: requirement.capability_requirement_set_key,
    observation_resource_requirement_key: requirement.key,
    resource_declaration_id: resourceDeclarationId,
  };
}

function assertCandidateBindingAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment
): void {
  const hasBindings = assessment.bindings.length > 0;
  if (
    hasBindings !== assessment.has_resource_readiness_observation_context_bindings
  ) {
    throw new Error(
      `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: candidate binding boolean must match bindings length`
    );
  }

  for (const requirementAssessment of assessment.requirement_binding_assessments) {
    const reqHasBindings = requirementAssessment.bindings.length > 0;
    if (
      reqHasBindings !==
      requirementAssessment.has_resource_readiness_observation_context_bindings
    ) {
      throw new Error(
        `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: per-requirement binding boolean must match bindings length`
      );
    }
  }

  const expectedRequirementCount =
    assessment.observation_resource_requirement_set_assessment
      .resource_requirements.length;
  if (
    assessment.requirement_binding_assessments.length !==
    expectedRequirementCount
  ) {
    throw new Error(
      `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: expected ${expectedRequirementCount} requirement binding assessments`
    );
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    assessment.status ===
      "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED" ||
    assessment.status === "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
  ) {
    if (assessment.bindings.length !== 0) {
      throw new Error(
        `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: outer/absent/empty status requires zero bindings`
      );
    }
    if (assessment.requirement_binding_assessments.length !== 0) {
      throw new Error(
        `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: outer/absent/empty status requires zero requirement binding assessments`
      );
    }
    if (assessment.has_resource_readiness_observation_context_bindings) {
      throw new Error(
        `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: outer/absent/empty status requires has_bindings=false`
      );
    }
  }

  if (
    assessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    if (assessment.has_resource_readiness_observation_context_bindings) {
      throw new Error(
        `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: NO_BINDINGS status requires has_bindings=false`
      );
    }
    if (assessment.bindings.length !== 0) {
      throw new Error(
        `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: NO_BINDINGS status requires zero bindings`
      );
    }
  }

  if (
    assessment.status ===
    "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
  ) {
    if (!assessment.has_resource_readiness_observation_context_bindings) {
      throw new Error(
        `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: PRESENT status requires has_bindings=true`
      );
    }
    if (assessment.bindings.length === 0) {
      throw new Error(
        `RESOURCE_READINESS Observation Context Binding invariant violated for candidate ${assessment.candidate_key}: PRESENT status requires at least one binding`
      );
    }
  }
}

/**
 * Pure per-Candidate RESOURCE_READINESS Observation Context Binding assessment.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBinding(
  observationResourceRequirementSetAssessment: AttentionCandidateObservationResourceRequirementSetAssessment,
  bindingSetByCandidateKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment {
  const candidate_key = observationResourceRequirementSetAssessment.candidate_key;

  const outerResult = (
    status: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingStatus
  ): AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment =
      {
        candidate_key,
        observation_resource_requirement_set_assessment:
          observationResourceRequirementSetAssessment,
        status,
        requirement_binding_assessments: [],
        bindings: [],
        has_resource_readiness_observation_context_bindings: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateBindingAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    observationResourceRequirementSetAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return outerResult("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    observationResourceRequirementSetAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return outerResult("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    observationResourceRequirementSetAssessment.status ===
    "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  ) {
    return outerResult("NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED");
  }

  if (isExplicitEmptyRequirementSet(observationResourceRequirementSetAssessment)) {
    return outerResult("EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY");
  }

  const requirements = [
    ...observationResourceRequirementSetAssessment.resource_requirements,
  ].sort((a, b) => compareStrings(a.key, b.key));

  const declared = bindingSetByCandidateKey.get(candidate_key);
  const declaredBindings = declared?.bindings ?? [];

  const bindingsByRequirementKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding[]
  >();
  for (const requirement of requirements) {
    bindingsByRequirementKey.set(requirement.key, []);
  }

  for (const bindingInput of declaredBindings) {
    const requirement = requirements.find(
      (entry) => entry.key === bindingInput.observation_resource_requirement_key
    );
    if (!requirement) {
      throw new Error(
        `Unknown observation_resource_requirement_key ${bindingInput.observation_resource_requirement_key} for candidate ${candidate_key}`
      );
    }
    bindingsByRequirementKey
      .get(requirement.key)!
      .push(
        buildBinding(requirement, bindingInput.resource_declaration_id)
      );
  }

  const requirement_binding_assessments: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment[] =
    requirements.map((requirement) => {
      const bindings = (
        bindingsByRequirementKey.get(requirement.key) ?? []
      ).sort((a, b) => compareStrings(a.key, b.key));
      return {
        observation_resource_requirement_key: requirement.key,
        resource_requirement: requirement,
        bindings,
        has_resource_readiness_observation_context_bindings: bindings.length > 0,
      };
    });

  const bindings = requirement_binding_assessments
    .flatMap((entry) => entry.bindings)
    .sort((a, b) => compareStrings(a.key, b.key));

  const hasBindings = bindings.length > 0;

  const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment =
    {
      candidate_key,
      observation_resource_requirement_set_assessment:
        observationResourceRequirementSetAssessment,
      status: hasBindings
        ? "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
        : "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      requirement_binding_assessments,
      bindings,
      has_resource_readiness_observation_context_bindings: hasBindings,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateBindingAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyResourceReadinessObservationContextBindings(
  assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment[]
): boolean {
  return assessments.some(
    (a) => a.has_resource_readiness_observation_context_bindings
  );
}

/**
 * Pure set-level RESOURCE_READINESS Observation Context Binding composition.
 * Preserves GROUND-132 AttentionCandidate order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
  input: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification(
      input.observation_resource_requirement_set,
      input.specification
    );

  const bindingSetByCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetInput
  >();
  for (const entry of normalizedSpecification.candidate_binding_sets) {
    bindingSetByCandidateKey.set(entry.candidate_key, entry);
  }

  const candidate_assessments =
    input.observation_resource_requirement_set.candidate_assessments.map(
      (observationResourceRequirementSetAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBinding(
          observationResourceRequirementSetAssessment,
          bindingSetByCandidateKey
        )
    );

  return {
    observation_resource_requirement_set: input.observation_resource_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_resource_readiness_observation_context_bindings:
      hasAnyResourceReadinessObservationContextBindings(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
    ],
  };
}
