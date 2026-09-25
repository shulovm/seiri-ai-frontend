import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { config, verify } from './verify.js';
const root=resolve('ground-core/experimental/historical-reality');
const env={GROUND_WORKER_INPUT_DIR:root,GROUND_WORKER_INPUT_SCOPE:'historical-round6-staging'};
test('configuration fails closed without approved scope, explicit path, valid interval',()=>{
 for(const e of [{},{...env,GROUND_WORKER_INPUT_SCOPE:'production'},{...env,GROUND_WORKER_INPUT_DIR:'relative'},{...env,GROUND_WORKER_INTERVAL_MS:'NaN'}]) assert.throws(()=>config(e));
});
test('admitted corpus retains source routes and has no production authority',()=>{
 const r=verify(config(env)); assert.equal(r.source_traversals,87);assert.equal(r.queries_checked,40);assert.equal(r.production_authority,false);
});
test('changed corpus fails integrity without modifying any bytes',()=>{
 const dir=mkdtempSync(join(tmpdir(),'ground-worker-corrupt-'));
 try { cpSync(root,dir,{recursive:true});const path=join(dir,'round1.dataset.json');writeFileSync(path,readFileSync(path,'utf8')+' ');
 assert.throws(()=>verify(config({...env,GROUND_WORKER_INPUT_DIR:dir})),/INPUT_INTEGRITY/);
 assert.ok(readFileSync(path,'utf8').endsWith(' '));
 } finally {rmSync(dir,{recursive:true,force:true});}
});
for(const signal of ['SIGTERM','SIGINT'] as const) test('compiled worker readiness and clean '+signal,async()=>{
 const portServer=createServer();portServer.listen(0,'127.0.0.1');await once(portServer,'listening');const port=(portServer.address() as {port:number}).port;await new Promise<void>(r=>portServer.close(()=>r()));
 const child=spawn(process.execPath,['dist-worker/containers/ground-worker/main.js'],{env:{...process.env,...env,GROUND_WORKER_HEALTH_PORT:String(port)}});
 let stdout='';let stderr='';child.stdout.on('data',b=>stdout+=b);child.stderr.on('data',b=>stderr+=b);
 const exited=once(child,'exit');
 try {
  let ok=false;for(let n=0;n<100;n++){try{ok=(await fetch('http://127.0.0.1:'+port+'/readyz')).ok;}catch{}if(ok)break;await new Promise(r=>setTimeout(r,50));}
  assert.ok(ok,stdout+stderr);assert.equal((await fetch('http://127.0.0.1:'+port+'/healthz')).status,200);
  child.kill(signal);const result=await Promise.race([exited,new Promise((_,reject)=>setTimeout(()=>reject(new Error('shutdown timeout')),5000).unref())]);
  assert.deepEqual(result,[0,null]);assert.equal(stderr,'');assert.ok(stdout.split('\n').filter(Boolean).every(l=>JSON.parse(l).event));assert.match(stdout,/worker_stopped/);
 } finally {if(child.exitCode===null)child.kill('SIGKILL');}
});
test('bad input is alive but never ready and never reports success',async()=>{
 const portServer=createServer();portServer.listen(0,'127.0.0.1');await once(portServer,'listening');const port=(portServer.address() as {port:number}).port;await new Promise<void>(r=>portServer.close(()=>r()));
 const child=spawn(process.execPath,['dist-worker/containers/ground-worker/main.js'],{env:{...process.env,...env,GROUND_WORKER_INPUT_DIR:'/nonexistent-ground-worker-input',GROUND_WORKER_HEALTH_PORT:String(port)}});
 let stdout='';child.stdout.on('data',b=>stdout+=b);const exited=once(child,'exit');
 try {let response:Response|undefined;for(let n=0;n<100;n++){try{response=await fetch('http://127.0.0.1:'+port+'/readyz');break;}catch{}await new Promise(r=>setTimeout(r,50));}
 assert.equal(response?.status,503);assert.match(stdout,/snapshot_integrity_failed/);assert.doesNotMatch(stdout,/snapshot_integrity_checked/);child.kill('SIGTERM');await exited;
 } finally {if(child.exitCode===null)child.kill('SIGKILL');}
});
