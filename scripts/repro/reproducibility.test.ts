import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {generateFixtures,writeFixtures} from './generate-fixtures.js';
import {materializeRound6,traceTerritory,queryTerritory,composeTerritorialAssertions,assertTerritorialProjection,type Round6} from '../../ground-core/experimental/historical-reality/round6/territory.js';
import {createEmptyProject,applyPatch} from '../../ground-core/state-engine.js';
import {HistoricalRepository} from '../historical-dependencies/resolver.js';
import {loadDependencyManifest} from '../historical-dependencies/execution.js';

const hash=(b:string|Buffer)=>createHash('sha256').update(b).digest('hex');
test('fixture identities, references, and bytes survive two independent process restarts',()=>{
 const manifests=[];
 for(let i=0;i<2;i++){
  const dir=mkdtempSync(join(tmpdir(),'ground-fixture-proof-'));
  writeFileSync(join(dir,'.ground-repro-test-workspace'),'GROUND-REPRO-001\n');
  const p=spawnSync(process.execPath,['--import','tsx',resolve('scripts/repro/setup-fixtures.ts'),dir],{encoding:'utf8'});
  assert.equal(p.status,0,p.stderr);manifests.push(JSON.parse(readFileSync(join(dir,'fixture-digests.json'),'utf8')));
 }
 assert.deepEqual(manifests[0],manifests[1]);
 for(const state of generateFixtures()){
  for(const values of Object.values(state)){
   for(const entity of Array.isArray(values)?values:[]){
    if(entity&&typeof entity==='object'&&'project_id' in entity)assert.equal(entity.project_id,state.project.id);
   }
  }
  assert.equal(state.current_state.project_id,state.project.id);
  if(state.current_state.primary_goal_id)assert.ok(state.goals.some(g=>g.id===state.current_state.primary_goal_id));
  if(state.current_state.primary_next_action_id)assert.ok(state.next_actions.some(a=>a.id===state.current_state.primary_next_action_id));
  for(const action of state.next_actions){
   if(action.goal_id)assert.ok(state.goals.some(g=>g.id===action.goal_id));
   if(action.depends_on_action_id)assert.ok(state.next_actions.some(a=>a.id===action.depends_on_action_id));
  }
 }
});
test('fixture setup refuses to overwrite an existing project',()=>{
 const dir=mkdtempSync(join(tmpdir(),'ground-fixture-collision-'));
 const before=writeFixtures(dir);assert.throws(()=>writeFixtures(dir),/EEXIST/);
 for(const f of before)assert.equal(hash(readFileSync(join(dir,f.name))),f.sha256);
});
test('all adopted Historical artifacts still match pre-existing checkpoint pins byte for byte',()=>{
 const manifest=JSON.parse(readFileSync(resolve('docs/repro-001/historical-artifacts.json'),'utf8')) as {path:string,bytes:number,sha256:string,pinWitnesses:{manifest:string,sha256:string}[]}[];
 const repository=new HistoricalRepository(resolve('.'));
 const pins=loadDependencyManifest('repro-001-artifacts.json').manifest.dependencies;
 for(const f of manifest){
  // Only the conflicting executable identity moves to checkpoint resolution.
  // Other adopted current files retain the existing exact-byte guard.
  const pin=pins.find(p=>p.repo_relative_path===f.path);
  assert.ok(pin);assert.equal(pin.expected_sha256,f.sha256);assert.equal(pin.expected_byte_length,f.bytes);
  const raw=f.path==='ground-core/experimental/historical-reality/substrate.ts'
   ? repository.resolveHistoricalDependency(pin) : readFileSync(resolve(f.path));assert.equal(raw.length,f.bytes,f.path);assert.equal(hash(raw),f.sha256,f.path);
  assert.ok(f.pinWitnesses.length);
  for(const w of f.pinWitnesses){
   const p=w.manifest.includes('/round7/')?'docs/repro-001/round7-pin-witness.json':w.manifest;
   if(!/round[567]\//.test(w.manifest))continue;
   const pins=JSON.parse(readFileSync(resolve(p),'utf8')).files as {path:string,sha256:string}[];
   assert.ok(pins.some(x=>x.path===f.path&&x.sha256===f.sha256),f.path);
  }
 }
});
test('Round6 materialization, 87 source traversals, 40 queries and canonical source content replay unchanged',()=>{
 const base=resolve('ground-core/experimental/historical-reality'),read=(p:string)=>readFileSync(join(base,p),'utf8');
 const r=JSON.parse(read('round6/round6.dataset.json')) as Round6;
 const data=materializeRound6(read('round1.dataset.json'),read('round2/round2.dataset.json'),read('round3/round3.dataset.json'),read('round4/round4.dataset.json'),read('round5/candidate-inventory.json'),r);
 assert.deepEqual(data,JSON.parse(read('round6/replay/materialized.dataset.json')));
 const derived=[...r.rows,...r.places,...r.contrasts,...r.chains,...r.cases,...r.cases.map(x=>x.reconstruction),...r.dependencies,...Object.values(r.documentary).flat()];
 const traces=derived.map(x=>traceTerritory(data,r,x.id));
 assert.equal(traces.length,87);assert.deepEqual(traces,JSON.parse(read('round6/replay/evidence-traces.json')));
 const queries=r.rows.map(x=>queryTerritory(data,r,{place_id:x.place_id,actor_id:x.actor_id,dimension:x.dimension,functional:x.scope.functional,assertion_form:x.assertion_form,population:x.scope.population,infrastructure:x.scope.infrastructure,day:'1904-02-26'}));
 assert.equal(queries.length,40);assert.deepEqual(queries,JSON.parse(read('round6/replay/territorial-queries.json')));
 const p=createEmptyProject({title:'Round6 replay proof'});p.project.id='19041904-1904-4904-8904-190419046006';p.current_state.project_id=p.project.id;
 const state=applyPatch(p,composeTerritorialAssertions(data,r,p,'2026-09-14T04:15:55Z'));assertTerritorialProjection(state,data,r);
 const archived=JSON.parse(read('round6/replay/19041904-1904-4904-8904-190419046006.json'));
 const content=(v:unknown)=>JSON.parse(JSON.stringify(v,(k,v)=>['created_at','updated_at'].includes(k)?undefined:v));
 for(const key of ['claims','evidence','claim_evidence_links','reality_entities'] as const)assert.deepEqual(content(state[key]),content(archived[key]));
 assert.equal(state.reality_events.length+state.reality_states.length+state.epistemic_observations.length,0);
});
