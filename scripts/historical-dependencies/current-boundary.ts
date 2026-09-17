/** Exclusion is conditional on full immutable coverage and a closed current compiler graph. */
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join, relative, resolve, dirname} from 'node:path';
import ts from 'typescript';
import {FAMILY_PINS} from './family-pins.js';
import {loadFamilyManifest} from './family.js';
import {sha256} from './resolver.js';
export const HISTORICAL_TESTS = ['historical-injection-freeze','inspection-composition','historical-batch','historical-expansion'].map(n=>'ground-core/__tests__/'+n+'.test.ts');
export const HISTORICAL_PACKAGES = ['frus-1904-392','frus-1904-392-inspection-v1','historical-batch-v1','historical-expansion-v1'].map(n=>'ground-core/injections/'+n);
export function isHistoricalPath(p: string): boolean {return HISTORICAL_TESTS.includes(p)||HISTORICAL_PACKAGES.some(root=>p===root||p.startsWith(root+'/'));}
export function assertCurrentBoundary(root: string): {covered_files: number; current_files: number} {
  const approved = new Map<string,Set<string>>();
  for (const name of Object.keys(FAMILY_PINS) as (keyof typeof FAMILY_PINS)[]) for (const d of loadFamilyManifest(name).dependencies) {
    const hashes=approved.get(d.repo_relative_path)??new Set<string>();hashes.add(d.expected_sha256);approved.set(d.repo_relative_path,hashes);
  }
  let count=0;
  const check=(p:string):void=>{
    if(!existsSync(join(root,p)))return;
    const entries=readdirSync(join(root,p),{withFileTypes:true});
    for(const e of entries){const q=p+'/'+e.name;if(e.isSymbolicLink())throw new Error('CURRENT_HISTORICAL_SYMLINK');if(e.isDirectory())check(q);else verify(q);}
  };
  const verify=(p:string):void=>{if(!approved.get(p)?.has(sha256(readFileSync(join(root,p)))))throw new Error('UNCOVERED_HISTORICAL_BYTES: '+p);count++;};
  for(const p of HISTORICAL_PACKAGES)check(p);
  for(const p of HISTORICAL_TESTS)if(existsSync(join(root,p)))verify(p);
  const configs=['ground-core/tsconfig.json','server/human-interface/tsconfig.json'];
  let files=0;
  for(const config of configs){if(!existsSync(join(root,config)))continue;
    const configPath=join(root,config),read=ts.readConfigFile(configPath,ts.sys.readFile);if(read.error)throw new Error(ts.flattenDiagnosticMessageText(read.error.messageText,'\n'));
    const parsed=ts.parseJsonConfigFileContent(read.config,ts.sys,resolve(root,config,'..'));
    if(parsed.errors.length)throw new Error('CURRENT_CONFIG_ERROR');
    const program=ts.createProgram(parsed.fileNames,parsed.options);
    for(const source of program.getSourceFiles()){
      const p=relative(root,source.fileName);files++;
      if(isHistoricalPath(p))throw new Error('CURRENT_IMPORTS_HISTORICAL_SOURCE: '+p);
      if(p.startsWith('node_modules/')||p.startsWith('..'))continue;
      // TypeScript cannot statically resolve computed imports: reject them in current compiler graph.
      const visit=(n:ts.Node):void=>{if(ts.isCallExpression(n)&&n.expression.kind===ts.SyntaxKind.ImportKeyword&&!ts.isStringLiteral(n.arguments[0]))throw new Error('CURRENT_COMPUTED_IMPORT_REQUIRES_REVIEW: '+p);ts.forEachChild(n,visit)};visit(source);
    }
  }
  // Production JS/JSX is outside the core TS program. Audit its literal imports too.
  const auditRuntime=(p:string):void=>{
    if(!existsSync(join(root,p)))return;
    const source=ts.createSourceFile(p,readFileSync(join(root,p),'utf8'),ts.ScriptTarget.Latest,true,p.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.JS);
    const spec=(value:string):void=>{
      if(value.startsWith('.')){
        const target=relative(root,resolve(root,dirname(p),value));
        if(isHistoricalPath(target)||target.startsWith('ground-core/injections/'))throw new Error('CURRENT_RUNTIME_IMPORTS_HISTORICAL: '+p);
      }else if(value.includes('ground-core/injections'))throw new Error('CURRENT_RUNTIME_IMPORTS_HISTORICAL: '+p);
    };
    const visit=(n:ts.Node):void=>{
      if((ts.isImportDeclaration(n)||ts.isExportDeclaration(n))&&n.moduleSpecifier&&ts.isStringLiteral(n.moduleSpecifier))spec(n.moduleSpecifier.text);
      if(ts.isCallExpression(n)&&(n.expression.kind===ts.SyntaxKind.ImportKeyword||(ts.isIdentifier(n.expression)&&n.expression.text==='require'))){
        if(!n.arguments[0]||!ts.isStringLiteral(n.arguments[0]))throw new Error('CURRENT_RUNTIME_COMPUTED_IMPORT: '+p);
        spec(n.arguments[0].text);
      }
      ts.forEachChild(n,visit);
    };visit(source);
  };
  const scan=(dir:string):void=>{if(!existsSync(join(root,dir)))return;for(const e of readdirSync(join(root,dir),{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())scan(p);else if(/\.[cm]?[jt]sx?$/.test(p)&&!p.includes('.test.'))auditRuntime(p);}};
  auditRuntime('server.js');scan('src');scan('server');
  return {covered_files:count,current_files:files};
}
