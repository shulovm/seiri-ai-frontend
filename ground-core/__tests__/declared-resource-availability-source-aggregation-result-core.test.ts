/**
 * GROUND-183 — Observation Core CXXXVII / Declared Resource Availability
 * Source Aggregation Result Foundation
 *
 * GROUND-182 readiness Basis → neutral ANY/ALL composition Result
 * only when readiness HOLDS.
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
import type {
  DeclaredResourceAvailabilitySourceAggregationReadinessBasis,
  DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment,
} from "../reality/declared-resource-availability-source-aggregation-readiness-basis-types.js";
import {
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS,
  assertDeclaredResourceAvailabilitySourceAggregationReadinessHoldsBasisConsistency,
  buildDeclaredResourceAvailabilitySourceAggregationResultSet,
  declaredResourceAvailabilitySourceAggregationResultKey,
  deriveDeclaredResourceAvailabilitySourceAggregationResultValue,
} from "../reality/declared-resource-availability-source-aggregation-result-core.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const RD = "a1111111-1111-4111-8111-111111111111";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const AVAIL_C = "b3333333-3333-4333-8333-333333333333";
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
const OPERAND_HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_OPERAND_HOLDS" as const;
const OPERAND_DNH =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_OPERAND_DOES_NOT_HOLD" as const;
const SUPPORTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING" as const;
const CONTRADICTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING" as const;

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

function make182(params: {
  selected: string[];
  operator: "ANY" | "ALL";
  current: Array<{ id: string; status: "AVAILABLE" | "UNAVAILABLE" }>;
  withReadiness?: boolean;
  withAggregation?: boolean;
  evaluation_at?: string;
}): DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment {
  const decls = [
    availability({ id: AVAIL_A }),
    availability({
      id: AVAIL_B,
      status: "UNAVAILABLE",
      declared_by: { kind: "system", label: "b" },
    }),
    availability({
      id: AVAIL_C,
      declared_by: { kind: "system", label: "c" },
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

  return buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet({
    per_source_availability_evidence_state_set: evidence,
    availability_source_aggregation_readiness_policy_set: set181,
  });
}

function build183(
  readinessBasisSet: DeclaredResourceAvailabilitySourceAggregationReadinessBasisSetAssessment
) {
  return buildDeclaredResourceAvailabilitySourceAggregationResultSet({
    availability_source_aggregation_readiness_basis_set: readinessBasisSet,
  });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function coreSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-result-core.ts"
    ),
    "utf8"
  );
}

function typesSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-result-types.ts"
    ),
    "utf8"
  );
}

describe("GROUND-183 Declared Resource Availability Source Aggregation Result", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed deterministic order", () => {
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS[0],
      "AVAILABILITY_AGGREGATION_RESULT_INTERPRETATION_NOT_MODELED"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("structural NOT_APPLICABLE → no Result", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
        withAggregation: false,
      })
    );
    assert.equal(
      set.resource_assessments[0]!.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(set.resource_assessments[0]!.aggregation_result, null);
  });

  it("missing readiness Policy → no Result", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
        withReadiness: false,
      })
    );
    assert.equal(
      set.resource_assessments[0]!.status,
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
    );
    assert.equal(set.aggregation_results.length, 0);
  });

  it("readiness DNH → no Result (≠ Result DNH)", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      })
    );
    assert.equal(
      set.resource_assessments[0]!.status,
      "NO_CURRENT_AVAILABILITY_SOURCE_AGGREGATION_RESULT_BECAUSE_READINESS_CONDITION_DOES_NOT_HOLD"
    );
    assert.equal(set.resource_assessments[0]!.aggregation_result, null);
    assert.equal(set.has_aggregation_results, false);
  });

  it("ANY single SUPPORTING → Result HOLDS", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      })
    );
    const result = set.aggregation_results[0]!;
    assert.equal(result.value, RESULT_HOLDS);
    assert.equal(result.operands[0]!.operand_condition, OPERAND_HOLDS);
    assert.equal(result.operands[0]!.current_source_evidence_state_value, SUPPORTING);
  });

  it("ANY single CONTRADICTING → Result DNH", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_DNH);
    assert.equal(
      set.aggregation_results[0]!.operands[0]!.operand_condition,
      OPERAND_DNH
    );
  });

  it("ALL single SUPPORTING → Result HOLDS", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ALL",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_HOLDS);
  });

  it("ALL single CONTRADICTING → Result DNH", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ALL",
        current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_DNH);
  });

  it("ANY all SUPPORTING → HOLDS", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "AVAILABLE" },
        ],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_HOLDS);
  });

  it("ANY mixed → HOLDS", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "UNAVAILABLE" },
        ],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_HOLDS);
  });

  it("ANY all CONTRADICTING → DNH", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
        current: [
          { id: AVAIL_A, status: "UNAVAILABLE" },
          { id: AVAIL_B, status: "UNAVAILABLE" },
        ],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_DNH);
  });

  it("ALL all SUPPORTING → HOLDS", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "AVAILABLE" },
        ],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_HOLDS);
  });

  it("ALL mixed → DNH", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "UNAVAILABLE" },
        ],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_DNH);
  });

  it("ALL all CONTRADICTING → DNH", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
        current: [
          { id: AVAIL_A, status: "UNAVAILABLE" },
          { id: AVAIL_B, status: "UNAVAILABLE" },
        ],
      })
    );
    assert.equal(set.aggregation_results[0]!.value, RESULT_DNH);
  });

  it("ANY preserves all operands (no short-circuit lineage loss)", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B, AVAIL_C],
        operator: "ANY",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "UNAVAILABLE" },
          { id: AVAIL_C, status: "UNAVAILABLE" },
        ],
      })
    );
    const result = set.aggregation_results[0]!;
    assert.equal(result.value, RESULT_HOLDS);
    assert.equal(result.operands.length, 3);
    assert.equal(result.operands[0]!.operand_condition, OPERAND_HOLDS);
    assert.equal(result.operands[1]!.operand_condition, OPERAND_DNH);
    assert.equal(result.operands[2]!.operand_condition, OPERAND_DNH);
  });

  it("ALL preserves all operands (no short-circuit lineage loss)", () => {
    const set = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B, AVAIL_C],
        operator: "ALL",
        current: [
          { id: AVAIL_A, status: "UNAVAILABLE" },
          { id: AVAIL_B, status: "AVAILABLE" },
          { id: AVAIL_C, status: "AVAILABLE" },
        ],
      })
    );
    const result = set.aggregation_results[0]!;
    assert.equal(result.value, RESULT_DNH);
    assert.equal(result.operands.length, 3);
  });

  it("same HOLDS / different operand lineage → distinct Result", () => {
    const a = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "UNAVAILABLE" },
        ],
      })
    );
    const b = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
        current: [
          { id: AVAIL_A, status: "UNAVAILABLE" },
          { id: AVAIL_B, status: "AVAILABLE" },
        ],
      })
    );
    assert.equal(a.aggregation_results[0]!.value, RESULT_HOLDS);
    assert.equal(b.aggregation_results[0]!.value, RESULT_HOLDS);
    assert.notEqual(
      a.aggregation_results[0]!.key,
      b.aggregation_results[0]!.key
    );
  });

  it("same DNH / different operand lineage → distinct Result", () => {
    const a = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "UNAVAILABLE" },
        ],
      })
    );
    const b = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
        current: [
          { id: AVAIL_A, status: "UNAVAILABLE" },
          { id: AVAIL_B, status: "AVAILABLE" },
        ],
      })
    );
    assert.equal(a.aggregation_results[0]!.value, RESULT_DNH);
    assert.equal(b.aggregation_results[0]!.value, RESULT_DNH);
    assert.notEqual(
      a.aggregation_results[0]!.key,
      b.aggregation_results[0]!.key
    );
  });

  it("different evaluation_at → distinct Result", () => {
    const a = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
        evaluation_at: EVAL_AT,
      })
    );
    const b = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
        evaluation_at: EVAL_AT_B,
      })
    );
    assert.notEqual(
      a.aggregation_results[0]!.key,
      b.aggregation_results[0]!.key
    );
  });

  it("ANY vs ALL → distinct Result identity", () => {
    const anySet = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "AVAILABLE" },
        ],
      })
    );
    const allSet = build183(
      make182({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
        current: [
          { id: AVAIL_A, status: "AVAILABLE" },
          { id: AVAIL_B, status: "AVAILABLE" },
        ],
      })
    );
    assert.equal(anySet.aggregation_results[0]!.value, RESULT_HOLDS);
    assert.equal(allSet.aggregation_results[0]!.value, RESULT_HOLDS);
    assert.notEqual(
      anySet.aggregation_results[0]!.key,
      allSet.aggregation_results[0]!.key
    );
  });

  it("malformed readiness HOLDS with missing member rejects", () => {
    const basisSet = make182({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "UNAVAILABLE" },
      ],
    });
    const basis = basisSet.resource_assessments[0]!.readiness_basis!;
    basis.member_assessments[1] = {
      ...basis.member_assessments[1]!,
      status: "MISSING_CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE",
      current_source_evidence_state_key: null,
      current_source_evidence_state_value: null,
      is_present: false,
      is_resolved: false,
    };
    assert.throws(
      () => build183(basisSet),
      /PRESENT_AND_RESOLVED/
    );
  });

  it("malformed member current-State null under HOLDS rejects", () => {
    const basisSet = make182({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
    });
    const basis = basisSet.resource_assessments[0]!.readiness_basis!;
    basis.member_assessments[0] = {
      ...basis.member_assessments[0]!,
      current_source_evidence_state_key: null,
      current_source_evidence_state_value: null,
    };
    assert.throws(() => build183(basisSet), /missing current State|null current State/);
  });

  it("unknown operator rejects at derive", () => {
    assert.throws(
      () =>
        deriveDeclaredResourceAvailabilitySourceAggregationResultValue(
          "MAJORITY" as never,
          [
            {
              availability_declaration_id: AVAIL_A,
              current_source_evidence_state_key: "k",
              current_source_evidence_state_value: SUPPORTING,
              operand_condition: OPERAND_HOLDS,
            },
          ]
        ),
      /Unknown .* operator/
    );
  });

  it("HOLDS != AVAILABLE and DNH != UNAVAILABLE vocabulary firewall", () => {
    const types = typesSource();
    assert.ok(!/"AVAILABLE"|"UNAVAILABLE"/.test(types));
    assert.match(
      types,
      /SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS/
    );
    assert.match(
      types,
      /SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD/
    );
    const holds = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      })
    ).aggregation_results[0]!;
    assert.notEqual(holds.value, "AVAILABLE");
    assert.ok(!("AVAILABLE" in (holds as object)));
  });

  it("input immutability / deep-clone / ordering invariance", () => {
    const basisSet = make182({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
      current: [
        { id: AVAIL_A, status: "AVAILABLE" },
        { id: AVAIL_B, status: "AVAILABLE" },
      ],
    });
    const snap = deepClone(basisSet);
    const a = build183(basisSet);
    assert.deepEqual(basisSet, snap);
    const b = build183(deepClone(basisSet));
    assert.equal(a.aggregation_results[0]!.key, b.aggregation_results[0]!.key);
  });

  it("no GROUND-179 builder / raw declaration / active-at / Assessment / ProjectState", () => {
    const core = coreSource();
    const types = typesSource();
    assert.ok(!/buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet/.test(core));
    assert.ok(!/isResourceAvailabilityActiveAt/.test(core));
    assert.ok(!/ResourceAvailabilityAssessment/.test(core));
    assert.ok(!/ResourceAvailabilityDeclaration/.test(core));
    assert.ok(!/UNRESOLVED_NO_CURRENT_AVAILABILITY_EVIDENCE/.test(types));
    assert.ok(!/^import .*ProjectState/m.test(core));
    assert.ok(!/applyPatch|saveProject/.test(core));
  });

  it("Result PRESENT status with either HOLDS or DNH value", () => {
    const holds = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "AVAILABLE" }],
      })
    );
    const dnh = build183(
      make182({
        selected: [AVAIL_A],
        operator: "ANY",
        current: [{ id: AVAIL_A, status: "UNAVAILABLE" }],
      })
    );
    assert.equal(
      holds.resource_assessments[0]!.status,
      "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_PRESENT"
    );
    assert.equal(
      dnh.resource_assessments[0]!.status,
      "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_PRESENT"
    );
    assert.equal(holds.aggregation_results[0]!.value, RESULT_HOLDS);
    assert.equal(dnh.aggregation_results[0]!.value, RESULT_DNH);
  });

  it("assert readiness HOLDS consistency helper", () => {
    const basisSet = make182({
      selected: [AVAIL_A],
      operator: "ANY",
      current: [{ id: AVAIL_A, status: "AVAILABLE" }],
    });
    const basis = basisSet.readiness_bases[0]!;
    assert.doesNotThrow(() =>
      assertDeclaredResourceAvailabilitySourceAggregationReadinessHoldsBasisConsistency(
        basis
      )
    );
  });

  it("Result key excludes AVAILABLE/UNAVAILABLE/READY tokens", () => {
    const key = declaredResourceAvailabilitySourceAggregationResultKey({
      resource_declaration_id: RD,
      evaluation_at: EVAL_AT,
      availability_source_aggregation_policy_key: "agg",
      availability_source_aggregation_readiness_policy_key: "ready",
      availability_source_aggregation_readiness_basis_key: "basis",
      operator: "ANY",
      selected_availability_declaration_ids: [AVAIL_A],
      operands: [
        {
          availability_declaration_id: AVAIL_A,
          current_source_evidence_state_key: "state-a",
          current_source_evidence_state_value: SUPPORTING,
          operand_condition: OPERAND_HOLDS,
        },
      ],
      value: RESULT_HOLDS,
    });
    assert.ok(!/AVAILABLE|UNAVAILABLE|READY/.test(key));
    assert.match(key, /declared-resource-availability-source-aggregation-result/);
  });
});
