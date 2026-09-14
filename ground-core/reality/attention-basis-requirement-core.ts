/**
 * Reality Core v0.7 — Attention Basis Requirement (GROUND-043).
 *
 * Pure transformation of GROUND-042 Basis Coverage output + explicit Requirement Specification.
 * Must not import state-engine / file-store / studio / ProjectState /
 * Situation / Resource / Impact / Decision / Inquiry / Observation runtimes.
 *
 * basis absence ≠ requirement
 * capability gap ≠ requirement
 * explicit requirement ≠ selection rule / readiness / world Unknown
 */

import { ATTENTION_CONSIDERATION_DIMENSION_ORDER } from "./attention-consideration-core.js";
import type {
  AttentionBasisCoverageSetAssessment,
  AttentionBasisCoverageStatus,
  AttentionCandidateBasisCoverageAssessment,
  AttentionDimensionCoverageAssessment,
} from "./attention-basis-coverage-types.js";
import type { AttentionConsiderationDimension } from "./attention-consideration-types.js";
import type {
  AttentionBasisRequirementModelLimitation,
  AttentionBasisRequirementSetAssessment,
  AttentionBasisRequirementSpecification,
  AttentionBasisRequirementStatus,
  AttentionCandidateBasisRequirement,
  AttentionCandidateRequirementAssessment,
  AttentionDimensionRequirementAssessment,
  AttentionRequiredBasisGap,
  AttentionRequiredBasisGapKind,
  AttentionRequiredBasisState,
} from "./attention-basis-requirement-types.js";

export const ATTENTION_BASIS_REQUIREMENT_MODEL_LIMITATIONS: AttentionBasisRequirementModelLimitation[] =
  [
    "ATTENTION_REQUIREMENT_PROVENANCE_NOT_MODELED",
    "ATTENTION_REQUIREMENT_AUTHORITY_NOT_MODELED",
    "ATTENTION_REQUIREMENT_POLICY_NOT_MODELED",
    "ATTENTION_REQUIREMENT_STRENGTH_NOT_MODELED",
    "ATTENTION_REQUIREMENT_NEGATION_NOT_MODELED",
    "ATTENTION_SELECTION_READINESS_NOT_MODELED",
    "ATTENTION_REQUIREMENT_SATISFACTION_GATE_NOT_MODELED",
    "REQUIRED_BASIS_ACQUISITION_PATHWAY_NOT_MODELED",
    "REQUIRED_BASIS_TO_WORLD_UNKNOWN_BRIDGE_NOT_MODELED",
    "REQUIRED_BASIS_TO_INQUIRY_BRIDGE_NOT_MODELED",
    "REQUIRED_BASIS_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED",
    "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED",
    "OBSERVATION_COST_MODEL_NOT_MODELED",
    "INFORMATION_GAIN_MODEL_NOT_MODELED",
    "VALUE_OF_INFORMATION_NOT_MODELED",
    "TEMPORAL_URGENCY_MODEL_NOT_MODELED",
    "CROSS_CANDIDATE_COMPARISON_NOT_MODELED",
    "CROSS_DIMENSION_COMPARISON_NOT_MODELED",
    "ATTENTION_SCORING_NOT_MODELED",
    "ATTENTION_PRIORITY_NOT_MODELED",
    "ATTENTION_RANKING_NOT_MODELED",
    "ATTENTION_SELECTION_NOT_MODELED",
    "ATTENTION_ALLOCATION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const VALID_DIMENSIONS: ReadonlySet<AttentionConsiderationDimension> = new Set(
  ATTENTION_CONSIDERATION_DIMENSION_ORDER
);

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueDimensions(
  dimensions: AttentionConsiderationDimension[]
): AttentionConsiderationDimension[] {
  for (const dimension of dimensions) {
    if (!VALID_DIMENSIONS.has(dimension)) {
      throw new Error(
        `Invalid AttentionConsiderationDimension: ${dimension}`
      );
    }
  }
  return [...new Set(dimensions)].sort(
    (a, b) =>
      ATTENTION_CONSIDERATION_DIMENSION_ORDER.indexOf(a) -
      ATTENTION_CONSIDERATION_DIMENSION_ORDER.indexOf(b)
  );
}

export function attentionRequiredBasisGapKey(
  candidateKey: string,
  dimension: AttentionConsiderationDimension,
  gapKind: AttentionRequiredBasisGapKind
): string {
  return [
    "attention-required-basis-gap",
    candidateKey,
    dimension,
    gapKind,
  ].join("|");
}

function getEffectiveRequiredDimensions(
  globalRequirements: AttentionConsiderationDimension[],
  candidateSpecificRequirements: AttentionConsiderationDimension[]
): AttentionConsiderationDimension[] {
  return sortUniqueDimensions([
    ...globalRequirements,
    ...candidateSpecificRequirements,
  ]);
}

function mapCoverageStatusToRequiredBasisState(
  coverageStatus: AttentionBasisCoverageStatus,
  required: boolean
): AttentionRequiredBasisState {
  if (!required) {
    return "NOT_DECLARED_REQUIRED";
  }
  switch (coverageStatus) {
    case "DIRECT_BASIS_AVAILABLE":
      return "REQUIRED_AND_DIRECT_BASIS_AVAILABLE";
    case "SOURCE_DOES_NOT_REPRESENT_DIMENSION":
      return "REQUIRED_BUT_SOURCE_DOES_NOT_REPRESENT_DIMENSION";
    case "MODEL_LINKAGE_NOT_AVAILABLE":
      return "REQUIRED_BUT_MODEL_LINKAGE_NOT_AVAILABLE";
    case "MODEL_ESTIMATION_NOT_AVAILABLE":
      return "REQUIRED_BUT_MODEL_ESTIMATION_NOT_AVAILABLE";
  }
}

function mapRequiredBasisStateToRequiredGapKind(
  state: AttentionRequiredBasisState
): AttentionRequiredBasisGapKind | null {
  switch (state) {
    case "REQUIRED_BUT_SOURCE_DOES_NOT_REPRESENT_DIMENSION":
      return "SOURCE_NON_REPRESENTATION_GAP";
    case "REQUIRED_BUT_MODEL_LINKAGE_NOT_AVAILABLE":
      return "MODEL_LINKAGE_CAPABILITY_GAP";
    case "REQUIRED_BUT_MODEL_ESTIMATION_NOT_AVAILABLE":
      return "MODEL_ESTIMATION_CAPABILITY_GAP";
    default:
      return null;
  }
}

function buildRequiredBasisGap(
  candidateKey: string,
  dimCoverage: AttentionDimensionCoverageAssessment,
  gapKind: AttentionRequiredBasisGapKind
): AttentionRequiredBasisGap {
  return {
    key: attentionRequiredBasisGapKey(
      candidateKey,
      dimCoverage.dimension,
      gapKind
    ),
    candidate_key: candidateKey,
    dimension: dimCoverage.dimension,
    gap_kind: gapKind,
    coverage_status: dimCoverage.coverage_status,
    capability_gap:
      gapKind === "SOURCE_NON_REPRESENTATION_GAP"
        ? null
        : dimCoverage.capability_gap,
  };
}

function assessDimensionRequirement(
  candidateKey: string,
  dimCoverage: AttentionDimensionCoverageAssessment,
  required: boolean
): AttentionDimensionRequirementAssessment {
  const requirement_status: AttentionBasisRequirementStatus = required
    ? "EXPLICITLY_REQUIRED"
    : "NOT_DECLARED_REQUIRED";

  const required_basis_state = mapCoverageStatusToRequiredBasisState(
    dimCoverage.coverage_status,
    required
  );

  const gapKind = mapRequiredBasisStateToRequiredGapKind(required_basis_state);
  const required_basis_gap =
    gapKind === null
      ? null
      : buildRequiredBasisGap(candidateKey, dimCoverage, gapKind);

  return {
    dimension: dimCoverage.dimension,
    requirement_status,
    coverage: dimCoverage,
    required_basis_state,
    required_basis_gap,
  };
}

/**
 * Validates and normalizes an AttentionBasisRequirementSpecification.
 * Throws if candidate_key in candidate_requirements does not exist in the coverage set.
 */
export function normalizeAttentionBasisRequirementSpecification(
  coverageSet: AttentionBasisCoverageSetAssessment,
  specification: AttentionBasisRequirementSpecification
): AttentionBasisRequirementSpecification {
  const candidateKeysInCoverage = new Set(
    coverageSet.candidate_coverage.map((cc) => cc.candidate_key)
  );

  const candidateRequirementsMap = new Map<
    string,
    AttentionConsiderationDimension[]
  >();

  for (const cr of specification.candidate_requirements) {
    if (!candidateKeysInCoverage.has(cr.candidate_key)) {
      throw new Error(
        `AttentionCandidate ${cr.candidate_key} not found in coverage set`
      );
    }
    const existingDims = candidateRequirementsMap.get(cr.candidate_key) ?? [];
    candidateRequirementsMap.set(
      cr.candidate_key,
      sortUniqueDimensions([...existingDims, ...cr.required_dimensions])
    );
  }

  const normalizedCandidateRequirements: AttentionCandidateBasisRequirement[] =
    [...candidateRequirementsMap.entries()]
      .map(([candidate_key, required_dimensions]) => ({
        candidate_key,
        required_dimensions,
      }))
      .sort((a, b) => compareIds(a.candidate_key, b.candidate_key));

  return {
    required_for_all_candidates: sortUniqueDimensions(
      specification.required_for_all_candidates
    ),
    candidate_requirements: normalizedCandidateRequirements,
  };
}

/**
 * Pure per-Candidate requirement assessment.
 * Consumes GROUND-042 coverage and explicit requirement specification.
 * Does not enrich Candidate or change coverage.
 */
export function assessAttentionCandidateRequirements(
  coverage: AttentionCandidateBasisCoverageAssessment,
  specification: AttentionBasisRequirementSpecification
): AttentionCandidateRequirementAssessment {
  const normalizedGlobal = sortUniqueDimensions(
    specification.required_for_all_candidates
  );
  const candidateSpecificRequirements =
    specification.candidate_requirements.find(
      (cr) => cr.candidate_key === coverage.candidate_key
    )?.required_dimensions ?? [];

  const effectiveRequiredDimensions = getEffectiveRequiredDimensions(
    normalizedGlobal,
    sortUniqueDimensions(candidateSpecificRequirements)
  );

  const dimensions: AttentionDimensionRequirementAssessment[] =
    coverage.dimensions.map((dimCoverage) =>
      assessDimensionRequirement(
        coverage.candidate_key,
        dimCoverage,
        effectiveRequiredDimensions.includes(dimCoverage.dimension)
      )
    );

  const required_basis_gaps = dimensions
    .map((d) => d.required_basis_gap)
    .filter((gap): gap is AttentionRequiredBasisGap => gap !== null);

  return {
    candidate_key: coverage.candidate_key,
    coverage,
    effective_required_dimensions: effectiveRequiredDimensions,
    dimensions,
    required_basis_gaps,
    has_explicit_requirements: effectiveRequiredDimensions.length > 0,
    has_required_basis_gaps: required_basis_gaps.length > 0,
    model_limitations: [...ATTENTION_BASIS_REQUIREMENT_MODEL_LIMITATIONS],
  };
}

/**
 * Pure set-level requirement assessment over GROUND-042 Basis Coverage Set.
 * Preserves Candidate order. No ranking / selection / readiness.
 */
export function buildAttentionBasisRequirementSet(
  coverageSet: AttentionBasisCoverageSetAssessment,
  specification: AttentionBasisRequirementSpecification
): AttentionBasisRequirementSetAssessment {
  const normalizedSpecification = normalizeAttentionBasisRequirementSpecification(
    coverageSet,
    specification
  );

  const candidate_requirements = coverageSet.candidate_coverage.map(
    (coverage) =>
      assessAttentionCandidateRequirements(coverage, normalizedSpecification)
  );

  const required_basis_gaps = candidate_requirements.flatMap(
    (cr) => cr.required_basis_gaps
  );

  const has_explicit_requirements =
    normalizedSpecification.required_for_all_candidates.length > 0 ||
    normalizedSpecification.candidate_requirements.length > 0;

  return {
    coverage_set: coverageSet,
    specification: normalizedSpecification,
    candidate_requirements,
    required_basis_gaps,
    has_explicit_requirements,
    has_required_basis_gaps: required_basis_gaps.length > 0,
    model_limitations: [...ATTENTION_BASIS_REQUIREMENT_MODEL_LIMITATIONS],
  };
}
