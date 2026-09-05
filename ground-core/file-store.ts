import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NotFoundError, ValidationError } from "./errors.js";
import { normalizeProjectState } from "./migrate.js";
import { SCHEMA_VERSION, type ProjectState } from "./types.js";
import { validateProjectState } from "./validate.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_STORAGE_DIR = join(__dirname, "storage/projects");

export interface FileStoreOptions {
  storageDir?: string;
}

export function getStorageDir(options?: FileStoreOptions): string {
  if (options?.storageDir) {
    return options.storageDir;
  }

  if (process.env.GROUND_CORE_STORAGE_DIR) {
    return process.env.GROUND_CORE_STORAGE_DIR;
  }

  return DEFAULT_STORAGE_DIR;
}

function getProjectPath(projectId: string, options?: FileStoreOptions): string {
  return join(getStorageDir(options), `${projectId}.json`);
}

function ensureStorageDir(options?: FileStoreOptions): string {
  const storageDir = getStorageDir(options);
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }
  return storageDir;
}

export function saveProject(
  projectState: ProjectState,
  options?: FileStoreOptions
): void {
  const normalized = normalizeProjectState(projectState);

  if (normalized.schema_version !== SCHEMA_VERSION) {
    throw new ValidationError(
      `Cannot save ProjectState with schema_version ${normalized.schema_version}`
    );
  }

  const validation = validateProjectState(normalized);
  if (!validation.valid) {
    throw new ValidationError(
      "Cannot save invalid ProjectState",
      validation.errors
    );
  }

  ensureStorageDir(options);
  const path = getProjectPath(normalized.project.id, options);
  writeFileSync(path, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}

export function loadProject(
  projectId: string,
  options?: FileStoreOptions
): ProjectState {
  const path = getProjectPath(projectId, options);

  if (!existsSync(path)) {
    throw new NotFoundError(`Project not found: ${projectId}`);
  }

  const raw = readFileSync(path, "utf8");
  const data: unknown = JSON.parse(raw);

  try {
    return normalizeProjectState(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(
        `Stored project is invalid: ${projectId}`,
        error.details
      );
    }
    throw error;
  }
}

export function listProjects(options?: FileStoreOptions): string[] {
  const storageDir = getStorageDir(options);

  if (!existsSync(storageDir)) {
    return [];
  }

  return readdirSync(storageDir)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => filename.slice(0, -".json".length))
    .sort();
}
