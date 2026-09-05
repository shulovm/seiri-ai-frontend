/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Authority Evidence Evaluation State Interpretation Policy (GROUND-114).
 *
 * Pure composition of GROUND-108 AUTHORITY Observation-Context Binding
 * + explicit interpretation-policy specification.
 *
 * GROUND-113 is type/canonicalization only — no current Evaluation State access.
 * Must not import GROUND-111/110/109/020/019, ProjectState, Permission, OE.
 *
 * Interpretation Policy ≠ Interpretation Basis ≠ canonical Authority State
 * INTERPRET_AS_* ≠ current canonical/effective/legal Authority
 * policy absence ≠ explicit empty policy; unusual mappings are valid
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBinding,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
} from "./attention-observation-operational-eligibility-authority-observation-context-binding-types.js";
import { buildAuthorityEvidenceEvaluationStateValueCanonicalKey } from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-core.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue,
  AttentionObservationOperationalEligibilityAuthorityEvidenceMultiplicity,
  AttentionObservationOperationalEligibilityAuthorityEvidencePresence,
} from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-types.js";
import type { DeclaredAuthorityStatus } from "./governance-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretation,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicy,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyEvalInput,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyInput,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySetAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySpecification,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyStatus,
} from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_INTERPRETATION_BASIS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "LEGAL_AUTHORITY_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

export const EMPTY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET =
  "EMPTY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET" as const;

export const CANONICAL_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_ORDER: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretation[] =
  [
    "INTERPRET_AS_AUTHORITY_STATE_POSITIVE",
    "INTERPRET_AS_AUTHORITY_STATE_NEGATIVE",
  ];

const DECLARED_AUTHORITY_STATUSES: readonly DeclaredAuthorityStatus[] = [
  "DECLARED_AUTHORITY_PRESENT",
  "NO_DECLARED_AUTHORITY",
  "DECLARER_NOT_ENTITY",
];

const EVIDENCE_PRESENCE_VALUES: readonly AttentionObservationOperationalEligibilityAuthorityEvidencePresence[] =
  ["PRESENT", "NOT_PRESENT"];

const EVIDENCE_MULTIPLICITY_VALUES: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceMultiplicity[] =
  ["MULTIPLE", "NOT_MULTIPLE"];

const INTERPRETATION_ORDER = new Map(
  CANONICAL_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_ORDER.map(
    (value, index) => [value, index]
  )
);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeInterpretation(
  interpretation: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretation
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown Authority Evidence Evaluation State Interpretation: ${String(interpretation)}`
    );
  }
  return interpretation;
}

function assertCompleteStructuredStateValue(
  value: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue
): void {
  if (
    value.direct_declared_status === undefined ||
    value.direct_provenance_path_presence === undefined ||
    value.delegated_provenance_path_presence === undefined ||
    value.active_source_basis_presence === undefined ||
    value.inactive_source_basis_presence === undefined ||
    value.inactive_delegation_presence === undefined ||
    value.contested_path_presence === undefined ||
    value.uncontested_path_presence === undefined ||
    value.direct_declaration_multiplicity === undefined ||
    value.delegated_path_multiplicity === undefined
  ) {
    throw new Error(
      "Malformed Authority Evidence Evaluation State mapping source: incomplete structured value"
    );
  }

  if (!DECLARED_AUTHORITY_STATUSES.includes(value.direct_declared_status)) {
    throw new Error(
      `Malformed Authority Evidence Evaluation State mapping source: unknown direct_declared_status ${String(value.direct_declared_status)}`
    );
  }

  for (const key of [
    "direct_provenance_path_presence",
    "delegated_provenance_path_presence",
    "active_source_basis_presence",
    "inactive_source_basis_presence",
    "inactive_delegation_presence",
    "contested_path_presence",
    "uncontested_path_presence",
  ] as const) {
    if (!EVIDENCE_PRESENCE_VALUES.includes(value[key])) {
      throw new Error(
        `Malformed Authority Evidence Evaluation State mapping source: unknown ${key} ${String(value[key])}`
      );
    }
  }

  for (const key of [
    "direct_declaration_multiplicity",
    "delegated_path_multiplicity",
  ] as const) {
    if (!EVIDENCE_MULTIPLICITY_VALUES.includes(value[key])) {
      throw new Error(
        `Malformed Authority Evidence Evaluation State mapping source: unknown ${key} ${String(value[key])}`
      );
    }
  }
}

/**
 * Validate and canonicalize one complete GROUND-113 structured evidence value.
 */
export function normalizeAuthorityEvidenceEvaluationStateValue(
  value: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue {
  assertCompleteStructuredStateValue(value);
  return {
    direct_declared_status: value.direct_declared_status,
    direct_provenance_path_presence: value.direct_provenance_path_presence,
    delegated_provenance_path_presence: value.delegated_provenance_path_presence,
    active_source_basis_presence: value.active_source_basis_presence,
    inactive_source_basis_presence: value.inactive_source_basis_presence,
    inactive_delegation_presence: value.inactive_delegation_presence,
    contested_path_presence: value.contested_path_presence,
    uncontested_path_presence: value.uncontested_path_presence,
    direct_declaration_multiplicity: value.direct_declaration_multiplicity,
    delegated_path_multiplicity: value.delegated_path_multiplicity,
  };
}

export function canonicalizeAuthorityEvidenceEvaluationStateInterpretationMappings(
  mappings: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[]
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[] {
  const byCanonicalKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping
  >();

  for (const mapping of mappings) {
    const authority_evidence_evaluation_state_value =
      normalizeAuthorityEvidenceEvaluationStateValue(
        mapping.authority_evidence_evaluation_state_value
      );
    const interpretation = normalizeInterpretation(mapping.interpretation);
    const canonicalKey = buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
      authority_evidence_evaluation_state_value
    );
    const existing = byCanonicalKey.get(canonicalKey);
    if (existing !== undefined) {
      if (existing.interpretation !== interpretation) {
        throw new Error(
          `Conflicting Authority Evidence Evaluation State Interpretation mappings for structured state ${canonicalKey}`
        );
      }
      continue;
    }
    byCanonicalKey.set(canonicalKey, {
      authority_evidence_evaluation_state_value,
      interpretation,
    });
  }

  return [...byCanonicalKey.values()].sort((a, b) =>
    compareStrings(
      buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
        a.authority_evidence_evaluation_state_value
      ),
      buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
        b.authority_evidence_evaluation_state_value
      )
    )
  );
}

export function buildCanonicalAuthorityEvidenceEvaluationStateInterpretationMappingSetKey(
  mappings: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[]
): string {
  const canonical =
    canonicalizeAuthorityEvidenceEvaluationStateInterpretationMappings(mappings);
  if (canonical.length === 0) {
    return EMPTY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET;
  }
  return canonical
    .map(
      (mapping) =>
        `${buildAuthorityEvidenceEvaluationStateValueCanonicalKey(mapping.authority_evidence_evaluation_state_value)}=${mapping.interpretation}`
    )
    .join(",");
}

export function attentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyKey(params: {
  candidateKey: string;
  observationNeedKey: string;
  capabilityRequirementSetKey: string;
  authorityObservationContextBindingKey: string;
  authorityHolderEntityId: string;
  authorityPower: string;
  governanceScopeKey: string;
  canonicalMappingSetKey: string;
}): string {
  return [
    "attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy",
    params.candidateKey,
    params.observationNeedKey,
    params.capabilityRequirementSetKey,
    "AUTHORITY",
    params.authorityObservationContextBindingKey,
    params.authorityHolderEntityId,
    params.authorityPower,
    params.governanceScopeKey,
    params.canonicalMappingSetKey,
  ].join("|");
}

function mappingsEqual(
  a: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[],
  b: readonly AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const left = a[i]!;
    const right = b[i]!;
    if (left.interpretation !== right.interpretation) {
      return false;
    }
    if (
      buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
        left.authority_evidence_evaluation_state_value
      ) !==
      buildAuthorityEvidenceEvaluationStateValueCanonicalKey(
        right.authority_evidence_evaluation_state_value
      )
    ) {
      return false;
    }
  }
  return true;
}

function collectBindingsByKey(
  bindingSet: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment
): Map<string, AttentionObservationOperationalEligibilityAuthorityObservationContextBinding> {
  const byKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthorityObservationContextBinding
  >();

  for (const candidate of bindingSet.candidate_assessments) {
    for (const binding of candidate.authority_observation_context_bindings) {
      if (byKey.has(binding.key)) {
        throw new Error(
          `Ambiguous AUTHORITY Observation-Context Binding key ${binding.key}`
        );
      }
      if (binding.candidate_key !== candidate.candidate_key) {
        throw new Error(
          `AUTHORITY Observation-Context Binding ${binding.key} candidate mismatch`
        );
      }
      byKey.set(binding.key, binding);
    }
  }

  return byKey;
}

export function normalizeAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySpecification(
  bindingSet: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
  specification: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySpecification
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySpecification {
  const bindingsByKey = collectBindingsByKey(bindingSet);
  const byBindingKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyInput
  >();

  for (const entry of specification.policies) {
    if (
      !entry.authority_observation_context_binding_key ||
      entry.authority_observation_context_binding_key.trim().length === 0
    ) {
      throw new Error(
        "authority_observation_context_binding_key must be non-empty"
      );
    }

    const binding = bindingsByKey.get(
      entry.authority_observation_context_binding_key
    );
    if (!binding) {
      throw new Error(
        `AUTHORITY Observation-Context Binding ${entry.authority_observation_context_binding_key} not found in binding set`
      );
    }

    const normalizedMappings =
      canonicalizeAuthorityEvidenceEvaluationStateInterpretationMappings(
        entry.mappings
      );
    const existing = byBindingKey.get(
      entry.authority_observation_context_binding_key
    );
    if (existing) {
      if (!mappingsEqual(existing.mappings, normalizedMappings)) {
        throw new Error(
          `Conflicting Authority Evidence Evaluation State Interpretation Policies declared for binding ${entry.authority_observation_context_binding_key}`
        );
      }
      continue;
    }

    byBindingKey.set(entry.authority_observation_context_binding_key, {
      authority_observation_context_binding_key:
        entry.authority_observation_context_binding_key,
      mappings: normalizedMappings,
    });
  }

  const policies = [...byBindingKey.values()].sort((a, b) =>
    compareStrings(
      a.authority_observation_context_binding_key,
      b.authority_observation_context_binding_key
    )
  );

  return { policies };
}

function buildPolicy(
  binding: AttentionObservationOperationalEligibilityAuthorityObservationContextBinding,
  mappings: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[]
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicy {
  const mappingSetKey =
    buildCanonicalAuthorityEvidenceEvaluationStateInterpretationMappingSetKey(
      mappings
    );
  return {
    key: attentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyKey(
      {
        candidateKey: binding.candidate_key,
        observationNeedKey: binding.observation_need_key,
        capabilityRequirementSetKey: binding.capability_requirement_set_key,
        authorityObservationContextBindingKey: binding.key,
        authorityHolderEntityId: binding.authority_holder_entity_id,
        authorityPower: binding.authority_power,
        governanceScopeKey: binding.governance_scope_key,
        canonicalMappingSetKey: mappingSetKey,
      }
    ),
    candidate_key: binding.candidate_key,
    observation_need_key: binding.observation_need_key,
    capability_requirement_set_key: binding.capability_requirement_set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key: binding.key,
    authority_holder_entity_id: binding.authority_holder_entity_id,
    authority_power: binding.authority_power,
    governance_scope: binding.governance_scope,
    governance_scope_key: binding.governance_scope_key,
    mappings: [...mappings],
  };
}

function assertBindingPolicyInvariant(
  assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT" &&
    assessment.authority_evidence_evaluation_state_interpretation_policy ===
      null
  ) {
    throw new Error(
      `AUTHORITY Evidence Interpretation Policy invariant violated: PRESENT requires non-null policy for binding ${assessment.authority_observation_context_binding.key}`
    );
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED" &&
    assessment.authority_evidence_evaluation_state_interpretation_policy !==
      null
  ) {
    throw new Error(
      `AUTHORITY Evidence Interpretation Policy invariant violated: NO_POLICY requires null policy for binding ${assessment.authority_observation_context_binding.key}`
    );
  }

  if (
    assessment.has_explicit_authority_evidence_evaluation_state_interpretation_policy !==
    (assessment.status ===
      "EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT")
  ) {
    throw new Error(
      `AUTHORITY Evidence Interpretation Policy invariant violated: has_explicit mismatch for binding ${assessment.authority_observation_context_binding.key}`
    );
  }
}

function assessBindingPolicy(
  binding: AttentionObservationOperationalEligibilityAuthorityObservationContextBinding,
  policyByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyInput
  >
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment {
  const declared = policyByBindingKey.get(binding.key);
  if (!declared) {
    const assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment =
      {
        authority_observation_context_binding: binding,
        status:
          "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED",
        authority_evidence_evaluation_state_interpretation_policy: null,
        has_explicit_authority_evidence_evaluation_state_interpretation_policy:
          false,
      };
    assertBindingPolicyInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment =
    {
      authority_observation_context_binding: binding,
      status:
        "EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT",
      authority_evidence_evaluation_state_interpretation_policy: buildPolicy(
        binding,
        declared.mappings
      ),
      has_explicit_authority_evidence_evaluation_state_interpretation_policy:
        true,
    };
  assertBindingPolicyInvariant(assessment);
  return assessment;
}

function summarizeBindingPolicies(
  assessments: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyBindingAssessment[]
): {
  has_explicit_authority_evidence_evaluation_state_interpretation_policies: boolean;
  has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy: boolean;
} {
  let has_explicit_authority_evidence_evaluation_state_interpretation_policies =
    false;
  let has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy =
    false;

  for (const assessment of assessments) {
    if (
      assessment.has_explicit_authority_evidence_evaluation_state_interpretation_policy
    ) {
      has_explicit_authority_evidence_evaluation_state_interpretation_policies =
        true;
    } else {
      has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy =
        true;
    }
  }

  return {
    has_explicit_authority_evidence_evaluation_state_interpretation_policies,
    has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy,
  };
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyAssessment
): void {
  const bindingCount =
    assessment.authority_observation_context_binding_assessment
      .authority_observation_context_bindings.length;
  const summary = summarizeBindingPolicies(assessment.binding_policy_assessments);

  if (
    assessment.has_explicit_authority_evidence_evaluation_state_interpretation_policies !==
    summary.has_explicit_authority_evidence_evaluation_state_interpretation_policies
  ) {
    throw new Error(
      `AUTHORITY Evidence Interpretation Policy invariant violated: has_explicit summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy !==
    summary.has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy
  ) {
    throw new Error(
      `AUTHORITY Evidence Interpretation Policy invariant violated: has_without summary mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
    "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_BINDING_ASSESSMENTS_PRESENT"
  ) {
    if (assessment.binding_policy_assessments.length !== bindingCount) {
      throw new Error(
        `AUTHORITY Evidence Interpretation Policy cardinality invariant violated for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (assessment.binding_policy_assessments.length !== 0) {
    throw new Error(
      `AUTHORITY Evidence Interpretation Policy invariant violated: non-present candidate status requires empty binding assessments for candidate ${assessment.candidate_key}`
    );
  }
}

export function assessAttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicy(
  bindingAssessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment,
  policyByBindingKey: ReadonlyMap<
    string,
    AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyInput
  >
): AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyAssessment {
  const candidate_key = bindingAssessment.candidate_key;

  const empty = (
    status: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyStatus
  ): AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyAssessment =
      {
        candidate_key,
        authority_observation_context_binding_assessment: bindingAssessment,
        status,
        binding_policy_assessments: [],
        has_explicit_authority_evidence_evaluation_state_interpretation_policies:
          false,
        has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy:
          false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    bindingAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return empty("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    bindingAssessment.status ===
    "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return empty("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (
    bindingAssessment.status ===
    "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    return empty("NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED");
  }

  const binding_policy_assessments =
    bindingAssessment.authority_observation_context_bindings.map((binding) =>
      assessBindingPolicy(binding, policyByBindingKey)
    );

  const summary = summarizeBindingPolicies(binding_policy_assessments);

  const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyAssessment =
    {
      candidate_key,
      authority_observation_context_binding_assessment: bindingAssessment,
      status:
        "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_BINDING_ASSESSMENTS_PRESENT",
      binding_policy_assessments,
      ...summary,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

export function buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet(
  input: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicyEvalInput
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySpecification(
      input.authority_observation_context_binding_set,
      input.specification
    );

  const policyByBindingKey = new Map(
    normalizedSpecification.policies.map((policy) => [
      policy.authority_observation_context_binding_key,
      policy,
    ])
  );

  const candidate_assessments =
    input.authority_observation_context_binding_set.candidate_assessments.map(
      (bindingAssessment) =>
        assessAttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicy(
          bindingAssessment,
          policyByBindingKey
        )
    );

  const has_explicit_authority_evidence_evaluation_state_interpretation_policies =
    candidate_assessments.some(
      (assessment) =>
        assessment.has_explicit_authority_evidence_evaluation_state_interpretation_policies
    );
  const has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy =
    candidate_assessments.some(
      (assessment) =>
        assessment.has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy
    );

  return {
    authority_observation_context_binding_set:
      input.authority_observation_context_binding_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_authority_evidence_evaluation_state_interpretation_policies,
    has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy,
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
