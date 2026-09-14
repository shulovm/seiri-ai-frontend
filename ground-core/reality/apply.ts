import { NotFoundError, ValidationError } from "../errors.js";
import { loadProject, saveProject, type FileStoreOptions } from "../file-store.js";
import { isPatchProposal } from "../extraction/types.js";
import { applyPatch } from "../state-engine.js";
import type { StatePatch } from "../types.js";
import { validateStatePatch } from "../validate.js";
import type { RealityApplyInput, RealityApplyResult } from "./types.js";

export class RealityApplyError extends Error {
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "RealityApplyError";
    this.details = details;
  }
}

/**
 * Reality Loop Stage 3:
 * Patch Proposal → 人間による明示的 apply → ProjectState 更新
 *
 * 既存 applyPatch / saveProject のみを使う。別の mutation 機構は作らない。
 */
export function applyRealityProposal(
  input: RealityApplyInput,
  options: FileStoreOptions = {}
): RealityApplyResult {
  if (!isPatchProposal(input.proposal)) {
    throw new RealityApplyError(
      "reality-apply requires a PatchProposal (not clarification / not raw StatePatch)"
    );
  }

  if (input.proposal.project_id !== input.project_id) {
    throw new RealityApplyError(
      `proposal.project_id (${input.proposal.project_id}) does not match target project_id (${input.project_id})`
    );
  }

  if (!input.proposal.requires_human_approval) {
    throw new RealityApplyError("proposal must require human approval");
  }

  const patch: StatePatch = input.proposal.proposed_patch;

  if (patch.project_id !== input.project_id) {
    throw new RealityApplyError(
      `proposed_patch.project_id (${patch.project_id}) does not match target project_id (${input.project_id})`
    );
  }

  const validation = validateStatePatch(patch);
  if (!validation.valid) {
    throw new ValidationError("Invalid proposed patch", validation.errors);
  }

  let current;
  try {
    current = loadProject(input.project_id, options);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new RealityApplyError(
      `Failed to load project ${input.project_id}`,
      error instanceof Error ? error.message : error
    );
  }

  const observationCountBefore = current.observations.length;
  const next = applyPatch(current, patch);
  saveProject(next, options);

  return {
    schema_version: "0.6.0",
    project_id: next.project.id,
    proposal_id: input.proposal.id,
    updated_at: next.updated_at,
    observation_count_before: observationCountBefore,
    observation_count_after: next.observations.length,
    loop_stage: "applied",
    next_hint:
      "ProjectState を更新しました。次に `studio-brief` / `recommend` / `recommend-portfolio` で再評価してください。",
  };
}
