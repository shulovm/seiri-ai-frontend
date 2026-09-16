import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { loadProjectSnapshot } from '../../file-store.js';
import { BASELINE,TARGET_PROJECT,dry,preflight,sha256,stableSerialize,TOTALS,groups,prepared,validatePrepared } from './package.js';
import { backup } from './recovery.js';
import { verifyFreeze } from './freeze.js';
const [root,humanRoot,commit]=process.argv.slice(2);assert(root&&isAbsolute(root),'Explicit absolute live root required');
// One canonical snapshot load, never owner acquisition or save.
const snapshot=loadProjectSnapshot(TARGET_PROJECT,{mode:'canonical-live',storageDir:root});
assert.equal(snapshot.fingerprint,BASELINE,'HOLD: live baseline changed');assert(snapshot.validation.valid);
const before=stableSerialize(snapshot.state),result=dry(snapshot.state);assert.deepEqual(result.review,dry(snapshot.state).review);assert.equal(stableSerialize(snapshot.state),before);
for(const [k,n] of Object.entries(TOTALS))assert.equal((result.after as any)[k].length,n);
const temp=mkdtempSync(join(tmpdir(),'live-005b-recovery-'));
try {const projects=join(temp,'projects');mkdirSync(projects);const ops=join(temp,'operations');const saved=backup(snapshot.bytes,ops,projects);assert.equal(sha256(readFileSync(saved)),BASELINE);assert.throws(()=>backup(snapshot.bytes,ops,projects));assert.throws(()=>backup(Buffer.from('wrong'),join(temp,'wrong'),projects));assert.throws(()=>backup(snapshot.bytes,join(projects,'ops'),projects));symlinkSync(projects,join(temp,'alias'));assert.throws(()=>backup(snapshot.bytes,join(temp,'alias','ops'),projects));}finally{rmSync(temp,{recursive:true,force:true});}
let compatibility:unknown='NOT_RUN';
if(humanRoot){
 assert(isAbsolute(humanRoot));const {createHumanRealityReader,createHumanBrowseReader}=await import(pathToFileURL(join(humanRoot,'server/human-interface/read-adapter.ts')).href);
 const source={source_key:'dry-memory-only',source_mode:'immutable_proof_snapshot',source_qualification:'LIVE-005B dry verification, not published',snapshot_fingerprint:sha256(stableSerialize(result.after)),sha256:sha256(stableSerialize(result.after)),stored_schema_version:result.after.schema_version,read_schema_version:result.after.schema_version};
 const resolver={sources:[],readSnapshot:(id:string)=>{assert.equal(id,TARGET_PROJECT);return {source,state:result.after};}};
 const reader=createHumanRealityReader(resolver),browse=createHumanBrowseReader(resolver);assert.equal(browse.project(TARGET_PROJECT).canonical_entities.length,11);
 const checks=result.after.reality_entities.map(entity=>{const response=reader(TARGET_PROJECT,entity.id),expected=groups.find(g=>g.document_id===entity.id)?.reports.length??1;assert.equal(response.canonical_records.observations.length,expected);assert.equal(response.canonical_records.claims.length,0);assert.equal(response.core_read_results.worldline.events.length,0);assert.equal(response.core_read_results.worldline.states.length,0);for(const b of response.core_read_results.evidence_for_observation){assert.equal(b.evidence.length,1);assert.equal(b.evidence[0].observation_id,b.observation_id);}return {entity_id:entity.id,observations:expected,evidence_per_observation:1};});
 compatibility={adapter_sha256:sha256(readFileSync(join(humanRoot,'server/human-interface/read-adapter.ts'))),checks};
}
const fingerprint=verifyFreeze();
if(commit){const receipt=prepared(commit,fingerprint);validatePrepared(receipt);}
assert.equal(sha256(readFileSync(join(root,`${TARGET_PROJECT}.json`))),BASELINE,'HOLD: live bytes changed');
console.log(stableSerialize({before_fingerprint:snapshot.fingerprint,live_after_fingerprint:BASELINE,stored_schema:snapshot.stored_schema_version,read_schema:snapshot.read_schema_version,validation:snapshot.validation,preflight:preflight(snapshot.state),recovery:'PASS: exact backup, overwrite/wrong hash/inside discovery/symlink rejection',compatibility,...result.review}).trimEnd());
