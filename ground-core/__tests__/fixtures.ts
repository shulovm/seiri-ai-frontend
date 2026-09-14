/** Valid UUID v4 fixtures for schema validation tests */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ProjectState } from "../types.js";

export const PROJECT_ID = "a1b2c3d4-e5f6-4890-abcd-ef1234567890";
export const GOAL_ID = "b2c3d4e5-f6a7-4891-bcde-f12345678901";
export const CURRENT_STATE_ID = "c3d4e5f6-a7b8-4912-cdef-123456789012";
export const NEXT_ACTION_ID = "d4e5f6a7-b8c9-4123-def0-234567890123";
export const DECISION_ID = "e5f6a7b8-c9d0-4234-ef01-345678901234";
export const HYPOTHESIS_ID = "f6a7b8c9-d0e1-4345-f012-456789012345";
export const BLOCKER_ID = "11111111-2222-4333-4444-555555555555";

const TS = "2026-06-07T12:00:00.000Z";

export const validProjectStateV010 = {
  schema_version: "0.1.0",
  project: {
    id: PROJECT_ID,
    title: "GROUND Core v0.1",
    summary: "会話ではなく Project State を保存する個人思考 OS の最小核を設計する。",
    status: "active",
    created_at: TS,
    updated_at: TS,
  },
  goals: [
    {
      id: GOAL_ID,
      project_id: PROJECT_ID,
      parent_goal_id: null,
      title: "v0.1 設計を完了する",
      description: "データモデル・JSON Schema・State Engine インターフェースを確定する。",
      status: "active",
      priority: 1,
      sort_order: 0,
      created_at: TS,
      updated_at: TS,
    },
  ],
  current_state: {
    id: CURRENT_STATE_ID,
    project_id: PROJECT_ID,
    primary_goal_id: GOAL_ID,
    summary: "設計ドキュメント作成中。実装はまだ着手しない。",
    phase: "design",
    confidence: 0.85,
    updated_at: TS,
  },
  blockers: [],
  next_actions: [
    {
      id: NEXT_ACTION_ID,
      project_id: PROJECT_ID,
      goal_id: GOAL_ID,
      blocker_id: null,
      title: "JSON Schema ファイルをリポジトリに置く",
      description: null,
      status: "pending",
      due_at: null,
      sort_order: 0,
      created_at: TS,
      updated_at: TS,
    },
  ],
  decisions: [
    {
      id: DECISION_ID,
      project_id: PROJECT_ID,
      goal_id: GOAL_ID,
      title: "v0.1 は JSON ファイルストアから始める",
      rationale: "PostgreSQL は設計だけ先に固め、実装コストを抑える。",
      alternatives_considered: ["最初から Supabase", "SQLite"],
      status: "active",
      decided_at: TS,
      created_at: TS,
      updated_at: TS,
    },
  ],
  hypotheses: [
    {
      id: HYPOTHESIS_ID,
      project_id: PROJECT_ID,
      goal_id: GOAL_ID,
      statement: "会話から週1回 state を更新すれば、チャット履歴なしで文脈を維持できる",
      status: "untested",
      evidence_for: [],
      evidence_against: [],
      created_at: TS,
      updated_at: TS,
    },
  ],
  goal_edges: [],
  extensions: {},
  updated_at: TS,
};

/** @deprecated use validProjectStateV011 or validProjectStateV010 */
export const validProjectState = validProjectStateV010;

export const validProjectStateV011 = {
  ...validProjectStateV010,
  schema_version: "0.1.1" as const,
  current_state: {
    ...validProjectStateV010.current_state,
    primary_next_action_id: NEXT_ACTION_ID,
  },
  next_actions: validProjectStateV010.next_actions.map((action) => ({
    ...action,
    depends_on_action_id: null,
  })),
  reference_docs: [],
  observations: [],
  judgments: [],
};

/** Intermediate ProjectState after Ontic Foundation (v0.1.2) — pre-epistemic. */
export const validProjectStateV012 = {
  ...validProjectStateV011,
  schema_version: "0.1.2" as const,
  reality_entities: [] as [],
  reality_events: [] as [],
  reality_states: [] as [],
};

/** Canonical ProjectState after Epistemic Core I (v0.1.3). */
export const validProjectStateV013 = {
  ...validProjectStateV012,
  schema_version: "0.1.3" as const,
  epistemic_observations: [] as ProjectState["epistemic_observations"],
  evidence: [] as ProjectState["evidence"],
  claims: [] as ProjectState["claims"],
  claim_evidence_links: [] as ProjectState["claim_evidence_links"],
} as unknown as ProjectState;

/** Canonical ProjectState after Reference State Core (v0.1.4) — pre-Objective Core. */
export const validProjectStateV014 = {
  ...validProjectStateV013,
  schema_version: "0.1.4" as const,
  reference_conditions: [] as ProjectState["reference_conditions"],
} as ProjectState;

/** Canonical ProjectState after Objective Core (v0.1.5) — pre-Prospective Core. */
export const validProjectStateV015 = {
  ...validProjectStateV014,
  schema_version: "0.1.5" as const,
  reality_objectives: [] as ProjectState["reality_objectives"],
  objective_requirements: [] as ProjectState["objective_requirements"],
  objective_dependencies: [] as ProjectState["objective_dependencies"],
} as ProjectState;

/** Canonical ProjectState after Prospective Core (v0.1.6). */
export const validProjectStateV016 = {
  ...validProjectStateV015,
  schema_version: "0.1.6" as const,
  future_scenarios: [] as ProjectState["future_scenarios"],
  scenario_state_projections: [] as ProjectState["scenario_state_projections"],
  scenario_likelihood_estimates: [] as ProjectState["scenario_likelihood_estimates"],
} as ProjectState;

/** Canonical ProjectState after Impact Core (v0.1.7). */
export const validProjectStateV017 = {
  ...validProjectStateV016,
  schema_version: "0.1.7" as const,
  impact_declarations: [] as ProjectState["impact_declarations"],
} as ProjectState;

/** Canonical ProjectState after Impact Measurement (v0.1.8). */
export const validProjectStateV018 = {
  ...validProjectStateV017,
  schema_version: "0.1.8" as const,
  impact_measure_declarations: [] as ProjectState["impact_measure_declarations"],
} as ProjectState;

/** Canonical ProjectState after Governance Core (v0.1.9). */
export const validProjectStateV019 = {
  ...validProjectStateV018,
  schema_version: "0.1.9" as const,
  authority_declarations: [] as ProjectState["authority_declarations"],
  standing_declarations: [] as ProjectState["standing_declarations"],
  mandate_declarations: [] as ProjectState["mandate_declarations"],
} as ProjectState;

/** Canonical ProjectState after Governance Core II (v0.1.10). */
export const validProjectStateV0110 = {
  ...validProjectStateV019,
  schema_version: "0.1.10" as const,
  authority_delegation_declarations: [] as ProjectState["authority_delegation_declarations"],
  authority_contest_declarations: [] as ProjectState["authority_contest_declarations"],
} as ProjectState;

/** Canonical ProjectState after Capability Core I (v0.1.11). */
export const validProjectStateV0111 = {
  ...validProjectStateV0110,
  schema_version: "0.1.11" as const,
  capability_declarations: [] as ProjectState["capability_declarations"],
  capability_verification_declarations: [] as ProjectState["capability_verification_declarations"],
  capability_availability_declarations: [] as ProjectState["capability_availability_declarations"],
} as ProjectState;

/** Canonical ProjectState after Resource Core I (v0.1.12). */
export const validProjectStateV0112 = {
  ...validProjectStateV0111,
  schema_version: "0.1.12" as const,
  resource_declarations: [] as ProjectState["resource_declarations"],
  resource_capacity_declarations: [] as ProjectState["resource_capacity_declarations"],
  resource_availability_declarations: [] as ProjectState["resource_availability_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Intervention Core I (v0.1.13) — pre-Permission Core. */
export const validProjectStateV0113 = {
  ...validProjectStateV0112,
  schema_version: "0.1.13" as const,
  intervention_declarations: [] as ProjectState["intervention_declarations"],
  intervention_capability_requirement_declarations: [] as ProjectState["intervention_capability_requirement_declarations"],
  intervention_resource_requirement_declarations: [] as ProjectState["intervention_resource_requirement_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Permission Core I (v0.1.14) — pre-Decision Core. */
export const validProjectStateV0114 = {
  ...validProjectStateV0113,
  schema_version: "0.1.14" as const,
  intervention_permission_declarations: [] as ProjectState["intervention_permission_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Decision Core I (v0.1.15) — pre-Agency Composition. */
export const validProjectStateV0115 = {
  ...validProjectStateV0114,
  schema_version: "0.1.15" as const,
  decision_space_declarations: [] as ProjectState["decision_space_declarations"],
  decision_option_declarations: [] as ProjectState["decision_option_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Agency Composition I (v0.1.16) — pre-Decision Memory. */
export const validProjectStateV0116 = {
  ...validProjectStateV0115,
  schema_version: "0.1.16" as const,
  decision_option_actor_candidate_declarations: [] as ProjectState["decision_option_actor_candidate_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Decision Memory I (v0.1.17) — pre-Intent Core. */
export const validProjectStateV0117 = {
  ...validProjectStateV0116,
  schema_version: "0.1.17" as const,
  reality_decision_declarations: [] as ProjectState["reality_decision_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Intent Core I (v0.1.18) — pre-Commitment Core. */
export const validProjectStateV0118 = {
  ...validProjectStateV0117,
  schema_version: "0.1.18" as const,
  intervention_intent_declarations: [] as ProjectState["intervention_intent_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Commitment Core I (v0.1.19; pre-Acceptance). */
export const validProjectStateV0119 = {
  ...validProjectStateV0118,
  schema_version: "0.1.19" as const,
  intervention_commitment_declarations: [] as ProjectState["intervention_commitment_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Commitment Acceptance (v0.1.20; pre-Temporal Terms). */
export const validProjectStateV0120 = {
  ...validProjectStateV0119,
  schema_version: "0.1.20" as const,
  intervention_commitment_acceptance_declarations: [] as ProjectState["intervention_commitment_acceptance_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Commitment Temporal Terms (v0.1.21; pre-Conditional Terms). */
export const validProjectStateV0121 = {
  ...validProjectStateV0120,
  schema_version: "0.1.21" as const,
  intervention_commitment_temporal_term_declarations: [] as ProjectState["intervention_commitment_temporal_term_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Commitment Conditional Terms (v0.1.22; pre-Resource Commitment). */
export const validProjectStateV0122 = {
  ...validProjectStateV0121,
  schema_version: "0.1.22" as const,
  intervention_commitment_conditional_term_declarations: [] as ProjectState["intervention_commitment_conditional_term_declarations"],
} as ProjectState;

/** Intermediate ProjectState after Resource Commitment (v0.1.23; pre-Reservation). */
export const validProjectStateV0123 = {
  ...validProjectStateV0122,
  schema_version: "0.1.23" as const,
  intervention_resource_commitment_declarations: [] as ProjectState["intervention_resource_commitment_declarations"],
} as ProjectState;

/** Canonical ProjectState after Resource Reservation (v0.1.24). */
export const validProjectStateV0124 = {
  ...validProjectStateV0123,
  schema_version: "0.1.24" as const,
  intervention_resource_reservation_declarations: [] as ProjectState["intervention_resource_reservation_declarations"],
} as ProjectState;

/** Canonical snapshot-verification schema fixture; no historical Decisions to classify. */
export const validProjectStateV0125 = { ...validProjectStateV0124, schema_version: "0.1.25" as const } as ProjectState;

export const REFERENCE_DOC_ID = "a9010101-0101-4101-8101-010101010101";
export const OBSERVATION_ID = "a9020202-0202-4202-8202-020202020202";
export const JUDGMENT_ID = "a9030303-0303-4303-8303-030303030303";
export const NEXT_ACTION_2_ID = "d4e5f6a7-b8c9-4123-8ef0-234567890124";

/** Isolated reconcile-test IDs — must never equal live dogfood project IDs */
export const RECONCILE_PROJECT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1";
export const RECONCILE_GOAL_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2";
export const RECONCILE_CURRENT_STATE_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3";
export const RECONCILE_PRIMARY_ACTION_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa11";
export const RECONCILE_SECOND_ACTION_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa12";
export const RECONCILE_BLOCKER_A_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaab01";
export const RECONCILE_BLOCKER_B_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaab02";
export const RECONCILE_BLOCKER_RESOLVED_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaab03";

/** Well-known FreeWater phase0 fixture IDs (test-only; do not load from live storage) */
export const FREEWATER_FIXTURE_PROJECT_ID = "28d83a68-2064-43d7-94cb-72656b9006de";
export const FREEWATER_FIXTURE_LOCATION_ACTION_ID =
  "f3333333-3333-4333-8333-333333333301";

/**
 * Isolated FreeWater Phase0 ProjectState for tests.
 * Loaded from committed test fixture — never from ground-core/storage/projects.
 */
export function buildFreeWaterPhase0Fixture(): ProjectState {
  const path = join(
    process.cwd(),
    "ground-core/__tests__/fixtures/freewater-phase0.project.json"
  );
  return structuredClone(JSON.parse(readFileSync(path, "utf8"))) as ProjectState;
}

/**
 * Deterministic ProjectState for State Reconciliation tests.
 * Independent of live dogfood storage.
 */
export function buildReconcileFixtureState() {
  const ts = "2026-08-11T00:00:00.000Z";
  return {
    schema_version: "0.1.25" as const,
    project: {
      id: RECONCILE_PROJECT_ID,
      title: "Reconcile Isolation Fixture",
      summary: "Isolated fixture for reconcile tests — not a live project.",
      status: "active" as const,
      created_at: ts,
      updated_at: ts,
    },
    goals: [
      {
        id: RECONCILE_GOAL_ID,
        project_id: RECONCILE_PROJECT_ID,
        parent_goal_id: null,
        title: "reconcile fixture goal",
        description: "test-only goal",
        status: "active" as const,
        priority: 1,
        sort_order: 0,
        created_at: ts,
        updated_at: ts,
      },
    ],
    current_state: {
      id: RECONCILE_CURRENT_STATE_ID,
      project_id: RECONCILE_PROJECT_ID,
      primary_goal_id: RECONCILE_GOAL_ID,
      primary_next_action_id: RECONCILE_PRIMARY_ACTION_ID,
      summary: "reconcile fixture: primary pending, two open blockers",
      phase: "reconcile_test",
      confidence: 0.7,
      updated_at: ts,
    },
    blockers: [
      {
        id: RECONCILE_BLOCKER_A_ID,
        project_id: RECONCILE_PROJECT_ID,
        goal_id: RECONCILE_GOAL_ID,
        title: "fixture blocker A (open)",
        description: "open blocker for resolve tests",
        severity: "high" as const,
        status: "open" as const,
        created_at: ts,
        updated_at: ts,
      },
      {
        id: RECONCILE_BLOCKER_B_ID,
        project_id: RECONCILE_PROJECT_ID,
        goal_id: RECONCILE_GOAL_ID,
        title: "fixture blocker B (open, must stay untouched)",
        description: "must remain open unless explicitly targeted",
        severity: "medium" as const,
        status: "open" as const,
        created_at: ts,
        updated_at: ts,
      },
      {
        id: RECONCILE_BLOCKER_RESOLVED_ID,
        project_id: RECONCILE_PROJECT_ID,
        goal_id: RECONCILE_GOAL_ID,
        title: "fixture blocker already resolved",
        description: "for duplicate resolve clarification",
        severity: "low" as const,
        status: "resolved" as const,
        created_at: ts,
        updated_at: ts,
      },
    ],
    next_actions: [
      {
        id: RECONCILE_PRIMARY_ACTION_ID,
        project_id: RECONCILE_PROJECT_ID,
        goal_id: RECONCILE_GOAL_ID,
        blocker_id: null,
        depends_on_action_id: null,
        title: "fixture primary action",
        description: "current primary — pending",
        status: "pending" as const,
        due_at: null,
        sort_order: 0,
        created_at: ts,
        updated_at: ts,
      },
      {
        id: RECONCILE_SECOND_ACTION_ID,
        project_id: RECONCILE_PROJECT_ID,
        goal_id: RECONCILE_GOAL_ID,
        blocker_id: null,
        depends_on_action_id: null,
        title: "fixture second action",
        description: "pending — must not auto-become primary",
        status: "pending" as const,
        due_at: null,
        sort_order: 1,
        created_at: ts,
        updated_at: ts,
      },
    ],
    decisions: [],
    hypotheses: [],
    reference_docs: [],
    observations: [],
    judgments: [],
    goal_edges: [],
    reality_entities: [],
    reality_events: [],
    reality_states: [],
    epistemic_observations: [],
    evidence: [],
    claims: [],
    claim_evidence_links: [],
    reference_conditions: [],
    reality_objectives: [],
    objective_requirements: [],
    objective_dependencies: [],
    future_scenarios: [],
    scenario_state_projections: [],
    scenario_likelihood_estimates: [],
    impact_declarations: [],
    impact_measure_declarations: [],
    authority_declarations: [],
    standing_declarations: [],
    mandate_declarations: [],
    authority_delegation_declarations: [],
    authority_contest_declarations: [],
    capability_declarations: [],
    capability_verification_declarations: [],
    capability_availability_declarations: [],
    resource_declarations: [],
    resource_capacity_declarations: [],
    resource_availability_declarations: [],
    intervention_declarations: [],
    intervention_capability_requirement_declarations: [],
    intervention_resource_requirement_declarations: [],
    intervention_permission_declarations: [],
    decision_space_declarations: [],
    decision_option_declarations: [],
    decision_option_actor_candidate_declarations: [],
    reality_decision_declarations: [],
    intervention_intent_declarations: [],
    intervention_commitment_declarations: [],
    intervention_commitment_acceptance_declarations: [],
    intervention_commitment_temporal_term_declarations: [],
    intervention_commitment_conditional_term_declarations: [],
    intervention_resource_commitment_declarations: [],
    intervention_resource_reservation_declarations: [],
    extensions: {},
    updated_at: ts,
  };
}

export const validStatePatchUpsert = {
  schema_version: "0.1.0",
  project_id: PROJECT_ID,
  source: "manual",
  operations: [
    {
      op: "upsert",
      entity: "blocker",
      entity_id: BLOCKER_ID,
      payload: {
        id: BLOCKER_ID,
        project_id: PROJECT_ID,
        goal_id: GOAL_ID,
        title: "State Engine の patch 競合方針が未決",
        description: "楽観ロック vs last-write-wins の選択が必要。",
        severity: "medium",
        status: "open",
        created_at: TS,
        updated_at: TS,
      },
    },
  ],
};

export const validStatePatchStatusChange = {
  schema_version: "0.1.0",
  project_id: PROJECT_ID,
  source: "manual",
  operations: [
    {
      op: "status_change",
      entity: "next_action",
      entity_id: NEXT_ACTION_ID,
      status: "done",
    },
  ],
};
