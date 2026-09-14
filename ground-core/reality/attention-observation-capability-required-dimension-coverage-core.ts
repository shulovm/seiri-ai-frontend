/**
 * Reality Core v0.7 — Attention Observation Capability Required Dimension Coverage
 * (GROUND-062).
 *
 * Pure composition of:
 *   GROUND-060 Capability Applicability Composition Basis
 *   GROUND-061 Explicit Capability Evaluation Dimension Policy
 *
 * Answers only: for each explicitly required evaluation dimension, is a
 * corresponding canonical evaluation basis represented?
 *
 * REPRESENTED ≠ PASS / acceptance / satisfaction
 * NOT_REPRESENTED ≠ FAIL / incapability / unsatisfied
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, Commitment,
 * ActiveAt helpers, scope/temporal classifiers, rematch of 050–059.
 */

import type {
  AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  AttentionObservationCapabilityApplicabilityCompositionSetAssessment,
  AttentionObservationCapabilityDeclarationApplicabilityCompositionPosition,
  AttentionObservationCapabilityRequirementApplicabilityCompositionPosition,
} from "./attention-observation-capability-applicability-composition-types.js";
import type {
  AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment,
  AttentionObservationCapabilityEvaluationDimension,
  AttentionObservationCapabilityEvaluationDimensionPolicySetAssessment,
  AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import { ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS } from "./attention-observation-capability-evaluation-dimension-policy-core.js";
import type {
  AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment,
  AttentionObservationCapabilityRequiredDimensionCoverageBasis,
  AttentionObservationCapabilityRequiredDimensionCoverageCandidateStatus,
  AttentionObservationCapabilityRequiredDimensionCoverageInput,
  AttentionObservationCapabilityRequiredDimensionCoverageModelLimitation,
  AttentionObservationCapabilityRequiredDimensionCoverageSetAssessment,
  AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
  AttentionObservationCapabilityRequirementRequiredDimensionCoverageAssessment,
} from "./attention-observation-capability-required-dimension-coverage-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS: AttentionObservationCapabilityRequiredDimensionCoverageModelLimitation[] =
  [
    "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED",
    "CAPABILITY_MISSING_DIMENSION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_DIMENSION_AGGREGATION_NOT_MODELED",
    "CAPABILITY_DIMENSION_WEIGHTING_NOT_MODELED",
    "CAPABILITY_REQUIRED_DIMENSION_COMPLETENESS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_APPLICABILITY_POLICY_PRECEDENCE_NOT_MODELED",
    "CAPABILITY_APPLICABILITY_POLICY_AUTHORITY_NOT_MODELED",
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
    "OBSERVATION_PRIORITY_NOT_MODELED",
    "OBSERVATION_RANKING_NOT_MODELED",
    "OBSERVATION_SCHEDULING_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Capability Applicability Composition set and Capability Evaluation Dimension Policy set do not share the same Capability Requirement context";

const DIMENSION_ORDER = new Map(
  ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS.map((d, i) => [d, i])
);

export function attentionObservationCapabilityRequiredDimensionCoverageKey(
  capabilityRequirementKey: string,
  requiredDimension: AttentionObservationCapabilityEvaluationDimension
): string {
  return [
    "attention-observation-capability-required-dimension-coverage",
    capabilityRequirementKey,
    requiredDimension,
  ].join("|");
}

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortBasisRefs(
  refs: AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef[]
): AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef[] {
  return [...refs].sort((a, b) => {
    const kindDiff = compareStrings(a.kind, b.kind);
    if (kindDiff !== 0) return kindDiff;
    switch (a.kind) {
      case "STRUCTURAL_CAPABILITY_DECLARATION_MATCH": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH" }
        >;
        return (
          compareStrings(a.observer_candidate_key, bb.observer_candidate_key) ||
          compareStrings(
            a.capability_declaration_id,
            bb.capability_declaration_id
          ) ||
          compareStrings(
            a.capability_declaration_match_key,
            bb.capability_declaration_match_key
          )
        );
      }
      case "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT" }
        >;
        return compareStrings(
          a.capability_scope_requirement_key,
          bb.capability_scope_requirement_key
        );
      }
      case "CAPABILITY_SCOPE_APPLICABILITY": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "CAPABILITY_SCOPE_APPLICABILITY" }
        >;
        return (
          compareStrings(a.observer_candidate_key, bb.observer_candidate_key) ||
          compareStrings(
            a.capability_declaration_id,
            bb.capability_declaration_id
          ) ||
          compareStrings(
            a.scope_applicability_position_key,
            bb.scope_applicability_position_key
          )
        );
      }
      case "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT" }
        >;
        return compareStrings(
          a.capability_temporal_requirement_key,
          bb.capability_temporal_requirement_key
        );
      }
      case "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY" }
        >;
        return (
          compareStrings(a.observer_candidate_key, bb.observer_candidate_key) ||
          compareStrings(
            a.capability_declaration_id,
            bb.capability_declaration_id
          ) ||
          compareStrings(
            a.declaration_temporal_position_key,
            bb.declaration_temporal_position_key
          )
        );
      }
      case "CAPABILITY_VERIFICATION_REPRESENTATION": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "CAPABILITY_VERIFICATION_REPRESENTATION" }
        >;
        return (
          compareStrings(a.observer_candidate_key, bb.observer_candidate_key) ||
          compareStrings(
            a.capability_declaration_id,
            bb.capability_declaration_id
          ) ||
          compareStrings(
            a.capability_verification_declaration_id,
            bb.capability_verification_declaration_id
          )
        );
      }
      case "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY" }
        >;
        return (
          compareStrings(a.observer_candidate_key, bb.observer_candidate_key) ||
          compareStrings(
            a.capability_declaration_id,
            bb.capability_declaration_id
          ) ||
          compareStrings(
            a.capability_verification_declaration_id,
            bb.capability_verification_declaration_id
          ) ||
          compareStrings(
            a.verification_temporal_position_key,
            bb.verification_temporal_position_key
          )
        );
      }
      case "CAPABILITY_AVAILABILITY_REPRESENTATION": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "CAPABILITY_AVAILABILITY_REPRESENTATION" }
        >;
        return (
          compareStrings(a.observer_candidate_key, bb.observer_candidate_key) ||
          compareStrings(
            a.capability_declaration_id,
            bb.capability_declaration_id
          ) ||
          compareStrings(
            a.capability_availability_declaration_id,
            bb.capability_availability_declaration_id
          )
        );
      }
      case "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY": {
        const bb = b as Extract<
          AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
          { kind: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY" }
        >;
        return (
          compareStrings(a.observer_candidate_key, bb.observer_candidate_key) ||
          compareStrings(
            a.capability_declaration_id,
            bb.capability_declaration_id
          ) ||
          compareStrings(
            a.capability_availability_declaration_id,
            bb.capability_availability_declaration_id
          ) ||
          compareStrings(
            a.availability_temporal_position_key,
            bb.availability_temporal_position_key
          )
        );
      }
    }
  });
}

/**
 * Validates 060 + 061 share the same AttentionCandidate / CapabilityRequirement context.
 * Uses canonical keys — not object identity.
 */
export function assertCompatibleCapabilityRequiredDimensionCoverageContexts(
  input: AttentionObservationCapabilityRequiredDimensionCoverageInput
): void {
  const compositionCandidates =
    input.capability_applicability_composition_set.candidate_assessments;
  const policyCandidates =
    input.capability_evaluation_dimension_policy_set.candidate_assessments;

  if (compositionCandidates.length !== policyCandidates.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate assessment count mismatch`
    );
  }

  for (let i = 0; i < compositionCandidates.length; i++) {
    const composition = compositionCandidates[i];
    const policy = policyCandidates[i];
    if (composition.candidate_key !== policy.candidate_key) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${composition.candidate_key} vs ${policy.candidate_key})`
      );
    }

    const compositionReqKeys = collectCompositionRequirementKeys(composition);
    const policyReqKeys = new Set(
      policy.requirement_policy_assessments.map(
        (a) => a.capability_requirement.key
      )
    );

    // When both have explicit requirements, keys must align.
    if (compositionReqKeys.size > 0 && policyReqKeys.size > 0) {
      for (const key of policyReqKeys) {
        if (!compositionReqKeys.has(key)) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement key ${key} missing from Applicability Composition`
          );
        }
      }
      for (const key of compositionReqKeys) {
        if (!policyReqKeys.has(key)) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: CapabilityRequirement key ${key} missing from Evaluation Dimension Policy`
          );
        }
      }
    }

    // ObservationNeed keys from composition positions vs policy requirements.
    const compositionNeedKeys = collectCompositionObservationNeedKeys(
      composition
    );
    const policyNeedKeys = new Set(
      policy.requirement_policy_assessments.map(
        (a) => a.capability_requirement.observation_need_key
      )
    );
    if (compositionNeedKeys.size > 0 && policyNeedKeys.size > 0) {
      for (const need of policyNeedKeys) {
        if (!compositionNeedKeys.has(need)) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key ${need} mismatch`
          );
        }
      }
    }
  }
}

function collectCompositionRequirementKeys(
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment
): Set<string> {
  const keys = new Set<string>();
  for (const obs of composition.observer_applicability_bases) {
    for (const req of obs.requirement_composition_positions) {
      keys.add(req.capability_requirement.key);
    }
  }
  // Also from embedded 054/056 assessments when composition positions empty.
  for (const assessment of composition.scope_applicability_assessment
    .capability_scope_requirement_assessment.requirement_scope_assessments) {
    keys.add(assessment.capability_requirement.key);
  }
  for (const assessment of composition
    .declaration_temporal_applicability_assessment
    .capability_temporal_requirement_assessment
    .requirement_temporal_assessments) {
    keys.add(assessment.capability_requirement.key);
  }
  return keys;
}

function collectCompositionObservationNeedKeys(
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment
): Set<string> {
  const keys = new Set<string>();
  for (const obs of composition.observer_applicability_bases) {
    keys.add(obs.observation_need_key);
  }
  for (const assessment of composition.scope_applicability_assessment
    .capability_scope_requirement_assessment.requirement_scope_assessments) {
    keys.add(assessment.capability_requirement.observation_need_key);
  }
  return keys;
}

function collectDeclarationPositionsForRequirement(
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  capabilityRequirementKey: string
): AttentionObservationCapabilityDeclarationApplicabilityCompositionPosition[] {
  const positions: AttentionObservationCapabilityDeclarationApplicabilityCompositionPosition[] =
    [];
  for (const obs of composition.observer_applicability_bases) {
    for (const req of obs.requirement_composition_positions) {
      if (req.capability_requirement.key === capabilityRequirementKey) {
        positions.push(...req.declaration_composition_positions);
      }
    }
  }
  return positions;
}

function findRequirementCompositionPosition(
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  capabilityRequirementKey: string
): AttentionObservationCapabilityRequirementApplicabilityCompositionPosition | null {
  for (const obs of composition.observer_applicability_bases) {
    for (const req of obs.requirement_composition_positions) {
      if (req.capability_requirement.key === capabilityRequirementKey) {
        return req;
      }
    }
  }
  return null;
}

function collectRefsForDimension(
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  capabilityRequirementKey: string,
  dimension: AttentionObservationCapabilityEvaluationDimension
): AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef[] {
  const declarations = collectDeclarationPositionsForRequirement(
    composition,
    capabilityRequirementKey
  );
  const requirementComposition = findRequirementCompositionPosition(
    composition,
    capabilityRequirementKey
  );

  switch (dimension) {
    case "STRUCTURAL_CAPABILITY_DECLARATION_MATCH":
      return declarations.map((d) => ({
        kind: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH" as const,
        capability_declaration_match_key: d.capability_declaration_match.key,
        capability_declaration_id:
          d.capability_declaration_match.capability_declaration_id,
        observer_candidate_key: d.observer_candidate_key,
      }));

    case "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT": {
      const fromComposition =
        requirementComposition?.capability_scope_requirement_assessment
          .scope_requirement_basis.scope_requirement ?? null;
      const fromEmbedded =
        composition.scope_applicability_assessment.capability_scope_requirement_assessment.requirement_scope_assessments.find(
          (a) => a.capability_requirement.key === capabilityRequirementKey
        )?.scope_requirement_basis.scope_requirement ?? null;
      const scopeRequirement = fromComposition ?? fromEmbedded;
      if (!scopeRequirement) return [];
      return [
        {
          kind: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
          capability_scope_requirement_key: scopeRequirement.key,
        },
      ];
    }

    case "CAPABILITY_SCOPE_APPLICABILITY":
      return declarations.flatMap((d) => {
        const pos = d.scope_dimension.scope_applicability_position;
        if (!pos) return [];
        return [
          {
            kind: "CAPABILITY_SCOPE_APPLICABILITY" as const,
            capability_declaration_id:
              d.capability_declaration_match.capability_declaration_id,
            scope_applicability_position_key: pos.key,
            observer_candidate_key: d.observer_candidate_key,
          },
        ];
      });

    case "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT": {
      const fromComposition =
        requirementComposition?.capability_temporal_requirement_assessment
          .temporal_requirement_basis.temporal_requirement ?? null;
      const fromEmbedded =
        composition.declaration_temporal_applicability_assessment.capability_temporal_requirement_assessment.requirement_temporal_assessments.find(
          (a) => a.capability_requirement.key === capabilityRequirementKey
        )?.temporal_requirement_basis.temporal_requirement ?? null;
      const temporalRequirement = fromComposition ?? fromEmbedded;
      if (!temporalRequirement) return [];
      return [
        {
          kind: "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
          capability_temporal_requirement_key: temporalRequirement.key,
        },
      ];
    }

    case "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY":
      return declarations.flatMap((d) => {
        const pos =
          d.declaration_temporal_dimension
            .declaration_temporal_applicability_position;
        if (!pos) return [];
        return [
          {
            kind: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY" as const,
            capability_declaration_id:
              d.capability_declaration_match.capability_declaration_id,
            declaration_temporal_position_key: pos.key,
            observer_candidate_key: d.observer_candidate_key,
          },
        ];
      });

    case "CAPABILITY_VERIFICATION_REPRESENTATION":
      return declarations.flatMap((d) =>
        d.verification_temporal_dimension.capability_declaration_verification_position.verification_links.map(
          (link) => ({
            kind: "CAPABILITY_VERIFICATION_REPRESENTATION" as const,
            capability_declaration_id:
              d.capability_declaration_match.capability_declaration_id,
            capability_verification_declaration_id:
              link.capability_verification_declaration_id,
            observer_candidate_key: d.observer_candidate_key,
          })
        )
      );

    case "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY":
      return declarations.flatMap((d) =>
        d.verification_temporal_dimension.verification_temporal_positions.map(
          (pos) => ({
            kind: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY" as const,
            capability_declaration_id:
              d.capability_declaration_match.capability_declaration_id,
            capability_verification_declaration_id:
              pos.capability_verification_link
                .capability_verification_declaration_id,
            verification_temporal_position_key: pos.key,
            observer_candidate_key: d.observer_candidate_key,
          })
        )
      );

    case "CAPABILITY_AVAILABILITY_REPRESENTATION":
      return declarations.flatMap((d) =>
        d.availability_temporal_dimension.capability_declaration_availability_position.availability_links.map(
          (link) => ({
            kind: "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
            capability_declaration_id:
              d.capability_declaration_match.capability_declaration_id,
            capability_availability_declaration_id:
              link.capability_availability_declaration_id,
            observer_candidate_key: d.observer_candidate_key,
          })
        )
      );

    case "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY":
      return declarations.flatMap((d) =>
        d.availability_temporal_dimension.availability_temporal_positions.map(
          (pos) => ({
            kind: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY" as const,
            capability_declaration_id:
              d.capability_declaration_match.capability_declaration_id,
            capability_availability_declaration_id:
              pos.capability_availability_link
                .capability_availability_declaration_id,
            availability_temporal_position_key: pos.key,
            observer_candidate_key: d.observer_candidate_key,
          })
        )
      );
  }
}

function buildCoverageBasis(
  capabilityRequirementKey: string,
  dimension: AttentionObservationCapabilityEvaluationDimension,
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment
): AttentionObservationCapabilityRequiredDimensionCoverageBasis {
  const represented_basis_refs = sortBasisRefs(
    collectRefsForDimension(composition, capabilityRequirementKey, dimension)
  );
  return {
    key: attentionObservationCapabilityRequiredDimensionCoverageKey(
      capabilityRequirementKey,
      dimension
    ),
    capability_requirement_key: capabilityRequirementKey,
    required_dimension: dimension,
    status:
      represented_basis_refs.length > 0
        ? "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED"
        : "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED",
    represented_basis_refs,
  };
}

function assessRequirementCoverage(
  policyAssessment: AttentionObservationCapabilityRequirementEvaluationDimensionPolicyAssessment,
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment
): AttentionObservationCapabilityRequirementRequiredDimensionCoverageAssessment {
  const policy =
    policyAssessment.evaluation_dimension_policy_basis
      .evaluation_dimension_policy;

  if (
    policyAssessment.status ===
      "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED" ||
    policy === null
  ) {
    return {
      capability_requirement: policyAssessment.capability_requirement,
      evaluation_dimension_policy_assessment: policyAssessment,
      required_dimension_coverage_bases: [],
      has_required_dimension_coverage_assessment: false,
    };
  }

  // Explicit empty policy: policy present, zero required dimensions.
  const requiredDimensions = [...policy.required_dimensions].sort(
    (a, b) =>
      (DIMENSION_ORDER.get(a) ?? 0) - (DIMENSION_ORDER.get(b) ?? 0)
  );

  const required_dimension_coverage_bases = requiredDimensions.map(
    (dimension) =>
      buildCoverageBasis(
        policyAssessment.capability_requirement.key,
        dimension,
        composition
      )
  );

  return {
    capability_requirement: policyAssessment.capability_requirement,
    evaluation_dimension_policy_assessment: policyAssessment,
    required_dimension_coverage_bases,
    has_required_dimension_coverage_assessment:
      required_dimension_coverage_bases.length > 0,
  };
}

/**
 * Pure per-AttentionCandidate Required Dimension Coverage assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES
 * 4. NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED
 * 5. REQUIRED_CAPABILITY_EVALUATION_DIMENSION_COVERAGE_BASIS_PRESENT
 */
export function assessAttentionCandidateObservationCapabilityRequiredDimensionCoverage(
  compositionAssessment: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  policyAssessment: AttentionCandidateObservationCapabilityEvaluationDimensionPolicyAssessment
): AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment {
  const candidate_key = compositionAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationCapabilityRequiredDimensionCoverageCandidateStatus
  ): AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment => ({
    candidate_key,
    applicability_composition_assessment: compositionAssessment,
    evaluation_dimension_policy_assessment: policyAssessment,
    status,
    requirement_coverage_assessments: [],
    has_required_dimension_coverage_basis: false,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
    ],
  });

  // Align planning / requirement applicability from either sibling.
  if (
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    compositionAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    compositionAssessment.status ===
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

  const requirement_coverage_assessments =
    policyAssessment.requirement_policy_assessments.map((reqPolicy) =>
      assessRequirementCoverage(reqPolicy, compositionAssessment)
    );

  const hasAnyNamedRequiredDimension =
    requirement_coverage_assessments.some(
      (a) => a.required_dimension_coverage_bases.length > 0
    );

  if (!hasAnyNamedRequiredDimension) {
    // Explicit policies exist but all have required_dimensions = [].
    return {
      candidate_key,
      applicability_composition_assessment: compositionAssessment,
      evaluation_dimension_policy_assessment: policyAssessment,
      status: "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED",
      requirement_coverage_assessments,
      has_required_dimension_coverage_basis: false,
      model_limitations: [
        ...ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
      ],
    };
  }

  const has_required_dimension_coverage_basis =
    requirement_coverage_assessments.some(
      (a) => a.has_required_dimension_coverage_assessment
    );

  return {
    candidate_key,
    applicability_composition_assessment: compositionAssessment,
    evaluation_dimension_policy_assessment: policyAssessment,
    status: "REQUIRED_CAPABILITY_EVALUATION_DIMENSION_COVERAGE_BASIS_PRESENT",
    requirement_coverage_assessments,
    has_required_dimension_coverage_basis,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Required Dimension Coverage composition.
 * Preserves Candidate → Requirement → required_dimensions → basis-ref order.
 * Does not recompute 055–059 classifiers or mutate 060/061.
 */
export function buildAttentionObservationCapabilityRequiredDimensionCoverageSet(
  input: AttentionObservationCapabilityRequiredDimensionCoverageInput
): AttentionObservationCapabilityRequiredDimensionCoverageSetAssessment {
  assertCompatibleCapabilityRequiredDimensionCoverageContexts(input);

  const candidate_assessments =
    input.capability_applicability_composition_set.candidate_assessments.map(
      (compositionAssessment, index) =>
        assessAttentionCandidateObservationCapabilityRequiredDimensionCoverage(
          compositionAssessment,
          input.capability_evaluation_dimension_policy_set
            .candidate_assessments[index]
        )
    );

  return {
    capability_applicability_composition_set:
      input.capability_applicability_composition_set,
    capability_evaluation_dimension_policy_set:
      input.capability_evaluation_dimension_policy_set,
    candidate_assessments,
    has_required_dimension_coverage_basis: candidate_assessments.some(
      (c) => c.has_required_dimension_coverage_basis
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
    ],
  };
}
