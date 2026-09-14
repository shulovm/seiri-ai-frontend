import type { ProjectState } from "../../types.js";
import type { ResolutionResult } from "./resolver-types.js";
import type { SemanticEvent } from "./types.js";

export const RESOLVABLE_EVENT_TYPES = ["PriorityChanged", "ActionDeferred"] as const;

export type ResolvableEventType = (typeof RESOLVABLE_EVENT_TYPES)[number];

export interface ResolverInput {
  project_state: ProjectState;
  events: SemanticEvent[];
}

export interface EventResolver {
  readonly name: string;
  resolve(input: ResolverInput): ResolutionResult[];
}

export function isResolvableEvent(event: SemanticEvent): boolean {
  if (!RESOLVABLE_EVENT_TYPES.includes(event.type as ResolvableEventType)) {
    return false;
  }

  return (
    event.resolver_hint?.strategy === "semantic_match_next_action" &&
    Boolean(event.resolver_hint.raw_target_span?.trim())
  );
}
