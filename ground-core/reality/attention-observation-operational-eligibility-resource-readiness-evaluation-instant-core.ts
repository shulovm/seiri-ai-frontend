import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Evaluation Instant (GROUND-134).
 *
 * Pure composition of GROUND-133 RESOURCE_READINESS Observation-Context Binding
 * Assessment + explicit RESOURCE_READINESS Evaluation Instant Specification.
 *
 * Evaluation instant identifies:
 *   at what explicit instant future RESOURCE_READINESS evidence assessment
 *   should evaluate all bound resource-side evidence subjects for this Candidate context
 *
 * Must not inspect ResourceDeclaration / availability / capacity / readiness.
 * Must not consume GROUND-132 / GROUND-048 / GROUND-084 / Permission / Authority directly.
 *
 * Forbidden: StatePatch, applyPatch, saveProject, wall-clock default.
 *
 * One Candidate-level instant applies to all bindings — not per-binding instants.
 * No binding → no instant record. Missing instant ≠ wall-clock now.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstant,
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantInput,
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification,
  AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantStatus,
} from "./attention-observation-operational-eligibility-resource-readiness-evaluation-instant-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVALUATION_INSTANT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantModelLimitation[] =
  [
    "RESOURCE_DECLARATION_EXISTENCE_NOT_EVALUATED",
    "RESOURCE_REQUIREMENT_TO_DECLARATION_MATCH_NOT_EVALUATED",
    "OBSERVATION_RESOURCE_EVIDENCE_ASSESSMENT_NOT_MODELED",
    "OBSERVATION_RESOURCE_TEMPORAL_APPLICABILITY_NOT_EVALUATED",
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

/**
 * Declared ISO-8601 timestamp syntax validation — same convention as GROUND-088/109.
 * Preserves representation; temporal consumption resolves exact instants separately.
 */
const RESOURCE_READINESS_EVALUATION_AT_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function assertResourceReadinessEvaluationAt(
  evaluationAt: string
): string {
  if (!evaluationAt || evaluationAt.trim().length === 0) {
    throw new Error("evaluation_at must be non-empty");
  }
  if (!RESOURCE_READINESS_EVALUATION_AT_PATTERN.test(evaluationAt)) {
    throw new Error(`Malformed evaluation_at: ${evaluationAt}`);
  }
  return evaluationAt;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-evaluation-instant|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * evaluationAt
 */
export function attentionObservationOperationalEligibilityResourceReadinessEvaluationInstantKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  evaluationAt: string
): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-evaluation-instant",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    "RESOURCE_READINESS",
    temporalInstantKey(evaluationAt),
  ].join("|");
}

function collectBindingAssessmentsByCandidateKey(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment
): Map<
  string,
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment
> {
  const byCandidateKey = new Map<
    string,
    AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment
  >();

  for (const assessment of bindingSet.candidate_assessments) {
    if (byCandidateKey.has(assessment.candidate_key)) {
      throw new Error(
        `Ambiguous RESOURCE_READINESS Observation-Context Binding assessment for candidate ${assessment.candidate_key}`
      );
    }
    byCandidateKey.set(assessment.candidate_key, assessment);
  }

  return byCandidateKey;
}

function hasExplicitResourceReadinessBindings(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment
): boolean {
  return (
    bindingAssessment.status ===
      "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT" &&
    bindingAssessment.has_resource_readiness_observation_context_bindings &&
    bindingAssessment.bindings.length > 0
  );
}

function isInstantSpecificationRejectedStatus(
  status: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment["status"]
): boolean {
  return (
    status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    status === "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    status === "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED" ||
    status === "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY" ||
    status ===
      "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  );
}

/**
 * Validates and normalizes RESOURCE_READINESS Evaluation Instant specification against 133 contexts.
 *
 * Exact duplicate instants for same Candidate → one.
 * Different instants for same Candidate → reject (no latest-wins).
 * Unknown / outer / no-bindings contexts with supplied instant → reject.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification(
  resourceReadinessObservationContextBindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification
): AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification {
  const byCandidateKey = collectBindingAssessmentsByCandidateKey(
    resourceReadinessObservationContextBindingSet
  );

  const instantByCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantInput
  >();

  for (const entry of specification.evaluation_instants) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const bindingAssessment = byCandidateKey.get(entry.candidate_key);
    if (!bindingAssessment) {
      throw new Error(
        `Candidate ${entry.candidate_key} not found in RESOURCE_READINESS Observation-Context Binding set`
      );
    }

    if (isInstantSpecificationRejectedStatus(bindingAssessment.status)) {
      throw new Error(
        `RESOURCE_READINESS Evaluation Instant requires an applicable RESOURCE_READINESS Binding domain for candidate ${entry.candidate_key}`
      );
    }

    if (!hasExplicitResourceReadinessBindings(bindingAssessment)) {
      throw new Error(
        `RESOURCE_READINESS Evaluation Instant requires explicit RESOURCE_READINESS Observation-Context Bindings for candidate ${entry.candidate_key}`
      );
    }

    const evaluation_at = assertResourceReadinessEvaluationAt(entry.evaluation_at);

    const existing = instantByCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (compareTemporalInstants(existing.evaluation_at, evaluation_at) !== 0) {
        throw new Error(
          `Conflicting RESOURCE_READINESS evaluation instants declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    instantByCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      evaluation_at,
    });
  }

  const evaluation_instants = [...instantByCandidateKey.values()].sort(
    (a, b) => compareStrings(a.candidate_key, b.candidate_key)
  );

  return { evaluation_instants };
}

function resolveObservationContextKeys(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment
): { observationNeedKey: string; capabilityRequirementSetKey: string } {
  const binding = bindingAssessment.bindings[0];
  if (binding) {
    return {
      observationNeedKey: binding.observation_need_key,
      capabilityRequirementSetKey: binding.capability_requirement_set_key,
    };
  }

  const requirement =
    bindingAssessment.observation_resource_requirement_set_assessment
      .resource_requirements[0];
  if (requirement) {
    return {
      observationNeedKey: requirement.observation_need_key,
      capabilityRequirementSetKey: requirement.capability_requirement_set_key,
    };
  }

  throw new Error(
    `RESOURCE_READINESS Evaluation Instant context missing for candidate ${bindingAssessment.candidate_key}`
  );
}

function buildEvaluationInstant(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  evaluationAt: string
): AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstant {
  const { observationNeedKey, capabilityRequirementSetKey } =
    resolveObservationContextKeys(bindingAssessment);

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessEvaluationInstantKey(
      bindingAssessment.candidate_key,
      observationNeedKey,
      capabilityRequirementSetKey,
      evaluationAt
    ),
    candidate_key: bindingAssessment.candidate_key,
    observation_need_key: observationNeedKey,
    capability_requirement_set_key: capabilityRequirementSetKey,
    dimension: "RESOURCE_READINESS",
    evaluation_at: evaluationAt,
  };
}

function mapBindingStatusToInstantStatus(
  bindingStatus: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment["status"]
): AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantStatus | null {
  switch (bindingStatus) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
    case "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED":
    case "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY":
    case "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED":
      return bindingStatus;
    case "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT":
      return null;
    default: {
      const _exhaustive: never = bindingStatus;
      void _exhaustive;
      throw new Error(`Unknown RESOURCE_READINESS binding status: ${String(bindingStatus)}`);
    }
  }
}

function assertCandidateInstantAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment
): void {
  const expectedHas =
    assessment.resource_readiness_evaluation_instant !== null;
  if (
    assessment.has_explicit_resource_readiness_evaluation_instant !== expectedHas
  ) {
    throw new Error(
      `RESOURCE_READINESS Evaluation Instant invariant violated: has_explicit mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT" &&
    assessment.resource_readiness_evaluation_instant === null
  ) {
    throw new Error(
      `RESOURCE_READINESS Evaluation Instant invariant violated: PRESENT requires non-null instant for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED" &&
    assessment.resource_readiness_evaluation_instant !== null
  ) {
    throw new Error(
      `RESOURCE_READINESS Evaluation Instant invariant violated: NO_INSTANT requires null instant for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT" &&
    assessment.resource_readiness_evaluation_instant !== null
  ) {
    throw new Error(
      `RESOURCE_READINESS Evaluation Instant invariant violated: non-present status requires null instant for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure per-Candidate RESOURCE_READINESS Evaluation Instant assessment.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstant(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  instantByCandidateKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment {
  const candidate_key = bindingAssessment.candidate_key;

  const empty = (
    status: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantStatus
  ): AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment =
      {
        candidate_key,
        resource_readiness_observation_context_binding_assessment:
          bindingAssessment,
        status,
        resource_readiness_evaluation_instant: null,
        has_explicit_resource_readiness_evaluation_instant: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVALUATION_INSTANT_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateInstantAssessmentInvariant(assessment);
    return assessment;
  };

  const propagatedStatus = mapBindingStatusToInstantStatus(
    bindingAssessment.status
  );
  if (propagatedStatus !== null) {
    return empty(propagatedStatus);
  }

  if (!hasExplicitResourceReadinessBindings(bindingAssessment)) {
    return empty(
      "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    );
  }

  const instantInput = instantByCandidateKey.get(candidate_key);
  if (!instantInput) {
    return empty("NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED");
  }

  const resource_readiness_evaluation_instant = buildEvaluationInstant(
    bindingAssessment,
    instantInput.evaluation_at
  );

  const assessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment =
    {
      candidate_key,
      resource_readiness_observation_context_binding_assessment:
        bindingAssessment,
      status: "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT",
      resource_readiness_evaluation_instant,
      has_explicit_resource_readiness_evaluation_instant: true,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVALUATION_INSTANT_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateInstantAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitEvaluationInstants(
  assessments: AttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstantAssessment[]
): boolean {
  return assessments.some(
    (a) => a.has_explicit_resource_readiness_evaluation_instant
  );
}

/**
 * Pure set-level RESOURCE_READINESS Evaluation Instant composition.
 * Preserves GROUND-133 Candidate order.
 * Does not inspect resource evidence or produce Resource Readiness State / OE.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification(
      input.resource_readiness_observation_context_binding_set,
      input.specification
    );

  const instantByCandidateKey = new Map(
    normalizedSpecification.evaluation_instants.map((entry) => [
      entry.candidate_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_observation_context_binding_set.candidate_assessments.map(
      (bindingAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstant(
          bindingAssessment,
          instantByCandidateKey
        )
    );

  return {
    resource_readiness_observation_context_binding_set:
      input.resource_readiness_observation_context_binding_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_resource_readiness_evaluation_instants:
      hasAnyExplicitEvaluationInstants(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVALUATION_INSTANT_MODEL_LIMITATIONS,
    ],
  };
}
