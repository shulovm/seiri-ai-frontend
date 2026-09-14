import type {
  ClarificationResponse,
  PatchProposal,
} from "../extraction/types.js";

export type ReconcileOperationKind =
  | "resolve_blocker"
  | "complete_action"
  | "set_primary"
  | "update_current_state";

export type ResolveBlockerInput = {
  kind: "resolve_blocker";
  project_id: string;
  blocker_id: string;
  /** 解決根拠。observation として保持する */
  evidence: string;
  reason?: string;
};

export type CompleteActionInput = {
  kind: "complete_action";
  project_id: string;
  action_id: string;
};

export type SetPrimaryExistingInput = {
  kind: "set_primary";
  project_id: string;
  action_id: string;
};

export type SetPrimaryNewInput = {
  kind: "set_primary";
  project_id: string;
  new_action: {
    title: string;
    description?: string;
  };
};

export type UpdateCurrentStateInput = {
  kind: "update_current_state";
  project_id: string;
  summary?: string;
  phase?: string;
};

export type ReconcileProposeInput =
  | ResolveBlockerInput
  | CompleteActionInput
  | SetPrimaryExistingInput
  | SetPrimaryNewInput
  | UpdateCurrentStateInput;

export type ReconcileProposeResult = {
  schema_version: "0.6.2";
  operation: ReconcileOperationKind;
  result: PatchProposal | ClarificationResponse;
  project_state_mutated: false;
  requires_human_apply: true;
  requires_human_decision: true;
};
