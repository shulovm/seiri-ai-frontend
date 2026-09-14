import {
  closeSync, constants, fchmodSync, fstatSync, lstatSync, mkdirSync,
  openSync, readdirSync, readFileSync, realpathSync, renameSync,
  unlinkSync, writeFileSync,
} from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NotFoundError, ValidationError } from "./errors.js";
import { normalizeProjectState } from "./migrate.js";
import { SCHEMA_VERSION, type ProjectState } from "./types.js";
import { validateProjectState } from "./validate.js";

import { assertPersistenceMode, assertStorageRead, assertStorageWrite, type PersistenceOptions } from "./storage-owner.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_STORAGE_DIR = join(__dirname, "storage/projects");
// UUID shape matches the canonical UUID format; no path components are accepted.
const PROJECT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface FileStoreOptions extends PersistenceOptions {
  /** Process configuration, never client input. Explicit selection alone is not ownership. */
  storageDir?: string;
}

/** Persistence metadata, not canonical fields, a revision or a truth assessment. */
export interface ProjectSnapshot {
  bytes: Buffer;
  stored: unknown;
  state: ProjectState;
  fingerprint: string;
  stored_schema_version: string;
  read_schema_version: ProjectState["schema_version"];
  validation: ReturnType<typeof validateProjectState>;
}

export function getStorageDir(options?: FileStoreOptions): string {
  assertPersistenceMode(options);
  return options?.storageDir || process.env.GROUND_CORE_STORAGE_DIR || DEFAULT_STORAGE_DIR;
}

function assertProjectId(projectId: string): void {
  if (!PROJECT_ID.test(projectId)) throw new ValidationError("Invalid Project ID filename format");
}

function missing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === "ENOENT";
}

// The configured root and its ancestors must be controlled by the writer owner.
// Resolve OS aliases (e.g. macOS /tmp) once; never follow a Project-file symlink.
function resolveRoot(options?: FileStoreOptions, create = false): string {
  const root = getStorageDir(options);
  if (create) mkdirSync(root, { recursive: true });
  const resolved = realpathSync(root);
  assertStorageRead(resolved, options);
  return resolved;
}

function regularFile(path: string) {
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw new ValidationError("Project path must be a regular file, not a symlink");
  }
  return stat;
}

/** Single writer owner required. Atomic visibility is not writer coordination or power-loss durability. */
export function saveProject(projectState: ProjectState, options?: FileStoreOptions): void {
  const normalized = normalizeProjectState(projectState);
  if (normalized.schema_version !== SCHEMA_VERSION) {
    throw new ValidationError(`Cannot save ProjectState with schema_version ${normalized.schema_version}`);
  }
  const validation = validateProjectState(normalized);
  if (!validation.valid) throw new ValidationError("Cannot save invalid ProjectState", validation.errors);
  assertProjectId(normalized.project.id);
  const bytes = Buffer.from(`${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  assertStorageWrite(getStorageDir(options), options);
  const root = resolveRoot(options, true);
  const path = join(root, `${normalized.project.id}.json`);
  let mode = 0o600;
  try { mode = regularFile(path).mode & 0o777; } catch (error) { if (!missing(error)) throw error; }
  const temp = join(root, `.ground-${normalized.project.id}-${randomUUID()}.tmp`);
  let fd: number | undefined;
  let created = false;
  try {
    fd = openSync(temp, "wx", 0o600);
    created = true;
    writeFileSync(fd, bytes);
    fchmodSync(fd, mode);
    closeSync(fd);
    fd = undefined;
    // Recheck before replacement. Root mutation by untrusted processes is unsupported.
    try { regularFile(path); } catch (error) { if (!missing(error)) throw error; }
    renameSync(temp, path); // same-directory publish; no fall-back to direct final writes
  } finally {
    if (fd !== undefined) { try { closeSync(fd); } catch { /* Preserve the save error. */ } }
    // Only the writer's own temporary file is eligible for cleanup; readers never clean up.
    if (created) { try { unlinkSync(temp); } catch { /* May already be published or remain after failure. */ } }
  }
}

export function loadProjectSnapshot(projectId: string, options?: FileStoreOptions): ProjectSnapshot {
  assertProjectId(projectId);
  let bytes: Buffer;
  try {
    const path = join(resolveRoot(options), `${projectId}.json`);
    regularFile(path);
    // O_NOFOLLOW guards final-component symlink substitution. O_NONBLOCK avoids
    // blocking on a substituted FIFO before fstat; supported local POSIX filesystems only.
    const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    try {
      if (!fstatSync(fd).isFile()) throw new ValidationError("Project path must be a regular file");
      bytes = readFileSync(fd);
    } finally { closeSync(fd); }
  } catch (error) {
    if (missing(error)) throw new NotFoundError(`Project not found: ${projectId}`);
    throw error;
  }
  const fingerprint = createHash("sha256").update(bytes).digest("hex");
  const stored: unknown = JSON.parse(bytes.toString("utf8"));
  try {
    const state = normalizeProjectState(stored);
    const validation = validateProjectState(state);
    if (state.schema_version !== SCHEMA_VERSION || !validation.valid) {
      throw new ValidationError("Invalid normalized ProjectState", validation.errors);
    }
    if (state.project.id !== projectId) throw new ValidationError("Stored Project ID does not match requested Project ID");
    return { bytes, stored, state, fingerprint,
      stored_schema_version: (stored as { schema_version: string }).schema_version,
      read_schema_version: state.schema_version, validation };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(`Stored project is invalid: ${projectId}`, error.details ?? error.message);
    }
    throw error;
  }
}

export function loadProject(projectId: string, options?: FileStoreOptions): ProjectState {
  return loadProjectSnapshot(projectId, options).state;
}

/** Filename candidates only, not validated canonical Projects. No contents are loaded. */
export function listProjects(options?: FileStoreOptions): string[] {
  let root: string;
  try { root = resolveRoot(options); } catch (error) { if (missing(error) && options?.mode !== 'canonical-live') return []; throw error; }
  return readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isFile() && !entry.isSymbolicLink() && entry.name.endsWith(".json") && PROJECT_ID.test(entry.name.slice(0, -5)))
    .map(entry => entry.name.slice(0, -5))
    .sort();
}
