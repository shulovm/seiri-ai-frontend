/**
 * Reality Core v0.7 — Declared Resource Availability
 * Per-source Evidence State (GROUND-179).
 *
 * Pure deterministic normalization of currently active
 * ResourceAvailabilityDeclaration SOURCE ASSERTIONs at evaluation_at.
 *
 * Proposition: DECLARED_RESOURCE_AVAILABILITY_AT_EVALUATION_INSTANT
 *
 * AVAILABLE → EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING
 * UNAVAILABLE → EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING
 *
 * Must not mutate ProjectState. Must not import GROUND-177/155/137/139 builders,
 * Reservation, free quantity, deliverability, Resource Ready, OE, or aggregation.
 *
 * SUPPORTING ≠ objectively available
 * CONTRADICTING ≠ objectively unavailable
 * empty Set ≠ UNAVAILABLE ≠ UNRESOLVED_NO_CURRENT (later aggregate layer)
 * expired/future ≠ negative evidence
 * CONTESTED is descriptive Assessment only — not a per-source State
 * no ANY/ALL / majority / latest / authority wins
 */

import type {
  ReferenceDeclarer,
  ResourceAvailabilityDeclaration,
  ResourceAvailabilityStatus,
} from "../types.js";
import { isResourceAvailabilityActiveAt } from "./resource-core.js";
import type {
  DeclaredResourceAvailabilityPerSourceEvidenceResourceAssessment,
  DeclaredResourceAvailabilityPerSourceEvidenceState,
  DeclaredResourceAvailabilityPerSourceEvidenceStateEvalInput,
  DeclaredResourceAvailabilityPerSourceEvidenceStateModelLimitation,
  DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment,
  DeclaredResourceAvailabilityPerSourceEvidenceStateValue,
} from "./declared-resource-availability-per-source-evidence-state-types.js";

export const DECLARED_RESOURCE_AVAILABILITY_AT_EVALUATION_INSTANT_PROPOSITION =
  "DECLARED_RESOURCE_AVAILABILITY_AT_EVALUATION_INSTANT" as const;

export const DECLARED_RESOURCE_AVAILABILITY_PER_SOURCE_EVIDENCE_STATE_MODEL_LIMITATIONS: DeclaredResourceAvailabilityPerSourceEvidenceStateModelLimitation[] =
  [
    "OBJECTIVE_RESOURCE_AVAILABILITY_TRUTH_NOT_MODELED",
    "AVAILABILITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
    "AVAILABILITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED",
    "AVAILABILITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED",
    "AVAILABILITY_SOURCE_PRIORITY_NOT_MODELED",
    "AVAILABILITY_SOURCE_AUTHORITY_WEIGHTING_NOT_MODELED",
    "AVAILABILITY_DECLARATION_SUPERSESSION_NOT_MODELED",
    "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_RESOURCE_AVAILABILITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "PHYSICAL_EVIDENCE_REQUIRED_DIMENSION_POLICY_NOT_MODELED",
    "PHYSICAL_EVIDENCE_DIMENSION_READINESS_NOT_MODELED",
    "DECLARED_POTENTIAL_CONTRIBUTION_VERIFICATION_NOT_MODELED",
    "PHYSICAL_DELIVERABILITY_NOT_MODELED",
    "REQUIREMENT_SATISFACTION_NOT_MODELED",
    "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CANONICAL_SUPPORTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING" as const;
const CANONICAL_CONTRADICTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING" as const;

/**
 * Conceptual identity:
 * declared-resource-availability-per-source-evidence-state|
 * resourceDeclarationId|evaluationAt|availabilityDeclarationId|
 * rawAvailabilityStatus|canonicalStateValue
 */
export function declaredResourceAvailabilityPerSourceEvidenceStateKey(params: {
  resource_declaration_id: string;
  evaluation_at: string;
  availability_declaration_id: string;
  raw_availability_status: ResourceAvailabilityStatus;
  value: DeclaredResourceAvailabilityPerSourceEvidenceStateValue;
}): string {
  return [
    "declared-resource-availability-per-source-evidence-state",
    params.resource_declaration_id,
    params.evaluation_at,
    params.availability_declaration_id,
    params.raw_availability_status,
    params.value,
  ].join("|");
}

export function deriveDeclaredResourceAvailabilityPerSourceEvidenceStateValue(
  raw_availability_status: ResourceAvailabilityStatus
): DeclaredResourceAvailabilityPerSourceEvidenceStateValue {
  switch (raw_availability_status) {
    case "AVAILABLE":
      return CANONICAL_SUPPORTING;
    case "UNAVAILABLE":
      return CANONICAL_CONTRADICTING;
    default: {
      const _exhaustive: never = raw_availability_status;
      void _exhaustive;
      throw new Error(
        `Unknown ResourceAvailabilityDeclaration status: ${String(raw_availability_status)}`
      );
    }
  }
}

function assertNonEmptyEvaluationAt(evaluation_at: string): string {
  if (typeof evaluation_at !== "string" || evaluation_at.length === 0) {
    throw new Error(
      "Declared Resource Availability Per-source Evidence State requires non-empty evaluation_at"
    );
  }
  return evaluation_at;
}

function assertDeclarationShape(
  declaration: ResourceAvailabilityDeclaration
): void {
  if (
    typeof declaration.id !== "string" ||
    declaration.id.length === 0
  ) {
    throw new Error(
      "Malformed ResourceAvailabilityDeclaration: missing id"
    );
  }
  if (
    typeof declaration.resource_declaration_id !== "string" ||
    declaration.resource_declaration_id.length === 0
  ) {
    throw new Error(
      `Malformed ResourceAvailabilityDeclaration ${declaration.id}: missing resource_declaration_id`
    );
  }
  if (
    typeof declaration.valid_from !== "string" ||
    declaration.valid_from.length === 0
  ) {
    throw new Error(
      `Malformed ResourceAvailabilityDeclaration ${declaration.id}: missing valid_from`
    );
  }
  if (
    declaration.valid_until !== null &&
    typeof declaration.valid_until !== "string"
  ) {
    throw new Error(
      `Malformed ResourceAvailabilityDeclaration ${declaration.id}: invalid valid_until`
    );
  }
  if (
    declaration.status !== "AVAILABLE" &&
    declaration.status !== "UNAVAILABLE"
  ) {
    throw new Error(
      `Malformed ResourceAvailabilityDeclaration ${declaration.id}: unknown status ${String(
        declaration.status
      )}`
    );
  }
  if (
    declaration.declared_by === null ||
    typeof declaration.declared_by !== "object"
  ) {
    throw new Error(
      `Malformed ResourceAvailabilityDeclaration ${declaration.id}: missing declared_by`
    );
  }
}

function assertNoDuplicateDeclarationIds(
  declarations: ResourceAvailabilityDeclaration[]
): void {
  const seen = new Set<string>();
  for (const declaration of declarations) {
    if (seen.has(declaration.id)) {
      throw new Error(
        `Malformed Declared Resource Availability input: duplicate availability_declaration.id ${declaration.id}`
      );
    }
    seen.add(declaration.id);
  }
}

function cloneDeclarer(declared_by: ReferenceDeclarer): ReferenceDeclarer {
  return { ...declared_by };
}

function buildPerSourceState(
  declaration: ResourceAvailabilityDeclaration,
  evaluation_at: string
): DeclaredResourceAvailabilityPerSourceEvidenceState {
  const value = deriveDeclaredResourceAvailabilityPerSourceEvidenceStateValue(
    declaration.status
  );
  return {
    key: declaredResourceAvailabilityPerSourceEvidenceStateKey({
      resource_declaration_id: declaration.resource_declaration_id,
      evaluation_at,
      availability_declaration_id: declaration.id,
      raw_availability_status: declaration.status,
      value,
    }),
    resource_declaration_id: declaration.resource_declaration_id,
    evaluation_at,
    availability_declaration_id: declaration.id,
    declared_by: cloneDeclarer(declaration.declared_by),
    raw_availability_status: declaration.status,
    valid_from: declaration.valid_from,
    valid_until: declaration.valid_until,
    value,
  };
}

function compareStates(
  a: DeclaredResourceAvailabilityPerSourceEvidenceState,
  b: DeclaredResourceAvailabilityPerSourceEvidenceState
): number {
  if (a.resource_declaration_id !== b.resource_declaration_id) {
    return a.resource_declaration_id < b.resource_declaration_id ? -1 : 1;
  }
  if (a.availability_declaration_id !== b.availability_declaration_id) {
    return a.availability_declaration_id < b.availability_declaration_id
      ? -1
      : 1;
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function buildResourceAssessments(
  evaluation_at: string,
  states: DeclaredResourceAvailabilityPerSourceEvidenceState[]
): DeclaredResourceAvailabilityPerSourceEvidenceResourceAssessment[] {
  const byResource = new Map<
    string,
    DeclaredResourceAvailabilityPerSourceEvidenceState[]
  >();

  for (const state of states) {
    const existing = byResource.get(state.resource_declaration_id);
    if (existing) {
      existing.push(state);
    } else {
      byResource.set(state.resource_declaration_id, [state]);
    }
  }

  return [...byResource.keys()]
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    .map((resource_declaration_id) => {
      const source_evidence_states = [
        ...(byResource.get(resource_declaration_id) ?? []),
      ].sort(compareStates);
      return {
        resource_declaration_id,
        evaluation_at,
        active_availability_declaration_ids: source_evidence_states.map(
          (state) => state.availability_declaration_id
        ),
        source_evidence_states,
        has_supporting_source_evidence_states: source_evidence_states.some(
          (state) => state.value === CANONICAL_SUPPORTING
        ),
        has_contradicting_source_evidence_states: source_evidence_states.some(
          (state) => state.value === CANONICAL_CONTRADICTING
        ),
      };
    });
}

/**
 * Build current per-source Declared Resource Availability Evidence State Set.
 *
 * API choice: direct ResourceAvailabilityDeclaration[] + evaluation_at.
 * Narrower than ProjectState; Assessment four-status enum is not an authority.
 * Does not synthesize ResourceDeclaration domains with zero declarations —
 * only groups resources that have ≥1 currently active source State.
 */
export function buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet(
  input: DeclaredResourceAvailabilityPerSourceEvidenceStateEvalInput
): DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment {
  const evaluation_at = assertNonEmptyEvaluationAt(input.evaluation_at);
  const declarations = input.resource_availability_declarations;

  if (!Array.isArray(declarations)) {
    throw new Error(
      "Declared Resource Availability Per-source Evidence State requires resource_availability_declarations array"
    );
  }

  assertNoDuplicateDeclarationIds(declarations);

  const source_evidence_states: DeclaredResourceAvailabilityPerSourceEvidenceState[] =
    [];

  for (const declaration of declarations) {
    assertDeclarationShape(declaration);

    if (!isResourceAvailabilityActiveAt(declaration, evaluation_at)) {
      continue;
    }

    source_evidence_states.push(
      buildPerSourceState(declaration, evaluation_at)
    );
  }

  source_evidence_states.sort(compareStates);

  const resource_assessments = buildResourceAssessments(
    evaluation_at,
    source_evidence_states
  );

  return {
    evaluation_at,
    resource_assessments,
    source_evidence_states,
    has_supporting_source_evidence_states: source_evidence_states.some(
      (state) => state.value === CANONICAL_SUPPORTING
    ),
    has_contradicting_source_evidence_states: source_evidence_states.some(
      (state) => state.value === CANONICAL_CONTRADICTING
    ),
    model_limitations:
      DECLARED_RESOURCE_AVAILABILITY_PER_SOURCE_EVIDENCE_STATE_MODEL_LIMITATIONS,
  };
}
