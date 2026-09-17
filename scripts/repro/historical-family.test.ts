import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,mkdirSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {loadFamilyManifest,parseFamilyManifest,verifyHistoricalFamily,executeHistoricalFamilyVerification} from '../historical-dependencies/family.js';
import {assertCurrentBoundary} from '../historical-dependencies/current-boundary.js';
import {HistoricalRepository} from '../historical-dependencies/resolver.js';
const root=resolve('.');
test('registered family manifest mutation rejected including checkpoint and compiler paths',()=>{
 const bytes=readFileSync(join(root,'docs/historical-freeze-004/live-005.json'));
 for(const change of [{checkpoint_commit:'0'.repeat(40)},{compiler_config_ref:'../../tsconfig.json'},{source_roots:['/tmp/types.ts']},{expected_package_fingerprint:'0'.repeat(64)}])
  assert.throws(()=>parseFamilyManifest('live-005.json',Buffer.from(JSON.stringify({...JSON.parse(bytes.toString()),...change}))),/MANIFEST_CHANGED/);
});
test('family handle is opaque; injected files, symlinks, config/source mutations fail closed',()=>{
 const h=verifyHistoricalFamily(root,'live-003-review.json');
 try{
  assert.throws(()=>executeHistoricalFamilyVerification({...h}),/UNREGISTERED/);
  for(const p of ['unexpected.js','ground-core/types.ts','historical-typecheck.json','family-manifest.json']){
   const target=join(h.root,p);let before:Buffer|undefined;try{before=readFileSync(target)}catch{}
   writeFileSync(target,'injected');assert.throws(()=>executeHistoricalFamilyVerification(h),/TREE_CHANGED/);
   if(before)writeFileSync(target,before);else rmSync(target);
  }
  symlinkSync(root,join(h.root,'escape'));assert.throws(()=>executeHistoricalFamilyVerification(h),/SYMLINK/);rmSync(join(h.root,'escape'));
  h.receipt.checkpoint_commit='forged';
  Object.assign(h,{root:'/tmp',verify:()=>{}});
  const result=executeHistoricalFamilyVerification(h);assert.equal(result.status,0);assert.equal(result.receipt.checkpoint_commit,'25ba36665c1034c1317e7556abea007bb08da539');
 }finally{h.cleanup();}
});
test('scratch permission does not authorize source writes, outside imports or child processes',()=>{
 const h=verifyHistoricalFamily(root,'live-003-review.json'),scratch=mkdtempSync(join(tmpdir(),'family-negative-'));
 try{
  const args=['--permission','--allow-fs-read='+h.root,'--allow-fs-read='+scratch,'--allow-fs-write='+scratch];
  for(const code of [`require('node:fs').writeFileSync(${JSON.stringify(join(h.root,'ground-core/types.ts'))},'x')`,`require('node:fs').readFileSync(${JSON.stringify(join(root,'package.json'))})`,`require('node:child_process').execSync('true')`]){
   const r=spawnSync(process.execPath,[...args,'-e',code],{cwd:scratch,env:{NODE_PATH:'',TMPDIR:scratch},encoding:'utf8'});assert.notEqual(r.status,0);assert.match(r.stderr,/ERR_ACCESS_DENIED/);
  }
  h.verify();
 }finally{h.cleanup();rmSync(scratch,{recursive:true,force:true});}
});
test('exclude alone cannot hide current import or changed historical assertions',()=>{
 const temp=mkdtempSync(join(tmpdir(),'family-boundary-')),m=loadFamilyManifest('live-005.json'),repo=new HistoricalRepository(root);
 const historical='ground-core/injections/historical-expansion-v1/package.ts';
 try{
  mkdirSync(join(temp,'ground-core/injections/historical-expansion-v1'),{recursive:true});
  writeFileSync(join(temp,historical),repo.resolveHistoricalDependency(m.dependencies.find(d=>d.repo_relative_path===historical)!));
  writeFileSync(join(temp,'ground-core/tsconfig.json'),JSON.stringify({compilerOptions:{noEmit:true},include:['entry.ts'],exclude:['injections/**']}));
  writeFileSync(join(temp,'ground-core/entry.ts'),"import './injections/historical-expansion-v1/package.js';");
  assert.throws(()=>assertCurrentBoundary(temp),/CURRENT_IMPORTS_HISTORICAL_SOURCE/);
  writeFileSync(join(temp,'ground-core/entry.ts'),'export {};');assert.equal(assertCurrentBoundary(temp).covered_files,1);
  writeFileSync(join(temp,historical),'export {};');assert.throws(()=>assertCurrentBoundary(temp),/UNCOVERED_HISTORICAL_BYTES/);
 }finally{rmSync(temp,{recursive:true,force:true});}
});
