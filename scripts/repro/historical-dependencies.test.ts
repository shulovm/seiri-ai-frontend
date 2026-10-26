import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { HistoricalRepository, sha256, type Dependency } from '../historical-dependencies/resolver.js';
import { loadDependencyManifest, materializeHistoricalCheckpoint, executeHistoricalCheckpoint, treeInventory } from '../historical-dependencies/execution.js';
const root=resolve('.'),repo=new HistoricalRepository(root);
const a=loadDependencyManifest('repro-001-artifacts.json').manifest;
const b=loadDependencyManifest('live-003b-review.json').manifest;
const path='ground-core/experimental/historical-reality/substrate.ts';
const A=a.dependencies.find(d=>d.repo_relative_path===path)!, B=b.dependencies.find(d=>d.repo_relative_path===path)!;

test('explicit repository root cannot be rebound after construction',()=>assert.throws(()=>Object.assign(repo,{root:'/tmp'})));

test('dual substrate identities coexist in one process with original SHA/OID/length',()=>{
  const first=repo.resolveHistoricalDependency(A),second=repo.resolveHistoricalDependency(B);
  assert.equal(sha256(first),A.expected_sha256);assert.equal(sha256(second),B.expected_sha256);
  assert.notDeepEqual(first,second);assert.notEqual(A.expected_blob_oid,B.expected_blob_oid);
  assert.deepEqual(repo.resolveHistoricalDependency(A),first);
});
test('182 Git identities preserve original manifest expectations without migrating current source',()=>{
  const old=JSON.parse(readFileSync(resolve('docs/repro-001/historical-artifacts.json'),'utf8'));
  assert.equal(a.dependencies.length,182);
  for(const p of a.dependencies){const expected=old.find((f:any)=>f.path===p.repo_relative_path);assert.ok(expected);assert.equal(p.expected_sha256,expected.sha256);assert.equal(p.expected_byte_length,expected.bytes);repo.resolveHistoricalDependency(p);}
});
for(const [name,change] of Object.entries({
  'wrong commit':{commit:B.commit},'missing commit':{commit:'0'.repeat(40)},
  'wrong path':{repo_relative_path:'ground-core/types.ts'},'missing path':{repo_relative_path:'absent.ts'},
  'wrong OID':{expected_blob_oid:B.expected_blob_oid},'wrong SHA':{expected_sha256:'0'.repeat(64)},
  'wrong length':{expected_byte_length:A.expected_byte_length+1},'traversal':{repo_relative_path:'../substrate.ts'},
  'absolute path':{repo_relative_path:'/tmp/substrate.ts'},'tree object':{repo_relative_path:'ground-core'},
  'commit is blob':{commit:A.expected_blob_oid},'branch name':{commit:'master'},
  'wrong resolution mode':{resolution_mode:'worktree'},'backslash':{repo_relative_path:'ground-core\\substrate.ts'},
}))test('fail closed: '+name,()=>assert.throws(()=>repo.resolveHistoricalDependency({...A,...change} as Dependency)));

test('three cwd selections produce the same identities with explicit repository boundary',()=>{
  const previous=process.cwd(),temp=mkdtempSync(join(tmpdir(),'historical-cwd-'));
  try{for(const name of ['one','two','three']){const dir=join(temp,name);mkdirSync(dir);process.chdir(dir);const r=new HistoricalRepository(root);assert.equal(sha256(r.resolveHistoricalDependency(A)),A.expected_sha256);assert.equal(sha256(r.resolveHistoricalDependency(B)),B.expected_sha256);}}
  finally{process.chdir(previous);rmSync(temp,{recursive:true,force:true});}
});
test('missing .git does not discover parent repo or fetch; ambient Git redirects ignored',()=>{
  const dir=mkdtempSync(join(tmpdir(),'historical-no-git-')); const previous=process.env.GIT_DIR;
  try{assert.throws(()=>new HistoricalRepository(dir));process.env.GIT_DIR=dir;assert.equal(sha256(new HistoricalRepository(root).resolveHistoricalDependency(A)),A.expected_sha256);}
  finally{if(previous===undefined)delete process.env.GIT_DIR;else process.env.GIT_DIR=previous;rmSync(dir,{recursive:true,force:true});}
});
test('scratch repo symlink and current mutation cannot rebind a committed dependency',()=>{
  const dir=mkdtempSync(join(tmpdir(),'historical-git-test-'));
  const git=(...args:string[])=>execFileSync('git',['-C',dir,...args],{encoding:'utf8',env:{PATH:process.env.PATH,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null'}}).trim();
  try{
    git('init','-q');writeFileSync(join(dir,'source.ts'),'original');symlinkSync('/etc/passwd',join(dir,'escape.ts'));
    git('add','.');git('-c','user.name=Historical test','-c','user.email=test@example.invalid','-c','core.hooksPath=/dev/null','commit','-qm','test-only identity');
    const commit=git('rev-parse','HEAD'),oid=git('rev-parse',commit+':source.ts');
    const pin={...A,commit,repo_relative_path:'source.ts',expected_blob_oid:oid,expected_sha256:sha256('original'),expected_byte_length:8};
    const r=new HistoricalRepository(dir);assert.throws(()=>r.resolveHistoricalDependency(A));writeFileSync(join(dir,'source.ts'),'mutated');assert.equal(r.resolveHistoricalDependency(pin).toString(),'original');
    assert.throws(()=>r.resolveHistoricalDependency({...pin,repo_relative_path:'escape.ts',expected_blob_oid:git('rev-parse',commit+':escape.ts')}),/TYPE_REJECTED/);
    mkdirSync(join(dir,'nested'));assert.throws(()=>new HistoricalRepository(join(dir,'nested')));
    const alias=dir+'-alias';symlinkSync(dir,alias);try{assert.throws(()=>new HistoricalRepository(alias));}finally{rmSync(alias);}
  }finally{rmSync(dir,{recursive:true,force:true});}
});
test('materialized tree rejects file injection and symlink escape before execution',()=>{
  const c=materializeHistoricalCheckpoint(root,'live-003b-review.json');
  try{
    writeFileSync(join(c.root,'unexpected.js'),'throw new Error("injected")');assert.throws(()=>executeHistoricalCheckpoint(c),/TREE_CHANGED/);rmSync(join(c.root,'unexpected.js'));
    symlinkSync('/etc/passwd',join(c.root,'escape'));assert.throws(()=>executeHistoricalCheckpoint(c),/SYMLINK/);rmSync(join(c.root,'escape'));
    c.verify();
    assert.throws(()=>executeHistoricalCheckpoint({...c}),/UNREGISTERED_EXECUTION/);
  }finally{c.cleanup();}
});
test('Node isolation rejects outside imports, filesystem writes and child processes',()=>{
  const c=materializeHistoricalCheckpoint(root,'live-003b-review.json');
  try{
    const env={NODE_PATH:'',TZ:'UTC'};
    for(const code of [`require('node:fs').readFileSync(${JSON.stringify(join(root,'package.json'))})`, `require('node:fs').writeFileSync('forbidden','x')`, `require('node:child_process').execSync('true')`, `import(${JSON.stringify('file://'+join(root,'package.json'))},{with:{type:'json'}})`]){
      const result=spawnSync(process.execPath,['--permission','--allow-fs-read='+c.root,'-e',code],{cwd:c.root,env,encoding:'utf8'});
      assert.notEqual(result.status,0);assert.match(result.stderr,/ERR_ACCESS_DENIED|Access to this API/);
    }
    c.verify();
  }finally{c.cleanup();}
});
test('materialization deterministic content fingerprints and unchanged source tree',()=>{
  const before=readFileSync(join(root,path));const one=materializeHistoricalCheckpoint(root,'live-003b-review.json'),two=materializeHistoricalCheckpoint(root,'live-003b-review.json');
  try{assert.notEqual(one.root,two.root);assert.deepEqual(treeInventory(one.root),treeInventory(two.root));assert.equal(one.receipt.materialized_tree_fingerprint,two.receipt.materialized_tree_fingerprint);assert.deepEqual(readFileSync(join(root,path)),before);assert.equal(sha256(readFileSync(join(one.root,path))),B.expected_sha256);}
  finally{one.cleanup();two.cleanup();}
});
