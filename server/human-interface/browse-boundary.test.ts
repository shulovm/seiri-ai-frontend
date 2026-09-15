import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { tsImport } from 'tsx/esm/api';
import { createHumanBrowseReader, createHumanRealityReader } from './read-adapter.js';
import { realitySourceRegistry as registry, createRealitySourceRegistry } from './source-registry.js';
import { normalizeProjectState } from '../../ground-core/migrate.js';
import { getRealityWorldline } from '../../ground-core/reality/worldline.js';
import { getClaimsForSubject, getEvidenceForClaim, getObservationsForSubject } from '../../ground-core/reality/epistemic.js';
const { default: express } = await tsImport('express', import.meta.url);
const { createHumanInterfaceRouter } = await tsImport('./http-route.js', import.meta.url);
const load = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url));
async function http(selected: typeof registry, run: (base: string) => Promise<void>) {
  const app = express();
  app.use('/api/human-interface', createHumanInterfaceRouter(createHumanRealityReader(selected), createHumanBrowseReader(selected)));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  try { await run(`http://127.0.0.1:${address.port}/api/human-interface`); }
  finally { await new Promise<void>((resolve, reject) => server.close((e?: Error) => e ? reject(e) : resolve())); }
}

test('catalog returns only three registered transport identities without reading snapshot bytes', async () => {
  let reads = 0;
  const isolated = createRealitySourceRegistry(registry.sources, () => { reads++; throw Error('no bytes'); });
  await http(isolated, async base => {
    const response = await fetch(base + '/projects');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), {
      transport: { contract: 'human-interface-project-catalog.v1' },
      registered_projects: registry.sources.map(s => ({project_id:s.project_id,source_key:s.source_key,source_mode:"immutable_proof_snapshot",source_qualification:s.source_qualification})),
    });
  });
  assert.equal(reads, 0);
  // A restricted registry exposes exactly its entries, never discovers other fixture files.
  assert.equal(createHumanBrowseReader(createRealitySourceRegistry(registry.sources.slice(0,1))).catalog().registered_projects.length, 1);
});

for (const [index, source] of registry.sources.entries()) {
  const bytes = load(source.fixture_path);
  const raw = JSON.parse(bytes.toString());
  const state = normalizeProjectState(raw);
  test(`${source.source_key}: project HTTP preserves full Project and exact identity projection in stored order`, async () => {
    let reads = 0;
    const isolated = createRealitySourceRegistry(registry.sources, selected => {
      assert.equal(selected.project_id, source.project_id); reads++; return reads === 1 ? bytes : Buffer.from('changed');
    });
    await http(isolated, async base => {
      const path = base + '/projects/' + source.project_id;
      const response = await fetch(path); assert.equal(response.status, 200);
      const body = await response.json();
      assert.deepEqual(Object.keys(body), ['transport','canonical_project','canonical_entities']);
      assert.deepEqual(body.canonical_project, raw.project);
      assert.deepEqual(body.canonical_entities, raw.reality_entities.map(({id,project_id,kind,label}: {id:string;project_id:string;kind:string;label:string}) => ({id,project_id,kind,label})));
      assert.equal(body.canonical_entities.length, [14,4,42][index]);
      assert.deepEqual(body.transport, {
        contract:'human-interface-project-browse.v1',
        source:{source_key:source.source_key,source_qualification:source.source_qualification,source_mode:"immutable_proof_snapshot", snapshot_fingerprint:source.sha256, sha256:source.sha256,
          stored_schema_version:'0.1.24',read_schema_version:'0.1.25',canonical_baseline_commit:'fbfafef737132c8049998f9ca7d1d5f68fa90c56'},
        requested_scope:{project_id:source.project_id},
      });
      assert.equal(reads, 1);
      const failure = await fetch(path); assert.equal(failure.status, 503);
      assert.deepEqual(await failure.json(), {transport_error:{code:'FIXTURE_INTEGRITY_FAILURE'}});
      assert.equal(reads, 2);
    });
    assert.deepEqual(load(source.fixture_path), bytes);
  });

  test(`${source.source_key}: every saved Entity uses exact existing canonical readers, one selected snapshot per call`, () => {
    let reads = 0;
    const reader = createHumanRealityReader(createRealitySourceRegistry(registry.sources, selected => {
      assert.equal(selected.project_id, source.project_id); reads++; return bytes;
    }));
    for (const entity of state.reality_entities) {
      const result = reader(source.project_id, entity.id);
      const claims = getClaimsForSubject(state, entity.id);
      assert.deepEqual(result.canonical_records, {project:state.project,entity,observations:getObservationsForSubject(state,entity.id),claims});
      assert.deepEqual(result.core_read_results, {worldline:getRealityWorldline(state,entity.id),evidence_for_claim:claims.map(claim=>getEvidenceForClaim(state,claim.id))});
    }
    assert.equal(reads, state.reality_entities.length);
  });
}

test('non-candidate HTTP proofs: provenance person remains zero, document has one Claim, heavier document has eleven', async () => {
  const proofs = [
    ['b7c4492f-955a-4189-a913-5ece6c6a876a','15399c69-cad8-4c41-8243-00df797258d0',0],
    ['19041904-1904-4904-8904-190419041904','bac9d6f2-862c-5006-af95-2dfd85d1475c',1],
    ['19041904-1904-4904-8904-190419044004','c7e61d36-1a63-5e61-a2f0-c146dde96887',11],
  ] as const;
  await http(registry, async base => {
    for (const [project,id,count] of proofs) {
      const response = await fetch(`${base}/reality/${project}/${id}`); assert.equal(response.status,200);
      const body = await response.json();
      assert.equal(body.canonical_records.entity.id,id);
      assert.deepEqual(body.transport.returned_counts,{events:0,states:0,observations:0,claims:count});
      assert.equal(body.core_read_results.evidence_for_claim.length,count);
      assert.equal(body.core_read_results.evidence_for_claim.reduce((n:number,b:{links:unknown[]})=>n+b.links.length,0),count);
      assert.deepEqual(body.core_read_results.worldline.ordered_entries,[]);
    }
  });
});

test('cross-project and absent IDs are checked only in one verified snapshot; corruption takes precedence', async () => {
  const source = registry.sources[0]; let reads = 0;
  const isolated = createRealitySourceRegistry(registry.sources, selected => {
    assert.equal(selected.project_id, source.project_id); reads++; return reads <= 2 ? load(source.fixture_path) : Buffer.from('corrupt');
  });
  await http(isolated, async base => {
    for (const id of [registry.sources[1].entity_id,'absent','absent']) {
      const response = await fetch(`${base}/reality/${source.project_id}/${id}`);
      assert.equal(response.status,reads<=2 ? 404 : 503);
      assert.deepEqual(await response.json(),{transport_error:{code:reads<=2?'ENTITY_NOT_IN_SNAPSHOT':'FIXTURE_INTEGRITY_FAILURE'}});
    }
  });
  assert.equal(reads,3);
});

test('catalog and project routes reject methods and queries; unknown project never reads or scans', async () => {
  let reads=0;
  const isolated=createRealitySourceRegistry(registry.sources,()=>{reads++;throw Error('no read');});
  await http(isolated,async base=>{
    for (const path of ['/projects','/projects/'+registry.sources[0].project_id]) {
      for (const method of ['POST','PUT','PATCH','DELETE','HEAD','OPTIONS']) {
        const r=await fetch(base+path,{method});assert.equal(r.status,405);assert.equal(r.headers.get('allow'),'GET');
      }
      for (const query of ['path=/etc/passwd','filename=x','registry=x','source=x','sort=label','filter=person']) {
        const r=await fetch(base+path+'?'+query);assert.equal(r.status,400);
      }
    }
    for (const id of ['unknown','e2-b15','/etc/passwd','../project-state.json']) {
      const r=await fetch(base+'/projects/'+encodeURIComponent(id));assert.equal(r.status,404);
      assert.deepEqual(await r.json(),{transport_error:{code:'PROJECT_SCOPE_MISMATCH'}});
    }
  });assert.equal(reads,0);
});
