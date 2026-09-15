/** Run unchanged legacy tests in a disposable, repository-only test workspace. */
import {cpSync,mkdtempSync,readdirSync,readFileSync,writeFileSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url));
const scratch=mkdtempSync(join(tmpdir(),'ground-repro-tests-'));
// All input roots are explicit. No runtime storage, .env, or other worktree is read.
for(const name of ['ground-core','docs','scripts','package.json','package-lock.json','.gitignore']){
 cpSync(join(root,name),join(scratch,name),{recursive:true,filter:p=>!p.startsWith(join(root,'ground-core/storage'))});
}
symlinkSync(join(root,'node_modules'),join(scratch,'node_modules'),'dir');
// The independent repository supports ignore checks and exact historical Git blobs.
// Import only the two declared checkpoint histories from this source repository.
const init=spawnSync('git',['init','--quiet',scratch],{cwd:scratch,stdio:'inherit'});
if(init.status!==0)process.exit(init.status??1);
const transition=JSON.parse(readFileSync(join(root,'docs/contract-evolution/schema24-to25.json'),'utf8'));
const history=spawnSync('git',['fetch','--quiet','--no-tags','--no-write-fetch-head',root,
 transition.previousAuthority.checkpoint,transition.approvedTransition.targetCheckpoint],{cwd:scratch,stdio:'inherit'});
if(history.status!==0)process.exit(history.status??1);
writeFileSync(join(scratch,'.ground-repro-test-workspace'),'GROUND-REPRO-001\n',{flag:'wx'});
const generate=spawnSync(process.execPath,['--import','tsx',join(root,'scripts/repro/setup-fixtures.ts'),scratch],{cwd:scratch,stdio:'inherit'});
if(generate.status!==0)process.exit(generate.status??1);
const tests=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?tests(join(dir,e.name)):e.name.endsWith('.test.ts')?[join(dir,e.name)]:[]);
console.log('Isolated test workspace (retained): '+scratch);
const run=spawnSync(process.execPath,['--import','tsx','--test',...tests(join(scratch,'ground-core/__tests__')).sort(),...tests(join(scratch,'scripts/repro')).sort()],{cwd:scratch,stdio:'inherit'});
// Keep failure evidence and generated stores; no cleanup disguises the status.
writeFileSync(join(scratch,'test-exit.json'),JSON.stringify({exitCode:run.status,signal:run.signal})+'\n');
process.exit(run.status??1);
