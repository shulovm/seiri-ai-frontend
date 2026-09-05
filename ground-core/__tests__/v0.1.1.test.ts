import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cmdNewId } from "../cli.js";
import { migrateProjectState } from "../migrate.js";
import { applyPatch } from "../state-engine.js";
import { PatchError } from "../errors.js";
import { validateProjectState } from "../validate.js";
import {
  GOAL_ID,
  JUDGMENT_ID,
  NEXT_ACTION_2_ID,
  NEXT_ACTION_ID,
  OBSERVATION_ID,
  PROJECT_ID,
  REFERENCE_DOC_ID,
  validProjectStateV010,
  validProjectStateV011,
  validProjectStateV012,
  validProjectStateV013,
  validProjectStateV014,
  validProjectStateV015,
  validProjectStateV0124,
} from "./fixtures.js";

const TS = "2026-06-07T12:00:00.000Z";

describe("v0.1.1→v0.1.6 migration", () => {
  it("migrates legacy fixture to v0.1.6", () => {
    const migrated = migrateProjectState(validProjectStateV010);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.equal(migrated.reference_docs.length, 0);
    assert.equal(migrated.reality_entities.length, 0);
    assert.equal(migrated.reference_conditions.length, 0);
    assert.deepEqual(migrated.reality_objectives, []);
    assert.deepEqual(migrated.future_scenarios, []);
    assert.equal(migrated.current_state.primary_next_action_id, null);
    assert.equal(migrated.next_actions[0]?.depends_on_action_id, null);
  });

  it("migrates v0.1.1 fixture to v0.1.6 with empty Reality collections", () => {
    const migrated = migrateProjectState(validProjectStateV011);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.reality_entities, []);
    assert.deepEqual(migrated.reality_events, []);
    assert.deepEqual(migrated.reality_states, []);
    assert.deepEqual(migrated.reference_conditions, []);
    assert.deepEqual(migrated.reality_objectives, []);
  });

  it("migrates v0.1.2 fixture to v0.1.5 with empty epistemic collections", () => {
    const migrated = migrateProjectState(validProjectStateV012);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.epistemic_observations, []);
    assert.deepEqual(migrated.evidence, []);
    assert.deepEqual(migrated.claims, []);
    assert.deepEqual(migrated.claim_evidence_links, []);
    assert.deepEqual(migrated.reference_conditions, []);
  });

  it("migrates v0.1.3 fixture to v0.1.5 with empty reference_conditions", () => {
    const migrated = migrateProjectState(validProjectStateV013);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.reference_conditions, []);
    assert.deepEqual(migrated.reality_objectives, []);
  });

  it("migrates v0.1.4 fixture to v0.1.6 with empty objective collections", () => {
    const migrated = migrateProjectState(validProjectStateV014);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.reality_objectives, []);
    assert.deepEqual(migrated.objective_requirements, []);
    assert.deepEqual(migrated.objective_dependencies, []);
    assert.deepEqual(migrated.future_scenarios, []);
  });

  it("migrates v0.1.5 fixture to v0.1.6 with empty prospective collections", () => {
    const migrated = migrateProjectState(validProjectStateV015);
    assert.equal(migrated.schema_version, "0.1.24");
    assert.deepEqual(migrated.future_scenarios, []);
    assert.deepEqual(migrated.scenario_state_projections, []);
    assert.deepEqual(migrated.scenario_likelihood_estimates, []);
    assert.deepEqual(migrated.impact_declarations, []);
    assert.deepEqual(migrated.impact_measure_declarations, []);
  });
});

describe("v0.1.1 FK invariants", () => {
  it("accepts primary_next_action_id when action exists", () => {
    assert.equal(
      validProjectStateV0124.current_state.primary_next_action_id,
      NEXT_ACTION_ID
    );
    const validation = validateProjectState(validProjectStateV0124);
    assert.equal(validation.valid, true);
  });

  it("rejects missing primary_next_action_id", () => {
    assert.throws(
      () =>
        applyPatch(validProjectStateV013, {
          schema_version: "0.1.1",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "current_state",
              entity_id: validProjectStateV011.current_state.id,
              payload: {
                primary_next_action_id: "00000000-0000-4000-8000-000000000000",
              },
            },
          ],
        }),
      PatchError
    );
  });

  it("accepts depends_on_action_id when dependency exists", () => {
    const next = applyPatch(validProjectStateV013, {
      schema_version: "0.1.1",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "next_action",
          entity_id: NEXT_ACTION_2_ID,
          payload: {
            id: NEXT_ACTION_2_ID,
            project_id: PROJECT_ID,
            goal_id: GOAL_ID,
            blocker_id: null,
            depends_on_action_id: NEXT_ACTION_ID,
            title: "Second action",
            description: null,
            status: "pending",
            due_at: null,
            sort_order: 1,
            created_at: TS,
            updated_at: TS,
          },
        },
      ],
    });

    assert.equal(next.next_actions[1]?.depends_on_action_id, NEXT_ACTION_ID);
  });

  it("rejects missing depends_on_action_id", () => {
    assert.throws(
      () =>
        applyPatch(validProjectStateV013, {
          schema_version: "0.1.1",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "next_action",
              entity_id: NEXT_ACTION_ID,
              payload: {
                depends_on_action_id: "00000000-0000-4000-8000-000000000000",
              },
            },
          ],
        }),
      PatchError
    );
  });
});

describe("v0.1.1 new entities via patch", () => {
  it("upserts reference_doc", () => {
    const next = applyPatch(validProjectStateV013, {
      schema_version: "0.1.1",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "reference_doc",
          entity_id: REFERENCE_DOC_ID,
          payload: {
            id: REFERENCE_DOC_ID,
            project_id: PROJECT_ID,
            title: "Character Bible",
            path: "docs/MOMOTARO_CHARACTER_BIBLE.md",
            kind: "design",
            summary: "桃太郎キャラ固定",
            status: "active",
            created_at: TS,
            updated_at: TS,
          },
        },
      ],
    });

    assert.equal(next.reference_docs.length, 1);
    assert.equal(next.reference_docs[0]?.path, "docs/MOMOTARO_CHARACTER_BIBLE.md");
  });

  it("upserts observation", () => {
    const next = applyPatch(validProjectStateV013, {
      schema_version: "0.1.1",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "observation",
          entity_id: OBSERVATION_ID,
          payload: {
            id: OBSERVATION_ID,
            project_id: PROJECT_ID,
            goal_id: GOAL_ID,
            title: "Field test memo",
            body: "受け取り率は高かった",
            source: "field_test",
            observed_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
      ],
    });

    assert.equal(next.observations.length, 1);
  });

  it("upserts judgment", () => {
    const withObservation = applyPatch(validProjectStateV013, {
      schema_version: "0.1.1",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "observation",
          entity_id: OBSERVATION_ID,
          payload: {
            id: OBSERVATION_ID,
            project_id: PROJECT_ID,
            goal_id: GOAL_ID,
            title: "Field test memo",
            body: "続けたい感覚あり",
            source: "field_test",
            observed_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
      ],
    });

    const next = applyPatch(withObservation, {
      schema_version: "0.1.1",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "judgment",
          entity_id: JUDGMENT_ID,
          payload: {
            id: JUDGMENT_ID,
            project_id: PROJECT_ID,
            goal_id: GOAL_ID,
            observation_id: OBSERVATION_ID,
            title: "Phase0 Go judgment",
            outcome: "go",
            rationale: "現場感覚が前向き",
            decided_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
      ],
    });

    assert.equal(next.judgments.length, 1);
    assert.equal(next.judgments[0]?.outcome, "go");
  });

  it("rejects judgment with missing observation_id", () => {
    assert.throws(
      () =>
        applyPatch(validProjectStateV013, {
          schema_version: "0.1.1",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "judgment",
              entity_id: JUDGMENT_ID,
              payload: {
                id: JUDGMENT_ID,
                project_id: PROJECT_ID,
                goal_id: null,
                observation_id: "00000000-0000-4000-8000-000000000000",
                title: "Invalid judgment",
                outcome: "stop",
                rationale: "missing observation",
                decided_at: TS,
                created_at: TS,
                updated_at: TS,
              },
            },
          ],
        }),
      PatchError
    );
  });
});

describe("CLI new-id", () => {
  it("outputs a UUID v4", () => {
    const id = cmdNewId();
    assert.match(
      id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });
});
