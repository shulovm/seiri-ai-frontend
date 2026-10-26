import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, realpathSync, existsSync } from 'node:fs';
import { isAbsolute, resolve, relative, dirname, basename, join } from 'node:path';
import { BASELINE, sha256 } from './package.js';
function physical(path: string): string {
 if(existsSync(path))return realpathSync(path);
 const parent=dirname(path);assert.notEqual(parent,path);return join(physical(parent),basename(path));
}
function outside(root: string, dir: string) {
 const r=relative(root,dir);assert(r==='..'||r.startsWith('../'),'Operations must be outside canonical discovery');
}
/** Exact bytes backup only, no restore/save/owner acquisition. Future caller must hold owner session. */
export function backup(bytes: Buffer, operationsDir: string, liveRoot: string) {
 assert(isAbsolute(operationsDir)&&isAbsolute(liveRoot));assert.equal(sha256(bytes),BASELINE);
 const root=physical(resolve(liveRoot)),dir=physical(resolve(operationsDir));outside(root,dir);
 mkdirSync(dir,{recursive:true});outside(realpathSync(root),realpathSync(dir));
 const path=join(dir,'before-project-state.bytes');writeFileSync(path,bytes,{flag:'wx',mode:0o400});assert.equal(sha256(readFileSync(path)),BASELINE);return path;
}
