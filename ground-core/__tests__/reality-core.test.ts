import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { PatchError } from "../errors.js";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import { proposeFromReality } from "../reality/propose.js";
import { applyPatch, createEmptyProject } from "../state-engine.js";
import type { RealityEntity, RealityEvent, RealityState, StatePatch } from "../types.js";
import { validateProjectState } from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV010,
  validProjectStateV011,
  validProjectStateV013,
} from "./fixtures.js";

const ENTITY_ID = "b1010101-0101-4101-8101-010101010101";
const EVENT_ID = "b2020202-0202-4202-8202-020202020202";
const STATE_ID = "b3030303-0303-4303-8303-030303030303";
const TS_OCCURRED = "2026-03-01T10:00:00.000Z";
const TS_RECORDED = "2026-03-01T12:00:00.000Z";
const TS_VALID_FROM = "2026-03-01T10:00:00.000Z";
const TS_VALID_UNTIL = "2026-03-15T00:00:00.000Z";
const TS_CREATED = "2026-03-01T12:00:00.000Z";

function entityPayload(
  overrides: Partial<RealityEntity> = {}
): RealityEntity {
  return {
    id: ENTITY_ID,
    project_id: PROJECT_ID,
    kind: "asset",
    label: "water-pipe-01",
    created_at: TS_CREATED,
    updated_at: TS_CREATED,
    ...overrides,
  };
}

function eventPayload(
  overrides: Partial<RealityEvent> = {}
): RealityEvent {
  return {
    id: EVENT_ID,
    project_id: PROJECT_ID,
    kind: "leak_began",
    subject_ids: [ENTITY_ID],
    occurred_at: TS_OCCURRED,
    recorded_at: TS_RECORDED,
    summary: "Pipe began leaking",
    created_at: TS_CREATED,
    updated_at: TS_CREATED,
    ...overrides,
  };
}

function statePayload(
  overrides: Partial<RealityState> = {}
): RealityState {
  return {
    id: STATE_ID,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    kind: "condition",
    value: "leaking",
    valid_from: TS_VALID_FROM,
    valid_until: null,
    recorded_at: TS_RECORDED,
    created_at: TS_CREATED,
    updated_at: TS_CREATED,
    ...overrides,
  };
}

function upsertEntityPatch(payload: RealityEntity = entityPayload()): StatePatch {
  return {
    schema_version: "0.1.3",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "reality_entity",
        entity_id: payload.id,
        payload,
      },
    ],
  };
}

describe("Reality Core Ontic Foundation", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-reality-ontic-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("RealityEntity", () => {
    it("creates a valid RealityEntity via applyPatch", () => {
      const next = applyPatch(validProjectStateV013, upsertEntityPatch());
      assert.equal(next.reality_entities.length, 1);
      assert.equal(next.reality_entities[0]?.id, ENTITY_ID);
      assert.equal(next.reality_entities[0]?.kind, "asset");
      assert.equal(next.reality_entities[0]?.project_id, PROJECT_ID);
      assert.equal(next.schema_version, "0.1.25");
    });

    it("persist/load roundtrip keeps stable ID and ownership", () => {
      const next = applyPatch(validProjectStateV013, upsertEntityPatch());
      saveProject(next, { storageDir: tempDir });
      const loaded = loadProject(PROJECT_ID, { storageDir: tempDir });
      assert.equal(loaded.reality_entities[0]?.id, ENTITY_ID);
      assert.equal(loaded.reality_entities[0]?.project_id, PROJECT_ID);
      assert.equal(loaded.schema_version, "0.1.25");
    });

    it("rejects duplicate RealityEntity IDs", () => {
      const withDupes = {
        ...structuredClone(validProjectStateV013),
        reality_entities: [
          entityPayload(),
          { ...entityPayload(), label: "same-id-second-row" },
        ],
      };
      assert.throws(
        () =>
          applyPatch(withDupes, {
            schema_version: "0.1.3",
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "upsert",
                entity: "current_state",
                entity_id: validProjectStateV013.current_state.id,
                payload: { summary: "touch" },
              },
            ],
          }),
        (err: unknown) =>
          err instanceof PatchError && /Duplicate reality_entity id/.test(err.message)
      );
    });
  });

  describe("RealityEvent", () => {
    it("creates Event preserving occurred_at and recorded_at", () => {
      const withEntity = applyPatch(validProjectStateV013, upsertEntityPatch());
      const next = applyPatch(withEntity, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_event",
            entity_id: EVENT_ID,
            payload: eventPayload(),
          },
        ],
      });
      assert.equal(next.reality_events[0]?.occurred_at, TS_OCCURRED);
      assert.equal(next.reality_events[0]?.recorded_at, TS_RECORDED);
      assert.deepEqual(next.reality_events[0]?.subject_ids, [ENTITY_ID]);
    });

    it("allows unknown occurred_at as null", () => {
      const withEntity = applyPatch(validProjectStateV013, upsertEntityPatch());
      const next = applyPatch(withEntity, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_event",
            entity_id: EVENT_ID,
            payload: eventPayload({ occurred_at: null }),
          },
        ],
      });
      assert.equal(next.reality_events[0]?.occurred_at, null);
      assert.equal(next.reality_events[0]?.recorded_at, TS_RECORDED);
    });

    it("rejects Event referencing unknown entity", () => {
      assert.throws(
        () =>
          applyPatch(validProjectStateV013, {
            schema_version: "0.1.3",
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "upsert",
                entity: "reality_event",
                entity_id: EVENT_ID,
                payload: eventPayload(),
              },
            ],
          }),
        (err: unknown) =>
          err instanceof PatchError && /missing subject_id/.test(err.message)
      );
    });

    it("rejects mutation of occurred_at after create", () => {
      const withEntity = applyPatch(validProjectStateV013, upsertEntityPatch());
      const withEvent = applyPatch(withEntity, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_event",
            entity_id: EVENT_ID,
            payload: eventPayload(),
          },
        ],
      });
      assert.throws(
        () =>
          applyPatch(withEvent, {
            schema_version: "0.1.3",
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "upsert",
                entity: "reality_event",
                entity_id: EVENT_ID,
                payload: { occurred_at: "2026-04-01T00:00:00.000Z" },
              },
            ],
          }),
        (err: unknown) =>
          err instanceof PatchError &&
          /Cannot mutate reality_event.occurred_at/.test(err.message)
      );
    });

    it("persist/load roundtrip preserves Event temporal fields", () => {
      const withEntity = applyPatch(validProjectStateV013, upsertEntityPatch());
      const next = applyPatch(withEntity, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_event",
            entity_id: EVENT_ID,
            payload: eventPayload(),
          },
        ],
      });
      saveProject(next, { storageDir: tempDir });
      const loaded = loadProject(PROJECT_ID, { storageDir: tempDir });
      assert.equal(loaded.reality_events[0]?.occurred_at, TS_OCCURRED);
      assert.equal(loaded.reality_events[0]?.recorded_at, TS_RECORDED);
    });
  });

  describe("RealityState", () => {
    it("creates State for Entity with valid_from and optional valid_until", () => {
      const withEntity = applyPatch(validProjectStateV013, upsertEntityPatch());
      const next = applyPatch(withEntity, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_state",
            entity_id: STATE_ID,
            payload: statePayload({ valid_until: TS_VALID_UNTIL }),
          },
        ],
      });
      assert.equal(next.reality_states[0]?.subject_id, ENTITY_ID);
      assert.equal(next.reality_states[0]?.valid_from, TS_VALID_FROM);
      assert.equal(next.reality_states[0]?.valid_until, TS_VALID_UNTIL);
      assert.equal(next.reality_states[0]?.value, "leaking");
    });

    it("rejects invalid temporal interval (valid_until < valid_from)", () => {
      const withEntity = applyPatch(validProjectStateV013, upsertEntityPatch());
      assert.throws(
        () =>
          applyPatch(withEntity, {
            schema_version: "0.1.3",
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "upsert",
                entity: "reality_state",
                entity_id: STATE_ID,
                payload: statePayload({
                  valid_from: TS_VALID_UNTIL,
                  valid_until: TS_VALID_FROM,
                }),
              },
            ],
          }),
        (err: unknown) =>
          err instanceof PatchError &&
          /valid_until before valid_from/.test(err.message)
      );
    });

    it("rejects State with unknown subject", () => {
      assert.throws(
        () =>
          applyPatch(validProjectStateV013, {
            schema_version: "0.1.3",
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "upsert",
                entity: "reality_state",
                entity_id: STATE_ID,
                payload: statePayload(),
              },
            ],
          }),
        (err: unknown) =>
          err instanceof PatchError && /missing subject_id/.test(err.message)
      );
    });

    it("persist/load roundtrip preserves State temporal fields", () => {
      const withEntity = applyPatch(validProjectStateV013, upsertEntityPatch());
      const next = applyPatch(withEntity, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_state",
            entity_id: STATE_ID,
            payload: statePayload({ valid_until: null }),
          },
        ],
      });
      saveProject(next, { storageDir: tempDir });
      const loaded = loadProject(PROJECT_ID, { storageDir: tempDir });
      assert.equal(loaded.reality_states[0]?.valid_from, TS_VALID_FROM);
      assert.equal(loaded.reality_states[0]?.valid_until, null);
      assert.equal(loaded.reality_states[0]?.recorded_at, TS_RECORDED);
    });
  });

  describe("Architecture", () => {
    it("mutates Reality data only through applyPatch → saveProject", () => {
      const empty = createEmptyProject({ title: "Reality path" });
      assert.deepEqual(empty.reality_entities, []);
      const patched = applyPatch(empty, {
        schema_version: "0.1.3",
        project_id: empty.project.id,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_entity",
            entity_id: ENTITY_ID,
            payload: entityPayload({ project_id: empty.project.id }),
          },
        ],
      });
      saveProject(patched, { storageDir: tempDir });
      const loaded = loadProject(empty.project.id, { storageDir: tempDir });
      assert.equal(loaded.reality_entities.length, 1);
      assert.equal(validateProjectState(loaded).valid, true);
    });

    it("reality-propose remains non-mutating of ProjectState", () => {
      const before = structuredClone(validProjectStateV013);
      const propose = proposeFromReality(
        before,
        {
          project_id: PROJECT_ID,
          input_text: "パイプが漏れた",
        },
        "mock"
      );
      assert.ok(propose);
      assert.deepEqual(before.reality_entities, []);
      assert.deepEqual(before.reality_events, []);
      assert.deepEqual(before.reality_states, []);
    });

    it("legacy ProjectState fields remain unchanged when adding Reality rows", () => {
      const before = validProjectStateV013;
      const next = applyPatch(before, upsertEntityPatch());
      assert.deepEqual(next.goals, before.goals);
      assert.deepEqual(next.observations, before.observations);
      assert.deepEqual(next.next_actions, before.next_actions);
      assert.equal(next.current_state.id, before.current_state.id);
    });

    it("migration from previous schemas succeeds with empty Reality collections", () => {
      const from010 = migrateProjectState(validProjectStateV010);
      assert.equal(from010.schema_version, "0.1.25");
      assert.deepEqual(from010.reality_entities, []);
      assert.deepEqual(from010.reality_events, []);
      assert.deepEqual(from010.reality_states, []);
      assert.deepEqual(from010.epistemic_observations, []);
      assert.deepEqual(from010.claims, []);

      const from011 = migrateProjectState(validProjectStateV011);
      assert.equal(from011.schema_version, "0.1.25");
      assert.deepEqual(from011.reality_entities, []);
      assert.deepEqual(from011.epistemic_observations, []);
    });

    it("rejects mismatched project_id on RealityEntity", () => {
      const mismatched = {
        ...structuredClone(validProjectStateV013),
        reality_entities: [
          entityPayload({
            project_id: "00000000-0000-4000-8000-000000000099",
          }),
        ],
      };
      assert.throws(
        () =>
          applyPatch(mismatched, {
            schema_version: "0.1.3",
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "upsert",
                entity: "current_state",
                entity_id: validProjectStateV013.current_state.id,
                payload: { summary: "touch" },
              },
            ],
          }),
        (err: unknown) =>
          err instanceof PatchError && /mismatched project_id/.test(err.message)
      );
    });

    it("upsert forces RealityEntity.project_id to owning project", () => {
      const next = applyPatch(validProjectStateV013, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_entity",
            entity_id: ENTITY_ID,
            payload: entityPayload({
              project_id: "00000000-0000-4000-8000-000000000099",
            }),
          },
        ],
      });
      assert.equal(next.reality_entities[0]?.project_id, PROJECT_ID);
    });
  });
});
