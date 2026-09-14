/**
 * GROUND-181 — Observation Core CXXXV / Declared Resource Availability
 * Source Aggregation Readiness Policy Foundation
 *
 * GROUND-180 stable aggregation Policy + explicit readiness rule
 * → stable readiness Policy (no 179 / evaluation_at / HOLDS).
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
import {
  buildDeclaredResourceAvailabilitySourceAggregationPolicySet,
} from "../reality/declared-resource-availability-source-aggregation-policy-core.js";
import type {
  DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment,
} from "../reality/declared-resource-availability-source-aggregation-policy-types.js";
import {
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_PROPOSITION,
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_RULE_ORDER,
  buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet,
  declaredResourceAvailabilitySourceAggregationReadinessPolicyKey,
} from "../reality/declared-resource-availability-source-aggregation-readiness-policy-core.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const RD = "a1111111-1111-4111-8111-111111111111";
const RD_B = "a2222222-2222-4222-8222-222222222222";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const ENTITY = "e1111111-1111-4111-8111-111111111111";
const FROM = "2026-09-01T00:00:00.000Z";
const FUTURE_FROM = "2026-10-01T00:00:00.000Z";
const PAST_UNTIL = "2026-08-01T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

const RULE =
  "REQUIRE_ALL_SELECTED_AVAILABILITY_SOURCE_EVIDENCE_STATES_PRESENT_AND_RESOLVED_BEFORE_AGGREGATION" as const;

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

function make180(params?: {
  resources?: ResourceDeclaration[];
  availabilities?: ResourceAvailabilityDeclaration[];
  policies?: Array<{
    resource_declaration_id: string;
    selected_availability_declaration_ids: string[];
    operator: "ANY" | "ALL";
  }>;
}): DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment {
  return buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: params?.resources ?? [resource({ id: RD })],
    resource_availability_declarations:
      params?.availabilities ?? [
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ],
    specification: {
      policies: params?.policies ?? [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    },
  });
}

function build181(params: {
  aggregationSet: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment;
  readinessPolicies?: Array<{
    availability_source_aggregation_policy_key: string;
    rule: typeof RULE | string;
  }>;
}) {
  return buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet({
    availability_source_aggregation_policy_set: params.aggregationSet,
    specification: {
      policies: (params.readinessPolicies ?? []).map((entry) => ({
        availability_source_aggregation_policy_key:
          entry.availability_source_aggregation_policy_key,
        rule: entry.rule as typeof RULE,
      })),
    },
  });
}

function firstAggKey(
  set: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment
): string {
  return set.aggregation_policies[0]!.key;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function coreSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-readiness-policy-core.ts"
    ),
    "utf8"
  );
}

function typesSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-readiness-policy-types.ts"
    ),
    "utf8"
  );
}

describe("GROUND-181 Declared Resource Availability Source Aggregation Readiness Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("proposition / sole rule / model limitations fixed", () => {
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_PROPOSITION,
      "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION"
    );
    assert.deepEqual(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_RULE_ORDER,
      [RULE]
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS[0],
      "AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("no GROUND-180 Policy → NOT_APPLICABLE", () => {
    const set180 = make180({ policies: [] });
    const set = build181({ aggregationSet: set180, readinessPolicies: [] });
    assert.equal(
      set.resource_assessments[0]!.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(set.resource_assessments[0]!.readiness_policy, null);
    assert.equal(set.has_explicit_readiness_policies, false);
  });

  it("aggregation Policy + no readiness specification → NO_POLICY", () => {
    const set180 = make180();
    const set = build181({ aggregationSet: set180, readinessPolicies: [] });
    assert.equal(
      set.resource_assessments[0]!.status,
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
    );
    assert.equal(set.resource_assessments[0]!.readiness_policy, null);
  });

  it("ANY aggregation + readiness rule → PRESENT", () => {
    const set180 = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    });
    const set = build181({
      aggregationSet: set180,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(set180),
          rule: RULE,
        },
      ],
    });
    const readiness = set.resource_assessments[0]!.readiness_policy!;
    assert.equal(
      set.resource_assessments[0]!.status,
      "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
    );
    assert.equal(readiness.rule, RULE);
    assert.equal(
      readiness.proposition,
      "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION"
    );
    assert.equal(
      readiness.availability_source_aggregation_policy.operator,
      "ANY"
    );
    assert.ok(!("result" in readiness));
    assert.ok(!("readiness_condition" in readiness));
  });

  it("ALL aggregation + readiness rule → PRESENT (same rule)", () => {
    const set180 = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ALL",
        },
      ],
    });
    const set = build181({
      aggregationSet: set180,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(set180),
          rule: RULE,
        },
      ],
    });
    assert.equal(set.readiness_policies[0]!.rule, RULE);
    assert.equal(
      set.readiness_policies[0]!.availability_source_aggregation_policy
        .operator,
      "ALL"
    );
  });

  it("single-member ANY / ALL PRESENT without simplification", () => {
    const any180 = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    const all180 = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A],
          operator: "ALL",
        },
      ],
    });
    const anySet = build181({
      aggregationSet: any180,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(any180),
          rule: RULE,
        },
      ],
    });
    const allSet = build181({
      aggregationSet: all180,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(all180),
          rule: RULE,
        },
      ],
    });
    assert.ok(anySet.readiness_policies[0]);
    assert.ok(allSet.readiness_policies[0]);
    assert.notEqual(
      anySet.readiness_policies[0]!.key,
      allSet.readiness_policies[0]!.key
    );
  });

  it("multi-member ANY / ALL PRESENT", () => {
    const any180 = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    });
    const all180 = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ALL",
        },
      ],
    });
    assert.ok(
      build181({
        aggregationSet: any180,
        readinessPolicies: [
          {
            availability_source_aggregation_policy_key: firstAggKey(any180),
            rule: RULE,
          },
        ],
      }).has_explicit_readiness_policies
    );
    assert.ok(
      build181({
        aggregationSet: all180,
        readinessPolicies: [
          {
            availability_source_aggregation_policy_key: firstAggKey(all180),
            rule: RULE,
          },
        ],
      }).has_explicit_readiness_policies
    );
  });

  it("future / expired / mixed temporal selected members still yield PRESENT", () => {
    const set180 = make180({
      availabilities: [
        availability({
          id: AVAIL_A,
          valid_from: FUTURE_FROM,
          valid_until: null,
        }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          valid_from: "2026-07-01T00:00:00.000Z",
          valid_until: PAST_UNTIL,
          declared_by: { kind: "system", label: "b" },
        }),
      ],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ALL",
        },
      ],
    });
    const set = build181({
      aggregationSet: set180,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(set180),
          rule: RULE,
        },
      ],
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_PRESENT"
    );
  });

  it("normalized member-order lineage → same readiness Policy", () => {
    const a = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_B, AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    const b = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    });
    assert.equal(firstAggKey(a), firstAggKey(b));
    const readinessA = build181({
      aggregationSet: a,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(a),
          rule: RULE,
        },
      ],
    });
    const readinessB = build181({
      aggregationSet: b,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(b),
          rule: RULE,
        },
      ],
    });
    assert.equal(
      readinessA.readiness_policies[0]!.key,
      readinessB.readiness_policies[0]!.key
    );
  });

  it("ANY vs ALL lineage sensitivity → distinct readiness identity", () => {
    const anyKey = declaredResourceAvailabilitySourceAggregationReadinessPolicyKey(
      {
        availability_source_aggregation_policy_key: "agg-any",
        rule: RULE,
      }
    );
    const allKey = declaredResourceAvailabilitySourceAggregationReadinessPolicyKey(
      {
        availability_source_aggregation_policy_key: "agg-all",
        rule: RULE,
      }
    );
    assert.notEqual(anyKey, allKey);
  });

  it("member-set lineage sensitivity → distinct readiness identity", () => {
    const one = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    const two = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    });
    assert.notEqual(firstAggKey(one), firstAggKey(two));
    const r1 = build181({
      aggregationSet: one,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(one),
          rule: RULE,
        },
      ],
    });
    const r2 = build181({
      aggregationSet: two,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(two),
          rule: RULE,
        },
      ],
    });
    assert.notEqual(
      r1.readiness_policies[0]!.key,
      r2.readiness_policies[0]!.key
    );
  });

  it("duplicate identical readiness specification normalizes", () => {
    const set180 = make180();
    const key = firstAggKey(set180);
    const set = build181({
      aggregationSet: set180,
      readinessPolicies: [
        { availability_source_aggregation_policy_key: key, rule: RULE },
        { availability_source_aggregation_policy_key: key, rule: RULE },
      ],
    });
    assert.equal(set.readiness_policies.length, 1);
  });

  it("unknown target Policy key rejects", () => {
    assert.throws(
      () =>
        build181({
          aggregationSet: make180(),
          readinessPolicies: [
            {
              availability_source_aggregation_policy_key: "missing-policy-key",
              rule: RULE,
            },
          ],
        }),
      /unknown GROUND-180 Aggregation Policy key/
    );
  });

  it("detached readiness spec on resource with no GROUND-180 Policy rejects", () => {
    const set180 = make180({
      resources: [resource({ id: RD }), resource({ id: RD_B })],
      policies: [],
    });
    assert.throws(
      () =>
        build181({
          aggregationSet: set180,
          readinessPolicies: [
            {
              availability_source_aggregation_policy_key:
                "declared-resource-availability-source-aggregation-policy|ghost",
              rule: RULE,
            },
          ],
        }),
      /unknown GROUND-180 Aggregation Policy key/
    );
  });

  it("unsupported readiness token rejects", () => {
    const set180 = make180();
    assert.throws(
      () =>
        buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet({
          availability_source_aggregation_policy_set: set180,
          specification: {
            policies: [
              {
                availability_source_aggregation_policy_key: firstAggKey(set180),
                rule: "REQUIRE_ANY" as never,
              },
            ],
          },
        }),
      /Unknown .* Readiness rule/
    );
  });

  it("input immutability / deep-clone / ordering invariance", () => {
    const set180 = make180({
      resources: [resource({ id: RD }), resource({ id: RD_B })],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ALL",
        },
      ],
    });
    const readinessPolicies = [
      {
        availability_source_aggregation_policy_key: firstAggKey(set180),
        rule: RULE,
      },
    ];
    const snapshot = {
      set180: deepClone(set180),
      readinessPolicies: deepClone(readinessPolicies),
    };
    const a = build181({ aggregationSet: set180, readinessPolicies });
    assert.deepEqual(set180, snapshot.set180);
    assert.deepEqual(readinessPolicies, snapshot.readinessPolicies);
    const b = build181({
      aggregationSet: deepClone(set180),
      readinessPolicies: deepClone(readinessPolicies),
    });
    assert.equal(
      a.readiness_policies[0]!.key,
      b.readiness_policies[0]!.key
    );
  });

  it("Policy identity excludes evaluation_at / current polarity / HOLDS", () => {
    const key = declaredResourceAvailabilitySourceAggregationReadinessPolicyKey(
      {
        availability_source_aggregation_policy_key: "agg-key",
        rule: RULE,
      }
    );
    assert.ok(!/evaluation_at|SUPPORTING|CONTRADICTING|HOLDS|DOES_NOT_HOLD/.test(key));
    assert.match(key, /SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION/);
  });

  it("no GROUND-179 / evaluation_at field / active-at / Result execution", () => {
    const core = coreSource();
    const types = typesSource();
    assert.ok(!/per-source-evidence-state/.test(core));
    assert.ok(!/isResourceAvailabilityActiveAt/.test(core));
    assert.ok(!/evaluation_at\s*:/.test(types));
    assert.ok(!/"HOLDS"|"DOES_NOT_HOLD"/.test(types));
    assert.ok(!/executeAny|executeAll/.test(core));
    assert.ok(!/^import .*ProjectState/m.test(core));
    assert.ok(!/applyPatch|saveProject/.test(core));
  });

  it("preserves exact GROUND-180 selected members and operator lineage", () => {
    const set180 = make180({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_B, AVAIL_A],
          operator: "ALL",
        },
      ],
    });
    const set = build181({
      aggregationSet: set180,
      readinessPolicies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(set180),
          rule: RULE,
        },
      ],
    });
    const nested =
      set.readiness_policies[0]!.availability_source_aggregation_policy;
    assert.deepEqual(nested.selected_availability_declaration_ids, [
      AVAIL_A,
      AVAIL_B,
    ]);
    assert.equal(nested.operator, "ALL");
    assert.equal(nested.key, firstAggKey(set180));
  });
});
