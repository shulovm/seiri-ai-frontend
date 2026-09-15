import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { realitySourceRegistry as registry, createRealitySourceRegistry } from './source-registry.js';
import { getRealityWorldline } from '../../ground-core/reality/worldline.js';
import { getClaimsForSubject, getEvidenceForClaim, getEvidenceForObservation, getObservationsForSubject } from '../../ground-core/reality/epistemic.js';
import { readHumanReality } from './read-adapter.js';
const root = new URL('../../', import.meta.url);
for (const source of registry.sources) {
  test(`${source.source_key}: immutable hash, schema, identity and canonical reader baseline`, () => {
    const before = readFileSync(new URL(source.fixture_path, root));
    assert.equal(createHash('sha256').update(before).digest('hex'), source.sha256);
    assert.equal(JSON.parse(before.toString()).schema_version, '0.1.24');
    assert.equal(registry.resolve(source.project_id), source);
    const { state } = registry.read(source.project_id);
    assert.equal(state.schema_version, '0.1.25');
    const worldline = getRealityWorldline(state, source.entity_id);
    const observations = getObservationsForSubject(state, source.entity_id);
    const claims = getClaimsForSubject(state, source.entity_id);
    const bundles = claims.map(claim => getEvidenceForClaim(state, claim.id));
    const evidence = new Set(bundles.flatMap(bundle => [...bundle.supports, ...bundle.contradicts].map(record => record.id)));
    const links = bundles.reduce((n, bundle) => n + bundle.links.length, 0);
    const actual = [worldline.events.length, worldline.states.length, observations.length, claims.length, worldline.ordered_entries.length, worldline.unplaced_events.length, evidence.size, links];
    const expected = source.source_key === 'e2-b15' ? [1,2,2,0,4,0,0,0] : source.source_key === 'historical-round4' ? [0,0,0,23,0,0,1,23] : [0,0,0,1,0,0,1,1];
    assert.deepEqual(actual, expected);
    if (source.source_key === 'e2-b15') {
      assert.equal(state.evidence.length, 1); assert.equal(state.claim_evidence_links.length, 0);
      assert.deepEqual(worldline.states.map(s => [s.valid_from,s.valid_until]).sort(), [['2026-09-01T10:00:00.000Z','2026-09-01T11:00:00.000Z'],['2026-09-01T11:00:00.000Z',null]]);
      assert.equal(source.source_qualification, 'controlled-experiment-canonical-snapshot');
    }
    if (source.source_key === 'human-001') {
      const baseline = readHumanReality(source.project_id, source.entity_id);
      assert.deepEqual(baseline.core_read_results, {worldline,evidence_for_claim:bundles,evidence_for_observation:observations.map(o=>({observation_id:o.id,evidence:getEvidenceForObservation(state,o.id)}))});
      assert.deepEqual(baseline.canonical_records, {project:state.project,entity:worldline.entity,observations,claims});
    }
    assert.deepEqual(readFileSync(new URL(source.fixture_path, root)), before);
    assert.ok(!('source_qualification' in state.project));
  });
  test(`${source.source_key}: corruption fails before parsing`, () => {
    const corrupted = createRealitySourceRegistry([source], () => Buffer.from('not JSON'));
    assert.throws(() => corrupted.read(source.project_id), /FIXTURE_INTEGRITY_FAILURE/);
  });
}
test('unknown project never invokes filesystem reader; ambiguous registration fails closed', () => {
  let reads = 0;
  const isolated = createRealitySourceRegistry(registry.sources, () => { reads++; throw Error('unexpected'); });
  assert.throws(() => isolated.read('../../etc/passwd'), /UNKNOWN_PROJECT/); assert.equal(reads, 0);
  const a = registry.sources[0];
  assert.throws(() => createRealitySourceRegistry([a, {...a,source_key:'other'}]), /AMBIGUOUS_SOURCE_REGISTRY/);
  assert.throws(() => createRealitySourceRegistry([a, {...a,project_id:'other'}]), /AMBIGUOUS_SOURCE_REGISTRY/);
  assert.throws(() => createRealitySourceRegistry([{...a,fixture_path:'/etc/passwd'}]), /INVALID_SOURCE_REGISTRY/);
});
test('metadata identity/schema mismatch and missing source never fall back', () => {
  const a = registry.sources[0], bytes = readFileSync(new URL(a.fixture_path, root));
  for (const change of [{stored_schema:'wrong'}, {read_schema:'wrong'}, {project_id:'wrong'}, {entity_id:'wrong'}]) {
    const r = createRealitySourceRegistry([{...a,...change}], () => bytes);
    assert.throws(() => r.read(change.project_id ?? a.project_id), /CANONICAL_SOURCE_INVALID/);
  }
  assert.throws(() => createRealitySourceRegistry([a], () => {throw Error('missing');}).read(a.project_id), /SOURCE_UNAVAILABLE/);
});
test('each read selects exactly one source and verifies fresh bytes without merging', () => {
  const a = registry.sources[0], b = registry.sources[1];
  let reads = 0;
  const r = createRealitySourceRegistry(registry.sources, source => {
    reads++; assert.equal(source, r.resolve(a.project_id));
    return reads === 1 ? readFileSync(new URL(source.fixture_path, root)) : Buffer.from('changed');
  });
  const result = r.read(a.project_id);
  assert.equal(reads, 1); assert.equal(result.state.project.id, a.project_id);
  assert.ok(result.state.reality_entities.every(entity => entity.project_id !== b.project_id));
  assert.throws(() => r.read(a.project_id), /FIXTURE_INTEGRITY_FAILURE/); assert.equal(reads, 2);
});


test('Observation bundles preserve B15 one/zero matches; Historical external refs remain outside scope',()=>{
 for(const source of registry.sources){
  const result=readHumanReality(source.project_id,source.entity_id);
  const bundles=result.core_read_results.evidence_for_observation;
  if(source.source_key==='e2-b15'){
   assert.deepEqual(bundles.map(b=>[b.observation_id,b.evidence.map(e=>e.id)]),[
    ['1e8a9b55-a7fe-4bdd-8bc0-e6169ee941d2',[]],
    ['27e042ed-38da-44c1-8a78-0a594e04fa7a',['731d5de8-f456-4f4d-8de0-2b5b6627ee13']],
   ]);
  }else assert.deepEqual(bundles,[]);
 }
});
