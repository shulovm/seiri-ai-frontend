import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility Permission
 * Source Resolution Classification core (GROUND-095).
 *
 * GROUND-093 Operational Eligibility PERMISSION State Source Bridge
 * → PERMISSION Source Resolution Classification only.
 *
 * Exact mapping:
 *   PERMISSION_PERMITTED → RESOLVED / null
 *   PERMISSION_PROHIBITED → RESOLVED / null
 *   UNRESOLVED_…_POLICY → UNRESOLVED / NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY
 *   UNRESOLVED_…_MAPPING → UNRESOLVED / NO_EXPLICIT_…_MAPPING_FOR_CURRENT_RAW_STATUS
 *
 * Independent from GROUND-084 / GROUND-094.
 * No acceptance / aggregation / OE outcome / can_execute.
 * No ProjectState / wall-clock / schema mutation.
 */

import type {
  AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
} from "./attention-observation-operational-eligibility-permission-state-source-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceResolutionClassificationAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceResolution,
  AttentionObservationOperationalEligibilityPermissionSourceResolutionClassification,
  AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationInput,
  AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationModelLimitation,
  AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSetAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationStatus,
  AttentionObservationOperationalEligibilityPermissionSourceUnresolvedReason,
} from "./attention-observation-operational-eligibility-permission-source-resolution-classification-types.js";

type EmbeddedPermissionState =
  AttentionObservationOperationalEligibilityPermissionStateSourceBridge["permission_state"];

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_DIMENSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

function encodeSegment(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-permission-source-resolution|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|
 * permissionContextBindingKey|permissionStateSourceKey|permissionStateBasisKey|
 * permissionEvaluationAt|permissionState|resolution|unresolvedReason-or-none
 */
export function attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  permission_context_binding_key: string;
  permission_state_source_key: string;
  permission_state_basis_key: string;
  permission_evaluation_at: string;
  permission_state: EmbeddedPermissionState;
  resolution: AttentionObservationOperationalEligibilityPermissionSourceResolution;
  unresolved_reason: AttentionObservationOperationalEligibilityPermissionSourceUnresolvedReason | null;
}): string {
  return [
    "attention-observation-operational-eligibility-permission-source-resolution",
    encodeSegment(params.candidate_key),
    encodeSegment(params.observation_need_key),
    encodeSegment(params.capability_requirement_set_key),
    encodeSegment(params.permission_context_binding_key),
    encodeSegment(params.permission_state_source_key),
    encodeSegment(params.permission_state_basis_key),
    encodeSegment(temporalInstantKey(params.permission_evaluation_at)),
    encodeSegment(params.permission_state),
    encodeSegment(params.resolution),
    encodeSegment(params.unresolved_reason ?? "none"),
  ].join("|");
}

/**
 * Exact GROUND-093 Permission State → resolution classification mapping.
 * Normalization only — not a configurable interpretation policy.
 */
export function classifyOperationalEligibilityPermissionSourceResolution(
  permission_state: EmbeddedPermissionState,
): {
  resolution: AttentionObservationOperationalEligibilityPermissionSourceResolution;
  unresolved_reason: AttentionObservationOperationalEligibilityPermissionSourceUnresolvedReason | null;
} {
  switch (permission_state) {
    case "PERMISSION_PERMITTED":
      return { resolution: "RESOLVED", unresolved_reason: null };
    case "PERMISSION_PROHIBITED":
      return { resolution: "RESOLVED", unresolved_reason: null };
    case "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY":
      return {
        resolution: "UNRESOLVED",
        unresolved_reason: "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY",
      };
    case "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS":
      return {
        resolution: "UNRESOLVED",
        unresolved_reason:
          "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
      };
    default: {
      const _exhaustive: never = permission_state;
      throw new Error(`Unexpected Permission State: ${_exhaustive}`);
    }
  }
}

function mapSourceStatusToClassificationStatus(
  status: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment["status"],
): AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationStatus {
  switch (status) {
    case "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS":
      return "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
    case "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS":
      return "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS";
    case "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED":
      return "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED";
    case "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED":
      return "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED";
    case "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT":
      return "PERMISSION_SOURCE_RESOLUTION_CLASSIFICATIONS_PRESENT";
    default: {
      const _exhaustive: never = status;
      throw new Error(`Unexpected Permission State Source status: ${_exhaustive}`);
    }
  }
}

function classifyExactSource(
  source: AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
): AttentionObservationOperationalEligibilityPermissionSourceResolutionClassification {
  const classified = classifyOperationalEligibilityPermissionSourceResolution(
    source.permission_state,
  );
  return {
    key: attentionObservationOperationalEligibilityPermissionSourceResolutionClassificationKey({
      candidate_key: source.candidate_key,
      observation_need_key: source.observation_need_key,
      capability_requirement_set_key: source.capability_requirement_set_key,
      permission_context_binding_key: source.permission_context_binding_key,
      permission_state_source_key: source.key,
      permission_state_basis_key: source.permission_state_basis_key,
      permission_evaluation_at: source.permission_evaluation_at,
      permission_state: source.permission_state,
      resolution: classified.resolution,
      unresolved_reason: classified.unresolved_reason,
    }),
    candidate_key: source.candidate_key,
    observation_need_key: source.observation_need_key,
    capability_requirement_set_key: source.capability_requirement_set_key,
    permission_context_binding_key: source.permission_context_binding_key,
    permission_state_source_key: source.key,
    permission_state_basis_key: source.permission_state_basis_key,
    permission_evaluation_at: source.permission_evaluation_at,
    dimension: "PERMISSION",
    permission_state: source.permission_state,
    resolution: classified.resolution,
    unresolved_reason: classified.unresolved_reason,
  };
}

export function assessAttentionCandidateObservationOperationalEligibilityPermissionSourceResolutionClassification(
  permission_state_source_assessment: AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
): AttentionCandidateObservationOperationalEligibilityPermissionSourceResolutionClassificationAssessment {
  const status = mapSourceStatusToClassificationStatus(
    permission_state_source_assessment.status,
  );

  const permission_source_resolution_classifications =
    permission_state_source_assessment.status ===
    "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT"
      ? permission_state_source_assessment.permission_state_sources.map(classifyExactSource)
      : [];

  const has_permission_source_resolution_classifications =
    permission_source_resolution_classifications.length > 0;
  const has_resolved_permission_sources = permission_source_resolution_classifications.some(
    (c) => c.resolution === "RESOLVED",
  );
  const has_unresolved_permission_sources = permission_source_resolution_classifications.some(
    (c) => c.resolution === "UNRESOLVED",
  );

  return {
    candidate_key: permission_state_source_assessment.candidate_key,
    permission_state_source_assessment,
    status,
    permission_source_resolution_classifications,
    has_permission_source_resolution_classifications,
    has_resolved_permission_sources,
    has_unresolved_permission_sources,
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS,
    ],
  };
}

export function buildAttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSet(
  input: AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationInput,
): AttentionObservationOperationalEligibilityPermissionSourceResolutionClassificationSetAssessment {
  const candidate_assessments =
    input.permission_state_source_set.candidate_assessments.map(
      assessAttentionCandidateObservationOperationalEligibilityPermissionSourceResolutionClassification,
    );

  return {
    permission_state_source_set: input.permission_state_source_set,
    candidate_assessments,
    has_permission_source_resolution_classifications: candidate_assessments.some(
      (a) => a.has_permission_source_resolution_classifications,
    ),
    has_resolved_permission_sources: candidate_assessments.some(
      (a) => a.has_resolved_permission_sources,
    ),
    has_unresolved_permission_sources: candidate_assessments.some(
      (a) => a.has_unresolved_permission_sources,
    ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS,
    ],
  };
}
