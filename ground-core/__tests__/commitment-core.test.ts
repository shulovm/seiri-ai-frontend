/**
 * GROUND-030 — Commitment Core I / Intervention Undertaking Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { migrateProjectState } from "../migrate.js";
import { buildDecisionContextSnapshot } from "../reality/decision-memory-core.js";
import { assessDeclaredInterventionIntent } from "../reality/intent-core.js";
import {
  assessCommitmentBasis,
  assessCommitmentSourceRelation,
  assessDeclaredInterventionCommitment,
  assessInterventionCommitmentContext,
  COMMITMENT_MODEL_LIMITATIONS,
  getInterventionCommitmentHistory,
  groupInterventionCommitmentPositions,
  interventionCommitmentSemanticKey,
  isInterventionCommitmentActiveAt,
} from "../reality/commitment-core.js";
import { applyPatch } from "../state-engine.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  CommitmentBasisReference,
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionCommitmentDeclaration,
  InterventionDeclaration,
  MandateDeclaration,
  ProjectState,
  RealityEntity,
  StatePatch,
} from "../types.js";
import {
  PROJECT_ID,
  validProjectStateV0118,
  validProjectStateV0124,
} from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_HOLDER = "f9010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR_B = "f9010101-0101-4101-8101-010101010102";
const ENTITY_DECLARER = "f9010101-0101-4101-8101-010101010103";
const ENTITY_MAKER = "f9010101-0101-4101-8101-010101010104";
const INT_A = "f9020202-0202-4202-8202-020202020201";
const INT_B = "f9020202-0202-4202-8202-020202020202";
const SPACE_D = "f9030303-0303-4303-8303-030303030301";
const OPT_INT = "f9040404-0404-4404-8404-040404040401";
const OPT_DN = "f9040404-0404-4404-8404-040404040402";
const CAND_A = "f9050505-0505-4505-8505-050505050501";
const DECISION_ID = "f9060606-0606-4606-8606-060606060601";
const INTENT_ID = "f9070707-0707-4707-8707-070707070701";
const COMMIT_ID = "f9080808-0808-4808-8808-080808080801";
const COMMIT_ID_2 = "f9080808-0808-4808-8808-080808080802";
const OBJ_ID = "f9090909-0909-4909-8909-090909090901";
const MANDATE_ID = "f90a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const PERM_ID = "f90b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const NOON = "2026-08-01T12:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";
const DECIDED_AT = "2026-08-01T10:00:00.000Z";
const FORMED = "2026-08-01T10:00:00.000Z";

const FORBIDDEN_API =
  /\b(effective_commitment|binding_commitment|accepted_commitment|deadline|due_at|must_complete_by|accepted_by|acceptance_status|beneficiary|obligee|COMMIT_INTERVENTION|CONTESTED_COMMITMENT)\b/;

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

function commitmentPayload(
  id: string,
  opts: {
    holder?: string;
    interventionId?: string;
    basis?: CommitmentBasisReference[];
    committedAt?: string;
    validUntil?: string | null;
    recordedAt?: string;
    note?: string | null;
    declaredBy?: InterventionCommitmentDeclaration["declared_by"];
  } = {}
): InterventionCommitmentDeclaration {
  const committedAt = opts.committedAt ?? COMMITTED_AT;
  const recordedAt = opts.recordedAt ?? RECORDED;
  return {
    id,
    project_id: PROJECT_ID,
    commitment_holder_entity_id: opts.holder ?? ENTITY_HOLDER,
    intervention_id: opts.interventionId ?? INT_A,
    basis: opts.basis ?? [],
    committed_at: committedAt,
    valid_until: opts.validUntil === undefined ? null : opts.validUntil,
    note: opts.note === undefined ? null : opts.note,
    declared_by: opts.declaredBy ?? { kind: "human" },
    recorded_at: recordedAt,
    created_at: recordedAt,
    updated_at: recordedAt,
  };
}

function commitmentPatch(
  id: string,
  opts: Parameters<typeof commitmentPayload>[1] = {}
): StatePatch {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_commitment_declaration",
        entity_id: id,
        payload: commitmentPayload(id, opts),
      },
    ],
  };
}

function applyDecision(
  state: ProjectState,
  opts: {
    selectedActor?: string | null;
    option?:
      | { kind: "INTERVENTION"; intervention_id: string }
      | { kind: "DO_NOTHING" };
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

function applyIntent(
  state: ProjectState,
  opts: {
    holder?: string;
    interventionId?: string;
    disposition?: "PURSUE" | "REFRAIN";
    formedAt?: string;
    decisionBasisId?: string | null;
    intentId?: string;
  } = {}
): ProjectState {
  const intentId = opts.intentId ?? INTENT_ID;
  const formedAt = opts.formedAt ?? FORMED;
  const patch: StatePatch = {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_intent_declaration",
        entity_id: intentId,
        payload: {
          id: intentId,
          project_id: PROJECT_ID,
          intent_holder_entity_id: opts.holder ?? ENTITY_HOLDER,
          intervention_id: opts.interventionId ?? INT_A,
          disposition: opts.disposition ?? "PURSUE",
          decision_basis_declaration_id: opts.decisionBasisId ?? null,
          intent_formed_at: formedAt,
          valid_until: null,
          note: null,
          declared_by: { kind: "human" },
          recorded_at: RECORDED,
          created_at: RECORDED,
          updated_at: RECORDED,
        },
      },
    ],
  };
  return applyPatch(state, patch);
}

describe("Commitment Core I (GROUND-030)", () => {
  describe("Migration", () => {
    it("migrates 0.1.18 → 0.1.20 with empty Commitment array", () => {
      const migrated = migrateProjectState(validProjectStateV0118);
      assert.equal(migrated.schema_version, "0.1.24");
      assert.deepEqual(migrated.intervention_commitment_declarations, []);
      assert.deepEqual(
        migrated.intervention_commitment_acceptance_declarations,
        []
      );
    });

    it("does not backfill Commitment from Decision / Intent / Mandate", () => {
      const migrated = migrateProjectState(validProjectStateV0118);
      assert.equal(migrated.intervention_commitment_declarations.length, 0);
    });

    it("SCHEMA_VERSION is 0.1.20", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
    });
  });

  describe("Persistence", () => {
    it("persists Commitment with empty basis", () => {
      const next = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      const stored = next.intervention_commitment_declarations[0]!;
      assert.equal(stored.commitment_holder_entity_id, ENTITY_HOLDER);
      assert.equal(stored.intervention_id, INT_A);
      assert.deepEqual(stored.basis, []);
      assert.equal(stored.committed_at, COMMITTED_AT);
    });

    it("Commitment without Decision/Intent is allowed", () => {
      const next = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      const basis = assessCommitmentBasis(next, COMMIT_ID);
      assert.equal(basis.has_decision_basis, false);
      assert.equal(basis.has_intent_basis, false);
    });
  });

  describe("Referential / temporal invariants", () => {
    it("rejects unknown holder", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            commitmentPatch(COMMIT_ID, {
              holder: "00000000-0000-4000-8000-000000000099",
            })
          ),
        /commitment_holder_entity_id/
      );
    });

    it("rejects unknown Intervention", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            commitmentPatch(COMMIT_ID, {
              interventionId: "00000000-0000-4000-8000-000000000099",
            })
          ),
        /intervention_id/
      );
    });

    it("rejects committed_at > recorded_at", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            commitmentPatch(COMMIT_ID, {
              committedAt: "2026-09-01T10:00:00.000Z",
              recordedAt: RECORDED,
            })
          ),
        /committed_at/
      );
    });

    it("rejects valid_until <= committed_at", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            commitmentPatch(COMMIT_ID, { validUntil: COMMITTED_AT })
          ),
        /valid_until/
      );
    });

    it("applies half-open [committed_at, valid_until)", () => {
      const next = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, {
          committedAt: COMMITTED_AT,
          validUntil: NOON,
        })
      );
      const decl = next.intervention_commitment_declarations[0]!;
      assert.equal(isInterventionCommitmentActiveAt(decl, COMMITTED_AT), true);
      assert.equal(
        isInterventionCommitmentActiveAt(decl, "2026-08-01T11:00:00.000Z"),
        true
      );
      assert.equal(isInterventionCommitmentActiveAt(decl, NOON), false);
    });
  });

  describe("No automatic creation", () => {
    it("PURSUE Intent does not auto-create Commitment", () => {
      const withIntent = applyIntent(baseState());
      const assessment = assessDeclaredInterventionCommitment(
        withIntent,
        ENTITY_HOLDER,
        INT_A,
        COMMITTED_AT
      );
      assert.equal(assessment.status, "NO_COMMITMENT_DECLARATIONS");
      assert.equal(withIntent.intervention_commitment_declarations.length, 0);
    });

    it("selected Actor + PURSUE does not auto-create Commitment", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const withIntent = applyIntent(withDecision, {
        decisionBasisId: DECISION_ID,
      });
      assert.equal(
        assessDeclaredInterventionIntent(
          withIntent,
          ENTITY_HOLDER,
          INT_A,
          FORMED
        ).status,
        "PURSUE_DECLARED"
      );
      assert.equal(
        assessDeclaredInterventionCommitment(
          withIntent,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        ).status,
        "NO_COMMITMENT_DECLARATIONS"
      );
    });

    it("Decision alone does not create Commitment", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      assert.equal(
        assessDeclaredInterventionCommitment(
          withDecision,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        ).status,
        "NO_COMMITMENT_DECLARATIONS"
      );
    });

    it("Mandate alone does not create Commitment", () => {
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
      const state = { ...baseState(), mandate_declarations: [mandate] };
      assert.equal(
        assessDeclaredInterventionCommitment(
          state,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        ).status,
        "NO_COMMITMENT_DECLARATIONS"
      );
    });

    it("PERMIT does not create Commitment", () => {
      const patch: StatePatch = {
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
      const permitted = applyPatch(baseState(), patch);
      assert.equal(
        assessDeclaredInterventionCommitment(
          permitted,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        ).status,
        "NO_COMMITMENT_DECLARATIONS"
      );
    });
  });

  describe("Intent basis", () => {
    it("accepts PURSUE Intent basis with same holder and Intervention", () => {
      const withIntent = applyIntent(baseState());
      const next = applyPatch(
        withIntent,
        commitmentPatch(COMMIT_ID, {
          basis: [{ kind: "INTERVENTION_INTENT", intent_declaration_id: INTENT_ID }],
        })
      );
      const basis = assessCommitmentBasis(next, COMMIT_ID);
      assert.equal(basis.has_intent_basis, true);
      assert.deepEqual(basis.intent_basis_ids, [INTENT_ID]);
      assert.equal(basis.all_intent_bases_are_pursue, true);
    });

    it("rejects REFRAIN Intent basis", () => {
      const withIntent = applyIntent(baseState(), { disposition: "REFRAIN" });
      assert.throws(
        () =>
          applyPatch(
            withIntent,
            commitmentPatch(COMMIT_ID, {
              basis: [
                { kind: "INTERVENTION_INTENT", intent_declaration_id: INTENT_ID },
              ],
            })
          ),
        /REFRAIN/
      );
    });

    it("rejects Intent basis with wrong holder", () => {
      const withIntent = applyIntent(baseState(), { holder: ENTITY_ACTOR_B });
      assert.throws(
        () =>
          applyPatch(
            withIntent,
            commitmentPatch(COMMIT_ID, {
              holder: ENTITY_HOLDER,
              basis: [
                { kind: "INTERVENTION_INTENT", intent_declaration_id: INTENT_ID },
              ],
            })
          ),
        /holder/
      );
    });

    it("rejects Intent basis with wrong Intervention", () => {
      const withIntent = applyIntent(baseState(), { interventionId: INT_B });
      assert.throws(
        () =>
          applyPatch(
            withIntent,
            commitmentPatch(COMMIT_ID, {
              interventionId: INT_A,
              basis: [
                { kind: "INTERVENTION_INTENT", intent_declaration_id: INTENT_ID },
              ],
            })
          ),
        /same Intervention/
      );
    });

    it("rejects Commitment that predates Intent basis", () => {
      const withIntent = applyIntent(baseState(), {
        formedAt: "2026-08-10T10:00:00.000Z",
      });
      assert.throws(
        () =>
          applyPatch(
            withIntent,
            commitmentPatch(COMMIT_ID, {
              committedAt: COMMITTED_AT,
              basis: [
                { kind: "INTERVENTION_INTENT", intent_declaration_id: INTENT_ID },
              ],
            })
          ),
        /predate|intent_formed_at/
      );
    });
  });

  describe("Decision basis", () => {
    it("accepts Decision basis selecting the same Intervention", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const next = applyPatch(
        withDecision,
        commitmentPatch(COMMIT_ID, {
          basis: [
            { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
          ],
        })
      );
      const basis = assessCommitmentBasis(next, COMMIT_ID);
      assert.equal(basis.has_decision_basis, true);
      assert.deepEqual(basis.decision_actor_relations, [
        "COMMITMENT_HOLDER_IS_SELECTED_ACTOR",
      ]);
      assert.equal(basis.holder_was_candidate_in_decision_snapshot, true);
    });

    it("rejects DO_NOTHING Decision basis", () => {
      const withDecision = applyDecision(baseState(), {
        option: { kind: "DO_NOTHING" },
      });
      assert.throws(
        () =>
          applyPatch(
            withDecision,
            commitmentPatch(COMMIT_ID, {
              basis: [
                { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
              ],
            })
          ),
        /DO_NOTHING/
      );
    });

    it("rejects Decision basis for a different Intervention", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      assert.throws(
        () =>
          applyPatch(
            withDecision,
            commitmentPatch(COMMIT_ID, {
              interventionId: INT_B,
              basis: [
                { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
              ],
            })
          ),
        /same Intervention/
      );
    });

    it("rejects Commitment that predates Decision basis", () => {
      const withDecision = applyDecision(baseState(), {
        decidedAt: DECIDED_AT,
      });
      assert.throws(
        () =>
          applyPatch(
            withDecision,
            commitmentPatch(COMMIT_ID, {
              committedAt: "2026-07-15T10:00:00.000Z",
              basis: [
                { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
              ],
            })
          ),
        /predate|decided_at/
      );
    });

    it("allows holder different from selected Actor", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const next = applyPatch(
        withDecision,
        commitmentPatch(COMMIT_ID, {
          holder: ENTITY_ACTOR_B,
          basis: [
            { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
          ],
        })
      );
      const basis = assessCommitmentBasis(next, COMMIT_ID);
      assert.equal(
        basis.decision_actor_relations[0],
        "COMMITMENT_HOLDER_DIFFERS_FROM_SELECTED_ACTOR"
      );
      assert.equal(basis.holder_was_candidate_in_decision_snapshot, false);
    });

    it("exposes DECISION_HAS_NO_SELECTED_ACTOR", () => {
      const withDecision = applyDecision(baseState(), { selectedActor: null });
      const next = applyPatch(
        withDecision,
        commitmentPatch(COMMIT_ID, {
          basis: [
            { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
          ],
        })
      );
      const basis = assessCommitmentBasis(next, COMMIT_ID);
      assert.equal(
        basis.decision_actor_relations[0],
        "DECISION_HAS_NO_SELECTED_ACTOR"
      );
    });

    it("uses frozen Decision snapshot for candidate relation", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const next = applyPatch(
        withDecision,
        commitmentPatch(COMMIT_ID, {
          basis: [
            { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
          ],
        })
      );
      const mutated = structuredClone(next);
      mutated.decision_option_actor_candidate_declarations = [];
      const basis = assessCommitmentBasis(mutated, COMMIT_ID);
      assert.equal(basis.holder_was_candidate_in_decision_snapshot, true);
    });

    it("rejects duplicate basis refs", () => {
      const withDecision = applyDecision(baseState());
      assert.throws(
        () =>
          applyPatch(
            withDecision,
            commitmentPatch(COMMIT_ID, {
              basis: [
                {
                  kind: "REALITY_DECISION",
                  decision_declaration_id: DECISION_ID,
                },
                {
                  kind: "REALITY_DECISION",
                  decision_declaration_id: DECISION_ID,
                },
              ],
            })
          ),
        /duplicate basis/
      );
    });
  });

  describe("Source relation", () => {
    it("exposes SELF_DECLARED_BY_HOLDER without accepted flag", () => {
      const next = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      const relation = assessCommitmentSourceRelation(
        next.intervention_commitment_declarations[0]!
      );
      assert.equal(relation.source_relation, "SELF_DECLARED_BY_HOLDER");
      const ctx = assessInterventionCommitmentContext(next, COMMIT_ID);
      assert.ok(!("accepted" in ctx));
      assert.ok(!("accepted_by" in ctx));
    });

    it("exposes DECLARED_BY_OTHER_ENTITY", () => {
      const next = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, {
          declaredBy: { kind: "organization", entity_id: ENTITY_DECLARER },
        })
      );
      assert.equal(
        assessCommitmentSourceRelation(
          next.intervention_commitment_declarations[0]!
        ).source_relation,
        "DECLARED_BY_OTHER_ENTITY"
      );
    });

    it("exposes DECLARED_BY_NON_ENTITY_SOURCE", () => {
      const next = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, { declaredBy: { kind: "document" } })
      );
      assert.equal(
        assessCommitmentSourceRelation(
          next.intervention_commitment_declarations[0]!
        ).source_relation,
        "DECLARED_BY_NON_ENTITY_SOURCE"
      );
    });
  });

  describe("Positions / multi-source / no conflict", () => {
    it("rejects same-source semantic duplicate even if note/basis differ", () => {
      const first = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      assert.throws(
        () =>
          applyPatch(
            first,
            commitmentPatch(COMMIT_ID_2, { note: "corrected note" })
          ),
        /semantic duplicate/
      );
    });

    it("preserves different sources for the same semantic Commitment as one position", () => {
      const first = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        })
      );
      const next = applyPatch(
        first,
        commitmentPatch(COMMIT_ID_2, {
          declaredBy: { kind: "organization", entity_id: ENTITY_MAKER },
        })
      );
      const assessment = assessDeclaredInterventionCommitment(
        next,
        ENTITY_HOLDER,
        INT_A,
        COMMITTED_AT
      );
      assert.equal(assessment.status, "COMMITMENT_DECLARED");
      assert.equal(assessment.has_multiple_declarations, true);
      assert.equal(assessment.commitment_positions.length, 1);
      assert.equal(
        assessment.commitment_positions[0]?.has_multiple_declarations,
        true
      );
      assert.ok(!("CONTESTED_COMMITMENT" in assessment));
    });

    it("same holder/intervention different committed_at are separate positions", () => {
      const first = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      const next = applyPatch(
        first,
        commitmentPatch(COMMIT_ID_2, {
          committedAt: NOON,
          declaredBy: { kind: "human", label: "later" },
        })
      );
      const history = getInterventionCommitmentHistory(
        next,
        ENTITY_HOLDER,
        INT_A
      );
      assert.equal(history.positions.length, 2);
      assert.equal(history.positions[0]?.committed_at, COMMITTED_AT);
      assert.equal(history.positions[1]?.committed_at, NOON);
      assert.ok(!("superseded" in history.positions[0]!));
    });

    it("NO_COMMITMENT_DECLARATIONS is absence, not refusal", () => {
      const assessment = assessDeclaredInterventionCommitment(
        baseState(),
        ENTITY_HOLDER,
        INT_A,
        COMMITTED_AT
      );
      assert.equal(assessment.status, "NO_COMMITMENT_DECLARATIONS");
    });

    it("semantic key is holder|intervention|committedAt", () => {
      assert.equal(
        interventionCommitmentSemanticKey(ENTITY_HOLDER, INT_A, COMMITTED_AT),
        `commitment|${ENTITY_HOLDER}|${INT_A}|${COMMITTED_AT}`
      );
    });
  });

  describe("Cross-layer coexistence", () => {
    it("Commitment does not create Intent", () => {
      const next = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      assert.equal(
        assessDeclaredInterventionIntent(
          next,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        ).status,
        "NO_INTENT_DECLARATIONS"
      );
    });

    it("Commitment + current REFRAIN both remain without breach", () => {
      const withIntent = applyIntent(baseState(), { disposition: "REFRAIN" });
      const next = applyPatch(withIntent, commitmentPatch(COMMIT_ID));
      assert.equal(
        assessDeclaredInterventionIntent(
          next,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        ).status,
        "REFRAIN_DECLARED"
      );
      assert.equal(
        assessDeclaredInterventionCommitment(
          next,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        ).status,
        "COMMITMENT_DECLARED"
      );
    });

    it("Commitment under PROHIBIT is allowed without Permission mutation", () => {
      const prohibit: StatePatch = {
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
      const prohibited = applyPatch(baseState(), prohibit);
      const permsBefore = structuredClone(
        prohibited.intervention_permission_declarations
      );
      const next = applyPatch(prohibited, commitmentPatch(COMMIT_ID));
      assert.deepEqual(next.intervention_permission_declarations, permsBefore);
      assert.equal(next.intervention_commitment_declarations.length, 1);
    });
  });

  describe("Append-only / deletion", () => {
    it("rejects semantic update of existing Commitment", () => {
      const first = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      assert.throws(
        () =>
          applyPatch(
            first,
            commitmentPatch(COMMIT_ID, { note: "rewritten" })
          ),
        /append-only/
      );
    });

    it("rejects delete of Commitment", () => {
      const first = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      const patch: StatePatch = {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "delete",
            entity: "intervention_commitment_declaration",
            entity_id: COMMIT_ID,
          },
        ],
      };
      assert.throws(() => applyPatch(first, patch), /append-only/);
    });

    it("rejects deleting Intervention referenced by Commitment", () => {
      const first = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, { interventionId: INT_B })
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
        /intervention_commitment_declaration/
      );
    });

    it("rejects deleting holder Entity referenced by Commitment", () => {
      const first = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, { holder: ENTITY_ACTOR_B })
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
        /commitment_holder_entity_id/
      );
    });
  });

  describe("Firewalls", () => {
    it("Commitment does not mutate Decision / Intent / other collections", () => {
      const withDecision = applyDecision(baseState(), {
        selectedActor: ENTITY_HOLDER,
      });
      const withIntent = applyIntent(withDecision, {
        decisionBasisId: DECISION_ID,
      });
      const before = structuredClone(withIntent);
      const next = applyPatch(
        withIntent,
        commitmentPatch(COMMIT_ID, {
          basis: [
            { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
            { kind: "INTERVENTION_INTENT", intent_declaration_id: INTENT_ID },
          ],
        })
      );
      assert.deepEqual(next.reality_entities, before.reality_entities);
      assert.deepEqual(next.reality_events, before.reality_events);
      assert.deepEqual(next.reality_states, before.reality_states);
      assert.deepEqual(next.claims, before.claims);
      assert.deepEqual(next.evidence, before.evidence);
      assert.deepEqual(next.blockers, before.blockers);
      assert.deepEqual(next.mandate_declarations, before.mandate_declarations);
      assert.deepEqual(next.authority_declarations, before.authority_declarations);
      assert.deepEqual(next.capability_declarations, before.capability_declarations);
      assert.deepEqual(next.resource_declarations, before.resource_declarations);
      assert.deepEqual(
        next.intervention_permission_declarations,
        before.intervention_permission_declarations
      );
      assert.deepEqual(
        next.reality_decision_declarations,
        before.reality_decision_declarations
      );
      assert.deepEqual(
        next.intervention_intent_declarations,
        before.intervention_intent_declarations
      );
      assert.deepEqual(next.decisions, before.decisions);
      assert.deepEqual(next.next_actions, before.next_actions);
    });
  });

  describe("Model limitations / contracts / read-only", () => {
    it("every Commitment context exposes all model limitations", () => {
      const next = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      const ctx = assessInterventionCommitmentContext(next, COMMIT_ID);
      assert.deepEqual(ctx.model_limitations, COMMITMENT_MODEL_LIMITATIONS);
      assert.deepEqual(ctx.model_limitations, [
        "COMMITMENT_ACCEPTANCE_NOT_MODELED",
        "COMMITMENT_AUTHORITY_NOT_MODELED",
        "COMMITMENT_COUNTERPARTY_NOT_MODELED",
        "RESOURCE_BINDING_NOT_MODELED",
        "DEADLINE_NOT_MODELED",
        "CONDITIONAL_COMMITMENT_NOT_MODELED",
        "EXECUTION_NOT_MODELED",
      ]);
    });

    it("assessment leaves ProjectState deepEqual", () => {
      const next = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      const before = structuredClone(next);
      assessDeclaredInterventionCommitment(
        next,
        ENTITY_HOLDER,
        INT_A,
        COMMITTED_AT
      );
      assessCommitmentBasis(next, COMMIT_ID);
      getInterventionCommitmentHistory(next, ENTITY_HOLDER, INT_A);
      groupInterventionCommitmentPositions(
        next,
        ENTITY_HOLDER,
        INT_A,
        COMMITTED_AT
      );
      assessInterventionCommitmentContext(next, COMMIT_ID);
      assert.deepEqual(next, before);
    });

    it("repeated assessments are deepEqual", () => {
      const next = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      assert.deepEqual(
        assessDeclaredInterventionCommitment(
          next,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        ),
        assessDeclaredInterventionCommitment(
          next,
          ENTITY_HOLDER,
          INT_A,
          COMMITTED_AT
        )
      );
      assert.deepEqual(
        assessCommitmentBasis(next, COMMIT_ID),
        assessCommitmentBasis(next, COMMIT_ID)
      );
      assert.deepEqual(
        getInterventionCommitmentHistory(next, ENTITY_HOLDER, INT_A),
        getInterventionCommitmentHistory(next, ENTITY_HOLDER, INT_A)
      );
    });

    it("history has no current/latest winner fields", () => {
      const next = applyPatch(baseState(), commitmentPatch(COMMIT_ID));
      const history = getInterventionCommitmentHistory(
        next,
        ENTITY_HOLDER,
        INT_A
      );
      assert.equal(history.has_declarations, true);
      assert.ok(!("current_commitment" in history));
      assert.ok(!("latest_commitment" in history));
    });

    it("APIs expose no current/effective/accepted Commitment", async () => {
      const core = await import("../reality/commitment-core.js");
      assert.equal("getCurrentCommitment" in core, false);
      assert.equal("latestEffectiveCommitment" in core, false);
      assert.equal("bindingCommitment" in core, false);
    });

    it("source files do not contain forbidden schedule/acceptance/counterparty vocabulary", () => {
      const files = [
        join(__dirnameTest, "../reality/commitment-core.ts"),
        join(__dirnameTest, "../reality/commitment-types.ts"),
      ];
      for (const file of files) {
        const src = readFileSync(file, "utf8");
        assert.equal(FORBIDDEN_API.test(src), false, file);
      }
    });

    it("commitment-core does not import state-engine / file-store / studio", () => {
      const src = readFileSync(
        join(__dirnameTest, "../reality/commitment-core.ts"),
        "utf8"
      );
      assert.equal(/from ["'][^"']*state-engine/.test(src), false);
      assert.equal(/from ["'][^"']*file-store/.test(src), false);
      assert.equal(/from ["'][^"']*studio\//.test(src), false);
    });

    it("AuthorityPower is unchanged and has no commitment power", async () => {
      const typesSrc = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );
      assert.equal(typesSrc.includes("COMMIT_INTERVENTION"), false);
      assert.equal(typesSrc.includes("BIND_ACTOR"), false);
      assert.equal(typesSrc.includes("ACCEPT_COMMITMENT"), false);
    });
  });
});
