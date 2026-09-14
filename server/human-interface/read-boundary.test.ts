import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tsImport } from 'tsx/esm/api';
import { normalizeProjectState } from '../../ground-core/migrate.js';
import { getRealityWorldline } from '../../ground-core/reality/worldline.js';
import { getClaimsForSubject, getEvidenceForClaim, getObservationsForSubject } from '../../ground-core/reality/epistemic.js';

const adapter = await tsImport('./read-adapter.ts', import.meta.url);
const { default: express } = await tsImport('express', import.meta.url);
const { createHumanInterfaceRouter } = await tsImport('./http-route.js', import.meta.url);
const fixture = new URL('../../fixtures/human-interface/human-001/project-state.json', import.meta.url);
const storage = new URL('../../ground-core/storage/', import.meta.url);
const bytes = readFileSync(fixture);
const raw = JSON.parse(bytes.toString('utf8'));
const state = normalizeProjectState(raw);
const projectId = '19041904-1904-4904-8904-190419041904';
const entityId = '72bf5051-f100-524a-ac33-7a911f6d974a';
const route = `/api/human-interface/reality/${projectId}/${entityId}`;

async function withHttp(reader: unknown, run: (base: string) => Promise<void>, existingApp?: ReturnType<typeof express>) {
  const app = existingApp ?? express();
  if (!existingApp) app.use('/api/human-interface', createHumanInterfaceRouter(reader));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  try { await run(`http://127.0.0.1:${address.port}`); }
  finally { await new Promise<void>((resolve, reject) => server.close((error?: Error) => error ? reject(error) : resolve())); }
}

test('HTTP GET preserves exact core results, fields, temporal strings and empty collections without writes', async () => {
  const storageExisted = existsSync(storage);
  await withHttp(undefined, async base => {
    const response = await fetch(base + route);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    const claims = getClaimsForSubject(state, entityId);
    assert.deepEqual(body.canonical_records, { project: state.project,
      entity: getRealityWorldline(state, entityId).entity,
      observations: getObservationsForSubject(state, entityId), claims });
    assert.deepEqual(body.core_read_results, { worldline: getRealityWorldline(state, entityId),
      evidence_for_claim: claims.map(claim => getEvidenceForClaim(state, claim.id)) });
    assert.deepEqual(body.transport.returned_counts, { observations: 0, claims: 1, events: 0, states: 0 });
    assert.equal(body.transport.source.stored_schema_version, '0.1.24');
    assert.equal(body.transport.source.read_schema_version, '0.1.25');
    assert.equal(body.transport.source.sha256, createHash('sha256').update(bytes).digest('hex'));
    assert.deepEqual(body.core_read_results.worldline.events, []);
    assert.deepEqual(body.core_read_results.worldline.states, []);
    assert.deepEqual(body.canonical_records.observations, []);
    assert.equal(body.canonical_records.claims[0].confidence, raw.claims[0].confidence);
    assert.equal(body.canonical_records.claims[0].applicable_until, null);
    assert.deepEqual(Object.keys(body), ['transport', 'canonical_records', 'core_read_results']);
    assert.equal(body.core_read_results.evidence_for_claim[0].links[0].relation, 'SUPPORTS');
  });
  assert.deepEqual(readFileSync(fixture), bytes);
  assert.deepEqual(state.project, raw.project);
  assert.equal(existsSync(storage), storageExisted);
});

test('identity, filesystem query and non-GET requests cannot escape proof scope', async () => {
  await withHttp(undefined, async base => {
    for (const [url, status, code] of [
      [route.replace(projectId, 'other-project'), 404, 'PROJECT_SCOPE_MISMATCH'],
      [route.replace(entityId, 'other-entity'), 404, 'ENTITY_NOT_FOUND'],
      [route + '?path=/etc/passwd', 400, 'UNSUPPORTED_QUERY_PARAMETERS'],
    ] as const) {
      const response = await fetch(base + url);
      assert.equal(response.status, status);
      assert.deepEqual(await response.json(), { transport_error: { code } });
    }
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']) {
      const response = await fetch(base + route, { method });
      assert.equal(response.status, 405);
      assert.equal(response.headers.get('allow'), 'GET');
    }
  });
});

test('modified bytes fail closed before parsing/normalization and each request reads again', async () => {
  let reads = 0;
  const reader = adapter.createHumanRealityReader(() => ++reads === 1 ? bytes : Buffer.from('invalid changed snapshot'));
  await withHttp(reader, async base => {
    assert.equal((await fetch(base + route)).status, 200);
    const failed = await fetch(base + route);
    assert.equal(failed.status, 503);
    assert.deepEqual(await failed.json(), { transport_error: { code: 'FIXTURE_INTEGRITY_FAILURE' } });
  });
  assert.equal(reads, 2);
  assert.deepEqual(readFileSync(fixture), bytes);
});

test('one request uses exactly one verified snapshot buffer for every canonical reader', () => {
  let reads = 0;
  const reader = adapter.createHumanRealityReader(() => { reads++; return reads === 1 ? bytes : Buffer.from('changed'); });
  const result = reader(projectId, entityId);
  assert.equal(reads, 1);
  assert.deepEqual(result.canonical_records.claims, getClaimsForSubject(state, entityId));
  assert.deepEqual(result.core_read_results.worldline, getRealityWorldline(state, entityId));
});

test('unavailable fixture never falls back to another source', async () => {
  await withHttp(adapter.createHumanRealityReader(() => { throw new Error('unavailable'); }), async base => {
    const response = await fetch(base + route);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { transport_error: { code: 'FIXTURE_SOURCE_UNAVAILABLE' } });
  });
});

test('existing JavaScript server mounts the same GET boundary', async () => {
  const previous = process.env.VERCEL;
  process.env.VERCEL = '1'; // Existing server import mode suppresses automatic listen.
  try {
    const { app } = await tsImport('../../server.js', import.meta.url);
    await withHttp(undefined, async base => {
      const response = await fetch(base + route);
      assert.equal(response.status, 200);
      assert.equal((await response.json()).canonical_records.entity.id, entityId);
    }, app);
  } finally {
    if (previous === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previous;
  }
});
