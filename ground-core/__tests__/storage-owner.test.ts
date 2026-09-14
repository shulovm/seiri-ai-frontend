import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { cmdInit, cmdIntake, cmdPatch, runCli } from '../cli.js';
import { getStorageDir, listProjects, loadProjectSnapshot, saveProject } from '../file-store.js';
import { createEmptyProject } from '../state-engine.js';
import { withCanonicalWriter, ROOT_MANIFEST, OWNER_LOCK, type CanonicalOwnerConfig, type PersistenceOptions } from '../storage-owner.js';
import { buildFreeWaterPhase0Fixture } from './fixtures.js';

describe('STORAGE-003 root owner contract', () => {
  let temp: string;
  let config: CanonicalOwnerConfig;
  beforeEach(() => {
    temp = mkdtempSync(join(tmpdir(), 'ground-owner-'));
    config = { mode: 'canonical-live', storageDir: join(temp, 'projects'), writerOwner: 'ground-local-cli-v0' };
  });
  afterEach(() => rmSync(temp, { recursive: true, force: true }));

  it('live mode never falls back to environment or module default', () => {
    const previous = process.env.GROUND_CORE_STORAGE_DIR;
    try {
      process.env.GROUND_CORE_STORAGE_DIR = temp;
      assert.equal(getStorageDir(), temp);
      assert.throws(() => getStorageDir({ mode: 'canonical-live' }), /explicit/);
      assert.throws(() => withCanonicalWriter({ ...config, storageDir: '' }, () => {}), /explicit/);
      assert.throws(() => withCanonicalWriter({ ...config, storageDir: 'relative' }, () => {}), /explicit/);
      assert.throws(() => withCanonicalWriter({ ...config, writerOwner: '' }, () => {}), /writerOwner/);
      delete process.env.GROUND_CORE_STORAGE_DIR;
      assert.ok(getStorageDir().endsWith('/ground-core/storage/projects'));
    } finally {
      if (previous === undefined) delete process.env.GROUND_CORE_STORAGE_DIR;
      else process.env.GROUND_CORE_STORAGE_DIR = previous;
    }
  });

  it('unowned live write fails before creating root; session is unforgeable and revoked', () => {
    const state = createEmptyProject({ title: 'ownership test' });
    assert.throws(() => saveProject(state, { ...config, ownerSession: {} }), /session/);
    assert.equal(existsSync(config.storageDir), false);
    let captured: PersistenceOptions = {};
    withCanonicalWriter(config, options => { captured = options; saveProject(state, options); });
    assert.throws(() => saveProject(state, captured), /session/);
    assert.throws(() => saveProject(state, { storageDir: config.storageDir }), /session/);
    assert.throws(() => saveProject(state, { ...config, ownerSession: {} }), /session/);
    assert.equal(existsSync(join(config.storageDir, OWNER_LOCK)), false);
  });

  it('reader needs no ownership and performs no cleanup during or after owner session', () => {
    const state = createEmptyProject({ title: 'reader' });
    withCanonicalWriter(config, options => {
      saveProject(state, options);
      writeFileSync(join(config.storageDir, '.ground-leftover.tmp'), 'partial');
      const before = readdirSync(config.storageDir).sort();
      assert.equal(loadProjectSnapshot(state.project.id, { mode: 'canonical-live', storageDir: config.storageDir }).validation.valid, true);
      assert.deepEqual(listProjects({ storageDir: config.storageDir }), [state.project.id]);
      assert.deepEqual(readdirSync(config.storageDir).sort(), before);
    });
    assert.equal(loadProjectSnapshot(state.project.id, { storageDir: config.storageDir }).state.project.id, state.project.id);
    assert.ok(existsSync(join(config.storageDir, '.ground-leftover.tmp')));
  });

  it('second process is denied for the whole root before read-modify-write', () => {
    const path = join(temp, 'runtime.json');
    writeFileSync(path, JSON.stringify(config));
    withCanonicalWriter(config, () => {
      const before = readFileSync(join(config.storageDir, OWNER_LOCK));
      const child = spawnSync(process.execPath, ['--import', 'tsx', resolve('ground-core/owner-cli.ts'), '--config', path, 'init', '--title', 'must not publish'], { encoding: 'utf8', timeout: 20000 });
      assert.equal(child.status, 1, child.stderr);
      assert.match(child.stderr, /conflict or stale lock/);
      assert.deepEqual(readFileSync(join(config.storageDir, OWNER_LOCK)), before);
      assert.deepEqual(listProjects({ storageDir: config.storageDir }), []);
      assert.throws(() => withCanonicalWriter({ ...config, writerOwner: 'different' }, () => {}), /conflict/);
    });
    withCanonicalWriter(config, () => {});
  });

  it('owner CLI accepts explicit config, ignores storage environment and releases its session', () => {
    const path = join(temp, 'runtime.json');
    writeFileSync(path, JSON.stringify(config));
    const child = spawnSync(process.execPath, ['--import', 'tsx', resolve('ground-core/owner-cli.ts'), '--config', path, 'init', '--title', 'owner launcher proof'], {
      encoding: 'utf8', timeout: 20000, env: { ...process.env, GROUND_CORE_STORAGE_DIR: join(temp, 'must-not-use') },
    });
    assert.equal(child.status, 0, child.stderr);
    const ids = listProjects(config);
    assert.equal(ids.length, 1);
    assert.equal(loadProjectSnapshot(ids[0], config).state.project.title, 'owner launcher proof');
    assert.equal(existsSync(join(temp, 'must-not-use')), false);
    assert.equal(existsSync(join(config.storageDir, OWNER_LOCK)), false);
  });

  it('unsafe permissions and metadata symlinks are refused without automatic repair', () => {
    mkdirSync(config.storageDir, { mode: 0o700 });
    chmodSync(config.storageDir, 0o755);
    assert.throws(() => withCanonicalWriter(config, () => {}), /private/);
    chmodSync(config.storageDir, 0o700);
    const target = join(temp, 'outside.json'); writeFileSync(target, '{}');
    symlinkSync(target, join(config.storageDir, ROOT_MANIFEST));
    assert.throws(() => withCanonicalWriter(config, () => {}), /non-symlink/);
    assert.equal(readFileSync(target, 'utf8'), '{}');
  });

  it('stale lock is never reaped based on a PID and remains reader-neutral', () => {
    withCanonicalWriter(config, () => {});
    const lock = join(config.storageDir, OWNER_LOCK);
    writeFileSync(lock, JSON.stringify({ pid: 99999999, writer_owner: config.writerOwner, token: 'stale' }));
    assert.throws(() => withCanonicalWriter(config, () => {}), /stale lock/);
    assert.ok(existsSync(lock));
    assert.deepEqual(listProjects({ storageDir: config.storageDir }), []);
  });

  it('abrupt owner process exit leaves an exclusion lock; no automatic takeover', () => {
    const script = `import { withCanonicalWriter } from './ground-core/storage-owner.ts';
      withCanonicalWriter(${JSON.stringify(config)}, () => process.exit(19));`;
    const child = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', script], { encoding: 'utf8', timeout: 20000 });
    assert.equal(child.status, 19, child.stderr);
    assert.ok(existsSync(join(config.storageDir, OWNER_LOCK)));
    assert.throws(() => withCanonicalWriter(config, () => {}), /stale lock/);
  });

  it('lock tampering invalidates capability before publishing and thrown operations release ownership', () => {
    const state = createEmptyProject({ title: 'tamper' });
    assert.throws(() => withCanonicalWriter(config, options => {
      writeFileSync(join(config.storageDir, OWNER_LOCK), JSON.stringify({ token: 'replaced' }));
      saveProject(state, options);
    }), /no longer owns/);
    assert.equal(existsSync(join(config.storageDir, state.project.id + '.json')), false);
    withCanonicalWriter(config, () => {});
  });

  it('canonical-live reader rejects an undeclared root without creating metadata', () => {
    mkdirSync(config.storageDir, { mode: 0o700 });
    assert.throws(() => listProjects(config));
    assert.deepEqual(readdirSync(config.storageDir), []);
  });

  it('manifest owner mismatch, malformed manifest and unregistered nonempty roots fail closed', () => {
    withCanonicalWriter(config, () => {});
    assert.throws(() => withCanonicalWriter({ ...config, writerOwner: 'other' }, () => {}), /differs/);
    writeFileSync(join(config.storageDir, ROOT_MANIFEST), '{partial');
    assert.throws(() => withCanonicalWriter(config, () => {}));
    const local = join(temp, 'local'); mkdirSync(local, { mode: 0o700 });
    writeFileSync(join(local, 'old.json'), '{}');
    assert.throws(() => withCanonicalWriter({ ...config, storageDir: local }, () => {}), /promotion/);
    assert.equal(existsSync(join(local, ROOT_MANIFEST)), false);
  });

  it('repository paths including aliased paths are refused; independent root ignores cwd', () => {
    const repo = join(temp, 'checkout'); mkdirSync(repo); writeFileSync(join(repo, '.git'), 'gitdir: elsewhere');
    const alias = join(temp, 'alias'); symlinkSync(repo, alias);
    for (const path of [join(repo, 'storage'), join(alias, 'storage')]) {
      assert.throws(() => withCanonicalWriter({ ...config, storageDir: path }, () => {}), /repositories/);
      assert.equal(existsSync(path), false);
    }
    const cwd = process.cwd();
    try {
      process.chdir(repo);
      withCanonicalWriter(config, options => assert.equal(options.storageDir, realpathSync(config.storageDir)));
    } finally { process.chdir(cwd); }
  });

  it('ordinary CLI is denied even when environment points at a registered root', () => {
    withCanonicalWriter(config, () => {});
    const previous = process.env.GROUND_CORE_STORAGE_DIR;
    try {
      process.env.GROUND_CORE_STORAGE_DIR = config.storageDir;
      assert.throws(() => cmdInit(['--title', 'unauthorized']), /session/);
    } finally {
      if (previous === undefined) delete process.env.GROUND_CORE_STORAGE_DIR;
      else process.env.GROUND_CORE_STORAGE_DIR = previous;
    }
  });

  it('init, intake and patch retain owner session through existing CLI writers', () => {
    withCanonicalWriter(config, options => {
      const id = cmdInit(['--title', 'owned CLI'], options);
      const state = loadProjectSnapshot(id, options).state;
      const patch = join(temp, 'patch.json');
      writeFileSync(patch, JSON.stringify({ schema_version: '0.1.0', project_id: id, source: 'manual', operations: [
        { op: 'upsert', entity: 'current_state', entity_id: state.current_state.id, payload: { summary: 'owned update' } },
      ] }));
      cmdPatch([id, '--file', patch], options);
      assert.equal(loadProjectSnapshot(id, options).state.current_state.summary, 'owned update');
      const seed = resolve('ground-core/examples/experiment-seeds/sample.json');
      const result = cmdIntake(['--file', seed], { ...options, writeOut: () => {} });
      assert.equal(loadProjectSnapshot(result.project_id, options).validation.valid, true);
    });
  });

  for (const command of ['reality-apply', 'reconcile-apply']) {
    it(`${command} publishes only in an owner session`, () => {
      const state = buildFreeWaterPhase0Fixture();
      const proposal = join(temp, 'proposal.json');
      withCanonicalWriter(config, options => saveProject(state, options));
      const io = { storageDir: config.storageDir, writeOut: () => {}, writeErr: () => {} };
      assert.equal(runCli(['reality-propose', state.project.id, '--text', '配布場所、新宿中央公園に決めた', '--extractor', 'mock', '--out', proposal], io), 0);
      const before = loadProjectSnapshot(state.project.id, io);
      assert.equal(runCli([command, state.project.id, '--proposal', proposal], io), 1);
      assert.equal(loadProjectSnapshot(state.project.id, io).fingerprint, before.fingerprint);
      withCanonicalWriter(config, options => {
        assert.equal(runCli([command, state.project.id, '--proposal', proposal], { ...io, ...options }), 0);
        assert.ok(loadProjectSnapshot(state.project.id, options).state.observations.length > before.state.observations.length);
      });
    });
  }
});
