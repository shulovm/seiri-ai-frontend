import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tsImport} from 'tsx/esm/api';
import {createHumanOperatingReader} from './read-adapter.js';
import {realitySourceRegistry,createRealitySourceRegistry} from './source-registry.js';
import {createHumanSourceResolver,LIVE_PROJECT_ID} from './source-resolver.js';
import {normalizeProjectState} from '../../ground-core/migrate.js';
const {default:express}=await tsImport('express',import.meta.url);
const {createHumanInterfaceRouter}=await tsImport('./http-route.js',import.meta.url);
for(const source of realitySourceRegistry.sources)test(`${source.source_key}: operating is one verified snapshot, exact records and nulls`,()=>{
 const bytes=readFileSync(new URL('../../'+source.fixture_path,import.meta.url));let reads=0;
 const registry=createRealitySourceRegistry([source],()=>{reads++;if(reads>1)throw Error('second acquisition');return bytes;});
 const expected=normalizeProjectState(JSON.parse(bytes.toString()));const body=createHumanOperatingReader(registry)(source.project_id);
 assert.equal(reads,1);assert.deepEqual(body.canonical_operating_records,{current_state:expected.current_state,blockers:expected.blockers,next_actions:expected.next_actions});
 assert.equal(body.transport.source.snapshot_fingerprint,source.sha256);assert.deepEqual(body.canonical_project,expected.project);
 assert.throws(()=>createHumanOperatingReader(registry)('unregistered'),/PROJECT_SCOPE_MISMATCH/);
});
test('populated in-memory unit data preserves status, ordering, references and times without ranking',()=>{
 const source=realitySourceRegistry.sources[0];const state=structuredClone(realitySourceRegistry.read(source.project_id).state);
 const time=state.updated_at;
 state.blockers=[{id:'11111111-2222-4333-8444-555555555555',project_id:source.project_id,goal_id:null,title:'Unit-only blocker',description:'unit test',severity:'low',status:'resolved',created_at:time,updated_at:time}];
 state.next_actions=[{id:'22222222-2222-4333-8444-555555555555',project_id:source.project_id,goal_id:null,blocker_id:state.blockers[0].id,depends_on_action_id:null,title:'Unit-only action',description:null,status:'done',due_at:null,sort_order:9,created_at:time,updated_at:time}];
 const bytes=Buffer.from(JSON.stringify(state));const selected={...source,sha256:createHash('sha256').update(bytes).digest('hex'),stored_schema:state.schema_version,read_schema:state.schema_version};
 const result=createHumanOperatingReader(createRealitySourceRegistry([selected],()=>bytes))(source.project_id);
 assert.deepEqual(result.canonical_operating_records.blockers,state.blockers);assert.deepEqual(result.canonical_operating_records.next_actions,state.next_actions);
});
test('operating HTTP accepts only registered GET scope; no-store and failures never empty success',async()=>{
 const read=createHumanOperatingReader();const app=express();app.use('/api/human-interface',createHumanInterfaceRouter(undefined,undefined,undefined,read));
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));const address=server.address();assert.ok(address&&typeof address!=='string');
 const base=`http://127.0.0.1:${address.port}/api/human-interface/projects/`;const path=base+realitySourceRegistry.sources[0].project_id+'/operating';
 try{
 const response=await fetch(path);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');assert.equal((await response.json()).transport.contract,'human-interface-project-operating.v1');
 assert.equal((await fetch(path,{method:'POST'})).status,405);assert.equal((await fetch(path+'?sort=priority')).status,400);assert.equal((await fetch(base+'unknown/operating')).status,404);
 }finally{await new Promise<void>(r=>server.close(()=>r()));}
});
test('actual live operating read is exact and never writes', {skip:!process.env.GROUND_RUNTIME_CONFIG},()=>{
 const config=JSON.parse(readFileSync(process.env.GROUND_RUNTIME_CONFIG!,'utf8'));const p=config.storageDir+'/'+LIVE_PROJECT_ID+'.json';const before=readFileSync(p);const state=JSON.parse(before.toString());
 const body=createHumanOperatingReader(createHumanSourceResolver({runtimeConfigPath:process.env.GROUND_RUNTIME_CONFIG}))(LIVE_PROJECT_ID);
 assert.deepEqual(body.canonical_operating_records,{current_state:state.current_state,blockers:state.blockers,next_actions:state.next_actions});assert.equal(body.transport.source.snapshot_fingerprint,createHash('sha256').update(before).digest('hex'));assert.deepEqual(readFileSync(p),before);
});
