/** Audited Node/TypeScript replay tooling; never a production execution endpoint. */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync, lstatSync, realpathSync, rmSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { HistoricalRepository, sha256, assertPath, type DependencyManifest } from './resolver.js';
import { MANIFEST_PINS } from './pins.js';
export type ManifestName = keyof typeof MANIFEST_PINS;
const supportRoot = fileURLToPath(new URL('../../', import.meta.url));
export function loadDependencyManifest(name: ManifestName): { manifest: DependencyManifest; hash: string } {
  if (!Object.hasOwn(MANIFEST_PINS, name)) throw new Error('UNREGISTERED_MANIFEST');
  const bytes = readFileSync(join(supportRoot, 'docs/historical-freeze-002', name));
  if (sha256(bytes) !== MANIFEST_PINS[name]) throw new Error('MANIFEST_HASH_MISMATCH');
  const manifest = JSON.parse(bytes.toString()) as DependencyManifest;
  if (manifest.format !== 'historical-dependency-v1') throw new Error('MANIFEST_VERSION');
  const seen = new Set<string>();
  for (const d of manifest.dependencies) {
    assertPath(d.repo_relative_path);
    if (seen.has(d.repo_relative_path) || d.commit !== manifest.commit || d.checkpoint_id !== manifest.checkpoint_id) throw new Error('MANIFEST_IDENTITY_MISMATCH');
    seen.add(d.repo_relative_path);
  }
  return { manifest, hash: sha256(bytes) };
}
export function treeInventory(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const name of readdirSync(dir).sort()) {
      const p = join(dir, name), s = lstatSync(p);
      if (s.isSymbolicLink()) throw new Error('MATERIALIZED_SYMLINK_REJECTED');
      if (s.isDirectory()) walk(p);
      else if (s.isFile()) files[relative(root, p)] = sha256(readFileSync(p));
      else throw new Error('MATERIALIZED_TYPE_REJECTED');
    }
  };
  if (lstatSync(root).isSymbolicLink() || realpathSync(root) !== root) throw new Error('MATERIALIZED_ROOT_REJECTED');
  walk(root); return files;
}
const executions = new WeakMap<MaterializedCheckpoint, {root:string; entry:string; verify:()=>void; receipt:MaterializedCheckpoint["receipt"]}>();
export interface MaterializedCheckpoint {
  root: string;
  receipt: {
    checkpoint_id: string; dependency_manifest_sha256: string; source_tree_fingerprint: string;
    materialized_tree_fingerprint: string; entrypoint_identity: object;
    node: string; typescript: string; npm_versions: Record<string,string>;
    external_toolchain_scope: string;
  };
  verify(): void;
  cleanup(): void;
}
/** Original relative layout, new temporary root, no current source copies. */
export function materializeHistoricalCheckpoint(repositoryRoot: string, name: ManifestName): MaterializedCheckpoint {
  const { manifest, hash } = loadDependencyManifest(name);
  if (!manifest.entrypoint) throw new Error('VERIFICATION_ONLY_MANIFEST');
  const repo = new HistoricalRepository(repositoryRoot);
  const bytes = new Map(manifest.dependencies.map(d => [d.repo_relative_path, repo.resolveHistoricalDependency(d)]));
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'ground-historical-replay-')));
  try {
    const write = (p: string, b: Buffer | string) => { mkdirSync(dirname(join(root,p)), {recursive:true}); writeFileSync(join(root,p), b, {flag:'wx',mode:0o600}); };
    for (const [p,b] of bytes) write(p,b);
    const sourceInventory = treeInventory(root);
    // No tsconfig aliases or runtime loader. Emit JS solely from verified TS, preserving relative imports.
    // JS emission is a recorded toolchain transform, not another historical byte identity.
    for (const d of manifest.dependencies.filter(d => d.source_role === 'module')) {
      const p=d.repo_relative_path,s=bytes.get(p)!.toString();
      const parsed=ts.createSourceFile(p,s,ts.ScriptTarget.ES2022,true);
      const inspect=(node:ts.Node):void=>{
        if ((ts.isImportDeclaration(node)||ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
          const spec=node.moduleSpecifier.text;
          if(spec.startsWith('.')){
            const target=relative(root,resolve(root,dirname(p),spec.replace(/\.js$/,'.ts')));
            if(!bytes.has(target))throw new Error('LOCAL_IMPORT_OUTSIDE_CLOSURE');
          }else if(!manifest.external_imports?.includes(spec))throw new Error('UNDECLARED_EXTERNAL_IMPORT');
        }
        if(ts.isCallExpression(node) && (node.expression.kind===ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression)&&node.expression.text==='require')))throw new Error('DYNAMIC_IMPORT_REJECTED');
        ts.forEachChild(node,inspect);
      }; inspect(parsed);
      const output=ts.transpileModule(s,{fileName:p,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,sourceMap:false}});
      write(p.replace(/\.ts$/,'.js'),output.outputText);
    }
    // External npm implementation is outside Git-source authority. Require checkpoint lock versions,
    // copy regular files (no node_modules symlink), and receipt the exact copied runtime tree.
    const lock=JSON.parse(bytes.get('package-lock.json')!.toString());
    const npmVersions:Record<string,string>={}; const require=createRequire(import.meta.url);
    const copyPackage=(name:string):void=>{
      if(npmVersions[name])return;
      const installed=dirname(require.resolve(name+'/package.json'));
      const pkg=JSON.parse(readFileSync(join(installed,'package.json'),'utf8'));
      if(pkg.version!==lock.packages['node_modules/'+name]?.version)throw new Error('EXTERNAL_VERSION_MISMATCH');
      npmVersions[name]=pkg.version;
      const copy=(dir:string,rel:string)=>{for(const n of readdirSync(dir)){const path=join(dir,n),s=lstatSync(path),dest=join(rel,n);
        if(s.isSymbolicLink())throw new Error('EXTERNAL_SYMLINK_REJECTED');
        if(s.isDirectory())copy(path,dest);else if(s.isFile())write(dest,readFileSync(path));else throw new Error('EXTERNAL_FILE_TYPE_REJECTED');}};
      copy(installed,'node_modules/'+name);
      for(const dep of Object.keys(pkg.dependencies??{}))copyPackage(dep);
    };
    for(const spec of manifest.external_imports??[])if(!spec.startsWith('node:'))copyPackage(spec.startsWith('@')?spec.split('/').slice(0,2).join('/'):spec.split('/')[0]);
    const inventory=treeInventory(root), fingerprint=sha256(JSON.stringify(inventory));
    const entry=manifest.dependencies.find(d=>d.repo_relative_path===manifest.entrypoint)!;
    const receipt={checkpoint_id:manifest.checkpoint_id,dependency_manifest_sha256:hash,
      source_tree_fingerprint:sha256(JSON.stringify(sourceInventory)),materialized_tree_fingerprint:fingerprint,
      entrypoint_identity:entry,node:process.version,typescript:ts.version,npm_versions:npmVersions,
      external_toolchain_scope:'Node/compiler and installed npm are external tooling; npm versions match checkpoint lock, copied runtime bytes are fingerprinted, not attested against registry tarballs.'};
    const checkpoint:MaterializedCheckpoint={root,receipt,verify(){if(sha256(JSON.stringify(treeInventory(root)))!==fingerprint)throw new Error('MATERIALIZED_TREE_CHANGED');},cleanup(){rmSync(root,{recursive:true,force:true});executions.delete(checkpoint);}};
    executions.set(checkpoint,{root,entry:entry.repo_relative_path,verify:checkpoint.verify,receipt:structuredClone(receipt)});
    return checkpoint;
  } catch(error){rmSync(root,{recursive:true,force:true});throw error;}
}
/** Read-only Node permission scope; no inherited NODE_PATH/NODE_OPTIONS, aliases, child process or writes. */
export function executeHistoricalCheckpoint(checkpoint: MaterializedCheckpoint) {
  const execution=executions.get(checkpoint);if(!execution)throw new Error('UNREGISTERED_EXECUTION');
  execution.verify();
  if(Number(process.versions.node.split('.')[0])<24)throw new Error('NODE_24_REQUIRED');
  const root=execution.root;
  const result=spawnSync(process.execPath,['--permission','--allow-fs-read='+root,
    join(root,execution.entry.replace(/\.ts$/,'.js'))],
    {cwd:root,env:{TZ:'UTC',LANG:'C',NODE_PATH:''},encoding:'utf8',maxBuffer:8*1024*1024,timeout:120000});
  execution.verify();
  return {receipt:execution.receipt,status:result.status,signal:result.signal,stdout:result.stdout,stderr:result.stderr,error:result.error?.message};
}
