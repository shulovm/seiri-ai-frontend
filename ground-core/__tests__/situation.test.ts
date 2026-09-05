import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  buildSituation,
  detectSalienceSignals,
  getSituationForSubject,
} from "../reality/situation.js";
import type { Situation } from "../reality/situation-types.js";
import { applyPatch } from "../state-engine.js";
import type {
  Claim,
  ProjectState,
  RealityEntity,
  RealityEvent,
  RealityState,
} from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_ID = "d1010101-0101-4101-8101-010101010101";
const OTHER_ENTITY_ID = "d1010101-0101-4101-8101-010101010102";
const CLAIM_A = "d4040404-0404-4404-8404-040404040401";
const CLAIM_B = "d4040404-0404-4404-8404-040404040402";
const EVENT_A = "d2020202-0202-4202-8202-020202020201";
const EVENT_B = "d2020202-0202-4202-8202-020202020202";
const EVENT_UNKNOWN = "d2020202-0202-4202-8202-020202020203";
const STATE_NORMAL = "d3030303-0303-4303-8303-030303030301";
const STATE_LEAKING = "d3030303-0303-4303-8303-030303030302";
const STATE_OTHER = "d3030303-0303-4303-8303-030303030303";
const TS = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";

function entity(overrides: Partial<RealityEntity> = {}): RealityEntity {
  return {
    id: ENTITY_ID,
    project_id: PROJECT_ID,
    kind: "asset",
    label: "pipe-A",
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function claim(overrides: Partial<Claim> = {}): Claim {
  return {
    id: CLAIM_A,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    predicate_kind: "state",
    predicate: "condition",
    value: "normal",
    provenance: { kind: "human" },
    confidence: 0.7,
    applicable_from: "2026-08-24T00:00:00.000Z",
    applicable_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function event(overrides: Partial<RealityEvent> = {}): RealityEvent {
  return {
    id: EVENT_A,
    project_id: PROJECT_ID,
    kind: "pipe_rupture",
    subject_ids: [ENTITY_ID],
    occurred_at: AT,
    recorded_at: TS,
    summary: "rupture",
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function state(overrides: Partial<RealityState> = {}): RealityState {
  return {
    id: STATE_NORMAL,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    kind: "condition",
    value: "normal",
    valid_from: "2026-08-24T00:00:00.000Z",
    valid_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function projectWith(input: {
  entities?: RealityEntity[];
  events?: RealityEvent[];
  states?: RealityState[];
  claims?: Claim[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [entity()],
    reality_events: input.events ?? [],
    reality_states: input.states ?? [],
    claims: input.claims ?? [],
  };
}

function assertNoForbidden(situation: Situation) {
  const json = JSON.stringify(situation);
  for (const forbidden of [
    "priority",
    "urgency",
    "risk_score",
    "impact_score",
    "attention_score",
    "information_gain",
    "recommended_action",
    "decision",
  ]) {
    assert.ok(
      !json.includes(`"${forbidden}"`),
      `forbidden field ${forbidden}`
    );
  }
}

describe("Situation / Salience (GROUND-009)", () => {
  it("basic quiet/active Situation with stable state and no unresolved signals", () => {
    const project = projectWith({
      states: [state()],
      // No Claims → no invented epistemic gaps; active state is context only.
      claims: [],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.equal(situation.entity.id, ENTITY_ID);
    assert.equal(situation.ontic_context.active_states.length, 1);
    assert.equal(situation.ontic_context.active_states[0]?.id, STATE_NORMAL);
    assert.equal(situation.has_unresolved, false);
    assert.equal(situation.status, "ACTIVE");
    assert.equal(situation.salience_signals.length, 0);
    assert.equal(situation.predicate_scopes.length, 0);
    assertNoForbidden(situation);
  });

  it("STATE_CONFLICT with exact state IDs — no resolution", () => {
    const project = projectWith({
      states: [
        state({
          id: STATE_NORMAL,
          value: "normal",
          valid_from: "2026-08-24T00:00:00.000Z",
          valid_until: null,
        }),
        state({
          id: STATE_LEAKING,
          value: "leaking",
          valid_from: "2026-08-24T00:00:00.000Z",
          valid_until: null,
        }),
      ],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    const conflictSignals = situation.salience_signals.filter(
      (s) => s.kind === "STATE_CONFLICT"
    );
    assert.equal(conflictSignals.length, 1);
    assert.deepEqual(conflictSignals[0]?.state_ids, [
      STATE_LEAKING,
      STATE_NORMAL,
    ].sort());
    assert.equal(situation.status, "UNRESOLVED");
    assert.equal(situation.has_unresolved, true);
  });

  it("EPISTEMIC_CONTEST for conflicting Claims", () => {
    const project = projectWith({
      claims: [
        claim({ id: CLAIM_A, value: "normal" }),
        claim({ id: CLAIM_B, value: "leaking" }),
      ],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.ok(
      situation.salience_signals.some((s) => s.kind === "EPISTEMIC_CONTEST")
    );
    const contested = situation.epistemic_context.belief_assessments.find(
      (b) => b.status === "CONTESTED"
    );
    assert.ok(contested);
    assert.equal(contested?.status, "CONTESTED");
    assert.equal(situation.status, "UNRESOLVED");
  });

  it("EPISTEMIC_GAP NO_APPLICABLE_CLAIMS for explicit missing predicate", () => {
    const project = projectWith({
      claims: [claim({ predicate: "condition" })],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
      predicateScopes: [
        { predicateKind: "state", predicate: "temperature" },
      ],
    });
    const gapSignal = situation.salience_signals.find(
      (s) => s.kind === "EPISTEMIC_GAP"
    );
    assert.ok(gapSignal);
    assert.ok(gapSignal?.gap_kinds.includes("NO_APPLICABLE_CLAIMS"));
    assert.ok(
      situation.epistemic_context.gaps.some(
        (g) => g.kind === "NO_APPLICABLE_CLAIMS" && g.predicate === "temperature"
      )
    );
  });

  it("OPEN_INQUIRY propagates from Gap without persistence", () => {
    const project = projectWith({ claims: [] });
    const before = JSON.stringify(project);
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
      predicateScopes: [
        { predicateKind: "state", predicate: "condition" },
      ],
    });
    const open = situation.salience_signals.find(
      (s) => s.kind === "OPEN_INQUIRY"
    );
    assert.ok(open);
    assert.equal(open?.inquiry_keys.length, 1);
    assert.equal(situation.inquiry_context.inquiries.length, 1);
    assert.equal(JSON.stringify(project), before);
    assert.equal(
      (project as ProjectState & { inquiries?: unknown[] }).inquiries,
      undefined
    );
  });

  it("OBSERVATION_NEED propagates from Inquiry — no Task", () => {
    const project = projectWith({ claims: [] });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
      predicateScopes: [
        { predicateKind: "state", predicate: "condition" },
      ],
    });
    const needSignal = situation.salience_signals.find(
      (s) => s.kind === "OBSERVATION_NEED"
    );
    assert.ok(needSignal);
    assert.equal(needSignal?.observation_need_keys.length, 1);
    assert.ok(situation.inquiry_context.observation_needs.length >= 1);
    assertNoForbidden(situation);
  });

  it("unknown-time Event → unplaced_events + UNPLACED_EVENT", () => {
    const project = projectWith({
      events: [
        event({
          id: EVENT_UNKNOWN,
          occurred_at: null,
        }),
      ],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.equal(situation.ontic_context.unplaced_events.length, 1);
    assert.equal(
      situation.ontic_context.unplaced_events[0]?.occurred_at,
      null
    );
    assert.ok(
      situation.salience_signals.some((s) => s.kind === "UNPLACED_EVENT")
    );
    assert.equal(situation.ontic_context.events.length, 0);
  });

  it("explicit event window includes inside and excludes outside (half-open)", () => {
    const inside = "2026-08-24T11:00:00.000Z";
    const boundaryUntil = "2026-08-24T12:00:00.000Z";
    const outside = "2026-08-24T12:00:00.000Z";
    const project = projectWith({
      events: [
        event({ id: EVENT_A, occurred_at: inside }),
        event({ id: EVENT_B, occurred_at: outside }),
      ],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
      eventWindow: {
        from: "2026-08-24T10:00:00.000Z",
        until: boundaryUntil,
      },
    });
    assert.deepEqual(
      situation.ontic_context.events.map((e) => e.id),
      [EVENT_A]
    );
    assert.ok(
      situation.salience_signals.some((s) => s.kind === "ONTIC_EVENT_PRESENT")
    );
  });

  it("without event window, only Events exactly at `at` are included", () => {
    const project = projectWith({
      events: [
        event({ id: EVENT_A, occurred_at: AT }),
        event({
          id: EVENT_B,
          occurred_at: "2026-08-24T10:00:00.000Z",
        }),
      ],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.deepEqual(
      situation.ontic_context.events.map((e) => e.id),
      [EVENT_A]
    );
  });

  it("does not invent missing predicates from Claim-derived scopes", () => {
    const project = projectWith({
      claims: [claim({ predicate: "condition" })],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.ok(
      !situation.epistemic_context.gaps.some(
        (g) => g.predicate === "temperature"
      )
    );
    assert.deepEqual(
      situation.predicate_scopes.map((s) => s.predicate),
      ["condition"]
    );
  });

  it("subject isolation — other Entity records excluded", () => {
    const project = projectWith({
      entities: [
        entity(),
        entity({ id: OTHER_ENTITY_ID, label: "pipe-B" }),
      ],
      states: [
        state(),
        state({
          id: STATE_OTHER,
          subject_id: OTHER_ENTITY_ID,
          value: "leaking",
        }),
      ],
      events: [
        event({ id: EVENT_A }),
        event({
          id: EVENT_B,
          subject_ids: [OTHER_ENTITY_ID],
          occurred_at: AT,
        }),
      ],
      claims: [
        claim({ id: CLAIM_A }),
        claim({
          id: CLAIM_B,
          subject_id: OTHER_ENTITY_ID,
          value: "leaking",
        }),
      ],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.ok(
      situation.ontic_context.active_states.every(
        (s) => s.subject_id === ENTITY_ID
      )
    );
    assert.ok(
      situation.ontic_context.events.every((e) =>
        e.subject_ids.includes(ENTITY_ID)
      )
    );
    assert.ok(
      situation.epistemic_context.belief_assessments.every(
        (b) => b.subject_id === ENTITY_ID
      )
    );
    assert.ok(
      !situation.ontic_context.active_states.some((s) => s.id === STATE_OTHER)
    );
    assert.ok(
      !situation.ontic_context.events.some((e) => e.id === EVENT_B)
    );
  });

  it("determinism — repeated query deepEqual including key and signal order", () => {
    const project = projectWith({
      states: [
        state({ id: STATE_NORMAL, value: "normal" }),
        state({ id: STATE_LEAKING, value: "leaking" }),
      ],
      claims: [
        claim({ id: CLAIM_A, value: "normal" }),
        claim({ id: CLAIM_B, value: "leaking" }),
      ],
      events: [event({ occurred_at: null, id: EVENT_UNKNOWN })],
    });
    const query = {
      subjectId: ENTITY_ID,
      at: AT,
      eventWindow: {
        from: "2026-08-24T00:00:00.000Z",
        until: "2026-08-25T00:00:00.000Z",
      },
    };
    const a = buildSituation(project, query);
    const b = buildSituation(project, query);
    assert.deepEqual(a, b);
    assert.ok(a.key.startsWith("sit|"));
    assert.deepEqual(
      a.salience_signals.map((s) => s.key),
      b.salience_signals.map((s) => s.key)
    );
  });

  it("read-only — ProjectState unchanged after Situation construction", () => {
    const project = projectWith({
      claims: [
        claim({ id: CLAIM_A, value: "normal" }),
        claim({ id: CLAIM_B, value: "leaking" }),
      ],
    });
    const before = JSON.stringify(project);
    buildSituation(project, { subjectId: ENTITY_ID, at: AT });
    detectSalienceSignals(project, { subjectId: ENTITY_ID, at: AT });
    getSituationForSubject(project, ENTITY_ID, AT);
    assert.equal(JSON.stringify(project), before);
  });

  it("layer reuse + import guards + no forbidden concepts", () => {
    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/situation.ts"),
      "utf8"
    );
    assert.ok(src.includes("getRealityWorldline") || src.includes("getRealityStatesAt"));
    assert.ok(src.includes("detectRealityStateConflicts"));
    assert.ok(src.includes("assessBeliefAt") || src.includes("getBeliefAssessmentsForSubject"));
    assert.ok(
      src.includes("assessEpistemicGapsAt") ||
        src.includes("getEpistemicGapsForSubject")
    );
    assert.ok(
      src.includes("formulateInquiryAt") || src.includes("getInquiriesForSubject")
    );
    assert.ok(
      src.includes("deriveObservationNeedsForInquiry") ||
        src.includes("getObservationNeedsForSubject")
    );
    assert.ok(!/\brandomUUID\s*\(/.test(src));
    assert.ok(!/\bDate\.now\s*\(/.test(src));
    const imports = src.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert.ok(
      !imports.some((line) =>
        /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );

    const project = projectWith({
      claims: [claim({ id: CLAIM_A, value: "normal" }), claim({ id: CLAIM_B, value: "leaking" })],
    });
    assertNoForbidden(
      buildSituation(project, { subjectId: ENTITY_ID, at: AT })
    );
  });

  it("schema remains 0.1.4 — Situation not persisted via patch", () => {
    const base = projectWith({});
    assert.equal(base.schema_version, "0.1.24");
    const next = applyPatch(base, {
      schema_version: "0.1.24",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "reality_entity",
          entity_id: ENTITY_ID,
          payload: entity(),
        },
      ],
    });
    assert.equal(next.schema_version, "0.1.24");
    assert.equal(
      (next as ProjectState & { situations?: unknown }).situations,
      undefined
    );
  });
});
