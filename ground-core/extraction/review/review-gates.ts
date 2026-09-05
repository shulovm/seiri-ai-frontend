import type {
  NextAction,
  PatchOperation,
  ProjectState,
  StatePatch,
} from "../../types.js";
import type { ResolutionResult } from "../semantic/resolver-types.js";
import type { SemanticEvent, SemanticEventType } from "../semantic/types.js";
import type { PatchProposal } from "../types.js";
import type { ReviewDecision, ReviewSelection } from "./types.js";

export class ReviewBridgeError extends Error {
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ReviewBridgeError";
    this.details = details;
  }
}

const RESOLUTION_EVENT_TYPES = new Set<SemanticEventType>([
  "PriorityChanged",
  "ActionDeferred",
]);

export function findSemanticEvent(
  proposal: PatchProposal,
  eventId: string
): SemanticEvent {
  const event = proposal.semantic_events?.find((entry) => entry.id === eventId);
  if (!event) {
    throw new ReviewBridgeError(`event_id not found in proposal.semantic_events: ${eventId}`);
  }

  return event;
}

export function findResolutionResult(
  proposal: PatchProposal,
  eventId: string
): ResolutionResult | undefined {
  return proposal.resolution_results?.find((entry) => entry.event_id === eventId);
}

export function assertProposalReviewable(proposal: PatchProposal): void {
  if (proposal.requires_human_approval !== true) {
    throw new ReviewBridgeError("proposal.requires_human_approval must be true");
  }

  if (!proposal.semantic_events?.length) {
    throw new ReviewBridgeError("proposal.semantic_events is required for human review");
  }
}

export function validateSelectionIntegrity(
  proposal: PatchProposal,
  selection: ReviewSelection
): SemanticEvent {
  if (selection.schema_version !== "0.2.3") {
    throw new ReviewBridgeError(`unsupported selection schema_version: ${selection.schema_version}`);
  }

  if (selection.proposal_id !== proposal.id) {
    throw new ReviewBridgeError("selection.proposal_id does not match proposal.id");
  }

  if (selection.project_id !== proposal.project_id) {
    throw new ReviewBridgeError("selection.project_id does not match proposal.project_id");
  }

  if (selection.reviewer !== "human") {
    throw new ReviewBridgeError('selection.reviewer must be "human"');
  }

  const event = findSemanticEvent(proposal, selection.event_id);

  if (event.type === "StopRequested") {
    throw new ReviewBridgeError("StopRequested is not supported by build-approved-patch");
  }

  return event;
}

export function assertSelectionRequiredWhenResolvable(
  proposal: PatchProposal,
  selection: ReviewSelection | undefined
): void {
  if (selection) {
    return;
  }

  if ((proposal.resolution_results?.length ?? 0) > 0) {
    throw new ReviewBridgeError(
      "selection is required when proposal.resolution_results is present"
    );
  }
}

export function validateApproveResolutionGates(
  proposal: PatchProposal,
  selection: ReviewSelection,
  projectState: ProjectState,
  event: SemanticEvent
): NextAction | undefined {
  if (selection.decision !== "approve_resolution") {
    return undefined;
  }

  const resolution = findResolutionResult(proposal, selection.event_id);

  if (resolution || RESOLUTION_EVENT_TYPES.has(event.type)) {
    if (selection.selected_entity_type !== "next_action") {
      throw new ReviewBridgeError(
        "approve_resolution requires selected_entity_type next_action"
      );
    }

    if (!selection.selected_entity_id) {
      throw new ReviewBridgeError("approve_resolution requires selected_entity_id");
    }
  }

  if (!resolution) {
    return undefined;
  }

  if (resolution.ambiguity_level === "high") {
    throw new ReviewBridgeError(
      "approve_resolution is not allowed when ambiguity_level is high"
    );
  }

  const candidate = resolution.candidates.find(
    (entry) => entry.entity_id === selection.selected_entity_id
  );

  if (!candidate) {
    throw new ReviewBridgeError(
      "selected_entity_id is not present in resolution_results candidates"
    );
  }

  const action = projectState.next_actions.find(
    (entry) => entry.id === selection.selected_entity_id
  );

  if (!action) {
    throw new ReviewBridgeError("selected_entity_id not found in project_state.next_actions");
  }

  if (event.type === "PriorityChanged" && action.status !== "pending") {
    throw new ReviewBridgeError(
      "primary_next_action_id update requires selected action status pending"
    );
  }

  return action;
}

export function assertApprovedPatchGates(
  patch: StatePatch,
  eventType: SemanticEventType,
  decision: ReviewDecision
): void {
  for (const operation of patch.operations) {
    if (operation.op === "delete") {
      throw new ReviewBridgeError("Delete operations are not allowed in approved patch");
    }

    if (operation.entity === "project") {
      throw new ReviewBridgeError("Project changes are not allowed in approved patch");
    }

    if (operation.entity === "next_action" && operation.op === "status_change") {
      throw new ReviewBridgeError("Action status changes are not allowed in approved patch");
    }

    if (operation.entity === "blocker" && operation.op === "status_change") {
      throw new ReviewBridgeError("Blocker status changes are not allowed in approved patch");
    }

    const updatesPrimary =
      operation.entity === "current_state" &&
      operation.payload &&
      "primary_next_action_id" in operation.payload;

    if (updatesPrimary) {
      const allowed =
        eventType === "PriorityChanged" && decision === "approve_resolution";

      if (!allowed) {
        throw new ReviewBridgeError(
          "primary_next_action_id update is only allowed for PriorityChanged approve_resolution"
        );
      }
    }
  }
}

export function filterObservationOperations(
  operations: PatchOperation[]
): PatchOperation[] {
  return operations.filter(
    (operation) => operation.entity === "observation" && operation.op === "upsert"
  );
}
