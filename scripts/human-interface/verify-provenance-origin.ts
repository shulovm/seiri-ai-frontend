/** Build/review-time origin verification only. Runtime resolver never invokes Git. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createProvenanceRegistry } from '../../server/human-interface/provenance-source.js';
const root = fileURLToPath(new URL('../../', import.meta.url));
const bundle = new URL('../../fixtures/human-interface/provenance/historical-round1-v1/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', bundle), 'utf8'));
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
let gitFiles = 0, receipts = 0;
for (const [path, pin] of Object.entries(manifest.files) as [
    string,
    any
][]) {
    const bytes = readFileSync(new URL(path, bundle));
    assert.equal(sha(bytes), pin.sha256);
    if (pin.origin.kind === 'git') {
        const spec = `${pin.origin.commit}:${pin.origin.path}`;
        assert.deepEqual(bytes, execFileSync('git', ['-C', root, 'show', spec]));
        assert.equal(execFileSync('git', ['-C', root, 'rev-parse', spec], { encoding: 'utf8' }).trim(), pin.origin.blob);
        gitFiles++;
    }
    else {
        // Optional audit of original operations receipt, never a runtime dependency.
        if (process.env.GROUND_OPERATIONS_ROOT) {
            const original = readFileSync(`${process.env.GROUND_OPERATIONS_ROOT}/${pin.origin.identity}/receipt.json`);
            assert.deepEqual(bytes, original);
        }
        receipts++;
    }
}
for (const p of Object.values(manifest.packages) as any[]) {
    const dataset = execFileSync('git', ['-C', root, 'show', `${p.commit}:ground-core/experimental/historical-reality/round1.dataset.json`]);
    assert.equal(sha(dataset), p.dataset_sha256);
}
const registry = createProvenanceRegistry();
for (const b of manifest.bindings)
    registry.read(b.project_id, b.entity_id, b.observation_id);
console.log(JSON.stringify({ git_blob_artifacts_verified: gitFiles, completed_receipts: receipts, original_receipts_checked: Boolean(process.env.GROUND_OPERATIONS_ROOT), bindings_verified: manifest.bindings.length }));
