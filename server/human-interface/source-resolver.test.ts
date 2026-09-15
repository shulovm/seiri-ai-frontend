import assert from 'node:assert/strict';
import { test, type TestContext } from 'node:test';
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { tsImport } from 'tsx/esm/api';
import { createHumanSourceResolver, LIVE_PROJECT_ID } from './source-resolver.js';
import { realitySourceRegistry, createRealitySourceRegistry } from './source-registry.js';
import { createHumanBrowseReader, createHumanRealityReader } from './read-adapter.js';
import { loadProjectSnapshot, saveProject } from '../../ground-core/file-store.js';
import { withCanonicalWriter, type CanonicalOwnerConfig } from '../../ground-core/storage-owner.js';
import { createEmptyProject } from '../../ground-core/state-engine.js';
import { getRealityWorldline } from '../../ground-core/reality/worldline.js';
import { getObservationsForSubject, getClaimsForSubject, getEvidenceForClaim } from '../../ground-core/reality/epistemic.js';
const { default: express } = await tsImport('express', import.meta.url);
const { createHumanInterfaceRouter } = await tsImport('./http-route.js', import.meta.url);
function setup(t: TestContext) {
  const dir=mkdtempSync(join(tmpdir(),'human-live-read-'));
  t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const config:CanonicalOwnerConfig={mode:'canonical-live',storageDir:join(dir,'projects'),writerOwner:'ground-local-cli-v0'};
  const runtimeConfigPath=join(dir,'runtime.json');writeFileSync(runtimeConfigPath,JSON.stringify(config));
  // Test-only re-identification of the existing B15 proof. Never a live injection.
  const proof=realitySourceRegistry.read(realitySourceRegistry.sources[1].project_id).state;
  const state=JSON.parse(JSON.stringify(proof).replaceAll(proof.project.id,LIVE_PROJECT_ID)) as typeof proof;
  withCanonicalWriter(config,o=>saveProject(state,o));
  const file=join(config.storageDir,LIVE_PROJECT_ID+'.json');
  return {dir,config,runtimeConfigPath,state,file};
}
async function http(resolver:ReturnType<typeof createHumanSourceResolver>, run:(url:string)=>Promise<void>) {
  const app=express();app.use('/api/human-interface',createHumanInterfaceRouter(createHumanRealityReader(resolver),createHumanBrowseReader(resolver)));
  const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
  const a=server.address();assert.ok(a && typeof a!=='string');
  try{await run(`http://127.0.0.1:${a.port}/api/human-interface`);}finally{await new Promise<void>((r,j)=>server.close((e?:Error)=>e?j(e):r()));}
}

test('explicit enablement: zero snapshot catalog reads, no automatic discovery or internal paths',t=>{
 const x=setup(t);let reads=0;
 const resolver=createHumanSourceResolver({runtimeConfigPath:x.runtimeConfigPath},()=>{reads++;throw Error('catalog must not read');});
 const other=createEmptyProject({title:'not registered'});withCanonicalWriter(x.config,o=>saveProject(other,o));
 const catalog=createHumanBrowseReader(resolver).catalog();
 assert.equal(catalog.registered_projects.length,4);assert.equal(reads,0);
 assert.deepEqual(catalog.registered_projects[3],{project_id:LIVE_PROJECT_ID,source_key:'canonical-live-project',source_mode:'mutable_canonical_storage',source_qualification:'canonical-live-project'});
 assert.equal(createHumanBrowseReader(createHumanSourceResolver()).catalog().registered_projects.length,3);
 assert.throws(()=>resolver.readSnapshot(other.project.id),/UNKNOWN_PROJECT/);assert.equal(reads,0);
 assert.doesNotMatch(JSON.stringify(catalog),/storageDir|fixture_path|fingerprint|schema|integrity|title|\/private|\/Users/);
});

test('one snapshot across every canonical reader even when writer publishes B immediately after acquisition A',t=>{
 const x=setup(t);const a=loadProjectSnapshot(LIVE_PROJECT_ID,x.config);let reads=0;
 const b=structuredClone(x.state);b.project.title='Next test snapshot';b.epistemic_observations=[];b.reality_events=[];b.reality_states=[];
 const resolver=createHumanSourceResolver({runtimeConfigPath:x.runtimeConfigPath},(id,options)=>{
   reads++;const snapshot=loadProjectSnapshot(id,options);
   if(reads===1)withCanonicalWriter(x.config,o=>saveProject(b,o));
   return snapshot;
 });
 const entity=x.state.reality_entities.find(e=>x.state.epistemic_observations.some(o=>o.subject_ids.includes(e.id)))!;
 const reader=createHumanRealityReader(resolver), first=reader(LIVE_PROJECT_ID,entity.id);
 const claims=getClaimsForSubject(a.state,entity.id);
 assert.equal(reads,1);assert.equal(first.transport.source.snapshot_fingerprint,a.fingerprint);
 assert.deepEqual(first.canonical_records,{project:a.state.project,entity:getRealityWorldline(a.state,entity.id).entity,observations:getObservationsForSubject(a.state,entity.id),claims});
 assert.deepEqual(first.core_read_results,{worldline:getRealityWorldline(a.state,entity.id),evidence_for_claim:claims.map(c=>getEvidenceForClaim(a.state,c.id))});
 const next=reader(LIVE_PROJECT_ID,entity.id);assert.equal(reads,2);assert.notEqual(next.transport.source.snapshot_fingerprint,a.fingerprint);
 assert.equal(next.canonical_records.project.title,b.project.title);assert.equal(next.canonical_records.observations.length,0);
 assert.equal(next.core_read_results.worldline.events.length,0);assert.equal(next.core_read_results.worldline.states.length,0);
});

test('live HTTP browse/entity are read-only; standalone Evidence stays outside claim-linked scope',async t=>{
 const x=setup(t);let reads=0;
 const resolver=createHumanSourceResolver({runtimeConfigPath:x.runtimeConfigPath},(id,o)=>{reads++;return loadProjectSnapshot(id,o);});
 writeFileSync(join(x.config.storageDir,'.ground-writer.lock'),'test-only existing owner lock');
 writeFileSync(join(x.config.storageDir,'.ground-leftover.tmp'),'test-only leftover');
 const before=readFileSync(x.file);const names=readdirSync(x.config.storageDir);const manifest=readFileSync(join(x.config.storageDir,'.ground-storage-root.json'));
 const rootBytes=names.map(name=>[name,readFileSync(join(x.config.storageDir,name))] as const);
 const entity=x.state.reality_entities[0];
 await http(resolver,async url=>{
  const project=await fetch(url+'/projects/'+LIVE_PROJECT_ID);assert.equal(project.status,200);assert.equal(project.headers.get('cache-control'),'no-store');
  const p=await project.json();assert.deepEqual(p.canonical_project,x.state.project);assert.equal(p.canonical_entities.length,x.state.reality_entities.length);assert.equal(reads,1);
  const response=await fetch(`${url}/reality/${LIVE_PROJECT_ID}/${entity.id}`);assert.equal(response.status,200);const body=await response.json();assert.equal(reads,2);
  assert.equal(body.transport.source.snapshot_fingerprint,p.transport.source.snapshot_fingerprint);assert.equal(body.transport.source.source_mode,'mutable_canonical_storage');assert.ok(!('fixture' in body.transport.source));
  assert.equal(x.state.evidence.length,1);assert.deepEqual(body.core_read_results.evidence_for_claim,[]);assert.ok(!('evidence' in body.transport.returned_counts));
  assert.doesNotMatch(JSON.stringify(body.transport),/storageDir|runtimeConfigPath|\/private|\/Users/);
  const bad=await fetch(`${url}/projects/${LIVE_PROJECT_ID}?root=/tmp`);assert.equal(bad.status,400);assert.equal(reads,2);
 });
 assert.deepEqual(readFileSync(x.file),before);assert.deepEqual(readdirSync(x.config.storageDir),names);assert.deepEqual(readFileSync(join(x.config.storageDir,'.ground-storage-root.json')),manifest);
 for(const[name,bytes]of rootBytes)assert.deepEqual(readFileSync(join(x.config.storageDir,name)),bytes);
});

test('proof/live resolution never falls across sources; ambiguous scope rejected',t=>{
 const x=setup(t);let proofReads=0,liveReads=0;
 const proof=createRealitySourceRegistry(realitySourceRegistry.sources,()=>{proofReads++;throw Error('proof unavailable');});
 const resolver=createHumanSourceResolver({proofRegistry:proof,runtimeConfigPath:x.runtimeConfigPath},(id,o)=>{liveReads++;return loadProjectSnapshot(id,o);});
 assert.throws(()=>resolver.readSnapshot(proof.sources[0].project_id),/SOURCE_UNAVAILABLE/);assert.equal(liveReads,0);
 resolver.readSnapshot(LIVE_PROJECT_ID);assert.equal(proofReads,1);assert.equal(liveReads,1);
 assert.throws(()=>resolver.readSnapshot('../../etc/passwd'),/UNKNOWN_PROJECT/);assert.equal(liveReads,1);
 const conflict=createRealitySourceRegistry([{...proof.sources[0],project_id:LIVE_PROJECT_ID}]);
 assert.throws(()=>createHumanSourceResolver({proofRegistry:conflict,runtimeConfigPath:x.runtimeConfigPath}),/AMBIGUOUS_SOURCE_REGISTRY/);
});

test('config failures never invoke storage or default fallback; proof reads remain available',t=>{
 const x=setup(t);let reads=0;
 for(const path of ['relative','',join(x.dir,'missing'),x.runtimeConfigPath]){
  if(path===x.runtimeConfigPath)writeFileSync(path,JSON.stringify({mode:'local',storageDir:x.config.storageDir}));
  const r=createHumanSourceResolver({runtimeConfigPath:path},()=>{reads++;throw Error('no storage reads');});
  assert.equal(r.sources.length,4);assert.throws(()=>r.readSnapshot(LIVE_PROJECT_ID),/LIVE_RUNTIME_CONFIG_UNAVAILABLE/);
  assert.equal(r.readSnapshot(realitySourceRegistry.sources[0].project_id).source.source_mode,'immutable_proof_snapshot');
 }
 assert.equal(reads,0);
});

for(const [name,code] of [['root','LIVE_ROOT_UNAVAILABLE'],['missing','LIVE_PROJECT_FILE_MISSING'],['corrupt','LIVE_SNAPSHOT_VALIDATION_FAILURE'],['id','LIVE_PROJECT_ID_MISMATCH'],['permission','LIVE_PERMISSION_DENIED']] as const){
 test(`registered live ${name} failure is explicit HTTP 503, never empty data or path disclosure`,async t=>{
  const x=setup(t);
  if(name==='root')writeFileSync(x.runtimeConfigPath,JSON.stringify({...x.config,storageDir:join(x.dir,'absent')}));
  if(name==='missing')unlinkSync(x.file);
  if(name==='corrupt')writeFileSync(x.file,'{"schema_version":"0.1.25"}');
  if(name==='id')writeFileSync(x.file,JSON.stringify(createEmptyProject({title:'different Project'})));
  const r=createHumanSourceResolver({runtimeConfigPath:x.runtimeConfigPath},name==='permission'?()=>{throw Object.assign(Error('private path'),{code:'EACCES'});}:loadProjectSnapshot);
  await http(r,async url=>{for(const path of ['/projects/'+LIVE_PROJECT_ID,`/reality/${LIVE_PROJECT_ID}/${x.state.reality_entities[0].id}`]){
   const response=await fetch(url+path);assert.equal(response.status,503);assert.deepEqual(await response.json(),{transport_error:{code}});
  }});
 });
}
