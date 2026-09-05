import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { NotFoundError } from "../errors.js";
import {
  detectRealityStateConflicts,
  getCurrentRealityStates,
  getRealityStatesAt,
  getRealityWorldline,
  isRealityStateActiveAt,
} from "../reality/worldline.js";
import type {
  ProjectState,
  RealityEntity,
  RealityEvent,
  RealityState,
} from "../types.js";
import { PROJECT_ID, validProjectStateV013 } from "./fixtures.js";

const ENTITY_ID = "c1010101-0101-4101-8101-010101010101";
const OTHER_ENTITY_ID = "c1010101-0101-4101-8101-010101010102";
const EVENT_A = "c2020202-0202-4202-8202-020202020201";
const EVENT_B = "c2020202-0202-4202-8202-020202020202";
const EVENT_UNKNOWN = "c2020202-0202-4202-8202-020202020203";
const STATE_NORMAL = "c3030303-0303-4303-8303-030303030301";
const STATE_LEAKING = "c3030303-0303-4303-8303-030303030302";
const STATE_ACCESS = "c3030303-0303-4303-8303-030303030303";
const STATE_OPEN = "c3030303-0303-4303-8303-030303030304";
const TS = "2026-03-01T12:00:00.000Z";

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

function event(overrides: Partial<RealityEvent>): RealityEvent {
  return {
    id: EVENT_A,
    project_id: PROJECT_ID,
    kind: "pipe_rupture",
    subject_ids: [ENTITY_ID],
    occurred_at: "2026-03-01T10:00:00.000Z",
    recorded_at: "2026-03-01T12:00:00.000Z",
    summary: "rupture",
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function state(overrides: Partial<RealityState>): RealityState {
  return {
    id: STATE_NORMAL,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    kind: "condition",
    value: "normal",
    valid_from: "2026-03-01T10:00:00.000Z",
    valid_until: "2026-03-01T11:00:00.000Z",
    recorded_at: "2026-03-01T12:00:00.000Z",
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function projectWithReality(input: {
  entities?: RealityEntity[];
  events?: RealityEvent[];
  states?: RealityState[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV013),
    reality_entities: input.entities ?? [entity()],
    reality_events: input.events ?? [],
    reality_states: input.states ?? [],
  };
}

function checksum(state: ProjectState): string {
  return JSON.stringify(state);
}

describe("Reality Worldline (GROUND-003)", () => {
  describe("Basic Worldline", () => {
    it("derives one Worldline from entity + states + events", () => {
      const project = projectWithReality({
        events: [
          event({ id: EVENT_A, occurred_at: "2026-03-01T10:00:00.000Z" }),
        ],
        states: [
          state({
            id: STATE_NORMAL,
            value: "normal",
            valid_from: "2026-03-01T09:00:00.000Z",
            valid_until: "2026-03-01T10:00:00.000Z",
          }),
          state({
            id: STATE_LEAKING,
            value: "leaking",
            valid_from: "2026-03-01T10:00:00.000Z",
            valid_until: null,
          }),
        ],
      });

      const wl = getRealityWorldline(project, ENTITY_ID);
      assert.equal(wl.entity.id, ENTITY_ID);
      assert.equal(wl.events.length, 1);
      assert.equal(wl.states.length, 2);
      assert.ok(wl.ordered_entries.length >= 3);
      assert.equal(wl.unplaced_events.length, 0);
    });

    it("ordering is deterministic across repeated calls", () => {
      const project = projectWithReality({
        events: [
          event({
            id: EVENT_A,
            occurred_at: "2026-03-01T10:00:00.000Z",
            recorded_at: "2026-03-01T12:00:00.000Z",
          }),
          event({
            id: EVENT_B,
            kind: "inspection",
            occurred_at: "2026-03-01T10:00:00.000Z",
            recorded_at: "2026-03-01T11:00:00.000Z",
            summary: "inspection",
          }),
        ],
        states: [
          state({
            id: STATE_LEAKING,
            value: "leaking",
            valid_from: "2026-03-01T10:00:00.000Z",
            valid_until: "2026-03-01T12:00:00.000Z",
            recorded_at: "2026-03-01T13:00:00.000Z",
          }),
        ],
      });

      const a = getRealityWorldline(project, ENTITY_ID);
      const b = getRealityWorldline(project, ENTITY_ID);
      assert.deepEqual(a.ordered_entries, b.ordered_entries);

      const atSameTime = a.ordered_entries.filter(
        (e) => e.time === "2026-03-01T10:00:00.000Z"
      );
      assert.deepEqual(
        atSameTime.map((e) => e.temporal_role),
        ["STATE_BECAME_VALID", "EVENT_OCCURRED", "EVENT_OCCURRED"]
      );
      assert.equal(atSameTime[1]?.record_id, EVENT_B);
      assert.equal(atSameTime[2]?.record_id, EVENT_A);
    });
  });

  describe("Temporal State intervals", () => {
    it("uses half-open [valid_from, valid_until) boundaries", () => {
      const s = state({
        valid_from: "2026-03-01T10:00:00.000Z",
        valid_until: "2026-03-01T11:00:00.000Z",
      });
      assert.equal(isRealityStateActiveAt(s, "2026-03-01T09:59:00.000Z"), false);
      assert.equal(isRealityStateActiveAt(s, "2026-03-01T10:00:00.000Z"), true);
      assert.equal(isRealityStateActiveAt(s, "2026-03-01T10:59:00.000Z"), true);
      assert.equal(isRealityStateActiveAt(s, "2026-03-01T11:00:00.000Z"), false);

      const project = projectWithReality({ states: [s] });
      assert.equal(
        getRealityStatesAt(project, ENTITY_ID, "2026-03-01T09:59:00.000Z").length,
        0
      );
      assert.equal(
        getRealityStatesAt(project, ENTITY_ID, "2026-03-01T10:00:00.000Z").length,
        1
      );
      assert.equal(
        getRealityStatesAt(project, ENTITY_ID, "2026-03-01T11:00:00.000Z").length,
        0
      );
    });

    it("open valid_until=null remains active after valid_from", () => {
      const s = state({
        id: STATE_OPEN,
        valid_from: "2026-03-01T10:00:00.000Z",
        valid_until: null,
        value: "leaking",
      });
      const project = projectWithReality({ states: [s] });
      assert.equal(
        getRealityStatesAt(project, ENTITY_ID, "2026-03-01T10:00:00.000Z").length,
        1
      );
      assert.equal(
        getRealityStatesAt(project, ENTITY_ID, "2027-01-01T00:00:00.000Z").length,
        1
      );
      const wl = getRealityWorldline(project, ENTITY_ID);
      assert.ok(
        !wl.ordered_entries.some((e) => e.temporal_role === "STATE_CEASED_VALID")
      );
    });
  });

  describe("Unknown Event time", () => {
    it("keeps occurred_at=null in unplaced_events without synthetic occurrence time", () => {
      const project = projectWithReality({
        events: [
          event({
            id: EVENT_UNKNOWN,
            occurred_at: null,
            recorded_at: "2026-03-01T15:00:00.000Z",
            summary: "unknown when",
          }),
          event({
            id: EVENT_A,
            occurred_at: "2026-03-01T10:00:00.000Z",
          }),
        ],
      });

      const wl = getRealityWorldline(project, ENTITY_ID);
      assert.equal(wl.unplaced_events.length, 1);
      assert.equal(wl.unplaced_events[0]?.id, EVENT_UNKNOWN);
      assert.equal(wl.unplaced_events[0]?.occurred_at, null);
      assert.ok(
        !wl.ordered_entries.some((e) => e.record_id === EVENT_UNKNOWN)
      );
      assert.ok(
        !wl.ordered_entries.some(
          (e) => e.time === "2026-03-01T15:00:00.000Z" && e.record_type === "event"
        )
      );
      assert.equal(wl.temporal_summary.unplaced_event_count, 1);
    });
  });

  describe("Overlapping states", () => {
    it("surfaces both same-kind overlaps at a point and value_conflict — no winner", () => {
      const project = projectWithReality({
        states: [
          state({
            id: STATE_NORMAL,
            kind: "condition",
            value: "normal",
            valid_from: "2026-03-01T10:00:00.000Z",
            valid_until: "2026-03-01T12:00:00.000Z",
          }),
          state({
            id: STATE_LEAKING,
            kind: "condition",
            value: "leaking",
            valid_from: "2026-03-01T11:00:00.000Z",
            valid_until: "2026-03-01T13:00:00.000Z",
          }),
        ],
      });

      const at = getRealityStatesAt(
        project,
        ENTITY_ID,
        "2026-03-01T11:30:00.000Z"
      );
      assert.equal(at.length, 2);
      assert.deepEqual(
        at.map((s) => s.value).sort(),
        ["leaking", "normal"]
      );

      const current = getCurrentRealityStates(
        project,
        ENTITY_ID,
        "2026-03-01T11:30:00.000Z"
      );
      assert.equal(current.length, 1);
      assert.equal(current[0]?.kind, "condition");
      assert.equal(current[0]?.states.length, 2);

      const conflicts = detectRealityStateConflicts(project, ENTITY_ID);
      assert.equal(conflicts.length, 1);
      assert.equal(conflicts[0]?.conflict_kind, "value_conflict");
      assert.equal(conflicts[0]?.kind, "condition");
      assert.equal(conflicts[0]?.states.length, 2);
    });

    it("does not treat different-kind overlap as value_conflict", () => {
      const project = projectWithReality({
        states: [
          state({
            id: STATE_LEAKING,
            kind: "condition",
            value: "leaking",
            valid_from: "2026-03-01T10:00:00.000Z",
            valid_until: null,
          }),
          state({
            id: STATE_ACCESS,
            kind: "access",
            value: "restricted",
            valid_from: "2026-03-01T10:00:00.000Z",
            valid_until: null,
          }),
        ],
      });

      const conflicts = detectRealityStateConflicts(project, ENTITY_ID);
      assert.equal(conflicts.length, 0);

      const current = getCurrentRealityStates(
        project,
        ENTITY_ID,
        "2026-03-01T11:00:00.000Z"
      );
      assert.equal(current.length, 2);
      assert.deepEqual(
        current.map((g) => g.kind).sort(),
        ["access", "condition"]
      );
    });

    it("classifies identical-value overlap as duplicate_overlap, not value_conflict", () => {
      const project = projectWithReality({
        states: [
          state({
            id: STATE_NORMAL,
            value: "leaking",
            valid_from: "2026-03-01T10:00:00.000Z",
            valid_until: "2026-03-01T12:00:00.000Z",
          }),
          state({
            id: STATE_LEAKING,
            value: "leaking",
            valid_from: "2026-03-01T11:00:00.000Z",
            valid_until: "2026-03-01T13:00:00.000Z",
          }),
        ],
      });
      const conflicts = detectRealityStateConflicts(project, ENTITY_ID);
      assert.equal(conflicts.length, 1);
      assert.equal(conflicts[0]?.conflict_kind, "duplicate_overlap");
      const wl = getRealityWorldline(project, ENTITY_ID);
      assert.equal(wl.temporal_summary.conflict_count, 0);
      assert.equal(wl.temporal_summary.duplicate_overlap_count, 1);
    });
  });

  describe("Read-only + isolation", () => {
    it("does not mutate ProjectState", () => {
      const project = projectWithReality({
        events: [event({ id: EVENT_A })],
        states: [state({ id: STATE_NORMAL })],
      });
      const before = checksum(project);
      getRealityWorldline(project, ENTITY_ID);
      getRealityStatesAt(project, ENTITY_ID, "2026-03-01T10:30:00.000Z");
      getCurrentRealityStates(project, ENTITY_ID, "2026-03-01T10:30:00.000Z");
      detectRealityStateConflicts(project, ENTITY_ID);
      assert.equal(checksum(project), before);
    });

    it("source does not import applyPatch or saveProject", () => {
      const worldlineSrc = readFileSync(
        join(process.cwd(), "ground-core/reality/worldline.ts"),
        "utf8"
      );
      const typesSrc = readFileSync(
        join(process.cwd(), "ground-core/reality/worldline-types.ts"),
        "utf8"
      );
      const importLines = [...worldlineSrc.split("\n"), ...typesSrc.split("\n")].filter(
        (line) => /^\s*import\b/.test(line)
      );
      assert.ok(!importLines.some((line) => /state-engine|file-store|applyPatch|saveProject/.test(line)));
    });

    it("unknown entity throws NotFoundError — no fake empty entity", () => {
      const project = projectWithReality({ entities: [entity()] });
      assert.throws(
        () => getRealityWorldline(project, OTHER_ENTITY_ID),
        (err: unknown) =>
          err instanceof NotFoundError && /RealityEntity not found/.test(err.message)
      );
    });

    it("ignores events/states from another project_id", () => {
      const foreignProject = "00000000-0000-4000-8000-000000000099";
      const project = projectWithReality({
        events: [
          event({
            id: EVENT_A,
            project_id: foreignProject,
            subject_ids: [ENTITY_ID],
          }),
        ],
        states: [
          state({
            id: STATE_NORMAL,
            project_id: foreignProject,
            subject_id: ENTITY_ID,
          }),
        ],
      });
      const wl = getRealityWorldline(project, ENTITY_ID);
      assert.equal(wl.events.length, 0);
      assert.equal(wl.states.length, 0);
    });
  });
});
