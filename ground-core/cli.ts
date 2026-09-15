#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  GroundCoreError,
  NotFoundError,
  PatchError,
  ValidationError,
} from "./errors.js";
import {
  listProjects,
  loadProject,
  saveProject,
  type FileStoreOptions,
} from "./file-store.js";
import { ProposalBuildError, runPropose, type ProposeExtractor } from "./extraction/propose.js";
import {
  buildApprovedPatch,
  assertPatchProposalInput,
} from "./extraction/review/build-approved-patch.js";
import { ReviewBridgeError } from "./extraction/review/review-gates.js";
import type { ReviewSelection } from "./extraction/review/types.js";
import {
  DirectorEngineError,
  hasEligiblePrimaryRecommendation,
  ruleDirector,
} from "./director/rule-director.js";
import {
  hasEligiblePortfolioPrimary,
  PortfolioDirectorError,
  rulePortfolioDirector,
} from "./director/portfolio-director.js";
import type {
  PortfolioBriefType,
  PortfolioDirectorOptions,
  PortfolioReport,
} from "./director/portfolio-types.js";
import type { StudioBriefType } from "./studio/brief-types.js";
import {
  formatStudioBriefJson,
  formatStudioBriefText,
  runStudioBriefPipeline,
  type StudioBriefPipelineResult,
} from "./studio/studio-brief.js";
import type { ExtractionResult, PatchProposal } from "./extraction/types.js";
import { isClarification } from "./extraction/types.js";
import { createProjectFromExperimentSeed } from "./intake/create-project-from-seed.js";
import { validateExperimentSeed } from "./intake/validate-seed.js";
import { buildCompleteActionPatch } from "./session/build-complete-action-patch.js";
import { formatBuildCompleteActionPatchPreview } from "./session/preview-formatters.js";
import type { BuildCompleteActionPatchResult } from "./session/types.js";
import { applyPatch, createEmptyProject } from "./state-engine.js";
import type { ProjectState, StatePatch } from "./types.js";
import { validateStatePatch } from "./validate.js";
import { applyRealityProposal, RealityApplyError } from "./reality/apply.js";
import { proposeFromReality } from "./reality/propose.js";
import type { RealityApplyResult, RealityProposeResult } from "./reality/types.js";
import { proposeReconcile } from "./reconcile/propose.js";
import type {
  ReconcileProposeInput,
  ReconcileProposeResult,
} from "./reconcile/types.js";

export interface CliRuntimeOptions {
  storageDir?: string;
  writeOut?: (message: string) => void;
  writeErr?: (message: string) => void;
}

function fileStoreOptions(options: CliRuntimeOptions): FileStoreOptions {
  return options.storageDir ? { storageDir: options.storageDir } : {};
}

function parseFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function formatError(error: unknown): string {
  if (error instanceof ValidationError) {
    const details =
      error.details === undefined
        ? ""
        : `\n${JSON.stringify(error.details, null, 2)}`;
    return `Validation error: ${error.message}${details}`;
  }

  if (error instanceof PatchError) {
    const details =
      error.details === undefined
        ? ""
        : `\n${JSON.stringify(error.details, null, 2)}`;
    return `Patch error: ${error.message}${details}`;
  }

  if (error instanceof NotFoundError) {
    return error.message;
  }

  if (error instanceof GroundCoreError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function cmdNewId(): string {
  return randomUUID();
}

export function cmdInit(args: string[], options: CliRuntimeOptions = {}): string {
  const title = parseFlag(args, "--title") ?? "Untitled Project";
  const state = createEmptyProject({ title });
  saveProject(state, fileStoreOptions(options));
  return state.project.id;
}

export function cmdList(
  args: string[],
  options: CliRuntimeOptions = {}
): string[] {
  if (args.length > 0) {
    throw new Error("Usage: ground-core list");
  }

  const storeOptions = fileStoreOptions(options);
  const projectIds = listProjects(storeOptions);

  if (projectIds.length === 0) {
    return ["(no projects)"];
  }

  return projectIds.map((projectId) => {
    const state = loadProject(projectId, storeOptions);
    return [
      state.project.id,
      state.project.status,
      state.updated_at,
      state.project.title,
    ].join("\t");
  });
}

export function cmdShow(
  projectId: string | undefined,
  options: CliRuntimeOptions = {}
): string {
  if (!projectId) {
    throw new Error("Usage: ground-core show <project_id>");
  }

  const state = loadProject(projectId, fileStoreOptions(options));
  return `${JSON.stringify(state, null, 2)}\n`;
}

function readInputText(args: string[]): string {
  const text = parseFlag(args, "--text");
  const file = parseFlag(args, "--file");

  if (text && file) {
    throw new Error("Use either --text or --file, not both");
  }

  if (text) {
    return text.trim();
  }

  if (file) {
    return readFileSync(file, "utf8").trim();
  }

  throw new Error("Usage: ground-core propose <project_id> --text <text> | --file <path>");
}

function parseExtractor(args: string[]): ProposeExtractor {
  const value = parseFlag(args, "--extractor");
  if (!value || value === "semantic") {
    return "semantic";
  }

  if (value === "mock") {
    return "mock";
  }

  throw new Error('Usage: --extractor must be "semantic" or "mock"');
}

export function cmdPropose(
  args: string[],
  options: CliRuntimeOptions = {}
): ExtractionResult {
  const projectId = args[0];
  if (!projectId) {
    throw new Error(
      "Usage: ground-core propose <project_id> --text <text> | --file <path> [--extractor semantic|mock]"
    );
  }

  const inputText = readInputText(args.slice(1));
  if (!inputText) {
    throw new Error("Input text is empty");
  }

  const extractor = parseExtractor(args.slice(1));
  const storeOptions = fileStoreOptions(options);
  const projectState = loadProject(projectId, storeOptions);

  return runPropose(
    {
      project_id: projectId,
      input_text: inputText,
      project_state: projectState,
    },
    extractor
  );
}

function parseRealitySource(
  args: string[]
): "manual" | "field_test" | "conversation" | "system" {
  const value = parseFlag(args, "--source") ?? "manual";
  if (
    value === "manual" ||
    value === "field_test" ||
    value === "conversation" ||
    value === "system"
  ) {
    return value;
  }

  throw new Error(
    'Usage: --source must be "manual", "field_test", "conversation", or "system"'
  );
}

function readRealityInputText(args: string[]): string {
  const text = parseFlag(args, "--text");
  const file = parseFlag(args, "--file");

  if (text && file) {
    throw new Error("Use either --text or --file, not both");
  }

  if (text) {
    return text.trim();
  }

  if (file) {
    return readFileSync(file, "utf8").trim();
  }

  throw new Error(
    "Usage: ground-core reality-propose <project_id> --text <text> | --file <path>"
  );
}

export function cmdRealityPropose(
  args: string[],
  options: CliRuntimeOptions = {}
): RealityProposeResult {
  const projectId = args[0];
  if (!projectId) {
    throw new Error(
      "Usage: ground-core reality-propose <project_id> --text <text> | --file <path> [--source manual|field_test|conversation|system] [--extractor canonical|semantic|mock] [--out <path>]"
    );
  }

  const rest = args.slice(1);
  const inputText = readRealityInputText(rest);
  if (!inputText) {
    throw new Error("Reality event input text is empty");
  }

  const storeOptions = fileStoreOptions(options);
  const projectState = loadProject(projectId, storeOptions);

  return proposeFromReality(
    projectState,
    {
      project_id: projectId,
      input_text: inputText,
      source: parseRealitySource(rest),
    },
    parseFlag(rest, "--extractor") === "canonical" ? "canonical" : parseExtractor(rest)
  );
}

function parseProposalFromFile(path: string): PatchProposal {
  const raw: unknown = JSON.parse(readFileSync(path, "utf8"));

  if (
    typeof raw === "object" &&
    raw !== null &&
    "schema_version" in raw &&
    ((raw as { schema_version?: string }).schema_version === "0.6.0" ||
      (raw as { schema_version?: string }).schema_version === "0.6.1") &&
    "result" in raw &&
    "ground_event" in raw
  ) {
    const wrapped = raw as RealityProposeResult;
    if (isClarification(wrapped.result)) {
      throw new RealityApplyError(
        "Cannot apply ClarificationResponse — resolve clarification first"
      );
    }
    assertPatchProposalInput(wrapped.result);
    return wrapped.result;
  }

  if (
    typeof raw === "object" &&
    raw !== null &&
    "schema_version" in raw &&
    (raw as { schema_version?: string }).schema_version === "0.6.2" &&
    "result" in raw &&
    "operation" in raw
  ) {
    const wrapped = raw as ReconcileProposeResult;
    if (isClarification(wrapped.result)) {
      throw new RealityApplyError(
        "Cannot apply ClarificationResponse — resolve clarification first"
      );
    }
    assertPatchProposalInput(wrapped.result);
    return wrapped.result;
  }

  assertPatchProposalInput(raw);
  return raw;
}

function parseReconcileInput(
  projectId: string,
  args: string[]
): ReconcileProposeInput {
  const op = parseFlag(args, "--op");
  if (!op) {
    throw new Error(
      "Usage: ground-core reconcile-propose <project_id> --op <resolve-blocker|complete-action|set-primary|update-current-state> ..."
    );
  }

  if (op === "resolve-blocker") {
    const blockerId = parseFlag(args, "--blocker-id");
    const evidence = parseFlag(args, "--evidence");
    if (!blockerId || !evidence) {
      throw new Error(
        "Usage: ground-core reconcile-propose <project_id> --op resolve-blocker --blocker-id <id> --evidence <text> [--reason <text>]"
      );
    }
    return {
      kind: "resolve_blocker",
      project_id: projectId,
      blocker_id: blockerId,
      evidence,
      reason: parseFlag(args, "--reason"),
    };
  }

  if (op === "complete-action") {
    const actionId = parseFlag(args, "--action-id");
    if (!actionId) {
      throw new Error(
        "Usage: ground-core reconcile-propose <project_id> --op complete-action --action-id <id>"
      );
    }
    return {
      kind: "complete_action",
      project_id: projectId,
      action_id: actionId,
    };
  }

  if (op === "set-primary") {
    const actionId = parseFlag(args, "--action-id");
    const newTitle = parseFlag(args, "--new-action-title");
    if (actionId && newTitle) {
      throw new Error(
        "set-primary: use either --action-id or --new-action-title, not both"
      );
    }
    if (actionId) {
      return {
        kind: "set_primary",
        project_id: projectId,
        action_id: actionId,
      };
    }
    if (newTitle) {
      return {
        kind: "set_primary",
        project_id: projectId,
        new_action: {
          title: newTitle,
          description: parseFlag(args, "--new-action-description"),
        },
      };
    }
    throw new Error(
      "Usage: ground-core reconcile-propose <project_id> --op set-primary (--action-id <id> | --new-action-title <title> [--new-action-description <text>])"
    );
  }

  if (op === "update-current-state") {
    const summary = parseFlag(args, "--summary");
    const phase = parseFlag(args, "--phase");
    if (!summary && !phase) {
      throw new Error(
        "Usage: ground-core reconcile-propose <project_id> --op update-current-state [--summary <text>] [--phase <text>] (at least one required)"
      );
    }
    return {
      kind: "update_current_state",
      project_id: projectId,
      summary,
      phase,
    };
  }

  throw new Error(
    `Unknown reconcile --op: ${op}. Expected resolve-blocker|complete-action|set-primary|update-current-state`
  );
}

export function cmdReconcilePropose(
  args: string[],
  options: CliRuntimeOptions = {}
): ReconcileProposeResult {
  const projectId = args[0];
  if (!projectId) {
    throw new Error(
      "Usage: ground-core reconcile-propose <project_id> --op <resolve-blocker|complete-action|set-primary|update-current-state> ..."
    );
  }

  const storeOptions = fileStoreOptions(options);
  const projectState = loadProject(projectId, storeOptions);
  const input = parseReconcileInput(projectId, args.slice(1));
  return proposeReconcile(projectState, input);
}

export function cmdRealityApply(
  args: string[],
  options: CliRuntimeOptions = {}
): RealityApplyResult {
  const projectId = args[0];
  const proposalPath = parseFlag(args.slice(1), "--proposal");

  if (!projectId || !proposalPath) {
    throw new Error(
      "Usage: ground-core reality-apply <project_id> --proposal <proposal_or_reality_propose_json_path>"
    );
  }

  const proposal = parseProposalFromFile(proposalPath);

  return applyRealityProposal(
    {
      project_id: projectId,
      proposal,
    },
    fileStoreOptions(options)
  );
}

export function cmdBuildApprovedPatch(
  args: string[],
  options: CliRuntimeOptions = {}
): ReturnType<typeof buildApprovedPatch> {
  const proposalPath = parseFlag(args, "--proposal");
  if (!proposalPath) {
    throw new Error(
      "Usage: ground-core build-approved-patch --proposal <proposal_json_path> [--selection <review_selection_json_path>] [--out <approved_patch_json_path>]"
    );
  }

  const selectionPath = parseFlag(args, "--selection");
  const proposalRaw: unknown = JSON.parse(readFileSync(proposalPath, "utf8"));
  assertPatchProposalInput(proposalRaw);

  let selection: ReviewSelection | undefined;
  if (selectionPath) {
    selection = JSON.parse(readFileSync(selectionPath, "utf8")) as ReviewSelection;
  }

  const storeOptions = fileStoreOptions(options);
  const projectState = loadProject(proposalRaw.project_id, storeOptions);

  return buildApprovedPatch({
    proposal: proposalRaw,
    selection,
    project_state: projectState,
  });
}

function parseProjectIdsFlag(args: string[]): string[] | undefined {
  const value = parseFlag(args, "--projects");
  if (!value) {
    return undefined;
  }

  const ids = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  if (ids.length === 0) {
    throw new Error("--projects must include at least one project_id");
  }

  return ids;
}

export function cmdRecommendPortfolio(
  args: string[],
  options: CliRuntimeOptions = {}
): PortfolioReport {
  const storeOptions = fileStoreOptions(options);
  const projectIds = parseProjectIdsFlag(args) ?? listProjects(storeOptions);

  if (projectIds.length === 0) {
    throw new Error("No projects found for recommend-portfolio");
  }

  const projectStates = projectIds.map((projectId) => loadProject(projectId, storeOptions));
  const directorReports = projectStates.map((projectState) =>
    ruleDirector.recommend({ project_state: projectState })
  );

  return rulePortfolioDirector.recommendPortfolio({
    project_states: projectStates,
    director_reports: directorReports,
    options: buildPortfolioDirectorOptions(args, projectIds, options),
  });
}

export function cmdRecommend(
  args: string[],
  options: CliRuntimeOptions = {}
): ReturnType<typeof ruleDirector.recommend> {
  const projectId = args[0];
  if (!projectId) {
    throw new Error(
      "Usage: ground-core recommend <project_id> [--format text|json] [--out <report_json_path>]"
    );
  }

  const storeOptions = fileStoreOptions(options);
  const projectState = loadProject(projectId, storeOptions);

  return ruleDirector.recommend({ project_state: projectState });
}

function parseBriefType(args: string[]): StudioBriefType {
  const value = parseFlag(args, "--type") ?? "morning";

  if (value === "morning" || value === "session" || value === "deep-work") {
    return value;
  }

  throw new Error('Usage: --type must be "morning", "session", or "deep-work"');
}

function parsePortfolioBriefType(args: string[]): PortfolioBriefType {
  return parseBriefType(args);
}

export function buildPortfolioDirectorOptions(
  args: string[],
  projectIds: string[],
  options: CliRuntimeOptions = {}
): PortfolioDirectorOptions {
  const writeErr = options.writeErr ?? ((message: string) => console.error(message));
  const briefType = parsePortfolioBriefType(args);
  const focusProjectId = parseFlag(args, "--focus-project");

  if (focusProjectId && briefType !== "session") {
    writeErr("Warning: --focus-project is only applied in session mode");
  }

  if (focusProjectId && !projectIds.includes(focusProjectId)) {
    throw new Error(
      `--focus-project ${focusProjectId} is not included in --projects (${projectIds.join(", ")})`
    );
  }

  return {
    brief_type: briefType,
    session_focus_project_id:
      briefType === "session" ? focusProjectId : undefined,
  };
}

export function cmdStudioBrief(
  args: string[],
  options: CliRuntimeOptions = {}
): StudioBriefPipelineResult {
  const storeOptions = fileStoreOptions(options);
  const projectIds = parseProjectIdsFlag(args) ?? listProjects(storeOptions);

  if (projectIds.length === 0) {
    throw new Error("No projects found for studio-brief");
  }

  const projectStates = projectIds.map((projectId) => loadProject(projectId, storeOptions));
  const portfolioOptions = buildPortfolioDirectorOptions(args, projectIds, options);

  return runStudioBriefPipeline({
    project_states: projectStates,
    brief_type: portfolioOptions.brief_type ?? "morning",
    session_focus_project_id: portfolioOptions.session_focus_project_id,
  });
}

export interface IntakeResult {
  project_id: string;
  title: string;
  primary_next_action_title: string;
  saved: boolean;
  state: ProjectState;
}

function parseIntakeFormat(args: string[]): "json" | "text" {
  const value = parseFlag(args, "--format") ?? "text";

  if (value === "text" || value === "json") {
    return value;
  }

  throw new Error('Usage: --format must be "text" or "json"');
}

function formatIntakeText(result: IntakeResult): string {
  return [
    `project_id: ${result.project_id}`,
    `title: ${result.title}`,
    `primary next action: ${result.primary_next_action_title}`,
  ].join("\n");
}

export function cmdIntake(
  args: string[],
  options: CliRuntimeOptions = {}
): IntakeResult {
  const seedPath = parseFlag(args, "--file");
  if (!seedPath) {
    throw new Error(
      "Usage: ground-core intake --file <seed_json_path> [--dry-run] [--format text|json]"
    );
  }

  const dryRun = args.includes("--dry-run");
  const format = parseIntakeFormat(args);
  const raw: unknown = JSON.parse(readFileSync(seedPath, "utf8"));
  const seed = validateExperimentSeed(raw);
  const state = createProjectFromExperimentSeed(seed);

  const primaryAction = state.next_actions.find(
    (action) => action.id === state.current_state.primary_next_action_id
  );
  const result: IntakeResult = {
    project_id: state.project.id,
    title: state.project.title,
    primary_next_action_title: primaryAction?.title ?? "(none)",
    saved: !dryRun,
    state,
  };

  const writeOut = options.writeOut ?? ((message: string) => console.log(message));

  if (dryRun) {
    if (format === "json") {
      writeOut(`${JSON.stringify(state, null, 2)}\n`.trimEnd());
    } else {
      writeOut(formatIntakeText(result));
    }
    return result;
  }

  saveProject(state, fileStoreOptions(options));

  if (format === "json") {
    writeOut(`${JSON.stringify(state, null, 2)}\n`.trimEnd());
  } else {
    writeOut(formatIntakeText(result));
  }

  return result;
}

function parseBuildCompleteActionFormat(args: string[]): "json" | "text" {
  const value = parseFlag(args, "--format") ?? "text";

  if (value === "text" || value === "json") {
    return value;
  }

  throw new Error('Usage: --format must be "text" or "json"');
}

export function cmdBuildCompleteActionPatch(
  args: string[],
  options: CliRuntimeOptions = {}
): BuildCompleteActionPatchResult {
  const projectId = args[0];
  const actionId = parseFlag(args.slice(1), "--action");

  if (!projectId || !actionId) {
    throw new Error(
      "Usage: ground-core build-complete-action-patch <project_id> --action <action_id> [--decision-title <title>] [--decision-rationale <text>] [--observation-title <title>] [--observation-body <text>] [--summary <text>] [--next-action <action_id>] [--out <patch_json_path>] [--format text|json]"
    );
  }

  const storeOptions = fileStoreOptions(options);
  const state = loadProject(projectId, storeOptions);
  const flagArgs = args.slice(1);
  const format = parseBuildCompleteActionFormat(flagArgs);
  const outPath = parseFlag(flagArgs, "--out");

  const result = buildCompleteActionPatch(state, {
    action_id: actionId,
    decision_title: parseFlag(flagArgs, "--decision-title"),
    decision_rationale: parseFlag(flagArgs, "--decision-rationale"),
    observation_title: parseFlag(flagArgs, "--observation-title"),
    observation_body: parseFlag(flagArgs, "--observation-body"),
    summary: parseFlag(flagArgs, "--summary"),
    next_action_id: parseFlag(flagArgs, "--next-action"),
  });

  const json = `${JSON.stringify(result.patch, null, 2)}\n`;
  const writeOut = options.writeOut ?? ((message: string) => console.log(message));

  if (outPath) {
    writeFileSync(outPath, json, "utf8");
  }

  if (format === "json") {
    if (!outPath) {
      writeOut(json.trimEnd());
    }
  } else {
    writeOut(formatBuildCompleteActionPatchPreview(result, outPath));
  }

  return result;
}

export function cmdPatch(
  args: string[],
  options: CliRuntimeOptions = {}
): { project_id: string; updated_at: string } {
  const projectId = args[0];
  const patchFile = parseFlag(args.slice(1), "--file");

  if (!projectId || !patchFile) {
    throw new Error("Usage: ground-core patch <project_id> --file <patch_json_path>");
  }

  const storeOptions = fileStoreOptions(options);
  const raw = readFileSync(patchFile, "utf8");
  const parsed: unknown = JSON.parse(raw);
  const patchValidation = validateStatePatch(parsed);

  if (!patchValidation.valid) {
    throw new ValidationError("Invalid patch file", patchValidation.errors);
  }

  const patch = parsed as StatePatch;
  const current = loadProject(projectId, storeOptions);
  const next = applyPatch(current, patch);
  saveProject(next, storeOptions);

  return {
    project_id: next.project.id,
    updated_at: next.updated_at,
  };
}

export function runCli(
  argv: string[],
  options: CliRuntimeOptions = {}
): number {
  const writeOut = options.writeOut ?? ((message: string) => console.log(message));
  const writeErr = options.writeErr ?? ((message: string) => console.error(message));

  const [command, ...rest] = argv;

  if (!command) {
    writeErr(formatUsage());
    return 1;
  }

  try {
    switch (command) {
      case "init": {
        const projectId = cmdInit(rest, options);
        writeOut(projectId);
        return 0;
      }
      case "list": {
        for (const line of cmdList(rest, options)) {
          writeOut(line);
        }
        return 0;
      }
      case "show": {
        writeOut(cmdShow(rest[0], options));
        return 0;
      }
      case "patch": {
        const result = cmdPatch(rest, options);
        writeOut(`project_id: ${result.project_id}`);
        writeOut(`updated_at: ${result.updated_at}`);
        return 0;
      }
      case "new-id": {
        writeOut(cmdNewId());
        return 0;
      }
      case "propose": {
        const outPath = parseFlag(rest.slice(1), "--out");
        const result = cmdPropose(rest, options);
        const json = `${JSON.stringify(result, null, 2)}\n`;

        if (outPath) {
          writeFileSync(outPath, json, "utf8");
        }

        writeOut(json.trimEnd());

        if (isClarification(result)) {
          return 1;
        }

        return 0;
      }
      case "reality-propose": {
        const outPath = parseFlag(rest.slice(1), "--out");
        const result = cmdRealityPropose(rest, options);
        const json = `${JSON.stringify(result, null, 2)}\n`;

        if (outPath) {
          writeFileSync(outPath, json, "utf8");
        }

        writeOut(json.trimEnd());

        if (isClarification(result.result)) {
          return 1;
        }

        return 0;
      }
      case "reality-apply": {
        const result = cmdRealityApply(rest, options);
        writeOut(`project_id: ${result.project_id}`);
        writeOut(`proposal_id: ${result.proposal_id}`);
        writeOut(`updated_at: ${result.updated_at}`);
        writeOut(`observations: ${result.observation_count_before} → ${result.observation_count_after}`);
        writeOut(result.next_hint);
        return 0;
      }
      case "reconcile-propose": {
        const outPath = parseFlag(rest.slice(1), "--out");
        const result = cmdReconcilePropose(rest, options);
        const json = `${JSON.stringify(result, null, 2)}\n`;

        if (outPath) {
          writeFileSync(outPath, json, "utf8");
        }

        writeOut(json.trimEnd());

        if (isClarification(result.result)) {
          return 1;
        }

        return 0;
      }
      case "reconcile-apply": {
        // PatchProposal 互換 — 既存 reality-apply / applyPatch / saveProject を再利用
        const result = cmdRealityApply(rest, options);
        writeOut(`project_id: ${result.project_id}`);
        writeOut(`proposal_id: ${result.proposal_id}`);
        writeOut(`updated_at: ${result.updated_at}`);
        writeOut(`observations: ${result.observation_count_before} → ${result.observation_count_after}`);
        writeOut(result.next_hint);
        return 0;
      }
      case "build-approved-patch": {
        const outPath = parseFlag(rest, "--out");
        const result = cmdBuildApprovedPatch(rest, options);

        if (result.type === "clarification") {
          writeOut(`${JSON.stringify(result, null, 2)}\n`.trimEnd());
          return 1;
        }

        writeOut(result.summary);
        const json = `${JSON.stringify(result.approved_patch, null, 2)}\n`;

        if (outPath) {
          writeFileSync(outPath, json, "utf8");
        }

        writeOut(json.trimEnd());
        return 0;
      }
      case "recommend": {
        const outPath = parseFlag(rest.slice(1), "--out");
        const format = parseFlag(rest.slice(1), "--format") ?? "text";
        const report = cmdRecommend(rest, options);
        const json = `${JSON.stringify(report, null, 2)}\n`;

        if (outPath) {
          writeFileSync(outPath, json, "utf8");
        }

        if (format === "json") {
          writeOut(json.trimEnd());
        } else {
          writeOut(report.summary_text);
        }

        if (!hasEligiblePrimaryRecommendation(report)) {
          return 1;
        }

        return 0;
      }
      case "recommend-portfolio": {
        const outPath = parseFlag(rest, "--out");
        const format = parseFlag(rest, "--format") ?? "text";
        const report = cmdRecommendPortfolio(rest, options);
        const json = `${JSON.stringify(report, null, 2)}\n`;

        if (outPath) {
          writeFileSync(outPath, json, "utf8");
        }

        if (format === "json") {
          writeOut(json.trimEnd());
        } else {
          writeOut(report.summary_text);
        }

        if (!hasEligiblePortfolioPrimary(report)) {
          return 1;
        }

        return 0;
      }
      case "studio-brief": {
        const outPath = parseFlag(rest, "--out");
        const format = parseFlag(rest, "--format") ?? "text";
        const result = cmdStudioBrief(rest, options);
        const json = `${formatStudioBriefJson(result)}\n`;

        if (outPath) {
          writeFileSync(outPath, json, "utf8");
        }

        if (format === "json") {
          writeOut(json.trimEnd());
        } else {
          writeOut(
            formatStudioBriefText(
              result.brief,
              result.narrative,
              result.display_brief.brief_type
            )
          );
        }

        return 0;
      }
      case "intake": {
        cmdIntake(rest, { ...options, writeOut });
        return 0;
      }
      case "build-complete-action-patch": {
        cmdBuildCompleteActionPatch(rest, { ...options, writeOut });
        return 0;
      }
      default:
        writeErr(`Unknown command: ${command}\n\n${formatUsage()}`);
        return 1;
    }
  } catch (error) {
    writeErr(formatError(error));

    if (error instanceof ProposalBuildError) {
      return 2;
    }

    if (error instanceof ReviewBridgeError) {
      return 2;
    }

    if (error instanceof DirectorEngineError) {
      return 1;
    }

    if (error instanceof PortfolioDirectorError) {
      return 2;
    }

    if (error instanceof RealityApplyError) {
      return 1;
    }

    return 1;
  }
}

function formatUsage(): string {
  return [
    "GROUND Core v0.4 CLI",
    "",
    "Usage:",
    "  ground-core init [--title <title>]",
    "  ground-core new-id",
    "  ground-core list",
    "  ground-core show <project_id>",
    "  ground-core propose <project_id> --text <text> [--extractor semantic|mock] [--out <proposal_json_path>]",
    "  ground-core propose <project_id> --file <input_txt_path> [--extractor semantic|mock] [--out <proposal_json_path>]",
    "  ground-core reality-propose <project_id> --text <text> [--source manual|field_test|conversation|system] [--extractor canonical|semantic|mock] [--out <path>]",
    "  ground-core reality-propose <project_id> --file <input_txt_path> [--source manual|field_test|conversation|system] [--extractor canonical|semantic|mock] [--out <path>]",
    "  ground-core reality-apply <project_id> --proposal <proposal_or_reality_propose_json_path>",
    "  ground-core reconcile-propose <project_id> --op resolve-blocker --blocker-id <id> --evidence <text> [--reason <text>] [--out <path>]",
    "  ground-core reconcile-propose <project_id> --op complete-action --action-id <id> [--out <path>]",
    "  ground-core reconcile-propose <project_id> --op set-primary (--action-id <id> | --new-action-title <title> [--new-action-description <text>]) [--out <path>]",
    "  ground-core reconcile-propose <project_id> --op update-current-state [--summary <text>] [--phase <text>] [--out <path>]",
    "  ground-core reconcile-apply <project_id> --proposal <reconcile_propose_json_path>",
    "  ground-core build-approved-patch --proposal <proposal_json_path> [--selection <review_selection_json_path>] [--out <approved_patch_json_path>]",
    "  ground-core recommend <project_id> [--format text|json] [--out <report_json_path>]",
    "  ground-core recommend-portfolio [--projects <id>[,id...]] [--type morning|session|deep-work] [--focus-project <project_id>] [--format text|json] [--out <report_json_path>]",
    "  ground-core studio-brief [--projects <id>[,id...]] [--type morning|session|deep-work] [--focus-project <project_id>] [--format text|json] [--out <brief_json_path>]",
    "  ground-core patch <project_id> --file <patch_json_path>",
    "  ground-core intake --file <seed_json_path> [--dry-run] [--format text|json]",
    "  ground-core build-complete-action-patch <project_id> --action <action_id> [--decision-title <title>] [--decision-rationale <text>] [--observation-title <title>] [--observation-body <text>] [--summary <text>] [--next-action <action_id>] [--out <patch_json_path>] [--format text|json]",
  ].join("\n");
}

const executedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (executedDirectly) {
  process.exitCode = runCli(process.argv.slice(2));
}
