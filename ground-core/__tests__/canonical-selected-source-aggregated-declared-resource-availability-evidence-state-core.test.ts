/**
 * GROUND-187 — Observation Core CXLI / Canonical Selected-source Aggregated
 * Declared Resource Availability Evidence State Foundation
 *
 * GROUND-186 Interpretation Basis → Canonical Evidence State (normalization only).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import type {
  ResourceAvailabilityDeclaration,
  ResourceDeclaration,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet } from "../reality/declared-resource-availability-per-source-evidence-state-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationPolicySet } from "../reality/declared-resource-availability-source-aggregation-policy-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet } from "../reality/declared-resource-availability-source-aggregation-readiness-policy-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet } from "../reality/declared-resource-availability-source-aggregation-readiness-basis-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationResultSet } from "../reality/declared-resource-availability-source-aggregation-result-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet } from "../reality/declared-resource-availability-source-aggregation-result-interpretation-policy-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSet } from "../reality/declared-resource-availability-source-aggregation-result-interpretation-basis-core.js";
import type { DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment } from "../reality/declared-resource-availability-source-aggregation-result-interpretation-basis-types.js";
import {
  CANONICAL_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_PROPOSITION,
  CANONICAL_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_STATE_MODEL_LIMITATIONS,
  buildCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSet,
  canonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateKey,
  isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateApplicable,
  isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateContradicting,
  isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResolved,
  isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSupporting,
  isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateUnresolved,
} from "../reality/canonical-selected-source-aggregated-declared-resource-availability-evidence-state-core.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const RD = "a1111111-1111-4111-8111-111111111111";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const ENTITY = "e1111111-1111-4111-8111-111111111111";
const EVAL_AT = "2026-09-02T12:00:00.000Z";
const EVAL_AT_B = "2026-09-03T12:00:00.000Z";
const FROM = "2026-09-01T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

const RULE =
  "REQUIRE_ALL_SELECTED_AVAILABILITY_SOURCE_EVIDENCE_STATES_PRESENT_AND_RESOLVED_BEFORE_AGGREGATION" as const;
const RESULT_HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const RESULT_DNH =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;
const INTERP_SUPPORTING =
  "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;
const INTERP_CONTRADICTING =
  "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;

const CANONICAL_NA =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY" as const;
const CANONICAL_NO_READINESS =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY" as const;
const CANONICAL_NO_RESULT =
  "UNRESOLVED_NO_CURRENT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD" as const;
const CANONICAL_NO_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY" as const;
const CANONICAL_NO_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT" as const;
const CANONICAL_SUPPORTING =
  "EXPLICITLY_INTERPRETED_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING" as const;
const CANONICAL_CONTRADICTING =
  "EXPLICITLY_INTERPRETED_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING" as const;

type MappingSpec = Array<{
  source_result_value: typeof RESULT_HOLDS | typeof RESULT_DNH;
  interpretation: typeof INTERP_SUPPORTING | typeof INTERP_CONTRADICTING;
}>;

function resource(
  overrides: Partial<ResourceDeclaration> & { id: string }
): ResourceDeclaration {
  return {
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY,
    resource_key: "SENSOR_POWER",
    unit: "WH",
    scope: { kind: "UNSCOPED" },
    resource_entity_id: null,
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function availability(
  overrides: Partial<ResourceAvailabilityDeclaration> & { id: string }
): ResourceAvailabilityDeclaration {
  return {
    project_id: PROJECT_ID,
    resource_declaration_id: RD,
    status: "AVAILABLE",
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function make186(params: {
  selected: string[];
  operator: "ANY" | "ALL";
  current: Array<{ id: string; status: "AVAILABLE" | "UNAVAILABLE" }>;
  mappings?: MappingSpec;
  withPolicy?: boolean;
  withAggregation?: boolean;
  withReadiness?: boolean;
  evaluation_at?: string;
}): DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment {
  const decls = [
    availability({ id: AVAIL_A }),
    availability({
      id: AVAIL_B,
      status: "UNAVAILABLE",
      declared_by: { kind: "system", label: "b" },
    }),
  ];
  const set180 = buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: [resource({ id: RD })],
    resource_availability_declarations: decls,
    specification: {
      policies:
        params.withAggregation === false
          ? []
          : [
              {
                resource_declaration_id: RD,
                selected_availability_declaration_ids: params.selected,
                operator: params.operator,
              },
            ],
    },
  });
  const aggregationKey = set180.aggregation_policies[0]?.key;
  const set181 = buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet({
    availability_source_aggregation_policy_set: set180,
    specification: {
      policies:
        params.withReadiness === false || !aggregationKey
          ? []
          : [
              {
                availability_source_aggregation_policy_key: aggregationKey,
                rule: RULE,
              },
            ],
    },
  });
  const evidence = buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet({
    resource_availability_declarations: params.current.map((entry) =>
      availability({
        id: entry.id,
        status: entry.status,
        declared_by:
          entry.id === AVAIL_A
            ? { kind: "human", label: "ops" }
            : { kind: "system", label: entry.id },
      })
    ),
    evaluation_at: params.evaluation_at ?? EVAL_AT,
  });
  const set182 = buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet({
    per_source_availability_evidence_state_set: evidence,
    availability_source_aggregation_readiness_policy_set: set181,
  });
  const set183 = buildDeclaredResourceAvailabilitySourceAggregationResultSet({
    availability_source_aggregation_readiness_basis_set: set182,
  });
  const set185 =
    buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet({
      availability_source_aggregation_policy_set: set180,
      specification: {
        policies:
          params.withPolicy === false || !aggregationKey
            ? []
            : [
                {
                  availability_source_aggregation_policy_key: aggregationKey,
                  mappings: params.mappings ?? [],
                },
              ],
      },
    });
  return buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSet({
    availability_source_aggregation_result_set: set183,
    availability_source_aggregation_result_interpretation_policy_set: set185,
  });
}

function build187(
  basisSet: DeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSetAssessment
) {
  return buildCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSet({
    availability_source_aggregation_result_interpretation_basis_set: basisSet,
  });
}

function pair(params: {
  selected: string[];
  operator: "ANY" | "ALL";
  current: Array<{ id: string; status: "AVAILABLE" | "UNAVAILABLE" }>;
  mappings?: MappingSpec;
  withPolicy?: boolean;
  withAggregation?: boolean;
  withReadiness?: boolean;
  evaluation_at?: string;
}) {
  return build187(make186(params));
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function coreSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/canonical-selected-source-aggregated-declared-resource-availability-evidence-state-core.ts"
    ),
    "utf8"
  );
}

function typesSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/canonical-selected-source-aggregated-declared-resource-availability-evidence-state-types.ts"
    ),
    "utf8"
  );
}

describe("GROUND-187 Canonical Selected-source Aggregated Declared Resource Availability Evidence State", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("proposition and model limitations fixed", () => {
    assert.equal(
      CANONICAL_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_PROPOSITION,
      "SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE"
    );
    assert.equal(
      CANONICAL_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_STATE_MODEL_LIMITATIONS[0],
      "AVAILABILITY_SOURCE_PRIORITY_NOT_MODELED"
    );
    assert.equal(
      CANONICAL_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_STATE_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("structural NOT_APPLICABLE → canonical NA; helpers", () => {
    const set = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withAggregation: false,
      withPolicy: false,
    });
    const assessment = set.resource_assessments[0]!;
    assert.equal(assessment.canonical_state.value, CANONICAL_NA);
    assert.equal(assessment.is_applicable, false);
    assert.equal(assessment.is_resolved, false);
    assert.equal(assessment.is_unresolved, false);
    assert.equal(
      assessment.canonical_state.availability_source_aggregation_policy_key,
      null
    );
    assert.equal(assessment.canonical_state.interpretation_basis_key, null);
    assert.equal(set.has_not_applicable_states, true);
  });

  it("no readiness Policy → unresolved applicable", () => {
    const set = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withReadiness: false,
      withPolicy: false,
    });
    const assessment = set.resource_assessments[0]!;
    assert.equal(assessment.canonical_state.value, CANONICAL_NO_READINESS);
    assert.equal(assessment.is_applicable, true);
    assert.equal(assessment.is_resolved, false);
    assert.equal(assessment.is_unresolved, true);
    assert.ok(
      assessment.canonical_state.availability_source_aggregation_policy_key
    );
  });

  it("readiness DNH → unresolved, not CONTRADICTING", () => {
    const set = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    assert.equal(
      set.resource_assessments[0]!.canonical_state.value,
      CANONICAL_NO_RESULT
    );
    assert.equal(set.resource_assessments[0]!.is_unresolved, true);
    assert.equal(set.has_contradicting_states, false);
  });

  it("no Interpretation Policy → unresolved NO_POLICY", () => {
    const set = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withPolicy: false,
    });
    assert.equal(
      set.resource_assessments[0]!.canonical_state.value,
      CANONICAL_NO_POLICY
    );
  });

  it("explicit empty / partial no-mapping → NO_MAPPING ≠ NO_POLICY", () => {
    const empty = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [],
    });
    const partialMiss = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    assert.equal(
      empty.resource_assessments[0]!.canonical_state.value,
      CANONICAL_NO_MAPPING
    );
    assert.equal(
      partialMiss.resource_assessments[0]!.canonical_state.value,
      CANONICAL_NO_MAPPING
    );
  });

  it("natural SUPPORTING / CONTRADICTING", () => {
    const supporting = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    const contradicting = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    assert.equal(
      supporting.resource_assessments[0]!.canonical_state.value,
      CANONICAL_SUPPORTING
    );
    assert.equal(
      contradicting.resource_assessments[0]!.canonical_state.value,
      CANONICAL_CONTRADICTING
    );
    assert.ok(
      supporting.resource_assessments[0]!.canonical_state
        .interpretation_basis_key
    );
    assert.equal(supporting.resource_assessments[0]!.is_resolved, true);
  });

  it("unusual HOLDS→CONTRADICTING / DNH→SUPPORTING preserved", () => {
    const holdsContra = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    const dnhSupport = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    assert.equal(
      holdsContra.resource_assessments[0]!.canonical_state.value,
      CANONICAL_CONTRADICTING
    );
    assert.equal(
      dnhSupport.resource_assessments[0]!.canonical_state.value,
      CANONICAL_SUPPORTING
    );
  });

  it("ALL mixed DNH + unusual SUPPORTING → canonical SUPPORTING", () => {
    const set = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "UNAVAILABLE" },
      ],
      mappings: [
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    assert.equal(
      set.resource_assessments[0]!.canonical_state.value,
      CANONICAL_SUPPORTING
    );
  });

  it("same SUPPORTING / different Basis lineage → distinct State", () => {
    const mappings: MappingSpec = [
      {
        source_result_value: RESULT_HOLDS,
        interpretation: INTERP_SUPPORTING,
      },
    ];
    const mixed = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "UNAVAILABLE" },
      ],
      mappings,
    });
    const allSupport = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "AVAILABLE" },
      ],
      mappings,
    });
    assert.equal(
      mixed.resource_assessments[0]!.canonical_state.value,
      CANONICAL_SUPPORTING
    );
    assert.equal(
      allSupport.resource_assessments[0]!.canonical_state.value,
      CANONICAL_SUPPORTING
    );
    assert.notEqual(
      mixed.resource_assessments[0]!.canonical_state.key,
      allSupport.resource_assessments[0]!.canonical_state.key
    );
  });

  it("same CONTRADICTING / different Basis lineage → distinct", () => {
    const mappings: MappingSpec = [
      {
        source_result_value: RESULT_DNH,
        interpretation: INTERP_CONTRADICTING,
      },
    ];
    const mixed = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "UNAVAILABLE" },
      ],
      mappings,
    });
    const allContra = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
      current: [
        { id: AVAIL_A, status: "UNAVAILABLE" },
        { id: AVAIL_B, status: "UNAVAILABLE" },
      ],
      mappings,
    });
    assert.equal(
      mixed.resource_assessments[0]!.canonical_state.value,
      CANONICAL_CONTRADICTING
    );
    assert.equal(
      allContra.resource_assessments[0]!.canonical_state.value,
      CANONICAL_CONTRADICTING
    );
    assert.notEqual(
      mixed.resource_assessments[0]!.canonical_state.key,
      allContra.resource_assessments[0]!.canonical_state.key
    );
  });

  it("partial vs total missing selected source → same canonical, distinct lineage", () => {
    const partial = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    const total = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    assert.equal(
      partial.resource_assessments[0]!.canonical_state.value,
      CANONICAL_NO_RESULT
    );
    assert.equal(
      total.resource_assessments[0]!.canonical_state.value,
      CANONICAL_NO_RESULT
    );
    assert.notEqual(
      partial.resource_assessments[0]!.canonical_state.key,
      total.resource_assessments[0]!.canonical_state.key
    );
    assert.notEqual(
      partial.resource_assessments[0]!.canonical_state
        .current_lineage_anchor_key,
      total.resource_assessments[0]!.canonical_state.current_lineage_anchor_key
    );
  });

  it("different evaluation_at / ANY vs ALL / member-set → distinct", () => {
    const mappings: MappingSpec = [
      {
        source_result_value: RESULT_HOLDS,
        interpretation: INTERP_SUPPORTING,
      },
    ];
    const a = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings,
      evaluation_at: EVAL_AT,
    });
    const b = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings,
      evaluation_at: EVAL_AT_B,
    });
    const anySet = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "AVAILABLE" },
      ],
      mappings,
    });
    const allSet = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "AVAILABLE" },
      ],
      mappings,
    });
    const one = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings,
    });
    const two = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "AVAILABLE" },
      ],
      mappings,
    });
    assert.notEqual(
      a.resource_assessments[0]!.canonical_state.key,
      b.resource_assessments[0]!.canonical_state.key
    );
    assert.notEqual(
      anySet.resource_assessments[0]!.canonical_state.key,
      allSet.resource_assessments[0]!.canonical_state.key
    );
    assert.notEqual(
      one.resource_assessments[0]!.canonical_state.key,
      two.resource_assessments[0]!.canonical_state.key
    );
  });

  it("empty-vs-absent Interpretation Policy → different canonical unresolved", () => {
    const absent = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withPolicy: false,
    });
    const empty = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [],
    });
    assert.equal(
      absent.resource_assessments[0]!.canonical_state.value,
      CANONICAL_NO_POLICY
    );
    assert.equal(
      empty.resource_assessments[0]!.canonical_state.value,
      CANONICAL_NO_MAPPING
    );
  });

  it("helpers: supporting/contradicting/applicable/unresolved", () => {
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateApplicable(
        CANONICAL_NA
      ),
      false
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateApplicable(
        CANONICAL_NO_READINESS
      ),
      true
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResolved(
        CANONICAL_SUPPORTING
      ),
      true
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResolved(
        CANONICAL_NA
      ),
      false
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateUnresolved(
        CANONICAL_NO_MAPPING
      ),
      true
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateUnresolved(
        CANONICAL_NA
      ),
      false
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateUnresolved(
        CANONICAL_SUPPORTING
      ),
      false
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSupporting(
        CANONICAL_SUPPORTING
      ),
      true
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateContradicting(
        CANONICAL_CONTRADICTING
      ),
      true
    );
    assert.equal(
      isCanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSupporting(
        CANONICAL_CONTRADICTING
      ),
      false
    );
  });

  it("one State per GROUND-186 assessment; NA still produces State", () => {
    const set = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withAggregation: false,
      withPolicy: false,
    });
    assert.equal(set.resource_assessments.length, 1);
    assert.equal(set.canonical_states.length, 1);
    assert.equal(set.canonical_states[0]!.value, CANONICAL_NA);
  });

  it("input immutability / deep-clone determinism", () => {
    const basisSet = make186({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    const snap = deepClone(basisSet);
    const a = build187(basisSet);
    assert.deepEqual(basisSet, snap);
    const b = build187(deepClone(basisSet));
    assert.equal(
      a.resource_assessments[0]!.canonical_state.key,
      b.resource_assessments[0]!.canonical_state.key
    );
  });

  it("no HOLDS recompute / 185/183/182/179 / MIXED / AVAILABLE / truth", () => {
    const core = coreSource();
    const types = typesSource();
    assert.ok(
      !/buildDeclaredResourceAvailabilitySourceAggregationResultSet/.test(core)
    );
    assert.ok(
      !/buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet/.test(
        core
      )
    );
    assert.ok(
      !/buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet/.test(
        core
      )
    );
    assert.ok(
      !/buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet/.test(core)
    );
    assert.ok(!/deriveDeclaredResourceAvailabilitySourceAggregationResultValue/.test(core));
    assert.ok(!/\|\s*"MIXED"|\|\s*"CONTESTED"/.test(types));
    assert.ok(!/\|\s*"AVAILABLE"|\|\s*"UNAVAILABLE"/.test(types));
    assert.ok(
      !/\|\s*"SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS"/.test(
        types
      )
    );
    assert.ok(
      !/\|\s*"SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"/.test(
        types
      )
    );
    assert.ok(!/^import .*ProjectState/m.test(core));
  });

  it("State key excludes AVAILABLE/UNAVAILABLE/READY", () => {
    const key =
      canonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateKey(
        {
          resource_declaration_id: RD,
          evaluation_at: EVAL_AT,
          availability_source_aggregation_policy_key: "agg",
          current_lineage_anchor_key: "lineage",
          interpretation_basis_key: "basis",
          ground186_status:
            "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT",
          value: CANONICAL_SUPPORTING,
        }
      );
    assert.ok(!/AVAILABLE|UNAVAILABLE|READY/.test(key));
  });

  it("evaluation_at: NA may be null; resolved inherits GROUND-186", () => {
    const na = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withAggregation: false,
      withPolicy: false,
    });
    const resolved = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    assert.equal(na.resource_assessments[0]!.canonical_state.evaluation_at, null);
    assert.equal(
      resolved.resource_assessments[0]!.canonical_state.evaluation_at,
      EVAL_AT
    );
  });
});
