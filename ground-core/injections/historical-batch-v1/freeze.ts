import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sha256,stableSerialize} from './package.js';
/** The hash manifest excludes itself and commit receipts to avoid self-referential hashes. */
export function verifyFreeze() {
 const manifest=JSON.parse(readFileSync(new URL('./package-fingerprint.json',import.meta.url),'utf8'));
 assert.equal(manifest.package_sha256,sha256(stableSerialize(manifest.files)));
 for(const [path,hash] of Object.entries(manifest.files))assert.equal(sha256(readFileSync(new URL(path,import.meta.url))),hash,`Package drift: ${path}`);
 return manifest.package_sha256 as string;
}
