/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility AUTHORITY
 * Observation-Context Binding (GROUND-108).
 *
 * Pure composition of GROUND-048 Explicit Capability Requirement Set
 * + ProjectState (authority-holder RealityEntity existence validation only)
 * + explicit AUTHORITY Observation-Context Binding Specification.
 *
 * Binding identifies:
 *   observation context ↔ authority_holder_entity_id × authority_power × governance_scope
 *
 * Must not call declared Authority assessment / Authority provenance / Permission evaluator.
 * Must not consume GROUND-084–106 Operational Eligibility semantics.
 *
 * Forbidden: StatePatch, applyPatch, saveProject, wall-clock, Authority assessment,
 * declaration ids, evaluation instant, OE AUTHORITY source.
 *
 * Binding ≠ declaration presence ≠ Authority holds ≠ effective Authority
 * Multiple bindings ≠ conflict / ANY / ALL
 */

import type {
  AttentionCandidateObservationCapabilityRequirementAssessment,
  AttentionObservationCapabilityRequirement,
  AttentionObservationCapabilityRequirementSetAssessment,
} from "./attention-observation-capability-requirement-types.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";
import { governanceScopeKey } from "./governance-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBinding,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingEvalInput,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingModelLimitation,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification,
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingStatus,
} from "./attention-observation-operational-eligibility-authority-observation-context-binding-types.js";
import type { AuthorityPower, GovernanceScope, ProjectState } from "../types.js";

export {
  buildAttentionObservationCapabilityRequirementSetKey,
  canonicalizeCapabilityRequirementKeys,
} from "./attention-observation-capability-requirement-set-identity.js";

export const ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingModelLimitation[] =
  [
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DECLARED_ASSESSMENT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_PROVENANCE_ASSESSMENT_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED",
    "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "EFFECTIVE_AUTHORITY_NOT_MODELED",
    "EFFECTIVE_PERMISSION_NOT_MODELED_FOR_EXECUTION_DOMAIN",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const AUTHORITY_POWERS: readonly AuthorityPower[] = [
  "ESTABLISH_REFERENCE",
  "GOVERN_OBJECTIVE",
  "DECLARE_IMPACT",
  "DECLARE_IMPACT_MEASURE",
  "AUTHORIZE_INTERVENTION",
];

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Conceptual identity:
 * attention-observation-operational-eligibility-authority-observation-context-binding|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|AUTHORITY|
 * authorityHolderEntityId|authorityPower|canonicalGovernanceScopeKey
 */
export function attentionObservationOperationalEligibilityAuthorityObservationContextBindingKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  authorityHolderEntityId: string,
  authorityPower: AuthorityPower,
  governanceScopeKeyValue: string
): string {
  return [
    "attention-observation-operational-eligibility-authority-observation-context-binding",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    "AUTHORITY",
    authorityHolderEntityId,
    authorityPower,
    governanceScopeKeyValue,
  ].join("|");
}

interface RequirementSetContext {
  candidateAssessment: AttentionCandidateObservationCapabilityRequirementAssessment;
  observationNeedKey: string;
  requirements: AttentionObservationCapabilityRequirement[];
  capabilityRequirementKeys: string[];
  capabilityRequirementSetKey: string;
}

function collectRequirementSetContexts(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment
): Map<string, RequirementSetContext> {
  const byCandidateKey = new Map<string, RequirementSetContext>();

  for (const candidate of capabilityRequirementSet.candidate_requirements) {
    if (byCandidateKey.has(candidate.candidate_key)) {
      throw new Error(
        `Ambiguous Capability Requirement set context for candidate ${candidate.candidate_key}`
      );
    }

    const requirements =
      candidate.capability_requirement_basis?.requirements ?? [];
    const observationNeedKey =
      candidate.capability_requirement_basis?.observation_need_key ?? "";
    const capabilityRequirementKeys = canonicalizeCapabilityRequirementKeys(
      requirements.map((r) => r.key)
    );
    const capabilityRequirementSetKey =
      requirements.length === 0
        ? ""
        : buildAttentionObservationCapabilityRequirementSetKey(
            candidate.candidate_key,
            observationNeedKey,
            capabilityRequirementKeys
          );

    byCandidateKey.set(candidate.candidate_key, {
      candidateAssessment: candidate,
      observationNeedKey,
      requirements,
      capabilityRequirementKeys,
      capabilityRequirementSetKey,
    });
  }

  return byCandidateKey;
}

function assertNonEmptyId(value: string, label: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`${label} must be non-empty`);
  }
  return value;
}

function assertValidAuthorityPower(power: AuthorityPower): AuthorityPower {
  if (!AUTHORITY_POWERS.includes(power)) {
    throw new Error(`Unknown AuthorityPower: ${String(power)}`);
  }
  return power;
}

function scopeJson(scope: GovernanceScope): string {
  return JSON.stringify(scope);
}

function scopesStructurallyEqual(a: GovernanceScope, b: GovernanceScope): boolean {
  return scopeJson(a) === scopeJson(b);
}

/**
 * Read-only authority-holder RealityEntity existence + project consistency validation.
 * Does not inspect Authority declarations or other governance records.
 */
export function assertAuthorityHolderEntityExists(
  projectState: ProjectState,
  authorityHolderEntityId: string
): void {
  const holderId = assertNonEmptyId(
    authorityHolderEntityId,
    "authority_holder_entity_id"
  );
  const entity = projectState.reality_entities.find(
    (entry) => entry.id === holderId
  );
  if (!entity) {
    throw new Error(
      `Unknown authority_holder_entity_id: ${holderId} not found in project reality_entities`
    );
  }
  if (entity.project_id !== projectState.project.id) {
    throw new Error(
      `Cross-project authority_holder_entity_id: ${holderId} belongs to project ${entity.project_id}, not ${projectState.project.id}`
    );
  }
}

function bindingTripleKey(
  holderEntityId: string,
  power: AuthorityPower,
  scopeKey: string
): string {
  return `${holderEntityId}|${power}|${scopeKey}`;
}

function compareBindingInputs(
  a: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput,
  b: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput
): number {
  const holderCmp = compareStrings(
    a.authority_holder_entity_id,
    b.authority_holder_entity_id
  );
  if (holderCmp !== 0) {
    return holderCmp;
  }
  const powerCmp = compareStrings(a.authority_power, b.authority_power);
  if (powerCmp !== 0) {
    return powerCmp;
  }
  return compareStrings(
    governanceScopeKey(a.governance_scope),
    governanceScopeKey(b.governance_scope)
  );
}

/**
 * Validates and normalizes AUTHORITY Observation-Context Binding specification.
 *
 * Exact duplicate holder×power×scope → one.
 * Distinct triples retained (0..many). No conflict / winner inference.
 * Unknown Candidate / zero-Requirement / no planning → reject.
 * Unknown holder entity / cross-project → reject.
 * Contradictory scope representation for same triple → reject.
 * Specification order has no semantic meaning.
 *
 * Does not read authority_declarations or other governance assessments.
 */
export function normalizeAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification(
  capabilityRequirementSet: AttentionObservationCapabilityRequirementSetAssessment,
  projectState: ProjectState,
  specification: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification
): AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification {
  const contexts = collectRequirementSetContexts(capabilityRequirementSet);
  const byCandidateKey = new Map<
    string,
    Map<
      string,
      AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput
    >
  >();

  for (const entry of specification.bindings) {
    if (!entry.candidate_key || entry.candidate_key.trim().length === 0) {
      throw new Error("Candidate key must be non-empty");
    }

    const context = contexts.get(entry.candidate_key);
    if (!context) {
      throw new Error(
        `Candidate ${entry.candidate_key} not found in explicit capability requirement set`
      );
    }

    if (
      context.candidateAssessment.status ===
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
      context.candidateAssessment.capability_requirement_basis === null
    ) {
      throw new Error(
        `AUTHORITY Observation-Context Binding requires an Observation planning basis for candidate ${entry.candidate_key}`
      );
    }

    if (
      context.candidateAssessment.status ===
        "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED" ||
      !context.candidateAssessment.has_explicit_capability_requirements ||
      context.requirements.length === 0
    ) {
      throw new Error(
        `AUTHORITY Observation-Context Binding requires a non-empty Capability Requirement set for candidate ${entry.candidate_key}`
      );
    }

    const holderId = assertNonEmptyId(
      entry.authority_holder_entity_id,
      "authority_holder_entity_id"
    );
    const power = assertValidAuthorityPower(entry.authority_power);
    const scope = entry.governance_scope;
    const scopeKey = governanceScopeKey(scope);

    assertAuthorityHolderEntityExists(projectState, holderId);

    const normalized: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput =
      {
        candidate_key: entry.candidate_key,
        authority_holder_entity_id: holderId,
        authority_power: power,
        governance_scope: scope,
      };

    let candidateBindings = byCandidateKey.get(entry.candidate_key);
    if (!candidateBindings) {
      candidateBindings = new Map();
      byCandidateKey.set(entry.candidate_key, candidateBindings);
    }

    const tripleKey = bindingTripleKey(holderId, power, scopeKey);
    const existing = candidateBindings.get(tripleKey);
    if (existing === undefined) {
      candidateBindings.set(tripleKey, normalized);
    } else if (
      !scopesStructurallyEqual(existing.governance_scope, scope)
    ) {
      throw new Error(
        `Conflicting GovernanceScope representation for AUTHORITY Observation-Context Binding triple ${tripleKey} on candidate ${entry.candidate_key}`
      );
    }
  }

  const bindings: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput[] =
    [];
  const candidateKeys = [...byCandidateKey.keys()].sort(compareStrings);
  for (const candidateKey of candidateKeys) {
    const triples = [...byCandidateKey.get(candidateKey)!.values()].sort(
      compareBindingInputs
    );
    bindings.push(...triples);
  }

  return { bindings };
}

function assertBindingAssessmentInvariant(
  assessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment
): void {
  const expectedHas =
    assessment.authority_observation_context_bindings.length > 0;
  if (
    assessment.has_explicit_authority_observation_context_bindings !==
    expectedHas
  ) {
    throw new Error(
      `AUTHORITY Observation-Context Binding invariant violated: has_bindings mismatch for candidate ${assessment.candidate_key}`
    );
  }

  const expectedMultiple =
    assessment.authority_observation_context_bindings.length > 1;
  if (
    assessment.has_multiple_explicit_authority_observation_context_bindings !==
    expectedMultiple
  ) {
    throw new Error(
      `AUTHORITY Observation-Context Binding invariant violated: has_multiple mismatch for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status ===
      "EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_PRESENT" &&
    assessment.authority_observation_context_bindings.length === 0
  ) {
    throw new Error(
      `AUTHORITY Observation-Context Binding invariant violated: PRESENT requires non-empty bindings for candidate ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !==
      "EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_PRESENT" &&
    assessment.authority_observation_context_bindings.length !== 0
  ) {
    throw new Error(
      `AUTHORITY Observation-Context Binding invariant violated: non-present status requires empty bindings for candidate ${assessment.candidate_key}`
    );
  }
}

function buildBinding(
  context: RequirementSetContext,
  input: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput
): AttentionObservationOperationalEligibilityAuthorityObservationContextBinding {
  const scopeKey = governanceScopeKey(input.governance_scope);
  return {
    key: attentionObservationOperationalEligibilityAuthorityObservationContextBindingKey(
      context.candidateAssessment.candidate_key,
      context.observationNeedKey,
      context.capabilityRequirementSetKey,
      input.authority_holder_entity_id,
      input.authority_power,
      scopeKey
    ),
    candidate_key: context.candidateAssessment.candidate_key,
    observation_need_key: context.observationNeedKey,
    capability_requirement_set_key: context.capabilityRequirementSetKey,
    dimension: "AUTHORITY",
    authority_holder_entity_id: input.authority_holder_entity_id,
    authority_power: input.authority_power,
    governance_scope: input.governance_scope,
    governance_scope_key: scopeKey,
  };
}

/**
 * Pure per-AttentionCandidate AUTHORITY Observation-Context Binding assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_PRESENT
 *
 * Does not assess Authority declarations / polarity / OE.
 */
export function assessAttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBinding(
  capabilityRequirementAssessment: AttentionCandidateObservationCapabilityRequirementAssessment,
  bindingsForCandidate: readonly AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput[],
  context: RequirementSetContext
): AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment {
  const candidate_key = capabilityRequirementAssessment.candidate_key;

  const notApplicable = (
    status: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingStatus
  ): AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment => {
    const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment =
      {
        candidate_key,
        capability_requirement_assessment: capabilityRequirementAssessment,
        status,
        authority_observation_context_bindings: [],
        has_explicit_authority_observation_context_bindings: false,
        has_multiple_explicit_authority_observation_context_bindings: false,
        model_limitations: [
          ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
        ],
      };
    assertBindingAssessmentInvariant(assessment);
    return assessment;
  };

  if (
    capabilityRequirementAssessment.status ===
    "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return notApplicable("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS");
  }

  if (
    capabilityRequirementAssessment.status ===
      "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED" ||
    !capabilityRequirementAssessment.has_explicit_capability_requirements ||
    capabilityRequirementAssessment.capability_requirement_basis === null ||
    context.requirements.length === 0
  ) {
    return notApplicable("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  }

  if (bindingsForCandidate.length === 0) {
    return notApplicable(
      "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    );
  }

  const authority_observation_context_bindings = bindingsForCandidate.map(
    (input) => buildBinding(context, input)
  );

  const assessment: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment =
    {
      candidate_key,
      capability_requirement_assessment: capabilityRequirementAssessment,
      status: "EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_PRESENT",
      authority_observation_context_bindings,
      has_explicit_authority_observation_context_bindings: true,
      has_multiple_explicit_authority_observation_context_bindings:
        authority_observation_context_bindings.length > 1,
      model_limitations: [
        ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
      ],
    };
  assertBindingAssessmentInvariant(assessment);
  return assessment;
}

function hasAnyExplicitBindings(
  assessments: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_explicit_authority_observation_context_bindings) {
      return true;
    }
  }
  return false;
}

function hasAnyMultipleBindings(
  assessments: AttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBindingAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (
      assessment.has_multiple_explicit_authority_observation_context_bindings
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level AUTHORITY Observation-Context Binding composition.
 * Preserves GROUND-048 AttentionCandidate order.
 * Does not inspect Authority declarations or produce Authority State / OE.
 */
export function buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
  input: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingEvalInput
): AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment {
  const contexts = collectRequirementSetContexts(
    input.capability_requirement_set
  );

  const normalizedSpecification =
    normalizeAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification(
      input.capability_requirement_set,
      input.project_state,
      input.specification
    );

  const bindingsByCandidateKey = new Map<
    string,
    AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput[]
  >();
  for (const binding of normalizedSpecification.bindings) {
    const existing = bindingsByCandidateKey.get(binding.candidate_key);
    if (existing) {
      existing.push(binding);
    } else {
      bindingsByCandidateKey.set(binding.candidate_key, [binding]);
    }
  }

  const candidate_assessments =
    input.capability_requirement_set.candidate_requirements.map(
      (capabilityRequirementAssessment) => {
        const context = contexts.get(
          capabilityRequirementAssessment.candidate_key
        );
        if (!context) {
          throw new Error(
            `Capability Requirement set context missing for candidate ${capabilityRequirementAssessment.candidate_key}`
          );
        }
        return assessAttentionCandidateObservationOperationalEligibilityAuthorityObservationContextBinding(
          capabilityRequirementAssessment,
          bindingsByCandidateKey.get(
            capabilityRequirementAssessment.candidate_key
          ) ?? [],
          context
        );
      }
    );

  return {
    capability_requirement_set: input.capability_requirement_set,
    specification: normalizedSpecification,
    candidate_assessments,
    has_explicit_authority_observation_context_bindings:
      hasAnyExplicitBindings(candidate_assessments),
    has_multiple_explicit_authority_observation_context_bindings:
      hasAnyMultipleBindings(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
    ],
  };
}
