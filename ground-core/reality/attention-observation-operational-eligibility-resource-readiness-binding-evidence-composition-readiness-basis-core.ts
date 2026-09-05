/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * RESOURCE_READINESS Binding Evidence Composition Readiness Basis (GROUND-147).
 *
 * Pure composition of:
 *   GROUND-141 canonical per-binding RESOURCE_READINESS Evidence State Set
 *   GROUND-146 Composition Readiness Policy Set
 *
 * Answers only whether the explicit all-selected-resolved readiness-policy
 * condition currently holds over the exact selected GROUND-145 member set.
 *
 * Must not import GROUND-145 builders, GROUND-140/139/137/135/134/133/132,
 * project persistence, Permission, Authority, Reservation, Commitment,
 * Contention, Feasibility, or OE semantics.
 *
 * readiness HOLDS ≠ Composition Result HOLDS ≠ Resource Ready
 * readiness DOES_NOT_HOLD ≠ Composition Result DOES_NOT_HOLD ≠ Resource Not Ready
 * NEGATIVE is resolved; resolved ≠ positive
 * MISSING ≠ NEGATIVE ≠ unresolved-policy ≠ unresolved-mapping
 * NO_READINESS_POLICY ≠ CONDITION_DOES_NOT_HOLD
 * NOT_APPLICABLE ≠ CONDITION_DOES_NOT_HOLD
 * ANY/ALL short-circuit not modeled
 */

import {
  isResolvedAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState,
} from "./attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue,
} from "./attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessStatus,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisStatus,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyCondition,
} from "./attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisModelLimitation[] =
  [
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
    "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED",
    "BOOLEAN_SHORT_CIRCUIT_COMPOSITION_NOT_MODELED",
    "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED",
    "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED",
    "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED",
    "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Canonical per-binding RESOURCE_READINESS Evidence State set and Binding Evidence Composition Readiness Policy set do not share compatible observation Candidate context";

const NONE_TOKEN = "NONE";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Member readiness assessment identity segment.
 * Same condition with different member lineage remains distinct.
 */
export function attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessAssessmentKey(params: {
  resource_readiness_observation_context_binding_key: string;
  canonical_binding_evidence_state_key: string | null;
  canonical_binding_evidence_state_value: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue | null;
  status: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessStatus;
  has_current_canonical_binding_evidence_state: boolean;
  is_resolved_for_composition_readiness: boolean;
}): string {
  return [
    params.resource_readiness_observation_context_binding_key,
    params.canonical_binding_evidence_state_key ?? NONE_TOKEN,
    params.canonical_binding_evidence_state_value ?? NONE_TOKEN,
    params.status,
    params.has_current_canonical_binding_evidence_state ? "true" : "false",
    params.is_resolved_for_composition_readiness ? "true" : "false",
  ].join("|");
}

export function buildCanonicalResourceReadinessBindingEvidenceCompositionMemberReadinessAssessmentSetKey(
  memberAssessments: readonly AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessAssessment[]
): string {
  const keys = memberAssessments
    .map((assessment) =>
      attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessAssessmentKey(
        {
          resource_readiness_observation_context_binding_key:
            assessment.resource_readiness_observation_context_binding_key,
          canonical_binding_evidence_state_key:
            assessment.canonical_binding_evidence_state_key,
          canonical_binding_evidence_state_value:
            assessment.canonical_binding_evidence_state_value,
          status: assessment.status,
          has_current_canonical_binding_evidence_state:
            assessment.has_current_canonical_binding_evidence_state,
          is_resolved_for_composition_readiness:
            assessment.is_resolved_for_composition_readiness,
        }
      )
    )
    .sort(compareStrings);
  return keys.length > 0 ? keys.join(",") : "none";
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|compositionPolicyKey|compositionReadinessPolicyKey|
 * canonicalMemberReadinessAssessmentSetKey|readinessPolicyCondition
 */
export function attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_binding_evidence_composition_policy_key: string;
  resource_readiness_binding_evidence_composition_readiness_policy_key: string;
  member_readiness_assessments: readonly AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessAssessment[];
  readiness_policy_condition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyCondition;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_binding_evidence_composition_policy_key,
    params.resource_readiness_binding_evidence_composition_readiness_policy_key,
    buildCanonicalResourceReadinessBindingEvidenceCompositionMemberReadinessAssessmentSetKey(
      params.member_readiness_assessments
    ),
    params.readiness_policy_condition,
  ].join("|");
}

function assertNestedReadinessPolicyLineage(
  readinessPolicy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy,
  compositionPolicyAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment["binding_evidence_composition_policy_assessment"]
): void {
  const compositionPolicy = compositionPolicyAssessment.policy;
  if (compositionPolicy === null) {
    throw new Error(
      `Malformed GROUND-146 Readiness Policy lineage: readiness policy ${readinessPolicy.key} lacks nested GROUND-145 Composition Policy`
    );
  }

  if (compositionPolicy.key !== readinessPolicy.resource_readiness_binding_evidence_composition_policy_key) {
    throw new Error(
      `Malformed GROUND-146 Readiness Policy lineage: composition-policy key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }

  if (compositionPolicy.candidate_key !== readinessPolicy.candidate_key) {
    throw new Error(
      `Malformed GROUND-146 Readiness Policy lineage: candidate key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }

  if (
    compositionPolicy.observation_need_key !==
    readinessPolicy.observation_need_key
  ) {
    throw new Error(
      `Malformed GROUND-146 Readiness Policy lineage: ObservationNeed key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }

  if (
    compositionPolicy.capability_requirement_set_key !==
    readinessPolicy.capability_requirement_set_key
  ) {
    throw new Error(
      `Malformed GROUND-146 Readiness Policy lineage: Capability Requirement-set key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }

  if (
    compositionPolicy.observation_resource_requirement_key !==
    readinessPolicy.observation_resource_requirement_key
  ) {
    throw new Error(
      `Malformed GROUND-146 Readiness Policy lineage: Resource Requirement key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }

  if (compositionPolicy.composition_kind !== readinessPolicy.composition_kind) {
    throw new Error(
      `Malformed GROUND-146 Readiness Policy lineage: composition kind mismatch for readiness policy ${readinessPolicy.key}`
    );
  }

  if (
    compositionPolicy.member_binding_keys.length !==
      readinessPolicy.member_binding_keys.length ||
    compositionPolicy.member_binding_keys.some(
      (key, index) => key !== readinessPolicy.member_binding_keys[index]
    )
  ) {
    throw new Error(
      `Malformed GROUND-146 Readiness Policy lineage: member binding keys mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
}

function collectCanonicalStatesByBindingKey(
  candidateAssessment:
    | AttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment
    | undefined,
  candidateKey: string
): Map<
  string,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState
> {
  const byBindingKey = new Map<
    string,
    AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState
  >();

  if (!candidateAssessment) {
    return byBindingKey;
  }

  if (candidateAssessment.candidate_key !== candidateKey) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch (${candidateKey} vs ${candidateAssessment.candidate_key})`
    );
  }

  for (const stateAssessment of candidateAssessment.canonical_binding_state_assessments) {
    const state = stateAssessment.canonical_state;
    if (state.candidate_key !== candidateKey) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: canonical State candidate mismatch for ${candidateKey}`
      );
    }
    const bindingKey = state.resource_readiness_observation_context_binding_key;
    if (byBindingKey.has(bindingKey)) {
      throw new Error(
        `Duplicate current GROUND-141 canonical per-binding RESOURCE_READINESS Evidence State for binding ${bindingKey} on candidate ${candidateKey}`
      );
    }
    byBindingKey.set(bindingKey, state);
  }

  return byBindingKey;
}

function classifyMemberReadiness(
  bindingKey: string,
  state: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState | null
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessAssessment {
  if (state === null) {
    return {
      resource_readiness_observation_context_binding_key: bindingKey,
      canonical_binding_evidence_state: null,
      canonical_binding_evidence_state_key: null,
      canonical_binding_evidence_state_value: null,
      status: "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_MISSING",
      has_current_canonical_binding_evidence_state: false,
      is_resolved_for_composition_readiness: false,
    };
  }

  const value = state.state;
  switch (value) {
    case "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE":
    case "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE": {
      if (
        !isResolvedAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState(
          value
        )
      ) {
        throw new Error(
          `GROUND-141 resolvedness helper disagreed for value ${value}`
        );
      }
      return {
        resource_readiness_observation_context_binding_key: bindingKey,
        canonical_binding_evidence_state: state,
        canonical_binding_evidence_state_key: state.key,
        canonical_binding_evidence_state_value: value,
        status:
          "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_PRESENT_RESOLVED",
        has_current_canonical_binding_evidence_state: true,
        is_resolved_for_composition_readiness: true,
      };
    }
    case "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY":
      return {
        resource_readiness_observation_context_binding_key: bindingKey,
        canonical_binding_evidence_state: state,
        canonical_binding_evidence_state_key: state.key,
        canonical_binding_evidence_state_value: value,
        status:
          "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_PRESENT_UNRESOLVED_NO_EXPLICIT_INTERPRETATION_POLICY",
        has_current_canonical_binding_evidence_state: true,
        is_resolved_for_composition_readiness: false,
      };
    case "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE":
      return {
        resource_readiness_observation_context_binding_key: bindingKey,
        canonical_binding_evidence_state: state,
        canonical_binding_evidence_state_key: state.key,
        canonical_binding_evidence_state_value: value,
        status:
          "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_PRESENT_UNRESOLVED_NO_EXPLICIT_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
        has_current_canonical_binding_evidence_state: true,
        is_resolved_for_composition_readiness: false,
      };
    default: {
      const _exhaustive: never = value;
      void _exhaustive;
      throw new Error(
        `Unknown GROUND-141 canonical per-binding RESOURCE_READINESS Evidence State value: ${String(value)}`
      );
    }
  }
}

function assertRequirementBasisInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment
): void {
  if (
    assessment.status ===
      "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS" ||
    assessment.status ===
      "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
  ) {
    if (assessment.readiness_basis === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: condition status requires non-null basis for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      !assessment.has_resource_readiness_binding_evidence_composition_readiness_basis
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: condition status requires has_basis true for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.readiness_policy_condition === null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: condition status requires non-null condition for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.readiness_policy_condition !==
      assessment.readiness_basis.readiness_policy_condition
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: condition mismatch for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.status ===
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS" &&
      assessment.readiness_policy_condition !==
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: HOLDS status/condition mismatch for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.status ===
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" &&
      assessment.readiness_policy_condition !==
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: DOES_NOT_HOLD status/condition mismatch for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" ||
    assessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
  ) {
    if (assessment.readiness_basis !== null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: non-condition status requires null basis for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (
      assessment.has_resource_readiness_binding_evidence_composition_readiness_basis
    ) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: non-condition status requires has_basis false for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (assessment.readiness_policy_condition !== null) {
      throw new Error(
        `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: non-condition status requires null condition for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown RESOURCE_READINESS Binding Evidence Composition Readiness Basis status: ${String(assessment.status)}`
  );
}

function buildReadinessBasis(
  readinessPolicy: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicy,
  statesByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState
  >
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis {
  if (
    readinessPolicy.readiness_kind !==
    "REQUIRE_ALL_SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_RESOLVED_BEFORE_COMPOSITION"
  ) {
    throw new Error(
      `Unknown RESOURCE_READINESS Binding Evidence Composition Readiness Policy kind: ${String(readinessPolicy.readiness_kind)}`
    );
  }

  if (readinessPolicy.member_binding_keys.length === 0) {
    throw new Error(
      `RESOURCE_READINESS Binding Evidence Composition Readiness Basis invariant violated: empty selected member set for readiness policy ${readinessPolicy.key}`
    );
  }

  // Selected member order is already canonicalized by GROUND-145.
  const member_readiness_assessments =
    readinessPolicy.member_binding_keys.map((bindingKey) =>
      classifyMemberReadiness(
        bindingKey,
        statesByBindingKey.get(bindingKey) ?? null
      )
    );

  const readiness_policy_condition: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyCondition =
    member_readiness_assessments.every(
      (assessment) => assessment.is_resolved_for_composition_readiness
    )
      ? "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      : "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD";

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisKey(
      {
        candidate_key: readinessPolicy.candidate_key,
        observation_need_key: readinessPolicy.observation_need_key,
        capability_requirement_set_key:
          readinessPolicy.capability_requirement_set_key,
        observation_resource_requirement_key:
          readinessPolicy.observation_resource_requirement_key,
        resource_readiness_binding_evidence_composition_policy_key:
          readinessPolicy.resource_readiness_binding_evidence_composition_policy_key,
        resource_readiness_binding_evidence_composition_readiness_policy_key:
          readinessPolicy.key,
        member_readiness_assessments,
        readiness_policy_condition,
      }
    ),
    candidate_key: readinessPolicy.candidate_key,
    observation_need_key: readinessPolicy.observation_need_key,
    capability_requirement_set_key:
      readinessPolicy.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      readinessPolicy.observation_resource_requirement_key,
    resource_readiness_binding_evidence_composition_policy_key:
      readinessPolicy.resource_readiness_binding_evidence_composition_policy_key,
    resource_readiness_binding_evidence_composition_readiness_policy_key:
      readinessPolicy.key,
    member_binding_keys: [...readinessPolicy.member_binding_keys],
    composition_kind: readinessPolicy.composition_kind,
    readiness_kind: readinessPolicy.readiness_kind,
    member_readiness_assessments,
    readiness_policy_condition,
  };
}

function assessRequirementReadinessBasis(
  readinessPolicyAssessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyRequirementAssessment,
  statesByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState
  >
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment {
  if (
    readinessPolicyAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment =
      {
        observation_resource_requirement_key:
          readinessPolicyAssessment.observation_resource_requirement_key,
        composition_readiness_policy_assessment: readinessPolicyAssessment,
        status:
          "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY",
        readiness_basis: null,
        has_resource_readiness_binding_evidence_composition_readiness_basis:
          false,
        readiness_policy_condition: null,
      };
    assertRequirementBasisInvariant(assessment);
    return assessment;
  }

  if (
    readinessPolicyAssessment.status ===
      "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED" ||
    readinessPolicyAssessment.readiness_policy === null
  ) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment =
      {
        observation_resource_requirement_key:
          readinessPolicyAssessment.observation_resource_requirement_key,
        composition_readiness_policy_assessment: readinessPolicyAssessment,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED",
        readiness_basis: null,
        has_resource_readiness_binding_evidence_composition_readiness_basis:
          false,
        readiness_policy_condition: null,
      };
    assertRequirementBasisInvariant(assessment);
    return assessment;
  }

  assertNestedReadinessPolicyLineage(
    readinessPolicyAssessment.readiness_policy,
    readinessPolicyAssessment.binding_evidence_composition_policy_assessment
  );

  const readiness_basis = buildReadinessBasis(
    readinessPolicyAssessment.readiness_policy,
    statesByBindingKey
  );

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisRequirementAssessment =
    {
      observation_resource_requirement_key:
        readinessPolicyAssessment.observation_resource_requirement_key,
      composition_readiness_policy_assessment: readinessPolicyAssessment,
      status: readiness_basis.readiness_policy_condition,
      readiness_basis,
      has_resource_readiness_binding_evidence_composition_readiness_basis: true,
      readiness_policy_condition: readiness_basis.readiness_policy_condition,
    };
  assertRequirementBasisInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Binding Evidence Composition Readiness Basis assessment.
 * Does not evaluate ANY/ALL Composition Result.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis(
  readinessPolicyAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyAssessment,
  canonicalStateAssessment:
    | AttentionCandidateObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateAssessment
    | undefined
): AttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisAssessment {
  const candidate_key = readinessPolicyAssessment.candidate_key;

  if (
    canonicalStateAssessment &&
    canonicalStateAssessment.candidate_key !== candidate_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: candidate key mismatch (${candidate_key} vs ${canonicalStateAssessment.candidate_key})`
    );
  }

  // Validate context keys when current States exist for this Candidate.
  if (canonicalStateAssessment) {
    for (const requirementAssessment of readinessPolicyAssessment.requirement_readiness_policy_assessments) {
      const readinessPolicy = requirementAssessment.readiness_policy;
      if (!readinessPolicy) continue;
      for (const stateAssessment of canonicalStateAssessment.canonical_binding_state_assessments) {
        const state = stateAssessment.canonical_state;
        if (state.observation_need_key !== readinessPolicy.observation_need_key) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for candidate ${candidate_key}`
          );
        }
        if (
          state.capability_requirement_set_key !==
          readinessPolicy.capability_requirement_set_key
        ) {
          throw new Error(
            `${CONTEXT_MISMATCH_PREFIX}: Capability Requirement-set key mismatch for candidate ${candidate_key}`
          );
        }
      }
    }
  }

  const statesByBindingKey = collectCanonicalStatesByBindingKey(
    canonicalStateAssessment,
    candidate_key
  );

  const requirement_readiness_basis_assessments =
    readinessPolicyAssessment.requirement_readiness_policy_assessments.map(
      (requirementAssessment) =>
        assessRequirementReadinessBasis(
          requirementAssessment,
          statesByBindingKey
        )
    );

  return {
    candidate_key,
    resource_readiness_binding_evidence_composition_readiness_policy_assessment:
      readinessPolicyAssessment,
    requirement_readiness_basis_assessments,
    has_resource_readiness_binding_evidence_composition_readiness_bases:
      requirement_readiness_basis_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_readiness_basis
      ),
    has_resource_readiness_binding_evidence_composition_readiness_policy_conditions_holding:
      requirement_readiness_basis_assessments.some(
        (assessment) =>
          assessment.readiness_policy_condition ===
          "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      ),
    has_resource_readiness_binding_evidence_composition_readiness_policy_conditions_not_holding:
      requirement_readiness_basis_assessments.some(
        (assessment) =>
          assessment.readiness_policy_condition ===
          "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit RESOURCE_READINESS Binding Evidence Composition
 * Readiness Basis. Preserves GROUND-146 AttentionCandidate order.
 * Does not evaluate ANY/ALL Composition Result.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSet(
  input: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment {
  const canonicalByCandidate = new Map(
    input.canonical_per_binding_resource_readiness_evidence_state_set.candidate_assessments.map(
      (assessment) => [assessment.candidate_key, assessment]
    )
  );

  if (
    canonicalByCandidate.size !==
    input.canonical_per_binding_resource_readiness_evidence_state_set
      .candidate_assessments.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in GROUND-141 set`
    );
  }

  const readinessByCandidate = new Map(
    input.resource_readiness_binding_evidence_composition_readiness_policy_set.candidate_assessments.map(
      (assessment) => [assessment.candidate_key, assessment]
    )
  );

  if (
    readinessByCandidate.size !==
    input.resource_readiness_binding_evidence_composition_readiness_policy_set
      .candidate_assessments.length
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate candidate keys in GROUND-146 set`
    );
  }

  // Traverse GROUND-146 candidates as readiness-policy authority.
  // Missing GROUND-141 Candidate context → selected members classified MISSING.
  const candidate_assessments =
    input.resource_readiness_binding_evidence_composition_readiness_policy_set.candidate_assessments.map(
      (readinessPolicyAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis(
          readinessPolicyAssessment,
          canonicalByCandidate.get(readinessPolicyAssessment.candidate_key)
        )
    );

  return {
    canonical_per_binding_resource_readiness_evidence_state_set:
      input.canonical_per_binding_resource_readiness_evidence_state_set,
    resource_readiness_binding_evidence_composition_readiness_policy_set:
      input.resource_readiness_binding_evidence_composition_readiness_policy_set,
    candidate_assessments,
    has_resource_readiness_binding_evidence_composition_readiness_bases:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_readiness_bases
      ),
    has_resource_readiness_binding_evidence_composition_readiness_policy_conditions_holding:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_readiness_policy_conditions_holding
      ),
    has_resource_readiness_binding_evidence_composition_readiness_policy_conditions_not_holding:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_resource_readiness_binding_evidence_composition_readiness_policy_conditions_not_holding
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_MODEL_LIMITATIONS,
    ],
  };
}
