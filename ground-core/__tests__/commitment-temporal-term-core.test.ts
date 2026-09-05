/**
 * GROUND-032 — Commitment Core III / Temporal Terms & Deadline Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { migrateProjectState } from "../migrate.js";
import { assessDeclaredCommitmentAcceptance } from "../reality/commitment-acceptance-core.js";
import {
  assessCommitmentTemporalTermContext,
  assessCommitmentTemporalTermSourceRelation,
  assessDeclaredCommitmentTemporalTerms,
  COMMITMENT_TEMPORAL_TERM_MODEL_LIMITATIONS,
  detectCommitmentTemporalTermDivergences,
  getCommitmentTemporalTermHistory,
  groupCommitmentTemporalTermPositions,
} from "../reality/commitment-temporal-term-core.js";
import { applyPatch } from "../state-engine.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  CommitmentTemporalTermKind,
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionCommitmentDeclaration,
  InterventionCommitmentTemporalTermDeclaration,
  InterventionDeclaration,
  ProjectState,
  RealityEntity,
  StatePatch,
} from "../types.js";
import {
  PROJECT_ID,
  validProjectStateV0120,
  validProjectStateV0124,
} from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_HOLDER = "fb010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR_B = "fb010101-0101-4101-8101-010101010102";
const ENTITY_DECLARER = "fb010101-0101-4101-8101-010101010103";
const INT_A = "fb020202-0202-4202-8202-020202020201";
const SPACE_D = "fb030303-0303-4303-8303-030303030301";
const OPT_INT = "fb040404-0404-4404-8404-040404040401";
const CAND_A = "fb050505-0505-4505-8505-050505050501";
const COMMIT_ID = "fb080808-0808-4808-8808-080808080801";
const COMMIT_ID_2 = "fb080808-0808-4808-8808-080808080802";
const ACCEPT_ID = "fb090909-0909-4909-8909-090909090901";
const TERM_ID = "fb0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const TERM_ID_2 = "fb0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a02";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const VALID_UNTIL = "2026-10-01T10:00:00.000Z";
const DEADLINE = "2026-09-10T18:00:00.000Z";
const DEADLINE_2 = "2026-09-12T18:00:00.000Z";
const START_BY = "2026-08-15T09:00:00.000Z";
const ACCEPTED_AT = "2026-08-01T12:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";

const FORBIDDEN_API =
  /\b(effective_deadline|current_deadline|binding_deadline|accepted_deadline|accepted_temporal_term|earliest_wins|strictest_wins|latest_wins|overdue|breach|deadline_satisfied|deadline_missed|REMOVE_DEADLINE|NO_DEADLINE|CANCEL_DEADLINE)\b/;

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
  interventionId: string
): DecisionOptionDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    decision_space_id: spaceId,
    option: { kind: "INTERVENTION", intervention_id: interventionId },
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
    ],
    intervention_declarations: [intervention(INT_A)],
    decision_space_declarations: [decisionSpace(SPACE_D)],
    decision_option_declarations: [decisionOption(OPT_INT, SPACE_D, INT_A)],
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
    validUntil?: string | null;
    declaredBy?: InterventionCommitmentDeclaration["declared_by"];
  } = {}
): InterventionCommitmentDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    commitment_holder_entity_id: opts.holder ?? ENTITY_HOLDER,
    intervention_id: INT_A,
    basis: [],
    committed_at: COMMITTED_AT,
    valid_until: opts.validUntil === undefined ? null : opts.validUntil,
    note: null,
    declared_by: opts.declaredBy ?? { kind: "human" },
    recorded_at: RECORDED,
    created_at: RECORDED,
    updated_at: RECORDED,
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

function withCommitment(
  opts: Parameters<typeof commitmentPayload>[1] = {}
): ProjectState {
  return applyPatch(baseState(), commitmentPatch(COMMIT_ID, opts));
}

function acceptancePatch(id: string): StatePatch {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_commitment_acceptance_declaration",
        entity_id: id,
        payload: {
          id,
          project_id: PROJECT_ID,
          commitment_declaration_id: COMMIT_ID,
          accepted_at: ACCEPTED_AT,
          note: null,
          declared_by: { kind: "human", entity_id: ENTITY_HOLDER },
          recorded_at: RECORDED,
          created_at: RECORDED,
          updated_at: RECORDED,
        },
      },
    ],
  };
}

function termPayload(
  id: string,
  opts: {
    commitmentId?: string;
    kind?: CommitmentTemporalTermKind;
    deadlineAt?: string;
    recordedAt?: string;
    note?: string | null;
    declaredBy?: InterventionCommitmentTemporalTermDeclaration["declared_by"];
  } = {}
): InterventionCommitmentTemporalTermDeclaration {
  const recordedAt = opts.recordedAt ?? RECORDED;
  return {
    id,
    project_id: PROJECT_ID,
    commitment_declaration_id: opts.commitmentId ?? COMMIT_ID,
    term_kind: opts.kind ?? "COMPLETE_BY",
    deadline_at: opts.deadlineAt ?? DEADLINE,
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

function termPatch(
  id: string,
  opts: Parameters<typeof termPayload>[1] = {}
): StatePatch {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_commitment_temporal_term_declaration",
        entity_id: id,
        payload: termPayload(id, opts),
      },
    ],
  };
}

function snapshotFirewallCollections(state: ProjectState) {
  return {
    reality_states: structuredClone(state.reality_states),
    reality_events: structuredClone(state.reality_events),
    claims: structuredClone(state.claims),
    evidence: structuredClone(state.evidence),
    authority_declarations: structuredClone(state.authority_declarations),
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
    intervention_commitment_acceptance_declarations: structuredClone(
      state.intervention_commitment_acceptance_declarations
    ),
    decisions: structuredClone(state.decisions),
    next_actions: structuredClone(state.next_actions),
    current_state: structuredClone(state.current_state),
  };
}

describe("Commitment Temporal Terms (GROUND-032)", () => {
  describe("Migration", () => {
    it("migrates 0.1.20 → 0.1.21 with empty Temporal Term array", () => {
      const migrated = migrateProjectState(validProjectStateV0120);
      assert.equal(migrated.schema_version, "0.1.25");
      assert.deepEqual(
        migrated.intervention_commitment_temporal_term_declarations,
        []
      );
    });

    it("does not backfill Temporal Terms from valid_until / Acceptance", () => {
      const migrated = migrateProjectState(validProjectStateV0120);
      assert.equal(
        migrated.intervention_commitment_temporal_term_declarations.length,
        0
      );
    });

    it("SCHEMA_VERSION is 0.1.21", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
    });
  });

  describe("Persistence", () => {
    it("persists START_BY", () => {
      const next = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, { kind: "START_BY", deadlineAt: START_BY })
      );
      const stored = next.intervention_commitment_temporal_term_declarations[0]!;
      assert.equal(stored.term_kind, "START_BY");
      assert.equal(stored.deadline_at, START_BY);
      assert.equal(stored.commitment_declaration_id, COMMIT_ID);
    });

    it("persists COMPLETE_BY", () => {
      const next = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, { kind: "COMPLETE_BY", deadlineAt: DEADLINE })
      );
      const stored = next.intervention_commitment_temporal_term_declarations[0]!;
      assert.equal(stored.term_kind, "COMPLETE_BY");
      assert.equal(stored.deadline_at, DEADLINE);
    });
  });

  describe("Referential / temporal invariants", () => {
    it("rejects unknown Commitment", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            termPatch(TERM_ID, {
              commitmentId: "00000000-0000-4000-8000-000000000099",
            })
          ),
        /commitment_declaration_id/
      );
    });

    it("rejects unknown declarer Entity", () => {
      assert.throws(
        () =>
          applyPatch(
            withCommitment(),
            termPatch(TERM_ID, {
              declaredBy: {
                kind: "human",
                entity_id: "00000000-0000-4000-8000-000000000099",
              },
            })
          ),
        /declared_by/
      );
    });

    it("rejects invalid term kind", () => {
      assert.throws(
        () =>
          applyPatch(
            withCommitment(),
            termPatch(TERM_ID, {
              kind: "WINDOW" as CommitmentTemporalTermKind,
            })
          ),
        /term_kind/
      );
    });

    it("rejects deadline_at before committed_at", () => {
      assert.throws(
        () =>
          applyPatch(
            withCommitment(),
            termPatch(TERM_ID, { deadlineAt: "2026-07-01T10:00:00.000Z" })
          ),
        /deadline_at/
      );
    });

    it("allows deadline_at equal to committed_at", () => {
      const next = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, { deadlineAt: COMMITTED_AT })
      );
      assert.equal(
        next.intervention_commitment_temporal_term_declarations[0]?.deadline_at,
        COMMITTED_AT
      );
    });

    it("allows future deadline_at after recorded_at", () => {
      const next = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          deadlineAt: "2026-12-01T10:00:00.000Z",
          recordedAt: RECORDED,
        })
      );
      assert.equal(
        next.intervention_commitment_temporal_term_declarations[0]?.deadline_at,
        "2026-12-01T10:00:00.000Z"
      );
    });

    it("allows retrospective expired deadline without overdue", () => {
      const next = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          deadlineAt: "2026-08-05T10:00:00.000Z",
          recordedAt: RECORDED,
        })
      );
      const assessment = assessDeclaredCommitmentTemporalTerms(next, COMMIT_ID);
      const json = JSON.stringify(assessment);
      assert.equal(assessment.has_temporal_terms, true);
      assert.equal(json.includes("overdue"), false);
      assert.equal(json.includes("violat"), false);
      assert.equal(FORBIDDEN_API.test(json), false);
    });
  });

  describe("valid_until / auto-create firewalls", () => {
    it("Commitment.valid_until is not imported as Temporal Term", () => {
      const state = withCommitment({ validUntil: VALID_UNTIL });
      const assessment = assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      assert.equal(assessment.has_temporal_terms, false);
      assert.equal(
        state.intervention_commitment_declarations[0]?.valid_until,
        VALID_UNTIL
      );
    });

    it("Temporal Term does not modify Commitment.valid_until", () => {
      const before = withCommitment({ validUntil: VALID_UNTIL });
      const commitmentBefore = structuredClone(
        before.intervention_commitment_declarations[0]
      );
      const after = applyPatch(before, termPatch(TERM_ID));
      assert.deepEqual(
        after.intervention_commitment_declarations[0],
        commitmentBefore
      );
    });

    it("Commitment + Acceptance does not create Temporal Term", () => {
      const state = applyPatch(withCommitment(), acceptancePatch(ACCEPT_ID));
      const assessment = assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      assert.equal(assessment.has_temporal_terms, false);
      assert.equal(
        assessDeclaredCommitmentAcceptance(state, COMMIT_ID).status,
        "ACCEPTANCE_DECLARED"
      );
    });

    it("self-declared Commitment does not create Temporal Term", () => {
      const state = withCommitment({
        declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
      });
      assert.equal(
        assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID)
          .has_temporal_terms,
        false
      );
    });
  });

  describe("Source relation", () => {
    it("holder-declared Temporal Term", () => {
      const state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      const commitment = state.intervention_commitment_declarations[0]!;
      const term = state.intervention_commitment_temporal_term_declarations[0]!;
      assert.equal(
        assessCommitmentTemporalTermSourceRelation(term, commitment)
          .source_relation,
        "DECLARED_BY_COMMITMENT_HOLDER"
      );
      const json = JSON.stringify(
        assessCommitmentTemporalTermContext(state, COMMIT_ID)
      );
      assert.equal(json.includes("accepted_deadline"), false);
      assert.equal(json.includes("binding_deadline"), false);
    });

    it("third-party Temporal Term", () => {
      const state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const context = assessCommitmentTemporalTermContext(state, COMMIT_ID);
      assert.deepEqual(
        context.source_relations.map((entry) => entry.source_relation),
        ["DECLARED_BY_OTHER_ENTITY"]
      );
    });

    it("non-Entity source", () => {
      const state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          declaredBy: { kind: "system", label: "import" },
        })
      );
      const context = assessCommitmentTemporalTermContext(state, COMMIT_ID);
      assert.deepEqual(
        context.source_relations.map((entry) => entry.source_relation),
        ["DECLARED_BY_NON_ENTITY_SOURCE"]
      );
    });
  });

  describe("Acceptance / term firewall", () => {
    it("Acceptance does not imply term Acceptance", () => {
      let state = applyPatch(withCommitment(), acceptancePatch(ACCEPT_ID));
      state = applyPatch(state, termPatch(TERM_ID));
      const context = assessCommitmentTemporalTermContext(state, COMMIT_ID);
      const json = JSON.stringify(context);
      assert.equal(context.acceptance.status, "ACCEPTANCE_DECLARED");
      assert.equal(context.temporal_terms.has_temporal_terms, true);
      assert.equal(json.includes("accepted_temporal_term"), false);
      assert.equal(json.includes("accepted_deadline"), false);
    });

    it("term recorded before Acceptance still does not accept the term", () => {
      let state = applyPatch(withCommitment(), termPatch(TERM_ID));
      state = applyPatch(state, acceptancePatch(ACCEPT_ID));
      const context = assessCommitmentTemporalTermContext(state, COMMIT_ID);
      const json = JSON.stringify(context);
      assert.equal(context.acceptance.status, "ACCEPTANCE_DECLARED");
      assert.equal(json.includes("accepted_deadline"), false);
    });
  });

  describe("Semantic grouping / divergence", () => {
    it("groups same semantic term from multiple sources into one Position", () => {
      let state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      state = applyPatch(
        state,
        termPatch(TERM_ID_2, {
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const positions = groupCommitmentTemporalTermPositions(state, COMMIT_ID);
      assert.equal(positions.length, 1);
      assert.equal(positions[0]!.has_multiple_declarations, true);
      const json = JSON.stringify(positions[0]);
      assert.equal(json.includes("vote"), false);
      assert.equal(json.includes("winner"), false);
    });

    it("groups terms across equivalent Commitment declarations", () => {
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
        termPatch(TERM_ID, {
          commitmentId: COMMIT_ID,
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      state = applyPatch(
        state,
        termPatch(TERM_ID_2, {
          commitmentId: COMMIT_ID_2,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const positions = groupCommitmentTemporalTermPositions(state, COMMIT_ID);
      assert.equal(positions.length, 1);
      assert.deepEqual(
        [...positions[0]!.temporal_term_declaration_ids].sort(),
        [TERM_ID, TERM_ID_2].sort()
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
        termPatch(TERM_ID, {
          commitmentId: COMMIT_ID,
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      assert.throws(
        () =>
          applyPatch(
            state,
            termPatch(TERM_ID_2, {
              commitmentId: COMMIT_ID_2,
              declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
            })
          ),
        /semantic duplicate/
      );
    });

    it("different COMPLETE_BY deadlines form a Divergence with no winner", () => {
      let state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          kind: "COMPLETE_BY",
          deadlineAt: DEADLINE,
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      state = applyPatch(
        state,
        termPatch(TERM_ID_2, {
          kind: "COMPLETE_BY",
          deadlineAt: DEADLINE_2,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const divergences = detectCommitmentTemporalTermDivergences(
        state,
        COMMIT_ID
      );
      assert.equal(divergences.length, 1);
      assert.equal(divergences[0]!.term_kind, "COMPLETE_BY");
      assert.deepEqual(divergences[0]!.deadline_values, [DEADLINE, DEADLINE_2]);
      const json = JSON.stringify(divergences[0]);
      assert.equal(json.includes("earliest"), false);
      assert.equal(json.includes("latest"), false);
      assert.equal(json.includes("winner"), false);
    });

    it("different START_BY deadlines form a Divergence", () => {
      let state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          kind: "START_BY",
          deadlineAt: START_BY,
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      state = applyPatch(
        state,
        termPatch(TERM_ID_2, {
          kind: "START_BY",
          deadlineAt: DEADLINE,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const assessment = assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      assert.equal(assessment.has_start_by_divergence, true);
      assert.equal(assessment.has_complete_by_divergence, false);
    });

    it("START_BY + COMPLETE_BY is not a Divergence", () => {
      let state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          kind: "START_BY",
          deadlineAt: START_BY,
        })
      );
      state = applyPatch(
        state,
        termPatch(TERM_ID_2, {
          kind: "COMPLETE_BY",
          deadlineAt: DEADLINE,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const assessment = assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      assert.equal(assessment.has_start_by_terms, true);
      assert.equal(assessment.has_complete_by_terms, true);
      assert.equal(assessment.divergences.length, 0);
    });

    it("allows START_BY later than COMPLETE_BY without write rejection", () => {
      let state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          kind: "COMPLETE_BY",
          deadlineAt: START_BY,
        })
      );
      state = applyPatch(
        state,
        termPatch(TERM_ID_2, {
          kind: "START_BY",
          deadlineAt: DEADLINE,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const assessment = assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      assert.equal(assessment.positions.length, 2);
      assert.equal(assessment.divergences.length, 0);
    });
  });

  describe("Contracts / forbidden semantics", () => {
    it("contracts contain no effective/current/binding/satisfaction vocabulary", () => {
      const typesSrc = readFileSync(
        join(__dirnameTest, "../reality/commitment-temporal-term-types.ts"),
        "utf8"
      );
      const coreSrc = readFileSync(
        join(__dirnameTest, "../reality/commitment-temporal-term-core.ts"),
        "utf8"
      );
      for (const token of [
        "effective_deadline",
        "current_deadline",
        "binding_deadline",
        "accepted_deadline",
        "earliest_wins",
        "strictest_wins",
        "deadline_satisfied",
        "overdue",
        "breach",
        "REMOVE_DEADLINE",
        "NO_DEADLINE",
        "CANCEL_DEADLINE",
      ]) {
        assert.equal(typesSrc.includes(token), false, token);
        assert.equal(coreSrc.includes(token), false, token);
      }
    });

    it("contracts contain no condition/trigger vocabulary", () => {
      const typesSrc = readFileSync(
        join(__dirnameTest, "../reality/commitment-temporal-term-types.ts"),
        "utf8"
      );
      const coreSrc = readFileSync(
        join(__dirnameTest, "../reality/commitment-temporal-term-core.ts"),
        "utf8"
      );
      for (const token of ["condition", "trigger", "unless"]) {
        assert.equal(typesSrc.includes(token), false, token);
        assert.equal(coreSrc.includes(token), false, token);
      }
    });

    it("wall-clock past deadline does not produce overdue", () => {
      const state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          deadlineAt: "2026-08-05T10:00:00.000Z",
          recordedAt: RECORDED,
        })
      );
      const later = "2026-12-01T00:00:00.000Z";
      const assessment = assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      const json = JSON.stringify({ assessment, assessed_at: later });
      assert.equal(json.includes("OVERDUE"), false);
      assert.equal(json.includes("overdue"), false);
    });

    it("exposes model limitations without synthesizing conclusions", () => {
      const state = applyPatch(withCommitment(), termPatch(TERM_ID));
      const context = assessCommitmentTemporalTermContext(state, COMMIT_ID);
      assert.deepEqual(
        context.model_limitations,
        COMMITMENT_TEMPORAL_TERM_MODEL_LIMITATIONS
      );
      assert.equal(FORBIDDEN_API.test(JSON.stringify(context)), false);
    });
  });

  describe("Firewalls", () => {
    it("Temporal Term does not mutate adjacent cores or create execution", () => {
      const before = withCommitment();
      const beforeSnap = snapshotFirewallCollections(before);
      const after = applyPatch(before, termPatch(TERM_ID));
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
      assert.deepEqual(
        afterSnap.intervention_commitment_acceptance_declarations,
        beforeSnap.intervention_commitment_acceptance_declarations
      );
      assert.deepEqual(afterSnap.decisions, beforeSnap.decisions);
      assert.deepEqual(afterSnap.next_actions, beforeSnap.next_actions);
      assert.equal(
        after.intervention_commitment_temporal_term_declarations.length,
        1
      );
      const json = JSON.stringify(
        assessCommitmentTemporalTermContext(after, COMMIT_ID)
      );
      assert.equal(json.includes("feasible"), false);
      assert.equal(json.includes("can_execute"), false);
    });
  });

  describe("Append-only", () => {
    it("rejects Temporal Term update", () => {
      const state = applyPatch(withCommitment(), termPatch(TERM_ID));
      assert.throws(
        () => applyPatch(state, termPatch(TERM_ID, { note: "changed" })),
        /append-only/
      );
    });

    it("rejects Temporal Term delete", () => {
      const state = applyPatch(withCommitment(), termPatch(TERM_ID));
      assert.throws(
        () =>
          applyPatch(state, {
            schema_version: SCHEMA_VERSION,
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "delete",
                entity: "intervention_commitment_temporal_term_declaration",
                entity_id: TERM_ID,
              },
            ],
          }),
        /append-only/
      );
    });

    it("rejects deleting Temporal Term declarer Entity", () => {
      const state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
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
        /intervention_commitment_temporal_term_declaration/
      );
    });
  });

  describe("Read-only / determinism", () => {
    it("assessment does not mutate ProjectState", () => {
      const state = applyPatch(withCommitment(), termPatch(TERM_ID));
      const before = structuredClone(state);
      assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      detectCommitmentTemporalTermDivergences(state, COMMIT_ID);
      assessCommitmentTemporalTermContext(state, COMMIT_ID);
      getCommitmentTemporalTermHistory(state, COMMIT_ID);
      assert.deepEqual(state, before);
    });

    it("repeated assessments are deterministic", () => {
      let state = applyPatch(
        withCommitment(),
        termPatch(TERM_ID, {
          kind: "COMPLETE_BY",
          deadlineAt: DEADLINE,
          declaredBy: { kind: "human", entity_id: ENTITY_HOLDER },
        })
      );
      state = applyPatch(
        state,
        termPatch(TERM_ID_2, {
          kind: "COMPLETE_BY",
          deadlineAt: DEADLINE_2,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const a1 = assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      const a2 = assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID);
      const d1 = detectCommitmentTemporalTermDivergences(state, COMMIT_ID);
      const d2 = detectCommitmentTemporalTermDivergences(state, COMMIT_ID);
      const c1 = assessCommitmentTemporalTermContext(state, COMMIT_ID);
      const c2 = assessCommitmentTemporalTermContext(state, COMMIT_ID);
      const h1 = getCommitmentTemporalTermHistory(state, COMMIT_ID);
      const h2 = getCommitmentTemporalTermHistory(state, COMMIT_ID);
      assert.deepEqual(a1, a2);
      assert.deepEqual(d1, d2);
      assert.deepEqual(c1, c2);
      assert.deepEqual(h1, h2);
      assert.equal(h1.has_declarations, true);
      const json = JSON.stringify(h1);
      assert.equal(json.includes("current_deadline"), false);
      assert.equal(json.includes("effective_deadline"), false);
    });

    it("temporal-term-core does not import state-engine / file-store / studio", () => {
      const src = readFileSync(
        join(__dirnameTest, "../reality/commitment-temporal-term-core.ts"),
        "utf8"
      );
      assert.equal(/from ["'].*state-engine/.test(src), false);
      assert.equal(/from ["'].*file-store/.test(src), false);
      assert.equal(/from ["'].*studio\//.test(src), false);
    });
  });
});
