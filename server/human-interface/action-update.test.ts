import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,existsSync,readdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {createEmptyProject} from '../../ground-core/state-engine.js';
import {saveProject,loadProjectSnapshot} from '../../ground-core/file-store.js';
import {withCanonicalWriter,type CanonicalOwnerConfig} from '../../ground-core/storage-owner.js';
import {ValidationError} from '../../ground-core/errors.js';
import {BUSINESS_PROJECT_ID,LIVE_PROJECT_ID} from './source-resolver.js';
import {createActionUpdater,writeOrigin} from './action-update.js';
import {realitySourceRegistry} from './source-registry.js';
// @ts-expect-error Existing JS Express runtime has no installed declarations
import express from 'express';
// @ts-expect-error JS route
import {createActionUpdateRouter} from './action-route.js';
function setup(t:any,status:'pending'|'in_progress'|'done'='pending') {
 const dir=mkdtempSync(join(tmpdir(),'ground-action-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const config:CanonicalOwnerConfig={mode:'canonical-live',storageDir:join(dir,'projects'),writerOwner:'ground-local-cli-v0'};
 const path=join(dir,'config.json');writeFileSync(path,JSON.stringify(config));
 const state=createEmptyProject({title:'isolated action test'});state.project.id=BUSINESS_PROJECT_ID;state.current_state.project_id=BUSINESS_PROJECT_ID;
 const id=randomUUID();state.next_actions.push({id,project_id:BUSINESS_PROJECT_ID,goal_id:null,blocker_id:null,depends_on_action_id:null,title:'Explicit unit action',description:null,status,due_at:null,sort_order:0,created_at:state.updated_at,updated_at:state.updated_at});
 withCanonicalWriter(config,o=>saveProject(state,o));
 const snapshot=()=>loadProjectSnapshot(BUSINESS_PROJECT_ID,config);
 return {dir,config,path,id,snapshot,update:createActionUpdater(path)};
}
test('pending -> in_progress -> done: only existing Action progresses, receipt and atomic publication',t=>{
 const x=setup(t);const a=x.snapshot();const first=x.update(BUSINESS_PROJECT_ID,x.id,'start',a.fingerprint);const b=x.snapshot();
 assert.equal(first.receipt.old_status,'pending');assert.equal(first.receipt.new_status,'in_progress');assert.equal(first.receipt.after_fingerprint,b.fingerprint);
 assert.deepEqual(b.state.current_state,a.state.current_state);assert.deepEqual(b.state.blockers,a.state.blockers);assert.equal(b.state.next_actions.length,1);
 const second=x.update(BUSINESS_PROJECT_ID,x.id,'complete',b.fingerprint);const c=x.snapshot();assert.equal(c.state.next_actions[0].status,'done');assert.equal(second.receipt.recorded_update,c.state.next_actions[0].updated_at);assert.notEqual(c.fingerprint,b.fingerprint);
 assert.equal(existsSync(join(x.config.storageDir,'.ground-writer.lock')),false);assert.equal(readdirSync(x.config.storageDir).some(p=>p.endsWith('.tmp')),false);
 assert.throws(()=>x.update(BUSINESS_PROJECT_ID,x.id,'complete',b.fingerprint),/SNAPSHOT_MISMATCH/);assert.equal(x.snapshot().fingerprint,c.fingerprint);
});
test('invalid transition, stale snapshot, missing precondition and unknown action do not mutate',t=>{
 const x=setup(t);const before=x.snapshot().fingerprint;
 for(const [id,tr,fp,error] of [[x.id,'complete',before,'INVALID_TRANSITION'],[x.id,'start','0'.repeat(64),'SNAPSHOT_MISMATCH'],[x.id,'start','', 'SNAPSHOT_PRECONDITION_REQUIRED'],[randomUUID(),'start',before,'ACTION_NOT_FOUND'],[x.id,'reopen',before,'INVALID_TRANSITION']]) {
 assert.throws(()=>x.update(BUSINESS_PROJECT_ID,id,tr,fp),new RegExp(error));assert.equal(x.snapshot().fingerprint,before);assert.equal(existsSync(join(x.config.storageDir,'.ground-writer.lock')),false);
 }
});
test('already changed status cannot be reapplied even with current fingerprint',t=>{const x=setup(t,'done');const before=x.snapshot().fingerprint;assert.throws(()=>x.update(BUSINESS_PROJECT_ID,x.id,'complete',before),/INVALID_TRANSITION/);assert.equal(x.snapshot().fingerprint,before);});
test('proof, Historical, unregistered and path scopes are denied',t=>{const x=setup(t);for(const project of [LIVE_PROJECT_ID,randomUUID(),'../../escape',...realitySourceRegistry.sources.map(s=>s.project_id)])assert.throws(()=>x.update(project,x.id,'start',x.snapshot().fingerprint),/WRITE_SCOPE_DENIED/);});
test('owner conflict refuses bypass and preserves the existing lock',t=>{const x=setup(t);const before=x.snapshot().fingerprint;withCanonicalWriter(x.config,()=>{assert.throws(()=>x.update(BUSINESS_PROJECT_ID,x.id,'start',before),/OWNER_UNAVAILABLE/);assert.equal(existsSync(join(x.config.storageDir,'.ground-writer.lock')),true);});assert.equal(x.snapshot().fingerprint,before);});
test('validation/storage failures release owner and leave original bytes; no fallback',t=>{
 const x=setup(t);const before=x.snapshot().fingerprint;
 for(const error of [new ValidationError('test'),new Error('disk failure')]){
 const update=createActionUpdater(x.path,{load:loadProjectSnapshot,save:()=>{throw error;}});
 assert.throws(()=>update(BUSINESS_PROJECT_ID,x.id,'start',before),error instanceof ValidationError?/CANONICAL_VALIDATION_FAILURE/:/STORAGE_FAILURE/);
 assert.equal(x.snapshot().fingerprint,before);assert.equal(existsSync(join(x.config.storageDir,'.ground-writer.lock')),false);
 }
});
test('after-publish read failure is safe on retry: stale fingerprint cannot mutate again',t=>{
 const x=setup(t);const before=x.snapshot().fingerprint;let reads=0;
 const update=createActionUpdater(x.path,{save:saveProject,load:(...args)=>{if(++reads===2)throw Error('lost response');return loadProjectSnapshot(...args);}});
 assert.throws(()=>update(BUSINESS_PROJECT_ID,x.id,'start',before),/STORAGE_FAILURE/);const after=x.snapshot();assert.equal(after.state.next_actions[0].status,'in_progress');assert.throws(()=>x.update(BUSINESS_PROJECT_ID,x.id,'start',before),/SNAPSHOT_MISMATCH/);assert.equal(x.snapshot().fingerprint,after.fingerprint);assert.equal(existsSync(join(x.config.storageDir,'.ground-writer.lock')),false);
});
test('HTTP accepts exact origin and intent only; rejects arbitrary patch/root and cross origin',async t=>{
 const x=setup(t);const app=express();const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));t.after(()=>server.close());const address=server.address();assert.ok(address&&typeof address!=='string');const origin=`http://127.0.0.1:${address.port}`;
 app.use('/api/human-interface',createActionUpdateRouter({runtimeConfigPath:x.path,origin}));
 const url=`${origin}/api/human-interface/projects/${BUSINESS_PROJECT_ID}/actions/${x.id}/status`;const fingerprint=x.snapshot().fingerprint;
 const headers={'Content-Type':'application/json',Origin:origin,'If-Ground-Snapshot-Fingerprint':fingerprint};
 for(const body of [{transition:'start',root:'/tmp'},{operations:[]},{transition:'start',status:'done'}]) assert.equal((await fetch(url,{method:'POST',headers,body:JSON.stringify(body)})).status,400);
 assert.equal((await fetch(url,{method:'POST',headers:{...headers,Origin:'http://evil.invalid'},body:JSON.stringify({transition:'start'})})).status,403);
 assert.equal((await fetch(url)).status,405);
 const ok=await fetch(url,{method:'POST',headers,body:JSON.stringify({transition:'start'})});assert.equal(ok.status,200);assert.equal(ok.headers.get('cache-control'),'no-store');assert.equal((await ok.json()).receipt.new_status,'in_progress');
 assert.equal((await fetch(url,{method:'POST',headers,body:JSON.stringify({transition:'start'})})).status,409);
});
test('write origin is explicit local opt-in',()=>{for(const origin of ['https://public.example','http://localhost:3017/path','http://localhost:3017/','http://localhost.evil:3017'])assert.equal(writeOrigin(origin),undefined);assert.equal(writeOrigin('http://localhost:3017'),'http://localhost:3017');});

test('corrupt canonical snapshot is validation failure, not an empty/action-free state',t=>{
 const x=setup(t);const before=x.snapshot().fingerprint;const file=join(x.config.storageDir,BUSINESS_PROJECT_ID+'.json');writeFileSync(file,'{}');
 assert.throws(()=>x.update(BUSINESS_PROJECT_ID,x.id,'start',before),/CANONICAL_VALIDATION_FAILURE/);assert.equal(readFileSync(file,'utf8'),'{}');assert.equal(existsSync(join(x.config.storageDir,'.ground-writer.lock')),false);
});
