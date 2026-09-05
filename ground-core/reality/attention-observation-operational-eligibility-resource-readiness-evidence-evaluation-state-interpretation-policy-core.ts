/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Evidence Evaluation State Interpretation Policy (GROUND-139).
 *
 * Pure composition of GROUND-133 RESOURCE_READINESS Observation-Context Binding
 * + explicit interpretation-policy specification.
 *
 * GROUND-137 is type/canonicalization only — no current Evaluation State access.
 * Must not import GROUND-135/134/132/084/022, ProjectState, Permission, Authority, OE.
 *
 * Interpretation Policy ≠ Interpretation Basis ≠ canonical Resource Readiness Evidence State
 * INTERPRET_AS_* ≠ RESOURCE_READY / requirement satisfied
 * policy absence ≠ explicit empty policy; unusual mappings are valid
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import { attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey } from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus,
  AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation,
} from "./attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.js";
import type {
  ResourceAvailabilityAssessmentStatus,
  ResourceCapacityAssessmentStatus,
  ResourceDeclarationAssessmentStatus,
} from "./resource-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingInput,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification,
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyStatus,
} from "./attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyModelLimitation[] =
  [
    "CURRENT_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_LOOKUP_NOT_MODELED",
    "RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_NOT_MODELED",
    "PER_BINDING_CANONICAL_RESOURCE_READINESS_EVIDENCE_STATE_NOT_MODELED",
    "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_POLICY_NOT_MODELED",
    "PER_REQUIREMENT_RESOURCE_READINESS_BINDING_COMPOSITION_READINESS_NOT_MODELED",
    "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_STATE_NOT_MODELED",
    "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
    "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export const EMPTY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET =
  "EMPTY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET" as const;

export const CANONICAL_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_ORDER: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretation[] =
  [
    "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_POSITIVE",
    "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_NEGATIVE",
  ];

const DECLARATION_LOOKUP_STATUSES: readonly AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus[] =
  [
    "BOUND_RESOURCE_DECLARATION_FOUND",
    "BOUND_RESOURCE_DECLARATION_NOT_FOUND",
  ];

const REQUIREMENT_TEMPORAL_RELATIONS: readonly AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation[] =
  [
    "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT",
    "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT",
  ];

const RESOURCE_KEY_RELATIONS: readonly AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation[] =
  ["RESOURCE_KEY_EXACT_MATCH", "RESOURCE_KEY_DOES_NOT_EXACT_MATCH"];

const RESOURCE_UNIT_RELATIONS: readonly AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation[] =
  ["RESOURCE_UNIT_EXACT_MATCH", "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH"];

const RESOURCE_SCOPE_RELATIONS: readonly AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation[] =
  ["RESOURCE_SCOPE_EXACT_MATCH", "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH"];

const RESOURCE_DECLARATION_ASSESSMENT_STATUSES: readonly ResourceDeclarationAssessmentStatus[] =
  ["RESOURCE_DECLARATION_ACTIVE", "RESOURCE_DECLARATION_NOT_ACTIVE"];

const AVAILABILITY_ASSESSMENT_STATUSES: readonly ResourceAvailabilityAssessmentStatus[] =
  [
    "NO_AVAILABILITY_DECLARATIONS",
    "AVAILABLE_DECLARED",
    "UNAVAILABLE_DECLARED",
    "CONTESTED_AVAILABILITY",
  ];

const CAPACITY_ASSESSMENT_STATUSES: readonly ResourceCapacityAssessmentStatus[] =
  ["NO_ACTIVE_CAPACITY_DECLARATIONS", "ACTIVE_CAPACITY_DECLARATIONS_PRESENT"];

const INTERPRETATION_ORDER = new Map(
  CANONICAL_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_ORDER.map(
    (value, index) => [value, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeInterpretation(
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretation
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown RESOURCE_READINESS Evidence Evaluation State Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

function assertAxisPresent<T>(
  value: T | null | undefined,
  axisName: string
): asserts value is T | null {
  if (value === undefined) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: missing axis ${axisName}`
    );
  }
}

function assertCompleteStructuredStateValue(
  value: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue
): void {
  assertAxisPresent(value.declaration_lookup_status, "declaration_lookup_status");
  assertAxisPresent(value.requirement_temporal_relation, "requirement_temporal_relation");
  assertAxisPresent(value.resource_key_relation, "resource_key_relation");
  assertAxisPresent(value.resource_unit_relation, "resource_unit_relation");
  assertAxisPresent(value.resource_scope_relation, "resource_scope_relation");
  assertAxisPresent(
    value.resource_declaration_assessment_status,
    "resource_declaration_assessment_status"
  );
  assertAxisPresent(value.availability_assessment_status, "availability_assessment_status");
  assertAxisPresent(value.capacity_assessment_status, "capacity_assessment_status");
  assertAxisPresent(
    value.has_multiple_capacity_declarations,
    "has_multiple_capacity_declarations"
  );
  assertAxisPresent(value.has_capacity_divergence, "has_capacity_divergence");
  assertAxisPresent(value.has_temporal_basis_mismatch, "has_temporal_basis_mismatch");

  if (!DECLARATION_LOOKUP_STATUSES.includes(value.declaration_lookup_status)) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: unknown declaration_lookup_status ${String(value.declaration_lookup_status)}`
    );
  }

  if (!REQUIREMENT_TEMPORAL_RELATIONS.includes(value.requirement_temporal_relation)) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: unknown requirement_temporal_relation ${String(value.requirement_temporal_relation)}`
    );
  }

  if (
    value.declaration_lookup_status === "BOUND_RESOURCE_DECLARATION_NOT_FOUND"
  ) {
    for (const axis of [
      "resource_key_relation",
      "resource_unit_relation",
      "resource_scope_relation",
      "resource_declaration_assessment_status",
      "availability_assessment_status",
      "capacity_assessment_status",
      "has_multiple_capacity_declarations",
      "has_capacity_divergence",
      "has_temporal_basis_mismatch",
    ] as const) {
      if (value[axis] !== null) {
        throw new Error(
          `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: NOT_FOUND requires null ${axis}`
        );
      }
    }
    return;
  }

  if (value.resource_key_relation === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null resource_key_relation"
    );
  }
  if (value.resource_unit_relation === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null resource_unit_relation"
    );
  }
  if (value.resource_scope_relation === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null resource_scope_relation"
    );
  }
  if (value.resource_declaration_assessment_status === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null resource_declaration_assessment_status"
    );
  }
  if (value.availability_assessment_status === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null availability_assessment_status"
    );
  }
  if (value.capacity_assessment_status === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null capacity_assessment_status"
    );
  }
  if (value.has_multiple_capacity_declarations === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null has_multiple_capacity_declarations"
    );
  }
  if (value.has_capacity_divergence === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null has_capacity_divergence"
    );
  }
  if (value.has_temporal_basis_mismatch === null) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: FOUND requires non-null has_temporal_basis_mismatch"
    );
  }

  if (!RESOURCE_KEY_RELATIONS.includes(value.resource_key_relation)) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: unknown resource_key_relation ${String(value.resource_key_relation)}`
    );
  }
  if (!RESOURCE_UNIT_RELATIONS.includes(value.resource_unit_relation)) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: unknown resource_unit_relation ${String(value.resource_unit_relation)}`
    );
  }
  if (!RESOURCE_SCOPE_RELATIONS.includes(value.resource_scope_relation)) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: unknown resource_scope_relation ${String(value.resource_scope_relation)}`
    );
  }
  if (
    !RESOURCE_DECLARATION_ASSESSMENT_STATUSES.includes(
      value.resource_declaration_assessment_status
    )
  ) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: unknown resource_declaration_assessment_status ${String(value.resource_declaration_assessment_status)}`
    );
  }
  if (
    !AVAILABILITY_ASSESSMENT_STATUSES.includes(
      value.availability_assessment_status
    )
  ) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: unknown availability_assessment_status ${String(value.availability_assessment_status)}`
    );
  }
  if (!CAPACITY_ASSESSMENT_STATUSES.includes(value.capacity_assessment_status)) {
    throw new Error(
      `Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: unknown capacity_assessment_status ${String(value.capacity_assessment_status)}`
    );
  }

  if (
    value.has_capacity_divergence === true &&
    value.has_multiple_capacity_declarations === false
  ) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: has_capacity_divergence=true requires has_multiple_capacity_declarations=true"
    );
  }

  if (
    value.has_temporal_basis_mismatch === true &&
    value.resource_declaration_assessment_status === "RESOURCE_DECLARATION_ACTIVE"
  ) {
    throw new Error(
      "Malformed RESOURCE_READINESS Evidence Evaluation State mapping source: has_temporal_basis_mismatch=true requires RESOURCE_DECLARATION_NOT_ACTIVE"
    );
  }
}

/**
 * Validate and canonicalize one complete GROUND-137 structured evidence value.
 */
export function normalizeResourceReadinessEvidenceEvaluationStateValue(
  value: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue {
  assertCompleteStructuredStateValue(value);
  return {
    declaration_lookup_status: value.declaration_lookup_status,
    requirement_temporal_relation: value.requirement_temporal_relation,
    resource_key_relation: value.resource_key_relation,
    resource_unit_relation: value.resource_unit_relation,
    resource_scope_relation: value.resource_scope_relation,
    resource_declaration_assessment_status:
      value.resource_declaration_assessment_status,
    availability_assessment_status: value.availability_assessment_status,
    capacity_assessment_status: value.capacity_assessment_status,
    has_multiple_capacity_declarations: value.has_multiple_capacity_declarations,
    has_capacity_divergence: value.has_capacity_divergence,
    has_temporal_basis_mismatch: value.has_temporal_basis_mismatch,
  };
}

export function attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMappingKey(
  value: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue,
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretation
): string {
  const normalizedValue = normalizeResourceReadinessEvidenceEvaluationStateValue(value);
  const normalizedInterpretation = normalizeInterpretation(interpretation);
  return [
    "resource-readiness-evidence-evaluation-state-interpretation-mapping",
    attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
      normalizedValue
    ),
    normalizedInterpretation,
  ].join("|");
}

export function canonicalizeResourceReadinessEvidenceEvaluationStateInterpretationMappings(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[]
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[] {
  const byCanonicalKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping
  >();

  for (const mapping of mappings) {
    const resource_readiness_evidence_evaluation_state_value =
      normalizeResourceReadinessEvidenceEvaluationStateValue(
        mapping.resource_readiness_evidence_evaluation_state_value
      );
    const interpretation = normalizeInterpretation(mapping.interpretation);
    const canonicalKey =
      attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
        resource_readiness_evidence_evaluation_state_value
      );
    const existing = byCanonicalKey.get(canonicalKey);
    if (existing !== undefined) {
      if (existing.interpretation !== interpretation) {
        throw new Error(
          `Conflicting RESOURCE_READINESS Evidence Evaluation State Interpretation mappings for structured state ${canonicalKey}`
        );
      }
      continue;
    }
    byCanonicalKey.set(canonicalKey, {
      resource_readiness_evidence_evaluation_state_value,
      interpretation,
    });
  }

  return [...byCanonicalKey.values()].sort((a, b) =>
    compareStrings(
      attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
        a.resource_readiness_evidence_evaluation_state_value
      ),
      attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
        b.resource_readiness_evidence_evaluation_state_value
      )
    )
  );
}

export function buildCanonicalResourceReadinessEvidenceEvaluationStateInterpretationMappingSetKey(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[]
): string {
  const canonical =
    canonicalizeResourceReadinessEvidenceEvaluationStateInterpretationMappings(
      mappings
    );
  if (canonical.length === 0) {
    return EMPTY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET;
  }
  return canonical
    .map(
      (mapping) =>
        `${attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(mapping.resource_readiness_evidence_evaluation_state_value)}=${mapping.interpretation}`
    )
    .join(",");
}

export function attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicyKey(params: {
  candidateKey: string;
  observationNeedKey: string;
  capabilityRequirementSetKey: string;
  observationResourceRequirementKey: string;
  resourceReadinessObservationContextBindingKey: string;
  resourceDeclarationId: string;
  canonicalMappingSetKey: string;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy",
    params.candidateKey,
    params.observationNeedKey,
    params.capabilityRequirementSetKey,
    "RESOURCE_READINESS",
    params.observationResourceRequirementKey,
    params.resourceReadinessObservationContextBindingKey,
    params.resourceDeclarationId,
    params.canonicalMappingSetKey,
  ].join("|");
}

function mappingsEqual(
  a: readonly AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[],
  b: readonly AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const left = a[i]!;
    const right = b[i]!;
    if (left.interpretation !== right.interpretation) {
      return false;
    }
    if (
      attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
        left.resource_readiness_evidence_evaluation_state_value
      ) !==
      attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey(
        right.resource_readiness_evidence_evaluation_state_value
      )
    ) {
      return false;
    }
  }
  return true;
}

function collectBindingsByKey(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment
): Map<string, AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding> {
  const byKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding
  >();

  for (const candidate of bindingSet.candidate_assessments) {
    for (const binding of candidate.bindings) {
      if (byKey.has(binding.key)) {
        throw new Error(
          `Ambiguous RESOURCE_READINESS Observation-Context Binding key ${binding.key}`
        );
      }
      if (binding.candidate_key !== candidate.candidate_key) {
        throw new Error(
          `RESOURCE_READINESS Observation-Context Binding ${binding.key} candidate mismatch`
        );
      }
      byKey.set(binding.key, binding);
    }
  }

  return byKey;
}

export function normalizeAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification {
  const bindingsByKey = collectBindingsByKey(bindingSet);
  const byBindingKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingInput
  >();

  for (const entry of specification.binding_policies) {
    if (
      !entry.resource_readiness_observation_context_binding_key ||
      entry.resource_readiness_observation_context_binding_key.trim().length ===
        0
    ) {
      throw new Error(
        "resource_readiness_observation_context_binding_key must be non-empty"
      );
    }

    const binding = bindingsByKey.get(
      entry.resource_readiness_observation_context_binding_key
    );
    if (!binding) {
      throw new Error(
        `RESOURCE_READINESS Observation-Context Binding ${entry.resource_readiness_observation_context_binding_key} not found in binding set`
      );
    }

    const normalizedMappings =
      canonicalizeResourceReadinessEvidenceEvaluationStateInterpretationMappings(
        entry.mappings
      );
    const existing = byBindingKey.get(
      entry.resource_readiness_observation_context_binding_key
    );
    if (existing) {
      if (!mappingsEqual(existing.mappings, normalizedMappings)) {
        throw new Error(
          `Conflicting RESOURCE_READINESS Evidence Evaluation State Interpretation Policies declared for binding ${entry.resource_readiness_observation_context_binding_key}`
        );
      }
      continue;
    }

    byBindingKey.set(entry.resource_readiness_observation_context_binding_key, {
      resource_readiness_observation_context_binding_key:
        entry.resource_readiness_observation_context_binding_key,
      mappings: normalizedMappings,
    });
  }

  const binding_policies = [...byBindingKey.values()].sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return { binding_policies };
}

function buildPolicy(
  binding: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding,
  mappings: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[]
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicy {
  const mappingSetKey =
    buildCanonicalResourceReadinessEvidenceEvaluationStateInterpretationMappingSetKey(
      mappings
    );
  return {
    key: attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicyKey(
      {
        candidateKey: binding.candidate_key,
        observationNeedKey: binding.observation_need_key,
        capabilityRequirementSetKey: binding.capability_requirement_set_key,
        observationResourceRequirementKey:
          binding.observation_resource_requirement_key,
        resourceReadinessObservationContextBindingKey: binding.key,
        resourceDeclarationId: binding.resource_declaration_id,
        canonicalMappingSetKey: mappingSetKey,
      }
    ),
    candidate_key: binding.candidate_key,
    observation_need_key: binding.observation_need_key,
    capability_requirement_set_key: binding.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      binding.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key: binding.key,
    resource_declaration_id: binding.resource_declaration_id,
    mappings: [...mappings],
  };
}

function assertBindingPolicyInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT" &&
    assessment.policy === null
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Policy invariant violated: PRESENT requires non-null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED" &&
    assessment.policy !== null
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Policy invariant violated: NO_POLICY requires null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (
    assessment.has_explicit_resource_readiness_evidence_interpretation_policy !==
    (assessment.status ===
      "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT")
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Policy invariant violated: has_explicit mismatch for binding ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }

  if (
    assessment.binding.key !==
    assessment.resource_readiness_observation_context_binding_key
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Policy invariant violated: binding key mismatch for ${assessment.resource_readiness_observation_context_binding_key}`
    );
  }
}

function assessBindingPolicy(
  binding: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding,
  policyByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingInput
  >
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment {
  const declared = policyByBindingKey.get(binding.key);
  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment =
      {
        resource_readiness_observation_context_binding_key: binding.key,
        binding,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED",
        policy: null,
        has_explicit_resource_readiness_evidence_interpretation_policy: false,
      };
    assertBindingPolicyInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment =
    {
      resource_readiness_observation_context_binding_key: binding.key,
      binding,
      status:
        "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT",
      policy: buildPolicy(binding, declared.mappings),
      has_explicit_resource_readiness_evidence_interpretation_policy: true,
    };
  assertBindingPolicyInvariant(assessment);
  return assessment;
}

function summarizeBindingPolicies(
  assessments: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingAssessment[]
): {
  has_explicit_resource_readiness_evidence_interpretation_policies: boolean;
} {
  return {
    has_explicit_resource_readiness_evidence_interpretation_policies:
      assessments.some(
        (assessment) =>
          assessment.has_explicit_resource_readiness_evidence_interpretation_policy
      ),
  };
}

function assessRequirementPolicy(
  requirementBindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
  policyByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingInput
  >
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyRequirementAssessment {
  const binding_policy_assessments = requirementBindingAssessment.bindings.map(
    (binding) => assessBindingPolicy(binding, policyByBindingKey)
  );
  return {
    observation_resource_requirement_key:
      requirementBindingAssessment.observation_resource_requirement_key,
    requirement_binding_assessment: requirementBindingAssessment,
    binding_policy_assessments,
    ...summarizeBindingPolicies(binding_policy_assessments),
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment
): void {
  const bindingCount =
    assessment.resource_readiness_observation_context_binding_assessment
      .bindings.length;
  const requirementBindingCount =
    assessment.resource_readiness_observation_context_binding_assessment
      .requirement_binding_assessments.length;
  const flatSummary = summarizeBindingPolicies(
    assessment.binding_policy_assessments
  );

  if (
    assessment.has_explicit_resource_readiness_evidence_interpretation_policies !==
    flatSummary.has_explicit_resource_readiness_evidence_interpretation_policies
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Policy invariant violated: has_explicit summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (assessment.binding_policy_assessments.length !== bindingCount) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Policy cardinality invariant violated for candidate ${assessment.candidate_key}`
    );
  }

  if (bindingCount === 0) {
    if (assessment.requirement_policy_assessments.length !== requirementBindingCount) {
      throw new Error(
        `RESOURCE_READINESS Evidence Interpretation Policy requirement cardinality invariant violated for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (
    assessment.requirement_policy_assessments.length !== requirementBindingCount
  ) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Policy requirement cardinality invariant violated for candidate ${assessment.candidate_key}`
    );
  }

  const groupedCount = assessment.requirement_policy_assessments.reduce(
    (sum, requirementAssessment) =>
      sum + requirementAssessment.binding_policy_assessments.length,
    0
  );
  if (groupedCount !== assessment.binding_policy_assessments.length) {
    throw new Error(
      `RESOURCE_READINESS Evidence Interpretation Policy grouped/flat mismatch for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicy(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  policyByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyBindingInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment {
  const candidate_key = bindingAssessment.candidate_key;

  const empty =
    (): AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment => {
      const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment =
        {
          candidate_key,
          resource_readiness_observation_context_binding_assessment:
            bindingAssessment,
          requirement_policy_assessments: [],
          binding_policy_assessments: [],
          has_explicit_resource_readiness_evidence_interpretation_policies:
            false,
          model_limitations: [
            ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
          ],
        };
      assertCandidateAssessmentInvariant(assessment);
      return assessment;
    };

  if (
    bindingAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return empty();
  }

  if (
    bindingAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return empty();
  }

  if (
    bindingAssessment.status ===
    "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  ) {
    return empty();
  }

  if (
    bindingAssessment.status ===
    "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
  ) {
    return empty();
  }

  if (
    bindingAssessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    const requirement_policy_assessments =
      bindingAssessment.requirement_binding_assessments.map(
        (requirementBindingAssessment) =>
          assessRequirementPolicy(requirementBindingAssessment, policyByBindingKey)
      );
    const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment =
      {
        candidate_key,
        resource_readiness_observation_context_binding_assessment:
          bindingAssessment,
        requirement_policy_assessments,
        binding_policy_assessments: [],
        has_explicit_resource_readiness_evidence_interpretation_policies: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  }

  const requirement_policy_assessments =
    bindingAssessment.requirement_binding_assessments.map(
      (requirementBindingAssessment) =>
        assessRequirementPolicy(requirementBindingAssessment, policyByBindingKey)
    );

  const binding_policy_assessments = bindingAssessment.bindings.map((binding) =>
    assessBindingPolicy(binding, policyByBindingKey)
  );

  const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyAssessment =
    {
      candidate_key,
      resource_readiness_observation_context_binding_assessment:
        bindingAssessment,
      requirement_policy_assessments,
      binding_policy_assessments,
      ...summarizeBindingPolicies(binding_policy_assessments),
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

export function buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet(
  input: AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicyEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification(
      input.resource_readiness_observation_context_binding_set,
      input.specification
    );

  const policyByBindingKey = new Map(
    normalizedSpecification.binding_policies.map((policy) => [
      policy.resource_readiness_observation_context_binding_key,
      policy,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_observation_context_binding_set.candidate_assessments.map(
      (bindingAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicy(
          bindingAssessment,
          policyByBindingKey
        )
    );

  return {
    resource_readiness_observation_context_binding_set:
      input.resource_readiness_observation_context_binding_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_resource_readiness_evidence_interpretation_policies:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_resource_readiness_evidence_interpretation_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
