/**
 * Reality Core v0.7 — Attention Observation Capability Dimension Acceptance Criteria
 * (GROUND-063).
 *
 * Pure composition of GROUND-061 Evaluation Dimension Policy
 * + explicit runtime Acceptance Criteria Specification.
 *
 * Sibling of GROUND-062 Required Dimension Coverage.
 * Must not import GROUND-060 / GROUND-062 / 050–059 runtime cores.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, Commitment assessment APIs,
 * scope/temporal classifiers, ActiveAt helpers.
 *
 * Acceptance Criterion ≠ Dimension Outcome ≠ current represented value
 * criterion absence ≠ empty accepted set ≠ accept-any ≠ reject-all
 */

import type { CapabilityAvailabilityStatus } from "../types.js";
import { ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS } from "./attention-observation-capability-evaluation-dimension-policy-core.js";
import type {
  AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  AttentionObservationCapabilityEvaluationDimension,
  AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus,
} from "./attention-observation-capability-scope-applicability-types.js";
import type {
  AttentionObservationCapabilityDeclarationTemporalRelation,
} from "./attention-observation-capability-declaration-temporal-applicability-types.js";
import type {
  AttentionObservationCapabilityVerificationTemporalRelation,
} from "./attention-observation-capability-verification-temporal-applicability-types.js";
import type {
  AttentionObservationCapabilityAvailabilityTemporalRelation,
} from "./attention-observation-capability-availability-temporal-applicability-types.js";
import type {
  AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment,
  AttentionObservationCapabilityAcceptanceCriteriaRequirementStatus,
  AttentionObservationCapabilityAvailabilityTemporalAcceptedPair,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaCandidateStatus,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaEvalInput,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaModelLimitation,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification,
  AttentionObservationCapabilityDimensionAcceptanceCriterion,
  AttentionObservationCapabilityDimensionAcceptanceCriterionDeclaration,
  AttentionObservationCapabilityDimensionAcceptanceCriterionInput,
  AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment,
  AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment,
} from "./attention-observation-capability-dimension-acceptance-criteria-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS: AttentionObservationCapabilityDimensionAcceptanceCriteriaModelLimitation[] =
  [
    "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PROVENANCE_NOT_MODELED",
    "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_AUTHORITY_NOT_MODELED",
    "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_INHERITANCE_NOT_MODELED",
    "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DEFAULTS_NOT_MODELED",
    "CAPABILITY_DIMENSION_ACCEPTANCE_MATCH_NOT_MODELED",
    "CAPABILITY_DIMENSION_SOURCE_OUTCOME_NOT_MODELED",
    "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED",
    "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "CAPABILITY_DIMENSION_MULTI_SOURCE_AGGREGATION_NOT_MODELED",
    "CAPABILITY_DIMENSION_AGGREGATION_POLICY_NOT_MODELED",
    "CAPABILITY_DIMENSION_WEIGHTING_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_SCOPE_NON_EXACT_APPLICABILITY_NOT_MODELED",
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

export const CANONICAL_SCOPE_APPLICABILITY_POSITION_STATUS_ORDER: AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus[] =
  [
    "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
    "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
  ];

export const CANONICAL_TEMPORAL_RELATION_ORDER: AttentionObservationCapabilityDeclarationTemporalRelation[] =
  [
    "FULL_REQUIRED_WINDOW_COVERAGE",
    "PARTIAL_REQUIRED_WINDOW_OVERLAP",
    "NO_REQUIRED_WINDOW_OVERLAP",
  ];

export const CANONICAL_AVAILABILITY_RAW_STATUS_ORDER: CapabilityAvailabilityStatus[] =
  ["AVAILABLE", "UNAVAILABLE"];

const DIMENSION_ORDER = new Map(
  ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS.map((d, i) => [d, i])
);

const SCOPE_STATUS_ORDER = new Map(
  CANONICAL_SCOPE_APPLICABILITY_POSITION_STATUS_ORDER.map((s, i) => [s, i])
);

const TEMPORAL_RELATION_ORDER = new Map(
  CANONICAL_TEMPORAL_RELATION_ORDER.map((r, i) => [r, i])
);

const AVAILABILITY_STATUS_ORDER = new Map(
  CANONICAL_AVAILABILITY_RAW_STATUS_ORDER.map((s, i) => [s, i])
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeScopeStatuses(
  statuses: readonly AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus[]
): AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus[] {
  const seen = new Set<AttentionObservationCapabilityDeclarationScopeApplicabilityPositionStatus>();
  for (const status of statuses) {
    if (!SCOPE_STATUS_ORDER.has(status)) {
      throw new Error(
        `Unknown Capability Scope Applicability position status: ${String(status)}`
      );
    }
    seen.add(status);
  }
  return CANONICAL_SCOPE_APPLICABILITY_POSITION_STATUS_ORDER.filter((s) =>
    seen.has(s)
  );
}

function normalizeTemporalRelations(
  relations: readonly AttentionObservationCapabilityDeclarationTemporalRelation[]
): AttentionObservationCapabilityDeclarationTemporalRelation[] {
  const seen = new Set<AttentionObservationCapabilityDeclarationTemporalRelation>();
  for (const relation of relations) {
    if (!TEMPORAL_RELATION_ORDER.has(relation)) {
      throw new Error(
        `Unknown Capability Temporal relation: ${String(relation)}`
      );
    }
    seen.add(relation);
  }
  return CANONICAL_TEMPORAL_RELATION_ORDER.filter((r) => seen.has(r));
}

function normalizeAvailabilityStatuses(
  statuses: readonly CapabilityAvailabilityStatus[]
): CapabilityAvailabilityStatus[] {
  const seen = new Set<CapabilityAvailabilityStatus>();
  for (const status of statuses) {
    if (!AVAILABILITY_STATUS_ORDER.has(status)) {
      throw new Error(
        `Unknown Capability Availability status: ${String(status)}`
      );
    }
    seen.add(status);
  }
  return CANONICAL_AVAILABILITY_RAW_STATUS_ORDER.filter((s) => seen.has(s));
}

function normalizeAvailabilityPairs(
  pairs: readonly AttentionObservationCapabilityAvailabilityTemporalAcceptedPair[]
): AttentionObservationCapabilityAvailabilityTemporalAcceptedPair[] {
  const unique = new Map<string, AttentionObservationCapabilityAvailabilityTemporalAcceptedPair>();
  for (const pair of pairs) {
    if (!TEMPORAL_RELATION_ORDER.has(pair.relation)) {
      throw new Error(
        `Unknown Capability Availability Temporal relation: ${String(pair.relation)}`
      );
    }
    if (!AVAILABILITY_STATUS_ORDER.has(pair.raw_availability_status)) {
      throw new Error(
        `Unknown Capability Availability status: ${String(pair.raw_availability_status)}`
      );
    }
    const key = `${pair.relation}+${pair.raw_availability_status}`;
    unique.set(key, {
      relation: pair.relation,
      raw_availability_status: pair.raw_availability_status,
    });
  }
  return [...unique.values()].sort((a, b) => {
    const relationDiff =
      (TEMPORAL_RELATION_ORDER.get(a.relation) ?? 0) -
      (TEMPORAL_RELATION_ORDER.get(b.relation) ?? 0);
    if (relationDiff !== 0) return relationDiff;
    return (
      (AVAILABILITY_STATUS_ORDER.get(a.raw_availability_status) ?? 0) -
      (AVAILABILITY_STATUS_ORDER.get(b.raw_availability_status) ?? 0)
    );
  });
}

/**
 * Canonical accepted-value serialization for criterion identity.
 * Serialization only — not priority / preference.
 */
export function buildCanonicalCapabilityDimensionAcceptanceCriterionValueKey(
  criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion
): string {
  switch (criterion.dimension) {
    case "STRUCTURAL_CAPABILITY_DECLARATION_MATCH":
    case "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT":
    case "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT":
    case "CAPABILITY_VERIFICATION_REPRESENTATION":
      return `${criterion.dimension}|${criterion.criterion_kind}`;

    case "CAPABILITY_SCOPE_APPLICABILITY":
      return `${criterion.dimension}|${normalizeScopeStatuses(
        criterion.accepted_position_statuses
      ).join(",")}`;

    case "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY":
    case "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY":
      return `${criterion.dimension}|${normalizeTemporalRelations(
        criterion.accepted_relations
      ).join(",")}`;

    case "CAPABILITY_AVAILABILITY_REPRESENTATION":
      return `${criterion.dimension}|${normalizeAvailabilityStatuses(
        criterion.accepted_raw_statuses
      ).join(",")}`;

    case "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY":
      return `${criterion.dimension}|${normalizeAvailabilityPairs(
        criterion.accepted_pairs
      )
        .map((p) => `${p.relation}+${p.raw_availability_status}`)
        .join(";")}`;
  }
}

export function attentionObservationCapabilityDimensionAcceptanceCriterionKey(
  capabilityRequirementKey: string,
  criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion
): string {
  return [
    "attention-observation-capability-dimension-acceptance-criterion",
    capabilityRequirementKey,
    criterion.dimension,
    buildCanonicalCapabilityDimensionAcceptanceCriterionValueKey(criterion),
  ].join("|");
}

function normalizeCriterion(
  criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion
): AttentionObservationCapabilityDimensionAcceptanceCriterion {
  switch (criterion.dimension) {
    case "STRUCTURAL_CAPABILITY_DECLARATION_MATCH":
    case "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT":
    case "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT":
    case "CAPABILITY_VERIFICATION_REPRESENTATION":
      if (criterion.criterion_kind !== "ANY_REPRESENTED_BASIS_ACCEPTABLE") {
        throw new Error(
          `Unknown presence acceptance criterion kind: ${String(criterion.criterion_kind)}`
        );
      }
      return {
        dimension: criterion.dimension,
        criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
      };

    case "CAPABILITY_SCOPE_APPLICABILITY":
      return {
        dimension: "CAPABILITY_SCOPE_APPLICABILITY",
        accepted_position_statuses: normalizeScopeStatuses(
          criterion.accepted_position_statuses
        ),
      };

    case "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY":
      return {
        dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
        accepted_relations: normalizeTemporalRelations(
          criterion.accepted_relations
        ),
      };

    case "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY":
      return {
        dimension: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
        accepted_relations: normalizeTemporalRelations(
          criterion.accepted_relations
        ),
      };

    case "CAPABILITY_AVAILABILITY_REPRESENTATION":
      return {
        dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
        accepted_raw_statuses: normalizeAvailabilityStatuses(
          criterion.accepted_raw_statuses
        ),
      };

    case "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY":
      return {
        dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
        accepted_pairs: normalizeAvailabilityPairs(criterion.accepted_pairs),
      };
  }
}

interface RequirementPolicyContext {
  assessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment;
  requiredDimensions: Set<AttentionObservationCapabilityEvaluationDimension>;
}

function collectRequirementPolicyContexts(
  policySet: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment
): Map<string, RequirementPolicyContext> {
  const byKey = new Map<string, RequirementPolicyContext>();

  for (const candidate of policySet.candidate_assessments) {
    for (const assessment of candidate.requirement_policy_assessments) {
      const key = assessment.capability_requirement.key;
      if (byKey.has(key)) continue;
      const policy =
        assessment.evaluation_dimension_policy_basis.evaluation_dimension_policy;
      byKey.set(key, {
        assessment,
        requiredDimensions: new Set(policy?.required_dimensions ?? []),
      });
    }
  }

  return byKey;
}

/**
 * Validates and normalizes Acceptance Criteria specification against GROUND-061.
 *
 * Exact / reordered-equivalent duplicates → one.
 * Same Requirement × Dimension + different criterion → reject.
 * Unknown Requirement / policy absent / empty policy / non-required dimension → reject.
 */
export function normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification(
  policySet: AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  specification: AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification
): AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification {
  const contexts = collectRequirementPolicyContexts(policySet);
  const byReqDim = new Map<
    string,
    AttentionObservationCapabilityDimensionAcceptanceCriterionInput
  >();

  for (const entry of specification.criteria) {
    if (
      !entry.capability_requirement_key ||
      entry.capability_requirement_key.trim().length === 0
    ) {
      throw new Error("Capability Requirement key must be non-empty");
    }

    const context = contexts.get(entry.capability_requirement_key);
    if (!context) {
      throw new Error(
        `Capability Requirement ${entry.capability_requirement_key} not found in capability evaluation dimension policy set`
      );
    }

    if (
      context.assessment.status ===
      "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED"
    ) {
      throw new Error(
        `Capability Requirement ${entry.capability_requirement_key} has no explicit Capability Evaluation Dimension Policy`
      );
    }

    if (
      context.assessment.status ===
        "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT" &&
      context.requiredDimensions.size === 0
    ) {
      throw new Error(
        `Capability Requirement ${entry.capability_requirement_key} has an explicit Evaluation Dimension Policy with zero required dimensions`
      );
    }

    const normalizedCriterion = normalizeCriterion(entry.criterion);
    const dimension = normalizedCriterion.dimension;

    if (!context.requiredDimensions.has(dimension)) {
      throw new Error(
        `Capability Evaluation Dimension ${dimension} is not required by policy for capability requirement ${entry.capability_requirement_key}`
      );
    }

    const mapKey = `${entry.capability_requirement_key}|${dimension}`;
    const existing = byReqDim.get(mapKey);
    if (existing) {
      const existingKey =
        buildCanonicalCapabilityDimensionAcceptanceCriterionValueKey(
          existing.criterion
        );
      const nextKey =
        buildCanonicalCapabilityDimensionAcceptanceCriterionValueKey(
          normalizedCriterion
        );
      if (existingKey !== nextKey) {
        throw new Error(
          `Multiple Capability Dimension Acceptance Criteria declared for capability requirement ${entry.capability_requirement_key} dimension ${dimension}`
        );
      }
      continue;
    }

    byReqDim.set(mapKey, {
      capability_requirement_key: entry.capability_requirement_key,
      criterion: normalizedCriterion,
    });
  }

  const criteria = [...byReqDim.values()].sort((a, b) => {
    const reqDiff = compareStrings(
      a.capability_requirement_key,
      b.capability_requirement_key
    );
    if (reqDiff !== 0) return reqDiff;
    return (
      (DIMENSION_ORDER.get(a.criterion.dimension) ?? 0) -
      (DIMENSION_ORDER.get(b.criterion.dimension) ?? 0)
    );
  });

  return { criteria };
}

function buildCriterionDeclaration(
  assessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
  criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion
): AttentionObservationCapabilityDimensionAcceptanceCriterionDeclaration {
  const requirement = assessment.capability_requirement;
  return {
    key: attentionObservationCapabilityDimensionAcceptanceCriterionKey(
      requirement.key,
      criterion
    ),
    capability_requirement_key: requirement.key,
    observation_need_key: requirement.observation_need_key,
    capability_semantic_key: requirement.capability_semantic_key,
    dimension: criterion.dimension,
    criterion,
  };
}

function assessRequirementAcceptanceCriteria(
  policyAssessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
  criteriaByDimension: ReadonlyMap<
    AttentionObservationCapabilityEvaluationDimension,
    AttentionObservationCapabilityDimensionAcceptanceCriterion
  >
): AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment {
  const mapNotApplicable = (
    status: AttentionObservationCapabilityAcceptanceCriteriaRequirementStatus
  ): AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment => ({
    capability_requirement: policyAssessment.capability_requirement,
    evaluation_dimension_policy_assessment: policyAssessment,
    status,
    required_dimension_criterion_assessments: [],
    has_explicit_capability_dimension_acceptance_criteria: false,
  });

  if (
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return mapNotApplicable(policyAssessment.status);
  }

  if (
    policyAssessment.status ===
    "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED"
  ) {
    return mapNotApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY"
    );
  }

  const policy =
    policyAssessment.evaluation_dimension_policy_basis
      .evaluation_dimension_policy;
  if (!policy || policy.required_dimensions.length === 0) {
    return mapNotApplicable("NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED");
  }

  const required_dimension_criterion_assessments: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment[] =
    [...policy.required_dimensions]
      .sort(
        (a, b) =>
          (DIMENSION_ORDER.get(a) ?? 0) - (DIMENSION_ORDER.get(b) ?? 0)
      )
      .map((required_dimension) => {
        const criterion = criteriaByDimension.get(required_dimension) ?? null;
        if (!criterion) {
          return {
            required_dimension,
            status:
              "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_DECLARED" as const,
            acceptance_criterion: null,
          };
        }
        return {
          required_dimension,
          status:
            "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT" as const,
          acceptance_criterion: buildCriterionDeclaration(
            policyAssessment,
            criterion
          ),
        };
      });

  const has_explicit_capability_dimension_acceptance_criteria =
    required_dimension_criterion_assessments.some(
      (a) =>
        a.status ===
        "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT"
    );

  return {
    capability_requirement: policyAssessment.capability_requirement,
    evaluation_dimension_policy_assessment: policyAssessment,
    status: has_explicit_capability_dimension_acceptance_criteria
      ? "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED",
    required_dimension_criterion_assessments,
    has_explicit_capability_dimension_acceptance_criteria,
  };
}

/**
 * Pure per-AttentionCandidate Acceptance Criteria assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES
 * 4. NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED
 * 5. NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED
 * 6. EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityDimensionAcceptanceCriteria(
  policyAssessment: AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  criteriaByRequirementDimension: ReadonlyMap<
    string,
    Map<
      AttentionObservationCapabilityEvaluationDimension,
      AttentionObservationCapabilityDimensionAcceptanceCriterion
    >
  >
): AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment {
  const candidate_key = policyAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityDimensionAcceptanceCriteriaCandidateStatus
  ): AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment => ({
    candidate_key,
    evaluation_dimension_policy_assessment: policyAssessment,
    status,
    requirement_acceptance_criteria_assessments: [],
    has_explicit_capability_dimension_acceptance_criteria: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
    ],
  });

  if (
    policyAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    policyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    policyAssessment.status ===
    "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_DECLARED"
  ) {
    return notApplicable(
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
    );
  }

  const requirement_acceptance_criteria_assessments =
    policyAssessment.requirement_policy_assessments.map((reqPolicy) =>
      assessRequirementAcceptanceCriteria(
        reqPolicy,
        criteriaByRequirementDimension.get(
          reqPolicy.capability_requirement.key
        ) ?? new Map()
      )
    );

  const hasAnyRequiredDimensions =
    requirement_acceptance_criteria_assessments.some(
      (a) =>
        a.status !==
          "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY" &&
        a.status !== "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED" &&
        a.required_dimension_criterion_assessments.length > 0
    );

  if (!hasAnyRequiredDimensions) {
    const allEmptyPolicy =
      requirement_acceptance_criteria_assessments.every(
        (a) =>
          a.status === "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
      );
    return {
      candidate_key,
      evaluation_dimension_policy_assessment: policyAssessment,
      status: allEmptyPolicy
        ? "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
        : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES",
      requirement_acceptance_criteria_assessments,
      has_explicit_capability_dimension_acceptance_criteria: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
      ],
    };
  }

  const has_explicit_capability_dimension_acceptance_criteria =
    requirement_acceptance_criteria_assessments.some(
      (a) => a.has_explicit_capability_dimension_acceptance_criteria
    );

  return {
    candidate_key,
    evaluation_dimension_policy_assessment: policyAssessment,
    status: has_explicit_capability_dimension_acceptance_criteria
      ? "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRESENT"
      : "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DECLARED",
    requirement_acceptance_criteria_assessments,
    has_explicit_capability_dimension_acceptance_criteria,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Capability Dimension Acceptance Criteria composition.
 * Preserves Candidate → Requirement → required dimension order.
 * Does not inspect 060/062 values or produce outcomes.
 */
export function buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet(
  input: AttentionObservationCapabilityDimensionAcceptanceCriteriaEvalInput
): AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification(
      input.capability_evaluation_dimension_policy_set,
      input.specification
    );

  const criteriaByRequirementDimension = new Map<
    string,
    Map<
      AttentionObservationCapabilityEvaluationDimension,
      AttentionObservationCapabilityDimensionAcceptanceCriterion
    >
  >();

  for (const entry of normalizedSpecification.criteria) {
    let byDim = criteriaByRequirementDimension.get(
      entry.capability_requirement_key
    );
    if (!byDim) {
      byDim = new Map();
      criteriaByRequirementDimension.set(
        entry.capability_requirement_key,
        byDim
      );
    }
    byDim.set(entry.criterion.dimension, entry.criterion);
  }

  const candidate_assessments =
    input.capability_evaluation_dimension_policy_set.candidate_assessments.map(
      (policyAssessment) =>
        assessAttentionCandidateObservationCapabilityDimensionAcceptanceCriteria(
          policyAssessment,
          criteriaByRequirementDimension
        )
    );

  return {
    capability_evaluation_dimension_policy_set:
      input.capability_evaluation_dimension_policy_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capability_dimension_acceptance_criteria:
      candidate_assessments.some(
        (c) => c.has_explicit_capability_dimension_acceptance_criteria
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
    ],
  };
}
