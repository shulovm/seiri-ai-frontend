/**
 * Reality Core v0.7 — Attention Basis Coverage (GROUND-042).
 *
 * Pure transformation of GROUND-041 Consideration Basis output.
 * Must not import state-engine / file-store / studio /
 * Situation / Resource / Impact / Decision / Inquiry / Observation runtimes.
 *
 * basis absence ≠ information requirement
 * model capability gap ≠ world Unknown
 * coverage ≠ completeness / readiness
 */

import { ATTENTION_CONSIDERATION_DIMENSION_ORDER } from "./attention-consideration-core.js";
import type {
  AttentionCandidateConsiderationAssessment,
  AttentionConsiderationBasisSetAssessment,
  AttentionConsiderationDimension,
  AttentionConsiderationDimensionAssessment,
} from "./attention-consideration-types.js";
import type {
  AttentionBasisAcquisitionStatus,
  AttentionBasisCapabilityGap,
  AttentionBasisCapabilityGapKind,
  AttentionBasisCapabilityGapReason,
  AttentionBasisCoverageModelLimitation,
  AttentionBasisCoverageSetAssessment,
  AttentionBasisCoverageStatus,
  AttentionCandidateBasisCoverageAssessment,
  AttentionDimensionCoverageAssessment,
} from "./attention-basis-coverage-types.js";

export const ATTENTION_BASIS_COVERAGE_MODEL_LIMITATIONS: AttentionBasisCoverageModelLimitation[] =
  [
    "ATTENTION_DIMENSION_REQUIREMENTS_NOT_MODELED",
    "ATTENTION_BASIS_ACQUISITION_REQUIREMENTS_NOT_MODELED",
    "ATTENTION_BASIS_ACQUISITION_PATHWAYS_NOT_MODELED",
    "MODEL_CAPABILITY_GAP_TO_WORLD_UNKNOWN_BRIDGE_NOT_MODELED",
    "MODEL_CAPABILITY_GAP_TO_INQUIRY_BRIDGE_NOT_MODELED",
    "MODEL_CAPABILITY_GAP_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
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

const SOURCE_ABSENCE_DIMENSIONS: ReadonlySet<AttentionConsiderationDimension> =
  new Set([
    "STRUCTURAL_ACTIVITY",
    "SITUATION_UNRESOLVEDNESS",
    "OBSERVATION_NEED",
    "RESOURCE_STRUCTURAL_DISCOVERY",
  ]);

const LINKAGE_GAP_BY_DIMENSION: Partial<
  Record<
    AttentionConsiderationDimension,
    AttentionBasisCapabilityGapReason
  >
> = {
  IMPACT: "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED",
  REVERSIBILITY: "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED",
};

const ESTIMATION_GAP_BY_DIMENSION: Partial<
  Record<
    AttentionConsiderationDimension,
    AttentionBasisCapabilityGapReason
  >
> = {
  OBSERVATION_COST: "OBSERVATION_COST_MODEL_NOT_MODELED",
  INFORMATION_GAIN: "INFORMATION_GAIN_MODEL_NOT_MODELED",
  TEMPORAL_URGENCY: "TEMPORAL_URGENCY_MODEL_NOT_MODELED",
};

export function attentionBasisCapabilityGapKey(
  candidateKey: string,
  dimension: AttentionConsiderationDimension,
  gapKind: AttentionBasisCapabilityGapKind,
  reason: AttentionBasisCapabilityGapReason
): string {
  return [
    "attention-basis-capability-gap",
    candidateKey,
    dimension,
    gapKind,
    reason,
  ].join("|");
}

function classifyAbsentDimension(
  dimension: AttentionConsiderationDimension
): {
  coverage_status: Exclude<
    AttentionBasisCoverageStatus,
    "DIRECT_BASIS_AVAILABLE"
  >;
  gap_kind: AttentionBasisCapabilityGapKind | null;
  reason: AttentionBasisCapabilityGapReason | null;
} {
  if (SOURCE_ABSENCE_DIMENSIONS.has(dimension)) {
    return {
      coverage_status: "SOURCE_DOES_NOT_REPRESENT_DIMENSION",
      gap_kind: null,
      reason: null,
    };
  }
  const linkageReason = LINKAGE_GAP_BY_DIMENSION[dimension];
  if (linkageReason) {
    return {
      coverage_status: "MODEL_LINKAGE_NOT_AVAILABLE",
      gap_kind: "EXPLICIT_LINKAGE_CAPABILITY_GAP",
      reason: linkageReason,
    };
  }
  const estimationReason = ESTIMATION_GAP_BY_DIMENSION[dimension];
  if (estimationReason) {
    return {
      coverage_status: "MODEL_ESTIMATION_NOT_AVAILABLE",
      gap_kind: "ESTIMATION_CAPABILITY_GAP",
      reason: estimationReason,
    };
  }
  // Defensive fallback: treat unknown future dimensions as source non-representation
  return {
    coverage_status: "SOURCE_DOES_NOT_REPRESENT_DIMENSION",
    gap_kind: null,
    reason: null,
  };
}

function acquisitionFromCoverage(
  coverage: AttentionBasisCoverageStatus
): AttentionBasisAcquisitionStatus {
  switch (coverage) {
    case "DIRECT_BASIS_AVAILABLE":
      return "BASIS_ALREADY_REPRESENTED";
    case "SOURCE_DOES_NOT_REPRESENT_DIMENSION":
      return "NO_ACQUISITION_REQUIREMENT_INFERRED";
    case "MODEL_LINKAGE_NOT_AVAILABLE":
    case "MODEL_ESTIMATION_NOT_AVAILABLE":
      return "ACQUISITION_PATHWAY_NOT_MODELED";
  }
}

function assessDimensionCoverage(
  candidateKey: string,
  dimensionAssessment: AttentionConsiderationDimensionAssessment
): AttentionDimensionCoverageAssessment {
  const { dimension, status: basis_status, basis_atoms } = dimensionAssessment;

  if (basis_status === "DIRECT_BASIS_PRESENT") {
    return {
      dimension,
      basis_status,
      coverage_status: "DIRECT_BASIS_AVAILABLE",
      basis_atoms: [...basis_atoms],
      capability_gap: null,
      acquisition_status: "BASIS_ALREADY_REPRESENTED",
    };
  }

  const classified = classifyAbsentDimension(dimension);
  let capability_gap: AttentionBasisCapabilityGap | null = null;
  if (classified.gap_kind && classified.reason) {
    capability_gap = {
      key: attentionBasisCapabilityGapKey(
        candidateKey,
        dimension,
        classified.gap_kind,
        classified.reason
      ),
      candidate_key: candidateKey,
      dimension,
      gap_kind: classified.gap_kind,
      reason: classified.reason,
    };
  }

  return {
    dimension,
    basis_status,
    coverage_status: classified.coverage_status,
    basis_atoms: [...basis_atoms],
    capability_gap,
    acquisition_status: acquisitionFromCoverage(classified.coverage_status),
  };
}

/**
 * Pure per-Candidate basis coverage diagnosis from GROUND-041 consideration.
 */
export function assessAttentionCandidateBasisCoverage(
  consideration: AttentionCandidateConsiderationAssessment
): AttentionCandidateBasisCoverageAssessment {
  const byDimension = new Map(
    consideration.dimensions.map((d) => [d.dimension, d])
  );

  const dimensions: AttentionDimensionCoverageAssessment[] =
    ATTENTION_CONSIDERATION_DIMENSION_ORDER.map((dimension) => {
      const assessment = byDimension.get(dimension);
      if (!assessment) {
        // Should not happen for well-formed 041 output; treat as absent source
        return assessDimensionCoverage(consideration.candidate_key, {
          dimension,
          status: "NO_DIRECT_BASIS_REPRESENTED",
          basis_atoms: [],
        });
      }
      return assessDimensionCoverage(consideration.candidate_key, assessment);
    });

  const capability_gaps = dimensions
    .map((d) => d.capability_gap)
    .filter((gap): gap is AttentionBasisCapabilityGap => gap !== null);

  return {
    candidate_key: consideration.candidate_key,
    candidate: consideration.candidate,
    consideration,
    dimensions,
    capability_gaps,
    has_capability_gaps: capability_gaps.length > 0,
    model_limitations: [...ATTENTION_BASIS_COVERAGE_MODEL_LIMITATIONS],
  };
}

/**
 * Pure set-level coverage diagnosis. Preserves Candidate order.
 */
export function buildAttentionBasisCoverageSet(
  considerationSet: AttentionConsiderationBasisSetAssessment
): AttentionBasisCoverageSetAssessment {
  return {
    consideration_set: considerationSet,
    candidate_coverage: considerationSet.candidate_assessments.map(
      (consideration) => assessAttentionCandidateBasisCoverage(consideration)
    ),
    model_limitations: [...ATTENTION_BASIS_COVERAGE_MODEL_LIMITATIONS],
  };
}
