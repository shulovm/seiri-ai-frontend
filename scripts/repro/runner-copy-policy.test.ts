import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, symlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
// JavaScript policy is also imported by the plain-Node runner.
// @ts-ignore No declaration artifact is needed for this local .mjs module.
import {createRunnerCopyPolicy} from './runner-copy-policy.mjs';
function fixture() {
  const root=mkdtempSync(join(tmpdir(),'ground-copy-policy-'));
  const source=join(root,'source');mkdirSync(source);
  const put=(p:string, value=p)=>{const parts=p.split('/');parts.pop();mkdirSync(join(source,...parts),{recursive:true});writeFileSync(join(source,p),value);};
  return {root,source,put,policy:createRunnerCopyPolicy(source)};
}
test('directory boundary excludes runtime and includes legitimate prefix source and tests',()=>{
 const x=fixture();
 for(const p of ['ground-core/storage/projects/a.json','ground-core/storage/nested/generated.tmp','ground-core/storage-owner.ts','ground-core/storage-extra/module.ts','ground-core/__tests__/storage-owner.test.ts','ground-core/file-store.ts','docs/fixture.json'])x.put(p);
 for(const p of ['ground-core/storage','ground-core/storage/projects/a.json','ground-core/storage/nested/generated.tmp'])assert.equal(x.policy(join(x.source,p)),false);
 for(const p of ['ground-core/storage-owner.ts','ground-core/storage-extra/module.ts','ground-core/__tests__/storage-owner.test.ts','ground-core/file-store.ts','docs/fixture.json'])assert.equal(x.policy(join(x.source,p)),true);
 const dest=join(x.root,'copy');cpSync(x.source,dest,{recursive:true,filter:x.policy});
 assert.equal(existsSync(join(dest,'ground-core/storage')),false);
 for(const p of ['ground-core/storage-owner.ts','ground-core/storage-extra/module.ts','ground-core/__tests__/storage-owner.test.ts','ground-core/file-store.ts','docs/fixture.json'])assert.deepEqual(readFileSync(join(dest,p)),readFileSync(join(x.source,p)));
});
test('outside, sibling prefix and relative paths fail closed; normalized in-root paths work',()=>{
 const x=fixture();x.put('ground-core/file.ts');
 for(const p of [join(x.source,'../outside'),x.source+'-sibling/file','ground-core/file.ts'])assert.throws(()=>x.policy(p),/absolute|escapes/);
 assert.equal(x.policy(join(x.source,'ground-core/../ground-core/file.ts')),true);
 assert.equal(x.policy(join(x.source,'ground-core/storage/../file.ts')),true);
});
test('source file and directory aliases fail closed without copying target bytes',()=>{
 const x=fixture();x.put('ground-core/storage/private.json','private-runtime');
 symlinkSync(join(x.source,'ground-core/storage'),join(x.source,'alias'));
 symlinkSync(join(x.source,'ground-core/storage/private.json'),join(x.source,'file-alias'));
 for(const p of ['alias','alias/private.json','file-alias'])assert.throws(()=>x.policy(join(x.source,p)),/symlink/);
 assert.throws(()=>cpSync(x.source,join(x.root,'copy'),{recursive:true,filter:x.policy}),/symlink/);
 assert.equal(readFileSync(join(x.source,'ground-core/storage/private.json'),'utf8'),'private-runtime');
});
test('excluded storage symlink and nested missing paths are never traversed',()=>{
 const x=fixture();mkdirSync(join(x.source,'ground-core'));symlinkSync(join(x.root,'absent'),join(x.source,'ground-core/storage'));
 assert.equal(x.policy(join(x.source,'ground-core/storage')),false);
 assert.equal(x.policy(join(x.source,'ground-core/storage/nested/missing')),false);
 const dest=join(x.root,'copy');cpSync(x.source,dest,{recursive:true,filter:x.policy});
 assert.deepEqual(readdirSync(join(dest,'ground-core')),[]);
});
test('aliased source root and ancestor are refused',()=>{
 const x=fixture();x.put('ground-core/file.ts');const alias=join(x.root,'alias');symlinkSync(x.source,alias);
 assert.throws(()=>createRunnerCopyPolicy(alias)(join(alias,'ground-core/file.ts')),/symlink/);
 symlinkSync(join(x.source,'ground-core'),join(x.source,'source-alias'));
 assert.throws(()=>x.policy(join(x.source,'source-alias/file.ts')),/symlink/);
});
