/**
 * Reality Core v0.7 — Attention Observation Resource Required-Amount
 * Semantic Declaration (GROUND-171).
 *
 * Pure composition of:
 *   GROUND-132 Observation Resource Requirement Set
 *   + explicit Required Amount Semantics Specification
 *
 * Declaration only. Does NOT interpret GROUND-157 raw relations.
 * Does NOT emit sufficiency / satisfaction / polarity / Resource Ready.
 *
 * Must not import GROUND-169/168/167/166/165/164/163/161/157/155/153,
 * Availability, Reservation, or project persistence.
 *
 * POINT ≠ EXACT role; RANGE ≠ TARGET/tolerance; unit ≠ STOCK/FLOW
 * explicit UNDECLARED_QUANTITY_KIND ≠ declaration absence
 *
 * Architecture invariant (GROUND-170):
 * GROUND-155 declared potential contribution is a singleton authoritative
 * specification, not a multi-source evidence claim. No repair required.
 */

import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "./attention-observation-resource-requirement-types.js";
import type {
  AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment,
  AttentionObservationResourceRequiredAmountQuantityKind,
  AttentionObservationResourceRequiredAmountRole,
  AttentionObservationResourceRequiredAmountSemanticDeclaration,
  AttentionObservationResourceRequiredAmountSemanticDeclarationEvalInput,
  AttentionObservationResourceRequiredAmountSemanticDeclarationInput,
  AttentionObservationResourceRequiredAmountSemanticDeclarationModelLimitation,
  AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment,
  AttentionObservationResourceRequiredAmountSemanticDeclarationSetAssessment,
  AttentionObservationResourceRequiredAmountSemanticDeclarationSpecification,
} from "./attention-observation-resource-required-amount-semantic-declaration-types.js";

export const ATTENTION_OBSERVATION_RESOURCE_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_MODEL_LIMITATIONS: AttentionObservationResourceRequiredAmountSemanticDeclarationModelLimitation[] =
  [
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_POLICY_NOT_MODELED",
    "REQUIRED_AMOUNT_RELATION_INTERPRETATION_BASIS_NOT_MODELED",
    "CANONICAL_REQUIRED_AMOUNT_RELATION_EVIDENCE_STATE_NOT_MODELED",
    "REQUIRED_AMOUNT_RANGE_ROLE_SEMANTICS_NOT_INTERPRETED",
    "FLOW_TIME_BASIS_NOT_MODELED",
    "FLOW_INTEGRATION_WINDOW_NOT_MODELED",
    "RESOURCE_DIVISIBILITY_NOT_MODELED",
    "RESOURCE_QUANTITY_CARDINALITY_NOT_MODELED",
    "RESOURCE_UNIT_CONVERSION_NOT_MODELED",
    "RESOURCE_SCOPE_SUBSUMPTION_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "RESOURCE_AVAILABILITY_INTERPRETATION_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "LOGICAL_PHYSICAL_EVIDENCE_CONVERGENCE_NOT_MODELED",
    "PHYSICAL_RESOURCE_BINDING_GROUP_NOT_MODELED",
    "RESOURCE_FUNGIBILITY_NOT_MODELED",
    "RESOURCE_SUBSTITUTION_NOT_MODELED",
    "CROSS_BINDING_QUANTITY_COMPOSITION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

/**
 * GROUND-170 architecture invariant retained as documentation constant.
 * GROUND-155 remains a singleton authoritative specification.
 */
export const GROUND_155_SINGLETON_AUTHORITATIVE_SPECIFICATION_INVARIANT =
  "GROUND-155 declared potential contribution is a singleton authoritative specification, not a multi-source evidence claim" as const;

const AMOUNT_ROLES = new Set<AttentionObservationResourceRequiredAmountRole>([
  "MINIMUM_REQUIRED_AMOUNT",
  "TARGET_REQUIRED_AMOUNT",
  "EXACT_REQUIRED_AMOUNT",
]);

const QUANTITY_KINDS = new Set<AttentionObservationResourceRequiredAmountQuantityKind>([
  "STOCK_QUANTITY",
  "FLOW_QUANTITY",
  "UNDECLARED_QUANTITY_KIND",
]);

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Conceptual identity:
 * attention-observation-resource-required-amount-semantic-declaration|
 * candidateKey|observationNeedKey|capabilityRequirementSetKey|RESOURCE_READINESS|
 * observationResourceRequirementKey|amountRole|quantityKind
 */
export function attentionObservationResourceRequiredAmountSemanticDeclarationKey(params: {
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  observation_resource_requirement_key: string;
  amount_role: AttentionObservationResourceRequiredAmountRole;
  quantity_kind: AttentionObservationResourceRequiredAmountQuantityKind;
}): string {
  return [
    "attention-observation-resource-required-amount-semantic-declaration",
    params.candidate_key,
    params.observation_need_key,
    params.capability_requirement_set_key,
    "RESOURCE_READINESS",
    params.observation_resource_requirement_key,
    params.amount_role,
    params.quantity_kind,
  ].join("|");
}

function normalizeAmountRole(
  value: AttentionObservationResourceRequiredAmountRole
): AttentionObservationResourceRequiredAmountRole {
  if (!AMOUNT_ROLES.has(value)) {
    throw new Error(
      `Unknown AttentionObservationResourceRequiredAmountRole: ${String(value)}`
    );
  }
  return value;
}

function normalizeQuantityKind(
  value: AttentionObservationResourceRequiredAmountQuantityKind
): AttentionObservationResourceRequiredAmountQuantityKind {
  if (!QUANTITY_KINDS.has(value)) {
    throw new Error(
      `Unknown AttentionObservationResourceRequiredAmountQuantityKind: ${String(value)}`
    );
  }
  return value;
}

function semanticSignature(params: {
  amount_role: AttentionObservationResourceRequiredAmountRole;
  quantity_kind: AttentionObservationResourceRequiredAmountQuantityKind;
}): string {
  return `${params.amount_role}|${params.quantity_kind}`;
}

/**
 * Normalize specification declarations against exact GROUND-132 Requirement keys.
 * Duplicate identical → one. Same Requirement different semantics → reject.
 * Unknown / stale Requirement key → reject.
 */
export function normalizeAttentionObservationResourceRequiredAmountSemanticDeclarationSpecification(
  specification: AttentionObservationResourceRequiredAmountSemanticDeclarationSpecification,
  requirementByKey: ReadonlyMap<string, AttentionObservationResourceRequirement>
): AttentionObservationResourceRequiredAmountSemanticDeclarationInput[] {
  if (!specification || !Array.isArray(specification.declarations)) {
    throw new Error("specification.declarations must be an array");
  }

  const byRequirementKey = new Map<
    string,
    AttentionObservationResourceRequiredAmountSemanticDeclarationInput
  >();

  for (const entry of specification.declarations) {
    if (
      !entry.observation_resource_requirement_key ||
      entry.observation_resource_requirement_key.trim().length === 0
    ) {
      throw new Error(
        "observation_resource_requirement_key must be non-empty"
      );
    }

    if (!requirementByKey.has(entry.observation_resource_requirement_key)) {
      throw new Error(
        `Unknown or stale Observation Resource Requirement key ${entry.observation_resource_requirement_key}`
      );
    }

    const amount_role = normalizeAmountRole(entry.amount_role);
    const quantity_kind = normalizeQuantityKind(entry.quantity_kind);
    const normalized: AttentionObservationResourceRequiredAmountSemanticDeclarationInput =
      {
        observation_resource_requirement_key:
          entry.observation_resource_requirement_key,
        amount_role,
        quantity_kind,
      };

    const existing = byRequirementKey.get(
      entry.observation_resource_requirement_key
    );
    if (existing) {
      if (
        semanticSignature(existing) !== semanticSignature(normalized)
      ) {
        throw new Error(
          `Conflicting Required Amount Semantic Declarations for Observation Resource Requirement ${entry.observation_resource_requirement_key}`
        );
      }
      continue;
    }

    byRequirementKey.set(
      entry.observation_resource_requirement_key,
      normalized
    );
  }

  return [...byRequirementKey.values()].sort((a, b) =>
    compareStrings(
      a.observation_resource_requirement_key,
      b.observation_resource_requirement_key
    )
  );
}

function buildDeclaration(
  requirement: AttentionObservationResourceRequirement,
  amount_role: AttentionObservationResourceRequiredAmountRole,
  quantity_kind: AttentionObservationResourceRequiredAmountQuantityKind
): AttentionObservationResourceRequiredAmountSemanticDeclaration {
  return {
    key: attentionObservationResourceRequiredAmountSemanticDeclarationKey({
      candidate_key: requirement.candidate_key,
      observation_need_key: requirement.observation_need_key,
      capability_requirement_set_key: requirement.capability_requirement_set_key,
      observation_resource_requirement_key: requirement.key,
      amount_role,
      quantity_kind,
    }),
    candidate_key: requirement.candidate_key,
    observation_need_key: requirement.observation_need_key,
    capability_requirement_set_key: requirement.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: requirement.key,
    amount_role,
    quantity_kind,
  };
}

function assertRequirementAssessmentInvariant(
  assessment: AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment
): void {
  if (
    assessment.status ===
    "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT"
  ) {
    if (assessment.semantic_declaration === null) {
      throw new Error(
        `Required Amount Semantic Declaration invariant violated: PRESENT requires non-null declaration for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    if (!assessment.has_explicit_required_amount_semantic_declaration) {
      throw new Error(
        `Required Amount Semantic Declaration invariant violated: PRESENT requires boolean true for requirement ${assessment.observation_resource_requirement_key}`
      );
    }
    return;
  }

  if (assessment.semantic_declaration !== null) {
    throw new Error(
      `Required Amount Semantic Declaration invariant violated: NO_DECLARATION requires null declaration for requirement ${assessment.observation_resource_requirement_key}`
    );
  }
  if (assessment.has_explicit_required_amount_semantic_declaration) {
    throw new Error(
      `Required Amount Semantic Declaration invariant violated: NO_DECLARATION requires boolean false for requirement ${assessment.observation_resource_requirement_key}`
    );
  }
}

function assessRequirement(
  requirement: AttentionObservationResourceRequirement,
  declarationsByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationResourceRequiredAmountSemanticDeclarationInput
  >
): AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment {
  const declared = declarationsByRequirementKey.get(requirement.key);

  if (!declared) {
    const assessment: AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment =
      {
        observation_resource_requirement_key: requirement.key,
        resource_requirement: requirement,
        status: "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
        semantic_declaration: null,
        has_explicit_required_amount_semantic_declaration: false,
      };
    assertRequirementAssessmentInvariant(assessment);
    return assessment;
  }

  const assessment: AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment =
    {
      observation_resource_requirement_key: requirement.key,
      resource_requirement: requirement,
      status: "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT",
      semantic_declaration: buildDeclaration(
        requirement,
        declared.amount_role,
        declared.quantity_kind
      ),
      has_explicit_required_amount_semantic_declaration: true,
    };
  assertRequirementAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Pure per-Candidate Required Amount Semantic Declaration assessment.
 */
export function assessAttentionCandidateObservationResourceRequiredAmountSemanticDeclaration(
  resourceRequirementAssessment: AttentionCandidateObservationResourceRequirementSetAssessment,
  declarationsByRequirementKey: ReadonlyMap<
    string,
    AttentionObservationResourceRequiredAmountSemanticDeclarationInput
  >
): AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment {
  const requirement_semantic_declaration_assessments =
    resourceRequirementAssessment.resource_requirements.map((requirement) =>
      assessRequirement(requirement, declarationsByRequirementKey)
    );

  return {
    candidate_key: resourceRequirementAssessment.candidate_key,
    resource_requirement_set_assessment: resourceRequirementAssessment,
    requirement_semantic_declaration_assessments,
    has_explicit_required_amount_semantic_declarations:
      requirement_semantic_declaration_assessments.some(
        (assessment) =>
          assessment.has_explicit_required_amount_semantic_declaration
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_RESOURCE_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_MODEL_LIMITATIONS,
    ],
  };
}

function indexRequirements(
  observationResourceRequirementSet: AttentionObservationResourceRequirementSetAssessment
): Map<string, AttentionObservationResourceRequirement> {
  const index = new Map<string, AttentionObservationResourceRequirement>();

  for (const candidate of observationResourceRequirementSet.candidate_assessments) {
    for (const requirement of candidate.resource_requirements) {
      if (index.has(requirement.key)) {
        throw new Error(
          `GROUND-171 invariant violated: duplicate Observation Resource Requirement key ${requirement.key}`
        );
      }
      if (requirement.candidate_key !== candidate.candidate_key) {
        throw new Error(
          `GROUND-171 invariant violated: requirement candidate mismatch for ${requirement.key}`
        );
      }
      index.set(requirement.key, requirement);
    }
  }

  return index;
}

/**
 * Pure set-level Required Amount Semantic Declaration.
 * Preserves GROUND-132 AttentionCandidate / Requirement order.
 */
export function buildAttentionObservationResourceRequiredAmountSemanticDeclarationSet(
  input: AttentionObservationResourceRequiredAmountSemanticDeclarationEvalInput
): AttentionObservationResourceRequiredAmountSemanticDeclarationSetAssessment {
  const requirementByKey = indexRequirements(
    input.observation_resource_requirement_set
  );
  const normalizedDeclarations =
    normalizeAttentionObservationResourceRequiredAmountSemanticDeclarationSpecification(
      input.specification,
      requirementByKey
    );
  const declarationsByRequirementKey = new Map(
    normalizedDeclarations.map((entry) => [
      entry.observation_resource_requirement_key,
      entry,
    ])
  );

  const candidate_assessments =
    input.observation_resource_requirement_set.candidate_assessments.map(
      (candidateAssessment) =>
        assessAttentionCandidateObservationResourceRequiredAmountSemanticDeclaration(
          candidateAssessment,
          declarationsByRequirementKey
        )
    );

  return {
    observation_resource_requirement_set:
      input.observation_resource_requirement_set,
    specification: input.specification,
    candidate_assessments,
    has_explicit_required_amount_semantic_declarations:
      candidate_assessments.some(
        (assessment) =>
          assessment.has_explicit_required_amount_semantic_declarations
      ),
    model_limitations: [
      ...ATTENTION_OBSERVATION_RESOURCE_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_MODEL_LIMITATIONS,
    ],
  };
}
