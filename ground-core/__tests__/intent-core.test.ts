/**
 * GROUND-029 — Intent Core I / Actor Prospective Intent Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { ACTION_INTENTS } from "../intake/types.js";
import { migrateProjectState } from "../migrate.js";
import { buildDecisionContextSnapshot } from "../reality/decision-memory-core.js";
import { assessDeclaredInterventionPermission } from "../reality/permission-core.js";
import {
  assessDeclaredInterventionIntent,
  assessIntentDecisionBasis,
  detectIntentDispositionConflict,
  getInterventionIntentHistory,
  groupInterventionIntentPositions,
  intentDispositionConflictKey,
  interventionIntentPositionKey,
  isInterventionIntentActiveAt,
} from "../reality/intent-core.js";
import { applyPatch } from "../state-engine.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionDeclaration,
  InterventionIntentDeclaration,
  MandateDeclaration,
  ProjectState,
  RealityEntity,
  StatePatch,
} from "../types.js";
import {
  PROJECT_ID,
  validProjectStateV0117,
  validProjectStateV0124,
} from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_HOLDER = "f8010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR_B = "f8010101-0101-4101-8101-010101010102";
const ENTITY_DECLARER = "f8010101-0101-4101-8101-010101010103";
const ENTITY_MAKER = "f8010101-0101-4101-8101-010101010104";
const INT_A = "f8020202-0202-4202-8202-020202020201";
const INT_B = "f8020202-0202-4202-8202-020202020202";
const SPACE_D = "f8030303-0303-4303-8303-030303030301";
const OPT_INT = "f8040404-0404-4404-8404-040404040401";
const OPT_DN = "f8040404-0404-4404-8404-040404040402";
const CAND_A = "f8050505-0505-4505-8505-050505050501";
const DECISION_ID = "f8060606-0606-4606-8606-060606060601";
const INTENT_ID = "f8070707-0707-4707-8707-070707070701";
const INTENT_ID_2 = "f8070707-0707-4707-8707-070707070702";
const OBJ_ID = "f8080808-0808-4808-8808-080808080801";
const MANDATE_ID = "f8090909-0909-4909-8909-090909090901";
const PERM_ID = "f80a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";

const TS = "2026-07-01T10:00:00.000Z";
const FORMED = "2026-08-01T10:00:00.000Z";
const NOON = "2026-08-01T12:00:00.000Z";
const FOURTEEN = "2026-08-01T14:00:00.000Z";
const SIXTEEN = "2026-08-01T16:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";
const DECIDED_AT = "2026-08-01T10:00:00.000Z";

const FORBIDDEN_API =
  /\b(effective_intent|current_intent|latest_intent_wins|binding_intent|execute_at|deadline|commitment_level|likelihood_to_act)\b/;

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
    label: "Space",
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

function baseState(overrides: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_HOLDER, "Holder A"),
      entity(ENTITY_ACTOR_B, "Actor B"),
      entity(ENTITY_DECLARER, "Declarer"),
      entity(ENTITY_MAKER, "Maker"),
    ],
    intervention_declarations: [intervention(INT_A), intervention(INT_B)],
    decision_space_declarations: [decisionSpace(SPACE_D)],
    decision_option_declarations: [
      decisionOption(OPT_INT, SPACE_D, "INTERVENTION", INT_A),
      decisionOption(OPT_DN, SPACE_D, "DO_NOTHING"),
    ],
    decision_option_actor_candidate_declarations: [
      actorCandidate(CAND_A, OPT_INT, ENTITY_HOLDER),
    ],
    ...overrides,
  };
}

function intentPayload(
  id: string,
  opts: {
    holder?: string;
    interventionId?: string;
    disposition?: "PURSUE" | "REFRAIN";
    decisionBasisId?: string | null;
    formedAt?: string;
    validUntil?: string | null;
    recordedAt?: string;
    note?: string | null;
    declaredBy?: InterventionIntentDeclaration["declared_by"];
  } = {}
): InterventionIntentDeclaration {
  const formedAt = opts.formedAt ?? FORMED;
  const recordedAt = opts.recordedAt ?? RECORDED;
  return {
    id,
    project_id: PROJECT_ID,
    intent_holder_entity_id: opts.holder ?? ENTITY_HOLDER,
    intervention_id: opts.interventionId ?? INT_A,
    disposition: opts.disposition ?? "PURSUE",
    decision_basis_declaration_id:
      opts.decisionBasisId === undefined ? null : opts.decisionBasisId,
    intent_formed_at: formedAt,
    valid_until: opts.validUntil === undefined ? null : opts.validUntil,
    note: opts.note === undefined ? null : opts.note,
    declared_by: opts.declaredBy ?? { kind: "human" },
    recorded_at: recordedAt,
    created_at: recordedAt,
    updated_at: recordedAt,
  };
}

function intentPatch(
  id: string,
  opts: Parameters<typeof intentPayload>[1] = {}
): StatePatch {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_intent_declaration",
        entity_id: id,
        payload: intentPayload(id, opts),
      },
    ],
  };
}

function applyDecision(
  state: ProjectState,
  opts: {
    selectedActor?: string | null;
    option?: { kind: "INTERVENTION"; intervention_id: string } | { kind: "DO_NOTHING" };
    decidedAt?: string;
    recordedAt?: string;
    decisionId?: string;
  } = {}
): ProjectState {
  const decidedAt = opts.decidedAt ?? DECIDED_AT;
  const recordedAt = opts.recordedAt ?? RECORDED;
  const decisionId = opts.decisionId ?? DECISION_ID;
  const selectedOption = opts.option ?? {
    kind: "INTERVENTION" as const,
    intervention_id: INT_A,
  };
  const snapshot = buildDecisionContextSnapshot(
    state,
    SPACE_D,
    decidedAt,
    recordedAt
  );
  const patch: StatePatch = {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "reality_decision_declaration",
        entity_id: decisionId,
        payload: {
          id: decisionId,
          project_id: PROJECT_ID,
          decision_space_id: SPACE_D,
          decision_maker_entity_id: ENTITY_MAKER,
          selected_option: selectedOption,
          selected_actor_entity_id: opts.selectedActor ?? null,
          decided_at: decidedAt,
          rationale: null,
          context_snapshot: snapshot,
          declared_by: { kind: "human" },
          recorded_at: recordedAt,
          created_at: recordedAt,
          updated_at: recordedAt,
        },
      },
    ],
  };
  return applyPatch(state, patch);
}

describe("Intent Core I (GROUND-029)", () => {
  describe("Migration", () => {
    it("migrates 0.1.17 → 0.1.18 with empty Intent array", () => {
      const migrated = migrateProjectState(validProjectStateV0117);
      assert.equal(migrated.schema_version, "0.1.24");
      assert.deepEqual(migrated.intervention_intent_declarations, []);
    });

    it("does not backfill Intent from Decision / Mandate / Permission", () => {
      const migrated = migrateProjectState(validProjectStateV0117);
      assert.equal(migrated.intervention_intent_declarations.length, 0);
    });

    it("SCHEMA_VERSION is 0.1.18", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
    });
  });

  describe("Persistence", () => {
    it("persists PURSUE Intent roundtrip", () => {
      const next = applyPatch(baseState(), intentPatch(INTENT_ID));
      const stored = next.intervention_intent_declarations[0]!;
      assert.equal(stored.disposition, "PURSUE");
      assert.equal(stored.intent_holder_entity_id, ENTITY_HOLDER);
      assert.equal(stored.intervention_id, INT_A);
      assert.equal(stored.decision_basis_declaration_id, null);
    });

    it("persists REFRAIN Intent roundtrip", () => {
      const next = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { disposition: "REFRAIN" })
      );
      assert.equal(
        next.intervention_intent_declarations[0]?.disposition,
        "REFRAIN"
      );
    });

    it("allows Intent without Decision", () => {
      const next = applyPatch(baseState(), intentPatch(INTENT_ID));
      const assessment = assessIntentDecisionBasis(next, INTENT_ID);
      assert.equal(assessment.has_decision_basis, false);
      assert.equal(assessment.decision_basis_declaration_id, null);
    });

    it("stores note verbatim without scoring", () => {
      const next = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { note: "because the pipe is leaking" })
      );
      assert.equal(
        next.intervention_intent_declarations[0]?.note,
        "because the pipe is leaking"
      );
    });
  });

  describe("Referential / temporal invariants", () => {
    it("rejects unknown holder", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            intentPatch(INTENT_ID, {
              holder: "00000000-0000-4000-8000-000000000099",
            })
          ),
        /intent_holder_entity_id/
      );
    });

    it("rejects unknown Intervention", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            intentPatch(INTENT_ID, {
              interventionId: "00000000-0000-4000-8000-000000000099",
            })
          ),
        /intervention_id/
      );
    });

    it("rejects unknown disposition", () => {
      const patch = intentPatch(INTENT_ID);
      (patch.operations[0]!.payload as { disposition: string }).disposition =
        "MAYBE";
      assert.throws(() => applyPatch(baseState(), patch), /disposition|Invalid patch schema/);
    });

    it("rejects intent_formed_at > recorded_at", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            intentPatch(INTENT_ID, {
              formedAt: "2026-09-01T10:00:00.000Z",
              recordedAt: RECORDED,
            })
          ),
        /intent_formed_at/
      );
    });

    it("rejects valid_until <= intent_formed_at", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            intentPatch(INTENT_ID, { validUntil: FORMED })
          ),
        /valid_until/
      );
    });

    it("applies half-open [intent_formed_at, valid_until)", () => {
      const next = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { formedAt: FORMED, validUntil: NOON })
      );
      const decl = next.intervention_intent_declarations[0]!;
      assert.equal(isInterventionIntentActiveAt(decl, FORMED), true);
      assert.equal(
        isInterventionIntentActiveAt(decl, "2026-08-01T11:00:00.000Z"),
        true
      );
      assert.equal(isInterventionIntentActiveAt(decl, NOON), false);
    });
  });

  describe("Decision basis", () => {
    it("accepts Decision basis selecting the same Intervention", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const next = applyPatch(
        withDecision,
        intentPatch(INTENT_ID, { decisionBasisId: DECISION_ID })
      );
      const assessment = assessIntentDecisionBasis(next, INTENT_ID);
      assert.equal(assessment.has_decision_basis, true);
      assert.equal(
        assessment.selected_actor_relation,
        "INTENT_HOLDER_IS_SELECTED_ACTOR"
      );
      assert.equal(
        assessment.disposition_relation,
        "PURSUES_SELECTED_INTERVENTION"
      );
      assert.equal(assessment.holder_was_candidate_in_decision_snapshot, true);
    });

    it("rejects Decision basis for a different Intervention", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      assert.throws(
        () =>
          applyPatch(
            withDecision,
            intentPatch(INTENT_ID, {
              interventionId: INT_B,
              decisionBasisId: DECISION_ID,
            })
          ),
        /same Intervention/
      );
    });

    it("rejects DO_NOTHING Decision as Intent basis", () => {
      const withDecision = applyDecision(baseState(), {
        option: { kind: "DO_NOTHING" },
      });
      assert.throws(
        () =>
          applyPatch(
            withDecision,
            intentPatch(INTENT_ID, { decisionBasisId: DECISION_ID })
          ),
        /DO_NOTHING/
      );
    });

    it("rejects Intent that predates linked Decision", () => {
      const withDecision = applyDecision(baseState(), {
        decidedAt: DECIDED_AT,
      });
      assert.throws(
        () =>
          applyPatch(
            withDecision,
            intentPatch(INTENT_ID, {
              decisionBasisId: DECISION_ID,
              formedAt: "2026-07-15T10:00:00.000Z",
            })
          ),
        /predate|decided_at/
      );
    });

    it("Decision selected Actor does not create Intent", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const assessment = assessDeclaredInterventionIntent(
        withDecision,
        ENTITY_HOLDER,
        INT_A,
        FORMED
      );
      assert.equal(assessment.status, "NO_INTENT_DECLARATIONS");
      assert.equal(withDecision.intervention_intent_declarations.length, 0);
    });

    it("allows holder different from selected Actor", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const next = applyPatch(
        withDecision,
        intentPatch(INTENT_ID, {
          holder: ENTITY_ACTOR_B,
          decisionBasisId: DECISION_ID,
        })
      );
      const assessment = assessIntentDecisionBasis(next, INTENT_ID);
      assert.equal(
        assessment.selected_actor_relation,
        "INTENT_HOLDER_DIFFERS_FROM_SELECTED_ACTOR"
      );
      assert.equal(assessment.holder_was_candidate_in_decision_snapshot, false);
    });

    it("exposes DECISION_HAS_NO_SELECTED_ACTOR", () => {
      const withDecision = applyDecision(baseState(), { selectedActor: null });
      const next = applyPatch(
        withDecision,
        intentPatch(INTENT_ID, { decisionBasisId: DECISION_ID })
      );
      const assessment = assessIntentDecisionBasis(next, INTENT_ID);
      assert.equal(
        assessment.selected_actor_relation,
        "DECISION_HAS_NO_SELECTED_ACTOR"
      );
    });

    it("REFRAIN linked to selected Intervention does not mutate Decision", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const snapshotBefore = structuredClone(
        withDecision.reality_decision_declarations[0]!.context_snapshot
      );
      const next = applyPatch(
        withDecision,
        intentPatch(INTENT_ID, {
          disposition: "REFRAIN",
          decisionBasisId: DECISION_ID,
        })
      );
      assert.deepEqual(
        next.reality_decision_declarations[0]!.context_snapshot,
        snapshotBefore
      );
      const assessment = assessIntentDecisionBasis(next, INTENT_ID);
      assert.equal(
        assessment.disposition_relation,
        "REFRAINS_FROM_SELECTED_INTERVENTION"
      );
      assert.equal(next.reality_decision_declarations.length, 1);
    });

    it("uses frozen Decision snapshot for candidate relation, not current candidates", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const next = applyPatch(
        withDecision,
        intentPatch(INTENT_ID, { decisionBasisId: DECISION_ID })
      );
      const mutated = structuredClone(next);
      mutated.decision_option_actor_candidate_declarations = [];
      const assessment = assessIntentDecisionBasis(mutated, INTENT_ID);
      assert.equal(assessment.holder_was_candidate_in_decision_snapshot, true);
    });
  });

  describe("Conflicts and multi-source", () => {
    it("rejects same-source overlapping semantic duplicate PURSUE", () => {
      const first = applyPatch(baseState(), intentPatch(INTENT_ID));
      assert.throws(
        () => applyPatch(first, intentPatch(INTENT_ID_2)),
        /semantic duplicate/
      );
    });

    it("preserves same PURSUE from different sources", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { declaredBy: { kind: "human", entity_id: ENTITY_DECLARER } })
      );
      const next = applyPatch(
        first,
        intentPatch(INTENT_ID_2, {
          declaredBy: { kind: "organization", entity_id: ENTITY_MAKER },
        })
      );
      const assessment = assessDeclaredInterventionIntent(
        next,
        ENTITY_HOLDER,
        INT_A,
        FORMED
      );
      assert.equal(assessment.status, "PURSUE_DECLARED");
      assert.equal(assessment.intent_declaration_ids.length, 2);
      const positions = groupInterventionIntentPositions(
        next,
        ENTITY_HOLDER,
        INT_A,
        FORMED
      );
      assert.equal(positions.length, 1);
      assert.equal(positions[0]?.has_multiple_declarations, true);
    });

    it("overlapping PURSUE + REFRAIN yields CONTESTED_INTENT with no winner", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, {
          disposition: "PURSUE",
          formedAt: FORMED,
          validUntil: FOURTEEN,
        })
      );
      const next = applyPatch(
        first,
        intentPatch(INTENT_ID_2, {
          disposition: "REFRAIN",
          formedAt: NOON,
          validUntil: SIXTEEN,
          declaredBy: { kind: "organization", label: "other" },
        })
      );
      const at = "2026-08-01T13:00:00.000Z";
      const assessment = assessDeclaredInterventionIntent(
        next,
        ENTITY_HOLDER,
        INT_A,
        at
      );
      assert.equal(assessment.status, "CONTESTED_INTENT");
      const conflict = detectIntentDispositionConflict(
        next,
        ENTITY_HOLDER,
        INT_A,
        at
      );
      assert.ok(conflict);
      assert.equal(
        conflict!.key,
        intentDispositionConflictKey(ENTITY_HOLDER, INT_A, at)
      );
      assert.ok(!("winner" in conflict!));
    });

    it("allows same source overlapping PURSUE + REFRAIN (contest visible)", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, {
          disposition: "PURSUE",
          formedAt: FORMED,
          validUntil: FOURTEEN,
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        })
      );
      const next = applyPatch(
        first,
        intentPatch(INTENT_ID_2, {
          disposition: "REFRAIN",
          formedAt: NOON,
          validUntil: SIXTEEN,
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        })
      );
      const assessment = assessDeclaredInterventionIntent(
        next,
        ENTITY_HOLDER,
        INT_A,
        "2026-08-01T13:00:00.000Z"
      );
      assert.equal(assessment.status, "CONTESTED_INTENT");
    });

    it("sequential non-overlapping PURSUE then REFRAIN is not contested", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, {
          disposition: "PURSUE",
          formedAt: FORMED,
          validUntil: NOON,
        })
      );
      const next = applyPatch(
        first,
        intentPatch(INTENT_ID_2, {
          disposition: "REFRAIN",
          formedAt: NOON,
          validUntil: null,
          declaredBy: { kind: "human", label: "later" },
        })
      );
      assert.equal(
        assessDeclaredInterventionIntent(next, ENTITY_HOLDER, INT_A, FORMED)
          .status,
        "PURSUE_DECLARED"
      );
      assert.equal(
        assessDeclaredInterventionIntent(next, ENTITY_HOLDER, INT_A, NOON)
          .status,
        "REFRAIN_DECLARED"
      );
      assert.equal(
        detectIntentDispositionConflict(next, ENTITY_HOLDER, INT_A, FORMED),
        null
      );
      assert.equal(
        detectIntentDispositionConflict(next, ENTITY_HOLDER, INT_A, NOON),
        null
      );
    });

    it("different holders opposite dispositions are not IntentDispositionConflict", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { holder: ENTITY_HOLDER, disposition: "PURSUE" })
      );
      const next = applyPatch(
        first,
        intentPatch(INTENT_ID_2, {
          holder: ENTITY_ACTOR_B,
          disposition: "REFRAIN",
        })
      );
      assert.equal(
        detectIntentDispositionConflict(next, ENTITY_HOLDER, INT_A, FORMED),
        null
      );
      assert.equal(
        detectIntentDispositionConflict(next, ENTITY_ACTOR_B, INT_A, FORMED),
        null
      );
    });

    it("same holder different Interventions is not conflict", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { interventionId: INT_A, disposition: "PURSUE" })
      );
      const next = applyPatch(
        first,
        intentPatch(INTENT_ID_2, {
          interventionId: INT_B,
          disposition: "REFRAIN",
        })
      );
      assert.equal(
        detectIntentDispositionConflict(next, ENTITY_HOLDER, INT_A, FORMED),
        null
      );
      assert.equal(
        detectIntentDispositionConflict(next, ENTITY_HOLDER, INT_B, FORMED),
        null
      );
    });

    it("absence is NO_INTENT_DECLARATIONS, not REFRAIN", () => {
      const assessment = assessDeclaredInterventionIntent(
        baseState(),
        ENTITY_HOLDER,
        INT_A,
        FORMED
      );
      assert.equal(assessment.status, "NO_INTENT_DECLARATIONS");
      assert.equal(assessment.has_refrain_declaration, false);
    });
  });

  describe("Append-only", () => {
    it("rejects semantic update of existing Intent", () => {
      const first = applyPatch(baseState(), intentPatch(INTENT_ID));
      assert.throws(
        () =>
          applyPatch(
            first,
            intentPatch(INTENT_ID, { disposition: "REFRAIN" })
          ),
        /append-only/
      );
    });

    it("rejects delete of Intent", () => {
      const first = applyPatch(baseState(), intentPatch(INTENT_ID));
      const patch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "delete",
            entity: "intervention_intent_declaration",
            entity_id: INTENT_ID,
          },
        ],
      };
      assert.throws(() => applyPatch(first, patch), /append-only/);
    });

    it("rejects deleting Intervention referenced by Intent", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { interventionId: INT_B })
      );
      const patch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "delete",
            entity: "intervention_declaration",
            entity_id: INT_B,
          },
        ],
      };
      assert.throws(
        () => applyPatch(first, patch),
        /intervention_intent_declaration/
      );
    });

    it("rejects deleting holder Entity referenced by Intent", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { holder: ENTITY_ACTOR_B })
      );
      const patch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "delete",
            entity: "reality_entity",
            entity_id: ENTITY_ACTOR_B,
          },
        ],
      };
      assert.throws(
        () => applyPatch(first, patch),
        /intent_holder_entity_id/
      );
    });
  });

  describe("Firewalls", () => {
    it("Intent does not mutate Decision / Permission / Capability / Resource / ontic collections", () => {
      const state = baseState();
      const before = structuredClone(state);
      const next = applyPatch(state, intentPatch(INTENT_ID));
      assert.deepEqual(next.reality_entities, before.reality_entities);
      assert.deepEqual(next.reality_events, before.reality_events);
      assert.deepEqual(next.reality_states, before.reality_states);
      assert.deepEqual(next.claims, before.claims);
      assert.deepEqual(next.evidence, before.evidence);
      assert.deepEqual(next.blockers, before.blockers);
      assert.deepEqual(next.authority_declarations, before.authority_declarations);
      assert.deepEqual(next.mandate_declarations, before.mandate_declarations);
      assert.deepEqual(next.capability_declarations, before.capability_declarations);
      assert.deepEqual(next.resource_declarations, before.resource_declarations);
      assert.deepEqual(
        next.intervention_permission_declarations,
        before.intervention_permission_declarations
      );
      assert.deepEqual(
        next.decision_option_declarations,
        before.decision_option_declarations
      );
      assert.deepEqual(
        next.reality_decision_declarations,
        before.reality_decision_declarations
      );
      assert.deepEqual(next.decisions, before.decisions);
      assert.deepEqual(next.next_actions, before.next_actions);
    });

    it("Mandate does not create Intent", () => {
      const mandate: MandateDeclaration = {
        id: MANDATE_ID,
        project_id: PROJECT_ID,
        holder_entity_id: ENTITY_HOLDER,
        kind: "PURSUE_OBJECTIVE",
        objective_id: OBJ_ID,
        valid_from: TS,
        valid_until: null,
        declared_by: { kind: "human" },
        recorded_at: TS,
        created_at: TS,
        updated_at: TS,
      };
      const state = {
        ...baseState(),
        mandate_declarations: [mandate],
      };
      const assessment = assessDeclaredInterventionIntent(
        state,
        ENTITY_HOLDER,
        INT_A,
        FORMED
      );
      assert.equal(assessment.status, "NO_INTENT_DECLARATIONS");
    });

    it("PERMIT does not create PURSUE; PROHIBIT does not create REFRAIN", () => {
      const withPermit: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "intervention_permission_declaration",
            entity_id: PERM_ID,
            payload: {
              id: PERM_ID,
              project_id: PROJECT_ID,
              actor_entity_id: ENTITY_HOLDER,
              intervention_id: INT_A,
              effect: "PERMIT",
              valid_from: TS,
              valid_until: null,
              declared_by: { kind: "human" },
              recorded_at: TS,
              note: null,
              created_at: TS,
              updated_at: TS,
            },
          },
        ],
      };
      const permitted = applyPatch(baseState(), withPermit);
      assert.equal(
        assessDeclaredInterventionIntent(permitted, ENTITY_HOLDER, INT_A, FORMED)
          .status,
        "NO_INTENT_DECLARATIONS"
      );
    });

    it("PURSUE under PROHIBIT remains independently represented", () => {
      const prohibitPatch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "intervention_permission_declaration",
            entity_id: PERM_ID,
            payload: {
              id: PERM_ID,
              project_id: PROJECT_ID,
              actor_entity_id: ENTITY_HOLDER,
              intervention_id: INT_A,
              effect: "PROHIBIT",
              valid_from: TS,
              valid_until: null,
              declared_by: { kind: "human" },
              recorded_at: TS,
              note: null,
              created_at: TS,
              updated_at: TS,
            },
          },
        ],
      };
      const prohibited = applyPatch(baseState(), prohibitPatch);
      const next = applyPatch(prohibited, intentPatch(INTENT_ID));
      assert.equal(
        assessDeclaredInterventionIntent(next, ENTITY_HOLDER, INT_A, FORMED)
          .status,
        "PURSUE_DECLARED"
      );
      assert.equal(
        assessDeclaredInterventionPermission(next, ENTITY_HOLDER, INT_A, FORMED)
          .status,
        "PROHIBIT_DECLARED"
      );
    });

    it("Feasibility / Capability / Resource presence does not create Intent", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      assert.equal(
        assessDeclaredInterventionIntent(
          withDecision,
          ENTITY_HOLDER,
          INT_A,
          FORMED
        ).status,
        "NO_INTENT_DECLARATIONS"
      );
    });

    it("intake ACTION_INTENTS is not a canonical Intent bridge", () => {
      assert.ok(ACTION_INTENTS.includes("decision"));
      assert.ok(!ACTION_INTENTS.includes("PURSUE" as (typeof ACTION_INTENTS)[number]));
      const src = readFileSync(
        join(__dirnameTest, "../reality/intent-core.ts"),
        "utf8"
      );
      assert.equal(src.includes("ACTION_INTENTS"), false);
    });
  });

  describe("Read-only / determinism / vocabulary", () => {
    it("assessment leaves ProjectState deepEqual", () => {
      const next = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, { disposition: "PURSUE" })
      );
      const before = structuredClone(next);
      assessDeclaredInterventionIntent(next, ENTITY_HOLDER, INT_A, FORMED);
      getInterventionIntentHistory(next, ENTITY_HOLDER, INT_A);
      assessIntentDecisionBasis(next, INTENT_ID);
      groupInterventionIntentPositions(next, ENTITY_HOLDER, INT_A, FORMED);
      assert.deepEqual(next, before);
    });

    it("repeated assessments are deepEqual", () => {
      const next = applyPatch(baseState(), intentPatch(INTENT_ID));
      const a = assessDeclaredInterventionIntent(
        next,
        ENTITY_HOLDER,
        INT_A,
        FORMED
      );
      const b = assessDeclaredInterventionIntent(
        next,
        ENTITY_HOLDER,
        INT_A,
        FORMED
      );
      assert.deepEqual(a, b);
      assert.deepEqual(
        getInterventionIntentHistory(next, ENTITY_HOLDER, INT_A),
        getInterventionIntentHistory(next, ENTITY_HOLDER, INT_A)
      );
      assert.deepEqual(
        assessIntentDecisionBasis(next, INTENT_ID),
        assessIntentDecisionBasis(next, INTENT_ID)
      );
    });

    it("history is chronological and has no current/latest winner fields", () => {
      const first = applyPatch(
        baseState(),
        intentPatch(INTENT_ID, {
          disposition: "PURSUE",
          formedAt: FORMED,
          validUntil: NOON,
        })
      );
      const next = applyPatch(
        first,
        intentPatch(INTENT_ID_2, {
          disposition: "REFRAIN",
          formedAt: NOON,
          declaredBy: { kind: "human", label: "later" },
        })
      );
      const history = getInterventionIntentHistory(next, ENTITY_HOLDER, INT_A);
      assert.equal(history.has_declarations, true);
      assert.equal(history.declarations[0]?.id, INTENT_ID);
      assert.equal(history.declarations[1]?.id, INTENT_ID_2);
      assert.ok(!("current_intent" in history));
      assert.ok(!("latest_intent" in history));
      assert.ok(!("superseded" in history.declarations[0]!));
    });

    it("position key is holder|intervention|disposition", () => {
      assert.equal(
        interventionIntentPositionKey(ENTITY_HOLDER, INT_A, "PURSUE"),
        `intent-position|${ENTITY_HOLDER}|${INT_A}|PURSUE`
      );
    });

    it("APIs expose no current/effective Intent", async () => {
      const core = await import("../reality/intent-core.js");
      assert.equal("getCurrentIntent" in core, false);
      assert.equal("latestEffectiveIntent" in core, false);
      assert.equal("bindingIntent" in core, false);
    });

    it("source files do not contain forbidden current/score/schedule vocabulary", () => {
      const files = [
        join(__dirnameTest, "../reality/intent-core.ts"),
        join(__dirnameTest, "../reality/intent-types.ts"),
      ];
      for (const file of files) {
        const src = readFileSync(file, "utf8");
        assert.equal(FORBIDDEN_API.test(src), false, file);
      }
    });

    it("intent-core does not import state-engine / file-store / studio", () => {
      const src = readFileSync(
        join(__dirnameTest, "../reality/intent-core.ts"),
        "utf8"
      );
      assert.equal(/from ["'][^"']*state-engine/.test(src), false);
      assert.equal(/from ["'][^"']*file-store/.test(src), false);
      assert.equal(/from ["'][^"']*studio\//.test(src), false);
    });
  });
});
