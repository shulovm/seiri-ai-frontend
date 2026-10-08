/** Explicit test inputs from one Git commit. Never reads fixture bytes from a checkout. */
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync,lstatSync,realpathSync,readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {isAbsolute,join,dirname,relative,resolve} from 'node:path';
const sha256=b=>createHash('sha256').update(b).digest('hex');
export function assertFixturePath(p){
 if(typeof p!=='string'||!/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/.test(p)||p.split('/').some(s=>['.','..','.git','node_modules'].includes(s)))throw Error('RUNNER_FIXTURE_PATH_REJECTED');
}
const within=(p,root)=>p===root||p.startsWith(root+'/');
const allowedRoots=['ground-core/__tests__/fixtures','docs/schemas','fixtures/claim-vnext','fixtures/human-interface/human-001','fixtures/human-interface/provenance/historical-round1-v1/005'];
export function loadFixtureContract(path=new URL('./fixture-inputs.json',import.meta.url)){
 const bytes=readFileSync(path),contract=JSON.parse(bytes);
 validateFixtureContract(contract);return {contract,sha256:sha256(bytes)};
}
export function validateFixtureContract(c){
 if(c?.format!=='ground-runner-fixture-inputs-v1'||c.authority!=='exact-commit-git-tree'||!Array.isArray(c.entries)||!c.entries.length)throw Error('RUNNER_FIXTURE_CONTRACT_INVALID');
 for(const e of c.entries){
  assertFixturePath(e.root);
  if(!allowedRoots.includes(e.root)||!e.role||e.presence!=='required-when-suite-present'||!['tracked-tree-blobs','tracked-selected-blobs','tracked-extension-blobs'].includes(e.copy_mode)||!Array.isArray(e.required_by)||!e.required_by.length||!Array.isArray(e.required_files)||!e.required_files.length)throw Error('RUNNER_FIXTURE_CONTRACT_INVALID');
  for(const p of [...e.required_by,...e.required_files])assertFixturePath(p);
  if(e.copy_mode==='tracked-extension-blobs'&&(!Array.isArray(e.extensions)||!e.extensions.length||e.extensions.some(x=>!/^\.[a-z]+$/.test(x))))throw Error('RUNNER_FIXTURE_CONTRACT_INVALID');
 }
}
function gitReader(repository){
 if(!isAbsolute(repository)||lstatSync(repository).isSymbolicLink())throw Error('RUNNER_REPOSITORY_ROOT_REJECTED');
 const root=realpathSync(repository);
 if(!existsSync(join(root,'.git'))||lstatSync(join(root,'.git')).isSymbolicLink())throw Error('RUNNER_REPOSITORY_METADATA_REQUIRED');
 const git=(...args)=>execFileSync('git',['--no-replace-objects','-C',root,...args],{env:{PATH:process.env.PATH,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null',GIT_CONFIG_SYSTEM:'/dev/null',GIT_NO_REPLACE_OBJECTS:'1',GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0',GIT_OPTIONAL_LOCKS:'0'},stdio:['pipe','pipe','pipe'],maxBuffer:64*1024*1024});
 if(realpathSync(git('rev-parse','--show-toplevel').toString().trim())!==root)throw Error('RUNNER_REPOSITORY_ROOT_MISMATCH');
 const common=resolve(root,git('rev-parse','--git-common-dir').toString().trim());
 for(const name of ['alternates','http-alternates'])if(existsSync(join(common,'objects/info',name)))throw Error('RUNNER_EXTERNAL_OBJECT_DATABASE_REJECTED');
 return {root,git};
}
const plans=new WeakMap();
/** Resolve HEAD once unless an exact commit is supplied. Branch/latest/fallback inputs are refused. */
export function planFixtureInputs(repository,{commit,contract=loadFixtureContract().contract}={}){
 validateFixtureContract(contract);
 const {root,git}=gitReader(repository);
 const exact=commit??git('rev-parse','HEAD').toString().trim();
 if(!/^[a-f0-9]{40}$/.test(exact)||git('cat-file','-t',exact).toString().trim()!=='commit')throw Error('RUNNER_FIXTURE_COMMIT_REJECTED');
 const tree=new Map();
 for(const row of git('ls-tree','-r','-z',exact).toString().split('\0').filter(Boolean)){
  const m=row.match(/^(\d{6}) (blob|commit) ([a-f0-9]{40})\t(.+)$/);if(!m)throw Error('RUNNER_GIT_TREE_INVALID');
  tree.set(m[4],{mode:m[1],type:m[2],oid:m[3]});
 }
 const selected=new Map(),active=[],inactive=[];
 for(const e of contract.entries){
  const enabled=e.required_by.some(p=>[...tree.keys()].some(x=>within(x,p)));
  if(!enabled){
   // A newly added test in an uncommitted checkout must not silently run without its inputs.
   if(e.required_by.some(p=>existsSync(join(root,p))))throw Error('RUNNER_SUITE_NOT_IN_FIXTURE_COMMIT: '+e.required_by.join(','));
   inactive.push(e.role);continue;
  }
  active.push(e.role);
  const prefix=e.root+'/';
  // Refuse Git symlinks/gitlinks along the root and anywhere in the declared input directory.
  for(const [p,f] of tree){
   if((within(e.root,p)||within(p,e.root))&&(!['100644','100755'].includes(f.mode)||f.type!=='blob'))throw Error('RUNNER_FIXTURE_SYMLINK_OR_TYPE_REJECTED: '+p);
  }
  const paths=[...tree.keys()].filter(p=>p.startsWith(prefix)&&
    (e.copy_mode==='tracked-tree-blobs'||(e.copy_mode==='tracked-extension-blobs'&&e.extensions.some(x=>p.endsWith(x)))||(e.copy_mode==='tracked-selected-blobs'&&e.required_files.includes(p.slice(prefix.length)))));
  for(const req of e.required_files){const p=prefix+req;if(!paths.includes(p))throw Error('RUNNER_REQUIRED_FIXTURE_MISSING: '+p);}
  if(!paths.length)throw Error('RUNNER_REQUIRED_FIXTURE_MISSING: '+e.root);
  for(const p of paths){assertFixturePath(p);const f=tree.get(p);const bytes=git('cat-file','blob',f.oid);const existing=selected.get(p);
   selected.set(p,{path:p,blob_oid:f.oid,sha256:sha256(bytes),bytes:bytes.length,roles:[...(existing?.roles??[]),e.role],content:bytes});
  }
 }
 const files=[...selected.values()].sort((a,b)=>a.path.localeCompare(b.path));
 const receipt={format:'ground-runner-fixture-receipt-v1',commit:exact,contract_sha256:sha256(JSON.stringify(contract)),active_roles:active,inactive_roles:inactive,files:files.map(({content,...f})=>f),file_count:files.length,byte_count:files.reduce((n,f)=>n+f.bytes,0)};
 receipt.fixture_set_sha256=sha256(JSON.stringify(receipt.files));
 const plan={receipt:structuredClone(receipt)};plans.set(plan,{root,files,receipt,contract:structuredClone(contract)});return plan;
}
/** Do not let the legacy filesystem copy supply any managed input, even when inactive. */
export function isManagedFixturePath(path,contract=loadFixtureContract().contract){
 return contract.entries.some(e=>within(path,e.root)&&(e.copy_mode!=='tracked-extension-blobs'||e.extensions.some(ext=>path.endsWith(ext))));
}
function safeTarget(root,p){
 assertFixturePath(p);
 if(lstatSync(root).isSymbolicLink()||realpathSync(root)!==root)throw Error('RUNNER_FIXTURE_TARGET_SYMLINK');
 let current=root;
 for(const part of p.split('/')){current=join(current,part);if(existsSync(current)&&lstatSync(current).isSymbolicLink())throw Error('RUNNER_FIXTURE_TARGET_SYMLINK');}
 return current;
}
/** New bytes only; verification capability is private and does not trust a mutable public receipt. */
export function materializeFixtureInputs(plan,destination){
 const state=plans.get(plan);if(!state)throw Error('RUNNER_FIXTURE_PLAN_REQUIRED');
 if(!isAbsolute(destination)||lstatSync(destination).isSymbolicLink())throw Error('RUNNER_FIXTURE_DESTINATION_REJECTED');
 const root=realpathSync(destination);
 if(root===state.root||within(root,state.root)||within(state.root,root))throw Error('RUNNER_FIXTURE_DESTINATION_OVERLAP');
 for(const f of state.files){const p=safeTarget(root,f.path);mkdirSync(dirname(p),{recursive:true});writeFileSync(p,f.content,{flag:'wx',mode:0o444});}
 const verify=()=>{
  for(const f of state.files){const p=safeTarget(root,f.path);if(!existsSync(p)||!lstatSync(p).isFile()||sha256(readFileSync(p))!==f.sha256)throw Error('RUNNER_FIXTURE_INTEGRITY_CHANGED: '+f.path);}
  const seen=[];const walk=(dir)=>{if(!existsSync(dir))return;if(lstatSync(dir).isSymbolicLink())throw Error('RUNNER_FIXTURE_TARGET_SYMLINK');for(const e of readdirSync(dir,{withFileTypes:true})){const p=join(dir,e.name),rel=relative(root,p);if(e.isSymbolicLink())throw Error('RUNNER_FIXTURE_TARGET_SYMLINK');if(e.isDirectory())walk(p);else if(isManagedFixturePath(rel,state.contract))seen.push(rel);}};
  for(const r of new Set(state.contract.entries.map(e=>e.root)))walk(join(root,r));
  const actual=[...new Set(seen)].sort(),expected=state.files.map(f=>f.path).sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('RUNNER_FIXTURE_PATH_SET_CHANGED');
 };
 verify();return {receipt:structuredClone(state.receipt),verify};
}
/** Ambient runtime configuration must never turn a disposable test run into a live reader/writer. */
export function runnerTestEnvironment(outputRoot,ambient=process.env){
 const env=Object.fromEntries(Object.entries(ambient).filter(([key])=>!key.startsWith('GROUND_')&&!key.startsWith('GIT_')&&!['NODE_OPTIONS','NODE_PATH'].includes(key)));
 return {...env,TMPDIR:outputRoot,TMP:outputRoot,TEMP:outputRoot};
}
