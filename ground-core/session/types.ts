import type { PatchSource, StatePatch } from "../types.js";

export type BuildCompleteActionPatchInput = {
  action_id: string;

  decision_title?: string;
  decision_rationale?: string;

  observation_title?: string;
  observation_body?: string;

  summary?: string;

  next_action_id?: string;

  source?: PatchSource;
  applied_at?: string;
};

export type BuildCompleteActionPatchResult = {
  patch: StatePatch;
  completed_action_title: string;
  next_primary_action_id: string | null;
  next_primary_action_title: string | null;
  operation_count: number;
};
