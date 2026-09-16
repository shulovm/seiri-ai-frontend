import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stableSerialize,sha256 } from '../frus-1904-392/package.js';
/** No self-hash or commit cycle. Authorized commit is pinned externally at publish approval. */
export function verifyFreeze() {
 const manifest=JSON.parse(readFileSync(new URL('./package-fingerprint.json',import.meta.url),'utf8'));
 assert.equal(manifest.format,'live-005b-file-map-sha256-v1');
 assert.equal(manifest.package_sha256,sha256(stableSerialize(manifest.files)));
 for(const [path,hash] of Object.entries(manifest.files))assert.equal(sha256(readFileSync(new URL(path,import.meta.url))),hash,`Package drift: ${path}`);
 return manifest.package_sha256 as string;
}
