/** Audit/test tooling only. Historical authority is family + exact Git checkpoint. */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, readdirSync, lstatSync, realpathSync, rmSync } from 'node:fs';
import { join, dirname, resolve, relative, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { HistoricalRepository, sha256, assertPath, type Dependency } from './resolver.js';
import { treeInventory } from './execution.js';
import { FAMILY_PINS } from './family-pins.js';
export type FamilyName = keyof typeof FAMILY_PINS;
export interface FamilyManifest {
  format: 'historical-family-v1'; family_id: string; checkpoint_commit: string;
  entrypoints: string[]; test_entrypoints: string[]; source_roots: string[]; type_roots: string[];
  frozen_input_refs: string[]; expected_package_artifacts: string[];
  expected_package_fingerprint: string | null; fingerprint_entrypoint: string | null;
  schema_version: string; compiler_config_ref: string;
  compiler_policy: {typescript: string; node_types: string; npm: string};
  external_imports: string[]; typecheck_only_computed_imports: {path: string; expression: string}[];
  dependencies: Dependency[];
}
const supportRoot = fileURLToPath(new URL('../../', import.meta.url));
/** Only registered immutable bytes are accepted, including for callers supplying a manifest. */
export function parseFamilyManifest(name: FamilyName, bytes: Buffer): FamilyManifest {
  if (!Object.hasOwn(FAMILY_PINS, name)) throw new Error('UNREGISTERED_FAMILY');
  if (sha256(bytes) !== FAMILY_PINS[name]) throw new Error('FAMILY_MANIFEST_CHANGED');
  const manifest: FamilyManifest = JSON.parse(bytes.toString());
  if (manifest.format !== 'historical-family-v1') throw new Error('FAMILY_FORMAT');
  const paths = new Set<string>();
  for (const d of manifest.dependencies) {
    assertPath(d.repo_relative_path);
    if (paths.has(d.repo_relative_path) || d.commit !== manifest.checkpoint_commit || d.checkpoint_id !== manifest.family_id) throw new Error('FAMILY_IDENTITY_MISMATCH');
    paths.add(d.repo_relative_path);
  }
  for (const p of [...manifest.entrypoints, ...manifest.test_entrypoints, ...manifest.source_roots, ...manifest.type_roots,
    ...manifest.frozen_input_refs, ...manifest.expected_package_artifacts, manifest.compiler_config_ref,
    ...(manifest.fingerprint_entrypoint ? [manifest.fingerprint_entrypoint] : [])]) {
    assertPath(p); if (!paths.has(p)) throw new Error('UNPINNED_FAMILY_ROOT');
  }
  return manifest;
}
export function loadFamilyManifest(name: FamilyName): FamilyManifest {
  return parseFamilyManifest(name, readFileSync(join(supportRoot, 'docs/historical-freeze-004', name)));
}
export interface FamilyReceipt {
  family: string; checkpoint_commit: string; manifest_sha256: string;
  source_tree_fingerprint: string; materialized_tree_fingerprint: string;
  compiler_configuration_identity: {historical_path: string; historical_sha256: string; effective_sha256: string};
  compiler: string; node: string; npm_versions: Record<string, string>;
  schema_context: string; typecheck: 'PASS'; resolved_type_files: string[];
  expected_package_fingerprint: string | null;
}
export interface VerifiedFamily {
  readonly root: string; readonly receipt: FamilyReceipt;
  verify(): void; cleanup(): void;
}
const verified = new WeakMap<VerifiedFamily, {root: string; scratch: string; verify: () => void; receipt: FamilyReceipt; manifest: FamilyManifest}>();
const cleanEnv = (scratch?: string) => ({TZ: 'UTC', LANG: 'C', NODE_PATH: '', ...(scratch ? {TMPDIR: scratch, TMP: scratch, TEMP: scratch} : {})});
function run(root: string, args: string[], cwd: string, scratch?: string) {
  const result = spawnSync(process.execPath, ['--permission', '--allow-fs-read='+root,
    ...(scratch ? ['--allow-fs-read='+scratch, '--allow-fs-write='+scratch] : []), ...args],
    {cwd, env: cleanEnv(scratch), encoding: 'utf8', timeout: 120000, maxBuffer: 16*1024*1024});
  return {status: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr, error: result.error?.message};
}
/** Checks local/type/literal dynamic imports; computed operational imports cannot enter execution closure. */
function inspectClosure(manifest: FamilyManifest, bytes: Map<string, Buffer>): void {
  const edges = new Map<string, string[]>(), computed = new Set<string>();
  for (const p of manifest.source_roots) {
    const sf = ts.createSourceFile(p, bytes.get(p)!.toString(), ts.ScriptTarget.ES2022, true);
    const targets: string[] = [];
    const add = (spec: string) => {
      if (spec.startsWith('.')) {
        const target = relative('/isolated', resolve('/isolated', dirname(p), spec.replace(/\.js$/, '.ts')));
        assertPath(target);
        if (!manifest.source_roots.includes(target) || !bytes.has(target)) throw new Error('LOCAL_IMPORT_OUTSIDE_FAMILY');
        targets.push(target);
      } else if (!manifest.external_imports.includes(spec) || isAbsolute(spec)) throw new Error('UNDECLARED_FAMILY_IMPORT');
    };
    const visit = (n: ts.Node): void => {
      if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) add(n.moduleSpecifier.text);
      if (ts.isImportTypeNode(n) && ts.isLiteralTypeNode(n.argument) && ts.isStringLiteral(n.argument.literal)) add(n.argument.literal.text);
      if (ts.isCallExpression(n)) {
        if (ts.isIdentifier(n.expression) && n.expression.text === 'require') throw new Error('REQUIRE_REJECTED');
        if (n.expression.kind === ts.SyntaxKind.ImportKeyword) {
          const arg = n.arguments[0];
          if (arg && ts.isStringLiteral(arg)) add(arg.text);
          else {
            if (!arg || !manifest.typecheck_only_computed_imports.some(x => x.path === p && x.expression === arg.getText(sf))) throw new Error('COMPUTED_IMPORT_REJECTED');
            computed.add(p);
          }
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf); edges.set(p, targets);
  }
  const seen = new Set<string>(), queue = [...manifest.test_entrypoints, ...(manifest.fingerprint_entrypoint ? [manifest.fingerprint_entrypoint] : [])];
  while (queue.length) {
    const p = queue.pop()!; if (seen.has(p)) continue; seen.add(p);
    if (computed.has(p)) throw new Error('OPERATIONAL_IMPORT_IN_EXECUTION_CLOSURE');
    queue.push(...(edges.get(p) ?? []));
  }
}
/** Integrity + historical typecheck. No historical test or publish CLI is executed here. */
export function verifyHistoricalFamily(repositoryRoot: string, name: FamilyName): VerifiedFamily {
  if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('NODE_24_REQUIRED');
  const manifest = loadFamilyManifest(name), repo = new HistoricalRepository(repositoryRoot);
  const bytes = new Map(manifest.dependencies.map(d => [d.repo_relative_path, repo.resolveHistoricalDependency(d)]));
  inspectClosure(manifest, bytes);
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'ground-historical-family-')));
  const scratch = realpathSync(mkdtempSync(join(tmpdir(), 'ground-historical-scratch-')));
  try {
    const write = (p: string, b: Buffer | string) => {mkdirSync(dirname(join(root,p)), {recursive:true}); writeFileSync(join(root,p), b, {flag:'wx',mode:0o600});};
    for (const [p,b] of bytes) write(p,b);
    const sourceFingerprint = sha256(JSON.stringify(treeInventory(root)));
    const manifestBytes = readFileSync(join(supportRoot, 'docs/historical-freeze-004', name));
    parseFamilyManifest(name, manifestBytes);
    write('family-manifest.json', manifestBytes);
    const require = createRequire(import.meta.url), lock = JSON.parse(bytes.get('package-lock.json')!.toString());
    const npm: Record<string,string> = {};
    const copyPackage = (name: string): void => {
      if (npm[name]) return;
      const installed = dirname(require.resolve(name+'/package.json'));
      const pkg = JSON.parse(readFileSync(join(installed,'package.json'),'utf8'));
      if (pkg.version !== lock.packages['node_modules/'+name]?.version) throw new Error('EXTERNAL_VERSION_MISMATCH');
      npm[name] = pkg.version;
      const copy = (dir: string, rel: string): void => {
        for (const n of readdirSync(dir)) {
          const p=join(dir,n),s=lstatSync(p),dest=join(rel,n);
          if (s.isSymbolicLink()) throw new Error('EXTERNAL_SYMLINK_REJECTED');
          if (s.isDirectory()) copy(p,dest); else if (s.isFile()) write(dest,readFileSync(p)); else throw new Error('EXTERNAL_FILE_TYPE');
        }
      };
      copy(installed,'node_modules/'+name);
      for (const dep of Object.keys(pkg.dependencies ?? {})) copyPackage(dep);
    };
    for (const spec of [...manifest.external_imports, 'typescript', '@types/node']) if (!spec.startsWith('node:')) copyPackage(spec.startsWith('@')?spec.split('/').slice(0,2).join('/'):spec.split('/')[0]);
    if (npm.typescript !== ts.version || ts.version !== manifest.compiler_policy.typescript || npm['@types/node'] !== manifest.compiler_policy.node_types) throw new Error('COMPILER_VERSION_MISMATCH');
    // Historical options are authority; only the root boundary and explicit source list are overlaid.
    const original = JSON.parse(bytes.get(manifest.compiler_config_ref)!.toString());
    if (original.extends || original.references || original.compilerOptions?.paths || original.compilerOptions?.baseUrl || original.compilerOptions?.plugins) throw new Error('UNREVIEWED_COMPILER_RESOLUTION');
    const config = JSON.stringify({extends:'./'+manifest.compiler_config_ref, compilerOptions:{rootDir:'.',incremental:false}, files:manifest.source_roots,include:[],exclude:[]},null,2)+'\n';
    write('historical-typecheck.json',config);
    const checked = run(root,[join(root,'node_modules/typescript/bin/tsc'),'-p',join(root,'historical-typecheck.json'),'--listFiles'],root);
    if (checked.status !== 0) throw new Error('HISTORICAL_TYPECHECK_FAILED\n'+checked.stdout+checked.stderr+(checked.error??''));
    const resolvedFiles = checked.stdout.trim().split('\n');
    for (const p of resolvedFiles) {
      const rel = relative(root,p);
      if (!isAbsolute(p) || rel.startsWith('..') || isAbsolute(rel) || (!rel.startsWith('node_modules/') && !bytes.has(rel))) throw new Error('TYPE_RESOLUTION_ESCAPE');
    }
    for (const p of manifest.source_roots) {
      const output = ts.transpileModule(bytes.get(p)!.toString(), {fileName:p,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,sourceMap:false}});
      write(p.replace(/\.ts$/,'.js'),output.outputText);
    }
    // The original tests execute original generators, serializers, IDs and frozen expected assertions.
    write('verify-tests.mjs',manifest.test_entrypoints.map(p=>`await import(${JSON.stringify('./'+p.replace(/\.ts$/,'.js'))});`).join('\n')+'\n');
    if (manifest.fingerprint_entrypoint) write('verify-fingerprint.mjs',`import {verifyFreeze} from ${JSON.stringify('./'+manifest.fingerprint_entrypoint.replace(/\.ts$/,'.js'))};\nconsole.log(verifyFreeze());\n`);
    const fingerprint = sha256(JSON.stringify(treeInventory(root)));
    const receipt: FamilyReceipt = {family:manifest.family_id,checkpoint_commit:manifest.checkpoint_commit,manifest_sha256:FAMILY_PINS[name],
      source_tree_fingerprint:sourceFingerprint,materialized_tree_fingerprint:fingerprint,
      compiler_configuration_identity:{historical_path:manifest.compiler_config_ref,historical_sha256:sha256(bytes.get(manifest.compiler_config_ref)!),effective_sha256:sha256(config)},
      compiler:ts.version,node:process.version,npm_versions:npm,schema_context:manifest.schema_version,typecheck:'PASS',resolved_type_files:resolvedFiles.map(p=>relative(root,p)),expected_package_fingerprint:manifest.expected_package_fingerprint};
    const verify = () => {if (sha256(JSON.stringify(treeInventory(root))) !== fingerprint) throw new Error('FAMILY_TREE_CHANGED');};
    const handle: VerifiedFamily = {root,receipt:structuredClone(receipt),verify,cleanup(){rmSync(root,{recursive:true,force:true});rmSync(scratch,{recursive:true,force:true});verified.delete(handle);}};
    verified.set(handle,{root,scratch,verify,receipt,manifest}); return handle;
  } catch (error) {rmSync(root,{recursive:true,force:true});rmSync(scratch,{recursive:true,force:true});throw error;}
}
/** Execute registered verification entrypoints only, with source read-only and independent scratch. */
export function executeHistoricalFamilyVerification(handle: VerifiedFamily, cwd?: string) {
  const state = verified.get(handle); if (!state) throw new Error('UNREGISTERED_FAMILY_EXECUTION');
  state.verify();
  const tests = run(state.root,[join(state.root,'verify-tests.mjs')],cwd ?? state.root,state.scratch);
  const fingerprint = state.manifest.fingerprint_entrypoint ? run(state.root,[join(state.root,'verify-fingerprint.mjs')],cwd ?? state.root) : null;
  state.verify();
  const packageFingerprint = fingerprint ? {status:fingerprint.status===0 && fingerprint.stdout.trim()===state.manifest.expected_package_fingerprint ? 'PASS':'FAIL',actual:fingerprint.stdout.trim(),stderr:fingerprint.stderr} : {status:'NOT_APPLICABLE',actual:null};
  return {receipt:structuredClone(state.receipt),tests,package_fingerprint:packageFingerprint,
    status:tests.status===0 && packageFingerprint.status!=='FAIL' ? 0:1};
}
