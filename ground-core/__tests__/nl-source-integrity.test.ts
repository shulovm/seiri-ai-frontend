import {it}from'node:test';import assert from'node:assert/strict';import {expectedFrozenSource}from'./historical-source-integrity.js';
it('core/schema/input paths have no approval exception',()=>{const f={path:'ground-core/types.ts',sha256:'original',bytes:100};assert.deepEqual(expectedFrozenSource(f),{sha256:'original',bytes:100});});
it('unknown baseline hash cannot use an approved replacement',()=>assert.equal(expectedFrozenSource({path:'ground-core/cli.ts',sha256:'mutated-baseline'}).sha256,'mutated-baseline'));
