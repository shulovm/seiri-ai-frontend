import { randomUUID } from "node:crypto";
import { ValidationError } from "../errors.js";
import { createEmptyProject } from "../state-engine.js";
import type {
  Blocker,
  Decision,
  Goal,
  Hypothesis,
  NextAction,
  ProjectState,
} from "../types.js";
import { validateProjectState } from "../validate.js";
import type {
  ActionIntentRecord,
  ExperimentSeed,
} from "./types.js";

function nowIso(): string {
  return new Date().toISOString();
}

function buildGoal(projectId: string, goalText: string, now: string): Goal {
  return {
    id: randomUUID(),
    project_id: projectId,
    parent_goal_id: null,
    title: goalText,
    description: goalText,
    status: "active",
    priority: 1,
    sort_order: 0,
    created_at: now,
    updated_at: now,
  };
}

function buildNextActions(
  projectId: string,
  goalId: string | null,
  titles: string[],
  now: string
): NextAction[] {
  const actions: NextAction[] = titles.map((title, index) => ({
    id: randomUUID(),
    project_id: projectId,
    goal_id: goalId,
    blocker_id: null,
    depends_on_action_id: null,
    title,
    description: null,
    status: "pending" as const,
    due_at: null,
    sort_order: index,
    created_at: now,
    updated_at: now,
  }));

  for (let index = 1; index < actions.length; index += 1) {
    actions[index].depends_on_action_id = actions[index - 1].id;
  }

  return actions;
}

function buildBlockers(
  projectId: string,
  goalId: string | null,
  titles: string[],
  now: string
): Blocker[] {
  return titles.map((title) => ({
    id: randomUUID(),
    project_id: projectId,
    goal_id: goalId,
    title,
    description: title,
    severity: "medium" as const,
    status: "open" as const,
    created_at: now,
    updated_at: now,
  }));
}

function buildHypotheses(
  projectId: string,
  goalId: string | null,
  statements: string[],
  now: string
): Hypothesis[] {
  return statements.map((statement) => ({
    id: randomUUID(),
    project_id: projectId,
    goal_id: goalId,
    statement,
    status: "untested" as const,
    evidence_for: [],
    evidence_against: [],
    created_at: now,
    updated_at: now,
  }));
}

function buildDecisions(
  projectId: string,
  goalId: string | null,
  titles: string[],
  now: string
): Decision[] {
  return titles.map((title) => ({
    id: randomUUID(),
    project_id: projectId,
    goal_id: goalId,
    title,
    rationale: title,
    alternatives_considered: [],
    status: "active" as const,
    decided_at: now,
    created_at: now,
    updated_at: now,
  }));
}

function buildActionIntentRecords(
  nextActions: NextAction[],
  seed: ExperimentSeed
): ActionIntentRecord[] | undefined {
  if (!seed.action_intents || seed.action_intents.length === 0) {
    return undefined;
  }

  return seed.action_intents.map((entry) => {
    const action = nextActions[entry.action_index];
    if (!action) {
      throw new ValidationError(
        `action_intents[${entry.action_index}] has no matching next_action`
      );
    }

    return {
      action_id: action.id,
      action_title: action.title,
      action_index: entry.action_index,
      intent: entry.intent,
      ...(entry.rationale ? { rationale: entry.rationale } : {}),
      source: "seed" as const,
    };
  });
}

export function createProjectFromExperimentSeed(seed: ExperimentSeed): ProjectState {
  const now = nowIso();
  const state = createEmptyProject({
    title: seed.title,
    summary: seed.summary ?? seed.description,
  });

  const projectId = state.project.id;
  const tags = [
    "experiment",
    `experiment:${seed.kind}`,
    ...(seed.tags ?? []),
  ];

  state.project.tags = tags;

  const goals: Goal[] = [];
  if (seed.goal) {
    goals.push(buildGoal(projectId, seed.goal, now));
  }

  const goalId = goals[0]?.id ?? null;

  const nextActions = buildNextActions(
    projectId,
    goalId,
    seed.initial_next_actions ?? [],
    now
  );
  const blockers = buildBlockers(
    projectId,
    goalId,
    seed.initial_blockers ?? [],
    now
  );
  const hypotheses = buildHypotheses(
    projectId,
    goalId,
    seed.initial_hypotheses ?? [],
    now
  );
  const decisions = buildDecisions(
    projectId,
    goalId,
    seed.initial_decisions ?? [],
    now
  );

  state.goals = goals;
  state.next_actions = nextActions;
  state.blockers = blockers;
  state.hypotheses = hypotheses;
  state.decisions = decisions;

  state.current_state = {
    ...state.current_state,
    primary_goal_id: goalId,
    primary_next_action_id: nextActions[0]?.id ?? null,
    summary: seed.description,
    phase: "experiment",
    confidence: null,
    updated_at: now,
  };

  const actionIntents = buildActionIntentRecords(nextActions, seed);

  state.extensions = {
    intake: {
      source: "experiment_seed",
      seed_id: seed.id ?? null,
      seed_kind: seed.kind,
      target_output: seed.target_output ?? null,
      assumptions: seed.assumptions ?? [],
      risks: seed.risks ?? [],
      constraints: seed.constraints ?? [],
      notes: seed.notes ?? [],
      created_from: "ground-core/intake",
      seed_created_at: seed.created_at ?? null,
      ...(actionIntents ? { action_intents: actionIntents } : {}),
    },
  };

  state.updated_at = now;
  state.project.updated_at = now;

  const validation = validateProjectState(state);
  if (!validation.valid) {
    throw new ValidationError(
      "createProjectFromExperimentSeed produced invalid ProjectState",
      validation.errors
    );
  }

  return state;
}
