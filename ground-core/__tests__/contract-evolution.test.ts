import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {SCHEMA_VERSION} from '../types.js';
import {migrateProjectState} from '../migrate.js';
import {validateProjectState, validateProjectStateV0124} from '../validate.js';
import {validProjectStateV0124} from './fixtures.js';
import {assertCurrentComposition, assertHistoricalManifest, assertTransition, checkpointFile,
  currentPaths, readCheckpoint, schemaAt, transition} from './contract-evolution.js';

test('historical schema24 and original Round5 proof remain facts of the clean checkpoint', () => {
  const historical = readCheckpoint(transition.previousAuthority.checkpoint);
  assert.equal(schemaAt(historical), '0.1.24');
  assert.match(checkpointFile(historical, 'ground-core/__tests__/historical-reality-round5.test.ts').toString(),
    /assert\.equal\(state\.schema_version,'0\.1\.24'\)/);
  assert.match(checkpointFile(historical, transition.previousAuthority.sourceApprovals).toString(), /No core\/schema\/data\/proof exceptions/);
});

test('explicit Integration adoption binds the schema introducing event and approved core lineage', () => {
  assertTransition();
  assert.equal(SCHEMA_VERSION, transition.approvedTransition.schemaTo);
  assert.equal(SCHEMA_VERSION, schemaAt(readCheckpoint(transition.approvedTransition.targetCheckpoint)));
});

test('current candidate has exactly base plus approved core and enumerated contract implementation scope', () => {
  assertCurrentComposition();
});

test('unapproved current core bytes are rejected even when historical checkpoint integrity passes', () => {
  const {manifest, fileCount} = transition.historicalContracts[0];
  assertHistoricalManifest(manifest, fileCount);
  assert.throws(() => assertCurrentComposition(path => path === 'ground-core/types.ts'
    ? Buffer.from('unapproved schema26 authority') : readFileSync(resolve(path))), /unapproved current bytes/);
});

test('unreviewed source additions cannot hide outside the old frozen manifest', () => {
  assert.throws(() => assertCurrentComposition(undefined, [...currentPaths(), 'ground-core/unapproved.ts']), /unapproved candidate path set/);
});

test('historical manifest rewrites are rejected instead of acquiring current hashes', () => {
  const {manifest, fileCount} = transition.historicalContracts[0];
  assert.throws(() => assertHistoricalManifest(manifest, fileCount, path => path === manifest
    ? Buffer.from('{}') : readFileSync(resolve(path))), /historical manifest was rewritten/);
});

test('missing historical objects fail closed without using current source', () => {
  assert.throws(() => readCheckpoint('0000000000000000000000000000000000000000'));
});

test('a later checkpoint cannot be relabeled as the schema introducing event', () => {
  const altered = structuredClone(transition);
  altered.approvedTransition.introducingCommit = altered.approvedTransition.targetCheckpoint;
  assert.throws(() => assertTransition(altered));
});

test('changing the advertised schema authority without a corresponding transition is rejected', () => {
  const altered = structuredClone(transition);
  altered.approvedTransition.schemaTo = '0.1.26';
  assert.throws(() => assertTransition(altered));
});

test('contract implementation exceptions cannot be widened to exempt canonical core', () => {
  const altered = structuredClone(transition);
  altered.integration.implementationPaths.push('ground-core/types.ts');
  assert.throws(() => assertTransition(altered), /cannot exempt approved core/);
});

test('historical schema24 input is validated and preserved while normalization follows approved authority', () => {
  const legacy = structuredClone(validProjectStateV0124);
  const original = structuredClone(legacy);
  assert.equal(validateProjectStateV0124(legacy).valid, true);
  assert.equal(validateProjectState(legacy).valid, false);
  const current = migrateProjectState(legacy);
  assert.deepEqual(legacy, original);
  assert.equal(legacy.schema_version, '0.1.24');
  assert.equal(current.schema_version, transition.approvedTransition.schemaTo);
  assert.equal(validateProjectState(current).valid, true);
  assert.deepEqual(migrateProjectState(current), current);
});
