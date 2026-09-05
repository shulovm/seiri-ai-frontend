export type ExperimentSeedKind =
  | "content"
  | "business"
  | "product"
  | "research"
  | "other";

export type ActionIntent =
  | "quick_check"
  | "decision"
  | "design"
  | "research"
  | "execution"
  | "validation"
  | "deep_work";

export const ACTION_INTENTS: readonly ActionIntent[] = [
  "quick_check",
  "decision",
  "design",
  "research",
  "execution",
  "validation",
  "deep_work",
] as const;

export type ExperimentActionIntentSeed = {
  action_index: number;
  intent: ActionIntent;
  rationale?: string;
};

export type ExperimentSeed = {
  id?: string;
  kind: ExperimentSeedKind;

  title: string;
  summary?: string;
  description: string;

  goal?: string;
  target_output?: string;

  assumptions?: string[];
  constraints?: string[];
  risks?: string[];
  notes?: string[];

  initial_next_actions?: string[];
  initial_decisions?: string[];
  initial_hypotheses?: string[];
  initial_blockers?: string[];

  action_intents?: ExperimentActionIntentSeed[];

  tags?: string[];

  created_at?: string;
};

/** Stored on ProjectState.extensions.intake.action_intents after intake. */
export type ActionIntentRecord = {
  action_id: string;
  action_title: string;
  action_index: number;
  intent: ActionIntent;
  rationale?: string;
  source: "seed";
};
