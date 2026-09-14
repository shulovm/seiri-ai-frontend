import { ValidationError } from "../../errors.js";
import { SCHEMA_VERSION } from "../../types.js";
import type { NextAction, PatchOperation, ProjectState, StatePatch } from "../../types.js";
import { validateStatePatch } from "../../validate.js";
import { dryRunPatch } from "../dry-run.js";
import type { PatchProposal } from "../types.js";
import { isClarification, isPatchProposal } from "../types.js";
import {
  assertApprovedPatchGates,
  assertProposalReviewable,
  assertSelectionRequiredWhenResolvable,
  filterObservationOperations,
  findResolutionResult,
  ReviewBridgeError,
  validateApproveResolutionGates,
  validateSelectionIntegrity,
} from "./review-gates.js";
import type {
  BuildApprovedPatchInput,
  BuildApprovedPatchResult,
  ReviewSelection,
} from "./types.js";

function nowIso(): string {
  return new Date().toISOString();
}

export function assertPatchProposalInput(value: unknown): asserts value is PatchProposal {
  if (isClarification(value as PatchProposal)) {
    throw new ReviewBridgeError("ClarificationResponse is not supported by build-approved-patch");
  }

  if (!isPatchProposal(value)) {
    throw new ReviewBridgeError("Input must be a PatchProposal");
  }
}

export { isPatchProposal } from "../types.js";

export function createImplicitSelection(proposal: PatchProposal): ReviewSelection {
  const event = proposal.semantic_events?.[0];
  if (!event) {
    throw new ReviewBridgeError("proposal.semantic_events is required to build without selection");
  }

  return {
    schema_version: "0.2.3",
    proposal_id: proposal.id,
    project_id: proposal.project_id,
    event_id: event.id,
    reviewer: "human",
    decision: "approve_resolution",
    created_at: nowIso(),
  };
}

function cloneOperation(operation: PatchOperation): PatchOperation {
  // structuredClone preserves the discriminant (entity) and payload shape.
  return structuredClone(operation);
}

function appendHumanReviewNote(
  operations: PatchOperation[],
  note: string | undefined,
  selectedAction: NextAction | undefined
): PatchOperation[] {
  if (!note && !selectedAction) {
    return operations.map(cloneOperation);
  }

  return operations.map((operation) => {
    if (operation.entity !== "observation" || operation.op !== "upsert") {
      return cloneOperation(operation);
    }

    const cloned: Extract<PatchOperation, { entity: "observation" }> = {
      ...operation,
      payload: operation.payload ? { ...operation.payload } : undefined,
    };
    const body =
      typeof cloned.payload?.body === "string" ? cloned.payload.body : "";
    const reviewLines = [
      "---",
      "[human_review]",
      selectedAction
        ? `selected_next_action: ${selectedAction.title} (${selectedAction.id})`
        : undefined,
      note ? `note: ${note}` : undefined,
    ].filter((line): line is string => Boolean(line));

    cloned.payload = {
      ...cloned.payload,
      body: body ? `${body}\n\n${reviewLines.join("\n")}` : reviewLines.join("\n"),
    };

    return cloned;
  });
}

function buildPrimaryNextActionUpdate(
  projectState: ProjectState,
  selectedEntityId: string
): PatchOperation {
  const current = projectState.current_state;

  return {
    op: "upsert",
    entity: "current_state",
    entity_id: current.id,
    payload: {
      id: current.id,
      project_id: projectState.project.id,
      primary_goal_id: current.primary_goal_id,
      primary_next_action_id: selectedEntityId,
      summary: current.summary,
      phase: current.phase,
      confidence: current.confidence,
      updated_at: nowIso(),
    },
  };
}

function buildApprovedOperations(
  proposal: PatchProposal,
  selection: ReviewSelection,
  projectState: ProjectState,
  selectedAction: NextAction | undefined
): PatchOperation[] {
  const sourceOperations = proposal.proposed_patch.operations.map(cloneOperation);

  if (selection.decision === "reject_resolution") {
    return filterObservationOperations(sourceOperations);
  }

  const event = proposal.semantic_events?.find((entry) => entry.id === selection.event_id);
  if (!event) {
    throw new ReviewBridgeError(`event_id not found: ${selection.event_id}`);
  }

  switch (event.type) {
    case "PriorityChanged": {
      const operations = filterObservationOperations(sourceOperations);
      if (!selection.selected_entity_id) {
        throw new ReviewBridgeError("PriorityChanged approve requires selected_entity_id");
      }

      operations.push(
        buildPrimaryNextActionUpdate(projectState, selection.selected_entity_id)
      );
      return operations;
    }
    case "ActionDeferred":
      return appendHumanReviewNote(sourceOperations, selection.note, selectedAction);
    case "CandidateCreated":
      return filterObservationOperations(sourceOperations);
    case "DecisionMade":
      return sourceOperations;
    case "StopRequested":
      throw new ReviewBridgeError("StopRequested is not supported by build-approved-patch");
  }
}

function buildSummary(
  proposal: PatchProposal,
  selection: ReviewSelection,
  patch: StatePatch,
  dryRunValid: boolean
): string {
  const event = proposal.semantic_events?.find((entry) => entry.id === selection.event_id);
  const primaryUpdate = patch.operations.find(
    (operation) =>
      operation.entity === "current_state" &&
      operation.payload &&
      "primary_next_action_id" in operation.payload
  );
  const primaryId =
    primaryUpdate?.entity === "current_state" &&
    typeof primaryUpdate.payload?.primary_next_action_id === "string"
      ? primaryUpdate.payload.primary_next_action_id
      : null;

  return [
    "approved_patch: ok",
    `proposal_id: ${proposal.id}`,
    `project_id: ${proposal.project_id}`,
    `event_type: ${event?.type ?? "unknown"}`,
    `decision: ${selection.decision}`,
    `operations: ${patch.operations.length}`,
    primaryId ? `primary_next_action_id: ${primaryId}` : "primary_next_action_id: unchanged",
    `dry_run: would_apply=${dryRunValid}`,
  ].join("\n");
}

export function buildApprovedPatch(
  input: BuildApprovedPatchInput
): BuildApprovedPatchResult {
  const { proposal, project_state: projectState } = input;

  assertProposalReviewable(proposal);
  assertSelectionRequiredWhenResolvable(proposal, input.selection);

  const selection = input.selection ?? createImplicitSelection(proposal);
  const event = validateSelectionIntegrity(proposal, selection);

  if (selection.decision === "clarify") {
    return {
      type: "clarification",
      reason: "reviewer requested clarification; approved patch was not generated",
      questions: [
        "候補の意味をもう少し具体化できますか？",
        "別の next_action を指していますか？",
      ],
      proposal_id: proposal.id,
      review_selection: selection,
    };
  }

  const gatesPassed: string[] = [
    "proposal_reviewable",
    "selection_integrity",
  ];

  const selectedAction = validateApproveResolutionGates(
    proposal,
    selection,
    projectState,
    event
  );

  if (selection.decision === "approve_resolution") {
    gatesPassed.push("approve_resolution_gates");
    if (findResolutionResult(proposal, selection.event_id)) {
      gatesPassed.push("resolution_candidate_verified");
    }
  }

  const operations = buildApprovedOperations(
    proposal,
    selection,
    projectState,
    selectedAction
  );

  if (operations.length === 0) {
    throw new ReviewBridgeError("approved patch must contain at least one operation");
  }

  const approvedPatch: StatePatch = {
    schema_version: SCHEMA_VERSION,
    project_id: proposal.project_id,
    source: "human_review",
    operations,
  };

  assertApprovedPatchGates(approvedPatch, event.type, selection.decision);
  gatesPassed.push("approved_patch_gates");

  const validation = validateStatePatch(approvedPatch);
  if (!validation.valid) {
    throw new ValidationError("Invalid approved patch", validation.errors);
  }
  gatesPassed.push("validateStatePatch");

  const dryRunResult = dryRunPatch(projectState, approvedPatch);
  if (!dryRunResult.would_apply) {
    throw new ReviewBridgeError("Dry-run applyPatch failed", dryRunResult.errors);
  }
  gatesPassed.push("dryRunPatch");

  return {
    type: "approved_patch",
    approved_patch: approvedPatch,
    summary: buildSummary(proposal, selection, approvedPatch, dryRunResult.would_apply),
    semantic_event_type: event.type,
    gates_passed: gatesPassed,
  };
}
