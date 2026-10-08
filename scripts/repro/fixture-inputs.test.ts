import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync,rmSync,symlinkSync,chmodSync,renameSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
// Plain Node runner module; loaded without changing canonical compiler/code.
const {loadFixtureContract,planFixtureInputs,materializeFixtureInputs,assertFixturePath,runnerTestEnvironment}=require('./fixture-inputs.mjs');
const hash=(b:Buffer)=>createHash('sha256').update(b).digest('hex');
function setup(t:any){
 const parent=mkdtempSync(join(tmpdir(),'runner-contract-')),repo=join(parent,'repo'),dest=join(parent,'dest');mkdirSync(repo);mkdirSync(dest);
 t.after(()=>rmSync(parent,{recursive:true,force:true}));
 const git=(...a:string[])=>execFileSync('git',['-C',repo,...a],{encoding:'utf8',env:{PATH:process.env.PATH,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null'}}).trim();
 const put=(p:string,b:string)=>{mkdirSync(join(repo,p,'..'),{recursive:true});writeFileSync(join(repo,p),b);};
 git('init','-q');put('ground-core/__tests__/claim-vnext.test.ts','// test authority');put('fixtures/claim-vnext/definitions.json','{"version":1}');
 const commit=()=>{git('add','.');git('-c','user.name=Runner test','-c','user.email=test@example.invalid','-c','core.hooksPath=/dev/null','commit','-qm','test fixture tree');return git('rev-parse','HEAD');};
 const pin=commit();
 const contract={...loadFixtureContract().contract,entries:[loadFixtureContract().contract.entries.find((e:any)=>e.root==='fixtures/claim-vnext')]};
 return {parent,repo,dest,git,put,commit,pin,contract};
}
test('tracked Git bytes ignore dirty/untracked files, preserve layout and exact receipt',t=>{
 const x=setup(t);x.put('fixtures/claim-vnext/definitions.json','DIRTY');x.put('fixtures/claim-vnext/untracked.json','UNTRACKED');
 const p=planFixtureInputs(x.repo,{contract:x.contract});const m=materializeFixtureInputs(p,x.dest);
 assert.equal(readFileSync(join(x.dest,'fixtures/claim-vnext/definitions.json'),'utf8'),'{"version":1}');assert.equal(existsSync(join(x.dest,'fixtures/claim-vnext/untracked.json')),false);
 assert.equal(m.receipt.file_count,1);assert.equal(m.receipt.commit,x.pin);assert.equal(m.receipt.files[0].sha256,hash(Buffer.from('{"version":1}')));m.verify();
});
test('required missing tracked input fails before execution even with same-name untracked file',t=>{
 const x=setup(t);x.git('rm','--cached','fixtures/claim-vnext/definitions.json');x.git('-c','user.name=Runner test','-c','user.email=test@example.invalid','-c','core.hooksPath=/dev/null','commit','-qm','remove tracked fixture');
 let ran=false;assert.throws(()=>{const p=planFixtureInputs(x.repo,{contract:x.contract});materializeFixtureInputs(p,x.dest);ran=true;},/RUNNER_REQUIRED_FIXTURE_MISSING/);assert.equal(ran,false);assert.equal(existsSync(join(x.dest,'fixtures')),false);
});
test('uncommitted new suite cannot silently activate fixtures from another authority',t=>{
 const x=setup(t);x.git('rm','--cached','ground-core/__tests__/claim-vnext.test.ts');x.git('-c','user.name=Runner test','-c','user.email=test@example.invalid','-c','core.hooksPath=/dev/null','commit','-qm','suite absent from tree');
 assert.throws(()=>planFixtureInputs(x.repo,{contract:x.contract}),/SUITE_NOT_IN_FIXTURE_COMMIT/);
});
test('path traversal, absolute sources, repository aliases and destination escape are refused',t=>{
 const x=setup(t);
 for(const p of ['../fixture.json','/tmp/fixture.json','fixtures/../outside','fixtures\\outside','.git/config'])assert.throws(()=>assertFixturePath(p),/PATH_REJECTED/);
 for(const p of ['/tmp','fixtures/../../runtime','ground-core/storage']){const c=structuredClone(x.contract);c.entries[0].root=p;assert.throws(()=>planFixtureInputs(x.repo,{contract:c}),/PATH_REJECTED|CONTRACT_INVALID/);}
 const alias=join(x.parent,'alias');symlinkSync(x.repo,alias);assert.throws(()=>planFixtureInputs(alias,{contract:x.contract}),/ROOT_REJECTED/);
 assert.throws(()=>planFixtureInputs('relative',{contract:x.contract}),/ROOT_REJECTED/);
 const plan=planFixtureInputs(x.repo,{contract:x.contract});assert.throws(()=>materializeFixtureInputs(plan,x.repo),/OVERLAP/);
 symlinkSync(x.repo,join(x.dest,'fixtures'));assert.throws(()=>materializeFixtureInputs(plan,x.dest),/TARGET_SYMLINK/);
});
test('all committed symlinks are rejected, including internal targets and directory roots',t=>{
 for(const target of ['/etc/passwd','definitions.json']){
  const x=setup(t);symlinkSync(target,join(x.repo,'fixtures/claim-vnext/alias'));x.commit();assert.throws(()=>planFixtureInputs(x.repo,{contract:x.contract}),/SYMLINK_OR_TYPE_REJECTED/);
 }
 const x=setup(t);x.git('rm','-r','fixtures/claim-vnext');mkdirSync(join(x.repo,'fixtures'),{recursive:true});symlinkSync('/tmp',join(x.repo,'fixtures/claim-vnext'));x.commit();assert.throws(()=>planFixtureInputs(x.repo,{contract:x.contract}),/SYMLINK_OR_TYPE_REJECTED/);
});
test('fixture alteration, added output, disappearance and fake handles fail integrity',t=>{
 const x=setup(t),p=planFixtureInputs(x.repo,{contract:x.contract}),m=materializeFixtureInputs(p,x.dest),file=join(x.dest,'fixtures/claim-vnext/definitions.json');
 p.receipt.files=[];m.receipt.files=[];
 chmodSync(file,0o600);writeFileSync(file,'changed');assert.throws(()=>m.verify(),/INTEGRITY_CHANGED/);writeFileSync(file,'{"version":1}');m.verify();
 writeFileSync(join(x.dest,'fixtures/claim-vnext/output.json'),'output');assert.throws(()=>m.verify(),/PATH_SET_CHANGED/);rmSync(join(x.dest,'fixtures/claim-vnext/output.json'));
 const moved=x.dest+'-moved';renameSync(x.dest,moved);symlinkSync(moved,x.dest);assert.throws(()=>m.verify(),/TARGET_SYMLINK/);rmSync(x.dest);renameSync(moved,x.dest);
 rmSync(file);assert.throws(()=>m.verify(),/INTEGRITY_CHANGED/);assert.throws(()=>materializeFixtureInputs({...p},x.dest),/PLAN_REQUIRED/);
});
test('same commit from different cwd/worktree and no-checkout local clone has identical inputs',t=>{
 const x=setup(t),other=join(x.parent,'worktree'),clone=join(x.parent,'clone');x.git('worktree','add','--detach',other,x.pin);
 execFileSync('git',['clone','--quiet','--no-local','--no-checkout',x.repo,clone]);
 const before=process.cwd();try{
  const receipts=[];
  for(const [cwd,repo] of [[x.parent,x.repo],[other,other],[clone,clone]]){process.chdir(cwd);receipts.push(planFixtureInputs(repo,{commit:x.pin,contract:x.contract}).receipt);}
  assert.deepEqual(receipts[0],receipts[1]);assert.deepEqual(receipts[0],receipts[2]);assert.equal(existsSync(join(clone,'fixtures')),false);
 }finally{process.chdir(before);}
});
test('explicit schema versions coexist and missing vNext schema fails before tests',t=>{
 const x=setup(t);x.put('ground-core/validate.ts','// stable');
 for(const v of ['0.1.25','0.1.26'])for(const k of ['project-state','state-patch'])x.put(`docs/schemas/ground-core-${k}.v${v}.schema.json`,JSON.stringify({version:v}));x.commit();
 const contract={...x.contract,entries:loadFixtureContract().contract.entries.filter((e:any)=>e.root==='docs/schemas')};
 const m=materializeFixtureInputs(planFixtureInputs(x.repo,{contract}),x.dest);assert.equal(m.receipt.file_count,4);m.verify();
 x.git('rm','docs/schemas/ground-core-project-state.v0.1.26.schema.json');x.commit();assert.throws(()=>planFixtureInputs(x.repo,{contract}),/REQUIRED_FIXTURE_MISSING/);
});
test('Semantic manifest declares original four inputs; provenance copy cannot sweep whole bundle',()=>{
 const c=loadFixtureContract().contract;
 const sem=c.entries.filter((e:any)=>e.required_by.includes('ground-core/__tests__/claim-vnext.test.ts'));
 assert.deepEqual(sem.filter((e:any)=>e.root.startsWith('fixtures/')).flatMap((e:any)=>e.required_files.map((p:string)=>e.root+'/'+p)).sort(),[
  'fixtures/claim-vnext/definitions.json','fixtures/human-interface/human-001/project-state.json','fixtures/human-interface/provenance/historical-round1-v1/005/selected-c86-request.json','fixtures/human-interface/provenance/historical-round1-v1/005/selection-manifest.json'].sort());
 assert.equal(sem.find((e:any)=>e.role==='read-only-test-consumer-of-frozen-provenance-inputs').copy_mode,'tracked-selected-blobs');
 assert.ok(c.entries.every((e:any)=>!e.root.includes('injections')&&!e.root.includes('storage')));
});

test('test environment excludes live/default-root and loader redirects',()=>{
 const env=runnerTestEnvironment('/isolated/output',{PATH:'/bin',GROUND_CORE_STORAGE_DIR:'/live',GROUND_RUNTIME_CONFIG:'/live/config',NODE_OPTIONS:'--import /outside.mjs',NODE_PATH:'/outside',GIT_DIR:'/outside/.git'});
 assert.deepEqual(env,{PATH:'/bin',TMPDIR:'/isolated/output',TMP:'/isolated/output',TEMP:'/isolated/output'});
});
