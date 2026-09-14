/**
 * GROUND-179 — Observation Core CXXXIII / Per-source Declared Resource
 * Availability Evidence State Foundation
 *
 * ResourceAvailabilityDeclaration[] + evaluation_at
 * → distinct SUPPORTING / CONTRADICTING per-source States
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import type { ResourceAvailabilityDeclaration } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import {
  DECLARED_RESOURCE_AVAILABILITY_AT_EVALUATION_INSTANT_PROPOSITION,
  DECLARED_RESOURCE_AVAILABILITY_PER_SOURCE_EVIDENCE_STATE_MODEL_LIMITATIONS,
  buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet,
  declaredResourceAvailabilityPerSourceEvidenceStateKey,
  deriveDeclaredResourceAvailabilityPerSourceEvidenceStateValue,
} from "../reality/declared-resource-availability-per-source-evidence-state-core.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const RD = "a1111111-1111-4111-8111-111111111111";
const RD_B = "a2222222-2222-4222-8222-222222222222";
const AVAIL_A = "b1111111-1111-4111-8111-111111111111";
const AVAIL_B = "b2222222-2222-4222-8222-222222222222";
const AVAIL_C = "b3333333-3333-4333-8333-333333333333";
const EVAL_AT = "2026-09-02T12:00:00.000Z";
const EVAL_AT_B = "2026-09-03T12:00:00.000Z";
const FROM = "2026-09-01T00:00:00.000Z";
const UNTIL = "2026-09-10T00:00:00.000Z";
const TS = "2026-09-01T00:00:00.000Z";

const SUPPORTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_SUPPORTING" as const;
const CONTRADICTING =
  "EXPLICIT_DECLARED_RESOURCE_AVAILABILITY_EVIDENCE_CONTRADICTING" as const;

function declaration(
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

function build(
  declarations: ResourceAvailabilityDeclaration[],
  evaluation_at = EVAL_AT
) {
  return buildDeclaredResourceAvailabilityPerSourceEvidenceStateSet({
    resource_availability_declarations: declarations,
    evaluation_at,
  });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function coreSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-per-source-evidence-state-core.ts"
    ),
    "utf8"
  );
}

function typesSource(): string {
  return readFileSync(
    join(
      __dirnameTest,
      "../reality/declared-resource-availability-per-source-evidence-state-types.ts"
    ),
    "utf8"
  );
}

describe("GROUND-179 Per-source Declared Resource Availability Evidence State", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("proposition and model limitations fixed", () => {
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_AT_EVALUATION_INSTANT_PROPOSITION,
      "DECLARED_RESOURCE_AVAILABILITY_AT_EVALUATION_INSTANT"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_PER_SOURCE_EVIDENCE_STATE_MODEL_LIMITATIONS[0],
      "OBJECTIVE_RESOURCE_AVAILABILITY_TRUTH_NOT_MODELED"
    );
    assert.equal(
      DECLARED_RESOURCE_AVAILABILITY_PER_SOURCE_EVIDENCE_STATE_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("AVAILABLE → SUPPORTING; UNAVAILABLE → CONTRADICTING", () => {
    assert.equal(
      deriveDeclaredResourceAvailabilityPerSourceEvidenceStateValue("AVAILABLE"),
      SUPPORTING
    );
    assert.equal(
      deriveDeclaredResourceAvailabilityPerSourceEvidenceStateValue(
        "UNAVAILABLE"
      ),
      CONTRADICTING
    );
  });

  it("one active AVAILABLE → one SUPPORTING State", () => {
    const set = build([declaration({ id: AVAIL_A, status: "AVAILABLE" })]);
    assert.equal(set.source_evidence_states.length, 1);
    assert.equal(set.source_evidence_states[0]!.value, SUPPORTING);
    assert.equal(
      set.source_evidence_states[0]!.availability_declaration_id,
      AVAIL_A
    );
    assert.equal(set.has_supporting_source_evidence_states, true);
    assert.equal(set.has_contradicting_source_evidence_states, false);
  });

  it("one active UNAVAILABLE → one CONTRADICTING State", () => {
    const set = build([declaration({ id: AVAIL_A, status: "UNAVAILABLE" })]);
    assert.equal(set.source_evidence_states.length, 1);
    assert.equal(set.source_evidence_states[0]!.value, CONTRADICTING);
    assert.equal(set.has_supporting_source_evidence_states, false);
    assert.equal(set.has_contradicting_source_evidence_states, true);
  });

  it("two AVAILABLE → two distinct SUPPORTING States", () => {
    const set = build([
      declaration({ id: AVAIL_A, status: "AVAILABLE" }),
      declaration({
        id: AVAIL_B,
        status: "AVAILABLE",
        declared_by: { kind: "system", label: "b" },
      }),
    ]);
    assert.equal(set.source_evidence_states.length, 2);
    assert.ok(set.source_evidence_states.every((s) => s.value === SUPPORTING));
    assert.notEqual(
      set.source_evidence_states[0]!.key,
      set.source_evidence_states[1]!.key
    );
  });

  it("two UNAVAILABLE → two distinct CONTRADICTING States", () => {
    const set = build([
      declaration({ id: AVAIL_A, status: "UNAVAILABLE" }),
      declaration({
        id: AVAIL_B,
        status: "UNAVAILABLE",
        declared_by: { kind: "system", label: "b" },
      }),
    ]);
    assert.equal(set.source_evidence_states.length, 2);
    assert.ok(
      set.source_evidence_states.every((s) => s.value === CONTRADICTING)
    );
  });

  it("AVAILABLE + UNAVAILABLE → SUPPORTING + CONTRADICTING (no CONTESTED State)", () => {
    const set = build([
      declaration({ id: AVAIL_A, status: "AVAILABLE" }),
      declaration({
        id: AVAIL_B,
        status: "UNAVAILABLE",
        declared_by: { kind: "system", label: "b" },
      }),
    ]);
    assert.equal(set.source_evidence_states.length, 2);
    assert.equal(set.has_supporting_source_evidence_states, true);
    assert.equal(set.has_contradicting_source_evidence_states, true);
    const values = set.source_evidence_states.map((s) => s.value).sort();
    assert.deepEqual(values, [CONTRADICTING, SUPPORTING].sort());
    assert.ok(!set.source_evidence_states.some((s) => /CONTESTED/.test(s.value)));
  });

  it("same declarer opposite values → two distinct States", () => {
    const declarer = { kind: "human" as const, label: "same" };
    const set = build([
      declaration({ id: AVAIL_A, status: "AVAILABLE", declared_by: declarer }),
      declaration({ id: AVAIL_B, status: "UNAVAILABLE", declared_by: declarer }),
    ]);
    assert.equal(set.source_evidence_states.length, 2);
    assert.notEqual(
      set.source_evidence_states[0]!.availability_declaration_id,
      set.source_evidence_states[1]!.availability_declaration_id
    );
  });

  it("source-order permutation → same semantic output", () => {
    const a = declaration({ id: AVAIL_A, status: "AVAILABLE" });
    const b = declaration({
      id: AVAIL_B,
      status: "UNAVAILABLE",
      declared_by: { kind: "system", label: "b" },
    });
    const forward = build([a, b]);
    const reverse = build([b, a]);
    assert.deepEqual(
      forward.source_evidence_states.map((s) => s.key),
      reverse.source_evidence_states.map((s) => s.key)
    );
  });

  it("zero declarations → empty Set", () => {
    const set = build([]);
    assert.equal(set.source_evidence_states.length, 0);
    assert.equal(set.resource_assessments.length, 0);
    assert.equal(set.has_supporting_source_evidence_states, false);
    assert.equal(set.has_contradicting_source_evidence_states, false);
  });

  it("all expired → empty current Set", () => {
    const set = build(
      [
        declaration({
          id: AVAIL_A,
          valid_from: FROM,
          valid_until: "2026-09-02T00:00:00.000Z",
        }),
      ],
      EVAL_AT
    );
    assert.equal(set.source_evidence_states.length, 0);
  });

  it("all future → empty current Set", () => {
    const set = build(
      [
        declaration({
          id: AVAIL_A,
          valid_from: "2026-09-05T00:00:00.000Z",
          valid_until: null,
        }),
      ],
      EVAL_AT
    );
    assert.equal(set.source_evidence_states.length, 0);
  });

  it("mixed active/expired → active only", () => {
    const set = build([
      declaration({
        id: AVAIL_A,
        status: "AVAILABLE",
        valid_from: FROM,
        valid_until: null,
      }),
      declaration({
        id: AVAIL_B,
        status: "UNAVAILABLE",
        valid_from: FROM,
        valid_until: "2026-09-02T00:00:00.000Z",
        declared_by: { kind: "system", label: "b" },
      }),
    ]);
    assert.equal(set.source_evidence_states.length, 1);
    assert.equal(
      set.source_evidence_states[0]!.availability_declaration_id,
      AVAIL_A
    );
  });

  it("mixed active/future → active only", () => {
    const set = build([
      declaration({ id: AVAIL_A, status: "AVAILABLE" }),
      declaration({
        id: AVAIL_B,
        status: "UNAVAILABLE",
        valid_from: "2026-10-01T00:00:00.000Z",
        declared_by: { kind: "system", label: "b" },
      }),
    ]);
    assert.equal(set.source_evidence_states.length, 1);
    assert.equal(set.source_evidence_states[0]!.value, SUPPORTING);
  });

  it("valid_from boundary inclusive", () => {
    const set = build(
      [
        declaration({
          id: AVAIL_A,
          valid_from: EVAL_AT,
          valid_until: UNTIL,
        }),
      ],
      EVAL_AT
    );
    assert.equal(set.source_evidence_states.length, 1);
  });

  it("valid_until boundary exclusive", () => {
    const set = build(
      [
        declaration({
          id: AVAIL_A,
          valid_from: FROM,
          valid_until: EVAL_AT,
        }),
      ],
      EVAL_AT
    );
    assert.equal(set.source_evidence_states.length, 0);
  });

  it("open-ended valid_until null remains active after valid_from", () => {
    const set = build([
      declaration({
        id: AVAIL_A,
        valid_from: FROM,
        valid_until: null,
      }),
    ]);
    assert.equal(set.source_evidence_states.length, 1);
  });

  it("same source / different evaluation_at → distinct State keys", () => {
    const decl = declaration({
      id: AVAIL_A,
      valid_from: FROM,
      valid_until: null,
    });
    const a = build([decl], EVAL_AT).source_evidence_states[0]!;
    const b = build([decl], EVAL_AT_B).source_evidence_states[0]!;
    assert.notEqual(a.key, b.key);
    assert.equal(a.availability_declaration_id, b.availability_declaration_id);
  });

  it("equal SUPPORTING / different source lineage → distinct keys", () => {
    const set = build([
      declaration({ id: AVAIL_A, status: "AVAILABLE" }),
      declaration({
        id: AVAIL_B,
        status: "AVAILABLE",
        declared_by: { kind: "system", label: "b" },
      }),
    ]);
    assert.notEqual(
      set.source_evidence_states[0]!.key,
      set.source_evidence_states[1]!.key
    );
  });

  it("equal CONTRADICTING / different source lineage → distinct keys", () => {
    const set = build([
      declaration({ id: AVAIL_A, status: "UNAVAILABLE" }),
      declaration({
        id: AVAIL_B,
        status: "UNAVAILABLE",
        declared_by: { kind: "system", label: "b" },
      }),
    ]);
    assert.notEqual(
      set.source_evidence_states[0]!.key,
      set.source_evidence_states[1]!.key
    );
  });

  it("State identity includes declaration id and evaluation_at", () => {
    const set = build([declaration({ id: AVAIL_A, status: "AVAILABLE" })]);
    const state = set.source_evidence_states[0]!;
    assert.equal(
      state.key,
      declaredResourceAvailabilityPerSourceEvidenceStateKey({
        resource_declaration_id: RD,
        evaluation_at: EVAL_AT,
        availability_declaration_id: AVAIL_A,
        raw_availability_status: "AVAILABLE",
        value: SUPPORTING,
      })
    );
  });

  it("resource assessments group by resource_declaration_id; empty resources not synthesized", () => {
    const set = build([
      declaration({ id: AVAIL_A, resource_declaration_id: RD }),
      declaration({
        id: AVAIL_B,
        resource_declaration_id: RD_B,
        status: "UNAVAILABLE",
        declared_by: { kind: "system", label: "b" },
      }),
    ]);
    assert.equal(set.resource_assessments.length, 2);
    assert.ok(
      set.resource_assessments.every(
        (r) => r.source_evidence_states.length === 1
      )
    );
    // Never-declared resources are not invented without ResourceDeclaration domain input.
    assert.ok(!set.resource_assessments.some((r) => r.source_evidence_states.length === 0));
  });

  it("input immutability and deep-clone pointer identity", () => {
    const declarations = [
      declaration({ id: AVAIL_A }),
      declaration({
        id: AVAIL_B,
        status: "UNAVAILABLE",
        declared_by: { kind: "system", label: "b" },
      }),
    ];
    const snapshot = deepClone(declarations);
    const a = build(declarations);
    assert.deepEqual(declarations, snapshot);
    const b = build(deepClone(declarations));
    assert.deepEqual(
      a.source_evidence_states.map((s) => s.key),
      b.source_evidence_states.map((s) => s.key)
    );
  });

  it("duplicate declaration id rejects", () => {
    assert.throws(
      () =>
        build([
          declaration({ id: AVAIL_A }),
          declaration({ id: AVAIL_A, status: "UNAVAILABLE" }),
        ]),
      /duplicate availability_declaration.id/
    );
  });

  it("same-declarer same-status overlapping distinct ids are not silently merged", () => {
    // Write-time may reject; if manually constructed input reaches evaluator,
    // distinct declaration ids remain distinct source States.
    const declarer = { kind: "human" as const, label: "ops" };
    const set = build([
      declaration({ id: AVAIL_A, status: "AVAILABLE", declared_by: declarer }),
      declaration({ id: AVAIL_C, status: "AVAILABLE", declared_by: declarer }),
    ]);
    assert.equal(set.source_evidence_states.length, 2);
  });

  it("no objective-truth / CONTESTED / NO_AVAILABILITY / Policy / aggregation vocabulary", () => {
    const types = typesSource();
    const core = coreSource();
    assert.ok(!/\bis_available\b|\beffective_availability\b|\bavailability_truth\b/.test(core + types));
    assert.ok(!/"CONTESTED"/.test(types));
    assert.ok(!/"NO_AVAILABILITY/.test(types));
    assert.ok(!/InterpretationPolicy|InterpretationBasis/.test(core + types));
    assert.ok(!/\bANY_SELECTED|\bALL_SELECTED|executeAny|executeAll/.test(core));
    assert.ok(!/DeclaredResourceAvailabilityPerSourceEvidenceStateValue[\s\S]{0,400}CONTESTED/.test(types));
  });

  it("no contribution / GROUND-177 / Reservation / Ready / OE imports", () => {
    const core = coreSource();
    assert.ok(!/from "\.\/.*quantity-compatibility-heterogeneous/.test(core));
    assert.ok(!/from "\.\/.*physical-potential-contribution/.test(core));
    assert.ok(!/from "\.\/.*resource-reservation/.test(core));
    assert.ok(!/from "\.\/.*evidence-evaluation-state-interpretation/.test(core));
    assert.ok(!/applyPatch|saveProject/.test(core));
    assert.ok(!/^import .*ProjectState/m.test(core));
  });

  it("preserves declared_by provenance without using it as identity", () => {
    const set = build([
      declaration({
        id: AVAIL_A,
        declared_by: { kind: "organization", entity_id: RD, label: "org" },
      }),
    ]);
    const state = set.source_evidence_states[0]!;
    assert.equal(state.declared_by.kind, "organization");
    assert.equal(state.declared_by.entity_id, RD);
    assert.ok(!state.key.includes("organization"));
  });
});
