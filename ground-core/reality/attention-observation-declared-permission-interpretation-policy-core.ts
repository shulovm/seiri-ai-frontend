/**
 * Reality Core v0.7 — Attention Observation Declared Permission Interpretation
 * Policy (GROUND-089).
 *
 * Pure composition of GROUND-087 Permission Observation-Context Binding
 * + explicit Declared Permission Interpretation Policy Specification.
 *
 * Independent policy branch over exact Permission Context Bindings.
 * Must not import GROUND-088 current Declared Permission Assessment.
 *
 * Forbidden: ProjectState mutation, wall-clock, Permission governance,
 * Feasibility, Decision, Operational Eligibility, GROUND-083–085.
 *
 * Interpretation Policy ≠ Interpretation Basis ≠ Permission State
 * INTERPRET_AS_* ≠ currently permitted / prohibited
 * policy absence ≠ explicit empty policy
 * CONTESTED mapping ≠ declaration winner
 * no default open/closed-world / PERMIT/PROHIBIT mappings
 * multiple binding policies remain independent
 */

import type {
  AttentionCandidateObservationPermissionContextBindingAssessment,
  AttentionObservationPermissionContextBinding,
  AttentionObservationPermissionContextBindingSetAssessment,
} from "./attention-observation-permission-context-binding-types.js";
import type { DeclaredInterventionPermissionStatus } from "./permission-types.js";
import type {
  AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment,
  AttentionObservationDeclaredPermissionInterpretation,
  AttentionObservationDeclaredPermissionInterpretationMapping,
  AttentionObservationDeclaredPermissionInterpretationPolicy,
  AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment,
  AttentionObservationDeclaredPermissionInterpretationPolicyCandidateStatus,
  AttentionObservationDeclaredPermissionInterpretationPolicyEvalInput,
  AttentionObservationDeclaredPermissionInterpretationPolicyInput,
  AttentionObservationDeclaredPermissionInterpretationPolicyModelLimitation,
  AttentionObservationDeclaredPermissionInterpretationPolicySetAssessment,
  AttentionObservationDeclaredPermissionInterpretationPolicySpecification,
  AttentionObservationDeclaredPermissionInterpretationPolicyStatus,
} from "./attention-observation-declared-permission-interpretation-policy-types.js";

export const ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_POLICY_MODEL_LIMITATIONS: AttentionObservationDeclaredPermissionInterpretationPolicyModelLimitation[] =
  [
    "DECLARED_PERMISSION_INTERPRETATION_MATCH_NOT_MODELED",
    "PERMISSION_INTERPRETATION_BASIS_NOT_MODELED",
    "PERMISSION_CURRENT_STATE_NOT_MODELED",
    "PERMISSION_EFFECTIVE_STATE_NOT_MODELED",
    "PERMISSION_POLICY_COMPLETENESS_NOT_MODELED",
    "PERMISSION_POLICY_DEFAULTS_NOT_MODELED",
    "PERMISSION_DECLARATION_LEVEL_CONFLICT_RESOLUTION_NOT_MODELED",
    "PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "PERMISSION_RECENCY_PRECEDENCE_NOT_MODELED",
    "PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_COVERAGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * Canonical GROUND-024 DeclaredInterventionPermissionStatus order —
 * serialization only, not preference / open-world / closed-world default.
 */
export const CANONICAL_DECLARED_INTERVENTION_PERMISSION_STATUS_ORDER: DeclaredInterventionPermissionStatus[] =
  [
    "NO_PERMISSION_DECLARATIONS",
    "PERMIT_DECLARED",
    "PROHIBIT_DECLARED",
    "CONTESTED_PERMISSION",
  ];

/**
 * Canonical interpretation order — serialization only, not preference.
 */
export const CANONICAL_DECLARED_PERMISSION_INTERPRETATION_ORDER: AttentionObservationDeclaredPermissionInterpretation[] =
  [
    "INTERPRET_AS_PERMISSION_PERMITTED",
    "INTERPRET_AS_PERMISSION_PROHIBITED",
  ];

const SOURCE_STATUS_ORDER = new Map(
  CANONICAL_DECLARED_INTERVENTION_PERMISSION_STATUS_ORDER.map((s, i) => [s, i])
);

const INTERPRETATION_ORDER = new Map(
  CANONICAL_DECLARED_PERMISSION_INTERPRETATION_ORDER.map((v, i) => [v, i])
);

const EMPTY_MAPPING_SET_KEY = "EMPTY_MAPPING_SET";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function normalizeSourceStatus(
  status: DeclaredInterventionPermissionStatus
): DeclaredInterventionPermissionStatus {
  if (!SOURCE_STATUS_ORDER.has(status)) {
    throw new Error(
      `Unknown DeclaredInterventionPermissionStatus: ${String(status)}`
    );
  }
  return status;
}

function normalizeInterpretation(
  interpretation: AttentionObservationDeclaredPermissionInterpretation
): AttentionObservationDeclaredPermissionInterpretation {
  if (!INTERPRETATION_ORDER.has(interpretation)) {
    throw new Error(
      `Unknown Declared Permission Interpretation value: ${String(interpretation)}`
    );
  }
  return interpretation;
}

/**
 * Canonicalize mapping pairs:
 * - unknown status / interpretation → reject
 * - exact duplicate pair → one
 * - same status + conflicting interpretation → reject
 * - order → canonical DeclaredInterventionPermissionStatus order
 */
export function canonicalizeDeclaredPermissionInterpretationMappings(
  mappings: readonly AttentionObservationDeclaredPermissionInterpretationMapping[]
): AttentionObservationDeclaredPermissionInterpretationMapping[] {
  const byStatus = new Map<
    DeclaredInterventionPermissionStatus,
    AttentionObservationDeclaredPermissionInterpretation
  >();

  for (const mapping of mappings) {
    const status = normalizeSourceStatus(mapping.declared_permission_status);
    const interpretation = normalizeInterpretation(mapping.interpretation);
    const existing = byStatus.get(status);
    if (existing !== undefined) {
      if (existing !== interpretation) {
        throw new Error(
          `Conflicting Declared Permission Interpretation mappings declared for status ${status}`
        );
      }
      continue;
    }
    byStatus.set(status, interpretation);
  }

  const canonical: AttentionObservationDeclaredPermissionInterpretationMapping[] =
    [];
  for (const status of CANONICAL_DECLARED_INTERVENTION_PERMISSION_STATUS_ORDER) {
    const interpretation = byStatus.get(status);
    if (interpretation !== undefined) {
      canonical.push({
        declared_permission_status: status,
        interpretation,
      });
    }
  }
  return canonical;
}

export function buildCanonicalDeclaredPermissionInterpretationMappingSetKey(
  mappings: readonly AttentionObservationDeclaredPermissionInterpretationMapping[]
): string {
  const canonical = canonicalizeDeclaredPermissionInterpretationMappings(
    mappings
  );
  if (canonical.length === 0) {
    return EMPTY_MAPPING_SET_KEY;
  }
  return canonical
    .map((m) => `${m.declared_permission_status}=${m.interpretation}`)
    .join(",");
}

export function attentionObservationDeclaredPermissionInterpretationPolicyKey(
  permissionContextBindingKey: string,
  canonicalInterpretationMappingSetKey: string
): string {
  return [
    "attention-observation-declared-permission-interpretation-policy",
    permissionContextBindingKey,
    canonicalInterpretationMappingSetKey,
  ].join("|");
}

function mappingsEqual(
  a: readonly AttentionObservationDeclaredPermissionInterpretationMapping[],
  b: readonly AttentionObservationDeclaredPermissionInterpretationMapping[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (
      a[i]!.declared_permission_status !== b[i]!.declared_permission_status ||
      a[i]!.interpretation !== b[i]!.interpretation
    ) {
      return false;
    }
  }
  return true;
}

function collectBindingsByKey(
  permissionContextBindingSet: AttentionObservationPermissionContextBindingSetAssessment
): Map<string, AttentionObservationPermissionContextBinding> {
  const byKey = new Map<string, AttentionObservationPermissionContextBinding>();

  for (const candidate of permissionContextBindingSet.candidate_assessments) {
    for (const binding of candidate.permission_context_bindings) {
      if (byKey.has(binding.key)) {
        throw new Error(
          `Ambiguous Permission Context Binding key ${binding.key}`
        );
      }
      if (binding.candidate_key !== candidate.candidate_key) {
        throw new Error(
          `Permission Context Binding ${binding.key} candidate mismatch`
        );
      }
      byKey.set(binding.key, binding);
    }
  }

  return byKey;
}

/**
 * Validates and normalizes Declared Permission Interpretation Policy specification
 * against represented GROUND-087 bindings.
 *
 * Exact duplicate policies → one.
 * Same binding + different mapping sets → reject (no silent merge).
 * Unknown binding → reject.
 * Specification order has no semantic meaning.
 */
export function normalizeAttentionObservationDeclaredPermissionInterpretationPolicySpecification(
  permissionContextBindingSet: AttentionObservationPermissionContextBindingSetAssessment,
  specification: AttentionObservationDeclaredPermissionInterpretationPolicySpecification
): AttentionObservationDeclaredPermissionInterpretationPolicySpecification {
  const bindingsByKey = collectBindingsByKey(permissionContextBindingSet);
  const byBindingKey = new Map<
    string,
    AttentionObservationDeclaredPermissionInterpretationPolicyInput
  >();

  for (const entry of specification.policies) {
    if (
      !entry.permission_context_binding_key ||
      entry.permission_context_binding_key.trim().length === 0
    ) {
      throw new Error("permission_context_binding_key must be non-empty");
    }

    const binding = bindingsByKey.get(entry.permission_context_binding_key);
    if (!binding) {
      throw new Error(
        `Permission Context Binding ${entry.permission_context_binding_key} not found in binding set`
      );
    }

    const normalizedMappings =
      canonicalizeDeclaredPermissionInterpretationMappings(entry.mappings);
    const existing = byBindingKey.get(entry.permission_context_binding_key);
    if (existing) {
      if (!mappingsEqual(existing.mappings, normalizedMappings)) {
        throw new Error(
          `Conflicting Declared Permission Interpretation Policies declared for binding ${entry.permission_context_binding_key}`
        );
      }
      continue;
    }

    byBindingKey.set(entry.permission_context_binding_key, {
      permission_context_binding_key: entry.permission_context_binding_key,
      mappings: normalizedMappings,
    });
  }

  const policies = [...byBindingKey.values()].sort((a, b) =>
    compareStrings(
      a.permission_context_binding_key,
      b.permission_context_binding_key
    )
  );

  return { policies };
}

function assertBindingPolicyInvariant(
  assessment: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment
): void {
  if (
    assessment.status ===
      "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT" &&
    assessment.declared_permission_interpretation_policy === null
  ) {
    throw new Error(
      `Declared Permission Interpretation Policy invariant violated: PRESENT requires non-null policy for binding ${assessment.permission_context_binding_key}`
    );
  }

  if (
    assessment.status ===
      "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED" &&
    assessment.declared_permission_interpretation_policy !== null
  ) {
    throw new Error(
      `Declared Permission Interpretation Policy invariant violated: NO_POLICY requires null policy for binding ${assessment.permission_context_binding_key}`
    );
  }
}

function buildPolicy(
  binding: AttentionObservationPermissionContextBinding,
  mappings: AttentionObservationDeclaredPermissionInterpretationMapping[]
): AttentionObservationDeclaredPermissionInterpretationPolicy {
  const mappingSetKey =
    buildCanonicalDeclaredPermissionInterpretationMappingSetKey(mappings);
  return {
    key: attentionObservationDeclaredPermissionInterpretationPolicyKey(
      binding.key,
      mappingSetKey
    ),
    candidate_key: binding.candidate_key,
    observation_need_key: binding.observation_need_key,
    capability_requirement_set_key: binding.capability_requirement_set_key,
    permission_context_binding_key: binding.key,
    permission_actor_entity_id: binding.permission_actor_entity_id,
    permission_intervention_id: binding.permission_intervention_id,
    mappings: [...mappings],
  };
}

function assessBindingPolicy(
  binding: AttentionObservationPermissionContextBinding,
  policyByBindingKey: ReadonlyMap<
    string,
    AttentionObservationDeclaredPermissionInterpretationPolicyInput
  >
): AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment {
  const declared = policyByBindingKey.get(binding.key);
  if (!declared) {
    const assessment: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment =
      {
        permission_context_binding_key: binding.key,
        candidate_key: binding.candidate_key,
        observation_need_key: binding.observation_need_key,
        capability_requirement_set_key: binding.capability_requirement_set_key,
        permission_actor_entity_id: binding.permission_actor_entity_id,
        permission_intervention_id: binding.permission_intervention_id,
        status: "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
        declared_permission_interpretation_policy: null,
      };
    assertBindingPolicyInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment =
    {
      permission_context_binding_key: binding.key,
      candidate_key: binding.candidate_key,
      observation_need_key: binding.observation_need_key,
      capability_requirement_set_key: binding.capability_requirement_set_key,
      permission_actor_entity_id: binding.permission_actor_entity_id,
      permission_intervention_id: binding.permission_intervention_id,
      status: "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT",
      declared_permission_interpretation_policy: buildPolicy(
        binding,
        declared.mappings
      ),
    };
  assertBindingPolicyInvariant(assessment);
  return assessment;
}

function hasAnyExplicitPolicy(
  assessments: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.status ===
      "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT"
    ) {
      return true;
    }
  }
  return false;
}

function assertCandidateAssessmentInvariant(
  assessment: AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment
): void {
  const bindingCount =
    assessment.permission_context_binding_assessment.permission_context_bindings
      .length;

  if (
    assessment.status ===
    "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT"
  ) {
    if (assessment.binding_policy_assessments.length !== bindingCount) {
      throw new Error(
        `Declared Permission Interpretation Policy cardinality invariant violated for candidate ${assessment.candidate_key}`
      );
    }
    return;
  }

  if (assessment.binding_policy_assessments.length !== 0) {
    throw new Error(
      `Declared Permission Interpretation Policy invariant violated: non-present candidate status requires empty binding assessments for candidate ${assessment.candidate_key}`
    );
  }
}

/**
 * Pure Candidate-level Declared Permission Interpretation Policy assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT
 *
 * Does not match current GROUND-088 assessments or emit Permission State.
 */
export function assessAttentionCandidateObservationDeclaredPermissionInterpretationPolicy(
  bindingAssessment: AttentionCandidateObservationPermissionContextBindingAssessment,
  policyByBindingKey: ReadonlyMap<
    string,
    AttentionObservationDeclaredPermissionInterpretationPolicyInput
  >
): AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment {
  const candidate_key = bindingAssessment.candidate_key;

  const empty = (
    status: AttentionObservationDeclaredPermissionInterpretationPolicyCandidateStatus
  ): AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment => {
    const assessment: AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment =
      {
        candidate_key,
        permission_context_binding_assessment: bindingAssessment,
        status,
        binding_policy_assessments: [],
        has_explicit_declared_permission_interpretation_policies: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
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
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED" ||
    bindingAssessment.permission_context_bindings.length === 0
  ) {
    return empty("NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED");
  }

  const binding_policy_assessments =
    bindingAssessment.permission_context_bindings.map((binding) =>
      assessBindingPolicy(binding, policyByBindingKey)
    );

  for (let i = 0; i < binding_policy_assessments.length; i++) {
    const binding = bindingAssessment.permission_context_bindings[i]!;
    const policyAssessment = binding_policy_assessments[i]!;
    if (
      policyAssessment.permission_context_binding_key !== binding.key ||
      policyAssessment.candidate_key !== binding.candidate_key ||
      policyAssessment.observation_need_key !== binding.observation_need_key ||
      policyAssessment.capability_requirement_set_key !==
        binding.capability_requirement_set_key ||
      policyAssessment.permission_actor_entity_id !==
        binding.permission_actor_entity_id ||
      policyAssessment.permission_intervention_id !==
        binding.permission_intervention_id
    ) {
      throw new Error(
        `Declared Permission Interpretation Policy binding lineage mismatch for candidate ${candidate_key}`
      );
    }
  }

  const assessment: AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment =
    {
      candidate_key,
      permission_context_binding_assessment: bindingAssessment,
      status: "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT",
      binding_policy_assessments,
      has_explicit_declared_permission_interpretation_policies:
        hasAnyExplicitPolicy(binding_policy_assessments),
      model_limitations: [
        ...ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
      ],
    };
  assertCandidateAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyCandidateExplicitPolicies(
  assessments: AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_explicit_declared_permission_interpretation_policies) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Explicit Declared Permission Interpretation Policy composition.
 * Preserves GROUND-087 Candidate order and per-Candidate binding order.
 * Does not consume GROUND-088 or produce Permission State.
 */
export function buildAttentionObservationDeclaredPermissionInterpretationPolicySet(
  input: AttentionObservationDeclaredPermissionInterpretationPolicyEvalInput
): AttentionObservationDeclaredPermissionInterpretationPolicySetAssessment {
  const normalizedSpecification =
    normalizeAttentionObservationDeclaredPermissionInterpretationPolicySpecification(
      input.permission_context_binding_set,
      input.specification
    );

  const policyByBindingKey = new Map(
    normalizedSpecification.policies.map((entry) => [
      entry.permission_context_binding_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.permission_context_binding_set.candidate_assessments.map(
      (bindingAssessment) =>
        assessAttentionCandidateObservationDeclaredPermissionInterpretationPolicy(
          bindingAssessment,
          policyByBindingKey
        )
    );

  return {
    permission_context_binding_set: input.permission_context_binding_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_declared_permission_interpretation_policies:
      hasAnyCandidateExplicitPolicies(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
    ],
  };
}
