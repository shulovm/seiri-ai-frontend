/** Test-only additive source approval. Historical snapshots and content contracts stay intact. */
import assert from 'node:assert/strict';import {readFileSync}from'node:fs';import {resolve}from'node:path';import {createHash}from'node:crypto';
const approvals=JSON.parse(readFileSync(new URL('./fixtures/nl-approved-source-hashes.json',import.meta.url),'utf8')).approved as {path:string,originalSHA256:string,originalBytes:number,approvedSHA256:string,approvedBytes:number}[];
export function expectedFrozenSource(f:{path:string,sha256:string,bytes?:number}):{sha256:string,bytes?:number}{
 const a=approvals.find(x=>x.path===f.path&&x.originalSHA256===f.sha256);if(!a)return {sha256:f.sha256,bytes:f.bytes};
 if(f.bytes!==undefined)assert.equal(f.bytes,a.originalBytes,'original baseline metadata must not drift');return {sha256:a.approvedSHA256,bytes:a.approvedBytes};
}
export function assertHistoricalSourceIntegrity(f:{path:string,sha256:string,bytes?:number}){const expected=expectedFrozenSource(f);const raw=readFileSync(resolve(f.path));assert.equal(createHash('sha256').update(raw).digest('hex'),expected.sha256,f.path);if(expected.bytes!==undefined)assert.equal(raw.length,expected.bytes,f.path);}
