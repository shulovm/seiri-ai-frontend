/**
 * GROUND-185 — Observation Core CXXXIX / Declared Resource Availability
 * Source Aggregation Result Interpretation Policy Foundation
 *
 * GROUND-180 + explicit specification → stable Interpretation Policy.
 * No current GROUND-183 / defaults / Basis / canonical State.
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
import { buildDeclaredResourceAvailabilitySourceAggregationPolicySet } from "../reality/declared-resource-availability-source-aggregation-policy-core.js";
import type { DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment } from "../reality/declared-resource-availability-source-aggregation-policy-types.js";
import {
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_PROPOSITION,
  EMPTY_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET,
  buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet,
  declaredResourceAvailabilitySourceAggregationResultInterpretationPolicyKey,
} from "../reality/declared-resource-availability-source-aggregation-result-interpretation-policy-core.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const RD = "a1111111-1111-4111-8111-111111111111";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const ENTITY = "e1111111-1111-4111-8111-111111111111";
const FROM = "2026-09-01T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

const RESULT_HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const RESULT_DNH =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;
const INTERP_SUPPORTING =
  "INTERPRET_AS_SUPPORTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;
const INTERP_CONTRADICTING =
  "INTERPRET_AS_CONTRADICTING_SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE" as const;

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
  selected?: string[];
  operator?: "ANY" | "ALL";
  withPolicy?: boolean;
}): DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment {
  return buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
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
        params?.withPolicy === false
          ? []
          : [
              {
                resource_declaration_id: RD,
                selected_availability_declaration_ids: params?.selected ?? [
                  AVAIL_A,
                  AVAIL_B,
                ],
                operator: params?.operator ?? "ANY",
              },
            ],
    },
  });
}

function firstAggKey(
  set: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment
): string {
  return set.aggregation_policies[0]!.key;
}

function build185(params: {
  aggregationSet: DeclaredResourceAvailabilitySourceAggregationPolicySetAssessment;
  policies?: Array<{
    availability_source_aggregation_policy_key: string;
    mappings: Array<{
      source_result_value: typeof RESULT_HOLDS | typeof RESULT_DNH | string;
      interpretation: typeof INTERP_SUPPORTING | typeof INTERP_CONTRADICTING | string;
    }>;
  }>;
}) {
  return buildDeclaredResourceAvailabilitySourceAggregationResultInterpretationPolicySet({
    availability_source_aggregation_policy_set: params.aggregationSet,
    specification: {
      policies: (params.policies ?? []).map((entry) => ({
        availability_source_aggregation_policy_key:
          entry.availability_source_aggregation_policy_key,
        mappings: entry.mappings.map((mapping) => ({
          source_result_value: mapping.source_result_value as typeof RESULT_HOLDS,
          interpretation: mapping.interpretation as typeof INTERP_SUPPORTING,
        })),
      })),
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
      "../reality/declared-resource-availability-source-aggregation-result-interpretation-policy-core.ts"
    ),
    "utf8"
  );
}

function typesSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-result-interpretation-policy-types.ts"
    ),
    "utf8"
  );
}

describe("GROUND-185 Declared Resource Availability Source Aggregation Result Interpretation Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("proposition / model limitations fixed", () => {
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_PROPOSITION,
      "SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
      "AVAILABILITY_AGGREGATION_RESULT_INTERPRETATION_BASIS_NOT_MODELED"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("no GROUND-180 Policy → NOT_APPLICABLE", () => {
    const set = build185({
      aggregationSet: make180({ withPolicy: false }),
      policies: [],
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(set.resource_assessments[0]!.interpretation_policy, null);
  });

  it("GROUND-180 Policy / no 185 specification → NO_POLICY", () => {
    const set = build185({ aggregationSet: make180(), policies: [] });
    assert.equal(
      set.resource_assessments[0]!.status,
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY"
    );
  });

  it("explicit empty Policy → PRESENT", () => {
    const aggregationSet = make180();
    const set = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
          mappings: [],
        },
      ],
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_POLICY_PRESENT"
    );
    assert.deepEqual(set.interpretation_policies[0]!.mappings, []);
    assert.equal(set.has_empty_mapping_policies, true);
    assert.match(
      set.interpretation_policies[0]!.key,
      new RegExp(EMPTY_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET)
    );
  });

  it("HOLDS→SUPPORTING only = valid partial", () => {
    const aggregationSet = make180();
    const set = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
          mappings: [
            {
              source_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ],
    });
    assert.equal(set.has_partial_mapping_policies, true);
    assert.equal(set.interpretation_policies[0]!.mappings.length, 1);
  });

  it("HOLDS→CONTRADICTING only = valid unusual partial", () => {
    const aggregationSet = make180();
    const set = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
          mappings: [
            {
              source_result_value: RESULT_HOLDS,
              interpretation: INTERP_CONTRADICTING,
            },
          ],
        },
      ],
    });
    assert.equal(
      set.interpretation_policies[0]!.mappings[0]!.interpretation,
      INTERP_CONTRADICTING
    );
  });

  it("DNH→CONTRADICTING / DNH→SUPPORTING partials valid", () => {
    const aggregationSet = make180();
    const natural = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
          mappings: [
            {
              source_result_value: RESULT_DNH,
              interpretation: INTERP_CONTRADICTING,
            },
          ],
        },
      ],
    });
    const unusual = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
          mappings: [
            {
              source_result_value: RESULT_DNH,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ],
    });
    assert.equal(
      natural.interpretation_policies[0]!.mappings[0]!.interpretation,
      INTERP_CONTRADICTING
    );
    assert.equal(
      unusual.interpretation_policies[0]!.mappings[0]!.interpretation,
      INTERP_SUPPORTING
    );
  });

  it("natural complete mapping valid", () => {
    const aggregationSet = make180();
    const set = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
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
        },
      ],
    });
    assert.equal(set.has_complete_mapping_policies, true);
    assert.equal(set.interpretation_policies[0]!.mappings.length, 2);
  });

  it("fully inverted mapping valid (unusual)", () => {
    const aggregationSet = make180();
    const set = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
          mappings: [
            {
              source_result_value: RESULT_HOLDS,
              interpretation: INTERP_CONTRADICTING,
            },
            {
              source_result_value: RESULT_DNH,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ],
    });
    assert.equal(set.interpretation_policies[0]!.mappings.length, 2);
    assert.equal(
      set.interpretation_policies[0]!.mappings.find(
        (m) => m.source_result_value === RESULT_HOLDS
      )!.interpretation,
      INTERP_CONTRADICTING
    );
  });

  it("both source values → same target legal", () => {
    const aggregationSet = make180();
    const bothSupporting = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
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
        },
      ],
    });
    const bothContradicting = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
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
        },
      ],
    });
    assert.equal(bothSupporting.interpretation_policies[0]!.mappings.length, 2);
    assert.equal(
      bothContradicting.interpretation_policies[0]!.mappings.length,
      2
    );
  });

  it("duplicate identical mapping normalizes", () => {
    const aggregationSet = make180();
    const set = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
          mappings: [
            {
              source_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
            {
              source_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ],
    });
    assert.equal(set.interpretation_policies[0]!.mappings.length, 1);
  });

  it("conflicting HOLDS / DNH mappings reject", () => {
    const aggregationSet = make180();
    const key = firstAggKey(aggregationSet);
    assert.throws(
      () =>
        build185({
          aggregationSet,
          policies: [
            {
              availability_source_aggregation_policy_key: key,
              mappings: [
                {
                  source_result_value: RESULT_HOLDS,
                  interpretation: INTERP_SUPPORTING,
                },
                {
                  source_result_value: RESULT_HOLDS,
                  interpretation: INTERP_CONTRADICTING,
                },
              ],
            },
          ],
        }),
      /Conflicting .* mappings/
    );
    assert.throws(
      () =>
        build185({
          aggregationSet,
          policies: [
            {
              availability_source_aggregation_policy_key: key,
              mappings: [
                {
                  source_result_value: RESULT_DNH,
                  interpretation: INTERP_SUPPORTING,
                },
                {
                  source_result_value: RESULT_DNH,
                  interpretation: INTERP_CONTRADICTING,
                },
              ],
            },
          ],
        }),
      /Conflicting .* mappings/
    );
  });

  it("mapping order permutation → same Policy identity", () => {
    const aggregationSet = make180();
    const key = firstAggKey(aggregationSet);
    const a = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: key,
          mappings: [
            {
              source_result_value: RESULT_DNH,
              interpretation: INTERP_CONTRADICTING,
            },
            {
              source_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ],
    });
    const b = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: key,
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
        },
      ],
    });
    assert.equal(
      a.interpretation_policies[0]!.key,
      b.interpretation_policies[0]!.key
    );
  });

  it("duplicate identical Policy specification normalizes", () => {
    const aggregationSet = make180();
    const key = firstAggKey(aggregationSet);
    const set = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: key,
          mappings: [
            {
              source_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
        {
          availability_source_aggregation_policy_key: key,
          mappings: [
            {
              source_result_value: RESULT_HOLDS,
              interpretation: INTERP_SUPPORTING,
            },
          ],
        },
      ],
    });
    assert.equal(set.interpretation_policies.length, 1);
  });

  it("conflicting Policy mapping sets reject", () => {
    const aggregationSet = make180();
    const key = firstAggKey(aggregationSet);
    assert.throws(
      () =>
        build185({
          aggregationSet,
          policies: [
            {
              availability_source_aggregation_policy_key: key,
              mappings: [
                {
                  source_result_value: RESULT_HOLDS,
                  interpretation: INTERP_SUPPORTING,
                },
              ],
            },
            {
              availability_source_aggregation_policy_key: key,
              mappings: [
                {
                  source_result_value: RESULT_HOLDS,
                  interpretation: INTERP_CONTRADICTING,
                },
              ],
            },
          ],
        }),
      /Conflicting .* Interpretation Policies/
    );
  });

  it("unknown GROUND-180 key rejects", () => {
    assert.throws(
      () =>
        build185({
          aggregationSet: make180(),
          policies: [
            {
              availability_source_aggregation_policy_key: "missing-policy-key",
              mappings: [],
            },
          ],
        }),
      /Unknown or stale/
    );
  });

  it("unsupported Result / interpretation tokens reject", () => {
    const aggregationSet = make180();
    const key = firstAggKey(aggregationSet);
    assert.throws(
      () =>
        build185({
          aggregationSet,
          policies: [
            {
              availability_source_aggregation_policy_key: key,
              mappings: [
                {
                  source_result_value: "AVAILABLE",
                  interpretation: INTERP_SUPPORTING,
                },
              ],
            },
          ],
        }),
      /Unknown .* Result value/
    );
    assert.throws(
      () =>
        build185({
          aggregationSet,
          policies: [
            {
              availability_source_aggregation_policy_key: key,
              mappings: [
                {
                  source_result_value: RESULT_HOLDS,
                  interpretation: "INTERPRET_AS_AVAILABLE",
                },
              ],
            },
          ],
        }),
      /Unknown .* Interpretation/
    );
  });

  it("ANY vs ALL subject sensitivity → distinct Policy identity", () => {
    const any180 = make180({ operator: "ANY" });
    const all180 = make180({ operator: "ALL" });
    const mappings = [
      {
        source_result_value: RESULT_HOLDS,
        interpretation: INTERP_SUPPORTING,
      },
    ];
    const anySet = build185({
      aggregationSet: any180,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(any180),
          mappings,
        },
      ],
    });
    const allSet = build185({
      aggregationSet: all180,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(all180),
          mappings,
        },
      ],
    });
    assert.notEqual(
      anySet.interpretation_policies[0]!.key,
      allSet.interpretation_policies[0]!.key
    );
  });

  it("member-set subject sensitivity → distinct Policy identity", () => {
    const one = make180({ selected: [AVAIL_A] });
    const two = make180({ selected: [AVAIL_A, AVAIL_B] });
    const mappings = [
      {
        source_result_value: RESULT_HOLDS,
        interpretation: INTERP_SUPPORTING,
      },
    ];
    const a = build185({
      aggregationSet: one,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(one),
          mappings,
        },
      ],
    });
    const b = build185({
      aggregationSet: two,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(two),
          mappings,
        },
      ],
    });
    assert.notEqual(
      a.interpretation_policies[0]!.key,
      b.interpretation_policies[0]!.key
    );
  });

  it("input immutability / deep-clone / ordering invariance", () => {
    const aggregationSet = make180();
    const policies = [
      {
        availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
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
      },
    ];
    const snap = {
      aggregationSet: deepClone(aggregationSet),
      policies: deepClone(policies),
    };
    const a = build185({ aggregationSet, policies });
    assert.deepEqual(aggregationSet, snap.aggregationSet);
    assert.deepEqual(policies, snap.policies);
    const b = build185({
      aggregationSet: deepClone(aggregationSet),
      policies: deepClone(policies),
    });
    assert.equal(
      a.interpretation_policies[0]!.key,
      b.interpretation_policies[0]!.key
    );
  });

  it("no evaluation_at / 183 runtime / 182 / 179 / defaults / Basis / State", () => {
    const core = coreSource();
    const types = typesSource();
    assert.ok(!/evaluation_at\s*:/.test(types));
    assert.ok(
      !/buildDeclaredResourceAvailabilitySourceAggregationResultSet/.test(core)
    );
    assert.ok(
      !/buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet/.test(
        core
      )
    );
    assert.ok(
      !/buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet/.test(core)
    );
    assert.ok(!/isResourceAvailabilityActiveAt/.test(core));
    assert.ok(!/ResourceAvailabilityDeclaration/.test(core));
    assert.ok(!/^import .*ProjectState/m.test(core));
    assert.ok(!/applyPatch|saveProject/.test(core));
    assert.ok(!/HOLDS\s*→\s*SUPPORTING|default.*SUPPORTING/.test(core));
    assert.ok(!/MIXED/.test(types));
    assert.ok(!/EXPLICITLY_INTERPRETED_/.test(types));
  });

  it("Policy identity excludes current Result / evaluation_at / operands", () => {
    const key = declaredResourceAvailabilitySourceAggregationResultInterpretationPolicyKey(
      {
        availability_source_aggregation_policy_key: "agg-key",
        mappings: [],
      }
    );
    assert.ok(
      !/evaluation_at|SUPPORTING|CONTRADICTING|HOLDS|DOES_NOT_HOLD|operand/.test(
        key.replace(
          EMPTY_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_RESULT_INTERPRETATION_MAPPING_SET,
          ""
        )
      )
    );
    assert.match(
      key,
      /SELECTED_SOURCE_AGGREGATED_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE/
    );
  });

  it("preserves nested GROUND-180 operator/members lineage", () => {
    const aggregationSet = make180({
      selected: [AVAIL_B, AVAIL_A],
      operator: "ALL",
    });
    const set = build185({
      aggregationSet,
      policies: [
        {
          availability_source_aggregation_policy_key: firstAggKey(aggregationSet),
          mappings: [],
        },
      ],
    });
    const nested =
      set.interpretation_policies[0]!.availability_source_aggregation_policy;
    assert.equal(nested.operator, "ALL");
    assert.deepEqual(nested.selected_availability_declaration_ids, [
      AVAIL_A,
      AVAIL_B,
    ]);
  });
});
