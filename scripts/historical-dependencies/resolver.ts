/** Development/audit only. No fetch, worktree-content fallback, or canonical writes. */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, realpathSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';

export interface Dependency {
  checkpoint_id: string;
  source_role: 'verification' | 'module' | 'asset' | 'toolchain-metadata';
  commit: string;
  repo_relative_path: string;
  expected_blob_oid: string;
  expected_sha256: string;
  expected_byte_length: number;
  resolution_mode: 'git-object';
}
export interface DependencyManifest {
  format: 'historical-dependency-v1';
  checkpoint_id: string;
  commit: string;
  entrypoint?: string;
  dependencies: Dependency[];
  external_imports?: string[];
}
export const sha256 = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
export function assertPath(path: string): void {
  if (typeof path !== 'string' || !/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/.test(path)
      || path.split('/').some(s => s === '.' || s === '..' || s === '.git' || s === 'node_modules')) throw new Error('DEPENDENCY_PATH_REJECTED');
}
const oid = (s: string) => /^[a-f0-9]{40}$/.test(s);
// Ignore inherited Git redirect/config variables, replacement objects and lazy promisor fetch.
function gitEnv(): NodeJS.ProcessEnv {
  return { PATH: process.env.PATH, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_SYSTEM: '/dev/null', GIT_NO_REPLACE_OBJECTS: '1', GIT_NO_LAZY_FETCH: '1',
    GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0' };
}
export class HistoricalRepository {
  readonly root: string;
  constructor(root: string) {
    if (!isAbsolute(root) || lstatSync(root).isSymbolicLink()) throw new Error('REPOSITORY_ROOT_REJECTED');
    this.root = realpathSync(root);
    // Explicit .git required: never discover a parent repository.
    if (!existsSync(join(this.root, '.git')) || lstatSync(join(this.root, '.git')).isSymbolicLink()) throw new Error('REPOSITORY_METADATA_MISSING');
    if (realpathSync(this.git('rev-parse', '--show-toplevel').toString().trim()) !== this.root) throw new Error('REPOSITORY_ROOT_MISMATCH');
    const common = resolve(this.root, this.git('rev-parse', '--git-common-dir').toString().trim());
    if (existsSync(join(common, 'objects/info/alternates')) || existsSync(join(common, 'objects/info/http-alternates'))) throw new Error('EXTERNAL_OBJECT_DATABASE_REJECTED');
    Object.freeze(this);
  }
  private git(...args: string[]): Buffer {
    return execFileSync('git', ['--no-replace-objects', '-C', this.root, ...args],
      { env: gitEnv(), maxBuffer: 128 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
  }
  resolveHistoricalDependency(pin: Dependency): Buffer {
    assertPath(pin.repo_relative_path);
    if (!oid(pin.commit) || !oid(pin.expected_blob_oid) || !/^[a-f0-9]{64}$/.test(pin.expected_sha256)
      || !Number.isSafeInteger(pin.expected_byte_length) || pin.expected_byte_length < 0
      || pin.resolution_mode !== 'git-object') throw new Error('DEPENDENCY_IDENTITY_REJECTED');
    if (this.git('cat-file', '-t', pin.commit).toString().trim() !== 'commit') throw new Error('COMMIT_TYPE_MISMATCH');
    // Verify every tree component, refusing symlinks/gitlinks as well as final trees.
    const segments = pin.repo_relative_path.split('/');
    let path = '';
    for (let i = 0; i < segments.length; i++) {
      path += (i ? '/' : '') + segments[i];
      const row = this.git('ls-tree', '-z', pin.commit, '--', path).toString();
      const m = row.match(/^([0-7]{6}) (blob|tree|commit) ([a-f0-9]{40})\t([^\0]+)\0$/);
      if (!m || m[4] !== path) throw new Error('COMMIT_PATH_MISSING');
      if (i < segments.length - 1) { if (m[1] !== '040000' || m[2] !== 'tree') throw new Error('DEPENDENCY_SYMLINK_OR_TYPE_REJECTED'); }
      else if (!['100644', '100755'].includes(m[1]) || m[2] !== 'blob') throw new Error('DEPENDENCY_BLOB_TYPE_REJECTED');
      else if (m[3] !== pin.expected_blob_oid) throw new Error('BLOB_OID_MISMATCH');
    }
    if (this.git('cat-file', '-t', pin.expected_blob_oid).toString().trim() !== 'blob') throw new Error('BLOB_TYPE_MISMATCH');
    const bytes = this.git('cat-file', 'blob', pin.expected_blob_oid);
    if (bytes.length !== pin.expected_byte_length) throw new Error('BYTE_LENGTH_MISMATCH');
    if (sha256(bytes) !== pin.expected_sha256) throw new Error('SHA256_MISMATCH');
    return bytes;
  }
}
export function resolveHistoricalDependency(repositoryRoot: string, pin: Dependency): Buffer {
  return new HistoricalRepository(repositoryRoot).resolveHistoricalDependency(pin);
}
