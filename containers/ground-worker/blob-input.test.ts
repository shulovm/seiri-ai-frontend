import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {config,verify} from './verify.js';
import {verifyBlob,managedIdentityToken,sourceConfig,blobBase,prefix,release,identityResourceId,type Fetch} from './blob-input.js';
const root=resolve('ground-core/experimental/historical-reality');
const input=config({GROUND_WORKER_INPUT_DIR:root,GROUND_WORKER_INPUT_SCOPE:'historical-round6-staging'});
const env={GROUND_WORKER_IDENTITY_RESOURCE_ID:identityResourceId,IDENTITY_ENDPOINT:'http://127.0.0.1/identity',IDENTITY_HEADER:'test-platform-header'};
const manifest=readFileSync('containers/ground-worker/corpus-pins.json');
const pins=JSON.parse(manifest.toString()) as {path:string}[];
const fixture=(change?:(path:string,data:Buffer)=>Response):Fetch=>(async(url,init)=>{
 assert.equal(init?.method,'GET');assert.equal(init?.redirect,'error');
 const u=new URL(String(url));
 if(u.hostname==='127.0.0.1') {
  assert.equal(u.searchParams.get('resource'),'https://storage.azure.com/');assert.equal(u.searchParams.get('mi_res_id'),identityResourceId);
  return Response.json({access_token:'test-token',expires_on:String(Math.floor(Date.now()/1000)+3600)});
 }
 assert.ok(u.href.startsWith(blobBase+'/'+prefix+'/'));assert.equal((init?.headers as Record<string,string>).Authorization,'Bearer test-token');
 const path=decodeURIComponent(u.href.slice((blobBase+'/'+prefix+'/').length));
 const data=path==='manifest.json'?manifest:readFileSync(resolve(root,path.slice('files/'.length)));
 return change?.(path,data)??new Response(new Uint8Array(data));
}) as Fetch;
const run=(f:Fetch,signal=new AbortController().signal)=>verifyBlob(input,env,signal,f);
test('source defaults to embedded; malformed source or missing MI never falls back',()=>{
 assert.equal(sourceConfig({}),'embedded');assert.throws(()=>sourceConfig({GROUND_WORKER_INPUT_SOURCE:'unknown'}));assert.throws(()=>sourceConfig({GROUND_WORKER_INPUT_SOURCE:'azure-blob'}));
});
test('all 152 blob bytes reproduce the exact original verification gate',async()=>{
 const before=readdirSync(tmpdir()).filter(x=>x.startsWith('ground-blob-'));
 const got=await run(fixture());assert.deepEqual(got,{...verify(input),input_source:'azure-blob',corpus_release:release});
 assert.deepEqual(readdirSync(tmpdir()).filter(x=>x.startsWith('ground-blob-')),before);
});
test('manifest whitespace, truncation or duplicate entries fail before payload retrieval',async()=>{
 for(const raw of [Buffer.concat([manifest,Buffer.from(' ')]),manifest.subarray(0,20),Buffer.from(JSON.stringify([...pins,pins[0]]))]) {
  await assert.rejects(run(fixture((p,d)=>new Response(new Uint8Array(p==='manifest.json'?raw:d)))));
 }
});
test('missing payload, 403 and corrupt bytes fail closed without embedded substitution',async()=>{
 for(const mode of ['missing','denied','corrupt'])await assert.rejects(run(fixture((p,d)=>{
  if(p==='files/'+pins[0].path)return mode==='missing'?new Response('',{status:404}):mode==='denied'?new Response('',{status:403}):new Response('corrupt');
  return new Response(new Uint8Array(d));
 })));
});
test('oversized response rejected before consuming payload',async()=>{
 await assert.rejects(run(fixture((p,d)=>new Response(new Uint8Array(d),{headers:p.startsWith('files/')?{'content-length':'999999999'}:{}}))),/INPUT_TOO_LARGE/);
});
test('redirect responses are refused',async()=>{
 await assert.rejects(run(fixture(()=>new Response(null,{status:302,headers:{location:'https://example.com'}}))),/BLOB_READ_FAILED/);
});
test('expired or unsuccessful identity response fails without blob requests',async()=>{
 for(const response of [new Response('',{status:403}),Response.json({access_token:'bad',expires_on:'0'})]) {
  await assert.rejects(managedIdentityToken(env,new AbortController().signal,(async()=>response) as Fetch));
 }
});
test('aborted retrieval cannot report success and cleans partial scratch',async()=>{
 const before=readdirSync(tmpdir()).filter(x=>x.startsWith('ground-blob-'));const c=new AbortController();
 await assert.rejects(run(fixture((p,d)=>{if(p.startsWith('files/'))c.abort();return new Response(new Uint8Array(d));}),c.signal));
 assert.deepEqual(readdirSync(tmpdir()).filter(x=>x.startsWith('ground-blob-')),before);
});
