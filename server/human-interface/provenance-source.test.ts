import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createProvenanceRegistry, createProvenanceSourceResolver } from './provenance-source.js';
import { createHumanRealityReader } from './read-adapter.js';
import { createHumanSourceResolver } from './source-resolver.js';
import { realitySourceRegistry } from './source-registry.js';
const root = resolve('fixtures/human-interface/provenance/historical-round1-v1');
const original = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
const hash = (b: any) => createHash('sha256').update(b).digest('hex');
const code = (expected: string) => (e: any) => e.code === expected;
function copy(t: any) { const dir = mkdtempSync(join('/private/tmp', 'human008-')); cpSync(root, dir, { recursive: true }); t.after(() => rmSync(dir, { recursive: true, force: true })); return dir; }
function repin(dir: string, change: (m: any) => void) { const m = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8')); change(m); const bytes = JSON.stringify(m); writeFileSync(join(dir, 'manifest.json'), bytes); return hash(bytes); }
function entryRead(registry: any, b = original.bindings[0]) { return registry.read(b.project_id, b.entity_id, b.observation_id); }
test('16 unique explicit bindings; raw exact bytes and report/source identity; no whole dataset', () => {
    const r = createProvenanceRegistry();
    assert.equal(original.bindings.length, 16);
    assert.equal(new Set(original.bindings.map((b: any) => b.observation_id)).size, 16);
    for (const b of original.bindings) {
        const out = entryRead(r, b);
        assert.equal(out.input.claims.length, 1);
        assert.equal(out.input.claims[0].id, b.report_id);
        assert.equal(out.input.sources[0].id, b.source_id);
        assert.equal(hash(out.raw), out.inputHash);
        assert.equal(out.raw, readFileSync(join(root, b.selected_input), 'utf8'));
    }
});
test('duplicate Observation binding rejected at registry construction', t => { const dir = copy(t); const pin = repin(dir, m => m.bindings.push(m.bindings[0])); assert.throws(() => createProvenanceRegistry(dir, pin), code('PROVENANCE_BINDING_AMBIGUOUS')); });
test('missing metadata and invalid/path escape binding rejected', t => {
    for (const modify of [(m: any) => delete m.packages['392'].commit, (m: any) => delete m.bindings[0].expected_provenance, (m: any) => m.bindings[0].selected_input = '../receipt.json', (m: any) => m.files['../escape.json'] = m.files['392/receipt.json'], (m: any) => m.bindings[0].source_id = '']) {
        const dir = copy(t), pin = repin(dir, modify);
        assert.throws(() => createProvenanceRegistry(dir, pin), code('PROVENANCE_REGISTRY_INVALID'));
    }
});
test('symlink artifact, package directory and root rejected', t => {
    for (const target of ['392/selected-input.json', '392']) {
        const dir = copy(t), other = copy(t);
        rmSync(join(dir, target), { recursive: true });
        symlinkSync(join(other, target), join(dir, target));
        assert.throws(() => entryRead(createProvenanceRegistry(dir)), code('PROVENANCE_PATH_REJECTED'));
    }
    const dir = copy(t), alias = join(dir, 'alias');
    symlinkSync(root, alias);
    assert.throws(() => createProvenanceRegistry(alias), code('PROVENANCE_PATH_REJECTED'));
    assert.throws(() => createProvenanceRegistry('relative/root'), code('PROVENANCE_PATH_REJECTED'));
});
test('per-read hash checks reject changes after successful read; no cached fallback', t => {
    for (const [path, error] of [['392/selected-input.json', 'PROVENANCE_INPUT_INTEGRITY_FAILURE'], ['392/receipt.json', 'PROVENANCE_RECEIPT_INTEGRITY_FAILURE'], ['392/manifest.json', 'PROVENANCE_PACKAGE_INTEGRITY_FAILURE'], ['manifest.json', 'PROVENANCE_MANIFEST_INTEGRITY_FAILURE']]) {
        const dir = copy(t), r = createProvenanceRegistry(dir);
        entryRead(r);
        writeFileSync(join(dir, path), readFileSync(join(dir, path), 'utf8') + ' ');
        assert.throws(() => entryRead(r), code(error));
    }
});
test('missing registered artifact is unavailable; unexpected file never selected', t => { const dir = copy(t), r = createProvenanceRegistry(dir); writeFileSync(join(dir, 'untracked.json'), '{"secret":true}'); assert.ok(!entryRead(r).raw.includes('secret')); rmSync(join(dir, '392/selected-input.json')); assert.throws(() => entryRead(r), code('PROVENANCE_SOURCE_UNAVAILABLE')); });
test('package identity, selected hash and receipt semantic binding fail even under test-repinned metadata', t => {
    for (const [file, mutate, expected] of [
        ['392/receipt.json', (r: any) => r.status = 'PREPARED', 'PROVENANCE_RECEIPT_BINDING_MISMATCH'],
        ['392/receipt.json', (r: any) => r.generated_ids.observation = 'other', 'PROVENANCE_RECEIPT_BINDING_MISMATCH'],
        ['392/manifest.json', (r: any) => r.selected_input_sha256 = '0'.repeat(64), 'PROVENANCE_PACKAGE_BINDING_MISMATCH'],
        ['392/selected-input.json', (r: any) => r.claims[0].id = 'other', 'PROVENANCE_RECEIPT_BINDING_MISMATCH'],
    ] as const) {
        const dir = copy(t), v = JSON.parse(readFileSync(join(dir, file), 'utf8'));
        mutate(v);
        const bytes = JSON.stringify(v);
        writeFileSync(join(dir, file), bytes);
        const pin = repin(dir, m => m.files[file].sha256 = hash(bytes));
        assert.throws(() => entryRead(createProvenanceRegistry(dir, pin)), code(expected));
    }
    const dir = copy(t), pin = repin(dir, m => m.packages['392'].commit = '0'.repeat(40));
    assert.throws(() => createProvenanceRegistry(dir, pin), code('PROVENANCE_REGISTRY_INVALID'));
});
test('proof B15 unsupported does not affect canonical reads; unknown Observation fails scope', () => {
    const reader = createHumanRealityReader(realitySourceRegistry), s = realitySourceRegistry.sources[1], r = reader(s.project_id, s.entity_id), before = JSON.stringify(r);
    const resolveSource = createProvenanceSourceResolver({ readEntity: reader });
    assert.throws(() => resolveSource(s.project_id, s.entity_id, r.canonical_records.observations[0].id, r.transport.source.snapshot_fingerprint), code('PROVENANCE_SOURCE_UNSUPPORTED'));
    assert.throws(() => resolveSource(s.project_id, s.entity_id, 'unknown', r.transport.source.snapshot_fingerprint), code('OBSERVATION_NOT_IN_SCOPE'));
    assert.equal(JSON.stringify(reader(s.project_id, s.entity_id)), before);
});
test('snapshot precondition is required/strict; mismatch has only one read', () => {
    let reads = 0;
    const b = original.bindings[0];
    const r = createProvenanceSourceResolver({ readEntity: () => { reads++; return { transport: { source: { snapshot_fingerprint: 'a'.repeat(64) } } } as any; } });
    assert.throws(() => r(b.project_id, b.entity_id, b.observation_id, undefined), code('SNAPSHOT_PRECONDITION_REQUIRED'));
    assert.throws(() => r(b.project_id, b.entity_id, b.observation_id, '../file'), code('SNAPSHOT_PRECONDITION_INVALID'));
    assert.equal(reads, 0);
    assert.throws(() => r(b.project_id, b.entity_id, b.observation_id, 'b'.repeat(64)), code('SNAPSHOT_MISMATCH'));
    assert.equal(reads, 1);
});
test('actual live all 16; one read per resolution; input/output separation and mutations rejected', { skip: !process.env.GROUND_RUNTIME_CONFIG }, () => {
    const reader = createHumanRealityReader(createHumanSourceResolver({ runtimeConfigPath: process.env.GROUND_RUNTIME_CONFIG }));
    let reads = 0;
    const r = createProvenanceSourceResolver({ readEntity: (p, e) => { reads++; return reader(p, e); } });
    const expected = '9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf';
    const inputs = new Set();
    for (const b of original.bindings) {
        const before = reads, out = r(b.project_id, b.entity_id, b.observation_id, expected);
        assert.equal(reads, before + 1);
        assert.equal(out.frozen_selected_input.report.id, b.report_id);
        assert.equal(out.transport.project_snapshot_fingerprint, expected);
        assert.ok(!('content' in out.canonical_binding_context));
        inputs.add(out.transport.selected_input_fingerprint);
        assert.equal(out.frozen_selected_input.source.url, JSON.parse(out.raw_selected_input).sources[0].url);
    }
    assert.equal(inputs.size, 16);
    const b = original.bindings[0];
    for (const [mutate, error] of [
        [(o: any) => o.content += ' changed', 'OBSERVATION_BINDING_MISMATCH'],
        [(o: any) => o.provenance.entity_id = null, 'PROVENANCE_BINDING_MISMATCH'],
        [(o: any) => o.provenance.label = 'other', 'PROVENANCE_BINDING_MISMATCH'],
        [(o: any) => o.provenance.external_id = '../escape', 'PROVENANCE_BINDING_MISMATCH'],
    ] as const) {
        const response = structuredClone(reader(b.project_id, b.entity_id));
        mutate(response.canonical_records.observations[0]);
        const changed = createProvenanceSourceResolver({ readEntity: () => response });
        assert.throws(() => changed(b.project_id, b.entity_id, b.observation_id, expected), code(error));
    }
});
test('resolver success needs no fetch/network and does not alter bundle or input response', () => {
    const r = createProvenanceRegistry(), b = original.bindings[0], before = readFileSync(join(root, b.selected_input));
    const previous = globalThis.fetch;
    globalThis.fetch = (() => { throw new Error('Network forbidden'); }) as any;
    try {
        const out = entryRead(r, b);
        assert.equal(out.input.claims[0].id, b.report_id);
        assert.deepEqual(readFileSync(join(root, b.selected_input)), before);
    }
    finally {
        globalThis.fetch = previous;
    }
});
test('batch receipts require final completion and current published record hashes, never UNBOUND prepared values', t => {
    for (const key of ['004', '005']) {
        const dir = copy(t), file = key + '/receipt.json', receipt = JSON.parse(readFileSync(join(dir, file), 'utf8'));
        const b = original.bindings.find((x: any) => x.package_key === key);
        if (key === '004')
            receipt.record_hashes[b.observation_id] = 'UNBOUND';
        else
            receipt.package_completion.record_hashes[b.observation_id] = 'UNBOUND';
        const bytes = JSON.stringify(receipt);
        writeFileSync(join(dir, file), bytes);
        const pin = repin(dir, m => m.files[file].sha256 = hash(bytes));
        assert.throws(() => entryRead(createProvenanceRegistry(dir, pin), b), code('PROVENANCE_RECEIPT_BINDING_MISMATCH'));
    }
});
