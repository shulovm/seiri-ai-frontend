/**
 * GROUND-186 — Observation Core CXL / Declared Resource Availability
 * Source Aggregation Result Interpretation Basis Foundation
 *
 * GROUND-183 current Result + GROUND-185 stable Policy
 * → current Interpretation Basis (no canonical State).
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
import type { DeclaredResourceAvailabilitySourceAggregationResultSetAssessment } from "../reality/declared-resource-availability-source-aggregation-result-types.js";
import { buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet } from "../reality/declared-resource-availability-source-aggregation-result-interpretation-policy-core.js";
import type { DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment } from "../reality/declared-resource-availability-source-aggregation-result-interpretation-policy-types.js";
import {
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
  buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSet,
  declaredResourceAvailabilitySourceAggregationResultInterpretationBasisKey,
} from "../reality/declared-resource-availability-source-aggregation-result-interpretation-basis-core.js";
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

function make183(params: {
  selected: string[];
  operator: "ANY" | "ALL";
  current: Array<{ id: string; status: "AVAILABLE" | "UNAVAILABLE" }>;
  withAggregation?: boolean;
  withReadiness?: boolean;
  evaluation_at?: string;
}): DeclaredResourceAvailabilitySourceAggregationResultSetAssessment {
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
  return buildDeclaredResourceAvailabilitySourceAggregationResultSet({
    availability_source_aggregation_readiness_basis_set: set182,
  });
}

function make185(params: {
  selected: string[];
  operator: "ANY" | "ALL";
  withAggregation?: boolean;
  withPolicy?: boolean;
  mappings?: MappingSpec;
}): DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment {
  const set180 = buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: [resource({ id: RD })],
    resource_availability_declarations: [
      availability({ id: AVAIL_A }),
      availability({
        id: AVAIL_B,
        status: "UNAVAILABLE",
        declared_by: { kind: "system", label: "b" },
      }),
    ],
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
  return buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet({
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
}

function build186(params: {
  resultSet: DeclaredResourceAvailabilitySourceAggregationResultSetAssessment;
  policySet: DeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySetAssessment;
}) {
  return buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationBasisSet({
    availability_source_aggregation_result_set: params.resultSet,
    availability_source_aggregation_result_interpretation_policy_set:
      params.policySet,
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
  const resultSet = make183({
    selected: params.selected,
    operator: params.operator,
    current: params.current,
    withAggregation: params.withAggregation,
    withReadiness: params.withReadiness,
    evaluation_at: params.evaluation_at,
  });
  const policySet = make185({
    selected: params.selected,
    operator: params.operator,
    withAggregation: params.withAggregation,
    withPolicy: params.withPolicy,
    mappings: params.mappings,
  });
  return build186({ resultSet, policySet });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function coreSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-result-interpretation-basis-core.ts"
    ),
    "utf8"
  );
}

function typesSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-result-interpretation-basis-types.ts"
    ),
    "utf8"
  );
}

describe("GROUND-186 Declared Resource Availability Source Aggregation Result Interpretation Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed", () => {
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS[0],
      "CANONICAL_AGGREGATED_AVAILABILITY_EVIDENCE_STATE_NOT_MODELED"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("no aggregation Policy → NOT_APPLICABLE", () => {
    const set = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withAggregation: false,
      withPolicy: false,
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(set.resource_assessments[0]!.interpretation_basis, null);
  });

  it("no readiness Policy → UNRESOLVED", () => {
    const set = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withReadiness: false,
      withPolicy: false,
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
    );
  });

  it("readiness DNH → UNRESOLVED no current Result", () => {
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
      set.resource_assessments[0]!.status,
      "UNRESOLVED_NO_CURRENT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
    assert.equal(set.resource_assessments[0]!.interpretation_basis, null);
  });

  it("HOLDS / DNH + no Interpretation Policy → NO_POLICY", () => {
    const holds = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      withPolicy: false,
    });
    const dnh = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      withPolicy: false,
    });
    assert.equal(
      holds.resource_assessments[0]!.status,
      "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY"
    );
    assert.equal(
      dnh.resource_assessments[0]!.status,
      "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY"
    );
  });

  it("HOLDS / DNH + explicit empty Policy → NO_MAPPING (≠ NO_POLICY)", () => {
    const holds = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [],
    });
    const dnh = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      mappings: [],
    });
    assert.equal(
      holds.resource_assessments[0]!.status,
      "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
    assert.equal(
      dnh.resource_assessments[0]!.status,
      "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
  });

  it("partial HOLDS map: matching HOLDS PRESENT / DNH NO_MAPPING", () => {
    const matching = pair({
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
    const nonmatching = pair({
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
      matching.resource_assessments[0]!.status,
      "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_BASIS_PRESENT"
    );
    assert.equal(
      matching.interpretation_bases[0]!.interpretation,
      INTERP_SUPPORTING
    );
    assert.equal(
      nonmatching.resource_assessments[0]!.status,
      "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
  });

  it("partial DNH map: matching DNH PRESENT / HOLDS NO_MAPPING", () => {
    const matching = pair({
      selected: [AVAIL_A],
      operator: "ALL",
      current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    const nonmatching = pair({
      selected: [AVAIL_A],
      operator: "ALL",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    assert.equal(
      matching.interpretation_bases[0]!.interpretation,
      INTERP_CONTRADICTING
    );
    assert.equal(
      nonmatching.resource_assessments[0]!.status,
      "UNRESOLVED_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_RESULT"
    );
  });

  it("natural HOLDS→SUPPORTING / DNH→CONTRADICTING", () => {
    const holds = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    const dnh = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    assert.equal(holds.interpretation_bases[0]!.interpretation, INTERP_SUPPORTING);
    assert.equal(
      dnh.interpretation_bases[0]!.interpretation,
      INTERP_CONTRADICTING
    );
  });

  it("unusual HOLDS→CONTRADICTING / DNH→SUPPORTING preserved", () => {
    const holds = pair({
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
    const dnh = pair({
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
      holds.interpretation_bases[0]!.interpretation,
      INTERP_CONTRADICTING
    );
    assert.equal(dnh.interpretation_bases[0]!.interpretation, INTERP_SUPPORTING);
  });

  it("both→SUPPORTING / both→CONTRADICTING", () => {
    const supporting = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    const contradicting = pair({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_CONTRADICTING,
        },
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    assert.equal(
      supporting.interpretation_bases[0]!.interpretation,
      INTERP_SUPPORTING
    );
    assert.equal(
      contradicting.interpretation_bases[0]!.interpretation,
      INTERP_CONTRADICTING
    );
  });

  it("ALL mixed DNH + unusual DNH→SUPPORTING Policy preserves SUPPORTING", () => {
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
    assert.equal(set.interpretation_bases[0]!.current_result_value, RESULT_DNH);
    assert.equal(
      set.interpretation_bases[0]!.interpretation,
      INTERP_SUPPORTING
    );
    assert.equal(
      set.interpretation_bases[0]!.current_aggregation_result.operands.length,
      2
    );
  });

  it("ALL all-CONTRADICTING DNH same Policy → same target, distinct lineage vs mixed", () => {
    const mappings: MappingSpec = [
      {
        source_result_value: RESULT_DNH,
        interpretation: INTERP_SUPPORTING,
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
    assert.equal(mixed.interpretation_bases[0]!.interpretation, INTERP_SUPPORTING);
    assert.equal(
      allContra.interpretation_bases[0]!.interpretation,
      INTERP_SUPPORTING
    );
    assert.notEqual(
      mixed.interpretation_bases[0]!.key,
      allContra.interpretation_bases[0]!.key
    );
  });

  it("ANY mixed HOLDS + unusual HOLDS→CONTRADICTING preserves CONTRADICTING", () => {
    const set = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "UNAVAILABLE" },
      ],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    assert.equal(set.interpretation_bases[0]!.current_result_value, RESULT_HOLDS);
    assert.equal(
      set.interpretation_bases[0]!.interpretation,
      INTERP_CONTRADICTING
    );
  });

  it("same interpretation / different operand lineage → distinct Basis", () => {
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
    assert.equal(mixed.interpretation_bases[0]!.interpretation, INTERP_SUPPORTING);
    assert.equal(
      allSupport.interpretation_bases[0]!.interpretation,
      INTERP_SUPPORTING
    );
    assert.notEqual(
      mixed.interpretation_bases[0]!.key,
      allSupport.interpretation_bases[0]!.key
    );
  });

  it("different evaluation_at / ANY vs ALL / member-set → distinct Basis", () => {
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
    assert.notEqual(a.interpretation_bases[0]!.key, b.interpretation_bases[0]!.key);
    assert.notEqual(
      anySet.interpretation_bases[0]!.key,
      allSet.interpretation_bases[0]!.key
    );
    assert.notEqual(
      one.interpretation_bases[0]!.key,
      two.interpretation_bases[0]!.key
    );
  });

  it("structural cases do not inspect mapping contents", () => {
    const readinessDnh = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
        {
          source_result_value: RESULT_DNH,
          interpretation: INTERP_CONTRADICTING,
        },
      ],
    });
    assert.equal(
      readinessDnh.resource_assessments[0]!.status,
      "UNRESOLVED_NO_CURRENT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
  });

  it("input immutability / deep-clone", () => {
    const resultSet = make183({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
    });
    const policySet = make185({
      selected: [AVAIL_A],
      operator: "ANY",
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    const snap = {
      resultSet: deepClone(resultSet),
      policySet: deepClone(policySet),
    };
    const a = build186({ resultSet, policySet });
    assert.deepEqual(resultSet, snap.resultSet);
    assert.deepEqual(policySet, snap.policySet);
    const b = build186({
      resultSet: deepClone(resultSet),
      policySet: deepClone(policySet),
    });
    assert.equal(
      a.interpretation_bases[0]!.key,
      b.interpretation_bases[0]!.key
    );
  });

  it("no default mapping / 182 / 179 / Result recompute / canonical State / AVAILABLE", () => {
    const core = coreSource();
    const types = typesSource();
    assert.ok(!/isResourceAvailabilityActiveAt/.test(core));
    assert.ok(
      !/buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet/.test(core)
    );
    assert.ok(
      !/buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet/.test(
        core
      )
    );
    assert.ok(!/deriveDeclaredResourceAvailabilitySourceAggregationResultValue/.test(core));
    assert.ok(!/EXPLICITLY_INTERPRETED_/.test(types));
    assert.ok(!/MIXED/.test(types));
    assert.ok(!/"AVAILABLE"|"UNAVAILABLE"/.test(types));
    assert.ok(!/^import .*ProjectState/m.test(core));
  });

  it("Basis preserves full Result lineage / keys", () => {
    const set = pair({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "UNAVAILABLE" },
      ],
      mappings: [
        {
          source_result_value: RESULT_HOLDS,
          interpretation: INTERP_SUPPORTING,
        },
      ],
    });
    const basis = set.interpretation_bases[0]!;
    assert.ok(basis.availability_source_aggregation_result_key.length > 0);
    assert.ok(
      basis.availability_source_aggregation_result_interpretation_policy_key
        .length > 0
    );
    assert.ok(basis.matched_mapping_key.length > 0);
    assert.equal(basis.current_aggregation_result.operands.length, 2);
    assert.equal(basis.evaluation_at, EVAL_AT);
  });

  it("Basis key excludes AVAILABLE/UNAVAILABLE/READY", () => {
    const key = declaredResourceAvailabilitySourceAggregationResultInterpretationBasisKey(
      {
        resource_declaration_id: RD,
        evaluation_at: EVAL_AT,
        availability_source_aggregation_policy_key: "agg",
        availability_source_aggregation_result_key: "result",
        current_result_value: RESULT_HOLDS,
        availability_source_aggregation_result_interpretation_policy_key:
          "policy",
        matched_mapping_key: "mapping",
        interpretation: INTERP_SUPPORTING,
      }
    );
    assert.ok(!/AVAILABLE|UNAVAILABLE|READY/.test(key));
  });
});
