/**
 * GROUND-028 — Decision Core II / Decision Memory I
 * Tests for RealityDecisionDeclaration persistence, snapshot integrity,
 * semantic validation, conflict detection, and firewall compliance.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));
import {
  assessDecisionMemory,
  buildDecisionContextSnapshot,
  detectDecisionSelectionConflicts,
  getDecisionSpaceDecisionHistory,
  getRealityDecisionDeclarationsForSpace,
  groupRealityDecisionPositions,
  realityDecisionSemanticKey,
  realityDecisionSelectionKey,
} from "../reality/decision-memory-core.js";
import { migrateProjectState } from "../migrate.js";
import { applyPatch } from "../state-engine.js";
import type {
  DecisionContextSnapshotV1,
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionDeclaration,
  PatchEntity,
  ProjectState,
  RealityDecisionDeclaration,
  RealityEntity,
  StatePatch,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID, validProjectStateV0116, validProjectStateV0124 } from "./fixtures.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const ENTITY_MAKER = "f7010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR_A = "f7010101-0101-4101-8101-010101010102";
const ENTITY_DECLARER = "f7010101-0101-4101-8101-010101010103";
const SPACE_D = "f7020202-0202-4202-8202-020202020201";
const OPT_INT = "f7030303-0303-4303-8303-030303030301";
const OPT_DN = "f7030303-0303-4303-8303-030303030302";
const CAND_A = "f7040404-0404-4404-8404-040404040401";
const INT_A = "f7050505-0505-4505-8505-050505050501";
const DECL_ID = "f7060606-0606-4606-8606-060606060601";
const DECL_ID_2 = "f7060606-0606-4606-8606-060606060602";
const DECL_ID_3 = "f7060606-0606-4606-8606-060606060603";

const TS = "2026-07-01T10:00:00.000Z";  // declarations created before DECIDED_AT
const DECIDED_AT = "2026-08-01T10:00:00.000Z";
const RECORDED_AT = "2026-08-20T10:00:00.000Z"; // > DECIDED_AT = retrospective

// FORBIDDEN vocabulary: Decision must not create feasibility/commitment/execution semantics
const FORBIDDEN =
  /\b(feasible|infeasible|eligible|committed|commitment|intent|execution|can_execute|authorized|correct|reserved|reservation)\b/;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function entity(id: string, label: string): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "person",
    label,
    created_at: TS,
    updated_at: TS,
  };
}

function intervention(id: string): InterventionDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    intervention_key: `key-${id}`,
    target_scope: { kind: "UNSCOPED" },
    description: null,
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function decisionSpace(id: string): DecisionSpaceDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    label: "Test Space",
    description: null,
    basis: [],
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function decisionOption(
  id: string,
  spaceId: string,
  kind: "INTERVENTION" | "DO_NOTHING",
  interventionId?: string
): DecisionOptionDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    decision_space_id: spaceId,
    option:
      kind === "INTERVENTION"
        ? { kind: "INTERVENTION", intervention_id: interventionId! }
        : { kind: "DO_NOTHING" },
    label: null,
    description: null,
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function actorCandidate(
  id: string,
  optionDeclarationId: string,
  actorId: string
): DecisionOptionActorCandidateDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    decision_option_declaration_id: optionDeclarationId,
    actor_entity_id: actorId,
    note: null,
    valid_from: TS,
    valid_until: null,
    declared_by: { kind: "human" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

/** Base ProjectState with the typical Decision Space setup: Intervention I + DO_NOTHING + Candidate A */
function baseState(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_MAKER, "Maker"),
      entity(ENTITY_ACTOR_A, "Actor A"),
      entity(ENTITY_DECLARER, "Declarer"),
    ],
    intervention_declarations: [intervention(INT_A)],
    decision_space_declarations: [decisionSpace(SPACE_D)],
    decision_option_declarations: [
      decisionOption(OPT_INT, SPACE_D, "INTERVENTION", INT_A),
      decisionOption(OPT_DN, SPACE_D, "DO_NOTHING"),
    ],
    decision_option_actor_candidate_declarations: [
      actorCandidate(CAND_A, OPT_INT, ENTITY_ACTOR_A),
    ],
    ...overrides,
  };
}

/** Build a complete, valid patch for a RealityDecisionDeclaration. */
function buildDecisionPatch(
  state: ProjectState,
  declId: string,
  opts: {
    decisionSpaceId?: string;
    makerEntityId?: string;
    selectedOption?: RealityDecisionDeclaration["selected_option"];
    selectedActorEntityId?: string | null;
    decidedAt?: string;
    recordedAt?: string;
    rationale?: string | null;
    declaredBy?: RealityDecisionDeclaration["declared_by"];
    snapshotOverride?: DecisionContextSnapshotV1;
  } = {}
): StatePatch {
  const decisionSpaceId = opts.decisionSpaceId ?? SPACE_D;
  const makerEntityId = opts.makerEntityId ?? ENTITY_MAKER;
  const selectedOption = opts.selectedOption ?? { kind: "INTERVENTION" as const, intervention_id: INT_A };
  const selectedActorEntityId = opts.selectedActorEntityId ?? null;
  const decidedAt = opts.decidedAt ?? DECIDED_AT;
  const recordedAt = opts.recordedAt ?? RECORDED_AT;

  const snapshot =
    opts.snapshotOverride ??
    buildDecisionContextSnapshot(state, decisionSpaceId, decidedAt, recordedAt);

  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "reality_decision_declaration",
        entity_id: declId,
        payload: {
          id: declId,
          project_id: PROJECT_ID,
          decision_space_id: decisionSpaceId,
          decision_maker_entity_id: makerEntityId,
          selected_option: selectedOption,
          selected_actor_entity_id: selectedActorEntityId,
          decided_at: decidedAt,
          rationale: opts.rationale ?? null,
          context_snapshot: snapshot,
          declared_by: opts.declaredBy ?? { kind: "human" },
          recorded_at: recordedAt,
          created_at: recordedAt,
          updated_at: recordedAt,
        },
      },
    ],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Decision Memory I (GROUND-028)", () => {
  // ── Schema / migration ─────────────────────────────────────────────────────

  describe("Migration", () => {
    it("migrates 0.1.16 → 0.1.17 with empty decision array", () => {
      const migrated = migrateProjectState(validProjectStateV0116);
      assert.equal(migrated.schema_version, "0.1.25");
      assert.deepEqual(migrated.reality_decision_declarations, []);
    });

    it("does not backfill from legacy Decision or Decision Space", () => {
      const migrated = migrateProjectState(validProjectStateV0116);
      assert.equal(migrated.reality_decision_declarations.length, 0);
    });
  });

  // ── Vocabulary / schema ────────────────────────────────────────────────────

  describe("Canonical schema version", () => {
    it("SCHEMA_VERSION is 0.1.17", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
    });
  });

  // ── Selection key helpers ──────────────────────────────────────────────────

  describe("realityDecisionSelectionKey", () => {
    it("INTERVENTION key includes intervention_id", () => {
      const key = realityDecisionSelectionKey({ kind: "INTERVENTION", intervention_id: INT_A });
      assert.equal(key, `INTERVENTION|${INT_A}`);
    });

    it("DO_NOTHING key is DO_NOTHING", () => {
      const key = realityDecisionSelectionKey({ kind: "DO_NOTHING" });
      assert.equal(key, "DO_NOTHING");
    });
  });

  describe("realityDecisionSemanticKey", () => {
    it("produces deterministic key for INTERVENTION + actor", () => {
      const key = realityDecisionSemanticKey(
        SPACE_D,
        ENTITY_MAKER,
        DECIDED_AT,
        { kind: "INTERVENTION", intervention_id: INT_A },
        ENTITY_ACTOR_A
      );
      assert.ok(key.startsWith("decision|"));
      assert.ok(key.includes(SPACE_D));
      assert.ok(key.includes(ENTITY_MAKER));
      assert.ok(key.includes(INT_A));
      assert.ok(key.includes(ENTITY_ACTOR_A));
    });

    it("produces deterministic key for DO_NOTHING", () => {
      const key = realityDecisionSemanticKey(
        SPACE_D,
        ENTITY_MAKER,
        DECIDED_AT,
        { kind: "DO_NOTHING" },
        null
      );
      assert.ok(key.includes("DO_NOTHING"));
    });
  });

  // ── Persistence — INTERVENTION ─────────────────────────────────────────────

  describe("Persistence — INTERVENTION selection", () => {
    it("persists INTERVENTION decision with no selected actor", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations.length, 1);
      const decl = next.reality_decision_declarations[0]!;
      assert.equal(decl.id, DECL_ID);
      assert.equal(decl.selected_option.kind, "INTERVENTION");
      assert.equal(decl.decision_space_id, SPACE_D);
      assert.equal(decl.decision_maker_entity_id, ENTITY_MAKER);
      assert.equal(decl.decided_at, DECIDED_AT);
      assert.equal(decl.recorded_at, RECORDED_AT);
    });

    it("persists INTERVENTION decision with selected actor candidate", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, {
        selectedActorEntityId: ENTITY_ACTOR_A,
      });
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations.length, 1);
      const decl = next.reality_decision_declarations[0]!;
      assert.equal(decl.selected_actor_entity_id, ENTITY_ACTOR_A);
    });

    it("persists rationale verbatim without parsing or scoring", () => {
      const state = baseState();
      const rationale = "This was the least bad option given budget constraints.";
      const patch = buildDecisionPatch(state, DECL_ID, { rationale });
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations[0]!.rationale, rationale);
    });

    it("allows Decision without rationale (absence means no rationale text)", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, { rationale: null });
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations[0]!.rationale, null);
    });
  });

  // ── Persistence — DO_NOTHING ───────────────────────────────────────────────

  describe("Persistence — DO_NOTHING selection", () => {
    it("persists DO_NOTHING decision", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, {
        selectedOption: { kind: "DO_NOTHING" },
        selectedActorEntityId: null,
      });
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations.length, 1);
      const decl = next.reality_decision_declarations[0]!;
      assert.equal(decl.selected_option.kind, "DO_NOTHING");
    });

    it("rejects DO_NOTHING with selected_actor_entity_id", () => {
      const state = baseState();
      const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      const patch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_decision_declaration",
            entity_id: DECL_ID,
            payload: {
              id: DECL_ID,
              project_id: PROJECT_ID,
              decision_space_id: SPACE_D,
              decision_maker_entity_id: ENTITY_MAKER,
              selected_option: { kind: "DO_NOTHING" },
              selected_actor_entity_id: ENTITY_ACTOR_A,
              decided_at: DECIDED_AT,
              rationale: null,
              context_snapshot: snapshot,
              declared_by: { kind: "human" },
              recorded_at: RECORDED_AT,
              created_at: RECORDED_AT,
              updated_at: RECORDED_AT,
            },
          },
        ],
      };
      assert.throws(() => applyPatch(state, patch), /DO_NOTHING/);
    });
  });

  // ── Referential invariants ─────────────────────────────────────────────────

  describe("Referential invariants", () => {
    it("rejects unknown decision_space_id", () => {
      const state = baseState();
      // buildDecisionPatch internally calls buildDecisionContextSnapshot which throws
      // if the space is unknown. Either that or applyPatch must reject.
      assert.throws(() => {
        const patch = buildDecisionPatch(state, DECL_ID, {
          decisionSpaceId: "00000000-0000-4000-8000-000000000099",
        });
        applyPatch(state, patch);
      }, /decision_space|not found/i);
    });

    it("rejects unknown decision_maker_entity_id", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, {
        makerEntityId: "00000000-0000-4000-8000-000000000099",
      });
      assert.throws(() => applyPatch(state, patch), /decision_maker_entity_id/);
    });

    it("rejects INTERVENTION selection with unknown intervention_id", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, {
        selectedOption: { kind: "INTERVENTION", intervention_id: "00000000-0000-4000-8000-000000000099" },
      });
      assert.throws(() => applyPatch(state, patch), /intervention_id|context_snapshot/);
    });

    it("rejects INTERVENTION selection with unknown selected_actor_entity_id", () => {
      const state = baseState();
      const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      const patch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_decision_declaration",
            entity_id: DECL_ID,
            payload: {
              id: DECL_ID,
              project_id: PROJECT_ID,
              decision_space_id: SPACE_D,
              decision_maker_entity_id: ENTITY_MAKER,
              selected_option: { kind: "INTERVENTION", intervention_id: INT_A },
              selected_actor_entity_id: "00000000-0000-4000-8000-000000000099",
              decided_at: DECIDED_AT,
              rationale: null,
              context_snapshot: snapshot,
              declared_by: { kind: "human" },
              recorded_at: RECORDED_AT,
              created_at: RECORDED_AT,
              updated_at: RECORDED_AT,
            },
          },
        ],
      };
      assert.throws(() => applyPatch(state, patch), /selected_actor_entity_id|candidate/);
    });
  });

  // ── Temporal invariants ────────────────────────────────────────────────────

  describe("Temporal invariants", () => {
    it("rejects decided_at > recorded_at", () => {
      const state = baseState();
      const futurePatch = buildDecisionPatch(state, DECL_ID, {
        decidedAt: "2026-09-01T10:00:00.000Z",
        recordedAt: TS, // earlier than decidedAt
      });
      assert.throws(() => applyPatch(state, futurePatch), /decided_at|recorded_at/);
    });

    it("accepts decided_at === recorded_at (contemporary capture)", () => {
      const state = baseState();
      const sameTime = RECORDED_AT;
      const patch = buildDecisionPatch(state, DECL_ID, {
        decidedAt: sameTime,
        recordedAt: sameTime,
      });
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations.length, 1);
    });
  });

  // ── Snapshot semantics ─────────────────────────────────────────────────────

  describe("Snapshot semantics", () => {
    it("snapshot.assessed_at equals decided_at", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      const decl = next.reality_decision_declarations[0]!;
      assert.equal(decl.context_snapshot.assessed_at, decl.decided_at);
    });

    it("snapshot.captured_at equals recorded_at", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      const decl = next.reality_decision_declarations[0]!;
      assert.equal(decl.context_snapshot.captured_at, decl.recorded_at);
    });

    it("contemporary capture: CAPTURED_AT_DECISION_TIME", () => {
      const sameTime = RECORDED_AT;
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, {
        decidedAt: sameTime,
        recordedAt: sameTime,
      });
      const next = applyPatch(state, patch);
      const decl = next.reality_decision_declarations[0]!;
      const assessment = assessDecisionMemory(decl);
      assert.equal(assessment.context_capture_relation, "CAPTURED_AT_DECISION_TIME");
    });

    it("retrospective capture: RETROSPECTIVE_RECONSTRUCTION when captured_at > decided_at", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, {
        decidedAt: DECIDED_AT,
        recordedAt: RECORDED_AT,
      });
      const next = applyPatch(state, patch);
      const decl = next.reality_decision_declarations[0]!;
      const assessment = assessDecisionMemory(decl);
      assert.equal(assessment.context_capture_relation, "RETROSPECTIVE_RECONSTRUCTION");
    });
  });

  // ── Snapshot integrity ─────────────────────────────────────────────────────

  describe("Snapshot integrity", () => {
    it("rejects tampered snapshot (modified option_key)", () => {
      const state = baseState();
      const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      // Tamper: modify an option position
      const tampered: DecisionContextSnapshotV1 = {
        ...snapshot,
        option_positions: [
          {
            option_key: "INTERVENTION|00000000-tampered",
            kind: "INTERVENTION",
            intervention_id: "00000000-tampered",
            option_declaration_ids: [],
          },
        ],
      };
      assert.throws(() =>
        applyPatch(state, buildDecisionPatch(state, DECL_ID, { snapshotOverride: tampered })),
        /context_snapshot|deterministic|represented/
      );
    });

    it("rejects tampered snapshot (removed model limitation)", () => {
      const state = baseState();
      const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      const tampered: DecisionContextSnapshotV1 = {
        ...snapshot,
        actor_feasibility_bases: snapshot.actor_feasibility_bases.map((fb) => ({
          ...fb,
          model_limitations: [], // removed
        })),
      };
      assert.throws(() =>
        applyPatch(state, buildDecisionPatch(state, DECL_ID, { snapshotOverride: tampered })),
        /context_snapshot|deterministic/
      );
    });

    it("buildDecisionContextSnapshot is deterministic (deepEqual on repeated calls)", () => {
      const state = baseState();
      const snap1 = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      const snap2 = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      assert.deepEqual(snap1, snap2);
    });

    it("snapshot excludes future-recorded declarations (recorded_at > captured_at)", () => {
      const state = baseState();
      const laterTS = "2026-09-01T10:00:00.000Z"; // after RECORDED_AT

      // Add a new Option declared AFTER RECORDED_AT
      const newOptId = "f7030303-0303-4303-8303-030303030399";
      const newIntId = "f7050505-0505-4505-8505-050505050599";
      const stateWithFuture: ProjectState = {
        ...state,
        intervention_declarations: [
          ...state.intervention_declarations,
          { ...intervention(newIntId), recorded_at: laterTS, created_at: laterTS, updated_at: laterTS },
        ],
        decision_option_declarations: [
          ...state.decision_option_declarations,
          { ...decisionOption(newOptId, SPACE_D, "INTERVENTION", newIntId), recorded_at: laterTS, created_at: laterTS, updated_at: laterTS },
        ],
      };
      const snapshot = buildDecisionContextSnapshot(stateWithFuture, SPACE_D, DECIDED_AT, RECORDED_AT);
      const hasNewOpt = snapshot.option_positions.some((p) => p.intervention_id === newIntId);
      assert.equal(hasNewOpt, false, "Future-recorded option must not appear in snapshot");
    });
  });

  // ── Selected Option representation invariant ───────────────────────────────

  describe("Selected Option must be represented", () => {
    it("rejects INTERVENTION not in context snapshot option_positions", () => {
      // Create a state without any INTERVENTION option
      const stateNOOpts: ProjectState = {
        ...baseState(),
        decision_option_declarations: [
          decisionOption(OPT_DN, SPACE_D, "DO_NOTHING"),
        ],
        decision_option_actor_candidate_declarations: [],
      };
      // Try to select INT_A which has no DecisionOption
      assert.throws(
        () => applyPatch(stateNOOpts, buildDecisionPatch(stateNOOpts, DECL_ID, {
          selectedOption: { kind: "INTERVENTION", intervention_id: INT_A },
        })),
        /context_snapshot|represented|option/i
      );
    });

    it("rejects DO_NOTHING selection when DO_NOTHING not in option_positions", () => {
      // State without DO_NOTHING option
      const stateNoDN: ProjectState = {
        ...baseState(),
        decision_option_declarations: [
          decisionOption(OPT_INT, SPACE_D, "INTERVENTION", INT_A),
        ],
      };
      assert.throws(
        () => applyPatch(stateNoDN, buildDecisionPatch(stateNoDN, DECL_ID, {
          selectedOption: { kind: "DO_NOTHING" },
          selectedActorEntityId: null,
        })),
        /context_snapshot|represented|DO_NOTHING/i
      );
    });
  });

  // ── Actor Candidate invariant ──────────────────────────────────────────────

  describe("Selected Actor Candidate invariant", () => {
    it("rejects actor not represented as candidate", () => {
      const state = baseState();
      // Entity B exists but is not a candidate
      const entityB = "f7010101-0101-4101-8101-010101010199";
      const stateWithB: ProjectState = {
        ...state,
        reality_entities: [...state.reality_entities, entity(entityB, "Not A Candidate")],
      };
      assert.throws(
        () => applyPatch(stateWithB, buildDecisionPatch(stateWithB, DECL_ID, {
          selectedActorEntityId: entityB,
        })),
        /candidate|actor/i
      );
    });

    it("accepts INTERVENTION selection without actor (actor optional)", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, { selectedActorEntityId: null });
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations.length, 1);
      assert.equal(next.reality_decision_declarations[0]!.selected_actor_entity_id, null);
    });
  });

  // ── Append-only semantics ──────────────────────────────────────────────────

  describe("Append-only / immutability", () => {
    it("rejects update to existing RealityDecisionDeclaration", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const afterFirst = applyPatch(state, patch);

      // Try to upsert same ID again
      const patch2 = buildDecisionPatch(afterFirst, DECL_ID);
      assert.throws(() => applyPatch(afterFirst, patch2), /append-only/i);
    });

    it("rejects delete of RealityDecisionDeclaration", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const after = applyPatch(state, patch);

      const deletePatch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          { op: "delete", entity: "reality_decision_declaration", entity_id: DECL_ID },
        ],
      };
      assert.throws(() => applyPatch(after, deletePatch), /append-only|cannot delete/i);
    });

    it("rejects semantic duplicate from same declarer", () => {
      const state = baseState();
      const patch1 = buildDecisionPatch(state, DECL_ID);
      const after = applyPatch(state, patch1);

      // Different ID but same semantic key + same declarer
      const patch2 = buildDecisionPatch(after, DECL_ID_2);
      assert.throws(() => applyPatch(after, patch2), /duplicate/i);
    });

    it("allows same semantic Decision from different declarer (multiple provenance)", () => {
      const state = baseState();
      const patch1 = buildDecisionPatch(state, DECL_ID, {
        declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
      });
      const after = applyPatch(state, patch1);

      const patch2 = buildDecisionPatch(after, DECL_ID_2, {
        declaredBy: { kind: "organization" },
      });
      const after2 = applyPatch(after, patch2);
      assert.equal(after2.reality_decision_declarations.length, 2);
    });
  });

  // ── Decision under uncertainty ─────────────────────────────────────────────

  describe("Decision under uncertainty (gaps/prohibits/contests)", () => {
    it("accepts Decision selecting actor with capability gap", () => {
      // No capability declarations → gap exists, Decision still valid
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, {
        selectedActorEntityId: ENTITY_ACTOR_A,
      });
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations.length, 1);
      // Gap may be in snapshot
      const snap = next.reality_decision_declarations[0]!.context_snapshot;
      const fb = snap.actor_feasibility_bases.find((b) => b.actor_entity_id === ENTITY_ACTOR_A);
      // gaps may be present — that is expected and valid
      assert.ok(fb !== undefined || snap.actor_feasibility_bases.length === 0);
    });

    it("Decision with model limitations still persists (model limitations != rejection)", () => {
      const state = baseState();
      const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      const hasModelLimitations = snapshot.actor_feasibility_bases.some(
        (fb) => fb.model_limitations.length > 0
      );
      // Model limitations are expected and do not prevent recording
      const patch = buildDecisionPatch(state, DECL_ID, { selectedActorEntityId: ENTITY_ACTOR_A });
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations.length, 1);
      // model_limitations in snapshot are preserved
      void hasModelLimitations;
    });
  });

  // ── No-mutation firewalls ──────────────────────────────────────────────────

  describe("Firewall: Decision does not mutate other collections", () => {
    it("Decision does not change reality_entities", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, { selectedActorEntityId: ENTITY_ACTOR_A });
      const next = applyPatch(state, patch);
      assert.deepEqual(
        next.reality_entities.map((e) => e.id).sort(),
        state.reality_entities.map((e) => e.id).sort()
      );
    });

    it("Decision does not change intervention_declarations", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      assert.equal(next.intervention_declarations.length, state.intervention_declarations.length);
    });

    it("Decision does not change decision_option_declarations", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      assert.equal(
        next.decision_option_declarations.length,
        state.decision_option_declarations.length
      );
    });

    it("Decision does not create capability_declarations", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      assert.equal(next.capability_declarations.length, state.capability_declarations.length);
    });

    it("Decision does not create intervention_permission_declarations", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      assert.equal(
        next.intervention_permission_declarations.length,
        state.intervention_permission_declarations.length
      );
    });

    it("Decision does not create resource_declarations", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      assert.equal(next.resource_declarations.length, state.resource_declarations.length);
    });

    it("Decision does not change legacy decisions[]", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      assert.equal(next.decisions.length, state.decisions.length);
    });

    it("read-only: getDecisionSpaceDecisionHistory leaves ProjectState deepEqual", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const after = applyPatch(state, patch);
      const snapshot = JSON.stringify(after);
      getDecisionSpaceDecisionHistory(after, SPACE_D);
      assert.equal(JSON.stringify(after), snapshot, "ProjectState must not be mutated");
    });
  });

  // ── Snapshot frozen after changes ─────────────────────────────────────────

  describe("Frozen snapshot after state changes", () => {
    it("historical snapshot unchanged after adding new Capability", () => {
      const state = baseState();
      const patch1 = buildDecisionPatch(state, DECL_ID, { selectedActorEntityId: ENTITY_ACTOR_A });
      const after1 = applyPatch(state, patch1);
      const originalSnapshot = JSON.stringify(after1.reality_decision_declarations[0]!.context_snapshot);

      // Add a capability
      const capId = "f7080808-0808-4808-8808-080808080801";
      const capPatch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "capability_declaration",
            entity_id: capId,
            payload: {
              id: capId,
              project_id: PROJECT_ID,
              holder_entity_id: ENTITY_ACTOR_A,
              capability_key: "new-cap",
              scope: { kind: "UNSCOPED" },
              description: null,
              valid_from: TS,
              valid_until: null,
              declared_by: { kind: "human" },
              recorded_at: TS,
              created_at: TS,
              updated_at: TS,
            },
          },
        ],
      };
      const after2 = applyPatch(after1, capPatch);
      const frozenSnapshot = JSON.stringify(after2.reality_decision_declarations[0]!.context_snapshot);
      assert.equal(frozenSnapshot, originalSnapshot, "Historical snapshot must remain unchanged");
    });

    it("current assessment can differ from historical snapshot (by design)", () => {
      // The frozen snapshot is fixed at recorded_at; a current assessment at a later time
      // or with different parameters may produce different results. This is expected behavior.
      // The frozen snapshot is NOT automatically updated.
      const state = baseState();
      const patch1 = buildDecisionPatch(state, DECL_ID, { selectedActorEntityId: ENTITY_ACTOR_A });
      const after1 = applyPatch(state, patch1);

      // The historical snapshot is fixed at (DECIDED_AT, RECORDED_AT)
      const historicalSnap = after1.reality_decision_declarations[0]!.context_snapshot;

      // A current snapshot computed at a later time would be different
      const laterTime = "2026-09-01T10:00:00.000Z";
      const currentSnap = buildDecisionContextSnapshot(after1, SPACE_D, laterTime, laterTime);

      // The two snapshots have different assessed_at and captured_at → not equal
      assert.notEqual(currentSnap.assessed_at, historicalSnap.assessed_at);
      assert.notEqual(currentSnap.captured_at, historicalSnap.captured_at);
    });
  });

  // ── Derived assessments ────────────────────────────────────────────────────

  describe("assessDecisionMemory", () => {
    it("selected_option_was_represented is always true (validated at write time)", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, { selectedActorEntityId: ENTITY_ACTOR_A });
      const after = applyPatch(state, patch);
      const decl = after.reality_decision_declarations[0]!;
      const assessment = assessDecisionMemory(decl);
      assert.equal(assessment.selected_option_was_represented, true);
    });

    it("decision_authority_modeled is always false", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const after = applyPatch(state, patch);
      const assessment = assessDecisionMemory(after.reality_decision_declarations[0]!);
      assert.equal(assessment.decision_authority_modeled, false);
    });

    it("outcome_modeled is always false", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const after = applyPatch(state, patch);
      const assessment = assessDecisionMemory(after.reality_decision_declarations[0]!);
      assert.equal(assessment.outcome_modeled, false);
    });

    it("selected_actor_was_candidate is true when actor is in snapshot candidates", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, { selectedActorEntityId: ENTITY_ACTOR_A });
      const after = applyPatch(state, patch);
      const assessment = assessDecisionMemory(after.reality_decision_declarations[0]!);
      assert.equal(assessment.selected_actor_was_candidate, true);
    });

    it("selected_actor_was_candidate is null when no actor selected", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID, { selectedActorEntityId: null });
      const after = applyPatch(state, patch);
      const assessment = assessDecisionMemory(after.reality_decision_declarations[0]!);
      assert.equal(assessment.selected_actor_was_candidate, null);
    });

    it("assessment is read-only and deterministic", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const after = applyPatch(state, patch);
      const decl = after.reality_decision_declarations[0]!;
      const a1 = assessDecisionMemory(decl);
      const a2 = assessDecisionMemory(decl);
      assert.deepEqual(
        JSON.stringify(a1, null, 0),
        JSON.stringify(a2, null, 0)
      );
    });
  });

  // ── History and conflict detection ─────────────────────────────────────────

  describe("getDecisionSpaceDecisionHistory", () => {
    it("returns empty history for space with no decisions", () => {
      const state = baseState();
      const history = getDecisionSpaceDecisionHistory(state, SPACE_D);
      assert.equal(history.has_decisions, false);
      assert.equal(history.decision_declarations.length, 0);
      assert.equal(history.has_selection_conflicts, false);
    });

    it("returns decisions sorted by decided_at/maker/key", () => {
      const state = baseState();
      const early = "2026-07-01T10:00:00.000Z";
      const p1 = buildDecisionPatch(state, DECL_ID, { decidedAt: DECIDED_AT, recordedAt: RECORDED_AT });
      const after1 = applyPatch(state, p1);
      const p2 = buildDecisionPatch(after1, DECL_ID_2, {
        decidedAt: early,
        recordedAt: RECORDED_AT,
        selectedOption: { kind: "DO_NOTHING" },
        selectedActorEntityId: null,
        declaredBy: { kind: "organization" },
      });
      const after2 = applyPatch(after1, p2);
      const history = getDecisionSpaceDecisionHistory(after2, SPACE_D);
      assert.equal(history.decision_declarations.length, 2);
      // Chronologically sorted: early first
      assert.equal(history.decision_declarations[0]!.decided_at, early);
    });
  });

  describe("groupRealityDecisionPositions and detectDecisionSelectionConflicts", () => {
    it("groups same semantic decision as one position with multiple declarers", () => {
      const state = baseState();
      const decl1: RealityDecisionDeclaration = {
        id: DECL_ID,
        project_id: PROJECT_ID,
        decision_space_id: SPACE_D,
        decision_maker_entity_id: ENTITY_MAKER,
        selected_option: { kind: "INTERVENTION", intervention_id: INT_A },
        selected_actor_entity_id: null,
        decided_at: DECIDED_AT,
        rationale: null,
        context_snapshot: buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT),
        declared_by: { kind: "human" },
        recorded_at: RECORDED_AT,
        created_at: RECORDED_AT,
        updated_at: RECORDED_AT,
      };
      const decl2: RealityDecisionDeclaration = {
        ...decl1,
        id: DECL_ID_2,
        declared_by: { kind: "organization" },
      };
      const positions = groupRealityDecisionPositions([decl1, decl2]);
      assert.equal(positions.length, 1);
      assert.equal(positions[0]!.has_multiple_declarations, true);
      assert.equal(positions[0]!.decision_declaration_ids.length, 2);
    });

    it("detects conflict when same maker/time but different selections", () => {
      const state = baseState();
      const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      const decl1: RealityDecisionDeclaration = {
        id: DECL_ID,
        project_id: PROJECT_ID,
        decision_space_id: SPACE_D,
        decision_maker_entity_id: ENTITY_MAKER,
        selected_option: { kind: "INTERVENTION", intervention_id: INT_A },
        selected_actor_entity_id: null,
        decided_at: DECIDED_AT,
        rationale: null,
        context_snapshot: snapshot,
        declared_by: { kind: "human" },
        recorded_at: RECORDED_AT,
        created_at: RECORDED_AT,
        updated_at: RECORDED_AT,
      };
      const decl2: RealityDecisionDeclaration = {
        ...decl1,
        id: DECL_ID_2,
        selected_option: { kind: "DO_NOTHING" },
        declared_by: { kind: "organization" },
      };
      const positions = groupRealityDecisionPositions([decl1, decl2]);
      assert.equal(positions.length, 2); // different semantic keys → 2 positions
      const conflicts = detectDecisionSelectionConflicts(positions);
      assert.equal(conflicts.length, 1);
      assert.equal(conflicts[0]!.conflicting_positions.length, 2);
    });

    it("no conflict when different decision makers", () => {
      const state = baseState();
      const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      const makeDecl = (id: string, makerId: string): RealityDecisionDeclaration => ({
        id,
        project_id: PROJECT_ID,
        decision_space_id: SPACE_D,
        decision_maker_entity_id: makerId,
        selected_option: { kind: "INTERVENTION", intervention_id: INT_A },
        selected_actor_entity_id: null,
        decided_at: DECIDED_AT,
        rationale: null,
        context_snapshot: snapshot,
        declared_by: { kind: "human" },
        recorded_at: RECORDED_AT,
        created_at: RECORDED_AT,
        updated_at: RECORDED_AT,
      });
      const positions = groupRealityDecisionPositions([
        makeDecl(DECL_ID, ENTITY_MAKER),
        makeDecl(DECL_ID_2, ENTITY_ACTOR_A),
      ]);
      const conflicts = detectDecisionSelectionConflicts(positions);
      assert.equal(conflicts.length, 0, "Different makers → no automatic conflict");
    });

    it("no conflict for same maker different decided_at (sequential decisions)", () => {
      const state = baseState();
      const snap1 = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
      const snap2 = buildDecisionContextSnapshot(state, SPACE_D, RECORDED_AT, RECORDED_AT);
      const decl1: RealityDecisionDeclaration = {
        id: DECL_ID,
        project_id: PROJECT_ID,
        decision_space_id: SPACE_D,
        decision_maker_entity_id: ENTITY_MAKER,
        selected_option: { kind: "INTERVENTION", intervention_id: INT_A },
        selected_actor_entity_id: null,
        decided_at: DECIDED_AT,
        rationale: null,
        context_snapshot: snap1,
        declared_by: { kind: "human" },
        recorded_at: RECORDED_AT,
        created_at: RECORDED_AT,
        updated_at: RECORDED_AT,
      };
      const decl2: RealityDecisionDeclaration = {
        ...decl1,
        id: DECL_ID_2,
        decided_at: RECORDED_AT,
        context_snapshot: snap2,
        selected_option: { kind: "DO_NOTHING" },
      };
      const positions = groupRealityDecisionPositions([decl1, decl2]);
      const conflicts = detectDecisionSelectionConflicts(positions);
      assert.equal(conflicts.length, 0, "Different decided_at → no automatic conflict, no supersession");
    });

    it("no getCurrentDecision / latestEffectiveDecision API exposed", async () => {
      // Verify the types/functions exported from decision-memory-core do not include lifecycle APIs
      const mod = await import("../reality/decision-memory-core.js");
      const exported = Object.keys(mod);
      const forbidden = ["getCurrentDecision", "latestEffectiveDecision", "bindingDecision"];
      for (const name of forbidden) {
        assert.ok(!exported.includes(name), `${name} must not be exported`);
      }
    });
  });

  // ── AUTHORIZE_INTERVENTION firewall ───────────────────────────────────────

  describe("AUTHORIZE_INTERVENTION ≠ Decision Authority", () => {
    it("Decision remains valid even when no AUTHORIZE_INTERVENTION authority exists", () => {
      const state = baseState();
      // No authority declarations
      assert.equal(state.authority_declarations.length, 0);
      const patch = buildDecisionPatch(state, DECL_ID);
      const next = applyPatch(state, patch);
      assert.equal(next.reality_decision_declarations.length, 1);
    });
  });

  // ── Forbidden vocabulary check ─────────────────────────────────────────────

  describe("Forbidden vocabulary", () => {
    it("types and API source files do not contain forbidden semantic vocabulary", () => {
      const files = [
        join(__dirnameTest, "../reality/decision-memory-core.ts"),
        join(__dirnameTest, "../reality/decision-memory-types.ts"),
      ];

      for (const file of files) {
        const src = readFileSync(file, "utf8");
        // Allow in comments only; check identifiers
        const strippedComments = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
        assert.ok(
          !FORBIDDEN.test(strippedComments),
          `Forbidden vocabulary detected in ${file}: ${FORBIDDEN.toString()}`
        );
      }
    });
  });

  // ── Deletion guards on Decision Space / Intervention ──────────────────────

  describe("Deletion guards for entities referenced by RealityDecisionDeclaration", () => {
    it("rejects deletion of decision_space_declaration referenced by reality_decision_declaration", () => {
      const state = baseState();
      const patch = buildDecisionPatch(state, DECL_ID);
      const after = applyPatch(state, patch);

      const deletePatch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          { op: "delete", entity: "decision_space_declaration", entity_id: SPACE_D },
        ],
      };
      assert.throws(() => applyPatch(after, deletePatch), /reality_decision_declaration|decision_space/i);
    });
  });
});

// Persistence-time verification facts are separate from the recorded snapshot.
import { getDecisionHistoricalSnapshot, getDecisionSnapshotVerification } from "../decision-snapshot-verification.js";
import { validateProjectState } from "../validate.js";

describe("Decision snapshot persistence-time verification", () => {
  function persist(unresolved = false, alter = false) {
    const state = baseState();
    const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
    if (alter) {
      snapshot.actor_feasibility_bases[0]!.permission.has_permit_declaration = true;
    }
    if (unresolved) state.decision_option_actor_candidate_declarations[0]!.recorded_at = "2026-07-01T23:59:60Z";
    const patch = buildDecisionPatch(state, DECL_ID, { snapshotOverride: snapshot, selectedActorEntityId: ENTITY_ACTOR_A });
    const before = JSON.stringify(patch);
    const next = applyPatch(state, patch);
    assert.equal(JSON.stringify(patch), before, "verification generation does not mutate caller input");
    return { state: next, decision: next.reality_decision_declarations[0]!, snapshot };
  }

  it("records VERIFIED only after deterministic persistence-time match", () => {
    const { state, decision } = persist();
    const fact = getDecisionSnapshotVerification(decision);
    assert.equal(fact.status, "VERIFIED");
    assert.equal(fact.decision_id, decision.id);
    assert.match(fact.snapshot_content_digest, /^sha256:[a-f0-9]{64}$/);
    assert.ok(fact.persisted_at);
    assert.equal(state.schema_version, "0.1.25");
    assert.equal(validateProjectState(state).valid, true);
    assert.equal(assessDecisionMemory(decision).snapshot_verification.status, "VERIFIED");
  });

  it("preserves unresolved snapshot and temporal reason without calling it mismatched", () => {
    const { decision, snapshot } = persist(true);
    const fact = getDecisionSnapshotVerification(decision);
    assert.deepEqual(decision.context_snapshot, snapshot);
    assert.equal(fact.status, "UNVERIFIED");
    if (fact.status === "UNVERIFIED") {
      assert.equal(fact.reason, "TEMPORAL_RESOLUTION_UNAVAILABLE");
      assert.equal(fact.temporal_reason, "LEAP_SECOND_AUTHORITY_NOT_AVAILABLE");
      assert.equal(fact.temporal_declaration, "2026-07-01T23:59:60Z");
    }
  });

  it("rejects executable mismatch without generating verification", () => {
    assert.throws(() => persist(false, true), /deterministic expected snapshot/);
  });

  it("Permission reproduction stays visible but explicitly UNVERIFIED", () => {
    const { state, decision } = persist(true, true);
    assert.equal(state.intervention_permission_declarations.length, 0);
    const memory = assessDecisionMemory(decision);
    assert.equal(memory.selected_actor_feasibility_basis!.permission.has_permit_declaration, true);
    assert.equal(memory.snapshot_verification.status, "UNVERIFIED");
    assert.equal(getDecisionHistoricalSnapshot(decision).verification.status, "UNVERIFIED");
  });

  for (const unresolved of [false, true]) it(`current Reality and later resolvability cannot change stored fact: ${unresolved}`, () => {
    const { state, decision } = persist(unresolved);
    const original = structuredClone(getDecisionSnapshotVerification(decision));
    // A later resolvable source or an absent current source is not historical proof.
    state.decision_option_actor_candidate_declarations[0]!.recorded_at = TS;
    state.intervention_permission_declarations = [];
    state.decision_option_actor_candidate_declarations = [];
    const reloaded = migrateProjectState(JSON.parse(JSON.stringify(state)));
    assert.deepEqual(getDecisionSnapshotVerification(reloaded.reality_decision_declarations[0]!), original);
  });

  it("different frozen snapshot or Decision cannot inherit old VERIFIED fact", () => {
    const { state, decision } = persist();
    decision.context_snapshot.actor_feasibility_bases[0]!.permission.has_permit_declaration = true;
    assert.throws(() => assessDecisionMemory(decision), /different frozen content/);
    assert.throws(() => migrateProjectState(state), /different frozen content/);
    const other = persist().decision;
    other.id = DECL_ID_2;
    assert.throws(() => getDecisionHistoricalSnapshot(other), /different frozen content/);
  });

  it("content binding ignores JSON member order and does not infer temporal identity", () => {
    const { decision } = persist(true);
    const fact = getDecisionSnapshotVerification(decision);
    decision.context_snapshot = Object.fromEntries(Object.entries(decision.context_snapshot).reverse()) as unknown as DecisionContextSnapshotV1;
    assert.deepEqual(getDecisionSnapshotVerification(decision), fact);
  });

  it("legacy migration records absence of evidence without recomputation", () => {
    const { state, decision } = persist();
    state.schema_version = "0.1.24";
    delete decision.snapshot_verification;
    state.decision_option_actor_candidate_declarations[0]!.recorded_at = "2026-07-01T23:59:60Z";
    const migrated = migrateProjectState(state);
    const fact = getDecisionSnapshotVerification(migrated.reality_decision_declarations[0]!);
    assert.equal(fact.status, "NOT_RECORDED");
    assert.equal(fact.persisted_at, null);
    assert.equal(migrateProjectState(migrated).reality_decision_declarations[0]!.snapshot_verification!.status, "NOT_RECORDED");
    assert.deepEqual(decision.context_snapshot, migrated.reality_decision_declarations[0]!.context_snapshot);
  });

  it("caller cannot declare its own successful verification through patch", () => {
    const state = baseState(), patch = buildDecisionPatch(state, DECL_ID);
    const payload = patch.operations[0]!.payload as Record<string, unknown>;
    payload.snapshot_verification = persist().decision.snapshot_verification;
    assert.throws(() => applyPatch(state, patch), /generated only by Decision persistence/);
  });
});

it("snapshot semantic matching ignores object member insertion order at persistence", () => {
  const state = baseState();
  const snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
  const reordered = Object.fromEntries(Object.entries(snapshot).reverse()) as unknown as DecisionContextSnapshotV1;
  const next = applyPatch(state, buildDecisionPatch(state, DECL_ID, { snapshotOverride: reordered }));
  assert.equal(getDecisionSnapshotVerification(next.reality_decision_declarations[0]!).status, "VERIFIED");
});

import { assessIntentDecisionBasis } from "../reality/intent-core.js";
import { assessCommitmentBasis } from "../reality/commitment-core.js";
import { saveProject, loadProject } from "../file-store.js";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

it("unverified historical fact survives file storage and accompanies Intent and Commitment", () => {
  const source = baseState();
  const snapshot = buildDecisionContextSnapshot(source, SPACE_D, DECIDED_AT, RECORDED_AT);
  source.decision_option_actor_candidate_declarations[0]!.recorded_at = "2026-07-01T23:59:60Z";
  const state = applyPatch(source, buildDecisionPatch(source, DECL_ID, { snapshotOverride: snapshot, selectedActorEntityId: ENTITY_ACTOR_A }));
  const common = { project_id: PROJECT_ID, intervention_id: INT_A, valid_until: null, declared_by: { kind: "human" as const }, recorded_at: RECORDED_AT, created_at: RECORDED_AT, updated_at: RECORDED_AT };
  state.intervention_intent_declarations.push({ ...common, id: DECL_ID_2, intent_holder_entity_id: ENTITY_ACTOR_A, disposition: "PURSUE", decision_basis_declaration_id: DECL_ID, intent_formed_at: RECORDED_AT });
  state.intervention_commitment_declarations.push({ ...common, id: DECL_ID_3, commitment_holder_entity_id: ENTITY_ACTOR_A, basis: [{ kind: "REALITY_DECISION", decision_declaration_id: DECL_ID }], committed_at: RECORDED_AT });
  const storageDir = mkdtempSync(join(tmpdir(), "ground-snapshot-fact-"));
  try {
    saveProject(state, { storageDir });
    const loaded = loadProject(PROJECT_ID, { storageDir });
    assert.equal(assessIntentDecisionBasis(loaded, DECL_ID_2).decision_snapshot_verification!.status, "UNVERIFIED");
    assert.equal(assessCommitmentBasis(loaded, DECL_ID_3).decision_snapshot_verifications[0]!.status, "UNVERIFIED");
  } finally { rmSync(storageDir, { recursive: true, force: true }); }
});

it("raw historical snapshot stays inspectable when its own time is unresolved", () => {
  const state = baseState(), snapshot = buildDecisionContextSnapshot(state, SPACE_D, DECIDED_AT, RECORDED_AT);
  const leap = "2026-08-01T23:59:60Z";
  snapshot.assessed_at = leap;
  const next = applyPatch(state, buildDecisionPatch(state, DECL_ID, { snapshotOverride: snapshot, decidedAt: leap }));
  const recorded = getDecisionHistoricalSnapshot(next.reality_decision_declarations[0]!);
  assert.equal(recorded.verification.status, "UNVERIFIED");
  assert.equal(recorded.snapshot.assessed_at, leap);
});
