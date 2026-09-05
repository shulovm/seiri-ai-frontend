import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";
import { PatchError } from "../errors.js";
import { applyPatch, createEmptyProject } from "../state-engine.js";
import { validateProjectState } from "../validate.js";
import { GOAL_ID } from "./fixtures.js";

describe("createEmptyProject", () => {
  it("creates a valid ProjectState", () => {
    const state = createEmptyProject({ title: "Test Project" });
    const validation = validateProjectState(state);

    assert.equal(validation.valid, true);
    assert.equal(state.goals.length, 0);
    assert.equal(state.next_actions.length, 0);
    assert.equal(state.current_state.project_id, state.project.id);
    assert.ok(state.current_state.summary.length >= 1);
  });
});

describe("applyPatch", () => {
  it("adds a next_action via upsert", () => {
    const state = createEmptyProject({
      title: "Patch Test",
      summary: "Initial summary",
    });
    const actionId = randomUUID();
    const now = new Date().toISOString();

    const next = applyPatch(state, {
      schema_version: "0.1.0",
      project_id: state.project.id,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "next_action",
          entity_id: actionId,
          payload: {
            id: actionId,
            project_id: state.project.id,
            goal_id: null,
            blocker_id: null,
            depends_on_action_id: null,
            title: "Write tests",
            description: null,
            status: "pending",
            due_at: null,
            sort_order: 0,
            created_at: now,
            updated_at: now,
          },
        },
      ],
    });

    assert.equal(next.next_actions.length, 1);
    assert.equal(next.next_actions[0]?.id, actionId);
    assert.equal(next.next_actions[0]?.title, "Write tests");
    assert.equal(validateProjectState(next).valid, true);
  });

  it("marks next_action as done via status_change", () => {
    const state = createEmptyProject({
      title: "Status Test",
      summary: "Status summary",
    });
    const actionId = randomUUID();
    const now = new Date().toISOString();

    const withAction = applyPatch(state, {
      schema_version: "0.1.0",
      project_id: state.project.id,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "next_action",
          entity_id: actionId,
          payload: {
            id: actionId,
            project_id: state.project.id,
            goal_id: null,
            blocker_id: null,
            depends_on_action_id: null,
            title: "Review patch",
            description: null,
            status: "pending",
            due_at: null,
            sort_order: 0,
            created_at: now,
            updated_at: now,
          },
        },
      ],
    });

    const done = applyPatch(withAction, {
      schema_version: "0.1.0",
      project_id: state.project.id,
      source: "manual",
      operations: [
        {
          op: "status_change",
          entity: "next_action",
          entity_id: actionId,
          status: "done",
        },
      ],
    });

    assert.equal(done.next_actions[0]?.status, "done");
  });

  it("deletes an unreferenced hypothesis", () => {
    const state = createEmptyProject({
      title: "Delete Test",
      summary: "Delete summary",
    });
    const hypothesisId = randomUUID();
    const now = new Date().toISOString();

    const withHypothesis = applyPatch(state, {
      schema_version: "0.1.0",
      project_id: state.project.id,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "hypothesis",
          entity_id: hypothesisId,
          payload: {
            id: hypothesisId,
            project_id: state.project.id,
            goal_id: null,
            statement: "Manual patch is enough for v0.1",
            status: "untested",
            evidence_for: [],
            evidence_against: [],
            created_at: now,
            updated_at: now,
          },
        },
      ],
    });

    const deleted = applyPatch(withHypothesis, {
      schema_version: "0.1.0",
      project_id: state.project.id,
      source: "manual",
      operations: [
        {
          op: "delete",
          entity: "hypothesis",
          entity_id: hypothesisId,
        },
      ],
    });

    assert.equal(deleted.hypotheses.length, 0);
  });

  it("rejects next_action with missing goal_id reference", () => {
    const state = createEmptyProject({
      title: "FK Test",
      summary: "FK summary",
    });
    const actionId = randomUUID();
    const now = new Date().toISOString();

    assert.throws(
      () =>
        applyPatch(state, {
          schema_version: "0.1.0",
          project_id: state.project.id,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "next_action",
              entity_id: actionId,
              payload: {
                id: actionId,
                project_id: state.project.id,
                goal_id: GOAL_ID,
                blocker_id: null,
                depends_on_action_id: null,
                title: "Invalid FK",
                description: null,
                status: "pending",
                due_at: null,
                sort_order: 0,
                created_at: now,
                updated_at: now,
              },
            },
          ],
        }),
      PatchError
    );
  });

  it("rejects patch that breaks current_state", () => {
    const state = createEmptyProject({
      title: "Current State Test",
      summary: "Current summary",
    });

    assert.throws(
      () =>
        applyPatch(state, {
          schema_version: "0.1.0",
          project_id: state.project.id,
          source: "manual",
          operations: [
            {
              op: "delete",
              entity: "current_state",
              entity_id: state.current_state.id,
            },
          ],
        }),
      PatchError
    );

    assert.throws(
      () =>
        applyPatch(state, {
          schema_version: "0.1.0",
          project_id: state.project.id,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "current_state",
              entity_id: randomUUID(),
              payload: {
                summary: "Different current_state id",
              },
            },
          ],
        }),
      PatchError
    );
  });

  it("updates project and aggregate updated_at after patch", () => {
    const state = createEmptyProject({
      title: "Timestamp Test",
      summary: "Timestamp summary",
    });

    const next = applyPatch(state, {
      schema_version: "0.1.0",
      project_id: state.project.id,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "current_state",
          entity_id: state.current_state.id,
          payload: {
            summary: "Updated current state",
          },
        },
      ],
    });

    assert.equal(next.current_state.summary, "Updated current state");
    assert.ok(next.updated_at >= state.updated_at);
    assert.ok(next.project.updated_at >= state.project.updated_at);
    assert.ok(next.current_state.updated_at >= state.current_state.updated_at);
  });
});
