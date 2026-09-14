/**
 * Reality Core v0.7 — Attention Observation Capability Evaluation Dimension Policy
 * (GROUND-061).
 *
 * Pure composition of GROUND-048 Capability Requirement
 * + explicit runtime Evaluation Dimension Policy Specification.
 *
 * Requirement-side sibling of GROUND-054 / 056.
 * Must not import GROUND-050–060 (match / verification / availability /
 * scope-temporal applicability / composition).
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, Commitment assessment APIs.
 *
 * required dimension ≠ acceptance criterion ≠ outcome ≠ satisfaction.
 * policy absence ≠ empty policy ≠ all-required ≠ all-optional.
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import type {
  AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  AttentionObservationCapabilityEvaluationDimension,
  AttentionObservationCapabilityEvaluationDimensionPolicy,
  AttentionObservationCapabilityEvaluationDimensionPolicyCandidateStatus,
  AttentionObservationCapabilityEvaluationDimensionPolicyEvalInput,
  AttentionObservationCapabilityEvaluationDimensionPolicyInput,
  AttentionObservationCapabilityEvaluationDimensionPolicyModelLimitation,
  AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  AttentionObservationCapabilityEvaluationDimensionPolicySpecification,
  AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS: AttentionObservationCapabilityEvaluationDimension[] =
  [
    "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
    "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
    "CAPABILITY_SCOPE_APPLICABILITY",
    "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
    "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
    "CAPABILITY_VERIFICATION_REPRESENTATION",
    "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
    "CAPABILITY_AVAILABILITY_REPRESENTATION",
    "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
  ];

export const ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSION_POLICY_MODEL_LIMITATIONS: AttentionObservationCapabilityEvaluationDimensionPolicyModelLimitation[] =
  [
    "CAPABILITY_EVALUATION_POLICY_PROVENANCE_NOT_MODELED",
    "CAPABILITY_EVALUATION_POLICY_AUTHORITY_NOT_MODELED",
    "CAPABILITY_EVALUATION_POLICY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_EVALUATION_POLICY_INHERITANCE_NOT_MODELED",
    "CAPABILITY_EVALUATION_DIMENSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "CAPABILITY_EVALUATION_DIMENSION_OUTCOME_NOT_MODELED",
    "CAPABILITY_EVALUATION_REQUIRED_DIMENSION_COVERAGE_NOT_MODELED",
    "CAPABILITY_EVALUATION_MISSING_DIMENSION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_EVALUATION_DIMENSION_AGGREGATION_NOT_MODELED",
    "CAPABILITY_EVALUATION_DIMENSION_WEIGHTING_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
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

const DIMENSION_ORDER = new Map(
  ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS.map((d, index) => [
    d,
    index,
  ])
);

/**
 * Canonical required-dimension set key (deduped + fixed enum order).
 * Serialization identity only — not priority / AND / weighting.
 */
export function buildCanonicalCapabilityEvaluationDimensionSetKey(
  dimensions: readonly AttentionObservationCapabilityEvaluationDimension[]
): string {
  return normalizeRequiredDimensions(dimensions).join(",");
}

export function normalizeRequiredDimensions(
  dimensions: readonly AttentionObservationCapabilityEvaluationDimension[]
): AttentionObservationCapabilityEvaluationDimension[] {
  const seen = new Set<AttentionObservationCapabilityEvaluationDimension>();
  for (const dimension of dimensions) {
    if (!DIMENSION_ORDER.has(dimension)) {
      throw new Error(
        `Unknown Capability Evaluation Dimension: ${String(dimension)}`
      );
    }
    seen.add(dimension);
  }
  return ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS.filter((d) =>
    seen.has(d)
  );
}

export function attentionObservationCapabilityEvaluationDimensionPolicyKey(
  capabilityRequirementKey: string,
  requiredDimensions: readonly AttentionObservationCapabilityEvaluationDimension[]
): string {
  return [
    "attention-observation-capability-evaluation-dimension-policy",
    capabilityRequirementKey,
    buildCanonicalCapabilityEvaluationDimensionSetKey(requiredDimensions),
  ].join("|");
}

/**
 * Collects all Capability Requirement keys represented in the GROUND-048 set.
 */
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

/**
 * Validates and normalizes explicit Evaluation Dimension Policy specification
 * against represented GROUND-048 Capability Requirement keys.
 *
 * Exact duplicate / semantically identical reordered set → one.
 * Same requirement key + different required dimension sets → deterministic reject.
 * Unknown capability_requirement_key → deterministic reject.
 */
export function normalizeAttentionObservationCapabilityEvaluationDimensionPolicySpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  specification: AttentionObservationCapabilityEvaluationDimensionPolicySpecification
): AttentionObservationCapabilityEvaluationDimensionPolicySpecification {
  const knownRequirements = collectCapabilityRequirementKeys(
    capabilityRequirementSet
  );

  const byRequirementKey = new Map<
    string,
    AttentionObservationCapabilityEvaluationDimensionPolicyInput
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
        `Capability Requirement ${entry.capability_requirement_key} not found in observation capability requirement set`
      );
    }

    const normalizedDimensions = normalizeRequiredDimensions(
      entry.required_dimensions
    );
    const nextSetKey =
      buildCanonicalCapabilityEvaluationDimensionSetKey(normalizedDimensions);

    const existing = byRequirementKey.get(entry.capability_requirement_key);
    if (existing) {
      const existingSetKey = buildCanonicalCapabilityEvaluationDimensionSetKey(
        existing.required_dimensions
      );
      if (existingSetKey !== nextSetKey) {
        throw new Error(
          `Multiple Capability Evaluation Dimension Policies declared for capability requirement ${entry.capability_requirement_key}`
        );
      }
      // Exact / reordered equivalent duplicate — keep first (identical after normalize).
      continue;
    }

    byRequirementKey.set(entry.capability_requirement_key, {
      capability_requirement_key: entry.capability_requirement_key,
      required_dimensions: normalizedDimensions,
    });
  }

  const policies = [...byRequirementKey.values()].sort((a, b) =>
    a.capability_requirement_key < b.capability_requirement_key
      ? -1
      : a.capability_requirement_key > b.capability_requirement_key
        ? 1
        : 0
  );

  return { policies };
}

function buildEvaluationDimensionPolicy(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  requiredDimensions: AttentionObservationCapabilityEvaluationDimension[]
): AttentionObservationCapabilityEvaluationDimensionPolicy {
  return {
    key: attentionObservationCapabilityEvaluationDimensionPolicyKey(
      capabilityRequirement.key,
      requiredDimensions
    ),
    capability_requirement_key: capabilityRequirement.key,
    observation_need_key: capabilityRequirement.observation_need_key,
    capability_semantic_key: capabilityRequirement.capability_semantic_key,
    required_dimensions: requiredDimensions,
  };
}

function assessRequirementPolicy(
  capabilityRequirement: AttentionObservationCapabilityRequirement,
  policyByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityEvaluationDimensionPolicyInput
  >
): AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment {
  const declared = policyByRequirementKey.get(capabilityRequirement.key);

  if (!declared) {
    return {
      capability_requirement: capabilityRequirement,
      status: "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED",
      evaluation_dimension_policy_basis: {
        capability_requirement: capabilityRequirement,
        evaluation_dimension_policy: null,
      },
    };
  }

  const evaluation_dimension_policy = buildEvaluationDimensionPolicy(
    capabilityRequirement,
    declared.required_dimensions
  );

  return {
    capability_requirement: capabilityRequirement,
    status: "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT",
    evaluation_dimension_policy_basis: {
      capability_requirement: capabilityRequirement,
      evaluation_dimension_policy,
    },
  };
}

/**
 * Pure per-AttentionCandidate Capability Evaluation Dimension Policy assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_DECLARED
 * 4. EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_PRESENT
 *
 * Explicit empty required_dimensions remains POLICY_PRESENT.
 * Does not synthesize default dimensions when policy is absent.
 */
export function assessAttentionCandidateObservationCapabilityEvaluationDimensionPolicies(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  policyByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationCapabilityEvaluationDimensionPolicyInput
  >
): AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityEvaluationDimensionPolicyCandidateStatus
  ): AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment => ({
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    status,
    requirement_policy_assessments: [],
    has_explicit_capability_evaluation_dimension_policies: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSION_POLICY_MODEL_LIMITATIONS,
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

  const requirement_policy_assessments =
    capabilityRequirementAssessment.capability_requirement_basis.requirements.map(
      (capabilityRequirement) =>
        assessRequirementPolicy(capabilityRequirement, policyByRequirementKey)
    );

  const has_explicit_capability_evaluation_dimension_policies =
    requirement_policy_assessments.some(
      (assessment) =>
        assessment.status ===
        "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT"
    );

  return {
    candidate_key,
    capability_requirement_assessment: capabilityRequirementAssessment,
    status: has_explicit_capability_evaluation_dimension_policies
      ? "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_DECLARED",
    requirement_policy_assessments,
    has_explicit_capability_evaluation_dimension_policies,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Capability Evaluation Dimension Policy composition.
 * Preserves GROUND-048 AttentionCandidate / Capability Requirement order.
 */
export function buildAttentionObservationCapabilityEvaluationDimensionPolicySet(
  input: AttentionObservationCapabilityEvaluationDimensionPolicyEvalInput
): AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationCapabilityEvaluationDimensionPolicySpecification(
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
        assessAttentionCandidateObservationCapabilityEvaluationDimensionPolicies(
          capabilityRequirementAssessment,
          policyByRequirementKey
        )
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_evaluation_dimension_policies:
      candidate_assessments.some(
        (c) => c.has_explicit_capability_evaluation_dimension_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
