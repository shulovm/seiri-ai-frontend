/**
 * Reality Core v0.7 — Attention Basis Resolution Pathway (GROUND-044).
 *
 * Pure transformation of GROUND-043 Requirement Assessment output.
 * Must not import state-engine / file-store / studio / ProjectState /
 * Situation / Resource / Impact / Decision / Inquiry / Observation runtimes.
 *
 * required-basis gap ≠ world-information requirement
 * resolution pathway classification ≠ resolution action
 * model capability pathway ≠ world observation pathway
 */

import type {
  AttentionBasisRequirementSetAssessment,
  AttentionCandidateRequirementAssessment,
  AttentionDimensionRequirementAssessment,
  AttentionRequiredBasisGap,
  AttentionRequiredBasisGapKind,
} from "./attention-basis-requirement-types.js";
import type {
  AttentionBasisResolutionModelLimitation,
  AttentionBasisResolutionSetAssessment,
  AttentionCandidateResolutionAssessment,
  AttentionDimensionResolutionAssessment,
  AttentionRequiredBasisResolutionPathway,
  AttentionRequiredBasisResolutionPathwayKind,
  AttentionRequiredBasisResolutionStatus,
} from "./attention-basis-resolution-types.js";

export const ATTENTION_BASIS_RESOLUTION_MODEL_LIMITATIONS: AttentionBasisResolutionModelLimitation[] =
  [
    "WORLD_INFORMATION_RESOLUTION_PATHWAY_NOT_MODELED",
    "SOURCE_NON_REPRESENTATION_RESOLUTION_PATHWAY_NOT_MODELED",
    "REQUIRED_BASIS_ACQUISITION_REQUIREMENT_NOT_MODELED",
    "REQUIRED_BASIS_RESOLUTION_ACTION_NOT_MODELED",
    "REQUIRED_BASIS_PATHWAY_SELECTION_NOT_MODELED",
    "MODEL_CAPABILITY_DEVELOPMENT_ACTION_NOT_MODELED",
    "MODEL_CAPABILITY_DEVELOPMENT_PRIORITY_NOT_MODELED",
    "REQUIRED_BASIS_TO_WORLD_UNKNOWN_BRIDGE_NOT_MODELED",
    "REQUIRED_BASIS_TO_INQUIRY_BRIDGE_NOT_MODELED",
    "REQUIRED_BASIS_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "OBSERVATION_DISPATCH_NOT_MODELED",
    "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED",
    "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED",
    "OBSERVATION_COST_MODEL_NOT_MODELED",
    "INFORMATION_GAIN_MODEL_NOT_MODELED",
    "VALUE_OF_INFORMATION_NOT_MODELED",
    "TEMPORAL_URGENCY_MODEL_NOT_MODELED",
    "ATTENTION_SCORING_NOT_MODELED",
    "ATTENTION_PRIORITY_NOT_MODELED",
    "ATTENTION_RANKING_NOT_MODELED",
    "ATTENTION_SELECTION_NOT_MODELED",
    "ATTENTION_ALLOCATION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function mapGapKindToResolution(
  gapKind: AttentionRequiredBasisGapKind
): {
  status: Exclude<
    AttentionRequiredBasisResolutionStatus,
    "NO_REQUIRED_BASIS_GAP"
  >;
  pathway_kind: AttentionRequiredBasisResolutionPathwayKind | null;
} {
  switch (gapKind) {
    case "SOURCE_NON_REPRESENTATION_GAP":
      return {
        status: "RESOLUTION_PATHWAY_UNDETERMINED",
        pathway_kind: null,
      };
    case "MODEL_LINKAGE_CAPABILITY_GAP":
      return {
        status: "MODEL_CAPABILITY_PATHWAY_IDENTIFIED",
        pathway_kind: "EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY",
      };
    case "MODEL_ESTIMATION_CAPABILITY_GAP":
      return {
        status: "MODEL_CAPABILITY_PATHWAY_IDENTIFIED",
        pathway_kind: "ESTIMATION_CAPABILITY",
      };
  }
}

export function attentionRequiredBasisResolutionPathwayKey(
  candidateKey: string,
  dimension: string,
  requiredBasisGapKey: string,
  status: AttentionRequiredBasisResolutionStatus,
  pathwayKind: AttentionRequiredBasisResolutionPathwayKind | null
): string {
  return [
    "attention-required-basis-resolution",
    candidateKey,
    dimension,
    requiredBasisGapKey,
    status,
    pathwayKind ?? "NONE",
  ].join("|");
}

function buildPathway(
  gap: AttentionRequiredBasisGap
): AttentionRequiredBasisResolutionPathway {
  const mapped = mapGapKindToResolution(gap.gap_kind);
  return {
    key: attentionRequiredBasisResolutionPathwayKey(
      gap.candidate_key,
      gap.dimension,
      gap.key,
      mapped.status,
      mapped.pathway_kind
    ),
    candidate_key: gap.candidate_key,
    dimension: gap.dimension,
    required_basis_gap_key: gap.key,
    status: mapped.status,
    pathway_kind: mapped.pathway_kind,
    required_basis_gap: gap,
  };
}

function assessDimensionResolution(
  dimRequirement: AttentionDimensionRequirementAssessment
): AttentionDimensionResolutionAssessment {
  const gap = dimRequirement.required_basis_gap;
  if (gap === null) {
    return {
      dimension: dimRequirement.dimension,
      requirement: dimRequirement,
      resolution_status: "NO_REQUIRED_BASIS_GAP",
      resolution_pathway: null,
    };
  }

  const pathway = buildPathway(gap);
  return {
    dimension: dimRequirement.dimension,
    requirement: dimRequirement,
    resolution_status: pathway.status,
    resolution_pathway: pathway,
  };
}

/**
 * Pure per-Candidate resolution pathway classification from GROUND-043 requirement.
 */
export function assessAttentionCandidateBasisResolution(
  requirement: AttentionCandidateRequirementAssessment
): AttentionCandidateResolutionAssessment {
  const dimensions = requirement.dimensions.map(assessDimensionResolution);

  const required_basis_resolution_pathways = dimensions
    .map((d) => d.resolution_pathway)
    .filter(
      (p): p is AttentionRequiredBasisResolutionPathway => p !== null
    );

  return {
    candidate_key: requirement.candidate_key,
    requirement,
    dimensions,
    required_basis_resolution_pathways,
    has_required_basis_gaps: requirement.has_required_basis_gaps,
    has_identified_model_capability_pathways:
      required_basis_resolution_pathways.some(
        (p) => p.status === "MODEL_CAPABILITY_PATHWAY_IDENTIFIED"
      ),
    has_undetermined_resolution_pathways:
      required_basis_resolution_pathways.some(
        (p) => p.status === "RESOLUTION_PATHWAY_UNDETERMINED"
      ),
    model_limitations: [...ATTENTION_BASIS_RESOLUTION_MODEL_LIMITATIONS],
  };
}

/**
 * Pure set-level resolution pathway classification. Preserves Candidate order.
 */
export function buildAttentionBasisResolutionSet(
  requirementSet: AttentionBasisRequirementSetAssessment
): AttentionBasisResolutionSetAssessment {
  const candidate_resolution = requirementSet.candidate_requirements.map(
    (requirement) => assessAttentionCandidateBasisResolution(requirement)
  );

  const required_basis_resolution_pathways = candidate_resolution.flatMap(
    (c) => c.required_basis_resolution_pathways
  );

  return {
    requirement_set: requirementSet,
    candidate_resolution,
    required_basis_resolution_pathways,
    has_identified_model_capability_pathways:
      required_basis_resolution_pathways.some(
        (p) => p.status === "MODEL_CAPABILITY_PATHWAY_IDENTIFIED"
      ),
    has_undetermined_resolution_pathways:
      required_basis_resolution_pathways.some(
        (p) => p.status === "RESOLUTION_PATHWAY_UNDETERMINED"
      ),
    model_limitations: [...ATTENTION_BASIS_RESOLUTION_MODEL_LIMITATIONS],
  };
}
