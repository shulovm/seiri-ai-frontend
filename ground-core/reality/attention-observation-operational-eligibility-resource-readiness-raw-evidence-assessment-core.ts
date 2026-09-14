import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Raw Evidence Assessment (GROUND-135).
 *
 * Pure composition of GROUND-133 RESOURCE_READINESS Observation-Context Binding
 * + GROUND-134 RESOURCE_READINESS Evaluation Instant
 * + ProjectState (read-only) + existing GROUND-022 assessResource.
 *
 * For each exact GROUND-133 binding at exact GROUND-134 evaluation_at:
 *   exact ResourceDeclaration lookup + neutral structural relations + ResourceAssessment
 *
 * Must not emit RESOURCE_READY / NOT_READY / satisfaction / OE / can_execute.
 * Must not consume Reservation / Commitment / Contention / Feasibility / Permission / Authority.
 *
 * Forbidden: StatePatch, applyPatch, saveProject, wall-clock default, fallback discovery.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-evaluation-instant-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type { AttentionObservationResourceRequirement } from "./attention-observation-resource-requirement-types.js";
import {
  assessResource,
  resourceScopesEqual,
} from "./resource-core.js";
import type { ResourceAssessment } from "./resource-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentStatus,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementRawEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus,
  AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation,
  AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation,
} from "./attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.js";
import type { ProjectState } from "../types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentModelLimitation[] =
  [
    "OBSERVATION_RESOURCE_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_QUANTITY_SUFFICIENCY_NOT_MODELED",
    "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_BEYOND_EXACT_MATCH_NOT_MODELED",
    "OBSERVATION_RESOURCE_SCOPE_SUBSUMPTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_MODELED_IN_RAW_READINESS_ASSESSMENT",
    "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_MODELED_IN_RAW_READINESS_ASSESSMENT",
    "OBSERVATION_RESOURCE_PARTIAL_FULFILLMENT_NOT_MODELED",
    "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_NOT_MODELED",
    "EXPLICIT_RESOURCE_READINESS_INTERPRETATION_POLICY_NOT_MODELED",
    "RESOURCE_READINESS_INTERPRETATION_BASIS_NOT_MODELED",
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

function deepEqualJson(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * GROUND-023 / GROUND-026 resource-requirement-at-time semantics extended for
 * nullable GROUND-132 valid_from / valid_until bounds.
 *
 * Lower: valid_from !== null && valid_from > at → does not apply
 * Upper: valid_until !== null && at >= valid_until → does not apply (exclusive upper, same as intervention)
 */
export function isObservationResourceRequirementApplicableAt(
  requirement: AttentionObservationResourceRequirement,
  at: string
): boolean {
  if (requirement.valid_from !== null && compareTemporalInstants(requirement.valid_from, at) > 0) {
    return false;
  }
  if (requirement.valid_until !== null && compareTemporalInstants(at, requirement.valid_until) >= 0) {
    return false;
  }
  return true;
}

export function assessObservationResourceRequirementTemporalRelation(
  requirement: AttentionObservationResourceRequirement,
  at: string
): AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation {
  return isObservationResourceRequirementApplicableAt(requirement, at)
    ? "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT"
    : "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT";
}

export function buildResourceAssessmentCanonicalKey(
  assessment: ResourceAssessment
): string {
  const capacityIds = [...assessment.capacity.capacity_declaration_ids].sort(
    compareStrings
  );
  const availabilityIds = [
    ...assessment.availability.availability_declaration_ids,
  ].sort(compareStrings);
  return [
    assessment.resource.id,
    temporalInstantKey(assessment.at),
    assessment.declaration_status,
    assessment.availability.status,
    assessment.capacity.status,
    capacityIds.join(",") || "NONE",
    availabilityIds.join(",") || "NONE",
  ].join("|");
}

export function attentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessmentKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  observationResourceRequirementKey: string,
  bindingKey: string,
  resourceDeclarationId: string,
  evaluationInstantKey: string,
  evaluationAt: string,
  declarationLookupStatus: AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus,
  requirementTemporalRelation: AttentionObservationOperationalEligibilityResourceReadinessRequirementTemporalRelation,
  resourceKeyRelation: AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation | null,
  resourceUnitRelation: AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation | null,
  resourceScopeRelation: AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation | null,
  resourceAssessmentCanonicalKey: string | null
): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-raw-binding-evidence-assessment",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    "RESOURCE_READINESS",
    observationResourceRequirementKey,
    bindingKey,
    resourceDeclarationId,
    evaluationInstantKey,
    temporalInstantKey(evaluationAt),
    declarationLookupStatus,
    requirementTemporalRelation,
    resourceKeyRelation ?? "NONE",
    resourceUnitRelation ?? "NONE",
    resourceScopeRelation ?? "NONE",
    resourceAssessmentCanonicalKey ?? "NONE",
  ].join("|");
}

function lookupBoundResourceDeclaration(
  projectState: ProjectState,
  resourceDeclarationId: string
): AttentionObservationOperationalEligibilityResourceReadinessResourceDeclarationLookupStatus {
  const found = projectState.resource_declarations.some(
    (entry) => entry.id === resourceDeclarationId
  );
  return found
    ? "BOUND_RESOURCE_DECLARATION_FOUND"
    : "BOUND_RESOURCE_DECLARATION_NOT_FOUND";
}

function assessResourceKeyRelation(
  requirement: AttentionObservationResourceRequirement,
  declarationResourceKey: string
): AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation {
  return requirement.resource_key === declarationResourceKey
    ? "RESOURCE_KEY_EXACT_MATCH"
    : "RESOURCE_KEY_DOES_NOT_EXACT_MATCH";
}

function assessResourceUnitRelation(
  requirement: AttentionObservationResourceRequirement,
  declarationUnit: string
): AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation {
  return requirement.unit === declarationUnit
    ? "RESOURCE_UNIT_EXACT_MATCH"
    : "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH";
}

function assessResourceScopeRelation(
  requirement: AttentionObservationResourceRequirement,
  declarationScope: Parameters<typeof resourceScopesEqual>[1]
): AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation {
  return resourceScopesEqual(requirement.resource_scope, declarationScope)
    ? "RESOURCE_SCOPE_EXACT_MATCH"
    : "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH";
}

function buildPerBindingRawEvidenceAssessment(
  binding: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding,
  requirement: AttentionObservationResourceRequirement,
  instantAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment,
  projectState: ProjectState
): AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment {
  const instant = instantAssessment.resource_readiness_evaluation_instant!;
  const evaluation_at = instant.evaluation_at;
  const requirement_temporal_relation =
    assessObservationResourceRequirementTemporalRelation(requirement, evaluation_at);

  const lookupStatus = lookupBoundResourceDeclaration(
    projectState,
    binding.resource_declaration_id
  );

  let resource_key_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceKeyRelation | null =
    null;
  let resource_unit_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceUnitRelation | null =
    null;
  let resource_scope_relation: AttentionObservationOperationalEligibilityResourceReadinessResourceScopeRelation | null =
    null;
  let resource_assessment: ResourceAssessment | null = null;
  let resourceAssessmentCanonicalKey: string | null = null;

  if (lookupStatus === "BOUND_RESOURCE_DECLARATION_FOUND") {
    resource_assessment = assessResource(
      projectState,
      binding.resource_declaration_id,
      evaluation_at
    );
    resourceAssessmentCanonicalKey = buildResourceAssessmentCanonicalKey(
      resource_assessment
    );
    resource_key_relation = assessResourceKeyRelation(
      requirement,
      resource_assessment.resource.resource_key
    );
    resource_unit_relation = assessResourceUnitRelation(
      requirement,
      resource_assessment.resource.unit
    );
    resource_scope_relation = assessResourceScopeRelation(
      requirement,
      resource_assessment.resource.scope
    );
  }

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessmentKey(
      binding.candidate_key,
      binding.observation_need_key,
      binding.capability_requirement_set_key,
      binding.observation_resource_requirement_key,
      binding.key,
      binding.resource_declaration_id,
      instant.key,
      evaluation_at,
      lookupStatus,
      requirement_temporal_relation,
      resource_key_relation,
      resource_unit_relation,
      resource_scope_relation,
      resourceAssessmentCanonicalKey
    ),
    candidate_key: binding.candidate_key,
    observation_need_key: binding.observation_need_key,
    capability_requirement_set_key: binding.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      binding.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key: binding.key,
    resource_declaration_id: binding.resource_declaration_id,
    resource_readiness_evaluation_instant_key: instant.key,
    evaluation_at,
    resource_declaration_lookup_status: lookupStatus,
    requirement_temporal_relation,
    resource_key_relation,
    resource_unit_relation,
    resource_scope_relation,
    resource_assessment,
  };
}

function mapInstantStatusToRawEvidenceStatus(
  instantStatus: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment["status"]
): AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentStatus | null {
  switch (instantStatus) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
    case "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED":
    case "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY":
    case "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED":
    case "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED":
      return instantStatus;
    case "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT":
      return null;
    default: {
      const _exhaustive: never = instantStatus;
      void _exhaustive;
      throw new Error(
        `Unknown RESOURCE_READINESS evaluation instant status: ${String(instantStatus)}`
      );
    }
  }
}

function assertCandidateRawEvidenceAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment
): void {
  const expectedHas = assessment.raw_binding_evidence_assessments.length > 0;
  if (
    assessment.has_resource_readiness_raw_evidence_assessments !== expectedHas
  ) {
    throw new Error(
      `RESOURCE_READINESS Raw Evidence Assessment invariant violated: has_raw mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT" &&
    assessment.raw_binding_evidence_assessments.length === 0
  ) {
    throw new Error(
      `RESOURCE_READINESS Raw Evidence Assessment invariant violated: PRESENT requires non-empty raw binding assessments for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT" &&
    assessment.raw_binding_evidence_assessments.length !== 0
  ) {
    throw new Error(
      `RESOURCE_READINESS Raw Evidence Assessment invariant violated: non-present status requires empty raw binding assessments for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT" &&
    assessment.requirement_raw_evidence_assessments.length !== 0
  ) {
    throw new Error(
      `RESOURCE_READINESS Raw Evidence Assessment invariant violated: non-present status requires empty requirement raw evidence assessments for candidate ${assessment.candidate_key}`
    );
  }

  const instant = assessment.resource_readiness_evaluation_instant_assessment
    .resource_readiness_evaluation_instant;
  if (assessment.raw_binding_evidence_assessments.length > 0) {
    if (instant === null) {
      throw new Error(
        `RESOURCE_READINESS Raw Evidence Assessment invariant violated: raw assessments require explicit instant for candidate ${assessment.candidate_key}`
      );
    }
    for (const raw of assessment.raw_binding_evidence_assessments) {
      if (compareTemporalInstants(raw.evaluation_at, instant.evaluation_at) !== 0) {
        throw new Error(
          `RESOURCE_READINESS Raw Evidence Assessment temporal coherence violated for binding ${raw.resource_readiness_observation_context_binding_key}`
        );
      }
      if (raw.resource_readiness_evaluation_instant_key !== instant.key) {
        throw new Error(
          `RESOURCE_READINESS Raw Evidence Assessment instant key coherence violated for binding ${raw.resource_readiness_observation_context_binding_key}`
        );
      }
    }
  }
}

function buildRequirementRawEvidenceAssessments(
  requirementBindingAssessments: AttentionObservationOperationalEligibilityResourceReadinessRequirementBindingAssessment[],
  rawByRequirementKey: Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment[]
  >
): AttentionObservationOperationalEligibilityResourceReadinessRequirementRawEvidenceAssessment[] {
  return requirementBindingAssessments.map((requirementBindingAssessment) => {
    const raw_binding_evidence_assessments = [
      ...(rawByRequirementKey.get(
        requirementBindingAssessment.observation_resource_requirement_key
      ) ?? []),
    ].sort((a, b) => compareStrings(a.key, b.key));

    return {
      observation_resource_requirement_key:
        requirementBindingAssessment.observation_resource_requirement_key,
      resource_requirement: requirementBindingAssessment.resource_requirement,
      requirement_binding_assessment: requirementBindingAssessment,
      raw_binding_evidence_assessments,
      has_raw_resource_readiness_evidence_assessments:
        raw_binding_evidence_assessments.length > 0,
    };
  });
}

function validateCrossInput(
  input: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentEvalInput
): void {
  const bindingSet = input.resource_readiness_observation_context_binding_set;
  const instantSet = input.resource_readiness_evaluation_instant_set;

  if (
    !deepEqualJson(
      instantSet.resource_readiness_observation_context_binding_set,
      bindingSet
    )
  ) {
    throw new Error(
      "Stale RESOURCE_READINESS evaluation instant set: embedded binding set does not match current GROUND-133 binding set"
    );
  }

  const bindingByKey = new Map<
    string,
    AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment
  >();
  for (const assessment of bindingSet.candidate_assessments) {
    if (bindingByKey.has(assessment.candidate_key)) {
      throw new Error(
        `Duplicate RESOURCE_READINESS binding assessment for candidate ${assessment.candidate_key}`
      );
    }
    bindingByKey.set(assessment.candidate_key, assessment);
  }

  const instantByKey = new Map<
    string,
    AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment
  >();
  for (const assessment of instantSet.candidate_assessments) {
    if (instantByKey.has(assessment.candidate_key)) {
      throw new Error(
        `Duplicate RESOURCE_READINESS evaluation instant assessment for candidate ${assessment.candidate_key}`
      );
    }
    instantByKey.set(assessment.candidate_key, assessment);
  }

  if (bindingByKey.size !== instantByKey.size) {
    throw new Error(
      "RESOURCE_READINESS raw evidence assessment candidate set mismatch between GROUND-133 and GROUND-134"
    );
  }

  for (const [candidateKey, bindingAssessment] of bindingByKey) {
    const instantAssessment = instantByKey.get(candidateKey);
    if (!instantAssessment) {
      throw new Error(
        `Missing RESOURCE_READINESS evaluation instant assessment for candidate ${candidateKey}`
      );
    }

    const nestedBinding =
      instantAssessment.resource_readiness_observation_context_binding_assessment;
    if (nestedBinding !== bindingAssessment) {
      if (!deepEqualJson(nestedBinding, bindingAssessment)) {
        throw new Error(
          `Stale RESOURCE_READINESS binding lineage for candidate ${candidateKey}: GROUND-134 must nest exact current GROUND-133 assessment`
        );
      }
    }

    const binding = bindingAssessment.bindings[0];
    const instant = instantAssessment.resource_readiness_evaluation_instant;
    if (binding && instant) {
      if (binding.observation_need_key !== instant.observation_need_key) {
        throw new Error(
          `ObservationNeed key mismatch for candidate ${candidateKey}`
        );
      }
      if (
        binding.capability_requirement_set_key !==
        instant.capability_requirement_set_key
      ) {
        throw new Error(
          `Capability Requirement-set key mismatch for candidate ${candidateKey}`
        );
      }
      if (instant.dimension !== "RESOURCE_READINESS") {
        throw new Error(
          `Dimension mismatch for candidate ${candidateKey}: expected RESOURCE_READINESS`
        );
      }
    }
  }

  for (const candidateKey of instantByKey.keys()) {
    if (!bindingByKey.has(candidateKey)) {
      throw new Error(
        `Extra RESOURCE_READINESS evaluation instant assessment for unknown candidate ${candidateKey}`
      );
    }
  }
}

/**
 * Pure per-Candidate RESOURCE_READINESS Raw Evidence Assessment.
 * Reads ProjectState only when GROUND-134 explicit instant is present.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidence(
  instantAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment,
  projectState: ProjectState
): AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment {
  const candidate_key = instantAssessment.candidate_key;
  const bindingAssessment =
    instantAssessment.resource_readiness_observation_context_binding_assessment;

  const empty = (
    status: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentStatus
  ): AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment =
      {
        candidate_key,
        resource_readiness_evaluation_instant_assessment: instantAssessment,
        status,
        requirement_raw_evidence_assessments: [],
        raw_binding_evidence_assessments: [],
        has_resource_readiness_raw_evidence_assessments: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENT_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateRawEvidenceAssessmentInvariant(assessment);
    return assessment;
  };

  const propagatedStatus = mapInstantStatusToRawEvidenceStatus(
    instantAssessment.status
  );
  if (propagatedStatus !== null) {
    return empty(propagatedStatus);
  }

  if (
    instantAssessment.resource_readiness_evaluation_instant === null ||
    !instantAssessment.has_explicit_resource_readiness_evaluation_instant
  ) {
    return empty("NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED");
  }

  const requirementByKey = new Map<string, AttentionObservationResourceRequirement>();
  for (const requirementAssessment of bindingAssessment.requirement_binding_assessments) {
    requirementByKey.set(
      requirementAssessment.observation_resource_requirement_key,
      requirementAssessment.resource_requirement
    );
  }

  const sortedBindings = [...bindingAssessment.bindings].sort((a, b) =>
    compareStrings(a.key, b.key)
  );

  const raw_binding_evidence_assessments =
    sortedBindings.map((binding) => {
      const requirement = requirementByKey.get(
        binding.observation_resource_requirement_key
      );
      if (!requirement) {
        throw new Error(
          `Unknown observation_resource_requirement_key ${binding.observation_resource_requirement_key} for candidate ${candidate_key}`
        );
      }
      return buildPerBindingRawEvidenceAssessment(
        binding,
        requirement,
        instantAssessment,
        projectState
      );
    });

  if (
    raw_binding_evidence_assessments.length !== bindingAssessment.bindings.length
  ) {
    throw new Error(
      `RESOURCE_READINESS Raw Evidence Assessment cardinality invariant violated for candidate ${candidate_key}`
    );
  }

  const rawByRequirementKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment[]
  >();
  for (const raw of raw_binding_evidence_assessments) {
    const list =
      rawByRequirementKey.get(raw.observation_resource_requirement_key) ?? [];
    list.push(raw);
    rawByRequirementKey.set(raw.observation_resource_requirement_key, list);
  }

  const requirement_raw_evidence_assessments =
    buildRequirementRawEvidenceAssessments(
      bindingAssessment.requirement_binding_assessments,
      rawByRequirementKey
    );

  const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment =
    {
      candidate_key,
      resource_readiness_evaluation_instant_assessment: instantAssessment,
      status: "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT",
      requirement_raw_evidence_assessments,
      raw_binding_evidence_assessments,
      has_resource_readiness_raw_evidence_assessments:
        raw_binding_evidence_assessments.length > 0,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENT_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateRawEvidenceAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyRawBindingEvidenceAssessments(
  assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment[]
): boolean {
  return assessments.some((a) => a.has_resource_readiness_raw_evidence_assessments);
}

/**
 * Pure set-level RESOURCE_READINESS Raw Evidence Assessment.
 * Preserves GROUND-133 / GROUND-134 Candidate order and per-Candidate binding order.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet {
  validateCrossInput(input);

  const candidate_assessments =
    input.resource_readiness_evaluation_instant_set.candidate_assessments.map(
      (instantAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidence(
          instantAssessment,
          input.project_state
        )
    );

  return {
    resource_readiness_observation_context_binding_set:
      input.resource_readiness_observation_context_binding_set,
    resource_readiness_evaluation_instant_set:
      input.resource_readiness_evaluation_instant_set,
    candidate_assessments,
    has_resource_readiness_raw_evidence_assessments:
      hasAnyRawBindingEvidenceAssessments(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENT_MODEL_LIMITATIONS,
    ],
  };
}
