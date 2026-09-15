/** Test-only checkpoint and Integration admission contracts. No current-byte fallback. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';

export const recordPath = 'docs/contract-evolution/schema24-to25.json';
export const transition = JSON.parse(readFileSync(resolve(recordPath), 'utf8')) as {
  id: string;
  approval: {scope: string; basis: string; adoptionDocument: string};
  previousAuthority: {checkpoint: string; schemaVersion: string; sourceApprovals: string};
  approvedTransition: {commonAncestor: string; introducingCommit: string; targetCheckpoint: string;
    schemaFrom: string; schemaTo: string; commitCount: number; corePathCount: number; excludedCoreDiffPaths: string[]};
  integration: {inputCandidateDiffSHA256: string; composition: string; supportFiles: {path: string; sha256: string}[]; implementationPaths: string[]};
  historicalContracts: {manifest: string; fileCount: number; contract: string}[];
  currentApplicabilityChanges: {contract: string; historical: string; current: string}[];
  preservation: {historicalArtifactManifest: string; artifactCount: number; eternalSourceByteFreeze: boolean;
    automaticSupersessionByDate: boolean; futureAuthorityChangeRequires: string};
};
export type Transition = typeof transition;
export const sha256 = (raw: Buffer | string) => createHash('sha256').update(raw).digest('hex');
const git = (...args: string[]) => execFileSync('git', args, {maxBuffer: 256 * 1024 * 1024});
export type Checkpoint = Map<string, Buffer>;
const checkpoints = new Map<string, Checkpoint>();

export function readCheckpoint(commit: string): Checkpoint {
  assert.match(commit, /^[a-f0-9]{40}$/, 'checkpoint must be an exact commit');
  const cached = checkpoints.get(commit);
  if (cached) return cached;
  assert.equal(git('cat-file', '-t', commit).toString().trim(), 'commit', 'checkpoint object missing');
  const entries = git('ls-tree', '-r', '-z', commit).toString().split('\0').filter(Boolean).map(row => {
    const [metadata, path] = row.split('\t');
    const [, type, oid] = metadata.split(' ');
    assert.equal(type, 'blob', `unsupported checkpoint entry: ${path}`);
    return {path, oid};
  });
  const ids = [...new Set(entries.map(e => e.oid))];
  const output = execFileSync('git', ['cat-file', '--batch'], {
    input: ids.join('\n') + '\n', maxBuffer: 256 * 1024 * 1024,
  });
  const blobs = new Map<string, Buffer>();
  let offset = 0;
  for (const id of ids) {
    const end = output.indexOf(10, offset);
    const [oid, type, size] = output.subarray(offset, end).toString().split(' ');
    assert.equal(oid, id); assert.equal(type, 'blob');
    offset = end + 1;
    blobs.set(id, output.subarray(offset, offset + Number(size)));
    offset += Number(size) + 1;
  }
  const tree = new Map(entries.map(e => [e.path, blobs.get(e.oid)!]));
  checkpoints.set(commit, tree);
  return tree;
}

export function checkpointFile(tree: Checkpoint, path: string): Buffer {
  const raw = tree.get(path);
  assert.ok(raw, `missing checkpoint file: ${path}`);
  return raw;
}
export function schemaAt(tree: Checkpoint): string {
  const version = checkpointFile(tree, 'ground-core/types.ts').toString().match(/export const SCHEMA_VERSION = "([^"]+)" as const/);
  assert.ok(version, 'checkpoint canonical schema declaration missing');
  return version[1];
}

export function assertHistoricalManifest(manifest: string, count: number, read = (path: string) => readFileSync(resolve(path))): void {
  const base = readCheckpoint(transition.previousAuthority.checkpoint);
  const raw = checkpointFile(base, manifest);
  assert.ok(read(manifest).equals(raw), 'historical manifest was rewritten');
  const approvalsPath = transition.previousAuthority.sourceApprovals;
  const approvalsRaw = checkpointFile(base, approvalsPath);
  assert.ok(read(approvalsPath).equals(approvalsRaw), 'historical intake approvals were rewritten');
  const approvals = JSON.parse(approvalsRaw.toString()).approved as {
    path: string; originalSHA256: string; originalBytes?: number; approvedSHA256: string; approvedBytes: number;
  }[];
  const files = JSON.parse(raw.toString()).files as {path: string; sha256: string; bytes?: number}[];
  assert.equal(files.length, count);
  for (const f of files) {
    const approval = approvals.find(a => a.path === f.path && a.originalSHA256 === f.sha256);
    if (approval && f.bytes !== undefined) assert.equal(f.bytes, approval.originalBytes);
    const bytes = checkpointFile(base, f.path);
    assert.equal(sha256(bytes), approval?.approvedSHA256 ?? f.sha256, f.path);
    const expectedSize = approval?.approvedBytes ?? f.bytes;
    if (expectedSize !== undefined) assert.equal(bytes.length, expectedSize, f.path);
  }
}

export function assertTransition(record: Transition = transition): string[] {
  const p = record.previousAuthority, t = record.approvedTransition;
  for (const id of [p.checkpoint, t.commonAncestor, t.introducingCommit, t.targetCheckpoint]) {
    assert.match(id, /^[a-f0-9]{40}$/);
    assert.equal(git('cat-file', '-t', id).toString().trim(), 'commit');
  }
  assert.equal(git('merge-base', p.checkpoint, t.targetCheckpoint).toString().trim(), t.commonAncestor);
  git('merge-base', '--is-ancestor', t.commonAncestor, t.introducingCommit);
  git('merge-base', '--is-ancestor', t.introducingCommit, t.targetCheckpoint);
  assert.equal(Number(git('rev-list', '--count', `${t.commonAncestor}..${t.targetCheckpoint}`)), t.commitCount);
  const base = readCheckpoint(p.checkpoint), target = readCheckpoint(t.targetCheckpoint);
  assert.equal(schemaAt(base), p.schemaVersion);
  assert.equal(p.schemaVersion, t.schemaFrom);
  assert.equal(schemaAt(readCheckpoint(git('rev-parse', `${t.introducingCommit}^`).toString().trim())), t.schemaFrom);
  assert.equal(schemaAt(readCheckpoint(t.introducingCommit)), t.schemaTo);
  assert.equal(schemaAt(target), t.schemaTo);
  assert.notEqual(t.schemaFrom, t.schemaTo);
  const adoption = checkpointFile(readCheckpoint(t.introducingCommit), record.approval.adoptionDocument);
  assert.match(adoption.toString(), /human Option A decision/);
  assert.match(adoption.toString(), /historical input fixtures\s+remain versioned/);
  assert.deepEqual(checkpointFile(target, record.approval.adoptionDocument), adoption);
  for (const kind of ['project-state', 'state-patch']) {
    const path = `docs/schemas/ground-core-${kind}.v${t.schemaFrom}.schema.json`;
    assert.deepEqual(checkpointFile(base, path), checkpointFile(target, path), 'historical schema drift');
    checkpointFile(target, `docs/schemas/ground-core-${kind}.v${t.schemaTo}.schema.json`);
  }
  assert.deepEqual(record.currentApplicabilityChanges.map(c => c.contract).sort(),
    ['historical-reality-round5.test.ts:21', 'historical-reality-round5.test.ts:24', 'historical-reality-round6.test.ts:16']);
  assert.ok(record.approval.basis && record.approval.scope);
  assert.equal(record.preservation.automaticSupersessionByDate, false);
  assert.equal(record.preservation.eternalSourceByteFreeze, false);
  assert.deepEqual(t.excludedCoreDiffPaths, ['.gitignore']);
  assert.deepEqual(record.integration.implementationPaths, [
    recordPath, 'docs/GROUND_CONTRACT_EVOLUTION.md',
    'ground-core/__tests__/contract-evolution.ts', 'ground-core/__tests__/contract-evolution.test.ts',
    'ground-core/__tests__/historical-reality-round5.test.ts', 'ground-core/__tests__/historical-reality-round6.test.ts',
    'scripts/repro/test-ground.mjs',
  ], 'contract implementation scope cannot exempt approved core');
  assert.deepEqual(record.integration.supportFiles.map(f => f.path), ['.gitignore']);
  const changed = git('diff', '--name-only', t.commonAncestor, t.targetCheckpoint).toString().trim().split('\n')
    .filter(p => !t.excludedCoreDiffPaths.includes(p));
  assert.equal(changed.length, t.corePathCount);
  return changed;
}

export function currentPaths(): string[] {
  const walk = (dir: string): string[] => readdirSync(resolve(dir), {withFileTypes: true}).flatMap(e => {
    const p = dir + '/' + e.name;
    return p === 'ground-core/storage' ? [] : e.isDirectory() ? walk(p) : [p];
  });
  return [...['ground-core', 'docs', 'scripts'].flatMap(walk), 'package.json', 'package-lock.json', '.gitignore'];
}

/** Compare the actual candidate with base + approved diff; reject unlisted source additions. */
export function assertCurrentComposition(
  read: (path: string) => Buffer = path => readFileSync(resolve(path)),
  paths?: string[],
): void {
  const base = readCheckpoint(transition.previousAuthority.checkpoint);
  const target = readCheckpoint(transition.approvedTransition.targetCheckpoint);
  const expected = new Map(base);
  for (const path of assertTransition()) {
    if (target.has(path)) expected.set(path, target.get(path)!); else expected.delete(path);
  }
  const implementation = new Set(transition.integration.implementationPaths);
  const support = new Map(transition.integration.supportFiles.map(f => [f.path, f.sha256]));
  const roots = ['ground-core', 'docs', 'scripts'];
  const protectedPath = (p: string) => !p.startsWith('ground-core/storage/') &&
    (roots.some(r => p.startsWith(r + '/')) || ['package.json', 'package-lock.json', '.gitignore'].includes(p));
  const actualPaths = paths ?? currentPaths();
  const expectedPaths = [...new Set([...expected.keys(), ...implementation, ...support.keys()])].filter(protectedPath).sort();
  assert.deepEqual(actualPaths.filter(protectedPath).sort(), expectedPaths, 'unapproved candidate path set');
  for (const path of expectedPaths) {
    if (implementation.has(path)) { read(path); continue; }
    if (support.has(path)) assert.equal(sha256(read(path)), support.get(path), path);
    else assert.ok(read(path).equals(expected.get(path)!), `unapproved current bytes: ${path}`);
  }
}
