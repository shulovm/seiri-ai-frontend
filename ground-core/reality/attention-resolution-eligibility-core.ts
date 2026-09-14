/**
 * Reality Core v0.7 — Attention Resolution Domain Eligibility (GROUND-045).
 *
 * Pure transformation of GROUND-044 Resolution Pathway output.
 * Must not import state-engine / file-store / studio / ProjectState /
 * Situation / Resource / Impact / Decision / Inquiry / Observation runtimes.
 *
 * eligibility basis ≠ requirement / selection / action
 * no eligibility basis ≠ ineligible / impossible
 * SOURCE_NON_REPRESENTATION ≠ WORLD_INFORMATION eligibility
 * MODEL_CAPABILITY_PATHWAY_IDENTIFIED ≠ implement model now
 */

import type {
  AttentionBasisResolutionSetAssessment,
  AttentionCandidateResolutionAssessment,
  AttentionDimensionResolutionAssessment,
  AttentionRequiredBasisResolutionPathway,
} from "./attention-basis-resolution-types.js";
import type {
  AttentionCandidateResolutionEligibilityAssessment,
  AttentionDimensionResolutionEligibilityAssessment,
  AttentionResolutionDomain,
  AttentionResolutionDomainAssessment,
  AttentionResolutionDomainEligibilityBasis,
  AttentionResolutionDomainEligibilityStatus,
  AttentionResolutionEligibilityModelLimitation,
  AttentionResolutionEligibilitySetAssessment,
  AttentionResolutionEligibilityState,
} from "./attention-resolution-eligibility-types.js";

export const ATTENTION_RESOLUTION_DOMAIN_ORDER: AttentionResolutionDomain[] = [
  "WORLD_INFORMATION_RESOLUTION",
  "MODEL_CAPABILITY_RESOLUTION",
];

export const ATTENTION_RESOLUTION_ELIGIBILITY_MODEL_LIMITATIONS: AttentionResolutionEligibilityModelLimitation[] =
  [
    "WORLD_INFORMATION_ELIGIBILITY_BASIS_NOT_MODELED",
    "SOURCE_NON_REPRESENTATION_WORLD_INFORMATION_MAPPING_NOT_MODELED",
    "WORLD_INFORMATION_TARGET_IDENTIFICATION_NOT_MODELED",
    "WORLD_INFORMATION_ACQUISITION_REQUIREMENT_NOT_MODELED",
    "WORLD_INFORMATION_ACQUISITION_PATHWAY_NOT_MODELED",
    "INQUIRY_ELIGIBILITY_NOT_MODELED",
    "OBSERVATION_ELIGIBILITY_NOT_MODELED",
    "MODEL_DEVELOPMENT_ELIGIBILITY_NOT_MODELED",
    "RESOLUTION_DOMAIN_SELECTION_NOT_MODELED",
    "RESOLUTION_FEASIBILITY_NOT_MODELED",
    "RESOLUTION_COST_NOT_MODELED",
    "RESOLUTION_LATENCY_NOT_MODELED",
    "MODEL_CAPABILITY_DEVELOPMENT_ACTION_NOT_MODELED",
    "MODEL_CAPABILITY_DEVELOPMENT_PRIORITY_NOT_MODELED",
    "REQUIRED_BASIS_TO_WORLD_UNKNOWN_BRIDGE_NOT_MODELED",
    "REQUIRED_BASIS_TO_INQUIRY_BRIDGE_NOT_MODELED",
    "REQUIRED_BASIS_TO_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "ATTENTION_SCORING_NOT_MODELED",
    "ATTENTION_PRIORITY_NOT_MODELED",
    "ATTENTION_RANKING_NOT_MODELED",
    "ATTENTION_SELECTION_NOT_MODELED",
    "ATTENTION_ALLOCATION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export function attentionResolutionDomainEligibilityBasisKey(
  candidateKey: string,
  dimension: string,
  domain: AttentionResolutionDomain,
  basisKind: string,
  resolutionPathwayKey: string
): string {
  return [
    "attention-resolution-domain-eligibility-basis",
    candidateKey,
    dimension,
    domain,
    basisKind,
    resolutionPathwayKey,
  ].join("|");
}

function emptyDomainAssessment(
  domain: AttentionResolutionDomain,
  status: AttentionResolutionDomainEligibilityStatus
): AttentionResolutionDomainAssessment {
  return {
    domain,
    eligibility_status: status,
    eligibility_bases: [],
  };
}

function buildModelCapabilityEligibilityBasis(
  pathway: AttentionRequiredBasisResolutionPathway
): AttentionResolutionDomainEligibilityBasis {
  return {
    key: attentionResolutionDomainEligibilityBasisKey(
      pathway.candidate_key,
      pathway.dimension,
      "MODEL_CAPABILITY_RESOLUTION",
      "IDENTIFIED_MODEL_CAPABILITY_PATHWAY",
      pathway.key
    ),
    candidate_key: pathway.candidate_key,
    dimension: pathway.dimension,
    domain: "MODEL_CAPABILITY_RESOLUTION",
    basis_kind: "IDENTIFIED_MODEL_CAPABILITY_PATHWAY",
    resolution_pathway_key: pathway.key,
    resolution_pathway: pathway,
  };
}

function assessDomainsForDimension(
  dimResolution: AttentionDimensionResolutionAssessment
): {
  eligibility_state: AttentionResolutionEligibilityState;
  domains: AttentionResolutionDomainAssessment[];
} {
  const status = dimResolution.resolution_status;
  const pathway = dimResolution.resolution_pathway;

  if (status === "NO_REQUIRED_BASIS_GAP") {
    return {
      eligibility_state: "NO_REQUIRED_BASIS_GAP",
      domains: ATTENTION_RESOLUTION_DOMAIN_ORDER.map((domain) =>
        emptyDomainAssessment(domain, "NOT_APPLICABLE_NO_REQUIRED_BASIS_GAP")
      ),
    };
  }

  if (status === "RESOLUTION_PATHWAY_UNDETERMINED") {
    return {
      eligibility_state: "RESOLUTION_DOMAIN_ELIGIBILITY_UNDETERMINED",
      domains: ATTENTION_RESOLUTION_DOMAIN_ORDER.map((domain) =>
        emptyDomainAssessment(domain, "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED")
      ),
    };
  }

  // MODEL_CAPABILITY_PATHWAY_IDENTIFIED
  // Requires pathway_kind != null for MODEL_CAPABILITY direct eligibility.
  if (
    pathway !== null &&
    pathway.status === "MODEL_CAPABILITY_PATHWAY_IDENTIFIED" &&
    pathway.pathway_kind !== null
  ) {
    const modelBasis = buildModelCapabilityEligibilityBasis(pathway);
    return {
      eligibility_state:
        "MODEL_CAPABILITY_RESOLUTION_ELIGIBILITY_BASIS_PRESENT",
      domains: [
        emptyDomainAssessment(
          "WORLD_INFORMATION_RESOLUTION",
          "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED"
        ),
        {
          domain: "MODEL_CAPABILITY_RESOLUTION",
          eligibility_status: "DIRECT_ELIGIBILITY_BASIS_PRESENT",
          eligibility_bases: [modelBasis],
        },
      ],
    };
  }

  // Defensive: identified status without pathway_kind — treat as no direct basis
  return {
    eligibility_state: "RESOLUTION_DOMAIN_ELIGIBILITY_UNDETERMINED",
    domains: ATTENTION_RESOLUTION_DOMAIN_ORDER.map((domain) =>
      emptyDomainAssessment(domain, "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED")
    ),
  };
}

function assessDimensionEligibility(
  dimResolution: AttentionDimensionResolutionAssessment
): AttentionDimensionResolutionEligibilityAssessment {
  const { eligibility_state, domains } =
    assessDomainsForDimension(dimResolution);
  return {
    dimension: dimResolution.dimension,
    resolution: dimResolution,
    eligibility_state,
    domains,
  };
}

function domainHasDirectBasis(
  assessment: AttentionDimensionResolutionEligibilityAssessment,
  domain: AttentionResolutionDomain
): boolean {
  const d = assessment.domains.find((x) => x.domain === domain);
  return d?.eligibility_status === "DIRECT_ELIGIBILITY_BASIS_PRESENT";
}

/**
 * Pure per-Candidate resolution domain eligibility from GROUND-044 resolution.
 */
export function assessAttentionCandidateResolutionEligibility(
  resolution: AttentionCandidateResolutionAssessment
): AttentionCandidateResolutionEligibilityAssessment {
  const dimensions = resolution.dimensions.map(assessDimensionEligibility);

  const has_model_capability_resolution_eligibility_basis = dimensions.some(
    (d) => domainHasDirectBasis(d, "MODEL_CAPABILITY_RESOLUTION")
  );
  const has_world_information_resolution_eligibility_basis = dimensions.some(
    (d) => domainHasDirectBasis(d, "WORLD_INFORMATION_RESOLUTION")
  );
  const has_undetermined_resolution_domain_eligibility = dimensions.some(
    (d) => d.eligibility_state === "RESOLUTION_DOMAIN_ELIGIBILITY_UNDETERMINED"
  );

  return {
    candidate_key: resolution.candidate_key,
    resolution,
    dimensions,
    has_model_capability_resolution_eligibility_basis,
    has_world_information_resolution_eligibility_basis,
    has_undetermined_resolution_domain_eligibility,
    model_limitations: [
      ...ATTENTION_RESOLUTION_ELIGIBILITY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level resolution domain eligibility. Preserves Candidate order.
 */
export function buildAttentionResolutionEligibilitySet(
  resolutionSet: AttentionBasisResolutionSetAssessment
): AttentionResolutionEligibilitySetAssessment {
  const candidate_eligibility = resolutionSet.candidate_resolution.map(
    (resolution) => assessAttentionCandidateResolutionEligibility(resolution)
  );

  return {
    resolution_set: resolutionSet,
    candidate_eligibility,
    has_model_capability_resolution_eligibility_basis:
      candidate_eligibility.some(
        (c) => c.has_model_capability_resolution_eligibility_basis
      ),
    has_world_information_resolution_eligibility_basis:
      candidate_eligibility.some(
        (c) => c.has_world_information_resolution_eligibility_basis
      ),
    has_undetermined_resolution_domain_eligibility: candidate_eligibility.some(
      (c) => c.has_undetermined_resolution_domain_eligibility
    ),
    model_limitations: [
      ...ATTENTION_RESOLUTION_ELIGIBILITY_MODEL_LIMITATIONS,
    ],
  };
}
