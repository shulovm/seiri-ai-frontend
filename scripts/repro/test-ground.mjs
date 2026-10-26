/** Run unchanged legacy tests in a disposable, repository-only test workspace. */
import {cpSync,mkdtempSync,readdirSync,readFileSync,writeFileSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createRunnerCopyPolicy} from './runner-copy-policy.mjs';
import {loadFixtureContract,planFixtureInputs,materializeFixtureInputs,isManagedFixturePath,runnerTestEnvironment} from './fixture-inputs.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const {contract}=loadFixtureContract();
// Preflight before any test/setup runs. The exact current commit owns fixture inputs.
const fixturePlan=planFixtureInputs(root,{contract});
const scratch=mkdtempSync(join(tmpdir(),'ground-repro-tests-'));
const copyPolicy=createRunnerCopyPolicy(root);
// All input roots are explicit. No runtime storage, .env, or other worktree is read.
for(const name of ['ground-core','docs','scripts','package.json','package-lock.json','.gitignore']){
 cpSync(join(root,name),join(scratch,name),{recursive:true,filter:p=>!isManagedFixturePath(relative(root,p),contract)&&copyPolicy(p)});
}
const fixtureInputs=materializeFixtureInputs(fixturePlan,scratch);
writeFileSync(join(scratch,'runner-fixture-receipt.json'),JSON.stringify(fixtureInputs.receipt,null,2)+'\n');
// Owner-storage tests require temporary roots outside any repository; short paths also
// keep CLI IPC sockets below platform limits. This is output, never an input fallback.
const outputRoot=mkdtempSync(join(tmpdir(),'g-'));
writeFileSync(join(scratch,'runner-output-root.json'),JSON.stringify({outputRoot})+'\n');
const testEnv=runnerTestEnvironment(outputRoot);
symlinkSync(join(root,'node_modules'),join(scratch,'node_modules'),'dir');
// The independent repository supports ignore checks and exact historical Git blobs.
// Import only declared checkpoint histories from this source repository.
const init=spawnSync('git',['init','--quiet',scratch],{cwd:scratch,stdio:'inherit'});
if(init.status!==0)process.exit(init.status??1);
const transition=JSON.parse(readFileSync(join(root,'docs/contract-evolution/schema24-to25.json'),'utf8'));
const history=spawnSync('git',['fetch','--quiet','--no-tags','--no-write-fetch-head',root,
 transition.previousAuthority.checkpoint,transition.approvedTransition.targetCheckpoint,
 // Operator-run setup imports exact registered history locally. Resolver never fetches.
 fixtureInputs.receipt.commit,'9cb9dc6fe2ac522679abc970c5a7daa08bcd253b','25ba36665c1034c1317e7556abea007bb08da539',
 'a6f4de1ff92f8ce2e6e6c16de66e714b68b97f9f','b361136770d48b952164cb40900554c008ad06f4','1a5cd833b96c40aea87752f86dea9949db661ecd'],{cwd:scratch,stdio:'inherit'});
if(history.status!==0)process.exit(history.status??1);
// Bind HEAD for tracked fixture tests inside the independent repository. No checkout or source overwrite.
const bind=spawnSync('git',['update-ref','HEAD',fixtureInputs.receipt.commit],{cwd:scratch,stdio:'inherit'});
if(bind.status!==0)process.exit(bind.status??1);
writeFileSync(join(scratch,'.ground-repro-test-workspace'),'GROUND-REPRO-001\n',{flag:'wx'});
const generate=spawnSync(process.execPath,['--import','tsx',join(root,'scripts/repro/setup-fixtures.ts'),scratch],{cwd:scratch,env:testEnv,stdio:'inherit'});
if(generate.status!==0)process.exit(generate.status??1);
const tests=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?tests(join(dir,e.name)):e.name.endsWith('.test.ts')?[join(dir,e.name)]:[]);
fixtureInputs.verify();
console.log('Fixture input receipt: '+JSON.stringify({commit:fixtureInputs.receipt.commit,file_count:fixtureInputs.receipt.file_count,byte_count:fixtureInputs.receipt.byte_count,fixture_set_sha256:fixtureInputs.receipt.fixture_set_sha256}));
console.log('Isolated test workspace (retained): '+scratch);
const run=spawnSync(process.execPath,['--import','tsx','--test',...tests(join(scratch,'ground-core/__tests__')).filter(p=>!['historical-injection-freeze','inspection-composition','historical-batch','historical-expansion'].some(n=>p===join(scratch,'ground-core/__tests__/'+n+'.test.ts'))).sort(),...tests(join(scratch,'scripts/repro')).sort()],{cwd:scratch,env:testEnv,stdio:'inherit'});
// Validate after failed tests as well; a test cannot silently consume an altered input.
fixtureInputs.verify();
// The four original historical tests run unchanged through historical-replay.test.ts.
// Its coverage guard rejects changed/unregistered bytes before dispatch; no assertions are skipped.
// Keep failure evidence and generated stores; no cleanup disguises the status.
writeFileSync(join(scratch,'test-exit.json'),JSON.stringify({exitCode:run.status,signal:run.signal})+'\n');
process.exit(run.status??1);
