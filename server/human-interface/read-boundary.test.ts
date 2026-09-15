import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tsImport } from 'tsx/esm/api';
import type { RealitySourceMetadata } from './source-registry.js';
import { normalizeProjectState } from '../../ground-core/migrate.js';
import { getRealityWorldline } from '../../ground-core/reality/worldline.js';
import { getClaimsForSubject, getEvidenceForClaim, getObservationsForSubject } from '../../ground-core/reality/epistemic.js';

import * as adapter from './read-adapter.js';
import { realitySourceRegistry as registry, createRealitySourceRegistry } from './source-registry.js';
const createByteReader = (readBytes: () => Buffer) => adapter.createHumanRealityReader(createRealitySourceRegistry(registry.sources, readBytes));
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
      [route.replace(entityId, 'other-entity'), 404, 'ENTITY_NOT_IN_SNAPSHOT'],
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
  const reader = createByteReader(() => ++reads === 1 ? bytes : Buffer.from('invalid changed snapshot'));
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
  const reader = createByteReader(() => { reads++; return reads === 1 ? bytes : Buffer.from('changed'); });
  const result = reader(projectId, entityId);
  assert.equal(reads, 1);
  assert.deepEqual(result.canonical_records.claims, getClaimsForSubject(state, entityId));
  assert.deepEqual(result.core_read_results.worldline, getRealityWorldline(state, entityId));
});

test('unavailable fixture never falls back to another source', async () => {
  await withHttp(createByteReader(() => { throw new Error('unavailable'); }), async base => {
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
      assert.equal((await fetch(base + '/api/human-interface/projects')).status, 200);
      const browse = await fetch(base + '/api/human-interface/projects/' + projectId);
      assert.equal(browse.status, 200);
      assert.equal((await browse.json()).canonical_entities.length, 14);
    }, app);
  } finally {
    if (previous === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previous;
  }
});

for (const source of registry.sources) {
  const fixtureUrl = new URL(`../../${source.fixture_path}`, import.meta.url);
  const snapshotBytes = readFileSync(fixtureUrl);
  const snapshot = normalizeProjectState(JSON.parse(snapshotBytes.toString('utf8')));
  const scopedRoute = `/api/human-interface/reality/${source.project_id}/${source.entity_id}`;

  test(`${source.source_key}: HTTP preserves one registered source and complete canonical results`, async () => {
    await withHttp(undefined, async base => {
      const response = await fetch(base + scopedRoute);
      assert.equal(response.status, 200);
      const body = await response.json();
      const worldline = getRealityWorldline(snapshot, source.entity_id);
      const observations = getObservationsForSubject(snapshot, source.entity_id);
      const claims = getClaimsForSubject(snapshot, source.entity_id);
      const bundles = claims.map(claim => getEvidenceForClaim(snapshot, claim.id));
      assert.deepEqual(body.canonical_records, {project:snapshot.project,entity:worldline.entity,observations,claims});
      assert.deepEqual(body.core_read_results, {worldline,evidence_for_claim:bundles});
      assert.deepEqual(body.transport.source, {
        fixture:source.source_key, source_key:source.source_key, source_qualification:source.source_qualification,
        source_mode:"immutable_proof_snapshot", snapshot_fingerprint:source.sha256, sha256:source.sha256, stored_schema_version:'0.1.24', read_schema_version:'0.1.25',
        canonical_baseline_commit:'fbfafef737132c8049998f9ca7d1d5f68fa90c56',
      });
      assert.deepEqual(body.transport.requested_scope, {project_id:source.project_id,entity_id:source.entity_id});
      assert.equal(body.transport.contract, 'human-interface-reality-read.v1');
      const uniqueEvidence = new Set(bundles.flatMap(bundle => [...bundle.supports,...bundle.contradicts].map(record => record.id)));
      const linkCount = bundles.reduce((n,bundle) => n + bundle.links.length, 0);
      if (source.source_key === 'e2-b15') {
        assert.equal(body.transport.source.source_qualification, 'controlled-experiment-canonical-snapshot');
        assert.deepEqual(body.transport.returned_counts, {events:1,states:2,observations:2,claims:0});
        assert.equal(worldline.ordered_entries.length, 4);
        assert.deepEqual(worldline.unplaced_events, []);
        assert.equal(worldline.temporal_summary.latest_time, '2026-09-01T11:00:00.000Z');
        assert.ok(observations.some(record => record.observed_at === '2026-09-01T12:00:00.000Z'));
        assert.ok(worldline.states.some(record => record.valid_until === null));
        assert.equal(snapshot.evidence.length, 1);
        assert.equal(snapshot.claim_evidence_links.length, 0);
        assert.deepEqual(body.core_read_results.evidence_for_claim, []);
      } else {
        const claimCount = source.source_key === 'human-001' ? 1 : 23;
        assert.deepEqual(body.transport.returned_counts, {events:0,states:0,observations:0,claims:claimCount});
        assert.equal(linkCount, claimCount); assert.equal(uniqueEvidence.size, 1);
      }
      // No project-wide Evidence count or expansion is introduced by the adapter.
      assert.deepEqual(Object.keys(body.transport.returned_counts).sort(), ['claims','events','observations','states']);
      assert.deepEqual(Object.keys(body.canonical_records).sort(), ['claims','entity','observations','project']);
      assert.deepEqual(Object.keys(body.core_read_results).sort(), ['evidence_for_claim','worldline']);
    });
    assert.deepEqual(readFileSync(fixtureUrl), snapshotBytes);
  });

  test(`${source.source_key}: one HTTP request reads once; subsequent corruption fails closed`, async () => {
    let reads = 0;
    const isolated = createRealitySourceRegistry(registry.sources, (selected: Readonly<RealitySourceMetadata>) => {
      assert.equal(selected.source_key, source.source_key);
      reads++;
      return reads === 1 ? snapshotBytes : Buffer.from('corrupt, not JSON');
    });
    await withHttp(adapter.createHumanRealityReader(isolated), async base => {
      const response = await fetch(base + scopedRoute);
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.equal(body.transport.source.source_key, source.source_key);
      assert.equal(body.canonical_records.project.id, source.project_id);
      assert.equal(body.canonical_records.entity.id, source.entity_id);
      assert.deepEqual(body.core_read_results.worldline, getRealityWorldline(snapshot, source.entity_id));
      assert.equal(reads, 1);
      const failure = await fetch(base + scopedRoute);
      assert.equal(failure.status, 503);
      assert.deepEqual(await failure.json(), {transport_error:{code:'FIXTURE_INTEGRITY_FAILURE'}});
      assert.equal(reads, 2);
    });
  });

  test(`${source.source_key}: query/method restrictions reject before reading`, async () => {
    let reads = 0;
    const isolated = createRealitySourceRegistry(registry.sources, () => {reads++; throw Error('must not read');});
    await withHttp(adapter.createHumanRealityReader(isolated), async base => {
      for (const query of ['path=/etc/passwd','filename=project-state.json','directory=/tmp','source=e2-b15','registry=override']) {
        const response = await fetch(base + scopedRoute + '?' + query);
        assert.equal(response.status, 400);
        assert.deepEqual(await response.json(), {transport_error:{code:'UNSUPPORTED_QUERY_PARAMETERS'}});
      }
      for (const method of ['POST','PUT','PATCH','DELETE','HEAD','OPTIONS']) {
        const response = await fetch(base + scopedRoute, {method});
        assert.equal(response.status, 405); assert.equal(response.headers.get('allow'), 'GET');
      }
    });
    assert.equal(reads, 0);
  });
}

test('unknown projects, source keys and encoded filesystem paths never invoke snapshot reader', async () => {
  let reads = 0;
  const isolated = createRealitySourceRegistry(registry.sources, () => {reads++; throw Error('must not read');});
  await withHttp(adapter.createHumanRealityReader(isolated), async base => {
    for (const id of ['unknown-project', 'e2-b15', '/etc/passwd', '../project-state.json']) {
      const response = await fetch(`${base}/api/human-interface/reality/${encodeURIComponent(id)}/${entityId}`);
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), {transport_error:{code:'PROJECT_SCOPE_MISMATCH'}});
    }
  });
  assert.equal(reads, 0);
});

test('integrity-valid malformed, non-normalizable and invalid sources produce read failures, never empty Reality', async () => {
  const source = registry.sources[0];
  // Test-only byte injection; deployed manifests and immutable fixtures are not modified.
  for (const [injectedBytes, expectedCode] of [
    [Buffer.from('{malformed'), 'CANONICAL_READ_FAILURE'],
    [Buffer.from('null'), 'CANONICAL_READ_FAILURE'],
    // Existing normalization rejects invalid stored state with its own ValidationError.
    [Buffer.from(JSON.stringify({...raw, project:{...raw.project,id:'wrong-project'}})), 'CANONICAL_READ_FAILURE'],
  ] as const) {
    let reads = 0;
    const isolated = createRealitySourceRegistry([{...source,sha256:createHash('sha256').update(injectedBytes).digest('hex')}], () => {reads++; return injectedBytes;});
    await withHttp(adapter.createHumanRealityReader(isolated), async base => {
      const response = await fetch(base + route);
      assert.equal(response.status, 503);
      const body = await response.json();
      assert.equal(body.transport_error.code, expectedCode);
      assert.deepEqual(Object.keys(body), ['transport_error']);
    });
    assert.equal(reads, 1);
  }
});

test('registry schema mismatch is a classified HTTP source failure', async () => {
  const isolated = createRealitySourceRegistry([{...registry.sources[0],read_schema:'wrong-schema'}], () => bytes);
  await withHttp(adapter.createHumanRealityReader(isolated), async base => {
    const response = await fetch(base + route);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {transport_error:{code:'CANONICAL_SOURCE_INVALID'}});
  });
});
