/**
 * Reality Core v0.7 — Attention Observation Capability Requirement Satisfaction
 * Interpretation Policy (GROUND-073).
 *
 * Pure composition of GROUND-048 Explicit Capability Requirement
 * + explicit Satisfaction Interpretation Policy Specification.
 *
 * Sibling of the 061→072 evaluation branch.
 * Must not import GROUND-061–072 runtime cores.
 * May type-import GROUND-072 Evaluation State vocabulary only.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * Interpretation Policy ≠ Satisfaction Interpretation Result
 * INTERPRET_AS_SATISFIED ≠ current Requirement SATISFIED
 * INTERPRET_AS_UNSATISFIED ≠ current Requirement UNSATISFIED
 * policy absence ≠ empty policy ≠ reject-all ≠ accept-all
 * no default HOLDS→SATISFIED / DOES_NOT_HOLD→UNSATISFIED
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionObservationCapabilityRequirementEvaluationState,
} from "./attention-observation-capability-requirement-evaluation-state-types.js";
import type {
  AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretation,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicy,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyCandidateStatus,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyEvalInput,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyInput,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyModelLimitation,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySetAssessment,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification,
  AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyStatus,
} from "./attention-observation-capability-requirement-satisfaction-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyModelLimitation[] =
  [
    "CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_EVALUATION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_UNSATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_PARTIAL_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_COMPLETENESS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_DEFAULTS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_PROVENANCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_AUTHORITY_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_POLICY_INHERITANCE_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_EVALUATION_STATE_GROUPING_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_EFFECTIVE_STATE_NOT_MODELED",
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
 * Canonical GROUND-072 Evaluation State order — serialization only, not preference.
 */
export const CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER: AttentionObservationCapabilityRequirementEvaluationState[] =
  [
    "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS",
    "REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD",
    "UNRESOLVED_CAPABILITY_EVALUATION_DIMENSION_POLICY_NOT_DECLARED",
    "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED",
    "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_NOT_DECLARED",
    "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_NOT_DECLARED",
    "UNRESOLVED_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD",
  ];

/**
 * Canonical interpretation order — serialization only, not preference.
 */
export const CANONICAL_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_ORDER: AttentionObservationCapabilityRequirementSatisfactionInterpretation[] =
  ["INTERPRET_AS_SATISFIED", "INTERPRET_AS_UNSATISFIED"];

const EVALUATION_STATE_ORDER = new Map(
  CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER.map((s, i) => [s, i])
);

const INTERPRETATION_ORDER = new Map(
  CANONICAL_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_ORDER.map(
    (v, i) => [v, i]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeEvaluationState(
  state: AttentionObservationCapabilityRequirementEvaluationState
): AttentionObservationCapabilityRequirementEvaluationState {
  if (!EVALUATION_STATE_ORDER.has(state)) {
    throw new Error(
      `Unknown Capability Requirement Evaluation State: ${String(state)}`
    );
  }
  return state;
}

function normalizeInterpretation(
  interpretation: AttentionObservationCapabilityRequirementSatisfactionInterpretation
): AttentionObservationCapabilityRequirementSatisfactionInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown Capability Requirement Satisfaction Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

/**
 * Canonical mapping-set key (deduped by evaluation_state + fixed state order).
 * Empty mapping set serializes as EMPTY_MAPPING_SET.
 */
export function buildCanonicalCapabilityRequirementSatisfactionInterpretationMappingSetKey(
  mappings: readonly AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[]
): string {
  const normalized = normalizeSatisfactionInterpretationMappings(mappings);
  if (normalized.length === 0) {
    return "EMPTY_MAPPING_SET";
  }
  return normalized
    .map((m) => `${m.evaluation_state}|${m.interpretation}`)
    .join(",");
}

export function normalizeSatisfactionInterpretationMappings(
  mappings: readonly AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[]
): AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[] {
  const byState = new Map<
    AttentionObservationCapabilityRequirementEvaluationState,
    AttentionObservationCapabilityRequirementSatisfactionInterpretation
  >();

  for (const mapping of mappings) {
    const evaluation_state = normalizeEvaluationState(mapping.evaluation_state);
    const interpretation = normalizeInterpretation(mapping.interpretation);
    const existing = byState.get(evaluation_state);
    if (existing !== undefined) {
      if (existing !== interpretation) {
        throw new Error(
          `Conflicting Capability Requirement Satisfaction Interpretation mappings for evaluation state ${evaluation_state}`
        );
      }
      // Exact duplicate — keep one.
      continue;
    }
    byState.set(evaluation_state, interpretation);
  }

  const result: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[] =
    [];
  for (const evaluation_state of CANONICAL_CAPABILITY_REQUIREMENT_EVALUATION_STATE_ORDER) {
    const interpretation = byState.get(evaluation_state);
    if (interpretation !== undefined) {
      result.push({ evaluation_state, interpretation });
    }
  }
  return result;
}

export function attentionObservationCapabilityRequirementSatisfactionInterpretationPolicyKey(
  capabilityRequirementKey: string,
  mappings: readonly AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[]
): string {
  return [
    "attention-observation-capability-requirement-satisfaction-interpretation-policy",
    capabilityRequirementKey,
    buildCanonicalCapabilityRequirementSatisfactionInterpretationMappingSetKey(
      mappings
    ),
  ].join("|");
}

function collectCapabilityRequirementKeys(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment
): Map<string, AttentionObservationCapabilityRequirement> {
  const byKey = new Map<string, AttentionObservationCapabilityRequirement>();

  for (const candidate of capabilityRequirementSet.candidate_requirements) {
    const requirements =
      candidate.capability_requirement_basis?.requirements ?? [];
    for (const requirement of requirements) {
      byKey.set(requirement.key, requirement);
    }
  }

  return byKey;
}

function mappingSetsEqual(
  a: readonly AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[],
  b: readonly AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[]
): boolean {
  return (
    buildCanonicalCapabilityRequirementSatisfactionInterpretationMappingSetKey(
      a
    ) ===
    buildCanonicalCapabilityRequirementSatisfactionInterpretationMappingSetKey(
      b
    )
  );
}

/**
 * Validates and normalizes Satisfaction Interpretation Policy specification
 * against represented GROUND-048 Capability Requirement keys.
 *
 * Exact duplicate / reordered equivalent mapping set → one.
 * Same Requirement + different mapping sets → reject (no merge/union).
 * Unknown capability_requirement_key → reject.
 * Conflicting mappings for same Evaluation State → reject.
 */
export function normalizeAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  specification: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification
): AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification {
  const knownRequirements = collectCapabilityRequirementKeys(
    capabilityRequirementSet
  );

  const byRequirementKey = new Map<
    string,
    AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyInput
  >();

  for (const entry of specification.policies) {
    if (
      !entry.capability_requirement_key ||
      entry.capability_requirement_key.trim().length === 0
    ) {
      throw new Error("Capability Requirement key must be non-empty");
    }

    if (!knownRequirements.has(entry.capability_requirement_key)) {
      throw new Error(
        `Capability Requirement ${entry.capability_requirement_key} not found in explicit capability requirement set`
      );
    }

    const normalizedMappings = normalizeSatisfactionInterpretationMappings(
      entry.mappings
    );

    const existing = byRequirementKey.get(entry.capability_requirement_key);
    if (existing) {
      if (!mappingSetsEqual(existing.mappings, normalizedMappings)) {
        throw new Error(
          `Multiple Capability Requirement Satisfaction Interpretation Policies declared for capability requirement ${entry.capability_requirement_key}`
        );
      }
      // Exact / reordered equivalent duplicate — keep first.
      continue;
    }

    byRequirementKey.set(entry.capability_requirement_key, {
      capability_requirement_key: entry.capability_requirement_key,
      mappings: normalizedMappings,
    });
  }

  const policies = [...byRequirementKey.values()].sort((a, b) =>
    compareStrings(a.capability_requirement_key, b.capability_requirement_key)
  );

  return { policies };
}

function buildSatisfactionInterpretationPolicy(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  mappings: AttentionObservationCapabilityRequirementSatisfactionInterpretationMapping[]
): AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicy {
  return {
    key: attentionObservationCapabilityRequirementSatisfactionInterpretationPolicyKey(
      capabilityRequirement.key,
      mappings
    ),
    capability_requirement_key: capabilityRequirement.key,
    observation_need_key: capabilityRequirement.observation_need_key,
    capability_semantic_key: capabilityRequirement.capability_semantic_key,
    mappings,
  };
}

function assertPolicyAssessmentInvariant(
  assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT" &&
    assessment.satisfaction_interpretation_policy === null
  ) {
    throw new Error(
      `Satisfaction Interpretation Policy invariant violated: PRESENT requires non-null policy for capability requirement ${assessment.capability_requirement.key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT" &&
    assessment.satisfaction_interpretation_policy !== null
  ) {
    throw new Error(
      `Satisfaction Interpretation Policy invariant violated: non-present status requires null policy for capability requirement ${assessment.capability_requirement.key}`
    );
  }
}

function assessRequirementPolicy(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  policyByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyInput
  >
): AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment {
  const declared = policyByRequirementKey.get(capabilityRequirement.key);

  if (!declared) {
    const assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment =
      {
        capability_requirement: capabilityRequirement,
        status:
          "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_DECLARED",
        satisfaction_interpretation_policy: null,
      };
    assertPolicyAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment =
    {
      capability_requirement: capabilityRequirement,
      status:
        "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT",
      satisfaction_interpretation_policy: buildSatisfactionInterpretationPolicy(
        capabilityRequirement,
        declared.mappings
      ),
    };
  assertPolicyAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitPolicy(
  assessments: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure per-AttentionCandidate Satisfaction Interpretation Policy assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_..._POLICIES_DECLARED
 * 4. EXPLICIT_..._POLICIES_PRESENT
 *
 * Explicit empty mappings remains POLICY_PRESENT.
 * Does not synthesize default mappings when policy is absent.
 */
export function assessAttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicies(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  policyByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyInput
  >
): AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyCandidateStatus
  ): AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment => ({
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    status,
    requirement_satisfaction_interpretation_policy_assessments: [],
    has_explicit_capability_requirement_satisfaction_interpretation_policies:
      false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  });

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
    capabilityRequirementAssessment.capability_requirement_basis.requirements
      .length === 0
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  const requirement_satisfaction_interpretation_policy_assessments =
    capabilityRequirementAssessment.capability_requirement_basis.requirements.map(
      (capabilityRequirement) =>
        assessRequirementPolicy(capabilityRequirement, policyByRequirementKey)
    );

  for (const assessment of requirement_satisfaction_interpretation_policy_assessments) {
    assertPolicyAssessmentInvariant(assessment);
  }

  const has_explicit_capability_requirement_satisfaction_interpretation_policies =
    hasAnyExplicitPolicy(
      requirement_satisfaction_interpretation_policy_assessments
    );

  return {
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    status: has_explicit_capability_requirement_satisfaction_interpretation_policies
      ? "EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICIES_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICIES_DECLARED",
    requirement_satisfaction_interpretation_policy_assessments,
    has_explicit_capability_requirement_satisfaction_interpretation_policies,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

function hasAnyCandidateExplicitPolicy(
  assessments: AttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.has_explicit_capability_requirement_satisfaction_interpretation_policies
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Explicit Satisfaction Interpretation Policy composition.
 * Preserves GROUND-048 AttentionCandidate / Capability Requirement order.
 * Does not match current GROUND-072 Evaluation States or produce Satisfaction.
 */
export function buildAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySet(
  input: AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicyEvalInput
): AttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationCapabilityRequirementSatisfactionInterpretationPolicySpecification(
      input.capability_requirement_set,
      input.specification
    );

  const policyByRequirementKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.capability_requirement_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.capability_requirement_set.candidate_requirements.map(
      (capabilityRequirementAssessment) =>
        assessAttentionCandidateObservationCapabilityRequirementSatisfactionInterpretationPolicies(
          capabilityRequirementAssessment,
          policyByRequirementKey
        )
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_requirement_satisfaction_interpretation_policies:
      hasAnyCandidateExplicitPolicy(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_SATISFACTION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
