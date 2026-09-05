/**
 * GROUND-033 — Commitment Core IV / Conditional Terms Foundation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { migrateProjectState } from "../migrate.js";
import { assessDeclaredCommitmentAcceptance } from "../reality/commitment-acceptance-core.js";
import {
  assessCommitmentConditionalTermContext,
  assessCommitmentConditionalTermSourceRelation,
  assessDeclaredCommitmentConditionalTerms,
  COMMITMENT_CONDITIONAL_TERM_MODEL_LIMITATIONS,
  detectCommitmentConditionRoleDivergences,
  getCommitmentConditionalTermHistory,
  groupCommitmentConditionalTermPositions,
} from "../reality/commitment-conditional-term-core.js";
import { assessDeclaredInterventionCommitment } from "../reality/commitment-core.js";
import { assessDeclaredCommitmentTemporalTerms } from "../reality/commitment-temporal-term-core.js";
import { applyPatch } from "../state-engine.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  CommitmentConditionRole,
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  InterventionCommitmentConditionalTermDeclaration,
  InterventionCommitmentDeclaration,
  InterventionDeclaration,
  ProjectState,
  RealityEntity,
  StatePatch,
} from "../types.js";
import {
  PROJECT_ID,
  validProjectStateV0121,
  validProjectStateV0124,
} from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const ENTITY_HOLDER = "fc010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR_B = "fc010101-0101-4101-8101-010101010102";
const ENTITY_DECLARER = "fc010101-0101-4101-8101-010101010103";
const INT_A = "fc020202-0202-4202-8202-020202020201";
const SPACE_D = "fc030303-0303-4303-8303-030303030301";
const OPT_INT = "fc040404-0404-4404-8404-040404040401";
const CAND_A = "fc050505-0505-4505-8505-050505050501";
const COMMIT_ID = "fc080808-0808-4808-8808-080808080801";
const COMMIT_ID_2 = "fc080808-0808-4808-8808-080808080802";
const ACCEPT_ID = "fc090909-0909-4909-8909-090909090901";
const TERM_ID = "fc0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const COND_ID = "fc0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const COND_ID_2 = "fc0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b02";
const PERM_ID = "fc0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const STATE_ID = "fc0d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";

const TS = "2026-07-01T10:00:00.000Z";
const COMMITTED_AT = "2026-08-01T10:00:00.000Z";
const ACCEPTED_AT = "2026-08-01T12:00:00.000Z";
const DEADLINE = "2026-09-10T18:00:00.000Z";
const RECORDED = "2026-08-20T10:00:00.000Z";
const VALID_UNTIL = "2026-10-01T10:00:00.000Z";

const FORBIDDEN_API =
  /\b(is_true|is_satisfied|condition_status|all_conditions_met|any_condition_met|accepted_condition|accepted_conditional_term|effective_commitment|commitment_level|REMOVE_CONDITION|NO_CONDITION|CANCEL_CONDITION)\b/;

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
    declaredBy?: InterventionCommitmentDeclaration["declared_by"];
    validUntil?: string | null;
  } = {}
): InterventionCommitmentDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    commitment_holder_entity_id: ENTITY_HOLDER,
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

function temporalPatch(id: string): StatePatch {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_commitment_temporal_term_declaration",
        entity_id: id,
        payload: {
          id,
          project_id: PROJECT_ID,
          commitment_declaration_id: COMMIT_ID,
          term_kind: "COMPLETE_BY",
          deadline_at: DEADLINE,
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

function condPayload(
  id: string,
  opts: {
    commitmentId?: string;
    key?: string;
    role?: CommitmentConditionRole;
    description?: string | null;
    note?: string | null;
    declaredBy?: InterventionCommitmentConditionalTermDeclaration["declared_by"];
  } = {}
): InterventionCommitmentConditionalTermDeclaration {
  return {
    id,
    project_id: PROJECT_ID,
    commitment_declaration_id: opts.commitmentId ?? COMMIT_ID,
    condition_key: opts.key ?? "permit_received",
    condition_role: opts.role ?? "ACTIVATION_CONDITION",
    description: opts.description === undefined ? null : opts.description,
    note: opts.note === undefined ? null : opts.note,
    declared_by: opts.declaredBy ?? {
      kind: "human",
      entity_id: ENTITY_HOLDER,
    },
    recorded_at: RECORDED,
    created_at: RECORDED,
    updated_at: RECORDED,
  };
}

function condPatch(
  id: string,
  opts: Parameters<typeof condPayload>[1] = {}
): StatePatch {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "intervention_commitment_conditional_term_declaration",
        entity_id: id,
        payload: condPayload(id, opts),
      },
    ],
  };
}

function snapshotFirewall(state: ProjectState) {
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
    intervention_commitment_temporal_term_declarations: structuredClone(
      state.intervention_commitment_temporal_term_declarations
    ),
    decisions: structuredClone(state.decisions),
    next_actions: structuredClone(state.next_actions),
    current_state: structuredClone(state.current_state),
  };
}

describe("Commitment Conditional Terms (GROUND-033)", () => {
  describe("Migration", () => {
    it("migrates 0.1.21 → 0.1.22 with empty Conditional Term array", () => {
      const migrated = migrateProjectState(validProjectStateV0121);
      assert.equal(migrated.schema_version, "0.1.24");
      assert.deepEqual(
        migrated.intervention_commitment_conditional_term_declarations,
        []
      );
    });

    it("does not backfill Conditional Terms", () => {
      const migrated = migrateProjectState(validProjectStateV0121);
      assert.equal(
        migrated.intervention_commitment_conditional_term_declarations.length,
        0
      );
    });

    it("SCHEMA_VERSION is 0.1.22", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
    });
  });

  describe("Persistence", () => {
    it("persists ACTIVATION_CONDITION", () => {
      const next = applyPatch(
        withCommitment(),
        condPatch(COND_ID, {
          key: "permit_received",
          role: "ACTIVATION_CONDITION",
        })
      );
      const stored =
        next.intervention_commitment_conditional_term_declarations[0]!;
      assert.equal(stored.condition_key, "permit_received");
      assert.equal(stored.condition_role, "ACTIVATION_CONDITION");
    });

    it("persists EXCEPTION_CONDITION", () => {
      const next = applyPatch(
        withCommitment(),
        condPatch(COND_ID, {
          key: "emergency_override",
          role: "EXCEPTION_CONDITION",
        })
      );
      assert.equal(
        next.intervention_commitment_conditional_term_declarations[0]
          ?.condition_role,
        "EXCEPTION_CONDITION"
      );
    });
  });

  describe("Referential / key / role invariants", () => {
    it("rejects unknown Commitment", () => {
      assert.throws(
        () =>
          applyPatch(
            baseState(),
            condPatch(COND_ID, {
              commitmentId: "00000000-0000-4000-8000-000000000099",
            })
          ),
        /commitment_declaration_id/
      );
    });

    it("rejects unknown declarer", () => {
      assert.throws(
        () =>
          applyPatch(
            withCommitment(),
            condPatch(COND_ID, {
              declaredBy: {
                kind: "human",
                entity_id: "00000000-0000-4000-8000-000000000099",
              },
            })
          ),
        /declared_by/
      );
    });

    it("rejects empty condition_key", () => {
      assert.throws(
        () =>
          applyPatch(withCommitment(), condPatch(COND_ID, { key: "   " })),
        /condition_key/
      );
    });

    it("rejects invalid role", () => {
      assert.throws(
        () =>
          applyPatch(
            withCommitment(),
            condPatch(COND_ID, {
              role: "IF" as CommitmentConditionRole,
            })
          ),
        /condition_role/
      );
    });

    it("keeps opaque keys exact (weather_safe != safe_weather)", () => {
      let state = applyPatch(
        withCommitment(),
        condPatch(COND_ID, { key: "weather_safe" })
      );
      state = applyPatch(
        state,
        condPatch(COND_ID_2, {
          key: "safe_weather",
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const assessment = assessDeclaredCommitmentConditionalTerms(
        state,
        COMMIT_ID
      );
      assert.equal(assessment.positions.length, 2);
      assert.deepEqual(
        assessment.positions.map((entry) => entry.condition_key).sort(),
        ["safe_weather", "weather_safe"]
      );
    });
  });

  describe("Auto-create / Acceptance / Temporal firewalls", () => {
    it("Commitment Acceptance does not create Conditional Term", () => {
      const state = applyPatch(withCommitment(), acceptancePatch(ACCEPT_ID));
      assert.equal(
        assessDeclaredCommitmentConditionalTerms(state, COMMIT_ID)
          .has_conditional_terms,
        false
      );
    });

    it("Temporal Terms do not create Conditional Term", () => {
      const state = applyPatch(withCommitment(), temporalPatch(TERM_ID));
      assert.equal(
        assessDeclaredCommitmentConditionalTerms(state, COMMIT_ID)
          .has_conditional_terms,
        false
      );
      assert.equal(
        assessDeclaredCommitmentTemporalTerms(state, COMMIT_ID)
          .has_temporal_terms,
        true
      );
    });

    it("Acceptance before/after Conditional Term does not accept the condition", () => {
      let before = applyPatch(withCommitment(), acceptancePatch(ACCEPT_ID));
      before = applyPatch(before, condPatch(COND_ID));
      let after = applyPatch(withCommitment(), condPatch(COND_ID));
      after = applyPatch(after, acceptancePatch(ACCEPT_ID));
      for (const state of [before, after]) {
        const json = JSON.stringify(
          assessCommitmentConditionalTermContext(state, COMMIT_ID)
        );
        assert.equal(json.includes("accepted_condition"), false);
        assert.equal(json.includes("accepted_conditional_term"), false);
        assert.equal(
          assessDeclaredCommitmentAcceptance(state, COMMIT_ID).status,
          "ACCEPTANCE_DECLARED"
        );
      }
    });
  });

  describe("Source relation", () => {
    it("holder-declared condition", () => {
      const state = applyPatch(withCommitment(), condPatch(COND_ID));
      const commitment = state.intervention_commitment_declarations[0]!;
      const term =
        state.intervention_commitment_conditional_term_declarations[0]!;
      assert.equal(
        assessCommitmentConditionalTermSourceRelation(term, commitment)
          .source_relation,
        "DECLARED_BY_COMMITMENT_HOLDER"
      );
      const json = JSON.stringify(
        assessCommitmentConditionalTermContext(state, COMMIT_ID)
      );
      assert.equal(FORBIDDEN_API.test(json), false);
    });

    it("third-party condition", () => {
      const state = applyPatch(
        withCommitment(),
        condPatch(COND_ID, {
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      assert.deepEqual(
        assessCommitmentConditionalTermContext(state, COMMIT_ID)
          .source_relations.map((entry) => entry.source_relation),
        ["DECLARED_BY_OTHER_ENTITY"]
      );
    });

    it("non-Entity source", () => {
      const state = applyPatch(
        withCommitment(),
        condPatch(COND_ID, {
          declaredBy: { kind: "system", label: "import" },
        })
      );
      assert.deepEqual(
        assessCommitmentConditionalTermContext(state, COMMIT_ID)
          .source_relations.map((entry) => entry.source_relation),
        ["DECLARED_BY_NON_ENTITY_SOURCE"]
      );
    });
  });

  describe("Semantic grouping / divergence / composition", () => {
    it("description does not alter semantic identity", () => {
      let state = applyPatch(
        withCommitment(),
        condPatch(COND_ID, {
          description: "wind under safe threshold",
        })
      );
      state = applyPatch(
        state,
        condPatch(COND_ID_2, {
          description: "safe wind conditions",
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const positions = groupCommitmentConditionalTermPositions(
        state,
        COMMIT_ID
      );
      assert.equal(positions.length, 1);
      assert.deepEqual(positions[0]!.descriptions, [
        "safe wind conditions",
        "wind under safe threshold",
      ]);
    });

    it("groups same semantic condition from multiple sources", () => {
      let state = applyPatch(withCommitment(), condPatch(COND_ID));
      state = applyPatch(
        state,
        condPatch(COND_ID_2, {
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const positions = groupCommitmentConditionalTermPositions(
        state,
        COMMIT_ID
      );
      assert.equal(positions.length, 1);
      assert.equal(positions[0]!.has_multiple_declarations, true);
      assert.equal(JSON.stringify(positions[0]).includes("vote"), false);
    });

    it("groups across equivalent Commitment targets", () => {
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
        condPatch(COND_ID, { commitmentId: COMMIT_ID })
      );
      state = applyPatch(
        state,
        condPatch(COND_ID_2, {
          commitmentId: COMMIT_ID_2,
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const positions = groupCommitmentConditionalTermPositions(
        state,
        COMMIT_ID
      );
      assert.equal(positions.length, 1);
      assert.deepEqual(
        [...positions[0]!.targeted_commitment_declaration_ids].sort(),
        [COMMIT_ID, COMMIT_ID_2].sort()
      );
    });

    it("rejects same-source duplicate across equivalent Commitment targets", () => {
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
        condPatch(COND_ID, { commitmentId: COMMIT_ID })
      );
      assert.throws(
        () =>
          applyPatch(
            state,
            condPatch(COND_ID_2, {
              commitmentId: COMMIT_ID_2,
              description: "different wording",
            })
          ),
        /semantic duplicate/
      );
    });

    it("same condition opposite roles forms role divergence", () => {
      let state = applyPatch(
        withCommitment(),
        condPatch(COND_ID, {
          key: "permit_received",
          role: "ACTIVATION_CONDITION",
        })
      );
      state = applyPatch(
        state,
        condPatch(COND_ID_2, {
          key: "permit_received",
          role: "EXCEPTION_CONDITION",
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const divergences = detectCommitmentConditionRoleDivergences(
        state,
        COMMIT_ID
      );
      assert.equal(divergences.length, 1);
      assert.deepEqual(divergences[0]!.condition_roles, [
        "ACTIVATION_CONDITION",
        "EXCEPTION_CONDITION",
      ]);
      assert.equal(JSON.stringify(divergences[0]).includes("winner"), false);
    });

    it("multiple Activation conditions preserve all without AND/OR", () => {
      let state = applyPatch(
        withCommitment(),
        condPatch(COND_ID, { key: "permit_received" })
      );
      state = applyPatch(
        state,
        condPatch(COND_ID_2, {
          key: "budget_approved",
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const assessment = assessDeclaredCommitmentConditionalTerms(
        state,
        COMMIT_ID
      );
      assert.equal(assessment.positions.length, 2);
      assert.equal(assessment.role_divergences.length, 0);
      const json = JSON.stringify(assessment);
      // Multiple Activation: "and"/"or" must not appear as composition fields.
      assert.equal(/"and"/.test(json), false);
      assert.equal(/"or"/.test(json), false);
      assert.equal(json.includes("all_conditions_met"), false);
    });

    it("Temporal + Conditional Terms do not compose into one clause", () => {
      let state = applyPatch(withCommitment(), temporalPatch(TERM_ID));
      state = applyPatch(state, condPatch(COND_ID));
      const context = assessCommitmentConditionalTermContext(state, COMMIT_ID);
      assert.equal(context.temporal_terms.has_temporal_terms, true);
      assert.equal(context.conditional_terms.has_conditional_terms, true);
      const json = JSON.stringify(context);
      assert.equal(json.includes("if K then"), false);
      assert.equal(json.includes("complete by T only if"), false);
      assert.equal(FORBIDDEN_API.test(json), false);
    });
  });

  describe("Commitment assessment / applicability unchanged", () => {
    it("Conditional Term does not gate Commitment assessment", () => {
      const before = withCommitment({ validUntil: VALID_UNTIL });
      const beforeStatus = assessDeclaredInterventionCommitment(
        before,
        ENTITY_HOLDER,
        INT_A,
        "2026-08-15T00:00:00.000Z"
      ).status;
      const after = applyPatch(before, condPatch(COND_ID));
      const afterStatus = assessDeclaredInterventionCommitment(
        after,
        ENTITY_HOLDER,
        INT_A,
        "2026-08-15T00:00:00.000Z"
      ).status;
      assert.equal(beforeStatus, "COMMITMENT_DECLARED");
      assert.equal(afterStatus, "COMMITMENT_DECLARED");
      assert.deepEqual(
        after.intervention_commitment_declarations[0],
        before.intervention_commitment_declarations[0]
      );
    });
  });

  describe("Contracts / model limitations", () => {
    it("contracts contain no truth/eval/composition vocabulary", () => {
      const typesSrc = readFileSync(
        join(__dirnameTest, "../reality/commitment-conditional-term-types.ts"),
        "utf8"
      );
      const coreSrc = readFileSync(
        join(__dirnameTest, "../reality/commitment-conditional-term-core.ts"),
        "utf8"
      );
      for (const token of [
        "is_true",
        "is_satisfied",
        "condition_status",
        "all_conditions_met",
        "any_condition_met",
        "accepted_condition",
        "REMOVE_CONDITION",
        "eval(",
        "JSONLogic",
      ]) {
        assert.equal(typesSrc.includes(token), false, token);
        assert.equal(coreSrc.includes(token), false, token);
      }
    });

    it("exposes model limitations", () => {
      const state = applyPatch(withCommitment(), condPatch(COND_ID));
      const context = assessCommitmentConditionalTermContext(state, COMMIT_ID);
      assert.deepEqual(
        context.model_limitations,
        COMMITMENT_CONDITIONAL_TERM_MODEL_LIMITATIONS
      );
    });

    it("does not auto-evaluate via RealityState / Permission", () => {
      let state = withCommitment();
      state = applyPatch(state, {
        schema_version: SCHEMA_VERSION,
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "reality_state",
            entity_id: STATE_ID,
            payload: {
              id: STATE_ID,
              project_id: PROJECT_ID,
              subject_id: ENTITY_HOLDER,
              kind: "permit_received",
              value: "true",
              valid_from: TS,
              valid_until: null,
              recorded_at: TS,
              created_at: TS,
              updated_at: TS,
            },
          },
        ],
      });
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
              effect: "PERMIT",
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
      state = applyPatch(state, condPatch(COND_ID, { key: "permit_received" }));
      const context = assessCommitmentConditionalTermContext(state, COMMIT_ID);
      const json = JSON.stringify(context);
      assert.equal(context.conditional_terms.has_conditional_terms, true);
      assert.equal(json.includes("is_satisfied"), false);
      assert.equal(json.includes("condition_status"), false);
      assert.equal(json.includes('"evaluated"'), false);
    });
  });

  describe("Firewalls", () => {
    it("Conditional Term does not mutate adjacent cores or create execution", () => {
      const before = withCommitment();
      const beforeSnap = snapshotFirewall(before);
      const after = applyPatch(before, condPatch(COND_ID));
      const afterSnap = snapshotFirewall(after);
      assert.deepEqual(afterSnap.reality_states, beforeSnap.reality_states);
      assert.deepEqual(afterSnap.reality_events, beforeSnap.reality_events);
      assert.deepEqual(afterSnap.claims, beforeSnap.claims);
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
      assert.deepEqual(
        afterSnap.intervention_commitment_temporal_term_declarations,
        beforeSnap.intervention_commitment_temporal_term_declarations
      );
      assert.deepEqual(afterSnap.next_actions, beforeSnap.next_actions);
      const json = JSON.stringify(
        assessCommitmentConditionalTermContext(after, COMMIT_ID)
      );
      assert.equal(json.includes("feasible"), false);
      assert.equal(json.includes("commitment_level"), false);
      assert.equal(
        after.intervention_commitment_conditional_term_declarations.length,
        1
      );
    });
  });

  describe("Append-only", () => {
    it("rejects Conditional Term update", () => {
      const state = applyPatch(withCommitment(), condPatch(COND_ID));
      assert.throws(
        () => applyPatch(state, condPatch(COND_ID, { note: "changed" })),
        /append-only/
      );
    });

    it("rejects Conditional Term delete", () => {
      const state = applyPatch(withCommitment(), condPatch(COND_ID));
      assert.throws(
        () =>
          applyPatch(state, {
            schema_version: SCHEMA_VERSION,
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "delete",
                entity: "intervention_commitment_conditional_term_declaration",
                entity_id: COND_ID,
              },
            ],
          }),
        /append-only/
      );
    });

    it("rejects deleting Conditional Term declarer Entity", () => {
      const state = applyPatch(
        withCommitment(),
        condPatch(COND_ID, {
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
        /intervention_commitment_conditional_term_declaration/
      );
    });
  });

  describe("Read-only / determinism", () => {
    it("assessment does not mutate ProjectState", () => {
      const state = applyPatch(withCommitment(), condPatch(COND_ID));
      const before = structuredClone(state);
      assessDeclaredCommitmentConditionalTerms(state, COMMIT_ID);
      detectCommitmentConditionRoleDivergences(state, COMMIT_ID);
      assessCommitmentConditionalTermContext(state, COMMIT_ID);
      getCommitmentConditionalTermHistory(state, COMMIT_ID);
      assert.deepEqual(state, before);
    });

    it("repeated assessments are deterministic", () => {
      let state = applyPatch(
        withCommitment(),
        condPatch(COND_ID, {
          key: "permit_received",
          role: "ACTIVATION_CONDITION",
        })
      );
      state = applyPatch(
        state,
        condPatch(COND_ID_2, {
          key: "permit_received",
          role: "EXCEPTION_CONDITION",
          declaredBy: { kind: "human", entity_id: ENTITY_ACTOR_B },
        })
      );
      const a1 = assessDeclaredCommitmentConditionalTerms(state, COMMIT_ID);
      const a2 = assessDeclaredCommitmentConditionalTerms(state, COMMIT_ID);
      const d1 = detectCommitmentConditionRoleDivergences(state, COMMIT_ID);
      const d2 = detectCommitmentConditionRoleDivergences(state, COMMIT_ID);
      const c1 = assessCommitmentConditionalTermContext(state, COMMIT_ID);
      const c2 = assessCommitmentConditionalTermContext(state, COMMIT_ID);
      const h1 = getCommitmentConditionalTermHistory(state, COMMIT_ID);
      const h2 = getCommitmentConditionalTermHistory(state, COMMIT_ID);
      assert.deepEqual(a1, a2);
      assert.deepEqual(d1, d2);
      assert.deepEqual(c1, c2);
      assert.deepEqual(h1, h2);
      assert.equal(h1.has_declarations, true);
      assert.equal(JSON.stringify(h1).includes("current_condition"), false);
      assert.equal(JSON.stringify(h1).includes("effective_condition"), false);
    });

    it("conditional-term-core does not import state-engine / file-store / studio", () => {
      const src = readFileSync(
        join(__dirnameTest, "../reality/commitment-conditional-term-core.ts"),
        "utf8"
      );
      assert.equal(/from ["'].*state-engine/.test(src), false);
      assert.equal(/from ["'].*file-store/.test(src), false);
      assert.equal(/from ["'].*studio\//.test(src), false);
    });
  });
});
