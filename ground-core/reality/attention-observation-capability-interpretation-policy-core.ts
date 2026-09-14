/**
 * Reality Core v0.7 — Attention Observation Capability Interpretation Policy
 * (GROUND-081).
 *
 * Pure composition of GROUND-048 Explicit Capability Requirement Set
 * + explicit Capability Interpretation Policy Specification.
 *
 * Independent policy branch over the exact Requirement set.
 * Must not import GROUND-061–080 runtime cores / current Evaluation State.
 * Type-only import of GROUND-080 Evaluation State vocabulary is allowed.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, persisted
 * project state, GROUND-041–045, Permission, Authority, Resource.
 *
 * Capability Interpretation Policy ≠ Capability Interpretation Basis
 * Capability Interpretation Policy ≠ Capability State
 * INTERPRET_AS_* ≠ current CAPABILITY_PRESENT / CAPABILITY_ABSENT
 * policy absence ≠ explicit empty policy
 * no default HOLDS→PRESENT / DOES_NOT_HOLD→ABSENT
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type { AttentionObservationCapabilityRequirementSetEvaluationState } from "./attention-observation-capability-requirement-set-evaluation-state-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";
import type {
  AttentionCandidateObservationCapabilityInterpretationPolicyAssessment,
  AttentionObservationCapabilityInterpretation,
  AttentionObservationCapabilityInterpretationMapping,
  AttentionObservationCapabilityInterpretationPolicy,
  AttentionObservationCapabilityInterpretationPolicyEvalInput,
  AttentionObservationCapabilityInterpretationPolicyInput,
  AttentionObservationCapabilityInterpretationPolicyModelLimitation,
  AttentionObservationCapabilityInterpretationPolicySetAssessment,
  AttentionObservationCapabilityInterpretationPolicySpecification,
  AttentionObservationCapabilityInterpretationPolicyStatus,
} from "./attention-observation-capability-interpretation-policy-types.js";

export {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export const ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationCapabilityInterpretationPolicyModelLimitation[] =
  [
    "CAPABILITY_INTERPRETATION_EVALUATION_NOT_MODELED",
    "CAPABILITY_STATE_NOT_MODELED",
    "CAPABILITY_PRESENT_STATE_NOT_MODELED",
    "CAPABILITY_ABSENT_STATE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_DEFAULTS_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_GROUPING_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_WILDCARD_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_INHERITANCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_PROVENANCE_NOT_MODELED",
    "CAPABILITY_INTERPRETATION_POLICY_AUTHORITY_NOT_MODELED",
    "ZERO_CAPABILITY_REQUIREMENT_FINAL_SEMANTICS_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "OBSERVER_SUITABILITY_NOT_MODELED",
    "OBSERVER_PERMISSION_NOT_MODELED",
    "OBSERVER_AUTHORITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_REQUIREMENTS_NOT_MODELED",
    "OBSERVATION_RESOURCE_AVAILABILITY_NOT_MODELED",
    "OBSERVATION_RESOURCE_CAPACITY_NOT_MODELED",
    "OBSERVATION_FEASIBILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Canonical GROUND-080 Evaluation State order — serialization only, not preference.
 */
export const CANONICAL_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_ORDER: AttentionObservationCapabilityRequirementSetEvaluationState[] =
  [
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS",
    "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD",
    "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_DECLARED",
    "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED",
    "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
  ];

/**
 * Canonical interpretation order — serialization only, not preference.
 */
export const CANONICAL_CAPABILITY_INTERPRETATION_ORDER: AttentionObservationCapabilityInterpretation[] =
  ["INTERPRET_AS_CAPABILITY_PRESENT", "INTERPRET_AS_CAPABILITY_ABSENT"];

const EVALUATION_STATE_ORDER = new Map(
  CANONICAL_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_ORDER.map((s, i) => [
    s,
    i,
  ])
);

const INTERPRETATION_ORDER = new Map(
  CANONICAL_CAPABILITY_INTERPRETATION_ORDER.map((v, i) => [v, i])
);

const EMPTY_MAPPING_SET_KEY = "EMPTY_MAPPING_SET";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeEvaluationState(
  state: AttentionObservationCapabilityRequirementSetEvaluationState
): AttentionObservationCapabilityRequirementSetEvaluationState {
  if (!EVALUATION_STATE_ORDER.has(state)) {
    throw new Error(
      `Unknown Capability Requirement Set Evaluation State: ${String(state)}`
    );
  }
  return state;
}

function normalizeInterpretation(
  interpretation: AttentionObservationCapabilityInterpretation
): AttentionObservationCapabilityInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown Capability Interpretation value: ${String(interpretation)}`
    );
  }
  return interpretation;
}

/**
 * Canonicalize mapping pairs:
 * - unknown state / interpretation → reject
 * - exact duplicate pair → one
 * - same state + conflicting interpretation → reject
 * - order → GROUND-080 canonical Evaluation State order
 */
export function canonicalizeCapabilityInterpretationMappings(
  mappings: readonly AttentionObservationCapabilityInterpretationMapping[]
): AttentionObservationCapabilityInterpretationMapping[] {
  const byState = new Map<
    AttentionObservationCapabilityRequirementSetEvaluationState,
    AttentionObservationCapabilityInterpretation
  >();

  for (const mapping of mappings) {
    const evaluationState = normalizeEvaluationState(mapping.evaluation_state);
    const interpretation = normalizeInterpretation(mapping.interpretation);
    const existing = byState.get(evaluationState);
    if (existing !== undefined) {
      if (existing !== interpretation) {
        throw new Error(
          `Conflicting Capability Interpretation mappings declared for Evaluation State ${evaluationState}`
        );
      }
      continue;
    }
    byState.set(evaluationState, interpretation);
  }

  const canonical: AttentionObservationCapabilityInterpretationMapping[] = [];
  for (const state of CANONICAL_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_ORDER) {
    const interpretation = byState.get(state);
    if (interpretation !== undefined) {
      canonical.push({
        evaluation_state: state,
        interpretation,
      });
    }
  }
  return canonical;
}

export function buildCanonicalCapabilityInterpretationMappingSetKey(
  mappings: readonly AttentionObservationCapabilityInterpretationMapping[]
): string {
  const canonical = canonicalizeCapabilityInterpretationMappings(mappings);
  if (canonical.length === 0) {
    return EMPTY_MAPPING_SET_KEY;
  }
  return canonical
    .map((m) => `${m.evaluation_state}=${m.interpretation}`)
    .join(",");
}

export function attentionObservationCapabilityInterpretationPolicyKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  canonicalInterpretationMappingSetKey: string
): string {
  return [
    "attention-observation-capability-interpretation-policy",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    canonicalInterpretationMappingSetKey,
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

function mappingSetsEqual(
  a: readonly AttentionObservationCapabilityInterpretationMapping[],
  b: readonly AttentionObservationCapabilityInterpretationMapping[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (
      a[i]!.evaluation_state !== b[i]!.evaluation_state ||
      a[i]!.interpretation !== b[i]!.interpretation
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Validates and normalizes Capability Interpretation Policy specification
 * against represented GROUND-048 Candidate / non-empty Requirement set contexts.
 *
 * Exact duplicate entries → one.
 * Same Candidate + different mapping sets → reject (no silent merge).
 * Unknown Candidate / zero-Requirement domain / no planning basis → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationCapabilityInterpretationPolicySpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  specification: AttentionObservationCapabilityInterpretationPolicySpecification
): AttentionObservationCapabilityInterpretationPolicySpecification {
  const contexts = collectRequirementSetContexts(capabilityRequirementSet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationCapabilityInterpretationPolicyInput
  >();

  for (const entry of specification.policies) {
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
        `Capability Interpretation Policy requires an Observation planning basis for candidate ${entry.candidate_key}`
      );
    }

    if (
      context.candidateAssessment.status ===
        "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED" ||
      !context.candidateAssessment.has_explicit_capability_requirements ||
      context.requirements.length === 0
    ) {
      throw new Error(
        `Capability Interpretation Policy requires a non-empty Capability Requirement set for candidate ${entry.candidate_key}`
      );
    }

    const normalizedMappings = canonicalizeCapabilityInterpretationMappings(
      entry.mappings
    );
    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (!mappingSetsEqual(existing.mappings, normalizedMappings)) {
        throw new Error(
          `Conflicting Capability Interpretation Policies declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      mappings: normalizedMappings,
    });
  }

  const policies = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { policies };
}

function assertPolicyAssessmentInvariant(
  assessment: AttentionCandidateObservationCapabilityInterpretationPolicyAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT" &&
    assessment.capability_interpretation_policy === null
  ) {
    throw new Error(
      `Capability Interpretation Policy invariant violated: PRESENT requires non-null policy for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT" &&
    assessment.capability_interpretation_policy !== null
  ) {
    throw new Error(
      `Capability Interpretation Policy invariant violated: non-present status requires null policy for candidate ${assessment.candidate_key}`
    );
  }

  const policy = assessment.capability_interpretation_policy;
  if (policy !== null) {
    const expectedKeys = canonicalizeCapabilityRequirementKeys(
      assessment.capability_requirement_assessment.capability_requirement_basis
        ?.requirements.map((r) => r.key) ?? []
    );
    const actualKeys = canonicalizeCapabilityRequirementKeys(
      policy.capability_requirement_keys
    );
    let keysEqual = expectedKeys.length === actualKeys.length;
    if (keysEqual) {
      for (let i = 0; i < expectedKeys.length; i++) {
        if (expectedKeys[i] !== actualKeys[i]) {
          keysEqual = false;
          break;
        }
      }
    }
    if (!keysEqual) {
      throw new Error(
        `Capability Interpretation Policy invariant violated: capability_requirement_keys must exactly equal GROUND-048 set for candidate ${assessment.candidate_key}`
      );
    }
    if (policy.capability_requirement_keys.length === 0) {
      throw new Error(
        `Capability Interpretation Policy invariant violated: empty Requirement domain for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function buildInterpretationPolicy(
  context: RequirementSetContext,
  mappings: AttentionObservationCapabilityInterpretationMapping[]
): AttentionObservationCapabilityInterpretationPolicy {
  const mappingSetKey =
    buildCanonicalCapabilityInterpretationMappingSetKey(mappings);
  return {
    key: attentionObservationCapabilityInterpretationPolicyKey(
      context.candidateAssessment.candidate_key,
      context.observationNeedKey,
      context.capabilityRequirementSetKey,
      mappingSetKey
    ),
    candidate_key: context.candidateAssessment.candidate_key,
    observation_need_key: context.observationNeedKey,
    capability_requirement_set_key: context.capabilityRequirementSetKey,
    capability_requirement_keys: [...context.capabilityRequirementKeys],
    mappings: [...mappings],
  };
}

/**
 * Pure per-AttentionCandidate Capability Interpretation Policy assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED
 * 4. EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT
 *
 * Does not inspect current GROUND-080 Evaluation State.
 * Does not match mappings against current state.
 */
export function assessAttentionCandidateObservationCapabilityInterpretationPolicy(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  policyByCandidateKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityInterpretationPolicyInput
  >,
  context: RequirementSetContext
): AttentionCandidateObservationCapabilityInterpretationPolicyAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityInterpretationPolicyStatus
  ): AttentionCandidateObservationCapabilityInterpretationPolicyAssessment => {
    const assessment: AttentionCandidateObservationCapabilityInterpretationPolicyAssessment =
      {
        candidate_key,
        capability_requirement_assessment: capabilityRequirementAssessment,
        status,
        capability_interpretation_policy: null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
        ],
      };
    assertPolicyAssessmentInvariant(assessment);
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

  const declared = policyByCandidateKey.get(candidate_key);
  if (!declared) {
    return notApplicable(
      "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
    );
  }

  const assessment: AttentionCandidateObservationCapabilityInterpretationPolicyAssessment =
    {
      candidate_key,
      capability_requirement_assessment: capabilityRequirementAssessment,
      status: "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT",
      capability_interpretation_policy: buildInterpretationPolicy(
        context,
        declared.mappings
      ),
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
      ],
    };
  assertPolicyAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitPolicy(
  assessments: AttentionCandidateObservationCapabilityInterpretationPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status === "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Explicit Capability Interpretation Policy composition.
 * Preserves GROUND-048 AttentionCandidate order.
 * Does not match current GROUND-080 Evaluation State or produce Capability State.
 */
export function buildAttentionObservationCapabilityInterpretationPolicySet(
  input: AttentionObservationCapabilityInterpretationPolicyEvalInput
): AttentionObservationCapabilityInterpretationPolicySetAssessment {
  const contexts = collectRequirementSetContexts(
    input.capability_requirement_set
  );

  const normalizedSpecification =
    normalizeAttentionObservationCapabilityInterpretationPolicySpecification(
      input.capability_requirement_set,
      input.specification
    );

  const policyByCandidateKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.candidate_key,
      entry,
    ])
  );

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
        return assessAttentionCandidateObservationCapabilityInterpretationPolicy(
          capabilityRequirementAssessment,
          policyByCandidateKey,
          context
        );
      }
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_interpretation_policies:
      hasAnyExplicitPolicy(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
