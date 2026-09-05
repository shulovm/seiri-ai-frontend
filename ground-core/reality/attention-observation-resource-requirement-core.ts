import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Resource Requirement (GROUND-132).
 *
 * Pure composition of GROUND-048 Explicit Capability Requirement Set
 * + explicit Observation Resource Requirement Specification.
 *
 * Declaration only — no resource evidence / readiness / feasibility / OE access.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, persisted
 * project state, GROUND-084, GROUND-129–131, Permission, Authority,
 * InterventionResourceRequirement assessment, Commitment, Reservation, Feasibility.
 */

import { resourceRequirementAmountKey } from "./intervention-core.js";
import { resourceScopeKey } from "./resource-core.js";
import type {
  ResourceRequirementAmount,
  ResourceScope,
} from "../types.js";
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
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementEvalInput,
  AttentionObservationResourceRequirementInput,
  AttentionObservationResourceRequirementModelLimitation,
  AttentionObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirementSetInput,
  AttentionObservationResourceRequirementSetStatus,
  AttentionObservationResourceRequirementSpecification,
} from "./attention-observation-resource-requirement-types.js";

export {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export const EMPTY_OBSERVATION_RESOURCE_REQUIREMENT_SET =
  "EMPTY_OBSERVATION_RESOURCE_REQUIREMENT_SET";

export const ATTENTION_OBSERVATION_RESOURCE_REQUIREMENT_MODEL_LIMITATIONS: AttentionObservationResourceRequirementModelLimitation[] =
  [
    "OBSERVATION_RESOURCE_READINESS_CONTEXT_BINDING_NOT_MODELED",
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

export function canonicalizeResourceRequirementKeys(
  keys: readonly string[]
): string[] {
  return [...keys].sort(compareStrings);
}

function assertValidResourceScope(scope: ResourceScope): ResourceScope {
  if (!scope || typeof scope !== "object" || !("kind" in scope)) {
    throw new Error("ResourceScope must be a canonical discriminated union");
  }
  switch (scope.kind) {
    case "UNSCOPED":
      return scope;
    case "ENTITY":
      if (!scope.entity_id || scope.entity_id.trim().length === 0) {
        throw new Error("ResourceScope ENTITY entity_id must be non-empty");
      }
      return scope;
    case "SUBJECT_STATE":
      if (!scope.subject_id || scope.subject_id.trim().length === 0) {
        throw new Error(
          "ResourceScope SUBJECT_STATE subject_id must be non-empty"
        );
      }
      if (!scope.state_kind || scope.state_kind.trim().length === 0) {
        throw new Error(
          "ResourceScope SUBJECT_STATE state_kind must be non-empty"
        );
      }
      return scope;
    default: {
      const _exhaustive: never = scope;
      void _exhaustive;
      throw new Error("Unknown ResourceScope kind");
    }
  }
}

function assertResourceRequirementAmount(
  amount: ResourceRequirementAmount
): ResourceRequirementAmount {
  if (!amount || typeof amount !== "object" || !("kind" in amount)) {
    throw new Error("required_amount must be POINT or RANGE");
  }
  if (amount.kind === "POINT") {
    if (!Number.isFinite(amount.value) || amount.value <= 0) {
      throw new Error(
        "POINT required_amount must be a finite number greater than 0"
      );
    }
    return { kind: "POINT", value: amount.value };
  }
  if (amount.kind === "RANGE") {
    if (
      !Number.isFinite(amount.min) ||
      !Number.isFinite(amount.max) ||
      amount.min < 0 ||
      amount.max < 0 ||
      amount.min > amount.max ||
      amount.max <= 0
    ) {
      throw new Error(
        "RANGE required_amount must be finite with 0 <= min <= max and max > 0"
      );
    }
    return { kind: "RANGE", min: amount.min, max: amount.max };
  }
  throw new Error("required_amount.kind must be POINT or RANGE");
}

function assertRequirementInterval(
  validFrom: string | null,
  validUntil: string | null
): void {
  if (validFrom !== null && validFrom.trim().length === 0) {
    throw new Error("valid_from must be non-empty when declared");
  }
  if (validUntil !== null && validUntil.trim().length === 0) {
    throw new Error("valid_until must be non-empty when declared");
  }
  if (
    validFrom !== null &&
    validUntil !== null &&
    compareTemporalInstants(validUntil, validFrom) <= 0
  ) {
    throw new Error("valid_until must be after valid_from");
  }
}

function normalizeRequirementInput(
  input: AttentionObservationResourceRequirementInput
): AttentionObservationResourceRequirementInput {
  if (!input.resource_key || input.resource_key.trim().length === 0) {
    throw new Error("resource_key must be non-empty");
  }
  if (!input.unit || input.unit.trim().length === 0) {
    throw new Error("unit must be non-empty");
  }
  const resource_scope = assertValidResourceScope(input.resource_scope);
  const required_amount = assertResourceRequirementAmount(input.required_amount);
  assertRequirementInterval(input.valid_from, input.valid_until);
  return {
    resource_key: input.resource_key,
    unit: input.unit,
    resource_scope,
    required_amount,
    valid_from: input.valid_from,
    valid_until: input.valid_until,
  };
}

function requirementInputSignature(
  input: AttentionObservationResourceRequirementInput
): string {
  return [
    input.resource_key,
    input.unit,
    resourceScopeKey(input.resource_scope),
    resourceRequirementAmountKey(input.required_amount),
    input.valid_from ?? "NONE",
    input.valid_until ?? "NONE",
  ].join("|");
}

function canonicalizeRequirementInputs(
  requirements: readonly AttentionObservationResourceRequirementInput[]
): AttentionObservationResourceRequirementInput[] {
  const bySignature = new Map<
    string,
    AttentionObservationResourceRequirementInput
  >();

  for (const raw of requirements) {
    const normalized = normalizeRequirementInput(raw);
    bySignature.set(requirementInputSignature(normalized), normalized);
  }

  return [...bySignature.values()].sort((a, b) => {
    const sigDiff = compareStrings(
      requirementInputSignature(a),
      requirementInputSignature(b)
    );
    return sigDiff;
  });
}

function requirementSetsEqual(
  a: readonly AttentionObservationResourceRequirementInput[],
  b: readonly AttentionObservationResourceRequirementInput[]
): boolean {
  const canonicalA = canonicalizeRequirementInputs(a);
  const canonicalB = canonicalizeRequirementInputs(b);
  if (canonicalA.length !== canonicalB.length) {
    return false;
  }
  for (let i = 0; i < canonicalA.length; i++) {
    if (
      requirementInputSignature(canonicalA[i]!) !==
      requirementInputSignature(canonicalB[i]!)
    ) {
      return false;
    }
  }
  return true;
}

export function attentionObservationResourceRequirementKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  resourceKey: string,
  unit: string,
  resourceScope: ResourceScope,
  requiredAmount: ResourceRequirementAmount,
  validFrom: string | null,
  validUntil: string | null
): string {
  return [
    "attention-observation-resource-requirement",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    resourceKey,
    unit,
    resourceScopeKey(resourceScope),
    resourceRequirementAmountKey(requiredAmount),
    (validFrom == null ? validFrom : temporalInstantKey(validFrom)) ?? "NONE",
    (validUntil == null ? validUntil : temporalInstantKey(validUntil)) ?? "NONE",
  ].join("|");
}

export function buildAttentionObservationResourceRequirementSetKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  requirementKeys: readonly string[]
): string {
  const canonicalRequirementKeySet =
    requirementKeys.length === 0
      ? EMPTY_OBSERVATION_RESOURCE_REQUIREMENT_SET
      : canonicalizeResourceRequirementKeys(requirementKeys).join(",");
  return [
    "attention-observation-resource-requirement-set",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    canonicalRequirementKeySet,
  ].join("|");
}

interface RequirementSetContext {
  candidateAssessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  observationNeedKey: string;
  requirements: AttentionObservationCapabilityRequirement[];
  capabilityRequirementKeys: string[];
  capabilityRequirementSetKey: string;
}

function isApplicableCapabilityContext(
  context: RequirementSetContext
): boolean {
  const assessment = context.candidateAssessment;
  return (
    assessment.status === "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
    assessment.has_explicit_capability_requirements &&
    assessment.capability_requirement_basis !== null &&
    context.requirements.length > 0
  );
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

/**
 * Validates and normalizes explicit Observation Resource Requirement specification
 * against represented GROUND-048 Candidate contexts.
 *
 * Exact duplicate candidate entries → one.
 * Same Candidate + different requirement sets → reject.
 * Unknown / non-applicable Candidate → reject.
 */
export function normalizeAttentionObservationResourceRequirementSpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  specification: AttentionObservationResourceRequirementSpecification
): AttentionObservationResourceRequirementSpecification {
  const contexts = collectRequirementSetContexts(capabilityRequirementSet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationResourceRequirementSetInput
  >();

  for (const entry of specification.candidate_requirement_sets) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const context = contexts.get(entry.candidate_key);
    if (!context) {
      throw new Error(
        `Candidate ${entry.candidate_key} not found in explicit capability requirement set`
      );
    }

    if (!isApplicableCapabilityContext(context)) {
      throw new Error(
        `Observation Resource Requirement set requires an applicable Capability Requirement context for candidate ${entry.candidate_key}`
      );
    }

    const normalizedRequirements = canonicalizeRequirementInputs(
      entry.requirements
    );
    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (!requirementSetsEqual(existing.requirements, normalizedRequirements)) {
        throw new Error(
          `Conflicting Observation Resource Requirement sets declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      requirements: normalizedRequirements,
    });
  }

  const candidate_requirement_sets = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { candidate_requirement_sets };
}

function buildResourceRequirements(
  context: RequirementSetContext,
  requirements: readonly AttentionObservationResourceRequirementInput[]
): AttentionObservationResourceRequirement[] {
  const built = requirements.map((req) => ({
    key: attentionObservationResourceRequirementKey(
      context.candidateAssessment.candidate_key,
      context.observationNeedKey,
      context.capabilityRequirementSetKey,
      req.resource_key,
      req.unit,
      req.resource_scope,
      req.required_amount,
      req.valid_from,
      req.valid_until
    ),
    candidate_key: context.candidateAssessment.candidate_key,
    observation_need_key: context.observationNeedKey,
    capability_requirement_set_key: context.capabilityRequirementSetKey,
    resource_key: req.resource_key,
    unit: req.unit,
    resource_scope: req.resource_scope,
    required_amount: req.required_amount,
    valid_from: req.valid_from,
    valid_until: req.valid_until,
  }));

  return built.sort((a, b) => compareStrings(a.key, b.key));
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationResourceRequirementSetAssessment
): void {
  const explicit =
    assessment.status ===
    "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT";

  if (explicit !== assessment.has_explicit_observation_resource_requirement_set) {
    throw new Error(
      `Observation Resource Requirement set invariant violated for candidate ${assessment.candidate_key}: explicit-set boolean must match PRESENT status`
    );
  }

  const hasRequirements = assessment.resource_requirements.length > 0;
  if (hasRequirements !== assessment.has_observation_resource_requirements) {
    throw new Error(
      `Observation Resource Requirement set invariant violated for candidate ${assessment.candidate_key}: requirement-existence boolean must match requirements length`
    );
  }

  if (
    assessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    assessment.status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    assessment.status ===
      "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
  ) {
    if (assessment.resource_requirements.length !== 0) {
      throw new Error(
        `Observation Resource Requirement set invariant violated for candidate ${assessment.candidate_key}: non-present status requires empty requirements`
      );
    }
    if (assessment.has_explicit_observation_resource_requirement_set) {
      throw new Error(
        `Observation Resource Requirement set invariant violated for candidate ${assessment.candidate_key}: non-present status requires has_explicit=false`
      );
    }
  }
}

/**
 * Pure per-Candidate Observation Resource Requirement set assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED
 * 4. EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT
 */
export function assessAttentionCandidateObservationResourceRequirementSet(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  requirementSetByCandidateKey: ReadonlyMap<
    string,
    AttentionObservationResourceRequirementSetInput
  >,
  context: RequirementSetContext
): AttentionCandidateObservationResourceRequirementSetAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationResourceRequirementSetStatus
  ): AttentionCandidateObservationResourceRequirementSetAssessment => {
    const assessment: AttentionCandidateObservationResourceRequirementSetAssessment =
      {
        candidate_key,
        capability_requirement_assessment: capabilityRequirementAssessment,
        status,
        resource_requirements: [],
        has_explicit_observation_resource_requirement_set: false,
        has_observation_resource_requirements: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_RESOURCE_REQUIREMENT_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    capabilityRequirementAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (!isApplicableCapabilityContext(context)) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  const declared = requirementSetByCandidateKey.get(candidate_key);
  if (!declared) {
    return notApplicable(
      "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
    );
  }

  const resource_requirements = buildResourceRequirements(
    context,
    declared.requirements
  );

  const assessment: AttentionCandidateObservationResourceRequirementSetAssessment =
    {
      candidate_key,
      capability_requirement_assessment: capabilityRequirementAssessment,
      status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
      resource_requirements,
      has_explicit_observation_resource_requirement_set: true,
      has_observation_resource_requirements: resource_requirements.length > 0,
      model_limitations: [
        ...ATTENTION_OBSERVATION_RESOURCE_REQUIREMENT_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitRequirementSet(
  assessments: AttentionCandidateObservationResourceRequirementSetAssessment[]
): boolean {
  return assessments.some(
    (a) =>
      a.status === "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT"
  );
}

function hasAnyObservationResourceRequirements(
  assessments: AttentionCandidateObservationResourceRequirementSetAssessment[]
): boolean {
  return assessments.some((a) => a.has_observation_resource_requirements);
}

/**
 * Pure set-level Explicit Observation Resource Requirement composition.
 * Preserves GROUND-048 AttentionCandidate order.
 */
export function buildAttentionObservationResourceRequirementSetAssessment(
  input: AttentionObservationResourceRequirementEvalInput
): AttentionObservationResourceRequirementSetAssessment {
  const contexts = collectRequirementSetContexts(input.capability_requirement_set);
  const normalizedSpecification =
    normalizeAttentionObservationResourceRequirementSpecification(
      input.capability_requirement_set,
      input.specification
    );

  const requirementSetByCandidateKey = new Map<
    string,
    AttentionObservationResourceRequirementSetInput
  >();
  for (const entry of normalizedSpecification.candidate_requirement_sets) {
    requirementSetByCandidateKey.set(entry.candidate_key, entry);
  }

  const candidate_assessments =
    input.capability_requirement_set.candidate_requirements.map(
      (capabilityRequirementAssessment) => {
        const context = contexts.get(capabilityRequirementAssessment.candidate_key);
        if (!context) {
          throw new Error(
            `Missing Capability Requirement set context for candidate ${capabilityRequirementAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationResourceRequirementSet(
          capabilityRequirementAssessment,
          requirementSetByCandidateKey,
          context
        );
      }
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_observation_resource_requirement_sets:
      hasAnyExplicitRequirementSet(candidate_assessments),
    has_observation_resource_requirements:
      hasAnyObservationResourceRequirements(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_RESOURCE_REQUIREMENT_MODEL_LIMITATIONS,
    ],
  };
}
