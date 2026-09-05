/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility AUTHORITY
 * Evaluation Instant (GROUND-109).
 *
 * Pure composition of GROUND-108 AUTHORITY Observation-Context Binding Assessment
 * + explicit AUTHORITY Evaluation Instant Specification.
 *
 * Evaluation instant identifies:
 *   at what explicit instant future Authority assessment should evaluate
 *   all bound Authority contexts for this exact observation Candidate context
 *
 * Must not inspect Authority declarations / persisted state / Governance evaluators.
 * Must not consume GROUND-019–106 Operational Eligibility semantics directly.
 *
 * Forbidden: StatePatch, applyPatch, saveProject, wall-clock default.
 *
 * Evaluation instant ≠ Authority assessment / active / positive
 * Multiple bindings share one candidate-level instant
 * No binding → no instant record
 * Missing instant ≠ wall-clock now
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
} from "./attention-observation-operational-eligibility-authority-observation-context-binding-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvaluationInstant,
  AttentionObservationOperationalEligibilityAuthorityEvaluationInstantEvalInput,
  AttentionObservationOperationalEligibilityAuthorityEvaluationInstantInput,
  AttentionObservationOperationalEligibilityAuthorityEvaluationInstantModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification,
  AttentionObservationOperationalEligibilityAuthorityEvaluationInstantStatus,
} from "./attention-observation-operational-eligibility-authority-evaluation-instant-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DECLARED_ASSESSMENT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_PROVENANCE_ASSESSMENT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Lexicographic ISO-8601 instant validation — same convention as GROUND-088.
 * No Date.parse / locale / timezone coercion / wall-clock default.
 */
const AUTHORITY_EVALUATION_AT_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function assertAuthorityEvaluationAt(
  authorityEvaluationAt: string
): string {
  if (!authorityEvaluationAt || authorityEvaluationAt.trim().length === 0) {
    throw new Error("authority_evaluation_at must be non-empty");
  }
  if (!AUTHORITY_EVALUATION_AT_PATTERN.test(authorityEvaluationAt)) {
    throw new Error(
      `Malformed authority_evaluation_at: ${authorityEvaluationAt}`
    );
  }
  return authorityEvaluationAt;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-evaluation-instant|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * authorityEvaluationAt
 */
export function attentionObservationOperationalEligibilityAuthorityEvaluationInstantKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  authorityEvaluationAt: string
): string {
  return [
    "attention-observation-operational-eligibility-authority-evaluation-instant",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    "AUTHORITY",
    authorityEvaluationAt,
  ].join("|");
}

function collectBindingAssessmentsByCandidateKey(
  bindingSet: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment
): Map<
  string,
  AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment
> {
  const byCandidateKey = new Map<
    string,
    AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment
  >();

  for (const assessment of bindingSet.candidate_assessments) {
    if (byCandidateKey.has(assessment.candidate_key)) {
      throw new Error(
        `Ambiguous AUTHORITY Observation-Context Binding assessment for candidate ${assessment.candidate_key}`
      );
    }
    byCandidateKey.set(assessment.candidate_key, assessment);
  }

  return byCandidateKey;
}

function hasExplicitAuthorityBindings(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment
): boolean {
  return (
    bindingAssessment.status ===
      "EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_PRESENT" &&
    bindingAssessment.authority_observation_context_bindings.length > 0
  );
}

/**
 * Validates and normalizes AUTHORITY Evaluation Instant specification against 108 contexts.
 *
 * Exact duplicate instants for same Candidate → one.
 * Different instants for same Candidate → reject (no latest-wins).
 * Unknown Candidate / NOT_APPLICABLE contexts → reject.
 * NO_BINDINGS contexts with supplied instant → reject (no dangling instant).
 */
export function normalizeAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification(
  authorityObservationContextBindingSet: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
  specification: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification
): AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification {
  const byCandidateKey = collectBindingAssessmentsByCandidateKey(
    authorityObservationContextBindingSet
  );

  const instantByCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthorityEvaluationInstantInput
  >();

  for (const entry of specification.evaluation_instants) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const bindingAssessment = byCandidateKey.get(entry.candidate_key);
    if (!bindingAssessment) {
      throw new Error(
        `Candidate ${entry.candidate_key} not found in AUTHORITY Observation-Context Binding set`
      );
    }

    if (
      bindingAssessment.status ===
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      bindingAssessment.status ===
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    ) {
      throw new Error(
        `AUTHORITY Evaluation Instant requires an applicable observation Authority Binding domain for candidate ${entry.candidate_key}`
      );
    }

    if (
      bindingAssessment.status ===
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
      !hasExplicitAuthorityBindings(bindingAssessment)
    ) {
      throw new Error(
        `AUTHORITY Evaluation Instant requires explicit Authority Observation-Context Bindings for candidate ${entry.candidate_key}`
      );
    }

    const authority_evaluation_at = assertAuthorityEvaluationAt(
      entry.authority_evaluation_at
    );

    const existing = instantByCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (existing.authority_evaluation_at !== authority_evaluation_at) {
        throw new Error(
          `Conflicting AUTHORITY evaluation instants declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    instantByCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      authority_evaluation_at,
    });
  }

  const evaluation_instants = [...instantByCandidateKey.values()].sort(
    (a, b) => compareStrings(a.candidate_key, b.candidate_key)
  );

  return { evaluation_instants };
}

function resolveObservationContextKeys(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment
): { observationNeedKey: string; capabilityRequirementSetKey: string } {
  const binding =
    bindingAssessment.authority_observation_context_bindings[0];
  if (binding) {
    return {
      observationNeedKey: binding.observation_need_key,
      capabilityRequirementSetKey: binding.capability_requirement_set_key,
    };
  }

  const basis =
    bindingAssessment.capability_requirement_assessment
      .capability_requirement_basis;
  if (basis === null) {
    throw new Error(
      `AUTHORITY Evaluation Instant context missing for candidate ${bindingAssessment.candidate_key}`
    );
  }

  const requirementKeys = canonicalizeCapabilityRequirementKeys(
    basis.requirements.map((r) => r.key)
  );
  if (requirementKeys.length === 0) {
    throw new Error(
      `AUTHORITY Evaluation Instant requires non-empty Capability Requirement set for candidate ${bindingAssessment.candidate_key}`
    );
  }

  return {
    observationNeedKey: basis.observation_need_key,
    capabilityRequirementSetKey: buildAttentionObservationCapabilityRequirementSetKey(
      bindingAssessment.candidate_key,
      basis.observation_need_key,
      requirementKeys
    ),
  };
}

function buildEvaluationInstant(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment,
  authorityEvaluationAt: string
): AttentionObservationOperationalEligibilityAuthorityEvaluationInstant {
  const { observationNeedKey, capabilityRequirementSetKey } =
    resolveObservationContextKeys(bindingAssessment);

  return {
    key: attentionObservationOperationalEligibilityAuthorityEvaluationInstantKey(
      bindingAssessment.candidate_key,
      observationNeedKey,
      capabilityRequirementSetKey,
      authorityEvaluationAt
    ),
    candidate_key: bindingAssessment.candidate_key,
    observation_need_key: observationNeedKey,
    capability_requirement_set_key: capabilityRequirementSetKey,
    dimension: "AUTHORITY",
    authority_evaluation_at: authorityEvaluationAt,
  };
}

function assertCandidateInstantAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment
): void {
  const expectedHas = assessment.authority_evaluation_instant !== null;
  if (
    assessment.has_explicit_authority_evaluation_instant !== expectedHas
  ) {
    throw new Error(
      `AUTHORITY Evaluation Instant invariant violated: has_explicit mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "EXPLICIT_AUTHORITY_EVALUATION_INSTANT_PRESENT" &&
    assessment.authority_evaluation_instant === null
  ) {
    throw new Error(
      `AUTHORITY Evaluation Instant invariant violated: PRESENT requires non-null instant for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED" &&
    assessment.authority_evaluation_instant !== null
  ) {
    throw new Error(
      `AUTHORITY Evaluation Instant invariant violated: NO_INSTANT requires null instant for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "EXPLICIT_AUTHORITY_EVALUATION_INSTANT_PRESENT" &&
    assessment.authority_evaluation_instant !== null
  ) {
    throw new Error(
      `AUTHORITY Evaluation Instant invariant violated: non-present status requires null instant for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure per-Candidate AUTHORITY Evaluation Instant assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED
 * 5. EXPLICIT_AUTHORITY_EVALUATION_INSTANT_PRESENT
 *
 * Does not assess Authority declarations / polarity / OE.
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstant(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment,
  instantByCandidateKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityAuthorityEvaluationInstantInput
  >
): AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment {
  const candidate_key = bindingAssessment.candidate_key;

  const empty = (
    status: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantStatus
  ): AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment =
      {
        candidate_key,
        authority_observation_context_binding_assessment: bindingAssessment,
        status,
        authority_evaluation_instant: null,
        has_explicit_authority_evaluation_instant: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateInstantAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    bindingAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return empty("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    bindingAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return empty("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    bindingAssessment.status ===
      "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
    !hasExplicitAuthorityBindings(bindingAssessment)
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED");
  }

  const instantInput = instantByCandidateKey.get(candidate_key);
  if (!instantInput) {
    return empty("NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED");
  }

  const authority_evaluation_instant = buildEvaluationInstant(
    bindingAssessment,
    instantInput.authority_evaluation_at
  );

  const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment =
    {
      candidate_key,
      authority_observation_context_binding_assessment: bindingAssessment,
      status: "EXPLICIT_AUTHORITY_EVALUATION_INSTANT_PRESENT",
      authority_evaluation_instant,
      has_explicit_authority_evaluation_instant: true,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateInstantAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitEvaluationInstants(
  assessments: AttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstantAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_explicit_authority_evaluation_instant) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level AUTHORITY Evaluation Instant composition.
 * Preserves GROUND-108 Candidate order.
 * Does not inspect Authority declarations or produce Authority State / OE.
 */
export function buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet(
  input: AttentionObservationOperationalEligibilityAuthorityEvaluationInstantEvalInput
): AttentionObservationOperationalEligibilityAuthorityEvaluationInstantSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification(
      input.authority_observation_context_binding_set,
      input.specification
    );

  const instantByCandidateKey = new Map(
    normalizedSpecification.evaluation_instants.map((entry) => [
      entry.candidate_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.authority_observation_context_binding_set.candidate_assessments.map(
      (bindingAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityAuthorityEvaluationInstant(
          bindingAssessment,
          instantByCandidateKey
        )
    );

  return {
    authority_observation_context_binding_set:
      input.authority_observation_context_binding_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_authority_evaluation_instants:
      hasAnyExplicitEvaluationInstants(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_MODEL_LIMITATIONS,
    ],
  };
}
