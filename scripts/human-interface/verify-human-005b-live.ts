import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { tsImport } from 'tsx/esm/api';
import { loadProjectSnapshot } from '../../ground-core/file-store.js';
import { LIVE_PROJECT_ID } from '../../server/human-interface/source-resolver.js';
import { getRealityWorldline } from '../../ground-core/reality/worldline.js';
// Opt-in local verification only. No live mutation, owner session, cleanup or defaults.
const path=process.env.GROUND_RUNTIME_CONFIG;
assert.ok(path,'Set the server-owned GROUND_RUNTIME_CONFIG explicitly');
const config=JSON.parse(readFileSync(path,'utf8'));
assert.equal(config.mode,'canonical-live');
const expected='f1ed694f3e0c3a10d383e816f43ca003cd6c123dad18c3f0688d2289c0f3e3bc';
const entity='fbdfd235-1a5b-5a5d-ad30-6f2c170fe9f9';
const observation='87ae62f9-9481-5577-a299-813c022d2007';
const evidence='3151b313-d5bc-5b58-a17d-a61add22f22d';
const before=loadProjectSnapshot(LIVE_PROJECT_ID,{mode:'canonical-live',storageDir:config.storageDir});
assert.equal(before.fingerprint,expected,'Investigate any difference; never repair or silently accept');
assert.equal(before.state.evidence.length,1);assert.equal(before.state.evidence[0].id,evidence);
const files=readdirSync(config.storageDir).sort();
const rootBytes=files.map(name=>[name,readFileSync(join(config.storageDir,name))] as const);
const { default: express }=await tsImport('express',import.meta.url);
const { createHumanInterfaceRouter }=await tsImport('../../server/human-interface/http-route.js',import.meta.url);
const app=express();app.use('/api/human-interface',createHumanInterfaceRouter());
const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
const address=server.address();assert.ok(address && typeof address!=='string');
try {
 const url=`http://127.0.0.1:${address.port}/api/human-interface`;
 async function get(route:string){const response=await fetch(url+route);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');return response.json();}
 const catalog=await get('/projects');assert.equal(catalog.registered_projects.length,4);
 const project=await get('/projects/'+LIVE_PROJECT_ID);
 assert.deepEqual(project.canonical_project,before.state.project);assert.equal(project.canonical_entities.length,1);assert.equal(project.canonical_entities[0].id,entity);
 const result=await get(`/reality/${LIVE_PROJECT_ID}/${entity}`);
 assert.equal(result.canonical_records.entity.id,entity);assert.deepEqual(result.canonical_records.observations,before.state.epistemic_observations);assert.equal(result.canonical_records.observations[0].id,observation);
 assert.deepEqual(result.transport.returned_counts,{observations:1,claims:0,events:0,states:0});
 assert.deepEqual(result.core_read_results.worldline,getRealityWorldline(before.state,entity));assert.deepEqual(result.core_read_results.evidence_for_claim,[]);
 assert.deepEqual(result.core_read_results.evidence_for_observation,[{observation_id:observation,evidence:before.state.evidence}]);
 assert.equal(result.core_read_results.evidence_for_observation[0].evidence[0].kind,'observation_ref');
 assert.equal(result.core_read_results.evidence_for_observation[0].evidence[0].observation_id,observation);
 for(const body of [project,result]){assert.equal(body.transport.source.snapshot_fingerprint,expected);assert.equal(body.transport.source.source_mode,'mutable_canonical_storage');assert.equal(body.transport.source.stored_schema_version,'0.1.25');assert.equal(body.transport.source.read_schema_version,'0.1.25');assert.doesNotMatch(JSON.stringify(body.transport),/\/Users|storageDir|runtimeConfigPath/);}
 assert.deepEqual(readdirSync(config.storageDir).sort(),files);for(const[name,bytes]of rootBytes)assert.deepEqual(readFileSync(join(config.storageDir,name)),bytes);
 const afterHash=createHash('sha256').update(readFileSync(join(config.storageDir,LIVE_PROJECT_ID+'.json'))).digest('hex');assert.equal(afterHash,expected);
 console.log(JSON.stringify({checkpoint:'HUMAN-005B',result:'PASS',project_id:LIVE_PROJECT_ID,catalog_entries:4,title:project.canonical_project.title,entity_id:entity,observation_id:observation,canonical_evidence_id:evidence,canonical_evidence_count:1,claim_linked_response_bundles:0,observation_linked_response_bundles:1,observation_linked_evidence:result.core_read_results.evidence_for_observation[0].evidence,returned_counts:result.transport.returned_counts,before_fingerprint:before.fingerprint,after_fingerprint:afterHash,no_write:true,root_files_unchanged:true,source:result.transport.source,ui_proof:false},null,2));
} finally {await new Promise<void>((r,j)=>server.close((e?:Error)=>e?j(e):r()));}
