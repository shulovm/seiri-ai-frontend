import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * AUTHORITY Source Resolution Classification core (GROUND-119).
 *
 * GROUND-117 Operational Eligibility AUTHORITY Source Bridge
 * → AUTHORITY Source Resolution Classification only.
 *
 * Exact mapping:
 *   EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE → RESOLVED / null
 *   EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE → RESOLVED / null
 *   UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY
 *     → UNRESOLVED / NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY
 *   UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE
 *     → UNRESOLVED / NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE
 *
 * Independent from GROUND-084 / GROUND-118.
 * No acceptance / aggregation / OE outcome / can_execute.
 * No ProjectState / wall-clock / schema mutation.
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySource,
} from "./attention-observation-operational-eligibility-authority-source-bridge-types.js";
import type { AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue } from "./attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassificationAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceResolution,
  AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassification,
  AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationInput,
  AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationModelLimitation,
  AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSetAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationStatus,
  AttentionObservationOperationalEligibilityAuthoritySourceUnresolvedReason,
} from "./attention-observation-operational-eligibility-authority-source-resolution-classification-types.js";

type EmbeddedCanonicalAuthorityStateValue =
  AttentionObservationOperationalEligibilityAuthoritySource["canonical_authority_state_value"];

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const NONE_TOKEN = "NONE" as const;

function encodeSegment(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-source-resolution|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * authorityBindingKey|holderEntityId|authorityPower|governanceScopeKey|
 * evaluationInstantKey|authorityEvaluationAt|authoritySourceKey|
 * canonicalAuthorityStateKey|canonicalAuthorityStateBasisKey|
 * canonicalAuthorityStateValue|resolution|unresolvedReason-or-NONE
 */
export function attentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: string;
  governance_scope_key: string;
  authority_evaluation_instant_key: string;
  authority_evaluation_at: string;
  authority_source_key: string;
  canonical_authority_state_key: string;
  canonical_authority_state_basis_key: string;
  canonical_authority_state_value: EmbeddedCanonicalAuthorityStateValue;
  resolution: AttentionObservationOperationalEligibilityAuthoritySourceResolution;
  unresolved_reason: AttentionObservationOperationalEligibilityAuthoritySourceUnresolvedReason | null;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-source-resolution",
    encodeSegment(params.candidate_key),
    encodeSegment(params.observation_need_key),
    encodeSegment(params.capability_requirement_set_key),
    "AUTHORITY",
    encodeSegment(params.authority_observation_context_binding_key),
    encodeSegment(params.authority_holder_entity_id),
    encodeSegment(params.authority_power),
    encodeSegment(params.governance_scope_key),
    encodeSegment(params.authority_evaluation_instant_key),
    encodeSegment(temporalInstantKey(params.authority_evaluation_at)),
    encodeSegment(params.authority_source_key),
    encodeSegment(params.canonical_authority_state_key),
    encodeSegment(params.canonical_authority_state_basis_key),
    encodeSegment(params.canonical_authority_state_value),
    encodeSegment(params.resolution),
    encodeSegment(params.unresolved_reason ?? NONE_TOKEN),
  ].join("|");
}

/**
 * Exact GROUND-117 embedded canonical Authority State → resolution mapping.
 * Exhaustive switch only — not a configurable interpretation policy.
 */
export function classifyOperationalEligibilityAuthoritySourceResolution(
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue
): {
  resolution: AttentionObservationOperationalEligibilityAuthoritySourceResolution;
  unresolved_reason: AttentionObservationOperationalEligibilityAuthoritySourceUnresolvedReason | null;
} {
  switch (canonical_authority_state_value) {
    case "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE":
      return { resolution: "RESOLVED", unresolved_reason: null };
    case "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE":
      return { resolution: "RESOLVED", unresolved_reason: null };
    case "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY":
      return {
        resolution: "UNRESOLVED",
        unresolved_reason:
          "NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY",
      };
    case "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE":
      return {
        resolution: "UNRESOLVED",
        unresolved_reason:
          "NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
      };
    default: {
      const _exhaustive: never = canonical_authority_state_value;
      throw new Error(
        `Unexpected canonical Authority State value: ${String(_exhaustive)}`
      );
    }
  }
}

function mapSourceStatusToClassificationStatus(
  status: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment["status"]
): AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationStatus {
  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED":
      return "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED";
    case "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED":
      return "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED";
    case "AUTHORITY_SOURCES_PRESENT":
      return "AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATIONS_PRESENT";
    default: {
      const _exhaustive: never = status;
      throw new Error(
        `Unexpected AUTHORITY Source Bridge status: ${String(_exhaustive)}`
      );
    }
  }
}

function assertAuthoritySourceContext(
  source: AttentionObservationOperationalEligibilityAuthoritySource,
  expectedCandidateKey: string
): void {
  if (source.dimension !== "AUTHORITY") {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: non-AUTHORITY source dimension ${source.dimension} for candidate ${expectedCandidateKey}`
    );
  }
  if (source.candidate_key !== expectedCandidateKey) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: source candidate mismatch for ${expectedCandidateKey}`
    );
  }
  if (source.source_presence !== "SOURCE_PRESENT") {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: source ${source.key} is not SOURCE_PRESENT`
    );
  }
}

function assertNoDuplicateSourceKeys(
  sources: readonly AttentionObservationOperationalEligibilityAuthoritySource[],
  candidateKey: string
): void {
  const seen = new Set<string>();
  for (const source of sources) {
    if (seen.has(source.key)) {
      throw new Error(
        `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: duplicate AUTHORITY source key ${source.key} for candidate ${candidateKey}`
      );
    }
    seen.add(source.key);
  }
}

function assertOuterStatusConsistency(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment
): void {
  const { status, authority_sources: sources } = assessment;

  if (status === "AUTHORITY_SOURCES_PRESENT" && sources.length === 0) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source invariant violated: SOURCES_PRESENT with empty sources for candidate ${assessment.candidate_key}`
    );
  }

  if (
    status !== "AUTHORITY_SOURCES_PRESENT" &&
    sources.length !== 0
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: non-present source status requires empty sources for candidate ${assessment.candidate_key}`
    );
  }
}

function assertSourceSetContextConsistency(
  sources: readonly AttentionObservationOperationalEligibilityAuthoritySource[],
  candidateKey: string
): void {
  if (sources.length === 0) {
    return;
  }

  const first = sources[0]!;
  for (const source of sources) {
    assertAuthoritySourceContext(source, candidateKey);
    if (source.observation_need_key !== first.observation_need_key) {
      throw new Error(
        `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: ObservationNeed key mismatch for candidate ${candidateKey}`
      );
    }
    if (
      source.capability_requirement_set_key !==
      first.capability_requirement_set_key
    ) {
      throw new Error(
        `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: Requirement-set key mismatch for candidate ${candidateKey}`
      );
    }
  }
}

function classifyExactSource(
  source: AttentionObservationOperationalEligibilityAuthoritySource,
  expectedCandidateKey: string
): AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassification {
  assertAuthoritySourceContext(source, expectedCandidateKey);

  const classified = classifyOperationalEligibilityAuthoritySourceResolution(
    source.canonical_authority_state_value
  );

  return {
    key: attentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationKey(
      {
        candidate_key: source.candidate_key,
        observation_need_key: source.observation_need_key,
        capability_requirement_set_key: source.capability_requirement_set_key,
        authority_observation_context_binding_key:
          source.authority_observation_context_binding_key,
        authority_holder_entity_id: source.authority_holder_entity_id,
        authority_power: source.authority_power,
        governance_scope_key: source.governance_scope_key,
        authority_evaluation_instant_key: source.authority_evaluation_instant_key,
        authority_evaluation_at: source.authority_evaluation_at,
        authority_source_key: source.key,
        canonical_authority_state_key: source.canonical_authority_state_key,
        canonical_authority_state_basis_key:
          source.canonical_authority_state_basis_key,
        canonical_authority_state_value: source.canonical_authority_state_value,
        resolution: classified.resolution,
        unresolved_reason: classified.unresolved_reason,
      }
    ),
    candidate_key: source.candidate_key,
    observation_need_key: source.observation_need_key,
    capability_requirement_set_key: source.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key:
      source.authority_observation_context_binding_key,
    authority_holder_entity_id: source.authority_holder_entity_id,
    authority_power: source.authority_power,
    governance_scope: source.governance_scope,
    governance_scope_key: source.governance_scope_key,
    authority_evaluation_instant_key: source.authority_evaluation_instant_key,
    authority_evaluation_at: source.authority_evaluation_at,
    authority_source_key: source.key,
    canonical_authority_state_key: source.canonical_authority_state_key,
    canonical_authority_state_basis_key: source.canonical_authority_state_basis_key,
    canonical_authority_state_value: source.canonical_authority_state_value,
    resolution: classified.resolution,
    unresolved_reason: classified.unresolved_reason,
  };
}

function summarizeClassifications(
  classifications: readonly AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassification[]
): {
  has_authority_source_resolution_classifications: boolean;
  has_resolved_authority_sources: boolean;
  has_unresolved_authority_sources: boolean;
} {
  let has_resolved_authority_sources = false;
  let has_unresolved_authority_sources = false;

  for (const classification of classifications) {
    if (classification.resolution === "RESOLVED") {
      has_resolved_authority_sources = true;
    }
    if (classification.resolution === "UNRESOLVED") {
      has_unresolved_authority_sources = true;
    }
  }

  return {
    has_authority_source_resolution_classifications:
      classifications.length > 0,
    has_resolved_authority_sources,
    has_unresolved_authority_sources,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassificationAssessment
): void {
  const summary = summarizeClassifications(
    assessment.authority_source_resolution_classifications
  );

  if (
    assessment.has_authority_source_resolution_classifications !==
    summary.has_authority_source_resolution_classifications
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: has_classifications mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_resolved_authority_sources !==
    summary.has_resolved_authority_sources
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: has_resolved mismatch for candidate ${assessment.candidate_key}`
    );
  }
  if (
    assessment.has_unresolved_authority_sources !==
    summary.has_unresolved_authority_sources
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: has_unresolved mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATIONS_PRESENT" &&
    assessment.authority_source_resolution_classifications.length === 0
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: CLASSIFICATIONS_PRESENT requires non-empty classifications for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATIONS_PRESENT" &&
    assessment.authority_source_resolution_classifications.length !== 0
  ) {
    throw new Error(
      `Operational Eligibility AUTHORITY Source Resolution Classification invariant violated: non-present status requires empty classifications for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassification(
  authority_source_bridge_assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment
): AttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassificationAssessment {
  assertOuterStatusConsistency(authority_source_bridge_assessment);

  const status = mapSourceStatusToClassificationStatus(
    authority_source_bridge_assessment.status
  );

  const authority_source_resolution_classifications =
    authority_source_bridge_assessment.status === "AUTHORITY_SOURCES_PRESENT"
      ? (() => {
          assertNoDuplicateSourceKeys(
            authority_source_bridge_assessment.authority_sources,
            authority_source_bridge_assessment.candidate_key
          );
          assertSourceSetContextConsistency(
            authority_source_bridge_assessment.authority_sources,
            authority_source_bridge_assessment.candidate_key
          );
          return authority_source_bridge_assessment.authority_sources.map(
            (source) =>
              classifyExactSource(
                source,
                authority_source_bridge_assessment.candidate_key
              )
          );
        })()
      : [];

  const summary = summarizeClassifications(
    authority_source_resolution_classifications
  );

  const assessment: AttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassificationAssessment =
    {
      candidate_key: authority_source_bridge_assessment.candidate_key,
      authority_source_bridge_assessment,
      status,
      authority_source_resolution_classifications,
      ...summary,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

export function buildAttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSet(
  input: AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationInput
): AttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSetAssessment {
  const candidate_assessments =
    input.authority_source_bridge_set.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassification
    );

  return {
    authority_source_bridge_set: input.authority_source_bridge_set,
    candidate_assessments,
    has_authority_source_resolution_classifications: candidate_assessments.some(
      (a) => a.has_authority_source_resolution_classifications
    ),
    has_resolved_authority_sources: candidate_assessments.some(
      (a) => a.has_resolved_authority_sources
    ),
    has_unresolved_authority_sources: candidate_assessments.some(
      (a) => a.has_unresolved_authority_sources
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS,
    ],
  };
}
