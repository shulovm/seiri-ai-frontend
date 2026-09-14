import { temporalInstantKey, compareTemporalInstants } from "../temporal.js";
/**
 * Reality Core v0.7 — Declared Resource Availability
 * Source Aggregation Readiness Basis (GROUND-182).
 *
 * Pure composition of:
 *   GROUND-179 current per-source Availability Evidence State Set
 *   + GROUND-181 Aggregation Readiness Policy Set
 *
 * GROUND-181 nests exact GROUND-180 Aggregation Policy (members + operator);
 * GROUND-180 is not a separate semantic input.
 *
 * Answers only whether every selected availability source member has
 * exactly one current resolved GROUND-179 evidence State at evaluation_at.
 *
 * MUST NOT reopen raw availability declaration arrays for semantics,
 * availability active-at helpers, availability Assessment aggregates,
 * ProjectState / Result / ANY-ALL execution / Resource Readiness / OE.
 *
 * readiness HOLDS ≠ Aggregation Result HOLDS ≠ AVAILABLE
 * CONTRADICTING is resolved — not readiness failure
 * MISSING ≠ CONTRADICTING
 * BASIS_PRESENT ≠ readiness HOLDS
 * no short-circuit materialization
 * unselected current sources ignored for Basis identity
 */

import type {
  DeclaredResourceAvailabilityPerSourceEvidenceState,
  DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment,
  DeclaredResourceAvailabilityPerSourceEvidenceStateValue,
} from "./declared-resource-availability-per-source-evidence-state-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationPolicy,
} from "./declared-resource-availability-source-aggregation-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicy,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicyResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment,
} from "./declared-resource-availability-source-aggregation-readiness-policy-types.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationReadinessBasis,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisEvalInput,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisModelLimitation,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisStatus,
  DeclaredResourceAvailabilitySourceAggregationReadinessCondition,
  DeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessment,
} from "./declared-resource-availability-source-aggregation-readiness-basis-types.js";

export const DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS: DeclaredResourceAvailabilitySourceAggregationReadinessBasisModelLimitation[] =
  [
    "AVAILABILITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED",
    "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED",
    "NO_CURRENT_AVAILABILITY_EVIDENCE_CANONICALIZATION_NOT_MODELED",
    "AVAILABILITY_SOURCE_PRIORITY_NOT_MODELED",
    "AVAILABILITY_SOURCE_AUTHORITY_WEIGHTING_NOT_MODELED",
    "AVAILABILITY_DECLARATION_SUPERSESSION_NOT_MODELED",
    "OBJECTIVE_RESOURCE_AVAILABILITY_TRUTH_NOT_MODELED",
    "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
    "RESOURCE_RESERVATION_SEMANTIC_EXTENSION_NOT_MODELED",
    "RESERVATION_AWARE_FREE_QUANTITY_NOT_MODELED",
    "EFFECTIVE_RESOURCE_AVAILABILITY_NOT_MODELED",
    "EFFECTIVE_POTENTIAL_CONTRIBUTION_NOT_MODELED",
    "QUANTITY_AVAILABILITY_HETEROGENEOUS_COMPOSITION_NOT_MODELED",
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

const NONE_TOKEN = "NONE";
const MISSING_TOKEN = "MISSING";

const SUPPORTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING" as const;
const CONTRADICTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING" as const;

const CONDITION_HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION_HOLDS" as const;
const CONDITION_DOES_NOT_HOLD =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD" as const;

const STATUS_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" as const;
const STATUS_NO_READINESS_POLICY =
  "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const STATUS_BASIS_PRESENT =
  "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT" as const;

const MEMBER_PRESENT_AND_RESOLVED =
  "CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE_PRESENT_AND_RESOLVED" as const;
const MEMBER_MISSING =
  "MISSING_CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE" as const;

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function assertKnownCanonicalValue(
  value: DeclaredResourceAvailabilityPerSourceEvidenceStateValue
): DeclaredResourceAvailabilityPerSourceEvidenceStateValue {
  switch (value) {
    case SUPPORTING:
    case CONTRADICTING:
      return value;
    default: {
      const _exhaustive: never = value;
      void _exhaustive;
      throw new Error(
        `Unknown GROUND-179 Declared Resource Availability per-source evidence State value: ${String(value)}`
      );
    }
  }
}

/**
 * Per-member readiness assessment identity segment.
 * Same condition with different member current lineage remains distinct.
 */
export function declaredResourceAvailabilitySourceAggregationReadinessMemberAssessmentKey(params: {
  availability_declaration_id: string;
  current_source_evidence_state_key: string | null;
  current_source_evidence_state_value: DeclaredResourceAvailabilityPerSourceEvidenceStateValue | null;
  status: DeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessment["status"];
  is_present: boolean;
  is_resolved: boolean;
}): string {
  return [
    params.availability_declaration_id,
    params.current_source_evidence_state_key ?? MISSING_TOKEN,
    params.current_source_evidence_state_value ?? NONE_TOKEN,
    params.status,
    params.is_present ? "true" : "false",
    params.is_resolved ? "true" : "false",
  ].join("|");
}

export function buildCanonicalDeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessmentSetKey(
  memberAssessments: readonly DeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessment[]
): string {
  // Preserve GROUND-180 selected member order — do not re-sort by status.
  const keys = memberAssessments.map((assessment) =>
    declaredResourceAvailabilitySourceAggregationReadinessMemberAssessmentKey({
      availability_declaration_id: assessment.availability_declaration_id,
      current_source_evidence_state_key:
        assessment.current_source_evidence_state_key,
      current_source_evidence_state_value:
        assessment.current_source_evidence_state_value,
      status: assessment.status,
      is_present: assessment.is_present,
      is_resolved: assessment.is_resolved,
    })
  );
  return keys.length > 0 ? keys.join(",") : "none";
}

/**
 * Conceptual identity:
 * declared-resource-availability-source-aggregation-readiness-basis|
 * resourceDeclarationId|evaluationAt|
 * ground180AggregationPolicyKey|ground181ReadinessPolicyKey|
 * readinessRule|operator|
 * canonicalSelectedMemberIds|
 * canonicalMemberCurrentStateLineage|
 * condition
 *
 * Unselected GROUND-179 sources must NOT enter this key.
 */
export function declaredResourceAvailabilitySourceAggregationReadinessBasisKey(params: {
  resource_declaration_id: string;
  evaluation_at: string;
  availability_source_aggregation_policy_key: string;
  availability_source_aggregation_readiness_policy_key: string;
  readiness_rule: DeclaredResourceAvailabilitySourceAggregationReadinessPolicy["rule"];
  operator: DeclaredResourceAvailabilitySourceAggregationPolicy["operator"];
  selected_availability_declaration_ids: readonly string[];
  member_assessments: readonly DeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessment[];
  condition: DeclaredResourceAvailabilitySourceAggregationReadinessCondition;
}): string {
  return [
    "declared-resource-availability-source-aggregation-readiness-basis",
    params.resource_declaration_id,
    temporalInstantKey(params.evaluation_at),
    params.availability_source_aggregation_policy_key,
    params.availability_source_aggregation_readiness_policy_key,
    params.readiness_rule,
    params.operator,
    params.selected_availability_declaration_ids.join(","),
    buildCanonicalDeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessmentSetKey(
      params.member_assessments
    ),
    params.condition,
  ].join("|");
}

function assertNestedAggregationPolicyLineage(
  readinessPolicy: DeclaredResourceAvailabilitySourceAggregationReadinessPolicy,
  aggregationPolicy: DeclaredResourceAvailabilitySourceAggregationPolicy
): void {
  if (
    aggregationPolicy.key !==
    readinessPolicy.availability_source_aggregation_policy_key
  ) {
    throw new Error(
      `Malformed GROUND-181 Readiness Policy lineage: aggregation-policy key mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (
    aggregationPolicy.resource_declaration_id !==
    readinessPolicy.resource_declaration_id
  ) {
    throw new Error(
      `Malformed GROUND-181 Readiness Policy lineage: ResourceDeclaration mismatch for readiness policy ${readinessPolicy.key}`
    );
  }
  if (aggregationPolicy.selected_availability_declaration_ids.length === 0) {
    throw new Error(
      `Malformed GROUND-180 Aggregation Policy lineage: empty selected member set for readiness policy ${readinessPolicy.key}`
    );
  }
}

function indexCurrentStatesByAvailabilityDeclarationId(
  evidenceStateSet: DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment
): Map<string, DeclaredResourceAvailabilityPerSourceEvidenceState> {
  const byDeclarationId = new Map<
    string,
    DeclaredResourceAvailabilityPerSourceEvidenceState
  >();

  for (const state of evidenceStateSet.source_evidence_states) {
    if (compareTemporalInstants(state.evaluation_at, evidenceStateSet.evaluation_at) !== 0) {
      throw new Error(
        `Malformed GROUND-179 Set: source State evaluation_at ${state.evaluation_at} diverges from Set evaluation_at ${evidenceStateSet.evaluation_at}`
      );
    }
    assertKnownCanonicalValue(state.value);
    if (byDeclarationId.has(state.availability_declaration_id)) {
      throw new Error(
        `Duplicate current GROUND-179 source State for availability declaration ${state.availability_declaration_id}`
      );
    }
    byDeclarationId.set(state.availability_declaration_id, state);
  }

  return byDeclarationId;
}

function classifySelectedMemberReadiness(
  availabilityDeclarationId: string,
  expectedResourceDeclarationId: string,
  state: DeclaredResourceAvailabilityPerSourceEvidenceState | null
): DeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessment {
  if (state === null) {
    return {
      availability_declaration_id: availabilityDeclarationId,
      status: MEMBER_MISSING,
      current_source_evidence_state_key: null,
      current_source_evidence_state_value: null,
      is_present: false,
      is_resolved: false,
    };
  }

  if (state.availability_declaration_id !== availabilityDeclarationId) {
    throw new Error(
      `Malformed GROUND-179 join: availability_declaration_id mismatch for selected member ${availabilityDeclarationId}`
    );
  }
  if (state.resource_declaration_id !== expectedResourceDeclarationId) {
    throw new Error(
      `Malformed cross-input: current GROUND-179 State for availability declaration ${availabilityDeclarationId} has ResourceDeclaration ${state.resource_declaration_id}, expected ${expectedResourceDeclarationId}`
    );
  }

  const value = assertKnownCanonicalValue(state.value);
  return {
    availability_declaration_id: availabilityDeclarationId,
    status: MEMBER_PRESENT_AND_RESOLVED,
    current_source_evidence_state_key: state.key,
    current_source_evidence_state_value: value,
    is_present: true,
    is_resolved: true,
  };
}

function buildReadinessBasis(params: {
  evaluation_at: string;
  readinessPolicy: DeclaredResourceAvailabilitySourceAggregationReadinessPolicy;
  aggregationPolicy: DeclaredResourceAvailabilitySourceAggregationPolicy;
  statesByDeclarationId: Map<
    string,
    DeclaredResourceAvailabilityPerSourceEvidenceState
  >;
}): DeclaredResourceAvailabilitySourceAggregationReadinessBasis {
  const { readinessPolicy, aggregationPolicy, evaluation_at } = params;
  assertNestedAggregationPolicyLineage(readinessPolicy, aggregationPolicy);

  const selectedIds = aggregationPolicy.selected_availability_declaration_ids;
  const member_assessments: DeclaredResourceAvailabilitySourceAggregationReadinessMemberAssessment[] =
    [];

  for (const availabilityDeclarationId of selectedIds) {
    const state =
      params.statesByDeclarationId.get(availabilityDeclarationId) ?? null;
    member_assessments.push(
      classifySelectedMemberReadiness(
        availabilityDeclarationId,
        aggregationPolicy.resource_declaration_id,
        state
      )
    );
  }

  const allPresentAndResolved = member_assessments.every(
    (assessment) =>
      assessment.status === MEMBER_PRESENT_AND_RESOLVED &&
      assessment.is_present &&
      assessment.is_resolved
  );

  const condition: DeclaredResourceAvailabilitySourceAggregationReadinessCondition =
    allPresentAndResolved ? CONDITION_HOLDS : CONDITION_DOES_NOT_HOLD;

  return {
    key: declaredResourceAvailabilitySourceAggregationReadinessBasisKey({
      resource_declaration_id: aggregationPolicy.resource_declaration_id,
      evaluation_at,
      availability_source_aggregation_policy_key: aggregationPolicy.key,
      availability_source_aggregation_readiness_policy_key: readinessPolicy.key,
      readiness_rule: readinessPolicy.rule,
      operator: aggregationPolicy.operator,
      selected_availability_declaration_ids: selectedIds,
      member_assessments,
      condition,
    }),
    resource_declaration_id: aggregationPolicy.resource_declaration_id,
    evaluation_at,
    availability_source_aggregation_policy_key: aggregationPolicy.key,
    availability_source_aggregation_readiness_policy_key: readinessPolicy.key,
    readiness_rule: readinessPolicy.rule,
    operator: aggregationPolicy.operator,
    selected_availability_declaration_ids: [...selectedIds],
    member_assessments,
    condition,
  };
}

function assertResourceAssessmentInvariant(
  assessment: DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment
): void {
  if (assessment.status === STATUS_BASIS_PRESENT) {
    if (assessment.readiness_basis === null) {
      throw new Error(
        `Availability Source Aggregation Readiness Basis invariant violated: PRESENT requires non-null basis for resource ${assessment.resource_declaration_id}`
      );
    }
    if (!assessment.has_readiness_basis) {
      throw new Error(
        `Availability Source Aggregation Readiness Basis invariant violated: PRESENT requires has_readiness_basis true for resource ${assessment.resource_declaration_id}`
      );
    }
    if (assessment.readiness_condition === null) {
      throw new Error(
        `Availability Source Aggregation Readiness Basis invariant violated: PRESENT requires non-null condition for resource ${assessment.resource_declaration_id}`
      );
    }
    if (
      assessment.readiness_condition !== assessment.readiness_basis.condition
    ) {
      throw new Error(
        `Availability Source Aggregation Readiness Basis invariant violated: condition mismatch for resource ${assessment.resource_declaration_id}`
      );
    }
    return;
  }

  if (assessment.readiness_basis !== null) {
    throw new Error(
      `Availability Source Aggregation Readiness Basis invariant violated: non-PRESENT status requires null basis for resource ${assessment.resource_declaration_id}`
    );
  }
  if (assessment.has_readiness_basis) {
    throw new Error(
      `Availability Source Aggregation Readiness Basis invariant violated: non-PRESENT status requires has_readiness_basis false for resource ${assessment.resource_declaration_id}`
    );
  }
  if (assessment.readiness_condition !== null) {
    throw new Error(
      `Availability Source Aggregation Readiness Basis invariant violated: non-PRESENT status requires null condition for resource ${assessment.resource_declaration_id}`
    );
  }
}

function assessResource(params: {
  evaluation_at: string;
  readinessPolicyAssessment: DeclaredResourceAvailabilitySourceAggregationReadinessPolicyResourceAssessment;
  statesByDeclarationId: Map<
    string,
    DeclaredResourceAvailabilityPerSourceEvidenceState
  >;
}): DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment {
  const readinessPolicyAssessment = params.readinessPolicyAssessment;

  if (
    readinessPolicyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" ||
    readinessPolicyAssessment.availability_source_aggregation_policy_assessment
      .aggregation_policy === null
  ) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment =
      {
        resource_declaration_id:
          readinessPolicyAssessment.resource_declaration_id,
        availability_source_aggregation_readiness_policy_assessment:
          readinessPolicyAssessment,
        status: STATUS_NOT_APPLICABLE,
        readiness_basis: null,
        readiness_condition: null,
        has_readiness_basis: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  if (
    readinessPolicyAssessment.status ===
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY" ||
    readinessPolicyAssessment.readiness_policy === null
  ) {
    const assessment: DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment =
      {
        resource_declaration_id:
          readinessPolicyAssessment.resource_declaration_id,
        availability_source_aggregation_readiness_policy_assessment:
          readinessPolicyAssessment,
        status: STATUS_NO_READINESS_POLICY,
        readiness_basis: null,
        readiness_condition: null,
        has_readiness_basis: false,
      };
    assertResourceAssessmentInvariant(assessment);
    return assessment;
  }

  const readinessPolicy = readinessPolicyAssessment.readiness_policy;
  const aggregationPolicy =
    readinessPolicy.availability_source_aggregation_policy;

  const readiness_basis = buildReadinessBasis({
    evaluation_at: params.evaluation_at,
    readinessPolicy,
    aggregationPolicy,
    statesByDeclarationId: params.statesByDeclarationId,
  });

  const assessment: DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment =
    {
      resource_declaration_id: readinessPolicyAssessment.resource_declaration_id,
      availability_source_aggregation_readiness_policy_assessment:
        readinessPolicyAssessment,
      status: STATUS_BASIS_PRESENT,
      readiness_basis,
      readiness_condition: readiness_basis.condition,
      has_readiness_basis: true,
    };
  assertResourceAssessmentInvariant(assessment);
  return assessment;
}

/**
 * Build current Declared Resource Availability Source Aggregation Readiness Basis Set.
 *
 * evaluation_at from GROUND-179 only.
 * Materialize every selected member. No ANY/ALL execution.
 */
export function buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet(
  input: DeclaredResourceAvailabilitySourceAggregationReadinessBasisEvalInput
): DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment {
  if (!input.per_source_availability_evidence_state_set) {
    throw new Error("per_source_availability_evidence_state_set is required");
  }
  if (!input.availability_source_aggregation_readiness_policy_set) {
    throw new Error(
      "availability_source_aggregation_readiness_policy_set is required"
    );
  }

  const evidenceStateSet = input.per_source_availability_evidence_state_set;
  const readinessPolicySet =
    input.availability_source_aggregation_readiness_policy_set;

  if (
    typeof evidenceStateSet.evaluation_at !== "string" ||
    evidenceStateSet.evaluation_at.length === 0
  ) {
    throw new Error(
      "GROUND-179 per-source Availability Evidence State Set requires non-empty evaluation_at"
    );
  }
  if (!Array.isArray(evidenceStateSet.source_evidence_states)) {
    throw new Error(
      "GROUND-179 per-source Availability Evidence State Set requires source_evidence_states array"
    );
  }
  if (!Array.isArray(readinessPolicySet.resource_assessments)) {
    throw new Error(
      "GROUND-181 Aggregation Readiness Policy Set requires resource_assessments array"
    );
  }

  const evaluation_at = evidenceStateSet.evaluation_at;
  const statesByDeclarationId =
    indexCurrentStatesByAvailabilityDeclarationId(evidenceStateSet);

  const resource_assessments: DeclaredResourceAvailabilitySourceAggregationReadinessBasisResourceAssessment[] =
    [...readinessPolicySet.resource_assessments]
      .sort((a, b) =>
        compareStrings(a.resource_declaration_id, b.resource_declaration_id)
      )
      .map((readinessPolicyAssessment) =>
        assessResource({
          evaluation_at,
          readinessPolicyAssessment,
          statesByDeclarationId,
        })
      );

  const readiness_bases = resource_assessments
    .map((assessment) => assessment.readiness_basis)
    .filter(
      (
        basis
      ): basis is DeclaredResourceAvailabilitySourceAggregationReadinessBasis =>
        basis !== null
    );

  let has_readiness_condition_holds = false;
  let has_readiness_condition_does_not_hold = false;
  for (const basis of readiness_bases) {
    if (basis.condition === CONDITION_HOLDS) {
      has_readiness_condition_holds = true;
    } else if (basis.condition === CONDITION_DOES_NOT_HOLD) {
      has_readiness_condition_does_not_hold = true;
    }
  }

  return {
    per_source_availability_evidence_state_set: evidenceStateSet,
    availability_source_aggregation_readiness_policy_set: readinessPolicySet,
    evaluation_at,
    resource_assessments,
    readiness_bases,
    has_readiness_bases: readiness_bases.length > 0,
    has_readiness_condition_holds,
    has_readiness_condition_does_not_hold,
    model_limitations:
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
  };
}
