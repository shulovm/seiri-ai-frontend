/**
 * Reality Core v0.7 — Attention Observation Capability Source Acceptance Match
 * (GROUND-064).
 *
 * Pure composition of GROUND-062 Required Dimension Coverage
 * + GROUND-063 Explicit Dimension Acceptance Criteria.
 *
 * Must not import GROUND-050–061 runtime cores directly.
 * Dereferences canonical source values only through 062 embedded composition.
 *
 * Forbidden runtime dependencies: state-engine, file-store, studio, ProjectState,
 * GROUND-041–045, Permission, Authority, Resource, scope/temporal classifiers.
 *
 * LISTED / NOT_LISTED ≠ PASS / FAIL ≠ Dimension Outcome
 * NOT_REPRESENTED ≠ NOT_LISTED
 * criterion absent ≠ NOT_LISTED
 */

import type {
  AttentionObservationCapabilityDimensionAcceptanceCriterion,
  AttentionObservationCapabilityDimensionAcceptanceCriterionDeclaration,
  AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment,
} from "./attention-observation-capability-dimension-acceptance-criteria-types.js";
import type {
  AttentionObservationCapabilityEvaluationDimension,
} from "./attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  AttentionObservationCapabilityDeclarationApplicabilityCompositionPosition,
} from "./attention-observation-capability-applicability-composition-types.js";
import type {
  AttentionObservationCapabilityRequiredDimensionCoverageBasis,
  AttentionObservationCapabilityRequiredDimensionCoverageSetAssessment,
  AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
  AttentionObservationCapabilityRequirementRequiredDimensionCoverageAssessment,
} from "./attention-observation-capability-required-dimension-coverage-types.js";
import type {
  AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment,
} from "./attention-observation-capability-required-dimension-coverage-types.js";
import type {
  AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment,
} from "./attention-observation-capability-dimension-acceptance-criteria-types.js";
import type {
  AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment,
} from "./attention-observation-capability-dimension-acceptance-criteria-types.js";
import type {
  AttentionObservationCapabilitySourceAcceptanceMatchInput,
  AttentionObservationCapabilitySourceAcceptanceMatchModelLimitation,
  AttentionObservationCapabilitySourceAcceptanceMatchSetAssessment,
  AttentionObservationCapabilitySourceAcceptanceRelation,
  AttentionObservationCapabilityRepresentedDimensionSourceValue,
  AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment,
  AttentionObservationCapabilityRequiredDimensionSourceAcceptanceStatus,
  AttentionObservationCapabilityRequirementSourceAcceptanceAssessment,
  AttentionObservationCapabilitySourceAcceptanceMatchBasis,
  AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment,
  AttentionObservationCapabilitySourceAcceptanceMatchCandidateStatus,
} from "./attention-observation-capability-source-acceptance-match-types.js";

export const ATTENTION_OBSERVATION_CAPABILITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS: AttentionObservationCapabilitySourceAcceptanceMatchModelLimitation[] =
  [
    "CAPABILITY_SOURCE_ACCEPTANCE_OUTCOME_NOT_MODELED",
    "CAPABILITY_DIMENSION_OUTCOME_NOT_MODELED",
    "CAPABILITY_DIMENSION_MULTI_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "CAPABILITY_DIMENSION_MULTI_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "CAPABILITY_MISSING_DIMENSION_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "CAPABILITY_MISSING_CRITERION_SEMANTICS_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_SATISFACTION_NOT_MODELED",
    "CAPABILITY_REQUIREMENT_AGGREGATION_POLICY_NOT_MODELED",
    "CAPABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_VERIFICATION_EFFECTIVE_TRUTH_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE_NOT_MODELED",
    "CAPABILITY_AVAILABILITY_CONFLICT_RESOLUTION_NOT_MODELED",
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

export function attentionObservationCapabilitySourceAcceptanceMatchKey(
  capabilityRequirementKey: string,
  dimension: AttentionObservationCapabilityEvaluationDimension,
  acceptanceCriterionKey: string,
  canonicalRepresentedBasisRefKey: string
): string {
  return [
    "attention-observation-capability-source-acceptance-match",
    capabilityRequirementKey,
    dimension,
    acceptanceCriterionKey,
    canonicalRepresentedBasisRefKey,
  ].join("|");
}

export function attentionObservationCapabilityCanonicalRepresentedBasisRefKey(
  ref: AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef
): string {
  switch (ref.kind) {
    case "STRUCTURAL_CAPABILITY_DECLARATION_MATCH":
      return [
        "STRUCTURAL",
        ref.observer_candidate_key,
        ref.capability_declaration_id,
        ref.capability_declaration_match_key,
      ].join("|");
    case "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT":
      return ["EXPLICIT_SCOPE", ref.capability_scope_requirement_key].join("|");
    case "CAPABILITY_SCOPE_APPLICABILITY":
      return [
        "SCOPE_APPLICABILITY",
        ref.observer_candidate_key,
        ref.capability_declaration_id,
        ref.scope_applicability_position_key,
      ].join("|");
    case "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT":
      return [
        "EXPLICIT_TEMPORAL",
        ref.capability_temporal_requirement_key,
      ].join("|");
    case "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY":
      return [
        "DECL_TEMPORAL",
        ref.observer_candidate_key,
        ref.capability_declaration_id,
        ref.declaration_temporal_position_key,
      ].join("|");
    case "CAPABILITY_VERIFICATION_REPRESENTATION":
      return [
        "VERIFICATION",
        ref.observer_candidate_key,
        ref.capability_declaration_id,
        ref.capability_verification_declaration_id,
      ].join("|");
    case "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY":
      return [
        "VERIFICATION_TEMPORAL",
        ref.observer_candidate_key,
        ref.capability_declaration_id,
        ref.capability_verification_declaration_id,
        ref.verification_temporal_position_key,
      ].join("|");
    case "CAPABILITY_AVAILABILITY_REPRESENTATION":
      return [
        "AVAILABILITY",
        ref.observer_candidate_key,
        ref.capability_declaration_id,
        ref.capability_availability_declaration_id,
      ].join("|");
    case "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY":
      return [
        "AVAILABILITY_TEMPORAL",
        ref.observer_candidate_key,
        ref.capability_declaration_id,
        ref.capability_availability_declaration_id,
        ref.availability_temporal_position_key,
      ].join("|");
  }
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

function assertExactResolution(
  matches: unknown[],
  context: string
): void {
  if (matches.length === 0) {
    throw new Error(
      `Represented basis ref could not be resolved in embedded composition: ${context}`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `Represented basis ref resolved ambiguously in embedded composition: ${context}`
    );
  }
}

function dereferenceSourceValue(
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  capabilityRequirementKey: string,
  ref: AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef
): AttentionObservationCapabilityRepresentedDimensionSourceValue {
  const declarations = collectDeclarationPositionsForRequirement(
    composition,
    capabilityRequirementKey
  );

  switch (ref.kind) {
    case "STRUCTURAL_CAPABILITY_DECLARATION_MATCH": {
      const matches = declarations.filter(
        (d) =>
          d.observer_candidate_key === ref.observer_candidate_key &&
          d.capability_declaration_match.key ===
            ref.capability_declaration_match_key &&
          d.capability_declaration_match.capability_declaration_id ===
            ref.capability_declaration_id
      );
      assertExactResolution(
        matches,
        attentionObservationCapabilityCanonicalRepresentedBasisRefKey(ref)
      );
      return {
        dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
        value_kind: "REPRESENTED_BASIS",
      };
    }

    case "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT":
      return {
        dimension: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
        value_kind: "REPRESENTED_BASIS",
      };

    case "CAPABILITY_SCOPE_APPLICABILITY": {
      const matches = declarations.filter((d) => {
        if (
          d.observer_candidate_key !== ref.observer_candidate_key ||
          d.capability_declaration_match.capability_declaration_id !==
            ref.capability_declaration_id
        ) {
          return false;
        }
        const pos = d.scope_dimension.scope_applicability_position;
        return (
          pos !== null &&
          pos.key === ref.scope_applicability_position_key
        );
      });
      assertExactResolution(
        matches,
        attentionObservationCapabilityCanonicalRepresentedBasisRefKey(ref)
      );
      const scopePos =
        matches[0].scope_dimension.scope_applicability_position!;
      return {
        dimension: "CAPABILITY_SCOPE_APPLICABILITY",
        value_kind: "SCOPE_APPLICABILITY_POSITION_STATUS",
        position_status: scopePos.status,
      };
    }

    case "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT":
      return {
        dimension: "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
        value_kind: "REPRESENTED_BASIS",
      };

    case "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY": {
      const matches = declarations.filter((d) => {
        if (
          d.observer_candidate_key !== ref.observer_candidate_key ||
          d.capability_declaration_match.capability_declaration_id !==
            ref.capability_declaration_id
        ) {
          return false;
        }
        const pos =
          d.declaration_temporal_dimension
            .declaration_temporal_applicability_position;
        return (
          pos !== null &&
          pos.key === ref.declaration_temporal_position_key
        );
      });
      assertExactResolution(
        matches,
        attentionObservationCapabilityCanonicalRepresentedBasisRefKey(ref)
      );
      const temporalPos =
        matches[0].declaration_temporal_dimension
          .declaration_temporal_applicability_position!;
      return {
        dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
        value_kind: "DECLARATION_TEMPORAL_RELATION",
        relation: temporalPos.relation,
      };
    }

    case "CAPABILITY_VERIFICATION_REPRESENTATION": {
      const matches = declarations.filter((d) => {
        if (
          d.observer_candidate_key !== ref.observer_candidate_key ||
          d.capability_declaration_match.capability_declaration_id !==
            ref.capability_declaration_id
        ) {
          return false;
        }
        return d.verification_temporal_dimension.capability_declaration_verification_position.verification_links.some(
          (link) =>
            link.capability_verification_declaration_id ===
            ref.capability_verification_declaration_id
        );
      });
      assertExactResolution(
        matches,
        attentionObservationCapabilityCanonicalRepresentedBasisRefKey(ref)
      );
      return {
        dimension: "CAPABILITY_VERIFICATION_REPRESENTATION",
        value_kind: "REPRESENTED_BASIS",
      };
    }

    case "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY": {
      const matches = declarations.filter((d) => {
        if (
          d.observer_candidate_key !== ref.observer_candidate_key ||
          d.capability_declaration_match.capability_declaration_id !==
            ref.capability_declaration_id
        ) {
          return false;
        }
        return d.verification_temporal_dimension.verification_temporal_positions.some(
          (pos) =>
            pos.key === ref.verification_temporal_position_key &&
            pos.capability_verification_link
              .capability_verification_declaration_id ===
              ref.capability_verification_declaration_id
        );
      });
      assertExactResolution(
        matches,
        attentionObservationCapabilityCanonicalRepresentedBasisRefKey(ref)
      );
      const decl = matches[0];
      const verificationPos =
        decl.verification_temporal_dimension.verification_temporal_positions.find(
          (pos) => pos.key === ref.verification_temporal_position_key
        )!;
      return {
        dimension: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
        value_kind: "VERIFICATION_TEMPORAL_RELATION",
        relation: verificationPos.relation,
      };
    }

    case "CAPABILITY_AVAILABILITY_REPRESENTATION": {
      const matches = declarations.filter((d) => {
        if (
          d.observer_candidate_key !== ref.observer_candidate_key ||
          d.capability_declaration_match.capability_declaration_id !==
            ref.capability_declaration_id
        ) {
          return false;
        }
        return d.availability_temporal_dimension.capability_declaration_availability_position.availability_links.some(
          (link) =>
            link.capability_availability_declaration_id ===
            ref.capability_availability_declaration_id
        );
      });
      assertExactResolution(
        matches,
        attentionObservationCapabilityCanonicalRepresentedBasisRefKey(ref)
      );
      const decl = matches[0];
      const link =
        decl.availability_temporal_dimension
          .capability_declaration_availability_position.availability_links.find(
            (l) =>
              l.capability_availability_declaration_id ===
              ref.capability_availability_declaration_id
          )!;
      return {
        dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
        value_kind: "AVAILABILITY_RAW_STATUS",
        raw_availability_status:
          link.capability_availability_declaration.status,
      };
    }

    case "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY": {
      const matches = declarations.filter((d) => {
        if (
          d.observer_candidate_key !== ref.observer_candidate_key ||
          d.capability_declaration_match.capability_declaration_id !==
            ref.capability_declaration_id
        ) {
          return false;
        }
        return d.availability_temporal_dimension.availability_temporal_positions.some(
          (pos) =>
            pos.key === ref.availability_temporal_position_key &&
            pos.capability_availability_link
              .capability_availability_declaration_id ===
              ref.capability_availability_declaration_id
        );
      });
      assertExactResolution(
        matches,
        attentionObservationCapabilityCanonicalRepresentedBasisRefKey(ref)
      );
      const decl = matches[0];
      const availabilityPos =
        decl.availability_temporal_dimension.availability_temporal_positions.find(
          (pos) => pos.key === ref.availability_temporal_position_key
        )!;
      return {
        dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
        value_kind: "AVAILABILITY_TEMPORAL_PAIR",
        relation: availabilityPos.relation,
        raw_availability_status:
          availabilityPos.applicability_basis.raw_availability_status,
      };
    }
  }
}

function assertCoverageBasisInvariant(
  basis: AttentionObservationCapabilityRequiredDimensionCoverageBasis
): void {
  if (
    basis.status === "REQUIRED_DIMENSION_EVALUATION_BASIS_REPRESENTED" &&
    basis.represented_basis_refs.length < 1
  ) {
    throw new Error(
      `Required dimension coverage invariant violated: REPRESENTED requires at least one represented basis ref for ${basis.key}`
    );
  }
  if (
    basis.status === "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED" &&
    basis.represented_basis_refs.length !== 0
  ) {
    throw new Error(
      `Required dimension coverage invariant violated: NOT_REPRESENTED requires empty represented basis refs for ${basis.key}`
    );
  }
}

function assertCriterionAssessmentInvariant(
  assessment: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT" &&
    assessment.acceptance_criterion === null
  ) {
    throw new Error(
      `Acceptance criterion invariant violated: PRESENT requires non-null criterion for dimension ${assessment.required_dimension}`
    );
  }
  if (
    assessment.status ===
      "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_DECLARED" &&
    assessment.acceptance_criterion !== null
  ) {
    throw new Error(
      `Acceptance criterion invariant violated: absent requires null criterion for dimension ${assessment.required_dimension}`
    );
  }
}

function isSourceValueListed(
  sourceValue: AttentionObservationCapabilityRepresentedDimensionSourceValue,
  criterion: AttentionObservationCapabilityDimensionAcceptanceCriterion
): boolean {
  if (sourceValue.dimension !== criterion.dimension) {
    throw new Error(
      `Acceptance criterion dimension ${criterion.dimension} does not match source value dimension ${sourceValue.dimension}`
    );
  }

  switch (sourceValue.dimension) {
    case "STRUCTURAL_CAPABILITY_DECLARATION_MATCH":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH" }
        >
      ).criterion_kind === "ANY_REPRESENTED_BASIS_ACCEPTABLE";

    case "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT" }
        >
      ).criterion_kind === "ANY_REPRESENTED_BASIS_ACCEPTABLE";

    case "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT" }
        >
      ).criterion_kind === "ANY_REPRESENTED_BASIS_ACCEPTABLE";

    case "CAPABILITY_VERIFICATION_REPRESENTATION":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "CAPABILITY_VERIFICATION_REPRESENTATION" }
        >
      ).criterion_kind === "ANY_REPRESENTED_BASIS_ACCEPTABLE";

    case "CAPABILITY_SCOPE_APPLICABILITY":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "CAPABILITY_SCOPE_APPLICABILITY" }
        >
      ).accepted_position_statuses.includes(sourceValue.position_status);

    case "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY" }
        >
      ).accepted_relations.includes(sourceValue.relation);

    case "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY" }
        >
      ).accepted_relations.includes(sourceValue.relation);

    case "CAPABILITY_AVAILABILITY_REPRESENTATION":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION" }
        >
      ).accepted_raw_statuses.includes(sourceValue.raw_availability_status);

    case "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY":
      return (
        criterion as Extract<
          AttentionObservationCapabilityDimensionAcceptanceCriterion,
          { dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY" }
        >
      ).accepted_pairs.some(
        (pair) =>
          pair.relation === sourceValue.relation &&
          pair.raw_availability_status === sourceValue.raw_availability_status
      );
  }
}

function buildSourceAcceptanceMatchBasis(
  coverageBasis: AttentionObservationCapabilityRequiredDimensionCoverageBasis,
  observationNeedKey: string,
  ref: AttentionObservationCapabilityRequiredDimensionRepresentedBasisRef,
  sourceValue: AttentionObservationCapabilityRepresentedDimensionSourceValue,
  criterionDeclaration: AttentionObservationCapabilityDimensionAcceptanceCriterionDeclaration
): AttentionObservationCapabilitySourceAcceptanceMatchBasis {
  const canonicalRefKey =
    attentionObservationCapabilityCanonicalRepresentedBasisRefKey(ref);
  const listed = isSourceValueListed(
    sourceValue,
    criterionDeclaration.criterion
  );
  return {
    key: attentionObservationCapabilitySourceAcceptanceMatchKey(
      coverageBasis.capability_requirement_key,
      coverageBasis.required_dimension,
      criterionDeclaration.key,
      canonicalRefKey
    ),
    capability_requirement_key: coverageBasis.capability_requirement_key,
    observation_need_key: observationNeedKey,
    required_dimension: coverageBasis.required_dimension,
    coverage_basis_key: coverageBasis.key,
    acceptance_criterion_key: criterionDeclaration.key,
    represented_basis_ref: ref,
    represented_source_value: sourceValue,
    relation: listed
      ? "REPRESENTED_SOURCE_VALUE_LISTED_AS_ACCEPTABLE"
      : "REPRESENTED_SOURCE_VALUE_NOT_LISTED_AS_ACCEPTABLE",
  };
}

function assessRequiredDimensionSourceAcceptance(
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  observationNeedKey: string,
  coverageBasis: AttentionObservationCapabilityRequiredDimensionCoverageBasis,
  criterionAssessment: AttentionObservationCapabilityRequiredDimensionAcceptanceCriterionAssessment
): AttentionObservationCapabilityRequiredDimensionSourceAcceptanceAssessment {
  assertCoverageBasisInvariant(coverageBasis);
  assertCriterionAssessmentInvariant(criterionAssessment);

  if (
    coverageBasis.status ===
    "REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED"
  ) {
    return {
      required_dimension: coverageBasis.required_dimension,
      required_dimension_coverage_basis: coverageBasis,
      acceptance_criterion_assessment: criterionAssessment,
      status:
        "NOT_APPLICABLE_REQUIRED_DIMENSION_EVALUATION_BASIS_NOT_REPRESENTED",
      source_acceptance_match_bases: [],
    };
  }

  if (
    criterionAssessment.status ===
    "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_DECLARED"
  ) {
    return {
      required_dimension: coverageBasis.required_dimension,
      required_dimension_coverage_basis: coverageBasis,
      acceptance_criterion_assessment: criterionAssessment,
      status:
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION",
      source_acceptance_match_bases: [],
    };
  }

  const criterionDeclaration = criterionAssessment.acceptance_criterion!;
  const source_acceptance_match_bases =
    coverageBasis.represented_basis_refs.map((ref) => {
      const sourceValue = dereferenceSourceValue(
        composition,
        coverageBasis.capability_requirement_key,
        ref
      );
      return buildSourceAcceptanceMatchBasis(
        coverageBasis,
        observationNeedKey,
        ref,
        sourceValue,
        criterionDeclaration
      );
    });

  return {
    required_dimension: coverageBasis.required_dimension,
    required_dimension_coverage_basis: coverageBasis,
    acceptance_criterion_assessment: criterionAssessment,
    status: "CAPABILITY_SOURCE_ACCEPTANCE_MATCH_BASIS_PRESENT",
    source_acceptance_match_bases,
  };
}

function assessRequirementSourceAcceptance(
  composition: AttentionCandidateObservationCapabilityApplicabilityCompositionAssessment,
  coverageAssessment: AttentionObservationCapabilityRequirementRequiredDimensionCoverageAssessment,
  criteriaAssessment: AttentionObservationCapabilityRequirementAcceptanceCriteriaAssessment
): AttentionObservationCapabilityRequirementSourceAcceptanceAssessment {
  const coverageByDimension = new Map(
    coverageAssessment.required_dimension_coverage_bases.map((b) => [
      b.required_dimension,
      b,
    ])
  );
  const criteriaByDimension = new Map(
    criteriaAssessment.required_dimension_criterion_assessments.map((a) => [
      a.required_dimension,
      a,
    ])
  );

  const dimensions = coverageAssessment.required_dimension_coverage_bases.map(
    (b) => b.required_dimension
  );

  for (const dimension of dimensions) {
    const coverageBasis = coverageByDimension.get(dimension);
    const criterionAssessment = criteriaByDimension.get(dimension);
    if (!coverageBasis || !criterionAssessment) {
      throw new Error(
        `Required dimension set mismatch for capability requirement ${coverageAssessment.capability_requirement.key}: missing ${dimension} in coverage or acceptance criteria assessment`
      );
    }
  }

  const observationNeedKey =
    coverageAssessment.capability_requirement.observation_need_key;

  const required_dimension_source_acceptance_assessments = dimensions.map(
    (dimension) =>
      assessRequiredDimensionSourceAcceptance(
        composition,
        observationNeedKey,
        coverageByDimension.get(dimension)!,
        criteriaByDimension.get(dimension)!
      )
  );

  const has_capability_source_acceptance_match_basis =
    required_dimension_source_acceptance_assessments.some(
      (a) => a.source_acceptance_match_bases.length > 0
    );

  return {
    capability_requirement: coverageAssessment.capability_requirement,
    required_dimension_coverage_assessment: coverageAssessment,
    acceptance_criteria_assessment: criteriaAssessment,
    required_dimension_source_acceptance_assessments,
    has_capability_source_acceptance_match_basis,
  };
}

function resolveCandidateSourceAcceptanceStatus(
  coverageAssessment: AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment,
  criteriaAssessment: AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment,
  hasMatchBasis: boolean
): AttentionObservationCapabilitySourceAcceptanceMatchCandidateStatus {
  if (
    coverageAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
  }
  if (
    coverageAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
  }
  if (
    coverageAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES"
  ) {
    return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES";
  }
  if (
    coverageAssessment.status ===
    "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
  ) {
    return "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED";
  }
  if (!hasMatchBasis) {
    return "NO_CAPABILITY_SOURCE_ACCEPTANCE_MATCH_BASIS_REPRESENTED";
  }
  return "CAPABILITY_SOURCE_ACCEPTANCE_MATCH_BASIS_PRESENT";
}

export function assertCompatibleCapabilitySourceAcceptanceMatchContexts(
  coverageSet: AttentionObservationCapabilityRequiredDimensionCoverageSetAssessment,
  criteriaSet: AttentionObservationCapabilityDimensionAcceptanceCriteriaSetAssessment
): void {
  const coveragePolicySet =
    coverageSet.capability_evaluation_dimension_policy_set;
  const criteriaPolicySet =
    criteriaSet.capability_evaluation_dimension_policy_set;

  if (
    coveragePolicySet !== criteriaPolicySet &&
    JSON.stringify(coveragePolicySet) !== JSON.stringify(criteriaPolicySet)
  ) {
    throw new Error(
      "Required Dimension Coverage set and Capability Dimension Acceptance Criteria set do not share the same Capability Requirement policy context"
    );
  }

  const coverageCandidates = coverageSet.candidate_assessments;
  const criteriaCandidates = criteriaSet.candidate_assessments;

  if (coverageCandidates.length !== criteriaCandidates.length) {
    throw new Error(
      "Required Dimension Coverage set and Capability Dimension Acceptance Criteria set do not share the same Capability Requirement policy context: candidate count mismatch"
    );
  }

  const criteriaByKey = new Map(
    criteriaCandidates.map((c) => [c.candidate_key, c])
  );

  for (const coverageCandidate of coverageCandidates) {
    const criteriaCandidate = criteriaByKey.get(coverageCandidate.candidate_key);
    if (!criteriaCandidate) {
      throw new Error(
        `Required Dimension Coverage set and Capability Dimension Acceptance Criteria set do not share the same Capability Requirement policy context: missing candidate ${coverageCandidate.candidate_key}`
      );
    }

    const coverageRequirements =
      coverageCandidate.requirement_coverage_assessments;
    const criteriaRequirements =
      criteriaCandidate.requirement_acceptance_criteria_assessments;

    if (coverageRequirements.length !== criteriaRequirements.length) {
      throw new Error(
        `Required Dimension Coverage set and Capability Dimension Acceptance Criteria set do not share the same Capability Requirement policy context for candidate ${coverageCandidate.candidate_key}: requirement count mismatch`
      );
    }

    const criteriaReqByKey = new Map(
      criteriaRequirements.map((r) => [r.capability_requirement.key, r])
    );

    for (const coverageReq of coverageRequirements) {
      const reqKey = coverageReq.capability_requirement.key;
      const criteriaReq = criteriaReqByKey.get(reqKey);
      if (!criteriaReq) {
        throw new Error(
          `Required Dimension Coverage set and Capability Dimension Acceptance Criteria set do not share the same Capability Requirement policy context for candidate ${coverageCandidate.candidate_key}: missing requirement ${reqKey}`
        );
      }

      const coverageDims = new Set(
        coverageReq.required_dimension_coverage_bases.map(
          (b) => b.required_dimension
        )
      );
      const criteriaDims = new Set(
        criteriaReq.required_dimension_criterion_assessments.map(
          (a) => a.required_dimension
        )
      );

      if (
        coverageDims.size !== criteriaDims.size ||
        [...coverageDims].some((d) => !criteriaDims.has(d))
      ) {
        throw new Error(
          `Required dimension set mismatch for capability requirement ${reqKey} in candidate ${coverageCandidate.candidate_key}`
        );
      }
    }
  }
}

export function assessAttentionCandidateObservationCapabilitySourceAcceptanceMatch(
  coverageAssessment: AttentionCandidateObservationCapabilityRequiredDimensionCoverageAssessment,
  criteriaAssessment: AttentionCandidateObservationCapabilityDimensionAcceptanceCriteriaAssessment
): AttentionCandidateObservationCapabilitySourceAcceptanceMatchAssessment {
  const composition =
    coverageAssessment.applicability_composition_assessment;

  const criteriaByReqKey = new Map(
    criteriaAssessment.requirement_acceptance_criteria_assessments.map((r) => [
      r.capability_requirement.key,
      r,
    ])
  );

  const requirement_source_acceptance_assessments =
    coverageAssessment.requirement_coverage_assessments.map((coverageReq) => {
      const criteriaReq = criteriaByReqKey.get(
        coverageReq.capability_requirement.key
      );
      if (!criteriaReq) {
        throw new Error(
          `Required dimension set mismatch for capability requirement ${coverageReq.capability_requirement.key}`
        );
      }
      return assessRequirementSourceAcceptance(
        composition,
        coverageReq,
        criteriaReq
      );
    });

  const has_capability_source_acceptance_match_basis =
    requirement_source_acceptance_assessments.some(
      (r) => r.has_capability_source_acceptance_match_basis
    );

  return {
    candidate_key: coverageAssessment.candidate_key,
    required_dimension_coverage_assessment: coverageAssessment,
    acceptance_criteria_assessment: criteriaAssessment,
    status: resolveCandidateSourceAcceptanceStatus(
      coverageAssessment,
      criteriaAssessment,
      has_capability_source_acceptance_match_basis
    ),
    requirement_source_acceptance_assessments,
    has_capability_source_acceptance_match_basis,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
    ],
  };
}

export function buildAttentionObservationCapabilitySourceAcceptanceMatchSet(
  input: AttentionObservationCapabilitySourceAcceptanceMatchInput
): AttentionObservationCapabilitySourceAcceptanceMatchSetAssessment {
  const coverageSet = input.required_dimension_coverage_set;
  const criteriaSet = input.dimension_acceptance_criteria_set;

  assertCompatibleCapabilitySourceAcceptanceMatchContexts(
    coverageSet,
    criteriaSet
  );

  const criteriaByCandidateKey = new Map(
    criteriaSet.candidate_assessments.map((c) => [c.candidate_key, c])
  );

  const candidate_assessments = coverageSet.candidate_assessments.map(
    (coverageCandidate) => {
      const criteriaCandidate = criteriaByCandidateKey.get(
        coverageCandidate.candidate_key
      )!;
      return assessAttentionCandidateObservationCapabilitySourceAcceptanceMatch(
        coverageCandidate,
        criteriaCandidate
      );
    }
  );

  const has_capability_source_acceptance_match_basis =
    candidate_assessments.some(
      (c) => c.has_capability_source_acceptance_match_basis
    );

  return {
    required_dimension_coverage_set: coverageSet,
    dimension_acceptance_criteria_set: criteriaSet,
    candidate_assessments,
    has_capability_source_acceptance_match_basis,
    model_limitations: [
      ...ATTENTION_OBSERVATION_CAPABILITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
    ],
  };
}
