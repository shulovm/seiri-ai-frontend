/**
 * GROUND-031 — Commitment Core II / Holder Acceptance Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { migrateProjectState } from "../migrate.js";
import { buildDecisionContextSnapshot } from "../reality/decision-memory-core.js";
import {
  assessCommitmentAcceptanceContext,
  assessCommitmentAcceptanceSourceRelation,
  assessDeclaredCommitmentAcceptance,
  COMMITMENT_ACCEPTANCE_MODEL_LIMITATIONS,
  getCommitmentAcceptanceHistory,
  groupCommitmentAcceptancePositions,
} from "../reality/commitment-acceptance-core.js";
import { assessDeclaredInterventionCommitment } from "../reality/commitment-core.js";
import { applyPatch } from "../state-engine.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  CommitmentBasisReference,
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionCommitmentAcceptanceDeclaration,
  InterventionCommitmentDeclaration,
  InterventionDeclaration,
  ProjectState,
  RealityEntity,
  StatePatch,
} from "../types.js";
import {
  PROJECT_ID,
  validProjectStateV0119,
  validProjectStateV0124,
} from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_HOLDER = "fa010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR_B = "fa010101-0101-4101-8101-010101010102";
const ENTITY_DECLARER = "fa010101-0101-4101-8101-010101010103";
const ENTITY_MAKER = "fa010101-0101-4101-8101-010101010104";
const INT_A = "fa020202-0202-4202-8202-020202020201";
const SPACE_D = "fa030303-0303-4303-8303-030303030301";
const OPT_INT = "fa040404-0404-4404-8404-040404040401";
const OPT_DN = "fa040404-0404-4404-8404-040404040402";
const CAND_A = "fa050505-0505-4505-8505-050505050501";
const DECISION_ID = "fa060606-0606-4606-8606-060606060601";
const INTENT_ID = "fa070707-0707-4707-8707-070707070701";
const COMMIT_ID = "fa080808-0808-4808-8808-080808080801";
const COMMIT_ID_2 = "fa080808-0808-4808-8808-080808080802";
const ACCEPT_ID = "fa090909-0909-4909-8909-090909090901";
const ACCEPT_ID_2 = "fa090909-0909-4909-8909-090909090902";
const PERM_ID = "fa0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const ACCEPTED_AT = "2026-08-01T12:00:00.000Z";
const ACCEPTED_AT_2 = "2026-08-02T12:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";
const DECIDED_AT = "2026-08-01T10:00:00.000Z";
const FORMED = "2026-08-01T10:00:00.000Z";

const FORBIDDEN_API =
  /\b(binding_commitment|effective_commitment|legal_obligation|CONTESTED_ACCEPTANCE|WITHDRAW_ACCEPTANCE|REJECT|DECLINE|DENY|accepted_executor|can_execute|feasible|ready|deadline|due_at|must_complete_by|ACCEPT_COMMITMENT|BIND_SELF|BIND_ENTITY)\b/;

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
    intervention_declarations: [intervention(INT_A)],
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
    recordedAt?: string;
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
    valid_until: null,
    note: null,
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

function acceptancePayload(
  id: string,
  opts: {
    commitmentId?: string;
    acceptedAt?: string;
    recordedAt?: string;
    note?: string | null;
    declaredBy?: InterventionCommitmentAcceptanceDeclaration["declared_by"];
  } = {}
): InterventionCommitmentAcceptanceDeclaration {
  const acceptedAt = opts.acceptedAt ?? ACCEPTED_AT;
  const recordedAt = opts.recordedAt ?? RECORDED;
  return {
    id,
    project_id: PROJECT_ID,
    commitment_declaration_id: opts.commitmentId ?? COMMIT_ID,
    accepted_at: acceptedAt,
    note: opts.note === undefined ? null : opts.note,
    declared_by: opts.declaredBy ?? {
      kind: "human",
      entity_id: ENTITY_HOLDER,
    },
    recorded_at: recordedAt,
    created_at: recordedAt,
    updated_at: recordedAt,
  };
}

function acceptancePatch(
  id: string,
  opts: Parameters<typeof acceptancePayload>[1] = {}
): StatePatch {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_commitment_acceptance_declaration",
        entity_id: id,
        payload: acceptancePayload(id, opts),
      },
    ],
  };
}

function applyDecision(
  state: ProjectState,
  opts: { selectedActor?: string | null; decidedAt?: string } = {}
): ProjectState {
  const decidedAt = opts.decidedAt ?? DECIDED_AT;
  const selectedActor =
    opts.selectedActor === undefined ? ENTITY_HOLDER : opts.selectedActor;
  const snapshot = buildDecisionContextSnapshot(
    state,
    SPACE_D,
    decidedAt,
    RECORDED
  );
  const patch: StatePatch = {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "reality_decision_declaration",
        entity_id: DECISION_ID,
        payload: {
          id: DECISION_ID,
          project_id: PROJECT_ID,
          decision_space_id: SPACE_D,
          decision_maker_entity_id: ENTITY_MAKER,
          selected_option: {
            kind: "INTERVENTION",
            intervention_id: INT_A,
          },
          selected_actor_entity_id: selectedActor,
          decided_at: decidedAt,
          rationale: null,
          context_snapshot: snapshot,
          declared_by: { kind: "human", entity_id: ENTITY_MAKER },
          recorded_at: RECORDED,
          created_at: RECORDED,
          updated_at: RECORDED,
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
    disposition?: "PURSUE" | "REFRAIN";
    decisionBasisId?: string | null;
  } = {}
): ProjectState {
  const patch: StatePatch = {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_intent_declaration",
        entity_id: INTENT_ID,
        payload: {
          id: INTENT_ID,
          project_id: PROJECT_ID,
          intent_holder_entity_id: opts.holder ?? ENTITY_HOLDER,
          intervention_id: INT_A,
          disposition: opts.disposition ?? "PURSUE",
          decision_basis_declaration_id:
            opts.decisionBasisId === undefined
              ? DECISION_ID
              : opts.decisionBasisId,
          intent_formed_at: FORMED,
          valid_until: null,
          note: null,
          declared_by: { kind: "human", entity_id: ENTITY_HOLDER },
          recorded_at: RECORDED,
          created_at: RECORDED,
          updated_at: RECORDED,
        },
      },
    ],
  };
  return applyPatch(state, patch);
}

function withCommitment(
  opts: Parameters<typeof commitmentPayload>[1] = {}
): ProjectState {
  return applyPatch(baseState(), commitmentPatch(COMMIT_ID, opts));
}

function snapshotFirewallCollections(state: ProjectState) {
  return {
    reality_states: structuredClone(state.reality_states),
    reality_events: structuredClone(state.reality_events),
    claims: structuredClone(state.claims),
    evidence: structuredClone(state.evidence),
    authority_declarations: structuredClone(state.authority_declarations),
    standing_declarations: structuredClone(state.standing_declarations),
    mandate_declarations: structuredClone(state.mandate_declarations),
    capability_declarations: structuredClone(state.capability_declarations),
    resource_declarations: structuredClone(state.resource_declarations),
    intervention_permission_declarations: structuredClone(
      state.intervention_permission_declarations
    ),
    reality_decision_declarations: structuredClone(
      state.reality_decision_declarations
    ),
    intervention_intent_declarations: structuredClone(
      state.intervention_intent_declarations
    ),
    intervention_commitment_declarations: structuredClone(
      state.intervention_commitment_declarations
    ),
    decisions: structuredClone(state.decisions),
    next_actions: structuredClone(state.next_actions),
    current_state: structuredClone(state.current_state),
  };
}

describe("Commitment Acceptance (GROUND-031)", () => {
  describe("Migration", () => {
    it("migrates 0.1.19 → 0.1.20 with empty Acceptance array", () => {
      const migrated = migrateProjectState(validProjectStateV0119);
      assert.equal(migrated.schema_version, "0.1.25");
      assert.deepEqual(
        migrated.intervention_commitment_acceptance_declarations,
        []
      );
    });

    it("does not backfill Acceptance from Commitment / Intent / Decision", () => {
      const migrated = migrateProjectState(validProjectStateV0119);
      assert.equal(
        migrated.intervention_commitment_acceptance_declarations.length,
        0
      );
    });

    it("SCHEMA_VERSION is 0.1.20", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
    });
  });

  describe("Persistence", () => {
    it("persists Acceptance targeting Commitment", () => {
      const next = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID)
      );
      const stored = next.intervention_commitment_acceptance_declarations[0]!;
      assert.equal(stored.commitment_declaration_id, COMMIT_ID);
      assert.equal(stored.accepted_at, ACCEPTED_AT);
      assert.equal(stored.declared_by.entity_id, ENTITY_HOLDER);
    });
  });

  describe("Referential / temporal invariants", () => {
    it("rejects unknown Commitment", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            acceptancePatch(ACCEPT_ID, {
              commitmentId: "00000000-0000-4000-8000-000000000099",
            })
          ),
        /commitment_declaration_id/
      );
    });

    it("rejects accepted_at before committed_at", () => {
      assert.throws(
        () =>
          applyPatch(
            withCommitment(),
            acceptancePatch(ACCEPT_ID, {
              acceptedAt: "2026-07-01T10:00:00.000Z",
            })
          ),
        /accepted_at/
      );
    });

    it("rejects accepted_at after recorded_at", () => {
      assert.throws(
        () =>
          applyPatch(
            withCommitment(),
            acceptancePatch(ACCEPT_ID, {
              acceptedAt: "2026-09-01T10:00:00.000Z",
              recordedAt: RECORDED,
            })
          ),
        /accepted_at/
      );
    });

    it("rejects unknown declarer Entity", () => {
      assert.throws(
        () =>
          applyPatch(
            withCommitment(),
            acceptancePatch(ACCEPT_ID, {
              declaredBy: {
                kind: "human",
                entity_id: "00000000-0000-4000-8000-000000000099",
              },
            })
          ),
        /declared_by/
      );
    });
  });

  describe("Positive-only / no auto-Acceptance", () => {
    it("Commitment without Acceptance → NO_ACCEPTANCE_DECLARATIONS", () => {
      const state = withCommitment();
      const assessment = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      assert.equal(assessment.status, "NO_ACCEPTANCE_DECLARATIONS");
      assert.deepEqual(assessment.acceptance_declaration_ids, []);
    });

    it("self-declared Commitment does NOT auto-Accept", () => {
      const state = withCommitment({
        declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
      });
      const assessment = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      assert.equal(assessment.status, "NO_ACCEPTANCE_DECLARATIONS");
    });

    it("Decision + Intent PURSUE + Commitment does NOT auto-Accept", () => {
      let state = applyDecision(baseState(), { selectedActor: ENTITY_HOLDER });
      state = applyIntent(state, {
        holder: ENTITY_HOLDER,
        disposition: "PURSUE",
        decisionBasisId: DECISION_ID,
      });
      state = applyPatch(
        state,
        commitmentPatch(COMMIT_ID, {
          holder: ENTITY_HOLDER,
          basis: [
            { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
            { kind: "INTERVENTION_INTENT", intent_declaration_id: INTENT_ID },
          ],
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      const assessment = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      assert.equal(assessment.status, "NO_ACCEPTANCE_DECLARATIONS");
    });
  });

  describe("Source relation", () => {
    it("self-declared Acceptance by holder", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      const commitment = state.intervention_commitment_declarations[0]!;
      const acceptance =
        state.intervention_commitment_acceptance_declarations[0]!;
      const relation = assessCommitmentAcceptanceSourceRelation(
        acceptance,
        commitment
      );
      assert.equal(
        relation.source_relation,
        "SELF_DECLARED_BY_COMMITMENT_HOLDER"
      );
      const assessment = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      assert.equal(assessment.status, "ACCEPTANCE_DECLARED");
      assert.equal(assessment.has_self_declared_acceptance, true);
    });

    it("third-party Acceptance declaration", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const assessment = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      assert.equal(assessment.has_other_entity_declared_acceptance, true);
      assert.deepEqual(assessment.source_relations, [
        "DECLARED_BY_OTHER_ENTITY",
      ]);
    });

    it("non-Entity source", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID, {
          declaredBy: { kind: "system", label: "import" },
        })
      );
      const assessment = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      assert.equal(assessment.has_non_entity_declared_acceptance, true);
      assert.deepEqual(assessment.source_relations, [
        "DECLARED_BY_NON_ENTITY_SOURCE",
      ]);
    });

    it("source relation has no validity ranking fields", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID)
      );
      const assessment = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      const json = JSON.stringify(assessment);
      assert.equal(json.includes("self_reported_stronger"), false);
      assert.equal(json.includes("stronger"), false);
      assert.equal(json.includes("validity"), false);
    });
  });

  describe("Semantic Commitment normalization", () => {
    it("groups Acceptance across equivalent Commitment declarations", () => {
      let state = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        })
      );
      state = applyPatch(
        state,
        commitmentPatch(COMMIT_ID_2, {
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      state = applyPatch(
        state,
        acceptancePatch(ACCEPT_ID, {
          commitmentId: COMMIT_ID,
          acceptedAt: ACCEPTED_AT,
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      state = applyPatch(
        state,
        acceptancePatch(ACCEPT_ID_2, {
          commitmentId: COMMIT_ID_2,
          acceptedAt: ACCEPTED_AT,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );

      const positions = groupCommitmentAcceptancePositions(state, COMMIT_ID);
      assert.equal(positions.length, 1);
      assert.deepEqual(
        [...positions[0]!.acceptance_declaration_ids].sort(),
        [ACCEPT_ID, ACCEPT_ID_2].sort()
      );
      assert.deepEqual(
        [...positions[0]!.targeted_commitment_declaration_ids].sort(),
        [COMMIT_ID, COMMIT_ID_2].sort()
      );
    });

    it("rejects same-source semantic duplicate across equivalent Commitment targets", () => {
      let state = applyPatch(
        baseState(),
        commitmentPatch(COMMIT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        })
      );
      state = applyPatch(
        state,
        commitmentPatch(COMMIT_ID_2, {
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      state = applyPatch(
        state,
        acceptancePatch(ACCEPT_ID, {
          commitmentId: COMMIT_ID,
          acceptedAt: ACCEPTED_AT,
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      assert.throws(
        () =>
          applyPatch(
            state,
            acceptancePatch(ACCEPT_ID_2, {
              commitmentId: COMMIT_ID_2,
              acceptedAt: ACCEPTED_AT,
              declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
            })
          ),
        /semantic duplicate/
      );
    });

    it("preserves different sources same semantic Acceptance without voting", () => {
      let state = applyPatch(
        withCommitment({
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        }),
        acceptancePatch(ACCEPT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      state = applyPatch(
        state,
        acceptancePatch(ACCEPT_ID_2, {
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const positions = groupCommitmentAcceptancePositions(state, COMMIT_ID);
      assert.equal(positions.length, 1);
      assert.equal(positions[0]!.has_multiple_declarations, true);
      const json = JSON.stringify(positions[0]);
      assert.equal(json.includes("vote"), false);
      assert.equal(json.includes("winner"), false);
    });

    it("preserves different accepted_at as separate Positions", () => {
      let state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID, {
          acceptedAt: ACCEPTED_AT,
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      state = applyPatch(
        state,
        acceptancePatch(ACCEPT_ID_2, {
          acceptedAt: ACCEPTED_AT_2,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const history = getCommitmentAcceptanceHistory(state, COMMIT_ID);
      assert.equal(history.positions.length, 2);
      assert.equal(history.positions[0]!.accepted_at, ACCEPTED_AT);
      assert.equal(history.positions[1]!.accepted_at, ACCEPTED_AT_2);
      const json = JSON.stringify(history);
      assert.equal(json.includes("latest"), false);
      assert.equal(json.includes("current_acceptance"), false);
      assert.equal(json.includes("effective"), false);
    });
  });

  describe("Contracts / forbidden semantics", () => {
    it("contracts contain no CONTESTED_ACCEPTANCE / rejection / withdrawal", () => {
      const typesPath = join(__dirnameTest, "../reality/commitment-acceptance-types.ts");
      const corePath = join(__dirnameTest, "../reality/commitment-acceptance-core.ts");
      const typesSrc = readFileSync(typesPath, "utf8");
      const coreSrc = readFileSync(corePath, "utf8");
      for (const token of [
        "CONTESTED_ACCEPTANCE",
        "WITHDRAW_ACCEPTANCE",
        "REJECT",
        "DECLINE",
        "DENY",
        "binding_commitment",
        "effective_commitment",
        "deadline",
        "due_at",
      ]) {
        assert.equal(typesSrc.includes(token), false, token);
        assert.equal(coreSrc.includes(token), false, token);
      }
    });

    it("Commitment + Acceptance is not binding / legal / executable", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID)
      );
      const context = assessCommitmentAcceptanceContext(state, COMMIT_ID);
      const json = JSON.stringify(context);
      assert.match(json, /ACCEPTANCE_DECLARED/);
      assert.equal(FORBIDDEN_API.test(json), false);
      assert.deepEqual(
        context.model_limitations,
        COMMITMENT_ACCEPTANCE_MODEL_LIMITATIONS
      );
    });
  });

  describe("Firewalls", () => {
    it("Acceptance does not create Authority / Permission / Capability / Resource / Execution", () => {
      const before = withCommitment();
      const beforeSnap = snapshotFirewallCollections(before);
      const after = applyPatch(before, acceptancePatch(ACCEPT_ID));
      const afterSnap = snapshotFirewallCollections(after);
      assert.deepEqual(afterSnap.reality_states, beforeSnap.reality_states);
      assert.deepEqual(afterSnap.reality_events, beforeSnap.reality_events);
      assert.deepEqual(afterSnap.claims, beforeSnap.claims);
      assert.deepEqual(afterSnap.evidence, beforeSnap.evidence);
      assert.deepEqual(
        afterSnap.authority_declarations,
        beforeSnap.authority_declarations
      );
      assert.deepEqual(
        afterSnap.capability_declarations,
        beforeSnap.capability_declarations
      );
      assert.deepEqual(
        afterSnap.resource_declarations,
        beforeSnap.resource_declarations
      );
      assert.deepEqual(
        afterSnap.intervention_permission_declarations,
        beforeSnap.intervention_permission_declarations
      );
      assert.deepEqual(
        afterSnap.intervention_commitment_declarations,
        beforeSnap.intervention_commitment_declarations
      );
      assert.deepEqual(afterSnap.decisions, beforeSnap.decisions);
      assert.deepEqual(afterSnap.next_actions, beforeSnap.next_actions);
      assert.equal(
        after.intervention_commitment_acceptance_declarations.length,
        1
      );
    });

    it("Acceptance under PROHIBIT is allowed; Permission unchanged", () => {
      let state = withCommitment();
      state = applyPatch(state, {
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
              note: null,
              declared_by: { kind: "human" },
              recorded_at: TS,
              created_at: TS,
              updated_at: TS,
            },
          },
        ],
      });
      const beforePerm = structuredClone(
        state.intervention_permission_declarations
      );
      const next = applyPatch(state, acceptancePatch(ACCEPT_ID));
      assert.equal(
        next.intervention_commitment_acceptance_declarations.length,
        1
      );
      assert.deepEqual(
        next.intervention_permission_declarations,
        beforePerm
      );
    });

    it("full Decision+Intent+Commitment+Acceptance chain still not execution", () => {
      let state = applyDecision(baseState(), { selectedActor: ENTITY_HOLDER });
      state = applyIntent(state, {
        holder: ENTITY_HOLDER,
        disposition: "PURSUE",
        decisionBasisId: DECISION_ID,
      });
      state = applyPatch(
        state,
        commitmentPatch(COMMIT_ID, {
          holder: ENTITY_HOLDER,
          basis: [
            { kind: "REALITY_DECISION", decision_declaration_id: DECISION_ID },
            { kind: "INTERVENTION_INTENT", intent_declaration_id: INTENT_ID },
          ],
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      const beforeCommit = structuredClone(
        state.intervention_commitment_declarations[0]
      );
      const beforeDecision = structuredClone(
        state.reality_decision_declarations[0]
      );
      const beforeIntent = structuredClone(
        state.intervention_intent_declarations[0]
      );
      const beforeSnap = snapshotFirewallCollections(state);
      state = applyPatch(
        state,
        acceptancePatch(ACCEPT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      const assessment = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      assert.equal(assessment.status, "ACCEPTANCE_DECLARED");
      assert.deepEqual(
        state.intervention_commitment_declarations[0],
        beforeCommit
      );
      assert.deepEqual(state.reality_decision_declarations[0], beforeDecision);
      assert.deepEqual(state.intervention_intent_declarations[0], beforeIntent);
      assert.deepEqual(
        snapshotFirewallCollections(state).reality_events,
        beforeSnap.reality_events
      );
      assert.deepEqual(
        snapshotFirewallCollections(state).resource_declarations,
        beforeSnap.resource_declarations
      );
      const context = assessCommitmentAcceptanceContext(state, COMMIT_ID);
      const json = JSON.stringify(context);
      assert.equal(json.includes("executor"), false);
      assert.equal(json.includes("InterventionExecution"), false);
      assert.equal(json.includes('"Action"'), false);
      assert.equal(FORBIDDEN_API.test(json), false);
      assert.equal(
        assessDeclaredInterventionCommitment(
          state,
          ENTITY_HOLDER,
          INT_A,
          ACCEPTED_AT
        ).status,
        "COMMITMENT_DECLARED"
      );
    });

    it("AuthorityPower enum unchanged (no ACCEPT_COMMITMENT / BIND_*)", () => {
      const typesSrc = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );
      const match = typesSrc.match(
        /export type AuthorityPower =[\s\S]*?;/
      );
      assert.ok(match);
      assert.equal(match[0]!.includes("ACCEPT_COMMITMENT"), false);
      assert.equal(match[0]!.includes("BIND_SELF"), false);
      assert.equal(match[0]!.includes("BIND_ENTITY"), false);
    });
  });

  describe("Append-only", () => {
    it("rejects Acceptance update", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID)
      );
      assert.throws(
        () =>
          applyPatch(
            state,
            acceptancePatch(ACCEPT_ID, {
              note: "changed",
            })
          ),
        /append-only/
      );
    });

    it("rejects Acceptance delete", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID)
      );
      assert.throws(
        () =>
          applyPatch(state, {
            schema_version: SCHEMA_VERSION,
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "delete",
                entity: "intervention_commitment_acceptance_declaration",
                entity_id: ACCEPT_ID,
              },
            ],
          }),
        /append-only/
      );
    });

    it("rejects deleting Acceptance declarer Entity", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_DECLARER },
        })
      );
      assert.throws(
        () =>
          applyPatch(state, {
            schema_version: SCHEMA_VERSION,
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "delete",
                entity: "reality_entity",
                entity_id: ENTITY_DECLARER,
              },
            ],
          }),
        /intervention_commitment_acceptance_declaration/
      );
    });
  });

  describe("Read-only / determinism", () => {
    it("assessment does not mutate ProjectState", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID)
      );
      const before = structuredClone(state);
      assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      assessCommitmentAcceptanceContext(state, COMMIT_ID);
      getCommitmentAcceptanceHistory(state, COMMIT_ID);
      assert.deepEqual(state, before);
    });

    it("repeated assessments are deterministic", () => {
      const state = applyPatch(
        withCommitment(),
        acceptancePatch(ACCEPT_ID)
      );
      const a1 = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      const a2 = assessDeclaredCommitmentAcceptance(state, COMMIT_ID);
      const c1 = assessCommitmentAcceptanceContext(state, COMMIT_ID);
      const c2 = assessCommitmentAcceptanceContext(state, COMMIT_ID);
      const h1 = getCommitmentAcceptanceHistory(state, COMMIT_ID);
      const h2 = getCommitmentAcceptanceHistory(state, COMMIT_ID);
      assert.deepEqual(a1, a2);
      assert.deepEqual(c1, c2);
      assert.deepEqual(h1, h2);
    });

    it("acceptance-core does not import state-engine / file-store / studio", () => {
      const src = readFileSync(
        join(__dirnameTest, "../reality/commitment-acceptance-core.ts"),
        "utf8"
      );
      assert.equal(/from ["'].*state-engine/.test(src), false);
      assert.equal(/from ["'].*file-store/.test(src), false);
      assert.equal(/from ["'].*studio\//.test(src), false);
      assert.equal(/import\(["'].*state-engine/.test(src), false);
    });
  });
});
