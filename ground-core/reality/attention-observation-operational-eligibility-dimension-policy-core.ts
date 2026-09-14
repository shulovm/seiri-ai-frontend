/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Dimension
 * Policy (GROUND-084).
 *
 * Pure composition of GROUND-048 Explicit Capability Requirement Set
 * + explicit Operational Eligibility Dimension Policy Specification.
 *
 * Independent operational-policy branch over the exact Requirement set.
 * Must not import GROUND-061–083 runtime cores / current Capability State.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, persisted
 * project state, GROUND-041–045 current Permission/Authority/Resource evaluation.
 *
 * required dimension ≠ accepted value ≠ current state ≠ AND composition
 * policy absence ≠ explicit empty policy
 * empty dimensions ≠ operationally eligible ≠ can_execute
 * CAPABILITY_STATE remains one optional dimension, not effective Capability
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
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
  AttentionObservationOperationalEligibilityDimensionPolicyEvalInput,
  AttentionObservationOperationalEligibilityDimensionPolicyInput,
  AttentionObservationOperationalEligibilityDimensionPolicyModelLimitation,
  AttentionObservationOperationalEligibilityDimensionPolicySetAssessment,
  AttentionObservationOperationalEligibilityDimensionPolicySpecification,
  AttentionObservationOperationalEligibilityDimensionPolicyStatus,
} from "./attention-observation-operational-eligibility-dimension-policy-types.js";

export {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityDimensionPolicyModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_DIMENSION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_DIMENSION_COVERAGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_DIMENSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_DIMENSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_READINESS_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_READINESS_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_POLICY_COMPLETENESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_POLICY_DEFAULTS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_POLICY_PRECEDENCE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_POLICY_INHERITANCE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_POLICY_PROVENANCE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_POLICY_AUTHORITY_NOT_MODELED",
    "EFFECTIVE_VERIFICATION_OPERATIONAL_ROLE_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_AVAILABILITY_OPERATIONAL_ROLE_NOT_MODELED",
    "OBSERVATION_CONTEXT_APPLICABILITY_OPERATIONAL_ROLE_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Canonical Operational Eligibility Dimension order — serialization only.
 * Not priority / evaluation sequence / causal order.
 */
export const CANONICAL_OPERATIONAL_ELIGIBILITY_DIMENSION_ORDER: AttentionObservationOperationalEligibilityDimension[] =
  [
    "CAPABILITY_STATE",
    "PERMISSION",
    "AUTHORITY",
    "RESOURCE_READINESS",
    "FEASIBILITY",
  ];

const DIMENSION_ORDER = new Map(
  CANONICAL_OPERATIONAL_ELIGIBILITY_DIMENSION_ORDER.map((d, i) => [d, i])
);

const EMPTY_REQUIRED_DIMENSION_SET_KEY = "EMPTY_REQUIRED_DIMENSION_SET";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeDimension(
  dimension: AttentionObservationOperationalEligibilityDimension
): AttentionObservationOperationalEligibilityDimension {
  if (!DIMENSION_ORDER.has(dimension)) {
    throw new Error(
      `Unknown Operational Eligibility Dimension: ${String(dimension)}`
    );
  }
  return dimension;
}

/**
 * Canonicalize required dimensions:
 * - unknown → reject
 * - exact duplicates → one
 * - order → canonical dimension order
 */
export function canonicalizeOperationalEligibilityRequiredDimensions(
  dimensions: readonly AttentionObservationOperationalEligibilityDimension[]
): AttentionObservationOperationalEligibilityDimension[] {
  const present = new Set<AttentionObservationOperationalEligibilityDimension>();

  for (const dimension of dimensions) {
    present.add(normalizeDimension(dimension));
  }

  const canonical: AttentionObservationOperationalEligibilityDimension[] = [];
  for (const dimension of CANONICAL_OPERATIONAL_ELIGIBILITY_DIMENSION_ORDER) {
    if (present.has(dimension)) {
      canonical.push(dimension);
    }
  }
  return canonical;
}

export function buildCanonicalOperationalEligibilityRequiredDimensionSetKey(
  dimensions: readonly AttentionObservationOperationalEligibilityDimension[]
): string {
  const canonical = canonicalizeOperationalEligibilityRequiredDimensions(
    dimensions
  );
  if (canonical.length === 0) {
    return EMPTY_REQUIRED_DIMENSION_SET_KEY;
  }
  return canonical.join(",");
}

export function attentionObservationOperationalEligibilityDimensionPolicyKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  canonicalRequiredDimensionSetKey: string
): string {
  return [
    "attention-observation-operational-eligibility-dimension-policy",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    canonicalRequiredDimensionSetKey,
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

function dimensionSetsEqual(
  a: readonly AttentionObservationOperationalEligibilityDimension[],
  b: readonly AttentionObservationOperationalEligibilityDimension[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Validates and normalizes Operational Eligibility Dimension Policy specification
 * against represented GROUND-048 Candidate / non-empty Requirement set contexts.
 *
 * Exact duplicate entries → one.
 * Same Candidate + different required-dimension sets → reject (no silent merge).
 * Unknown Candidate / zero-Requirement domain / no planning basis → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityDimensionPolicySpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  specification: AttentionObservationOperationalEligibilityDimensionPolicySpecification
): AttentionObservationOperationalEligibilityDimensionPolicySpecification {
  const contexts = collectRequirementSetContexts(capabilityRequirementSet);
  const byCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityDimensionPolicyInput
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
        `Operational Eligibility Dimension Policy requires an Observation planning basis for candidate ${entry.candidate_key}`
      );
    }

    if (
      context.candidateAssessment.status ===
        "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED" ||
      !context.candidateAssessment.has_explicit_capability_requirements ||
      context.requirements.length === 0
    ) {
      throw new Error(
        `Operational Eligibility Dimension Policy requires a non-empty Capability Requirement set for candidate ${entry.candidate_key}`
      );
    }

    const normalizedDimensions =
      canonicalizeOperationalEligibilityRequiredDimensions(
        entry.required_dimensions
      );
    const existing = byCandidateKey.get(entry.candidate_key);
    if (existing) {
      if (!dimensionSetsEqual(existing.required_dimensions, normalizedDimensions)) {
        throw new Error(
          `Conflicting Operational Eligibility Dimension Policies declared for candidate ${entry.candidate_key}`
        );
      }
      continue;
    }

    byCandidateKey.set(entry.candidate_key, {
      candidate_key: entry.candidate_key,
      required_dimensions: normalizedDimensions,
    });
  }

  const policies = [...byCandidateKey.values()].sort((a, b) =>
    compareStrings(a.candidate_key, b.candidate_key)
  );

  return { policies };
}

function assertPolicyAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT" &&
    assessment.operational_eligibility_dimension_policy === null
  ) {
    throw new Error(
      `Operational Eligibility Dimension Policy invariant violated: PRESENT requires non-null policy for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT" &&
    assessment.operational_eligibility_dimension_policy !== null
  ) {
    throw new Error(
      `Operational Eligibility Dimension Policy invariant violated: non-present status requires null policy for candidate ${assessment.candidate_key}`
    );
  }

  const policy = assessment.operational_eligibility_dimension_policy;
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
        `Operational Eligibility Dimension Policy invariant violated: capability_requirement_keys must exactly equal GROUND-048 set for candidate ${assessment.candidate_key}`
      );
    }
    if (policy.capability_requirement_keys.length === 0) {
      throw new Error(
        `Operational Eligibility Dimension Policy invariant violated: empty Requirement domain for candidate ${assessment.candidate_key}`
      );
    }
  }
}

function buildDimensionPolicy(
  context: RequirementSetContext,
  requiredDimensions: AttentionObservationOperationalEligibilityDimension[]
): AttentionObservationOperationalEligibilityDimensionPolicy {
  const dimensionSetKey =
    buildCanonicalOperationalEligibilityRequiredDimensionSetKey(
      requiredDimensions
    );
  return {
    key: attentionObservationOperationalEligibilityDimensionPolicyKey(
      context.candidateAssessment.candidate_key,
      context.observationNeedKey,
      context.capabilityRequirementSetKey,
      dimensionSetKey
    ),
    candidate_key: context.candidateAssessment.candidate_key,
    observation_need_key: context.observationNeedKey,
    capability_requirement_set_key: context.capabilityRequirementSetKey,
    capability_requirement_keys: [...context.capabilityRequirementKeys],
    required_dimensions: [...requiredDimensions],
  };
}

/**
 * Pure per-AttentionCandidate Operational Eligibility Dimension Policy assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED
 * 4. EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT
 *
 * Does not inspect current GROUND-083 Capability State or other dimension states.
 */
export function assessAttentionCandidateObservationOperationalEligibilityDimensionPolicy(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  policyByCandidateKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityDimensionPolicyInput
  >,
  context: RequirementSetContext
): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationOperationalEligibilityDimensionPolicyStatus
  ): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment =
      {
        candidate_key,
        capability_requirement_assessment: capabilityRequirementAssessment,
        status,
        operational_eligibility_dimension_policy: null,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_MODEL_LIMITATIONS,
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
      "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
    );
  }

  const assessment: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment =
    {
      candidate_key,
      capability_requirement_assessment: capabilityRequirementAssessment,
      status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
      operational_eligibility_dimension_policy: buildDimensionPolicy(
        context,
        declared.required_dimensions
      ),
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_MODEL_LIMITATIONS,
      ],
    };
  assertPolicyAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitPolicy(
  assessments: AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Explicit Operational Eligibility Dimension Policy composition.
 * Preserves GROUND-048 AttentionCandidate order.
 * Does not inspect current GROUND-083 Capability State or produce eligibility.
 */
export function buildAttentionObservationOperationalEligibilityDimensionPolicySet(
  input: AttentionObservationOperationalEligibilityDimensionPolicyEvalInput
): AttentionObservationOperationalEligibilityDimensionPolicySetAssessment {
  const contexts = collectRequirementSetContexts(
    input.capability_requirement_set
  );

  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityDimensionPolicySpecification(
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
        return assessAttentionCandidateObservationOperationalEligibilityDimensionPolicy(
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
    has_explicit_operational_eligibility_dimension_policies:
      hasAnyExplicitPolicy(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
