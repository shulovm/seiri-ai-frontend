/**
 * GROUND-180 — Observation Core CXXXIV / Declared Resource Availability
 * Source Aggregation Policy Foundation
 *
 * Stable ResourceDeclaration domain + availability declaration domain
 * + explicit nonempty member set + ANY|ALL → Policy (no readiness/Result).
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
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS,
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_PROPOSITION,
  buildDeclaredResourceAvailabilitySourceAggregationPolicySet,
  canonicalizeDeclaredResourceAvailabilitySourceAggregationMemberIds,
  declaredResourceAvailabilitySourceAggregationPolicyKey,
} from "../reality/declared-resource-availability-source-aggregation-policy-core.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const RD = "a1111111-1111-4111-8111-111111111111";
const RD_B = "a2222222-2222-4222-8222-222222222222";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const AVAIL_C = "b3333333-3333-4333-8333-333333333333";
const ENTITY = "e1111111-1111-4111-8111-111111111111";
const FROM = "2026-09-01T00:00:00.000Z";
const UNTIL = "2026-09-10T00:00:00.000Z";
const FUTURE_FROM = "2026-10-01T00:00:00.000Z";
const PAST_UNTIL = "2026-08-01T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

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

function build(params: {
  resources?: ResourceDeclaration[];
  availabilities?: ResourceAvailabilityDeclaration[];
  policies?: Array<{
    resource_declaration_id: string;
    selected_availability_declaration_ids: string[];
    operator: "ANY" | "ALL";
  }>;
}) {
  return buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: params.resources ?? [resource({ id: RD })],
    resource_availability_declarations:
      params.availabilities ?? [
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ],
    specification: {
      policies: params.policies ?? [],
    },
  });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function coreSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-policy-core.ts"
    ),
    "utf8"
  );
}

function typesSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-policy-types.ts"
    ),
    "utf8"
  );
}

describe("GROUND-180 Declared Resource Availability Source Aggregation Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("proposition and model limitations fixed", () => {
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_PROPOSITION,
      "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS[0],
      "AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("no Policy → NO_EXPLICIT_..._POLICY", () => {
    const set = build({ policies: [] });
    assert.equal(set.resource_assessments.length, 1);
    assert.equal(
      set.resource_assessments[0]!.status,
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(set.resource_assessments[0]!.aggregation_policy, null);
    assert.equal(set.has_explicit_aggregation_policies, false);
  });

  it("known resource with zero availability declarations can still be NO_POLICY", () => {
    const set = build({
      resources: [resource({ id: RD })],
      availabilities: [],
      policies: [],
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
    );
  });

  it("ANY Policy PRESENT without Result", () => {
    const set = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    const policy = set.resource_assessments[0]!.aggregation_policy!;
    assert.equal(
      set.resource_assessments[0]!.status,
      "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_PRESENT"
    );
    assert.equal(policy.operator, "ANY");
    assert.deepEqual(policy.selected_availability_declaration_ids, [AVAIL_A]);
    assert.equal(
      policy.proposition,
      "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION"
    );
    assert.ok(!("result" in policy));
    assert.ok(!("readiness" in policy));
  });

  it("ALL Policy PRESENT without Result", () => {
    const set = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ALL",
        },
      ],
    });
    assert.equal(set.aggregation_policies[0]!.operator, "ALL");
    assert.equal(set.has_all_operator_policies, true);
  });

  it("single-member ANY and ALL are distinct Policies", () => {
    const anyKey = declaredResourceAvailabilitySourceAggregationPolicyKey({
      resource_declaration_id: RD,
      selected_availability_declaration_ids: [AVAIL_A],
      operator: "ANY",
    });
    const allKey = declaredResourceAvailabilitySourceAggregationPolicyKey({
      resource_declaration_id: RD,
      selected_availability_declaration_ids: [AVAIL_A],
      operator: "ALL",
    });
    assert.notEqual(anyKey, allKey);
  });

  it("multi-member ANY / ALL valid", () => {
    const anySet = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    });
    const allSet = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ALL",
        },
      ],
    });
    assert.equal(
      anySet.aggregation_policies[0]!.selected_availability_declaration_ids
        .length,
      2
    );
    assert.equal(allSet.aggregation_policies[0]!.operator, "ALL");
  });

  it("mixed AVAILABLE/UNAVAILABLE selected members → Policy PRESENT", () => {
    const set = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_PRESENT"
    );
  });

  it("all AVAILABLE / all UNAVAILABLE member records construct identically", () => {
    const availableOnly = build({
      availabilities: [
        availability({ id: AVAIL_A, status: "AVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "AVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_B, AVAIL_A],
          operator: "ALL",
        },
      ],
    });
    const unavailableOnly = build({
      availabilities: [
        availability({ id: AVAIL_A, status: "UNAVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
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
    assert.equal(
      availableOnly.aggregation_policies[0]!.key,
      unavailableOnly.aggregation_policies[0]!.key
    );
  });

  it("future member declaration still yields Policy PRESENT", () => {
    const set = build({
      availabilities: [
        availability({
          id: AVAIL_A,
          valid_from: FUTURE_FROM,
          valid_until: null,
        }),
      ],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY_PRESENT"
    );
  });

  it("expired member declaration still yields Policy PRESENT", () => {
    const set = build({
      availabilities: [
        availability({
          id: AVAIL_A,
          valid_from: "2026-07-01T00:00:00.000Z",
          valid_until: PAST_UNTIL,
        }),
      ],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A],
          operator: "ALL",
        },
      ],
    });
    assert.ok(set.aggregation_policies[0]);
  });

  it("new unselected source does not change existing Policy", () => {
    const before = build({
      availabilities: [availability({ id: AVAIL_A })],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    const after = build({
      availabilities: [
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_C,
          status: "AVAILABLE",
          declared_by: { kind: "system", label: "c" },
        }),
      ],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    assert.equal(
      before.aggregation_policies[0]!.key,
      after.aggregation_policies[0]!.key
    );
    assert.deepEqual(
      before.aggregation_policies[0]!.selected_availability_declaration_ids,
      after.aggregation_policies[0]!.selected_availability_declaration_ids
    );
  });

  it("same members different order → same Policy identity", () => {
    const a = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_B, AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    const b = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    });
    assert.equal(
      a.aggregation_policies[0]!.key,
      b.aggregation_policies[0]!.key
    );
    assert.deepEqual(
      a.aggregation_policies[0]!.selected_availability_declaration_ids,
      [AVAIL_A, AVAIL_B]
    );
  });

  it("duplicate member IDs normalize (no double count)", () => {
    assert.deepEqual(
      canonicalizeDeclaredResourceAvailabilitySourceAggregationMemberIds([
        AVAIL_B,
        AVAIL_A,
        AVAIL_B,
      ]),
      [AVAIL_A, AVAIL_B]
    );
    const set = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_A, AVAIL_B],
          operator: "ALL",
        },
      ],
    });
    assert.deepEqual(
      set.aggregation_policies[0]!.selected_availability_declaration_ids,
      [AVAIL_A, AVAIL_B]
    );
  });

  it("empty member set rejects", () => {
    assert.throws(
      () =>
        build({
          policies: [
            {
              resource_declaration_id: RD,
              selected_availability_declaration_ids: [],
              operator: "ANY",
            },
          ],
        }),
      /empty selected member set/
    );
  });

  it("unknown selected member rejects", () => {
    assert.throws(
      () =>
        build({
          policies: [
            {
              resource_declaration_id: RD,
              selected_availability_declaration_ids: [AVAIL_C],
              operator: "ANY",
            },
          ],
        }),
      /unknown availability_declaration.id/
    );
  });

  it("cross-resource selected member rejects", () => {
    assert.throws(
      () =>
        build({
          resources: [resource({ id: RD }), resource({ id: RD_B })],
          availabilities: [
            availability({ id: AVAIL_A, resource_declaration_id: RD }),
            availability({ id: AVAIL_B, resource_declaration_id: RD_B }),
          ],
          policies: [
            {
              resource_declaration_id: RD,
              selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
              operator: "ANY",
            },
          ],
        }),
      /cross-resource member/
    );
  });

  it("conflicting member-set Policies reject (0..1 cardinality)", () => {
    assert.throws(
      () =>
        build({
          policies: [
            {
              resource_declaration_id: RD,
              selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
              operator: "ANY",
            },
            {
              resource_declaration_id: RD,
              selected_availability_declaration_ids: [AVAIL_A],
              operator: "ANY",
            },
          ],
        }),
      /Conflicting/
    );
  });

  it("conflicting operators reject", () => {
    assert.throws(
      () =>
        build({
          policies: [
            {
              resource_declaration_id: RD,
              selected_availability_declaration_ids: [AVAIL_A],
              operator: "ANY",
            },
            {
              resource_declaration_id: RD,
              selected_availability_declaration_ids: [AVAIL_A],
              operator: "ALL",
            },
          ],
        }),
      /Conflicting/
    );
  });

  it("identical duplicate Policy specifications normalize", () => {
    const set = build({
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_B, AVAIL_A],
          operator: "ANY",
        },
      ],
    });
    assert.equal(set.aggregation_policies.length, 1);
  });

  it("input immutability / deep-clone / ordering invariance", () => {
    const resources = [resource({ id: RD }), resource({ id: RD_B })];
    const availabilities = [
      availability({ id: AVAIL_B, status: "UNAVAILABLE" }),
      availability({ id: AVAIL_A }),
    ];
    const policies = [
      {
        resource_declaration_id: RD,
        selected_availability_declaration_ids: [AVAIL_B, AVAIL_A],
        operator: "ALL" as const,
      },
    ];
    const snapshot = {
      resources: deepClone(resources),
      availabilities: deepClone(availabilities),
      policies: deepClone(policies),
    };
    const a = build({ resources, availabilities, policies });
    assert.deepEqual(resources, snapshot.resources);
    assert.deepEqual(availabilities, snapshot.availabilities);
    assert.deepEqual(policies, snapshot.policies);

    const b = build({
      resources: [resource({ id: RD_B }), resource({ id: RD })],
      availabilities: [
        availability({ id: AVAIL_A }),
        availability({ id: AVAIL_B, status: "UNAVAILABLE" }),
      ],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ALL",
        },
      ],
    });
    assert.equal(
      a.aggregation_policies[0]!.key,
      b.aggregation_policies[0]!.key
    );
  });

  it("Policy identity excludes evaluation_at / current polarity / Assessment status", () => {
    const key = declaredResourceAvailabilitySourceAggregationPolicyKey({
      resource_declaration_id: RD,
      selected_availability_declaration_ids: [AVAIL_A],
      operator: "ANY",
    });
    assert.ok(!/evaluation_at|AVAILABLE|UNAVAILABLE|CONTESTED|NO_AVAILABILITY/.test(key));
    assert.match(
      key,
      /SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION/
    );
  });

  it("no GROUND-179 / Assessment / Result execution imports", () => {
    const core = coreSource();
    const types = typesSource();
    assert.ok(!/per-source-evidence-state/.test(core));
    assert.ok(!/ResourceAvailabilityAssessment/.test(core + types));
    assert.ok(!/isResourceAvailabilityActiveAt/.test(core));
    assert.ok(!/executeAny|executeAll/.test(core));
    assert.ok(!/"HOLDS"|"DOES_NOT_HOLD"/.test(types));
    assert.ok(!/^import .*ProjectState/m.test(core));
    assert.ok(!/applyPatch|saveProject/.test(core));
    assert.ok(!/evaluation_at\s*:/.test(types));
  });

  it("same declarer opposite statuses may both be selected", () => {
    const declarer = { kind: "human" as const, label: "same" };
    const set = build({
      availabilities: [
        availability({ id: AVAIL_A, status: "AVAILABLE", declared_by: declarer }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: declarer,
        }),
      ],
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: [AVAIL_A, AVAIL_B],
          operator: "ANY",
        },
      ],
    });
    assert.equal(
      set.aggregation_policies[0]!.selected_availability_declaration_ids.length,
      2
    );
  });

  it("unsupported operator rejects", () => {
    assert.throws(
      () =>
        buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
          resource_declarations: [resource({ id: RD })],
          resource_availability_declarations: [availability({ id: AVAIL_A })],
          specification: {
            policies: [
              {
                resource_declaration_id: RD,
                selected_availability_declaration_ids: [AVAIL_A],
                operator: "MAJORITY" as never,
              },
            ],
          },
        }),
      /Unknown .* operator/
    );
  });
});
