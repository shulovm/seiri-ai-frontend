/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Explicit Declared Potential Contribution Capacity-Relation
 * Interpretation Policy (GROUND-159).
 *
 * Pure composition of stable GROUND-155 Binding context
 * + explicit capacity-axis Interpretation Policy Specification.
 *
 * Policy declaration only. Does NOT consume current GROUND-157
 * Raw Relation Basis values. GROUND-157 relation enum is type-only
 * source vocabulary.
 *
 * No persistence layer access or mutation. No GROUND-141 / GROUND-151
 * builders. No Reservation, availability, contribution verification,
 * or OE readiness semantics.
 *
 * SUPPORTS / CONTRADICTS ≠ physical truth / availability / free /
 * effective / verified / Resource Ready
 * policy absence ≠ explicit empty policy
 * unusual mappings are valid; partial policy is valid
 * required_amount axis interpretation NOT MODELED
 * capacity-source aggregation NOT MODELED
 */

import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment,
} from "./attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicy,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyEvalInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyInput,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification,
} from "./attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyModelLimitation[] =
  [
    "CURRENT_CAPACITY_RELATION_INTERPRETATION_NOT_APPLIED",
    "PER_SOURCE_CAPACITY_RELATION_INTERPRETATION_BASIS_NOT_MODELED",
    "PER_SOURCE_CAPACITY_RELATION_CANONICAL_STATE_NOT_MODELED",
    "CAPACITY_SOURCE_MEMBER_SET_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
    "CAPACITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_CONTRIBUTION_EVIDENCE_COMPOSITION_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_STOCK_VS_FLOW_SEMANTICS_NOT_MODELED",
    "RESOURCE_CAPACITY_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "RESOURCE_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_FULLY_MODELED",
    "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "CROSS_BINDING_QUANTITY_COMPOSITION_NOT_MODELED",
    "PHYSICAL_RESOURCE_COMPOSITION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export const EMPTY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_SET =
  "EMPTY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_SET" as const;

export const CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_ORDER: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation[] =
  [
    "INTERPRET_AS_SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY",
    "INTERPRET_AS_CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_COMPATIBILITY",
  ];

export const CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_RAW_QUANTITY_RELATION_ORDER: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation[] =
  [
    "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL",
    "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL",
    "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REFERENCE_INTERVAL",
    "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_CONTAINS_REFERENCE_INTERVAL",
    "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_PARTIALLY_OVERLAPS_REFERENCE_INTERVAL",
    "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL",
  ];

const INTERPRETATION_ORDER = new Map(
  CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_ORDER.map(
    (value, index) => [value, index]
  )
);

const RAW_RELATION_ORDER = new Map(
  CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_RAW_QUANTITY_RELATION_ORDER.map(
    (value, index) => [value, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeInterpretation(
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown Declared Potential Contribution Capacity Relation Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

function normalizeRawRelation(
  rawRelation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation {
  if (!RAW_RELATION_ORDER.has(rawRelation)) {
    throw new Error(
      `Unknown Declared Potential Contribution raw quantity relation: ${String(rawRelation)}`
    );
  }
  return rawRelation;
}

/**
 * Mapping identity:
 * attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-mapping|
 * DECLARED_CAPACITY|rawRelation|interpretation
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingKey(params: {
  raw_relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretation;
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-mapping",
    "DECLARED_CAPACITY",
    params.raw_relation,
    params.interpretation,
  ].join("|");
}

export function buildCanonicalDeclaredPotentialContributionCapacityRelationInterpretationMappingSetKey(
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping[]
): string {
  if (mappings.length === 0) {
    return EMPTY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_MAPPING_SET;
  }
  return mappings
    .map((mapping) => mapping.key)
    .sort(compareStrings)
    .join(",");
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-policy|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|bindingKey|resourceDeclarationId|DECLARED_CAPACITY|
 * canonicalMappingSetKey
 *
 * Excludes: evaluationAt, current contribution quantity/declaration key,
 * current GROUND-157 raw relation / Basis key, capacity declaration ids.
 */
export function attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  mappings: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping[];
}): string {
  return [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-capacity-relation-interpretation-policy",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.resource_readiness_observation_context_binding_key,
    params.resource_declaration_id,
    "DECLARED_CAPACITY",
    buildCanonicalDeclaredPotentialContributionCapacityRelationInterpretationMappingSetKey(
      params.mappings
    ),
  ].join("|");
}

/**
 * Canonicalize exact raw-relation mappings.
 * Duplicate identical → one. Same raw relation + different interpretation → reject.
 * Mapping order ≠ priority. Sort by raw_relation then interpretation.
 */
export function canonicalizeDeclaredPotentialContributionCapacityRelationInterpretationMappings(
  mappingInputs: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingInput[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping[] {
  if (!Array.isArray(mappingInputs)) {
    throw new Error("mappings must be an array");
  }

  const byRawRelation = new Map<
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping
  >();

  for (const entry of mappingInputs) {
    const raw_relation = normalizeRawRelation(entry.raw_relation);
    const interpretation = normalizeInterpretation(entry.interpretation);
    const mapping: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMapping =
      {
        key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingKey(
          { raw_relation, interpretation }
        ),
        relation_axis: "DECLARED_CAPACITY",
        raw_relation,
        interpretation,
      };

    const existing = byRawRelation.get(raw_relation);
    if (existing) {
      if (existing.interpretation !== interpretation) {
        throw new Error(
          `Conflicting Declared Potential Contribution Capacity Relation Interpretation mappings for ${raw_relation}`
        );
      }
      continue;
    }
    byRawRelation.set(raw_relation, mapping);
  }

  return [...byRawRelation.values()].sort((a, b) => {
    const relationCompare =
      (RAW_RELATION_ORDER.get(a.raw_relation) ?? 0) -
      (RAW_RELATION_ORDER.get(b.raw_relation) ?? 0);
    if (relationCompare !== 0) return relationCompare;
    return (
      (INTERPRETATION_ORDER.get(a.interpretation) ?? 0) -
      (INTERPRETATION_ORDER.get(b.interpretation) ?? 0)
    );
  });
}

interface StableBindingSubject {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  resource_readiness_observation_context_binding_key: string;
  resource_declaration_id: string;
  bindingAssessment: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment;
}

/**
 * Extract unique stable GROUND-133 Binding subjects from GROUND-155 lineage.
 * Deduplicates by resource_readiness_observation_context_binding_key.
 * Discards evaluation_at / current declaration quantity / presence.
 */
export function extractStableDeclaredPotentialContributionCapacityRelationInterpretationSubjects(
  declarationSet: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment
): Map<string, StableBindingSubject> {
  const byBindingKey = new Map<string, StableBindingSubject>();

  for (const candidate of declarationSet.candidate_assessments) {
    for (const binding of candidate.binding_potential_contribution_declaration_assessments) {
      const raw =
        binding.quantity_relation_binding_assessment
          .raw_binding_evidence_assessment;
      const bindingKey =
        binding.resource_readiness_observation_context_binding_key;

      if (
        raw.resource_readiness_observation_context_binding_key !== bindingKey
      ) {
        throw new Error(
          `GROUND-155 Binding assessment key mismatch for ${bindingKey}`
        );
      }
      if (raw.candidate_key !== candidate.candidate_key) {
        throw new Error(
          `GROUND-155 Binding ${bindingKey} candidate mismatch`
        );
      }

      const subject: StableBindingSubject = {
        candidate_key: raw.candidate_key,
        observation_need_key: raw.observation_need_key,
        capability_requirement_set_key: raw.capability_requirement_set_key,
        observation_resource_requirement_key:
          binding.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key: bindingKey,
        resource_declaration_id: binding.resource_declaration_id,
        bindingAssessment: binding,
      };

      const existing = byBindingKey.get(bindingKey);
      if (existing) {
        if (
          existing.candidate_key !== subject.candidate_key ||
          existing.observation_need_key !== subject.observation_need_key ||
          existing.capability_requirement_set_key !==
            subject.capability_requirement_set_key ||
          existing.observation_resource_requirement_key !==
            subject.observation_resource_requirement_key ||
          existing.resource_declaration_id !== subject.resource_declaration_id
        ) {
          throw new Error(
            `Ambiguous stable Binding subject for ${bindingKey}`
          );
        }
        continue;
      }
      byBindingKey.set(bindingKey, subject);
    }
  }

  return byBindingKey;
}

/**
 * Validates and normalizes Interpretation Policy specification against
 * stable GROUND-133 Binding keys preserved by GROUND-155.
 *
 * Exact duplicate (same Binding key + same mapping set) → one.
 * Same Binding key + different mapping sets → reject.
 * Unknown / stale / cross-candidate missing targets → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification(
  declarationSet: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationSetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification {
  const subjectsByBindingKey =
    extractStableDeclaredPotentialContributionCapacityRelationInterpretationSubjects(
      declarationSet
    );
  const byBindingKey = new Map<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyInput
  >();

  if (!Array.isArray(specification.policies)) {
    throw new Error("policies must be an array");
  }

  for (const entry of specification.policies) {
    if (
      !entry.resource_readiness_observation_context_binding_key ||
      entry.resource_readiness_observation_context_binding_key.trim().length ===
        0
    ) {
      throw new Error(
        "resource_readiness_observation_context_binding_key must be non-empty"
      );
    }

    const subject = subjectsByBindingKey.get(
      entry.resource_readiness_observation_context_binding_key
    );
    if (!subject) {
      throw new Error(
        `Unknown or stale RESOURCE_READINESS Observation-Context Binding ${entry.resource_readiness_observation_context_binding_key}`
      );
    }

    const mappings =
      canonicalizeDeclaredPotentialContributionCapacityRelationInterpretationMappings(
        entry.mappings
      );

    const existing = byBindingKey.get(
      entry.resource_readiness_observation_context_binding_key
    );
    if (existing) {
      const existingCanonical =
        canonicalizeDeclaredPotentialContributionCapacityRelationInterpretationMappings(
          existing.mappings
        );
      if (
        buildCanonicalDeclaredPotentialContributionCapacityRelationInterpretationMappingSetKey(
          existingCanonical
        ) !==
        buildCanonicalDeclaredPotentialContributionCapacityRelationInterpretationMappingSetKey(
          mappings
        )
      ) {
        throw new Error(
          `Conflicting Declared Potential Contribution Capacity Relation Interpretation Policies declared for binding ${entry.resource_readiness_observation_context_binding_key}`
        );
      }
      continue;
    }

    byBindingKey.set(entry.resource_readiness_observation_context_binding_key, {
      resource_readiness_observation_context_binding_key:
        entry.resource_readiness_observation_context_binding_key,
      mappings,
    });
  }

  const policies = [...byBindingKey.values()].sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return { policies };
}

function buildInterpretationPolicy(
  subject: StableBindingSubject,
  mappingInputs: readonly AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationMappingInput[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicy {
  const canonicalMappings =
    canonicalizeDeclaredPotentialContributionCapacityRelationInterpretationMappings(
      mappingInputs
    );

  return {
    key: attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyKey(
      {
        candidate_key: subject.candidate_key,
        observation_need_key: subject.observation_need_key,
        capability_requirement_set_key: subject.capability_requirement_set_key,
        observation_resource_requirement_key:
          subject.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          subject.resource_readiness_observation_context_binding_key,
        resource_declaration_id: subject.resource_declaration_id,
        mappings: canonicalMappings,
      }
    ),
    candidate_key: subject.candidate_key,
    observation_need_key: subject.observation_need_key,
    capability_requirement_set_key: subject.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      subject.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      subject.resource_readiness_observation_context_binding_key,
    resource_declaration_id: subject.resource_declaration_id,
    relation_axis: "DECLARED_CAPACITY",
    mappings: canonicalMappings,
  };
}

function assertBindingInterpretationPolicyInvariant(
  assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_PRESENT"
  ) {
    if (assessment.interpretation_policy === null) {
      throw new Error(
        `Declared Potential Contribution Capacity Relation Interpretation Policy invariant violated: PRESENT requires non-null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (!assessment.has_explicit_capacity_relation_interpretation_policy) {
      throw new Error(
        `Declared Potential Contribution Capacity Relation Interpretation Policy invariant violated: PRESENT requires boolean true for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  if (
    assessment.status ===
    "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (assessment.interpretation_policy !== null) {
      throw new Error(
        `Declared Potential Contribution Capacity Relation Interpretation Policy invariant violated: NO_POLICY requires null policy for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    if (assessment.has_explicit_capacity_relation_interpretation_policy) {
      throw new Error(
        `Declared Potential Contribution Capacity Relation Interpretation Policy invariant violated: NO_POLICY requires boolean false for binding ${assessment.resource_readiness_observation_context_binding_key}`
      );
    }
    return;
  }

  const _exhaustive: never = assessment.status;
  void _exhaustive;
  throw new Error(
    `Unknown Declared Potential Contribution Capacity Relation Interpretation Policy status: ${String(assessment.status)}`
  );
}

function assessBindingInterpretationPolicy(
  subject: StableBindingSubject,
  policiesByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyInput
  >
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment {
  const declared = policiesByBindingKey.get(
    subject.resource_readiness_observation_context_binding_key
  );

  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment =
      {
        observation_resource_requirement_key:
          subject.observation_resource_requirement_key,
        resource_readiness_observation_context_binding_key:
          subject.resource_readiness_observation_context_binding_key,
        resource_declaration_id: subject.resource_declaration_id,
        status:
          "NO_EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_DECLARED",
        interpretation_policy: null,
        has_explicit_capacity_relation_interpretation_policy: false,
      };
    assertBindingInterpretationPolicyInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment =
    {
      observation_resource_requirement_key:
        subject.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key:
        subject.resource_readiness_observation_context_binding_key,
      resource_declaration_id: subject.resource_declaration_id,
      status:
        "EXPLICIT_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_PRESENT",
      interpretation_policy: buildInterpretationPolicy(
        subject,
        declared.mappings
      ),
      has_explicit_capacity_relation_interpretation_policy: true,
    };
  assertBindingInterpretationPolicyInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate capacity-relation Interpretation Policy assessment.
 * Does not look up current GROUND-157 relation values.
 * Deduplicates stable Binding subjects across evaluation instants.
 */
export function assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicy(
  declarationAssessment: AttentionCandidateObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationAssessment,
  policiesByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyInput
  >
): AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyAssessment {
  const seenBindingKeys = new Set<string>();
  const binding_interpretation_policy_assessments: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyBindingAssessment[] =
    [];

  for (const binding of declarationAssessment.binding_potential_contribution_declaration_assessments) {
    const bindingKey =
      binding.resource_readiness_observation_context_binding_key;
    if (seenBindingKeys.has(bindingKey)) {
      continue;
    }
    seenBindingKeys.add(bindingKey);

    const raw =
      binding.quantity_relation_binding_assessment
        .raw_binding_evidence_assessment;
    const subject: StableBindingSubject = {
      candidate_key: raw.candidate_key,
      observation_need_key: raw.observation_need_key,
      capability_requirement_set_key: raw.capability_requirement_set_key,
      observation_resource_requirement_key:
        binding.observation_resource_requirement_key,
      resource_readiness_observation_context_binding_key: bindingKey,
      resource_declaration_id: binding.resource_declaration_id,
      bindingAssessment: binding,
    };

    binding_interpretation_policy_assessments.push(
      assessBindingInterpretationPolicy(subject, policiesByBindingKey)
    );
  }

  binding_interpretation_policy_assessments.sort((a, b) =>
    compareStrings(
      a.resource_readiness_observation_context_binding_key,
      b.resource_readiness_observation_context_binding_key
    )
  );

  return {
    candidate_key: declarationAssessment.candidate_key,
    physical_potential_contribution_declaration_assessment:
      declarationAssessment,
    binding_interpretation_policy_assessments,
    has_explicit_capacity_relation_interpretation_policies:
      binding_interpretation_policy_assessments.some(
        (assessment) =>
          assessment.has_explicit_capacity_relation_interpretation_policy
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}

/**
 * Pure set-level Explicit Declared Potential Contribution Capacity-Relation
 * Interpretation Policy. Preserves AttentionCandidate order.
 * Does not inspect current GROUND-157 relations for Policy identity.
 */
export function buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySet(
  input: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicyEvalInput
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicySpecification(
      input.resource_readiness_physical_potential_contribution_declaration_set,
      input.specification
    );

  const policiesByBindingKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.resource_readiness_observation_context_binding_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.resource_readiness_physical_potential_contribution_declaration_set.candidate_assessments.map(
      (declarationAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionCapacityRelationInterpretationPolicy(
          declarationAssessment,
          policiesByBindingKey
        )
    );

  return {
    resource_readiness_physical_potential_contribution_declaration_set:
      input.resource_readiness_physical_potential_contribution_declaration_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_capacity_relation_interpretation_policies:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_capacity_relation_interpretation_policies
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_CAPACITY_RELATION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
