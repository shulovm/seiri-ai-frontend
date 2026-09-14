import { randomUUID } from "node:crypto";
import { ValidationError } from "../errors.js";
import { dryRunPatch } from "../extraction/dry-run.js";
import {
  assertSafePatch,
  PROPOSE_CONFIDENCE_THRESHOLD,
} from "../extraction/mock-extractor.js";
import { ProposalBuildError } from "../extraction/propose.js";
import type {
  ClarificationResponse,
  PatchProposal,
} from "../extraction/types.js";
import { validateProjectState, validateStatePatch } from "../validate.js";
import { applyPatch } from "../state-engine.js";
import type { NextAction, PatchOperation, ProjectState, StatePatch } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import type {
  CompleteActionInput,
  ReconcileProposeInput,
  ReconcileProposeResult,
  ResolveBlockerInput,
  SetPrimaryExistingInput,
  SetPrimaryNewInput,
  UpdateCurrentStateInput,
} from "./types.js";

const COMPLETABLE = new Set<NextAction["status"]>(["pending", "in_progress"]);
const PRIMARY_ELIGIBLE = new Set<NextAction["status"]>(["pending", "in_progress"]);

function nowIso(): string {
  return new Date().toISOString();
}

function clarification(
  projectId: string,
  inputText: string,
  reason: string,
  questions: string[]
): ClarificationResponse {
  return {
    type: "clarification",
    project_id: projectId,
    input_text: inputText,
    reason,
    questions,
    risk_level: "medium",
    created_at: nowIso(),
  };
}

function buildProposal(
  projectId: string,
  inputText: string,
  summary: string,
  operations: PatchOperation[],
  state: ProjectState,
  risk: PatchProposal["risk_level"] = "medium"
): PatchProposal {
  const patch: StatePatch = {
    schema_version: SCHEMA_VERSION,
    project_id: projectId,
    source: "manual",
    operations,
  };

  assertSafePatch(patch);

  const validation = validateStatePatch(patch);
  if (!validation.valid) {
    throw new ProposalBuildError("Invalid reconcile patch", validation.errors);
  }

  const dryRunResult = dryRunPatch(state, patch);
  if (!dryRunResult.would_apply) {
    throw new ProposalBuildError(
      "Reconcile dry-run applyPatch failed",
      dryRunResult.errors
    );
  }

  const simulated = applyPatch(state, patch);
  const stateValidation = validateProjectState(simulated);
  if (!stateValidation.valid) {
    throw new ProposalBuildError(
      "Reconcile patch fails ProjectState validation",
      stateValidation.errors
    );
  }

  return {
    id: randomUUID(),
    project_id: projectId,
    input_text: inputText,
    summary,
    confidence: Math.max(PROPOSE_CONFIDENCE_THRESHOLD, 0.95),
    risk_level: risk,
    proposed_patch: patch,
    dry_run_result: dryRunResult,
    requires_human_approval: true,
    created_at: nowIso(),
  };
}

function wrap(
  operation: ReconcileProposeResult["operation"],
  result: PatchProposal | ClarificationResponse
): ReconcileProposeResult {
  return {
    schema_version: "0.6.2",
    operation,
    result,
    project_state_mutated: false,
    requires_human_apply: true,
    requires_human_decision: true,
  };
}

function proposeResolveBlocker(
  state: ProjectState,
  input: ResolveBlockerInput
): ReconcileProposeResult {
  const evidence = input.evidence.trim();
  if (!evidence) {
    throw new ValidationError("resolve_blocker requires non-empty evidence");
  }

  const blocker = state.blockers.find((entry) => entry.id === input.blocker_id);
  if (!blocker) {
    throw new ValidationError(`blocker not found: ${input.blocker_id}`);
  }

  const inputText = `reconcile resolve-blocker ${input.blocker_id}: ${evidence}`;

  if (blocker.status === "resolved") {
    return wrap(
      "resolve_blocker",
      clarification(
        input.project_id,
        inputText,
        `blocker は既に resolved です: ${blocker.title}`,
        ["別の open blocker を指定しますか？", "この resolve を不要として破棄しますか？"]
      )
    );
  }

  if (blocker.status === "accepted") {
    return wrap(
      "resolve_blocker",
      clarification(
        input.project_id,
        inputText,
        `blocker は accepted です（resolve 対象外）: ${blocker.title}`,
        ["accepted のままにしますか？", "別の blocker を指定しますか？"]
      )
    );
  }

  const now = nowIso();
  const observationId = randomUUID();
  const reason = input.reason?.trim();
  const body = reason
    ? `【blocker resolve】${blocker.title}\n根拠: ${evidence}\n理由: ${reason}`
    : `【blocker resolve】${blocker.title}\n根拠: ${evidence}`;

  const operations: PatchOperation[] = [
    {
      op: "status_change",
      entity: "blocker",
      entity_id: blocker.id,
      status: "resolved",
    },
    {
      op: "upsert",
      entity: "observation",
      entity_id: observationId,
      payload: {
        id: observationId,
        project_id: state.project.id,
        goal_id: blocker.goal_id ?? state.current_state.primary_goal_id,
        title: `Blocker resolved: ${blocker.title}`,
        body,
        source: "manual",
        observed_at: now,
        created_at: now,
        updated_at: now,
      },
    },
  ];

  return wrap(
    "resolve_blocker",
    buildProposal(
      input.project_id,
      inputText,
      `blocker 「${blocker.title}」を resolved にする（人間承認必須）`,
      operations,
      state,
      "high"
    )
  );
}

function proposeCompleteAction(
  state: ProjectState,
  input: CompleteActionInput
): ReconcileProposeResult {
  const action = state.next_actions.find((entry) => entry.id === input.action_id);
  if (!action) {
    throw new ValidationError(`next_action not found: ${input.action_id}`);
  }

  const inputText = `reconcile complete-action ${input.action_id}`;

  if (action.status === "done") {
    return wrap(
      "complete_action",
      clarification(
        input.project_id,
        inputText,
        `action は既に done です: ${action.title}`,
        ["別の pending / in_progress action を指定しますか？"]
      )
    );
  }

  if (action.status === "cancelled") {
    return wrap(
      "complete_action",
      clarification(
        input.project_id,
        inputText,
        `action は cancelled です（complete 対象外）: ${action.title}`,
        ["別の action を指定しますか？"]
      )
    );
  }

  if (!COMPLETABLE.has(action.status)) {
    throw new ValidationError(
      `next_action ${action.id} is not completable (status: ${action.status})`
    );
  }

  const operations: PatchOperation[] = [
    {
      op: "status_change",
      entity: "next_action",
      entity_id: action.id,
      status: "done",
    },
  ];

  const wasPrimary = state.current_state.primary_next_action_id === action.id;
  if (wasPrimary) {
    // 次 primary は自動選定しない。schema 上 null 許可のため未設定にする。
    operations.push({
      op: "upsert",
      entity: "current_state",
      entity_id: state.current_state.id,
      payload: {
        primary_next_action_id: null,
      },
    });
  }

  return wrap(
    "complete_action",
    buildProposal(
      input.project_id,
      inputText,
      wasPrimary
        ? `action 「${action.title}」を done にする（primary は null。次 primary は自動選定しない）`
        : `action 「${action.title}」を done にする（primary は変更しない）`,
      operations,
      state,
      "medium"
    )
  );
}

function proposeSetPrimaryExisting(
  state: ProjectState,
  input: SetPrimaryExistingInput
): ReconcileProposeResult {
  const action = state.next_actions.find((entry) => entry.id === input.action_id);
  if (!action) {
    throw new ValidationError(`next_action not found: ${input.action_id}`);
  }

  const inputText = `reconcile set-primary ${input.action_id}`;

  if (!PRIMARY_ELIGIBLE.has(action.status)) {
    return wrap(
      "set_primary",
      clarification(
        input.project_id,
        inputText,
        `action は primary にできない status です: ${action.title} (${action.status})`,
        ["pending / in_progress の action を指定しますか？", "新しい pending action を作成しますか？"]
      )
    );
  }

  if (state.current_state.primary_next_action_id === action.id) {
    return wrap(
      "set_primary",
      clarification(
        input.project_id,
        inputText,
        `action は既に primary です: ${action.title}`,
        ["別の action を primary にしますか？"]
      )
    );
  }

  const operations: PatchOperation[] = [
    {
      op: "upsert",
      entity: "current_state",
      entity_id: state.current_state.id,
      payload: {
        primary_next_action_id: action.id,
      },
    },
  ];

  return wrap(
    "set_primary",
    buildProposal(
      input.project_id,
      inputText,
      `primary を明示指定: 「${action.title}」（自動 rank なし）`,
      operations,
      state,
      "high"
    )
  );
}

function proposeSetPrimaryNew(
  state: ProjectState,
  input: SetPrimaryNewInput
): ReconcileProposeResult {
  const title = input.new_action.title.trim();
  if (!title) {
    throw new ValidationError("set_primary new action requires non-empty title");
  }

  const inputText = `reconcile set-primary new-action: ${title}`;
  const now = nowIso();
  const actionId = randomUUID();
  const maxSort = state.next_actions.reduce(
    (max, action) => Math.max(max, action.sort_order),
    -1
  );

  const operations: PatchOperation[] = [
    {
      op: "upsert",
      entity: "next_action",
      entity_id: actionId,
      payload: {
        id: actionId,
        project_id: state.project.id,
        goal_id: state.current_state.primary_goal_id,
        blocker_id: null,
        depends_on_action_id: null,
        title,
        description: input.new_action.description?.trim() || null,
        status: "pending",
        due_at: null,
        sort_order: maxSort + 1,
        created_at: now,
        updated_at: now,
      },
    },
    {
      op: "upsert",
      entity: "current_state",
      entity_id: state.current_state.id,
      payload: {
        primary_next_action_id: actionId,
      },
    },
  ];

  return wrap(
    "set_primary",
    buildProposal(
      input.project_id,
      inputText,
      `新規 pending action 「${title}」を作成し primary にする（人間明示・自動 rank なし）`,
      operations,
      state,
      "high"
    )
  );
}

function proposeUpdateCurrentState(
  state: ProjectState,
  input: UpdateCurrentStateInput
): ReconcileProposeResult {
  const summary = input.summary?.trim();
  const phase = input.phase?.trim();

  if (!summary && !phase) {
    throw new ValidationError(
      "update_current_state requires --summary and/or --phase"
    );
  }

  const inputText = [
    "reconcile update-current-state",
    summary ? `summary=${summary}` : null,
    phase ? `phase=${phase}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const payload: Record<string, unknown> = {};
  if (summary) {
    payload.summary = summary;
  }
  if (phase) {
    payload.phase = phase;
  }

  const operations: PatchOperation[] = [
    {
      op: "upsert",
      entity: "current_state",
      entity_id: state.current_state.id,
      payload,
    },
  ];

  return wrap(
    "update_current_state",
    buildProposal(
      input.project_id,
      inputText,
      `current_state を明示更新（${[
        summary ? "summary" : null,
        phase ? "phase" : null,
      ]
        .filter(Boolean)
        .join(", ")}）`,
      operations,
      state,
      "medium"
    )
  );
}

/**
 * State Reconciliation Controls (v0.6.2)
 *
 * Reality（何が起きたか）ではなく、既存 ProjectState の構造整理を
 * 人間明示の単一 operation Proposal として生成する。
 * storage は変更しない。Director ranking は使わない。
 */
export function proposeReconcile(
  state: ProjectState,
  input: ReconcileProposeInput
): ReconcileProposeResult {
  if (state.project.id !== input.project_id) {
    throw new ValidationError(
      `project_id mismatch: input=${input.project_id} state=${state.project.id}`
    );
  }

  switch (input.kind) {
    case "resolve_blocker":
      return proposeResolveBlocker(state, input);
    case "complete_action":
      return proposeCompleteAction(state, input);
    case "set_primary": {
      if ("action_id" in input) {
        return proposeSetPrimaryExisting(
          state,
          input as SetPrimaryExistingInput
        );
      }
      if ("new_action" in input) {
        return proposeSetPrimaryNew(state, input as SetPrimaryNewInput);
      }
      throw new ValidationError(
        "set_primary requires --action-id or --new-action-title"
      );
    }
    case "update_current_state":
      return proposeUpdateCurrentState(state, input);
    default: {
      const _exhaustive: never = input;
      throw new ValidationError(
        `unknown reconcile operation: ${JSON.stringify(_exhaustive)}`
      );
    }
  }
}
