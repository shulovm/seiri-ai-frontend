import { constants, closeSync, fstatSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, realpathSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ValidationError } from './errors.js';

export const ROOT_MANIFEST = '.ground-storage-root.json';
export const OWNER_LOCK = '.ground-writer.lock';

/** Operations metadata only. Neither configuration nor PID is a write capability. */
export interface CanonicalOwnerConfig {
  mode: 'canonical-live';
  storageDir: string;
  writerOwner: string;
}

export interface PersistenceOptions {
  storageDir?: string;
  mode?: 'local' | 'canonical-live';
  ownerSession?: object;
}

interface RootManifest {
  storage_contract: 'ground-owned-root-v0';
  mode: 'canonical-live';
  writer_owner: string;
  root: string;
}
interface Session {
  root: string;
  owner: string;
  dev: number;
  ino: number;
  token: string;
}
const sessions = new WeakMap<object, Session>();
function fail(message: string): never { throw new ValidationError(message); }

function present(path: string): boolean {
  try { lstatSync(path); return true; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false; throw error; }
}

function readMetadata(path: string): { value: any; dev: number; ino: number } {
  if (!lstatSync(path).isFile()) fail('Storage metadata must be a regular non-symlink file');
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const stat = fstatSync(fd);
    if (!stat.isFile()) fail('Storage metadata must be a regular file');
    return { value: JSON.parse(readFileSync(fd, 'utf8')), dev: stat.dev, ino: stat.ino };
  } finally { closeSync(fd); }
}

function manifest(root: string): RootManifest {
  if (!present(join(root, ROOT_MANIFEST))) fail('Canonical root manifest is required');
  const value = readMetadata(join(root, ROOT_MANIFEST)).value;
  if (!value || value.storage_contract !== 'ground-owned-root-v0' || value.mode !== 'canonical-live'
    || typeof value.writer_owner !== 'string' || !value.writer_owner.trim() || value.root !== root) {
    fail('Invalid or relocated canonical root manifest');
  }
  return value;
}

export function assertPersistenceMode(options?: PersistenceOptions): void {
  if (options?.mode !== undefined && options.mode !== 'local' && options.mode !== 'canonical-live') fail('Unknown persistence mode');
  if (options?.mode === 'canonical-live' && (!options.storageDir || !isAbsolute(options.storageDir))) {
    fail('canonical-live requires an explicit absolute storageDir; no environment/default fallback');
  }
}

/** Explicit live readers verify the declaration but never take the writer lock. */
export function assertStorageRead(root: string, options?: PersistenceOptions): void {
  if (options?.mode === 'canonical-live') manifest(root);
}

/** Called before any save-side directory creation, even by local-mode writers. */
export function assertStorageWrite(root: string, options?: PersistenceOptions): void {
  assertPersistenceMode(options);
  const resolved = present(root) ? realpathSync(root) : root;
  const marked = present(join(resolved, ROOT_MANIFEST)) || present(join(resolved, OWNER_LOCK));
  if (!marked && options?.mode !== 'canonical-live') return;
  const session = options?.ownerSession && sessions.get(options.ownerSession);
  if (options?.mode !== 'canonical-live' || !session || session.root !== resolved) {
    fail('Canonical root writes require an active owner launcher session');
  }
  const declaration = manifest(resolved);
  const lock = readMetadata(join(resolved, OWNER_LOCK));
  if (declaration.writer_owner !== session.owner || lock.dev !== session.dev || lock.ino !== session.ino
    || lock.value?.token !== session.token || lock.value?.writer_owner !== session.owner) {
    fail('Canonical owner session no longer owns this root');
  }
}

function outsideRepository(path: string): void {
  let current = path;
  while (true) {
    if (present(join(current, '.git'))) fail('Canonical root must be outside repositories/worktrees');
    const parent = dirname(current);
    if (parent === current) return;
    current = parent;
  }
}

/** Root-wide exclusive session around a synchronous CLI read-modify-publish operation.
 * O_EXCL is admission, not a lease: stale locks always fail closed, never PID-reaped.
 */
export function withCanonicalWriter<T>(config: CanonicalOwnerConfig, operation: (options: PersistenceOptions) => T): T {
  if (!config || config.mode !== 'canonical-live' || typeof config.writerOwner !== 'string' || !config.writerOwner.trim()) {
    fail('Explicit canonical-live mode and writerOwner are required');
  }
  assertPersistenceMode(config);
  // Resolve existing ancestors before mkdir so an alias cannot hide a repository.
  let ancestor = config.storageDir;
  while (!present(ancestor)) ancestor = dirname(ancestor);
  outsideRepository(realpathSync(ancestor));
  mkdirSync(config.storageDir, { recursive: true, mode: 0o700 });
  const root = realpathSync(config.storageDir);
  outsideRepository(root);
  const stat = lstatSync(root);
  if (!stat.isDirectory() || stat.uid !== process.getuid?.() || (stat.mode & 0o077) !== 0) {
    fail('Canonical root must be owned by this OS user and private (0700); permissions are not changed automatically');
  }
  const lockPath = join(root, OWNER_LOCK);
  let fd: number;
  try { fd = openSync(lockPath, 'wx', 0o600); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') fail('Canonical owner conflict or stale lock; manual recovery required');
    throw error;
  }
  const token = randomUUID();
  const lockStat = fstatSync(fd);
  const capability = Object.freeze({});
  try {
    writeFileSync(fd, JSON.stringify({ writer_owner: config.writerOwner, pid: process.pid, token }) + '\n');
    const manifestPath = join(root, ROOT_MANIFEST);
    if (!present(manifestPath)) {
      // Never turn an existing local store into authority by merely launching an owner.
      if (readdirSync(root).some(name => name !== OWNER_LOCK)) fail('Refusing implicit promotion of a nonempty unregistered root');
      writeFileSync(manifestPath, JSON.stringify({ storage_contract: 'ground-owned-root-v0', mode: 'canonical-live',
        writer_owner: config.writerOwner, root }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    }
    if (manifest(root).writer_owner !== config.writerOwner) fail('Configured writer owner differs from root manifest');
    sessions.set(capability, { root, owner: config.writerOwner, dev: lockStat.dev, ino: lockStat.ino, token });
    const result = operation({ mode: 'canonical-live', storageDir: root, ownerSession: capability });
    if (result && typeof (result as any).then === 'function') fail('Owner launcher supports synchronous operations only');
    return result;
  } finally {
    sessions.delete(capability);
    closeSync(fd);
    // Never remove a replacement lock. Root and its ancestors are trusted OS-user storage.
    const current = lstatSync(lockPath);
    if (current.dev === lockStat.dev && current.ino === lockStat.ino) unlinkSync(lockPath);
  }
}
