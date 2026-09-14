/**
 * GROUND-182 — Observation Core CXXXVI / Declared Resource Availability
 * Source Aggregation Readiness Basis Foundation
 *
 * GROUND-179 current States + GROUND-181 readiness Policy
 * → current readiness Basis (no ANY/ALL Result).
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
import type { DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment } from "../reality/declared-resource-availability-per-source-evidence-state-types.js";
import { buildDeclaredResourceAvailabilitySourceAggregationPolicySet } from "../reality/declared-resource-availability-source-aggregation-policy-core.js";
import { buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet } from "../reality/declared-resource-availability-source-aggregation-readiness-policy-core.js";
import type { DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment } from "../reality/declared-resource-availability-source-aggregation-readiness-policy-types.js";
import {
  DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS,
  buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet,
  declaredResourceAvailabilitySourceAggregationReadinessBasisKey,
} from "../reality/declared-resource-availability-source-aggregation-readiness-basis-core.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const RD = "a1111111-1111-4111-8111-111111111111";
const RD_B = "a2222222-2222-4222-8222-222222222222";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const AVAIL_C = "b3333333-3333-4333-8333-333333333333";
const AVAIL_D = "b4444444-4444-4444-8444-444444444444";
const ENTITY = "e1111111-1111-4111-8111-111111111111";
const EVAL_AT = "2026-09-02T12:00:00.000Z";
const EVAL_AT_B = "2026-09-03T12:00:00.000Z";
const FROM = "2026-09-01T00:00:00.000Z";
const FUTURE_FROM = "2026-10-01T00:00:00.000Z";
const PAST_UNTIL = "2026-08-01T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

const RULE =
  "REQUIRE_ALL_SELECTED_AVAILABILITY_SOURCE_EVIDENCE_STATES_PRESENT_AND_RESOLVED_BEFORE_AGGREGATION" as const;
const HOLDS =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION_HOLDS" as const;
const DNH =
  "SELECTED_AVAILABILITY_SOURCE_EVIDENCE_AGGREGATION_READINESS_CONDITION_DOES_NOT_HOLD" as const;
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

function make179(
  declarations: ResourceAvailabilityDeclaration[],
  evaluation_at = EVAL_AT
): DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment {
  return buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet({
    resource_availability_declarations: declarations,
    evaluation_at,
  });
}

function make181(params: {
  selected: string[];
  operator: "ANY" | "ALL";
  withReadiness?: boolean;
  resources?: ResourceDeclaration[];
  availabilities?: ResourceAvailabilityDeclaration[];
}): DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment {
  const resources = params.resources ?? [resource({ id: RD })];
  const availabilities =
    params.availabilities ??
    [
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
      availability({
        id: AVAIL_D,
        status: "UNAVAILABLE",
        declared_by: { kind: "system", label: "d" },
      }),
    ];

  const set180 = buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: resources,
    resource_availability_declarations: availabilities,
    specification: {
      policies: [
        {
          resource_declaration_id: RD,
          selected_availability_declaration_ids: params.selected,
          operator: params.operator,
        },
      ],
    },
  });

  const aggregationKey = set180.aggregation_policies[0]!.key;
  return buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet({
    availability_source_aggregation_policy_set: set180,
    specification: {
      policies:
        params.withReadiness === false
          ? []
          : [
              {
                availability_source_aggregation_policy_key: aggregationKey,
                rule: RULE,
              },
            ],
    },
  });
}

function make181NoAggregation(): DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment {
  const set180 = buildDeclaredResourceAvailabilitySourceAggregationPolicySet({
    resource_declarations: [resource({ id: RD })],
    resource_availability_declarations: [availability({ id: AVAIL_A })],
    specification: { policies: [] },
  });
  return buildDeclaredResourceAvailabilitySourceAggregationReadinessPolicySet({
    availability_source_aggregation_policy_set: set180,
    specification: { policies: [] },
  });
}

function build182(params: {
  evidence: DeclaredResourceAvailabilityPerSourceEvidenceStateSetAssessment;
  readiness: DeclaredResourceAvailabilitySourceAggregationReadinessPolicySetAssessment;
}) {
  return buildDeclaredResourceAvailabilitySourceAggregationReadinessBasisSet({
    per_source_availability_evidence_state_set: params.evidence,
    availability_source_aggregation_readiness_policy_set: params.readiness,
  });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function coreSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-readiness-basis-core.ts"
    ),
    "utf8"
  );
}

function typesSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-source-aggregation-readiness-basis-types.ts"
    ),
    "utf8"
  );
}

describe("GROUND-182 Declared Resource Availability Source Aggregation Readiness Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed deterministic order", () => {
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS[0],
      "AVAILABILITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("no aggregation Policy → NOT_APPLICABLE", () => {
    const set = build182({
      evidence: make179([availability({ id: AVAIL_A })]),
      readiness: make181NoAggregation(),
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
    );
    assert.equal(set.resource_assessments[0]!.readiness_basis, null);
    assert.equal(set.has_readiness_bases, false);
  });

  it("aggregation Policy but no readiness Policy → NO_POLICY", () => {
    const set = build182({
      evidence: make179([availability({ id: AVAIL_A })]),
      readiness: make181({
        selected: [AVAIL_A],
        operator: "ANY",
        withReadiness: false,
      }),
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_POLICY"
    );
    assert.equal(set.resource_assessments[0]!.readiness_basis, null);
  });

  it("single selected SUPPORTING → HOLDS", () => {
    const set = build182({
      evidence: make179([availability({ id: AVAIL_A, status: "AVAILABLE" })]),
      readiness: make181({ selected: [AVAIL_A], operator: "ANY" }),
    });
    const basis = set.resource_assessments[0]!.readiness_basis!;
    assert.equal(set.resource_assessments[0]!.status, "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT");
    assert.equal(basis.condition, HOLDS);
    assert.equal(basis.member_assessments[0]!.is_present, true);
    assert.equal(basis.member_assessments[0]!.is_resolved, true);
    assert.equal(
      basis.member_assessments[0]!.current_source_evidence_state_value,
      SUPPORTING
    );
  });

  it("single selected CONTRADICTING → HOLDS (not readiness failure)", () => {
    const set = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "UNAVAILABLE" }),
      ]),
      readiness: make181({ selected: [AVAIL_A], operator: "ALL" }),
    });
    const basis = set.readiness_bases[0]!;
    assert.equal(basis.condition, HOLDS);
    assert.equal(
      basis.member_assessments[0]!.current_source_evidence_state_value,
      CONTRADICTING
    );
    assert.equal(basis.member_assessments[0]!.is_resolved, true);
  });

  it("single selected source missing → DNH", () => {
    const set = build182({
      evidence: make179([]),
      readiness: make181({ selected: [AVAIL_A], operator: "ANY" }),
    });
    const basis = set.readiness_bases[0]!;
    assert.equal(basis.condition, DNH);
    assert.equal(
      basis.member_assessments[0]!.status,
      "MISSING_CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE"
    );
    assert.equal(basis.member_assessments[0]!.is_present, false);
    assert.equal(basis.member_assessments[0]!.is_resolved, false);
  });

  it("multi-member all SUPPORTING → HOLDS", () => {
    const set = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "AVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "AVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
      }),
    });
    assert.equal(set.readiness_bases[0]!.condition, HOLDS);
  });

  it("multi-member all CONTRADICTING → HOLDS", () => {
    const set = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "UNAVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
      }),
    });
    assert.equal(set.readiness_bases[0]!.condition, HOLDS);
  });

  it("mixed SUPPORTING / CONTRADICTING → HOLDS", () => {
    const set = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "AVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
      }),
    });
    assert.equal(set.readiness_bases[0]!.condition, HOLDS);
  });

  it("ANY with one SUPPORTING + one missing → DNH (no short-circuit)", () => {
    const set = build182({
      evidence: make179([availability({ id: AVAIL_A, status: "AVAILABLE" })]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
      }),
    });
    const basis = set.readiness_bases[0]!;
    assert.equal(basis.condition, DNH);
    assert.equal(basis.operator, "ANY");
    assert.equal(basis.member_assessments.length, 2);
    assert.equal(basis.member_assessments[0]!.is_present, true);
    assert.equal(basis.member_assessments[1]!.is_present, false);
  });

  it("ANY with one CONTRADICTING + one missing → DNH", () => {
    const set = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "UNAVAILABLE" }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
      }),
    });
    assert.equal(set.readiness_bases[0]!.condition, DNH);
  });

  it("ALL with CONTRADICTING + all others present → HOLDS", () => {
    const set = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "UNAVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "AVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
      }),
    });
    assert.equal(set.readiness_bases[0]!.condition, HOLDS);
  });

  it("ALL with one missing → DNH", () => {
    const set = build182({
      evidence: make179([availability({ id: AVAIL_A })]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
      }),
    });
    assert.equal(set.readiness_bases[0]!.condition, DNH);
  });

  it("one missing among many materializes all members", () => {
    const set = build182({
      evidence: make179([
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_C,
          declared_by: { kind: "system", label: "c" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B, AVAIL_C],
        operator: "ANY",
      }),
    });
    const members = set.readiness_bases[0]!.member_assessments;
    assert.equal(members.length, 3);
    assert.equal(members[0]!.is_present, true);
    assert.equal(members[1]!.status, "MISSING_CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE");
    assert.equal(members[2]!.is_present, true);
    assert.equal(set.readiness_bases[0]!.condition, DNH);
  });

  it("multiple missing members all preserved", () => {
    const set = build182({
      evidence: make179([availability({ id: AVAIL_A })]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B, AVAIL_C],
        operator: "ALL",
      }),
    });
    const missing = set.readiness_bases[0]!.member_assessments.filter(
      (m) => !m.is_present
    );
    assert.equal(missing.length, 2);
    assert.equal(set.readiness_bases[0]!.condition, DNH);
  });

  it("all missing → DNH", () => {
    const set = build182({
      evidence: make179([]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
      }),
    });
    assert.equal(set.readiness_bases[0]!.condition, DNH);
    assert.ok(
      set.readiness_bases[0]!.member_assessments.every((m) => !m.is_present)
    );
  });

  it("empty current GROUND-179 Set with Policy → Basis PRESENT / DNH", () => {
    const set = build182({
      evidence: make179([]),
      readiness: make181({ selected: [AVAIL_A], operator: "ANY" }),
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
    );
    assert.equal(set.readiness_bases[0]!.condition, DNH);
    assert.notEqual(
      set.resource_assessments[0]!.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_POLICY"
    );
  });

  it("new unselected current source does not alter Basis identity/result", () => {
    const readiness = make181({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
    });
    const withoutExtra = build182({
      evidence: make179([
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness,
    });
    const withExtra = build182({
      evidence: make179([
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
      ]),
      readiness,
    });
    assert.equal(
      withoutExtra.readiness_bases[0]!.key,
      withExtra.readiness_bases[0]!.key
    );
    assert.equal(withoutExtra.readiness_bases[0]!.condition, HOLDS);
    assert.equal(withExtra.readiness_bases[0]!.condition, HOLDS);
  });

  it("selected current State appears may change DNH→HOLDS and identity", () => {
    const readiness = make181({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ANY",
    });
    const missing = build182({
      evidence: make179([availability({ id: AVAIL_A })]),
      readiness,
    });
    const present = build182({
      evidence: make179([
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness,
    });
    assert.equal(missing.readiness_bases[0]!.condition, DNH);
    assert.equal(present.readiness_bases[0]!.condition, HOLDS);
    assert.notEqual(
      missing.readiness_bases[0]!.key,
      present.readiness_bases[0]!.key
    );
  });

  it("selected current State disappears may change HOLDS→DNH and identity", () => {
    const readiness = make181({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
    });
    const present = build182({
      evidence: make179([
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness,
    });
    const gone = build182({
      evidence: make179([availability({ id: AVAIL_A })]),
      readiness,
    });
    assert.equal(present.readiness_bases[0]!.condition, HOLDS);
    assert.equal(gone.readiness_bases[0]!.condition, DNH);
    assert.notEqual(
      present.readiness_bases[0]!.key,
      gone.readiness_bases[0]!.key
    );
  });

  it("same HOLDS / different polarity lineage → distinct Basis", () => {
    const readiness = make181({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
    });
    const a = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "AVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness,
    });
    const b = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "UNAVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "AVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness,
    });
    assert.equal(a.readiness_bases[0]!.condition, HOLDS);
    assert.equal(b.readiness_bases[0]!.condition, HOLDS);
    assert.notEqual(a.readiness_bases[0]!.key, b.readiness_bases[0]!.key);
  });

  it("same DNH / different missing-member set → distinct Basis", () => {
    const readiness = make181({
      selected: [AVAIL_A, AVAIL_B, AVAIL_C],
      operator: "ANY",
    });
    const missB = build182({
      evidence: make179([
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_C,
          declared_by: { kind: "system", label: "c" },
        }),
      ]),
      readiness,
    });
    const missC = build182({
      evidence: make179([
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness,
    });
    assert.equal(missB.readiness_bases[0]!.condition, DNH);
    assert.equal(missC.readiness_bases[0]!.condition, DNH);
    assert.notEqual(
      missB.readiness_bases[0]!.key,
      missC.readiness_bases[0]!.key
    );
  });

  it("different evaluation_at → distinct Basis identity", () => {
    const readiness = make181({ selected: [AVAIL_A], operator: "ANY" });
    const a = build182({
      evidence: make179([availability({ id: AVAIL_A })], EVAL_AT),
      readiness,
    });
    const b = build182({
      evidence: make179([availability({ id: AVAIL_A })], EVAL_AT_B),
      readiness,
    });
    assert.notEqual(a.readiness_bases[0]!.key, b.readiness_bases[0]!.key);
    assert.equal(a.evaluation_at, EVAL_AT);
    assert.equal(b.evaluation_at, EVAL_AT_B);
  });

  it("ANY vs ALL lineage sensitivity → distinct Basis", () => {
    const anySet = build182({
      evidence: make179([
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
      }),
    });
    const allSet = build182({
      evidence: make179([
        availability({ id: AVAIL_A }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
      }),
    });
    assert.equal(anySet.readiness_bases[0]!.condition, HOLDS);
    assert.equal(allSet.readiness_bases[0]!.condition, HOLDS);
    assert.notEqual(
      anySet.readiness_bases[0]!.key,
      allSet.readiness_bases[0]!.key
    );
  });

  it("duplicate current State for one declaration ID rejects", () => {
    const evidence = make179([availability({ id: AVAIL_A })]);
    const dup = deepClone(evidence.source_evidence_states[0]!);
    evidence.source_evidence_states.push({
      ...dup,
      key: `${dup.key}|dup`,
    });
    assert.throws(
      () =>
        build182({
          evidence,
          readiness: make181({ selected: [AVAIL_A], operator: "ANY" }),
        }),
      /Duplicate current GROUND-179/
    );
  });

  it("current State wrong ResourceDeclaration rejects", () => {
    const evidence = make179([
      availability({ id: AVAIL_A, resource_declaration_id: RD_B }),
    ]);
    assert.throws(
      () =>
        build182({
          evidence,
          readiness: make181({ selected: [AVAIL_A], operator: "ANY" }),
        }),
      /ResourceDeclaration/
    );
  });

  it("future/expired selected declarations yield missing current operands", () => {
    const set = build182({
      evidence: make179([
        availability({
          id: AVAIL_A,
          valid_from: FUTURE_FROM,
        }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          valid_from: "2026-07-01T00:00:00.000Z",
          valid_until: PAST_UNTIL,
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ALL",
        availabilities: [
          availability({ id: AVAIL_A, valid_from: FUTURE_FROM }),
          availability({
            id: AVAIL_B,
            status: "UNAVAILABLE",
            valid_from: "2026-07-01T00:00:00.000Z",
            valid_until: PAST_UNTIL,
            declared_by: { kind: "system", label: "b" },
          }),
        ],
      }),
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
    );
    assert.equal(set.readiness_bases[0]!.condition, DNH);
    assert.ok(
      set.readiness_bases[0]!.member_assessments.every((m) => !m.is_present)
    );
  });

  it("input immutability / deep-clone / ordering invariance", () => {
    const evidence = make179([
      availability({ id: AVAIL_B, status: "UNAVAILABLE", declared_by: { kind: "system", label: "b" } }),
      availability({ id: AVAIL_A }),
    ]);
    const readiness = make181({
      selected: [AVAIL_A, AVAIL_B],
      operator: "ALL",
    });
    const snap = {
      evidence: deepClone(evidence),
      readiness: deepClone(readiness),
    };
    const a = build182({ evidence, readiness });
    assert.deepEqual(evidence, snap.evidence);
    assert.deepEqual(readiness, snap.readiness);
    const b = build182({
      evidence: deepClone(evidence),
      readiness: deepClone(readiness),
    });
    assert.equal(a.readiness_bases[0]!.key, b.readiness_bases[0]!.key);
  });

  it("no raw declaration / active-at / Assessment / Result / ProjectState", () => {
    const core = coreSource();
    const types = typesSource();
    assert.ok(!/ResourceAvailabilityDeclaration/.test(core));
    assert.ok(!/isResourceAvailabilityActiveAt/.test(core));
    assert.ok(!/ResourceAvailabilityAssessment/.test(core));
    assert.ok(!/COMPOSITION_CONDITION_HOLDS/.test(types));
    assert.ok(!/UNRESOLVED_NO_CURRENT_AVAILABILITY_EVIDENCE/.test(types));
    assert.ok(!/^import .*ProjectState/m.test(core));
    assert.ok(!/applyPatch|saveProject/.test(core));
    assert.ok(!/executeAny|executeAll/.test(core));
  });

  it("BASIS_PRESENT does not imply readiness HOLDS", () => {
    const set = build182({
      evidence: make179([]),
      readiness: make181({ selected: [AVAIL_A], operator: "ANY" }),
    });
    assert.equal(
      set.resource_assessments[0]!.status,
      "DECLARED_RESOURCE_AVAILABILITY_SOURCE_AGGREGATION_READINESS_BASIS_PRESENT"
    );
    assert.equal(set.resource_assessments[0]!.readiness_condition, DNH);
  });

  it("Basis key excludes whole GROUND-179 Set hash / unselected sources", () => {
    const key = declaredResourceAvailabilitySourceAggregationReadinessBasisKey({
      resource_declaration_id: RD,
      evaluation_at: EVAL_AT,
      availability_source_aggregation_policy_key: "agg",
      availability_source_aggregation_readiness_policy_key: "ready",
      readiness_rule: RULE,
      operator: "ANY",
      selected_availability_declaration_ids: [AVAIL_A],
      member_assessments: [
        {
          availability_declaration_id: AVAIL_A,
          status: "CURRENT_AVAILABILITY_SOURCE_EVIDENCE_STATE_PRESENT_AND_RESOLVED",
          current_source_evidence_state_key: "state-a",
          current_source_evidence_state_value: SUPPORTING,
          is_present: true,
          is_resolved: true,
        },
      ],
      condition: HOLDS,
    });
    assert.ok(!/source_evidence_states/.test(key));
    assert.match(key, /declared-resource-availability-source-aggregation-readiness-basis/);
  });

  it("preserves exact current State polarity lineage without executing ANY/ALL", () => {
    const set = build182({
      evidence: make179([
        availability({ id: AVAIL_A, status: "AVAILABLE" }),
        availability({
          id: AVAIL_B,
          status: "UNAVAILABLE",
          declared_by: { kind: "system", label: "b" },
        }),
      ]),
      readiness: make181({
        selected: [AVAIL_A, AVAIL_B],
        operator: "ANY",
      }),
    });
    const basis = set.readiness_bases[0]!;
    assert.equal(basis.condition, HOLDS);
    assert.equal(
      basis.member_assessments[0]!.current_source_evidence_state_value,
      SUPPORTING
    );
    assert.equal(
      basis.member_assessments[1]!.current_source_evidence_state_value,
      CONTRADICTING
    );
    assert.ok(!("aggregation_result" in basis));
    assert.ok(!("result" in basis));
  });
});
